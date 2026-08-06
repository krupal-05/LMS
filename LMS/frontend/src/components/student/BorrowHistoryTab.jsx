import React from 'react';
import { FiClock } from 'react-icons/fi';
import Badge from '../ui/Badge';
import EmptyState from '../ui/EmptyState';

const BorrowHistoryTab = ({ myIssues = [] }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
        <FiClock className="text-cyan-400" /> Complete Borrow History & Log
      </h3>

      {myIssues.length === 0 ? (
        <EmptyState
          icon={FiClock}
          title="No Borrow Records Found"
          description="You haven't requested or borrowed any library books yet."
        />
      ) : (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 uppercase text-[10px] font-mono text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-4">Book Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Issue Date</th>
                  <th className="p-4">Due Date</th>
                  <th className="p-4">Return Date</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {myIssues.map((issue) => (
                  <tr key={issue._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-semibold text-slate-100">{issue.book?.title || 'Book Title'}</td>
                    <td className="p-4 text-cyan-400 font-mono capitalize">{issue.book?.category || 'General'}</td>
                    <td className="p-4 font-mono text-slate-400">
                      {issue.issueDate ? new Date(issue.issueDate).toLocaleDateString() : 'Pending'}
                    </td>
                    <td className="p-4 font-mono text-slate-400">
                      {issue.dueDate ? new Date(issue.dueDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4 font-mono text-slate-400">
                      {issue.returnDate ? new Date(issue.returnDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="p-4">
                      <Badge status={issue.status}>{issue.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowHistoryTab;
