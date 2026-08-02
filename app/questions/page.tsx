import type { Metadata } from "next";
import QuestionExplorer from "./question-explorer";

export const metadata: Metadata = { title: "Question Bank — SohojExam", description: "Search and prepare from verified previous engineering questions." };

export default function QuestionsPage() { return <QuestionExplorer />; }
