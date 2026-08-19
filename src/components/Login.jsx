/**
 * Login.jsx — Pantalla de inicio de sesión.
 *
 * Maneja 3 roles de usuario: Cliente, Asesor de Ventas y Administrador.
 * La detección de rol funciona en dos niveles:
 *
 *  1. ACCESO RÁPIDO DE DEMO (sin backend real):
 *     - admin / admin@tucajita.com + contraseña "admin123"
 *     - asesor / asesor@tucajita.com + contraseña "asesor123"
 *     - También hay botones de "1 clic" que evitan escribir usuario/clave,
 *       pensados para agilizar la demostración en clase.
 *
 *  2. LOGIN REAL CONTRA SUPABASE (supabase.auth.signInWithPassword):
 *     El rol se determina revisando si el correo contiene "admin"/"asesor"
 *     o si el usuario tiene guardado `user_metadata.role` (esto se define
 *     al registrarse, ver Register.jsx).
 *
 * 
 * Esta detección de rol es solo para fines de demostración. No hay
 * verificación real en el backend (Row Level Security de Supabase está
 * abierta en supabase_schema.sql) por lo que cualquiera podría acceder a
 * los paneles sin autenticarse realmente. Para un entorno de producción,
 * el rol debe validarse siempre contra la tabla `usuario` en el servidor.
 */

import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { syncUserProfile } from '../services/dbService';
import smileyImg from '../assets/smiley_emoji.jpg';
 
export default function Login({ setCurrentView, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
 
  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);
 
    // Validación directa del Administrador
    if (
      (email.trim().toLowerCase() === 'admin' || email.trim().toLowerCase() === 'admin@tucajita.com') &&
      password === 'admin123'
    ) {
      const adminData = { type: 'admin', role: 'admin', name: 'Administrador Tu Cajita', email: 'admin@tucajita.com' };
      onLogin(adminData);
      setCurrentView('admin');
      setLoading(false);
      return;
    }
 
    // Validación directa del Asesor de Ventas
    if (
      (email.trim().toLowerCase() === 'asesor' || email.trim().toLowerCase() === 'asesor@tucajita.com') &&
      password === 'asesor123'
    ) {
      const asesorData = { type: 'asesor', role: 'asesor', name: 'Asesor Tu Cajita', email: 'asesor@tucajita.com' };
      onLogin(asesorData);
      setCurrentView('asesor');
      setLoading(false);
      return;
    }
 
    if (!supabase) {
      // Si no hay Supabase configurado todavía, permitir login cliente
      onLogin({ type: 'client', role: 'client', name: email.split('@')[0] || 'Cliente' });
      setCurrentView('home');
      setLoading(false);
      return;
    }
 
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
 
      if (authError) throw authError;
 
      // Verificar el rol del usuario: admin | asesor | client
      const metaRole = data.user?.user_metadata?.role;
      const isUserAdmin = email.includes('admin') || metaRole === 'admin';
      const isUserAsesor = !isUserAdmin && (email.includes('asesor') || metaRole === 'asesor');
      const resolvedType = isUserAdmin ? 'admin' : isUserAsesor ? 'asesor' : 'client';
 
      const userData = {
        id: data.user?.id,
        type: resolvedType,
        role: resolvedType,
        name: data.user?.user_metadata?.full_name || email.split('@')[0] || 'Usuario',
        email: data.user?.email || email,
      };
 
      // Guardar / sincronizar perfil en Supabase
      await syncUserProfile(data.user, { name: userData.name, role: userData.role });
 
      onLogin(userData);
 
      setCurrentView(isUserAdmin ? 'admin' : isUserAsesor ? 'asesor' : 'home');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };
 
  // Quick 1-click admin login
  const handleQuickAdminLogin = () => {
    const adminData = { type: 'admin', role: 'admin', name: 'Administrador Tu Cajita', email: 'admin@tucajita.com' };
    onLogin(adminData);
    setCurrentView('admin');
  };
 
  // Quick 1-click asesor de ventas login
  const handleQuickAsesorLogin = () => {
    const asesorData = { type: 'asesor', role: 'asesor', name: 'Asesor Tu Cajita', email: 'asesor@tucajita.com' };
    onLogin(asesorData);
    setCurrentView('asesor');
  };
 
  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Smiley Emoji */}
        <img src={smileyImg} alt="Smiley" className="w-28 h-28 md:w-32 md:h-32 object-contain mb-4" />
 
        <h1
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-2"
          style={{ fontFamily: "'Fredoka One', 'Segoe UI', cursive" }}
        >
          Iniciar Sesion
        </h1>
        <p className="text-xs text-gray-500 mb-6 text-center font-medium">
          Accede a tu cuenta de cliente o panel administrativo
        </p>
 
        <form onSubmit={handleLogin} className="w-full space-y-5">
          {error && (
            <div className="p-3 bg-red-100 text-red-600 rounded-xl text-xs font-semibold animate-[fadeIn_0.3s_ease]">
              {error}
            </div>
          )}
 
          {/* Email / Usuario */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-semibold text-gray-800">Email / Usuario</label>
              <button
                type="button"
                onClick={() => alert('Para soporte o restablecer contraseña, contáctanos por WhatsApp')}
                className="text-xs font-bold text-gray-900 hover:underline cursor-pointer bg-transparent border-none p-0"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <div className="flex items-center gap-2 w-full bg-white border-2 border-[#00cbf4] rounded-xl px-3.5 py-3 transition-all duration-200 focus-within:ring-2 focus-within:ring-[#00cbf4]/40">
              <svg className="h-5 w-5 text-[#00a8c8] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-gray-900 placeholder-gray-500 font-medium text-base"
                placeholder="Ingresa tu correo o 'admin'"
                required
              />
            </div>
          </div>
 
          {/* Contraseña */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Contraseña</label>
            <div className="flex items-center gap-2 w-full bg-white border-2 border-[#00cbf4] rounded-xl px-3.5 py-3 transition-all duration-200 focus-within:ring-2 focus-within:ring-[#00cbf4]/40">
              <svg className="h-5 w-5 text-[#00a8c8] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-gray-900 placeholder-gray-500 font-medium text-base"
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>
          </div>
 
          {/* Botón Ingresar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-3 bg-[#00cbf4] hover:bg-[#00b8dd] text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
 
        {/* Toggle a Registrarse */}
        <p className="mt-6 text-sm font-medium text-gray-600">
          ¿No tienes una cuenta aún?{' '}
          <button
            onClick={() => setCurrentView('register')}
            className="font-bold text-gray-900 hover:underline cursor-pointer bg-transparent border-none p-0"
          >
            Regístrate aquí
          </button>
        </p>
 
        {/* 1-Click Admin Button */}
        <button
          onClick={handleQuickAdminLogin}
          className="mt-4 p-3 bg-teal-50 hover:bg-teal-100 border border-teal-300 rounded-2xl text-center text-xs text-teal-900 font-bold w-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <span>⚡</span>
          <span>Probar Vista Administrativa (1 Clic)</span>
        </button>
 
        {/* 1-Click Asesor Button */}
        <button
          onClick={handleQuickAsesorLogin}
          className="mt-2 p-3 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-2xl text-center text-xs text-amber-900 font-bold w-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <span>🧑‍💼</span>
          <span>Probar Vista de Asesor de Ventas (1 Clic)</span>
        </button>
      </div>
    </div>
  );
}
 