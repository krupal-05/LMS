import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiBookOpen, FiArrowRight, FiShield, FiUserCheck } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Login = () => {
  const { loginAction, loading } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('student'); // 'student' | 'admin'

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Enter a valid email address.';
    if (!formData.password.trim()) newErrors.password = 'Password is required.';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    await loginAction(formData.email, formData.password, role);
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          {/* Header Branding */}
          <div className="text-center mb-8">
            <div className="inline-flex h-14 w-14 rounded-2xl bg-gradient-accent p-0.5 shadow-xl shadow-cyan-500/20 mb-3">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <FiBookOpen className="text-cyan-400 text-2xl" />
              </div>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Sign In to LMS Workspace</h1>
            <p className="text-xs text-slate-400 mt-1">Access your personalized library dashboard</p>
          </div>

          {/* Glass Login Box */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-800">
            {/* Segmented Role Switcher */}
            <div className="grid grid-cols-2 bg-slate-950 p-1 rounded-xl mb-6 border border-slate-800">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  role === 'student'
                    ? 'bg-gradient-accent text-white shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FiUserCheck className="w-3.5 h-3.5" /> Student Login
              </button>

              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  role === 'admin'
                    ? 'bg-gradient-accent text-white shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FiShield className="w-3.5 h-3.5" /> Admin Login
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="student@institution.edu"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-slate-100 placeholder-slate-500 text-xs focus:outline-none transition-all ${
                      errors.email
                        ? 'border-rose-500/50 bg-rose-500/10 focus:ring-1 focus:ring-rose-500'
                        : 'border-slate-800 bg-slate-900/60 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-rose-400 text-[11px] mt-1">⚠ {errors.email}</p>}
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-slate-100 placeholder-slate-500 text-xs focus:outline-none transition-all ${
                      errors.password
                        ? 'border-rose-500/50 bg-rose-500/10 focus:ring-1 focus:ring-rose-500'
                        : 'border-slate-800 bg-slate-900/60 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-rose-400 text-[11px] mt-1">⚠ {errors.password}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-accent text-white font-semibold text-xs tracking-wide hover:opacity-95 transition-all shadow-lg shadow-cyan-500/20 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign In to Workspace <FiArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
              New student or faculty member?{' '}
              <Link to="/register" className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
                Create account →
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Login;
