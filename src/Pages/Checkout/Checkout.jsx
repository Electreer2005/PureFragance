// src/Pages/Checkout/Checkout.jsx
import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
    FaArrowLeft,
    FaTruck,
    FaCreditCard,
    FaUniversity,
    FaMoneyBillWave,
    FaLock,
    FaCheckCircle,
    FaMapMarkerAlt,
    FaUser,
    FaPhone,
    FaEnvelope,
    FaCity,
    FaHome,
} from 'react-icons/fa';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { saveOrder } from '../../utils/orders';
import './Checkout.css';
import { createOrder } from '../../services/ordersService';
import { createPaymentPreference } from '../../services/paymentService';
import { toasts } from '../../utils/toast';
import toast from 'react-hot-toast';

// ============================================================
// MÉTODOS DE ENVÍO DISPONIBLES
// ============================================================
const SHIPPING_METHODS = [
    {
        id: 'standard',
        label: 'Envío estándar',
        description: 'Llega en 3 a 5 días hábiles',
        cost: 1500,
        icon: <FaTruck />,
    },
    {
        id: 'express',
        label: 'Envío express',
        description: 'Llega en 24 a 48 horas',
        cost: 3500,
        icon: <FaTruck />,
    },
];

// ============================================================
// MÉTODOS DE PAGO DISPONIBLES
// ============================================================
const PAYMENT_METHODS = [
    {
        id: 'card',
        label: 'Tarjeta de crédito/débito',
        description: 'Visa, Mastercard, American Express',
        icon: <FaCreditCard />,
    },
    {
        id: 'transfer',
        label: 'Transferencia bancaria',
        description: '10% de descuento adicional',
        icon: <FaUniversity />,
    },
    {
        id: 'cash',
        label: 'Efectivo al recibir',
        description: 'Pagás cuando llega el pedido',
        icon: <FaMoneyBillWave />,
    },
];

