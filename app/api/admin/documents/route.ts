import { env } from "cloudflare:workers";
import { getChatGPTUser } from "../../../chatgpt-auth";

type Bucket={put(key:string,value:ArrayBuffer,options?:unknown):Promise<unknown>;delete(key:string):Promise<void>};
type AdminEnv=typeof env&{OPENAI_API_KEY?:string;OPENAI_OCR_MODEL?:string;UPLOADS:Bucket};
const runtime=env as AdminEnv;
const allowed=new Set(["application/pdf","image/jpeg","image/png"]);
const maxBytes=20*1024*1024;

async function guard(){
  const identity=await getChatGPTUser();
  if(!identity)return null;
  const row=await env.DB.prepare("SELECT role FROM users WHERE id=?").bind(identity.userId).first<{role:string}>();
  return row?.role==="admin"?identity:null;
}
async function ensureTable(){
  await env.DB.batch([
    env.DB.prepare("CREATE TABLE IF NOT EXISTS ocr_documents (id INTEGER PRIMARY KEY AUTOINCREMENT,owner_id TEXT NOT NULL,file_key TEXT NOT NULL UNIQUE,original_name TEXT NOT NULL,mime_type TEXT NOT NULL,file_size INTEGER NOT NULL,subject TEXT NOT NULL DEFAULT '',year INTEGER,exam_type TEXT NOT NULL DEFAULT 'Final',status TEXT NOT NULL DEFAULT 'processing',extracted_text TEXT NOT NULL DEFAULT '',error TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)"),
    env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_ocr_documents_status_created ON ocr_documents(status,created_at)")
  ]);
}
function outputText(payload:any){
  if(typeof payload.output_text==="string")return payload.output_text;
  return (payload.output||[]).flatMap((item:any)=>item.content||[]).map((item:any)=>item.text||"").join("\n").trim();
}
function toBase64(bytes:ArrayBuffer){
  const view=new Uint8Array(bytes);let binary="";
  for(let i=0;i<view.length;i+=0x8000)binary+=String.fromCharCode(...view.subarray(i,i+0x8000));
  return btoa(binary);
}
async function runOcr(file:File,bytes:ArrayBuffer){
  if(!runtime.OPENAI_API_KEY)throw new Error("OPENAI_API_KEY is not configured");
  const media=`data:${file.type};base64,${toBase64(bytes)}`;
  const attachment=file.type==="application/pdf"
    ?{type:"input_file",filename:file.name,file_data:media}
    :{type:"input_image",image_url:media,detail:"high"};
  const response=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Authorization":`Bearer ${runtime.OPENAI_API_KEY}`,"Content-Type":"application/json"},body:JSON.stringify({
    model:runtime.OPENAI_OCR_MODEL||"gpt-4.1-mini",
    input:[{role:"user",content:[{type:"input_text",text:"Transcribe this university exam question paper exactly. Preserve page breaks with [PAGE N], question numbers, subquestions, marks, headings, mathematical notation and code. Return plain text only. Do not answer or summarize the questions."},attachment]}],
    max_output_tokens:16000
  })});
  const payload=await response.json() as any;
  if(!response.ok)throw new Error(payload?.error?.message||"OCR request failed");
  const text=outputText(payload);
  if(!text)throw new Error("OCR returned no text");
  return text;
}
export async function GET(){
  if(!await guard())return Response.json({error:"Admin required"},{status:403});
  await ensureTable();
  const rows=await env.DB.prepare("SELECT id,original_name originalName,mime_type mimeType,file_size fileSize,subject,year,exam_type examType,status,extracted_text extractedText,error,created_at createdAt,updated_at updatedAt FROM ocr_documents ORDER BY created_at DESC").all();
  return Response.json({documents:rows.results});
}
export async function POST(request:Request){
  const actor=await guard();if(!actor)return Response.json({error:"Admin required"},{status:403});
  await ensureTable();
  const form=await request.formData(),file=form.get("file");
  if(!(file instanceof File))return Response.json({error:"Choose a PDF, JPG or PNG file"},{status:400});
  if(!allowed.has(file.type))return Response.json({error:"Only PDF, JPG and PNG files are supported"},{status:415});
  if(file.size>maxBytes)return Response.json({error:"File must be 20 MB or smaller"},{status:413});
  const bytes=await file.arrayBuffer(),key=`admin-ocr/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g,"-")}`;
  await runtime.UPLOADS.put(key,bytes,{httpMetadata:{contentType:file.type}});
  const row=await env.DB.prepare("INSERT INTO ocr_documents(owner_id,file_key,original_name,mime_type,file_size,subject,year,exam_type,status) VALUES(?,?,?,?,?,?,?,?,?) RETURNING id").bind(actor.userId,key,file.name,file.type,file.size,String(form.get("subject")||""),Number(form.get("year"))||null,String(form.get("examType")||"Final"),"processing").first<{id:number}>();
  try{
    const text=await runOcr(file,bytes);
    await env.DB.prepare("UPDATE ocr_documents SET extracted_text=?,status='ready',updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(text,row!.id).run();
    return Response.json({id:row!.id,status:"ready",extractedText:text},{status:201});
  }catch(error){
    const message=error instanceof Error?error.message:"OCR failed";
    await env.DB.prepare("UPDATE ocr_documents SET status='failed',error=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(message,row!.id).run();
    return Response.json({id:row!.id,status:"failed",error:message},{status:502});
  }
}
export async function PATCH(request:Request){
  if(!await guard())return Response.json({error:"Admin required"},{status:403});
  await ensureTable();
  const body=await request.json() as {id?:number;subject?:string;year?:number|null;examType?:string;status?:string;extractedText?:string};
  if(!body.id)return Response.json({error:"Document ID required"},{status:400});
  const status=["ready","published","failed"].includes(String(body.status))?String(body.status):"ready";
  await env.DB.prepare("UPDATE ocr_documents SET subject=?,year=?,exam_type=?,status=?,extracted_text=?,error=NULL,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(String(body.subject||""),body.year||null,String(body.examType||"Final"),status,String(body.extractedText||""),body.id).run();
  return Response.json({updated:true});
}
export async function DELETE(request:Request){
  if(!await guard())return Response.json({error:"Admin required"},{status:403});
  await ensureTable();
  const id=Number(new URL(request.url).searchParams.get("id"));
  const row=await env.DB.prepare("SELECT file_key fileKey FROM ocr_documents WHERE id=?").bind(id).first<{fileKey:string}>();
  if(!row)return Response.json({error:"Document not found"},{status:404});
  await runtime.UPLOADS.delete(row.fileKey);
  await env.DB.prepare("DELETE FROM ocr_documents WHERE id=?").bind(id).run();
  return Response.json({deleted:true});
}
