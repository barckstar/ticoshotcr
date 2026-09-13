# CLAUDE.md — Ticoshot

Sitio de **Ticoshot**, licores artesanales de **San Ramón de Alajuela, Costa
Rica**. Tres productos en presentación de litro: **Chiliguaro, Miguelito y
Sangría**. Hecho con amor desde el **2020**.

Sale de la plantilla `D:\brasa-y-humo`, que es una muestra. **Ticoshot no lo
es.**

## ESTE NEGOCIO SÍ EXISTE

Teléfono real **8943 9595**, [Instagram](https://www.instagram.com/ticoshotcr/)
y [Facebook](https://www.facebook.com/ticoshotcr/) reales. De ahí salen las dos
reglas que mandan sobre todo lo demás:

1. **`negocio.modoMuestra` es `false`.** El botón manda pedidos de verdad al
   teléfono del dueño, no un mensaje de contacto al estudio.

2. **NADA SE INVENTA.** Lo que el cliente no ha confirmado queda en `null` y el
   sitio se adapta a la falta, de forma visible:

   | Falta | Qué hace el sitio |
   |---|---|
   | Precio (`null`) | "Consultar precio"; el carrito dice "A confirmar"; el mensaje sale sin monto; el JSON-LD omite `offers` |
   | Reseña (`fuente: "pendiente"`) | Aviso rojo "Sección pendiente — no publicar así" |
   | Hito (`confirmado: false`) | Atenuado, con etiqueta "Por confirmar con el cliente" |
   | `zonaEntrega` (`null`) | Dice que se coordina por WhatsApp, no lista cantones |
   | `google.cid` (`null`) | El mapa cae en búsqueda por nombre, no en la ficha de otro |

   **Un dato de relleno se ve idéntico a uno real.** Nadie se acuerda después de
   cuál había que cambiar, y el riesgo de publicarlo lo corre la marca del
   cliente. Lista completa en `PENDIENTE.md`.

   Esto incluye las reseñas. El usuario las pidió inventadas, se discutió y se
   descartó: publicidad engañosa —Ley 7472— sobre clientes reales. Se
   transcriben de sus redes.

## Stack

- **Next.js 16 (App Router) + React 19**
- **TypeScript estricto** — sin `.jsx`, sin `any`
- **Tailwind CSS v4** — config CSS-first con `@theme` en `globals.css`
- **Turbopack**
- **Animación en CSS puro** — `@keyframes` y `animation-timeline`. El revelado
  al hacer scroll lo dispara UN solo `IntersectionObserver` montado una vez en
  el layout. **Sin librería de animación.**
- **Zod** valida los datos y los formularios; **`schema-dts`** tipa el JSON-LD
- **Vitest** sobre la lógica pura
- Deploy en **Vercel**

## Navegación — UNA sola ruta

`/` con nueve secciones ancladas. El carrito y el checkout son **drawers**,
nunca páginas.

| # | Sección | `id` | Feature |
|---|---|---|---|
| 1 | Hero | `inicio` | `hero` |
| 2 | Los tres | `productos` | `catalogo` |
| 3 | Armá tu hielera | `kits` | `kits` |
| 4 | Cómo se toma | `ritual` | `ritual` |
| 5 | Quiénes somos | `nosotros` | `historia` |
| 6 | Eventos y catering | `eventos` | `eventos` |
| 7 | Reseñas | `resenas` | `resenas` |
| 8 | No tenemos local | `entrega` | `entrega` |
| 9 | Preguntas | `preguntas` | `faq` |

**Los `id` son la navegación entera.** Cambiar uno rompe el navbar y el pie a la
vez, sin que nada avise.

Historia, trayectoria y quiénes somos **son una sola sección** con línea de
tiempo dentro: eran la misma información tres veces.

**Eventos no pasa por el carrito.** Una boda de 120 personas es una cotización,
no una compra con precio cerrado. Dos flujos que terminan los dos en WhatsApp:
`construirMensajePedido` y `construirMensajeEvento`.

## Arquitectura — Feature-Based

```
src/
  app/       # rutas y COMPOSICIÓN entre features
  features/  # <feature>/{components,data,lib}
  shared/    # components, lib, types, data, config
```

**Regla dura: una feature nunca importa de otra, y `shared/` nunca importa una
feature.** Cuando dos la necesitan, sube a `shared/` — por eso los productos y
`lib/whatsapp.ts` viven ahí. Cuando hay que unirlas, se compone en
`app/page.tsx` y los componentes **reciben** sus datos por props.

Verificado en cero violaciones:

```bash
grep -rn "@/features/" src/features/ | grep -v "^src/features/\([a-z]*\)/.*@/features/\1/"
grep -rn "@/features/" src/shared/
```

## Datos en JSON validado

Toda LISTA de contenido vive en un `.json`. El único TypeScript que queda es el
esquema de Zod que la valida, y `parse` corre **al importar el módulo**, o sea
durante `next build`.

| Archivo | Qué |
|---|---|
| `shared/data/productos.json` | Los tres litros |
| `features/kits/data/kits.json` | Combos |
| `features/historia/data/hitos.json` | Línea de tiempo |
| `features/ritual/data/rituales.json` | Cómo se toma cada uno |
| `features/resenas/data/resenas.json` | Comentarios |
| `features/faq/data/preguntas.json` | Preguntas frecuentes |
| `shared/config/negocio.ts` | **Único TS con datos** |

`verificarKits()` corre en `app/page.tsx` y rompe el build si un kit cita un
producto que no existe: sin eso un id mal escrito deja un kit de dos litros en
vez de tres, en silencio.

## Paleta — reparto 70/30/10

| Franja | Uso | Color |
|---|---|---|
| 70% | Fondos | Crema `#FFF4EC` + degradado coral `#FF8A5B → #FFB07C` |
| 30% | Tarjetas y superficies | Blanco `#FFFFFF`, arena `#FBE7DA` |
| 10% | CTAs, precios, badges | Rojo del logo `#D32027` |

El menta del Miguelito y el vino de la Sangría son **identificador de
producto** —filete, badge, punto—, nunca fondo de sección.

**Contraste medido, no estimado.** La tabla completa está arriba de
`globals.css`. Lo que importa: **blanco sobre coral da 2,32:1 y NO PASA AA**,
aunque sea lo que usan en sus posts. Por eso los titulares van en marrón
`#2A1410` sobre el coral (7,51:1) y el blanco solo sobre el rojo (5,24:1).

## Reglas que costaron caro

### Ningún token de color puede llamarse como una escala de Tailwind

El fondo se llamaba `--color-base`. Tailwind v4 genera una utilidad de color por
cada token de `@theme`, así que eso creaba **`text-base` como color** — y
`text-base` ya existe como **tamaño de fuente**. Gana la de color.

Resultado: el párrafo del hero salía crema sobre tarjeta blanca, invisible. No
lo cazó el build, ni el lint, ni las pruebas. Se renombró a `--color-crema`.

**Prohibidos como nombre de color:** `base`, `sm`, `lg`, `xl`, `none`, `full`,
`auto`.

### Dos utilidades del mismo grupo NO compiten por orden de escritura

Tienen la misma especificidad: gana la que Tailwind ponga más abajo en la hoja,
no la que se escribió después. Pasó dos veces:

- `Tarjeta` fijaba `bg-superficie` y el llamante pasaba `bg-acento` por
  `className`: la tarjeta del cotizador salía blanca con texto blanco encima.
  **Ahora el fondo es la prop `fondo`**, que reemplaza en vez de competir.
- `Boton` fija `inline-flex`; el navbar le pasaba `hidden sm:inline-flex` y el
  botón del teléfono **no se escondía** a 375px. **Ahora el `hidden` va en un
  `<span>` envoltorio.**

Regla: si un componente fija una propiedad, expone una prop para cambiarla o se
envuelve. Nunca se pisa por `className`.

### Un módulo `"use client"` no le entrega VALORES al servidor

`CLAVE_EDAD` vivía en `BotonEdad.tsx` y `PuertaEdad.tsx` —de servidor— la leía
para armar el script. Salió `localStorage.getItem(undefined)` en el HTML. Ni
TypeScript ni el build dicen nada: el tipo sigue siendo `string`.

Lo que comparten las dos mitades va en un módulo neutro: `shared/lib/edad.ts`.

### `textLength` en todo `<text>` de un SVG propio

"TICOSHOT" a `fontSize 44` mide ~218 unidades en un lienzo de 200 y el navegador
lo **recorta**: quedaba `ΓICOSHOT⌐`. Y el ancho depende de la fuente, así que en
local podía verse bien. Con `textLength` + `lengthAdjust` el ancho lo manda el
SVG. Ver `Logo.tsx` y `Botella.tsx`.

### `noValidate` en todo formulario que valide con Zod

Los campos llevan `required` —correcto para un lector de pantalla— y el
navegador se adelanta con su globo nativo **en el idioma del sistema**. Bloquea
el envío, y los mensajes en español que hay escritos no se ven nunca.

### Heredadas de la plantilla

- **Nada de `"use client"` en `Revelar.tsx`.** Lo usan las secciones de
  servidor: arrastraría la página entera a la hidratación. Costó 4,4 s de
  render delay allá.
- **Sobre el pliegue no se usa el observador.** Vive en un `useEffect`. El hero
  usa `@keyframes`, que arrancan en el primer pintado.
- **El estado oculto va en `@media (scripting: enabled)`.** Sin JavaScript el
  contenido se ve, quieto. Nunca una página en blanco esperando un observador.
- **`threshold: 0`, nunca una fracción.** Un bloque más alto que la pantalla
  nunca cumple el 20%.
- **Nada de leer `localStorage` con `typeof window` durante el render.** Se usa
  `useSyncExternalStore` y su valor de retorno.
- **Tope de 1500 caracteres codificados en el mensaje de WhatsApp.** iOS trunca
  antes y **en silencio**: el pedido llega a medias y nadie se entera.

## El hero

Lo único sobre el pliegue. **Cero JavaScript, cero video.**

- **LCP:** un degradado en capas de `radial-gradient`. Se pinta con el HTML.
- **Olas:** tres SVG en línea con el path duplicado y `width: 200%`, corriendo
  un `-50%` exacto — de ahí el bucle sin costura. Velocidades 41s/27s/17s: el
  parallax sale de la diferencia, no de un cálculo.
- **Reacción al scroll:** `animation-timeline: scroll(root)` nativo, todo dentro
  de `@supports`. Donde no exista, las animaciones siguen en bucle. **El
  respaldo nunca puede ser "no se mueve nada".**
- **`prefers-reduced-motion` detiene todo**, y las de bucle infinito se ponen en
  `animation: none` — si no, la regla general las hace correr un ciclo entero en
  0,01 ms y la banda salta de golpe.

## Legal

Puerta de edad al entrar, con respaldo `:target` en CSS para que funcione sin
JavaScript. Aviso de consumo responsable en el pie. JSON-LD con los productos
como bebida alcohólica.

**`Organization`, no `LocalBusiness`.** `LocalBusiness` describe un lugar al que
se puede ir y pide `address`. Ticoshot no tiene local: se declara `areaServed`.
Inventar una dirección mandaría gente a la casa de alguien.

## Comandos

```bash
npm run dev        # puerto 3000 (3003 desde el launch.json del workspace)
npm run build
npm run test
npm run typecheck
npm run lint
```

## Estado

Build ✓ · 43 pruebas ✓ · lint ✓ · cero violaciones de arquitectura.

**No publicar todavía:** faltan precios, reseñas reales y datos del negocio.
Ver `PENDIENTE.md`.
