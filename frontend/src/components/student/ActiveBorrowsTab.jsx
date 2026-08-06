import React from 'react';
import { FiClock, FiCalendar, FiBookOpen } from 'react-icons/fi';
import { getBookCover } from '../../utils/bookCover';
import Badge from '../ui/Badge';
import EmptyState from '../ui/EmptyState';

const ActiveBorrowsTab = ({ approvedBorrows = [], onNavigateToCatalog }) => {
  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <FiClock className="text-cyan-400" /> Active Borrows & Return Deadlines
        </h3>
        <span className="text-xs text-slate-400 font-mono">
          {approvedBorrows.length} Active {approvedBorrows.length === 1 ? 'Book' : 'Books'}
        </span>
      </div>

      {approvedBorrows.length === 0 ? (
        <EmptyState
          icon={FiBookOpen}
          title="No Active Books Checked Out"
          description="You currently have zero active book borrows. Browse the library catalog to request your next read!"
          actionLabel="Explore Catalog"
          onAction={onNavigateToCatalog}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {approvedBorrows.map((issue) => {
            const now = new Date();
            const due = issue.dueDate ? new Date(issue.dueDate) : null;
            const diffDays = due ? Math.ceil((due.getTime() - now.getTime()) / (1000 * 3600 * 24)) : 0;
            const isOverdue = diffDays < 0;

            return (
              <div
                key={issue._id}
                className="glass-panel p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between space-y-4 hover:border-cyan-500/40 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={getBookCover(issue.book)}
                    alt={issue.book?.title}
                    className="w-16 h-20 object-cover rounded-xl border border-slate-800 flex-shrink-0"
                  />
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                      {issue.book?.category || 'General'}
                    </span>
                    <h4 className="font-bold text-slate-100 text-sm line-clamp-1">{issue.book?.title || 'Book Title'}</h4>
                    <p className="text-xs text-slate-400 capitalize font-medium">By {issue.book?.author || 'Unknown'}</p>
                    <Badge status={isOverdue ? 'rejected' : 'approved'}>
                      {isOverdue ? 'Overdue' : 'Active Borrow'}
                    </Badge>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FiCalendar className="text-cyan-400" />
                    <span className="text-slate-400">Due Date:</span>
                    <span className="font-semibold text-slate-200">
                      {issue.dueDate ? new Date(issue.dueDate).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>

                  <span className={`font-extrabold ${isOverdue ? 'text-rose-400' : diffDays <= 2 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {isOverdue ? `${Math.abs(diffDays)} Days Overdue` : `${diffDays} Days Remaining`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActiveBorrowsTab;
