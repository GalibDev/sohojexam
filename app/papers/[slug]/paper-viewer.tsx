"use client";
import { useMemo, useRef, useState } from "react";
import paperText from "../../../data/paper-text.json";
import type { StaticPaper } from "../../../lib/paper-catalog";

type OcrLine={text:string;score:number};

function lineClass(text:string){
  if(/^\s*\[\s*\d+(?:\.\d+)?\s*\]\s*$/.test(text))return "exam-mark";
  if(/^\s*\d+\s*[.)][a-z]?\s*/i.test(text))return "exam-question";
  if(/^\s*[a-z]\s*[.)]\s*/i.test(text))return "exam-subquestion";
  if(/\b(import|public|private|class|void|System\.|printf|scanf|return|int main)\b/.test(text))return "exam-code";
  return "";
}

export default function PaperViewer({paper}:{paper:StaticPaper}) {
  const shell=useRef<HTMLElement>(null);
  const [copied,setCopied]=useState(false);
  const pages=(paperText as Record<string,OcrLine[][]>)[paper.slug]??[];
  const plainText=useMemo(()=>pages.map((page,index)=>`Page ${index+1}\n`+page.map(line=>line.text).join("\n")).join("\n\n"),[pages]);
  async function copyPaper(){await navigator.clipboard.writeText(plainText);setCopied(true);setTimeout(()=>setCopied(false),1800)}
  return <main className="text-paper-viewer" ref={shell}>
    <header><a href="/explore" aria-label="Back to question papers">&larr;</a><div><h1>{paper.examType} - {paper.year}</h1><p>{paper.subject} / {paper.code}</p></div><button onClick={copyPaper}>{copied?"Copied":"Copy text"}</button></header>
    <nav><span>{pages.length} {pages.length===1?"page":"pages"} / OCR text edition</span><div><button onClick={()=>window.print()}>Print</button><button onClick={()=>shell.current?.requestFullscreen()}>Fullscreen</button></div></nav>
    <section className="text-paper-pages">{pages.map((page,pageIndex)=>{
      const answerIndex=pageIndex===0?page.findIndex(line=>/answer\s*any/i.test(line.text)):-1;
      const headerEnd=answerIndex>=0?answerIndex:pageIndex===0?Math.min(7,page.length-1):-1;
      return <article key={pageIndex}>
        <div className="text-paper-page-label">Page {pageIndex+1}</div>
        {headerEnd>=0&&<div className="exam-paper-heading">{page.slice(0,headerEnd+1).map((line,index)=><p key={index}>{line.text}</p>)}</div>}
        <div className="exam-question-body">{page.slice(headerEnd+1).map((line,index)=><p className={lineClass(line.text)} key={index}>{line.text}</p>)}</div>
      </article>;
    })}</section>
  </main>;
}