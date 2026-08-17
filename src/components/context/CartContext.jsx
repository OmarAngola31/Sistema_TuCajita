import React, { createContext, useContext, useReducer } from 'react';
import { supabase } from '../lib/supabaseClient';

export function generateAutoOrderNumber() {
  const p = Math.floor(100 + Math.random() * 900);
  const s = Math.floor(1000 + Math.random() * 9000);
  return `${p}${s}`;
}

export const PRODUCT_IMAGES = [
  'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80'
];

const CartContext = createContext();

const initialCartState = {
  items: [
    {
      id: 'caja-1',
      name: 'Producto',
      price: 15.99,
      size: 'G',
      dimensions: '25,5 × 19 × 9cm (Internas)',
      color: 'Coral / Rosa',
      colorHex: '#EF5350',
      image: PRODUCT_IMAGES[0],
      quantity: 1
    }
  ],
  orderNumber: generateAutoOrderNumber(),
  advisorPhone: '584146146237'
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const idx = state.items.findIndex(i => i.id === action.payload.id && i.size === action.payload.size && i.color === action.payload.color);
      if (idx > -1) {
        const updated = [...state.items];
        updated[idx].quantity += (action.payload.quantity || 1);
        return { ...state, items: updated };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }] };
    }
    case 'UPDATE_QUANTITY': {
      const { index, quantity } = action.payload;
      if (quantity <= 0) return { ...state, items: state.items.filter((_, i) => i !== index) };
      const updated = [...state.items];
      updated[index] = { ...updated[index], quantity };
      return { ...state, items: updated };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((_, i) => i !== action.payload.index) };
    case 'GENERATE_NEW_ORDER':
      return { ...state, orderNumber: generateAutoOrderNumber() };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);
  const totalCount = state.items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = state.items.reduce((s, i) => s + i.price * i.quantity, 0);

  const saveOrderToSupabase = async () => {
    try {
      const { data: solicitudData, error: solicitudError } = await supabase
        .from('Solicitud')
        .insert([{ fecha: new Date().toISOString(), estatus: 'Pendiente' }])
        .select();

      if (solicitudError) throw solicitudError;

      const solicitudId = solicitudData[0]?.id;
      if (solicitudId && state.items.length > 0) {
        const detalles = state.items.map(item => ({
          ID_Solicitud_FK2: solicitudId,
          Cantidad: item.quantity,
          Precio: item.price
        }));

        await supabase.from('Detalle_solicitud').insert(detalles);
      }
    } catch (err) {
      console.warn("Supabase Sync fallback:", err.message);
    }
  };

  return (
    <CartContext.Provider value={{
      items: state.items,
      orderNumber: state.orderNumber,
      advisorPhone: state.advisorPhone,
      totalCount,
      subtotal,
      addItem: (p) => dispatch({ type: 'ADD_ITEM', payload: p }),
      updateQuantity: (index, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { index, quantity } }),
      removeItem: (index) => dispatch({ type: 'REMOVE_ITEM', payload: { index } }),
      generateNewOrder: () => {
        dispatch({ type: 'GENERATE_NEW_ORDER' });
        saveOrderToSupabase();
      }
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}