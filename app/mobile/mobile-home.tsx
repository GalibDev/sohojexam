import { MobileBottomNav } from "./mobile-bottom-nav";
import { MobileBrowseCard } from "./mobile-browse-card";
import { MobileHeader } from "./mobile-header";
import { MobileSearch } from "./mobile-search";
import { MobileSubjectCard } from "./mobile-subject-card";
import { mobileSubjects } from "./mobile-data";

export function MobileHome() {
  return <div className="mobile-app-home">
    <MobileHeader/>
    <section className="mobile-welcome"><h1>Hello, Sami!</h1><p>Ready to ace your exams?</p></section>
    <MobileSearch/>
    <MobileBrowseCard/>
    <section className="mobile-section-title"><h2>Recent Subjects</h2><a href="/explore">View all</a></section>
    <div className="mobile-subject-list">{mobileSubjects.map(subject => <MobileSubjectCard key={subject.code} subject={subject}/>)}</div>
    <MobileBottomNav/>
  </div>;
}