# Plan: de La Via C1 a un curso-juego de filosofía

Diagnóstico (paso 2). **No se cambió código todavía**: esto espera tu OK.

## 0. De dónde sale la base

- La rama `ccr-f31ce70c-nyfpin` no existe en `auparrino/It`. La v1.55 era la
  rama por defecto (`claude/italian-c1-game-course-rb3i2b`, 25/09), pero
  `main` ya iba por la **v3.11.4** (17/10). Elegiste esa, y es la que está
  copiada en `main` de este repo, en un solo commit y sin historial
  (`auparrino/It@0bdfb61`, 756 archivos, unos 43 MB).
- La v3 ya resuelve la mitad del problema. Es **una sola app con un núcleo
  común** (`docs/js/`) y **un paquete por idioma** (`docs/lang/it|pt|de/`),
  y la regla es que «el núcleo no nombra un idioma nunca». El paquete alemán
  muestra cuánto alcanza para tener un curso andando: `lang.js`, `rules.js`,
  `theme.css` y un `course.json`, y declara en `missing` lo que todavía no
  tiene. El resto del núcleo anda sin esos archivos.
- Hoy `npm test` pasa en verde sobre la base copiada.

### ⚠️ Antes de activar GitHub Pages en este repo

Las dos apps quedarían en el mismo dominio (`auparrino.github.io`), y eso
significa que comparten `localStorage` y las cachés del service worker. Tal
como está la copia:

1. `boot.js` encuentra `laviac1.save.v1` y abre la app en italiano **con tu
   progreso real**. Lo que guarde ahí pisaría el progreso de La Via C1.
2. `sw.js` borra al activarse todas las cachés que empiezan con `c1-` y no
   son la suya, o sea **la caché offline de La Via C1**.
3. `c1.lang`, `c1.kb2`, `c1.gist.token` y `c1.tres.v1` también se comparten.

Lo primero que hace la adaptación es cambiar todos los prefijos (`filo.*`,
caché `filo-v…`). Hasta entonces, **no actives Pages**.

## 1. El motor: se reutiliza tal cual (o casi)

