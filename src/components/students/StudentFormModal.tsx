import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { X, Save, User, Calendar, Phone, Mail, MapPin, Building, ShieldCheck } from 'lucide-react';

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentToEdit?: Student | null;
}

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  isOpen,
  onClose,
  studentToEdit,
}) => {
  const { classes, sections, parents, addStudent, updateStudent, students } = useApp();

  const [formData, setFormData] = useState({
    admissionNumber: '',
    rollNumber: '',
    firstName: '',
    middleName: '',
    lastName: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    dateOfBirth: '',
    bFormCnic: '',
    bloodGroup: 'B+',
    religion: 'Islam',
    phone: '',
    email: '',
    address: '',
    city: 'Lahore',
    province: 'Punjab',
    admissionDate: new Date().toISOString().slice(0, 10),
    classId: classes[0]?.id || '',
    sectionId: sections[0]?.id || '',
    previousSchool: '',
    parentId: parents[0]?.id || '',
    emergencyContact: '',
    photoUrl: '',
    status: 'Active' as Student['status'],
    category: 'Co-Education' as 'Co-Education' | 'Male' | 'Female',
    siblingDiscountPercent: 0,
    scholarshipName: 'None',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (studentToEdit) {
      setFormData({
        admissionNumber: studentToEdit.admissionNumber,
        rollNumber: studentToEdit.rollNumber,
        firstName: studentToEdit.firstName,
        middleName: studentToEdit.middleName || '',
        lastName: studentToEdit.lastName,
        gender: studentToEdit.gender,
        dateOfBirth: studentToEdit.dateOfBirth,
        bFormCnic: studentToEdit.bFormCnic,
        bloodGroup: studentToEdit.bloodGroup,
        religion: studentToEdit.religion,
        phone: studentToEdit.phone,
        email: studentToEdit.email,
        address: studentToEdit.address,
        city: studentToEdit.city,
        province: studentToEdit.province,
        admissionDate: studentToEdit.admissionDate,
        classId: studentToEdit.classId,
        sectionId: studentToEdit.sectionId,
        previousSchool: studentToEdit.previousSchool || '',
        parentId: studentToEdit.parentId,
        emergencyContact: studentToEdit.emergencyContact,
        photoUrl: studentToEdit.photoUrl || '',
        status: studentToEdit.status,
        category: studentToEdit.category || 'Co-Education',
        siblingDiscountPercent: studentToEdit.siblingDiscountPercent || 0,
        scholarshipName: studentToEdit.scholarshipName || 'None',
      });
    } else {
      const nextAdm = `ADM-2026-${String(students.length + 1).padStart(3, '0')}`;
      const nextRoll = `${100 + students.length + 1}`;
      setFormData((prev) => ({
        ...prev,
        admissionNumber: nextAdm,
        rollNumber: nextRoll,
        classId: classes[0]?.id || '',
        sectionId: sections[0]?.id || '',
        parentId: parents[0]?.id || '',
        category: 'Co-Education',
        siblingDiscountPercent: 0,
        scholarshipName: 'None',
      }));
    }
    setErrors({});
  }, [studentToEdit, isOpen, classes, sections, parents, students.length]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.admissionNumber.trim()) newErrors.admissionNumber = 'Admission number is required';
    if (!formData.rollNumber.trim()) newErrors.rollNumber = 'Roll number is required';
    if (!formData.phone.trim()) newErrors.phone = 'Contact phone is required';
    if (!formData.bFormCnic.trim()) newErrors.bFormCnic = 'B-Form / CNIC is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (studentToEdit) {
      updateStudent(studentToEdit.id, formData);
    } else {
      addStudent(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4 overflow-y-auto">
      <div className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              {studentToEdit ? 'Edit Student Information' : 'New Student Admission & Enrolment'}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Enter academic, biographical and guardian contact details
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section: Academic Admission Identifiers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-1.5">
              <Building className="h-4 w-4" /> Academic Enrolment Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Admission No *
                </label>
                <input
                  type="text"
                  value={formData.admissionNumber}
                  onChange={(e) => setFormData({ ...formData, admissionNumber: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-900 font-mono dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                />
                {errors.admissionNumber && <p className="text-[10px] text-rose-500 mt-0.5">{errors.admissionNumber}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Roll No *
                </label>
                <input
                  type="text"
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-900 font-mono dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                />
                {errors.rollNumber && <p className="text-[10px] text-rose-500 mt-0.5">{errors.rollNumber}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Class
                </label>
                <select
                  value={formData.classId}
                  onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Section
                </label>
                <select
                  value={formData.sectionId}
                  onChange={(e) => setFormData({ ...formData, sectionId: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                >
                  {sections.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section: Biographical Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-1.5">
              <User className="h-4 w-4" /> Personal & Biographical Data
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                />
                {errors.firstName && <p className="text-[10px] text-rose-500 mt-0.5">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Middle Name
                </label>
                <input
                  type="text"
                  value={formData.middleName}
                  onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                />
                {errors.lastName && <p className="text-[10px] text-rose-500 mt-0.5">{errors.lastName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Student Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-semibold text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                >
                  <option value="Co-Education">Co-Education</option>
                  <option value="Male">Male (Boys Campus)</option>
                  <option value="Female">Female (Girls Campus)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-900 font-mono dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                />
                {errors.dateOfBirth && <p className="text-[10px] text-rose-500 mt-0.5">{errors.dateOfBirth}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  B-Form / CNIC *
                </label>
                <input
                  type="text"
                  placeholder="35202-0000000-0"
                  value={formData.bFormCnic}
                  onChange={(e) => setFormData({ ...formData, bFormCnic: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-900 font-mono dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                />
                {errors.bFormCnic && <p className="text-[10px] text-rose-500 mt-0.5">{errors.bFormCnic}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Blood Group
                </label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-900 font-mono dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Parent & Contact Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-1.5">
              <Phone className="h-4 w-4" /> Parent / Guardian & Contacts
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Associated Parent / Guardian
                </label>
                <select
                  value={formData.parentId}
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                >
                  {parents.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fatherName} ({p.occupation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Student Phone *
                </label>
                <input
                  type="text"
                  placeholder="+92 300 0000000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-900 font-mono dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                />
                {errors.phone && <p className="text-[10px] text-rose-500 mt-0.5">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Emergency Phone
                </label>
                <input
                  type="text"
                  placeholder="+92 321 0000000"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-900 font-mono dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Student Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-900 font-mono dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Residential Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>
            </div>
          </div>

          {/* Section: Status & Extra info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-neutral-100 dark:border-neutral-800 pt-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Enrolment Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Graduated">Graduated</option>
                <option value="Left School">Left School</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Previous School
              </label>
              <input
                type="text"
                placeholder="e.g. Beaconhouse / Army Public School"
                value={formData.previousSchool}
                onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Admission Date
              </label>
              <input
                type="date"
                value={formData.admissionDate}
                onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-900 font-mono dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              />
            </div>
          </div>

          {/* Section: Sibling Concession & Scholarships */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 dark:border-blue-900/50 dark:bg-blue-950/20 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300 flex items-center justify-between">
              <span>👨‍👩‍👧 Fee Concession, Sibling Discount & Scholarships</span>
              <span className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded-full font-medium">
                Automated Policy
              </span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Sibling Concession Tier
                </label>
                <select
                  value={formData.siblingDiscountPercent}
                  onChange={(e) => setFormData({ ...formData, siblingDiscountPercent: Number(e.target.value) })}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                >
                  <option value={0}>1st Child (Elder) — 0% Normal Fee</option>
                  <option value={25}>2nd Sibling — 25% Tuition Fee Discount</option>
                  <option value={50}>3rd+ Sibling — 50% Tuition Fee Discount</option>
                </select>
                <p className="text-[10px] text-neutral-500 mt-1">
                  Enrolled brothers/sisters in the school receive automatic fee reductions.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Institutional Scholarship Scheme
                </label>
                <select
                  value={formData.scholarshipName}
                  onChange={(e) => setFormData({ ...formData, scholarshipName: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 font-medium"
                >
                  <option value="None">None (Standard Tuition)</option>
                  <option value="Top Merit Scholarship">Top Merit Scholarship (100% Free Tuition)</option>
                  <option value="Merit Scholarship (50%)">Merit Academic Grant (50% Concession)</option>
                  <option value="Hafiz-e-Quran Concession">Hafiz-e-Quran (50% Concession)</option>
                  <option value="Teacher / Staff Child">Teacher / Staff Child (100% Waiver)</option>
                  <option value="Need-Based Financial Relief">Need-Based Financial Relief (30%)</option>
                  <option value="Orphan / Kinship Full Relief">Orphan / Kinship Relief (100%)</option>
                </select>
                <p className="text-[10px] text-neutral-500 mt-1">
                  Approved institutional concession applied directly on monthly challan.
                </p>
              </div>
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-neutral-200 px-6 py-3.5 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs cursor-pointer"
          >
            <Save className="h-4 w-4" />
            {studentToEdit ? 'Save Changes' : 'Complete Admission'}
          </button>
        </div>
      </div>
    </div>
  );
};
