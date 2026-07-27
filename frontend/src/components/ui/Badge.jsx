import React from 'react';

const variantStyles = {
  pending: 'bg-amber-500/10 text-amber-600 border-amber-500/30 dark:text-amber-400',
  approved: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400',
  returned: 'bg-blue-500/10 text-blue-600 border-blue-500/30 dark:text-blue-400',
  rejected: 'bg-rose-500/10 text-rose-600 border-rose-500/30 dark:text-rose-400',
  overdue: 'bg-red-500/15 text-red-600 border-red-500/40 dark:text-red-400 animate-pulse',
  unpaid: 'bg-rose-500/10 text-rose-600 border-rose-500/30 dark:text-rose-400',
  paid: 'bg-teal-500/10 text-teal-600 border-teal-500/30 dark:text-teal-400',
  waived: 'bg-purple-500/10 text-purple-600 border-purple-500/30 dark:text-purple-400',
  info: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/30 dark:text-cyan-400',
  default: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
};

const Badge = ({ children, status = 'default', className = '' }) => {
  const normalizedStatus = (status || 'default').toLowerCase();
  const styleClass = variantStyles[normalizedStatus] || variantStyles.default;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold tracking-wide rounded-full border ${styleClass} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      <span className="capitalize">{children || status}</span>
    </span>
  );
};

export default Badge;
