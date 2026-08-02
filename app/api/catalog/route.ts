import { asc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { colleges, departments, semesters, subjects, topics } from "../../../db/schema";

export async function GET() {
  try {
    const db = getDb();
    const [departmentRows, semesterRows, subjectRows, collegeRows, topicRows] = await Promise.all([
      db.select().from(departments).orderBy(asc(departments.id)),
      db.select().from(semesters).orderBy(asc(semesters.position)),
      db.select().from(subjects).orderBy(asc(subjects.name)),
      db.select().from(colleges).orderBy(asc(colleges.name)),
      db.select().from(topics).orderBy(asc(topics.name)),
    ]);
    return Response.json({ departments: departmentRows, semesters: semesterRows, subjects: subjectRows, colleges: collegeRows, topics: topicRows, examTypes: ["In-course 1", "In-course 2", "Final", "Lab", "Viva"], years: [2026,2025,2024,2023,2022,2021,2020] });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Catalog unavailable" }, { status: 500 });
  }
}
