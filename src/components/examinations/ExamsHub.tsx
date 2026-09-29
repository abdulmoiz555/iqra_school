import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Exam, MarkRecord, GradingRule, Student } from '../../types';
import {
  Award,
  Plus,
  Save,
  Printer,
  Edit,
  Trash2,
  CheckCircle,
  FileText,
  Search,
  Settings,
  X
} from 'lucide-react';
import { ResultCardModal } from '../common/ResultCardModal';

export const ExamsHub: React.FC = () => {
  const {
    exams,
    addExam,
    marks,
    saveMarks,
    gradingRules,
    updateGradingRules,
    classes,
    subjects,
    students,
    currentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'entry' | 'exams' | 'grading' | 'results'>('entry');

  // Marks Entry state
  const [selectedExamId, setSelectedExamId] = useState<string>(exams[1]?.id || exams[0]?.id || '');
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[classes.length - 1]?.id || classes[0]?.id || '');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [entrySuccess, setEntrySuccess] = useState(false);

  // Result card modal state
  const [selectedResultStudent, setSelectedResultStudent] = useState<Student | null>(null);

  // Add Exam Modal state
  const [isAddExamOpen, setIsAddExamOpen] = useState(false);
  const [newExamName, setNewExamName] = useState('');
  const [newExamType, setNewExamType] = useState<Exam['type']>('Mid Term');
  const [newExamStart, setNewExamStart] = useState('');
  const [newExamEnd, setNewExamEnd] = useState('');

  // Class students
  const classStudents = students.filter(
    (s) => s.classId === selectedClassId && s.status === 'Active'
  );

  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId);
  const currentMaxMarks = selectedSubject?.maxMarks || 100;
  const currentPassMarks = selectedSubject?.passingMarks || 33;

  // Local state for marks being entered in the grid
  const [marksMap, setMarksMap] = useState<Record<string, { obtained: number; remarks: string }>>(() => {
    const map: Record<string, { obtained: number; remarks: string }> = {};
    classStudents.forEach((stu) => {
      const existing = marks.find(
        (m) => m.examId === selectedExamId && m.studentId === stu.id && m.subjectId === selectedSubjectId
      );
      map[stu.id] = {
        obtained: existing ? existing.obtainedMarks : 80,
        remarks: existing?.remarks || '',
      };
    });
    return map;
  });

  React.useEffect(() => {
    const map: Record<string, { obtained: number; remarks: string }> = {};
    classStudents.forEach((stu) => {
      const existing = marks.find(
        (m) => m.examId === selectedExamId && m.studentId === stu.id && m.subjectId === selectedSubjectId
      );
      map[stu.id] = {
        obtained: existing ? existing.obtainedMarks : 80,
        remarks: existing?.remarks || '',
      };
    });
    setMarksMap(map);
  }, [selectedExamId, selectedClassId, selectedSubjectId, marks]);

  const handleMarkChange = (studentId: string, val: number) => {
    setMarksMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        obtained: Math.min(currentMaxMarks, Math.max(0, val)),
      },
    }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setMarksMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks,
      },
    }));
  };

  const handleSaveMarks = () => {
    const records: MarkRecord[] = classStudents.map((stu) => ({
      id: `mrk-${selectedExamId}-${stu.id}-${selectedSubjectId}`,
      examId: selectedExamId,
      studentId: stu.id,
      subjectId: selectedSubjectId,
      maxMarks: currentMaxMarks,
      obtainedMarks: marksMap[stu.id]?.obtained ?? 0,
      remarks: marksMap[stu.id]?.remarks || undefined,
    }));

    saveMarks(records);
    setEntrySuccess(true);
    setTimeout(() => setEntrySuccess(false), 2000);
  };

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExamName.trim()) return;
    addExam({
      name: newExamName,
      type: newExamType,
      sessionId: 'sess-2',
      classId: selectedClassId,
      startDate: newExamStart || new Date().toISOString().slice(0, 10),
      endDate: newExamEnd || new Date(Date.now() + 10 * 86400000).toISOString().slice(0, 10),
    });
    setNewExamName('');
    setIsAddExamOpen(false);
  };

  const calculateGrade = (pct: number) => {
    const match = gradingRules.find((r) => pct >= r.minPercentage && pct <= r.maxPercentage);
    return match ? match.grade : pct >= 50 ? 'D' : 'F';
  };

  const selectedExam = exams.find((e) => e.id === selectedExamId);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Examinations, Marks & Academic Transcripts
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Term assessments, marks entry with dynamic grading, and printable official result cards
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-xs">
          {[
            { id: 'entry', label: 'Marks Entry Roster' },
            { id: 'results', label: 'Student Result Cards' },
            { id: 'exams', label: 'Exams Schedule' },
            { id: 'grading', label: 'Grading Scale Rules' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === t.id
                  ? 'bg-white text-blue-600 font-bold shadow-xs dark:bg-neutral-900 dark:text-blue-400'
                  : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Marks Entry */}
      {activeTab === 'entry' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Select Examination:</label>
                  <select
                    value={selectedExamId}
                    onChange={(e) => setSelectedExamId(e.target.value)}
                    className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 font-medium"
                  >
                    {exams.map((ex) => (
                      <option key={ex.id} value={ex.id}>{ex.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Select Class:</label>
                  <select
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 font-medium"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Subject:</label>
                  <select
                    value={selectedSubjectId}
                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                    className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 font-medium"
                  >
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>{sub.name} ({sub.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveMarks}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="h-3.5 w-3.5" /> Save Entered Marks
                </button>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
              <div className="flex items-center gap-3">
                <span>Maximum Marks: <strong className="font-mono text-neutral-900 dark:text-neutral-100">{currentMaxMarks}</strong></span>
                <span>·</span>
                <span>Passing Threshold: <strong className="font-mono text-rose-600">{currentPassMarks}</strong></span>
              </div>
              {entrySuccess && (
                <span className="text-emerald-600 font-bold flex items-center gap-1 animate-pulse">
                  <CheckCircle className="h-4 w-4" /> Marks submitted to student records!
                </span>
              )}
            </div>
          </div>

          {/* Marks Entry Grid */}
          <div className="rounded-xl border border-neutral-200 bg-white shadow-xs overflow-hidden dark:border-neutral-800 dark:bg-neutral-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 dark:bg-neutral-800/60 dark:border-neutral-800 dark:text-neutral-300 font-semibold">
                <tr>
                  <th className="py-3 px-4">Roll #</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Admission #</th>
                  <th className="py-3 px-4 w-32">Obtained Marks</th>
                  <th className="py-3 px-4">Percentage</th>
                  <th className="py-3 px-4">Calculated Grade</th>
                  <th className="py-3 px-4">Pass / Fail</th>
                  <th className="py-3 px-4">Teacher Evaluation Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {classStudents.map((stu) => {
                  const current = marksMap[stu.id] || { obtained: 0, remarks: '' };
                  const pct = Math.round((current.obtained / currentMaxMarks) * 100);
                  const gr = calculateGrade(pct);
                  const isPass = current.obtained >= currentPassMarks;

                  return (
                    <tr key={stu.id} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40">
                      <td className="py-2.5 px-4 font-mono font-bold text-neutral-700 dark:text-neutral-300">
                        {stu.rollNumber}
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-neutral-900 dark:text-neutral-100">
                        {stu.firstName} {stu.lastName}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-neutral-500">
                        {stu.admissionNumber}
                      </td>
                      <td className="py-2.5 px-4">
                        <input
                          type="number"
                          value={current.obtained}
                          onChange={(e) => handleMarkChange(stu.id, Number(e.target.value))}
                          className="w-24 rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1 font-mono font-bold text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                        />
                      </td>
                      <td className="py-2.5 px-4 font-mono font-semibold text-blue-600 dark:text-blue-400">
                        {pct}%
                      </td>
                      <td className="py-2.5 px-4 font-mono font-bold">
                        <span className={`px-2 py-0.5 rounded-sm ${
                          gr === 'A+' || gr === 'A' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                          gr === 'F' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
                          'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                        }`}>
                          {gr}
                        </span>
                      </td>
                      <td className="py-2.5 px-4">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${
                          isPass ? 'text-emerald-700 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300' : 'text-rose-700 bg-rose-100 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {isPass ? 'PASS' : 'FAIL'}
                        </span>
                      </td>
                      <td className="py-2.5 px-4">
                        <input
                          type="text"
                          placeholder="e.g. Excellent analytical reasoning"
                          value={current.remarks}
                          onChange={(e) => handleRemarksChange(stu.id, e.target.value)}
                          className="w-full max-w-sm rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Student Result Cards */}
      {activeTab === 'results' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-1">
              Student Academic Result Cards & Transcripts
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              Select any student to generate and print their individual progress report with seal & signatures
            </p>

            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:border-neutral-700">
                <tr>
                  <th className="py-2.5 px-3">Admission #</th>
                  <th className="py-2.5 px-3">Roll #</th>
                  <th className="py-2.5 px-3">Student</th>
                  <th className="py-2.5 px-3">Examination</th>
                  <th className="py-2.5 px-3 text-right">View / Print Transcript</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {classStudents.map((stu) => (
                  <tr key={stu.id}>
                    <td className="py-2.5 px-3 font-mono">{stu.admissionNumber}</td>
                    <td className="py-2.5 px-3 font-mono font-bold">{stu.rollNumber}</td>
                    <td className="py-2.5 px-3 font-semibold text-neutral-900 dark:text-neutral-100">
                      {stu.firstName} {stu.lastName}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-600 dark:text-neutral-400">
                      {selectedExam?.name}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => setSelectedResultStudent(stu)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 rounded-md font-semibold text-xs hover:bg-blue-100 cursor-pointer"
                      >
                        <Award className="h-3.5 w-3.5" />
                        Generate Result Card
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Exams Schedule */}
      {activeTab === 'exams' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Scheduled Term Examinations
            </h3>
            <button
              onClick={() => setIsAddExamOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Schedule New Exam
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {exams.map((ex) => (
              <div
                key={ex.id}
                className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-sm">
                    {ex.type}
                  </span>
                </div>
                <h4 className="mt-2 text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  {ex.name}
                </h4>
                <div className="mt-3 text-xs space-y-1 text-neutral-500 font-mono">
                  <div>Commences: {ex.startDate}</div>
                  <div>Concludes: {ex.endDate}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Grading Scale Rules */}
      {activeTab === 'grading' && (
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            Institutional Grading Scale & GPA Equivalent
          </h3>
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:border-neutral-700">
              <tr>
                <th className="py-2.5 px-3">Grade Letter</th>
                <th className="py-2.5 px-3">Percentage Range</th>
                <th className="py-2.5 px-3">Grade Point</th>
                <th className="py-2.5 px-3">Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {gradingRules.map((gr) => (
                <tr key={gr.id}>
                  <td className="py-2.5 px-3 font-mono font-bold text-sm text-neutral-900 dark:text-neutral-100">{gr.grade}</td>
                  <td className="py-2.5 px-3 font-mono">{gr.minPercentage}% – {gr.maxPercentage}%</td>
                  <td className="py-2.5 px-3 font-mono font-bold">{gr.gradePoint.toFixed(1)}</td>
                  <td className="py-2.5 px-3 text-neutral-600 dark:text-neutral-400">{gr.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Result Card Modal */}
      {selectedResultStudent && selectedExam && (
        <ResultCardModal
          isOpen={Boolean(selectedResultStudent)}
          onClose={() => setSelectedResultStudent(null)}
          student={selectedResultStudent}
          exam={selectedExam}
        />
      )}

      {/* Add Exam Modal */}
      {isAddExamOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-3">Schedule Examination</h3>
            <form onSubmit={handleCreateExam} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium mb-1">Exam Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Final Term Annual Examinations 2027"
                  value={newExamName}
                  onChange={(e) => setNewExamName(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Exam Type</label>
                <select
                  value={newExamType}
                  onChange={(e) => setNewExamType(e.target.value as any)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                >
                  <option value="Monthly Test">Monthly Test</option>
                  <option value="Mid Term">Mid Term</option>
                  <option value="Final Term">Final Term</option>
                  <option value="Annual Exam">Annual Exam</option>
                  <option value="Quiz">Quiz</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newExamStart}
                    onChange={(e) => setNewExamStart(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    value={newExamEnd}
                    onChange={(e) => setNewExamEnd(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddExamOpen(false)}
                  className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  Publish Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
