"use client";

import { useState } from "react";
import { Logo } from "@/shared/components/ui/Logo";
import { Contenedor } from "@/shared/components/ui/Contenedor";
import { BotonEnlace } from "@/shared/components/ui/Boton";
import { IconoWhatsApp } from "@/shared/components/ui/Iconos";
import { useNavbarOculto } from "@/shared/lib/useNavbarOculto";
import { enlaceWhatsApp, mensajeConsulta, negocio } from "@/shared/config/negocio";

/**
 * Los enlaces del navbar.
 *
 * SON ANCLAS, no rutas: el sitio entero es una sola pagina. Cada `href` tiene
 * que coincidir con el `id` de una <Seccion>, y cambiar uno aqui sin cambiarlo
 * alla deja un enlace que no lleva a ningun lado sin que nada avise.
 *
 * Cinco y no nueve. Estan las nueve secciones, pero un navbar con nueve
 * enlaces no se lee: se recorre. Las otras cuatro se alcanzan bajando, que es
 * lo que uno hace en una pagina unica de todas formas.
 */
const enlaces = [
  { href: "#productos", texto: "Los tres" },
  { href: "#kits", texto: "Hielera" },
  { href: "#nosotros", texto: "Nosotros" },
  { href: "#eventos", texto: "Eventos" },
  { href: "#preguntas", texto: "Preguntas" },
] as const;

export function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  /*
    El menu movil BLOQUEA el ocultamiento. Si el navbar se fuera hacia arriba
    con el menu desplegado, el menu se iria con el y el usuario veria su propio
    toque cerrar la pantalla. Constante del esquema general — ver D:\CLAUDE.md.
  */
  const oculto = useNavbarOculto(menuAbierto);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-transform duration-300",
        "border-b border-borde/70 bg-crema/85 backdrop-blur-md",
        oculto ? "-translate-y-full" : "translate-y-0",
      ].join(" ")}
    >
      <Contenedor>
        <nav
          aria-label="Principal"
          className="flex h-16 items-center justify-between gap-4 sm:h-18"
        >
          <a
            href="#inicio"
            className="flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acento"
          >
            <Logo className="h-9 w-auto text-acento" titulo={null} />
            <span className="font-display text-xl font-bold uppercase tracking-tight text-texto">
              {negocio.nombre}
            </span>
          </a>

          <ul className="hidden items-center gap-7 lg:flex">
            {enlaces.map(({ href, texto }) => (
              <li key={href}>
                <a
                  href={href}
                  className="font-display text-sm font-semibold uppercase tracking-wide text-texto transition-colors hover:text-acento focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acento"
                >
                  {texto}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            {/*
              EL `hidden` VA EN UN ENVOLTORIO, no en el boton.

              `Boton` trae `inline-flex` fijo en su cadena de clases base. Una
              utilidad de `display` puesta por quien llama —`hidden`— tiene la
              MISMA especificidad, asi que gana la que Tailwind ponga mas abajo
              en la hoja, no la que se escribio despues: el boton seguia
              visible a 375px, el telefono partido en dos lineas y el logo
              aplastado contra la hamburguesa. Un <span> aparte no compite con
              nada. Mismo problema que tenia el fondo de Tarjeta.
            */}
            <span className="hidden sm:block">
              <BotonEnlace href={enlaceWhatsApp(mensajeConsulta())}>
                <IconoWhatsApp className="size-4" />
                {negocio.whatsappVisible}
              </BotonEnlace>
            </span>

            <button
              type="button"
              onClick={() => setMenuAbierto((v) => !v)}
              aria-expanded={menuAbierto}
              aria-controls="menu-movil"
              className="rounded-lg p-2 text-texto transition-colors hover:text-acento focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento lg:hidden"
            >
              <span className="sr-only">
                {menuAbierto ? "Cerrar menú" : "Abrir menú"}
              </span>
              {/* Hamburguesa que se cruza. Solo transform: va en GPU. */}
              <span aria-hidden="true" className="flex h-5 w-6 flex-col justify-between">
                <span
                  className={`h-0.5 w-full origin-left bg-current transition-transform duration-300 ${
                    menuAbierto ? "translate-x-px rotate-45" : ""
                  }`}
                />
                <span
                  className={`h-0.5 w-full bg-current transition-opacity duration-300 ${
                    menuAbierto ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`h-0.5 w-full origin-left bg-current transition-transform duration-300 ${
                    menuAbierto ? "translate-x-px -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>
      </Contenedor>

      {/*
        El menu movil se despliega con grid-rows de 0fr a 1fr. Es la unica
        forma de animar "hasta el alto que necesite" sin fijar un max-height a
        ojo, que o corta el contenido o deja la animacion con un tramo muerto.
      */}
      <div
        id="menu-movil"
        className={`grid overflow-hidden transition-[grid-template-rows] duration-300 lg:hidden ${
          menuAbierto ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0">
          <Contenedor>
            <ul className="flex flex-col gap-1 border-t border-borde py-4">
              {enlaces.map(({ href, texto }) => (
                <li key={href}>
                  <a
                    href={href}
                    onClick={() => setMenuAbierto(false)}
                    className="block rounded-xl px-3 py-3 font-display text-base font-semibold uppercase tracking-wide text-texto transition-colors hover:bg-superficie-alt hover:text-acento"
                  >
                    {texto}
                  </a>
                </li>
              ))}
              <li className="mt-2 sm:hidden">
                <BotonEnlace
                  href={enlaceWhatsApp(mensajeConsulta())}
                  className="w-full"
                  tamano="lg"
                >
                  <IconoWhatsApp className="size-5" />
                  {negocio.whatsappVisible}
                </BotonEnlace>
              </li>
            </ul>
          </Contenedor>
        </div>
      </div>
    </header>
  );
}
