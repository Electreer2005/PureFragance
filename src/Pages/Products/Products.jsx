import Loading from '../../Components/Loading/Loading';
// src/Pages/Products/Products.jsx
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaFilter, FaTimes, FaSearch } from 'react-icons/fa';
import ProductCard from '../../Components/ProductCard/ProductCard';
import Filters from '../../Components/Filters/Filters';
import EmptyState from '../../Components/EmptyState/EmptyState';
import { SORT_OPTIONS } from '../../data/products';
import { useProducts } from '../../hooks/useProducts';
import { formatPrice } from '../../services/productsService';
import './Products.css';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // ============================================================
  // ESTADO DE FILTROS
  // ============================================================
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('categoria') || 'all');
  const [brands, setBrands] = useState(
    searchParams.get('marcas')?.split(',').filter(Boolean) || []
  );
  const [maxPrice, setMaxPrice] = useState(
    Number(searchParams.get('precio')) || 50000
  );
  const [sort, setSort] = useState(searchParams.get('orden') || 'featured');
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ============================================================
  // DEBOUNCE PARA BÚSQUEDA (evita muchas peticiones al tipear)
  // ============================================================
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // ============================================================
  // CARGAR PRODUCTOS CON FILTROS
  // ============================================================
  const filters = useMemo(
    () => ({
      search: debouncedSearch,
      category,
      brands,
      maxPrice,
      sort,
    }),
    [debouncedSearch, category, brands, maxPrice, sort]
  );

  const { products, loading, error } = useProducts(filters);

  // ============================================================
  // SINCRONIZAR FILTROS CON LA URL
  // ============================================================
  useEffect(() => {
    const params = {};
    if (search) params.q = search;
    if (category !== 'all') params.categoria = category;
    if (brands.length) params.marcas = brands.join(',');
    if (maxPrice !== 50000) params.precio = maxPrice;
    if (sort !== 'featured') params.orden = sort;
    setSearchParams(params, { replace: true });
  }, [search, category, brands, maxPrice, sort, setSearchParams]);

  const clearFilters = () => {
    setSearch('');
    setCategory('all');
    setBrands([]);
    setMaxPrice(50000);
    setSort('featured');
  };

  const hasActiveFilters =
    search || category !== 'all' || brands.length > 0 || maxPrice !== 50000;

  return (
    <div className="Products">
      {/* ============================================================
          HEADER
          ============================================================ */}
      <div className="Products-header">
        <div>
          <h1 className="Products-title">
            Nuestra <span className="text-gold">Colección</span>
          </h1>
          <p className="Products-subtitle">
            {loading
              ? 'Cargando...'
              : `${products.length} ${
                  products.length === 1 ? 'producto' : 'productos'
                }${hasActiveFilters ? ' encontrados' : ''}`}
          </p>
        </div>
      </div>

      {/* ============================================================
          TOOLBAR
          ============================================================ */}
      <div className="Products-toolbar">
        <div className="Products-search">
          <FaSearch />
          <input
            type="text"
            placeholder="Buscar por nombre o marca..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="Products-searchClear"
              onClick={() => setSearch('')}
              aria-label="Limpiar búsqueda"
            >
              <FaTimes />
            </button>
          )}
        </div>

        <div className="Products-toolbarRight">
          <select
            className="Products-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <button
            className="Products-filterBtn"
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir filtros"
          >
            <FaFilter /> Filtros
          </button>
        </div>
      </div>

      {/* ============================================================
          LAYOUT
          ============================================================ */}
      <div className="Products-layout">
        <aside className="Products-sidebar">
          <Filters
            category={category}
            setCategory={setCategory}
            brands={brands}
            setBrands={setBrands}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            onClear={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </aside>

        <main className="Products-main">
          {/* ========== LOADING ========== */}
          {loading && (
            <Loading inline message="Cargando el catálogo" />
          )}

          {/* ========== ERROR ========== */}
          {!loading && error && (
            <EmptyState
              title="No pudimos cargar los productos"
              message={error}
              actionLabel="Reintentar"
              onAction={() => window.location.reload()}
            />
          )}

          {/* ========== VACÍO ========== */}
          {!loading && !error && products.length === 0 && (
            <EmptyState
              title="No encontramos productos"
              message="Probá ajustar los filtros o buscar otro término."
              actionLabel="Limpiar filtros"
              onAction={clearFilters}
            />
          )}

          {/* ========== GRILLA ========== */}
          {!loading && !error && products.length > 0 && (
            <div className="Products-grid">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  formatPrice={formatPrice}
                  onClick={() => navigate(`/producto/${product._id}`)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ============================================================
          DRAWER (mobile)
          ============================================================ */}
      {drawerOpen && (
        <div
          className="Products-drawerOverlay"
          onClick={() => setDrawerOpen(false)}
        >
          <div
            className="Products-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="Products-drawerHeader">
              <h3>Filtros</h3>
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Cerrar filtros"
              >
                <FaTimes />
              </button>
            </div>

            <Filters
              category={category}
              setCategory={setCategory}
              brands={brands}
              setBrands={setBrands}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              onClear={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />

            <button
              className="btn-primary Products-drawerApply"
              onClick={() => setDrawerOpen(false)}
            >
              Ver resultados ({products.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
