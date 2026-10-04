// src/context/FavoritesContext.jsx
import { toasts } from '../utils/toast';
import { createContext, useState, useEffect, useCallback } from 'react';


export const FavoritesContext = createContext(null);

const STORAGE_KEY = 'favorites';

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setFavorites(JSON.parse(saved));
    } catch (err) {
      console.error('Error cargando favoritos:', err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    }
  }, [favorites, loading]);



const toggleFavorite = useCallback((product) => {
  setFavorites((prev) => {
    const exists = prev.find((p) => p._id === product._id);
    if (exists) {
      toasts.removedFromFavorites();
      return prev.filter((p) => p._id !== product._id);
    }
    toasts.addedToFavorites();
    return [...prev, product];
  });
}, []);

const clearFavorites = useCallback(() => {
  setFavorites([]);
  toasts.favoritesCleared();
}, []);

  // ============================================================
  // AGREGAR
  // ============================================================
  const addFavorite = useCallback((product) => {
    setFavorites((prev) => {
      // 👇 _id en lugar de id
      if (prev.find((p) => p._id === product._id)) return prev;
      return [...prev, product];
    });
  }, []);

  // ============================================================
  // QUITAR
  // ============================================================
  const removeFavorite = useCallback((productId) => {
    // 👇 _id
    setFavorites((prev) => prev.filter((p) => p._id !== productId));
  }, []);

  // ============================================================
  // TOGGLE
  // ============================================================
  
  // ============================================================
  // IS FAVORITE
  // ============================================================
  const isFavorite = useCallback(
    // 👇 _id
    (productId) => favorites.some((p) => p._id === productId),
    [favorites]
  );


  const value = {
    favorites,
    loading,
    count: favorites.length,
    isEmpty: favorites.length === 0,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}