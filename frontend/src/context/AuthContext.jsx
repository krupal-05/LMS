import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('lms_user');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            localStorage.setItem('lms_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('lms_user');
        }
    }, [user]);

    const loginAction = async (email, password, selectedRole) => {
        setLoading(true);
        try {
            const res = await api.post('/users/login', { email, password });
            const loggedUser = res.data?.data?.loggedUser;

            // Check if user role matches the selected role
            if (loggedUser && loggedUser.role !== selectedRole) {
                try {
                    await api.post('/users/logout');
                } catch (logoutErr) {
                    console.error("Backend logout cleanup failed:", logoutErr);
                }
                setUser(null);
                toast.error(`Unauthorized. This account is registered as a ${loggedUser.role}, not an ${selectedRole}.`);
                return;
            }

            setUser(loggedUser);
            toast.success('Logged in successfully! Welcome back 👋');
            if (loggedUser?.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/student/dashboard');
            }
        } catch (error) {
            const msg = error.response?.data?.message || 'Login failed. Please try again.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const registerAction = async (formData) => {
        setLoading(true);
        try {
            // formData is a FormData object with avatar file
            await api.post('/users/register', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Account created successfully! Please log in.');
            navigate('/login');
        } catch (error) {
            const msg = error.response?.data?.message || 'Registration failed. Please try again.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const logoutAction = async () => {
        setLoading(true);
        try {
            await api.post('/users/logout');
            setUser(null);
            toast.success('Logged out successfully');
            navigate('/login');
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Logout failed.';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loginAction, registerAction, logoutAction, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

