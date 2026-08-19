import { useState, useEffect } from 'react';
import { getOrders, saveOrder } from '../services/dbService';
import { productsData } from '../data/productsData';

// Limpia un número de teléfono para armar el link de WhatsApp (wa.me)
function cleanPhoneForWhatsApp(phone) {
  if (!phone) return '';
  let digits = phone.replace(/[^0-9]/g, '');
  // Números venezolanos guardados como 0412... -> 58412...
  if (digits.startsWith('0')) digits = '58' + digits.slice(1);
  return digits;
}

function buildInvoiceMessage(order) {
  const lines = (order.itemsList || []).map(
    (it) => `• ${it.qty}x ${it.name} - $${Number(it.price).toFixed(2)}`
  );
  const text =
    `🧾 *Factura Tu Cajita*\n` +
    `Pedido: #${order.id}\n` +
    `Cliente: ${order.client}\n` +
    `Fecha: ${order.date}\n\n` +
    `*Detalle:*\n${lines.join('\n')}\n\n` +
    `*Total: $${Number(order.total).toFixed(2)}*\n` +
    `Método de pago: ${order.paymentMethod}\n` +
    `Estatus: ${order.status}\n\n` +
    `¡Gracias por tu compra en Tu Cajita! 💛`;
  return encodeURIComponent(text);
}

