import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  GraduationCap,
  Briefcase,
  BookOpen,
  CalendarCheck,
  CreditCard,
  Award,
  Library,
  Bus,
  Package,
  FileSpreadsheet,
  Megaphone,
  BarChart3,
  Settings,
  ChevronRight,
  ShieldAlert,
  Clock,
  Sun,
  Moon
} from 'lucide-react';
import { UserRole } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  allowedRoles: UserRole[];
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, currentUser, settings, students, feePayments, notices, parents, darkMode, setDarkMode } = useApp();

  const isParent = currentUser.role === 'Parent';
  const parentRecord = parents.find((p) => p.id === currentUser.linkedId || p.email === currentUser.email);
  const myChildren = students.filter((s) => parentRecord?.studentIds?.includes(s.id) || s.parentId === parentRecord?.id);

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      allowedRoles: ['Super Admin', 'Admin', 'Teacher', 'Accountant', 'Librarian', 'Receptionist'],
    },
    {
      id: 'students',
      label: currentUser.role === 'Student' ? 'My Profile' : isParent ? 'My Children' : 'Students',
      icon: GraduationCap,
      allowedRoles: ['Super Admin', 'Admin', 'Teacher', 'Accountant', 'Receptionist', 'Parent', 'Student'],
      badge: isParent ? `${myChildren.length}` : `${students.length}`,
    },
    {
      id: 'parents',
      label: 'Parents',
      icon: Users,
      allowedRoles: ['Super Admin', 'Admin', 'Receptionist'],
    },
    {
      id: 'teachers',
      label: 'Teachers',
      icon: UserCheck,
      allowedRoles: ['Super Admin', 'Admin'],
    },
    {
      id: 'staff',
      label: 'Staff Directory',
      icon: Briefcase,
      allowedRoles: ['Super Admin', 'Admin'],
    },
    {
      id: 'academics',
      label: 'Academics & Timetable',
      icon: BookOpen,
      allowedRoles: ['Super Admin', 'Admin', 'Teacher'],
    },
    {
      id: 'attendance',
      label: isParent ? "Child's Attendance" : currentUser.role === 'Student' ? 'My Attendance' : 'Attendance',
      icon: CalendarCheck,
      allowedRoles: ['Super Admin', 'Admin', 'Teacher', 'Parent', 'Student'],
    },
    {
      id: 'fees',
      label: isParent ? 'Remaining Fees & Dues' : currentUser.role === 'Student' ? 'My Remaining Fees' : 'Fees & Finance',
      icon: CreditCard,
      allowedRoles: ['Super Admin', 'Admin', 'Accountant', 'Receptionist', 'Parent', 'Student'],
      badge: isParent
        ? `${feePayments.filter((p) => myChildren.some((c) => c.id === p.studentId)).length}`
        : feePayments.length > 0 ? `${feePayments.length}` : undefined,
    },
    {
      id: 'examinations',
      label: isParent ? "Child's Exam Marks" : currentUser.role === 'Student' ? 'My Exam Marks' : 'Examinations & Marks',
      icon: Award,
      allowedRoles: ['Super Admin', 'Admin', 'Teacher', 'Parent', 'Student'],
    },
    {
      id: 'library',
      label: 'Library',
      icon: Library,
      allowedRoles: ['Super Admin', 'Admin', 'Librarian', 'Teacher'],
    },
    {
      id: 'transport',
      label: 'Transport',
      icon: Bus,
      allowedRoles: ['Super Admin', 'Admin', 'Receptionist'],
    },
    {
      id: 'inventory',
      label: 'Inventory & Stock',
      icon: Package,
      allowedRoles: ['Super Admin', 'Admin'],
    },
    {
      id: 'hr',
      label: 'HR & Payroll',
      icon: FileSpreadsheet,
      allowedRoles: ['Super Admin', 'Admin', 'Accountant'],
    },
    {
      id: 'communication',
      label: 'Notices & Messages',
      icon: Megaphone,
      allowedRoles: ['Super Admin', 'Admin', 'Teacher', 'Accountant', 'Librarian', 'Receptionist'],
      badge: `${notices.length}`,
    },
    {
      id: 'reports',
      label: 'Reports Hub',
      icon: BarChart3,
      allowedRoles: ['Super Admin', 'Admin', 'Accountant'],
    },
    {
      id: 'roles_permissions',
      label: 'Responsibilities & Access Control',
      icon: ShieldAlert,
      allowedRoles: ['Super Admin', 'Admin'],
      badge: 'Security',
    },
    {
      id: 'settings',
      label: 'School Settings & Logs',
      icon: Settings,
      allowedRoles: ['Super Admin', 'Admin'],
    },
  ];

  const visibleNav = navItems.filter((item) => item.allowedRoles.includes(currentUser.role));

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-neutral-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 border-r border-neutral-200 bg-white transition-transform duration-200 ease-in-out lg:translate-x-0 dark:border-neutral-800 dark:bg-neutral-900 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between`}
      >
        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Navigation Menu
          </div>

          {visibleNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onClose();
                }}
                className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-neutral-500 group-hover:text-neutral-800 dark:text-neutral-400 dark:group-hover:text-neutral-200'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-sm tabular-nums font-mono ${
                        isActive
                          ? 'bg-blue-700 text-white'
                          : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="h-3.5 w-3.5 text-blue-200" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer session info & theme switcher */}
        <div className="border-t border-neutral-200 p-3 dark:border-neutral-800 space-y-2">
          {/* Quick Light / Dark Mode Toggle */}
          <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-100/90 p-1 dark:border-neutral-700 dark:bg-neutral-800">
            <button
              type="button"
              onClick={() => setDarkMode(false)}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-md py-1 text-xs font-semibold transition-all cursor-pointer ${
                !darkMode
                  ? 'bg-white text-neutral-900 shadow-xs dark:bg-neutral-700 dark:text-neutral-100'
                  : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400'
              }`}
              title="Switch to Light Theme"
            >
              <Sun className={`h-3.5 w-3.5 ${!darkMode ? 'text-amber-500' : 'text-neutral-400'}`} />
              <span>Light</span>
            </button>
            <button
              type="button"
              onClick={() => setDarkMode(true)}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-md py-1 text-xs font-semibold transition-all cursor-pointer ${
                darkMode
                  ? 'bg-neutral-900 text-white shadow-xs dark:bg-neutral-950 dark:text-neutral-100'
                  : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400'
              }`}
              title="Switch to Dark Theme"
            >
              <Moon className={`h-3.5 w-3.5 ${darkMode ? 'text-indigo-400' : 'text-neutral-400'}`} />
              <span>Dark</span>
            </button>
          </div>

          <div className="rounded-lg bg-neutral-50 p-2.5 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-900 dark:text-neutral-100">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                Active Session
              </span>
              <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                {settings.activeSession}
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[10px] text-neutral-500 dark:text-neutral-400">
              <span>Currency: {settings.currency}</span>
              <span>v2.4 Enterprise</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
