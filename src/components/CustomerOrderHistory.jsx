import { useState, useEffect } from 'react';
import { getOrders, getInvoices } from '../services/dbService';
import DigitalInvoiceModal from './DigitalInvoiceModal';

export default function CustomerOrderHistory({ user, setCurrentView, onBackToShop }) {
  const [orders, setOrders] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  useEffect(() => {
    async function loadCustomerOrders() {
      const allOrders = await getOrders();
      const allInvoices = await getInvoices();

      // Filtrar órdenes que correspondan a este usuario (por email, nombre o todas si es demo)
      const userEmail = (user?.email || '').toLowerCase().trim();
      const userName = (user?.name || '').toLowerCase().trim();

      const customerOrders = allOrders.filter((o) => {
        if (!userEmail && !userName) return true;
        const ordEmail = (o.email || '').toLowerCase().trim();
        const ordClient = (o.client || '').toLowerCase().trim();
        return (userEmail && ordEmail === userEmail) || (userName && ordClient.includes(userName)) || (userEmail && ordClient.includes(userEmail.split('@')[0]));
      });

      // Si no hay órdenes filtradas pero hay órdenes generales, mostrar las más recientes
      setOrders(customerOrders.length > 0 ? customerOrders : allOrders.slice(0, 5));
    }

    loadCustomerOrders();

    const handleOrdersSync = () => loadCustomerOrders();
    window.addEventListener('tucajita_orders_updated', handleOrdersSync);
    window.addEventListener('tucajita_invoices_updated', handleOrdersSync);

    return () => {
      window.removeEventListener('tucajita_orders_updated', handleOrdersSync);
      window.removeEventListener('tucajita_invoices_updated', handleOrdersSync);
    };
  }, [user]);

  const handleOpenInvoice = (order) => {
    const invoicePayload = {
      invoiceNumber: order.invoiceNumber || order.id,
      date: order.date,
      firstName: order.client?.split(' ')[0] || user?.name?.split(' ')[0] || 'Cliente',
      lastName: order.client?.split(' ').slice(1).join(' ') || user?.name?.split(' ').slice(1).join(' ') || '',
      phone: order.phone || user?.phone || '0424-7724352',
      deliveryAddress: order.deliveryAddress || user?.address || 'San Cristóbal, Venezuela',
      deliveryType: order.deliveryType || 'Retiro en tienda física',
      reference: order.ref || `#${order.id}`,
    };

    setSelectedInvoice({
      data: invoicePayload,
      items: order.itemsList || [{ name: 'Caja Personalizada Lujo', quantity: order.items || 1, price: order.total }],
      total: order.total,
    });
    setIsInvoiceOpen(true);
  };

  return (
    <div className="w-full min-h-[calc(100vh-200px)] bg-white text-[#0f172a] flex flex-col justify-center items-center py-10 sm:py-14 px-4 sm:px-6 font-sans">
      <div className="w-full max-w-2xl mx-auto space-y-6">
        
        {/* Header con botón volver */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🧾</span>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight" style={{ fontFamily: "'Fredoka One', cursive" }}>
                Mis Compras & Facturas Digitales
              </h1>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-1">
              Historial de pedidos y comprobantes fiscales en USD de {user?.name || 'tu cuenta'}
            </p>
          </div>

          <button
            onClick={() => setCurrentView('productos')}
            className="px-5 py-2.5 bg-[#00c2ff] hover:bg-[#00b0e6] text-white font-black text-xs sm:text-sm rounded-xl shadow transition-all cursor-pointer flex items-center justify-center gap-1.5 self-start sm:self-auto"
          >
            <span>🛍️</span>
            <span>Explorar Catálogo</span>
          </button>
        </div>

        {/* Lista de Órdenes / Facturas */}
        {orders.length === 0 ? (
          <div className="bg-gray-50 rounded-3xl p-12 text-center space-y-4 border border-gray-200/70">
            <div className="w-20 h-20 bg-cyan-100 text-[#00cbf4] rounded-full flex items-center justify-center text-4xl mx-auto shadow-inner">
              📄
            </div>
            <h3 className="text-lg font-black text-gray-900">Aún no tienes compras registradas</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto font-medium">
              Cuando realices un pedido y generes tu factura digital, podrás consultar y descargar tus comprobantes aquí en cualquier momento.
            </p>
            <button
              onClick={() => setCurrentView('productos')}
              className="px-6 py-3 bg-[#ffcc00] hover:bg-[#e6b800] text-gray-950 font-black text-sm rounded-2xl shadow transition-all cursor-pointer"
            >
              Comenzar a Comprar
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/90 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                {/* Info Izquierda */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs font-black bg-[#7FE5FA] text-gray-900 px-3 py-1 rounded-full">
                      Factura #{ord.invoiceNumber || ord.id}
                    </span>
                    <span className="text-xs font-bold text-gray-400">
                      📅 {ord.date}
                    </span>
                    <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${
                      ord.status === 'Entregado'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ord.status === 'En Preparación'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      ● {ord.status || 'Pendiente'}
                    </span>
                  </div>

                  {/* Items summary */}
                  <div className="text-xs font-semibold text-gray-700 space-y-1 pt-1">
                    {Array.isArray(ord.itemsList) && ord.itemsList.length > 0 ? (
                      ord.itemsList.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-amber-500 font-bold">•</span>
                          <span className="font-bold text-gray-900">{item.name}</span>
                          <span className="text-gray-500">x{item.quantity || item.qty || 1}</span>
                          <span className="text-gray-400">(${(item.price * (item.quantity || item.qty || 1)).toFixed(2)})</span>
                        </div>
                      ))
                    ) : (
                      <p className="font-bold text-gray-900">Caja Personalizada TuCajita ({ord.items || 1} unid)</p>
                    )}
                  </div>

                  <div className="text-[11px] text-gray-500 font-medium flex items-center gap-3 pt-1 flex-wrap">
                    <span>💳 <strong>Pago:</strong> {ord.paymentMethod}</span>
                    <span>🔖 <strong>Ref:</strong> {ord.ref || `#${ord.id}`}</span>
                    <span>🚚 <strong>Entrega:</strong> {ord.deliveryType || 'Retiro en tienda física'}</span>
                  </div>
                </div>

                {/* Info Derecha & Botón Factura */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100 shrink-0">
                  <div className="text-left md:text-right">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Total Pagado</span>
                    <span className="text-xl sm:text-2xl font-black text-gray-950">
                      ${Number(ord.total || 0).toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenInvoice(ord)}
                    className="px-4 py-2.5 bg-[#ffcc00] hover:bg-[#e6b800] text-gray-950 font-black text-xs rounded-xl shadow transition-transform hover:scale-105 flex items-center gap-2 cursor-pointer"
                    title="Ver y descargar factura digital PDF"
                  >
                    <span className="text-sm">📄</span>
                    <span>Ver Factura Digital</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Modal Factura Digital */}
      {selectedInvoice && (
        <DigitalInvoiceModal
          isOpen={isInvoiceOpen}
          onClose={() => setIsInvoiceOpen(false)}
          invoiceData={selectedInvoice.data}
          cartItems={selectedInvoice.items}
          totalAmount={selectedInvoice.total}
        />
      )}
    </div>
  );
}
