// src/utils/orders.js

const ORDERS_KEY = 'orders';

// ============================================================
// TIPOS DE ESTADO
// ============================================================
export const ORDER_STATUS = {
  pending: {
    id: 'pending',
    label: 'Pendiente',
    color: 'warning',
  },
  shipped: {
    id: 'shipped',
    label: 'Enviado',
    color: 'info',
  },
  delivered: {
    id: 'delivered',
    label: 'Entregado',
    color: 'success',
  },
  cancelled: {
    id: 'cancelled',
    label: 'Cancelado',
    color: 'error',
  },
};

// ============================================================
// LEER TODOS LOS PEDIDOS
// ============================================================
export const getOrders = () => {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// ============================================================
// GUARDAR UN PEDIDO NUEVO
// ============================================================
export const saveOrder = (order) => {
  const orders = getOrders();
  orders.unshift(order); // el más reciente primero
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  return order;
};

// ============================================================
// OBTENER UN PEDIDO POR ID
// ============================================================
export const getOrderById = (id) => {
  return getOrders().find((o) => o.id === id);
};

// ============================================================
// GENERAR PEDIDOS MOCK (para probar la pantalla)
// ============================================================
export const seedMockOrders = () => {
  const existing = getOrders();
  if (existing.length > 0) return existing; // ya hay, no hacemos nada

  const now = Date.now();
  const day = 86400000; // ms en un día

  const mockOrders = [
    {
      id: 'ORD-8F3A21B4',
      date: new Date(now - day * 2).toISOString(),
      status: 'shipped',
      items: [
        {
          itemId: '1-50',
          productId: 1,
          name: 'Noir Absolu',
          brand: 'Maison Luxe',
          image:
            'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80',
          ml: 50,
          price: 24999,
          quantity: 1,
        },
        {
          itemId: '3-100',
          productId: 3,
          name: 'Ombre Dorée',
          brand: 'Maison Luxe',
          image:
            'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&q=80',
          ml: 100,
          price: 48500,
          quantity: 1,
        },
      ],
      subtotal: 73499,
      shipping: 0,
      discount: 0,
      total: 73499,
      shippingMethod: 'standard',
      paymentMethod: 'card',
      customer: {
        fullName: 'Admin',
        email: 'admin@perfumes.com',
        phone: '+54 11 1234-5678',
        address: 'Av. Corrientes 1234',
        city: 'CABA',
        province: 'Buenos Aires',
        zipCode: '1043',
      },
    },
    {
      id: 'ORD-4C7E9D2F',
      date: new Date(now - day * 15).toISOString(),
      status: 'delivered',
      items: [
        {
          itemId: '2-50',
          productId: 2,
          name: 'Rose Éternelle',
          brand: 'Éclat Paris',
          image:
            'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600&q=80',
          ml: 50,
          price: 42999,
          quantity: 2,
        },
      ],
      subtotal: 85998,
      shipping: 0,
      discount: 8599.8,
      total: 77398.2,
      shippingMethod: 'standard',
      paymentMethod: 'transfer',
      customer: {
        fullName: 'Admin',
        email: 'admin@perfumes.com',
        phone: '+54 11 1234-5678',
        address: 'Av. Corrientes 1234',
        city: 'CABA',
        province: 'Buenos Aires',
        zipCode: '1043',
      },
    },
    {
      id: 'ORD-1A6B3F8C',
      date: new Date(now - day * 40).toISOString(),
      status: 'cancelled',
      items: [
        {
          itemId: '4-50',
          productId: 4,
          name: 'Velvet Oud',
          brand: 'Arabesque',
          image:
            'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=600&q=80',
          ml: 50,
          price: 42000,
          quantity: 1,
        },
      ],
      subtotal: 42000,
      shipping: 1500,
      discount: 0,
      total: 43500,
      shippingMethod: 'express',
      paymentMethod: 'cash',
      customer: {
        fullName: 'Admin',
        email: 'admin@perfumes.com',
        phone: '+54 11 1234-5678',
        address: 'Av. Corrientes 1234',
        city: 'CABA',
        province: 'Buenos Aires',
        zipCode: '1043',
      },
    },
  ];

  localStorage.setItem(ORDERS_KEY, JSON.stringify(mockOrders));
  return mockOrders;
};