"use client";

import { useEffect, useRef } from "react";

/**
 * El video de fondo del hero: las tres botellas pasando y cerrando con las
 * tres juntas.
 *
 * ES LA UNICA ISLA DE CLIENTE DEL HERO, y existe por una sola razon:
 * `prefers-reduced-motion`. No hay forma de apagar el autoplay desde CSS —
 * esconder el elemento no lo detiene, solo lo hace invisible mientras sigue
 * corriendo y gastando bateria. Todo lo demas del hero —tarjeta, logo, texto,
 * olas— sigue siendo de servidor.
 *
 * NO LLEVA `poster`, Y ES A PROPOSITO.
 *
 * Un `poster` convierte al video en candidato a LCP, y entonces la nota de
 * rendimiento pasa a depender de que baje una imagen mas. Sin poster, el
 * candidato a LCP vuelve a ser el bloque de texto de la tarjeta, que ya viene
 * en el HTML. Mientras el video no ha cargado se ve el degradado de abajo, que
 * es del mismo atardecer coral: no hay hueco negro ni salto de color.
 *
 * El video se revela con una transicion de opacidad al poder reproducirse, asi
 * que el cambio de degradado a video no se nota como un parpadeo.
 */
export function VideoFondo() {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = video.current;
    if (!el) return;

    const consulta = window.matchMedia("(prefers-reduced-motion: reduce)");

    function aplicar() {
      const el = video.current;
      if (!el) return;
      if (consulta.matches) {
        el.pause();
        /*
          Vuelve al primer fotograma en vez de congelarse donde iba. Detenido a
          mitad del recorrido se queda una botella cortada por el borde, que se
          lee como que el sitio se rompio.
        */
        el.currentTime = 0;
      } else {
        // `play()` devuelve una promesa que se rechaza si el navegador decide
        // bloquear el autoplay. No es un error: es su decision, y el degradado
        // de atras deja el hero perfectamente presentable.
        void el.play().catch(() => {});
      }
    }

    aplicar();
    consulta.addEventListener("change", aplicar);
    return () => consulta.removeEventListener("change", aplicar);
  }, []);

  return (
    <video
      ref={video}
      className="video-hero absolute inset-0 -z-10 size-full object-cover"
      /* Los cuatro juntos son lo que hace que un video de fondo se reproduzca
         solo en iPhone: sin `playsInline` iOS lo abre a pantalla completa, y
         sin `muted` no arranca nunca. */
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      /* Decorativo: lo que cuenta el video —los tres productos— esta escrito
         en la tarjeta de encima y en el catalogo. Anunciarlo seria repetirlo. */
      aria-hidden="true"
      tabIndex={-1}
      /*
        TRES EVENTOS PARA LO MISMO, y no es redundancia por si acaso.

        `canplay` es el que deberia bastar, pero no siempre llega: con el
        ahorro de datos encendido, o con `preload` recortado por el navegador,
        hay casos en que el video termina reproduciendose sin haberlo emitido.
        Si el revelado dependiera solo de el, el video quedaria en opacidad 0
        para siempre — corriendo, invisible, y gastando datos para nada.

        Los tres apuntan al mismo atributo, asi que el primero que llegue gana
        y los demas no hacen nada.
      */
      onCanPlay={(e) => {
        e.currentTarget.dataset.listo = "true";
      }}
      onLoadedData={(e) => {
        e.currentTarget.dataset.listo = "true";
      }}
      onPlaying={(e) => {
        e.currentTarget.dataset.listo = "true";
      }}
    >
      <source src="/video/hero.mp4" type="video/mp4" />
    </video>
  );
}
