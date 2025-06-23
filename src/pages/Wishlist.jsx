import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, MapPin, BedDouble, Bath, Ruler } from "lucide-react";

// Mock para diseño
const wishlist = [
  {
    id: 1,
    title: "Apartamento con Vista al Mar",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    location: "Punta del Este",
    price: 850000,
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
  },
  {
    id: 2,
    title: "Casa Moderna en Barrio Privado",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    location: "La Barra",
    price: 1250000,
    bedrooms: 4,
    bathrooms: 4,
    area: 320,
  },
];

export default function WishlistSidebar({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[80]"
            onClick={onClose}
          />
          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 35 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#232742] z-[90] shadow-2xl border-l border-yellow-600/20 flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-yellow-600/20">
              <div className="flex items-center gap-2 text-yellow-100 font-bold text-xl">
                <Heart className="text-yellow-400" /> Wishlist
                <span className="ml-2 bg-yellow-400 text-[#181c2b] rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm shadow">
                  {wishlist.length}
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-yellow-100 hover:text-yellow-400 transition"
                aria-label="Cerrar wishlist"
              >
                <X size={28} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-6">
              {wishlist.length === 0 ? (
                <div className="text-center text-yellow-100/70 py-12">
                  <Heart size={40} className="mx-auto mb-4 text-yellow-400" />
                  <div className="text-lg font-semibold mb-2">Tu wishlist está vacía</div>
                  <div className="text-yellow-100/80 mb-6">
                    Guarda propiedades para verlas luego.
                  </div>
                  <button
                    onClick={onClose}
                    className="bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-200 text-[#181c2b] font-bold px-6 py-2 rounded-lg shadow-md hover:from-yellow-300 hover:to-yellow-100 transition-all"
                  >
                    Explorar propiedades
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {wishlist.map((prop) => (
                    <div
                      key={prop.id}
                      className="bg-[#181c2b] border border-yellow-600/20 rounded-xl p-3 flex gap-4 shadow-lg relative group"
                    >
                      <img
                        src={prop.image}
                        alt={prop.title}
                        className="w-24 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-yellow-100 font-semibold text-lg truncate">{prop.title}</h4>
                          <button
                            className="text-yellow-400 hover:text-red-500 transition"
                            title="Quitar de wishlist"
                          >
                            <Heart fill="currentColor" size={20} />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 text-yellow-100/70 text-xs mb-1">
                          <MapPin size={14} className="text-yellow-400" />
                          <span>{prop.location}</span>
                        </div>
                        <div className="flex items-center gap-4 text-yellow-100/70 text-xs mb-1">
                          <span className="flex items-center gap-1">
                            <BedDouble size={14} className="text-yellow-400" /> {prop.bedrooms}
                          </span>
                          <span className="flex items-center gap-1">
                            <Bath size={14} className="text-yellow-400" /> {prop.bathrooms}
                          </span>
                          <span className="flex items-center gap-1">
                            <Ruler size={14} className="text-yellow-400" /> {prop.area} m²
                          </span>
                        </div>
                        <div className="text-yellow-300 font-bold text-base">
                          ${prop.price.toLocaleString()}
                        </div>
                      </div>
                      <button
                        className="absolute right-2 top-2 text-yellow-400 hover:text-red-500 transition"
                        title="Quitar de wishlist"
                      >
                        <Heart fill="currentColor" size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Opcional: CTA final */}
            {wishlist.length > 0 && (
              <div className="p-5 border-t border-yellow-600/20">
                <button
                  className="w-full bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-200 text-[#181c2b] font-bold py-3 rounded-lg shadow-md hover:from-yellow-300 hover:to-yellow-100 transition-all"
                >
                  Contactar por seleccionadas
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}