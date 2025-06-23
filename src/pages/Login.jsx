import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, User } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Simula login (cambia por tu lógica real)
    setTimeout(() => {
      if (form.email === "admin@inmoelegance.uy" && form.password === "admin123") {
        window.location.href = "/dashboard";
      } else {
        setError("Credenciales incorrectas.");
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div className=" flex items-center justify-center bg-[#181c2b] px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#232742]/90 border border-yellow-600/30 rounded-2xl shadow-2xl px-10 py-12"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-tr from-yellow-400 to-yellow-200 shadow-lg">
            <Lock className="text-[#181c2b]" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-yellow-100 mb-2">Panel de Administración</h1>
          <p className="text-yellow-100/70">Acceso solo para administradores</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-yellow-100 font-semibold mb-1" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400" size={20} />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-yellow-600/30 bg-[#181c2b] text-yellow-100 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all placeholder:text-yellow-200/50"
                placeholder="admin@inmoelegance.uy"
                disabled={loading}
              />
            </div>
          </div>
          <div>
            <label className="block text-yellow-100 font-semibold mb-1" htmlFor="password">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400" size={20} />
              <input
                id="password"
                name="password"
                type={showPass ? "text" : "password"}
                autoComplete="current-password"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-3 rounded-lg border border-yellow-600/30 bg-[#181c2b] text-yellow-100 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all placeholder:text-yellow-200/50"
                placeholder="********"
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-400 hover:text-yellow-500 transition-colors text-xs"
                tabIndex={-1}
                onClick={() => setShowPass((v) => !v)}
                aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPass ? "Ocultar" : "Ver"}
              </button>
            </div>
          </div>
          {error && (
            <div className="text-red-400 text-sm text-center font-semibold">{error}</div>
          )}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-200 text-[#181c2b] font-bold py-3 rounded-lg shadow-lg hover:from-yellow-300 hover:to-yellow-100 transition-all mt-2 disabled:opacity-70"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}