export interface SeoRouteMeta {
  path: string;
  label: string;
  title: string;
  description: string;
  keywords: string;
}

export const LOGO_PATH = '/assets/aistudio/altura-bc-perfil-1080x1080_f56c00a5.png';

export const SEO_ROUTES: Record<string, SeoRouteMeta> = {
  '/': {
    path: '/',
    label: 'Inicio',
    title: 'Del Fundamento al Juego · Curso Entrenadores Nivel C | Altura BC',
    description:
      'Formación práctica de 64 horas en CDMX para entrenar baloncesto de 8 a 14 años. Obtén tu Constancia Nivel C con Altura BC.',
    keywords:
      'curso entrenadores baloncesto cdmx, certificacion entrenador nivel c, metodologia iniciacion baloncesto, altura bc, entrenamiento basquetbol infantil',
  },
  '/temario': {
    path: '/temario',
    label: 'Temario 64 h',
    title: 'Temario y Recorrido de 64 Horas · Nivel C | Altura BC CDMX',
    description:
      'Conoce los 5 bloques del curso Del Fundamento al Juego: iniciación, desarrollo, consolidación en cancha y gestión de grupo.',
    keywords:
      'temario curso entrenador basquetbol, etapas iniciacion baloncesto, fundamentos basquetbol ninos, altura bc cdmx',
  },
  '/metodologia': {
    path: '/metodologia',
    label: 'Metodología',
    title: 'Metodología de Enseñanza y 10 Herramientas | Altura BC CDMX',
    description:
      'Domina el ciclo Percibir, Decidir y Ejecutar, el método Global-Analítico-Global y los 10 elementos para diseñar ejercicios.',
    keywords:
      'metodologia global analitica baloncesto, percibir decidir ejecutar basquetbol, diseno de ejercicios iniciacion',
  },
  '/certificacion-nivel-c': {
    path: '/certificacion-nivel-c',
    label: 'Certificación Nivel C',
    title: 'Certificación Entrenador Nivel C y Requisitos | Altura BC',
    description:
      'Descubre cómo se evalúa y obtiene la Constancia de Entrenador Nivel C: rúbrica en cancha, examen teórico y preguntas frecuentes.',
    keywords:
      'constancia entrenador nivel c, evaluacion rubrica basquetbol, requisitos entrenador iniciacion mexico',
  },
  '/inscripcion': {
    path: '/inscripcion',
    label: 'Inscripción',
    title: 'Inscripción al Curso Nivel C en CDMX · Altura BC',
    description:
      'Reserva una de las 24 plazas para el curso Del Fundamento al Juego en Ciudad de México. Consulta fechas, sede, costo e inscríbete.',
    keywords:
      'inscripcion curso basquetbol cdmx, curso entrenadores basquetbol precio, altura bc inscripcion nivel c',
  },
  '/aviso-de-privacidad': {
    path: '/aviso-de-privacidad',
    label: 'Aviso de Privacidad',
    title: 'Aviso de Privacidad · Altura BC CDMX',
    description:
      'Consulta el aviso de privacidad y tratamiento de datos personales de Altura BC para aspirantes al curso de Entrenador Nivel C.',
    keywords: 'aviso de privacidad altura bc, proteccion datos personales curso entrenadores',
  },
};

export function getRouteMeta(pathname: string): SeoRouteMeta {
  const normalized = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
  return SEO_ROUTES[normalized] ?? SEO_ROUTES['/'];
}

export function buildStructuredData(baseUrl: string, pathname: string): string {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const meta = getRouteMeta(pathname);
  const logoUrl = `${cleanBase}${LOGO_PATH}`;
  const pageUrl = `${cleanBase}${meta.path === '/' ? '' : meta.path}`;

  const organization = {
    '@type': 'EducationalOrganization',
    '@id': `${cleanBase}/#organization`,
    name: 'Altura BC',
    description:
      'Academia formativa de baloncesto en Ciudad de México enfocada en iniciación deportiva y formación de entrenadores.',
    url: cleanBase,
    logo: logoUrl,
    image: logoUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Cancha Central Altura BC · Av. División del Norte 2333, Col. General Anaya',
      addressLocality: 'Ciudad de México',
      addressRegion: 'CDMX',
      addressCountry: 'MX',
    },
    email: 'inscripciones@alturabc.mx',
  };

  const course = {
    '@type': 'Course',
    '@id': `${cleanBase}/#course`,
    name: 'Del Fundamento al Juego: Metodología para Entrenadores de Iniciación',
    description:
      'Programa de 64 horas (38 en cancha) para formar entrenadores de baloncesto en categorías de 8 a 14 años con Constancia de Entrenador Nivel C.',
    provider: { '@id': `${cleanBase}/#organization` },
    educationalCredentialAwarded: 'Constancia de Entrenador Nivel C',
    inLanguage: 'es-MX',
    timeRequired: 'PT64H',
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Onsite',
      location: {
        '@type': 'Place',
        name: 'Sede Altura BC · CDMX',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Ciudad de México',
          addressRegion: 'CDMX',
          addressCountry: 'MX',
        },
      },
      startDate: '2026-04-18',
      endDate: '2026-05-17',
    },
    offers: {
      '@type': 'Offer',
      price: '3000',
      priceCurrency: 'MXN',
      availability: 'https://schema.org/InStock',
      url: `${cleanBase}/inscripcion`,
    },
  };

  const faqPage = {
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '¿Necesito haber jugado baloncesto?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No es requisito haber sido jugador federado. El curso está diseñado para aspirantes a entrenador, profesores de educación física, madres, padres y exjugadores mayores de 18 años.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Qué edades aprenderé a entrenar?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Toda la metodología, progresiones y gestión de grupo están enfocadas en niñas y niños de 8 a 14 años.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Qué recibo al terminar?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Al cumplir el 90 % de asistencia, aprobar con mínimo 8.0 cada etapa y presentar tu plan de gestión de grupo apto, recibes la Constancia de Entrenador Nivel C y el manual metodológico.',
        },
      },
    ],
  };

  const breadcrumb = {
    '@type': 'BreadcrumbList',
    itemListElement:
      meta.path === '/'
        ? [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Inicio',
              item: cleanBase,
            },
          ]
        : [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Inicio',
              item: cleanBase,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: meta.label,
              item: pageUrl,
            },
          ],
  };

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      organization,
      course,
      breadcrumb,
      ...(meta.path === '/' || meta.path === '/certificacion-nivel-c' ? [faqPage] : []),
    ],
  });
}
