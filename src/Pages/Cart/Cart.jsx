// src/Pages/Cart/Cart.jsx
import { useNavigate } from 'react-router-dom';
import {
  FaTrash,
  FaMinus,
  FaPlus,
  FaArrowLeft,
  FaTruck,
  FaShoppingBag,
  FaLock,
} from 'react-icons/fa';
import { useCart } from '../../hooks/useCart';
import EmptyState from '../../Components/EmptyState/EmptyState';
import './Cart.css';

export default function Cart() {
  const navigate = useNavigate();
  const {
    items,
    subtotal,
    shipping,
    total,
    itemCount,
    freeShippingRemaining,
    hasFreeShipping,
    updateQuantity,
    removeFromCart,
    clearCart,
    isEmpty,
  } = useCart();

  const formatPrice = (price) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(price);

  // ============================================================
  // CARRITO VACÍO
  // ============================================================
  if (isEmpty) {
    return (
      <div className="Cart">
        <EmptyState
          title="Tu carrito está vacío"
          message="Parece que todavía no elegiste ninguna fragancia. Explorá nuestra colección y encontrá la tuya."
          actionLabel="Ver productos"
          onAction={() => navigate('/productos')}
        />
      </div>
    );
  }

  return (
    <div className="Cart">
      {/* ============================================================
          HEADER
          ============================================================ */}
      <div className="Cart-header">
        <button className="Cart-back" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Seguir comprando
        </button>

        <div className="Cart-titleBlock">
          <h1 className="Cart-title">Tu carrito</h1>
          <p className="Cart-count">
            {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
          </p>
        </div>

        <button className="Cart-clear" onClick={clearCart}>
          <FaTrash /> Vaciar carrito
        </button>
      </div>

      {/* ============================================================
          AVISO DE ENVÍO GRATIS
          ============================================================ */}
      <div className={`Cart-shippingBar ${hasFreeShipping ? 'is-free' : ''}`}>
        <FaTruck />
        {hasFreeShipping ? (
          <span>¡Tenés envío gratis en este pedido!</span>
        ) : (
          <span>
            Te faltan <strong>{formatPrice(freeShippingRemaining)}</strong> para
            tener envío gratis
          </span>
        )}
      </div>

      {/* ============================================================
          LAYOUT: LISTA + RESUMEN
          ============================================================ */}
      <div className="Cart-layout">
        {/* ========== LISTA DE ITEMS ========== */}
        <div className="Cart-list">
          {items.map((item) => (
            <article key={item.itemId} className="Cart-item">
              <div
                className="Cart-itemImage"
                onClick={() => navigate(`/producto/${item.productId}`)}
              >
                <img src={item.image} alt={item.name} />
              </div>

              <div className="Cart-itemInfo">
                <span className="Cart-itemBrand">{item.brand}</span>
                <h3
                  className="Cart-itemName"
                  onClick={() => navigate(`/producto/${item.productId}`)}
                >
                  {item.name}
                </h3>
                <span className="Cart-itemSize">{item.ml} ml</span>

                <div className="Cart-itemActions">
                  <div className="Cart-quantity">
                    <button
                      onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      aria-label="Restar"
                    >
                      <FaMinus />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                      disabled={item.quantity >= 10}
                      aria-label="Sumar"
                    >
                      <FaPlus />
                    </button>
                  </div>

                  <button
                    className="Cart-itemRemove"
                    onClick={() => removeFromCart(item.itemId)}
                    aria-label="Eliminar"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              <div className="Cart-itemPrice">
                <span className="Cart-itemPriceTotal">
                  {formatPrice(item.price * item.quantity)}
                </span>
                {item.quantity > 1 && (
                  <span className="Cart-itemPriceUnit">
                    {formatPrice(item.price)} c/u
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* ========== RESUMEN ========== */}
        <aside className="Cart-summary">
          <h2 className="Cart-summaryTitle">Resumen del pedido</h2>

          <div className="Cart-summaryRow">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          <div className="Cart-summaryRow">
            <span>Envío</span>
            <span className={shipping === 0 ? 'is-free' : ''}>
              {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
            </span>
          </div>

          <div className="Cart-summaryDivider" />

          <div className="Cart-summaryRow Cart-summaryTotal">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>

          <button
            className="btn-primary Cart-checkout"
            onClick={() => navigate('/checkout')}
          >
            <FaLock /> Finalizar compra
          </button>

          <p className="Cart-summaryNote">
            <FaLock /> Pago 100% seguro y encriptado
          </p>

          <div className="Cart-summaryBenefits">
            <div>
              <FaTruck />
              <span>Envío en 24-48hs</span>
            </div>
            <div>
              <FaShoppingBag />
              <span>Muestra de regalo</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
