// src/Pages/Settings/Settings.jsx
import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
    FaUser,
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaMoon,
    FaSave,
    FaArrowLeft,
    FaShieldAlt,
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

    return <SettingsForm key={user.id} user={user} />;
}

function SettingsForm({ user }) {
    const navigate = useNavigate();
    const { updateProfile, changePassword } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const [profile, setProfile] = useState({ name: user.name || '', email: user.email || '' });
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
    const [saving, setSaving] = useState(false);

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
        const result = await updateProfile({ name: profile.name.trim(), email: profile.email.trim() });
        setSaving(false);
        if (result.success) { setProfile({ name: result.user.name, email: result.user.email }); toasts.profileUpdated(); }
        else toast.error(result.error);
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
        const result = await changePassword(passwords.current, passwords.new);
        setSaving(false);
        if (result.success) { setPasswords({ current: '', new: '', confirm: '' }); toasts.passwordUpdated(); }
        else toast.error(result.error);
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
                        Administrá tus datos, seguridad y apariencia
                    </p>
                </div>
            </div>

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

            <section className="Settings-section">
                <h2 className="Settings-sectionTitle"><FaMoon /> Apariencia</h2>
                <label className="Settings-toggle">
                    <span>Modo oscuro</span>
                    <input type="checkbox" checked={isDark} onChange={toggleTheme} />
                    <span className="Settings-switch" />
                </label>
            </section>
        </div>
    );
}
