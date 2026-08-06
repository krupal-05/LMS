import React from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiBookmark, FiAward } from 'react-icons/fi';
import Badge from '../ui/Badge';

const FeaturedBookStack = ({ book, onRequest, user }) => {
  const defaultBook = book || {
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    category: 'Computer Science',
    rating: 4.9,
    reviews: 1280,
    coverUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80',
    availableCopies: 8,
    isbn: '978-0132350884'
  };

  const coverImage = defaultBook.cover?.url || defaultBook.coverUrl;

  return (
    <div className="relative w-full max-w-md mx-auto py-4">
      {/* Background Glow Spheres */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-blue-500/10 to-purple-500/20 blur-2xl rounded-full pointer-events-none" />

      {/* Layered Card 3 - Bottom Stack Shadow */}
      <div className="absolute top-8 left-6 right-6 h-64 bg-slate-950/80 rounded-3xl border border-slate-800 scale-90 opacity-40 blur-xs" />

      {/* Layered Card 2 - Middle Stack Card */}
      <div className="absolute top-4 left-3 right-3 h-72 bg-slate-900/90 rounded-3xl border border-slate-800 scale-95 opacity-70 shadow-lg" />

      {/* Primary Top Card */}
      <motion.div
        whileHover={{ y: -6, rotate: -1 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 glass-panel rounded-3xl p-5 sm:p-6 border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 space-y-4"
      >
        {/* Top Header Badge */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 flex items-center gap-1.5 uppercase">
            <FiAward className="w-3.5 h-3.5" /> Featured Acquisition
          </span>
          <Badge status="approved">Available</Badge>
        </div>

        {/* Book Preview Image & Rating Overlay */}
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 group">
          <img
            src={coverImage}
            alt={defaultBook.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

          {/* Rating Pill Bottom Left */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-800 text-xs">
            <FiStar className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-bold text-slate-100">{defaultBook.rating || 4.9}</span>
            <span className="text-slate-400 text-[10px]">({defaultBook.reviews || 124} reviews)</span>
          </div>
        </div>

        {/* Title & Metadata */}
        <div>
          <h3 className="font-bold text-slate-100 text-lg line-clamp-1">{defaultBook.title}</h3>
          <p className="text-xs text-slate-400 mt-1 capitalize font-medium">By {defaultBook.author}</p>
        </div>

        {/* Action Bar */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <span className="text-[11px] font-mono text-cyan-300 font-semibold uppercase">
            {defaultBook.category || 'Computer Science'}
          </span>
          <button
            onClick={() => onRequest && onRequest(defaultBook._id)}
            className="px-4 py-2 rounded-xl bg-gradient-accent text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 active:scale-95 cursor-pointer"
          >
            <FiBookmark className="w-3.5 h-3.5" /> Reserve Now
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default FeaturedBookStack;
