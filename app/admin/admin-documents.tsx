"use client";
import { useEffect, useRef, useState } from "react";

type DocumentRow={id:number;originalName:string;mimeType:string;fileSize:number;subject:string;year:number|null;examType:string;status:string;extractedText:string;error?:string;createdAt:string};

export default function AdminDocuments(){
  const[documents,setDocuments]=useState<DocumentRow[]>([]);
  const[selected,setSelected]=useState<DocumentRow|null>(null);
  const[busy,setBusy]=useState(false);
  const[notice,setNotice]=useState("");
  const[fileName,setFileName]=useState("");
  const fileRef=useRef<HTMLInputElement>(null);
  async function load(){const response=await fetch("/api/admin/documents");const data=await response.json();setDocuments(data.documents||[])}
  useEffect(()=>{load()},[]);
  async function upload(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();setBusy(true);setNotice("Uploading and scanning...");
    const response=await fetch("/api/admin/documents",{method:"POST",body:new FormData(event.currentTarget)});
    const data=await response.json();setBusy(false);setNotice(response.ok?"OCR scan completed":data.error||"Upload failed");
    if(response.ok){event.currentTarget.reset();setFileName("");await load()}setTimeout(()=>setNotice(""),4000);
  }
  async function save(){
    if(!selected)return;setBusy(true);
    const response=await fetch("/api/admin/documents",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(selected)});
    setBusy(false);setNotice(response.ok?"Document saved":"Save failed");if(response.ok){await load();setSelected(null)}
  }
  async function remove(row:DocumentRow){
    if(!confirm(`Delete ${row.originalName}? This cannot be undone.`))return;
    const response=await fetch(`/api/admin/documents?id=${row.id}`,{method:"DELETE"});
    setNotice(response.ok?"Document deleted":"Delete failed");if(response.ok)await load();
  }
  return <div className="ocr-admin">
    <form className="ocr-upload-card" onSubmit={upload}>
      <div><span>OCR UPLOAD</span><h2>Scan a new question paper</h2><p>Upload PDF, JPG or PNG. The paper will be converted into editable text automatically.</p></div>
      <button className="ocr-drop" type="button" onClick={()=>fileRef.current?.click()}><b>{fileName||"Choose question paper"}</b><small>PDF, JPG or PNG / maximum 20 MB</small></button>
      <input ref={fileRef} name="file" type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" required onChange={e=>setFileName(e.target.files?.[0]?.name||"")}/>
      <div className="ocr-fields"><label>Subject<input name="subject" placeholder="Data Structure and Algorithm" required/></label><label>Year<input name="year" type="number" min="2000" max="2100" required/></label><label>Exam type<select name="examType"><option>Final</option><option>Midterm</option><option>In-course 1</option><option>In-course 2</option></select></label></div>
      <button className="ocr-submit" disabled={busy}>{busy?"Scanning with OCR...":"Upload and scan"}</button>
    </form>
    <section className="ocr-library"><header><div><span>CONTENT LIBRARY</span><h2>Uploaded question papers</h2></div><b>{documents.length} files</b></header>
      {documents.length===0?<div className="ocr-empty"><b>No uploads yet</b><p>Your scanned papers will appear here.</p></div>:documents.map(row=><article key={row.id}>
        <span className={"ocr-file-icon "+row.mimeType.split("/")[1]}>{row.mimeType==="application/pdf"?"PDF":"IMG"}</span>
        <div><b>{row.originalName}</b><small>{row.subject||"No subject"} / {row.year||"No year"} / {(row.fileSize/1024/1024).toFixed(1)} MB</small><em className={row.status}>{row.status}{row.error?`: ${row.error}`:""}</em></div>
        <button onClick={()=>setSelected(row)}>Edit</button><button className="danger" onClick={()=>remove(row)}>Delete</button>
      </article>)}
    </section>
    {selected&&<div className="ocr-editor-backdrop" role="dialog" aria-modal="true"><div className="ocr-editor"><header><div><span>OCR TEXT EDITOR</span><h2>{selected.originalName}</h2></div><button onClick={()=>setSelected(null)} aria-label="Close editor">x</button></header><div className="ocr-fields"><label>Subject<input value={selected.subject} onChange={e=>setSelected({...selected,subject:e.target.value})}/></label><label>Year<input type="number" value={selected.year||""} onChange={e=>setSelected({...selected,year:Number(e.target.value)||null})}/></label><label>Status<select value={selected.status} onChange={e=>setSelected({...selected,status:e.target.value})}><option value="ready">Ready</option><option value="published">Published</option><option value="failed">Failed</option></select></label></div><label className="ocr-textarea">Extracted question text<textarea value={selected.extractedText} onChange={e=>setSelected({...selected,extractedText:e.target.value})} spellCheck/></label><footer><button onClick={()=>setSelected(null)}>Cancel</button><button className="primary" disabled={busy} onClick={save}>Save changes</button></footer></div></div>}
    {notice&&<div className="toast">{notice}</div>}
  </div>;
}
