import { supabase } from '../supabaseClient';
import { productsData as defaultProducts } from '../data/productsData';

// Mock initial data
export const defaultOrders = [
  { id: '20016', client: 'María Fima', email: 'maria.fima@gmail.com', phone: '+58 412-1234567', date: '2023-05-21', total: 189.00, status: 'Pendiente', items: 2, paymentMethod: 'Pago Móvil', deliveryAddress: 'Av. Las Delicias, Edf. Coral, Apt 4B, Maracay', itemsList: [{ name: 'Caja Happy Day Corazón', qty: 2, price: 89.99 }] },
  { id: '20012', client: 'Alinta Alica', email: 'alinta.alica@gmail.com', phone: '+58 424-9876543', date: '2023-05-21', total: 200.00, status: 'Pendiente', items: 3, paymentMethod: 'Transferencia Banesco', deliveryAddress: 'Urb. La Soledad, Calle 3, Casa #12, Maracay', itemsList: [{ name: 'Caja Casita con Ventana', qty: 2, price: 89.99 }, { name: 'Portavasos Múltiple', qty: 1, price: 20.02 }] },
  { id: '20010', client: 'María Fima', email: 'maria.fima@gmail.com', phone: '+58 412-1234567', date: '2023-05-21', total: 159.00, status: 'Pagado', items: 1, paymentMethod: 'Zelle', deliveryAddress: 'Av. Las Delicias, Edf. Coral, Apt 4B, Maracay', itemsList: [{ name: 'Caja de Lujo Premium Gold', qty: 1, price: 159.00 }] },
  { id: '20011', client: 'María Restan', email: 'm.restan@hotmail.com', phone: '+58 414-5551234', date: '2023-05-21', total: 247.00, status: 'Pagado', items: 4, paymentMethod: 'Pago Móvil', deliveryAddress: 'C.C. Paseo Las Delicias, Local 12', itemsList: [{ name: 'Caja Unicolor Negra', qty: 2, price: 89.99 }, { name: 'Caja Mini Sorpresa', qty: 2, price: 33.51 }] },
  { id: '20013', client: 'María Bosale', email: 'm.bosale@gmail.com', phone: '+58 416-3334455', date: '2023-05-23', total: 155.00, status: 'Pagado', items: 2, paymentMethod: 'Efectivo USD', deliveryAddress: 'San Jacinto, Sector 2, Casa #45', itemsList: [{ name: 'Caja Casita Ventana', qty: 2, price: 77.50 }] },
  { id: '20014', client: 'María Pastso', email: 'mpastso@gmail.com', phone: '+58 412-7778899', date: '2023-05-27', total: 180.00, status: 'Pagado', items: 2, paymentMethod: 'Pago Móvil', deliveryAddress: 'El Castaño, Calle Principal #8', itemsList: [{ name: 'Caja Amor Happy Day', qty: 2, price: 90.00 }] },
  { id: '20015', client: 'María Pastso', email: 'mpastso@gmail.com', phone: '+58 412-7778899', date: '2023-05-27', total: 180.00, status: 'En Preparación', items: 2, paymentMethod: 'Pago Móvil', deliveryAddress: 'El Castaño, Calle Principal #8', itemsList: [{ name: 'Caja Amor Happy Day', qty: 2, price: 90.00 }] },
  { id: '20017', client: 'Carlos Mendoza', email: 'carlos.m@gmail.com', phone: '+58 424-1112233', date: '2023-05-28', total: 320.00, status: 'Enviado', items: 5, paymentMethod: 'Zelle', deliveryAddress: 'Urb. Base Aragua, Edif. Los Pinos', itemsList: [{ name: 'Caja de Lujo Premium Gold', qty: 2, price: 89.99 }, { name: 'Set Portavasos x4', qty: 3, price: 46.67 }] },
];

