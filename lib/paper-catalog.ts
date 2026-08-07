export type StaticPaper = { slug:string; code:string; subject:string; title:string; year:number; examType:string; pages:number; asset:string };
export const staticPapers:StaticPaper[]=[
  {slug:"cse-301-oop-2020",code:"CSE-301",subject:"Object Oriented Programming Language",title:"Semester Final 2020",year:2020,examType:"Final",pages:2,asset:"/papers/cse-301-oop-2020.pdf"},
  {slug:"cse-303-data-structure-2020",code:"CSE-303",subject:"Data Structure",title:"Semester Final 2020",year:2020,examType:"Final",pages:2,asset:"/papers/cse-303-data-structure-2020.pdf"},
  {slug:"cse-401-dsa-2020",code:"CSE-401",subject:"Data Structure and Algorithm (DSA)",title:"Semester Final 2020",year:2020,examType:"Final",pages:1,asset:"/papers/cse-401-dsa-2020.pdf"},
  {slug:"math-401-linear-algebra-2020",code:"MATH-401",subject:"Linear Algebra",title:"Semester Final 2020",year:2020,examType:"Final",pages:1,asset:"/papers/math-401-linear-algebra-2020.pdf"},
  {slug:"eee-407-devices-instrumentation-2020",code:"EEE-407",subject:"Electrical Devices and Instrumentation",title:"Semester Final 2020",year:2020,examType:"Final",pages:1,asset:"/papers/eee-407-devices-instrumentation-2020.pdf"},
  {slug:"cse-403-digital-electronics-2020",code:"CSE-403",subject:"Digital Electronics & Pulse Technique",title:"Semester Final 2020",year:2020,examType:"Final",pages:1,asset:"/papers/cse-403-digital-electronics-2020.pdf"},
];
export function getStaticPaper(slug:string){return staticPapers.find(p=>p.slug===slug)}
