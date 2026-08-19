import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { productsData as defaultProducts } from '../data/productsData';
import empaquesLujo from '../assets/empaques_lujo.png';
import sampleCasita from '../assets/sample_casita.png';
import sampleHappyday from '../assets/sample_happyday.png';
import unicolor from '../assets/unicolor.png';
import pequenos from '../assets/pequenos.png';

export default function ProductDetail({ product, onBack, onSelectProduct, setCurrentView, user }) {
  const { addToCart } = useCart();
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState('coral');
  const [selectedSize, setSelectedSize] = useState('M');
  const [activeTab, setActiveTab] = useState('description');
  const [addedToast, setAddedToast] = useState(false);
  const isClient = Boolean(user && user.type !== 'admin' && user.role !== 'admin' && user.role !== 'Administrador');

  // Fallback defaults palette
  const allColorOptions = [
    { id: 'black', name: 'Negro', hex: '#111827' },
    { id: 'coral', name: 'Rosa Coral', hex: '#f07c82' },
    { id: 'white', name: 'Blanco', hex: '#ffffff' },
    { id: 'gold', name: 'Dorado Luxury', hex: '#eab308' },
    { id: 'blue', name: 'Azul Celeste', hex: '#38bdf8' },
    { id: 'red', name: 'Rojo Pasión', hex: '#ef4444' },
    { id: 'kraft', name: 'Kraft / Madera', hex: '#c29b68' },
  ];

  const allSizeOptions = [
    { id: 'P', label: 'P', desc: 'Pequeña (15x15x8 cm)' },
    { id: 'M', label: 'M', desc: 'Mediana (20x20x10 cm)' },
    { id: 'G', label: 'G', desc: 'Grande (25,5x19x9 cm)' },
    { id: 'EG', label: 'EG', desc: 'Extra Grande (30x30x12 cm)' },
  ];

  // Resolve available colors for this specific product
  const availableColors = (product?.colors && product.colors.length > 0)
    ? product.colors.map((c) => (typeof c === 'string' ? allColorOptions.find((opt) => opt.id === c) || { id: c, name: c, hex: '#111827' } : c))
    : [
        allColorOptions.find((c) => c.id === 'black'),
        allColorOptions.find((c) => c.id === 'coral'),
        allColorOptions.find((c) => c.id === 'white'),
      ].filter(Boolean);

  // Resolve available sizes for this specific product
  const availableSizes = (product?.sizes && product.sizes.length > 0)
    ? product.sizes.map((s) => (typeof s === 'string' ? allSizeOptions.find((opt) => opt.id === s) || { id: s, label: s, desc: `Medida ${s}` } : s))
    : allSizeOptions;

  // Resolve gallery images: combines main image and any secondary uploaded images
  const galleryImages = (() => {
    if (!product) return [];
    const imgs = [];
    if (product.image) imgs.push(product.image);
    if (Array.isArray(product.gallery) && product.gallery.length > 0) {
      product.gallery.forEach((g) => {
        if (g && !imgs.includes(g)) imgs.push(g);
      });
    }
    if (Array.isArray(product.images) && product.images.length > 0) {
      product.images.forEach((g) => {
        if (g && !imgs.includes(g)) imgs.push(g);
      });
    }
    // If fewer than 4, fill with angle variations
    const fallbacks = [sampleHappyday, sampleCasita, empaquesLujo, unicolor];
    fallbacks.forEach((fb) => {
      if (imgs.length < 4 && !imgs.includes(fb)) {
        imgs.push(fb);
      }
    });
    return imgs.slice(0, 5);
  })();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedImageIdx(0);
    setAddedToast(false);
    if (availableColors.length > 0) {
      setSelectedColor(availableColors[0].id);
    }
    if (availableSizes.length > 0) {
      setSelectedSize(availableSizes[0].id);
    }
  }, [product?.id]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">No se seleccionó ningún producto</h2>
        <button
          onClick={onBack}
          className="px-6 py-3 bg-[#00cbf4] hover:bg-[#00b5dc] text-white font-bold rounded-2xl shadow transition-all cursor-pointer"
        >
          Volver al Catálogo
        </button>
      </div>
    );
  }

  const relatedProducts = defaultProducts
    .filter((p) => p.id !== product.id && (p.type === product.type || p.category === product.category || p.featured))
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!isClient && !user) {
      if (setCurrentView) setCurrentView('login');
      return;
    }
    const colorObj = availableColors.find((c) => c.id === selectedColor);
    const sizeObj = availableSizes.find((s) => s.id === selectedSize);
    addToCart({
      ...product,
      selectedColor: colorObj?.id || selectedColor,
      selectedColorName: colorObj?.name || selectedColor,
      selectedSize: sizeObj?.label || selectedSize,
      selectedSizeDesc: sizeObj?.desc || '',
    }, 1);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2200);
  };

  const handleWhatsAppOrder = () => {
    const colorName = availableColors.find((c) => c.id === selectedColor)?.name || selectedColor;
    const sizeLabel = availableSizes.find((s) => s.id === selectedSize)?.label || selectedSize;
    const message = encodeURIComponent(
      `¡Hola Tu Cajita! 👋 Quisiera información y pedir:\n- Producto: *${product.name}*\n- Medida: *${sizeLabel}*\n- Color: *${colorName}*\n- Precio: *$${product.price.toFixed(2)}*`
    );
    window.open(`https://wa.me/584120177993?text=${message}`, '_blank');
  };

  const sectionName = product.type === 'cajas' ? 'Cajas' : product.type === 'arreglos' ? 'Arreglos' : product.type === 'eventos' ? 'Eventos' : 'Catálogo';

  return (
    <div className="bg-white min-h-screen pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">

        {/* ══════════ BREADCRUMB ══════════ */}
        <nav className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-6">
          <button
            onClick={() => setCurrentView('home')}
            className="hover:text-gray-900 transition-colors cursor-pointer bg-transparent border-none p-0"
          >
            Inicio
          </button>
          <span>/</span>
          <button
            onClick={() => { setCurrentView(product.type || 'productos'); }}
            className="hover:text-gray-900 transition-colors cursor-pointer bg-transparent border-none p-0"
          >
            {sectionName}
          </button>
        </nav>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/*  ESTRUCTURA DE 3 SECCIONES:                                    */}
        {/*  1. Miniaturas a la izquierda                                 */}
        {/*  2. Imagen grande en el medio                                 */}
        {/*  3. Resto de información a la derecha con interlineado 1.5    */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start mb-8">

          {/* ═══ SECCIÓN 1: MINIATURAS (IZQUIERDA) ═══ */}
          <div className="md:col-span-2 flex flex-row md:flex-col gap-3 justify-center md:justify-start overflow-x-auto md:overflow-visible py-1">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIdx(idx)}
                className={`w-18 h-18 sm:w-20 sm:h-20 lg:w-22 lg:h-22 rounded-2xl p-2 bg-white border-2 flex-shrink-0 transition-all cursor-pointer shadow-sm hover:scale-105 ${
                  selectedImageIdx === idx
                    ? 'border-[#0f172a] ring-2 ring-gray-900/20 shadow-md'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
                aria-label={`Ver vista ${idx + 1}`}
              >
                <img src={img} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>

          {/* ═══ SECCIÓN 2: IMAGEN GRANDE (MEDIO) ═══ */}
          <div className="md:col-span-6 relative flex flex-col items-center group">
            {/* Estrella dorada en la esquina superior */}
            <div className="absolute top-2 right-4 z-10">
              <span className="text-amber-400 text-3xl drop-shadow">★</span>
            </div>

            {/* Contenedor imagen grande */}
            <div className="relative w-full bg-white rounded-3xl p-6 flex items-center justify-center min-h-[340px] sm:min-h-[420px]">
              {/* Flecha izquierda */}
              <button
                onClick={() => setSelectedImageIdx((p) => (p === 0 ? galleryImages.length - 1 : p - 1))}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer"
                aria-label="Imagen anterior"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Imagen central */}
              <img
                src={galleryImages[selectedImageIdx]}
                alt={product.name}
                className="max-h-[360px] max-w-full object-contain drop-shadow-xl transition-all duration-300 group-hover:scale-105"
              />

              {/* Flecha derecha */}
              <button
                onClick={() => setSelectedImageIdx((p) => (p === galleryImages.length - 1 ? 0 : p + 1))}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer"
                aria-label="Siguiente imagen"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Puntos indicadores del carrusel */}
            <div className="flex items-center justify-center gap-1.5 mt-4">
              {galleryImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    selectedImageIdx === idx ? 'bg-gray-800 w-5' : 'bg-gray-300 w-2 hover:bg-gray-400'
                  }`}
                  aria-label={`Ir a imagen ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* ═══ SECCIÓN 3: RESTO DE INFORMACIÓN (DERECHA - ESPACIADO Y 1.5 INTERLINEADO) ═══ */}
          <div className="md:col-span-4 flex flex-col">
            <div className="bg-[#dce7eb] rounded-3xl p-6 sm:p-7 shadow-sm border border-[#cadbe1] space-y-6">

              {/* Nombre del producto */}
              <div className="space-y-1.5">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-[1.4] tracking-tight">
                  {product.name}
                </h1>
                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-xs font-semibold text-gray-500 tracking-wide">Precio exclusivo</span>
                  <p className="text-2xl sm:text-3xl font-black text-gray-950">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Color (Solo los disponibles para este producto) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-black uppercase tracking-wider text-gray-800">
                    Color: <span className="font-semibold text-gray-600 capitalize">{availableColors.find((c) => c.id === selectedColor)?.name}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {availableColors.map((col) => (
                    <button
                      key={col.id}
                      onClick={() => setSelectedColor(col.id)}
                      className={`w-9 h-9 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center shadow-sm ${
                        selectedColor === col.id
                          ? 'ring-2 ring-gray-900 ring-offset-2 scale-110 border-white'
                          : 'border-gray-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: col.hex }}
                      title={col.name}
                      aria-label={col.name}
                    >
                      {selectedColor === col.id && (
                        <span className={`text-[11px] font-bold ${col.id === 'white' || col.hex === '#ffffff' ? 'text-gray-900' : 'text-white'}`}>
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Medidas (Solo las disponibles para este producto) */}
              <div className="space-y-2.5">
                <p className="text-xs font-black uppercase tracking-wider text-gray-800">
                  Medidas
                </p>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {availableSizes.map((sz) => (
                    <button
                      key={sz.id}
                      onClick={() => setSelectedSize(sz.id)}
                      className={`w-11 h-11 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center shadow-sm ${
                        selectedSize === sz.id
                          ? 'bg-[#ffcc00] text-gray-950 ring-2 ring-amber-400 scale-105 shadow-md'
                          : 'bg-gray-300/70 text-gray-700 hover:bg-gray-300'
                      }`}
                      title={sz.desc}
                    >
                      {sz.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-600 font-medium leading-[1.6] pt-1">
                  {availableSizes.find((s) => s.id === selectedSize)?.desc || 'Detalles de las medidas, incluyendo si es de medida única'}
                </p>
              </div>

              {/* Descripción con 1.5 de interlineado */}
              <div className="pt-2">
                <div className="border-b border-gray-300 pb-1.5 mb-3.5">
                  <h3 className="text-xs sm:text-sm font-black text-gray-900 pb-1">
                    Descripción
                  </h3>
                </div>

                <div className="text-xs font-semibold text-gray-800 space-y-2 leading-[1.6]">
                  <p>
                    <strong className="text-gray-900">Medidas:</strong> {product.medidas || '25,5*19*9cm (Internas)'}
                  </p>
                  <p className="text-gray-700 leading-[1.6]">
                    {product.description || 'Ideal para maquillaje, desayunos sorpresa y regalos creativos.'}
                  </p>
                </div>
              </div>

            </div>

            {/* Botón Añadir al carrito */}
            <button
              onClick={handleAddToCart}
              className="w-full mt-5 py-4 bg-[#00cbf4] hover:bg-[#00b5dc] text-white font-black text-base sm:text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>🛒</span>
              <span>{addedToast ? '¡Añadido al Carrito! ✓' : 'Añadir al carrito'}</span>
            </button>

            {/* Botón WhatsApp */}
            <button
              onClick={handleWhatsAppOrder}
              className="w-full mt-3 py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>Pedir directo por WhatsApp</span>
            </button>
          </div>

        </div>

        {/* ══════════════════════════════════════════════ */}
        {/*  NUESTROS CLIENTES TAMBIÉN VIERON             */}
        {/* ══════════════════════════════════════════════ */}
        <div className="mt-14 pt-8 border-t border-gray-100">
          <h2
            className="text-xl sm:text-2xl font-black text-gray-900 mb-6"
            style={{ fontFamily: "'Fredoka One', cursive" }}
          >
            Nuestros clientes también vieron
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-10">
            {relatedProducts.map((rp) => (
              <div
                key={rp.id}
                onClick={() => onSelectProduct(rp)}
                className="bg-white rounded-3xl p-3.5 shadow-sm border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
              >
                {/* Imagen */}
                <div className="relative bg-[#f8fafc] rounded-2xl p-2.5 aspect-square flex items-center justify-center mb-3 overflow-hidden">
                  <img
                    src={rp.image}
                    alt={rp.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Pastilla vertical de colores */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 bg-black/40 backdrop-blur-sm p-1 rounded-full shadow">
                    <span className="w-2.5 h-2.5 rounded-full bg-white block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400 block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-black block" />
                    <span className="text-[8px] font-bold text-white leading-none">7</span>
                  </div>
                </div>

                {/* Info + Botón Carrito */}
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-xs sm:text-sm text-gray-900 truncate group-hover:text-[#00c2ff] transition-colors" title={rp.name}>
                      {rp.name}
                    </h3>
                    <p className="text-sm sm:text-base font-black text-gray-900 mt-0.5">
                      ${rp.price.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(rp, 1);
                    }}
                    className="w-9 h-9 rounded-full bg-gray-200 hover:bg-[#00cbf4] text-gray-800 hover:text-white flex items-center justify-center transition-all cursor-pointer flex-shrink-0 shadow-sm"
                    title="Añadir al carrito"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Botón Ver más */}
          <div className="flex justify-center">
            <button
              onClick={() => setCurrentView('productos')}
              className="px-10 py-3.5 bg-[#00cbf4] hover:bg-[#00b5dc] text-white font-black text-sm sm:text-base rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-100"
            >
              Ver más
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
