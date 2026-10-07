// src/Components/Loading/Loading.jsx
import './Loading.css';

export default function Loading({ message = 'Cargando', inline = false }) {
  return (
    <div className={`Loading-container${inline ? ' Loading-container--inline' : ''}`} role="status" aria-live="polite">
      <div className="Loading-content">
        <div className="Loading-logo">
          <div className="Loading-ring"></div>
          <div className="Loading-ring Loading-ring--2"></div>
          <div className="Loading-ring Loading-ring--3"></div>
          <span className="Loading-letter">PF</span>
        </div>

        <p className="Loading-text">
          {message}
          <span className="Loading-dots" aria-hidden="true">
            <span>.</span><span>.</span><span>.</span>
          </span>
        </p>
      </div>
    </div>
  );
}
