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

- [x] ~~**`zonaEntrega`**~~ — **confirmado:** las entregas se hacen en
      **San Ramón de Alajuela**, y fuera de ahí **se organiza**. Son dos campos
      distintos, `zonaEntrega` y `entregaFueraDeZona`, porque cobertura y
      disposición no son lo mismo.
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

### Los shots por persona del cotizador

`src/features/eventos/lib/cotizador.ts` asume **2 / 4 / 7 shots por persona**
según el ambiente de la fiesta. **Esos tres números los puso el programador, no
el cliente**, y el cliente es bartender con más de cinco años de barra: sabe
cuánto toma la gente de verdad y estos deberían ser suyos.

El supuesto **se muestra en pantalla** —cada opción dice a cuántos shots
equivale y la tarjeta del resultado escribe la cuenta completa— justo para que
se pueda discutir en vez de creerle a ciegas.

- [ ] ¿Cuántos shots por persona, en una fiesta tranquila, una normal y una
      grande? Cambiarlo es editar una tabla de tres líneas.

---

## 4. Medios

- [x] ~~**Fotos de las tres botellas**~~ — **puestas.** Son las de sus
      publicaciones: la del Chiliguaro, la del Miguelito, la de la Sangría y la
      de los tres juntos. Los originales viven en `research/assets/` (no se
      versionan) y `scripts/optimizar-fotos.py` produce lo que sirve el sitio.

  Siguen siendo **las de Instagram**, o sea ya recomprimidas por ellos. Si el
  cliente tiene los archivos de cámara, se reemplazan en `research/assets/`, se
  corre el script otra vez y sale igual — por eso la receta está escrita.

  El dibujo SVG (`Botella.tsx`) no se borró: es el respaldo para cualquier
  sabor nuevo que todavía no tenga foto.

- [x] ~~**Video del hero**~~ — **puesto.** Generado con Google Flow siguiendo
      `docs/prompt-video-hero.md`: las tres botellas pasando una por una y
      cerrando con las tres juntas. 8 s, sin audio, **267 KB**.

- [ ] **La versión 16:9 del video — esto sí hace falta.** El que hay es **9:16
      (vertical)**: perfecto en teléfono, pero en escritorio el recorte a
      `cover` deja ver como un tercio de la altura, o sea el cuerpo de la
      botella ampliado y no la composición. Es el mismo prompt cambiando una
      línea — `docs/prompt-video-hero.md` §4. Al llegar, se deja en
      `research/assets/hero.mp4` y se corre `scripts/optimizar-fotos.py`.

- [ ] **Logo vectorial del cliente.** El de
      `src/shared/components/ui/Logo.tsx` es una **interpretación** dibujada a
      mano en SVG, no el archivo original. Cuando llegue el suyo se reemplazan
      los paths y nada más.

- [x] ~~**Imagen Open Graph**~~ — **hecha.** `public/marca/og.jpg`, 1200×630,
      compuesta desde la foto de los tres recortando una franja horizontal
      centrada en las etiquetas.

- [x] ~~**Favicon e iconos**~~ — **hechos**, a partir del logo real:
      `icon.png` (32), `icon-192.png`, `icon-512.png` y `apple-icon.png` (180).

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

- [ ] **Medir Lighthouse con la secuencia puesta.** El hero lleva 64 fotogramas
      = **872 KB** sobre el pliegue. Está montado para que NO sea el LCP —un
      `<canvas>` no es candidato, y detrás hay un degradado que se pinta desde
      el HTML— pero eso es un razonamiento, y un razonamiento no es una
      medición. **Auditar sobre el build de producción antes de publicar.**

      Si el rendimiento cae por debajo de 95, en orden de menor a mayor
      sacrificio: bajar a 48 fotogramas (−244 KB, el scrub va a saltos),
      reducir el ancho a 480 px, o sacar la secuencia del hero y dejarla en una
      sección más abajo.

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
