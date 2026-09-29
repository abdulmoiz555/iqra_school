import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LeaveRequest, PayrollRecord } from '../../types';
import {
  Users,
  FileSpreadsheet,
  Calendar,
  CheckCircle,
  XCircle,
  Plus,
  Printer,
  DollarSign,
  Clock,
  Check,
  X
} from 'lucide-react';
import { PayslipModal } from '../common/PayslipModal';

export const HRHub: React.FC = () => {
  const {
    teachers,
    staff,
    leaves,
    submitLeave,
    updateLeaveStatus,
    payrolls,
    generatePayroll,
    currentUser,
    settings,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'payroll' | 'leaves' | 'directory'>('payroll');
  const [selectedPayrollForPrint, setSelectedPayrollForPrint] = useState<PayrollRecord | null>(null);

  // Leave application modal
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveEmployeeId, setLeaveEmployeeId] = useState(teachers[0]?.id || '');
  const [leaveType, setLeaveType] = useState<LeaveRequest['leaveType']>('Casual');
  const [leaveStart, setLeaveStart] = useState(new Date().toISOString().slice(0, 10));
  const [leaveEnd, setLeaveEnd] = useState(new Date().toISOString().slice(0, 10));
  const [leaveReason, setLeaveReason] = useState('');

  // Payroll generator modal
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [payEmpId, setPayEmpId] = useState(teachers[0]?.id || '');
  const [payMonth, setPayMonth] = useState('September');
  const [payYear, setPayYear] = useState(2026);
  const [payBasic, setPayBasic] = useState(100000);
  const [payAllowances, setPayAllowances] = useState(10000);
  const [payBonus, setPayBonus] = useState(0);
  const [payOvertime, setPayOvertime] = useState(0);
  const [payDeductions, setPayDeductions] = useState(4000);
  const [payLoan, setPayLoan] = useState(0);
  const [payFine, setPayFine] = useState(0);

  // Dynamic Net Salary Calculation
  const netCalculated =
    Number(payBasic) +
    Number(payAllowances) +
    Number(payBonus) +
    Number(payOvertime) -
    Number(payDeductions) -
    Number(payLoan) -
    Number(payFine);

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveReason.trim()) return;
    const isTch = teachers.some((t) => t.id === leaveEmployeeId);
    submitLeave({
      employeeId: leaveEmployeeId,
      employeeType: isTch ? 'Teacher' : 'Staff',
      leaveType,
      startDate: leaveStart,
      endDate: leaveEnd,
      reason: leaveReason,
    });
    setLeaveReason('');
    setIsLeaveModalOpen(false);
  };

  const handlePayrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isTch = teachers.some((t) => t.id === payEmpId);
    generatePayroll({
      employeeId: payEmpId,
      employeeType: isTch ? 'Teacher' : 'Staff',
      month: payMonth,
      year: Number(payYear),
      basicSalary: Number(payBasic),
      allowances: Number(payAllowances),
      bonus: Number(payBonus),
      overtime: Number(payOvertime),
      deductions: Number(payDeductions),
      loan: Number(payLoan),
      fine: Number(payFine),
      netSalary: Math.max(0, netCalculated),
      paymentDate: new Date().toISOString().slice(0, 10),
      status: 'Paid',
      paymentMethod: 'Bank Transfer',
    });
    setIsPayrollModalOpen(false);
  };

  const allEmployees = [
    ...teachers.map((t) => ({ ...t, type: 'Teacher' as const })),
    ...staff.map((s) => ({ ...s, type: 'Staff' as const })),
  ];

  const canManage = ['Super Admin', 'Admin', 'Accountant'].includes(currentUser.role);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Human Resources & Staff Payroll Management
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Automated salary computations, leaves approval workflow, and printable payslips
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLeaveModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 cursor-pointer"
          >
            <Calendar className="h-3.5 w-3.5 text-blue-600" />
            Apply For Leave
          </button>
          {canManage && (
            <button
              onClick={() => setIsPayrollModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs cursor-pointer"
            >
              <DollarSign className="h-4 w-4" />
              Generate Salary Slip
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-xs">
        <button
          onClick={() => setActiveTab('payroll')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'payroll'
              ? 'bg-white text-blue-600 font-bold shadow-xs dark:bg-neutral-900 dark:text-blue-400'
              : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400'
          }`}
        >
          Disbursed Payroll History ({payrolls.length})
        </button>
        <button
          onClick={() => setActiveTab('leaves')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'leaves'
              ? 'bg-white text-blue-600 font-bold shadow-xs dark:bg-neutral-900 dark:text-blue-400'
              : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400'
          }`}
        >
          Leave Applications ({leaves.length})
        </button>
        <button
          onClick={() => setActiveTab('directory')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'directory'
              ? 'bg-white text-blue-600 font-bold shadow-xs dark:bg-neutral-900 dark:text-blue-400'
              : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400'
          }`}
        >
          Staff & Faculty Directory ({allEmployees.length})
        </button>
      </div>

      {/* Tab 1: Payroll Records */}
      {activeTab === 'payroll' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-neutral-200 bg-white shadow-xs overflow-hidden dark:border-neutral-800 dark:bg-neutral-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 dark:bg-neutral-800/60 dark:border-neutral-800 dark:text-neutral-300 font-semibold">
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Pay Period</th>
                  <th className="py-3 px-4 text-right">Basic</th>
                  <th className="py-3 px-4 text-right">Allowances</th>
                  <th className="py-3 px-4 text-right">Deductions</th>
                  <th className="py-3 px-4 text-right">Net Salary</th>
                  <th className="py-3 px-4">Disbursed Date</th>
                  <th className="py-3 px-4 text-right">Print Payslip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {payrolls.map((pr) => {
                  const emp =
                    pr.employeeType === 'Teacher'
                      ? teachers.find((t) => t.id === pr.employeeId)
                      : staff.find((s) => s.id === pr.employeeId);

                  return (
                    <tr key={pr.id} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40">
                      <td className="py-3 px-4">
                        <div className="font-bold text-neutral-900 dark:text-neutral-100">{emp?.name || 'Employee'}</div>
                        <div className="text-[10px] text-neutral-400 font-mono">{emp?.employeeId} · {emp?.designation}</div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-neutral-700 dark:text-neutral-300">
                        {pr.month} {pr.year}
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-right">
                        {settings.currencySymbol}{pr.basicSalary.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-right text-emerald-600">
                        +{settings.currencySymbol}{pr.allowances.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-right text-rose-600">
                        -{settings.currencySymbol}{pr.deductions.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums font-bold text-right text-emerald-700 dark:text-emerald-400 text-sm">
                        {settings.currencySymbol}{pr.netSalary.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono text-neutral-500">
                        {pr.paymentDate}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedPayrollForPrint(pr)}
                          className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-blue-600 dark:hover:bg-neutral-800 cursor-pointer"
                        >
                          <Printer className="h-4 w-4" />
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

      {/* Tab 2: Leaves Management */}
      {activeTab === 'leaves' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-neutral-200 bg-white shadow-xs overflow-hidden dark:border-neutral-800 dark:bg-neutral-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 dark:bg-neutral-800/60 dark:border-neutral-800 dark:text-neutral-300 font-semibold">
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Leave Type</th>
                  <th className="py-3 px-4">Start Date</th>
                  <th className="py-3 px-4">End Date</th>
                  <th className="py-3 px-4">Reason / Notes</th>
                  <th className="py-3 px-4">Status</th>
                  {canManage && <th className="py-3 px-4 text-right">Approval Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {leaves.map((lv) => {
                  const emp =
                    lv.employeeType === 'Teacher'
                      ? teachers.find((t) => t.id === lv.employeeId)
                      : staff.find((s) => s.id === lv.employeeId);

                  return (
                    <tr key={lv.id} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40">
                      <td className="py-3 px-4">
                        <div className="font-bold text-neutral-900 dark:text-neutral-100">{emp?.name || 'Staff'}</div>
                        <div className="text-[10px] text-neutral-400 font-mono">{emp?.designation}</div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-blue-600 dark:text-blue-400">
                        {lv.leaveType} Leave
                      </td>
                      <td className="py-3 px-4 font-mono text-neutral-500">{lv.startDate}</td>
                      <td className="py-3 px-4 font-mono text-neutral-500">{lv.endDate}</td>
                      <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400 max-w-xs">{lv.reason}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold ${
                          lv.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                          lv.status === 'Rejected' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
                          'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {lv.status}
                        </span>
                      </td>
                      {canManage && (
                        <td className="py-3 px-4 text-right">
                          {lv.status === 'Pending' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => updateLeaveStatus(lv.id, 'Approved', currentUser.name)}
                                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 rounded-md hover:bg-emerald-100 cursor-pointer"
                              >
                                <Check className="h-3 w-3" /> Approve
                              </button>
                              <button
                                onClick={() => updateLeaveStatus(lv.id, 'Rejected', currentUser.name)}
                                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-rose-50 text-rose-700 rounded-md hover:bg-rose-100 cursor-pointer"
                              >
                                <X className="h-3 w-3" /> Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-neutral-400 font-mono">Decided ✓</span>
                          )}
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

      {/* Tab 3: Directory */}
      {activeTab === 'directory' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-neutral-200 bg-white shadow-xs overflow-hidden dark:border-neutral-800 dark:bg-neutral-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 dark:bg-neutral-800/60 dark:border-neutral-800 dark:text-neutral-300 font-semibold">
                <tr>
                  <th className="py-3 px-4">Emp ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Role / Designation</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4 font-mono">Monthly Salary</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {allEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40">
                    <td className="py-3 px-4 font-mono font-medium text-neutral-500">{emp.employeeId}</td>
                    <td className="py-3 px-4 font-bold text-neutral-900 dark:text-neutral-100">{emp.name}</td>
                    <td className="py-3 px-4 font-semibold text-blue-600 dark:text-blue-400">{emp.designation}</td>
                    <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">{emp.department}</td>
                    <td className="py-3 px-4 font-mono tabular-nums font-bold">
                      {settings.currencySymbol}{emp.salary.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-sm bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-semibold">
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Leave Application Modal */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-3">Apply For Employee Leave</h3>
            <form onSubmit={handleLeaveSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium mb-1">Employee</label>
                <select
                  value={leaveEmployeeId}
                  onChange={(e) => setLeaveEmployeeId(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                >
                  {allEmployees.map((e) => (
                    <option key={e.id} value={e.id}>{e.name} ({e.designation})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as any)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                >
                  <option value="Casual">Casual Leave</option>
                  <option value="Sick">Sick / Medical Leave</option>
                  <option value="Annual">Annual Paid Leave</option>
                  <option value="Emergency">Emergency Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    value={leaveStart}
                    onChange={(e) => setLeaveStart(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    value={leaveEnd}
                    onChange={(e) => setLeaveEnd(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">Reason for Leave *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="State reason for absence..."
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                />
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Generate Payroll Modal */}
      {isPayrollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-3">Disburse Monthly Payroll Slip</h3>
            <form onSubmit={handlePayrollSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium mb-1">Select Employee</label>
                <select
                  value={payEmpId}
                  onChange={(e) => {
                    setPayEmpId(e.target.value);
                    const emp = allEmployees.find((item) => item.id === e.target.value);
                    if (emp) setPayBasic(emp.salary);
                  }}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                >
                  {allEmployees.map((e) => (
                    <option key={e.id} value={e.id}>{e.name} ({e.designation})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Pay Month</label>
                  <select
                    value={payMonth}
                    onChange={(e) => setPayMonth(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                  >
                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">Year</label>
                  <input
                    type="number"
                    value={payYear}
                    onChange={(e) => setPayYear(Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Basic Salary ({settings.currency})</label>
                  <input
                    type="number"
                    value={payBasic}
                    onChange={(e) => setPayBasic(Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Allowances (+)</label>
                  <input
                    type="number"
                    value={payAllowances}
                    onChange={(e) => setPayAllowances(Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Tax & Deductions (-)</label>
                  <input
                    type="number"
                    value={payDeductions}
                    onChange={(e) => setPayDeductions(Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Net Calculated Salary</label>
                  <div className="py-2 px-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-sm rounded-lg">
                    {settings.currencySymbol}{Math.max(0, netCalculated).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsPayrollModalOpen(false)}
                  className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 cursor-pointer"
                >
                  Confirm & Disburse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Payslip Modal */}
      {selectedPayrollForPrint && (
        <PayslipModal
          isOpen={Boolean(selectedPayrollForPrint)}
          onClose={() => setSelectedPayrollForPrint(null)}
          payroll={selectedPayrollForPrint}
        />
      )}
    </div>
  );
};
