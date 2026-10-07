import Loading from '../../Components/Loading/Loading';
// src/Pages/Home/Home.jsx
import { useNavigate } from 'react-router-dom';
import Banner from '../../Components/Banner/Banner';
import CategoryCard from '../../Components/CategoryCard/CategoryCard';
import ProductCard from '../../Components/ProductCard/ProductCard';
import Benefits from '../../Components/Benefits/Benefits';
import CTA from '../../Components/CTA/CTA';
import { useProducts } from '../../hooks/useProducts';
import { formatPrice } from '../../services/productsService';
import './Home.css';

const CATEGORIES = [
  {
    id: 'hombre',
    name: 'Hombre',
    description: 'Fragancias intensas y amaderadas',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
  },
  {
    id: 'mujer',
    name: 'Mujer',
    description: 'Aromas florales y sofisticados',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80',
  },
  {
    id: 'unisex',
    name: 'Unisex',
    description: 'Para todos los estilos',
    image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=800&q=80',
  },
];

export default function Home() {
  const navigate = useNavigate();

  // ============================================================
  // PRODUCTOS DESTACADOS
  // ============================================================
  const { products, loading } = useProducts({ sort: 'rating' });

  // ✅ Blindado contra undefined
  const featured = (products || []).slice(0, 4);

  return (
    <div className="Home">
      <Banner />

      {/* Categorías */}
      <section className="Home-section">
        <div className="Home-sectionHeader">
          <h2 className="Home-sectionTitle">
            Encontrá tu <span className="text-gold">fragancia ideal</span>
          </h2>
          <p className="Home-sectionSubtitle">
            Tres universos olfativos para cada personalidad
          </p>
        </div>

        <div className="Category-grid">
          {CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              onClick={() => navigate(`/productos?categoria=${cat.id}`)}
            />
          ))}
        </div>
      </section>

      {/* Destacados */}
      <section className="Home-section Home-section--alt">
        <div className="Home-sectionHeader">
          <h2 className="Home-sectionTitle">
            Destacados <span className="text-gold">de la semana</span>
          </h2>
          <p className="Home-sectionSubtitle">
            Selección exclusiva de nuestras fragancias más pedidas
          </p>
        </div>

        {loading ? (
          <Loading inline message="Cargando las fragancias destacadas" />
        ) : (
          <div className="Product-grid">
            {featured.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                formatPrice={formatPrice}
                onClick={() => navigate(`/producto/${product._id}`)}
              />
            ))}
          </div>
        )}

        <div className="Home-ctaCenter">
          <button
            className="btn-secondary"
            onClick={() => navigate('/productos')}
          >
            Ver todos los productos
          </button>
        </div>
      </section>

      <Benefits />
      <CTA />
    </div>
  );
}
