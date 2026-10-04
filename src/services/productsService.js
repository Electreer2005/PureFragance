// src/services/productsService.js
import api from './api';

// ============================================================
// LISTAR PRODUCTOS CON FILTROS
// ============================================================
export const fetchProducts = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.search) params.set('search', filters.search);
  if (filters.category && filters.category !== 'all')
    params.set('category', filters.category);
  if (filters.brands?.length) params.set('brand', filters.brands.join(','));
  if (filters.maxPrice && filters.maxPrice < 50000)
    params.set('maxPrice', filters.maxPrice);
  if (filters.sort && filters.sort !== 'featured')
    params.set('sort', filters.sort);

  const { data } = await api.get(`/products?${params.toString()}`);

  // ✅ Garantizar array y count consistente
  const products = Array.isArray(data?.products) ? data.products : [];
  const count = typeof data?.count === 'number' ? data.count : products.length;

  return { products, count };
};

// ============================================================
// OBTENER UN PRODUCTO POR ID
// ============================================================
export const fetchProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data.product; // ✅ ya devuelve el product directo
};

// ============================================================
// CREAR PRODUCTO (admin)
// ============================================================
export const createProduct = async (productData) => {
  const { data } = await api.post('/products', productData);
  return data.product;
};

// ============================================================
// ACTUALIZAR PRODUCTO (admin)
// ============================================================
export const updateProduct = async (id, productData) => {
  const { data } = await api.put(`/products/${id}`, productData);
  return data.product;
};

// ============================================================
// ELIMINAR PRODUCTO (admin)
// ============================================================
export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`);
  return data;
};

// ============================================================
// HELPERS
// ============================================================
export const formatPrice = (price) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(price);