| Pieza | Dónde | Qué hace | Para filosofía |
|---|---|---|---|
| Arranque y paquetes | `js/boot.js` | elige el paquete y carga paquete y núcleo en orden; el selector | **tal cual**: los paquetes pasan a ser *ediciones* (es, it, pt, de) |
| Motor | `js/engine.js` | estado, guardado, xp, niveles, racha, meta diaria, FSRS, `enqueue` | tal cual |
| Lecciones en pasos | `js/lezione.js` | sesiones de ~12 pasos, bloques de teoría (regla, tabla, ejemplos, «ojo», tip) con chequeos | tal cual: un bloque es una idea, una tesis o un argumento |
| Rondas y ejercicios | `js/drills.js` | ronda de la semana, Dominala, jefe por destreza, repaso, débiles, pausa | tal cual; se ajustan las destrezas del jefe (§4) |
| Percorso y misiones | `js/app.js`, `js/capas.js` | semanas, 3 estrellas, misiones obligatorias y opcionales, estaciones | tal cual |
| Oggi, plan del día, progreso | `js/inicio.js`, `js/plan.js`, `js/progreso.js` | la semana arriba, plan en 5/15/30 min, reloj de estudio, hábito, primer arranque | tal cual (cambian los bloques de input y producción) |
| La regla como ficha | `js/reglas.js`, `js/porque.js` | cada ejercicio enlazado a su bloque de teoría; «¿Por qué?» | tal cual: «¿por qué es esta la respuesta?» lleva al bloque de la idea |
| Corrección y errores | `js/errores.js` | un objeto de error para todo, la Clínica, «🙋 Mi respuesta es válida» | el motor, tal cual; cambian las categorías (§1b) |
| IA | `js/ia.js` | Claude Haiku con la clave del alumno, streaming, reintentos | tal cual; es la pieza central de las preguntas abiertas |
| Mi gramática → **Mis ideas** | `js/referencia.js` | todos los bloques, buscables, con su estado | tal cual, con otro nombre |
| «Consultar» | `js/capas.js`, `js/referencia.js` | diccionario del curso y referencia | se vuelve **diccionario filosófico** (glosario + semana + bloque) |
| Ubicación | `js/ubicacion.js` | test adaptativo de 25 preguntas que abre semanas | tal cual: «¿ya sabés algo de filosofía?» |
| Lecturas | `js/letture.js` | el lector con preguntas, velocidad de lectura | tal cual, con **fragmentos de fuentes primarias** |
| Biblioteca | `js/biblioteca.js`, `tools/lib/build_biblioteca.js` | libros enteros de Gutenberg/GITenberg, lector, capítulo recomendado | **tal cual y muy valiosa**: Platón, Descartes, Hume, Kant, Mill, Nietzsche son de dominio público y están en los cuatro idiomas. Cambia la «cobertura» (§1b) |
| Escritura guiada, Tres vueltas, Reformulación | `js/escritos.js`, `js/escritura_plus.js` | escribir con lo visto; la consigna tres veces; reescribir con la IA | se adaptan: el argumento escrito tres veces, cada vez más corto y preciso |
| Ordená el texto | `js/ordenar.js` | párrafos, oraciones o turnos desordenados | la base para **reconstruir argumentos** y **líneas de tiempo** |
| Duelos | `js/duelli.js` | duelo de preguntas con tiempo | tal cual («Duelo de escuelas») |
| Modo oficina | `state.silent` | nada suena solo | tal cual |
| PWA offline | `sw.js`, `manifest.webmanifest`, `index.html` | todo sin internet; el paquete en uso se precachea | tal cual, con los prefijos nuevos |
| Copia y nube | `js/nube.js`, exportar e importar | copia en un Gist secreto; archivo | tal cual |
| Teclado de la app | `js/teclado.js` | teclado propio con las letras del idioma | se queda **solo para las ediciones it, pt y de** (en filosofía casi todo se elige, se escribe poco) |
| Tarjeta para compartir, confetti, calendario `.ics`, recordatorios | `app.js`, `LANG.card`, `LANG.confetti` | — | tal cual, con otra estética |
| Fuera de la app | `js/fuera.js` | ficha semanal con material de afuera y minutos de input | se adapta: podcasts, videos y textos de filosofía |
| Herramientas | `tools/lib/pack.js`, `sim_carriera.js`, `smoke_*.js`, `testkit.js`, CI | carga un paquete en Node, un año simulado, pruebas en Chromium | tal cual: son la red de seguridad del cambio |

### 1b. Motor que cambia de contenido pero no de mecánica

- **Las categorías de error** (`Diagnosi.LABEL`, la Clínica, el «Cuaderno de
  itañol»). Pasan a ser las **confusiones típicas**: atribuir mal un autor,
  confundir escuelas (empirismo y racionalismo, estoicos y epicúreos),
  anacronismos, falacias que no se ven, validez contra verdad, el «hombre de
  paja» de un autor (resumir a Nietzsche como nihilista, a Maquiavelo como «el
  fin justifica los medios»), citas apócrifas. La Clínica queda: «12
  ejercicios con lo que más te cuesta». El cuaderno se vuelve el **«Cuaderno
  de malentendidos»**, que se pone en verde con catorce días sin repetir el
  error.
- **La cobertura de la Biblioteca.** Hoy mide el % de palabras conocidas.
  Pasa a medir **qué ideas del texto ya viste** (los conceptos del glosario
  que aparecen en el capítulo) y abre el libro cuando llegás a su semana.
- **Las cuatro cuerdas** (input, output, forma, fluidez). Pasan a ser
  **leer, argumentar, conceptos y rapidez**: misma barra, otros nombres.
- **Palabras de la semana → Conceptos de la semana.** `vocab` mantiene su
  forma: `[término, definición breve, ejemplo o cita, cómo se usa / contra qué
  se confunde]`.
- **Frase del día → Cita del día**, y **Palabra del día → Concepto del día**.

## 2. Lo específico del idioma: se saca o se reemplaza

