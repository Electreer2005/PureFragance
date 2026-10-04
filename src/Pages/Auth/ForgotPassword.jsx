// src/Pages/Auth/ForgotPassword.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FaEnvelope, FaArrowLeft, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import './Auth.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await forgotPassword(email);

    setLoading(false);

    if (result.success) {
      setSent(true);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="Auth-container">
      <form onSubmit={handleSubmit} className="forgot-form anim-fade-in">
        {!sent ? (
          <>
            <h2 className="title">Recuperar contraseña</h2>

            <p className="form-subtitle">
              Ingresá tu correo y te enviaremos un enlace para restablecer tu contraseña.
            </p>

            {error && <p className="error-message">{error}</p>}

            <div className="Input-group">
              <label htmlFor="Correo" className="label-form">Correo</label>
              <div className="Input-box">
                <FaEnvelope className="Icon" />
                <input
                  id="Correo"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  autoFocus
                  className="input-form"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Enviando...' : (<><FaPaperPlane /> Enviar enlace</>)}
            </button>
          </>
        ) : (
          <div className="success-state anim-fade-up">
            <FaCheckCircle className="success-icon" />
            <h2 className="title">¡Correo enviado!</h2>
            <p className="form-subtitle">
              Si <strong>{email}</strong> está registrado, recibirás un enlace para
              restablecer tu contraseña en los próximos minutos.
            </p>
            <p className="helper-text">
              ¿No lo recibiste? Revisá tu carpeta de spam o intentá nuevamente.
            </p>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => { setSent(false); setEmail(''); }}
            >
              Reintentar
            </button>
          </div>
        )}

        <div className="LoginLink">
          <p>
            <Link to="/login"><FaArrowLeft /> Volver a iniciar sesión</Link>
          </p>
        </div>
      </form>
    </div>
  );
}