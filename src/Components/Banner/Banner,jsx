// src/Components/Banner/Banner.jsx
import { useNavigate } from 'react-router-dom';
import heroImage from '../../assets/Banner.jpg';
import './Banner.css';

export default function Banner() {
  const navigate = useNavigate();

  return (
    <section
      className="hero"
      style={{ '--hero-bg': `url(${heroImage})` }}
    >
      {/* Capa oscura para que el texto se lea bien */}
      <div className="hero-overlay" aria-hidden="true"></div>

      {/* Partículas doradas */}
      <div className="gold-particle" aria-hidden="true"></div>
      <div className="gold-particle" aria-hidden="true"></div>
      <div className="gold-particle" aria-hidden="true"></div>

      {/* Contenido */}
      <div className="hero-content">
        <h1 className="text-shimmer">
          Fragancias que definen tu esencia
        </h1>

        <p className="hero-subtitle">
          Descubrí nuestra colección exclusiva de perfumes para hombre y mujer.
          Elegancia que se siente, calidad que se recuerda.
        </p>

        <div className="hero-actions">
          <button
            className="btn-primary"
            onClick={() => navigate('/productos')}
          >
            Descubrir
          </button>
          <button
            className="btn-secondary"
            onClick={() => navigate('/acerca')}
          >
            Conocer más
          </button>
        </div>
      </div>
    </section>
  );
}
