import logo from '../assets/logo.png';

export default function Footer() {
  return (
    <footer id="contacto" className="bg-[#ffcc00] text-[#0f172a] pt-10 pb-8 px-6 sm:px-10 lg:px-16 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col justify-between">
        
        {/* 3 Secciones Principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-start mb-8">
          
          {/* SECCIÓN 1 (IZQUIERDA): Dirección, Táchira-Venezuela, Iconos */}
          <div className="space-y-4 flex flex-col items-start text-left">
            <div>
              <h4 className="font-extrabold text-base text-gray-950 mb-1">Direccion</h4>
              <p className="text-xs sm:text-sm font-medium leading-relaxed text-[#1e293b]">
                La tienda más versátil de San Cristóbal<br />
                Ubicada en 📍Barrio Obrero;<br />
                calle 10 esquina, carrera 19.
              </p>
            </div>
            
            <h5 className="font-black text-lg sm:text-xl text-[#0f2540]">Tachira - Venezuela</h5>
            
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://www.instagram.com/tucajita.sc/"
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                title="Instagram @tucajita.sc"
              >
                <svg className="w-6 h-6 text-[#ffcc00]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://wa.me/584120177993"
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                title="WhatsApp +58 412-0177993"
              >
                <svg className="w-6 h-6 text-[#ffcc00]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </a>
            </div>
          </div>

          {/* SECCIÓN 2 (MEDIO): Horario de Atención y Días de Trabajo */}
          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-6 sm:gap-8 justify-start md:justify-center items-start">
            <div>
              <h4 className="font-extrabold text-base text-gray-950 mb-1">Horario de Atencion</h4>
              <p className="text-xs sm:text-sm font-medium leading-relaxed text-[#1e293b]">
                Desde las 10:00am a 1:00pm<br />
                Hasta las 2:30pm a 6:00pm
              </p>
            </div>

            <div>
              <h4 className="font-extrabold text-base text-gray-950 mb-2">Dias de Trabajo</h4>
              <div className="flex flex-col text-center font-black text-xs space-y-1 w-36 shadow-sm" style={{ fontFamily: "'Fredoka One', cursive", letterSpacing: '0.5px' }}>
                <div className="bg-[#f06e78] text-[#331c4f] py-1 px-3 rounded-sm">LUNES</div>
                <div className="bg-[#f2a249] text-[#331c4f] py-1 px-3 rounded-sm">MARTES</div>
                <div className="bg-[#f2e269] text-[#331c4f] py-1 px-3 rounded-sm">MIERCOLES</div>
                <div className="bg-[#6ec2c2] text-[#331c4f] py-1 px-3 rounded-sm">JUEVES</div>
                <div className="bg-[#6b9ae0] text-[#331c4f] py-1 px-3 rounded-sm">VIERNES</div>
                <div className="bg-[#8b7ad6] text-[#331c4f] py-1 px-3 rounded-sm">SABADO</div>
              </div>
            </div>
          </div>

          {/* SECCIÓN 3 (DERECHA): Logo Oficial */}
          <div className="flex justify-start md:justify-end items-center">
            <img
              src={logo}
              alt="Tu Cajita Logo"
              className="w-48 sm:w-56 lg:w-60 h-auto object-contain drop-shadow-md hover:scale-105 transition-transform"
            />
          </div>

        </div>

        {/* Bottom Bar: Políticas de Privacidad (izquierda) y Distribuidora de Cajas (derecha al mismo nivel) */}
        <div className="flex flex-col sm:flex-row justify-between items-center border-t border-amber-400/50 pt-5 mt-6 gap-3">
          <h5 className="font-black text-base sm:text-lg text-[#0f2540]">Politicas de Privacidad</h5>
          <h5 className="font-black text-base sm:text-lg text-[#0f2540]">Distribuidora de Cajas</h5>
        </div>

      </div>
    </footer>
  );
}