export const defaultTransactions = [
  { id: '20001', date: '2023-03-27', client: 'Aanta Filma', reference: 'REF-981245', invoiceId: 'FAC-20001', status: 'Conciliado', amount: 189.00, method: 'Pago Móvil Banesco', bank: 'Banesco', notes: 'Validado en extracto bancario' },
  { id: '20002', date: '2023-03-18', client: 'Aanta Filma', reference: 'REF-332110', invoiceId: 'FAC-20002', status: 'Conciliado', amount: 200.00, method: 'Transferencia Mercantil', bank: 'Mercantil', notes: 'Conciliación automática exitosa' },
  { id: '20003', date: '2023-03-14', client: 'Maria Resilico', reference: 'REF-776412', invoiceId: 'FAC-20003', status: 'Conciliado', amount: 159.00, method: 'Zelle', bank: 'Chase', notes: 'Confirmado por administración' },
  { id: '20004', date: '2023-03-25', client: 'Danle Gonten', reference: 'REF-449018', invoiceId: 'FAC-20004', status: 'Conciliado', amount: 247.00, method: 'Pago Móvil BDV', bank: 'Venezuela', notes: 'Comprobante PDF verificado' },
  { id: '20005', date: '2023-05-21', client: 'Maria Filna', reference: 'REF-109283', invoiceId: 'FAC-20005', status: 'Pendiente de Conciliación', amount: 155.00, method: 'Pago Móvil Banesco', bank: 'Banesco', notes: 'Pendiente confirmar en banca' },
  { id: '20006', date: '2023-05-23', client: 'Maria Bosaleo', reference: 'REF-884712', invoiceId: 'FAC-20006', status: 'Pendiente de Conciliación', amount: 155.00, method: 'Transferencia Provincial', bank: 'BBVA', notes: 'Comprobante recibido por WhatsApp' },
  { id: '20007', date: '2023-05-27', client: 'Maria Pasaleo', reference: 'REF-551029', invoiceId: 'FAC-20007', status: 'Conciliado', amount: 180.00, method: 'Pago Móvil Banesco', bank: 'Banesco', notes: 'Conciliación rápida' },
];

export const defaultInvoices = [
  { id: 'FAC-20001', orderId: '20016', client: 'María Fima', idDoc: 'V-18.945.123', date: '2023-05-21', subtotal: 162.93, tax: 26.07, total: 189.00, status: 'Emitida', paymentMethod: 'Pago Móvil' },
  { id: 'FAC-20002', orderId: '20012', client: 'Alinta Alica', idDoc: 'V-20.114.882', date: '2023-05-21', subtotal: 172.41, tax: 27.59, total: 200.00, status: 'Emitida', paymentMethod: 'Transferencia Banesco' },
  { id: 'FAC-20003', orderId: '20010', client: 'María Fima', idDoc: 'V-18.945.123', date: '2023-05-21', subtotal: 137.07, tax: 21.93, total: 159.00, status: 'Emitida', paymentMethod: 'Zelle' },
  { id: 'FAC-20004', orderId: '20011', client: 'María Restan', idDoc: 'V-15.334.901', date: '2023-05-21', subtotal: 212.93, tax: 34.07, total: 247.00, status: 'Emitida', paymentMethod: 'Pago Móvil' },
  { id: 'FAC-20005', orderId: '20013', client: 'María Bosale', idDoc: 'V-22.781.045', date: '2023-05-23', subtotal: 133.62, tax: 21.38, total: 155.00, status: 'Emitida', paymentMethod: 'Efectivo USD' },
  { id: 'FAC-20006', orderId: '20014', client: 'María Pastso', idDoc: 'V-19.450.812', date: '2023-05-27', subtotal: 155.17, tax: 24.83, total: 180.00, status: 'Emitida', paymentMethod: 'Pago Móvil' },
];

