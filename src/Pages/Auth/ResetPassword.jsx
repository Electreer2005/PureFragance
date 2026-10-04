// src/Pages/Auth/ResetPassword.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle,
  FaArrowLeft, FaShieldAlt,
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import './Auth.css';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const { resetPassword, validateResetToken } = useAuth();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const [checkingToken, setCheckingToken] = useState(true);

  // ============================================================
  // VALIDAR TOKEN AL MONTAR
  // ============================================================
  useEffect(() => {
    async function check() {
      if (!token) {
        setTokenValid(false);
        setCheckingToken(false);
        return;
      }

      const valid = await validateResetToken(token);
      setTokenValid(valid);
      setCheckingToken(false);
    }
    check();
  }, [token, validateResetToken]);

  // ============================================================
  // REGLAS DE CONTRASEÑA
  // ============================================================
  const rules = {
    length: password.length >= 6,
    upper: /[A-Z]/.test(password),
    number: /\d/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };
  const allRulesOk = Object.values(rules).every(Boolean);
  const matches = password && confirm && password === confirm;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!allRulesOk) {
      setError('La contraseña no cumple con los requisitos mínimos.');
      return;
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    const result = await resetPassword(token, password);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/login', { replace: true }), 2600);
    } else {
      setError(result.error);
    }
  };

  // ============================================================
  // CARGANDO VALIDACIÓN
  // ============================================================
  if (checkingToken) {
    return (
      <div className="Auth-container">
        <div className="reset-form">
          <p className="form-subtitle">Validando enlace...</p>
        </div>
      </div>
    );
  }

  // ============================================================
  // TOKEN INVÁLIDO
  // ============================================================
  if (!tokenValid) {
    return (
      <div className="Auth-container">
        <div className="reset-form anim-fade-in">
          <div className="error-state">
            <FaTimesCircle className="error-icon" />
            <h2 className="title">Enlace inválido</h2>
            <p className="form-subtitle">
              El enlace de recuperación es inválido o ya expiró.
              Solicitá uno nuevo para continuar.
            </p>
            <Link to="/forgot-password" className="btn-primary as-link">
              Solicitar nuevo enlace
            </Link>
          </div>
          <div className="LoginLink">
            <p>
              <Link to="/login"><FaArrowLeft /> Volver a iniciar sesión</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // ÉXITO
  // ============================================================
  if (success) {
    return (
      <div className="Auth-container">
        <div className="reset-form anim-fade-in">
          <div className="success-state">
            <FaCheckCircle className="success-icon" />
            <h2 className="title">¡Contraseña actualizada!</h2>
            <p className="form-subtitle">
              Tu contraseña se cambió correctamente.
              Te estamos redirigiendo al inicio de sesión…
            </p>
            <Link to="/login" className="btn-primary as-link">
              Ir a iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // FORMULARIO
  // ============================================================
  return (
    <div className="Auth-container">
      <form onSubmit={handleSubmit} className="reset-form anim-fade-up">
        <div className="form-header">
          <FaShieldAlt className="header-icon" />
          <h2 className="title">Nueva contraseña</h2>
          <p className="form-subtitle">
            Creá una contraseña segura para proteger tu cuenta.
          </p>
        </div>

        {error && <p className="error-message">{error}</p>}

        {/* Contraseña */}
        <div className="Input-group">
          <label htmlFor="Password" className="label-form">Nueva contraseña</label>
          <div className="Input-box">
            <FaLock className="Icon" />
            <input
              id="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
              minLength={6}
              className="input-form"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <FaEyeSlash className="Icon" /> : <FaEye className="Icon" />}
            </button>
          </div>
        </div>

        {/* Confirmar contraseña */}
        <div className="Input-group">
          <label htmlFor="Confirm" className="label-form">Confirmar contraseña</label>
          <div className={`Input-box ${confirm && !matches ? 'Input-box--error' : ''}`}>
            <FaLock className="Icon" />
            <input
              id="Confirm"
              type={showConfirm ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repetí la contraseña"
              required
              className="input-form"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showConfirm ? <FaEyeSlash className="Icon" /> : <FaEye className="Icon" />}
            </button>
          </div>
          {confirm && !matches && (
            <small className="field-hint field-hint--error">Las contraseñas no coinciden</small>
          )}
        </div>

        {/* Checklist */}
        <ul className="password-rules">
          <li className={rules.length ? 'ok' : ''}>
            <span className="dot" /> Mínimo 6 caracteres
          </li>
          <li className={rules.upper ? 'ok' : ''}>
            <span className="dot" /> Al menos una mayúscula
          </li>
          <li className={rules.number ? 'ok' : ''}>
            <span className="dot" /> Al menos un número
          </li>
          <li className={rules.symbol ? 'ok' : ''}>
            <span className="dot" /> Al menos un símbolo
          </li>
        </ul>

        <button
          type="submit"
          disabled={loading || !allRulesOk || !matches}
          className="btn-primary"
        >
          {loading ? 'Actualizando...' : 'Cambiar contraseña'}
        </button>

        <div className="LoginLink">
          <p>
            <Link to="/login"><FaArrowLeft /> Volver a iniciar sesión</Link>
          </p>
        </div>
      </form>
    </div>
  );
}