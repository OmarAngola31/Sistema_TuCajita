import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Categories from './components/Categories';
import OurWork from './components/OurWork';
import Products from './components/Products';
import ProductDetail from './components/ProductDetail';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import CartDrawer from './components/CartDrawer';
import CheckoutFlow from './components/CheckoutFlow';
import CustomerOrderHistory from './components/CustomerOrderHistory';
import { CartProvider } from './context/CartContext';
import { supabase } from './supabaseClient';

function AppContent() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'productos' | 'cajas' | 'arreglos' | 'eventos' | 'product-detail' | 'checkout' | 'history' | 'login' | 'register' | 'admin'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('tucajita_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setCurrentView('product-detail');
  };

  // Handle hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#productos') {
        setCurrentView('productos');
      } else if (hash === '#cajas') {
        setCurrentView('cajas');
      } else if (hash === '#arreglos') {
        setCurrentView('arreglos');
      } else if (hash === '#eventos') {
        setCurrentView('eventos');
      } else if (hash === '#inicio') {
        setCurrentView('home');
      } else if (hash === '#admin') {
        setCurrentView('admin');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Listen to Supabase auth state if available
  useEffect(() => {
    if (!supabase) return;
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const isAdmin = session.user.email?.includes('admin') || session.user.user_metadata?.role === 'admin';
        const userData = {
          id: session.user.id,
          type: isAdmin ? 'admin' : 'client',
          role: isAdmin ? 'admin' : 'client',
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Usuario',
          email: session.user.email,
        };
        setUser(userData);
        localStorage.setItem('tucajita_user', JSON.stringify(userData));
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('tucajita_user', JSON.stringify(userData));
  };

  const handleLogout = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Sign out error:', e);
      }
    }
    setUser(null);
    localStorage.removeItem('tucajita_user');
    setCurrentView('home');
  };

  // If in admin view, render AdminDashboard standalone or with top navigation
  if (currentView === 'admin') {
    return (
      <AdminDashboard
        user={user}
        setCurrentView={setCurrentView}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      {/* SECCIÓN 1: MENÚ SUPERIOR (NAVBAR) INDEPENDIENTE */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
        <Navbar
          currentView={currentView}
          setCurrentView={setCurrentView}
          user={user}
          onLogout={handleLogout}
          onOpenCart={() => setIsCartOpen(true)}
        />
      </header>

      {/* SECCIÓN 2: CONTENIDO DE LA PÁGINA / CATÁLOGO (TOTALMENTE SEPARADO) */}
      <main className="flex-1 w-full">
        {currentView === 'home' ? (
          <>
            <Hero onExplore={() => setCurrentView('productos')} />
            <Categories onSelectCategory={(cat) => setCurrentView(cat || 'productos')} />
            <OurWork onExplore={() => setCurrentView('productos')} />
          </>
        ) : currentView === 'checkout' ? (
          <CheckoutFlow
            user={user}
            setCurrentView={setCurrentView}
            onBackToShop={() => setCurrentView('productos')}
          />
        ) : currentView === 'history' ? (
          <CustomerOrderHistory
            user={user}
            setCurrentView={setCurrentView}
            onBackToShop={() => setCurrentView('productos')}
          />
        ) : currentView === 'login' ? (
          <Login setCurrentView={setCurrentView} onLogin={handleLogin} />
        ) : currentView === 'register' ? (
          <Register setCurrentView={setCurrentView} onLogin={handleLogin} />
        ) : currentView === 'product-detail' && selectedProduct ? (
          <ProductDetail
            product={selectedProduct}
            onBack={() => setCurrentView('productos')}
            onSelectProduct={handleSelectProduct}
            setCurrentView={setCurrentView}
            user={user}
          />
        ) : (
          <Products
            initialSection={['cajas', 'arreglos', 'eventos'].includes(currentView) ? currentView : 'all'}
            onSectionChange={(sec) => setCurrentView(sec)}
            user={user}
            setCurrentView={setCurrentView}
            onSelectProduct={handleSelectProduct}
          />
        )}
      </main>

      <Footer />

      {/* Cart Drawer Modal */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        setCurrentView={setCurrentView}
        user={user}
        onStartCheckout={() => setCurrentView('checkout')}
      />

      {/* WhatsApp floating button */}
      <a
        href="https://wa.me/584120177993"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-xl shadow-green-500/30 hover:scale-110 transition-all duration-300 animate-bounce-slow"
        aria-label="Contactar por WhatsApp"
      >
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
