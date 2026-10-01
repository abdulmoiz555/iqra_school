import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, UserRole } from '../../types';
import {
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Edit,
  KeyRound,
  Check,
  X,
  AlertTriangle,
  Lock,
  UserPlus,
  RefreshCw,
  Search,
  Eye,
  EyeOff,
  Sparkles,
  Layers,
  CalendarCheck,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

export const RolesPermissionsView: React.FC = () => {
  const {
    currentUser,
    users,
    updateUser,
    permissions,
    updatePermission,
    teachers,
    updateTeacher,
    classes,
    settings,
    updateSettings,
  } = useApp();

  const [searchUser, setSearchUser] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState<UserRole>('Teacher');
  const [editPassword, setEditPassword] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Principal (Super Admin) & Academic Admin authorization check
  const isSuperAdmin = currentUser.role === 'Super Admin';
  const isAdmin = currentUser.role === 'Admin';
  const isAuthorized = isSuperAdmin || isAdmin;

  const handleOpenEditUser = (user: User) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditUsername(user.username);
    setEditEmail(user.email || '');
    setEditRole(user.role);
    setEditPassword(user.password || '');
    setEditAvatar(user.avatar || '');
    setShowPassword(false);
  };

  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
    let res = '';
    for (let i = 0; i < 14; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setEditPassword(`Iqra#${res}!`);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    if (!editName.trim() || !editUsername.trim()) return;

    updateUser(editingUser.id, {
      name: editName.trim(),
      username: editUsername.trim(),
      email: editEmail.trim(),
      role: editRole,
      password: editPassword.trim(),
      avatar: editAvatar.trim() || undefined,
    });

    setSaveSuccessMsg(`Successfully updated user profile & credentials for "${editName}"`);
    setTimeout(() => setSaveSuccessMsg(''), 4000);
    setEditingUser(null);
  };

  const filteredUsers = users.filter((u) => {
    const q = searchUser.toLowerCase().trim();
    if (!q) return true;
    return (
      u.name.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q) ||
      (u.email && u.email.toLowerCase().includes(q))
    );
  });

  if (!isAuthorized) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-8 text-center dark:border-rose-900/60 dark:bg-rose-950/20 max-w-xl mx-auto my-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400 mb-4">
          <Lock className="h-7 w-7" />
        </div>
        <h3 className="text-lg font-bold text-rose-900 dark:text-rose-200 mb-1">
          Restricted Access: Leadership Authority Only
        </h3>
        <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed mb-4">
          The <strong>Roles & Permissions and Credentials Governance Center</strong> is strictly restricted to <strong>Sir Imran (Principal)</strong> and <strong>Academic & Admissions Administration</strong>. Switch your active role from the top-right profile menu to manage permissions and restrict content.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner: Principal & Academic Admin Security Authority */}
      <div className="rounded-2xl border border-blue-200 bg-linear-to-r from-blue-900 via-indigo-900 to-neutral-900 p-5 md:p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 shadow-md shrink-0">
              <ShieldAlert className="h-9 w-9 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-sm bg-amber-400 text-neutral-950 text-[10px] font-black uppercase tracking-wider">
                  INSTITUTIONAL GOVERNANCE
                </span>
                <span className="text-xs text-neutral-300 font-mono">
                  Principal (Sir Imran) & Academic Admin Control
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-white mt-0.5">
                Responsibilities, Access Control & Content Restrictions
              </h2>
              <p className="text-xs text-neutral-300 mt-1 max-w-2xl leading-relaxed">
                Empowered to restrict what teachers, students, and parents see, configure class assignments, govern strong credentials, and audit all system operations of {settings.schoolName}.
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15 text-xs space-y-1 shrink-0 font-mono">
            <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-sans font-bold">
              Active Executive Credentials
            </div>
            <div>
              <span className="text-neutral-300">Principal:</span> <strong className="text-amber-300">{settings.principalName || 'Sir Imran'}</strong>
            </div>
            <div>
              <span className="text-neutral-300">Authority:</span> <strong className="text-emerald-400">{currentUser.name} ({currentUser.role})</strong>
            </div>
            <div>
              <span className="text-neutral-300">Official Email:</span> <strong>{settings.email || 'iqra.gk1994@gmail.com'}</strong>
            </div>
          </div>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <Check className="h-4 w-4 text-emerald-600" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* NEW PROMINENT SECTION: Campus Privacy & Content Visibility Restrictions */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
        <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Campus Privacy & Content Visibility Control Center
            </h3>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Configure exactly what data and metrics are visible or hidden from teachers, students, parents, and general staff.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Toggle 1: Restrict Teacher to Assigned Classes */}
          <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70 dark:border-neutral-800 dark:bg-neutral-800/40 flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-neutral-900 dark:text-neutral-100">
                  Restrict Teachers to Relevant Assigned Classes Only
                </span>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                  Protected
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                When enabled, teachers will only see their designated class sections, their own student rosters, timetable periods, and exam marks. Whole-school directories are hidden.
              </p>
            </div>
            <button
              onClick={() => {
                const nextVal = !(settings.restrictTeacherToAssignedClasses ?? true);
                updateSettings({ restrictTeacherToAssignedClasses: nextVal });
                setSaveSuccessMsg(nextVal ? 'Enabled: Teachers now strictly restricted to their assigned classes & students.' : 'Disabled: Teachers can view general campus classes.');
                setTimeout(() => setSaveSuccessMsg(''), 3500);
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                (settings.restrictTeacherToAssignedClasses ?? true) ? 'bg-blue-600' : 'bg-neutral-300 dark:bg-neutral-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  (settings.restrictTeacherToAssignedClasses ?? true) ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Toggle 2: Hide Financial Revenue & Fee Collections */}
          <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70 dark:border-neutral-800 dark:bg-neutral-800/40 flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-neutral-900 dark:text-neutral-100">
                  Hide Fees Collection & Campus Finances from Non-Admins
                </span>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Confidential
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                Protects institutional accounts. Hides fee revenue, campus operational expenses, and bursar metrics from teachers, students, and parents.
              </p>
            </div>
            <button
              onClick={() => {
                const nextVal = !(settings.hideFinancialsFromNonAdmins ?? true);
                updateSettings({ hideFinancialsFromNonAdmins: nextVal });
                setSaveSuccessMsg(nextVal ? 'Enabled: Fees and campus revenue charts hidden from teachers and general users.' : 'Disabled: Financial charts visible.');
                setTimeout(() => setSaveSuccessMsg(''), 3500);
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                (settings.hideFinancialsFromNonAdmins ?? true) ? 'bg-emerald-600' : 'bg-neutral-300 dark:bg-neutral-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  (settings.hideFinancialsFromNonAdmins ?? true) ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Toggle 3: Hide School-wide Enrolment Totals */}
          <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70 dark:border-neutral-800 dark:bg-neutral-800/40 flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-neutral-900 dark:text-neutral-100">
                  Hide Whole-School Enrolment Totals from Non-Admins
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                Only Sir Imran (Principal) and Academic Administration can see campus-wide student aggregate counts and total numbers.
              </p>
            </div>
            <button
              onClick={() => {
                const nextVal = !(settings.hideEnrollmentTotalsFromNonAdmins ?? true);
                updateSettings({ hideEnrollmentTotalsFromNonAdmins: nextVal });
                setSaveSuccessMsg(nextVal ? 'Enabled: Total enrolment count hidden from non-admin roles.' : 'Disabled: Total enrolment visible to all.');
                setTimeout(() => setSaveSuccessMsg(''), 3500);
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                (settings.hideEnrollmentTotalsFromNonAdmins ?? true) ? 'bg-blue-600' : 'bg-neutral-300 dark:bg-neutral-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  (settings.hideEnrollmentTotalsFromNonAdmins ?? true) ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Toggle 4: Restrict Audit Logs to Leadership */}
          <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70 dark:border-neutral-800 dark:bg-neutral-800/40 flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-neutral-900 dark:text-neutral-100">
                  Restrict System Audit Logs to Principal & Academic Admin
                </span>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  Root Audit
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                Completely restricts system operation histories, login logs, and modification audits to Sir Imran (Principal) and Academic Admin.
              </p>
            </div>
            <button
              onClick={() => {
                const nextVal = !(settings.restrictLogsToAdminsAndPrincipal ?? true);
                updateSettings({ restrictLogsToAdminsAndPrincipal: nextVal });
                setSaveSuccessMsg(nextVal ? 'Enabled: Audit logs strictly restricted to Principal and Academic Admin.' : 'Disabled: Audit logs accessible.');
                setTimeout(() => setSaveSuccessMsg(''), 3500);
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                (settings.restrictLogsToAdminsAndPrincipal ?? true) ? 'bg-amber-600' : 'bg-neutral-300 dark:bg-neutral-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  (settings.restrictLogsToAdminsAndPrincipal ?? true) ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Section 1: User Accounts & Edit Names/Passwords */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 dark:border-neutral-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-blue-600" />
              User Accounts & Strong Passwords Management
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Edit user full names, change usernames, and assign strong security passwords for all roles
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
            <input
              type="text"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              placeholder="Search user, name, role..."
              className="w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-8 pr-3 py-1.5 text-xs text-neutral-900 focus:border-blue-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 dark:bg-neutral-800/60 dark:border-neutral-800 dark:text-neutral-300 font-semibold">
              <tr>
                <th className="py-2.5 px-3">User / Full Name</th>
                <th className="py-2.5 px-3">Username</th>
                <th className="py-2.5 px-3">Assigned Role</th>
                <th className="py-2.5 px-3">Official Email</th>
                <th className="py-2.5 px-3">Security Password</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Edit Account</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredUsers.map((u) => {
                const isSuper = u.role === 'Super Admin';
                return (
                  <tr key={u.id} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40">
                    <td className="py-2.5 px-3 font-semibold text-neutral-900 dark:text-neutral-100">
                      <div className="flex items-center gap-2">
                        {u.avatar ? (
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="h-7 w-7 rounded-full object-cover border border-neutral-300 dark:border-neutral-700 shadow-2xs"
                          />
                        ) : isSuper ? (
                          <div className="h-7 w-7 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-sm shadow-2xs border border-amber-300">
                            👑
                          </div>
                        ) : (
                          <div className="h-7 w-7 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px] shadow-2xs">
                            {u.name.charAt(0)}
                          </div>
                        )}
                        <span>{u.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-neutral-700 dark:text-neutral-300">
                      {u.username}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold ${
                        isSuper
                          ? 'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                          : u.role === 'Admin'
                          ? 'bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300'
                          : u.role === 'Teacher'
                          ? 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-neutral-500 font-mono">
                      {u.email || '—'}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-medium text-emerald-700 dark:text-emerald-400">
                      {u.password ? '••••••••' : 'Default'}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        Active
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => handleOpenEditUser(u)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-blue-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 cursor-pointer shadow-2xs transition-colors"
                      >
                        <Edit className="h-3.5 w-3.5 text-blue-600" />
                        <span>Edit Name & Password</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Attendance Access Exclusivity Policy */}
      <div className="rounded-2xl border border-amber-300/80 bg-amber-50/60 p-5 dark:border-amber-700/60 dark:bg-amber-950/20 space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 shrink-0">
            <CalendarCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-950 dark:text-amber-200">
              Attendance Access Control Protocol
            </h3>
            <p className="text-xs text-amber-900/80 dark:text-amber-300 leading-relaxed mt-0.5">
              Per Institutional Governance Directive: Daily student and faculty attendance marking permissions are <strong>solely configured by Super Admin (Sir Imran) and Academic Admin</strong>, and <strong>granted strictly to designated Class Teachers</strong>. Subject teachers and non-incharge faculty are prohibited from modifying roll calls.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-amber-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900 overflow-x-auto">
          <div className="text-[11px] font-bold text-neutral-800 dark:text-neutral-200 mb-2 px-1">
            Class Teachers Attendance Authorization Registry:
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-semibold border-b border-neutral-200 dark:border-neutral-700">
              <tr>
                <th className="py-2 px-3">Teacher Name</th>
                <th className="py-2 px-3">Designation</th>
                <th className="py-2 px-3">Incharge Status</th>
                <th className="py-2 px-3">Assigned Class</th>
                <th className="py-2 px-3">Attendance Access</th>
                <th className="py-2 px-3 text-right">Authorize / Revoke</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {teachers.map((tch) => {
                const assignedCls = classes.find((c) => c.id === tch.assignedClassId);
                return (
                  <tr key={tch.id}>
                    <td className="py-2 px-3 font-semibold text-neutral-900 dark:text-neutral-100">
                      {tch.name}
                    </td>
                    <td className="py-2 px-3 text-neutral-500">
                      {tch.designation}
                    </td>
                    <td className="py-2 px-3">
                      {tch.isClassTeacher ? (
                        <span className="px-2 py-0.5 rounded-sm bg-blue-100 text-blue-800 text-[10px] font-bold dark:bg-blue-950 dark:text-blue-300">
                          Class Incharge
                        </span>
                      ) : (
                        <span className="text-neutral-400 text-[11px]">Subject Teacher</span>
                      )}
                    </td>
                    <td className="py-2 px-3 font-mono font-medium">
                      {assignedCls?.name || 'Unassigned'}
                    </td>
                    <td className="py-2 px-3">
                      {tch.canMarkAttendance ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold text-[11px]">
                          <ShieldCheck className="h-3.5 w-3.5" /> Granted
                        </span>
                      ) : (
                        <span className="text-rose-600 dark:text-rose-400 font-medium text-[11px]">
                          Restricted
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-right">
                      <button
                        onClick={() => {
                          const nextState = !tch.canMarkAttendance;
                          updateTeacher(tch.id, {
                            canMarkAttendance: nextState,
                            isClassTeacher: nextState ? true : tch.isClassTeacher,
                          });
                          setSaveSuccessMsg(`Updated attendance marking permission for ${tch.name}`);
                          setTimeout(() => setSaveSuccessMsg(''), 3000);
                        }}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-colors ${
                          tch.canMarkAttendance
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-300'
                            : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300'
                        }`}
                      >
                        {tch.canMarkAttendance ? 'Revoke Access' : 'Grant Attendance Access'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: System-Wide Module Permissions Matrix */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Layers className="h-4 w-4 text-indigo-600" />
            Institutional RBAC Matrix (Super Admin Controlled)
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Configure system module visibility and write privileges by role. Click checkboxes to toggle.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-neutral-200 dark:border-neutral-800">
            <thead className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 font-bold border-b border-neutral-200 dark:border-neutral-700">
              <tr>
                <th className="py-2.5 px-3 w-56">Module Name</th>
                <th className="py-2.5 px-2 text-center text-amber-700 dark:text-amber-400">Super Admin (Sir Imran)</th>
                <th className="py-2.5 px-2 text-center">Admin</th>
                <th className="py-2.5 px-2 text-center text-blue-700 dark:text-blue-300">Class Teacher</th>
                <th className="py-2.5 px-2 text-center">Subject Teacher</th>
                <th className="py-2.5 px-2 text-center">Accountant</th>
                <th className="py-2.5 px-2 text-center">Librarian</th>
                <th className="py-2.5 px-2 text-center">Receptionist</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {permissions.map((p) => {
                return (
                  <tr key={p.moduleId} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-neutral-900 dark:text-neutral-100">
                        {p.moduleName}
                      </div>
                      <div className="text-[10px] text-neutral-500 max-w-xs">
                        {p.description}
                      </div>
                    </td>

                    {/* Super Admin: Always locked ON */}
                    <td className="py-2.5 px-2 text-center">
                      <input
                        type="checkbox"
                        checked={true}
                        disabled
                        className="rounded text-amber-600 cursor-not-allowed opacity-80"
                        title="Super Admin has perpetual root authority"
                      />
                    </td>

                    {/* Admin */}
                    <td className="py-2.5 px-2 text-center">
                      <input
                        type="checkbox"
                        checked={p.admin}
                        onChange={(e) => updatePermission(p.moduleId, { admin: e.target.checked })}
                        className="rounded text-purple-600 cursor-pointer"
                      />
                    </td>

                    {/* Class Teacher */}
                    <td className="py-2.5 px-2 text-center bg-blue-50/40 dark:bg-blue-950/20">
                      <input
                        type="checkbox"
                        checked={p.classTeacher}
                        onChange={(e) => updatePermission(p.moduleId, { classTeacher: e.target.checked })}
                        className="rounded text-blue-600 cursor-pointer"
                      />
                    </td>

                    {/* Subject Teacher */}
                    <td className="py-2.5 px-2 text-center">
                      <input
                        type="checkbox"
                        checked={p.subjectTeacher}
                        onChange={(e) => updatePermission(p.moduleId, { subjectTeacher: e.target.checked })}
                        className="rounded text-neutral-600 cursor-pointer"
                      />
                    </td>

                    {/* Accountant */}
                    <td className="py-2.5 px-2 text-center">
                      <input
                        type="checkbox"
                        checked={p.accountant}
                        onChange={(e) => updatePermission(p.moduleId, { accountant: e.target.checked })}
                        className="rounded text-emerald-600 cursor-pointer"
                      />
                    </td>

                    {/* Librarian */}
                    <td className="py-2.5 px-2 text-center">
                      <input
                        type="checkbox"
                        checked={p.librarian}
                        onChange={(e) => updatePermission(p.moduleId, { librarian: e.target.checked })}
                        className="rounded text-neutral-600 cursor-pointer"
                      />
                    </td>

                    {/* Receptionist */}
                    <td className="py-2.5 px-2 text-center">
                      <input
                        type="checkbox"
                        checked={p.receptionist}
                        onChange={(e) => updatePermission(p.moduleId, { receptionist: e.target.checked })}
                        className="rounded text-neutral-600 cursor-pointer"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Edit className="h-4 w-4 text-blue-600" />
                Edit User Profile & Credentials
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Full User Name *
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Sir Imran or Engr. Zafar Iqbal"
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 font-semibold focus:border-blue-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Username (Login ID) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-mono text-neutral-900 focus:border-blue-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    System Role
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as UserRole)}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 focus:border-blue-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Admin">Admin</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Accountant">Accountant</option>
                    <option value="Librarian">Librarian</option>
                    <option value="Receptionist">Receptionist</option>
                    <option value="Parent">Parent</option>
                    <option value="Student">Student</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Official Email
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="iqra.gk1994@gmail.com"
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-mono text-neutral-900 focus:border-blue-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>

              {/* User Profile Picture Section */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  System User Profile Picture
                </label>
                <div className="flex items-center gap-3">
                  {editAvatar ? (
                    <img
                      src={editAvatar}
                      alt="Avatar Preview"
                      className="h-11 w-11 rounded-full object-cover border-2 border-blue-500 shadow-xs shrink-0"
                    />
                  ) : (
                    <div className="h-11 w-11 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 flex items-center justify-center font-bold text-xs shrink-0">
                      {editName ? editName.slice(0, 2).toUpperCase() : 'US'}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editAvatar}
                        onChange={(e) => setEditAvatar(e.target.value)}
                        placeholder="Image URL or choose file below..."
                        className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-900 focus:border-blue-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                      />
                      <label className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-neutral-300 bg-white text-[11px] font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 cursor-pointer shrink-0">
                        <Upload className="h-3 w-3 text-blue-600" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                if (event.target?.result) {
                                  setEditAvatar(event.target.result as string);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5 text-[10px]">
                      <span className="text-neutral-400">Presets:</span>
                      <button
                        type="button"
                        onClick={() => setEditAvatar('/student_demo_avatar_1790626593325.jpg')}
                        className="text-blue-600 hover:underline cursor-pointer font-medium"
                      >
                        Avatar 1
                      </button>
                      <span className="text-neutral-300">·</span>
                      <button
                        type="button"
                        onClick={() => setEditAvatar('/award_1.jpg')}
                        className="text-blue-600 hover:underline cursor-pointer font-medium"
                      >
                        Photo A
                      </button>
                      <span className="text-neutral-300">·</span>
                      <button
                        type="button"
                        onClick={() => setEditAvatar('/award_2.jpg')}
                        className="text-blue-600 hover:underline cursor-pointer font-medium"
                      >
                        Photo B
                      </button>
                      {editAvatar && (
                        <>
                          <span className="text-neutral-300">·</span>
                          <button
                            type="button"
                            onClick={() => setEditAvatar('')}
                            className="text-rose-600 hover:underline cursor-pointer font-medium"
                          >
                            Remove
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Strong Security Password *
                  </label>
                  <button
                    type="button"
                    onClick={generateStrongPassword}
                    className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="h-3 w-3" />
                    Generate Strong
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 pr-10 text-xs font-mono font-bold text-neutral-900 focus:border-blue-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-neutral-400 mt-1">
                  Strong passwords should include uppercase, numbers, and special symbols (e.g. SirImran@Iqra2026!).
                </p>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="rounded-lg border border-neutral-300 px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-xs cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
