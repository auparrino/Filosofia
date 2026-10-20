# Una app, varios idiomas

*La Via C1* (italiano), *Rumo C1* (portugués de Brasil) y *Weg C1* (alemán,
en construcción) son una sola app:
un **núcleo** común y un **paquete** por idioma. Un arreglo en el núcleo vale
para los dos idiomas; cada idioma conserva su contenido, sus reglas, su
estética y su progreso.

```
docs/
  index.html            el caparazón: carga js/boot.js
  js/boot.js            elige el idioma y carga paquete + núcleo en ORDER
  js/*.js               el núcleo: engine, drills, lezione, banca, frasi, lab,
                        letture, duelli, suoni, voci, frequenza, porque, capas,
                        nube (la copia en un GitHub Gist), app (y los
                        módulos de «Las capas y los módulos»)
  css/app.css           la estructura (usa los tokens del tema)
  fonts/, icons/        lo común (Atkinson Hyperlegible, el ícono de la app)
  sw.js                 un service worker para todo: el núcleo siempre,
                        el paquete del idioma en uso (el otro, a demanda)
  lang/it/, lang/pt/,   un paquete por idioma (el alemán, lang/de/, arranca con
  lang/de/              lang.js, rules.js, theme.css y el curso; ver abajo):
    lang.js             window.LANG: código, marca, TTS, prefijo de guardado,
                        textos de la interfaz (pestañas, secciones, rangos…)
    rules.js            LANG.rules: las reglas del idioma que usan el motor,
                        los ejercicios, las lecciones y el banco
                        (normalización, trampas, distractores, artículos…)
    theme.css           la estética: tokens de color, tipografía, ornamentos
    conjugator.js       el conjugador (window.Conj, misma API)
    diagnosi.js         el diagnóstico de errores (window.Diagnosi)
    scrivi.js           la escritura libre (window.Scrivi)
    *_data.js           el contenido de frases, laboratorio, lecturas,
                        duelos, sonidos, dictogloss, examen
    freq_data.js        la capa de frecuencia: letras, palabras vacías,
                        lemas, pseudopalabras
    data/*.json         curso, banco, glosario, frecuencia (los compila tools/)
    audio/, fonts/
  lang/tres_lenguas_data.js   lo de los dos idiomas juntos (modo «Tres lenguas»,
                        js/tres_lenguas.js): contrastes it ↔ pt ↔ es, el duelo
                        y las palabras que delatan la otra lengua
tools/
  lib/pack.js           carga un idioma completo en node, en el orden de boot.js
  lib/sim_carriera.js   un año simulado de un idioma (npm run sim)
  lib/smoke_teclado.js  el teclado de la app en cada idioma (como celular y como computadora)
  lib/smoke_browser.js  recorre los dos idiomas en Chromium (selector, cambio
                        de idioma, pantallas, service worker)
  lib/test_*.js         los tests de lo común, en los dos idiomas
  it/, pt/              las herramientas, las fuentes del contenido y los
                        tests de cada idioma
  it/fuentes/           extractos de los manuales del italiano (no se publican)
auditorias/             las auditorías, con su índice
CONTENIDO.md            dónde va cada contenido y qué test lo controla
```

**Qué va dónde.** Si algo depende de la lengua (una palabra, una regla de
ortografía, una lista de errores típicos, un texto de la interfaz en
italiano o en portugués), va en el paquete. Si es la mecánica del juego (el
repaso, las rondas, las misiones, las pantallas), va en el núcleo y lee del
paquete lo que necesita (`LANG`, `LANG.rules`, `Conj`, `Diagnosi`, los
`*_DATA`). El núcleo no nombra un idioma nunca.

**Guardado.** Cada idioma guarda con su prefijo (`laviac1.` para italiano,
`rumoc1.` para portugués), así el progreso de uno no toca el del otro y
quien ya estudiaba italiano no pierde nada. El idioma elegido queda en
`c1.lang`.

