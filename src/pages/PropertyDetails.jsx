import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin, BedDouble, Bath, Ruler, Heart, CheckCircle, Mail, Phone, Tag, Home, Building2, Trees, DollarSign, Calendar, Users
} from "lucide-react";

// Mock de propiedad principal (en producción puedes recibirlo por props o fetch)
const property = {
  id: 1,
  title: "Apartamento con Vista al Mar",
  images: [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=800&q=80"
  ],
  type: "Apartamento",
  operation: "Venta", // o "Alquiler"
  location: "Punta del Este, Uruguay",
  address: "Rambla Lorenzo Batlle Pacheco 1234",
  price: 850000,
  currency: "USD",
  bedrooms: 3,
  bathrooms: 2,
  area: 180,
  garage: true,
  floor: 9,
  year: 2022,
  orientation: "Este",
  expenses: 320, // solo si es alquiler
  petsAllowed: true,
  furnished: true,
  maxTenants: 6,
  featured: true,
  description: `Descubre este exclusivo apartamento con vistas panorámicas al mar en el corazón de Punta del Este. Espacios luminosos, acabados premium y amenities de lujo para vivir la experiencia costera definitiva.`,
  features: [
    "Terraza panorámica",
    "Piscina climatizada",
    "Gimnasio equipado",
    "Seguridad 24/7",
    "Garaje privado"
  ],
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3340.620435587828!2d-54.94559158481637!3d-34.96138948037386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95751b2e16c6b5cb%3A0x24f7c8be1d2a1d8f!2sPunta%20del%20Este%2C%20Departamento%20de%20Maldonado!5e0!3m2!1ses-419!2suy!4v1688570000000!5m2!1ses-419!2suy"
};

// Mock de propiedades similares
const similarProperties = [
  {
    id: 2,
    title: "Penthouse Exclusivo",
    image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=800&q=80",
    type: "Apartamento",
    operation: "Venta",
    location: "Punta del Este",
    price: 2100000,
    bedrooms: 5,
    bathrooms: 5,
    area: 380,
    featured: true
  },
  {
    id: 3,
    title: "Casa Moderna en Barrio Privado",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
    type: "Casa",
    operation: "Venta",
    location: "La Barra",
    price: 1250000,
    bedrooms: 4,
    bathrooms: 4,
    area: 320,
    featured: false
  },
  {
    id: 4,
    title: "Apartamento Familiar",
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80",
    type: "Apartamento",
    operation: "Alquiler",
    location: "Punta del Este",
    price: 2000,
    bedrooms: 2,
    bathrooms: 2,
    area: 110,
    featured: false
  }
];

function getTypeIcon(type) {
  if (type === "Casa") return <Home size={20} className="text-yellow-400" />;
  if (type === "Apartamento") return <Building2 size={20} className="text-yellow-400" />;
  if (type === "Campo") return <Trees size={20} className="text-yellow-400" />;
  return <Tag size={20} className="text-yellow-400" />;
}

