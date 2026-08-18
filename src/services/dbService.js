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
  whatsappNumber: '584247465717',
  announcementText: '✨ ¡Envíos a toda Venezuela! Descuentos especiales para pedidos corporativos y eventos.',
  showAnnouncement: true,
  featuredCategories: ['especial', 'microcorrugados', 'unicolor', 'portavasos'],
};

// --- CRUD HELPER SERVICES ---

// AUTH & PROFILES
export async function syncUserProfile(user, additionalData = {}) {
  if (!supabase || !user) return null;
  try {
    const profile = {
      id: user.id,
      nombre: user.user_metadata?.full_name || additionalData.name || 'Usuario',
      correo: user.email,
      rol: additionalData.role || (user.email === 'admin@tucajita.com' ? 'Administrador' : 'Cliente'),
      telefono: additionalData.phone || '',
      direccion: additionalData.address || '',
    };

    let { data, error } = await supabase.from('usuario').upsert(profile, { onConflict: 'id' }).select().single();
    if (error) {
      await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email,
        full_name: profile.nombre,
        role: profile.rol.toLowerCase(),
      }, { onConflict: 'id' });
    }
    return data || profile;
  } catch (err) {
    console.warn('Error syncUserProfile:', err);
    return null;
  }
}

// PRODUCTS CRUD
export async function getProducts() {
  if (!supabase) return defaultProducts;
  try {
    let { data, error } = await supabase.from('producto').select('*, categoria(nombre)').order('id', { ascending: true });
    if (error || !data || data.length === 0) {
      const res = await supabase.from('products').select('*').order('id', { ascending: true });
      data = res.data;
    }
    if (!data || data.length === 0) return defaultProducts;

    return data.map((p) => ({
      id: p.id,
      name: p.nombre || p.name || `Producto #${p.id}`,
      price: Number(p.precio_unitario || p.price || 0),
      category: p.categoria?.nombre || p.category || 'especial',
      categoryName: p.categoria?.nombre || p.category_name || 'Empaques de lujo',
      stock: p.stock_actual ?? p.stock ?? 50,
      description: p.descripcion || p.description || '',
      image: p.image || defaultProducts[0]?.image,
      featured: p.featured ?? true,
      forYou: p.for_you ?? true,
      ref: p.ref || `TC-00${p.id}`,
      medidas: p.medidas || '20x20x10 cm',
      estatus: p.estatus || 'Activo'
    }));
  } catch {
    return defaultProducts;
  }
}

export async function saveProduct(product) {
  if (!supabase) return product;
  try {
    const payload = {
      id: product.id,
      ref: product.ref || `TC-00${product.id}`,
      nombre: product.name,
      precio_unitario: product.price,
      descripcion: product.description,
      stock_actual: product.stock,
      medidas: product.medidas || '20x20x10 cm',
      estatus: product.estatus || 'Activo',
    };
    const { data } = await supabase.from('producto').upsert(payload).select().single();
    return data || product;
  } catch {
    return product;
  }
}

export async function deleteProduct(productId) {
  if (!supabase) return true;
  try {
    await supabase.from('producto').delete().eq('id', productId);
    await supabase.from('products').delete().eq('id', productId);
    return true;
  } catch {
    return true;
  }
}

// ORDERS CRUD
export async function getOrders() {
  if (!supabase) return defaultOrders;
  try {
    let { data, error } = await supabase.from('solicitud').select('*, usuario(nombre, correo, telefono, direccion)').order('id', { ascending: false });
    if (error || !data || data.length === 0) {
      const res = await supabase.from('orders').select('*').order('id', { ascending: false });
      data = res.data;
    }
    if (!data || data.length === 0) return defaultOrders;

    return data.map((s) => ({
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
  } catch {
    return defaultOrders;
  }
}

export async function saveOrder(order) {
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

export async function deleteOrder(orderId) {
  if (!supabase) return true;
  try {
    const numId = parseInt(orderId);
    await supabase.from('solicitud').delete().eq('id', isNaN(numId) ? orderId : numId);
    await supabase.from('orders').delete().eq('id', orderId);
    return true;
  } catch {
    return true;
  }
}

export async function updateOrderStatus(orderId, newStatus) {
  if (!supabase) return true;
  try {
    const numId = parseInt(orderId);
    await supabase.from('solicitud').update({ estatus: newStatus }).eq('id', isNaN(numId) ? orderId : numId);
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    return true;
  } catch {
    return true;
  }
}

// TRANSACTIONS & INVOICES
export async function getTransactions() {
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
  return t;
}

export async function deleteTransaction(id) {
  return true;
}

export async function getInvoices() {
  return defaultInvoices;
}

// INVENTORY
export async function getStockData() {
  return defaultStock;
}

export async function getReviews() {
  return defaultReviews;
}
