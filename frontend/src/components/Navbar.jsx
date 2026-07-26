import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiLogOut, FiUser, FiBell } from 'react-icons/fi';
import { HiOutlineBookOpen } from 'react-icons/hi';
import api from '../services/api';

const Navbar = () => {
  const { user, logoutAction, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data?.data || []);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [user]);

  const handleMarkAsRead = async (id) => {
    try {
      await api.post(`/notifications/read/${id}`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error("Failed to read notification", err);
    }
  };

  const navLinkClass = ({ isActive }) =>
    `font-semibold transition-colors duration-200 ${isActive ? 'text-sky-600 border-b-2 border-sky-500 pb-0.5' : 'text-gray-600 hover:text-sky-600'
    }`;

  const dashboardPath = user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="logo" className="h-20 w-20 rounded-full object-cover" />
            <span className="text-xl font-bold text-gray-800">
              Library <span className="text-sky-500">Managment System </span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" className={navLinkClass} end>Home</NavLink>
            {user && (
              <NavLink to={dashboardPath} className={navLinkClass}>Dashboard</NavLink>
            )}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-4">
                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-1.5 rounded-full hover:bg-slate-100 text-gray-600 transition relative"
                    title="Notifications"
                  >
                    <FiBell className="text-lg" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-[9px] font-bold h-4 w-4 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-150 rounded-2xl shadow-xl z-50 p-4 font-sans text-left">
                      <div className="flex items-center justify-between border-b pb-2 mb-2">
                        <span className="font-extrabold text-xs text-slate-800">Inbox Alerts</span>
                        {unreadCount > 0 && (
                          <span className="text-[10px] text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded-full">
                            {unreadCount} unread
                          </span>
                        )}
                      </div>
                      <div className="max-h-60 overflow-y-auto space-y-2 no-scrollbar">
                        {notifications.length === 0 ? (
                          <div className="text-center py-6 text-slate-400 text-[10px]">
                            No alerts yet.
                          </div>
                        ) : (
                          notifications.map(n => (
                            <div
                              key={n._id}
                              onClick={() => handleMarkAsRead(n._id)}
                              className={`p-2.5 rounded-xl border text-[10px] cursor-pointer transition ${n.read ? 'bg-slate-50/50 border-slate-100 text-slate-500' : 'bg-sky-50/30 border-sky-100 text-slate-800 font-semibold'}`}
                            >
                              <div className="flex justify-between items-start gap-1">
                                <p className="leading-relaxed">{n.message}</p>
                                {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-sky-500 flex-shrink-0 mt-1" />}
                              </div>
                              <span className="text-[8px] text-slate-400 mt-1 block">
                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Avatar + Name */}
                <div className="flex items-center gap-2">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.firstName}
                      className="h-9 w-9 rounded-full object-cover ring-2 ring-sky-400"
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-sky-100 flex items-center justify-center">
                      <FiUser className="text-sky-600" />
                    </div>
                  )}
                  <span className="text-sm font-semibold text-gray-700 capitalize">
                    {user.firstName}
                  </span>
                  <span className="text-xs bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full capitalize">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={logoutAction}
                  disabled={loading}
                  className="flex items-center gap-1.5 text-sm font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <FiLogOut />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-gray-600 hover:text-sky-600 px-4 py-1.5 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg shadow-sm transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-gray-600 hover:text-sky-600 transition"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-3 shadow-md">
          <NavLink to="/" className={navLinkClass} end onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/books" className={navLinkClass} onClick={() => setMenuOpen(false)}>Books</NavLink>
          {user && (
            <NavLink to={dashboardPath} className={navLinkClass} onClick={() => setMenuOpen(false)}>
              Dashboard
            </NavLink>
          )}
          <hr className="border-gray-200" />
          {user ? (
            <>
              <div className="flex items-center gap-2">
                <FiUser className="text-sky-500" />
                <span className="text-sm font-semibold text-gray-700 capitalize">{user.firstName} {user.lastName}</span>
                <span className="text-xs bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full capitalize">{user.role}</span>
              </div>
              <button
                onClick={() => { logoutAction(); setMenuOpen(false); }}
                className="flex items-center gap-1.5 text-sm font-semibold text-red-500 hover:bg-red-50 px-2 py-1.5 rounded-lg transition-colors w-full text-left"
              >
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-sm font-semibold text-gray-600 hover:text-sky-600">Sign In</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="text-sm font-semibold bg-sky-500 text-white px-4 py-2 rounded-lg text-center">Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

