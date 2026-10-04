// src/Components/Header/Header.jsx
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaSprayCan,
  FaInfoCircle,
  FaEnvelope,
  FaUser,
  FaCartPlus,
  FaUserSecret,
  FaSignOutAlt,
  FaBox,
  FaHeart,
  FaCog,
} from 'react-icons/fa';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoClose } from 'react-icons/io5';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useFavorites } from '../../hooks/useFavorites';
import Logo from '../../assets/Logo.jpeg';
import './Header.css';

export default function Header() {
  const navigate = useNavigate();
  const { user, isGuest, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();

  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [bump, setBump] = useState(false);

  const userMenuRef = useRef(null);
  const prevCount = useRef(itemCount);
  const { count: favoritesCount } = useFavorites();

  // ============================================================
  // Animación de rebote cuando se agrega algo al carrito
  // ============================================================
  useEffect(() => {
    if (itemCount > prevCount.current) {
      setBump(true);
      const timer = setTimeout(() => setBump(false), 500);
      prevCount.current = itemCount;
      return () => clearTimeout(timer);
    }
    prevCount.current = itemCount;
  }, [itemCount]);

  // ============================================================
  // Cerrar menú de usuario al clickear afuera
  // ============================================================
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/', { replace: true });
  };

  const handleGoProfile = () => {
    setUserMenuOpen(false);
    navigate('/perfil');
  };

  return (
    <header className="Header">
      <div className="Header-content">
        {/* ========== LOGO ========== */}
        <Link to="/home" className="logo" onClick={handleNavClick}>
          <img src={Logo} alt="" className="Img-logo" />
          <h1>Pure Fragance</h1>
        </Link>

        {/* ========== BOTÓN HAMBURGUESA (mobile) ========== */}
        <button
          className="btn-menu"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Abrir menú"
        >
          {menuOpen ? <IoClose /> : <GiHamburgerMenu />}
        </button>

        {/* ========== NAVBAR ========== */}
        <div className={`NavBar ${menuOpen ? 'is-open' : ''}`}>
          <nav>
            <ul>
              <li>
                <Link to="/home" onClick={handleNavClick}>
                  <FaHome /> Inicio
                </Link>
              </li>
              <li>
                <Link to="/productos" onClick={handleNavClick}>
                  <FaSprayCan /> Productos
                </Link>
              </li>
              <li>
                <Link to="/acerca" onClick={handleNavClick}>
                  <FaInfoCircle /> Acerca de
                </Link>
              </li>
              <li>
                <Link to="/contacto" onClick={handleNavClick}>
                  <FaEnvelope /> Contacto
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* ========== BOTONES DERECHA ========== */}
        <div className="btn-header">
          {/* --- Botón de perfil con menú desplegable --- */}
          <div className="UserMenu-wrapper" ref={userMenuRef}>
            <button
              className="btn-primary"
              onClick={() => setUserMenuOpen((v) => !v)}
              title={isGuest ? 'Modo invitado' : 'Mi cuenta'}
            >
              {isGuest ? <FaUserSecret /> : <FaUser />}
              <span className="btn-label">
                {isGuest ? 'Invitado' : user?.name?.split(' ')[0] || 'Cuenta'}
              </span>
            </button>

            {userMenuOpen && (
              <div className="UserMenu-dropdown">
                {isAuthenticated && (
                  <>
                    <button onClick={handleGoProfile}>
                      <FaUser /> Mi perfil
                      {favoritesCount > 0 && (
                        <span className="dropdown-badge">{favoritesCount}</span>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        navigate('/pedidos');
                      }}
                    >
                      <FaBox /> Mis pedidos
                    </button>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        navigate('/favoritos');
                      }}
                    >
                      <FaHeart /> Favoritos
                    </button>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        navigate('/configuracion');
                      }}
                    >
                      <FaCog /> Configuración
                    </button>
                    <hr />
                  </>
                )}{isAuthenticated && user?.role === 'admin' && (
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate('/admin');
                    }}
                    className="dropdown-admin"
                  >
                    <FaCog /> Panel de admin
                  </button>
                )}

                {isGuest && (
                  <>
                    <button onClick={handleGoProfile}>
                      <FaUserSecret /> Mi perfil de invitado
                    </button>
                    <hr />
                  </>
                )}

                <button onClick={handleLogout} className="dropdown-logout">
                  <FaSignOutAlt />
                  {isGuest ? 'Salir del modo invitado' : 'Cerrar sesión'}
                </button>
              </div>
            )}
          </div>

          {/* --- Botón del carrito con badge --- */}
          <button
            className="cart-btn"
            onClick={() => navigate('/carrito')}
            title="Carrito"
            aria-label={`Carrito (${itemCount} items)`}
          >
            <FaCartPlus />
            {itemCount > 0 && (
              <span className={`cart-badge ${bump ? 'bump' : ''}`}>
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
