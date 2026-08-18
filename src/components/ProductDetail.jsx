import React, { useState } from 'react';
import { useCart, PRODUCT_IMAGES } from '../context/CartContext';

export function ProductDetail({ setCurrentView }) {
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('G'); // Tamaño por defecto
  const [selectedColor, setSelectedColor] = useState('coral');
  const [btnState, setBtnState] = useState('idle');

  // Lista de medidas con estado de disponibilidad (opcional)
  const sizes = [
    { id: 'P', available: true },
    { id: 'M', available: true },
    { id: 'G', available: true },
    { id: 'EG', available: true }
  ];

  const nextImage = () => setSelectedImage((prev) => (prev + 1) % PRODUCT_IMAGES.length);
  const prevImage = () => setSelectedImage((prev) => (prev - 1 + PRODUCT_IMAGES.length) % PRODUCT_IMAGES.length);

  const handleAdd = () => {
    if (btnState !== 'idle') return;
    setBtnState('loading');
    setTimeout(() => {
      addItem({
        id: 'prod-caja-coral',
        name: 'Producto',
        price: 15.99,
        size: selectedSize,
        dimensions: selectedSize === 'P' ? '15 × 12 × 6cm' : selectedSize === 'M' ? '20 × 15 × 8cm' : selectedSize === 'G' ? '25,5 × 19 × 9cm' : '32 × 24 × 12cm',
        color: selectedColor === 'black' ? 'Negro' : selectedColor === 'coral' ? 'Coral / Rosa' : 'Blanco',
        image: PRODUCT_IMAGES[selectedImage]
      });
      setBtnState('success');
      setTimeout(() => setBtnState('idle'), 2500);
    }, 700);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-4">
      <div className="text-xs text-gray-500 mb-4">Inicio/ Cajas</div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Galería */}
        <div className="md:col-span-6 lg:col-span-7 flex gap-4">
          <div className="hidden lg:flex flex-col space-y-3">
            {PRODUCT_IMAGES.slice(0, 4).map((img, i) => (
              <button key={i} onClick={() => setSelectedImage(i)} className={`w-16 h-16 rounded-xl border overflow-hidden bg-white p-1 cursor-pointer transition-all ${selectedImage === i ? 'border-[#00C2FF] ring-2 ring-[#00C2FF]/40' : 'border-gray-200'}`}>
                <img src={img} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>

          <div className="relative flex-1 bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex items-center justify-center min-h-[360px]">
            <img src={PRODUCT_IMAGES[selectedImage]} alt="Caja" className="max-h-72 object-contain drop-shadow-md transition-all duration-300" />
            <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 text-gray-700 font-black flex items-center justify-center shadow-md text-lg">‹</button>
            <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 text-gray-700 font-black flex items-center justify-center shadow-md text-lg">›</button>
          </div>
        </div>

        {/* Tarjeta de Especificaciones (#D2E7EA) */}
        <div className="md:col-span-6 lg:col-span-5 bg-[#D2E7EA] rounded-3xl p-6 shadow-sm text-gray-900">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Nombre del producto</h2>
              <span className="text-[11px] text-gray-700 font-semibold block mt-0.5">Precio exclusivo</span>
            </div>
            <span className="text-2xl font-black text-gray-900">$15.99</span>
          </div>

          {/* Color */}
          <div className="mt-5">
            <label className="text-xs font-bold text-gray-900 block mb-1.5">Color</label>
            <div className="flex space-x-3">
              <button onClick={() => setSelectedColor('black')} className={`w-6 h-6 rounded-full bg-black border-2 ${selectedColor === 'black' ? 'ring-2 ring-white scale-110' : ''}`} />
              <button onClick={() => setSelectedColor('coral')} className={`w-6 h-6 rounded-full bg-[#EF5350] border-2 ${selectedColor === 'coral' ? 'ring-2 ring-white scale-110' : ''}`} />
              <button onClick={() => setSelectedColor('white')} className={`w-6 h-6 rounded-full bg-white border-2 ${selectedColor === 'white' ? 'ring-2 ring-blue-600 scale-110' : ''}`} />
            </div>
          </div>

          {/* Medidas: Seleccionada en Amarillo, No Seleccionada en Gris */}
          <div className="mt-5">
            <label className="text-xs font-bold text-gray-900 block mb-1.5">Medidas</label>
            <div className="flex items-center space-x-2.5">
              {sizes.map(({ id, available }) => (
                <button
                  key={id}
                  disabled={!available}
                  onClick={() => setSelectedSize(id)}
                  className={`w-9 h-9 rounded-lg text-xs font-black uppercase flex items-center justify-center transition-all ${
                    selectedSize === id
                      ? 'bg-[#FFD54F] text-gray-900 shadow-sm ring-2 ring-yellow-500 scale-105'
                      : available
                      ? 'bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-900'
                      : 'bg-gray-100 text-gray-400 opacity-50 cursor-not-allowed line-through'
                  }`}
                >
                  {id}
                </button>
              ))}
            </div>
          </div>

          {/* Botón de 3 Estados */}
          <div className="mt-6">
            {btnState === 'idle' && <button onClick={handleAdd} className="w-full py-3.5 bg-[#00C2FF] hover:bg-[#00A8DE] text-white font-black rounded-xl shadow-md text-sm transition">Añadir al carrito</button>}
            {btnState === 'loading' && <button disabled className="w-full py-3.5 bg-[#00C2FF]/80 text-white font-bold rounded-xl flex items-center justify-center space-x-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span><span>Procesando...</span></button>}
            {btnState === 'success' && <button onClick={() => setCurrentView('cart')} className="w-full py-3.5 bg-[#1E7E34] text-white font-black rounded-xl shadow flex items-center justify-center space-x-2 animate-bounce"><span>✓ Producto añadido</span></button>}
          </div>
        </div>
      </div>
    </div>
  );
}