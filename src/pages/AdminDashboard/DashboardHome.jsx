import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Edit, Trash2, EyeOff, Eye, Home, Building2, Trees, CheckCircle, ArrowLeft, Search, Filter
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock de propiedades publicadas (en un proyecto real esto vendría de una API)
const initialProperties = [
  {
    id: 1,
    title: "Apartamento con Vista al Mar",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    location: "Punta del Este",
    type: "Apartamento",
    operation: "Venta",
    bedrooms: "1",
    bathrooms: "1",
    price: "30000",
    area: "15",
    status: "publicada",
    featured: true,
    createdAt: "2024-05-10",
  },
  {
    id: 2,
    title: "Casa Moderna en Barrio Privado",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    location: "La Barra",
    type: "Casa",
    bedrooms: "2",
    bathrooms: "1",
    area: "36",
    price: "200",
    operation: "Alquiler",
    status: "baja",
    featured: false,
    createdAt: "2024-05-01",
  },
  {
    id: 3,
    title: "Campo en Ruta 12",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    location: "Ruta 12",
    type: "Campo",
    bedrooms: "2",
    bathrooms: "1",
    area: "200",
    price: "200",
    operation: "Venta",
    status: "publicada",
    featured: false,
    createdAt: "2024-04-22",
  }
];

const typeIcons = {
  Casa: <Home size={18} className="text-yellow-400" />,
  Apartamento: <Building2 size={18} className="text-yellow-400" />,
  Campo: <Trees size={18} className="text-yellow-400" />,
};

const allTypes = ["Todas", "Casa", "Apartamento", "Campo"];
const allOps = ["Todas", "Venta", "Alquiler"];
const allStates = ["Todas", "publicada", "baja"];

