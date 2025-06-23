import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, BedDouble, Bath, Ruler, Heart, ChevronDown, LayoutGrid, Square, List, Filter, Star, TrendingUp } from "lucide-react";

// Mock de propiedades mejorado
const mockProperties = [
  {
    id: 1,
    title: "Apartamento con Vista al Mar",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    location: "Punta del Este",
    price: 850000,
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    featured: true,
    rating: 4.8,
    status: "Disponible"
  },
  {
    id: 2,
    title: "Casa Moderna en Barrio Privado",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
    location: "La Barra",
    price: 1250000,
    bedrooms: 4,
    bathrooms: 4,
    area: 320,
    featured: false,
    rating: 4.9,
    status: "Nuevo"
  },
  {
    id: 3,
    title: "Penthouse Exclusivo",
    image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=800&q=80",
    location: "Punta Ballena",
    price: 2100000,
    bedrooms: 5,
    bathrooms: 5,
    area: 380,
    featured: true,
    rating: 5.0,
    status: "Premium"
  },
  {
    id: 4,
    title: "Residencia Céntrica Reformada",
    image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=800&q=80",
    location: "Punta del Este",
    price: 620000,
    bedrooms: 2,
    bathrooms: 2,
    area: 110,
    featured: false,
    rating: 4.6,
    status: "Disponible"
  },
  {
    id: 5,
    title: "Casa Familiar en Los Pinos",
    image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80",
    location: "La Barra",
    price: 450000,
    bedrooms: 3,
    bathrooms: 2,
    area: 145,
    featured: false,
    rating: 4.4,
    status: "Oportunidad"
  },
  {
    id: 6,
    title: "Loft Minimalista con Terraza",
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80",
    location: "Punta Ballena",
    price: 780000,
    bedrooms: 2,
    bathrooms: 1,
    area: 90,
    featured: false,
    rating: 4.7,
    status: "Disponible"
  }
];

// Opciones de filtro
const locations = ["Todas", "Punta del Este", "La Barra", "Punta Ballena"];
const bedrooms = ["Cualquiera", 1, 2, 3, 4, 5];
const bathrooms = ["Cualquiera", 1, 2, 3, 4, 5];

