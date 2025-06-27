import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  BedDouble,
  Bath,
  Ruler,
  Heart,
  ChevronDown,
  LayoutGrid,
  Square,
  List,
  Filter,
  Star,
  TrendingUp,
  UserCircle,
} from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firestore";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { add, remove } from '../store/wishlistSlice';

// Opciones de filtro mejoradas
const locations = ["Todas", "Punta del Este", "La Barra", "Punta Ballena"];
const bedrooms = ["Cualquiera", 1, 2, 3, 4, 5];
const bathrooms = ["Cualquiera", 1, 2, 3, 4, 5];
const types = ["Todas", "Casa", "Apartamento", "Campo"];
const operations = ["Todas", "Venta", "Alquiler"];

const SIZE_OPTIONS = [
  {
    key: "compact",
    label: (
      <>
        <Square size={18} /> Compacta
      </>
    ),
    cols: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
    img: "h-32",
    font: "text-lg",
    padding: "p-3",
  },
  {
    key: "medium",
    label: (
      <>
        <LayoutGrid size={18} /> Media
      </>
    ),
    cols: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    img: "h-44",
    font: "text-xl",
    padding: "p-5",
  },
  {
    key: "large",
    label: (
      <>
        <List size={18} /> Grande
      </>
    ),
    cols: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    img: "h-56",
    font: "text-2xl",
    padding: "p-7",
  },
];

function getInitialParam(param, defaultValue) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param) || defaultValue;
}

// Agente de fallback
const DEFAULT_AGENT = {
  name: "Agente Desconocido",
  photo: "/img/default-agent.png",
};

