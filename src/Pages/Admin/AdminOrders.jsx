import Loading from '../../Components/Loading/Loading';
// src/Pages/Admin/AdminOrders.jsx
import api from '../../services/api';
import { useState, useEffect, useMemo } from 'react';
import {
  FaSearch,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';
import {
  fetchAllOrders,
  updateOrderStatus,
} from '../../services/adminService';
import { formatPrice } from '../../services/productsService';
import EmptyState from '../../Components/EmptyState/EmptyState';
// src/Pages/Admin/AdminOrders.jsx
import { toasts } from '../../utils/toast';
import toast from 'react-hot-toast';
import './AdminOrders.css';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'shipped', label: 'Enviado' },
  { value: 'delivered', label: 'Entregado' },
  { value: 'cancelled', label: 'Cancelado' },
];

const FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'pending', label: 'Pendientes' },
  { id: 'shipped', label: 'Enviados' },
  { id: 'delivered', label: 'Entregados' },
  { id: 'cancelled', label: 'Cancelados' },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // ============================================================
  // CARGAR
  // ============================================================
  useEffect(() => {
    let active = true;
    fetchAllOrders().then(data => { if (active) setOrders(data); })
      .catch(err => { if (active) setError(err.response?.data?.message || 'Error al cargar pedidos'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error al cargar pedidos');
    } finally {
      setLoading(false);
    }
  }

  // ============================================================
  // FILTRADO
  // ============================================================
  const filtered = useMemo(() => {
    let result = [...orders];

    if (filter !== 'all') {
      result = result.filter((o) => o.status === filter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderNumber?.toLowerCase().includes(q) ||
          o.customer?.fullName?.toLowerCase().includes(q) ||
          o.customer?.email?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [orders, filter, search]);

  // ============================================================
  // CAMBIAR ESTADO
  // ============================================================
  const handleStatusChange = async (orderId, newStatus) => {
  setUpdatingId(orderId);
  try {
    const updated = await updateOrderStatus(orderId, newStatus);
    setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)));
    toasts.orderStatusUpdated(newStatus);
  } catch (err) {
    toast.error(err.response?.data?.message || 'Error al actualizar');
  } finally {
    setUpdatingId(null);
  }
};

  async function updatePayment(order, stock = false) {
    if (!stock && !window.confirm('¿Confirmás que recibiste el pago de este pedido?')) return;
    setUpdatingId(order._id);
    try {
      const { data } = await api.put(`/orders/${order._id}/${stock ? 'stock' : 'payment'}`);
      setOrders(prev => prev.map(o => o._id === order._id ? data.order : o));
      toast.success(data.order.stockStatus === 'unavailable' ? 'Todavía falta stock' : 'Pedido actualizado');
    } catch (e) { toast.error(e.response?.data?.message || 'No se pudo confirmar'); }
    finally { setUpdatingId(null); }
  }

  // ============================================================
  // HELPERS
  // ============================================================
  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  // ============================================================
  // RENDER
  // ============================================================
  if (loading) {
    return (
      <div className="AdminOrders">
        <Loading inline message="Cargando pedidos" />
      </div>
    );
  }

  return (
    <div className="AdminOrders">
      {error && <p role="alert">{error} <button onClick={load}>Reintentar</button></p>}
      {/* HEADER */}
      <div className="AdminOrders-header">
        <div>
          <h1 className="AdminOrders-title">
            Gestión de <span className="text-gold">pedidos</span>
          </h1>
          <p className="AdminOrders-subtitle">
            {orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'} en total
          </p>
        </div>
      </div>

      {/* TOOLBAR */}
      {orders.length > 0 && (
        <div className="AdminOrders-toolbar">
          <div className="AdminOrders-search">
            <FaSearch />
            <input
              type="text"
              placeholder="Buscar por número, cliente o email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="AdminOrders-filters">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                className={`AdminOrders-filter ${filter === f.id ? 'is-active' : ''}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
                {f.id !== 'all' && (
                  <span className="AdminOrders-filterCount">
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
          title="No hay pedidos todavía"
          message="Cuando los clientes hagan sus compras, van a aparecer acá."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No hay pedidos con ese filtro"
          message="Probá con otro filtro o limpiá la búsqueda."
          actionLabel="Limpiar filtros"
          onAction={() => {
            setFilter('all');
            setSearch('');
          }}
        />
      ) : (
        <div className="AdminOrders-list">
          {filtered.map((order) => {
            const isExpanded = expanded === order._id;
            const date = order.createdAt || order.date;

            return (
              <article
                key={order._id}
                className={`AdminOrderCard ${isExpanded ? 'is-expanded' : ''}`}
              >
                {error && <p role="alert">{error} <button onClick={load}>Reintentar</button></p>}
      {/* HEADER */}
                <div className="AdminOrderCard-header">
                  <div className="AdminOrderCard-left">
                    <span className="AdminOrderCard-number">
                      {order.orderNumber}
                    </span>
                    <span className="AdminOrderCard-date">
                      <FaCalendarAlt /> {formatDate(date)}
                    </span>
                  </div>

                  <div className="AdminOrderCard-middle">
                    <span className="AdminOrderCard-customer">
                      <FaUser /> {order.customer?.fullName || 'Invitado'}
                    </span>
                    <span className="AdminOrderCard-email">
                      {order.customer?.email}
                    </span>
                  </div>

                  <div className="AdminOrderCard-right">
                    <select
                      className={`AdminOrderCard-status ${order.status}`}
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      disabled={updatingId === order._id}
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>

                    <span className="AdminOrderCard-total">
                      {formatPrice(order.total)}
                    </span>

                    <button
                      className="AdminOrderCard-expandBtn"
                      onClick={() =>
                        setExpanded((prev) =>
                          prev === order._id ? null : order._id
                        )
                      }
                      aria-label="Ver detalle"
                    >
                      {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  </div>
                </div>

                {/* DETALLE */}
                {isExpanded && (
                  <div className="AdminOrderCard-detail">
                    <div className="AdminOrderCard-cols">
                      {/* Columna cliente */}
                      <div className="AdminOrderCard-col">
                        <h4>Cliente</h4>
                        <p>
                          <FaUser /> {order.customer?.fullName}
                        </p>
                        <p>
                          <FaEnvelope /> {order.customer?.email}
                        </p>
                        <p>
                          <FaPhone /> {order.customer?.phone}
                        </p>
                      </div>

                      {/* Columna envío */}
                      <div className="AdminOrderCard-col">
                        <h4>Envío</h4>
                        <p>
                          <FaMapMarkerAlt /> {order.customer?.address}
                        </p>
                        <p>
                          {order.customer?.city},{' '}
                          {order.customer?.province} ({order.customer?.zipCode})
                        </p>
                        <p className="muted">
                          {order.shippingMethod === 'express'
                            ? 'Express (24-48hs)'
                            : 'Estándar (3-5 días)'}
                        </p>
                      </div>

                      {/* Columna pago */}
                      <div className="AdminOrderCard-col">
                        <h4>Pago</h4>
                        <p>Estado: {order.paymentStatus === 'approved' ? 'Pagado' : order.paymentStatus === 'refunded' ? 'Reembolsado' : 'Pendiente / no aprobado'}</p>
                        {order.couponCode && <p>Cupón: {order.couponCode}</p>}
                        {order.stockStatus === 'unavailable' && <p role="alert">Pago recibido, stock insuficiente. Reponé y reintentá o gestioná la cancelación y el reembolso.</p>}
                        {order.stockStatus === 'unavailable' && order.status !== 'cancelled' && <button className="btn-secondary" disabled={updatingId === order._id} onClick={() => updatePayment(order, true)}>Reintentar descuento de stock</button>}
                        {order.paymentMethod !== 'card' && order.paymentStatus !== 'approved' && order.paymentStatus !== 'refunded' && order.status !== 'cancelled' && <button className="btn-primary" disabled={updatingId === order._id} onClick={() => updatePayment(order)}>Confirmar pago recibido</button>}
                        {order.status === 'cancelled' && order.paymentStatus === 'approved' && <p>Cancelado con pago recibido: gestioná el reembolso por el medio de pago.</p>}
                        <p>
                          {order.paymentMethod === 'card' && 'Tarjeta'}
                          {order.paymentMethod === 'transfer' &&
                            'Transferencia bancaria'}
                          {order.paymentMethod === 'cash' && 'Efectivo al recibir'}
                        </p>
                        {order.discount > 0 && (
                          <p className="discount">
                            Descuento: -{formatPrice(order.discount)}
                          </p>
                        )}
                        <p className="muted">
                          Envío:{' '}
                          {order.shipping === 0
                            ? 'Gratis'
                            : formatPrice(order.shipping)}
                        </p>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="AdminOrderCard-items">
                      <h4>Productos ({order.items.length})</h4>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="AdminOrderCard-item">
                          <img src={item.image} alt={item.name} />
                          <div className="AdminOrderCard-itemInfo">
                            <span className="AdminOrderCard-itemName">
                              {item.name}
                            </span>
                            <span className="AdminOrderCard-itemMeta">
                              {item.brand} · {item.ml}ml · x{item.quantity}
                            </span>
                          </div>
                          <span className="AdminOrderCard-itemPrice">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
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
