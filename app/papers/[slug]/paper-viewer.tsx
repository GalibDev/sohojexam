"use client";
import { useRef, useState } from "react";
import type { StaticPaper } from "../../../lib/paper-catalog";

export default function PaperViewer({paper}:{paper:StaticPaper}) {
  const [zoom,setZoom]=useState(90);
  const shell=useRef<HTMLElement>(null);
  const src=`${paper.asset}#toolbar=0&navpanes=0&scrollbar=1&zoom=${zoom}`;
  return <main className="own-pdf-viewer" ref={shell}>
    <header><a href="/explore" aria-label="Back to question papers">&larr;</a><div><h1>{paper.examType} - {paper.year}</h1><p>{paper.subject} / {paper.code}</p></div><a className="viewer-download" href={paper.asset} download aria-label="Download question paper">Download</a></header>
    <nav><span className="page-label">{paper.pages} {paper.pages===1?"page":"pages"}</span><div><button onClick={()=>setZoom(Math.max(50,zoom-10))} aria-label="Zoom out">-</button><b>{zoom}%</b><button onClick={()=>setZoom(Math.min(180,zoom+10))} aria-label="Zoom in">+</button></div><button onClick={()=>shell.current?.requestFullscreen()}>Fullscreen</button></nav>
    <section><iframe key={zoom} title={`${paper.subject} question paper`} src={src}/><div className="mobile-pdf-pages">{Array.from({length:paper.pages},(_,index)=><img key={index} src={`/paper-pages/${paper.slug}/page-${index+1}.jpg`} alt={`${paper.subject} question paper page ${index+1}`}/>)}</div></section>
    <footer><span>Verified question paper / 2nd Year 1st Semester</span><b>{paper.subject}</b></footer>
    <div className="mobile-page-count">1 / {paper.pages}</div>
  </main>;
}