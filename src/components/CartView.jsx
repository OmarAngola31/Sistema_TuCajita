import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { QuantityModal } from './QuantityModal';

export function CartView({ setCurrentView }) {
  const { items, subtotal, removeItem, updateQuantity, generateNewOrder } = useCart();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(null);

  const handleProcess = () => {
    generateNewOrder();
    setCurrentView('confirmacion');
  };

  const selectedItem = selectedIdx !== null ? items[selectedIdx] : null;

  return (
    <div className="min-h-screen bg-white pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-gray-900">Mi Carrito</h1>
          <button
            onClick={() => setCurrentView('productos')}
            className="text-xs text-[#00C2FF] font-bold hover:underline flex items-center gap-1"
          >
            ← Seguir comprando
          </button>
        </div>

        {/* Nota de envío */}
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 mb-6 text-xs text-blue-700">
          <span className="text-base">📦</span>
          <span>Los costos de envío se acuerdan al procesar tu solicitud con el asesor.</span>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
            <div className="text-5xl mb-4">🛒</div>
            <p className="font-bold text-gray-700 mb-2">Tu carrito está vacío</p>
            <p className="text-sm text-gray-500 mb-6">Agrega productos desde la tienda</p>
            <button
              onClick={() => setCurrentView('productos')}
              className="px-8 py-3 bg-[#00C2FF] text-white rounded-2xl font-bold text-sm hover:bg-[#00A8DE] transition"
            >
              Ir a la tienda
            </button>
          </div>
        ) : (
          <div>
            {/* Lista de ítems */}
            <div className="space-y-4 mb-8">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#D2E7EA] rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4"
                >
                  {/* Imagen */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/80 rounded-2xl p-2 flex-shrink-0 flex items-center justify-center">
                    <img src={item.image} alt={item.name} className="max-h-full object-contain" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-gray-900 text-base leading-tight">{item.name}</h3>
                    <p className="text-xs text-gray-700 mt-0.5">Talla: <span className="font-bold">{item.size}</span> · Color: <span className="font-bold">{item.color}</span></p>
                    <p className="text-sm font-black text-gray-900 mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-xs text-gray-600">${item.price.toFixed(2)} c/u</p>
                  </div>

                  {/* Controles */}
                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <button
                      onClick={() => { setSelectedIdx(idx); setModalOpen(true); }}
                      className="bg-white/80 hover:bg-white px-4 py-2 rounded-xl text-xs font-bold text-gray-900 shadow-sm transition flex items-center gap-1"
                    >
                      Cant: {item.quantity} <span className="text-gray-400">▼</span>
                    </button>
                    <button
                      onClick={() => removeItem(idx)}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-white/60 rounded-full transition"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumen y Botones */}
            <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} producto{items.length !== 1 ? 's' : ''})</span>
                <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-5 pb-4 border-b border-gray-100 text-sm text-gray-500">
                <span>Envío</span>
                <span className="italic">A coordinar</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* Procesar Pedido */}
                <button
                  onClick={handleProcess}
                  className="flex-1 py-3.5 bg-[#00C2FF] hover:bg-[#00A8DE] text-white font-black rounded-2xl shadow-md text-sm transition active:scale-95"
                >
                  Procesar Pedido
                </button>

                {/* WhatsApp directo */}
                <a
                  href={`https://wa.me/584146146237?text=${encodeURIComponent(`¡Hola Tu Cajita! 👋\n\nQuiero consultar sobre mi pedido:\n${items.map(i => `• ${i.quantity}x ${i.name} (${i.size}, ${i.color}) - $${(i.price * i.quantity).toFixed(2)}`).join('\n')}\n\n*Total: $${subtotal.toFixed(2)}*`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3.5 bg-[#1E7E34] hover:bg-[#155724] text-white font-bold rounded-2xl shadow text-sm flex items-center justify-center gap-2 transition"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Contactar asesor
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      <QuantityModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        currentQty={selectedItem?.quantity || 1}
        onConfirm={(q) => updateQuantity(selectedIdx, q)}
        onRemove={() => removeItem(selectedIdx)}
      />
    </div>
  );
}