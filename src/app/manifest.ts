import type { MetadataRoute } from "next";
import { negocio } from "@/shared/config/negocio";

/**
 * El manifiesto de la aplicacion web.
 *
 * No es para convertir esto en una PWA — no hay nada que funcione sin conexion
 * ni tiene sentido que lo haya. Sirve para lo que de verdad pasa con el sitio
 * de un negocio en Costa Rica: que alguien lo guarde en la pantalla de inicio
 * del telefono. Sin manifiesto, ese acceso directo sale con el nombre del
 * dominio y una captura de la pagina en vez del logo.
 *
 * Va como `manifest.ts` y no como archivo estatico para que el nombre y los
 * colores salgan de `negocio.ts`, que es la unica fuente de esos datos.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${negocio.nombre} — ${negocio.tagline}`,
    short_name: negocio.nombre,
    description: `Litros de chiliguaro, miguelito y sangría artesanales en ${negocio.ciudad}, ${negocio.provincia}.`,
    start_url: "/",
    display: "standalone",
    /* El crema del fondo y el rojo del logo: los mismos del reparto 70/30/10. */
    background_color: "#FFF4EC",
    theme_color: "#D32027",
    lang: "es-CR",
    categories: ["food", "shopping"],
    icons: [
      { src: "/marca/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/marca/icon-512.png", sizes: "512x512", type: "image/png" },
      /*
        `maskable` deja que Android recorte el icono a la forma que use el
        lanzador —circulo, cuadrado redondeado— sin comerse el dibujo. Sin una
        entrada asi, Android mete el icono dentro de un cuadrado blanco y se ve
        como una pegatina, no como un icono del sistema.
      */
      {
        src: "/marca/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
