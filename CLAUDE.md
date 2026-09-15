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

**Eventos NO tiene cotizador, y se quitó a propósito.** Calculaba litros con
`personas × shots ÷ 20`, pero esos shots por persona los había puesto el
programador, no el bartender. Un número inventado que el sitio presenta como
cálculo es peor que no dar ninguno: quien lleva más de cinco años de barra sabe
cuánto se toma en una fiesta de sesenta personas, el sitio no. En su lugar va el
video de las tres botellas, y el formulario recoge los datos para que el número
lo ponga quien sabe. Hay una prueba que verifica que el mensaje de WhatsApp
**no** lleva ninguna cantidad calculada, para que nadie lo reintroduzca sin
darse cuenta.

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

El menta del Miguelito `#98EDD8` y el vino de la Sangría `#6E1B3E` son
**identificador de producto** —filete, badge, punto—, nunca fondo de sección.

> **El menta estuvo mal.** El token decía `#1F91AE`, un teal azulado que no es
> el color del producto: la botella del Miguelito es menta claro. Y no era solo
> cosmético — `Botella.tsx` pinta con ese token cuando falta la foto, así que
> el sitio dibujaba un producto que no existe. Lo confirmó el cliente.
>
> A **1,30:1 sobre crema no sirve para texto en ningún tamaño.** Es relleno,
> filete y punto de color; nunca lleva letra encima.

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

## Datos confirmados por el cliente

- **Entregas en San Ramón de Alajuela**, y fuera de ahí **se organiza**. Son dos
  campos distintos en `negocio.ts` —`zonaEntrega` y `entregaFueraDeZona`—
  porque cobertura y disposición no son lo mismo: lo primero se promete, lo
  segundo se conversa.
- **El Miguelito necesita refrigeración.** Lleva leche condensada. Va como
  `Producto.advertencia` y se pinta en la tarjeta del catálogo, en el kit que
  lo incluya y en la línea del carrito — no escondido en las preguntas
  frecuentes, porque quien lo compra tiene que saberlo antes de dejarlo al sol.

- **El dueño es bartender profesional, con más de cinco años de barra.** Por eso
  la sección de eventos **no es "te vendemos litros"**: monta la barra completa
  —cocteles, ron, cerveza, lo que pida el cliente— y con los contactos del
  gremio consigue el licor más barato de lo que costaría comprarlo por cuenta
  propia. Eso cambia contra quién compite la sección: antes competía con ir al
  supermercado, ahora no compite con nadie.

## El supuesto del cotizador SE MUESTRA

`cotizador.ts` asume 2 / 4 / 7 shots por persona. **Esos números no salen de
ningún dato**: los puso quien programó el sitio, y están pendientes de que el
cliente —que es quien sabe— los corrija.

Por eso el sitio **enseña la cuenta**: cada opción de ambiente dice a cuántos
shots equivale y la tarjeta del resultado escribe
`60 personas × 4 shots = 240 shots ÷ 20 por litro = 12 litros`.

Un cotizador que devuelve "12 litros" a secas no se puede discutir: o se le cree
o no. Con el supuesto a la vista, quien organiza la fiesta dice "nosotros
tomamos más que eso" — que es la conversación que hay que tener antes de
comprar, no después. Una prueba verifica que la cuenta escrita da siempre el
mismo número que la función que calcula.

## Fotos

Las fotos son las de sus propias publicaciones: el fondo coral pintado a mano
es parte de su identidad, no un fondo de relleno. Por eso van **a sangre** en
la tarjeta del catálogo, sin marco ni margen.

Los originales viven en `research/assets/` y **no se versionan**;
`scripts/optimizar-fotos.py` produce lo que sirve el sitio. Es una receta y no
un recorte hecho a ojo: el día que lleguen las fotos de cámara se corre otra vez
y sale idéntico.

**Dos recortes por producto, y no uno:**

| Recorte | Para qué |
|---|---|
| `vertical` 4:5 | Tarjeta del catálogo y banda del hero |
| `cuadrada` 1:1, **anclada abajo** | Miniatura del carrito y tarjetas de kits |

