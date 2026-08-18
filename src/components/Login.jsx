import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { syncUserProfile } from '../services/dbService';

export default function Login({ setCurrentView, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);

    // ── Admin rápido ──
    if (
      (email.trim().toLowerCase() === 'admin' || email.trim().toLowerCase() === 'admin@tucajita.com') &&
      password === 'admin123'
    ) {
      onLogin({ type: 'admin', role: 'admin', name: 'Administrador Tu Cajita', email: 'admin@tucajita.com' });
      setCurrentView('admin');
      setLoading(false);
      return;
    }

    // ── Asesor rápido ──
    if (
      (email.trim().toLowerCase() === 'asesor' || email.trim().toLowerCase() === 'asesor@tucajita.com') &&
      password === 'asesor123'
    ) {
      onLogin({ type: 'asesor', role: 'asesor', name: 'Asesor Tu Cajita', email: 'asesor@tucajita.com' });
      setCurrentView('home');
      setLoading(false);
      return;
    }

    if (!supabase) {
      onLogin({ type: 'client', role: 'client', name: email.split('@')[0] || 'Cliente', email });
      setCurrentView('home');
      setLoading(false);
      return;
    }

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;

      const role = data.user?.user_metadata?.role || (email.includes('admin') ? 'admin' : email.includes('asesor') ? 'asesor' : 'client');
      const userData = {
        id: data.user?.id,
        type: role,
        role,
        name: data.user?.user_metadata?.full_name || email.split('@')[0] || 'Usuario',
        email: data.user?.email || email,
      };

      await syncUserProfile(data.user, { name: userData.name, role });
      onLogin(userData);

      if (role === 'admin') setCurrentView('admin');
      else setCurrentView('home');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 pt-20 pb-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900">Iniciar sesión</h1>
          <p className="text-sm text-gray-500 mt-2">Ingresa a tu cuenta de Tu Cajita</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white border border-gray-100 rounded-3xl shadow-sm p-8 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">Correo electrónico</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00C2FF]/40"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00C2FF]/40"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#00C2FF] hover:bg-[#00A8DE] text-white font-black rounded-2xl shadow text-sm transition disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Ingresando...</> : 'Iniciar sesión'}
          </button>

          <button type="button" onClick={() => setCurrentView('register')} className="w-full text-center text-sm text-gray-500 hover:text-[#00C2FF] transition font-semibold">
            ¿No tienes cuenta? Regístrate
          </button>
        </form>

        {/* Accesos rápidos para pruebas */}
        <div className="mt-4 space-y-2">
          <p className="text-center text-xs text-gray-400 font-semibold">Accesos rápidos (desarrollo)</p>
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => { setEmail('admin@tucajita.com'); setPassword('admin123'); }} className="py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-xl text-xs font-bold transition">🛡️ Admin</button>
            <button onClick={() => { setEmail('asesor@tucajita.com'); setPassword('asesor123'); }} className="py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-xl text-xs font-bold transition">💼 Asesor</button>
            <button onClick={() => { setEmail('cliente@test.com'); setPassword('cliente123'); }} className="py-2 bg-cyan-100 hover:bg-cyan-200 text-cyan-800 rounded-xl text-xs font-bold transition">👤 Cliente</button>
          </div>
        </div>
      </div>
    </div>
  );
}