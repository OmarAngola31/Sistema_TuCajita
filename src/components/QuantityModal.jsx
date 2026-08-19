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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div className="w-full max-w-sm bg-white rounded-t-3xl p-5 shadow-2xl animate-slideUp" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <span className="text-xs font-bold text-gray-800">Cantidad</span>
          <button onClick={() => { onRemove(); onClose(); }} className="text-[11px] text-gray-400 hover:text-red-500 font-semibold">Remover</button>
        </div>

        <div className="flex items-center justify-center space-x-6 my-4">
          <button onClick={() => setVal(Math.max(1, val - 1))} className="w-8 h-8 rounded-full bg-[#00C2FF] text-white text-base font-black flex items-center justify-center shadow hover:bg-cyan-600">-</button>
          <div className="w-14 h-9 border border-gray-300 rounded-lg flex items-center justify-center text-base font-bold text-gray-800 bg-white">{val}</div>
          <button onClick={() => setVal(val + 1)} className="w-8 h-8 rounded-full bg-[#00C2FF] text-white text-base font-black flex items-center justify-center shadow hover:bg-cyan-600">+</button>
        </div>

        <div className="grid grid-cols-3 gap-1.5 bg-gray-100 p-2.5 rounded-xl border border-gray-200">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <button key={n} onClick={() => handleKey(n)} className="h-9 bg-white rounded-lg font-bold text-sm text-gray-800 shadow-sm hover:bg-gray-50 active:bg-gray-200">{n}</button>
          ))}
          <div></div>
          <button onClick={() => handleKey(0)} className="h-9 bg-white rounded-lg font-bold text-sm text-gray-800 shadow-sm hover:bg-gray-50 active:bg-gray-200">0</button>
          <button onClick={handleBackspace} className="h-9 bg-white rounded-lg font-bold text-xs text-gray-600 shadow-sm hover:bg-gray-50 active:bg-gray-200 flex items-center justify-center">⌫</button>
        </div>

        <button onClick={() => { onConfirm(val); onClose(); }} className="mt-4 w-full py-2.5 bg-[#00C2FF] hover:bg-[#00A8DE] text-white font-bold rounded-xl shadow text-xs">
          Confirmar
        </button>
      </div>
    </div>
  );
}