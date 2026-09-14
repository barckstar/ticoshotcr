"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Botella } from "@/shared/components/ui/Botella";
import { useCarrito } from "@/shared/lib/carrito";
import type { Producto } from "@/shared/types/producto";
import {
  COPIAS,
  VELOCIDAD_MINIMA,
  desplazar,
  frenarPorRoce,
  limitarVelocidad,
  suavizarVelocidad,
} from "../lib/banda";

/**
 * La banda de fotos que cruza el hero, y con la que se puede jugar.
 *
 * Son las publicaciones de Ticoshot pasando como una tira: el fondo coral
 * pintado a mano de cada foto es parte de su identidad, asi que se montan como
 * tarjetas con su marco y su sombra en vez de recortarles el fondo.
 *
 * ============ QUE HACE AL TOCARLA ============
 *   - Pasar el cursor  detiene la tira y agranda esa botella.
 *   - Arrastrar        la mueve a mano, izquierda y derecha.
 *   - Soltar en marcha la deja rodando, y frena sola.
 *   - Un clic          agrega ese litro al carrito.
 *
 * ARRASTRAR Y HACER CLIC SON EL MISMO GESTO hasta que deja de serlo, y sin
 * distinguirlos bien cada intento de mover la tira terminaria metiendo tres
 * botellas en el carrito. La regla es el UMBRAL: si el puntero se movio mas de
 * `UMBRAL_ARRASTRE` px entre que se aprieta y se suelta, fue un arrastre y no
 * se agrega nada. Seis pixeles es lo que tiembla un dedo en una pantalla
 * tactil sin intencion de mover.
 * =============================================
 *
 * ============ POR QUE SEIS COPIAS ============
 * Un marquee sin costura necesita DOS cosas:
 *
 *   1. Que el desplazamiento sea exactamente el ancho de UN juego. Lo resuelve
 *      la formula `-100% / copias` del @keyframes.
 *   2. Que la pista TOTAL sea mas ancha que la pantalla mas un juego. Con dos
 *      copias la pista media 1392px: en una pantalla de 1440 las botellas se
 *      amontonaban a la izquierda y quedaba un hueco enorme a la derecha.
 *
 * Con seis, la pista pasa de 4000px y cubre pantallas de hasta ~3500px. Son 18
 * tarjetas en el DOM pero solo TRES imagenes distintas: el navegador las pide
 * una vez y reusa el resto.
 *
 * Esas seis copias son ademas lo que permite el bucle infinito al arrastrar:
 * ver `desplazar()`.
 * =============================================
 */

type EstiloBanda = React.CSSProperties & Record<`--${string}`, string>;

/**
 * Pixeles que hay que mover para que cuente como arrastre y no como clic.
 *
 * Seis es lo que tiembla un dedo apoyado en una pantalla sin intencion de
 * arrastrar. Menos, y un toque normal cuenta como arrastre y no agrega nada.
 * Mas, y un arrastre corto agrega un litro que nadie pidio — el error caro de
 * los dos.
 */
const UMBRAL_ARRASTRE = 6;

/** Inclinaciones fijas por posicion. Ver el comentario de abajo. */
const INCLINACION = ["-rotate-3", "rotate-2", "-rotate-1"];

type Estado = "quieta" | "arrastrando" | "lanzada";

