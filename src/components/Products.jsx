import { useState, useRef } from 'react';
import { productsData, categoriesList } from '../data/productsData';

// ✅ Acepta onSelectProduct para navegar al detalle
export default function Products({ onSelectProduct }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeBannerSlide, setActiveBannerSlide] = useState(0);

  const categoryScrollRef = useRef(null);

  const scrollCategories = (direction) => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Filtrar productos
  const filterProducts = (items) => {
    return items.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.categoryName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  };

  // Ordenar productos
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

  // ✅ WhatsApp con número correcto
  const handleWhatsAppOrder = (product) => {
    const message = encodeURIComponent(
      `¡Hola Tu Cajita! 👋 Quisiera información sobre: *${product.name}* (Precio: $${product.price.toFixed(2)})`
    );
    window.open(`https://wa.me/584146146237?text=${message}`, '_blank');
  };

  // Tarjeta de producto reutilizable
  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
      {/* Imagen */}
      <div
        className="relative h-48 sm:h-52 bg-[#f8fafc] flex items-center justify-center p-4 cursor-pointer"
        onClick={() => onSelectProduct && onSelectProduct(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-[#FFD54F] text-gray-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
            {product.badge}
          </span>
        )}
        {product.stock <= 10 && (
          <span className="absolute top-3 right-3 bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
            ⚡ {product.stock} disp.
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1">
          {product.categoryName}
        </p>
        <h3
          className="font-black text-gray-900 text-sm leading-tight mb-1 cursor-pointer hover:text-[#00C2FF] transition-colors"
          onClick={() => onSelectProduct && onSelectProduct(product)}
        >
          {product.name}
        </h3>

        {/* Tallas disponibles */}
        {product.sizes && (
          <div className="flex gap-1.5 mb-2 flex-wrap">
            {product.sizes.map((s) => (
              <span key={s} className="text-[10px] font-bold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-md">
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Colores */}
        {product.colors && (
          <div className="flex gap-1.5 mb-3">
            {product.colors.map((c, i) => (
              <span
                key={i}
                title={c.name}
                className="w-4 h-4 rounded-full border border-white shadow-sm"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-2">
          <span className="text-lg font-black text-gray-900">${product.price.toFixed(2)}</span>
          <button
            onClick={() => onSelectProduct && onSelectProduct(product)}
            className="px-4 py-2 bg-[#00C2FF] hover:bg-[#00A8DE] text-white font-bold rounded-xl text-xs transition active:scale-95"
          >
            Ver detalles
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <section id="productos" className="pt-24 pb-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ─── Header ─── */}
        <div className="flex items-center justify-between mb-4 pt-2">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight" style={{ fontFamily: "'Fredoka One', cursive" }}>
            Descubre
          </h1>
          <span className="text-gray-900 font-bold text-xs sm:text-sm md:text-base">
            Explora en nuestras categorías
          </span>
        </div>

        {/* ─── Buscador + Ordenar ─── */}
        <div className="flex items-center justify-between gap-3 sm:gap-6 mb-6">
          <div className="relative flex-1 flex items-center bg-[#f3f4f6] rounded-full px-4 py-2.5 sm:py-3 shadow-inner border border-gray-200">
            <svg className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar productos"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full bg-transparent border-none text-gray-800 placeholder-gray-400 font-medium focus:outline-none text-xs sm:text-sm"
            />
          </div>

          <div className="flex flex-col items-end flex-shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00C2FF]/30 cursor-pointer"
            >
              <option value="default">Ordenar por</option>
              <option value="price-low">Precio: menor a mayor</option>
              <option value="price-high">Precio: mayor a menor</option>
              <option value="name">Nombre A-Z</option>
            </select>
          </div>
        </div>

        {/* ─── Filtro de Categorías ─── */}
        <div className="relative mb-8">
          <button
            onClick={() => scrollCategories('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-gray-900 transition"
          >‹</button>

          <div
            ref={categoryScrollRef}
            className="flex gap-3 overflow-x-auto scroll-smooth pb-2 px-10"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categoriesList.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); setCurrentPage(1); }}
                className={`flex-shrink-0 flex flex-col items-center gap-2 px-4 py-2.5 rounded-2xl border-2 transition-all ${
                  selectedCategory === cat.id
                    ? 'border-[#00C2FF] bg-[#D2E7EA] shadow-sm'
                    : 'border-transparent bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-white">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-[10px] font-bold text-gray-700 text-center leading-tight max-w-[72px]">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={() => scrollCategories('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-gray-900 transition"
          >›</button>
        </div>

        {/* ─── Productos Destacados ─── */}
        {featuredItems.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-gray-900">⭐ Destacados</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredItems.slice(0, 3).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* ─── Para Ti ─── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-gray-900">🎁 Para ti</h2>
            <span className="text-xs text-gray-500">
              {forYouItemsAll.length} producto{forYouItemsAll.length !== 1 ? 's' : ''}
            </span>
          </div>

          {displayedForYou.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-sm font-semibold">No encontramos productos con ese criterio</p>
              <button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }} className="mt-3 text-xs text-[#00C2FF] font-bold hover:underline">
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedForYou.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-40 flex items-center justify-center text-gray-700 font-bold transition"
              >‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-xl text-sm font-bold transition ${
                    currentPage === page
                      ? 'bg-[#00C2FF] text-white shadow'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-40 flex items-center justify-center text-gray-700 font-bold transition"
              >›</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}