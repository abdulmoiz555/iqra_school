import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  SchoolSettings,
  AcademicSession,
  SchoolClass,
  Section,
  Subject,
  Parent,
  Student,
  Teacher,
  Staff,
  TimetableSlot,
  StudentAttendanceRecord,
  TeacherAttendanceRecord,
  FeeType,
  FeeStructure,
  FeePayment,
  FeeDiscount,
  Expense,
  Exam,
  MarkRecord,
  GradingRule,
  Book,
  BookIssue,
  Vehicle,
  Driver,
  TransportRoute,
  InventoryItem,
  LeaveRequest,
  PayrollRecord,
  Notice,
  Message,
  NotificationItem,
  Assignment,
  AuditLog,
  ModulePermission,
} from '../types';
import {
  initialSettings,
  initialSessions,
  initialClasses,
  initialSections,
  initialSubjects,
  initialParents,
  initialStudents,
  initialTeachers,
  initialStaff,
  initialTimetable,
  initialStudentAttendance,
  initialTeacherAttendance,
  initialFeeTypes,
  initialFeeStructures,
  initialFeePayments,
  initialFeeDiscounts,
  initialExpenses,
  initialExams,
  initialMarks,
  initialGradingRules,
  initialBooks,
  initialBookIssues,
  initialDrivers,
  initialVehicles,
  initialRoutes,
  initialInventory,
  initialLeaves,
  initialPayrolls,
  initialNotices,
  initialMessages,
  initialNotifications,
  initialAssignments,
  initialAuditLogs,
  demoUsers,
  initialPermissions,
} from '../data/initialData';

interface AppContextType {
  // Theme & Auth
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  currentUser: User;
  switchRole: (role: UserRole) => void;
  login: (username: string, password?: string) => boolean;
  logout: () => void;
  demoUsers: User[];
  users: User[];
  updateUser: (id: string, user: Partial<User>) => void;
  permissions: ModulePermission[];
  updatePermission: (moduleId: string, perm: Partial<ModulePermission>) => void;
  canRecordAttendance: (user?: User) => boolean;
  isClassTeacher: (userId?: string) => boolean;

  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  globalSearch: string;
  setGlobalSearch: (q: string) => void;

  // Domain state
  settings: SchoolSettings;
  updateSettings: (newSettings: Partial<SchoolSettings>) => void;
  sessions: AcademicSession[];
  setActiveSession: (id: string) => void;
  addSession: (s: Omit<AcademicSession, 'id'>) => void;

  classes: SchoolClass[];
  addClass: (cls: Omit<SchoolClass, 'id'>) => void;
  updateClass: (id: string, cls: Partial<SchoolClass>) => void;
  deleteClass: (id: string) => void;

  sections: Section[];
  addSection: (sec: Omit<Section, 'id'>) => void;
  updateSection: (id: string, sec: Partial<Section>) => void;
  deleteSection: (id: string) => void;

