import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiCamera } from 'react-icons/fi';
import { HiOutlineBookOpen } from 'react-icons/hi';

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

  const InputField = ({ label, name, type = 'text', placeholder, icon: Icon, extra }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input
          type={type}
          name={name}
          id={name}
          value={formData[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full pl-10 pr-${extra ? '11' : '4'} py-3 rounded-xl border text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 transition ${errors[name]
              ? 'border-red-400 focus:ring-red-200 bg-red-50'
              : 'border-gray-200 focus:ring-sky-200 focus:border-sky-400 bg-gray-50'
            }`}
        />
        {extra}
      </div>
      {errors[name] && <p className="text-red-500 text-xs mt-1.5">⚠ {errors[name]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-sky-50">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 items-center justify-center shadow-lg mb-4">
              <HiOutlineBookOpen className="text-white text-3xl" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
            <p className="text-gray-500 mt-1">Join Library LMS and start exploring</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Avatar Upload */}
              <div className="flex flex-col items-center gap-3 pb-4 border-b border-gray-100">
                <div
                  className="relative cursor-pointer group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="h-24 w-24 rounded-full object-cover ring-4 ring-amber-200 shadow-md"
                    />
                  ) : (
                    <div className={`h-24 w-24 rounded-full flex flex-col items-center justify-center border-2 border-dashed transition ${errors.avatar ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50 group-hover:border-amber-400 group-hover:bg-amber-50'
                      }`}>
                      <FiCamera className={`text-2xl ${errors.avatar ? 'text-red-400' : 'text-gray-400 group-hover:text-amber-500'}`} />
                      <span className="text-xs text-gray-400 mt-1">Upload Photo</span>
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 h-7 w-7 bg-amber-500 rounded-full flex items-center justify-center shadow">
                    <FiCamera className="text-white text-xs" />
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
                <p className="text-sm text-gray-500">Click to upload profile photo</p>
                {errors.avatar && <p className="text-red-500 text-xs">⚠ {errors.avatar}</p>}
              </div>

              {/* Name Row */}
              <div className="grid grid-cols-2 gap-4">
                <InputField label="First Name" name="firstName" placeholder="John" icon={FiUser} />
                <InputField label="Last Name" name="lastName" placeholder="Doe" icon={FiUser} />
              </div>

              {/* Email */}
              <InputField label="Email Address" name="email" type="email" placeholder="you@example.com" icon={FiMail} />

              {/* Contact */}
              <InputField label="Contact Number" name="contact" type="tel" placeholder="10-digit mobile number" icon={FiPhone} />

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    className={`w-full pl-10 pr-11 py-3 rounded-xl border text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 transition ${errors.password ? 'border-red-400 focus:ring-red-200 bg-red-50' : 'border-gray-200 focus:ring-sky-200 focus:border-sky-400 bg-gray-50'
                      }`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1.5">⚠ {errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    name="confirmPassword"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    className={`w-full pl-10 pr-11 py-3 rounded-xl border text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 transition ${errors.confirmPassword ? 'border-red-400 focus:ring-red-200 bg-red-50' : 'border-gray-200 focus:ring-sky-200 focus:border-sky-400 bg-gray-50'
                      }`}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                    {showConfirm ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1.5">⚠ {errors.confirmPassword}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-base shadow-md hover:from-amber-600 hover:to-orange-600 focus:outline-none focus:ring-4 focus:ring-amber-200 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Creating Account...
                  </>
                ) : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-sky-500 hover:text-sky-700 transition">
                Sign In →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
