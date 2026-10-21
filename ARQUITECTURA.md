# Cómo está hecha Ágora

Ágora es una app web estática para **leer** filosofía en el celular: sin
dependencias, sin servidor y sin compilar el código. Nació del motor de un
curso-juego de idiomas (La Via C1); desde la v0.3.0 ese motor ya no está
(la historia de git lo conserva) y la app es un lector chico en JavaScript
plano. El contenido sigue escrito en Python legible, una semana por
archivo, y un build lo convierte en los datos que lee la app.

```
docs/                     lo que publica GitHub Pages
  index.html              el caparazón: la cabecera, <main> y la barra de abajo
  js/arranque.js          antes de pintar: tema, letra y época guardados (sin parpadeo)
  js/nucleo.js            el estado, la agenda del repaso, el buscador y la copia (sin pantalla)
  js/lector.js            las pantallas: inicio, índice, semana, repaso, glosario, ajustes
  css/app.css             la estructura y la lectura (usa los tokens de la época)
  fonts/, icons/          Atkinson Hyperlegible y la lechuza
  sw.js                   el service worker: guarda todo para leer sin red
  manifest.webmanifest    la PWA
  lang/es/                la edición en castellano:
    theme.css             las ocho épocas (data-era), en claro y en oscuro
    data/course.json      el índice: estaciones, épocas y, por semana, título, ramas y tema
    data/estacion-N.json  las semanas de la estación N, enteras, para leer
tools/
  curso/                  el contenido y sus herramientas:
    temario.py            las 117 semanas: título, ramas, qué cubre, el texto del seminario
    literatura.py         las obras de ficción de cada semana, con el porqué
    curso.py              las estaciones, las épocas y la carga de las semanas
    ej.py                 las funciones del contenido (tramo, mapa, seminario, opcion, dilema…)
    semanas/wNN.py        una semana por archivo
    build_course.py       arma docs/lang/<edición>/data/ (solo lo que se lee)
    validar_semana.py     los chequeos de una semana (también sola: NN)
    check_curso.py        los chequeos del contenido y de los datos (en npm test)
  lib/
    test_lector.js        el núcleo del lector y los datos (en npm test)
    test_version.js       una sola versión (en npm test)
    test_rutas.js         las rutas que citan los .md existen (en npm test)
    smoke.js              la app entera en Chromium, en un celular (npm run smoke)
    testkit.js            lo común de los tests
```

**Las pantallas.** `lector.js` elige la pantalla por el hash de la URL, así
la app anda igual en la raíz de un dominio que en una carpeta
(`https://auparrino.github.io/Filosofia/`):
- `#inicio`: «Seguir leyendo» (la semana y la sección donde quedaste),
  «Para repasar hoy», la estación y la época, y el avance (semanas leídas
  de 117);
- `#indice`: las nueve estaciones con sus semanas, todas abiertas;
- `#semana/N`: la semana para leer de corrido, con un índice interno de
  secciones (lo esencial, la lección, el texto, el argumento, una lectura
  posible, un caso, los conceptos, la literatura) y «Terminé de leer» al
  final. `#semana/N/sec` abre en una sección (o en un concepto,
  `c-N-i`). Las semanas 13, 26, …, 117 son el repaso de su estación: lo
  esencial de cada semana, con su enlace;
- `#repaso`: las tarjetas que vencen hoy, para releer;
- `#glosario`: todos los conceptos, con buscador;
- `#ajustes`: tema, tamaño de letra, exportar, importar y borrar el
  progreso.

**Los datos.** `build_course.py` arma, por edición, el índice
(`course.json`, unos 40 KB: lo único que hace falta para la primera
pantalla) y un archivo por estación (`estacion-N.json`, de 390 a 480 KB),
que la app pide cuando abre una semana de esa estación. Llevan solo lo que
se lee: ni los ejercicios ni los chequeos ni las preguntas, la consigna, la
rúbrica o las socráticas del seminario, que siguen en la fuente.
`check_curso.py` controla que estén al día con la fuente y que no lleven
nada de eso.

**Una sola fuente para todas las ediciones.** Cada texto de
`tools/curso/semanas/wNN.py` es un `str` en castellano o un
`{"es": …, "it": …, "pt": …, "de": …}`. `build_course.py` arma las
ediciones de `EDITIONS` y se niega a armar una a la que le falte algún
texto. Hoy está solo la castellana.

