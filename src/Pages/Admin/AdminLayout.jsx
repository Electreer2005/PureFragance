// src/Pages/Admin/AdminLayout.jsx
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaBox,
  FaShoppingBag,
  FaHome,
  FaSignOutAlt,
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import './AdminLayout.css';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: <FaTachometerAlt />, exact: true },
  { to: '/admin/productos', label: 'Productos', icon: <FaBox /> },
  { to: '/admin/cupones', label: 'Cupones', icon: <FaBox /> },
  { to: '/admin/pedidos', label: 'Pedidos', icon: <FaShoppingBag /> },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (to, exact) => {
    if (exact) return location.pathname === to;
    return location.pathname.startsWith(to);
  };

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="AdminLayout">
      {/* ========== SIDEBAR ========== */}
      <aside className="AdminSidebar">
        <div className="AdminSidebar-header">
          <h1 className="AdminSidebar-logo">
            Panel <span className="text-gold">Admin</span>
          </h1>
          <p className="AdminSidebar-user">
            Hola, <strong>{user?.name}</strong>
          </p>
        </div>

        <nav className="AdminSidebar-nav">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`AdminSidebar-link ${isActive(item.to, item.exact) ? 'is-active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="AdminSidebar-footer">
          <Link to="/home" className="AdminSidebar-link">
            <FaHome />
            <span>Ir al sitio</span>
          </Link>
          <button onClick={handleLogout} className="AdminSidebar-link AdminSidebar-logout">
            <FaSignOutAlt />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* ========== CONTENIDO ========== */}
      <main className="AdminMain">
        <Outlet />
      </main>
    </div>
  );
}
