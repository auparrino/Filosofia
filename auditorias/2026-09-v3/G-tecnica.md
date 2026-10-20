# G. Base técnica para el salto 2.x → 3.0

Sobre `main` en v2.8 (HEAD `4a70be0`, merge del PR #55, 2026-09-26). Solo lectura: esta
auditoría no cambió código, contenido ni datos. Todo lo que escribe (build, sim, smoke) se corrió
en un clon (`git clone /home/user/It clon`) dentro del scratchpad; los scripts de medición
(`peso.js`, `dup.py`, `rutas.py`, `eslint.config.cjs`) y los logs (`npm_test.log`, `cadena.log`,
`build.log`, `biblio.log`, `sim.log`, `smoke.log`, `eslint.json`) quedaron ahí.

Punto de partida: la sección B de `auditorias/2026-09-general.md` (v2.5). El foco del 3.0 es
didáctico; acá se mira si la base lo aguanta: qué quedó de B1-B11, qué dicen hoy las corridas,
cuánto pesa y cómo está armado, y qué hace falta cambiar **antes** de agrandar el contenido.

---

## Resumen: las 10 principales

| # | Prioridad | Qué | Dónde | Esfuerzo |
|---|---|---|---|---|
| 1 | Alta · datos | No hay un modelo de contenido unificado: el banco no tiene ids, las frases y el dictogloss tampoco, y una palabra no se puede cruzar con sus apariciones (glosario ∩ banco = 1.044 de 3.181 lemas it) | `bank.json`, `*_data.js`, `glossario.json` | M |
| 2 | Alta · estado | El estado del alumno tiene 38 campos declarados y 35 más que escriben los módulos sin esquema, sin versión ni migración | `engine.js:546-600`, `app.js`, `tramo.js`, `biblioteca.js`… | S–M |
| 3 | Alta · carga | 53 scripts en cadena más un `course.json` de 2,3 MB entero: la semana mediana necesita 36 KB de ese archivo | `boot.js:128-142`, `app.js:5591` | M |
| 4 | Alta · CI | Igual que en v2.5: el smoke no corre en el CI, los `check_*.py` no están en ningún script, la Biblioteca no se controla, `sim` nunca falla | `.github/workflows/test.yml`, `package.json` | S |
| 5 | Alta · docs | Para aportar contenido al italiano no hay un `CONTENIDO.md`; el de pt cita dos rutas viejas y el «Estructura del repo» del README-italiano describe el repo de hace un año | `tools/pt/CONTENIDO.md`, `README-italiano.md:817-851` | S |
| 6 | Media · repo | `tools/it` y `tools/pt` repiten 2.652 líneas (sim_carriera 0,98; test_game 0,63); cada test define su propio `ok()` (29 veces) | `tools/it`, `tools/pt` | M |
| 7 | Media · núcleo | `app.js` sigue siendo un monolito: 5.620 líneas, 269 funciones, `render()` de 28 ramas, `wire()` de 197 líneas | `docs/js/app.js` | L |
| 8 | Media · lint | ESLint mínimo: las mismas 2 claves duplicadas y la misma redeclaración que en v2.5, más 24 variables sin uso | `drills.js:1036`, `it/scrivi.js:850`, `app.js:2706` | S |
| 9 | Media · repo | Extractos de libros comerciales siguen publicados (588 KB), `tools/it/audit` sigue roto, `package.json` sigue en 42.0.0 | `docs/lang/it/data/`, `tools/it/audit/` | S |
| 10 | Baja · pipeline | Build en dos lenguajes (5 pasos python + 1 node) sin un grafo declarado; la Biblioteca y la frecuencia quedan afuera | `package.json` `build` | S |

**Orden sugerido.** Primero lo que no cuesta y evita que el 3.0 se rompa sin avisar (4, 8, 9,
10). Después lo que desbloquea el contenido nuevo: el esquema del estado (2), la carga por
semana (3) y el modelo de contenido con ids (1), en ese orden, porque cada uno hace más barato
al siguiente. La documentación (5) conviene escribirla junto con (1), cuando el modelo quede
definido. El monolito (7) y la deduplicación (6) son deuda de mantenimiento: valen la pena, pero
no bloquean nada didáctico.

---

## 1. Estado de B1-B11 (auditoría v2.5)

| # | Qué decía | Estado | Evidencia |
|---|---|---|---|
| B1 | La Biblioteca no se reproduce desde HEAD; el script no está en el build | **Abierto (empeoró)** | `node tools/lib/build_biblioteca.js` (57 s, exit 0) en el clon → `git status`: **18 archivos** de `docs/lang/*/biblioteca/` modificados, **3.562 valores** distintos (v2.5: 14 archivos, 1.031). Sigue fuera de `npm run build` y del CI |
| B2 | El CI controla solo `docs/lang/*/data/` | **A medias** | `test.yml:22` suma `docs/lang/*/tramo_data.js`, pero no `formule_data.js` (lo genera `tools/lib/formule.py` en el build) ni el resto de `docs/` |
| B3 | `app.js` no se ejecuta en ningún test del CI | **Abierto** | `test.yml` no tiene job de smoke; `pack.js:38` sigue cortando en `app.js`. El smoke pasa a mano (ver §2) |
| B4 | `check_*.py` no corren; `sim` no devuelve error | **Abierto** | `package.json` no menciona `check_lessons.py`, `check_letture.py`; `grep -n "process.exit" tools/*/sim_carriera.js` → nada. Los tres checks pasan en 0,5 + 1,3 + 1,5 s |
| B5 | `tools/it/audit/` roto | **Abierto** | `node corpus.js`, `node lint.js` → «Cannot find module»; `corpus.js:48` cita `docs/data/bank_routledge.json`. Son 952 KB |
| B6 | Extractos comerciales publicados en `docs/` | **Abierto** | `docs/lang/it/data/bank_dummies.json` (331 KB) y `bank_routledge.json` (257 KB) siguen ahí; `build_course.py:968-970` los lee de `DATA` |
| B7 | Versiones que no coinciden | **Abierto** | `package.json:3` `"version": "42.0.0"`; `app.js:726` `v2.8`; `sw.js:21` `c1-v2.8`; `VOCES.md:3` «v1.48» |
| B8 | Rutas inexistentes en los `.md` | **Abierto** | `rutas.py`: 29 rutas entre comillas invertidas no existen (164 citadas). `tools/pt/CONTENIDO.md:60,74` (`tools/curriculo.py`, `docs/js/conjugator.js`); el bloque «Estructura del repo» de `README-italiano.md:817-851` lista `js/conjugator.js`, `data/bank.json`, `tools/build_course.py` |
| B9 | Duplicación `tools/it` ↔ `tools/pt` | **Abierto** | `dup.py` (difflib, por líneas): `sim_carriera.js` 0,98 (416/423), `test_game.js` 0,63, `test_memoria.js` 0,55, `test_frasi.js` 0,48, `test_scrivi.js` 0,47, `build_bank.py` 0,44; 2.652 líneas iguales en 18 archivos con el mismo nombre. Idéntico a v2.5 |
| B10 | `app.js` monolito | **Abierto (creció)** | 5.571 → 5.620 líneas; 269 `function`; `render()` (`app.js:3740`) con 28 ramas `if (s === …)`; `wire()` (`app.js:3852`) de 197 líneas. No existe `App.screen(...)`: los módulos entran por objetos `H` a mano (`Tramo.attach`, `Referencia.attach`, `Biblioteca.init`, `Porque.init`) |
| B11 | Sin lint; CI sin `concurrency`/`timeout`; docs sueltos en la raíz; `.git` pesado | **Abierto** | ESLint (§2): `drills.js:1036` y `it/scrivi.js:850` claves duplicadas, `app.js:2706` `opts` redeclarada, 24 sin uso. `grep concurrency test.yml` → nada. `AUDITORIA-*.md`, `PROPUESTAS.md`, `VOCES.md` siguen en la raíz. `.git`: 28 → **31 MB** |

De los once puntos, uno quedó a medias (B2, por el tramo) y uno empeoró (B1: 1.031 → 3.562 valores que cambian al regenerar la Biblioteca). El resto está como
en v2.5. Lo que sí avanzó desde entonces fue el contenido (tramo C1, palabras B2-C1, segunda
pasada didáctica): la base técnica no acompañó.

Fuera de la sección B, de paso: A1 sigue (dentro de `settle`, `app.js:2550-2781`, no hay
`savePending`), A3 sigue (`boot.js:128-142` encadena `s.onload = next`), A4 sigue (no hay
`no-cache` en `sw.js`), A6 sigue (`importSave`, `app.js:3672`, no mira el idioma ni pasa por
`SAVE.load`), A7 mejoró (seis pantallas protegidas, `app.js:5475`), A8 sigue (no hay `logTotal`).

---

## 2. Lo que dicen las corridas (clon de HEAD)

### `npm test`

- **231 s**, exit 0, 33 scripts (7 it + 7 pt + 19 lib).
- Comprobaciones, sumando las líneas «controlli / controles / chequeos» del log:
  it **91.830**, pt **103.588**, lib **96.211** → **≈ 291.600**. Es cuatro veces lo que
  documenta `README-italiano.md:898-918` («~21.500», «~24.000»).
- No hay runner: cada script imprime su propio contador y `process.exit(1)` si falla. El log
  no dice cuánto tarda cada uno ni tiene formato parseable.

### `npm run build` y reproducibilidad

- **213 s**, exit 0 (`build_course.py` del italiano es casi todo el tiempo).
- `git status --porcelain` después del build: **vacío**. HEAD reproduce exactamente
  `docs/lang/*/data/*.json`, `formule_data.js` y `tramo_data.js`. Lo que el CI controla está
  bien; lo que no controla (`formule_data.js`) también está al día, por suerte.
- `frequenza.json` no se regenera en el build (`build_frequenza.py` baja listas de GitHub con
  `urllib`, `build_frequenza.py:29-41`); se commitea a mano.

### `node tools/lib/build_biblioteca.js`

- **57 s**, exit 0 (con la caché `tools/.cache/`; la primera bajada de GITenberg es más).
- Después: **18 archivos modificados** (`git status`: los 7 libros it + `index.json`, los 9
  libros pt + `index.json`), 18 líneas cambiadas porque cada JSON es una línea. Comparando los
  JSON valor por valor: **3.562 diferencias**. En `index.json` cambia la cobertura por semana de
  todos los libros (it 904 valores, pt 1.855: `books/0/cov/12` 899 → 900); en los libros cambia
  `wk` (la semana de desbloqueo de cada palabra: en it *promesse* 7 → desaparece, *dipinto*
  24 → 19; en pt *ponderar* 99 → 37, *calar* 4 → desaparece).
- Es B1 tal cual, y peor que en v2.5 (1.031 valores). La causa es la misma: la Biblioteca se
  generó con un `lessico`/`sillabo` anterior y nadie la regeneró al cambiar el contenido, porque
  el script no está en `npm run build` ni el CI la mira. Hoy la app le dice al alumno semanas de
  desbloqueo que el curso ya no tiene.

### `npm run sim`

- **24 s**, **exit 0**, los dos idiomas. Pero:
  - **it**: `"errors": 0`, y abajo **`no dominadas: [ 31 ]`**: en el año simulado la semana 31
    queda sin dominar. El proceso termina igual con 0.
  - **pt**: **`"errors": 30`** (el gimnasio pide `imperativo`, `gerundio` y `participio` a
    `Conj.conjugate`, que no los conoce: «tempo desconhecido», semanas 8-42; es A10) y
    **`DUPLICADOS (14)`** (`s1-02-32 = s4-45-30`, `s3-30-25 = s3-39-07`…: ítems con el mismo
    enunciado en dos semanas). También exit 0.
- Confirma B4: `sim_carriera.js` no tiene `process.exit` ni `exitCode`; informa y nunca falla.
  Si estuviera en el CI con código de error, hoy fallaría por tres motivos distintos.

### `npm run smoke`

`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers NODE_PATH=$(npm root -g) node tools/lib/smoke_browser.js`:
**65 s**, exit 0, «sin errores de JavaScript». Recorre los dos idiomas: selector, lección,
ronda con errores diagnosticados, sonidos, lectura, dictogloss, misiones (15 en la semana 1 de
pt), Io/Eu, examen, service worker (`c1-v2.8`), cambio pt → it con el progreso intacto, y el
arranque directo de quien ya estudiaba italiano. Es el único test que ejecuta `app.js`, y
sigue sin correr en el CI (B3).

### ESLint mínimo

`eslint --no-config-lookup -c eslint.config.cjs docs/js docs/lang docs/sw.js` (ESLint 10.1,
`ecmaVersion 2022`, `sourceType script`, globals del navegador más los 51 globals propios de la
app sacados de `window.X =`; reglas: `no-dupe-keys`, `no-redeclare`, `no-unused-vars`,
`no-undef` y las de error probable). Resultado: **4 errores, 26 avisos**.

| Regla | Dónde |
|---|---|
| `no-dupe-keys` | `docs/js/drills.js:1036` `recognitionOf` (la misma de v2.5, corrida 4 líneas) |
| `no-dupe-keys` | `docs/lang/it/scrivi.js:850` `cocinar` |
| `no-redeclare` | `docs/js/app.js:2706` `opts` |
| `no-undef` | `docs/js/app.js:4260` `MediaMetadata` — falso positivo (Media Session API); agregarlo a los globals |
| `no-unused-vars` (24) | `app.js` 5 (`ses`, `pct`, `WEEK_KINDS`, `w`, `out`), `pt/diagnosi.js` 7, `pt/scrivi.js` 4, `it/scrivi.js` 2, `it/diagnosi.js` 1, `banca.js` `nearLevel`, `engine.js` `today`, `drills.js` `near`, `desglose.js` `r`, `tramo.js` `vf` |
| `no-constant-condition` (2) | avisos menores |

Ninguno rompe la app (la clave duplicada gana la segunda), pero son exactamente los mismos que
hace tres versiones: sin lint en el CI no se van a ir solos.

---

## 3. Tamaño y estructura

### Líneas

| Zona | Líneas | Lo más grande |
|---|---|---|
| `docs/js/` (núcleo, 28 archivos) | 17.903 | `app.js` 5.620 · `drills.js` 1.056 · `engine.js` 975 · `desglose.js` 949 · `biblioteca.js` 887 |
| `docs/lang/it/` (25 `.js`) | 19.492 | `tramo_data.js` 8.641 (generado) · `diagnosi.js` 2.604 · `scrivi.js` 1.998 · `letture_settimana.js` 1.115 |
| `docs/lang/pt/` (25 `.js`) | 21.287 | `tramo_data.js` 8.438 (generado) · `diagnosi.js` 2.959 · `scrivi.js` 1.747 · `letture_data.js` 1.684 |
| `tools/` (`lib`, `it/*.{js,py}`, `pt/*.{js,py}`) | 19.034 | `it/build_course.py` 1.405 · `pt/check_letture.py` 862 · `pt/test_conjugator.js` 694 · `pt/ortografia.js` 641 |

El código del alumno (núcleo + paquete, sin datos generados) ronda las 28.000 líneas por idioma.
El «paquete» del idioma no es solo datos: `diagnosi.js` + `scrivi.js` + `conjugator.js` +
`rules.js` son 5.600 (it) / 6.300 (pt) líneas de lógica que viven fuera del núcleo.

### Lo que baja el teléfono (`peso.js`, con las listas de `Boot.coreFiles()` y `Boot.langFiles()`)

| Parte | Archivos | Sin comprimir | gzip |
|---|---|---|---|
| Caparazón (`index.html`, css, `boot.js`, fuentes Atkinson, íconos) | 14 | 197 KB | 157 KB |
| Núcleo (`docs/js/*` + `tres_lenguas_data.js`) | 28 | 948 KB | 310 KB |
| Paquete **it** (25 `.js` + theme + 2 fuentes + 4 JSON) | 32 | 5.522 KB | 1.510 KB |
| Paquete **pt** | 32 | 4.910 KB | 1.418 KB |
| **Total it** | **74** | **6,36 MB** | **1,89 MB** |
| **Total pt** | **74** | **5,77 MB** | **1,80 MB** |

Dentro del paquete, los JSON son el 73 % (it: 4,06 MB / 980 KB gz). Los cinco archivos más
pesados: `it/data/course.json` 2.340 KB (542 gz), `frequenza.json` 924 KB (227 gz), `bank.json`
679 KB (179 gz), `tramo_data.js` 426 KB (137 gz), `scrivi.js` 183 KB (61 gz). En el núcleo,
`app.js` es 310 KB (92 gz), un tercio del total.

Contra v2.5 (5,99 MB / 71 pedidos): +6 % de peso y +3 archivos, por el tramo.

### `boot.js` ORDER

53 entradas (27 núcleo, 25 paquete, 1 compartida), cargadas **una por una** (`load()`,
`boot.js:128-142`: cada `script` se agrega en el `onload` del anterior). Después de la 53
(`app.js`), recién ahí, salen los cuatro `fetch` de `Boot.DATA` (`app.js:5574-5591`). En total
son 74 pedidos en serie por bloques, no en paralelo. `index.html` tiene un solo `<script>`.

### `course.json` y `bank.json`

| | it | pt |
|---|---|---|
| `course.json` | 2.340 KB · 3.716 ítems · 52 semanas · 339 desafíos · 2 fuentes | 1.662 KB · 2.464 ítems · 52 semanas · 0 desafíos |
| reparto | ítems 1.527 KB · semanas 689 KB (lecciones 272) · desafíos 251 KB | ítems 1.153 KB · semanas 613 KB (lecciones 328) |
| por semana (`weeks[n].items` + la semana) | mediana **36 KB**, mín 19, máx 686 | mediana **33 KB**, mín 26, máx 183 |
| `bank.json` | 679 KB · 1.827 nombres · 636 verbos · 423 adj · 354 palabras · 864 oraciones · 584 errores | 616 KB · 1.836 · 674 · 448 · 463 · 700 · 524 |
| `glossario.json` | 114 KB · 3.018 entradas | 144 KB · 3.621 |

En it, 278 ítems (116 KB) no están en ninguna `weeks[n].items` y 1.016 ítems (27 %) tienen
`wk: 1` (`build_course.py:869` da la primera semana en que se *puede* pedir, no a la que
*pertenece*). Es decir: el JSON sabe qué se puede jugar cuándo, pero no está partido por semana.

### `.git`

31 MB (`size-pack` 29,84 MiB, 224 commits). Sumando los blobs del historial por ruta:
`docs/lang/it/data/course.json` 44,8 MB en 20 versiones, `docs/data/course.json` (ruta vieja)
34,6 MB en 22, `docs/lang/pt/data/course.json` 21,1 MB en 13, `docs/js/app.js` 20,5 MB en 93,
`docs/data/bank.json` 7,4 MB. Los tres `course.json` son 100 MB de blobs sin comprimir: cada
`npm run build` commiteado suma 2-4 MB al historial.

---

## 4. Lo que ya está bien (y conviene no romper)

- **El núcleo no nombra un idioma.** `boot.js` + `pack.js` hacen que el mismo código corra
  en el navegador y en node en el mismo orden; los tests de un idioma cargan el paquete entero
  con una línea (`pack("pt")`). Es la base que hace posible cualquier refactor sin bundler.
- **Los tests de contenido son muchos y baratos.** ≈ 291.600 comprobaciones en 231 s, con
  cobertura real de la didáctica: sillabo («nada antes de su teoría», 17.804 controles en
  `test_orden_lecciones.js`), distractores que no regalan la respuesta, notas en todos los
  ítems, glosas en las lecturas, huecos, tramo. Un cambio de contenido malo se nota.
- **El build reproduce los datos** (ver §2) y el CI lo verifica para `data/` y `tramo_data.js`.
- **El sillabo como dato.** `sillabo.py`, `MIN_WEEK`, `wk` en cada ítem, `week` en escenas,
  lecturas y reglas del laboratorio: casi todo el contenido ya sabe *desde cuándo* vale. Es la
  mitad del modelo unificado que falta.
- **El guardado resiste basura** en los campos base (`sanitize`, `engine.js:614-673`), tiene
  prefijo por idioma y aparta lo ilegible como `.damaged`. Ya existe un mecanismo de migración
  por idioma (`SAVE.syllabus`, `SAVE.load`, `rules.js`) aunque sea ad hoc.
- **La Biblioteca ya carga a demanda**: `index.json` precacheado y un `<id>.json` por libro
  que se baja al abrirlo (`biblioteca.js:467`) y no entra en `Boot.langFiles`. Es el molde para
  hacer lo mismo con las semanas.
- **El tramo C1 se genera desde JSON por semana** (`tools/<código>/tramo/wNN.json` →
  `tramo_data.js`, `build_tramo.js`): un formato de contenido semanal legible, con test propio
  (396 controles). También es molde.
- **Los generados dicen que lo son** (`tramo_data.js:1-2`, `formule_data.js`) y las herramientas
  llevan docstring con qué leen y qué escriben.
- **`tools/pt/CONTENIDO.md`** existe y es bueno: reglas de variedad, el temario como fuente
  única, campos de cada tipo de ítem, límites de las lecciones. Es lo que hay que copiar al
  italiano.
- **La duplicación es mucho menor de lo que parece**: el 90 % de la lógica está en `tools/lib`
  y en el núcleo; lo repetido son los tests de idioma y la simulación.

---

## 5. Lo que falta para 3.0

### T1. Un modelo de contenido con ids que se crucen · ALTA · M

**Qué pasa hoy.** Cada fuente tiene su propia forma y su propia clave:

| Fuente | Clave | Ejemplo |
|---|---|---|
| `bank.json` nombres/verbos/adj/palabras | ninguna: arrays posicionales `[palabra, género, plural, es, tema, nivel, nota]` | `["casa","f","case","casa","casa","A1",""]` |
| `bank.json` oraciones / errores | ninguna (objetos con `es`, `it`, `w`) — en pt la clave también se llama `it` | `{"es":…,"it":[…],"w":14}` |
| `course.json` ítems | `id` con 8 formatos (`d16-001`, `rf-3-2`, `s:r20-01:a`, `l5-c-1`, `g3-va-2`…) | 3.716 únicos |
| `glossario.json` | la palabra misma → `[forma, glosa, semana]` | `"bambina": ["bambina","nena",1]` |
| semanas `vocab` | arrays `[palabra, es, ejemplo, nota]` | 745 (it) / 768 (pt) |
| `letture_*` | `id` por texto; glosas por palabra | 52 + episodios |
| `frasi_data.js` | escena con `id`; frase = array sin id (358 it / 455 pt) | `["Ciao, come stai?", …]` |
| `dictogloss_data.js` | ninguna (por `week`) | |
| `tramo/wNN.json` | por semana; lectura/escucha/tarea sin id | |

Medido: en it, de los 3.181 lemas del banco solo 1.044 están en el glosario; de las 745
palabras de la semana, 275 están en el glosario y 451 en el banco; de las 578 glosas de las
lecturas semanales, 254 están en el glosario. En pt la semana sí va al glosario (766/768) pero
solo 274 al banco. **Hoy no se puede responder «¿dónde apareció esta palabra?» ni «¿qué ítems
ejercitan esta regla?»**: la palabra del banco, la de la semana, la de la lectura y la del
ejercicio son cuatro strings que a veces coinciden.

**Por qué importa para el 3.0.** Casi todo lo didáctico que se quiera sumar cruza fuentes:
repaso de una palabra *en su contexto* (la frase donde salió), «esta regla la viste en la
lección 11 y en la lectura de la 12», cobertura real por semana, ejercicios generados desde
las lecturas, un banco que sepa qué ya se ejercitó. Sin ids, cada feature nueva vuelve a
inventar el cruce por string.

**Propuesta.**
1. Un id estable por lema (`lem:casa`, o el propio lema normalizado + POS) y por unidad de
   contenido (`fr:ciao:03`, `dg:w12`, `lt:w-12`, `tr:w27:lettura`), asignado en las fuentes
   Python/JS de `tools/`, no a mano en los generados.
2. Un **índice inverso generado en el build** (`tools/lib/indice.py` → `data/indice.json`,
   cargado a demanda): `lema → {banco, semana, lecturas[], frases[], ítems[], dictogloss[]}` y
   `regla → {lección, ítems[], lecturas[]}`. Se arma tokenizando lo que ya existe con
   `lessico.py` (que ya sabe desde qué semana se conoce cada palabra).
3. Un test en `tools/lib/` que falle si un id se repite o si una palabra de la semana no está en
   el banco ni en el glosario (hoy son 294 en it).
4. `bank.json` con objetos en vez de arrays posicionales, o al menos un `FIELDS` publicado por
   lista (`Banca.load` ya sabe el orden; el que escribe contenido no).

**Costo.** M: los ids y el índice son mecánicos; lo que cuesta es decidir la clave del lema
(lema vs. forma, homógrafos) y revisar los 294 + 500 huecos que el test va a mostrar.

### T2. Un esquema del estado del alumno, con versión y migraciones · ALTA · S–M

**Qué pasa hoy.** `baseSave()` (`engine.js:546-586`) declara 38 campos con comentario; es la
única documentación del estado. Pero el núcleo escribe **35 campos más** que no están ahí ni en
`rules.save.blank` (`goalV`, `syllabusV`): `storie`, `biblio`, `scritti`, `scrittiDraft`,
`esame`, `esameDraft`, `tramo`, `dictogloss`, `ascolto`, `duelli`, `escritos`, `escrituraPlus`,
`ubicacion`, `porque`, `ref`, `strands`, `boost`, `hintLevels`, `mcGloss`, `ltOff`, `readSess`,
`readParts`, `parlaLog`, `weakDone`, `suoniDone`, `perfectWeeks`, `dailyDone`, `dailyWon`,
`firstRound`, `pauseAsk`, `remind`, `shieldUsed`, `balancedDay`, `aiNotes`, `asked`. `sanitize`
no los mira (es lo que A5 reprodujo con `storie: {}`). No hay `state.v`: la única versión es
`srsV` (fichas) y las dos de idioma. La migración es «cada idioma hace lo que puede en
`SAVE.load`».

**Por qué importa.** Cada módulo didáctico nuevo agrega su campo a mano; en 3.0 van a ser
varios más (y probablemente cambie la forma de alguno, como el plan semanal). Sin versión, un
cambio de forma se convierte en `if (typeof x === "string")` para siempre, y una copia importada
de una versión vieja puede romper la app sin aviso (A5, A6).

**Propuesta.**
1. Que cada módulo declare su rincón: `Tramo.state = { key: "tramo", blank: {…}, sanitize: fn }`,
   y que `Engine.sanitize` los recorra (los módulos ya reciben `H.state()`; falta que devuelvan
   su esquema). Con eso desaparecen los 35 huérfanos.
2. `state.v` (entero) y una lista `MIGRATIONS = [{ v: 2, up: fn }, …]` en `engine.js`, corrida
   en `load()` y en `importSave()` (hoy la importación saltea `SAVE.load`, `app.js:3680`).
3. Exportar en sobre `{ app: "c1", lang, v, save }` (A6) y rechazar en la importación un sobre
   de otro idioma.
4. `ESTADO.md` (o una sección en `ARQUITECTURA.md`) generado desde los `blank` de los módulos:
   campo, tipo, quién lo escribe, desde qué versión.
5. Test en `tools/lib/test_estado.js`: fuzz de cada campo declarado (hoy solo se prueban los
   base) y «ningún `state.x` en `docs/js` fuera de la lista».

**Costo.** S–M. El punto 1 es una tarde por módulo (14 módulos); 2-5 son un día.

### T3. Contenido cargado a demanda por semana · ALTA · M

**Qué pasa hoy.** `course.json` se baja entero (2,34 MB it / 542 KB gz) y se parsea entero en
cada arranque, y `itemMap = Drills.itemsById(course)` (`app.js:5600`) lo indexa todo en
memoria. La semana mediana usa 36 KB. `bank.json` (679 KB) y `frequenza.json` (924 KB) también
van enteros, y la frecuencia solo sirve para el medidor de cobertura.

**Por qué importa.** El 3.0 didáctico va a agrandar el contenido por semana (más lectura, más
escucha, más géneros, más vocabulario en contexto). Con el modelo actual, cada KB de contenido
nuevo se suma a la primera carga de *todas* las semanas y al parseo de cada arranque. Ya hoy en
4G lenta eran 17-18 s (A3).

**Propuesta (sin bundler, con lo que ya hay).**
1. `build_course.py` escribe además `data/settimane/wNN.json` (la semana + sus ítems + su
   lección) y deja en `course.json` solo `seasons`, `weeks` sin `lesson` ni ítems, y los ítems
   «de todas las semanas» (repaso). Molde: la Biblioteca (`index.json` + `<id>.json`).
2. `app.js` carga la semana actual y la siguiente al arrancar (`Boot.DATA` +
   `<link rel=preload>` desde `boot.js`, como pedía A3) y las demás al tocarlas; el SW las
   guarda con la estrategia de los libros (a demanda, no en la instalación).
3. El repaso (`Drills`) pide los ítems por id a un `Course.item(id)` que sabe en qué semana está
   y la trae si falta. Es el único punto que hoy asume que `itemMap` está completo.
4. `frequenza.json` a demanda (solo Io / cobertura) y el tramo partido igual (`tramo/wNN.json`
   ya existe como fuente; hoy se pega en un `tramo_data.js` de 426 KB).
5. A la vez, A3: los 53 scripts insertados de una vez con `async = false`.

**Costo.** M. El corte del JSON es una tarde; el trabajo está en `Drills`/`app.js` donde se
asume el mapa completo (36 lecturas de `course.weeks[` en el núcleo) y en el SW. Se prueba
con el smoke y con `sim_carriera`, que ya recorren el año entero.

### T4. Tests de contenido: qué controla el CI y qué no · ALTA · S

**Controla** (`test.yml`): `npm test` (291.600 comprobaciones sobre datos y lógica en node),
que `data/` y `tramo_data.js` se reproduzcan, y que `sw.js` y `app.js` digan la misma versión.

**No controla:**
- nada de `app.js` en ejecución (B3): el smoke pasa a mano en 65 s pero no está en el CI;
- `check_lessons.py`, `check_letture.py` × 2 (B4): pasan en 3 s y no los corre nadie;
- la Biblioteca (B1): ni el build ni el diff;
- `formule_data.js` y el resto de `docs/` fuera de `data/` (B2);
- `sim_carriera` (B4): corre a mano, tarda 24 s, y hoy termina con 0 aunque la semana 31 (it) quede sin dominar y pt tenga 30 errores del gimnasio y 14 ítems duplicados;
- lint (B11);
- el tamaño: nadie avisa si `course.json` o la carga crecen.

**Propuesta.** `test:content` con los tres `check_*.py` dentro de `npm test`; `build` con
`build_biblioteca.js` (con la caché `tools/.cache/` que ya existe, ver §2); en el CI
`git diff --exit-code -- docs/` + `git status --porcelain docs/`; un job `smoke` con
`npx playwright install chromium` (hoy son ~65 s); `eslint` con la config de §2;
`sim` con `process.exitCode = 1` si una semana queda sin dominar; `concurrency` y
`timeout-minutes`; y un `tools/lib/peso.js` que falle si el paquete gz supera un tope
(hoy 1,89 MB). Todo S: son líneas de YAML y de `package.json`.

### T5. Documentación para quien aporta contenido · ALTA · S

- `tools/pt/CONTENIDO.md` (128 líneas) es el único documento de autoría. Cita `tools/curriculo.py`
  y `docs/js/conjugator.js` (hoy `tools/pt/curriculo.py`, `docs/lang/pt/conjugator.js`).
- Para el italiano no hay equivalente: lo más cercano es el docstring de
  `tools/it/lessons/__init__.py` (24 líneas, formato de lección) y el docstring de `sillabo.py`.
  `README-italiano.md` explica la didáctica (bien) pero su «Estructura del repo»
  (l. 817-851) y su tabla de tests (l. 898-918) describen el repo de un idioma solo.
- Los formatos que un autor necesita conocer están en cinco lugares distintos: ítems
  (`authored/*.py`, documentados solo en pt), lecciones (`lessons/__init__.py`), lecturas
  (comentario de `letture_settimana.js`), dictogloss (comentario de `dictogloss_data.js`), tramo
  (docstring de `build_tramo.js`, sin la forma de `wNN.json`: `lettura{title,emoji,genre,grammar,
  text,gloss,questions,vf,hunt}`, `ascolto{…,speakers,turns}`, `compito{genre,title,fonte,t,es,
  min,max,punti,model,gloss}`), frases (comentario de `frasi_data.js`).

**Propuesta.** Un `tools/CONTENIDO.md` común (qué formatos hay, con un ejemplo mínimo de cada
uno y el test que lo controla) más `tools/it/CONTENIDO.md` con lo específico (variedad,
sillabo, fuentes) espejando el de pt; y un test de rutas citadas en los `.md` (B8), que hoy
encontraría 29. Cuando T1 fije los ids, el documento se escribe una vez. S.

### T6. El pipeline de build · MEDIA · S

`npm run build` = 5 pasos python (`build_bank.py` × 2, `build_course.py` × 2, `formule.py`) +
1 node (`build_tramo.js`), en serie, sin caché ni grafo: si cambia una frase de pt se
recompila el italiano entero. Afuera quedan `build_biblioteca.js` (node, 15-45 s, red) y
`build_frequenza.py` (python, red: `urllib` a GitHub, `build_frequenza.py:29-41`). El mismo
formato de lección se valida en python (`check_lessons.py`) y en node (`test_lecciones.js`).

No hace falta unificar el lenguaje (los extractores de EPUB y `lessico.py` son python natural;
el núcleo es JS): hace falta **un solo punto de entrada que sepa qué depende de qué**.
Propuesta: `tools/build.py` (o `build.js`) con la lista de pasos, sus entradas y salidas, que
corra solo lo que cambió y tenga `--all`; `npm run build` lo llama. Documentar el grafo en
`ARQUITECTURA.md`. S.

### T7. Tests y simulación compartidos entre idiomas · MEDIA · M

B9 sin cambios: 2.652 líneas iguales, `sim_carriera.js` al 98 %, y 29 `function ok` distintas
en los tests. Propuesta: `tools/lib/testkit.js` (`ok`, `eq`, contador, salida con tiempo por
script) y `tools/lib/sim_carriera.js <código>`; después, `test_game`/`test_memoria`/`test_frasi`
como `tools/lib/test_*.js` que iteran `pack.LANGS` con una tabla de parámetros por idioma
(ya lo hacen `test_lecciones.js` y `test_huecos.js`). Un tercer idioma costaría entonces
contenido, no tests. M.

### T8. `app.js` · MEDIA · L (empezar por S)

B10 creció: 5.620 líneas, 269 funciones, `render()` de 28 ramas. Los módulos nuevos ya viven
afuera y entran por objetos `H` (`Tramo.attach(H)`, `Referencia.attach`, `Biblioteca.init`,
`Porque.init`), pero cada uno con su propia lista de callbacks; no hay un registro de pantallas.

Propuesta en tres escalones: (S) `App.screen(nombre, {render, wire})` y que `render()`/`wire()`
consulten el registro antes de la cadena de `if`; los seis módulos que ya están afuera se
anotan ahí. (M) Mover la lógica pura que se puede testear en node (plan del día, misiones,
badges, rachas: hoy dentro de `app.js`) a `js/plan.js` y probarla con `pack`. (L) Sacar una
pantalla por vez (Io, Percorso, Gioco) a su archivo. Hacerlo recién con el smoke en el CI (T4).

### T9. Orden de la casa · MEDIA · S

- Sacar `bank_dummies.json` y `bank_routledge.json` de `docs/` a `tools/it/fuentes/` (B6):
  cambio de dos rutas en `build_course.py:968-970`.
- Archivar o arreglar `tools/it/audit/` (B5): 952 KB que no corren.
- Una sola versión (B7): `package.json` en `2.8.0`, y el CI comparando los tres.
- Lint en el CI con la config de §2 (B11), después de arreglar los cuatro errores.
- `AUDITORIA-*.md`, `PROPUESTAS.md`, `VOCES.md` a `auditorias/` con un índice (B11).
- `.git` (31 MB, +3 desde v2.5): si los generados van a crecer (T3 los parte en 52 archivos
  por idioma), vale más publicar Pages con Actions y dejar de commitear `data/`; si no, aceptar
  2-4 MB por build.

### Costo y orden

| Escalón | Qué | Esfuerzo | Desbloquea |
|---|---|---|---|
| 1 | T4 (CI completo) + T9 (orden) | S | que lo que sigue no se rompa sin avisar |
| 2 | T2 (esquema del estado) | S–M | módulos didácticos nuevos con estado propio; importación segura |
| 3 | T3 (semanas a demanda) + A3 | M | crecer el contenido por semana sin pagarlo en cada arranque |
| 4 | T1 (ids + índice inverso) + T5 (docs) | M + S | repaso en contexto, cruces palabra ↔ lectura ↔ ejercicio, aportes externos |
| 5 | T6, T7, T8 | S, M, L | mantenimiento; un tercer idioma barato |

Los escalones 1-3 se pueden hacer sin tocar contenido y sin que el alumno note nada (salvo que
la app abre más rápido). El escalón 4 es el que cambia lo que se puede enseñar.
