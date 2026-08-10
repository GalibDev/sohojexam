import { MobileBottomNav } from "./mobile-bottom-nav";
import { MobileHeader } from "./mobile-header";
import { MobileSubjectCard } from "./mobile-subject-card";
import { mobileSubjects } from "./mobile-data";

export function MobilePapers() {
  return <div className="mobile-papers-screen">
    <MobileHeader title="Question Papers"/>
    <label className="mobile-semester-select"><select aria-label="Semester"><option>Semester 6</option><option>2nd Year 1st Semester</option></select></label>
    <div className="mobile-year-tabs">{[2023,2022,2021,2020].map(year=><button className={year===2023?"active":""} key={year}>{year}</button>)}</div>
    <div className="mobile-paper-subjects">{mobileSubjects.map(subject=><MobileSubjectCard detailed key={subject.code} subject={subject}/>)}</div>
    <MobileBottomNav active="Papers"/>
  </div>;
}