export default function DashboardHome() {
  const [properties, setProperties] = useState(initialProperties);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [filter, setFilter] = useState({
    search: "",
    type: "Todas",
    operation: "Todas",
    status: "Todas",
    featured: "Todas"
  });
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  // Mobile/tablet card/row view toggle
  const [mobileView, setMobileView] = useState("card");

  // Detect mobile (simple)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDelete = (id) => {
    setProperties(props => props.filter(p => p.id !== id));
    setConfirmDelete(null);
  };

  const handleToggleStatus = (id) => {
    setProperties(props =>
      props.map(p =>
        p.id === id
          ? { ...p, status: p.status === "publicada" ? "baja" : "publicada" }
          : p
      )
    );
  };

  const handleEdit = (id) => {
    alert(`Editar propiedad ID: ${id}`);
  };

  const handleCreate = () => {
    navigate('/dashboard/nueva-propiedad');
  };

  // Filtrado
  const filteredProperties = properties.filter(prop => {
    const matchesSearch = prop.title.toLowerCase().includes(filter.search.toLowerCase()) || prop.location.toLowerCase().includes(filter.search.toLowerCase());
    const matchesType = filter.type === "Todas" || prop.type === filter.type;
    const matchesOp = filter.operation === "Todas" || prop.operation === filter.operation;
    const matchesStatus = filter.status === "Todas" || prop.status === filter.status;
    const matchesFeatured = filter.featured === "Todas" || (filter.featured === "Destacada" ? prop.featured : !prop.featured);
    return matchesSearch && matchesType && matchesOp && matchesStatus && matchesFeatured;
  });

  // Card for mobile
  const PropertyMobileCard = ({ prop }) => (
    <div className="flex bg-[#232742]/80 border border-yellow-600/20 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow relative group mb-3">
      <div className="min-w-[88px] w-24 h-24 relative flex-shrink-0">
        <img
          src={prop.image}
          alt={prop.title}
          className="w-full h-full object-cover"
        />
        {prop.featured && (
          <div className="absolute top-2 left-2 bg-gradient-to-tr from-yellow-400 to-yellow-300 text-[#181c2b] px-2 py-0.5 text-[10px] font-bold rounded-full shadow z-10">
            DESTACADA
          </div>
        )}
      </div>
      <div className="flex-1 px-3 py-2 flex flex-col justify-center">
        <div className="flex items-center gap-2 text-yellow-100 font-semibold">
          <span className="truncate">{prop.title}</span>
          {typeIcons[prop.type]}
        </div>
        <div className="text-yellow-100/60 text-xs">{prop.location}</div>
        <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-yellow-100/80 text-xs my-1">
          <span>{prop.bedrooms} hab.</span>
          <span>{prop.bathrooms} baños</span>
          <span>{prop.area} m²</span>
          <span className="text-yellow-400 font-bold">{prop.operation}</span>
        </div>
        <div className="flex gap-2 items-center text-xs mt-1">
          {prop.status === "publicada" ? (
            <span className="flex items-center gap-1 text-green-400 font-semibold">
              <CheckCircle size={14} /> Publicada
            </span>
          ) : (
            <span className="flex items-center gap-1 text-yellow-400 font-semibold">
              <EyeOff size={14} /> Baja
            </span>
          )}
          <span className="ml-2 text-yellow-100/60">{prop.createdAt}</span>
        </div>
        <div className="flex text-yellow-300 font-bold text-base mt-1">
          ${Number(prop.price).toLocaleString()}
        </div>
        <div className="flex gap-1 mt-2">
          <button
            onClick={() => handleEdit(prop.id)}
            className="bg-yellow-400/20 text-yellow-200 hover:bg-yellow-400/40 rounded px-2 py-1 text-xs font-semibold"
            title="Editar"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={() => setConfirmDelete(prop.id)}
            className="bg-red-500/10 text-red-300 hover:bg-red-500/20 rounded px-2 py-1 text-xs font-semibold"
            title="Eliminar"
          >
            <Trash2 size={14} />
          </button>
          <button
            onClick={() => handleToggleStatus(prop.id)}
            className={`${
              prop.status === "publicada"
                ? "bg-yellow-400/20 text-yellow-200 hover:bg-yellow-400/40"
                : "bg-green-400/20 text-green-200 hover:bg-green-400/40"
            } rounded px-2 py-1 text-xs font-semibold`}
            title={prop.status === "publicada" ? "Dar de baja" : "Volver a publicar"}
          >
            {prop.status === "publicada" ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#181c2b] px-6 sm:px-4 py-6 sm:py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-6">
  <div>
    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-100 tracking-tight">
      Panel de Propiedades
    </h1>
  </div>

  <div className="flex flex-col md:flex-row md:items-center gap-3 w-full md:w-auto">
    <div className="relative w-full md:w-64">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400" size={18} />
      <input
        type="text"
        placeholder="Buscar por título o zona..."
        value={filter.search}
        onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
        className="w-full pl-10 pr-3 py-2 rounded-lg border border-yellow-600/30 bg-[#232742] text-yellow-100 placeholder:text-yellow-200/50 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all text-sm"
      />
    </div>

    <button
      onClick={handleCreate}
      className="flex items-center bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-200 text-[#181c2b] font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-lg shadow-lg hover:from-yellow-300 hover:to-yellow-100 transition-all gap-2 text-sm sm:text-base"
    >
      <Plus size={18} className="sm:hidden" />
      <Plus size={22} className="hidden sm:inline" /> Nueva propiedad
    </button>

    {isMobile && (
      <div className="flex w-full items-center justify-between gap-3 mt-1">
        {/* Botones Cards y Lista a la IZQUIERDA */}
        <div className="flex gap-2">
          <button
            onClick={() => setMobileView("card")}
            className={`px-2 py-1 rounded font-semibold transition-all border ${
              mobileView === "card"
                ? "bg-gradient-to-tr from-yellow-400 to-yellow-200 text-[#181c2b] border-yellow-300 shadow"
                : "bg-[#232742]/60 text-yellow-100 border-transparent hover:bg-yellow-400/20"
            }`}
          >
            Cards
          </button>
          <button
            onClick={() => setMobileView("row")}
            className={`px-2 py-1 rounded font-semibold transition-all border ${
              mobileView === "row"
                ? "bg-gradient-to-tr from-yellow-400 to-yellow-200 text-[#181c2b] border-yellow-300 shadow"
                : "bg-[#232742]/60 text-yellow-100 border-transparent hover:bg-yellow-400/20"
            }`}
          >
            Lista
          </button>
        </div>

        {/* Botón de Filtros a la DERECHA */}
        <div className="ml-auto">
          <button
            className="md:hidden flex items-center text-yellow-200 bg-yellow-400/10 px-3 py-1.5 rounded-lg shadow hover:bg-yellow-400/20 transition"
            onClick={() => setShowFilters(f => !f)}
          >
            <Filter size={18} /> Filtros
          </button>
        </div>
      </div>
    )}
  </div>
</div>


        {/* Filtros avanzados */}
        <div className={`${showFilters ? "" : "hidden md:block"} mb-6`}>
          <div className="flex flex-wrap gap-4 items-center bg-[#232742]/80 border border-yellow-600/20 p-5 rounded-xl shadow">
            <div>
              <label className="block text-yellow-100/80 text-xs mb-1">Tipo</label>
              <select
                value={filter.type}
                onChange={e => setFilter(f => ({ ...f, type: e.target.value }))}
                className="px-4 py-2 rounded-lg border border-yellow-600/30 bg-[#232742] text-yellow-100 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
              >
                {allTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-yellow-100/80 text-xs mb-1">Operación</label>
              <select
                value={filter.operation}
                onChange={e => setFilter(f => ({ ...f, operation: e.target.value }))}
                className="px-4 py-2 rounded-lg border border-yellow-600/30 bg-[#232742] text-yellow-100 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
              >
                {allOps.map(op => <option key={op} value={op}>{op}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-yellow-100/80 text-xs mb-1">Estado</label>
              <select
                value={filter.status}
                onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
                className="px-4 py-2 rounded-lg border border-yellow-600/30 bg-[#232742] text-yellow-100 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
              >
                {allStates.map(s => <option key={s} value={s}>{s === "publicada" ? "Publicada" : s === "baja" ? "Baja" : "Todas"}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-yellow-100/80 text-xs mb-1">Destacada</label>
              <select
                value={filter.featured}
                onChange={e => setFilter(f => ({ ...f, featured: e.target.value }))}
                className="px-4 py-2 rounded-lg border border-yellow-600/30 bg-[#232742] text-yellow-100 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
              >
                <option value="Todas">Todas</option>
                <option value="Destacada">Solo destacadas</option>
                <option value="No destacada">No destacadas</option>
              </select>
            </div>
          </div>
        </div>

        {/* MOBILE: fila estilo lista */}
        {isMobile && mobileView === "row" && (
          <div>
            {filteredProperties.length === 0 ? (
              <div className="text-center py-20 text-yellow-100/70 text-lg">
                No hay propiedades que coincidan.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredProperties.map((prop) => (
                  <PropertyMobileCard prop={prop} key={prop.id} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* MOBILE: cards por defecto (1 por fila) */}
        {isMobile && mobileView === "card" && (
          <div>
            {filteredProperties.length === 0 ? (
              <div className="text-center py-20 text-yellow-100/70 text-lg">
                No hay propiedades que coincidan.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {filteredProperties.map((prop) => (
                  <div
                    key={prop.id}
                    className="bg-[#232742]/80 border border-yellow-600/20 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow relative group flex flex-col"
                  >
                    <div className="relative h-40 overflow-hidden rounded-t-2xl">
                      <img
                        src={prop.image}
                        alt={prop.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {prop.featured && (
                        <div className="absolute top-3 left-3 bg-gradient-to-tr from-yellow-400 to-yellow-300 text-[#181c2b] px-3 py-1 text-xs font-bold rounded-full shadow z-10">
                          DESTACADA
                        </div>
                      )}
                    </div>
                    <div className="p-3 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 font-bold text-yellow-100 mb-1 truncate text-lg">{prop.title} {typeIcons[prop.type]}</div>
                      <div className="flex items-center gap-2 text-yellow-100/80 mb-1 text-xs">
                        {prop.location}
                      </div>
                      <div className="flex items-center gap-2 text-yellow-100/80 text-xs mb-2">
                        <span>{prop.bedrooms} hab.</span>
                        <span>{prop.bathrooms} baños</span>
                        <span>{prop.area} m²</span>
                        <span className="text-yellow-400 font-bold">{prop.operation}</span>
                      </div>
                      <div className="flex gap-2 items-center text-xs mb-1">
                        {prop.status === "publicada" ? (
                          <span className="flex items-center gap-1 text-green-400 font-semibold">
                            <CheckCircle size={14} /> Publicada
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                            <EyeOff size={14} /> Baja
                          </span>
                        )}
                        <span className="ml-2 text-yellow-100/60">{prop.createdAt}</span>
                      </div>
                      <div className="text-yellow-300 font-bold text-base mb-2 mt-auto">${Number(prop.price).toLocaleString()}</div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(prop.id)}
                          className="bg-yellow-400/20 text-yellow-200 hover:bg-yellow-400/40 rounded px-2 py-1 text-xs font-semibold"
                          title="Editar"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(prop.id)}
                          className="bg-red-500/10 text-red-300 hover:bg-red-500/20 rounded px-2 py-1 text-xs font-semibold"
                          title="Eliminar"
                        >
                          <Trash2 size={14} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(prop.id)}
                          className={`${
                            prop.status === "publicada"
                              ? "bg-yellow-400/20 text-yellow-200 hover:bg-yellow-400/40"
                              : "bg-green-400/20 text-green-200 hover:bg-green-400/40"
                          } rounded px-2 py-1 text-xs font-semibold`}
                          title={prop.status === "publicada" ? "Dar de baja" : "Volver a publicar"}
                        >
                          {prop.status === "publicada" ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* DESKTOP: tabla */}
        {!isMobile && (
          <div className="bg-[#232742]/80 border border-yellow-600/20 rounded-2xl shadow-lg p-6">
            {filteredProperties.length === 0 ? (
              <div className="text-center py-20 text-yellow-100/70 text-lg">
                No hay propiedades que coincidan. <br />
                <button
                  onClick={handleCreate}
                  className="mt-6 bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-200 text-[#181c2b] font-bold py-3 px-8 rounded-lg shadow-md hover:from-yellow-300 hover:to-yellow-100 transition-all"
                >
                  Crear propiedad
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="text-yellow-200 uppercase text-xs border-b border-yellow-600/20">
                      <th className="py-3 pr-4">Título</th>
                      <th className="py-3 pr-4">Tipo</th>
                      <th className="py-3 pr-4">Operación</th>
                      <th className="py-3 pr-4">Zona</th>
                      <th className="py-3 pr-4">Dorm.</th>
                      <th className="py-3 pr-4">Baños</th>
                      <th className="py-3 pr-4">m²</th>
                      <th className="py-3 pr-4">Precio</th>
                      <th className="py-3 pr-4">Estado</th>
                      <th className="py-3 pr-4">Destacada</th>
                      <th className="py-3 pr-4">Fecha</th>
                      <th className="py-3 pr-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProperties.map((prop) => (
                      <tr
                        key={prop.id}
                        className={`border-b border-yellow-600/10 hover:bg-[#181c2b]/80 transition`}
                      >
                        <td className="py-3 pr-4 flex items-center gap-3 min-w-[220px]">
                          <img
                            src={prop.image}
                            alt={prop.title}
                            className="w-14 h-10 object-cover rounded-lg border border-yellow-600/10"
                          />
                          <span className="text-yellow-100 font-semibold truncate">{prop.title}</span>
                        </td>
                        <td className="py-3 pr-4">{typeIcons[prop.type]} <span className="ml-1 text-yellow-100/90">{prop.type}</span></td>
                        <td className="py-3 pr-4 text-yellow-100/90">{prop.operation}</td>
                        <td className="py-3 pr-4 text-yellow-100/80">{prop.location}</td>
                        <td className="py-3 pr-4">{prop.bedrooms}</td>
                        <td className="py-3 pr-4">{prop.bathrooms}</td>
                        <td className="py-3 pr-4">{prop.area}</td>
                        <td className="py-3 pr-4">${Number(prop.price).toLocaleString()}</td>
                        <td className="py-3 pr-4">
                          {prop.status === "publicada" ? (
                            <span className="flex items-center gap-1 text-green-400 font-semibold">
                              <CheckCircle size={16} /> Publicada
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                              <EyeOff size={16} /> Baja
                            </span>
                          )}
                        </td>
                        <td className="py-3 pr-4">
                          {prop.featured ? (
                            <span className="bg-gradient-to-tr from-yellow-400 to-yellow-300 text-[#181c2b] px-2 py-1 rounded font-bold text-xs shadow">
                              Destacada
                            </span>
                          ) : (
                            <span className="text-yellow-100/50 font-semibold">—</span>
                          )}
                        </td>
                        <td className="py-3 pr-4 text-yellow-100/60">{prop.createdAt}</td>
                        <td className="py-3 pr-4 flex gap-2">
                          <button
                            onClick={() => handleEdit(prop.id)}
                            className="bg-yellow-400/20 text-yellow-200 hover:bg-yellow-400/40 transition rounded-md px-3 py-1 flex items-center gap-2 font-semibold"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => setConfirmDelete(prop.id)}
                            className="bg-red-500/10 text-red-300 hover:bg-red-500/20 transition rounded-md px-3 py-1 flex items-center gap-2 font-semibold"
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(prop.id)}
                            className={`${
                              prop.status === "publicada"
                                ? "bg-yellow-400/20 text-yellow-200 hover:bg-yellow-400/40"
                                : "bg-green-400/20 text-green-200 hover:bg-green-400/40"
                            } transition rounded-md px-3 py-1 flex items-center gap-2 font-semibold`}
                            title={prop.status === "publicada" ? "Dar de baja" : "Volver a publicar"}
                          >
                            {prop.status === "publicada" ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Modal de confirmación de borrado */}
        <AnimatePresence>
          {confirmDelete !== null && (
            <motion.div
              className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-[#232742] border border-yellow-600/30 rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
              >
                <Trash2 size={36} className="text-red-400 mb-3" />
                <h2 className="text-yellow-100 font-bold text-2xl mb-2 text-center">¿Eliminar propiedad?</h2>
                <p className="text-yellow-100/80 mb-6 text-center">
                  Esta acción no se puede deshacer. ¿Deseas continuar?
                </p>
                <div className="flex gap-4 w-full">
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className="flex-1 bg-yellow-400/10 text-yellow-200 hover:bg-yellow-400/20 rounded-lg px-6 py-2 font-semibold"
                  >
                    <ArrowLeft size={16} className="inline mr-1" /> Cancelar
                  </button>
                  <button
                    onClick={() => handleDelete(confirmDelete)}
                    className="flex-1 bg-red-500/80 hover:bg-red-500 text-yellow-100 rounded-lg px-6 py-2 font-semibold"
                  >
                    <Trash2 size={16} className="inline mr-1" /> Eliminar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}