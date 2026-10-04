// src/Components/ImageUploader/ImageUploader.jsx
import { useState, useRef } from 'react';
import { FaCloudUploadAlt, FaSpinner, FaTimes, FaLink } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { uploadImage } from '../../services/uploadService';
import './ImageUploader.css';

export default function ImageUploader({ value, onChange, label = 'Imagen' }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  // ============================================================
  // SUBIR ARCHIVO
  // ============================================================
  const handleFile = async (file) => {
    // Validar tipo
    if (!file.type.startsWith('image/')) {
      toast.error('Solo se permiten imágenes');
      return;
    }

    // Validar tamaño (5 MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no puede pesar más de 5 MB');
      return;
    }

    setUploading(true);

    try {
      const result = await uploadImage(file);
      onChange(result.url); // 👈 devuelve la URL al formulario
      toast.success('Imagen subida correctamente');
    } catch (error) {
      console.error('Error al subir imagen:', error);
      toast.error(
        error.response?.data?.message || 'Error al subir la imagen'
      );
    } finally {
      setUploading(false);
    }
  };

  // ============================================================
  // HANDLERS
  // ============================================================
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="ImageUploader">
      <label className="ImageUploader-label">{label}</label>

      {/* Si ya hay imagen */}
      {value && !uploading ? (
        <div className="ImageUploader-preview">
          <img src={value} alt="Preview" />
          <div className="ImageUploader-previewActions">
            <button
              type="button"
              className="ImageUploader-actionBtn change"
              onClick={() => inputRef.current?.click()}
              title="Cambiar imagen"
            >
              <FaCloudUploadAlt />
            </button>
            <button
              type="button"
              className="ImageUploader-actionBtn remove"
              onClick={handleRemove}
              title="Quitar imagen"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      ) : (
        /* Zona de drop */
        <div
          className={`ImageUploader-dropzone ${dragOver ? 'is-dragOver' : ''} ${uploading ? 'is-uploading' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !uploading && inputRef.current?.click()}
        >
          {uploading ? (
            <>
              <FaSpinner className="ImageUploader-spinner" />
              <p>Subiendo imagen...</p>
            </>
          ) : (
            <>
              <FaCloudUploadAlt className="ImageUploader-icon" />
              <p className="ImageUploader-text">
                <strong>Hacé click</strong> o arrastrá una imagen acá
              </p>
              <p className="ImageUploader-hint">
                JPG, PNG, WebP — máximo 5 MB
              </p>
            </>
          )}
        </div>
      )}

      {/* Input oculto */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        style={{ display: 'none' }}
      />

      {/* Alternativa: pegar URL */}
      <div className="ImageUploader-or">
        <span>o</span>
      </div>

      <div className="ImageUploader-url">
        <FaLink />
        <input
          type="url"
          placeholder="Pegá una URL de imagen"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
