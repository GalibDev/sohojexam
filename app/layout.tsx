import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SohojExam — Prepare Smarter, Score Better",
  description: "Previous questions, repeated topics and smart exam preparation for engineering students in Bangladesh.",
  keywords: ["previous questions", "engineering exam", "CSE question bank", "Bangladesh", "mock test"],
  metadataBase: new URL("https://sohojexam-smart-prep.addisonbristollpenm.chatgpt.site"),
  openGraph: { title: "SohojExam — Prepare Smarter", description: "Previous questions, smart ranking and focused exam preparation.", type: "website" },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
