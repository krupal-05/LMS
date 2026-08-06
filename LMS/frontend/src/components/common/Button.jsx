import React from 'react';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  onClick,
  ...props
}) => {
  const baseClasses = 'font-semibold rounded-xl transition-all cursor-pointer inline-flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-accent text-white hover:opacity-90 shadow-md shadow-cyan-500/20',
    secondary: 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-slate-700',
    danger: 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20',
    emerald: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-xs sm:text-sm',
    lg: 'px-6 py-3 text-sm sm:text-base'
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
