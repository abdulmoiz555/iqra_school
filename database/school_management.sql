-- =====================================================================
-- SCHOOL MANAGEMENT SYSTEM (SMS) — DATABASE SCHEMA & SEED DATA
-- Target DBMS: MySQL 8.0+ / MariaDB 10.4+ / phpMyAdmin Ready
-- Character Set: utf8mb4 / Collation: utf8mb4_unicode_ci
-- =====================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `school_management` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `school_management`;

-- ---------------------------------------------------------------------
-- Table: roles
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `slug` VARCHAR(50) NOT NULL UNIQUE,
  `description` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `roles` (`id`, `name`, `slug`, `description`) VALUES
(1, 'Super Admin', 'super-admin', 'Full access to school database and settings'),
(2, 'Admin', 'admin', 'Admissions, academics, examinations and attendance'),
(3, 'Teacher', 'teacher', 'Assigned classes, timetable, marks entry and attendance'),
(4, 'Accountant', 'accountant', 'Fee challans, collections, receipts and expense vouchers'),
(5, 'Librarian', 'librarian', 'Book catalog, issues, returns and overdue fines'),
(6, 'Receptionist', 'receptionist', 'Front office, inquiries, student admissions and circulars'),
(7, 'Parent', 'parent', 'View child academic report, attendance, and fee challans'),
(8, 'Student', 'student', 'View personal timetable, marks transcript, and fee status');

-- ---------------------------------------------------------------------
-- Table: permissions
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `permissions`;
CREATE TABLE `permissions` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `module` VARCHAR(50) NOT NULL,
  `action` VARCHAR(50) NOT NULL,
  `description` VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `permissions` (`id`, `module`, `action`, `description`) VALUES
(1, 'students', 'create', 'Admit and enroll new students'),
(2, 'students', 'read', 'View student directories and profiles'),
(3, 'students', 'update', 'Edit student biodata and assignments'),
(4, 'students', 'delete', 'Archive or delete student records'),
(5, 'fees', 'collect', 'Collect fees and issue official receipts'),
(6, 'fees', 'view_reports', 'Audit financial ledgers and arrears'),
(7, 'examinations', 'enter_marks', 'Submit examination subject marks'),
(8, 'attendance', 'take', 'Mark daily roll call attendance'),
(9, 'settings', 'manage', 'Modify school configurations and backup');

-- ---------------------------------------------------------------------
-- Table: users
-- Default Admin: admin / admin123 (bcrypt hash: $2y$10$wT1r53r3kY1Yg6Y7l3WwgeO0cO5UqZ2Z4S9uJmZgC3.QJ6q1Q5Oa2)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `role_id` INT UNSIGNED NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(30) NULL,
  `status` ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  `remember_token` VARCHAR(100) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`id`, `role_id`, `name`, `username`, `email`, `password`, `phone`, `status`) VALUES
