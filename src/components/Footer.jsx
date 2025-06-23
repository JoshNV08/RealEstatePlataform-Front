import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { icon: <Instagram size={20} />, href: '#', label: 'Instagram', color: "bg-gradient-to-tr from-pink-500 to-yellow-400" },
    { icon: <Facebook size={20} />, href: '#', label: 'Facebook', color: "bg-blue-700" },
    { icon: <Linkedin size={20} />, href: '#', label: 'Linkedin', color: "bg-blue-900" },
  ];

  const contactInfo = [
    { icon: <Mail size={20} />, text: 'contacto@goldenrealty.uy' },
    { icon: <Phone size={20} />, text: '+598 99 123 456' },
    { icon: <MapPin size={20} />, text: 'Punta del Este, Uruguay' },
  ];

  return (
    <footer className="bg-[#181c2b] text-yellow-100 border-t border-yellow-600/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="col-span-1 md:col-span-2"
          >
            <img src="./logofooter.png" className='w-36' />
            <p className="text-yellow-100/70 mb-6">
              Especialistas en propiedades de lujo y servicios inmobiliarios premium.<br />
              Hacemos realidad tus sueños de encontrar el hogar perfecto.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.13 }}
                  className={`text-white shadow-md rounded-lg p-2 ${social.color}`}
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold text-yellow-200 mb-5">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              {['Inicio', 'Propiedades', 'Servicios', 'Sobre Nosotros', 'Contacto'].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-yellow-100/70 hover:text-yellow-200 transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <h4 className="text-lg font-semibold text-yellow-200 mb-5">Contacto</h4>
            <ul className="space-y-4">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <span className="text-yellow-300">{item.icon}</span>
                  <span className="text-yellow-100/80">{item.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-14 pt-8 border-t border-yellow-600/20 text-center"
        >
              <p className="text-yellow-100/60">
          Sitio Web creado por: <a href="https://www.loftymarketing.uy">Lofty Marketing</a>
          </p>
          <p className="text-yellow-100/60">
            © {new Date().getFullYear()} Golden Realty. Todos los derechos reservados.
          </p>
          
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;