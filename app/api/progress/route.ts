import { and, eq, sql } from "drizzle-orm";
import { getDb } from "../../../db";
import { preparation, users } from "../../../db/schema";
import { getChatGPTUser } from "../../chatgpt-auth";

export async function GET() {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Sign in required" }, { status: 401 });
  const rows = await getDb().select({ status: preparation.status, count: sql<number>`count(*)` }).from(preparation).where(eq(preparation.userId, user.userId)).groupBy(preparation.status);
  return Response.json({ progress: rows });
}

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Sign in required" }, { status: 401 });
  await getDb().insert(users).values({ id: user.userId, email: user.email, name: user.fullName }).onConflictDoNothing();
  const payload = await request.json() as { questionId?: number; status?: "not_started"|"learning"|"completed"|"revision" };
  const allowed = ["not_started","learning","completed","revision"];
  if (!payload.questionId || !payload.status || !allowed.includes(payload.status)) return Response.json({ error: "Invalid progress update" }, { status: 400 });
  await getDb().insert(preparation).values({ userId: user.userId, questionId: payload.questionId, status: payload.status }).onConflictDoUpdate({ target: [preparation.userId, preparation.questionId], set: { status: payload.status, updatedAt: new Date().toISOString() } });
  return Response.json({ updated: true });
}
