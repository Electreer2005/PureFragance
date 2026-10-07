import Loading from '../../Components/Loading/Loading';
// src/Pages/ProductDetail/ProductDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaHeart,
  FaRegHeart,
  FaShoppingBag,
  FaTruck,
  FaGift,
  FaShieldAlt,
  FaArrowLeft,
  FaMinus,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import Reviews from '../../Components/Reviews/Reviews';
import ProductCard from '../../Components/ProductCard/ProductCard';
import { useCart } from '../../hooks/useCart';
import { useFavorites } from '../../hooks/useFavorites';
import { useProduct } from '../../hooks/useProduct';
import { formatPrice } from '../../services/productsService';
import api from '../../services/api';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { product, loading, error } = useProduct(id);

  const [reviewSummary, setReviewSummary] = useState(null);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // ============================================================
  // RESET AL CAMBIAR DE PRODUCTO
  // ============================================================
  useEffect(() => {
    // Reset state in a microtask so the next product renders with its own selection.
    let active = true;
    Promise.resolve().then(() => { if (active) { setSelectedImage(0); setSelectedSize(0); setQuantity(1); } });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => { active = false; };
  }, [id]);

  // ============================================================
  // CARGAR PRODUCTOS RELACIONADOS
  // ============================================================
  useEffect(() => {
    if (!product) return;

    async function loadRelated() {
      try {
        const { data } = await api.get(
          `/products?category=${product.category}`
        );
        setRelatedProducts(
          data.products.filter((p) => p._id !== product._id).slice(0, 4)
        );
      } catch (err) {
        console.error('Error cargando relacionados:', err);
      }
    }
    loadRelated();
  }, [product]);

  // ============================================================
  // GUARDS
  // ============================================================
  if (loading) return <Loading inline message="Cargando la fragancia" />;

  if (error || !product) {
    return <Navigate to="/productos" replace />;
  }

  // ============================================================
  // PROTECCIÓN DE CAMPOS
  // ============================================================
  const sizes = product.sizes?.length
    ? product.sizes
    : [{ ml: 100, price: product.price }];

  const safeSizeIndex = Math.min(selectedSize, sizes.length - 1);
  const currentSize = sizes[safeSizeIndex];
  const currentPrice = currentSize?.price ?? product.price;

  const images = product.images?.length ? product.images : [product.image];

  const isFav = isFavorite(product._id);

  // ============================================================
  // RATING
  // ============================================================
  const renderRating = (rating) => {
    const stars = [];
    const full = Math.floor(rating);
    const hasHalf = rating - full >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < full) stars.push(<FaStar key={i} />);
      else if (i === full && hasHalf) stars.push(<FaStarHalfAlt key={i} />);
      else stars.push(<FaRegStar key={i} />);
    }
    return stars;
  };

  // ============================================================
  // HANDLERS
  // ============================================================
  const handleAddToCart = () => {
    if (product.stock < quantity) return;
    addToCart(product, currentSize.ml, quantity);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  const handleQuantity = (delta) => {
    setQuantity((q) => Math.max(1, Math.min(10, product.stock, q + delta)));
  };

  const nextImage = () => {
    setSelectedImage((i) => (i + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((i) => (i - 1 + images.length) % images.length);
  };

  return (
    <div className="ProductDetail">
      <button
        className="ProductDetail-back"
        onClick={() => navigate(-1)}
        aria-label="Volver"
      >
        <FaArrowLeft /> Volver
      </button>

      <div className="ProductDetail-layout">
        {/* ========== GALERÍA ========== */}
        <div className="ProductDetail-gallery">
          <div className="ProductDetail-mainImage">
            <img src={images[selectedImage]} alt={product.name} />

            {product.isNew && (
              <span className="ProductDetail-tag new">Nuevo</span>
            )}
            {product.isSale && (
              <span className="ProductDetail-tag sale">Oferta</span>
            )}

            {images.length > 1 && (
              <>
                <button
                  className="ProductDetail-nav prev"
                  onClick={prevImage}
                  aria-label="Imagen anterior"
                >
                  <FaChevronLeft />
                </button>
                <button
                  className="ProductDetail-nav next"
                  onClick={nextImage}
                  aria-label="Imagen siguiente"
                >
                  <FaChevronRight />
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="ProductDetail-thumbs">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`ProductDetail-thumb ${i === selectedImage ? 'is-active' : ''}`}
                  onClick={() => setSelectedImage(i)}
                  aria-label={`Ver imagen ${i + 1}`}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ========== INFO ========== */}
        <div className="ProductDetail-info">
          <span className="ProductDetail-brand">{product.brand}</span>
          <h1 className="ProductDetail-title">{product.name}</h1>

          <div className="ProductDetail-rating">
            <div className="ProductDetail-stars">
              {renderRating(reviewSummary?.productId === id ? reviewSummary.rating : product.rating)}
            </div>
            <span className="ProductDetail-ratingValue">{reviewSummary?.productId === id ? reviewSummary.rating : product.rating}</span>
            <span className="ProductDetail-reviews">
              ({reviewSummary?.productId === id ? reviewSummary.count : product.reviewsCount} reseñas)
            </span>
          </div>

          <div className="ProductDetail-priceBlock">
            {product.originalPrice && (
              <span className="ProductDetail-priceOld">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span className="ProductDetail-price">{formatPrice(currentPrice)}</span>
          </div>

          <p className="ProductDetail-description">{product.description}</p>

          {/* Tamaño */}
          <div className="ProductDetail-section">
            <label className="ProductDetail-label">
              Tamaño: <strong>{currentSize.ml} ml</strong>
            </label>
            <div className="ProductDetail-sizes">
              {sizes.map((size, i) => (
                <button
                  key={size.ml}
                  className={`ProductDetail-size ${i === safeSizeIndex ? 'is-active' : ''}`}
                  onClick={() => setSelectedSize(i)}
                >
                  {size.ml} ml
                </button>
              ))}
            </div>
          </div>

          {/* Acciones */}
          <div className="ProductDetail-actions">
            <div className="ProductDetail-quantity">
              <button
                onClick={() => handleQuantity(-1)}
                disabled={quantity <= 1}
                aria-label="Restar"
              >
                <FaMinus />
              </button>
              <span>{quantity}</span>
              <button
                onClick={() => handleQuantity(1)}
                disabled={quantity >= Math.min(10, product.stock)}
                aria-label="Sumar"
              >
                <FaPlus />
              </button>
            </div>

            <button
              className={`btn-primary ProductDetail-addToCart ${addedFeedback ? 'is-added' : ''}`}
              disabled={product.stock <= 0 || quantity > product.stock}
              onClick={handleAddToCart}
            >
              {product.stock <= 0 ? 'Sin stock' : addedFeedback ? '✓ Agregado' : <><FaShoppingBag /> Agregar al carrito</>}
            </button>

            <button
              className={`ProductDetail-fav ${isFav ? 'is-active' : ''}`}
              onClick={() => toggleFavorite(product)}
              aria-label={isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              {isFav ? <FaHeart /> : <FaRegHeart />}
            </button>
          </div>

          <p role="status">{product.stock > 0 ? `${product.stock} unidades disponibles` : 'Producto agotado'}</p>

          {/* Beneficios */}
          <ul className="ProductDetail-benefits">
            <li><FaTruck /> <span>Envío gratis en compras desde $100.000</span></li>
            <li><FaGift /> <span>Muestra de regalo con cada compra</span></li>
            <li><FaShieldAlt /> <span>Producto 100% original garantizado</span></li>
          </ul>

          {/* Notas olfativas */}
          {product.notes && (
            <div className="ProductDetail-notes">
              <h3 className="ProductDetail-notesTitle">Pirámide olfativa</h3>

              {product.notes.top?.length > 0 && (
                <div className="ProductDetail-noteGroup">
                  <span className="ProductDetail-noteLabel">Salida</span>
                  <div className="ProductDetail-noteChips">
                    {product.notes.top.map((note) => (
                      <span key={note} className="ProductDetail-noteChip">{note}</span>
                    ))}
                  </div>
                </div>
              )}

              {product.notes.heart?.length > 0 && (
                <div className="ProductDetail-noteGroup">
                  <span className="ProductDetail-noteLabel">Corazón</span>
                  <div className="ProductDetail-noteChips">
                    {product.notes.heart.map((note) => (
                      <span key={note} className="ProductDetail-noteChip">{note}</span>
                    ))}
                  </div>
                </div>
              )}

              {product.notes.base?.length > 0 && (
                <div className="ProductDetail-noteGroup">
                  <span className="ProductDetail-noteLabel">Fondo</span>
                  <div className="ProductDetail-noteChips">
                    {product.notes.base.map((note) => (
                      <span key={note} className="ProductDetail-noteChip">{note}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Reviews key={id} productId={id} onSummary={setReviewSummary} />

      {/* ========== RELACIONADOS ========== */}
      {relatedProducts.length > 0 && (
        <section className="ProductDetail-related">
          <h2 className="ProductDetail-relatedTitle">
            También te puede <span className="text-gold">interesar</span>
          </h2>
          <div className="ProductDetail-relatedGrid">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                formatPrice={formatPrice}
                onClick={() => navigate(`/producto/${p._id}`)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

