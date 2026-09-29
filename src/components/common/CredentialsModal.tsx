import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  KeyRound,
  Copy,
  Check,
  Shield,
  ArrowRight,
  X,
  UserCheck,
  Info
} from 'lucide-react';

interface CredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RoleCredential {
  role: UserRole;
  name: string;
  username: string;
  password: string;
  email: string;
  description: string;
  icon: string;
  badgeColor: string;
  permissions: string[];
}

export const CredentialsModal: React.FC<CredentialsModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, switchRole, settings } = useApp();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const credentialsList: RoleCredential[] = [
    {
      role: 'Super Admin',
      name: 'Dr. Shahzad Tariq',
      username: 'admin',
      password: 'admin123',
      email: 'principal@iqra.edu.pk',
      description: 'Institutional head with complete administrative control and governance.',
      icon: '👑',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      permissions: ['School Settings & Branding', 'Fee Structure Management', 'System Audit Logs', 'Database Backup & Restore', 'Global User Governance']
    },
    {
      role: 'Admin',
      name: 'Admissions & Academic Controller',
      username: 'admin_ops',
      password: 'admin123',
      email: 'admin@iqra.edu.pk',
      description: 'Manages student enrollment, batch promotions, examinations and faculty.',
      icon: '⚡',
      badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      permissions: ['Student Admissions & ID Cards', 'Batch Promotions', 'Classes & Timetables', 'Examinations Hub & Results', 'Fleet Transport & Inventory']
    },
    {
      role: 'Teacher',
      name: 'Engr. Zafar Iqbal',
      username: 'teacher',
      password: 'admin123',
      email: 'zafar.iqbal@iqra.edu.pk',
      description: 'Senior Faculty & Class Teacher for Mathematics and Physics.',
      icon: '📚',
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      permissions: ['Daily Student Roll-Call Attendance', 'Term Examination Marks Entry', 'Weekly Timetable Schedules', 'Homework & Assignments Posting']
    },
    {
      role: 'Accountant',
      name: 'Muhammad Rizwan Aslam',
      username: 'accountant',
      password: 'admin123',
      email: 'accounts@iqra.edu.pk',
      description: 'Bursar & Finance Officer managing collections, receipts and payroll.',
      icon: '💰',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      permissions: ['Counter Fee Collection & POS', 'Dual Fee Challans & Vouchers', 'Fee Concessions & Discounts', 'Campus Overhead Expenses', 'Employee Payroll Generation']
    },
    {
      role: 'Librarian',
      name: 'Mrs. Rubina Kausar',
      username: 'librarian',
      password: 'admin123',
      email: 'library@iqra.edu.pk',
      description: 'Campus library manager handling book catalogs, borrowings and returns.',
      icon: '📖',
      badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
      permissions: ['Book Cataloging (ISBN / Author)', 'Student Book Circulation & Loans', 'Overdue Fine Computation', 'Inventory Stock Counts']
    },
    {
      role: 'Receptionist',
      name: 'Miss Amna Tariq',
      username: 'receptionist',
      password: 'admin123',
      email: 'frontdesk@iqra.edu.pk',
      description: 'Front desk coordinator for admissions inquiries and visitors.',
      icon: '🛎️',
      badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-800',
      permissions: ['New Admissions Inquiries', 'Student Directory Search', 'Campus Notice Board', 'Staff Leave Requests']
    },
    {
      role: 'Parent',
      name: 'Muhammad Arshad Khan',
      username: 'parent',
      password: 'admin123',
      email: 'arshad.khan@gmail.com',
      description: 'Guardian portal to monitor children attendance, dues and results.',
      icon: '👨‍👩‍👧',
      badgeColor: 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200 dark:border-orange-800',
      permissions: ['Children Academic Progress', 'Monthly Fee Challans & Receipts', 'Daily Attendance Tracking', 'School Announcements & Events']
    },
    {
      role: 'Student',
      name: 'Hamza Arshad Khan',
      username: 'student',
      password: 'admin123',
      email: 'hamza.khan@student.iqra.edu.pk',
      description: 'Enrolled in Class 10 (Science), Roll No: 101.',
      icon: '🎒',
      badgeColor: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
      permissions: ['Personal Weekly Timetable', 'Homework & Assignments', 'Exam Result Transcripts', 'Digital Student ID Card']
    }
  ];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleSwitch = (role: UserRole) => {
    switchRole(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-4xl rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/40">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                System Login Credentials & RBAC Roles
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-medium">
                  8 Personas Active
                </span>
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Default credentials for testing in development, XAMPP, and local MySQL deployments
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Global Quick Info Banner */}
        <div className="px-6 py-3 bg-blue-50/70 border-b border-blue-100 dark:bg-blue-950/30 dark:border-blue-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-blue-900 dark:text-blue-200">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
            <span>
              <strong>Global Default Password:</strong> All accounts use <code className="bg-white dark:bg-neutral-900 px-1.5 py-0.5 rounded-sm font-mono font-bold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">admin123</code>. You can click <strong>Switch Persona</strong> for instant 1-click preview without re-typing.
            </span>
          </div>
          <button
            onClick={() => handleCopy('admin123', 'global-pass')}
            className="flex items-center gap-1 font-semibold text-blue-700 dark:text-blue-300 hover:underline cursor-pointer shrink-0"
          >
            {copiedKey === 'global-pass' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            Copy Global Password
          </button>
        </div>

        {/* Credentials Grid */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {credentialsList.map((item) => {
              const isActive = currentUser.role === item.role;
              return (
                <div
                  key={item.role}
                  className={`rounded-xl border p-4 transition-all ${
                    isActive
                      ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-500/50 dark:bg-blue-950/20 dark:border-blue-600'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white dark:border-neutral-800 dark:bg-neutral-900/70 dark:hover:border-neutral-700'
                  }`}
                >
                  {/* Persona Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                            {item.role}
                          </h3>
                          {isActive && (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white px-1.5 py-0.5 rounded-sm">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                          {item.name}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSwitch(item.role)}
                      disabled={isActive}
                      className={`text-xs px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-neutral-200 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-500 cursor-default'
                          : 'bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 shadow-xs'
                      }`}
                    >
                      {isActive ? 'Active' : 'Switch'}
                      {!isActive && <ArrowRight className="h-3 w-3" />}
                    </button>
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-1">
                    {item.description}
                  </p>

                  {/* Credentials Box */}
                  <div className="bg-neutral-50 dark:bg-neutral-800/80 rounded-lg p-2.5 space-y-1.5 text-xs font-mono border border-neutral-200/80 dark:border-neutral-700/80 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500 font-sans">Username:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-900 px-1.5 py-0.5 rounded-sm border border-neutral-200 dark:border-neutral-700">
                          {item.username}
                        </span>
                        <button
                          onClick={() => handleCopy(item.username, `user-${item.role}`)}
                          className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
                          title="Copy username"
                        >
                          {copiedKey === `user-${item.role}` ? (
                            <Check className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500 font-sans">Password:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-900 px-1.5 py-0.5 rounded-sm border border-neutral-200 dark:border-neutral-700">
                          {item.password}
                        </span>
                        <button
                          onClick={() => handleCopy(item.password, `pass-${item.role}`)}
                          className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
                          title="Copy password"
                        >
                          {copiedKey === `pass-${item.role}` ? (
                            <Check className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Capabilities List */}
                  <div className="flex flex-wrap gap-1">
                    {item.permissions.slice(0, 3).map((perm, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 px-2 py-0.5 rounded-md"
                      >
                        ✓ {perm}
                      </span>
                    ))}
                    {item.permissions.length > 3 && (
                      <span className="text-[10px] text-neutral-400 px-1 py-0.5">
                        +{item.permissions.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-200 px-6 py-3.5 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 flex items-center justify-between text-xs text-neutral-500">
          <span>School: <strong className="text-neutral-800 dark:text-neutral-200">{settings.schoolName}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-200 hover:bg-neutral-300 font-semibold text-neutral-800 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-100 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
