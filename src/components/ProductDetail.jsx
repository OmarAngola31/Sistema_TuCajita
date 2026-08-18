import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export function ProductDetail({ product, setCurrentView }) {
  const { addItem, items } = useCart();
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'M');
  const [activeTab, setActiveTab] = useState('descripcion');
  const [btnState, setBtnState] = useState('idle');
  const [isFav, setIsFav] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [localReviews, setLocalReviews] = useState(product?.reviews || []);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Producto no encontrado</p>
          <button onClick={() => setCurrentView('productos')} className="px-6 py-2 bg-[#00C2FF] text-white rounded-xl font-bold text-sm">
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  const colors = product.colors || [{ name: 'Default', hex: '#D2E7EA', image: product.image }];
  const selectedColor = colors[selectedColorIdx];
  const cartCount = items.reduce((s, i) => s + i.quantity, 0);

  const handleAdd = () => {
    if (btnState !== 'idle') return;
    setBtnState('loading');
    setTimeout(() => {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        size: selectedSize,
        color: selectedColor.name,
        colorHex: selectedColor.hex,
        image: selectedColor.image || product.image,
      });
      setBtnState('success');
      setTimeout(() => setBtnState('idle'), 2500);
    }, 600);
  };

  const handleSubmitReview = () => {
    if (!newReview.comment.trim()) return;
    setLocalReviews([
      { author: 'Tú', rating: newReview.rating, comment: newReview.comment, date: new Date().toISOString().split('T')[0] },
      ...localReviews,
    ]);
    setNewReview({ rating: 5, comment: '' });
  };

  const avgRating = localReviews.length > 0
    ? (localReviews.reduce((s, r) => s + r.rating, 0) / localReviews.length).toFixed(1)
    : '—';

  return (
    <div className="min-h-screen bg-white pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs text-gray-500 mb-6">
          <button onClick={() => setCurrentView('home')} className="hover:text-[#00C2FF] transition">Inicio</button>
          <span>/</span>
          <button onClick={() => setCurrentView('productos')} className="hover:text-[#00C2FF] transition">Cajas</button>
          <span>/</span>
          <span className="text-gray-800 font-semibold truncate max-w-[160px]">{product.name}</span>
        </div>

        {/* ─── Layout Principal ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* ── Galería ── */}
          <div className="lg:col-span-6 flex flex-col sm:flex-row gap-4">
            {/* Miniaturas (desktop lateral, mobile horizontal) */}
            <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0">
              {colors.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedColorIdx(i)}
                  className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 bg-white p-1.5 transition-all overflow-hidden ${
                    selectedColorIdx === i
                      ? 'border-[#00C2FF] ring-2 ring-[#00C2FF]/30 scale-105'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={c.image || product.image} alt={c.name} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>

            {/* Imagen principal */}
            <div className="relative flex-1 bg-[#f8fafc] rounded-3xl border border-gray-100 shadow-sm flex items-center justify-center min-h-[280px] sm:min-h-[360px] lg:min-h-[440px] p-8">
              <img
                src={selectedColor.image || product.image}
                alt={product.name}
                className="max-h-64 sm:max-h-80 lg:max-h-96 object-contain drop-shadow-lg transition-all duration-300"
              />

              {/* Badge */}
              {product.badge && (
                <span className="absolute top-4 left-4 bg-[#FFD54F] text-gray-900 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                  {product.badge}
                </span>
              )}

              {/* Favorito */}
              <button
                onClick={() => setIsFav(!isFav)}
                className="absolute top-4 right-4 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform"
              >
                <svg className={`w-5 h-5 transition-colors ${isFav ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              {/* Stock bajo */}
              {product.stock <= 10 && (
                <div className="absolute bottom-4 left-4 bg-orange-50 border border-orange-200 text-orange-700 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                  ⚡ Solo {product.stock} disponibles
                </div>
              )}
            </div>
          </div>

          {/* ── Tarjeta de Compra ── */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            <div className="bg-[#D2E7EA] rounded-3xl p-6 shadow-sm">

              {/* Nombre y precio */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">{product.name}</h1>
                  <p className="text-xs text-gray-600 mt-1">{product.categoryName}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-yellow-500 text-sm">{'★'.repeat(Math.round(parseFloat(avgRating) || 0))}</span>
                    <span className="text-xs text-gray-600">({avgRating}) · {localReviews.length} reseña{localReviews.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                <span className="text-2xl sm:text-3xl font-black text-gray-900 whitespace-nowrap">${product.price.toFixed(2)}</span>
              </div>

              {/* Color */}
              <div className="mb-4">
                <label className="text-xs font-bold text-gray-800 block mb-2">
                  Color: <span className="font-normal text-gray-600">{selectedColor.name}</span>
                </label>
                <div className="flex gap-2.5 flex-wrap">
                  {colors.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColorIdx(i)}
                      title={c.name}
                      className={`w-7 h-7 rounded-full border-2 transition-all ${
                        selectedColorIdx === i ? 'ring-2 ring-offset-1 ring-[#00C2FF] scale-110 border-white' : 'border-white/60 hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* Tallas */}
              <div className="mb-6">
                <label className="text-xs font-bold text-gray-800 block mb-2">Medidas</label>
                <div className="flex gap-2.5 flex-wrap">
                  {['P', 'M', 'G', 'EG'].map((s) => {
                    const available = product.sizes?.includes(s);
                    return (
                      <button
                        key={s}
                        disabled={!available}
                        onClick={() => available && setSelectedSize(s)}
                        className={`w-10 h-10 rounded-xl text-xs font-black uppercase flex items-center justify-center transition-all ${
                          selectedSize === s && available
                            ? 'bg-[#FFD54F] text-gray-900 ring-2 ring-yellow-400 shadow-sm scale-105'
                            : available
                            ? 'bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-900'
                            : 'bg-gray-100 text-gray-300 cursor-not-allowed line-through'
                        }`}
                      >{s}</button>
                    );
                  })}
                </div>
              </div>

              {/* Botón Añadir al Carrito (3 estados) */}
              {btnState === 'idle' && (
                <button
                  onClick={handleAdd}
                  className="w-full py-3.5 bg-[#00C2FF] hover:bg-[#00A8DE] text-white font-black rounded-2xl shadow-md text-sm transition active:scale-95"
                >
                  🛒 Añadir al carrito
                </button>
              )}
              {btnState === 'loading' && (
                <button disabled className="w-full py-3.5 bg-[#00C2FF]/70 text-white font-bold rounded-2xl flex items-center justify-center gap-2 text-sm">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Agregando...
                </button>
              )}
              {btnState === 'success' && (
                <button
                  onClick={() => setCurrentView('carrito')}
                  className="w-full py-3.5 bg-[#1E7E34] text-white font-black rounded-2xl shadow flex items-center justify-center gap-2 text-sm"
                >
                  ✓ Añadido · Ver carrito
                  {cartCount > 0 && <span className="bg-white text-[#1E7E34] text-xs font-black px-1.5 py-0.5 rounded-full">{cartCount}</span>}
                </button>
              )}
            </div>

            {/* Envío info */}
            <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm text-xs text-gray-600">
              <span className="text-base">📦</span>
              <span>El costo de envío se coordina directamente con el asesor vía WhatsApp.</span>
            </div>
          </div>
        </div>

        {/* ─── Pestañas: Descripción / Reseñas ─── */}
        <div className="mt-12">
          <div className="flex border-b border-gray-200 mb-6">
            {['descripcion', 'resenas'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-bold transition-all border-b-2 -mb-px ${
                  activeTab === tab
                    ? 'border-[#00C2FF] text-[#00C2FF]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'descripcion' ? 'Descripción' : `Reseñas (${localReviews.length})`}
              </button>
            ))}
          </div>

          {activeTab === 'descripcion' && (
            <div className="prose max-w-none text-gray-700 text-sm leading-relaxed">
              <p>{product.description}</p>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: '✅', title: 'Material Premium', desc: 'Cartón de alta calidad' },
                  { icon: '🎨', title: 'Personalizable', desc: 'Consulta opciones de impresión' },
                  { icon: '📏', title: 'Varios Tamaños', desc: product.sizes?.join(', ') || 'Consultar' },
                ].map((f) => (
                  <div key={f.title} className="bg-[#f8fafc] rounded-2xl p-4 border border-gray-100">
                    <span className="text-2xl">{f.icon}</span>
                    <p className="font-bold text-gray-900 text-xs mt-2">{f.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'resenas' && (
            <div>
              {/* Promedio */}
              <div className="flex items-center gap-4 mb-6 bg-[#D2E7EA] rounded-2xl p-4">
                <span className="text-4xl font-black text-gray-900">{avgRating}</span>
                <div>
                  <div className="text-yellow-500 text-lg">{'★'.repeat(Math.round(parseFloat(avgRating) || 0))}</div>
                  <p className="text-xs text-gray-600 mt-0.5">{localReviews.length} reseña{localReviews.length !== 1 ? 's' : ''}</p>
                </div>
              </div>

              {/* Lista */}
              <div className="space-y-4 mb-8">
                {localReviews.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-6">Sé el primero en dejar una reseña.</p>
                )}
                {localReviews.map((r, i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-gray-900 text-sm">{r.author}</span>
                      <span className="text-xs text-gray-400">{r.date}</span>
                    </div>
                    <div className="text-yellow-500 text-sm mb-1">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                    <p className="text-sm text-gray-600">{r.comment}</p>
                  </div>
                ))}
              </div>

              {/* Formulario nueva reseña */}
              <div className="bg-[#f8fafc] border border-gray-200 rounded-2xl p-5">
                <h3 className="font-bold text-gray-900 text-sm mb-3">Dejar una reseña</h3>
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() => setNewReview((r) => ({ ...r, rating: s }))}
                      className={`text-2xl transition-transform hover:scale-110 ${s <= newReview.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                    >★</button>
                  ))}
                </div>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview((r) => ({ ...r, comment: e.target.value }))}
                  placeholder="Comparte tu experiencia con este producto..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00C2FF]/40 resize-none bg-white"
                />
                <button
                  onClick={handleSubmitReview}
                  className="mt-2 px-5 py-2 bg-[#00C2FF] hover:bg-[#00A8DE] text-white font-bold rounded-xl text-xs transition"
                >
                  Publicar reseña
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}