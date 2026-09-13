# Ticoshot — diseño del sitio

**Fecha:** 2026-09-12
**Estado:** aprobado por el usuario, pendiente de datos del cliente
**Base:** `D:\brasa-y-humo` (plantilla propia, ya probada)

---

## 1. Qué es

Sitio de **Ticoshot**, marca artesanal de licores de San Ramón de Alajuela, Costa
Rica. Vende **litros** de tres productos: Chiliguaro, Miguelito y Sangría.

**Este negocio SÍ existe.** No es una muestra. Teléfono real **8943 9595**,
Instagram real [@ticoshotcr](https://www.instagram.com/ticoshotcr/), Facebook real
[/ticoshotcr](https://www.facebook.com/ticoshotcr/). En consecuencia
`negocio.modoMuestra = false`: el botón de WhatsApp manda **pedidos de verdad**,
no un mensaje de contacto comercial.

De eso se desprende la regla de integridad de contenido de este repo:

> **Nada de este sitio se inventa como si fuera real.** Reseñas, precios,
> horarios y zona de entrega son datos del cliente. Lo que todavía no tenemos va
> marcado como marcador de posición visible, nunca disfrazado de dato.

### Lo que sabemos del negocio

| Dato | Valor | Fuente |
|---|---|---|
| Productos | Chiliguaro, Miguelito, Sangría — en litro | Bio de Instagram |
| Origen | San Ramón de Alajuela | Bio de Instagram |
| Desde | 2020 | Etiqueta: "Hecho con amor desde el 2020" |
| Teléfono | 8943 9595 | Etiqueta y el usuario |
| Local físico | **No tiene** | El usuario |
| Seguidores IG | ~189 | Instagram |

Contexto de producto (para redactar la sección *Cómo se toma* con criterio):
el **chiliguaro** es guaro con salsa picante, tomate, limón y sal; el
**miguelito** es guaro con agua de coco y leche condensada, típico de bares de
playa.

### Lo que falta y bloquea

Sin estos datos el carrito no puede publicarse. El sitio se construye con
marcadores de posición señalados en `PENDIENTE.md`.

1. Precio de cada litro. ¿Existe medio litro?
2. ¿Descuento por kit de 3? ¿Cuánto?
3. Zona de entrega real (¿San Ramón solo? ¿Palmares, Naranjo, Grecia? ¿playa?)
4. Métodos de pago y número de Sinpe Móvil
5. Eventos: ¿servicio actual o nuevo? ¿cobro por persona o por litro?
6. Fotos y videos **originales** (no rebajados de Instagram)
7. ¿Tiene ficha de Google Business? Define reseñas reales y mapa
8. ¿Correo? ¿TikTok?
9. La historia real de 2020
10. ¿Tiene patente de licores? Define qué puede prometer el sitio

---

## 2. Stack

Idéntico a `brasa-y-humo`, que ya está probado en producción:

- **Next.js 16 (App Router) + React 19**
- **TypeScript estricto** — sin `.jsx`, sin `any`
- **Tailwind CSS v4**, configuración CSS-first con `@theme` en `globals.css`
- **Turbopack**
- **Animación en CSS puro.** Transiciones, `@keyframes` y `animation-timeline`.
  El revelado al hacer scroll lo dispara **un solo** `IntersectionObserver`
  montado una vez en el layout. **Sin librería de animación.**
- **Zod** para validar datos y formularios
- **`schema-dts`** para tipar el JSON-LD
- **Vitest** para las pruebas de lógica
- Deploy en **Vercel**

---

## 3. Navegación — una sola página

```
/          Todo el sitio, en secciones ancladas.
```

El carrito, el checkout y el cotizador de eventos son **drawers**, nunca
páginas. La galería de reels es un lightbox.

### El costo de la SPA y cómo se paga

Una sola ruta carga todo su JavaScript de una vez. Mitigación, en orden de
importancia:

1. **Solo tres islas de cliente:** tienda, carrito/checkout y cotizador. Todo lo
   demás son componentes de servidor y no llegan al navegador.
2. **La banda de reels entra por `next/dynamic`** y solo cuando se acerca a la
   pantalla. El video no pesa sobre el pliegue.
3. **El hero no tiene JavaScript.** Ver sección 5.

---

## 4. Las secciones

Historia, trayectoria y quiénes somos —tres pedidos del usuario— **se funden en
una sola sección**. Son la misma información contada tres veces y en una página
única se leerían como repetición. La trayectoria vive dentro como línea de
tiempo.

| # | Sección | Qué hace | Feature |
|---|---|---|---|
| 1 | **Hero** | Olas animadas, card con logo y "Ordenar", banda de botellas | `hero` |
| 2 | **Los tres** | Chiliguaro, Miguelito, Sangría. Precio y agregar | `catalogo` |
| 3 | **Armá tu hielera** | Combos de 3 litros con precio de kit | `kits` |
| 4 | **Cómo se toma** | El ritual de servicio de cada uno | `ritual` |
| 5 | **Quiénes somos** | Texto, foto y línea de tiempo desde 2020 | `historia` |
| 6 | **Eventos y catering** | Cotizador: personas → litros → WhatsApp | `eventos` |
| 7 | **Reseñas** | Comentarios reales transcritos de sus redes | `resenas` |
| 8 | **No tenemos local** | Zona de entrega en lugar de mapa | `entrega` |
| 9 | **Preguntas** | ¿Se refrigera? ¿Cuánto dura? ¿Llegan a la playa? | `faq` |
| — | **Pie** | Redes, teléfono, consumo responsable | `shared` |

Transversales, heredados de la base: **barra lateral de redes**
(`BarraSocial.tsx`) y **navbar que se esconde al bajar** (`useNavbarOculto.ts`).

### Por qué eventos no va por el carrito

Un carrito para "3 litros de sangría" y un carrito para "una boda de 120
personas" son dos problemas distintos. El segundo es una **cotización**: no hay
precio cerrado hasta saber cuánta gente, qué fecha y dónde. Por eso van dos
flujos separados que terminan los dos en WhatsApp:

- **Carrito** → `construirMensajePedido()` → lista, total, dirección, pin
- **Cotizador** → `construirMensajeEvento()` → personas, fecha, litros sugeridos

---

## 5. El hero

El único bloque sobre el pliegue. **Cero JavaScript, cero video.** De la base:
*"sobre el pliegue no se usa el observador; el hero usa `@keyframes`"* — ese
`"use client"` de más costó 4,4 s de render delay en `brasa-y-humo`.

| Capa | Técnica |
|---|---|
| Fondo | Degradado coral/atardecer en capas de `radial-gradient`. **Es el LCP**: pinta antes de que exista JavaScript |
| Olas | Tres `<svg>` con su `path` duplicado y `animation: deriva 18s / 26s / 40s linear infinite` sobre `translateX(-50%)` → bucle sin costura. Velocidades distintas = parallax |
| Garabatos | Los trazos azules de crayón y las estrellitas amarillas de sus posts, SVG decorativos con `animation-delay` escalonado |
| Card | Logo, botón "Ordenar" y `8943 9595`. Entra con `@keyframes` inmediata. Al bajar se desplaza con `animation-timeline: scroll(root)` |
| Banda de botellas | Marquee izquierda→derecha, `transform` puro |

### Reglas duras del hero

- **`prefers-reduced-motion: reduce` detiene todo** con `animation-play-state:
  paused`. No es un adorno: el movimiento continuo marea a gente real.
- **`@supports not (animation-timeline: scroll())`** → las animaciones corren en
  bucle normal. Firefox no ve la reacción al scroll pero **nunca ve una página
  quieta**. El fallback no puede ser "no se mueve nada".
- **Solo se anima `transform` y `opacity`.** Nada que dispare layout o paint.
- **Los SVG de las olas van en línea, no como `<img>`.** Un `<img>` es otra
  petición de red compitiendo con el LCP.

---

## 6. Paleta — reparto 70/30/10

Dirección elegida: **fiesta playera premium**. Lo premium lo da el oficio
—tipografía, olas, micro-interacciones—, no la oscuridad. Un fondo negro de
licorería fina se pelearía con la identidad coral que su gente ya conoce en
Instagram y con las botellas PET de litro.

| Franja | Uso | Color |
|---|---|---|
| 70% | Fondos | Crema `#FFF4EC` + degradado coral `#FF8A5B → #FFB07C` |
| 30% | Tarjetas y superficies | Blanco `#FFFFFF`, arena `#FBE7DA` |
| 10% | CTAs, precios, badges, estado activo | Rojo del logo `#D32027` |

Texto principal: marrón cálido `#2A1410`.

### Los colores de producto no son colores de sección

El menta del Miguelito (`#7FD4C1`) y el vino de la Sangría (`#6E1B3E`) entran
**solo como identificador de producto** —filete de tarjeta, badge, punto— nunca
como fondo de sección. Así los tres colores de etiqueta se usan sin romper el
reparto 70/30/10.

### El contraste se mide, no se estima

**En sus posts el texto es blanco sobre coral, y eso mide ~2,5:1.** WCAG AA
exige 4,5:1 para texto normal y el objetivo del proyecto es Lighthouse > 95 en
accesibilidad. Por lo tanto:

- Los títulos del hero van en **marrón oscuro `#2A1410` sobre el coral**
- El **blanco solo se usa sobre el rojo del logo** `#D32027`
- El menta y el vino son **decorativos**: nunca llevan texto encima

**Esto hace que el sitio no se vea idéntico a su Instagram.** Es consciente y es
la única forma de tener las dos cosas a la vez. Cualquier contraste nuevo se
mide antes de darlo por bueno.

---

## 7. Arquitectura — Feature-Based

```
src/
  app/            # rutas y COMPOSICIÓN entre features
  features/       # <feature>/{components,data,lib}
  shared/         # components, lib, types, data, config
```

**Regla dura: una feature nunca importa de otra, y `shared/` nunca importa una
feature.** Cuando dos features necesitan lo mismo, sube a `shared/`. Cuando hay
que unirlas, la composición se hace en `app/page.tsx` y los componentes
**reciben** sus datos por props.

Por eso los productos viven en `shared/`: los necesitan `catalogo`, `kits`,
`hero` y `carrito` — cuatro features. Ponerlos en `features/catalogo/data/`
obligaría a las otras tres a importar de una feature ajena.

Verificación, que debe dar cero:

```bash
grep -rn "@/features/" src/features/ | grep -vE "src/features/([a-z]+)/.*@/features//"
grep -rn "@/features/" src/shared/
```

### Qué se hereda de `brasa-y-humo`

| Pieza | Archivo | Cambio |
|---|---|---|
| Carrito | `features/carrito/` | `plato` → `producto` |
| Checkout y WhatsApp | `features/checkout/` | `modoMuestra: false`, mensaje de evento nuevo |
| Barra lateral de redes | `shared/components/layout/BarraSocial.tsx` | Redes de Ticoshot |
| Navbar que se esconde | `shared/lib/useNavbarOculto.ts` | Sin cambio |
| Revelado al scroll | `shared/components/ui/ObservadorRevelado.tsx` | Sin cambio |
| Curva inferior de sección | `shared/components/ui/CurvaInferior.tsx` | Reperfilada a ola |
| Formato de colones | `shared/lib/formatoColones.ts` | Sin cambio |
| Almacén local | `shared/lib/almacenLocal.ts` | Sin cambio |

---

## 8. Datos en JSON validado

**Regla dura heredada.** Toda LISTA de contenido vive en un `.json`. El único
TypeScript que queda es el esquema de Zod que la valida.

| Archivo | Contenido |
|---|---|
| `shared/data/productos.json` | Los tres litros: nombre, precio, color, foto |
| `features/kits/data/kits.json` | Combos |
| `features/historia/data/hitos.json` | Línea de tiempo desde 2020 |
| `features/ritual/data/rituales.json` | Cómo se toma cada uno |
| `features/resenas/data/resenas.json` | Comentarios transcritos |
| `features/faq/data/preguntas.json` | Preguntas frecuentes |
| `shared/config/negocio.ts` | **Único TS con datos**, con sus explicaciones |

`parse` corre **al importar el módulo**, o sea durante `next build`: un precio
escrito como texto, un id repetido o un color mal puesto **rompen el build**,
que es donde uno quiere enterarse — no con el catálogo en blanco en un teléfono.

---

## 9. Carrito y checkout

Reuso directo de la base. `construirMensajePedido()` ya tiene siete pruebas y el
tope de **1500 caracteres** codificados, porque **WhatsApp en iOS trunca en
silencio**: el pedido llega incompleto y nadie se entera.

### Flujo de entrega

El checkout pregunta **retiro o entrega**. Si es entrega pide nombre, teléfono,
dirección escrita, y ofrece **"usar mi ubicación"**, que mete un enlace de Google
Maps con las coordenadas en el mensaje — el repartidor lo toca y le abre la ruta.
Sale de `navigator.geolocation`, que es del navegador y no pide llave de API.

**El costo del envío se coordina en el chat**, no lo calcula el sitio. Una
operación de tres productos no necesita una tabla de zonas que solo el
programador puede editar.

---

## 10. Legal

Vender licor no es vender hamburguesas.

- **Puerta de edad al entrar.** Modal de "¿18 o más?" con la respuesta guardada
  en `localStorage`. Se pinta con CSS, no espera JavaScript, y **no bloquea el
  LCP**. Sin JavaScript funciona igual con el patrón `:target` de CSS.
- **Aviso de consumo responsable** en el pie.
- **JSON-LD** con los productos marcados como bebida alcohólica.
- **`LocalBusiness` con `areaServed` en vez de `address`**, porque no hay local.
  Inventar una dirección mandaría gente a la casa de alguien.
- **Sin ficha de Google confirmada**, los enlaces de mapa caen en una búsqueda
  por nombre. Nunca se interpola un `cid` nulo.

---

## 11. Integridad del contenido

El usuario pidió reseñas *"así sean inventadas"*. Se discutió y se descartó:

**Ticoshot existe y sus reseñas las van a leer clientes decidiendo si compran.**
Un testimonio inventado con nombre verosímil ahí no es relleno de diseño, es
publicidad engañosa — lo que persigue la Ley 7472 del consumidor en Costa Rica —
y el riesgo lo corre la marca del cliente, no el estudio.

La decisión, que el usuario aprobó:

1. **Transcribir literales los comentarios reales** de sus posts públicos de
   Facebook e Instagram, firmados con nombre de pila y la plataforma
   ("Comentario en Instagram"). Es prueba social verdadera, es suya y no cuesta
   nada.
2. Lo que no alcance queda como **"Cliente de muestra"**, visible como marcador
   de posición, para que se note cuál falta reemplazar antes de publicar.

> **Pendiente:** la cosecha de comentarios no se pudo hacer. Facebook bloquea el
> fetch y el navegador del entorno devolvió *"policy check temporarily
> unavailable"*. Queda como tarea; no bloquea la construcción.

---

## 12. Rendimiento — objetivo Lighthouse > 95 en las cuatro

Se construye desde el inicio, no se parchea al final. Se audita sobre el build
de producción, **nunca sobre el dev server**.

- Cero librerías de animación
- Cero video sobre el pliegue
- `next/image` con `sizes` en toda foto
- `next/font` con `display: swap`
- Solo se anima `transform` y `opacity`
- Un solo `IntersectionObserver` en todo el sitio
- La banda de reels por `next/dynamic`
- Contraste medido, no estimado

### Reglas heredadas que costaron caro

- **Nada de `"use client"` en `Revelar.tsx`.** Lo usan las secciones de
  servidor: ese `"use client"` arrastra la página entera a la hidratación.
- **El estado oculto va en `@media (scripting: enabled)`.** Sin JavaScript el
  contenido se ve, quieto. Nunca una página en blanco esperando un observador.
- **`threshold: 0`, nunca una fracción.** Un bloque más alto que la pantalla
  nunca cumple el 20%.
- **Nada de leer `localStorage` con `typeof window` durante el render.** Durante
  la hidratación el cliente ya tiene `window`, así que no distingue nada y
  servidor y cliente pintan distinto. Se usa `useSyncExternalStore` **y su valor
  de retorno**.

---

## 13. Pruebas

Vitest sobre la lógica pura, que es donde un error es caro y silencioso.

| Qué | Por qué |
|---|---|
| `construirMensajePedido` | Heredada. Un pedido truncado no avisa |
| `construirMensajeEvento` | Nueva. Mismo riesgo de truncado |
| `litrosParaPersonas` | Nueva. El cotizador da un número que el cliente usa para comprar |
| `carrito` | Heredada |
| `formatoColones` | Heredada |

Los esquemas de Zod no llevan prueba: **su prueba es el `next build`**, que
falla si un JSON no cumple.

---

## 14. Fuera de alcance

- Pasarela de pago. El sitio **no cobra**; el cobro lo coordina el dueño por
  WhatsApp.
- Panel de administración. Los datos se editan en los JSON.
- Inventario en vivo.
- Bilingüe ES/EN. Se evalúa después; el público es tico.
- Envío fuera de la zona de entrega.

---

## 15. Riesgos conocidos

| Riesgo | Mitigación |
|---|---|
| No hay precios todavía | Marcadores de posición señalados en `PENDIENTE.md`. El sitio no se publica con ellos |
| `animation-timeline` aún no está en todos lados | `@supports`, con animaciones en bucle como respaldo |
| Las fotos vienen de Instagram, recomprimidas | Pedidos los originales. Mientras, se usan las de las redes y queda anotado |
| Una SPA con nueve secciones carga mucho JS | Tres islas de cliente; el resto, servidor |
| El coral brillante no da contraste AA con blanco | Texto marrón oscuro sobre coral. Documentado en la sección 6 |
| Vender licor sin patente confirmada | Preguntar antes de publicar promesas de entrega |
