// src/Pages/Contact/Contact.jsx
import { useState } from 'react';
import {
  FaEnvelope,
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUser,
  FaTag,
} from 'react-icons/fa';
// src/Pages/Contact/Contact.jsx
import api from '../../services/api';
import { CONTACT_EMAIL } from '../../config/contact';
import toast from 'react-hot-toast';
import './Contact.css';

const CONTACT_INFO = [{ icon: <FaEnvelope />, label: 'Email', value: CONTACT_EMAIL, link: `mailto:${CONTACT_EMAIL}` }];

const SUBJECTS = [
  'Consulta general',
  'Estado de mi pedido',
  'Devoluciones',
  'Mayoristas',
  'Otro',
];

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: SUBJECTS[0],
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = 'Ingresá tu nombre';
    if (!form.email.trim()) newErrors.email = 'Ingresá tu email';
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = 'Email inválido';
    if (!form.message.trim()) newErrors.message = 'Escribí tu mensaje';
    else if (form.message.trim().length < 10)
      newErrors.message = 'Mínimo 10 caracteres';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Revisá los campos marcados');
      return;
    }

    if (sending) return;
    setSending(true);
    setSubmitError('');
    try {
      await api.post('/contact', form, { timeout: 25000 });
      setSent(true);
      setForm({ name: '', email: '', subject: SUBJECTS[0], message: '' });
    } catch (error) {
      setSubmitError(error.response?.status === 429
        ? 'Llegaste al límite de consultas. Probá más tarde o escribinos por email.'
        : 'No pudimos enviar tu consulta. Intentá nuevamente o escribinos por email.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="Contact">
      {/* ============================================================
          HERO
          ============================================================ */}
      <section className="Contact-hero">
        <span className="Contact-eyebrow">Estamos para ayudarte</span>
        <h1 className="Contact-title">
          Hablemos de <span className="text-gold">perfumes</span>
        </h1>
        <p className="Contact-subtitle">
          ¿Tenés una duda sobre una fragancia o tu pedido? Escribinos desde
          este formulario o por email.
        </p>
      </section>

      {/* ============================================================
          LAYOUT
          ============================================================ */}
      <div className="Contact-layout">
        {/* ========== INFO DE CONTACTO ========== */}
        <aside className="Contact-info">
          <h2 className="Contact-infoTitle">Información de contacto</h2>

          <ul className="Contact-infoList">
            {CONTACT_INFO.map((item) => (
              <li key={item.label} className="Contact-infoItem">
                <div className="Contact-infoIcon">{item.icon}</div>
                <div>
                  <span className="Contact-infoLabel">{item.label}</span>
                  {item.link ? (
                    <a href={item.link} className="Contact-infoValue">
                      {item.value}
                    </a>
                  ) : (
                    <span className="Contact-infoValue">{item.value}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>


        </aside>

        {/* ========== FORMULARIO ========== */}
        <form className="Contact-form" onSubmit={handleSubmit} noValidate aria-busy={sending}>
          {sent ? (
            <div className="Contact-success" role="status">
              <div className="Contact-successIcon">
                <FaCheckCircle />
              </div>
              <h2>¡Recibimos tu consulta!</h2>
              <p>
                Tu consulta fue enviada a PureFragance. Te responderemos al
                email que nos dejaste.
              </p>
              <button type="button" className="btn-secondary" onClick={() => setSent(false)}>Enviar otra consulta</button>
            </div>
          ) : (
            <>
              <h2 className="Contact-formTitle">Envianos un mensaje</h2>
              {submitError && <p className="Contact-errorMsg" role="alert">{submitError}</p>}

              <div className="Contact-row">
                <div className={`Contact-input ${errors.name ? 'has-error' : ''}`}>
                  <label htmlFor="name">Nombre</label>
                  <div className="Contact-inputBox">
                    <FaUser />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      maxLength={100}
                      aria-invalid={Boolean(errors.name)}
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Tu nombre"
                    />
                  </div>
                  {errors.name && (
                    <span className="Contact-errorMsg">{errors.name}</span>
                  )}
                </div>

                <div
                  className={`Contact-input ${errors.email ? 'has-error' : ''}`}
                >
                  <label htmlFor="email">Email</label>
                  <div className="Contact-inputBox">
                    <FaEnvelope />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      maxLength={254}
                      aria-invalid={Boolean(errors.email)}
                      value={form.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                    />
                  </div>
                  {errors.email && (
                    <span className="Contact-errorMsg">{errors.email}</span>
                  )}
                </div>
              </div>

              <div className="Contact-input">
                <label htmlFor="subject">Asunto</label>
                <div className="Contact-inputBox">
                  <FaTag />
                  <select
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div
                className={`Contact-input ${errors.message ? 'has-error' : ''}`}
              >
                <label htmlFor="message">Mensaje</label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Contanos en qué podemos ayudarte..."
                  rows={6}
                  maxLength={5000}
                  aria-invalid={Boolean(errors.message)}
                />
                {errors.message && (
                  <span className="Contact-errorMsg">{errors.message}</span>
                )}
              </div>

              <button
                type="submit"
                className="btn-primary Contact-submit"
                disabled={sending}
              >
                {sending ? (
                  'Enviando...'
                ) : (
                  <>
                    <FaPaperPlane /> Enviar mensaje
                  </>
                )}
              </button>

              <p className="Contact-note">
                <FaExclamationTriangle />
                Usamos tus datos para responder esta consulta.
              </p>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
