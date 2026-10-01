import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TimetableSlot } from '../../types';
import { Clock, Plus, Trash2, Printer, X, BookOpen } from 'lucide-react';

export const TimetableView: React.FC = () => {
  const { timetable, addTimetableSlot, deleteTimetableSlot, classes, sections, subjects, teachers, currentUser, settings } = useApp();

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[classes.length - 1]?.id || classes[0]?.id || '');
  const [selectedSectionId, setSelectedSectionId] = useState<string>(sections[0]?.id || '');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newSlot, setNewSlot] = useState({
    day: 'Monday' as TimetableSlot['day'],
    startTime: '08:30',
    endTime: '09:15',
    subjectId: subjects[0]?.id || '',
    teacherId: teachers[0]?.id || '',
    roomNumber: 'Room 301',
  });

  const days: TimetableSlot['day'][] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const filteredSlots = timetable.filter(
    (t) => t.classId === selectedClassId
  );

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    addTimetableSlot({
      ...newSlot,
      classId: selectedClassId,
      sectionId: selectedSectionId,
    });
    setIsAddModalOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const selectedClass = classes.find((c) => c.id === selectedClassId);
  const selectedSection = sections.find((s) => s.id === selectedSectionId);

  const canManage = ['Super Admin', 'Admin', 'Teacher'].includes(currentUser.role);

  return (
    <div className="space-y-4 relative">
      {/* Official School Watermark for Printable Schedule */}
      {settings.logoUrl && (
        <img
          src={settings.logoUrl}
          alt="Watermark"
          className="hidden print:block fixed inset-0 m-auto w-96 h-96 object-contain opacity-10 pointer-events-none select-none z-0"
        />
      )}
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Select Class:</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-900 font-medium dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Select Section:</label>
            <select
              value={selectedSectionId}
              onChange={(e) => setSelectedSectionId(e.target.value)}
              className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-900 font-medium dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            >
              {sections.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" />
            Print Timetable
          </button>
          {canManage && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Class Slot
            </button>
          )}
        </div>
      </div>

      {/* Printable Schedule Header banner */}
      <div className="text-center py-2 border-b border-neutral-200 dark:border-neutral-800">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
          Weekly Academic Schedule: {selectedClass?.name} ({selectedSection?.name})
        </h3>
        <p className="text-[11px] text-neutral-500 font-mono">
          Campus Timing: 08:00 AM – 02:00 PM · Session: {settings.activeSession}
        </p>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {days.map((day) => {
          const daySlots = filteredSlots
            .filter((s) => s.day === day)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

          return (
            <div
              key={day}
              className="rounded-xl border border-neutral-200 bg-white p-3.5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  {day}
                </span>
                <span className="text-[10px] font-mono text-neutral-400">
                  {daySlots.length} periods
                </span>
              </div>

              <div className="space-y-2">
                {daySlots.length === 0 ? (
                  <p className="py-4 text-center text-xs text-neutral-400 italic">No periods scheduled.</p>
                ) : (
                  daySlots.map((slot) => {
                    const sub = subjects.find((s) => s.id === slot.subjectId);
                    const tch = teachers.find((t) => t.id === slot.teacherId);

                    return (
                      <div
                        key={slot.id}
                        className="rounded-lg border border-neutral-100 bg-neutral-50/70 p-2.5 dark:border-neutral-800 dark:bg-neutral-800/40 relative group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-neutral-900 dark:text-neutral-100">
                            {sub?.name || 'Subject'}
                          </span>
                          <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                            {slot.startTime} – {slot.endTime}
                          </span>
                        </div>

                        <div className="mt-1 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
                          <span>{tch?.name || 'Teacher'}</span>
                          <span className="font-mono text-neutral-400">{slot.roomNumber}</span>
                        </div>

                        {canManage && (
                          <button
                            onClick={() => deleteTimetableSlot(slot.id)}
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-rose-500 p-1 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xs transition-opacity cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Slot Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">Add Schedule Slot</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-neutral-400 hover:bg-neutral-100 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddSlot} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-medium mb-1">Day of the Week</label>
                <select
                  value={newSlot.day}
                  onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value as any })}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                >
                  {days.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Start Time</label>
                  <input
                    type="time"
                    value={newSlot.startTime}
                    onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">End Time</label>
                  <input
                    type="time"
                    value={newSlot.endTime}
                    onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">Subject</label>
                <select
                  value={newSlot.subjectId}
                  onChange={(e) => setNewSlot({ ...newSlot, subjectId: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Teacher</label>
                <select
                  value={newSlot.teacherId}
                  onChange={(e) => setNewSlot({ ...newSlot, teacherId: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Room / Lab</label>
                <input
                  type="text"
                  value={newSlot.roomNumber}
                  onChange={(e) => setNewSlot({ ...newSlot, roomNumber: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                />
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  Save Period
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
