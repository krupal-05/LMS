import React from 'react';
import { FiBookOpen, FiClock, FiDollarSign } from 'react-icons/fi';
import StatCard from '../cards/StatCard';

const StudentHeader = ({ user, activeBorrowsCount, pendingRequestsCount, totalUnpaidFines }) => {
  return (
    <div className="space-y-6">
      {/* Student Welcome Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full">
            Student Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100 capitalize">
            Welcome Back, {user?.firstName || 'Student'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Track active borrows, view due date countdowns, request new titles, and settle library fines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.firstName} className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-500/40 shadow-lg" />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xl font-bold border border-cyan-500/30">
              {user?.firstName?.[0]?.toUpperCase()}
            </div>
          )}
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Active Borrows"
          numericValue={activeBorrowsCount}
          suffix=" Books"
          icon={FiBookOpen}
          color="cyan"
          subtext="Currently checked out"
        />
        <StatCard
          title="Pending Requests"
          numericValue={pendingRequestsCount}
          suffix=" Requests"
          icon={FiClock}
          color="amber"
          subtext="Awaiting librarian approval"
        />
        <StatCard
          title="Outstanding Fines"
          value={`₹${totalUnpaidFines}`}
          icon={FiDollarSign}
          color={totalUnpaidFines > 0 ? 'rose' : 'emerald'}
          subtext={totalUnpaidFines > 0 ? 'Action required' : 'Clear account'}
        />
      </div>
    </div>
  );
};

export default StudentHeader;
