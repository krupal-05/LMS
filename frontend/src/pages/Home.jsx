import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineBookOpen,
  HiOutlineSearch,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiOutlineStar,
  HiOutlineLightningBolt,
  HiOutlineUserGroup,
  HiOutlineShieldCheck
} from 'react-icons/hi';
import { FiArrowRight, FiBookOpen, FiBookmark, FiGlobe, FiX } from 'react-icons/fi';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Auto scroll top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect to books search or student dashboard browse
      if (user) {
        navigate(`/student/dashboard?search=${encodeURIComponent(searchQuery)}`);
      } else {
        navigate(`/login?redirect=books&search=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  const [events, setEvents] = useState([]);

  // Mock Events & Announcements
  const defaultEvents = [
    {
      id: 1,
      title: "Annual Tech Book Fair 2026",
      date: "July 28, 2026",
      time: "10:00 AM - 4:00 PM",
      location: "Central Library Hall A",
      image: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=600&auto=format&fit=crop",
      category: "Exhibition",
      description: "Join us for the largest tech book exhibition this year. Meet prominent tech publishers, explore the latest releases in Computer Science, Artificial Intelligence, and Software Engineering, and enjoy exclusive member discounts up to 40% on digital textbooks.",
      speaker: "Dr. Arvind Pathak (Tech Advisor @ GOOG)"
    },
    {
      id: 2,
      title: "AI & Neural Networks Symposium",
      date: "August 12, 2026",
      time: "2:00 PM - 5:00 PM",
      location: "Seminar Room 102",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop",
      category: "Symposium",
      description: "Dive deep into the mechanics of neural networks, Large Language Models (LLMs), and generative AI. This interactive session includes coding demonstrations, live model training insights, and a Q&A session with industry practitioners.",
      speaker: "Er. Priya Nair (Principal AI Architect)"
    },
    {
      id: 3,
      title: "Creative Writing Workshop",
      date: "September 02, 2026",
      time: "11:00 AM - 1:00 PM",
      location: "East Wing Lounge",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=600&auto=format&fit=crop",
      category: "Workshop",
      description: "Unleash your inner novelist! Learn character development, plots structures, pacing, and publisher-pitching strategies from award-winning novelists. Registration is free but seats are heavily limited.",
      speaker: "Writer Vikram Seth"
    },
    {
      id: 4,
      title: "Global Research & e-Learning Meet",
      date: "September 15, 2026",
      time: "9:30 AM - 12:30 PM",
      location: "Virtual (Zoom / LMS Portal)",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop",
      category: "Conference",
      description: "Learn how to effectively leverage university research archives, IEEE databases, Scopus journals, and digital bookmarks inside the LMS portal to speed up your thesis papers and software patents.",
      speaker: "Dr. Clara Mendoza (Global Research Lead)"
    }
  ];

  // Load custom admin-published events on mount
  useEffect(() => {
    const saved = localStorage.getItem('lms_custom_events');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEvents([...parsed, ...defaultEvents]);
          return;
        }
      } catch (err) {
        console.error("Failed to parse custom events:", err);
      }
    }
    setEvents(defaultEvents);
  }, []);

  // Mock Books for Carousel Marquee 
  const marqueeBooks = [
    { title: "Clean Code", author: "Robert C. Martin", category: "Programming" },
    { title: "Introduction to Algorithms", author: "Cormen, Leiserson", category: "Computer Science" },
    { title: "Design Patterns", author: "Gang of Four", category: "Software" },
    { title: "Atomic Habits", author: "James Clear", category: "Self-Help" },
    { title: "Zero to One", author: "Peter Thiel", category: "Finance" },
    { title: "The Pragmatic Programmer", author: "David Thomas", category: "Development" },
    { title: "Sapiens", author: "Yuval Noah Harari", category: "History" },
    { title: "Deep Work", author: "Cal Newport", category: "Productivity" },
    { title: "Eloquent JavaScript", author: "Marijn Haverbeke", category: "Web Dev" }
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Rohit Sharma",
      role: "M.Tech CSE Student",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
      text: "The new digital request engine is a lifesaver! I can reserve research textbooks right from my couch and pick them up ten minutes later."
    },
    {
      name: "Sneha Patel",
      role: "B.Tech IT Student",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
      text: "I love the clean aesthetic of the new layout! Checking due dates, requesting extensions, or viewing the catalog takes seconds now."
    },
    {
      name: "Aditya Roy",
      role: "Research Scholar",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
      text: "The admin dashboard is super responsive. Book updates reflect instant statuses on our side. It makes academic research vastly smoother."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-sky-500/20 selection:text-sky-850">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-gray-900 overflow-hidden px-4 py-20 text-white">
        {/* Background Image with darken layer */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2000&auto=format&fit=crop"
            alt="Library Hall"
            className="w-full h-full object-cover opacity-30 transform scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/90 to-sky-950/70" />
        </div>

        {/* Ambient details */}
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-sky-500/10 blur-[130px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[15%] w-[50%] h-[50%] bg-blue-600/10 blur-[140px] rounded-full" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-sky-500/15 border border-sky-500/30 text-sky-350 tracking-wider uppercase animate-pulse">
            <HiOutlineLightningBolt /> Intelligent Knowledge Center
          </span>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight select-none">
            Empowering Minds With <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 font-black">
              Seamless Digital Libraries
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-350 leading-relaxed font-light">
            Search, borrow, and track physical and digital contents automatically. Experience the next generation LMS designed for students and administrators.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto bg-slate-900/60 backdrop-blur-md p-2 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-2">
            <div className="relative flex-1">
              <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400 text-lg" />
              <input
                type="text"
                placeholder="Search by book title, author, category or ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-sky-500 hover:bg-sky-600 transition-colors font-bold text-sm text-white rounded-xl shadow-lg shadow-sky-500/20 flex items-center gap-1.5"
            >
              Search
            </button>
          </form>

          {/* Core Features Overview */}

        </div>
      </section>

      {/* --- SCROLLING BOOK MARQUEE --- */}
      <section className="bg-slate-950 py-6 overflow-hidden border-y border-white/5 relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

        {/* Double array for infinite marquee looping */}
        <div className="animate-loop-scroll">
          {[...marqueeBooks, ...marqueeBooks].map((book, idx) => (
            <div
              key={idx}
              className="mx-6 px-5 py-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 text-left cursor-default transition-all duration-300 flex items-center gap-3"
            >
              <div className="h-8 w-8 rounded bg-sky-500/10 flex items-center justify-center text-sky-400">
                <HiOutlineBookOpen />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-50 leading-tight">{book.title}</p>
                <p className="text-[10px] text-slate-400 mt-0.5 capitalize">{book.author} • <span className="text-sky-450">{book.category}</span></p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- NEWS & EVENTS SECTION --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold text-sky-500 uppercase tracking-widest">Stay Updated</span>
            <h2 className="text-3xl font-extrabold text-slate-800 mt-2">Latest Events & Announcements</h2>
          </div>
          <p className="text-sm text-slate-500 max-w-sm mt-3 sm:mt-0">
            Click on any event below to view guest speakers, scheduling info, and registration details.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group flex flex-col h-full"
            >
              {/* Event Cover Image */}
              <div className="h-44 bg-slate-100 relative overflow-hidden flex-shrink-0">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-sky-500 text-white px-2.5 py-1 rounded-full shadow-md">
                  {event.category}
                </span>
              </div>

              {/* Event Content */}
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-2.5">
                  <HiOutlineCalendar className="text-sky-500 text-sm" />
                  {event.date}
                </div>
                <h3 className="font-bold text-slate-800 text-base group-hover:text-sky-600 transition-colors line-clamp-2 leading-snug">
                  {event.title}
                </h3>
                <p className="text-xs text-slate-500 mt-3 line-clamp-3 leading-relaxed flex-grow">
                  {event.description}
                </p>
                <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-sky-500">
                  <span>View Details</span>
                  <FiArrowRight className="text-sm group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- SERVICES SECTION --- */}
      <section className="bg-slate-50 bg-gradient-to-b from-slate-100 to-white py-20 border-t border-slate-205/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-sky-500 uppercase tracking-widest">LMS Ecosystem</span>
            <h2 className="text-3xl font-extrabold text-slate-800 mt-2">Premium Member Services</h2>
            <p className="text-sm text-slate-500 mt-3">
              Explore dynamic resources and facilities tailored to fulfill your academic goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FiBookOpen,
                title: "Digital Catalog search",
                desc: "Filter through thousands of physical and digital materials recursively by title, author, category, or ISBN."
              },
              {
                icon: FiBookmark,
                title: "Instant reserves & returns",
                desc: "Send instant issue requests. Monitor status validation alerts and return approvals straight from your dashboard."
              },
              {
                icon: FiGlobe,
                title: "Study Room bookings",
                desc: "Book reading rooms, research cubicles, and seminar zones equipped with high-speed internet and media rigs."
              }
            ].map((srv, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-100 hover:border-sky-200 transition-colors shadow-sm flex flex-col gap-5">
                <div className="h-12 w-12 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center text-xl">
                  <srv.icon />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{srv.title}</h3>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">{srv.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- STUDENT TESTIMONIALS --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-sky-500 uppercase tracking-widest">Feedback</span>
          <h2 className="text-3xl font-extrabold text-slate-800 mt-2">Loved by Students & Faculty</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-4 text-amber-400">
                  {[...Array(5)].map((_, i) => <HiOutlineStar key={i} className="text-sm" />)}
                </div>
                <p className="text-sm text-slate-650 italic leading-relaxed">
                  "{t.text}"
                </p>
              </div>
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-50">
                <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover ring-2 ring-sky-50" />
                <div>
                  <h4 className="font-bold text-xs text-slate-850">{t.name}</h4>
                  <p className="text-[10px] text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- JOIN BANNER --- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 rounded-3xl p-8 sm:p-12 text-white text-center sm:text-left shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[30%] h-[100%] bg-white/5 skew-x-12 transform origin-top-right" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-8">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold">Ready to Start Exploring?</h2>
              <p className="text-sky-100 text-sm max-w-lg font-light leading-relaxed">
                Create a student credentials account today to search catalogs, reserve books, look at schedules, and monitor your due list.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {user ? (
                <Link
                  to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
                  className="px-6 py-3 bg-white text-sky-600 hover:bg-sky-50 transition-colors font-bold text-sm rounded-xl shadow-lg flex items-center gap-1.5"
                >
                  Go to Dashboard <FiArrowRight />
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-6 py-3 border border-white/30 hover:bg-white/10 transition-colors font-bold text-sm rounded-xl flex items-center gap-1"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-3 bg-white text-sky-600 hover:bg-sky-50 transition-colors font-bold text-sm rounded-xl shadow-lg flex items-center gap-1.5"
                  >
                    Get Started <FiArrowRight />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-slate-400 py-10 mt-auto border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-base">Library <span className="text-sky-400">LMS</span></span>
            <span className="text-xs text-slate-500">© 2026 Library Management System</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Support Desk</a>
          </div>
        </div>
      </footer>

      {/* --- INTERACTIVE MODAL FOR EVENTS --- */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div
            className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl border border-slate-100 flex flex-col relative animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 h-9 w-9 bg-slate-900/40 hover:bg-slate-900/60 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors z-20 cursor-pointer"
            >
              <FiX />
            </button>

            {/* Modal Cover */}
            <div className="h-60 relative flex-shrink-0">
              <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-500 text-white px-2.5 py-1 rounded-full">
                  {selectedEvent.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-2 leading-tight">
                  {selectedEvent.title}
                </h3>
              </div>
            </div>

            {/* Modal content */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Event Details Ribbon */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                <div className="flex items-center gap-2 text-xs text-slate-650">
                  <HiOutlineCalendar className="text-sky-500 text-base" />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Date</p>
                    <p className="font-semibold mt-0.5">{selectedEvent.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-650">
                  <HiOutlineClock className="text-sky-500 text-base" />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Time</p>
                    <p className="font-semibold mt-0.5">{selectedEvent.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-650">
                  <HiOutlineLocationMarker className="text-sky-500 text-base" />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Venue</p>
                    <p className="font-semibold mt-0.5 truncate max-w-[120px]">{selectedEvent.location}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-800">Event Overview</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {selectedEvent.description}
                </p>
              </div>

              {/* Speaker / Director info */}
              <div className="flex justify-between items-center bg-sky-50/30 p-4 rounded-xl border border-sky-100/50 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center text-sm">
                    <HiOutlineUserGroup />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold">Guest Host / Speaker</p>
                    <p className="font-bold text-slate-800 mt-0.5">{selectedEvent.speaker}</p>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-green-100 text-green-700 rounded-md">
                  Confirmed
                </span>
              </div>

              {/* Register Action button */}
              <div className="pt-2 flex justify-end gap-3 flex-shrink-0">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-5 py-2.5 text-xs text-slate-500 hover:bg-slate-100 rounded-xl transition"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedEvent(null);
                    if (!user) {
                      navigate('/login');
                    } else {
                      alert("Successfully joined the register queue for: " + selectedEvent.title);
                    }
                  }}
                  className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl shadow-md transition"
                >
                  {user ? "Join Event" : "Login to RSVP"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;