**La copia en un GitHub Gist** (`js/nube.js`, opcional; auditoría 3.0, B
4.5, escalón 3). Un canal para otro teléfono sin servidor de la app, con
la misma lógica de «clave propia» que la IA.
- **El sobre**: el de «💾 Guardar copia», `{app: "c1", lang, brand, v, at,
  save}` (`Nube.envelope`, que `exportSave` también usa). `persist()`
  anota en `state.savedAt` cuándo cambió el progreso.
- **Dónde va**: un gist secreto por idioma, con `laviac1.json` o
  `rumoc1.json` y un `LEEME.md`. `Nube.push` lo crea la primera vez (POST
  `/gists`, `public: false`) y después lo actualiza (PATCH); si el gist se
  borró, crea otro. `Nube.remote` lo busca en la lista de gists del alumno
  (sin contenido: una llamada liviana) por el nombre del archivo, así otro
  teléfono lo encuentra con el mismo token. `Nube.pull` lo baja (pasado
  1 MB la API lo corta y se lee de `raw_url`) y controla que sea una copia
  y del idioma.
- **Restaurar**: «Traer de la nube» pasa por `restoreEnvelope` en `app.js`,
  el mismo camino que un archivo (`Engine.fromRaw`, control de idioma,
  `clearPending`), y pregunta siempre, diciendo si la copia es más nueva o
  más vieja que la del teléfono (`Nube.compare`, por `savedAt`).
- **Conflictos**: cada teléfono anota la fecha del gist (la del servidor)
  cuando sube o trae; antes de subir, si cambió (`Nube.conflict`: otro
  teléfono subió), pregunta antes de pisarla.
- **Subida automática**: si el alumno la activa, al ocultar la app
  (`visibilitychange`), una vez por día como mucho y solo si el progreso
  cambió desde la última sincronización (`Nube.autoDue`); con conflicto no
  sube y lo avisa en Io.
- **Lo que no entra en la copia**: el token (`c1.gist.token`, uno para los
  dos idiomas) y lo que el teléfono sabe del gist (`<prefijo>.gist`: id,
  fechas, subida automática) viven en `localStorage`, fuera del guardado,
  como las claves de IA.
- **Tests**: `tools/lib/test_nube.js` (la API de gists simulada: crear,
  actualizar, leer, el raw de más de 1 MB, 401, 403, 404, límite, red
  caída) y `tools/lib/smoke_nube.js` (en Chromium, con `page.route`).

**Examen C1 en versiones.** Cada idioma tiene tres versiones completas
(`esame_data.js`: `versioni` en italiano, `versoes` en portugués) y los
ítems de Estructuras y Léxico de `course.json` llevan `ver` con el id de su
versión (A, B, C; v1, v2, v3): la pantalla del examen (`esameItems` en
`app.js`) toma solo los de la versión en curso. Los arman
`tools/<código>/authored/esame_c1.py`; ninguno entra en el entrenamiento de
la semana 52. Controles: `tools/it/test_suoni.js` y
`tools/lib/test_fix_contenido_pt.js`.

**Tests.** `npm test` corre la batería de cada idioma (`tools/it/test_*.js`,
`tools/pt/test_*.js`) contra el mismo núcleo, cargado con `tools/lib/pack.js`,
los tests de lo común (`tools/lib/test_*.js`) y los chequeos de contenido
(`npm run test:content`). Además: `npm run lint` (`eslint.config.cjs`),
`npm run sim` (falla si una semana no se domina, si hay errores o ítems
repetidos) y `npm run smoke`. El CI (`.github/workflows/test.yml`) corre todo
eso y controla que `npm run build` reproduzca `docs/` exacto; el detalle, en
[CONTENIDO.md](CONTENIDO.md).

