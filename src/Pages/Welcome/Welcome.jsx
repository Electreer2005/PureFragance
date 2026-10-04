// src/Pages/Welcome/Welcome.jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FaUserSecret, FaSignInAlt, FaGem } from 'react-icons/fa';
import Logo from '../../assets/Logo.jpeg';
import './Welcome.css';

export default function Welcome() {
  const navigate = useNavigate();
  const { loginAsGuest } = useAuth();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleGuest = () => {
    loginAsGuest();
    navigate('/home', { replace: true });
  };

  return (
    <div className="Welcome-container">
      {/* Halo decorativo extra */}
      <div className="Welcome-glow" aria-hidden="true" />

      <div className="Welcome-content">
        <img src={Logo} alt="Logo Pure Fragance" className='Img-logo'/>
        {/* Badge superior */}
        <span className="Welcome-badge">
          <FaGem /> Perfumería de lujo
        </span>

        <h1>Bienvenidos a Pure Fragance</h1>
        <p>Descubrí los mejores perfumes, seleccionados para vos, al mejor precio.</p>

        <div className="Welcome-buttons">
          <button className="btn-primary" onClick={handleLogin}>
            <FaSignInAlt /> Iniciar sesión
          </button>

          <button className="btn-secondary" onClick={handleGuest}>
            <FaUserSecret /> Continuar como invitado
          </button>
        </div>
      </div>
    </div>
  );
}
