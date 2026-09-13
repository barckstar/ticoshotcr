/**
 * ============================================================================
 * TICOSHOT — negocio REAL
 * ============================================================================
 * A diferencia de la plantilla de la que sale este sitio (brasa-y-humo, que es
 * una muestra de un restaurante inventado), TICOSHOT EXISTE. El telefono es
 * suyo, las redes son suyas y quien pulse el boton de WhatsApp le escribe a
 * el, no al estudio.
 *
 * De ahi salen las dos reglas de este archivo:
 *
 *   1. `modoMuestra` es FALSE. El boton manda pedidos de verdad.
 *
 *   2. NADA SE INVENTA. Lo que el cliente todavia no confirmo queda en `null`
 *      y el sitio se adapta: sin horario no se pinta horario, sin ficha de
 *      Google el mapa cae en una busqueda por nombre. Un dato de relleno se ve
 *      identico a uno real y nadie se acuerda despues de cual habia que
 *      cambiar. Ver PENDIENTE.md.
 * ============================================================================
 */

export const negocio = {
  nombre: "Ticoshot",
  tagline: "Litros de chiliguaro, miguelito y sangría. 100% artesanal.",

  /**
   * El nombre partido para el titular del hero. Donde cae el corte es decision
   * de diseno, por eso se guarda partido y no se calcula.
   */
  nombreHero: { linea1: "Tico", linea2: "shot" },

  /** Desde cuando. Sale de la etiqueta: "Hecho con amor desde el 2020". */
  desde: 2020,

  /** Confirmado: esta impreso en la etiqueta de las tres botellas. */
  whatsapp: "50689439595",
  whatsappVisible: "8943 9595",

  /**
   * FALSE: este es un cliente real. Con esto `construirMensaje` arma el pedido
   * completo —lineas, total, direccion y pin— en vez de un mensaje de contacto.
   *
   * Es una BANDERA y no codigo comentado: comentado se pudre y nadie sabe si
   * todavia compila. Asi las dos ramas se compilan y se prueban siempre.
   */
  modoMuestra: false,

  /** Solo se usa si `modoMuestra` se encendiera para ensenar el sitio. */
  mensajeContacto: "Hola, vi la página de Ticoshot y quiero hacer un pedido.",

  /*
    NO HAY LOCAL. Es un dato del negocio, no un hueco por llenar: venden por
    encargo y entregan. Por eso el JSON-LD usa `areaServed` en lugar de
    `address` y el sitio tiene una seccion de entrega en vez de un mapa.
    Inventar una direccion mandaria gente a la casa de alguien.
  */
  tieneLocal: false,
  ciudad: "San Ramón",
  provincia: "Alajuela",
  pais: "CR",

  /**
   * Donde se entrega SIN MAS TRAMITE, confirmado por el cliente.
   *
   * Es una lista y no un texto suelto porque la seccion de entrega la pinta
   * como puntos. Lo que NO esta aqui no se promete: fuera de esta zona se
   * coordina, que es distinto de "llegamos". Prometer "llegamos a todo
   * Alajuela" sin saberlo es la clase de promesa que termina con un cliente
   * esperando un pedido que no va a salir.
   */
  zonaEntrega: ["San Ramón de Alajuela"] as string[] | null,

  /**
   * `true` = fuera de la zona de arriba tambien se puede, coordinandolo.
   *
   * Confirmado por el cliente: las entregas son en San Ramon y el resto **se
   * organiza**. Separado de `zonaEntrega` a proposito, porque son dos cosas
   * distintas: una es cobertura y la otra es disposicion. Juntarlas obligaria
   * a escribir "San Ramon y donde se pueda" en la lista, que no es una zona.
   */
  entregaFueraDeZona: true,

  /* Redes REALES de Ticoshot, verificadas. */
  facebook: "https://www.facebook.com/ticoshotcr/",
  instagram: "https://www.instagram.com/ticoshotcr/",
  instagramHandle: "@ticoshotcr",
  /** Sin confirmar. Si existe, se agrega y aparece solo en la barra social. */
  tiktok: null as string | null,
  correo: null as string | null,

  /**
   * Sin ficha de Google confirmada. Con `cid` en null los enlaces de mapa caen
   * en una busqueda por nombre en vez de apuntar a la ficha de otro negocio.
   */
  google: {
    cid: null as string | null,
    calificacion: null as number | null,
    cantidadResenas: null as number | null,
  },

  /**
   * Sin horario publicado. Un negocio por encargo no atiende en mostrador, y
   * poner "Lunes a domingo 8am-10pm" inventado hace que alguien escriba a las
   * 9 de la noche esperando respuesta.
   */
  horarios: null,

  /*
    Los metodos de pago NO viven aqui: son el enum `metodosPago` de
    `features/checkout/schema.ts`, que es donde el formulario los valida.
    Tenerlos en los dos lados es tener dos fuentes de verdad para lo mismo, y
    la que no se usa se queda desactualizada sin que nadie lo note.
  */

  /** Edad minima legal para comprar licor en Costa Rica. */
  edadMinima: 18,

  /**
   * ¿EL SITIO YA ES PUBLICO? De esto depende que Google lo indexe.
   *
   * Hoy es `false`, y no es pereza: el sitio todavia dice "Consultar precio" en
   * los tres productos y la seccion de resenas lleva un aviso rojo que dice "no
   * publicar asi". Dejar que Google indexe eso es peor que no salir en Google:
   *
   *   - El fragmento que se ve en los resultados sale con esos marcadores, y lo
   *     lee gente que decide si comprar. Google no lo actualiza cuando se
   *     corrige; puede tardar semanas.
   *   - Si manana compran un dominio propio, el .vercel.app ya indexado compite
   *     con el nuevo como contenido duplicado y hay que montar redirecciones
   *     para arreglar algo que no tenia que haber pasado.
   *
   * Con `false`, el sitio manda `noindex` y el robots.txt bloquea a todos. Se
   * sigue pudiendo abrir y compartir por WhatsApp con normalidad — Open Graph
   * no depende de esto.
   *
   * SE PONE EN `true` cuando esten los precios y las resenas reales. Ver
   * PENDIENTE.md.
   */
  publicado: false,
} as const;

/** Construye el enlace de WhatsApp con un mensaje opcional ya codificado. */
export function enlaceWhatsApp(mensaje?: string): string {
  const base = `https://wa.me/${negocio.whatsapp}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}

/**
 * Enlace a la ubicacion en Google Maps.
 *
 * Sin `cid` cae en una busqueda por nombre y ciudad. Antes de este guardia se
 * interpolaba el campo a secas y con el valor en null salia `maps?cid=null`:
 * un enlace roto que nadie nota hasta hacer clic.
 */
export function enlaceMapa(): string {
  if (negocio.google.cid) {
    return `https://www.google.com/maps?cid=${negocio.google.cid}`;
  }
  const consulta = encodeURIComponent(`${negocio.nombre} ${negocio.ciudad}`);
  return `https://www.google.com/maps/search/?api=1&query=${consulta}`;
}

/**
 * El texto por defecto de TODOS los botones de WhatsApp del sitio.
 *
 * Centralizado a proposito: en la plantilla estaba escrito a mano en el
 * navbar, en ubicacion y en la barra lateral, asi que al cambiar el mensaje
 * habia que acordarse de tres sitios — y uno se quedo atras.
 */
export function mensajeConsulta(): string {
  return negocio.modoMuestra
    ? negocio.mensajeContacto
    : `Hola ${negocio.nombre}, tengo una consulta.`;
}
