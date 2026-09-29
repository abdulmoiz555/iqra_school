import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Notice, Message } from '../../types';
import { Megaphone, Plus, Mail, Send, Trash2, CheckCircle, FileText, X } from 'lucide-react';

export const NoticeBoardView: React.FC = () => {
  const {
    notices,
    addNotice,
    deleteNotice,
    messages,
    sendMessage,
    markMessageRead,
    currentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'notices' | 'messages'>('notices');
  const [selectedAudience, setSelectedAudience] = useState<string>('All');
  const [isAddNoticeOpen, setIsAddNoticeOpen] = useState(false);

  // New notice form
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeDesc, setNoticeDesc] = useState('');
  const [noticeAudience, setNoticeAudience] = useState<Notice['audience']>('All');
  const [noticeAttachment, setNoticeAttachment] = useState('');
  const [noticeImportant, setNoticeImportant] = useState(false);

  // Compose message form
  const [msgReceiver, setMsgReceiver] = useState('Super Administrator / Principal');
  const [msgSubject, setMsgSubject] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [msgSuccess, setMsgSuccess] = useState(false);

  const filteredNotices = notices.filter((n) => {
    if (selectedAudience === 'All') return true;
    return n.audience === selectedAudience || n.audience === 'All';
  });

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim()) return;
    addNotice({
      title: noticeTitle,
      description: noticeDesc,
      date: new Date().toISOString().slice(0, 10),
      audience: noticeAudience,
      attachmentName: noticeAttachment || undefined,
      postedBy: currentUser.name,
      isImportant: noticeImportant,
    });
    setNoticeTitle('');
    setNoticeDesc('');
    setNoticeAttachment('');
    setIsAddNoticeOpen(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgSubject.trim() || !msgBody.trim()) return;
    sendMessage({
      senderId: currentUser.id,
      senderName: `${currentUser.name} (${currentUser.role})`,
      receiverId: 'usr-admin',
      receiverName: msgReceiver,
      subject: msgSubject,
      body: msgBody,
    });
    setMsgSubject('');
    setMsgBody('');
    setMsgSuccess(true);
    setTimeout(() => setMsgSuccess(false), 2000);
  };

  const canPostNotice = ['Super Admin', 'Admin'].includes(currentUser.role);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Institutional Notices & Communication Dispatch
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Publish school circulars to parents, students and staff, and handle internal messages
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canPostNotice && (
            <button
              onClick={() => setIsAddNoticeOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Publish New Notice
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-xs">
        <button
          onClick={() => setActiveTab('notices')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'notices'
              ? 'bg-white text-blue-600 font-bold shadow-xs dark:bg-neutral-900 dark:text-blue-400'
              : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400'
          }`}
        >
          Notice Board ({notices.length})
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'messages'
              ? 'bg-white text-blue-600 font-bold shadow-xs dark:bg-neutral-900 dark:text-blue-400'
              : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400'
          }`}
        >
          Internal Messages ({messages.length})
        </button>
      </div>

      {/* Tab 1: Notices */}
      {activeTab === 'notices' && (
        <div className="space-y-4">
          {/* Audience Filter Pills */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-neutral-500">Filter Audience:</span>
            {['All', 'Students', 'Teachers', 'Parents', 'Staff'].map((aud) => (
              <button
                key={aud}
                onClick={() => setSelectedAudience(aud)}
                className={`px-2.5 py-1 rounded-md font-medium cursor-pointer ${
                  selectedAudience === aud
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400'
                }`}
              >
                {aud}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNotices.map((n) => (
              <div
                key={n.id}
                className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-sm">
                      Target: {n.audience}
                    </span>
                    {canPostNotice && (
                      <button
                        onClick={() => deleteNotice(n.id)}
                        className="text-neutral-400 hover:text-rose-600 p-0.5 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    {n.title}
                  </h3>
                  <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {n.description}
                  </p>

                  {n.attachmentName && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-mono">
                      <FileText className="h-3.5 w-3.5" />
                      <span>{n.attachmentName}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                  <span>Issued: {n.date}</span>
                  <span>By: {n.postedBy}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Internal Messages */}
      {activeTab === 'messages' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inbox List */}
          <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-3">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 pb-2 border-b border-neutral-100 dark:border-neutral-800">
              Communication Messages Inbox
            </h3>

            <div className="space-y-2.5 max-h-[480px] overflow-y-auto">
              {messages.length === 0 ? (
                <p className="py-6 text-center text-xs text-neutral-400">No messages in inbox.</p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => markMessageRead(msg.id)}
                    className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                      !msg.isRead
                        ? 'border-blue-200 bg-blue-50/50 dark:border-blue-900/60 dark:bg-blue-950/20'
                        : 'border-neutral-100 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-neutral-900 dark:text-neutral-100">{msg.senderName}</span>
                      <span className="text-[10px] text-neutral-400 font-mono">{msg.timestamp}</span>
                    </div>
                    <div className="font-semibold text-xs text-neutral-800 dark:text-neutral-200">{msg.subject}</div>
                    <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 leading-normal">{msg.body}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Compose Message Form */}
          <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 pb-2 border-b border-neutral-100 dark:border-neutral-800">
              Compose Internal Message
            </h3>

            {msgSuccess && (
              <div className="my-2 p-2.5 rounded-lg bg-emerald-50 text-emerald-700 font-semibold text-xs flex items-center gap-1.5 dark:bg-emerald-950 dark:text-emerald-300">
                <CheckCircle className="h-4 w-4" /> Message dispatched successfully!
              </div>
            )}

            <form onSubmit={handleSendMessage} className="mt-3 space-y-3 text-xs">
              <div>
                <label className="block font-medium mb-1">Recipient Destination</label>
                <input
                  type="text"
                  value={msgReceiver}
                  onChange={(e) => setMsgReceiver(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Subject Header *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Leave authorization inquiry / syllabus request"
                  value={msgSubject}
                  onChange={(e) => setMsgSubject(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Message Body *</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Type your official message here..."
                  value={msgBody}
                  onChange={(e) => setMsgBody(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 shadow-xs cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" /> Dispatch Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Notice Modal */}
      {isAddNoticeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-3">Publish Official Notice</h3>
            <form onSubmit={handleCreateNotice} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium mb-1">Notice Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Winter Vacation Dates & Syllabus Completion"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Target Audience</label>
                <select
                  value={noticeAudience}
                  onChange={(e) => setNoticeAudience(e.target.value as any)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                >
                  <option value="All">All Campus</option>
                  <option value="Students">Students Only</option>
                  <option value="Parents">Parents Only</option>
                  <option value="Teachers">Teachers Only</option>
                  <option value="Staff">Administrative Staff</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Notice Text Body *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter full announcement details..."
                  value={noticeDesc}
                  onChange={(e) => setNoticeDesc(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Attachment File Name</label>
                <input
                  type="text"
                  placeholder="Circular_Winter_Break_2026.pdf"
                  value={noticeAttachment}
                  onChange={(e) => setNoticeAttachment(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                />
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddNoticeOpen(false)}
                  className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
