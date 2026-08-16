import { useState } from 'react';
import logo from '../assets/logo.png';

export default function Navbar({ currentView, setCurrentView, user }) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Inicio', view: 'home', href: '#inicio' },
    { name: 'Cajas', view: 'productos', href: '#productos' },
    { name: 'Arreglos', view: 'productos', href: '#productos' },
    { name: 'Eventos', view: 'productos', href: '#productos' },
    { name: 'Contacto', view: 'home', href: '#contacto' },
  ];

  const handleNavClick = (link, e) => {
    e.preventDefault();
    if (link.view) {
      setCurrentView(link.view);
    }
    if (link.href && link.view === 'home') {
      const element = document.querySelector(link.href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const handleUserClick = () => {
    if (user) {
      // Si ya está logueado, ir a home (o podríamos agregar un menú de perfil)
      setCurrentView('home');
    } else {
      setCurrentView('login');
    }
  };

  // Renderizar el contenido del botón de usuario
  const renderUserIcon = () => {
    if (!user) {
      // No logueado: ícono de persona genérico
      return (
        <svg className="w-6 h-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
    }

    if (user.type === 'admin') {
      // Admin: ícono de escudo/estrella
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

  // Color del botón según estado
  const getUserButtonClasses = () => {
    if (!user) {
      return 'bg-[#fde047]'; // Amarillo por defecto
    }
    if (user.type === 'admin') {
      return 'bg-[#4ade80] ring-2 ring-green-300'; // Verde para admin
    }
    return 'bg-[#67e8f9] ring-2 ring-cyan-300'; // Cyan para clientes
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
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
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive =
                (link.view === 'productos' && currentView === 'productos') ||
                (link.name === 'Inicio' && currentView === 'home');
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(link, e)}
                  className={`relative px-3 py-2 text-base sm:text-lg font-bold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'text-gray-900 border-b-2 border-amber-500'
                      : 'text-gray-700 hover:text-amber-600'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </div>

          {/* Right Action: User Icon & Mobile Hamburger */}
          <div className="flex items-center gap-3">
            {/* User Icon Badge - Dinámico */}
            <button
              onClick={handleUserClick}
              className={`w-10 h-10 rounded-full ${getUserButtonClasses()} text-gray-800 flex items-center justify-center shadow-sm hover:scale-110 transition-all duration-300`}
              aria-label="User Profile"
              title={user ? `Hola, ${user.name}` : 'Iniciar Sesión'}
            >
              {renderUserIcon()}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
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
          isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-4 space-y-1 bg-white border-t border-gray-100 shadow-md">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(link, e)}
              className="block px-4 py-3 rounded-xl text-base font-bold text-gray-800 hover:bg-amber-50 hover:text-amber-600 transition-all"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
