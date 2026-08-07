import { notFound } from "next/navigation";
import { getStaticPaper, staticPapers } from "../../../lib/paper-catalog";
import PaperViewer from "./paper-viewer";
export function generateStaticParams(){return staticPapers.map(p=>({slug:p.slug}))}
export default async function SubjectPaperPage({params}:{params:Promise<{slug:string}>}){const{slug}=await params;const paper=getStaticPaper(slug);if(!paper)notFound();return <PaperViewer paper={paper}/>}