**El teclado de la app** (`js/teclado.js`). Una página web no puede elegir
el idioma del teclado del teléfono: Chrome en Android no le pasa al teclado
el `lang` del campo (`EditorInfo.hintLocales`, que sí ponen las apps nativas
como Duolingo) y Safari en el iPhone tampoco. Por eso las respuestas en la
lengua del curso se escriben con un teclado propio, en pantalla:
- **Qué cajas**: las que `langBoxes` (en `app.js`) marca con `Teclado.mark`,
  o sea las que no son en castellano ni de búsqueda; llevan `inputmode="none"`
  para que el teclado del teléfono no se abra.
- **La distribución**: `LANG.ui.kbRows` (las filas de letras; si falta,
  QWERTY) y, arriba, las letras de `LANG.ui.keys` que no están en las filas.
  Con ⇧, ⌫, una capa de números y signos, la barra con el nombre del idioma
  y ↵, que manda la respuesta como el Enter de siempre.
- **Solo en pantallas táctiles** (`pointer: coarse`): con mouse y teclado
  físico no aparece. ⌨️ pasa al teclado del teléfono; el ⌨️ de la fila de
  acentos vuelve. La elección vive en `localStorage` (`c1.kb2`: `app` o
  `phone`), para todos los idiomas, y también se cambia en Io.
- **Test**: `tools/lib/smoke_teclado.js` (en Chromium, como un celular y como
  una computadora, en cada idioma).

**Un idioma que arranca** (el alemán). Un paquete puede no tener todavía
todos sus archivos: `Boot.LANGS.<código>.missing` dice cuáles faltan y
`Boot.LANGS.<código>.data` qué datos tiene (`course.json` solo). `boot.js`
no los pide, el service worker no los guarda, `app.js` no busca banco,
glosario ni frecuencias, y el núcleo anda sin ellos: sin frases la pausa usa
las palabras de la semana y Oggi muestra la palabra del día; sin laboratorio,
biblioteca, lecturas ni examen, esas misiones no aparecen. Las semanas son
las del curso (`NW()` en `app.js`: el alemán tiene seis). `tools/lib/pack.js`
expone `pack.LANGS` (los idiomas completos, que recorren los tests comunes)
y `pack.ALL` (todos); el alemán tiene su propio test (`tools/de/test_curso.js`),
su año simulado (`npm run sim`) y su prueba en el navegador
(`tools/lib/smoke_aleman.js`). Detalle en [README-aleman.md](README-aleman.md).

**La IA** (`js/ia.js`): Claude Haiku (`claude-haiku-5-5`), con la clave de
Anthropic del alumno (`<prefijo>.claude.key`, fuera del guardado), por la API
de Mensajes directo desde el navegador. La misma interfaz para todos los
módulos (`IA.llm(prompt, keys, done, opts)`): chat con el system aparte,
respuesta de a poco para el role-play, reintentos si está saturado.
Test: `tools/lib/test_ia.js`.

**Versión.** Una sola: `package.json` (X.Y.Z), que tiene que coincidir con
`APP_VERSION` de `docs/js/app.js` y `VERSION` de `docs/sw.js`
(`tools/lib/test_version.js`).

**Biblioteca.** Libros enteros de dominio público (Project Gutenberg,
espejado en GitHub por GITenberg) para la lectura extensiva, en la pestaña
Leggi / Ler: `js/biblioteca.js` (el lector, la cobertura, el input del
perfil, las tarjetas `lib:` del repaso), `lang/<código>/biblioteca_data.js`
(los cognados, los lemas y los textos de la sección) y
`lang/<código>/biblioteca/` (`index.json` con las fichas y la cobertura por
semana; un `<id>.json` por libro, que se baja cuando se abre y no se
precachea).  Los arma `tools/lib/build_biblioteca.js` con la lista de
`tools/lib/biblioteca_fuentes.js`; el portugués pasa por
`tools/pt/ortografia.js`, que moderniza la ortografía al Acuerdo de 1990
(qué hace y cómo está documentado en su encabezado).  Test:
`tools/lib/test_biblioteca.js`.

