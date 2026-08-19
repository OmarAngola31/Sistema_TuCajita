import sampleHappyday from '../assets/sample_happyday.png';
import sampleCasita from '../assets/sample_casita.png';
import empaquesLujo from '../assets/empaques_lujo.png';
import pequenos from '../assets/pequenos.png';
import unicolor from '../assets/unicolor.png';
import portavasos from '../assets/portavasos.png';
import trabajoCumple from '../assets/trabajo_cumple.png';

export const categoriesList = [
  { id: 'all', name: 'Todas las categorías', image: empaquesLujo, type: 'all' },
  // Cajas
  { id: 'especial', name: 'Diseño especial', image: sampleHappyday, type: 'cajas' },
  { id: 'microcorrugados', name: 'Microcorrugados', image: sampleCasita, type: 'cajas' },
  { id: 'unicolor', name: 'Unicolor', image: unicolor, type: 'cajas' },
  { id: 'unicolor-blanco', name: 'Unicolor Blanco', image: pequenos, type: 'cajas' },
  { id: 'portavasos', name: 'Portavasos', image: portavasos, type: 'cajas' },
  // Arreglos
  { id: 'arreglos-florales', name: 'Arreglos Florales', image: sampleHappyday, type: 'arreglos' },
  { id: 'arreglos-dulces', name: 'Arreglos con Dulces', image: trabajoCumple, type: 'arreglos' },
  { id: 'arreglos-mixtos', name: 'Arreglos Mixtos', image: empaquesLujo, type: 'arreglos' },
  { id: 'arreglos-cumple', name: 'Arreglos Cumpleaños', image: sampleCasita, type: 'arreglos' },
  // Eventos
  { id: 'eventos-bodas', name: 'Bodas & Aniversarios', image: empaquesLujo, type: 'eventos' },
  { id: 'eventos-cumple', name: 'Fiestas & Cumpleaños', image: trabajoCumple, type: 'eventos' },
  { id: 'eventos-babyshower', name: 'Baby Shower & Bautizo', image: pequenos, type: 'eventos' },
  { id: 'eventos-corporativo', name: 'Eventos Corporativos', image: unicolor, type: 'eventos' },
];