export default function Checkout() {
    const navigate = useNavigate();
    const { user, isGuest, isAuthenticated } = useAuth();
    const {
        items,
        subtotal,
        isEmpty,
        clearCart,
    } = useCart();

    // ============================================================
    // ESTADO DEL FORMULARIO
    // ============================================================
    const [form, setForm] = useState({
        fullName: user?.name || '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        province: '',
        zipCode: '',
        notes: '',
    });

    const [shippingMethod, setShippingMethod] = useState('standard');
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // ============================================================
    // GUARDS
    // ============================================================
    if (isEmpty) {
        return <Navigate to="/carrito" replace />;
    }

    // ============================================================
    // VALIDACIÓN
    // ============================================================
    const validate = () => {
        const newErrors = {};

        if (!form.fullName.trim()) newErrors.fullName = 'Ingresá tu nombre completo';
        if (!form.email.trim()) newErrors.email = 'Ingresá tu email';
        else if (!/\S+@\S+\.\S+/.test(form.email))
            newErrors.email = 'Email inválido';

        if (!form.phone.trim()) newErrors.phone = 'Ingresá tu teléfono';
        if (!form.address.trim()) newErrors.address = 'Ingresá tu dirección';
        if (!form.city.trim()) newErrors.city = 'Ingresá tu ciudad';
        if (!form.province.trim()) newErrors.province = 'Ingresá tu provincia';
        if (!form.zipCode.trim()) newErrors.zipCode = 'Ingresá tu código postal';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ============================================================
    // HANDLERS
    // ============================================================
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        // Limpiar error del campo mientras escribe
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    // ============================================================
    // CÁLCULOS
    // ============================================================
    const shippingCost = SHIPPING_METHODS.find(
        (m) => m.id === shippingMethod
    )?.cost ?? 0;

    const freeShipping = subtotal >= 30000 && shippingMethod === 'standard';
    const actualShipping = freeShipping ? 0 : shippingCost;

    const transferDiscount =
        paymentMethod === 'transfer' ? subtotal * 0.1 : 0;

    const total = subtotal + actualShipping - transferDiscount;

    const formatPrice = (price) =>
        new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            maximumFractionDigits: 0,
        }).format(price);

    // ============================================================
    // SUBMIT
    // ============================================================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            toast.error('Revisá los campos marcados en rojo');
            const firstError = document.querySelector('.Checkout-input.has-error');
            firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        setSubmitting(true);

        try {
            const orderItems = items.map((item) => ({
                productId: item.productId,
                name: item.name,
                brand: item.brand,
                image: item.image,
                ml: item.ml,
                price: item.price,
                quantity: item.quantity,
            }));

            // ============================================================
            // Crear preferencia de pago en Mercado Pago
            // ============================================================
            const result = await createPaymentPreference({
                items: orderItems,
                subtotal,
                shipping: actualShipping,
                discount: transferDiscount,
                total,
                shippingMethod,
                paymentMethod,
                customer: {
                    fullName: form.fullName,
                    email: form.email,
                    phone: form.phone,
                    address: form.address,
                    city: form.city,
                    province: form.province,
                    zipCode: form.zipCode,
                    notes: form.notes,
                },
            });

            // ============================================================
            // Guardar datos de la orden para después
            // ============================================================
            localStorage.setItem('pendingOrderId', result.orderId);

            // Vaciar carrito (el pago ya está en proceso)
            clearCart(true);

            // ============================================================
            // Redirigir a Mercado Pago (sandbox para desarrollo)
            // ============================================================
            const paymentUrl = import.meta.env.DEV
                ? result.sandboxInitPoint
                : result.initPoint;

            window.location.href = paymentUrl;
        } catch (error) {
            console.error('Error creando preferencia:', error);
            toast.error(
                error.response?.data?.message || 'Error al iniciar el pago'
            );
            setSubmitting(false);
        }
    };
    return (
        <div className="Checkout">
            {/* ============================================================
          HEADER
          ============================================================ */}
            <button className="Checkout-back" onClick={() => navigate(-1)}>
                <FaArrowLeft /> Volver al carrito
            </button>

            <div className="Checkout-header">
                <h1 className="Checkout-title">Finalizar compra</h1>
                <p className="Checkout-subtitle">
                    Completá tus datos para confirmar el pedido
                </p>
            </div>

            {/* ============================================================
          LAYOUT: FORMULARIO + RESUMEN
          ============================================================ */}
            <form onSubmit={handleSubmit} className="Checkout-layout">
                {/* ========== FORMULARIO ========== */}
                <div className="Checkout-form">
                    {/* ---------- DATOS PERSONALES ---------- */}
                    <section className="Checkout-section">
                        <h2 className="Checkout-sectionTitle">
                            <span className="Checkout-stepNumber">1</span>
                            Datos personales
                        </h2>

                        <div className="Checkout-row">
                            <div
                                className={`Checkout-input ${errors.fullName ? 'has-error' : ''}`}
                            >
                                <label htmlFor="fullName">Nombre completo</label>
                                <div className="Checkout-inputBox">
                                    <FaUser />
                                    <input
                                        id="fullName"
                                        name="fullName"
                                        type="text"
                                        value={form.fullName}
                                        onChange={handleChange}
                                        placeholder="Juan Pérez"
                                    />
                                </div>
                                {errors.fullName && (
                                    <span className="Checkout-errorMsg">{errors.fullName}</span>
                                )}
                            </div>

                            <div className={`Checkout-input ${errors.email ? 'has-error' : ''}`}>
                                <label htmlFor="email">Email</label>
                                <div className="Checkout-inputBox">
                                    <FaEnvelope />
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="tu@email.com"
                                    />
                                </div>
                                {errors.email && (
                                    <span className="Checkout-errorMsg">{errors.email}</span>
                                )}
                            </div>
                        </div>

                        <div className={`Checkout-input ${errors.phone ? 'has-error' : ''}`}>
                            <label htmlFor="phone">Teléfono</label>
                            <div className="Checkout-inputBox">
                                <FaPhone />
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="+54 11 1234-5678"
                                />
                            </div>
                            {errors.phone && (
                                <span className="Checkout-errorMsg">{errors.phone}</span>
                            )}
                        </div>
                    </section>

                    {/* ---------- DIRECCIÓN DE ENVÍO ---------- */}
                    <section className="Checkout-section">
                        <h2 className="Checkout-sectionTitle">
                            <span className="Checkout-stepNumber">2</span>
                            Dirección de envío
                        </h2>

                        <div className={`Checkout-input ${errors.address ? 'has-error' : ''}`}>
                            <label htmlFor="address">Dirección</label>
                            <div className="Checkout-inputBox">
                                <FaMapMarkerAlt />
                                <input
                                    id="address"
                                    name="address"
                                    type="text"
                                    value={form.address}
                                    onChange={handleChange}
                                    placeholder="Av. Corrientes 1234, Piso 5 Dpto B"
                                />
                            </div>
                            {errors.address && (
                                <span className="Checkout-errorMsg">{errors.address}</span>
                            )}
                        </div>

                        <div className="Checkout-row">
                            <div className={`Checkout-input ${errors.city ? 'has-error' : ''}`}>
                                <label htmlFor="city">Ciudad</label>
                                <div className="Checkout-inputBox">
                                    <FaCity />
                                    <input
                                        id="city"
                                        name="city"
                                        type="text"
                                        value={form.city}
                                        onChange={handleChange}
                                        placeholder="CABA"
                                    />
                                </div>
                                {errors.city && (
                                    <span className="Checkout-errorMsg">{errors.city}</span>
                                )}
                            </div>

                            <div
                                className={`Checkout-input ${errors.province ? 'has-error' : ''}`}
                            >
                                <label htmlFor="province">Provincia</label>
                                <div className="Checkout-inputBox">
                                    <FaHome />
                                    <input
                                        id="province"
                                        name="province"
                                        type="text"
                                        value={form.province}
                                        onChange={handleChange}
                                        placeholder="Buenos Aires"
                                    />
                                </div>
                                {errors.province && (
                                    <span className="Checkout-errorMsg">{errors.province}</span>
                                )}
                            </div>
                        </div>

                        <div className={`Checkout-input ${errors.zipCode ? 'has-error' : ''}`}>
                            <label htmlFor="zipCode">Código postal</label>
                            <div className="Checkout-inputBox">
                                <FaMapMarkerAlt />
                                <input
                                    id="zipCode"
                                    name="zipCode"
                                    type="text"
                                    value={form.zipCode}
                                    onChange={handleChange}
                                    placeholder="1043"
                                />
                            </div>
                            {errors.zipCode && (
                                <span className="Checkout-errorMsg">{errors.zipCode}</span>
                            )}
                        </div>

                        <div className="Checkout-input">
                            <label htmlFor="notes">Notas adicionales (opcional)</label>
                            <textarea
                                id="notes"
                                name="notes"
                                value={form.notes}
                                onChange={handleChange}
                                placeholder="Ej: dejar en portería, llamar antes..."
                                rows={3}
                            />
                        </div>
                    </section>

                    {/* ---------- MÉTODO DE ENVÍO ---------- */}
                    <section className="Checkout-section">
                        <h2 className="Checkout-sectionTitle">
                            <span className="Checkout-stepNumber">3</span>
                            Método de envío
                        </h2>

                        <div className="Checkout-options">
                            {SHIPPING_METHODS.map((method) => {
                                const isFree = freeShipping && method.id === 'standard';
                                return (
                                    <label
                                        key={method.id}
                                        className={`Checkout-option ${shippingMethod === method.id ? 'is-active' : ''}`}
                                    >
                                        <input
                                            type="radio"
                                            name="shipping"
                                            value={method.id}
                                            checked={shippingMethod === method.id}
                                            onChange={(e) => setShippingMethod(e.target.value)}
                                        />
                                        <div className="Checkout-optionIcon">{method.icon}</div>
                                        <div className="Checkout-optionInfo">
                                            <span className="Checkout-optionLabel">{method.label}</span>
                                            <span className="Checkout-optionDesc">
                                                {method.description}
                                            </span>
                                        </div>
                                        <span className="Checkout-optionPrice">
                                            {isFree ? 'Gratis' : formatPrice(method.cost)}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </section>

                    {/* ---------- MÉTODO DE PAGO ---------- */}
                    <section className="Checkout-section">
                        <h2 className="Checkout-sectionTitle">
                            <span className="Checkout-stepNumber">4</span>
                            Método de pago
                        </h2>

                        <div className="Checkout-options">
                            {PAYMENT_METHODS.map((method) => (
                                <label
                                    key={method.id}
                                    className={`Checkout-option ${paymentMethod === method.id ? 'is-active' : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name="payment"
                                        value={method.id}
                                        checked={paymentMethod === method.id}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <div className="Checkout-optionIcon">{method.icon}</div>
                                    <div className="Checkout-optionInfo">
                                        <span className="Checkout-optionLabel">{method.label}</span>
                                        <span className="Checkout-optionDesc">
                                            {method.description}
                                        </span>
                                    </div>
                                    {method.id === 'transfer' && (
                                        <span className="Checkout-optionBadge">-10%</span>
                                    )}
                                </label>
                            ))}
                        </div>
                    </section>
                </div>

                {/* ========== RESUMEN LATERAL ========== */}
                <aside className="Checkout-summary">
                    <h2 className="Checkout-summaryTitle">Tu pedido</h2>

                    {/* Lista de items */}
                    <div className="Checkout-summaryItems">
                        {items.map((item) => (
                            <div key={item.itemId} className="Checkout-summaryItem">
                                <div className="Checkout-summaryItemImage">
                                    <img src={item.image} alt={item.name} />
                                    <span className="Checkout-summaryItemQty">
                                        {item.quantity}
                                    </span>
                                </div>
                                <div className="Checkout-summaryItemInfo">
                                    <span className="Checkout-summaryItemName">{item.name}</span>
                                    <span className="Checkout-summaryItemSize">{item.ml} ml</span>
                                </div>
                                <span className="Checkout-summaryItemPrice">
                                    {formatPrice(item.price * item.quantity)}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="Checkout-summaryDivider" />

                    {/* Totales */}
                    <div className="Checkout-summaryRow">
                        <span>Subtotal</span>
                        <span>{formatPrice(subtotal)}</span>
                    </div>

                    <div className="Checkout-summaryRow">
                        <span>Envío</span>
                        <span className={actualShipping === 0 ? 'is-free' : ''}>
                            {actualShipping === 0 ? 'Gratis' : formatPrice(actualShipping)}
                        </span>
                    </div>

                    {transferDiscount > 0 && (
                        <div className="Checkout-summaryRow is-discount">
                            <span>Descuento transferencia</span>
                            <span>-{formatPrice(transferDiscount)}</span>
                        </div>
                    )}

                    <div className="Checkout-summaryDivider" />

                    <div className="Checkout-summaryRow Checkout-summaryTotal">
                        <span>Total</span>
                        <span>{formatPrice(total)}</span>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary Checkout-submit"
                        disabled={submitting}
                    >
                        {submitting ? (
                            'Procesando...'
                        ) : (
                            <>
                                <FaLock /> Confirmar pedido
                            </>
                        )}
                    </button>

                    <p className="Checkout-secure">
                        <FaLock /> Pago 100% seguro y encriptado
                    </p>

                    {/* Aviso de invitado */}
                    {isGuest && (
                        <div className="Checkout-guestNotice">
                            <FaCheckCircle />
                            <p>
                                Estás comprando como invitado. Podés <strong>crear una cuenta</strong>{' '}
                                después para seguir tus pedidos.
                            </p>
                        </div>
                    )}
                </aside>
            </form>
        </div>
    );
}
