// src/context/ThemeContext.jsx
import { createContext, useState, useEffect, useCallback } from 'react';

export const ThemeContext = createContext(null);

const STORAGE_KEY = 'theme'; // 'light' | 'dark' | 'system'

export function ThemeProvider({ children }) {
  // ============================================================
  // ESTADO: 'light' | 'dark' | 'system'
  // ============================================================
  const [theme, setTheme] = useState(() => {
    // Leer preferencia guardada
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved || 'system';
  });

  // ============================================================
  // DETECTAR SI EL SISTEMA PREFIERE OSCURO
  // ============================================================
  const [systemPrefersDark, setSystemPrefersDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Escuchar cambios en la preferencia del sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setSystemPrefersDark(e.matches);

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // ============================================================
  // CALCULAR SI APLICAR MODO OSCURO
  // ============================================================
  const isDark =
    theme === 'dark' || (theme === 'system' && systemPrefersDark);

  // ============================================================
  // APLICAR AL HTML
  // ============================================================
  useEffect(() => {
    const root = document.documentElement;

    if (isDark) {
      root.classList.add('dark-mode');
    } else {
      root.classList.remove('dark-mode');
    }
  }, [isDark]);

  // ============================================================
  // PERSISTIR PREFERENCIA
  // ============================================================
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  // ============================================================
  // FUNCIONES DE CONTROL
  // ============================================================
  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      // Toggle simple: si está en dark → light, si no → dark
      if (prev === 'dark') return 'light';
      if (prev === 'light') return 'dark';
      // Si está en 'system', toggle según el estado actual
      return isDark ? 'light' : 'dark';
    });
  }, [isDark]);

  const setLightTheme = useCallback(() => setTheme('light'), []);
  const setDarkTheme = useCallback(() => setTheme('dark'), []);
  const setSystemTheme = useCallback(() => setTheme('system'), []);

  const value = {
    theme,              // 'light' | 'dark' | 'system'
    isDark,             // boolean (aplicado actualmente)
    systemPrefersDark,  // boolean (preferencia del SO)
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    setSystemTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}