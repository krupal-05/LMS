import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiLock, FiShield, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loadingPass, setLoadingPass] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!oldPassword.trim() || !newPassword.trim()) {
      toast.error('Both current and new password are required');
      return;
    }
    try {
      setLoadingPass(true);
      await api.post('/users/change-password', { oldPassword, newPassword });
      toast.success('Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoadingPass(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 space-y-8">
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center gap-6">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.firstName}
              className="w-24 h-24 rounded-2xl object-cover ring-2 ring-cyan-500/50 shadow-xl"
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-3xl font-bold">
              {user?.firstName?.[0]?.toUpperCase()}
            </div>
          )}

          <div className="space-y-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-extrabold text-slate-100 capitalize">
                {user?.firstName} {user?.lastName}
              </h1>
              <span className="text-xs font-mono uppercase tracking-wider font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <FiShield className="w-3 h-3" /> {user?.role}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Account Info */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <FiUser className="text-cyan-400" /> Member Account Information
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">First Name:</span>
                <span className="font-semibold text-slate-200 capitalize">{user?.firstName}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Last Name:</span>
                <span className="font-semibold text-slate-200 capitalize">{user?.lastName}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Email Address:</span>
                <span className="font-mono text-slate-200">{user?.email}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Contact Number:</span>
                <span className="font-mono text-slate-200">{user?.contact || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <FiLock className="text-cyan-400" /> Security & Credentials
            </h3>

            <form onSubmit={handlePasswordChange} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:border-cyan-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:border-cyan-500/50"
                />
              </div>

              <button
                type="submit"
                disabled={loadingPass}
                className="w-full py-2.5 rounded-xl bg-gradient-accent text-white font-semibold text-xs shadow-md shadow-cyan-500/20 active:scale-95 cursor-pointer mt-2"
              >
                {loadingPass ? 'Updating Security Key...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
