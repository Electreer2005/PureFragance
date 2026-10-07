// src/Components/Footer/Footer.jsx
import {
  FaHome,
  FaSprayCan,
  FaInfoCircle,
  FaEnvelope,
  FaHeart,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { CONTACT_EMAIL } from '../../config/contact';
import Logo from '../../assets/Logo.jpeg';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="Footer">
      <div className="Footer-content">
        {/* ========== COLUMNA 1: MARCA ========== */}
        <div className="Footer-column Footer-brand">
          <Link to="/home" className="Footer-logo">
            <img src={Logo} alt="" className="Img-logo" />
            <h2>PureFragance</h2>
          </Link>
          <p className="Footer-tagline">
            Fragancias exclusivas para hombre y mujer. Elegancia que se siente,
            calidad que se recuerda.
          </p>

        </div>

        {/* ========== COLUMNA 2: NAVEGACIÓN ========== */}
        <div className="Footer-column">
          <h3>Navegación</h3>
          <ul>
            <li>
              <Link to="/home">
                <FaHome /> Inicio
              </Link>
            </li>
            <li>
              <Link to="/productos">
                <FaSprayCan /> Productos
              </Link>
            </li>
            <li>
              <Link to="/acerca">
                <FaInfoCircle /> Acerca de
              </Link>
            </li>
            <li>
              <Link to="/contacto">
                <FaEnvelope /> Contacto
              </Link>
            </li>
          </ul>
        </div>

        {/* ========== COLUMNA 3: CONTACTO ========== */}
        <div className="Footer-column">
          <h3>Contacto</h3>
          <ul className="Footer-contact">
            <li><FaEnvelope /><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></li>
          </ul>
        </div>

        {/* ========== COLUMNA 4: NEWSLETTER ========== */}
        <div className="Footer-column">
          <h3>¿Necesitás ayuda?</h3>
          <p className="Footer-newsletter-text">Consultanos sobre las fragancias o el estado de tu pedido.</p>
          <Link to="/contacto" className="btn-secondary">Escribinos</Link>
        </div>
      </div>

      {/* ========== BARRA INFERIOR ========== */}
      <div className="Footer-bottom">
        <p>
          © {year} PureFragance. Todos los derechos reservados.
        </p>
        <p className="Footer-made">
          Hecho con <FaHeart className="Footer-heart" /> en Argentina
        </p>
      </div>
    </footer>
  );
}
