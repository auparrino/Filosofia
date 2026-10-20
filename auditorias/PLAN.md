# Plan: terminar la auditoría y hacer que la app enganche

Un plan por etapas para dos cosas: (1) que el contenido quede **revisado
entero**, con un criterio de terminado medible, y (2) que la app sirva para
lo que de verdad falla hoy: **sostener el hábito** y llegar a un **nivel de
trabajo** (mails, reuniones, llamadas, presentaciones).

## Cómo se usa

**Para el alumno.** Abrí una sesión nueva de Claude Code sobre este repo y
escribí:

> Seguí con el plan.

Antes, elegí el modelo que indica la columna «Modelo» del paso que sigue
(escribí `/model claude-opus-5-5` o `/model claude-sonnet-5-5` al empezar la
sesión). La sesión lee este archivo, toma el **primer paso pendiente** de la tabla de
estado, lo hace, lo deja en verde y publicado, y actualiza la tabla. Si querés
uno en particular: «Hacé el paso 2.3 del plan». Una sesión = un paso (o
dos, si son chicos). No hace falta explicar nada más.

**Para la sesión que lo ejecuta.**

1. Leé este archivo entero y `auditorias/registro/README.md` si ya existe.
2. Tomá el primer paso con estado `pendiente` de la tabla (o el que te
   pidieron). Si hay uno `en curso`, seguí ese. Si el modelo de la sesión no
   es el de la columna «Modelo», avisale al alumno antes de empezar (para un
   paso *Opus*, recomendá cambiar con `/model claude-opus-5-5`).
3. Trabajá en una rama nueva desde `main`. Seguí el **procedimiento común**
   (abajo) al pie de la letra: sobre todo, la regeneración de `docs/` en un
   clon limpio.
4. PR → CI en verde (los cuatro jobs) → merge a `main` (GitHub Pages publica
   `main/docs`, así llega a la app). El alumno ya autorizó mergear los pasos
   de este plan con el CI en verde.
5. En el mismo PR, actualizá la tabla de estado (paso → `hecho`, fecha, PR) y
   agregá en la bitácora lo que no se pudo hacer o lo que queda pendiente.
6. Al terminar, contale al alumno en pocas líneas qué cambió **en la app**
   (qué va a notar), qué se verificó y qué no.

## Estado

| Paso | Qué | Modelo | Estado | PR / fecha |
|---|---|---|---|---|
| 0.1 | Inventario de todo lo revisable + registro con hash | Sonnet | hecho | 2026-10-04 |
| 0.2 | Tablero de cobertura (cuánto falta, por módulo e idioma) | Sonnet | hecho | 2026-10-04 |
| 1.1 | Arranque de un toque y día mínimo de 2 minutos | Sonnet | hecho | 2026-10-04 |
| 1.2 | Recordatorio diario sin servidor (evento de calendario .ics) | Sonnet | hecho | 2026-10-04 |
| 1.3 | Racha con comodín y «nunca dos días seguidos» | Sonnet | hecho | 2026-10-04 |
| 1.4 | Ruta de trabajo: escenas laborales (italiano) | Opus | hecho | 2026-10-04 |
| 1.5 | Ruta de trabajo: escenas laborales (portugués) | Opus | pendiente | |
| 1.6 | Juegos de rol laborales con la IA | Opus | pendiente | |
| 2.1 | Auditoría exhaustiva IT: lecciones (387 bloques) | Opus | pendiente | |
| 2.2 | Auditoría exhaustiva IT: ítems sem. 1-13 | Opus | pendiente | |
| 2.3 | Auditoría exhaustiva IT: ítems sem. 14-26 | Opus | pendiente | |
| 2.4 | Auditoría exhaustiva IT: ítems sem. 27-39 | Opus | pendiente | |
| 2.5 | Auditoría exhaustiva IT: ítems sem. 40-52 + examen + sfide | Opus | pendiente | |
| 3.1 | Auditoría exhaustiva PT: lecciones (373 bloques) | Opus | pendiente | |
| 3.2 | Auditoría exhaustiva PT: ítems sem. 1-26 | Opus | pendiente | |
| 3.3 | Auditoría exhaustiva PT: ítems sem. 27-52 + examen | Opus | pendiente | |
| 4.1 | Bancos IT: frases (864) y errores (584) | Opus | pendiente | |
| 4.2 | Bancos PT: frases (700) y errores (516) | Opus | pendiente | |
| 4.3 | Léxico IT y PT (~6.700 entradas) + falsos amigos unificados | Opus | pendiente | |
| 5.1 | Módulos IT: lecturas, radio, dictogloss, duelos, laboratorio, examen | Opus | pendiente | |
| 5.2 | Módulos PT: ídem + llenar lo oral vacío de las sem. 27-51 | Opus | pendiente | |
| 5.3 | Suoni IT y PT contra una fuente de pronunciación externa | Opus | pendiente | |
| 6.1 | Didáctica: progresión reconocer → producir en cada semana | Opus | pendiente | |
| 6.2 | Didáctica: tarea comunicativa de cierre por semana | Opus | pendiente | |
| 6.3 | Didáctica: remediación por categoría de error | Opus | pendiente | |
| 6.4 | Didáctica: repaso intercalado de formas que compiten | Opus | pendiente | |
| 6.5 | Didáctica: lecturas al 98 % de cobertura (glosas o lecturas fáciles) | Opus | pendiente | |
| 7.1 | Lo que no se verifica solo: lista de prueba en el teléfono | Sonnet | pendiente | |
| 8.1 | Cierre: muestra aleatoria de 300 unidades con un auditor nuevo | Opus | pendiente | |

