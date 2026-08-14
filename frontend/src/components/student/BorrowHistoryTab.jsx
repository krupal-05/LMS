import React, { useState } from 'react';
import { FiClock } from 'react-icons/fi';
import Badge from '../ui/Badge';
import EmptyState from '../ui/EmptyState';
import Pagination from '../ui/Pagination';

const BorrowHistoryTab = ({
  myIssues = [],
  page = 1,
  setPage,
  limit = 10,
  setLimit,
  pagination = { totalIssues: 0, totalPages: 1 }
}) => {
  const [localPage, setLocalPage] = useState(1);
  const [localLimit, setLocalLimit] = useState(10);

  const activePage = setPage ? page : localPage;
  const activeLimit = setLimit ? limit : localLimit;
  const changePage = setPage || setLocalPage;
  const changeLimit = setLimit || setLocalLimit;

  const totalItems = pagination?.totalIssues || myIssues.length;
  const totalPages = pagination?.totalPages || (Math.ceil(totalItems / activeLimit) || 1);

  const displayIssues = (setPage && pagination?.totalPages > 1)
    ? myIssues
    : myIssues.slice((activePage - 1) * activeLimit, activePage * activeLimit);

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
        <>
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
                  {displayIssues.map((issue) => (
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

          <Pagination
            currentPage={activePage}
            totalPages={totalPages}
            totalItems={totalItems}
            limit={activeLimit}
            onPageChange={(p) => changePage(p)}
            onLimitChange={(l) => {
              changeLimit(l);
              changePage(1);
            }}
            limitOptions={[5, 10, 20, 50]}
            itemLabel="records"
          />
        </>
      )}
    </div>
  );
};

export default BorrowHistoryTab;