**Tramo C1.** Las semanas 27-51 suman una lectura larga, una escucha larga
y una tarea integrada.
- **Datos**: `tools/<código>/tramo/wNN.json` y `generi.json`. Los junta
  `tools/lib/build_tramo.js` (en `npm run build`) en
  `lang/<código>/tramo_data.js` (`window.TRAMO_DATA`), que se carga antes de
  `letture.js`.
- **Lectura**: `letture.js` agrega las lecturas como la serie `lunga`, que
  usa el lector de siempre.
- **Escucha y tarea**: `js/tramo.js` tiene la escucha (pantalla
  `tramo-asc`), la tarea (`tramo-scr`) con su revisión local
  (`Tramo.evaluate`), las misiones de la semana y la lista de escuchas en
  Leggi / Ler. Guarda en `state.tramo`.
- **Test**: `tools/lib/test_tramo.js`.


**La serie Radio / Rádio (semanas 6-25).** Un programa de radio a dos voces
por semana, sin los jefes (13 y 26): 19 episodios por idioma, de ~130
palabras en la 6 a ~300 en la 25.
- **Datos**: `tools/<código>/radio/wNN.json` (guion `turns`, `speakers`,
  `gloss`, tres `questions`, dos o tres `info` [afirmación, true|false], la
  gramática de la semana `grammatica.forme` y sus palabras `parole`) y
  `serie.json` (nombre, personajes, desde qué semana las preguntas van en la
  lengua meta, las etiquetas de «¿lo dice?»). Los junta
  `tools/lib/build_radio.js` (en `npm run build`) en
  `lang/<código>/radio_data.js` (`window.RADIO_DATA`, con `qlang` y las
  etiquetas de cada episodio), que se carga antes de `radio.js` y `tramo.js`.
- **Código**: `js/radio.js` tiene los datos, la misión obligatoria «📻
  Radio: …» (`Radio.missions`, una línea en `weekPlan`; hecha con 60 % o en
  el segundo intento), el guardado (`state.radio`) y la serie en Leggi / Ler
  (`Radio.weekButtons`, `Radio.leggiFold`: dos líneas en `renderLeggi`). El
  reproductor es el de la escucha larga: `Tramo.open("rad", semana)` pide el
  episodio a `Radio.asWeek` y lo muestra en la pantalla `tramo-asc` (dos
  voces, dos escuchas con las preguntas a la vista, glosas antes, la
  transcripción después, «¿lo dice?» en lugar de vf); `Tramo.handles("radio")`
  lo abre desde `goMission` y desde el plan del día. Los minutos van a
  `noteListening` y la pantalla cuenta como input en el reloj; en
  `js/plan.js`, `radio` es un bloque de input (`Plan.INPUT`).
- **Tests**: `tools/lib/test_radio.js` (largos, voces, preguntas, gramática y
  palabras de la semana, la transcripción igual al guion, la misión, el
  plan), `tools/<código>/check_radio.py` (gramática y vocabulario de la
  semana, en `npm run test:content`) y `tools/lib/smoke_radio.js` (el
  episodio en Chromium, desde el percorso y desde Leggi).

**Fuera de la app (semanas 6-52).** Una ficha opcional por semana que manda
a material auténtico de afuera (un video, una radio, una nota, una canción)
y trae de vuelta los minutos como input.
- **Datos**: `lang/<código>/fuera_data.js` (`window.FUERA_DATA`), escrito a
  mano: `FUENTES` {clave: {name, note}} y `FICHAS` [{week, level, kind:
  escucha|video|lectura|cancion, fuente, title, url, buscar, min, why, how,
  words [[palabra, glosa]], questions (3), tell}], más `label`, `blurb` y
  `metaFrom` (14: desde ahí las preguntas van en la lengua meta). Solo
  enlaces a portadas de programas, secciones o búsquedas, con `buscar` por si
  se rompen; de las canciones, título y quién canta, nunca la letra.
