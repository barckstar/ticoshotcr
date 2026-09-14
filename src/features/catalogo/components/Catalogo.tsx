import Image from "next/image";
import { Seccion } from "@/shared/components/ui/Seccion";
import { Tarjeta } from "@/shared/components/ui/Tarjeta";
import { Botella } from "@/shared/components/ui/Botella";
import { IconoFrio } from "@/shared/components/ui/Iconos";
import { RevelarCascada, ItemCascada } from "@/shared/components/ui/Revelar";
import { formatoColones } from "@/shared/lib/formatoColones";
import { enlaceWhatsApp, negocio } from "@/shared/config/negocio";
import type { ColorProducto, Producto } from "@/shared/types/producto";
import { BotonAgregar } from "./BotonAgregar";

/**
 * El catalogo. Los tres litros.
 *
 * Es un componente de SERVIDOR: lo unico que se hidrata es el boton de
 * agregar. Recibe los productos por props desde `app/page.tsx` y no los
 * importa: la composicion entre features se hace en `app/`.
 */

/**
 * El color de etiqueta como clase de Tailwind.
 *
 * Se escriben las clases ENTERAS en un objeto en vez de interpolar
 * `bg-${color}`. Tailwind lee el codigo fuente como texto para saber que CSS
 * generar: una clase construida con una plantilla no aparece en ningun lado y
 * no se genera nunca. Sale sin fondo y sin ningun error que lo avise.
 */
const filete: Record<ColorProducto, string> = {
  chiliguaro: "bg-chiliguaro",
  miguelito: "bg-miguelito",
  sangria: "bg-sangria",
};

const puntoNota: Record<ColorProducto, string> = {
  chiliguaro: "bg-chiliguaro/70",
  miguelito: "bg-miguelito/70",
  sangria: "bg-sangria/70",
};

function Precio({ producto }: { producto: Producto }) {
  /*
    SIN PRECIO NO SE INVENTA UN NUMERO. El tipo obliga a pasar por aqui: el
    precio es `number | null` justo para que sea imposible publicar una cifra
    de relleno por descuido. Ver el comentario de `Producto.precio`.
  */
  if (producto.precio === null) {
    return (
      <a
        href={enlaceWhatsApp(
          `Hola ${negocio.nombre}, ¿cuánto vale el litro de ${producto.nombre}?`,
        )}
        target="_blank"
        rel="noopener noreferrer"
        className="font-display text-xl font-bold uppercase tracking-tight text-acento underline decoration-2 underline-offset-4 transition-colors hover:text-acento-alt"
      >
        Consultar precio
      </a>
    );
  }

  return (
    <p className="font-display text-3xl font-bold tracking-tight text-acento">
      {formatoColones(producto.precio)}
      <span className="ml-1.5 text-sm font-semibold text-texto-suave">
        / {producto.litros === 1 ? "litro" : `${producto.litros} L`}
      </span>
    </p>
  );
}

export function Catalogo({ productos }: { productos: Producto[] }) {
  return (
    <Seccion
      id="productos"
      antetitulo="El catálogo"
      titulo="Los tres que no te pueden faltar"
      decorado="catalogo"
      centrado
    >
      <RevelarCascada className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {productos.map((producto) => (
          <ItemCascada key={producto.id}>
            <Tarjeta className="flex h-full flex-col">
              {/* Filete del color de etiqueta. Es todo el uso que se le da
                  al color del producto: identifica, no decora la seccion. */}
              <div className={`h-1.5 w-full ${filete[producto.color]}`} />

              {producto.imagen ? (
                /*
                  La foto va A SANGRE, sin margen ni fondo debajo. El fondo
                  coral pintado a mano ES la foto: dejarle un marco alrededor
                  la convierte en un recorte pegado sobre una tarjeta, que es
                  justo lo contrario de lo que hacen en sus publicaciones.

                  `aspect-4/5` reserva el hueco ANTES de que la foto cargue.
                  Sin eso la tarjeta crece de golpe al llegar la imagen y eso
                  es CLS, que es una de las cuatro notas de Lighthouse.
                */
                <div className="relative aspect-4/5 w-full">
                  <Image
                    src={producto.imagen.vertical.src}
                    alt={producto.imagen.vertical.alt}
                    fill
                    /* Tres columnas en un contenedor de 1152px: ~365px cada
                       una. Sin `sizes`, next/image sirve la de 1080 a todo el
                       mundo, incluido un teléfono. */
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 365px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center bg-superficie-alt px-6 py-8">
                  <Botella
                    color={producto.color}
                    nombre={producto.nombre}
                    className="h-56 w-auto drop-shadow-lg"
                  />
                </div>
              )}

              <div className="flex flex-1 flex-col p-7">
                <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-texto">
                  {producto.nombre}
                </h3>
                <p className="mt-1.5 text-sm font-medium text-texto-suave">
                  {producto.resumen}
                </p>

                {/*
                  El aviso de conservacion va AQUI ARRIBA, pegado al nombre, y
                  no al final de la tarjeta ni en las preguntas frecuentes.
                  Quien compra un Miguelito tiene que saber que necesita frio
                  ANTES de dejarlo en el carro al sol, no despues.
                */}
                {producto.advertencia && (
                  <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-acento/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-acento">
                    <IconoFrio className="size-3.5" />
                    {producto.advertencia}
                  </p>
                )}

                <p className="mt-4 text-sm leading-relaxed text-texto">
                  {producto.descripcion}
                </p>

                <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
                  {producto.notas.map((nota) => (
                    <li
                      key={nota}
                      className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-texto-suave"
                    >
                      <span
                        aria-hidden="true"
                        className={`size-1.5 rounded-full ${puntoNota[producto.color]}`}
                      />
                      {nota}
                    </li>
                  ))}
                </ul>

                {/* `mt-auto` pega el precio y el boton al fondo: con
                    descripciones de distinto largo, si no, cada tarjeta pone
                    su boton a una altura distinta. */}
                <div className="mt-auto pt-7">
                  <Precio producto={producto} />
                  <BotonAgregar producto={producto} className="mt-4 w-full" />
                </div>
              </div>
            </Tarjeta>
          </ItemCascada>
        ))}
      </RevelarCascada>
    </Seccion>
  );
}
