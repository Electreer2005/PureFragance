// src/hooks/useProduct.js
import { useState, useEffect } from 'react';
import { fetchProductById } from '../services/productsService';

export function useProduct(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchProductById(id);
        if (isMounted) setProduct(data);
      } catch (err) {
        if (isMounted) {
          console.error('Error cargando producto:', err);
          setError(err.response?.data?.message || 'Producto no encontrado');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { product, loading, error };
}