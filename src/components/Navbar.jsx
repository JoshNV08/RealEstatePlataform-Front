import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Heart, User, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { useSelector, useDispatch } from 'react-redux';
import { remove } from '../store/wishlistSlice';

// Sidebar para el wishlist, igual que antes
function WishlistSidebar({ open, onClose, wishlist, onRemove }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[80]"
            onClick={onClose}
          />
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
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-yellow-100 font-semibold text-lg truncate">{prop.title}</h4>
                          <button
                            className="text-yellow-400 hover:text-red-500 transition"
                            title="Quitar de wishlist"
                            onClick={() => onRemove(prop.id)}
                          >
                            <Heart fill="currentColor" size={20} />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 text-yellow-100/70 text-xs mb-1">
                          <span className="inline-flex items-center gap-1">
                            <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth="2" className="text-yellow-400" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"></path></svg>
                            {prop.location}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-yellow-100/70 text-xs mb-1">
                          <span className="flex items-center gap-1">
                            <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth="2" className="text-yellow-400" viewBox="0 0 24 24"><path d="M3 7v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7"></path><path d="M21 7l-9-5-9 5"></path><path d="M9 22V12h6v10"></path></svg>
                            {prop.bedrooms}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth="2" className="text-yellow-400" viewBox="0 0 24 24"><path d="M6 21V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v14"></path><path d="M6 18h12"></path></svg>
                            {prop.bathrooms}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth="2" className="text-yellow-400" viewBox="0 0 24 24"><path d="M4 17l6-6 6 6"></path></svg>
                            {prop.area} m²
                          </span>
                        </div>
                        <div className="text-yellow-300 font-bold text-base">
                          ${prop.price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {wishlist.length > 0 && (
              <div className="p-5 border-t border-yellow-600/20">
                <button
                  className="w-full bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-200 text-[#181c2b] font-bold py-3 rounded-lg shadow-md hover:from-yellow-300 hover:to-yellow-100 transition-all"
                  onClick={onClose}
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

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Redux
  const wishlist = useSelector(state => state.wishlist.items);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Detecta usuario logueado Firebase (simple)
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  // Remove from wishlist
  const handleRemoveFromWishlist = (id) => {
    dispatch(remove(id));
  };

  // Logout
  const handleLogout = async () => {
    const auth = getAuth();
    await auth.signOut();
    setUser(null);
    navigate("/");
  };

  // Links para clientes (no logueados)
  const navItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Propiedades', href: '/propiedades' },
    { name: 'Contacto',  href: '/contacto' },
    { name: 'Sobre Nosotros', href: '/sobre-nosotros' },
    { name: '', nameMobile: 'Ingreso Agentes', icon: <User size={26} />, href: '/ingreso' },
  ];

  // Links para agentes/admins logueados
  const adminNavItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Mi Perfil', href: '/dashboard/perfil' },
  ];

  return (
    <>
      <nav
      
        className="fixed w-full bg-[#181c2b] z-50 transition-all duration-300 border-b border-yellow-600/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#181c2b]">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bol tracking-tight">
                <img src="./logo2.png" className='w-20 h-20' alt="Logo" />
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-8">
                {!user && navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center space-x-2 text-yellow-100/80 hover:text-yellow-200 transition-colors duration-200 font-semibold ${
                      location.pathname === item.href ? 'text-yellow-300' : ''
                    }`}
                  >
                    <span>{item.icon}{item.name}</span>
                  </Link>
                ))}
                {user && (
                  <>
                    {adminNavItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className={`flex items-center space-x-2 text-yellow-100/80 hover:text-yellow-200 transition-colors duration-200 font-semibold ${
                          location.pathname === item.href ? 'text-yellow-300' : ''
                        }`}
                      >
                        <span>{item.icon}{item.name}</span>
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-yellow-100/80 hover:text-yellow-300 transition-colors duration-200 font-semibold"
                    >
                      <LogOut size={22} /> <span>Cerrar sesión</span>
                    </button>
                    <span className="ml-2 text-yellow-200 font-bold truncate max-w-[160px]">{user.displayName || user.email}</span>
                  </>
                )}

                {/* Wishlist button solo para clientes */}
                {!user && (
                  <button onClick={() => setWishlistOpen(true)} className="relative ml-4" aria-label="Wishlist">
                    <Heart className="text-yellow-100/80" size={26} />
                    {wishlist.length > 0 && (
                      <span className="absolute -top-1 -right-2 bg-yellow-300 text-[#181c2b] text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
                        {wishlist.length}
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-yellow-100 hover:text-yellow-300"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-[#181c2b] border-t border-yellow-600/20 shadow-lg"
          >
            <div className="px-2 pt-4 pb-6 space-y-2">
              {!user && navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-md text-yellow-100/80 hover:text-yellow-200 hover:bg-yellow-600/10 font-semibold ${
                    location.pathname === item.href ? 'text-yellow-300 bg-yellow-600/10' : ''
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <span>{item.nameMobile}{item.name}</span>
                </Link>
              ))}
              {user && (
                <>
                  {adminNavItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-md text-yellow-100/80 hover:text-yellow-200 hover:bg-yellow-600/10 font-semibold ${
                        location.pathname === item.href ? 'text-yellow-300 bg-yellow-600/10' : ''
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <span>{item.icon}{item.name}</span>
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center space-x-3 px-4 py-3 rounded-md text-yellow-100/80 hover:text-yellow-200 hover:bg-yellow-600/10 font-semibold"
                  >
                    <LogOut size={22} /> <span>Cerrar sesión</span>
                  </button>
                  <span className="block px-4 py-2 text-yellow-200 font-bold truncate max-w-[160px]">{user.displayName || user.email}</span>
                </>
              )}
              {/* Wishlist for mobile solo para clientes */}
              {!user && (
                <button onClick={() => setWishlistOpen(true)} className="relative ml-2 flex items-center" aria-label="Wishlist">
                  {wishlist.length > 0 && (
                    <span className="ml-1 bg-yellow-400 text-[#181c2b] text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                      {wishlist.length}
                    </span>
                  )}
                  <span className="ml-2 text-yellow-100/80 font-semibold">Favoritos</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </nav>
      {/* Sidebar/modal for wishlist */}
      {!user && (
        <WishlistSidebar
          open={wishlistOpen}
          onClose={() => setWishlistOpen(false)}
          wishlist={wishlist}
          onRemove={handleRemoveFromWishlist}
        />
      )}
    </>
  );
};

export default Navbar;