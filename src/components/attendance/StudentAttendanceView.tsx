import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentAttendanceRecord, TeacherAttendanceRecord, AttendanceStatus } from '../../types';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Save,
  Users,
  Search,
  Check,
  Printer,
  ShieldAlert,
  ShieldCheck,
  Lock
} from 'lucide-react';

export const StudentAttendanceView: React.FC = () => {
  const {
    students,
    classes,
    sections,
    studentAttendance,
    saveStudentAttendance,
    teacherAttendance,
    saveTeacherAttendance,
    teachers,
    currentUser,
    isClassTeacher,
    parents,
  } = useApp();

  const isParent = currentUser.role === 'Parent';
  const parentRecord = parents.find((p) => p.id === currentUser.linkedId || p.email === currentUser.email);
  const myChildren = students.filter((s) => parentRecord?.studentIds?.includes(s.id) || s.parentId === parentRecord?.id);

  const [attendanceType, setAttendanceType] = useState<'student' | 'teacher'>('student');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [selectedClassId, setSelectedClassId] = useState<string>(
    isParent && myChildren.length > 0 ? myChildren[0].classId : (classes[classes.length - 1]?.id || classes[0]?.id || '')
  );
  const [selectedSectionId, setSelectedSectionId] = useState<string>(sections[0]?.id || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const [teacherSaveSuccess, setTeacherSaveSuccess] = useState(false);

  // Strict RBAC: Attendance rights controlled exclusively by Super Admin, Academic & Admissions Admin, and designated Class Teachers
  const isSuperOrAdmin = ['Super Admin', 'Admin', 'Academic Admin', 'Admission Admin'].includes(currentUser.role);
  const currentTeacher = teachers.find(
    (t) => t.id === currentUser.linkedId || t.email === currentUser.email
  );
  const isClassTeacherRole =
    currentUser.role === 'Teacher' &&
    (currentTeacher?.teacherCategory === 'Class Teacher' ||
      currentTeacher?.isClassTeacher ||
      isClassTeacher(currentUser.id));
  const canControlStudentAttendance = isSuperOrAdmin || isClassTeacherRole;
  const canControlTeacherAttendance = ['Super Admin', 'Admin', 'Academic Admin', 'Admission Admin'].includes(currentUser.role);
  const canControlAttendance = canControlStudentAttendance;

  const isStudent = currentUser.role === 'Student';
  const teacherClasses = new Set<string>(currentTeacher?.assignedClasses || []);
  if (currentTeacher?.assignedClassId) teacherClasses.add(currentTeacher.assignedClassId);
  const attendanceClasses = currentUser.role === 'Teacher' && teacherClasses.size > 0
    ? classes.filter((c) => teacherClasses.has(c.id))
    : classes;

  // Student list for current selected class and category (Strictly scoped for Parent & Student)
  const classStudents = students.filter((s) => {
    if (isParent) {
      return myChildren.some((c) => c.id === s.id);
    }
    if (isStudent) {
      return s.id === currentUser.linkedId;
    }
    if (s.classId !== selectedClassId || s.status !== 'Active') return false;
    if (selectedCategory !== 'all' && (s.category || 'Co-Education') !== selectedCategory) return false;
    return true;
  });

  // Local state for student attendance records
  const [studentStatusMap, setStudentStatusMap] = useState<Record<string, { status: AttendanceStatus; remarks: string }>>(() => {
    const map: Record<string, { status: AttendanceStatus; remarks: string }> = {};
    classStudents.forEach((stu) => {
      const existing = studentAttendance.find((a) => a.studentId === stu.id && a.date === selectedDate);
      map[stu.id] = {
        status: existing?.status || 'Present',
        remarks: existing?.remarks || '',
      };
    });
    return map;
  });

  // Local state for teacher attendance records
  const [teacherStatusMap, setTeacherStatusMap] = useState<Record<string, { status: AttendanceStatus; remarks: string }>>(() => {
    const map: Record<string, { status: AttendanceStatus; remarks: string }> = {};
    teachers.forEach((tch) => {
      const existing = teacherAttendance.find((a) => a.teacherId === tch.id && a.date === selectedDate);
      map[tch.id] = {
        status: existing?.status || 'Present',
        remarks: existing?.remarks || '',
      };
    });
    return map;
  });

  // Re-sync student status map when date or class changes
  React.useEffect(() => {
    const map: Record<string, { status: AttendanceStatus; remarks: string }> = {};
    classStudents.forEach((stu) => {
      const existing = studentAttendance.find((a) => a.studentId === stu.id && a.date === selectedDate);
      map[stu.id] = {
        status: existing?.status || 'Present',
        remarks: existing?.remarks || '',
      };
    });
    setStudentStatusMap(map);
  }, [selectedDate, selectedClassId, studentAttendance]);

  // Re-sync teacher status map when date changes
  React.useEffect(() => {
    const map: Record<string, { status: AttendanceStatus; remarks: string }> = {};
    teachers.forEach((tch) => {
      const existing = teacherAttendance.find((a) => a.teacherId === tch.id && a.date === selectedDate);
      map[tch.id] = {
        status: existing?.status || 'Present',
        remarks: existing?.remarks || '',
      };
    });
    setTeacherStatusMap(map);
  }, [selectedDate, teacherAttendance, teachers]);

  const handleSetStudentStatus = (studentId: string, status: AttendanceStatus) => {
    if (!canControlStudentAttendance) return;
    setStudentStatusMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleSetStudentRemarks = (studentId: string, remarks: string) => {
    if (!canControlStudentAttendance) return;
    setStudentStatusMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks,
      },
    }));
  };

  const handleMarkAllPresent = () => {
    if (!canControlStudentAttendance) return;
    const updated: Record<string, { status: AttendanceStatus; remarks: string }> = {};
    classStudents.forEach((stu) => {
      updated[stu.id] = {
        status: 'Present',
        remarks: studentStatusMap[stu.id]?.remarks || '',
      };
    });
    setStudentStatusMap(updated);
  };

  const handleSaveAttendance = () => {
    if (!canControlStudentAttendance) return;
    const recordsToSave: StudentAttendanceRecord[] = classStudents.map((stu) => ({
      id: `att-${stu.id}-${selectedDate}`,
      studentId: stu.id,
      classId: selectedClassId,
      sectionId: selectedSectionId,
      date: selectedDate,
      status: studentStatusMap[stu.id]?.status || 'Present',
      remarks: studentStatusMap[stu.id]?.remarks || undefined,
    }));

    saveStudentAttendance(recordsToSave);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 2500);
  };

  // Teacher Handlers
  const handleSetTeacherStatus = (teacherId: string, status: AttendanceStatus) => {
    if (!canControlTeacherAttendance) return;
    setTeacherStatusMap((prev) => ({
      ...prev,
      [teacherId]: {
        ...prev[teacherId],
        status,
      },
    }));
  };

  const handleSetTeacherRemarks = (teacherId: string, remarks: string) => {
    if (!canControlTeacherAttendance) return;
    setTeacherStatusMap((prev) => ({
      ...prev,
      [teacherId]: {
        ...prev[teacherId],
        remarks,
      },
    }));
  };

  const handleMarkAllTeachersPresent = () => {
    if (!canControlTeacherAttendance) return;
    const updated: Record<string, { status: AttendanceStatus; remarks: string }> = {};
    teachers.forEach((t) => {
      updated[t.id] = {
        status: 'Present',
        remarks: teacherStatusMap[t.id]?.remarks || '',
      };
    });
    setTeacherStatusMap(updated);
  };

  const handleSaveTeacherAttendance = () => {
    if (!canControlTeacherAttendance) return;
    const recordsToSave: TeacherAttendanceRecord[] = teachers.map((tch) => ({
      id: `tatt-${tch.id}-${selectedDate}`,
      teacherId: tch.id,
      date: selectedDate,
      status: teacherStatusMap[tch.id]?.status || 'Present',
      remarks: teacherStatusMap[tch.id]?.remarks || undefined,
    }));

    saveTeacherAttendance(recordsToSave);
    setTeacherSaveSuccess(true);
    setTimeout(() => setTeacherSaveSuccess(false), 2500);
  };

  // Counts for Student
  const currentPresent = Object.values(studentStatusMap).filter((v) => v.status === 'Present').length;
  const currentAbsent = Object.values(studentStatusMap).filter((v) => v.status === 'Absent').length;
  const currentLate = Object.values(studentStatusMap).filter((v) => v.status === 'Late').length;
  const currentLeave = Object.values(studentStatusMap).filter((v) => v.status === 'Leave').length;

  // Counts for Teachers
  const teacherPresent = Object.values(teacherStatusMap).filter((v) => v.status === 'Present').length;
  const teacherAbsent = Object.values(teacherStatusMap).filter((v) => v.status === 'Absent').length;
  const teacherLate = Object.values(teacherStatusMap).filter((v) => v.status === 'Late').length;
  const teacherLeave = Object.values(teacherStatusMap).filter((v) => v.status === 'Leave').length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            {isParent ? "Child's Daily Attendance Register" : 'Daily Attendance Register'}
            {canControlStudentAttendance ? (
              <span className="flex items-center gap-1 text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                <ShieldCheck className="h-3 w-3" /> {isSuperOrAdmin ? 'Admin Controlled' : 'Class Incharge Authorized'}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 rounded-full">
                <Lock className="h-3 w-3" /> View Only Mode
              </span>
            )}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {isParent
              ? 'Official daily attendance record and teacher roll call remarks for your children'
              : 'Attendance governance exclusively controlled by Super Admin (Sir Imran), Academic Admin, and designated Class Incharge Teachers'}
          </p>
        </div>

        {/* Attendance Type Selector (Hidden for Parents) */}
        {!isParent && (
          <div className="flex items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-xs">
            <button
              onClick={() => setAttendanceType('student')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                attendanceType === 'student'
                  ? 'bg-white text-blue-600 font-bold shadow-xs dark:bg-neutral-900 dark:text-blue-400'
                  : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400'
              }`}
            >
              Student Roll Call
            </button>
            <button
              onClick={() => setAttendanceType('teacher')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                attendanceType === 'teacher'
                  ? 'bg-white text-blue-600 font-bold shadow-xs dark:bg-neutral-900 dark:text-blue-400'
                  : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400'
              }`}
            >
              Faculty & Teacher Attendance (Admissions & Academic Admin)
            </button>
          </div>
        )}
      </div>

      {/* RBAC Notice for users */}
      {!canControlStudentAttendance ? (
        <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200">
          <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Administrative Attendance Authorization Policy:</span>
            <p className="mt-0.5 text-amber-800 dark:text-amber-300">
              Only <strong>Super Admin (Sir Imran)</strong>, <strong>Academic Admin</strong>, and designated <strong>Class Incharge Teachers</strong> have the administrative authority to record, modify, or lock daily roll calls. As a {currentUser.role}, you can review the official records in read-only mode.
            </p>
          </div>
        </div>
      ) : isClassTeacherRole && (
        <div className="flex items-start gap-2.5 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-200">
          <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Class Incharge Credentials Active:</span> You are authorized by Sir Imran to mark and commit daily attendance for your assigned class.
          </div>
        </div>
      )}

      {attendanceType === 'student' ? (
        <>
          {/* Filter Bar */}
          <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Date:</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-900 font-mono dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>

                {!isParent && !isStudent && (
                  <>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Class:</label>
                      <select
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                        className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                      >
                        {attendanceClasses.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Section:</label>
                      <select
                        value={selectedSectionId}
                        onChange={(e) => setSelectedSectionId(e.target.value)}
                        className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                      >
                        {sections.map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Student Category:</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-semibold text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  >
                    <option value="all">All Categories</option>
                    <option value="Co-Education">Co-Education</option>
                    <option value="Male">Boys Wing (Male)</option>
                    <option value="Female">Girls Wing (Female)</option>
                  </select>
                </div>
              </div>

              {canControlStudentAttendance && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleMarkAllPresent}
                    className="flex items-center gap-1.5 rounded-lg border border-emerald-600 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 transition-colors cursor-pointer"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Mark All Present
                  </button>
                  <button
                    onClick={handleSaveAttendance}
                    className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs transition-colors cursor-pointer"
                  >
                    <Save className="h-3.5 w-3.5" />
                    Save Student Attendance
                  </button>
                </div>
              )}
            </div>

            {saveSuccessMsg && (
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 p-2 text-xs font-medium text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 animate-in fade-in">
                <CheckCircle2 className="h-4 w-4" />
                Student attendance for {selectedDate} saved successfully by Administrator!
              </div>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
              <span className="text-xs text-neutral-500 font-medium">Present</span>
              <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                {currentPresent} <span className="text-xs font-normal text-neutral-400">/ {classStudents.length}</span>
              </div>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
              <span className="text-xs text-neutral-500 font-medium">Absent</span>
              <div className="text-xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-1">
                {currentAbsent}
              </div>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
              <span className="text-xs text-neutral-500 font-medium">Late</span>
              <div className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">
                {currentLate}
              </div>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
              <span className="text-xs text-neutral-500 font-medium">Leave</span>
              <div className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">
                {currentLeave}
              </div>
            </div>
          </div>

          {/* Student Roll Call Table */}
          <div className="rounded-xl border border-neutral-200 bg-white shadow-xs overflow-hidden dark:border-neutral-800 dark:bg-neutral-900">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 dark:bg-neutral-800/60 dark:border-neutral-800 dark:text-neutral-300 font-semibold">
                  <tr>
                    <th className="py-3 px-4 w-16">Roll #</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Admission #</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {classStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-neutral-500">
                        No active students found in the selected class and section.
                      </td>
                    </tr>
                  ) : (
                    classStudents.map((stu) => {
                      const current = studentStatusMap[stu.id] || { status: 'Present', remarks: '' };

                      return (
                        <tr key={stu.id} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40">
                          <td className="py-3 px-4 font-mono font-bold text-neutral-800 dark:text-neutral-200">
                            {stu.rollNumber}
                          </td>
                          <td className="py-3 px-4 font-semibold text-neutral-900 dark:text-neutral-100">
                            {stu.firstName} {stu.middleName ? stu.middleName + ' ' : ''}{stu.lastName}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-sm bg-neutral-100 dark:bg-neutral-800 text-[10px] font-medium text-neutral-600 dark:text-neutral-300">
                              {stu.category || 'Co-Education'}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-neutral-500">
                            {stu.admissionNumber}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center gap-1 bg-neutral-100 dark:bg-neutral-800/80 p-0.5 rounded-lg max-w-xs mx-auto">
                              {(['Present', 'Absent', 'Late', 'Leave'] as AttendanceStatus[]).map((st) => {
                                const isSelected = current.status === st;
                                let colorClass = '';
                                if (st === 'Present') colorClass = 'bg-emerald-600 text-white font-bold shadow-xs';
                                if (st === 'Absent') colorClass = 'bg-rose-600 text-white font-bold shadow-xs';
                                if (st === 'Late') colorClass = 'bg-amber-500 text-white font-bold shadow-xs';
                                if (st === 'Leave') colorClass = 'bg-blue-600 text-white font-bold shadow-xs';

                                return (
                                  <button
                                    key={st}
                                    type="button"
                                    disabled={!canControlStudentAttendance}
                                    onClick={() => handleSetStudentStatus(stu.id, st)}
                                    className={`px-3 py-1 text-xs rounded-md transition-colors ${
                                      isSelected
                                        ? colorClass
                                        : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
                                    } ${canControlStudentAttendance ? 'cursor-pointer' : 'cursor-default opacity-85'}`}
                                  >
                                    {st}
                                  </button>
                                );
                              })}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="text"
                              disabled={!canControlAttendance}
                              placeholder="e.g. sick leave / excused"
                              value={current.remarks}
                              onChange={(e) => handleSetStudentRemarks(stu.id, e.target.value)}
                              className={`w-full max-w-xs rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 text-xs text-neutral-800 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 ${
                                !canControlAttendance ? 'bg-neutral-100 text-neutral-500 dark:bg-neutral-900 cursor-not-allowed' : ''
                              }`}
                            />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Teacher Attendance Register (Super Admin & Admin Master Control) */
        <div className="space-y-4">
          <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Roster Date:</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-900 font-mono dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
              </div>

              {canControlTeacherAttendance ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleMarkAllTeachersPresent}
                    className="flex items-center gap-1.5 rounded-lg border border-emerald-600 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 transition-colors cursor-pointer"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Mark All Faculty Present
                  </button>
                  <button
                    onClick={handleSaveTeacherAttendance}
                    className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs transition-colors cursor-pointer"
                  >
                    <Save className="h-3.5 w-3.5" />
                    Save Faculty Attendance
                  </button>
                </div>
              ) : (
                <div className="text-[11px] text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300">
                  Teacher roll call is officially managed by Admissions & Academic Admin.
                </div>
              )}
            </div>

            {teacherSaveSuccess && (
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 p-2 text-xs font-medium text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 animate-in fade-in">
                <CheckCircle2 className="h-4 w-4" />
                Faculty attendance roster for {selectedDate} saved and logged!
              </div>
            )}
          </div>

          {/* Quick Metrics for Teachers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
              <span className="text-xs text-neutral-500 font-medium">Teachers Present</span>
              <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                {teacherPresent} <span className="text-xs font-normal text-neutral-400">/ {teachers.length}</span>
              </div>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
              <span className="text-xs text-neutral-500 font-medium">Absent</span>
              <div className="text-xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-1">
                {teacherAbsent}
              </div>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
              <span className="text-xs text-neutral-500 font-medium">Late</span>
              <div className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">
                {teacherLate}
              </div>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
              <span className="text-xs text-neutral-500 font-medium">On Leave</span>
              <div className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">
                {teacherLeave}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:border-neutral-700">
                  <tr>
                    <th className="py-2.5 px-3">Emp ID</th>
                    <th className="py-2.5 px-3">Faculty Member</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {teachers.map((tch) => {
                    const current = teacherStatusMap[tch.id] || { status: 'Present', remarks: '' };

                    return (
                      <tr key={tch.id} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40">
                        <td className="py-2.5 px-3 font-mono font-medium text-neutral-700 dark:text-neutral-300">
                          {tch.employeeId}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-neutral-900 dark:text-neutral-100">
                          {tch.name}
                        </td>
                        <td className="py-2.5 px-3 text-neutral-500">{tch.department}</td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center justify-center gap-1 bg-neutral-100 dark:bg-neutral-800/80 p-0.5 rounded-lg max-w-xs mx-auto">
                            {(['Present', 'Absent', 'Late', 'Leave'] as AttendanceStatus[]).map((st) => {
                              const isSelected = current.status === st;
                              let colorClass = '';
                              if (st === 'Present') colorClass = 'bg-emerald-600 text-white font-bold shadow-xs';
                              if (st === 'Absent') colorClass = 'bg-rose-600 text-white font-bold shadow-xs';
                              if (st === 'Late') colorClass = 'bg-amber-500 text-white font-bold shadow-xs';
                              if (st === 'Leave') colorClass = 'bg-blue-600 text-white font-bold shadow-xs';

                              return (
                                <button
                                  key={st}
                                  type="button"
                                  disabled={!canControlAttendance}
                                  onClick={() => handleSetTeacherStatus(tch.id, st)}
                                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                                    isSelected
                                      ? colorClass
                                      : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
                                  } ${canControlAttendance ? 'cursor-pointer' : 'cursor-default opacity-85'}`}
                                >
                                  {st}
                                </button>
                              );
                            })}
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            disabled={!canControlAttendance}
                            placeholder="Optional remarks"
                            value={current.remarks}
                            onChange={(e) => handleSetTeacherRemarks(tch.id, e.target.value)}
                            className={`w-full max-w-xs rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 text-xs text-neutral-800 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 ${
                              !canControlAttendance ? 'bg-neutral-100 text-neutral-500 cursor-not-allowed' : ''
                            }`}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
