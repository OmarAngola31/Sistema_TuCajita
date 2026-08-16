import logo from '../assets/logo.png';

export default function Footer() {
  return (
    <footer id="contacto" className="bg-[#ffcc00] text-[#0f172a] pt-8 pb-6 px-8 sm:px-12 lg:px-16">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Section: Flex container to push logo right */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-8">
          
          {/* Left side: 3 text columns */}
          <div className="flex flex-wrap lg:flex-nowrap gap-8 lg:gap-16">
            
            {/* Column 1: Direccion */}
            <div className="w-full sm:w-auto">
              <h4 className="font-bold text-base mb-1">Direccion</h4>
              <p className="text-sm font-medium mb-6 leading-relaxed text-[#1e293b]">
                La tienda más versátil de San Cristóbal<br />
                Ubicada en 📍Barrio Obrero;<br />
                calle 10 esquina, carrera 19.
              </p>
              <h5 className="font-bold text-xl mb-4 text-[#0f2540]">Tachira - Venezuela</h5>
              
              <div className="flex gap-4">
                <a href="https://www.instagram.com/tucajita.ve" target="_blank" rel="noreferrer" className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-sm">
                  <svg className="w-7 h-7 text-[#ffcc00]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                <a href="https://wa.me/584247465717" target="_blank" rel="noreferrer" className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-sm">
                  <svg className="w-7 h-7 text-[#ffcc00]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 2: Horario */}
            <div className="w-full sm:w-auto mt-4 sm:mt-0">
              <h4 className="font-bold text-base mb-1">Horario de Atencion</h4>
              <p className="text-sm font-medium leading-relaxed text-[#1e293b]">
                Desde las 10:00am a 1:00pm<br />
                Hasta las 2:30pm a 6:00pm
              </p>
            </div>

            {/* Column 3: Dias de Trabajo */}
            <div className="w-full sm:w-auto mt-4 sm:mt-0">
              <h4 className="font-bold text-base mb-1">Dias de Trabajo</h4>
              <div className="flex flex-col text-center font-bold text-sm" style={{ fontFamily: "'Fredoka One', cursive", letterSpacing: '1px' }}>
                <div className="bg-[#f06e78] text-[#331c4f] py-1.5 px-4 w-40">LUNES</div>
                <div className="bg-[#f2a249] text-[#331c4f] py-1.5 px-4 w-40">MARTES</div>
                <div className="bg-[#f2e269] text-[#331c4f] py-1.5 px-4 w-40">MIERCOLES</div>
                <div className="bg-[#6ec2c2] text-[#331c4f] py-1.5 px-4 w-40">JUEVES</div>
                <div className="bg-[#6b9ae0] text-[#331c4f] py-1.5 px-4 w-40">VIERNES</div>
                <div className="bg-[#8b7ad6] text-[#331c4f] py-1.5 px-4 w-40">SABADO</div>
              </div>
            </div>

          </div>

          {/* Right side: Logo */}
          <div className="flex justify-end lg:pr-12">
            <img src={logo} alt="Tu Cajita Logo" className="w-56 md:w-64 h-auto object-contain" />
          </div>

        </div>

        {/* Bottom Section: Footer text */}
        <div className="flex flex-col sm:flex-row justify-between items-end border-t border-transparent pt-4">
          <h5 className="font-bold text-xl sm:text-2xl text-[#0f2540] mb-4 sm:mb-0">Politicas de Privacidad</h5>
          <h5 className="font-bold text-xl sm:text-2xl text-[#0f2540]">Distribuidora de Cajas</h5>
        </div>

      </div>
    </footer>
  );
}