(1, 1, 'Sir Imran', 'admin', 'iqra.gk1994@gmail.com', '$2y$10$wT1r53r3kY1Yg6Y7l3WwgeO0cO5UqZ2Z4S9uJmZgC3.QJ6q1Q5Oa2', '+92 345 9840192', 'active'),
(2, 2, 'Admissions & Academic Admin', 'admin_ops', 'admin@iqra.edu.pk', '$2y$10$wT1r53r3kY1Yg6Y7l3WwgeO0cO5UqZ2Z4S9uJmZgC3.QJ6q1Q5Oa2', '+92 345 9840191', 'active'),
(3, 3, 'Engr. Zafar Iqbal (Class Teacher)', 'teacher', 'zafar.iqbal@iqra.edu.pk', '$2y$10$wT1r53r3kY1Yg6Y7l3WwgeO0cO5UqZ2Z4S9uJmZgC3.QJ6q1Q5Oa2', '+92 300 9481920', 'active'),
(4, 4, 'Muhammad Rizwan Aslam (Bursar)', 'accountant', 'accounts@iqra.edu.pk', '$2y$10$wT1r53r3kY1Yg6Y7l3WwgeO0cO5UqZ2Z4S9uJmZgC3.QJ6q1Q5Oa2', '+92 321 4401929', 'active'),
(5, 5, 'Mrs. Rubina Kausar', 'librarian', 'library@iqra.edu.pk', '$2y$10$wT1r53r3kY1Yg6Y7l3WwgeO0cO5UqZ2Z4S9uJmZgC3.QJ6q1Q5Oa2', '+92 301 9940183', 'active'),
(6, 6, 'Miss Amna Tariq', 'receptionist', 'frontdesk@iqra.edu.pk', '$2y$10$wT1r53r3kY1Yg6Y7l3WwgeO0cO5UqZ2Z4S9uJmZgC3.QJ6q1Q5Oa2', '+92 333 1184921', 'active'),
(7, 7, 'Muhammad Arshad Khan', 'parent', 'arshad.khan@gmail.com', '$2y$10$wT1r53r3kY1Yg6Y7l3WwgeO0cO5UqZ2Z4S9uJmZgC3.QJ6q1Q5Oa2', '+92 300 4819201', 'active'),
(8, 8, 'Hamza Arshad Khan', 'student', 'hamza.khan@student.iqra.edu.pk', '$2y$10$wT1r53r3kY1Yg6Y7l3WwgeO0cO5UqZ2Z4S9uJmZgC3.QJ6q1Q5Oa2', '+92 300 4819201', 'active');

