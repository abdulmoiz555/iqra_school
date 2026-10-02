export type UserRole = 
  | 'Super Admin' 
  | 'Admin' 
  | 'Teacher' 
  | 'Accountant' 
  | 'Librarian' 
  | 'Receptionist' 
  | 'Parent' 
  | 'Student';

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  password?: string;
  role: UserRole;
  avatar?: string;
  status: 'active' | 'inactive';
  linkedId?: string; // studentId, teacherId, parentId etc.
  phone?: string;
}

export interface SchoolSettings {
  schoolName: string;
  schoolMotto: string;
  registrationNumber: string;
  principalName: string;
  email: string;
  facebookUrl?: string;
  phone: string;
  alternatePhone?: string;
  website: string;
  address: string;
  city: string;
  province: string;
  country: string;
  currency: string;
  currencySymbol: string;
  activeSession: string;
  dateFormat: string;
  timezone: string;
  logoUrl: string;
  siblingFirstChildPayPercent?: number; // default 100%
  siblingSecondChildPayPercent?: number; // default 50%
  siblingThirdChildPayPercent?: number; // default 0% (Free)
  restrictTeacherToAssignedClasses?: boolean; // Restrict teachers to only their assigned classes & students
  hideFinancialsFromNonAdmins?: boolean; // Hide fees collection and financial revenues from teachers/faculty/students/parents
  hideEnrollmentTotalsFromNonAdmins?: boolean; // Hide campus-wide enrollment totals from non-admins
  restrictLogsToAdminsAndPrincipal?: boolean; // Only show system audit logs to academic admins and principal
}