**El repaso** (`nucleo.js`) es de relectura, sin preguntas ni puntaje. Al
marcar una semana como leída se agenda una tarjeta de resumen (sus claves)
y una por concepto, que vencen al día siguiente. Cada «Releído» la pasa al
intervalo siguiente, contado desde ese día: +1, +7, +30, +90 y después cada
180. Por día se muestran como mucho 20, primero las que vencieron antes
(después, las de la semana leída antes, y en el orden de la semana). Las
tarjetas están atadas a la semana y al término del concepto; si un concepto
cambia de nombre, su tarjeta vieja se borra sola.

**Guardado y origen compartido.** Todo lo que se guarda va en una sola
clave, `agora.lector.v1`: las semanas leídas, dónde quedaste en cada una
(la sección y cuánto adentro), las tarjetas, el tema, la letra y la última
época. La app vive en el mismo origen que La Via C1 (`auparrino.github.io`)
y nunca lee ni borra una clave que no empiece con `agora`; «Borrar el
progreso» borra solo la suya. Las copias exportadas son
`{app: "agora", tipo: "lector", version: 1, exportado, estado}`. El
guardado del curso-juego (`agora-es.save.v1`) no se lee ni se borra.

**El service worker** (`sw.js`) guarda, al instalarse, el caparazón, el
código, los estilos, las letras, los íconos, el índice y las estaciones que
el índice lista: después de abrir la app una vez con internet, se lee
entera sin red. Responde desde la caché y actualiza por detrás. Su caché se
llama `agora-v<versión>` y al activarse borra solo las cachés viejas que
empiezan con `agora-`. Se registra con ruta relativa (`sw.js`).

**Las épocas.** La estética avanza con la historia. `tools/curso/curso.py`
define ocho épocas (`ERAS`) y cada semana lleva la suya. La app pone
`<html data-era="N">`: en una semana, la de esa semana; en las otras
pantallas, la de la última semana leída. `?era=N` en la URL la fija, para
mirarlas. `theme.css` redefine para cada época, en claro y en oscuro, los
mismos tokens de color, la letra de los títulos (`--serif`) y el filete de
la cabecera (`--calcadao`: la greca, las bandas de un códice, el rayado de
un grabado…). Las letras de los títulos son las del sistema; el texto
corrido va en Atkinson Hyperlegible, para que se lea bien en cualquier
época.

**La lectura.** Primero el celular: una columna de unos 65 caracteres, letra
base de 18px (Ajustes la cambia a 16, 20 o 22px con `data-letra`),
interlineado 1,6 y márgenes de 16px. Las tablas y la barra de secciones
tienen su propio scroll; la página nunca se mueve a lo ancho. El tema
oscuro sigue al teléfono, salvo que en Ajustes se elija claro u oscuro
(`data-theme`).

**Versión.** Hay una sola: la de `package.json` (X.Y.Z). Tiene que coincidir
con `APP_VERSION` de `docs/js/lector.js` y con `VERSION = "agora-v…"` de
`docs/sw.js`; lo controla `tools/lib/test_version.js`.

**Tests.**
- `npm test` corre:
  - `tools/curso/check_curso.py`: el contenido (lección, conceptos que no se
    repiten, seminario, dilemas, literatura, fuentes de las citas), los
    datos al día y sin lo que ya no se muestra, y la marca limpia en lo que
    se ve (nada dice La Via, C1, italiano…);
  - `tools/lib/test_lector.js`: la agenda del repaso (intervalos, tope,
    orden), el buscador, exportar e importar, que solo se tocan claves
    `agora`, y que cada semana de los datos tiene lo que la pantalla
    necesita;
  - `tools/lib/test_version.js` y `tools/lib/test_rutas.js`.
- `npm run lint`: eslint sobre `docs/` y `tools/lib/` (`eslint.config.cjs`).
- `npm run smoke`: `tools/lib/smoke.js` abre la app en Chromium (con
  Playwright, que no instala) en un celular, servida bajo `/Filosofia/`
  como en GitHub Pages, y la recorre entera: el índice, la semana 1 sección
  por sección, «Terminé de leer», el repaso con el reloj adelantado, el
  glosario con y sin tilde, un repaso de estación, las ocho épocas, el tema
  y la letra, exportar, importar y borrar, y la recarga sin red. Después,
  una pasada en la raíz. Falla con cualquier error de consola, respuesta
  404, «undefined» o «NaN» en pantalla o scroll horizontal.
- El CI (`.github/workflows/test.yml`) corre todo eso y controla que
  `npm run build` reproduzca `docs/` exacto.
