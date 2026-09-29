import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Student, FeePayment } from '../../types';
import { X, Search, DollarSign, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';

interface FeeCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFeeCollected: (payment: FeePayment) => void;
  preSelectedStudentId?: string;
}

export const FeeCollectionModal: React.FC<FeeCollectionModalProps> = ({
  isOpen,
  onClose,
  onFeeCollected,
  preSelectedStudentId,
}) => {
  const {
    students,
    classes,
    sections,
    parents,
    feeTypes,
    feeStructures,
    collectFee,
    currentUser,
    settings,
    feePayments,
  } = useApp();

  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Fee items selection
  const [selectedItems, setSelectedItems] = useState<{ feeTypeId: string; amount: number }[]>([]);
  const [billingMonth, setBillingMonth] = useState('September');
  const [billingYear, setBillingYear] = useState(2026);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [discountReason, setDiscountReason] = useState<string>('');
  const [fineAmount, setFineAmount] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<FeePayment['paymentMethod']>('Cash');
  const [remarks, setRemarks] = useState('');

  // Pre-selection effect
  useEffect(() => {
    if (preSelectedStudentId) {
      const s = students.find((st) => st.id === preSelectedStudentId);
      if (s) selectStudent(s);
    } else if (students.length > 0 && !selectedStudent) {
      selectStudent(students[0]);
    }
  }, [preSelectedStudentId, isOpen]);

  if (!isOpen) return null;

  const selectStudent = (student: Student) => {
    setSelectedStudent(student);
    setStudentSearch(`${student.firstName} ${student.lastName} (${student.admissionNumber})`);

    // Find class fee structures
    const classStructures = feeStructures.filter((fs) => fs.classId === student.classId);
    let initialSub = 0;
    if (classStructures.length > 0) {
      const items = classStructures.map((cs) => ({
        feeTypeId: cs.feeTypeId,
        amount: cs.amount,
      }));
      setSelectedItems(items);
      initialSub = items.reduce((acc, i) => acc + i.amount, 0);
    } else {
      // Default standard fee items
      const defaultItems = [
        { feeTypeId: 'ft-1', amount: 8500 },
        { feeTypeId: 'ft-5', amount: 1200 },
        { feeTypeId: 'ft-6', amount: 600 },
      ];
      setSelectedItems(defaultItems);
      initialSub = 10300;
    }

    // Auto-detect Sibling Concession or Scholarship
    const familySiblings = students.filter((s) => s.parentId === student.parentId && s.status === 'Active');
    let autoDisc = 0;
    let autoReason = '';

    if (student.siblingDiscountPercent && student.siblingDiscountPercent > 0) {
      autoDisc = Math.round((initialSub * student.siblingDiscountPercent) / 100);
      autoReason = `Sibling Concession (${student.siblingDiscountPercent}%)`;
    } else if (familySiblings.length > 1) {
      // Find rank among siblings by admission date or id
      const sorted = [...familySiblings].sort((a, b) => a.admissionDate.localeCompare(b.admissionDate));
      const rank = sorted.findIndex((s) => s.id === student.id) + 1;
      if (rank === 2) {
        autoDisc = Math.round((initialSub * 25) / 100);
        autoReason = '2nd Sibling Concession (25%)';
      } else if (rank >= 3) {
        autoDisc = Math.round((initialSub * 50) / 100);
        autoReason = '3rd+ Sibling Concession (50%)';
      }
    } else if (student.scholarshipPercent && student.scholarshipPercent > 0) {
      autoDisc = Math.round((initialSub * student.scholarshipPercent) / 100);
      autoReason = student.scholarshipName || 'Scholarship Concession';
    }

    setDiscountAmount(autoDisc);
    setDiscountReason(autoReason);
    setPaidAmount(Math.max(0, initialSub - autoDisc));
  };

  // Instant JavaScript Dynamic Calculations
  const subtotal = selectedItems.reduce((acc, item) => acc + item.amount, 0);
  const totalPayable = Math.max(0, subtotal - (Number(discountAmount) || 0) + (Number(fineAmount) || 0));
  const remainingBalance = Math.max(0, totalPayable - (Number(paidAmount) || 0));

  // Compute previous arrears from history
  const previousArrears = selectedStudent
    ? feePayments
        .filter((p) => p.studentId === selectedStudent.id)
        .reduce((acc, p) => acc + p.balanceAmount, 0)
    : 0;

  const handleItemAmountChange = (index: number, newAmount: number) => {
    setSelectedItems((prev) => {
      const next = [...prev];
      next[index].amount = Math.max(0, newAmount);
      return next;
    });
  };

  const handleAddItem = (feeTypeId: string) => {
    if (selectedItems.some((i) => i.feeTypeId === feeTypeId)) return;
    const fs = feeStructures.find((f) => f.classId === selectedStudent?.classId && f.feeTypeId === feeTypeId);
    setSelectedItems((prev) => [...prev, { feeTypeId, amount: fs ? fs.amount : 1000 }]);
  };

  const handleRemoveItem = (index: number) => {
    setSelectedItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    const receiptNumber = collectFee({
      studentId: selectedStudent.id,
      date: new Date().toISOString().slice(0, 10),
      month: billingMonth,
      year: Number(billingYear),
      subtotal,
      discountAmount: Number(discountAmount) || 0,
      discountReason: discountReason || undefined,
      fineAmount: Number(fineAmount) || 0,
      totalAmount: totalPayable,
      paidAmount: Number(paidAmount) || 0,
      balanceAmount: remainingBalance,
      paymentMethod,
      collectedBy: currentUser.name,
      remarks,
      items: selectedItems,
    });

    const newPaymentObj: FeePayment = {
      id: `pay-${Date.now()}`,
      receiptNumber,
      studentId: selectedStudent.id,
      date: new Date().toISOString().slice(0, 10),
      month: billingMonth,
      year: Number(billingYear),
      subtotal,
      discountAmount: Number(discountAmount) || 0,
      discountReason: discountReason || undefined,
      fineAmount: Number(fineAmount) || 0,
      totalAmount: totalPayable,
      paidAmount: Number(paidAmount) || 0,
      balanceAmount: remainingBalance,
      paymentMethod,
      collectedBy: currentUser.name,
      remarks,
      items: selectedItems,
    };

    onFeeCollected(newPaymentObj);
    onClose();
  };

  const matchingStudents = studentSearch.trim()
    ? students.filter(
        (s) =>
          `${s.firstName} ${s.lastName}`.toLowerCase().includes(studentSearch.toLowerCase()) ||
          s.admissionNumber.toLowerCase().includes(studentSearch.toLowerCase()) ||
          s.rollNumber.toLowerCase().includes(studentSearch.toLowerCase())
      )
    : [];

  const parent = selectedStudent ? parents.find((p) => p.id === selectedStudent.parentId) : null;
  const cls = selectedStudent ? classes.find((c) => c.id === selectedStudent.classId) : null;
  const sec = selectedStudent ? sections.find((s) => s.id === selectedStudent.sectionId) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4 overflow-y-auto">
      <div className="w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Fee Collection & Receipt Generation Counter
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Instant balance reconciliation, fine/discount calculation and receipt dispatch
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Student Search & Auto-complete */}
          <div className="relative">
            <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Select or Search Student (by Name, Admission #, Roll #) *
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => {
                  setStudentSearch(e.target.value);
                  if (selectedStudent) setSelectedStudent(null);
                }}
                placeholder="Type student name or admission number..."
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-8 pr-3 py-2 text-xs font-semibold text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              />
            </div>

            {/* Suggestions dropdown */}
            {!selectedStudent && matchingStudents.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-xl border border-neutral-200 bg-white shadow-xl z-20 dark:border-neutral-800 dark:bg-neutral-900 divide-y divide-neutral-100 dark:divide-neutral-800">
                {matchingStudents.slice(0, 5).map((s) => (
                  <div
                    key={s.id}
                    onClick={() => selectStudent(s)}
                    className="p-2.5 hover:bg-blue-50 dark:hover:bg-neutral-800 cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-neutral-900 dark:text-neutral-100">{s.firstName} {s.lastName}</span>
                      <span className="text-[11px] text-neutral-400 font-mono ml-2">Adm: {s.admissionNumber} · Roll: {s.rollNumber}</span>
                    </div>
                    <span className="text-[11px] text-blue-600 font-medium">Select →</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Student Quick Bio Strip */}
          {selectedStudent && (
            <div className="rounded-xl border border-neutral-200 bg-neutral-50/80 p-3.5 dark:border-neutral-800 dark:bg-neutral-800/40">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <span className="text-[10px] text-neutral-400">Student:</span>
                  <div className="font-bold text-neutral-900 dark:text-neutral-100">
                    {selectedStudent.firstName} {selectedStudent.lastName}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400">Class & Section:</span>
                  <div className="font-medium text-neutral-800 dark:text-neutral-200">
                    {cls?.name} ({sec?.name})
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400">Father/Guardian:</span>
                  <div className="font-medium text-neutral-800 dark:text-neutral-200">
                    {parent?.fatherName || 'N/A'}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400">Previous Arrears:</span>
                  <div className={`font-mono font-bold ${previousArrears > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {settings.currencySymbol}{previousArrears.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Billing Cycle Period */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium mb-1">Fee Month</label>
              <select
                value={billingMonth}
                onChange={(e) => setBillingMonth(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
              >
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Academic Year</label>
              <input
                type="number"
                value={billingYear}
                onChange={(e) => setBillingYear(Number(e.target.value))}
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800"
              />
            </div>
          </div>

          {/* Fee Items Table */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                Fee Particulars & Line Items
              </span>
              {/* Quick Add Fee Type dropdown */}
              <select
                onChange={(e) => {
                  if (e.target.value) handleAddItem(e.target.value);
                  e.target.value = '';
                }}
                className="text-[11px] rounded-md border border-neutral-300 bg-white px-2 py-1 text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
              >
                <option value="">+ Add Fee Head...</option>
                {feeTypes.map((ft) => (
                  <option key={ft.id} value={ft.id}>{ft.name}</option>
                ))}
              </select>
            </div>

            <div className="rounded-xl border border-neutral-200 overflow-hidden dark:border-neutral-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700">
                  <tr>
                    <th className="py-2 px-3">Fee Particular</th>
                    <th className="py-2 px-3 text-right">Amount ({settings.currency})</th>
                    <th className="py-2 px-3 w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {selectedItems.map((item, idx) => {
                    const ft = feeTypes.find((f) => f.id === item.feeTypeId);
                    return (
                      <tr key={idx}>
                        <td className="py-2 px-3 font-medium">{ft?.name || 'Fee'}</td>
                        <td className="py-2 px-3 text-right">
                          <input
                            type="number"
                            value={item.amount}
                            onChange={(e) => handleItemAmountChange(idx, Number(e.target.value))}
                            className="w-28 text-right font-mono font-medium rounded-md border border-neutral-200 px-2 py-0.5 dark:border-neutral-700 dark:bg-neutral-800"
                          />
                        </td>
                        <td className="py-2 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="text-neutral-400 hover:text-rose-600 p-0.5 cursor-pointer"
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Discounts, Fines & Dynamic Calculation Block */}
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-800/30 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium mb-1">Discount Concession ({settings.currency})</label>
                <input
                  type="number"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(Number(e.target.value))}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-900"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Discount Reason</label>
                <input
                  type="text"
                  placeholder="e.g. Sibling Discount / Merit"
                  value={discountReason}
                  onChange={(e) => setDiscountReason(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium mb-1">Late Submission Fine ({settings.currency})</label>
                <input
                  type="number"
                  value={fineAmount}
                  onChange={(e) => setFineAmount(Number(e.target.value))}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-900"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-900"
                >
                  <option value="Cash">Cash Counter</option>
                  <option value="Bank Transfer">Bank Transfer (HBL / Meezan)</option>
                  <option value="Online">Online Gateway / Card</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Instant Calculation Live Box */}
            <div className="border-t border-neutral-200 pt-3 dark:border-neutral-700 space-y-1.5 font-mono">
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Subtotal:</span>
                <span>{settings.currencySymbol}{subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>- Concession:</span>
                  <span>-{settings.currencySymbol}{discountAmount.toLocaleString()}</span>
                </div>
              )}
              {fineAmount > 0 && (
                <div className="flex justify-between text-rose-600 font-medium">
                  <span>+ Fine:</span>
                  <span>+{settings.currencySymbol}{fineAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-neutral-300 dark:border-neutral-700 pt-1 font-bold text-sm text-neutral-900 dark:text-neutral-100">
                <span>Total Net Payable:</span>
                <span>{settings.currencySymbol}{totalPayable.toLocaleString()}</span>
              </div>

              <div className="pt-2 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Amount Received Now *
                  </label>
                  <input
                    type="number"
                    required
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(Number(e.target.value))}
                    className="w-full rounded-lg border-2 border-emerald-500 bg-white px-3 py-1.5 font-mono font-bold text-sm text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Remaining Arrears
                  </label>
                  <div className={`py-2 px-3 rounded-lg font-mono font-bold text-sm ${remainingBalance > 0 ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40' : 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40'}`}>
                    {settings.currencySymbol}{remainingBalance.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-neutral-200 px-6 py-3.5 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
          <span className="text-[11px] text-neutral-500 font-mono">
            Unique receipt voucher will be created on confirmation
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-neutral-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedStudent || paidAmount <= 0}
              className="rounded-lg bg-emerald-600 px-5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <CreditCard className="h-4 w-4" />
              Confirm & Collect Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
