import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Award, Users, Building, TrendingUp, Star, Quote, ChevronRight, ArrowRight, CheckCircle } from 'lucide-react';

const stats = [
  { number: "300+", text: "Propiedades vendidas", icon: Building },
  { number: "98%", text: "Clientes satisfechos", icon: Star },
  { number: "15+", text: "Asesores expertos", icon: Users },
  { number: "2025", text: "Año de fundación", icon: Award },
];

const values = [
  {
    icon: Shield,
    title: "Confianza",
    description: "Construimos relaciones duraderas basadas en la transparencia y la honestidad en cada transacción.",
    highlight: "100% transparente"
  },
  {
    icon: Target,
    title: "Excelencia",
    description: "Nos esforzamos por superar las expectativas en cada transacción con servicio personalizado.",
    highlight: "Servicio premium"
  },
  {
    icon: Award,
    title: "Compromiso",
    description: "Dedicados a encontrar la propiedad perfecta para cada cliente con seguimiento integral.",
    highlight: "Acompañamiento total"
  }
];

const team = [
  {
    name: "María Rodríguez",
    role: "Directora General",
    experience: "15+ años",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300",
    speciality: "Propiedades de lujo"
  },
  {
    name: "Carlos Mendoza",
    role: "Asesor Senior",
    experience: "12+ años", 
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300",
    speciality: "Inversiones comerciales"
  },
  {
    name: "Ana García",
    role: "Especialista Residencial",
    experience: "8+ años",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300",
    speciality: "Hogares familiares"
  }
];

const achievements = [
  "Mejor inmobiliaria de Punta del Este 2024",
  "Premio a la excelencia en servicio al cliente",
  "Certificación internacional en bienes raíces",
  "Miembro de la asociación nacional de corredores"
];

function ImprovedAboutPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const heroImages = [
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200",
    "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1200",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1f2e]">
      {/* Enhanced Hero Section con carousel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-2000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`Golden Realty Office ${index + 1}`}
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}
          
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1f2e]/95 via-[#1e2338]/90 to-[#2a1f1a]/85" />
          
          {/* Efectos de luz mejorados */}
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-yellow-400/20 via-yellow-200/10 to-transparent rounded-full blur-3xl opacity-60 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-yellow-500/15 to-transparent rounded-full blur-3xl opacity-40 pointer-events-none" />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto text-center px-4">
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-yellow-100"
          >
            <div className="inline-flex items-center bg-yellow-400/15 backdrop-blur-sm rounded-full px-6 py-3 border border-yellow-400/30 mb-8">
              <Star className="w-4 h-4 text-yellow-400 mr-2" />
              <span className="text-yellow-300 text-sm font-medium">Líderes en bienes raíces desde 2025</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-none tracking-tight">
              Sobre
              <span className="block bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
                Golden Realty
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 font-light max-w-4xl mx-auto text-yellow-200/90 leading-relaxed">
              Transformando sueños en realidad desde el corazón de Punta del Este.
              <br />
              <span className="text-yellow-300 font-medium">Tu confianza, nuestro compromiso.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="group bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-200 text-[#1a1f2e] px-10 py-4 rounded-xl text-xl font-bold shadow-2xl hover:shadow-yellow-400/20 transition-all duration-300 flex items-center"
              >
                Conoce nuestro equipo
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="group bg-transparent border-2 border-yellow-400/50 text-yellow-100 px-10 py-4 rounded-xl text-xl font-medium hover:bg-yellow-400/10 backdrop-blur-sm transition-all duration-300 flex items-center"
              >
                Ver nuestros logros
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Indicadores del carousel */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex ? 'bg-yellow-400 w-8' : 'bg-yellow-400/40'
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Stats Section mejorada */}
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
                    <stat.icon className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-yellow-100 mb-2 drop-shadow">
                  {stat.number}
                </div>
                <div className="text-yellow-300/80 font-medium">{stat.text}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Historia Section rediseñada */}
      <section className="relative py-20 bg-gradient-to-b from-[#1e2338] to-[#212544]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="inline-flex items-center bg-yellow-400/15 backdrop-blur-sm rounded-full px-4 py-2 border border-yellow-400/25 mb-6">
                <Building className="w-4 h-4 text-yellow-400 mr-2" />
                <span className="text-yellow-300 text-sm font-medium">Nuestra Historia</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-yellow-100 mb-8 leading-tight">
                Construyendo confianza desde el primer día
              </h2>
              
              <div className="space-y-6">
                <p className="text-yellow-100/90 text-lg leading-relaxed">
                  Fundada en 2025 en el corazón de Punta del Este, Golden Realty nació con la visión de 
                  transformar la experiencia inmobiliaria en Uruguay, combinando el conocimiento local
                  con estándares internacionales de servicio.
                </p>
                <p className="text-yellow-100/90 text-lg leading-relaxed">
                  Nos especializamos en propiedades premium y de lujo, ofreciendo un servicio 
                  personalizado que va más allá de la simple transacción inmobiliaria. Nuestro equipo
                  de expertos está comprometido con hacer realidad los sueños de nuestros clientes.
                </p>
              </div>

              {/* Lista de logros */}
              <div className="mt-8 space-y-3">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center"
                  >
                    <CheckCircle className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" />
                    <span className="text-yellow-100/80">{achievement}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <div className="relative h-[500px] rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600"
                  alt="Oficina Golden Realty"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1f2e]/60 via-transparent to-transparent" />
                
                {/* Decoración flotante */}
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-full blur-xl" />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-yellow-500/15 to-transparent rounded-full blur-xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section mejorada */}
      <section className="relative py-20 bg-gradient-to-b from-[#212544] to-[#1e2338]">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-yellow-100 mb-6">
              Nuestros Valores
            </h2>
            <p className="text-xl text-yellow-100/80 max-w-3xl mx-auto leading-relaxed">
              Los principios que guían cada decisión y definen nuestra identidad
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="group bg-[#1a1f2e]/70 border border-yellow-600/20 p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:border-yellow-400/30 transition-all duration-500 text-center hover:scale-105"
              >
                <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-xl bg-gradient-to-br from-yellow-600 via-yellow-400 to-yellow-200 shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="text-[#1a1f2e]" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-yellow-100 mb-4">
                  {value.title}
                </h3>
                <p className="text-yellow-100/80 mb-4 leading-relaxed">
                  {value.description}
                </p>
                <div className="inline-block bg-yellow-400/20 text-yellow-300 px-4 py-2 rounded-full text-sm font-semibold border border-yellow-400/20">
                  {value.highlight}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section nueva */}
      <section className="relative py-20 bg-gradient-to-b from-[#1e2338] to-[#212544] border-t border-yellow-600/15">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-yellow-100 mb-6">
              Nuestro Equipo
            </h2>
            <p className="text-xl text-yellow-100/80 max-w-3xl mx-auto">
              Profesionales apasionados comprometidos con tu éxito inmobiliario
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="group bg-[#1a1f2e]/70 border border-yellow-600/20 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-yellow-400/30 transition-all duration-500 hover:scale-105"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1f2e]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-yellow-100 mb-2">{member.name}</h3>
                  <p className="text-yellow-300 mb-2">{member.role}</p>
                  <p className="text-yellow-100/70 text-sm mb-3">{member.experience}</p>
                  <div className="inline-block bg-yellow-400/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-medium border border-yellow-400/20">
                    {member.speciality}
                  </div>
                </div>
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
        
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#1a1f2e] mb-6 tracking-tight">
              ¿Listo para encontrar tu propiedad ideal?
            </h2>
            <p className="text-xl text-[#1a1f2e]/70 mb-8 max-w-3xl mx-auto leading-relaxed">
              Nuestro equipo está preparado para ayudarte en cada paso del camino hacia tu nuevo hogar
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#1a1f2e] text-yellow-100 px-10 py-4 rounded-xl text-xl font-bold hover:bg-[#212544] transition-all duration-300 shadow-2xl flex items-center justify-center"
              >
                Contacta con nosotros
                <ChevronRight className="w-5 h-5 ml-2" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white/20 backdrop-blur-sm text-[#1a1f2e] px-10 py-4 rounded-xl text-xl font-bold border-2 border-[#1a1f2e]/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center"
              >
                Ver propiedades
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}

export default ImprovedAboutPage;