import { useState } from 'react';
import logo from '../assets/logo.png';
import { useCart } from '../context/CartContext';

export default function Navbar({ currentView, setCurrentView, user, onLogout, onOpenCart }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const { cartCount } = useCart();

  // Comprobar roles de usuario
  const isAdmin = Boolean(
    user && (
      user.type === 'admin' ||
      user.role === 'admin' ||
      user.role === 'Administrador' ||
      (user.email && user.email.toLowerCase().includes('admin'))
    )
  );

  const isClient = Boolean(user && !isAdmin);

  const navLinks = [
    { name: 'Inicio', view: 'home', href: '#inicio' },
    { name: 'Cajas', view: 'cajas', href: '#cajas' },
    { name: 'Arreglos', view: 'arreglos', href: '#arreglos' },
    { name: 'Eventos', view: 'eventos', href: '#eventos' },
    { name: 'Contacto', view: 'home', href: '#contacto' },
  ];

  const handleNavClick = (link, e) => {
    if (e) e.preventDefault();
    if (link.view) {
      setCurrentView(link.view);
    }
    if (link.href === '#contacto') {
      if (currentView !== 'home') {
        setCurrentView('home');
        setTimeout(() => {
          const element = document.querySelector('#contacto');
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const element = document.querySelector('#contacto');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    setIsOpen(false);
  };

  const handleUserClick = () => {
    if (!user) {
      setCurrentView('login');
    } else {
      setShowUserDropdown(!showUserDropdown);
    }
  };

  // Renderizar el contenido del botón de usuario
  const renderUserIcon = () => {
    if (!user) {
      return (
        <svg className="w-6 h-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
    }

    if (isAdmin) {
      return (
        <svg className="w-6 h-6 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
        </svg>
      );
    }

    // Cliente: inicial del nombre
    const initial = user.name ? user.name.charAt(0).toUpperCase() : '?';
    return (
      <span className="text-base font-bold text-gray-800 select-none">{initial}</span>
    );
  };

  const getUserButtonClasses = () => {
    if (!user) {
      return 'bg-[#fde047] hover:bg-[#facc15]';
    }
    if (isAdmin) {
      return 'bg-[#4ade80] ring-2 ring-green-400';
    }
    return 'bg-[#67e8f9] ring-2 ring-cyan-400';
  };

  return (
    <nav className="w-full bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo */}
          <a
            href="#inicio"
            onClick={(e) => handleNavClick({ view: 'home', href: '#inicio' }, e)}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <img
              src={logo}
              alt="Tu Cajita Logo"
              className="h-12 w-12 md:h-14 md:w-14 object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <span
              className="hidden sm:block text-xl font-black text-amber-600 tracking-tight"
              style={{ fontFamily: "'Fredoka One', cursive" }}
            >
              Tu Cajita
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => {
              const isActive =
                link.view === currentView ||
                (link.name === 'Inicio' && currentView === 'home') ||
                (currentView === 'productos' && link.view === 'cajas');
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(link, e)}
                  className={`relative px-2.5 py-2 text-base font-bold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'text-gray-900 border-b-2 border-amber-500'
                      : 'text-gray-700 hover:text-amber-600'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}

            {/* ENLACE CONDICIONAL SEGÚN ROL */}
            {isAdmin ? (
              /* 1. Administrador: Enlace idéntico al resto de opciones */
              <button
                onClick={() => setCurrentView('admin')}
                className={`relative px-2.5 py-2 text-base font-bold transition-all duration-300 cursor-pointer ${
                  currentView === 'admin'
                    ? 'text-gray-900 border-b-2 border-amber-500'
                    : 'text-gray-700 hover:text-amber-600'
                }`}
              >
                Panel Admin
              </button>
            ) : isClient ? (
              /* 2. Cliente Autenticado: Botón Carrito con Badge Numérico Dinámico */
              <button
                onClick={onOpenCart}
                className="relative px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 font-extrabold text-sm rounded-xl border border-amber-200 shadow-sm hover:shadow transition-all duration-200 flex items-center gap-2 cursor-pointer group"
                title="Ver mi carrito de compras"
              >
                <span className="text-lg group-hover:scale-110 transition-transform">🛒</span>
                <span>Carrito</span>
                
                {/* Badge Numérico Dinámico */}
                {cartCount > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-[11px] font-black rounded-full shadow-md animate-[scaleIn_0.2s_ease]">
                    {cartCount}
                  </span>
                )}
              </button>
            ) : null /* 3. Visitante: No ve Carrito ni Panel Admin */}
          </div>

          {/* Right Action: User Icon & Mobile Hamburger */}
          <div className="flex items-center gap-3 relative">
            {/* Botón Carrito en Mobile ÚNICAMENTE si es Cliente Autenticado */}
            {isClient && (
              <button
                onClick={onOpenCart}
                className="md:hidden relative p-2.5 bg-amber-50 text-amber-900 rounded-xl border border-amber-200 flex items-center justify-center cursor-pointer"
                aria-label="Abrir Carrito"
              >
                <span className="text-lg">🛒</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* User Button */}
            <button
              onClick={handleUserClick}
              className={`w-10 h-10 rounded-full ${getUserButtonClasses()} text-gray-800 flex items-center justify-center shadow-sm hover:scale-105 transition-all duration-300 cursor-pointer`}
              aria-label="User Profile"
              title={user ? `Hola, ${user.name}` : 'Iniciar Sesión'}
            >
              {renderUserIcon()}
            </button>

            {/* User Dropdown Menu */}
            {showUserDropdown && user && (
              <div className="absolute right-0 top-12 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 z-50 animate-[fadeIn_0.15s_ease]">
                <div className="border-b border-gray-100 pb-2 mb-2">
                  <p className="font-bold text-gray-900 text-sm truncate">{user.name}</p>
                  <p className="text-[11px] text-gray-500 truncate">{user.email || 'Usuario'}</p>
                  <span className={`inline-block mt-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                    isAdmin ? 'bg-green-100 text-green-800' : 'bg-cyan-100 text-cyan-800'
                  }`}>
                    {isAdmin ? '🛡️ Administrador' : '👤 Cliente'}
                  </span>
                </div>

                {isAdmin ? (
                  <button
                    onClick={() => {
                      setCurrentView('admin');
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-[#144b57] hover:bg-cyan-50 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span>📊</span>
                    <span>Dashboard Administrativo</span>
                  </button>
                ) : isClient ? (
                  <button
                    onClick={() => {
                      onOpenCart();
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-amber-700 hover:bg-amber-50 rounded-xl transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span>🛒</span>
                      <span>Mi Carrito</span>
                    </span>
                    {cartCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-white">
                        {cartCount}
                      </span>
                    )}
                  </button>
                ) : null}

                <button
                  onClick={() => {
                    setCurrentView('productos');
                    setShowUserDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>🛍️</span>
                  <span>Ver Catálogo</span>
                </button>

                {/* Historial de Compras y Facturas para el Cliente */}
                {isClient && (
                  <button
                    onClick={() => {
                      setCurrentView('history');
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-cyan-50 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span>🧾</span>
                    <span>Mis Compras & Facturas</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    onLogout();
                    setShowUserDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 mt-1 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>🚪</span>
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-4 space-y-1.5 bg-white border-t border-gray-100 shadow-md">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(link, e)}
              className="block px-4 py-2.5 rounded-xl text-base font-bold text-gray-800 hover:bg-amber-50 hover:text-amber-600 transition-all"
            >
              {link.name}
            </a>
          ))}

          {/* Opción Mobile según Rol */}
          {isAdmin ? (
            <button
              onClick={() => {
                setCurrentView('admin');
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-base font-bold transition-all cursor-pointer ${
                currentView === 'admin'
                  ? 'bg-amber-50 text-amber-600'
                  : 'text-gray-800 hover:bg-amber-50 hover:text-amber-600'
              }`}
            >
              Panel Admin
            </button>
          ) : isClient ? (
            <button
              onClick={() => {
                onOpenCart();
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-base font-bold bg-amber-500 text-white flex items-center justify-between cursor-pointer shadow-sm"
            >
              <span className="flex items-center gap-2">
                <span>🛒</span>
                <span>Mi Carrito de Compras</span>
              </span>
              {cartCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-black bg-white text-amber-700">
                  {cartCount}
                </span>
              )}
            </button>
          ) : null}
        </div>
      </div>
    </nav>
  );
}

