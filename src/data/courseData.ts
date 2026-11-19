export interface CourseConfig {
  courseTitle: string;
  certification: string;
  organizer: string;
  cityState: string;
  altitudeTag: string;
  logoUrl: string;
  startDate: string;
  endDate: string;
  schedule: string;
  venue: string;
  priceMxn: string;
  priceIncludes: string;
  spotsAvailable: number;
  email: string;
  socialHandle: string;
  formEndpoint: string;
  instructor: {
    name: string;
    role: string;
    bio: string;
    highlights: string[];
  };
  director: {
    title: string;
    name: string;
    summary: string;
  };
}

export const COURSE_DATA: CourseConfig = {
  courseTitle: 'Del Fundamento al Juego: Metodología para Entrenadores de Iniciación',
  certification: 'Constancia de Entrenador Nivel C',
  organizer: 'Altura BC',
  cityState: 'Ciudad de México (CDMX)',
  altitudeTag: 'CDMX · 2,240 m',
  logoUrl: '/assets/aistudio/altura-bc-perfil-1080x1080_f56c00a5.png',
  startDate: '18 de abril de 2026',
  endDate: '17 de mayo de 2026',
  schedule: 'Sábados y domingos de 8:30 a 14:30 h (5 fines de semana)',
  venue: 'Cancha Central Altura BC · Av. División del Norte 2333, Col. General Anaya, Benito Juárez, CDMX',
  priceMxn: '$3,000 MXN',
  priceIncludes:
    'Manual metodológico digital, 64 h de formación, evaluaciones con rúbrica y Constancia de Entrenador Nivel C.',
  spotsAvailable: 24,
  email: 'inscripciones@alturabc.mx',
  socialHandle: '@alturabc.cdmx',
  // Reemplaza por tu URL de Formspree (https://formspree.io/f/tu-id) o Google Forms si deseas envío directo automático.
  formEndpoint: '',
  instructor: {
    name: 'Profesora: Leyanis Horta',
    role: 'Directora Metodológica en Altura BC · +15 años en cancha',
    bio: 'Licenciada en Cultura Física y Entrenadora certificada en categorías formativas. Nivel 1 de la Federación Catalana de Bàsquet en la ciudad de Barcelona, España. Ha impartido clases en la Escuela de Instructores de Baloncesto en La Habana (2005-2006), formando a más de 60 entrenadores de primer contacto en categorías de 8 a 14 años.',
    highlights: [
      '+15 temporadas dirigiendo categorías de 8 a 14 años y Seniors de 15 a 30 años, tanto femeninos como masculinos',
      'Especialista en diseño de tareas y enseñanza comprensiva',
      'Evaluadora metodológica en clínicas estatales de iniciación',
    ],
  },
  director: {
    title: 'Director de la academia',
    name: 'Lic. Oscar de Rojas',
    summary:
      'Entrenador con +25 años de experiencia y árbitro internacional. Actual colaborador en el departamento de árbitros como consultor en las ligas profesionales de México.',
  },
};

export function getWhatsAppRedirectHref(message: string): string {
  return `/ir-whatsapp?msg=${encodeURIComponent(message)}`;
}

export const COURSE_METRICS = [
  {
    value: 64,
    suffix: '',
    label: 'Horas de formación',
    detail: '38 horas prácticas directamente en cancha y 26 horas de análisis y diseño.',
  },
  {
    value: 5,
    suffix: '',
    label: 'Bloques formativos',
    detail: 'Secuencia progresiva desde cómo aprende el niño hasta gestión de grupo.',
  },
  {
    value: 70,
    suffix: ' %',
    label: 'Tiempo en acción',
    detail: 'Estándar práctico por sesión para que cada jugador toque el balón y decida.',
  },
  {
    value: 1,
    suffix: '',
    label: 'Constancia Nivel C',
    detail: 'Acreditación respaldada por evaluación teórica, práctica en cancha y asistencia.',
  },
];

export const OUTCOMES = [
  {
    num: '01',
    title: 'Demostrar y explicar los fundamentos en menos de un minuto',
    description:
      'Sintetiza la consigna clave y muéstrala con claridad para que el grupo empiece a jugar de inmediato sin perder atención.',
  },
  {
    num: '02',
    title: 'Planificar sesiones de 60 a 90 minutos con objetivos claros',
    description:
      'Estructura cada entrenamiento con coherencia entre calentamiento, progresión técnico-táctica y juego real.',
  },
  {
    num: '03',
    title: 'Diseñar ejercicios y progresiones con transferencia al juego',
    description:
      'Transforma filas estáticas en situaciones dinámicas donde los jugadores leen espacios, compañeros y rivales.',
  },
  {
    num: '04',
    title: 'Detectar errores y corregirlos con una indicación breve',
    description:
      'Aprende qué corregir primero, cómo dar retroalimentación positiva y cuándo intervenir sin frenar el ritmo de la práctica.',
  },
  {
    num: '05',
    title: 'Dirigir un grupo con orden y un clima de aprendizaje',
    description:
      'Establece rutinas ágiles, transiciones rápidas entre tareas y un ambiente seguro que motive a volver al siguiente entrenamiento.',
  },
];

