import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SchoolClass, Section, Subject, AcademicSession } from '../../types';
import {
  BookOpen,
  Calendar,
  Layers,
  Clock,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  FileText,
  UserCheck,
  X
} from 'lucide-react';
import { TimetableView } from './TimetableView';
import { AssignmentsView } from './AssignmentsView';

export const AcademicsHub: React.FC = () => {
  const {
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
    teachers,
    currentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'classes' | 'subjects' | 'sessions' | 'timetable' | 'assignments'>('classes');

  // Modal states
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassOrder, setNewClassOrder] = useState(1);
  const [newClassTeacherId, setNewClassTeacherId] = useState('');

  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [newSecName, setNewSecName] = useState('');
  const [newSecClassId, setNewSecClassId] = useState(classes[0]?.id || '');
  const [newSecRoom, setNewSecRoom] = useState('');
  const [newSecCapacity, setNewSecCapacity] = useState(30);

  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [subName, setSubName] = useState('');
  const [subCode, setSubCode] = useState('');
  const [subClassId, setSubClassId] = useState(classes[0]?.id || '');
  const [subTeacherId, setSubTeacherId] = useState(teachers[0]?.id || '');
  const [subMaxMarks, setSubMaxMarks] = useState(100);
  const [subPassMarks, setSubPassMarks] = useState(33);
  const [subType, setSubType] = useState<'Compulsory' | 'Optional'>('Compulsory');

  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [sessName, setSessName] = useState('');
  const [sessStart, setSessStart] = useState('');
  const [sessEnd, setSessEnd] = useState('');
  const [sessIsActive, setSessIsActive] = useState(false);

  const canManage = ['Super Admin', 'Admin'].includes(currentUser.role);

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    addClass({
      name: newClassName,
      numericOrder: Number(newClassOrder),
      classTeacherId: newClassTeacherId || undefined,
    });
    setNewClassName('');
    setIsClassModalOpen(false);
  };

  const handleAddSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSecName.trim()) return;
    addSection({
      name: newSecName,
      classId: newSecClassId,
      roomNumber: newSecRoom || 'Room 101',
      capacity: Number(newSecCapacity),
    });
    setNewSecName('');
    setIsSectionModalOpen(false);
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim() || !subCode.trim()) return;
    addSubject({
      name: subName,
      code: subCode,
      classId: subClassId,
      teacherId: subTeacherId,
      maxMarks: Number(subMaxMarks),
      passingMarks: Number(subPassMarks),
      type: subType,
    });
    setSubName('');
    setSubCode('');
    setIsSubjectModalOpen(false);
  };

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessName.trim()) return;
    addSession({
      name: sessName.trim(),
      startDate: sessStart || `${sessName.slice(0, 4)}-04-01`,
      endDate: sessEnd || `${sessName.slice(-4)}-03-31`,
      isActive: sessIsActive,
    });
    setSessName('');
    setSessStart('');
    setSessEnd('');
    setSessIsActive(false);
    setIsSessionModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Academics & Curriculum Administration
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Configure academic sessions, grade levels, sections, subjects, weekly timetable & assignments
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-xs">
          {[
            { id: 'classes', label: 'Classes & Sections' },
            { id: 'subjects', label: 'Subjects & Syllabus' },
            { id: 'timetable', label: 'Weekly Timetable' },
            { id: 'assignments', label: 'Homework & Tasks' },
            { id: 'sessions', label: 'Academic Sessions' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === t.id
                  ? 'bg-white text-blue-600 font-bold shadow-xs dark:bg-neutral-900 dark:text-blue-400'
                  : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Classes & Sections */}
      {activeTab === 'classes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Grade Levels & Section Rooms
            </h3>
            {canManage && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSectionModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Section
                </button>
                <button
                  onClick={() => setIsClassModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Class
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((cls) => {
              const classSections = sections.filter((s) => s.classId === cls.id);
              const teacher = teachers.find((t) => t.id === cls.classTeacherId);

              return (
                <div
                  key={cls.id}
                  className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
                      <div>
                        <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                          {cls.name}
                        </h4>
                        <span className="text-[10px] font-mono text-neutral-400">
                          Numeric Order: {cls.numericOrder}
                        </span>
                      </div>
                      {canManage && (
                        <button
                          onClick={() => deleteClass(cls.id)}
                          className="text-neutral-400 hover:text-rose-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="mt-2.5 text-xs text-neutral-600 dark:text-neutral-400">
                      <span className="text-neutral-400">Class Incharge:</span>{' '}
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                        {teacher?.name || 'Unassigned'}
                      </span>
                    </div>

                    {/* Section Badges */}
                    <div className="mt-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        Assigned Sections ({classSections.length})
                      </span>
                      <div className="mt-1.5 space-y-1.5">
                        {classSections.length === 0 ? (
                          <p className="text-[11px] text-neutral-400 italic">No sections created yet.</p>
                        ) : (
                          classSections.map((sec) => (
                            <div
                              key={sec.id}
                              className="flex items-center justify-between rounded-lg bg-neutral-50 px-2.5 py-1 text-xs dark:bg-neutral-800/60"
                            >
                              <div className="font-medium text-neutral-900 dark:text-neutral-100">
                                Section {sec.name}
                              </div>
                              <div className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
                                {sec.roomNumber} · Max {sec.capacity} students
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Subjects */}
      {activeTab === 'subjects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Curriculum Subjects & Passing Criteria
            </h3>
            {canManage && (
              <button
                onClick={() => setIsSubjectModalOpen(true)}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add Subject
              </button>
            )}
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white shadow-xs overflow-hidden dark:border-neutral-800 dark:bg-neutral-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 dark:bg-neutral-800/60 dark:border-neutral-800 dark:text-neutral-300 font-semibold">
                <tr>
                  <th className="py-3 px-4">Subject Name</th>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Instructor</th>
                  <th className="py-3 px-4">Max Marks</th>
                  <th className="py-3 px-4">Pass Marks</th>
                  {canManage && <th className="py-3 px-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {subjects.map((sub) => {
                  const cls = classes.find((c) => c.id === sub.classId);
                  const tch = teachers.find((t) => t.id === sub.teacherId);
                  return (
                    <tr key={sub.id} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40">
                      <td className="py-3 px-4 font-bold text-neutral-900 dark:text-neutral-100">
                        {sub.name}
                      </td>
                      <td className="py-3 px-4 font-mono text-neutral-500 font-semibold">
                        {sub.code}
                      </td>
                      <td className="py-3 px-4 font-medium text-neutral-700 dark:text-neutral-300">
                        {cls?.name || 'Class N/A'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-sm text-[10px] font-semibold ${
                          sub.type === 'Compulsory'
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                        }`}>
                          {sub.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-neutral-800 dark:text-neutral-200">
                        {tch?.name || 'Unassigned'}
                      </td>
                      <td className="py-3 px-4 font-mono font-medium">
                        {sub.maxMarks}
                      </td>
                      <td className="py-3 px-4 font-mono text-rose-600 dark:text-rose-400 font-medium">
                        {sub.passingMarks}
                      </td>
                      {canManage && (
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => deleteSubject(sub.id)}
                            className="text-neutral-400 hover:text-rose-600 p-1 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Timetable */}
      {activeTab === 'timetable' && <TimetableView />}

      {/* Tab 4: Assignments */}
      {activeTab === 'assignments' && <AssignmentsView />}

      {/* Tab 5: Academic Sessions */}
      {activeTab === 'sessions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Academic Session Calendar
              </h3>
              <p className="text-xs text-neutral-500">
                Only one session can be marked active across the school database at any time.
              </p>
            </div>
            {canManage && (
              <button
                onClick={() => setIsSessionModalOpen(true)}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add Academic Session
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {sessions.map((sess) => (
              <div
                key={sess.id}
                className={`rounded-xl border p-4 shadow-xs transition-all ${
                  sess.isActive
                    ? 'border-blue-500 bg-blue-50/40 dark:border-blue-500 dark:bg-blue-950/20'
                    : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold font-mono text-neutral-900 dark:text-neutral-100">
                    {sess.name}
                  </h4>
                  {sess.isActive ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-100 dark:bg-blue-900/60 dark:text-blue-300 px-2 py-0.5 rounded-sm">
                      <CheckCircle className="h-3 w-3" /> ACTIVE
                    </span>
                  ) : (
                    <button
                      onClick={() => setActiveSession(sess.id)}
                      className="text-xs text-neutral-600 hover:text-blue-600 dark:text-neutral-400 font-semibold cursor-pointer underline"
                    >
                      Make Active
                    </button>
                  )}
                </div>

                <div className="mt-3 space-y-1 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                  <div>Starts: {sess.startDate}</div>
                  <div>Concludes: {sess.endDate}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals for Add Class, Section, Subject, Session */}
      {isClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-3">Add New Class</h3>
            <form onSubmit={handleAddClass} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-medium">Class Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grade 11 / Pre-Medical"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-medium">Numeric Order</label>
                <input
                  type="number"
                  value={newClassOrder}
                  onChange={(e) => setNewClassOrder(Number(e.target.value))}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-medium">Class Teacher Incharge</label>
                <select
                  value={newClassTeacherId}
                  onChange={(e) => setNewClassTeacherId(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                >
                  <option value="">Select Incharge Faculty</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>{t.name} ({t.employeeId})</option>
                  ))}
                </select>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsClassModalOpen(false)}
                  className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  Create Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isSectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-3">Add Section</h3>
            <form onSubmit={handleAddSection} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-medium">Class</label>
                <select
                  value={newSecClassId}
                  onChange={(e) => setNewSecClassId(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-medium">Section Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. A, B, Blue, Lotus"
                  value={newSecName}
                  onChange={(e) => setNewSecName(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-medium">Room Number</label>
                  <input
                    type="text"
                    placeholder="Room 204"
                    value={newSecRoom}
                    onChange={(e) => setNewSecRoom(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-medium">Capacity</label>
                  <input
                    type="number"
                    value={newSecCapacity}
                    onChange={(e) => setNewSecCapacity(Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsSectionModalOpen(false)}
                  className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  Save Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isSubjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-3">Add Subject</h3>
            <form onSubmit={handleAddSubject} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Subject Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mathematics"
                    value={subName}
                    onChange={(e) => setSubName(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Subject Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="MTH-101"
                    value={subCode}
                    onChange={(e) => setSubCode(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Class</label>
                  <select
                    value={subClassId}
                    onChange={(e) => setSubClassId(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">Subject Type</label>
                  <select
                    value={subType}
                    onChange={(e) => setSubType(e.target.value as any)}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                  >
                    <option value="Compulsory">Compulsory</option>
                    <option value="Optional">Optional</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium mb-1">Teacher</label>
                  <select
                    value={subTeacherId}
                    onChange={(e) => setSubTeacherId(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                  >
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">Max Marks</label>
                  <input
                    type="number"
                    value={subMaxMarks}
                    onChange={(e) => setSubMaxMarks(Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Passing Marks</label>
                  <input
                    type="number"
                    value={subPassMarks}
                    onChange={(e) => setSubPassMarks(Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsSubjectModalOpen(false)}
                  className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  Add Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isSessionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-3">Add Academic Session</h3>
            <form onSubmit={handleAddSession} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium mb-1">Session Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2027-2028"
                  value={sessName}
                  onChange={(e) => setSessName(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    value={sessStart}
                    onChange={(e) => setSessStart(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    value={sessEnd}
                    onChange={(e) => setSessEnd(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sessIsActive}
                    onChange={(e) => setSessIsActive(e.target.checked)}
                    className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Activate this session immediately for the institution</span>
                </label>
                <p className="text-[10px] text-neutral-500 pl-6 mt-0.5">
                  Switches the school active operational year and updates all fee structures and class roll calls.
                </p>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsSessionModalOpen(false)}
                  className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  Save Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
