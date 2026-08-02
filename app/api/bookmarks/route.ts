import { and, desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { bookmarks, questions, subjects, users } from "../../../db/schema";
import { getChatGPTUser } from "../../chatgpt-auth";

async function identity() {
  const user = await getChatGPTUser();
  if (!user) return null;
  await getDb().insert(users).values({ id: user.userId, email: user.email, name: user.fullName }).onConflictDoNothing();
  return user;
}

export async function GET() {
  const user = await identity();
  if (!user) return Response.json({ error: "Sign in required" }, { status: 401 });
  const rows = await getDb().select({ questionId: bookmarks.questionId, folder: bookmarks.folder, createdAt: bookmarks.createdAt, text: questions.text, subject: subjects.name }).from(bookmarks).innerJoin(questions, eq(bookmarks.questionId, questions.id)).innerJoin(subjects, eq(questions.subjectId, subjects.id)).where(eq(bookmarks.userId, user.userId)).orderBy(desc(bookmarks.createdAt));
  return Response.json({ bookmarks: rows });
}

export async function POST(request: Request) {
  const user = await identity();
  if (!user) return Response.json({ error: "Sign in required" }, { status: 401 });
  const payload = await request.json() as { questionId?: number; folder?: string };
  if (!payload.questionId) return Response.json({ error: "questionId is required" }, { status: 400 });
  await getDb().insert(bookmarks).values({ userId: user.userId, questionId: payload.questionId, folder: payload.folder?.trim() || "Must Study" }).onConflictDoUpdate({ target: [bookmarks.userId, bookmarks.questionId], set: { folder: payload.folder?.trim() || "Must Study" } });
  return Response.json({ saved: true });
}

export async function DELETE(request: Request) {
  const user = await identity();
  if (!user) return Response.json({ error: "Sign in required" }, { status: 401 });
  const questionId = Number(new URL(request.url).searchParams.get("questionId"));
  await getDb().delete(bookmarks).where(and(eq(bookmarks.userId, user.userId), eq(bookmarks.questionId, questionId)));
  return Response.json({ saved: false });
}
