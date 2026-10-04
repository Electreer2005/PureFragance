// src/Components/EmptyState/EmptyState.jsx
import { FaSearch } from 'react-icons/fa';
import './EmptyState.css';

export default function EmptyState({ title, message, actionLabel, onAction }) {
  return (
    <div className="EmptyState">
      <div className="EmptyState-icon">
        <FaSearch />
      </div>
      <h3 className="EmptyState-title">{title}</h3>
      <p className="EmptyState-message">{message}</p>
      {actionLabel && onAction && (
        <button className="btn-secondary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
