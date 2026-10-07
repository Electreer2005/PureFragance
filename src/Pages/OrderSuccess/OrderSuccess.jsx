import Loading from '../../Components/Loading/Loading';
// src/Pages/OrderSuccess/OrderSuccess.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { fetchOrderById } from '../../services/ordersService';
import {
  FaCheckCircle,
  FaBox,
  FaTruck,
  FaHome,
  FaEnvelope,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { formatPrice } from '../../services/productsService';
import './OrderSuccess.css';

export default function OrderSuccess() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { clearCart } = useCart();
   const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        if (orderId && isAuthenticated) {
          const data = await fetchOrderById(orderId);
          if (active) { setOrder(data); localStorage.setItem('lastOrder', JSON.stringify(data)); }
        } else {
          const saved = JSON.parse(localStorage.getItem('lastOrder') || 'null');
          if (active && saved && (!orderId || saved._id === orderId)) setOrder(saved);
        }
      } catch (err) { console.error('Error cargando orden:', err); }
      finally { if (active) setLoading(false); }
    }
    load();
    return () => { active = false; };
  }, [orderId, isAuthenticated]);
  useEffect(() => {
    if (order?.paymentMethod === 'card' && order.paymentStatus === 'approved') clearCart(true);
  }, [order?._id, order?.paymentStatus, order?.paymentMethod, clearCart]);

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

  const date = order?.createdAt || order?.date;

  if (loading) return <Loading inline message="Cargando tu pedido" />;

  if (!order) return <div className="OrderSuccess"><p>El pago está en proceso. Revisá el estado desde Mis pedidos si tenés una cuenta.</p><button className="btn-primary" onClick={() => navigate('/pedidos')}>Ver mis pedidos</button></div>;

  return (
    <div className="OrderSuccess">
      <div className="OrderSuccess-card">
        <div className="OrderSuccess-icon">
          <FaCheckCircle />
        </div>

        <h1 className="OrderSuccess-title">¡Gracias por tu compra!</h1>
        <p className="OrderSuccess-subtitle">
          {order.stockStatus === 'unavailable' ? 'Recibimos el pago. Tu pedido requiere revisión de disponibilidad.' : order.paymentStatus === 'approved' ? 'Tu pago fue confirmado y tu pedido está siendo preparado.' : 'Recibimos tu pedido. El pago todavía está pendiente de confirmación.'}
        </p>

        <div className="OrderSuccess-orderNumber">
          <span>Número de orden</span>
          <strong>{order.orderNumber || order._id}</strong>
        </div>

        <p className="OrderSuccess-date">Realizado el {formatDate(date)}</p>

        <div className="OrderSuccess-summary">
          <div className="OrderSuccess-summaryRow">
            <FaBox />
            <div>
              <span>Productos</span>
              <strong>{order.items.length} items</strong>
            </div>
          </div>

          <div className="OrderSuccess-summaryRow">
            <FaTruck />
            <div>
              <span>Envío</span>
              <strong>
                {order.shipping === 0 ? 'Gratis' : formatPrice(order.shipping)}
              </strong>
            </div>
          </div>

          <div className="OrderSuccess-summaryRow">
            <FaMapMarkerAlt />
            <div>
              <span>Enviamos a</span>
              <strong>
                {order.customer?.address}, {order.customer?.city}
              </strong>
            </div>
          </div>

          <div className="OrderSuccess-summaryRow">
            <FaEnvelope />
            <div>
              <span>Email de contacto</span>
              <strong>{order.customer?.email}</strong>
            </div>
          </div>
        </div>

        <div className="OrderSuccess-total">
          <span>{order.paymentStatus === 'approved' ? 'Total abonado' : 'Total del pedido'}</span>
          <strong>{formatPrice(order.total)}</strong>
        </div>

        <div className="OrderSuccess-actions">
          <button
            className="btn-primary"
            onClick={() => navigate('/productos')}
          >
            Seguir comprando
          </button>
          <button
            className="btn-secondary"
            onClick={() => navigate('/home')}
          >
            <FaHome /> Ir al inicio
          </button>
        </div>

        <p className="OrderSuccess-note">
          Te enviaremos un email con el seguimiento del envío.
        </p>
      </div>
    </div>
  );
}

