import React from 'react';
import { FiShield, FiPlus, FiCamera, FiRefreshCw } from 'react-icons/fi';

const AdminHeader = ({ onOpenAddBook, onOpenScanner, onRefresh, loading }) => {
  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <FiShield className="w-3 h-3" /> Admin Operations Control
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">
          Library Administration Portal
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Manage inventory, approve borrow requests, process book returns, and track fine waivers.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onOpenScanner}
          className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 hover:border-cyan-500/40 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <FiCamera className="w-4 h-4" /> Scan Barcode
        </button>
        <button
          onClick={onOpenAddBook}
          className="px-4 py-2.5 rounded-xl bg-gradient-accent text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-md shadow-cyan-500/20 active:scale-95 cursor-pointer"
        >
          <FiPlus className="w-4 h-4" /> Add New Book
        </button>
        <button
          onClick={onRefresh}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 cursor-pointer"
          title="Refresh Data"
        >
          <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
};

export default AdminHeader;
