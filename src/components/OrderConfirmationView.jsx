import React from 'react';
import { useCart, PRODUCT_IMAGES } from '../context/CartContext';

export function OrderConfirmationView() {
  const { items, subtotal, totalCount, orderNumber, advisorPhone } = useCart();

  const whatsappUrl = `https://wa.me/${advisorPhone}?text=¡Hola Tu Cajita! 👋%0A%0AQuiero concretar mi pedido:%0A📋 *Solicitud:* %23${orderNumber}%0A📦 *Cantidad total:* ${totalCount}%0A💰 *Total:* $${subtotal.toFixed(2)}%0A%0A*Detalle:*%0A${items.map(i => `• ${i.quantity}x ${i.name} (${i.size}, ${i.color}) - $${(i.price * i.quantity).toFixed(2)}`).join('%0A')}`;

  return (
    <div className="max-w-2xl mx-auto px-4 pt-24 md:pt-28 pb-12">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Paso Final: Confirmar con el asesor</h2>

      <div className="space-y-3 mb-6">
        {items.map((item, idx) => (
          <div key={idx} className="bg-[#D2E7EA] rounded-3xl p-4 flex items-center justify-between text-gray-900 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/90 rounded-2xl p-1.5 flex items-center justify-center">
                <img src={item.image || PRODUCT_IMAGES[0]} className="max-h-full object-contain" />
              </div>
              <div className="text-xs">
                <h4 className="font-black text-gray-900 text-sm">{item.name}</h4>
                <p className="text-gray-800">Detalles: {item.size} • {item.color}</p>
              </div>
            </div>
            <div className="text-right text-xs">
              <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
              <p className="text-gray-800">Cantidad: {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#D2E7EA] rounded-3xl p-6 shadow-sm text-gray-900 space-y-2 text-xs font-bold mb-6">
        <div className="flex justify-between"><span>Cantidad total</span><span className="text-sm">{totalCount}</span></div>
        <div className="flex justify-between"><span>Total</span><span className="text-base">${subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between items-center pt-2 border-t border-cyan-200">
          <span>Solicitud</span>
          <span className="text-sm font-black font-mono">#{orderNumber}</span>
        </div>
      </div>

      <div className="text-center">
        <a href={whatsappUrl} target="_blank" rel="noreferrer" className="w-full block py-4 bg-[#1E7E34] hover:bg-[#155724] text-white font-black rounded-2xl shadow-lg text-sm tracking-wide transition">
          Concretar pedido por WhatsApp
        </a>
      </div>
    </div>
  );
}