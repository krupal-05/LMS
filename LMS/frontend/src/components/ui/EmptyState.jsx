import React from 'react';

const EmptyState = ({
  icon: Icon,
  title = 'No items found',
  description = 'There are no records matching your request right now.',
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center glass-panel rounded-2xl border border-slate-800/80 my-4 ${className}`}>
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/5">
          <Icon className="w-8 h-8" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-100 mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-xl bg-gradient-accent text-white font-medium text-sm hover:opacity-90 transition-all shadow-md shadow-cyan-500/20 active:scale-95 cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
