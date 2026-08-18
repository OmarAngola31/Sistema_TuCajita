import React from 'react';
import { useCart } from '../context/CartContext';

export function OrderConfirmationView({ setCurrentView, user }) {
  const { items, subtotal, totalCount, orderNumber, advisorPhone, saveOrderToSupabase } = useCart();

  const whatsappMsg = encodeURIComponent(
    `¡Hola Tu Cajita! 👋\n\n📋 *Solicitud:* #${orderNumber}\n📦 *Cantidad total:* ${totalCount}\n💰 *Total:* $${subtotal.toFixed(2)}\n\n*Detalle:*\n${items.map(i => `• ${i.quantity}x ${i.name} (${i.size}, ${i.color}) - $${(i.price * i.quantity).toFixed(2)}`).join('\n')}`
  );
  const whatsappUrl = `https://wa.me/${advisorPhone}?text=${whatsappMsg}`;

  const handleConfirm = async () => {
    await saveOrderToSupabase(user?.id);
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-white pt-20 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#D2E7EA] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#00C2FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-gray-900">Confirmar Pedido</h1>
          <p className="text-sm text-gray-500 mt-1">Revisa tu pedido antes de enviar al asesor</p>
        </div>

        {/* Productos */}
        <div className="space-y-3 mb-6">
          {items.map((item, idx) => (
            <div key={idx} className="bg-[#D2E7EA] rounded-2xl p-4 flex items-center gap-4">
              <div className="w-14 h-14 bg-white/80 rounded-xl p-1 flex-shrink-0 flex items-center justify-center">
                <img src={item.image} alt={item.name} className="max-h-full object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-gray-900 text-sm truncate">{item.name}</p>
                <p className="text-xs text-gray-700">{item.size} · {item.color}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-black text-gray-900 text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                <p className="text-xs text-gray-600">x{item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <div className="bg-[#D2E7EA] rounded-2xl p-5 mb-6 space-y-2 text-sm">
          <div className="flex justify-between text-gray-700">
            <span>Cantidad total</span>
            <span className="font-bold">{totalCount} unidad{totalCount !== 1 ? 'es' : ''}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Subtotal</span>
            <span className="font-bold">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-500 text-xs italic">
            <span>Envío</span>
            <span>A coordinar con asesor</span>
          </div>
          <div className="border-t border-[#b0cfd4] pt-2 flex justify-between items-center">
            <span className="font-bold text-gray-900">N° Solicitud</span>
            <span className="font-black text-gray-900 font-mono text-base">#{orderNumber}</span>
          </div>
        </div>

        {/* Botón WhatsApp */}
        <button
          onClick={handleConfirm}
          className="w-full py-4 bg-[#1E7E34] hover:bg-[#155724] text-white font-black rounded-2xl shadow-lg text-sm flex items-center justify-center gap-2 transition active:scale-95"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Concretar pedido por WhatsApp
        </button>

        <button
          onClick={() => setCurrentView('carrito')}
          className="w-full mt-3 py-3 text-sm text-gray-500 hover:text-gray-700 font-semibold transition"
        >
          ← Volver al carrito
        </button>
      </div>
    </div>
  );
}