export const defaultStock = [
  { sku: '580101', product: 'Caja Happy Day Corazón', quantity: 230, minStock: 25, alertType: 'normal', category: 'Empaques de lujo', price: 89.99, location: 'Pasillo A-01', reorderQty: 50 },
  { sku: '580102', product: 'Caja Casita con Ventana', quantity: 15, minStock: 20, alertType: 'warning', category: 'Microcorrugados', price: 89.99, location: 'Pasillo B-04', reorderQty: 40 },
  { sku: '581002', product: 'Caja de Lujo Premium Gold', quantity: 16, minStock: 20, alertType: 'danger', category: 'Microcorrugados', price: 89.99, location: 'Pasillo A-03', reorderQty: 30 },
  { sku: '381003', product: 'Portavasos Múltiple Ecológico', quantity: 10, minStock: 15, alertType: 'danger', category: 'Portavasos', price: 89.99, location: 'Pasillo C-02', reorderQty: 60 },
  { sku: '580104', product: 'Caja Corazón Romántica', quantity: 230, minStock: 30, alertType: 'normal', category: 'Detalles', price: 89.99, location: 'Pasillo A-02', reorderQty: 50 },
  { sku: '581005', product: 'Caja Casita Ventana Transparente', quantity: 15, minStock: 25, alertType: 'warning', category: 'Detalles', price: 89.99, location: 'Pasillo B-02', reorderQty: 40 },
  { sku: '381006', product: 'Caja Unicolor Negra Elegante', quantity: 16, minStock: 20, alertType: 'danger', category: 'Unicolor', price: 89.99, location: 'Pasillo D-01', reorderQty: 40 },
  { sku: '381007', product: 'Caja Mini Sorpresa Cumpleaños', quantity: 10, minStock: 20, alertType: 'danger', category: 'Detalles', price: 89.99, location: 'Pasillo D-02', reorderQty: 50 },
];

export const defaultReviews = [
  { id: 1, author: 'Anónimo (anonimizado)', comment: 'Encontra feedback conmeontacia sos colieñeros. La calidad de las cajas para eventos superó mis expectativas.', rating: 5, date: 'Hoy' },
  { id: 2, author: 'Anónimo (anonimizado)', comment: 'Desgun antador para podeador los queconcejunamos. La entrega fue rapidísima y el empaque muy seguro.', rating: 5, date: 'Ayer' },
  { id: 3, author: 'Anónimo (anonimizado)', comment: 'Ne mas mas officerxs algunos. Muy buena atención y personalización en los arreglos.', rating: 4, date: 'Hace 2 días' },
  { id: 4, author: 'Anónimo (anonimizado)', comment: 'No realizan aconos apencias seclientes. Variedad inmejorable en cajas de microcorrugado.', rating: 5, date: 'Hace 3 días' },
];

export const defaultLandingConfig = {
  heroTitle: 'Tu Cajita: Empaques y Diseños que Enamoran',
  heroSubtitle: 'Diseñamos y fabricamos cajas personalizadas, empaques de lujo y arreglos creativos para cada ocasión especial.',
  whatsappNumber: '584120177993',
  announcementText: '✨ ¡Envíos a toda Venezuela! Descuentos especiales para pedidos corporativos y eventos.',
  showAnnouncement: true,
  featuredCategories: ['especial', 'microcorrugados', 'unicolor', 'portavasos'],
};

// --- CRUD HELPER SERVICES ---

