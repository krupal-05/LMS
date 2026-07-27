import React from 'react';
import { motion } from 'framer-motion';
import { FiBookOpen, FiBookmark, FiCheck } from 'react-icons/fi';
import Badge from '../ui/Badge';

const BookCard = ({ book, onRequest, isRequested, isPending, userRole, onEdit, onDelete }) => {
  const { title, author, category, copies, availableCopies, cover, isbn, description } = book;

  const isAvailable = availableCopies > 0;
  const coverUrl = cover?.url || `https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80`;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="glass-card rounded-2xl p-4 flex flex-col justify-between border border-slate-800/80 bg-slate-900/60 hover:border-cyan-500/40 group relative overflow-hidden"
    >
      {/* Category Pill Badge */}
      <div className="relative mb-3 aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
        <img
          src={coverUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />

        {/* Category Badge */}
        <span className="absolute top-2.5 right-2.5 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
          {category || 'General'}
        </span>

        {/* Availability Badge */}
        <div className="absolute bottom-2.5 left-2.5">
          <Badge status={isAvailable ? 'approved' : 'rejected'}>
            {isAvailable ? `${availableCopies} Available` : 'Out of Stock'}
          </Badge>
        </div>
      </div>

      {/* Book Metadata */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-bold text-slate-100 text-base line-clamp-1 group-hover:text-cyan-400 transition-colors">
            {title}
          </h4>
          <p className="text-xs text-slate-400 mt-1 capitalize font-medium">By {author || 'Unknown Author'}</p>
          <p className="text-xs text-slate-400/80 mt-2 line-clamp-2 leading-relaxed">
            {description || 'No detailed description available for this book.'}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400">ISBN: {isbn || 'N/A'}</span>

          {userRole === 'student' && (
            <button
              onClick={() => onRequest && onRequest(book._id)}
              disabled={!isAvailable || isRequested || isPending}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer ${
                isRequested || isPending
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 cursor-not-allowed'
                  : !isAvailable
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-accent text-white hover:opacity-90 shadow-cyan-500/20'
              }`}
            >
              {isRequested || isPending ? (
                <>
                  <FiCheck className="w-3.5 h-3.5" /> Requested
                </>
              ) : !isAvailable ? (
                'Unavailable'
              ) : (
                <>
                  <FiBookmark className="w-3.5 h-3.5" /> Borrow
                </>
              )}
            </button>
          )}

          {userRole === 'admin' && (
            <div className="flex items-center gap-1.5">
              {onEdit && (
                <button
                  onClick={() => onEdit(book)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:text-cyan-400 hover:bg-slate-700 transition-colors"
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(book._id)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;