export default function PropertyDetail() {
  const [mainImg, setMainImg] = useState(0);

  return (
    <div className="min-h-screen bg-[#181c2b] py-12 px-4">
      {/* Galería de imágenes */}
      <div className="max-w-6xl mx-auto mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 h-80 md:h-[420px] rounded-2xl overflow-hidden relative group">
            <img
              src={property.images[mainImg]}
              alt={property.title}
              className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
            />
            {/* Miniaturas */}
            {property.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 bg-[#181c2ba8] rounded-lg px-3 py-1">
                {property.images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`w-10 h-10 rounded-md overflow-hidden border-2 transition-all ${mainImg === idx ? "border-yellow-400" : "border-transparent opacity-75"}`}
                    onClick={() => setMainImg(idx)}
                    aria-label={`Vista ${idx + 1}`}
                  >
                    <img src={img} alt={`Vista ${idx + 1}`} className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            )}
            {property.featured && (
              <div className="absolute top-4 left-4 bg-gradient-to-tr from-yellow-400 to-yellow-300 text-[#181c2b] px-5 py-1 text-xs font-bold rounded-full shadow-lg z-10">
                DESTACADA
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4">
            {property.images.slice(1).map((img, idx) => (
              <button
                key={idx + 1}
                className={`h-36 rounded-2xl overflow-hidden border-2 transition-all ${mainImg === idx + 1 ? "border-yellow-400" : "border-transparent"}`}
                onClick={() => setMainImg(idx + 1)}
                aria-label={`Vista extra ${idx + 2}`}
              >
                <img
                  src={img}
                  alt={`Vista extra ${idx + 2}`}
                  className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Info principal */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 mb-14">
        <div className="md:col-span-2">
          <div className="flex items-center gap-4 mb-2">
            {getTypeIcon(property.type)}
            <h1 className="text-4xl font-bold text-yellow-100">{property.title}</h1>
            <span className="bg-gradient-to-tr from-yellow-400 to-yellow-300 text-[#181c2b] px-3 py-1 ml-2 rounded font-semibold text-sm shadow-md">
              {property.operation}
            </span>
            <span className="bg-[#232742] text-yellow-100/80 px-3 py-1 ml-2 rounded font-semibold text-sm">
              {property.type}
            </span>
          </div>
          <div className="flex items-center gap-3 text-yellow-100/80 mb-3">
            <MapPin size={20} className="text-yellow-400" />
            <span>{property.location}</span>
            <span className="text-yellow-100/60">|</span>
            <span className="text-yellow-100/70">{property.address}</span>
          </div>
          <div className="flex items-center gap-8 mb-6 text-yellow-100/90 flex-wrap">
            <div className="flex items-center gap-2">
              <BedDouble size={20} className="text-yellow-400" />
              <span>{property.bedrooms} hab.</span>
            </div>
            <div className="flex items-center gap-2">
              <Bath size={20} className="text-yellow-400" />
              <span>{property.bathrooms} baños</span>
            </div>
            <div className="flex items-center gap-2">
              <Ruler size={20} className="text-yellow-400" />
              <span>{property.area} m²</span>
            </div>
            {property.garage && (
              <div className="flex items-center gap-2">
                <Tag size={20} className="text-yellow-400" />
                <span>Garaje</span>
              </div>
            )}
            {property.floor && (
              <div className="flex items-center gap-2">
                <Tag size={20} className="text-yellow-400" />
                <span>Piso {property.floor}</span>
              </div>
            )}
            {property.year && (
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-yellow-400" />
                <span>Año {property.year}</span>
              </div>
            )}
            {property.orientation && (
              <div className="flex items-center gap-2">
                <Tag size={20} className="text-yellow-400" />
                <span>Orientación {property.orientation}</span>
              </div>
            )}
            {typeof property.maxTenants === "number" && (
              <div className="flex items-center gap-2">
                <Users size={20} className="text-yellow-400" />
                <span>Máx. {property.maxTenants} personas</span>
              </div>
            )}
          </div>
          <div className="text-3xl font-bold text-yellow-300 mb-4">
            {property.currency === "USD" && "$"}
            {property.price.toLocaleString()}
            <span className="text-yellow-100 text-lg font-medium ml-2">
              {property.operation === "Alquiler" ? " / mes" : ""}
            </span>
          </div>
          {/* Si es alquiler, mostrar gastos comunes */}
          {property.operation === "Alquiler" && (
            <div className="mb-4 flex items-center gap-4">
              <span className="text-yellow-200 font-semibold">Gastos comunes:</span>
              <span className="text-yellow-100/90 text-lg font-bold">
                ${property.expenses} USD
              </span>
            </div>
          )}
          <div className="flex flex-wrap gap-4 mb-6">
            {property.furnished && (
              <span className="bg-yellow-400/20 text-yellow-200 px-4 py-2 rounded-lg flex items-center gap-2 font-semibold">
                <CheckCircle size={18} className="text-yellow-400" /> Amueblado
              </span>
            )}
            {property.petsAllowed && (
              <span className="bg-yellow-400/20 text-yellow-200 px-4 py-2 rounded-lg flex items-center gap-2 font-semibold">
                <CheckCircle size={18} className="text-yellow-400" /> Acepta mascotas
              </span>
            )}
          </div>
          <div className="mb-8">
            <h2 className="text-2xl text-yellow-100 font-semibold mb-3">Descripción</h2>
            <p className="text-yellow-100/90 text-lg">{property.description}</p>
          </div>
          <div>
            <h3 className="text-xl text-yellow-100 font-semibold mb-2">Características</h3>
            <ul className="flex flex-wrap gap-4">
              {property.features.map((feat, idx) => (
                <li key={idx} className="flex items-center gap-2 bg-[#232742]/80 border border-yellow-600/20 text-yellow-100/90 px-4 py-2 rounded-lg">
                  <CheckCircle size={18} className="text-yellow-400" />
                  {feat}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* CTA y contacto */}
        <div className="bg-[#232742]/90 border border-yellow-600/20 rounded-2xl p-8 flex flex-col justify-between shadow-xl">
          <div>
            <h4 className="text-xl font-bold text-yellow-100 mb-3">¿Interesado?</h4>
            <p className="text-yellow-100/80 mb-6">
              Contáctanos para agendar una visita o recibir más información personalizada.
            </p>
            <button className="w-full bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-200 text-[#181c2b] font-bold py-3 rounded-lg shadow-md hover:from-yellow-300 hover:to-yellow-100 transition-all mb-3 flex items-center justify-center gap-2">
              <Mail size={20} /> Enviar Consulta
            </button>
            <button className="w-full bg-[#181c2b] text-yellow-100 font-bold py-3 rounded-lg shadow-md border border-yellow-400/50 hover:bg-[#232742] transition-all flex items-center justify-center gap-2">
              <Phone size={20} /> Llamar Ahora
            </button>
          </div>
          <button className="mt-10 w-full flex items-center justify-center gap-2 text-yellow-400 hover:text-yellow-200 font-semibold transition-all">
            <Heart size={22} /> Añadir a favoritos
          </button>
        </div>
      </div>

      {/* Mapa */}
      <div className="max-w-6xl mx-auto mb-14">
        <h3 className="text-2xl text-yellow-100 font-semibold mb-4">Ubicación</h3>
        <div className="rounded-2xl overflow-hidden border border-yellow-600/20 shadow-lg h-72">
          <iframe
            src={property.mapEmbed}
            width="100%"
            height="100%"
            allowFullScreen=""
            loading="lazy"
            title="Ubicación en mapa"
            className="w-full h-full"
            style={{ border: 0 }}
          ></iframe>
        </div>
      </div>

      {/* Carousel de similares */}
      <div className="max-w-6xl mx-auto mb-8">
        <h3 className="text-2xl text-yellow-100 font-semibold mb-7">Propiedades Similares</h3>
        <div className="w-full overflow-x-auto">
          <div className="flex gap-8 pb-3">
            {similarProperties.map((prop) => (
              <motion.div
                key={prop.id}
                whileHover={{ scale: 1.03 }}
                className="min-w-[320px] max-w-xs bg-[#232742]/80 border border-yellow-600/20 rounded-2xl overflow-hidden shadow-lg relative group"
              >
                {prop.featured && (
                  <div className="absolute top-4 left-4 bg-gradient-to-tr from-yellow-400 to-yellow-300 text-[#181c2b] px-4 py-1 text-xs font-bold rounded-full shadow-lg z-10">
                    DESTACADA
                  </div>
                )}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={prop.image}
                    alt={prop.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    {getTypeIcon(prop.type)}
                    <span className="bg-[#232742] text-yellow-100/80 px-2 py-1 rounded font-semibold text-xs">
                      {prop.type}
                    </span>
                    <span className="bg-gradient-to-tr from-yellow-400 to-yellow-300 text-[#181c2b] px-2 py-1 rounded font-semibold text-xs ml-2">
                      {prop.operation}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-yellow-100 mb-1">{prop.title}</h4>
                  <div className="flex items-center gap-2 text-yellow-100/80 mb-2">
                    <MapPin size={16} className="text-yellow-400" />
                    <span>{prop.location}</span>
                  </div>
                  <div className="flex items-center gap-4 mb-3 text-yellow-100/80 text-sm">
                    <div className="flex items-center gap-1">
                      <BedDouble size={16} className="text-yellow-400" />
                      <span>{prop.bedrooms}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath size={16} className="text-yellow-400" />
                      <span>{prop.bathrooms}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Ruler size={16} className="text-yellow-400" />
                      <span>{prop.area} m²</span>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-yellow-300">
                    {prop.currency === "USD" || !prop.currency ? "$" : prop.currency}
                    {prop.price.toLocaleString()}
                    <span className="text-yellow-100 font-medium text-sm ml-1">
                      {prop.operation === "Alquiler" ? " / mes" : ""}
                    </span>
                  </div>
                  <button className="mt-4 w-full bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-200 text-[#181c2b] font-bold py-2 rounded-lg shadow-md hover:from-yellow-300 hover:to-yellow-100 transition-all">
                    Ver detalles
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}