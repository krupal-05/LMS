import React from 'react';
import { FiDollarSign, FiCheckCircle } from 'react-icons/fi';
import Badge from '../ui/Badge';
import EmptyState from '../ui/EmptyState';

const FinesPaymentTab = ({ myIssues = [], onPayFine, payingFineId }) => {
  const fineRecords = myIssues.filter((i) => i.fineAmount > 0);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
        <FiDollarSign className="text-cyan-400" /> Overdue Fines & Payment Portal
      </h3>

      {fineRecords.length === 0 ? (
        <EmptyState
          icon={FiCheckCircle}
          title="Zero Fines Accrued"
          description="Your library account has a clean record with ₹0 in outstanding overdue penalties."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {fineRecords.map((issue) => (
            <div key={issue._id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase font-bold">
                  {issue.book?.category || 'General'}
                </span>
                <Badge status={issue.fineStatus}>{issue.fineStatus}</Badge>
              </div>

              <div>
                <h4 className="font-bold text-slate-100 text-sm line-clamp-1">{issue.book?.title || 'Book Title'}</h4>
                <p className="text-xs text-slate-400">
                  Return Date: {issue.returnDate ? new Date(issue.returnDate).toLocaleDateString() : 'Overdue'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Total Penalty Fine:</span>
                <span className="text-lg font-extrabold text-rose-400 font-mono">₹{issue.fineAmount}</span>
              </div>

              {issue.fineStatus === 'unpaid' && (
                <button
                  onClick={() => onPayFine(issue._id)}
                  disabled={payingFineId === issue._id}
                  className="w-full py-2.5 rounded-xl bg-gradient-emerald text-white font-semibold text-xs hover:opacity-90 transition-all shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <FiDollarSign className="w-4 h-4" />
                  {payingFineId === issue._id ? 'Processing Payment...' : 'Pay Fine Now (Razorpay)'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FinesPaymentTab;
