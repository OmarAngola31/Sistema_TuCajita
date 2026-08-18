import { useEffect, useRef, useState } from 'react';
import empaquesLujo from '../assets/empaques_lujo.png';
import pequenos from '../assets/pequenos.png';
import unicolor from '../assets/unicolor.png';
import portavasos from '../assets/portavasos.png';

const categories = [
  {
    name: 'Empaques de Lujo',
    image: empaquesLujo,
    description: 'Cajas premium para regalos exclusivos',
    color: 'from-amber-500 to-yellow-600',
    bgLight: 'bg-amber-50',
  },
  {
    name: 'Los más Pequeños',
    image: pequenos,
    description: 'Mini cajas para detalles especiales',
    color: 'from-pink-500 to-rose-500',
    bgLight: 'bg-pink-50',
  },
  {
    name: 'Unicolor',
    image: unicolor,
    description: 'Cajas en colores sólidos elegantes',
    color: 'from-violet-500 to-purple-600',
    bgLight: 'bg-violet-50',
  },
  {
    name: 'Portavasos',
    image: portavasos,
    description: 'Porta bebidas ecológicos y prácticos',
    color: 'from-emerald-500 to-teal-600',
    bgLight: 'bg-emerald-50',
  },
];

export default function Categories({ onSelectCategory }) {
  const [visibleCards, setVisibleCards] = useState(new Set());
  const cardRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = cardRefs.current.indexOf(entry.target);
            if (index !== -1) {
              setTimeout(() => {
                setVisibleCards((prev) => new Set([...prev, index]));
              }, index * 150);
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="categorias" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-24">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 font-semibold text-sm px-5 py-2 rounded-full mb-4 uppercase tracking-widest">
            Explora
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-800 mb-4"
            style={{ fontFamily: "'Fredoka One', cursive" }}
          >
            Categorías Destacadas
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full" />
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {categories.map((cat, index) => (
            <div
              key={cat.name}
              ref={(el) => (cardRefs.current[index] = el)}
              onClick={() => onSelectCategory && onSelectCategory()}
              className={`group cursor-pointer transition-all duration-700 ${
                visibleCards.has(index)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
              }`}
            >
              <div className={`relative overflow-hidden rounded-2xl ${cat.bgLight} p-4 sm:p-6 transition-all duration-300 hover:shadow-xl hover:shadow-amber-100/40 hover:-translate-y-2 border border-gray-100`}>
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                {/* Image */}
                <div className="relative mb-4 overflow-hidden rounded-xl bg-white shadow-sm">
                  <div className="aspect-square flex items-center justify-center p-3">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Category name */}
                <h3 className="text-sm sm:text-base font-bold text-gray-800 text-center leading-tight">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-500 text-center mt-1 hidden sm:block">
                  {cat.description}
                </p>

                {/* Arrow indicator */}
                <div className={`mt-3 mx-auto w-8 h-8 rounded-full bg-gradient-to-br ${cat.color} flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300`}>
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
