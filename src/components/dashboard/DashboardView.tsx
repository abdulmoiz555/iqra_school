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
  FileText,
  DollarSign,
  Award,
  BookOpen
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
    studentAttendance,
    feePayments,
    expenses,
    settings,
    notices,
    auditLogs,
    setActiveTab,
    currentUser,
  } = useApp();

  // Computations
  const activeStudents = students.filter((s) => s.status === 'Active');
  const maleStudents = students.filter((s) => s.gender === 'Male').length;
  const femaleStudents = students.filter((s) => s.gender === 'Female').length;

  const totalCollected = feePayments.reduce((acc, p) => acc + p.paidAmount, 0);
  const totalArrears = feePayments.reduce((acc, p) => acc + p.balanceAmount, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);

  // Today's attendance stats
  const presentCount = studentAttendance.filter((a) => a.status === 'Present').length;
  const absentCount = studentAttendance.filter((a) => a.status === 'Absent').length;
  const lateCount = studentAttendance.filter((a) => a.status === 'Late').length;
  const leaveCount = studentAttendance.filter((a) => a.status === 'Leave').length;
  const totalMarked = studentAttendance.length || 1;
  const attendanceRate = Math.round((presentCount / totalMarked) * 100);

  // Quick Action Handler
  const quickActions = [
    { id: 'add-student', label: '+ Add Student', tab: 'students', icon: GraduationCap, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400' },
    { id: 'collect-fee', label: '+ Collect Fee', tab: 'fees', icon: CreditCard, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400' },
    { id: 'take-attendance', label: '+ Take Attendance', tab: 'attendance', icon: CalendarCheck, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-400' },
    { id: 'add-teacher', label: '+ Add Teacher', tab: 'teachers', icon: Users, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400' },
    { id: 'enter-marks', label: '+ Enter Marks', tab: 'examinations', icon: Award, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400' },
    { id: 'add-notice', label: '+ Add Notice', tab: 'communication', icon: AlertCircle, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Welcome back, {currentUser.name}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-2 mt-0.5">
            <span>Role: <strong className="text-neutral-700 dark:text-neutral-300 font-medium">{currentUser.role}</strong></span>
            <span>·</span>
            <span>Academic Year: <strong className="text-blue-600 dark:text-blue-400 font-mono">{settings.activeSession}</strong></span>
            <span>·</span>
            <span>Campus: {settings.schoolName}</span>
          </p>
        </div>

        {/* Quick action buttons for Admin & Staff */}
        {['Super Admin', 'Admin', 'Accountant', 'Teacher'].includes(currentUser.role) && (
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
      </div>

      {/* KPI Cards Grid */}
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
            <span>Leave: {leaveCount}</span>
          </div>
        </div>

        {/* Fee Collection Card */}
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
      </div>

      {/* Main Charts & Visualizations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Fee Collection Trend Bar Chart */}
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
                  {/* Fee Bar */}
                  <div
                    style={{ height: `${(d.fee / 350) * 100}%` }}
                    className="w-1/2 max-w-[28px] rounded-t-xs bg-blue-600 group-hover:bg-blue-500 transition-all"
                  />
                  {/* Expense Bar */}
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

        {/* Student Demographics & Attendance Ring Breakdown */}
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Student Gender Ratio
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
              Enrolment balance across all classes
            </p>

            {/* Ratio visualization bar */}
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
                Today's Daily Attendance Status
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
                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300">
                  <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">Late Arrival</div>
                  <div className="text-base font-bold font-mono">{lateCount}</div>
                </div>
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300">
                  <div className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">Official Leave</div>
                  <div className="text-base font-bold font-mono">{leaveCount}</div>
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

      {/* Two Columns: Recent Activities & Notice Board */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent System Activity Log */}
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Recent School Activity & Audit Log
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Verified operations by staff, teachers and administrators
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
    </div>
  );
};
