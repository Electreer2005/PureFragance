// src/Pages/Profile/Profile.jsx
import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useFavorites } from '../../hooks/useFavorites';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  FaEnvelope,
  FaSignOutAlt,
  FaUserSecret,
  FaBox,
  FaHeart,
  FaSignInAlt,
  FaUserPlus,
  FaCalendarAlt,
  FaShieldAlt,
  FaEdit,
} from 'react-icons/fa';
import './Profile.css';

export default function Profile() {
  const { user, isGuest, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();
  const { count: favoriteCount } = useFavorites();
  const [ordersState, setOrdersState] = useState({ count: null, error: '' });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!isAuthenticated) return;
    let active = true;
    api.get('/orders').then(({ data }) => {
      if (active) setOrdersState({ count: data.count ?? data.orders.length, error: '' });
    }).catch(error => {
      if (active) setOrdersState({ count: null, error: error.response?.data?.message || 'No se pudo cargar el resumen de pedidos' });
    });
    return () => { active = false; };
  }, [isAuthenticated, user?.id, attempt]);

  if (loading) return <div className="Profile-loading">Cargando...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const handleGoLogin = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleGoRegister = () => {
    logout();
    navigate('/register', { replace: true });
  };

  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?';

  const memberSince = user.createdAt && !Number.isNaN(Date.parse(user.createdAt))
    ? new Date(user.createdAt).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }) : 'Sin fecha disponible';
  const stats = { orders: ordersState.count ?? '—', favorites: favoriteCount };

  return (
    <div className="Profile-container">
      {/* ============================================================
          CARD DE IDENTIDAD
          ============================================================ */}
      <div className="Profile-header">
        <div className={`Profile-avatar ${isGuest ? 'is-guest' : ''}`}>
          {isGuest ? <FaUserSecret /> : initials}
        </div>

        <div className="Profile-info">
          <h1>{user.name}</h1>

          {user.email && (
            <p className="Profile-email">
              <FaEnvelope /> {user.email}
            </p>
          )}

          <div className="Profile-badges">
            {isGuest && (
              <span className="Profile-badge guest">
                <FaUserSecret /> Modo invitado
              </span>
            )}
            {isAuthenticated && user.role === 'admin' && (
              <span className="Profile-badge admin">
                <FaShieldAlt /> Administrador
              </span>
            )}
            {isAuthenticated && user.role === 'user' && (
              <span className="Profile-badge user">
                <FaShieldAlt /> Cliente
              </span>
            )}
          </div>
        </div>

        {isAuthenticated && (
          <button
            className="Profile-editBtn"
            onClick={() => navigate('/configuracion')}
            title="Editar perfil"
          >
            <FaEdit /> Editar
          </button>
        )}
      </div>

      {/* ============================================================
          BANNER PARA INVITADOS
          ============================================================ */}
      {isGuest && (
        <div className="Profile-guest-banner">
          <div className="Profile-guest-icon">
            <FaUserSecret />
          </div>
          <h3>Estás navegando como invitado</h3>
          <p>
            Creá una cuenta o iniciá sesión para guardar tus perfumes favoritos,
            hacer pedidos y acceder a ofertas exclusivas.
          </p>
          <div className="Profile-guest-actions">
            <button className="btn-primary" onClick={handleGoLogin}>
              <FaSignInAlt /> Iniciar sesión
            </button>
            <button className="btn-secondary" onClick={handleGoRegister}>
              <FaUserPlus /> Crear cuenta
            </button>
          </div>
        </div>
      )}

      {/* ============================================================
          RESUMEN RÁPIDO (solo usuarios reales)
          ============================================================ */}
      {isAuthenticated && (
        <>
          {ordersState.error && <p role="alert">{ordersState.error} <button onClick={() => setAttempt(value => value + 1)}>Reintentar</button></p>}
          <div className="Profile-stats">
            <div className="Profile-stat" onClick={() => navigate('/pedidos')}>
              <div className="Profile-statIcon">
                <FaBox />
              </div>
              <div className="Profile-statInfo">
                <span className="Profile-statValue">{stats.orders}</span>
                <span className="Profile-statLabel">Pedidos</span>
              </div>
            </div>

            <div className="Profile-stat" onClick={() => navigate('/favoritos')}>
              <div className="Profile-statIcon">
                <FaHeart />
              </div>
              <div className="Profile-statInfo">
                <span className="Profile-statValue">{stats.favorites}</span>
                <span className="Profile-statLabel">Favoritos en este dispositivo</span>
              </div>
            </div>


          </div>

          {/* ============================================================
              INFO DE LA CUENTA
              ============================================================ */}
          <div className="Profile-section">
            <h3 className="Profile-sectionTitle">Información de la cuenta</h3>

            <ul className="Profile-detailList">
              <li>
                <FaEnvelope />
                <div>
                  <span className="Profile-detailLabel">Email</span>
                  <span className="Profile-detailValue">{user.email}</span>
                </div>
              </li>

              <li>
                <FaShieldAlt />
                <div>
                  <span className="Profile-detailLabel">Rol</span>
                  <span className="Profile-detailValue">
                    {user.role === 'admin' ? 'Administrador' : 'Cliente'}
                  </span>
                </div>
              </li>

              <li>
                <FaCalendarAlt />
                <div>
                  <span className="Profile-detailLabel">Miembro desde</span>
                  <span className="Profile-detailValue">{memberSince}</span>
                </div>
              </li>
            </ul>
          </div>
        </>
      )}

      {/* ============================================================
          BOTÓN CERRAR SESIÓN
          ============================================================ */}
      <div className="Profile-footer">
        <button className="btn-logout" onClick={handleLogout}>
          <FaSignOutAlt />{' '}
          {isGuest ? 'Salir del modo invitado' : 'Cerrar sesión'}
        </button>
      </div>
    </div>
  );
}

