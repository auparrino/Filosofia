# Auditoría 2: después de las correcciones

Segunda vuelta sobre el código ya mergeado (PR #7 y #8), con las mismas dos
lentes de la primera: un **principiante disperso** que entra de cero y una
**carrera completa** de 52 semanas. Cierra con lo que encontró el usuario
probando en el teléfono y con lo que quedó corregido en esta misma vuelta.

## Método

- **Carrera**: `node tools/sim_carriera.js --json`, siete días por semana con
  pausa y ripasso diarios, un estudiante que acierta el 90 % de las opciones
  y el 80 % de lo que escribe. Cuatro corridas (antes y después de cada
  corrección de esta vuelta); se informa la última.
- **Principiante**: `scratchpad/beginner2.js` (Playwright, celular 390×844,
  perfil persistente). Entra sin leer nada, adivina, escribe en español,
  cierra la app a mitad de la pausa y a mitad de la lección, vuelve, y hace
  las misiones de la semana 1 en orden. Todo lo que ve queda en un log y se
  marcan automáticamente textos rotos, opciones repetidas o vacías y
  diagnósticos sobre opciones en español.
- **Barridos**: integridad de los 2.960 ítems, tres corridas de los chequeos
  de las 52 lecciones, y ejemplos de las 467 palabras de la semana.

## La carrera en números (antes → ahora)

| | Auditoría 1 | Ahora |
|---|---|---|
| Semanas sin dominar | 4 (9, 30, 38, 50) | **0** |
| Ejercicios nunca vistos | 777 de 2.960 | **220** |
| Cola de ripasso: máximo · al final | 2.722 · 2.206 | **677 · 319** (Oggi muestra «hoy: 20») |
| Sfide en la semana 52 | 118 grupos (4 h) | **12** (tope en todas las semanas) |
| Misiones de la estación C1 fuera de la gramática | 1 escena, 0 lecturas | 5 escenas, 3 Martín, 3 Cultura |
| Rango al terminar | *Poeta* (nivel 40; *Madrelingua* pedía 1,26 M xp) | ***Madrelingua*** (nivel 44) |
| Jefe 13: preguntas de la semana 1 · gimnasio | 10 · 7 de 25 | 5 · 5 |
| Palabras de la semana sin ejemplo | 213 de 485 | **0** de 467 |
| Ítems rotos · duplicados · errores de ejecución | 0 · 0 · 0 | 0 · 0 · 0 |
| Horas en el año | 63 (3 sesiones/semana) | 105 (7 días/semana, ~17 min/día) |

Los cuatro jefes se pasan al primer intento (92, 100, 88, 95 %). Ninguna
semana pasa de 147 minutos ni baja de 90 (mediana 121, con la pausa y el
ripasso diarios adentro). La cola de ripasso crece hasta el día 150 y
después baja: ya no es una deuda.

## Lo que encontró el usuario en el teléfono (y quedó corregido)

1. **Distractores que delatan la respuesta.** «fantasma → ___» con opciones
   *cani / temi / baci / fantasmi*: se acierta por parecido, no por la regla.
   Ahora las opciones son formas erróneas de la misma palabra (*fantasme /
   fantasma / fantasmas*), los otros artículos del mismo número (*la / l' /
   il / lo*) o las otras formas de la preposición articulada (*allo / all' /
   agli*), y una respuesta corta solo se compara con respuestas del mismo
   largo (`recognitionOf`, `docs/js/drills.js`).
2. **Un chequeo sin sentido.** «¿Cómo se dice en italiano? *en -i*» con
   opciones *la crisi → le crisi / la città → le città; il caffè → i caffè /
   Le città italiane sono belle*: el generador tomaba una fila de tabla con
   su comentario como si fuera una frase con traducción. El filtro de
   traducción ya rechaza flechas, listas, notas de sufijo («-i»), ítems
   numerados y metalenguaje («3. Artículo con el posesivo»). Barrido: 699
   chequeos en tres corridas, ninguno con flecha en la respuesta.
3. **Misiones que repiten y no avanzan.** Ponte y Capire sacaban 8 y 10
   palabras al azar (por eso 11/16 después de dos sesiones) y la escena
   traía 4 frases nuevas por sesión. Ahora el laboratorio da primero lo no
   visto y la escena trae 6 frases nuevas: cada sesión mueve el contador.
4. **Misiones obligatorias para avanzar** (pedido del usuario). La semana
   siguiente se abre al completar todas las misiones de la semana menos
   *Dominala*: lección, palabras, 20 correctas, frases, lectura, laboratorio
   y banco. El briefing dice «🔒 La semana N se abre al completar estas X
   misiones», y al cerrar la última aparece «🔓 ¡Semana N abierta!». El
   gimnasio y las palabras no cuentan para las 20 correctas.
5. **«tener que» → dovere con ejemplo *Di dove sei?*.** Mi generador de
   formas tomaba *dove* como forma de *dovere* (y habría tomado *fine* por
   *finire*, *capo* por *capire*, *da* por *dare*). Las formas de un verbo
   salen ahora del conjugador (`sillabo.lexicon()["lemmas"]`); todos los
   ejemplos de verbos verificados.

## Principiante disperso: segunda partida

340 pantallas registradas, **0 anomalías** automáticas (ningún texto roto,
ninguna opción repetida o vacía, ningún diagnóstico sobre opciones en
español). Lo que vio, en orden:

- **Cierra la app a mitad de la pausa y a mitad de la lección**: al volver,
  Oggi ofrece «⏸️ Dejaste algo a medias · Pausa caffè 5/6 / Lección 7/14 ·
  Seguir donde estaba», y retoma en el mismo ítem. Funciona.
- **Lección**: 5 chequeos, ninguno binario; al errar aparece la regla del
  bloque. Al terminar: «★ Misión completada · 1/6» y «Para abrir la semana
  2: Palabras de la semana, Superá la semana, Frases: Primi passi, Lectura».
- **Entrenamiento** (adivinando): 12 preguntas que se vuelven 21 con una
  sola repetición por error, ya en otra forma («🔁 Segunda vez, más fácil»,
  dos opciones). Resultado con «Lo que aprendiste hoy» de una línea por
  ítem y «← Seguir el percorso».
- **Palabras de la semana**: tarjeta de palabra nueva antes de cada
  pregunta; 12/12 practicadas en una sesión.
- **Frases**: 6 nuevas por sesión (8/18 con las dos de la pausa).
- **Lectura**: al errar una pregunta se abre el texto; la misión se cierra
  al leer.
- **Sfida del giorno** con doble xp, primera ronda del día +25, meta
  cumplida y cofre; Ripasso «hoy: 17»; cuatro cuerdas «Input 28 % · Output
  0 % · Forma 62 % · Fluidez 9 %. Te falta output».
- **Lo que escribió en español** («gracias» en un hueco) recibió «*gracias*
  es español. ¿Cómo se dice en italiano?», después «💡 más pista: a_____»
  y recién después la respuesta.

Dos cosas que la partida sacó a la luz y quedaron corregidas en esta vuelta:

- Una ronda que arranca desde «A entrenar» al terminar la lección no
  ofrecía «← Seguir el percorso» (solo «Otra ronda / Inicio»). Ahora sí.
- La versión «más fácil» de un ejercicio de conjugar (*siamo*) inventaba
  formas con otra vocal (*siame*, *siami*) y el diagnóstico hablaba de
  «concordancia, en singular». Las variantes de la misma palabra quedan
  para sustantivos, adjetivos y artículos; un ítem de conjugar toma las
  otras personas del mismo verbo, y un ítem que nombra sus alternativas en
  la consigna («o» o «ho», «è» o «e») las usa como opciones. En las fichas
  no se diagnostican ya falsos amigos ni palabras del español (todas las
  fichas son italianas), y la lista «También:» no repite categorías.

Observación sin cambio: con 19 aciertos en 116 respuestas la meta diaria
(200 xp) se cumplió igual, por los bonos (primera ronda, sfida con doble
xp, lección, lectura, adivinanzas). La meta mide constancia más que
acierto; está bien que un principiante que juega 25 minutos la alcance.

## Verificación final

Sobre el código de esta vuelta: `test_game`, `test_frasi`, `test_diagnosi`,
`test_conjugator` y `check_lessons` pasan; la simulación de la carrera da
los números de la tabla de arriba; la partida del principiante, 0
anomalías. Service worker en v23.

## Lo que queda

- **Bloques de lección sin chequeo**: semanas 1 (2 de 7), 10 (3 de 4), 13
  (2 de 8), 32 (3 de 4), 51 (2 de 5) y 52 (4 de 5). Son bloques de texto
  suelto sin formas italianas suficientes para «Completá la regla»; la
  única salida es escribirles un chequeo a mano en `tools/lessons/`.
- **Diagnóstico de una palabra sola**: en «tener que → ___» escribir *dove
  que* devuelve «*que* es español y acá sobra», que es cierto pero no
  ayuda; para las palabras de la semana convendría un mensaje directo
  («*dove* = dónde; tener que = *dovere*»).
- **Semanas 50 y 51** (pools de 180 y 554 ítems de repaso): la cobertura
  exige 40 vistos y el resto queda para el ripasso; es lo esperable en
  semanas de repaso, pero nadie ve el 80 % de ese material.
- **Medallas que la simulación no alcanza** porque no juega Lampo ni escribe
  frases de memoria ni cierra misiones: *Fulmine*, *Prima penna*,
  *Scrittore*, *Settimana perfetta*, *Dieci perfette*, *Quattro corde*,
  *Sfidante del giorno*, *Cinquecento parole* (el percorso solo trae 467:
  hacen falta las *Parole* del banco). Son alcanzables jugando.
- **La guardia contra el doble toque** (300 ms después de cada pantalla)
  también se traga un toque rápido legítimo; un dedo ansioso lo nota.

## Vuelta 3: correcciones revisadas, lecciones en partes, teoría

Pedido del usuario: revisar que las correcciones tengan sentido (algunas
hacían ruido), partir las semanas demasiado cargadas (los artículos, y las
que estén igual), revisar la teoría, y lo raro con las ciudades y el artículo.

### Las correcciones, a escala

Un harness (`scratchpad/diag_review.js`) toma los ejercicios escritos de las
semanas 1 a 14 y les inyecta los errores que comete un hispanohablante:
palabra en español, sin doble, sin tilde, vocal final cambiada, otro artículo,
otra persona del verbo, el infinitivo sin conjugar y la consigna copiada en
español. 3.295 casos; se leyó una muestra de cada combinación (tipo de error →
categoría) y se buscaron familias de sinsentido. Lo que había y quedó
corregido en `docs/js/diagnosi.js`:

| Lo que decía | Ahora |
|---|---|
| «*gle* → concordancia: artículos, posesivos, adjetivos… toman el género del sustantivo» | «*gle* no es una palabra italiana. El artículo de *errori* es *gli*: *gli errori*» |
| «*ritornare* por *ritornate*: error de tipeo» | «Escribiste el infinitivo; conjugado para esta persona queda *ritornate*» (también cuando el infinitivo viene de la consigna: *inviare*, *interessare*) |
| «*prendere* existe en italiano, pero no significa lo que creés» (falso amigo) al escribir el infinitivo de *prendi* | el infinitivo, no un falso amigo |
| «*Entiendo.* → Acá va *capisco*» (sin decir qué pasó) | «Copiaste la consigna en español. En italiano: *Capisco*»; y *tienes, señor, televisión, esperen* se reconocen como español aunque no estén en el diccionario (-s final, ñ, tilde aguda, -ción, -ar/-ir, -en/-an) |
| «*la* por *lo* (l'albero → ___): ** es masculino: *lo *» | un pronombre: la consigna dice «pronombre» y no hay sustantivo después |
| «*quele scarpe le compro*: el pronombre va pegado al final» | una doble consonante; el chequeo de enclíticos exige que el pronombre esté junto al verbo |
| «*ha avuto* por *hai avuto*: acá va un tiempo compuesto» | la persona (*ha* es de *lui/lei*; el sujeto es *tu*) |
| «*Ci è piaciuto*: c'è + singular, ci sono + plural» | *piacere* concuerda con lo que gustó |
| «*prepararsi* por *prepararci*: error de tipeo» | el pronombre reflexivo concuerda con el sujeto también en infinitivo |
| «*la genti*: la forma es *gente*» como concordancia | «*genti* es el plural; acá va el singular *gente*» / «*mangie* no existe; la forma es *mangia* (mangiare, lui/lei, presente)» |
| «*la* por *le*: acá el sustantivo está en plural: *le*» | «*arance* está en plural: *le arance* (singular: *arancia*)»; con *città*: «no cambia en plural: solo el artículo lo marca» |
| «*prime* por *primi*: concordancia: *primi*» sin decir con qué | el artículo de adelante dice con qué concuerda: «concuerda con *cugini* (masculino plural)» |
| «*dove que*: *que* es español y acá sobra» | «Hay español mezclado: *que*. Mezcla español e italiano (*dove* = dónde). En italiano: *dovere* (*que* = *che*)» |
| «Falta el artículo: en italiano el sustantivo casi siempre lleva artículo» ante *Italia è bella* | «los países, las regiones y los continentes llevan artículo (*l'Italia*, la Toscana); las ciudades no: Roma è bella, vado a Roma»; y al revés, «*La Roma è bella*: las ciudades y los nombres de persona van sin artículo» |

Además, un hueco se juzga dentro de su oración («___ casa», «Sono le ___»),
así el artículo ve el sustantivo y la hora ve el *sono*. El harness cerró con
0 mensajes rotos y sin ninguna de esas familias; lo que queda marcado son
artefactos del propio harness (*un* por *uno* contado como español, nombres
propios). `test_diagnosi` pasa con 6.153 controles.

### Lecciones en partes

La semana 3 (artículos) era una sola lección con cinco bloques y 69
ejercicios. Ahora está en cuatro partes (determinados 20 ejercicios ·
indeterminados 10 · preposiciones articuladas 23 · partitivo y usos 16), cada
una como misión del percorso con su propio entrenamiento. Con el mismo
criterio (bloques y ejercicios) quedaron en partes las semanas 1 (3), 2 (2),
5 (2), 6 (2), 9 (3), 11 passato prossimo (3), 12 (3), 15 (2), 17 (3), 30 (2)
y 42 (2). Probado en el navegador en las semanas 1 y 3: las partes se juegan
en orden, «A entrenar esta parte» trae solo ejercicios de esa parte (más el
gimnasio y las palabras), el briefing va contando y la semana siguiente se
abre al terminar la última.

### La teoría

Una revisión completa de las 52 lecciones (260 bloques) por un revisor
independiente no encontró formas italianas incorrectas. Encontró cuatro
inconsistencias, corregidas: *sognare di* (semana 9) contradecía a *sognare
qualcuno* (42); la semana 26 decía que con *avere* el participio concuerda
«solo» con *lo, la, li, le* (y 21 exige *ne*); un ejemplo con superlativo
relativo sin congiuntivo (23); la regla de los porcentajes (47) contradecía su
propio ejemplo. Lo de las ciudades: el bloque «Artículo donde el castellano no
lo pone» (semana 3) mezclaba en una regla los que llevan artículo (países,
regiones, lenguas, posesivos) con la excepción de las ciudades, que iba en una
nota aparte. Ahora dice la regla corta: **país con artículo, ciudad sin
artículo** (*l'Italia*, *Roma è bella*, *abito in Italia*, *abito a Roma*),
con ejemplo propio, y el diagnóstico lo explica igual.

### La estructura de los cursos oficiales

Con el documento sobre Dante, IIC y Università per Stranieri: cada semana
lleva ahora qué se aprende a hacer y en qué campo léxico (unidad
comunicativa), y las partes de lección responden a «una unidad son tres
clases». Detalle en el README («Cómo se acomoda a los cursos oficiales»).

### Verificación

`test_game` 42.552 · `test_frasi` 29.319 · `test_diagnosi` 6.153 ·
`test_conjugator` 1.442 · `check_lessons` 0 problemas · simulación de la
carrera: 52 semanas, 4 jefes al primer intento, *Madrelingua* nivel 44, cola
de ripasso máx. 710 / final 368, 242 ejercicios nunca servidos (188 fuera de
las sfide), 0 errores. Service worker en v23.

## Vuelta 4: escribir, repasar mejor, opciones parecidas

Pedido del usuario: hacer los puntos 2 a 8 de la lista de mejoras. En el
medio mandó dos capturas.

### Las dos capturas

- **«Le città ___ (grande) → grandi».** La corrección está bien: *città* no
  cambia en plural, el artículo *le* dice que es plural, y los adjetivos en
  *-e* hacen *-i* en plural.
- **Opciones parecidas.** La traducción con *La ragazze / Le ragazze / Le
  ragaze* es el formato correcto. Lo que el usuario vio en otras preguntas
  («todas distintas salvo la que aplica la regla») existía: las preguntas de
  la lección «¿Cómo se dice en italiano?» usaban como distractores otras
  frases del bloque (90 % de esas preguntas se contestaban por el
  significado), la versión «más fácil» de un conjugar mezclaba otros verbos
  (la mitad de esas preguntas), y algunas tomaban palabras en castellano de la consigna (*vos,
  usted*) o de la pista (*amiga, amigas*). Ahora las trampas cubren más
  errores (preposición articulada de la misma familia, *è/e*, tilde,
  preposición simple, pronombre, la otra vocal final, la doble), un conjugar
  ofrece las otras personas del mismo verbo, una palabra de clase cerrada
  ofrece su clase (*dove / quando / come*), y otra frase solo entra si
  comparte la mitad de las palabras. Barrido de todas las preguntas: las
  frases de la lección y las traducciones, 0 % con distractores regalados.
  `test_game.js` lo controla.

### Lo que se hizo

| Punto | Qué quedó |
|---|---|
| 2. Producción libre | Misión **✍️ Scrivi** en 48 semanas: consigna con la función de la semana, mínimo de palabras, estructuras que se tildan mientras escribís, corrector de texto libre con 15 tipos de error del hispanohablante, texto modelo. Obligatoria para avanzar. |
| 3. Repasos y jefes | Semanas de jefe con repasos por tema (lección en partes) y **Tus puntos débiles**; el jefe pregunta más de lo que peor te fue. Semanas 50 y 51 en partes; la 50 suma un bloque de preposiciones de nivel, porque sus ejercicios eran de eso y la lección no lo explicaba. |
| 4. Partes | 27 semanas con la lección en partes (antes 12). |
| 5. Confusiones | 40 pares de palabras italianas que se confunden (*volta/tempo*, *largo/lungo*, *ancora/già*, *presto/subito/pronto*, *buono/bravo/bene*, *fa/da*…) con su diferencia. |
| 6. Repaso | El desliz no reinicia la tarjeta; tres aciertos seguidos la retiran. Cola máxima del año: de 641 a 154. |
| 7. Revisión | Revisión completa de 2.919 ejercicios y 864 oraciones: 0 errores de italiano; 13 arreglos (una pista en masculino, 11 variantes correctas que faltaban, una frase ambigua). |
| 8. Arreglos chicos | La guardia contra el doble toque solo descarta un toque en el mismo lugar; 22 bloques de teoría con chequeo escrito a mano; los nombres propios en castellano (*Isabel → Elisabetta*) tienen su mensaje. |

### Verificación

`test_game` 42.596 · `test_frasi` 29.319 · `test_diagnosi` 6.161 ·
`test_conjugator` 1.442 · `test_scrivi` 184 · `check_lessons` 0 problemas.
Simulación del año: 52 semanas, 4 jefes al primer intento, *Madrelingua*
nivel 43, 100 horas, cola de ripasso máx. 154 / final 0, ejercicios nunca
servidos 155 (antes 245), 0 errores. En el navegador: la misión Scrivi de la
semana 11 marca los siete errores de un texto de prueba y guarda texto, xp y
perfil de errores; la semana 13 muestra los repasos opcionales y la ronda de
puntos débiles. Service worker en v24.
