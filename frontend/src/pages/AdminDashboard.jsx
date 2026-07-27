import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { exportInventoryCSV, exportCirculationCSV } from '../utils/exportCsv';

// Import Admin Sub-components
import AdminHeader from '../components/admin/AdminHeader';
import CirculationQueueTable from '../components/admin/CirculationQueueTable';
import InventoryGrid from '../components/admin/InventoryGrid';
import FinesTable from '../components/admin/FinesTable';
import EventsManager from '../components/admin/EventsManager';
import AddEditBookModal from '../components/admin/AddEditBookModal';
import BarcodeScannerModal from '../components/ui/BarcodeScannerModal';
import Drawer from '../components/ui/Drawer';
import StatCard from '../components/cards/StatCard';
import { FiClock, FiBookOpen, FiDollarSign, FiCalendar, FiSend } from 'react-icons/fi';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'requests' | 'inventory' | 'fines' | 'events'

  // Data States
  const [books, setBooks] = useState([]);
  const [issues, setIssues] = useState([]);
  const [adminEvents, setAdminEvents] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingIssues, setLoadingIssues] = useState(true);

  // Search & Filter States
  const [bookSearch, setBookSearch] = useState('');
  const [issueFilter, setIssueFilter] = useState('pending'); // 'all' | 'pending' | 'approved' | 'returned' | 'rejected'

  // Modal & Drawer States
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [selectedIssueForFine, setSelectedIssueForFine] = useState(null);
  const [submittingBook, setSubmittingBook] = useState(false);
  const [sendingReminders, setSendingReminders] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Form States
  const [bookFormData, setBookFormData] = useState({
    title: '',
    author: '',
    description: '',
    category: 'computer science',
    copies: '5',
    isbn: ''
  });
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const [eventFormData, setEventFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    category: 'Workshop',
    description: '',
    speaker: ''
  });

  // Fetch API Handlers
  const fetchBooks = useCallback(async () => {
    setLoadingBooks(true);
    try {
      const res = await api.get('/books/get-all-Books', { params: { limit: 100 } });
      const booksPayload = res.data?.data;
      setBooks(Array.isArray(booksPayload?.books) ? booksPayload.books : Array.isArray(booksPayload) ? booksPayload : []);
    } catch {
      toast.error('Failed to load books catalog');
    } finally {
      setLoadingBooks(false);
    }
  }, []);

  const fetchIssues = useCallback(async () => {
    setLoadingIssues(true);
    try {
      const res = await api.get('/books/all-issues');
      setIssues(res.data?.data || []);
    } catch {
      toast.error('Failed to load circulation issue requests');
    } finally {
      setLoadingIssues(false);
    }
  }, []);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await api.get('/events');
      setAdminEvents(res.data?.data || []);
    } catch {
      console.error('Failed to fetch events');
    }
  }, []);

  useEffect(() => {
    fetchBooks();
    fetchIssues();
    fetchEvents();
  }, [fetchBooks, fetchIssues, fetchEvents]);

  // Issue Action Handlers
  const handleApproveIssue = async (issueId) => {
    try {
      setActionLoadingId(issueId);
      await api.post(`/books/approve/${issueId}`);
      toast.success('Book borrow request approved!');
      fetchIssues();
      fetchBooks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve issue');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRejectIssue = async (issueId) => {
    try {
      setActionLoadingId(issueId);
      await api.post(`/books/reject/${issueId}`);
      toast.success('Borrow request rejected');
      fetchIssues();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject issue');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReturnBook = async (issueId) => {
    try {
      setActionLoadingId(issueId);
      const res = await api.post(`/books/return/${issueId}`);
      toast.success(res.data?.message || 'Book returned to inventory');
      fetchIssues();
      fetchBooks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to process return');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleWaiveFine = async (issueId) => {
    try {
      setActionLoadingId(issueId);
      await api.post(`/books/waive-fine/${issueId}`);
      toast.success('Fine amount waived!');
      setSelectedIssueForFine(null);
      fetchIssues();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to waive fine');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSendOverdueReminders = async () => {
    try {
      setSendingReminders(true);
      const res = await api.post('/notifications/send-reminders');
      toast.success(res.data?.message || 'Automated overdue reminder alerts sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to trigger overdue alerts');
    } finally {
      setSendingReminders(false);
    }
  };

  // Add / Edit Book Submit
  const handleOpenAddBook = () => {
    setEditingBook(null);
    setBookFormData({
      title: '',
      author: '',
      description: '',
      category: 'computer science',
      copies: '5',
      isbn: ''
    });
    setCoverFile(null);
    setCoverPreview(null);
    setIsBookModalOpen(true);
  };

  const handleOpenEditBook = (book) => {
    setEditingBook(book);
    setBookFormData({
      title: book.title || '',
      author: book.author || '',
      description: book.description || '',
      category: book.category || 'general',
      copies: book.copies?.toString() || '1',
      isbn: book.isbn || ''
    });
    setCoverPreview(book.cover?.url || null);
    setCoverFile(null);
    setIsBookModalOpen(true);
  };

  const handleSaveBook = async (e) => {
    e.preventDefault();
    if (!bookFormData.title.trim() || !bookFormData.author.trim() || !bookFormData.isbn.trim()) {
      toast.error('Please fill in all required fields (Title, Author, ISBN)');
      return;
    }

    try {
      setSubmittingBook(true);
      if (editingBook) {
        const data = new FormData();
        data.append('title', bookFormData.title);
        data.append('author', bookFormData.author);
        data.append('copies', bookFormData.copies);
        if (coverFile) data.append('cover', coverFile);

        await api.patch(`/books/update-book/${editingBook._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Book details updated successfully!');
      } else {
        if (!coverFile) {
          toast.error('Book cover image is required for new books');
          return;
        }
        const data = new FormData();
        for (const key in bookFormData) {
          data.append(key, bookFormData[key]);
        }
        data.append('cover', coverFile);

        await api.post('/books/add-book', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('New book added to inventory!');
      }

      setIsBookModalOpen(false);
      fetchBooks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save book');
    } finally {
      setSubmittingBook(false);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book from inventory?')) return;
    try {
      await api.delete(`/books/delete-book/${bookId}`);
      toast.success('Book deleted from catalog');
      fetchBooks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete book');
    }
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!eventFormData.title.trim() || !eventFormData.date.trim()) {
      toast.error('Title and Date are required for events');
      return;
    }
    try {
      await api.post('/events/create', eventFormData);
      toast.success('New event published to landing page and MongoDB!');
      setIsEventModalOpen(false);
      setEventFormData({
        title: '',
        date: '',
        time: '',
        location: '',
        category: 'Workshop',
        description: '',
        speaker: ''
      });
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to publish event');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await api.delete(`/events/delete/${eventId}`);
      toast.success('Event deleted');
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete event');
    }
  };

  // Summaries
  const pendingRequestsCount = useMemo(() => issues.filter((i) => i.status === 'pending').length, [issues]);
  const activeIssuesCount = useMemo(() => issues.filter((i) => i.status === 'approved').length, [issues]);

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">
        {/* Header Banner */}
        <AdminHeader
          onOpenAddBook={handleOpenAddBook}
          onOpenScanner={() => setIsScannerOpen(true)}
          onRefresh={() => {
            fetchBooks();
            fetchIssues();
            fetchEvents();
          }}
          loading={loadingBooks || loadingIssues}
        />

        {/* Tab Switcher Pills */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Overview Metrics', icon: FiBookOpen },
            { id: 'requests', label: `Borrow Requests (${pendingRequestsCount})`, icon: FiClock },
            { id: 'inventory', label: `Book Catalog (${books.length})`, icon: FiBookOpen },
            { id: 'fines', label: 'Fines & Waivers', icon: FiDollarSign },
            { id: 'events', label: 'Events Manager', icon: FiCalendar }
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <IconComp className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW METRICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Catalog Books"
                numericValue={books.length}
                suffix=" Books"
                icon={FiBookOpen}
                color="cyan"
                subtext="Total items in library database"
              />
              <StatCard
                title="Pending Requests"
                numericValue={pendingRequestsCount}
                suffix=" Pending"
                icon={FiClock}
                color="amber"
                subtext="Awaiting admin approval"
              />
              <StatCard
                title="Active Borrows"
                numericValue={activeIssuesCount}
                suffix=" Issued"
                icon={FiBookOpen}
                color="emerald"
                subtext="Currently with students"
              />
              <StatCard
                title="Custom Events"
                numericValue={adminEvents.length}
                suffix=" Events"
                icon={FiCalendar}
                color="purple"
                subtext="Published on portal"
              />
            </div>

            <CirculationQueueTable
              issues={issues}
              issueFilter="pending"
              setIssueFilter={setIssueFilter}
              onApprove={handleApproveIssue}
              onReject={handleRejectIssue}
              onReturn={handleReturnBook}
              actionLoadingId={actionLoadingId}
              onSendReminders={handleSendOverdueReminders}
              sendingReminders={sendingReminders}
              onExportCSV={() => exportCirculationCSV(issues)}
            />
          </div>
        )}

        {/* TAB 2: CIRCULATION QUEUE */}
        {activeTab === 'requests' && (
          <CirculationQueueTable
            issues={issues}
            issueFilter={issueFilter}
            setIssueFilter={setIssueFilter}
            onApprove={handleApproveIssue}
            onReject={handleRejectIssue}
            onReturn={handleReturnBook}
            actionLoadingId={actionLoadingId}
            onSendReminders={handleSendOverdueReminders}
            sendingReminders={sendingReminders}
            onExportCSV={() => exportCirculationCSV(issues)}
          />
        )}

        {/* TAB 3: BOOK INVENTORY CRUD */}
        {activeTab === 'inventory' && (
          <InventoryGrid
            books={books}
            bookSearch={bookSearch}
            setBookSearch={setBookSearch}
            loading={loadingBooks}
            onOpenAddBook={handleOpenAddBook}
            onEditBook={handleOpenEditBook}
            onDeleteBook={handleDeleteBook}
            onExportCSV={() => exportInventoryCSV(books)}
          />
        )}

        {/* TAB 4: FINES & WAIVERS */}
        {activeTab === 'fines' && (
          <FinesTable
            issues={issues}
            onOpenWaiveDrawer={(issue) => setSelectedIssueForFine(issue)}
            actionLoadingId={actionLoadingId}
          />
        )}

        {/* TAB 5: EVENTS MANAGER */}
        {activeTab === 'events' && (
          <EventsManager
            adminEvents={adminEvents}
            onOpenEventModal={() => setIsEventModalOpen(true)}
            onDeleteEvent={handleDeleteEvent}
          />
        )}
      </main>

      {/* Add / Edit Book Modal */}
      <AddEditBookModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        editingBook={editingBook}
        bookFormData={bookFormData}
        setBookFormData={setBookFormData}
        coverPreview={coverPreview}
        onFileChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            setCoverFile(file);
            setCoverPreview(URL.createObjectURL(file));
          }
        }}
        onSubmit={handleSaveBook}
        submitting={submittingBook}
      />

      {/* Fine Waiver Drawer */}
      <Drawer
        isOpen={Boolean(selectedIssueForFine)}
        onClose={() => setSelectedIssueForFine(null)}
        title="Admin Fine Waiver Control"
      >
        {selectedIssueForFine && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Borrow Record ID</span>
              <p className="font-bold text-slate-100 text-sm">{selectedIssueForFine.book?.title}</p>
              <p className="text-xs text-slate-400 font-mono">Student: {selectedIssueForFine.user?.email}</p>
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">Total Penalty Fine:</span>
                <span className="font-extrabold text-rose-400 font-mono">₹{selectedIssueForFine.fineAmount}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Waiving this fine will update the record status to <strong className="text-purple-400">Waived</strong> and clear the student's debt balance.
            </p>

            <div className="pt-4 flex justify-end gap-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedIssueForFine(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleWaiveFine(selectedIssueForFine._id)}
                disabled={actionLoadingId === selectedIssueForFine._id}
                className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 font-semibold text-xs cursor-pointer"
              >
                {actionLoadingId === selectedIssueForFine._id ? 'Waiving...' : 'Confirm Fine Waiver'}
              </button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Barcode Scanner Modal */}
      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        books={books}
      />
    </div>
  );
};

export default AdminDashboard;
