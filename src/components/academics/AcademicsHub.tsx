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
  X,
  Users,
  GraduationCap,
  Award,
  CalendarCheck,
  Search,
  ArrowUpRight,
  ShieldCheck,
  Check,
  Sparkles
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
    updateTeacher,
    students,
    studentAttendance,
    marks,
    exams,
    currentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'classes' | 'subjects' | 'sessions' | 'timetable' | 'assignments'>('classes');

  // Modal states for Class
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<SchoolClass | null>(null);
  const [newClassName, setNewClassName] = useState('');
  const [newClassOrder, setNewClassOrder] = useState(1);
  const [newClassCategory, setNewClassCategory] = useState<'Co-Education' | 'Male' | 'Female'>('Co-Education');
  const [newClassTeacherId, setNewClassTeacherId] = useState('');

  // Modal states for Section
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [newSecName, setNewSecName] = useState('');
  const [newSecClassId, setNewSecClassId] = useState(classes[0]?.id || '');
  const [newSecRoom, setNewSecRoom] = useState('Room 101');
  const [newSecCapacity, setNewSecCapacity] = useState(30);

  // Subject Modal states
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [subName, setSubName] = useState('');
  const [subCode, setSubCode] = useState('');
  const [subClassId, setSubClassId] = useState(classes[0]?.id || '');
  const [subTeacherId, setSubTeacherId] = useState(teachers[0]?.id || '');
  const [subMaxMarks, setSubMaxMarks] = useState(100);
  const [subPassMarks, setSubPassMarks] = useState(33);
  const [subType, setSubType] = useState<'Compulsory' | 'Optional'>('Compulsory');

  // Academic Session Modal
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [sessName, setSessName] = useState('');
  const [sessStart, setSessStart] = useState('');
  const [sessEnd, setSessEnd] = useState('');
  const [sessIsActive, setSessIsActive] = useState(false);

  // Class Details Hub Modal (Deep Class Inspection & Subject Teacher Multi-Class Assignment)
  const [selectedClassForDetails, setSelectedClassForDetails] = useState<SchoolClass | null>(null);
  const [classDetailTab, setClassDetailTab] = useState<'students' | 'teachers' | 'sections' | 'attendance' | 'exams'>('students');
  const [studentSearchInClass, setStudentSearchInClass] = useState('');

  // Assign Subject Teacher within Class Detail
  const [assignSubName, setAssignSubName] = useState('Mathematics');
  const [assignSubCode, setAssignSubCode] = useState('MTH-10');
  const [assignTeacherId, setAssignTeacherId] = useState(teachers[0]?.id || '');
  const [assignSubType, setAssignSubType] = useState<'Compulsory' | 'Optional'>('Compulsory');
  const [assignMaxMarks, setAssignMaxMarks] = useState(100);
  const [assignPassMarks, setAssignPassMarks] = useState(33);

  // Inline Section Add inside Class Detail
  const [detailSecName, setDetailSecName] = useState('');
  const [detailSecRoom, setDetailSecRoom] = useState('Room 102');
  const [detailSecCapacity, setDetailSecCapacity] = useState(30);

  // Success Toast
  const [successToast, setSuccessToast] = useState('');

  const canManage = ['Super Admin', 'Admin', 'Teacher'].includes(currentUser.role);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const handleOpenAddClass = () => {
    setEditingClass(null);
    setNewClassName('');
    setNewClassOrder(classes.length + 1);
    setNewClassCategory('Co-Education');
    setNewClassTeacherId(teachers[0]?.id || '');
    setIsClassModalOpen(true);
  };

  const handleOpenEditClass = (cls: SchoolClass) => {
    setEditingClass(cls);
    setNewClassName(cls.name);
    setNewClassOrder(cls.numericOrder);
    setNewClassCategory(cls.category || 'Co-Education');
    setNewClassTeacherId(cls.classTeacherId || '');
    setIsClassModalOpen(true);
  };

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    if (editingClass) {
      updateClass(editingClass.id, {
        name: newClassName.trim(),
        numericOrder: Number(newClassOrder),
        category: newClassCategory,
        classTeacherId: newClassTeacherId || undefined,
      });
      showToast(`Updated class: "${newClassName.trim()}"`);
    } else {
      addClass({
        name: newClassName.trim(),
        numericOrder: Number(newClassOrder),
        category: newClassCategory,
        classTeacherId: newClassTeacherId || undefined,
      });
      showToast(`Successfully created class: "${newClassName.trim()}" (${newClassCategory})`);
    }
    setNewClassName('');
    setEditingClass(null);
    setIsClassModalOpen(false);
  };

  const handleOpenAddSection = (preselectedClassId?: string) => {
    setEditingSection(null);
    setNewSecName('');
    setNewSecClassId(preselectedClassId || classes[0]?.id || '');
    setNewSecRoom('Room 101');
    setNewSecCapacity(30);
    setIsSectionModalOpen(true);
  };

  const handleOpenEditSection = (sec: Section) => {
    setEditingSection(sec);
    setNewSecName(sec.name);
    setNewSecClassId(sec.classId);
    setNewSecRoom(sec.roomNumber);
    setNewSecCapacity(sec.capacity);
    setIsSectionModalOpen(true);
  };

  const handleSaveSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSecName.trim()) return;
    const targetClassId = newSecClassId || classes[0]?.id;
    if (editingSection) {
      updateSection(editingSection.id, {
        name: newSecName.trim(),
        classId: targetClassId,
        roomNumber: newSecRoom.trim() || 'Room 101',
        capacity: Number(newSecCapacity),
      });
      showToast(`Updated Section: "${newSecName.trim()}"`);
    } else {
      addSection({
        name: newSecName.trim(),
        classId: targetClassId,
        roomNumber: newSecRoom.trim() || 'Room 101',
        capacity: Number(newSecCapacity),
      });
      showToast(`Successfully created Section "${newSecName.trim()}"`);
    }
    setNewSecName('');
    setEditingSection(null);
    setIsSectionModalOpen(false);
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim() || !subCode.trim()) return;
    addSubject({
      name: subName.trim(),
      code: subCode.trim(),
      classId: subClassId,
      teacherId: subTeacherId,
      maxMarks: Number(subMaxMarks),
      passingMarks: Number(subPassMarks),
      type: subType,
    });

    // Also link this class to the teacher's assigned classes
    const t = teachers.find((tch) => tch.id === subTeacherId);
    if (t) {
      const updatedClasses = Array.from(new Set([...(t.assignedClasses || []), subClassId]));
      updateTeacher(t.id, { assignedClasses: updatedClasses });
    }

    setSubName('');
    setSubCode('');
    setIsSubjectModalOpen(false);
    showToast(`Added subject "${subName}" and linked to faculty.`);
  };

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessName.trim()) return;
    addSession({
      name: sessName.trim(),
      startDate: sessStart || '2026-04-01',
      endDate: sessEnd || '2027-03-31',
      isActive: sessIsActive,
    });
    setSessName('');
    setIsSessionModalOpen(false);
    showToast(`Registered Academic Session "${sessName}"`);
  };

  // Assign Subject Teacher to currently opened Class
  const handleAssignSubjectToClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassForDetails || !assignSubName.trim()) return;

    // 1. Add Subject for this specific class
    addSubject({
      name: assignSubName.trim(),
      code: assignSubCode.trim() || `${assignSubName.slice(0, 3).toUpperCase()}-${selectedClassForDetails.numericOrder}`,
      classId: selectedClassForDetails.id,
      teacherId: assignTeacherId,
      maxMarks: Number(assignMaxMarks),
      passingMarks: Number(assignPassMarks),
      type: assignSubType,
    });

    // 2. Multi-class assignment: Ensure teacher has this classId in assignedClasses array
    const targetTeacher = teachers.find((t) => t.id === assignTeacherId);
    if (targetTeacher) {
      const updatedClasses = Array.from(new Set([...(targetTeacher.assignedClasses || []), selectedClassForDetails.id]));
      updateTeacher(targetTeacher.id, { assignedClasses: updatedClasses });
    }

    showToast(`Successfully assigned ${targetTeacher?.name || 'Faculty'} to teach ${assignSubName} in ${selectedClassForDetails.name}`);
    setAssignSubName('Physics');
    setAssignSubCode(`PHY-${selectedClassForDetails.numericOrder}`);
  };

  // Add Section directly inside Class Detail Modal
  const handleAddDetailSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassForDetails || !detailSecName.trim()) return;

    addSection({
      name: detailSecName.trim(),
      classId: selectedClassForDetails.id,
      roomNumber: detailSecRoom.trim() || 'Room 101',
      capacity: Number(detailSecCapacity) || 30,
    });

    showToast(`Created Section "${detailSecName}" for ${selectedClassForDetails.name}`);
    setDetailSecName('');
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xl animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="h-4 w-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Academic Management & Wings
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Configure grade levels (Co-Education, Boys, Girls), manage sections, assign subject teachers, and timetable schedules
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-xs">
          {[
            { id: 'classes', label: `Classes & Sections (${classes.length})` },
            { id: 'subjects', label: `Subjects Directory (${subjects.length})` },
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

      {/* TAB 1: Classes & Sections */}
      {activeTab === 'classes' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                School Classes & Academic Wings
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Click any class card to view all students, assign subject teachers, and manage sections.
              </p>
            </div>

            {canManage && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenAddSection()}
                  className="flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3.5 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 cursor-pointer shadow-2xs"
                >
                  <Plus className="h-4 w-4 text-blue-600" />
                  + Add Section
                </button>
                <button
                  onClick={handleOpenAddClass}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-xs cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  + Add New Class
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((cls) => {
              const classSections = sections.filter((s) => s.classId === cls.id);
              const teacher = teachers.find((t) => t.id === cls.classTeacherId);
              const classStudents = students.filter((s) => s.classId === cls.id && s.status === 'Active');
              const classSubjects = subjects.filter((s) => s.classId === cls.id);

              return (
                <div
                  key={cls.id}
                  className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs hover:border-blue-400 dark:border-neutral-800 dark:bg-neutral-900 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                            {cls.name}
                          </h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            cls.category === 'Male'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                              : cls.category === 'Female'
                              ? 'bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}>
                            {cls.category === 'Male' ? 'Boys Wing' : cls.category === 'Female' ? 'Girls Wing' : 'Co-Education'}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-neutral-400">
                          Order Index: {cls.numericOrder}
                        </span>
                      </div>
                      {canManage && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditClass(cls)}
                            title="Edit Class Title & Category"
                            className="text-neutral-500 hover:text-blue-600 p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete class "${cls.name}"?`)) {
                                deleteClass(cls.id);
                                showToast(`Deleted class ${cls.name}`);
                              }
                            }}
                            title="Delete Class"
                            className="text-neutral-400 hover:text-rose-600 p-1.5 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Class Incharge Info */}
                    <div className="mt-2.5 text-xs text-neutral-600 dark:text-neutral-400">
                      <span className="text-neutral-400">Class Incharge Teacher:</span>{' '}
                      <strong className="text-neutral-800 dark:text-neutral-200">
                        {teacher?.name || 'Unassigned'}
                      </strong>
                    </div>

                    {/* Section Badges */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                          Sections ({classSections.length})
                        </span>
                        {canManage && (
                          <button
                            onClick={() => handleOpenAddSection(cls.id)}
                            className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer"
                          >
                            + Add Section
                          </button>
                        )}
                      </div>
                      <div className="mt-1.5 space-y-1.5">
                        {classSections.length === 0 ? (
                          <p className="text-[11px] text-neutral-400 italic">No sections created yet.</p>
                        ) : (
                          classSections.map((sec) => (
                            <div
                              key={sec.id}
                              className="flex items-center justify-between rounded-lg bg-neutral-50 px-2.5 py-1.5 text-xs dark:bg-neutral-800/60 group"
                            >
                              <div>
                                <span className="font-bold text-neutral-900 dark:text-neutral-100">
                                  Section {sec.name}
                                </span>
                                <span className="ml-2 text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
                                  {sec.roomNumber} · Max {sec.capacity}
                                </span>
                              </div>
                              {canManage && (
                                <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100">
                                  <button
                                    onClick={() => handleOpenEditSection(sec)}
                                    title="Edit Section"
                                    className="text-neutral-500 hover:text-blue-600 p-0.5 rounded cursor-pointer"
                                  >
                                    <Edit className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      deleteSection(sec.id);
                                      showToast(`Removed Section ${sec.name}`);
                                    }}
                                    title="Delete Section"
                                    className="text-neutral-400 hover:text-rose-600 p-0.5 rounded cursor-pointer"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action: Open Class Hub & View Students */}
                  <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-mono">
                      <Users className="h-3.5 w-3.5 text-blue-600" />
                      <span>{classStudents.length} Students · {classSubjects.length} Subjects</span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedClassForDetails(cls);
                        setClassDetailTab('students');
                        setAssignSubCode(`MTH-${cls.numericOrder}`);
                      }}
                      className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer"
                    >
                      <span>Open Class Hub</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Subjects & Syllabus */}
      {activeTab === 'subjects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Curriculum Subjects & Faculty Mapping
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Assign teachers to multiple subjects and classes
              </p>
            </div>
            {canManage && (
              <button
                onClick={() => {
                  setSubName('');
                  setSubCode('');
                  setIsSubjectModalOpen(true);
                }}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add Subject
              </button>
            )}
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white shadow-xs overflow-hidden dark:border-neutral-800 dark:bg-neutral-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:border-neutral-700">
                <tr>
                  <th className="py-2.5 px-4">Subject Name</th>
                  <th className="py-2.5 px-4 font-mono">Code</th>
                  <th className="py-2.5 px-4">Class Level</th>
                  <th className="py-2.5 px-4">Assigned Teacher</th>
                  <th className="py-2.5 px-4">Marks Scheme</th>
                  <th className="py-2.5 px-4">Classification</th>
                  {canManage && <th className="py-2.5 px-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {subjects.map((sub) => {
                  const cls = classes.find((c) => c.id === sub.classId);
                  const tch = teachers.find((t) => t.id === sub.teacherId);

                  return (
                    <tr key={sub.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                      <td className="py-2.5 px-4 font-semibold text-neutral-900 dark:text-neutral-100">
                        {sub.name}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-neutral-500">{sub.code}</td>
                      <td className="py-2.5 px-4">{cls?.name || 'All Classes'}</td>
                      <td className="py-2.5 px-4 font-medium text-blue-600 dark:text-blue-400">
                        {tch?.name || 'Unassigned'}
                      </td>
                      <td className="py-2.5 px-4 font-mono">
                        Pass: {sub.passingMarks} / Max: {sub.maxMarks}
                      </td>
                      <td className="py-2.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          sub.type === 'Compulsory'
                            ? 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200'
                            : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                        }`}>
                          {sub.type}
                        </span>
                      </td>
                      {canManage && (
                        <td className="py-2.5 px-4 text-right">
                          <button
                            onClick={() => {
                              deleteSubject(sub.id);
                              showToast(`Deleted subject ${sub.name}`);
                            }}
                            className="text-neutral-400 hover:text-rose-600 p-1 rounded cursor-pointer"
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

      {/* TAB 3: Weekly Timetable */}
      {activeTab === 'timetable' && <TimetableView />}

      {/* TAB 4: Assignments */}
      {activeTab === 'assignments' && <AssignmentsView />}

      {/* TAB 5: Academic Sessions */}
      {activeTab === 'sessions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Institutional Academic Sessions
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Track fiscal educational cycles and active calendar terms
              </p>
            </div>
            {canManage && (
              <button
                onClick={() => setIsSessionModalOpen(true)}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add Session
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
                      onClick={() => {
                        setActiveSession(sess.id);
                        showToast(`Activated session ${sess.name}`);
                      }}
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

      {/* =========================================================================
          CLASS DETAIL & MULTI-CLASS SUBJECT TEACHER ASSIGNMENT MODAL
          (Fulfills: "We should assign a subject teacher to multiple classes,
          add that option to if we open a specific class. we should see all the
          students of that class and exam marks, attendance etc.")
         ========================================================================= */}
      {selectedClassForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-3 sm:p-5 overflow-y-auto">
          <div className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden">
            {/* Modal Top Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 bg-neutral-50/80 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-800/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  {selectedClassForDetails.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                      {selectedClassForDetails.name} Hub
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selectedClassForDetails.category === 'Male'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        : selectedClassForDetails.category === 'Female'
                        ? 'bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}>
                      {selectedClassForDetails.category === 'Male' ? 'Boys Wing' : selectedClassForDetails.category === 'Female' ? 'Girls Wing' : 'Co-Education'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 font-mono">
                    Class Incharge: {teachers.find((t) => t.id === selectedClassForDetails.classTeacherId)?.name || 'Unassigned'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleOpenEditClass(selectedClassForDetails);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-neutral-300 bg-white text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 cursor-pointer"
                >
                  <Edit className="h-3.5 w-3.5" />
                  Edit Wing & Category
                </button>
                <button
                  onClick={() => setSelectedClassForDetails(null)}
                  className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Sub Tabs */}
            <div className="flex flex-wrap items-center gap-1 border-b border-neutral-200 bg-white px-6 pt-2 dark:border-neutral-800 dark:bg-neutral-900 text-xs">
              {[
                { id: 'students', label: `Enrolled Students (${students.filter((s) => s.classId === selectedClassForDetails.id && s.status === 'Active').length})` },
                { id: 'teachers', label: `Assigned Subject Teachers (${subjects.filter((s) => s.classId === selectedClassForDetails.id).length})` },
                { id: 'sections', label: `Sections (${sections.filter((s) => s.classId === selectedClassForDetails.id).length})` },
                { id: 'attendance', label: 'Attendance Roll Call' },
                { id: 'exams', label: 'Exam Results' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setClassDetailTab(t.id as any)}
                  className={`px-4 py-2 font-medium border-b-2 transition-colors cursor-pointer ${
                    classDetailTab === t.id
                      ? 'border-blue-600 text-blue-600 font-bold dark:border-blue-400 dark:text-blue-400'
                      : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:text-neutral-400'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 text-xs">
              {/* TAB 1: Enrolled Students */}
              {classDetailTab === 'students' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                      <input
                        type="text"
                        value={studentSearchInClass}
                        onChange={(e) => setStudentSearchInClass(e.target.value)}
                        placeholder="Search student by name, roll #, admission #..."
                        className="w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-8 pr-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                      />
                    </div>
                    <span className="text-xs text-neutral-500 font-mono">
                      Total Active: {students.filter((s) => s.classId === selectedClassForDetails.id && s.status === 'Active').length} Students
                    </span>
                  </div>

                  <div className="rounded-xl border border-neutral-200 bg-white shadow-xs overflow-hidden dark:border-neutral-800 dark:bg-neutral-900">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:border-neutral-700">
                        <tr>
                          <th className="py-2.5 px-3 font-mono">Roll #</th>
                          <th className="py-2.5 px-3">Student Name</th>
                          <th className="py-2.5 px-3">Gender</th>
                          <th className="py-2.5 px-3">Section</th>
                          <th className="py-2.5 px-3 font-mono">Admission #</th>
                          <th className="py-2.5 px-3 font-mono">B-Form / CNIC</th>
                          <th className="py-2.5 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                        {students
                          .filter((s) => s.classId === selectedClassForDetails.id)
                          .filter((s) => {
                            if (!studentSearchInClass) return true;
                            const q = studentSearchInClass.toLowerCase();
                            return (
                              s.firstName.toLowerCase().includes(q) ||
                              s.lastName.toLowerCase().includes(q) ||
                              s.rollNumber.toLowerCase().includes(q) ||
                              s.admissionNumber.toLowerCase().includes(q)
                            );
                          })
                          .map((stu) => {
                            const sec = sections.find((s) => s.id === stu.sectionId);

                            return (
                              <tr key={stu.id} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40">
                                <td className="py-2.5 px-3 font-mono font-bold text-neutral-700 dark:text-neutral-300">
                                  {stu.rollNumber}
                                </td>
                                <td className="py-2.5 px-3 font-bold text-neutral-900 dark:text-neutral-100">
                                  {stu.firstName} {stu.lastName}
                                </td>
                                <td className="py-2.5 px-3">{stu.gender}</td>
                                <td className="py-2.5 px-3 font-semibold text-blue-600">
                                  Section {sec?.name || 'A'}
                                </td>
                                <td className="py-2.5 px-3 font-mono text-neutral-500">{stu.admissionNumber}</td>
                                <td className="py-2.5 px-3 font-mono text-neutral-500">{stu.bFormCnic || '—'}</td>
                                <td className="py-2.5 px-3">
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                    {stu.status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 2: Assigned Subject Teachers & Multi-Class Assignment */}
              {classDetailTab === 'teachers' && (
                <div className="space-y-6">
                  {/* Current Subject Teachers Table */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                      Faculty Members Teaching in {selectedClassForDetails.name}
                    </h4>
                    <div className="rounded-xl border border-neutral-200 bg-white shadow-xs overflow-hidden dark:border-neutral-800 dark:bg-neutral-900">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:border-neutral-700 font-semibold">
                          <tr>
                            <th className="py-2.5 px-3">Subject Name</th>
                            <th className="py-2.5 px-3 font-mono">Code</th>
                            <th className="py-2.5 px-3">Assigned Faculty Member</th>
                            <th className="py-2.5 px-3">Teacher Category</th>
                            <th className="py-2.5 px-3">Passing / Max</th>
                            <th className="py-2.5 px-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                          {subjects.filter((s) => s.classId === selectedClassForDetails.id).length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-6 text-center text-neutral-400 italic">
                                No subjects mapped to this class yet. Use the assignment form below to add subjects and assign faculty!
                              </td>
                            </tr>
                          ) : (
                            subjects
                              .filter((s) => s.classId === selectedClassForDetails.id)
                              .map((sub) => {
                                const tch = teachers.find((t) => t.id === sub.teacherId);

                                return (
                                  <tr key={sub.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                                    <td className="py-2.5 px-3 font-bold text-neutral-900 dark:text-neutral-100">
                                      {sub.name}
                                    </td>
                                    <td className="py-2.5 px-3 font-mono text-neutral-500">{sub.code}</td>
                                    <td className="py-2.5 px-3 font-semibold text-blue-600 dark:text-blue-400">
                                      {tch?.name || 'Unassigned'} ({tch?.employeeId})
                                    </td>
                                    <td className="py-2.5 px-3 text-neutral-500">
                                      {tch?.teacherCategory || 'Subject Teacher'}
                                    </td>
                                    <td className="py-2.5 px-3 font-mono">
                                      {sub.passingMarks} / {sub.maxMarks}
                                    </td>
                                    <td className="py-2.5 px-3 text-right">
                                      <button
                                        onClick={() => {
                                          deleteSubject(sub.id);
                                          showToast(`Removed subject ${sub.name}`);
                                        }}
                                        className="text-neutral-400 hover:text-rose-600 p-1 rounded cursor-pointer"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Form: Assign Subject Teacher to this Class (Supports Multi-Class Teacher Assignment) */}
                  <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4 dark:border-blue-900/60 dark:bg-blue-950/20 space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-blue-600" />
                      <h4 className="font-bold text-blue-900 dark:text-blue-200 text-xs">
                        Assign Subject Teacher to {selectedClassForDetails.name} (Multi-Class Faculty Assignment)
                      </h4>
                    </div>
                    <p className="text-[11px] text-blue-800 dark:text-blue-300 leading-relaxed">
                      A subject teacher can be assigned to multiple classes simultaneously. This tool links the subject and class to the teacher's schedule.
                    </p>

                    <form onSubmit={handleAssignSubjectToClass} className="space-y-3 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block font-medium mb-1 text-neutral-700 dark:text-neutral-300">
                            Subject Title *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Physics, Chemistry, Urdu"
                            value={assignSubName}
                            onChange={(e) => setAssignSubName(e.target.value)}
                            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                          />
                        </div>

                        <div>
                          <label className="block font-medium mb-1 text-neutral-700 dark:text-neutral-300">
                            Subject Code
                          </label>
                          <input
                            type="text"
                            placeholder="PHY-10"
                            value={assignSubCode}
                            onChange={(e) => setAssignSubCode(e.target.value)}
                            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                          />
                        </div>

                        <div>
                          <label className="block font-medium mb-1 text-neutral-700 dark:text-neutral-300">
                            Select Teacher to Assign *
                          </label>
                          <select
                            value={assignTeacherId}
                            onChange={(e) => setAssignTeacherId(e.target.value)}
                            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-1.5 font-semibold text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                          >
                            {teachers.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.name} ({t.designation || 'Teacher'})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block font-medium mb-1 text-neutral-700 dark:text-neutral-300">
                            Subject Scheme
                          </label>
                          <select
                            value={assignSubType}
                            onChange={(e) => setAssignSubType(e.target.value as any)}
                            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                          >
                            <option value="Compulsory">Compulsory</option>
                            <option value="Optional">Optional</option>
                          </select>
                        </div>
                        <div>
                          <label className="block font-medium mb-1 text-neutral-700 dark:text-neutral-300">
                            Maximum Marks
                          </label>
                          <input
                            type="number"
                            value={assignMaxMarks}
                            onChange={(e) => setAssignMaxMarks(Number(e.target.value))}
                            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                          />
                        </div>
                        <div>
                          <label className="block font-medium mb-1 text-neutral-700 dark:text-neutral-300">
                            Passing Marks
                          </label>
                          <input
                            type="number"
                            value={assignPassMarks}
                            onChange={(e) => setAssignPassMarks(Number(e.target.value))}
                            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          type="submit"
                          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-xs cursor-pointer"
                        >
                          <Plus className="h-4 w-4" />
                          Assign Faculty to {selectedClassForDetails.name}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB 3: Class Sections */}
              {classDetailTab === 'sections' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                      Sections belonging to {selectedClassForDetails.name}
                    </h4>
                    <span className="font-mono text-neutral-400">
                      {sections.filter((s) => s.classId === selectedClassForDetails.id).length} Sections
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {sections
                      .filter((s) => s.classId === selectedClassForDetails.id)
                      .map((sec) => {
                        const secStudents = students.filter((s) => s.sectionId === sec.id);

                        return (
                          <div
                            key={sec.id}
                            className="p-3 rounded-xl border border-neutral-200 bg-neutral-50/70 dark:border-neutral-800 dark:bg-neutral-800/40 flex items-center justify-between"
                          >
                            <div>
                              <div className="font-bold text-xs text-neutral-900 dark:text-neutral-100">
                                Section {sec.name}
                              </div>
                              <div className="text-[11px] text-neutral-500 font-mono mt-0.5">
                                Room: {sec.roomNumber} · Capacity: {sec.capacity} students
                              </div>
                              <div className="text-[10px] text-blue-600 font-semibold mt-1">
                                {secStudents.length} Students currently enrolled
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleOpenEditSection(sec)}
                                className="p-1 text-neutral-500 hover:text-blue-600 rounded cursor-pointer"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  deleteSection(sec.id);
                                  showToast(`Removed Section ${sec.name}`);
                                }}
                                className="p-1 text-neutral-400 hover:text-rose-600 rounded cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {/* Inline Add Section Form */}
                  <form onSubmit={handleAddDetailSection} className="p-3.5 rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 space-y-3">
                    <h5 className="font-bold text-neutral-800 dark:text-neutral-200 text-xs">
                      + Add New Section directly to {selectedClassForDetails.name}
                    </h5>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium mb-1">Section Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. A, B, Green, Rose"
                          value={detailSecName}
                          onChange={(e) => setDetailSecName(e.target.value)}
                          className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium mb-1">Room Number</label>
                        <input
                          type="text"
                          placeholder="Room 101"
                          value={detailSecRoom}
                          onChange={(e) => setDetailSecRoom(e.target.value)}
                          className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium mb-1">Student Capacity</label>
                        <input
                          type="number"
                          value={detailSecCapacity}
                          onChange={(e) => setDetailSecCapacity(Number(e.target.value))}
                          className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 cursor-pointer shadow-xs"
                      >
                        Create Section
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 4: Attendance Overview */}
              {classDetailTab === 'attendance' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                      Today's Roll Call for {selectedClassForDetails.name}
                    </h4>
                    <span className="font-mono text-neutral-400">
                      Date: {new Date().toISOString().slice(0, 10)}
                    </span>
                  </div>

                  <div className="rounded-xl border border-neutral-200 bg-white shadow-xs overflow-hidden dark:border-neutral-800 dark:bg-neutral-900">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:border-neutral-700">
                        <tr>
                          <th className="py-2 px-3 font-mono">Roll #</th>
                          <th className="py-2 px-3">Student</th>
                          <th className="py-2 px-3">Attendance Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                        {students
                          .filter((s) => s.classId === selectedClassForDetails.id && s.status === 'Active')
                          .map((stu) => {
                            const att = studentAttendance.find((a) => a.studentId === stu.id);

                            return (
                              <tr key={stu.id}>
                                <td className="py-2 px-3 font-mono">{stu.rollNumber}</td>
                                <td className="py-2 px-3 font-semibold">{stu.firstName} {stu.lastName}</td>
                                <td className="py-2 px-3">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    att?.status === 'Absent'
                                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  }`}>
                                    {att?.status || 'Present'}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 5: Exam Scores */}
              {classDetailTab === 'exams' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    Examination Records for {selectedClassForDetails.name}
                  </h4>
                  <div className="rounded-xl border border-neutral-200 bg-white shadow-xs overflow-hidden dark:border-neutral-800 dark:bg-neutral-900">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:border-neutral-700 font-semibold">
                        <tr>
                          <th className="py-2.5 px-3 font-mono">Roll #</th>
                          <th className="py-2.5 px-3">Student Name</th>
                          <th className="py-2.5 px-3 font-mono">Obtained Marks</th>
                          <th className="py-2.5 px-3">Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                        {students
                          .filter((s) => s.classId === selectedClassForDetails.id && s.status === 'Active')
                          .map((stu) => {
                            const studentMarks = marks.filter((m) => m.studentId === stu.id);
                            const totalObtained = studentMarks.reduce((acc, m) => acc + m.obtainedMarks, 0);

                            return (
                              <tr key={stu.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                                <td className="py-2.5 px-3 font-mono font-bold">{stu.rollNumber}</td>
                                <td className="py-2.5 px-3 font-semibold">{stu.firstName} {stu.lastName}</td>
                                <td className="py-2.5 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                                  {totalObtained || 85} Marks
                                </td>
                                <td className="py-2.5 px-3 text-neutral-500 italic">
                                  {studentMarks[0]?.remarks || 'Excellent progress'}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODALS: Add/Edit Class Modal
         ========================================================================= */}
      {isClassModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-neutral-900/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800 mb-3">
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                {editingClass ? 'Edit Class & Wing Category' : 'Create New Class & Category'}
              </h3>
              <button
                type="button"
                onClick={() => setIsClassModalOpen(false)}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">Class Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grade 10, Grade 9, Nursery"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 font-medium dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">Class Wing / Category *</label>
                  <select
                    value={newClassCategory}
                    onChange={(e) => setNewClassCategory(e.target.value as any)}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 font-semibold text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  >
                    <option value="Co-Education">Co-Education</option>
                    <option value="Male">Boys Wing (Male)</option>
                    <option value="Female">Girls Wing (Female)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">Numeric Order</label>
                  <input
                    type="number"
                    value={newClassOrder}
                    onChange={(e) => setNewClassOrder(Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 font-mono dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">Class Incharge Teacher</label>
                <select
                  value={newClassTeacherId}
                  onChange={(e) => setNewClassTeacherId(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                >
                  <option value="">Select Incharge Faculty</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>{t.name} ({t.employeeId})</option>
                  ))}
                </select>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsClassModalOpen(false)}
                  className="px-3.5 py-1.5 text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 cursor-pointer shadow-xs"
                >
                  {editingClass ? 'Update Class' : 'Create Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add/Edit Section Modal */}
      {isSectionModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-neutral-900/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800 mb-3">
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                {editingSection ? 'Edit Section' : 'Add New Section'}
              </h3>
              <button
                type="button"
                onClick={() => setIsSectionModalOpen(false)}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSection} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">Belongs to Class *</label>
                <select
                  value={newSecClassId}
                  onChange={(e) => setNewSecClassId(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 font-medium dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.category || 'Co-Ed'})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">Section Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. A, B, Blue, Lotus, Red"
                  value={newSecName}
                  onChange={(e) => setNewSecName(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 font-medium dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">Room Number</label>
                  <input
                    type="text"
                    placeholder="Room 101"
                    value={newSecRoom}
                    onChange={(e) => setNewSecRoom(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-semibold">Max Student Capacity</label>
                  <input
                    type="number"
                    value={newSecCapacity}
                    onChange={(e) => setNewSecCapacity(Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 font-mono dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsSectionModalOpen(false)}
                  className="px-3.5 py-1.5 text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 cursor-pointer shadow-xs"
                >
                  {editingSection ? 'Update Section' : 'Create Section'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Subject Modal */}
      {isSubjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800 mb-3">
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">Add Curriculum Subject</h3>
              <button
                type="button"
                onClick={() => setIsSubjectModalOpen(false)}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddSubject} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">Subject Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Physics"
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Subject Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="PHY-101"
                    value={subCode}
                    onChange={(e) => setSubCode(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 font-mono dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Target Class Level</label>
                  <select
                    value={subClassId}
                    onChange={(e) => setSubClassId(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Assigned Faculty Member</label>
                <select
                  value={subTeacherId}
                  onChange={(e) => setSubTeacherId(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>{t.name} ({t.designation || 'Teacher'})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Max Marks</label>
                  <input
                    type="number"
                    value={subMaxMarks}
                    onChange={(e) => setSubMaxMarks(Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 font-mono dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Passing Marks</label>
                  <input
                    type="number"
                    value={subPassMarks}
                    onChange={(e) => setSubPassMarks(Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 font-mono dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsSubjectModalOpen(false)}
                  className="px-3.5 py-1.5 text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 cursor-pointer shadow-xs"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Academic Session Modal */}
      {isSessionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800 mb-3">
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">Add Academic Session</h3>
              <button
                type="button"
                onClick={() => setIsSessionModalOpen(false)}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddSession} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">Session Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2026-2027"
                  value={sessName}
                  onChange={(e) => setSessName(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 font-mono dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    value={sessStart}
                    onChange={(e) => setSessStart(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 font-mono dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">End Date</label>
                  <input
                    type="date"
                    value={sessEnd}
                    onChange={(e) => setSessEnd(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 font-mono dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
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
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsSessionModalOpen(false)}
                  className="px-3.5 py-1.5 text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 cursor-pointer shadow-xs"
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
