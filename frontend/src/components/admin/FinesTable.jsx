import React from 'react';
import { FiDollarSign, FiCheckCircle } from 'react-icons/fi';
import Badge from '../ui/Badge';
import EmptyState from '../ui/EmptyState';

const FinesTable = ({ issues = [], onOpenWaiveDrawer, actionLoadingId }) => {
  const fineIssues = issues.filter((i) => i.fineAmount > 0);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
        <FiDollarSign className="text-cyan-400" /> Overdue Fine Records & Waiver Drawer
      </h3>

      {fineIssues.length === 0 ? (
        <EmptyState
          icon={FiCheckCircle}
          title="No Overdue Fines Logged"
          description="All returned books were submitted on schedule with zero generated penalties."
        />
      ) : (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 uppercase text-[10px] font-mono text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-4">Book Title</th>
                  <th className="p-4">Student</th>
                  <th className="p-4">Return Date</th>
                  <th className="p-4">Fine Amount</th>
                  <th className="p-4">Fine Status</th>
                  <th className="p-4 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {fineIssues.map((issue) => (
                  <tr key={issue._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-semibold text-slate-100">{issue.book?.title || 'Book Title'}</td>
                    <td className="p-4 text-slate-300">{issue.user?.email || 'N/A'}</td>
                    <td className="p-4 font-mono text-slate-400">
                      {issue.returnDate ? new Date(issue.returnDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4 font-mono font-extrabold text-rose-400">₹{issue.fineAmount}</td>
                    <td className="p-4">
                      <Badge status={issue.fineStatus}>{issue.fineStatus}</Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {issue.fineStatus === 'unpaid' && (
                          <button
                            onClick={() => onOpenWaiveDrawer(issue)}
                            disabled={actionLoadingId === issue._id}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 cursor-pointer"
                          >
                            Waive Fine
                          </button>
                        )}
                        {issue.fineStatus === 'paid' && (
                          <span className="text-emerald-400 text-xs font-semibold">Cleared</span>
                        )}
                        {issue.fineStatus === 'waived' && (
                          <span className="text-purple-400 text-xs font-semibold">Waived</span>
                        )}
                      </div>
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

export default FinesTable;
