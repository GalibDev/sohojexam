INSERT OR IGNORE INTO `users` (`id`,`email`,`name`,`role`) VALUES
('sohojexam-content','content@sohojexam.local','SohojExam Content Team','admin');
--> statement-breakpoint
INSERT OR IGNORE INTO `subjects` (`semester_id`,`name`,`code`,`description`) VALUES
((SELECT `id` FROM `semesters` WHERE `name`='2nd Year 1st Semester' LIMIT 1),'Object Oriented Programming Language','CSE-301','2020 paper title: Object Oriented Programming Language'),
((SELECT `id` FROM `semesters` WHERE `name`='2nd Year 1st Semester' LIMIT 1),'Data Structure','CSE-303','2020 paper title: Data Structure'),
((SELECT `id` FROM `semesters` WHERE `name`='2nd Year 1st Semester' LIMIT 1),'Data Structure and Algorithm (DSA)','CSE-401','Previously named Algorithms'),
((SELECT `id` FROM `semesters` WHERE `name`='2nd Year 1st Semester' LIMIT 1),'Linear Algebra','MATH-401','Previously named Mathematics'),
((SELECT `id` FROM `semesters` WHERE `name`='2nd Year 1st Semester' LIMIT 1),'Electrical Devices and Instrumentation','EEE-407','2020 paper title: Electrical Devices and Instrumentation'),
((SELECT `id` FROM `semesters` WHERE `name`='2nd Year 1st Semester' LIMIT 1),'Digital Electronics & Pulse Technique','CSE-403','2020 paper title: Digital Electronics & Pulse Technique');
--> statement-breakpoint
INSERT OR IGNORE INTO `pdf_files` (`owner_id`,`file_key`,`original_name`,`status`) VALUES
('sohojexam-content','public:/pdfs/2020-2nd-year-1st-semester-final.pdf','2020 2nd Year 1st Semester Final Question.pdf','approved');
--> statement-breakpoint
INSERT INTO `pdf_mappings` (`pdf_id`,`subject_id`,`year`,`exam_type`,`start_page`,`end_page`)
SELECT f.id,s.id,2020,'Final',m.start_page,m.end_page
FROM (SELECT 'CSE-301' code,1 start_page,2 end_page UNION ALL SELECT 'CSE-303',3,4 UNION ALL SELECT 'CSE-401',5,5 UNION ALL SELECT 'MATH-401',6,6 UNION ALL SELECT 'EEE-407',7,7 UNION ALL SELECT 'CSE-403',8,8) m
JOIN `subjects` s ON s.code=m.code
JOIN `pdf_files` f ON f.file_key='public:/pdfs/2020-2nd-year-1st-semester-final.pdf';
--> statement-breakpoint
INSERT INTO `question_papers` (`subject_id`,`pdf_mapping_id`,`year`,`exam_type`,`title`,`status`)
SELECT m.subject_id,m.id,2020,'Final',s.name || ' - Semester Final 2020','published'
FROM `pdf_mappings` m
JOIN `subjects` s ON s.id=m.subject_id
JOIN `pdf_files` f ON f.id=m.pdf_id
WHERE f.file_key='public:/pdfs/2020-2nd-year-1st-semester-final.pdf';
--> statement-breakpoint
PRAGMA optimize;