El cuadrado se ancla abajo y no al centro porque en las tres fotos la etiqueta
vive en la mitad inferior: un recorte centrado —que es lo que hace todo el
mundo por defecto— la parte justo por la mitad y deja una miniatura que no dice
qué producto es.

### Un marquee sin costura necesita DOS cosas

La primera es obvia y estaba: el desplazamiento tiene que ser exactamente el
ancho de un juego. La segunda se pasó por alto: **la pista total tiene que ser
más ancha que la pantalla más un juego.**

Con dos copias de tres tarjetas la pista medía 1.392 px, así que en una pantalla
de 1440 cubría 696 px y dejaba **744 px de hueco a la derecha**. Se veía como si
la banda estuviera rota, no como una tira pasando.

Ahora son seis copias — 4.176 px, sin hueco hasta pantallas de 3.480 px — y el
desplazamiento se calcula solo con `calc(-100% / var(--marquee-copias))`, que la
variable viene de la misma constante que decide cuántas pintar. Escrito a mano
como `-50%` solo era correcto con dos copias, y al cambiarlas el bucle habría
saltado en cada vuelta.

Son 18 tarjetas en el DOM pero **3 imágenes distintas**: el costo es marcado, no
red.

**Las olas se pintan DESPUÉS que la banda**, o sea por delante: las botellas se
leen saliendo del agua. Estuvo al revés un tiempo porque las dos capas de atrás
son translúcidas (55% y 70%) y cubriendo la tarjeta entera dejaban la foto
lavada. **Lo que lo arregla no es el orden sino la ALTURA**: las olas llegan a
184 px y las tarjetas empiezan a 96 px, así que el agua les toca el **35% de
abajo** y la etiqueta queda siempre sobre la línea de flotación. Si se suben las
olas o se baja la banda, vuelve el lavado.

### La banda se toca, y lo que no se puede probar a mano se saca a una lib

Cuatro gestos: el cursor la detiene y agranda esa botella, arrastrar la mueve,
**soltarla en marcha la deja rodando y frena sola**, y un clic agrega ese litro.

Arrastrar y hacer clic son el mismo gesto hasta que dejan de serlo. Los separa
un umbral de **6 px** —lo que tiembla un dedo apoyado sin intención de mover—:
pasado eso fue arrastre y no se agrega nada. Un toque sobre la banda **en
movimiento** la atrapa y tampoco compra: quien pone el dedo encima de algo que
se mueve lo está parando.

La mecánica vive en `features/hero/lib/banda.ts` y **no en el componente**,
porque `BandaBotellas.tsx` lleva `"use client"` e importa `next/image` y no se
puede cargar desde una prueba de Node. Ahí está lo único que falla en silencio:

- **El salto entre copias.** La pista son seis juegos idénticos, así que el
  contenido en `x` y en `x + unaCopia` es el mismo pixel: saltar una copia
  entera al pasarse de un extremo es invisible, y deja la tira girando sin fin
  en vez de estrellarse contra el final del scroll a mitad de un lanzamiento.
  La condición **no** es que quepa una copia en el rango sino que el punto
  equivalente **caiga dentro** de él — son cosas distintas, y la prueba que lo
  asumió al revés falló.
- **El roce elevado a `dt/16`.** Aplicado a pelo una vez por fotograma, un
  teléfono a 30 fps frenaría en la mitad del tiempo que un portátil a 60. El
  recorrido tiene que depender del tirón, no de lo rápido que pinte el aparato.
- **La velocidad suavizada.** El último `pointermove` antes de levantar el dedo
  suele venir casi quieto; a pelo mataría el impulso justo en el evento que lo
  decide.

La inercia se apaga con `prefers-reduced-motion` **desde JavaScript**: un bucle
de `requestAnimationFrame` no lo para ninguna regla de CSS. El arrastre sí se
respeta — lo mueve el dedo, es movimiento pedido.

### `overflow-x: auto` obliga a recortar TAMBIÉN en vertical

