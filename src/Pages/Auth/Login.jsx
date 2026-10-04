// src/Pages/Auth/Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import './Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // src/Pages/Auth/Login.jsx
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);

    setLoading(false);

    if (result.success) {
      navigate('/home', { replace: true });
    }
    // 👈 Ya no hace falta setError, el toast del contexto se encarga
  };

  return (
    <div className="Auth-container">
      <form onSubmit={handleSubmit} className="login-form anim-fade-in">
        <h2 className='title'>Iniciar sesión</h2>

        {error && <p className="error-message">{error}</p>}

        <div className="Input-group">
          <label className='label-form'>Correo</label>
          <div className="Input-box">
            <FaEnvelope className='Icon' />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className='input-form'
            />
          </div>
        </div>

        <div className="Input-group">
          <label className='label-form'>Contraseña</label>
          <div className="Input-box">
            <FaLock className='Icon' />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
              className='input-form'
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <FaEyeSlash className='Icon' /> : <FaEye className='Icon' />}
            </button>
          </div>
        </div>

        <div className="Forgot-Password">
          <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>

        <div className="RegisterLink">
          <p>
            ¿No tenés cuenta? <Link to="/register">Registrate</Link>
          </p>
        </div>
      </form>
    </div>
  );
}