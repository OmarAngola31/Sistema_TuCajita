import React, { useState } from 'react';
import { useCart, PRODUCT_IMAGES } from '../context/CartContext';
import { QuantityModal } from './QuantityModal';

export function CartView({ setCurrentView }) {
  const { items, subtotal, removeItem, updateQuantity, generateNewOrder } = useCart();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(null);

  const handleProcess = () => {
    generateNewOrder();
    setCurrentView('confirmation');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-start space-x-3 mb-6">
        <span className="text-xl">📦</span>
        <div>
          <h4 className="text-xs font-bold text-gray-900">Envío</h4>
          <p className="text-xs text-gray-600">Los costos de envío se acuerdan con en el procesamiento de la solicitud</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-200">
          <p className="font-bold text-gray-700 text-sm">Tu carrito está vacío</p>
          <button onClick={() => setCurrentView('product')} className="mt-4 px-6 py-2 bg-[#00C2FF] text-white rounded-xl text-xs font-bold">Ir a la tienda</button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div key={idx} className="relative bg-[#D2E7EA] rounded-3xl p-5 shadow-sm flex items-center justify-between text-gray-900">
              <div className="flex items-center space-x-5">
                <div className="w-24 h-24 bg-white/90 rounded-2xl p-2 flex items-center justify-center">
                  <img src={item.image || PRODUCT_IMAGES[0]} className="max-h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">{item.name}</h3>
                  <p className="text-xs font-bold text-gray-800 mt-1">Detalles: <span className="font-normal">{item.size} • {item.color}</span></p>
                  <p className="text-xs font-bold text-gray-800 mt-0.5">Precio: <span className="font-extrabold">${(item.price * item.quantity).toFixed(2)}</span></p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button onClick={() => { setSelectedIdx(idx); setModalOpen(true); }} className="bg-white/90 px-4 py-2 rounded-xl text-xs font-bold text-gray-900 shadow">
                  Cantidad: {item.quantity} ⌵
                </button>
                <button onClick={() => removeItem(idx)} className="p-2 text-gray-800 hover:text-red-700 font-bold text-lg">✕</button>
              </div>
            </div>
          ))}

          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xl font-black text-gray-900">Total: <span className="text-[#00C2FF]">${subtotal.toFixed(2)}</span></div>
            <button onClick={handleProcess} className="w-full sm:w-auto px-10 py-3.5 bg-[#00C2FF] hover:bg-[#00A8DE] text-white font-black rounded-2xl shadow-md text-sm">
              Procesar Pedido
            </button>
          </div>
        </div>
      )}

      <QuantityModal isOpen={modalOpen} onClose={() => setModalOpen(false)} currentQty={selectedIdx !== null && items[selectedIdx] ? items[selectedIdx].quantity : 1} onConfirm={q => updateQuantity(selectedIdx, q)} onRemove={() => removeItem(selectedIdx)} />
    </div>
  );
}