import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { saveOrder } from '../services/dbService';
import DigitalInvoiceModal from './DigitalInvoiceModal';

export default function CheckoutFlow({ user, setCurrentView, onBackToShop }) {
  const { cart, cartSubtotal, cartTotal, clearCart } = useCart();
  
  // Persisted Step
  const [currentStep, setCurrentStep] = useState(() => {
    try {
      const savedStep = localStorage.getItem('tucajita_checkout_step');
      return savedStep ? parseInt(savedStep) : 1;
    } catch {
      return 1;
    }
  });

  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [snapshotItems, setSnapshotItems] = useState([]);
  const [snapshotTotal, setSnapshotTotal] = useState(0);

  // Form State with Persistence
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem('tucajita_checkout_form');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }

    return {
      // Step 1: Datos
      firstName: user?.name?.split(' ')[0] || 'Omar',
      lastName: user?.name?.split(' ').slice(1).join(' ') || 'Angola',
      phone: user?.phone || user?.telefono || '+584120177993',
      email: user?.email || 'omardavidangola@gmail.com',

      // Step 2: Entrega
      countryCity: 'Táchira, Venezuela',
      deliveryAddress: user?.address || user?.direccion || 'Barrio Obrero',
      deliveryType: 'Retiro en tienda física', // 'Retiro en tienda física' | 'Envío a domicilio'
      deliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // 2 days from now

      // Step 3: Facturación
      samePaymentAddress: true,
      customPaymentAddress: '',
      paymentMethod: 'Zelle', // 'Zelle' | 'Binance' | 'Nequi' | 'Bolívares por pago móvil'
      reference: `TC-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 900 + 100)}`,
      invoiceNumber: `${Math.floor(100000 + Math.random() * 900000)}`,
    };
  });

  // Save form data & step in localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('tucajita_checkout_form', JSON.stringify(formData));
      localStorage.setItem('tucajita_checkout_step', currentStep.toString());
    } catch (e) {
      console.warn('Error persisting checkout form:', e);
    }
  }, [formData, currentStep]);

  const [expandedPayment, setExpandedPayment] = useState('Zelle');
  const [isEditingPaymentAddress, setIsEditingPaymentAddress] = useState(false);

  // WhatsApp Order Send Handler (Dispatches Order to Admin Panel & Displays Invoice Simultaneously)
  const handleSendWhatsAppOrder = async () => {
    const finalItems = (snapshotItems.length > 0 ? snapshotItems : (cart.length > 0 ? cart : [{ name: 'Caja Personalizada Lujo', qty: 1, price: 25.98 }]));
    const finalTotal = snapshotTotal > 0 ? snapshotTotal : (cartTotal > 0 ? cartTotal : 25.98);
    const finalSubtotal = cartSubtotal > 0 ? cartSubtotal : finalTotal;

    // 1. Guardar y sincronizar orden en tiempo real con el panel de administración
    try {
      const orderPayload = {
        id: formData.invoiceNumber,
        invoiceNumber: formData.invoiceNumber,
        client: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        deliveryAddress: formData.deliveryAddress,
        date: new Date().toISOString().split('T')[0],
        total: finalTotal,
        status: 'Pendiente',
        paymentMethod: formData.paymentMethod,
        items: finalItems.reduce((acc, i) => acc + (i.quantity || i.qty || 1), 0) || 1,
        itemsList: finalItems,
        ref: formData.reference,
        deliveryType: formData.deliveryType,
      };
      await saveOrder(orderPayload);
    } catch (err) {
      console.warn('Error sincronizando orden con panel admin:', err);
    }

    // 2. Abrir la factura digital simultáneamente con los datos fijados
    setSnapshotItems(finalItems);
    setSnapshotTotal(finalTotal);
    setIsInvoiceOpen(true);

    // 3. Limpiar el carrito de compras para que el cliente pueda volver a añadir productos libres
    clearCart();
    try {
      localStorage.removeItem('tucajita_checkout_step');
    } catch (e) {
      // ignore
    }

    // 4. Generar mensaje pre-armado y abrir WhatsApp
    const itemsList = finalItems
      .map((item, idx) => `${idx + 1}. *${item.name}* x${item.quantity || item.qty || 1} ($${(item.price * (item.quantity || item.qty || 1)).toFixed(2)})`)
      .join('\n');

    const totalStr = finalTotal.toFixed(2);
    const subtotalStr = finalSubtotal.toFixed(2);

    const message = encodeURIComponent(
      `NUEVO PEDIDO CONFIRMADO - TU CAJITA\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `• *Factura Nro:* #${formData.invoiceNumber}\n` +
      `• *Cliente:* ${formData.firstName} ${formData.lastName}\n` +
      `• *Telefono:* ${formData.phone}\n` +
      `• *Email:* ${formData.email}\n` +
      `• *Direccion:* ${formData.deliveryAddress}\n` +
      `• *Tipo de Entrega:* ${formData.deliveryType}\n` +
      `• *Fecha de Entrega:* ${formData.deliveryDate}\n` +
      `• *Metodo de Pago:* ${formData.paymentMethod}\n` +
      `• *Referencia / Codigo:* ${formData.reference}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `*Detalle de Productos:*\n${itemsList}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `• *Subtotal:* $${subtotalStr}\n` +
      `• *TOTAL GENERAL:* $${totalStr} (USD)\n\n` +
      `Hola Tu Cajita! Acabo de emitir la orden #${formData.invoiceNumber} con comprobante ${formData.reference}. Envio los detalles para su despacho.`
    );

    window.open(`https://wa.me/584120177993?text=${message}`, '_blank');
  };

  // Step 4 final trigger save order to DB with System-Generated Unique Reference
  const handleProceedToStep4 = async () => {
    // Asegurar que la referencia sea única y generada por el sistema
    let finalRef = formData.reference;
    if (!finalRef || finalRef === '#123456') {
      finalRef = `TC-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 900 + 100)}`;
      setFormData((prev) => ({ ...prev, reference: finalRef }));
    }

    const currentCartItems = cart.length > 0 ? [...cart] : [{ name: 'Caja Personalizada Lujo', qty: 1, price: 25.98 }];
    const currentTotal = cartTotal > 0 ? cartTotal : 25.98;
    setSnapshotItems(currentCartItems);
    setSnapshotTotal(currentTotal);

    setCurrentStep(4);
    try {
      const orderPayload = {
        id: formData.invoiceNumber,
        invoiceNumber: formData.invoiceNumber,
        client: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        deliveryAddress: formData.deliveryAddress,
        date: new Date().toISOString().split('T')[0],
        total: currentTotal,
        status: 'Pendiente',
        paymentMethod: formData.paymentMethod,
        items: currentCartItems.reduce((acc, i) => acc + (i.quantity || i.qty || 1), 0) || 1,
        itemsList: currentCartItems,
        ref: finalRef,
        deliveryType: formData.deliveryType,
      };
      await saveOrder(orderPayload);
    } catch (err) {
      console.warn('Error registrando orden en db:', err);
    }
  };

  const stepsList = [
    { num: 1, label: 'Datos' },
    { num: 2, label: 'Entrega' },
    { num: 3, label: 'Facturaci...' },
    { num: 4, label: 'Confirma...' },
  ];

  return (
    <div className="w-full min-h-[calc(100vh-220px)] bg-white text-[#0f172a] py-12 sm:py-16 font-sans flex flex-col items-center justify-center">
      <div className="w-full max-w-xl px-4 sm:px-8 flex flex-col items-stretch my-auto">
        
        {/* ═══════════════════════════════════════════ */}
        {/* 1. STEPPER SUPERIOR (MOCKUP EXACTO)         */}
        {/* ═══════════════════════════════════════════ */}
        <div className="w-full pb-8 sm:pb-10">
          <div className="flex items-center justify-between relative">
            {stepsList.map((step, idx) => {
              const isCompleted = currentStep > step.num;
              const isCurrent = currentStep === step.num;

              return (
                <div key={step.num} className="flex-1 flex flex-col items-center relative z-10">
                  {/* Step Circle */}
                  <button
                    type="button"
                    onClick={() => {
                      if (isCompleted) setCurrentStep(step.num);
                    }}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-black text-base sm:text-lg transition-all shadow-sm ${
                      isCompleted || isCurrent
                        ? 'bg-[#ffcc00] text-gray-900 shadow-md ring-4 ring-[#ffcc00]/20'
                        : 'bg-white text-gray-400 border-2 border-gray-300'
                    } ${isCompleted ? 'cursor-pointer hover:scale-105' : 'cursor-default'}`}
                  >
                    {isCompleted ? (
                      <span className="text-xl font-black">✓</span>
                    ) : (
                      <span>{step.num}</span>
                    )}
                  </button>

                  {/* Step Label */}
                  <span className={`text-xs sm:text-sm font-bold mt-2 tracking-tight ${
                    isCurrent || isCompleted ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </span>

                  {/* Connecting Line between steps */}
                  {idx < stepsList.length - 1 && (
                    <div
                      className={`absolute top-6 left-1/2 w-full h-1 -z-10 transition-colors ${
                        currentStep > step.num ? 'bg-[#ffcc00]' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ═══════════════════════════════════════════ */}
        {/* 2. CONTENIDO PRINCIPAL POR PASO             */}
        {/* ═══════════════════════════════════════════ */}
        <div className="w-full">

        {/* ───────────────────────────────────────── */}
        {/* PASO 1: DATOS (Imagen 2)                  */}
        {/* ───────────────────────────────────────── */}
        {currentStep === 1 && (
          <div className="space-y-6 pt-4 animate-[fadeIn_0.25s_ease]">
            {/* Nombres */}
            <div className="space-y-2">
              <label className="block text-base font-bold text-gray-900">
                Nombres
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Gabriela"
                className="w-full px-6 py-4 bg-[#7FE5FA] text-gray-800 font-semibold text-base rounded-2xl sm:rounded-3xl border-none outline-none placeholder:text-gray-500 shadow-sm focus:ring-4 focus:ring-[#7FE5FA]/40 transition-all"
              />
            </div>

            {/* Apellidos */}
            <div className="space-y-2">
              <label className="block text-base font-bold text-gray-900">
                Apellidos
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Angola"
                className="w-full px-6 py-4 bg-[#7FE5FA] text-gray-800 font-semibold text-base rounded-2xl sm:rounded-3xl border-none outline-none placeholder:text-gray-500 shadow-sm focus:ring-4 focus:ring-[#7FE5FA]/40 transition-all"
              />
            </div>

            {/* Teléfono con ícono */}
            <div className="space-y-2">
              <label className="block text-base font-bold text-gray-900">
                Teléfono
              </label>
              <div className="relative flex items-center bg-[#7FE5FA] rounded-2xl sm:rounded-3xl px-6 py-4 shadow-sm focus-within:ring-4 focus-within:ring-[#7FE5FA]/40 transition-all">
                <svg className="w-5 h-5 text-gray-800 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0424-7724352"
                  className="w-full bg-transparent text-gray-800 font-semibold text-base border-none outline-none placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Email con ícono */}
            <div className="space-y-2">
              <label className="block text-base font-bold text-gray-900">
                Email
              </label>
              <div className="relative flex items-center bg-[#7FE5FA] rounded-2xl sm:rounded-3xl px-6 py-4 shadow-sm focus-within:ring-4 focus-within:ring-[#7FE5FA]/40 transition-all">
                <svg className="w-5 h-5 text-gray-800 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="gabriela.angola@gmail.com"
                  className="w-full bg-transparent text-gray-800 font-semibold text-base border-none outline-none placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Botón Siguiente */}
            <div className="pt-6">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="w-full py-4 bg-[#ffcc00] hover:bg-[#e6b800] text-gray-950 font-black text-lg rounded-2xl sm:rounded-3xl shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-[1.01] active:scale-100"
              >
                Continuar a Entrega →
              </button>
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────── */}
        {/* PASO 2: ENTREGA (Imagen 4)                */}
        {/* ───────────────────────────────────────── */}
        {currentStep === 2 && (
          <div className="space-y-6 pt-4 animate-[fadeIn_0.25s_ease]">
            {/* Ciudad / País */}
            <div className="space-y-2">
              <label className="block text-base font-bold text-gray-900">
                Ciudad/País
              </label>
              <input
                type="text"
                value={formData.countryCity}
                onChange={(e) => setFormData({ ...formData, countryCity: e.target.value })}
                placeholder="Táchira, Venezuela"
                className="w-full px-6 py-4 bg-[#7FE5FA] text-gray-800 font-semibold text-base rounded-2xl sm:rounded-3xl border-none outline-none shadow-sm focus:ring-4 focus:ring-[#7FE5FA]/40 transition-all"
              />
            </div>

            {/* Dirección de envío (Caja alta) */}
            <div className="space-y-2">
              <label className="block text-base font-bold text-gray-900">
                Dirección de envío
              </label>
              <textarea
                rows="3"
                value={formData.deliveryAddress}
                onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                placeholder="San Cristóbal, Venezuela, Táchira, Barrio Obrero, Calle 10 con carrera 19"
                className="w-full px-6 py-4 bg-[#7FE5FA] text-gray-800 font-semibold text-base rounded-2xl sm:rounded-3xl border-none outline-none resize-none shadow-sm focus:ring-4 focus:ring-[#7FE5FA]/40 transition-all"
              />
            </div>

            {/* Opción de retiro (Dropdown selector pill) */}
            <div className="space-y-2">
              <label className="block text-base font-bold text-gray-900">
                Opción de retiro
              </label>
              <div className="relative bg-[#7FE5FA] rounded-2xl sm:rounded-3xl px-6 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3 w-full">
                  <span className="w-5 h-5 rounded-full border-2 border-gray-700 flex items-center justify-center shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-gray-800 block"></span>
                  </span>
                  <select
                    value={formData.deliveryType}
                    onChange={(e) => setFormData({ ...formData, deliveryType: e.target.value })}
                    className="w-full bg-transparent text-gray-800 font-semibold text-base border-none outline-none cursor-pointer appearance-none"
                  >
                    <option value="Retiro en tienda física">Retiro en tienda fisica</option>
                    <option value="Envío a domicilio">Envío a domicilio</option>
                  </select>
                </div>
                <span className="pointer-events-none text-gray-700 text-lg font-bold">⌄</span>
              </div>
            </div>

            {/* Fecha de entrega */}
            <div className="space-y-2">
              <label className="block text-base font-bold text-gray-900">
                Fecha de entrega
              </label>
              <input
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                className="w-full px-6 py-4 bg-[#7FE5FA] text-gray-800 font-semibold text-base rounded-2xl sm:rounded-3xl border-none outline-none shadow-sm focus:ring-4 focus:ring-[#7FE5FA]/40 transition-all cursor-pointer"
              />
            </div>

            {/* Botones Navegación */}
            <div className="flex gap-3 pt-6">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-black text-base rounded-2xl sm:rounded-3xl transition-all cursor-pointer"
              >
                ← Atrás
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="flex-1 py-4 bg-[#ffcc00] hover:bg-[#e6b800] text-gray-950 font-black text-lg rounded-2xl sm:rounded-3xl shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-[1.01] active:scale-100"
              >
                Continuar a Facturación →
              </button>
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────── */}
        {/* PASO 3: FACTURACIÓN (Imagen 5)             */}
        {/* ───────────────────────────────────────── */}
        {currentStep === 3 && (
          <div className="space-y-6 pt-2 animate-[fadeIn_0.25s_ease]">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Método de pago
            </div>

            {/* Dirección de pago con lápiz de edición */}
            <div className="border-b border-gray-200 pb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-gray-900">
                  Dirección de pago
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditingPaymentAddress(!isEditingPaymentAddress)}
                  className="text-gray-800 hover:text-amber-600 transition-colors p-1 cursor-pointer"
                  title="Editar dirección de pago"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>

              {isEditingPaymentAddress ? (
                <input
                  type="text"
                  value={formData.customPaymentAddress}
                  onChange={(e) => setFormData({ ...formData, customPaymentAddress: e.target.value, samePaymentAddress: false })}
                  placeholder="Ingresa la dirección fiscal de facturación..."
                  className="w-full mt-2 p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#7FE5FA]"
                />
              ) : (
                <p className="text-sm font-medium text-gray-700 mt-1">
                  {formData.samePaymentAddress ? 'Misma que en la entrega' : formData.customPaymentAddress}
                </p>
              )}
            </div>

            {/* Selector de Métodos de Pago */}
            <div className="space-y-3 pt-2">
              <div className="text-sm font-bold text-gray-500 mb-2">
                Método de pago
              </div>

              {/* Opción 1: Zelle */}
              <div className="border-b border-gray-200 pb-3">
                <div
                  onClick={() => {
                    setFormData({ ...formData, paymentMethod: 'Zelle' });
                    setExpandedPayment(expandedPayment === 'Zelle' ? null : 'Zelle');
                  }}
                  className="flex items-center justify-between py-2 cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      formData.paymentMethod === 'Zelle' ? 'border-gray-900 ring-2 ring-gray-900/20' : 'border-gray-400'
                    }`}>
                      {formData.paymentMethod === 'Zelle' && <span className="w-2.5 h-2.5 rounded-full bg-gray-900 block" />}
                    </span>
                    <span className="font-bold text-base text-gray-900 group-hover:text-purple-700 transition-colors">
                      Zelle
                    </span>
                  </div>
                  <span className="text-gray-600 text-sm font-bold">⌄</span>
                </div>

                {expandedPayment === 'Zelle' && (
                  <div className="mt-2 ml-8 p-3.5 bg-purple-50 rounded-2xl text-xs font-semibold text-purple-900 space-y-1 animate-[fadeIn_0.2s_ease]">
                    <p>✉️ <strong>Correo:</strong> pagos@tucajita.com</p>
                    <p>👤 <strong>Titular:</strong> Tu Cajita C.A.</p>
                  </div>
                )}
              </div>

              {/* Opción 2: Binance */}
              <div className="border-b border-gray-200 pb-3">
                <div
                  onClick={() => {
                    setFormData({ ...formData, paymentMethod: 'Binance' });
                    setExpandedPayment(expandedPayment === 'Binance' ? null : 'Binance');
                  }}
                  className="flex items-center justify-between py-2 cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      formData.paymentMethod === 'Binance' ? 'border-gray-900 ring-2 ring-gray-900/20' : 'border-gray-400'
                    }`}>
                      {formData.paymentMethod === 'Binance' && <span className="w-2.5 h-2.5 rounded-full bg-gray-900 block" />}
                    </span>
                    <span className="font-bold text-base text-gray-900 group-hover:text-amber-600 transition-colors">
                      Binance
                    </span>
                  </div>
                  <span className="text-gray-600 text-sm font-bold">⌄</span>
                </div>

                {expandedPayment === 'Binance' && (
                  <div className="mt-2 ml-8 p-3.5 bg-amber-50 rounded-2xl text-xs font-semibold text-amber-900 space-y-1 animate-[fadeIn_0.2s_ease]">
                    <p>🟡 <strong>Binance Pay ID:</strong> 584120177</p>
                    <p>💵 <strong>Moneda:</strong> USDT</p>
                  </div>
                )}
              </div>

              {/* Opción 3: Nequi */}
              <div className="border-b border-gray-200 pb-3">
                <div
                  onClick={() => {
                    setFormData({ ...formData, paymentMethod: 'Nequi' });
                    setExpandedPayment(expandedPayment === 'Nequi' ? null : 'Nequi');
                  }}
                  className="flex items-center justify-between py-2 cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      formData.paymentMethod === 'Nequi' ? 'border-gray-900 ring-2 ring-gray-900/20' : 'border-gray-400'
                    }`}>
                      {formData.paymentMethod === 'Nequi' && <span className="w-2.5 h-2.5 rounded-full bg-gray-900 block" />}
                    </span>
                    <span className="font-bold text-base text-gray-900 group-hover:text-pink-700 transition-colors">
                      Nequi
                    </span>
                  </div>
                  <span className="text-gray-600 text-sm font-bold">⌄</span>
                </div>

                {expandedPayment === 'Nequi' && (
                  <div className="mt-2 ml-8 p-3.5 bg-pink-50 rounded-2xl text-xs font-semibold text-pink-900 space-y-1 animate-[fadeIn_0.2s_ease]">
                    <p>📱 <strong>Nequi / Bancolombia:</strong> 312-0177993</p>
                    <p>👤 <strong>Titular:</strong> Tu Cajita</p>
                  </div>
                )}
              </div>

              {/* Opción 4: Bolívares por pago móvil */}
              <div className="border-b border-gray-200 pb-3">
                <div
                  onClick={() => {
                    setFormData({ ...formData, paymentMethod: 'Bolívares por pago móvil' });
                    setExpandedPayment(expandedPayment === 'PagoMovil' ? null : 'PagoMovil');
                  }}
                  className="flex items-center justify-between py-2 cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      formData.paymentMethod === 'Bolívares por pago móvil' ? 'border-gray-900 ring-2 ring-gray-900/20' : 'border-gray-400'
                    }`}>
                      {formData.paymentMethod === 'Bolívares por pago móvil' && <span className="w-2.5 h-2.5 rounded-full bg-gray-900 block" />}
                    </span>
                    <span className="font-bold text-base text-gray-900 group-hover:text-cyan-700 transition-colors">
                      Bolívares por pago móvil
                    </span>
                  </div>
                  <span className="text-gray-600 text-sm font-bold">⌄</span>
                </div>

                {expandedPayment === 'PagoMovil' && (
                  <div className="mt-2 ml-8 p-3.5 bg-cyan-50 rounded-2xl text-xs font-semibold text-cyan-950 space-y-1 animate-[fadeIn_0.2s_ease]">
                    <p>🏦 <strong>Banco:</strong> Banesco (0134)</p>
                    <p>📞 <strong>Teléfono:</strong> 0412-0177993</p>
                    <p>🆔 <strong>C.I.:</strong> 26.543.210</p>
                    <p>💵 <strong>Tasa:</strong> Aceptamos a tasa oficial BCV del día</p>
                  </div>
                )}
              </div>
            </div>

            {/* Código / Referencia generado por el sistema (no editable) */}
            <div className="pt-2">
              <h3 className="text-lg font-black text-gray-900 mb-1">
                Código de Referencia
              </h3>
              <p className="text-[11px] text-gray-500 font-medium mb-2">
                Generado automáticamente por el sistema. Este código es único e irrepetible.
              </p>
              <div className="w-full p-3.5 bg-gray-100 border border-gray-200 rounded-2xl text-base font-black text-gray-900 tracking-wider flex items-center gap-2 select-all">
                <span className="text-amber-500">🔖</span>
                <span>{formData.reference}</span>
              </div>
            </div>

            {/* Botones Navegación */}
            <div className="flex gap-3 pt-6">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-black text-base rounded-2xl sm:rounded-3xl transition-all cursor-pointer"
              >
                ← Atrás
              </button>
              <button
                type="button"
                onClick={handleProceedToStep4}
                className="flex-1 py-4 bg-[#ffcc00] hover:bg-[#e6b800] text-gray-950 font-black text-lg rounded-2xl sm:rounded-3xl shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-[1.01] active:scale-100"
              >
                Confirmar Orden →
              </button>
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────── */}
        {/* PASO 4: CONFIRMACIÓN (Imagen 1)           */}
        {/* ───────────────────────────────────────── */}
        {currentStep === 4 && (
          <div className="space-y-8 pt-4 animate-[fadeIn_0.25s_ease]">
            
            {/* Lista resumen de datos del cliente */}
            <div className="space-y-4 text-base font-sans">
              <div>
                <span className="block text-sm font-semibold text-gray-600">Nombres</span>
                <span className="block text-lg font-black text-gray-950">{formData.firstName}</span>
              </div>

              <div>
                <span className="block text-sm font-semibold text-gray-600">Apellidos</span>
                <span className="block text-lg font-black text-gray-950">{formData.lastName}</span>
              </div>

              <div>
                <span className="block text-sm font-semibold text-gray-600">Teléfono</span>
                <span className="block text-lg font-black text-gray-950">{formData.phone}</span>
              </div>

              <div>
                <span className="block text-sm font-semibold text-gray-600">Dirección de envío</span>
                <span className="block text-base font-bold text-gray-950 leading-snug">{formData.deliveryAddress}</span>
              </div>

              <div>
                <span className="block text-sm font-semibold text-gray-600">Método de pago</span>
                <span className="block text-lg font-black text-purple-700">{formData.paymentMethod}</span>
              </div>

              <div>
                <span className="block text-sm font-semibold text-gray-600">Referencia</span>
                <span className="block text-lg font-black text-gray-950">{formData.reference}</span>
              </div>

              <div>
                <span className="block text-sm font-semibold text-gray-600">Tipo de entrega</span>
                <span className="block text-lg font-black text-gray-950">{formData.deliveryType}</span>
              </div>
            </div>

            {/* Mensaje de agradecimiento */}
            <div className="pt-4 space-y-2 border-t border-gray-100">
              <h1 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight" style={{ fontFamily: "'Fredoka One', cursive" }}>
                Gracias por su compra
              </h1>
              <p className="text-sm sm:text-base font-semibold text-gray-700 leading-relaxed">
                Tu orden se ha realizado exitosamente y ahora esta siendo procesada.
              </p>
            </div>

            {/* Botón Acción 1: Descargar factura digital (Con Icono PDF Imagen 1) */}
            <div className="flex items-center justify-start pt-2">
              <button
                type="button"
                onClick={() => setIsInvoiceOpen(true)}
                className="flex items-center gap-4 group cursor-pointer bg-white hover:bg-gray-50 p-2 rounded-2xl transition-all"
              >
                {/* SVG PDF Icon */}
                <div className="w-14 h-16 relative flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <div className="w-12 h-14 bg-white rounded-lg border-2 border-red-500 shadow-md flex flex-col items-center justify-center relative overflow-hidden">
                    <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider mb-1">
                      PDF
                    </span>
                    <div className="w-6 h-0.5 bg-gray-300 rounded mb-0.5" />
                    <div className="w-4 h-0.5 bg-gray-300 rounded" />
                  </div>
                </div>
                <span className="text-lg sm:text-xl font-black text-gray-950 group-hover:text-[#00cbf4] transition-colors">
                  Descargar factura digital
                </span>
              </button>
            </div>

            {/* Botón Acción 2: Enviar pedido por WhatsApp */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSendWhatsAppOrder}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-base sm:text-lg rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer hover:scale-[1.01] active:scale-100"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>Enviar pedido por WhatsApp</span>
              </button>
            </div>

            {/* Volver a la tienda */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  clearCart();
                  if (setCurrentView) setCurrentView('home');
                }}
                className="text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
              >
                ← Volver a la Tienda
              </button>
            </div>

          </div>
        )}

        </div>
      </div>

      {/* Modal de Factura Digital (Imagen 3) */}
      <DigitalInvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        invoiceData={formData}
        cartItems={snapshotItems.length > 0 ? snapshotItems : cart}
        totalAmount={snapshotTotal > 0 ? snapshotTotal : (cartTotal > 0 ? cartTotal : 25.98)}
      />

    </div>
  );
}
