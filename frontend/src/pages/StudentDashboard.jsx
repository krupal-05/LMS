import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  HiOutlineBookOpen,
  HiOutlineUser,
  HiOutlineCollection,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineRefresh,
  HiOutlineSearch,
} from 'react-icons/hi';
import { FiBook, FiArrowLeft, FiDollarSign } from 'react-icons/fi';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const statusConfig = {
  pending: { label: 'Pending', bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  approved: { label: 'Active', bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
  returned: { label: 'Returned', bg: 'bg-sky-100', text: 'text-sky-700', dot: 'bg-sky-500' },
  rejected: { label: 'Rejected', bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || statusConfig.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${cfg.bg} ${cfg.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const isOverdue = (dueDate) => dueDate && new Date(dueDate) < new Date();

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4`}>
    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon className="text-2xl text-white" />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

// ─── Book Card ────────────────────────────────────────────────────────────────
const BookCard = ({ book, myIssues, onRequest, requesting }) => {
  const myIssue = myIssues.find(
    (i) => (i.book?._id || i.book) === book._id && ['pending', 'approved'].includes(i.status)
  );
  const isUnavailable = book.availableCopies <= 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
      <div className="h-48 bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center overflow-hidden">
        {book.cover?.url ? (
          <img src={book.cover.url} alt={book.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <HiOutlineBookOpen className="text-6xl text-sky-300" />
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-800 text-sm truncate mb-0.5">{book.title}</h3>
        <p className="text-xs text-gray-500 capitalize mb-1">{book.author}</p>
        <span className="text-xs bg-sky-50 text-sky-600 font-semibold px-2 py-0.5 rounded-full capitalize">{book.category}</span>
        <div className="flex items-center justify-between mt-3">
          <span className={`text-xs font-semibold ${book.availableCopies > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {book.availableCopies} / {book.copies} copies
          </span>
          {myIssue ? (
            <StatusBadge status={myIssue.status} />
          ) : (
            <button
              disabled={isUnavailable || requesting === book._id}
              onClick={() => onRequest(book._id)}
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              {requesting === book._id ? (
                <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : <FiBook className="text-xs" />}
              {isUnavailable ? 'Unavailable' : 'Request'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── My Book Row ──────────────────────────────────────────────────────────────
const MyBookRow = ({ issue, onReturn, returning }) => {
  const overdue = issue.status === 'approved' && isOverdue(issue.dueDate);
  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-4 ${overdue ? 'border-red-200 bg-red-50/30' : 'border-gray-100'}`}>
      <div className="h-16 w-12 rounded-lg overflow-hidden bg-sky-50 flex-shrink-0 flex items-center justify-center">
        {issue.book?.cover?.url ? (
          <img src={issue.book.cover.url} alt="" className="h-full w-full object-cover" />
        ) : (
          <HiOutlineBookOpen className="text-2xl text-sky-300" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-800 text-sm truncate">{issue.book?.title || 'Book'}</p>
        <p className="text-xs text-gray-500 capitalize">{issue.book?.author}</p>
        <div className="flex flex-wrap gap-2 mt-1">
          {issue.issueDate && <span className="text-xs text-gray-500">Issued: {formatDate(issue.issueDate)}</span>}
          {issue.dueDate && issue.status === 'approved' && (
            <span className={`text-xs font-semibold flex items-center gap-1 ${overdue ? 'text-red-600' : 'text-amber-600'}`}>
              <HiOutlineClock />
              {overdue ? 'Overdue! ' : 'Due: '}{formatDate(issue.dueDate)}
            </span>
          )}
          {issue.returnDate && <span className="text-xs text-sky-600">Returned: {formatDate(issue.returnDate)}</span>}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {issue.fineAmount > 0 && issue.fineStatus === 'unpaid' && (
          <button
            onClick={() => onPayFine(issue._id)}
            className="px-2.5 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-[10px] font-bold transition flex items-center gap-1 shadow-sm shadow-red-500/10"
          >
            Pay Fine
          </button>
        )}
        <StatusBadge status={issue.status} />
      </div>
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const StudentDashboard = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('browse');
  const [books, setBooks] = useState([]);
  const [myIssues, setMyIssues] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [sortBy, setSortBy] = useState('title-asc');
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingIssues, setLoadingIssues] = useState(true);
  const [requesting, setRequesting] = useState(null);
  const [returning, setReturning] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchBooks = useCallback(async () => {
    setLoadingBooks(true);
    try {
      const res = await api.get('/books/get-all-Books');
      setBooks(res.data?.data || []);
    } catch {
      toast.error('Failed to load books.');
    } finally {
      setLoadingBooks(false);
    }
  }, []);

  const fetchMyIssues = useCallback(async () => {
    setLoadingIssues(true);
    try {
      const res = await api.get('/books/my-issues');
      setMyIssues(res.data?.data || []);
    } catch (err) {
      if (err.response?.status !== 404) toast.error('Failed to load your books.');
      setMyIssues([]);
    } finally {
      setLoadingIssues(false);
    }
  }, []);

  const handlePayFine = async (issueId) => {
    try {
      await api.post(`/books/pay-fine/${issueId}`, {});
      toast.success('Fine paid successfully!');
      fetchMyIssues();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Fine payment failed.');
    }
  };

  useEffect(() => { fetchBooks(); fetchMyIssues(); }, [fetchBooks, fetchMyIssues]);

  const handleRequest = async (bookId) => {
    setRequesting(bookId);
    try {
      await api.post(`/books/request/${bookId}`);
      toast.success('Book request sent! Waiting for admin approval.');
      fetchMyIssues();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Request failed.');
    } finally {
      setRequesting(null);
    }
  };

  const handleReturn = async (issueId) => {
    console.log("handleReturn called for issueId:", issueId);
    if (!issueId) {
      toast.error("Internal Error: Issue ID is undefined.");
      return;
    }
    setReturning(issueId);
    try {
      const res = await api.post(`/books/return/${issueId}`, {});
      console.log("Return response data:", res.data);
      toast.success('Book returned successfully!');
      fetchMyIssues();
      fetchBooks();
    } catch (err) {
      console.error("Return request failed:", err);
      toast.error(err.response?.data?.message || 'Return failed.');
    } finally {
      setReturning(null);
    }
  };

  // Get all unique categories dynamically
  const categories = useMemo(() => {
    const cats = books.map((b) => b.category?.toLowerCase()).filter(Boolean);
    return ['all', ...new Set(cats)];
  }, [books]);

  const filteredBooks = useMemo(() => {
    let result = [...books];

    // Search filter
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.title?.toLowerCase().includes(s) ||
          b.author?.toLowerCase().includes(s) ||
          b.category?.toLowerCase().includes(s)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((b) => b.category?.toLowerCase() === selectedCategory);
    }

    // Availability filter
    if (selectedAvailability === 'available') {
      result = result.filter((b) => b.availableCopies > 0);
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'title-asc':
          return (a.title || '').localeCompare(b.title || '');
        case 'title-desc':
          return (b.title || '').localeCompare(a.title || '');
        case 'author-asc':
          return (a.author || '').localeCompare(b.author || '');
        case 'available-desc':
          return b.availableCopies - a.availableCopies;
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [books, search, selectedCategory, selectedAvailability, sortBy]);

  // Reset page on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, selectedAvailability, sortBy]);

  const booksPerPage = 8;
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage) || 1;
  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * booksPerPage;
    return filteredBooks.slice(start, start + booksPerPage);
  }, [filteredBooks, currentPage]);

  // Stats
  const active = myIssues.filter(i => i.status === 'approved').length;
  const pending = myIssues.filter(i => i.status === 'pending').length;
  const returned = myIssues.filter(i => i.status === 'returned').length;
  const overdue = myIssues.filter(i => i.status === 'approved' && isOverdue(i.dueDate)).length;
  const unpaidFinesTotal = myIssues.reduce((sum, i) => sum + (i.fineStatus === 'unpaid' ? (i.fineAmount || 0) : 0), 0);

  const tabs = [
    { id: 'browse', label: 'Browse Books', icon: HiOutlineBookOpen },
    { id: 'mybooks', label: 'My Books', icon: HiOutlineCollection },
    { id: 'profile', label: 'Profile', icon: HiOutlineUser },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-amber-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl p-6 mb-8 text-white shadow-lg">
          <div className="flex items-center gap-4">
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="h-14 w-14 rounded-full object-cover ring-4 ring-white/30" />
            ) : (
              <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center">
                <HiOutlineUser className="text-3xl" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold capitalize">Welcome back, {user?.firstName}! 👋</h1>
              <p className="text-sky-100 text-sm mt-0.5">Library Management System — Student Portal</p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard icon={HiOutlineBookOpen} label="Total Borrowed" value={myIssues.length} color="bg-sky-500" />
          <StatCard icon={HiOutlineCheckCircle} label="Currently Active" value={active} color="bg-green-500" />
          <StatCard icon={HiOutlineClock} label="Pending Approval" value={pending} color="bg-amber-500" />
          <StatCard icon={HiOutlineXCircle} label="Overdue" value={overdue} color={overdue > 0 ? 'bg-red-500' : 'bg-gray-400'} />
          <StatCard icon={FiDollarSign} label="Fines Unpaid" value={`₹${unpaidFinesTotal}`} color={unpaidFinesTotal > 0 ? 'bg-rose-500 animate-pulse' : 'bg-slate-400'} />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === id
                ? 'bg-white text-sky-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <Icon className="text-base" />
              {label}
            </button>
          ))}
        </div>

        {/* ── Tab: Browse Books ── */}
        {tab === 'browse' && (
          <div>
            {/* Search and Filters Bar */}
            <div className="mb-6 space-y-4">
              {/* Main Search Row */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type="text"
                    id="book-search"
                    placeholder="Search by title, author or category..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setSearch(searchInput.trim());
                        setTab('browse');
                      }
                    }}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 text-gray-700 placeholder-gray-400 shadow-sm"
                  />
                </div>
                <button
                  onClick={() => setSearch(searchInput.trim())}
                  className="flex items-center gap-2 px-5 py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm rounded-xl shadow-sm transition-colors"
                >
                  <HiOutlineSearch className="text-base" />
                  Search
                </button>
                {(search || selectedCategory !== 'all' || selectedAvailability !== 'all' || sortBy !== 'title-asc') && (
                  <button
                    onClick={() => {
                      setSearch('');
                      setSearchInput('');
                      setSelectedCategory('all');
                      setSelectedAvailability('all');
                      setSortBy('title-asc');
                    }}
                    className="flex items-center gap-1.5 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold text-sm rounded-xl transition-colors border border-gray-200"
                  >
                    <HiOutlineXCircle className="text-base" />
                    Reset
                  </button>
                )}
              </div>

              {/* Keywords / Quick Search Chips */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-gray-400 mr-1">Quick Keywords:</span>
                {[
                  { label: 'Fiction', val: 'fiction' },
                  { label: 'Fantasy', val: 'fantasy' },
                  { label: 'Sci-Fi', val: 'science fiction' },
                  { label: 'Self-Help', val: 'self-help' },
                  { label: 'Computer Science', val: 'computer science' },
                  { label: 'Finance', val: 'finance' },
                  { label: 'History', val: 'history' },
                  { label: 'Psychology', val: 'psychology' }
                ].map((chip) => {
                  const isActive = search?.toLowerCase() === chip.val;
                  return (
                    <button
                      key={chip.label}
                      onClick={() => {
                        setSearchInput(chip.val);
                        setSearch(chip.val);
                      }}
                      className={`text-xs font-medium px-2.5 py-1 rounded-full transition-all ${isActive
                        ? 'bg-sky-500 text-white'
                        : 'bg-gray-150 hover:bg-gray-200 text-gray-600'
                        }`}
                    >
                      {chip.label}
                    </button>
                  );
                })}
              </div>

              {/* Filter and Sorting Controls */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                {/* Category Selection */}
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Category:</span>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full text-xs bg-white border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-200 capitalize font-semibold text-gray-700"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Availability Selection */}
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Availability:</span>
                  <select
                    value={selectedAvailability}
                    onChange={(e) => setSelectedAvailability(e.target.value)}
                    className="w-full text-xs bg-white border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-200 font-semibold text-gray-750"
                  >
                    <option value="all">Show All Books</option>
                    <option value="available">Available Only</option>
                  </select>
                </div>

                {/* Sorting Selection */}
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Sort By:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full text-xs bg-white border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-200 font-semibold text-gray-750"
                  >
                    <option value="title-asc">Title: A to Z</option>
                    <option value="title-desc">Title: Z to A</option>
                    <option value="author-asc">Author: A to Z</option>
                    <option value="available-desc">Available Copies</option>
                    <option value="newest">Recently Added</option>
                  </select>
                </div>
              </div>

              {/* Result Count and Applied Filters indicator */}
              {(search || selectedCategory !== 'all' || selectedAvailability !== 'all') && (
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                  <span>Filtered:</span>
                  <span className="font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">{filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} matched</span>
                  {search && <span className="bg-gray-100 px-2 py-0.5 rounded-md">Search: "{search}"</span>}
                  {selectedCategory !== 'all' && <span className="bg-gray-100 px-2 py-0.5 rounded-md capitalize">Category: {selectedCategory}</span>}
                  {selectedAvailability !== 'all' && <span className="bg-gray-100 px-2 py-0.5 rounded-md">Available Only</span>}
                </div>
              )}
            </div>

            {loadingBooks ? (
              <div className="flex justify-center py-20">
                <svg className="animate-spin h-8 w-8 text-sky-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <HiOutlineBookOpen className="text-6xl mx-auto mb-3" />
                <p className="text-lg font-semibold">No books found</p>
                <p className="text-sm">Try a different search term</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {paginatedBooks.map((book) => (
                    <BookCard
                      key={book._id}
                      book={book}
                      myIssues={myIssues}
                      onRequest={handleRequest}
                      requesting={requesting}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-8 pb-4">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold text-xs rounded-xl shadow-sm hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="text-xs font-bold text-gray-500">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold text-xs rounded-xl shadow-sm hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── Tab: My Books ── */}
        {tab === 'mybooks' && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-800">My Borrowed Books</h2>
              <button onClick={fetchMyIssues} className="flex items-center gap-1.5 text-sm text-sky-500 hover:text-sky-700 font-semibold transition">
                <HiOutlineRefresh /> Refresh
              </button>
            </div>

            {loadingIssues ? (
              <div className="flex justify-center py-20">
                <svg className="animate-spin h-8 w-8 text-sky-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              </div>
            ) : myIssues.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <HiOutlineCollection className="text-6xl mx-auto mb-3" />
                <p className="text-lg font-semibold">No books yet</p>
                <p className="text-sm">Browse and request a book to get started</p>
                <button onClick={() => setTab('browse')} className="mt-4 text-sm font-semibold text-sky-500 hover:underline flex items-center gap-1 mx-auto">
                  <FiArrowLeft /> Browse Books
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {myIssues.filter((i) => ['pending', 'approved'].includes(i.status) || (i.fineAmount > 0 && i.fineStatus === 'unpaid')).map((issue) => (
                  <MyBookRow
                    key={issue._id}
                    issue={issue}
                    onReturn={handleReturn}
                    returning={returning}
                    onPayFine={handlePayFine}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Profile ── */}
        {tab === 'profile' && (
          <div className="max-w-lg">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Cover strip */}
              <div className="h-24 bg-gradient-to-r from-sky-400 to-blue-500" />
              <div className="px-6 pb-6">
                <div className="-mt-10 mb-4">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="" className="h-20 w-20 rounded-full object-cover ring-4 ring-white shadow-md" />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-sky-100 ring-4 ring-white shadow-md flex items-center justify-center">
                      <HiOutlineUser className="text-3xl text-sky-500" />
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-800 capitalize">{user?.firstName} {user?.lastName}</h2>
                <p className="text-gray-500 text-sm mt-0.5">{user?.email}</p>
                <span className="inline-block mt-2 text-xs bg-amber-100 text-amber-700 font-bold px-3 py-1 rounded-full capitalize">{user?.role}</span>

                <hr className="my-4 border-gray-100" />

                <div className="space-y-3">
                  {[
                    { label: 'First Name', value: user?.firstName },
                    { label: 'Last Name', value: user?.lastName },
                    { label: 'Email', value: user?.email },
                    { label: 'Contact', value: user?.contact },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50">
                      <span className="text-sm text-gray-500 font-medium">{label}</span>
                      <span className="text-sm font-semibold text-gray-700 capitalize">{value || '—'}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                  {[
                    { label: 'Total', val: myIssues.length, color: 'text-sky-600' },
                    { label: 'Active', val: active, color: 'text-green-600' },
                    { label: 'Returned', val: returned, color: 'text-gray-600' },
                  ].map(({ label, val, color }) => (
                    <div key={label} className="bg-gray-50 rounded-xl py-3">
                      <p className={`text-2xl font-bold ${color}`}>{val}</p>
                      <p className="text-xs text-gray-500">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;

