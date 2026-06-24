import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchCurrentUser, loginUser, registerUser, updateCurrentUser } from '../services/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const storedUser = JSON.parse(localStorage.getItem('expense-tracker-user') || 'null');
  const storedTheme = localStorage.getItem('expense-tracker-theme') || storedUser?.preferences?.theme || 'dark';
  const [user, setUser] = useState(storedUser);
  const [theme, setTheme] = useState(storedTheme);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  const applyTheme = (nextTheme) => {
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setTheme(nextTheme);
    localStorage.setItem('expense-tracker-theme', nextTheme);
  };

  useEffect(() => {
    const hydrateAuth = async () => {
      const token = localStorage.getItem('expense-tracker-token');
      if (!token) {
        applyTheme(storedTheme);
        setLoading(false);
        return;
      }

      try {
        const response = await fetchCurrentUser();
        const currentUser = response.data.user;
        setUser(currentUser);
        localStorage.setItem('expense-tracker-user', JSON.stringify(currentUser));
        const nextTheme = currentUser.preferences?.theme || storedTheme;
        applyTheme(nextTheme);
      } catch (error) {
        localStorage.removeItem('expense-tracker-token');
        localStorage.removeItem('expense-tracker-user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    hydrateAuth();

    const handleLogout = () => {
      setUser(null);
      setLoading(false);
    };

    window.addEventListener('app-logout', handleLogout);
    return () => window.removeEventListener('app-logout', handleLogout);
  }, []);

  const login = async (credentials) => {
    setAuthLoading(true);
    try {
      const response = await loginUser(credentials);
      localStorage.setItem('expense-tracker-token', response.data.token);
      localStorage.setItem('expense-tracker-user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      applyTheme(response.data.user.preferences?.theme || storedTheme);
      return response;
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (payload) => {
    setAuthLoading(true);
    try {
      const response = await registerUser(payload);
      localStorage.setItem('expense-tracker-token', response.data.token);
      localStorage.setItem('expense-tracker-user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      applyTheme(response.data.user.preferences?.theme || storedTheme);
      return response;
    } finally {
      setAuthLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    const response = await updateCurrentUser(updates);
    const updatedUser = response.data.user;
    localStorage.setItem('expense-tracker-user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    if (updatedUser.preferences?.theme) {
      applyTheme(updatedUser.preferences.theme);
    }
    return response;
  };

  const updateTheme = async (nextTheme) => {
    applyTheme(nextTheme);

    if (!user) return;

    try {
      const response = await updateCurrentUser({ preferences: { ...user.preferences, theme: nextTheme } });
      const updatedUser = response.data.user;
      localStorage.setItem('expense-tracker-user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      // keep local theme state if backend update fails
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('expense-tracker-token');
    localStorage.removeItem('expense-tracker-user');
  };

  const value = useMemo(
    () => ({ user, theme, login, register, logout, updateProfile, updateTheme, loading, authLoading }),
    [user, theme, loading, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