-- ---------------------------------------------------------------------
-- Table: school_settings
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `school_settings`;
CREATE TABLE `school_settings` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `school_name` VARCHAR(150) NOT NULL,
  `school_motto` VARCHAR(255) NULL,
  `registration_number` VARCHAR(50) NULL,
  `principal_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `alternate_phone` VARCHAR(30) NULL,
  `website` VARCHAR(255) NULL,
  `address` VARCHAR(255) NOT NULL,
  `city` VARCHAR(50) NOT NULL,
  `province` VARCHAR(50) NOT NULL,
  `country` VARCHAR(50) NOT NULL DEFAULT 'Pakistan',
  `currency` VARCHAR(10) NOT NULL DEFAULT 'PKR',
  `currency_symbol` VARCHAR(10) NOT NULL DEFAULT 'Rs. ',
  `active_session` VARCHAR(20) NOT NULL DEFAULT '2025-2026',
  `date_format` VARCHAR(20) NOT NULL DEFAULT 'DD/MM/YYYY',
  `timezone` VARCHAR(50) NOT NULL DEFAULT 'Asia/Karachi',
  `logo_url` VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `school_settings` (`id`, `school_name`, `school_motto`, `registration_number`, `principal_name`, `email`, `phone`, `alternate_phone`, `website`, `address`, `city`, `province`, `country`, `currency`, `currency_symbol`, `active_session`, `date_format`, `timezone`, `logo_url`) VALUES
(1, 'Iqra School and College Garhi Kapura Mardan', 'اقرأ باسم ربك الذي خلق — Education with Moral Excellence & Character Building', 'IQRA-GK-1994-01', 'Sir Imran', 'iqra.gk1994@gmail.com', '+92 345 9840192', '+92 937 840192', 'https://web.facebook.com/profile.php?id=100057113664245', 'Main Bazaar Road, Garhi Kapura', 'Mardan', 'Khyber Pakhtunkhwa (KP)', 'Pakistan', 'PKR', 'Rs. ', '2025-2026', 'DD/MM/YYYY', 'Asia/Karachi', '/public/iqra_logo.jpg');

-- ---------------------------------------------------------------------
-- Table: academic_sessions
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `academic_sessions`;
CREATE TABLE `academic_sessions` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(30) NOT NULL UNIQUE,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `is_active` TINYINT(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `academic_sessions` (`id`, `name`, `start_date`, `end_date`, `is_active`) VALUES
(1, '2024-2025', '2024-04-01', '2025-03-31', 0),
(2, '2025-2026', '2025-04-01', '2026-03-31', 1),
(3, '2026-2027', '2026-04-01', '2027-03-31', 0);

-- ---------------------------------------------------------------------
-- Table: parents
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `parents`;
CREATE TABLE `parents` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `father_name` VARCHAR(100) NOT NULL,
  `mother_name` VARCHAR(100) NULL,
  `guardian_name` VARCHAR(100) NULL,
  `cnic` VARCHAR(30) NOT NULL UNIQUE,
  `phone` VARCHAR(30) NOT NULL,
  `alternate_phone` VARCHAR(30) NULL,
  `email` VARCHAR(100) NULL,
  `occupation` VARCHAR(100) NULL,
  `address` VARCHAR(255) NOT NULL,
  `city` VARCHAR(50) NOT NULL DEFAULT 'Lahore',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `parents` (`id`, `father_name`, `mother_name`, `guardian_name`, `cnic`, `phone`, `alternate_phone`, `email`, `occupation`, `address`, `city`) VALUES
(1, 'Muhammad Arshad Khan', 'Farhana Arshad', 'Muhammad Arshad Khan', '35202-8491823-1', '+92 300 4819201', '+92 321 8847192', 'arshad.khan@gmail.com', 'Chartered Accountant', 'House 142, Street 8, Cavalry Ground', 'Lahore'),
(2, 'Syed Nadeem Bukhari', 'Tahira Nadeem', 'Syed Nadeem Bukhari', '35201-1948293-3', '+92 301 9847291', NULL, 'nadeem.bukhari@outlook.com', 'Civil Engineer', 'B-12, Model Town Block C', 'Lahore'),
(3, 'Kamran Ashraf', 'Saima Kamran', 'Kamran Ashraf', '35202-6638192-5', '+92 322 4719028', NULL, 'kamran.ashraf@yahoo.com', 'Businessman / Textile Export', 'House 89, Gulberg III', 'Lahore'),
(4, 'Tariq Mehmood', 'Zainab Tariq', 'Tariq Mehmood', '35201-7782910-7', '+92 333 4901823', NULL, 'tariq.mehmood@gmail.com', 'Senior Software Architect', 'Flat 402, Royal Heights, DHA Phase 3', 'Lahore'),
(5, 'Dr. Asim Raza', 'Dr. Ayesha Asim', 'Dr. Asim Raza', '35202-3391824-9', '+92 300 5519283', NULL, 'dr.asimraza@hospital.org', 'Cardiologist', 'House 12-A, Canal View Housing', 'Lahore');

-- ---------------------------------------------------------------------
-- Table: classes
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `classes`;
CREATE TABLE `classes` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `numeric_order` INT NOT NULL,
  `class_teacher_id` INT UNSIGNED NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `classes` (`id`, `name`, `numeric_order`) VALUES
(1, 'Play Group', 1),
(2, 'Nursery', 2),
(3, 'KG', 3),
(4, 'Grade 1', 4),
(5, 'Grade 2', 5),
(6, 'Grade 5', 6),
(7, 'Grade 8', 7),
(8, 'Grade 9', 8),
(9, 'Grade 10', 9);

-- ---------------------------------------------------------------------
-- Table: sections
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `sections`;
CREATE TABLE `sections` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `class_id` INT UNSIGNED NOT NULL,
  `name` VARCHAR(20) NOT NULL,
  `room_number` VARCHAR(30) NOT NULL DEFAULT 'Room 101',
  `capacity` INT NOT NULL DEFAULT 35,
  CONSTRAINT `fk_sections_class` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `sections` (`id`, `class_id`, `name`, `room_number`, `capacity`) VALUES
(1, 9, 'A (Science)', 'Room 301', 35),
(2, 9, 'B (Computer Science)', 'Room 302', 35),
(3, 8, 'A', 'Room 201', 30),
(4, 7, 'A', 'Room 105', 30),
(5, 4, 'A', 'Room 101', 25);

-- ---------------------------------------------------------------------
-- Table: students
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `students`;
CREATE TABLE `students` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `admission_number` VARCHAR(50) NOT NULL UNIQUE,
  `roll_number` VARCHAR(30) NOT NULL,
  `first_name` VARCHAR(50) NOT NULL,
  `middle_name` VARCHAR(50) NULL,
  `last_name` VARCHAR(50) NOT NULL,
  `gender` ENUM('Male', 'Female', 'Other') NOT NULL,
  `date_of_birth` DATE NOT NULL,
  `b_form_cnic` VARCHAR(30) NOT NULL,
  `blood_group` VARCHAR(10) DEFAULT 'B+',
  `religion` VARCHAR(30) DEFAULT 'Islam',
  `phone` VARCHAR(30) NOT NULL,
  `email` VARCHAR(100) NULL,
  `address` VARCHAR(255) NOT NULL,
  `city` VARCHAR(50) NOT NULL DEFAULT 'Lahore',
  `province` VARCHAR(50) NOT NULL DEFAULT 'Punjab',
  `admission_date` DATE NOT NULL,
  `class_id` INT UNSIGNED NOT NULL,
  `section_id` INT UNSIGNED NOT NULL,
  `previous_school` VARCHAR(150) NULL,
  `parent_id` INT UNSIGNED NOT NULL,
  `emergency_contact` VARCHAR(30) NOT NULL,
  `photo_url` VARCHAR(255) NULL,
  `status` ENUM('Active', 'Inactive', 'Graduated', 'Left School', 'Suspended') DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_students_class` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_students_section` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_students_parent` FOREIGN KEY (`parent_id`) REFERENCES `parents` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `students` (`id`, `admission_number`, `roll_number`, `first_name`, `last_name`, `gender`, `date_of_birth`, `b_form_cnic`, `phone`, `email`, `address`, `city`, `province`, `admission_date`, `class_id`, `section_id`, `parent_id`, `emergency_contact`, `status`) VALUES