| Pieza | Dónde | Qué pasa |
|---|---|---|
| Conjugador y gimnasio de verbos | `lang/*/conjugator.js`, `tools/*/verbi_irregolari.js`, ítems `conjugate`, `persons`, `tenses`, `gymShare` | **se saca** |
| Diagnóstico de errores lingüísticos | `lang/*/diagnosi.js` (225 a 240 KB cada uno) | **se saca**; las categorías nuevas van en un `diagnosi.js` chico (§1b) |
| Escritura libre con reglas de gramática y LanguageTool | `lang/*/scrivi.js`, `scrivi_corpus.json`, `LANG.lt` | **se reemplaza** por una revisión local de la respuesta abierta (¿nombra los conceptos clave?, ¿tiene tesis y razón?, ¿largo?) más la IA (§3) |
| Audio, voces y pares mínimos | `lang/it/audio/cv` (128 archivos), `voci_cv_data.js`, `js/voci.js`, `js/suoni.js`, ítems `listen`, `coppia`, `dictation` | **se saca** el audio grabado y los sonidos. Queda la voz del teléfono (TTS) para «leer en voz alta» un bloque o una cita, opcional y apagada en modo oficina |
| Frases de conversación y escenas | `lang/*/frasi_data.js`, `js/frasi.js`, Parla | **se reemplazan**: `frasi.js` ya hace colección + escenas + repaso, y sirve para las **citas** (una escena = un autor o un debate) |
| Lampo 60″ y «Parola o no?» | `app.js` | **se adaptan** (§5) |
| Banco de ejercicios de los manuales | `tools/it/fuentes`, `tools/it/bank`, `extract_dummies.py`, `extract_routledge.py`, `bank*.json`, `js/banca.js` (la parte de formas), ítems con `src: dummies/routledge`, `challenges` (339 de Routledge) | **se saca**. `banca.js` queda solo si se usa para generar distractores de autores y escuelas; si no, va a `missing` |
| Lessico, frecuencia, colocaciones | `tools/it/lessico.py`, `build_frequenza.py`, `frequenza.json`, `freq_data.js`, `js/frequenza.js`, `formule_data.js` | **se saca** |
| Desglose «palabra por palabra» | `js/desglose.js`, `desglose_data.js` | **se saca** |
| Mapas de preposiciones | `js/mapas.js`, `mapas_data.js` | **se saca** (la idea de un dibujo SVG dentro de la lección puede volver para los diagramas de argumentos) |
| Dictogloss, C-test, Variaciones | `dictogloss_data.js`, `js/ctest.js`, `js/variaciones.js` | **se saca** (el C-test no sirve con conceptos) |
| Tres lenguas | `js/tres_lenguas.js`, `lang/tres_lenguas_data.js` | **se saca** por ahora. Puede volver como «el mismo concepto en cuatro lenguas» (*Dasein*, *virtù*, *saudade*), que con las cuatro ediciones sale casi solo |
| Radio | `js/radio.js`, `radio_data.js`, `tools/*/radio` | **se pausa** (va a `missing`). Más adelante: un diálogo filosófico a dos voces por semana, que el reproductor ya sabe mostrar |
| Tramo C1 | `js/tramo.js`, `tramo_data.js`, `tools/*/tramo` | el mecanismo queda (lectura larga + tarea integrada); el contenido se rehace en la estación 3 y 4: una fuente larga y un **ensayo breve** por semana |
| Para el trabajo (escenas de oficina) | `js/trabajo.js`, `trabajo_data.js` | **se saca** (con el portugués ya andaba vacío) |
| Examen C1 por versiones | `esame_data.js`, `js/app.js` (`esameItems`) | el mecanismo queda; se rehace como **examen final** con tres versiones: comprensión de un texto, conceptos, argumentación y ensayo |
| Test del idioma, ubicación de nivel MCER, CILS/CELI/Celpe-Bras/Goethe | `LANG.exam`, `level`, `seasons.level` | **se reemplaza**: niveles 1 a 4 por estación, sin MCER |
| Reglas de normalización del idioma | `lang/*/rules.js` | quedan las genéricas (tildes, mayúsculas, sinónimos aceptados) en cada edición; se sacan artículos, trampas morfológicas y distractores por género |
| Tests del idioma | `tools/it/test_*.js` (8), `tools/pt/test_*.js` (9), `tools/de/test_curso.js`, más los `test:content` (`check_lessons.py`, `check_letture.py`, `check_radio.py`, `check_trabajo.py`) y unos 15 de los 35 `tools/lib/test_*.js` (desglose, mapas, tres lenguas, frases, banco, notas_it, tema_it, contenido_pt, radio, trabajo…) | **se borran** junto con su módulo, y se escribe un `test_curso.js` por edición (estructura, ids, opciones, citas con fuente, paridad entre ediciones). Los tests del motor (estado, racha, plan, reglas, errores, ia, nube, versión, rutas, capas, lecciones) se adaptan y se quedan |
| READMEs, auditorías, `CONTENIDO.md`, `CLAUDE.md` | raíz y `auditorias/` | se reescriben: README nuevo; auditorías y `README-*` del idioma afuera (quedan en el repo It) |
| Marca, estética, íconos | `LANG.brand`, `theme.css`, `icons/`, `manifest`, `index.html`, `fonts/` (Playfair, Fraunces) | **se reemplazan** (§7) |

