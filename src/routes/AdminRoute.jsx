import Loading from '../Components/Loading/Loading';
// src/routes/AdminRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function AdminRoute() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <Loading message="Cargando tu cuenta" />;

  // No logueado → al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logueado pero no admin → al home
  if (user?.role !== 'admin') {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}