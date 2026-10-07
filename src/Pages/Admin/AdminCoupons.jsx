import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { formatPrice } from '../../services/productsService';
import './AdminCoupons.css';
const initial = { code: '', type: 'percent', value: 10, minSubtotal: 0, startsAt: '', expiresAt: '' };
export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function load() {
    try { const { data } = await api.get('/coupons'); setCoupons(data.coupons); setError(''); }
    catch (e) { setError(e.response?.data?.message || 'No se pudieron cargar los cupones'); }
  }
  useEffect(() => {
    let active = true;
    api.get('/coupons').then(({ data }) => { if (active) setCoupons(data.coupons); })
      .catch(e => { if (active) setError(e.response?.data?.message || 'No se pudieron cargar los cupones'); });
    return () => { active = false; };
  }, []);
  async function submit(e) {
    e.preventDefault(); setBusy(true);
    try {
      await api.post('/coupons', { ...form, value: Number(form.value), minSubtotal: Number(form.minSubtotal),
        startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : null,
        expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null });
      setForm(initial); toast.success('Cupón creado'); await load();
    } catch (e) { toast.error(e.response?.data?.message || 'No se pudo crear el cupón'); }
    finally { setBusy(false); }
  }
  async function toggle(coupon) {
    setBusy(true);
    try { await api.patch(`/coupons/${coupon._id}`, { active: !coupon.active }); await load(); }
    catch (e) { toast.error(e.response?.data?.message || 'No se pudo actualizar'); }
    finally { setBusy(false); }
  }
  const field = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  return <section className="AdminCoupons">
    <h1>Cupones de <span className="text-gold">descuento</span></h1>
    <p>Creá códigos para el checkout. Se aplican sobre productos, después del descuento por transferencia.</p>
    <form onSubmit={submit} className="AdminCoupons-form">
      <label>Código<input name="code" value={form.code} onChange={field} required minLength={3} maxLength={30} pattern="[A-Za-z0-9_-]+" placeholder="BIENVENIDA10" /></label>
      <label>Tipo<select name="type" value={form.type} onChange={field}><option value="percent">Porcentaje</option><option value="fixed">Importe en pesos</option></select></label>
      <label>Descuento<input type="number" name="value" value={form.value} onChange={field} min="0.01" max={form.type === 'percent' ? 100 : undefined} step="0.01" required /></label>
      <label>Compra mínima<input type="number" name="minSubtotal" value={form.minSubtotal} onChange={field} min="0" step="0.01" required /></label>
      <label>Desde (opcional)<input type="datetime-local" name="startsAt" value={form.startsAt} onChange={field} /></label>
      <label>Hasta (opcional)<input type="datetime-local" name="expiresAt" value={form.expiresAt} onChange={field} /></label>
      <button className="btn-primary" disabled={busy}>{busy ? 'Guardando…' : 'Crear cupón'}</button>
    </form>
    {error && <p role="alert">{error} <button onClick={load}>Reintentar</button></p>}
    <div className="AdminCoupons-list">{coupons.length === 0 && !error && <p>Todavía no hay cupones.</p>}
      {coupons.map(c => <article key={c._id}>
        <strong>{c.code}</strong><span>{c.type === 'percent' ? `${c.value}%` : formatPrice(c.value)} · mínimo {formatPrice(c.minSubtotal)}</span>
        <span>{c.active ? 'Activo' : 'Desactivado'}{c.expiresAt && ` · vence ${new Date(c.expiresAt).toLocaleString('es-AR')}`}</span>
        <button className="btn-secondary" disabled={busy} onClick={() => toggle(c)}>{c.active ? 'Desactivar' : 'Activar'}</button>
      </article>)}
    </div>
  </section>;
}
