import { sql } from "drizzle-orm";
import { index, integer, primaryKey, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  name: text("name"),
  role: text("role", { enum: ["student", "contributor", "moderator", "admin"] }).notNull().default("student"),
  points: integer("points").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (t) => [uniqueIndex("idx_users_email").on(t.email)]);

export const departments = sqliteTable("departments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  code: text("code").notNull(),
  active: integer("active", { mode: "boolean" }).notNull().default(false),
}, (t) => [uniqueIndex("idx_departments_code").on(t.code)]);

export const semesters = sqliteTable("semesters", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  departmentId: integer("department_id").notNull().references(() => departments.id),
  name: text("name").notNull(),
  position: integer("position").notNull(),
}, (t) => [index("idx_semesters_department").on(t.departmentId)]);

export const subjects = sqliteTable("subjects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  semesterId: integer("semester_id").notNull().references(() => semesters.id),
  name: text("name").notNull(),
  code: text("code").notNull(),
  description: text("description").notNull().default(""),
}, (t) => [uniqueIndex("idx_subjects_code").on(t.code), index("idx_subjects_semester").on(t.semesterId)]);

export const colleges = sqliteTable("colleges", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  shortName: text("short_name").notNull(),
}, (t) => [uniqueIndex("idx_colleges_short_name").on(t.shortName)]);

export const topics = sqliteTable("topics", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  subjectId: integer("subject_id").notNull().references(() => subjects.id),
  name: text("name").notNull(),
}, (t) => [index("idx_topics_subject").on(t.subjectId)]);

export const questions = sqliteTable("questions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  subjectId: integer("subject_id").notNull().references(() => subjects.id),
  topicId: integer("topic_id").references(() => topics.id),
  text: text("text").notNull(),
  easyAnswer: text("easy_answer").notNull().default(""),
  examAnswer: text("exam_answer").notNull().default(""),
  marks: integer("marks").notNull().default(0),
  importanceScore: integer("importance_score").notNull().default(0),
  adminPriority: integer("admin_priority").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (t) => [index("idx_questions_subject_score").on(t.subjectId, t.importanceScore), index("idx_questions_topic").on(t.topicId)]);

export const questionAppearances = sqliteTable("question_appearances", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  questionId: integer("question_id").notNull().references(() => questions.id, { onDelete: "cascade" }),
  year: integer("year").notNull(),
  examType: text("exam_type").notNull(),
  collegeId: integer("college_id").references(() => colleges.id),
}, (t) => [index("idx_appearances_filter").on(t.year, t.examType, t.collegeId), index("idx_appearances_question").on(t.questionId)]);