  subjects: Subject[];
  addSubject: (sub: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, sub: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;

  parents: Parent[];
  addParent: (par: Omit<Parent, 'id'>) => void;
  updateParent: (id: string, par: Partial<Parent>) => void;
  deleteParent: (id: string) => void;

  students: Student[];
  addStudent: (stu: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, stu: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  promoteStudents: (studentIds: string[], targetClassId: string, targetSectionId: string) => void;

  teachers: Teacher[];
  addTeacher: (tch: Omit<Teacher, 'id'>) => void;
  updateTeacher: (id: string, tch: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;

  staff: Staff[];
  addStaff: (stf: Omit<Staff, 'id'>) => void;
  updateStaff: (id: string, stf: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;

  timetable: TimetableSlot[];
  addTimetableSlot: (slot: Omit<TimetableSlot, 'id'>) => void;
  deleteTimetableSlot: (id: string) => void;

  studentAttendance: StudentAttendanceRecord[];
  saveStudentAttendance: (records: StudentAttendanceRecord[]) => void;
  teacherAttendance: TeacherAttendanceRecord[];
  saveTeacherAttendance: (records: TeacherAttendanceRecord[]) => void;

  feeTypes: FeeType[];
  addFeeType: (ft: Omit<FeeType, 'id'>) => void;
  feeStructures: FeeStructure[];
  addFeeStructure: (fs: Omit<FeeStructure, 'id'>) => void;
  deleteFeeStructure: (id: string) => void;

  feePayments: FeePayment[];
  collectFee: (payment: Omit<FeePayment, 'id' | 'receiptNumber'>) => string; // returns receiptNumber
  feeDiscounts: FeeDiscount[];
  expenses: Expense[];
  addExpense: (exp: Omit<Expense, 'id'>) => void;

  exams: Exam[];
  addExam: (exam: Omit<Exam, 'id'>) => void;
  marks: MarkRecord[];
  saveMarks: (newMarks: MarkRecord[]) => void;
  gradingRules: GradingRule[];
  updateGradingRules: (rules: GradingRule[]) => void;

  books: Book[];
  addBook: (bk: Omit<Book, 'id'>) => void;
  bookIssues: BookIssue[];
  issueBook: (bookId: string, studentId: string, dueDate: string) => void;
  returnBook: (issueId: string, fine: number, condition: string) => void;

  vehicles: Vehicle[];
  drivers: Driver[];
  routes: TransportRoute[];
  addVehicle: (v: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (id: string, v: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  addRoute: (r: Omit<TransportRoute, 'id'>) => void;
  updateRoute: (id: string, r: Partial<TransportRoute>) => void;
  deleteRoute: (id: string) => void;
  addDriver: (d: Omit<Driver, 'id'>) => void;
  updateDriver: (id: string, d: Partial<Driver>) => void;

  inventory: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateStock: (id: string, delta: number) => void;

  leaves: LeaveRequest[];
  submitLeave: (leave: Omit<LeaveRequest, 'id' | 'status' | 'appliedDate'>) => void;
  updateLeaveStatus: (id: string, status: 'Approved' | 'Rejected', approverName: string) => void;

  payrolls: PayrollRecord[];
  generatePayroll: (payroll: Omit<PayrollRecord, 'id'>) => void;

  notices: Notice[];
  addNotice: (notice: Omit<Notice, 'id'>) => void;
  deleteNotice: (id: string) => void;

  messages: Message[];
  sendMessage: (msg: Omit<Message, 'id' | 'timestamp' | 'isRead'>) => void;
  markMessageRead: (id: string) => void;

  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;

  assignments: Assignment[];
  addAssignment: (asg: Omit<Assignment, 'id'>) => void;

  auditLogs: AuditLog[];
  logAction: (action: string, module: string, recordId: string) => void;

  resetToDefaultData: () => void;
  exportDatabaseJSON: () => string;
  importDatabaseJSON: (jsonStr: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'sms_edumanage_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('sms_dark_mode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('sms_dark_mode', String(darkMode));
  }, [darkMode]);

  // Auth & User
  const [users, setUsers] = useState<User[]>(demoUsers);
  const [currentUser, setCurrentUser] = useState<User>(demoUsers[0]);
  const [permissions, setPermissions] = useState<ModulePermission[]>(initialPermissions);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Domain Entities
  const [settings, setSettings] = useState<SchoolSettings>(initialSettings);
  const [sessions, setSessions] = useState<AcademicSession[]>(initialSessions);
  const [classes, setClasses] = useState<SchoolClass[]>(initialClasses);
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [parents, setParents] = useState<Parent[]>(initialParents);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [staff, setStaff] = useState<Staff[]>(initialStaff);
  const [timetable, setTimetable] = useState<TimetableSlot[]>(initialTimetable);
  const [studentAttendance, setStudentAttendance] = useState<StudentAttendanceRecord[]>(initialStudentAttendance);
  const [teacherAttendance, setTeacherAttendance] = useState<TeacherAttendanceRecord[]>(initialTeacherAttendance);
  const [feeTypes, setFeeTypes] = useState<FeeType[]>(initialFeeTypes);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>(initialFeeStructures);
  const [feePayments, setFeePayments] = useState<FeePayment[]>(initialFeePayments);
  const [feeDiscounts, setFeeDiscounts] = useState<FeeDiscount[]>(initialFeeDiscounts);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [exams, setExams] = useState<Exam[]>(initialExams);
  const [marks, setMarks] = useState<MarkRecord[]>(initialMarks);
  const [gradingRules, setGradingRules] = useState<GradingRule[]>(initialGradingRules);
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [bookIssues, setBookIssues] = useState<BookIssue[]>(initialBookIssues);
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [routes, setRoutes] = useState<TransportRoute[]>(initialRoutes);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [leaves, setLeaves] = useState<LeaveRequest[]>(initialLeaves);
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>(initialPayrolls);
  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.settings) setSettings(parsed.settings);
        if (parsed.students) setStudents(parsed.students);
        if (parsed.teachers) setTeachers(parsed.teachers);
        if (parsed.feePayments) setFeePayments(parsed.feePayments);
        if (parsed.studentAttendance) setStudentAttendance(parsed.studentAttendance);
        if (parsed.marks) setMarks(parsed.marks);
        if (parsed.notices) setNotices(parsed.notices);
      }
    } catch {
      // fallback to initial
    }
  }, []);