// AUTH & PROFILES
export async function syncUserProfile(user, additionalData = {}) {
  if (!user && !additionalData.email && !additionalData.correo) return null;
  
  const userId = user?.id || additionalData.id || `usr_${Date.now()}`;
  const userEmail = user?.email || additionalData.correo || additionalData.email || '';
  const userRole = additionalData.rol || additionalData.role || (userEmail.toLowerCase().includes('admin') ? 'Administrador' : 'Cliente');
  const normalizedRole = (userRole.toLowerCase() === 'admin' || userRole.toLowerCase() === 'administrador') ? 'Administrador' : 'Cliente';

  const profile = {
    id: userId,
    nombre: additionalData.nombre || additionalData.name || user?.user_metadata?.full_name || userEmail.split('@')[0] || 'Cliente',
    correo: userEmail,
    rol: normalizedRole,
    telefono: additionalData.telefono || additionalData.phone || user?.user_metadata?.phone || '',
    direccion: additionalData.direccion || additionalData.address || user?.user_metadata?.address || '',
    cedula: additionalData.cedula || user?.user_metadata?.cedula || '',
  };

  // Cache in localStorage
  try {
    const clients = JSON.parse(localStorage.getItem('tucajita_clients') || '[]');
    const existingIdx = clients.findIndex((c) => (c.correo && c.correo === profile.correo) || (c.id && c.id === profile.id));
    if (existingIdx > -1) {
      clients[existingIdx] = { ...clients[existingIdx], ...profile };
    } else {
      clients.push(profile);
    }
    localStorage.setItem('tucajita_clients', JSON.stringify(clients));
  } catch (e) {
    console.warn('Error caching client:', e);
  }

  if (!supabase) return profile;

  try {
    // 1. Guardar en tabla public.usuario
    const usuarioPayload = {
      id: profile.id,
      nombre: profile.nombre,
      direccion: profile.direccion,
      telefono: profile.telefono,
      correo: profile.correo,
      cedula: profile.cedula,
      rol: profile.rol,
    };

    const { data, error: userError } = await supabase
      .from('usuario')
      .upsert(usuarioPayload, { onConflict: 'id' })
      .select()
      .single();

    // 2. Si es cliente, registrar en tabla public.cliente
    let clientError = null;
    if (profile.rol === 'Cliente') {
      const { error } = await supabase
        .from('cliente')
        .upsert({
          usuario_id: profile.id,
          fecha_registro: new Date().toISOString().split('T')[0],
        }, { onConflict: 'usuario_id' });
      clientError = error;
    }

    // 3. Fallback a tabla public.profiles si la tabla usuario tiene restricciones RLS o error de esquema
    if (userError || clientError) {
      console.warn('Fallback sync to profiles due to:', userError || clientError);
      await supabase.from('profiles').upsert({
        id: profile.id,
        email: profile.correo,
        full_name: profile.nombre,
        phone: profile.telefono,
        address: profile.direccion,
        cedula: profile.cedula,
        role: profile.rol.toLowerCase(),
      }, { onConflict: 'id' });
    }

    return data || profile;
  } catch (err) {
    console.warn('Error syncUserProfile:', err);
    // Intento de fallback secundario a profiles
    try {
      await supabase?.from('profiles').upsert({
        id: profile.id,
        email: profile.correo,
        full_name: profile.nombre,
        role: profile.rol.toLowerCase(),
      }, { onConflict: 'id' });
    } catch {
      // Silently continue
    }
    return profile;
  }
}

// OBTENER CLIENTES REGISTRADOS
export async function getClients() {
  let localClients = [];
  try {
    const saved = localStorage.getItem('tucajita_clients');
    if (saved) localClients = JSON.parse(saved);
  } catch (e) {
    console.warn('Error reading local clients:', e);
  }

  if (!supabase) return localClients;

  try {
    // 1. Intentar desde public.usuario
    const { data: usuarios, error } = await supabase
      .from('usuario')
      .select('*')
      .eq('rol', 'Cliente')
      .order('created_at', { ascending: false });

    if (!error && usuarios && usuarios.length > 0) {
      localStorage.setItem('tucajita_clients', JSON.stringify(usuarios));
      return usuarios;
    }

    // 2. Fallback a tabla profiles
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'cliente');

    if (profiles && profiles.length > 0) {
      const mapped = profiles.map((p) => ({
        id: p.id,
        nombre: p.full_name || p.nombre || 'Cliente',
        correo: p.email || p.correo || '',
        telefono: p.phone || p.telefono || '',
        direccion: p.address || p.direccion || '',
        cedula: p.cedula || '',
        rol: 'Cliente',
      }));
      return mapped;
    }

    return localClients;
  } catch (err) {
    console.warn('Error getClients:', err);
    return localClients;
  }
}