// Opciones de tamaño de card/vista
const SIZE_OPTIONS = [
  { key: "compact", label: <><Square size={18}/> Compacta</>, cols: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5", img: "h-32", font: "text-lg", padding: "p-3" },
  { key: "medium", label: <><LayoutGrid size={18}/> Media</>, cols: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4", img: "h-44", font: "text-xl", padding: "p-5" },
  { key: "large", label: <><List size={18}/> Grande</>, cols: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3", img: "h-56", font: "text-2xl", padding: "p-7" },
];

export default function PropertyExplorer() {
  const [search, setSearch] = useState("");
  const [filterLocation, setFilterLocation] = useState("Todas");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filterBedrooms, setFilterBedrooms] = useState("Cualquiera");
  const [filterBathrooms, setFilterBathrooms] = useState("Cualquiera");
  const [cardSize, setCardSize] = useState("medium");
  const [mobileView, setMobileView] = useState("card");
  const [sortBy, setSortBy] = useState("price-desc");

  const size = SIZE_OPTIONS.find(s => s.key === cardSize);

  // Filtro avanzado
  const filteredProperties = mockProperties.filter((prop) => {
    const matchesSearch =
      prop.title.toLowerCase().includes(search.toLowerCase()) ||
      prop.location.toLowerCase().includes(search.toLowerCase());

    const matchesLocation =
      filterLocation === "Todas" || prop.location === filterLocation;

    const matchesBedrooms =
      filterBedrooms === "Cualquiera" || prop.bedrooms === Number(filterBedrooms);

    const matchesBathrooms =
      filterBathrooms === "Cualquiera" || prop.bathrooms === Number(filterBathrooms);

    const matchesMinPrice =
      minPrice === "" || prop.price >= Number(minPrice);

    const matchesMaxPrice =
      maxPrice === "" || prop.price <= Number(maxPrice);

    return (
      matchesSearch &&
      matchesLocation &&
      matchesBedrooms &&
      matchesBathrooms &&
      matchesMinPrice &&
      matchesMaxPrice
    );
  }).sort((a, b) => {
    switch (sortBy) {
      case "price-asc": return a.price - b.price;
      case "price-desc": return b.price - a.price;
      case "rating": return b.rating - a.rating;
      case "area": return b.area - a.area;
      default: return 0;
    }
  });

  // Detect mobile (simple)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1f2e] via-[#1e2338] to-[#212544]">
      {/* Hero Section mejorado */}
      <div className="relative pt-16 pb-12 px-4 overflow-hidden">
        {/* Efectos de fondo elegantes */}
        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-yellow-400/12 via-yellow-200/6 to-transparent rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-yellow-500/8 to-transparent rounded-full blur-3xl opacity-40 pointer-events-none" />
        
        {/* Partículas flotantes */}
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
            {/* Badge */}
            <div className="inline-flex items-center bg-yellow-400/12 backdrop-blur-sm rounded-full px-6 py-3 border border-yellow-400/25 mb-6">
              <TrendingUp className="w-4 h-4 text-yellow-400 mr-2" />
              <span className="text-yellow-300 text-sm font-medium">Explora {mockProperties.length} Propiedades Exclusivas</span>
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
          
          {/* Barra de filtros mejorada */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="bg-white/8 backdrop-blur-md border border-white/15 rounded-2xl p-6 shadow-2xl max-w-6xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
              {/* Buscador mejorado */}
              <div className="relative md:col-span-2">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar por nombre o zona..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/20 bg-white/10 text-yellow-100 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 focus:bg-white/15 transition-all placeholder:text-white/50"
                />
              </div>
              
              {/* Filtro por zona */}
              <div className="relative">
                <select
                  value={filterLocation}
                  onChange={e => setFilterLocation(e.target.value)}
                  className="appearance-none w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-yellow-100 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 focus:bg-white/15 transition-all pr-10"
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc} className="bg-[#1a1f2e] text-yellow-100">{loc}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-yellow-400" size={18} />
              </div>
              
              {/* Filtros de precio */}
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
              
              {/* Dormitorios */}
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
              
              {/* Baños */}
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
            
            {/* Ordenamiento y vista */}
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
                {isMobile ? (
                  <>
                    <span className="text-yellow-200 font-medium text-sm mr-2">Vista:</span>
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
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Resultados */}
      <div className="px-4 pb-16">
        {/* Stats bar */}
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
                  Propiedades destacadas: {filteredProperties.filter(p => p.featured).length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Grid/lista de propiedades */}
        {isMobile && mobileView === "list" ? (
          <div className="max-w-4xl mx-auto flex flex-col gap-4">
            {filteredProperties.length === 0 && (
              <div className="text-center text-yellow-100/70 py-20 text-xl">
                <Filter className="w-16 h-16 mx-auto mb-4 text-yellow-400/50" />
                <div className="font-semibold mb-2">No se encontraron propiedades</div>
                <div className="text-base">Intenta ajustar los filtros de búsqueda</div>
              </div>
            )}
            {filteredProperties.map((prop, index) => (
              <motion.div
                key={prop.id}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex bg-white/8 backdrop-blur-sm border border-white/15 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-yellow-400/30 transition-all duration-300 relative group"
              >
                {/* Imagen */}
                <div className="min-w-[120px] w-32 h-32 relative">
                  <img
                    src={prop.image}
                    alt={prop.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {prop.featured && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-yellow-300 text-[#1a1f2e] px-2 py-1 text-xs font-bold rounded-full shadow-lg">
                      DESTACADA
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-[#1a1f2e]/70 text-yellow-300 px-2 py-1 text-xs font-semibold rounded-full border border-yellow-400/30">
                    {prop.status}
                  </div>
                  <button className="absolute bottom-2 right-2 bg-[#1a1f2e]/70 hover:bg-yellow-400/80 text-yellow-100 hover:text-[#1a1f2e] p-1.5 rounded-full transition-colors shadow-lg">
                    <Heart size={14} />
                  </button>
                </div>
                
                {/* Info */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h2 className="font-bold text-yellow-100 text-lg mb-1 line-clamp-2">{prop.title}</h2>
                    <div className="flex items-center gap-1 text-yellow-100/80 mb-2 text-sm">
                      <MapPin size={14} className="text-yellow-400" />
                      <span>{prop.location}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-yellow-300 text-sm font-medium">{prop.rating}</span>
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
                      ${prop.price.toLocaleString()}
                    </div>
                    <button className="bg-gradient-to-r from-yellow-400 to-yellow-300 text-[#1a1f2e] font-bold py-2 px-4 rounded-lg shadow-lg hover:from-yellow-300 hover:to-yellow-200 transition-all text-sm">
                      Ver detalles
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
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
            {filteredProperties.map((prop, index) => (
              <motion.div
                key={prop.id}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white/8 backdrop-blur-sm border border-white/15 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-yellow-400/30 transition-all duration-500 relative group flex flex-col hover:scale-105`}
              >
                {/* Status y badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                  {prop.featured && (
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 text-[#1a1f2e] px-3 py-1 text-xs font-bold rounded-full shadow-lg">
                      DESTACADA
                    </div>
                  )}
                  <div className="bg-[#1a1f2e]/70 backdrop-blur-sm text-yellow-300 px-3 py-1 text-xs font-semibold rounded-full border border-yellow-400/30">
                    {prop.status}
                  </div>
                </div>
                
                {/* Rating */}
                <div className="absolute top-3 right-3 z-10 bg-[#1a1f2e]/70 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-yellow-300 text-xs font-semibold">{prop.rating}</span>
                </div>
                
                {/* Imagen */}
                <div className={`relative ${size.img} overflow-hidden`}>
                  <img
                    src={prop.image}
                    alt={prop.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <button className="absolute bottom-3 right-3 bg-[#1a1f2e]/70 hover:bg-yellow-400/80 text-yellow-100 hover:text-[#1a1f2e] p-2 rounded-full transition-colors shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <Heart size={18} />
                  </button>
                </div>
                
                {/* Info */}
                <div className={`${size.padding} flex-1 flex flex-col`}>
                  <h2 className={`font-bold text-yellow-100 mb-2 line-clamp-2 ${size.font}`}>{prop.title}</h2>
                  <div className="flex items-center gap-2 text-yellow-100/80 mb-3">
                    <MapPin size={16} className="text-yellow-400 flex-shrink-0" />
                    <span className="truncate">{prop.location}</span>
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
                    ${prop.price.toLocaleString()}
                  </div>
                </div>
                
               {/* Botón */}
                <div className={`${size.padding} pt-0`}>
                  <button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-300 text-[#1a1f2e] font-bold py-3 rounded-xl shadow-lg hover:from-yellow-300 hover:to-yellow-200 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
                    Ver detalles
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer con estadísticas */}
      <div className="bg-[#0f1419] border-t border-white/10 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {mockProperties.length}
              </div>
              <div className="text-yellow-100/80">Propiedades Disponibles</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {mockProperties.filter(p => p.featured).length}
              </div>
              <div className="text-yellow-100/80">Propiedades Destacadas</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {locations.length - 1}
              </div>
              <div className="text-yellow-100/80">Zonas Disponibles</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {(mockProperties.reduce((acc, p) => acc + p.rating, 0) / mockProperties.length).toFixed(1)}
              </div>
              <div className="text-yellow-100/80">Valoración Promedio</div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}