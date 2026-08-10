import type { Metadata } from "next";
import "./globals.css";
import "./papers.css";
import "./fixes.css";
import "./explore-card.css";
import "./mobile/mobile-base.css";
import "./mobile/mobile-home.css";
import "./mobile/mobile-nav.css";
import "./mobile/mobile-papers.css";
import "./mobile/mobile-viewer.css";
import "./text-paper.css";

export const metadata: Metadata = {
  title: "SohojExam — Prepare Smarter, Score Better",
  description: "Previous questions, repeated topics and smart exam preparation for engineering students in Bangladesh.",
  keywords: ["previous questions", "engineering exam", "CSE question bank", "Bangladesh", "mock test"],
  metadataBase: new URL("https://sohojexam-smart-prep.addisonbristollpenm.chatgpt.site"),
  openGraph: { title: "SohojExam — Prepare Smarter", description: "Previous questions, smart ranking and focused exam preparation.", type: "website" },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
