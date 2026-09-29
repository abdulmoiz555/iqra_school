import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Teacher } from '../../types';
import { Search, Plus, Edit, Trash2, UserCheck, Phone, Mail, Award, BookOpen, Calendar, X, Save, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const TeachersList: React.FC = () => {
  const { teachers, addTeacher, updateTeacher, deleteTeacher, classes, subjects, currentUser, settings } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    gender: 'Male' as Teacher['gender'],
    dateOfBirth: '1988-01-01',
    cnic: '',
    phone: '',
    email: '',
    address: '',
    qualification: '',
    experience: '',
    joiningDate: new Date().toISOString().slice(0, 10),
    department: 'Mathematics & Physical Sciences',
    designation: 'Senior Master',
    salary: 85000,
    status: 'Active' as Teacher['status'],
    assignedClasses: [] as string[],
    assignedSubjects: [] as string[],
    isClassTeacher: false,
    assignedClassId: '',
    canMarkAttendance: false,
  });

  const filteredTeachers = teachers.filter((t) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      t.name.toLowerCase().includes(q) ||
      t.employeeId.toLowerCase().includes(q) ||
      t.department.toLowerCase().includes(q) ||
      t.designation.toLowerCase().includes(q)
    );
  });

  const handleOpenAdd = () => {
    setEditingTeacher(null);
    setFormData({
      employeeId: `EMP-TCH-${String(teachers.length + 1).padStart(3, '0')}`,
      name: '',
      gender: 'Male',
      dateOfBirth: '1988-01-01',
      cnic: '',
      phone: '',
      email: '',
      address: '',
      qualification: '',
      experience: '',
      joiningDate: new Date().toISOString().slice(0, 10),
      department: 'Mathematics & Physical Sciences',
      designation: 'Senior Master',
      salary: 85000,
      status: 'Active',
      assignedClasses: [classes[0]?.id || ''],
      assignedSubjects: [subjects[0]?.id || ''],
      isClassTeacher: false,
      assignedClassId: classes[0]?.id || '',
      canMarkAttendance: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tch: Teacher) => {
    setEditingTeacher(tch);
    setFormData({
      employeeId: tch.employeeId,
      name: tch.name,
      gender: tch.gender,
      dateOfBirth: tch.dateOfBirth,
      cnic: tch.cnic,
      phone: tch.phone,
      email: tch.email,
      address: tch.address,
      qualification: tch.qualification,
      experience: tch.experience,
      joiningDate: tch.joiningDate,
      department: tch.department,
      designation: tch.designation,
      salary: tch.salary,
      status: tch.status,
      assignedClasses: tch.assignedClasses || [],
      assignedSubjects: tch.assignedSubjects || [],
      isClassTeacher: Boolean(tch.isClassTeacher),
      assignedClassId: tch.assignedClassId || classes[0]?.id || '',
      canMarkAttendance: Boolean(tch.canMarkAttendance),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;

    if (editingTeacher) {
      updateTeacher(editingTeacher.id, formData);
    } else {
      addTeacher(formData);
    }
    setIsModalOpen(false);
  };

  const canManage = ['Super Admin', 'Admin'].includes(currentUser.role);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Teaching Faculty Directory
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Faculty credentials, assigned grades, subject loads and salaries
          </p>
        </div>

        {canManage && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Recruit New Teacher
          </button>
        )}
      </div>

      {/* Search */}
      <div className="rounded-xl border border-neutral-200 bg-white p-3 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search faculty by name, employee ID, department..."
            className="w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-8 pr-3 py-1.5 text-xs text-neutral-900 focus:border-blue-500 focus:bg-white focus:outline-hidden dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
          />
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.map((teacher) => {
          const assignedClassNames = (teacher.assignedClasses || [])
            .map((cid) => classes.find((c) => c.id === cid)?.name)
            .filter(Boolean);

          const assignedSubNames = (teacher.assignedSubjects || [])
            .map((sid) => subjects.find((s) => s.id === sid)?.name)
            .filter(Boolean);

          return (
            <div
              key={teacher.id}
              className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700 font-bold text-sm dark:bg-amber-950/60 dark:text-amber-300">
                      {teacher.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 leading-tight">
                        {teacher.name}
                      </h3>
                      <p className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                        {teacher.employeeId} · <span className="text-blue-600 dark:text-blue-400 font-medium">{teacher.designation}</span>
                      </p>
                    </div>
                  </div>

                  {canManage && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(teacher)}
                        className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-blue-600 dark:hover:bg-neutral-800 cursor-pointer"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => deleteTeacher(teacher.id)}
                        className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-rose-600 dark:hover:bg-neutral-800 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-3 space-y-1.5 text-xs border-t border-neutral-100 dark:border-neutral-800 pt-2.5">
                  <div className="text-[11px] text-neutral-600 dark:text-neutral-400">
                    <strong className="text-neutral-800 dark:text-neutral-200">Dept:</strong> {teacher.department}
                  </div>
                  <div className="text-[11px] text-neutral-600 dark:text-neutral-400">
                    <strong className="text-neutral-800 dark:text-neutral-200">Degree:</strong> {teacher.qualification}
                  </div>
                  <div className="text-[11px] text-neutral-600 dark:text-neutral-400 font-mono">
                    <strong className="text-neutral-800 dark:text-neutral-200">Phone:</strong> {teacher.phone}
                  </div>
                  <div className="text-[11px] text-neutral-600 dark:text-neutral-400 font-mono">
                    <strong className="text-neutral-800 dark:text-neutral-200">Salary:</strong> {settings.currencySymbol}{teacher.salary.toLocaleString()}/mo
                  </div>
                </div>

                {/* Assigned subjects & classes */}
                <div className="mt-3 border-t border-neutral-100 dark:border-neutral-800 pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Assigned Teaching Load
                  </span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {assignedSubNames.length === 0 ? (
                      <span className="text-[11px] text-neutral-400 italic">No subject assigned</span>
                    ) : (
                      assignedSubNames.map((s, idx) => (
                        <span key={idx} className="text-[10px] bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 px-1.5 py-0.5 rounded-sm font-medium">
                          {s}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Class Teacher & Attendance Rights Badge */}
                <div className="mt-2.5">
                  {teacher.isClassTeacher && teacher.canMarkAttendance ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                      <CheckCircle2 className="h-3 w-3" /> Class Incharge (Attendance Granted)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] text-neutral-500 bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-400">
                      Subject Faculty (No Attendance Access)
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800 pt-2 text-[11px]">
                <span className="font-mono text-neutral-400">Joined: {teacher.joiningDate}</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  ● {teacher.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4 overflow-y-auto">
          <div className="w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                {editingTeacher ? 'Update Teacher Record' : 'Recruit New Faculty Member'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-3 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Employee ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Phone *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Academic Qualification
                  </label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Monthly Basic Salary ({settings.currency})
                  </label>
                  <input
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Residential Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>

              {/* Attendance & Class Incharge Permissions Section */}
              <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-3.5 dark:border-blue-900/60 dark:bg-blue-950/20 space-y-3">
                <div>
                  <h4 className="font-bold text-blue-900 dark:text-blue-200 text-xs flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                    Class Incharge & Attendance Access Authorization
                  </h4>
                  <p className="text-[10px] text-blue-700/80 dark:text-blue-300 mt-0.5">
                    Attendance marking is strictly granted by Super Admin (Sir Imran) and Academic Admin only to designated Class Teachers.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <label className="flex items-start gap-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isClassTeacher}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFormData({
                          ...formData,
                          isClassTeacher: checked,
                          canMarkAttendance: checked,
                        });
                      }}
                      className="mt-0.5 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span>Designate as Class Teacher Incharge</span>
                      <p className="text-[10px] text-neutral-500 font-normal">Assigns primary leadership of a class</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.canMarkAttendance}
                      disabled={!formData.isClassTeacher}
                      onChange={(e) => setFormData({ ...formData, canMarkAttendance: e.target.checked })}
                      className="mt-0.5 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <span>Grant Daily Attendance Permission</span>
                      <p className="text-[10px] text-neutral-500 font-normal">Allows teacher to mark and save student roll calls</p>
                    </div>
                  </label>
                </div>

                {formData.isClassTeacher && (
                  <div className="pt-2 border-t border-blue-200/60 dark:border-blue-900/40">
                    <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Assigned Class for Daily Attendance Register:
                    </label>
                    <select
                      value={formData.assignedClassId}
                      onChange={(e) => setFormData({ ...formData, assignedClassId: e.target.value })}
                      className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-900 font-semibold dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                    >
                      <option value="">Select Incharge Class</option>
                      {classes.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-neutral-300 bg-white px-3.5 py-1.5 font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-1.5 font-semibold text-white hover:bg-blue-700 shadow-xs cursor-pointer"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
