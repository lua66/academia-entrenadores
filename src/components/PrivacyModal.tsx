import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { COURSE_DATA } from '../data/courseData';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0F1A]/80 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#F5F1EA] text-[#141A2B] rounded-xl border border-[#141A2B]/15 p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#141A2B]/15">
          <div>
            <h2
              id="privacy-modal-title"
              className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#141A2B]"
            >
              Aviso de Privacidad
            </h2>
            <p className="mt-1 text-xs text-[#141A2B]/70">
              {COURSE_DATA.organizer} · {COURSE_DATA.cityState}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar aviso de privacidad"
            className="p-2 rounded-lg text-[#141A2B]/70 hover:text-[#141A2B] hover:bg-[#141A2B]/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2701C]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4 text-sm leading-relaxed text-[#141A2B]/85">
          <p>
            En cumplimiento con la Ley Federal de Protección de Datos Personales en Posesión de los
            Particulares (México), <strong>{COURSE_DATA.organizer}</strong>, con sede en{' '}
            {COURSE_DATA.cityState}, es responsable del uso y protección de los datos personales que
            proporciones en este formulario de inscripción.
          </p>
          <div>
            <h3 className="font-display text-base font-semibold uppercase tracking-wide text-[#141A2B]">
              1. Datos que recabamos
            </h3>
            <p className="mt-1">
              Nombre completo, edad, ciudad de residencia, número de WhatsApp, correo electrónico,
              experiencia previa como entrenador o jugador, rango de edades con las que deseas
              trabajar y medio por el cual conociste el curso.
            </p>
          </div>
          <div>
            <h3 className="font-display text-base font-semibold uppercase tracking-wide text-[#141A2B]">
              2. Finalidad del tratamiento
            </h3>
            <p className="mt-1">
              Tus datos se utilizarán exclusivamente para gestionar tu preinscripción al curso{' '}
              <em>«{COURSE_DATA.courseTitle}»</em>, enviarte información logística de sede, horarios
              y pagos, emitir tu Constancia de Entrenador Nivel C en caso de acreditar el programa y
              atender dudas sobre tu participación. No vendemos ni compartimos tu información con
              terceros ajenos al curso.
            </p>
          </div>
          <div>
            <h3 className="font-display text-base font-semibold uppercase tracking-wide text-[#141A2B]">
              3. Derechos ARCO y contacto
            </h3>
            <p className="mt-1">
              Puedes ejercer tus derechos de acceso, rectificación, cancelación u oposición (ARCO)
              escribiendo al correo{' '}
              <a
                href={`mailto:${COURSE_DATA.email}`}
                className="font-medium text-[#D95E0E] underline underline-offset-2"
              >
                {COURSE_DATA.email}
              </a>
              .
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#141A2B]/15 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-[#141A2B] text-[#F5F1EA] text-sm font-medium hover:bg-[#1E2740] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2701C]"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
