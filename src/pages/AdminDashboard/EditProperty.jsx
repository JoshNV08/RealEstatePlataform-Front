import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Building2, Trees, X, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firestore"; // Asegúrate de exportar db desde firestore.js
// Opcional: import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// Opcional: import { storage } from "../../services/firestore";

const typeOptions = [
  { value: "Apartamento", label: "Apartamento" },
  { value: "Casa", label: "Casa" },
  { value: "Campo", label: "Campo" },
];
const operationOptions = [
  { value: "Venta", label: "Venta" },
  { value: "Alquiler", label: "Alquiler" },
];

// Configuración de Cloudinary
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_NAME;

export default function PropertyEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Fetch property data from Firestore
  useEffect(() => {
    if (!id) return;
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "properties", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          // Asegura arrays no nulos
          const data = docSnap.data();
          setForm({
            ...data,
            images: data.images || [],
            features: data.features && Array.isArray(data.features) ? data.features : [""],
          });
        } else {
          alert("Propiedad no encontrada");
          navigate("/dashboard");
        }
      } catch (error) {
        alert("Error obteniendo la propiedad");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id, navigate]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setForm(f => ({
      ...f,
      images: [...(f.images || []), ...files]
    }));
  };

  const handleFeatureChange = (idx, value) => {
    setForm(f => {
      const features = [...f.features];
      features[idx] = value;
      return { ...f, features };
    });
  };

  const addFeature = () => setForm(f => ({ ...f, features: [...f.features, ""] }));
  const removeFeature = (idx) =>
    setForm(f => ({ ...f, features: f.features.filter((_, i) => i !== idx) }));

  const removeImage = (idx) =>
    setForm(f => ({
      ...f,
      images: f.images.filter((_, i) => i !== idx)
    }));

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Subir una imagen a Cloudinary
  const uploadImageToCloudinary = async (file) => {
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Error subiendo imagen a Cloudinary");
      }
      return data.secure_url;
    } catch (err) {
      setUploadError("Error subiendo imágenes: " + err.message);
      throw err;
    }
  };

  const uploadAllImages = async (images) => {
    // Sube solo las nuevas (Files)
    const urlUploads = await Promise.all(
      images.map(async img => {
        if (img instanceof File) {
          return await uploadImageToCloudinary(img);
        }
        return img; // ya es string (URL)
      })
    );
    return urlUploads;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadError("");
    try {
      let imageUrls = [];
      if (form.images.length) {
        imageUrls = await uploadAllImages(form.images);
      }
      // Features sin vacíos
      const featuresClean = form.features.filter(f => f && f.trim() !== "");
      const propertyToSave = {
        ...form,
        images: imageUrls,
        features: featuresClean,
      };
      // Actualizar en Firestore
      const docRef = doc(db, "properties", id);
      await updateDoc(docRef, propertyToSave);

      alert("Propiedad actualizada correctamente");
      navigate("/dashboard");
    } catch (err) {
      setUploadError("Error guardando la propiedad");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#181c2b]">
        <div className="text-yellow-100 text-xl animate-pulse">Cargando propiedad…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#181c2b] py-10 px-4 flex items-center justify-center">
      <motion.form
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl bg-[#232742]/80 border border-yellow-600/20 rounded-2xl shadow-2xl px-8 py-10"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-bold text-yellow-100 mb-8 text-center">Editar Propiedad</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {/* ...campos iguales a NewProperty */}
          {/* ...copiar los inputs uno a uno como en tu código original */}
          {/* ...todo igual, solo la lógica de submit cambia */}
          {/* ... */}
          <div>
            <label className="block text-yellow-100 mb-1 font-medium">Título</label>
            <input
              className="w-full px-4 py-3 rounded-lg border border-yellow-600/30 bg-[#181c2b] text-yellow-100 mb-2"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-yellow-100 mb-1 font-medium">Tipo</label>
            <select
              className="w-full px-4 py-3 rounded-lg border border-yellow-600/30 bg-[#181c2b] text-yellow-100 mb-2"
              name="type"
              value={form.type}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona</option>
              {typeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-yellow-100 mb-1 font-medium">Operación</label>
            <select
              className="w-full px-4 py-3 rounded-lg border border-yellow-600/30 bg-[#181c2b] text-yellow-100 mb-2"
              name="operation"
              value={form.operation}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona</option>
              {operationOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-yellow-100 mb-1 font-medium">Zona</label>
            <input
              className="w-full px-4 py-3 rounded-lg border border-yellow-600/30 bg-[#181c2b] text-yellow-100 mb-2"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-yellow-100 mb-1 font-medium">Dirección</label>
            <input
              className="w-full px-4 py-3 rounded-lg border border-yellow-600/30 bg-[#181c2b] text-yellow-100 mb-2"
              name="address"
              value={form.address}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-yellow-100 mb-1 font-medium">Precio (USD)</label>
            <input
              className="w-full px-4 py-3 rounded-lg border border-yellow-600/30 bg-[#181c2b] text-yellow-100 mb-2"
              name="price"
              value={form.price}
              type="number"
              min="0"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-yellow-100 mb-1 font-medium">Dormitorios</label>
            <input
              className="w-full px-4 py-3 rounded-lg border border-yellow-600/30 bg-[#181c2b] text-yellow-100 mb-2"
              name="bedrooms"
              value={form.bedrooms}
              type="number"
              min="0"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-yellow-100 mb-1 font-medium">Baños</label>
            <input
              className="w-full px-4 py-3 rounded-lg border border-yellow-600/30 bg-[#181c2b] text-yellow-100 mb-2"
              name="bathrooms"
              value={form.bathrooms}
              type="number"
              min="0"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-yellow-100 mb-1 font-medium">Superficie (m²)</label>
            <input
              className="w-full px-4 py-3 rounded-lg border border-yellow-600/30 bg-[#181c2b] text-yellow-100 mb-2"
              name="area"
              value={form.area}
              type="number"
              min="0"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-yellow-100 mb-1 font-medium">Piso</label>
            <input
              className="w-full px-4 py-3 rounded-lg border border-yellow-600/30 bg-[#181c2b] text-yellow-100 mb-2"
              name="floor"
              value={form.floor}
              type="number"
              min="0"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-yellow-100 mb-1 font-medium">Año</label>
            <input
              className="w-full px-4 py-3 rounded-lg border border-yellow-600/30 bg-[#181c2b] text-yellow-100 mb-2"
              name="year"
              value={form.year}
              type="number"
              min="1900"
              max="2100"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-yellow-100 mb-1 font-medium">Orientación</label>
            <input
              className="w-full px-4 py-3 rounded-lg border border-yellow-600/30 bg-[#181c2b] text-yellow-100 mb-2"
              name="orientation"
              value={form.orientation}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-yellow-100 mb-1 font-medium">Gastos comunes (si alquiler)</label>
            <input
              className="w-full px-4 py-3 rounded-lg border border-yellow-600/30 bg-[#181c2b] text-yellow-100 mb-2"
              name="expenses"
              value={form.expenses}
              type="number"
              min="0"
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="text-yellow-100 font-medium flex items-center gap-2">
              <input name="garage" type="checkbox" checked={form.garage} onChange={handleChange} className="accent-yellow-400" />
              Garaje
            </label>
            <label className="text-yellow-100 font-medium flex items-center gap-2">
              <input name="featured" type="checkbox" checked={form.featured} onChange={handleChange} className="accent-yellow-400" />
              Destacada
            </label>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-yellow-100 font-medium flex items-center gap-2">
              <input name="furnished" type="checkbox" checked={form.furnished} onChange={handleChange} className="accent-yellow-400" />
              Amueblado
            </label>
            <label className="text-yellow-100 font-medium flex items-center gap-2">
              <input name="petsAllowed" type="checkbox" checked={form.petsAllowed} onChange={handleChange} className="accent-yellow-400" />
              Acepta mascotas
            </label>
          </div>
          <div>
            <label className="block text-yellow-100 mb-1 font-medium">Máx. ocupantes</label>
            <input
              className="w-full px-4 py-3 rounded-lg border border-yellow-600/30 bg-[#181c2b] text-yellow-100 mb-2"
              name="maxTenants"
              value={form.maxTenants}
              type="number"
              min="1"
              onChange={handleChange}
            />
          </div>
        </div>
        {/* Images */}
        <div className="mt-8 mb-4">
          <label className="block text-yellow-100 mb-1 font-medium">Imágenes</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-yellow-100"
            disabled={loading}
          />
          {form.images.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-3">
              {form.images.map((img, idx) => (
                <div key={idx} className="relative w-24 h-20 group">
                  <img
                    src={img instanceof File ? URL.createObjectURL(img) : img}
                    alt={`img-${idx}`}
                    className="object-cover w-full h-full rounded-lg border border-yellow-600/20"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-[#232742] bg-opacity-80 border border-yellow-600/40 text-yellow-200 rounded-full p-1 hover:text-red-400 transition"
                    title="Eliminar imagen"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Description */}
        <div className="mb-4">
          <label className="block text-yellow-100 mb-1 font-medium">Descripción</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-yellow-600/30 bg-[#181c2b] text-yellow-100"
            rows={4}
            required
          />
        </div>
        {/* Features */}
        <div className="mb-8">
          <label className="block text-yellow-100 mb-1 font-medium">Características</label>
          <div className="flex flex-col gap-2">
            {form.features.map((feat, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={feat}
                  onChange={e => handleFeatureChange(idx, e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg border border-yellow-600/30 bg-[#181c2b] text-yellow-100"
                  placeholder={`Característica #${idx + 1}`}
                  required
                />
                {form.features.length > 1 && (
                  <button type="button" onClick={() => removeFeature(idx)} className="text-red-400 hover:text-red-600">
                    <X size={18} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addFeature}
              className="mt-2 inline-flex items-center gap-1 text-yellow-200 hover:text-yellow-100 font-semibold"
            >
              <Plus size={18} /> Agregar característica
            </button>
          </div>
        </div>
        {uploadError && <div className="text-red-400 mb-2">{uploadError}</div>}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="w-full bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-200 text-[#181c2b] font-bold py-3 rounded-lg shadow-lg hover:from-yellow-300 hover:to-yellow-100 transition-all mt-4"
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar cambios"}
        </motion.button>
      </motion.form>
    </div>
  );
}