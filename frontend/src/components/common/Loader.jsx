import React from 'react';
import { FiRefreshCw } from 'react-icons/fi';

const Loader = ({ label = 'Loading...', size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 text-xs',
    md: 'w-6 h-6 text-sm',
    lg: 'w-10 h-10 text-base'
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 space-y-3 text-slate-400 ${className}`}>
      <FiRefreshCw className={`animate-spin text-cyan-400 ${sizes[size] || sizes.md}`} />
      {label && <span className="text-xs font-mono font-medium tracking-wide">{label}</span>}
    </div>
  );
};

export default Loader;