No existe `overflow-x: auto` con `overflow-y: visible`: el CSS computa el
segundo a `auto`. Así que la tarjeta que crece bajo el cursor salía **cortada
por arriba y por abajo**, y aun en reposo el carril se comía 5 px de las
tarjetas inclinadas.

Lo arregla **relleno dentro del carril**, no quitar el recorte: `py-16` da los
64 px que necesitan el zoom, la inclinación y la sombra. Y el `bottom` baja
**esos mismos 64 px** para que las botellas queden exactamente donde estaban —
a 80 px del borde en móvil y 96 px desde `sm`, que es la altura de la que
depende que las olas les toquen solo el cuarto de abajo. **Tocar uno obliga a
tocar el otro.**

### La tarjeta que se mira se endereza

Crecer sola no bastaba: entre seis tarjetas torcidas, una torcida un poco más
grande sigue siendo parte de la fila. Puesta recta se sale del patrón, y eso es
lo que la separa de las demás.

Se puede porque en **Tailwind v4 `rotate-2` escribe la propiedad `rotate`
suelta**, no `transform`: convive con el `scale` del botón sin pisarlo. Con
`transform` en los dos habría que reescribir el ángulo exacto de cada tarjeta,
y el CSS no sabe cuál le tocó a cuál.

Por lo mismo la regla vive en `@media (prefers-reduced-motion: no-preference)`
y **no** en la lista de `reduce`: para deshacerla haría falta ese ángulo que no
se conoce, así que directamente no existe cuando se pidió menos movimiento.

### Los adornos son dibujos propios, y se redibujaron enteros

Quince piezas en `shared/components/ui/Decorados.tsx` —fruta, hoja tropical,
palmera, velero y los garabatos de sus posts— en **línea fina y continua**, del
tipo de los iconos que pasó el cliente.

La primera versión eran garabatos de crayón con trazo de 5 sobre lienzo de 100
y no daban el nivel. El problema no era solo el grosor: **un trazo gordo se come
el detalle, y sin detalle una naranja, una manzana y un tomate son el mismo
círculo con un rabito.** Ahora el trazo es de 3 y cada dibujo lleva lo que lo
hace único —los ocho gajos y el doble anillo de la corteza, el cáliz de cinco
hojas del tomate, la muesca del tallo de la manzana, las escamas de la piña.

Son **SVG propios, no un paquete descargado**: no arrastran la atribución que
casi todas las licencias gratuitas de iconos exigen, heredan `currentColor` y
escalan sin pixelarse.

Tres reglas que salieron de mirarlos rasterizados:

- **El detalle que sobrevive es la SILUETA.** El coco partido con el hueco
  concéntrico se leía como una diana; descentrándolo, la corteza pasa de 5 a 17
  px y se lee media cáscara. El chile salía berenjena hasta que un lado bajó
  recto y el otro cerró en pico.
- **Los cortes de la monstera van en el CONTORNO.** Dibujados como rayas por
  dentro de un óvalo cerrado es un globo con una red. Y se dibuja **una mitad,
  espejada con `scale(-1 1)`**: escrita dos veces, el día que se retoque un
  lóbulo el otro lado se queda y la hoja sale coja.
- **La hoja de palma es pluma, no abanico.** Seis hojas convergiendo en un punto
  funden sus rellenos en un borrón; repartidas a lo largo de un tallo no se
  tocan nunca.

**La opacidad depende del color.** Todos iban al 22% y los claros no es que se
vieran poco, es que no estaban: menta `#98EDD8` sobre crema da **1,30:1** a
plena opacidad. Ahora son dos niveles — `TENUE` 0,3 para vino y rojo, `VIVO` 0,8
para menta, crayon y amarillo. Lo que cuenta para el 70/30/10 es la **tinta**
—color × grosor × opacidad—, nunca el número de la opacidad suelto.

**Los tamaños tienen que ser muy distintos.** Estaban todos entre `w-20` y
`w-36`: a esa distancia el ojo no lee "grande y chico", lee "todos parecidos", y
el fondo se vuelve una cenefa. Cada sección tiene ahora una pieza de ancla
grande (`w-44` a `w-60`), una media y una o dos chicas — hasta quince veces de
diferencia. La grande va siempre en esquina y casi siempre en `hidden lg:block`.