// PRODUCTS CRUD
export async function getProducts() {
  // Load from local storage cache if available
  let localProducts = [];
  try {
    const saved = localStorage.getItem('tucajita_products');
    if (saved) {
      localProducts = JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Error reading local products:', e);
  }

  // Si no hay productos en local, inicializar con defaultProducts
  if (!localProducts || localProducts.length === 0) {
    localProducts = [...defaultProducts];
    try {
      localStorage.setItem('tucajita_products', JSON.stringify(localProducts));
    } catch {
      // ignore
    }
  }

  if (!supabase) {
    return localProducts;
  }

  try {
    let { data, error } = await supabase.from('producto').select('*, categoria(nombre)').order('id', { ascending: true });
    if (error || !data || data.length === 0) {
      const res = await supabase.from('products').select('*').order('id', { ascending: true });
      if (res.data && res.data.length > 0) {
        data = res.data;
      }
    }

    if (!data || data.length === 0) {
      return localProducts;
    }

    // 1. Mapear los productos que vienen de Supabase enriqueciéndolos con los datos locales
    const supabaseMapped = data.map((p, idx) => {
      const cached = localProducts.find((c) => c.id === p.id || c.ref === p.ref);
      return {
        id: p.id,
        name: p.nombre || p.name || cached?.name || `Producto #${p.id}`,
        price: Number(p.precio_unitario || p.price || cached?.price || 0),
        category: p.categoria?.nombre || p.category || cached?.category || 'especial',
        categoryName: p.categoria?.nombre || p.category_name || cached?.categoryName || 'Empaques de Lujo',
        stock: p.stock_actual ?? p.stock ?? cached?.stock ?? 50,
        description: p.descripcion || p.description || cached?.description || '',
        image: cached?.image || p.image || p.imagen_url || defaultProducts[idx % defaultProducts.length]?.image || defaultProducts[0]?.image,
        featured: cached?.featured !== undefined ? Boolean(cached.featured) : (p.featured ?? true),
        forYou: cached?.forYou !== undefined ? Boolean(cached.forYou) : (p.for_you ?? true),
        type: cached?.type || p.type || 'cajas',
        ref: p.ref || cached?.ref || `TC-${p.id}`,
        medidas: p.medidas || cached?.medidas || '20x20x10 cm',
        estatus: p.estatus || cached?.estatus || 'Activo',
      };
    });

    // 2. IMPORTANTE: Preservar todos los productos creados localmente que no están en Supabase
    const customLocalProducts = localProducts.filter(
      (lp) => !supabaseMapped.some((sp) => sp.id === lp.id || (lp.ref && sp.ref === lp.ref))
    );

    // Combinar la lista completa: productos locales personalizados primero, luego los de supabase
    const combined = [...customLocalProducts, ...supabaseMapped];

    // Cachear la lista fusionada completa en localStorage
    try {
      localStorage.setItem('tucajita_products', JSON.stringify(combined));
    } catch {
      // ignore
    }

    return combined;
  } catch (err) {
    console.warn('Error fetching products from Supabase, using local fallback:', err);
    return localProducts;
  }
}

export async function saveProduct(product) {
  // Save to localStorage
  let updated = [];
  try {
    const prods = await getProducts();
    const existingIndex = prods.findIndex((p) => p.id === product.id);
    if (existingIndex > -1) {
      updated = [...prods];
      updated[existingIndex] = { ...updated[existingIndex], ...product };
    } else {
      updated = [product, ...prods];
    }
    localStorage.setItem('tucajita_products', JSON.stringify(updated));

    // Broadcast live event for real-time reactivity in all open views
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('tucajita_products_updated', { detail: updated }));
    }
  } catch (e) {
    console.warn('Error saving local product:', e);
  }

  if (!supabase) return product;
  try {
    const payload = {
      id: typeof product.id === 'number' ? product.id : Date.now(),
      ref: product.ref || `TC-${product.id}`,
      nombre: product.name,
      precio_unitario: product.price,
      descripcion: product.description,
      stock_actual: product.stock,
      medidas: product.medidas || '20x20x10 cm',
      estatus: product.estatus || 'Activo',
    };
    const { data } = await supabase.from('producto').upsert(payload, { onConflict: 'id' }).select().single();
    
    // Sincronizar también con inventario
    await supabase.from('inventario').upsert({
      producto_id: payload.id,
      stock_minimo: 10,
    }, { onConflict: 'producto_id' });

    return { ...product, ...data };
  } catch (err) {
    console.warn('Error saving to Supabase:', err);
    return product;
  }
}

export async function deleteProduct(productId) {
  try {
    const prods = await getProducts();
    const filtered = prods.filter((p) => p.id !== productId);
    localStorage.setItem('tucajita_products', JSON.stringify(filtered));

    // Broadcast live event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('tucajita_products_updated', { detail: filtered }));
    }
  } catch (e) {
    console.warn('Error deleting local product:', e);
  }

  if (!supabase) return true;
  try {
    await supabase.from('inventario').delete().eq('producto_id', productId);
    await supabase.from('producto').delete().eq('id', productId);
    await supabase.from('products').delete().eq('id', productId);
    return true;
  } catch {
    return true;
  }
}

