import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, GraduationCap, CheckCircle2, ArrowRight } from 'lucide-react';

interface StudentPromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudentPromotionModal: React.FC<StudentPromotionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { classes, sections, sessions, students, promoteStudents, updateStudent } = useApp();

  const [fromClassId, setFromClassId] = useState<string>(classes[classes.length - 2]?.id || classes[0]?.id || '');
  const [fromSectionId, setFromSectionId] = useState<string>(sections[0]?.id || '');

  const [toSessionId, setToSessionId] = useState<string>(sessions[1]?.id || sessions[0]?.id || '');
  const [toClassId, setToClassId] = useState<string>(classes[classes.length - 1]?.id || classes[0]?.id || '');
  const [toSectionId, setToSectionId] = useState<string>(sections[0]?.id || '');

  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [promotionStatus, setPromotionStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  // Students in source class & section
  const sourceStudents = students.filter(
    (s) => s.classId === fromClassId && s.status === 'Active'
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudentIds(sourceStudents.map((s) => s.id));
    } else {
      setSelectedStudentIds([]);
    }
  };

  const toggleStudent = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handlePromote = () => {
    if (selectedStudentIds.length === 0) return;
    promoteStudents(selectedStudentIds, toClassId, toSectionId);
    setPromotionStatus(`Successfully promoted ${selectedStudentIds.length} students!`);
    setTimeout(() => {
      setPromotionStatus(null);
      onClose();
    }, 1200);
  };

  const handleGraduate = () => {
    if (selectedStudentIds.length === 0) return;
    selectedStudentIds.forEach((id) => {
      updateStudent(id, { status: 'Graduated' });
    });
    setPromotionStatus(`Marked ${selectedStudentIds.length} students as Graduated!`);
    setTimeout(() => {
      setPromotionStatus(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Annual Student Promotion & Academic Progression
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Promote students to next grade or graduate final year cohorts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {promotionStatus && (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              {promotionStatus}
            </div>
          )}

          {/* Source vs Target Selection Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-neutral-200 p-4 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-800/30">
            {/* Source */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Source Class
              </span>
              <div className="mt-2 space-y-2">
                <select
                  value={fromClassId}
                  onChange={(e) => {
                    setFromClassId(e.target.value);
                    setSelectedStudentIds([]);
                  }}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Target */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1">
                Target Progression Grade <ArrowRight className="h-3 w-3" />
              </span>
              <div className="mt-2 space-y-2">
                <select
                  value={toClassId}
                  onChange={(e) => setToClassId(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Student selection checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                Eligible Students in Source Class ({sourceStudents.length})
              </span>
              <div className="flex items-center gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => handleSelectAll(selectedStudentIds.length !== sourceStudents.length)}
                  className="text-blue-600 hover:underline dark:text-blue-400 cursor-pointer font-medium"
                >
                  {selectedStudentIds.length === sourceStudents.length ? 'Deselect All' : 'Select All'}
                </button>
                <span className="text-neutral-400 font-mono">
                  {selectedStudentIds.length} selected
                </span>
              </div>
            </div>

            <div className="max-h-56 overflow-y-auto rounded-xl border border-neutral-200 divide-y divide-neutral-100 dark:border-neutral-800 dark:divide-neutral-800">
              {sourceStudents.length === 0 ? (
                <p className="p-6 text-center text-xs text-neutral-400">
                  No active students enrolled in this source class.
                </p>
              ) : (
                sourceStudents.map((stu) => (
                  <label
                    key={stu.id}
                    className="flex items-center justify-between p-2.5 text-xs hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedStudentIds.includes(stu.id)}
                        onChange={() => toggleStudent(stu.id)}
                        className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                          {stu.firstName} {stu.lastName}
                        </span>
                        <span className="text-[11px] text-neutral-400 font-mono ml-2">
                          Adm: {stu.admissionNumber} · Roll: {stu.rollNumber}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] text-emerald-600 font-mono font-medium">Eligible</span>
                  </label>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-neutral-200 px-6 py-3.5 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
          <button
            type="button"
            onClick={handleGraduate}
            disabled={selectedStudentIds.length === 0}
            className="rounded-lg border border-purple-300 bg-purple-50 px-3.5 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-100 dark:border-purple-800 dark:bg-purple-950/40 dark:text-purple-300 disabled:opacity-50 cursor-pointer"
          >
            Mark as Graduated Cohort
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-neutral-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handlePromote}
              disabled={selectedStudentIds.length === 0}
              className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50 shadow-xs cursor-pointer"
            >
              Promote Selected ({selectedStudentIds.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