**El hero usa las mismas piezas.** Tenía su propia nube, su propia estrella y
sus propias rayas duplicadas, con el color escrito dentro del SVG — que es justo
lo que impide reusar un dibujo. Lo único que sigue siendo del hero son sus
animaciones de scroll (`garabato`, `destella`), distintas de las `deco-*`.

### En dos olas superpuestas, la de ATRÁS lleva las crestas más altas

Estaba al revés: atrás `ONDA_SUAVE` (sube a y=48) y delante `ONDA` (sube a
y=16). Una ola más alta delante **tapa por completo** a una más baja detrás, en
todo momento del ciclo. Eran dos SVG animándose para que se viera uno, y el
comentario prometía una profundidad que no ocurría.

No lo delataba nada, porque en las costuras las dos se rellenan del **mismo
color** y el resultado salía bien por casualidad. Se vio al pintarlas de colores
distintos en la playa.

### El cierre de playa, y por qué el mar es azul

Estaba pintado del rojo del pie para entrar en él sin costura, y no funcionaba:
una franja roja al pie de la página no se lee como mar, se lee como una franja
roja.

Los dos colores del agua ya estaban en la paleta: **`crayon` `#7CC4E8` es el
agua y `miguelito` `#98EDD8` la espuma.** No hizo falta token nuevo ni tocar el
reparto. El rojo sigue, pero en una ola de 24 px pegada al fondo: ahí hace lo
único que tenía que hacer, entregarle la página al pie sin una línea recta.

**Las tres alturas están atadas.** La cresta de la arena cae al 40% de su SVG,
o sea a `0,6 × altura` del borde de abajo. Con la arena a 240 px eso son 144, el
mar sube 96, y la diferencia —48 px— es **la playa que se ve**. Estaba a 96 px
de arena: la cresta caía a 58, el mar subía 80, y el agua se tragaba la arena
entera. Si se cambia una de las tres, hay que rehacer la resta.

### Cómo se verifican los dibujos sin poder ver la pantalla

El panel del navegador no repinta cuando la ventana está detrás, así que las
capturas salen en blanco y `requestAnimationFrame` no dispara.

La salida es **rasterizar**: se pide el HTML renderizado con `curl`, se extraen
los `<svg>` —los que de verdad sirve el servidor, no una copia a mano— y se
montan en una hoja de contacto con `@resvg/resvg-js`. Así se miran los quince
dibujos de una vez. Fue lo que cazó la berenjena, el globo con red y la ola de
atrás invisible; ninguna de las tres la habría visto un test.

## Zod nunca debe ser alcanzable desde un componente de cliente

Salvo que valide un **formulario**, que es el único caso donde hace falta en el
navegador (`features/checkout/schema.ts`).

**Todo lo que importa un componente de cliente se vuelve código de cliente, en
cascada.** `ServicioBarra.tsx` no lleva `"use client"`, pero lo importaba
`Eventos.tsx`, que sí: Zod entero viajaba al navegador para validar tres
párrafos que nunca cambian. No lo delataba nada — ni el build, ni el lint, ni
los tipos. Se vio midiendo los chunks servidos.

El parseo se movió a `features/eventos/lib/servicio.ts`, que ejecuta
`app/page.tsx` —de servidor— y los datos bajan por props ya validados.

**El checkout se carga aparte con `next/dynamic`**, y se monta solo cuando está
abierto: `dynamic` descarga el chunk en cuanto el componente se **renderiza**,
así que dejarlo siempre en el árbol con `abierto={false}` no habría servido de
nada. La descarga se adelanta al abrir el carrito —el paso anterior— para que
al pulsar "Continuar el pedido" ya esté en memoria.

Medido sobre el build de producción:

| | |
|---|---|
| Entrada, antes | 279 KB comprimidos |
| Entrada, ahora | **187 KB** |
| Checkout, diferido | 92 KB, solo para quien compra |

