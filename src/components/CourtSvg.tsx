import React, { useState } from 'react';

export const HalfCourtIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 560 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Ilustración táctica de media cancha de baloncesto con balón"
    >
      {/* Fondo sutil de duela / zona técnica */}
      <rect
        x="24"
        y="24"
        width="512"
        height="432"
        rx="12"
        fill="#192136"
        stroke="#F5F1EA"
        strokeOpacity="0.24"
        strokeWidth="2"
      />

      {/* Líneas sutiles de duela */}
      <g stroke="#F5F1EA" strokeOpacity="0.045" strokeWidth="1">
        <line x1="24" y1="96" x2="536" y2="96" />
        <line x1="24" y1="168" x2="536" y2="168" />
        <line x1="24" y1="240" x2="536" y2="240" />
        <line x1="24" y1="312" x2="536" y2="312" />
        <line x1="24" y1="384" x2="536" y2="384" />
      </g>

      {/* Media cancha: perímetro */}
      <rect
        x="48"
        y="44"
        width="464"
        height="392"
        stroke="#F5F1EA"
        strokeOpacity="0.72"
        strokeWidth="2.5"
      />

      {/* Línea de 3 puntos */}
      <path
        d="M 88 44 L 88 148 A 204 204 0 0 0 472 148 L 472 44"
        stroke="#F5F1EA"
        strokeOpacity="0.72"
        strokeWidth="2.5"
      />

      {/* Pintura / Zona restringida */}
      <rect
        x="196"
        y="44"
        width="168"
        height="186"
        fill="#F2701C"
        fillOpacity="0.08"
        stroke="#F5F1EA"
        strokeOpacity="0.72"
        strokeWidth="2.5"
      />

      {/* Marcas de rebote en la pintura */}
      <g stroke="#F5F1EA" strokeOpacity="0.65" strokeWidth="2.5">
        <line x1="186" y1="98" x2="196" y2="98" />
        <line x1="186" y1="132" x2="196" y2="132" />
        <line x1="186" y1="166" x2="196" y2="166" />
        <line x1="186" y1="200" x2="196" y2="200" />
        <line x1="364" y1="98" x2="374" y2="98" />
        <line x1="364" y1="132" x2="374" y2="132" />
        <line x1="364" y1="166" x2="374" y2="166" />
        <line x1="364" y1="200" x2="374" y2="200" />
      </g>

      {/* Semicírculo de tiro libre */}
      <path
        d="M 218 230 A 62 62 0 0 0 342 230"
        stroke="#F5F1EA"
        strokeOpacity="0.72"
        strokeWidth="2.5"
      />
      <path
        d="M 218 230 A 62 62 0 0 1 342 230"
        stroke="#F5F1EA"
        strokeOpacity="0.32"
        strokeWidth="2"
        strokeDasharray="6 6"
      />

      {/* Zona de carga / semicírculo bajo aro */}
      <path
        d="M 240 82 A 40 40 0 0 0 320 82"
        stroke="#F5F1EA"
        strokeOpacity="0.55"
        strokeWidth="2"
      />

      {/* Tablero y aro */}
      <line
        x1="242"
        y1="66"
        x2="318"
        y2="66"
        stroke="#F5F1EA"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <line x1="280" y1="66" x2="280" y2="76" stroke="#F5F1EA" strokeWidth="2.5" />
      <circle cx="280" cy="86" r="11" stroke="#F2701C" strokeWidth="3.5" fill="#141A2B" />

      {/* Medio círculo central en línea de medio campo */}
      <path
        d="M 216 436 A 64 64 0 0 1 344 436"
        stroke="#F5F1EA"
        strokeOpacity="0.72"
        strokeWidth="2.5"
      />
      <circle
        cx="280"
        cy="436"
        r="24"
        stroke="#F5F1EA"
        strokeOpacity="0.35"
        strokeWidth="2"
      />

      {/* Trazos tácticos de lectura y movimiento (Del fundamento al juego) */}
      <g>
        {/* Jugador 1 -> Corte */}
        <path
          d="M 145 304 Q 168 236 226 178"
          stroke="#F2701C"
          strokeWidth="2.2"
          strokeDasharray="7 5"
          strokeLinecap="round"
        />
        <polygon points="232,172 220,176 227,184" fill="#F2701C" />

        {/* Pase hacia perímetro */}
        <path
          d="M 382 320 L 298 308"
          stroke="#F5F1EA"
          strokeOpacity="0.55"
          strokeWidth="2"
          strokeDasharray="4 4"
        />

        {/* Posición de entrenador / jugadores */}
        <circle cx="145" cy="308" r="12" fill="#141A2B" stroke="#F5F1EA" strokeWidth="2.2" />
        <text
          x="145"
          y="312"
          textAnchor="middle"
          fill="#F5F1EA"
          fontSize="11"
          fontFamily="Oswald, sans-serif"
          fontWeight="600"
        >
          1
        </text>

        <circle cx="386" cy="322" r="12" fill="#141A2B" stroke="#F5F1EA" strokeWidth="2.2" />
        <text
          x="386"
          y="326"
          textAnchor="middle"
          fill="#F5F1EA"
          fontSize="11"
          fontFamily="Oswald, sans-serif"
          fontWeight="600"
        >
          2
        </text>

        {/* Marca de oposición (X) */}
        <g stroke="#F5F1EA" strokeOpacity="0.55" strokeWidth="2.2" strokeLinecap="round">
          <line x1="210" y1="218" x2="222" y2="230" />
          <line x1="222" y1="218" x2="210" y2="230" />
        </g>
      </g>

      {/* Balón de baloncesto limpio (sin marcas) */}
      <g transform="translate(280, 306)">
        <circle cx="4" cy="8" r="44" fill="#0B0F1A" fillOpacity="0.55" />
        <circle cx="0" cy="0" r="44" fill="#F2701C" stroke="#141A2B" strokeWidth="2.5" />
        {/* Brillo sutil */}
        <path
          d="M -26 -24 A 34 34 0 0 1 12 -33"
          stroke="#F5F1EA"
          strokeOpacity="0.3"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Costuras del balón */}
        <line x1="-43" y1="0" x2="43" y2="0" stroke="#141A2B" strokeWidth="2.5" />
        <line x1="0" y1="-43" x2="0" y2="43" stroke="#141A2B" strokeWidth="2.5" />
        <path
          d="M -29 -32 C -11 -16 -11 16 -29 32"
          stroke="#141A2B"
          strokeWidth="2.5"
          fill="none"
        />
        <path
          d="M 29 -32 C 11 -16 11 16 29 32"
          stroke="#141A2B"
          strokeWidth="2.5"
          fill="none"
        />
      </g>
    </svg>
  );
};

