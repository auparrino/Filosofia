# Auditoría F (v2.8): los módulos que crecieron alrededor del núcleo

Sobre `main` en v2.8 (`4a70be0`, merge del PR #55). Solo lectura: no se cambió código, contenido
ni datos. Las mediciones se hicieron con `tools/lib/pack.js` en node (los dos idiomas, sin
`app.js`), con `grep` sobre `docs/js/app.js` para reconstruir cómo se llega a cada pantalla, y con
tres scripts que quedaron en el scratchpad (`inv.js`: la forma de cada `*_DATA`; `count.js`: los
conteos; `sample.js`: 20-30 ítems de cada módulo en cada idioma, guardados en `sample.out`).

Alcance: los módulos que el README casi no documenta: `tramo`, `biblioteca`, `escritos` (+
`variaciones`, `ctest`, `ordenar`), `escritura_plus`, `tres_lenguas`, `mapas`, `ubicacion`,
`referencia`, `desglose`, `formule`, `frequenza`, y los ya conocidos pero que conviene ubicar en el
mapa (`letture` con sus cinco series, `suoni`, `voci`, `lab`, `duelli`, `frasi`) más el examen C1
(`esame_data` y las funciones `esame*` de `app.js`).

**Fuera de alcance, a pedido:** todo lo que use la voz del alumno. Escuchar audio y la voz del
teléfono sí entran.

---

## Resumen: los 8 principales

| # | Prioridad | Qué | Dónde | Esfuerzo |
|---|---|---|---|---|
| 1 | Alta · núcleo | Cultura e Inundaciones dicen «opcional» en la ficha pero **bloquean la semana**: la misión no lleva `opt` y `pendingToAdvance` la cuenta | `js/app.js:1598-1605`, `:1683` | S |
| 2 | Alta · didáctica | Cinco caminos de escritura con tres correctores distintos: Scrivi, Tarea del tramo, Escritura plus, Escritura guiada y la Scrittura del examen. Solo Scrivi alimenta el perfil de errores; el examen sigue con la fórmula de v2.5 (20/20 a cualquier texto largo) aunque `Tramo.evaluate` ya resuelve eso | `app.js:4818-4822`, `tramo.js:115-157` | S–M |
| 3 | Alta · contenido | El 90 % de las palabras legibles de la app (353 k it / 525 k pt, la Biblioteca) vive fuera del percorso, sin misión, sin semana de apertura en 6 de 7 libros (it) y 4 de 9 (pt), y ningún test de extremo a extremo la abre | `biblioteca/index.json`, `sim_carriera.js`, `smoke_browser.js` | M |
| 4 | Alta · repo | De los 21 módulos, **11 no aparecen ni en la simulación ni en el smoke**: tramo (escucha y tarea), suoni, duelos, escritos, escritura plus, biblioteca, referencia, tres lenguas, ubicación, examen (ascolto, scrittura) y voci. `test:lib` los prueba en node, pero nadie los abre con `app.js` | `tools/*/sim_carriera.js`, `tools/lib/smoke_browser.js` | M |
| 5 | Media · UX | Módulos poco descubribles: «Mi gramática» ya tiene buscador y estados pero está enterrada en Io y Allena; Escritura plus solo aparece dentro de la pantalla de Scrivi; Tres lenguas exige progreso en los dos idiomas; el test de ubicación se ofrece una sola vez | `app.js:3455`, `:4865`, `tres_lenguas.js:282-286`, `ubicacion.js:327-333` | S |
| 6 | Media · pt | Asimetrías del portugués: 0 oraciones grabadas (Common Voice) → ni dictado con voz real ni «¿Qué forma escuchaste?»; fórmulas fijas en 4 semanas (it: 12); 9 escenas de mapas (it: 16); una sola voz preferida en Lingua Libre | `pt/voci_cv_data.js`, `pt/formule_data.js`, `pt/mapas_data.js` | M |
| 7 | Media · lengua | Detalles de contenido: nota de la negación de Variaciones en portugués cuando todo lo demás va en castellano; consignas del examen (Ascolto) todavía en castellano; los «puntos de la consigna» del tramo se detectan por palabras clave que castigan al que escribe con otras palabras (*argentina*, *renata*, *mia città*) | `pt/variaciones_data.js:116`, `esame_data.js`, `tramo/wNN.json` | S |
| 8 | Media · docs | Doce módulos no están en ningún README: Escritura guiada, Variaciones, C-test, Ordená, Tres vueltas, Reformulación, Mapas, Ubicación, Mi gramática, Desglose (una línea), Tres lenguas (una línea en ARQUITECTURA), Frecuencia (parcial) | `README-*.md`, `ARQUITECTURA.md` | S |

**Orden sugerido.** Primero el 1 (una línea) y el 7 (datos). Después el 2, que ordena la
escritura y le da al examen el evaluador que ya existe. El 4 (que el smoke y la simulación abran
estos módulos) antes de tocar la arquitectura de contenido del 3.0 (sección 4), porque esa
reorganización mueve pantallas y hoy nadie las prueba con `app.js`.

---

## 1. Inventario

### 1.1 La tabla

«Entrada» es cómo se llega desde la interfaz, verificado en `app.js` (la pestaña o la misión y
la línea). «Ítems» cuenta lo que trae el paquete de cada idioma (`count.js`). «Alimenta» dice si
lo que se hace ahí entra al repaso (tarjetas `state.cards`), al perfil de errores
(`state.errs` / `errLog`) o a las cuerdas de Nation (`Engine.addStrand`). «Misión» dice si el
percorso lo pide: **obligatoria** (bloquea la semana siguiente), *opcional* (`opt: true`) o no.

| Módulo | Qué hace | Entrada desde la UI | Ítems it / pt | Estado que guarda | Alimenta SRS · errores · cuerdas | Test | Misión |
|---|---|---|---|---|---|---|---|
| `tramo.js` | Escucha larga a dos voces y tarea integrada, semanas 27-51 | Misiones `tr-asc` / `tr-scr` (`app.js:1607`); lista «Escuchas largas» en Leggi (`:871`) | 24 escuchas (10.0 k / 10.3 k palabras) · 24 tareas (120→250 palabras) · 8 géneros | `state.tramo.{asc,scr,draft}` | no · **no** · sí (input/output) | `test_tramo.js` (153 l.) | **obligatoria** ×2 por semana |
| `letture.js` serie `lunga` | La lectura larga del tramo con el lector de siempre | Misión `ep` (`:1600`), Leggi | 24 (621 / 612 palabras prom., 5 preg. + 5 V/F en la lengua) | `state.letture[id]` | tarjetas `lettura:` · sí · input | `test_tramo.js`, `test_frasi.js` | **obligatoria** |
| `biblioteca.js` | Libros enteros de dominio público, lector paginado, cobertura por semana, «📌 al repaso» | Tarjeta en Leggi (`:852`) e Io (`:3445`); pantallas propias (`Biblioteca.owns`) | 7 libros / 353 k palabras · 9 libros / 525 k palabras | `state.biblio` (pos, done, total, días) + tarjetas `lib:` | tarjetas `lib:` (`drills.js:818`) · no · input | `test_biblioteca.js` (217 l.) | no |
| `escritos.js` | Pegamento de tres prácticas escritas sobre lo ya visto | Bloque «Escritura guiada» en Allena (`:786`); misiones `esc-*` (`:1659`); mitad de las pausas (`:1841`) | ver tres filas siguientes | `state.escritos.{var,huecos,ordenar,wk}` | Variaciones: por la ronda normal (sí · sí) · C-test/Ordená: solo `addStrand` forma | `test_ejercicios.js` (144 l.) | *opcional* ×3 |
| `variaciones.js` | Una frase aprendida, cambiando una pieza (persona, negación, cosa, pasado, plural) | Allena → Escritura guiada; misión `esc-var` | 29 marcos / 93 variantes · 28 / 81 | tarjetas `var:` marcadas `nocard` | ronda normal (Diagnosi) · sí · forma | `test_ejercicios.js` | *opcional* |
| `ctest.js` | C-test (mitad de cada segunda palabra) y cloze racional (conectores y preposiciones) sobre textos leídos | misión `esc-huecos` (desde la semana 2), Allena | 158 / 168 fuentes (lecturas + dictogloss); ≤ 25 huecos | `state.escritos.huecos` | no · no · forma | `test_ejercicios.js` | *opcional* |
| `ordenar.js` | Reordenar párrafos u oraciones de un texto leído, con los conectores como pista | misión `esc-ordenar` (desde la 3), Allena | 158 / 168 fuentes; 31 conectores + 39 preps (it), 24 + 32 (pt) | `state.escritos.ordenar` | no · no · forma | `test_ejercicios.js` | *opcional* |
| `escritura_plus.js` | «Tres vueltas» 5/4/3 min sobre la consigna de Scrivi, y «Reformulación» (tu texto como lo diría un nativo) | Dos botones dentro de la pantalla de Scrivi (`:4865`, `:4924`) | 48 tareas por idioma (las de Scrivi) | `state.escrituraPlus.cards` + tarjetas `ep:` | tarjetas `ep:` (`drills.js:817`) · **no** · output | `test_escritura_plus.js` (117 l.) | no |
| `tres_lenguas.js` | Contrastes it ↔ pt ↔ es, duelo «¿de qué lengua es?», categoría de error `otra_lengua` en Diagnosi | Tarjeta en Allena (`:801`), pantalla `tres`; abierta solo con progreso en los dos idiomas o a mano | 170 contrastes (59 gram, 84 lex, 27 orto) + 140 pares + 61 ítems de duelo, compartidos | `localStorage["c1.tres.v1"]` (fuera del prefijo del idioma y de la copia) | no · sí (categoría `otra_lengua` al corregir) · xp | `test_tres_lenguas.js` (186 l.) | no |
| `mapas.js` | Dibujos SVG de las preposiciones de lugar, bloques de lección y «elegí mirando el dibujo» | Dentro de la lección de la semana 9 (`Mapas.install`, `:5599`; figuras `:1182`, `:1308`, `:1446`) | 16 escenas / 2 bloques / 10 preguntas · 9 / 2 / 7 | (lo de la lección) | como la lección | `test_mapas_ubicacion.js` (148 l.) | dentro de la lección (**obligatoria**) |
| `ubicacion.js` | Test de ubicación adaptativo (≤ 25 preguntas) con los ejercicios del curso; abre semanas | Banner en Oggi solo con guardado virgen (`:477`, `ubicacion.js:161-165`); tarjeta en Io (`:3465`) | banco de 2.283 / 1.482 ítems reutilizados del curso | `state.ubicacion` {start, from, level, asked, right} | no · no · no | `test_mapas_ubicacion.js` | no |
| `referencia.js` | Concordancias («¿Cómo se usa?») al tocar una palabra y «Mi gramática»: índice buscable de los bloques vistos con estado vista/practicada/dominada | Botón en el glosario de tocar (`:1047`), en las palabras de la semana (`:1745`) y en «Palabra por palabra» (`:314`); tarjeta en Allena (`:788`) e Io (`:3455`); pantalla `gramatica` | 279 bloques / 4.155 oraciones de corpus · 340 / 4.849 | `state.ref` (mini ejercicios) | no · lee `errLog` · xp (3/1) | `test_referencia.js` (161 l.) | no |
| `desglose.js` | «Palabra por palabra»: pronombres, clíticos, tiempos compuestos, elisión, locuciones | `<details>` en la corrección (`:306-311`, `:2653`) y en el lector de la Biblioteca (`biblioteca.js:744`) | reglas en `LANG.rules.desglose` (38 / 39 claves; 46 locuciones cada uno) | — | — | `test_desglose.js` (253 l.) | (dentro del feedback) |
| `formule.js` | «Fórmula fija»: la frase que se adelanta a su gramática y el paso «Ya lo venías usando» en la lección | Línea en la tarjeta de la frase (`:2875`) y paso extra de la lección (`:1387`) | 63 frases / 12 semanas · 32 / 4 semanas | — | — | `test_fix_frases.js` | dentro de la lección |
| `frequenza.js` | Capa de frecuencia: cobertura por nivel, «frecuentes que faltan», pseudopalabras, distractores por banda | Tarjeta «Tu vocabulario» en Io (`:3528`), botón «Practicar estas» (`b-freq`, `:1875`), «Parola o no?» en Oggi (`:521`) | 17.206 lemas / 16.232 | (tarjetas `v:` / `b:` por la ronda) | sí (por la ronda) · sí · forma | `test_suoni.js`, `test_biblioteca.js` | no |
| `letture.js` (resto) | `settimana` (52), `martin` (13 / 10), `cultura` (10 / 23), `flood` (12 / 12) | Misión `ep` por semana (`:1598`), Leggi | 87 / 97 textos; V/F solo en `settimana` y `lunga` | `state.letture` | tarjetas `lettura:` · sí · input | `test_frasi.js`, `check_letture.py` | **obligatoria** (incluidas cultura y flood: ver 2.1) |
| `suoni.js` | Pares mínimos HVPT, habla conectada, entonación, acento, dictado, «¿qué forma escuchaste?», dictogloss | Misión `suoni` hasta la 40 (`:1638`), `dictogloss` (`:1643`); Allena (`:780`); un ítem en la Pausa | 190 pares + 50 + 50 + 30 · 181 + 48 + 80 + 35; 47 dictogloss cada uno | tarjetas `suoni:`, `state.suoniDone`, `state.dictogloss` | tarjetas · no (dictogloss no) · input | `test_suoni.js` | **obligatoria** ×2 |
| `voci.js` | Grabaciones reales de Lingua Libre para los pares; Common Voice para oraciones | Dentro de Suoni; créditos en Io (`:3460`) | 128 oraciones CV (it) · **0** (pt) | `localStorage` con prefijo del idioma | — | `test_game.js` (índice CV) | — |
| `lab.js` | Ponte (cognados), Falsos amigos, Capire (input estructurado) | Allena (`:771`); misiones `ponte` / `falsi` / `capire` (`:1610-1626`) | 9 reglas · 121 palabras · 28 falsos · 6 sets / 76 ítems — 16 · 196 · 103 · 10 / 127 | tarjetas `ponte:`, `falso:`, `capire:` | sí · sí · forma | `test_frasi.js` | **obligatoria** |
| `duelli.js` | Dos formas que compiten, con «¿qué te lo dijo?» | Allena (`:790`); misión `duello` la semana que se abre (`:1656`) | 8 duelos / 80 ítems · 8 / 166 | `state.duelli[id].pct` + tarjetas `duel:` | tarjetas (`drills.js:816`) · sí · forma | `test_game.js`, `test_fix_contenido_pt.js` | *opcional* |
| `frasi.js` | Escenas de conversación, «Adiviná», fichas, escritura de memoria, Lampo | Allena (`:825`), Oggi (Pausa, Lampo, escena), misión `scene` (`:1593`) | 21 escenas / 358 frases (100 % con nota) · 26 / 455 (100 %) | tarjetas `frase:` | sí · sí · fluidez/forma | `test_frasi.js` | **obligatoria** |
| Examen C1 (`esame_data.js`, `app.js:4617-4850`) | Cinco pruebas: Ascolto, Lettura, Strutture, Lessico, Scrittura | Misión `play` de la semana 52 (`:1561`, `:1693`) | 2 escuchas (306-319 / 462-474 palabras, 8 preg. + 4 huecos) · 2 lecturas (585-607 / 591-621, 8 títulos + 8 V/F) · 2 escritos (200 + 120) · 81 strutture + 52 lessico (it) / 78 + 86 (pt), ítems del curso con `topic: "esame"` | `state.esame`, `esameDraft` | Strutture/Lessico por la ronda `esame` (sin reintento, `:2361`) · no · output (scrittura) | `test_suoni.js` (datos) | **obligatoria** (semana 52) |

Cómo se contó: `count.js` carga cada idioma con `pack.js` y recorre `TRAMO_DATA.SETTIMANE`,
`biblioteca/index.json`, `VARIACIONES_DATA.frames` (+ `Variaciones.variants(f, 52)`),
`Letture.EPISODI` por serie, `AscoltoData`, `LAB_DATA`, `DUELLI_DATA`, `FRASI_DATA`, `EsameData`,
`Ubicacion.pool(course)`, `Referencia.grammar(52)` y `Referencia.corpus()`, `FORMULE_DATA`,
`TRES_LENGUAS_DATA` y `frequenza.json`. Las palabras son tokens separados por espacio.

### 1.2 Fichas cortas

**Tramo C1 (`tramo.js`, `tools/<código>/tramo/w27..w51.json` + `generi.json`, 25 archivos por
idioma).** Es el módulo más sólido de los nuevos. Cada semana trae `lettura` (título, género,
gramática, texto, glosa, 5 preguntas de opción múltiple y 5 V/F/no se dice en la lengua meta,
caza de formas), `ascolto` (título, género, resumen en castellano, dos hablantes, turnos `[A|B,
texto]`, glosa, 5 preguntas + 2 V/F) y `compito` (género, fuente `lettura` / `ascolto` /
`entrambi`, consigna en la lengua meta, ayuda en castellano, mínimo y máximo, `punti` con palabras
clave, modelo, glosa). Los largos crecen como promete el README: lectura 378 → 875 (it), 386 → 893
(pt); escucha 274 → 549 (it), 305 → 584 (pt); tarea 120 → 250. Géneros de escucha en it: 24
distintos rótulos (intervista radiofonica, podcast, dibattito, conversazione in redazione,
riunione di lavoro, conferenza con domande…); en pt lo mismo (programa de rádio com consultas,
podcast literário, entrevista de história oral, telefonema a uma secretaria universitária…). Dos
voces del teléfono con tono 0,92 / 1,1 y velocidad 1× o 0,9× (`tramo.js:280`). La revisión local
(`evaluate`, `:115-157`) exige extensión, variedad léxica (TTR ≥ 0,45 en 150 palabras, ninguna
palabra > 8 %), no copiar (secuencias de 5 palabras, ≤ 20 %) y el 60 % de los puntos de la
consigna; sugiere apertura/cierre del género, título, párrafos, ≥ 4 conectores y lo que marque el
corrector de la semana. Guarda `state.tramo`. **No** escribe en `state.errs` ni `errLog` (grep de
`errs|errLog|Diagnosi` en `tramo.js`: nada): lo que marca el corrector en la tarea no va al
perfil ni a la Clínica.

**Biblioteca (`biblioteca.js`, `biblioteca_data.js`, `biblioteca/index.json` + un JSON por
libro; 2,8 MB it / 4,0 MB pt).** Fichas: it 7 libros de 1878-1921 (De Amicis, Capuana ×2,
Pirandello, Collodi, Deledda, Salgari), todos `level: C1`, y solo *Novelle* de De Amicis con
`week: 43`; pt 9 libros de 1880-1915 (Machado ×5, Eça ×2, Lima Barreto, Aluísio Azevedo), con
niveles B1 → C1+ y `week` en 5 de 9 (Memorial de Aires 17, Dom Casmurro 21, Quincas Borba 28,
Policarpo 37, Histórias sem data 30, Papéis avulsos 41). Cobertura léxica precalculada por semana
(‰): it 706-790 en la semana 1 → 936-954 en la 52; pt 686-839 → 923-976. `recommend()`
(`:377-391`) elige el capítulo con cobertura ≥ 95 % o el más fácil. Guarda posición, capítulos
leídos, palabras y minutos por día (`state.biblio`) y crea tarjetas `lib:` que el repaso sí toma
(`drills.js:818`, `:826`). Sigue sin estar en `npm run build` (B1 de la auditoría v2.5 abierto:
`package.json` no lo incluye).

**Escritura guiada (`escritos.js` + `variaciones.js`, `ctest.js`, `ordenar.js`;
`escritos_data.js`, `variaciones_data.js`).** Tres prácticas «con lo que ya viste». Variaciones:
29 / 28 marcos con plantilla `{s} {n} {v} {o}` y una lista de variantes por marco (`per`, `neg`,
`obj`, `plu`, `pas`); 93 / 81 variantes a la semana 52, 59 / 46 a la 5. Cada variante es un ítem
`type: "variante"` con `accept` que admite el sujeto explícito y, en pt, *a gente* (bien: `var:socorro:0:0`
acepta *Desculpa, a gente não entendeu*) y el femenino del participio en it (`var:casa:8:3`,
*sono andata*). Pasan por `Engine.grade` y `Diagnosi`, así que sí alimentan el perfil. C-test y
cloze racional se arman al vuelo sobre cualquier lectura o dictogloss hecho (158 / 168 fuentes,
las 158 / 168 sirven para las tres prácticas); solo guardan porcentaje y suman a la cuerda de
forma. Las tres misiones son `opt: true` (`escritos.js:88-105`) y la Pausa trae una la mitad de
las veces desde la semana 2 (`:176-190`).

**Escritura plus (`escritura_plus.js`, `escritura_plus_data.js` = solo el prompt).** «Tres
vueltas» (5/4/3 min sobre la consigna de Scrivi, 40-80 palabras, comparación de palabras, errores
y palabras por minuto entre vueltas) y «Reformulación» (con clave: la IA reescribe sin marcar;
sin clave: el corrector propio aplicado + el modelo de la semana). Las diferencias que el alumno
toca se vuelven tarjetas `ep:` (`:337-340`) que el repaso encuentra (`drills.js:817`). Suma output
y toca la racha (`:484`, `:631`). **No** escribe en el perfil de errores. Entrada única: dos botones
al pie de la pantalla de Scrivi (`app.js:4865`).

**Tres lenguas (`tres_lenguas.js`, `docs/lang/tres_lenguas_data.js`, compartido).** 59
contrastes de gramática, 84 de léxico y 27 de ortografía con el mismo formato `[id, título, it,
pt, es, nota, [ejemplo it, pt, es]]`, 140 pares de palabras, 61 ítems de duelo y las «señales»
(`ç`, `ã/õ`, `nh`, `lh` ↔ `gli`, `-zione`). Se abre solo si hay progreso guardado en los dos
idiomas o si se activa a mano (`:282-286`). Guarda en `localStorage["c1.tres.v1"]` (`:38`),
**fuera** del prefijo del idioma y de la copia de seguridad. Alimenta xp (mitad de los puntos,
`:498`) y la categoría `otra_lengua` del diagnóstico; no crea tarjetas.

**Mapas (`mapas.js`, `mapas_data.js`).** Escenas SVG «fondo × movimiento» con tokens del tema:
it 16 escenas (a-punto, a-hacia, in-zona, in-caja, su, da-desde, da-casa, di-lazo, per-rumbo,
per-por…), 2 bloques que `Mapas.install` suma a la lección de la semana 9, 9 ejemplos y 10
preguntas «elegí la preposición mirando el dibujo»; pt 9 escenas, 2 bloques, 8 ejemplos, 7
preguntas. Solo la semana 9.

**Ubicación (`ubicacion.js`).** Test escrito adaptativo (12-25 preguntas, modelo logístico con
adivinanza y descuido, `SLIP = 0,06`) sobre los ítems del curso que sean de opción múltiple (≤ 4
opciones, stem ≤ 140) o cloze de un hueco (`usable`, `:44-57`): 2.283 ítems en it (por semana
de 5 en la 43 y 7 en la 41 hasta 343 en la 51) y 1.482 en pt (26-31 por semana, 195 en la 51). Al
terminar propone la semana de arranque y `apply()` sube `state.unlocked` sin tocar nada más
(`:169-177`). Se ofrece **una sola vez**, en Oggi, si el guardado está virgen
(`fresh()`, `:161-165`); después queda en Io.

**Referencia (`referencia.js`).** Corpus de 4.155 / 4.849 oraciones (lecturas, frases, banco,
ejemplos de lecciones y palabras) indexado por forma; `concordance("andato", {week})` devuelve
5-8 usos de semanas ya leídas con la forma resaltada (*Sono andato al mare con degli amici*,
`frase:chiacchiere:1`; *Ieri non sono andato a lavorare…*, `b:501`) y un mini ejercicio de dos
versiones (*vado a letto / vado a leto*). «Mi gramática» (`page()`, `:758-771`): los 279 / 340
bloques de las lecciones hasta la semana actual, 116 / 150 con tabla, todos con ejemplos, con
buscador (`#refq`: «congiuntivo» da 38 bloques en it, «subjuntivo» 48 en pt, «crase» 15) y
filtros vista / practicada / dominada calculados con las tarjetas y el `errLog`. Es, en los
hechos, **la referencia gramatical consultable que se pide para 3.0**, con dos límites: solo
hasta la semana desbloqueada y sin entrada desde la lección ni desde el percorso.

**Desglose (`desglose.js`, reglas en `LANG.rules.desglose`).** Funciona bien en los dos idiomas:
*Mi passi il sale* → «*mi*: pronombre átono «me / a mí», objeto indirecto, delante de *passi* —
como en español, va antes del verbo…»; *Ce l'ho fatta* → «*ce l'ho fatta* (de *avere*, presente,
io) — lo logré (*farcela*: *ce* y *l'* no se traducen)»; *Me dá uma mão* → «*me*: … en Brasil va
antes del verbo, aun al empezar la frase; la norma escrita lo pega detrás con guion (*dá-me*)»;
*A gente se viu ontem e não deu certo* → *a gente* «nosotros (con el verbo en 3.ª singular)», *deu
certo* «salir bien». Aparece en la corrección (primer intento fallido, respuesta insegura, frase
nueva de ≥ 3 palabras) y en el lector de la Biblioteca.

**Fórmulas fijas (`formule.js`, `formule_data.js`, lo genera `tools/lib/formule.py`).** it: 63
frases adelantadas en 12 semanas (5: 15, 6: 18, 11: 7, 12: 8, 15-44: 1-4); pt: 32 frases en 4
semanas (5: 17, 6: 8, 8: 1, 11: 6). La línea «🧱 Fórmula fija» y el paso «Ya lo venías usando»
solo existen donde hay datos: en pt, después de la semana 11, nunca.

**Frecuencia (`frequenza.js`, `freq_data.js`, `data/frequenza.json`).** 17.206 / 16.232 lemas con
nivel (itWaC + OpenSubtitles + KELLY; OpenSubtitles pt-BR + VERO + banco). En Io: barras A1-C1,
«fundamentales» conocidas, ocho «frecuentes que te faltan» y el botón «Practicar estas» (ronda
`b-freq` de 12 del banco). En Oggi: «Parola o no?» (pseudopalabras: *cisa*, *mongiare*,
*trobalho*, *menana*) cuando hay ≥ 30 palabras maduras. Todo sale bien en node; no hay diccionario
consultable: la palabra se busca solo tocándola en un texto.

**Examen C1.** Mejoró desde v2.5 en una cosa: ahora hay **dos** versiones de cada prueba (asc-1 /
asc-2, let-1 / let-2, scr-1 / scr-2) y las lecturas piden títulos por párrafo y V/F con la cita
que lo justifica. Quedan de v2.5: las preguntas de Ascolto en castellano (it: *«Según la experta,
¿qué quedó del trabajo remoto…?»*; pt: *«¿Qué corrige la historiadora al principio?»*) mientras
las de la lectura larga del tramo van en la lengua; los 133 / 164 ítems de Strutture y Lessico
son ítems del curso con `topic: "esame"` (`app.js:1868`) y viven en la semana 52, así que se
practican en «Superá la semana» antes del examen; y la nota local de Scrittura sigue siendo
`palabras_ok × 8 + max(0, 12 − duros × 1,5)` (`:4818-4822`).

---

## 2. Coherencia

### 2.1 Cultura e Inundaciones bloquean la semana aunque digan «opcional» · ALTA · S

`weekPlan` (`app.js:1598-1605`) crea una misión `ep` por cada lectura de **todas** las series
(`Letture.SERIES` = martin, cultura, settimana, lunga, flood) cuya semana coincide. El subtítulo
agrega « · opcional» cuando la serie no es martin / settimana / lunga (`:1604`), pero el objeto
**no lleva `opt: true`**. `pendingToAdvance` (`:1683`) considera pendiente todo lo que no esté
`done`, no sea `play2` y no sea `opt`. Resultado: la semana siguiente no se abre hasta leer la
Cultura y la Inundación de la semana.

- **Alcance medido:** en it hay Cultura en 10 semanas (11, 24, 29, 31, 34, 36, 38, 42, 45, 48) e
  Inundaciones en 11 (9, 18, 21 ×2, 22, 25, 31, 34, 36, 37, 40, 44); en pt, Cultura en 21 semanas
  (22 ×2, 24, 25, 26, 28, 31-35, 38, 40-51: 23 textos) e Inundaciones en 11 (6 ×2, 8, 10, 14, 16,
  21, 27, 29, 32, 36, 41). En pt, desde la semana 40, **todas** las semanas no jefe tienen un
  texto «opcional» que bloquea.
- El README dice «Cultura (opcional, para cuando tengas ganas)» (`README-italiano.md:107`).
- La simulación no lo detecta porque lee todos los `EPISODI` de la semana (`sim_carriera.js:190`,
  `:316-320`) y ningún test del percorso mira `opt` en las lecturas (grep de `opt` en
  `test_game.js`: nada; `test_ejercicios.js:121` solo controla las de Escritura guiada).

**Arreglo.** `opt: ep.series === "cultura" || ep.series === "flood"` en esa misión (una línea),
y un test en `test_game.js` que lea `weekPlan` como hace `test_tramo.js:121` con las del tramo.
Decidir aparte si las Inundaciones deben ser obligatorias (son input estructurado con la
gramática de la semana: hay argumento para que lo sean, pero entonces que lo digan).

### 2.2 Cinco caminos de escritura, tres evaluadores · ALTA · S–M

| Camino | Dónde | Corrector | Alimenta el perfil de errores | Tarjetas |
|---|---|---|---|---|
| Scrivi / Escreva (48 tareas, 15 → 60 palabras) | misión obligatoria | `Scrivi.check` + LanguageTool + IA (dos pasadas) | sí | no |
| Tarea del tramo (24, 120 → 250) | misión obligatoria 27-51 | `Tramo.evaluate` (relleno, copia, puntos) + `Scrivi.check` + IA con rúbrica | **no** | no |
| Escritura plus (tres vueltas / reformulación) | botones en Scrivi | `Scrivi.check` entre vueltas; reformulación sin marcar | **no** | `ep:` |
| Escritura guiada (variaciones, C-test, ordená) | Allena, misiones opcionales, Pausa | ronda normal / por hueco / por pares | variaciones sí; huecos y ordená no | `var:` (`nocard`) |
| Scrittura del examen (2 textos) | semana 52 | fórmula de `app.js:4818` o IA con rúbrica | no | no |

Lo que se pisa y lo que falta:

- **La tarea del tramo y Scrivi conviven en la misma semana** (27-51) con dos consignas de
  escritura obligatorias: Scrivi pide 35-60 palabras con «5 verbos pronominales» y la tarea pide
  180-250 palabras de un género. Son dos misiones distintas con dos correctores. Medido en
  `Scrivi.TASKS`: mínimos it 15 → 60 (semana 40-51), pt 15 → 60; la tarea llega a 250. El alumno
  escribe cada semana un texto corto de gramática y uno largo de género; el corto ya no aporta a
  esa altura.
- **El examen no usa `Tramo.evaluate`.** La fórmula local de `app.js:4818-4822` da 20/20 a
  cualquier texto que llegue al largo sin errores duros (hallazgo A2 de v2.5, sin cambios en el
  código). `Tramo.evaluate` ya rechaza el relleno y la copia; hace falta llamarlo con
  `task = {genre, min, max, punti}` construido desde `EsameData.scrittura`.
- **Nada de lo que marca el corrector en la tarea, en Escritura plus ni en C-test entra a
  `state.errs`.** La Clínica y el cuaderno itañol se arman solo con las rondas y con Scrivi.
  Verificado por grep: `tramo.js`, `escritura_plus.js`, `escritos.js` no tocan `errs` ni
  `errLog`; en `escritura_plus.js` las únicas escrituras son `state.cards` y
  `state.escrituraPlus.cards`.
- **Los puntos de la consigna se detectan por palabra clave** (`tramo.js:118-120`): el punto se
  da por cubierto si el texto contiene una de las claves. Ejemplos reales: it semana 27,
  «contar un ritual parecido de tu ciudad o país» = `["mia città","mio paese","da noi","argentina"]`
  (quien escribe *nel mio quartiere* o *a Montevideo* no cubre el punto); pt semana 27, «Contar
  la experiencia de Renata» = `["renata"]` (basta nombrarla); pt semana 51, «Usar información del
  reportaje» = `["camila","rocha","dona cida","reportagem"]`. Es una heurística razonable para no
  depender de la IA, pero conviene decirlo en pantalla («cubierto» → «mencionado») y ampliar las
  claves con lemas (ciudad, barrio, país; el psicólogo, Tenório).

**Arreglo.** Un solo «servicio de escritura» (`js/scrittura.js`) con `evaluate(text, task)` que
use los criterios de `Tramo.evaluate` para todo texto de ≥ 40 palabras, escriba en el perfil de
errores lo que marque `Scrivi.check` (con la categoría, como hace Scrivi), y que Scrivi, Tarea,
Escritura plus y Examen sean cuatro consignas del mismo camino. De la 27 en adelante, Scrivi pasa
a ser la «vuelta corta» del género de la semana (o se jubila y sus estructuras pedidas se
vuelven un criterio de la tarea: «usá 3 verbos pronominales»).

### 2.3 Referencia vs. lección, Frasi vs. Fórmulas, Ubicación: se complementan, no se pisan

- **Referencia y lección.** «Mi gramática» reusa los bloques de la lección (`Referencia.grammar`
  lee `course.weeks[].lesson`), no duplica contenido. Lo que falta es el vínculo inverso: desde la
  lección no se llega al bloque en «Mi gramática» ni a la concordancia de sus formas; desde «Mi
  gramática» no se vuelve a la lección. Y el índice para hasta `state.unlocked`: no se puede
  consultar «cómo será el congiuntivo» antes de la semana 25.
- **Frasi y Fórmulas.** `FORMULE_DATA` es una capa sobre las frases (`frase:salva:0` → `[[11, "ho
  capito"]]`): no hay duplicación, y el paso «Ya lo venías usando» une las dos. La asimetría es
  de datos (pt: 4 semanas).
- **Ubicación.** No se pisa con nada, pero reutiliza los ítems del curso (`Ubicacion.pool`): quien
  hace el test y arranca en la 20 va a encontrar en «Superá la semana» los mismos ítems que
  respondió. No hay un banco reservado.
- **Tres lenguas y Lab / Diagnosi.** Los falsos amigos it↔pt del duelo no están en `LAB_DATA.FALSI`
  (que es es↔it / es↔pt): se complementan. Pero Tres lenguas guarda aparte y no genera tarjetas:
  el contraste visto no vuelve.

### 2.4 Huérfanos, poco descubribles, sin datos en un idioma

- **Sin misión ni pestaña propia** (solo tarjeta o botón): Biblioteca (Leggi/Io), Escritura plus
  (dentro de Scrivi), Referencia (Allena/Io + botón en glosas), Tres lenguas (Allena, con
  candado), Ubicación (Oggi una vez, Io), Frecuencia (Io). Ninguno aparece en el percorso.
- **Documentación:** grep de los nombres en `README-italiano.md`, `README-portugues.md`,
  `ARQUITECTURA.md`: Escritura guiada 0, Variaciones 0, C-test 0, Ordená 0, Tres vueltas 0,
  Reformulación 0, Mapas 0, Ubicación 0, «Mi gramática» 0, Tres lenguas solo en ARQUITECTURA (1),
  Biblioteca solo en ARQUITECTURA (7), Desglose 1 línea («Palabra por palabra»), Fórmula 1 línea.
  El README-portugues no menciona ninguno de los doce.
- **Sin datos o con menos datos en portugués:** Common Voice 0 oraciones (`VociCV.ALL` vacío; no
  existe `docs/lang/pt/audio/`) → en Suoni pt no hay «¿Qué forma escuchaste?» (`forma`: 0 ítems en
  las 40 sesiones simuladas) y el dictado va siempre con TTS; Lingua Libre con un solo hablante
  preferido (`prefer: ["Ederporto"]`); Fórmulas 32 frases en 4 semanas (it 63 en 12); Mapas 9
  escenas y 7 preguntas (it 16 y 10); Ponte 16 reglas vs 9 (pt gana), Falsos 103 vs 28 (pt gana),
  Cultura 23 vs 10 (pt gana), Duelos 166 ítems vs 80 (pt gana).
- **Sin datos en italiano:** `FRASI_DATA.traps` está vacío (pt trae 7 tablas): el «Adiviná» del
  italiano cae en `Lezione.traps` y `LANG.rules`. Funciona (v2.5 lo midió), pero el paquete no es
  simétrico.

### 2.5 Qué proporción del contenido está fuera del camino obligatorio, y quién lo ve

**Input (palabras para leer o escuchar), medido con `count.js`:**

| | it | pt |
|---|---|---|
| Obligatorio en el percorso: settimana + Martín + lunga + escuchas del tramo + dictogloss + examen | 52×93 + 13×97 + 24×621 + 10.0 k + 47×80 + ~1,8 k ≈ **37 k** | 52×126 + 10×170 + 24×612 + 10,3 k + 47×79 + ~2,1 k ≈ **39 k** |
| «Opcional» (hoy bloquea): cultura + inundaciones | 10×114 + 12×180 ≈ 3,3 k | 23×266 + 12×192 ≈ 8,4 k |
| Fuera del percorso: Biblioteca | **353 k** | **525 k** |
| Biblioteca / total | **90 %** | **92 %** |

**Práctica (ítems), sin contar el curso (6.774 / 3.388 ejercicios) ni el banco:**

| Estado | it | pt |
|---|---|---|
| Obligatorio | frases 358, lab 225, suoni 320 + dictogloss 47, tramo 48, mapas 10, esame 133 + 6 | frases 455, lab 426, suoni 344 + 47, tramo 48, mapas 7, esame 164 + 6 |
| Opcional con misión | duelos 80, variaciones 93, C-test / ordená (158 fuentes) | duelos 166, variaciones 81, 168 fuentes |
| Sin misión | escritura plus 96 (48×2), referencia (279 bloques, ejercicios generados), tres lenguas 170 + 61, ubicación (2.283 reutilizados), frecuencia (b-freq, parole) | 96, 340 bloques, 170 + 61, 1.482, ídem |

Grosso modo, **un tercio de los ítems de práctica de los módulos y nueve de cada diez palabras de
input están fuera del camino obligatorio.**

**¿Lo ve alguien?**

- `tools/it/sim_carriera.js` (y su copia `pt`, 98 % igual) juega: lección, palabras,
  entrenamiento, sfide, scrivi, frases, **todas** las lecturas (martin, cultura, settimana, lunga,
  flood, `:190`), ponte, falsos, capire, banco ×3, gimnasio, puntos débiles y jefe (grep de
  `missions.push({ m:`). **No** toca: escucha ni tarea del tramo, suoni, dictogloss, duelos,
  escritura guiada, escritura plus, biblioteca, referencia, tres lenguas, ubicación, ni el examen
  (en la 52 juega el jefe clásico, `:262`).
- `tools/lib/smoke_browser.js` abre en Chromium: Oggi, Percorso (semanas 1, 2 y 52), Io, Leggi,
  Allena, una lección, una ronda, la Pausa, Lampo parole, Suoni desde Allena, dictogloss, karaoke
  y del examen solo Strutture y Lettura. **No** abre: biblioteca (`#bx-open`), escritura guiada
  (`data-esc`), duelos, tramo (`data-trasc`, `tr-scr`), escritura plus (`#eptre`), tres lenguas,
  ubicación (`#ubicgo`), «Mi gramática» (`#refq`), Ascolto ni Scrittura del examen.
- Los tests de node (`test:lib`) sí cubren la lógica de cada módulo (153-253 líneas cada uno;
  `test_tramo` controla largos, claves, que el modelo pase y que la basura no; `test_biblioteca`
  el índice, la cobertura, la ortografía pt y el peso ≤ 15 MB; `test_ejercicios` los marcos, el
  C-test, el orden; `test_escritura_plus` la alineación y las tarjetas; `test_referencia` el
  corpus y las concordancias; `test_mapas_ubicacion` alumnos simulados con semilla;
  `test_tres_lenguas` datos, candado y duelo). Lo que nadie prueba es el `render`/`wire` de esas
  pantallas dentro de `app.js`, que es justamente donde v2.5 encontró los bugs de A1, A7 y A9.

---

## 3. Calidad del contenido (muestra de 20-30 ítems por módulo y por idioma)

Método: `sample.js` con una semilla fija toma ítems de cada `*_DATA` y los imprime con su id
(`sample.out`, 445 líneas). Se juzgó lengua, consigna, corrección y explicación.

### 3.1 Lo que está muy bien

- **Tramo, los dos idiomas.** Textos con voz de género real y no de manual: *Lo struscio: la
  passeggiata che resiste* (w27, reportage, 378 palabras, con una cita de Rosaria y un cierre que
  la pregunta 1 obliga a interpretar: «Descrivere un rito sociale e come cambia»); *«Venite a
  gennaio»: la sindaca…* (w38, resoconto di un'intervista, la caza de formas pide los verbos que
  cambian en el discurso indirecto y la tarea pide una síntesis en tercera persona sin citas
  directas, con el aviso en castellano «ojo con la concordancia de tiempos»); *Quattro giorni
  bastano?* (w51, 875 palabras, periodo hipotético en la primera oración). En pt: *Trocar a
  capital pelo interior* (w27, con futuro do subjuntivo natural: *se alguém me perguntar*, *quando
  eu for*); *Legenda com sotaque* (w38, un reportaje sobre *a gente tá* / *cadê* con la escucha
  *Cê já terminou a série?* entre dos amigos que hablan exactamente así: «Tô morto, Bruna. Fiquei
  até as três da manhã maratonando aquela série, sabe?»); *O centro vai voltar a ter moradores?*
  (w51, *retrofit*, con una estudiante que pregunta «talvez meio provocativa»). Las escuchas
  tienen turnos cortos, muletillas (*Allora*, *Aspetta, aspetta*, *Olha*, *é claro*) y preguntas
  que exigen inferencia (*Perché la sociologa risponde «Sembra, appunto»?*). Los V/F incluyen
  siempre un «non si dice / não se diz» plausible (*Luca pensa di tornare a vivere a Casalbianco*).
  Las consignas de la tarea siguen el formato de examen (pt: «Você é… Após ler… escreva… Não se
  esqueça de… Seu texto deve ter entre 120 e 180 palavras»). Los modelos están escritos por alguien
  que sabe el género (*Egregio dottor Martini, Le scrivo, anche a nome di alcuni colleghi…*; *Oi,
  Camila, tudo bem? Fiquei pensando na nossa conversa…*).
- **Tres lenguas.** Contrastes precisos y con la nota justa: `gli_lhe` («Italiano: gli (a él), le
  (a ella). En Brasil se prefiere para ele / para ela; lhe es formal o va con você»), `inf_pess`,
  `a_pers` («En vejo a Maria, a es el artículo»), `palestra` (gimnasio / charla), `salsa` (molho /
  perejil), `ct` (notte / noite / noche), `lost_l` (luna / lua). El duelo tiene ítems con la
  palabra intrusa y su arreglo (*Estou com fretta* → *pressa*; *Prendo un sorvete* → *gelato*;
  *Mia mãe fa il medico* → *madre*).
- **Desglose, Referencia, Mapas, Duelos, Lab, Frasi**: ver las fichas de 1.2. Las notas de Frasi
  siguen siendo el mejor material de la app (358 / 455 frases, el 100 % con nota de construcción:
  *A mio avviso… sin artículo ante mio; priorità es invariable*; *Não aguento mais: «ya no» = não…
  mais, con mais al final; aguentar sin diéresis desde 1990*). Duelos con `cue` y `why` de una
  línea que enseñan a decidir (*«rimanere»: essere*; *Ainda não + perfeito simples*; *Lisboa no
  lleva artículo: sin crase*).
- **Variaciones.** Consigna clara («Reescribila cambiando una sola pieza: Cambiá la persona: ahora
  es «lei» (ella). Y «Augusto» pasa a «Anna»»), `accept` generoso y la nota con la forma
  (`*chiamarsi*, presente…`).

### 3.2 Lo que hay que corregir (con id)

- **`pt/variaciones_data.js:116` `negNote`** está en portugués («*Não* vai antes do verbo e antes
  do pronome que se prende a ele…») cuando la consigna, la nota del verbo y el resto de la app
  explican en castellano; la versión it (`:113`) está en castellano. Se muestra en cada variante
  `neg` (28 marcos).
- **Examen, Ascolto:** las 8 preguntas de `asc-1` y `asc-2` en los dos idiomas están en castellano
  (`EsameData.ascolto[].questions`), y los V/F de la lettura vienen en la lengua. El tramo ya
  demostró que las preguntas en la lengua meta funcionan (24 escuchas). Mismo pedido que v2.5 A2.
- **Tramo, `punti`** por palabra clave (2.2): además de las claves cortas, hay claves que se
  cumplen sin cumplir el punto («Contar la experiencia de Renata» = `renata`; «presentar la
  propuesta» = `propo`, `sperimenta`).
- **Escritura guiada, cloze racional:** en *Un ristorante al mare* (w20 it) 3 de los 11 huecos
  son la conjunción *e / E* (`cat: conector`, con `alt: ed`) y en pt 1 de 14 es *e*: huecos sin
  información. Convendría excluir *e / e* y *a* sueltas, o pesarlas menos. El C-test corta *un* →
  `u_`, *lo* → `l_` (`gaps[2]`, `[5]`): es lo que manda Klein-Braley, pero en un teléfono son
  toques que no enseñan; se puede exigir ≥ 3 letras para abrir hueco.
- **Suoni it, `p-072` *bótte / bòtte* y `p-094` *sórta / sòrta*:** la nota lo dice honesta («en
  muchas regiones se pierde. Vale para el oído, no es un error grave»), pero se presentan en la
  semana 1 y 25 al mismo nivel que *pala / palla*. Conviene una categoría «fina» que no cuente para
  la misión.
- **Suoni pt, acento con `fake: true`** (`a-026` *democracia*, `a-032` *hemorragia*, `a-029`
  *recorde*): las opciones muestran la sílaba tónica en mayúscula (`de·mo·cra·CI·a`), o sea que
  se lee, no se escucha, y el TTS del teléfono no garantiza la tónica en la pseudo-opción. Es un
  ítem de ortografía disfrazado de oído.
- **Lettura settimana it w-46 *Il gattino del vicino*:** 3 preguntas literales en castellano («¿Qué
  animales tiene el señor Bruno?») en la semana 46, cuando la lectura larga de la misma semana ya
  pregunta en italiano. La serie `settimana` conserva las preguntas en castellano en las 52
  semanas (las V/F sí van en la lengua): en las semanas 27-51 es un escalón para abajo.
- **Cultura it (10 textos, 114 palabras promedio):** el mismo tamaño que la settimana y preguntas
  de un dato (*¿Qué descubre Galileo alrededor de Júpiter?* — cuatro satélites). En pt la serie
  tiene 23 textos de 266 palabras con caza de formas temática (*Tocá las palabras de la censura*).
  La versión it quedó chica.
- **Tres lenguas, `lex` `dove`:** «Onde es dónde; en italiano onde son las olas» — correcto y
  simpático, pero la columna «es» dice solo «dónde» y no avisa que *onde* es también castellano
  arcaico; menor. `orto` `ch`: «che, chi, chiave / chá, chave, chuva / che, llave» mezcla el
  ejemplo español *che* (que no es la grafía sino la interjección rioplatense). Sacar *che* de la
  columna española.
- **Biblioteca pt, Eça (`contos-eca`, `o-mandarim`):** llevan `variant` y `note`/`noteLong` (portugués
  europeo), bien. Pero los dos it de Capuana y el de Salgari no tienen `week` ni ninguna marca de
  dificultad distinta aunque la cobertura difiere (Salgari 936 ‰ en la 52 contra De Amicis 954).
- **Ubicación it:** la semana 41 aporta 7 ítems usables y la 43, 5; la 51, 343. El modelo elige la
  semana «más en duda», así que en 41-43 repite pocos ítems y el resultado ahí es ruidoso. En pt es
  parejo (26-31 por semana).
- **Fórmulas pt:** `frase:oi:18` → `[[11, "valeu"]]` marca *valeu* como fórmula hasta la semana
  11 (pretérito perfeito). Correcto. Pero *tá*, *tô*, *pra* (semana 38) no están adelantados en
  ninguna frase de las escenas de las semanas 1-19, aunque `LANG.rules.desglose.colloquial` los
  conoce: la capa se generó con el sillabo de tiempos verbales y no con el de formas coloquiales.

---

## 4. Propuesta para 3.0: una arquitectura de contenido

Hoy el alumno ve tres pestañas (Percorso, Allena, Leggi) más Oggi e Io, y los 21 módulos están
repartidos por dónde cupieron: la escritura en cuatro lugares, la escucha en tres, la referencia en
Io. La propuesta es ordenar por **función didáctica** y que cada módulo tenga un solo lugar,
una sola forma de guardar y una sola forma de alimentar el repaso y el perfil.

### 4.1 Cuatro capas y un examen

| Capa | Qué junta | Módulos de hoy | Pestaña |
|---|---|---|---|
| **Input** | Leer y escuchar, graduado y extensivo | settimana, Martín, cultura, inundaciones, lectura larga, **escuchas largas**, dictogloss (la escucha), Biblioteca, Ascolto facile, **[nuevo] serie de escucha A2-B1** | Leggi / Ler → «Leer y escuchar» |
| **Práctica** | Forma y fluidez con respuesta cerrada | rondas del curso, banco, Clínica, frases, Lab, Suoni, duelos, Variaciones, C-test / cloze, Ordená, Parola o no, Tres lenguas (duelo) | Allena / Treino |
| **Producción** | Escribir con respuesta abierta | Scrivi, Tarea, Tres vueltas, Reformulación, Scrittura del examen, Parla (IA), **[nuevo] tareas comunicativas sin IA** | **Scrivi / Escreva** (pestaña nueva, o sección fija de Allena) |
| **Referencia** | Consultar | Mi gramática, concordancias, Desglose, Mapas, Fórmulas, glosario + frecuencia, **[nuevo] diccionario propio**, Tres lenguas (contrastes) | **Io → «Consultar»** o pestaña «📖» |
| **Evaluación** | Ubicación, jefes, examen C1, cierre de semana | ubicación, boss, esame | Percorso |

El percorso sigue siendo el camino: cada semana toma una misión de cada capa (input, práctica,
producción) y el resto queda como «más de esta semana» (opcional de verdad, con `opt`).

### 4.2 Qué fusionar, qué jubilar, qué llevar al percorso

| Acción | Qué | Por qué | Costo |
|---|---|---|---|
| **Fusionar** | Scrivi + Tarea + Tres vueltas + Reformulación + Scrittura del examen → un `scrittura.js` con `evaluate()` común (criterios del tramo), un solo guardado (`state.scritti[semana].{draft, vueltas, ref, ai}`) y una sola pantalla con pestañas «Escribir · Tres vueltas · Reformular» | 2.2: cinco caminos, tres evaluadores, el examen inflado, el perfil de errores a ciegas | M |
| **Fusionar** | Escritura guiada dentro de Práctica como tres «ejercicios» más de la ronda (ya lo son en la Pausa) y sacar la pantalla `escritos` | Un módulo-pegamento menos; las misiones opcionales quedan | S |
| **Fusionar** | Mi gramática + concordancias + Desglose + glosario + frecuencia + Mapas + Fórmulas → «Consultar» | Hoy son seis entradas distintas para la misma pregunta («¿cómo se usa?») | M |
| **Jubilar** | La consigna corta de Scrivi en las semanas 27-51 (o convertirla en el criterio «usá N formas de la semana» de la tarea) | Dos escrituras obligatorias por semana con distinto tamaño y corrector | S |
| **Jubilar** | La pantalla `escritos` como destino propio; el candado de Tres lenguas (abrir siempre los contrastes, dejar el duelo para quien tenga los dos idiomas) | Descubribilidad (2.4) | S |
| **Al percorso** | Biblioteca: una misión «Leé un capítulo» opcional desde la semana que cada libro abre (`week` en las 16 fichas; hoy 6 de 16), con `recommend()` eligiendo el capítulo | 90 % del input sin misión (2.5) | S–M |
| **Al percorso** | Escritura plus como misión opcional «Tres vueltas» las semanas de Scrivi, y «Reformulá» las de tarea | Hoy solo la ve quien baja hasta el pie de Scrivi | S |
| **Al percorso** | Mi gramática: al cerrar la lección, «esto queda en tu gramática» con el bloque nuevo, y en el cierre de la semana el estado (vista / practicada / dominada) de los bloques de la semana | El módulo ya calcula todo eso; falta mostrarlo donde el alumno está | S |
| **Al percorso** | Ubicación: ofrecerla también al cambiar de idioma y al importar una copia; en Io, siempre | Hoy la ve solo un guardado virgen | S |
| **Arreglar** | Tres lenguas: guardar en `state.tres` con el prefijo del idioma y dentro de la copia; tarjetas para los contrastes fallados | 1.2 | S |
| **Arreglar** | `opt: true` en cultura e inundaciones (2.1) | bloqueo | S |

### 4.3 Lo que falta (y qué hay ya para reutilizar)

1. **Escucha extensiva graduada antes de la semana 27 · L (contenido) / S (código).** Hoy, hasta
   la 27, la única escucha con contexto es el dictogloss (50-110 palabras, 47 textos) y la
   re-escucha de las lecturas con TTS (*Ascolto facile*). El reproductor a dos voces, las preguntas
   a la vista, la transcripción al final, la doble escucha y el guardado ya existen en `tramo.js`
   (`play`, `:263-282`) y los géneros en `generi.json`. Falta una serie **«Radio» / «Rádio»**: de la
   semana 6 a la 26, un diálogo o programa corto (120 → 300 palabras) por semana con la gramática y
   el léxico de la semana, tres preguntas en la lengua meta desde la 14, y la misma ficha
   (`ascolto` de `wNN.json`) para que `build_tramo.js` lo compile sin cambios. Evidencia de que
   hace falta: en 2.5 el input obligatorio de las semanas 1-26 es de ~12 k palabras leídas y ~2 k
   escuchadas (dictogloss); en el tramo son 15 k + 10 k.
2. **Diccionario propio con colocaciones · M.** Piezas que ya existen: `glossario.json` (3.018 /
   3.621 entradas), `frequenza.json` con nivel, `Referencia.concordance` (5-8 usos reales),
   `Desglose.of` (la forma verbal), las 98 colocaciones con verbo soporte y 60 marcadores del
   italiano (`tools/it/authored/lessico2.py`), el banco (1.827 / 1.836 sustantivos con nota
   contrastiva). Lo que falta es una pantalla de búsqueda (`Freq.lemma` + glosario + concordancia
   en una ficha) y, en portugués, un banco de colocaciones equivalente al `lessico2` del italiano
   (grep en `tools/pt/authored`: no hay archivo de colocaciones; solo menciones en `s3.py`,
   `s4.py` y `esame_c1.py`).
3. **Referencia gramatical consultable · S.** Ya está (`Referencia.page`, buscador `#refq`, 279 /
   340 bloques, 116 / 150 tablas). Falta: quitar el tope de `state.unlocked` con un aviso («esto
   llega en la semana 25»), el enlace desde la lección y desde la corrección («ver la regla»), y
   ponerla en una pestaña o en Io arriba, no después de «Tu copia».
4. **Comprensión auditiva con géneros orales reales · M–L.** Los géneros del tramo son reales
   pero leídos por TTS; el único audio humano son las 128 oraciones de Common Voice del italiano
   (pt: 0) y las palabras de Lingua Libre. Sin voz del alumno, lo que se puede hacer: (a) sumar
   Common Voice pt-BR (CC0; `VOCES.md` ya documenta el proceso para it) para el dictado y «¿qué
   forma escuchaste?» de pt; (b) enlazar podcasts y radio con licencia libre o pública (RAI Play
   Sound / Radio Câmara, Rádio Senado, que son de dominio público en Brasil) como «input fuera de
   la app» con una ficha de preguntas, que era la propuesta 9 de `PROPUESTAS.md:169-170` y sigue
   pendiente; (c) en el reproductor del tramo, un tercer hablante y una velocidad 1,15× para la
   variabilidad del HVPT.
5. **Tareas comunicativas sin IA antes de la 27 · M.** Hoy la única producción con propósito y
   destinatario antes de la 27 es Parla (solo con clave). La tarea integrada (leer → escribir un
   género para alguien) se puede escalar hacia abajo desde la semana 8: un mensaje de WhatsApp a
   partir de la lectura de la semana (30 palabras, la escena `whatsapp` de pt ya está en la 19),
   una nota para un compañero, un mail corto. Mismo formato `compito` y mismo `evaluate()` con
   mínimos más bajos; los `punti` por lema.
6. **Un test de extremo a extremo por módulo · M.** Que `smoke_browser.js` abra: Biblioteca
   (`#bx-open`, un capítulo, «📌 al repaso»), Escritura guiada (`data-esc` ×3), un duelo, la escucha
   y la tarea del tramo (semana 27 con `state.unlocked = 27`), Tres vueltas, Tres lenguas (con
   `enable(true)`), Ubicación, Mi gramática (`#refq`), y Ascolto + Scrittura del examen; y que
   `sim_carriera.js` juegue las misiones del tramo, Suoni, dictogloss y duelos. Con eso la
   reorganización de 4.1 se puede hacer sin romper lo que hoy nadie mira.
7. **Simetría del portugués · M.** Fórmulas fijas generadas también con las formas coloquiales
   (*tá, tô, pra, cê*: `rules.desglose.colloquial`) y con `haver de`, `dá para`, para que el paso
   «Ya lo venías usando» exista después de la semana 11; Mapas para *por / para*, *a / à* (crase) y
   *em / a* con movimiento, que son las preposiciones con duelo propio; Common Voice pt-BR.

### 4.4 Costo total estimado

S: 2.1, `opt`, negNote, guardado de Tres lenguas, entradas de Ubicación y Escritura plus, enlaces
de Mi gramática, preguntas del examen en la lengua (datos). M: `scrittura.js` común, «Consultar»,
Biblioteca en el percorso, smoke y sim de los módulos, diccionario, tareas comunicativas
tempranas, simetría pt. L: la serie de escucha 6-26 (contenido de 21 semanas × 2 idiomas) y el
audio humano.

---

## Lo que ya está bien y conviene no romper

- **El tramo** es el modelo de cómo escribir contenido C1: géneros reales, preguntas en la lengua,
  V/F con «no se dice», tareas con destinatario, modelos de calidad, revisión local que no se deja
  engañar, datos en JSON por semana con test que fija los largos.
- **El núcleo no nombra idiomas** en ninguno de los 21 módulos: todo lo de la lengua está en
  `*_data.js` o `LANG.rules`. Los tests de `test:lib` cargan los dos paquetes y corren en ~2 min.
- **Las tarjetas de los módulos entran al repaso por un solo camino** (`drills.js:816-827`:
  `duel:`, `ep:`, `lib:` con su `reviewItem`), y Variaciones va por la ronda normal con
  `Diagnosi`. No hay un segundo SRS.
- **La Biblioteca**: cobertura por semana precalculada, lector que cuenta solo las páginas leídas
  con tiempo, «📌 al repaso», ortografía pt modernizada con test, libros que se bajan a demanda y
  no se precachean.
- **Mi gramática y las concordancias** ya resuelven el 70 % de «una referencia consultable»: hay
  índice, buscador, tablas, ejemplos reales por semana y estado por bloque.
- **Desglose** explica clíticos, tiempos compuestos, elisiones y locuciones sin errores en la
  muestra, en los dos idiomas, y respeta la semana (un tiempo no enseñado se describe en
  castellano).
- **Tres lenguas** tiene 170 contrastes bien escritos y un diagnóstico «¡eso es portugués!» que
  `test_tres_lenguas` controla sin falsas alarmas.
- **Frasi, Duelos, Lab, Suoni** conservan la calidad que midieron las auditorías anteriores; el
  100 % de las frases con nota de construcción en los dos idiomas.
- **El examen** ya tiene dos versiones de cada prueba y V/F con cita.

## Lo que no pude medir

- El comportamiento real de las pantallas de los módulos dentro de `app.js` (render, wire, botón
  atrás, actualización de versión en medio de una tarea): `pack.js` no carga `app.js` y no corrí
  Playwright en esta pasada. Las afirmaciones sobre entradas y misiones salen de leer el código,
  con las líneas citadas.
- La proporción de dictados con voz real vs. TTS en Suoni: en node, sin `bank.json` cargado por
  `app.js`, `Suoni.session` no produce ítems de dictado (0 en 40 semanas en los dos idiomas), así
  que no se puede medir la mezcla fuera del navegador.
- Si la Biblioteca reproduce desde HEAD (B1 de v2.5): no corrí `build_biblioteca.js` (necesita
  red y 42 s); sigue sin estar en `npm run build`.
- La calidad del TTS a dos voces del tramo en un teléfono real (qué voces elige `vi: 0 / 1` en iOS
  y Android): depende del dispositivo.
- La cobertura de `test:lib` en el CI: `.github/workflows/test.yml` corre `npm test`, que incluye
  `test:lib`; no verifiqué que el workflow esté activo en el repositorio remoto.
