import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  HiOutlineBookOpen,
  HiOutlineUserGroup,
  HiOutlineCollection,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineRefresh,
  HiOutlineSearch,
  HiOutlineSpeakerphone,
  HiOutlineCalendar,
  HiOutlineChartBar
} from 'react-icons/hi';
import { FiBook, FiUpload, FiX, FiCheck, FiAlertCircle, FiDollarSign } from 'react-icons/fi';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('overview');

  // Core Data States
  const [books, setBooks] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingIssues, setLoadingIssues] = useState(true);

  // Search & Filter
  const [bookSearch, setBookSearch] = useState('');
  const [issueFilter, setIssueFilter] = useState('pending'); // all, pending, approved, returned, rejected

  // Add / Edit Book Modal States
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null); // null if adding new book
  const [bookFormData, setBookFormData] = useState({
    title: '',
    author: '',
    description: '',
    category: '',
    copies: '',
    isbn: ''
  });
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [submittingBook, setSubmittingBook] = useState(false);

  // Local Storage Event Administration (for home page sync)
  const [adminEvents, setAdminEvents] = useState([]);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventFormData, setEventFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    category: 'Workshop',
    description: '',
    speaker: ''
  });
  const [booksPage, setBooksPage] = useState(1);

  // Action Pending loaders
  const [resActionLoading, setResActionLoading] = useState({}); // { [issueId]: 'approve' | 'reject' | 'delete' }

  // API Call: Fetch all Books
  const fetchBooks = useCallback(async () => {
    setLoadingBooks(true);
    try {
      const res = await api.get('/books/get-all-Books');
      setBooks(res.data?.data || []);
    } catch {
      toast.error('Failed to load books database.');
    } finally {
      setLoadingBooks(false);
    }
  }, []);

  // API Call: Fetch all Issued Books
  const fetchIssues = useCallback(async () => {
    setLoadingIssues(true);
    try {
      const res = await api.get('/books/all-issues');
      setIssues(res.data?.data || []);
    } catch (err) {
      if (err.response?.status !== 404) {
        toast.error('Failed to load borrowing requests.');
      } else {
        setIssues([]);
      }
    } finally {
      setLoadingIssues(false);
    }
  }, []);

  // Fetch initial data
  useEffect(() => {
    fetchBooks();
    fetchIssues();
    // Load local storage events
    const saved = localStorage.getItem('lms_custom_events');
    if (saved) {
      try {
        setAdminEvents(JSON.parse(saved));
      } catch {
        setAdminEvents([]);
      }
    }
  }, [fetchBooks, fetchIssues]);

  // Request: Approve Issue
  const handleApprove = async (issueId) => {
    console.log("handleApprove called for issueId:", issueId);
    if (!issueId) {
      toast.error("Internal Error: Issue ID is undefined.");
      return;
    }
    setResActionLoading(prev => ({ ...prev, [issueId]: 'approve' }));
    try {
      await api.post(`/books/approve/${issueId}`, {});
      toast.success('Book issue request approved successfully!');
      fetchIssues();
      fetchBooks();
    } catch (err) {
      console.error("Approve request failed:", err);
      toast.error(err.response?.data?.message || 'Approval failed.');
    } finally {
      setResActionLoading(prev => ({ ...prev, [issueId]: null }));
    }
  };

  // Request: Reject Issue
  const handleReject = async (issueId) => {
    console.log("handleReject called for issueId:", issueId);
    if (!issueId) {
      toast.error("Internal Error: Issue ID is undefined.");
      return;
    }
    setResActionLoading(prev => ({ ...prev, [issueId]: 'reject' }));
    try {
      await api.post(`/books/reject/${issueId}`, {});
      toast.success('Book issue request rejected.');
      fetchIssues();
    } catch (err) {
      console.error("Reject request failed:", err);
      toast.error(err.response?.data?.message || 'Rejection failed.');
    } finally {
      setResActionLoading(prev => ({ ...prev, [issueId]: null }));
    }
  };

  // Request: Return Issue (Admin Only)
  const handleReturn = async (issueId) => {
    console.log("handleReturn called for issueId:", issueId);
    if (!issueId) {
      toast.error("Internal Error: Issue ID is undefined.");
      return;
    }
    setResActionLoading(prev => ({ ...prev, [issueId]: 'return' }));
    try {
      await api.post(`/books/return/${issueId}`, {});
      toast.success('Book returned successfully!');
      fetchIssues();
      fetchBooks();
    } catch (err) {
      console.error("Return request failed:", err);
      toast.error(err.response?.data?.message || 'Return failed.');
    } finally {
      setResActionLoading(prev => ({ ...prev, [issueId]: null }));
    }
  };

  const handleWaiveFine = async (issueId) => {
    try {
      await api.post(`/books/waive-fine/${issueId}`, {});
      toast.success('Fine waived successfully!');
      fetchIssues();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Waive failed.');
    }
  };

  const handleCollectFine = async (issueId) => {
    try {
      await api.post(`/books/pay-fine/${issueId}`, {});
      toast.success('Fine collected successfully!');
      fetchIssues();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Collection failed.');
    }
  };

  // Book CRUD: Delete Book
  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book? This action cannot be undone.')) return;
    try {
      await api.delete(`/books/delete-book/${bookId}`);
      toast.success('Book deleted from DB.');
      fetchBooks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed.');
    }
  };

  // Book Add/Edit inputs
  const handleBookInputChange = (e) => {
    const { name, value } = e.target;
    setBookFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBookFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  // Book Open Modals
  const openAddBookModal = () => {
    setEditingBook(null);
    setBookFormData({
      title: '',
      author: '',
      description: '',
      category: '',
      copies: '',
      isbn: ''
    });
    setCoverFile(null);
    setCoverPreview(null);
    setIsBookModalOpen(true);
  };

  const openEditBookModal = (book) => {
    setEditingBook(book);
    setBookFormData({
      title: book.title || '',
      author: book.author || '',
      description: book.description || '',
      category: book.category || '',
      copies: book.copies || '',
      isbn: book.isbn || ''
    });
    setCoverFile(null);
    setCoverPreview(book.cover?.url || null);
    setIsBookModalOpen(true);
  };

  // Submit Book form
  const handleBookSubmit = async (e) => {
    e.preventDefault();
    const { title, author, category, copies, isbn } = bookFormData;
    if (!title || !author || !category || !copies) {
      toast.error('Please fill in all mandatory fields.');
      return;
    }

    setSubmittingBook(true);
    const data = new FormData();
    data.append('title', title.trim());
    data.append('author', author.trim());
    data.append('category', category.trim().toLowerCase());
    data.append('copies', Number(copies));

    if (editingBook) {
      // Edit book
      if (coverFile) {
        data.append('cover', coverFile);
      }
      try {
        await api.patch(`/books/update-book/${editingBook._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Book updated successfully!');
        setIsBookModalOpen(false);
        fetchBooks();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Update failed.');
      } finally {
        setSubmittingBook(false);
      }
    } else {
      // Create new book
      if (!isbn) {
        toast.error('ISBN is required for new books.');
        setSubmittingBook(false);
        return;
      }
      if (!coverFile) {
        toast.error('Cover image is required for new books.');
        setSubmittingBook(false);
        return;
      }
      data.append('isbn', isbn.trim());
      data.append('description', bookFormData.description.trim());
      data.append('cover', coverFile);

      try {
        await api.post('/books/add-book', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('New book registered in catalogue!');
        setIsBookModalOpen(false);
        fetchBooks();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Registration failed.');
      } finally {
        setSubmittingBook(false);
      }
    }
  };

  // Add Event
  const handleEventSubmit = (e) => {
    e.preventDefault();
    const { title, date, time, location, description, speaker } = eventFormData;
    if (!title || !date || !time || !location || !description || !speaker) {
      toast.error('Please fill all event details.');
      return;
    }
    const newEvent = {
      ...eventFormData,
      id: Date.now(),
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop"
    };

    const updated = [newEvent, ...adminEvents];
    setAdminEvents(updated);
    localStorage.setItem('lms_custom_events', JSON.stringify(updated));
    toast.success('Custom event posted successfully! Syncing live with homepage.');
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
  };

  // Delete Event
  const handleDeleteEvent = (id) => {
    const updated = adminEvents.filter(e => e.id !== id);
    setAdminEvents(updated);
    localStorage.setItem('lms_custom_events', JSON.stringify(updated));
    toast.success('Event removed.');
  };

  // Statistics Computations
  const stats = {
    totalBooks: books.reduce((sum, b) => sum + (b.copies || 0), 0),
    uniqueTitles: books.length,
    pendingIssues: issues.filter(i => i.status === 'pending').length,
    activeIssues: issues.filter(i => i.status === 'approved').length,
    returnedIssues: issues.filter(i => i.status === 'returned').length,
    studentsCount: new Set(issues.map(i => i.user?._id).filter(Boolean)).size || 1,
    collectedFines: issues.reduce((sum, i) => sum + (i.fineStatus === 'paid' ? (i.fineAmount || 0) : 0), 0),
    pendingFines: issues.reduce((sum, i) => sum + (i.fineStatus === 'unpaid' ? (i.fineAmount || 0) : 0), 0)
  };

  const filteredBooks = books.filter(b =>
    b.title?.toLowerCase().includes(bookSearch.toLowerCase()) ||
    b.author?.toLowerCase().includes(bookSearch.toLowerCase()) ||
    b.category?.toLowerCase().includes(bookSearch.toLowerCase()) ||
    b.isbn?.toLowerCase().includes(bookSearch.toLowerCase())
  );

  // Reset page when filter changes
  useEffect(() => {
    setBooksPage(1);
  }, [bookSearch]);

  // Analytics State Computations
  const categoryStats = useMemo(() => {
    const counts = {};
    books.forEach(b => {
      const cat = b.category || 'Uncategorized';
      counts[cat] = (counts[cat] || 0) + (b.copies || 0);
    });
    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
    return Object.keys(counts).map(cat => ({
      name: cat,
      count: counts[cat],
      percent: Math.round((counts[cat] / total) * 100)
    })).sort((a, b) => b.count - a.count);
  }, [books]);

  const donutSegments = useMemo(() => {
    let accumulatedPercent = 0;
    const colors = [
      '#3b82f6', // blue
      '#6366f1', // indigo
      '#8b5cf6', // violet
      '#ec4899', // pink
      '#f43f5e', // rose
      '#f59e0b', // amber
      '#10b981', // emerald
      '#14b8a6', // teal
    ];
    return categoryStats.map((item, idx) => {
      const strokeOffset = 251.2 - (251.2 * accumulatedPercent) / 100;
      accumulatedPercent += item.percent;
      return {
        ...item,
        color: colors[idx % colors.length],
        strokeOffset
      };
    });
  }, [categoryStats]);

  const dailyStats = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push({
        dateStr: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        dateKey: d.toISOString().split('T')[0],
        requests: 0,
        returns: 0
      });
    }

    issues.forEach(i => {
      if (i.issueDate) {
        const idate = new Date(i.issueDate).toISOString().split('T')[0];
        const found = days.find(day => day.dateKey === idate);
        if (found) {
          found.requests++;
        }
      }
      if (i.status === 'returned' && i.returnDate) {
        const rdate = new Date(i.returnDate).toISOString().split('T')[0];
        const found = days.find(day => day.dateKey === rdate);
        if (found) {
          found.returns++;
        }
      }
    });

    const maxVal = Math.max(...days.map(d => Math.max(d.requests, d.returns)), 4);
    return { days, maxVal };
  }, [issues]);

  const topBorrowedBooks = useMemo(() => {
    const borrowsCount = {};
    issues.forEach(i => {
      if (i.book) {
        const title = i.book.title || 'Unknown Title';
        const author = i.book.author || 'Unknown Author';
        const cover = i.book.cover?.url || '';
        const id = i.book._id || '';
        if (!borrowsCount[title]) {
          borrowsCount[title] = { title, author, cover, id, borrowCount: 0 };
        }
        borrowsCount[title].borrowCount++;
      }
    });
    return Object.values(borrowsCount)
      .sort((a, b) => b.borrowCount - a.borrowCount)
      .slice(0, 5);
  }, [issues]);

  const booksPerPage = 10;
  const totalBooksPages = Math.ceil(filteredBooks.length / booksPerPage) || 1;
  const paginatedBooks = useMemo(() => {
    const start = (booksPage - 1) * booksPerPage;
    return filteredBooks.slice(start, start + booksPerPage);
  }, [filteredBooks, booksPage]);

  const filteredIssues = issues.filter(i => {
    if (issueFilter === 'all') return true;
    return i.status === issueFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* Dashboard Title & Top row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Admin Operations Console</h1>
            <p className="text-xs text-slate-500 mt-1">Manage database catalogue, student borrow requests, and announcements.</p>
          </div>
          <button
            onClick={() => { fetchBooks(); fetchIssues(); }}
            className="flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-200 hover:bg-white text-slate-650 bg-white/50 text-xs font-bold rounded-xl transition duration-150 shadow-sm"
          >
            <HiOutlineRefresh className="text-sm" /> Sync Database
          </button>
        </div>

        {/* Console layout grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* LEFT Sidebar navigation panel */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2 block mb-3">Navigation Console</span>
              {[
                { id: 'overview', label: 'Dashboard Overview', icon: HiOutlineCollection },
                { id: 'requests', label: 'Borrow Requests', icon: HiOutlineClock, badge: stats.pendingIssues },
                { id: 'books', label: 'Manage Catalogue', icon: HiOutlineBookOpen },
                { id: 'analytics', label: 'Visual Analytics', icon: HiOutlineChartBar },
                { id: 'events', label: 'Announcements', icon: HiOutlineSpeakerphone, badge: adminEvents.length }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${tab === item.id
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/10'
                    : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon className="text-base" />
                    {item.label}
                  </div>
                  {item.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${tab === item.id ? 'bg-white text-sky-650' : 'bg-amber-100 text-amber-700'
                      }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Quick Profile summary */}
            <div className="bg-gradient-to-tr from-slate-900 to-slate-800 rounded-2xl p-5 text-white border border-slate-800 shadow-lg">
              <div className="flex items-center gap-3">
                {user?.avatar ? (
                  <img src={user.avatar} alt="" className="h-10 w-10 rounded-full object-cover ring-2 ring-indigo-400" />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm">
                    A
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-xs capitalize leading-tight">{user?.firstName} {user?.lastName}</h4>
                  <p className="text-[10px] text-slate-400 capitalize mt-0.5">{user?.role} Portal</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT Main Operations Panel */}
          <div className="lg:col-span-3">

            {/* --- TAB: OVERVIEW BLOCK --- */}
            {tab === 'overview' && (
              <div className="space-y-8">

                {/* Stats grid */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  {[
                    { label: "Book Copies", value: stats.totalBooks, color: "text-sky-500", icon: HiOutlineBookOpen, bg: "bg-sky-50" },
                    { label: "Title Listings", value: stats.uniqueTitles, color: "text-indigo-500", icon: HiOutlineCollection, bg: "bg-indigo-50" },
                    { label: "Pending Approvals", value: stats.pendingIssues, color: "text-amber-500", icon: HiOutlineClock, bg: "bg-amber-50" },
                    { label: "Registered Students", value: stats.studentsCount, color: "text-green-500", icon: HiOutlineUserGroup, bg: "bg-green-50" },
                    { label: "Fines Collected", value: `₹${stats.collectedFines}`, color: "text-emerald-500", icon: FiDollarSign, bg: "bg-emerald-50" },
                    { label: "Fines Overdue", value: `₹${stats.pendingFines}`, color: "text-rose-500", icon: FiDollarSign, bg: "bg-rose-50" }
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
                      <div className={`h-9 w-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${stat.bg} ${stat.color}`}>
                        <stat.icon />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800 leading-tight">{stat.value}</p>
                        <p className="text-[9px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">{stat.label}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subsections: Recent Pendings Queue */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-850">Recent Pending Borrow Requests</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">Quickly review pending issues without shifting screens.</p>
                    </div>
                    <button onClick={() => setTab('requests')} className="text-xs font-bold text-sky-500 hover:underline">
                      View all queue
                    </button>
                  </div>

                  {loadingIssues ? (
                    <div className="flex justify-center py-8">
                      <svg className="animate-spin h-6 w-6 text-sky-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                    </div>
                  ) : issues.filter(i => i.status === 'pending').length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 flex flex-col items-center justify-center gap-2">
                      <HiOutlineCheckCircle className="text-4xl text-green-400" />
                      <div>
                        <p className="text-xs font-bold text-slate-700">All caught up!</p>
                        <p className="text-[10px] mt-0.5 text-slate-400">There are no pending book reserve requests.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-50 max-h-[380px] overflow-y-auto no-scrollbar">
                      {issues.filter(i => i.status === 'pending').slice(0, 3).map((issue) => (
                        <div key={issue._id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-8 bg-sky-50 flex-shrink-0 rounded overflow-hidden flex items-center justify-center">
                              {issue.book?.cover?.url ? (
                                <img src={issue.book.cover.url} className="h-full w-full object-cover" alt="" />
                              ) : <FiBook className="text-slate-400" />}
                            </div>
                            <div>
                              <p className="text-xs font-extrabold text-slate-800">{issue.book?.title}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                Requested By: <span className="font-semibold text-slate-650 capitalize">{issue.user?.fullName}</span> ({issue.user?.email})
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleReject(issue._id)}
                              disabled={resActionLoading[issue._id]}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-bold transition flex items-center gap-1 disabled:opacity-50"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleApprove(issue._id)}
                              disabled={resActionLoading[issue._id]}
                              className="px-3.5 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-[10px] font-bold transition flex items-center gap-1 shadow-sm shadow-sky-500/10 disabled:opacity-50"
                            >
                              Approve
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Info Alerts */}
                <div className="bg-sky-50/50 p-4 border border-sky-100/50 rounded-2xl flex items-start gap-3">
                  <FiAlertCircle className="text-sky-500 text-lg mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-sky-800">Admin Operations Alert</h5>
                    <p className="text-[10px] text-sky-650 leading-relaxed mt-0.5">
                      Ensure your Cloudinary API keys and process secrets are correctly loaded into backend environments (`.env`). Adding books or updating cover listings requires file streams to be processed, validated, and uploaded to remote cloud buckets correctly.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* --- TAB: BORROW REQUESTS BLOCK --- */}
            {tab === 'requests' && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">

                {/* Headers and filters */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-850">Borrow Queue Inventory</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Authorize student reservations or returns.</p>
                  </div>
                  <div className="flex gap-2">
                    {['all', 'pending', 'approved', 'returned', 'rejected'].map((filterVal) => (
                      <button
                        key={filterVal}
                        onClick={() => setIssueFilter(filterVal)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold capitalize transition-colors ${issueFilter === filterVal
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-100'
                          }`}
                      >
                        {filterVal}
                      </button>
                    ))}
                  </div>
                </div>

                {loadingIssues ? (
                  <div className="flex justify-center py-20">
                    <svg className="animate-spin h-8 w-8 text-sky-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  </div>
                ) : filteredIssues.length === 0 ? (
                  <div className="text-center py-20 text-slate-400">
                    <HiOutlineClock className="text-5xl mx-auto mb-3" />
                    <p className="text-xs font-bold text-slate-800">No requests found</p>
                    <p className="text-[10px] mt-0.5">There are no logs matching this status query.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                          <th className="pb-3 pt-1">Book Title / info</th>
                          <th className="pb-3 pt-1">Requesting Student</th>
                          <th className="pb-3 pt-1">Date Logged</th>
                          <th className="pb-3 pt-1">Status</th>
                          <th className="pb-3 pt-1 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 font-medium">
                        {filteredIssues.map((issue) => (
                          <tr key={issue._id} className="hover:bg-slate-50/50">
                            {/* Book */}
                            <td className="py-4">
                              <div className="flex items-center gap-2.5 max-w-[200px]">
                                <div className="h-8 w-6 bg-slate-150 rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                                  {issue.book?.cover?.url ? (
                                    <img src={issue.book.cover.url} className="h-full w-full object-cover" alt="" />
                                  ) : <FiBook className="text-slate-400 text-sm" />}
                                </div>
                                <span className="font-extrabold text-slate-750 truncate">{issue.book?.title || issue.book?.title || 'Book Listing Deleted'}</span>
                              </div>
                            </td>
                            {/* Student */}
                            <td className="py-4 whitespace-nowrap">
                              <div>
                                <p className="capitalize text-slate-800 font-bold text-xs">{issue.user?.fullName || 'Anonymous'}</p>
                                <p className="text-[10px] text-slate-400 mt-0.2">{issue.user?.email}</p>
                              </div>
                            </td>
                            {/* Date */}
                            <td className="py-4 whitespace-nowrap text-[10px] text-slate-500">
                              {new Date(issue.createdAt || issue.issueDate).toLocaleDateString('en-IN', {
                                day: 'numeric', month: 'short', year: 'numeric'
                              })}
                            </td>
                            {/* Status */}
                            <td className="py-4">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold ${issue.status === 'approved' ? 'bg-green-50 text-green-700' :
                                issue.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                                  issue.status === 'returned' ? 'bg-sky-50 text-sky-700' :
                                    'bg-red-50 text-red-700'
                                }`}>
                                {issue.status}
                              </span>
                              {issue.fineAmount > 0 && (
                                <span className={`block text-[8px] font-bold mt-1 ${issue.fineStatus === 'paid' ? 'text-green-600' : issue.fineStatus === 'waived' ? 'text-slate-500' : 'text-rose-600 font-extrabold'}`}>
                                  ₹{issue.fineAmount} ({issue.fineStatus})
                                </span>
                              )}
                            </td>
                            {/* Actions */}
                            <td className="py-4 text-right">
                              {issue.status === 'pending' ? (
                                <div className="flex justify-end gap-1.5">
                                  <button
                                    onClick={() => handleReject(issue._id)}
                                    disabled={resActionLoading[issue._id]}
                                    className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition"
                                    title="Reject"
                                  >
                                    <HiOutlineXCircle className="text-base" />
                                  </button>
                                  <button
                                    onClick={() => handleApprove(issue._id)}
                                    disabled={resActionLoading[issue._id]}
                                    className="p-1.5 hover:bg-green-50 text-green-600 rounded-lg transition"
                                    title="Approve"
                                  >
                                    <FiCheck className="text-base" />
                                  </button>
                                </div>
                              ) : issue.status === 'approved' ? (
                                <div className="flex justify-end gap-1.5">
                                  <button
                                    onClick={() => handleReturn(issue._id)}
                                    disabled={resActionLoading[issue._id]}
                                    className="px-2.5 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-[10px] font-bold transition flex items-center gap-1 disabled:opacity-50"
                                    title="Mark as Returned"
                                  >
                                    <HiOutlineRefresh className="text-xs" />
                                    Return
                                  </button>
                                </div>
                              ) : issue.fineAmount > 0 && issue.fineStatus === 'unpaid' ? (
                                <div className="flex justify-end gap-1">
                                  <button
                                    onClick={() => handleWaiveFine(issue._id)}
                                    className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded text-[9px] font-bold transition"
                                  >
                                    Waive
                                  </button>
                                  <button
                                    onClick={() => handleCollectFine(issue._id)}
                                    className="px-1.5 py-0.5 bg-green-500 hover:bg-green-600 text-white rounded text-[9px] font-bold transition"
                                  >
                                    Collect
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[10px] text-slate-400 capitalize font-medium">{issue.status}</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* --- TAB: MANAGE BOOK CATALOG BLOCK --- */}
            {tab === 'books' && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">

                {/* Catalog headers and Add Button */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-850">Book Catalogue Control</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Filter book lists, add new volumes or customize stock values.</p>
                  </div>
                  <button
                    onClick={openAddBookModal}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-sky-500/10 transition"
                  >
                    <HiOutlinePlus /> Register New Book
                  </button>
                </div>

                {/* Filter / Search Bar */}
                <div className="relative">
                  <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                  <input
                    type="text"
                    placeholder="Filter books by title, author, category, or ISBN..."
                    value={bookSearch}
                    onChange={(e) => setBookSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:bg-white text-slate-850"
                  />
                </div>

                {loadingBooks ? (
                  <div className="flex justify-center py-20">
                    <svg className="animate-spin h-8 w-8 text-sky-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {paginatedBooks.map((book) => (
                        <div key={book._id} className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 flex items-start gap-4 hover:border-slate-200 transition-colors">
                          {/* cover */}
                          <div className="h-20 w-14 bg-sky-50 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden shadow-sm">
                            {book.cover?.url ? (
                              <img src={book.cover.url} className="h-full w-full object-cover" alt="" />
                            ) : <FiBook className="text-sky-350 text-xl" />}
                          </div>
                          {/* details */}
                          <div className="flex-grow min-w-0">
                            <h4 className="font-extrabold text-slate-800 text-xs truncate leading-snug">{book.title}</h4>
                            <p className="text-[10px] text-slate-500 mt-0.5 capitalize leading-none">by {book.author}</p>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              <span className="text-[9px] bg-sky-50 text-sky-600 font-bold px-2 py-0.5 rounded-full capitalize">
                                {book.category}
                              </span>
                              <span className="text-[9px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
                                ISBN: {book.isbn}
                              </span>
                            </div>
                            <p className="text-[10px] font-bold text-slate-500 mt-2">
                              Available: <span className={book.availableCopies > 0 ? "text-green-600" : "text-red-500"}>{book.availableCopies}</span> / {book.copies} copies
                            </p>
                          </div>
                          {/* crud actions */}
                          <div className="flex flex-col gap-1.5 justify-start">
                            <button
                              onClick={() => openEditBookModal(book)}
                              className="p-1.5 bg-white border border-slate-100 hover:bg-slate-50 text-slate-650 rounded-lg shadow-sm transition"
                              title="Edit Book Details"
                            >
                              <HiOutlinePencil className="text-[10px]" />
                            </button>
                            <button
                              onClick={() => handleDeleteBook(book._id)}
                              className="p-1.5 bg-white border border-slate-100 hover:bg-red-50 text-red-500 rounded-lg shadow-sm transition"
                              title="Delete Book"
                            >
                              <HiOutlineTrash className="text-[10px]" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalBooksPages > 1 && (
                      <div className="flex items-center justify-center gap-3 mt-6 pb-2">
                        <button
                          disabled={booksPage === 1}
                          onClick={() => setBooksPage(prev => Math.max(prev - 1, 1))}
                          className="px-3 py-1.5 bg-white border border-slate-150 text-slate-700 font-bold text-[10px] rounded-lg shadow-sm hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <span className="text-[10px] font-bold text-slate-500">
                          Page {booksPage} of {totalBooksPages}
                        </span>
                        <button
                          disabled={booksPage === totalBooksPages}
                          onClick={() => setBooksPage(prev => Math.min(prev + 1, totalBooksPages))}
                          className="px-3 py-1.5 bg-white border border-slate-150 text-slate-700 font-bold text-[10px] rounded-lg shadow-sm hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* --- TAB: VISUAL ANALYTICS BLOCK --- */}
            {tab === 'analytics' && (
              <div className="space-y-8">

                {/* Headers */}
                <div>
                  <h3 className="font-extrabold text-sm text-slate-850">Library Analytics & Insights</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Visualize user checkouts, book stock category densities, and top demand volumes.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Category Donut Card */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-slate-800">Book Distribution by Category</h4>
                      <p className="text-[9px] text-slate-400 mt-0.5">Ratio distribution based on overall copy stock counts.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-6">
                      {categoryStats.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 text-[10px]">No books registered yet.</div>
                      ) : (
                        <>
                          <div className="relative w-40 h-40 flex-shrink-0 flex items-center justify-center">
                            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                              {donutSegments.map((seg, idx) => (
                                <circle
                                  key={idx}
                                  cx="50"
                                  cy="50"
                                  r="40"
                                  fill="transparent"
                                  stroke={seg.color}
                                  strokeWidth="10"
                                  strokeDasharray="251.2"
                                  strokeDashoffset={seg.strokeOffset}
                                  className="transition-all duration-300 hover:stroke-[12px] cursor-pointer"
                                />
                              ))}
                              <circle cx="50" cy="50" r="32" fill="#ffffff" />
                            </svg>
                            <div className="absolute text-center">
                              <span className="block text-base font-black text-slate-800 leading-none">
                                {stats.totalBooks}
                              </span>
                              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                Copies
                              </span>
                            </div>
                          </div>

                          <div className="flex-grow space-y-2 w-full sm:w-auto">
                            {donutSegments.slice(0, 5).map((seg, idx) => (
                              <div key={idx} className="flex items-center justify-between text-[10px]">
                                <div className="flex items-center gap-2">
                                  <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
                                  <span className="font-semibold text-slate-650 capitalize truncate max-w-[100px]">{seg.name}</span>
                                </div>
                                <span className="font-bold text-slate-400">{seg.count} ({seg.percent}%)</span>
                              </div>
                            ))}
                            {donutSegments.length > 5 && (
                              <div className="text-[9px] text-slate-400 text-center font-semibold pt-1 border-t border-slate-50">
                                + {donutSegments.length - 5} more categories
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Daily Comparison Bar Chart */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-slate-800">Daily Requests vs Returns</h4>
                      <p className="text-[9px] text-slate-400 mt-0.5">Borrow requests created vs return submissions validated (Last 7 Days).</p>
                    </div>

                    <div className="mt-8 flex flex-col justify-end h-40">
                      <div className="flex items-end justify-between gap-4 h-32 border-b border-slate-100 pb-2 pl-2">
                        {dailyStats.days.map((day, idx) => {
                          const reqHeight = `${(day.requests / dailyStats.maxVal) * 100}%`;
                          const retHeight = `${(day.returns / dailyStats.maxVal) * 100}%`;
                          return (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group/bar relative">
                              <div className="flex items-end gap-1.5 w-full justify-center h-full">
                                {/* Requests Column */}
                                <div
                                  style={{ height: reqHeight }}
                                  className="w-2.5 bg-sky-500 rounded-t-sm hover:brightness-105 transition-all relative group/req"
                                >
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/req:block bg-slate-900/90 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-lg whitespace-nowrap z-10">
                                    {day.requests} Req
                                  </div>
                                </div>
                                {/* Returns Column */}
                                <div
                                  style={{ height: retHeight }}
                                  className="w-2.5 bg-indigo-500 rounded-t-sm hover:brightness-105 transition-all relative group/ret"
                                >
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/ret:block bg-slate-900/90 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-lg whitespace-nowrap z-10">
                                    {day.returns} Ret
                                  </div>
                                </div>
                              </div>
                              <span className="text-[8px] font-bold text-slate-450 whitespace-nowrap">{day.dateStr}</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex gap-4 mt-3 justify-center text-[9px] font-bold">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded bg-sky-500" />
                          <span className="text-slate-500">Book Requests</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded bg-indigo-500" />
                          <span className="text-slate-500">Book Returns</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Most Borrowed Shelf Leaderboard */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <div>
                    <h4 className="font-bold text-xs text-slate-800">Most Borrowed Books of the Month</h4>
                    <p className="text-[9px] text-slate-400 mt-0.5">Top-ranked inventory assets with active borrows count.</p>
                  </div>

                  {topBorrowedBooks.length === 0 ? (
                    <div className="text-center py-10 border border-dashed border-slate-100 rounded-xl mt-6 text-slate-400 text-[10px]">
                      No transaction history tracked yet. Keep requesting to see leaderboard stats.
                    </div>
                  ) : (
                    <div className="mt-6 space-y-4">
                      {topBorrowedBooks.map((item, idx) => {
                        const maxCount = topBorrowedBooks[0].borrowCount || 1;
                        const percentage = Math.round((item.borrowCount / maxCount) * 100);
                        return (
                          <div key={item.id} className="flex items-center gap-4 bg-slate-50/50 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                            {/* Rank Medal */}
                            <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black ${idx === 0 ? 'bg-amber-100 text-amber-700' :
                                idx === 1 ? 'bg-slate-200 text-slate-700' :
                                  idx === 2 ? 'bg-amber-50 text-amber-600' :
                                    'bg-slate-100 text-slate-500'
                              }`}>
                              #{idx + 1}
                            </div>

                            {/* Book cover */}
                            <div className="h-10 w-7 bg-sky-50 rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                              {item.cover ? (
                                <img src={item.cover} className="h-full w-full object-cover" alt="" />
                              ) : <FiBook className="text-[#a5b4fc] text-xs" />}
                            </div>

                            {/* Details & Rank bar */}
                            <div className="flex-grow min-w-0">
                              <div className="flex items-center justify-between gap-4">
                                <div className="truncate">
                                  <h5 className="font-extrabold text-slate-800 text-[10px] truncate leading-tight">{item.title}</h5>
                                  <p className="text-[8px] text-slate-450 capitalize mt-0.5">by {item.author}</p>
                                </div>
                                <span className="text-[9px] font-black text-slate-650 whitespace-nowrap bg-white px-2 py-0.5 border border-slate-100 rounded-full">
                                  {item.borrowCount} Borrows
                                </span>
                              </div>
                              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                                <div
                                  style={{ width: `${percentage}%` }}
                                  className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* --- TAB: EVENTS/ANNOUNCEMENTS BLOCK --- */}
            {tab === 'events' && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">

                {/* Event headers and add button */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-850">Events & Bulletins</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Post schedules, book clubs, panel meetings, or announcement feeds.</p>
                  </div>
                  <button
                    onClick={() => setIsEventModalOpen(true)}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/10 transition"
                  >
                    <HiOutlinePlus /> Post Announcement Event
                  </button>
                </div>

                {adminEvents.length === 0 ? (
                  <div className="text-center py-16 border-2 border-dashed border-slate-100 rounded-2xl text-slate-400">
                    <HiOutlineSpeakerphone className="text-5xl mx-auto mb-3 text-slate-300" />
                    <p className="text-xs font-bold text-slate-700">No custom events posted yet</p>
                    <p className="text-[10px] mt-0.5">Events published here display dynamically on the user dashboard and homepage.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {adminEvents.map((evt) => (
                      <div key={evt.id} className="bg-slate-50 p-4 border border-slate-100 rounded-xl flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                            <HiOutlineCalendar />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-slate-800 text-xs">{evt.title}</h4>
                            <p className="text-[10px] text-slate-500 mt-1 capitalize leading-relaxed">{evt.description}</p>
                            <p className="text-[9px] text-slate-400 mt-1.5">
                              {evt.date} @ {evt.time} • Room: {evt.location} • Speaker: <span className="font-bold text-slate-700">{evt.speaker}</span>
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteEvent(evt.id)}
                          className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition"
                          title="Remove event post"
                        >
                          <HiOutlineTrash className="text-xs" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* --- ADD / EDIT BOOK MODAL DIAG --- */}
      {
        isBookModalOpen && (
          <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <form
              onSubmit={handleBookSubmit}
              className="bg-white rounded-3xl overflow-hidden max-w-md w-full shadow-2xl border border-slate-100 flex flex-col relative animate-in fade-in zoom-in-95 duration-200"
            >
              <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
                <h3 className="font-black text-slate-800 text-base">
                  {editingBook ? 'Edit Book Register' : 'Register Book in DB'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="h-8 w-8 bg-slate-50 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition cursor-pointer"
                >
                  <FiX />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto no-scrollbar">

                {/* Form Input fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Book Title*</label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={bookFormData.title}
                      onChange={handleBookInputChange}
                      placeholder="Clean Code"
                      className="w-full border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Author Name*</label>
                    <input
                      type="text"
                      name="author"
                      required
                      value={bookFormData.author}
                      onChange={handleBookInputChange}
                      placeholder="Robert Martin"
                      className="w-full border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 text-xs text-slate-800 capitalize"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Category / Group*</label>
                    <input
                      type="text"
                      name="category"
                      required
                      value={bookFormData.category}
                      onChange={handleBookInputChange}
                      placeholder="Programming"
                      className="w-full border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Stock Copies*</label>
                    <input
                      type="number"
                      name="copies"
                      required
                      value={bookFormData.copies}
                      onChange={handleBookInputChange}
                      placeholder="5"
                      className="w-full border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 text-xs text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">ISBN Code*</label>
                  <input
                    type="text"
                    name="isbn"
                    required
                    disabled={!!editingBook} // Cannot edit ISBN after insertion
                    value={bookFormData.isbn}
                    onChange={handleBookInputChange}
                    placeholder="978-0132350884"
                    className="w-full border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 text-xs text-slate-800 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Brief Description (Optional)</label>
                  <textarea
                    name="description"
                    rows="3"
                    value={bookFormData.description}
                    onChange={handleBookInputChange}
                    placeholder="Summarize the core focus of this library asset..."
                    className="w-full border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-medium"
                  />
                </div>

                {/* Cover File Selector */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Book Cover Photo*</label>
                  <div className="flex gap-4 items-center">
                    <div className="h-20 w-14 bg-slate-50 rounded-xl border border-slate-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {coverPreview ? (
                        <img src={coverPreview} className="h-full w-full object-cover" alt="" />
                      ) : <HiOutlineBookOpen className="text-slate-350 text-xl" />}
                    </div>
                    <label className="flex-grow flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 hover:border-sky-350 rounded-2xl py-6 cursor-pointer hover:bg-sky-50/10 transition leading-none text-xs font-bold text-slate-500">
                      <FiUpload /> Choose Cover File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBookFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

              </div>

              <div className="px-6 py-4.5 border-t border-slate-50 bg-slate-50/40 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-500 font-bold hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingBook}
                  className="px-5 py-2 rounded-xl text-xs text-white font-bold bg-sky-500 hover:bg-sky-600 shadow-md shadow-sky-500/10 transition disabled:opacity-50"
                >
                  {submittingBook ? 'Uploading file...' : editingBook ? 'Save Changes' : 'Register Book'}
                </button>
              </div>
            </form>
          </div>
        )
      }

      {/* --- ADD CUSTOM EVENT MODAL --- */}
      {
        isEventModalOpen && (
          <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <form
              onSubmit={handleEventSubmit}
              className="bg-white rounded-3xl overflow-hidden max-w-md w-full shadow-2xl border border-slate-100 flex flex-col relative animate-in fade-in zoom-in-95 duration-200"
            >
              <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
                <h3 className="font-black text-slate-800 text-base">Post Announcement Event</h3>
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="h-8 w-8 bg-slate-50 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition cursor-pointer"
                >
                  <FiX />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto no-scrollbar">

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Event Title*</label>
                  <input
                    type="text"
                    required
                    value={eventFormData.title}
                    onChange={(e) => setEventFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Programming Seminar"
                    className="w-full border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 text-xs text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date*</label>
                    <input
                      type="text"
                      required
                      value={eventFormData.date}
                      onChange={(e) => setEventFormData(prev => ({ ...prev, date: e.target.value }))}
                      placeholder="Aug 21, 2026"
                      className="w-full border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 text-xs text-slate-805"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Time*</label>
                    <input
                      type="text"
                      required
                      value={eventFormData.time}
                      onChange={(e) => setEventFormData(prev => ({ ...prev, time: e.target.value }))}
                      placeholder="2:00 PM - 5:00 PM"
                      className="w-full border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 text-xs text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Venue Location*</label>
                    <input
                      type="text"
                      required
                      value={eventFormData.location}
                      onChange={(e) => setEventFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Central Seminar Hall 102"
                      className="w-full border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Host/Speaker Name*</label>
                    <input
                      type="text"
                      required
                      value={eventFormData.speaker}
                      onChange={(e) => setEventFormData(prev => ({ ...prev, speaker: e.target.value }))}
                      placeholder="Priya Nair"
                      className="w-full border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 text-xs text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Category*</label>
                  <select
                    value={eventFormData.category}
                    onChange={(e) => setEventFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 text-xs text-slate-800"
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="Symposium">Symposium</option>
                    <option value="Conference">Conference</option>
                    <option value="Exhibition">Exhibition</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Long Description*</label>
                  <textarea
                    required
                    rows="3"
                    value={eventFormData.description}
                    onChange={(e) => setEventFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the schedule details, requirements, topics covered, and reservation procedures..."
                    className="w-full border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-medium"
                  />
                </div>

              </div>

              <div className="px-6 py-4.5 border-t border-slate-50 bg-slate-50/40 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-500 font-bold hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs text-white font-bold bg-indigo-500 hover:bg-indigo-600 shadow-md shadow-indigo-500/10 transition"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        )
      }
    </div >
  );
}

export default AdminDashboard;
