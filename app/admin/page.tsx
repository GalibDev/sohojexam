import { eq } from "drizzle-orm";
import { getDb } from "../../db";
import { users } from "../../db/schema";
import { requireChatGPTUser } from "../chatgpt-auth";
import AdminQuestions from "./admin-questions";
export const dynamic="force-dynamic";
export default async function Admin(){const identity=await requireChatGPTUser("/admin");const[user]=await getDb().select().from(users).where(eq(users.id,identity.userId)).limit(1);if(user?.role!=="admin")return <main className="access-denied"><span>🔒</span><h1>Admin access required</h1><p>Your account is signed in, but it does not have an administrator role.</p><a href="/dashboard">Return to dashboard</a></main>;return <AdminQuestions/>}