export function BandaBotellas({ productos }: { productos: Producto[] }) {
  const { agregar, abrir } = useCarrito();
  const carril = useRef<HTMLDivElement>(null);

  /*
    Todo el estado del gesto va en `ref` y no en `useState`: cambia en cada
    `pointermove` —decenas de veces por segundo— y con estado provocaria un
    render de React por cada pixel. El desplazamiento se escribe directo en el
    DOM, que es lo unico que tiene que pasar.
  */
  const gesto = useRef({
    activo: false,
    xInicial: 0,
    scrollInicial: 0,
    movido: 0,
    ultimoX: 0,
    ultimoT: 0,
    velocidad: 0,
  });
  const lanzamiento = useRef(0);
  const [estado, setEstado] = useState<Estado>("quieta");

  /** Corta el lanzamiento en curso, si lo hay. */
  const frenar = useCallback(() => {
    if (lanzamiento.current) {
      cancelAnimationFrame(lanzamiento.current);
      lanzamiento.current = 0;
    }
  }, []);

  /* Un fotograma pedido y nunca cobrado deja el bucle corriendo sobre un nodo
     que ya se desmonto. */
  useEffect(() => frenar, [frenar]);

  function alApretar(e: React.PointerEvent<HTMLDivElement>) {
    const el = carril.current;
    if (!el) return;

    /*
      Si venia rodando, este toque la ATRAPA y no compra nada: quien pone el
      dedo encima de algo que se mueve lo esta parando, no pidiendolo. Se finge
      un arrastre pasado del umbral, que es la misma regla que ya filtra el
      clic mas abajo.
    */
    const veniaRodando = lanzamiento.current !== 0;
    frenar();

    gesto.current = {
      activo: true,
      xInicial: e.clientX,
      scrollInicial: el.scrollLeft,
      movido: veniaRodando ? UMBRAL_ARRASTRE + 1 : 0,
      ultimoX: e.clientX,
      ultimoT: e.timeStamp,
      velocidad: 0,
    };
    setEstado("arrastrando");
    /*
      Captura el puntero: los siguientes eventos llegan aqui aunque el dedo se
      salga del elemento. Sin esto, arrastrar rapido hacia afuera deja el gesto
      colgado —`activo` en true para siempre— y el siguiente clic no agrega.
    */
    el.setPointerCapture(e.pointerId);
  }

  function alMover(e: React.PointerEvent<HTMLDivElement>) {
    const el = carril.current;
    if (!el || !gesto.current.activo) return;

    const g = gesto.current;
    const delta = e.clientX - g.xInicial;
    g.movido = Math.max(g.movido, Math.abs(delta));

    /*
      La velocidad se mide entre ESTE evento y el anterior, no sobre el gesto
      entero: lo que manda el lanzamiento es el ultimo tiron, no el promedio de
      un arrastre que pudo empezar lento. Y se suaviza, porque el ultimo
      `pointermove` antes de levantar el dedo suele venir casi quieto y a pelo
      mataria el impulso justo en el fotograma que lo decide.
    */
    const dt = e.timeStamp - g.ultimoT;
    if (dt > 0) {
      g.velocidad = suavizarVelocidad((e.clientX - g.ultimoX) / dt, g.velocidad);
      g.ultimoX = e.clientX;
      g.ultimoT = e.timeStamp;
    }

    /* El dedo va a la derecha, el contenido va a la derecha: el scroll baja. */
    desplazar(el, g.scrollInicial - delta - el.scrollLeft);
  }

  function alSoltar(e: React.PointerEvent<HTMLDivElement>) {
    const el = carril.current;
    el?.releasePointerCapture(e.pointerId);
    gesto.current.activo = false;

    /*
      `prefers-reduced-motion` tambien manda aqui, y no se puede resolver desde
      CSS: esto es un bucle de JavaScript. El arrastre en si se respeta —lo
      mueve el dedo, es movimiento pedido—, la inercia no: eso es la pantalla
      moviendose sola.
    */
    const menosMovimiento =
      typeof matchMedia === "function" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches;

    const v = gesto.current.velocidad;
    if (!el || menosMovimiento || Math.abs(v) < VELOCIDAD_MINIMA) {
      setEstado("quieta");
      return;
    }

    gesto.current.velocidad = limitarVelocidad(v);
    setEstado("lanzada");

    let anterior = performance.now();
    const paso = (ahora: number) => {
      /*
        `dt` se limita a 32 ms: si la pestaña se va al fondo el navegador deja
        de dar fotogramas, y al volver el primero trae un salto de segundos.
        Sin tope, la tira se teletransporta al reaparecer.
      */
      const dt = Math.min(ahora - anterior, 32);
      anterior = ahora;

      const g = gesto.current;
      g.velocidad = frenarPorRoce(g.velocidad, dt);

      if (Math.abs(g.velocidad) < VELOCIDAD_MINIMA) {
        lanzamiento.current = 0;
        setEstado("quieta");
        return;
      }

      desplazar(el, -g.velocidad * dt);
      lanzamiento.current = requestAnimationFrame(paso);
    };
    lanzamiento.current = requestAnimationFrame(paso);
  }

  function alTocarBotella(producto: Producto) {
    // Fue un arrastre, no un clic: la tira se movio y nadie pidio comprar.
    if (gesto.current.movido > UMBRAL_ARRASTRE) return;
    if (!producto.disponible) return;
    agregar(producto);
    abrir();
  }

  const juego = (copia: number) => (
    <ul
      key={copia}
      className="flex shrink-0 items-end gap-6 px-3 sm:gap-10 sm:px-5"
      /* Solo la primera copia se anuncia: un lector de pantalla no tiene por
         que oir dieciocho botellas donde hay tres. */
      aria-hidden={copia > 0 || undefined}
    >
      {productos.map((p, i) => (
        <li
          key={p.id}
          /*
            La inclinacion sale de la POSICION, no de `Math.random()`. Un valor
            al azar se calcula distinto en el servidor y en el cliente, y React
            marca desajuste de hidratacion — ademas de que la tira cambiaria de
            forma en cada carga sin que nadie lo pidiera.

            En Tailwind v4 `rotate-2` escribe la propiedad `rotate` SUELTA y no
            `transform`, asi que convive con el `scale` del boton sin pisarlo.
            De eso se aprovecha el hover para enderezar la tarjeta: ver
            `.botella-banda` en globals.css.
          */
          className={`shrink-0 ${INCLINACION[i % INCLINACION.length]}`}
        >
          {/*
            UN <button> DE VERDAD, y no un <div> con onClick. Agregar al carrito
            es una accion: con un boton llega el teclado, el foco visible y el
            anuncio del lector de pantalla gratis. Solo la primera copia es
            alcanzable con Tab — las otras cinco son el mismo producto repetido
            y llenarian el recorrido de teclado con dieciocho paradas.
          */}
          <button
            type="button"
            onClick={() => alTocarBotella(p)}
            tabIndex={copia === 0 ? 0 : -1}
            aria-label={`Agregar ${p.nombre} al pedido`}
            className="botella-banda block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acento"
          >
            {p.imagen ? (
              <div className="botella-marco relative h-48 w-38 overflow-hidden rounded-2xl border-4 border-white/80 shadow-[0_14px_36px_rgba(150,60,30,0.3)] sm:h-64 sm:w-52">
                <Image
                  src={p.imagen.vertical.src}
                  alt=""
                  fill
                  /* La tarjeta mide 152px en movil y 208px desde `sm`. Sin
                     `sizes`, next/image serviria la de 1080 de ancho — sobre el
                     pliegue y dieciocho veces. */
                  sizes="(max-width: 640px) 152px, 208px"
                  className="object-cover"
                  draggable={false}
                />
              </div>
            ) : (
              <Botella
                color={p.color}
                nombre={p.nombre}
                className="h-48 w-auto drop-shadow-xl sm:h-64"
              />
            )}
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      ref={carril}
      onPointerDown={alApretar}
      onPointerMove={alMover}
      onPointerUp={alSoltar}
      onPointerCancel={alSoltar}
      /*
        `marquee` enciende la animacion y la pausa al pasar el cursor;
        `banda-quieta` la congela mientras el dedo la mueve Y mientras rueda
        sola, porque los dos movimientos sumados —el del bucle y el del
        lanzamiento— dan una velocidad que nadie pidio.

        `overflow-x-auto` con la barra escondida es lo que permite arrastrar:
        el gesto solo cambia `scrollLeft`. Es el mismo mecanismo que usa el
        navegador, asi que la rueda del raton y el desplazamiento por gestos
        del trackpad funcionan sin escribir nada mas.

        ============ EL RELLENO VERTICAL NO ES DECORATIVO ============
        Un contenedor con `overflow-x: auto` NO PUEDE tener `overflow-y:
        visible`: el CSS lo obliga a recortar tambien en vertical. Sin relleno,
        la tarjeta que crece bajo el cursor se sale de la caja y aparece
        cortada por arriba y por abajo — y aun en reposo se comia 5px de las
        tarjetas inclinadas.

        `py-16` (64px) es el hueco para el zoom, la inclinacion y la sombra
        —que al crecer llega a 26px de desplazamiento mas 32 de difuminado—. El
        `bottom` baja esos MISMOS 64px para que las botellas queden exactamente
        donde estaban: a 80px del borde en movil y 96px desde `sm`, que es la
        altura de la que depende que las olas les toquen solo el cuarto de
        abajo. Tocar uno de los dos obliga a tocar el otro.
        =============================================================

        `touch-pan-y` deja que el dedo siga desplazando la PAGINA en vertical.
        Sin eso, el carril se traga el gesto y en movil no se puede bajar con
        el dedo encima de la banda.
      */
      className={`marquee absolute inset-x-0 bottom-4 touch-pan-y overflow-x-auto overflow-y-hidden py-16 [scrollbar-width:none] sm:bottom-8 [&::-webkit-scrollbar]:hidden ${
        estado === "quieta" ? "cursor-grab" : "banda-quieta"
      } ${estado === "arrastrando" ? "cursor-grabbing" : ""}`}
    >
      <div
        className="marquee-pista flex"
        style={
          {
            "--marquee-duracion": "38s",
            "--marquee-copias": String(COPIAS),
          } as EstiloBanda
        }
      >
        {Array.from({ length: COPIAS }, (_, i) => juego(i))}
      </div>
    </div>
  );
}