export default function AsesorPanel({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [activeTab, setActiveTab] = useState('pedidos'); // 'pedidos' | 'nuevo'
  const [toast, setToast] = useState(null);

  // Formulario de nuevo pedido a nombre de un cliente
  const [form, setForm] = useState({
    client: '',
    email: '',
    phone: '',
    deliveryAddress: '',
    productId: productsData[0]?.id || '',
    qty: 1,
    paymentMethod: 'Pago Móvil',
  });

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    async function load() {
      setLoading(true);
      const data = await getOrders();
      setOrders(data);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activeTab]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.client.toLowerCase().includes(search.toLowerCase()) ||
      o.id.includes(search) ||
      (o.email || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'Todos' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSendInvoice = (order) => {
    const phone = cleanPhoneForWhatsApp(order.phone);
    if (!phone) {
      alert('Este pedido no tiene un teléfono de contacto válido.');
      return;
    }
    const msg = buildInvoiceMessage(order);
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!form.client || !form.phone) {
      alert('Completa al menos el nombre y teléfono del cliente.');
      return;
    }
    const product = productsData.find((p) => p.id === Number(form.productId));
    const qty = parseInt(form.qty) || 1;
    const total = product ? product.price * qty : 0;

    const newOrder = {
      id: (20000 + orders.length + 1).toString(),
      client: form.client,
      email: form.email || 'cliente@tucajita.com',
      phone: form.phone,
      deliveryAddress: form.deliveryAddress || 'Por confirmar con el cliente',
      date: new Date().toISOString().split('T')[0],
      total,
      status: 'Pendiente',
      items: qty,
      paymentMethod: form.paymentMethod,
      itemsList: [{ name: product?.name || 'Producto personalizado', qty, price: product?.price || 0 }],
      asesor: user?.name || 'Asesor Tu Cajita',
    };

    await saveOrder(newOrder);
    setOrders((prev) => [newOrder, ...prev]);
    showToast(`Pedido #${newOrder.id} creado para ${form.client}`);
    setForm({
      client: '',
      email: '',
      phone: '',
      deliveryAddress: '',
      productId: productsData[0]?.id || '',
      qty: 1,
      paymentMethod: 'Pago Móvil',
    });
    setActiveTab('pedidos');
  };

  const statusColor = (status) => {
    if (status === 'Pagado') return 'bg-green-100 text-green-800';
    if (status === 'Pendiente') return 'bg-amber-100 text-amber-800';
    if (status === 'Enviado') return 'bg-blue-100 text-blue-800';
    if (status === 'Cancelado') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="w-full min-h-screen bg-white" style={{ paddingTop: '105px', paddingBottom: '80px' }}>
      <div className="w-full px-4 sm:px-6" style={{ maxWidth: '860px', margin: '0 auto' }}>
        
        {/* Header Superior del Panel */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🧑‍💼</span>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900" style={{ fontFamily: "'Fredoka One', cursive" }}>
                Panel de Asesor de Ventas
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              Seguimiento de pedidos de clientes, atención CRM y envío de facturas digitales por WhatsApp.
            </p>
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-xs font-bold whitespace-nowrap">
              <span>👤</span> {user?.name || 'Asesor'}
            </span>
          </div>
        </div>

        {/* Switcher de Pestañas (50% de ancho cada una) */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full mb-7 pb-4 border-b-2 border-gray-200">
          <button
            onClick={() => setActiveTab('pedidos')}
            className={`w-full py-3 px-4 text-xs sm:text-sm font-bold rounded-2xl transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-xs ${
              activeTab === 'pedidos'
                ? 'bg-[#00cbf4] text-white ring-2 ring-[#00cbf4]/40 shadow-sm'
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
            }`}
          >
            <span>📋</span>
            <span>Pedidos de Clientes</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
              activeTab === 'pedidos' ? 'bg-white text-[#00a8c8]' : 'bg-gray-200 text-gray-700'
            }`}>
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('nuevo')}
            className={`w-full py-3 px-4 text-xs sm:text-sm font-bold rounded-2xl transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-xs ${
              activeTab === 'nuevo'
                ? 'bg-[#00cbf4] text-white ring-2 ring-[#00cbf4]/40 shadow-sm'
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
            }`}
          >
            <span>➕</span>
            <span>Registrar Pedido Manual</span>
          </button>
        </div>

        {/* TAB 1: LISTADO DE PEDIDOS */}
        {activeTab === 'pedidos' && (
          <div className="space-y-4">
            
            {/* Barra de Filtros y Búsqueda */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-[#00cbf4] focus-within:bg-white transition-all">
                <svg className="w-4 h-4 text-gray-400 mr-2.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Buscar por cliente, correo o # de pedido..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-xs sm:text-sm font-medium text-gray-800 placeholder-gray-400"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600 text-xs font-bold p-1">
                    ✕
                  </button>
                )}
              </div>

              <div className="w-full sm:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-bold text-gray-700 outline-none cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <option value="Todos">Todos los estados</option>
                  <option value="Pendiente">Pendientes</option>
                  <option value="Pagado">Pagados</option>
                  <option value="Enviado">Enviados</option>
                  <option value="Cancelado">Cancelados</option>
                </select>
              </div>
            </div>

            {/* Listado de Pedidos */}
            {loading ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-8 h-8 border-3 border-[#00cbf4] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-gray-500 text-sm font-medium">Cargando pedidos de clientes...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100 p-8">
                <span className="text-4xl block mb-2">🔍</span>
                <p className="text-gray-700 font-bold text-base">No se encontraron pedidos</p>
                <p className="text-gray-400 text-xs mt-1">Intenta con otro término de búsqueda o cambia el filtro de estado.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white border border-gray-200 hover:border-cyan-300 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    {/* Información del Cliente y Pedido */}
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-black text-gray-900 text-xs bg-gray-100 px-2.5 py-0.5 rounded-lg border border-gray-200">
                          #{order.id}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${statusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <span className="text-[11px] text-gray-400 font-medium">
                          {order.date}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-gray-900 text-base sm:text-lg">
                        {order.client}
                      </h3>

                      <p className="text-xs text-gray-500 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span>{order.email}</span>
                        <span>•</span>
                        <span className="font-semibold text-gray-700">{order.phone}</span>
                      </p>

                      <p className="text-xs text-gray-500">
                        {order.deliveryAddress}
                      </p>

                      <p className="text-xs text-gray-600 font-semibold pt-0.5">
                        {order.items || 1} artículo(s) • {order.paymentMethod}
                      </p>
                    </div>

                    {/* Total y Botón WhatsApp */}
                    <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100 shrink-0">
                      <div className="text-left md:text-right">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Monto Total</span>
                        <span className="text-xl font-black text-[#00a8c8]">
                          ${Number(order.total).toFixed(2)}
                        </span>
                      </div>

                      <button
                        onClick={() => handleSendInvoice(order)}
                        className="px-3.5 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95"
                      >
                        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        <span>Enviar factura por WhatsApp</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: REGISTRAR PEDIDO MANUAL */}
        {activeTab === 'nuevo' && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-xs">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-gray-900">Registrar Venta / Pedido Telefónico</h2>
              <p className="text-xs text-gray-500">Ingresa los datos del cliente para generar un nuevo pedido en el sistema CRM.</p>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nombre Completo del Cliente *</label>
                  <input
                    type="text"
                    required
                    value={form.client}
                    onChange={(e) => setForm({ ...form, client: e.target.value })}
                    placeholder="Ej. María Fima"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-[#00cbf4] focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Teléfono (WhatsApp) *</label>
                  <input
                    type="text"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+58 412-1234567"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-[#00cbf4] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="cliente@correo.com"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-[#00cbf4] focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Método de Pago</label>
                  <select
                    value={form.paymentMethod}
                    onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-bold text-gray-700 outline-none cursor-pointer focus:bg-white focus:ring-2 focus:ring-[#00cbf4]"
                  >
                    <option>Pago Móvil</option>
                    <option>Transferencia Banesco</option>
                    <option>Transferencia Mercantil</option>
                    <option>Zelle</option>
                    <option>Efectivo USD</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Dirección de Entrega / Despacho</label>
                <input
                  type="text"
                  value={form.deliveryAddress}
                  onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })}
                  placeholder="Ej. Urb. Las Delicias, Calle 3, Edif. Coral"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-[#00cbf4] focus:border-transparent transition-all"
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Producto a Cotizar</label>
                  <select
                    value={form.productId}
                    onChange={(e) => setForm({ ...form, productId: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-800 outline-none cursor-pointer focus:bg-white focus:ring-2 focus:ring-[#00cbf4]"
                  >
                    {productsData.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — ${p.price.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Cantidad</label>
                  <input
                    type="number"
                    min={1}
                    value={form.qty}
                    onChange={(e) => setForm({ ...form, qty: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-bold text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-[#00cbf4]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 mt-2 bg-[#00cbf4] hover:bg-[#00b8dd] text-white font-black text-sm rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                💾 Guardar y Crear Pedido en CRM
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Toast Notificación */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-2xl shadow-2xl z-50 animate-[fadeIn_0.2s_ease]">
          {toast}
        </div>
      )}
    </div>
  );
}