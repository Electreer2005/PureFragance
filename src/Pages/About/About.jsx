// src/Pages/About/About.jsx
import { useNavigate } from 'react-router-dom';
import {
  FaSprayCan,
  FaLeaf,
  FaAward,
  FaHeart,
  FaGlobeAmericas,
  FaFlask,
  FaArrowRight,
} from 'react-icons/fa';
import './About.css';

const VALUES = [
  {
    icon: <FaAward />,
    title: 'Calidad premium',
    text: 'Trabajamos solo con fragancias originales de las mejores casas del mundo.',
  },
  {
    icon: <FaLeaf />,
    title: 'Sostenibilidad',
    text: 'Packaging reciclable y proveedores comprometidos con el medio ambiente.',
  },
  {
    icon: <FaFlask />,
    title: 'Curaduría experta',
    text: 'Cada perfume es seleccionado por nuestro equipo de perfumistas.',
  },
  {
    icon: <FaGlobeAmericas />,
    title: 'Envíos a todo el país',
    text: 'Llegamos a cada rincón de Argentina con envío express en 24hs.',
  },
];

const STATS = [
  { value: '10K+', label: 'Clientes felices' },
  { value: '250+', label: 'Fragancias' },
  { value: '50+', label: 'Marcas exclusivas' },
  { value: '8', label: 'Años en el mercado' },
];

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="About">
      {/* ============================================================
          HERO
          ============================================================ */}
      <section className="About-hero">
        <span className="About-eyebrow">Nuestra historia</span>
        <h1 className="About-title">
          El arte de <span className="text-gold">encontrar tu esencia</span>
        </h1>
        <p className="About-subtitle">
          Desde 2017 nos dedicamos a acercarte las fragancias más exclusivas
          del mundo, seleccionadas con obsesión por el detalle y amor por el
          perfume.
        </p>
      </section>

      {/* ============================================================
          HISTORIA
          ============================================================ */}
      <section className="About-story">
        <div className="About-storyText">
          <h2 className="About-sectionTitle">
            Cómo <span className="text-gold">empezó todo</span>
          </h2>
          <p>
            Todo comenzó con una obsesión: encontrar la fragancia perfecta.
            Después de años recorriendo perfumerías de Buenos Aires, París y
            Dubái, decidimos crear un espacio donde cada persona pudiera
            descubrir su firma olfativa sin perderse entre miles de opciones.
          </p>
          <p>
            Hoy trabajamos con más de 50 casas de perfumes internacionales y
            llevamos nuestras selecciones a más de 10.000 clientes en todo el
            país. Cada perfume que vendemos pasó por nuestras manos, nuestra
            nariz y nuestro corazón.
          </p>
        </div>

        <div className="About-storyStats">
          {STATS.map((stat) => (
            <div key={stat.label} className="About-stat">
              <span className="About-statValue">{stat.value}</span>
              <span className="About-statLabel">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          VALORES
          ============================================================ */}
      <section className="About-values">
        <div className="About-valuesHeader">
          <h2 className="About-sectionTitle">
            Lo que nos <span className="text-gold">define</span>
          </h2>
          <p className="About-sectionSubtitle">
            Estos son los pilares sobre los que construimos cada día
          </p>
        </div>

        <div className="About-valuesGrid">
          {VALUES.map((value) => (
            <div key={value.title} className="About-valueCard">
              <div className="About-valueIcon">{value.icon}</div>
              <h3 className="About-valueTitle">{value.title}</h3>
              <p className="About-valueText">{value.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          CTA FINAL
          ============================================================ */}
      <section className="About-cta">
        <FaHeart className="About-ctaIcon" />
        <h2 className="About-ctaTitle">
          Gracias por ser <span className="text-shimmer">parte de esto</span>
        </h2>
        <p className="About-ctaText">
          Explorá nuestra colección y encontrá la fragancia que te represente.
        </p>
        <button
          className="btn-primary About-ctaButton"
          onClick={() => navigate('/productos')}
        >
          Ver colección <FaArrowRight />
        </button>
      </section>
    </div>
  );
}
