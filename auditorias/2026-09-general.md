# Auditoría general v2.5: código, teléfono, herramientas y contenido

Rama `claude/auditoria-mejoras-eo3648`, sobre `main` en v2.5 (merge del PR #52).
Solo lectura: esta auditoría no cambió código, contenido ni datos. Las mediciones se hicieron con
`tools/lib/pack.js` en node, con Playwright y Chromium (390×844 y 320 px, it y pt, tema
claro y oscuro) y con clones del repo para correr `build`, `smoke` y `sim`.

Se miraron cinco cosas:

1. el núcleo JS y el service worker;
2. la experiencia en el teléfono, la accesibilidad, el uso sin conexión y la velocidad de carga;
3. los tests, el build, el CI y el orden del repo;
4. el contenido del italiano;
5. el contenido del portugués.

En los dos idiomas se volvió a medir lo que marcaron las auditorías anteriores.

**Fuera de alcance, a pedido:** todo lo que usa la voz del alumno (reconocimiento, grabación,
pronunciación, shadowing, la entrevista oral del Celpe-Bras). Escuchar audio y la voz del teléfono
sí entran.

> **Actualización (v2.6).** Los puntos 7 y 8 del resumen (D3, E2 y E3) quedaron
> resueltos con el **tramo C1**: en las semanas 27 a 51 de los dos idiomas,
> cada semana suma una lectura larga (350 → 900 palabras), una escucha larga a
> dos voces (250 → 600) y una tarea integrada de un género (120 → 250
> palabras), con preguntas en la lengua meta y una revisión que no se engaña
> con relleno ni con texto copiado. En portugués, la tarea sigue el formato
> del Celpe-Bras. Ver `README-italiano.md` («Tramo C1») y `js/tramo.js`. El
> vocabulario B2-C1 (D4) quedó resuelto en v2.7: 20 palabras por semana de la 27 a
> la 51 en los dos idiomas. En esa misma versión, las falsas alarmas del corrector
> sobre texto C1 bajaron de 41 a 12 (it) y de 83 a 20 (pt).

---

## Resumen: las 12 principales

| # | Prioridad | Qué | Dónde | Esfuerzo |
|---|---|---|---|---|
| 1 | Alta · núcleo | Al retomar una ronda se repite la pregunta ya contestada: la xp, el SRS, los intentos y las vidas del jefe cuentan dos veces | `js/app.js` `settle` / `savePending` | S |
| 2 | Alta · núcleo | El examen C1 da 20/20 en escritura a cualquier texto que llegue al largo (sin clave de IA) | `js/app.js:4790-4796` | S–M |
| 3 | Alta · núcleo | Primera carga de 17-18 s en 4G lenta: 52 scripts en cadena y la primera visita lo baja todo dos veces | `js/boot.js`, `sw.js` | S–M |
| 4 | Alta · repo | La Biblioteca no se puede reproducir desde HEAD (1.031 valores cambian) y el CI no la controla | `tools/lib/build_biblioteca.js`, CI | S |
| 5 | Alta · repo | Ningún test del CI ejecuta `app.js`; el smoke existe y pasa, pero no corre en el CI | `.github/workflows/test.yml` | S |
| 6 | Alta · it/pt | El corrector rechaza respuestas correctas con reglas falsas (it ≈5 % de la muestra; pt: *pra*, *tava*, *cê*, *Eu amo você*) | `lang/*/diagnosi.js`, listas de aceptadas | M |
| 7 | Alta · it/pt | De la semana 27 en adelante, la lectura, la escucha y la escritura no crecen hacia C1: textos de ~94 palabras, escuchas de ≤107 palabras, *Scrivi* de 60 | contenido, `build_course.py` | M–L |
| 8 | Alta · pt | Las semanas 37-52 no entrenan la tarea del Celpe-Bras (leer o escuchar → escribir un género) | contenido pt, examen | M |
| 9 | Media · núcleo | Si falla el arranque, dice «revisá la conexión» y deja la app bloqueada, sin forma de exportar | `js/app.js:5542-5568`, `engine.js` `sanitize` | M |
| 10 | Media · núcleo | Importar una copia no controla el idioma ni aplica las migraciones | `js/app.js:3636-3680` | S |
| 11 | Media · núcleo | La actualización recarga la app sola y borra lo que está solo en memoria (role-play, dictogloss, examen, lector) | `js/app.js:5434-5443` | S |
| 12 | Media · a11y | Ningún texto en italiano o portugués lleva `lang`; hay botones de ícono sin nombre y zonas táctiles de 24-39 px | `index.html`, helpers de render, CSS | S–M |

**Orden sugerido.** Primero los arreglos cortos que evitan pérdidas o datos inflados (1, 10, 11
y los de la sección A de esfuerzo S). Después el CI (4, 5 y B4), para que lo que venga no se
rompa sin avisar. Después la carga (3), el corrector (6) y el examen (2). El contenido C1 (7, 8)
es lo más largo y conviene hacerlo con la red de tests ya armada.

---

## Estado de las auditorías anteriores

La mayor parte de lo marcado en `auditorias/2026-09-italiano.md` y `2026-09-portugues.md` quedó
hecho y se comprueba con los números:

| Qué | Antes → ahora |
|---|---|
| «Adiviná» con otra frase como opción (it) | 19 % (332/1790) → **0 %** |
| Respuesta sin relación («boh») que recibe una regla inventada (it) | 358/358 → **1/358** |
| Chequeos de lección sobre la columna Ejemplo/Nota · repetidos · bloques sin chequeo (it) | ≈200 · 27 · 11 → **0 · 0 · 0** |
| Oraciones del banco ubicadas antes de su gramática (it) | 327/864 → **0** |
| «Acá va congiuntivo» en semanas de presente (it) | 19/1118 → **0/545** |
| Ítems sin nota en las semanas 1-12 (it) | 25 % → **0** |
| Nota del segundo intento que delata la respuesta | 53 % → **0** |
| La correcta es la opción más larga en las lecturas (it) | 171/261 → 67/261 (lo esperable al azar) |
| Ítems de escucha colgados de la parte equivocada (pt, B2) | 32 → **0** |
| Duelo ser/estar con formas posteriores (pt, B4) | 13/20 → **0/26** |
| Banco pt con gramática antes de tiempo (B3) | 12 + 23 → **0** |

**Queda a medias o abierto:**

- **Italiano.**
  - Trampas del «Adiviná» de semanas posteriores: 8 % → 7,7 %. El cambio de preposición no mira
    la semana (*In domani!* aparece en la semana 1).
  - Semana 3: sigue con 17 bloques.
  - *piacere* aparece antes de su semana (semanas 3, 4, 8 y 11).
  - Glosario con un solo significado: *sei* = «seis»; *soldi* = «moneda / centavo».
  - Trampa *lo → il*: quedan 4 frases.
  - *gli* explicado de tres maneras distintas.
  - Dictogloss sin andamios en A1.
  - Siguen pendientes las propuestas 2, 8, 9 y 10 de `PROPUESTAS.md`: velocidad de respuesta,
    lectura cronometrada, input fuera de la app y «con la IA, primero vos».
- **Portugués.**
  - B1: 38 frases usan gramática no verbal posterior sin aviso (10 clíticos, 7 demostrativos,
    *né* en la semana 17).
  - B3: quedan unas 14 oraciones con vocabulario que no se enseñó (*cachorro* en la semana 2,
    *avião*, *sorvete*).
  - B7: los pares *é / e* y *só / sou* siguen como palabras sueltas leídas por TTS, y la voz lee
    «e» como el nombre de la letra. Van en frase: *Ela é daqui / Ela e daqui*.
  - B8: *me acordo* como opción en la semana 5 (s1-05-11) y *año → ano* en la semana 1.

---

## A. Núcleo común (afecta a los dos idiomas)

### A1. Retomar una ronda repite la pregunta ya contestada · ALTA · S

`settle()` (`js/app.js:2539-2627`) guarda enseguida la xp, las tarjetas, los totales y las vidas.
La ronda pendiente, en cambio, se guarda recién en `nextItem` (`app.js:2998`), al tocar
«Siguiente». Si la app se cierra entre medio, «Retomar» vuelve a hacer la misma pregunta.

- **Reproducido en Chromium:** `attempts` pasó de 1 a 2, la xp de 12 a 24, y la tarjeta de
  estabilidad 15,7 / intervalo 16 días a 37 / 37 días. La tarjeta se aleja del repaso sin motivo.
- **En el jefe es una trampa:** perdés una vida, cerrás, retomás y la vida vuelve.

**Arreglo.** Al final de `settle()`, llamar a `savePending()` con `i: round.i + 1` y con el ítem
de reintento que `settle` agrega.

### A2. El examen C1 aprueba cualquier texto largo · ALTA · S–M

`app.js:4790-4796` calcula la nota local así:

```
score = palabras_ok × 8 + max(0, 12 − errores_duros × 1,5)
```

Sin clave de IA, «ciao» repetido 200 veces da **20/20**. Además:

- hay una sola versión de cada prueba y queda la mejor nota;
- los 133 ítems de estructuras y léxico se pueden practicar antes en la semana 52;
- las preguntas de escucha están en castellano, y la correcta es la más larga en 14 de 16.

**Arreglo.**

- Poner un piso real al corrector local, con variedad léxica (tipos/tokens), repetición y
  cobertura de las consignas por palabras clave. Sin IA, mostrar «nota orientativa» en lugar de
  una nota.
- Escribir 3-4 versiones de cada prueba y sacar del entrenamiento lo que se usa en el examen.
- Preguntas en la lengua meta, con formato verdadero / falso / no se dice.

### A3. Primera carga lenta y bajada doble · ALTA · S–M

- **`boot.js:170-183` carga 52 scripts uno detrás del otro.** Los JSON del curso se piden recién
  cuando corre `app.js` (l. 5525). En 4G lenta (150 ms, 1,6 Mbps, CPU ×4) y con gzip, la app se
  puede usar a los **17,8 s (it) / 16,9 s (pt)**. Son 71 pedidos y 5,99 MB sin comprimir.
- **La primera visita baja todo dos veces.** El SW vuelve a pedir cada archivo con
  `cache:"reload"` (`sw.js:44-48`, `90-102`) después de que la página ya lo bajó. Se midieron 63
  archivos bajados dos veces: 5,94 MB repetidos. Cada versión nueva vuelve a bajar el paquete
  entero.

**Arreglo.**

- Insertar todos los scripts de una vez con `s.async = false`: se bajan en paralelo y se ejecutan
  en orden.
- Pedir `course.json` y `bank.json` desde `boot.js` con preload.
- En la primera instalación del SW, usar `cache:"default"`.
- Para las versiones nuevas, un manifiesto de hashes que copie de la caché vieja lo que no cambió.

### A4. El service worker puede mezclar versiones · MEDIA · S

La revalidación en segundo plano (`sw.js:139-140`, `150-151`) hace `fetch(e.request)` pasando
por la caché HTTP, que GitHub Pages mantiene 10 minutos. Después pisa con `cache.put` lo que la
instalación había bajado fresco. En el arranque siguiente puede correr un `app.js` viejo con un
`engine.js` y un paquete nuevos.

**Arreglo.** `fetch(new Request(e.request, { cache: "no-cache" }))`. Otra opción: no hacer `put`
de los archivos del shell, que ya entran completos en la instalación.

### A5. Un error al arrancar bloquea la app para siempre · MEDIA · M

Un solo `.catch` (`app.js:5542-5568`) cubre el `fetch` del curso y también el primer `render()`.
`sanitize` (`engine.js:602-661`) valida solo los campos base, no `storie`, `biblio`, `scritti`,
`esame` ni los demás.

- **Reproducido:** con `storie: {}` en el guardado aparece «No se pudo cargar el curso… Revisá la
  conexión». «Reintentar» falla siempre, no se llega a Io para exportar y la única salida es borrar
  los datos del sitio.

**Arreglo.**

- Separar el error de red del error de render.
- Una pantalla de rescate con «Descargar mis datos», que baje el `localStorage` crudo.
- Validar los campos no base con `Array.isArray` o chequeos de objeto.

Relacionado (BAJA): si el guardado es ilegible, `engine.js:684-688` lo aparta como `.damaged` y
arranca de cero sin avisar. Conviene ofrecerlo en Io con «Encontré un guardado dañado ·
Descargarlo».

### A6. Importar una copia: sin control de idioma ni migraciones · MEDIA · S

El JSON exportado no dice de qué idioma es (`app.js:3636-3680`). Una copia de italiano importada
en Rumo C1 reemplaza el portugués sin advertir. La importación, además, saltea `SAVE.load` y
`upgradeCard`.

- **Medido:** metas viejas de 20/100/150 quedan en 200/100/200, cuando deberían quedar en
  100/350/500.

**Arreglo.**

- Exportar dentro de un sobre: `{app, lang, v, save}`.
- Importar por la misma ruta que `Engine.load`, con un `Engine.fromRaw`.
- Borrar la ronda pendiente al importar.

### A7. La versión nueva recarga la app sola y se pierde lo que está en memoria · MEDIA · S

`app.js:5434-5443` protege solo cuatro pantallas. En las demás, `location.reload()` borra lo que
no está guardado:

- el role-play con la IA;
- la historia que se está generando;
- las tres vueltas de escritura cronometrada;
- el borrador del dictogloss (vive solo en memoria, `app.js:4133-4136`);
- las pruebas del examen;
- la página y el tiempo del lector de la Biblioteca.

**Medido:** en Leggi, con 2.500 px de scroll, la app se recargó a los 2,7 s y volvió a Oggi, arriba.

**Arreglo.**

- Una lista blanca de pantallas seguras; en las demás, un aviso «Hay una versión nueva ·
  Actualizar».
- Guardar la pantalla y el scroll en `sessionStorage`.
- Persistir el borrador del dictogloss.

### A8. El ajuste personal del olvido se congela a los 2.500 repasos · MEDIA · S

`maybeFit` (`engine.js:330-336`) reajusta cuando `log.length − speed.n ≥ 200`. El registro se
recorta a `LOG_MAX = 2500`, así que una vez lleno la diferencia es siempre 0.

- **Verificado en node:** último ajuste en el repaso 2.499 y ninguno más en 6.000. El alumno
  constante, que es el que más datos tiene, pierde el programador personalizado a los dos meses.

**Arreglo.** Un contador monótono `state.logTotal`.

### A9. Respuestas de la IA que llegan tarde o con forma rara · MEDIA · S

- **Role-play (`app.js:4388`):** si saliste de la pantalla, el callback retorna antes de poner
  `busy = false`. Al volver, el campo y «Enviar» quedan deshabilitados para siempre.
- **Historia generada (`app.js:4510-4521`):** al terminar te lleva a la lectura aunque estés en
  medio de una ronda. Conviene guardarla y mostrar un aviso «Tu historia está lista · Leer».
- **Forma del JSON (`app.js:4372`, `4512`, `4803`; `letture.js:161`):** no se valida. Si
  `obiettivi` llega como string, se lanza un TypeError. Si `domande` trae un string, la historia
  se guarda con un cuestionario que falla siempre. Hay que normalizar con `Array.isArray`.
- **Doble escape (`app.js:2748`, `4399`):** `mk(esc(...))` escapa dos veces, así que la
  explicación de la IA muestra «l&#39;articolo».

### A10. Detalles del núcleo · BAJA · S

- **El SRS vence a la hora exacta, no por día** (`engine.js:258-260`, `drills.js:839`). Un error
  de las 21:00 no aparece en el repaso de la mañana siguiente. Conviene llevar `due` al inicio del
  día local, como ya hace `nextMorning`, y volver a correr la simulación.
- **Biblioteca:** cambiar la letra o el subrayado reinicia el reloj de la página
  (`biblioteca.js:671`), y la página se descarta por «muy rápida».
- **El examen guarda en cada tecla** (`app.js:4766-4773`). Con un guardado de unos 640 KB son unos
  4 ms por tecla en escritorio y bastante más en un teléfono modesto. Conviene usar el debounce de
  400 ms que ya tiene *Scrivi*.
- **Copia de seguridad:** nada recuerda exportar. En Safari de iOS sin instalar, el almacenamiento
  se borra tras 7 días sin uso. Conviene registrar `exportedAt` y recordarlo cada unos 14 días, o
  cuando `navigator.storage.persisted()` dé false.
- **Gimnasio (pt, visible en el núcleo):** nunca ejercita imperativo, gerúndio ni particípio.
  `conjForms` (`drills.js`) cae en `Conj.conjugate`, que no conoce esos tiempos. Fallan 30
  combinaciones en las semanas 8, 12, 22, 24 y 42, y `app.js` lo tapa en silencio.

---

## B. Herramientas, tests y CI

### B1. La Biblioteca no se reproduce desde HEAD · ALTA · S

Correr `node tools/lib/build_biblioteca.js` (42 s) cambia 14 JSON de `docs/lang/*/biblioteca/`,
con 1.031 valores distintos. Por ejemplo, la semana de desbloqueo de *dipinta* en Pinocchio pasa
de 24 a 19. Ese script no está en `npm run build`.

**Arreglo.** Sumarlo al build, regenerar y commitear.

### B2. El CI controla solo `docs/lang/*/data/` · MEDIA · S

- `formule_data.js` lo genera el build, pero nadie controla que esté al día.
- `frequenza.json` está en `data/`, pero su script necesita red y no está en el build.

**Arreglo.** `git diff --exit-code -- docs/` más `git status --porcelain docs/`.

### B3. `app.js` no se ejecuta en ningún test del CI · ALTA · S

`pack.js` no carga `app.js`, y los tests solo lo leen con expresiones regulares. `npm run smoke`
lo recorre en Chromium y pasa en 58 s, pero no está en el CI.

**Arreglo.** Un job con Playwright que corra `npm run smoke`.

### B4. Chequeos que existen pero no corren · MEDIA · S

- `tools/it/check_lessons.py`, `tools/it/check_letture.py` y `tools/pt/check_letture.py` pasan
  (unos 2 s entre los tres), pero no están en ningún script.
- `sim_carriera.js` no devuelve un código de error, así que nunca falla.

**Arreglo.** Un script `test:content` dentro de `npm test`, y que la simulación termine con error
si una semana queda sin dominar.

### B5. `tools/it/audit/` está roto · MEDIA · S

`corpus.js` y `lint.js` fallan con «Cannot find module» porque usan rutas viejas (`docs/data/`,
`docs/js/conjugator.js`).

**Arreglo.** Rehacer las rutas con `pack.js`, o archivar la carpeta.

### B6. Extractos de libros comerciales publicados · MEDIA · S

`docs/lang/it/data/bank_dummies.json` (331 KB) y `bank_routledge.json` (257 KB) salen de los
epubs comerciales y se publican en GitHub Pages. La app no los carga: solo los usa
`build_course.py`.

**Arreglo.** Moverlos a `tools/it/fuentes/`, fuera de `docs/`.

### B7. Versiones que no coinciden · MEDIA · S

- `package.json` sigue en 42.0.0, mientras la app está en v2.5.
- La numeración de los commits fue para atrás: v47, 1.48, 2.x.
- `PROPUESTAS.md` dice v44, `VOCES.md` dice v1.48 y las auditorías dicen v2.1.

**Arreglo.** Una sola fuente de versión y que el CI compare `package.json`, `app.js` y `sw.js`.

### B8. Documentos con rutas que ya no existen · MEDIA · S

- Hay 21 rutas inexistentes en los `.md`. Por ejemplo, `docs/audio/cv/` hoy es
  `docs/lang/it/audio/cv/`, y `tools/pt/smoke_browser.js` hoy está en `tools/lib/`.
- En comentarios y docstrings hay 80 menciones a rutas viejas, en 39 archivos.

**Arreglo.** Corregirlas y sumar un test que falle cuando una ruta citada no existe.

### B9. Duplicación entre `tools/it` y `tools/pt` · MEDIA · M

| Archivo | Similitud |
|---|---|
| `sim_carriera.js` | 0,98 (416 de 423 líneas iguales) |
| `test_game` | 0,63 |
| `test_memoria` | 0,55 |
| `test_frasi` | 0,48 |
| `test_scrivi` | 0,47 |
| `build_bank.py` | 0,44 |

En total son unas 1.900 líneas repetidas.

**Arreglo.** `tools/lib/sim_carriera.js <código>` y un `testkit.js` común.

### B10. `app.js` como monolito · MEDIA · L

Tiene 5.571 líneas, 229 funciones, un `render()` de 28 ramas y un `wire()` de unas 205 líneas.

**Propuesta sin bundler.**

1. Pasar la lógica pura (plan de la semana, misiones) a `js/plan.js`, que se puede testear en node.
2. Usar el patrón `App.screen(nombre, {render, wire})` que ya siguen Escritos, Biblioteca,
   Ubicacion y TresLenguas.
3. Un archivo por pantalla, agregado a `Boot.ORDER`.

Conviene hacerlo recién cuando el smoke ya corra en el CI (B3).

### B11. Detalles · BAJA · S

- **Sin lint.** Un ESLint mínimo encuentra:
  - claves duplicadas: `drills.js` `recognitionOf` (l. 1025 y 1032) y `it/scrivi.js` `cocinar`
    (l. 815 y 819);
  - una redeclaración: `opts` en `app.js:2695`;
  - 30 variables sin uso;
  - 4 funciones muertas.
- **CI:**
  - corre dos veces por push en ramas con PR;
  - no tiene `concurrency` ni `timeout`;
  - las versiones de Node y Python solo están fijadas en el workflow.
- **Documentos sueltos:** `AUDITORIA-*.md`, `PROPUESTAS.md` y `VOCES.md` están en la raíz.
  Conviene moverlos a `auditorias/` con un índice.
- **Peso del repo:** `.git` ocupa 28 MB, sobre todo por las versiones de `course.json` y `app.js`
  en el historial. Opcional: publicar Pages con Actions y dejar de commitear los archivos
  generados.

---

## C. En el teléfono: accesibilidad y presentación

Lo que ya anda bien:

- recarga sin conexión en 0,6-0,9 s;
- caché de 6 MB;
- sin errores de consola en el recorrido;
- sin scroll horizontal a 390 px;
- fuentes con `swap` y preload;
- el ícono maskable respeta la zona segura.

### C1. Ningún texto en la lengua meta lleva `lang` · ALTA · M

`index.html` tiene `lang="es"` fijo y no hay ningún otro atributo `lang` en toda la app. Un lector
de pantalla lee «Ciao, come stai?» con voz y reglas del español.

**Arreglo.**

- Un helper que envuelva el texto meta en `<span lang="it">` o `lang="pt-BR"`.
- `lang` en el contenedor de las lecturas y de las correcciones.

### C2. Botones de ícono sin nombre ni estado · MEDIA · S

- La cabecera se anuncia como «🔊» y «☀️», sin `aria-pressed`.
- Los 53 nodos de Percorso se anuncian como «1», «🔒» o «⚔️», sin decir qué semana son.
- La barra inferior no marca la pestaña activa (`aria-current="page"`).

### C3. Zonas táctiles chicas · MEDIA · S

- Botones de la cabecera: 34×34. La regla para pantallas chicas los achica justo en el teléfono
  (`it/theme.css:580`).
- ✕ de las rondas: 39×39.
- Teclas de acentos: 31-36 px de ancho.
- 🔊 de la corrección: 34×30.
- Chips «usos»: 21 px de alto.
- Checkbox de Io: 24×24.

**Arreglo.** Llevar todo a 44×44, o ampliar el área táctil con un pseudo-elemento.

### C4. Contraste · MEDIA · S

- **Botón principal de Rumo C1:** 3,42:1 en claro y 2,57:1 en oscuro. Con `#c2401c` sube a 5,19:1.
- **Controles del karaoke en oscuro:** 2,46 (it) y 2,11 (pt).
- **«Cómo se arma» en pt:** 2,97.

### C5. Otros detalles · MEDIA/BAJA · S

- **Scroll horizontal a 320 px en Io:** `select#goal` estira la página a 338 px. Se arregla con
  `max-width: 100%`.
- **«Reducir movimiento» incompleto:** siguen el sacudón de cada error, la hoja de «¿Por qué?» y
  el pulso infinito del temporizador (`app.css:512`). El confeti tampoco lo respeta.
- **Lecturas sin teclado:** las palabras tocables de las lecturas son `span` sin rol ni foco (80
  en el episodio 1 del italiano y 114 en el del portugués).
- **Foco:** no hay estilo propio; los campos de texto usan `outline: none`. Conviene un
  `:focus-visible` global de 3 px.
- **Textos chicos:** hay etiquetas de 8-11 px (RACHA, ESCUDOS, la barra inferior).
- **Manifiesto:**
  - faltan `id` y `screenshots`;
  - `theme_color` no coincide con el color de cada idioma, así que la pantalla de inicio cambia
    de color al abrir.

---

## D. Italiano

### D1. El corrector rechaza traducciones correctas con reglas falsas · ALTA · M

En una muestra de 200 ítems de escritura, unos 11 (≈5 %) rechazan una traducción correcta con una
regla inventada:

| Respuesta del alumno | Lo que dice el corrector |
|---|---|
| *carina* | «significa «lindo / mono». Acá va *bella*» |
| *A loro piacciono…* | «el objeto directo de persona no lleva a» |
| *Ha detto di essere stanca* | «conjugado queda *era*» |
| *arrivava* | «passato prossimo: *sarebbe arrivata*» |

Además, 191 de 893 ítems de traducción aceptan una sola respuesta.

**Arreglo.**

- Aceptar sinónimos cuando las glosas coinciden.
- Guardas en `diagnosi.js` para no aplicar esas reglas fuera de su caso.
- Ampliar las listas de respuestas aceptadas.
- Un botón «Mi respuesta es válida», que anote el ítem para revisarlo.

### D2. Las 10 traducciones al castellano se corrigen como si fueran italiano · MEDIA · S

Ejemplo: *Hizo el ridículo* → «Mezcla español e italiano. En italiano: *Hizo un papelón*».

**Arreglo.** Marcar la dirección de esos ítems y corregirlos sin el diagnóstico del italiano.

### D3. De la semana 27 en adelante, la lectura, la escucha y la escritura no crecen · ALTA · M–L

- **Lectura:** el texto de la semana tiene en promedio 94 palabras tanto en las semanas 1-13 como
  en las 40-52, siempre con tres preguntas literales. El examen tiene textos de unas 800 palabras
  y en el medio no hay nada.
- **Escucha:** el dictogloss llega a 107 palabras como máximo. La única escucha larga es la del
  examen, de unos dos minutos.
- **Escritura:** *Scrivi* pide 60 palabras en las semanas 40-51, mientras el examen pide 200 y 120.
  No hay síntesis ni reseña, y la semana 47 pide una lista de compras.

**Arreglo.**

- Textos de 300-900 palabras desde la semana 27, con preguntas de tipo CILS/CELI.
- Una escucha larga por semana con las dos voces que ya existen.
- Mínimos de *Scrivi* que suban hasta 200 palabras, con géneros de C1: carta formal, reseña,
  síntesis, texto argumentativo.

### D4. Vocabulario B2 y C1 casi ausente · MEDIA · M

Todo el contenido cubre el 34 % de los lemas B2 y el 29 % de los C1 de `frequenza.json`. Las
semanas 40-52 enseñan 118 palabras en total, y el banco no tiene ningún lema C1.

### D5. Biblioteca sin escalón intermedio · MEDIA · M

Son siete libros de 1878-1921, todos rotulados C1, con 93,6-95,4 % de cobertura incluso en la
semana 52. No hay nada para A2-B1 ni prosa actual.

**Arreglo.**

- Recomendar por capítulo según la cobertura.
- Sumar textos modernos con licencia libre.

### D6. Detalles · BAJA · S

- **«Adiviná»:** el 4 % de las opciones cambia el orden de las palabras sin sentido (*Proposito a,
  hai sentito Marco?*) y se explica con una regla que ahí es falsa.
- ***Encontrá el error*:** desde la semana 5 aparecen imperativos con pronombre pegado (*Dimmi*,
  *Fammi sapere*) marcados como de la semana 1, y hay 44 ítems que no están en ninguna semana.

---

## E. Portugués de Brasil

### E1. El corrector rechaza portugués de Brasil correcto · ALTA · M

| Forma | Qué pasa hoy |
|---|---|
| *pra / pro* | Rechazado en 21 de 27 pruebas; 28 de 29 oraciones del banco no lo aceptan |
| *tava* | «no existe», aunque se enseña en la semana 38 |
| *cês* | «no es una palabra portuguesa» |
| *Eu amo você* | «falta *te*» |
| *chegou no Rio* | Marcado como error, aunque la explicación dice que es la forma hablada |

*A gente* sí funciona: 44 de 44.

**Arreglo.** Tratar estas formas como variantes libres en `canon()` de `diagnosi.js`, con «Casi»
solo cuando la consigna pide registro formal.

### E2. Las semanas 37-52 no entrenan la tarea del Celpe-Bras · ALTA · M

El Celpe-Bras integra lectura o escucha con escritura de un género. En la app:

- las tareas de escritura semanales tienen la consigna en español, piden 30-60 palabras y no parten
  de ningún texto ni audio;
- en el examen final, la escritura no usa los textos del propio examen;
- la comprensión es de opción múltiple en español.

**Propuesta.** Un módulo «Tarefa» en las semanas 40-52:

- un insumo leído o escuchado con la voz del teléfono;
- un enunciado en portugués: quién escribe, a quién, para qué y qué género;
- 150-200 palabras;
- la grilla del Celpe-Bras que ya existe.

### E3. La lectura y la escucha no crecen · MEDIA · M

*A semana* tiene unas 150 palabras tanto en la semana 27 como en la 52. Los dictogloss tienen
78-102 palabras. Todos los textos son expositivos. Corresponde el mismo arreglo que D3.

### E4. Biblioteca: ortografía sin modernizar · MEDIA · S–M

- 488 ocurrencias (71 palabras) sin la tilde moderna: *saude*, *seculo*, *moveis*, *socio*…
- En Eça: *tambêm* (64), *ninguêm* (7).
- Otras grafías viejas: *objectou*, *adhesão*, *recompoz*, *idéia*, *jóias*, *vôos*.
- *cousa* y *dous* aparecen unas 1.100 veces sin glosa.

**Arreglo.** Reglas nuevas en `tools/pt/ortografia.js`, con su test, y glosa de las formas
arcaicas al tocarlas.

### E5. Las frases no suenan a la calle · MEDIA · S

De las 455 frases de conversación, ninguna usa *pra / pro* ni *cê*. Hay mezclas de registro como
*Bora para a praia?*.

### E6. Explicaciones que se contradicen · MEDIA · S

- Las notas de *joelho* y *espalhar* dicen que *lh* «suena parecido a li», y Sons dice que no.
- «tarde = tarlle».
- *Fica quieto e escuta-me* aparece como ejemplo formal, pero suena europeo; en Brasil sería
  *Fique quieto e escute-me*.

### E7. Detalles · BAJA · S

- **Tres lenguas** pasa sus 1.780 chequeos, pero tiene detalles:
  - *família* como ejemplo de *lh*;
  - *caldo / calor* por «caliente»;
  - *Rosário / Rosario*.
- **Etiquetas dentro de la respuesta:** los ítems s4-46-33 y s4-46-36 llevan «(PT)» o «(Texto
  formal)» dentro de lo que el alumno tiene que escribir.

---

## Lo que está bien y conviene no romper

- **Guardado.** Todo acceso a `localStorage` está protegido. `sanitize` resiste valores raros en
  los campos base (se probó con un fuzz). La racha, los escudos y la meta del fin de semana no se
  rompen con el cambio de horario.
- **IA.** Las respuestas siempre pasan por `esc`: no se encontró XSS. Las claves de IA quedan solo
  en el teléfono, por idioma, y no entran en la copia exportada.
- **Tests y build.** `npm test` pasa en unos 2 minutos. `npm run build` reproduce exactamente
  `docs/lang/*/data/`. `smoke` y `sim` pasan.
- **Sin conexión.** Anda y el SW lista todos sus archivos. Los 128 audios de Common Voice coinciden
  con su índice.
- **Auditorías anteriores.** Casi todo lo que señalaron para el principiante quedó resuelto, como
  muestra la tabla de arriba.
