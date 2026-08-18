import { useState } from 'react';
import logo from '../assets/logo.png';
import { useCart } from '../context/CartContext';

export default function Navbar({ currentView, setCurrentView, user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const { totalCount } = useCart();

  const navLinks = [
    { name: 'Inicio', view: 'home', href: '#inicio' },
    { name: 'Cajas', view: 'productos', href: '#productos' },
    { name: 'Arreglos', view: 'productos', href: '#productos' },
    { name: 'Eventos', view: 'productos', href: '#productos' },
    { name: 'Contacto', view: 'home', href: '#contacto' },
  ];

  const handleNavClick = (link, e) => {
    e.preventDefault();
    if (link.view) setCurrentView(link.view);
    if (link.href && link.view === 'home') {
      const el = document.querySelector(link.href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const handleUserClick = () => {
    if (!user) { setCurrentView('login'); return; }
    setShowUserDropdown(!showUserDropdown);
  };

  const getUserButtonClasses = () => {
    if (!user) return 'bg-[#fde047] hover:bg-[#facc15]';
    if (user.type === 'admin') return 'bg-[#4ade80] ring-2 ring-green-400';
    if (user.type === 'asesor') return 'bg-[#c084fc] ring-2 ring-purple-400';
    return 'bg-[#67e8f9] ring-2 ring-cyan-400';
  };

  const renderUserIcon = () => {
    if (!user) return (
      <svg className="w-5 h-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    );
    if (user.type === 'admin') return <span className="text-sm font-black text-gray-800">🛡️</span>;
    if (user.type === 'asesor') return <span className="text-sm font-black text-gray-800">💼</span>;
    const initial = user.name ? user.name.charAt(0).toUpperCase() : '?';
    return <span className="text-sm font-bold text-gray-800">{initial}</span>;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <a href="#inicio" onClick={(e) => handleNavClick({ view: 'home', href: '#inicio' }, e)} className="flex items-center gap-2 flex-shrink-0">
            <img src={logo} alt="Tu Cajita" className="h-8 md:h-10 w-auto object-contain" />
          </a>

          {/* Links desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(link, e)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  currentView === link.view
                    ? 'bg-[#D2E7EA] text-gray-900'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Derecha: Carrito + Usuario */}
          <div className="flex items-center gap-2">

            {/* Ícono de Carrito */}
            <button
              onClick={() => setCurrentView('carrito')}
              className="relative w-10 h-10 rounded-full bg-gray-100 hover:bg-[#D2E7EA] flex items-center justify-center transition"
              aria-label="Carrito"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#00C2FF] text-white text-[10px] font-black rounded-full flex items-center justify-center shadow">
                  {totalCount > 9 ? '9+' : totalCount}
                </span>
              )}
            </button>

            {/* Avatar / Usuario */}
            <div className="relative">
              <button
                onClick={handleUserClick}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${getUserButtonClasses()}`}
              >
                {renderUserIcon()}
              </button>

              {/* Dropdown de usuario */}
              {showUserDropdown && user && (
                <div className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-bold text-gray-900 text-sm truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <button onClick={() => { setCurrentView('perfil'); setShowUserDropdown(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                    👤 Mi Perfil
                  </button>
                  <button onClick={() => { setCurrentView('carrito'); setShowUserDropdown(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                    🛒 Mi Carrito
                    {totalCount > 0 && <span className="ml-auto bg-[#00C2FF] text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{totalCount}</span>}
                  </button>
                  {user.type === 'admin' && (
                    <button onClick={() => { setCurrentView('admin'); setShowUserDropdown(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      🛡️ Panel Admin
                    </button>
                  )}
                  <div className="border-t border-gray-100 mt-1">
                    <button onClick={() => { onLogout(); setShowUserDropdown(false); }} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                      🚪 Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Hamburger mobile */}
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition">
              <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {isOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Menú mobile */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} onClick={(e) => handleNavClick(link, e)} className="block px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-xl">
                {link.name}
              </a>
            ))}
            <button onClick={() => { setCurrentView('carrito'); setIsOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-xl flex items-center gap-2">
              🛒 Carrito {totalCount > 0 && <span className="bg-[#00C2FF] text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{totalCount}</span>}
            </button>
          </div>
        )}
      </div>

      {/* Click fuera cierra dropdown */}
      {showUserDropdown && <div className="fixed inset-0 z-40" onClick={() => setShowUserDropdown(false)} />}
    </nav>
  );
}