- **Código**: `js/fuera.js` tiene la misión opcional «📺 …»
  (`Fuera.missions`, en `weekPlan`; hecha con minutos anotados), la pantalla
  `fuera` (`owns`, `render`, `wire`; el enlace se abre en otra pestaña), los
  toques de 5-30 minutos (`Fuera.log`, 120 por día, 30 de xp; `undo` para el
  último de hoy) que van a `Progreso.addTime(…, "input")` y a
  `state.fuera.d`, las tres preguntas que se marcan, y el «contalo» de 40-60
  palabras con `Scrivi.check` de la semana (`Fuera.review`, xp una vez; los
  errores al perfil por `recordFindings`). En Leggi / Ler,
  `Fuera.weekButtons` y `Fuera.leggiFold`. `Capas.inputWeek` (campo `out`) y
  `Progreso.inputWeek` suman los minutos; en `js/plan.js`, `fuera` es un
  bloque de input. Guarda en `state.fuera` = {w: {semana: {min, taps, q, t,
  n, hard, at}}, d: {día: [min, xp]}}.
- **Tests**: `tools/lib/test_fuera.js` (las 47 fichas, los topes, el input,
  la misión, el «contalo», la pantalla) y `tools/lib/smoke_fuera.js` (en
  Chromium: la misión de la 6, +10 min, la pregunta, el corrector y la ficha
  de la 20 desde Leggi).

**Para el trabajo (desde el A2).** Una ruta paralela al percorso con escenas
de oficina (presentarse, la charla del café, llamadas, mails, opinar,
presentar resultados, quejarse, negociar plazos, coordinar), cada una en la
semana cuya gramática usa.
- **Datos**: `lang/<código>/trabajo_data.js` (`window.TRABAJO_DATA`), escrito
  a mano; se carga antes de `frasi.js`, que suma sus frases a las de siempre
  (ids `frase:<escena>:<n>`, mismos ejercicios y mismo repaso) sin meterlas en
  `Frasi.SCENES` (quedan en `Frasi.WORK`). El portugués la tiene vacía hasta
  el paso 1.5 del plan: sin escenas no aparece nada.
- **Código**: `js/trabajo.js`: la pantalla `trabajo` (el diálogo con una voz
  por personaje y la traducción a pedido, las frases con su construcción, la
  ronda de frases y la de producción —`startRound("trabajo", "<escena>:frasi"
  | "<escena>:prod")`, que al terminar vuelve a la escena— y la tarea con su
  lista, el corrector de Scrivi y el modelo después de escribir), la misión
  opcional «💼 …» de la semana (`Trabajo.missions`, hecha con la producción en
  60 % y la tarea escrita a su largo) y la sección en Allena
  (`Trabajo.weekButtons`, `Trabajo.allenaFold`). Los ítems vuelven al repaso
  como `trab:<escena>:<n>` (`Drills.reviewItem`). Guarda en `state.trabajo`.
- **Tests**: `tools/lib/test_trabajo.js`, `tools/it/check_trabajo.py` (en
  `npm run test:content`) y `tools/lib/smoke_trabajo.js` (en Chromium).

**Oggi, el primer arranque y el progreso.** Durante el curso, arriba de Oggi / Hoje va la semana
del percorso con su próxima misión (`weekTopHtml` en `app.js`, «▶︎ Seguir»): el percorso organiza
el día. El plan por minutos se probó en la 3.0 y desde la 3.2 queda solo para después del curso.
- **Plan del día**: `js/plan.js` (`Plan.today(course, state, minutos, ctx)`, sin DOM): 5, 15 o
  30 minutos con lo vencido del repaso (nunca más de la mitad), el paso siguiente de la semana, un
  bloque de input y uno de producción si la cuerda de output viene baja. Los minutos salen de los
  segundos por tipo de la simulación, calibrados con los tiempos del registro de repasos. Después
  del examen de la semana 52 (`state.phase = "mantenimiento"`), repaso a meses, lectura extensiva,
  escuchas largas, una tarea al azar del tramo y un simulacro cada tres meses.
