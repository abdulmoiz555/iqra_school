import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import {
  X,
  Printer,
  CreditCard,
  GraduationCap,
  Calendar,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  FileText,
  Clock,
  Shield,
  Award,
  DollarSign,
  Download
} from 'lucide-react';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onGenerateIdCard: (student: Student) => void;
  onPrintResultCard?: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  student,
  onGenerateIdCard,
}) => {
  const {
    classes,
    sections,
    parents,
    feePayments,
    marks,
    exams,
    subjects,
    studentAttendance,
    settings,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'fees' | 'exams' | 'attendance' | 'documents'>('overview');

  if (!isOpen || !student) return null;

  const cls = classes.find((c) => c.id === student.classId);
  const sec = sections.find((s) => s.id === student.sectionId);
  const parent = parents.find((p) => p.id === student.parentId);

  // Student specific fee payments
  const studentPayments = feePayments.filter((p) => p.studentId === student.id);
  const totalPaid = studentPayments.reduce((acc, p) => acc + p.paidAmount, 0);
  const totalBalance = studentPayments.reduce((acc, p) => acc + p.balanceAmount, 0);

  // Student marks
  const studentMarks = marks.filter((m) => m.studentId === student.id);

  // Attendance stats
  const attendanceRecords = studentAttendance.filter((a) => a.studentId === student.id);
  const presentCount = attendanceRecords.filter((a) => a.status === 'Present').length;
  const absentCount = attendanceRecords.filter((a) => a.status === 'Absent').length;
  const totalMarked = attendanceRecords.length || 1;
  const attendanceRate = Math.round((presentCount / totalMarked) * 100);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4 overflow-y-auto">
      <div className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Student Profile & Comprehensive Record
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onGenerateIdCard(student)}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 cursor-pointer"
            >
              <CreditCard className="h-3.5 w-3.5" />
              ID Card
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              Print
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Hero Card with Student Overview */}
        <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-200 dark:bg-neutral-800/50 dark:border-neutral-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {student.photoUrl ? (
                <img
                  src={student.photoUrl}
                  alt={student.firstName}
                  className="h-16 w-16 rounded-xl object-cover border-2 border-white shadow-xs dark:border-neutral-700"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-600 text-white text-lg font-bold">
                  {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                    {student.firstName} {student.middleName ? student.middleName + ' ' : ''}{student.lastName}
                  </h3>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-sm">
                    {student.status}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                  <span>Adm: <strong className="text-neutral-800 dark:text-neutral-200">{student.admissionNumber}</strong></span>
                  <span>·</span>
                  <span>Roll: <strong className="text-neutral-800 dark:text-neutral-200">{student.rollNumber}</strong></span>
                  <span>·</span>
                  <span>Class: <strong className="text-blue-600 dark:text-blue-400">{cls?.name} ({sec?.name})</strong></span>
                  <span>·</span>
                  <span>Category: <strong className="text-cyan-600 dark:text-cyan-400">{student.category || 'Co-Education'}</strong></span>
                  {student.siblingDiscountPercent && student.siblingDiscountPercent > 0 && (
                    <>
                      <span>·</span>
                      <span className="text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded-sm">
                        👨‍👧 {student.siblingDiscountPercent}% Sibling Concession
                      </span>
                    </>
                  )}
                  {student.scholarshipName && student.scholarshipName !== 'None' && (
                    <>
                      <span>·</span>
                      <span className="text-purple-600 font-bold bg-purple-50 dark:bg-purple-950/50 px-1.5 py-0.5 rounded-sm">
                        🎓 {student.scholarshipName}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Quick KPI stats */}
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="rounded-lg bg-white p-2.5 border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-700 text-center min-w-[90px]">
                <div className="text-[10px] text-neutral-400">Total Paid</div>
                <div className="font-bold text-emerald-600 dark:text-emerald-400">
                  {settings.currencySymbol}{totalPaid.toLocaleString()}
                </div>
              </div>
              <div className="rounded-lg bg-white p-2.5 border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-700 text-center min-w-[90px]">
                <div className="text-[10px] text-neutral-400">Pending Due</div>
                <div className={`font-bold ${totalBalance > 0 ? 'text-rose-600' : 'text-neutral-400'}`}>
                  {settings.currencySymbol}{totalBalance.toLocaleString()}
                </div>
              </div>
              <div className="rounded-lg bg-white p-2.5 border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-700 text-center min-w-[90px]">
                <div className="text-[10px] text-neutral-400">Attendance</div>
                <div className="font-bold text-blue-600 dark:text-blue-400">
                  {attendanceRate}%
                </div>
              </div>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="mt-4 flex items-center gap-2 border-t border-neutral-200/80 pt-3 dark:border-neutral-700/80 text-xs">
            {[
              { id: 'overview', label: 'Biographical & Family' },
              { id: 'fees', label: `Fee Ledger (${studentPayments.length})` },
              { id: 'exams', label: `Exam Results (${studentMarks.length})` },
              { id: 'attendance', label: `Attendance Log (${attendanceRecords.length})` },
              { id: 'documents', label: 'Documents & Verification' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveSubTab(t.id as any)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeSubTab === t.id
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-neutral-600 hover:bg-neutral-200/60 dark:text-neutral-400 dark:hover:bg-neutral-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeSubTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Biographical Details */}
              <div className="rounded-xl border border-neutral-200 p-4 space-y-3 dark:border-neutral-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 border-b border-neutral-100 pb-2 dark:border-neutral-800">
                  Student Identification
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Date of Birth:</span>
                    <span className="font-mono font-medium text-neutral-900 dark:text-neutral-100">{student.dateOfBirth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">B-Form / CNIC:</span>
                    <span className="font-mono font-medium text-neutral-900 dark:text-neutral-100">{student.bFormCnic}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Blood Group:</span>
                    <span className="font-mono font-medium text-rose-600 dark:text-rose-400">{student.bloodGroup}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Religion:</span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">{student.religion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Admission Date:</span>
                    <span className="font-mono font-medium text-neutral-900 dark:text-neutral-100">{student.admissionDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Previous School:</span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">{student.previousSchool || 'Direct Entry'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Emergency Contact:</span>
                    <span className="font-mono font-medium text-neutral-900 dark:text-neutral-100">{student.emergencyContact}</span>
                  </div>
                </div>
              </div>

              {/* Guardian & Residential Details */}
              <div className="rounded-xl border border-neutral-200 p-4 space-y-3 dark:border-neutral-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 border-b border-neutral-100 pb-2 dark:border-neutral-800">
                  Parent & Residential Record
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Father Name:</span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">{parent?.fatherName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Mother Name:</span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">{parent?.motherName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Father CNIC:</span>
                    <span className="font-mono font-medium text-neutral-900 dark:text-neutral-100">{parent?.cnic || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Parent Occupation:</span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">{parent?.occupation || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Parent Mobile:</span>
                    <span className="font-mono font-medium text-neutral-900 dark:text-neutral-100">{parent?.phone || student.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Parent Email:</span>
                    <span className="font-mono font-medium text-neutral-900 dark:text-neutral-100">{parent?.email || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Home Address:</span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-100 text-right max-w-xs">{student.address}, {student.city}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'fees' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-neutral-200 overflow-hidden dark:border-neutral-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:border-neutral-700">
                    <tr>
                      <th className="py-2.5 px-3">Receipt #</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Month</th>
                      <th className="py-2.5 px-3">Subtotal</th>
                      <th className="py-2.5 px-3">Discount</th>
                      <th className="py-2.5 px-3">Paid</th>
                      <th className="py-2.5 px-3">Balance</th>
                      <th className="py-2.5 px-3">Method</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {studentPayments.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-6 text-center text-neutral-400">
                          No fee payments logged yet for this student.
                        </td>
                      </tr>
                    ) : (
                      studentPayments.map((p) => (
                        <tr key={p.id}>
                          <td className="py-2.5 px-3 font-mono font-semibold text-blue-600 dark:text-blue-400">{p.receiptNumber}</td>
                          <td className="py-2.5 px-3 font-mono">{p.date}</td>
                          <td className="py-2.5 px-3">{p.month} {p.year}</td>
                          <td className="py-2.5 px-3 font-mono tabular-nums">{settings.currencySymbol}{p.subtotal.toLocaleString()}</td>
                          <td className="py-2.5 px-3 font-mono tabular-nums text-emerald-600">-{settings.currencySymbol}{p.discountAmount.toLocaleString()}</td>
                          <td className="py-2.5 px-3 font-mono tabular-nums font-bold">{settings.currencySymbol}{p.paidAmount.toLocaleString()}</td>
                          <td className="py-2.5 px-3 font-mono tabular-nums text-rose-600">{settings.currencySymbol}{p.balanceAmount.toLocaleString()}</td>
                          <td className="py-2.5 px-3">{p.paymentMethod}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSubTab === 'exams' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-neutral-200 overflow-hidden dark:border-neutral-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:border-neutral-700">
                    <tr>
                      <th className="py-2.5 px-3">Exam Title</th>
                      <th className="py-2.5 px-3">Subject</th>
                      <th className="py-2.5 px-3">Max Marks</th>
                      <th className="py-2.5 px-3">Obtained</th>
                      <th className="py-2.5 px-3">Percentage</th>
                      <th className="py-2.5 px-3">Grade</th>
                      <th className="py-2.5 px-3">Teacher Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {studentMarks.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-6 text-center text-neutral-400">
                          No examination marks entered yet for this student.
                        </td>
                      </tr>
                    ) : (
                      studentMarks.map((m) => {
                        const ex = exams.find((e) => e.id === m.examId);
                        const sub = subjects.find((s) => s.id === m.subjectId);
                        const pct = Math.round((m.obtainedMarks / m.maxMarks) * 100);
                        const grade = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : pct >= 50 ? 'D' : 'F';

                        return (
                          <tr key={m.id}>
                            <td className="py-2.5 px-3 font-medium text-neutral-900 dark:text-neutral-100">{ex?.name || 'Exam'}</td>
                            <td className="py-2.5 px-3 font-medium">{sub?.name || 'Subject'}</td>
                            <td className="py-2.5 px-3 font-mono tabular-nums">{m.maxMarks}</td>
                            <td className="py-2.5 px-3 font-mono tabular-nums font-bold text-neutral-900 dark:text-neutral-100">{m.obtainedMarks}</td>
                            <td className="py-2.5 px-3 font-mono tabular-nums font-semibold text-blue-600 dark:text-blue-400">{pct}%</td>
                            <td className="py-2.5 px-3 font-mono font-bold">{grade}</td>
                            <td className="py-2.5 px-3 text-neutral-500 italic">{m.remarks || '—'}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSubTab === 'attendance' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
                  <span className="text-neutral-500">Present Days</span>
                  <p className="text-lg font-bold font-mono text-emerald-600 mt-1">{presentCount}</p>
                </div>
                <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
                  <span className="text-neutral-500">Absent Days</span>
                  <p className="text-lg font-bold font-mono text-rose-600 mt-1">{absentCount}</p>
                </div>
                <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
                  <span className="text-neutral-500">Late Arrivals</span>
                  <p className="text-lg font-bold font-mono text-amber-600 mt-1">{attendanceRecords.filter(a => a.status === 'Late').length}</p>
                </div>
                <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
                  <span className="text-neutral-500">Leave Approvals</span>
                  <p className="text-lg font-bold font-mono text-blue-600 mt-1">{attendanceRecords.filter(a => a.status === 'Leave').length}</p>
                </div>
              </div>

              <div className="rounded-xl border border-neutral-200 overflow-hidden dark:border-neutral-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:border-neutral-700">
                    <tr>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Remarks / Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {attendanceRecords.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-6 text-center text-neutral-400">
                          No attendance records found for this student.
                        </td>
                      </tr>
                    ) : (
                      attendanceRecords.map((a) => (
                        <tr key={a.id}>
                          <td className="py-2.5 px-3 font-mono font-medium">{a.date}</td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded-sm text-[11px] font-semibold ${
                              a.status === 'Present' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                              a.status === 'Absent' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                              a.status === 'Late' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                              'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            }`}>
                              {a.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-neutral-600 dark:text-neutral-400">{a.remarks || 'Standard roll call'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSubTab === 'documents' && (
            <div className="space-y-4 text-xs">
              <div className="rounded-xl border border-neutral-200 p-4 space-y-3 dark:border-neutral-800">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-neutral-900 dark:text-neutral-100">
                    Verified Admission Documents Repository
                  </h4>
                  <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-sm">
                    Verified by Registrar Office
                  </span>
                </div>

                <div className="space-y-2 divide-y divide-neutral-100 dark:divide-neutral-800">
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <div>
                        <div className="font-semibold text-neutral-900 dark:text-neutral-100">NADRA Form-B / Child Birth Certificate</div>
                        <div className="text-[10px] text-neutral-400 font-mono">B-Form-Verified-{student.bFormCnic}.pdf · 1.8 MB</div>
                      </div>
                    </div>
                    <span className="text-neutral-500 font-mono text-[11px]">Verified ✓</span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <div>
                        <div className="font-semibold text-neutral-900 dark:text-neutral-100">Previous School Leaving Certificate & Transcript</div>
                        <div className="text-[10px] text-neutral-400 font-mono">School_Leaving_Certificate.pdf · 2.4 MB</div>
                      </div>
                    </div>
                    <span className="text-neutral-500 font-mono text-[11px]">Verified ✓</span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <div>
                        <div className="font-semibold text-neutral-900 dark:text-neutral-100">Father / Guardian CNIC Copy</div>
                        <div className="text-[10px] text-neutral-400 font-mono">Guardian_CNIC_Scanned.pdf · 850 KB</div>
                      </div>
                    </div>
                    <span className="text-neutral-500 font-mono text-[11px]">Verified ✓</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
