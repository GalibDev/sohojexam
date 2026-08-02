import { eq, sql } from "drizzle-orm";
import { getDb } from "../../db";
import { bookmarks, preparation, questions, subjects, users } from "../../db/schema";
import { chatGPTSignOutPath, requireChatGPTUser } from "../chatgpt-auth";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const identity = await requireChatGPTUser("/dashboard");
  const db=getDb();
  await db.insert(users).values({id:identity.userId,email:identity.email,name:identity.fullName}).onConflictDoUpdate({target:users.id,set:{email:identity.email,name:identity.fullName}});
  const [saved,completed,recent]=await Promise.all([
    db.select({count:sql<number>`count(*)`}).from(bookmarks).where(eq(bookmarks.userId,identity.userId)),
    db.select({count:sql<number>`count(*)`}).from(preparation).where(sql`${preparation.userId}=${identity.userId} AND ${preparation.status}='completed'`),
    db.select({id:questions.id,text:questions.text,subject:subjects.name,score:questions.importanceScore}).from(questions).innerJoin(subjects,eq(questions.subjectId,subjects.id)).orderBy(sql`${questions.importanceScore} DESC`).limit(4)
  ]);
  return <main className="student-dash"><aside><a href="/" className="brand"><span className="brand-mark">S</span><span>Sohoj<span>Exam</span></span></a><nav><a className="active" href="/dashboard">⌂ Overview</a><a href="/questions">⌕ Question Bank</a><a href="/questions?importance=90">✦ Exam Mode</a><a href="/dashboard">♡ Bookmarks</a><a href="/dashboard">✓ Progress</a></nav><a className="signout" href={chatGPTSignOutPath("/")}>Sign out</a></aside><section><header><div><small>STUDENT WORKSPACE</small><h1>Welcome back, {identity.displayName.split(" ")[0]}</h1><p>Stay focused—your next exam is getting closer.</p></div><span className="dash-avatar">{identity.displayName.slice(0,2).toUpperCase()}</span></header><div className="dash-stats"><article><span>♡</span><div><b>{saved[0]?.count??0}</b><small>Saved questions</small></div></article><article><span>✓</span><div><b>{completed[0]?.count??0}</b><small>Completed</small></div></article><article><span>↗</span><div><b>55%</b><small>Preparation</small></div></article><article><span>◷</span><div><b>18</b><small>Days remaining</small></div></article></div><div className="dashboard-grid"><article className="next-exam"><span>NEXT EXAM</span><h2>Data Structures Final</h2><p>20 August 2026 · 18 days remaining</p><div><i style={{width:"55%"}}/></div><small>22 of 40 questions completed</small><a href="/questions?subject=1">Continue preparation →</a></article><article className="daily-goal"><span>DAILY GOAL</span><div className="goal-ring"><b>3/5</b><small>questions</small></div><p>Two more questions to hit today&apos;s target.</p></article></div><div className="recommended"><div><h2>Recommended for you</h2><a href="/questions">View all →</a></div>{recent.map((x,i)=><a href={`/questions?q=${encodeURIComponent(x.text.slice(0,20))}`} key={x.id}><span>0{i+1}</span><p><b>{x.text}</b><small>{x.subject}</small></p><strong>{x.score}</strong></a>)}</div></section></main>
}
