# PENDIENTE — lo que falta antes de publicar

> **Este sitio NO se puede publicar todavía.** No por fallos: porque le faltan
> datos del cliente, y el sitio está construido para que eso se note en vez de
> taparse con relleno.

---

## 1. Bloqueante — sin esto el carrito no sirve

### Precios

`src/shared/data/productos.json` tiene `"precio": null` en los tres.

Mientras esté en `null`, y esto es a propósito:

- la tarjeta dice **"Consultar precio"** y enlaza a WhatsApp,
- el carrito no suma un total: dice **"A confirmar"**,
- el mensaje de WhatsApp sale con **"*TOTAL: a confirmar*"**,
- la pastilla del precio del botón flotante **desaparece**,
- el JSON-LD del producto **omite `offers`** (poner `price: 0` le declara a
  Google que el producto es gratis).

No se pusieron precios de relleno porque un precio inventado se ve exactamente
igual que uno real: nadie nota que hay que cambiarlo, y el día que se publique
el cliente estaría vendiendo a un precio que no es suyo. El tipo es
`number | null` justo para que sea imposible publicar una cifra falsa por
descuido.

**Qué preguntar:**

- [ ] ¿Cuánto vale el litro de Chiliguaro?
- [ ] ¿Cuánto vale el litro de Miguelito?
- [ ] ¿Cuánto vale el litro de Sangría?
- [ ] ¿Existe medio litro u otra presentación?
- [ ] ¿Hay descuento por combo de 3? ¿Cuánto?

Al llenarlos, `hayPrecios` en `src/shared/data/productos.ts` pasa a `true` solo
si los tres tienen precio — es un cálculo, no una bandera a mano, para que no
se quede a medias.

---

## 2. Bloqueante — contenido que no nos toca inventar

### Reseñas

`src/features/resenas/data/resenas.json` son **tres marcadores** con
`"fuente": "pendiente"`. La sección pinta un aviso rojo que dice *"Sección
pendiente — no publicar así"*, y se ve así a propósito.

Ticoshot existe y sus reseñas las van a leer clientes decidiendo si compran. Un
testimonio inventado con nombre verosímil ahí es publicidad engañosa —Ley 7472
del consumidor— y quien responde es la marca del cliente.

**De dónde salen las reales, que ya existen y son gratis:**

- [ ] Comentarios de sus posts de [Instagram](https://www.instagram.com/ticoshotcr/)
      y [Facebook](https://www.facebook.com/ticoshotcr/), transcritos **literales**,
      con nombre de pila. Poner `"fuente": "instagram"` o `"facebook"`.
- [ ] Capturas de WhatsApp de clientes, con el nombre recortado.
      `"fuente": "whatsapp"`.

> Se intentó cosecharlos automáticamente y no se pudo: Facebook bloquea el
> `fetch` y el navegador del entorno devolvió *"policy check temporarily
> unavailable"*. Queda por hacer a mano.

### Historia

`src/features/historia/data/hitos.json` tiene dos hitos con
`"confirmado": false`. Se pintan atenuados y con la etiqueta **"Por confirmar
con el cliente"** a la vista.

- [ ] ¿Cómo arrancó en 2020? La historia de verdad.
- [ ] ¿Cuándo se sumaron el Miguelito y la Sangría, y por qué esos dos?
- [ ] ¿Cuál fue el primer evento grande?

---

## 3. Datos del negocio — `src/shared/config/negocio.ts`

Todo lo que está en `null` ahí es un dato que no tenemos, no un descuido.

- [ ] **`zonaEntrega`** — hoy `null`, y por eso la sección de entrega dice que
      se coordina por WhatsApp en vez de listar cantones. ¿Hasta dónde llegan?
      ¿San Ramón solo? ¿Palmares, Naranjo, Grecia? ¿Van a playa?
- [ ] **`metodosPago`** — el checkout ofrece **Sinpe Móvil** y **Efectivo**. Sin
      tarjeta, por ser operación de encargo y entrega. ¿Es correcto? ¿A qué
      número es el Sinpe?
- [ ] **`google.cid`** — ¿tiene ficha de Google Business? Sin ella los enlaces de
      mapa caen en una búsqueda por nombre, que es lo correcto pero no lo ideal.
- [ ] **`tiktok`** y **`correo`** — si existen, aparecen solos en la barra social
      y el pie.
- [ ] **`horarios`** — hoy `null` y el sitio no promete horario. ¿Hay uno?
- [ ] **Patente de licores** — define qué puede prometer el sitio sobre venta y
      entrega.

---

## 4. Medios

- [ ] **Fotos originales** de las tres botellas, sin bajar de Instagram (ahí
      vienen recomprimidas y ya recortadas a 4:5).

  Mientras no lleguen, `Producto.imagen` es `null` y el sitio dibuja la botella
  en SVG (`src/shared/components/ui/Botella.tsx`). **No es un hueco**: se ve
  bien y es lo que corresponde mientras no haya material propio.

- [ ] **Videos originales** de sus reels, para la banda de video que va debajo
      del hero (todavía no construida — ver §6).

- [ ] **Logo vectorial del cliente.** El de
      `src/shared/components/ui/Logo.tsx` es una **interpretación** dibujada a
      mano en SVG, no el archivo original. Cuando llegue el suyo se reemplazan
      los paths y nada más.

- [ ] **Imagen Open Graph** (1200×630) para las vistas previas de WhatsApp y
      Facebook. Hoy no hay: el enlace compartido sale sin imagen.

- [ ] **Favicon e iconos** de la app. Hoy no hay.

---

## 5. Despliegue

- [ ] **`NEXT_PUBLIC_SITIO_URL`** en Vercel, con el dominio real. Sin ella cae
      en `https://ticoshot.vercel.app`, que sirve para la muestra pero deja el
      sitemap, el JSON-LD y los enlaces de compartir apuntando al lugar
      equivocado.
- [ ] Auditar **Lighthouse sobre el build de producción**, nunca sobre el dev
      server. Objetivo: >95 en las cuatro categorías.

---

## 6. Construido a medias a propósito

- [ ] **Banda de reels bajo el hero.** El diseño la contempla: video cargado
      perezosamente con `next/dynamic`, fuera del pliegue. No se construyó
      porque no hay material. El hero sigue sin video a propósito — es lo que
      permite que el LCP sea un degradado.

---

## 7. Decisiones que conviene revisar con el cliente

- El sitio **no se ve idéntico a su Instagram**, y es a propósito: ahí el texto
  es blanco sobre coral y eso mide 2,32:1 cuando WCAG AA exige 4,5:1. Aquí los
  titulares van en marrón oscuro sobre el coral. Está medido y documentado en
  `src/app/globals.css`.
- **Historia, trayectoria y quiénes somos se fundieron en una sección** con
  línea de tiempo. Eran la misma información tres veces.
- **Eventos no pasa por el carrito.** Una boda de 120 personas es una
  cotización, no una compra con precio cerrado.
