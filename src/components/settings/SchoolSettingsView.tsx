import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Save,
  Shield,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  Clock,
  Building,
  DollarSign,
  AlertCircle,
  Calendar,
  Plus,
  Check,
  Percent,
  X,
  Sun,
  Moon
} from 'lucide-react';

export const SchoolSettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    auditLogs,
    sessions,
    setActiveSession,
    addSession,
    currentUser,
    darkMode,
    setDarkMode,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'settings' | 'audit'>('settings');
  const [formData, setFormData] = useState(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New Session Modal State
  const [isAddSessionModalOpen, setIsAddSessionModalOpen] = useState(false);
  const [newSessName, setNewSessName] = useState('');
  const [newSessStart, setNewSessStart] = useState('');
  const [newSessEnd, setNewSessEnd] = useState('');
  const [newSessIsActive, setNewSessIsActive] = useState(false);

  const canManageSessions = ['Super Admin', 'Admin', 'Academic Admin'].includes(currentUser.role);
  const canViewAuditLogs = ['Super Admin', 'Admin', 'Academic Admin'].includes(currentUser.role);

  const handleAddNewSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessName.trim()) return;
    addSession({
      name: newSessName.trim(),
      startDate: newSessStart || `${newSessName.slice(0, 4)}-04-01`,
      endDate: newSessEnd || `${newSessName.slice(-4)}-03-31`,
      isActive: newSessIsActive,
    });
    setNewSessName('');
    setNewSessStart('');
    setNewSessEnd('');
    setNewSessIsActive(false);
    setIsAddSessionModalOpen(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            School Configuration & System Logs
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Manage school identity, currency, theme, academic sessions, and audit logs
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-white text-blue-600 font-bold shadow-xs dark:bg-neutral-900 dark:text-blue-400'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400'
            }`}
          >
            School Settings & Profiles
          </button>
          {canViewAuditLogs && (
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'audit'
                  ? 'bg-white text-blue-600 font-bold shadow-xs dark:bg-neutral-900 dark:text-blue-400'
                  : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400'
              }`}
            >
              Audit Logs ({auditLogs.length})
            </button>
          )}
        </div>
      </div>

      {/* Tab 1: School Settings */}
      {activeTab === 'settings' && (
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
          <form onSubmit={handleSave} className="space-y-5 text-xs">
            {savedSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded-lg flex items-center gap-2 font-semibold">
                <CheckCircle className="h-4 w-4" /> School profile and configurations updated!
              </div>
            )}

            {/* School Profile */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-1.5">
                <Building className="h-4 w-4" /> Institutional Identity
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">School Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Motto / Tagline</label>
                  <input
                    type="text"
                    value={formData.schoolMotto}
                    onChange={(e) => setFormData({ ...formData, schoolMotto: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Registration #</label>
                  <input
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Principal Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.principalName}
                    onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
              </div>
            </div>

            {/* Contacts & Location */}
            <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3">
                Communication & Campus Address
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium mb-1">Official Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Website</label>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
                <div className="sm:col-span-2">
                  <label className="block font-medium mb-1">Street Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
              </div>
            </div>

            {/* System Appearance & Theme Mode */}
            <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-1.5">
                <Sun className="h-4 w-4" /> System Theme & Display Mode
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mb-3">
                Switch between Light theme and Dark theme across the complete school management system.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
                <button
                  type="button"
                  onClick={() => setDarkMode(false)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    !darkMode
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold dark:border-blue-400'
                      : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                    <Sun className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Light Theme</div>
                    <div className="text-[10px] text-neutral-500">Standard crisp high-contrast day theme</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDarkMode(true)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    darkMode
                      ? 'border-blue-500 bg-blue-950/40 text-blue-300 font-bold'
                      : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-neutral-800 text-neutral-200">
                    <Moon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Dark Theme</div>
                    <div className="text-[10px] text-neutral-400">Eye-friendly deep dark mode</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Financial & Regional Defaults */}
            <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-1.5">
                <DollarSign className="h-4 w-4" /> Localization & Financial Defaults
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-medium mb-1">Currency Code</label>
                  <input
                    type="text"
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Currency Symbol</label>
                  <input
                    type="text"
                    value={formData.currencySymbol}
                    onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Date Format</label>
                  <input
                    type="text"
                    value={formData.dateFormat}
                    onChange={(e) => setFormData({ ...formData, dateFormat: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Timezone</label>
                  <input
                    type="text"
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
              </div>
            </div>

            {/* Sibling Fee Concession Settings (Configurable: 1st 100%, 2nd 50%, 3rd Free) */}
            <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <Percent className="h-4 w-4" /> Sibling Fee Concession Rules (Editable)
                </h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-full">
                  1st: {formData.siblingFirstChildPayPercent ?? 100}% Pay · 2nd: {formData.siblingSecondChildPayPercent ?? 50}% Pay · 3rd+: {formData.siblingThirdChildPayPercent ?? 0}% (Free)
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mb-3">
                Configure exact payment percentages for multiple enrolled siblings from the same family. Automatically calculated during fee collection and voucher generation.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/40 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-neutral-800 dark:text-neutral-200">1st Sibling Fee Pay %</label>
                    <span className="text-[10px] text-neutral-500 font-mono">Elder child</span>
                  </div>
                  <div className="relative mt-1">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={formData.siblingFirstChildPayPercent ?? 100}
                      onChange={(e) => setFormData({ ...formData, siblingFirstChildPayPercent: Number(e.target.value) })}
                      className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-1.5 font-bold font-mono text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">%</span>
                  </div>
                  <p className="text-[10px] text-neutral-500 mt-1.5">Default: 100% (No discount applied)</p>
                </div>

                <div className="rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-blue-900 dark:text-blue-200">2nd Sibling Fee Pay %</label>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono">2nd child</span>
                  </div>
                  <div className="relative mt-1">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={formData.siblingSecondChildPayPercent ?? 50}
                      onChange={(e) => setFormData({ ...formData, siblingSecondChildPayPercent: Number(e.target.value) })}
                      className="w-full rounded-lg border border-blue-300 bg-white px-3 py-1.5 font-bold font-mono text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">%</span>
                  </div>
                  <p className="text-[10px] text-blue-700 dark:text-blue-300 mt-1.5">
                    Default: 50% (50% concession discount)
                  </p>
                </div>

                <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-emerald-900 dark:text-emerald-200">3rd+ Sibling Fee Pay %</label>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">100% FREE</span>
                  </div>
                  <div className="relative mt-1">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={formData.siblingThirdChildPayPercent ?? 0}
                      onChange={(e) => setFormData({ ...formData, siblingThirdChildPayPercent: Number(e.target.value) })}
                      className="w-full rounded-lg border border-emerald-300 bg-white px-3 py-1.5 font-bold font-mono text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">%</span>
                  </div>
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-300 mt-1.5">
                    Default: 0% (100% Free Concession)
                  </p>
                </div>
              </div>
            </div>

            {/* Academic Sessions & Institutional Calendar */}
            <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" /> Academic Sessions & Calendar Years
                </h3>
                {canManageSessions && (
                  <button
                    type="button"
                    onClick={() => setIsAddSessionModalOpen(true)}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg text-xs font-semibold hover:bg-blue-100 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" /> + New Session
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {sessions.map((sess) => (
                  <div
                    key={sess.id}
                    className={`rounded-lg border p-3 flex flex-col justify-between transition-all ${
                      sess.isActive
                        ? 'border-blue-500 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-950/30'
                        : 'border-neutral-200 bg-neutral-50/40 dark:border-neutral-800 dark:bg-neutral-800/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-sm text-neutral-900 dark:text-neutral-100">
                        {sess.name}
                      </span>
                      {sess.isActive ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-100 dark:bg-blue-900/60 dark:text-blue-300 px-1.5 py-0.5 rounded-sm">
                          <Check className="h-3 w-3" /> ACTIVE
                        </span>
                      ) : canManageSessions ? (
                        <button
                          type="button"
                          onClick={() => setActiveSession(sess.id)}
                          className="text-[11px] text-neutral-600 hover:text-blue-600 font-semibold cursor-pointer underline"
                        >
                          Activate
                        </button>
                      ) : null}
                    </div>
                    <div className="text-[10px] text-neutral-500 font-mono mt-2">
                      {sess.startDate} to {sess.endDate}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700 shadow-xs cursor-pointer"
              >
                <Save className="h-4 w-4" /> Save Configuration
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                System Security & Transaction Audit Trail
              </h3>
              <p className="text-xs text-neutral-500">
                Detailed chronological log of administrative modifications, admissions, and financial collections
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:border-neutral-700">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">User</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Module</th>
                  <th className="py-2.5 px-3">Operation / Event</th>
                  <th className="py-2.5 px-3 font-mono">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40">
                    <td className="py-2.5 px-3 font-mono text-neutral-500 whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-2.5 px-3 font-semibold text-neutral-900 dark:text-neutral-100">{log.userName}</td>
                    <td className="py-2.5 px-3 text-neutral-500">{log.userRole}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-sm bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-mono text-[10px]">
                        {log.module}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-neutral-800 dark:text-neutral-200 font-medium">{log.action}</td>
                    <td className="py-2.5 px-3 font-mono text-neutral-400">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Session Modal */}
      {isAddSessionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800 mb-4">
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Add New Academic Session
              </h3>
              <button
                type="button"
                onClick={() => setIsAddSessionModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 rounded-lg p-1 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewSession} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium mb-1 text-neutral-700 dark:text-neutral-300">
                  Session Name / Academic Year *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2026-2027 or 2027-2028"
                  value={newSessName}
                  onChange={(e) => setNewSessName(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1 text-neutral-700 dark:text-neutral-300">
                    Commencement Date
                  </label>
                  <input
                    type="date"
                    value={newSessStart}
                    onChange={(e) => setNewSessStart(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1 text-neutral-700 dark:text-neutral-300">
                    Conclusion Date
                  </label>
                  <input
                    type="date"
                    value={newSessEnd}
                    onChange={(e) => setNewSessEnd(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newSessIsActive}
                    onChange={(e) => setNewSessIsActive(e.target.checked)}
                    className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Activate this session immediately for school operations</span>
                </label>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddSessionModalOpen(false)}
                  className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 cursor-pointer shadow-xs"
                >
                  Save & Apply Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
