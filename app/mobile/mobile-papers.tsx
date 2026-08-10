"use client";
import { useState } from "react";
import { staticPapers } from "../../lib/paper-catalog";
import { MobileBottomNav } from "./mobile-bottom-nav";
import { MobileHeader } from "./mobile-header";

const paperIcon = (code: string) => code === "CSE-301" ? "</>" : code === "MATH-401" ? "∑" : code.startsWith("EEE") ? "⚡" : "●";

export function MobilePapers() {
  const [year, setYear] = useState(2023);
  const papers = staticPapers.filter(paper => paper.year === year);
  return <div className="mobile-papers-screen">
    <MobileHeader title="Question Papers"/>
    <label className="mobile-semester-select"><select aria-label="Semester"><option>2nd Year 1st Semester</option></select></label>
    <div className="mobile-year-tabs">{[2023,2022,2021,2020].map(item=><button className={item===year?"active":""} onClick={()=>setYear(item)} key={item}>{item}</button>)}</div>
    <div className="mobile-paper-subjects">{papers.map(paper=><a className={"mobile-subject-card detailed "+(paper.code==="CSE-301"?"purple":"")} href={"/papers/"+paper.slug} key={paper.slug}>
      <span className="mobile-subject-code">{paperIcon(paper.code)}</span>
      <span><b>{paper.subject.replace(" Language","").replace(" (DSA)","")}</b><small>Final - {paper.year}</small></span>
      <strong aria-hidden="true">›</strong>
    </a>)}</div>
    <MobileBottomNav active="Papers"/>
  </div>;
}