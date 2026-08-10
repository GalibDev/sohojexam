"use client";
import { useMemo, useRef, useState } from "react";
import paperText from "../../../data/paper-text.json";
import type { StaticPaper } from "../../../lib/paper-catalog";

type OcrLine={text:string;score:number};

export default function PaperViewer({paper}:{paper:StaticPaper}) {
  const shell=useRef<HTMLElement>(null);
  const [copied,setCopied]=useState(false);
  const pages=(paperText as Record<string,OcrLine[][]>)[paper.slug]??[];
  const plainText=useMemo(()=>pages.map((page,index)=>`Page ${index+1}\n`+page.map(line=>line.text).join("\n")).join("\n\n"),[pages]);
  async function copyPaper(){await navigator.clipboard.writeText(plainText);setCopied(true);setTimeout(()=>setCopied(false),1800)}
  return <main className="text-paper-viewer" ref={shell}>
    <header><a href="/explore" aria-label="Back to question papers">&larr;</a><div><h1>{paper.examType} - {paper.year}</h1><p>{paper.subject} / {paper.code}</p></div><button onClick={copyPaper}>{copied?"Copied":"Copy text"}</button></header>
    <nav><span>{pages.length} {pages.length===1?"page":"pages"} / OCR text edition</span><div><button onClick={()=>window.print()}>Print</button><button onClick={()=>shell.current?.requestFullscreen()}>Fullscreen</button></div></nav>
    <section className="text-paper-pages">{pages.map((page,pageIndex)=><article key={pageIndex}><div className="text-paper-page-label">Page {pageIndex+1}</div>{page.map((line,lineIndex)=><p className={/^(0?\d+[.)]?|[a-zA-Z][.)])$/.test(line.text)?"question-marker":""} key={lineIndex}>{line.text}</p>)}</article>)}</section>
  </main>;
}