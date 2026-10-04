// src/Pages/OrderSuccess/OrderSuccess.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
   const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      // Si no hay order_id en la URL, tratamos de usar la guardada
      const saved = localStorage.getItem('lastOrder');
      if (saved) {
        setOrder(JSON.parse(saved));
        setLoading(false);
        return;
      }
      navigate('/', { replace: true });
      return;
    }

    async function load() {
      try {
        const data = await fetchOrderById(orderId);
        setOrder(data);
        localStorage.setItem('lastOrder', JSON.stringify(data));
      } catch (err) {
        console.error('Error cargando orden:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [orderId, navigate]);

  useEffect(() => {
    const saved = localStorage.getItem('lastOrder');
    if (!saved) {
      navigate('/', { replace: true });
      return;
    }
    setOrder(JSON.parse(saved));
  }, [navigate]);

  if (!order) return null;

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

  const date = order.createdAt || order.date;

  if (loading) {
    return (
      <div className="OrderSuccess">
        <div className="OrderSuccess-card">
          <p>Cargando tu pedido...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="OrderSuccess">
      <div className="OrderSuccess-card">
        <div className="OrderSuccess-icon">
          <FaCheckCircle />
        </div>

        <h1 className="OrderSuccess-title">¡Gracias por tu compra!</h1>
        <p className="OrderSuccess-subtitle">
          Tu pedido fue confirmado y ya está siendo preparado.
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
              <span>Confirmación enviada a</span>
              <strong>{order.customer?.email}</strong>
            </div>
          </div>
        </div>

        <div className="OrderSuccess-total">
          <span>Total abonado</span>
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