Con todo esto, la app pasa de unos 43 MB a algo de **2 a 4 MB**.

## 3. Las cuatro ediciones (es, it, pt, de)

Elegiste que la filosofía misma esté en italiano, portugués y alemán, con el
castellano como base. La propuesta:

- **Una edición = un paquete** de los de hoy: `docs/lang/es/`,
  `docs/lang/it/`, `docs/lang/pt/`, `docs/lang/de/`, cada uno con su
  `course.json` en esa lengua, su guardado (`filo.es`, `filo.it`…) y su tema.
  El selector pregunta: «¿En qué idioma querés estudiar filosofía?».
- **Una sola fuente de contenido.** Cada semana se escribe una vez, en
  `tools/curso/wNN.py`, con cada texto en los cuatro idiomas
  (`{"es": …, "it": …, "pt": …, "de": …}`). El build arma los cuatro
  `course.json`. Así las ediciones no se separan, y un test controla la
  **paridad**: que cada ítem y cada bloque estén en las cuatro, con los mismos
  ids. La alternativa (escribir cada edición aparte, como el alemán de hoy) es
  más simple al principio y se desordena enseguida.
- **La interfaz, en castellano** en las cuatro ediciones, como en los cursos
  de idioma. Lo que cambia es el contenido, y con 🇪🇸 se ve el mismo bloque o
  la misma pregunta en castellano. Ese es el puente para estudiar filosofía en
  un idioma que todavía se está aprendiendo.
- **Las citas, en su lengua original** cuando es una de las cuatro (Kant y
  Nietzsche en alemán, Maquiavelo en italiano), con la traducción de dominio
  público al lado.
- **El orden**: primero la edición **es** entera, las 52 semanas; después
  **it** y **pt** (llevás italiano y portugués cerca del C1); el **de** al
  final. Con alemán de A1, un Kant en alemán no se puede leer todavía, así
  que esa edición puede empezar con glosas y las ayudas en castellano siempre
  a mano.
- **La traducción** la hace la IA a partir del castellano revisado, y un test
  marca lo que falta. Para el italiano y el portugués conviene una revisión
  tuya. El alemán, como hoy, queda marcado «en construcción» hasta que lo
  revise alguien.

## 4. Temario: 52 semanas en cuatro estaciones

La misma estructura que La Via: 4 estaciones de 13 semanas, jefe en la 13, la
26 y la 39, examen final en la 52. Va en orden histórico, y cada **rama**
aparece donde la historia la pide (la lógica con Aristóteles, la política con
Hobbes) y vuelve más adelante con más profundidad. Cada semana trae una
lección de unos tres tramos y unos ocho bloques, entre 60 y 90 ejercicios y
de 10 a 15 conceptos.

