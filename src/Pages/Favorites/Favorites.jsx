// src/Pages/Favorites/Favorites.jsx
import { useNavigate } from 'react-router-dom';
import {
  FaHeart,
  FaTrash,
  FaShoppingBag,
  FaArrowLeft,
} from 'react-icons/fa';
import { useFavorites } from '../../hooks/useFavorites';
import { useCart } from '../../hooks/useCart';
import EmptyState from '../../Components/EmptyState/EmptyState';
import './Favorites.css';

export default function Favorites() {
  const navigate = useNavigate();
  const {
    favorites,
    count,
    isEmpty,
    removeFavorite,
    clearFavorites,
  } = useFavorites();
  const { addToCart } = useCart();

  const formatPrice = (price) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(price);

  // ============================================================
  // VACÍO
  // ============================================================
  if (isEmpty) {
    return (
      <div className="Favorites">
        <EmptyState
          title="No tenés favoritos todavía"
          message="Tocá el corazón en los productos que te gusten para guardarlos acá."
          actionLabel="Ver productos"
          onAction={() => navigate('/productos')}
        />
      </div>
    );
  }

  // ============================================================
  // AGREGAR AL CARRITO DIRECTO
  // ============================================================
  const handleAddToCart = (product) => {
    const defaultMl = product.sizes?.[0]?.ml ?? 100;
    addToCart(product, defaultMl, 1);
  };

  return (
    <div className="Favorites">
      {/* ============================================================
          HEADER
          ============================================================ */}
      <div className="Favorites-header">
        <button className="Favorites-back" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Volver
        </button>

        <div className="Favorites-titleBlock">
          <h1 className="Favorites-title">
            Mis <span className="text-gold">favoritos</span>
          </h1>
          <p className="Favorites-subtitle">
            {count} {count === 1 ? 'producto guardado' : 'productos guardados'}
          </p>
        </div>

        <button className="Favorites-clear" onClick={clearFavorites}>
          <FaTrash /> Vaciar lista
        </button>
      </div>

      {/* ============================================================
          GRILLA
          ============================================================ */}
      <div className="Favorites-grid">
        {favorites.map((product) => (
          <article key={product.id} className="FavCard">
            <div
              className="FavCard-image"
              onClick={() => navigate(`/producto/${product.id}`)}
            >
              <img src={product.image} alt={product.name} />

              {product.isNew && (
                <span className="FavCard-tag new">Nuevo</span>
              )}
              {product.isSale && (
                <span className="FavCard-tag sale">Oferta</span>
              )}

              <button
                className="FavCard-remove"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFavorite(product.id);
                }}
                aria-label="Quitar de favoritos"
                title="Quitar de favoritos"
              >
                <FaHeart />
              </button>
            </div>

            <div className="FavCard-info">
              <span className="FavCard-brand">{product.brand}</span>
              <h3
                className="FavCard-name"
                onClick={() => navigate(`/producto/${product.id}`)}
              >
                {product.name}
              </h3>

              <div className="FavCard-price">
                {product.originalPrice && (
                  <span className="FavCard-priceOld">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                <span className="FavCard-priceCurrent">
                  {formatPrice(product.price)}
                </span>
              </div>

              <button
                className="btn-primary FavCard-addToCart"
                onClick={() => handleAddToCart(product)}
              >
                <FaShoppingBag /> Agregar al carrito
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
