// src/Pages/Admin/AdminProductForm.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaArrowLeft,
  FaSave,
  FaPlus,
  FaTrash,
  FaCheckCircle,
  FaExclamationTriangle,
} from 'react-icons/fa';
import {
  createProduct,
  updateProduct,
} from '../../services/adminService';
import { fetchProductById } from '../../services/productsService';
import { toasts } from '../../utils/toast';
import toast from 'react-hot-toast';
import ImageUploader from '../../Components/ImageUploader/ImageUploader';
import './AdminProductForm.css';

// ============================================================
// ESTADO INICIAL DEL FORMULARIO
// ============================================================
const EMPTY_PRODUCT = {
  name: '',
  brand: '',
  price: 0,
  originalPrice: '',
  category: 'unisex',
  image: '',
  images: [],
  rating: 0,
  reviewsCount: 0,
  description: '',
  notes: { top: [], heart: [], base: [] },
  sizes: [{ ml: 50, price: 0 }],
  isNew: false,
  isSale: false,
  stock: 100,
};

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [product, setProduct] = useState(EMPTY_PRODUCT);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [errors, setErrors] = useState({});

  // ============================================================
  // SI ES EDICIÓN, CARGAR EL PRODUCTO
  // ============================================================
  useEffect(() => {
    if (!isEditing) return;

    async function load() {
      try {
        const data = await fetchProductById(id);
        setProduct({
          ...EMPTY_PRODUCT,
          ...data,
          originalPrice: data.originalPrice || '',
          images: data.images || [],
          notes: data.notes || { top: [], heart: [], base: [] },
          sizes: data.sizes?.length ? data.sizes : [{ ml: 50, price: 0 }],
        });
      } catch (err) {
        console.error('Error cargando producto:', err);
        setFeedback({ type: 'error', message: 'No se pudo cargar el producto' });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, isEditing]);

  // ============================================================
  // HELPERS
  // ============================================================
  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleNumber = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value === '' ? '' : Number(value),
    }));
  };

  // ============================================================
  // SIZES
  // ============================================================
  const addSize = () => {
    setProduct((prev) => ({
      ...prev,
      sizes: [...prev.sizes, { ml: 100, price: 0 }],
    }));
  };

  const removeSize = (index) => {
    setProduct((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index),
    }));
  };

  const updateSize = (index, field, value) => {
    setProduct((prev) => ({
      ...prev,
      sizes: prev.sizes.map((s, i) =>
        i === index ? { ...s, [field]: Number(value) || 0 } : s
      ),
    }));
  };

  // ============================================================
  // IMÁGENES
  // ============================================================
  const addImage = () => {
    setProduct((prev) => ({
      ...prev,
      images: [...prev.images, ''],
    }));
  };

  const removeImage = (index) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const updateImage = (index, value) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => (i === index ? value : img)),
    }));
  };

  // ============================================================
  // NOTAS OLFATIVAS
  // ============================================================
  const updateNotes = (level, value) => {
    setProduct((prev) => ({
      ...prev,
      notes: {
        ...prev.notes,
        [level]: value.split(',').map((s) => s.trim()).filter(Boolean),
      },
    }));
  };

  // ============================================================
  // VALIDACIÓN
  // ============================================================
  const validate = () => {
    const newErrors = {};

    if (!product.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!product.brand.trim()) newErrors.brand = 'La marca es obligatoria';
    if (!product.description.trim())
      newErrors.description = 'La descripción es obligatoria';
    if (!product.image.trim())
      newErrors.image = 'La imagen principal es obligatoria';
    if (!product.sizes.length)
      newErrors.sizes = 'Agregá al menos un tamaño';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============================================================
  // SUBMIT
  // ============================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Revisá los campos marcados');
      return;
    }

    setSaving(true);

    try {
      // ========================================================
      // ARMAR PAYLOAD CON LOS DATOS DEL FORMULARIO
      // ========================================================
      const payload = {
        name: product.name.trim(),
        brand: product.brand.trim(),
        description: product.description.trim(),
        price: Number(product.price) || 0,
        originalPrice: product.originalPrice
          ? Number(product.originalPrice)
          : undefined,
        category: product.category,
        image: product.image.trim(),
        images: product.images.filter(Boolean), // descarta strings vacíos
        notes: {
          top: product.notes.top.filter(Boolean),
          heart: product.notes.heart.filter(Boolean),
          base: product.notes.base.filter(Boolean),
        },
        sizes: product.sizes.map((s) => ({
          ml: Number(s.ml) || 0,
          price: Number(s.price) || 0,
        })),
        stock: Number(product.stock) || 0,
        isNew: product.isNew,
        isSale: product.isSale,
      };

      // Eliminar campos undefined o vacíos para no pisar con basura
      Object.keys(payload).forEach((key) => {
        if (payload[key] === undefined || payload[key] === '') {
          delete payload[key];
        }
      });

      // 👇 Para debug — borralo cuando confirmes que funciona
      console.log('PAYLOAD A ENVIAR:', payload);

      if (isEditing) {
        await updateProduct(id, payload);
        toasts.productUpdated();
      } else {
        const created = await createProduct(payload);
        toasts.productCreated();
        setTimeout(() => {
          navigate(`/admin/productos/${created._id}/editar`, { replace: true });
        }, 800);
        return;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // LOADING
  // ============================================================
  if (loading) {
    return (
      <div className="AdminProductForm">
        <div className="AdminProductForm-loading">Cargando producto...</div>
      </div>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="AdminProductForm">
      {/* HEADER */}
      <button
        className="AdminProductForm-back"
        onClick={() => navigate('/admin/productos')}
      >
        <FaArrowLeft /> Volver a productos
      </button>

      <div className="AdminProductForm-header">
        <h1 className="AdminProductForm-title">
          {isEditing ? 'Editar' : 'Nuevo'}{' '}
          <span className="text-gold">producto</span>
        </h1>
        <p className="AdminProductForm-subtitle">
          {isEditing
            ? 'Modificá los datos del producto'
            : 'Completá los datos para agregar un producto nuevo'}
        </p>
      </div>

      {/* FEEDBACK */}
      {feedback && (
        <div className={`AdminProductForm-feedback ${feedback.type}`}>
          {feedback.type === 'success' ? (
            <FaCheckCircle />
          ) : (
            <FaExclamationTriangle />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} className="AdminProductForm-form">
        {/* ========== INFO BÁSICA ========== */}
        <section className="AdminProductForm-section">
          <h2 className="AdminProductForm-sectionTitle">Información básica</h2>

          <div className="AdminProductForm-row">
            <div className={`AdminProductForm-field ${errors.name ? 'has-error' : ''}`}>
              <label>Nombre *</label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                placeholder="Noir Absolu"
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>

            <div className={`AdminProductForm-field ${errors.brand ? 'has-error' : ''}`}>
              <label>Marca *</label>
              <input
                type="text"
                name="brand"
                value={product.brand}
                onChange={handleChange}
                placeholder="Maison Luxe"
              />
              {errors.brand && <span className="error">{errors.brand}</span>}
            </div>
          </div>

          <div className="AdminProductForm-row">
            <div className="AdminProductForm-field">
              <label>Categoría *</label>
              <select
                name="category"
                value={product.category}
                onChange={handleChange}
              >
                <option value="hombre">Hombre</option>
                <option value="mujer">Mujer</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>

            <div className="AdminProductForm-field">
              <label>Stock</label>
              <input
                type="number"
                name="stock"
                min="0"
                value={product.stock}
                onChange={handleNumber}
              />
            </div>
          </div>

          <div className={`AdminProductForm-field ${errors.description ? 'has-error' : ''}`}>
            <label>Descripción *</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              rows={4}
              placeholder="Una fragancia intensa y magnética..."
            />
            {errors.description && (
              <span className="error">{errors.description}</span>
            )}
          </div>
        </section>

        {/* ========== PRECIOS Y TAMAÑOS ========== */}
        <section className="AdminProductForm-section">
          <h2 className="AdminProductForm-sectionTitle">Precios y tamaños</h2>

          <div className="AdminProductForm-row">
            <div className="AdminProductForm-field">
              <label>Precio base *</label>
              <input
                type="number"
                name="price"
                min="0"
                value={product.price}
                onChange={handleNumber}
              />
            </div>

            <div className="AdminProductForm-field">
              <label>Precio original (opcional)</label>
              <input
                type="number"
                name="originalPrice"
                min="0"
                value={product.originalPrice}
                onChange={handleNumber}
                placeholder="Para mostrar tachado"
              />
            </div>
          </div>

          <div className="AdminProductForm-sizes">
            <div className="AdminProductForm-sizesHeader">
              <label>Tamaños *</label>
              <button
                type="button"
                className="AdminProductForm-addSize"
                onClick={addSize}
              >
                <FaPlus /> Agregar tamaño
              </button>
            </div>

            {product.sizes.map((size, index) => (
              <div key={index} className="AdminProductForm-sizeRow">
                <div className="AdminProductForm-field">
                  <label>ml</label>
                  <input
                    type="number"
                    value={size.ml}
                    onChange={(e) => updateSize(index, 'ml', e.target.value)}
                  />
                </div>
                <div className="AdminProductForm-field">
                  <label>Precio</label>
                  <input
                    type="number"
                    value={size.price}
                    onChange={(e) => updateSize(index, 'price', e.target.value)}
                  />
                </div>
                {product.sizes.length > 1 && (
                  <button
                    type="button"
                    className="AdminProductForm-removeSize"
                    onClick={() => removeSize(index)}
                    title="Quitar"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
            {errors.sizes && <span className="error">{errors.sizes}</span>}
          </div>
        </section>

        {/* ========== IMÁGENES ========== */}
        <section className="AdminProductForm-section">
          <h2 className="AdminProductForm-sectionTitle">Imágenes</h2>

          {/* 👇 Imagen principal con uploader */}
          <ImageUploader
            label="Imagen principal *"
            value={product.image}
            onChange={(url) => setProduct((prev) => ({ ...prev, image: url }))}
          />

          {errors.image && <span className="error">{errors.image}</span>}

          {/* Imágenes adicionales */}
          <div className="AdminProductForm-images">
            <div className="AdminProductForm-sizesHeader">
              <label>Imágenes adicionales (opcional)</label>
              <button
                type="button"
                className="AdminProductForm-addSize"
                onClick={addImage}
              >
                <FaPlus /> Agregar imagen
              </button>
            </div>

            {product.images.map((img, index) => (
              <div key={index} className="AdminProductForm-imageRow">
                <ImageUploader
                  label={`Imagen ${index + 2}`}
                  value={img}
                  onChange={(url) => updateImage(index, url)}
                />
                <button
                  type="button"
                  className="AdminProductForm-removeSize"
                  onClick={() => removeImage(index)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ========== NOTAS OLFATIVAS ========== */}
        <section className="AdminProductForm-section">
          <h2 className="AdminProductForm-sectionTitle">
            Pirámide olfativa
          </h2>

          <div className="AdminProductForm-field">
            <label>Notas de salida (separadas por coma)</label>
            <input
              type="text"
              value={product.notes.top.join(', ')}
              onChange={(e) => updateNotes('top', e.target.value)}
              placeholder="Bergamota, Pimienta negra"
            />
          </div>

          <div className="AdminProductForm-field">
            <label>Notas de corazón (separadas por coma)</label>
            <input
              type="text"
              value={product.notes.heart.join(', ')}
              onChange={(e) => updateNotes('heart', e.target.value)}
              placeholder="Cuero, Cardamomo"
            />
          </div>

          <div className="AdminProductForm-field">
            <label>Notas de fondo (separadas por coma)</label>
            <input
              type="text"
              value={product.notes.base.join(', ')}
              onChange={(e) => updateNotes('base', e.target.value)}
              placeholder="Cedro, Ámbar, Vetiver"
            />
          </div>
        </section>

        {/* ========== ETIQUETAS ========== */}
        <section className="AdminProductForm-section">
          <h2 className="AdminProductForm-sectionTitle">Etiquetas</h2>

          <div className="AdminProductForm-checkboxes">
            <label className="AdminProductForm-checkbox">
              <input
                type="checkbox"
                name="isNew"
                checked={product.isNew}
                onChange={handleChange}
              />
              <span className="AdminProductForm-switch" />
              <span>Marcar como "Nuevo"</span>
            </label>

            <label className="AdminProductForm-checkbox">
              <input
                type="checkbox"
                name="isSale"
                checked={product.isSale}
                onChange={handleChange}
              />
              <span className="AdminProductForm-switch" />
              <span>Marcar como "En oferta"</span>
            </label>
          </div>
        </section>

        {/* ========== ACCIONES ========== */}
        <div className="AdminProductForm-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/admin/productos')}
            disabled={saving}
          >
            Cancelar
          </button>
          <button type="submit" className="btn-primary" disabled={saving}>
            <FaSave /> {saving ? 'Guardando...' : 'Guardar producto'}
          </button>
        </div>
      </form>
    </div>
  );
}