**Estación 1 · Los griegos: aprender a preguntar** (nivel 1)

| # | Semana | Rama |
|---|---|---|
| 1 | ¿Qué es filosofía? Asombro, mito y logos; premisa, conclusión y cómo leer un argumento | lógica |
| 2 | Los milesios y Pitágoras: la búsqueda del *arjé* | metafísica |
| 3 | Heráclito y Parménides: el devenir y el ser | metafísica |
| 4 | Pluralistas y atomistas: Empédocles, Anaxágoras, Demócrito | metafísica |
| 5 | Los sofistas y Sócrates: relativismo, ironía, mayéutica | ética |
| 6 | **Lógica I**: validez y verdad, deducción e inducción, *modus ponens* y *tollens* | lógica |
| 7 | Platón I: las Ideas, la caverna, la reminiscencia | metafísica, epistemología |
| 8 | Platón II: el alma y la justicia en la *República* | política |
| 9 | Aristóteles I: sustancia, las cuatro causas, acto y potencia | metafísica |
| 10 | **Lógica II**: el silogismo y las falacias clásicas (*ad hominem*, hombre de paja, petición de principio, falso dilema) | lógica |
| 11 | **Ética I**: Aristóteles, la virtud, la *eudaimonía* y el término medio | ética |
| 12 | Los helenísticos: estoicos, epicúreos, escépticos y cínicos | ética |
| 13 | 🏛️ **Jefe: el Ágora** (repaso de la estación) | — |

**Estación 2 · De Roma a la Ilustración: fe, razón y método** (nivel 2)

| # | Semana | Rama |
|---|---|---|
| 14 | Plotino y Agustín: fe y razón, el mal, el tiempo | metafísica |
| 15 | La Edad Media: Boecio, Anselmo (el argumento ontológico), Avicena, Averroes, Maimónides | metafísica |
| 16 | Tomás de Aquino y Ockham: las cinco vías, la navaja, los universales | metafísica, lógica |
| 17 | Renacimiento y ciencia nueva: Montaigne, Bacon, Galileo | epistemología |
| 18 | **Política I**: Maquiavelo y Hobbes, el estado de naturaleza y el contrato | política |
| 19 | Descartes: la duda metódica, el *cogito*, el dualismo | epistemología, metafísica |
| 20 | Spinoza y Leibniz: sustancia, mónadas, el mejor de los mundos | metafísica |
| 21 | **Epistemología I**: Locke y Berkeley, ideas, cualidades y percepción | epistemología |
| 22 | Hume: causalidad, el problema de la inducción, el «es» y el «debe» | epistemología, ética |
| 23 | **Política II**: Locke, Montesquieu, Rousseau; derechos, división de poderes, voluntad general | política |
| 24 | Kant I: la *Crítica de la razón pura*, lo *a priori*, el giro copernicano | epistemología |
| 25 | **Ética II**: Kant, el imperativo categórico y la deontología | ética |
| 26 | 💡 **Jefe: el Salón de la Ilustración** | — |

**Estación 3 · El siglo XIX y el XX: sistemas y rupturas** (nivel 3)

| # | Semana | Rama |
|---|---|---|
| 27 | El idealismo alemán: Fichte, Schelling, Hegel y la dialéctica | metafísica |
| 28 | Schopenhauer y Kierkegaard: la voluntad, la angustia, la elección | ética |
| 29 | **Ética III**: el utilitarismo de Bentham y Mill (y el dilema del tranvía) | ética |
| 30 | Marx: el materialismo histórico, la alienación, la ideología | política |
| 31 | Nietzsche: la muerte de Dios, la genealogía de la moral, la voluntad de poder | ética |
| 32 | **Estética I**: la *mímesis*, lo bello y lo sublime (Platón, Aristóteles, Kant, Hegel) | estética |
| 33 | El pragmatismo: Peirce, James, Dewey | epistemología |
| 34 | **Lógica III**: Frege y Russell; lógica proposicional y tablas de verdad | lógica |
| 35 | El giro lingüístico: Wittgenstein I y II, el Círculo de Viena | lógica, epistemología |
| 36 | La fenomenología: Husserl y Heidegger | metafísica |
| 37 | El existencialismo: Sartre, Beauvoir, Camus | ética |
| 38 | **Metafísica**: identidad personal, libre albedrío y determinismo, ¿qué hay? | metafísica |
| 39 | 🔥 **Jefe: el Café de Flore** | — |