// ORDERS CRUD
export async function getOrders() {
  let localOrders = null;
  try {
    const saved = localStorage.getItem('tucajita_orders');
    if (saved) {
      localOrders = JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Error reading local orders:', e);
  }

  if (!supabase) return localOrders || defaultOrders;
  try {
    let { data, error } = await supabase.from('solicitud').select('*, usuario(nombre, correo, telefono, direccion)').order('id', { ascending: false });
    if (error || !data || data.length === 0) {
      const res = await supabase.from('orders').select('*').order('id', { ascending: false });
      data = res.data;
    }
    if (!data || data.length === 0) return localOrders || defaultOrders;

    const mapped = data.map((s) => ({
      id: String(s.id),
      client: s.usuario?.nombre || s.client || 'Cliente Tu Cajita',
      email: s.usuario?.correo || s.email || 'cliente@tucajita.com',
      phone: s.usuario?.telefono || s.phone || '+58 412-0000000',
      deliveryAddress: s.usuario?.direccion || s.deliveryAddress || 'Dirección de Entrega',
      date: s.fecha ? new Date(s.fecha).toLocaleDateString('es-ES') : s.date || '2023-05-21',
      total: Number(s.total || 0),
      status: s.estatus || s.status || 'Pendiente',
      items: s.items || 1,
      paymentMethod: s.metodo_pago || s.paymentMethod || 'Pago Móvil',
      itemsList: s.itemsList || [{ name: 'Empaque Tu Cajita', qty: 1, price: Number(s.total || 0) }]
    }));

    localStorage.setItem('tucajita_orders', JSON.stringify(mapped));
    return mapped;
  } catch {
    return localOrders || defaultOrders;
  }
}

export async function saveOrder(order) {
  try {
    const ords = await getOrders();
    const existingIdx = ords.findIndex((o) => o.id === order.id);
    let updatedOrders;
    if (existingIdx > -1) {
      updatedOrders = [...ords];
      updatedOrders[existingIdx] = { ...updatedOrders[existingIdx], ...order };
    } else {
      updatedOrders = [order, ...ords];
    }
    localStorage.setItem('tucajita_orders', JSON.stringify(updatedOrders));

    // 1. Crear / sincronizar Factura Digital en tiempo real
    const invId = order.invoiceNumber ? `FAC-${order.invoiceNumber}` : `FAC-${order.id}`;
    const newInvoice = {
      id: invId,
      orderId: String(order.id),
      client: order.client || 'Cliente Tu Cajita',
      idDoc: order.idDoc || 'V-12.345.678',
      date: order.date || new Date().toISOString().split('T')[0],
      subtotal: Number(order.total || 0),
      tax: 0,
      total: Number(order.total || 0),
      status: 'Emitida',
      paymentMethod: order.paymentMethod || 'Pago Móvil',
      reference: order.ref || `#${order.id}`,
      itemsList: order.itemsList || [],
      deliveryAddress: order.deliveryAddress,
      deliveryType: order.deliveryType,
    };

    const currentInvoices = await getInvoices();
    const invIdx = currentInvoices.findIndex((i) => i.id === newInvoice.id || i.orderId === newInvoice.orderId);
    let updatedInvoices;
    if (invIdx > -1) {
      updatedInvoices = [...currentInvoices];
      updatedInvoices[invIdx] = { ...updatedInvoices[invIdx], ...newInvoice };
    } else {
      updatedInvoices = [newInvoice, ...currentInvoices];
    }
    localStorage.setItem('tucajita_invoices', JSON.stringify(updatedInvoices));

    // 2. Crear / sincronizar Transacción de Pago en tiempo real
    const newTransaction = {
      id: `TRX-${order.id}`,
      date: order.date || new Date().toISOString().split('T')[0],
      client: order.client || 'Cliente Tu Cajita',
      reference: order.ref || `#${order.id}`,
      invoiceId: invId,
      status: 'Conciliado',
      amount: Number(order.total || 0),
      method: order.paymentMethod || 'Zelle',
      bank: order.paymentMethod === 'Bolívares por pago móvil' ? 'Banesco' : order.paymentMethod,
      notes: `Pago verificado para pedido #${order.id}`,
    };

    const currentTransactions = await getTransactions();
    const trxIdx = currentTransactions.findIndex((t) => t.id === newTransaction.id || t.invoiceId === newTransaction.invoiceId);
    let updatedTransactions;
    if (trxIdx > -1) {
      updatedTransactions = [...currentTransactions];
      updatedTransactions[trxIdx] = { ...updatedTransactions[trxIdx], ...newTransaction };
    } else {
      updatedTransactions = [newTransaction, ...currentTransactions];
    }
    localStorage.setItem('tucajita_transactions', JSON.stringify(updatedTransactions));

    // 3. Descontar Stock / Inventario automáticamente si hay items
    if (Array.isArray(order.itemsList) && order.itemsList.length > 0) {
      const currentStock = await getStockData();
      const updatedStock = currentStock.map((s) => {
        const matchingItem = order.itemsList.find((i) => i.name && (s.product.toLowerCase().includes(i.name.toLowerCase()) || i.name.toLowerCase().includes(s.product.toLowerCase())));
        if (matchingItem) {
          const qty = matchingItem.quantity || matchingItem.qty || 1;
          const newQty = Math.max(0, s.quantity - qty);
          const alertType = newQty <= s.minStock ? 'danger' : newQty <= s.minStock + 10 ? 'warning' : 'normal';
          return { ...s, quantity: newQty, alertType };
        }
        return s;
      });
      localStorage.setItem('tucajita_stock', JSON.stringify(updatedStock));

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('tucajita_stock_updated', { detail: updatedStock }));
      }
    }

    // 4. Emitir eventos en vivo para que el Admin Dashboard y la tienda se actualicen al instante
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('tucajita_orders_updated', { detail: updatedOrders }));
      window.dispatchEvent(new CustomEvent('tucajita_invoices_updated', { detail: updatedInvoices }));
      window.dispatchEvent(new CustomEvent('tucajita_transactions_updated', { detail: updatedTransactions }));
    }
  } catch (e) {
    console.warn('Error saving local order with real-time sync:', e);
  }

  if (!supabase) return order;
  try {
    const numId = parseInt(order.id);
    const payload = {
      id: isNaN(numId) ? Date.now() : numId,
      estatus: order.status,
      total: order.total,
      fecha: order.date || new Date().toISOString().split('T')[0]
    };
    await supabase.from('solicitud').upsert(payload);
    return order;
  } catch {
    return order;
  }
}

