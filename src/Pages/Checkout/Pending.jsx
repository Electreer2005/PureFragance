// src/Pages/Checkout/Pending.jsx
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaClock, FaHome } from 'react-icons/fa';

export default function Pending() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <div className="Checkout-pending">
      <div className="Checkout-pendingCard">
        <FaClock className="Checkout-pendingIcon" />
        <h1>Pago pendiente</h1>
        <p>
          Tu pago está siendo procesado. Te vamos a avisar por email cuando se
          acredite.
        </p>
        {orderId && <p className="Checkout-pendingId">Orden: {orderId}</p>}
        <button className="btn-primary" onClick={() => navigate('/home')}>
          <FaHome /> Ir al inicio
        </button>
      </div>
    </div>
  );
}