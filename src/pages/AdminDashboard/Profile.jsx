import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, Eye, EyeOff, Save } from "lucide-react";
import { getDoc, doc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../../services/firestore"; 

// Cloudinary config (usa las variables de entorno)
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_NAME;

const updateProfile = async (uid, profileData) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, profileData);
};

const createProfile = async (uid, profileData) => {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, profileData);
};

const getProfile = async (uid) => {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  return snap.exists() ? snap.data() : null;
};

// Sube una imagen a Cloudinary y retorna la URL
const uploadImageToCloudinary = async (file) => {
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || "Error subiendo imagen a Cloudinary");
  }
  return data.secure_url;
};

export default function Profile({ currentUser }) {
  const [profile, setProfile] = useState({
    photoURL: "",
    displayName: "",
    numberPhone: "",
    email: "",
    password: "",
    showPassword: false,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    if (!currentUser?.uid) return;
    setLoading(true);
    getProfile(currentUser.uid)
      .then((data) => {
        if (data) {
          setProfile((p) => ({
            ...p,
            photoURL: data.photoURL || "",
            displayName: data.displayName || "",
            numberPhone: data.numberPhone || "",
            email: data.email || "",
            password: "",
            showPassword: false,
          }));
          setPreview(data.photoURL || null);
          setIsNew(false);
        } else {
          setProfile((p) => ({
            ...p,
            email: currentUser.email || "",
          }));
          setPreview(null);
          setIsNew(true);
        }
      })
      .catch(() => setErrorMsg("Error al cargar perfil"))
      .finally(() => setLoading(false));
  }, [currentUser]);

  // Manejador de cambio de imagen
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile((p) => ({ ...p, photoURL: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  // Cambio de campos
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Guardar cambios
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    setLoading(true);

    try {
      let photoURL = profile.photoURL;
      // Solo subir si es File (nuevo), si es string es la URL existente
      if (photoURL && photoURL instanceof File) {
        photoURL = await uploadImageToCloudinary(photoURL);
      }

      const profileData = {
        displayName: profile.displayName,
        numberPhone: profile.numberPhone,
        email: profile.email,
        photoURL,
      };

      if (isNew) {
        await createProfile(currentUser.uid, profileData);
        setSuccessMsg("Perfil creado correctamente.");
        setIsNew(false);
      } else {
        await updateProfile(currentUser.uid, profileData);
        setSuccessMsg("Perfil actualizado correctamente.");
      }
    } catch (err) {
      setErrorMsg("Error al guardar el perfil: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#181c2b] flex items-center justify-center py-10 px-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-[#232742]/80 border border-yellow-600/20 rounded-2xl shadow-2xl px-8 py-10"
      >
        <h1 className="text-3xl font-bold text-yellow-100 mb-8 text-center">Mi Perfil</h1>
        {/* Foto */}
        <div className="flex flex-col items-center mb-8">
          <label className="relative cursor-pointer group">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
              disabled={loading}
            />
            <div className="rounded-full w-28 h-28 bg-yellow-200/10 border-2 border-yellow-400/60 flex items-center justify-center overflow-hidden shadow-lg">
              {preview ? (
                <img src={preview} className="object-cover w-full h-full" alt="Foto de perfil" />
              ) : (
                <Camera size={40} className="text-yellow-300" />
              )}
            </div>
            <span className="absolute bottom-1 right-2 bg-yellow-400 text-[#181c2b] rounded-full p-1 shadow-lg opacity-90 group-hover:opacity-100 transition">
              <Camera size={18} />
            </span>
          </label>
          <span className="text-yellow-300 mt-2 text-sm">Cambiar foto</span>
        </div>

        <div className="mb-5">
          <label className="block text-yellow-100 mb-1 font-medium">Nombre</label>
          <input
            className="w-full px-4 py-3 rounded-lg border border-yellow-600/30 bg-[#181c2b] text-yellow-100"
            name="displayName"
            value={profile.displayName}
            onChange={handleChange}
            autoComplete="off"
            required
          />
        </div>

        <div className="mb-5">
          <label className="block text-yellow-100 mb-1 font-medium">Teléfono</label>
          <input
            className="w-full px-4 py-3 rounded-lg border border-yellow-600/30 bg-[#181c2b] text-yellow-100"
            name="numberPhone"
            value={profile.numberPhone}
            onChange={handleChange}
            autoComplete="off"
            required
            type="tel"
            placeholder="Ej: +54 911 1234 5678"
          />
        </div>

        <div className="mb-5">
          <label className="block text-yellow-100 mb-1 font-medium">Email</label>
          <input
            className="w-full px-4 py-3 rounded-lg border border-yellow-600/30 bg-[#181c2b] text-yellow-100"
            name="email"
            value={profile.email}
            onChange={handleChange}
            autoComplete="off"
            required
            type="email"
            disabled
          />
        </div>

        <div className="mb-6">
          <label className="block text-yellow-100 mb-1 font-medium">Nueva contraseña</label>
          <div className="relative">
            <input
              className="w-full px-4 py-3 rounded-lg border border-yellow-600/30 bg-[#181c2b] text-yellow-100 pr-12"
              name="password"
              value={profile.password}
              onChange={handleChange}
              type={profile.showPassword ? "text" : "password"}
              autoComplete="new-password"
              minLength={6}
              placeholder="********"
              disabled
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-300"
              tabIndex={-1}
              onClick={() => setProfile((p) => ({ ...p, showPassword: !p.showPassword }))}
            >
              {profile.showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="text-yellow-200/70 mt-1 text-xs">Puedes cambiar la contraseña desde la pantalla de login si lo necesitas.</p>
        </div>

        {successMsg && <div className="text-green-400 mb-3 text-center">{successMsg}</div>}
        {errorMsg && <div className="text-red-400 mb-3 text-center">{errorMsg}</div>}

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="w-full bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-200 text-[#181c2b] font-bold py-3 rounded-lg shadow-lg hover:from-yellow-300 hover:to-yellow-100 transition-all mt-4 flex items-center justify-center gap-2"
          disabled={loading}
        >
          <Save size={20} /> {loading ? "Guardando..." : isNew ? "Crear perfil" : "Guardar cambios"}
        </motion.button>
      </motion.form>
    </div>
  );
}