**Estación 4 · Hoy: los problemas abiertos** (nivel 4)

| # | Semana | Rama |
|---|---|---|
| 40 | Filosofía de la ciencia: Popper, Kuhn, Lakatos, Feyerabend | epistemología |
| 41 | **Epistemología II**: Gettier, el escepticismo, qué es justificar | epistemología |
| 42 | Filosofía de la mente: mente y cuerpo, funcionalismo, la habitación china, los *qualia* | metafísica |
| 43 | La Escuela de Frankfurt: Adorno, Horkheimer, Benjamin, Habermas | política, estética |
| 44 | Estructuralismo y después: Foucault, Derrida, Deleuze | epistemología, política |
| 45 | **Política III**: Rawls, Nozick, el comunitarismo, Arendt | política |
| 46 | Filosofía feminista: Wollstonecraft, Beauvoir, Butler, la ética del cuidado | ética, política |
| 47 | Filosofía latinoamericana: Las Casas, Alberdi, Kusch, Dussel, la filosofía de la liberación | política |
| 48 | Más allá de Occidente: Confucio, Laozi, el budismo y Nagarjuna, el *ubuntu* | ética, metafísica |
| 49 | **Estética II**: ¿qué es arte? Benjamin, Danto, el arte contemporáneo | estética |
| 50 | Ética aplicada: bioética, los animales (Singer), el ambiente | ética |
| 51 | Tecnología, IA y el sentido de la vida | ética, metafísica |
| 52 | 🎓 **Examen final** (tres versiones) | — |

Cada rama, en resumen: **ética** en las semanas 11, 25, 29, 50 (y 5, 12, 28,
31, 37); **epistemología** en 21, 22, 24, 41 (y 7, 17, 19, 40); **metafísica**
en 2-4, 9, 38 (y 15, 20, 27, 36, 42); **lógica** en 1, 6, 10, 34 (y 16, 35);
**política** en 8, 18, 23, 45 (y 30, 43, 46, 47); **estética** en 32 y 49 (y
43). Si preferís, la filosofía no occidental puede ir antes, en la estación 1,
junto a los griegos.

**Los jefes** pasan a ser por destreza (`Drills.buildBoss` ya lo hace), con
otras cuatro: **comprensión** (un fragmento con preguntas), **conceptos**,
**argumentos** (reconstruir y evaluar) y **contexto** (autor, escuela, época).
Cada una pide su 55 %.

## 5. Tipos de ejercicio para filosofía

Casi todos salen de los tipos que el motor ya dibuja (`choice`, `scopri`,
`cloze`, `typed`, `fixerr`, `garden`, `tiles`, `flash`) y de `ordenar.js`.
Hay tres renderers nuevos.

