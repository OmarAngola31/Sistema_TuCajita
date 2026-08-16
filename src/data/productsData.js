import sampleHappyday from '../assets/sample_happyday.png';
import sampleCasita from '../assets/sample_casita.png';
import empaquesLujo from '../assets/empaques_lujo.png';
import pequenos from '../assets/pequenos.png';
import unicolor from '../assets/unicolor.png';
import portavasos from '../assets/portavasos.png';
import trabajoCumple from '../assets/trabajo_cumple.png';

export const categoriesList = [
  { id: 'all', name: 'Todas las categorías', image: empaquesLujo },
  { id: 'especial', name: 'Diseño especial', image: sampleHappyday },
  { id: 'microcorrugados', name: 'Microcorrugados', image: sampleCasita },
  { id: 'unicolor', name: 'Unicolor', image: unicolor },
  { id: 'unicolor-blanco', name: 'Unicolor Blanco', image: pequenos },
  { id: 'portavasos', name: 'Portavasos', image: portavasos },
];

export const productsData = [
  // Destacados
  {
    id: 1,
    name: 'Caja Happy Day Corazón',
    price: 89.99,
    category: 'especial',
    categoryName: 'Empaques de lujo',
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
    image: empaquesLujo,
    featured: true,
    description: 'Caja dorada de textura brillante con acabados finos y cierre magnético.',
    badge: 'Destacado'
  },

  // Para ti (Page 1)
  {
    id: 4,
    name: 'Caja Corazón Romántica',
    price: 89.99,
    category: 'especial',
    categoryName: 'Detalles (extracto)',
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
    image: pequenos,
    forYou: true,
    page: 2,
    description: 'Ideal para macarons, trufas y bombones de chocolate.'
  },

  // Page 3
  {
    id: 16,
    name: 'Caja Happy Day Edición Limitada',
    price: 89.99,
    category: 'especial',
    categoryName: 'Detalles (extracto)',
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
    image: empaquesLujo,
    forYou: true,
    page: 3,
    description: 'Caja con efecto espejo brillante y cierre seguro.'
  }
];
