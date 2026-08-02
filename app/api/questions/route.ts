import { env } from "cloudflare:workers";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const search = (url.searchParams.get("q") ?? "").trim();
    const subject = Number(url.searchParams.get("subject") || 0);
    const year = Number(url.searchParams.get("year") || 0);
    const examType = (url.searchParams.get("examType") ?? "").trim();
    const college = Number(url.searchParams.get("college") || 0);
    const importance = Number(url.searchParams.get("importance") || 0);
    const limit = Math.min(Math.max(Number(url.searchParams.get("limit") || 30), 1), 100);
    const conditions: string[] = ["1=1"];
    const values: unknown[] = [];
    if (search) { conditions.push("(q.text LIKE ? OR t.name LIKE ? OR s.name LIKE ? OR s.code LIKE ?)"); const needle = `%${search}%`; values.push(needle, needle, needle, needle); }
    if (subject) { conditions.push("q.subject_id = ?"); values.push(subject); }
    if (importance) { conditions.push("q.importance_score >= ?"); values.push(importance); }
    if (year) { conditions.push("EXISTS (SELECT 1 FROM question_appearances fa WHERE fa.question_id=q.id AND fa.year=?)"); values.push(year); }
    if (examType) { conditions.push("EXISTS (SELECT 1 FROM question_appearances fa WHERE fa.question_id=q.id AND fa.exam_type=?)"); values.push(examType); }
    if (college) { conditions.push("EXISTS (SELECT 1 FROM question_appearances fa WHERE fa.question_id=q.id AND fa.college_id=?)"); values.push(college); }
    const sql = `SELECT q.id,q.text,q.easy_answer AS easyAnswer,q.exam_answer AS examAnswer,q.marks,q.importance_score AS importanceScore,s.id AS subjectId,s.name AS subject,s.code,t.name AS topic,COUNT(a.id) AS repeatCount,GROUP_CONCAT(DISTINCT a.year) AS years FROM questions q JOIN subjects s ON s.id=q.subject_id LEFT JOIN topics t ON t.id=q.topic_id LEFT JOIN question_appearances a ON a.question_id=q.id WHERE ${conditions.join(" AND ")} GROUP BY q.id ORDER BY q.importance_score DESC, repeatCount DESC LIMIT ?`;
    values.push(limit);
    const result = await env.DB.prepare(sql).bind(...values).all();
    return Response.json({ questions: result.results });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Questions unavailable" }, { status: 500 });
  }
}