export const bookmarks = sqliteTable("bookmarks", {
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  questionId: integer("question_id").notNull().references(() => questions.id, { onDelete: "cascade" }),
  folder: text("folder").notNull().default("Must Study"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (t) => [primaryKey({ columns: [t.userId, t.questionId] }), index("idx_bookmarks_user").on(t.userId)]);

export const preparation = sqliteTable("preparation", {
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  questionId: integer("question_id").notNull().references(() => questions.id, { onDelete: "cascade" }),
  status: text("status", { enum: ["not_started", "learning", "completed", "revision"] }).notNull().default("not_started"),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (t) => [primaryKey({ columns: [t.userId, t.questionId] }), index("idx_preparation_user_status").on(t.userId, t.status)]);

export const pdfFiles = sqliteTable("pdf_files", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ownerId: text("owner_id").notNull().references(() => users.id),
  fileKey: text("file_key").notNull(),
  originalName: text("original_name").notNull(),
  status: text("status", { enum: ["pending", "approved", "rejected"] }).notNull().default("pending"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (t) => [uniqueIndex("idx_pdf_file_key").on(t.fileKey)]);

export const pdfMappings = sqliteTable("pdf_mappings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  pdfId: integer("pdf_id").notNull().references(() => pdfFiles.id, { onDelete: "cascade" }),
  subjectId: integer("subject_id").notNull().references(() => subjects.id),
  year: integer("year").notNull(),
  examType: text("exam_type").notNull(),
  collegeId: integer("college_id").references(() => colleges.id),
  startPage: integer("start_page").notNull(),
  endPage: integer("end_page").notNull(),
}, (t) => [index("idx_pdf_mappings_subject_year").on(t.subjectId, t.year)]);

export const studyPlans = sqliteTable("study_plans", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  subjectId: integer("subject_id").notNull().references(() => subjects.id),
  examDate: text("exam_date").notNull(),
  dailyMinutes: integer("daily_minutes").notNull().default(120),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (t) => [index("idx_study_plans_user").on(t.userId)]);

export const reports = sqliteTable("reports", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => users.id),
  questionId: integer("question_id").references(() => questions.id),
  type: text("type").notNull(),
  details: text("details").notNull().default(""),
  status: text("status").notNull().default("open"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const questionPapers = sqliteTable("question_papers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  subjectId: integer("subject_id").notNull().references(() => subjects.id),
  pdfMappingId: integer("pdf_mapping_id").references(() => pdfMappings.id),
  year: integer("year").notNull(), examType: text("exam_type").notNull(),
  collegeId: integer("college_id").references(() => colleges.id),
  title: text("title").notNull(), status: text("status").notNull().default("published"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (t) => [index("idx_papers_discovery").on(t.subjectId,t.examType,t.year,t.collegeId)]);

export const paperQuestions = sqliteTable("paper_questions", {
  paperId: integer("paper_id").notNull().references(() => questionPapers.id,{onDelete:"cascade"}),
  questionId: integer("question_id").notNull().references(() => questions.id,{onDelete:"cascade"}),
  position: integer("position").notNull().default(0),
}, (t) => [primaryKey({columns:[t.paperId,t.questionId]})]);

export const personalLists = sqliteTable("personal_lists", {
  id: integer("id").primaryKey({autoIncrement:true}), userId: text("user_id").notNull().references(()=>users.id,{onDelete:"cascade"}),
  name: text("name").notNull(), createdAt:text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (t)=>[index("idx_personal_lists_user").on(t.userId)]);

export const personalListItems = sqliteTable("personal_list_items", {
  listId:integer("list_id").notNull().references(()=>personalLists.id,{onDelete:"cascade"}),
  questionId:integer("question_id").notNull().references(()=>questions.id,{onDelete:"cascade"}),
  position:integer("position").notNull().default(0),
},(t)=>[primaryKey({columns:[t.listId,t.questionId]})]);

export const mockTests = sqliteTable("mock_tests", {
  id:integer("id").primaryKey({autoIncrement:true}),userId:text("user_id").notNull().references(()=>users.id,{onDelete:"cascade"}),
  subjectId:integer("subject_id").notNull().references(()=>subjects.id),title:text("title").notNull(),durationMinutes:integer("duration_minutes").notNull(),
  status:text("status").notNull().default("ready"),startedAt:text("started_at"),submittedAt:text("submitted_at"),score:integer("score"),total:integer("total").notNull().default(0),
  createdAt:text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
},(t)=>[index("idx_mock_tests_user").on(t.userId, t.createdAt)]);

export const mockTestQuestions = sqliteTable("mock_test_questions", {
  testId:integer("test_id").notNull().references(()=>mockTests.id,{onDelete:"cascade"}),questionId:integer("question_id").notNull().references(()=>questions.id),
  position:integer("position").notNull(),answer:text("answer"),isCorrect:integer("is_correct",{mode:"boolean"}),
},(t)=>[primaryKey({columns:[t.testId,t.questionId]})]);

export const studyPlanItems = sqliteTable("study_plan_items", {
  id:integer("id").primaryKey({autoIncrement:true}),planId:integer("plan_id").notNull().references(()=>studyPlans.id,{onDelete:"cascade"}),
  topicId:integer("topic_id").references(()=>topics.id),scheduledDate:text("scheduled_date").notNull(),title:text("title").notNull(),kind:text("kind").notNull().default("study"),completed:integer("completed",{mode:"boolean"}).notNull().default(false),
},(t)=>[index("idx_plan_items_plan_date").on(t.planId,t.scheduledDate)]);

export const notifications = sqliteTable("notifications", {
  id:integer("id").primaryKey({autoIncrement:true}),userId:text("user_id").notNull().references(()=>users.id,{onDelete:"cascade"}),
  type:text("type").notNull(),title:text("title").notNull(),body:text("body").notNull(),readAt:text("read_at"),createdAt:text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
},(t)=>[index("idx_notifications_user_read").on(t.userId,t.readAt)]);

export const moderationActions = sqliteTable("moderation_actions", {
  id:integer("id").primaryKey({autoIncrement:true}),actorId:text("actor_id").notNull().references(()=>users.id),entityType:text("entity_type").notNull(),entityId:integer("entity_id").notNull(),action:text("action").notNull(),note:text("note").notNull().default(""),createdAt:text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
},(t)=>[index("idx_moderation_entity").on(t.entityType,t.entityId)]);

export const aiJobs = sqliteTable("ai_jobs", {
  id:integer("id").primaryKey({autoIncrement:true}),requestedBy:text("requested_by").notNull().references(()=>users.id),kind:text("kind").notNull(),sourceId:integer("source_id"),status:text("status").notNull().default("queued"),input:text("input").notNull().default("{}"),output:text("output"),error:text("error"),createdAt:text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),updatedAt:text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
},(t)=>[index("idx_ai_jobs_status").on(t.status,t.createdAt)]);