// CREATE ORDER FROM SHOPPING CART CHECKOUT
export async function createOrderFromCart(cartItems, customerInfo, paymentInfo) {
  const orderId = (20000 + Math.floor(Math.random() * 9000)).toString();
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const newOrder = {
    id: orderId,
    client: customerInfo.name || 'Cliente Tu Cajita',
    email: customerInfo.email || 'cliente@tucajita.com',
    phone: customerInfo.phone || '+58 412-0000000',
    deliveryAddress: customerInfo.address || 'San Cristóbal / Táchira',
    date: new Date().toISOString().split('T')[0],
    total: Number(total.toFixed(2)),
    status: 'Pendiente',
    items: cartItems.reduce((acc, item) => acc + item.quantity, 0),
    paymentMethod: paymentInfo.method || 'Pago Móvil',
    ref: paymentInfo.reference || `#${orderId}`,
    itemsList: cartItems.map((item) => ({
      id: item.id,
      name: item.name,
      qty: item.quantity,
      price: item.price,
      image: item.image,
    })),
  };

  return await saveOrder(newOrder);
}

export async function deleteOrder(orderId) {
  try {
    const ords = await getOrders();
    const filtered = ords.filter((o) => o.id !== orderId);
    localStorage.setItem('tucajita_orders', JSON.stringify(filtered));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('tucajita_orders_updated', { detail: filtered }));
    }
  } catch (e) {
    console.warn('Error deleting local order:', e);
  }

  if (!supabase) return true;
  try {
    await supabase.from('solicitud').delete().eq('id', parseInt(orderId));
    await supabase.from('orders').delete().eq('id', orderId);
    return true;
  } catch {
    return true;
  }
}

