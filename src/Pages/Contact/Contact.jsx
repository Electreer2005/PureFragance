// src/Pages/Contact/Contact.jsx
import { useState } from 'react';
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaClock,
  FaInstagram,
  FaTwitter,
  FaFacebookF,
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUser,
  FaTag,
} from 'react-icons/fa';
// src/Pages/Contact/Contact.jsx
import { toasts } from '../../utils/toast';
import toast from 'react-hot-toast';
import './Contact.css';

const CONTACT_INFO = [
  {
    icon: <FaEnvelope />,
    label: 'Email',
    value: 'hola@perfumes.com',
    link: 'mailto:hola@perfumes.com',
  },
  {
    icon: <FaPhoneAlt />,
    label: 'Teléfono',
    value: '+54 11 1234-5678',
    link: 'tel:+541112345678',
  },
  {
    icon: <FaMapMarkerAlt />,
    label: 'Dirección',
    value: 'Av. Corrientes 1234, CABA',
    link: null,
  },
  {
    icon: <FaClock />,
    label: 'Horarios',
    value: 'Lun a Vie, 9 a 18hs',
    link: null,
  },
];

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

    setSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setSent(true);
    setForm({ name: '', email: '', subject: SUBJECTS[0], message: '' });
    toasts.messageSent();
    setTimeout(() => setSent(false), 5000);
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
          ¿Tenés una duda, sugerencia o consulta? Nuestro equipo te responde
          dentro de las 24hs hábiles.
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

          <div className="Contact-social">
            <h3 className="Contact-socialTitle">Seguinos</h3>
            <div className="Contact-socialLinks">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
            </div>
          </div>
        </aside>

        {/* ========== FORMULARIO ========== */}
        <form className="Contact-form" onSubmit={handleSubmit}>
          {sent ? (
            <div className="Contact-success">
              <div className="Contact-successIcon">
                <FaCheckCircle />
              </div>
              <h2>¡Mensaje enviado!</h2>
              <p>
                Gracias por escribirnos. Te vamos a responder a la brevedad al
                email que nos dejaste.
              </p>
            </div>
          ) : (
            <>
              <h2 className="Contact-formTitle">Envianos un mensaje</h2>

              <div className="Contact-row">
                <div className={`Contact-input ${errors.name ? 'has-error' : ''}`}>
                  <label htmlFor="name">Nombre</label>
                  <div className="Contact-inputBox">
                    <FaUser />
                    <input
                      id="name"
                      name="name"
                      type="text"
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
                Te respondemos en 24hs hábiles.
              </p>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