> **Ojo al medir:** un `next dev` corriendo escribe en el MISMO `.next` que el
> build de producción. Con los dos a la vez, los chunks en disco no son los que
> sirve producción y las mediciones salen mal. Parar el dev antes de medir.

## `??` es el operador equivocado para variables de entorno

**Tumbó el despliegue en Vercel.** El error fue:

```
TypeError: Invalid URL
  at metadataBase: new URL(SITIO)
  code: 'ERR_INVALID_URL', input: ''
```

La línea era `process.env.NEXT_PUBLIC_SITIO_URL ?? "https://…"`, repetida en
**cinco archivos**. `??` solo cae al valor por defecto con `null` o `undefined`,
y una variable **definida pero vacía** es `""` — que no es ninguno de los dos.
Pasa de largo, y `new URL("")` lanza.

Y ese es el caso normal, no uno raro: quien crea la variable en el panel de
Vercel y la deja sin rellenar obtiene exactamente `""`.

Ahora vive en un solo sitio, `shared/config/sitio.ts`, y resuelve en orden:

1. `NEXT_PUBLIC_SITIO_URL`, **si trae algo que de verdad parsea como URL**
   (un dominio sin protocolo también se descarta, que es el error más común al
   rellenar el panel). Se normaliza a `origin`.
2. `VERCEL_PROJECT_PRODUCTION_URL` o `VERCEL_URL`, que Vercel pone solo y vienen
   **sin protocolo**.
3. Un valor fijo, para que nada se caiga nunca por un dato de configuración.

`sitio.test.ts` cubre los ocho casos, incluido el exacto que rompió el build.

## SEO y metadatos

- **`negocio.publicado` decide si Google puede indexar.** En `false` el sitio
  manda `noindex` y el `robots.txt` bloquea a todos. Está así porque el sitio
  todavía enseña "Consultar precio" y un aviso de "no publicar así": indexar eso
  deja el fragmento de resultados con los marcadores durante semanas. Compartir
  por WhatsApp funciona igual — Open Graph no pasa por ahí.
- **Las URL del JSON-LD son ABSOLUTAS.** Lo leen rastreadores que no tienen el
  contexto de la página: una ruta relativa ahí no la resuelve nadie.
- **`Organization` lleva `logo`** — es lo que Google pone en el panel de
  conocimiento; sin él sale el favicon recortado o nada.
- **`Product` lleva `image`, y en las dos proporciones.** Es obligatoria para
  que salga como resultado enriquecido: sin ella el producto se indexa pero
  nunca aparece con foto, que es lo que hace que alguien haga clic.
- **La imagen de compartir es SOLO EL LOGO, rojo sobre blanco.** Se probó
  componiéndolo sobre la foto de las tres botellas y no funciona: el centro de
  esa foto es la etiqueta del Miguelito, que también es un círculo blanco con el
  logo dentro — quedaban dos logos apilados. Y aun resolviéndolo con una placa,
  al tamaño real de un chat (~250 px) la foto y el logo compiten y no gana
  ninguno. Va **centrado** porque cada plataforma recorta el 1200×630 a su
  proporción, y en WhatsApp el recorte se acerca al cuadrado: una esquina es lo
  primero que se pierde.
- **`formatDetection.telephone: false`.** Sin eso, Safari en iOS subraya como
  enlace de llamada cualquier número del texto —el del pie, las cantidades de
  las preguntas— y el sitio parece lleno de enlaces rotos.
- **El manifiesto no es para hacer una PWA**, es para que el acceso directo en
  la pantalla de inicio salga con el logo y no con una captura. Lleva un icono
  `maskable` porque si no Android lo mete en un cuadrado blanco.

## Comandos

```bash
npm run dev        # puerto 3000 (3003 desde el launch.json del workspace)
npm run build
npm run test
npm run typecheck
npm run lint
```

## Estado

Build ✓ · 62 pruebas ✓ · lint ✓ · cero violaciones de arquitectura.

**No publicar todavía:** faltan precios, reseñas reales y datos del negocio.
Ver `PENDIENTE.md`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
