// src/services/ordersService.js
import api from './api';

// ============================================================
// CREAR PEDIDO
// ============================================================
export const createOrder = async (orderData) => {
  const { data } = await api.post('/orders', orderData);
  return data.order;
};

// ============================================================
// MIS PEDIDOS
// ============================================================
export const fetchMyOrders = async () => {
  const { data } = await api.get('/orders/mine');

  console.log('📦 fetchMyOrders response:', data);

  // ✅ Garantizar que siempre sea un array
  const orders = Array.isArray(data?.orders) ? data.orders : [];
  const count = typeof data?.count === 'number' ? data.count : orders.length;

  return { orders, count };
};

// ============================================================
// UN PEDIDO POR ID
// ============================================================
export const fetchOrderById = async (id) => {
  const { data } = await api.get(`/orders/${id}`);
  return data.order;
};