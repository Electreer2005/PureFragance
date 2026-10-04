// src/Pages/Auth/Register.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import './Auth.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
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
      <form onSubmit={handleSubmit} className="register-form anim-fade-up">
        <h2 className='title'>Crear cuenta</h2>

        {error && <p className="error-message">{error}</p>}

        <div className="Input-group">
          <label htmlFor="Nombre" className='label-form'>Nombre</label>
          <div className="Input-box">
            <FaUser className='Icon' />
            <input
              id="Nombre"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre"
              required
              className='input-form'
            />
          </div>
        </div>

        <div className="Input-group">
          <label htmlFor="Correo" className='label-form'>Correo</label>
          <div className="Input-box">
            <FaEnvelope className='Icon' />
            <input
              id="Correo"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className='input-form'
            />
          </div>
        </div>

        <div className="Input-group">
          <label htmlFor="Contraseña">Contraseña</label>
          <div className="Input-box">
            <FaLock className='Icon' />
            <input
              id="Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
              minLength={6}
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

        <button type="submit" disabled={loading} className="btn-secondary">
          {loading ? 'Creando cuenta...' : 'Registrarme'}
        </button>

        <div className="LoginLink">
          <p>
            ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
          </p>
        </div>
      </form>
    </div>
  );
}