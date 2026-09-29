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
  X
} from 'lucide-react';

export const SchoolSettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    auditLogs,
    resetToDefaultData,
    exportDatabaseJSON,
    importDatabaseJSON,
    sessions,
    setActiveSession,
    addSession,
    currentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'settings' | 'audit' | 'backup'>('settings');
  const [formData, setFormData] = useState(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // New Session Modal State
  const [isAddSessionModalOpen, setIsAddSessionModalOpen] = useState(false);
  const [newSessName, setNewSessName] = useState('');
  const [newSessStart, setNewSessStart] = useState('');
  const [newSessEnd, setNewSessEnd] = useState('');
  const [newSessIsActive, setNewSessIsActive] = useState(false);

  const canManageSessions = ['Super Admin', 'Admin'].includes(currentUser.role);

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

  const handleExport = () => {
    const jsonStr = exportDatabaseJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `school_management_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importDatabaseJSON(content);
      if (success) {
        setImportStatus('Database restored successfully from backup!');
      } else {
        setImportStatus('Invalid backup JSON format. Please verify the file.');
      }
      setTimeout(() => setImportStatus(null), 3000);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            School Configuration, System Logs & Database
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Manage school identity, currency, academic sessions, audit logs, and data backups
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
            School Settings
          </button>
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
          <button
            onClick={() => setActiveTab('backup')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'backup'
                ? 'bg-white text-blue-600 font-bold shadow-xs dark:bg-neutral-900 dark:text-blue-400'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400'
            }`}
          >
            Backup & Factory Reset
          </button>
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

      {/* Tab 3: Backup & Restore */}
      {activeTab === 'backup' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Export / Import Box */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Database Export & Snapshot Backup
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Export the entire relational database (students, teachers, fees, marks, attendance, settings) into a portable JSON snapshot.
            </p>

            {importStatus && (
              <div className="p-3 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-xs rounded-lg font-semibold flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4" /> {importStatus}
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleExport}
                className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-xs"
              >
                <Download className="h-4 w-4" /> Export Database Backup (JSON)
              </button>

              <label className="flex items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 cursor-pointer">
                <Upload className="h-4 w-4" /> Restore from File
                <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
              </label>
            </div>
          </div>

          {/* Reset Factory Seed Box */}
          <div className="rounded-xl border border-rose-200 bg-white p-5 shadow-xs dark:border-rose-950/60 dark:bg-neutral-900 space-y-4">
            <h3 className="text-sm font-bold text-rose-700 dark:text-rose-400 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" /> Factory Demo Reset
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Re-populate all 20 demo students, faculty members, classes, fee payments, examination marks, and attendance records back to the fresh initial seed state.
            </p>

            <div className="pt-2">
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to reset the database to the default demo seed data? All custom modifications will be re-initialized.')) {
                    resetToDefaultData();
                  }
                }}
                className="flex items-center gap-2 rounded-lg border border-rose-600 bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300 cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" /> Reset to Factory Sample Data
              </button>
            </div>
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
