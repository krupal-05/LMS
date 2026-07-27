import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { FiAlertTriangle, FiArrowLeft } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 text-center max-w-md w-full shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
            <FiAlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-100 mb-2">404</h1>
          <h2 className="text-lg font-bold text-slate-200 mb-2">Page Not Found</h2>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            The page or library resource you requested could not be found or may have been relocated.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-accent text-white font-semibold text-xs shadow-md shadow-cyan-500/20"
          >
            <FiArrowLeft className="w-4 h-4" /> Return to Catalog
          </Link>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
