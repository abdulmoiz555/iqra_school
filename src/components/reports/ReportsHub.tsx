import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, Download, Printer, Users, DollarSign, Calendar, Award, BookOpen, FileSpreadsheet } from 'lucide-react';

export const ReportsHub: React.FC = () => {
  const {
    students,
    teachers,
    staff,
    classes,
    sections,
    feePayments,
    marks,
    exams,
    subjects,
    studentAttendance,
    settings,
    bookIssues,
    books,
  } = useApp();

  const [reportType, setReportType] = useState<'students' | 'fees' | 'attendance' | 'academics' | 'hr' | 'library'>('students');

  // Export helper
  const exportCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.map((cell) => `"${cell}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 relative">
      {/* Printable Watermark for Official School Reports */}
      {settings.logoUrl && (
        <img
          src={settings.logoUrl}
          alt="Watermark"
          className="hidden print:block fixed inset-0 m-auto w-96 h-96 object-contain opacity-10 pointer-events-none select-none z-0"
        />
      )}
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Institutional Analytics & Reports Hub
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Generate tabulated academic, demographic, financial and administrative reports with CSV export
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 cursor-pointer"
        >
          <Printer className="h-3.5 w-3.5" /> Print Current Report
        </button>
      </div>

      {/* Report Module Switcher */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-xs">
        {[
          { id: 'students', label: 'Student Demographics' },
          { id: 'fees', label: 'Fee Collections & Arrears' },
          { id: 'attendance', label: 'Attendance Rates' },
          { id: 'academics', label: 'Exam Performance' },
          { id: 'hr', label: 'HR & Payroll Ledger' },
          { id: 'library', label: 'Library Circulation' },
        ].map((r) => (
          <button
            key={r.id}
            onClick={() => setReportType(r.id as any)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              reportType === r.id
                ? 'bg-white text-blue-600 font-bold shadow-xs dark:bg-neutral-900 dark:text-blue-400'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Report 1: Student Demographics */}
      {reportType === 'students' && (
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Grade-Wise Student Distribution & Gender Ratio
              </h3>
              <p className="text-xs text-neutral-500 font-mono">Total Enrolled: {students.length} students</p>
            </div>
            <button
              onClick={() => {
                const headers = ['Class Name', 'Total Enrolled', 'Male', 'Female', 'Active'];
                const rows = classes.map((c) => {
                  const classStus = students.filter((s) => s.classId === c.id);
                  const m = classStus.filter((s) => s.gender === 'Male').length;
                  const f = classStus.filter((s) => s.gender === 'Female').length;
                  const act = classStus.filter((s) => s.status === 'Active').length;
                  return [c.name, classStus.length, m, f, act];
                });
                exportCSV('student_demographics_report', headers, rows);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 rounded-lg hover:bg-blue-100 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" /> Download CSV
            </button>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:border-neutral-700">
              <tr>
                <th className="py-2.5 px-3">Class Name</th>
                <th className="py-2.5 px-3 text-center">Enrolled</th>
                <th className="py-2.5 px-3 text-center">Male</th>
                <th className="py-2.5 px-3 text-center">Female</th>
                <th className="py-2.5 px-3 text-center">Active Enrolment</th>
                <th className="py-2.5 px-3 text-right">Ratio (% Female)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {classes.map((cls) => {
                const classStus = students.filter((s) => s.classId === cls.id);
                const m = classStus.filter((s) => s.gender === 'Male').length;
                const f = classStus.filter((s) => s.gender === 'Female').length;
                const act = classStus.filter((s) => s.status === 'Active').length;
                const pctF = classStus.length ? Math.round((f / classStus.length) * 100) : 0;

                return (
                  <tr key={cls.id}>
                    <td className="py-2.5 px-3 font-semibold text-neutral-900 dark:text-neutral-100">{cls.name}</td>
                    <td className="py-2.5 px-3 font-mono text-center font-bold">{classStus.length}</td>
                    <td className="py-2.5 px-3 font-mono text-center text-blue-600">{m}</td>
                    <td className="py-2.5 px-3 font-mono text-center text-rose-500">{f}</td>
                    <td className="py-2.5 px-3 font-mono text-center text-emerald-600">{act}</td>
                    <td className="py-2.5 px-3 font-mono text-right">{pctF}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Report 2: Fee Collections */}
      {reportType === 'fees' && (
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Monthly Fee Receipts & Outstanding Arrears Audit
              </h3>
              <p className="text-xs text-neutral-500 font-mono">
                Total Receipts: {feePayments.length} vouchers
              </p>
            </div>
            <button
              onClick={() => {
                const headers = ['Receipt #', 'Date', 'Month', 'Subtotal', 'Discount', 'Paid', 'Balance', 'Method'];
                const rows = feePayments.map((p) => [
                  p.receiptNumber,
                  p.date,
                  `${p.month} ${p.year}`,
                  p.subtotal,
                  p.discountAmount,
                  p.paidAmount,
                  p.balanceAmount,
                  p.paymentMethod,
                ]);
                exportCSV('fee_collection_report', headers, rows);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 rounded-lg hover:bg-blue-100 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" /> Download CSV
            </button>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:border-neutral-700">
              <tr>
                <th className="py-2.5 px-3">Receipt #</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3 text-right">Subtotal</th>
                <th className="py-2.5 px-3 text-right">Discount</th>
                <th className="py-2.5 px-3 text-right">Paid Amount</th>
                <th className="py-2.5 px-3 text-right">Balance Due</th>
                <th className="py-2.5 px-3">Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {feePayments.map((p) => {
                const s = students.find((st) => st.id === p.studentId);
                return (
                  <tr key={p.id}>
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">{p.receiptNumber}</td>
                    <td className="py-2.5 px-3 font-mono text-neutral-500">{p.date}</td>
                    <td className="py-2.5 px-3 font-semibold">{s ? `${s.firstName} ${s.lastName}` : 'N/A'}</td>
                    <td className="py-2.5 px-3 font-mono text-right">{settings.currencySymbol}{p.subtotal.toLocaleString()}</td>
                    <td className="py-2.5 px-3 font-mono text-right text-emerald-600">{p.discountAmount > 0 ? `-${settings.currencySymbol}${p.discountAmount}` : '—'}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-right">{settings.currencySymbol}{p.paidAmount.toLocaleString()}</td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-rose-600 text-right">{settings.currencySymbol}{p.balanceAmount.toLocaleString()}</td>
                    <td className="py-2.5 px-3">{p.paymentMethod}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Report 3: Attendance Rates */}
      {reportType === 'attendance' && (
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            Student Attendance Log Summary
          </h3>
          <p className="text-xs text-neutral-500">
            Total attendance records recorded: {studentAttendance.length}
          </p>

          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:border-neutral-700">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Class</th>
                <th className="py-2.5 px-3 text-center">Present</th>
                <th className="py-2.5 px-3 text-center">Absent</th>
                <th className="py-2.5 px-3 text-center">Late</th>
                <th className="py-2.5 px-3 text-center">Leave</th>
                <th className="py-2.5 px-3 text-right">Attendance Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {classes.slice(0, 5).map((cls) => {
                const recs = studentAttendance.filter((a) => a.classId === cls.id);
                const p = recs.filter((a) => a.status === 'Present').length;
                const ab = recs.filter((a) => a.status === 'Absent').length;
                const lt = recs.filter((a) => a.status === 'Late').length;
                const lv = recs.filter((a) => a.status === 'Leave').length;
                const tot = recs.length || 1;
                const rate = Math.round((p / tot) * 100);

                return (
                  <tr key={cls.id}>
                    <td className="py-2.5 px-3 font-mono">2026-09-28</td>
                    <td className="py-2.5 px-3 font-bold">{cls.name}</td>
                    <td className="py-2.5 px-3 font-mono text-center text-emerald-600 font-bold">{p}</td>
                    <td className="py-2.5 px-3 font-mono text-center text-rose-600 font-bold">{ab}</td>
                    <td className="py-2.5 px-3 font-mono text-center text-amber-600 font-bold">{lt}</td>
                    <td className="py-2.5 px-3 font-mono text-center text-blue-600 font-bold">{lv}</td>
                    <td className="py-2.5 px-3 font-mono text-right font-bold text-neutral-900 dark:text-neutral-100">{rate}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Report 4: Academics */}
      {reportType === 'academics' && (
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            Subject-Wise Examination Performance Breakdown
          </h3>
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:border-neutral-700">
              <tr>
                <th className="py-2.5 px-3">Subject</th>
                <th className="py-2.5 px-3">Code</th>
                <th className="py-2.5 px-3 text-center">Marks Entered</th>
                <th className="py-2.5 px-3 text-right">Average Score</th>
                <th className="py-2.5 px-3 text-right">Pass Percentage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {subjects.map((sub) => {
                const subMarks = marks.filter((m) => m.subjectId === sub.id);
                const count = subMarks.length || 1;
                const totalScore = subMarks.reduce((acc, m) => acc + m.obtainedMarks, 0);
                const avg = Math.round(totalScore / count);
                const passCount = subMarks.filter((m) => m.obtainedMarks >= sub.passingMarks).length;
                const passRate = Math.round((passCount / count) * 100);

                return (
                  <tr key={sub.id}>
                    <td className="py-2.5 px-3 font-bold">{sub.name}</td>
                    <td className="py-2.5 px-3 font-mono text-neutral-500">{sub.code}</td>
                    <td className="py-2.5 px-3 font-mono text-center">{subMarks.length}</td>
                    <td className="py-2.5 px-3 font-mono text-right font-bold">{avg} / {sub.maxMarks}</td>
                    <td className="py-2.5 px-3 font-mono text-right font-bold text-emerald-600">{passRate}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Report 5: HR */}
      {reportType === 'hr' && (
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            Campus Payroll & Staff Expenditure Audit
          </h3>
          <p className="text-xs text-neutral-500">
            Total faculty: {teachers.length} · Staff: {staff.length}
          </p>
          <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 font-mono text-xs space-y-2">
            <div className="flex justify-between">
              <span>Total Monthly Faculty Salary Commitment:</span>
              <strong className="text-neutral-900 dark:text-neutral-100">
                {settings.currencySymbol}{teachers.reduce((acc, t) => acc + t.salary, 0).toLocaleString()}
              </strong>
            </div>
            <div className="flex justify-between">
              <span>Total Administrative Staff Salary Commitment:</span>
              <strong className="text-neutral-900 dark:text-neutral-100">
                {settings.currencySymbol}{staff.reduce((acc, s) => acc + s.salary, 0).toLocaleString()}
              </strong>
            </div>
            <div className="flex justify-between border-t border-neutral-200 dark:border-neutral-700 pt-2 font-bold text-sm text-blue-600">
              <span>Combined Total Monthly Payroll:</span>
              <span>
                {settings.currencySymbol}{(teachers.reduce((acc, t) => acc + t.salary, 0) + staff.reduce((acc, s) => acc + s.salary, 0)).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Report 6: Library */}
      {reportType === 'library' && (
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            Library Book Circulation & Overdue Penalties
          </h3>
          <div className="grid grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <span className="text-neutral-400">Total Titles</span>
              <p className="text-lg font-bold mt-1">{books.length}</p>
            </div>
            <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <span className="text-neutral-400">Active Borrowers</span>
              <p className="text-lg font-bold mt-1 text-blue-600">{bookIssues.filter(b => b.status === 'Issued').length}</p>
            </div>
            <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <span className="text-neutral-400">Overdue Loans</span>
              <p className="text-lg font-bold mt-1 text-rose-600">{bookIssues.filter(b => b.status === 'Overdue').length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