- **La pantalla**: `js/inicio.js` (la tarjeta «Hoy» con «Empezar» después del curso, una tarjeta de hábito por día,
  las tres pantallas del primer arranque, el cierre del año). Guarda en `state.hoy`, `state.onboard`.
- **Progreso**: `js/progreso.js` (la meta en minutos `state.ritmo`, el reloj de estudio
  `state.tiempo`, un punto por semana en `state.history`, la fecha de cada jefe, la pantalla
  «Tu progreso»).
- **Test**: `tools/lib/test_plan.js`. El atajo `./#hoy` del manifiesto abre Oggi en la semana.
## Las capas y los módulos

Los módulos se ordenan por lo que hacen, no por dónde cupieron. Cada
pestaña es una capa; arriba de cada una va lo de la semana en curso y el
resto queda plegado por sección y, dentro, por estación (la actual abierta).
El plegado, las misiones que llevan módulos al percorso y la pantalla
«Consultar» están en `js/capas.js` (test: `tools/lib/test_capas.js`).

| Capa | Dónde | Qué junta |
|---|---|---|
| **Input** | Leggi / Ler | lo de esta semana (la lectura y la escucha pendientes, el capítulo recomendado de la Biblioteca, los minutos de input en 7 días); después Historias (Martín, Cultura, Inundaciones, cuentos con tus palabras), La settimana / A semana, Lecturas largas, Escuchas largas y Ascolto facile, Biblioteca y la velocidad de lectura |
| **Práctica** | Allena / Treino | lo de esta semana (escenas, el oído, el duelo que se abre, la Clínica, Variaciones); después Laboratorio, Escritura guiada, Duelos, Banco, Escenas por estación y Tres lenguas |
| **Producción** | Scrivi / Escreva (misión) | el texto de la semana, Tres vueltas y Reformulación, la tarea del tramo, la Scrittura del examen |
| **Referencia** | «Consultar» (pantalla `consultar`: se entra desde Allena, Leggi e Io) | el diccionario del curso, Mi gramática, Palabra por palabra, los mapas de preposiciones, las fórmulas fijas y los contrastes de Tres lenguas |
| **Evaluación** | Percorso | ubicación, jefes, examen C1 |

**Al percorso.** `Capas.missions(w, state)` (una línea en `weekPlan`, como
la del tramo) suma dos misiones opcionales (`opt`, no bloquean la semana):
«Leé un capítulo» desde la semana en que abre el primer libro
(`Biblioteca.openWeek`: la primera semana en que un texto del libro llega al
95 % de cobertura), con el capítulo que elige `Biblioteca.recommend`, y «Tres
vueltas» las semanas que tienen consigna de Scrivi. Desde otra pantalla,
`Capas.open(palabra?)` abre «Consultar».

**Los doce módulos que no tenían documentación:**

- **Escritura guiada** (`js/escritos.js`): el pegamento de tres prácticas
  escritas con lo ya visto, como misiones opcionales de la semana, en Allena
  y, la mitad de las veces, un ítem en la Pausa. Guarda en `state.escritos`.
  Las fuentes son las lecturas hechas, los dictogloss y, desde la 27, la
  lectura larga del tramo y la transcripción de la escucha larga ya hecha;
  un texto largo se trabaja por pasajes, y el largo del pasaje, los huecos y
  las piezas crecen con la semana.
- **Variaciones** (`js/variaciones.js`, `lang/<código>/variaciones_data.js`):
  una frase ya aprendida, reescrita cambiando una pieza (persona, negación,
  cosa, pasado, plural). Va por la ronda de siempre, con Diagnosi.
- **C-test y cloze racional** (`js/ctest.js`): la mitad de cada segunda
  palabra (Klein-Braley) o los conectores y preposiciones (Bachman) de un
  texto que ya leíste. `CTest.level(semana)`: al principio menos huecos y
  palabras de tres letras o más.
