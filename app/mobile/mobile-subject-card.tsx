import type { MobileSubject } from "./mobile-data";

export function MobileSubjectCard({ subject, detailed = false }: { subject: MobileSubject; detailed?: boolean }) {
  const icon = subject.accent === "purple" ? "</>" : subject.accent === "orange" ? "●" : "∑";
  return <a className={"mobile-subject-card " + subject.accent + (detailed ? " detailed" : "")} href={"/explore?subject=" + encodeURIComponent(subject.code)}>
    <span className="mobile-subject-code">{icon}</span>
    <span><b>{subject.title}</b><small>{detailed ? "Final - 2023" : ""}</small></span>
    <strong aria-hidden="true">›</strong>
  </a>;
}