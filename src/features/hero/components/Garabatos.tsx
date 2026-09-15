import {
  Estrella,
  Lima,
  Nube,
  Rayas,
  RodajaNaranja,
} from "@/shared/components/ui/Decorados";

/**
 * Los garabatos de crayon y las estrellitas de sus posts de Instagram.
 *
 * Es lo que hace que el hero se lea como Ticoshot y no como una plantilla con
 * un degradado naranja. Sin ellos el fondo es bonito y de nadie.
 *
 * ============ LOS DIBUJOS SON LOS DE `shared/` ============
 * Estaban duplicados: este archivo tenia su propia nube, su propia estrella y
 * sus propias rayas, con los mismos paths que las de `shared/Decorados`. Dos
 * copias del mismo dibujo es la peor clase de duplicado, porque no falla —
 * simplemente se van separando. Al retocar la nube de las secciones, la del
 * hero se quedaba como estaba y el sitio empezaba a tener dos estilos.
 *
 * Lo que SI es de aqui son las animaciones: `garabato` y `destella` reaccionan
 * al scroll del hero, no son las `deco-*` de las secciones.
 * ==========================================================
 *
 * ============ EL COLOR ENTRA POR `text-*` ============
 * Los dibujos de `shared/` pintan con `currentColor`. Antes iban con
 * `stroke="var(--color-crayon)"` clavado dentro del SVG, que es justo lo que
 * impide reusarlos: un dibujo con el color escrito dentro sirve para un sitio
 * y para ninguno mas.
 * =====================================================
 *
 * Todos son DECORATIVOS: `aria-hidden` en el contenedor, y ninguno lleva texto
 * encima. Eso los libera de la regla de contraste — el azul crayon sobre coral
 * no llegaria ni de lejos a 4,5:1, y no hace falta que llegue.
 */

type EstiloGarabato = React.CSSProperties & Record<`--${string}`, string>;

/** Envuelve un dibujo con la animacion de scroll del hero y su color. */
function Garabato({
  className,
  retraso,
  destello = false,
  children,
}: {
  className: string;
  retraso: string;
  /** true = parpadea en vez de derivar. Para las estrellas. */
  destello?: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`absolute ${destello ? "destella" : "garabato"} ${className}`}
      style={
        {
          [destello ? "--destello-retraso" : "--garabato-retraso"]: retraso,
        } as EstiloGarabato
      }
    >
      {children}
    </span>
  );
}

export function Garabatos() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/*
        LOS TAMAÑOS VAN MUY SEPARADOS A PROPOSITO. Con todo entre w-20 y w-36 el
        fondo se lee como una cenefa repetida; con una nube de 144px al lado de
        una estrella de 16 hay PROFUNDIDAD, que es lo que hace que parezca
        pintado a mano y no colocado por un script.
      */}
      <Garabato className="left-[3%] top-[14%] w-28 text-crayon sm:w-44" retraso="0.5s">
        <Nube className="w-full" />
      </Garabato>
      <Garabato className="right-[5%] top-[52%] w-20 text-crayon/80 sm:w-28" retraso="0.9s">
        <Nube className="w-full" />
      </Garabato>
      <Garabato className="bottom-[26%] left-[12%] hidden w-16 text-crayon/70 lg:block" retraso="1.2s">
        <Nube className="w-full" />
      </Garabato>

      {/* Fruta, la misma de las secciones: el hero deja de ser el unico sitio
          sin ella y el sitio se lee como uno solo. */}
      <Garabato className="right-[10%] top-[10%] hidden w-24 text-crayon/70 lg:block" retraso="1.5s">
        <RodajaNaranja className="w-full" />
      </Garabato>
      <Garabato className="bottom-[30%] right-[26%] hidden w-16 text-menta/80 lg:block" retraso="0.3s">
        <Lima className="w-full" />
      </Garabato>

      <Garabato className="right-[14%] top-[22%] w-10 text-menta sm:w-14" retraso="0.7s">
        <Rayas className="w-full" />
      </Garabato>
      <Garabato className="bottom-[34%] left-[26%] hidden w-12 text-menta lg:block" retraso="1.1s">
        <Rayas className="w-full" />
      </Garabato>

      <Garabato className="left-[18%] top-[30%] w-6 text-estrella sm:w-8" retraso="0s" destello>
        <Estrella className="w-full" />
      </Garabato>
      <Garabato className="right-[22%] top-[64%] w-5 text-estrella sm:w-7" retraso="1.1s" destello>
        <Estrella className="w-full" />
      </Garabato>
      <Garabato className="right-[10%] top-[30%] w-3 text-white sm:w-4" retraso="2.2s" destello>
        <Estrella className="w-full" />
      </Garabato>
      <Garabato className="left-[8%] top-[64%] w-4 text-white sm:w-6" retraso="1.7s" destello>
        <Estrella className="w-full" />
      </Garabato>
    </div>
  );
}
