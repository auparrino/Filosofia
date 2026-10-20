# Auditoría del núcleo del aprendizaje (v2.8): el modelo del alumno y lo que falta para un 3.0

Rama actual sobre `main` en v2.8 (merge del PR #55). Solo lectura: no se cambió código, contenido ni
datos. Las mediciones se hicieron en node con `tools/lib/pack.js`, con las dos simulaciones oficiales
(`tools/it/sim_carriera.js`, `tools/pt/sim_carriera.js`) y con un script propio en el scratchpad
(`A_medidas.js`, una copia instrumentada de la simulación que registra cada respuesta con su fuente, su
tipo, si fue reconocimiento o producción, la semana de su lección y la semana en curso; sus salidas
están en `A_medidas_it.json` y `A_medidas_pt.json`).

Frente: `js/engine.js`, `js/drills.js`, `js/lezione.js`, `js/banca.js`, `js/frasi.js`, `js/lab.js`,
`js/duelli.js` y, en `js/app.js`, las misiones, el percorso, `settle`, el briefing, el jefe y Oggi.

**Fuera de alcance, a pedido:** todo lo que usa la voz del alumno. Escuchar audio y la voz del teléfono sí
entran.

**Una advertencia sobre la simulación.** El alumno simulado acierta con probabilidad fija (90 % en
opciones, 80 % escribiendo) y no aprende ni olvida: sirve para medir carga, cobertura y colas, no para
medir cuánto se aprende. Todo lo que abajo dice «en la simulación» hay que leerlo así.

---

## Resumen: las 10 principales

| # | Prioridad | Qué | Dónde | Esfuerzo |
|---|---|---|---|---|
| 1 | Alta | La app mide señales que después no usa: tiempo de respuesta, confianza, precisión de la lección, velocidad de olvido (congelada a los 2.500 repasos), cierre semanal | `engine.js:196`, `370`, `app.js:2558`, `1510` | S–M |
| 2 | Alta | Nada del percorso se adapta a la persona: la ronda, las palabras, la escena, la lectura y la lección son las mismas para todos; lo único adaptativo es el jefe (con una clave equivocada) y la Clínica | `drills.js` `buildRound`, `app.js` `weekPlan` | M–L |
| 3 | Alta | La gramática vuelve en producción solo como la misma oración en el repaso: ~1,2 producciones por ejercicio en el resto del año (it), 0,7 (pt); el 36 % (it) y el 50 % (pt) de los ejercicios no se vuelven a escribir nunca después de su mes | medido con `A_medidas.js` | M |
| 4 | Alta | El jefe no mide lo que dice medir: «ascolto» tiene 0-1 ítems de 500, «lettura» es opción múltiple de gramática, el 20 % de frases nuevas no cuenta y la ponderación por semana floja usa una clave que no coincide | `drills.js:728-770`, `app.js:3193-3205` | M |
| 5 | Alta | El input real es mínimo hasta la semana 26: 168 palabras leídas y 59 escuchadas por semana (it) contra 2,5 horas de ejercicios; recién el tramo C1 lo multiplica por cinco | medido | M |
| 6 | Alta | Las misiones se cumplen por exposición, no por dominio: de 9 a 13 misiones por semana, solo Dominala (no obligatoria), el duelo (opcional) y la tarea del tramo tienen un umbral; la semana siguiente se abre sin ninguno | `app.js:1543-1667`, `1676-1686` | S–M |
| 7 | Alta | La xp premia volumen y facilidad: un acierto de opción múltiple vale lo mismo que una traducción escrita, y el 90 % de la xp del año sale de rondas y repaso; la lectura y Scrivi juntas, 5,5 % | `engine.js:532-540`, medido | S |
| 8 | Media | El plan del día no existe: Oggi ofrece la próxima misión y tres botones sueltos; nada arma una sesión según el tiempo que hay, ni mezcla repaso + lección + input + output | `app.js:436-580` | M |
| 9 | Media | La prueba de ubicación abre semanas pero no le cuenta nada al repaso: quien entra en la 20 no tiene ficha de ninguna palabra, frase ni regla de las 19 anteriores | `ubicacion.js:169-179` | S–M |
| 10 | Media | No hay modo mantenimiento ni objetivos personales con efecto: después del examen la app no cambia, y «tu meta» es un texto que no altera nada | `engine.js` `subGoals`, `app.js` `oggiHabitCards` | M |

**Orden sugerido.** Primero lo que ya está medido y no se usa (1, 9 y los arreglos S de la sección F),
porque abren la puerta a todo lo demás. Después el jefe (4) y las misiones con umbral (6), que cambian
qué significa «pasar de semana». Después el plan diario (8) con el input contado (5), que es lo que más
se nota en el uso. La gramática en producción a largo plazo (3) y la adaptatividad de la ronda (2) son
los cambios de fondo del 3.0 y conviene hacerlos con el simulador extendido (apéndice).

---

## A. El modelo del alumno: qué sabe la app y qué hace con eso

Lo reconstruí leyendo `baseSave()` (`engine.js:546-580`), quién escribe cada campo y quién lo lee.

| Campo | Quién lo escribe | Quién lo lee | Cambia algo |
|---|---|---|---|
| `cards` (ficha FSRS por ítem: s, d, due, reps, lapses, state) | `settle` → `Engine.schedule` | `dueList`, `pickFresh`, `weakness`, `vocabSession`, `sceneSession`, `Frasi.progress` | Sí: el orden de la cola y de la ronda, qué se pregunta primero |
| `log` (últimos 2.500 repasos: id, minuto, nota, días, s, tipo) | `schedule` | `fitSpeed` | Sí: `speed.v` y `speed.g` escalan la estabilidad |
| `speed` | `maybeFit` | `schedule` | Sí, pero **congelado** (ver F1) |
| `errs` / `errLog` (perfil de errores por categoría) | `recordError` (`app.js:2530`), Scrivi (`5064`) | `Banca.weakest`, Clínica, Oggi, Io, `Referencia` | Sí: la Clínica arma 12 ejercicios; Oggi sugiere |
| `weekStats` (intentos, aciertos, `last` 30, `prodDays`, `dominated`, `bossPassed`) | `settle`, `finishRound`, `noteProduction` | estrellas, `mastered`, el jefe (`accOf`), `Referencia` | Sí: estrellas; el jefe pregunta más de la semana floja (con clave equivocada, ver E4) |
| `lessonScore` (% de chequeos de la lección) | `app.js:1510` | **nadie** | No |
| `conf` (seguro / creo / adivino) | **nadie** (`noteConfidence` no se llama fuera de `engine.js`) | `calibration` (nadie) | No |
| tiempo de respuesta (`took`, `app.js:2558`) | `settle` | `rightParts` → `Devolucion.unsure` (una etiqueta «inseguro» en la devolución) | No: nunca llega a `ratingFor` (`fast` no se pasa) |
| `strands` (input/output/forma/fluidez por día) | `addStrand` | Oggi («te falta input»), tarjeta de la semana | Solo un consejo de texto |
| `sessions`, `days`, `streak`, `shields` | `noteSession`, `addXp`, `touchStreak` | Oggi, récords, racha semanal | Sí: racha, cofre, meta |
| `retention` | Io, y «volví, era difícil» (`app.js:690`) | `schedule` | Sí |
| `pauses` (por qué faltaste) | `wireHabit` | solo `dificil` → retention 85 % | Casi no |
| `reflect` (cierre semanal: qué costó, qué cambiás, cuándo) | Oggi | Oggi la semana siguiente («dijiste más escucha: llevás X») | Solo un recordatorio |
| `ideal`, `plan`, `goals` | Io / Oggi | Io, tarjeta | No |
| `records`, `best` | `finishRound`, Lampo | pantalla de resultado | No |
| `porque` (autoexplicaciones) | `porque.js:444` | Io | No |
| `ubicacion` | `Ubicacion.apply` | banner | No: solo abre semanas |
| `read`, `readSess`, `readParts`, `scritti`, `letture`, `suoniDone`, `dictogloss`, `duelli`, `tramo`, `escritos` | cada módulo | `weekPlan` (misión hecha / no hecha) | Sí: el avance del percorso |

**Lo que la app sabe y no usa (medido).**

- **Tiempo de respuesta.** Se mide en cada pregunta (`round.shownAt`, `app.js:5089`; `took`, `2558`) y
  solo sirve para poner «inseguro» en la devolución (`devolucion.js:422-435`). `ratingFor` (`engine.js:196`)
  ya sabe convertir `fast` + `conf` en *Easy*, y `test_memoria.js:31-32` lo prueba, pero `settle` no le
  pasa ni `fast` ni `conf`. Es la propuesta 2 de `PROPUESTAS.md`, marcada pendiente desde v2.5, y está a
  un campo de distancia.
- **Confianza.** `noteConfidence`, `calibration` y la hipercorrección (`card.hyper`, `engine.js:276`,
  que exige `conf === "seguro"`) existen y están probados, pero ninguna pantalla pregunta «¿seguro?».
  `grep` de `conf:` y `noteConfidence` en `docs/js/*.js` y `docs/lang/*/*.js`: cero llamadas fuera de
  `engine.js`. La sección del README «FSRS, confianza y mantenimiento» describe algo que no está.
- **Precisión de la lección.** `lessonScore` se guarda (`app.js:1510`) y no se lee en ningún archivo. Un
  chequeo fallado en la lección no entra al repaso, no cambia la ronda ni la parte que se entrena.
- **Velocidad de olvido.** `maybeFit` (`engine.js:342-348`) reajusta cuando `log.length − speed.n ≥ 200`,
  y `log` se recorta a 2.500. En la simulación, `speed.n` queda en 2.500 en las dos lenguas y no vuelve a
  ajustar en los ~19.000 repasos siguientes. Es A8 de la auditoría anterior, sigue abierto.
- **Cierre semanal.** «Qué cambiás» (más escucha, más escritura…) se guarda en `reflect` y la semana
  siguiente Oggi dice «dijiste más escucha: llevás X xp de input» (`app.js:633-640`). No cambia la pausa,
  la ronda ni las misiones.
- **Las cuerdas.** `strandsLast` alimenta un consejo de una línea. Ningún constructor de sesión
  (`buildPausa`, `buildRound`, `buildReview`) mira las cuerdas.

**Lo que no se adapta (verificado en `drills.js` y `weekPlan`).**

- La ronda de la semana (`buildRound`, `drills.js:602-663`) toma los ítems de la semana con `pickFresh`
  (no vistos → vencidos → los más viejos), dos de arrastre y el gimnasio según `gymShare`. No hay
  parámetro de dificultad por ítem ni por alumno, no cambia el tamaño (12 fijo), no cambia la proporción
  reconocimiento/producción según cómo va, no evita los tipos donde el alumno falla ni insiste en ellos.
  Lo único que depende del alumno es el orden.
- El percorso (`weekPlan`, `app.js:1543-1667`) es idéntico para todos: mismas misiones, mismo orden,
  mismas cantidades. El perfil de errores no toca la semana siguiente; solo la Clínica, que no es misión y
  hay que ir a buscarla en Oggi o Allena.
- Las palabras de la semana (`vocabSession`) son las 12 o 20 fijas de `course.json`, más hasta cuatro
  vencidas. No se filtra lo que el alumno ya sabe (una palabra frecuente ya vista en el banco vuelve como
  nueva), no se agregan las que le faltan según `Freq.coverage` (eso vive en un botón aparte, `b-freq`).
- Lo adaptativo de verdad: el jefe (`buildBoss`, turnos extra para las semanas flojas y lo fallado primero),
  «Tus puntos débiles» (`buildWeak`), la Clínica (`clinicaSession`), la cola de repaso (FSRS) y el corte por
  fatiga (`fatigued`, `app.js:1959-1963`). Es un buen esqueleto; le falta todo lo que va entre medio.

---

## B. Lo que dicen las simulaciones (v2.8)

`node tools/it/sim_carriera.js` (14 s) y `node tools/pt/sim_carriera.js`; salidas completas en
`sim_it.txt` y `sim_pt.txt`.

| | Italiano | Portugués |
|---|---|---|
| Horas en el año (misiones + pausa y repaso diarios) | 129 | 116 |
| Minutos por semana (mín / mediana / máx) | 105 / ~146 / 203 | 91 / ~134 / 180 |
| Fichas al final | 4.580 | 3.865 |
| Cola de repaso: máximo del año / al final | **596** / 263 | 239 / 216 |
| Ítems del curso servidos / totales | 3.255 / 3.716 | 2.271 / 2.464 |
| Nunca servidos (y tampoco en una sfida) | 461 (411) | 193 (193) |
| Palabras practicadas | 709 | 748 |
| Rondas para las 20 correctas | 2-3 por semana | 2-3 por semana |
| Ítems distintos por semana en el entrenamiento (pool de 100-236) | 44-140 | 44-80 |
| Jefes | 1 / 1 / 3 / 1 intentos, 90-97 % | 1 / 1 / 1 / 1, 87-97 % |
| Errores del gimnasio (A10) | 0 | **30** (gerundio, semanas 8, 12, 22, 24, 42): sigue abierto |

Lo que la simulación **no** juega y suma tiempo real: Suoni (13 ítems por semana hasta la 40, unos 3-4
min), dictogloss (68-110 palabras, dos escuchas y reconstrucción: 8-10 min, 47 semanas), duelos (16 ítems),
tramo C1 (lectura de 350-900 palabras, escucha de 250-600 a dos vueltas, tarea de 120-250 palabras: unos
40-50 min por semana de la 27 a la 51), Escritos y Biblioteca. Con eso el año queda en unas **160-170
horas** (unos 25-30 min por día), lejos de las 600-750 del FSI que cita `PROPUESTAS.md`: la app tiene que
elegir muy bien en qué gasta cada minuto, y hoy el 90 % de la xp (proxy del tiempo) se va en ejercicios de
forma (ver C5).

Dos afirmaciones del README que la simulación desmiente:

- «En la simulación del año la cola de ripasso nunca pasa de unas 150 tarjetas» (`README-italiano.md`,
  «El repaso según el error»): el máximo medido es 596 (it) y 239 (pt). El texto es de la época del
  SM-2, igual que «una ficha con cuatro aciertos seguidos se retira», que convive con «Nada se retira» dos
  secciones más arriba.
- «Cada regla es una ficha: la semana cuenta sus días de práctica productiva y la regla se da por
  consolidada a los tres»: `noteProduction` se llama, pero `consolidated` solo lo lee `referencia.js:436`
  para pintar «dominada» en *Mi gramática*. No programa nada.

---

## C. Medidas propias (`A_medidas.js`)

Mismo alumno y mismo recorrido que la simulación oficial, con registro por respuesta. Números del
italiano; el portugués entre paréntesis cuando difiere.

### C1. Reconocimiento y producción por estación

| Estación | Respuestas | Producción (escrita) |
|---|---|---|
| 1 (sem 1-13) | 4.456 | 58 % (53 %) |
| 2 | 4.925 | 60 % (54 %) |
| 3 | 4.891 | 61 % (52 %) |
| 4 | 4.768 | 64 % (56 %) |

La proporción casi no crece con el nivel. Y depende de dónde se juega, no de cómo va el alumno:

| Modo | Respuestas | Producción |
|---|---|---|
| Ronda de la semana («Superá la semana») | 1.728 | **26 %** (27 %) |
| Palabras de la semana | 650 | **8 %** (6 %) |
| Dominala | 2.520 | 75 % (62 %) |
| Repaso | 7.095 | 81 % (73 %) |
| Pausa | 3.485 | 51 % |

La ronda es de reconocimiento porque `firstRecognize` (`drills.js:446-453`) convierte en opción múltiple
todo lo que no tiene ficha, y en la ronda casi todo es nuevo. La estrella «Superá la semana» (20
correctas, `app.js:1583`) se gana entonces con tres cuartas partes de opciones. Está bien reconocer antes
de producir (README, «Reconocer antes de producir»); lo que falta es que la ronda pase a producción
**dentro de la misma semana** cuando el alumno ya reconoce bien, en vez de esperar a la ficha «light» de
16 días (ver C3).

### C2. Cuánto vuelve la gramática en producción

Para cada ejercicio del curso tomé la semana de la lección en la que está listado (no `it.wk`, que es el
mínimo del sillabo: 5.763 de los 6.774 ítems listados tienen `wk` distinto de su semana, ver E4) y conté
las respuestas escritas (no reconocimiento, no segunda vuelta) según cuántas semanas después de esa
lección ocurrieron.

| Distancia | Italiano | Portugués |
|---|---|---|
| Misma semana | 1.802 | 1.599 |
| +1 a +3 semanas | 707 | 435 |
| +4 a +12 | 2.444 | 1.519 |
| +13 o más | 925 | 258 |
| Promedio de producciones a 4+ semanas por semana de gramática (sem 1-38) | **81** | **39** |

Por ejercicio (2.057 ítems de las semanas 1-51 sin sfide; pt: 2.300):

| | Italiano | Portugués |
|---|---|---|
| Nunca servidos | 456 (22 %) | 44 (2 %) |
| Servidos una sola vez | 37 | 111 |
| Dos veces | 875 (43 %) | 1.062 (46 %) |
| Tres o más | 689 (33 %) | 1.083 (47 %) |
| **Nunca escritos** (solo reconocidos) | 563 (27 %) | 924 (40 %) |
| Escritos una vez | 229 | 243 |
| **Nunca escritos 4+ semanas después de su lección** | 748 (36 %) | 1.157 (50 %) |

Así que la gramática sí vuelve a largo plazo, pero **solo como la misma oración** en la cola FSRS, y en
promedio 1,2 veces (it) o 0,7 (pt) por ejercicio en lo que queda del año. No vuelve como oración nueva
(las «novel» solo existen en el jefe y no cuentan), no vuelve como Variación (opcional), y Scrivi pide
las estructuras de **su** semana: `Scrivi.TASKS[w].use` nunca pide una del mes pasado. El repaso de
gramática en producción es el punto 3 del resumen.

### C3. La trayectoria de una ficha

`Engine.schedule` con las notas que da `settle`:

- **Un ejercicio de la semana, acertado a la primera** (como reconocimiento, porque es la primera vez):
  `light` → nota 4 (*Easy*, `ratingFor`, `engine.js:196-208`) → **16 días** → si sale bien (ahora escrito), s
  = 60,7 → **mantenimiento** → 61 → 207 → 636 días. En un año: reconocido una vez, escrito una o dos.
  La nota *Easy* se da a un acierto de **opción múltiple**: un alumno que reconoce «abitiamo» entre
  cuatro opciones queda programado como si lo hubiera producido con soltura.
- **Una palabra** (nota 3, *Good*): 3 → 11 → 35 → 101 (mantenimiento) → 269 días.
- Fichas al final del año: 4.636, de las que **4.113 (89 %) en mantenimiento**; mediana del intervalo 118
  días (pt: 3.887, 88 %, 94 días). La cola de un día, por fuente: curso 59 %, palabras 22 %, frases 11 %.
- Fichas «light» creadas: 2.631 en el año. Son el grueso de la cola, y son la mitad de las respuestas de
  producción a largo plazo de C2.

### C4. Cuánto input recibe

Palabras de las lecturas de la semana (settimana, Martín, cultura, lunga) y de las escuchas (dictogloss,
escucha larga), por semana:

| Semanas | Leídas / semana | Escuchadas / semana |
|---|---|---|
| 1-26 (it) | **168** | **59** |
| 27-51 (it) | 792 | 490 |
| 1-26 (pt) | 242 | 63 |
| 27-51 (pt) | 996 | 492 |

En la primera mitad, con 2,3-2,5 horas semanales de práctica, el input real son dos o tres minutos. Las
frases suman 1.608 palabras en todo el año. Del lado del output: Scrivi pide 1.845 palabras en el año y
las tareas del tramo 4.440; los ejercicios escritos suman unas 31.500 «palabras-respuesta» (casi todas de
una o dos palabras). Biblioteca, *Ascolto facile* y las lecturas de cultura son opcionales y no entran en
ninguna meta: no las cuenta la simulación ni las pide el percorso.

### C5. De dónde sale la xp

312.000 xp en el año (it): repaso 38 %, pausa 18 %, Dominala 15 %, ronda 10 %, sfide 9 %, lecturas 4,5 %,
palabras 4 %, Scrivi 1 %, lecciones 0,5 %. Los cuatro primeros (ejercicios de forma, en su mayoría fichas
que vuelven) son el 81 %; leer y escribir libre, 5,5 %. `xpFor` (`engine.js:532-540`) paga lo mismo (10 +
combo) por un acierto de opción múltiple que por una traducción escrita; solo la segunda vuelta paga la
mitad. Scrivi paga 40 + palabras/5 (tope 40) + 20 si no hay errores (`app.js:5068`), una vez; la lectura,
20 fijos; la escucha, 1 xp cada 10 segundos con tope de 30 por día (`app.js:4204`).

### C6. El jefe, por dentro

20 armados de cada jefe con `buildBoss` (sin `firstRecognize`, como `app.js:1809`), clasificados como lo
hace `renderRisultato` (`app.js:3193-3205`):

| Jefe (it) | ítems | gimnasio | nuevas (no cuentan) | «ascolto» | «lettura» | «strutture» | «produzione» |
|---|---|---|---|---|---|---|---|
| 13 | 600 | 100 | 100 | 1 | 37 | 367 | 95 |
| 26 | 600 | 100 | 100 | 1 | 45 | 342 | 112 |
| 39 | 600 | 100 | 100 | 0 | 80 | 354 | **66** |
| 52 | 960 | 160 | 160 | 0 | 110 | 511 | 179 |

(pt: ascolto 2-25, lettura 94-195, produzione 67-167.) «Lettura» es `type === "choice" && !recog`: los
ítems de opción múltiple de gramática. No hay ninguna pregunta sobre un texto ni sobre un audio en
ningún jefe, aunque el tramo tiene 25 lecturas y 25 escuchas largas con preguntas hechas.

---

## D. Lo que ya está bien (y conviene no romper)

Verificado en el código, no solo en el README:

- **FSRS bien implementado** (`engine.js:157-300`): parámetros v5, retención elegible, mantenimiento con tope
  diario (`MAINT_A_DAY`, `drills.js:837`), noche → mañana, un error vuelve mañana, deslices no penalizan,
  registro de repasos, ajuste de velocidad por tipo con log-loss (`fitSpeed`). `test_memoria.js` lo cubre.
- **Corrección por diagnóstico, pistas antes que respuestas, segunda vuelta más fácil** (`settle`,
  `retryVersion`, `showPrompt`), perfil de errores y Clínica que arma sesiones por categoría con `CURE`
  (`banca.js:401-432`). Los errores de Scrivi sí entran al perfil (`app.js:5064`): hay una transferencia
  real, aunque por categoría y no por ítem.
- **Reconocer antes de producir**, con distractores que prueban la regla (`recognitionOf`, `wordVariants`).
- **Dominala** mide producción de verdad: escrito se escribe, cuenta la primera respuesta, 85 %
  (`buildDomina`, `finishRound` `app.js:3069-3081`).
- **El jefe generaliza**: 20 % de oraciones nunca vistas informadas aparte (`novelItems`), turnos extra para
  las semanas flojas y lo fallado primero. La intención es correcta; la ejecución tiene los problemas de E4.
- **Autoexplicación** («¿Qué tenía de malo?», `porque.js`) y «¿qué te lo dijo?» en los duelos: metacognición
  de un toque, con investigación detrás.
- **Prueba de ubicación adaptativa** (`ubicacion.js`): modelo logístico con adivinanza y descuido, «No sé»,
  parada por incertidumbre. Propuesta 4 hecha.
- **Fluidez**: Lampo, *Parola o no?*, 4/3/2 escrito (`escritura_plus.js`), y **Variaciones** de frase con el
  conjugador (`variaciones.js`): el marco con huecos, no la frase de memoria.
- **Reformulación** con tarjetas `ep:` (`escritura_plus.js`): el alumno busca las diferencias y lo que
  encuentra va al repaso. Es el mejor ejemplo de transferencia entre módulos que tiene la app.
- **C-test y cloze racional sobre textos ya leídos** (`ctest.js`), «Ordená el texto»: producción sobre input
  conocido.
- **Mi gramática** (`referencia.js`): un estado por construcción (vista / practicada / dominada) armado con
  las fichas, el banco y el registro de errores. Es un modelo de la regla, ya calculado; falta que programe.
- **Hábito**: regreso sin deuda (`ritornoItems`), «Ripasso 2 min» desde el ícono, corte por fatiga, meta
  a la mitad el fin de semana, racha semanal, récords personales, cierre semanal.
- **Tramo C1** con revisión local que no se engaña con relleno (`Tramo.evaluate`), y glosas de opción
  múltiple en las lecturas (propuesta 6 hecha).

---

## E. Lo que falta para un 3.0

### E1. Usar lo que ya se mide: tiempo, confianza, lección · ALTA · S–M

**Evidencia.** Sección A: `took` se descarta, `conf` nunca se pregunta, `lessonScore` no se lee,
`speed` se congela (`A_medidas`: `speed.n = 2500` en las dos lenguas al terminar el año).

**Qué.**

1. Pasar `fast` a `Engine.schedule` desde `settle`: `fast = took < Devolucion.slowAfter(it) / 2` (ya existe
   la referencia de «lento» por ítem, `devolucion.js:422-430`), y guardar `took` en el registro (`log`) como
   séptimo campo. Correcto y lento → *Hard*; correcto, rápido y sin pista → *Easy*. Hoy *Easy* solo lo da
   `light`.
2. Mediana de tiempo por tipo de ítem y por semana en `state.rt` → «el passato prossimo te sale un 40 %
   más rápido que en la semana 12» en el resultado de la ronda y en *Mi gramática*.
3. Preguntar la confianza **solo** en las fichas de repaso escritas (no en la ronda, para no frenarla): tres
   botones antes de ver el veredicto. Alimenta `noteConfidence`, `calibration` (que ya existe) y la
   hipercorrección, que hoy nunca se dispara.
4. Los chequeos fallados de la lección entran al repaso como ítem de reconocimiento con la regla a la vista
   (`lezione.js` ya devuelve `q` con `block`), y `lessonScore < 70` hace que «A entrenar esta parte» venga
   antes en `weekPlan`.
5. `state.logTotal` monótono para `maybeFit` (A8).

**Por qué.** Automatización ≠ conocimiento declarativo (DeKeyser & Suzuki 2025); la calibración y la
hipercorrección solo funcionan si se pregunta la confianza (Butterfield & Metcalfe). Todo está escrito y
probado en `engine.js`; falta la plomería.

**Costo.** S para 1, 2 y 5; M para 3 y 4.

### E2. El plan del día: una sesión armada según el tiempo, no misiones sueltas · ALTA · M

**Evidencia.** Oggi (`app.js:436-580`) muestra la próxima misión del percorso más tres botones (pausa,
sfida, repaso). Las sesiones tienen tamaño fijo: pausa 11, ronda 12, sfida 6, repaso 20, Dominala 30,
micro 5. Nada pregunta cuánto tiempo hay, nada mezcla lo vencido con la lección y con input. Las cuerdas
(`strandsLast`) solo dan un consejo. El repaso vencido puede llegar a 596 y la app lo muestra como «hoy:
20 (quedan 596)».

**Qué.** Un constructor `Plan.today(state, minutes)` en un `js/plan.js` sin DOM (testeable en node), con
tres duraciones (5 / 15 / 30 min, la última elegida queda recordada) que devuelve una **secuencia**:

1. lo vencido con prioridad (noche, hipercorrección, errores; nunca más de la mitad del tiempo);
2. el próximo paso de la lección o su entrenamiento (una sesión corta, ya están cortadas);
3. un bloque de input de la semana (la lectura del día, un episodio de escucha, tres minutos de Biblioteca
   o *Ascolto facile*), medido en minutos, no en xp;
4. un bloque de output (Scrivi, una variación, un C-test) si la cuerda de output viene baja.

Una sola pantalla «Hoy» con el plan como lista tildable; la misión del percorso sigue existiendo, pero se
cumple sola cuando el plan la cubre. El cierre semanal («más escucha») cambia los pesos del plan de la
semana siguiente, y el fin de semana el plan es solo 1 y 3.

**Por qué.** Las cuatro cuerdas de Nation son una regla de reparto del tiempo, no un medidor. Los planes
de implementación funcionan cuando dicen qué, cuándo y cuánto (Gollwitzer & Sheeran 2006). Y hoy la
persona que abre la app con cinco minutos tiene que elegir entre siete botones.

**Costo.** M. Los constructores ya existen (`buildReview`, `buildRound`, `Letture.session`, `Tramo`);
el trabajo es la política de reparto y la pantalla. Se prueba con el simulador (apéndice).

### E3. La gramática en producción a largo plazo · ALTA · M

**Evidencia.** C2 y C3: la regla vuelve solo como la misma oración, 0,7-1,2 veces por ejercicio en el
resto del año; el 36 % (it) y el 50 % (pt) de los ejercicios no se vuelven a escribir después de su mes.
Scrivi pide solo las estructuras de su semana (`Scrivi.TASKS[w].use`). Las Variaciones son opcionales y
usan frases, no las reglas. `noteProduction` cuenta días productivos por semana pero no programa nada.

**Qué.** Tratar la regla como ficha **que programa**, no solo que se muestra:

1. Una ficha `r:<semana>:<bloque>` por bloque de lección, con FSRS, cuya «respuesta» es una **oración
   nueva** de esa regla tomada del banco: `Banca.gapSession` y `translateSession` ya filtran por
   `tags` y por semana (`sentencePool`), y `Referencia` ya sabe qué formas tiene cada bloque
   (`forms(b)`). Cuando la ficha vence, el repaso pide una oración del banco no vista (o una Variación,
   `Variaciones.item`) en vez de repetir la oración del curso. El resultado alimenta la ficha de la regla
   y la de la oración.
2. Scrivi de la semana W pide, además de sus estructuras, **una del mes anterior** elegida por la ficha
   de regla más vencida («usá un congiuntivo», con la lista tildable que ya tiene). La revisión local ya
   detecta las estructuras (`Scrivi.check`, `task.use`).
3. Dominala y el jefe informan aparte «reglas de hace un mes o más»: ya existe el mecanismo de `novel`.
4. Las fichas «light» de la ronda dejan de ser *Easy* cuando el acierto fue de reconocimiento
   (`it.recog`): nota 3, no 4. Con eso el ítem vuelve escrito a los 3-4 días, no a los 16.

**Por qué.** La retención larga de la gramática exige reaprendizaje espaciado en producción (Rawson &
Dunlosky 2022; Serfaty & Serrano 2024, citados en el README) y sobre material nuevo, no la misma oración
(Loewen et al. 2019, brecha entre lo practicado y lo externo). El punto 4 corrige una desviación del
propio diseño: el README dice «vuelve una sola vez a las dos semanas» para lo que sale bien; sale bien
como opción múltiple.

**Costo.** M. Los pools existen (`banca.js`, `variaciones.js`, `referencia.js`); es un tipo de ficha nuevo
en `reviewItem` (`drills.js:810-822`) y un campo más en `Scrivi.TASKS`.

### E4. El jefe que mide lo que dice medir · ALTA · M

**Evidencia.** C6: «ascolto» 0-1 de 500, «lettura» = opción múltiple de gramática, producción 16 % en el
jefe de la 39 (it). Las 6 frases nuevas no cuentan para aprobar (`finishRound`, `app.js:3048-3052`). Y la
ponderación «pregunta más de las semanas donde acertaste menos» (`accOf`, `drills.js:751-754`) indexa
`weekStats` por `it.wk` (el mínimo del sillabo) mientras `weekStats` se escribe por la semana del
percorso (`view.week`): en la semana 8 (Domande), 43 de 85 ítems tienen `wk = 1`; en la 43 (L'infinito),
21 de 48. El jefe de la 52 reparte «la mitad de la estación» también por `wk`: por `wk`, 46 % de sus
ítems son de la estación; por semana de lección, 65 %. `dueList` tiene la misma confusión (`map[id].wk
=== week`, `drills.js:846`).

**Qué.**

1. Guardar en cada ítem la semana de su lección (`build_course.py` ya la sabe: es la lista `week.items`)
   como `it.week`, y usar esa en `accOf`, en los pools del jefe y en `dueList`; `wk` queda para el sillabo.
2. El jefe pasa a ser un examen por *abilità* de verdad: un texto del tramo (o de *La settimana* antes de
   la 27) con sus preguntas en la lengua meta = lettura; una escucha con preguntas = ascolto; 12-15 ítems
   escritos = produzione; opción múltiple = strutture. Cada una con su 55 %. El material está: 25
   lecturas y 25 escuchas largas con preguntas hechas, y las lecturas semanales.
3. Las frases nuevas cuentan: no para aprobar, pero sí como cuarta estrella o como condición de la
   medalla, y el resultado dice «brecha de X puntos».
4. Un jefe con tres intentos seguidos en el mismo día (en la simulación, el de la 39 necesitó tres) debería
   cambiar de preguntas: hoy `buildBoss` es aleatorio pero saca del mismo pool con el mismo orden de
   debilidad.

**Por qué.** El README promete «resultado por abilità, como el CILS» y «pregunta más de las semanas
donde acertaste menos». Lo primero es una etiqueta; lo segundo tiene la clave cruzada.

**Costo.** M (1 es S y conviene hacerlo primero).

### E5. Misiones con umbral y xp por esfuerzo · ALTA · S–M

**Evidencia.** `weekPlan` (`app.js:1543-1667`): la misión se da por hecha con `seenV >= total`
(palabras: haberlas visto), `p.seen >= p.total` (escena, Ponte, Capire: haberlas visto), `st.right >= 20`
(20 correctas acumuladas, 74 % de opción múltiple), `!!sd` (Scrivi entregado; los errores no bloquean,
`app.js:5049`), `!!d` (lectura hecha con cualquier porcentaje), `bankDone` (ocho fichas), `total >= 6`
(Suoni: seis respuestas). Con umbral: Dominala (85 %, **no obligatoria** para avanzar,
`pendingToAdvance`, `app.js:1678`), el duelo (80 %, opcional) y la tarea del tramo (`r.ok`). La xp es
plana por acierto (C5) y el combo (+2 por acierto seguido, tope 10) premia rachas de fáciles.

**Qué.**

1. Un criterio de calidad por misión, mostrado en la tarjeta: palabras → **producidas** al menos una vez
   (la ficha `v:` con `reps ≥ 1` y sin `recog`); escena → `strong` (ya lo calcula `Frasi.progress`) ≥ 60 %;
   lectura → 70 % de comprensión o releerla; Capire → 80 %; Suoni → 70 % en los pares. La misión sigue
   apareciendo hecha «a medias» (★ gris) hasta cumplirlo.
2. Dominala o el jefe de la parte como condición para abrir la semana siguiente **desde la semana 5**
   (antes, solo la lección y las 20 correctas, para no espantar): hoy el único umbral de producción es
   opcional.
3. xp por costo cognitivo: reconocimiento 6, escrito 10, escrito de una regla de hace un mes 14, frase
   escrita de memoria 12, texto libre por palabra (con tope) y por estructura cumplida; el combo se
   reemplaza por «racha de escritos». Las metas diarias (100/200/350/500) se recalibran con el simulador
   para que el tiempo por día no cambie.
4. La sfida del giorno (`giorno`, 6 preguntas, doble xp) pasa a ser 6 preguntas **escritas** de reglas
   vencidas: hoy es la ronda de la semana con el doble de premio.

**Por qué.** Lo que se mide se optimiza: hoy la vía más rápida a la meta diaria son rondas de opción
múltiple y pausas. Una misión que se cumple viendo enseña menos que una que se cumple produciendo
(retrieval practice, el principio 1 de la tabla del README).

**Costo.** S para 1, 2 y 4; M para 3 (recalibrar con `sim_carriera.js`).

### E6. Input contado y obligatorio antes del tramo · ALTA · M

**Evidencia.** C4: 168 palabras leídas y 59 escuchadas por semana en la primera mitad (it), 242 y 63
(pt). La Biblioteca, *Ascolto facile*, Cultura y las inundaciones son opcionales y no entran en ninguna
meta. La escucha paga 1 xp cada 10 s con tope de 30 por día (`noteListening`): 5 minutos por día como
máximo cuentan.

**Qué.**

1. Una meta de **minutos de input** por semana (por ejemplo 40 en A1, 90 en B1, 150 en B2+) separada de la
   xp, visible en Oggi al lado de la meta diaria, que suman: lecturas con o sin audio, *Ascolto facile*,
   Biblioteca (ya mide tiempo por página), dictogloss, escucha larga, y la misión *Fuori dalla app*
   (propuesta 9, pendiente) con un toque para anotar minutos.
2. Desde la semana 3, una **segunda lectura corta por semana** obligatoria en el plan (E2): hay 35 textos de
   Martín/cultura y 52 de *La settimana*; el chequeo `check_letture.py` ya controla el 98 % de cobertura.
3. Relectura cronometrada (propuesta 8, pendiente, costo bajo): el mismo texto una segunda vez cuenta como
   input y mide palabras por minuto.
4. La Biblioteca entra al plan diario con «3 minutos» en vez de ser una pestaña.

**Por qué.** Con 25-30 minutos por día, sin input no hay C1: leer es la forma más barata de sumar volumen
(Jeon & Day 2016) y la app ya tiene el material y el 98 % de cobertura garantizado. El tramo C1 lo
resolvió para la segunda mitad; la primera mitad sigue con dos minutos.

**Costo.** M (1 y 4 son S; 2 es contenido para pt donde falten textos).

### E7. La prueba de ubicación le tiene que hablar al repaso · MEDIA · S–M

**Evidencia.** `Ubicacion.apply` (`ubicacion.js:169-179`) solo sube `unlocked` y guarda el registro. Quien
entra en la semana 20 no tiene fichas de las 12 palabras × 19 semanas, de las 10 escenas de frases ni de
las reglas anteriores: `nextScene` (`drills.js:927-940`) le va a ofrecer *Primi passi* como escena
pendiente, `weekPlan` de esas semanas queda todo sin hacer, y `Banca.weekOf` abre el banco entero de
golpe. Y las preguntas falladas en el test no van a ninguna parte (`answer` solo actualiza la posterior).

**Qué.**

1. Al aplicar: sembrar fichas en mantenimiento (`state = "maint"`, `s = 60`) para las palabras y las frases
   de las semanas saltadas, y fichas normales (`due` hoy) para lo fallado en el test. Así el repaso las
   trae de a seis por día, sin deuda, y la app descubre solas las lagunas.
2. Un «puente» de tres días después del test: una ronda por día con lo fallado, las frases de las escenas
   saltadas (`sceneSession` con `newCount` alto) y un Scrivi corto de nivel.
3. Un mini diagnóstico de interferencias (10 ítems de `Banca.errorSession` por categoría) para arrancar
   el perfil de errores, que si no queda vacío hasta la primera ronda.

**Por qué.** El test estima el nivel bien; lo que falta es que el resto de la app se entere.

**Costo.** S para 1, M para 2 y 3.

### E8. Adaptar la ronda · MEDIA · M–L

**Evidencia.** Sección A: `buildRound` no tiene ninguna variable del alumno salvo el orden; el tamaño y la
mezcla son fijos; `firstRecognize` decide por ficha, no por rendimiento; el corte por fatiga es la única
reacción en sesión.

**Qué.** Sin llegar a un modelo de conocimiento por regla (que no hace falta para un 3.0), tres reglas
simples en `buildRound` y `settle`:

1. **Escalera dentro de la sesión**: si un ítem de reconocimiento sale bien y rápido, el siguiente ítem de la
   misma regla (mismo `topic`/bloque, `Porque.blockFor` ya lo calcula) viene escrito; si un escrito
   falla, el siguiente de la misma regla viene con opciones. Hoy la escalera es reconocimiento → ficha →
   16 días.
2. **Mezcla por rendimiento**: `gymShare` y la cuota de arrastre (`wantExtra`) suben o bajan según la
   precisión de las últimas 30 respuestas de la semana (`ws.last`, que ya se guarda) y según el perfil de
   errores (si la categoría floja es «auxiliar», más `conjugationTyped` de `essere/avere`).
3. **Tamaño por tiempo**: la ronda recibe `size` del plan del día (E2).

**Por qué.** Es lo mínimo para que dos personas con la misma semana no reciban la misma ronda. La
evidencia sobre dificultad deseable (Bjork) pide producción cuando el reconocimiento ya está, no dos
semanas después.

**Costo.** M–L (la escalera es M; medir el efecto pide el simulador con un alumno que aprenda, apéndice).

### E9. Tareas comunicativas sin IA antes del tramo · MEDIA · M

**Evidencia.** Hasta la semana 26 la única producción abierta es Scrivi (15-35 palabras, consigna en
castellano, sin insumo ni destinatario: `Scrivi.TASKS`). *Parla* necesita clave (`aiKey()`,
`app.js:1646`). La tarea integrada empieza en la 27 y ya tiene la forma correcta (insumo → género →
consigna en la lengua meta → revisión por puntos).

**Qué.** Una **tarea corta por semana desde la 3**, con el mismo esqueleto del tramo pero de 40-80
palabras: un insumo breve (una frase del día, un mensaje, un mini audio de una escena), un destinatario y un
propósito («respondele a Marco: aceptá, proponé otro día, preguntá dónde»), y la revisión local por puntos
cubiertos (`Tramo.evaluate` ya lo hace con palabras clave) más el corrector de Scrivi. Un role-play
**guionado y ramificado** sin IA para las escenas de Frasi: tres turnos con dos o tres respuestas posibles
cada uno, corregidas con `Frasi.gradeWritten`.

**Por qué.** TBLT: la tarea con propósito y resultado produce más negociación de forma que el ejercicio,
y la app no tiene ninguna antes de la 27 sin clave. El esqueleto y la revisión ya existen; es contenido más
una pantalla que ya está hecha (`tramo-scr`).

**Costo.** M (código S; el trabajo es escribir 24 tareas por idioma).

### E10. Transferencia entre módulos por ítem, no solo por categoría · MEDIA · S–M

**Evidencia.** Lo que sale mal en Scrivi va a `errs` por categoría (`app.js:5064`) y la Clínica arma
ejercicios genéricos de esa categoría. Lo que sale mal en un chequeo de lección, en una pregunta de
lectura, en un bloque del dictogloss o en un hueco del C-test no genera nada. La reformulación (`ep:`) es
la excepción y el modelo a seguir.

**Qué.**

1. Un `Engine.enqueue(id, item, opts)` que cree una ficha con `due` hoy para cualquier módulo: la palabra
   fallada en la lectura (ya hay glosa y banco), el chequeo de la lección, el bloque no recuperado del
   dictogloss (como cloze de ese bloque), el hueco del C-test, la frase de Scrivi con el error (como
   *fixerr* con la corrección: `Banca.errorItem` ya tiene el formato).
2. La Clínica pasa a mezclar esos ítems propios (mitad) con los genéricos de la categoría (mitad), y entra
   al plan del día cuando `weakest` devuelve algo, en vez de esperar a que el alumno la busque.

**Por qué.** El error propio, en su contexto, es el ítem más informativo que tiene la app (Metcalfe 2017),
y hoy se pierde en cinco de los seis lugares donde ocurre.

**Costo.** S para el `enqueue` (`reviewItem` ya despacha por prefijo), M para cablear los módulos.

### E11. Objetivos personales con efecto y modo mantenimiento · MEDIA · M

**Evidencia.** `state.ideal` (para qué querés el idioma) y `state.plan` se muestran y no cambian nada.
`subGoals` calcula palabras por semana hacia el próximo jefe y las muestra. Después de la semana 52 no
pasa nada distinto: `weekPlan(52)` sigue ofreciendo el examen, el repaso sigue con tope de 6 de
mantenimiento por día, y no hay ninguna pantalla «después del curso». Tampoco hay meta de fecha («rindo
el CILS en junio»).

**Qué.**

1. **Meta con fecha**: «quiero llegar a la semana N para el día D» → el plan del día calcula el ritmo
   (semanas por semana) y lo muestra; si el ritmo pide más de 40 min por día, lo dice.
2. **Para qué** con efecto: cada `why` (viajar, trabajar, leer, examen) pesa distinto las cuerdas del plan
   (E2) y elige qué lecturas y escenas van primero en el opcional.
3. **Modo mantenimiento** (después del jefe 52, o al elegirlo): sin misiones nuevas; plan semanal de 3
   sesiones: repaso (tope de mantenimiento a 20), una lectura larga o escucha del tramo con preguntas, y
   una tarea; una versión nueva del examen cada tres meses (hoy hay una sola versión, A2 de la auditoría
   anterior sigue abierto), y el registro de velocidad (E1) como medida de que no se pierde.

**Por qué.** El yo ideal (Dörnyei) motiva cuando se conecta con acciones concretas; la retención a un año
exige repaso con espaciado largo y uso (Bahrick), y hoy la app se apaga al final.

**Costo.** M.

### E12. Metacognición: predecir antes de la sesión · BAJA · S

**Evidencia.** Existen la autoexplicación (`porque.js`) y «¿qué te lo dijo?». No existe ninguna predicción
(«¿cuántas de estas 12 vas a acertar?») ni la calibración se muestra, porque `calibration` no recibe
datos (E1).

**Qué.** Antes de Dominala y del jefe, una pregunta de un toque: «¿cuánto creés que vas a sacar?» (60 /
75 / 90 %). El resultado muestra la brecha y la guarda en `records`. Con E1.3 hecho, Io muestra la
calibración por semana con las funciones que ya están.

**Por qué.** La predicción y la comparación con el resultado real mejoran la regulación del estudio (Dunlosky
& Rawson 2012) y cuesta una línea.

**Costo.** S.

---

## F. Deuda didáctica y técnica del núcleo

### F1. Señales muertas o congeladas · S

- `speed` congelado a los 2.500 repasos (A8): `state.logTotal`.
- `lessonScore` nunca leído; `conf`/`calibration`/`hyper` sin entrada; `took` sin salida (E1).
- `state.pauses.why` solo actúa en `dificil`; `tiempo` y `otro` no cambian nada aunque el texto dice
  «Anotado» (`app.js:690-692`).

### F2. Notas del programador que no corresponden · S

- `light` → *Easy* aunque el acierto fue de reconocimiento (`settle`, `app.js:2592`; `ratingFor`,
  `engine.js:196-208`). Corrección en E3.4.
- `weekStats` por semana del percorso, pero el jefe y `dueList` indexan por `it.wk` (E4.1).
- `ritornoItems` (`app.js:645`) promete «las diez fichas más frías» y devuelve las diez primeras de
  `dueList`, que ordena por prioridad y fecha, no por probabilidad de recuerdo (`retrievability` existe).

### F3. Cosas que se cumplen «jugando» · S

- «Superá la semana» con 74 % de opción múltiple (C1). La sfida del giorno es la misma ronda con doble xp.
- Las palabras de la semana se dan por practicadas al verlas (`seenV`), y la sesión de palabras tiene un 8 %
  de producción.
- Una lectura queda «leída» con 0 % de comprensión (`weekPlan`, `!!d`).
- Suoni queda hecha con seis respuestas, cualquiera sea el resultado (`finishRound`, `app.js:3064`).
- Las fichas flash de las frases son autoevaluadas («¿Te salió?», `app.js:5229-5245`) y valen igual que una
  escrita para el SRS y la xp.

### F4. Ítems que se vuelven fichas sin criterio · S–M

- Todo ejercicio de ronda, sfida, jefe y Dominala crea ficha (2.631 «light» en el año, 59 % de la cola).
  Un ejercicio de opción múltiple de *Dummies* sobre «il/lo» es una ficha con la misma jerarquía que
  «essere/avere». Propuesta: que la ficha de la **regla** (E3) sea la unidad, y las oraciones sueltas solo
  entren si fallaron. Reduce la cola sin perder cobertura, porque la regla trae oraciones nuevas.
- Ítems de `sfida` (1.633 en it) entran al repaso igual que los del curso; 461 ítems del curso no se sirven
  nunca (411 sin sfida) mientras otros vuelven cinco veces.
- Los duelos crean ficha por oración (`duel:`), la pista (`:cue`) no; bien. Pero el duelo hecho al 80 %
  no vuelve nunca como duelo: sus oraciones vuelven sueltas, sin la competencia entre las dos formas que
  es la razón del ejercicio.

### F5. README y código · S

- «Nunca pasa de unas 150 tarjetas», «cuatro aciertos retiran la ficha», «FSRS, confianza y
  mantenimiento», «cada regla es una ficha… consolidada a los tres días»: cuatro afirmaciones sobre el
  núcleo que el código de v2.8 no cumple (sección B y A). Conviene una pasada del README con `grep`
  contra las funciones que nombra.
- Los 30 errores del gimnasio de portugués (gerúndio) siguen (A10 de la auditoría anterior).

---

## G. Orden sugerido y costo total

| Paso | Qué | Esfuerzo | Se mide con |
|---|---|---|---|
| 1 | E1.1, E1.5, E3.4, F2 (tiempo → FSRS, `logTotal`, `light` sin *Easy*, `it.week`) | S | `test_memoria.js`, `sim_carriera.js` (cola y horas no deben subir más de 10 %) |
| 2 | E5.1-2 y E5.4 (misiones con umbral, Dominala obligatoria desde la 5, sfida escrita) | S | simulación: semanas por semana con el alumno de 80 % |
| 3 | E7.1 (ubicación siembra fichas) y E10.1 (`enqueue`) | S | test nuevo en `tools/lib/` |
| 4 | E4 (jefe por abilità con lecturas y escuchas; frases nuevas cuentan) | M | `test_game.js`, simulación de jefes |
| 5 | E2 + E6.1 (plan del día con minutos de input) | M | simulador extendido (apéndice) |
| 6 | E3.1-3 (la regla como ficha que programa oraciones nuevas; Scrivi con la regla del mes pasado) | M | `A_medidas.js`: producciones a 4+ semanas por regla, brecha novel/practicado en el jefe |
| 7 | E5.3 (xp por esfuerzo, metas recalibradas) | M | simulación: horas por día iguales |
| 8 | E8, E9, E11, E12 | M–L | — |

---

## Apéndice: cómo se midió y qué no se pudo medir

- **Simulaciones oficiales**: `node tools/it/sim_carriera.js` y `.../pt/...`, salidas en `sim_it.txt` y
  `sim_pt.txt` del scratchpad.
- **`A_medidas.js`** (scratchpad): misma carrera, con registro por respuesta (`plays`), agregados por
  estación, por modo, por fuente, por semana de la lección (`listedWk`, no `it.wk`), estado de las fichas,
  cola por fuente, palabras de input por semana (lecturas jugadas + dictogloss + escucha larga, contadas
  con `Letture.allTokens`, `Suoni.dgFor`, `Tramo.week`), xp por fuente, composición del jefe en 20
  armados y trayectoria de fichas con `Engine.schedule`. Correr: `node A_medidas.js it|pt` (15 s).
- **Estático**: `course.json` para tipos por semana y `wk` vs semana listada; `grep` para las señales
  muertas.

**Lo que no pude medir y conviene medir antes del 3.0.**

- **Cuánto se aprende.** El alumno simulado no aprende: no hay forma de comparar dos políticas (por
  ejemplo, ficha por regla vs. ficha por oración) por su efecto en la retención. Propongo extender
  `sim_carriera.js` con un alumno que tenga una probabilidad de acierto por regla que suba con cada
  producción correcta y baje con el tiempo (una curva de olvido simple por regla, con `Porque.blockFor`
  para mapear ítem → regla). Con eso, cada propuesta de E2, E3, E5 y E8 se puede comparar con un número.
- **El tiempo real por sesión** en el teléfono (la simulación usa segundos fijos por tipo de ítem).
  Guardar `took` (E1) lo resuelve para las versiones siguientes.
- **La brecha entre lo practicado y lo nuevo en el jefe**: la simulación con acierto fijo no la ve; en el
  uso real es el número más importante que informa el jefe, y hoy no se guarda en ninguna parte
  (`transfer` vive en `view.result`).
- **Las misiones opcionales** (Suoni, dictogloss, duelos, Escritos, tramo, Biblioteca): la simulación no
  las juega, así que las horas del año (129 / 116) están por debajo del uso completo (mi estimación:
  160-170 horas).
- **El portugués con `it.week`**: las semanas 1-50 tienen 45-53 ítems parejos por construcción (`CONTENIDO.md`),
  y por eso sus números de cobertura son mejores; no medí si esos ítems cubren toda la teoría de la semana.
