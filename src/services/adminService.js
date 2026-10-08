// src/services/adminService.js
import api from './api';

// ============================================================
// ESTADÍSTICAS DEL DASHBOARD
// ============================================================
export const fetchDashboardStats = async () => {
  // Traemos productos y pedidos en paralelo
  const [productsRes, ordersRes] = await Promise.all([
    api.get('/products'),
    api.get('/orders/all'), // 👈 endpoint nuevo en el backend
  ]);

  const products = productsRes.data.products;
  const orders = ordersRes.data.orders;

  // Calcular stats
  const totalRevenue = orders.reduce(
    (acc, o) => (o.status !== 'cancelled' ? acc + o.total : acc),
    0
  );

  const pendingOrders = orders.filter((o) => o.status === 'pending').length;

  return {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue,
    pendingOrders,
    recentOrders: orders.slice(0, 5),
    lowStock: products.filter((p) => p.stock < 10),
  };
};

// ============================================================
// PRODUCTOS (admin)
// ============================================================
export const createProduct = async (productData) => {
  const { data } = await api.post('/products', productData);
  return data.product;
};

export const updateProduct = async (id, productData) => {
  const { data } = await api.put(`/products/${id}`, productData);
  return data.product;
};

export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`);
  return data;
};

// ============================================================
// PEDIDOS (admin)
// ============================================================
export const fetchAllOrders = async () => {
  const { data } = await api.get('/orders/all');
  return data.orders;
};

export const updateOrderStatus = async (id, status) => {
  const { data } = await api.put(`/orders/${id}/status`, { status });
  return data;
};
