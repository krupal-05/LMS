import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FiMenu, FiX, FiLogOut, FiUser, FiBookOpen, FiGrid, FiShield, FiSun, FiMoon, FiClock } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logoutAction, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
      isActive
        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm'
        : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/60'
    }`;

  const anchorClass =
    'flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60 transition-all cursor-pointer';

  const dashboardPath = user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 backdrop-blur-xl bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Branding */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-accent p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <img src="/logo.png" alt="Logo" className="w-10 h-10 text-cyan-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-slate-100 group-hover:text-cyan-400 transition-colors">
                <span className="text-gradient">Library</span> Management System
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Library Suite</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/60 border border-slate-800/80 p-1 rounded-2xl">
            <NavLink to="/" className={navLinkClass} end>
              <FiBookOpen className="w-4 h-4" /> Home
            </NavLink>
            <a href="#hours-section" className={anchorClass}>
              <FiClock className="w-4 h-4 text-cyan-400" /> Hours
            </a>
            <a href="#rules-section" className={anchorClass}>
              <FiShield className="w-4 h-4 text-purple-400" /> Rules
            </a>
            {user && (
              <NavLink to={dashboardPath} className={navLinkClass}>
                <FiGrid className="w-4 h-4" /> Dashboard
              </NavLink>
            )}
          </nav>

          {/* Desktop Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-slate-700 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <FiSun className="w-4 h-4 text-amber-400" /> : <FiMoon className="w-4 h-4 text-indigo-500" />}
              <span className="hidden lg:inline capitalize">{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                {/* User Avatar & Role Badge */}
                <div className="flex items-center gap-2.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-2xl">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.firstName}
                      className="w-7 h-7 rounded-lg object-cover ring-1 ring-cyan-500/40"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold">
                      {user.firstName?.[0]?.toUpperCase() || <FiUser />}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-200 capitalize leading-tight">
                      {user.firstName}
                    </span>
                    <span className="text-[9px] font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1">
                      {user.role === 'admin' && <FiShield className="w-2.5 h-2.5" />}
                      {user.role}
                    </span>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={logoutAction}
                  disabled={loading}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
                  title="Log Out"
                >
                  <FiLogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-slate-100 hover:bg-slate-800/80 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-accent text-white hover:opacity-90 transition-all shadow-md shadow-cyan-500/20"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-300 hover:bg-slate-800 border border-slate-800"
          >
            {menuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-panel border-t border-slate-800 px-4 py-4 space-y-3"
          >
            <NavLink to="/" className={navLinkClass} end onClick={() => setMenuOpen(false)}>
              <FiBookOpen className="w-4 h-4" /> Catalog Home
            </NavLink>
            <a href="#hours-section" className={anchorClass} onClick={() => setMenuOpen(false)}>
              <FiClock className="w-4 h-4 text-cyan-400" /> Working Hours
            </a>
            <a href="#rules-section" className={anchorClass} onClick={() => setMenuOpen(false)}>
              <FiShield className="w-4 h-4 text-purple-400" /> Library Rules
            </a>
            {user && (
              <NavLink to={dashboardPath} className={navLinkClass} onClick={() => setMenuOpen(false)}>
                <FiGrid className="w-4 h-4" /> Workspace Dashboard
              </NavLink>
            )}

            <button
              onClick={toggleTheme}
              className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300"
            >
              <span className="flex items-center gap-2">
                {theme === 'dark' ? <FiSun className="text-amber-400" /> : <FiMoon className="text-indigo-400" />} Theme Mode
              </span>
              <span className="capitalize text-cyan-400">{theme}</span>
            </button>

            <div className="pt-2 border-t border-slate-800">
              {user ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.firstName} className="w-8 h-8 rounded-lg object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                        {user.firstName?.[0]}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-slate-100 capitalize">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-cyan-400 font-mono capitalize">{user.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logoutAction();
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 w-full"
                  >
                    <FiLogOut className="w-4 h-4" /> Log Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-1">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-center text-slate-300 bg-slate-800"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-center bg-gradient-accent text-white"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
