import { useEffect, useState } from 'react';
import heroBg from '../assets/hero_bg.png';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section
      id="inicio"
      className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden py-12"
      style={{
        background: 'linear-gradient(135deg, #e8f4fd 0%, #fef9e7 30%, #e8f4fd 60%, #fef3cd 100%)',
      }}
    >
      {/* Decorative floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-amber-200/30 rounded-full animate-float" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-blue-200/20 rounded-full animate-float delay-200" />
        <div className="absolute bottom-40 left-1/4 w-16 h-16 bg-amber-300/20 rounded-full animate-float delay-300" />
        <div className="absolute bottom-20 right-1/3 w-24 h-24 bg-blue-100/30 rounded-full animate-float delay-100" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center relative z-10">
        {/* Left content */}
        <div
          className={`text-center md:text-left transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-amber-100/80 backdrop-blur-sm px-4 py-2 rounded-full mb-4 md:mb-6">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <span className="text-xs sm:text-sm font-semibold text-amber-700">Distribuidores Oficiales</span>
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 leading-tight mb-3 md:mb-4 tracking-tight"
            style={{ fontFamily: "'Fredoka One', cursive" }}
          >
            CLIENTES
          </h1>

          {/* Stars */}
          <div className="flex items-center justify-center md:justify-start gap-1 mb-4 md:mb-6">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400 drop-shadow-md animate-bounce-slow"
                style={{ animationDelay: `${i * 0.1}s` }}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>

          {/* Distribuidores badge */}
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-white/70 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-5 shadow-xl shadow-amber-100/30 border border-amber-100/50 mb-4 md:mb-6">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-bold text-amber-700 uppercase tracking-widest">Distribuidores</span>
            </div>
            <div className="h-px sm:h-8 sm:w-px w-full bg-amber-200" />
            <div className="flex flex-col gap-1 text-xs sm:text-sm text-gray-600 text-left">
              <a href="tel:+584120177993" className="flex items-center gap-1.5 hover:text-amber-600 transition-colors">
                <svg className="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                +58 412-0177993
              </a>
              <a href="mailto:info@tucajita.ve" className="flex items-center gap-1.5 hover:text-amber-600 transition-colors">
                <svg className="w-4 h-4 text-amber-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                info@tucajita.ve
              </a>
            </div>
          </div>
        </div>

        {/* Right content - Hero image */}
        <div
          className={`relative transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`}
        >
          <div className="relative">
            {/* Glow effect behind image */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-300/30 to-blue-300/20 rounded-3xl blur-3xl scale-105" />
            <img
              src={heroBg}
              alt="Productos de Tu Cajita - Cajas y empaques"
              className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto rounded-3xl shadow-2xl shadow-amber-200/30 hover:scale-[1.02] transition-transform duration-500"
            />
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full" preserveAspectRatio="none">
          <path
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
