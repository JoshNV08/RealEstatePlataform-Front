import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, Instagram, Facebook, Linkedin } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

// Paleta elegante: azul oscuro, dorado, fondo degradado luxury con detalles sutiles
const defaultForm = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

const contactInfo = [
  {
    icon: MapPin,
    text: "Punta del Este, Uruguay",
    href: "https://goo.gl/maps/yourLocation",
  },
  {
    icon: Phone,
    text: "+598 99 123 456",
    href: "tel:+59899123456",
  },
  {
    icon: Mail,
    text: "contacto@goldenrealty.uy",
    href: "mailto:contacto@goldenrealty.uy",
  },
  {
    icon: Clock,
    text: "Lun - Vie, 9:00 - 18:00",
  },
];

const social = [
  {
    icon: Instagram,
    href: "https://instagram.com/",
    color: "bg-gradient-to-tr from-pink-500 to-yellow-400",
  },
  {
    icon: Facebook,
    href: "https://facebook.com/",
    color: "bg-blue-700",
  },
  {
    icon: Linkedin,
    href: "https://linkedin.com/",
    color: "bg-blue-900",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export default function Contact() {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("¡Mensaje enviado con éxito!");
      setForm(defaultForm);
    } catch (error) {
      toast.error("Error al enviar el mensaje. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-24 overflow-hidden">
      {/* Fondo elegante con degradado oscuro y detalles dorados */}
      <div className="absolute inset-0 z-0">
        {/* Gradiente principal */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#181c2b] via-[#222a3a] to-[#49371a] opacity-95" />
        {/* Detalles dorados en blur, decorativos */}
        <div className="absolute -top-32 left-1/3 w-96 h-96 bg-gradient-to-br from-yellow-400/50 via-yellow-200/10 to-transparent rounded-full blur-2xl opacity-40 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-72 h-64 bg-gradient-to-br from-yellow-500/30 to-transparent rounded-full blur-2xl opacity-30" />
        {/* Detalles azulados */}
        <div className="absolute top-24 left-0 w-40 h-32 bg-gradient-to-tr from-blue-800/30 to-transparent rounded-full blur-xl opacity-60" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl w-full rounded-3xl shadow-2xl overflow-hidden border border-yellow-600/40"
        style={{
          background: "rgba(24,28,43,0.86)",
          boxShadow:
            "0 8px 38px 0 rgba(72,66,56,0.14), 0 1.5px 4px 0 rgba(255,215,0,0.11)",
        }}
      >
        <div className="grid md:grid-cols-5">
          {/* Lado información */}
          <div className="md:col-span-2 px-8 py-12 bg-gradient-to-br from-[#232742] via-[#232742]/90 to-[#2c2341]/80 text-yellow-50 flex flex-col justify-between relative">
            {/* Decorativo elegante arriba */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-tr from-yellow-200/40 to-transparent rounded-bl-2xl blur-lg" />
            <div>
              <motion.h2
                variants={itemVariants}
                className="text-3xl font-bold mb-5 tracking-tight text-yellow-200"
              >
                Contáctanos
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="text-yellow-100/80 mb-10"
              >
                Resolvemos tus dudas y asesoramos personalmente. Completa el formulario o usa tu canal favorito.
              </motion.p>
            </div>
            <div className="space-y-7">
              {contactInfo.map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-yellow-600 via-yellow-400 to-yellow-200 shadow-lg">
                    <item.icon size={22} className="text-[#181c2b]" />
                  </div>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-yellow-100/90 hover:text-yellow-300 transition-all font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="text-yellow-100/90 font-medium">
                      {item.text}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
            <motion.div
              variants={itemVariants}
              className="mt-12 pt-8 border-t border-yellow-400/30"
            >
              <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
              <div className="flex space-x-5">
                {social.map((s, idx) => (
                  <a
                    key={idx}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform transform hover:scale-110 ${s.color}`}
                  >
                    <s.icon size={22} />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
          {/* Lado Formulario */}
          <div className="md:col-span-3 px-8 py-12">
            <motion.h2
              variants={itemVariants}
              className="text-3xl font-bold text-yellow-100 mb-8 tracking-tight"
            >
              Envíanos un mensaje
            </motion.h2>
            <motion.form
              variants={containerVariants}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <motion.div
                variants={itemVariants}
                className="grid md:grid-cols-2 gap-6"
              >
                <div>
                  <label className="block text-sm font-medium text-yellow-200 mb-2">
                    Nombre
                  </label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-yellow-400/60 bg-[#232742]/80 text-yellow-100 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all placeholder:text-yellow-200/50"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-yellow-200 mb-2">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-yellow-400/60 bg-[#232742]/80 text-yellow-100 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all placeholder:text-yellow-200/50"
                    placeholder="tu@email.com"
                  />
                </div>
              </motion.div>
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-yellow-200 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-yellow-400/60 bg-[#232742]/80 text-yellow-100 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all placeholder:text-yellow-200/50"
                  placeholder="+598 99 123 456"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-yellow-200 mb-2">
                  Mensaje
                </label>
                <textarea
                  required
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-yellow-400/60 bg-[#232742]/80 text-yellow-100 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all placeholder:text-yellow-200/50 resize-none"
                  placeholder="¿En qué podemos ayudarte?"
                />
              </motion.div>
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="w-full bg-gradient-to-tr from-yellow-500 via-yellow-400 to-yellow-200 text-[#181c2b] font-bold py-4 rounded-lg shadow-lg hover:from-yellow-400 hover:to-yellow-300 transition-all flex items-center justify-center space-x-2 disabled:opacity-70"
              >
                {loading ? (
                  "Enviando..."
                ) : (
                  <>
                    <span>Enviar mensaje</span>
                    <Send size={18} />
                  </>
                )}
              </motion.button>
            </motion.form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}