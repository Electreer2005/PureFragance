// src/routes/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute() {
  const { pathname } = useLocation();
  const publicPage = ['/home', '/productos', '/acerca', '/contacto'].includes(pathname) || /^\/producto\/[^/]+\/?$/.test(pathname);
  const { isAuthenticated, isGuest, loading } = useAuth();

  // Mientras se verifica el token, no redirigimos todavía
  if (loading) return <div>Cargando...</div>;

  // Si no está autenticado, redirige al login
  if (!publicPage && !isAuthenticated && !isGuest) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderiza la ruta hija
  return <Outlet />;
}
