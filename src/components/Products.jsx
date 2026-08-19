import { useState, useRef, useEffect } from 'react';
import { productsData as defaultProducts, categoriesList } from '../data/productsData';
import { getProducts } from '../services/dbService';
import { useCart } from '../context/CartContext';
import empaquesLujo from '../assets/empaques_lujo.png';
import sampleCasita from '../assets/sample_casita.png';
import sampleHappyday from '../assets/sample_happyday.png';
import logo from '../assets/logo.png';

export default function Products({ initialSection = 'all', onSectionChange, user, setCurrentView, onSelectProduct }) {
  const [allProducts, setAllProducts] = useState(defaultProducts);
  const [activeSection, setActiveSection] = useState(initialSection || 'all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedQty, setSelectedQty] = useState(1);
  const [activeBannerSlide, setActiveBannerSlide] = useState(0);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  const { addToCart } = useCart();
  const isClient = Boolean(user && user.type !== 'admin' && user.role !== 'admin' && user.role !== 'Administrador');

  const categoryScrollRef = useRef(null);

  // Load and subscribe to live products synchronization
  useEffect(() => {
    let isMounted = true;
    async function loadCatalog() {
      const prods = await getProducts();
      if (isMounted && prods && prods.length > 0) {
        setAllProducts(prods);
      }
    }
    loadCatalog();

    const handleProductsUpdated = (e) => {
      if (e?.detail) {
        setAllProducts(e.detail);
      } else {
        loadCatalog();
      }
    };

    window.addEventListener('tucajita_products_updated', handleProductsUpdated);
    window.addEventListener('storage', handleProductsUpdated);

    return () => {
      isMounted = false;
      window.removeEventListener('tucajita_products_updated', handleProductsUpdated);
      window.removeEventListener('storage', handleProductsUpdated);
    };
  }, []);

  useEffect(() => {
    if (initialSection && initialSection !== activeSection) {
      setActiveSection(initialSection);
    }
  }, [initialSection]);

  const scrollCategories = (direction) => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Filter products by section, category, and search query
  const filterProducts = (items) => {
    return items.filter((item) => {
      const itemType = (item.type || 'cajas').toLowerCase();
      const currentSec = (activeSection || 'all').toLowerCase();
      const matchesSection = currentSec === 'all' || itemType === currentSec;

      const itemCategory = (item.category || '').toLowerCase();
      const currentCat = (selectedCategory || 'all').toLowerCase();
      const matchesCategory = currentCat === 'all' || itemCategory === currentCat || (item.categoryName && item.categoryName.toLowerCase().includes(currentCat));

      const query = searchTerm.trim().toLowerCase();
      const matchesSearch =
        query === '' ||
        (item.name && item.name.toLowerCase().includes(query)) ||
        (item.categoryName && item.categoryName.toLowerCase().includes(query)) ||
        (item.description && item.description.toLowerCase().includes(query)) ||
        (item.ref && item.ref.toLowerCase().includes(query));

      return matchesSection && matchesCategory && matchesSearch;
    });
  };

  // Sort products
  const sortProducts = (items) => {
    const list = [...items];
    if (sortBy === 'price-low') return list.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') return list.sort((a, b) => b.price - a.price);
    if (sortBy === 'name') return list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    return list;
  };

  const allFiltered = filterProducts(allProducts);

  const featuredItems = sortProducts(
    allFiltered.filter((p) => p.featured === true || p.featured === 'true' || p.featured === 1)
  );

  const forYouRaw = allFiltered.filter((p) => p.forYou === true || p.forYou === 'true' || p.forYou === 1);
  const forYouItemsAll = sortProducts(
    forYouRaw.length > 0 ? forYouRaw : allFiltered
  );

  const itemsPerPage = 10;
  const totalPages = Math.ceil(forYouItemsAll.length / itemsPerPage) || 1;
  const displayedForYou = forYouItemsAll.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const visibleCategories = categoriesList.filter(
    (c) => c.id === 'all' || activeSection === 'all' || !c.type || c.type === activeSection
  );

  const activeFiltersCount = (selectedCategory !== 'all' ? 1 : 0) + (activeSection !== 'all' ? 1 : 0);

  const handleWhatsAppOrder = (product) => {
    const message = encodeURIComponent(
      `¡Hola! Quisiera información y pedir ${selectedQty} unidad(es) de: *${product.name}* (Precio: $${(product.price * selectedQty).toFixed(2)})`
    );
    window.open(`https://wa.me/584120177993?text=${message}`, '_blank');
  };

  return (
    <section id="productos" className="py-8 sm:py-10 pb-20 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ═══════════════════════════════════════════ */}
        {/* BARRA DE BÚSQUEDA Y ORDENAMIENTO LIMPIA Y VISIBLE */}
        {/* ═══════════════════════════════════════════ */}
        <div className="max-w-4xl mx-auto mb-8 relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
            {/* Search Input */}
            <div className="relative w-full sm:flex-1 flex items-center bg-[#f0f3f6] rounded-full px-5 py-3.5 shadow-sm border border-gray-300 focus-within:border-[#00c2ff] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#00c2ff]/15 transition-all">
              <svg className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar cajas, arreglos, eventos..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-transparent border-none text-gray-900 placeholder-gray-500 font-semibold focus:outline-none text-sm md:text-base"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 flex-shrink-0 cursor-pointer rounded-full hover:bg-gray-200"
                  title="Limpiar búsqueda"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Dropdown Ordenar por */}
            <div className="flex items-center gap-2 px-4 py-3 bg-[#f0f3f6] rounded-full border border-gray-300 self-end sm:self-auto flex-shrink-0 shadow-sm">
              <span className="text-xs font-bold text-gray-700 whitespace-nowrap">Ordenar por:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none text-xs font-bold text-gray-900 focus:outline-none cursor-pointer pr-1"
              >
                <option value="default">Relevancia</option>
                <option value="price-low">Menor Precio</option>
                <option value="price-high">Mayor Precio</option>
                <option value="name">Nombre (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════ */}
        {/* 3. CATEGORY CAROUSEL (Miniaturas + Pills Centradas) */}
        {/* ═══════════════════════════════════════════ */}
        <div className="relative mb-10 max-w-5xl mx-auto">
          {/* Left arrow */}
          <button
            onClick={() => scrollCategories('left')}
            className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-9 sm:h-9 bg-white shadow-md border border-gray-200 rounded-full flex items-center justify-center text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-all cursor-pointer"
            aria-label="Anterior"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Carousel container */}
          <div
            ref={categoryScrollRef}
            className="flex items-center gap-4 sm:gap-6 overflow-x-auto py-2 px-6 justify-start sm:justify-center scroll-smooth scrollbar-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {visibleCategories.filter((c) => c.id !== 'all').map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(isSelected ? 'all' : cat.id)}
                  className="flex flex-col items-center flex-shrink-0 cursor-pointer group transition-transform duration-300 hover:scale-105"
                >
                  {/* Category Image Box */}
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl p-2 shadow-sm border flex items-center justify-center mb-1.5 transition-all ${isSelected ? 'border-[#00c2ff] ring-2 ring-[#00c2ff]/30 shadow-md' : 'border-gray-100 group-hover:shadow-md'
                    }`}>
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Cyan Pill Badge */}
                  <span
                    className={`px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-black shadow-sm transition-all text-white text-center whitespace-nowrap ${isSelected
                        ? 'bg-sky-600 shadow-md scale-105'
                        : 'bg-[#00c2ff] hover:bg-[#00b0e6]'
                      }`}
                  >
                    {cat.name}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scrollCategories('right')}
            className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-9 sm:h-9 bg-white shadow-md border border-gray-200 rounded-full flex items-center justify-center text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-all cursor-pointer"
            aria-label="Siguiente"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* ═══════════════════════════════════════════ */}
        {/* 4. PROMOCIONES */}
        {/* ═══════════════════════════════════════════ */}
        <div className="mb-12 max-w-5xl mx-auto">
          <h2
            className="text-xl sm:text-2xl font-black text-gray-900 mb-4"
            style={{ fontFamily: "'Fredoka One', cursive" }}
          >
            Promociones
          </h2>

          <div className="relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-md p-5 sm:p-7">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
              {/* Promo Left Details */}
              <div className="space-y-2.5">
                <div className="inline-flex items-center gap-2 bg-[#ffdd00] text-gray-900 font-black text-[11px] sm:text-xs uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                  <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  SPECIAL PROMO
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-[#0f172a] tracking-tight leading-tight">
                  HASTA AGOTAR EXISTENCIA
                </h3>

                <p className="text-xs sm:text-sm font-bold italic text-gray-800">
                  Dos tamaños disponibles
                </p>

                <p className="text-xs font-semibold italic text-gray-500">
                  Efecto espejo
                </p>

                {/* Brand & Social */}
                <div className="flex items-center gap-3 pt-1">
                  <img src={logo} alt="Tu Cajita" className="w-9 h-9 object-contain" />
                  <div>
                    <p className="text-xs font-bold text-gray-800">DISTRIBUIDORA</p>
                    <p className="text-[10px] text-gray-500">+58 424 7465717</p>
                  </div>
                </div>
              </div>

              {/* Promo Right Boxes Graphic */}
              <div className="relative flex items-center justify-center">
                <img
                  src={empaquesLujo}
                  alt="Promoción cajas"
                  className="max-h-40 sm:max-h-52 object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Carousel Dots */}
            <div className="flex justify-center gap-1.5 mt-4">
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveBannerSlide(idx)}
                  className={`h-1.5 rounded-full transition-all ${activeBannerSlide === idx ? 'bg-[#00c2ff] w-6' : 'bg-gray-300 w-2'
                    }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Estado Vacío cuando no coincide la búsqueda */}
        {allFiltered.length === 0 ? (
          <div className="bg-cyan-50/60 rounded-3xl p-10 text-center border border-cyan-100 max-w-lg mx-auto my-8 animate-[fadeIn_0.3s_ease]">
            <span className="text-4xl mb-3 block">🔍</span>
            <h3 className="text-lg font-black text-gray-900 mb-1">No se encontraron productos</h3>
            <p className="text-gray-600 font-medium text-xs sm:text-sm mb-4">
              {searchTerm ? `No hay resultados para "${searchTerm}"` : 'No hay productos disponibles para este filtro o categoría.'}
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchTerm('');
              }}
              className="px-6 py-2.5 bg-[#00c2ff] hover:bg-[#00b0e6] text-white rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-md hover:shadow-lg"
            >
              Limpiar búsqueda y filtros
            </button>
          </div>
        ) : (
          <>
            {/* ═══════════════════════════════════════════ */}
            {/* 5. DESTACADOS (Solo si existen destacados en este filtro) */}
            {/* ═══════════════════════════════════════════ */}
            {featuredItems.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center justify-between mb-4 pb-1 border-b border-gray-100">
                  <h2
                    className="text-xl sm:text-2xl font-black text-gray-900"
                    style={{ fontFamily: "'Fredoka One', cursive" }}
                  >
                    Destacados
                  </h2>
                  <span className="text-xs text-gray-500 font-semibold bg-gray-100 px-2.5 py-1 rounded-full">
                    {featuredItems.length} producto(s)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5 justify-items-center sm:justify-items-stretch">
                  {featuredItems.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => onSelectProduct ? onSelectProduct(product) : setSelectedProduct(product)}
                      className="w-full max-w-[240px] sm:max-w-none bg-[#FFFBEB] rounded-2xl p-3 sm:p-3.5 shadow-sm border border-amber-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
                    >
                      {/* Image Container */}
                      <div className="bg-white rounded-xl p-2.5 aspect-square flex items-center justify-center shadow-inner mb-2.5 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      {/* Info */}
                      <div>
                        <h3 className="font-extrabold text-xs sm:text-sm text-gray-900 mb-0.5 truncate group-hover:text-amber-600 transition-colors" title={product.name}>
                          {product.name}
                        </h3>
                        <p className="text-sm sm:text-base font-black text-gray-900 mb-0.5">
                          ${product.price.toFixed(2)}
                        </p>
                        <p className="text-[10px] sm:text-[11px] text-gray-500 font-medium truncate">
                          {product.categoryName}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════ */}
            {/* 6. PARA TI (Tarjetas Compactas Cyan con ★) */}
            {/* ═══════════════════════════════════════════ */}
            {displayedForYou.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center justify-between mb-4 pb-1 border-b border-gray-100">
                  <h2
                    className="text-xl sm:text-2xl font-black text-gray-900"
                    style={{ fontFamily: "'Fredoka One', cursive" }}
                  >
                    Para ti
                  </h2>
                  <span className="text-xs text-gray-500 font-semibold bg-gray-100 px-2.5 py-1 rounded-full">
                    {forYouItemsAll.length} producto(s)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5 justify-items-center sm:justify-items-stretch mb-8">
                  {displayedForYou.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => onSelectProduct ? onSelectProduct(product) : setSelectedProduct(product)}
                      className="w-full max-w-[240px] sm:max-w-none relative bg-[#E0F7FA] rounded-2xl p-3 sm:p-3.5 shadow-sm border border-cyan-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
                    >
                      {/* Top Right Star Badge */}
                      <div className="absolute top-2.5 right-2.5 z-10 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border border-amber-200">
                        <span className="text-amber-400 text-xs font-bold">★</span>
                      </div>

                      {/* Image Container */}
                      <div className="bg-white rounded-xl p-2.5 aspect-square flex items-center justify-center shadow-inner mb-2.5 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      {/* Info */}
                      <div>
                        <h3 className="font-extrabold text-xs sm:text-sm text-gray-900 mb-0.5 truncate group-hover:text-cyan-600 transition-colors" title={product.name}>
                          {product.name}
                        </h3>
                        <p className="text-sm sm:text-base font-black text-gray-900 mb-0.5">
                          ${product.price.toFixed(2)}
                        </p>
                        <p className="text-[10px] sm:text-[11px] text-gray-500 font-medium truncate">
                          {product.categoryName}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Buttons */}
                {totalPages > 1 && (
                  <div className="flex items-center gap-2 justify-center">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 rounded-xl font-black text-xs sm:text-sm transition-all shadow-sm cursor-pointer ${currentPage === page
                          ? 'bg-[#00c2ff] text-white shadow-md scale-105'
                          : 'bg-cyan-100 text-cyan-800 hover:bg-cyan-200'
                          }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
