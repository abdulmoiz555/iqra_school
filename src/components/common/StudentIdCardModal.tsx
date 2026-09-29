import React from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { X, Printer, QrCode } from 'lucide-react';

interface StudentIdCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
}

export const StudentIdCardModal: React.FC<StudentIdCardModalProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  const { settings, classes, sections, parents } = useApp();

  if (!isOpen || !student) return null;

  const cls = classes.find((c) => c.id === student.classId);
  const sec = sections.find((s) => s.id === student.sectionId);
  const parent = parents.find((p) => p.id === student.parentId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Student Official Identification Card
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Dual-sided printable badge with security barcode & emergency contacts
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              Print Both Sides
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content: Front & Back ID Card Render */}
        <div className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 print:m-0">
            {/* FRONT OF CARD */}
            <div className="w-72 h-[410px] rounded-2xl border-2 border-neutral-300 bg-linear-to-b from-blue-900 via-blue-800 to-indigo-950 p-4 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
              {/* Subtle Crest Watermark Background */}
              <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
                <img src={settings.logoUrl} alt="" className="w-48 h-48 object-contain" />
              </div>

              {/* Card Header */}
              <div className="text-center relative z-10">
                <div className="flex items-center justify-center gap-2 mb-1">
                  {settings.logoUrl && (
                    <img
                      src={settings.logoUrl}
                      alt="Crest"
                      className="h-9 w-9 rounded-full bg-white p-0.5 object-cover"
                    />
                  )}
                  <div className="text-left leading-tight">
                    <div className="text-[11px] font-black tracking-wider uppercase text-blue-200">
                      {settings.schoolName || 'IQRA Education System'}
                    </div>
                    <div className="text-[8px] text-blue-300 font-medium">
                      Student Identity Card · {settings.activeSession}
                    </div>
                  </div>
                </div>
                <div className="h-0.5 w-full bg-linear-to-r from-transparent via-amber-400 to-transparent my-1" />
              </div>

              {/* Photo & Name */}
              <div className="text-center relative z-10 my-auto">
                <div className="mx-auto h-24 w-24 rounded-xl border-2 border-amber-400 overflow-hidden bg-neutral-100 shadow-md">
                  {student.photoUrl ? (
                    <img src={student.photoUrl} alt={student.firstName} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-blue-600 text-white font-bold text-xl">
                      {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                    </div>
                  )}
                </div>

                <h4 className="mt-2 text-sm font-black text-white tracking-wide">
                  {student.firstName} {student.middleName ? student.middleName + ' ' : ''}{student.lastName}
                </h4>
                <p className="text-[10px] font-mono text-amber-300 font-bold uppercase tracking-widest">
                  Student
                </p>

                {/* Details Table */}
                <div className="mt-2 text-left bg-black/30 rounded-lg p-2 text-[10px] space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span className="text-blue-200">Admission No:</span>
                    <span className="font-bold text-white">{student.admissionNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Class & Sec:</span>
                    <span className="font-bold text-white">{cls?.name} ({sec?.name})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Roll Number:</span>
                    <span className="font-bold text-white">{student.rollNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Blood Group:</span>
                    <span className="font-bold text-rose-300">{student.bloodGroup}</span>
                  </div>
                </div>
              </div>

              {/* Card Front Footer with Barcode Strip */}
              <div className="text-center relative z-10 border-t border-blue-400/40 pt-1">
                {/* Simulated Barcode */}
                <div className="flex justify-center items-center gap-[2px] h-6 px-4 bg-white/90 rounded-xs mx-auto max-w-[200px]">
                  {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 2, 3, 2, 4].map((w, idx) => (
                    <div key={idx} style={{ width: `${w}px` }} className="h-4 bg-black" />
                  ))}
                </div>
                <div className="text-[8px] font-mono tracking-widest text-blue-200 mt-0.5">
                  ID: {student.admissionNumber}
                </div>
              </div>
            </div>

            {/* BACK OF CARD */}
            <div className="w-72 h-[410px] rounded-2xl border-2 border-neutral-300 bg-white p-4 text-neutral-800 shadow-xl flex flex-col justify-between dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200">
              <div>
                <div className="text-center border-b border-neutral-200 dark:border-neutral-800 pb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Emergency & Institutional Information
                  </span>
                </div>

                <div className="mt-3 space-y-2 text-[10px]">
                  <div>
                    <span className="text-neutral-400">Father / Guardian:</span>
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {parent?.fatherName || parent?.guardianName || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="text-neutral-400">Guardian CNIC:</span>
                    <p className="font-mono text-neutral-900 dark:text-neutral-100">{parent?.cnic || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-neutral-400">Emergency Phone:</span>
                    <p className="font-mono font-bold text-rose-600 dark:text-rose-400">
                      {student.emergencyContact || student.phone}
                    </p>
                  </div>
                  <div>
                    <span className="text-neutral-400">Residential Address:</span>
                    <p className="text-neutral-700 dark:text-neutral-300 leading-tight">
                      {student.address}, {student.city}
                    </p>
                  </div>
                </div>

                <div className="mt-3 p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-[9px] text-neutral-500 leading-tight border border-neutral-100 dark:border-neutral-700">
                  <p>1. This card is non-transferable and remains property of the Academy.</p>
                  <p className="mt-0.5">2. In case of loss, immediately notify the Administration Office.</p>
                  <p className="mt-0.5">3. If found, please return to: {settings.address}, {settings.city}.</p>
                </div>
              </div>

              {/* Bottom Authority Signature & QR Code */}
              <div className="border-t border-neutral-200 dark:border-neutral-800 pt-2 flex items-center justify-between">
                <div className="text-center">
                  <div className="h-6 flex items-end justify-center font-serif text-[11px] italic text-neutral-800 dark:text-neutral-200">
                    Dr. Shahzad Tariq
                  </div>
                  <div className="h-0.5 w-24 bg-neutral-400 my-0.5" />
                  <span className="text-[8px] font-bold uppercase tracking-wider text-neutral-500">
                    Principal Signature
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="p-1 bg-white border border-neutral-200 rounded-sm">
                    <QrCode className="h-8 w-8 text-neutral-900" />
                  </div>
                  <span className="text-[7px] font-mono text-neutral-400 mt-0.5">SCAN VERIFY</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-200 px-6 py-3 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 text-center text-xs text-neutral-500">
          Standard PVC CR80 badge dimensions (85.6mm × 53.98mm) format ready for high-resolution card printers.
        </div>
      </div>
    </div>
  );
};
