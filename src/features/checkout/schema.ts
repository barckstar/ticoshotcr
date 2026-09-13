import { z } from "zod";

export const modalidades = ["retiro", "entrega"] as const;

/**
 * Como QUIERE pagar el cliente. El sitio NO procesa pagos: el dato viaja en el
 * mensaje para que quien prepara el pedido llegue listo con el vuelto o con el
 * numero de Sinpe.
 *
 * Sin tarjeta: es una operacion de encargo y entrega, no un mostrador con
 * datafono. Ofrecerla seria prometer algo que nadie puede cumplir en la puerta.
 */
export const metodosPago = ["sinpe", "efectivo"] as const;

export const etiquetaMetodoPago: Record<
  (typeof metodosPago)[number],
  string
> = {
  efectivo: "Efectivo",
  sinpe: "Sinpe Móvil",
};

export const datosPedidoSchema = z
  .object({
    nombre: z
      .string()
      .trim()
      .min(2, "Escribí tu nombre")
      .max(60, "Ese nombre es muy largo"),
    telefono: z
      .string()
      .trim()
      // Costa Rica: 8 digitos, con o sin guion o espacio.
      .regex(/^\d{4}[\s-]?\d{4}$/, "Teléfono de 8 dígitos, por ejemplo 8888-8888"),
    modalidad: z.enum(modalidades),
    metodoPago: z.enum(metodosPago),
    direccion: z.string().trim().max(200).optional(),
    /**
     * Coordenadas del punto de entrega, si el cliente uso el boton de
     * ubicacion. Salen de `navigator.geolocation`, que es gratis y no pide
     * llave. Viajan en el mensaje como enlace de Google Maps.
     */
    lat: z.number().optional(),
    lng: z.number().optional(),
    notas: z.string().trim().max(200).optional(),
  })
  .refine(
    (d) => d.modalidad !== "entrega" || (d.direccion?.length ?? 0) >= 6,
    {
      // Sin direccion nadie puede salir a entregar: obligatoria en entrega.
      message: "Para la entrega necesitamos la dirección",
      path: ["direccion"],
    },
  );

export type DatosPedido = z.infer<typeof datosPedidoSchema>;