  // Save to local storage on key updates
  const saveStateToStorage = () => {
    try {
      const payload = {
        settings,
        students,
        teachers,
        feePayments,
        studentAttendance,
        marks,
        notices,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore quota errors
    }
  };

  useEffect(() => {
    saveStateToStorage();
  }, [settings, students, teachers, feePayments, studentAttendance, marks, notices]);

  // Logger helper
  const logAction = (action: string, module: string, recordId: string) => {
    const newLog: AuditLog = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      module,
      recordId,
      ipAddress: '192.168.1.15',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Auth handlers
  const switchRole = (role: UserRole) => {
    const found = users.find((u) => u.role === role);
    if (found) {
      setCurrentUser(found);
      logAction(`Switched active role profile to ${role}`, 'Authentication', found.id);
    }
  };

  const login = (username: string, password?: string) => {
    const user = users.find(
      (u) =>
        u.username.toLowerCase() === username.toLowerCase() ||
        u.email.toLowerCase() === username.toLowerCase()
    );
    if (user) {
      if (password && user.password && user.password !== password) {
        return false;
      }
      setCurrentUser(user);
      logAction(`User logged in as ${user.name} (${user.role})`, 'Authentication', user.id);
      return true;
    }
    return false;
  };

  const updateUser = (id: string, updated: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const nu = { ...u, ...updated };
          if (currentUser.id === id) setCurrentUser(nu);
          return nu;
        }
        return u;
      })
    );
    logAction(`Updated user profile/credentials for ID: ${id}`, 'Security', id);
  };

  const updatePermission = (moduleId: string, perm: Partial<ModulePermission>) => {
    setPermissions((prev) =>
      prev.map((p) => (p.moduleId === moduleId ? { ...p, ...perm } : p))
    );
    logAction(`Updated system permission for module: ${moduleId}`, 'Security', moduleId);
  };

  const isClassTeacher = (userId?: string): boolean => {
    const uid = userId || currentUser.id;
    const user = users.find((u) => u.id === uid) || currentUser;
    if (user.role === 'Super Admin' || user.role === 'Admin') return true;
    if (user.role === 'Teacher' && user.linkedId) {
      const tch = teachers.find((t) => t.id === user.linkedId);
      return Boolean(tch?.isClassTeacher || tch?.canMarkAttendance);
    }
    return false;
  };

  const canRecordAttendance = (user?: User): boolean => {
    const u = user || currentUser;
    if (u.role === 'Super Admin' || u.role === 'Admin') return true;
    if (u.role === 'Teacher' && u.linkedId) {
      const tch = teachers.find((t) => t.id === u.linkedId);
      return Boolean(tch?.isClassTeacher && tch?.canMarkAttendance);
    }
    return false;
  };

  const logout = () => {
    // Return to guest / super admin default demo
    setCurrentUser(users[0]);
    setActiveTab('home');
  };

  // Settings
  const updateSettings = (newSettings: Partial<SchoolSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    logAction('Updated general school configuration & identity', 'Settings', 'school_settings');
  };

  // Sessions
  const setActiveSession = (id: string) => {
    setSessions((prev) =>
      prev.map((s) => ({
        ...s,
        isActive: s.id === id,
      }))
    );
    const act = sessions.find((s) => s.id === id);
    if (act) {
      setSettings((prev) => ({ ...prev, activeSession: act.name }));
      logAction(`Activated academic session: ${act.name}`, 'Academics', id);
    }
  };

  const addSession = (s: Omit<AcademicSession, 'id'>) => {
    const newSess: AcademicSession = { ...s, id: `sess-${Date.now()}` };
    setSessions((prev) => [...prev, newSess]);
    logAction(`Created academic session: ${s.name}`, 'Academics', newSess.id);
  };

  // Classes & Sections
  const addClass = (cls: Omit<SchoolClass, 'id'>) => {
    const newClass: SchoolClass = { ...cls, id: `cls-${Date.now()}` };
    setClasses((prev) => [...prev, newClass]);
    logAction(`Created Class: ${cls.name}`, 'Academics', newClass.id);
  };

  const updateClass = (id: string, cls: Partial<SchoolClass>) => {
    setClasses((prev) => prev.map((c) => (c.id === id ? { ...c, ...cls } : c)));
    logAction(`Updated Class ID: ${id}`, 'Academics', id);
  };

  const deleteClass = (id: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== id));
    logAction(`Deleted Class ID: ${id}`, 'Academics', id);
  };

  const addSection = (sec: Omit<Section, 'id'>) => {
    const newSec: Section = { ...sec, id: `sec-${Date.now()}` };
    setSections((prev) => [...prev, newSec]);
    logAction(`Created Section: ${sec.name}`, 'Academics', newSec.id);
  };

  const updateSection = (id: string, sec: Partial<Section>) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, ...sec } : s)));
    logAction(`Updated Section ID: ${id}`, 'Academics', id);
  };

  const deleteSection = (id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
    logAction(`Deleted Section ID: ${id}`, 'Academics', id);
  };

  // Subjects
  const addSubject = (sub: Omit<Subject, 'id'>) => {
    const newSub: Subject = { ...sub, id: `sub-${Date.now()}` };
    setSubjects((prev) => [...prev, newSub]);
    logAction(`Added Subject: ${sub.name} (${sub.code})`, 'Academics', newSub.id);
  };

  const updateSubject = (id: string, sub: Partial<Subject>) => {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, ...sub } : s)));
    logAction(`Updated Subject ID: ${id}`, 'Academics', id);
  };

  const deleteSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    logAction(`Deleted Subject ID: ${id}`, 'Academics', id);
  };

  // Parents
  const addParent = (par: Omit<Parent, 'id'>) => {
    const newParent: Parent = { ...par, id: `par-${Date.now()}` };
    setParents((prev) => [...prev, newParent]);
    logAction(`Registered Parent: ${par.fatherName} / ${par.motherName}`, 'Parents', newParent.id);
  };

  const updateParent = (id: string, par: Partial<Parent>) => {
    setParents((prev) => prev.map((p) => (p.id === id ? { ...p, ...par } : p)));
    logAction(`Updated Parent Record ID: ${id}`, 'Parents', id);
  };

  const deleteParent = (id: string) => {
    setParents((prev) => prev.filter((p) => p.id !== id));
    logAction(`Deleted Parent Record ID: ${id}`, 'Parents', id);
  };

  // Students
  const addStudent = (stu: Omit<Student, 'id'>) => {
    const newStudent: Student = { ...stu, id: `stu-${Date.now()}` };
    setStudents((prev) => [newStudent, ...prev]);
    // Link to parent
    if (stu.parentId) {
      setParents((prev) =>
        prev.map((p) =>
          p.id === stu.parentId
            ? { ...p, studentIds: [...p.studentIds, newStudent.id] }
            : p
        )
      );
    }
    logAction(`Enrolled Student: ${stu.firstName} ${stu.lastName} (${stu.admissionNumber})`, 'Students', newStudent.id);
  };

  const updateStudent = (id: string, stu: Partial<Student>) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...stu } : s)));
    logAction(`Updated Student Information ID: ${id}`, 'Students', id);
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    logAction(`Soft-deleted student record ID: ${id}`, 'Students', id);
  };

  const promoteStudents = (studentIds: string[], targetClassId: string, targetSectionId: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        studentIds.includes(s.id)
          ? { ...s, classId: targetClassId, sectionId: targetSectionId }
          : s
      )
    );
    logAction(`Promoted ${studentIds.length} students to Class ${targetClassId}`, 'Students', targetClassId);
  };

  // Teachers
  const addTeacher = (tch: Omit<Teacher, 'id'>) => {
    const newTch: Teacher = { ...tch, id: `tch-${Date.now()}` };
    setTeachers((prev) => [...prev, newTch]);
    logAction(`Recruited Teacher: ${tch.name} (${tch.employeeId})`, 'Teachers', newTch.id);
  };

  const updateTeacher = (id: string, tch: Partial<Teacher>) => {
    setTeachers((prev) => prev.map((t) => (t.id === id ? { ...t, ...tch } : t)));
    logAction(`Updated Teacher Record ID: ${id}`, 'Teachers', id);
  };

  const deleteTeacher = (id: string) => {
    setTeachers((prev) => prev.filter((t) => t.id !== id));
    logAction(`Deleted Teacher Record ID: ${id}`, 'Teachers', id);
  };

  // Staff
  const addStaff = (stf: Omit<Staff, 'id'>) => {
    const newStf: Staff = { ...stf, id: `stf-${Date.now()}` };
    setStaff((prev) => [...prev, newStf]);
    logAction(`Added Staff Member: ${stf.name} (${stf.designation})`, 'Staff', newStf.id);
  };

  const updateStaff = (id: string, stf: Partial<Staff>) => {
    setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, ...stf } : s)));
    logAction(`Updated Staff ID: ${id}`, 'Staff', id);
  };

  const deleteStaff = (id: string) => {
    setStaff((prev) => prev.filter((s) => s.id !== id));
    logAction(`Deleted Staff ID: ${id}`, 'Staff', id);
  };

  // Timetable
  const addTimetableSlot = (slot: Omit<TimetableSlot, 'id'>) => {
    const newSlot: TimetableSlot = { ...slot, id: `tt-${Date.now()}` };
    setTimetable((prev) => [...prev, newSlot]);
    logAction(`Added Timetable Slot: ${slot.day} ${slot.startTime}-${slot.endTime}`, 'Academics', newSlot.id);
  };

  const deleteTimetableSlot = (id: string) => {
    setTimetable((prev) => prev.filter((t) => t.id !== id));
  };

  // Attendance
  const saveStudentAttendance = (records: StudentAttendanceRecord[]) => {
    setStudentAttendance((prev) => {
      const keys = new Set(records.map((r) => `${r.studentId}_${r.date}`));
      const filtered = prev.filter((r) => !keys.has(`${r.studentId}_${r.date}`));
      return [...records, ...filtered];
    });
    logAction(`Recorded daily student attendance (${records.length} records)`, 'Attendance', records[0]?.date || 'today');
  };

  const saveTeacherAttendance = (records: TeacherAttendanceRecord[]) => {
    setTeacherAttendance((prev) => {
      const keys = new Set(records.map((r) => `${r.teacherId}_${r.date}`));
      const filtered = prev.filter((r) => !keys.has(`${r.teacherId}_${r.date}`));
      return [...records, ...filtered];
    });
    logAction(`Logged teacher daily attendance`, 'Attendance', 'today');
  };

  // Fees
  const addFeeType = (ft: Omit<FeeType, 'id'>) => {
    const newFt: FeeType = { ...ft, id: `ft-${Date.now()}` };
    setFeeTypes((prev) => [...prev, newFt]);
    logAction(`Created Fee Type: ${ft.name}`, 'Fees', newFt.id);
  };

  const addFeeStructure = (fs: Omit<FeeStructure, 'id'>) => {
    const newFs: FeeStructure = { ...fs, id: `fs-${Date.now()}` };
    setFeeStructures((prev) => [...prev, newFs]);
    logAction(`Defined Fee Structure for Class ${fs.classId}: Rs. ${fs.amount}`, 'Fees', newFs.id);
  };

  const deleteFeeStructure = (id: string) => {
    setFeeStructures((prev) => prev.filter((f) => f.id !== id));
  };

  const collectFee = (payment: Omit<FeePayment, 'id' | 'receiptNumber'>): string => {
    const receiptNumber = `REC-2026-${String(feePayments.length + 43).padStart(4, '0')}`;
    const trackingNumber = payment.trackingNumber || `TRK-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newPayment: FeePayment = {
      ...payment,
      id: `pay-${Date.now()}`,
      receiptNumber,
      trackingNumber,
    };
    setFeePayments((prev) => [newPayment, ...prev]);
    logAction(`Fee Collected: ${receiptNumber} (Tracking: ${trackingNumber}) Amount: ${settings.currencySymbol}${payment.paidAmount}`, 'Fees', receiptNumber);
    return receiptNumber;
  };

  const addExpense = (exp: Omit<Expense, 'id'>) => {
    const newExp: Expense = { ...exp, id: `exp-${Date.now()}` };
    setExpenses((prev) => [newExp, ...prev]);
    logAction(`Logged School Expense: ${exp.category} - Rs. ${exp.amount}`, 'Expenses', newExp.id);
  };

  // Exams & Marks
  const addExam = (exam: Omit<Exam, 'id'>) => {
    const newExam: Exam = { ...exam, id: `ex-${Date.now()}` };
    setExams((prev) => [...prev, newExam]);
    logAction(`Created Exam: ${exam.name}`, 'Examinations', newExam.id);
  };

  const saveMarks = (newMarks: MarkRecord[]) => {
    setMarks((prev) => {
      const keys = new Set(newMarks.map((m) => `${m.examId}_${m.studentId}_${m.subjectId}`));
      const rest = prev.filter((m) => !keys.has(`${m.examId}_${m.studentId}_${m.subjectId}`));
      return [...newMarks, ...rest];
    });
    logAction(`Entered academic examination marks for ${newMarks.length} records`, 'Examinations', newMarks[0]?.examId || 'marks');
  };

  const updateGradingRules = (rules: GradingRule[]) => {
    setGradingRules(rules);
    logAction('Configured grading scale thresholds', 'Examinations', 'grading_rules');
  };

  // Library
  const addBook = (bk: Omit<Book, 'id'>) => {
    const newBk: Book = { ...bk, id: `bk-${Date.now()}` };
    setBooks((prev) => [...prev, newBk]);
    logAction(`Cataloged Book: ${bk.title} (${bk.isbn})`, 'Library', newBk.id);
  };

  const issueBook = (bookId: string, studentId: string, dueDate: string) => {
    const newIssue: BookIssue = {
      id: `bi-${Date.now()}`,
      bookId,
      studentId,
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate,
      status: 'Issued',
      fine: 0,
    };
    setBookIssues((prev) => [newIssue, ...prev]);
    setBooks((prev) =>
      prev.map((b) =>
        b.id === bookId ? { ...b, availableQuantity: Math.max(0, b.availableQuantity - 1) } : b
      )
    );
    logAction(`Issued Library Book ID: ${bookId} to Student ID: ${studentId}`, 'Library', newIssue.id);
  };

  const returnBook = (issueId: string, fine: number, condition: string) => {
    setBookIssues((prev) =>
      prev.map((bi) => {
        if (bi.id === issueId) {
          return {
            ...bi,
            returnDate: new Date().toISOString().slice(0, 10),
            fine,
            condition,
            status: 'Returned',
          };
        }
        return bi;
      })
    );
    const targetIssue = bookIssues.find((bi) => bi.id === issueId);
    if (targetIssue) {
      setBooks((prev) =>
        prev.map((b) =>
          b.id === targetIssue.bookId ? { ...b, availableQuantity: b.availableQuantity + 1 } : b
        )
      );
    }
    logAction(`Received Returned Library Book Issue ID: ${issueId}`, 'Library', issueId);
  };

  // Transport Fleet & Routes
  const addVehicle = (v: Omit<Vehicle, 'id'>) => {
    const newV: Vehicle = { ...v, id: `veh-${Date.now()}` };
    setVehicles((prev) => [...prev, newV]);
    logAction(`Added Fleet Vehicle: ${v.vehicleNumber} (${v.vehicleType})`, 'Transport', newV.id);
  };

  const updateVehicle = (id: string, v: Partial<Vehicle>) => {
    setVehicles((prev) => prev.map((item) => (item.id === id ? { ...item, ...v } : item)));
    logAction(`Updated Fleet Vehicle ID: ${id}`, 'Transport', id);
  };

  const deleteVehicle = (id: string) => {
    setVehicles((prev) => prev.filter((item) => item.id !== id));
    logAction(`Removed Fleet Vehicle ID: ${id}`, 'Transport', id);
  };

  const addRoute = (r: Omit<TransportRoute, 'id'>) => {
    const newR: TransportRoute = { ...r, id: `rt-${Date.now()}` };
    setRoutes((prev) => [...prev, newR]);
    logAction(`Created Transit Route: ${r.name}`, 'Transport', newR.id);
  };

  const updateRoute = (id: string, r: Partial<TransportRoute>) => {
    setRoutes((prev) => prev.map((item) => (item.id === id ? { ...item, ...r } : item)));
    logAction(`Updated Transit Route ID: ${id}`, 'Transport', id);
  };

  const deleteRoute = (id: string) => {
    setRoutes((prev) => prev.filter((item) => item.id !== id));
    logAction(`Removed Transit Route ID: ${id}`, 'Transport', id);
  };

  const addDriver = (d: Omit<Driver, 'id'>) => {
    const newD: Driver = { ...d, id: `drv-${Date.now()}` };
    setDrivers((prev) => [...prev, newD]);
    logAction(`Registered Driver: ${d.name}`, 'Transport', newD.id);
  };

  const updateDriver = (id: string, d: Partial<Driver>) => {
    setDrivers((prev) => prev.map((item) => (item.id === id ? { ...item, ...d } : item)));
    logAction(`Updated Driver ID: ${id}`, 'Transport', id);
  };

  // Inventory
  const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = { ...item, id: `inv-${Date.now()}` };
    setInventory((prev) => [...prev, newItem]);
    logAction(`Added Inventory Item: ${item.name}`, 'Inventory', newItem.id);
  };

  const updateStock = (id: string, delta: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
      )
    );
    logAction(`Stock adjustment on item ${id}: ${delta > 0 ? '+' : ''}${delta}`, 'Inventory', id);
  };

  // Leaves
  const submitLeave = (leave: Omit<LeaveRequest, 'id' | 'status' | 'appliedDate'>) => {
    const newLeave: LeaveRequest = {
      ...leave,
      id: `lv-${Date.now()}`,
      status: 'Pending',
      appliedDate: new Date().toISOString().slice(0, 10),
    };
    setLeaves((prev) => [newLeave, ...prev]);
    logAction(`Applied for ${leave.leaveType} leave`, 'HR', newLeave.id);
  };

  const updateLeaveStatus = (id: string, status: 'Approved' | 'Rejected', approverName: string) => {
    setLeaves((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status, approvedBy: approverName } : l))
    );
    logAction(`Leave application ${id} ${status} by ${approverName}`, 'HR', id);
  };

  // Payroll
  const generatePayroll = (payroll: Omit<PayrollRecord, 'id'>) => {
    const newPr: PayrollRecord = { ...payroll, id: `pr-${Date.now()}` };
    setPayrolls((prev) => [newPr, ...prev]);
    logAction(`Generated Monthly Payroll for ${payroll.employeeId}: Net Rs. ${payroll.netSalary}`, 'Payroll', newPr.id);
  };

  // Notices
  const addNotice = (notice: Omit<Notice, 'id'>) => {
    const newNot: Notice = { ...notice, id: `not-${Date.now()}` };
    setNotices((prev) => [newNot, ...prev]);
    logAction(`Published Notice: "${notice.title}" for ${notice.audience}`, 'Communication', newNot.id);
  };

  const deleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  // Messages
  const sendMessage = (msg: Omit<Message, 'id' | 'timestamp' | 'isRead'>) => {
    const newMsg: Message = {
      ...msg,
      id: `msg-${Date.now()}`,
      timestamp: 'Just now',
      isRead: false,
    };
    setMessages((prev) => [newMsg, ...prev]);
  };

  const markMessageRead = (id: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isRead: true } : m)));
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Assignments
  const addAssignment = (asg: Omit<Assignment, 'id'>) => {
    const newAsg: Assignment = { ...asg, id: `asg-${Date.now()}` };
    setAssignments((prev) => [newAsg, ...prev]);
    logAction(`Assigned homework: ${asg.title}`, 'Academics', newAsg.id);
  };

  // Backup & Reset
  const resetToDefaultData = () => {
    setSettings(initialSettings);
    setSessions(initialSessions);
    setClasses(initialClasses);
    setSections(initialSections);
    setSubjects(initialSubjects);
    setParents(initialParents);
    setStudents(initialStudents);
    setTeachers(initialTeachers);
    setStaff(initialStaff);
    setTimetable(initialTimetable);
    setStudentAttendance(initialStudentAttendance);
    setTeacherAttendance(initialTeacherAttendance);
    setFeeTypes(initialFeeTypes);
    setFeeStructures(initialFeeStructures);
    setFeePayments(initialFeePayments);
    setFeeDiscounts(initialFeeDiscounts);
    setExpenses(initialExpenses);
    setExams(initialExams);
    setMarks(initialMarks);
    setGradingRules(initialGradingRules);
    setBooks(initialBooks);
    setBookIssues(initialBookIssues);
    setDrivers(initialDrivers);
    setVehicles(initialVehicles);
    setRoutes(initialRoutes);
    setInventory(initialInventory);
    setLeaves(initialLeaves);
    setPayrolls(initialPayrolls);
    setNotices(initialNotices);
    setMessages(initialMessages);
    setNotifications(initialNotifications);
    setAssignments(initialAssignments);
    setAuditLogs(initialAuditLogs);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    logAction('Reset school database to factory seed data', 'System', 'factory_reset');
  };

  const exportDatabaseJSON = (): string => {
    const backupObj = {
      exportTimestamp: new Date().toISOString(),
      version: '1.0',
      settings,
      sessions,
      classes,
      sections,
      subjects,
      parents,
      students,
      teachers,
      staff,
      timetable,
      studentAttendance,
      feeTypes,
      feeStructures,
      feePayments,
      feeDiscounts,
      expenses,
      exams,
      marks,
      gradingRules,
      books,
      bookIssues,
      vehicles,
      drivers,
      routes,
      inventory,
      leaves,
      payrolls,
      notices,
      assignments,
      auditLogs,
    };
    return JSON.stringify(backupObj, null, 2);
  };

  const importDatabaseJSON = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.students && Array.isArray(data.students)) {
        if (data.settings) setSettings(data.settings);
        if (data.students) setStudents(data.students);
        if (data.teachers) setTeachers(data.teachers);
        if (data.parents) setParents(data.parents);
        if (data.classes) setClasses(data.classes);
        if (data.sections) setSections(data.sections);
        if (data.subjects) setSubjects(data.subjects);
        if (data.feePayments) setFeePayments(data.feePayments);
        if (data.marks) setMarks(data.marks);
        if (data.notices) setNotices(data.notices);
        logAction('Restored full database snapshot from backup file', 'System', 'backup_restore');
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        darkMode,
        setDarkMode,
        currentUser,
        switchRole,
        login,
        logout,
        demoUsers,
        activeTab,
        setActiveTab,
        globalSearch,
        setGlobalSearch,
        settings,
        updateSettings,
        sessions,
        setActiveSession,
        addSession,
        classes,
        addClass,
        updateClass,
        deleteClass,
        sections,
        addSection,
        updateSection,
        deleteSection,
        subjects,
        addSubject,
        updateSubject,
        deleteSubject,
        parents,
        addParent,
        updateParent,
        deleteParent,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        promoteStudents,
        teachers,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        staff,
        addStaff,
        updateStaff,
        deleteStaff,
        timetable,
        addTimetableSlot,
        deleteTimetableSlot,
        studentAttendance,
        saveStudentAttendance,
        teacherAttendance,
        saveTeacherAttendance,
        feeTypes,
        addFeeType,
        feeStructures,
        addFeeStructure,
        deleteFeeStructure,
        feePayments,
        collectFee,
        feeDiscounts,
        expenses,
        addExpense,
        exams,
        addExam,
        marks,
        saveMarks,
        gradingRules,
        updateGradingRules,
        books,
        addBook,
        bookIssues,
        issueBook,
        returnBook,
        vehicles,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        drivers,
        addDriver,
        updateDriver,
        routes,
        addRoute,
        updateRoute,
        deleteRoute,
        inventory,
        addInventoryItem,
        updateStock,
        leaves,
        submitLeave,
        updateLeaveStatus,
        payrolls,
        generatePayroll,
        notices,
        addNotice,
        deleteNotice,
        messages,
        sendMessage,
        markMessageRead,
        notifications,
        markNotificationRead,
        clearAllNotifications,
        assignments,
        addAssignment,
        auditLogs,
        logAction,
        resetToDefaultData,
        exportDatabaseJSON,
        importDatabaseJSON,
        users,
        updateUser,
        permissions,
        updatePermission,
        isClassTeacher,
        canRecordAttendance,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
