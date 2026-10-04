// src/Components/CategoryCard/CategoryCard.jsx
import { FaArrowRight } from 'react-icons/fa';
import './CategoryCard.css';

export default function CategoryCard({ category, onClick }) {
  return (
    <article
      className="CategoryCard anim-fade-in"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      <div className="CategoryCard-image">
        <img src={category.image} alt={category.name} loading="lazy" />
        <div className="CategoryCard-overlay" />
      </div>

      <div className="CategoryCard-content">
        <h3 className="CategoryCard-title">{category.name}</h3>
        <p className="CategoryCard-description">{category.description}</p>
        <span className="CategoryCard-cta">
          Explorar <FaArrowRight />
        </span>
      </div>
    </article>
  );
}
