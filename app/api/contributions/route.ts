import { env } from "cloudflare:workers";
import { getDb } from "../../../db";
import { pdfFiles, pdfMappings, users } from "../../../db/schema";
import { getChatGPTUser } from "../../chatgpt-auth";

export async function POST(request: Request) {
  const user=await getChatGPTUser();
  if(!user) return Response.json({error:"Sign in required"},{status:401});
  const form=await request.formData();
  const file=form.get("file");
  const subjectId=Number(form.get("subjectId")), year=Number(form.get("year")), startPage=Number(form.get("startPage")||1), endPage=Number(form.get("endPage")||1);
  const examType=String(form.get("examType")||""); const collegeId=Number(form.get("collegeId")||0)||null;
  if(!(file instanceof File)||file.type!=="application/pdf"||file.size>20*1024*1024) return Response.json({error:"A PDF up to 20MB is required"},{status:400});
  if(!subjectId||!year||!examType||startPage<1||endPage<startPage) return Response.json({error:"Invalid question-paper details"},{status:400});
  const key=`contributions/${user.userId}/${crypto.randomUUID()}.pdf`;
  await env.UPLOADS.put(key,await file.arrayBuffer(),{httpMetadata:{contentType:file.type},customMetadata:{originalName:file.name}});
  const db=getDb(); await db.insert(users).values({id:user.userId,email:user.email,name:user.fullName}).onConflictDoNothing();
  const [pdf]=await db.insert(pdfFiles).values({ownerId:user.userId,fileKey:key,originalName:file.name}).returning();
  await db.insert(pdfMappings).values({pdfId:pdf.id,subjectId,year,examType,collegeId,startPage,endPage});
  return Response.json({submitted:true,id:pdf.id},{status:201});
}
