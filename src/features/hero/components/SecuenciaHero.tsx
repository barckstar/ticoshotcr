"use client";

import { useEffect, useRef } from "react";

/**
 * El fondo del hero: la secuencia de fotogramas que AVANZA CON EL SCROLL.
 *
 * ============== POR QUE UN CANVAS Y NO UN <video> ==============
 * La tecnica se llama *scroll-driven image sequence*, y es la que Apple
 * popularizo en las paginas de los AirPods Pro. Si uno inspecciona esas
 * paginas no encuentra un video: encuentra un <canvas> al que se le dibuja una
 * secuencia de imagenes, como un folioscopio.
 *
 * No es capricho. Scrubear un <video> moviendole `currentTime` le pide al
 * DECODIFICADOR que busque un fotograma arbitrario en tiempo real: el
 * resultado va a tirones, cambia de un dispositivo a otro y en Safari de
 * iPhone —que es donde va a estar casi todo el trafico de Ticoshot— es donde
 * peor se porta. Dibujar una imagen YA DESCARGADA en un canvas es instantaneo
 * y se comporta igual en todos lados.
 *
 * LO QUE CUESTA, dicho de frente: 64 fotogramas son 872 KB contra los 267 KB
 * que pesaba el video. Se paga asi:
 *
 *   - El LCP no cambia. Un <canvas> no es candidato a LCP, igual que el video
 *     sin poster no lo era: el candidato sigue siendo el texto de la tarjeta,
 *     que ya viene en el HTML.
 *   - Detras sigue el degradado. Mientras no ha bajado un solo fotograma, el
 *     hero se ve como antes: el mismo atardecer coral, quieto.
 *   - La descarga arranca DESPUES del primer pintado, y se dibuja siempre el
 *     fotograma mas cercano que ya haya llegado. O sea que la secuencia se va
 *     afinando mientras se usa, en vez de esperar a estar completa.
 * ==============================================================
 */

/** Los que produce `scripts/optimizar-fotos.py`: f-001.webp … f-064.webp */
const TOTAL = 64;
const ruta = (i: number) => `/hero/f-${String(i + 1).padStart(3, "0")}.webp`;

