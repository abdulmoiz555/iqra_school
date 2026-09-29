import React from 'react';
import { useApp } from '../../context/AppContext';
import { Student, Exam } from '../../types';
import { X, Printer, Award, CheckCircle } from 'lucide-react';

interface ResultCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  exam: Exam | null;
}

export const ResultCardModal: React.FC<ResultCardModalProps> = ({
  isOpen,
  onClose,
  student,
  exam,
}) => {
  const { settings, marks, subjects, classes, sections, parents, gradingRules } = useApp();

  if (!isOpen || !student || !exam) return null;

  const cls = classes.find((c) => c.id === student.classId);
  const sec = sections.find((s) => s.id === student.sectionId);
  const parent = parents.find((p) => p.id === student.parentId);

  // Student marks for this exam
  const studentExamMarks = marks.filter(
    (m) => m.studentId === student.id && m.examId === exam.id
  );

  const totalMax = studentExamMarks.reduce((acc, m) => acc + m.maxMarks, 0) || 1;
  const totalObtained = studentExamMarks.reduce((acc, m) => acc + m.obtainedMarks, 0);
  const overallPercentage = Math.round((totalObtained / totalMax) * 100);

  // Calculate Grade from grading rules
  const matchedGrade =
    gradingRules.find(
      (r) => overallPercentage >= r.minPercentage && overallPercentage <= r.maxPercentage
    )?.grade || (overallPercentage >= 50 ? 'D' : 'F');

  const overallStatus = overallPercentage >= 50 ? 'PASSED' : 'NEEDS IMPROVEMENT';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4 overflow-y-auto">
      <div className="w-full max-w-3xl rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-500" />
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Official Academic Transcript & Examination Result Card
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" /> Print Result Card
            </button>
            <button onClick={onClose} className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Transcript Layout */}
        <div className="p-8 overflow-y-auto max-h-[80vh]">
          <div className="rounded-xl border-2 border-neutral-800 bg-white p-6 text-neutral-900 shadow-sm relative font-sans">
            {/* Header with Crest */}
            <div className="text-center border-b-2 border-neutral-800 pb-4">
              <div className="flex items-center justify-center gap-3 mb-1">
                {settings.logoUrl && (
                  <img
                    src={settings.logoUrl}
                    alt="School Crest"
                    className="h-16 w-16 object-contain rounded-full border border-neutral-200"
                  />
                )}
                <div>
                  <h1 className="text-xl font-black uppercase tracking-tight text-neutral-900">
                    {settings.schoolName}
                  </h1>
                  <p className="text-xs text-neutral-600 italic">
                    {settings.schoolMotto}
                  </p>
                  <p className="text-[11px] font-mono text-neutral-500">
                    Registration No: {settings.registrationNumber} · Session: {settings.activeSession}
                  </p>
                </div>
              </div>

              <div className="mt-2 py-1 px-4 inline-block bg-neutral-900 text-white font-bold text-xs uppercase tracking-widest rounded-xs">
                {exam.name} — Progress Report
              </div>
            </div>

            {/* Student & Class Details Grid */}
            <div className="my-4 grid grid-cols-2 gap-4 rounded-lg border border-neutral-200 bg-neutral-50/70 p-3 text-xs font-mono">
              <div className="space-y-1">
                <div><span className="text-neutral-500 font-sans">Student Name:</span> <strong className="font-sans text-neutral-900">{student.firstName} {student.lastName}</strong></div>
                <div><span className="text-neutral-500 font-sans">Admission No:</span> <strong>{student.admissionNumber}</strong></div>
                <div><span className="text-neutral-500 font-sans">Roll Number:</span> <strong>{student.rollNumber}</strong></div>
              </div>
              <div className="space-y-1">
                <div><span className="text-neutral-500 font-sans">Class & Section:</span> <strong>{cls?.name} ({sec?.name})</strong></div>
                <div><span className="text-neutral-500 font-sans">Father/Guardian:</span> <strong className="font-sans">{parent?.fatherName || 'N/A'}</strong></div>
                <div><span className="text-neutral-500 font-sans">Academic Year:</span> <strong>{settings.activeSession}</strong></div>
              </div>
            </div>

            {/* Marks Breakdown Table */}
            <table className="w-full text-left text-xs border border-neutral-300 mb-4">
              <thead className="bg-neutral-100 border-b border-neutral-300 font-semibold text-neutral-800">
                <tr>
                  <th className="py-2 px-3">Subject</th>
                  <th className="py-2 px-3 text-right">Max Marks</th>
                  <th className="py-2 px-3 text-right">Passing</th>
                  <th className="py-2 px-3 text-right">Marks Obtained</th>
                  <th className="py-2 px-3 text-right">Percentage</th>
                  <th className="py-2 px-3 text-center">Grade</th>
                  <th className="py-2 px-3">Teacher Evaluation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {studentExamMarks.map((m) => {
                  const sub = subjects.find((s) => s.id === m.subjectId);
                  const pct = Math.round((m.obtainedMarks / m.maxMarks) * 100);
                  const gr = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : pct >= 50 ? 'D' : 'F';

                  return (
                    <tr key={m.id}>
                      <td className="py-2 px-3 font-semibold">{sub?.name || 'Subject'}</td>
                      <td className="py-2 px-3 font-mono text-right">{m.maxMarks}</td>
                      <td className="py-2 px-3 font-mono text-right text-neutral-500">{sub?.passingMarks || 33}</td>
                      <td className="py-2 px-3 font-mono text-right font-bold text-neutral-900">{m.obtainedMarks}</td>
                      <td className="py-2 px-3 font-mono text-right">{pct}%</td>
                      <td className="py-2 px-3 font-mono text-center font-bold">{gr}</td>
                      <td className="py-2 px-3 text-neutral-600 italic text-[11px]">{m.remarks || 'Satisfactory performance'}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-neutral-100 border-t-2 border-neutral-800 font-bold font-mono">
                <tr>
                  <td className="py-2.5 px-3 uppercase">Aggregate Total</td>
                  <td className="py-2.5 px-3 text-right">{totalMax}</td>
                  <td></td>
                  <td className="py-2.5 px-3 text-right text-sm">{totalObtained}</td>
                  <td className="py-2.5 px-3 text-right text-sm text-blue-700">{overallPercentage}%</td>
                  <td className="py-2.5 px-3 text-center text-sm font-black">{matchedGrade}</td>
                  <td className="py-2.5 px-3 uppercase font-sans text-emerald-700">{overallStatus}</td>
                </tr>
              </tfoot>
            </table>

            {/* Performance Summary Grid */}
            <div className="grid grid-cols-3 gap-3 rounded-lg border border-neutral-200 p-3 text-center text-xs mb-6">
              <div>
                <span className="text-[10px] text-neutral-500">Overall Grade</span>
                <p className="text-xl font-black font-mono text-neutral-900">{matchedGrade}</p>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500">Percentage Score</span>
                <p className="text-xl font-bold font-mono text-blue-600">{overallPercentage}%</p>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500">Academic Standing</span>
                <p className="text-base font-bold text-emerald-600 mt-1">{overallStatus}</p>
              </div>
            </div>

            {/* Remarks & Signatures Footer */}
            <div className="mt-8 pt-4 border-t border-neutral-300 grid grid-cols-3 gap-6 text-center text-xs">
              <div>
                <div className="h-8 flex items-end justify-center font-serif italic">Engr. Zafar Iqbal</div>
                <div className="w-full h-0.5 bg-neutral-400 my-1" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  Class Teacher
                </span>
              </div>

              <div>
                <div className="h-8 flex items-end justify-center font-serif italic">Official Academic Seal</div>
                <div className="w-full h-0.5 bg-neutral-400 my-1" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  Controller of Examinations
                </span>
              </div>

              <div>
                <div className="h-8 flex items-end justify-center font-serif italic">Dr. Shahzad Tariq</div>
                <div className="w-full h-0.5 bg-neutral-400 my-1" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  Principal Signature
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