export async function updateOrderStatus(orderId, newStatus) {
  try {
    const ords = await getOrders();
    const updated = ords.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    localStorage.setItem('tucajita_orders', JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('tucajita_orders_updated', { detail: updated }));
    }
  } catch (e) {
    console.warn('Error updating status locally:', e);
  }

  if (!supabase) return true;
  try {
    await supabase.from('solicitud').update({ estatus: newStatus }).eq('id', parseInt(orderId));
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    return true;
  } catch {
    return true;
  }
}

// TRANSACTIONS CRUD
export async function getTransactions() {
  try {
    const saved = localStorage.getItem('tucajita_transactions');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Error reading local transactions:', e);
  }

  if (!supabase) return defaultTransactions;
  try {
    let { data, error } = await supabase.from('factura').select('*').order('id', { ascending: false });
    if (error || !data || data.length === 0) {
      const res = await supabase.from('transactions').select('*');
      data = res.data;
    }
    if (!data || data.length === 0) return defaultTransactions;

    return data.map((f) => ({
      id: String(f.id),
      date: f.fecha ? new Date(f.fecha).toLocaleDateString('es-ES') : f.date,
      client: f.client || 'Cliente Conciliado',
      reference: f.reference || `REF-${f.id}981`,
      invoiceId: f.invoice_id || `FAC-${f.id}`,
      status: f.status || 'Conciliado',
      amount: Number(f.total || f.amount || 0),
      method: f.metodo_pago || f.method || 'Pago Móvil',
      bank: f.bank || 'Banesco',
      notes: f.notes || 'Conciliación registrada'
    }));
  } catch {
    return defaultTransactions;
  }
}

export async function saveTransaction(t) {
  try {
    const trans = await getTransactions();
    const updated = [t, ...trans];
    localStorage.setItem('tucajita_transactions', JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('tucajita_transactions_updated', { detail: updated }));
    }
  } catch (e) {
    console.warn('Error saving transaction:', e);
  }
  return t;
}

export async function deleteTransaction(id) {
  try {
    const trans = await getTransactions();
    const updated = trans.filter((t) => t.id !== id);
    localStorage.setItem('tucajita_transactions', JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('tucajita_transactions_updated', { detail: updated }));
    }
  } catch (e) {
    console.warn('Error deleting transaction:', e);
  }
  return true;
}

export async function getInvoices() {
  try {
    const saved = localStorage.getItem('tucajita_invoices');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Error reading local invoices:', e);
  }
  return defaultInvoices;
}

export async function saveInvoice(inv) {
  try {
    const invs = await getInvoices();
    const updated = [inv, ...invs];
    localStorage.setItem('tucajita_invoices', JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('tucajita_invoices_updated', { detail: updated }));
    }
  } catch (e) {
    console.warn('Error saving invoice:', e);
  }
  return inv;
}

// INVENTORY
export async function getStockData() {
  try {
    const saved = localStorage.getItem('tucajita_stock');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Error reading local stock:', e);
  }
  return defaultStock;
}

export async function getReviews() {
  return defaultReviews;
}

// PASSWORD RESET FUNCTION
export async function updateUserPassword(email, newPassword) {
  const cleanEmail = email.trim().toLowerCase();

  // 1. Actualizar en cache local de clientes
  try {
    const clients = JSON.parse(localStorage.getItem('tucajita_clients') || '[]');
    const idx = clients.findIndex((c) => (c.correo && c.correo.toLowerCase() === cleanEmail) || (c.email && c.email.toLowerCase() === cleanEmail));
    if (idx > -1) {
      clients[idx].password = newPassword;
      localStorage.setItem('tucajita_clients', JSON.stringify(clients));
    } else {
      clients.push({
        id: `usr_${Date.now()}`,
        correo: cleanEmail,
        email: cleanEmail,
        nombre: cleanEmail.split('@')[0],
        password: newPassword,
        rol: 'Cliente'
      });
      localStorage.setItem('tucajita_clients', JSON.stringify(clients));
    }
  } catch (e) {
    console.warn('Error saving local client password:', e);
  }

  // 2. Actualizar en Supabase si está disponible
  if (supabase) {
    try {
      await supabase.from('usuario').update({ password: newPassword }).ilike('correo', cleanEmail);
      await supabase.auth.updateUser({ password: newPassword }).catch(() => {});
    } catch (err) {
      console.warn('Error updating password in Supabase:', err);
    }
  }

  return true;
}
