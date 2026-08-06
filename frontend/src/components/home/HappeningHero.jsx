import React from 'react';
import { motion } from 'framer-motion';
import {
  FiCalendar,
  FiStar,
  FiMapPin,
  FiClock,
  FiFileText,
  FiBookOpen,
  FiChevronLeft,
  FiChevronRight,
  FiArrowRight,
  FiSearch,
  FiCommand
} from 'react-icons/fi';

const HappeningHero = ({
  events = [],
  books = [],
  searchQuery = '',
  setSearchQuery,
  handleSearchSubmit,
  setSelectedCategory,
  setPage,
  onScrollToEvents,
  onScrollToCatalog,
  onRequestBook
}) => {
  const latestEvent = events[0] || {
    title: 'AI & Neural Networks Symposium',
    location: 'Seminar Room 102',
    date: 'July 28, 2026'
  };

  const newBook1 = books[0] || {
    _id: 'demo-1',
    title: 'The Pragmatic Programmer',
    author: 'Andy Hunt & Dave Thomas',
    category: 'Computer Science'
  };

  const newBook2 = books[1] || {
    _id: 'demo-2',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    category: 'Fiction'
  };

  return (
    <section className="relative w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden select-none min-h-[580px] flex items-center justify-center">
      {/* Grid Pattern Background Layer (z-0) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293718_1px,transparent_1px),linear-gradient(to_bottom,#1f293718_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none z-0" />

      {/* Glow Center Ambient Lights Layer (z-0) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[420px] bg-gradient-to-tr from-purple-600/20 via-pink-500/15 to-amber-500/15 blur-3xl rounded-full pointer-events-none z-0" />



      {/* Hero Canvas Container */}
      <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center">

        {/* ========================================================================= */}
        {/* FLOATING CARDS LAYER (z-10) - Positioned BEHIND the central title text   */}
        {/* ========================================================================= */}

        {/* CARD 1: TOP LEFT (UPCOMING EVENT) - z-10 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="hidden lg:block absolute -top-12 -left-8 xl:-left-16 z-10 w-64 p-3.5 rounded-3xl bg-slate-900/85 border border-slate-800/90 shadow-2xl backdrop-blur-md text-left group hover:z-30 hover:border-purple-500/50 hover:bg-slate-900 transition-all duration-300 cursor-pointer"
          onClick={onScrollToEvents}
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[10px] font-bold tracking-wider uppercase mb-1.5">
            <FiCalendar className="w-3 h-3 text-purple-400" /> Upcoming Event
          </span>
          <h4 className="text-xs font-bold text-slate-200 line-clamp-1 group-hover:text-purple-300 transition-colors">
            {latestEvent.title}
          </h4>
          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1 font-medium">
            <FiMapPin className="w-3 h-3 text-slate-500 shrink-0" />
            <span className="truncate">{latestEvent.location || 'Seminar Room 102'}</span>
          </p>
        </motion.div>

        {/* CARD 2: TOP RIGHT (LATEST NOTICE) - z-10 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="hidden lg:block absolute -top-12 -right-8 xl:-right-16 z-10 w-68 p-3.5 rounded-3xl bg-slate-900/85 border border-slate-800/90 shadow-2xl backdrop-blur-md text-left group hover:z-30 hover:border-amber-500/50 hover:bg-slate-900 transition-all duration-300 cursor-pointer"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-bold tracking-wider uppercase mb-1.5">
            <FiFileText className="w-3 h-3 text-amber-400" /> Latest Notice
          </span>
          <h4 className="text-xs font-bold text-slate-200 line-clamp-1 group-hover:text-amber-300 transition-colors">
            List of Bound Volume Print Journals
          </h4>
          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1 font-mono">
            <FiClock className="w-3 h-3 text-slate-500 shrink-0" />
            <span>09 Jun 2026</span>
          </p>
        </motion.div>

        {/* CARD 3: BOTTOM LEFT (NEW ARRIVAL BOOK) - z-10 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden lg:block absolute -bottom-10 -left-12 xl:-left-20 z-10 w-72 p-3 rounded-3xl bg-slate-900/85 border border-slate-800/90 shadow-2xl backdrop-blur-md text-left group hover:z-30 hover:border-cyan-500/50 hover:bg-slate-900 transition-all duration-300 cursor-pointer"
          onClick={() => onRequestBook && newBook1._id && onRequestBook(newBook1._id)}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <FiBookOpen className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-200 truncate group-hover:text-cyan-300 transition-colors">
                {newBook1.title}
              </h4>
              <p className="text-[10px] text-slate-400 truncate">{newBook1.author}</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[9px] font-mono font-bold tracking-wider uppercase">
                New Arrival
              </span>
            </div>
          </div>
        </motion.div>

        {/* CARD 4: BOTTOM RIGHT (JUST ADDED) - z-10 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="hidden lg:block absolute -bottom-10 -right-12 xl:-right-20 z-10 w-72 p-3 rounded-3xl bg-slate-900/85 border border-slate-800/90 shadow-2xl backdrop-blur-md text-left group hover:z-30 hover:border-emerald-500/50 hover:bg-slate-900 transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-slate-950 shrink-0 shadow-md">
              <FiFileText className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-200 truncate group-hover:text-emerald-300 transition-colors">
                {newBook2.title}
              </h4>
              <p className="text-[10px] text-slate-400 truncate">{newBook2.author}</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono font-bold tracking-wider uppercase">
                Just Added
              </span>
            </div>
          </div>
        </motion.div>


        {/* ========================================================================= */}
        {/* CENTER CONTENT LAYER (z-30) - ALWAYS IN FRONT OF FLOATING CARDS          */}
        {/* ========================================================================= */}

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 0.85 }}
          transition={{ duration: 0.5 }}
          className="relative z-30 space-y-6 max-w-3xl px-2 py-4"
        >
          {/* Main Title Heading (In Front - z-30) */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-100 leading-[1.12] drop-shadow-lg">
            What's{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent italic font-serif">
              Happening
            </span>{' '}
            <br />
            at the{' '}
            <span className="font-serif font-bold text-slate-100">Library</span>
          </h1>

          {/* Action Buttons (In Front - z-30) */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
            <button
              onClick={onScrollToEvents}
              className="px-7 py-3.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white font-bold text-sm shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer border border-purple-400/30"
            >
              <FiCalendar className="w-4 h-4" /> View All Events
              <FiArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={onScrollToCatalog}
              className="px-7 py-3.5 rounded-full bg-slate-900/95 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm border border-slate-700/80 shadow-2xl backdrop-blur-xl hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
            >
              <FiStar className="w-4 h-4 text-cyan-400 fill-cyan-400/30" /> New Arrivals
              <FiArrowRight className="w-4 h-4 ml-1 text-slate-400" />
            </button>
          </div>

        </motion.div>

      </div>
    </section>
  );
};

export default HappeningHero;