export const TIMELINE_STEPS = [
  {
    tag: 'Módulo introductorio',
    hours: 'Inicio',
    title: 'Cómo se aprende',
    description:
      'Habilidades técnico-tácticas, fases del aprendizaje motor y principios de transferencia en niños de 8 a 14 años.',
  },
  {
    tag: 'Etapa 1 · Iniciación',
    hours: '20 h',
    title: 'Base motriz y balón',
    description:
      'Posición básica, desplazamientos, paradas, pivote y bote con visión periférica bajo presión progresiva.',
  },
  {
    tag: 'Etapa 2 · Desarrollo',
    hours: '20 h',
    title: 'Conexión y finalización',
    description:
      'Pase en movimiento, recepción orientada, mecánica funcional de tiro y entradas a canasta desde ángulos reales.',
  },
  {
    tag: 'Etapa 3 · Consolidación',
    hours: '20 h',
    title: 'Duelo y juego reducido',
    description:
      'Defensa individual, rebote, lectura del 1x1 y principios colectivos en juegos reducidos (2x2, 3x3 y 4x4).',
  },
  {
    tag: 'Módulo final',
    hours: '4 h',
    title: 'Gestión de grupo',
    description:
      'Liderazgo formativo, normas claras, manejo de padres de familia, clima emocional e inclusión en cancha.',
  },
];

export const TOOLKIT_ELEMENTS = [
  {
    num: '01',
    name: 'Objetivos',
    explanation: 'Define exactamente qué habilidad técnico-táctica debe resolver el jugador en la tarea.',
  },
  {
    num: '02',
    name: 'Colaboración',
    explanation: 'Establece cuántas compañeras o compañeros interactúan y qué rol cumple cada uno.',
  },
  {
    num: '03',
    name: 'Oposición',
    explanation: 'Regula la presencia e intensidad defensiva: pasiva, condicionada o real.',
  },
  {
    num: '04',
    name: 'Orientación',
    explanation: 'Determina la dirección del ataque, las canastas válidas y la referencia espacial.',
  },
  {
    num: '05',
    name: 'Número de jugadores',
    explanation: 'Ajusta el formato (1x1, 2x1, 3x3) para multiplicar el contacto con el balón.',
  },
  {
    num: '06',
    name: 'Hándicap',
    explanation: 'Aplica ventajas o desventajas temporales para igualar niveles y forzar decisiones.',
  },
  {
    num: '07',
    name: 'Espacios',
    explanation: 'Delimita carriles, zonas restringidas o media cancha para provocar el gesto buscado.',
  },
  {
    num: '08',
    name: 'Tiempo',
    explanation: 'Introduce relojes cortos de posesión o transición para acelerar la lectura mental.',
  },
  {
    num: '09',
    name: 'Soporte cognitivo',
    explanation: 'Usa señales visuales o reglas de puntuación que obliguen a levantar la cabeza.',
  },
  {
    num: '10',
    name: 'Combinación de elementos',
    explanation: 'Mezcla dos o más variables para adaptar un mismo ejercicio a distintas edades.',
  },
];

export const EVALUATION_BREAKDOWN = [
  { label: 'Práctica de enseñanza con rúbrica', percent: 50, color: '#F2701C' },
  { label: 'Examen teórico', percent: 40, color: '#2B385B' },
  { label: 'Participación y trabajos', percent: 10, color: '#8F9BB5' },
];

export const CERTIFICATION_REQUIREMENTS = [
  {
    title: 'Mínimo 8.0 en cada etapa',
    detail: 'Evaluación continua por bloque para asegurar dominio práctico antes de avanzar.',
  },
  {
    title: '90 % de asistencia',
    detail: 'Presencia activa en las sesiones de cancha y aula (máximo 6 horas de falta justificada).',
  },
  {
    title: 'Plan de gestión de grupo apto',
    detail: 'Entrega y defensa de una planificación real para un grupo de iniciación.',
  },
];

export const FAQS = [
  {
    question: '¿Necesito haber jugado baloncesto?',
    answer:
      'No es requisito haber sido jugador federado. El curso está diseñado para aspirantes a entrenador, profesores de educación física, madres o padres de familia y exjugadores mayores de 18 años que quieran aprender a enseñar con orden y criterio.',
  },
  {
    question: '¿Qué edades aprenderé a entrenar?',
    answer:
      'Toda la metodología, progresiones y gestión de grupo están enfocadas en niñas y niños de 8 a 14 años, abarcando desde el primer contacto con el balón hasta la transición al juego colectivo.',
  },
  {
    question: '¿Qué pasa si falto a una sesión?',
    answer:
      'Para obtener la Constancia de Entrenador Nivel C necesitas al menos el 90 % de asistencia (puedes faltar hasta 6 horas por causa justificada). Si te ausentas, recibirás las notas teóricas y deberás completar la actividad de reposición asignada.',
  },
  {
    question: '¿Qué recibo al terminar?',
    answer:
      'Al cumplir con la asistencia, aprobar con mínimo 8.0 cada etapa y presentar tu plan de gestión de grupo apto, obtienes la Constancia de Entrenador Nivel C emitida por Altura BC, además del manual metodológico completo y las plantillas de sesión.',
  },
  {
    question: '¿Qué tengo que llevar?',
    answer:
      'Ropa y tenis cómodos para trabajar en cancha, silbato, botella de agua reutilizable y libreta o tableta para anotaciones. Los balones, conos, petos y material didáctico los proporciona Altura BC en sede.',
  },
  {
    question: '¿Cómo se paga?',
    answer:
      'Una vez que envíes tu preinscripción en el formulario, te confirmaremos disponibilidad por WhatsApp y correo con los datos para transferencia SPEI o depósito bancario. Puedes apartar tu lugar con el 50 % y liquidar el resto antes del inicio.',
  },
];
