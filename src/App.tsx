import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Mail,
  MapPin,
  MessageCircle,
  Send,
} from 'lucide-react';
import {
  CERTIFICATION_REQUIREMENTS,
  COURSE_DATA,
  COURSE_METRICS,
  EVALUATION_BREAKDOWN,
  FAQS,
  getWhatsAppRedirectHref,
  OUTCOMES,
  TIMELINE_STEPS,
  TOOLKIT_ELEMENTS,
} from './data/courseData';
import { getRouteMeta } from './data/seoRoutes';
import {
  CourtLinesWatermark,
  HalfCourtIllustration,
  InstructorPortrait,
} from './components/CourtSvg';
import { PrivacyModal } from './components/PrivacyModal';

interface RegistrationFormState {
  nombre: string;
  edad: string;
  ciudad: string;
  whatsapp: string;
  correo: string;
  experiencia: string;
  edadesObjetivo: string;
  formaPago: string;
  origen: string;
  aceptaPrivacidad: boolean;
}

const INITIAL_FORM: RegistrationFormState = {
  nombre: '',
  edad: '',
  ciudad: '',
  whatsapp: '',
  correo: '',
  experiencia: '',
  edadesObjetivo: '',
  formaPago: 'Pago único ($3,000 MXN)',
  origen: '',
  aceptaPrivacidad: false,
};

function normalizePath(path: string): string {
  if (!path || path === '/') return '/';
  const cleaned = path.split('?')[0].split('#')[0].replace(/\/+$/, '');
  return cleaned || '/';
}

