import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import smileyImg from '../assets/smiley_emoji.jpg';
import {
  getOrders,
  updateOrderStatus,
  getTransactions,
  getStockData,
  getReviews,
  getProducts,
  saveProduct,
} from '../services/dbService';

export default function AdminDashboard({ user, setCurrentView, onLogout }) {
  // Sidebar state
  const [openSections, setOpenSections] = useState({
    pedidos: true,
    pagos: true,
    contenido: true,
    analitica: true,
  });
  const [activeTab, setActiveTab] = useState('dashboard');

  // Orders State
  const [orders, setOrders] = useState([]);
  const [orderFilterId, setOrderFilterId] = useState('');
  const [orderFilterStatus, setOrderFilterStatus] = useState('Todos');
  const [orderFilterDate, setOrderFilterDate] = useState('');
  const [editingOrder, setEditingOrder] = useState(null);

  // Transactions State
  const [transactions, setTransactions] = useState([]);

  // Stock State & Products
  const [stockList, setStockList] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [reviewsList, setReviewsList] = useState([]);

  // Product Editor Modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    category: 'especial',
    stock: 50,
    description: '',
  });

  // Period toggle for chart
  const [chartPeriod, setChartPeriod] = useState('Mes');
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Load data
  useEffect(() => {
    async function loadData() {
      const ords = await getOrders();
      setOrders(ords);

      const trans = await getTransactions();
      setTransactions(trans);

      const stk = await getStockData();
      setStockList(stk);

      const revs = await getReviews();
      setReviewsList(revs);

      const prods = await getProducts();
      setProductsList(prods);
    }
    loadData();
  }, []);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const matchId = orderFilterId ? o.id.includes(orderFilterId) : true;
    const matchStatus =
      orderFilterStatus === 'Todos' ? true : o.status === orderFilterStatus;
    const matchDate = orderFilterDate ? o.date.includes(orderFilterDate) : true;
    return matchId && matchStatus && matchDate;
  });

  // Handle order status change
  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (editingOrder && editingOrder.id === orderId) {
      setEditingOrder((prev) => ({ ...prev, status: newStatus }));
    }
  };

  // Handle Product Save (Add / Edit)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      alert('Por favor completa el nombre y precio del producto');
      return;
    }

    const priceNum = parseFloat(productForm.price);
    const stockNum = parseInt(productForm.stock) || 0;

    let updatedList;
    if (editingProduct) {
      const updated = {
        ...editingProduct,
        name: productForm.name,
        price: priceNum,
        category: productForm.category,
        stock: stockNum,
        description: productForm.description,
      };
      await saveProduct(updated);
      updatedList = productsList.map((p) => (p.id === editingProduct.id ? updated : p));
      
      // Also update stock list if present
      setStockList((prev) =>
        prev.map((s) =>
          s.product === editingProduct.name
            ? { ...s, product: productForm.name, quantity: stockNum }
            : s
        )
      );
    } else {
      const newProd = {
        id: Date.now(),
        name: productForm.name,
        price: priceNum,
        category: productForm.category,
        categoryName: productForm.category === 'microcorrugados' ? 'Microcorrugados' : 'Empaques de lujo',
        stock: stockNum,
        description: productForm.description,
        image: productsList[0]?.image || '',
        featured: true,
        forYou: true,
      };
      await saveProduct(newProd);
      updatedList = [newProd, ...productsList];
      setStockList((prev) => [
        { sku: `SKU-${Date.now().toString().slice(-4)}`, product: newProd.name, quantity: stockNum, alertType: 'normal', category: 'General' },
        ...prev,
      ]);
    }

    setProductsList(updatedList);
    setIsProductModalOpen(false);
    setEditingProduct(null);
    setProductForm({ name: '', price: '', category: 'especial', stock: 50, description: '' });
  };

  const openEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      price: prod.price,
      category: prod.category || 'especial',
      stock: prod.stock || 50,
      description: prod.description || '',
    });
    setIsProductModalOpen(true);
  };

  const openNewProduct = () => {
    setEditingProduct(null);
    setProductForm({ name: '', price: '', category: 'especial', stock: 50, description: '' });
    setIsProductModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#edf6f9] text-gray-800 flex flex-col font-sans">
      {/* 1. TOP NAVBAR */}
      <header className="bg-[#144b57] text-white px-4 sm:px-6 py-3 flex items-center justify-between shadow-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#38b2ac]/30 rounded-xl flex items-center justify-center p-1.5 border border-[#38b2ac]/50 shadow-inner">
            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1
              className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2"
              style={{ fontFamily: "'Fredoka One', cursive" }}
            >
              Tu Cajita
              <span className="text-xs bg-[#00cbf4]/20 text-[#00cbf4] border border-[#00cbf4]/40 px-2 py-0.5 rounded-full font-normal">
                Admin Panel
              </span>
            </h1>
          </div>
        </div>

        {/* Right Nav Actions */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Supabase Connected Badge */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-teal-200 bg-white/10 px-3 py-1.5 rounded-full border border-teal-300/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Supabase DB Sincronizado
          </div>

          {/* Tienda preview button */}
          <button
            onClick={() => setCurrentView('home')}
            className="text-xs sm:text-sm font-semibold bg-white/15 hover:bg-white/25 text-white px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
            title="Ir a la vista pública de clientes"
          >
            <span>🏪</span>
            <span className="hidden sm:inline">Ver Tienda</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="p-2 text-teal-100 hover:text-white hover:bg-white/10 rounded-full transition-colors relative cursor-pointer"
              aria-label="Notificaciones"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-[#144b57]"></span>
            </button>

            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 text-gray-800 z-50 text-xs animate-[fadeIn_0.2s_ease]">
                <div className="font-bold text-sm text-gray-900 mb-2 border-b pb-2">Notificaciones</div>
                <div className="space-y-2">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-800 font-medium">
                    📦 30 pedidos pendientes requieren preparación hoy.
                  </div>
                  <div className="p-2 bg-amber-50 rounded-lg text-amber-800 font-medium">
                    ⚠️ Stock bajo en: <i>Caja Casita con Ventana (15 un.)</i>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Avatar Profile */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#fde047] shadow">
              <img src={smileyImg} alt="Admin Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="hidden lg:block text-left text-xs leading-tight">
              <p className="font-bold text-white">{user?.name || 'Administrador'}</p>
              <p className="text-teal-300">admin@tucajita.com</p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="text-xs bg-red-500/80 hover:bg-red-600 text-white font-bold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
            title="Cerrar sesión"
          >
            Salir
          </button>
        </div>
      </header>

      {/* 2. MAIN LAYOUT: SIDEBAR + CONTENT */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-64 bg-[#d9f2f6] border-r border-[#bde5ec] flex flex-col shrink-0 p-4 select-none">
          {/* Quick Product Manage Button */}
          <button
            onClick={openNewProduct}
            className="w-full mb-5 py-2.5 px-4 bg-[#00cbf4] hover:bg-[#00b5dc] text-white font-bold text-sm rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Publicar Producto
          </button>

          {/* Navigation Accordion */}
          <nav className="space-y-4 text-sm text-[#184e5a] font-medium overflow-y-auto">
            {/* PEDIDOS SECTION */}
            <div>
              <button
                onClick={() => toggleSection('pedidos')}
                className="w-full flex items-center justify-between text-base font-bold text-[#144b57] hover:text-[#008ba8] transition-colors py-1 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[#00cbf4]">🛒</span>
                  <span>Pedidos</span>
                </div>
                <span className="text-xs">{openSections.pedidos ? '▲' : '▼'}</span>
              </button>
              {openSections.pedidos && (
                <div className="pl-6 pt-1 space-y-1.5 text-xs text-gray-700 font-semibold">
                  <a
                    href="#pedidos"
                    className="block py-1 hover:text-[#00cbf4] transition-colors cursor-pointer"
                  >
                    Lista de pedidos
                  </a>
                  <a
                    href="#pedidos"
                    onClick={() => setOrderFilterStatus('Pendiente')}
                    className="block py-1 hover:text-[#00cbf4] transition-colors cursor-pointer"
                  >
                    Estado pendiente
                  </a>
                  <a
                    href="#pedidos"
                    className="block py-1 hover:text-[#00cbf4] transition-colors cursor-pointer"
                  >
                    Historial de compras por cliente
                  </a>
                </div>
              )}
            </div>

            {/* PAGOS SECTION */}
            <div>
              <button
                onClick={() => toggleSection('pagos')}
                className="w-full flex items-center justify-between text-base font-bold text-[#144b57] hover:text-[#008ba8] transition-colors py-1 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[#00cbf4]">💳</span>
                  <span>Pagos</span>
                </div>
                <span className="text-xs">{openSections.pagos ? '▲' : '▼'}</span>
              </button>
              {openSections.pagos && (
                <div className="pl-6 pt-1 space-y-1.5 text-xs text-gray-700 font-semibold">
                  <a href="#pagos" className="block py-1 hover:text-[#00cbf4] transition-colors cursor-pointer">
                    Conciliación de Transacciones
                  </a>
                  <a href="#pagos" className="block py-1 hover:text-[#00cbf4] transition-colors cursor-pointer">
                    Facturas digitales
                  </a>
                </div>
              )}
            </div>

            {/* CONTENIDO SECTION */}
            <div>
              <button
                onClick={() => toggleSection('contenido')}
                className="w-full flex items-center justify-between text-base font-bold text-[#144b57] hover:text-[#008ba8] transition-colors py-1 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[#00cbf4]">📁</span>
                  <span>Contenido</span>
                </div>
                <span className="text-xs">{openSections.contenido ? '▲' : '▼'}</span>
              </button>
              {openSections.contenido && (
                <div className="pl-6 pt-1 space-y-1.5 text-xs text-gray-700 font-semibold">
                  <button
                    onClick={() => setCurrentView('home')}
                    className="block py-1 text-left hover:text-[#00cbf4] transition-colors cursor-pointer bg-transparent border-none p-0"
                  >
                    Landing Page
                  </button>
                  <button
                    onClick={openNewProduct}
                    className="block py-1 text-left hover:text-[#00cbf4] transition-colors cursor-pointer bg-transparent border-none p-0"
                  >
                    Gestión de Catálogo & Precios
                  </button>
                </div>
              )}
            </div>

            {/* REPORTE Y ANALÍTICA SECTION */}
            <div>
              <button
                onClick={() => toggleSection('analitica')}
                className="w-full flex items-center justify-between text-base font-bold text-[#144b57] hover:text-[#008ba8] transition-colors py-1 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[#00cbf4]">📈</span>
                  <span>Reporte y Analítica</span>
                </div>
                <span className="text-xs">{openSections.analitica ? '▲' : '▼'}</span>
              </button>
              {openSections.analitica && (
                <div className="pl-6 pt-1 space-y-1.5 text-xs text-gray-700 font-semibold">
                  <a href="#analitica" className="block py-1 hover:text-[#00cbf4] transition-colors cursor-pointer">
                    Ventas por período
                  </a>
                  <a href="#top-productos" className="block py-1 hover:text-[#00cbf4] transition-colors cursor-pointer">
                    Productos más vendidos
                  </a>
                  <a href="#kpis" className="block py-1 hover:text-[#00cbf4] transition-colors cursor-pointer">
                    Tasa de conversión
                  </a>
                  <a href="#inventario" className="block py-1 hover:text-[#00cbf4] transition-colors cursor-pointer">
                    Inventario (Stock)
                  </a>
                </div>
              )}
            </div>
          </nav>
        </aside>

        {/* MAIN BODY CONTENT AREA */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6">
          {/* DASHBOARD HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight uppercase">
                Dashboard Principal
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Métricas en tiempo real, control de stock y conciliación de pedidos.
              </p>
            </div>

            {/* Stock & Catalog Quick Action */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsProductModalOpen(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>🏷️</span>
                <span>Editar Precios & Catálogo ({productsList.length})</span>
              </button>
            </div>
          </div>

          {/* 3. TOP KPI CARDS */}
          <section id="kpis" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Card 1: Ventas Totales */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200/80 relative overflow-hidden flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-xs font-black text-gray-800 tracking-wider">VENTAS TOTALES (MES)</span>
                <span className="text-amber-500 text-xs">✨</span>
              </div>
              <div className="my-2">
                <span className="text-2xl sm:text-3xl font-black text-gray-900">$49.151</span>
              </div>
              {/* Sleek SVG Wave */}
              <div className="w-full h-10 mt-1">
                <svg className="w-full h-full text-[#00cbf4]" viewBox="0 0 100 25" preserveAspectRatio="none">
                  <path
                    d="M0,18 C20,5 35,22 50,12 C65,2 80,18 100,8 L100,25 L0,25 Z"
                    fill="currentColor"
                    fillOpacity="0.15"
                  />
                  <path
                    d="M0,18 C20,5 35,22 50,12 C65,2 80,18 100,8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* Card 2: Tasa de Conversión */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200/80 relative overflow-hidden flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-xs font-black text-gray-800 tracking-wider">TASA DE CONVERSIÓN</span>
                <span className="text-amber-400 font-bold text-base">✦</span>
              </div>
              <div className="my-2">
                <span className="text-2xl sm:text-3xl font-black text-gray-900">46,7%</span>
              </div>
              <div className="text-[11px] font-semibold text-gray-500 flex items-center gap-1">
                <span>Tasa de conversión:</span>
                <span className="text-teal-600 font-bold">1,5%</span>
              </div>
            </div>

            {/* Card 3: Pedidos Pendientes */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200/80 relative overflow-hidden flex flex-col justify-between">
              <span className="text-xs font-black text-gray-800 tracking-wider">PEDIDOS PENDIENTES (HOY)</span>
              <div className="my-2">
                <span className="text-2xl sm:text-3xl font-black text-gray-900">30</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-gray-500">
                <span>Pedidos pendientes: 129</span>
                <div className="w-16 h-6">
                  <svg className="w-full h-full text-cyan-500" viewBox="0 0 50 20">
                    <path d="M0,15 Q15,0 25,12 T50,5" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Card 4: Reembolsos */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200/80 relative overflow-hidden flex flex-col justify-between">
              <span className="text-xs font-black text-gray-800 tracking-wider">REEMBOLSOS (MES)</span>
              <div className="my-2">
                <span className="text-2xl sm:text-3xl font-black text-gray-900">10</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-gray-500">
                <span>Reembolsos rmes: 10%</span>
                <div className="w-16 h-6">
                  <svg className="w-full h-full text-cyan-500" viewBox="0 0 50 20">
                    <path d="M0,18 Q12,2 25,10 T50,8" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Card 5: Tiempo Promedio de Envío */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200/80 relative overflow-hidden flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-xs font-black text-gray-800 tracking-wider">TIEMPO PROMEDIO DE ENVÍO</span>
                <span className="text-amber-500 text-sm">🚚</span>
              </div>
              <div className="my-2">
                <span className="text-2xl sm:text-3xl font-black text-gray-900">1 hmis</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-gray-500">
                <span>Tiempo de comedio: 2 h</span>
                <div className="w-16 h-6">
                  <svg className="w-full h-full text-cyan-500" viewBox="0 0 50 20">
                    <path d="M0,12 Q15,18 30,5 T50,14" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>
          </section>

          {/* 4. MIDDLE TWO-COLUMN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN: PEDIDOS & PAGOS TABLES (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* PEDIDOS SECTION */}
              <div id="pedidos" className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200/80">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-base font-black text-gray-900 tracking-wide uppercase">PEDIDOS</h3>
                    <p className="text-xs text-gray-600 font-medium">
                      Lista de pedidos con estados pendiente, pagado
                    </p>
                  </div>
                </div>

                {/* Filter Toolbar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  {/* ID Filter */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">ID Pedido</label>
                    <input
                      type="text"
                      placeholder="Buscar por ID..."
                      value={orderFilterId}
                      onChange={(e) => setOrderFilterId(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 outline-none focus:border-[#00cbf4]"
                    />
                  </div>

                  {/* Date Filter */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Fecha</label>
                    <input
                      type="text"
                      placeholder="Ej: 21/05/2023"
                      value={orderFilterDate}
                      onChange={(e) => setOrderFilterDate(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 outline-none focus:border-[#00cbf4]"
                    />
                  </div>

                  {/* Estado Filter */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Estado</label>
                    <select
                      value={orderFilterStatus}
                      onChange={(e) => setOrderFilterStatus(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 outline-none focus:border-[#00cbf4]"
                    >
                      <option value="Todos">Todos</option>
                      <option value="Pendiente">Pendiente</option>
                      <option value="Pagado">Pagado</option>
                    </select>
                  </div>
                </div>

                {/* Pedidos Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-800 font-bold bg-gray-50/50">
                        <th className="py-2.5 px-3">ID Pedido ↕</th>
                        <th className="py-2.5 px-3">Cliente ↕</th>
                        <th className="py-2.5 px-3">Fecha ↕</th>
                        <th className="py-2.5 px-3">Total ↕</th>
                        <th className="py-2.5 px-3">Estado ↕</th>
                        <th className="py-2.5 px-3 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-6 text-gray-400">
                            No se encontraron pedidos con estos filtros
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-cyan-50/40 transition-colors">
                            <td className="py-2.5 px-3 font-bold text-gray-900">{ord.id}</td>
                            <td className="py-2.5 px-3 text-gray-800 font-semibold">{ord.client}</td>
                            <td className="py-2.5 px-3 text-gray-600">{ord.date}</td>
                            <td className="py-2.5 px-3 font-bold text-gray-900">${ord.total.toFixed(2)}</td>
                            <td className="py-2.5 px-3">
                              <button
                                onClick={() =>
                                  handleStatusChange(
                                    ord.id,
                                    ord.status === 'Pendiente' ? 'Pagado' : 'Pendiente'
                                  )
                                }
                                className={`px-3 py-1 rounded-md text-[11px] font-bold transition-transform hover:scale-105 cursor-pointer ${
                                  ord.status === 'Pendiente'
                                    ? 'bg-[#00cbf4] text-white'
                                    : 'bg-[#eab308] text-white'
                                }`}
                                title="Haz clic para cambiar estado"
                              >
                                {ord.status}
                              </button>
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <div className="flex items-center justify-center gap-2 text-gray-600">
                                <button
                                  onClick={() => setEditingOrder(ord)}
                                  className="hover:text-[#00cbf4] cursor-pointer"
                                  title="Editar pedido"
                                >
                                  ✏️
                                </button>
                                <button className="hover:text-gray-900 cursor-pointer">•••</button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end items-center gap-2 mt-4 text-xs text-gray-500 font-semibold">
                  <span>Filas 1-{filteredOrders.length}</span>
                  <button className="p-1 hover:bg-gray-100 rounded cursor-pointer">⟨</button>
                  <button className="p-1 hover:bg-gray-100 rounded cursor-pointer">⟩</button>
                </div>
              </div>

              {/* PAGOS SECTION */}
              <div id="pagos" className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200/80">
                <div className="mb-4">
                  <h3 className="text-base font-black text-gray-900 tracking-wide uppercase">PAGOS</h3>
                  <p className="text-xs text-gray-600 font-medium">
                    Conciliación de transacciones (Facturas digitales)
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-800 font-bold bg-gray-50/50">
                        <th className="py-2.5 px-3">ID Transacción</th>
                        <th className="py-2.5 px-3">Fecha</th>
                        <th className="py-2.5 px-3">Cliente</th>
                        <th className="py-2.5 px-3 text-center">Factura Digital</th>
                        <th className="py-2.5 px-3 text-right">Estado de Conciliación</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {transactions.map((t, idx) => (
                        <tr key={`${t.id}-${idx}`} className="hover:bg-cyan-50/40 transition-colors">
                          <td className="py-2.5 px-3 font-bold text-gray-900">{t.id}</td>
                          <td className="py-2.5 px-3 text-gray-600">{t.date}</td>
                          <td className="py-2.5 px-3 text-gray-800 font-semibold">{t.client}</td>
                          <td className="py-2.5 px-3 text-center">
                            <button
                              onClick={() => alert(`Descargando Factura ${t.invoiceId || 'FAC-' + t.id}`)}
                              className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-900 font-bold text-xs bg-teal-50 px-2 py-0.5 rounded cursor-pointer"
                            >
                              <span>📄</span>
                              <span>⬇</span>
                            </button>
                          </td>
                          <td className="py-2.5 px-3 text-right text-gray-600 font-semibold">
                            {t.status}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end items-center gap-2 mt-4 text-xs text-gray-500 font-semibold">
                  <span>Filas 1-8</span>
                  <button className="p-1 hover:bg-gray-100 rounded cursor-pointer">⟨</button>
                  <button className="p-1 hover:bg-gray-100 rounded cursor-pointer">⟩</button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: ANALYTICS, TOP PRODUCTS, CATEGORIES, STOCK (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* REPORTE Y ANALÍTICA: VENTAS POR PERÍODO */}
              <div id="analitica" className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200/80">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xs font-black text-gray-900 tracking-wide uppercase">
                      REPORTE Y ANALÍTICA
                    </h3>
                    <p className="text-[11px] text-gray-600 font-semibold">
                      Ventas por período (días/semana/mes/años)
                    </p>
                  </div>
                  {/* Period Switch */}
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                    <button
                      onClick={() => setChartPeriod('Mes')}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        chartPeriod === 'Mes'
                          ? 'bg-[#00cbf4] text-white shadow-sm'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      Mes
                    </button>
                    <button
                      onClick={() => setChartPeriod('Año')}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        chartPeriod === 'Año'
                          ? 'bg-[#00cbf4] text-white shadow-sm'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      Año
                    </button>
                  </div>
                </div>

                {/* SVG Line Chart */}
                <div className="relative h-44 w-full">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between text-[9px] text-gray-400 font-semibold pointer-events-none pb-5">
                    <div className="border-b border-gray-100 flex justify-between"><span>1000</span></div>
                    <div className="border-b border-gray-100 flex justify-between"><span>800</span></div>
                    <div className="border-b border-gray-100 flex justify-between"><span>600</span></div>
                    <div className="border-b border-gray-100 flex justify-between"><span>400</span></div>
                    <div className="border-b border-gray-100 flex justify-between"><span>200</span></div>
                    <div className="border-b border-gray-100 flex justify-between"><span>0</span></div>
                  </div>

                  <svg className="w-full h-36 relative z-10" viewBox="0 0 350 140" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00cbf4" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#00cbf4" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Area fill */}
                    <path
                      d="M 10,130 C 40,70 60,65 90,80 C 120,95 150,30 180,25 C 210,20 240,65 270,75 C 300,85 320,35 340,30 L 340,140 L 10,140 Z"
                      fill="url(#areaGradient)"
                    />
                    {/* Curve line */}
                    <path
                      d="M 10,130 C 40,70 60,65 90,80 C 120,95 150,30 180,25 C 210,20 240,65 270,75 C 300,85 320,35 340,30"
                      fill="none"
                      stroke="#00cbf4"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    {/* Data dots */}
                    <circle cx="10" cy="130" r="3.5" fill="#00cbf4" />
                    <circle cx="90" cy="80" r="3.5" fill="#00cbf4" />
                    <circle cx="180" cy="25" r="4.5" fill="#00cbf4" stroke="#fff" strokeWidth="2" />
                    <circle cx="270" cy="75" r="3.5" fill="#00cbf4" />
                    <circle cx="340" cy="30" r="3.5" fill="#00cbf4" />
                  </svg>

                  {/* X Axis Labels */}
                  <div className="flex justify-between text-[10px] text-gray-500 font-bold pt-1 px-1">
                    <span>Mev</span>
                    <span>Fev</span>
                    <span>Mar</span>
                    <span>Abr</span>
                    <span>Mai</span>
                    <span>Jun</span>
                    <span>Juls</span>
                  </div>
                </div>
              </div>

              {/* TOP 10 PRODUCTOS MÁS VENDIDOS */}
              <div id="top-productos" className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200/80">
                <h3 className="text-xs font-black text-gray-900 tracking-wide uppercase mb-3">
                  TOP 10 PRODUCTOS MÁS VENDIDOS (MES)
                </h3>
                <div className="space-y-2 text-xs">
                  {[
                    { name: 'Caja Happy Day Corazón', count: 90 },
                    { name: 'Caja Casita Ventana', count: 77 },
                    { name: 'Caja Lujo Premium Gold', count: 60 },
                    { name: 'Portavasos Múltiple', count: 60 },
                    { name: 'Caja Unicolor Negra', count: 50 },
                    { name: 'Caja Mini Sorpresa', count: 40 },
                    { name: 'Caja Pequeños Detalles', count: 40 },
                    { name: 'Caja Amor Happy Day', count: 25 },
                    { name: 'Caja Casita Jardín', count: 25 },
                    { name: 'Caja Regalo Lujo Especial', count: 12 },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-36 truncate text-[11px] font-bold text-gray-700" title={item.name}>
                        {item.name}
                      </span>
                      <div className="flex-1 bg-gray-100 rounded-full h-3.5 overflow-hidden flex items-center">
                        <div
                          className="bg-[#00cbf4] h-full rounded-full transition-all duration-500"
                          style={{ width: `${(item.count / 90) * 100}%` }}
                        ></div>
                      </div>
                      <span className="w-6 text-right font-extrabold text-[11px] text-gray-900">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ANÁLISIS DE CATEGORÍAS */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200/80">
                <h3 className="text-xs font-black text-gray-900 tracking-wide uppercase mb-3">
                  ANÁLISIS DE CATEGORÍAS
                </h3>
                <div className="space-y-2 text-xs font-semibold">
                  {[
                    { name: 'Microcorrugados', row: [90, 80, 50, 20, 10] },
                    { name: 'Empaques de lujo', row: [100, 95, 70, 40, 20] },
                    { name: 'Unicolor / Blanco', row: [80, 75, 60, 50, 30] },
                    { name: 'Portavasos', row: [40, 35, 30, 20, 10] },
                  ].map((cat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-28 text-[11px] text-gray-700 font-bold truncate">{cat.name}</span>
                      <div className="flex-1 grid grid-cols-5 gap-1">
                        {cat.row.map((val, cellIdx) => (
                          <div
                            key={cellIdx}
                            className="h-5 rounded"
                            style={{
                              backgroundColor: `rgba(0, 203, 244, ${val / 100})`,
                            }}
                            title={`Nivel de ventas: ${val}%`}
                          ></div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* INVENTARIO (STOCK) */}
              <div id="inventario" className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200/80">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-black text-gray-900 tracking-wide uppercase flex items-center gap-1.5">
                    <span>INVENTARIO (STOCK)</span>
                    <span className="text-amber-400">✦</span>
                  </h3>
                  <button
                    onClick={() => setIsProductModalOpen(true)}
                    className="text-[11px] font-bold text-[#00cbf4] hover:underline cursor-pointer"
                  >
                    + Modificar Stock
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-800 font-bold bg-gray-50/50">
                        <th className="py-2 px-2">SKU</th>
                        <th className="py-2 px-2">Producto</th>
                        <th className="py-2 px-2">Cantidad</th>
                        <th className="py-2 px-2 text-center">Alertas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {stockList.map((stk, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="py-2 px-2 font-bold text-gray-800">{stk.sku}</td>
                          <td className="py-2 px-2 text-gray-700 font-semibold truncate max-w-[130px]" title={stk.product}>
                            {stk.product}
                          </td>
                          <td className="py-2 px-2 font-bold text-gray-900">{stk.quantity}</td>
                          <td className="py-2 px-2 text-center">
                            <span
                              className="text-base"
                              title={
                                stk.alertType === 'danger'
                                  ? 'Stock Crítico'
                                  : stk.alertType === 'warning'
                                  ? 'Stock Medio'
                                  : 'Stock Óptimo'
                              }
                            >
                              {stk.alertType === 'danger' ? '🎁' : stk.alertType === 'warning' ? '📦' : '🟢'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* 5. BOTTOM ROW: CUSTOMER FEEDBACK & SATISFACTION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
            {/* COMENTARIOS RECIENTES DE CLIENTES (8 Cols) */}
            <div className="lg:col-span-8 bg-white rounded-2xl p-5 shadow-sm border border-gray-200/80">
              <h3 className="text-xs font-black text-gray-900 tracking-wide uppercase mb-3">
                COMENTARIOS RECIENTES DE CLIENTES
              </h3>
              <div className="space-y-3">
                {reviewsList.map((rev) => (
                  <div
                    key={rev.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs font-medium"
                  >
                    <div className="font-bold text-gray-900 sm:w-48 shrink-0">{rev.author}</div>
                    <div className="text-gray-600 italic flex-1">&ldquo;{rev.comment}&rdquo;</div>
                    <div className="text-amber-500 font-bold shrink-0">
                      {'★'.repeat(rev.rating)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SATISFACCIÓN DEL CLIENTE (4 Cols) */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-black text-gray-900 tracking-wide uppercase">
                    SATISFACCIÓN DEL CLIENTE
                  </h3>
                  <span className="text-amber-400">✦</span>
                </div>

                {/* Rating bars */}
                <div className="flex items-end justify-between h-28 gap-2 pt-2 px-3 pb-2 border-b border-gray-100">
                  {[
                    { label: '1★', height: '35%' },
                    { label: '2★', height: '45%' },
                    { label: '3★', height: '60%' },
                    { label: '4★', height: '90%' },
                    { label: '5★', height: '80%' },
                  ].map((bar, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                      <div
                        className="w-full bg-[#00cbf4] rounded-t-md transition-all duration-500"
                        style={{ height: bar.height }}
                      ></div>
                      <span className="text-[10px] text-gray-500 font-bold">{bar.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* NPS & Stars */}
              <div className="flex items-center justify-between pt-3 text-xs font-bold text-gray-800">
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">NPS:</span>
                  <span className="text-teal-600 font-black text-sm">+74</span>
                </div>
                <div className="text-amber-400 text-sm tracking-widest">★★★★★</div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* 6. MODAL: EDITAR / PUBLICAR PRODUCTOS & PRECIOS */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-[fadeIn_0.2s_ease]">
            <button
              onClick={() => setIsProductModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 text-xl font-bold cursor-pointer"
            >
              ✕
            </button>

            <h3
              className="text-2xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: "'Fredoka One', cursive" }}
            >
              {editingProduct ? 'Editar Producto / Precio' : 'Publicar Nuevo Producto'}
            </h3>
            <p className="text-xs text-gray-500 mb-6 font-medium">
              Los cambios se guardan y sincronizan automáticamente con la tienda y Supabase.
            </p>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-bold text-gray-700">
              <div>
                <label className="block mb-1 text-gray-800">Nombre del Producto *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="Ej: Caja Happy Day Corazón"
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold outline-none focus:border-[#00cbf4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-gray-800">Precio ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="89.99"
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold outline-none focus:border-[#00cbf4]"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-gray-800">Stock (Unidades) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    placeholder="50"
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold outline-none focus:border-[#00cbf4]"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-gray-800">Categoría</label>
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold outline-none focus:border-[#00cbf4]"
                >
                  <option value="especial">Diseño Especial / Empaques de Lujo</option>
                  <option value="microcorrugados">Microcorrugados</option>
                  <option value="unicolor">Unicolor</option>
                  <option value="unicolor-blanco">Unicolor Blanco</option>
                  <option value="portavasos">Portavasos</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-gray-800">Descripción del Producto</label>
                <textarea
                  rows="3"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Detalles sobre materiales, dimensiones y acabados..."
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium outline-none focus:border-[#00cbf4]"
                ></textarea>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#00cbf4] hover:bg-[#00b5dc] text-white font-bold rounded-xl text-sm shadow transition-all cursor-pointer"
                >
                  {editingProduct ? 'Actualizar Producto' : 'Guardar y Publicar'}
                </button>
              </div>
            </form>

            {/* Existing products quick edit list */}
            <div className="mt-6 pt-5 border-t border-gray-100">
              <h4 className="font-bold text-gray-800 mb-3 text-xs uppercase tracking-wider">
                Catálogo Actual ({productsList.length} productos)
              </h4>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {productsList.map((prod) => (
                  <div
                    key={prod.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs font-semibold"
                  >
                    <div className="truncate flex-1 mr-2">
                      <span className="text-gray-900">{prod.name}</span>
                      <span className="text-teal-600 font-bold ml-2">${Number(prod.price).toFixed(2)}</span>
                    </div>
                    <button
                      onClick={() => openEditProduct(prod)}
                      className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded font-bold cursor-pointer"
                    >
                      Editar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. MODAL: EDITAR PEDIDO */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-[fadeIn_0.2s_ease]">
            <button
              onClick={() => setEditingOrder(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold cursor-pointer"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Pedido #{editingOrder.id}</h3>
            <p className="text-xs text-gray-500 mb-4 font-semibold">Cliente: {editingOrder.client}</p>

            <div className="space-y-3 text-xs font-bold text-gray-700">
              <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                <span>Fecha:</span>
                <span className="text-gray-900">{editingOrder.date}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                <span>Total:</span>
                <span className="text-teal-600 text-sm font-black">${editingOrder.total.toFixed(2)}</span>
              </div>

              <div>
                <label className="block mb-1 text-gray-800">Cambiar Estado:</label>
                <select
                  value={editingOrder.status}
                  onChange={(e) => handleStatusChange(editingOrder.id, e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold outline-none focus:border-[#00cbf4]"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Pagado">Pagado</option>
                </select>
              </div>

              <button
                onClick={() => setEditingOrder(null)}
                className="w-full py-3 mt-4 bg-[#00cbf4] hover:bg-[#00b5dc] text-white font-bold rounded-xl text-sm cursor-pointer"
              >
                Cerrar y Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
