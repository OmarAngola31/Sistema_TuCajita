import { useState, useEffect, useMemo } from 'react';
import logo from '../assets/logo.png';
import smileyImg from '../assets/smiley_emoji.jpg';
import {
  getOrders,
  saveOrder,
  deleteOrder,
  updateOrderStatus,
  getTransactions,
  getInvoices,
  getStockData,
  getReviews,
  getProducts,
  saveProduct,
  deleteProduct,
  defaultLandingConfig,
} from '../services/dbService';

export default function AdminDashboard({ user, setCurrentView, onLogout }) {
  // Sidebar State
  const [openSections, setOpenSections] = useState({
    pedidos: true,
    pagos: true,
    contenido: true,
    analitica: true,
  });

  // Current active view in admin
  // 'dashboard' | 'pedidos_lista' | 'pedidos_pendiente' | 'pedidos_clientes' |
  // 'pagos_conciliacion' | 'pagos_facturas' |
  // 'contenido_landing' | 'contenido_catalogo' |
  // 'analitica_ventas' | 'analitica_top_productos' | 'analitica_conversion' | 'analitica_stock'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Main Data States
  const [orders, setOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [stockList, setStockList] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [reviewsList, setReviewsList] = useState([]);
  const [landingConfig, setLandingConfig] = useState(defaultLandingConfig);

  // Filter States
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('Todos');
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('Todos');
  const [transactionSearch, setTransactionSearch] = useState('');
  const [transactionStatusFilter, setTransactionStatusFilter] = useState('Todos');
  const [clientSearch, setClientSearch] = useState('');

  // Modals & Active Edit Entities
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    category: 'especial',
    type: 'cajas',
    stock: 50,
    minStock: 20,
    description: '',
    ref: '',
    medidas: '20x20x10 cm',
    image: '',
    gallery: [],
    colors: ['coral', 'black', 'white'],
    sizes: ['P', 'M', 'G', 'EG'],
    featured: true,
    forYou: true,
  });

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [orderForm, setOrderForm] = useState({
    client: '',
    email: '',
    phone: '',
    deliveryAddress: '',
    total: '',
    status: 'Pendiente',
    paymentMethod: 'Pago Móvil',
    productName: '',
    qty: 1,
  });

  const [selectedInvoiceView, setSelectedInvoiceView] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({
    orderId: '',
    client: '',
    idDoc: '',
    total: '',
    paymentMethod: 'Pago Móvil',
  });

  const [selectedClientDetails, setSelectedClientDetails] = useState(null);

  // Interactive Analytics Period
  const [chartPeriod, setChartPeriod] = useState('Mes');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Load Data on Mount
  useEffect(() => {
    async function loadData() {
      const ords = await getOrders();
      setOrders(ords);
      const trans = await getTransactions();
      setTransactions(trans);
      const invs = await getInvoices();
      setInvoices(invs);
      const stk = await getStockData();
      setStockList(stk);
      const revs = await getReviews();
      setReviewsList(revs);
      const prods = await getProducts();
      setProductsList(prods);
    }
    loadData();

    // Sincronizar reactivamente pedidos, facturas, transacciones, catálogo y stock
    const handleProductsSync = (e) => {
      if (e.detail) setProductsList(e.detail);
    };
    const handleOrdersSync = (e) => {
      if (e.detail) setOrders(e.detail);
    };
    const handleInvoicesSync = (e) => {
      if (e.detail) setInvoices(e.detail);
    };
    const handleTransactionsSync = (e) => {
      if (e.detail) setTransactions(e.detail);
    };
    const handleStockSync = (e) => {
      if (e.detail) setStockList(e.detail);
    };

    window.addEventListener('tucajita_products_updated', handleProductsSync);
    window.addEventListener('tucajita_orders_updated', handleOrdersSync);
    window.addEventListener('tucajita_invoices_updated', handleInvoicesSync);
    window.addEventListener('tucajita_transactions_updated', handleTransactionsSync);
    window.addEventListener('tucajita_stock_updated', handleStockSync);

    return () => {
      window.removeEventListener('tucajita_products_updated', handleProductsSync);
      window.removeEventListener('tucajita_orders_updated', handleOrdersSync);
      window.removeEventListener('tucajita_invoices_updated', handleInvoicesSync);
      window.removeEventListener('tucajita_transactions_updated', handleTransactionsSync);
      window.removeEventListener('tucajita_stock_updated', handleStockSync);
    };
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // --- CRUD: ORDERS ---
  const handleSaveOrder = async (e) => {
    e.preventDefault();
    if (!orderForm.client || !orderForm.total) {
      alert('Por favor completa los campos requeridos');
      return;
    }

    const totalNum = parseFloat(orderForm.total);
    if (editingOrder) {
      const updated = {
        ...editingOrder,
        client: orderForm.client,
        email: orderForm.email,
        phone: orderForm.phone,
        deliveryAddress: orderForm.deliveryAddress,
        total: totalNum,
        status: orderForm.status,
        paymentMethod: orderForm.paymentMethod,
      };
      await saveOrder(updated);
      setOrders((prev) => prev.map((o) => (o.id === editingOrder.id ? updated : o)));
      showToast(`Pedido #${editingOrder.id} actualizado correctamente`);
    } else {
      const newOrd = {
        id: (20000 + orders.length + 1).toString(),
        client: orderForm.client,
        email: orderForm.email || 'cliente@tucajita.com',
        phone: orderForm.phone || '+58 412-0000000',
        deliveryAddress: orderForm.deliveryAddress || 'Retiro en tienda / Maracay',
        date: new Date().toISOString().split('T')[0],
        total: totalNum,
        status: orderForm.status,
        items: parseInt(orderForm.qty) || 1,
        paymentMethod: orderForm.paymentMethod,
        itemsList: [
          {
            name: orderForm.productName || 'Caja Personalizada',
            qty: parseInt(orderForm.qty) || 1,
            price: totalNum,
          },
        ],
      };
      await saveOrder(newOrd);
      setOrders((prev) => [newOrd, ...prev]);
      showToast(`Pedido #${newOrd.id} creado con éxito`);
    }

    setIsOrderModalOpen(false);
    setEditingOrder(null);
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm(`¿Estás seguro de eliminar el Pedido #${orderId}?`)) {
      await deleteOrder(orderId);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      if (selectedOrderDetails?.id === orderId) setSelectedOrderDetails(null);
      showToast(`Pedido #${orderId} eliminado`);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showToast(`Estado del pedido #${orderId} cambiado a: ${newStatus}`);
  };

  const openNewOrder = () => {
    setEditingOrder(null);
    setOrderForm({
      client: '',
      email: '',
      phone: '',
      deliveryAddress: '',
      total: '',
      status: 'Pendiente',
      paymentMethod: 'Pago Móvil',
      productName: '',
      qty: 1,
    });
    setIsOrderModalOpen(true);
  };

  const openEditOrder = (ord) => {
    setEditingOrder(ord);
    setOrderForm({
      client: ord.client,
      email: ord.email || '',
      phone: ord.phone || '',
      deliveryAddress: ord.deliveryAddress || '',
      total: ord.total,
      status: ord.status,
      paymentMethod: ord.paymentMethod || 'Pago Móvil',
      productName: ord.itemsList?.[0]?.name || '',
      qty: ord.items || 1,
    });
    setIsOrderModalOpen(true);
  };

  // --- CRUD: PRODUCTS ---
  const availableColorPresets = [
    { id: 'coral', name: 'Rosa Coral', hex: '#f07c82' },
    { id: 'black', name: 'Negro', hex: '#111827' },
    { id: 'white', name: 'Blanco', hex: '#ffffff' },
    { id: 'gold', name: 'Dorado', hex: '#eab308' },
    { id: 'blue', name: 'Azul', hex: '#38bdf8' },
    { id: 'red', name: 'Rojo', hex: '#ef4444' },
    { id: 'kraft', name: 'Kraft', hex: '#c29b68' },
    { id: 'purple', name: 'Morado', hex: '#8b5cf6' },
  ];

  const availableSizePresets = [
    { id: 'P', label: 'P', desc: 'Pequeña (15x15x8 cm)' },
    { id: 'M', label: 'M', desc: 'Mediana (20x20x10 cm)' },
    { id: 'G', label: 'G', desc: 'Grande (25,5x19x9 cm)' },
    { id: 'EG', label: 'EG', desc: 'Extra Grande (30x30x12 cm)' },
  ];

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido (PNG, JPG, WEBP, etc.)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar los 5MB para un óptimo rendimiento');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target.result;
      setImagePreview(base64Data);
      setProductForm((prev) => ({ ...prev, image: base64Data }));
    };
    reader.readAsDataURL(file);
  };

  const handleSecondaryImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      if (file.size > 5 * 1024 * 1024) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target.result;
        setGalleryPreviews((prev) => [...prev, base64].slice(0, 4));
        setProductForm((prev) => ({
          ...prev,
          gallery: [...(prev.gallery || []), base64].slice(0, 4),
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveSecondaryImage = (idxToRemove) => {
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== idxToRemove));
    setProductForm((prev) => ({
      ...prev,
      gallery: (prev.gallery || []).filter((_, i) => i !== idxToRemove),
    }));
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setProductForm((prev) => ({ ...prev, image: '' }));
  };

  const toggleColorOption = (colorId) => {
    setProductForm((prev) => {
      const current = prev.colors || ['coral', 'black', 'white'];
      const exists = current.includes(colorId);
      const updated = exists ? current.filter((c) => c !== colorId) : [...current, colorId];
      return { ...prev, colors: updated.length > 0 ? updated : [colorId] };
    });
  };

  const toggleSizeOption = (sizeId) => {
    setProductForm((prev) => {
      const current = prev.sizes || ['P', 'M', 'G', 'EG'];
      const exists = current.includes(sizeId);
      const updated = exists ? current.filter((s) => s !== sizeId) : [...current, sizeId];
      return { ...prev, sizes: updated.length > 0 ? updated : [sizeId] };
    });
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      alert('Por favor completa el nombre y precio del producto');
      return;
    }

    const priceNum = parseFloat(productForm.price);
    const stockNum = parseInt(productForm.stock) || 0;
    const minStockNum = parseInt(productForm.minStock) || 20;

    const categoryNamesMap = {
      especial: 'Empaques de Lujo',
      microcorrugados: 'Microcorrugados',
      unicolor: 'Unicolor',
      portavasos: 'Portavasos',
    };

    const finalCategoryName = categoryNamesMap[productForm.category] || 'Empaques de Lujo';
    const finalImage = productForm.image || editingProduct?.image || productsList[0]?.image || '';
    const finalGallery = productForm.gallery?.length ? productForm.gallery : (galleryPreviews.length ? galleryPreviews : (editingProduct?.gallery || []));
    const finalColors = productForm.colors?.length ? productForm.colors : ['coral', 'black', 'white'];
    const finalSizes = productForm.sizes?.length ? productForm.sizes : ['P', 'M', 'G', 'EG'];

    let updatedList;
    if (editingProduct) {
      const updated = {
        ...editingProduct,
        name: productForm.name.trim(),
        price: priceNum,
        category: productForm.category,
        categoryName: finalCategoryName,
        type: productForm.type || 'cajas',
        stock: stockNum,
        minStock: minStockNum,
        description: productForm.description.trim(),
        ref: productForm.ref || editingProduct.ref || `TC-${editingProduct.id}`,
        medidas: productForm.medidas || '20x20x10 cm',
        image: finalImage,
        gallery: finalGallery,
        colors: finalColors,
        sizes: finalSizes,
        featured: Boolean(productForm.featured),
        forYou: Boolean(productForm.forYou),
        estatus: 'Activo',
      };
      await saveProduct(updated);
      updatedList = productsList.map((p) => (p.id === editingProduct.id ? updated : p));

      setStockList((prev) =>
        prev.map((s) =>
          s.product === editingProduct.name
            ? { ...s, product: productForm.name, quantity: stockNum, price: priceNum, sku: updated.ref, minStock: minStockNum }
            : s
        )
      );
      showToast(`Producto "${productForm.name}" actualizado y sincronizado`);
    } else {
      const newProd = {
        id: Date.now(),
        ref: productForm.ref || `TC-${Date.now().toString().slice(-4)}`,
        name: productForm.name.trim(),
        price: priceNum,
        category: productForm.category,
        categoryName: finalCategoryName,
        type: productForm.type || 'cajas',
        stock: stockNum,
        minStock: minStockNum,
        medidas: productForm.medidas || '20x20x10 cm',
        description: productForm.description.trim(),
        image: finalImage,
        gallery: finalGallery,
        colors: finalColors,
        sizes: finalSizes,
        featured: Boolean(productForm.featured),
        forYou: Boolean(productForm.forYou),
        estatus: 'Activo',
      };
      await saveProduct(newProd);
      updatedList = [newProd, ...productsList];
      setStockList((prev) => [
        {
          sku: newProd.ref,
          product: newProd.name,
          quantity: stockNum,
          minStock: minStockNum,
          alertType: 'normal',
          category: newProd.categoryName,
          price: priceNum,
          location: 'Pasillo A-01',
          reorderQty: 40,
        },
        ...prev,
      ]);
      showToast(`Producto "${newProd.name}" publicado y sincronizado en vivo`);
    }

    setProductsList(updatedList);
    setIsProductModalOpen(false);
    setEditingProduct(null);
    setImagePreview('');
    setGalleryPreviews([]);
  };

  const handleDeleteProduct = async (prodId, prodName) => {
    if (window.confirm(`¿Estás seguro de eliminar el producto "${prodName}"?`)) {
      await deleteProduct(prodId);
      setProductsList((prev) => prev.filter((p) => p.id !== prodId));
      setStockList((prev) => prev.filter((s) => s.product !== prodName));
      showToast(`Producto "${prodName}" eliminado del catálogo`);
    }
  };

  const openEditProduct = (prod) => {
    setEditingProduct(prod);
    setImagePreview(prod.image || '');
    const currentGallery = Array.isArray(prod.gallery) ? prod.gallery : (Array.isArray(prod.images) ? prod.images : []);
    setGalleryPreviews(currentGallery);
    setProductForm({
      name: prod.name || '',
      price: prod.price || '',
      category: prod.category || 'especial',
      type: prod.type || 'cajas',
      stock: prod.stock ?? 50,
      minStock: prod.minStock ?? 20,
      description: prod.description || '',
      ref: prod.ref || `TC-${prod.id}`,
      medidas: prod.medidas || '20x20x10 cm',
      image: prod.image || '',
      gallery: currentGallery,
      colors: prod.colors?.map((c) => (typeof c === 'string' ? c : c.id)) || ['coral', 'black', 'white'],
      sizes: prod.sizes?.map((s) => (typeof s === 'string' ? s : s.id)) || ['P', 'M', 'G', 'EG'],
      featured: prod.featured !== false,
      forYou: prod.forYou !== false,
    });
    setIsProductModalOpen(true);
  };

  const openNewProduct = () => {
    setEditingProduct(null);
    setImagePreview('');
    setGalleryPreviews([]);
    setProductForm({
      name: '',
      price: '',
      category: 'especial',
      type: 'cajas',
      stock: 50,
      minStock: 20,
      description: '',
      ref: `TC-${Math.floor(100 + Math.random() * 900)}`,
      medidas: '20x20x10 cm',
      image: '',
      gallery: [],
      colors: ['coral', 'black', 'white'],
      sizes: ['P', 'M', 'G', 'EG'],
      featured: true,
      forYou: true,
    });
    setIsProductModalOpen(true);
  };

  // --- CRUD: INVOICES ---
  const handleSaveInvoice = (e) => {
    e.preventDefault();
    const totalNum = parseFloat(invoiceForm.total);
    const subtotal = Number((totalNum / 1.16).toFixed(2));
    const tax = Number((totalNum - subtotal).toFixed(2));

    const newInv = {
      id: `FAC-${20000 + invoices.length + 1}`,
      orderId: invoiceForm.orderId || '20016',
      client: invoiceForm.client,
      idDoc: invoiceForm.idDoc || 'V-12.345.678',
      date: new Date().toISOString().split('T')[0],
      subtotal,
      tax,
      total: totalNum,
      status: 'Emitida',
      paymentMethod: invoiceForm.paymentMethod,
    };
    setInvoices([newInv, ...invoices]);
    setIsInvoiceModalOpen(false);
    showToast(`Factura ${newInv.id} emitida con éxito`);
  };

  const handleDeleteInvoice = (invId) => {
    if (window.confirm(`¿Deseas anular la factura ${invId}?`)) {
      setInvoices((prev) => prev.filter((i) => i.id !== invId));
      showToast(`Factura ${invId} anulada`);
    }
  };

  // --- STOCK ADJUSTMENTS ---
  const adjustStock = (sku, delta) => {
    setStockList((prev) =>
      prev.map((s) => {
        if (s.sku === sku) {
          const newQty = Math.max(0, s.quantity + delta);
          const alertType = newQty <= s.minStock ? 'danger' : newQty <= s.minStock + 10 ? 'warning' : 'normal';
          return { ...s, quantity: newQty, alertType };
        }
        return s;
      })
    );
    showToast(`Stock actualizado para SKU: ${sku}`);
  };

  // Derived Customers List from orders
  const uniqueClients = useMemo(() => {
    const map = new Map();
    orders.forEach((o) => {
      if (!map.has(o.client)) {
        map.set(o.client, {
          name: o.client,
          email: o.email || `${o.client.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
          phone: o.phone || '+58 412-1234567',
          address: o.deliveryAddress || 'Maracay, Edo. Aragua',
          totalOrders: 1,
          totalSpent: o.total,
          lastOrderDate: o.date,
          ordersList: [o],
        });
      } else {
        const item = map.get(o.client);
        item.totalOrders += 1;
        item.totalSpent += o.total;
        item.ordersList.push(o);
      }
    });
    return Array.from(map.values());
  }, [orders]);

  // Filtered lists
  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.client.toLowerCase().includes(orderSearch.toLowerCase());
    const matchStatus =
      orderStatusFilter === 'Todos' ? true : o.status === orderStatusFilter;
    return matchSearch && matchStatus;
  });

  const pendingOrders = orders.filter(
    (o) => o.status === 'Pendiente' || o.status === 'En Preparación'
  );

  const filteredProducts = productsList.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.ref && p.ref.toLowerCase().includes(productSearch.toLowerCase()));
    const matchCat =
      productCategoryFilter === 'Todos' || p.category === productCategoryFilter;
    return matchSearch && matchCat;
  });

  const filteredTransactions = transactions.filter((t) => {
    const matchSearch =
      t.client.toLowerCase().includes(transactionSearch.toLowerCase()) ||
      t.id.toLowerCase().includes(transactionSearch.toLowerCase()) ||
      t.reference.toLowerCase().includes(transactionSearch.toLowerCase());
    const matchStatus =
      transactionStatusFilter === 'Todos' || t.status === transactionStatusFilter;
    return matchSearch && matchStatus;
  });

  const filteredClients = uniqueClients.filter((c) =>
    c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(clientSearch.toLowerCase())
  );

  // Helper for Breadcrumb title
  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard Principal';
      case 'pedidos_lista':
        return 'Pedidos / Lista de Pedidos';
      case 'pedidos_pendiente':
        return 'Pedidos / Estado Pendiente';
      case 'pedidos_clientes':
        return 'Pedidos / Historial por Cliente';
      case 'pagos_conciliacion':
        return 'Pagos / Conciliación de Transacciones';
      case 'pagos_facturas':
        return 'Pagos / Facturas Digitales';
      case 'contenido_landing':
        return 'Contenido / Configuración Landing Page';
      case 'contenido_catalogo':
        return 'Contenido / Gestión de Catálogo & Precios';
      case 'analitica_ventas':
        return 'Reporte y Analítica / Ventas por Período';
      case 'analitica_top_productos':
        return 'Reporte y Analítica / Productos Más Vendidos';
      case 'analitica_conversion':
        return 'Reporte y Analítica / Tasa de Conversión';
      case 'analitica_stock':
        return 'Reporte y Analítica / Inventario (Stock)';
      default:
        return 'Dashboard Principal';
    }
  };

  return (
    <div className="min-h-screen bg-[#edf6f9] text-gray-800 flex flex-col font-sans">
      {/* TOAST ALERT NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#144b57] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-teal-400/40 animate-[fadeIn_0.2s_ease]">
          <span className="text-emerald-400 text-lg font-bold">✓</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP NAVBAR */}
      <header className="bg-[#144b57] text-white px-4 sm:px-6 py-3 flex items-center justify-between shadow-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div
            onClick={() => setActiveTab('dashboard')}
            className="w-10 h-10 bg-[#38b2ac]/30 rounded-xl flex items-center justify-center p-1.5 border border-[#38b2ac]/50 shadow-inner cursor-pointer hover:scale-105 transition-transform"
          >
            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1
              onClick={() => setActiveTab('dashboard')}
              className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2 cursor-pointer"
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
          {/* Supabase Status */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-teal-200 bg-white/10 px-3 py-1.5 rounded-full border border-teal-300/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Supabase DB Sincronizado
          </div>

          {/* Tienda preview */}
          <button
            onClick={() => setCurrentView('home')}
            className="text-xs sm:text-sm font-semibold bg-white/15 hover:bg-white/25 text-white px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
            title="Ir a la tienda pública de clientes"
          >
            <span>🏪</span>
            <span className="hidden sm:inline">Ver Tienda</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="p-2 text-teal-100 hover:text-white hover:bg-white/10 rounded-full transition-colors relative cursor-pointer"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-[#144b57]"></span>
            </button>

            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 text-gray-800 z-50 text-xs animate-[fadeIn_0.2s_ease]">
                <div className="font-bold text-sm text-gray-900 mb-2 border-b pb-2 flex justify-between items-center">
                  <span>Notificaciones del Sistema</span>
                  <span className="text-[10px] bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded font-bold">2 nuevas</span>
                </div>
                <div className="space-y-2">
                  <div
                    onClick={() => { setActiveTab('pedidos_pendiente'); setNotificationOpen(false); }}
                    className="p-2.5 bg-cyan-50 hover:bg-cyan-100/80 rounded-xl text-cyan-900 font-medium cursor-pointer transition-colors"
                  >
                    📦 <b>{pendingOrders.length} pedidos pendientes</b> requieren preparación y confirmación.
                  </div>
                  <div
                    onClick={() => { setActiveTab('analitica_stock'); setNotificationOpen(false); }}
                    className="p-2.5 bg-amber-50 hover:bg-amber-100/80 rounded-xl text-amber-900 font-medium cursor-pointer transition-colors"
                  >
                    ⚠️ Stock bajo detectado en <b>Caja Casita con Ventana</b> y 2 productos más.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Avatar Profile */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#fde047] shadow">
              <img src={smileyImg} alt="Admin" className="w-full h-full object-cover" />
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
          >
            Salir
          </button>
        </div>
      </header>

      {/* 2. MAIN LAYOUT: SIDEBAR + CONTENT */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-64 bg-[#d9f2f6] border-r border-[#bde5ec] flex flex-col shrink-0 p-4 select-none">
          {/* Quick Product Button */}
          <button
            onClick={openNewProduct}
            className="w-full mb-4 py-2.5 px-4 bg-[#00cbf4] hover:bg-[#00b5dc] text-white font-bold text-sm rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="text-lg leading-none">+</span>
            Publicar Producto
          </button>

          {/* Dashboard Overview Direct Tab */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full mb-3 px-3 py-2 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-[#144b57] text-white shadow-md'
                : 'text-[#144b57] hover:bg-[#c6ebf1]'
            }`}
          >
            <span>📊</span>
            <span>Dashboard Principal</span>
          </button>

          {/* Navigation Accordion */}
          <nav className="space-y-3.5 text-xs text-[#184e5a] font-medium overflow-y-auto flex-1 pr-1">
            {/* PEDIDOS SECTION */}
            <div>
              <button
                onClick={() => toggleSection('pedidos')}
                className="w-full flex items-center justify-between text-xs font-bold text-[#144b57] hover:text-[#008ba8] transition-colors py-1 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[#00cbf4]">🛒</span>
                  <span>Pedidos</span>
                </div>
                <span className="text-[10px]">{openSections.pedidos ? '▲' : '▼'}</span>
              </button>
              {openSections.pedidos && (
                <div className="pl-6 pt-1 space-y-1">
                  <button
                    onClick={() => setActiveTab('pedidos_lista')}
                    className={`w-full text-left py-1.5 px-2 rounded-lg transition-colors cursor-pointer font-semibold ${
                      activeTab === 'pedidos_lista'
                        ? 'bg-[#00cbf4] text-white font-bold'
                        : 'text-gray-700 hover:text-[#00cbf4]'
                    }`}
                  >
                    Lista de pedidos
                  </button>
                  <button
                    onClick={() => setActiveTab('pedidos_pendiente')}
                    className={`w-full text-left py-1.5 px-2 rounded-lg transition-colors cursor-pointer font-semibold flex items-center justify-between ${
                      activeTab === 'pedidos_pendiente'
                        ? 'bg-[#00cbf4] text-white font-bold'
                        : 'text-gray-700 hover:text-[#00cbf4]'
                    }`}
                  >
                    <span>Estado pendiente</span>
                    <span className="text-[10px] bg-amber-400 text-gray-900 px-1.5 rounded-full font-extrabold">
                      {pendingOrders.length}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('pedidos_clientes')}
                    className={`w-full text-left py-1.5 px-2 rounded-lg transition-colors cursor-pointer font-semibold ${
                      activeTab === 'pedidos_clientes'
                        ? 'bg-[#00cbf4] text-white font-bold'
                        : 'text-gray-700 hover:text-[#00cbf4]'
                    }`}
                  >
                    Historial por cliente
                  </button>
                </div>
              )}
            </div>

            {/* PAGOS SECTION */}
            <div>
              <button
                onClick={() => toggleSection('pagos')}
                className="w-full flex items-center justify-between text-xs font-bold text-[#144b57] hover:text-[#008ba8] transition-colors py-1 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[#00cbf4]">💳</span>
                  <span>Pagos</span>
                </div>
                <span className="text-[10px]">{openSections.pagos ? '▲' : '▼'}</span>
              </button>
              {openSections.pagos && (
                <div className="pl-6 pt-1 space-y-1">
                  <button
                    onClick={() => setActiveTab('pagos_conciliacion')}
                    className={`w-full text-left py-1.5 px-2 rounded-lg transition-colors cursor-pointer font-semibold ${
                      activeTab === 'pagos_conciliacion'
                        ? 'bg-[#00cbf4] text-white font-bold'
                        : 'text-gray-700 hover:text-[#00cbf4]'
                    }`}
                  >
                    Conciliación de Transacciones
                  </button>
                  <button
                    onClick={() => setActiveTab('pagos_facturas')}
                    className={`w-full text-left py-1.5 px-2 rounded-lg transition-colors cursor-pointer font-semibold ${
                      activeTab === 'pagos_facturas'
                        ? 'bg-[#00cbf4] text-white font-bold'
                        : 'text-gray-700 hover:text-[#00cbf4]'
                    }`}
                  >
                    Facturas digitales
                  </button>
                </div>
              )}
            </div>

            {/* CONTENIDO SECTION */}
            <div>
              <button
                onClick={() => toggleSection('contenido')}
                className="w-full flex items-center justify-between text-xs font-bold text-[#144b57] hover:text-[#008ba8] transition-colors py-1 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[#00cbf4]">📁</span>
                  <span>Contenido</span>
                </div>
                <span className="text-[10px]">{openSections.contenido ? '▲' : '▼'}</span>
              </button>
              {openSections.contenido && (
                <div className="pl-6 pt-1 space-y-1">
                  <button
                    onClick={() => setActiveTab('contenido_landing')}
                    className={`w-full text-left py-1.5 px-2 rounded-lg transition-colors cursor-pointer font-semibold ${
                      activeTab === 'contenido_landing'
                        ? 'bg-[#00cbf4] text-white font-bold'
                        : 'text-gray-700 hover:text-[#00cbf4]'
                    }`}
                  >
                    Landing Page
                  </button>
                  <button
                    onClick={() => setActiveTab('contenido_catalogo')}
                    className={`w-full text-left py-1.5 px-2 rounded-lg transition-colors cursor-pointer font-semibold ${
                      activeTab === 'contenido_catalogo'
                        ? 'bg-[#00cbf4] text-white font-bold'
                        : 'text-gray-700 hover:text-[#00cbf4]'
                    }`}
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
                className="w-full flex items-center justify-between text-xs font-bold text-[#144b57] hover:text-[#008ba8] transition-colors py-1 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[#00cbf4]">📈</span>
                  <span>Reporte y Analítica</span>
                </div>
                <span className="text-[10px]">{openSections.analitica ? '▲' : '▼'}</span>
              </button>
              {openSections.analitica && (
                <div className="pl-6 pt-1 space-y-1">
                  <button
                    onClick={() => setActiveTab('analitica_ventas')}
                    className={`w-full text-left py-1.5 px-2 rounded-lg transition-colors cursor-pointer font-semibold ${
                      activeTab === 'analitica_ventas'
                        ? 'bg-[#00cbf4] text-white font-bold'
                        : 'text-gray-700 hover:text-[#00cbf4]'
                    }`}
                  >
                    Ventas por período
                  </button>
                  <button
                    onClick={() => setActiveTab('analitica_top_productos')}
                    className={`w-full text-left py-1.5 px-2 rounded-lg transition-colors cursor-pointer font-semibold ${
                      activeTab === 'analitica_top_productos'
                        ? 'bg-[#00cbf4] text-white font-bold'
                        : 'text-gray-700 hover:text-[#00cbf4]'
                    }`}
                  >
                    Productos más vendidos
                  </button>
                  <button
                    onClick={() => setActiveTab('analitica_conversion')}
                    className={`w-full text-left py-1.5 px-2 rounded-lg transition-colors cursor-pointer font-semibold ${
                      activeTab === 'analitica_conversion'
                        ? 'bg-[#00cbf4] text-white font-bold'
                        : 'text-gray-700 hover:text-[#00cbf4]'
                    }`}
                  >
                    Tasa de conversión
                  </button>
                  <button
                    onClick={() => setActiveTab('analitica_stock')}
                    className={`w-full text-left py-1.5 px-2 rounded-lg transition-colors cursor-pointer font-semibold ${
                      activeTab === 'analitica_stock'
                        ? 'bg-[#00cbf4] text-white font-bold'
                        : 'text-gray-700 hover:text-[#00cbf4]'
                    }`}
                  >
                    Inventario (Stock)
                  </button>
                </div>
              )}
            </div>
          </nav>
        </aside>

        {/* 3. MAIN EXPANDED CONTENT AREA */}
        <main className="flex-1 p-5 sm:p-7 overflow-y-auto space-y-6">
          {/* Breadcrumb & Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200/80 pb-4">
            <div>
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Panel Administrativo / <span className="text-[#00cbf4] font-black">{getTabTitle()}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                {getTabTitle().split(' / ').pop()}
              </h2>
            </div>

            {/* Header Actions depending on view */}
            <div className="flex items-center gap-2">
              {activeTab.includes('pedidos') && (
                <button
                  onClick={openNewOrder}
                  className="px-4 py-2 bg-[#00cbf4] hover:bg-[#00b5dc] text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>+</span>
                  <span>Nuevo Pedido</span>
                </button>
              )}
              {activeTab === 'contenido_catalogo' && (
                <button
                  onClick={openNewProduct}
                  className="px-4 py-2 bg-[#00cbf4] hover:bg-[#00b5dc] text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>+</span>
                  <span>Agregar Producto</span>
                </button>
              )}
              {activeTab === 'pagos_facturas' && (
                <button
                  onClick={() => {
                    setInvoiceForm({ orderId: '20016', client: '', idDoc: '', total: '', paymentMethod: 'Pago Móvil' });
                    setIsInvoiceModalOpen(true);
                  }}
                  className="px-4 py-2 bg-[#00cbf4] hover:bg-[#00b5dc] text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>+</span>
                  <span>Emitir Factura</span>
                </button>
              )}
            </div>
          </div>

          {/* =========================================================
              VIEW 1: DASHBOARD PRINCIPAL (OVERVIEW)
             ========================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* 5 KPI Cards */}
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200/80 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-black text-gray-800 tracking-wider">VENTAS TOTALES (MES)</span>
                    <span className="text-amber-500 text-xs">✨</span>
                  </div>
                  <div className="my-2"><span className="text-2xl sm:text-3xl font-black text-gray-900">$49.151</span></div>
                  <div className="w-full h-10 mt-1">
                    <svg className="w-full h-full text-[#00cbf4]" viewBox="0 0 100 25" preserveAspectRatio="none">
                      <path d="M0,18 C20,5 35,22 50,12 C65,2 80,18 100,8 L100,25 L0,25 Z" fill="currentColor" fillOpacity="0.15" />
                      <path d="M0,18 C20,5 35,22 50,12 C65,2 80,18 100,8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200/80 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-black text-gray-800 tracking-wider">TASA DE CONVERSIÓN</span>
                    <span className="text-amber-400 font-bold text-base">✦</span>
                  </div>
                  <div className="my-2"><span className="text-2xl sm:text-3xl font-black text-gray-900">46,7%</span></div>
                  <div className="text-[11px] font-semibold text-gray-500 flex items-center gap-1">
                    <span>Tasa de conversión:</span><span className="text-teal-600 font-bold">1,5%</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200/80 flex flex-col justify-between">
                  <span className="text-xs font-black text-gray-800 tracking-wider">PEDIDOS PENDIENTES (HOY)</span>
                  <div className="my-2"><span className="text-2xl sm:text-3xl font-black text-gray-900">{pendingOrders.length}</span></div>
                  <div className="flex items-center justify-between text-[11px] font-semibold text-gray-500">
                    <span>Total pedidos: {orders.length}</span>
                    <span className="text-cyan-600 font-bold">Prioridad Alta</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200/80 flex flex-col justify-between">
                  <span className="text-xs font-black text-gray-800 tracking-wider">REEMBOLSOS (MES)</span>
                  <div className="my-2"><span className="text-2xl sm:text-3xl font-black text-gray-900">10</span></div>
                  <div className="flex items-center justify-between text-[11px] font-semibold text-gray-500">
                    <span>Reembolsos mes: 10%</span>
                    <span className="text-emerald-600 font-bold">Bajo índice</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200/80 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-black text-gray-800 tracking-wider">TIEMPO PROMEDIO ENVÍO</span>
                    <span className="text-amber-500 text-sm">🚚</span>
                  </div>
                  <div className="my-2"><span className="text-2xl sm:text-3xl font-black text-gray-900">1 hmis</span></div>
                  <div className="flex items-center justify-between text-[11px] font-semibold text-gray-500">
                    <span>Tiempo promedio: 2 h</span>
                    <span className="text-teal-600 font-bold">Excelente</span>
                  </div>
                </div>
              </section>

              {/* Middle Overview Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Table Overview */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Orders Summary */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200/80">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h3 className="text-sm font-black text-gray-900 uppercase">Últimos Pedidos</h3>
                        <p className="text-xs text-gray-500">Haz clic en un pedido para ver el desglose o cambiar estado</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('pedidos_lista')}
                        className="text-xs font-bold text-[#00cbf4] hover:underline cursor-pointer"
                      >
                        Ver todos ({orders.length}) →
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-gray-200 text-gray-800 font-bold bg-gray-50/50">
                            <th className="py-2.5 px-3">ID</th>
                            <th className="py-2.5 px-3">Cliente</th>
                            <th className="py-2.5 px-3">Fecha</th>
                            <th className="py-2.5 px-3">Total</th>
                            <th className="py-2.5 px-3">Estado</th>
                            <th className="py-2.5 px-3 text-center">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-medium">
                          {orders.slice(0, 5).map((ord) => (
                            <tr key={ord.id} className="hover:bg-cyan-50/40 transition-colors">
                              <td className="py-2.5 px-3 font-bold text-gray-900">{ord.id}</td>
                              <td className="py-2.5 px-3 font-semibold text-gray-800">{ord.client}</td>
                              <td className="py-2.5 px-3 text-gray-600">{ord.date}</td>
                              <td className="py-2.5 px-3 font-bold text-gray-900">${ord.total.toFixed(2)}</td>
                              <td className="py-2.5 px-3">
                                <button
                                  onClick={() => handleStatusChange(ord.id, ord.status === 'Pendiente' ? 'Pagado' : 'Pendiente')}
                                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold cursor-pointer transition-transform hover:scale-105 ${
                                    ord.status === 'Pendiente'
                                      ? 'bg-[#00cbf4] text-white'
                                      : ord.status === 'Pagado'
                                      ? 'bg-[#eab308] text-white'
                                      : 'bg-emerald-500 text-white'
                                  }`}
                                >
                                  {ord.status}
                                </button>
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <button
                                  onClick={() => setSelectedOrderDetails(ord)}
                                  className="text-xs text-teal-700 hover:text-teal-900 font-bold cursor-pointer"
                                >
                                  👁️ Ver
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Transactions Summary */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200/80">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h3 className="text-sm font-black text-gray-900 uppercase">Conciliación de Pagos Recientes</h3>
                        <p className="text-xs text-gray-500">Comprobantes y transacciones registradas</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('pagos_conciliacion')}
                        className="text-xs font-bold text-[#00cbf4] hover:underline cursor-pointer"
                      >
                        Ver conciliaciones →
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-gray-200 text-gray-800 font-bold bg-gray-50/50">
                            <th className="py-2 px-3">ID</th>
                            <th className="py-2 px-3">Cliente</th>
                            <th className="py-2 px-3">Método</th>
                            <th className="py-2 px-3">Monto</th>
                            <th className="py-2 px-3 text-right">Estado</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-medium">
                          {transactions.slice(0, 4).map((t) => (
                            <tr key={t.id} className="hover:bg-cyan-50/40">
                              <td className="py-2 px-3 font-bold text-gray-900">{t.id}</td>
                              <td className="py-2 px-3 text-gray-800 font-semibold">{t.client}</td>
                              <td className="py-2 px-3 text-gray-600">{t.method}</td>
                              <td className="py-2 px-3 font-bold text-teal-700">${t.amount.toFixed(2)}</td>
                              <td className="py-2 px-3 text-right">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                  {t.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Right Analytics Overview */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Sales Curve Chart */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200/80">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-black text-gray-900 uppercase">Ventas por Período</h3>
                      <button
                        onClick={() => setActiveTab('analitica_ventas')}
                        className="text-[11px] font-bold text-[#00cbf4] hover:underline cursor-pointer"
                      >
                        Ver gráfico detallado →
                      </button>
                    </div>
                    <div className="relative h-36 w-full">
                      <svg className="w-full h-full" viewBox="0 0 350 140" preserveAspectRatio="none">
                        <path
                          d="M 10,130 C 40,70 60,65 90,80 C 120,95 150,30 180,25 C 210,20 240,65 270,75 C 300,85 320,35 340,30 L 340,140 L 10,140 Z"
                          fill="#00cbf4"
                          fillOpacity="0.18"
                        />
                        <path
                          d="M 10,130 C 40,70 60,65 90,80 C 120,95 150,30 180,25 C 210,20 240,65 270,75 C 300,85 320,35 340,30"
                          fill="none"
                          stroke="#00cbf4"
                          strokeWidth="3"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Stock Mini Overview */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200/80">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-black text-gray-900 uppercase">Stock & Alertas de Inventario</h3>
                      <button
                        onClick={() => setActiveTab('analitica_stock')}
                        className="text-[11px] font-bold text-[#00cbf4] hover:underline cursor-pointer"
                      >
                        Control de Stock →
                      </button>
                    </div>
                    <div className="space-y-2 text-xs">
                      {stockList.slice(0, 4).map((stk, i) => (
                        <div key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded-xl">
                          <span className="font-bold text-gray-800 truncate max-w-[170px]">{stk.product}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-gray-900">{stk.quantity} un.</span>
                            <span className="text-base">{stk.alertType === 'danger' ? '🔴' : stk.alertType === 'warning' ? '🟡' : '🟢'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              VIEW 2: PEDIDOS -> LISTA DE PEDIDOS (FULL CRUD)
             ========================================================= */}
          {activeTab === 'pedidos_lista' && (
            <div className="space-y-5">
              {/* Order Stats Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200/80">
                  <p className="text-xs text-gray-500 font-bold">Total Pedidos</p>
                  <p className="text-2xl font-black text-gray-900 mt-1">{orders.length}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200/80">
                  <p className="text-xs text-gray-500 font-bold">Total Facturado</p>
                  <p className="text-2xl font-black text-teal-600 mt-1">
                    ${orders.reduce((acc, o) => acc + o.total, 0).toFixed(2)}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200/80">
                  <p className="text-xs text-gray-500 font-bold">Pedidos Pendientes</p>
                  <p className="text-2xl font-black text-amber-500 mt-1">
                    {orders.filter((o) => o.status === 'Pendiente').length}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200/80">
                  <p className="text-xs text-gray-500 font-bold">Pedidos Pagados</p>
                  <p className="text-2xl font-black text-emerald-600 mt-1">
                    {orders.filter((o) => o.status === 'Pagado').length}
                  </p>
                </div>
              </div>

              {/* Filters Toolbar */}
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex-1 w-full flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 text-sm">🔍</span>
                    <input
                      type="text"
                      placeholder="Buscar por ID de pedido o nombre de cliente..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:border-[#00cbf4]"
                    />
                  </div>
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="py-2 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none focus:border-[#00cbf4]"
                  >
                    <option value="Todos">Todos los Estados</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="En Preparación">En Preparación</option>
                    <option value="Pagado">Pagado</option>
                    <option value="Enviado">Enviado</option>
                  </select>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={openNewOrder}
                    className="flex-1 sm:flex-none px-4 py-2 bg-[#00cbf4] hover:bg-[#00b5dc] text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-all"
                  >
                    + Nuevo Pedido
                  </button>
                </div>
              </div>

              {/* Full Desktop Orders Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-800 font-extrabold bg-gray-50/80">
                        <th className="py-3 px-4">ID Pedido</th>
                        <th className="py-3 px-4">Cliente & Contacto</th>
                        <th className="py-3 px-4">Fecha</th>
                        <th className="py-3 px-4">Artículos</th>
                        <th className="py-3 px-4">Total ($)</th>
                        <th className="py-3 px-4">Método de Pago</th>
                        <th className="py-3 px-4">Estado</th>
                        <th className="py-3 px-4 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="text-center py-10 text-gray-400 font-semibold">
                            No se encontraron pedidos con los criterios especificados.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-cyan-50/30 transition-colors">
                            <td className="py-3.5 px-4 font-black text-gray-900">#{ord.id}</td>
                            <td className="py-3.5 px-4">
                              <p className="font-bold text-gray-900">{ord.client}</p>
                              <p className="text-[10px] text-gray-500">{ord.email || ord.phone}</p>
                            </td>
                            <td className="py-3.5 px-4 text-gray-600 font-semibold">{ord.date}</td>
                            <td className="py-3.5 px-4 text-gray-700">{ord.items} un.</td>
                            <td className="py-3.5 px-4 font-black text-teal-700 text-sm">
                              ${ord.total.toFixed(2)}
                            </td>
                            <td className="py-3.5 px-4 text-gray-600 font-semibold">{ord.paymentMethod || 'Pago Móvil'}</td>
                            <td className="py-3.5 px-4">
                              <select
                                value={ord.status}
                                onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                                className={`text-[11px] font-black rounded-lg px-2.5 py-1 outline-none border cursor-pointer ${
                                  ord.status === 'Pendiente'
                                    ? 'bg-cyan-100 text-cyan-900 border-cyan-300'
                                    : ord.status === 'Pagado'
                                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                                    : ord.status === 'En Preparación'
                                    ? 'bg-purple-100 text-purple-900 border-purple-300'
                                    : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                }`}
                              >
                                <option value="Pendiente">Pendiente</option>
                                <option value="En Preparación">En Preparación</option>
                                <option value="Pagado">Pagado</option>
                                <option value="Enviado">Enviado</option>
                              </select>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => setSelectedOrderDetails(ord)}
                                  className="p-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 rounded-lg font-bold text-xs cursor-pointer"
                                  title="Ver detalles completos"
                                >
                                  👁️
                                </button>
                                <button
                                  onClick={() => openEditOrder(ord)}
                                  className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg font-bold text-xs cursor-pointer"
                                  title="Editar pedido"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() => handleDeleteOrder(ord.id)}
                                  className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-bold text-xs cursor-pointer"
                                  title="Eliminar pedido"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xs font-semibold text-gray-500">
                  <span>Mostrando {filteredOrders.length} de {orders.length} pedidos</span>
                  <div className="flex gap-1">
                    <button className="px-2.5 py-1 bg-white border border-gray-200 rounded-lg cursor-pointer">Anterior</button>
                    <button className="px-2.5 py-1 bg-[#00cbf4] text-white rounded-lg font-bold cursor-pointer">1</button>
                    <button className="px-2.5 py-1 bg-white border border-gray-200 rounded-lg cursor-pointer">Siguiente</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              VIEW 3: PEDIDOS -> ESTADO PENDIENTE (PRIORITY WORKFLOW)
             ========================================================= */}
          {activeTab === 'pedidos_pendiente' && (
            <div className="space-y-5">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">⚠️</span>
                  <div>
                    <h3 className="text-base font-black text-amber-900">
                      Pedidos Pendientes de Confirmación o Preparación ({pendingOrders.length})
                    </h3>
                    <p className="text-xs text-amber-700">
                      Gestiona la validación de pagos y envía actualizaciones a los clientes.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    pendingOrders.forEach((o) => handleStatusChange(o.id, 'Pagado'));
                    showToast('Todos los pedidos pendientes marcados como Pagados');
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-colors shrink-0"
                >
                  ✓ Validar Todos como Pagados
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200/80 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-xs font-bold text-gray-400">PEDIDO</span>
                          <h4 className="text-lg font-black text-gray-900">#{ord.id}</h4>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-cyan-100 text-cyan-900">
                          {ord.status}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-gray-600 font-medium py-3 border-y border-gray-100 my-3">
                        <p><b className="text-gray-900">Cliente:</b> {ord.client}</p>
                        <p><b className="text-gray-900">Teléfono:</b> {ord.phone}</p>
                        <p><b className="text-gray-900">Dirección:</b> {ord.deliveryAddress}</p>
                        <p><b className="text-gray-900">Método de Pago:</b> {ord.paymentMethod}</p>
                        <p><b className="text-gray-900">Total a pagar:</b> <span className="text-teal-600 font-black text-sm">${ord.total.toFixed(2)}</span></p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <button
                        onClick={() => handleStatusChange(ord.id, 'Pagado')}
                        className="py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                      >
                        ✓ Pagado
                      </button>
                      <button
                        onClick={() => handleStatusChange(ord.id, 'En Preparación')}
                        className="py-2 bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                      >
                        📦 Preparar
                      </button>
                      <button
                        onClick={() => {
                          const msg = encodeURIComponent(`Hola ${ord.client}, te escribimos de Tu Cajita sobre tu pedido #${ord.id}.`);
                          window.open(`https://wa.me/${ord.phone?.replace(/[^0-9]/g, '') || '584120177993'}?text=${msg}`, '_blank');
                        }}
                        className="py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1"
                      >
                        <span>💬</span>
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================
              VIEW 4: PEDIDOS -> HISTORIAL POR CLIENTE
             ========================================================= */}
          {activeTab === 'pedidos_clientes' && (
            <div className="space-y-5">
              {/* Search & Header */}
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200/80 flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="relative flex-1 w-full">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 text-sm">🔍</span>
                  <input
                    type="text"
                    placeholder="Buscar cliente por nombre o correo..."
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:border-[#00cbf4]"
                  />
                </div>
                <span className="text-xs font-bold text-gray-500">
                  Total Clientes: {uniqueClients.length}
                </span>
              </div>

              {/* Client Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredClients.map((client, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200/80 flex flex-col justify-between hover:shadow-md transition-shadow"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-[#00cbf4]/20 text-[#00cbf4] flex items-center justify-center font-black text-lg border border-[#00cbf4]/40">
                          {client.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-gray-900 text-sm">{client.name}</h4>
                          <p className="text-[11px] text-gray-500 font-medium">{client.email}</p>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs text-gray-600 bg-gray-50 p-3 rounded-xl mb-3">
                        <div className="flex justify-between">
                          <span>Pedidos realizados:</span>
                          <b className="text-gray-900">{client.totalOrders}</b>
                        </div>
                        <div className="flex justify-between">
                          <span>Total invertido:</span>
                          <b className="text-teal-700">${client.totalSpent.toFixed(2)}</b>
                        </div>
                        <div className="flex justify-between">
                          <span>Última compra:</span>
                          <b className="text-gray-700">{client.lastOrderDate}</b>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedClientDetails(client)}
                      className="w-full py-2 bg-[#00cbf4] hover:bg-[#00b5dc] text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                    >
                      Ver Historial Completo ({client.ordersList.length} pedidos)
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================
              VIEW 5: PAGOS -> CONCILIACIÓN DE TRANSACCIONES
             ========================================================= */}
          {activeTab === 'pagos_conciliacion' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200/80">
                  <p className="text-xs text-gray-500 font-bold">Total Conciliado</p>
                  <p className="text-2xl font-black text-emerald-600 mt-1">
                    ${transactions.filter((t) => t.status === 'Conciliado').reduce((a, b) => a + b.amount, 0).toFixed(2)}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200/80">
                  <p className="text-xs text-gray-500 font-bold">Pendiente de Conciliación</p>
                  <p className="text-2xl font-black text-amber-500 mt-1">
                    ${transactions.filter((t) => t.status !== 'Conciliado').reduce((a, b) => a + b.amount, 0).toFixed(2)}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200/80">
                  <p className="text-xs text-gray-500 font-bold">Método Principal</p>
                  <p className="text-2xl font-black text-gray-900 mt-1">Pago Móvil (72%)</p>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3">
                  <input
                    type="text"
                    placeholder="Buscar por referencia, ID o cliente..."
                    value={transactionSearch}
                    onChange={(e) => setTransactionSearch(e.target.value)}
                    className="w-full sm:w-80 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:border-[#00cbf4]"
                  />
                  <select
                    value={transactionStatusFilter}
                    onChange={(e) => setTransactionStatusFilter(e.target.value)}
                    className="py-2 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none"
                  >
                    <option value="Todos">Todos los Estados</option>
                    <option value="Conciliado">Conciliado</option>
                    <option value="Pendiente de Conciliación">Pendiente de Conciliación</option>
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-800 font-extrabold bg-gray-50/80">
                        <th className="py-3 px-4">ID Transacción</th>
                        <th className="py-3 px-4">Fecha</th>
                        <th className="py-3 px-4">Cliente</th>
                        <th className="py-3 px-4">Referencia Bancaria</th>
                        <th className="py-3 px-4">Método & Banco</th>
                        <th className="py-3 px-4">Monto ($)</th>
                        <th className="py-3 px-4">Estado</th>
                        <th className="py-3 px-4 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {filteredTransactions.map((t) => (
                        <tr key={t.id} className="hover:bg-cyan-50/30">
                          <td className="py-3 px-4 font-black text-gray-900">#{t.id}</td>
                          <td className="py-3 px-4 text-gray-600 font-semibold">{t.date}</td>
                          <td className="py-3 px-4 font-bold text-gray-800">{t.client}</td>
                          <td className="py-3 px-4 font-mono text-cyan-800 font-bold">{t.reference}</td>
                          <td className="py-3 px-4 text-gray-700">{t.method}</td>
                          <td className="py-3 px-4 font-black text-teal-700">${t.amount.toFixed(2)}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                                t.status === 'Conciliado'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-900'
                              }`}
                            >
                              {t.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {t.status !== 'Conciliado' && (
                                <button
                                  onClick={() => {
                                    setTransactions((prev) =>
                                      prev.map((item) => (item.id === t.id ? { ...item, status: 'Conciliado' } : item))
                                    );
                                    showToast(`Transacción #${t.id} conciliada exitosamente`);
                                  }}
                                  className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-xs cursor-pointer"
                                >
                                  ✓ Conciliar
                                </button>
                              )}
                              <button
                                onClick={() => alert(`Comprobante bancario: ${t.reference} - Banco: ${t.bank || 'Banesco'}`)}
                                className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-bold cursor-pointer"
                                title="Ver comprobante"
                              >
                                📄
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              VIEW 6: PAGOS -> FACTURAS DIGITALES
             ========================================================= */}
          {activeTab === 'pagos_facturas' && (
            <div className="space-y-5">
              {/* Invoices Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-sm font-black text-gray-900 uppercase">Facturas Digitales Emitidas</h3>
                  <button
                    onClick={() => {
                      setInvoiceForm({ orderId: '20016', client: '', idDoc: '', total: '', paymentMethod: 'Pago Móvil' });
                      setIsInvoiceModalOpen(true);
                    }}
                    className="px-4 py-2 bg-[#00cbf4] hover:bg-[#00b5dc] text-white font-bold text-xs rounded-xl shadow cursor-pointer"
                  >
                    + Nueva Factura
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-800 font-extrabold bg-gray-50/80">
                        <th className="py-3 px-4">N° Factura</th>
                        <th className="py-3 px-4">Pedido Asociado</th>
                        <th className="py-3 px-4">Cliente</th>
                        <th className="py-3 px-4">C.I. / RIF</th>
                        <th className="py-3 px-4">Fecha</th>
                        <th className="py-3 px-4">Subtotal</th>
                        <th className="py-3 px-4">IVA (16%)</th>
                        <th className="py-3 px-4">Total ($)</th>
                        <th className="py-3 px-4 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {invoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-cyan-50/30">
                          <td className="py-3 px-4 font-mono font-black text-teal-800">{inv.id}</td>
                          <td className="py-3 px-4 font-bold text-gray-700">#{inv.orderId}</td>
                          <td className="py-3 px-4 font-bold text-gray-900">{inv.client}</td>
                          <td className="py-3 px-4 font-mono text-gray-600">{inv.idDoc}</td>
                          <td className="py-3 px-4 text-gray-600">{inv.date}</td>
                          <td className="py-3 px-4 text-gray-600">${inv.subtotal.toFixed(2)}</td>
                          <td className="py-3 px-4 text-gray-600">${inv.tax.toFixed(2)}</td>
                          <td className="py-3 px-4 font-black text-teal-700">${inv.total.toFixed(2)}</td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => setSelectedInvoiceView(inv)}
                                className="px-2.5 py-1 bg-[#00cbf4] hover:bg-[#00b5dc] text-white rounded-lg font-bold text-xs cursor-pointer flex items-center gap-1"
                              >
                                <span>📄</span>
                                <span>Ver</span>
                              </button>
                              <button
                                onClick={() => handleDeleteInvoice(inv.id)}
                                className="p-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-bold text-xs cursor-pointer"
                                title="Anular factura"
                              >
                                ✕
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              VIEW 7: CONTENIDO -> CONFIGURACIÓN LANDING PAGE
             ========================================================= */}
          {activeTab === 'contenido_landing' && (
            <div className="max-w-4xl bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200/80 space-y-6">
              <div>
                <h3 className="text-lg font-black text-gray-900">Configuración de la Página de Inicio</h3>
                <p className="text-xs text-gray-500">Personaliza los títulos, mensajes promocionales y enlaces de contacto de tu tienda.</p>
              </div>

              <div className="space-y-4 text-xs font-bold text-gray-700">
                <div>
                  <label className="block mb-1 text-gray-800">Título Principal (Hero Headline)</label>
                  <input
                    type="text"
                    value={landingConfig.heroTitle}
                    onChange={(e) => setLandingConfig({ ...landingConfig, heroTitle: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:border-[#00cbf4]"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-gray-800">Subtítulo Descriptivo</label>
                  <textarea
                    rows="3"
                    value={landingConfig.heroSubtitle}
                    onChange={(e) => setLandingConfig({ ...landingConfig, heroSubtitle: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-[#00cbf4]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-gray-800">Número de WhatsApp de Ventas</label>
                    <input
                      type="text"
                      value={landingConfig.whatsappNumber}
                      onChange={(e) => setLandingConfig({ ...landingConfig, whatsappNumber: e.target.value })}
                      placeholder="584120177993"
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:border-[#00cbf4]"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-gray-800">Barra de Anuncio / Promociones</label>
                    <input
                      type="text"
                      value={landingConfig.announcementText}
                      onChange={(e) => setLandingConfig({ ...landingConfig, announcementText: e.target.value })}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:border-[#00cbf4]"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    onClick={() => showToast('¡Cambios guardados en la Landing Page con éxito!')}
                    className="px-6 py-3 bg-[#00cbf4] hover:bg-[#00b5dc] text-white font-bold text-sm rounded-xl shadow transition-all cursor-pointer"
                  >
                    Guardar Cambios
                  </button>
                  <button
                    onClick={() => setCurrentView('home')}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-xl transition-all cursor-pointer"
                  >
                    Vista Previa en Tienda ↗
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              VIEW 8: CONTENIDO -> GESTIÓN DE CATÁLOGO & PRECIOS (FULL CRUD)
             ========================================================= */}
          {activeTab === 'contenido_catalogo' && (
            <div className="space-y-5">
              {/* Filter Toolbar */}
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200/80 flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="flex-1 w-full flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 text-sm">🔍</span>
                    <input
                      type="text"
                      placeholder="Buscar producto por nombre o referencia (SKU)..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:border-[#00cbf4]"
                    />
                  </div>
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="py-2 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none"
                  >
                    <option value="Todos">Todas las Categorías</option>
                    <option value="especial">Diseño especial / Empaques de Lujo</option>
                    <option value="microcorrugados">Microcorrugados</option>
                    <option value="unicolor">Unicolor</option>
                    <option value="portavasos">Portavasos</option>
                  </select>
                </div>

                <button
                  onClick={openNewProduct}
                  className="px-5 py-2.5 bg-[#00cbf4] hover:bg-[#00b5dc] text-white font-bold text-xs rounded-xl shadow cursor-pointer"
                >
                  + Publicar Nuevo Producto
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-800 font-extrabold bg-gray-50/80">
                        <th className="py-3 px-4">Foto</th>
                        <th className="py-3 px-4">REF / SKU</th>
                        <th className="py-3 px-4">Producto & Descripción</th>
                        <th className="py-3 px-4">Tipo & Categoría</th>
                        <th className="py-3 px-4">Ubicación Catálogo</th>
                        <th className="py-3 px-4">Stock</th>
                        <th className="py-3 px-4">Precio ($)</th>
                        <th className="py-3 px-4 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {filteredProducts.map((prod) => (
                        <tr key={prod.id} className="hover:bg-cyan-50/30 transition-colors">
                          <td className="py-3 px-4">
                            <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden border border-gray-200 flex items-center justify-center relative shadow-sm">
                              {prod.image ? (
                                <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-2xl">📦</span>
                              )}
                              {prod.image?.startsWith('data:image') && (
                                <span className="absolute bottom-0 right-0 bg-blue-600 text-white text-[8px] font-black px-1 rounded-tl" title="Subida desde PC">
                                  PC
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-gray-800">{prod.ref || `TC-${prod.id}`}</td>
                          <td className="py-3 px-4">
                            <p className="font-bold text-gray-900 text-sm">{prod.name}</p>
                            <p className="text-[11px] text-gray-500 line-clamp-1">{prod.description || 'Sin descripción'}</p>
                            <span className="text-[10px] text-gray-400 font-semibold">{prod.medidas || '20x20x10 cm'}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-col gap-1">
                              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-50 text-cyan-900 border border-cyan-200 w-fit">
                                {prod.type === 'arreglos' ? '💐 Arreglos' : prod.type === 'eventos' ? '🎉 Eventos' : '📦 Cajas'}
                              </span>
                              <span className="text-[10px] text-gray-500 font-medium">
                                {prod.categoryName || prod.category}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1">
                              {prod.featured && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                                  🌟 Destacado
                                </span>
                              )}
                              {prod.forYou && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-200">
                                  ✨ Para ti
                                </span>
                              )}
                              {!prod.featured && !prod.forYou && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600">
                                  Solo Catálogo
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`font-extrabold ${prod.stock <= 10 ? 'text-red-600' : 'text-gray-900'}`}>
                              {prod.stock} un.
                            </span>
                          </td>
                          <td className="py-3 px-4 font-black text-teal-700 text-sm">
                            ${Number(prod.price).toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => openEditProduct(prod)}
                                className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg font-bold text-xs cursor-pointer"
                                title="Editar producto, foto y precio"
                              >
                                ✏️ Editar
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id, prod.name)}
                                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-bold text-xs cursor-pointer"
                                title="Eliminar del catálogo"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              VIEW 9: REPORTE Y ANALÍTICA -> VENTAS POR PERÍODO
             ========================================================= */}
          {activeTab === 'analitica_ventas' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200/80 space-y-5">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div>
                    <h3 className="text-lg font-black text-gray-900">Evolución de Ingresos y Ventas</h3>
                    <p className="text-xs text-gray-500 font-medium">Visualización de ingresos facturados por días, meses y años.</p>
                  </div>
                  <div className="flex gap-2">
                    {['Día', 'Semana', 'Mes', 'Año'].map((p) => (
                      <button
                        key={p}
                        onClick={() => setChartPeriod(p)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          chartPeriod === p
                            ? 'bg-[#00cbf4] text-white shadow-sm'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Big Interactive SVG Area Chart */}
                <div className="relative h-64 w-full pt-4">
                  <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-gray-400 font-bold pointer-events-none pb-6">
                    <div className="border-b border-gray-100 flex justify-between"><span>$10.000</span></div>
                    <div className="border-b border-gray-100 flex justify-between"><span>$8.000</span></div>
                    <div className="border-b border-gray-100 flex justify-between"><span>$6.000</span></div>
                    <div className="border-b border-gray-100 flex justify-between"><span>$4.000</span></div>
                    <div className="border-b border-gray-100 flex justify-between"><span>$2.000</span></div>
                    <div className="border-b border-gray-100 flex justify-between"><span>$0</span></div>
                  </div>

                  <svg className="w-full h-52 relative z-10" viewBox="0 0 700 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00cbf4" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#00cbf4" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 20,180 C 80,100 140,90 200,110 C 260,130 320,40 380,35 C 440,30 500,90 560,100 C 620,110 650,50 680,40 L 680,200 L 20,200 Z"
                      fill="url(#salesGrad)"
                    />
                    <path
                      d="M 20,180 C 80,100 140,90 200,110 C 260,130 320,40 380,35 C 440,30 500,90 560,100 C 620,110 650,50 680,40"
                      fill="none"
                      stroke="#00cbf4"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <circle cx="20" cy="180" r="5" fill="#00cbf4" />
                    <circle cx="200" cy="110" r="5" fill="#00cbf4" />
                    <circle cx="380" cy="35" r="7" fill="#00cbf4" stroke="#fff" strokeWidth="3" />
                    <circle cx="560" cy="100" r="5" fill="#00cbf4" />
                    <circle cx="680" cy="40" r="5" fill="#00cbf4" />
                  </svg>

                  <div className="flex justify-between text-xs text-gray-500 font-extrabold pt-2 px-3">
                    <span>Enero</span>
                    <span>Febrero</span>
                    <span>Marzo</span>
                    <span>Abril</span>
                    <span>Mayo</span>
                    <span>Junio</span>
                    <span>Julio</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              VIEW 10: REPORTE Y ANALÍTICA -> PRODUCTOS MÁS VENDIDOS
             ========================================================= */}
          {activeTab === 'analitica_top_productos' && (
            <div className="space-y-5">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200/80">
                <h3 className="text-lg font-black text-gray-900 mb-4">Ranking de los 10 Productos Más Vendidos</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Caja Happy Day Corazón', count: 90, revenue: 8099.10, pct: 90 },
                    { name: 'Caja Casita Ventana Transparente', count: 77, revenue: 6929.23, pct: 77 },
                    { name: 'Caja de Lujo Premium Gold', count: 60, revenue: 5399.40, pct: 60 },
                    { name: 'Portavasos Múltiple Ecológico', count: 60, revenue: 5399.40, pct: 60 },
                    { name: 'Caja Unicolor Negra Elegante', count: 50, revenue: 4499.50, pct: 50 },
                    { name: 'Caja Mini Sorpresa Cumpleaños', count: 40, revenue: 3599.60, pct: 40 },
                    { name: 'Caja Pequeños Detalles', count: 40, revenue: 3599.60, pct: 40 },
                    { name: 'Caja Amor Happy Day Pink', count: 25, revenue: 2249.75, pct: 25 },
                    { name: 'Caja Casita Jardín', count: 25, revenue: 2249.75, pct: 25 },
                    { name: 'Caja Regalo Lujo Especial', count: 12, revenue: 1079.88, pct: 12 },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="flex items-center gap-3 w-full sm:w-80">
                        <span className="w-7 h-7 rounded-full bg-[#144b57] text-white flex items-center justify-center font-black text-xs shrink-0">
                          #{idx + 1}
                        </span>
                        <span className="font-bold text-gray-900 text-sm truncate">{item.name}</span>
                      </div>
                      <div className="flex-1 w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div
                          className="bg-[#00cbf4] h-full rounded-full transition-all duration-700"
                          style={{ width: `${(item.count / 90) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-bold text-right shrink-0">
                        <span className="text-gray-700">{item.count} ventas</span>
                        <span className="text-teal-700 font-extrabold">${item.revenue.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              VIEW 11: REPORTE Y ANALÍTICA -> TASA DE CONVERSIÓN
             ========================================================= */}
          {activeTab === 'analitica_conversion' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200/80 space-y-5">
                <h3 className="text-lg font-black text-gray-900">Embudo de Conversión de la Tienda</h3>
                <div className="space-y-4">
                  {[
                    { stage: '1. Visitantes Únicos en Web', count: 15420, pct: 100, color: 'bg-cyan-500' },
                    { stage: '2. Visitas a Catálogo de Cajas', count: 10485, pct: 68, color: 'bg-teal-500' },
                    { stage: '3. Consultas Directas / WhatsApp', count: 8018, pct: 52, color: 'bg-emerald-500' },
                    { stage: '4. Pedidos Completados y Pagados', count: 7200, pct: 46.7, color: 'bg-amber-500' },
                  ].map((step, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-2xl space-y-2">
                      <div className="flex justify-between text-xs font-extrabold text-gray-800">
                        <span>{step.stage}</span>
                        <span>{step.count.toLocaleString()} ({step.pct}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
                        <div className={`${step.color} h-full rounded-full transition-all duration-700`} style={{ width: `${step.pct}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200/80 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-black text-gray-900 mb-3">Tasa Actual: 46,7%</h4>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed">
                    Tu tienda tiene un rendimiento de conversión superior al promedio del sector (+1,5% respecto al mes anterior).
                  </p>
                </div>
                <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-2xl text-xs text-cyan-900 font-semibold mt-4">
                  💡 <b>Consejo:</b> Las cajas con fotos nítidas y medidas claras obtienen un 35% más de pedidos directos por WhatsApp.
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              VIEW 12: REPORTE Y ANALÍTICA -> INVENTARIO (STOCK & ALERTAS)
             ========================================================= */}
          {activeTab === 'analitica_stock' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200/80">
                  <p className="text-xs text-gray-500 font-bold">Total Artículos en Almacén</p>
                  <p className="text-2xl font-black text-gray-900 mt-1">
                    {stockList.reduce((a, b) => a + b.quantity, 0)} unidades
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200/80">
                  <p className="text-xs text-gray-500 font-bold">Alertas de Stock Crítico</p>
                  <p className="text-2xl font-black text-red-600 mt-1">
                    {stockList.filter((s) => s.alertType === 'danger').length} productos
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200/80">
                  <p className="text-xs text-gray-500 font-bold">Stock Óptimo</p>
                  <p className="text-2xl font-black text-emerald-600 mt-1">
                    {stockList.filter((s) => s.alertType === 'normal').length} productos
                  </p>
                </div>
              </div>

              {/* Interactive Stock Table with Instant +/- */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-sm font-black text-gray-900 uppercase">Control de Stock y Ajustes Rápidos</h3>
                  <span className="text-xs text-gray-500 font-semibold">Usa los botones + / - para actualizar en vivo</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-800 font-extrabold bg-gray-50/80">
                        <th className="py-3 px-4">SKU</th>
                        <th className="py-3 px-4">Producto</th>
                        <th className="py-3 px-4">Categoría</th>
                        <th className="py-3 px-4">Ubicación</th>
                        <th className="py-3 px-4">Stock Mínimo</th>
                        <th className="py-3 px-4">Cantidad Actual</th>
                        <th className="py-3 px-4 text-center">Ajustar Unidades</th>
                        <th className="py-3 px-4 text-right">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {stockList.map((stk) => (
                        <tr key={stk.sku} className="hover:bg-cyan-50/30">
                          <td className="py-3 px-4 font-mono font-bold text-gray-800">{stk.sku}</td>
                          <td className="py-3 px-4 font-bold text-gray-900">{stk.product}</td>
                          <td className="py-3 px-4 text-gray-600">{stk.category}</td>
                          <td className="py-3 px-4 text-gray-500 font-semibold">{stk.location || 'Almacén Central'}</td>
                          <td className="py-3 px-4 font-bold text-gray-700">{stk.minStock || 15} un.</td>
                          <td className="py-3 px-4 font-black text-gray-900 text-sm">
                            {stk.quantity} un.
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="inline-flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl">
                              <button
                                onClick={() => adjustStock(stk.sku, -5)}
                                className="w-7 h-7 rounded-lg bg-white shadow-sm hover:bg-red-50 text-red-600 font-black cursor-pointer"
                                title="Restar 5"
                              >
                                -5
                              </button>
                              <button
                                onClick={() => adjustStock(stk.sku, -1)}
                                className="w-7 h-7 rounded-lg bg-white shadow-sm hover:bg-red-50 text-red-600 font-black cursor-pointer"
                                title="Restar 1"
                              >
                                -1
                              </button>
                              <button
                                onClick={() => adjustStock(stk.sku, 1)}
                                className="w-7 h-7 rounded-lg bg-white shadow-sm hover:bg-emerald-50 text-emerald-600 font-black cursor-pointer"
                                title="Sumar 1"
                              >
                                +1
                              </button>
                              <button
                                onClick={() => adjustStock(stk.sku, 10)}
                                className="w-7 h-7 rounded-lg bg-white shadow-sm hover:bg-emerald-50 text-emerald-600 font-black cursor-pointer"
                                title="Sumar 10"
                              >
                                +10
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span
                              className={`px-3 py-1 rounded-full text-[10px] font-extrabold ${
                                stk.alertType === 'danger'
                                  ? 'bg-red-100 text-red-800'
                                  : stk.alertType === 'warning'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {stk.alertType === 'danger' ? '🔴 Crítico' : stk.alertType === 'warning' ? '🟡 Reordenar' : '🟢 Óptimo'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* =========================================================
          MODALS SECTION: PRODUCT, ORDER, INVOICE, CLIENT DETAIL
         ========================================================= */}

      {/* MODAL 1: PRODUCT ADD / EDIT (DISEÑO MODERNO CON MULTI-FOTOS Y VARIANTES) */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl relative max-h-[92vh] overflow-y-auto animate-[fadeIn_0.2s_ease] border border-gray-100 flex flex-col my-auto">
            
            {/* Header estilo Barra Superior Cyan */}
            <div className="bg-[#00c2ff] text-white px-5 py-4 flex items-center justify-between rounded-t-3xl sticky top-0 z-20 shadow-sm">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="text-white hover:bg-white/20 p-1.5 rounded-full transition-colors font-black text-lg cursor-pointer"
                  title="Volver"
                >
                  ←
                </button>
                <h3 className="text-lg font-black tracking-tight" style={{ fontFamily: "'Fredoka One', cursive" }}>
                  {editingProduct ? 'Editar Producto' : 'Productos'}
                </h3>
              </div>
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-bold">
                {editingProduct ? 'Modo Edición' : 'Nuevo'}
              </span>
            </div>

            <form onSubmit={handleSaveProduct} className="p-5 space-y-5 text-xs font-bold text-gray-700 flex-1">
              
              {/* ═══ 1. SECCIÓN SUPERIOR: VISOR DE FOTOS + GALERÍA MULTI-FOTOS ═══ */}
              <div className="bg-[#f8fafc] rounded-3xl p-4 border border-gray-200/80 relative space-y-3">
                <div className="flex items-center justify-between text-gray-500 text-[11px]">
                  <span className="font-extrabold text-gray-700">📸 Fotos del Producto (Portada + Ángulos)</span>
                  <span className="font-semibold text-gray-400">Hasta 5 fotos</span>
                </div>

                {/* Visor Principal / Portada */}
                <div className="relative bg-white rounded-2xl h-52 sm:h-56 flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden group">
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Portada" className="max-h-full max-w-full object-contain drop-shadow" />
                      <div className="absolute top-2 right-2 flex gap-1.5 z-10">
                        <label className="px-2.5 py-1 bg-white/90 hover:bg-white text-gray-800 text-[10px] font-black rounded-lg shadow cursor-pointer transition-all">
                          🔄 Cambiar
                          <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
                        </label>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="px-2.5 py-1 bg-red-500 hover:bg-red-600 text-white text-[10px] font-black rounded-lg shadow cursor-pointer transition-all"
                        >
                          ✕
                        </button>
                      </div>
                    </>
                  ) : (
                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-cyan-50/50 transition-colors">
                      <span className="text-4xl text-gray-300 mb-1 font-light group-hover:scale-110 transition-transform">+</span>
                      <span className="text-xs font-black text-gray-700">Subir Foto Principal (Portada)</span>
                      <span className="text-[10px] text-gray-400 font-normal mt-0.5">JPG, PNG, WEBP</span>
                      <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
                    </label>
                  )}
                </div>

                {/* Miniaturas de Fotos Secundarias (Ángulos / Variantes) */}
                <div>
                  <label className="block text-[11px] font-extrabold text-gray-700 mb-1.5">
                    Fotos Secundarias (Miniaturas en la vista de producto)
                  </label>
                  <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                    {galleryPreviews.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-xl bg-white border border-gray-300 p-1 flex-shrink-0 flex items-center justify-center group shadow-sm">
                        <img src={img} alt={`Ángulo ${idx + 1}`} className="w-full h-full object-contain" />
                        <button
                          type="button"
                          onClick={() => handleRemoveSecondaryImage(idx)}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center font-black shadow cursor-pointer hover:scale-110 transition-transform"
                          title="Eliminar foto"
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    {galleryPreviews.length < 4 && (
                      <label className="w-16 h-16 rounded-xl border-2 border-dashed border-[#00c2ff]/60 hover:border-[#00c2ff] bg-cyan-50/50 hover:bg-cyan-50 text-[#00c2ff] flex flex-col items-center justify-center cursor-pointer transition-all flex-shrink-0" title="Agregar otra foto">
                        <span className="text-xl font-bold">+</span>
                        <span className="text-[9px] font-extrabold">Foto</span>
                        <input type="file" accept="image/*" multiple onChange={handleSecondaryImagesChange} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* ═══ 2. SECCIÓN INFERIOR: TARJETA CYAN CON CAMPOS Y VARIANTES ═══ */}
              <div className="bg-[#bbf2ff] rounded-3xl p-5 space-y-4 border border-[#8fe4fc] shadow-sm">
                
                {/* Nombre y Precio */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex-1 w-full">
                    <label className="block text-[11px] font-black text-gray-800 uppercase tracking-wider mb-1">
                      Nombre del Producto *
                    </label>
                    <input
                      type="text"
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="Ej: Caja Happy Day Sorpresa"
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-[#00c2ff]"
                    />
                  </div>

                  <div className="w-full sm:w-32">
                    <label className="block text-[11px] font-black text-gray-800 uppercase tracking-wider mb-1">
                      Precio ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      placeholder="15.99"
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-sm font-black text-gray-900 outline-none focus:ring-2 focus:ring-[#00c2ff]"
                    />
                  </div>
                </div>

                <div className="text-[11px] text-gray-700 font-semibold italic -mt-1">
                  Precio exclusivo para clientes en tienda
                </div>

                {/* Selector de Medidas Disponibles */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-gray-800">
                      Medidas Disponibles
                    </label>
                    <span className="text-[10px] text-gray-600 font-medium">Activa o desactiva las medidas</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {availableSizePresets.map((sz) => {
                      const isSelected = (productForm.sizes || []).includes(sz.id);
                      return (
                        <button
                          key={sz.id}
                          type="button"
                          onClick={() => toggleSizeOption(sz.id)}
                          className={`w-10 h-10 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center shadow-sm ${
                            isSelected
                              ? 'bg-[#ffcc00] text-gray-950 ring-2 ring-amber-400 scale-105 shadow-md'
                              : 'bg-white/80 text-gray-500 border border-gray-300 hover:bg-white'
                          }`}
                          title={sz.desc}
                        >
                          {sz.label}
                        </button>
                      );
                    })}
                    <input
                      type="text"
                      value={productForm.medidas}
                      onChange={(e) => setProductForm({ ...productForm, medidas: e.target.value })}
                      placeholder="Detalle cm: 25,5x19x9 cm"
                      className="flex-1 min-w-[150px] p-2 bg-white border border-gray-300 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-[#00c2ff]"
                    />
                  </div>
                </div>

                {/* Selector de Colores Disponibles */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-gray-800">
                      Colores Disponibles (del mismo tipo de caja)
                    </label>
                    <span className="text-[10px] text-gray-600 font-medium">Selecciona los colores activos</span>
                  </div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {availableColorPresets.map((col) => {
                      const isSelected = (productForm.colors || []).includes(col.id);
                      return (
                        <button
                          key={col.id}
                          type="button"
                          onClick={() => toggleColorOption(col.id)}
                          className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center shadow-sm ${
                            isSelected
                              ? 'ring-2 ring-gray-900 ring-offset-2 scale-110 border-white'
                              : 'border-gray-300 opacity-60 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: col.hex }}
                          title={col.name}
                        >
                          {isSelected && (
                            <span className={`text-[10px] font-bold ${col.id === 'white' ? 'text-gray-900' : 'text-white'}`}>
                              ✓
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4 Inputs Grid: ID, Categoría, Stock, Mínimo */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  <div>
                    <label className="block text-[10px] font-black text-gray-800 uppercase mb-1">ID / Ref</label>
                    <input
                      type="text"
                      value={productForm.ref}
                      onChange={(e) => setProductForm({ ...productForm, ref: e.target.value })}
                      placeholder="TC-101"
                      className="w-full p-2 bg-white border border-gray-300 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#00c2ff]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-800 uppercase mb-1">Categoría</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full p-2 bg-white border border-gray-300 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#00c2ff] cursor-pointer"
                    >
                      <option value="especial">Lujo</option>
                      <option value="microcorrugados">Microcorrugados</option>
                      <option value="unicolor">Unicolor</option>
                      <option value="portavasos">Portavasos</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-800 uppercase mb-1">Stock</label>
                    <input
                      type="number"
                      required
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      placeholder="50"
                      className="w-full p-2 bg-white border border-gray-300 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#00c2ff]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-800 uppercase mb-1">Mínimo</label>
                    <input
                      type="number"
                      value={productForm.minStock}
                      onChange={(e) => setProductForm({ ...productForm, minStock: e.target.value })}
                      placeholder="20"
                      className="w-full p-2 bg-white border border-gray-300 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#00c2ff]"
                    />
                  </div>
                </div>

                {/* Tipo de Producto y Secciones */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div>
                    <label className="block text-[10px] font-black text-gray-800 uppercase mb-1">Tipo de Sección</label>
                    <select
                      value={productForm.type}
                      onChange={(e) => setProductForm({ ...productForm, type: e.target.value })}
                      className="w-full p-2 bg-white border border-gray-300 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#00c2ff] cursor-pointer"
                    >
                      <option value="cajas">📦 Cajas</option>
                      <option value="arreglos">💐 Arreglos</option>
                      <option value="eventos">🎉 Eventos</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-4 sm:pt-4">
                    <label className="flex items-center gap-1.5 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-gray-300 flex-1">
                      <input
                        type="checkbox"
                        checked={productForm.featured}
                        onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                        className="rounded text-amber-500"
                      />
                      <span className="text-[11px] font-bold text-gray-800">🌟 Destacados</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-gray-300 flex-1">
                      <input
                        type="checkbox"
                        checked={productForm.forYou}
                        onChange={(e) => setProductForm({ ...productForm, forYou: e.target.checked })}
                        className="rounded text-purple-500"
                      />
                      <span className="text-[11px] font-bold text-gray-800">✨ Para ti</span>
                    </label>
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-[11px] font-black text-gray-800 uppercase mb-1">Descripción</label>
                  <textarea
                    rows="2"
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Ideal para maquillaje, desayunos sorpresa y regalos personalizados..."
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-[#00c2ff]"
                  />
                </div>

                {/* Botón Principal Crear / Publicar */}
                <button
                  type="submit"
                  className="w-full py-4 bg-[#00c2ff] hover:bg-[#00b0e6] text-white font-black text-base rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.01] active:scale-100"
                >
                  {editingProduct ? 'Guardar Cambios' : 'Crear'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ORDER ADD / EDIT */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-[fadeIn_0.2s_ease]">
            <button
              onClick={() => setIsOrderModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 text-xl font-bold cursor-pointer"
            >
              ✕
            </button>
            <h3 className="text-2xl font-black text-gray-900 mb-1">
              {editingOrder ? `Editar Pedido #${editingOrder.id}` : 'Crear Nuevo Pedido'}
            </h3>
            <p className="text-xs text-gray-500 mb-5 font-semibold">
              Registra los datos del cliente y los productos solicitados.
            </p>

            <form onSubmit={handleSaveOrder} className="space-y-4 text-xs font-bold text-gray-700">
              <div>
                <label className="block mb-1 text-gray-800">Nombre del Cliente *</label>
                <input
                  type="text"
                  required
                  value={orderForm.client}
                  onChange={(e) => setOrderForm({ ...orderForm, client: e.target.value })}
                  placeholder="Ej: María Fima"
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold outline-none focus:border-[#00cbf4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-gray-800">Teléfono</label>
                  <input
                    type="text"
                    value={orderForm.phone}
                    onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                    placeholder="+58 412-1234567"
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold outline-none focus:border-[#00cbf4]"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-gray-800">Total a Pagar ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={orderForm.total}
                    onChange={(e) => setOrderForm({ ...orderForm, total: e.target.value })}
                    placeholder="189.00"
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold outline-none focus:border-[#00cbf4]"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-gray-800">Dirección de Entrega</label>
                <input
                  type="text"
                  value={orderForm.deliveryAddress}
                  onChange={(e) => setOrderForm({ ...orderForm, deliveryAddress: e.target.value })}
                  placeholder="Av. Principal, Edificio, Apartamento..."
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold outline-none focus:border-[#00cbf4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-gray-800">Estado del Pedido</label>
                  <select
                    value={orderForm.status}
                    onChange={(e) => setOrderForm({ ...orderForm, status: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold outline-none focus:border-[#00cbf4]"
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="En Preparación">En Preparación</option>
                    <option value="Pagado">Pagado</option>
                    <option value="Enviado">Enviado</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-gray-800">Método de Pago</label>
                  <select
                    value={orderForm.paymentMethod}
                    onChange={(e) => setOrderForm({ ...orderForm, paymentMethod: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold outline-none focus:border-[#00cbf4]"
                  >
                    <option value="Pago Móvil">Pago Móvil</option>
                    <option value="Transferencia Banesco">Transferencia Banesco</option>
                    <option value="Zelle">Zelle</option>
                    <option value="Efectivo USD">Efectivo USD</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#00cbf4] hover:bg-[#00b5dc] text-white font-bold rounded-xl text-sm shadow cursor-pointer"
                >
                  {editingOrder ? 'Guardar Cambios' : 'Crear Pedido'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ORDER DETAIL VIEW */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-[fadeIn_0.2s_ease]">
            <button
              onClick={() => setSelectedOrderDetails(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 text-xl font-bold cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">📦</span>
              <div>
                <h3 className="text-xl font-black text-gray-900">Pedido #{selectedOrderDetails.id}</h3>
                <span className="text-xs text-gray-500 font-semibold">{selectedOrderDetails.date}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs bg-gray-50 p-4 rounded-2xl mb-4">
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold">Cliente:</span>
                <span className="font-extrabold text-gray-900">{selectedOrderDetails.client}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold">Teléfono:</span>
                <span className="font-mono text-gray-800">{selectedOrderDetails.phone || 'No registrado'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold">Dirección de Entrega:</span>
                <span className="font-semibold text-gray-800 text-right">{selectedOrderDetails.deliveryAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold">Método de Pago:</span>
                <span className="font-bold text-gray-800">{selectedOrderDetails.paymentMethod}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 text-sm">
                <span className="font-extrabold text-gray-900">Total:</span>
                <span className="font-black text-teal-700">${selectedOrderDetails.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  handleStatusChange(selectedOrderDetails.id, selectedOrderDetails.status === 'Pendiente' ? 'Pagado' : 'Pendiente');
                  setSelectedOrderDetails(null);
                }}
                className="flex-1 py-2.5 bg-[#00cbf4] hover:bg-[#00b5dc] text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Alternar Estado ({selectedOrderDetails.status})
              </button>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: DIGITAL INVOICE PREVIEW */}
      {selectedInvoiceView && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl relative animate-[fadeIn_0.2s_ease]">
            <button
              onClick={() => setSelectedInvoiceView(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 text-xl font-bold cursor-pointer"
            >
              ✕
            </button>

            {/* Printable Invoice Card */}
            <div className="border-2 border-dashed border-gray-200 p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <h3 className="text-xl font-black text-teal-800" style={{ fontFamily: "'Fredoka One', cursive" }}>
                    Tu Cajita C.A.
                  </h3>
                  <p className="text-[11px] text-gray-500 font-semibold">RIF: J-50198234-1</p>
                  <p className="text-[11px] text-gray-500">Maracay, Estado Aragua, Venezuela</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-black text-gray-900 bg-gray-100 px-2.5 py-1 rounded-lg">
                    {selectedInvoiceView.id}
                  </span>
                  <p className="text-[10px] text-gray-400 mt-1">Fecha: {selectedInvoiceView.date}</p>
                </div>
              </div>

              <div className="space-y-1 text-xs text-gray-700 font-medium">
                <p><b>Cliente:</b> {selectedInvoiceView.client}</p>
                <p><b>Cédula / RIF:</b> {selectedInvoiceView.idDoc}</p>
                <p><b>Pedido Asociado:</b> #{selectedInvoiceView.orderId}</p>
                <p><b>Forma de Pago:</b> {selectedInvoiceView.paymentMethod}</p>
              </div>

              <div className="border-t pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span className="font-bold">${selectedInvoiceView.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>IVA (16%):</span>
                  <span className="font-bold">${selectedInvoiceView.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-gray-900 border-t pt-2">
                  <span>TOTAL A PAGAR:</span>
                  <span className="text-teal-700 text-base">${selectedInvoiceView.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-3 bg-[#00cbf4] hover:bg-[#00b5dc] text-white font-bold text-xs rounded-xl shadow cursor-pointer flex items-center justify-center gap-2"
              >
                <span>🖨️</span>
                <span>Imprimir / Descargar PDF</span>
              </button>
              <button
                onClick={() => setSelectedInvoiceView(null)}
                className="py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: NEW INVOICE FORM */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-[fadeIn_0.2s_ease]">
            <button
              onClick={() => setIsInvoiceModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 text-xl font-bold cursor-pointer"
            >
              ✕
            </button>
            <h3 className="text-xl font-black text-gray-900 mb-1">Emitir Factura Digital</h3>
            <p className="text-xs text-gray-500 mb-4 font-semibold">Genera el comprobante fiscal digital para el cliente.</p>

            <form onSubmit={handleSaveInvoice} className="space-y-4 text-xs font-bold text-gray-700">
              <div>
                <label className="block mb-1 text-gray-800">Nombre del Cliente *</label>
                <input
                  type="text"
                  required
                  value={invoiceForm.client}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, client: e.target.value })}
                  placeholder="María Fima"
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-gray-800">C.I. / RIF *</label>
                  <input
                    type="text"
                    required
                    value={invoiceForm.idDoc}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, idDoc: e.target.value })}
                    placeholder="V-18.945.123"
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-gray-800">Monto Total ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={invoiceForm.total}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, total: e.target.value })}
                    placeholder="189.00"
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsInvoiceModalOpen(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#00cbf4] hover:bg-[#00b5dc] text-white font-bold rounded-xl text-xs shadow cursor-pointer"
                >
                  Emitir Factura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: CLIENT PURCHASE HISTORY DETAIL */}
      {selectedClientDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-[fadeIn_0.2s_ease]">
            <button
              onClick={() => setSelectedClientDetails(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 text-xl font-bold cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-4 mb-6 border-b pb-4">
              <div className="w-14 h-14 rounded-2xl bg-[#00cbf4] text-white flex items-center justify-center text-2xl font-black">
                {selectedClientDetails.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900">{selectedClientDetails.name}</h3>
                <p className="text-xs text-gray-500 font-semibold">{selectedClientDetails.email} • {selectedClientDetails.phone}</p>
                <p className="text-xs text-teal-700 font-bold mt-1">Inversión acumulada: ${selectedClientDetails.totalSpent.toFixed(2)}</p>
              </div>
            </div>

            <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider mb-3">
              Historial de Pedidos Realizados ({selectedClientDetails.ordersList.length})
            </h4>

            <div className="space-y-3">
              {selectedClientDetails.ordersList.map((ord) => (
                <div key={ord.id} className="p-4 bg-gray-50 rounded-2xl flex justify-between items-center text-xs">
                  <div>
                    <span className="font-mono font-black text-gray-900">Pedido #{ord.id}</span>
                    <span className="text-gray-400 ml-2 font-semibold">({ord.date})</span>
                    <p className="text-gray-600 mt-0.5">{ord.items} artículo(s) • {ord.paymentMethod}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-teal-700 text-sm block">${ord.total.toFixed(2)}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-900">
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedClientDetails(null)}
                className="py-2.5 px-6 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