(1, 'ADM-2024-001', '101', 'Hamza', 'Khan', 'Male', '2009-08-14', '35202-9988112-1', '+92 300 4819201', 'hamza.khan@student.beaconhorizon.edu', 'House 142, Street 8, Cavalry Ground', 'Lahore', 'Punjab', '2023-04-10', 9, 1, 1, '+92 321 8847192', 'Active'),
(2, 'ADM-2024-002', '102', 'Ayesha', 'Khan', 'Female', '2011-11-20', '35202-9988112-2', '+92 300 4819201', 'ayesha.khan@student.beaconhorizon.edu', 'House 142, Street 8, Cavalry Ground', 'Lahore', 'Punjab', '2023-04-10', 7, 4, 1, '+92 321 8847192', 'Active'),
(3, 'ADM-2024-003', '103', 'Syed Bilal', 'Bukhari', 'Male', '2009-03-25', '35201-1948293-1', '+92 301 9847291', 'bilal.bukhari@student.beaconhorizon.edu', 'B-12, Model Town Block C', 'Lahore', 'Punjab', '2024-03-15', 9, 1, 2, '+92 301 9847291', 'Active'),
(4, 'ADM-2024-004', '104', 'Zainab', 'Kamran', 'Female', '2009-06-18', '35202-6638192-2', '+92 322 4719028', 'zainab.kamran@student.beaconhorizon.edu', 'House 89, Gulberg III', 'Lahore', 'Punjab', '2023-04-05', 9, 2, 3, '+92 322 4719028', 'Active'),
(5, 'ADM-2024-005', '105', 'Mustafa', 'Kamran', 'Male', '2016-09-02', '35202-6638192-3', '+92 322 4719028', 'mustafa.kamran@student.beaconhorizon.edu', 'House 89, Gulberg III', 'Lahore', 'Punjab', '2024-04-01', 4, 5, 3, '+92 322 4719028', 'Active'),
(6, 'ADM-2024-006', '106', 'Daniyal', 'Tariq', 'Male', '2009-12-30', '35201-7782910-1', '+92 333 4901823', 'daniyal.tariq@student.beaconhorizon.edu', 'Flat 402, Royal Heights, DHA Phase 3', 'Lahore', 'Punjab', '2023-04-12', 9, 2, 4, '+92 333 4901823', 'Active'),
(7, 'ADM-2024-007', '107', 'Mahnoor', 'Asim', 'Female', '2010-01-14', '35202-3391824-2', '+92 300 5519283', 'mahnoor.asim@student.beaconhorizon.edu', 'House 12-A, Canal View Housing', 'Lahore', 'Punjab', '2024-04-01', 8, 3, 5, '+92 300 5519283', 'Active'),
(8, 'ADM-2024-008', '108', 'Usman', 'Ghaffar', 'Male', '2009-05-12', '35201-8841029-1', '+92 321 4401928', 'usman.ghaffar@student.beaconhorizon.edu', 'House 34, Sector F, DHA Phase 1', 'Lahore', 'Punjab', '2023-04-01', 9, 1, 1, '+92 321 4401928', 'Active'),
(9, 'ADM-2024-009', '109', 'Fatima', 'Rehman', 'Female', '2009-07-22', '35202-5510293-2', '+92 300 9940182', 'fatima.rehman@student.beaconhorizon.edu', 'House 55, Garden Town', 'Lahore', 'Punjab', '2023-04-15', 9, 1, 2, '+92 300 9940182', 'Active'),
(10, 'ADM-2024-010', '110', 'Rayyan', 'Ahmed', 'Male', '2010-02-17', '35201-2291038-1', '+92 333 1184920', 'rayyan.ahmed@student.beaconhorizon.edu', 'House 71, PCSIR Phase 2', 'Lahore', 'Punjab', '2024-04-01', 8, 3, 3, '+92 333 1184920', 'Active');

