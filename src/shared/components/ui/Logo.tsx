/**
 * El emblema de Ticoshot: dos vasos de shot brindando, con chispas arriba y
 * una sonrisa abajo.
 *
 * Va en SVG DIBUJADO, no como <img> de un PNG, por tres razones:
 *
 *   1. Es el contenido principal de la tarjeta del hero, o sea candidato a
 *      LCP. Un <img> es otra peticion de red compitiendo justo ahi; esto se
 *      pinta con el HTML.
 *   2. Escala sin pixelarse, de los 36px del navbar a los 160px del hero.
 *   3. Hereda `currentColor`, asi que el mismo componente sirve en rojo sobre
 *      crema y en blanco sobre rojo sin tener dos archivos que mantener.
 *
 * COMO SE INCLINAN LOS VASOS — y por que el primer intento salio un borron.
 * Cada vaso se dibuja DERECHO y despues se gira alrededor de un punto comun
 * de abajo, `rotate(±12 100 118)`. Girarlo alrededor de su propio origen,
 * que fue el primer intento, no solo lo inclina: tambien lo desplaza, y los
 * dos vasos terminaron montados uno encima del otro formando una sola mancha.
 * Con un centro de giro compartido el gesto es simetrico por construccion.
 *
 * Es una INTERPRETACION del logo, no el archivo original. Cuando el cliente
 * mande su vectorial se reemplazan estos paths y nada mas.
 */

/** Un vaso derecho: trapecio que se angosta hacia abajo, con boca y trago. */
function Vaso() {
  return (
    <>
      {/* Cuerpo */}
      <path
        d="M0 5 h64 l-7 59 q-1 7 -8 7 h-34 q-7 0 -8 -7 Z"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      {/* Boca: la elipse que le da volumen al borde. */}
      <path
        d="M0 5 q32 11 64 0"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/*
        El trago. Relleno solido y solo en la mitad de abajo: es lo que
        identifica a la marca, pero llenando el vaso entero deja de leerse como
        vidrio y se ve una mancha.
      */}
      <path d="M12 40 h40 l-4 24 q-1 3 -4 3 h-24 q-3 0 -4 -3 Z" fill="currentColor" />
    </>
  );
}

export function Logo({
  className,
  conTexto = false,
  titulo = "Ticoshot",
}: {
  className?: string;
  /** Agrega "TICOSHOT · 100% ARTESANAL" bajo el emblema. */
  conTexto?: boolean;
  /**
   * Texto accesible. En `null` el SVG queda oculto para lectores de pantalla:
   * usarlo cuando el nombre ya esta escrito al lado y repetirlo seria ruido.
   */
  titulo?: string | null;
}) {
  const oculto = titulo === null;

  return (
    <svg
      viewBox={conTexto ? "0 0 200 248" : "0 0 200 172"}
      className={className}
      fill="none"
      role={oculto ? "presentation" : "img"}
      aria-hidden={oculto ? true : undefined}
      aria-label={oculto ? undefined : titulo}
    >
      {/* Chispas del brindis. La del medio es recta; las de los lados se abren. */}
      <g stroke="currentColor" strokeWidth="6" strokeLinecap="round">
        <path d="M100 6v24" />
        <path d="M73 15l9 21" />
        <path d="M127 15l-9 21" />
      </g>

      {/* Vaso izquierdo: gira en sentido horario, o sea su boca va al centro. */}
      <g transform="rotate(12 100 118) translate(24 46)">
        <Vaso />
      </g>

      {/*
        Vaso derecho: el MISMO dibujo espejado con scale(-1 1). Dibujar los dos
        a mano garantiza que tarde o temprano dejen de ser simetricos.
      */}
      <g transform="rotate(-12 100 118) translate(176 46) scale(-1 1)">
        <Vaso />
      </g>

      {/* La sonrisa, con los extremos enroscados hacia arriba. */}
      <g stroke="currentColor" strokeWidth="10" strokeLinecap="round">
        <path d="M55 134 q45 40 90 0" />
        <path d="M55 134 q-4 -14 9 -14" />
        <path d="M145 134 q4 -14 -9 -14" />
      </g>

      {conTexto && (
        <>
          {/*
            `textLength` + `lengthAdjust` NO SON ADORNO: son lo que garantiza
            que el texto quepa.

            Sin ellos, "TICOSHOT" a fontSize 44 mide unas 218 unidades en un
            lienzo de 200 y el navegador lo RECORTA: a la primera y a la ultima
            T les desaparecia medio brazo y quedaba "ΓICOSHOT⌐". Y el ancho
            depende de la fuente, asi que el recorte aparece o no segun si
            Outfit llego a cargar — o sea que probandolo en local podia verse
            perfecto. Con `textLength` el ancho lo manda el SVG, no la fuente.
          */}
          <text
            x="100"
            y="210"
            textAnchor="middle"
            fill="currentColor"
            className="font-display"
            fontSize="40"
            fontWeight="700"
            textLength="172"
            lengthAdjust="spacingAndGlyphs"
          >
            TICOSHOT
          </text>
          <text
            x="100"
            y="236"
            textAnchor="middle"
            fill="currentColor"
            className="font-display"
            fontSize="16"
            fontWeight="600"
            textLength="150"
            lengthAdjust="spacingAndGlyphs"
          >
            100% ARTESANAL
          </text>
        </>
      )}
    </svg>
  );
}
