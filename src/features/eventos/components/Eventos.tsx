"use client";

import { useMemo, useState } from "react";
import { Seccion } from "@/shared/components/ui/Seccion";
import { Tarjeta } from "@/shared/components/ui/Tarjeta";
import { Boton } from "@/shared/components/ui/Boton";
import { IconoWhatsApp } from "@/shared/components/ui/Iconos";
import { enviarPorWhatsApp } from "@/shared/lib/whatsapp";
import {
  etiquetaIntensidad,
  shotsPorPersona,
  litrosParaPersonas,
  repartirLitros,
  MAX_PERSONAS,
  type Intensidad,
} from "../lib/cotizador";
import { explicarCalculo } from "../lib/cotizador";
import { construirMensajeEvento } from "../lib/mensajeEvento";
import { ServicioBarra } from "./ServicioBarra";

/**
 * Eventos y catering, con el cotizador dentro.
 *
 * VA EN LA SECCION Y NO EN UN DRAWER, a diferencia del carrito y el checkout.
 * El spec decia drawer y se cambio al escribirlo por una razon concreta: el
 * calculo ES el contenido de esta seccion, no un paso posterior. Metido en un
 * drawer, quien baja ve un boton que dice "cotizar" y tiene que decidir si
 * abrirlo sin saber que hay dentro; inline, ve el numero cambiar mientras
 * escribe y eso es justo lo que lo engancha. El drawer se reserva para lo que
 * interrumpe una tarea — el pedido —, no para lo que la seccion viene a hacer.
 *
 * EL CALCULO ES SINCRONO Y LOCAL. No hay peticion de red ni estado que
 * sincronizar: `useMemo` sobre dos numeros. Por eso se puede permitir
 * recalcular en cada tecla.
 */

const tipos = [
  "Cumpleaños",
  "Boda",
  "Fiesta de empresa",
  "Graduación",
  "Playa o paseo",
  "Otro",
] as const;

export function Eventos({ nombres }: { nombres: Record<string, string> }) {
  const [personas, setPersonas] = useState("");
  const [intensidad, setIntensidad] = useState<Intensidad>("normal");
  const [tipo, setTipo] = useState<string>(tipos[0]);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fecha, setFecha] = useState("");
  const [lugar, setLugar] = useState("");
  const [notas, setNotas] = useState("");
  const [intentado, setIntentado] = useState(false);

  const cantidad = Number(personas);
  const litros = litrosParaPersonas(cantidad, intensidad);
  const mezcla = useMemo(
    () => repartirLitros(litros, nombres),
    [litros, nombres],
  );

  /*
    Solo tres campos son obligatorios: nombre, telefono y cuanta gente. La
    fecha y el lugar se dejan libres a proposito — quien esta averiguando
    precios todavia no tiene fecha, y exigirsela es la forma mas rapida de
    perderlo.
  */
  const faltaNombre = nombre.trim().length < 2;
  const faltaTelefono = telefono.trim().length < 8;
  const faltaPersonas = litros === 0;
  const listo = !faltaNombre && !faltaTelefono && !faltaPersonas;

  function enviar() {
    setIntentado(true);
    if (!listo) return;

    const { texto } = construirMensajeEvento(
      {
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        personas: Math.min(Math.floor(cantidad), MAX_PERSONAS),
        intensidad,
        fecha: fecha.trim() || "Todavía sin definir",
        lugar: lugar.trim() || "Por confirmar",
        tipo,
        notas: notas.trim(),
      },
      litros,
      mezcla,
    );

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
    >
      <ServicioBarra />


      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        <div>
          <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-texto">
            ¿Cuántos litros para tu fiesta?
          </h3>
          <p className="mt-3 leading-relaxed text-texto-suave">
            Poné cuánta gente va y el sitio calcula de cuántos litros de lo
            nuestro estamos hablando. Es un punto de partida para la
            conversación, no una cotización: el resto de la barra y el precio se
            arman por WhatsApp según la fecha, el lugar y qué toma tu gente.
          </p>

          {/* EL RESULTADO. Va arriba en móvil, donde se ve sin bajar. */}
          <Tarjeta fondo="bg-acento ring-acento" className="mt-8 p-7 text-white">
            <p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-white/85">
              Para {litros > 0 ? `${Math.floor(cantidad)} personas` : "tu fiesta"}
            </p>

            <p className="mt-2 font-display text-5xl font-bold tracking-tight">
              {litros > 0 ? litros : "—"}
              <span className="ml-2 text-xl font-semibold">
                {litros === 1 ? "litro" : "litros"}
              </span>
            </p>

            {/*
              LA CUENTA, ESCRITA. Sin esto el cotizador devuelve "12 litros" y
              no hay forma de discutirlo: o se le cree o no. Con el supuesto a
              la vista, quien organiza la fiesta puede decir "nosotros tomamos
              mas que eso", que es la conversacion que hay que tener ANTES de
              comprar. Ver el comentario largo en cotizador.ts.
            */}
            {litros > 0 && (
              <p className="mt-3 text-sm text-white/85">
                {explicarCalculo(cantidad, intensidad, litros)}
              </p>
            )}

            {mezcla.length > 0 ? (
              <ul className="mt-5 space-y-1.5 border-t border-white/25 pt-5">
                {mezcla.map((m) => (
                  <li key={m.id} className="flex justify-between gap-4 text-sm">
                    <span>{m.nombre}</span>
                    <span className="font-semibold tabular-nums">
                      {m.litros} {m.litros === 1 ? "litro" : "litros"}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 border-t border-white/25 pt-5 text-sm text-white/90">
                Escribí cuánta gente va y aparece el cálculo.
              </p>
            )}
          </Tarjeta>
        </div>

        <Tarjeta className="p-7 sm:p-8">
          {/*
            `noValidate` y validacion propia: los globos del navegador salen en
            el idioma del sistema, asi que a un tico con el telefono en ingles
            le aparece "Please fill out this field" en medio de una pagina en
            espanol.
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
                    <span>
                      {etiquetaIntensidad[op]}
                      <span className="ml-1 font-normal text-texto-suave">
                        · {shotsPorPersona[op]} shots por persona
                      </span>
                    </span>
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
