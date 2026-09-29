import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import {
  Search,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
  CreditCard,
  GraduationCap,
  Download,
  Printer,
  ChevronDown,
  UserCheck,
  CheckCircle2,
  XCircle,
  FileText,
  BadgeAlert
} from 'lucide-react';

interface StudentsListProps {
  onAddStudent: () => void;
  onEditStudent: (student: Student) => void;
  onViewStudent: (student: Student) => void;
  onGenerateIdCard: (student: Student) => void;
  onOpenPromotion: () => void;
}

export const StudentsList: React.FC<StudentsListProps> = ({
  onAddStudent,
  onEditStudent,
  onViewStudent,
  onGenerateIdCard,
  onOpenPromotion,
}) => {
  const {
    students,
    deleteStudent,
    classes,
    sections,
    parents,
    currentUser,
    globalSearch,
    setGlobalSearch,
  } = useApp();

  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [localSearch, setLocalSearch] = useState<string>('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filter students
  const filteredStudents = useMemo(() => {
    const q = (localSearch || globalSearch).toLowerCase().trim();
    return students.filter((stu) => {
      // Role filtering: Student sees only themselves; Parent sees only their children
      if (currentUser.role === 'Student' && currentUser.linkedId) {
        if (stu.id !== currentUser.linkedId) return false;
      }
      if (currentUser.role === 'Parent' && currentUser.linkedId) {
        const parent = parents.find((p) => p.id === currentUser.linkedId);
        if (parent && !parent.studentIds.includes(stu.id)) return false;
      }

      if (selectedClass !== 'all' && stu.classId !== selectedClass) return false;
      if (selectedSection !== 'all' && stu.sectionId !== selectedSection) return false;
      if (selectedCategory !== 'all') {
        const cat = stu.category || 'Co-Education';
        if (cat !== selectedCategory) return false;
      }
      if (selectedStatus !== 'all' && stu.status !== selectedStatus) return false;

      if (q) {
        const fullName = `${stu.firstName} ${stu.middleName || ''} ${stu.lastName}`.toLowerCase();
        const adm = stu.admissionNumber.toLowerCase();
        const roll = stu.rollNumber.toLowerCase();
        const cnic = stu.bFormCnic.toLowerCase();
        return (
          fullName.includes(q) ||
          adm.includes(q) ||
          roll.includes(q) ||
          cnic.includes(q)
        );
      }
      return true;
    });
  }, [students, localSearch, globalSearch, selectedClass, selectedSection, selectedStatus, currentUser, parents]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Admission No', 'Roll No', 'Name', 'Class', 'Section', 'Gender', 'Phone', 'Guardian', 'Status'];
    const rows = filteredStudents.map((s) => {
      const cls = classes.find((c) => c.id === s.classId)?.name || '';
      const sec = sections.find((sec) => sec.id === s.sectionId)?.name || '';
      const par = parents.find((p) => p.id === s.parentId)?.fatherName || '';
      return [
        s.admissionNumber,
        s.rollNumber,
        `"${s.firstName} ${s.lastName}"`,
        `"${cls}"`,
        `"${sec}"`,
        s.gender,
        s.phone,
        `"${par}"`,
        s.status,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `students_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: Student['status']) => {
    switch (status) {
      case 'Active':
        return <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 px-2 py-0.5 rounded-sm"><CheckCircle2 className="h-3 w-3" /> Active</span>;
      case 'Inactive':
        return <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-600 bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-400 px-2 py-0.5 rounded-sm">Inactive</span>;
      case 'Graduated':
        return <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-300 px-2 py-0.5 rounded-sm">Graduated</span>;
      case 'Left School':
        return <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 px-2 py-0.5 rounded-sm">Left School</span>;
      case 'Suspended':
        return <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300 px-2 py-0.5 rounded-sm"><BadgeAlert className="h-3 w-3" /> Suspended</span>;
    }
  };

  const canManage = ['Super Admin', 'Admin', 'Receptionist'].includes(currentUser.role);

  return (
    <div className="space-y-4">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Student Enrolment Directory
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Manage student admissions, academic profiles, ID cards and class promotions
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>

          {canManage && (
            <>
              <button
                onClick={onOpenPromotion}
                className="flex items-center gap-1.5 rounded-lg border border-blue-600 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-950/40 dark:text-blue-300 transition-colors cursor-pointer"
              >
                <GraduationCap className="h-3.5 w-3.5" />
                Student Promotion
              </button>
              <button
                onClick={onAddStudent}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Add New Student
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-neutral-200 bg-white p-3 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search name, admission #, B-Form..."
              className="w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-8 pr-3 py-1.5 text-xs text-neutral-900 focus:border-blue-500 focus:bg-white focus:outline-hidden dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            />
          </div>

          {/* Category Stream Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-900 font-semibold focus:border-blue-500 focus:bg-white focus:outline-hidden dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            >
              <option value="all">All Categories</option>
              <option value="Co-Education">Co-Education</option>
              <option value="Male">Boys Wing (Male)</option>
              <option value="Female">Girls Wing (Female)</option>
            </select>
          </div>

          {/* Class Filter */}
          <div>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-900 focus:border-blue-500 focus:bg-white focus:outline-hidden dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            >
              <option value="all">All Classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Section Filter */}
          <div>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-900 focus:border-blue-500 focus:bg-white focus:outline-hidden dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            >
              <option value="all">All Sections</option>
              {sections.map((sec) => (
                <option key={sec.id} value={sec.id}>{sec.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-900 focus:border-blue-500 focus:bg-white focus:outline-hidden dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Graduated">Graduated</option>
              <option value="Left School">Left School</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
          <span>Showing <strong className="font-mono text-neutral-800 dark:text-neutral-200">{filteredStudents.length}</strong> of {students.length} students</span>
          {(selectedClass !== 'all' || selectedSection !== 'all' || selectedStatus !== 'all' || localSearch) && (
            <button
              onClick={() => {
                setSelectedClass('all');
                setSelectedSection('all');
                setSelectedStatus('all');
                setLocalSearch('');
                setGlobalSearch('');
              }}
              className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Students Data Table */}
      <div className="rounded-xl border border-neutral-200 bg-white shadow-xs overflow-hidden dark:border-neutral-800 dark:bg-neutral-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 dark:bg-neutral-800/60 dark:border-neutral-800 dark:text-neutral-300 font-semibold">
              <tr>
                <th className="py-3 px-4">Adm #</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Class & Sec</th>
                <th className="py-3 px-4">Roll #</th>
                <th className="py-3 px-4">Concessions & Sibling</th>
                <th className="py-3 px-4">Father / Guardian</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-neutral-400 dark:text-neutral-500">
                    No student records found matching the search criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((stu) => {
                  const cls = classes.find((c) => c.id === stu.classId);
                  const sec = sections.find((s) => s.id === stu.sectionId);
                  const parent = parents.find((p) => p.id === stu.parentId);

                  // Category styling
                  const cat = stu.category || 'Co-Education';
                  let catBadge = 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800';
                  if (cat === 'Male') catBadge = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800';
                  if (cat === 'Female') catBadge = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';

                  return (
                    <tr
                      key={stu.id}
                      className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-medium text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
                        {stu.admissionNumber}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          {stu.photoUrl ? (
                            <img
                              src={stu.photoUrl}
                              alt={stu.firstName}
                              className="h-8 w-8 rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
                            />
                          ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-xs">
                              {stu.firstName.charAt(0)}{stu.lastName.charAt(0)}
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                              {stu.firstName} {stu.middleName ? stu.middleName + ' ' : ''}{stu.lastName}
                            </div>
                            <div className="text-[11px] text-neutral-400 font-mono">
                              DOB: {stu.dateOfBirth} · {stu.gender}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${catBadge}`}>
                          {cat}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-neutral-700 dark:text-neutral-300">
                        <span className="font-medium">{cls?.name || 'Class N/A'}</span>
                        <span className="text-neutral-400 ml-1">({sec?.name || 'Sec A'})</span>
                      </td>

                      <td className="py-3 px-4 font-mono tabular-nums text-neutral-700 dark:text-neutral-300">
                        {stu.rollNumber}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        {stu.siblingDiscountPercent && stu.siblingDiscountPercent > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 text-[10px] font-bold">
                            👨‍👧 {stu.siblingDiscountPercent}% Sibling Off
                          </span>
                        ) : stu.scholarshipName && stu.scholarshipName !== 'None' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 text-[10px] font-bold">
                            🎓 {stu.scholarshipName}
                          </span>
                        ) : (
                          <span className="text-[10px] text-neutral-400 font-mono">
                            Standard
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-neutral-700 dark:text-neutral-300">
                        <div>{parent?.fatherName || parent?.guardianName || 'N/A'}</div>
                        <div className="text-[10px] text-neutral-400 font-mono">{parent?.phone || stu.phone}</div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        {getStatusBadge(stu.status)}
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Profile */}
                          <button
                            onClick={() => onViewStudent(stu)}
                            title="View Complete Profile & Ledger"
                            className="rounded-md p-1.5 text-neutral-600 hover:bg-neutral-100 hover:text-blue-600 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-blue-400 cursor-pointer"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {/* ID Card */}
                          <button
                            onClick={() => onGenerateIdCard(stu)}
                            title="Generate Student ID Card"
                            className="rounded-md p-1.5 text-neutral-600 hover:bg-neutral-100 hover:text-emerald-600 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-emerald-400 cursor-pointer"
                          >
                            <CreditCard className="h-4 w-4" />
                          </button>

                          {/* Edit */}
                          {canManage && (
                            <button
                              onClick={() => onEditStudent(stu)}
                              title="Edit Student Information"
                              className="rounded-md p-1.5 text-neutral-600 hover:bg-neutral-100 hover:text-amber-600 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-amber-400 cursor-pointer"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          )}

                          {/* Delete */}
                          {canManage && (
                            <button
                              onClick={() => setDeleteConfirmId(stu.id)}
                              title="Delete Record"
                              className="rounded-md p-1.5 text-neutral-600 hover:bg-neutral-100 hover:text-rose-600 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-rose-400 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4">
          <div className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-5 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Confirm Student Deletion
            </h3>
            <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Are you sure you want to delete this student record? Historical fee receipts and exam entries will be archived for audit safety.
            </p>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteStudent(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 cursor-pointer shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
