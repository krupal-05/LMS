import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // Check if a session hint exists from previous login
    const hasSessionHint = typeof window !== 'undefined' && localStorage.getItem('lms_has_session') === 'true';
    
    // Optimistically restore cached user if hint exists to avoid layout flashes
    const [user, setUser] = useState(() => {
        if (!hasSessionHint) return null;
        try {
            const saved = localStorage.getItem('lms_user');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    // Only start in loading state if there is a session hint to verify
    const [loading, setLoading] = useState(hasSessionHint);
    const navigate = useNavigate();

    // Verify session in background if session hint exists
    useEffect(() => {
        // If there is no session hint, user is anonymous; no API calls needed
        if (!hasSessionHint) {
            return;
        }

        let active = true;

        const verifySession = async () => {
            try {
                // api.js response interceptor automatically handles 401 & token refresh
                const res = await api.get('/users/me');
                const verifiedUser = res.data?.data;

                if (active && verifiedUser) {
                    setUser(verifiedUser);
                    localStorage.setItem('lms_user', JSON.stringify(verifiedUser));
                }
            } catch {
                if (active) {
                    setUser(null);
                    localStorage.removeItem('lms_has_session');
                    localStorage.removeItem('lms_user');
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        verifySession();

        // Listen for session expiry event from Axios interceptor
        const handleSessionExpired = () => {
            if (active) {
                setUser(null);
                setLoading(false);
            }
        };

        window.addEventListener('lms-session-expired', handleSessionExpired);

        return () => {
            active = false;
            window.removeEventListener('lms-session-expired', handleSessionExpired);
        };
    }, [hasSessionHint]);

    // Logout
    const logoutAction = async () => {
        setLoading(true);

        try {
            await api.post('/users/logout');
            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Logout API failed:', error);
            toast.error('Local session cleared.');
        } finally {
            setUser(null);
            localStorage.removeItem('lms_has_session');
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
                localStorage.removeItem('lms_has_session');
                localStorage.removeItem('lms_user');
                toast.error(
                    `Unauthorized. This account is registered as a ${loggedUser.role}, not an ${selectedRole}.`
                );
                return;
            }

            setUser(loggedUser);
            localStorage.setItem('lms_has_session', 'true');
            localStorage.setItem('lms_user', JSON.stringify(loggedUser));
            toast.success('Logged in successfully! Welcome back 👋');

            if (loggedUser.role === 'admin') {
                navigate('/admin/dashboard', { replace: true });
            } else {
                navigate('/student/dashboard', { replace: true });
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
            {children}
        </AuthContext.Provider>
    );
};
