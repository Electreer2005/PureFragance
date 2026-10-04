// src/hooks/useOrders.js
import { useState, useEffect, useCallback } from 'react';
import { fetchMyOrders } from '../services/ordersService';

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchMyOrders();
      console.log('✅ useOrders recibió:', response);

      const list = Array.isArray(response?.orders) ? response.orders : [];
      setOrders(list);
    } catch (err) {
      console.error('Error cargando pedidos:', err);
      setError(err.response?.data?.message || 'Error al cargar pedidos');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    orders,
    loading,
    error,
    refetch: load,
  };
}