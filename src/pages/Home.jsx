import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { collection, getDocs, query, where, orderBy, limit as fbLimit } from "firebase/firestore";
import { db } from "../services/firestore"; 
import { Search, MapPin, TrendingUp, Star, Play, ChevronRight, Award, Users, Building, Shield, ArrowRight, Quote, ChevronDown } from 'lucide-react';

function RefinedRealEstateLanding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(true);

  // Search form state
  const [searchZone, setSearchZone] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchPrice, setSearchPrice] = useState("");

  const navigate = useNavigate();

  // For debounce effect (if needed in future)
  const searchZoneRef = useRef();

  const heroImages = [
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"
  ];

  const features = [
    {
      icon: <Search className="w-8 h-8 text-[#1a1f2e]" />,
      title: "Búsqueda Personalizada",
      description: "Encuentra la propiedad perfecta según tus necesidades específicas con nuestro sistema de filtros avanzados.",
      highlight: "Más de 500 propiedades"
    },
    {
      icon: <MapPin className="w-8 h-8 text-[#1a1f2e]" />,
      title: "Ubicaciones Premium",
      description: "Las mejores ubicaciones en las zonas más exclusivas de la ciudad con análisis de valorización detallado.",
      highlight: "15 zonas exclusivas"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-[#1a1f2e]" />,
      title: "Inversión Segura",
      description: "Propiedades con alto potencial de valorización y rentabilidad respaldadas por estudios de mercado.",
      highlight: "ROI promedio 18%"
    }
  ];

  const clients = [
    {
      name: "María González",
      role: "Empresaria",
      testimonial: "Encontraron exactamente lo que buscaba. El proceso fue impecable desde el primer día hasta la entrega de llaves.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
      property: "Penthouse en Pocitos",
      rating: 5
    },
    {
      name: "Carlos Rodríguez",
      role: "Inversionista",
      testimonial: "Su expertise en el mercado inmobiliario me ayudó a tomar la mejor decisión de inversión. Resultados excepcionales.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      property: "Edificio comercial",
      rating: 5
    },
    {
      name: "Ana Martínez",
      role: "Familia",
      testimonial: "Profesionales de primer nivel. Nos acompañaron en cada paso hasta encontrar nuestro hogar soñado.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      property: "Casa en Carrasco",
      rating: 5
    }
  ];

  const stats = [
    { icon: <Building className="w-6 h-6" />, number: "1,200+", label: "Propiedades Vendidas" },
    { icon: <Users className="w-6 h-6" />, number: "850+", label: "Familias Satisfechas" },
    { icon: <Award className="w-6 h-6" />, number: "15+", label: "Años de Experiencia" },
    { icon: <Shield className="w-6 h-6" />, number: "98%", label: "Satisfacción Cliente" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Fetch featured properties from Firebase
  useEffect(() => {
    setLoadingProperties(true);
    const fetchFeatured = async () => {
      try {
        const q = query(
          collection(db, "properties"),
          where("featured", "==", true),
          orderBy("price", "desc"),
          fbLimit(3)
        );
        const snap = await getDocs(q);
        setFeaturedProperties(
          snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }))
        );
      } catch (err) {
        setFeaturedProperties([]);
      } finally {
        setLoadingProperties(false);
      }
    };
    fetchFeatured();
  }, []);

  // Intersection animations for sections
  const handleIntersection = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
      }
    });
  };

  useEffect(() => {
    const observer = new window.IntersectionObserver(handleIntersection, {
      threshold: 0.1
    });

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Search bar handlers
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchZone) params.append("zone", searchZone);
    if (searchType) params.append("type", searchType);
    if (searchPrice) params.append("price", searchPrice);
    navigate(`/propiedades?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#1a1f2e]  relative">
      {/* Enhanced Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-4000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`Luxury Home ${index + 1}`}
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1f2e]/95 via-[#1e2338]/90 to-[#2a1f1a]/80 opacity-72 " />
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-yellow-400/15 via-yellow-200/8 to-transparent rounded-full blur-3xl opacity-60 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-yellow-500/12 to-transparent rounded-full blur-3xl opacity-40 pointer-events-none" />
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-yellow-300/30 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 4}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="relativ z-10 max-w-6xl mx-auto text-center px-4">
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-yellow-100"
          >
            <div className="inline-flex items-center bg-yellow-400/12 backdrop-blur-sm rounded-full px-6 py-3 border border-yellow-400/25 mb-8">
              <Star className="w-4 h-4 text-yellow-400 mr-2" />
              <span className="text-yellow-300 text-sm font-medium">Propiedades Exclusivas de Lujo</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-none">
              Encuentra tu
              <span className="block">
                hogar ideal
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 font-light max-w-3xl mx-auto text-yellow-200/90 leading-relaxed">
              Propiedades exclusivas para quienes buscan lo mejor.
              <br />
              <span className="text-yellow-300 hidden md:block font-medium">Vive el lujo, invierte seguro.</span>
            </p>

            {/* Search Bar Integrado */}
            <motion.form
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="max-w-4xl mx-auto mb-10"
              onSubmit={handleSearchSubmit}
            >
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Zona o ciudad"
                      value={searchZone}
                      onChange={e => setSearchZone(e.target.value)}
                      className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/70 focus:bg-white/30 focus:border-yellow-400/50 focus:outline-none transition-all duration-300"
                      ref={searchZoneRef}
                    />
                  </div>
                  
                  <div className="relative">
                    <select
                      value={searchType}
                      onChange={e => setSearchType(e.target.value)}
                      className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white focus:bg-white/30 focus:border-yellow-400/50 focus:outline-none transition-all duration-300 appearance-none"
                    >
                      <option value="">Tipo</option>
                      <option value="Casa">Casa</option>
                      <option value="Apartamento">Apartamento</option>
                      <option value="Campo">Campo</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70 pointer-events-none" />
                  </div>
                  
                  <div className="relative">
                    <select
                      value={searchPrice}
                      onChange={e => setSearchPrice(e.target.value)}
                      className="w-full bg-white/20  border border-white/30 rounded-xl px-4 py-3 text-white focus:bg-white/30 focus:border-yellow-400/50 focus:outline-none transition-all duration-300 appearance-none"
                    >
                      <option value="">Precio</option>
                      <option value="0-100000">$0 - $100,000</option>
                      <option value="100000-500000">$100,000 - $500,000</option>
                      <option value="500000+">$500,000+</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70 pointer-events-none" />
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="bg-gradient-to-r from-yellow-400 to-yellow-300 text-[#1a1f2e] px-6 py-3 rounded-xl font-bold hover:from-yellow-300 hover:to-yellow-200 transition-all duration-300 flex items-center justify-center shadow-lg"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Buscar
                  </motion.button>
                </div>
              </div>
            </motion.form>

            <div className="hidden md:flex flex-col md:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/propiedades")}
                className="group bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-200 text-[#1a1f2e] px-10 py-4 rounded-xl text-xl font-bold shadow-2xl hover:shadow-yellow-400/20 transition-all duration-300 flex items-center"
              >
                Explorar Propiedades
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="group bg-transparent border-2 border-yellow-400/50 text-yellow-100 px-10 py-4 rounded-xl text-xl font-medium hover:bg-yellow-400/10 backdrop-blur-sm transition-all duration-300 flex items-center"
              >
                <Play className="w-5 h-5 mr-2" />
                Ver Presentación
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-yellow-400 w-8' : 'bg-yellow-400/40'
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Stats Section - Color consistente */}
      <section className="relative py-16 bg-gradient-to-b from-[#1a1f2e] to-[#1e2338] border-t border-yellow-600/15">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-gradient-to-br from-yellow-600/15 to-yellow-400/15 rounded-xl border border-yellow-400/20 group-hover:scale-110 transition-transform duration-300">
                    <div className="text-yellow-400">{stat.icon}</div>
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-yellow-100 mb-2">{stat.number}</div>
                <div className="text-yellow-300/80 text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section - Degradado más suave */}
      <section className="relative py-20 bg-gradient-to-b from-[#1e2338] to-[#212544]">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            id="features"
            data-animate
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-yellow-100 mb-6 tracking-tight">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-xl text-yellow-100/80 max-w-3xl mx-auto leading-relaxed">
              Servicio integral y personalizado para encontrar la propiedad de tus sueños
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="group bg-[#1a1f2e]/70 border border-yellow-600/20 p-10 rounded-2xl shadow-xl hover:shadow-2xl hover:border-yellow-400/30 transition-all duration-500 text-center hover:scale-105"
              >
                <div className="mx-auto mb-6 flex items-center justify-center w-20 h-20 rounded-xl bg-gradient-to-br from-yellow-600 via-yellow-400 to-yellow-200 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-yellow-100 mb-4">{feature.title}</h3>
                <p className="text-yellow-100/80 mb-4 leading-relaxed">{feature.description}</p>
                <div className="inline-block bg-yellow-400/20 text-yellow-300 px-4 py-2 rounded-full text-sm font-semibold border border-yellow-400/20">
                  {feature.highlight}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="relative py-20 bg-gradient-to-b from-[#212544] to-[#1e2338]">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-yellow-100 mb-6">Propiedades Destacadas</h2>
            <p className="text-xl text-yellow-100/80 max-w-2xl mx-auto">
              Descubre nuestra selección de propiedades exclusivas
            </p>
          </motion.div>

          {loadingProperties ? (
            <div className="text-yellow-100/70 text-center text-xl py-16">Cargando propiedades destacadas…</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="group bg-[#1a1f2e]/60 rounded-2xl overflow-hidden border border-yellow-600/20 hover:border-yellow-400/40 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105"
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={Array.isArray(property.images) && property.images.length > 0 ? property.images[0] : property.image || "/img/no-image.jpg"} 
                      alt={property.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {property.featured && (
                      <div className="absolute top-4 left-4 bg-yellow-400 text-[#1a1f2e] px-3 py-1 rounded-full text-sm font-bold">
                        Destacada
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-yellow-100 mb-2">{property.title}</h3>
                    <p className="text-yellow-300/80 mb-4 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {property.location}
                    </p>
                    
                    <div className="flex justify-between items-center text-yellow-100/70 text-sm mb-4">
                      <span>{property.bedrooms} hab</span>
                      <span>{property.bathrooms} baños</span>
                      <span>{property.area} m²</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-2xl font-bold text-yellow-300">
                        ${Number(property.price).toLocaleString()}
                      </div>
                      <button
                        className="text-yellow-400 hover:text-yellow-300 transition-colors"
                        onClick={() => navigate(`/propiedades/${property.id}`)}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Nuestros Clientes Section */}
      <section className="relative py-20 bg-gradient-to-b from-[#1e2338] to-[#212544] border-t border-yellow-600/15">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-yellow-100 mb-6">Nuestros Clientes</h2>
            <p className="text-xl text-yellow-100/80 max-w-3xl mx-auto">
              Testimonios reales de familias que confiaron en nosotros para encontrar su hogar perfecto
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {clients.map((client, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-[#1a1f2e]/70 border border-yellow-600/20 rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:border-yellow-400/30 transition-all duration-500 relative"
              >
                <Quote className="absolute top-4 right-4 w-8 h-8 text-yellow-400/30" />
                
                <div className="flex items-center mb-6">
                  <img 
                    src={client.image} 
                    alt={client.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-yellow-400/20"
                  />
                  <div className="ml-4">
                    <h4 className="text-yellow-100 font-bold text-lg">{client.name}</h4>
                    <p className="text-yellow-300/80 text-sm">{client.role}</p>
                    <p className="text-yellow-400/80 text-xs">{client.property}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(client.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-yellow-100/90 italic leading-relaxed">
                  "{client.testimonial}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative py-20 bg-gradient-to-tr from-yellow-500 via-yellow-400 to-yellow-200 overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-600/20 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-[#1a1f2e] mb-6 tracking-tight">
              ¿Listo para encontrar tu próxima propiedad?
            </h2>
            <p className="text-2xl text-[#1a1f2e]/70 mb-10 max-w-3xl mx-auto leading-relaxed">
              Nuestros asesores expertos están disponibles para ayudarte en cada paso del proceso
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#1a1f2e] text-yellow-100 px-10 py-4 rounded-xl text-xl font-bold hover:bg-[#212544] transition-all duration-300 shadow-2xl flex items-center justify-center"
              >
                Contactar ahora
                <ChevronRight className="w-5 h-5 ml-2" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white/20 backdrop-blur-sm text-[#1a1f2e] px-10 py-4 rounded-xl text-xl font-bold border-2 border-[#1a1f2e]/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center"
              >
                Agendar cita
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}

export default RefinedRealEstateLanding;