export default function PropertyExplorer() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const wishlist = useSelector(state => state.wishlist.items);

  const isInWishlist = (id) => wishlist.some(item => item.id === id);

  // Filtros y vistas (leer de query params para deep-linking desde landing)
  const [search, setSearch] = useState(getInitialParam("zone", ""));
  const [filterLocation, setFilterLocation] = useState(getInitialParam("zone", "Todas"));
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filterBedrooms, setFilterBedrooms] = useState("Cualquiera");
  const [filterBathrooms, setFilterBathrooms] = useState("Cualquiera");
  const [filterType, setFilterType] = useState(getInitialParam("type", "Todas"));
  const [filterOperation, setFilterOperation] = useState(getInitialParam("operation", "Todas") || getInitialParam("op", "Todas"));
  const [cardSize, setCardSize] = useState("medium");
  const [mobileView, setMobileView] = useState("card");
  const [sortBy, setSortBy] = useState("price-desc");
  const size = SIZE_OPTIONS.find(s => s.key === cardSize);

  // Mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Drawer sheet mobile
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Navegación reactiva para query params
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    // Si cambia la URL desde el landing, sincronizar filtros
    const params = new URLSearchParams(location.search);
    setSearch(params.get("zone") || "");
    setFilterLocation(params.get("zone") || "Todas");
    setFilterType(params.get("type") || "Todas");
    setFilterOperation(params.get("operation") || "Todas");
  }, [location.search]);

  // Cargar propiedades desde Firebase
  useEffect(() => {
    setLoading(true);
    getDocs(collection(db, "properties"))
      .then((snap) => {
        const props = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProperties(props);
      })
      .finally(() => setLoading(false));
  }, []);

  // Filtros y ordenamiento
  const filteredProperties = useMemo(() => {
    let result = properties
      .filter((prop) => {
        const matchesSearch =
          (!search || prop.title?.toLowerCase().includes(search.toLowerCase()) || prop.location?.toLowerCase().includes(search.toLowerCase()));

        const matchesLocation =
          filterLocation === "Todas" || prop.location === filterLocation;

        const matchesType =
          filterType === "Todas" || prop.type === filterType;

        const matchesOperation =
          filterOperation === "Todas" || prop.operation === filterOperation;

        const matchesBedrooms =
          filterBedrooms === "Cualquiera" || Number(prop.bedrooms) === Number(filterBedrooms);

        const matchesBathrooms =
          filterBathrooms === "Cualquiera" || Number(prop.bathrooms) === Number(filterBathrooms);

        const matchesMinPrice =
          minPrice === "" || Number(prop.price) >= Number(minPrice);

        const matchesMaxPrice =
          maxPrice === "" || Number(prop.price) <= Number(maxPrice);

        return (
          matchesSearch &&
          matchesLocation &&
          matchesType &&
          matchesOperation &&
          matchesBedrooms &&
          matchesBathrooms &&
          matchesMinPrice &&
          matchesMaxPrice
        );
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price-asc": return Number(a.price) - Number(b.price);
          case "price-desc": return Number(b.price) - Number(a.price);
          case "rating":
            return (Number(b.rating) || 0) - (Number(a.rating) || 0);
          case "area":
            return Number(b.area) - Number(a.area);
          default: return 0;
        }
      });
    return result;
  }, [
    properties, search, filterLocation, filterType, filterOperation,
    filterBedrooms, filterBathrooms, minPrice, maxPrice, sortBy
  ]);

  const isFeatured = (prop) =>
    (Number(prop.wishlistCount) || 0) + (Number(prop.consultCount) || 0) >= 3;

  // Para estadísticas en el footer
  const avgRating = filteredProperties.length
    ? (filteredProperties.reduce((acc, p) => acc + (Number(p.rating) || 0), 0) / filteredProperties.length).toFixed(1)
    : 0;
  const zonesCount = Array.from(new Set(properties.map(p => p.location))).length;

  // Imagen principal (cloudinary compatible)
  const getImage = (prop) =>
    Array.isArray(prop.images) && prop.images.length > 0
      ? prop.images[0]
      : prop.image || "/img/no-image.jpg";

  // Agente info
  const getAgent = (prop) => {
    if (prop.agent && (prop.agent.name || prop.agent.photo)) {
      return {
        name: prop.agent.name || DEFAULT_AGENT.name,
        photo: prop.agent.photo || DEFAULT_AGENT.photo,
      };
    }
    return DEFAULT_AGENT;
  };

  // Navegación para sincronizar filtros en la url (opcional)
  const handleFilterChange = (key, value) => {
    const params = new URLSearchParams(location.search);
    if (key === "zone") {
      setSearch(value);
      setFilterLocation(value || "Todas");
      if (value) params.set("zone", value); else params.delete("zone");
    }
    if (key === "type") {
      setFilterType(value);
      if (value && value !== "Todas") params.set("type", value); else params.delete("type");
    }
    if (key === "operation") {
      setFilterOperation(value);
      if (value && value !== "Todas") params.set("operation", value); else params.delete("operation");
    }
    navigate({ search: params.toString() }, { replace: true });
  };

  // Conteo de filtros activos para badge en botón (opcional UX extra)
  const filtersCount = useMemo(() => {
    let c = 0;
    if (search) c++;
    if (filterLocation !== "Todas") c++;
    if (filterType !== "Todas") c++;
    if (filterOperation !== "Todas") c++;
    if (minPrice) c++;
    if (maxPrice) c++;
    if (filterBedrooms !== "Cualquiera") c++;
    if (filterBathrooms !== "Cualquiera") c++;
    return c;
  }, [search, filterLocation, filterType, filterOperation, minPrice, maxPrice, filterBedrooms, filterBathrooms]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1f2e] via-[#1e2338] to-[#212544]">
      {/* Hero Section */}
      <div className="relative pt-16 pb-12 px-4 overflow-hidden">
        {/* Efectos de fondo */}
        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-yellow-400/12 via-yellow-200/6 to-transparent rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-yellow-500/8 to-transparent rounded-full blur-3xl opacity-40 pointer-events-none" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-yellow-300/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center bg-yellow-400/12 backdrop-blur-sm rounded-full px-6 py-3 border border-yellow-400/25 mb-6">
              <TrendingUp className="w-4 h-4 text-yellow-400 mr-2" />
              <span className="text-yellow-300 text-sm font-medium">
                Explora {properties.length} Propiedades Exclusivas
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-yellow-100 mb-4 tracking-tight">
              Encuentra tu
              <span className="block bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 bg-clip-text text-transparent">
                propiedad ideal
              </span>
            </h1>
            <p className="text-lg md:text-xl text-yellow-100/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Utiliza nuestros filtros avanzados para descubrir propiedades que se adapten perfectamente a tus necesidades y presupuesto.
            </p>
          </motion.div>

          {/* --- MOBILE FILTER BUTTON --- */}
          {isMobile && (
            <>
              <button
                onClick={() => setShowMobileFilters(true)}
                className="fixed z-50 bottom-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-[#1a1f2e] font-bold px-7 py-3 rounded-full shadow-lg flex items-center gap-2"
              >
                <Filter className="w-5 h-5" />
                Filtrar
                {filtersCount > 0 && (
                  <span className="ml-2 bg-[#1a1f2e] text-yellow-300 text-xs rounded-full px-2 py-0.5">{filtersCount}</span>
                )}
              </button>

              {/* --- MOBILE FILTER SHEET --- */}
              {showMobileFilters && (
                <div className="fixed inset-0 z-50 pt-20 bg-black/60 flex">
                  <div className="bg-[#191d2c] w-full h-full overflow-y-auto p-6 relative animate-slide-in-up">
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="absolute top-3 right-4 text-yellow-400 text-2xl font-bold"
                      aria-label="Cerrar filtros"
                    >
                      ×
                    </button>
                    <h2 className="text-yellow-100 text-xl font-bold mb-4 flex items-center gap-2">
                      <Filter /> Filtros
                    </h2>
                    <div className="flex flex-col gap-4">
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400" />
                        <input
                          type="text"
                          value={search}
                          onChange={e => handleFilterChange("zone", e.target.value)}
                          placeholder="Buscar por nombre o zona..."
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/20 bg-white/10 text-yellow-100 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 focus:bg-white/15 transition-all placeholder:text-white/50"
                        />
                      </div>
                      <div className="relative">
                        <select
                          value={filterLocation}
                          onChange={e => handleFilterChange("zone", e.target.value)}
                          className="appearance-none w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-yellow-100 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 focus:bg-white/15 transition-all pr-10"
                        >
                          {locations.map((loc) => (
                            <option key={loc} value={loc} className="bg-[#1a1f2e] text-yellow-100">{loc}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-yellow-400" size={18} />
                      </div>
                      <div className="relative">
                        <select
                          value={filterType}
                          onChange={e => handleFilterChange("type", e.target.value)}
                          className="appearance-none w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-yellow-100 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 focus:bg-white/15 transition-all pr-10"
                        >
                          {types.map((type) => (
                            <option key={type} value={type} className="bg-[#1a1f2e] text-yellow-100">{type}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-yellow-400" size={18} />
                      </div>
                      <div className="relative">
                        <select
                          value={filterOperation}
                          onChange={e => handleFilterChange("operation", e.target.value)}
                          className="appearance-none w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-yellow-100 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 focus:bg-white/15 transition-all pr-10"
                        >
                          {operations.map((op) => (
                            <option key={op} value={op} className="bg-[#1a1f2e] text-yellow-100">{op}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-yellow-400" size={18} />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          min={0}
                          value={minPrice}
                          onChange={e => setMinPrice(e.target.value)}
                          placeholder="Precio mín."
                          className="px-3 py-3 rounded-xl border border-white/20 bg-white/10 text-yellow-100 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 focus:bg-white/15 transition-all placeholder:text-white/50"
                        />
                        <input
                          type="number"
                          min={0}
                          value={maxPrice}
                          onChange={e => setMaxPrice(e.target.value)}
                          placeholder="Precio máx."
                          className="px-3 py-3 rounded-xl border border-white/20 bg-white/10 text-yellow-100 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 focus:bg-white/15 transition-all placeholder:text-white/50"
                        />
                      </div>
                      <div className="relative">
                        <select
                          value={filterBedrooms}
                          onChange={e => setFilterBedrooms(e.target.value)}
                          className="appearance-none w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-yellow-100 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 focus:bg-white/15 transition-all pr-10"
                        >
                          {bedrooms.map((n) => (
                            <option key={n} value={n} className="bg-[#1a1f2e] text-yellow-100">{n} {n !== "Cualquiera" ? "hab" : ""}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-yellow-400" size={18} />
                      </div>
                      <div className="relative">
                        <select
                          value={filterBathrooms}
                          onChange={e => setFilterBathrooms(e.target.value)}
                          className="appearance-none w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-yellow-100 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 focus:bg-white/15 transition-all pr-10"
                        >
                          {bathrooms.map((n) => (
                            <option key={n} value={n} className="bg-[#1a1f2e] text-yellow-100">{n} {n !== "Cualquiera" ? "baños" : ""}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-yellow-400" size={18} />
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-yellow-200 font-medium text-sm">Ordenar por:</span>
                        <select
                          value={sortBy}
                          onChange={e => setSortBy(e.target.value)}
                          className="appearance-none px-3 py-2 rounded-lg border border-white/20 bg-white/10 text-yellow-100 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 focus:bg-white/15 transition-all pr-8 text-sm"
                        >
                          <option value="price-desc" className="bg-[#1a1f2e] text-yellow-100">Precio (mayor a menor)</option>
                          <option value="price-asc" className="bg-[#1a1f2e] text-yellow-100">Precio (menor a mayor)</option>
                          <option value="rating" className="bg-[#1a1f2e] text-yellow-100">Mejor valoradas</option>
                          <option value="area" className="bg-[#1a1f2e] text-yellow-100">Mayor superficie</option>
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="mt-6 w-full bg-gradient-to-r from-yellow-400 to-yellow-300 text-[#1a1f2e] font-bold py-3 rounded-xl shadow-lg hover:from-yellow-300 hover:to-yellow-200 transition-all"
                    >
                      Aplicar filtros
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
          {/* --- DESKTOP FILTERS --- */}
          {!isMobile && (
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="bg-white/8 backdrop-blur-md border border-white/15 rounded-2xl p-6 shadow-2xl max-w-6xl mx-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-8 gap-4 mb-4">
                {/* ... Los filtros desktop iguales ... */}
                <div className="relative md:col-span-2">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={e => handleFilterChange("zone", e.target.value)}
                    placeholder="Buscar por nombre o zona..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/20 bg-white/10 text-yellow-100 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 focus:bg-white/15 transition-all placeholder:text-white/50"
                  />
                </div>
                <div className="relative">
                  <select
                    value={filterLocation}
                    onChange={e => handleFilterChange("zone", e.target.value)}
                    className="appearance-none w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-yellow-100 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 focus:bg-white/15 transition-all pr-10"
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc} className="bg-[#1a1f2e] text-yellow-100">{loc}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-yellow-400" size={18} />
                </div>
                <div className="relative">
                  <select
                    value={filterType}
                    onChange={e => handleFilterChange("type", e.target.value)}
                    className="appearance-none w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-yellow-100 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 focus:bg-white/15 transition-all pr-10"
                  >
                    {types.map((type) => (
                      <option key={type} value={type} className="bg-[#1a1f2e] text-yellow-100">{type}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-yellow-400" size={18} />
                </div>
                <div className="relative">
                  <select
                    value={filterOperation}
                    onChange={e => handleFilterChange("operation", e.target.value)}
                    className="appearance-none w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-yellow-100 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 focus:bg-white/15 transition-all pr-10"
                  >
                    {operations.map((op) => (
                      <option key={op} value={op} className="bg-[#1a1f2e] text-yellow-100">{op}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-yellow-400" size={18} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min={0}
                    value={minPrice}
                    onChange={e => setMinPrice(e.target.value)}
                    placeholder="Precio mín."
                    className="px-3 py-3 rounded-xl border border-white/20 bg-white/10 text-yellow-100 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 focus:bg-white/15 transition-all placeholder:text-white/50"
                  />
                  <input
                    type="number"
                    min={0}
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                    placeholder="Precio máx."
                    className="px-3 py-3 rounded-xl border border-white/20 bg-white/10 text-yellow-100 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 focus:bg-white/15 transition-all placeholder:text-white/50"
                  />
                </div>
                <div className="relative">
                  <select
                    value={filterBedrooms}
                    onChange={e => setFilterBedrooms(e.target.value)}
                    className="appearance-none w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-yellow-100 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 focus:bg-white/15 transition-all pr-10"
                  >
                    {bedrooms.map((n) => (
                      <option key={n} value={n} className="bg-[#1a1f2e] text-yellow-100">{n} {n !== "Cualquiera" ? "hab" : ""}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-yellow-400" size={18} />
                </div>
                <div className="relative">
                  <select
                    value={filterBathrooms}
                    onChange={e => setFilterBathrooms(e.target.value)}
                    className="appearance-none w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-yellow-100 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 focus:bg-white/15 transition-all pr-10"
                  >
                    {bathrooms.map((n) => (
                      <option key={n} value={n} className="bg-[#1a1f2e] text-yellow-100">{n} {n !== "Cualquiera" ? "baños" : ""}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-yellow-400" size={18} />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <span className="text-yellow-200 font-medium text-sm">Ordenar por:</span>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="appearance-none px-3 py-2 rounded-lg border border-white/20 bg-white/10 text-yellow-100 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 focus:bg-white/15 transition-all pr-8 text-sm"
                  >
                    <option value="price-desc" className="bg-[#1a1f2e] text-yellow-100">Precio (mayor a menor)</option>
                    <option value="price-asc" className="bg-[#1a1f2e] text-yellow-100">Precio (menor a mayor)</option>
                    <option value="rating" className="bg-[#1a1f2e] text-yellow-100">Mejor valoradas</option>
                    <option value="area" className="bg-[#1a1f2e] text-yellow-100">Mayor superficie</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-200 font-medium text-sm mr-2">Vista:</span>
                  {SIZE_OPTIONS.map(opt => (
                    <button
                      key={opt.key}
                      className={`flex items-center gap-1 rounded-lg px-3 py-2 font-medium transition border text-sm ${
                        cardSize === opt.key
                          ? "bg-gradient-to-r from-yellow-400 to-yellow-300 text-[#1a1f2e] border-yellow-300 shadow-lg"
                          : "bg-white/10 text-yellow-100 border-white/20 hover:bg-yellow-400/20"
                      }`}
                      onClick={() => setCardSize(opt.key)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      {/* --- MOBILE --- */}
      {isMobile && (
        <div className="max-w-4xl mx-auto flex flex-col gap-2 mb-4 px-2 mt-2">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                className={`flex items-center gap-1 rounded-lg px-3 py-2 font-medium transition border text-sm ${
                  mobileView === "card"
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-300 text-[#1a1f2e] border-yellow-300 shadow-lg"
                    : "bg-white/10 text-yellow-100 border-white/20 hover:bg-yellow-400/20"
                }`}
                onClick={() => setMobileView("card")}
              >
                <LayoutGrid size={16}/> Cards
              </button>
              <button
                className={`flex items-center gap-1 rounded-lg px-3 py-2 font-medium transition border text-sm ${
                  mobileView === "list"
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-300 text-[#1a1f2e] border-yellow-300 shadow-lg"
                    : "bg-white/10 text-yellow-100 border-white/20 hover:bg-yellow-400/20"
                }`}
                onClick={() => setMobileView("list")}
              >
                <List size={16}/> Lista
              </button>
            </div>
            <div className="text-yellow-200 text-sm flex flex-col items-end">
              <span>
                <b>{filteredProperties.length}</b> resultado{filteredProperties.length !== 1 ? 's' : ''}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
                Destacadas: {filteredProperties.filter(isFeatured).length}
              </span>
            </div>
          </div>
        </div>
      )}
      {/* Resultados */}
      <div className="px-4 pb-16">
        {!isMobile && (
          <div className="max-w-7xl mx-auto mb-8">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-6 py-4">
              <div className="flex justify-between items-center">
                <div className="text-yellow-100">
                  <span className="font-bold text-lg">{filteredProperties.length}</span>
                  <span className="text-yellow-100/80 ml-2">propiedades encontradas</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-yellow-100/70">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    Propiedades destacadas: {filteredProperties.filter(isFeatured).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        {loading ? (
          <div className="text-center text-yellow-100/70 py-20 text-xl">Cargando propiedades…</div>
        ) : isMobile && mobileView === "list" ? (
          <div className="max-w-4xl mx-auto flex flex-col gap-4">
            {filteredProperties.length === 0 && (
              <div className="text-center text-yellow-100/70 py-20 text-xl">
                <Filter className="w-16 h-16 mx-auto mb-4 text-yellow-400/50" />
                <div className="font-semibold mb-2">No se encontraron propiedades</div>
                <div className="text-base">Intenta ajustar los filtros de búsqueda</div>
              </div>
            )}
            {filteredProperties.map((prop, index) => {
              const agent = getAgent(prop);
              return (
                <motion.div
                  key={prop.id}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex bg-white/8 backdrop-blur-sm border border-white/15 rounded-2xl  overflow-hidden shadow-lg hover:shadow-2xl hover:border-yellow-400/30 transition-all duration-300 relative group"
                >
                  {/* Imagen */}
                  <div className="min-w-[120px] w-32 h-32 relative">
                    <img
                      src={getImage(prop)}
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {isFeatured(prop) && (
                      <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-yellow-300 text-[#1a1f2e] px-2 py-1 text-xs font-bold rounded-full shadow-lg">
                        DESTACADA
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <h2 className="font-bold text-yellow-100 text-lg mb-1 line-clamp-2">{prop.title}</h2>
                      <div className="flex items-center gap-1 text-yellow-100/80 mb-2 text-sm">
                        <MapPin size={14} className="text-yellow-400" />
                        <span>{prop.location}</span>
                      </div>
                      {/* Agente */}
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={agent.photo}
                          alt={agent.name}
                          className="w-7 h-7 rounded-full border-2 border-yellow-300 object-cover"
                          onError={e => { e.target.src = DEFAULT_AGENT.photo; }}
                        />
                        <span className="text-yellow-200 text-xs">{agent.name}</span>
                      </div>
                      {/* Wishlist/Consultas */}
                      <div className="flex gap-3 text-yellow-200/70 text-xs mb-2">
                        <span className="flex items-center gap-1"><Heart size={13} className="text-pink-400" /> {prop.wishlistCount || 0} wishlist</span>
                        <span className="flex items-center gap-1"><UserCircle size={13} className="text-blue-400" /> {prop.consultCount || 0} consultas</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-yellow-100/80 text-sm mb-3">
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
                    <div className="flex justify-between items-center">
                      <div className="text-yellow-300 font-bold text-lg">
                        ${Number(prop.price).toLocaleString()}
                      </div>
                      <Link to={`/propiedades/${prop.id}`}>
                        <button className="bg-gradient-to-r from-yellow-400 to-yellow-300 text-[#1a1f2e] font-bold py-2 px-4 rounded-lg shadow-lg hover:from-yellow-300 hover:to-yellow-200 transition-all text-sm">
                          Ver detalles
                        </button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className={`max-w-7xl mx-auto grid ${size.cols} gap-6`}>
            {filteredProperties.length === 0 && (
              <div className="col-span-full text-center text-yellow-100/70 py-20">
                <Filter className="w-16 h-16 mx-auto mb-4 text-yellow-400/50" />
                <div className="text-2xl font-semibold mb-2">No se encontraron propiedades</div>
                <div className="text-lg">Intenta ajustar los filtros de búsqueda</div>
              </div>
            )}
            {filteredProperties.map((prop, index) => {
              const agent = getAgent(prop);
              return (
                <motion.div
                  key={prop.id}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white/8 backdrop-blur-sm border border-white/15 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-yellow-400/30 transition-all duration-500 relative group flex flex-col hover:scale-105`}
                >
                  {/* Badges */}
                  <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                    {isFeatured(prop) && (
                      <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 text-[#1a1f2e] px-3 py-1 text-xs font-bold rounded-full shadow-lg">
                        DESTACADA
                      </div>
                    )}
                  </div>
                  {/* Imagen */}
                  <div className={`relative ${size.img} overflow-hidden`}>
                    <img
                      src={getImage(prop)}
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <button
                      className={`absolute bottom-2 right-2 p-2 rounded-full shadow-lg transition-colors duration-300 z-10
                        ${isInWishlist(prop.id)
                          ? "bg-pink-500 text-white"
                          : "bg-[#1a1f2e]/70 text-yellow-100 hover:bg-yellow-400/80 hover:text-[#1a1f2e]"}
                      `}
                      onClick={() =>
                        isInWishlist(prop.id)
                          ? dispatch(remove(prop.id))
                          : dispatch(add({
                              id: prop.id,
                              title: prop.title,
                              image: getImage(prop),
                              location: prop.location,
                              price: prop.price,
                              bedrooms: prop.bedrooms,
                              bathrooms: prop.bathrooms,
                              area: prop.area,
                            }))
                      }
                      aria-label={isInWishlist(prop.id) ? "Quitar de wishlist" : "Agregar a wishlist"}
                    >
                      <Heart size={20} fill={isInWishlist(prop.id) ? "#fff" : "none"} />
                    </button>
                  </div>
                  {/* Info */}
                  <div className={`${size.padding} flex-1 flex flex-col`}>
                    <h2 className={`font-bold text-yellow-100 mb-2 line-clamp-2 ${size.font}`}>{prop.title}</h2>
                    <div className="flex items-center gap-2 text-yellow-100/80 mb-1">
                      <MapPin size={16} className="text-yellow-400 flex-shrink-0" />
                      <span className="truncate">{prop.location}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <img
                        src={agent.photo}
                        alt={agent.name}
                        className="w-7 h-7 rounded-full border-2 border-yellow-300 object-cover"
                        onError={e => { e.target.src = DEFAULT_AGENT.photo; }}
                      />
                      <span className="text-yellow-200 text-xs">{agent.name}</span>
                    </div>
                    <div className="flex gap-3 text-yellow-200/70 text-xs mb-3">
                      <span className="flex items-center gap-1"><Heart size={13} className="text-pink-400" /> {prop.wishlistCount || 0} wishlist</span>
                      <span className="flex items-center gap-1"><UserCircle size={13} className="text-blue-400" /> {prop.consultCount || 0} consultas</span>
                    </div>
                    <div className="flex items-center gap-4 mb-4 text-yellow-100/80 text-sm">
                      <span className="flex items-center gap-1">
                        <BedDouble size={15} className="text-yellow-400" /> {prop.bedrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath size={15} className="text-yellow-400" /> {prop.bathrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        <Ruler size={15} className="text-yellow-400" /> {prop.area} m²
                      </span>
                    </div>
                    <div className="text-yellow-300 font-bold text-xl mt-auto mb-4">
                      ${Number(prop.price).toLocaleString()}
                    </div>
                  </div>
                  <div className={`${size.padding} pt-0`}>
                    <Link to={`/propiedades/${prop.id}`}>
                      <button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-300 text-[#1a1f2e] font-bold py-3 rounded-xl shadow-lg hover:from-yellow-300 hover:to-yellow-200 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
                        Ver detalles
                      </button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
      <div className="bg-[#0f1419] border-t border-white/10 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {properties.length}
              </div>
              <div className="text-yellow-100/80">Propiedades Disponibles</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {filteredProperties.filter(isFeatured).length}
              </div>
              <div className="text-yellow-100/80">Propiedades Destacadas</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {zonesCount}
              </div>
              <div className="text-yellow-100/80">Zonas Disponibles</div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}