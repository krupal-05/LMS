import React from 'react';
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = null,
  limit = 12,
  onPageChange,
  onLimitChange,
  limitOptions = [8, 12, 24, 48],
  itemLabel = 'items'
}) => {
  if (totalPages <= 1 && totalItems === null) return null;

  // Generate page numbers range with smart ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const delta = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  const startItem = totalItems ? Math.min((currentPage - 1) * limit + 1, totalItems) : null;
  const endItem = totalItems ? Math.min(currentPage * limit, totalItems) : null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800/80 w-full mt-4">
      {/* Left: Range and total counter */}
      <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
        {totalItems !== null ? (
          <span>
            Showing <strong className="text-slate-200">{startItem}-{endItem}</strong> of{' '}
            <strong className="text-cyan-400">{totalItems}</strong> {itemLabel}
          </span>
        ) : (
          <span>
            Page <strong className="text-slate-200">{currentPage}</strong> of{' '}
            <strong className="text-cyan-400">{totalPages}</strong>
          </span>
        )}

        {onLimitChange && limitOptions?.length > 0 && (
          <div className="flex items-center gap-1.5 ml-2 border-l border-slate-800 pl-3">
            <span className="text-[11px] text-slate-500">Per page:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-cyan-500/50 cursor-pointer font-mono"
            >
              {limitOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right: Page Buttons */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          {/* First Page */}
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            title="First Page"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
          >
            <FiChevronsLeft className="w-3.5 h-3.5" />
          </button>

          {/* Previous Page */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            title="Previous Page"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center gap-1 text-xs font-semibold px-2.5"
          >
            <FiChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          {/* Numeric Page Buttons */}
          <div className="flex items-center gap-1">
            {getPageNumbers().map((num, idx) => (
              num === '...' ? (
                <span key={`ellipsis-${idx}`} className="px-2 py-1 text-slate-600 text-xs font-mono">
                  ...
                </span>
              ) : (
                <button
                  key={num}
                  onClick={() => onPageChange(num)}
                  className={`min-w-[32px] h-8 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    currentPage === num
                      ? 'bg-gradient-accent text-white shadow-md shadow-cyan-500/20 font-bold border border-cyan-400/40'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 hover:border-slate-700'
                  }`}
                >
                  {num}
                </button>
              )
            ))}
          </div>

          {/* Next Page */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            title="Next Page"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center gap-1 text-xs font-semibold px-2.5"
          >
            <span className="hidden sm:inline">Next</span>
            <FiChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Last Page */}
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            title="Last Page"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
          >
            <FiChevronsRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Pagination;