export function SecuenciaHero() {
  const lienzo = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = lienzo.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const imagenes: (HTMLImageElement | null)[] = new Array(TOTAL).fill(null);
    let cancelado = false;
    let pendiente = false;
    let ultimoDibujado = -1;

    /**
     * Busca el fotograma pedido; si aun no llego, el mas cercano que si.
     *
     * Sin esto, mientras la secuencia se descarga el canvas se quedaria en
     * negro o congelado en el primero. Asi el hero se ve completo desde el
     * segundo fotograma que llegue y solo gana suavidad con el tiempo.
     */
    function masCercano(indice: number): number {
      if (imagenes[indice]) return indice;
      for (let d = 1; d < TOTAL; d++) {
        if (imagenes[indice - d]) return indice - d;
        if (imagenes[indice + d]) return indice + d;
      }
      return -1;
    }

    function dibujar(indice: number) {
      const canvas = lienzo.current;
      if (!canvas || !ctx) return;

      const i = masCercano(indice);
      if (i < 0 || i === ultimoDibujado) return;
      const img = imagenes[i];
      if (!img) return;

      const { width: w, height: h } = canvas;
      /*
        `object-fit: cover` a mano. El canvas no tiene esa propiedad: si se
        dibujara la imagen estirada al tamano del lienzo, un fotograma 9:16
        sobre una pantalla ancha saldria aplastado.
      */
      const escala = Math.max(w / img.width, h / img.height);
      const dw = img.width * escala;
      const dh = img.height * escala;
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
      ultimoDibujado = i;

      /*
        El canvas se revela cuando hay ALGO dibujado, no cuando se monta. Un
        canvas vacio pinta NEGRO, y medio segundo de rectangulo negro tapando
        el degradado coral es peor que no tener secuencia.
      */
      canvas.dataset.listo = "true";
    }

    /** Cuanto se ha avanzado dentro del hero, de 0 a 1. */
    function progreso(): number {
      const seccion = canvas?.closest("section");
      if (!seccion) return 0;
      const caja = seccion.getBoundingClientRect();
      // Lo que se puede recorrer con la seccion fijada.
      const recorrido = caja.height - window.innerHeight;
      if (recorrido <= 0) return 0;
      return Math.min(1, Math.max(0, -caja.top / recorrido));
    }

    function alScrollear() {
      if (pendiente) return;
      pendiente = true;
      /*
        Un solo dibujo por fotograma de pantalla. El evento `scroll` se dispara
        muchisimas mas veces que eso, y dibujar en cada uno solo calienta el
        telefono sin que se vea ninguna diferencia.
      */
      requestAnimationFrame(() => {
        pendiente = false;
        if (cancelado) return;
        dibujar(quieto ? 0 : Math.round(progreso() * (TOTAL - 1)));
      });
    }

    function ajustarTamano() {
      const canvas = lienzo.current;
      if (!canvas) return;
      // Tope de 2: por encima no se nota y cuadruplica los pixeles a pintar.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      ultimoDibujado = -1; // cambiar el tamano borra el lienzo
      alScrollear();
    }

    function cargar(indice: number, alLlegar?: () => void) {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        if (cancelado) return;
        imagenes[indice] = img;
        alLlegar?.();

        /*
          EL PRIMER DIBUJO ES SINCRONO, el resto van por rAF.

          `requestAnimationFrame` no corre en una pestana de fondo. Si el
          primer fotograma esperara a uno, quien abre el sitio en una pestana
          que no esta mirando volveria a ella y encontraria el canvas VACIO
          hasta tocar el scroll. Pasando por `dibujar` directo, el hero ya
          esta pintado cuando la pestana vuelve al frente.

          Del segundo en adelante si conviene el rAF: ahi ya hay algo en
          pantalla y lo que importa es no dibujar mas de una vez por
          fotograma.
        */
        if (ultimoDibujado < 0) dibujar(0);
        else alScrollear();
      };
      img.src = ruta(indice);
    }

    /*
      MOVIMIENTO REDUCIDO: se dibuja el primer fotograma y se acaba.

      No se puede resolver desde CSS. Esconder el canvas no detendria nada —
      seguiria escuchando el scroll y redibujando, invisible — y el problema de
      `prefers-reduced-motion` no es que se vea, es que se mueva. Aqui
      directamente no se suscribe al scroll: el hero queda con una foto fija de
      fondo y todo lo demas funciona igual.
    */
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    ajustarTamano();

    /*
      El primero se pide solo, y el resto SOLO DESPUES de que llegue. Lanzar
      los 64 a la vez pone 64 peticiones a competir con la fuente, el CSS y las
      fotos del catalogo justo durante la carga — y la unica que de verdad hace
      falta al principio es esta.
    */
    cargar(0, () => {
      // Con movimiento reducido el resto no se va a usar nunca: son 64
      // peticiones y casi un mega para una imagen que se queda quieta.
      if (quieto) return;
      for (let i = 1; i < TOTAL; i++) cargar(i);
    });

    if (!quieto) {
      window.addEventListener("scroll", alScrollear, { passive: true });
    }
    window.addEventListener("resize", ajustarTamano);

    return () => {
      cancelado = true;
      window.removeEventListener("scroll", alScrollear);
      window.removeEventListener("resize", ajustarTamano);
    };
  }, []);

  return (
    <canvas
      ref={lienzo}
      /*
        Decorativo: lo que cuenta la secuencia —los tres productos— esta escrito
        en la tarjeta de encima y en el catalogo. Anunciarlo seria repetirlo.

        La opacidad la sube el CSS cuando hay algo dibujado; hasta entonces se
        ve el degradado de atras. Ver `.secuencia-hero` en globals.css.
      */
      aria-hidden="true"
      className="secuencia-hero absolute inset-0 -z-10 size-full"
    />
  );
}
