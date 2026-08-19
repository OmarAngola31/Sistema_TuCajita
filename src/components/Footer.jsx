import logo from '../assets/logo.png';

export default function Footer() {
  return (
    <footer id="contacto" className="bg-[#ffcc00] text-[#0f172a] pt-2 pb-1.5 w-full" style={{ paddingLeft: '7%', paddingRight: '7%' }}>
      <div className="w-full mx-auto">

        {/* Sección Superior: 4 columnas balanceadas con Días de Trabajo un poco más a la derecha */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 lg:gap-8 mb-1">

          {/* Columna 1: Dirección */}
          <div className="min-w-[185px]">
            <h4 className="font-bold text-base sm:text-lg mb-0.5 text-[#0f2540]">Dirección</h4>
            <p className="text-xs sm:text-sm font-medium mb-1 leading-snug text-[#1e293b]">
              La tienda más versátil de San Cristóbal<br />
              Ubicada en 📍Barrio Obrero;<br />
              calle 10 esquina, carrera 19.
            </p>
            <h5 className="font-bold text-xs sm:text-sm mb-1 text-[#0f2540]">Táchira - Venezuela</h5>

            <div className="flex gap-2">
              <a
                href="https://www.instagram.com/tucajita.ve"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-xs"
                title="Instagram"
              >
                <svg className="w-3.5 h-3.5 text-[#ffcc00]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://wa.me/584247465717"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-xs"
                title="WhatsApp"
              >
                <svg className="w-3.5 h-3.5 text-[#ffcc00]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Columna 2: Horario */}
          <div className="min-w-[160px]">
            <h4 className="font-bold text-base sm:text-lg mb-0.5 text-[#0f2540]">Horario de Atención</h4>
            <p className="text-xs sm:text-sm font-medium leading-snug text-[#1e293b]">
              Desde las 10:00am a 1:00pm<br />
              Hasta las 2:30pm a 6:00pm
            </p>
          </div>

          {/* Columna 3: Días de Trabajo (con separación equilibrada a la derecha de Horario) */}
          <div className="min-w-[130px]">
            <h4 className="font-bold text-base sm:text-lg mb-0.5 text-[#0f2540]">Días de Trabajo</h4>
            <div
              className="flex flex-col text-center font-bold text-[9px] sm:text-[10px] shadow-xs rounded-lg overflow-hidden w-28 sm:w-32"
              style={{ fontFamily: "'Fredoka One', cursive", letterSpacing: '0.5px' }}
            >
              <div className="bg-[#f06e78] text-[#331c4f] py-0.5 px-2">LUNES</div>
              <div className="bg-[#f2a249] text-[#331c4f] py-0.5 px-2">MARTES</div>
              <div className="bg-[#f2e269] text-[#331c4f] py-0.5 px-2">MIÉRCOLES</div>
              <div className="bg-[#6ec2c2] text-[#331c4f] py-0.5 px-2">JUEVES</div>
              <div className="bg-[#6b9ae0] text-[#331c4f] py-0.5 px-2">VIERNES</div>
              <div className="bg-[#8b7ad6] text-[#331c4f] py-0.5 px-2">SÁBADO</div>
            </div>
          </div>

          {/* Columna 4: Logo a la derecha */}
          <div className="flex items-center shrink-0">
            <img src={logo} alt="Tu Cajita Logo" className="w-28 sm:w-36 md:w-40 h-auto object-contain drop-shadow-sm" />
          </div>

        </div>

        {/* Sección Inferior: Políticas de Privacidad y Distribuidora de Cajas */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-1 border-t border-[#0f172a]/15 text-xs sm:text-sm font-bold text-[#0f2540] gap-1">
          <span className="hover:underline cursor-pointer">Políticas de Privacidad</span>
          <span>Distribuidora de Cajas</span>
        </div>

      </div>
    </footer>
  );
}
