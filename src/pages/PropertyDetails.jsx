import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin, BedDouble, Bath, Ruler, Heart, CheckCircle, Mail, Phone, Tag, Home, Building2, Trees, DollarSign, Calendar, Users
} from "lucide-react";
import { doc, getDoc, collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "../services/firestore"; 

function getTypeIcon(type) {
  if (type === "Casa") return <Home size={20} className="text-yellow-400" />;
  if (type === "Apartamento") return <Building2 size={20} className="text-yellow-400" />;
  if (type === "Campo") return <Trees size={20} className="text-yellow-400" />;
  return <Tag size={20} className="text-yellow-400" />;
}

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [mainImg, setMainImg] = useState(0);
  const [loading, setLoading] = useState(true);
  const [similarProperties, setSimilarProperties] = useState([]);

  // Fetch property by ID
  useEffect(() => {
    if (!id) return;
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const ref = doc(db, "properties", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setProperty({
            id: snap.id,
            ...snap.data(),
            images: snap.data().images || [],
            features: snap.data().features || [],
          });
        } else {
          alert("Propiedad no encontrada");
          navigate("/propiedades");
        }
      } catch {
        alert("Error al cargar la propiedad");
        navigate("/propiedades");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id, navigate]);

  // Fetch similares
  useEffect(() => {
    if (!property) return;
    const fetchSimilares = async () => {
      try {
        // Busca propiedades con el mismo tipo y zona, ignora la actual, solo 3
        const q = query(
          collection(db, "properties"),
          where("type", "==", property.type),
          where("location", "==", property.location),
          limit(4)
        );
        const snap = await getDocs(q);
        const similares = snap.docs
          .filter(docu => docu.id !== property.id)
          .map(docu => ({
            id: docu.id,
            ...docu.data()
          }))
          .slice(0, 3);
        setSimilarProperties(similares);
      } catch {
        setSimilarProperties([]);
      }
    };
    fetchSimilares();
  }, [property]);

  // Safe image getter (compatible con Cloudinary)
  const getImage = (images, idx = 0) =>
    Array.isArray(images) && images.length > idx
      ? images[idx]
      : "/img/no-image.jpg";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#181c2b]">
        <div className="text-yellow-100 text-xl animate-pulse">Cargando propiedad…</div>
      </div>
    );
  }
  if (!property) return null;

  // --- AGENTE ---
  const agent = property.agent || {};
  const agentEmail = agent.email || "";
  const agentNumber = agent.number || "";

  return (
    <div className="min-h-screen bg-[#181c2b] py-12 px-4">
      {/* Galería de imágenes */}
      <div className="max-w-6xl mx-auto mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 h-80 md:h-[420px] rounded-2xl overflow-hidden relative group">
            <img
              src={getImage(property.images, mainImg)}
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
                    <img src={getImage(property.images, idx)} alt={`Vista ${idx + 1}`} className="object-cover w-full h-full" />
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
                  src={getImage(property.images, idx + 1)}
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
            {property.address && <>
              <span className="text-yellow-100/60">|</span>
              <span className="text-yellow-100/70">{property.address}</span>
            </>}
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
            {Number(property.price).toLocaleString()}
            <span className="text-yellow-100 text-lg font-medium ml-2">
              {property.operation === "Alquiler" ? " / mes" : ""}
            </span>
          </div>
          {/* Si es alquiler, mostrar gastos comunes */}
          {property.operation === "Alquiler" && property.expenses && (
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
              {(property.features || []).map((feat, idx) => (
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
            {agentEmail && (
              <a
                href={`mailto:${agentEmail}?subject=Consulta por propiedad: ${encodeURIComponent(property.title)}`}
                className="w-full bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-200 text-[#181c2b] font-bold py-3 rounded-lg shadow-md hover:from-yellow-300 hover:to-yellow-100 transition-all mb-3 flex items-center justify-center gap-2"
              >
                <Mail size={20} /> Enviar Consulta
              </a>
            )}
            {agentNumber && (
              <a
                href={`tel:${agentNumber}`}
                className="w-full bg-[#181c2b] text-yellow-100 font-bold py-3 rounded-lg shadow-md border border-yellow-400/50 hover:bg-[#232742] transition-all flex items-center justify-center gap-2"
              >
                <Phone size={20} /> Llamar Ahora
              </a>
            )}
            {agent && (
              <div className="mt-6 text-yellow-100/80 text-sm flex flex-col gap-1">
                <span><b>Agente:</b> {agent.name}</span>
                {agentEmail && <span><b>Email:</b> {agentEmail}</span>}
                {agentNumber && <span><b>Teléfono:</b> {agentNumber}</span>}
              </div>
            )}
          </div>
          <button className="mt-10 w-full flex items-center justify-center gap-2 text-yellow-400 hover:text-yellow-200 font-semibold transition-all">
            <Heart size={22} /> Añadir a favoritos
          </button>
        </div>
      </div>

      {/* Mapa */}
      {property.mapEmbed && (
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
      )}

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
                    src={Array.isArray(prop.images) && prop.images.length > 0 ? prop.images[0] : prop.image || "/img/no-image.jpg"}
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
                    {Number(prop.price).toLocaleString()}
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