export interface AcademicSession {
  id: string;
  name: string; // e.g. 2025-2026
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface SchoolClass {
  id: string;
  name: string; // Grade 1, Grade 10, etc.
  numericOrder: number;
  category?: 'Co-Education' | 'Male' | 'Female'; // Co-Education, Boys (Male), Girls (Female)
  classTeacherId?: string;
  transportVehicleId?: string; // Transport fleet vehicle assigned to this class
  transportRouteId?: string;   // Transport route assigned to this class
}

export interface Section {
  id: string;
  classId: string;
  name: string; // A, B, C, D
  roomNumber: string;
  capacity: number;
  classTeacherId?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  classId: string;
  teacherId?: string;
  maxMarks: number;
  passingMarks: number;
  type: 'Compulsory' | 'Optional';
}

export interface Parent {
  id: string;
  fatherName: string;
  motherName: string;
  guardianName: string;
  cnic: string;
  phone: string;
  alternatePhone?: string;
  email: string;
  occupation: string;
  address: string;
  city: string;
  studentIds: string[];
}

export interface Student {
  id: string;
  admissionNumber: string;
  rollNumber: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  gender: 'Male' | 'Female' | 'Other';
  category?: 'Co-Education' | 'Male' | 'Female'; // Co-Education, Boys (Male), Girls (Female)
  dateOfBirth: string;
  bFormCnic: string;
  bloodGroup: string;
  religion: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  province: string;
  admissionDate: string;
  classId: string;
  sectionId: string;
  previousSchool?: string;
  parentId: string;
  emergencyContact: string;
  photoUrl?: string;
  status: 'Active' | 'Inactive' | 'Graduated' | 'Left School' | 'Suspended';
  siblingDiscountPercent?: number; // e.g., 25% for 2nd child, 50% for 3rd child
  scholarshipName?: string; // e.g. 'Merit Scholarship', 'Hafiz-e-Quran', 'Need-Based'
  scholarshipPercent?: number;
}

export interface Teacher {
  id: string;
  employeeId: string;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string;
  cnic: string;
  phone: string;
  email: string;
  address: string;
  qualification: string;
  experience: string;
  joiningDate: string;
  department: string;
  designation: string;
  teacherCategory?: 'Class Teacher' | 'Subject Teacher' | 'Head of Department' | 'Visiting Lecturer';
  salary: number;
  photoUrl?: string;
  status: 'Active' | 'On Leave' | 'Resigned' | 'Terminated';
  assignedClasses: string[]; // class IDs
  assignedSubjects: string[]; // subject IDs
  isClassTeacher?: boolean; // In charge of a class
  assignedClassId?: string; // which class they are in charge of
  canMarkAttendance?: boolean; // Allowed to record daily roll call
}

export interface ModulePermission {
  moduleId: string;
  moduleName: string;
  description: string;
  superAdmin: boolean;
  admin: boolean;
  classTeacher: boolean;
  subjectTeacher: boolean;
  accountant: boolean;
  librarian: boolean;
  receptionist: boolean;
  parent: boolean;
  student: boolean;
}

export interface Staff {
  id: string;
  employeeId: string;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  cnic: string;
  phone: string;
  email: string;
  address: string;
  department: string;
  designation: string;
  joiningDate: string;
  salary: number;
  status: 'Active' | 'On Leave' | 'Resigned' | 'Terminated';
}

export interface TimetableSlot {
  id: string;
  classId: string;
  sectionId: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string; // e.g. "08:30"
  endTime: string;   // e.g. "09:15"
  subjectId: string;
  teacherId: string;
  roomNumber: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Leave';

export interface StudentAttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  sectionId: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface TeacherAttendanceRecord {
  id: string;
  teacherId: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface FeeType {
  id: string;
  name: string;
  code: string;
  description?: string;
}

export interface FeeStructure {
  id: string;
  sessionId: string;
  classId: string;
  feeTypeId: string;
  amount: number;
  frequency: 'Monthly' | 'Term' | 'Annual' | 'One-Time';
}

export interface FeePayment {
  id: string;
  receiptNumber: string;
  trackingNumber?: string; // Tracking ID e.g. TRK-2026-9812
  studentId: string;
  date: string;
  month: string;
  year: number;
  subtotal: number;
  discountAmount: number;
  discountReason?: string;
  fineAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  paymentMethod: 'Cash' | 'Bank Transfer' | 'Online' | 'Cheque' | 'Other';
  collectedBy: string;
  remarks?: string;
  items: {
    feeTypeId: string;
    amount: number;
  }[];
}

export interface FeeDiscount {
  id: string;
  name: string;
  type: 'fixed' | 'percentage';
  value: number;
  description?: string;
  status: 'Active' | 'Inactive';
}

export interface ScholarshipItem {
  id: string;
  name: string;
  category: 'Merit' | 'Sibling' | 'Need-Based' | 'Teacher Child' | 'Hafiz-e-Quran' | 'Orphan';
  discountPercentage: number;
  criteria: string;
  status: 'Active' | 'Inactive';
}

export interface SiblingConcessionRule {
  childOrder: number; // 1 = 1st child, 2 = 2nd child, 3 = 3rd child+
  discountPercent: number; // 0, 25, 50
  description: string;
}

export interface Expense {
  id: string;
  date: string;
  category: 'Electricity' | 'Gas' | 'Water' | 'Rent' | 'Salaries' | 'Maintenance' | 'Stationery' | 'Transport' | 'Internet' | 'Other';
  description: string;
  amount: number;
  paymentMethod: 'Cash' | 'Bank Transfer' | 'Cheque' | 'Online';
  referenceNumber?: string;
  recordedBy: string;
}

export interface Exam {
  id: string;
  name: string;
  type: 'Monthly Test' | 'Mid Term' | 'Final Term' | 'Annual Exam' | 'Quiz';
  sessionId: string;
  classId: string;
  startDate: string;
  endDate: string;
}

export interface MarkRecord {
  id: string;
  examId: string;
  studentId: string;
  subjectId: string;
  maxMarks: number;
  obtainedMarks: number;
  remarks?: string;
}

export interface GradingRule {
  id: string;
  grade: string;
  minPercentage: number;
  maxPercentage: number;
  gradePoint: number;
  description: string;
}

export interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  category: string;
  edition: string;
  quantity: number;
  availableQuantity: number;
  price: number;
  shelfNumber: string;
}

export interface BookIssue {
  id: string;
  bookId: string;
  studentId: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  fine: number;
  status: 'Issued' | 'Returned' | 'Overdue';
  condition?: string;
}

export interface Vehicle {
  id: string;
  vehicleNumber: string;
  registrationNumber: string;
  vehicleType: 'Bus' | 'Van' | 'Coaster';
  capacity: number;
  driverId: string;
  status: 'Active' | 'Maintenance' | 'Inactive';
}

export interface Driver {
  id: string;
  name: string;
  cnic: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
}

export interface TransportRoute {
  id: string;
  name: string;
  pickupLocation: string;
  dropLocation: string;
  fareMonthly: number;
  vehicleId: string;
  stops?: string[];
  assignedClassIds?: string[];
  notes?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Stationery' | 'Furniture' | 'Electronics' | 'Sports' | 'Laboratory' | 'Cleaning';
  quantity: number;
  unit: string;
  purchasePrice: number;
  supplier: string;
  location: string;
  minStockLevel: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeType: 'Teacher' | 'Staff';
  leaveType: 'Casual' | 'Sick' | 'Annual' | 'Emergency' | 'Other';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedDate: string;
  approvedBy?: string;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeType: 'Teacher' | 'Staff';
  month: string;
  year: number;
  basicSalary: number;
  allowances: number;
  bonus: number;
  overtime: number;
  deductions: number;
  loan: number;
  fine: number;
  netSalary: number;
  paymentDate: string;
  status: 'Paid' | 'Pending';
  paymentMethod: 'Bank Transfer' | 'Cash' | 'Cheque';
}

export interface Notice {
  id: string;
  title: string;
  description: string;
  date: string;
  audience: 'All' | 'Students' | 'Teachers' | 'Parents' | 'Staff';
  attachmentName?: string;
  postedBy: string;
  isImportant?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  subject: string;
  body: string;
  timestamp: string;
  isRead: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'fee' | 'attendance' | 'exam' | 'inventory' | 'library' | 'general';
  timestamp: string;
  isRead: boolean;
  linkTab?: string;
}

export interface Assignment {
  id: string;
  classId: string;
  sectionId: string;
  subjectId: string;
  teacherId: string;
  title: string;
  description: string;
  issueDate: string;
  dueDate: string;
  maxScore: number;
  attachmentName?: string;
}

export interface AuditLog {
  id: string;
  userName: string;
  userRole: string;
  action: string;
  module: string;
  recordId: string;
  ipAddress: string;
  timestamp: string;
}
