// src/Components/CTA/CTA.jsx
import { FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './CTA.css';

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section className="CTA">
      <div className="CTA-content">
        <h2 className="CTA-title">
          ¿Listo para encontrar <br />
          <span className="text-shimmer">tu firma olfativa</span>?
        </h2>
        <p className="CTA-subtitle">
          Explorá nuestra colección completa y descubrí la fragancia que te
          representa.
        </p>
        <button
          className="btn-primary CTA-button"
          onClick={() => navigate('/productos')}
        >
          Ver colección completa <FaArrowRight />
        </button>
      </div>
    </section>
  );
}