**Modelo.** *Opus* (`/model claude-opus-5-5`) para todo lo que juzga o escribe
lengua y didáctica: revisar italiano y portugués, redactar escenas, ítems y
lecciones, decidir disputas. Ahí la calidad del revisor es lo que hace que una
auditoría encuentre todo. *Sonnet* (`/model claude-sonnet-5-5`) alcanza para
los pasos de código e infraestructura (inventario, tablero, recordatorio,
racha, lista de prueba) y es más rápido y barato. La sesión que ejecuta un paso
de *Opus* lanza también sus agentes revisores con Opus (`model: "opus"`).
Si un paso marcado *Sonnet* termina tocando contenido en la lengua meta,
esa parte se revisa con Opus.

El orden importa: la **fase 1 va primero** porque el cuello de botella hoy es
el hábito, no los errores: un curso perfecto que no se abre no enseña nada.
Las fases 2-5 corrigen; la 6 rediseña sobre contenido ya limpio.

## Bitácora

(Cada sesión agrega una línea: fecha, paso, qué quedó pendiente.)

- 2026-10-04 · plan creado. Antes: auditorías semanales IT/PT con muestreo
  (PR #64) y una tanda de producción IT 28-50 / C1 PT 43-50 (PR #65).
- 2026-10-04 · 0.1 y 0.2 hechos. `tools/audit/inventario.js` lista 14.029
  unidades en `it`, 11.827 en `pt` y 204 en `comun` (Tres lenguas), todas
  `pendiente`; `npm run cobertura` es el tablero (resumen en
  `auditorias/registro/README.md`). Quedó fuera a propósito la lógica de los
  módulos, la configuración (`freq_data.js`, `rules.js`) y lo derivado
  (`formule_data.js`, `frequenza.json`, Biblioteca). Ids por clave natural o
  `id` propio; donde no hay (frases de escena, bloques de lección, pares de
  banco) van por posición o por hash del español, así que insertar a mitad de
  una lista reabre las unidades que se corren. Para los pasos 2-5:
  `inventario.js --marcar <it|pt|comun> lote.json` anota una pasada.
- 2026-10-04 · 1.1 hecho (v3.5.0). Botón «⚡ 2 minutos» arriba de Oggi
  (también en mantenimiento): ronda de 6 ítems (repaso vencido y, si falta,
  práctica de la semana), sin menús; al terminar marca `state.dos[día]` y dice
  «Día cumplido». La tarjeta muestra los días con estudio de la semana
  (`Progreso.daysThisWeek`, que es la medida de días activos). Pendiente: probar
  en el teléfono (aspecto del botón en IT/PT) → paso 7.1.
- 2026-10-04 · 1.2 hecho (v3.5.1). El `.ics` recurrente ya existía (perfil y
  arranque); ahora todo pasa por `scheduleReminder` (guarda hora y `state.icsAt`),
  el perfil dice «Agendar mi rato diario», y hay una tarjeta «📅 Para no
  olvidarte» (con hora, pospone 3 días) desde los 10 intentos hasta que se
  agenda, más un botón en la tarjeta de regreso. Pendiente: abrir el .ics en un
  iPhone y un Android reales → paso 7.1.
- 2026-10-04 · 1.3 hecho (v3.6.0). Comodín semanal en `engine.js`
  (`coverPlan`): cada semana (lunes a domingo) el primer día perdido no corta la
  racha ni gasta escudo (`state.jokerWeek`); los demás días perdidos siguen
  costando un escudo cada uno. Si ayer no hubo (y no son 3+ días, que tiene su
  tarjeta de regreso), arriba de Oggi queda solo el botón «2 minutos», con
  «ayer no hubo, no pasa nada». Cambié dos expectativas de `test_frasi` (IT y
  PT): el día 3 de marzo ahora lo salva el comodín, no el escudo. Pendiente: la
  cabecera no muestra el comodín (solo el texto del calendario de Oggi).
- 2026-10-04 · 1.4 hecho (v3.7.0). Ruta «Per il lavoro»: `js/trabajo.js` +
  `lang/it/trabajo_data.js`, 13 escenas de la semana 8 a la 40 (presentarse,
  pausa café, instrucciones, llegar tarde, videollamada, mail formal,
  contestar y reenviar, teléfono, opinar, resultados, reclamo, plazos,
  delegar), cada una con diálogo (una voz por personaje), 12-13 frases con su
  construcción (son frases de Frasi: mismo repaso), 6 ítems de producción
  (repaso `trab:`) y un mail o mensaje con lista, corrector y modelo. Misión
  opcional en su semana y sección en Allena. `tools/it/check_trabajo.py`
  controla gramática y palabras contra el curso. Revisión: dos revisores
  independientes (70 y 73 hallazgos, ~22 comunes en la primera mitad: ~2 %
  sin ver), un tercero decidió y una tercera pasada corrigió 6 más (5 de una
  clase, ahora en el test: oraciones que empezaban con minúscula). Registro:
  las 249 unidades en `revisada-2`. De paso, tres falsos positivos del
  corrector de Scrivi (*te la inoltro*, *del 10% rispetto*, *come mai*).
  `lang/pt/trabajo_data.js` queda vacío para el 1.5. Pendiente: probar en el
  teléfono la lectura del diálogo con varias voces → paso 7.1.

---

## Fase 0 · Saber cuánto falta

**Por qué.** Cada auditoría encontraba cosas nuevas porque revisaba una
muestra y nadie llevaba la cuenta de qué estaba revisado. Sin inventario no
hay «terminado».

**0.1 Inventario y registro.** Un script `tools/audit/inventario.js` (o .py)
que lista cada unidad revisable de los dos idiomas con un id estable y un
hash de su contenido: ítems del curso, bloques de lección, sfide, entradas de
cada banco (sustantivos, verbos, adjetivos, palabras, frases, errores,
falsos amigos), y las unidades de cada módulo de `docs/lang/<lang>/*_data.js`
(una lectura, un episodio, un par mínimo, un duelo…). El registro vive en
`auditorias/registro/<lang>.json`: `{id: {hash, estado, revisores, fecha,
hallazgos}}` con estados `pendiente`, `revisada-1`, `revisada-2`, `disputa`.
Si el hash cambia, la unidad vuelve a `pendiente`: así lo nuevo o editado
nunca queda sin revisar. Un test (`tools/lib/test_registro.js`) comprueba que
el registro y el inventario están sincronizados (sin ids huérfanos).

**0.2 Tablero.** `npm run cobertura` imprime, por idioma y módulo,
unidades totales / revisadas dos veces / con hallazgos abiertos. Se copia el
resumen en `auditorias/registro/README.md` en cada paso.

## Fase 1 · Que la app enganche (alumno: un adulto que quiere nivel de trabajo y se olvida)

La app ya tiene «Hoy» por minutos (5/15/30), tarjetas de hábito y progreso.
Lo que falta es el **disparador** (acordarse sin depender de la voluntad), un
**umbral mínimo** ridículamente bajo y **contenido que sirva para el trabajo**.

**1.1 Arranque de un toque y día mínimo.** Al abrir la app, un botón grande
«2 minutos» que entra directo al primer ejercicio del plan, sin menús. Dos
minutos ya cuentan como día cumplido (lo importante es no cortar la cadena;
casi siempre se sigue). Medir: días activos por semana en `progreso`.

**1.2 Recordatorio sin servidor.** Una PWA sin servidor no puede mandar
notificaciones confiables. Solución: en el perfil, «Agendar mi rato diario»
elige hora y genera un evento `.ics` recurrente (diario, con alarma) que el
teléfono agrega a su calendario, con el enlace a la app. Ofrecerlo en la
primera semana y en la tarjeta de regreso.

**1.3 Racha amable.** Racha de días con un comodín por semana (un día perdido
no la rompe) y la regla «nunca dos días seguidos»: si ayer no hubo, hoy la
tarjeta de arriba es solo el botón de 2 minutos. Sin castigos ni culpa.

**1.4 / 1.5 Ruta de trabajo.** Un recorrido paralelo «Para el trabajo» por
idioma, desde el nivel A2: presentarse en una reunión, escribir y contestar
mails (formal *Lei* / *o senhor*), llamadas y videollamadas, pedir y dar
explicaciones, negociar plazos, presentar resultados, quejarse con cortesía,
small talk de oficina. Cada escena: diálogo modelo, 10-15 frases de uso con
su construcción, ítems de producción y una tarea (un mail, un mensaje).
Las escenas se enganchan a las semanas cuya gramática usan (condicional para
pedir, congiuntivo/subjuntivo para opinar…).

**1.6 Juegos de rol con la IA.** Con las claves del alumno (ya soportadas en
`docs/js/ia.js`): un personaje de trabajo por escena (el jefe, un cliente, un
proveedor) con objetivos («conseguí una semana más de plazo»), que corrige al
final con las categorías del diagnóstico. Opcional: por voz.

## Fases 2-5 · Auditoría exhaustiva

**Unidad de trabajo:** lotes de ~40 unidades del mismo tipo. **Cada lote lo
revisan dos revisores independientes** (agentes distintos, que no ven el
trabajo del otro) con la **lista de chequeo del tipo** (abajo). Lo que uno
marca y el otro no, lo decide un tercero. Cada unidad queda `revisada-2` en el
registro con sus hallazgos.

**Estimación de lo que queda (por paso).** Con dos revisores: si A encuentra
*a* errores, B encuentra *b* y *c* son comunes, el total estimado es
*a·b/c* y lo no visto ≈ *a·b/c − (a+b−c)*. Si lo no visto supera el 1 % de
las unidades del paso, se hace una tercera pasada sobre ese paso.

**Cada clase de error que aparezca 3+ veces se vuelve un test** en
`tools/lib/` o `tools/<lang>/` (como ya pasó con las notas «A = B», los
duplicados o la regencia en PT). Así no vuelve.

**Listas de chequeo.**
- *Bloque de lección:* regla verdadera (sin «siempre/nunca» falsos),
  ejemplos correctos y naturales, nada de gramática posterior, contraste con
  el español útil, `q` de comprobación que pruebe la regla y no el sentido.
- *Ítem:* lengua meta impecable; `answer` correcta; `accept`/`alt` con todas
  las variantes que un nativo daría y ninguna incorrecta; distractores que se
  descartan por la regla; consigna y nota en rioplatense, la nota explica el
  porqué; nivel y semana correctos; no duplica otro ítem.
- *Frase del banco:* correcta, natural, nivel real, traducción fiel.
- *Error del banco:* el `wrong` es realmente incorrecto (no una variante
  válida, ojo con el uso brasileño), una sola falla, corrección inequívoca.
- *Léxico:* glosa exacta, género/plural/régimen, nivel, nota de uso.
- *Lectura/episodio:* correcto, cobertura de vocabulario, preguntas con una
  sola respuesta defendible.
- *Par mínimo (suoni):* contrasta de verdad un sonido; verificado contra un
  diccionario de pronunciación (no contra la intuición del modelo).

## Fase 6 · Didáctica (sobre contenido ya limpio)

- **6.1** Meta por semana desde la estación 2: ≥40 % de ítems de producción,
  en orden reconocer → completar → transformar/traducir → producción libre.
  Un test que lo controle.
- **6.2** Una tarea comunicativa de cierre por semana ligada a su `fare`,
  corregida con pauta (por la IA si hay clave; si no, con autoevaluación
  guiada).
- **6.3** Si una categoría de error se repite (p. ej. 3 veces en 7 días),
  servir un mini-drill de esa categoría y reprogramarla en FSRS (hoy
  «una más» ofrece un ítem suelto).
- **6.4** Repaso intercalado de pares que compiten: passato prossimo /
  imperfetto, *ne* / *ci*, congiuntivo / indicativo; *ser* / *estar*,
  pretérito perfeito / imperfeito, *por* / *para*.
- **6.5** Lecturas C1 hoy al 92-95 % de palabras conocidas: subir al 98 %
  con glosas, o sumar lecturas fáciles y largas además de las difíciles.

Cada mejora de esta fase se mide antes y después con los datos de la propia
app (aciertos, errores por categoría, días activos) — si el alumno pasa una
copia exportada, se usa; si no, se mide con `npm run sim`.

## Fase 7 · Lo que una sesión no puede verificar

Audio y voces, la interfaz en el teléfono, el recorrido real. La sesión
escribe una lista corta (10-15 minutos) de qué probar en el teléfono después
de cada paso de las fases 1 y 6, y amplía `npm run smoke` donde se pueda
automatizar.

## Fase 8 · Cierre

Un auditor nuevo revisa una muestra aleatoria de 300 unidades del registro.
Menos de 3 errores reales → terminado. Si no, se vuelve a la fase del
módulo donde aparecieron.

---

## Procedimiento común (leer antes de tocar nada)

- **Fuentes, no datos.** Nunca editar a mano `docs/lang/*/data/*.json`.
  Las fuentes están en `tools/<lang>/{authored,lessons,bank,…}` y en
  `docs/lang/<lang>/*_data.js`. Ver `CONTENIDO.md` y `ARQUITECTURA.md`.
- **Agentes en paralelo** solo sobre archivos disjuntos; ninguno corre el
  build ni hace git (lo hace la sesión al final).
- **Regenerar `docs/` en un clon limpio.** El build lee su propia salida
  anterior (`lessico.names()` lee `course.json`; `sillabo`/`lessico` leen
  `bank.json`) y usa, si existe, un diccionario opcional
  (`tools/audit/node_modules/dictionary-es`) que CI no tiene. Por eso: clonar
  la rama en un directorio temporal **sin** `tools/audit/node_modules`,
  correr `npm run build` hasta que dos corridas seguidas no cambien nada,
  copiar ese `docs/` al repo y commitear. Si no, falla el job «docs/ se
  reproduce desde las fuentes».
- **Registro:** si agregás, borrás o editás contenido, después de regenerar
  `docs/` corré `node tools/audit/inventario.js --sync` y commiteá
  `auditorias/registro/` (el test `tools/lib/test_registro.js` falla si no).
  Para ver el avance: `npm run cobertura`.
- **Antes de subir:** `npm test`, `npm run sim` (sin duplicados), y que cada
  ítem nuevo quede en su semana (si el sílabo lo mueve, reescribirlo con
  palabras y gramática ya vistas).
- **Versión:** si cambia la app (JS/CSS), subir la versión en `package.json`,
  `docs/js/app.js` (`APP_VERSION`) y `docs/sw.js` (`VERSION`) a la vez.
- **Honestidad en el informe:** decir qué se verificó (build, tests, sim, CI)
  y qué no (audio, navegador real).
