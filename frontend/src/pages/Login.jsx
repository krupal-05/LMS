import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { HiOutlineBookOpen } from 'react-icons/hi';

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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-amber-50">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-500 items-center justify-center shadow-lg mb-4">
              <HiOutlineBookOpen className="text-white text-3xl" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Welcome Back!</h1>
            <p className="text-gray-500 mt-1">Sign in to your Library LMS account</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">

            {/* Sliding Role Toggler */}
            <div className="flex bg-gray-100 p-1.5 rounded-xl mb-6 relative border border-gray-200">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${role === 'student'
                    ? 'bg-sky-500 text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-800'
                  }`}
              >
                Student Login
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${role === 'admin'
                    ? 'bg-sky-500 text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-800'
                  }`}
              >
                Admin Login
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition text-sm ${errors.email
                      ? 'border-red-400 focus:ring-red-200 bg-red-50'
                      : 'border-gray-200 focus:ring-sky-200 focus:border-sky-400 bg-gray-50'
                      }`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">⚠ {errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Your password"
                    className={`w-full pl-10 pr-11 py-3 rounded-xl border text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition text-sm ${errors.password
                      ? 'border-red-400 focus:ring-red-200 bg-red-50'
                      : 'border-gray-200 focus:ring-sky-200 focus:border-sky-400 bg-gray-50'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">⚠ {errors.password}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-base shadow-md hover:from-sky-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-sky-200 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Signing In...
                  </>
                ) : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-sky-500 hover:text-sky-700 transition">
                Create one free →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

