import { useState, useRef } from 'react';
import { productsData, categoriesList } from '../data/productsData';
import empaquesLujo from '../assets/empaques_lujo.png';
import sampleCasita from '../assets/sample_casita.png';
import sampleHappyday from '../assets/sample_happyday.png';
import logo from '../assets/logo.png';

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedQty, setSelectedQty] = useState(1);
  const [activeBannerSlide, setActiveBannerSlide] = useState(0);

  const categoryScrollRef = useRef(null);

  const scrollCategories = (direction) => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Filter products
  const filterProducts = (items) => {
    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.categoryName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  };

  // Sort products
  const sortProducts = (items) => {
    const list = [...items];
    if (sortBy === 'price-low') return list.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') return list.sort((a, b) => b.price - a.price);
    if (sortBy === 'name') return list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  };

  const featuredItems = sortProducts(filterProducts(productsData.filter((p) => p.featured)));
  const forYouItemsAll = sortProducts(filterProducts(productsData.filter((p) => p.forYou)));

  const itemsPerPage = 9;
  const totalPages = Math.ceil(forYouItemsAll.length / itemsPerPage) || 1;
  const displayedForYou = forYouItemsAll.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleWhatsAppOrder = (product) => {
    const message = encodeURIComponent(
      `¡Hola! Quisiera información y pedir ${selectedQty} unidad(es) de: *${product.name}* (Precio: $${(product.price * selectedQty).toFixed(2)})`
    );
    window.open(`https://wa.me/584247465717?text=${message}`, '_blank');
  };

  return (
    <section id="productos" className="pt-24 pb-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ═══════════════════════════════════════════ */}
        {/* 1. HEADER: Descubre + Explora */}
        {/* ═══════════════════════════════════════════ */}
        <div className="flex items-center justify-between mb-4 pt-2">
          <h1
            className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight"
            style={{ fontFamily: "'Fredoka One', cursive" }}
          >
            Descubre
          </h1>
          <span className="text-gray-900 font-bold text-xs sm:text-sm md:text-base">
            Explora en nuestras categorías
          </span>
        </div>

        {/* ═══════════════════════════════════════════ */}
        {/* 2. SEARCH BAR + FILTROS (ORDENAR POR) */}
        {/* ═══════════════════════════════════════════ */}
        <div className="flex items-center justify-between gap-3 sm:gap-6 mb-6">
          {/* Search Input */}
          <div className="relative flex-1 flex items-center bg-[#f3f4f6] rounded-full px-4 py-2.5 sm:py-3 shadow-inner border border-gray-200">
            <svg className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <input
              type="text"
              placeholder="Buscar productos"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-none text-gray-800 placeholder-gray-500 font-medium focus:outline-none text-xs sm:text-sm md:text-base"
            />
            <button className="text-gray-600 hover:text-gray-900 transition-colors p-1 flex-shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* Filter & Ordenar Por */}
          <div className="flex flex-col items-end flex-shrink-0">
            <div className="flex items-center gap-1.5 cursor-pointer">
              {/* Funnel Icon */}
              <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              {/* Badge 0 */}
              <span className="bg-[#858f9f] text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded shadow-sm">
                0
              </span>
            </div>
            {/* Dropdown Ordenar por */}
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[11px] sm:text-xs font-bold text-gray-900 whitespace-nowrap">Ordenar por</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none text-[11px] sm:text-xs font-semibold text-gray-600 focus:outline-none cursor-pointer"
              >
                <option value="default">Relevancia</option>
                <option value="price-low">Menor Precio</option>
                <option value="price-high">Mayor Precio</option>
                <option value="name">Nombre</option>
              </select>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════ */}
        {/* 3. CATEGORY CAROUSEL (Miniaturas + Pills) */}
        {/* ═══════════════════════════════════════════ */}
        <div className="relative mb-10">
          {/* Left arrow */}
          <button
            onClick={() => scrollCategories('left')}
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-9 sm:h-9 bg-white shadow-md border border-gray-200 rounded-full flex items-center justify-center text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-all cursor-pointer"
            aria-label="Anterior"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Carousel container */}
          <div
            ref={categoryScrollRef}
            className="flex items-center gap-4 sm:gap-6 overflow-x-auto py-2 px-6 scroll-smooth scrollbar-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categoriesList.slice(1).map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(isSelected ? 'all' : cat.id)}
                  className="flex flex-col items-center flex-shrink-0 cursor-pointer group transition-transform duration-300 hover:scale-105"
                >
                  {/* Category Image Box */}
                  <div className={`w-18 h-18 sm:w-22 sm:h-22 bg-white rounded-2xl p-2 shadow-sm border flex items-center justify-center mb-2 transition-all ${
                    isSelected ? 'border-[#00c2ff] ring-2 ring-[#00c2ff]/30 shadow-md' : 'border-gray-100 group-hover:shadow-md'
                  }`}>
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Cyan Pill Badge */}
                  <span
                    className={`px-3 sm:px-4 py-1 rounded-full text-[10px] sm:text-xs font-black shadow-sm transition-all text-white text-center whitespace-nowrap ${
                      isSelected
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
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-9 sm:h-9 bg-white shadow-md border border-gray-200 rounded-full flex items-center justify-center text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-all cursor-pointer"
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
        <div className="mb-12">
          <h2
            className="text-2xl sm:text-3xl font-black text-gray-900 mb-5"
            style={{ fontFamily: "'Fredoka One', cursive" }}
          >
            Promociones
          </h2>

          <div className="relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-md p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
              
              {/* Promo Left Details */}
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 bg-[#ffdd00] text-gray-900 font-black text-[11px] sm:text-xs uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                  <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  SPECIAL PROMO
                </div>

                <h3 className="text-2xl sm:text-4xl font-black text-[#0f172a] tracking-tight leading-tight">
                  HASTA AGOTAR EXISTENCIA
                </h3>

                <p className="text-sm sm:text-base font-bold italic text-gray-800">
                  Dos tamaños disponibles
                </p>

                <p className="text-xs sm:text-sm font-semibold italic text-gray-500">
                  Efecto espejo
                </p>

                {/* Brand & Social */}
                <div className="flex items-center gap-3 pt-2">
                  <img src={logo} alt="Tu Cajita" className="w-10 h-10 object-contain" />
                  <div>
                    <p className="text-xs font-bold text-gray-800">DISTRIBUIDORA</p>
                    <p className="text-[10px] text-gray-500">+58 424 7465717</p>
                  </div>
                </div>
              </div>

              {/* Promo Right Boxes Graphic */}
              <div className="relative flex items-center justify-center gap-4">
                <img
                  src={empaquesLujo}
                  alt="Promoción cajas"
                  className="max-h-48 sm:max-h-60 object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
                />
              </div>

            </div>

            {/* Carousel Dots */}
            <div className="flex justify-center gap-1.5 mt-6">
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveBannerSlide(idx)}
                  className={`h-2 rounded-full transition-all ${
                    activeBannerSlide === idx ? 'bg-[#00c2ff] w-6' : 'bg-gray-300 w-2'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════ */}
        {/* 5. DESTACADOS (Tarjetas Cream) */}
        {/* ═══════════════════════════════════════════ */}
        <div className="mb-14">
          <h2
            className="text-2xl sm:text-3xl font-black text-gray-900 mb-6"
            style={{ fontFamily: "'Fredoka One', cursive" }}
          >
            Destacados
          </h2>

          {featuredItems.length === 0 ? (
            <p className="text-gray-500 italic">No se encontraron productos destacados.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {featuredItems.map((product) => (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="bg-[#FFFBEB] rounded-3xl p-4 sm:p-5 shadow-sm border border-amber-100 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
                >
                  {/* Image Container */}
                  <div className="bg-white rounded-2xl p-3 sm:p-4 aspect-square flex items-center justify-center shadow-inner mb-3 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Info */}
                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg text-gray-900 mb-0.5 truncate group-hover:text-amber-600 transition-colors">
                      Producto
                    </h3>
                    <p className="text-base sm:text-xl font-black text-gray-800 mb-0.5">
                      ${product.price.toFixed(2)}
                    </p>
                    <p className="text-[11px] sm:text-xs text-gray-500 font-medium truncate">
                      {product.categoryName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════ */}
        {/* 6. PARA TI (Tarjetas Cyan con Estrella ★) */}
        {/* ═══════════════════════════════════════════ */}
        <div className="mb-14">
          <h2
            className="text-2xl sm:text-3xl font-black text-gray-900 mb-6"
            style={{ fontFamily: "'Fredoka One', cursive" }}
          >
            Para ti
          </h2>

          {displayedForYou.length === 0 ? (
            <p className="text-gray-500 italic">No hay productos en esta selección.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
              {displayedForYou.map((product) => (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="relative bg-[#E0F7FA] rounded-3xl p-4 sm:p-5 shadow-sm border border-cyan-100 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
                >
                  {/* Top Right Star Badge */}
                  <div className="absolute top-3 right-3 z-10 w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full shadow-md flex items-center justify-center border border-amber-200">
                    <span className="text-amber-400 text-sm sm:text-base font-bold">★</span>
                  </div>

                  {/* Image Container */}
                  <div className="bg-white rounded-2xl p-3 sm:p-4 aspect-square flex items-center justify-center shadow-inner mb-3 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Info */}
                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg text-gray-900 mb-0.5 truncate group-hover:text-cyan-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-base sm:text-xl font-black text-gray-800 mb-0.5">
                      ${product.price.toFixed(2)}
                    </p>
                    <p className="text-[11px] sm:text-xs text-gray-500 font-medium truncate">
                      {product.categoryName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Buttons (1, 2, 3) */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-black text-xs sm:text-sm transition-all shadow-sm cursor-pointer ${
                    currentPage === page
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

      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* MODAL DETALLE DE PRODUCTO */}
      {/* ═══════════════════════════════════════════ */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100 overflow-hidden animate-[fadeIn_0.3s_ease]">
            {/* Close button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 w-9 h-9 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center transition-colors font-bold text-lg cursor-pointer"
              aria-label="Cerrar modal"
            >
              ✕
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-full h-56 bg-amber-50/60 rounded-2xl p-4 flex items-center justify-center mb-5 border border-amber-100">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="max-h-full max-w-full object-contain drop-shadow-md"
                />
              </div>

              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                {selectedProduct.categoryName}
              </span>

              <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-1">
                {selectedProduct.name}
              </h3>

              <p className="text-2xl sm:text-3xl font-black text-amber-600 mb-3">
                ${selectedProduct.price.toFixed(2)}
              </p>

              <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                {selectedProduct.description}
              </p>

              {/* Quantity */}
              <div className="flex items-center gap-3 mb-5">
                <span className="text-sm font-bold text-gray-700">Cantidad:</span>
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-gray-50">
                  <button
                    onClick={() => setSelectedQty((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 text-gray-700 hover:bg-gray-200 font-bold cursor-pointer"
                  >
                    −
                  </button>
                  <span className="px-4 py-1.5 font-bold text-gray-900">{selectedQty}</span>
                  <button
                    onClick={() => setSelectedQty((q) => q + 1)}
                    className="px-3 py-1.5 text-gray-700 hover:bg-gray-200 font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* WhatsApp button */}
              <button
                onClick={() => handleWhatsAppOrder(selectedProduct)}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-base cursor-pointer"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Pedir por WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
