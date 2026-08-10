import type { MobileSubject } from "./mobile-data";

export function MobileSubjectCard({ subject, detailed = false }: { subject: MobileSubject; detailed?: boolean }) {
  const icon = subject.accent === "purple" ? "</>" : subject.accent === "orange" ? "●" : "∑";
  const paperSlugs: Record<string,string> = { "CSE-301": "cse-301-oop-2023", "CSE-401": "cse-401-dsa-2023", "MATH-401": "math-401-linear-algebra-2023" };
  const href = detailed ? "/papers/" + paperSlugs[subject.code] : "/explore?subject=" + encodeURIComponent(subject.code);
  return <a className={"mobile-subject-card " + subject.accent + (detailed ? " detailed" : "")} href={href}>
    <span className="mobile-subject-code">{icon}</span>
    <span><b>{subject.title}</b><small>{detailed ? "Final - 2023" : ""}</small></span>
    <strong aria-hidden="true">›</strong>
  </a>;
}