export const productsData = [
  // ──────────────── Destacados ────────────────
  {
    id: 1,
    name: 'Caja Happy Day Corazón',
    price: 89.99,
    category: 'especial',
    categoryName: 'Empaques de lujo',
    type: 'cajas',
    image: sampleHappyday,
    featured: true,
    description: 'Hermosa caja en forma de corazón con diseño "Happy Day", ideal para regalos de aniversario o San Valentín.',
    badge: 'Destacado'
  },
  {
    id: 2,
    name: 'Caja Casita con Ventana',
    price: 89.99,
    category: 'microcorrugados',
    categoryName: 'Empaques de lujo',
    type: 'cajas',
    image: sampleCasita,
    featured: true,
    description: 'Caja decorativa tipo casita con ventanas transparentes e ilustración vintage de bicicleta y plantas.',
    badge: 'Destacado'
  },
  {
    id: 3,
    name: 'Caja de Lujo Premium Gold',
    price: 89.99,
    category: 'especial',
    categoryName: 'Microcorrugados',
    type: 'cajas',
    image: empaquesLujo,
    featured: true,
    description: 'Caja dorada de textura brillante con acabados finos y cierre magnético.',
    badge: 'Destacado'
  },
  {
    id: 19,
    name: 'Arreglo Dulce Amor Sorpresa',
    price: 119.99,
    category: 'arreglos-dulces',
    categoryName: 'Arreglos con Dulces',
    type: 'arreglos',
    image: trabajoCumple,
    featured: true,
    description: 'Caja decorada con arreglo de chocolates premium, rosas y globo personalizado.',
    badge: 'Destacado'
  },
  {
    id: 25,
    name: 'Bouquet Rosas en Caja Luxury',
    price: 129.99,
    category: 'arreglos-florales',
    categoryName: 'Arreglos Florales',
    type: 'arreglos',
    image: sampleHappyday,
    featured: true,
    description: 'Elegante caja redonda con rosas naturales seleccionadas y cinta de seda.',
    badge: 'Destacado'
  },
  {
    id: 26,
    name: 'Arreglo Cumpleaños Globos & Snack',
    price: 99.99,
    category: 'arreglos-cumple',
    categoryName: 'Arreglos Cumpleaños',
    type: 'arreglos',
    image: sampleCasita,
    featured: true,
    description: 'Caja decorada con globo metalizado, snacks importados y tarjeta dedicatoria.',
    badge: 'Destacado'
  },
  {
    id: 20,
    name: 'Set Recuerdos Deluxe Bodas',
    price: 149.99,
    category: 'eventos-bodas',
    categoryName: 'Bodas & Aniversarios',
    type: 'eventos',
    image: empaquesLujo,
    featured: true,
    description: 'Pack de 24 cajitas temáticas con acabado perlado para mesas de boda.',
    badge: 'Destacado'
  },
  {
    id: 27,
    name: 'Combo Cotillón Fiesta Cumpleaños',
    price: 89.99,
    category: 'eventos-cumple',
    categoryName: 'Fiestas & Cumpleaños',
    type: 'eventos',
    image: trabajoCumple,
    featured: true,
    description: 'Set de 15 cajitas tipo sorpresa con temática personalizable para fiestas infantiles.',
    badge: 'Destacado'
  },
  {
    id: 28,
    name: 'Pack Baby Shower Dulce Espera',
    price: 109.99,
    category: 'eventos-babyshower',
    categoryName: 'Baby Shower & Bautizo',
    type: 'eventos',
    image: pequenos,
    featured: true,
    description: 'Set de 20 cajitas en tonos pastel con lazo satinado y detalles troquelados.',
    badge: 'Destacado'
  },
  {
    id: 29,
    name: 'Caja Regalo Corporativo Elegance',
    price: 139.99,
    category: 'eventos-corporativo',
    categoryName: 'Eventos Corporativos',
    type: 'eventos',
    image: unicolor,
    featured: true,
    description: 'Caja rígida imantada con logo empresarial estampado y soporte interior.',
    badge: 'Destacado'
  },

  // Para ti (Page 1)
  {
    id: 4,
    name: 'Caja Corazón Romántica',
    price: 89.99,
    category: 'especial',
    categoryName: 'Detalles (extracto)',
    type: 'cajas',
    image: sampleHappyday,
    forYou: true,
    page: 1,
    description: 'Empaque de amor de alta resistencia con asas ergonómicas y estampado de corazones blancos.'
  },
  {
    id: 5,
    name: 'Caja Casita Ventana Transparente',
    price: 89.99,
    category: 'microcorrugados',
    categoryName: 'Detalles (extracto)',
    type: 'cajas',
    image: sampleCasita,
    forYou: true,
    page: 1,
    description: 'Excelente opción para repostería, figuras de colección o regalos creativos visibles.'
  },
  {
    id: 6,
    name: 'Caja Unicolor Negra Elegante',
    price: 89.99,
    category: 'unicolor',
    categoryName: 'Detalles (extracto)',
    type: 'cajas',
    image: unicolor,
    forYou: true,
    page: 1,
    description: 'Caja rígida tono negro mate de alta resistencia, adaptable a cualquier tipo de celebración corporativa o personal.'
  },
  {
    id: 7,
    name: 'Caja Mini Sorpresa Cumpleaños',
    price: 89.99,
    category: 'unicolor-blanco',
    categoryName: 'Detalles (extracto)',
    type: 'cajas',
    image: trabajoCumple,
    forYou: true,
    page: 1,
    description: 'Mini cajita personalizada con lazo y tarjetas intercambiables.'
  },
  {
    id: 8,
    name: 'Portavasos Múltiple Ecológico',
    price: 89.99,
    category: 'portavasos',
    categoryName: 'Detalles (extracto)',
    type: 'cajas',
    image: portavasos,
    forYou: true,
    page: 1,
    description: 'Base de cartón reforzado para transporte de bebidas y postres individuales.'
  },
  {
    id: 9,
    name: 'Caja Pequeños Detalles',
    price: 89.99,
    category: 'unicolor-blanco',
    categoryName: 'Detalles (extracto)',
    type: 'cajas',
    image: pequenos,
    forYou: true,
    page: 1,
    description: 'Caja compacta blanca satinada ideal para bisutería y recuerdos.'
  },

  // Page 2
  {
    id: 10,
    name: 'Caja Amor Happy Day Pink',
    price: 89.99,
    category: 'especial',
    categoryName: 'Detalles (extracto)',
    type: 'cajas',
    image: sampleHappyday,
    forYou: true,
    page: 2,
    description: 'Variación de color rojo vibrante con asas de corazón.'
  },
  {
    id: 11,
    name: 'Caja Casita Jardín',
    price: 89.99,
    category: 'microcorrugados',
    categoryName: 'Detalles (extracto)',
    type: 'cajas',
    image: sampleCasita,
    forYou: true,
    page: 2,
    description: 'Diseño arquitectónico con gran visualización frontal y lateral.'
  },
  {
    id: 12,
    name: 'Caja Regalo Lujo Especial',
    price: 89.99,
    category: 'especial',
    categoryName: 'Detalles (extracto)',
    type: 'cajas',
    image: empaquesLujo,
    forYou: true,
    page: 2,
    description: 'Empaque de lujo reforzado con cinta decorativa satinada.'
  },
  {
    id: 13,
    name: 'Caja Unicolor Premium Matte',
    price: 89.99,
    category: 'unicolor',
    categoryName: 'Detalles (extracto)',
    type: 'cajas',
    image: unicolor,
    forYou: true,
    page: 2,
    description: 'Diseño limpio y moderno para grabados o stickers personalizados.'
  },
  {
    id: 14,
    name: 'Set Portavasos x4',
    price: 89.99,
    category: 'portavasos',
    categoryName: 'Detalles (extracto)',
    type: 'cajas',
    image: portavasos,
    forYou: true,
    page: 2,
    description: 'Portavasos doble compartimiento en cartón microcorrugado.'
  },
  {
    id: 15,
    name: 'Cajita Dulces Pequeños',
    price: 89.99,
    category: 'unicolor-blanco',
    categoryName: 'Detalles (extracto)',
    type: 'cajas',
    image: pequenos,
    forYou: true,
    page: 2,
    description: 'Ideal para macarons, trufas y bombones de chocolate.'
  },

  // Arreglos & Eventos items (forYou list)
  {
    id: 21,
    name: 'Arreglo Floral Romántico',
    price: 99.99,
    category: 'arreglos-florales',
    categoryName: 'Arreglos Florales',
    type: 'arreglos',
    image: sampleHappyday,
    forYou: true,
    page: 1,
    description: 'Caja hexagonal con arreglo de flores eternas y follaje decorativo.'
  },
  {
    id: 22,
    name: 'Arreglo Candy Bar Festivo',
    price: 109.99,
    category: 'arreglos-dulces',
    categoryName: 'Arreglos con Dulces',
    type: 'arreglos',
    image: trabajoCumple,
    forYou: true,
    page: 1,
    description: 'Arreglo festivo con dulces variados, topper de feliz cumpleaños y lazo satinado.'
  },
  {
    id: 23,
    name: 'Pack Recuerdos de Boda',
    price: 159.99,
    category: 'eventos-bodas',
    categoryName: 'Bodas & Aniversarios',
    type: 'eventos',
    image: empaquesLujo,
    forYou: true,
    page: 1,
    description: 'Set de 24 cajitas artesanales blancas con detalles dorados para recuerdos de boda.'
  },
  {
    id: 24,
    name: 'Cajitas Cotillón Fiesta Temática',
    price: 79.99,
    category: 'eventos-cumple',
    categoryName: 'Fiestas & Cumpleaños',
    type: 'eventos',
    image: sampleCasita,
    forYou: true,
    page: 1,
    description: 'Pack de cajitas tipo casita personalizadas para fiestas y cotillones infantiles.'
  },

  // Page 3
  {
    id: 16,
    name: 'Caja Happy Day Edición Limitada',
    price: 89.99,
    category: 'especial',
    categoryName: 'Detalles (extracto)',
    type: 'cajas',
    image: sampleHappyday,
    forYou: true,
    page: 3,
    description: 'Edición especial de San Valentín con acabado barnizado.'
  },
  {
    id: 17,
    name: 'Caja Casita Infantil',
    price: 89.99,
    category: 'microcorrugados',
    categoryName: 'Detalles (extracto)',
    type: 'cajas',
    image: sampleCasita,
    forYou: true,
    page: 3,
    description: 'Perfecta para fiestas infantiles y recuerdos de cumpleaños.'
  },
  {
    id: 18,
    name: 'Caja Lujo Acabado Espejo',
    price: 89.99,
    category: 'especial',
    categoryName: 'Detalles (extracto)',
    type: 'cajas',
    image: empaquesLujo,
    forYou: true,
    page: 3,
    description: 'Caja con efecto espejo brillante y cierre seguro.'
  }
];
