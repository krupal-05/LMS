import React from 'react';
import { FiClock, FiSend, FiDownload } from 'react-icons/fi';
import Badge from '../ui/Badge';
import EmptyState from '../ui/EmptyState';

const CirculationQueueTable = ({
  issues = [],
  issueFilter,
  setIssueFilter,
  onApprove,
  onReject,
  onReturn,
  actionLoadingId,
  onSendReminders,
  sendingReminders,
  onExportCSV
}) => {
  const filteredIssues = issues.filter(
    (i) => issueFilter === 'all' || i.status === issueFilter
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <FiClock className="text-cyan-400" /> Circulation & Borrow Requests Queue
        </h3>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {['all', 'pending', 'approved', 'returned', 'rejected'].map((f) => (
              <button
                key={f}
                onClick={() => setIssueFilter(f)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all cursor-pointer ${
                  issueFilter === f
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={onSendReminders}
            disabled={sendingReminders}
            className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <FiSend className="w-3.5 h-3.5" /> {sendingReminders ? 'Sending...' : 'Send Reminders'}
          </button>

          <button
            onClick={onExportCSV}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <FiDownload className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {filteredIssues.length === 0 ? (
        <EmptyState
          icon={FiClock}
          title="No Borrow Requests Found"
          description="There are currently no borrow requests matching the selected filter status."
        />
      ) : (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 uppercase text-[10px] font-mono text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-4">Book Title</th>
                  <th className="p-4">Student Email</th>
                  <th className="p-4">Issue Date</th>
                  <th className="p-4">Due Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredIssues.map((issue) => (
                  <tr key={issue._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-semibold text-slate-100">{issue.book?.title || 'Unknown Title'}</td>
                    <td className="p-4 text-slate-300 font-mono">{issue.user?.email || 'N/A'}</td>
                    <td className="p-4 font-mono text-slate-400">
                      {issue.issueDate ? new Date(issue.issueDate).toLocaleDateString() : 'Pending'}
                    </td>
                    <td className="p-4 font-mono text-slate-400">
                      {issue.dueDate ? new Date(issue.dueDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4">
                      <Badge status={issue.status}>{issue.status}</Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {issue.status === 'pending' && (
                          <>
                            <button
                              onClick={() => onApprove(issue._id)}
                              disabled={actionLoadingId === issue._id}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => onReject(issue._id)}
                              disabled={actionLoadingId === issue._id}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 cursor-pointer"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {issue.status === 'approved' && (
                          <button
                            onClick={() => onReturn(issue._id)}
                            disabled={actionLoadingId === issue._id}
                            className="px-3 py-1 rounded-lg text-xs font-semibold bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/30 cursor-pointer"
                          >
                            Mark Returned
                          </button>
                        )}

                        {['returned', 'rejected'].includes(issue.status) && (
                          <span className="text-slate-500 text-xs italic">Closed</span>
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

export default CirculationQueueTable;