| Ejercicio | Ejemplo | Sale de |
|---|---|---|
| **¿Quién lo dijo?** | «El hombre es la medida de todas las cosas» → Protágoras / Sócrates / Platón | `choice` |
| **¿De qué escuela es esta tesis?** | «Nada hay en el intelecto que no haya estado antes en los sentidos» → empirismo | `choice` |
| **Completá el concepto** | «Para Aristóteles, la virtud es un ___ entre dos vicios» → término medio | `cloze` con `accept` (sinónimos) y opciones al principio |
| **Definición ↔ término** | tarjeta: *epoché* → ¿qué es? (autoevaluada) | `flash` |
| **Descubrí la idea** | tres ejemplos → ¿qué principio comparten? | `scopri` |
| **La trampa** | «¿Qué dijo Maquiavelo sobre el fin y los medios?» con la frase apócrifa como trampa, y la explicación | `garden` (la opción-trampa con nota) |
| **¿Es válido?** | Si llueve, la calle se moja. La calle está mojada. Luego llovió. → inválido: afirmación del consecuente | `choice` |
| **Detectá la falacia** | un diálogo corto → ¿qué falacia es? (*ad hominem*, hombre de paja, pendiente resbaladiza…) | `choice` |
| **Encontrá la premisa floja** | un argumento en 4 líneas → tocá la premisa falsa o la que no se justifica | `fixerr` adaptado: marcar una línea en lugar de una palabra |
| **Reconstruí el argumento** | las premisas y la conclusión del *cogito* o de la tercera vía de Tomás, desordenadas → ordenalas | `ordenar.js` (ya marca conectores como pista) |
| **Línea de tiempo** | Descartes, Hume, Kant, Hegel → en orden | `ordenar.js` |
| **Relacioná** *(nuevo)* | 4 conceptos con 4 escuelas o autores (*arjé* ↔ milesios, *conatus* ↔ Spinoza) | renderer nuevo de pares; `coppia` está atado al audio |
| **Tabla de verdad** *(nuevo, semanas 6, 10, 34)* | completá V/F de *p → q* | renderer nuevo, chico |
| **Experimento mental** *(nuevo)* | el tranvía, la experiencia de Nozick, el velo de Rawls → elegí y justificá; no hay una respuesta correcta: te muestra qué escuela razona como vos y qué objeción le harían | renderer nuevo sobre `choice`, sin «correcto» |
| **Lectura de fuente** | un fragmento corto con 3 a 5 preguntas de comprensión | `letture.js` |
| **Pregunta abierta con IA** | «¿Por qué Hume dice que no podemos conocer la causalidad? En 3 a 5 oraciones» → revisión local (¿nombra hábito, conexión necesaria, impresión?) y después la IA con una rúbrica: tesis, razones, uso correcto de los conceptos, una objeción | Scrivi + `errores.js` + `ia.js` (el «unión» de local e IA ya existe) |
| **Diálogo socrático con IA** | la IA hace de Sócrates y te pregunta hasta que encontrás la contradicción de tu definición de «justicia» | Parla (el role-play) con otro *system* |
| **Defendé la posición contraria** | escribí la mejor objeción a tu propia respuesta | Tres vueltas / Reformulación |

Las respuestas escritas aceptan sinónimos y variantes con `accept`, y el
«🙋 Mi respuesta es válida» de hoy cubre lo que quede afuera. **Toda cita
lleva su fuente** (obra y pasaje), y las apócrifas se marcan como tales. Un
test lo controla.

## 6. Los modos de hoy: cuáles se adaptan y cuáles se van

| Modo | Pasa a ser |
|---|---|
| ☕ **Pausa caffè** | **☕ Pausa**: 3 minutos con lo de tu semana (conceptos, citas, una falacia) |
| 🎯 **Sfida del giorno** | **🎯 Desafío del día**: 6 preguntas a doble xp, a veces con un experimento mental |
| ⚡ **Lampo 60″** | **⚡ ¿Quién lo dijo? 60″**: citas contra reloj, récord |
| 🧠 **Parola o no?** | **🧠 ¿Lo dijo o no?**: citas reales y apócrifas mezcladas (Platón no dijo «solo sé que no sé nada», al menos no así) |
| 🔁 Repaso, repaso de 2 min, débiles, Dominala | tal cual |
| 🩺 Clínica de errores | **🩺 Clínica de malentendidos** (§1b) |
| 📓 Cuaderno de itañol / portuñol | **📓 Cuaderno de malentendidos** |
| Frase / Palabra del día | **Cita del día** y **Concepto del día** |
| 📚 Palabras (banco) | **📚 Conceptos**: todos los que viste, con su ficha |
| Escenas, frases y Parla (role-play) | **Citas** por autor + **Diálogo socrático** con IA |
| ⚔️ Duelos | **⚔️ Duelo de escuelas** |
| ✍️ Scrivi, Tres vueltas, Reformulación, Escritura guiada | **✍️ Argumentá**: pregunta abierta con IA, el argumento en tres vueltas, la objeción |
| 📖 Leggi, Lecturas, Biblioteca | **📖 Leer**: fragmentos de la semana y las obras enteras de dominio público |
| Tramo C1 (lectura larga + tarea) | **Fuente larga + ensayo breve** (estaciones 3 y 4) |
| Ubicación | **¿Ya sabés filosofía?** (test inicial adaptativo) |
| Jefes, Examen C1 | **Jefes de estación** y **Examen final** |
| Consultar, Mi gramática | **Diccionario filosófico** y **Mis ideas** |
| Fuera de la app | **Fuera de la app**: podcasts, clases y textos de afuera |
| 🤫 Modo oficina, plan del día, progreso, racha, meta, copia, nube, calendario | tal cual |
| Gimnasio de verbos, Suoni / pares mínimos, dictado, Dictogloss, C-test, Variaciones, Desglose, Mapas, Formule, Frecuencia, Para el trabajo, Tres lenguas, Radio (por ahora), audio grabado | **se eliminan** |

