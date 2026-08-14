import React from 'react';
import { FiSearch, FiBookOpen } from 'react-icons/fi';
import BookCard from '../cards/BookCard';
import EmptyState from '../ui/EmptyState';
import { BookCardSkeleton } from '../ui/Skeleton';
import Pagination from '../ui/Pagination';

const StudentCatalogTab = ({
  books = [],
  myIssues = [],
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  loading,
  onRequestBook,
  page = 1,
  setPage,
  limit = 12,
  setLimit,
  pagination = { totalBooks: 0, totalPages: 1 }
}) => {
  const categories = ['all', 'computer science', 'fiction', 'engineering', 'science', 'general'];

  const filteredCatalog = books.filter((b) => {
    const matchesCategory = categoryFilter === 'all' || b.category?.toLowerCase() === categoryFilter.toLowerCase();
    const matchesSearch =
      !searchQuery.trim() ||
      b.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.isbn?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalItems = pagination?.totalBooks || filteredCatalog.length;
  const totalPages = pagination?.totalPages || (Math.ceil(totalItems / limit) || 1);

  const displayCatalog = (setPage && pagination?.totalPages > 1)
    ? filteredCatalog
    : filteredCatalog.slice((page - 1) * limit, page * limit);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="glass-panel px-3 py-2 rounded-2xl border border-slate-800 flex items-center gap-2 max-w-md w-full">
          <FiSearch className="text-slate-500 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (setPage) setPage(1);
            }}
            placeholder="Search library catalog by title, author, or ISBN..."
            className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategoryFilter(cat);
                if (setPage) setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((n) => (
            <BookCardSkeleton key={n} />
          ))}
        </div>
      ) : filteredCatalog.length === 0 ? (
        <EmptyState
          icon={FiBookOpen}
          title="No books match criteria"
          description="Try broadening your search term or selecting 'all' categories."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setCategoryFilter('all');
            if (setPage) setPage(1);
          }}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {displayCatalog.map((book) => {
              const existingIssue = myIssues.find((i) => (i.book?._id || i.book) === book._id);
              const isRequested = Boolean(existingIssue);
              const isPending = existingIssue?.status === 'pending';

              return (
                <BookCard
                  key={book._id}
                  book={book}
                  userRole="student"
                  isRequested={isRequested}
                  isPending={isPending}
                  onRequest={onRequestBook}
                />
              );
            })}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalItems}
            limit={limit}
            onPageChange={(p) => setPage && setPage(p)}
            onLimitChange={(l) => {
              if (setLimit) setLimit(l);
              if (setPage) setPage(1);
            }}
            limitOptions={[8, 12, 24, 48]}
            itemLabel="books"
          />
        </>
      )}
    </div>
  );
};

export default StudentCatalogTab;