- **Ordená el texto** (`js/ordenar.js`): los párrafos, las oraciones o los
  turnos de una escucha, desordenados; los conectores y lo que remite a algo
  ya dicho se marcan como pista.
- **Tres vueltas** (`js/escritura_plus.js`): la consigna de Scrivi escrita
  tres veces en 5, 4 y 3 minutos (el 4/3/2 de Nation), con el corrector
  entre vueltas y la comparación al final. Misión opcional de las semanas de
  Scrivi.
- **Reformulación** (`js/escritura_plus.js`): tu texto reescrito como lo
  diría un nativo (IA con clave; sin clave, el corrector aplicado y el
  modelo), sin marcar errores; las diferencias que tocás van al repaso como
  tarjetas `ep:`.
- **Mapas** (`js/mapas.js`, `lang/<código>/mapas_data.js`): dibujos SVG de
  las preposiciones de lugar (la forma del lugar y el movimiento), dentro de
  la lección de su semana y en «Consultar».
- **Ubicación** (`js/ubicacion.js`): test adaptativo de hasta 25 preguntas
  con los ejercicios del curso; propone la semana de arranque y abre las
  anteriores.
- **Mi gramática** (`js/referencia.js`): todos los bloques de las lecciones,
  buscables, con la regla, la tabla, los usos en lo ya leído y el estado
  (vista, practicada, dominada). Lo que todavía no llegó se consulta con el
  aviso «esto llega en la semana N». Se llega desde «Consultar», desde cada
  bloque de la lección y de la hoja «¿Por qué?» de la corrección (usos
  reales y estado), y desde el cierre de la lección.
- **Desglose** (`js/desglose.js`, reglas en `LANG.rules.desglose`):
  «Palabra por palabra»: clíticos, tiempos compuestos, elisión, locuciones.
  Aparece en la corrección, en el lector de la Biblioteca y en «Consultar»,
  donde se le puede pegar cualquier frase.
- **Tres lenguas** (`js/tres_lenguas.js`, `lang/tres_lenguas_data.js`):
  contrastes italiano ↔ portugués ↔ español (siempre abiertos), el duelo
  «¿de qué lengua es?» (con progreso en los dos idiomas o activado a mano) y
  la categoría de error `otra_lengua`. Guarda en `state.tres` (dentro del
  guardado del idioma y de la copia; el viejo `c1.tres.v1` se copia una
  vez), y lo que se falla en el duelo vuelve al repaso como ficha `tres:<n>`.
- **Frecuencia** (`js/frequenza.js`, `lang/<código>/data/frequenza.json`):
  lemas con nivel y frecuencia; la cobertura por nivel en Io, «Parola o
  no?», los distractores por banda, el modelo de cobertura de la Biblioteca
  y el nivel de cada palabra en el diccionario de «Consultar».

**El diccionario de «Consultar»** (`Referencia.lookup` y `suggest`): una
palabra (o su significado en castellano) con la glosa del glosario, la
semana en que se enseña, el nivel y la frecuencia, la forma verbal
(Desglose), la ficha del banco (género, plural, auxiliar, nota), las
combinaciones que enseñan las notas del curso (en italiano, las
colocaciones con verbo soporte de `tools/it/authored/lessico2.py`, que
quedan en `course.json` con `topic: "collocazioni"`; en portugués, además,
el régimen de los verbos del banco) y de 3 a 5 usos reales ya leídos.

**La velocidad de lectura** (`Letture.speedNote` / `speedCommit` /
`speedCurve`): el lector cronometra desde que se abre el texto hasta
«Terminé» (sin el tiempo con la pantalla oculta y sin medir si se usó el
karaoke), y la vuelta cuenta solo si las preguntas dan 70 % o más. Guarda en
`state.lectura`; en Leggi, la curva del año y los textos para releer contra
el reloj.