## 7. Marca, estética e íconos (propuesta, a confirmar)

- **Nombre**: **«Ágora»**, una sola palabra que se entiende en los cuatro
  idiomas (*agorà*, *ágora*, *Agora*), con la idea de la plaza donde se
  pregunta. Alternativas: «Logos», «Mayéutica», «Filosofía en 52 semanas».
- **Estética**: la Atenas clásica. Mármol, terracota y negro de vasija
  griega, una greca como ornamento, una columna o una lechuza (la de Atenea)
  como ícono. Cada edición puede tener su matiz (la *Scuola di Atene* para
  it, por ejemplo), pero conviene arrancar con una sola estética.
- Se cambian el `manifest` (nombre, descripción, colores, atajos), el
  `<title>` y los metas de `index.html`, los íconos (`icon.svg` y los PNG
  192, 512 y maskable, generados del SVG), la tarjeta para compartir, el
  confetti (🦉 🏛️ 📜) y los textos de `LANG.ui`. Un test controla que no
  quede «La Via», «C1», «italiano» ni «Rumo» en `docs/`.

## 8. Cómo lo haría (después de tu OK)

En PRs chicos, cada uno con `npm test`, lint, sim y smoke en verde:

1. **Separar**. Prefijos nuevos (guardado, caché y claves `c1.*`), nueva
   marca, manifest, íconos y título. La edición `es` arranca como el alemán
   de hoy (`missing` con todo lo de §2) y con las semanas 1 a 3 escritas. Se
   borran los paquetes it, pt y de del idioma, sus herramientas y sus tests,
   y `npm test` queda con los tests del motor más `tools/curso/test_curso.js`.
   Desde ahí ya **se puede activar Pages**.
2. **Limpiar el núcleo**. Se sacan los módulos del idioma (§2), sus pantallas
   y sus entradas en `boot.js`, `sw.js` y `app.js`, se renombran los modos
   (§6) y se pasan las categorías de error a malentendidos.
3. **Ejercicios nuevos**: relacioná, tabla de verdad, experimento mental,
   premisa floja, y la pregunta abierta con IA y su rúbrica.
4. **Contenido es**: la estación 1 entera con su jefe, después la 2, la 3 y
   la 4 (unas 4.000 preguntas en total, más las citas, las lecturas y la
   Biblioteca).
5. **Ediciones it y pt** desde la fuente única, con test de paridad; después
   **de**.
6. Radio (diálogos a dos voces), «el mismo concepto en cuatro lenguas» y lo
   que quede.

## Para decidir antes de empezar

1. ¿Te va el **temario** así, o movés algo (por ejemplo, Oriente al
   principio, o menos semanas de historia del XIX)?
2. ¿**«Ágora»** y la estética griega, o preferís otro nombre?
3. ¿**Una fuente única con los cuatro idiomas** (recomendado) o una edición
   escrita aparte por idioma?
4. ¿La interfaz **en castellano** en las cuatro ediciones (recomendado), o
   también traducida?
