import Loading from '../../Components/Loading/Loading';
// src/Pages/Orders/Orders.jsx
import { useState, useMemo } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaChevronDown,
  FaChevronUp,
  FaMapMarkerAlt,
  FaCreditCard,
  FaCalendarAlt,
  FaSearch,
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { useOrders } from '../../hooks/useOrders.js';
import EmptyState from '../../Components/EmptyState/EmptyState';
import { formatPrice } from '../../services/productsService';
import './Orders.css';

// ============================================================
// ESTADOS (mismos que en el backend)
// ============================================================
const ORDER_STATUS = {
  pending: { id: 'pending', label: 'Pendiente', color: 'warning' },
  shipped: { id: 'shipped', label: 'Enviado', color: 'info' },
  delivered: { id: 'delivered', label: 'Entregado', color: 'success' },
  cancelled: { id: 'cancelled', label: 'Cancelado', color: 'error' },
};

const STATUS_ICONS = {
  pending: <FaClock />,
  shipped: <FaTruck />,
  delivered: <FaCheckCircle />,
  cancelled: <FaTimesCircle />,
};

const FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'pending', label: 'Pendientes' },
  { id: 'shipped', label: 'Enviados' },
  { id: 'delivered', label: 'Entregados' },
  { id: 'cancelled', label: 'Cancelados' },
];

