// src/Pages/Admin/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaBox,
  FaShoppingBag,
  FaDollarSign,
  FaClock,
  FaArrowRight,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { fetchDashboardStats } from '../../services/adminService';
import { formatPrice } from '../../services/productsService';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Error cargando stats:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading || !stats) {
    return <div className="AdminLoading">Cargando dashboard...</div>;
  }

  const cards = [
    {
      label: 'Productos',
      value: stats.totalProducts,
      icon: <FaBox />,
      color: 'gold',
      to: '/admin/productos',
    },
    {
      label: 'Pedidos totales',
      value: stats.totalOrders,
      icon: <FaShoppingBag />,
      color: 'red',
      to: '/admin/pedidos',
    },
    {
      label: 'Ingresos',
      value: formatPrice(stats.totalRevenue),
      icon: <FaDollarSign />,
      color: 'success',
      to: null,
    },
    {
      label: 'Pendientes',
      value: stats.pendingOrders,
      icon: <FaClock />,
      color: 'warning',
      to: '/admin/pedidos',
    },
  ];

  return (
    <div className="Dashboard">
      <div className="Dashboard-header">
        <h1 className="Dashboard-title">
          Dashboard <span className="text-gold">general</span>
        </h1>
        <p className="Dashboard-subtitle">
          Vista rápida de tu tienda de perfumes
        </p>
      </div>

      {/* ========== STAT CARDS ========== */}
      <div className="Dashboard-stats">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`Dashboard-card Dashboard-card--${card.color}`}
            onClick={card.to ? () => navigate(card.to) : undefined}
            style={{ cursor: card.to ? 'pointer' : 'default' }}
          >
            <div className="Dashboard-cardIcon">{card.icon}</div>
            <div className="Dashboard-cardInfo">
              <span className="Dashboard-cardValue">{card.value}</span>
              <span className="Dashboard-cardLabel">{card.label}</span>
            </div>
            {card.to && (
              <FaArrowRight className="Dashboard-cardArrow" />
            )}
          </div>
        ))}
      </div>

      {/* ========== GRID INFERIOR ========== */}
      <div className="Dashboard-grid">
        {/* Pedidos recientes */}
        <div className="Dashboard-panel">
          <div className="Dashboard-panelHeader">
            <h2>Pedidos recientes</h2>
            <button onClick={() => navigate('/admin/pedidos')}>
              Ver todos <FaArrowRight />
            </button>
          </div>

          {stats.recentOrders.length === 0 ? (
            <p className="Dashboard-empty">No hay pedidos todavía</p>
          ) : (
            <table className="Dashboard-table">
              <thead>
                <tr>
                  <th>Orden</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <span className="Dashboard-orderId">
                        {order.orderNumber}
                      </span>
                    </td>
                    <td>{order.customer?.fullName || 'Invitado'}</td>
                    <td>{formatPrice(order.total)}</td>
                    <td>
                      <span className={`AdminStatusBadge ${order.status}`}>
                        {order.status === 'pending' && 'Pendiente'}
                        {order.status === 'shipped' && 'Enviado'}
                        {order.status === 'delivered' && 'Entregado'}
                        {order.status === 'cancelled' && 'Cancelado'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Stock bajo */}
        <div className="Dashboard-panel">
          <div className="Dashboard-panelHeader">
            <h2>
              <FaExclamationTriangle /> Stock bajo
            </h2>
            <button onClick={() => navigate('/admin/productos')}>
              Gestionar <FaArrowRight />
            </button>
          </div>

          {stats.lowStock.length === 0 ? (
            <p className="Dashboard-empty">Todo el stock está en orden ✅</p>
          ) : (
            <ul className="Dashboard-lowStock">
              {stats.lowStock.map((product) => (
                <li key={product._id}>
                  <img src={product.image} alt={product.name} />
                  <div>
                    <span className="Dashboard-lowStockName">
                      {product.name}
                    </span>
                    <span className="Dashboard-lowStockBrand">
                      {product.brand}
                    </span>
                  </div>
                  <span className="Dashboard-lowStockQty">
                    {product.stock} u.
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}