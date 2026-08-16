import { useEffect, useRef, useState } from 'react';
import trabajoCumple from '../assets/trabajo_cumple.png';

const works = [
  {
    image: trabajoCumple,
    title: 'Caja Feliz Cumpleaños',
    category: 'Personalizado',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    image: null,
    title: 'Empaque Corporativo',
    category: 'Empresarial',
    gradient: 'from-blue-500 to-indigo-600',
    icon: (
      <svg className="w-16 h-16 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    image: null,
    title: 'Caja para Bigote',
    category: 'Creativo',
    gradient: 'from-amber-600 to-yellow-700',
    icon: (
      <svg className="w-16 h-16 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 14c-1.5 0-2.5-.5-3.5-1.5S7 10.5 5.5 10.5c-2 0-3.5 1.5-3.5 3 0 2 2 3.5 4.5 3.5 2 0 3.5-1 5.5-3zm0 0c1.5 0 2.5-.5 3.5-1.5S17 10.5 18.5 10.5c2 0 3.5 1.5 3.5 3 0 2-2 3.5-4.5 3.5-2 0-3.5-1-5.5-3z"/>
      </svg>
    ),
  },
  {
    image: null,
    title: 'Diseño Premium',
    category: 'Exclusivo',
    gradient: 'from-emerald-500 to-teal-600',
    icon: (
      <svg className="w-16 h-16 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
  },
];

export default function OurWork() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="productos"
      ref={sectionRef}
      className="py-16 md:py-24 bg-gradient-to-b from-white via-amber-50/30 to-white"
    >
      <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-24">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 font-semibold text-sm px-5 py-2 rounded-full mb-4 uppercase tracking-widest">
            Portafolio
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-800 mb-4"
            style={{ fontFamily: "'Fredoka One', cursive" }}
          >
            Nuestro Trabajo
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full" />
        </div>

        {/* Work grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {works.map((work, index) => (
            <div
              key={work.title}
              className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-700 ${
                visible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="aspect-square relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                {/* Image or placeholder */}
                {work.image ? (
                  <img
                    src={work.image}
                    alt={work.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${work.gradient} flex items-center justify-center`}>
                    <div className="text-center text-white/90">
                      {work.icon}
                    </div>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <span className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
                    {work.category}
                  </span>
                  <h3 className="text-white font-bold text-sm sm:text-base">
                    {work.title}
                  </h3>
                </div>

                {/* Corner badge */}
                <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA button */}
        <div className="text-center mt-16 md:mt-24 mb-4 md:mb-8">
          <a
            href="#contacto"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold text-lg px-10 py-4 rounded-full shadow-lg shadow-amber-200/50 hover:shadow-xl hover:shadow-amber-300/50 transition-all duration-300 hover:-translate-y-1"
          >
            Ver más trabajos
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
