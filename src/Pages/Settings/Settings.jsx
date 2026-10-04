// src/Pages/Settings/Settings.jsx
import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
    FaUser,
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaBell,
    FaMoon,
    FaTrash,
    FaSave,
    FaArrowLeft,
    FaShieldAlt,
    FaCheckCircle,
    FaExclamationTriangle,
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { toasts } from '../../utils/toast';
import toast from 'react-hot-toast';
import './Settings.css';

export default function Settings() {
    const navigate = useNavigate();
    const { user, isGuest, loading, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const [feedback, setFeedback] = useState(null);   

    // Eliminá 'darkMode' del estado de preferences:
    const [preferences, setPreferences] = useState({
        newsletter: true,
        orderUpdates: true,
        promotions: false,
        // darkMode: false,  ← eliminado
    });

    // ============================================================
    // ESTADO DEL FORMULARIO
    // ============================================================
    const [profile, setProfile] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });

    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: '',
    });

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const [saving, setSaving] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // ============================================================
    // GUARDS
    // ============================================================
    if (loading) return <div className="Settings-loading">Cargando...</div>;
    if (!user) return <Navigate to="/login" replace />;

    // Invitados no pueden editar cuenta
    if (isGuest) {
        return (
            <div className="Settings">
                <div className="Settings-guestNotice">
                    <FaExclamationTriangle />
                    <h2>Necesitás una cuenta</h2>
                    <p>
                        Para acceder a la configuración y editar tus datos, creá una cuenta
                        o iniciá sesión.
                    </p>
                    <div className="Settings-guestActions">
                        <button
                            className="btn-primary"
                            onClick={() => {
                                logout();
                                navigate('/login');
                            }}
                        >
                            Iniciar sesión
                        </button>
                        <button
                            className="btn-secondary"
                            onClick={() => {
                                logout();
                                navigate('/register');
                            }}
                        >
                            Crear cuenta
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ============================================================
    // HELPERS
    // ============================================================
    const showFeedback = (type, message) => {
        setFeedback({ type, message });
        setTimeout(() => setFeedback(null), 3000);
    };

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords((prev) => ({ ...prev, [name]: value }));
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const togglePreference = (key) => {
        setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    // ============================================================
    // SUBMIT PERFIL
    // ============================================================
    const handleProfileSubmit = async (e) => {
        e.preventDefault();

        if (!profile.name.trim()) {
            toast.error('El nombre no puede estar vacío');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(profile.email)) {
            toast.error('Email inválido');
            return;
        }

        setSaving(true);
        await new Promise((r) => setTimeout(r, 800));

        const updatedUser = { ...user, ...profile };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        setSaving(false);
        toasts.profileUpdated();
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (!passwords.current || !passwords.new || !passwords.confirm) {
            toast.error('Completá todos los campos');
            return;
        }

        if (passwords.new.length < 6) {
            toast.error('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (passwords.new !== passwords.confirm) {
            toast.error('Las contraseñas no coinciden');
            return;
        }

        setSaving(true);
        await new Promise((r) => setTimeout(r, 800));
        setSaving(false);
        setPasswords({ current: '', new: '', confirm: '' });
        toasts.passwordUpdated();
    };

    const handlePreferencesSubmit = async () => {
        setSaving(true);
        await new Promise((r) => setTimeout(r, 500));
        setSaving(false);
        toasts.preferencesSaved();
    };

    // ============================================================
    // SUBMIT PASSWORD
    // ============================================================


    // ============================================================
    // SUBMIT PREFERENCIAS
    // ============================================================

    // ============================================================
    // ELIMINAR CUENTA
    // ============================================================
    const handleDeleteAccount = async () => {
        setSaving(true);
        await new Promise((r) => setTimeout(r, 800));
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setSaving(false);
        navigate('/', { replace: true });
    };

    // ============================================================
    // RENDER
    // ============================================================
    const initials = user.name
        ? user.name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()
        : '?';

    return (
        <div className="Settings">
            {/* ============================================================
          HEADER
          ============================================================ */}
            <button className="Settings-back" onClick={() => navigate(-1)}>
                <FaArrowLeft /> Volver
            </button>

            <div className="Settings-header">
                <div className="Settings-avatar">{initials}</div>
                <div>
                    <h1 className="Settings-title">
                        <span className="text-gold">Configuración</span>
                    </h1>
                    <p className="Settings-subtitle">
                        Administrá tus datos, seguridad y preferencias
                    </p>
                </div>
            </div>

            {/* ============================================================
          FEEDBACK
          ============================================================ */}
            {feedback && (
                <div className={`Settings-feedback ${feedback.type}`}>
                    {feedback.type === 'success' ? (
                        <FaCheckCircle />
                    ) : (
                        <FaExclamationTriangle />
                    )}
                    <span>{feedback.message}</span>
                </div>
            )}

            {/* ============================================================
          DATOS PERSONALES
          ============================================================ */}
            <section className="Settings-section">
                <h2 className="Settings-sectionTitle">
                    <FaUser /> Datos personales
                </h2>

                <form onSubmit={handleProfileSubmit} className="Settings-form">
                    <div className="Settings-input">
                        <label htmlFor="name">Nombre</label>
                        <div className="Settings-inputBox">
                            <FaUser />
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={profile.name}
                                onChange={handleProfileChange}
                                placeholder="Tu nombre"
                            />
                        </div>
                    </div>

                    <div className="Settings-input">
                        <label htmlFor="email">Email</label>
                        <div className="Settings-inputBox">
                            <FaEnvelope />
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={profile.email}
                                onChange={handleProfileChange}
                                placeholder="tu@email.com"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary Settings-save"
                        disabled={saving}
                    >
                        <FaSave /> {saving ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                </form>
            </section>

            {/* ============================================================
          CAMBIAR CONTRASEÑA
          ============================================================ */}
            <section className="Settings-section">
                <h2 className="Settings-sectionTitle">
                    <FaLock /> Cambiar contraseña
                </h2>

                <form onSubmit={handlePasswordSubmit} className="Settings-form">
                    <div className="Settings-input">
                        <label htmlFor="current">Contraseña actual</label>
                        <div className="Settings-inputBox">
                            <FaLock />
                            <input
                                id="current"
                                name="current"
                                type={showPasswords.current ? 'text' : 'password'}
                                value={passwords.current}
                                onChange={handlePasswordChange}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('current')}
                                aria-label="Mostrar contraseña"
                            >
                                {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <div className="Settings-input">
                        <label htmlFor="new">Nueva contraseña</label>
                        <div className="Settings-inputBox">
                            <FaLock />
                            <input
                                id="new"
                                name="new"
                                type={showPasswords.new ? 'text' : 'password'}
                                value={passwords.new}
                                onChange={handlePasswordChange}
                                placeholder="Mínimo 6 caracteres"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('new')}
                                aria-label="Mostrar contraseña"
                            >
                                {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <div className="Settings-input">
                        <label htmlFor="confirm">Confirmar nueva contraseña</label>
                        <div className="Settings-inputBox">
                            <FaLock />
                            <input
                                id="confirm"
                                name="confirm"
                                type={showPasswords.confirm ? 'text' : 'password'}
                                value={passwords.confirm}
                                onChange={handlePasswordChange}
                                placeholder="Repetí la contraseña"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('confirm')}
                                aria-label="Mostrar contraseña"
                            >
                                {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn-secondary Settings-save"
                        disabled={saving}
                    >
                        <FaShieldAlt /> {saving ? 'Actualizando...' : 'Actualizar contraseña'}
                    </button>
                </form>
            </section>

            {/* ============================================================
          PREFERENCIAS
          ============================================================ */}
            <section className="Settings-section">
                <h2 className="Settings-sectionTitle">
                    <FaBell /> Preferencias
                </h2>

                <div className="Settings-toggles">
                    <label className="Settings-toggle">
                        <div className="Settings-toggleInfo">
                            <FaBell />
                            <div>
                                <span className="Settings-toggleLabel">
                                    Novedades y newsletter
                                </span>
                                <span className="Settings-toggleDesc">
                                    Recibí lanzamientos y novedades
                                </span>
                            </div>
                        </div>
                        <input
                            type="checkbox"
                            checked={preferences.newsletter}
                            onChange={() => togglePreference('newsletter')}
                        />
                        <span className="Settings-switch" />
                    </label>

                    <label className="Settings-toggle">
                        <div className="Settings-toggleInfo">
                            <FaBell />
                            <div>
                                <span className="Settings-toggleLabel">
                                    Actualizaciones de pedidos
                                </span>
                                <span className="Settings-toggleDesc">
                                    Avisos cuando tu pedido cambie de estado
                                </span>
                            </div>
                        </div>
                        <input
                            type="checkbox"
                            checked={preferences.orderUpdates}
                            onChange={() => togglePreference('orderUpdates')}
                        />
                        <span className="Settings-switch" />
                    </label>

                    <label className="Settings-toggle">
                        <div className="Settings-toggleInfo">
                            <FaBell />
                            <div>
                                <span className="Settings-toggleLabel">
                                    Promociones y descuentos
                                </span>
                                <span className="Settings-toggleDesc">
                                    Ofertas exclusivas para vos
                                </span>
                            </div>
                        </div>
                        <input
                            type="checkbox"
                            checked={preferences.promotions}
                            onChange={() => togglePreference('promotions')}
                        />
                        <span className="Settings-switch" />
                    </label>

                    <label className="Settings-toggle">
                        <div className="Settings-toggleInfo">
                            <FaMoon />
                            <div>
                                <span className="Settings-toggleLabel">Modo oscuro</span>
                                <span className="Settings-toggleDesc">
                                    Interfaz oscura para descansar la vista
                                </span>
                            </div>
                        </div>
                        <input
                            type="checkbox"
                            checked={isDark}
                            onChange={toggleTheme}
                        />
                        <span className="Settings-switch" />
                    </label>
                </div>

                <button
                    className="btn-primary Settings-save"
                    onClick={handlePreferencesSubmit}
                    disabled={saving}
                >
                    <FaSave /> Guardar preferencias
                </button>
            </section>

            {/* ============================================================
          ZONA DE PELIGRO
          ============================================================ */}
            <section className="Settings-section Settings-danger">
                <h2 className="Settings-sectionTitle Settings-dangerTitle">
                    <FaExclamationTriangle /> Zona de peligro
                </h2>

                <div className="Settings-dangerContent">
                    <div>
                        <h3>Eliminar cuenta</h3>
                        <p>
                            Una vez eliminada, no vas a poder recuperar tu cuenta ni tus
                            pedidos. Esta acción es permanente.
                        </p>
                    </div>

                    <button
                        className="Settings-deleteBtn"
                        onClick={() => setShowDeleteConfirm(true)}
                    >
                        <FaTrash /> Eliminar mi cuenta
                    </button>
                </div>
            </section>

            {/* ============================================================
          MODAL DE CONFIRMACIÓN DE ELIMINACIÓN
          ============================================================ */}
            {showDeleteConfirm && (
                <div
                    className="Settings-modalOverlay"
                    onClick={() => setShowDeleteConfirm(false)}
                >
                    <div
                        className="Settings-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="Settings-modalIcon">
                            <FaExclamationTriangle />
                        </div>

                        <h3 className="Settings-modalTitle">
                            ¿Eliminar tu cuenta?
                        </h3>

                        <p className="Settings-modalText">
                            Esta acción es permanente. Vas a perder tu historial de pedidos,
                            favoritos y datos personales.
                        </p>

                        <div className="Settings-modalActions">
                            <button
                                className="btn-secondary"
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={saving}
                            >
                                Cancelar
                            </button>
                            <button
                                className="btn-danger"
                                onClick={handleDeleteAccount}
                                disabled={saving}
                            >
                                <FaTrash /> {saving ? 'Eliminando...' : 'Sí, eliminar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