-- ---------------------------------------------------------------------
-- Table: teachers
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `teachers`;
CREATE TABLE `teachers` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `employee_id` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL,
  `gender` ENUM('Male', 'Female', 'Other') NOT NULL,
  `date_of_birth` DATE NOT NULL,
  `cnic` VARCHAR(30) NOT NULL UNIQUE,
  `phone` VARCHAR(30) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `qualification` VARCHAR(150) NOT NULL,
  `experience` VARCHAR(100) NOT NULL,
  `joining_date` DATE NOT NULL,
  `department` VARCHAR(100) NOT NULL,
  `designation` VARCHAR(100) NOT NULL,
  `salary` DECIMAL(10,2) NOT NULL,
  `status` ENUM('Active', 'On Leave', 'Resigned', 'Terminated') DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `teachers` (`id`, `employee_id`, `name`, `gender`, `date_of_birth`, `cnic`, `phone`, `email`, `address`, `qualification`, `experience`, `joining_date`, `department`, `designation`, `salary`, `status`) VALUES
(1, 'EMP-TCH-001', 'Engr. Zafar Iqbal', 'Male', '1984-05-15', '35202-1849102-1', '+92 300 9481920', 'zafar.iqbal@beaconhorizon.edu', 'House 45-B, Sector C, Bahria Town, Lahore', 'M.Sc. Applied Mathematics, UET Lahore', '12 Years Senior School Experience', '2018-08-01', 'Mathematics & Physical Sciences', 'Senior Master & Head of Sciences', 110000.00, 'Active'),
(2, 'EMP-TCH-002', 'Madam Saira Bano', 'Female', '1989-11-22', '35201-9481029-2', '+92 321 8840192', 'saira.bano@beaconhorizon.edu', 'House 112, Eden City, Airport Road, Lahore', 'MS Computer Science, FAST-NUCES', '8 Years High School & Cambridge IGCSE', '2020-09-01', 'Computer Science & ICT', 'Lead ICT Lecturer', 95000.00, 'Active'),
(3, 'EMP-TCH-003', 'Dr. Noman Khaliq', 'Male', '1987-03-10', '35202-4410293-1', '+92 333 4901824', 'noman.khaliq@beaconhorizon.edu', 'Plot 78, State Life Housing, Lahore', 'Ph.D. Organic Chemistry, Punjab University', '10 Years Collegiate & High School Teaching', '2019-03-15', 'Biological & Chemical Sciences', 'Senior Science Master', 105000.00, 'Active');

