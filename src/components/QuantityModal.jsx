import React, { useState, useEffect } from 'react';

export function QuantityModal({ isOpen, onClose, currentQty, onConfirm, onRemove }) {
  const [val, setVal] = useState(currentQty || 1);

  useEffect(() => { setVal(currentQty || 1); }, [currentQty, isOpen]);

  if (!isOpen) return null;

  const handleKey = (n) => {
    const next = parseInt(`${val === 0 ? '' : val}${n}`, 10);
    if (next <= 99) setVal(next || 1);
  };

  const handleBackspace = () => {
    const s = val.toString();
    setVal(s.length <= 1 ? 1 : parseInt(s.slice(0, -1), 10));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white rounded-t-3xl p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
          <span className="text-sm font-bold text-gray-800">Cantidad</span>
          <button
            onClick={() => { onRemove(); onClose(); }}
            className="text-xs text-red-400 hover:text-red-600 font-semibold"
          >
            Remover del carrito
          </button>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center space-x-6 mb-4">
          <button
            onClick={() => setVal(Math.max(1, val - 1))}
            className="w-9 h-9 rounded-full bg-[#00C2FF] text-white text-lg font-black flex items-center justify-center shadow hover:bg-cyan-600 transition"
          >-</button>
          <div className="w-16 h-10 border-2 border-gray-200 rounded-xl flex items-center justify-center text-lg font-bold text-gray-800 bg-white shadow-inner">
            {val}
          </div>
          <button
            onClick={() => setVal(val + 1)}
            className="w-9 h-9 rounded-full bg-[#00C2FF] text-white text-lg font-black flex items-center justify-center shadow hover:bg-cyan-600 transition"
          >+</button>
        </div>

        {/* Teclado numérico 3x4 */}
        <div className="grid grid-cols-3 gap-2 bg-gray-50 p-3 rounded-2xl border border-gray-200 mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button
              key={n}
              onClick={() => handleKey(n)}
              className="h-10 bg-white rounded-xl font-bold text-sm text-gray-800 shadow-sm hover:bg-gray-100 active:scale-95 transition"
            >{n}</button>
          ))}
          <div />
          <button
            onClick={() => handleKey(0)}
            className="h-10 bg-white rounded-xl font-bold text-sm text-gray-800 shadow-sm hover:bg-gray-100 active:scale-95 transition"
          >0</button>
          <button
            onClick={handleBackspace}
            className="h-10 bg-white rounded-xl font-bold text-sm text-gray-500 shadow-sm hover:bg-gray-100 active:scale-95 transition flex items-center justify-center"
          >⌫</button>
        </div>

        <button
          onClick={() => { onConfirm(val); onClose(); }}
          className="w-full py-3 bg-[#00C2FF] hover:bg-[#00A8DE] text-white font-bold rounded-2xl shadow text-sm transition active:scale-95"
        >
          Confirmar cantidad
        </button>
      </div>
    </div>
  );
}