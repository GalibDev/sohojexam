export type MobileSubject = {
  code: string;
  title: string;
  subtitle: string;
  accent: "purple" | "orange" | "teal";
};

export const mobileSubjects: MobileSubject[] = [
  { code: "CSE-301", title: "Object Oriented Programming", subtitle: "4 question papers", accent: "purple" },
  { code: "CSE-401", title: "Data Structure & Algorithm", subtitle: "4 question papers", accent: "orange" },
  { code: "MATH-401", title: "Linear Algebra", subtitle: "4 question papers", accent: "teal" },
];