-- ---------------------------------------------------------------------
-- Table: subjects
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `subjects`;
CREATE TABLE `subjects` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `code` VARCHAR(30) NOT NULL,
  `class_id` INT UNSIGNED NOT NULL,
  `teacher_id` INT UNSIGNED NULL,
  `max_marks` INT NOT NULL DEFAULT 100,
  `passing_marks` INT NOT NULL DEFAULT 33,
  `type` ENUM('Compulsory', 'Optional') DEFAULT 'Compulsory',
  CONSTRAINT `fk_subjects_class` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `subjects` (`id`, `name`, `code`, `class_id`, `teacher_id`, `max_marks`, `passing_marks`, `type`) VALUES
(1, 'Mathematics', 'MTH-101', 9, 1, 100, 33, 'Compulsory'),
(2, 'Physics', 'PHY-102', 9, 1, 100, 33, 'Compulsory'),
(3, 'Chemistry', 'CHM-103', 9, 3, 100, 33, 'Compulsory'),
(4, 'Computer Science', 'CS-105', 9, 2, 100, 33, 'Optional');

-- ---------------------------------------------------------------------
-- Table: student_attendance
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `student_attendance`;
CREATE TABLE `student_attendance` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT UNSIGNED NOT NULL,
  `class_id` INT UNSIGNED NOT NULL,
  `section_id` INT UNSIGNED NOT NULL,
  `date` DATE NOT NULL,
  `status` ENUM('Present', 'Absent', 'Late', 'Leave') NOT NULL DEFAULT 'Present',
  `remarks` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `idx_student_date` (`student_id`, `date`),
  CONSTRAINT `fk_att_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `student_attendance` (`student_id`, `class_id`, `section_id`, `date`, `status`, `remarks`) VALUES
(1, 9, 1, '2026-09-28', 'Present', 'On time'),
(3, 9, 1, '2026-09-28', 'Present', 'On time'),
(8, 9, 1, '2026-09-28', 'Late', 'School transport delayed in rain');

-- ---------------------------------------------------------------------
-- Table: fee_types
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `fee_types`;
CREATE TABLE `fee_types` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `code` VARCHAR(20) NOT NULL UNIQUE,
  `description` VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `fee_types` (`id`, `name`, `code`, `description`) VALUES
(1, 'Monthly Tuition Fee', 'TUI', 'Regular monthly teaching tuition fee'),
(2, 'Admission & Registration Fee', 'ADM', 'One-time admission charge upon entrance'),
(3, 'Examination & Paper Fee', 'EXM', 'Mid term and final board paper fee'),
(4, 'Science & Computer Lab Fee', 'LAB', 'Practical equipment & ICT network usage');

-- ---------------------------------------------------------------------
-- Table: fee_payments
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `fee_payments`;
CREATE TABLE `fee_payments` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `receipt_number` VARCHAR(50) NOT NULL UNIQUE,
  `student_id` INT UNSIGNED NOT NULL,
  `date` DATE NOT NULL,
  `month` VARCHAR(20) NOT NULL,
  `year` INT NOT NULL,
  `subtotal` DECIMAL(10,2) NOT NULL,
  `discount_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `discount_reason` VARCHAR(100) NULL,
  `fine_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `total_amount` DECIMAL(10,2) NOT NULL,
  `paid_amount` DECIMAL(10,2) NOT NULL,
  `balance_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `payment_method` ENUM('Cash', 'Bank Transfer', 'Online', 'Cheque', 'Other') NOT NULL DEFAULT 'Cash',
  `collected_by` VARCHAR(100) NOT NULL,
  `remarks` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_fees_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `fee_payments` (`id`, `receipt_number`, `student_id`, `date`, `month`, `year`, `subtotal`, `discount_amount`, `discount_reason`, `fine_amount`, `total_amount`, `paid_amount`, `balance_amount`, `payment_method`, `collected_by`) VALUES
(1, 'REC-2026-0042', 1, '2026-09-05', 'September', 2026, 10300.00, 1000.00, 'Merit Scholarship', 0.00, 9300.00, 9300.00, 0.00, 'Bank Transfer', 'Muhammad Rizwan Aslam'),
(2, 'REC-2026-0043', 3, '2026-09-08', 'September', 2026, 10300.00, 0.00, NULL, 200.00, 10500.00, 10500.00, 0.00, 'Cash', 'Muhammad Rizwan Aslam'),
(3, 'REC-2026-0044', 4, '2026-09-12', 'September', 2026, 10300.00, 850.00, 'Sibling Concession', 0.00, 9450.00, 5000.00, 4450.00, 'Cheque', 'Muhammad Rizwan Aslam');

