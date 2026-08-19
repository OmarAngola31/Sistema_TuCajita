import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { syncUserProfile, updateUserPassword } from '../services/dbService';
import smileyImg from '../assets/smiley_emoji.jpg';

export default function Login({ setCurrentView, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Modal Restablecer Contraseña
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetNewPass, setResetNewPass] = useState('');
  const [resetConfirmPass, setResetConfirmPass] = useState('');
  const [resetStatus, setResetStatus] = useState({ error: null, success: null, loading: false });

  const handleOpenResetModal = () => {
    setResetEmail(email.trim());
    setResetNewPass('');
    setResetConfirmPass('');
    setResetStatus({ error: null, success: null, loading: false });
    setIsResetOpen(true);
  };

  const handleSaveNewPassword = async (e) => {
    e.preventDefault();
    setResetStatus({ error: null, success: null, loading: true });

    const cleanEmail = resetEmail.trim().toLowerCase();
    if (!cleanEmail) {
      setResetStatus({ error: 'Por favor ingresa tu correo electrónico.', success: null, loading: false });
      return;
    }

    if (!resetNewPass || resetNewPass.length < 6) {
      setResetStatus({ error: 'La contraseña debe tener al menos 6 caracteres.', success: null, loading: false });
      return;
    }

    if (resetNewPass !== resetConfirmPass) {
      setResetStatus({ error: 'Las contraseñas no coinciden. Verifícalas.', success: null, loading: false });
      return;
    }

    try {
      await updateUserPassword(cleanEmail, resetNewPass);
      setResetStatus({
        error: null,
        success: '¡Contraseña actualizada exitosamente! Ya puedes iniciar sesión.',
        loading: false,
      });

      // Auto rellenar formulario de login
      setEmail(cleanEmail);
      setPassword(resetNewPass);

      setTimeout(() => {
        setIsResetOpen(false);
      }, 1800);
    } catch (err) {
      console.warn('Error al actualizar contraseña:', err);
      setResetStatus({ error: 'Ocurrió un error al guardar la contraseña.', success: null, loading: false });
    }
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    // 1. Validación directa del Administrador
    if (
      (cleanEmail === 'admin' || cleanEmail === 'admin@tucajita.com') &&
      password === 'admin123'
    ) {
      const adminData = { type: 'admin', role: 'admin', name: 'Administrador Tu Cajita', email: 'admin@tucajita.com' };
      onLogin(adminData);
      setCurrentView('admin');
      setLoading(false);
      return;
    }

    if (!supabase) {
      // Modo local si no hay Supabase
      const savedClients = JSON.parse(localStorage.getItem('tucajita_clients') || '[]');
      const localClient = savedClients.find(
        (c) => (c.correo?.toLowerCase() === cleanEmail || c.email?.toLowerCase() === cleanEmail)
      );

      const clientData = {
        id: localClient?.id || `usr_${Date.now()}`,
        type: 'client',
        role: 'client',
        name: localClient?.nombre || cleanEmail.split('@')[0] || 'Cliente',
        email: cleanEmail,
        phone: localClient?.telefono || '',
        address: localClient?.direccion || '',
        cedula: localClient?.cedula || '',
      };
      onLogin(clientData);
      setCurrentView('home');
      setLoading(false);
      return;
    }

    try {
      // 2. Intentar autenticación con Supabase Auth
      let authSuccess = false;
      let userData = null;

      try {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (!authError && data?.user) {
          authSuccess = true;
          const isUserAdmin =
            cleanEmail.includes('admin') ||
            data.user?.user_metadata?.role === 'admin';

          userData = {
            id: data.user.id,
            type: isUserAdmin ? 'admin' : 'client',
            role: isUserAdmin ? 'admin' : 'client',
            name: data.user?.user_metadata?.full_name || cleanEmail.split('@')[0] || 'Usuario',
            email: data.user.email || cleanEmail,
            phone: data.user?.user_metadata?.phone || '',
            address: data.user?.user_metadata?.address || '',
            cedula: data.user?.user_metadata?.cedula || '',
          };
          await syncUserProfile(data.user, { name: userData.name, role: userData.role });
        }
      } catch (authErr) {
        console.warn('Supabase Auth signIn advertencia:', authErr);
      }

      // 3. Fallback inteligente
      if (!authSuccess) {
        // A) Buscar en tabla public.usuario de Supabase
        const { data: dbUser } = await supabase
          .from('usuario')
          .select('*')
          .ilike('correo', cleanEmail)
          .maybeSingle();

        // B) Buscar en clientes guardados localmente
        const savedClients = JSON.parse(localStorage.getItem('tucajita_clients') || '[]');
        const localClient = savedClients.find(
          (c) => (c.correo?.toLowerCase() === cleanEmail || c.email?.toLowerCase() === cleanEmail)
        );

        if (dbUser || localClient) {
          const matched = dbUser || localClient;
          if (localClient?.password && localClient.password !== password) {
            setError('Contraseña incorrecta. Por favor inténtalo de nuevo.');
            setLoading(false);
            return;
          }

          userData = {
            id: matched.id,
            type: (matched.rol === 'Administrador' || cleanEmail.includes('admin')) ? 'admin' : 'client',
            role: (matched.rol === 'Administrador' || cleanEmail.includes('admin')) ? 'admin' : 'client',
            name: matched.nombre || cleanEmail.split('@')[0] || 'Cliente',
            email: matched.correo || cleanEmail,
            phone: matched.telefono || '',
            address: matched.direccion || '',
            cedula: matched.cedula || '',
          };
          authSuccess = true;
        }
      }

      if (authSuccess && userData) {
        onLogin(userData);
        if (userData.type === 'admin') {
          setCurrentView('admin');
        } else {
          setCurrentView('home');
        }
      } else {
        setError('No se encontró una cuenta con este correo o la contraseña es incorrecta.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Error al iniciar sesión. Por favor verifica tus datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] py-12 md:py-16 flex flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-xl flex flex-col items-center">
        {/* Smiley Emoji */}
        <img src={smileyImg} alt="Smiley" className="w-32 h-32 md:w-36 md:h-36 object-contain mb-5 drop-shadow-sm" />

        <h1
          className="text-4xl md:text-5xl font-black text-gray-900 mb-2 tracking-tight text-center"
          style={{ fontFamily: "'Fredoka One', 'Segoe UI', cursive" }}
        >
          Iniciar Sesión
        </h1>
        <p className="text-sm md:text-base text-gray-500 mb-8 text-center font-medium">
          Accede a tu cuenta de cliente o panel administrativo
        </p>

        <form onSubmit={handleLogin} className="w-full space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-bold animate-[fadeIn_0.3s_ease]">
              {error}
            </div>
          )}

          {/* Email / Usuario */}
          <div>
            <div className="flex justify-between items-center mb-2.5">
              <label className="text-xs sm:text-sm font-black uppercase tracking-wider text-gray-800">Email / Usuario *</label>
              <button
                type="button"
                onClick={handleOpenResetModal}
                className="text-xs sm:text-sm font-bold text-amber-600 hover:text-amber-700 hover:underline cursor-pointer bg-transparent border-none p-0 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <div className="flex items-center bg-[#87e8f7] rounded-2xl px-5 py-4 sm:py-4.5 focus-within:ring-4 focus-within:ring-[#00cbf4]/30 focus-within:bg-[#78e4f5] transition-all shadow-sm">
              <span className="text-gray-800 mr-3.5 flex-shrink-0">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </span>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-gray-900 placeholder-gray-600 font-semibold text-base sm:text-lg outline-none border-none p-0"
                placeholder="Ingresa tu correo o 'admin'"
                required
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-xs sm:text-sm font-black uppercase tracking-wider text-gray-800 mb-2.5">Contraseña *</label>
            <div className="flex items-center bg-[#87e8f7] rounded-2xl px-5 py-4 sm:py-4.5 focus-within:ring-4 focus-within:ring-[#00cbf4]/30 focus-within:bg-[#78e4f5] transition-all shadow-sm">
              <span className="text-gray-800 mr-3.5 flex-shrink-0">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-gray-900 placeholder-gray-600 font-semibold text-base sm:text-lg outline-none border-none p-0"
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>
          </div>

          {/* Botón Ingresar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4.5 sm:py-5 mt-4 bg-[#00cbf4] hover:bg-[#00b8dd] text-white font-black text-xl sm:text-2xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        {/* Toggle a Registrarse */}
        <p className="mt-8 text-base font-semibold text-gray-600">
          ¿No tienes una cuenta aún?{' '}
          <button
            onClick={() => setCurrentView('register')}
            className="font-black text-gray-900 hover:text-[#00b8dd] hover:underline cursor-pointer bg-transparent border-none p-0 transition-colors"
          >
            Regístrate aquí
          </button>
        </p>
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* MODAL EMERGENTE: RESTABLECER CONTRASEÑA                */}
      {/* ══════════════════════════════════════════════════════ */}
      {isResetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease]">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 relative space-y-5 animate-[scaleIn_0.25s_ease]">
            {/* Cerrar modal */}
            <button
              onClick={() => setIsResetOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-sm font-black transition-colors cursor-pointer"
            >
              ✕
            </button>

            <div className="text-center space-y-1">
              <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-2xl mx-auto shadow-inner mb-2">
                🔑
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight" style={{ fontFamily: "'Fredoka One', cursive" }}>
                Restablecer Contraseña
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                Ingresa tu correo y define tu nueva clave de acceso
              </p>
            </div>

            {/* Alertas */}
            {resetStatus.error && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-bold animate-[fadeIn_0.2s_ease]">
                {resetStatus.error}
              </div>
            )}
            {resetStatus.success && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-xs font-bold animate-[fadeIn_0.2s_ease]">
                {resetStatus.success}
              </div>
            )}

            <form onSubmit={handleSaveNewPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-gray-800 mb-1.5">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-2xl text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-[#00cbf4] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-800 mb-1.5">
                  Nueva Contraseña *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={resetNewPass}
                  onChange={(e) => setResetNewPass(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-2xl text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-[#00cbf4] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-800 mb-1.5">
                  Confirmar Nueva Contraseña *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={resetConfirmPass}
                  onChange={(e) => setResetConfirmPass(e.target.value)}
                  placeholder="Repite la nueva contraseña"
                  className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-2xl text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-[#00cbf4] focus:bg-white"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResetOpen(false)}
                  className="w-1/3 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-2xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={resetStatus.loading}
                  className="flex-1 py-3 bg-[#00cbf4] hover:bg-[#00b8dd] text-white font-black text-sm rounded-2xl shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {resetStatus.loading ? 'Guardando...' : 'Guardar Nueva Clave'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

