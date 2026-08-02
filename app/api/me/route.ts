import { eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { users } from "../../../db/schema";
import { getChatGPTUser } from "../../chatgpt-auth";

export async function GET() {
  const identity = await getChatGPTUser();
  if (!identity) return Response.json({ user: null });
  const db = getDb();
  await db.insert(users).values({ id: identity.userId, email: identity.email, name: identity.fullName }).onConflictDoUpdate({ target: users.id, set: { email: identity.email, name: identity.fullName } });
  const [user] = await db.select().from(users).where(eq(users.id, identity.userId)).limit(1);
  return Response.json({ user });
}
