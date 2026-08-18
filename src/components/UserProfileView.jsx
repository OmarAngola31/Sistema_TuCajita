import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export function UserProfileView({ user, setCurrentView }) {
  const [activeTab, setActiveTab] = useState('solicitudes');
  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    if (!supabase || !user?.id) return;
    setLoading(true);
    try {
      if (activeTab === 'solicitudes') {
        const { data } = await supabase
          .from('Solicitud')
          .select('*')
          .order('Fecha', { ascending: false })
          .limit(20);
        setSolicitudes(data || []);
      } else if (activeTab === 'facturas') {
        const { data } = await supabase
          .from('Factura')
          .select('*, Detalle_Factura(*)')
          .order('Fecha', { ascending: false })
          .limit(20);
        setFacturas(data || []);
      }
    } catch (err) {
      console.warn('Error fetching profile data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'solicitudes', label: '📋 Solicitudes' },
    { id: 'facturas', label: '🧾 Facturas' },
    { id: 'favoritos', label: '❤️ Favoritos' },
    { id: 'resenas', label: '⭐ Reseñas' },
  ];

  const statusColors = {
    'Pendiente': 'bg-yellow-100 text-yellow-700',
    'Procesada': 'bg-blue-100 text-blue-700',
    'Completada': 'bg-green-100 text-green-700',
    'Cancelada': 'bg-red-100 text-red-700',
  };

  return (
    <div className="min-h-screen bg-white pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Header de perfil */}
        <div className="flex items-center gap-4 mb-8 bg-[#D2E7EA] rounded-3xl p-6 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#00C2FF] flex items-center justify-center text-white text-2xl font-black shadow-md">
            {user?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900">{user?.name || 'Usuario'}</h1>
            <p className="text-sm text-gray-600">{user?.email}</p>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full mt-1 inline-block ${
              user?.role === 'admin' ? 'bg-green-200 text-green-800' :
              user?.role === 'asesor' ? 'bg-purple-200 text-purple-800' :
              'bg-cyan-200 text-cyan-800'
            }`}>
              {user?.role === 'admin' ? 'Administrador' : user?.role === 'asesor' ? 'Asesor en Ventas' : 'Cliente'}
            </span>
          </div>
        </div>

        {/* Pestañas */}
        <div className="flex gap-1 overflow-x-auto pb-2 mb-6 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'border-[#00C2FF] text-[#00C2FF] bg-cyan-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-[#00C2FF] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Solicitudes */}
        {!loading && activeTab === 'solicitudes' && (
          <div className="space-y-3">
            {solicitudes.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <div className="text-4xl mb-3">📋</div>
                <p className="text-sm">Aún no tienes solicitudes registradas</p>
                <button onClick={() => setCurrentView('productos')} className="mt-4 px-5 py-2 bg-[#00C2FF] text-white rounded-xl text-xs font-bold">
                  Ir a la tienda
                </button>
              </div>
            ) : solicitudes.map((s) => (
              <div key={s.ID || s.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900 text-sm">Solicitud #{s.ID || s.id}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.Fecha ? new Date(s.Fecha).toLocaleDateString('es-VE') : '—'}</p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColors[s.Estatus] || 'bg-gray-100 text-gray-600'}`}>
                  {s.Estatus || 'Pendiente'}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Facturas */}
        {!loading && activeTab === 'facturas' && (
          <div className="space-y-3">
            {facturas.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <div className="text-4xl mb-3">🧾</div>
                <p className="text-sm">Aún no tienes facturas emitidas</p>
                <p className="text-xs mt-1 text-gray-400">Las facturas son emitidas por el asesor en ventas</p>
              </div>
            ) : facturas.map((f) => (
              <div key={f.ID || f.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Factura #{f.ID || f.id}</p>
                    <p className="text-xs text-gray-500">{f.Fecha ? new Date(f.Fecha).toLocaleDateString('es-VE') : '—'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-gray-900 text-base">${parseFloat(f.Total || 0).toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{f['Método_de_pago'] || 'Por definir'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Favoritos */}
        {!loading && activeTab === 'favoritos' && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">❤️</div>
            <p className="text-sm">Los favoritos que marques en los productos aparecerán aquí</p>
            <button onClick={() => setCurrentView('productos')} className="mt-4 px-5 py-2 bg-[#00C2FF] text-white rounded-xl text-xs font-bold">
              Explorar productos
            </button>
          </div>
        )}

        {/* Reseñas */}
        {!loading && activeTab === 'resenas' && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">⭐</div>
            <p className="text-sm">Las reseñas que escribas en los productos aparecerán aquí</p>
            <button onClick={() => setCurrentView('productos')} className="mt-4 px-5 py-2 bg-[#00C2FF] text-white rounded-xl text-xs font-bold">
              Explorar productos
            </button>
          </div>
        )}
      </div>
    </div>
  );
}