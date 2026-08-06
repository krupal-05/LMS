import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiCamera, FiBookOpen, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Register = () => {
  const { registerAction, loading } = useAuth();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contact: '',
    password: '',
    confirmPassword: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validate = () => {
    const e = {};
    if (!formData.firstName.trim()) e.firstName = 'First name is required.';
    if (!formData.lastName.trim()) e.lastName = 'Last name is required.';
    if (!formData.email.trim()) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Enter a valid email.';
    if (!formData.contact.trim()) e.contact = 'Contact number is required.';
    else if (!/^\d{10}$/.test(formData.contact.trim())) e.contact = 'Enter a valid 10-digit number.';
    if (!formData.password) e.password = 'Password is required.';
    else if (formData.password.length < 6) e.password = 'Min 6 characters.';
    if (!formData.confirmPassword) e.confirmPassword = 'Please confirm your password.';
    else if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match.';
    if (!avatar) e.avatar = 'Profile photo is required.';
    return e;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
      if (errors.avatar) setErrors({ ...errors, avatar: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const data = new FormData();
    data.append('firstName', formData.firstName.trim());
    data.append('lastName', formData.lastName.trim());
    data.append('email', formData.email.trim());
    data.append('contact', formData.contact.trim());
    data.append('password', formData.password);
    data.append('avatar', avatar);
    await registerAction(data);
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-lg"
        >
          {/* Header Branding */}
          <div className="text-center mb-6">
            <div className="inline-flex h-14 w-14 rounded-2xl bg-gradient-accent p-0.5 shadow-xl shadow-cyan-500/20 mb-3">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <FiBookOpen className="text-cyan-400 text-2xl" />
              </div>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Create Member Account</h1>
            <p className="text-xs text-slate-400 mt-1">Register for library access and borrow privileges</p>
          </div>

          {/* Glass Card */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-800">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center gap-2.5 pb-4 border-b border-slate-800">
                <div
                  className="relative cursor-pointer group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-20 h-20 rounded-full object-cover ring-2 ring-cyan-400/80 shadow-lg"
                    />
                  ) : (
                    <div
                      className={`w-20 h-20 rounded-full flex flex-col items-center justify-center border-2 border-dashed transition-all ${
                        errors.avatar
                          ? 'border-rose-500/80 bg-rose-500/10'
                          : 'border-slate-700 bg-slate-900/60 group-hover:border-cyan-400 group-hover:bg-slate-800'
                      }`}
                    >
                      <FiCamera className={`text-xl ${errors.avatar ? 'text-rose-400' : 'text-slate-400 group-hover:text-cyan-400'}`} />
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 p-1.5 bg-cyan-500 text-slate-950 rounded-full shadow-md">
                    <FiCamera className="w-3 h-3 font-bold" />
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <span className="text-[11px] text-slate-400">Upload profile photo (Required)</span>
                {errors.avatar && <p className="text-rose-400 text-[11px]">⚠ {errors.avatar}</p>}
              </div>

              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">First Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Jane"
                      className={`w-full pl-9 pr-3 py-2 rounded-xl border text-slate-100 placeholder-slate-500 text-xs focus:outline-none transition-all ${
                        errors.firstName ? 'border-rose-500/50 bg-rose-500/10' : 'border-slate-800 bg-slate-900/60 focus:border-cyan-500/50'
                      }`}
                    />
                  </div>
                  {errors.firstName && <p className="text-rose-400 text-[10px] mt-1">⚠ {errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Last Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className={`w-full pl-9 pr-3 py-2 rounded-xl border text-slate-100 placeholder-slate-500 text-xs focus:outline-none transition-all ${
                        errors.lastName ? 'border-rose-500/50 bg-rose-500/10' : 'border-slate-800 bg-slate-900/60 focus:border-cyan-500/50'
                      }`}
                    />
                  </div>
                  {errors.lastName && <p className="text-rose-400 text-[10px] mt-1">⚠ {errors.lastName}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="student@institution.edu"
                    className={`w-full pl-9 pr-3 py-2 rounded-xl border text-slate-100 placeholder-slate-500 text-xs focus:outline-none transition-all ${
                      errors.email ? 'border-rose-500/50 bg-rose-500/10' : 'border-slate-800 bg-slate-900/60 focus:border-cyan-500/50'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-rose-400 text-[10px] mt-1">⚠ {errors.email}</p>}
              </div>

              {/* Contact */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Contact Number</label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                  <input
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    className={`w-full pl-9 pr-3 py-2 rounded-xl border text-slate-100 placeholder-slate-500 text-xs focus:outline-none transition-all ${
                      errors.contact ? 'border-rose-500/50 bg-rose-500/10' : 'border-slate-800 bg-slate-900/60 focus:border-cyan-500/50'
                    }`}
                  />
                </div>
                {errors.contact && <p className="text-rose-400 text-[10px] mt-1">⚠ {errors.contact}</p>}
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min 6 chars"
                      className={`w-full pl-9 pr-8 py-2 rounded-xl border text-slate-100 placeholder-slate-500 text-xs focus:outline-none transition-all ${
                        errors.password ? 'border-rose-500/50 bg-rose-500/10' : 'border-slate-800 bg-slate-900/60 focus:border-cyan-500/50'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500"
                    >
                      {showPassword ? <FiEyeOff className="w-3.5 h-3.5" /> : <FiEye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-rose-400 text-[10px] mt-1">⚠ {errors.password}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Confirm Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      className={`w-full pl-9 pr-8 py-2 rounded-xl border text-slate-100 placeholder-slate-500 text-xs focus:outline-none transition-all ${
                        errors.confirmPassword ? 'border-rose-500/50 bg-rose-500/10' : 'border-slate-800 bg-slate-900/60 focus:border-cyan-500/50'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500"
                    >
                      {showConfirm ? <FiEyeOff className="w-3.5 h-3.5" /> : <FiEye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-rose-400 text-[10px] mt-1">⚠ {errors.confirmPassword}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-accent text-white font-semibold text-xs tracking-wide hover:opacity-95 transition-all shadow-lg shadow-cyan-500/20 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-3"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account <FiArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
              Already registered?{' '}
              <Link to="/login" className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
                Sign In →
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Register;
