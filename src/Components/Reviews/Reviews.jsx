import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import './Reviews.css';
export default function Reviews({ productId, onSummary }) {
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState({ reviews: [], rating: 0, count: 0 });
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => { if (active) { setLoading(true); setError(''); } });
    api.get(`/products/${productId}/reviews`, { params: { page } }).then(({ data }) => {
      if (active) { setData(data); onSummary?.({ productId, rating: data.rating, count: data.count }); }
    }).catch(e => { if (active) setError(e.response?.data?.message || 'No se pudieron cargar las reseñas'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [productId, page, refresh, onSummary]);
  async function submit(e) {
    e.preventDefault(); setSaving(true); setError(''); setMessage('');
    try { await api.put(`/products/${productId}/reviews`, { rating, comment });
      setComment(''); setPage(1); setRefresh(v => v + 1); setMessage('Tu reseña fue guardada.');
    } catch (e) { setError(e.response?.data?.message || 'No se pudo guardar la reseña'); }
    finally { setSaving(false); }
  }
  return <section className="Reviews" aria-labelledby="reviews-title">
    <h2 id="reviews-title">Opiniones de clientes</h2>
    <p><FaStar aria-hidden="true" /> {data.rating.toFixed(1)} / 5 · {data.count} reseñas de compras verificadas</p>
    {loading ? <p>Cargando opiniones…</p> : data.reviews.length ? data.reviews.map((r, index) => <article key={`${r.createdAt}-${index}`}>
      <strong>{r.name}</strong><span aria-label={`${r.rating} de 5 estrellas`}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span>
      <small>{new Date(r.createdAt).toLocaleDateString('es-AR')} · Compra verificada</small><p>{r.comment}</p>
    </article>) : <p>Todavía no hay opiniones. Compartí tu experiencia después de comprar.</p>}
    {data.count > 20 && <div className="Reviews-pages"><button disabled={page === 1 || loading} onClick={() => setPage(p => p-1)}>Anterior</button><span>Página {page}</span><button disabled={page*20 >= data.count || loading} onClick={() => setPage(p => p+1)}>Siguiente</button></div>}
    {error && <p role="alert">{error}</p>}{message && <p role="status">{message}</p>}
    {isAuthenticated ? <form onSubmit={submit}>
      <h3>Tu experiencia</h3><p>Necesitás una compra pagada de este producto. Si ya opinaste, se actualizará tu reseña.</p>
      <label>Puntuación<select value={rating} onChange={e => setRating(Number(e.target.value))}>{[5,4,3,2,1].map(v => <option key={v} value={v}>{v} estrellas</option>)}</select></label>
      <label>Comentario<textarea value={comment} onChange={e => setComment(e.target.value)} minLength={10} maxLength={1000} required rows={4} placeholder="¿Qué te pareció la fragancia?" /></label>
      <button className="btn-primary" disabled={saving}>{saving ? 'Guardando…' : 'Publicar reseña'}</button>
    </form> : <p><Link to="/login">Iniciá sesión</Link> para escribir una reseña de tu compra.</p>}
  </section>;
}
