import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { syncUserProfile } from '../services/dbService';
import smileyImg from '../assets/smiley_emoji.jpg';

export default function Register({ setCurrentView, onLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    cedula: '',
    phone: '',
    address: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const clientPayload = {
      id: `usr_${Date.now()}`,
      nombre: formData.name.trim(),
      cedula: formData.cedula.trim(),
      telefono: formData.phone.trim(),
      direccion: formData.address.trim(),
      correo: formData.email.trim().toLowerCase(),
      password: formData.password, // guardado para validación de sesión local
      rol: 'Cliente',
    };

    // Guardar cliente en cache local inmediatamente
    try {
      const savedClients = JSON.parse(localStorage.getItem('tucajita_clients') || '[]');
      const filtered = savedClients.filter((c) => c.correo?.toLowerCase() !== clientPayload.correo);
      filtered.push(clientPayload);
      localStorage.setItem('tucajita_clients', JSON.stringify(filtered));
    } catch (e) {
      console.warn('Error saving client locally:', e);
    }

    if (!supabase) {
      // Modo local
      await syncUserProfile(null, clientPayload);
      onLogin({
        id: clientPayload.id,
        type: 'client',
        role: 'client',
        name: clientPayload.nombre,
        email: clientPayload.correo,
        phone: clientPayload.telefono,
        address: clientPayload.direccion,
        cedula: clientPayload.cedula,
      });
      alert('¡Cuenta creada y guardada exitosamente!');
      setCurrentView('home');
      setLoading(false);
      return;
    }

    try {
      // 1. Intentar registro en Supabase Auth
      let authUser = null;
      try {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: clientPayload.correo,
          password: formData.password,
          options: {
            data: {
              full_name: clientPayload.nombre,
              cedula: clientPayload.cedula,
              phone: clientPayload.telefono,
              address: clientPayload.direccion,
              role: 'Cliente',
            },
          },
        });

        if (!signUpError && data?.user) {
          authUser = data.user;
        }
      } catch (authErr) {
        console.warn('Supabase auth.signUp advertencia:', authErr.message);
      }

      const finalUserId = authUser?.id || clientPayload.id;

      // 2. Persistir en tablas public.usuario y public.cliente de Supabase
      await syncUserProfile(authUser || { id: finalUserId, email: clientPayload.correo }, {
        id: finalUserId,
        nombre: clientPayload.nombre,
        correo: clientPayload.correo,
        telefono: clientPayload.telefono,
        direccion: clientPayload.direccion,
        cedula: clientPayload.cedula,
        password: clientPayload.password,
        rol: 'Cliente',
      });

      // 3. Iniciar sesión en el estado de la aplicación
      onLogin({
        id: finalUserId,
        type: 'client',
        role: 'client',
        name: clientPayload.nombre,
        email: clientPayload.correo,
        phone: clientPayload.telefono,
        address: clientPayload.direccion,
        cedula: clientPayload.cedula,
      });

      alert('¡Cuenta creada y guardada exitosamente en Supabase!');
      setCurrentView('home');
    } catch (err) {
      console.warn('Error en registro:', err);
      // Fallback seguro
      try {
        await syncUserProfile(null, clientPayload);
        onLogin({
          id: clientPayload.id,
          type: 'client',
          role: 'client',
          name: clientPayload.nombre,
          email: clientPayload.correo,
          phone: clientPayload.telefono,
          address: clientPayload.direccion,
          cedula: clientPayload.cedula,
        });
        alert('¡Cuenta creada con éxito! Bienvenido a Tu Cajita.');
        setCurrentView('home');
      } catch (fallbackErr) {
        setError(err.message || fallbackErr.message || 'Error al registrarse en la plataforma');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] py-12 md:py-16 flex flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-2xl flex flex-col items-center">
        {/* Smiley Emoji */}
        <img src={smileyImg} alt="Smiley" className="w-28 h-28 md:w-32 md:h-32 object-contain mb-4 drop-shadow-sm" />

        <h1
          className="text-4xl md:text-5xl font-black text-gray-900 mb-2 tracking-tight text-center"
          style={{ fontFamily: "'Fredoka One', 'Segoe UI', cursive" }}
        >
          Crear Cuenta
        </h1>
        <p className="text-sm md:text-base text-gray-500 mb-8 text-center font-medium">
          Regístrate como Cliente para gestionar tus pedidos, envíos y facturación en Tu Cajita
        </p>

        <form onSubmit={handleRegister} className="w-full space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-bold animate-[fadeIn_0.3s_ease]">
              {error}
            </div>
          )}

          {/* Nombre y Cédula en 2 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {/* Nombre Completo */}
            <div>
              <label className="block text-xs sm:text-sm font-black uppercase tracking-wider text-gray-800 mb-2">
                Nombre Completo *
              </label>
              <div className="flex items-center bg-[#87e8f7] rounded-2xl px-5 py-4 focus-within:ring-4 focus-within:ring-[#00cbf4]/30 focus-within:bg-[#78e4f5] transition-all shadow-sm">
                <span className="text-gray-800 mr-3.5 flex-shrink-0">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-transparent text-gray-900 placeholder-gray-600 font-semibold text-base outline-none border-none p-0"
                  placeholder="Ej. Juan Pérez"
                  required
                />
              </div>
            </div>

            {/* Cédula / Documento */}
            <div>
              <label className="block text-xs sm:text-sm font-black uppercase tracking-wider text-gray-800 mb-2">
                Cédula / Documento *
              </label>
              <div className="flex items-center bg-[#87e8f7] rounded-2xl px-5 py-4 focus-within:ring-4 focus-within:ring-[#00cbf4]/30 focus-within:bg-[#78e4f5] transition-all shadow-sm">
                <span className="text-gray-800 mr-3.5 flex-shrink-0">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                </span>
                <input
                  type="text"
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleChange}
                  className="w-full bg-transparent text-gray-900 placeholder-gray-600 font-semibold text-base outline-none border-none p-0"
                  placeholder="Ej. V-25.123.456"
                  required
                />
              </div>
            </div>
          </div>

          {/* Teléfono y Correo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {/* Teléfono / WhatsApp */}
            <div>
              <label className="block text-xs sm:text-sm font-black uppercase tracking-wider text-gray-800 mb-2">
                Teléfono / WhatsApp *
              </label>
              <div className="flex items-center bg-[#87e8f7] rounded-2xl px-5 py-4 focus-within:ring-4 focus-within:ring-[#00cbf4]/30 focus-within:bg-[#78e4f5] transition-all shadow-sm">
                <span className="text-gray-800 mr-3.5 flex-shrink-0">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-transparent text-gray-900 placeholder-gray-600 font-semibold text-base outline-none border-none p-0"
                  placeholder="Ej. +58 412 1234567"
                  required
                />
              </div>
            </div>

            {/* Correo Electrónico */}
            <div>
              <label className="block text-xs sm:text-sm font-black uppercase tracking-wider text-gray-800 mb-2">
                Correo Electrónico *
              </label>
              <div className="flex items-center bg-[#87e8f7] rounded-2xl px-5 py-4 focus-within:ring-4 focus-within:ring-[#00cbf4]/30 focus-within:bg-[#78e4f5] transition-all shadow-sm">
                <span className="text-gray-800 mr-3.5 flex-shrink-0">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-transparent text-gray-900 placeholder-gray-600 font-semibold text-base outline-none border-none p-0"
                  placeholder="cliente@ejemplo.com"
                  required
                />
              </div>
            </div>
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-xs sm:text-sm font-black uppercase tracking-wider text-gray-800 mb-2">
              Dirección de Envío / Entrega *
            </label>
            <div className="flex items-center bg-[#87e8f7] rounded-2xl px-5 py-4 focus-within:ring-4 focus-within:ring-[#00cbf4]/30 focus-within:bg-[#78e4f5] transition-all shadow-sm">
              <span className="text-gray-800 mr-3.5 flex-shrink-0">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full bg-transparent text-gray-900 placeholder-gray-600 font-semibold text-base outline-none border-none p-0"
                placeholder="Ej. Calle 5, Casa 12, Urb. San Jacinto, Maracay"
                required
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-xs sm:text-sm font-black uppercase tracking-wider text-gray-800 mb-2">
              Contraseña *
            </label>
            <div className="flex items-center bg-[#87e8f7] rounded-2xl px-5 py-4 focus-within:ring-4 focus-within:ring-[#00cbf4]/30 focus-within:bg-[#78e4f5] transition-all shadow-sm">
              <span className="text-gray-800 mr-3.5 flex-shrink-0">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-transparent text-gray-900 placeholder-gray-600 font-semibold text-base outline-none border-none p-0"
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
              />
            </div>
          </div>

          {/* Badge de Rol Cliente */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-cyan-50 border border-cyan-200 rounded-2xl">
            <span className="text-sm font-bold text-cyan-900">Tipo de Cuenta:</span>
            <span className="inline-flex items-center px-4 py-1 rounded-full text-xs sm:text-sm font-black bg-[#00cbf4] text-white shadow-sm">
              👤 Cliente
            </span>
          </div>

          {/* Botón Registrarse */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4.5 sm:py-5 mt-4 bg-[#00cbf4] hover:bg-[#00b8dd] text-white font-black text-xl sm:text-2xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading ? 'Registrando Cliente...' : 'Crear Cuenta de Cliente'}
          </button>
        </form>

        {/* Toggle a Login */}
        <p className="mt-8 text-base font-semibold text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <button
            onClick={() => setCurrentView('login')}
            className="font-black text-gray-900 hover:text-[#00b8dd] hover:underline cursor-pointer bg-transparent border-none p-0 transition-colors"
          >
            Inicia Sesión aquí
          </button>
        </p>
      </div>
    </div>
  );
}
