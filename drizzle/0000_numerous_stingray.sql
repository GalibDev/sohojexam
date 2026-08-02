CREATE TABLE `bookmarks` (
	`user_id` text NOT NULL,
	`question_id` integer NOT NULL,
	`folder` text DEFAULT 'Must Study' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY(`user_id`, `question_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_bookmarks_user` ON `bookmarks` (`user_id`);--> statement-breakpoint
CREATE TABLE `colleges` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`short_name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_colleges_short_name` ON `colleges` (`short_name`);--> statement-breakpoint
CREATE TABLE `departments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`code` text NOT NULL,
	`active` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_departments_code` ON `departments` (`code`);--> statement-breakpoint
CREATE TABLE `pdf_files` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner_id` text NOT NULL,
	`file_key` text NOT NULL,
	`original_name` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_pdf_file_key` ON `pdf_files` (`file_key`);--> statement-breakpoint
CREATE TABLE `pdf_mappings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`pdf_id` integer NOT NULL,
	`subject_id` integer NOT NULL,
	`year` integer NOT NULL,
	`exam_type` text NOT NULL,
	`college_id` integer,
	`start_page` integer NOT NULL,
	`end_page` integer NOT NULL,
	FOREIGN KEY (`pdf_id`) REFERENCES `pdf_files`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`college_id`) REFERENCES `colleges`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_pdf_mappings_subject_year` ON `pdf_mappings` (`subject_id`,`year`);--> statement-breakpoint
CREATE TABLE `preparation` (
	`user_id` text NOT NULL,
	`question_id` integer NOT NULL,
	`status` text DEFAULT 'not_started' NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY(`user_id`, `question_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_preparation_user_status` ON `preparation` (`user_id`,`status`);--> statement-breakpoint
CREATE TABLE `question_appearances` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`question_id` integer NOT NULL,
	`year` integer NOT NULL,
	`exam_type` text NOT NULL,
	`college_id` integer,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`college_id`) REFERENCES `colleges`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_appearances_filter` ON `question_appearances` (`year`,`exam_type`,`college_id`);--> statement-breakpoint
CREATE INDEX `idx_appearances_question` ON `question_appearances` (`question_id`);--> statement-breakpoint
CREATE TABLE `questions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`subject_id` integer NOT NULL,
	`topic_id` integer,
	`text` text NOT NULL,
	`easy_answer` text DEFAULT '' NOT NULL,
	`exam_answer` text DEFAULT '' NOT NULL,
	`marks` integer DEFAULT 0 NOT NULL,
	`importance_score` integer DEFAULT 0 NOT NULL,
	`admin_priority` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`topic_id`) REFERENCES `topics`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_questions_subject_score` ON `questions` (`subject_id`,`importance_score`);--> statement-breakpoint
CREATE INDEX `idx_questions_topic` ON `questions` (`topic_id`);--> statement-breakpoint
CREATE TABLE `reports` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`question_id` integer,
	`type` text NOT NULL,
	`details` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'open' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `semesters` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`department_id` integer NOT NULL,
	`name` text NOT NULL,
	`position` integer NOT NULL,
	FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_semesters_department` ON `semesters` (`department_id`);--> statement-breakpoint
CREATE TABLE `study_plans` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`subject_id` integer NOT NULL,
	`exam_date` text NOT NULL,
	`daily_minutes` integer DEFAULT 120 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_study_plans_user` ON `study_plans` (`user_id`);--> statement-breakpoint
CREATE TABLE `subjects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`semester_id` integer NOT NULL,
	`name` text NOT NULL,
	`code` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	FOREIGN KEY (`semester_id`) REFERENCES `semesters`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_subjects_code` ON `subjects` (`code`);--> statement-breakpoint
CREATE INDEX `idx_subjects_semester` ON `subjects` (`semester_id`);--> statement-breakpoint
CREATE TABLE `topics` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`subject_id` integer NOT NULL,
	`name` text NOT NULL,
	FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_topics_subject` ON `topics` (`subject_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`role` text DEFAULT 'student' NOT NULL,
	`points` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_users_email` ON `users` (`email`);
--> statement-breakpoint
INSERT INTO `departments` (`name`,`code`,`active`) VALUES
('Computer Science & Engineering','CSE',1),
('Electrical & Electronic Engineering','EEE',0),
('Textile Engineering','TE',0),
('Civil Engineering','CE',0),
('Architecture','ARCH',0);
--> statement-breakpoint
INSERT INTO `semesters` (`department_id`,`name`,`position`) VALUES
(1,'1st Year 1st Semester',1),(1,'1st Year 2nd Semester',2),(1,'2nd Year 1st Semester',3),(1,'2nd Year 2nd Semester',4),
(1,'3rd Year 1st Semester',5),(1,'3rd Year 2nd Semester',6),(1,'4th Year 1st Semester',7),(1,'4th Year 2nd Semester',8);
--> statement-breakpoint
INSERT INTO `subjects` (`semester_id`,`name`,`code`,`description`) VALUES
(3,'Data Structures','CSE 2103','Core data structures, algorithms and complexity'),
(3,'Object-Oriented Programming','CSE 2101','Object-oriented design with classes and patterns'),
(5,'Database Management System','CSE 3101','Relational design, SQL and transactions'),
(6,'Operating System','CSE 3201','Processes, memory and file systems'),
(6,'Computer Networks','CSE 3203','Network models, protocols and routing'),
(3,'Engineering Mathematics III','MATH 2101','Discrete mathematics and numerical methods');
--> statement-breakpoint
INSERT INTO `colleges` (`name`,`short_name`) VALUES
('Shyamoli Engineering College','SEC'),('National Institute of Textile Engineering and Research','NITER'),
('Faridpur Engineering College','FEC'),('Mymensingh Engineering College','MEC'),
('Barishal Engineering College','BEC'),('SAIC Institute of Management and Technology','SAIC');
--> statement-breakpoint
INSERT INTO `topics` (`subject_id`,`name`) VALUES
(1,'Stack Basics'),(1,'Queue'),(1,'Linked List'),(1,'Tree Traversal'),(1,'Sorting'),(1,'Searching'),(1,'Graph'),
(2,'OOP Principles'),(3,'Normalization'),(3,'SQL'),(4,'Process Scheduling'),(5,'OSI Model');
--> statement-breakpoint
INSERT INTO `questions` (`subject_id`,`topic_id`,`text`,`easy_answer`,`exam_answer`,`marks`,`importance_score`,`admin_priority`) VALUES
(1,1,'Define Stack. Explain its basic operations with algorithms.','Stack হলো LIFO পদ্ধতির data structure—শেষে যে data ঢোকে, সেটিই আগে বের হয়। Push দিয়ে data যোগ এবং Pop দিয়ে data বের করা হয়।','A stack is a linear data structure that follows the Last-In-First-Out principle. Its primary operations are push, pop, peek and isEmpty. Push inserts an element at TOP, while pop removes and returns the current TOP element.',5,96,10),
(1,2,'What is a circular queue? Mention its advantages.','Circular queue-তে শেষ position আবার প্রথম position-এর সাথে যুক্ত থাকে। তাই খালি জায়গা পুনরায় ব্যবহার করা যায়।','A circular queue connects the final position back to the first, allowing vacant positions to be reused. It avoids the false-overflow problem of a linear queue and provides efficient fixed-size buffering.',5,91,9),
(1,6,'Explain binary search with time complexity.','Binary search sorted list-কে প্রতিবার অর্ধেক করে target খোঁজে। তাই এর সময় লাগে O(log n)।','Binary search locates a target in a sorted collection by repeatedly comparing with the middle element and discarding one half. Its time complexity is O(log n), while the iterative space complexity is O(1).',5,84,7),
(1,4,'Describe preorder, inorder and postorder tree traversal.','Tree traversal-এর তিনটি নিয়ম হলো Root-Left-Right, Left-Root-Right এবং Left-Right-Root।','Preorder visits Root-Left-Right, inorder visits Left-Root-Right, and postorder visits Left-Right-Root. Each traversal visits every node exactly once and therefore requires O(n) time.',7,89,8),
(1,5,'Write the merge sort algorithm and analyze its complexity.','Merge sort list-কে ছোট ছোট ভাগে ভাগ করে, sort করে, তারপর merge করে।','Merge sort uses divide and conquer: split the array into halves, recursively sort each half, and merge the sorted halves. Its time complexity is O(n log n) in all cases and auxiliary space is O(n).',7,82,6),
(2,8,'Explain the four basic principles of object-oriented programming.','OOP-এর মূল চারটি নীতি হলো Encapsulation, Abstraction, Inheritance ও Polymorphism।','The four pillars of OOP are encapsulation, abstraction, inheritance and polymorphism. Together they improve modularity, reuse, maintainability and extensibility.',5,88,8),
(3,9,'What is database normalization? Explain 1NF, 2NF and 3NF.','Normalization database-এর duplicate data কমিয়ে data-কে সঠিক table-এ সাজায়।','Normalization organizes relational data to reduce redundancy and update anomalies. 1NF requires atomic values, 2NF removes partial dependencies, and 3NF removes transitive dependencies.',7,94,9),
(4,11,'Compare preemptive and non-preemptive CPU scheduling.','Preemptive scheduling চলমান process থামাতে পারে, non-preemptive পারে না।','Preemptive scheduling allows the operating system to interrupt a running process, while non-preemptive scheduling retains the CPU until termination or blocking.',5,79,6);
--> statement-breakpoint
INSERT INTO `question_appearances` (`question_id`,`year`,`exam_type`,`college_id`) VALUES
(1,2020,'Final',NULL),(1,2021,'In-course 1',1),(1,2022,'In-course 2',2),(1,2023,'Final',NULL),(1,2024,'In-course 1',3),(1,2025,'Final',NULL),(1,2026,'In-course 1',1),
(2,2020,'Final',NULL),(2,2022,'In-course 1',2),(2,2023,'Final',NULL),(2,2024,'In-course 2',4),(2,2025,'Final',NULL),(2,2026,'In-course 1',1),
(3,2021,'Final',NULL),(3,2022,'In-course 2',2),(3,2024,'Final',NULL),(3,2025,'In-course 1',1),(3,2026,'Final',NULL),
(4,2020,'Final',NULL),(4,2022,'Final',NULL),(4,2023,'In-course 2',5),(4,2025,'Final',NULL),(4,2026,'In-course 1',6),
(5,2021,'Final',NULL),(5,2023,'In-course 1',1),(5,2024,'Final',NULL),(5,2026,'Final',NULL),
(6,2021,'Final',NULL),(6,2023,'In-course 1',1),(6,2024,'Final',NULL),(6,2025,'Final',NULL),
(7,2020,'Final',NULL),(7,2021,'In-course 1',1),(7,2022,'Final',NULL),(7,2023,'In-course 2',2),(7,2024,'Final',NULL),(7,2025,'Final',NULL),
(8,2021,'Final',NULL),(8,2023,'In-course 1',3),(8,2025,'Final',NULL);
--> statement-breakpoint
PRAGMA optimize;
