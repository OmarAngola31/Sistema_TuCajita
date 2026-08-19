import { useCart } from '../context/CartContext';

export default function CartDrawer({ isOpen, onClose, setCurrentView, user, onStartCheckout }) {
  const { cart, removeFromCart, updateQuantity, clearCart, cartSubtotal, cartTotal, cartCount } = useCart();

  if (!isOpen) return null;

  const handleStartCheckout = () => {
    if (cart.length === 0) return;
    onClose();
    if (onStartCheckout) {
      onStartCheckout();
    } else if (setCurrentView) {
      setCurrentView('checkout');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-[fadeIn_0.2s_ease]">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🛒</span>
              <div>
                <h2 className="text-lg font-black text-gray-900" style={{ fontFamily: "'Fredoka One', cursive" }}>
                  Mi Carrito de Compras
                </h2>
                <p className="text-xs text-gray-500 font-semibold">
                  {cartCount === 1 ? '1 artículo agregado' : `${cartCount} artículos agregados`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
                <div className="w-20 h-20 rounded-full bg-cyan-50 text-[#00cbf4] flex items-center justify-center text-4xl mb-3 shadow-inner">
                  🛍️
                </div>
                <h3 className="text-base font-bold text-gray-800 mb-1">Tu carrito está vacío</h3>
                <p className="text-xs text-gray-500 max-w-xs mb-5">
                  Explora nuestras cajas de lujo, arreglos y detalles para comenzar a agregar productos.
                </p>
                <button
                  onClick={() => {
                    setCurrentView('productos');
                    onClose();
                  }}
                  className="px-5 py-2.5 bg-[#00cbf4] hover:bg-[#00b5dc] text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-all"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200/70 flex gap-3 items-center group hover:border-cyan-200 transition-colors"
                >
                  {/* Image */}
                  <div className="w-16 h-16 rounded-xl bg-white p-1 border border-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-xl">📦</span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 truncate" title={item.name}>
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-gray-500 font-medium">{item.categoryName}</p>
                    <p className="text-xs font-black text-amber-600 mt-0.5">
                      ${item.price.toFixed(2)} c/u
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 sm:w-9 sm:h-9 hover:bg-gray-100 font-black text-base text-gray-700 flex items-center justify-center cursor-pointer transition-colors active:bg-gray-200"
                        title="Disminuir cantidad"
                        aria-label="Disminuir cantidad"
                      >
                        −
                      </button>
                      <span className="px-3 text-xs sm:text-sm font-black text-gray-900 min-w-[28px] text-center select-none">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 sm:w-9 sm:h-9 hover:bg-gray-100 font-black text-base text-gray-700 flex items-center justify-center cursor-pointer transition-colors active:bg-gray-200"
                        title="Aumentar cantidad"
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs text-red-500 hover:text-red-700 font-bold cursor-pointer transition-colors px-1"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-gray-100 bg-white space-y-3 shadow-lg">
              <div className="space-y-1.5 text-xs text-gray-600 font-semibold">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-bold text-gray-900">${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-gray-900 border-t border-gray-100 pt-2 bg-amber-50/70 p-2.5 rounded-xl">
                  <span className="text-amber-900">TOTAL ESTIMADO:</span>
                  <span className="text-amber-600 text-base font-black">${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                {/* Botón principal verde WhatsApp que inicia el checkout */}
                <button
                  onClick={handleStartCheckout}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>Pedir Pedido por WhatsApp</span>
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={clearCart}
                    className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-xs rounded-xl cursor-pointer transition-colors"
                  >
                    Vaciar Carrito
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl cursor-pointer transition-colors"
                  >
                    Seguir Comprando
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
