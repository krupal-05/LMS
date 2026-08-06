import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

// Import Student Sub-components
import StudentHeader from '../components/student/StudentHeader';
import ActiveBorrowsTab from '../components/student/ActiveBorrowsTab';
import StudentCatalogTab from '../components/student/StudentCatalogTab';
import BorrowHistoryTab from '../components/student/BorrowHistoryTab';
import FinesPaymentTab from '../components/student/FinesPaymentTab';
import { FiGrid, FiBookOpen, FiClock, FiDollarSign } from 'react-icons/fi';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'catalog' | 'borrows' | 'fines'

  // Data States
  const [allBooks, setAllBooks] = useState([]);
  const [myIssues, setMyIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingFineId, setPayingFineId] = useState(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Fetch API Handlers
  const fetchAllBooks = useCallback(async () => {
    try {
      const res = await api.get('/books/get-all-Books', { params: { limit: 100 } });
      const booksPayload = res.data?.data;
      setAllBooks(Array.isArray(booksPayload?.books) ? booksPayload.books : Array.isArray(booksPayload) ? booksPayload : []);
    } catch {
      toast.error('Failed to load library catalog');
    }
  }, []);

  const fetchMyIssues = useCallback(async () => {
    try {
      const res = await api.get('/books/my-issues');
      setMyIssues(res.data?.data || []);
    } catch {
      toast.error('Failed to load your borrow history');
    }
  }, []);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchAllBooks(), fetchMyIssues()]);
    setLoading(false);
  }, [fetchAllBooks, fetchMyIssues]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Request Book Handler
  const handleRequestBook = async (bookId) => {
    try {
      await api.post(`/books/request/${bookId}`);
      toast.success('Book borrow request submitted to library staff!');
      fetchMyIssues();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to request book');
    }
  };

  // Pay Fine Handler
  const handlePayFine = async (issueId) => {
    try {
      setPayingFineId(issueId);
      const res = await api.post(`/books/pay-fine/${issueId}`);
      toast.success(res.data?.message || 'Fine payment successful!');
      fetchMyIssues();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to process fine payment');
    } finally {
      setPayingFineId(null);
    }
  };

  // Computed Summaries
  const approvedBorrows = useMemo(() => myIssues.filter((i) => i.status === 'approved'), [myIssues]);
  const pendingRequestsCount = useMemo(() => myIssues.filter((i) => i.status === 'pending').length, [myIssues]);
  const totalUnpaidFines = useMemo(
    () => myIssues.filter((i) => i.fineStatus === 'unpaid').reduce((sum, i) => sum + (i.fineAmount || 0), 0),
    [myIssues]
  );

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">
        {/* Welcome & Stats Header */}
        <StudentHeader
          user={user}
          activeBorrowsCount={approvedBorrows.length}
          pendingRequestsCount={pendingRequestsCount}
          totalUnpaidFines={totalUnpaidFines}
        />

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Overview', icon: FiGrid },
            { id: 'catalog', label: 'Browse Catalog', icon: FiBookOpen },
            { id: 'borrows', label: `My Borrows (${myIssues.length})`, icon: FiClock },
            { id: 'fines', label: `My Fines (₹${totalUnpaidFines})`, icon: FiDollarSign }
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

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <ActiveBorrowsTab
              approvedBorrows={approvedBorrows}
              onNavigateToCatalog={() => setActiveTab('catalog')}
            />
            <StudentCatalogTab
              books={allBooks}
              myIssues={myIssues}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              loading={loading}
              onRequestBook={handleRequestBook}
            />
          </div>
        )}

        {/* TAB 2: BROWSE CATALOG */}
        {activeTab === 'catalog' && (
          <StudentCatalogTab
            books={allBooks}
            myIssues={myIssues}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            loading={loading}
            onRequestBook={handleRequestBook}
          />
        )}

        {/* TAB 3: BORROW HISTORY */}
        {activeTab === 'borrows' && <BorrowHistoryTab myIssues={myIssues} />}

        {/* TAB 4: FINES PAYMENT */}
        {activeTab === 'fines' && (
          <FinesPaymentTab
            myIssues={myIssues}
            onPayFine={handlePayFine}
            payingFineId={payingFineId}
          />
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