export default function Orders() {
  const navigate = useNavigate();
  const { user, isGuest, loading: authLoading } = useAuth();
  const { orders, loading, error } = useOrders();

  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  // ============================================================
  // FILTRADO
  // ============================================================
  const filteredOrders = useMemo(() => {
  // ✅ Garantizar array
  const safeOrders = Array.isArray(orders) ? orders : [];
  let result = [...safeOrders];

  if (filter !== 'all') {
    result = result.filter((o) => o.status === filter);
  }

  if (search.trim()) {
    const q = search.toLowerCase();
    result = result.filter(
      (o) =>
        o.orderNumber?.toLowerCase().includes(q) ||
        o.items?.some((i) => i.name?.toLowerCase().includes(q))
    );
  }

  return result;
}, [orders, filter, search]);

  // ============================================================
  // GUARDS
  // ============================================================
  if (authLoading) return <Loading message="Cargando tu cuenta" />;
  if (!user) return <Navigate to="/login" replace />;

  if (isGuest) {
    return (
      <div className="Orders">
        <EmptyState
          title="Necesitás una cuenta"
          message="Para ver tus pedidos y su seguimiento, creá una cuenta o iniciá sesión."
          actionLabel="Iniciar sesión"
          onAction={() => navigate('/login')}
        />
      </div>
    );
  }

  // ============================================================
  // HELPERS
  // ============================================================
  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

  const toggleExpand = (id) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  // ============================================================
  // ESTADO DE CARGA / ERROR
  // ============================================================
  if (loading) return <Loading inline message="Cargando tu pedido" />;

  if (error) {
    return (
      <div className="Orders">
        <EmptyState
          title="No pudimos cargar tus pedidos"
          message={error}
          actionLabel="Reintentar"
          onAction={() => window.location.reload()}
        />
      </div>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="Orders">
      {/* HEADER */}
      <div className="Orders-header">
        <div>
          <h1 className="Orders-title">
            Mis <span className="text-gold">pedidos</span>
          </h1>
          <p className="Orders-subtitle">
            {orders.length === 0
              ? 'Todavía no hiciste pedidos'
              : `${orders.length} ${orders.length === 1 ? 'pedido' : 'pedidos'} en total`}
          </p>
        </div>
      </div>

      {/* TOOLBAR */}
      {orders.length > 0 && (
        <div className="Orders-toolbar">
          <div className="Orders-search">
            <FaSearch />
            <input
              type="text"
              placeholder="Buscar por número o producto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="Orders-filters">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                className={`Orders-filter ${filter === f.id ? 'is-active' : ''}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
                {f.id !== 'all' && (
                  <span className="Orders-filterCount">
                    {orders.filter((o) => o.status === f.id).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* LISTA */}
      {orders.length === 0 ? (
        <EmptyState
          title="Todavía no hiciste pedidos"
          message="Cuando compres tu primera fragancia, acá vas a poder ver el estado y el detalle."
          actionLabel="Ver productos"
          onAction={() => navigate('/productos')}
        />
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          title="No encontramos pedidos"
          message="Probá con otro filtro o buscá por otro término."
          actionLabel="Limpiar filtros"
          onAction={() => {
            setFilter('all');
            setSearch('');
          }}
        />
      ) : (
        <div className="Orders-list">
          {filteredOrders.map((order) => {
            const status = ORDER_STATUS[order.status] || ORDER_STATUS.pending;
            const isExpanded = expanded === order._id;
            const date = order.createdAt || order.date;

            return (
              <article
                key={order._id}
                className={`OrderCard ${isExpanded ? 'is-expanded' : ''}`}
              >
                {/* HEADER */}
                <button
                  className="OrderCard-header"
                  onClick={() => toggleExpand(order._id)}
                >
                  <div className={`OrderCard-status ${status.color}`}>
                    {STATUS_ICONS[order.status]}
                    <span>{status.label}</span>
                  </div>

                  <div className="OrderCard-meta">
                    <span className="OrderCard-id">{order.orderNumber}</span>
                    <span className="OrderCard-date">
                      <FaCalendarAlt /> {formatDate(date)}
                    </span>
                  </div>

                  <div className="OrderCard-thumbs">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="OrderCard-thumb">
                        <img src={item.image} alt={item.name} />
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="OrderCard-thumb OrderCard-thumbMore">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>

                  <div className="OrderCard-total">
                    <span className="OrderCard-totalLabel">Total</span>
                    <span className="OrderCard-totalValue">
                      {formatPrice(order.total)}
                    </span>
                  </div>

                  <div className="OrderCard-expandIcon">
                    {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                </button>

                {/* DETALLE */}
                {isExpanded && (
                  <div className="OrderCard-detail">
                    <div className="OrderCard-items">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="OrderCard-item">
                          <div className="OrderCard-itemImage">
                            <img src={item.image} alt={item.name} />
                          </div>
                          <div className="OrderCard-itemInfo">
                            <span className="OrderCard-itemBrand">
                              {item.brand}
                            </span>
                            <span className="OrderCard-itemName">
                              {item.name}
                            </span>
                            <span className="OrderCard-itemSize">
                              {item.ml} ml · Cantidad: {item.quantity}
                            </span>
                          </div>
                          <span className="OrderCard-itemPrice">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="OrderCard-info">
                      <div className="OrderCard-infoBox">
                        <h4>
                          <FaMapMarkerAlt /> Envío
                        </h4>
                        <p>{order.customer?.address}</p>
                        <p>
                          {order.customer?.city}, {order.customer?.province} (
                          {order.customer?.zipCode})
                        </p>
                        <p className="OrderCard-infoMuted">
                          {order.shippingMethod === 'express'
                            ? 'Envío express (24-48hs)'
                            : 'Envío estándar (3-5 días)'}
                        </p>
                      </div>

                      <div className="OrderCard-infoBox">
                        <h4>
                          <FaCreditCard /> Pago
                        </h4>
                        <p>
                          {order.paymentMethod === 'card' && 'Tarjeta'}
                          {order.paymentMethod === 'transfer' &&
                            'Transferencia bancaria'}
                          {order.paymentMethod === 'cash' && 'Efectivo al recibir'}
                        </p>
                        {order.discount > 0 && (
                          <p className="OrderCard-infoDiscount">
                            Descuento: -{formatPrice(order.discount)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="OrderCard-totals">
                      <div className="OrderCard-totalRow">
                        <span>Subtotal</span>
                        <span>{formatPrice(order.subtotal)}</span>
                      </div>
                      <div className="OrderCard-totalRow">
                        <span>Envío</span>
                        <span>
                          {order.shipping === 0
                            ? 'Gratis'
                            : formatPrice(order.shipping)}
                        </span>
                      </div>
                      {order.discount > 0 && (
                        <div className="OrderCard-totalRow is-discount">
                          <span>Descuento</span>
                          <span>-{formatPrice(order.discount)}</span>
                        </div>
                      )}
                      <div className="OrderCard-totalRow is-total">
                        <span>Total</span>
                        <span>{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
