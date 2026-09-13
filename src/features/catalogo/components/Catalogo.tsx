import { Seccion } from "@/shared/components/ui/Seccion";
import { Tarjeta } from "@/shared/components/ui/Tarjeta";
import { Botella } from "@/shared/components/ui/Botella";
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
      centrado
    >
      <RevelarCascada className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {productos.map((producto) => (
          <ItemCascada key={producto.id}>
            <Tarjeta className="flex h-full flex-col">
              {/* Filete del color de etiqueta. Es todo el uso que se le da
                  al color del producto: identifica, no decora la seccion. */}
              <div className={`h-1.5 w-full ${filete[producto.color]}`} />

              <div className="flex items-center justify-center bg-superficie-alt px-6 py-8">
                {producto.imagen ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={producto.imagen.src}
                    alt={producto.imagen.alt}
                    width={producto.imagen.ancho}
                    height={producto.imagen.alto}
                    loading="lazy"
                    className="h-56 w-auto drop-shadow-lg"
                  />
                ) : (
                  <Botella
                    color={producto.color}
                    nombre={producto.nombre}
                    className="h-56 w-auto drop-shadow-lg"
                  />
                )}
              </div>

              <div className="flex flex-1 flex-col p-7">
                <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-texto">
                  {producto.nombre}
                </h3>
                <p className="mt-1.5 text-sm font-medium text-texto-suave">
                  {producto.resumen}
                </p>

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
