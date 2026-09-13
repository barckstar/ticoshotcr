# Prompt para Google Flow — video de las botellas

Video de las tres botellas pasando una por una y terminando con las tres
juntas. Pensado para **Google Flow (Veo)**.

---

## 1. Qué modo usar

**Usá "Ingredients to Video"** (Ingredientes a video), no texto puro.

Ese modo toma tus fotos como referencia y mantiene la botella, la etiqueta y el
fondo coral **igual a las tuyas**. Con texto puro, Veo se inventa unas botellas
que se parecen pero no son las suyas: otra etiqueta, otro tono de rojo, y el
logo sale deformado.

Subí como ingredientes:

| Archivo | Qué es |
|---|---|
| `research/assets/chiliguaro.jpg` | Botella del Chiliguaro |
| `research/assets/miguelito.jpg` | Botella del Miguelito |
| `research/assets/sangria.jpg` | Botella de la Sangría |
| `research/assets/los-tres.jpg` | Las tres juntas |

> Están en el repo, en `research/assets/`. Son las mismas que bajaste de sus
> redes.

**El clip de Flow dura 8 segundos.** Cuatro momentos en 8 segundos son 2
segundos cada uno, que alcanza justo. Si te queda apurado, abajo está partido
en dos clips.

---

## 2. El prompt — un solo clip de 8 segundos

Va **en inglés a propósito**: Veo obedece bastante mejor en inglés que en
español, sobre todo en las indicaciones de cámara y de tiempo. Abajo está la
traducción por si querés compararla.

```
Product commercial. Locked-off camera, no camera movement. Vertical 9:16.

A vivid hand-painted coral and peach sunset background fills the frame, with
soft pastel brush strokes, light blue crayon squiggles, small mint-green dashes
and yellow four-point sparkles scattered around — a playful tropical collage
style.

Four beats, evenly timed:

Beat 1 (0-2s): a one-liter clear plastic bottle of deep red-orange chili liquor
with a bright red cap slides in smoothly from the left, settles at center with a
soft bounce, holds for a moment, then glides out to the right.

Beat 2 (2-4s): a one-liter bottle of pale mint-green creamy coconut liquor with
a bright red cap slides in from the left the same way, settles at center, holds,
glides out to the right.

Beat 3 (4-6s): a one-liter bottle of deep burgundy red sangria with a bright red
cap slides in from the left, settles at center, holds, glides out to the right.

Beat 4 (6-8s): all three bottles slide in together from the left and settle side
by side at center, filling the frame, and hold steady until the end.

The bottles are cold, with fine condensation droplets and a soft highlight down
the glass. Bright, sunny, high-key lighting. Clean, crisp, appetizing. Smooth
ease-in-ease-out motion, no spinning, no wobble. The circular white labels stay
sharp, flat and readable at all times.
```

**Prompt negativo** (si Flow te deja poner uno):

```
text, letters, words, typography, captions, watermark, logos other than the
bottle label, distorted label, warped bottle, hands, people, blurry, low
quality, camera shake, zoom, flicker
```

> **Por qué el negativo importa tanto:** lo que peor hace cualquier generador de
> video es **texto**. Si lo dejás suelto, te va a escribir "TlCOSH0T" o
> "CHILIGUAR0" en la etiqueta y el video queda inservible para una marca. El
> negativo y la frase *"labels stay sharp, flat and readable"* empujan a que
> respete la etiqueta de la foto de referencia en vez de inventar una.

### La traducción, por si la querés comparar

> Comercial de producto. Cámara fija, sin movimiento. Vertical 9:16.
> Fondo de atardecer coral y durazno pintado a mano, con pinceladas pastel,
> garabatos de crayón azul, rayitas menta y estrellitas amarillas de cuatro
> puntas — collage tropical y alegre.
> Cuatro tiempos parejos: entra el chiliguaro desde la izquierda, se asienta en
> el centro con un rebotecito, aguanta y sale por la derecha; lo mismo el
> miguelito; lo mismo la sangría; y al final entran las tres juntas y se quedan
> quietas hasta el final.
> Botellas frías, con gotitas de condensación y un brillo suave en el vidrio.
> Luz de día, limpia y apetitosa. Movimiento suave, sin giros ni temblor. Las
> etiquetas blancas redondas siempre nítidas y legibles.

---

## 3. Si 8 segundos se te quedan cortos

Partilo en dos clips y unilos en Flow. Queda con más aire.

**Clip A — las tres solas (8s)**

```
Product commercial. Locked-off camera, no camera movement. Vertical 9:16.
Vivid hand-painted coral and peach sunset background with pastel brush strokes,
light blue crayon squiggles and yellow four-point sparkles.

Three one-liter plastic bottles with bright red caps appear one at a time, each
sliding in smoothly from the left, settling at center with a soft bounce,
holding, then gliding out to the right before the next one enters:
first a deep red-orange chili liquor, then a pale mint-green creamy coconut
liquor, then a deep burgundy sangria.

Cold bottles with condensation droplets. Bright sunny high-key lighting. Smooth
ease-in-ease-out motion, no spinning. The circular white labels stay sharp,
flat and readable.
```

**Clip B — las tres juntas (8s)**

```
Product commercial. Locked-off camera, no camera movement. Vertical 9:16.
Same vivid hand-painted coral and peach sunset background with pastel brush
strokes, blue crayon squiggles and yellow sparkles.

Three one-liter plastic bottles with bright red caps — deep burgundy sangria on
the left, pale mint-green coconut liquor in the middle, deep red-orange chili
liquor on the right — slide in together from the left and settle side by side
at center, filling the frame. They hold steady while the sparkles twinkle gently
around them until the end.

Cold bottles with condensation droplets. Bright sunny high-key lighting. Smooth
ease-in-ease-out motion, no spinning. The circular white labels stay sharp,
flat and readable.
```

---

## 4. Qué formato pedir

| Para qué | Formato |
|---|---|
| El sitio | **16:9** — el hero es ancho en escritorio |
| Reels, TikTok, historias | **9:16** |

Si solo vas a generar uno, hacé el **9:16**: es donde lo van a ver casi todos,
y de un 9:16 no se saca un 16:9 sin tirar el 65% de la imagen. Al revés tampoco.
Lo barato es generar los dos, que es correr el mismo prompt cambiando una línea.

---

## 5. Dónde va el video en el sitio

**No en el hero, y esto no es un capricho.**

El hero es lo único sobre el pliegue y hoy su LCP es un degradado: se pinta
antes de que exista JavaScript. Meter un video ahí es lo más caro que se puede
poner arriba y tira abajo la nota de rendimiento de Lighthouse, que el proyecto
tiene como objetivo por encima de 95.

El video va en una **banda de reel debajo del hero**, cargada con
`next/dynamic` y solo cuando se acerca a la pantalla. Ver `PENDIENTE.md` §6:
está contemplado en el diseño y sin construir porque todavía no había material.

Cuando tengas el video:

1. Dejalo en `research/assets/` con el original.
2. Se le hace un póster (una **foto**, nunca un fotograma congelado: un
   fotograma no dice qué producto es).
3. Se monta la banda con el video en `muted`, `loop`, `playsInline` y
   `preload="none"`.
