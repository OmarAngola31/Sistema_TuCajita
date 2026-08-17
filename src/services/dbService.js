import { supabase } from '../supabaseClient';
import { productsData as defaultProducts } from '../data/productsData';

// Initial mock orders matching the design
const defaultOrders = [
  { id: '20016', client: 'María Fima', date: '21/05/2023', total: 189.00, status: 'Pendiente', items: 2 },
  { id: '20012', client: 'Alinta Alica', date: '21/05/2023', total: 200.00, status: 'Pendiente', items: 3 },
  { id: '20010', client: 'María Fima', date: '21/05/2023', total: 159.00, status: 'Pagado', items: 1 },
  { id: '20011', client: 'María Restan', date: '21/05/2023', total: 247.00, status: 'Pagado', items: 4 },
  { id: '20012', client: 'María Restáan', date: '23/05/2023', total: 155.00, status: 'Pagado', items: 2 },
  { id: '20013', client: 'María Bosale', date: '23/05/2023', total: 155.00, status: 'Pagado', items: 2 },
  { id: '20014', client: 'María Pastso', date: '27/05/2023', total: 180.00, status: 'Pagado', items: 2 },
  { id: '20015', client: 'María Pastso', date: '27/05/2023', total: 180.00, status: 'Pagado', items: 2 },
];

const defaultTransactions = [
  { id: '20001', date: '27/03/2023', client: 'Aanta Filma', invoiceId: 'FAC-20001', status: 'Estado de Conciliación', amount: 189.00 },
  { id: '20002', date: '18/03/2023', client: 'Aanta Filma', invoiceId: 'FAC-20002', status: 'Estado de Conciliación', amount: 200.00 },
  { id: '20003', date: '14/03/2023', client: 'Maria Resilico', invoiceId: 'FAC-20003', status: 'Estado de Conciliación', amount: 159.00 },
  { id: '20004', date: '25/03/2023', client: 'Danle Gonten', invoiceId: 'FAC-20004', status: 'Estado de Conciliación', amount: 247.00 },
  { id: '20005', date: '21/05/2023', client: 'Maria Filna', invoiceId: 'FAC-20005', status: 'Estado de Conciliación', amount: 155.00 },
  { id: '20005', date: '23/05/2023', client: 'Maria Bosaleo', invoiceId: 'FAC-20005-B', status: 'Estado de Conciliación', amount: 155.00 },
  { id: '20006', date: '23/05/2023', client: 'Maria Pasaleo', invoiceId: 'FAC-20006', status: 'Estado de Conciliación', amount: 180.00 },
  { id: '20006', date: '27/05/2023', client: 'Maria Pastso', invoiceId: 'FAC-20006-B', status: 'Estado de Conciliación', amount: 180.00 },
];

const defaultStock = [
  { sku: '580101', product: 'Caja Happy Day Corazón', quantity: 230, alertType: 'normal', category: 'Empaques de lujo' },
  { sku: '580102', product: 'Caja Casita con Ventana', quantity: 15, alertType: 'warning', category: 'Microcorrugados' },
  { sku: '581002', product: 'Caja de Lujo Premium Gold', quantity: 16, alertType: 'danger', category: 'Microcorrugados' },
  { sku: '381003', product: 'Portavasos Múltiple', quantity: 10, alertType: 'normal', category: 'Portavasos' },
  { sku: '580101', product: 'Caja Corazón Romántica', quantity: 230, alertType: 'normal', category: 'Detalles' },
  { sku: '581002', product: 'Caja Casita Ventana', quantity: 15, alertType: 'warning', category: 'Detalles' },
  { sku: '381003', product: 'Caja Unicolor Negra', quantity: 16, alertType: 'danger', category: 'Unicolor' },
  { sku: '381003', product: 'Caja Mini Sorpresa', quantity: 10, alertType: 'normal', category: 'Detalles' },
];

const defaultReviews = [
  { id: 1, author: 'Anónimo (anonimizado)', comment: 'Encontra feedback conmeontacia sos colieñeros. La calidad de las cajas para eventos superó mis expectativas.', rating: 5, date: 'Hoy' },
  { id: 2, author: 'Anónimo (anonimizado)', comment: 'Desgun antador para podeador los queconcejunamos. La entrega fue rapidísima y el empaque muy seguro.', rating: 5, date: 'Ayer' },
  { id: 3, author: 'Anónimo (anonimizado)', comment: 'Ne mas mas officerxs algunos. Muy buena atención y personalización en los arreglos.', rating: 4, date: 'Hace 2 días' },
  { id: 4, author: 'Anónimo (anonimizado)', comment: 'No realizan aconos apencias seclientes. Variedad inmejorable en cajas de microcorrugado.', rating: 5, date: 'Hace 3 días' },
];

