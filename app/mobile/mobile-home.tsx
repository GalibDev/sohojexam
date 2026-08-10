import { MobileBottomNav } from "./mobile-bottom-nav";
import { MobileBrowseCard } from "./mobile-browse-card";
import { MobileHeader } from "./mobile-header";
import { MobileSearch } from "./mobile-search";
import { MobileSubjectCard } from "./mobile-subject-card";
import { mobileSubjects } from "./mobile-data";

export function MobileHome() {
  return <div className="mobile-app-home">
    <MobileHeader/>
    <section className="mobile-welcome"><p>Good morning, Student</p><h1>What will you study today?</h1></section>
    <MobileSearch/>
    <MobileBrowseCard/>
    <section className="mobile-section-title"><h2>Popular subjects</h2><a href="/explore">See all</a></section>
    <div className="mobile-subject-list">{mobileSubjects.map(subject => <MobileSubjectCard key={subject.code} subject={subject}/>)}</div>
    <section className="mobile-progress-card"><div><span>THIS WEEK</span><h2>Keep your preparation moving</h2><p>Review one paper today to continue your streak.</p></div><b>3<small>days</small></b></section>
    <MobileBottomNav/>
  </div>;
}