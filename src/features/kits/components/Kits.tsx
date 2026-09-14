import Image from "next/image";
import { Seccion } from "@/shared/components/ui/Seccion";
import { Tarjeta } from "@/shared/components/ui/Tarjeta";
import { Botella } from "@/shared/components/ui/Botella";
import { IconoFrio } from "@/shared/components/ui/Iconos";
import { RevelarCascada, ItemCascada } from "@/shared/components/ui/Revelar";
import type { Producto } from "@/shared/types/producto";
import type { Kit } from "../lib/kits";
import { BotonAgregarKit } from "./BotonAgregarKit";

/**
 * "Armá tu hielera". Combinaciones de litros, en un toque.
 *
 * La idea sale de su propio Instagram: tienen un carrusel titulado "Kit de
 * imperdibles para la playa". Ya lo venden asi; el sitio solo lo pone donde se
 * puede comprar.
 *
 * Recibe los productos YA RESUELTOS desde `app/page.tsx`. El kit guarda ids;
 * convertirlos en productos es composicion entre dos features y eso se hace
 * en `app/`, no aqui.
 */
export function Kits({
  kits,
  productosDeKit,
}: {
  kits: Kit[];
  /** id de kit -> los productos que lo componen, en orden. */
  productosDeKit: Record<string, Producto[]>;
}) {
  return (
    <Seccion
      id="kits"
      antetitulo="Combos"
      titulo="Armá tu hielera"
      decorado="kits"
      centrado
      className="bg-superficie-alt"
    >
      <RevelarCascada className="grid gap-7 lg:grid-cols-3">
        {kits.map((kit) => {
          const incluye = productosDeKit[kit.id] ?? [];

          return (
            <ItemCascada key={kit.id}>
              <Tarjeta className="flex h-full flex-col">
                {/*
                  Las fotos del kit, en RECORTE CUADRADO y en fila.

                  Cuadradas y no verticales: la etiqueta queda entera en cada
                  una, y tres fotos 4:5 una al lado de otra harian una tarjeta
                  altisima. Antes eran botellas dibujadas superpuestas; con
                  fotos reales la superposicion tapa justo las etiquetas, que
                  es lo unico que distingue un kit de otro.
                */}
                <div className="flex gap-1.5 bg-crema p-1.5">
                  {incluye.map((p) => (
                    <div
                      key={p.id}
                      className="relative aspect-square flex-1 overflow-hidden rounded-2xl"
                    >
                      {p.imagen ? (
                        <Image
                          src={p.imagen.cuadrada.src}
                          alt={p.imagen.cuadrada.alt}
                          fill
                          /* Dos o tres por tarjeta, en una columna de ~365px:
                             nunca pasa de ~180px de ancho. */
                          sizes="(max-width: 1024px) 33vw, 180px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="grid size-full place-items-center bg-superficie-alt">
                          <Botella
                            color={p.color}
                            nombre={p.nombre}
                            className="h-4/5 w-auto"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex flex-1 flex-col p-7">
                  <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-texto">
                    {kit.nombre}
                  </h3>
                  <p className="mt-1.5 text-sm font-semibold text-acento">
                    {kit.gancho}
                  </p>

                  <p className="mt-4 text-sm leading-relaxed text-texto">
                    {kit.descripcion}
                  </p>

                  <dl className="mt-5 space-y-1.5 text-sm">
                    <div className="flex gap-2">
                      <dt className="font-semibold text-texto-suave">Lleva:</dt>
                      <dd className="text-texto">
                        {incluye.map((p) => p.nombre).join(" · ")}
                      </dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="font-semibold text-texto-suave">Alcanza:</dt>
                      {/*
                        "Alcanza para" y no "es para": es una estimacion nuestra
                        sobre cuanta gente cubre, no una promesa del cliente.
                      */}
                      <dd className="text-texto">{kit.para}</dd>
                    </div>
                  </dl>

                  {/* Si alguno de los litros del kit necesita frio, se dice
                      en el kit tambien: quien compra el combo no abre las tres
                      fichas de producto para enterarse. */}
                  {incluye.some((p) => p.advertencia) && (
                    <p className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-acento/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-acento">
                      <IconoFrio className="size-3.5" />
                      {incluye.find((p) => p.advertencia)?.advertencia}
                    </p>
                  )}

                  <div className="mt-auto pt-7">
                    <BotonAgregarKit
                      productos={incluye}
                      nombreKit={kit.nombre}
                      className="w-full"
                    />
                  </div>
                </div>
              </Tarjeta>
            </ItemCascada>
          );
        })}
      </RevelarCascada>
    </Seccion>
  );
}
