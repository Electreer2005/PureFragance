// src/Components/Filters/Filters.jsx
import { FaTimes } from 'react-icons/fa';
import { CATEGORIES, BRANDS } from '../../data/products';
import './Filters.css';

export default function Filters({
  category,
  setCategory,
  brands,
  setBrands,
  maxPrice,
  setMaxPrice,
  onClear,
  hasActiveFilters,
}) {
  const toggleBrand = (brand) => {
    setBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand]
    );
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <div className="Filters">
      <div className="Filters-header">
        <h3>Filtros</h3>
        {hasActiveFilters && (
          <button onClick={onClear} className="Filters-clear">
            <FaTimes /> Limpiar
          </button>
        )}
      </div>

      {/* ========== CATEGORÍA ========== */}
      <div className="Filters-group">
        <h4 className="Filters-groupTitle">Categoría</h4>
        <div className="Filters-categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`Filters-chip ${category === cat.id ? 'is-active' : ''}`}
              onClick={() => setCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* ========== MARCAS ========== */}
      <div className="Filters-group">
        <h4 className="Filters-groupTitle">Marcas</h4>
        <div className="Filters-brands">
          {BRANDS.map((brand) => (
            <label key={brand} className="Filters-checkbox">
              <input
                type="checkbox"
                checked={brands.includes(brand)}
                onChange={() => toggleBrand(brand)}
              />
              <span className="Filters-checkboxMark" />
              <span className="Filters-checkboxLabel">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ========== PRECIO ========== */}
      <div className="Filters-group">
        <h4 className="Filters-groupTitle">
          Precio máximo
          <span className="Filters-priceValue">{formatPrice(maxPrice)}</span>
        </h4>
        <input
          type="range"
          min="15000"
          max="50000"
          step="500"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="Filters-range"
        />
        <div className="Filters-rangeLabels">
          <span>{formatPrice(15000)}</span>
          <span>{formatPrice(50000)}</span>
        </div>
      </div>
    </div>
  );
}
