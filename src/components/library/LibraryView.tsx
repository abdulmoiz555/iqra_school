import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Book, BookIssue } from '../../types';
import { Library, Plus, Search, BookOpen, Clock, AlertTriangle, CheckCircle, X, RotateCcw } from 'lucide-react';

export const LibraryView: React.FC = () => {
  const { books, addBook, bookIssues, issueBook, returnBook, students, currentUser, settings } = useApp();
  const [activeTab, setActiveTab] = useState<'catalog' | 'issued'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');

  // Issue modal state
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(books[0]?.id || '');
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [issueDueDate, setIssueDueDate] = useState(new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10));

  // Add Book modal state
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [newBook, setNewBook] = useState({
    isbn: '',
    title: '',
    author: '',
    publisher: 'Oxford University Press',
    category: 'Science',
    edition: '1st Edition',
    quantity: 10,
    availableQuantity: 10,
    price: 1500,
    shelfNumber: 'Shelf A-01',
  });

  const filteredBooks = books.filter((b) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.isbn.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q)
    );
  });

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    issueBook(selectedBookId, selectedStudentId, issueDueDate);
    setIsIssueModalOpen(false);
  };

  const handleAddBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBook.title.trim()) return;
    addBook({
      ...newBook,
      availableQuantity: Number(newBook.quantity),
      quantity: Number(newBook.quantity),
      price: Number(newBook.price),
    });
    setIsAddBookOpen(false);
  };

  const canManage = ['Super Admin', 'Admin', 'Librarian'].includes(currentUser.role);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Library Catalog & Circulation Desk
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Search textbook inventory, issue books to students, track overdue fines and returns
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canManage && (
            <>
              <button
                onClick={() => setIsIssueModalOpen(true)}
                className="flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 cursor-pointer"
              >
                <Clock className="h-3.5 w-3.5 text-blue-600" />
                Issue Book to Student
              </button>
              <button
                onClick={() => setIsAddBookOpen(true)}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add Book Title
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-xs">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'catalog'
              ? 'bg-white text-blue-600 font-bold shadow-xs dark:bg-neutral-900 dark:text-blue-400'
              : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400'
          }`}
        >
          Book Catalog ({books.length})
        </button>
        <button
          onClick={() => setActiveTab('issued')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'issued'
              ? 'bg-white text-blue-600 font-bold shadow-xs dark:bg-neutral-900 dark:text-blue-400'
              : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400'
          }`}
        >
          Active Loans & Overdue ({bookIssues.length})
        </button>
      </div>

      {/* Tab 1: Catalog */}
      {activeTab === 'catalog' && (
        <div className="space-y-3">
          <div className="rounded-xl border border-neutral-200 bg-white p-3 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search catalog by title, author, ISBN, category..."
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-8 pr-3 py-1.5 text-xs text-neutral-900 focus:border-blue-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              />
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white shadow-xs overflow-hidden dark:border-neutral-800 dark:bg-neutral-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 dark:bg-neutral-800/60 dark:border-neutral-800 dark:text-neutral-300 font-semibold">
                <tr>
                  <th className="py-3 px-4">ISBN</th>
                  <th className="py-3 px-4">Book Title</th>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Shelf Location</th>
                  <th className="py-3 px-4 text-center">Available / Total</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  {canManage && <th className="py-3 px-4 text-right">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {filteredBooks.map((bk) => (
                  <tr key={bk.id} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40">
                    <td className="py-3 px-4 font-mono font-medium text-neutral-500">{bk.isbn}</td>
                    <td className="py-3 px-4 font-bold text-neutral-900 dark:text-neutral-100">{bk.title}</td>
                    <td className="py-3 px-4 text-neutral-700 dark:text-neutral-300">{bk.author}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-sm bg-neutral-100 dark:bg-neutral-800 font-medium text-[10px]">
                        {bk.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-neutral-500">{bk.shelfNumber}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold">
                      <span className={bk.availableQuantity > 0 ? 'text-emerald-600' : 'text-rose-600'}>
                        {bk.availableQuantity}
                      </span>{' '}
                      / {bk.quantity}
                    </td>
                    <td className="py-3 px-4 font-mono text-right font-medium">
                      {settings.currencySymbol}{bk.price.toLocaleString()}
                    </td>
                    {canManage && (
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedBookId(bk.id);
                            setIsIssueModalOpen(true);
                          }}
                          disabled={bk.availableQuantity <= 0}
                          className="px-2.5 py-1 text-[11px] font-semibold text-blue-600 hover:underline disabled:opacity-40 cursor-pointer"
                        >
                          Issue Book
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Issued Books */}
      {activeTab === 'issued' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-neutral-200 bg-white shadow-xs overflow-hidden dark:border-neutral-800 dark:bg-neutral-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 dark:bg-neutral-800/60 dark:border-neutral-800 dark:text-neutral-300 font-semibold">
                <tr>
                  <th className="py-3 px-4">Book Title</th>
                  <th className="py-3 px-4">Issued To Student</th>
                  <th className="py-3 px-4">Issue Date</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Overdue Fine</th>
                  {canManage && <th className="py-3 px-4 text-right">Return Book</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {bookIssues.map((issue) => {
                  const bk = books.find((b) => b.id === issue.bookId);
                  const stu = students.find((s) => s.id === issue.studentId);

                  return (
                    <tr key={issue.id} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40">
                      <td className="py-3 px-4 font-bold text-neutral-900 dark:text-neutral-100">{bk?.title || 'Book'}</td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100">{stu ? `${stu.firstName} ${stu.lastName}` : 'Student'}</span>
                        <span className="text-[10px] text-neutral-400 font-mono ml-1.5">({stu?.admissionNumber})</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-neutral-500">{issue.issueDate}</td>
                      <td className="py-3 px-4 font-mono text-neutral-800 dark:text-neutral-200 font-medium">{issue.dueDate}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold ${
                          issue.status === 'Issued' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300' :
                          issue.status === 'Overdue' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
                          'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}>
                          {issue.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-rose-600 dark:text-rose-400">
                        {issue.fine > 0 ? `${settings.currencySymbol}${issue.fine}` : '—'}
                      </td>
                      {canManage && (
                        <td className="py-3 px-4 text-right">
                          {issue.status !== 'Returned' && (
                            <button
                              onClick={() => returnBook(issue.id, issue.fine, 'Returned intact')}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-md cursor-pointer"
                            >
                              <RotateCcw className="h-3 w-3" /> Mark Returned
                            </button>
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

      {/* Issue Modal */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-3">Issue Book to Student</h3>
            <form onSubmit={handleIssueSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium mb-1">Book Title</label>
                <select
                  value={selectedBookId}
                  onChange={(e) => setSelectedBookId(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                >
                  {books.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title} ({b.availableQuantity} available)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Select Student</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} ({s.admissionNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Return Due Date</label>
                <input
                  type="date"
                  value={issueDueDate}
                  onChange={(e) => setIssueDueDate(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800"
                />
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsIssueModalOpen(false)}
                  className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  Confirm Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Book Modal */}
      {isAddBookOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-3">Add Book to Library</h3>
            <form onSubmit={handleAddBookSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Book Title *</label>
                  <input
                    type="text"
                    required
                    value={newBook.title}
                    onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">ISBN</label>
                  <input
                    type="text"
                    placeholder="978-0199144877"
                    value={newBook.isbn}
                    onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Author</label>
                  <input
                    type="text"
                    value={newBook.author}
                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Category</label>
                  <input
                    type="text"
                    value={newBook.category}
                    onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium mb-1">Quantity</label>
                  <input
                    type="number"
                    value={newBook.quantity}
                    onChange={(e) => setNewBook({ ...newBook, quantity: Number(e.target.value) })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Shelf #</label>
                  <input
                    type="text"
                    value={newBook.shelfNumber}
                    onChange={(e) => setNewBook({ ...newBook, shelfNumber: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Price</label>
                  <input
                    type="number"
                    value={newBook.price}
                    onChange={(e) => setNewBook({ ...newBook, price: Number(e.target.value) })}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono dark:border-neutral-700 dark:bg-neutral-800"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddBookOpen(false)}
                  className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  Catalog Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
