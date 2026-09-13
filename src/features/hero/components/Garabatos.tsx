/**
 * Los garabatos de crayon y las estrellitas de sus posts de Instagram.
 *
 * Es lo que hace que el hero se lea como Ticoshot y no como una plantilla con
 * un degradado naranja. Sin ellos el fondo es bonito y de nadie.
 *
 * Todos son DECORATIVOS: `aria-hidden` en el contenedor, y ninguno lleva texto
 * encima. Eso los libera de la regla de contraste — el azul crayon sobre coral
 * no llegaria ni de lejos a 4,5:1, y no hace falta que llegue.
 */

type EstiloGarabato = React.CSSProperties & Record<`--${string}`, string>;

/** Nube de crayon: el trazo doble a mano alzada que repite en sus fondos. */
function Nube({ className, retraso }: { className?: string; retraso: string }) {
  return (
    <svg
      viewBox="0 0 120 70"
      className={`garabato ${className ?? ""}`}
      style={{ "--garabato-retraso": retraso } as EstiloGarabato}
      fill="none"
      stroke="var(--color-crayon)"
      strokeWidth="4"
      strokeLinecap="round"
    >
      <path d="M18 52 q-14 -2 -12 -14 t16 -10 q2 -18 20 -18 t22 14 q16 -8 26 4 t4 24 q6 6 -2 12" />
      <path d="M26 60 q-10 0 -9 -8" strokeWidth="3.5" opacity="0.7" />
    </svg>
  );
}

/** Estrella de cuatro puntas. La que salpica sus carruseles. */
function Estrella({
  className,
  color,
  retraso,
}: {
  className?: string;
  color: string;
  retraso: string;
}) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={`destella ${className ?? ""}`}
      style={{ "--destello-retraso": retraso } as EstiloGarabato}
      fill={color}
    >
      {/* Puntas concavas: una estrella de rombos se lee como diamante. */}
      <path d="M20 0 q4 16 20 20 q-16 4 -20 20 q-4 -16 -20 -20 q16 -4 20 -20Z" />
    </svg>
  );
}

/** Rayitas sueltas, el gesto de "brillo" a mano. */
function Rayas({ className, retraso }: { className?: string; retraso: string }) {
  return (
    <svg
      viewBox="0 0 50 40"
      className={`garabato ${className ?? ""}`}
      style={{ "--garabato-retraso": retraso } as EstiloGarabato}
      fill="none"
      stroke="var(--color-menta)"
      strokeWidth="4"
      strokeLinecap="round"
    >
      <path d="M4 30 L16 6M22 34 L32 4M38 30 L46 12" />
    </svg>
  );
}

export function Garabatos() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <Nube className="absolute left-[4%] top-[16%] w-24 sm:w-36" retraso="0.5s" />
      <Nube className="absolute right-[6%] top-[52%] w-20 opacity-80 sm:w-28" retraso="0.9s" />
      <Nube className="absolute left-[12%] bottom-[26%] hidden w-24 opacity-70 lg:block" retraso="1.2s" />

      <Rayas className="absolute right-[14%] top-[20%] w-12 sm:w-16" retraso="0.7s" />
      <Rayas className="absolute left-[26%] bottom-[34%] hidden w-12 lg:block" retraso="1.1s" />

      <Estrella
        className="absolute left-[18%] top-[30%] w-6 sm:w-8"
        color="var(--color-estrella)"
        retraso="0s"
      />
      <Estrella
        className="absolute right-[22%] top-[64%] w-5 sm:w-7"
        color="var(--color-estrella)"
        retraso="1.1s"
      />
      <Estrella
        className="absolute right-[10%] top-[30%] w-4 sm:w-5"
        color="#fff"
        retraso="2.2s"
      />
      <Estrella
        className="absolute left-[8%] top-[64%] w-4 sm:w-6"
        color="#fff"
        retraso="1.7s"
      />
    </div>
  );
}
