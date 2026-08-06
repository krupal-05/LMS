import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiBookOpen,
  FiSearch,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiStar,
  FiZap,
  FiUsers,
  FiShield,
  FiArrowRight,
  FiBookmark,
  FiLayers,
  FiHelpCircle,
  FiAward,
  FiTrendingUp,
  FiCheckCircle
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import api from '../services/api';
import Navbar from '../components/layout/Navbar';
import BookCard from '../components/cards/BookCard';
import HappeningHero from '../components/home/HappeningHero';
import WorkingHoursSection from '../components/home/WorkingHoursSection';
import LibraryRulesSection from '../components/home/LibraryRulesSection';
import StatCard from '../components/cards/StatCard';
import FaqAccordion from '../components/ui/FaqAccordion';
import EmptyState from '../components/ui/EmptyState';
import { BookCardSkeleton } from '../components/ui/Skeleton';
import Modal from '../components/ui/Modal';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeCollectionTab, setActiveCollectionTab] = useState('trending'); // 'trending' | 'recent' | 'popular'

  // Data States
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Real-time Database Statistics State
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalMembers: 0,
    activeBorrows: 0,
    completedBorrows: 0
  });

  const defaultEvents = [
    {
      id: 1,
      title: 'Annual Tech Book Fair 2026',
      date: 'July 28, 2026',
      time: '10:00 AM - 4:00 PM',
      location: 'Central Library Hall A',
      image: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=600&auto=format&fit=crop',
      category: 'Exhibition',
      description:
        'Explore recent technical publications, engineering manuals, and digital textbooks with exclusive institutional discounts.',
      speaker: 'Dr. Arvind Pathak (Tech Advisor)'
    },
    {
      id: 2,
      title: 'AI & Neural Networks Symposium',
      date: 'August 12, 2026',
      time: '2:00 PM - 5:00 PM',
      location: 'Seminar Room 102',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop',
      category: 'Symposium',
      description:
        'Deep-dive into machine learning architectures, LLM fine-tuning, and research methodologies with industry experts.',
      speaker: 'Er. Priya Nair (Principal AI Architect)'
    },
    {
      id: 3,
      title: 'Academic Thesis & Citation Workshop',
      date: 'September 02, 2026',
      time: '11:00 AM - 1:00 PM',
      location: 'East Wing Lab 3',
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=600&auto=format&fit=crop',
      category: 'Workshop',
      description:
        'Master paper archiving, IEEE database searches, and automated reference management in your institutional research.',
      speaker: 'Dr. Clara Mendoza (Research Lead)'
    }
  ];

  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [pagination, setPagination] = useState({ totalBooks: 0, totalPages: 1, hasNextPage: false, hasPrevPage: false });

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/books/get-all-Books', {
        params: {
          page,
          limit,
          search: searchQuery,
          category: selectedCategory
        }
      });
      const dataPayload = res.data?.data;
      if (dataPayload && Array.isArray(dataPayload.books)) {
        setBooks(dataPayload.books);
        setPagination(dataPayload.pagination || { totalBooks: dataPayload.books.length, totalPages: 1 });
      } else if (Array.isArray(dataPayload)) {
        setBooks(dataPayload);
        setPagination({ totalBooks: dataPayload.length, totalPages: 1, hasNextPage: false, hasPrevPage: false });
      } else {
        setBooks([]);
      }
    } catch (err) {
      console.error('Failed to load books catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get('/books/stats');
      if (res.data?.data) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load library real-time statistics:', err);
    }
  };

  const [events, setEvents] = useState(defaultEvents);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      const apiEvents = res.data?.data;
      if (Array.isArray(apiEvents) && apiEvents.length > 0) {
        setEvents(apiEvents);
      }
    } catch (err) {
      console.error('Failed to fetch events from backend:', err);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBooks();
    fetchStats();
    fetchEvents();
  }, [page, selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBooks();
  };

  const categories = ['all', 'computer science', 'fiction', 'engineering', 'science', 'general'];

  const handleRequestBook = (bookId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/student/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950">
      <Navbar />

      {/* SECTION 1: WHAT'S HAPPENING AT THE LIBRARY HERO */}
      <HappeningHero
        events={events}
        books={books}
        stats={stats}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearchSubmit={handleSearchSubmit}
        setSelectedCategory={setSelectedCategory}
        setPage={setPage}
        onRequestBook={handleRequestBook}
        onScrollToEvents={() => {
          const el = document.getElementById('events-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onScrollToCatalog={() => {
          const el = document.getElementById('catalog-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

        {/* SECTION 2: LIVE METRIC CARDS WITH NUMBER SCROLLING COUNTERS */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <StatCard
              title="Catalog Inventory"
              numericValue={stats.totalBooks}
              suffix=" Books"
              icon={FiBookOpen}
              color="cyan"
              subtext="Verified holdings in database"
            />
            <StatCard
              title="Registered Members"
              numericValue={stats.totalMembers}
              suffix=" Students"
              icon={FiUsers}
              color="emerald"
              subtext="Active library members"
            />
            <StatCard
              title="Active Borrows"
              numericValue={stats.activeBorrows}
              suffix=" Issued"
              icon={FiZap}
              color="amber"
              subtext="Currently checked out"
            />
            <StatCard
              title="Completed Returns"
              numericValue={stats.completedBorrows}
              suffix=" Returned"
              icon={FiShield}
              color="purple"
              subtext="Circulation volume"
            />
          </div>
        </div>

      {/* SECTION 3: CURATED COLLECTIONS SHOWCASE (EDITORIAL CAROUSEL) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-1">
                <FiTrendingUp className="w-3.5 h-3.5" /> Curated Collections
              </span>
              <h2 className="text-2xl font-extrabold text-slate-100 mt-1">Institutional Spotlight Titles</h2>
            </div>

            {/* Collection Tabs Switcher */}
            <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
              {[
                { id: 'trending', label: '🔥 Most Borrowed' },
                { id: 'recent', label: '✨ Recently Added' },
                { id: 'popular', label: '⭐ Top Rated' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCollectionTab(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeCollectionTab === tab.id
                      ? 'bg-gradient-accent text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Books Row Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {books.slice(0, 4).map((book, idx) => (
              <BookCard key={book._id || `preview-${idx}`} book={book} userRole={user?.role} onRequest={handleRequestBook} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: MAIN CATALOG EXPLORER GRID */}
      <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <FiLayers className="text-cyan-400" /> Book Catalog Explorer
            </h2>
            <p className="text-xs text-slate-400 mt-1">Browse available institutional titles and check live stock levels</p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all cursor-pointer ${selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <BookCardSkeleton key={n} />
            ))}
          </div>
        ) : books.length === 0 ? (
          <EmptyState
            icon={FiBookOpen}
            title="No matching books found"
            description="We couldn't find any books matching your search or category filter. Try clearing filters or searching another title."
            actionLabel="Reset Filters"
            onAction={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setPage(1);
            }}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {books.map((book, idx) => (
                <BookCard
                  key={book._id || `catalog-${idx}`}
                  book={book}
                  userRole={user?.role}
                  onRequest={handleRequestBook}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between pt-8 border-t border-slate-800/80 mt-6">
                <span className="text-xs text-slate-400 font-mono">
                  Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalBooks} Total Books)
                </span>

                <div className="flex items-center gap-2">
                  <button
                    disabled={!pagination.hasPrevPage}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-cyan-400 hover:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    ← Previous
                  </button>
                  <button
                    disabled={!pagination.hasNextPage}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-cyan-400 hover:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* SECTION 5: LIBRARY OPERATING SCHEDULE & WORKING HOURS */}
      <WorkingHoursSection />

      {/* SECTION 6: UPCOMING LIBRARY EVENTS & WORKSHOPS */}
      <section id="events-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full border-t border-slate-800/80">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <FiCalendar className="text-cyan-400" /> Upcoming Library Events & Workshops
          </h2>
          <p className="text-xs text-slate-400 mt-1">Participate in author summits, technical symposiums, and research workshops</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((evt) => (
            <motion.div
              key={evt.id}
              whileHover={{ y: -3 }}
              onClick={() => setSelectedEvent(evt)}
              className="glass-card rounded-2xl p-5 border border-slate-800/80 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-slate-950 relative">
                  <img
                    src={evt.image}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-cyan-400 border border-cyan-500/30">
                    {evt.category}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">
                  {evt.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">{evt.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <FiCalendar className="text-cyan-400" /> {evt.date}
                </span>
                <span className="font-semibold text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Details <FiArrowRight />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 7: INSTITUTIONAL LIBRARY CODE OF CONDUCT & RULES */}
      <LibraryRulesSection />

      {/* SECTION 8: INSTITUTIONAL LIBRARY POLICIES & FAQ ACCORDION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full border-t border-slate-800/80">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">Library Guidelines & Policies</h2>
            <p className="text-xs sm:text-sm text-slate-400">Everything you need to know about borrowing durations, fine rates, and book renewals.</p>
          </div>

          <FaqAccordion />
        </div>
      </section>

      {/* Event Details Modal */}
      <Modal
        isOpen={Boolean(selectedEvent)}
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent?.title || 'Event Details'}
      >
        {selectedEvent && (
          <div className="space-y-4">
            <img
              src={selectedEvent.image}
              alt={selectedEvent.title}
              className="w-full h-48 object-cover rounded-xl border border-slate-800"
            />
            <div className="flex flex-wrap gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1 text-cyan-400">
                <FiCalendar /> {selectedEvent.date}
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <FiClock /> {selectedEvent.time}
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <FiMapPin /> {selectedEvent.location}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{selectedEvent.description}</p>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <span className="text-slate-400">Featured Speaker:</span>{' '}
              <span className="font-bold text-slate-100">{selectedEvent.speaker}</span>
            </div>
          </div>
        )}
      </Modal>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FiBookOpen className="text-cyan-400 w-4 h-4" />
            <span className="font-bold text-slate-300">LMS SaaS Suite</span> — Institutional Library Infrastructure
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>🟢 All Systems Operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;