-- ---------------------------------------------------------------------
-- Table: exams
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `exams`;
CREATE TABLE `exams` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `type` ENUM('Monthly Test', 'Mid Term', 'Final Term', 'Annual Exam', 'Quiz') NOT NULL,
  `session_id` INT UNSIGNED NOT NULL,
  `class_id` INT UNSIGNED NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `exams` (`id`, `name`, `type`, `session_id`, `class_id`, `start_date`, `end_date`) VALUES
(1, 'First Term Assessment 2026', 'Monthly Test', 2, 9, '2026-05-10', '2026-05-18'),
(2, 'Mid Term Comprehensive Examinations 2026', 'Mid Term', 2, 9, '2026-09-15', '2026-09-25');

-- ---------------------------------------------------------------------
-- Table: marks
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `marks`;
CREATE TABLE `marks` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `exam_id` INT UNSIGNED NOT NULL,
  `student_id` INT UNSIGNED NOT NULL,
  `subject_id` INT UNSIGNED NOT NULL,
  `max_marks` INT NOT NULL,
  `obtained_marks` INT NOT NULL,
  `remarks` VARCHAR(255) NULL,
  UNIQUE KEY `idx_exam_student_subject` (`exam_id`, `student_id`, `subject_id`),
  CONSTRAINT `fk_marks_exam` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_marks_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_marks_subject` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `marks` (`id`, `exam_id`, `student_id`, `subject_id`, `max_marks`, `obtained_marks`, `remarks`) VALUES
(1, 2, 1, 1, 100, 94, 'Outstanding mathematical analytical reasoning'),
(2, 2, 1, 2, 100, 89, 'Excellent grasp of Newtonian mechanics'),
(3, 2, 1, 3, 100, 91, 'Top scores in organic chemistry equations');

-- ---------------------------------------------------------------------
-- Table: books & library
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `books`;
CREATE TABLE `books` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `isbn` VARCHAR(30) NOT NULL UNIQUE,
  `title` VARCHAR(150) NOT NULL,
  `author` VARCHAR(100) NOT NULL,
  `publisher` VARCHAR(100) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `edition` VARCHAR(50) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `available_quantity` INT NOT NULL DEFAULT 1,
  `price` DECIMAL(10,2) NOT NULL,
  `shelf_number` VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `books` (`id`, `isbn`, `title`, `author`, `publisher`, `category`, `edition`, `quantity`, `available_quantity`, `price`, `shelf_number`) VALUES
(1, '978-0199144877', 'Oxford Advanced Pure Mathematics', 'C.J. Tranter', 'Oxford University Press', 'Mathematics', '7th Revised', 25, 22, 1850.00, 'Shelf M-03'),
(2, '978-0470556535', 'Fundamentals of Physics Extended', 'David Halliday & Robert Resnick', 'John Wiley & Sons', 'Physics', '10th Global', 20, 16, 3400.00, 'Shelf P-01');

-- ---------------------------------------------------------------------
-- Table: audit_logs
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `audit_logs`;
CREATE TABLE `audit_logs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_name` VARCHAR(100) NOT NULL,
  `user_role` VARCHAR(50) NOT NULL,
  `action` VARCHAR(255) NOT NULL,
  `module` VARCHAR(50) NOT NULL,
  `record_id` VARCHAR(50) NOT NULL,
  `ip_address` VARCHAR(45) NOT NULL,
  `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `audit_logs` (`id`, `user_name`, `user_role`, `action`, `module`, `record_id`, `ip_address`) VALUES
(1, 'Dr. Shahzad Tariq', 'Super Admin', 'Approved Student Admission for Hamza Arshad Khan', 'Students', '1', '192.168.1.10'),
(2, 'Muhammad Rizwan Aslam', 'Accountant', 'Collected Monthly Fee Rs. 9,300 with Merit Discount', 'Fees', 'REC-2026-0042', '192.168.1.25');

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