**Pruebas en el navegador.** `tools/lib/smoke_modulos.js` (lo llama
`smoke_browser.js` en cada idioma) abre todo esto con `app.js`: Leggi y
Allena con un tope de alto, la lectura cronometrada, «Consultar», la
Biblioteca, la escritura guiada sobre la lectura larga y la escucha, un
duelo, Tres lenguas y Tres vueltas.

**Un aprendizaje que se adapta** (`js/reglas.js`, cargado después de
`referencia.js`).
- **La regla como ficha**: cada ejercicio del curso está enlazado al bloque
  de teoría que lo explica (`Porque.blockFor`); contestarlo abre o alimenta
  la ficha `r:<semana>:<bloque>` (una vez por día). Al vencer, el repaso pide
  una oración nueva de esa regla: del banco, con toda su gramática ya
  enseñada (`Banca.sentenceOk`), o del curso, del mismo bloque. Cuatro por
  día como mucho (`Drills` `RULES_A_DAY`), las falladas siempre.
- **Qué ficha deja cada respuesta** (`Reglas.afterAnswer`, lo usan `settle` y
  la simulación): en las rondas, un reconocimiento acertado y una forma
  escrita bien no crean ficha suelta (quedan en `state.recog`: la próxima vez,
  escritos); una forma fallada vuelve por la ficha de su regla; una oración
  (acertada o fallada) y un reconocimiento fallado, como ficha propia.
- **Transferencia**: `Engine.enqueue(state, id, ítem, opts)` crea una ficha
  para mañana desde cualquier módulo (`state.own`); la usan la lección, la
  lectura, el dictogloss, el C-test y la ubicación. La Clínica abre con «tus
  errores de esta semana» y mezcla esos ítems con los genéricos.
- **Jefe por destreza** (`Drills.buildBoss`): lectura, escucha, producción y
  estructuras (`it.skill`), cada una con su 55 %; otras preguntas si se
  repite el mismo día. xp por costo cognitivo (`Engine.xpFor(v, racha, ítem,
  {old})`) y metas recalibradas (`Engine.goalValue`).
- **Test**: `tools/lib/test_reglas.js`.

**La corrección como aprendizaje** (`js/errores.js`, cargado después de `ia.js`).
- **Un solo objeto de error** (cat, nivel, registro, mal, bien, pista, regla, contraste, fuente,
  seguro) para todo lo que corrige: respuestas cerradas, «Trova l'errore», Scrivi (reglas,
  LanguageTool, IA), dictogloss, la tarea del tramo, Escritura plus y la revisión de Parla.
  `Errores.record` lo anota en `state.errs` y `state.errLog`; lo que la Clínica no conoce
  («grammatica» de LanguageTool, la IA sin tipo) queda en el registro fuera del puntaje.
- **Niveles**: `Errores.level` lee los dos diagnósticos (pt: ok, ok_note, close, wrong; it:
  correcto, aceptable, poco_natural, desliz, incorrecto). Lo aceptable es «✓ Vale» con la nota,
  sin quitar xp ni contar como desliz. El registro formal se pide en «Trova l'errore», en los
  ítems formales y, en la tarea del tramo, según el género (`Tramo.registroOf`).
- **La IA donde rinde**: Scrivi por unión (lo local seguro, lo de la IA sumado, las dos opiniones
  si no coinciden), «🤖 Explicame» con pistas antes de la solución y «Explicame más» en la hoja
  final, el juez de respuestas no previstas (lo que acepta queda en `state.variants`), los
  pedidos con la semana, la gramática vista, las categorías flojas y las marcas locales, y un
  caché en localStorage (`Errores.cache*`) que se exporta con «Correcciones para revisar».
- **«🙋 Mi respuesta es válida»**, sin clave: acepta sin xp, deshace el error y lo anota en
  `state.aiNotes`.
- **Tests**: `tools/lib/test_errores.js`; en el navegador, `tools/lib/smoke_correccion.js`
  (con la IA simulada; lo corre `npm run smoke`).
