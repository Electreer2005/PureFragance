// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { toasts } from '../utils/toast';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ============================================================
  // CARGAR SESIÓN AL INICIAR
  // ============================================================
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  // ============================================================
  // LOGIN
  // ============================================================
 const login = useCallback(async (email, password) => {
  try {
    const { data } = await api.post('/auth/login', { email, password });

    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    toasts.welcomeBack(data.user.name); // 👈
    return { success: true, user: data.user };
  } catch (error) {
    const message = error.response?.data?.message || 'Error al iniciar sesión';
    toast.error(message); // 👈
    return { success: false, error: message };
  }
}, []);

const register = useCallback(async (name, email, password) => {
  try {
    const { data } = await api.post('/auth/register', { name, email, password });

    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    toasts.registered(data.user.name); // 👈
    return { success: true, user: data.user };
  } catch (error) {
    const message = error.response?.data?.message || 'Error al registrarse';
    toast.error(message); // 👈
    return { success: false, error: message };
  }
}, []);

const loginAsGuest = useCallback(() => {
  const guestUser = {
    id: 'guest',
    name: 'Invitado',
    email: null,
    role: 'guest',
    isGuest: true,
  };

  setUser(guestUser);
  setToken(null);
  localStorage.setItem('user', JSON.stringify(guestUser));
  localStorage.removeItem('token');

  toasts.guestMode(); // 👈
  return { success: true, user: guestUser };
}, []);

const logout = useCallback(() => {
  setUser(null);
  setToken(null);
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  toasts.loggedOut(); // 👈
}, []);

  // ============================================================
  // REGISTER
  // ============================================================
 

  // ============================================================
  // LOGIN COMO INVITADO
  // ============================================================
 

  // ============================================================
  // LOGOUT
  // ============================================================
 

  // ============================================================
  // ACTUALIZAR PERFIL
  // ============================================================
  const updateProfile = useCallback(async (updates) => {
    try {
      const { data } = await api.put('/auth/me', updates);

      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));

      return { success: true, user: data.user };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Error al actualizar perfil';
      return { success: false, error: message };
    }
  }, []);

  // ============================================================
  // CAMBIAR CONTRASEÑA (logueado)
  // ============================================================
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      await api.put('/auth/password', { currentPassword, newPassword });
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Error al cambiar contraseña';
      return { success: false, error: message };
    }
  }, []);

  // ============================================================
  // FORGOT PASSWORD
  // ============================================================
  const forgotPassword = useCallback(async (email) => {
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      return { success: true, message: data.message, resetToken: data.resetToken };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Error al enviar el correo';
      return { success: false, error: message };
    }
  }, []);

  // ============================================================
  // RESET PASSWORD
  // ============================================================
  const resetPassword = useCallback(async (token, password) => {
    try {
      const { data } = await api.post(`/auth/reset-password/${token}`, {
        password,
      });
      return { success: true, message: data.message };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Error al cambiar la contraseña';
      return { success: false, error: message };
    }
  }, []);

  // ============================================================
  // VALIDAR TOKEN DE RESET
  // ============================================================
  const validateResetToken = useCallback(async (token) => {
    try {
      const { data } = await api.get(`/auth/validate-reset-token/${token}`);
      return data.valid;
    } catch {
      return false;
    }
  }, []);

  // ============================================================
  // FLAGS DERIVADOS
  // ============================================================
  const isGuest = user?.isGuest === true;
  const isAuthenticated = !!user && !!token && !isGuest;
  const isLoggedIn = !!user;

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    isGuest,
    isLoggedIn,
    login,
    register,
    loginAsGuest,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    validateResetToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}