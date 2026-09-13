"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { useCarrito } from "@/shared/lib/carrito";
import { formatoColones } from "@/shared/lib/formatoColones";
import { IconoWhatsApp } from "@/shared/components/ui/Iconos";
import { suscribir, leerCrudo } from "@/shared/lib/almacenLocal";
import {
  datosPedidoSchema,
  etiquetaMetodoPago,
  metodosPago,
  type DatosPedido,
} from "../schema";
import { construirMensaje } from "../lib/construirMensaje";
import { enviarPorWhatsApp, LIMITE_SEGURO } from "@/shared/lib/whatsapp";
import {
  CLAVE_DIRECCIONES,
  guardarDireccion,
  leerDirecciones,
  olvidarDireccion,
} from "../lib/direccionesGuardadas";
import { CLAVE_CLIENTE, guardarCliente, leerCliente } from "../lib/datosCliente";
import { BotonUbicacion } from "./BotonUbicacion";

type Errores = Partial<Record<keyof DatosPedido, string>>;

export function CheckoutDrawer({
  abierto,
  onCerrar,
}: {
  abierto: boolean;
  onCerrar: () => void;
}) {
  const { lineas, total, faltanPrecios, vaciar } = useCarrito();

  const [modalidad, setModalidad] = useState<"retiro" | "entrega">("retiro");
  const [metodoPago, setMetodoPago] =
    useState<(typeof metodosPago)[number]>("sinpe");
  const [direccion, setDireccion] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [errores, setErrores] = useState<Errores>({});
  const [avisoLargo, setAvisoLargo] = useState<string | null>(null);

  // Las direcciones guardadas se leen del almacen externo, igual que el carrito.
  useSyncExternalStore(
    useCallback((f) => suscribir(CLAVE_DIRECCIONES, f), []),
    () => leerCrudo(CLAVE_DIRECCIONES),
    () => null,
  );
  const guardadas = typeof window === "undefined" ? [] : leerDirecciones();

  /*
    Nombre y telefono de la vez pasada, para no volver a teclearlos. Se leen
    del mismo almacen externo por la misma razon que el carrito: hidratar con
    `setState` dentro de un efecto esta prohibido por React 19.
  */
  useSyncExternalStore(
    useCallback((f) => suscribir(CLAVE_CLIENTE, f), []),
    () => leerCrudo(CLAVE_CLIENTE),
    () => null,
  );
  const cliente = typeof window === "undefined" ? null : leerCliente();

  useEffect(() => {
    if (!abierto) return;
    document.body.style.overflow = "hidden";
    function alPulsar(e: KeyboardEvent) {
      if (e.key === "Escape") onCerrar();
    }
    document.addEventListener("keydown", alPulsar);
    return () => {
      document.removeEventListener("keydown", alPulsar);
      document.body.style.overflow = "";
    };
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAvisoLargo(null);

    const form = new FormData(e.currentTarget);
    const crudo = {
      nombre: String(form.get("nombre") ?? ""),
      telefono: String(form.get("telefono") ?? ""),
      modalidad,
      metodoPago,
      direccion,
      notas: String(form.get("notas") ?? ""),
      // La ubicacion solo viaja en entrega: en retiro no le sirve a nadie y es
      // un dato personal que no hay razon de enviar.
      ...(modalidad === "entrega" && coords ? coords : {}),
    };

    const validado = datosPedidoSchema.safeParse(crudo);
    if (!validado.success) {
      const nuevos: Errores = {};
      for (const problema of validado.error.issues) {
        const campo = problema.path[0] as keyof DatosPedido;
        if (!nuevos[campo]) nuevos[campo] = problema.message;
      }
      setErrores(nuevos);
      return;
    }
    setErrores({});

    const mensaje = construirMensaje(lineas, validado.data, total);

    // Guarda contra el truncado silencioso de WhatsApp.
    if (mensaje.excedeLimite) {
      setAvisoLargo(
        `El pedido es muy largo para enviarlo en un solo mensaje (${mensaje.largoCodificado} de ${LIMITE_SEGURO} caracteres). Dividilo en dos pedidos o acortá las indicaciones.`,
      );
      return;
    }

    // Se recuerdan siempre, no solo en entrega: en retiro tambien se piden.
    guardarCliente({
      nombre: validado.data.nombre,
      telefono: validado.data.telefono,
    });

    if (modalidad === "entrega" && direccion.trim()) {
      guardarDireccion({
        texto: direccion.trim(),
        ...(coords ?? {}),
        usadaEn: Date.now(),
      });
    }

    enviarPorWhatsApp(mensaje.texto);
    vaciar();
    onCerrar();
  }

  return (
    /*
        `h-[100dvh]` ademas de `inset-0`: un elemento fijo se dimensiona contra
        el viewport de MAQUETA, que en Android se queda corto cuando la barra
        de direcciones se retrae. El drawer terminaba unos pixeles antes del
        borde y por esa rendija asomaba lo que hubiera detras. `dvh` sigue el
        viewport real. No se pudo reproducir en el navegador de escritorio: es
        una correccion dirigida al comportamiento de Android.
      */
      <div className="fixed inset-0 h-[100dvh] z-[70]">
      <div
        className="absolute inset-0 bg-texto/70 backdrop-blur-sm"
        onClick={onCerrar}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-checkout"
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-borde bg-superficie shadow-2xl"
      >
        <header className="flex items-center justify-between gap-4 border-b border-borde px-5 py-4">
          <h2
            id="titulo-checkout"
            className="font-display text-xl font-bold uppercase tracking-wide text-texto"
          >
            Terminar el pedido
          </h2>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="grid size-9 place-items-center rounded-full text-2xl leading-none text-texto-suave transition-colors hover:text-acento focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento"
          >
            ×
          </button>
        </header>

        {/*
          `noValidate` APAGA LA VALIDACION DEL NAVEGADOR, y no es por capricho.

          Los campos llevan `required` —que es lo correcto para un lector de
          pantalla— y ademas este formulario valida con Zod y pinta sus propios
          mensajes en español. Sin `noValidate` el navegador se adelanta: sale
          su globo nativo EN EL IDIOMA DEL SISTEMA ("Please fill out this
          field" a quien tenga el telefono en ingles), bloquea el envio, y los
          mensajes de Zod que hay escritos aqui no se ven NUNCA.
        */}
        <form
          noValidate
          onSubmit={enviar}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
            <fieldset>
              <legend className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-acento">
                ¿Cómo lo querés recibir?
              </legend>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {(
                  [
                    { valor: "retiro", texto: "Lo retiro yo" },
                    { valor: "entrega", texto: "Que me lo lleven" },
                  ] as const
                ).map((o) => (
                  <Opcion
                    key={o.valor}
                    activo={modalidad === o.valor}
                    onClick={() => setModalidad(o.valor)}
                  >
                    {o.texto}
                  </Opcion>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-acento">
                ¿Cómo vas a pagar?
              </legend>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {metodosPago.map((m) => (
                  <Opcion
                    key={m}
                    activo={metodoPago === m}
                    onClick={() => setMetodoPago(m)}
                  >
                    {etiquetaMetodoPago[m]}
                  </Opcion>
                ))}
              </div>
              <p className="mt-2 text-xs text-texto-suave">
                Se paga al recibir. El sitio no cobra nada: el pago se coordina directo por WhatsApp.
              </p>
            </fieldset>

            <Campo
              nombre="nombre"
              etiqueta="Nombre"
              error={errores.nombre}
              autoComplete="name"
              valorInicial={cliente?.nombre}
              required
            />
            <Campo
              nombre="telefono"
              etiqueta="Teléfono"
              tipo="tel"
              marcador="8888-8888"
              error={errores.telefono}
              autoComplete="tel"
              valorInicial={cliente?.telefono}
              required
            />

            {modalidad === "entrega" && (
              <div>
                <label
                  htmlFor="direccion"
                  className="block font-display text-xs font-semibold uppercase tracking-[0.2em] text-acento"
                >
                  Dirección
                </label>

                {guardadas.length > 0 && (
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {guardadas.map((d) => (
                      <li key={d.texto}>
                        <span className="inline-flex items-center gap-1 rounded-full border border-borde bg-superficie py-1 pl-3 pr-1 text-xs">
                          <button
                            type="button"
                            onClick={() => {
                              setDireccion(d.texto);
                              if (d.lat && d.lng)
                                setCoords({ lat: d.lat, lng: d.lng });
                            }}
                            className="max-w-40 truncate text-texto-suave transition-colors hover:text-acento"
                          >
                            {d.texto}
                          </button>
                          <button
                            type="button"
                            onClick={() => olvidarDireccion(d.texto)}
                            aria-label={`Olvidar la dirección ${d.texto}`}
                            className="grid size-5 place-items-center rounded-full text-texto-suave transition-colors hover:text-acento"
                          >
                            ×
                          </button>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                <input
                  id="direccion"
                  name="direccion"
                  type="text"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Barrio y señas exactas"
                  autoComplete="street-address"
                  aria-invalid={errores.direccion ? true : undefined}
                  aria-describedby={
                    errores.direccion ? "direccion-error" : undefined
                  }
                  className={`mt-2 w-full rounded-xl border bg-superficie px-4 py-3 text-texto placeholder:text-texto-suave/50 focus:outline-none ${
                    errores.direccion
                      ? "border-acento"
                      : "border-borde focus:border-acento/70"
                  }`}
                />
                {errores.direccion && (
                  <p id="direccion-error" className="mt-1.5 text-xs text-acento">
                    {errores.direccion}
                  </p>
                )}

                <BotonUbicacion
                  tieneUbicacion={coords !== null}
                  onUbicacion={(lat, lng) => setCoords({ lat, lng })}
                  onLimpiar={() => setCoords(null)}
                />
              </div>
            )}

            <Campo
              nombre="notas"
              etiqueta="Indicaciones adicionales (opcional)"
              marcador="Para las 6 p. m., bien frío, portón negro…"
              error={errores.notas}
            />

            {avisoLargo && (
              <p
                role="alert"
                className="rounded-xl border border-acento/50 bg-acento/10 px-4 py-3 text-sm text-texto"
              >
                {avisoLargo}
              </p>
            )}
          </div>

          <footer className="border-t border-borde p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <div className="flex items-baseline justify-between">
              <span className="font-display uppercase tracking-wide text-texto-suave">
                Total
              </span>
              <span className="font-display text-3xl font-bold text-acento">
                {/*
                  Un total de ₡0 con tres litros dentro es peor que no mostrar
                  total: el comprador lee que no cuesta nada. Ver el comentario
                  de `Producto.precio`.
                */}
                {faltanPrecios ? "A confirmar" : formatoColones(total)}
              </span>
            </div>
            <p className="mt-1 text-xs text-texto-suave">
              El envío no está incluido: se coordina por WhatsApp.
            </p>

            <button
              type="submit"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-acento py-3.5 font-display font-semibold uppercase tracking-wide text-white transition-transform duration-200 hover:bg-acento-alt active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento-alt"
            >
              <IconoWhatsApp className="size-5" />
              Mandar el pedido
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

function Opcion({
  activo,
  onClick,
  children,
}: {
  activo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={`rounded-xl border px-3 py-3 text-sm font-medium transition-colors ${
        activo
          ? "border-acento bg-acento text-white"
          : "border-borde text-texto-suave hover:border-acento/50"
      }`}
    >
      {children}
    </button>
  );
}

function Campo({
  nombre,
  etiqueta,
  tipo = "text",
  marcador,
  error,
  required,
  autoComplete,
  valorInicial,
}: {
  nombre: string;
  etiqueta: string;
  tipo?: string;
  marcador?: string;
  error?: string;
  required?: boolean;
  autoComplete?: string;
  valorInicial?: string;
}) {
  const idError = `${nombre}-error`;
  return (
    <div>
      <label
        htmlFor={nombre}
        className="block font-display text-xs font-semibold uppercase tracking-[0.2em] text-acento"
      >
        {etiqueta}
      </label>
      {/*
        El valor guardado entra por `defaultValue` y no por `value`: el campo
        sigue siendo no controlado, y como el drawer se desmonta al cerrarse,
        al abrirlo de nuevo vuelve a tomar el dato recordado.
      */}
      <input
        id={nombre}
        name={nombre}
        type={tipo}
        placeholder={marcador}
        required={required}
        autoComplete={autoComplete}
        defaultValue={valorInicial}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? idError : undefined}
        className={`mt-2 w-full rounded-xl border bg-superficie px-4 py-3 text-texto placeholder:text-texto-suave/50 focus:outline-none ${
          error ? "border-acento" : "border-borde focus:border-acento/70"
        }`}
      />
      {error && (
        <p id={idError} className="mt-1.5 text-xs text-acento">
          {error}
        </p>
      )}
    </div>
  );
}
