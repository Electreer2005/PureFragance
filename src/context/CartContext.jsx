// src/context/CartContext.jsx
import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { toasts } from '../utils/toast';

// Context and provider intentionally share this module.
// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext(null);

// ============================================================
// CLAVE DE LOCALSTORAGE
// ============================================================
const STORAGE_KEY = 'cart';

// ============================================================
// GENERA UN ID ÚNICO POR PRODUCTO + TAMAÑO
// (así 50ml y 100ml son items separados)
// ============================================================
const makeItemId = (productId, ml) => `${productId}-${ml}`;

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch { return []; }
  });
  const loading = false;

  // ============================================================
  // PERSISTIR EN LOCALSTORAGE CUANDO CAMBIA
  // ============================================================
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, loading]);

  // ============================================================
  // AGREGAR AL CARRITO
  // ============================================================
  const addToCart = useCallback((product, ml, quantity = 1) => {
    if (product.stock <= 0) { toast.error('Producto sin stock'); return; }
    const size = product.sizes?.find((s) => s.ml === ml) || (!product.sizes?.length && ml === 100 ? { ml, price: product.price } : null);
    if (!size) {
      console.warn('Tamaño no encontrado:', ml);
      return;
    }

    const itemId = makeItemId(product._id, ml);

    setItems((prev) => {
      const inCart = prev.filter(i => i.productId === product._id).reduce((n,i) => n+i.quantity,0);
      if (inCart + quantity > product.stock) return prev;
      const existing = prev.find((i) => i.itemId === itemId);

      if (existing) {
        if (existing.quantity >= 10) {
          toast.error('Máximo 10 unidades por producto');
          return prev;
        }
        return prev.map((i) =>
          i.itemId === itemId
            ? { ...i, quantity: Math.min(i.quantity + quantity, 10) }
            : i
        );
      }

      return [
        ...prev,
        {
          itemId,
          productId: product._id,
          name: product.name,
          brand: product.brand,
          image: product.image,
          ml,
          price: size.price,
          quantity: Math.min(quantity, 10, product.stock),
        },
      ];
    });

    // 👇 Toast de confirmación
    toasts.addedToCart(product.name);
  }, []);

  const removeFromCart = useCallback((itemId) => {
    setItems((prev) => {
      const item = prev.find((i) => i.itemId === itemId);
      if (item) toasts.removedFromCart(item.name);
      return prev.filter((i) => i.itemId !== itemId);
    });
  }, []);

  const clearCart = useCallback((silent = false) => {
    setItems([]);
    if (!silent) toasts.cartCleared();
  }, []);





  // ============================================================
  // ACTUALIZAR CANTIDAD
  // ============================================================
  const updateQuantity = useCallback((itemId, quantity) => {
    if (quantity < 1 || quantity > 10) return;

    setItems((prev) =>
      prev.map((i) => (i.itemId === itemId ? { ...i, quantity } : i))
    );
  }, []);

  // ============================================================
  // ELIMINAR ITEM
  // ============================================================

  // ============================================================
  // VACIAR CARRITO
  // ============================================================

  // ============================================================
  // AGREGAR VARIOS DE UNA (útil para "agregar todo")
  // ============================================================
  const addManyToCart = useCallback((itemsToAdd) => {
    itemsToAdd.forEach(({ product, ml, quantity }) => {
      addToCart(product, ml, quantity);
    });
  }, [addToCart]);

  // ============================================================
  // VALORES DERIVADOS (memoizados)
  // ============================================================
  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    // Envío gratis a partir de $30.000
    const FREE_SHIPPING_THRESHOLD = 30000;
    const SHIPPING_COST = 1500;

    const shipping =
      subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD
        ? 0
        : SHIPPING_COST;

    return {
      subtotal,
      shipping,
      total: subtotal + shipping,
      itemCount,
      freeShippingRemaining: Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal),
      hasFreeShipping: subtotal >= FREE_SHIPPING_THRESHOLD && subtotal > 0,
    };
  }, [items]);



  // ============================================================
  // VALOR EXPUESTO
  // ============================================================
  const value = {
    items,
    loading,
    ...totals,
    addToCart,
    addManyToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isEmpty: items.length === 0,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
