import React, { createContext, useContext, useReducer } from 'react';
import { supabase } from '../supabaseClient';

export function generateAutoOrderNumber() {
  const p = Math.floor(100 + Math.random() * 900);
  const s = Math.floor(1000 + Math.random() * 9000);
  return `${p}${s}`;
}

const CartContext = createContext();

const initialState = {
  items: [],
  orderNumber: generateAutoOrderNumber(),
  advisorPhone: '584146146237',
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const idx = state.items.findIndex(
        (i) => i.id === action.payload.id && i.size === action.payload.size && i.color === action.payload.color
      );
      if (idx > -1) {
        const updated = [...state.items];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + (action.payload.quantity || 1) };
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
    case 'CLEAR_CART':
      return { ...state, items: [], orderNumber: generateAutoOrderNumber() };
    case 'GENERATE_NEW_ORDER':
      return { ...state, orderNumber: generateAutoOrderNumber() };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const totalCount = state.items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = state.items.reduce((s, i) => s + i.price * i.quantity, 0);

  const saveOrderToSupabase = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('Solicitud')
        .insert([{ Fecha: new Date().toISOString(), Estatus: 'Pendiente', ...(userId ? { Solicitud_Asesor_FK: userId } : {}) }])
        .select();
      if (error) throw error;
      const solicitudId = data[0]?.ID;
      if (solicitudId && state.items.length > 0) {
        await supabase.from('Detalle_solicitud').insert(
          state.items.map((item) => ({
            ID_Solicitud_FK2: solicitudId,
            Cantidad: item.quantity,
            Precio: item.price,
            Detalle_solicitud_Producto_FK: item.id,
          }))
        );
      }
      return solicitudId;
    } catch (err) {
      console.warn('Supabase sync error:', err.message);
      return null;
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
      clearCart: () => dispatch({ type: 'CLEAR_CART' }),
      generateNewOrder: () => dispatch({ type: 'GENERATE_NEW_ORDER' }),
      saveOrderToSupabase,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}