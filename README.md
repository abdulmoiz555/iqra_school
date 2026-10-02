### 🎓 Complete School Management System (SMS)
A complete, enterprise-grade, responsive **School Management System (SMS)** engineered for schools, academies, colleges, and educational institutes.

---

## 1. Key System Modules

* **Administrative Dashboard**: Real-time KPI statistics cards, interactive fee inflow vs overhead graphs, student gender distribution breakdown, daily roll-call attendance status, and recent audit activity ledger.
* **Role-Based Access Control (RBAC)**: Dedicated permissions for 8 distinct roles:
  1. *Super Admin*: Full institutional governance, security logs, and database backup.
  2. *Admin*: Academics, admissions, student enrollment, and examination controller.
  3. *Teacher*: Assigned classes, weekly timetables, homework assignments, and marks entry.
  4. *Accountant*: Fee challan generation, counter fee collection, discounts, receipts, and campus expenses.
  5. *Librarian*: Book catalog, student book loans, returns, and automatic overdue fine calculations.
  6. *Receptionist*: Inquiries, admissions, visitor logs, and parent communication.
  7. *Parent*: Monitor children attendance, examination report cards, and fee receipts.
  8. *Student*: View personal academic profile, timetable, homework, and term transcripts.
* **Student Administration**: Full student profiling (B-Form/CNIC, blood group, emergency contacts), dual-sided printable PVC Student ID cards with QR barcodes, and batch academic grade promotions.
* **Academics & Timetable**: Academic sessions (single active session enforcement), Classes & Sections, Subject assignments, Weekly timetable matrix (Monday–Saturday), and Homework tasks.
* **Fee Collection & Cashiering**: Instant JavaScript dynamic computation (`Subtotal - Discount + Fine = Total - Paid = Remaining`), customizable fee structures, multiple payment modes, and printable receipts in both standard A4 and compact POS thermal layouts.
* **Examinations & Transcripts**: Configurable grading scales (`A+`, `A`, `B`, `C`, `D`, `F`), teacher marks entry with automated percentage and grade determination, and printable official student progress transcripts with school seal.
* **Circulation Library**: ISBN book tracking, active student loans, and return processing with overdue penalty assessment.
* **Fleet Transport**: Bus/Van tracking, licensed driver management, route fare structures, and student bus stops.
* **Asset Inventory**: Low stock threshold alerts, consumable stationery tracking, laboratory chemicals, and sports equipment.
* **Human Resources & Payroll**: Staff roster, employee leave application and multi-level approval workflow, and gross-to-net salary payslip generator with printable salary vouchers.
* **Communication & Notices**: Central notice board with audience targeting (`All`, `Students`, `Teachers`, `Parents`, `Staff`) and internal staff messaging.
* **Reports & Data Export**: Instant one-click CSV export and print view for student demographics, fee collection ledgers, attendance rates, and exam metrics.
* **Dark / Light Mode**: Seamless theme switching with persistent local storage.

---

## 2. Technology Stack

* **Frontend**: HTML5, CSS3, JavaScript ES6+, Tailwind CSS, Lucide Icons, Print Stylesheets.
* **Interactive Container**: Vite 8+, React 19, TypeScript, Express Node backend support.
* **Relational Database**: MySQL 8.0+ / MariaDB 10.4+ / PDO prepared statements compatible.
* **Target Deployment**: Local XAMPP/WAMP Apache environment and cloud containers.

---

## 3. Local XAMPP Installation Guide

To run this application locally using XAMPP (Apache + MySQL):

### Step 1: Install XAMPP
* Download and install **XAMPP for Windows/Linux/macOS** from [https://www.apachefriends.org](https://www.apachefriends.org) with PHP 8.0+ and MySQL 8.0+.
* Open the **XAMPP Control Panel** and start both **Apache** and **MySQL**.

### Step 2: Set Up Database
1. Open your browser and navigate to phpMyAdmin:
   ```text
   http://localhost/phpmyadmin/
   ```
2. Click **Databases**, create a new database named:
   ```text
   school_management
   ```
   Select collation: `utf8mb4_unicode_ci`.
3. Select the `school_management` database and click the **Import** tab.
4. Click **Choose File**, select `database/school_management.sql` from this project repository, and click **Import**.

### Step 3: Configure Project
1. Copy the project folder into your XAMPP `htdocs` directory:
   ```text
   C:\xampp\htdocs\school-management-system\
   ```
2. Open `config/database.php` and verify your credentials:
   ```php
   $host = 'localhost';
   $db   = 'school_management';
   $user = 'root';
   $pass = ''; // Default XAMPP MySQL password is blank
   ```

### Step 4: Launch Application
Open your browser and navigate to:
```text
http://localhost/school-management-system/
```

---


*Note: In production environments, immediately modify the administrator credentials and rotate session keys.*