// --- AUTH & PROFILES / USUARIOS ---
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

    // Try `usuario` table first, fallback to `profiles`
    let { data, error } = await supabase.from('usuario').upsert(profile, { onConflict: 'id' }).select().single();

    if (error) {
      // Fallback
      await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email,
        full_name: profile.nombre,
        role: profile.rol.toLowerCase(),
      }, { onConflict: 'id' });
    }

    return data || profile;
  } catch (err) {
    console.warn('Error sincronizando usuario:', err);
    return null;
  }
}

// --- PRODUCTS / PRODUCTO ---
export async function getProducts() {
  if (!supabase) return defaultProducts;
  try {
    // Check `producto` (diagram name) first
    let { data, error } = await supabase.from('producto').select('*, categoria(nombre)').order('id', { ascending: true });
    
    if (error || !data || data.length === 0) {
      // Try `products`
      const res = await supabase.from('products').select('*').order('id', { ascending: true });
      data = res.data;
      error = res.error;
    }

    if (error || !data || data.length === 0) {
      return defaultProducts;
    }

    // Normalize format
    return data.map((p) => ({
      id: p.id,
      name: p.nombre || p.name || `Producto #${p.id}`,
      price: Number(p.precio_unitario || p.price || 0),
      category: p.categoria?.nombre || p.category || 'General',
      categoryName: p.categoria?.nombre || p.category_name || 'General',
      stock: p.stock_actual ?? p.stock ?? 50,
      description: p.descripcion || p.description || '',
      image: p.image || defaultProducts[0]?.image,
      featured: p.featured ?? true,
      forYou: p.for_you ?? true,
    }));
  } catch (err) {
    console.warn('Usando catálogo local:', err);
    return defaultProducts;
  }
}

export async function saveProduct(product) {
  if (!supabase) return product;
  try {
    const payload = {
      id: product.id,
      nombre: product.name,
      precio_unitario: product.price,
      descripcion: product.description,
      stock_actual: product.stock,
      estatus: 'Activo',
    };

    const { data, error } = await supabase.from('producto').upsert(payload).select().single();
    if (error) {
      await supabase.from('products').upsert({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        stock: product.stock,
        category: product.category,
      });
    }
    return data || product;
  } catch (err) {
    console.warn('Guardando localmente:', err.message);
    return product;
  }
}

// --- ORDERS / SOLICITUD ---
export async function getOrders() {
  if (!supabase) return defaultOrders;
  try {
    let { data, error } = await supabase.from('solicitud').select('*, usuario(nombre)').order('id', { ascending: false });
    
    if (error || !data || data.length === 0) {
      const res = await supabase.from('orders').select('*').order('id', { ascending: false });
      data = res.data;
      error = res.error;
    }

    if (error || !data || data.length === 0) {
      return defaultOrders;
    }

    return data.map((s) => ({
      id: String(s.id),
      client: s.usuario?.nombre || s.client || 'Cliente Tu Cajita',
      date: s.fecha ? new Date(s.fecha).toLocaleDateString('es-ES') : s.date || '2023-05-21',
      total: Number(s.total || 0),
      status: s.estatus || s.status || 'Pendiente',
      items: s.items || 1,
    }));
  } catch (err) {
    return defaultOrders;
  }
}

export async function updateOrderStatus(orderId, newStatus) {
  if (!supabase) return true;
  try {
    const numId = parseInt(orderId);
    let { error } = await supabase.from('solicitud').update({ estatus: newStatus }).eq('id', isNaN(numId) ? orderId : numId);
    if (error) {
      await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    }
    return true;
  } catch (err) {
    console.warn('Error actualizando estado:', err.message);
    return true;
  }
}

// --- TRANSACTIONS / FACTURA ---
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
      invoiceId: f.invoice_id || `FAC-${f.id}`,
      status: 'Estado de Conciliación',
      amount: Number(f.total || f.amount || 0),
    }));
  } catch {
    return defaultTransactions;
  }
}

// --- STOCK & REVIEWS ---
export async function getStockData() {
  if (!supabase) return defaultStock;
  try {
    let { data, error } = await supabase.from('inventario').select('*, producto(nombre, stock_actual, ref)');
    if (!error && data && data.length > 0) {
      return data.map((inv) => ({
        sku: inv.producto?.ref || `SKU-${inv.id}`,
        product: inv.producto?.nombre || `Producto #${inv.producto_id}`,
        quantity: inv.producto?.stock_actual ?? 0,
        alertType: (inv.producto?.stock_actual || 0) <= (inv.stock_minimo || 10) ? 'danger' : 'normal',
        category: 'Inventario',
      }));
    }
    return defaultStock;
  } catch {
    return defaultStock;
  }
}

export async function getReviews() {
  if (!supabase) return defaultReviews;
  try {
    const { data, error } = await supabase.from('reviews').select('*');
    if (error || !data || data.length === 0) return defaultReviews;
    return data;
  } catch {
    return defaultReviews;
  }
}

export { defaultOrders, defaultTransactions, defaultStock, defaultReviews };
