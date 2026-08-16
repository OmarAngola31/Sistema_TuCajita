import { useState } from 'react';
import { supabase } from '../supabaseClient';
import smileyImg from '../assets/smiley_emoji.jpg';

export default function Login({ setCurrentView, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validación hardcoded del Administrador
    if (email === 'admin' && password === 'admin123') {
      onLogin({ type: 'admin', name: 'Admin' });
      setCurrentView('home');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      onLogin({ type: 'client', name: data.user?.user_metadata?.full_name || email });
      setCurrentView('home');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-md flex flex-col items-center">

        {/* Smiley Emoji */}
        <img src={smileyImg} alt="Smiley" className="w-28 h-28 md:w-32 md:h-32 object-contain mb-4" />

        <h1
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-8"
          style={{ fontFamily: "'Fredoka One', 'Segoe UI', cursive" }}
        >
          Iniciar Sesion
        </h1>

        <form onSubmit={handleLogin} className="w-full space-y-5">
          {error && (
            <div className="p-3 bg-red-100 text-red-600 rounded-xl text-sm font-semibold animate-[fadeIn_0.3s_ease]">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-semibold text-gray-800">Email</label>
              <button type="button" className="text-sm font-bold text-gray-900 hover:underline cursor-pointer bg-transparent border-none p-0">
                Olvidaste tu contraseña?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {/* Mail icon */}
                <svg className="h-5 w-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3.5 bg-[#87e8f7] rounded-xl text-gray-900 placeholder-gray-600 font-medium text-base outline-none border-none transition-all duration-200 focus:ring-2 focus:ring-[#00cbf4]"
                placeholder="Ingresa tu correo"
                required
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {/* Lock icon */}
                <svg className="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3.5 bg-[#87e8f7] rounded-xl text-gray-900 placeholder-gray-600 font-medium text-base outline-none border-none transition-all duration-200 focus:ring-2 focus:ring-[#00cbf4]"
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>
          </div>

          {/* Botón Ingresar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-3 bg-[#00cbf4] hover:bg-[#00b8dd] text-white font-bold text-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        {/* Toggle a Registrarse */}
        <p className="mt-8 text-sm font-medium text-gray-600">
          Ya estas registrado?{' '}
          <button
            onClick={() => setCurrentView('register')}
            className="font-bold text-gray-900 hover:underline cursor-pointer bg-transparent border-none p-0"
          >
            Inicias Sesion
          </button>
        </p>
      </div>
    </div>
  );
}
