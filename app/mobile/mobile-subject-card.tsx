import type { MobileSubject } from "./mobile-data";

export function MobileSubjectCard({ subject }: { subject: MobileSubject }) {
  return <a className={"mobile-subject-card " + subject.accent} href={"/explore?subject=" + encodeURIComponent(subject.code)}>
    <span className="mobile-subject-code">{subject.code.replace("-", "")}</span>
    <span><b>{subject.title}</b><small>{subject.code} / {subject.subtitle}</small></span>
    <strong aria-hidden="true">&gt;</strong>
  </a>;
}