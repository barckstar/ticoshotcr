"use client";

import { useEffect, useRef, useState } from "react";
import { Seccion } from "@/shared/components/ui/Seccion";
import { Tarjeta } from "@/shared/components/ui/Tarjeta";
import { Boton } from "@/shared/components/ui/Boton";
import { IconoWhatsApp } from "@/shared/components/ui/Iconos";
import { enviarPorWhatsApp } from "@/shared/lib/whatsapp";
import { etiquetaIntensidad, MAX_PERSONAS, type Intensidad } from "../lib/evento";
import { construirMensajeEvento } from "../lib/mensajeEvento";
import type { Servicio } from "../lib/servicio";
import { ServicioBarra } from "./ServicioBarra";

/**
 * Eventos y catering.
 *
 * AQUI HABIA UN COTIZADOR DE LITROS y se quito a pedido del cliente. La razon
 * de fondo es buena: los shots por persona los habia puesto el programador, no
 * el bartender, y un numero inventado que el sitio presenta como calculo es
 * peor que no dar ninguno. Quien lleva mas de cinco anos de barra sabe cuanto
 * se toma en una fiesta de sesenta personas; el sitio no.
 *
 * En su lugar va el VIDEO de las tres botellas, y el formulario recoge los
 * datos para que el numero lo ponga quien sabe.
 */

const tipos = [
  "Cumpleaños",
  "Boda",
  "Fiesta de empresa",
  "Graduación",
  "Playa o paseo",
  "Otro",
] as const;

/**
 * `servicio` llega YA VALIDADO desde `app/page.tsx`, que es de servidor.
 *
 * Este componente lleva "use client", y todo lo que importa se vuelve codigo
 * de cliente en cascada. Parseando aqui —o dentro de ServicioBarra— Zod entero
 * bajaba al navegador para validar tres parrafos que nunca cambian: 91 KB
 * comprimidos en la carga inicial que no delataba ni el build ni el lint.
 */
