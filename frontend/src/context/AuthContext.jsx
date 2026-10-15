import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Verify the session when the app opens
    useEffect(() => {
        let active = true;

        const checkAuth = async () => {
            try {
                // First try getting current user profile with active accessToken cookie
                const meRes = await api.get('/users/me');
                const meUser = meRes.data?.data;
                if (active && meUser) {
                    setUser(meUser);
                    return;
                }
            } catch (err) {
                // If accessToken expired or not yet present, attempt to renew using refreshToken cookie
                try {
                    const res = await api.post('/users/refresh-token');
                    const loggedUser =
                        res.data?.data?.user ||
                        res.data?.data?.loggedUser ||
                        res.data?.user;

                    if (active && loggedUser) {
                        setUser(loggedUser);
                        return;
                    }

                    // Fallback: If refresh succeeded, re-fetch profile
                    const retryMe = await api.get('/users/me');
                    if (active && retryMe.data?.data) {
                        setUser(retryMe.data.data);
                        return;
                    }
                } catch (refreshErr) {
                    if (active) {
                        setUser(null);
                    }
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        checkAuth();

        return () => {
            active = false;
        };
    }, []);

    // Logout
    const logoutAction = async () => {
        setLoading(true);

        try {
            await api.post('/users/logout');
            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Logout API failed:', error);
            toast.error('Could not confirm server logout. Local session cleared.');
        } finally {
            // Always clear the frontend session
            setUser(null);
            localStorage.removeItem('lms_user');
            setLoading(false);
            navigate('/login', { replace: true });
        }
    };

    const loginAction = async (email, password, selectedRole) => {
        setLoading(true);

        try {
            const res = await api.post('/users/login', { email, password });
            const loggedUser = res.data?.data?.loggedUser;

            if (!loggedUser) {
                toast.error('Login response did not contain user information.');
                return;
            }

            if (loggedUser.role !== selectedRole) {
                try {
                    await api.post('/users/logout');
                } catch (logoutErr) {
                    console.error('Backend logout cleanup failed:', logoutErr);
                }

                setUser(null);
                toast.error(
                    `Unauthorized. This account is registered as a ${loggedUser.role}, not an ${selectedRole}.`
                );
                return;
            }

            setUser(loggedUser);
            toast.success('Logged in successfully! Welcome back 👋');

            if (loggedUser.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/student/dashboard');
            }
        } catch (error) {
            const msg =
                error.response?.data?.message ||
                'Login failed. Please try again.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const registerAction = async (formData) => {
        setLoading(true);

        try {
            await api.post('/users/register', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success('Account created successfully! Please log in.');
            navigate('/login');
        } catch (error) {
            const msg =
                error.response?.data?.message ||
                'Registration failed. Please try again.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loginAction,
                registerAction,
                logoutAction,
                loading
            }}
        >
            {loading ? (
                <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-300">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm font-medium">Checking session...</p>
                    </div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};
