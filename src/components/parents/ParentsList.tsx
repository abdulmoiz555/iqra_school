import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Parent } from '../../types';
import { Search, Plus, Edit, Trash2, Users, Phone, Mail, MapPin, Briefcase, GraduationCap, X } from 'lucide-react';

export const ParentsList: React.FC = () => {
  const { parents, addParent, updateParent, deleteParent, students, classes, currentUser } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParent, setEditingParent] = useState<Parent | null>(null);

  const [formData, setFormData] = useState({
    fatherName: '',
    motherName: '',
    guardianName: '',
    cnic: '',
    phone: '',
    alternatePhone: '',
    email: '',
    occupation: '',
    address: '',
    city: 'Lahore',
    studentIds: [] as string[],
  });

  const filteredParents = parents.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.fatherName.toLowerCase().includes(q) ||
      p.motherName.toLowerCase().includes(q) ||
      p.cnic.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      p.occupation.toLowerCase().includes(q)
    );
  });

  const handleOpenAdd = () => {
    setEditingParent(null);
    setFormData({
      fatherName: '',
      motherName: '',
      guardianName: '',
      cnic: '',
      phone: '',
      alternatePhone: '',
      email: '',
      occupation: '',
      address: '',
      city: 'Lahore',
      studentIds: [],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Parent) => {
    setEditingParent(p);
    setFormData({
      fatherName: p.fatherName,
      motherName: p.motherName,
      guardianName: p.guardianName,
      cnic: p.cnic,
      phone: p.phone,
      alternatePhone: p.alternatePhone || '',
      email: p.email,
      occupation: p.occupation,
      address: p.address,
      city: p.city,
      studentIds: p.studentIds || [],
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fatherName.trim() || !formData.phone.trim()) return;

    if (editingParent) {
      updateParent(editingParent.id, formData);
    } else {
      addParent(formData);
    }
    setIsModalOpen(false);
  };

  const canManage = ['Super Admin', 'Admin', 'Receptionist'].includes(currentUser.role);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Parents & Guardians Directory
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Manage parent contact records and linked enrolled children
          </p>
        </div>

        {canManage && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Parent Record
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
            placeholder="Search father, mother, CNIC, phone, occupation..."
            className="w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-8 pr-3 py-1.5 text-xs text-neutral-900 focus:border-blue-500 focus:bg-white focus:outline-hidden dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
          />
        </div>
      </div>

      {/* Grid of Parents with Linked Children */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredParents.map((parent) => {
          // Find all students for this parent
          const linkedStudents = students.filter(
            (s) => s.parentId === parent.id || (parent.studentIds && parent.studentIds.includes(s.id))
          );

          return (
            <div
              key={parent.id}
              className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                        {parent.fatherName}
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Mother: {parent.motherName || 'N/A'} · <span className="font-medium text-neutral-700 dark:text-neutral-300">{parent.occupation}</span>
                      </p>
                    </div>
                  </div>

                  {canManage && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(parent)}
                        className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-blue-600 dark:hover:bg-neutral-800 cursor-pointer"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => deleteParent(parent.id)}
                        className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-rose-600 dark:hover:bg-neutral-800 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs border-t border-b border-neutral-100 dark:border-neutral-800 py-2.5">
                  <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400 font-mono">
                    <Phone className="h-3.5 w-3.5 text-neutral-400" />
                    <span>{parent.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400 font-mono">
                    <span className="text-neutral-400 font-bold">CNIC:</span>
                    <span>{parent.cnic}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400 col-span-2 truncate">
                    <MapPin className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                    <span>{parent.address}, {parent.city}</span>
                  </div>
                </div>

                {/* Linked Children Tree */}
                <div className="mt-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Enrolled Children ({linkedStudents.length})
                  </span>
                  <div className="mt-1.5 space-y-1.5">
                    {linkedStudents.length === 0 ? (
                      <p className="text-xs text-neutral-400 italic">No students linked to this parent record.</p>
                    ) : (
                      linkedStudents.map((child) => {
                        const childCls = classes.find((c) => c.id === child.classId);
                        return (
                          <div
                            key={child.id}
                            className="flex items-center justify-between rounded-lg bg-neutral-50 px-2.5 py-1.5 text-xs dark:bg-neutral-800/60"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-neutral-400">├──</span>
                              <GraduationCap className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                              <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                                {child.firstName} {child.lastName}
                              </span>
                            </div>
                            <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                              {childCls?.name} · Roll #{child.rollNumber}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Parent Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                {editingParent ? 'Edit Parent Profile' : 'Add New Parent / Guardian'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Father Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Mother Name
                  </label>
                  <input
                    type="text"
                    value={formData.motherName}
                    onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    CNIC *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="35202-0000000-0"
                    value={formData.cnic}
                    onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Occupation
                  </label>
                  <input
                    type="text"
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Mobile Phone *
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

              <div className="mt-5 flex items-center justify-end gap-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
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
                  {editingParent ? 'Save Changes' : 'Create Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
