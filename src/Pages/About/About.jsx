// src/Pages/About/About.jsx
import { useNavigate } from 'react-router-dom';
import {
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
    title: 'Encontrá tu aroma',
    text: 'Queremos ayudarte a comparar las opciones del catálogo y elegir una fragancia para vos.',
  },
  {
    icon: <FaLeaf />,
    title: 'Tu estilo',
    text: 'Explorá fragancias para hombre, mujer y unisex según tus preferencias.',
  },
  {
    icon: <FaFlask />,
    title: 'Información clara',
    text: 'Consultá las notas, presentaciones y precios disponibles en cada producto.',
  },
  {
    icon: <FaGlobeAmericas />,
    title: 'Compra online',
    text: 'Revisá las opciones y el costo de envío en el checkout antes de confirmar tu pedido.',
  },
];

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="About">
      {/* ============================================================
          HERO
          ============================================================ */}
      <section className="About-hero">
        <span className="About-eyebrow">Conocé PureFragance</span>
        <h1 className="About-title">
          El arte de <span className="text-gold">encontrar tu esencia</span>
        </h1>
        <p className="About-subtitle">
          PureFragance es una tienda online de perfumes para hombre, mujer y
          unisex. Un espacio para descubrir aromas y encontrar una fragancia
          que acompañe tu estilo.
        </p>
      </section>

      {/* ============================================================
          HISTORIA
          ============================================================ */}
      <section className="About-story">
        <div className="About-storyText">
          <h2 className="About-sectionTitle">
            Una fragancia, <span className="text-gold">tu estilo</span>
          </h2>
          <p>Un perfume puede acompañar tu día a día, una ocasión especial o convertirse en un regalo. Nuestro catálogo reúne opciones para que puedas explorar y comparar.</p>
          <p>Si necesitás orientación o tenés una consulta sobre un producto o pedido, podés escribirnos desde la sección de contacto.</p>
        </div>
        <div className="About-storyStats">
          <div className="About-stat"><span className="About-statValue">Explorá</span><span className="About-statLabel">Compará notas y presentaciones</span></div>
          <div className="About-stat"><span className="About-statValue">Consultá</span><span className="About-statLabel">Escribinos antes de elegir</span></div>
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