export const CourtLinesWatermark: React.FC<{
  variant?: 'dark' | 'light';
  className?: string;
}> = ({ variant = 'dark', className = '' }) => {
  const strokeColor = variant === 'dark' ? '#F5F1EA' : '#141A2B';
  return (
    <svg
      viewBox="0 0 1200 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <circle
        cx="600"
        cy="200"
        r="150"
        stroke={strokeColor}
        strokeOpacity="0.06"
        strokeWidth="2"
      />
      <circle
        cx="600"
        cy="200"
        r="54"
        stroke={strokeColor}
        strokeOpacity="0.06"
        strokeWidth="2"
      />
      <line
        x1="0"
        y1="200"
        x2="1200"
        y2="200"
        stroke={strokeColor}
        strokeOpacity="0.05"
        strokeWidth="2"
      />
      <path
        d="M -40 40 A 220 220 0 0 1 -40 360"
        stroke={strokeColor}
        strokeOpacity="0.05"
        strokeWidth="2"
      />
      <path
        d="M 1240 40 A 220 220 0 0 0 1240 360"
        stroke={strokeColor}
        strokeOpacity="0.05"
        strokeWidth="2"
      />
    </svg>
  );
};

export const CoachPhotoPlaceholder: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`relative flex flex-col items-center justify-center bg-[#1B2338] border border-[#F5F1EA]/15 rounded-xl overflow-hidden ${className}`}
    >
      <svg
        viewBox="0 0 320 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        role="img"
        aria-label="Espacio reservado para fotografía del instructor"
      >
        <rect width="320" height="360" fill="#182034" />
        {/* Líneas de cancha de fondo */}
        <circle cx="160" cy="150" r="108" stroke="#F5F1EA" strokeOpacity="0.08" strokeWidth="2" />
        <line x1="20" y1="305" x2="300" y2="305" stroke="#F2701C" strokeOpacity="0.45" strokeWidth="2" />
        {/* Silueta limpia de entrenador con pizarra */}
        <circle cx="160" cy="126" r="40" fill="#25304D" stroke="#F5F1EA" strokeOpacity="0.25" strokeWidth="2" />
        <path
          d="M 84 290 C 84 228 118 196 160 196 C 202 196 236 228 236 290"
          fill="#25304D"
          stroke="#F5F1EA"
          strokeOpacity="0.25"
          strokeWidth="2"
        />
        {/* Detalle de silbato geométrico */}
        <circle cx="160" cy="242" r="8" stroke="#F2701C" strokeWidth="2.5" />
        <line x1="160" y1="196" x2="160" y2="234" stroke="#F2701C" strokeWidth="2" strokeDasharray="3 3" />
      </svg>
      <div className="absolute bottom-3 inset-x-3 text-center">
        <p className="text-xs text-[#F5F1EA]/70 tracking-wide">
          Espacio para foto del instructor
        </p>
      </div>
    </div>
  );
};

export const InstructorPortrait: React.FC<{
  src: string;
  alt: string;
  className?: string;
}> = ({ src, alt, className = '' }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <CoachPhotoPlaceholder className={className} />;
  }

  return (
    <div
      className={`relative bg-[#1B2338] border border-[#F5F1EA]/15 rounded-xl overflow-hidden ${className}`}
    >
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className="w-full h-full object-cover object-top"
      />
    </div>
  );
};
