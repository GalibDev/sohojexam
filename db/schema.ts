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
