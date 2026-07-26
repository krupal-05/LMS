/* === Removed from Register.jsx === */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        contact: '',
        password: '',
        avatar: null
    });
    const [avatarPreview, setAvatarPreview] = useState(null);

    const { registerAction, loading } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, avatar: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('firstName', formData.firstName);
        data.append('lastName', formData.lastName);
        data.append('email', formData.email);
        data.append('contact', formData.contact);
        data.append('password', formData.password);
        if (formData.avatar) {
            data.append('avatar', formData.avatar);
        }

        const result = await registerAction(data);
        if (result.success) {
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen py-10  flex items-center justify-center bg-[#0a0a0b] text-zinc-100 overflow-x-hidden relative selection:bg-indigo-500/30">
            {/* Background Ambient Gradients */}
            <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none fixed">
                <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[140px]"></div>
                <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-violet-600/20 rounded-full blur-[140px]"></div>
                <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-900/10 rounded-full blur-[160px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-[540px] p-8 md:p-10 rounded-3xl bg-white/[0.03] backdrop-blur-[20px] border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] z-10 relative my-auto mx-4"
            >
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-indigo-500/20"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <line x1="19" x2="19" y1="8" y2="14" />
                            <line x1="22" x2="16" y1="11" y2="11" />
                        </svg>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl font-extrabold tracking-tight"
                    >
                        Create an Account
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-zinc-400 mt-2 text-sm"
                    >
                        Join us today! Let's get you set up.
                    </motion.p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Avatar Upload */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.45, duration: 0.5 }}
                        className="flex flex-col items-center justify-center mb-6"
                    >
                        <div className="relative group cursor-pointer">
                            <div
                                className={`w-28 h-28 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden transition-all duration-300 ${avatarPreview ? 'border-indigo-500' : 'border-zinc-700 bg-zinc-900/50 hover:border-indigo-500'}`}
                            >
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-zinc-500 group-hover:text-indigo-400 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                            <input
                                type="file"
                                name="avatar"
                                accept="image/*"
                                required
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full shadow-lg border border-indigo-400 transform translate-x-2 translate-y-2 pointer-events-none group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-xs text-zinc-500 mt-3 font-medium">Upload Profile Picture (Required)</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                        >
                            <label className="block text-sm font-medium text-zinc-300 mb-2">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                required
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-300"
                                placeholder="John"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                        >
                            <label className="block text-sm font-medium text-zinc-300 mb-2">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                required
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-300"
                                placeholder="Doe"
                            />
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                    >
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                            </div>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-300"
                                placeholder="you@email.com"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.65, duration: 0.5 }}
                    >
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Contact Number</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <input
                                type="tel"
                                name="contact"
                                required
                                value={formData.contact}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-300"
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                    >
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <input
                                type="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-300"
                                placeholder="••••••••"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="pt-4"
                    >
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={loading}
                            type="submit"
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 text-white font-medium shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300 relative overflow-hidden group"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                            ) : (
                                "Create Account"
                            )}

                            {/* Glossy overlay effect for premium button */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out"></div>
                        </motion.button>
                    </motion.div>
                </form>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="text-center text-sm text-zinc-400 mt-8"
                >
                    Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Sign in here</Link>
                </motion.p>
            </motion.div>
        </div>
    );
};

export default Register;


/* === Removed from AuthContext.jsx === */
const registerAction = async (formData) => {
    setLoading(true);
    try {
        const response = await api.post('/users/register', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        const data = response.data;
        if (data.statusCode === 201 || data.success) {
            toast.success(data.message || 'Registration successful!');
            return { success: true };
        } else {
            toast.error(data.message || 'Registration failed.');
            return { success: false, message: data.message };
        }
    } catch (error) {
        const errorMsg = error.response?.data?.message || error.message || 'An error occurred during registration.';
        toast.error(errorMsg);
        return { success: false, message: errorMsg };
    } finally {
        setLoading(false);
    }
};

/* === Removed from Login.jsx === */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { loginAction, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await loginAction(email, password);
        if (result.success) {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0b] text-zinc-100 overflow-hidden relative selection:bg-indigo-500/30">
            {/* Background Ambient Gradients */}
            <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[140px]"></div>
                <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-violet-600/20 rounded-full blur-[140px]"></div>
                <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-900/10 rounded-full blur-[160px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-[420px] p-8 md:p-10 rounded-3xl bg-white/[0.03] backdrop-blur-[20px] border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] z-10 relative"
            >
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-indigo-500/20"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl font-extrabold tracking-tight"
                    >
                        Welcome Back
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-zinc-400 mt-2 text-sm"
                    >
                        Sign in to your account to continue
                    </motion.p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-300"
                                placeholder="you@email.com"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    >
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-zinc-300">Password</label>
                            <a href="#" className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</a>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-300"
                                placeholder="••••••••"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="pt-2"
                    >
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={loading}
                            type="submit"
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 text-white font-medium shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300 relative overflow-hidden group"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                            ) : (
                                "Sign In"
                            )}

                            {/* Glossy overlay effect for premium button */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out"></div>
                        </motion.button>
                    </motion.div>
                </form>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-center text-sm text-zinc-400 mt-8"
                >
                    Don't have an account? <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Create one</Link>
                </motion.p>
            </motion.div>
        </div>
    );
};

export default Login;

/* === Removed from AuthContext.jsx === */
const loginAction = async (email, password) => {
    setLoading(true);
    try {
        const response = await api.post('/users/login', { email, password });

        // Axios stores everything in `response.data`
        // The backend returns a specific ApiResponse format `new ApiResponse(201, {loggedUser, accessToken, reFreshToken}, "User Login successfully")`
        const data = response.data;

        if (data.success && data.data) {
            setUser(data.data.loggedUser);
            toast.success(data.message || 'Login successful!');
            return { success: true, user: data.data.loggedUser };
        } else {
            toast.error(data.message || 'Login failed.');
            return { success: false, message: data.message };
        }
    } catch (error) {
        const errorMsg = error.response?.data?.message || error.message || 'An error occurred during login.';
        toast.error(errorMsg);
        return { success: false, message: errorMsg };
    } finally {
        setLoading(false);
    }
};
