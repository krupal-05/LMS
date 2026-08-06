import React from 'react';
import { FiSearch, FiPlus, FiDownload, FiBookOpen } from 'react-icons/fi';
import BookCard from '../cards/BookCard';
import EmptyState from '../ui/EmptyState';
import { BookCardSkeleton } from '../ui/Skeleton';

const InventoryGrid = ({
  books = [],
  bookSearch,
  setBookSearch,
  loading,
  onOpenAddBook,
  onEditBook,
  onDeleteBook,
  onExportCSV
}) => {
  const filteredBooks = books.filter(
    (b) =>
      !bookSearch.trim() ||
      b.title?.toLowerCase().includes(bookSearch.toLowerCase()) ||
      b.author?.toLowerCase().includes(bookSearch.toLowerCase()) ||
      b.isbn?.toLowerCase().includes(bookSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="glass-panel px-3 py-2 rounded-2xl border border-slate-800 flex items-center gap-2 max-w-md w-full">
          <FiSearch className="text-slate-500 w-4 h-4" />
          <input
            type="text"
            value={bookSearch}
            onChange={(e) => setBookSearch(e.target.value)}
            placeholder="Search catalog inventory by title, author, or ISBN..."
            className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <FiDownload className="w-3.5 h-3.5" /> Export Inventory CSV
          </button>
          <button
            onClick={onOpenAddBook}
            className="px-4 py-2 rounded-xl bg-gradient-accent text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
          >
            <FiPlus className="w-4 h-4" /> Add New Book
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((n) => (
            <BookCardSkeleton key={n} />
          ))}
        </div>
      ) : filteredBooks.length === 0 ? (
        <EmptyState
          icon={FiBookOpen}
          title="No matching books in inventory"
          description="We couldn't find any books matching your search query."
          actionLabel="Clear Search"
          onAction={() => setBookSearch('')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredBooks.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              userRole="admin"
              onEdit={onEditBook}
              onDelete={onDeleteBook}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default InventoryGrid;
