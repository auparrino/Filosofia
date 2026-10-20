# Cómo está hecha Ágora

Ágora sale del motor de La Via C1 v3.11.4 (`auparrino/It`), un curso-juego
de idiomas. De ahí trae la idea central: un **núcleo** común y un
**paquete** por edición. En La Via cada paquete era un idioma; acá cada
paquete es **el mismo curso de filosofía escrito en otra lengua**. Por ahora
existe la edición en castellano; después vienen it, pt y de.

```
docs/
  index.html            el caparazón: carga js/boot.js
  js/boot.js            elige la edición y carga paquete + núcleo en ORDER
  js/*.js               el núcleo: engine, drills, lezione, plan, progreso,
                        inicio, capas, ia, nube, seminario, app y los
                        módulos de La Via que se adaptan (ver abajo)
  css/app.css           la estructura (usa los tokens del tema)
  fonts/, icons/        lo común (Atkinson Hyperlegible, la lechuza)
  sw.js                 el service worker: el núcleo siempre, la edición en uso
  manifest.webmanifest  la PWA
  lang/es/              la edición en castellano:
    lang.js             window.LANG: código, marca, voz, prefijo de guardado,
                        textos de la interfaz
    rules.js            LANG.rules: corrección, rangos, medallas, lo que el
                        núcleo les pide a todas las ediciones
    theme.css           la estética de las ocho épocas (data-era)
    data/course.json    el curso compilado (lo arma tools/curso/build_course.py)
tools/
  curso/                el contenido y sus herramientas:
    temario.py          las 117 semanas: título, ramas, qué cubre, el seminario
    literatura.py       las obras de ficción de cada semana, con el porqué
    curso.py            las estaciones, las épocas y la carga de las semanas
    ej.py               las funciones del contenido (q, ch, cz, ty, ap,
                        tramo, mapa, seminario, opcion, dilema)
    semanas/wNN.py      una semana por archivo
    build_course.py     arma el course.json de cada edición (y los exámenes)
    validar_semana.py   los chequeos de una semana (también sola: NN)
    check_curso.py      los chequeos del contenido (en npm test)
    test_curso.js       el curso jugado por el núcleo (en npm test)
  lib/
    pack.js             carga una edición completa en node, en el orden de boot.js
    sim_carriera.js     un año simulado (npm run sim)
    smoke_curso.js      la app entera en Chromium (npm run smoke), con
                        smoke_nube.js (la copia en un Gist, con la API simulada)
    test_*.js           los tests del núcleo
```

**Qué va dónde.** Lo que depende de la edición (un texto de la interfaz, una
regla de corrección, el contenido) va en el paquete. La mecánica del juego
(el repaso, las rondas, las misiones, las pantallas) va en el núcleo, que lee
del paquete lo que necesita (`LANG`, `LANG.rules`, el curso). El núcleo no
nombra una edición nunca.

**Una edición que arranca.** Un paquete puede no tener todavía todos los
archivos que el núcleo sabe usar. `Boot.LANGS.<código>.missing` dice cuáles
faltan, y `Boot.LANGS.<código>.data` qué datos tiene (`course.json` solo).
`boot.js` no los pide, el service worker no los guarda y el núcleo anda sin
ellos. Hoy la edición castellana declara faltantes los datos de los módulos
que todavía no se adaptaron: duelos, devoluciones, «¿Por qué?», escritura
guiada y Biblioteca.

**Lo que quedó de La Via.** El paso 11 del [plan](PLAN.md) sacó del núcleo
los módulos que solo servían para un idioma (frases, laboratorio, lecturas,
sonidos, voces, C-test, variaciones, desglose, mapas, frecuencia, banco,
radio, tramo, «Fuera de la app», «Para el trabajo», el conjugador, el
diagnóstico, el corrector de textos y el examen C1). Quedan, a la espera de
adaptarse a filosofía:
- `duelli.js`: el duelo de dos formas que se confunden (va a ser el duelo de
  escuelas);
- `biblioteca.js`: el lector de libros enteros (para las obras de dominio
  público);
- `escritos.js` y `ordenar.js`: «Ordená el texto», todavía sin textos;
- `errores.js`, `devolucion.js` y `porque.js`: el error común, la
  devolución y «📖 ¿Por qué?» (los errores van a ser malentendidos);
- `referencia.js` y `capas.js`: «Consultar», con el diccionario de los
  conceptos del curso, y «Mi gramática».

**Guardado y origen compartido.** Todo lo que se guarda lleva el prefijo
`agora`:
- el progreso va en `agora-<edición>.save.v1`;
- la edición elegida, en `agora.lang`;
- la última época pintada, en `agora.era`;
- el teclado, en `agora.kb2`;
- el token del Gist, en `agora.gist.token`;
- las cachés del service worker se llaman `agora-v…` y `agora-voci` (la de
  los libros de la Biblioteca);
- las copias exportadas son `{app: "agora", …}`.

Así la app puede vivir en el mismo origen que La Via C1
(`auparrino.github.io`), sin leer ni pisar sus datos y sin borrar sus cachés,
que se llaman `c1-…`. `tools/curso/test_curso.js` y `smoke_curso.js` lo
controlan.

**El largo del curso.** El temario tiene 117 semanas
(`tools/curso/temario.py`) y el curso compilado trae las que ya están
escritas, en orden. `course.nweeks` es el total. `Engine.setCourse(course)`,
que llama `app.js` al cargar el curso, fija dos valores:
- `Engine.weeks()`: las semanas que hay, y el tope de `state.unlocked`;
- `Engine.finalWeek()`: el examen final, la última semana del temario.

