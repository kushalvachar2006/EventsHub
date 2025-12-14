import React, { useState, useContext, createContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      try {
        return JSON.parse(storedUser);
      } catch {}
    }
    return null;
  });

  const login = async ({ email, password }) => {
    const { data } = await authAPI.login({ email, password });
    // data includes token, role, etc.
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
  };

  const register = async ({ name, email, password, role, college, department }) => {
    const payload = { name, email, password, role, college, department };
    const { data } = await authAPI.register(payload);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const authValue = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};