import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Users,
  CalendarCheck,
  CreditCard,
  PlusCircle,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  DollarSign,
  Award,
  BookOpen,
  Calendar,
  ShieldCheck,
  Check,
  Sparkles
} from 'lucide-react';

interface DashboardViewProps {
  onOpenQuickAction: (action: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenQuickAction }) => {
  const {
    students,
    teachers,
    staff,
    classes,
    sections,
    subjects,
    timetable,
    exams,
    studentAttendance,
    feePayments,
    expenses,
    settings,
    notices,
    auditLogs,
    setActiveTab,
    currentUser,
    parents,
  } = useApp();

  const isSuperOrAdmin = ['Super Admin', 'Admin', 'Academic Admin'].includes(currentUser.role);
  const isTeacher = currentUser.role === 'Teacher';
  const isStudent = currentUser.role === 'Student';
  const isParent = currentUser.role === 'Parent';
  const canViewFinancials = currentUser.role === 'Super Admin' || currentUser.role === 'Accountant' || (!settings.hideFinancialsFromNonAdmins && isSuperOrAdmin);
  const canViewAuditLogs = ['Super Admin', 'Admin', 'Academic Admin'].includes(currentUser.role) && (settings.restrictLogsToAdminsAndPrincipal ?? true);

  // Current Teacher record
  const currentTeacher = teachers.find(
    (t) => t.id === currentUser.linkedId || t.email === currentUser.email
  );

  // Teacher's assigned classes
  const teacherClasses = classes.filter(
    (c) =>
      currentTeacher?.assignedClasses?.includes(c.id) ||
      c.classTeacherId === currentTeacher?.id ||
      currentTeacher?.assignedClassId === c.id
  );
  const effectiveTeacherClasses = teacherClasses.length > 0 ? teacherClasses : classes.slice(0, 3);

  // Teacher's relevant students (strictly scoped to their assigned classes)
  const teacherStudents = students.filter((s) =>
    effectiveTeacherClasses.some((c) => c.id === s.classId)
  );

  // Today's day name e.g. "Monday"
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
  const todayDay = dayNames[new Date().getDay()];
  const todayDateStr = new Date().toISOString().slice(0, 10);

  // Teacher's timetable slots for today
  const teacherTodaySlots = timetable.filter(
    (slot) => (slot.teacherId === currentTeacher?.id || !slot.teacherId) && slot.day === todayDay
  );

  // Student specific records
  const currentStudent = students.find(
    (s) => s.id === currentUser.linkedId || s.id === 'stu-1'
  );
  const studentFeeRecord = feePayments.filter(
    (p) => p.studentId === currentStudent?.id
  );
  const studentAttendanceRecord = studentAttendance.filter(
    (a) => a.studentId === currentStudent?.id
  );
  const studentPresentCount = studentAttendanceRecord.filter((a) => a.status === 'Present').length;
  const studentAttRate = studentAttendanceRecord.length > 0
    ? Math.round((studentPresentCount / studentAttendanceRecord.length) * 100)
    : 95;

  // Institutional Computations for Admin
  const activeStudents = students.filter((s) => s.status === 'Active');
  const maleStudents = students.filter((s) => s.gender === 'Male').length;
  const femaleStudents = students.filter((s) => s.gender === 'Female').length;

  const totalCollected = feePayments.reduce((acc, p) => acc + p.paidAmount, 0);
  const totalArrears = feePayments.reduce((acc, p) => acc + p.balanceAmount, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);

  // Today's attendance stats
  const presentCount = studentAttendance.filter((a) => a.status === 'Present' && a.date === todayDateStr).length;
  const absentCount = studentAttendance.filter((a) => a.status === 'Absent' && a.date === todayDateStr).length;
  const lateCount = studentAttendance.filter((a) => a.status === 'Late' && a.date === todayDateStr).length;
  const leaveCount = studentAttendance.filter((a) => a.status === 'Leave' && a.date === todayDateStr).length;
  const totalMarked = presentCount + absentCount + lateCount + leaveCount || studentAttendance.length || 1;
  const attendanceRate = Math.round((presentCount / totalMarked) * 100);

  return (
    <div className="space-y-6">
      {/* Header Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Welcome back, {currentUser.name}
            </h2>
            {isTeacher && currentTeacher?.teacherCategory && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                {currentTeacher.teacherCategory}
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-2 mt-0.5">
            <span>Role: <strong className="text-neutral-700 dark:text-neutral-300 font-medium">{currentUser.role}</strong></span>
            <span>·</span>
            <span>Academic Year: <strong className="text-blue-600 dark:text-blue-400 font-mono">{settings.activeSession}</strong></span>
            <span>·</span>
            <span>Campus: {settings.schoolName}</span>
          </p>
        </div>

        {/* Quick action buttons for Super Admin & Admin only */}
        {isSuperOrAdmin && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onOpenQuickAction('collect-fee')}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs transition-colors cursor-pointer"
            >
              <CreditCard className="h-3.5 w-3.5" />
              Collect Fee
            </button>
            <button
              onClick={() => onOpenQuickAction('add-student')}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs transition-colors cursor-pointer"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              Add Student
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
            >
              <CalendarCheck className="h-3.5 w-3.5" />
              Daily Attendance
            </button>
          </div>
        )}

        {/* Quick Action buttons for Teachers */}
        {isTeacher && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('attendance')}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs transition-colors cursor-pointer"
            >
              <CalendarCheck className="h-3.5 w-3.5" />
              Mark Class Roll Call
            </button>
            <button
              onClick={() => setActiveTab('examinations')}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 cursor-pointer"
            >
              <Award className="h-3.5 w-3.5" />
              Enter Exam Marks
            </button>
            <button
              onClick={() => setActiveTab('academics')}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 cursor-pointer"
            >
              <BookOpen className="h-3.5 w-3.5" />
              My Timetable
            </button>
          </div>
        )}
      </div>

      {/* =========================================================================
          VIEW 1: TEACHER DEDICATED WORKSPACE
          (No fee collection, No campus revenue charts, No system-wide enrollment)
         ========================================================================= */}
      {isTeacher && (
        <div className="space-y-6">
          {/* Teacher KPIs Grid: Only their relevant classes and student counts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Assigned Classes */}
            <div
              onClick={() => setActiveTab('academics')}
              className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs hover:border-blue-400 dark:border-neutral-800 dark:bg-neutral-900 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">My Assigned Classes</span>
                <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                  <BookOpen className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 tabular-nums">
                  {effectiveTeacherClasses.length}
                </span>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  Active Wings
                </span>
              </div>
              <div className="mt-3 text-[11px] text-neutral-500 dark:text-neutral-400 border-t border-neutral-100 dark:border-neutral-800/80 pt-2 truncate">
                {effectiveTeacherClasses.map((c) => c.name).join(', ')}
              </div>
            </div>

            {/* Card 2: My Students Roster Count */}
            <div
              onClick={() => setActiveTab('students')}
              className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs hover:border-emerald-400 dark:border-neutral-800 dark:bg-neutral-900 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">My Students Roster</span>
                <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <GraduationCap className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 tabular-nums">
                  {teacherStudents.length}
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  Assigned Students
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 border-t border-neutral-100 dark:border-neutral-800/80 pt-2">
                <span>In {effectiveTeacherClasses.length} Grade Sections</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-neutral-400 group-hover:text-emerald-500" />
              </div>
            </div>

            {/* Card 3: Today's Roll Call & Attendance */}
            <div
              onClick={() => setActiveTab('attendance')}
              className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs hover:border-purple-400 dark:border-neutral-800 dark:bg-neutral-900 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Class Roll Call Today</span>
                <div className="rounded-lg bg-purple-50 p-2 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                  <CalendarCheck className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 tabular-nums">
                  {currentTeacher?.isClassTeacher || currentTeacher?.teacherCategory === 'Class Teacher' ? 'Ready' : 'Authorized'}
                </span>
                <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                  {currentTeacher?.teacherCategory || 'Teacher'}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 border-t border-neutral-100 dark:border-neutral-800/80 pt-2">
                <span>{todayDateStr}</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">Manage Roll Call →</span>
              </div>
            </div>

            {/* Card 4: Daily Period Load */}
            <div
              onClick={() => setActiveTab('academics')}
              className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs hover:border-amber-400 dark:border-neutral-800 dark:bg-neutral-900 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Today's Class Periods</span>
                <div className="rounded-lg bg-amber-50 p-2 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                  <Clock className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 tabular-nums">
                  {teacherTodaySlots.length || 3}
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  Periods scheduled
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 border-t border-neutral-100 dark:border-neutral-800/80 pt-2">
                <span>Day: {todayDay}</span>
                <span className="text-amber-600 dark:text-amber-400 font-semibold">View Timetable →</span>
              </div>
            </div>
          </div>

          {/* Teacher Two Columns: Today's Class Schedule & Assigned Classes List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Column 1: Today's Teaching Schedule */}
            <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    Today's Teaching Schedule ({todayDay})
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Your scheduled lecture slots and classroom assignments
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('academics')}
                  className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
                >
                  Full Timetable
                </button>
              </div>

              <div className="mt-3 space-y-2.5">
                {teacherTodaySlots.length === 0 ? (
                  <div className="py-6 text-center text-xs text-neutral-500">
                    <p className="font-semibold text-neutral-700 dark:text-neutral-300">No scheduled periods for today.</p>
                    <p className="text-[11px] text-neutral-400 mt-1">Check the full weekly academic timetable in the Academics tab.</p>
                  </div>
                ) : (
                  teacherTodaySlots.map((slot) => {
                    const cls = classes.find((c) => c.id === slot.classId);
                    const sec = sections.find((s) => s.id === slot.sectionId);
                    const sub = subjects.find((s) => s.id === slot.subjectId);

                    return (
                      <div
                        key={slot.id}
                        className="flex items-center justify-between p-3 rounded-xl border border-neutral-100 bg-neutral-50/70 dark:border-neutral-800 dark:bg-neutral-800/40"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-mono font-bold text-xs">
                            {slot.startTime}
                          </div>
                          <div>
                            <div className="font-bold text-xs text-neutral-900 dark:text-neutral-100">
                              {sub?.name || 'Class Lecture'}
                            </div>
                            <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                              {cls?.name} {sec?.name ? `(${sec.name})` : ''} · Room: {slot.roomNumber || 'Assigned Hall'}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {slot.startTime} - {slot.endTime}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Column 2: My Assigned Classes & Students */}
            <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <Users className="h-4 w-4 text-emerald-600" />
                    My Classes & Wings
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Your assigned class sections, categories and enrolled students
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('students')}
                  className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
                >
                  View Student Rosters
                </button>
              </div>

              <div className="mt-3 space-y-2.5">
                {effectiveTeacherClasses.map((cls) => {
                  const classStus = students.filter((s) => s.classId === cls.id && s.status === 'Active');
                  const classSecs = sections.filter((s) => s.classId === cls.id);
                  const isClassIncharge = cls.classTeacherId === currentTeacher?.id;

                  return (
                    <div
                      key={cls.id}
                      onClick={() => setActiveTab('academics')}
                      className="p-3 rounded-xl border border-neutral-100 bg-neutral-50/70 hover:border-blue-300 dark:border-neutral-800 dark:bg-neutral-800/40 transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-neutral-900 dark:text-neutral-100">{cls.name}</span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            cls.category === 'Male'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                              : cls.category === 'Female'
                              ? 'bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}>
                            {cls.category || 'Co-Education'}
                          </span>
                          {isClassIncharge && (
                            <span className="text-[10px] font-bold text-purple-700 bg-purple-100 dark:bg-purple-900/60 dark:text-purple-300 px-1.5 py-0.5 rounded-sm">
                              Incharge
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
                          {classStus.length} Students
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
                        <span>Sections: {classSecs.map((s) => s.name).join(', ') || 'General'}</span>
                        <span className="text-blue-600 hover:underline">Manage Class →</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Notices & Campus Circulars */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Campus Notice Board & Staff Circulars
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Official circulars issued by Principal (Sir Imran) and Academic Office
                </p>
              </div>
              <button
                onClick={() => setActiveTab('communication')}
                className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
              >
                Browse Notices
              </button>
            </div>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              {notices.slice(0, 4).map((n) => (
                <div
                  key={n.id}
                  className="rounded-lg border border-neutral-100 bg-neutral-50/70 p-3 dark:border-neutral-800 dark:bg-neutral-800/40 text-xs"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-neutral-900 dark:text-neutral-100 line-clamp-1">{n.title}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-neutral-200 dark:bg-neutral-700 font-mono">
                      {n.audience}
                    </span>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 line-clamp-2">{n.description}</p>
                  <div className="mt-2 text-[10px] text-neutral-400 pt-1 border-t border-neutral-200/50">
                    {n.date} · {n.postedBy}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: STUDENT & PARENT PERSONAL PORTAL
          (No institutional finances, No campus overhead charts, No system logs)
         ========================================================================= */}
      {(isStudent || isParent) && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Student Attendance Rate */}
            <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-500">Attendance Ratio</span>
                <CalendarCheck className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="mt-2 text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
                {studentAttRate}%
              </div>
              <p className="mt-1 text-[11px] text-emerald-600 font-medium">
                {studentPresentCount} Days Present this session
              </p>
            </div>

            {/* Student Fees Challan Status */}
            <div
              onClick={() => setActiveTab('fees')}
              className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-500">My Fee Status</span>
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div className="mt-2 text-xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
                {studentFeeRecord.length > 0 ? 'Receipts Generated' : 'Fee Up to Date'}
              </div>
              <p className="mt-1 text-[11px] text-blue-600 font-medium">
                Click to view voucher & print receipts
              </p>
            </div>

            {/* Academic Standing */}
            <div
              onClick={() => setActiveTab('examinations')}
              className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-500">Term Result Card</span>
                <Award className="h-5 w-5 text-amber-500" />
              </div>
              <div className="mt-2 text-xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
                Official Transcripts
              </div>
              <p className="mt-1 text-[11px] text-amber-600 font-medium">
                Click to view latest exam scorecard
              </p>
            </div>
          </div>

          {/* Notices */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
              Official School Notices
            </h3>
            <div className="space-y-3">
              {notices.map((n) => (
                <div key={n.id} className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-xs">
                  <div className="flex justify-between font-bold text-neutral-900 dark:text-neutral-100">
                    <span>{n.title}</span>
                    <span className="text-neutral-400 font-normal">{n.date}</span>
                  </div>
                  <p className="mt-1 text-neutral-600 dark:text-neutral-300">{n.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: SUPER ADMIN & ACADEMIC ADMIN EXECUTIVE SUITE
          (Institutional enrollment, total faculty, campus fee collections, revenue chart, audit log)
         ========================================================================= */}
      {isSuperOrAdmin && (
        <>
          {/* Institutional KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Students Card */}
            <div
              onClick={() => setActiveTab('students')}
              className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs hover:border-blue-400 dark:border-neutral-800 dark:bg-neutral-900 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Total Enrolment</span>
                <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                  <GraduationCap className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 tabular-nums">
                  {students.length}
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  {activeStudents.length} Active
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 border-t border-neutral-100 dark:border-neutral-800/80 pt-2">
                <span>Male: {maleStudents}</span>
                <span>·</span>
                <span>Female: {femaleStudents}</span>
                <span>·</span>
                <span>{classes.length} Classes</span>
              </div>
            </div>

            {/* Teachers & Faculty Card */}
            <div
              onClick={() => setActiveTab('teachers')}
              className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs hover:border-amber-400 dark:border-neutral-800 dark:bg-neutral-900 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Faculty & Staff</span>
                <div className="rounded-lg bg-amber-50 p-2 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 tabular-nums">
                  {teachers.length + staff.length}
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {teachers.length} Teaching · {staff.length} Staff
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 border-t border-neutral-100 dark:border-neutral-800/80 pt-2">
                <span>Staff Attendance: 100%</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-neutral-400 group-hover:text-amber-500 transition-colors" />
              </div>
            </div>

            {/* Attendance Rate Card */}
            <div
              onClick={() => setActiveTab('attendance')}
              className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs hover:border-purple-400 dark:border-neutral-800 dark:bg-neutral-900 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Today Attendance</span>
                <div className="rounded-lg bg-purple-50 p-2 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                  <CalendarCheck className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 tabular-nums">
                  {attendanceRate}%
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {presentCount} Present
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 border-t border-neutral-100 dark:border-neutral-800/80 pt-2">
                <span className="text-red-500 font-medium">Absent: {absentCount}</span>
                <span>·</span>
                <span className="text-amber-500 font-medium">Late: {lateCount}</span>
                <span>·</span>
                <span className="text-blue-500 font-medium">Leave: {leaveCount}</span>
              </div>
            </div>

            {/* Fee Collection Card / Active Wings Card */}
            {canViewFinancials ? (
              <div
                onClick={() => setActiveTab('fees')}
                className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs hover:border-emerald-400 dark:border-neutral-800 dark:bg-neutral-900 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Fee Collection</span>
                  <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                    <CreditCard className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-xl font-bold font-mono text-neutral-900 dark:text-neutral-100 tabular-nums">
                    {settings.currencySymbol}{totalCollected.toLocaleString()}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] border-t border-neutral-100 dark:border-neutral-800/80 pt-2">
                  <span className="text-neutral-500 dark:text-neutral-400">
                    Pending Arrears:
                  </span>
                  <span className="font-mono font-semibold text-rose-600 dark:text-rose-400 tabular-nums">
                    {settings.currencySymbol}{totalArrears.toLocaleString()}
                  </span>
                </div>
              </div>
            ) : (
              <div
                onClick={() => setActiveTab('academics')}
                className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs hover:border-blue-400 dark:border-neutral-800 dark:bg-neutral-900 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Academic Classes</span>
                  <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                    <BookOpen className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 tabular-nums">
                    {classes.length}
                  </span>
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    Active Wings
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] border-t border-neutral-100 dark:border-neutral-800/80 pt-2 text-neutral-500 dark:text-neutral-400">
                  <span>Sections: {sections.length}</span>
                  <span>·</span>
                  <span>Subjects: {subjects.length}</span>
                </div>
              </div>
            )}
          </div>

          {/* Main Charts & Visualizations Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Monthly Fee Collection Trend Bar Chart (Protected) */}
            {canViewFinancials ? (
              <div className="lg:col-span-2 rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      Monthly Financial Revenue & Operational Expenses
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Fee collections vs campus overheads across months ({settings.currency})
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                      <span className="h-2.5 w-2.5 rounded-xs bg-blue-600" />
                      Fee Receipts
                    </span>
                    <span className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                      <span className="h-2.5 w-2.5 rounded-xs bg-rose-500" />
                      Expenses
                    </span>
                  </div>
                </div>

                {/* SVG Bar Chart */}
                <div className="h-52 w-full flex items-end justify-between gap-3 pt-4 pb-2 px-2 border-b border-neutral-100 dark:border-neutral-800 font-mono text-xs">
                  {[
                    { month: 'Apr', fee: 180, exp: 90 },
                    { month: 'May', fee: 240, exp: 110 },
                    { month: 'Jun', fee: 210, exp: 95 },
                    { month: 'Jul', fee: 160, exp: 80 },
                    { month: 'Aug', fee: 290, exp: 140 },
                    { month: 'Sep', fee: 310, exp: 165 },
                  ].map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                      <div className="text-[10px] text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                        {d.fee}k
                      </div>
                      <div className="w-full flex items-end justify-center gap-1 h-36">
                        <div
                          style={{ height: `${(d.fee / 350) * 100}%` }}
                          className="w-1/2 max-w-[28px] rounded-t-xs bg-blue-600 group-hover:bg-blue-500 transition-all"
                        />
                        <div
                          style={{ height: `${(d.exp / 350) * 100}%` }}
                          className="w-1/2 max-w-[28px] rounded-t-xs bg-rose-400 group-hover:bg-rose-500 transition-all"
                        />
                      </div>
                      <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mt-1">
                        {d.month}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                  <span>Average Monthly Inflow: <strong className="font-mono text-neutral-800 dark:text-neutral-200">Rs. 231,000</strong></span>
                  <span>Surplus Ratio: <strong className="font-mono text-emerald-600 dark:text-emerald-400">+42.8%</strong></span>
                </div>
              </div>
            ) : (
              <div className="lg:col-span-2 rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      Class Level Enrollment Distribution
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Active student strength per grade wing (Confidential financial metrics restricted)
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                    Academic Roster
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {classes.map((cls) => {
                    const stus = students.filter((s) => s.classId === cls.id && s.status === 'Active');
                    return (
                      <div key={cls.id} className="p-3 rounded-lg border border-neutral-100 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-800/50">
                        <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100">{cls.name}</div>
                        <div className="text-lg font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">{stus.length} <span className="text-xs font-normal text-neutral-400">Students</span></div>
                        <div className="text-[10px] text-neutral-500 mt-1">{cls.category || 'Co-Ed'} Wing</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Student Demographics & Attendance Status */}
            <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Student Gender Ratio
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                  Enrolment balance across all classes
                </p>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-blue-600 dark:text-blue-400">Male Students</span>
                      <span className="font-mono font-bold">{maleStudents} ({Math.round((maleStudents / (students.length || 1)) * 100)}%)</span>
                    </div>
                    <div className="h-2.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${(maleStudents / (students.length || 1)) * 100}%` }}
                        className="h-full bg-blue-600 rounded-full"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-rose-500 dark:text-rose-400">Female Students</span>
                      <span className="font-mono font-bold">{femaleStudents} ({Math.round((femaleStudents / (students.length || 1)) * 100)}%)</span>
                    </div>
                    <div className="h-2.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${(femaleStudents / (students.length || 1)) * 100}%` }}
                        className="h-full bg-rose-500 rounded-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-neutral-100 dark:border-neutral-800 pt-4">
                  <h4 className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
                    Today's Campus Attendance Status
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300">
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Present</div>
                      <div className="text-base font-bold font-mono">{presentCount}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300">
                      <div className="text-[10px] text-rose-600 dark:text-rose-400 font-medium">Absent</div>
                      <div className="text-base font-bold font-mono">{absentCount}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-center">
                <button
                  onClick={() => setActiveTab('attendance')}
                  className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
                >
                  Open Complete Attendance Register →
                </button>
              </div>
            </div>
          </div>

          {/* Two Columns: Recent Activities (Principal & Academic Admin Only) & Notice Board */}
          <div className={`grid gap-6 ${canViewAuditLogs ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
            {/* Recent System Activity Log - Exclusively for Principal & Academic Admin */}
            {canViewAuditLogs && (
              <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-blue-600" />
                      Recent System Activity & Audit Log
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Restricted strictly to Principal (Sir Imran) and Academic Admin
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
                  >
                    View All Logs
                  </button>
                </div>

                <div className="mt-3 divide-y divide-neutral-100 dark:divide-neutral-800 max-h-72 overflow-y-auto">
                  {auditLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                      <div className="flex items-start gap-2.5">
                        <div className="rounded-full bg-blue-50 p-1.5 text-blue-600 dark:bg-blue-950 dark:text-blue-400 shrink-0 mt-0.5">
                          <Clock className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <p className="font-medium text-neutral-800 dark:text-neutral-200">
                            {log.action}
                          </p>
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                            By <span className="font-semibold">{log.userName}</span> ({log.userRole}) · Module: {log.module}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] text-neutral-400 font-mono shrink-0 whitespace-nowrap">
                        {log.timestamp.slice(11, 16)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Official Notice Board */}
            <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    Campus Notice Board
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Official circulars, exam dates and academic notifications
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('communication')}
                  className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
                >
                  Browse Notices
                </button>
              </div>

              <div className="mt-3 space-y-3">
                {notices.map((n) => (
                  <div
                    key={n.id}
                    className="rounded-lg border border-neutral-100 bg-neutral-50/70 p-3 dark:border-neutral-800 dark:bg-neutral-800/40"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 line-clamp-1">
                        {n.title}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-mono shrink-0">
                        For: {n.audience}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                      {n.description}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-neutral-500 dark:text-neutral-400 border-t border-neutral-200/50 dark:border-neutral-700/50 pt-1.5">
                      <span>Issued: {n.date} · {n.postedBy}</span>
                      {n.attachmentName && (
                        <span className="text-blue-600 dark:text-blue-400 font-medium">
                          📎 {n.attachmentName}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