Hay un examen al final de cada estación de 13 semanas (`Engine.isBoss`,
`Engine.bossOf`). `build_course.py` arma la semana de examen cuando su
estación está entera: todos los ejercicios de la estación y un bloque de
repaso por semana. Nada en el núcleo supone 52 semanas.

**El formato híbrido** ([FORMATO.md](FORMATO.md)). Lo diario es el motor de
siempre (lecciones, rondas, repaso), con ejercicios marcados `apl` (de
aplicación). Lo semanal está en `js/seminario.js`:
- **La misión «📜 Seminario»**, obligatoria. Tiene tres partes: el texto en
  tramos (glosas, chequeos, preguntas abiertas con notas), el mapa del
  argumento (ordenar las premisas y después ver el mapa con la implícita, la
  objeción y la réplica) y el escrito (rúbrica, tutor y modelo). Se cumple
  con el escrito a su largo mínimo y la rúbrica marcada.
- **El tutor socrático.** Usa `IA.llm` con un *system* que prohíbe dar la
  respuesta, reescribir el texto o elegir una posición, y le pide un JSON
  `{respuesta}`. Sin clave, el tutor son las `socraticas` de la semana, una
  por vez.
- **Las misiones «🤔 Dilema»**, opcionales: tomar posición, ver quién más la
  sostiene y la objeción, después la vuelta del caso. Todo queda en «Tus
  posiciones», en Yo.
- **La tarjeta «📚 En la literatura»** de cada semana (`Seminario.litCard`).

Guarda en `state.sem` y `state.dil` (en `Engine.MODULE_OBJ`). La simulación
hace el seminario con `Seminario.simulate`, y `smoke_curso.js` lo recorre en
Chromium.

**Las épocas.** La estética avanza con la historia. `tools/curso/curso.py`
define ocho épocas (`ERAS`) con sus semanas, y cada semana del curso lleva su
`era`. `app.js` (`applyEra`, en cada `render`) pone `<html data-era="N">`:
- normalmente, la época de la semana en que vas (`state.unlocked`);
- en las pantallas de una semana (la lección, la teoría), la de esa semana.

`boot.js` pinta la última época guardada antes de cargar el resto, así no hay
parpadeo, y `?era=N` en la URL la fija para mirarlas. `theme.css` redefine
para cada época, en claro y en oscuro, los mismos tokens de color y la letra
de los títulos (`--serif`), más el filete de la cabecera (`--calcadao`: la
greca, las bandas de un códice, el rayado de un grabado…). Las letras son
siempre las del sistema, sin descargas.

**La corrección.** `Engine.grade` es el de La Via. La edición pone
`grade.ignoreMarks`: una tilde de menos no es «casi», porque el curso no
enseña ortografía (*ontologia* = *ontología*). Las variantes aceptadas van en
`accept`.

**El contenido.** Hay una sola fuente para todas las ediciones. Cada texto de
`tools/curso/semanas/wNN.py` es un `str` en castellano o un
`{"es": …, "it": …, "pt": …, "de": …}`. `build_course.py` arma las ediciones
de `EDITIONS` y se niega a armar una a la que le falte algún texto. El
formato del curso es el de La Via (semanas con lección en partes y bloques,
ejercicios con id `fNN-NNN`, conceptos en `vocab`), y agrega `rama` y `era`
por semana y `eras` en el curso. Cómo escribir una semana está en
[CONTENIDO.md](CONTENIDO.md).

**La IA** (`js/ia.js`): Claude Haiku (`claude-haiku-5-5`) con la clave de
Anthropic del alumno (`<prefijo>.claude.key`, fuera del guardado), por la API
de Mensajes directo desde el navegador. Va a corregir las preguntas abiertas
y a hacer de Sócrates (ver el plan). Test: `tools/lib/test_ia.js`.

**La copia en un GitHub Gist** (`js/nube.js`, opcional). La app sube el
mismo sobre que «💾 Guardar copia» a un gist secreto del alumno, uno por
edición (`agora-es.json`), y otro teléfono con el mismo token lo encuentra y
lo restaura. Tests: `tools/lib/test_nube.js` y, en el navegador,
`tools/lib/smoke_nube.js`.

**Versión.** Hay una sola: la de `package.json` (X.Y.Z). Tiene que coincidir
con `APP_VERSION` de `docs/js/app.js` y con `VERSION = "agora-v…"` de
`docs/sw.js`; lo controla `tools/lib/test_version.js`.

**Tests.**
- `npm test` corre:
  - `tools/curso/check_curso.py`: el contenido (fuentes de las citas,
    explicaciones, ramas, conceptos, el course.json al día, la marca limpia
    en lo que se ve);
  - `tools/curso/test_curso.js`: el curso jugado por el núcleo en cada
    edición;
  - los tests del núcleo que no dependen de un idioma: versión, rutas de los
    documentos, estado, racha, «2 minutos», huecos, IA, nube y plan del día.
- Además, `npm run lint` (`eslint.config.cjs`), `npm run sim` (falla si una
  semana no se domina, si hay errores o ítems repetidos) y `npm run smoke`
  (la app en Chromium: Hoy, una lección, una ronda, el seminario, Yo, el
  camino y las pantallas de «Todo el material»; falla con cualquier error de
  la página o de la consola).
- El CI (`.github/workflows/test.yml`) corre todo eso y controla que
  `npm run build` reproduzca `docs/` exacto.
- Los tests de La Via que probaban módulos de idioma (banco, glosario,
  conjugador, diagnóstico, lecturas, radio…) se borraron en el paso 3, y los
  módulos mismos en el paso 11. Los que probaban módulos del núcleo sobre ese
  contenido (reglas, «¿Por qué?», referencia, capas, ubicación, lecciones) se
  reescriben cuando se adapte cada módulo: está en el plan.
