import { useRef } from 'react';

export default function DigitalInvoiceModal({ isOpen, onClose, invoiceData, cartItems, totalAmount }) {
  const invoiceRef = useRef(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = invoiceData?.invoiceNumber || (invoiceData?.reference ? invoiceData.reference.replace('#', '') : '123456');
  const formattedDate = invoiceData?.date || new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  const clientName = `${invoiceData?.firstName || 'Gabriela'} ${invoiceData?.lastName || 'Angola'}`.trim();
  const phone = invoiceData?.phone || '0424-7724352';
  const address = invoiceData?.deliveryAddress || 'San Cristóbal, Venezuela, Táchira, Barrio Obrero, Calle 10 con carrera 19';
  const deliveryType = invoiceData?.deliveryType || 'Retiro en tienda física';
  const paymentRef = invoiceData?.reference?.startsWith('#') ? invoiceData.reference : `#${invoiceData?.reference || '123456'}`;

  const items = cartItems && cartItems.length > 0 ? cartItems : [
    { id: 1, name: 'Caja Personalizada Lujo', quantity: 1, price: totalAmount || 25.98 }
  ];

  const finalTotal = typeof totalAmount === 'number' ? totalAmount.toFixed(2) : '25.98';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease]">
      {/* Styles for clean PDF printing */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-invoice, #printable-invoice * {
            visibility: visible;
          }
          #printable-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
            margin: 0;
            box-shadow: none;
            border: none;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col my-auto border border-gray-100">
        
        {/* Modal Top Control Bar (Hidden on print) */}
        <div className="no-print bg-[#144b57] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📄</span>
            <h3 className="text-base font-bold" style={{ fontFamily: "'Fredoka One', cursive" }}>
              Factura Digital TuCajita
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#ffcc00] hover:bg-[#e6b800] text-gray-900 font-black text-xs rounded-xl shadow transition-transform hover:scale-105 flex items-center gap-1.5 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Descargar / Imprimir PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold flex items-center justify-center cursor-pointer transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Invoice Container (Matches Image 3 Layout) */}
        <div id="printable-invoice" ref={invoiceRef} className="p-8 sm:p-12 text-gray-900 bg-white space-y-8 font-sans">
          
          {/* Header Info Rows */}
          <div className="space-y-3.5 text-sm sm:text-base">
            <div className="flex justify-between items-start">
              <span className="font-semibold text-gray-700">Fecha de la Factura</span>
              <span className="font-bold text-gray-900">{formattedDate}</span>
            </div>

            <div className="flex justify-between items-start">
              <span className="font-semibold text-gray-700">Nro. de Factura</span>
              <span className="font-bold text-gray-900">{invoiceNumber}</span>
            </div>

            <div className="flex justify-between items-start">
              <span className="font-semibold text-gray-700">Cliente</span>
              <span className="font-bold text-gray-900">{clientName}</span>
            </div>

            <div className="flex justify-between items-start">
              <span className="font-semibold text-gray-700">Teléfono</span>
              <span className="font-bold text-gray-900">{phone}</span>
            </div>

            <div className="flex justify-between items-start gap-4">
              <span className="font-semibold text-gray-700 shrink-0">Dirección</span>
              <span className="font-medium text-gray-900 text-right max-w-md">{address}</span>
            </div>

            <div className="flex justify-between items-start">
              <span className="font-semibold text-gray-700">Operación de retiro</span>
              <span className="font-bold text-gray-900">{deliveryType}</span>
            </div>

            <div className="flex justify-between items-start">
              <span className="font-semibold text-gray-700">Referencia de pago</span>
              <span className="font-bold text-gray-900">{paymentRef}</span>
            </div>
          </div>

          {/* Table of Products */}
          <div className="space-y-4 pt-4">
            {/* Cyan Header Pill */}
            <div className="bg-[#7FE5FA] text-gray-900 font-extrabold text-sm sm:text-base px-6 py-3 rounded-2xl grid grid-cols-12 items-center">
              <div className="col-span-6">Producto</div>
              <div className="col-span-3 text-center">Cantidad</div>
              <div className="col-span-3 text-right">Precio</div>
            </div>

            {/* Table Rows */}
            <div className="px-6 space-y-3 font-semibold text-sm sm:text-base text-gray-800">
              {items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 items-center py-1 border-b border-gray-50 last:border-0">
                  <div className="col-span-6 truncate pr-2" title={item.name}>
                    {item.name}
                  </div>
                  <div className="col-span-3 text-center font-bold">
                    {item.quantity}
                  </div>
                  <div className="col-span-3 text-right font-black">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Cyan Total Bar (Matches Image 3) */}
          <div className="bg-[#00c2ff] text-white px-8 py-4.5 rounded-2xl flex items-center justify-between shadow-md">
            <span className="text-xl sm:text-2xl font-black tracking-tight">
              ${finalTotal}
            </span>
            <span className="text-lg sm:text-xl font-bold tracking-wide">
              Total
            </span>
          </div>

          {/* Footer note (sin IVA) */}
          <div className="text-center text-xs text-gray-400 font-medium pt-2">
            Precios expresados en dólares americanos (USD). Gracias por confiar en TuCajita.Sc
          </div>

        </div>

      </div>
    </div>
  );
}
