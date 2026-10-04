// src/Components/ProductCard/ProductCard.jsx
import { useState } from 'react';
import { FaStar, FaHeart, FaRegHeart, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../../hooks/useCart';
import { useFavorites } from '../../hooks/useFavorites';
import './ProductCard.css';

export default function ProductCard({ product, formatPrice, onClick }) {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  // 👇 _id
  const isFav = isFavorite(product._id);

  const handleFav = (e) => {
    e.stopPropagation();
    toggleFavorite(product);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const defaultMl = product.sizes?.[0]?.ml ?? 100;
    addToCart(product, defaultMl, 1);
  };

  const minPrice = product.sizes?.[0]?.price ?? product.price;

  return (
    <article className="ProductCard" onClick={onClick}>
      <div className="ProductCard-image">
        <img src={product.image} alt={product.name} loading="lazy" />

        <div className="ProductCard-tags">
          {product.isNew && <span className="ProductCard-tag new">Nuevo</span>}
          {product.isSale && <span className="ProductCard-tag sale">Oferta</span>}
        </div>

        <button
          className={`ProductCard-fav ${isFav ? 'is-fav' : ''}`}
          onClick={handleFav}
          aria-label={isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          {isFav ? <FaHeart /> : <FaRegHeart />}
        </button>

        <button
          className="ProductCard-addToCart"
          onClick={handleAddToCart}
          aria-label="Agregar al carrito"
        >
          <FaShoppingBag />
        </button>
      </div>

      <div className="ProductCard-info">
        <span className="ProductCard-brand">{product.brand}</span>
        <h3 className="ProductCard-name">{product.name}</h3>

        <div className="ProductCard-rating">
          <FaStar />
          <span>{product.rating}</span>
        </div>

        <div className="ProductCard-price">
          {product.originalPrice && (
            <span className="ProductCard-priceOld">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          <span className="ProductCard-priceCurrent">
            {formatPrice(minPrice)}
          </span>
        </div>
      </div>
    </article>
  );
}
