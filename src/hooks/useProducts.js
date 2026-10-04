// src/hooks/useProducts.js
import { useState, useEffect, useCallback } from 'react';
import { fetchProducts } from '../services/productsService';

export function useProducts(filters = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filtersKey = JSON.stringify(filters);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchProducts(filters);
      console.log('📦 fetchProducts response:', response);

      // ✅ Normalizar: acepta array, { products }, { data }, o { data: { products } }
      let list = [];

      if (Array.isArray(response)) {
        list = response;
      } else if (Array.isArray(response?.products)) {
        list = response.products;
      } else if (Array.isArray(response?.data)) {
        list = response.data;
      } else if (Array.isArray(response?.data?.products)) {
        list = response.data.products;
      }

      console.log('✅ Productos normalizados:', list.length);
      setProducts(list);
    } catch (err) {
      console.error('Error cargando productos:', err);
      setError(err.response?.data?.message || 'Error al cargar productos');
      setProducts([]); // ✅ resetear a array vacío en caso de error
    } finally {
      setLoading(false);
    }
  }, [filtersKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    load();
  }, [load]);

  return {
    products,
    loading,
    error,
    refetch: load,
  };
}