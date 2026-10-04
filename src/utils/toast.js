// src/utils/toast.js
import toast from 'react-hot-toast';

export const customToast = {
  // Toast dorado para eventos premium
  premium: (message) =>
    toast(message, {
      icon: '✨',
      style: {
        background: 'linear-gradient(135deg, var(--gold-500), var(--gold-600))',
        color: 'var(--neutral-900)',
        fontWeight: 600,
        border: 'none',
      },
    }),

  // Toast de advertencia
  warning: (message) =>
    toast(message, {
      icon: '⚠️',
      style: {
        borderLeft: '3px solid var(--warning)',
      },
    }),
};

// ============================================================
// MENSAJES RÁPIDOS
// ============================================================
export const showSuccess = (message) => toast.success(message);
export const showError = (message) => toast.error(message);
export const showInfo = (message) => toast(message, { icon: 'ℹ️' });
export const showLoading = (message) => toast.loading(message);

// ============================================================
// MENSAJES ESPECÍFICOS (para no repetir strings por todos lados)
// ============================================================
export const toasts = {
  // Carrito
  addedToCart: (productName) => toast.success(`${productName} se agregó al carrito`),
  removedFromCart: (productName) => toast.success(`${productName} se quitó del carrito`),
  cartCleared: () => toast.success('Carrito vaciado'),

  // Favoritos
  addedToFavorites: () => toast.success('Agregado a favoritos'),
  removedFromFavorites: () => toast.success('Quitado de favoritos'),
  favoritesCleared: () => toast.success('Lista de favoritos vaciada'),

  // Auth
  welcomeBack: (name) => toast.success(`¡Bienvenido de vuelta, ${name}!`),
  registered: (name) => toast.success(`¡Cuenta creada, ${name}!`),
  loggedOut: () => toast.success('Sesión cerrada'),
  guestMode: () => toast('Estás navegando como invitado', { icon: '👤' }),

  // Pedidos
  orderCreated: () => toast.success('¡Pedido confirmado!'),
  orderStatusUpdated: (status) =>
    toast.success(`Estado actualizado a "${status}"`),
  orderCancelled: () => toast.success('Pedido cancelado'),

  // Productos (admin)
  productCreated: () => toast.success('Producto creado correctamente'),
  productUpdated: () => toast.success('Producto actualizado'),
  productDeleted: () => toast.success('Producto eliminado'),

  // Configuración
  profileUpdated: () => toast.success('Datos actualizados'),
  passwordUpdated: () => toast.success('Contraseña actualizada'),
  preferencesSaved: () => toast.success('Preferencias guardadas'),

  // Contacto
  messageSent: () => toast.success('¡Mensaje enviado! Te respondemos pronto'),

  // Errores genéricos
  genericError: () => toast.error('Algo salió mal. Intentá de nuevo'),
  networkError: () => toast.error('Error de conexión con el servidor'),
};