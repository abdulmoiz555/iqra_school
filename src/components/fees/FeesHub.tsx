import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FeePayment, FeeType, Expense } from '../../types';
import {
  CreditCard,
  Plus,
  Printer,
  DollarSign,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  FileText,
  Search,
  Download,
  Receipt,
  Layers,
  Percent,
  X,
  Sparkles,
  Users,
  Award,
  Calculator,
  HeartHandshake
} from 'lucide-react';
import { FeeCollectionModal } from './FeeCollectionModal';
import { PrintReceiptModal } from '../common/PrintReceiptModal';

export const FeesHub: React.FC = () => {
  const {
    feePayments,
    feeTypes,
    feeStructures,
    feeDiscounts,
    expenses,
    addExpense,
    addFeeType,
    students,
    classes,
    parents,
    settings,
    currentUser,
  } = useApp();

  const isParent = currentUser.role === 'Parent';
  const isStudent = currentUser.role === 'Student';
  const parentRecord = parents.find((p) => p.id === currentUser.linkedId || p.email === currentUser.email);
  const myChildren = students.filter(
    (s) => parentRecord?.studentIds?.includes(s.id) || s.parentId === parentRecord?.id
  );
  const myChildIds = new Set(myChildren.map((c) => c.id));
  const myPayments = feePayments.filter((p) =>
    isParent ? myChildIds.has(p.studentId) : isStudent ? p.studentId === currentUser.linkedId : true
  );
  const myTotalPendingBalance = myPayments.reduce((acc, p) => acc + p.balanceAmount, 0);
  const myTotalPaid = myPayments.reduce((acc, p) => acc + p.paidAmount, 0);

  const [activeTab, setActiveTab] = useState<'receipts' | 'arrears' | 'structures' | 'discounts' | 'expenses'>('receipts');
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);
  const [selectedPaymentForPrint, setSelectedPaymentForPrint] = useState<FeePayment | null>(null);
  const [searchReceipt, setSearchReceipt] = useState('');
  const [calcSiblingCount, setCalcSiblingCount] = useState<number>(3);
  const [calcBaseTuition, setCalcBaseTuition] = useState<number>(8500);

  // Add Expense modal
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [newExpCategory, setNewExpCategory] = useState<Expense['category']>('Electricity');
  const [newExpDesc, setNewExpDesc] = useState('');
  const [newExpAmount, setNewExpAmount] = useState(0);
  const [newExpMethod, setNewExpMethod] = useState<Expense['paymentMethod']>('Cash');
  const [newExpRef, setNewExpRef] = useState('');

  // Financial totals
  const totalCollections = feePayments.reduce((acc, p) => acc + p.paidAmount, 0);
  const totalPendingArrears = feePayments.reduce((acc, p) => acc + p.balanceAmount, 0);
  const totalExpAmount = expenses.reduce((acc, e) => acc + e.amount, 0);

  // Unpaid / Arrears Students list
  const studentsWithArrears = feePayments
    .filter((p) => p.balanceAmount > 0)
    .map((p) => {
      const stu = students.find((s) => s.id === p.studentId);
      const cls = stu ? classes.find((c) => c.id === stu.classId) : null;
      return {
        paymentId: p.id,
        receiptNumber: p.receiptNumber,
        studentName: stu ? `${stu.firstName} ${stu.lastName}` : 'N/A',
        admissionNumber: stu?.admissionNumber || '',
        className: cls?.name || 'Class',
        month: `${p.month} ${p.year}`,
        total: p.totalAmount,
        paid: p.paidAmount,
        balance: p.balanceAmount,
      };
    });

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpDesc.trim() || newExpAmount <= 0) return;
    addExpense({
      date: new Date().toISOString().slice(0, 10),
      category: newExpCategory,
      description: newExpDesc,
      amount: Number(newExpAmount),
      paymentMethod: newExpMethod,
      referenceNumber: newExpRef || undefined,
      recordedBy: currentUser.name,
    });
    setNewExpDesc('');
    setNewExpAmount(0);
    setIsExpenseModalOpen(false);
  };

  const filteredPayments = feePayments.filter((p) => {
    const q = searchReceipt.toLowerCase().trim();
    if (!q) return true;
    const stu = students.find((s) => s.id === p.studentId);
    const sName = stu ? `${stu.firstName} ${stu.lastName}`.toLowerCase() : '';
    return (
      p.receiptNumber.toLowerCase().includes(q) ||
      (p.trackingNumber && p.trackingNumber.toLowerCase().includes(q)) ||
      sName.includes(q) ||
      p.month.toLowerCase().includes(q) ||
      p.paymentMethod.toLowerCase().includes(q)
    );
  });

  const canManage = ['Super Admin', 'Admin', 'Accountant'].includes(currentUser.role);

  return (
    <div className="space-y-4">
      {/* Top Header & Quick Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Fee Administration & Financial Accounts
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Collect school fees, print vouchers, manage arrears, discounts and operational campus expenses
          </p>
        </div>

        {canManage && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (feePayments.length > 0) {
                  setSelectedPaymentForPrint(feePayments[0]);
                }
              }}
              className="flex items-center gap-1.5 rounded-lg border border-emerald-600/40 bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800 cursor-pointer shadow-2xs"
              title="Print Watermarked Half-A4 Fee Invoice Voucher"
            >
              <Printer className="h-3.5 w-3.5 text-emerald-600" />
              Print Invoice / Challan
            </button>
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 cursor-pointer"
            >
              <TrendingDown className="h-3.5 w-3.5 text-rose-500" />
              Log Expense
            </button>
            <button
              onClick={() => setIsCollectModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs transition-colors cursor-pointer"
            >
              <CreditCard className="h-4 w-4" />
              + Collect Fee Voucher
            </button>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500">Total Fee Collections</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 tabular-nums">
            {settings.currencySymbol}{totalCollections.toLocaleString()}
          </div>
          <p className="mt-1 text-[11px] text-neutral-400 font-mono">
            {feePayments.length} receipts generated
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500">Unpaid Balances / Arrears</span>
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 tabular-nums">
            {settings.currencySymbol}{totalPendingArrears.toLocaleString()}
          </div>
          <p className="mt-1 text-[11px] text-neutral-400 font-mono">
            {studentsWithArrears.length} student balances due
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500">Operational Expenses</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 tabular-nums">
            {settings.currencySymbol}{totalExpAmount.toLocaleString()}
          </div>
          <p className="mt-1 text-[11px] text-neutral-400 font-mono">
            {expenses.length} expense vouchers
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-xs">
        {[
          { id: 'receipts', label: `Receipts History (${feePayments.length})` },
          { id: 'arrears', label: `Fee Arrears (${studentsWithArrears.length})` },
          { id: 'structures', label: 'Fee Structures & Types' },
          { id: 'discounts', label: 'Concessions, Scholarships & Siblings' },
          { id: 'expenses', label: `Campus Expenses (${expenses.length})` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === t.id
                ? 'bg-white text-blue-600 font-bold shadow-xs dark:bg-neutral-900 dark:text-blue-400'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Receipts History */}
      {activeTab === 'receipts' && (
        <div className="space-y-3">
          <div className="rounded-xl border border-neutral-200 bg-white p-3 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
              <input
                type="text"
                value={searchReceipt}
                onChange={(e) => setSearchReceipt(e.target.value)}
                placeholder="Track by Receipt #, Tracking No (e.g. TRK-2026-...), student name..."
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-8 pr-3 py-1.5 text-xs text-neutral-900 focus:border-blue-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              />
            </div>
            {searchReceipt && (
              <span className="text-xs text-neutral-500">
                Found {filteredPayments.length} matching transactions
              </span>
            )}
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white shadow-xs overflow-hidden dark:border-neutral-800 dark:bg-neutral-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 dark:bg-neutral-800/60 dark:border-neutral-800 dark:text-neutral-300 font-semibold">
                <tr>
                  <th className="py-3 px-4">Receipt & Tracking #</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Billing Month</th>
                  <th className="py-3 px-4 text-right">Subtotal</th>
                  <th className="py-3 px-4 text-right">Discount</th>
                  <th className="py-3 px-4 text-right">Paid</th>
                  <th className="py-3 px-4 text-right">Balance</th>
                  <th className="py-3 px-4">Mode</th>
                  <th className="py-3 px-4 text-right">Print</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {filteredPayments.map((p) => {
                  const stu = students.find((s) => s.id === p.studentId);
                  const cls = stu ? classes.find((c) => c.id === stu.classId) : null;
                  const trackNo = p.trackingNumber || `TRK-2026-${p.receiptNumber.slice(-4)}`;

                  return (
                    <tr key={p.id} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40">
                      <td className="py-3 px-4 font-mono">
                        <div className="font-bold text-blue-600 dark:text-blue-400">
                          {p.receiptNumber}
                        </div>
                        <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                          {trackNo}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-neutral-500">
                        {p.date}
                      </td>
                      <td className="py-3 px-4 font-semibold text-neutral-900 dark:text-neutral-100">
                        {stu ? `${stu.firstName} ${stu.lastName}` : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">
                        {cls?.name || 'Class'}
                      </td>
                      <td className="py-3 px-4 text-neutral-700 dark:text-neutral-300">
                        {p.month} {p.year}
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-right">
                        {settings.currencySymbol}{p.subtotal.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-right text-emerald-600">
                        {p.discountAmount > 0 ? `-${settings.currencySymbol}${p.discountAmount.toLocaleString()}` : '—'}
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-right font-bold text-neutral-900 dark:text-neutral-100">
                        {settings.currencySymbol}{p.paidAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-right font-semibold text-rose-600 dark:text-rose-400">
                        {p.balanceAmount > 0 ? `${settings.currencySymbol}${p.balanceAmount.toLocaleString()}` : 'Cleared'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-sm bg-neutral-100 dark:bg-neutral-800 text-[10px] font-medium">
                          {p.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedPaymentForPrint(p)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-600/30 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800 cursor-pointer transition-colors shadow-2xs"
                          title="Print Watermarked Fee Invoice"
                        >
                          <Printer className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Print Invoice</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Arrears & Unpaid Fees */}
      {activeTab === 'arrears' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-1">
              Outstanding Fee Defaulters & Arrears Register
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              Students carrying pending balance from current or past fee challans
            </p>

            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:border-neutral-700">
                <tr>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Admission #</th>
                  <th className="py-2.5 px-3">Class</th>
                  <th className="py-2.5 px-3">Billing Month</th>
                  <th className="py-2.5 px-3 text-right">Total Billed</th>
                  <th className="py-2.5 px-3 text-right">Amount Paid</th>
                  <th className="py-2.5 px-3 text-right">Outstanding Arrears</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {studentsWithArrears.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-6 text-center text-neutral-400">
                      Zero fee arrears! All students have fully settled their dues.
                    </td>
                  </tr>
                ) : (
                  studentsWithArrears.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 font-semibold text-neutral-900 dark:text-neutral-100">{item.studentName}</td>
                      <td className="py-2.5 px-3 font-mono text-neutral-500">{item.admissionNumber}</td>
                      <td className="py-2.5 px-3">{item.className}</td>
                      <td className="py-2.5 px-3 font-mono">{item.month}</td>
                      <td className="py-2.5 px-3 font-mono text-right">{settings.currencySymbol}{item.total.toLocaleString()}</td>
                      <td className="py-2.5 px-3 font-mono text-right">{settings.currencySymbol}{item.paid.toLocaleString()}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-right text-rose-600 dark:text-rose-400">
                        {settings.currencySymbol}{item.balance.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => setIsCollectModalOpen(true)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer"
                        >
                          Collect Balance
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Fee Structures & Fee Types */}
      {activeTab === 'structures' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Fee Structures */}
          <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-3">
              Standard Fee Schedule by Class
            </h3>
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700">
                <tr>
                  <th className="py-2 px-3">Class</th>
                  <th className="py-2 px-3">Fee Type</th>
                  <th className="py-2 px-3">Billing Cadence</th>
                  <th className="py-2 px-3 text-right">Standard Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {feeStructures.map((fs) => {
                  const cls = classes.find((c) => c.id === fs.classId);
                  const ft = feeTypes.find((f) => f.id === fs.feeTypeId);
                  return (
                    <tr key={fs.id}>
                      <td className="py-2 px-3 font-medium">{cls?.name || 'Class'}</td>
                      <td className="py-2 px-3">{ft?.name || 'Fee'}</td>
                      <td className="py-2 px-3 font-mono text-neutral-500">{fs.frequency}</td>
                      <td className="py-2 px-3 text-right font-mono font-bold">{settings.currencySymbol}{fs.amount.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Fee Types */}
          <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-3">
              Fee Heads & Categorical Types
            </h3>
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700">
                <tr>
                  <th className="py-2 px-3">Code</th>
                  <th className="py-2 px-3">Fee Head Name</th>
                  <th className="py-2 px-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {feeTypes.map((ft) => (
                  <tr key={ft.id}>
                    <td className="py-2 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">{ft.code}</td>
                    <td className="py-2 px-3 font-semibold text-neutral-900 dark:text-neutral-100">{ft.name}</td>
                    <td className="py-2 px-3 text-neutral-500">{ft.description || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Fee Concessions, Scholarships & Sibling Policies */}
      {activeTab === 'discounts' && (
        <div className="space-y-6">
          {/* Sibling Category & Concession Framework */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <Users className="h-4 w-4 text-emerald-600" />
                  Sibling Concession & Family Enrolment Policy
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Special tuition concession tiered automatically for families with more than one child enrolled at IQRA Education System
                </p>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <HeartHandshake className="h-3.5 w-3.5" /> Institutional Sibling Discount Active
              </span>
            </div>

            {/* Sibling Rules Tier Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-neutral-200 p-4 bg-neutral-50/60 dark:border-neutral-800 dark:bg-neutral-800/40">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono">Child 1 (First/Elder)</span>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 dark:bg-blue-950 dark:text-blue-300 px-2 py-0.5 rounded-sm">
                    {settings.siblingFirstChildPayPercent ?? 100}% Fee Pay
                  </span>
                </div>
                <div className="mt-2 text-xl font-bold font-mono text-neutral-800 dark:text-neutral-200">
                  {Math.max(0, 100 - (settings.siblingFirstChildPayPercent ?? 100))}% Concession
                </div>
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  1st child pays {settings.siblingFirstChildPayPercent ?? 100}% of the standard monthly tuition fee.
                </p>
              </div>

              <div className="rounded-xl border-2 border-emerald-500/60 p-4 bg-emerald-50/40 dark:border-emerald-700/60 dark:bg-emerald-950/20">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-mono">Child 2 (2nd Sibling)</span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 dark:bg-emerald-900/60 dark:text-emerald-300 px-2 py-0.5 rounded-sm">
                    {settings.siblingSecondChildPayPercent ?? 50}% Fee Pay
                  </span>
                </div>
                <div className="mt-2 text-xl font-bold font-mono text-emerald-700 dark:text-emerald-400">
                  {Math.max(0, 100 - (settings.siblingSecondChildPayPercent ?? 50))}% Sibling Waiver
                </div>
                <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                  2nd child pays {settings.siblingSecondChildPayPercent ?? 50}% ({Math.max(0, 100 - (settings.siblingSecondChildPayPercent ?? 50))}% concession deducted automatically on tuition).
                </p>
              </div>

              <div className="rounded-xl border-2 border-purple-500/60 p-4 bg-purple-50/40 dark:border-purple-700/60 dark:bg-purple-950/20">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 font-mono">Child 3+ (3rd & More)</span>
                  <span className="text-[10px] font-bold text-purple-800 bg-purple-100 dark:bg-purple-900/60 dark:text-purple-300 px-2 py-0.5 rounded-sm">
                    {(settings.siblingThirdChildPayPercent ?? 0) === 0 ? '100% FREE' : `${settings.siblingThirdChildPayPercent}% Pay`}
                  </span>
                </div>
                <div className="mt-2 text-xl font-bold font-mono text-purple-700 dark:text-purple-400">
                  {Math.max(0, 100 - (settings.siblingThirdChildPayPercent ?? 0))}% Sibling Waiver
                </div>
                <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                  {(settings.siblingThirdChildPayPercent ?? 0) === 0
                    ? '3rd and subsequent siblings are 100% FREE of charge.'
                    : `3rd and subsequent siblings pay ${settings.siblingThirdChildPayPercent}% tuition.`}
                </p>
              </div>
            </div>

            {/* Interactive Sibling Fee Simulator */}
            <div className="mt-5 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                  <Calculator className="h-4 w-4 text-blue-600" />
                  Live Family Sibling Concession Calculator
                </h4>
                <span className="text-[11px] text-neutral-500 font-mono">
                  Base Tuition: {settings.currencySymbol}{calcBaseTuition.toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
                      Number of Enrolled Siblings in Family:
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4].map((count) => (
                        <button
                          key={count}
                          type="button"
                          onClick={() => setCalcSiblingCount(count)}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold font-mono border transition-all cursor-pointer ${
                            calcSiblingCount === count
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                              : 'bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300'
                          }`}
                        >
                          {count} {count === 1 ? 'Child' : 'Siblings'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
                      Monthly Base Tuition Fee ({settings.currencySymbol}):
                    </label>
                    <input
                      type="number"
                      step="500"
                      min="2000"
                      max="50000"
                      value={calcBaseTuition}
                      onChange={(e) => setCalcBaseTuition(Number(e.target.value))}
                      className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-mono dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                    />
                  </div>
                </div>

                {/* Calculation breakdown */}
                {(() => {
                  const firstPay = settings.siblingFirstChildPayPercent ?? 100;
                  const secondPay = settings.siblingSecondChildPayPercent ?? 50;
                  const thirdPay = settings.siblingThirdChildPayPercent ?? 0;
                  let totalWithoutDiscount = calcBaseTuition * calcSiblingCount;
                  let childFees: { childNumber: number; fee: number; disc: number; label: string }[] = [];

                  for (let i = 1; i <= calcSiblingCount; i++) {
                    if (i === 1) {
                      const disc = calcBaseTuition * (Math.max(0, 100 - firstPay) / 100);
                      childFees.push({
                        childNumber: 1,
                        fee: calcBaseTuition - disc,
                        disc,
                        label: `1st Child (Pays ${firstPay}%)`
                      });
                    } else if (i === 2) {
                      const disc = calcBaseTuition * (Math.max(0, 100 - secondPay) / 100);
                      childFees.push({
                        childNumber: 2,
                        fee: calcBaseTuition - disc,
                        disc,
                        label: `2nd Sibling (${Math.max(0, 100 - secondPay)}% Off, Pays ${secondPay}%)`
                      });
                    } else {
                      const disc = calcBaseTuition * (Math.max(0, 100 - thirdPay) / 100);
                      childFees.push({
                        childNumber: i,
                        fee: calcBaseTuition - disc,
                        disc,
                        label: thirdPay === 0
                          ? `${i}th Sibling (100% FREE)`
                          : `${i}th Sibling (${Math.max(0, 100 - thirdPay)}% Off, Pays ${thirdPay}%)`
                      });
                    }
                  }
                  const totalWithDiscount = childFees.reduce((acc, c) => acc + c.fee, 0);
                  const totalSavings = totalWithoutDiscount - totalWithDiscount;

                  return (
                    <div className="bg-white dark:bg-neutral-900 p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-700 space-y-2 text-xs">
                      <div className="font-bold text-neutral-800 dark:text-neutral-200 border-b border-neutral-100 dark:border-neutral-800 pb-1.5 flex justify-between">
                        <span>Family Billing Simulation:</span>
                        <span className="font-mono text-emerald-600 font-bold">Save {settings.currencySymbol}{totalSavings.toLocaleString()}/mo</span>
                      </div>
                      <div className="space-y-1 font-mono text-[11px]">
                        {childFees.map((c) => (
                          <div key={c.childNumber} className="flex justify-between text-neutral-600 dark:text-neutral-400">
                            <span>{c.label}:</span>
                            <span className="font-bold text-neutral-900 dark:text-neutral-100">
                              {settings.currencySymbol}{c.fee.toLocaleString()}
                              {c.disc > 0 && <span className="text-[10px] text-emerald-600 ml-1">(-{settings.currencySymbol}{c.disc.toLocaleString()})</span>}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700 flex justify-between items-center font-bold">
                        <span>Total Family Payable:</span>
                        <span className="text-sm font-mono text-blue-600 dark:text-blue-400">
                          {settings.currencySymbol}{totalWithDiscount.toLocaleString()} <span className="text-[10px] line-through text-neutral-400 font-normal">({settings.currencySymbol}{totalWithoutDiscount.toLocaleString()})</span>
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Institutional Scholarships Grid */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <Award className="h-4 w-4 text-purple-600" />
                  Institutional Scholarships & Financial Aid Grants
                </h3>
                <p className="text-xs text-neutral-500">
                  Merit scholarships, memorizer of Quran grant, destitute assistance, and staff concessions
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {feeDiscounts.map((dsc) => (
                <div
                  key={dsc.id}
                  className="rounded-xl border border-neutral-200 p-4 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-800/40"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-neutral-900 dark:text-neutral-100">{dsc.name}</h4>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded-sm">
                      {dsc.status}
                    </span>
                  </div>
                  <div className="mt-2 text-xl font-bold font-mono text-blue-600 dark:text-blue-400">
                    {dsc.type === 'percentage' ? `${dsc.value}% Concession` : `${settings.currencySymbol}${dsc.value} Flat`}
                  </div>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    {dsc.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Students Currently Benefiting from Concessions */}
          <div className="rounded-xl border border-neutral-200 bg-white shadow-xs overflow-hidden dark:border-neutral-800 dark:bg-neutral-900">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  Students with Active Concessions & Scholarships
                </h4>
                <p className="text-xs text-neutral-500">
                  Enrolled students with automated sibling concessions or awarded scholarships
                </p>
              </div>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 dark:bg-neutral-800/60 dark:border-neutral-800 dark:text-neutral-300 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Adm #</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Class</th>
                  <th className="py-2.5 px-3">Concession / Sibling Type</th>
                  <th className="py-2.5 px-3 text-right">Discount Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {students
                  .filter((s) => (s.siblingDiscountPercent && s.siblingDiscountPercent > 0) || (s.scholarshipName && s.scholarshipName !== 'None'))
                  .map((stu) => {
                    const cls = classes.find((c) => c.id === stu.classId);
                    return (
                      <tr key={stu.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40">
                        <td className="py-2.5 px-3 font-mono font-medium">{stu.admissionNumber}</td>
                        <td className="py-2.5 px-3 font-semibold text-neutral-900 dark:text-neutral-100">
                          {stu.firstName} {stu.lastName}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded-sm bg-neutral-100 dark:bg-neutral-800 text-[10px] font-medium">
                            {stu.category || 'Co-Education'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">{cls?.name || 'Class'}</td>
                        <td className="py-2.5 px-3">
                          {stu.siblingDiscountPercent ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-sm font-semibold text-[11px]">
                              👨‍👧 Sibling Concession ({stu.siblingDiscountPercent}%)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-purple-700 bg-purple-50 dark:bg-purple-950 dark:text-purple-300 px-2 py-0.5 rounded-sm font-semibold text-[11px]">
                              🎓 {stu.scholarshipName}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {stu.siblingDiscountPercent ? `-${stu.siblingDiscountPercent}%` : `-${stu.scholarshipPercent || 50}%`}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Campus Expenses */}
      {activeTab === 'expenses' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-neutral-200 bg-white shadow-xs overflow-hidden dark:border-neutral-800 dark:bg-neutral-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 dark:bg-neutral-800/60 dark:border-neutral-800 dark:text-neutral-300 font-semibold">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Reference</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Logged By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40">
                    <td className="py-3 px-4 font-mono text-neutral-500">{exp.date}</td>
                    <td className="py-3 px-4 font-bold text-neutral-900 dark:text-neutral-100">{exp.category}</td>
                    <td className="py-3 px-4 text-neutral-700 dark:text-neutral-300">{exp.description}</td>
                    <td className="py-3 px-4 font-mono text-neutral-500">{exp.referenceNumber || '—'}</td>
                    <td className="py-3 px-4 font-mono font-bold text-right text-rose-600 dark:text-rose-400">
                      {settings.currencySymbol}{exp.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">{exp.paymentMethod}</td>
                    <td className="py-3 px-4 text-neutral-500">{exp.recordedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Collect Fee Modal */}
      {isCollectModalOpen && (
        <FeeCollectionModal
          isOpen={isCollectModalOpen}
          onClose={() => setIsCollectModalOpen(false)}
          onFeeCollected={(newPay) => setSelectedPaymentForPrint(newPay)}
        />
      )}

      {/* Print Receipt Modal */}
      {selectedPaymentForPrint && (
        <PrintReceiptModal
          isOpen={Boolean(selectedPaymentForPrint)}
          onClose={() => setSelectedPaymentForPrint(null)}
          payment={selectedPaymentForPrint}
        />
      )}

      {/* Add Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-3">Log Operational Expense</h3>
            <form onSubmit={handleExpenseSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium mb-1">Expense Category</label>
                <select
                  value={newExpCategory}
                  onChange={(e) => setNewExpCategory(e.target.value as any)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                >
                  {['Electricity', 'Gas', 'Water', 'Rent', 'Salaries', 'Maintenance', 'Stationery', 'Transport', 'Internet', 'Other'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Expense Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Utility electricity bill campus block"
                  value={newExpDesc}
                  onChange={(e) => setNewExpDesc(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Amount ({settings.currency}) *</label>
                  <input
                    type="number"
                    required
                    value={newExpAmount}
                    onChange={(e) => setNewExpAmount(Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Payment Method</label>
                  <select
                    value={newExpMethod}
                    onChange={(e) => setNewExpMethod(e.target.value as any)}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Online">Online</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">Bill Reference / Voucher #</label>
                <input
                  type="text"
                  placeholder="e.g. LESCO-102938"
                  value={newExpRef}
                  onChange={(e) => setNewExpRef(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                />
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  Record Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
