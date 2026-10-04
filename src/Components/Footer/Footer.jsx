// src/Components/Footer/Footer.jsx
import {
  FaHome,
  FaSprayCan,
  FaInfoCircle,
  FaEnvelope,
  FaInstagram,
  FaTwitter,
  FaFacebookF,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaHeart,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
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
            <h1>Pure Fragance</h1>
          </Link>
          <p className="Footer-tagline">
            Fragancias exclusivas para hombre y mujer. Elegancia que se siente,
            calidad que se recuerda.
          </p>
          <div className="Footer-social">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>
          </div>
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
            <li>
              <FaMapMarkerAlt />
              <span>Av. Corrientes 1234, CABA</span>
            </li>
            <li>
              <FaPhoneAlt />
              <span>+54 11 1234-5678</span>
            </li>
            <li>
              <FaEnvelope />
              <span>hola@perfumes.com</span>
            </li>
          </ul>
        </div>

        {/* ========== COLUMNA 4: NEWSLETTER ========== */}
        <div className="Footer-column">
          <h3>Newsletter</h3>
          <p className="Footer-newsletter-text">
            Enterate de lanzamientos y ofertas exclusivas.
          </p>
          <form
            className="Footer-newsletter"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Tu email"
              aria-label="Tu email"
              required
            />
            <button type="submit">Suscribirme</button>
          </form>
        </div>
      </div>

      {/* ========== BARRA INFERIOR ========== */}
      <div className="Footer-bottom">
        <p>
          © {year} Perfumes. Todos los derechos reservados.
        </p>
        <p className="Footer-made">
          Hecho con <FaHeart className="Footer-heart" /> en Argentina
        </p>
      </div>
    </footer>
  );
}