export function Eventos({ servicio }: { servicio: Servicio[] }) {
  const [personas, setPersonas] = useState("");
  const [intensidad, setIntensidad] = useState<Intensidad>("normal");
  const [tipo, setTipo] = useState<string>(tipos[0]);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fecha, setFecha] = useState("");
  const [lugar, setLugar] = useState("");
  const [notas, setNotas] = useState("");
  const [intentado, setIntentado] = useState(false);

  const video = useRef<HTMLVideoElement>(null);

  /*
    `prefers-reduced-motion` no se puede resolver desde CSS: esconder un video
    no lo pausa, solo lo hace invisible mientras sigue corriendo y gastando
    bateria. Pausado se queda en su poster, que son las tres botellas.
  */
  useEffect(() => {
    const consulta = window.matchMedia("(prefers-reduced-motion: reduce)");
    function aplicar() {
      const el = video.current;
      if (!el) return;
      if (consulta.matches) {
        el.pause();
        el.currentTime = 0;
      } else {
        // Se rechaza si el navegador bloquea el autoplay. No es un error: es
        // su decision, y el poster deja el bloque perfectamente presentable.
        void el.play().catch(() => {});
      }
    }
    aplicar();
    consulta.addEventListener("change", aplicar);
    return () => consulta.removeEventListener("change", aplicar);
  }, []);

  /*
    Solo tres campos son obligatorios: nombre, telefono y cuanta gente. La
    fecha y el lugar se dejan libres a proposito — quien esta averiguando
    precios todavia no tiene fecha, y exigirsela es la forma mas rapida de
    perderlo.
  */
  const cantidad = Number(personas);
  const faltaNombre = nombre.trim().length < 2;
  const faltaTelefono = telefono.trim().length < 8;
  const faltaPersonas = !Number.isFinite(cantidad) || cantidad < 1;
  const listo = !faltaNombre && !faltaTelefono && !faltaPersonas;

  function enviar() {
    setIntentado(true);
    if (!listo) return;

    const { texto } = construirMensajeEvento({
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      personas: Math.min(Math.floor(cantidad), MAX_PERSONAS),
      intensidad,
      fecha: fecha.trim() || "Todavía sin definir",
      lugar: lugar.trim() || "Por confirmar",
      tipo,
      notas: notas.trim(),
    });

    enviarPorWhatsApp(texto);
  }

  const campo =
    "w-full rounded-xl border border-borde bg-superficie px-4 py-3 text-texto " +
    "placeholder:text-texto-suave/70 focus:border-acento focus:outline-2 " +
    "focus:outline-offset-0 focus:outline-acento";
  const etiqueta =
    "block font-display text-xs font-bold uppercase tracking-[0.15em] text-texto-suave";
  const error = "mt-1.5 text-sm font-medium text-acento";

  return (
    <Seccion
      id="eventos"
      antetitulo="Eventos y catering"
      titulo="Ponemos la barra de tu fiesta"
      decorado="eventos"
    >
      <ServicioBarra servicio={servicio} />

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <p className="text-lg leading-relaxed text-texto">
            Contanos de tu evento y te armamos la barra. El precio se acuerda
            por WhatsApp según la fecha, el lugar, cuánta gente va y qué toma tu
            gente.
          </p>

          {/*
            EL VIDEO.

            LLEVA `poster`, a diferencia de como habria ido en el hero. Alli un
            poster convierte al video en candidato a LCP y la nota de
            rendimiento pasa a depender de que baje una imagen mas; aqui esta
            muy por debajo del pliegue, asi que el poster no cuesta nada y evita
            el rectangulo NEGRO que pinta un <video> sin datos.

            El poster es el SEGUNDO 7,5, donde ya estan las tres botellas
            juntas. El primer fotograma es fondo coral vacio: una portada que
            no dice que se vende.

            `preload="none"`: el video no se descarga hasta que el navegador
            decide, y hasta entonces lo que se ve es el poster — 44 KB contra
            los 267 KB del video.
          */}
          <div className="mt-7 overflow-hidden rounded-3xl ring-1 ring-borde">
            <video
              ref={video}
              className="aspect-4/5 w-full object-cover"
              poster="/video/hero-poster.webp"
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              /* Decorativo: los tres productos estan escritos en el catalogo.
                 Anunciarlo aqui seria repetirlo. */
              aria-hidden="true"
              tabIndex={-1}
            >
              <source src="/video/hero.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        <Tarjeta className="h-fit p-7 sm:p-8">
          {/*
            `noValidate` y validacion propia: los globos del navegador salen en
            el idioma del sistema, asi que a un tico con el telefono en ingles
            le aparece "Please fill out this field" en medio de una pagina en
            espanol — y encima bloquea el envio antes de que se vean los
            mensajes en espanol que hay escritos aqui.
          */}
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              enviar();
            }}
            className="space-y-5"
          >
            <div>
              <label htmlFor="ev-personas" className={etiqueta}>
                ¿Cuántas personas? *
              </label>
              <input
                id="ev-personas"
                type="number"
                inputMode="numeric"
                min={1}
                max={MAX_PERSONAS}
                value={personas}
                onChange={(e) => setPersonas(e.target.value)}
                placeholder="60"
                className={`mt-2 ${campo}`}
                aria-describedby={
                  intentado && faltaPersonas ? "ev-personas-error" : undefined
                }
              />
              {intentado && faltaPersonas && (
                <p id="ev-personas-error" className={error}>
                  Poné cuánta gente va, aunque sea aproximado.
                </p>
              )}
            </div>

            <fieldset>
              <legend className={etiqueta}>¿Cómo va a estar el ambiente?</legend>
              <div className="mt-2 space-y-2">
                {(Object.keys(etiquetaIntensidad) as Intensidad[]).map((op) => (
                  <label
                    key={op}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
                      intensidad === op
                        ? "border-acento bg-acento/5 font-semibold text-texto"
                        : "border-borde text-texto-suave hover:border-acento/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="intensidad"
                      value={op}
                      checked={intensidad === op}
                      onChange={() => setIntensidad(op)}
                      className="size-4 accent-[var(--color-acento)]"
                    />
                    {etiquetaIntensidad[op]}
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="ev-tipo" className={etiqueta}>
                ¿Qué se celebra?
              </label>
              <select
                id="ev-tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className={`mt-2 ${campo}`}
              >
                {tipos.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="ev-nombre" className={etiqueta}>
                  Tu nombre *
                </label>
                <input
                  id="ev-nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  autoComplete="name"
                  className={`mt-2 ${campo}`}
                  aria-describedby={
                    intentado && faltaNombre ? "ev-nombre-error" : undefined
                  }
                />
                {intentado && faltaNombre && (
                  <p id="ev-nombre-error" className={error}>
                    Falta tu nombre.
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="ev-telefono" className={etiqueta}>
                  Teléfono *
                </label>
                <input
                  id="ev-telefono"
                  type="tel"
                  inputMode="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  autoComplete="tel"
                  placeholder="8888 8888"
                  className={`mt-2 ${campo}`}
                  aria-describedby={
                    intentado && faltaTelefono ? "ev-telefono-error" : undefined
                  }
                />
                {intentado && faltaTelefono && (
                  <p id="ev-telefono-error" className={error}>
                    Falta un teléfono de al menos 8 dígitos.
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="ev-fecha" className={etiqueta}>
                  ¿Qué día?
                </label>
                <input
                  id="ev-fecha"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  placeholder="Sábado 12, o todavía no sé"
                  className={`mt-2 ${campo}`}
                />
              </div>

              <div>
                <label htmlFor="ev-lugar" className={etiqueta}>
                  ¿Dónde?
                </label>
                <input
                  id="ev-lugar"
                  value={lugar}
                  onChange={(e) => setLugar(e.target.value)}
                  placeholder="San Ramón centro"
                  className={`mt-2 ${campo}`}
                />
              </div>
            </div>

            <div>
              <label htmlFor="ev-notas" className={etiqueta}>
                Algo más que debamos saber
              </label>
              <textarea
                id="ev-notas"
                rows={3}
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Hay gente que no toma picante, necesitamos hielera, etc."
                className={`mt-2 resize-y ${campo}`}
              />
            </div>

            <Boton type="submit" tamano="lg" className="w-full">
              <IconoWhatsApp className="size-5" />
              Mandar la consulta
            </Boton>

            <p className="text-center text-xs leading-relaxed text-texto-suave">
              Se abre WhatsApp con el mensaje escrito. Podés revisarlo antes de
              mandarlo.
            </p>
          </form>
        </Tarjeta>
      </div>
    </Seccion>
  );
}
