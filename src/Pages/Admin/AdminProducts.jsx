// src/Pages/Admin/AdminProducts.jsx
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { useProducts } from '../../hooks/useProducts';
import { deleteProduct } from '../../services/adminService';
import { formatPrice } from '../../services/productsService';
import EmptyState from '../../Components/EmptyState/EmptyState';
// src/Pages/Admin/AdminProducts.jsx
import { toasts } from '../../utils/toast';
import toast from 'react-hot-toast';
import './AdminProducts.css';

export default function AdminProducts() {
  const navigate = useNavigate();
  const { products, loading, refetch } = useProducts({ sort: 'newest' });

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ============================================================
  // FILTRADO LOCAL
  // ============================================================
  const filtered = useMemo(() => {
    let result = [...products];

    if (categoryFilter !== 'all') {
      result = result.filter((p) => p.category === categoryFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      );
    }

    return result;
  }, [products, search, categoryFilter]);

  // ============================================================
  // ELIMINAR
  // ============================================================
  const handleDelete = async () => {
    if (!confirmDelete) return;

    setDeleting(true);
    const name = confirmDelete.name;

    try {
      await deleteProduct(confirmDelete._id);
      setConfirmDelete(null);
      toasts.productDeleted();
      await refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al eliminar');
    } finally {
      setDeleting(false);
    }
  };
  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="AdminProducts">
      {/* HEADER */}
      <div className="AdminProducts-header">
        <div>
          <h1 className="AdminProducts-title">
            Gestión de <span className="text-gold">productos</span>
          </h1>
          <p className="AdminProducts-subtitle">
            {products.length} {products.length === 1 ? 'producto' : 'productos'}{' '}
            en total
          </p>
        </div>

        <button
          className="btn-primary AdminProducts-addBtn"
          onClick={() => navigate('/admin/productos/nuevo')}
        >
          <FaPlus /> Nuevo producto
        </button>
      </div>

      {/* TOOLBAR */}
      <div className="AdminProducts-toolbar">
        <div className="AdminProducts-search">
          <FaSearch />
          <input
            type="text"
            placeholder="Buscar por nombre o marca..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="AdminProducts-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">Todas las categorías</option>
          <option value="hombre">Hombre</option>
          <option value="mujer">Mujer</option>
          <option value="unisex">Unisex</option>
        </select>
      </div>

      {/* TABLA / ESTADOS */}
      {loading ? (
        <div className="AdminProducts-loading">Cargando productos...</div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No hay productos"
          message="Empezá creando tu primer producto o cambiá los filtros."
          actionLabel="Crear producto"
          onAction={() => navigate('/admin/productos/nuevo')}
        />
      ) : (
        <div className="AdminProducts-tableWrapper">
          <table className="AdminProducts-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Marca</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => {
                const minPrice = product.sizes?.[0]?.price ?? product.price;
                return (
                  <tr key={product._id}>
                    <td>
                      <div className="AdminProducts-productCell">
                        <img src={product.image} alt={product.name} />
                        <div>
                          <span className="AdminProducts-productName">
                            {product.name}
                          </span>
                          <span className="AdminProducts-productId">
                            ID: {product._id.slice(-6)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>{product.brand}</td>
                    <td>
                      <span className="AdminProducts-categoryBadge">
                        {product.category}
                      </span>
                    </td>
                    <td className="AdminProducts-price">
                      {formatPrice(minPrice)}
                    </td>
                    <td>
                      <span
                        className={`AdminProducts-stock ${product.stock < 10 ? 'is-low' : ''}`}
                      >
                        {product.stock < 10 && <FaExclamationTriangle />}
                        {product.stock}
                      </span>
                    </td>
                    <td>
                      {product.isNew && (
                        <span className="AdminProducts-tag new">Nuevo</span>
                      )}
                      {product.isSale && (
                        <span className="AdminProducts-tag sale">Oferta</span>
                      )}
                      {!product.isNew && !product.isSale && (
                        <span className="AdminProducts-tag none">—</span>
                      )}
                    </td>
                    <td>
                      <div className="AdminProducts-actions">
                        <button
                          className="AdminProducts-actionBtn edit"
                          onClick={() =>
                            navigate(`/admin/productos/${product._id}/editar`)
                          }
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="AdminProducts-actionBtn delete"
                          onClick={() => setConfirmDelete(product)}
                          title="Eliminar"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN */}
      {confirmDelete && (
        <div
          className="AdminProducts-modalOverlay"
          onClick={() => !deleting && setConfirmDelete(null)}
        >
          <div
            className="AdminProducts-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="AdminProducts-modalIcon">
              <FaExclamationTriangle />
            </div>

            <h3>¿Eliminar producto?</h3>
            <p>
              Vas a eliminar <strong>{confirmDelete.name}</strong> de forma
              permanente. Esta acción no se puede deshacer.
            </p>

            <div className="AdminProducts-modalActions">
              <button
                className="btn-secondary"
                onClick={() => setConfirmDelete(null)}
                disabled={deleting}
              >
                Cancelar
              </button>
              <button
                className="btn-danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                <FaTrash /> {deleting ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}