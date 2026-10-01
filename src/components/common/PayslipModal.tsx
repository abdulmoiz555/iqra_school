import React from 'react';
import { useApp } from '../../context/AppContext';
import { PayrollRecord } from '../../types';
import { X, Printer, FileText } from 'lucide-react';

interface PayslipModalProps {
  isOpen: boolean;
  onClose: () => void;
  payroll: PayrollRecord | null;
}

export const PayslipModal: React.FC<PayslipModalProps> = ({
  isOpen,
  onClose,
  payroll,
}) => {
  const { settings, teachers, staff } = useApp();

  if (!isOpen || !payroll) return null;

  const employee =
    payroll.employeeType === 'Teacher'
      ? teachers.find((t) => t.id === payroll.employeeId)
      : staff.find((s) => s.id === payroll.employeeId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Employee Official Salary Payslip
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" /> Print Payslip
            </button>
            <button onClick={onClose} className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Payslip Body */}
        <div className="p-8 overflow-y-auto max-h-[80vh]">
          <div className="rounded-xl border-2 border-neutral-800 bg-white p-6 text-neutral-900 shadow-sm relative font-sans overflow-hidden">
            {/* School Logo Watermark */}
            {settings.logoUrl && (
              <img
                src={settings.logoUrl}
                alt="Watermark"
                className="absolute inset-0 m-auto w-64 h-64 object-contain opacity-7 pointer-events-none select-none z-0"
              />
            )}

            <div className="relative z-10">
              {/* Header */}
            <div className="text-center border-b-2 border-neutral-800 pb-4">
              <h2 className="text-lg font-black uppercase tracking-tight text-neutral-900">
                {settings.schoolName}
              </h2>
              <p className="text-xs text-neutral-600 italic">
                {settings.schoolMotto}
              </p>
              <div className="mt-2 py-0.5 px-3 inline-block bg-neutral-900 text-white font-mono font-bold text-xs uppercase tracking-widest rounded-xs">
                Monthly Salary Payslip · {payroll.month} {payroll.year}
              </div>
            </div>

            {/* Employee info */}
            <div className="my-4 grid grid-cols-2 gap-4 rounded-lg border border-neutral-200 bg-neutral-50/70 p-3 text-xs font-mono">
              <div className="space-y-1">
                <div><span className="text-neutral-500 font-sans">Employee Name:</span> <strong className="font-sans text-neutral-900">{employee?.name}</strong></div>
                <div><span className="text-neutral-500 font-sans">Employee ID:</span> <strong>{employee?.employeeId}</strong></div>
                <div><span className="text-neutral-500 font-sans">Department:</span> <strong>{employee?.department}</strong></div>
              </div>
              <div className="space-y-1">
                <div><span className="text-neutral-500 font-sans">Designation:</span> <strong>{employee?.designation}</strong></div>
                <div><span className="text-neutral-500 font-sans">Payment Date:</span> <strong>{payroll.paymentDate}</strong></div>
                <div><span className="text-neutral-500 font-sans">Disbursed Via:</span> <strong>{payroll.paymentMethod}</strong></div>
              </div>
            </div>

            {/* Earnings & Deductions Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Earnings */}
              <div className="rounded-lg border border-neutral-200 overflow-hidden">
                <div className="bg-neutral-100 p-2 text-xs font-bold text-neutral-800 border-b border-neutral-200">
                  Earnings (+)
                </div>
                <div className="p-3 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-neutral-500 font-sans">Basic Salary:</span>
                    <span>{settings.currencySymbol}{payroll.basicSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500 font-sans">Allowances:</span>
                    <span>+{settings.currencySymbol}{payroll.allowances.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500 font-sans">Performance Bonus:</span>
                    <span>+{settings.currencySymbol}{payroll.bonus.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500 font-sans">Overtime:</span>
                    <span>+{settings.currencySymbol}{payroll.overtime.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div className="rounded-lg border border-neutral-200 overflow-hidden">
                <div className="bg-neutral-100 p-2 text-xs font-bold text-neutral-800 border-b border-neutral-200">
                  Deductions (-)
                </div>
                <div className="p-3 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-rose-600">
                    <span className="text-neutral-500 font-sans">Tax / Provident Fund:</span>
                    <span>-{settings.currencySymbol}{payroll.deductions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-rose-600">
                    <span className="text-neutral-500 font-sans">Loan Installment:</span>
                    <span>-{settings.currencySymbol}{payroll.loan.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-rose-600">
                    <span className="text-neutral-500 font-sans">Unexcused Absence Fine:</span>
                    <span>-{settings.currencySymbol}{payroll.fine.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Formula Summary Box */}
            <div className="rounded-lg border-2 border-neutral-800 bg-neutral-50 p-3 flex items-center justify-between font-mono">
              <span className="font-sans font-bold text-sm text-neutral-900">NET DISBURSED SALARY:</span>
              <span className="text-lg font-black text-emerald-700">
                {settings.currencySymbol}{payroll.netSalary.toLocaleString()}
              </span>
            </div>

            {/* Signatures */}
            <div className="mt-8 pt-4 border-t border-neutral-300 grid grid-cols-2 gap-8 text-center text-xs">
              <div>
                <div className="h-8 flex items-end justify-center font-serif italic">{employee?.name}</div>
                <div className="w-full h-0.5 bg-neutral-400 my-1" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  Employee Signature
                </span>
              </div>

              <div>
                <div className="h-8 flex items-end justify-center font-serif italic">Accounts & Bursar Office</div>
                <div className="w-full h-0.5 bg-neutral-400 my-1" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  Authorized Signatory
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};
