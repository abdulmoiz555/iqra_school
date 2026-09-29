import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Calendar, BookOpen, FileText, CheckCircle, Clock, X } from 'lucide-react';

export const AssignmentsView: React.FC = () => {
  const { assignments, addAssignment, classes, sections, subjects, teachers, currentUser } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    classId: classes[0]?.id || '',
    sectionId: sections[0]?.id || '',
    subjectId: subjects[0]?.id || '',
    teacherId: teachers[0]?.id || '',
    title: '',
    description: '',
    issueDate: new Date().toISOString().slice(0, 10),
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
    maxScore: 25,
    attachmentName: '',
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    addAssignment(formData);
    setFormData({
      ...formData,
      title: '',
      description: '',
      attachmentName: '',
    });
    setIsAddModalOpen(false);
  };

  const canCreate = ['Super Admin', 'Admin', 'Teacher'].includes(currentUser.role);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            Homework & Academic Assignments
          </h3>
          <p className="text-xs text-neutral-500">
            Track weekly subject homework assignments, submission deadlines and resource files
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Create Homework Task
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assignments.map((asg) => {
          const cls = classes.find((c) => c.id === asg.classId);
          const sub = subjects.find((s) => s.id === asg.subjectId);
          const tch = teachers.find((t) => t.id === asg.teacherId);

          return (
            <div
              key={asg.id}
              className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-sm">
                    {sub?.name || 'Subject'}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">
                    Max: {asg.maxScore} marks
                  </span>
                </div>

                <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 line-clamp-1">
                  {asg.title}
                </h4>
                <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 line-clamp-3">
                  {asg.description}
                </p>

                {asg.attachmentName && (
                  <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-blue-600 dark:text-blue-400 font-mono">
                    <FileText className="h-3.5 w-3.5" />
                    <span>{asg.attachmentName}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
                <div>Due: <strong className="text-rose-600 dark:text-rose-400">{asg.dueDate}</strong></div>
                <div>{cls?.name}</div>
              </div>
            </div>
          );
        })}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">Create Homework Assignment</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-neutral-400 hover:bg-neutral-100 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Class</label>
                  <select
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">Subject</label>
                  <select
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chapter 4 Trigonometry Problem Set"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Instructions / Description</label>
                <textarea
                  rows={3}
                  placeholder="Detail the questions, textbook pages or laboratory experiment steps required..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Attachment File Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Worksheet_Algebra_3.pdf"
                    value={formData.attachmentName}
                    onChange={(e) => setFormData({ ...formData, attachmentName: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  Post Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