const AnimatedCounter: React.FC<{
  target: number;
  suffix?: string;
  active: boolean;
}> = ({ target, suffix = '', active }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setDisplayValue(target);
      return;
    }

    let animationFrameId = 0;
    const duration = 900;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(eased * target));
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [active, target]);

  return (
    <span className="tabular-nums">
      {displayValue}
      {suffix}
    </span>
  );
};

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() =>
    typeof window !== 'undefined' ? normalizePath(window.location.pathname) : '/'
  );
  const [metricsVisible, setMetricsVisible] = useState(false);
  const metricsRef = useRef<HTMLElement | null>(null);

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const [form, setForm] = useState<RegistrationFormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof RegistrationFormState, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<RegistrationFormState | null>(null);
  const [submitWarning, setSubmitWarning] = useState<string | null>(null);

  // Sync browser history navigation & dynamic SEO head tags
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const meta = getRouteMeta(currentPath);
    document.title = meta.title;

    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) descEl.setAttribute('content', meta.description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', meta.title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', meta.description);

    const canonicalEl = document.querySelector('link[rel="canonical"]');
    const fullUrl = `${window.location.origin}${meta.path === '/' ? '/' : meta.path}`;
    if (canonicalEl) canonicalEl.setAttribute('href', fullUrl);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', fullUrl);
  }, [currentPath]);

  const navigateTo = (targetPath: string, hash?: string) => {
    const clean = normalizePath(targetPath);
    if (clean !== currentPath) {
      window.history.pushState({}, '', hash ? `${clean}#${hash}` : clean);
      setCurrentPath(clean);
    }

    if (hash) {
      requestAnimationFrame(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Scroll reveal observer
  useEffect(() => {
    const items = Array.from(document.querySelectorAll('.reveal-item'));
    if (items.length === 0) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [currentPath]);

  // Metrics counter trigger
  useEffect(() => {
    if (currentPath !== '/') return;
    const section = metricsRef.current;
    if (!section || typeof IntersectionObserver === 'undefined') {
      setMetricsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setMetricsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [currentPath]);

  const handleFieldChange = (
    field: keyof RegistrationFormState,
    value: string | boolean
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateForm = (): boolean => {
    const nextErrors: Partial<Record<keyof RegistrationFormState, string>> = {};

    if (form.nombre.trim().length < 3) {
      nextErrors.nombre = 'Escribe tu nombre completo.';
    }

    const parsedAge = Number(form.edad);
    if (!form.edad || Number.isNaN(parsedAge) || parsedAge < 18 || parsedAge > 90) {
      nextErrors.edad = 'Debes ser mayor de 18 años para inscribirte.';
    }

    if (form.ciudad.trim().length < 2) {
      nextErrors.ciudad = 'Indica tu ciudad y estado.';
    }

    const digitsOnly = form.whatsapp.replace(/\D/g, '');
    if (digitsOnly.length < 9) {
      nextErrors.whatsapp = 'Ingresa un número de WhatsApp válido (9 a 10 dígitos).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.correo.trim())) {
      nextErrors.correo = 'Ingresa un correo electrónico válido.';
    }

    if (!form.experiencia) {
      nextErrors.experiencia = 'Selecciona tu experiencia actual.';
    }

    if (!form.edadesObjetivo) {
      nextErrors.edadesObjetivo = 'Elige el rango de edades que te interesa entrenar.';
    }

    if (!form.origen) {
      nextErrors.origen = 'Cuéntanos cómo te enteraste del curso.';
    }

    if (!form.aceptaPrivacidad) {
      nextErrors.aceptaPrivacidad = 'Necesitas aceptar el aviso de privacidad para continuar.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const buildWhatsAppHref = (data: RegistrationFormState): string => {
    const message = [
      `Hola, quiero apartar mi lugar en el curso *${COURSE_DATA.courseTitle}* (${COURSE_DATA.startDate}) con Altura BC.`,
      '',
      `*Nombre:* ${data.nombre}`,
      `*Edad:* ${data.edad} años`,
      `*Ciudad:* ${data.ciudad}`,
      `*WhatsApp:* ${data.whatsapp}`,
      `*Correo:* ${data.correo}`,
      `*Experiencia:* ${data.experiencia}`,
      `*Edades a entrenar:* ${data.edadesObjetivo}`,
      `*Forma de pago elegida:* ${data.formaPago}`,
      `*Me enteré por:* ${data.origen}`,
    ].join('\n');

    return getWhatsAppRedirectHref(message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitWarning(null);
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (COURSE_DATA.formEndpoint) {
        const res = await fetch(COURSE_DATA.formEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            curso: COURSE_DATA.courseTitle,
            academia: COURSE_DATA.organizer,
            ...form,
          }),
        });

        if (!res.ok) {
          setSubmitWarning(
            'Tu registro quedó listo localmente, pero el servidor de formularios no respondió. Usa el botón de WhatsApp abajo para asegurar tu lugar al instante.'
          );
        }
      }
      setSubmittedData(form);
    } catch {
      setSubmitWarning(
        'No se pudo conectar con el servicio de envío automático. Envía tus datos directamente por WhatsApp con el botón de abajo.'
      );
      setSubmittedData(form);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappDirectUrl = getWhatsAppRedirectHref(
    `Hola, me interesa el curso "${COURSE_DATA.courseTitle}" (${COURSE_DATA.startDate}) de Altura BC. ¿Me das información para inscribirme?`
  );

  // Reusable section renderers
  const renderOutcomesSection = () => (
    <section id="resultados" className="py-16 sm:py-24 bg-[#F5F1EA] text-[#141A2B]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-12 reveal-item">
          <p className="text-xs sm:text-sm font-medium tracking-wide text-[#D95E0E]">
            Competencias prácticas
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-5xl font-bold uppercase tracking-tight text-[#141A2B] text-balance">
            Lo que sabrás hacer al terminar
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 reveal-item">
          {OUTCOMES.map((item, idx) => (
            <article
              key={item.num}
              className={`bg-[#FFFFFF]/70 border border-[#141A2B]/12 rounded-xl p-6 flex flex-col justify-between ${
                idx === 0 ? 'lg:col-span-2' : ''
              }`}
            >
              <div>
                <span className="font-display text-3xl font-bold text-[#F2701C] tabular-nums">
                  {item.num}
                </span>
                <h3 className="mt-3 font-display text-2xl font-semibold uppercase leading-snug text-[#141A2B]">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-[#141A2B]/80">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );

  const renderTimelineSection = () => (
    <section id="recorrido" className="pt-16 sm:pt-24 bg-[#141A2B] text-[#F5F1EA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-14 sm:pb-16">
        <div className="max-w-2xl mb-12 reveal-item">
          <p className="text-xs sm:text-sm font-medium tracking-wide text-[#F2701C]">
            Estructura de las 64 horas
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-5xl font-bold uppercase tracking-tight text-[#F5F1EA]">
            El recorrido
          </h2>
        </div>

        <div className="relative reveal-item">
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-4 left-0 right-0 h-px bg-[#F5F1EA]/25"
          />
          <div
            aria-hidden="true"
            className="lg:hidden absolute top-2 bottom-2 left-2.5 w-px bg-[#F5F1EA]/25"
          />

          <ol className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-5">
            {TIMELINE_STEPS.map((step) => (
              <li key={step.tag} className="relative pl-9 lg:pl-0 lg:pt-10">
                <span
                  aria-hidden="true"
                  className="absolute left-0.5 top-1.5 lg:top-2 lg:left-0 w-4 h-4 rounded-full bg-[#F2701C] ring-4 ring-[#141A2B]"
                />
                <div className="flex items-center gap-2 text-xs text-[#F2701C] font-medium tabular-nums">
                  <span>{step.tag}</span>
                  {step.hours !== 'Inicio' && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{step.hours}</span>
                    </>
                  )}
                </div>
                <h3 className="mt-1.5 font-display text-xl font-semibold uppercase text-[#F5F1EA]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#F5F1EA]/75">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="bg-[#F2701C] text-[#141A2B] py-4 px-4 sm:px-6">
        <p className="max-w-6xl mx-auto font-display text-lg sm:text-2xl font-bold uppercase tracking-wide text-center">
          Hilo conductor de todo el curso: metodología y diseño de ejercicios
        </p>
      </div>
    </section>
  );

  const renderMethodSection = () => (
    <section id="metodo" className="py-16 sm:py-24 bg-[#F5F1EA] text-[#141A2B]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-14">
        <div className="reveal-item">
          <p className="text-xs sm:text-sm font-medium tracking-wide text-[#D95E0E]">
            Cómo toma decisiones el jugador
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-5xl font-bold uppercase tracking-tight text-[#141A2B]">
            El método
          </h2>
        </div>

        <div className="reveal-item">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] items-stretch gap-4">
            <div className="bg-[#FFFFFF]/80 border border-[#141A2B]/12 rounded-xl p-6">
              <span className="text-xs font-medium text-[#D95E0E] tabular-nums">Fase 01</span>
              <h3 className="mt-1 font-display text-2xl sm:text-3xl font-bold uppercase text-[#141A2B]">
                Percibir
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#141A2B]/80">
                Leer la cancha: dónde están los compañeros, qué hace el defensor y qué espacio queda
                libre.
              </p>
            </div>

            <div className="flex items-center justify-center py-1 md:py-0 text-[#F2701C]">
              <ArrowRight className="w-6 h-6 rotate-90 md:rotate-0" aria-hidden="true" />
            </div>

            <div className="bg-[#FFFFFF]/80 border border-[#141A2B]/12 rounded-xl p-6">
              <span className="text-xs font-medium text-[#D95E0E] tabular-nums">Fase 02</span>
              <h3 className="mt-1 font-display text-2xl sm:text-3xl font-bold uppercase text-[#141A2B]">
                Decidir
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#141A2B]/80">
                Elegir la mejor respuesta en décimas de segundo: botar, pasar, fijar o tirar.
              </p>
            </div>

            <div className="flex items-center justify-center py-1 md:py-0 text-[#F2701C]">
              <ArrowRight className="w-6 h-6 rotate-90 md:rotate-0" aria-hidden="true" />
            </div>

            <div className="bg-[#141A2B] text-[#F5F1EA] rounded-xl p-6">
              <span className="text-xs font-medium text-[#F2701C] tabular-nums">Fase 03</span>
              <h3 className="mt-1 font-display text-2xl sm:text-3xl font-bold uppercase text-[#F5F1EA]">
                Ejecutar
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#F5F1EA]/80">
                Aplicar el gesto técnico con eficacia para resolver la situación de juego.
              </p>
            </div>
          </div>

          <p className="mt-6 text-base sm:text-lg font-medium text-[#141A2B] max-w-3xl leading-relaxed">
            Un ejercicio sin rivales ni compañeros solo entrena la última fase. Si el niño no tiene
            nada que leer ni decidir en la práctica, en el partido no sabrá qué hacer con el balón.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 reveal-item">
          <div className="border border-[#141A2B]/15 rounded-xl p-6 sm:p-8 bg-[#FFFFFF]/55">
            <h3 className="font-display text-2xl font-bold uppercase text-[#141A2B]">
              Metodología analítica
            </h3>
            <p className="mt-1 text-sm font-medium text-[#141A2B]/65">Controla el gesto técnico</p>
            <ul className="mt-4 space-y-2.5 text-sm sm:text-base text-[#141A2B]/85 leading-relaxed">
              <li>Aísla la mecánica del movimiento para corregir un detalle específico.</li>
              <li>Permite repeticiones limpias cuando el jugador apenas descubre el gesto.</li>
              <li>Limitación: si se abusa de ella, desconecta la técnica del juego real.</li>
            </ul>
          </div>

          <div className="border border-[#F2701C]/40 rounded-xl p-6 sm:p-8 bg-[#FFFFFF]/90">
            <h3 className="font-display text-2xl font-bold uppercase text-[#141A2B]">
              Metodología global
            </h3>
            <p className="mt-1 text-sm font-medium text-[#D95E0E]">
              Desarrolla la toma de decisiones
            </p>
            <ul className="mt-4 space-y-2.5 text-sm sm:text-base text-[#141A2B]/85 leading-relaxed">
              <li>Integra percepción, decisión y ejecución desde situaciones jugadas.</li>
              <li>Mantiene activos a todos los niños con reglas simples y objetivos claros.</li>
              <li>Genera transferencia directa al 3x3, 4x4 y partido de fin de semana.</li>
            </ul>
          </div>
        </div>

        <div className="bg-[#141A2B] text-[#F5F1EA] rounded-xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 reveal-item">
          <div>
            <p className="text-xs uppercase tracking-wider text-[#F2701C] font-medium">
              Criterio de sesión
            </p>
            <p className="mt-1 font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight">
              Método base: global → analítico → global
            </p>
          </div>
          <p className="text-sm sm:text-base text-[#F5F1EA]/80 max-w-md leading-relaxed">
            Planteas el problema de juego, ajustas el gesto necesario en un bloque breve y vuelves
            enseguida a aplicarlo con oposición real.
          </p>
        </div>
      </div>
    </section>
  );

  const renderToolkitSection = () => (
    <section id="herramientas" className="py-16 sm:py-24 bg-[#141A2B] text-[#F5F1EA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-12 reveal-item">
          <p className="text-xs sm:text-sm font-medium tracking-wide text-[#F2701C]">
            Diseño de tareas
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-5xl font-bold uppercase tracking-tight text-[#F5F1EA]">
            Tu caja de herramientas
          </h2>
          <p className="mt-3 text-base text-[#F5F1EA]/80 leading-relaxed">
            Los 10 elementos prácticos que dominarás para diseñar y ajustar cualquier ejercicio sin
            depender de recetas copiadas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 reveal-item">
          {TOOLKIT_ELEMENTS.map((tool) => (
            <div
              key={tool.num}
              className="bg-[#1B2338] border border-[#F5F1EA]/12 rounded-xl p-5 flex flex-col justify-between"
            >
              <div>
                <span className="font-display text-sm font-bold text-[#F2701C] tabular-nums">
                  {tool.num}
                </span>
                <h3 className="mt-1.5 font-display text-lg uppercase font-semibold text-[#F5F1EA]">
                  {tool.name}
                </h3>
              </div>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#F5F1EA]/75">
                {tool.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderNivelCSection = () => (
    <section id="certificacion" className="py-16 sm:py-24 bg-[#F5F1EA] text-[#141A2B]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="max-w-2xl reveal-item">
          <p className="text-xs sm:text-sm font-medium tracking-wide text-[#D95E0E]">
            Acreditación y criterios
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-5xl font-bold uppercase tracking-tight text-[#141A2B]">
            Cómo se obtiene el Nivel C
          </h2>
          <p className="mt-3 text-base text-[#141A2B]/80 leading-relaxed">
            La Constancia de Entrenador Nivel C emitida por Altura BC respalda tu capacidad real para
            planificar y dirigir una sesión en cancha.
          </p>
        </div>

        <div className="bg-[#FFFFFF]/80 border border-[#141A2B]/12 rounded-xl p-6 sm:p-8 reveal-item">
          <h3 className="font-display text-xl uppercase font-semibold text-[#141A2B]">
            Ponderación de evaluación
          </h3>

          <div
            className="mt-5 h-9 w-full rounded-lg overflow-hidden flex border border-[#141A2B]/15"
            role="img"
            aria-label="Evaluación: 50 % práctica de enseñanza con rúbrica, 40 % examen teórico, 10 % participación y trabajos"
          >
            <div
              style={{ width: '50%' }}
              className="bg-[#F2701C] text-[#141A2B] flex items-center justify-center font-display font-bold text-sm tabular-nums"
            >
              50 %
            </div>
            <div
              style={{ width: '40%' }}
              className="bg-[#141A2B] text-[#F5F1EA] flex items-center justify-center font-display font-bold text-sm tabular-nums"
            >
              40 %
            </div>
            <div
              style={{ width: '10%' }}
              className="bg-[#7D879E] text-[#141A2B] flex items-center justify-center font-display font-bold text-xs tabular-nums"
            >
              10 %
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-xs bg-[#141A2B] shrink-0" aria-hidden="true" />
              <span className="text-[#141A2B]/90">
                <strong className="tabular-nums">40 %</strong> examen teórico
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-xs bg-[#F2701C] shrink-0" aria-hidden="true" />
              <span className="text-[#141A2B]/90">
                <strong className="tabular-nums">50 %</strong> práctica de enseñanza con rúbrica
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-xs bg-[#7D879E] shrink-0" aria-hidden="true" />
              <span className="text-[#141A2B]/90">
                <strong className="tabular-nums">10 %</strong> participación y trabajos
              </span>
            </div>
          </div>
          <span className="sr-only">
            {EVALUATION_BREAKDOWN.map((b) => `${b.percent}% ${b.label}`).join(', ')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 reveal-item">
          {CERTIFICATION_REQUIREMENTS.map((req, idx) => (
            <div
              key={req.title}
              className="border border-[#141A2B]/15 rounded-xl p-6 bg-[#FFFFFF]/55"
            >
              <p className="font-display text-sm font-bold text-[#D95E0E] tabular-nums">
                Requisito 0{idx + 1}
              </p>
              <h3 className="mt-2 font-display text-xl uppercase font-semibold text-[#141A2B]">
                {req.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#141A2B]/80">{req.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderInstructorSection = () => (
    <section id="instructor" className="py-16 sm:py-24 bg-[#141A2B] text-[#F5F1EA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center reveal-item">
          <div className="lg:col-span-4">
            <InstructorPortrait
              src="/src/assets/images/instructor_coach_portrait_1795117387865.jpg"
              alt="Profesora Leyanis Horta en cancha de baloncesto"
              className="aspect-[3/4] max-w-xs mx-auto lg:mx-0"
            />
          </div>

          <div className="lg:col-span-8 space-y-4">
            <p className="text-xs sm:text-sm font-medium tracking-wide text-[#F2701C]">
              Tu instructor
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-bold uppercase tracking-tight text-[#F5F1EA]">
              {COURSE_DATA.instructor.name}
            </h2>
            <p className="text-base font-medium text-[#F5F1EA]/85">
              {COURSE_DATA.instructor.role}
            </p>
            <p className="text-base leading-relaxed text-[#F5F1EA]/80 max-w-2xl">
              {COURSE_DATA.instructor.bio}
            </p>

            <ul className="pt-2 space-y-2 text-sm text-[#F5F1EA]/85">
              {COURSE_DATA.instructor.highlights.map((line) => (
                <li key={line} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#F2701C] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#F5F1EA]/15 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 reveal-item">
          <div className="space-y-1.5 max-w-3xl">
            <p className="text-xs sm:text-sm font-medium tracking-wide text-[#F2701C]">
              {COURSE_DATA.director.title}
            </p>
            <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#F5F1EA]">
              {COURSE_DATA.director.name}
            </h3>
            <p className="text-sm sm:text-base leading-relaxed text-[#F5F1EA]/80">
              {COURSE_DATA.director.summary}
            </p>
          </div>
        </div>

        <div className="pt-10 border-t border-[#F5F1EA]/15 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 reveal-item">
          <div className="flex items-start gap-3.5">
            <img
              src={COURSE_DATA.logoUrl}
              alt="Escudo oficial de Altura BC CDMX"
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-full object-cover border border-[#F5F1EA]/20 shrink-0"
            />
            <div>
              <p className="text-xs text-[#F2701C] font-medium">Organiza</p>
              <p className="mt-0.5 text-base font-medium text-[#F5F1EA]">{COURSE_DATA.organizer}</p>
              <p className="text-sm text-[#F5F1EA]/70">{COURSE_DATA.altitudeTag}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-[#F2701C] font-medium">Fechas y horario</p>
            <p className="mt-1 text-base font-medium text-[#F5F1EA] tabular-nums">
              {COURSE_DATA.startDate} al {COURSE_DATA.endDate}
            </p>
            <p className="text-sm text-[#F5F1EA]/70">{COURSE_DATA.schedule}</p>
          </div>
          <div>
            <p className="text-xs text-[#F2701C] font-medium">Sede en cancha y aula</p>
            <p className="mt-1 text-sm leading-relaxed text-[#F5F1EA]/85">{COURSE_DATA.venue}</p>
          </div>
          <div>
            <p className="text-xs text-[#F2701C] font-medium">Inversión y qué incluye</p>
            <p className="mt-1 text-lg font-display font-bold text-[#F5F1EA] tabular-nums">
              {COURSE_DATA.priceMxn}
            </p>
            <p className="text-sm text-[#F5F1EA]/75">{COURSE_DATA.priceIncludes}</p>
          </div>
          <div>
            <p className="text-xs text-[#F2701C] font-medium">Cupo limitado</p>
            <p className="mt-1 text-base font-medium text-[#F5F1EA] tabular-nums">
              {COURSE_DATA.spotsAvailable} plazas disponibles
            </p>
            <p className="text-sm text-[#F5F1EA]/70">
              Grupo reducido para evaluar en cancha con retroalimentación real.
            </p>
          </div>
          <div>
            <p className="text-xs text-[#F2701C] font-medium">Atención directa</p>
            <div className="mt-1">
              <a
                href={whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#F5F1EA] hover:text-[#F2701C] underline underline-offset-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#F2701C]" aria-hidden="true" />
                <span>Escribir por WhatsApp</span>
              </a>
            </div>
            <p className="mt-1 text-sm text-[#F5F1EA]/75">{COURSE_DATA.email}</p>
          </div>
        </div>
      </div>
    </section>
  );

  const renderFaqSection = () => (
    <section id="preguntas" className="py-16 sm:py-24 bg-[#F5F1EA] text-[#141A2B]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-10 reveal-item">
          <p className="text-xs sm:text-sm font-medium tracking-wide text-[#D95E0E]">
            Resuelve tus dudas
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-5xl font-bold uppercase tracking-tight text-[#141A2B]">
            Preguntas frecuentes
          </h2>
        </div>

        <div className="divide-y divide-[#141A2B]/15 border-y border-[#141A2B]/15 reveal-item">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={faq.question}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${idx}`}
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full py-5 flex items-center justify-between gap-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2701C]"
                >
                  <span className="font-display text-xl sm:text-2xl font-semibold uppercase text-[#141A2B]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#F2701C] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <div
                    id={`faq-panel-${idx}`}
                    className="pb-5 pr-6 text-sm sm:text-base leading-relaxed text-[#141A2B]/80"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );

  const selectPaymentAndScroll = (optionId: string) => {
    handleFieldChange('formaPago', optionId);
    const el = document.getElementById('inscripcion');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderPricingSection = () => (
    <section
      id="precios"
      className="py-16 sm:py-24 bg-[#0E1320] text-[#F5F1EA] border-t border-[#F5F1EA]/12"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 reveal-item">
          <div>
            <p className="text-xs sm:text-sm font-medium tracking-wide text-[#F2701C]">
              Inversión transparente · Sin costos ocultos
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-5xl font-bold uppercase tracking-tight text-[#F5F1EA]">
              Precio y formas de pago
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#F5F1EA]/80 max-w-2xl leading-relaxed">
              {COURSE_DATA.priceIncludes}
            </p>
          </div>
          <div className="shrink-0">
            <p className="text-xs text-[#F5F1EA]/65">Costo total del curso</p>
            <p className="font-display text-4xl sm:text-5xl font-bold text-[#F2701C] tabular-nums">
              {COURSE_DATA.priceMxn}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 reveal-item">
          {COURSE_DATA.paymentOptions.map((option, idx) => (
            <div
              key={option.id}
              className={`rounded-xl p-6 sm:p-8 flex flex-col justify-between border ${
                idx === 1
                  ? 'bg-[#1B2338] border-[#F2701C]/50'
                  : 'bg-[#141A2B] border-[#F5F1EA]/15'
              }`}
            >
              <div>
                <p className="text-xs font-medium text-[#F2701C]">{option.label}</p>
                <div className="mt-2 flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#F5F1EA]">
                    {option.title}
                  </h3>
                  <span className="font-display text-2xl font-bold text-[#F2701C] tabular-nums whitespace-nowrap">
                    {option.amount}
                  </span>
                </div>
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#F5F1EA]/80">
                  {option.description}
                </p>
                <p className="mt-3 text-xs text-[#F5F1EA]/65">{option.note}</p>
              </div>

              <div className="mt-6 pt-5 border-t border-[#F5F1EA]/12">
                <button
                  type="button"
                  onClick={() => selectPaymentAndScroll(option.id)}
                  className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold text-sm transition-colors ${
                    idx === 1
                      ? 'bg-[#F2701C] hover:bg-[#D95E0E] text-[#141A2B]'
                      : 'bg-[#F5F1EA] hover:bg-[#EAE3D7] text-[#141A2B]'
                  }`}
                >
                  <span>Elegir {option.title.toLowerCase()}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs sm:text-sm text-[#F5F1EA]/70">
          Al enviar el formulario inferior recibirás los datos bancarios para transferencia SPEI o
          depósito y confirmación directa de tu plaza.
        </p>
      </div>
    </section>
  );

  const renderFormSection = () => (
    <section id="inscripcion" className="py-16 sm:py-24 bg-[#141A2B] text-[#F5F1EA] border-t border-[#F5F1EA]/12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-10 reveal-item">
          <p className="text-xs sm:text-sm font-medium tracking-wide text-[#F2701C]">
            Preinscripción en línea
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-5xl font-bold uppercase tracking-tight text-[#F5F1EA]">
            Reserva tu lugar
          </h2>
          <p className="mt-3 text-base text-[#F5F1EA]/80 leading-relaxed">
            Llena tus datos para apartar una de las{' '}
            <strong className="text-[#F5F1EA] tabular-nums">
              {COURSE_DATA.spotsAvailable} plazas
            </strong>{' '}
            ({COURSE_DATA.priceMxn}). Te responderemos con las instrucciones de pago y confirmación.
          </p>
        </div>

        {submittedData ? (
          <div className="bg-[#1B2338] border border-[#F2701C]/50 rounded-xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#F2701C] text-[#141A2B] flex items-center justify-center shrink-0">
                <Check className="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#F5F1EA]">
                  ¡Solicitud registrada, {submittedData.nombre.split(' ')[0]}!
                </h3>
                <p className="mt-1.5 text-sm sm:text-base text-[#F5F1EA]/85 leading-relaxed">
                  Recibimos tu preinscripción para <strong>«{COURSE_DATA.courseTitle}»</strong>. Para
                  agilizar la confirmación de tu plaza, envía ahora tus datos por WhatsApp con el
                  botón de abajo.
                </p>
              </div>
            </div>

            {submitWarning && (
              <p className="text-sm text-[#F5F1EA] bg-[#F2701C]/20 border border-[#F2701C]/40 rounded-lg p-3.5">
                {submitWarning}
              </p>
            )}

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm bg-[#141A2B] rounded-lg p-4 border border-[#F5F1EA]/10">
              <div>
                <dt className="text-[#F5F1EA]/60">Nombre</dt>
                <dd className="font-medium text-[#F5F1EA]">{submittedData.nombre}</dd>
              </div>
              <div>
                <dt className="text-[#F5F1EA]/60">Edad y ciudad</dt>
                <dd className="font-medium text-[#F5F1EA] tabular-nums">
                  {submittedData.edad} años · {submittedData.ciudad}
                </dd>
              </div>
              <div>
                <dt className="text-[#F5F1EA]/60">WhatsApp y correo</dt>
                <dd className="font-medium text-[#F5F1EA] tabular-nums">
                  {submittedData.whatsapp} · {submittedData.correo}
                </dd>
              </div>
              <div>
                <dt className="text-[#F5F1EA]/60">Perfil y edades</dt>
                <dd className="font-medium text-[#F5F1EA]">
                  {submittedData.experiencia} · {submittedData.edadesObjetivo}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-[#F5F1EA]/60">Forma de pago elegida</dt>
                <dd className="font-medium text-[#F2701C]">{submittedData.formaPago}</dd>
              </div>
            </dl>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href={buildWhatsAppHref(submittedData)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg bg-[#F2701C] hover:bg-[#D95E0E] text-[#141A2B] font-semibold text-sm sm:text-base transition-colors"
              >
                <MessageCircle className="w-5 h-5" aria-hidden="true" />
                <span>Enviar mis datos por WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setSubmittedData(null);
                  setForm(INITIAL_FORM);
                }}
                className="px-5 py-3.5 rounded-lg border border-[#F5F1EA]/25 text-sm font-medium text-[#F5F1EA] hover:bg-[#F5F1EA]/10 transition-colors"
              >
                Registrar a otra persona
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="bg-[#1B2338] border border-[#F5F1EA]/12 rounded-xl p-6 sm:p-8 space-y-6 reveal-item"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label htmlFor="nombre" className="block text-sm font-medium text-[#F5F1EA] mb-1.5">
                  Nombre completo *
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  value={form.nombre}
                  onChange={(e) => handleFieldChange('nombre', e.target.value)}
                  placeholder="Ej. María Fernanda López Hernández"
                  className="w-full px-4 py-3 rounded-lg bg-[#141A2B] border border-[#F5F1EA]/20 text-[#F5F1EA] placeholder:text-[#F5F1EA]/40 focus:outline-none focus:border-[#F2701C]"
                />
                {errors.nombre && (
                  <p className="mt-1.5 text-xs text-[#FF995A]" role="alert">
                    {errors.nombre}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="edad" className="block text-sm font-medium text-[#F5F1EA] mb-1.5">
                  Edad (mínimo 18 años) *
                </label>
                <input
                  id="edad"
                  name="edad"
                  type="number"
                  min={18}
                  max={90}
                  required
                  value={form.edad}
                  onChange={(e) => handleFieldChange('edad', e.target.value)}
                  placeholder="Ej. 28"
                  className="w-full px-4 py-3 rounded-lg bg-[#141A2B] border border-[#F5F1EA]/20 text-[#F5F1EA] placeholder:text-[#F5F1EA]/40 tabular-nums focus:outline-none focus:border-[#F2701C]"
                />
                {errors.edad && (
                  <p className="mt-1.5 text-xs text-[#FF995A]" role="alert">
                    {errors.edad}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="ciudad" className="block text-sm font-medium text-[#F5F1EA] mb-1.5">
                  Ciudad *
                </label>
                <input
                  id="ciudad"
                  name="ciudad"
                  type="text"
                  required
                  value={form.ciudad}
                  onChange={(e) => handleFieldChange('ciudad', e.target.value)}
                  placeholder="Ej. Coyoacán, CDMX"
                  className="w-full px-4 py-3 rounded-lg bg-[#141A2B] border border-[#F5F1EA]/20 text-[#F5F1EA] placeholder:text-[#F5F1EA]/40 focus:outline-none focus:border-[#F2701C]"
                />
                {errors.ciudad && (
                  <p className="mt-1.5 text-xs text-[#FF995A]" role="alert">
                    {errors.ciudad}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="whatsapp"
                  className="block text-sm font-medium text-[#F5F1EA] mb-1.5"
                >
                  Tu WhatsApp *
                </label>
                <input
                  id="whatsapp"
                  name="whatsapp"
                  type="tel"
                  required
                  value={form.whatsapp}
                  onChange={(e) => handleFieldChange('whatsapp', e.target.value)}
                  placeholder="Ej. 55 1234 5678"
                  className="w-full px-4 py-3 rounded-lg bg-[#141A2B] border border-[#F5F1EA]/20 text-[#F5F1EA] placeholder:text-[#F5F1EA]/40 tabular-nums focus:outline-none focus:border-[#F2701C]"
                />
                {errors.whatsapp && (
                  <p className="mt-1.5 text-xs text-[#FF995A]" role="alert">
                    {errors.whatsapp}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="correo" className="block text-sm font-medium text-[#F5F1EA] mb-1.5">
                  Correo electrónico *
                </label>
                <input
                  id="correo"
                  name="correo"
                  type="email"
                  required
                  value={form.correo}
                  onChange={(e) => handleFieldChange('correo', e.target.value)}
                  placeholder="nombre@correo.com"
                  className="w-full px-4 py-3 rounded-lg bg-[#141A2B] border border-[#F5F1EA]/20 text-[#F5F1EA] placeholder:text-[#F5F1EA]/40 focus:outline-none focus:border-[#F2701C]"
                />
                {errors.correo && (
                  <p className="mt-1.5 text-xs text-[#FF995A]" role="alert">
                    {errors.correo}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="experiencia"
                  className="block text-sm font-medium text-[#F5F1EA] mb-1.5"
                >
                  Experiencia *
                </label>
                <select
                  id="experiencia"
                  name="experiencia"
                  required
                  value={form.experiencia}
                  onChange={(e) => handleFieldChange('experiencia', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[#141A2B] border border-[#F5F1EA]/20 text-[#F5F1EA] focus:outline-none focus:border-[#F2701C]"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="Ninguna">Ninguna</option>
                  <option value="Entreno actualmente">Entreno actualmente</option>
                  <option value="Fui jugador">Fui jugador</option>
                  <option value="Soy profesor de educación física">
                    Soy profesor de educación física
                  </option>
                </select>
                {errors.experiencia && (
                  <p className="mt-1.5 text-xs text-[#FF995A]" role="alert">
                    {errors.experiencia}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="edadesObjetivo"
                  className="block text-sm font-medium text-[#F5F1EA] mb-1.5"
                >
                  ¿Con qué edades quieres trabajar? *
                </label>
                <select
                  id="edadesObjetivo"
                  name="edadesObjetivo"
                  required
                  value={form.edadesObjetivo}
                  onChange={(e) => handleFieldChange('edadesObjetivo', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[#141A2B] border border-[#F5F1EA]/20 text-[#F5F1EA] focus:outline-none focus:border-[#F2701C]"
                >
                  <option value="">Selecciona un rango</option>
                  <option value="8 a 10 años">8 a 10 años (iniciación)</option>
                  <option value="11 a 12 años">11 a 12 años (mini / infantil)</option>
                  <option value="13 a 14 años">13 a 14 años (pasarela)</option>
                  <option value="Todas las edades (8 a 14 años)">
                    Todas las edades (8 a 14 años)
                  </option>
                </select>
                {errors.edadesObjetivo && (
                  <p className="mt-1.5 text-xs text-[#FF995A]" role="alert">
                    {errors.edadesObjetivo}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="formaPago"
                  className="block text-sm font-medium text-[#F5F1EA] mb-1.5"
                >
                  Forma de pago preferida *
                </label>
                <select
                  id="formaPago"
                  name="formaPago"
                  required
                  value={form.formaPago}
                  onChange={(e) => handleFieldChange('formaPago', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[#141A2B] border border-[#F5F1EA]/20 text-[#F5F1EA] focus:outline-none focus:border-[#F2701C]"
                >
                  {COURSE_DATA.paymentOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.title} — {opt.amount}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="origen" className="block text-sm font-medium text-[#F5F1EA] mb-1.5">
                  ¿Cómo te enteraste del curso? *
                </label>
                <select
                  id="origen"
                  name="origen"
                  required
                  value={form.origen}
                  onChange={(e) => handleFieldChange('origen', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[#141A2B] border border-[#F5F1EA]/20 text-[#F5F1EA] focus:outline-none focus:border-[#F2701C]"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Redes sociales">Redes sociales</option>
                  <option value="Recomendación de un entrenador o conocido">
                    Recomendación de un entrenador o conocido
                  </option>
                  <option value="Club o escuela">Club o escuela</option>
                  <option value="Otro">Otro</option>
                </select>
                {errors.origen && (
                  <p className="mt-1.5 text-xs text-[#FF995A]" role="alert">
                    {errors.origen}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.aceptaPrivacidad}
                  onChange={(e) => handleFieldChange('aceptaPrivacidad', e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-[#F5F1EA]/30 bg-[#141A2B] accent-[#F2701C]"
                />
                <span className="text-sm text-[#F5F1EA]/85 leading-relaxed">
                  Acepto el{' '}
                  <button
                    type="button"
                    onClick={() => setPrivacyOpen(true)}
                    className="text-[#F2701C] underline underline-offset-2 hover:text-[#FF8D42] font-medium"
                  >
                    Aviso de Privacidad
                  </button>{' '}
                  y autorizo el uso de mis datos únicamente para gestionar mi inscripción al curso
                  Nivel C. *
                </span>
              </label>
              {errors.aceptaPrivacidad && (
                <p className="mt-1.5 text-xs text-[#FF995A]" role="alert">
                  {errors.aceptaPrivacidad}
                </p>
              )}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-lg bg-[#F2701C] hover:bg-[#D95E0E] disabled:opacity-60 text-[#141A2B] font-semibold text-base transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F1EA]"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
                <span>{isSubmitting ? 'Enviando...' : 'Reservar mi lugar'}</span>
              </button>

              <p className="text-xs text-[#F5F1EA]/65">
                También podrás enviar tu ficha directo por WhatsApp al completar el envío.
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  );

  const renderPageHeaderBanner = (title: string, subtitle: string, currentLabel: string) => (
    <section className="py-12 sm:py-16 bg-[#141A2B] border-b border-[#F5F1EA]/12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <nav aria-label="Ruta de navegación" className="flex items-center gap-2 text-xs text-[#F5F1EA]/70">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('/');
            }}
            className="inline-flex items-center gap-1 hover:text-[#F2701C] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Inicio</span>
          </a>
          <span aria-hidden="true">/</span>
          <span className="text-[#F2701C] font-medium">{currentLabel}</span>
        </nav>
        <h1 className="mt-4 font-display text-4xl sm:text-6xl font-bold uppercase tracking-tight text-[#F5F1EA] text-balance">
          {title}
        </h1>
        <p className="mt-3 text-base sm:text-lg text-[#F5F1EA]/80 max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      </div>
    </section>
  );

  const renderSubPageCtaBanner = () => (
    <section className="py-12 bg-[#F2701C] text-[#141A2B]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <p className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight">
            ¿Listo para formarte como Entrenador Nivel C?
          </p>
          <p className="mt-1 text-sm sm:text-base text-[#141A2B]/85 tabular-nums">
            Inicia {COURSE_DATA.startDate} en CDMX · {COURSE_DATA.spotsAvailable} plazas disponibles
          </p>
        </div>
        <a
          href="/inscripcion"
          onClick={(e) => {
            e.preventDefault();
            navigateTo('/inscripcion');
          }}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#141A2B] hover:bg-[#1E2740] text-[#F5F1EA] font-semibold text-sm sm:text-base transition-colors whitespace-nowrap shrink-0"
        >
          <span>Quiero inscribirme</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-[#141A2B] text-[#F5F1EA] overflow-x-hidden">
      {/* Barra superior fija: contrato de 3 zonas */}
      <header className="fixed top-0 inset-x-0 z-40 h-16 bg-[#141A2B]/95 backdrop-blur-xs border-b border-[#F5F1EA]/12">
        <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-8">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('/');
            }}
            className="inline-flex items-center gap-2.5 font-display text-lg sm:text-xl font-bold uppercase tracking-tight text-[#F5F1EA] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2701C]"
          >
            <img
              src={COURSE_DATA.logoUrl}
              alt="Logo Altura BC"
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover border border-[#F5F1EA]/25 shrink-0"
            />
            <span>Del Fundamento al Juego</span>
          </a>

          <nav
            aria-label="Navegación principal"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-[#F5F1EA]/80"
          >
            <a
              href="/temario"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/temario');
              }}
              className={`hover:text-[#F5F1EA] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
                currentPath === '/temario' ? 'text-[#F2701C]' : ''
              }`}
            >
              Temario
            </a>
            <a
              href="/metodologia"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/metodologia');
              }}
              className={`hover:text-[#F5F1EA] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
                currentPath === '/metodologia' ? 'text-[#F2701C]' : ''
              }`}
            >
              Método
            </a>
            <a
              href="/certificacion-nivel-c"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/certificacion-nivel-c');
              }}
              className={`hover:text-[#F5F1EA] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
                currentPath === '/certificacion-nivel-c' ? 'text-[#F2701C]' : ''
              }`}
            >
              Nivel C
            </a>
            <a
              href="/#precios"
              onClick={(e) => {
                e.preventDefault();
                if (currentPath === '/inscripcion') {
                  navigateTo('/inscripcion', 'precios');
                } else {
                  navigateTo('/', 'precios');
                }
              }}
              className="hover:text-[#F5F1EA] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Precios
            </a>
            <a
              href="/#preguntas"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/', 'preguntas');
              }}
              className="hover:text-[#F5F1EA] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Preguntas
            </a>
          </nav>

          <div className="shrink-0">
            <a
              href="/inscripcion"
              onClick={(e) => {
                e.preventDefault();
                if (currentPath === '/') {
                  navigateTo('/', 'inscripcion');
                } else {
                  navigateTo('/inscripcion');
                }
              }}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#F2701C] hover:bg-[#D95E0E] text-[#141A2B] text-sm font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F1EA]"
            >
              Inscríbete
            </a>
          </div>
        </div>
      </header>

      <main className="pt-16">
        {currentPath === '/temario' && (
          <>
            {renderPageHeaderBanner(
              'Temario y Recorrido de 64 Horas',
              'De cómo aprende el niño hasta la gestión real de grupo en cancha. Revisa los cinco bloques formativos y las competencias que dominarás al concluir.',
              'Temario 64 h'
            )}
            {renderTimelineSection()}
            {renderOutcomesSection()}
            {renderSubPageCtaBanner()}
          </>
        )}

        {currentPath === '/metodologia' && (
          <>
            {renderPageHeaderBanner(
              'Metodología de Enseñanza',
              'Entrena la percepción y la decisión antes del gesto aislado. Aplica el ciclo Global → Analítico → Global y los 10 elementos para diseñar tareas efectivas.',
              'Metodología'
            )}
            {renderMethodSection()}
            {renderToolkitSection()}
            {renderSubPageCtaBanner()}
          </>
        )}

        {currentPath === '/certificacion-nivel-c' && (
          <>
            {renderPageHeaderBanner(
              'Certificación Entrenador Nivel C',
              'Criterios transparentes de evaluación en cancha y aula, requisitos de acreditación, perfil del instructor y preguntas frecuentes.',
              'Certificación Nivel C'
            )}
            {renderNivelCSection()}
            {renderInstructorSection()}
            {renderFaqSection()}
            {renderSubPageCtaBanner()}
          </>
        )}

        {currentPath === '/inscripcion' && (
          <>
            {renderPageHeaderBanner(
              'Inscripción al Curso Nivel C',
              `Sede en ${COURSE_DATA.cityState} · ${COURSE_DATA.startDate} al ${COURSE_DATA.endDate}. Aparta una de las ${COURSE_DATA.spotsAvailable} plazas disponibles.`,
              'Inscripción'
            )}
            {renderPricingSection()}
            {renderFormSection()}
            {renderInstructorSection()}
          </>
        )}

        {currentPath === '/aviso-de-privacidad' && (
          <>
            {renderPageHeaderBanner(
              'Aviso de Privacidad',
              `Tratamiento y protección de datos personales para aspirantes del curso ${COURSE_DATA.courseTitle} organizado por ${COURSE_DATA.organizer}.`,
              'Aviso de Privacidad'
            )}
            <section className="py-16 bg-[#F5F1EA] text-[#141A2B]">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6 text-base leading-relaxed text-[#141A2B]/85">
                <p>
                  En cumplimiento con la Ley Federal de Protección de Datos Personales en Posesión
                  de los Particulares (México), <strong>{COURSE_DATA.organizer}</strong>, con sede
                  en {COURSE_DATA.cityState}, es responsable del uso y protección de los datos
                  personales proporcionados por las personas interesadas en el curso{' '}
                  <em>«{COURSE_DATA.courseTitle}»</em>.
                </p>
                <div>
                  <h2 className="font-display text-2xl font-bold uppercase text-[#141A2B]">
                    1. Datos personales recabados
                  </h2>
                  <p className="mt-2">
                    Recabamos nombre completo, edad, ciudad de residencia, número de WhatsApp de
                    contacto, correo electrónico, experiencia previa, edades objetivo de
                    entrenamiento y medio por el cual conociste la convocatoria.
                  </p>
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold uppercase text-[#141A2B]">
                    2. Finalidad del tratamiento
                  </h2>
                  <p className="mt-2">
                    Los datos se utilizan exclusivamente para gestionar tu preinscripción, brindarte
                    detalles logísticos de sede, horarios y pagos, evaluar tu avance y emitir tu{' '}
                    <strong>{COURSE_DATA.certification}</strong>. No transferimos ni comercializamos
                    tu información con terceros.
                  </p>
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold uppercase text-[#141A2B]">
                    3. Derechos ARCO
                  </h2>
                  <p className="mt-2">
                    Para acceder, rectificar, cancelar u oponerte al uso de tus datos personales,
                    escribe a{' '}
                    <a
                      href={`mailto:${COURSE_DATA.email}`}
                      className="text-[#D95E0E] font-medium underline underline-offset-2"
                    >
                      {COURSE_DATA.email}
                    </a>
                    .
                  </p>
                </div>
                <div className="pt-4">
                  <a
                    href="/inscripcion"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('/inscripcion');
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#141A2B] text-[#F5F1EA] font-medium text-sm hover:bg-[#1E2740] transition-colors"
                  >
                    <span>Ir al formulario de inscripción</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </section>
          </>
        )}

        {currentPath === '/' && (
          <>
            {/* 1. HERO */}
            <section
              id="inicio"
              className="relative py-14 sm:py-20 lg:py-24 bg-[#141A2B] border-b border-[#F5F1EA]/10 overflow-hidden"
            >
              <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-12">
                <div className="lg:col-span-7 space-y-6">
                  <p className="text-xs sm:text-sm font-medium tracking-wide text-[#F2701C]">
                    {COURSE_DATA.organizer} · {COURSE_DATA.altitudeTag}
                  </p>

                  <h1 className="font-display text-5xl sm:text-6xl lg:text-[4.25rem] font-bold uppercase leading-[0.96] tracking-tight text-[#F5F1EA] text-balance">
                    Del Fundamento al Juego
                  </h1>

                  <p className="text-lg sm:text-xl text-[#F5F1EA]/90 font-normal leading-relaxed max-w-xl">
                    Metodología para entrenadores de iniciación · Nivel C
                  </p>

                  <p className="text-sm sm:text-base text-[#F5F1EA]/75 leading-relaxed max-w-xl">
                    Formación práctica para entrenar a niñas y niños de 8 a 14 años sin filas largas
                    ni improvisación. No requiere haber sido jugador federado.
                  </p>

                  <div className="pt-1 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-[#F5F1EA]/85 tabular-nums">
                    <span>
                      Inicia:{' '}
                      <strong className="font-semibold text-[#F5F1EA]">
                        {COURSE_DATA.startDate}
                      </strong>
                    </span>
                    <span aria-hidden="true" className="text-[#F2701C]">
                      ·
                    </span>
                    <span>
                      <strong className="font-semibold text-[#F5F1EA]">
                        {COURSE_DATA.spotsAvailable}
                      </strong>{' '}
                      plazas disponibles
                    </span>
                    <span aria-hidden="true" className="text-[#F2701C]">
                      ·
                    </span>
                    <span>Mayores de 18 años</span>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <a
                      href="#inscripcion"
                      className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-lg bg-[#F2701C] hover:bg-[#D95E0E] text-[#141A2B] font-semibold text-base transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F1EA]"
                    >
                      <span>Quiero inscribirme</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </a>

                    <a
                      href="#precios"
                      className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg border border-[#F5F1EA]/25 hover:border-[#F2701C] text-[#F5F1EA] hover:text-[#F2701C] font-medium text-base transition-colors whitespace-nowrap tabular-nums focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2701C]"
                    >
                      <span>Precios · {COURSE_DATA.priceMxn}</span>
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <HalfCourtIllustration className="w-full max-w-[440px] mx-auto drop-shadow-2xl" />
                </div>
              </div>
            </section>

            {/* 2. POR QUÉ ESTE CURSO */}
            <section
              id="por-que"
              className="relative py-16 sm:py-24 bg-[#F5F1EA] text-[#141A2B] overflow-hidden"
            >
              <CourtLinesWatermark
                variant="light"
                className="absolute inset-0 w-full h-full pointer-events-none"
              />
              <div className="relative max-w-5xl mx-auto px-4 sm:px-6 reveal-item">
                <p className="text-xs sm:text-sm font-medium tracking-wide text-[#D95E0E]">
                  Por qué este curso
                </p>
                <h2 className="mt-3 font-display text-3xl sm:text-5xl font-bold uppercase leading-[1.02] tracking-tight text-[#141A2B] max-w-3xl text-balance">
                  «El primer entrenador decide si un niño sigue jugando»
                </h2>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  <div className="md:col-span-7 space-y-4 text-base sm:text-lg leading-relaxed text-[#141A2B]/85">
                    <p>
                      Muchos entrenadores enseñan como aprendieron: con filas largas, mucha
                      explicación y poco juego. Los niños pasan la mitad de la sesión esperando turno
                      mientras se enfrían y pierden interés.
                    </p>
                    <p>
                      Este curso te da un método concreto para enseñar bien desde el primer día.
                      Sabrás cómo organizar tu cancha, qué pedir en cada etapa de los 8 a los 14
                      años y cómo convertir cada ejercicio en aprendizaje transferible al partido.
                    </p>
                  </div>

                  <div className="md:col-span-5 pt-4 md:pt-0 md:pl-8 border-t md:border-t-0 md:border-l border-[#141A2B]/15 space-y-3">
                    <h3 className="font-display text-xl uppercase font-semibold text-[#141A2B]">
                      ¿Para quién es?
                    </h3>
                    <p className="text-sm sm:text-base leading-relaxed text-[#141A2B]/80">
                      Aspirantes a entrenador, profesores de educación física, madres y padres de
                      familia y exjugadores mayores de 18 años que quieren entrenar categorías
                      formativas con criterio.
                    </p>
                    <p className="text-sm font-medium text-[#141A2B]">
                      No necesitas haber sido jugador federado.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. EL CURSO EN CIFRAS */}
            <section
              ref={metricsRef}
              aria-labelledby="cifras-heading"
              className="py-16 sm:py-20 bg-[#141A2B] border-y border-[#F5F1EA]/12"
            >
              <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="mb-10 reveal-item">
                  <h2
                    id="cifras-heading"
                    className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[#F5F1EA]"
                  >
                    El curso en cifras
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-[#F5F1EA]/15 reveal-item">
                  {COURSE_METRICS.map((metric, idx) => (
                    <div key={metric.label} className={idx > 0 ? 'lg:pl-8 lg:pr-6' : 'lg:pr-6'}>
                      <div className="font-display text-5xl sm:text-6xl font-bold text-[#F2701C] leading-none">
                        <AnimatedCounter
                          target={metric.value}
                          suffix={metric.suffix}
                          active={metricsVisible}
                        />
                      </div>
                      <p className="mt-3 font-display text-xl uppercase font-semibold text-[#F5F1EA]">
                        {metric.label}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-[#F5F1EA]/75">
                        {metric.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 4. LO QUE SABRÁS HACER AL TERMINAR */}
            {renderOutcomesSection()}

            {/* 5. EL RECORRIDO */}
            {renderTimelineSection()}

            {/* 6. EL MÉTODO */}
            {renderMethodSection()}

            {/* 7. TU CAJA DE HERRAMIENTAS */}
            {renderToolkitSection()}

            {/* 8. CÓMO SE OBTIENE EL NIVEL C */}
            {renderNivelCSection()}

            {/* 9. TU INSTRUCTOR */}
            {renderInstructorSection()}

            {/* 10. PREGUNTAS FRECUENTES */}
            {renderFaqSection()}

            {/* PRECIOS Y FORMAS DE PAGO */}
            {renderPricingSection()}

            {/* 11. FORMULARIO DE INSCRIPCIÓN */}
            {renderFormSection()}
          </>
        )}
      </main>

      {/* 12. PIE DE PÁGINA con mapa de URLs para SEO */}
      <footer id="contacto" className="bg-[#0E1320] text-[#F5F1EA] border-t border-[#F5F1EA]/12 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={COURSE_DATA.logoUrl}
                alt="Logo de Altura BC Ciudad de México"
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover border border-[#F5F1EA]/20 shrink-0"
              />
              <div>
                <p className="font-display text-lg font-bold uppercase tracking-tight text-[#F5F1EA]">
                  {COURSE_DATA.organizer}
                </p>
                <p className="text-xs text-[#F5F1EA]/70">{COURSE_DATA.altitudeTag}</p>
              </div>
            </div>
            <p className="text-[#F5F1EA]/70 text-xs leading-relaxed">
              {COURSE_DATA.courseTitle} · {COURSE_DATA.certification}
            </p>
          </div>

          <div className="space-y-2 text-[#F5F1EA]/80">
            <p className="font-display text-sm uppercase tracking-wide text-[#F2701C]">
              Secciones del curso
            </p>
            <ul className="space-y-1.5">
              <li>
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/');
                  }}
                  className="hover:text-[#F5F1EA] hover:underline underline-offset-2"
                >
                  Inicio
                </a>
              </li>
              <li>
                <a
                  href="/temario"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/temario');
                  }}
                  className="hover:text-[#F5F1EA] hover:underline underline-offset-2"
                >
                  Temario y recorrido (64 h)
                </a>
              </li>
              <li>
                <a
                  href="/metodologia"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/metodologia');
                  }}
                  className="hover:text-[#F5F1EA] hover:underline underline-offset-2"
                >
                  Metodología y herramientas
                </a>
              </li>
              <li>
                <a
                  href="/certificacion-nivel-c"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/certificacion-nivel-c');
                  }}
                  className="hover:text-[#F5F1EA] hover:underline underline-offset-2"
                >
                  Certificación Nivel C
                </a>
              </li>
              <li>
                <a
                  href="/inscripcion"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/inscripcion');
                  }}
                  className="hover:text-[#F5F1EA] hover:underline underline-offset-2"
                >
                  Inscripción en línea
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-2.5 text-[#F5F1EA]/80">
            <p className="font-display text-sm uppercase tracking-wide text-[#F2701C]">Contacto</p>
            <p className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-[#F2701C] shrink-0" aria-hidden="true" />
              <a
                href={whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#F5F1EA] underline-offset-2 hover:underline"
              >
                Atención directa por WhatsApp
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#F2701C] shrink-0" aria-hidden="true" />
              <a
                href={`mailto:${COURSE_DATA.email}`}
                className="hover:text-[#F5F1EA] underline-offset-2 hover:underline"
              >
                {COURSE_DATA.email}
              </a>
            </p>
            <p className="text-[#F5F1EA]/70">Redes sociales: {COURSE_DATA.socialHandle}</p>
          </div>

          <div className="space-y-2.5 text-[#F5F1EA]/80">
            <p className="font-display text-sm uppercase tracking-wide text-[#F2701C]">
              Sede y privacidad
            </p>
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#F2701C] shrink-0 mt-0.5" aria-hidden="true" />
              <span>{COURSE_DATA.venue}</span>
            </p>
            <div>
              <a
                href="/aviso-de-privacidad"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('/aviso-de-privacidad');
                }}
                className="text-[#F2701C] hover:text-[#FF8D42] underline underline-offset-2 font-medium"
              >
                Aviso de Privacidad
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Botón flotante de WhatsApp siempre visible (número oculto vía /ir-whatsapp) */}
      <a
        href={whatsappDirectUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escribir por WhatsApp sobre el curso"
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#1FB857] text-[#0B141A] font-semibold text-sm shadow-2xl border border-[#0B141A]/15 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F1EA]"
      >
        <MessageCircle className="w-5 h-5" aria-hidden="true" />
        <span>WhatsApp</span>
      </a>

      <PrivacyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </div>
  );
}
