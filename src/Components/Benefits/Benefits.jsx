// src/Components/Benefits/Benefits.jsx
import { FaTruck, FaGift, FaShieldAlt, FaHeadset } from 'react-icons/fa';
import './Benefits.css';

const BENEFITS = [
  {
    icon: <FaTruck />,
    title: 'Envío gratis',
    text: 'En compras superiores a $30.000',
  },
  {
    icon: <FaGift />,
    title: 'Muestra de regalo',
    text: 'Con cada compra recibís una muestra',
  },
  {
    icon: <FaShieldAlt />,
    title: 'Compra segura',
    text: 'Pagos 100% protegidos',
  },
  {
    icon: <FaHeadset />,
    title: 'Atención personalizada',
    text: 'Lun a Vie de 9 a 18hs',
  },
];

export default function Benefits() {
  return (
    <section className="Benefits">
      <div className="Benefits-grid">
        {BENEFITS.map((b, i) => (
          <div className="Benefit" key={i}>
            <div className="Benefit-icon">{b.icon}</div>
            <h3 className="Benefit-title">{b.title}</h3>
            <p className="Benefit-text">{b.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
