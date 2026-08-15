import { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import { TOKEN_KEY, USER_KEY } from '../utils/constants';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      const cachedUser = localStorage.getItem(USER_KEY);

      if (!token) {
        setLoading(false);
        return;
      }

      if (cachedUser) {
        try {
          setUser(JSON.parse(cachedUser));
        } catch {
          // ignore parse errors
        }
      }

      try {
        const res = await authService.getMe();
        setUser(res.user);
        localStorage.setItem(USER_KEY, JSON.stringify(res.user));
      } catch (error) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const register = useCallback(async (data) => {
    setAuthError(null);
    try {
      const res = await authService.register(data);
      localStorage.setItem(TOKEN_KEY, res.token);
      localStorage.setItem(USER_KEY, JSON.stringify(res.user));
      setUser(res.user);
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Registration failed. Please try again.';
      setAuthError(message);
      return { success: false, message };
    }
  }, []);

  const login = useCallback(async (data) => {
    setAuthError(null);
    try {
      const res = await authService.login(data);
      localStorage.setItem(TOKEN_KEY, res.token);
      localStorage.setItem(USER_KEY, JSON.stringify(res.user));
      setUser(res.user);
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Login failed. Please try again.';
      setAuthError(message);
      return { success: false, message };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const updateUserInContext = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  }, []);

  const value = {
    user,
    loading,
    authError,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    updateUserInContext,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
