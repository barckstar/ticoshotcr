import type { ColorProducto } from "@/shared/types/producto";

/**
 * La botella de litro, dibujada.
 *
 * NO es un adorno de relleno esperando la foto: es lo que se ve mientras el
 * cliente no mande las originales, y se ve bien. La alternativa era bajar las
 * fotos de Instagram —recomprimidas y ya recortadas a 4:5— y pasarlas por
 * definitivas; eso se ve peor que esto y, sobre todo, nadie se acuerda
 * despues de cuales habia que reemplazar.
 *
 * Cuando lleguen las fotos, `Producto.imagen` deja de ser null y la tarjeta
 * pinta la foto en lugar de este componente. Este se queda igual como
 * respaldo, que es justo lo que hace falta si algun dia se agrega un sabor
 * nuevo antes de fotografiarlo.
 */

/** El liquido de cada uno. El color de etiqueta, en su version de contenido. */
const liquido: Record<ColorProducto, string> = {
  chiliguaro: "var(--color-chiliguaro)",
  miguelito: "var(--color-miguelito)",
  sangria: "var(--color-sangria)",
};

export function Botella({
  color,
  nombre,
  className,
}: {
  color: ColorProducto;
  /** Va al aria-label. El dibujo representa a un producto concreto. */
  nombre: string;
  className?: string;
}) {
  const tinta = liquido[color];
  /* Cada botella necesita ids propios: dos degradados con el mismo id en la
     misma pagina hacen que la segunda botella herede el color de la primera. */
  const idBrillo = `brillo-${color}`;
  const idTinta = `tinta-${color}`;

  return (
    <svg
      viewBox="0 0 120 320"
      className={className}
      role="img"
      aria-label={`Botella de litro de ${nombre}`}
    >
      <defs>
        <linearGradient id={idTinta} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={tinta} stopOpacity="0.78" />
          <stop offset="45%" stopColor={tinta} stopOpacity="1" />
          <stop offset="100%" stopColor={tinta} stopOpacity="0.62" />
        </linearGradient>
        {/* El reflejo vertical: es lo que hace que se lea como vidrio. */}
        <linearGradient id={idBrillo} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="30%" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="42%" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Silueta: cuello, hombros y cuerpo de una PET de litro. */}
      <path
        id={`silueta-${color}`}
        d="M44 28 h32 v26 q0 10 8 18 l6 6 q8 8 8 20 v198 q0 14 -14 14 h-48 q-14 0 -14 -14 v-198 q0 -12 8 -20 l6 -6 q8 -8 8 -18 Z"
        fill={`url(#${idTinta})`}
      />

      {/* Tapa roja. Es el unico elemento igual en los tres productos. */}
      <rect x="40" y="6" width="40" height="26" rx="5" fill="var(--color-acento)" />
      <g stroke="#fff" strokeOpacity="0.25" strokeWidth="2">
        <path d="M48 8v22M56 8v22M64 8v22M72 8v22" />
      </g>

      {/* Reflejo. Recortado a la silueta para que no se salga del vidrio. */}
      <clipPath id={`recorte-${color}`}>
        <use href={`#silueta-${color}`} />
      </clipPath>
      <rect
        x="0"
        y="0"
        width="120"
        height="320"
        fill={`url(#${idBrillo})`}
        clipPath={`url(#recorte-${color})`}
      />

      {/* La etiqueta circular blanca, como la de verdad. */}
      <circle cx="60" cy="196" r="34" fill="#fff" />
      <circle
        cx="60"
        cy="196"
        r="34"
        fill="none"
        stroke={tinta}
        strokeWidth="1.5"
        strokeOpacity="0.35"
      />
      {/* `textLength` fija el ancho para que la etiqueta no se desborde del
          circulo blanco. Ver el comentario largo en Logo.tsx. */}
      <text
        x="60"
        y="193"
        textAnchor="middle"
        className="font-display"
        fontSize="11"
        fontWeight="700"
        fill={tinta}
        textLength="46"
        lengthAdjust="spacingAndGlyphs"
      >
        TICOSHOT
      </text>
      <text
        x="60"
        y="206"
        textAnchor="middle"
        className="font-display"
        fontSize="7"
        fontWeight="600"
        fill={tinta}
        textLength="52"
        lengthAdjust="spacingAndGlyphs"
      >
        100% ARTESANAL
      </text>
    </svg>
  );
}
