# Auditoría B · v2.8 → 3.0: experiencia de uso y funcionalidad

Sobre `main` en v2.8 (merge del PR #55, commit `4a70be0`). Solo lectura: no se cambió código,
contenido ni datos del repo. Las mediciones se hicieron con Playwright y Chromium 1194 a 390×844
(y 320×568), tema claro y oscuro, italiano y portugués, sobre `python3 -m http.server 8000`
(sin gzip). El alumno «veterano» es el estado que produce `tools/it/sim_carriera.js` al cabo de
20 semanas (140 días, semana 21 desbloqueada, 2.264 fichas, 119.651 xp), inyectado en
`localStorage` con las claves `laviac1.save.v1` / `rumoc1.save.v1` y los días desplazados a hoy.
Los scripts, los estados y las 110 capturas quedaron en el scratchpad
(`tour.js`, `tour2.js`, `tour3.js`, `sim_it.js`, `state_*.json`, `shots/`). Hoy es domingo, así
que todas las capturas muestran la «meta a la mitad» del fin de semana.

**Fuera de alcance, a pedido:** todo lo que usa la voz del alumno. Escuchar audio y TTS sí entran.

Esta auditoría mira una sola cosa: **qué le pasa a la persona que usa la app** desde que la abre por
primera vez hasta que termina la semana 52, y qué le falta a esa experiencia para que el salto a 3.0
sea de producto y no de número. La didáctica del contenido, el corrector y las lenguas van en los
otros frentes.

---

## Resumen: lo que más pesa

| # | Prioridad | Qué | Dónde | Esfuerzo |
|---|---|---|---|---|
| 1 | Alta | Oggi no dice **qué hacer hoy ni cuánto tarda**: la misión siguiente queda a 1.425 px (1,7 pantallas) para el alumno de la semana 21, detrás de tres tarjetas de hábito; ninguna misión ni ronda anuncia minutos | `js/app.js:477-482` (orden de tarjetas), `weekPlan` 1543-1667 | M |
| 2 | Alta | **No hay onboarding**: del selector se cae a Oggi con 6 tarjetas y 8 botones; nada explica las cinco pestañas ni la semana; el test de ubicación se ofrece una vez y desaparece si la primera acción es una pausa (`Ubicacion.fresh`) | `js/boot.js:148-170`, `js/ubicacion.js:161-165`, `app.js:477` | M |
| 3 | Alta | **Después de la semana 52 no pasa nada**: aprobado el examen, Oggi sigue diciendo «semana 52 · 1/5 misiones · Siguiente: Repaso…» y «0 / 3.580 palabras nuevas · faltan 3.580»; no existe un modo de mantenimiento | `app.js:436-520`, `tryAdvance` 1680-1686, `Engine.subGoals` | M |
| 4 | Alta | **Señales cruzadas al volver**: tras 9 días sin usar, la cabecera muestra «140 🔥 · 3 🛡️», el texto dice «Llevás 140 días seguidos» y la tarjeta de abajo «Volviste después de 9 días»; la racha se pierde recién al responder la primera pregunta, y los escudos no la salvan | `engine.js:731-748`, `app.js:370-395`, `app.js:453-460` | S |
| 5 | Alta | **Carga inicial**: 67 pedidos, 6,4 MB (it) / 5,8 MB (pt), 54 scripts uno detrás del otro; en 4G lenta sin gzip 40 s / 37 s hasta que Oggi se puede usar. A3 sigue abierto | `js/boot.js:128-142`, `sw.js:44-48` | S–M |
| 6 | Alta | **Copia de seguridad** sigue manual, sin sobre (`{app, lang, v}`), sin recordatorio, sin control de idioma al importar; no hay sincronización ni segundo dispositivo | `app.js:3648-3692` | S (sobre) · M (respaldo automático) |
| 7 | Media | **Pantallas-catálogo**: Leggi mide 14.051 px y tiene 136 botones; Io 9.471 px con 15 tarjetas (las medallas solas ocupan 3.500 px); Allena 7.189 px; el Percorso 7.794 px sin llevarte al nodo actual (3.545 px abajo) | `renderLeggi`, `renderIo`, `renderPercorso` | M |
| 8 | Media | **Guardado**: `persist()` serializa el estado entero (477 KB en la semana 21, 879 KB en la 52) en cada respuesta y en cada tecla del examen; 18,7 ms por guardado con CPU ×4 | `engine.js:704-711`, `app.js:80-86`, `4791-4798` | M |
| 9 | Media | **Accesibilidad sin cambios desde v2.5**: `lang` solo en `<html>`, ningún `aria-current` ni `aria-pressed`, botones de cabecera 34×34, ✕ 39×39, etiquetas de 8 y 10,9 px con 3,56:1, inputs sin etiqueta, palabras tocables sin rol | C1–C5 | S–M |
| 10 | Media | **Contraste en Rumo C1**: el botón principal sigue en 3,42:1 (claro) y 2,57:1 (oscuro) | `lang/pt/theme.css` | S |

**Orden sugerido para 3.0.** Primero lo que no exige rediseño y evita datos falsos o pérdidas: 4, 6 (el
sobre), 8 y los restos de A1/A6/A8/A10. Después la carga (5) y la accesibilidad (9, 10), que son
trabajo acotado y ya tienen el arreglo escrito en la auditoría anterior. Recién ahí los tres cambios
de producto que justifican el número: el **plan del día** (1), el **onboarding** (2) y el
**post-curso** (3), más el rediseño de las pantallas-catálogo (7).

---

## 1. Estado de la auditoría v2.5: secciones A y C

Verificado sobre el código de v2.8. «Resuelto» quiere decir que el arreglo está y se reproduce;
«a medias», que hay parte hecha; «abierto», que el hallazgo se reproduce igual que en v2.5.

| Punto | Estado | Evidencia en v2.8 |
|---|---|---|
| A1 · Retomar una ronda repite la pregunta contestada | **Abierto** | `savePending()` se llama en `startRound` (`app.js:1930`) y en `nextItem` (`3010`), nunca al final de `settle()` (`2550-2789`). Si la app se cierra entre la corrección y «Siguiente», la ronda pendiente sigue apuntando a la misma pregunta. |
| A2 · El examen aprueba cualquier texto largo | **Abierto** | `app.js:4817`: `score = wordsOk * 8 + max(0, 12 − hard × 1,5)`, la misma fórmula. La revisión con variedad léxica y anticopia existe para las tareas del tramo (`Tramo.evaluate`, `js/tramo.js`) pero el examen no la usa. Las preguntas de escucha siguen en castellano en el examen (la escucha larga del tramo, en cambio, pregunta en la lengua meta: captura `it-20-tramo-escucha`). |
| A3 · Primera carga lenta y bajada doble | **Abierto** | `boot.js:131-141` sigue insertando los scripts uno por uno (`s.onload = next`); `sw.js:44-48` sigue con `cache: "reload"` en la instalación. Medido: 67 pedidos, 6,42 MB (it) / 66, 5,78 MB (pt), 54 `<script>`; 4G lenta (150 ms, 1,6 Mbps, sin gzip): **39,9 s** (it) y **37,4 s** (pt) hasta `#pausa`. Local: 1,2 s. |
| A4 · El SW puede mezclar versiones | **Abierto** | `sw.js:139` y `150`: `fetch(e.request)` sin `cache: "no-cache"`. |
| A5 · Un error al arrancar bloquea la app | **A medias** | Con `storie: {}` y `scritti: "x"` la app ahora arranca (probado en los dos idiomas): los módulos se protegen solos (`biblioteca.js:287`). Pero sigue un solo `.catch` (`app.js:5590-5602`), no hay pantalla de rescate con «Descargar mis datos», y el guardado ilegible se aparta como `.damaged` sin avisar (`engine.js:699`). |
| A6 · Importar sin control de idioma ni migraciones | **A medias** | `importSave` (`app.js:3672-3692`) ahora pasa por `Engine.migrateSyllabus` y `Engine.sanitize`, pero no por `SAVE.load` (las metas viejas siguen sin migrar), no borra la ronda pendiente y no controla el idioma. El export sigue siendo el estado pelado: claves `xp, coins, week, unlocked…`, sin `app` ni `lang` (medido: `italiano-copia-2026-09-27.json`, 1.699 bytes en un estado nuevo). |
| A7 · La versión nueva recarga sola | **A medias** | La lista blanca creció a seis pantallas (`app.js:5462`: gioco, lampo, lezione, lettura, tramo-asc, tramo-scr), pero sigue `location.reload()` sin aviso en las demás, el borrador del dictogloss sigue solo en memoria y no se guarda pantalla ni scroll. |
| A8 · El ajuste del olvido se congela a los 2.500 repasos | **Abierto** | No existe `logTotal` en `engine.js`; `maybeFit` (`342-350`) compara contra `log.length`, recortado a `LOG_MAX = 2500`. El veterano de la semana 21 ya tiene el log lleno (2.500). |
| A9 · Respuestas de la IA tarde o con forma rara | **A medias** | Role-play: `app.js:4411` sigue retornando antes de `parla.busy = false` si saliste de la pantalla. `(data.obiettivi_raggiunti \|\| []).forEach` (`4416`) lanza si llega un string. La historia generada ya no existe (README: «ya no se genera con IA»), así que ese punto cae. El doble escape `mk(esc(…))` ya no aparece. |
| A10 · Detalles | **Abierto casi todo** | SRS vence a la hora exacta (`engine.js:273`, `card.due = now + ivl * DAY`); el examen sigue llamando `persist()` en cada tecla (`app.js:4791-4798`); no hay `exportedAt` ni recordatorio de copia (solo el texto fijo de Io); el gimnasio pt ahora conoce el imperativo (`drills.js:121`, `pt/rules.js:321`), gerúndio y particípio no se verificaron. Biblioteca: no probado. |
| C1 · Ningún texto meta lleva `lang` | **Abierto** | `document.querySelectorAll("[lang]").length` = 1 en Oggi y en Io (solo `<html lang="es">`). Hay dos `lang` puntuales (`app.js:934`, `4064`) y uno en `tramo.js`. Las lecturas, las frases y las correcciones siguen sin él. |
| C2 · Botones sin nombre ni estado | **Abierto** | 0 `aria-current`, 0 `aria-pressed` en toda la app. Los nodos del Percorso se anuncian «1», «🔒», «⚔️» (`app.js:1080-1082`). La cabecera sigue como «🔊» y «☀️». |
| C3 · Zonas táctiles chicas | **Abierto** | Medido a 390 px: cabecera 🔊 y ☀️ **34×34** (`it/theme.css:580`), placa 73×36, ✕ de la ronda **39×39**, chips «usos» y checkbox sin cambios. Los únicos 44 px son los íconos de las misiones. |
| C4 · Contraste | **Abierto** | Botón principal de Rumo C1: **3,42:1** claro, **2,57:1** oscuro (medido con `getComputedStyle`). La Via C1: 4,95 / 4,89. Nuevo: las etiquetas de la barra inferior (10,88 px) y de la cabecera (8 px, `.stat span`) dan **3,56:1** (it) y 3,72:1 (pt) en claro. |
| C5 · Otros | **Abierto casi todo** | Io a 320 px: `scrollWidth` = **338** (los dos idiomas, captura `it-62-io-320`). «Reducir movimiento» está en `theme.css:589` (it) y `533` (pt) para 17 selectores, pero faltan `.shake` (`app.css:173`) y `.ep-timer.low` (`app.css:512`). Palabras tocables: `<span class="w">` sin rol (`app.js:911`, `2043`). Foco: `outline: none` en `it/theme.css:424, 552` y `pt/theme.css:368`; el único `:focus-visible` es el del selector (`app.css:341`). Manifiesto: sigue sin `id` ni `screenshots`, `theme_color` único `#0f4c85`. |

En resumen: de los 15 puntos, **0 resueltos del todo, 4 a medias, 11 abiertos**. Las v2.6-2.8 fueron
de contenido (tramo C1, palabras B2-C1, corrector), no de núcleo ni de teléfono. Eso es lo primero
que un 3.0 tiene que saldar, porque casi todo es esfuerzo S y ya está diseñado.

---

## 2. Lo que ya está bien (y conviene no romper)

- **La pregunta «qué sigue» tiene respuesta**: `weekPlan` arma la lista ordenada de misiones y Oggi
  muestra la próxima con un botón que la abre en un toque (`#heronext` → lección, medido en los dos
  idiomas). Del ícono de la app a la primera pantalla de contenido son **dos toques** (Oggi →
  «▶︎ Lección» → «Empezar →»); a una pregunta de pausa, **uno**.
- **El test de ubicación existe y está bien hecho** (`js/ubicacion.js`): adaptativo, ~25 preguntas,
  «No sé» vale más que adivinar, 5-8 minutos, propone una semana por debajo de la estimación, nunca
  baja el progreso, abre las anteriores sin estrellas. Capturas `it-02`, `it-03`.
- **La vuelta tras una pausa está pensada**: tarjeta «Volviste después de N días», cinco minutos con
  las fichas más frías, pregunta de un toque que ajusta la retención (`oggiHabitCards`,
  `wireHabit`). Captura `it-40-vuelta-9dias`.
- **Retomar donde estabas**: ronda y lección pendientes en `localStorage` dos días
  (`savePending`/`loadPending`), con «Seguir donde estaba» / «Descartar» arriba de Oggi.
- **Hábito y motivación con base**: meta diaria a la mitad el finde, cofre, escudos, meta con tus
  palabras, cierre semanal de tres toques, récords personales en vez de tablas, tarjeta para
  compartir por la hoja de compartir del teléfono.
- **Sin servidor y aun así**: recordatorio por `.ics` (`reminderIcs`), badge del ícono con las fichas
  vencidas (`updateBadge`, Badging API), dos atajos en el manifiesto (`#pausa`, `#micro`),
  `storage` event para dos pestañas abiertas, `navigator.storage.persist()`, media session para el
  audio.
- **El cambio de idioma** es un botón a 306 px de Io, conserva el progreso de cada idioma y se probó
  ida y vuelta sin pérdida (smoke y `tour.js`).
- **Modo oscuro** correcto en los dos idiomas: tokens por tema, `☀️/🌙` en la cabecera y en Io,
  «como el teléfono» por defecto. En oscuro el texto atenuado sube a 7,2-7,5:1 y las etiquetas a
  9,3:1. Capturas `it-60`, `pt-61`.
- **Robustez básica**: cero errores de consola en los 110 pasos del recorrido; el estado con campos
  no base rotos arranca; todo acceso a `localStorage` está protegido; `persist()` avisa si el
  teléfono no deja guardar (`app.js:80-86`).
- **La ronda y la lección son limpias**: una idea por pantalla, contador «4 di 6 · A metà», ✕
  visible, feedback con `aria-live` y foco en «Siguiente» (lo verifica el smoke). Capturas `it-09`,
  `it-70`, `it-71`, `pt-61`.
- **El examen y el tramo** se presentan claros: cinco pruebas con el criterio (55 % / 60 %) a la vista,
  orden libre; la escucha larga explica quién habla, cuántas veces se escucha y que las preguntas se
  leen antes. Capturas `it-18-examen`, `it-20-tramo-escucha`.

---

## 3. El recorrido del alumno, con ojo de producto

### 3.1 Primer arranque

**Qué pasa.** Selector de idioma (captura `00-selector`, correcto y lindo) → «Cargando…» → Oggi.
En Oggi nuevo hay **6 tarjetas, 8 botones, 238 palabras y 2.071 px** de alto (it; pt 2.004),
capturas `it-01-oggi-nuevo`, `pt-01-oggi-nuevo`:

1. saludo + «Empezás de cero. Tu camino es il percorso: un paso por vez» (o, en domingo, el
   texto del fin de semana, que tapa al del principiante: `app.js:453-460` prioriza `weekend`);
2. «🧭 ¿Ya sabés algo?» con «Hacer el test» / «Empiezo de cero»;
3. la tarjeta del percorso con «▶︎ Lección 1/5: Un alfabeto de 21 letras» y «Ver la semana»;
4. Meta de hoy 0/100;
5. tres botones grandes (Pausa caffè, Sfida del giorno, Ripasso deshabilitado) y la nota «Lampo se
   abre con 12 frases vistas (llevás 0)»;
6. Frase del giorno con nota gramatical, calendario vacío, «Instalala en tu celu», versión.

**Lo que falta.**

- **Nada explica la app.** No hay una pantalla de bienvenida ni un recorrido de las cinco pestañas:
  «Allena», «Leggi», «Percorso» e «Io» aparecen sin contexto y el texto que explica el camino (las 3
  estrellas, los jefes) está recién en la pestaña Percorso (`UI.pathLead`). Un principiante ve
  «Sfida del giorno · 6 preguntas · doble xp» antes de haber leído una lección.
- **El test de ubicación es efímero.** La tarjeta solo aparece si `Ubicacion.fresh(state)`
  (`ubicacion.js:161-165`: sin intentos, sin lecciones leídas). Si la primera acción del alumno es
  tocar «Pausa caffè» (el botón más vistoso de la pantalla), la oferta desaparece para siempre de
  Oggi y queda a **5.168 px** de profundidad en Io. En un producto con test de nivel, el test es el
  paso 1, no una tarjeta opcional.
- **La primera pausa es un mal primer contacto.** En el recorrido automático la pausa de un alumno
  nuevo trajo escucha de dobles (`casa / cassa`, captura `it-09-ronda`) y frases nuevas, y terminó
  con **40 %** (it) y **50 %** (pt) (captura `it-11-resultado`) porque el mezclador toma lo que la
  semana tiene, no lo que el alumno ya vio. Como Oggi la ofrece con el mismo peso que la lección,
  es fácil que la primera experiencia sea fallar.
- **Mensajes que compiten**: en el arranque de un domingo, el `lead` dice «Fin de semana: meta a la
  mitad» en lugar de «Empezás de cero» (`app.js:453`).

### 3.2 El día típico

**Qué pasa.** El alumno de la semana 21 abre la app y ve, en este orden (posiciones medidas en px CSS
con `getBoundingClientRect`, pantalla útil de 844 − 70 de cabecera − 61 de barra), captura
`it-30-oggi-veterano`:

| Bloque | Arriba a | Qué dice |
|---|---|---|
| Saludo + lead | 100 | «Fin de semana: meta a la mitad… Llevás 140 días» |
| 🎯 ¿Para qué querés italiano? (7 chips) | 277 | se muestra hasta que toques una opción (`!state.ideal && attempts >= 10`) |
| 🪜 Esta semana | 619 | «0 / 264 palabras nuevas · faltan 264 · 220 / 1.800 para el jefe en 6 semanas» |
| 📓 Cierre de la semana pasada (3 preguntas, 13 chips) | 775 | lunes, martes y domingo |
| 🗺️ Percorso · **Siguiente: ▶︎ Lección 1/3** | **1.425** | el único botón que dice qué hacer hoy |
| Meta de hoy + cofre | 1.562 | |
| Pausa / Sfida / Ripasso / Parole / Parola o no / Lampo | 1.719-2.003 | seis botones grandes |
| Cuatro cuerdas, Clínica, Frase del giorno | ~2.200-2.430 | |
| Calendario, Instalar, versión | 2.730-3.205 | |

Es decir: **la respuesta a «qué hago hoy» está a 1,7 pantallas**, detrás de tres tarjetas de hábito
que piden cosas (elegí tu meta, mirá tu cuota, cerrá la semana). En el mismo idioma la pantalla dice
«semana» con cuatro sentidos distintos (fin de semana, Esta semana, la semana pasada, últimas 4
semanas) y la meta diaria aparece tres veces (anillo de la cabecera, tarjeta «Meta de hoy», barra
del resultado).

**Lo que falta.**

- **Un plan del día con tiempo.** Ninguna misión, ronda ni tarjeta dice cuántos minutos lleva. Los
  únicos números de tiempo de toda la app son «Pausa caffè · 3 minutos», «5 minutos para retomar» y
  «Repaso de 2 minutos» del atajo. La simulación (`sim_carriera.js`, 52 semanas) da **109-223
  minutos por semana** (mediana 146, es decir **~20 min por día**, 129 horas al año), y las semanas
  42, 49, 50 y 51 pasan de 180. El alumno no lo sabe, y la meta es en xp (una unidad que no mide
  nada que él pueda planear). El motor ya tiene lo necesario para estimarlo: `SEC` por tipo de ítem
  en el sim, `Drills.dueCount`, `weekPlan`.
- **Elegir qué hacer no es lo mismo que saber qué hacer.** Oggi ofrece a la vez la misión siguiente,
  la pausa, la sfida, el ripasso, las palabras, dos lampi, la clínica y la frase del día: nueve
  entradas a estudio. Para el que llega con tres minutos, la app no elige por él.
- **Las tarjetas de hábito son interrupciones permanentes.** La de «¿Para qué querés italiano?» se
  muestra en cada apertura hasta que se responde; la del cierre semanal, tres días por semana; la de
  «Esta semana» siempre desde la semana 2. Ninguna se puede plegar ni posponer más que con «Ahora no»
  (que en el cierre solo vale para esa semana).
- **La cuota semanal de palabras es dudosa.** «0 / 264 palabras nuevas · faltan 264» y «220 / 1.800
  para el jefe en 6 semanas»: `Engine.subGoals` divide lo que falta para la meta del trimestre por las
  semanas que quedan. Con el sim, que juega todas las misiones, a la semana 21 lleva 220 palabras de
  1.800: la cuota que le pide (264 por semana) es diez veces lo que el curso enseña por semana (9-20
  palabras de la semana + 12 por sesión de Parole). Esa barra está en rojo todo el año.

### 3.3 La semana: Percorso y briefing

**Qué pasa.** Percorso tiene 52 nodos en 4 estaciones, **7.794 px** de alto (it; pt 8.012), captura
`it-07-percorso-full`. Para el alumno de la semana 21 el nodo actual está a **3.545 px** y la
pantalla abre arriba de todo (`scrollY` 0): cuatro pantallas de scroll cada vez, capturas
`it-31-percorso-veterano` y `it-31b` (el nodo, ya scrolleado). Cada nodo muestra número, título,
estrellas y «12/14 misiones». Cuesta 284 ms renderizarlo con CPU ×4 porque calcula `weekPlan` de
las 52 semanas (`app.js:1082-1084`).

El briefing de la semana 1 lista **14 misiones** (it) / **15** (pt): cinco lecciones cortas,
palabras, «Superá la semana», Scrivi, frases, dos lecturas, Suoni, variaciones, Dominala (captura
`it-08-semana1`). La semana 30 tiene **17** (it) / **16** (pt), con lectura larga, escucha larga y
tarea. La semana 13 (jefe) tiene 8 (it): seis repasos opcionales, puntos débiles y el jefe (captura
`it-22-semana13-jefe`).

**Lo que falta.**

- **Ir al nodo actual.** `renderPercorso` no hace `scrollIntoView` del `.node.current` ni pone un
  botón «ir a mi semana». Con 52 nodos es lo mínimo.
- **Las estrellas y las misiones se contradicen.** Un nodo puede mostrar ★★★ y «12/14 misiones»
  (captura `it-31`): las tres estrellas son lección + 20 correctas + Dominala; las misiones, todo lo
  demás. El alumno lee «terminada» y «faltan dos». Conviene una sola métrica por nodo o explicar la
  diferencia en el nodo.
- **14-17 misiones por semana sin agrupar.** El briefing es una lista plana numerada, obligatorias y
  opcionales mezcladas (el sub-texto dice «Opcional ·» en las que lo son). No hay estimación de
  tiempo ni una vista «hoy me toca esto» dentro de la semana: la única guía es el orden.
- **Nada marca el fin de estación como logro.** Al vencer al jefe la pantalla de resultado dice
  «⚔️ Boss vencido» y la semana siguiente se abre. No hay resumen de la estación (qué dominaste, qué
  quedó flojo, cuántas horas), ni un «diploma A2» compartible; la tarjeta compartible existe
  (`shareCard`) pero solo para «mi semana».

### 3.4 La vuelta tras días sin usar

**Qué pasa.** Con `lastPlayed` 9 días atrás (captura `it-40-vuelta-9dias`, y lo mismo en pt):

- la cabecera muestra **«140 🔥 · 3 🛡️ · ×1,2»** y el anillo de la meta;
- el `lead` dice **«Llevás 140 días seguidos»**;
- dos tarjetas más abajo: **«👋 Volviste después de 9 días»** con «▶︎ 5 minutos para retomar».

`touchStreak` (`engine.js:731-748`) se ejecuta recién en `gain()` (`app.js:191`), al responder. En
ese momento `gap = 9`, `missed = 8 > shields (3)` → **la racha pasa de 140 a 1**, sin usar ningún
escudo (la regla es todo-o-nada: `missed <= shields`). El alumno ve 140 hasta que contesta una
pregunta y en la siguiente pantalla ve 1. Es la peor secuencia posible para alguien que vuelve.

**Lo que falta.** Calcular y mostrar la racha real al abrir (no al jugar), consumir los escudos que
haya aunque no alcancen (140 → «racha en pausa, 3 escudos usados, te quedan N días para
recuperarla»), y que el `lead` no diga «llevás 140 días» cuando la tarjeta de abajo dice lo
contrario. El `visibilitychange` (`app.js:5483-5489`) ya redibuja la cabecera al volver: es el lugar.

### 3.5 Fin de estación y fin del curso

**Fin de estación.** Ver 3.3: no hay cierre.

**Fin del curso.** Con la semana 52 desbloqueada y `weekStats[52].bossPassed = true` (captura
`it-50-fin-curso`, y pt igual):

- Oggi: «🗺️ Il percorso · semana 52 · C1 · 1 / 5 misiones · ESAME FINALE · Siguiente: 📘 Repaso: el
  sistema verbal…» con el botón «▶︎ Repaso…»;
- «🪜 Esta semana · hacia el C1 en la semana 52 · **0 / 3.580 palabras nuevas · faltan 3.580**»;
- el Percorso muestra el nodo 52 como jefe y nada más (captura `it-51`);
- `tryAdvance` (`app.js:1680-1686`) para en 52; `Engine.subGoals` sigue calculando la cuota contra
  3.800 palabras.

No existe un **modo post-curso**: ni repaso de mantenimiento con la cola FSRS (que ya está: fichas en
«mantenimiento» a meses, `MAINT_S`), ni lectura extensiva como eje (la Biblioteca y las lecturas
largas ya están), ni simulacros repetibles del examen (el examen guarda la mejor nota y tiene una
versión), ni un certificado. Después de un año de uso la app sigue pidiendo «Repaso: el sistema
verbal» como misión 2 de 5.

### 3.6 Cambio de idioma

Botón «Cambiar a Português 🇧🇷» a 306 px de Io, con la aclaración de que cada idioma guarda su
progreso. Funciona (captura `it-23-cambiado`: pestañas Hoje/Treino/Ler/Trilha/Eu). `Boot.switchTo`
hace `location.href = location.pathname`: recarga entera, lo que vuelve a bajar el paquete si el
SW no lo tiene (el otro idioma se cachea «a demanda», `sw.js:88-100`). No hay forma de ver los dos
progresos juntos ni un selector rápido en la cabecera; para quien estudia los dos (el modo «Tres
lenguas» existe para eso), son dos toques y una recarga por cambio.

### 3.7 Copia de seguridad, guardado, multi-dispositivo

**Qué existe.** «💾 Guardar copia» (hoja de compartir o descarga) y «📂 Restaurar copia» en Io, a
3.112 px; `navigator.storage.persist()`; el mensaje «🔒 El navegador marcó tus datos como
persistentes» o «Instalá la app…»; `storage` event para dos pestañas.

**Lo que falta.**

- **El sobre** (A6): el archivo exportado no dice `app`, `lang` ni `v`. Una copia de italiano se
  restaura en portugués sin aviso.
- **Recordatorio de copia** (A10): nada registra cuándo se exportó por última vez. Con 140 días de
  racha y 120.000 xp el único aviso es un párrafo fijo en Io.
- **Peso y frecuencia del guardado.** Medido con el estado de la semana 21 (477 KB de JSON, 2.264
  fichas, log de 2.500) y CPU ×4: `Engine.save` **18,7 ms**, `Engine.load` 14,8 ms; el estado de la
  semana 52 pesa **879 KB** (4.519 fichas), o sea ~35 ms por guardado en un teléfono modesto.
  `persist()` corre en cada respuesta, en cada tecla del examen (`app.js:4796`), en cada cambio de
  ajuste. En `localStorage` (UTF-16) el veterano ocupa 955 KB en la semana 21 y ~1,8 MB en la 52:
  dentro del límite de 5 MB, pero un solo `setItem` sincrónico de casi 2 MB por respuesta es un
  costo que se nota.
- **Ningún segundo dispositivo.** No hay sincronización ni transferencia: cambiar de teléfono es
  exportar un JSON, mandárselo a uno mismo y restaurarlo. Es coherente con «sin servidor», pero un
  3.0 puede ofrecer al menos un canal opcional (ver 4.5).

### 3.8 Modo oscuro

Funciona y respeta el sistema; el ajuste está duplicado (cabecera e Io) y documentado. Dos cosas:
el botón principal de Rumo C1 a **2,57:1** en oscuro (C4, sin cambios), y el `theme_color` del
manifiesto es uno solo (`#0f4c85`) mientras `boot.js:25-29` tiene un color por idioma y por tema:
la pantalla de inicio de Android cambia de color al abrir.

### 3.9 Accesibilidad

Todo lo de C1-C5 sigue (tabla de la sección 1). Números nuevos medidos en v2.8, Oggi e Io a 390 px:

- **Nombres**: 4 inputs sin `<label>` ni `aria-label` en Io (`#idealtext`, `#aikey`, `#gemkey`,
  `#importfile`), solo `placeholder`.
- **Tamaños**: 5 controles bajo 44 px en Oggi (placa 73×36, 🔊 y ☀️ 34×34, «Ver la semana» y
  «escuchar» 42 de alto), 18 en Io. ✕ de la ronda 39×39.
- **Texto chico**: 38 elementos con menos de 12 px en Io, 4 en Oggi; `.stat span` es **8 px** en
  el teléfono (`it/theme.css:579`, `.5rem`); las etiquetas de la barra inferior 10,88 px a 3,56:1.
- **Estado**: la pestaña activa se marca solo con color (clase `.on`), sin `aria-current`.
- **Foco**: `outline: none` en los campos de texto; sin `:focus-visible` global.
- **Lengua**: `<html lang="es">` fijo; el TTS usa `LG.tts` pero el DOM no lo dice.

### 3.10 Carga y rendimiento

Medido en Chromium con `performance.getEntriesByType("resource")` sobre `?lang=it&test`:

| | it | pt |
|---|---|---|
| Pedidos | 67 | 66 |
| Bytes (sin comprimir = transferidos con `http.server`) | 6.420 KB | 5.777 KB |
| `<script>` | 54 | 54 |
| JS | 2.287 KB en 54 archivos | 2.523 KB |
| JSON (`course`, `bank`, `glossario`, `frequenza`) | 4.057 KB | 3.215 KB |
| Listo (`#pausa`) en local | 1,2 s | 1,2 s |
| Listo en 4G lenta (150 ms, 1,6 Mbps, CPU normal, sin gzip) | **39,9 s** | **37,4 s** |

La auditoría v2.5 midió 17,8 s con gzip y CPU ×4; GitHub Pages comprime, así que el número real está
entre los dos. La causa es la misma: `boot.js` encadena los 54 scripts y los JSON se piden recién
cuando corre `app.js` (`5566-5586`). `course.json` solo pesa **2,34 MB** (it) y `frequenza.json`
924 KB, y se bajan enteros antes de la primera pantalla aunque Oggi use una semana.

Render con CPU ×4 y el estado de la semana 21: Oggi 150 ms, Percorso 284 ms, Leggi 13 ms. El
Percorso recalcula `weekPlan` de las 52 semanas para mostrar «n/m misiones» en cada nodo.

### 3.11 Textos redundantes y señales cruzadas (lista corta)

- Meta diaria en tres lugares (anillo, tarjeta, resultado); racha en dos (cabecera y tabla del
  resultado); versión al pie de Oggi y de Io.
- «Instalala en tu celu» aparece en Oggi mientras no esté instalada, también para quien la abre en
  la computadora, y sin forma de cerrarla.
- «Esta semana» (cuota de palabras) y «Tus últimas 4 semanas» (calendario) usan «semana» con dos
  calendarios (lunes a domingo vs. 28 días).
- Los nombres de las pestañas están en la lengua meta (Oggi, Allena, Leggi, Percorso, Io; Hoje,
  Treino, Ler, Trilha, Eu) y todo lo demás en castellano; «Allena» es la pestaña de frases,
  laboratorio, banco, duelos, escritura guiada y gramática: siete cosas bajo un verbo.
- El jefe se llama «boss», «jefe» y «Chefão/Boss» según la pantalla (`UI.boss`, `UI.Boss`,
  «Vencé al jefe»).
- Tema: «el ☀️/🌙 de arriba también lo cambia» (Io) y el botón del modo oficina cambian de emoji
  sin decir su estado.

---

## 4. Lo que falta para 3.0 (propuestas)

Cada una dice qué hay hoy (verificado), qué falta, por qué y el esfuerzo (S: horas o un día; M: días;
L: semanas).

### 4.1 Onboarding con prueba de nivel · M

**Hoy.** Selector de idioma → Oggi. Test de ubicación completo pero opcional y efímero.

**Propuesta.** Tres pantallas después del selector, una sola vez:

1. **Para qué** (los chips de `LG.why`, que hoy aparecen como tarjeta en Oggi desde el intento 10) y
   **cuánto tiempo por día** (10 / 20 / 30 min, que reemplaza la meta en xp como ajuste principal;
   la meta en xp se deriva).
2. **¿Empezás de cero o ya sabés algo?** → el test de ubicación tal como está, o «semana 1».
3. **Cómo funciona**: una pantalla con la semana (lección → palabras → entrenamiento → texto →
   frases → lectura → dominala) y las cinco pestañas en una frase cada una. Es el `pathLead` que
   hoy está escondido en Percorso.

Después, la **primera sesión guiada**: Oggi con una sola tarjeta («Tu primer paso: Lección 1/5 ·
4 min») y la pausa, la sfida y el ripasso aparecen recién cuando tienen sentido (`known >= 12` ya
se usa así para el Lampo). **Por qué**: hoy la primera pausa da 40-50 % y el test desaparece si se
toca lo equivocado. Reusa `Ubicacion`, `WHY`, `weekPlan`.

### 4.2 «Hoy»: el plan del día por tiempo · M

**Hoy.** Oggi lista nueve entradas y la misión siguiente a 1.425 px; nada dice minutos.

**Propuesta.** Una función pura `Plan.today(course, state, minutes)` (en `js/plan.js`, testeable en
node, como pedía B10) que arme el día:

- entrada fija: el ripasso vencido (cap 20), con su tiempo estimado por tipo de ficha;
- la misión siguiente del `weekPlan` (o dos, si entran);
- relleno según la cuerda floja de `strandsLast` (una lectura corta, una escena);
- estimación de minutos con los segundos por tipo del sim (`SEC`) calibrados con los tiempos reales
  del `log` (ya guarda minutos por repaso: `logReview`).

Oggi pasa a ser: saludo → **«Hoy: 22 min · Ripasso 20 (6′) · Lección 2/3 (8′) · Lectura larga
(8′)»** con un botón «Empezar» que encadena las tres cosas (la infraestructura de encadenar existe:
`round.from`, `missionCheck`, `nextMission`) → un selector «tengo 5 / 15 / 30 minutos» que rearma
el plan → todo lo demás (pausa, lampi, clínica, frase, calendario) plegado bajo «Más». Las tarjetas
de hábito se muestran una por día como máximo y se pueden posponer. **Por qué**: es la diferencia
entre una app que ofrece y una que guía; y es lo que justifica el 3.0 más que cualquier otra cosa.

### 4.3 Progreso significativo, no solo xp · M

**Hoy.** Hay mucho dato bueno y disperso: nivel/rango (Io), estrellas (Percorso), cobertura léxica
por nivel MCER (Io → Tu vocabulario, `Freq.coverage`), memoria (fichas por estado, probabilidad de
recuerdo, curva de olvido), cuatro cuerdas (7 días), errores por categoría y cuaderno itañol,
récords, lectura (palabras y minutos), medallas (27). Nada de eso está en el tiempo: no hay «cómo
venías hace un mes».

**Propuesta.** Una pantalla **Progreso** (puede reemplazar la mitad de Io) con cuatro cosas que un
alumno entiende:

1. **Nivel estimado** (A1 → C1) con la fecha prevista de cada jefe al ritmo actual (semanas por
   semana: `weekStats`, `read`, `days`);
2. **Palabras que sabés** por banda de frecuencia, como serie mensual (guardar un punto por semana
   en `state.history`, 52 puntos × 6 números: nada);
3. **Horas de estudio** por semana y por destreza (input/output/forma/fluidez), a partir de `days`,
   `log` y los minutos de escucha y lectura que ya se anotan (`noteListening`, `Biblioteca`);
4. **Lo que más te cuesta** (`errs`) con tendencia (hoy solo tiene `n`, `fixed` y `last`).

Sacar de Io todo lo que no es progreso ni ajuste: créditos de voces, «Oraciones grabadas», test de
ubicación (a onboarding y a un botón), medallas a una hoja plegada (hoy 3.500 px de 9.471).
**Por qué**: la motivación por competencia (Deci & Ryan) necesita ver competencia, no xp; y una Io de
950 palabras no la lee nadie.

### 4.4 Objetivos y ritmo · S–M

**Hoy.** Meta en xp (100/200/350/500), cuota de palabras automática (mal calibrada, 3.2), «yo ideal»
y cierre semanal.

**Propuesta.** Reemplazar la meta en xp por **minutos por día y días por semana** (la racha semanal
de 3 días ya existe: `weekStreak`); derivar de ahí la fecha estimada de llegada a C1 y mostrarla
(«a este ritmo, C1 en octubre de 2027»); recalibrar `subGoals` con lo que el curso enseña de verdad
por semana (9-20 palabras + Parole) y no con la meta del trimestre dividida. Mantener xp como
moneda de juego, no como objetivo.

### 4.5 Respaldo automático y segundo dispositivo · S (sobre) / M (canal)

**Hoy.** Exportar/importar manual; sin sobre, sin recordatorio, sin sincronización.

**Propuesta, en tres escalones que no rompen «sin servidor»:**

1. **Sobre e importación segura** (A6, S): `{app: "c1", lang, v: APP_VERSION, at, save}`; importar
   por `Engine.fromRaw` (migraciones, `SAVE.load`, sanitize, `clearPending`); rechazar otro idioma
   con un mensaje claro, ofrecer «restaurarlo en Rumo C1».
2. **Copia automática local** (S): `state.exportedAt`; cada 14 días, o cuando
   `navigator.storage.persisted()` da `false`, una tarjeta en Oggi «Hace 20 días que no guardás una
   copia · Guardar ahora» (un toque, hoja de compartir). En Android con la File System Access API se
   puede pedir una carpeta una vez y escribir la copia sola en cada cierre de sesión (`showDirectoryPicker`
   + permiso persistente; en iOS no está: se avisa).
3. **Canal opcional para otro dispositivo** (M): el alumno pega un token propio y la app sube el
   sobre a un lugar suyo (un Gist de GitHub o un archivo en un WebDAV/Drive): la misma lógica de
   «clave propia» que ya usa la IA (`aiKeys`). Al abrir en otro teléfono con el mismo token, baja el
   más nuevo. Resolución de conflictos por `at` y con confirmación. Sigue sin servidor de la app.
   Alternativa mínima: **transferir por QR** entre dos teléfonos (el estado comprimido no entra en
   un QR, pero un enlace temporal a un blob sí; o varios QR); mucho menos útil.

### 4.6 Post-curso: modo mantenimiento · M

**Hoy.** Después de la semana 52, nada cambia (3.5).

**Propuesta.** Al aprobar el examen, `state.phase = "mantenimiento"` y:

- Oggi cambia de eje: **ripasso de mantenimiento** (la cola FSRS a meses ya existe, con tope de 6
  por día), **lectura extensiva** (Biblioteca y lecturas largas, con la cobertura por semana que ya
  calcula `build_biblioteca`), **escuchas largas** en bucle (`Ascolto facile` existe), **tareas de
  escritura** al azar entre las 25 del tramo con revisión local, **simulacros** del examen
  (con 3-4 versiones, que es lo que pedía A2);
- un **cierre del año**: pantalla con las horas, las palabras, los jefes y el resultado del examen,
  compartible (`shareCard` ya dibuja un PNG);
- **certificado local**: un PDF/PNG «completó La Via C1: 129 h, 4.500 fichas, examen 72 %», sin
  pretender valor oficial; ocultar la cuota de palabras y el «Siguiente: Repaso».

### 4.7 Notificaciones y atajos · S–M

**Hoy.** `.ics` diario (bueno, sin servidor), badge con fichas vencidas, dos atajos del manifiesto.
No hay Notification API ni push (necesitaría servidor).

**Propuesta.** Sin servidor se puede: (a) **notificación local** con `Notification` +
`registration.showNotification` disparada por el SW cuando la app está abierta o al recibir
`periodicsync` (Chrome Android, con la app instalada); (b) un **atajo «Hoy»** que abra directo el
plan del día (`#hoy`), además de `#pausa` y `#micro`; (c) **widgets**: no hay API web estable;
lo más cercano es el badge (ya está) y los atajos. Es honesto decir que el recordatorio robusto
sigue siendo el `.ics`, y mejorarlo: que el evento lleve la hora que el alumno eligió en el
onboarding y un enlace `#hoy`.

### 4.8 Rendimiento de la carga · S–M

**Hoy.** A3 tal cual: 54 scripts en cadena, JSON tarde, SW con `cache: "reload"`.

**Propuesta** (la de v2.5, sigue vigente): `s.async = false` para los 54 (bajan en paralelo,
corren en orden); `<link rel="preload">` de `course.json` y `bank.json` desde `boot.js`;
`cache: "default"` en la primera instalación; un manifiesto de hashes para no rebajar 6 MB en
cada versión. Y una nueva: **partir `course.json` por estación** (4 archivos de ~600 KB) o al
menos sacar de la primera carga `frequenza.json` (924 KB, solo se usa en Io y Parole) y
`glossario.json` (114 KB, ya es opcional). Objetivo medible: Oggi usable en menos de 8 s en 4G
lenta con gzip, y menos de 1 MB antes de la primera pantalla.

### 4.9 Robustez del guardado · M

**Hoy.** Un `localStorage.setItem` del estado entero por respuesta (3.7); A1, A5, A7, A8, A10
abiertos o a medias.

**Propuesta.**

- **Guardado diferido y parcial**: `persist()` con `requestIdleCallback`/`setTimeout(0)` y
  coalescencia (un guardado por segundo como máximo), más `flush` en `visibilitychange` y
  `pagehide`; separar el `log` (2.500 filas, el bloque más grande) y las `cards` en claves propias
  para no reescribir 900 KB por un xp. Con IndexedDB se puede guardar por ficha; es más trabajo (M)
  pero es lo que escala hasta las 4.500 fichas de la semana 52.
- **A1**: `savePending()` al final de `settle()`.
- **A5**: pantalla de rescate con «Descargar mis datos» y aviso del `.damaged`.
- **A7**: aviso «Hay una versión nueva · Actualizar» fuera de las pantallas seguras; borrador del
  dictogloss en `sessionStorage`.
- **A8**: `state.logTotal`.
- **A10**: `due` al inicio del día local; debounce en el examen.
- **Contador de integridad**: guardar `savedAt` y un hash corto; al cargar, si el hash no coincide,
  avisar y ofrecer la copia.

### 4.10 Pantallas-catálogo: Leggi, Allena, Io, Percorso · M

**Hoy.** Leggi 14.051 px / 136 botones con 7 secciones (Biblioteca, Martín, Cultura, La settimana
con 52 tarjetas, Letture lunghe con 25, Inondazioni, Ascolti lunghi); Allena 7.189 px / 43 botones
con 7 secciones; Io 9.471 px; Percorso 7.794 px.

**Propuesta.** Un patrón común: **cabecera con pestañas internas o acordeón** (Leggi: «Para hoy ·
Historias · La settimana · Largas · Biblioteca»), listas plegadas por estación con la semana actual
abierta, y «lo de esta semana» arriba en cada pestaña (Leggi ya sabe cuál es la lectura de la
semana: `readingWeek`; Allena sabe la escena: `Drills.scenesOfWeek`). Percorso: abrir en el nodo
actual, botón flotante «mi semana», y calcular «n/m misiones» solo para las semanas abiertas (o
cachearlo por semana) para bajar los 284 ms.

### 4.11 Accesibilidad y presentación · S–M

Todo lo de C1-C5 con su arreglo ya escrito, más: `aria-current="page"` en la barra; `aria-pressed`
y `aria-label` en 🔊/☀️ («Modo oficina: activado»); nodos del Percorso con «Semana 7: Numeri, date e
ora, 2 de 3 estrellas»; helper `t(txt)` que envuelva en `<span lang="it">` y se use en `renderText`,
`frasi`, la corrección y el glosario; 44 px en cabecera, ✕, chips y checkbox; `.stat span` mínimo
11 px; `<label>` para los cuatro inputs de Io; `:focus-visible` global; `.shake` y `.ep-timer.low`
en la regla de movimiento reducido; `max-width: 100%` en `select#goal`; `id`, `screenshots` y
`theme_color` por idioma en el manifiesto (o generarlo por idioma: `manifest-it.webmanifest`).
Contraste: `#c2401c` para el botón de Rumo C1 como propuso v2.5.

### 4.12 i18n de la interfaz · L (y baja prioridad)

**Hoy.** La interfaz está en castellano rioplatense, escrita a mano dentro de `app.js` (≈5.600 líneas
con las cadenas mezcladas con la lógica) y de cada módulo; `LANG.ui` (`lang.js`, ~60 claves) solo
tiene lo que cambia entre idiomas (pestañas, nombres de secciones, saludos). No hay catálogo de
cadenas ni plural/género parametrizado.

**Propuesta.** Para 3.0 alcanza con **una decisión**: si el público sigue siendo rioplatense, no
hacer i18n y sí unificar el tono (voseo consistente: hay «Elegí», «Practicá», pero también
«Podés hacerlas» junto a textos neutros como «Contestá tu primera pregunta» que están bien, y
etiquetas en inglés en el código como `Siguiente`/`next`). Si se quiere abrir a otros
hispanohablantes (castellano neutro o de España), extraer las ~600 cadenas a `js/strings.js` con
una función `t()` es trabajo L y conviene hacerlo junto con la partición de `app.js` (B10).

---

## 5. Lo que no se pudo probar

- **Instalación real** (Android/iOS): `beforeinstallprompt`, la persistencia de 7 días de Safari, el
  badge y los atajos se leyeron en el código, no en un teléfono.
- **Audio**: Chromium headless no tiene voces; el TTS, las voces reales y Common Voice no se
  escucharon. Las pantallas que dependen de audio (Suoni, dictogloss, escucha larga) se capturaron
  sin reproducir.
- **La IA**: sin claves, no se probó Parla ni la corrección con IA; A9 se verificó solo en el código.
- **Biblioteca**: el lector y el reloj de página (A10) no se abrieron.
- **Actualización de versión** (A7): no se simuló un cambio de `VERSION` en el SW.
- **La carga con gzip** como la sirve GitHub Pages: `http.server` no comprime; el número real de 4G
  está entre los 17,8 s de v2.5 y los 40 s de acá.
- **El estado veterano es simulado**: el sim juega todas las misiones y no falla como una persona;
  sirve para ver las pantallas con datos, no para juzgar la calibración fina (por ejemplo, la cola
  de 943 vencidas que aparece en `it-30` es un artefacto de desplazar las fechas).

---

## Anexo A. Cómo se midió

- `tour.js`: por idioma, carga (`performance.getEntriesByType("resource")`, `document.scripts`),
  4G lenta con `Network.emulateNetworkConditions` (150 ms, 1,6 Mbps), primer arranque desde el
  selector, test de ubicación, misión siguiente, Percorso, semana 1, pausa jugada hasta el resultado
  (respondiendo con `window.__test.item()`), Allena, Leggi, lectura, Io, export (descarga
  interceptada), a11y (`getBoundingClientRect`, `[lang]`, `[aria-current]`, fuentes < 12 px), barra
  inferior, examen (semana 52), tramo (semana 30), jefe (semana 13), cambio de idioma; después, con
  el estado veterano: Oggi, Percorso, semana 21, Io, ripasso, vuelta tras 9 días, fin del curso,
  modo oscuro, 320 px, guardado dañado.
- `tour2.js`: posición de cada bloque de Oggi, tamaños en la ronda, capturas por tramos de
  Leggi/Allena/Io, contraste (luminancia relativa WCAG sobre `getComputedStyle`).
- `tour3.js`: `Engine.save`/`Engine.load` ×20 y render de cada pestaña con CPU ×4
  (`Emulation.setCPUThrottlingRate`).
- `sim_it.js` / `sim_pt.js`: copia de `tools/<código>/sim_carriera.js` con `MAXW` y `DUMP` para
  parar en la semana 20 (o 52) y volcar el estado. `sim_it_full.log`: la corrida original de 52
  semanas (minutos por semana, 129 horas).
- Estados: `state_it_w20.json` (477 KB), `state_pt_w20.json` (364 KB), `state_it_w52.json`
  (879 KB).

## Anexo B. Capturas (scratchpad/shots/, 390×844 @2x salvo indicación)

| Archivo | Qué muestra |
|---|---|
| `00-selector` | El selector de idioma |
| `it-01-oggi-nuevo`, `pt-01-oggi-nuevo` | Oggi/Hoje de un alumno nuevo, página entera |
| `it-02-ubicacion-intro`, `it-03-ubicacion-pregunta` (y pt) | El test de ubicación |
| `it-05-leccion-paso1`, `it-06-leccion-paso2` (y pt) | La lección 1/5 desde «▶︎» |
| `it-07-percorso`, `it-07-percorso-full` (y pt) | Percorso, viewport y entero (7.794 px) |
| `it-08-semana1` (y pt) | Briefing de la semana 1, 14/15 misiones |
| `it-09-ronda`, `it-10-ronda-feedback`, `it-11-resultado` (y pt) | Una pausa: pregunta, corrección, resultado |
| `it-12-oggi-tras-ronda` | Oggi después de la primera ronda |
| `it-13-allena`, `it-14-leggi`, `it-16-io` (y pt) | Las tres pestañas enteras (7.189 / 14.051 / 9.471 px) |
| `it-15-lectura` (y pt) | Una lectura con karaoke |
| `it-17-semana52`, `it-18-examen` (y pt) | La semana 52 y el examen C1 |
| `it-19-semana30`, `it-20-tramo-escucha`, `it-21-tramo-tarea` (y pt) | El tramo C1: briefing, escucha larga, tarea |
| `it-22-semana13-jefe` (y pt) | La semana del jefe |
| `it-23-cambiado` (y pt) | Después de cambiar de idioma |
| `it-30-oggi-veterano`, `it-30-oggi-veterano-viewport` (y pt) | Oggi del alumno de la semana 21: la misión a 1.425 px |
| `it-31-percorso-veterano`, `it-31b-percorso-veterano-actual` (y pt) | Percorso al entrar (arriba) y el nodo actual (3.545 px) |
| `it-32-semana21-veterano`, `it-33-io-veterano`, `it-34-ripasso-veterano` (y pt) | La semana, Io y el ripasso con datos |
| `it-40-vuelta-9dias` (y pt) | La vuelta: «140 🔥» y «Volviste después de 9 días» juntos |
| `it-50-fin-curso`, `it-51-fin-curso-percorso` (y pt) | Después de aprobar la semana 52 |
| `it-60-oggi-oscuro`, `it-61-ronda-oscuro` (y pt) | Modo oscuro |
| `it-62-io-320` (y pt) | Io a 320 px (scroll horizontal) |
| `it-70-leccion-veterano`, `it-71-ronda-escribir` (y pt) | Lección y ronda del veterano |
| `it-72-leggi-0..5`, `it-72-allena-0..4`, `it-72-io-0..5` (y pt) | Leggi, Allena e Io por pantallas |

## Anexo C. Minutos por semana según la simulación (it)

Semanas 1-13: 109-165 min (mediana 137). 14-26: 130-170 (146). 27-39: 128-169 (145). 40-52:
136-**223** (154); las más largas son la 42 (223), 50 (218), 49 (190) y 51 (184). Total 129 horas en
364 días: **21 minutos por día**, todos los días. La app no le dice esto al alumno en ningún lugar.
