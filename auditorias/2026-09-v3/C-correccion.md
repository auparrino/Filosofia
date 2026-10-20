# Auditoría C: la corrección y la devolución (v2.8 → 3.0)

Sobre `main` en v2.8 (commit `4a70be0`, merge del PR #55). Solo lectura: no se cambió nada del
repo. Todo lo que se midió se corrió en node con `tools/lib/pack.js`, con los scripts del
scratchpad que se nombran en cada punto (`clasif.py`, `validas.js`, `scrivi_med.js`,
`muestra.py`, `puntual.js`) y con las herramientas del repo (`tools/*/diag_review.js`,
`tools/*/test_diagnosi.js`, `tools/*/test_scrivi.js`, `tools/lib/test_porque.js`,
`test_desglose.js`, `test_correccion.js`, `test_fix_feedback.js`). Todos esos tests pasan.

Se miró el corazón didáctico de la app:

1. el diagnóstico de las respuestas cerradas (`lang/*/diagnosi.js`) y cómo lo muestra
   `js/devolucion.js`, `js/app.js` (`produce`, `answer`, `showPrompt`, `settle`);
2. el corrector de texto libre (`lang/*/scrivi.js`), cómo se combina con LanguageTool y con la IA,
   y a dónde van los errores después;
3. la devolución como herramienta de aprendizaje: la pista, el segundo intento, «📖 ¿Por qué?»,
   «🧐 ¿Qué tenía de malo?», «🔎 Cómo se arma», las explicaciones mismas;
4. qué haría falta para que la corrección justifique un 3.0.

**Fuera de alcance, a pedido:** todo lo que use la voz del alumno.

**Lo que no se pudo medir.** El contenedor no llega a Groq, Gemini ni a la API de LanguageTool
(el proxy devuelve 403 a `api.languagetool.org`). Por eso **no hay números de la calidad real de la
IA ni de LanguageTool**: lo que digo de ellos sale de leer los prompts, el código que arma y
consume las respuestas, y los tests con `fetch` simulado. Tampoco se probó la interfaz en un
navegador (el orden y la densidad de la hoja de devolución se infieren del HTML que arma
`settle`). Y no hay textos de alumnos reales: el corpus de Scrivi lo escribieron los autores
(ver C7).

---

## Resumen: las 10 principales

| # | Prioridad | Qué | Dónde | Esfuerzo |
|---|---|---|---|---|
| 1 | Alta · pt | El portugués de Brasil coloquial que el curso enseña se sigue rechazando en las respuestas cerradas: *pra/pro* 87 %, *tô/tá/tava* 91 %, *cê* 100 %, *Eu amo você* 100 %. Y cada corrector sigue otra norma (cerradas, Scrivi, IA) | `lang/pt/diagnosi.js`, `lang/pt/scrivi.js:1225`, `scrivi.js:1370` | M |
| 2 | Alta · it/pt | Sinónimos y variantes válidas rechazados con reglas falsas: «*però* viene del español», «*acquistare* no es una palabra italiana», «*bacana* no es una palabra portuguesa», «*tava* no existe». En una batería de 219 variantes italianas válidas se rechazan 88 (40 %) | `diagnosi.js:698`, `:953`; pt `:1219`, `:1697` | M |
| 3 | Alta · it/pt | La explicación dice *qué* y no *por qué* en muchos casos: en una muestra de 50 explicaciones reales, 18 en italiano y 7 en portugués. La plantilla del tiempo verbal («*vedremo* es futuro; acá va imperfetto») es la peor | `diagnosi.js` `tenseRule`, `missRule`, `extraRule`, orden | M |
| 4 | Alta · núcleo | Con clave, la IA **reemplaza** al corrector propio en vez de sumarse: se tiran las marcas locales, que tienen 0 falsas alarmas medidas | `app.js:4957-4984` | S |
| 5 | Alta · núcleo | «🤖 Explicame» da «pistas graduadas» **después** de mostrar la solución, y le pide a la IA que juzgue si la app se equivocó **sin mostrarle lo que dijo la app** | `app.js:2682`, `2731-2742`; `scrivi.js:1721` | S |
| 6 | Alta · núcleo | La corrección se pierde antes de llegar al repaso: Parla y la tarea del tramo no anotan errores; los de Scrivi quedan en «Tus errores» con el mensaje en el lugar de la forma correcta y sin el porqué | `app.js:4442-4480`, `tramo.js`, `app.js:5063-5067`, `2530-2540` | S |
| 7 | Media · it | Scrivi marca el 61 % de los errores del corpus, pero el 0-37 % en las familias de B1-C1 (*ci/ne* 0/14, orden 1/9, léxico 4/23, pronombres 9/50, participio 11/37, tiempo y modo 29/78) y el 62 % de sus mensajes son de menos de 45 caracteres | `lang/it/scrivi.js` `lint`, `lint2` | M–L |
| 8 | Media · it/pt | Poco contraste con el español justo donde más sirve: 0 % en *crase*, *colocação*, *futuro do subjuntivo*, *infinitivo pessoal*, contracciones (pt); 2-11 % en concordancia, artículo, plural y tiempo verbal (it) | explicaciones de `diagnosi.js` | M |
| 9 | Media · it/pt | Metalenguaje escolar sin presentar («i átona», «hiato», «llanas terminadas en diptongo», «esdrújulas», «objeto directo») que `Devolucion.plain` no cubre, porque solo traduce nombres de tiempos | `devolucion_data.js`, `diagnosi.js` | S |
| 10 | Media · núcleo | El examen C1 sin clave sigue dando 20/20 a cualquier texto largo (A2 de la auditoría anterior, abierto) | `app.js:4814-4817` | S |

La propuesta para 3.0 (sección **P**) junta estos arreglos en un solo **modelo de error** común a
las respuestas cerradas, Scrivi, el tramo, el dictogloss y Parla, con tres niveles (aceptable,
poco natural, incorrecto), una norma por registro, una explicación en capas (pista → regla →
contraste con el español → mini-ejercicio) y la IA usada donde rinde de verdad: explicar y
juzgar lo que las reglas no saben, con evidencia y con caché.

---

## Cómo se midió

| Qué | Cómo | Salida |
|---|---|---|
| Diagnóstico a escala | `tools/it/diag_review.js` (78.687 casos) y `tools/pt/diag_review.js` (21.979), con `--json` para leer cada caso | `diag_it.json`, `diag_pt.json` |
| Calidad de cada devolución | `clasif.py`: cada caso con error inyectado se clasifica en *correcta y útil*, *correcta pero inútil* (la explicación es solo «Acá va X», «Sobra X», «Error de tipeo: X», «El orden es: X»), *categoría equivocada* (la del error no es la esperada, casi siempre es una regla falsa), *no visto*, *lejos* (la app muestra el modelo) | `clasif_out.txt` |
| Respuestas válidas | `validas.js`: toma 1.718 oraciones italianas y 1.095 portuguesas (banco + traducciones del curso) y genera variantes correctas (sinónimos, orden del adverbio, sujeto explícito o tácito, cifras, *pra/pro*, *tô/tá*, *a gente*, *amo você*, elisión…) y algunas **incorrectas** de control (*estar a + inf.*, *ci è*). Juzga como `app.js:produce` (`Engine.grade` + `Diagnosi.diagnose`) | `validas_it.txt`, `validas_pt.txt` |
| Muestra de explicaciones | `muestra.py`: 50 devoluciones por idioma, ponderadas por frecuencia de categoría y plantilla, juzgadas a mano; además, plantillas distintas, contraste con el español y pistas en forma de pregunta sobre **todas** las devoluciones | `muestra_out.txt` |
| Scrivi | `scrivi_med.js`: recall por familia y por nivel sobre `tools/*/scrivi_corpus.json`, marcas sobre los textos corregidos, los 48 modelos y el texto nativo del tramo (`tools/*/tramo/wNN.json`: lecturas y escuchas), largo de los mensajes y muestras | `scrivi_it.txt`, `scrivi_pt.txt` |
| Casos puntuales | `puntual.js`: frases sueltas contra `Diagnosi.diagnose` | salida en consola |

Una advertencia sobre la clasificación automática: «útil» quiere decir solo que la explicación no
es una de las plantillas vacías. Es optimista. Por eso se hizo también la muestra a mano (punto
C3), que da cifras más bajas.

---

## Lo que ya está bien y conviene no romper

**El diagnóstico acierta la categoría casi siempre.** Sobre los errores inyectados (sin contar
variantes ni opciones):

| | Italiano | Portugués |
|---|---|---|
| Casos con error inyectado | 71.059 | 15.241 |
| Categoría esperada | **98,4 %** (1.136 con otra) | **99,6 %** (67 con otra) |
| Error no visto | 0,9 % (656) | 0,3 % (47) |
| Texto roto, pista que revela la respuesta, tuteo, sin pista o sin explicación, excepción | **0** | **0** |
| Metalenguaje antes de su semana | 379 (0,5 %) | 1 |
| «Tipeo» para lo que es gramática | 68 | 26 |

Los errores escritos por los autores del banco («encontrá el error») se ven todos: 584/584 en
italiano y 524/524 en portugués, con la misma categoría del autor en el 79 % y el 82 %.

**La secuencia de la devolución está bien pensada y bien fundada.**

- **Pista primero** (`app.js:2362-2369`, `showPrompt` en `2507`): el primer error de regla no da la
  respuesta; marca la palabra, da una pista y ofrece «💡 más pista» con la primera letra
  (*c_mo*). Ninguna pista revela la respuesta (0 casos en 100.000).
- **Autocorrección que cuenta**: lo que el alumno arregla solo se anota como corregido
  (`markFixed`, `2544`), paga como «¡Eso es!» con el antes y el después y la regla
  (`selfRepairHtml`, `2401`) y descuenta en la Clínica (`banca.js:429`).
- **Lo que fallás vuelve** en la misma sesión, más fácil (`retryVersion`, `2822`), con la nota
  tapada para que no regale la respuesta (`Devolucion.retryNote`).
- **El repaso según el tipo de error** (`settle`, `2588-2593`): desliz, vocabulario o regla
  cambian cómo se reprograma la tarjeta.
- **«Lejos» no inventa reglas** (`Devolucion.far`, `devolucion.js:115`): si lo escrito no se
  parece a la respuesta, se muestra el modelo y cómo se arma, no una regla (Aljaafreh y Lantolf).
- **Respuesta correcta insegura** (`Devolucion.unsure`): la nota se abre si hubo pista, un
  segundo intento, un desliz o mucho tiempo; si fue rápida y segura, queda plegada.
- **Las traducciones al castellano** (`it.dir === "it-es"`, `app.js:2296-2301`) ya no se corrigen
  como italiano: D2 de la auditoría anterior está resuelto.

**«📖 ¿Por qué?» y «Cómo se arma» cubren casi todo.** Todos los ítems del curso tienen un bloque de
teoría enlazado (it 6.641/6.641, pt 3.224/3.224; «seguros» el 65 % y el 77 %), y también el banco
(97 %). «🧐 ¿Qué tenía de malo?» aparece en 636 de 1.089 opciones múltiples en italiano y en 944
de 1.181 en portugués. El desglose explica todos los pronombres átonos (it 76/76, pt 28/28) y no
nombra ningún tiempo antes de su semana.

**Está escrito para un rioplatense.** Voseo en todas las pistas (0 casos de tuteo en los dos
idiomas), glosas del Río de la Plata (*durazno*, *guita / plata*, *copado*), y las mejores
explicaciones contrastan con el español con precisión:

> *No so* → «Delante del verbo la negación es *non*: *non so*. *No* va solo, como respuesta (No,
> grazie). En español «no» sirve para las dos cosas.»
>
> *Eu vou ligo* → «Cuando dos verbos van juntos, el segundo queda en infinitivo: *vou ligar*. Es
> el «voy a…» del español, pero sin *a*: vou comer, vamos sair.»
>
> *O livro esteve escrito* → «La voz pasiva se forma con *ser* + participio: *foi escrito* (como
> «fue escrita»). *Estar* + participio es el estado que queda después.»

**El corrector propio de Scrivi no molesta.** 0 marcas en los 144 textos corregidos del corpus
(8.873 palabras en italiano, 4.695 en portugués) y en los 48 modelos de cada idioma; sobre los
textos con errores, el 100 % (it) y el 99 % (pt) de lo que marca cae en un error anotado. En el
texto nativo del tramo, el italiano marca 18 cosas en 25.489 palabras (0,7 cada mil).

**La IA está atada con cuidado donde se usa.** Corrección mínima pedida de forma explícita,
segundo pedido que revisa con evidencia externa (corrector propio + LanguageTool,
`scrivi.js:1658`), «no le des la razón por cortesía», lista cerrada de tipos que coinciden con
los de la Clínica (`AI_TYPES`, `scrivi.js:1621`), lo correcto pero poco natural como «estilo» que
no cuenta como error, y una norma explícita para el portugués de Brasil (`PB_NORM`,
`lang/pt/scrivi.js:1370`: *pra, tá, vi ele* no son error en un texto informal). Las respuestas
pasan por `esc`, el JSON se lee aunque venga con `<think>` o con ```, y los modelos caen en cascada
si uno falla (lo cubren los tests con `fetch` simulado).

---

## Lo que falta para 3.0

### C1. Respuestas válidas rechazadas, a veces con una regla falsa · ALTA · M

`validas.js` armó variantes correctas de las oraciones del banco y de las traducciones del curso y
las pasó por el mismo camino que `produce`. Las minúsculas sin punto final se aceptan siempre
(1.621/1.621 y 1.095/1.095), así que lo que sigue no es ruido de puntuación.

**Italiano.** De 219 variantes claramente válidas, **88 rechazadas (40 %)**. Es una batería
dirigida a los casos difíciles, así que no es la tasa que vería un alumno, pero muestra familias
enteras:

| Variante válida | Rechazo | Qué dice la app |
|---|---|---|
| adverbio de tiempo al final (*Non lavoro oggi*) | 33/40 | «En italiano el orden es: *Oggi non lavoro*» |
| *però* por *ma* | 17/24 | «*però* viene del español; en italiano va *ma*» (**falso**: *però* es italiano, y la misma explicación lo reconoce: «ma (o però, con tilde)») |
| número en cifras (*Ho 32 anni*) | 15/19 | «*32* no es una palabra italiana» |
| *in questo momento* por *adesso* | 5/5 | «*questo* significa este / esto» |
| *acquistare* por *comprare* | 4/4 | «*acquistare* no es una palabra italiana» (**falso**) |
| *piccolino*, *accanto a* | 5/5 | «no es una palabra italiana» (**falso**) |
| *anche io* por *anch'io* | 3/3 | «*anche* significa también. Acá va *anch'*» |
| *Che cosa faresti al posto mio?* | 1 | «Estas dos palabras van al revés: *mio posto*» (**falso**) |
| *Domani andrò dal medico* | 2/3 | «*andrò* es otra forma del verbo, que se ve más adelante» |
| *Vado dal dottore* | sí | «*dottore* significa doctor / médico; *medico*, médico» (se contradice) |
| sinónimos que sí están en `SYN` (*ora/adesso*, *qui/qua*, *tra/fra*, *tanto/molto*) | 1/84 | — |

Además, el **sujeto explícito** (*Io ho trentadue anni*) da «Casi» en 156 de 163 casos: es
italiano correcto y la app lo cobra como desliz, con media puntuación y tarjeta de «casi».

El **género del hablante** se resuelve distinto según la frase: *sono uscita*, *sono mai stata* o
*Siamo andate a cena* se aceptan (bien: `genderFree`, `diagnosi.js:2032`), pero *Sono appena
arrivata* se rechaza como «concordancia», y sin enunciado (`puntual.js`) también *Sono andata al
mare*. Nota al margen: `diag_review` cuenta como «no visto» las 470 aceptaciones correctas de
este tipo (`no_visto:vocale_finale` y `no_visto:accordo_participio`), o sea que ese indicador
mezcla aciertos con fallas.

**Portugués.** De 639 variantes válidas, 157 rechazadas (25 %). Lo que se acepta bien: *a gente*
↔ *nós* 66/66, artículo opcional ante posesivo 17/17, *num / em um* 7/7, *porém*, *bastante*,
*busão*, *telefone*, *automóvel*. Lo que no, casi todo el registro brasileño (ver C2) y:

| Variante válida | Rechazo | Qué dice la app |
|---|---|---|
| adverbio al final (*Eu acordei cedo hoje*) | 15/22 | «El orden es: *Hoje eu acordei cedo.*.» (con doble punto) |
| número en cifras | 16/16 | «*20* no es una palabra portuguesa» |
| *grana*, *quem sabe*, *valeu* | 9/10 | «*grana* significa guita / plata. Acá va *dinheiro*» |
| *bacana* | 1/1 | «*bacana* no es una palabra portuguesa» (**falso**) |
| sujeto tácito con *você/vocês* (*Toma café?*) | 19/274 | «Falta *você*» |

**Por qué pasa.** Las reglas de pares (`pairRules`, `lexConfusion`) deciden «esta palabra no es la
que va» antes de preguntarse si lo escrito es otra forma válida de decir lo mismo; `synonymFree`
(`diagnosi.js:1986`) solo conoce los pares de `SYN` (`:1934`), y la prueba de «existe en el
idioma» es el diccionario del curso, así que lo que el curso no enseñó «no existe». El 1,6 % de
«categoría equivocada» de C4 es la misma raíz vista desde el otro lado.

**Arreglo.** (a) Una capa de **equivalencias** antes del diagnóstico: sinónimos por glosa (si la
glosa española de lo escrito y la de lo esperado coinciden, aceptar con «También se dice»),
números en cifras, orden libre de adverbios de tiempo, sujeto explícito como aceptable. (b)
Nunca decir «no es una palabra» de algo que no está en el diccionario del curso: decir «no la
conozco; si estás seguro, marcala como válida» (ver P5). (c) Sumar un diccionario de formas
completo del idioma, compacto, para la prueba de existencia (el de LanguageTool o el de Hunspell
caben en unos cientos de KB comprimidos). (d) Un test que fije estas variantes: `validas.js` puede
entrar al repo como `test_variantes.js`.

### C2. Portugués: el registro brasileño, con tres normas distintas · ALTA · M

E1 de la auditoría anterior **sigue abierto** en las respuestas cerradas, y empeoró la
coherencia porque los otros correctores ya lo resolvieron:

| Forma | Respuestas cerradas (`diagnosi.js`) | Scrivi local (`scrivi.js:1225`) | IA (`PB_NORM`, `scrivi.js:1370`) |
|---|---|---|---|
| *pra / pro* | rechazo 27/31 y 4/5; *pra a praia* → «Falta el artículo» | solo se marca en las tareas formales (semanas 40, 43, 48, 49) | «no es error en un texto informal» |
| *tô / tá / tava* | rechazo 21/23 y 8/13; «*tava* no existe», «*tá* no existe; *estar* es irregular» | igual que *pra* | igual |
| *cê / cês* | 12/12 | igual | — |
| *Eu amo você*, *ligo você* | 6/6: «Falta el pronombre *te*» | no se marca | correcto |
| *a gente* | aceptado 66/66 | aceptado | correcto |

El curso **enseña** estas formas: las lecciones de las semanas 9, 16, 20, 38, 49 y 52 las
mencionan. Un alumno que aprendió *tava* en la semana 38 lo escribe en la 39 y la app le dice que
no existe.

Hay una segunda cara: `Tramo.evaluate` pasa el corrector de la semana también por las lecturas y
escuchas nativas, y en las semanas 40, 43 y 49 marca como error las 30 apariciones de *pra, tá,
tô, né, cê* en diálogos (`scrivi_pt.txt`): son 30 de las 46 «falsas alarmas» del portugués sobre
texto nativo. En una escucha transcripta, *pra* no es un error de registro.

**Arreglo.** Una sola tabla de **registro** en el paquete (`LANG.rules.registro`: forma, forma
estándar, «habla», «informal escrito», «formal»), leída por los tres correctores. Las cerradas
aceptan la forma de habla con la nota «🗣️ En el habla es así; por escrito formal: *para*» salvo
que la consigna pida registro formal; Scrivi marca como «estilo» en tareas formales y no marca en
transcripciones; el prompt de la IA se arma con la misma tabla.

### C3. Explicaciones que dicen qué pero no por qué · ALTA · M

**Muestra a mano, 50 devoluciones por idioma** (`muestra_out.txt`, ponderadas por frecuencia de
categoría; se muestran pista y explicación como llegan al alumno, después de `Devolucion.tidy`):

| | Italiano | Portugués |
|---|---|---|
| Correcta y útil (dice la regla o el contraste) | 28 (56 %) | 40 (80 %) |
| Correcta pero inútil (dice qué, no por qué) | 18 (36 %) | 7 (14 %) |
| Regla falsa o categoría equivocada | 3 (6 %) | 3 (6 %) |
| Respuesta válida rechazada | 1 (2 %) | 0 |

La muestra italiana pesa mucho el tiempo verbal, porque es la mutación más frecuente (el 25 % de
los casos de `diag_review`). Aun así, es lo que más ve el alumno de B1 en adelante.

**La plantilla del tiempo verbal es la peor.** La pista es siempre la misma («El verbo es el
correcto, pero no el tiempo. Mirá las pistas temporales de la frase.») y la explicación, un
rótulo:

> *Vedremo Piero e Gina che ci aspettavano* → «*vedremo* es futuro; acá va imperfetto: *vedevamo*.»
>
> *cercassi* → «*cercassi* es congiuntivo imperfetto; acá va presente: *cerchi*.»
>
> *Avevo chiesto a Martina* → «*avevo chiesto* es trapassato prossimo; acá va passato prossimo.»

No dice cuál es la pista temporal (*aspettavano*, el verbo principal en presente), ni cuál es la
regla (concordancia de tiempos, anterioridad). En la misma categoría hay explicaciones excelentes
cuando la regla la escribió alguien a mano (imperfetto contra passato prossimo: «Para describir o
contar lo habitual en el pasado va imperfetto: *andava*, como el español «-aba / -ía»»). La
diferencia es qué regla de `tenseRule` dispara.

**Otras plantillas vacías, por volumen** (sobre todas las devoluciones, no solo la muestra):

| Plantilla | it | pt |
|---|---|---|
| «Error de tipeo: *X*.» | 10.702 | 2.159 |
| «Estas dos palabras van al revés» / «El orden es: *X*.» | 1.708 | 1.425 |
| «*X* es el plural; acá va el singular *X*.» | 1.408 | — |
| «Acá no va artículo: sobra *a*.» / «Falta *o* antes de *que*.» | — | varios cientos |
| «El italiano usa acá *alla*, no *nella*. Las preposiciones no se traducen una a una» | varios cientos | — |

El tipeo está bien que sea corto (es un desliz). Pero el orden y el artículo no son deslices: *vou
para casa* sin artículo tiene una regla (*casa* = el hogar propio va sin artículo, como «voy a
casa»), igual que *alla festa* (*a* con eventos: alla festa, al concerto, al cinema).

**Cuánto se repite.** El italiano tiene 994 plantillas de explicación distintas y el portugués
722, pero las 10 más frecuentes cubren el 45 % y el 57 % de todas las devoluciones. Un alumno que
se equivoca en la persona del verbo ve 7.011 veces la misma frase («*X* es la forma de *X*; el
sujeto acá es *X*: *X*.»). No es un problema si la frase es buena; lo es cuando es una de las
vacías.

**Arreglo.** (a) Para cada categoría de alto volumen, una **explicación en capas** escrita a mano
en el paquete: la regla en una línea, el contraste con el español y un ejemplo que no sea el
ítem; el diagnóstico elige la capa según la semana y cuántas veces el alumno ya la vio (ver P3 y
P6). (b) `tenseRule` tiene que nombrar el disparador que ve en la frase (el verbo principal, el
marcador temporal, la conjunción) y la regla de la combinación; cuando no lo sabe, decir «¿qué
indica *aspettavano*?» es mejor que un rótulo. (c) Medir la utilidad en `diag_review`: la familia
`sin_porque` hoy solo mira las mutaciones de gramática y deja pasar el orden y el artículo.

### C4. Reglas falsas y categorías equivocadas · ALTA · M

Son pocas en proporción (1,6 % en italiano, 0,4 % en portugués), pero son las que más daño hacen:
enseñan algo falso con autoridad. Las familias más grandes:

- **Una palabra real tomada como la palabra de otra clase** (it, 269 + 163 + 49 + 38 casos,
  `categoria:*→lessico`): *La nonno* → «*nonno* significa abuelo; *nonna*, abuela» (el error es de
  concordancia, no de vocabulario); *da qualche partì* → «*partì* es una forma del verbo
  *partire*». En los mutantes de `diag_review` son razonables, pero con alumnos reales el primer
  caso es el típico error de género y va a la Clínica como «Vocabulario».
- **Categoría gramatical cambiada** (it): *Se non stude* → «Plural: *studio* → *studi*: -io con i
  átona hace una sola -i» (es el verbo *studiare*); *Non lo me dimenticherò* → «El pronombre va
  antes del verbo conjugado… *lo dimenticherò mai*» (el error es el orden *me lo*, y la forma
  citada está cortada); *Sarai stato a Venezia?* → «el passato prossimo de *stare* es *sei stato*»
  (es de *essere*).
- **Participio irregular como tipeo o al revés** (it, 50): *piacuto* → «irregular»; está bien
  como regla, pero `diag_review` lo cuenta como tipeo, así que la familia está mal medida en la
  herramienta, no en el diagnóstico.
- **Portugués**: *contei-le* → «Revisá la terminación del verbo… *contei-le* no existe; la forma es
  *contei*» (el error es *le* por *lhe* y la colocación); *fice* → etiqueta «Persona del verbo»
  (es ortografía, *c → qu*); *Si podes olhar* → «*si* significa sí (reflexivo). Acá va *se*» (es el
  *si* condicional del español); *É importante saber* por *sabermos* → «Falta *a* antes de
  *gente*» (una regla de *a gente* que se dispara fuera de lugar, 2 casos).
- **La elisión como artículo** (it, 9 de 13): *lo ho letto* → «Delante de vocal: *l'* en singular y
  *gli* en plural masculino; *un*… para masculinos». Es un pronombre, no un artículo: la regla
  citada es otra.

**Arreglo.** Cada regla de `pairRules` necesita una guarda de clase de palabra (verbo, sustantivo,
pronombre) antes de decidir, y una prueba de «las dos formas son del mismo lema» antes de
«vocabulario». En `diag_review`, un modo que reúna las explicaciones que citan una forma que no
está en la respuesta (el caso de *lo dimenticherò mai*) y las que dicen «no existe» de palabras
que están en un diccionario completo.

### C5. Poco contraste con el español donde más sirve · MEDIA · M

Porcentaje de explicaciones que citan el español o una glosa, sobre todas las devoluciones:
italiano 31 %, portugués 19 %. Por categoría:

| Italiano | % | Portugués | % |
|---|---|---|---|
| auxiliar, participio, pronombre, período hipotético, léxico | 86-91 | subjuntivo | 98 |
| preposición, acento, género, palabra española | 50-64 | *muito* | 87 |
| subjuntivo | 44 | léxico | 61 |
| persona del verbo | 38 | tilde | 47 |
| orden | 13 | palabra española | 29 |
| tiempo verbal | 11 | persona, ser/estar, género, tiempo | 5-10 |
| artículo | 10 | contracción, crase, colocación, futuro do subjuntivo, infinitivo pessoal, orden, ortografía | **0** |
| plural | 5 | | |
| concordancia | 2 | | |

Las categorías del portugués con 0 % son justamente las que el español no tiene o tiene de otro
modo, donde el contraste enseña más:

- **crase**: «*à* es *a la*: vou à praia = voy a la playa; si en español dirías *a el*, en
  portugués es *ao*»;
- **futuro do subjuntivo**: «el español dice *cuando llegue*; el portugués, *quando chegar*, con
  una forma propia»;
- **infinitivo pessoal**: «el español no lo tiene: dice *para que salgamos*, el portugués puede
  decir *para sairmos*»;
- **contracción**: «como *al* y *del*, pero obligatoria con *em* y *por*».

Hoy algunas de estas ideas están en la teoría de la semana y el alumno llega con «📖 ¿Por qué?»,
pero la devolución misma no las dice.

**Arreglo.** Una línea `es:` por categoría en `porque_data.js` o en un archivo de contrastes del
paquete, que el diagnóstico agregue cuando la explicación no trae contraste.
`lang/tres_lenguas_data.js` ya tiene material de contraste it ↔ pt ↔ es que se puede reusar.

### C6. Metalenguaje sin presentar · MEDIA · S

`Devolucion.plain` (`devolucion.js:286`) traduce **nombres de tiempos y modos** antes de su
semana, y lo hace bien (el italiano pasó de «congiuntivo en semana 5» a 0 casos; quedan 379
marcas de `meta_temprana`, sobre todo *relativo*, *auxiliar* y *participio* en semanas 1-10). Pero
las explicaciones usan terminología escolar que no controla nadie:

- «-io con **i átona** hace una sola -i» (plurales, italiano, desde la semana 2);
- «La *i* o la *u* **tónica en hiato** lleva tilde» (portugués);
- «Las **llanas terminadas en diptongo** (-ia, -io, -ua) llevan tilde»;
- «Las **esdrújulas** llevan siempre tilde»;
- «**objeto directo**», «**conjunción**», «**determinante**», «**átono**».

Un rioplatense adulto las oyó en la escuela, pero muchas no las recuerda, y la app nunca las
presenta.

**Arreglo.** Sumar esos términos a `DEVOLUCION_DATA.terms` con su versión llana («la *i* que no
lleva el acento», «palabras acentuadas en la anteúltima sílaba») o, mejor, un glosario de
metalenguaje tocable: la palabra subrayada abre una línea con un ejemplo. `diag_review` podría
controlarlos con la lista de META que ya tiene.

### C7. Scrivi: recall desparejo y mensajes cortos · MEDIA · M–L

**Recall sobre el corpus** (`scrivi_med.js`, igual que `test_scrivi.js`):

| | Italiano | Portugués |
|---|---|---|
| Total | 458/748 (**61 %**) | 334/379 (**88 %**) |
| A1 · A2 · B1 · B2 · C1 | 74 · 63 · 60 · 55 · 57 % | 90 · 91 · 85 · 85 · 91 % |
| Familias fuertes | ausiliare 97, accento 96, articolo 94, doppie 89, spagnolo 87 % | contracción, tilde, preposición, plural, género, *gostar*, *muito*, inf. pessoal 100 %; español 98 %; subjuntivo 97 % |
| Familias flojas | ***ci/ne* 0/14**, orden 1/9, léxico 4/23, pronombre 9/50, falso amigo 4/18, participio 11/37, tiempo y modo 29/78, persona 16/43 | **tiempo 0/8**, concordancia 1/9, léxico 8/15 |

Lo que se escapa en italiano es lo que pesa en B1-C1: *Le ho spiegato* por *Gli* (referente),
*l'ha guardato* por *guardata* (concordancia con el clítico), *sarà* por *sarebbe stata* (futuro en
el pasado), *Ci ha voluto* por *Ci sono voluti*, *toccare* por *suonare*, *nel campo* por *in
campagna*.

**Precisión.** 0 marcas en los textos corregidos y los modelos (ya dicho). En el texto nativo del
tramo, el italiano marca 18 cosas en 25.489 palabras; algunas son reglas falsas que convendría
sacar: *piovve* → «Se escribe *piove* (sin doble)», *slogan* → «es español», *marchi* → «Se
escribe *marci*», *calo* → «Se escribe *callo*», *corsie* → «es español; en italiano: *corse*»,
*state* después de *pensate che* dicho a alguien. El portugués marca 46 en 24.901 palabras, 30 de
ellas por registro (C2); las otras incluyen *negro* («es español; en portugués: *preto*»), *Ó*
(«es español; *ou*»), *vaso* en un texto donde es maceta, y el subjuntivo que se exige en
*quando chove* genérico.

**Un límite de la medición.** El corpus lo escribieron los mismos autores de las reglas, y la
primera mitad sirvió para armarlas. El README ya lo dice (45 % en la tanda nueva antes de ajustar,
61 % después); el 88 % del portugués seguramente está inflado de la misma manera. Hace falta un
corpus de textos reales, aunque sea chico (ver P8).

**Los mensajes.** Largo medio 44 caracteres en italiano y 47 en portugués; el 62 % y el 48 %
tienen menos de 45 caracteres o solo dan la forma. Ejemplos reales: «La forma es *andrò*.», «Se
escribe *amiche*.», «Con *etto* va *un etto*.», «Por el sonido de *acustica* va
*l'acustica*.». Hay buenos también («Los reflexivos van con *essere*: *si è messo* (el participio
concuerda con el sujeto).»). En un texto libre, el porqué importa más que en un ejercicio, porque
no hay nota del ítem ni «📖 ¿Por qué?» al lado.

**Arreglo.** (a) Que cada marca de Scrivi reuse la explicación larga del diagnóstico de la misma
categoría (ya comparten `Diagnosi.util`): la marca corta queda como título y la regla se
despliega. (b) Priorizar las reglas de *ci/ne*, clítico + participio, persona con sujeto
explícito y concordancia de tiempos, que son las del CILS B2-C1. (c) Dejar el léxico y el
referente a la IA, pero sin tirar lo local (C8).

### C8. El diseño con IA: dónde se usa y cómo se le pregunta · ALTA · S–M

**Qué pasa hoy, leído en el código:**

| Lugar | Sin clave | Con clave |
|---|---|---|
| Respuesta cerrada | diagnóstico local | además, «🤖 Explicame» después de un error (`app.js:2682`) |
| Scrivi | reglas propias + LanguageTool (si no está apagado) | **solo la IA**: dos pedidos (corrige y revisa); las reglas y LanguageTool van como evidencia al segundo pedido y no se muestran (`app.js:4957-4984`) |
| Tramo, tarea integrada | `Tramo.evaluate`: extensión, variedad, copia, puntos, género, conectores, corrector | además, rúbrica C1 de la IA (`tramo.js:401-405`) |
| Parla | no existe | role-play, recast por turno y revisión final (`app.js:4382-4480`) |
| Reformulación (Escritura plus) | el texto con las correcciones locales + el modelo | reformulación de la IA |
| Examen C1, escritura | fórmula local (C10) | rúbrica de la IA |

**Problemas de diseño.**

1. **La IA reemplaza en vez de sumar** (`app.js:4958`: `r.findings = []` y después
   `Scrivi.fromAI(text, data, [])`). Las marcas locales tienen **0 falsas alarmas** medidas y
   cubren el 61-88 % de los errores del corpus; la IA puede no ver alguno, y si el segundo pedido
   no lo agrega, desaparece. Además `fromAI` (`scrivi.js:1963`) descarta en silencio todo error
   cuyo fragmento «mal» no se encuentre literal en el texto. Lo razonable es la unión: lo local
   como marcas seguras con su explicación en castellano, lo de la IA sumado (y comparado: si la IA
   contradice una marca local, mostrar las dos).
2. **«Explicame» llega tarde.** El botón está en la hoja de `settle` (`app.js:2682`), que ya
   muestra la solución, la diferencia y la explicación. Después la IA da «Pista 1: dónde está el
   problema, sin dar la respuesta» y «Pista 2: una pregunta que apunte a la regla». Las pistas
   graduadas de Aljaafreh y Lantolf sirven **antes** de la respuesta; con la respuesta a la vista,
   dos de los tres pasos no aportan. El contador `state.hintLevels` (`app.js:2767-2770`) se guarda
   y no lo lee nadie.
3. **Se le pide juzgar sin evidencia.** `app.js:2737` arma `feedback` con el texto de la hoja,
   pero se llama a `Scrivi.hints`, y `hintsPrompt` (`scrivi.js:1721`) **no incluye `x.feedback`**
   (solo `explainPrompt` lo usa, y nadie lo llama desde la app). La IA decide `app_equivocada` sin
   saber qué dijo la app. Tampoco recibe la categoría del diagnóstico ni la semana.
4. **El primer pedido de Scrivi pide todo** («Marcá TODOS los errores, sin dejar pasar ninguno»,
   `scrivi.js:1640`) y el mismo pedido dice «corrección mínima». Para un A1 eso es una lista larga;
   la investigación sobre corrección escrita favorece la corrección **focalizada** en pocas
   categorías (Bitchener y Knoch; Sheen). Tampoco dice qué gramática se vio hasta esa semana (el
   curso lo sabe: `course.weeks[].tenses`, las etiquetas del banco), ni pide contraste con el
   español, ni usa el perfil de errores del alumno.
5. **La explicación de la IA no pasa por `Devolucion.plain`**: `showScrivi` muestra `mk(f.msg)` tal
   cual, así que puede decir «congiuntivo trapassato» en la semana 8. El prompt da solo el nivel
   (A1…C1).
6. **El segundo profesor es el mismo modelo**, casi siempre (el mismo proveedor, primer modelo
   de la lista). Con evidencia externa está bien (Kamoi et al.), pero la evidencia más confiable,
   las marcas locales, podría ir marcada como «seguras» en lugar de «puede tener falsos
   positivos».
7. **Sin caché.** Cada «Revisar» son dos pedidos, aunque el texto haya cambiado una palabra; cada
   «Explicame» sobre el mismo ítem y la misma respuesta vuelve a preguntar. Con el cupo gratuito
   de Groq (el propio código maneja el 429) eso importa. Un caché por hash de (ítem, respuesta) o
   de (oración) resuelve la mayor parte.
8. **Parla corrige y no enseña.** `parlaReviewPrompt` (`scrivi.js:1792`) no pide `tipo`, así que
   los errores del role-play no tienen categoría y no llegan a ningún lado (C9).
9. **Sin clave** no hay forma de discutir una corrección: «Correcciones para revisar»
   (`state.aiNotes`) solo se llena cuando la IA dice que la respuesta valía.

**Lo que está bien de los prompts** (para conservar): la corrección mínima, el «no le des la razón
por cortesía», la diferencia calculada por la app como «hecho», la nota del ítem como regla
revisada, el formato JSON cerrado, los tipos de la Clínica, el `PB_NORM` del portugués, y en Parla
el «objetivo cumplido aunque tenga errores» y el pedido de sinónimos solo para las palabras
difíciles.

### C9. La corrección no llega entera al aprendizaje · ALTA · S

El circuito errores → perfil → Clínica → repaso **existe y funciona** en las respuestas cerradas:
`recordError` (`app.js:2530`) anota categoría, lo escrito, lo correcto, el rótulo y la
explicación; `Banca.weakest` (`banca.js:425`) arma las áreas flojas con decaimiento por días y
descuento por lo autocorregido; `clinicaSession` (`:436`) arma una sesión con los ejercicios del
remedio (`LANG.rules.banca.cure`). Pero:

| Fuente | ¿Llega al perfil? | Detalle |
|---|---|---|
| Respuestas cerradas | sí | completo |
| Opción múltiple | sí, si la opción está en el idioma | `app.js:2221` |
| Dictogloss | sí | `app.js:4181`, con el mismo defecto que Scrivi |
| Scrivi | sí, pero mal guardado | `deliverScrivi` (`5063-5067`) pasa el **mensaje** como `target`: en «Tus errores» aparece «bien: Los reflexivos van con essere…» en lugar de la forma correcta, sin «¿por qué?» (`x` queda vacío) y con solo la primera palabra de lo escrito |
| Scrivi con LanguageTool | sí, pero como «grammatica», «refuso» o «lessico» | «grammatica» no tiene remedio en `cure`: nunca llega a la Clínica |
| Scrivi con IA | sí, si el tipo está en la lista | el tipo «ia» (desconocido) tampoco tiene remedio |
| Tarea del tramo (27-51) | **no** | `tramo.js` no llama a `recordError`; ni lo local ni la rúbrica |
| Parla | **no** | la revisión final muestra las frases corregidas y se pierden (`app.js:4465-4480`) |
| Escritura plus | sí, como tarjetas `ep:` | bien: cada diferencia notada va al repaso |

Y la Clínica **no explica antes de practicar**: arma 12 ejercicios de las categorías flojas, pero
no abre con la regla ni con los errores propios de esa categoría («Te pasó 6 veces: *ho andato*,
*mi ho lavato*…»), que es lo que Metcalfe llama aprender del error.

**Arreglo.** Arreglar el registro de Scrivi y dictogloss (guardar `g` = fragmento, `e` = la
corrección, `x` = la explicación) (S). Registrar los errores del tramo y de Parla (pedir `tipo` en
`parlaReviewPrompt`) (S). Mapear las categorías de LanguageTool y «ia» a las de la Clínica o
dejarlas fuera del puntaje (S). Abrir la Clínica con «tus errores de esta semana» y la regla (S-M).

### C10. El examen local sigue aprobando relleno · MEDIA · S

`app.js:4814-4817` es igual que en v2.5: `palabras_ok × 8 + max(0, 12 − errores × 1,5)`. Sin clave,
«ciao» repetido llega a 20/20. El tramo ya tiene lo necesario (`Tramo.evaluate`, `tramo.js:115`:
variedad léxica, repetición, copia, cobertura de la consigna); el examen podría usarlo y mostrar
«nota orientativa».

### C11. La herramienta de revisión mide lo que no importa y deja afuera lo que sí · MEDIA · S

`diag_review` es muy buena para detectar texto roto y pistas que delatan (hoy en 0), pero:

- **no mide la utilidad**: una explicación vacía cuenta como buena si la categoría coincide;
- **cuenta como «no visto» las aceptaciones correctas** (470 de las 656 del italiano son el
  género del hablante bien aceptado);
- **solo prueba las variantes de `accept`**, que por definición se aceptan: no genera variantes
  nuevas (sinónimos, orden, cifras, registro), que es donde está el problema (C1, C2);
- el italiano tarda **2 min 45 s** y el portugués 19 s; el italiano no entra cómodo en el CI.

**Arreglo.** Sumar tres familias: `sin_porque` para todas las categorías (no solo las de
gramática), `valida_generada` (con las transformaciones de `validas.js`) y `regla_falsa_probable`
(la explicación dice «no existe» de una palabra de un diccionario completo, o cita una forma que
no está en la respuesta). Separar las aceptaciones de género de «no visto».

### C12. Detalles · BAJA · S

- **Puntuación duplicada**: «El orden es: *Hoje eu acordei cedo.*.» (1.425 casos en portugués);
  «Copiaste la consigna en español. En italiano: *Avrà sbagliato strada?*.».
- **Glosas curiosas** en las explicaciones de género del portugués: «El calçadão de Copacabana,
  con sus ondas de piedra portuguesa», «Plural carnavais. El desfile en el Sambódromo»: son
  simpáticas, pero alargan la hoja justo después de un error.
- **«📖 ¿Por qué?» abre el bloque del ítem, no el del error.** Si en un ejercicio de congiuntivo el
  error fue un artículo, el botón lleva al congiuntivo. `Porque.blockFor` podría recibir la
  categoría del diagnóstico (el mapa `weeks` de `porque_data.js` ya tiene semana por categoría).
- **«Casi» con el sujeto explícito** (C1): en italiano *io* explícito es correcto; merece la nota
  «no hace falta», no el «Casi».

---

## P. La corrección en 3.0: propuesta

Lo que sigue ordena los arreglos en una arquitectura. Para cada punto se dice qué hay hoy
(verificado en el código) y qué falta.

### P1. Un modelo de error común · L

**Hoy.** Hay cinco formas de un error: el diagnóstico de las cerradas (`{cat, hint, explain,
given[], fixed[], all[]}`), las marcas de Scrivi (`{i, n, cat, msg, soft}`), las de LanguageTool
(`{…, lt: true}`), las de la IA (`{…, ai: true}`) y las filas de Parla (`[frase, corregida,
nota]`). Solo las dos primeras comparten categorías, y cada una se guarda distinto (o no se
guarda).

**Qué falta.** Un solo objeto, en el núcleo (`js/errores.js`), producido por todos los
correctores:

```
{ cat, nivel: "incorrecto" | "poco_natural" | "aceptable",
  registro: null | "habla" | "informal" | "formal",
  mal, bien, span,              // lo escrito y la corrección mínima
  pista, regla, contraste_es,   // las tres capas de la explicación
  fuente: "reglas" | "lt" | "ia", seguro: true | false,
  practica: id de un mini-ejercicio o de un remedio }
```

Todo lo que produce un error pasa por `recordError` con ese objeto: cerradas, Scrivi,
dictogloss, tramo y Parla. «Tus errores», la Clínica y el repaso leen lo mismo.

**Por qué.** Hoy el alumno de C1, que escribe sobre todo en el tramo y en Parla, deja de alimentar
la Clínica justo cuando la corrección más importa. Y la misma forma (*pra*, *però*) recibe tres
veredictos distintos según la pantalla.

### P2. Tres niveles y una norma por registro · M

**Hoy.** Correcto, «Casi» (desliz) o incorrecto; la IA de Scrivi ya distingue «estilo»; el
portugués de la IA tiene `PB_NORM` y el corrector local tiene la regla del coloquial en semanas
formales.

**Qué falta.** Que las respuestas cerradas acepten con nota lo **aceptable** (*io* explícito,
*anche io*, adverbio al final, *pra* en registro informal, *Eu amo você*) y lo **poco natural**
(*ci è*, *più grosso* para una ciudad) con «✓ Vale; más natural: …», sin quitar xp ni tratarlo
como desliz en el repaso. La tabla de registro del paquete (C2) decide.

**Por qué.** Castigar lo correcto enseña a desconfiar de la app, y la investigación sobre
corrección insiste en separar error de estilo (Ferris). Es además lo que el Celpe-Bras mide:
adecuación al registro.

### P3. La devolución que enseña: regla, contraste y un mini-ejercicio · M

**Hoy.** Pista → segundo intento → respuesta con explicación → «📖 ¿Por qué?» → la misma pregunta
vuelve más fácil en unos minutos. Muy bien fundado, pero la vuelta es **el mismo ítem**, y la
explicación a veces está vacía (C3).

**Qué falta.**

- La explicación en tres capas por categoría, escrita a mano para las ~25 categorías de más
  volumen de cada idioma: **regla** (una línea), **contraste con el español** (una línea),
  **ejemplo distinto** del ítem.
- Un **mini-ejercicio inmediato** de la misma regla con otras palabras («Ahora vos: *Ieri ___
  (uscire) con Marco*»), sacado del banco por categoría (`Banca.errorSession`,
  `gapSession` con las etiquetas de `cure` ya lo pueden dar). Es transferencia, no repetición:
  prueba que la regla generaliza, igual que el jefe (README, «El jefe mide si la regla
  generaliza»).
- Que la pista del primer intento venga de la capa «regla como pregunta», así la pista y la
  explicación no se contradicen.

### P4. La IA donde rinde · M

**Hoy.** Corrige todo Scrivi y reemplaza lo local; explica después de la solución; no ve la
corrección de la app; no tiene caché; no conoce el perfil.

**Qué falta, en orden de rendimiento:**

1. **Juez de respuestas no previstas** (S-M): cuando el diagnóstico no está seguro (la respuesta no
   está en `accept`, no es «lejos» y la regla que disparó es de vocabulario u orden), preguntar a
   la IA «¿es italiano correcto y dice lo mismo que la consigna?» **antes** de dar el veredicto,
   con la respuesta de la app y la regla que disparó como evidencia. Es donde las reglas fallan
   (C1) y donde un modelo es bueno. Lo que la IA acepta se guarda como variante local (P5).
2. **Scrivi por unión** (S): lo local como marcas seguras, la IA sumada, las contradicciones
   visibles.
3. **Explicame antes de la solución** (S): el botón en `showPrompt` (el primer intento) da las
   pistas graduadas; en la hoja final, solo «explicame más» con la corrección de la app y la
   categoría en el prompt.
4. **Caché** (S): por hash de (idioma, ítem, respuesta normalizada) para las explicaciones y por
   oración para Scrivi, en `localStorage` con tope; y exportable, así lo que la IA explicó bien
   se puede revisar y pasar al contenido.
5. **Prompts con evidencia y con el curso** (S): la semana, la gramática vista hasta ahí (de
   `course.json`), los términos que se pueden usar (de `DEVOLUCION_DATA.terms`), las 3 categorías
   flojas del alumno (de `Banca.weakest`), la marca local como «segura», y el pedido de contraste
   con el español. Corrección **focalizada** en A1-A2: los errores de las categorías de la semana
   y de las flojas primero, el resto plegado.
6. **Un tutor con el perfil** (M): una pantalla «Hablá con tu profe» que recibe `errLog` y
   `errs`, arma un plan de 5 minutos sobre la categoría más floja y cierra con 3 ítems del banco;
   la IA no inventa ejercicios, elige y explica.
7. **Uso local u opcional**: hoy la IA ya es opcional; un modelo local en el navegador (WebLLM y
   similares) todavía no escribe italiano o portugués C1 con confiabilidad en un teléfono. Lo
   que sí se puede hacer local es el caché de explicaciones revisadas, que convierte lo que la IA
   dijo bien en contenido fijo para todos.

### P5. «Mi respuesta es válida», con o sin IA · S–M

**Hoy.** Solo existe con clave: si la IA dice `tambien_correcta`, se anota en «Correcciones para
revisar» (`state.aiNotes`), local, con un botón para copiar.

**Qué falta.** Un botón «🙋 Mi respuesta es válida» en toda hoja de error, sin clave: acepta
provisoriamente (sin xp, sin error en el perfil), anota ítem, respuesta y explicación de la app,
y (si hay clave) le pregunta a la IA con la evidencia. Lo anotado se exporta junto (ya existe la
exportación) para que la dueña lo revise y lo pase a `accept` o a las equivalencias. Así el
curso aprende de sus alumnos, que es lo que hoy no pasa.

### P6. Explicaciones a la medida del nivel y de la historia · M

**Hoy.** `Devolucion.plain` adapta los nombres de tiempos a la semana, y nada más.

**Qué falta.** Elegir la capa según cuántas veces el alumno vio esa categoría (`state.errs[cat].n`)
y si la corrigió solo: la primera vez, regla + contraste; la quinta, solo la pista («otra vez el
auxiliar de un verbo de movimiento»), y si sigue fallando, el mini-ejercicio y la Clínica. Es
evitar la repetición de C3 sin perder la regla cuando hace falta. El metalenguaje escolar de C6,
con su glosa tocable.

### P7. Medir siempre · S

- `diag_review` con utilidad, variantes generadas y reglas falsas probables (C11).
- Un test de variantes válidas (el `validas.js`) en `npm test`.
- Un test de coherencia entre correctores: la misma forma (*pra*, *però*, *io* explícito) tiene
  que recibir el mismo nivel en cerradas, Scrivi y el prompt de la IA.
- Un test del registro de errores: toda fuente llama a `recordError` con el objeto de P1.

### P8. Un corpus real · M

El corpus de Scrivi está escrito por los autores. Con P5 funcionando, cada «mi respuesta es
válida» y cada texto entregado (con permiso, exportado) forman un corpus real. Aunque sean 50
textos, dirían qué familias faltan de verdad y darían un recall honesto.

---

## Orden sugerido

1. **Lo corto que evita enseñar mal** (S): las reglas falsas de C4 más visibles («no es una
   palabra», *però*, *tava no existe*, *bacana*), el registro de Scrivi y dictogloss (C9), la
   puntuación duplicada, el examen (C10).
2. **El registro del portugués** (C2) y las equivalencias (C1), con `validas.js` como test.
3. **La IA**: unión en Scrivi, Explicame antes de la solución y con la corrección de la app, caché
   (P4.2-P4.5). Es poco código y cambia mucho la experiencia con clave.
4. **El modelo de error común** (P1) con el tramo y Parla adentro, y «mi respuesta es válida» (P5).
5. **Las explicaciones en capas y el mini-ejercicio** (C3, C5, P3, P6): es lo más largo, porque es
   contenido escrito a mano, y es lo que más justifica el 3.0 en didáctica.

---

## Anexo: más ejemplos reales

**Italiano, útiles** (de la muestra):

> *Me ha chiesto* → «Junto al verbo va *mi* (*mi ha*), aunque en español se diga «me». *me* solo
> aparece delante de *lo, la, li, le, ne* (me lo dice) o después de una preposición (per me).»
>
> *Abbiamo dormiti* → «Con *avere* el participio queda en -o… como en español «he hecho». Solo
> cambia si antes va *lo, la, li, le* (l'ho vista).»
>
> *imparassero* → «El verbo principal está en presente, así que el congiuntivo va en presente…
> Igual que en español: «quiero que venga», no «que viniera».»

**Italiano, vacías** (de la muestra): «*freddi* es el plural; acá va el singular *freddo*.»,
«Estas dos palabras van al revés: *questo smetterò*, no *smetterò questo*.», «El italiano usa acá
*alla*, no *nella*. Las preposiciones no se traducen una a una desde el español».

**Portugués, útiles**: *Eu no conheço* → «La negación es *não*: *não conheço*. *No* existe, pero es
*em + o* (no Rio, no verão).»; *Vou até a farmácia* (orden) → «Para dar una orden o pedir algo a
*você* se usa la forma del subjuntivo: *vá*… Como el «hable usted» del español.»; *policia* →
«Las llanas terminadas en diptongo… llevan tilde: história, água (en español «historia» y «agua»
van sin tilde).»

**Portugués, vacías**: «Acá no va artículo: sobra *a*.» (*vou para a casa*), «Falta *o* antes de
*que*.», «Acá va *diante*.», «Condicional (futuro do pretérito, -ia): *moraria*. El futuro sería
*morarei*.»

**Scrivi, lo que no ve** (italiano): *Le ho spiegato* (a él), *l'ha guardato* (a ella), *sarà*
por *sarebbe stata*, *cominciavo* por *avessi cominciato*, *Ci ha voluto* por *Ci sono voluti*,
*toccare* por *suonare*, *contestato* por *risposto*, *carriera* por *facoltà*.

**Comandos** (desde la raíz del repo, con los scripts del scratchpad):

```
node tools/it/diag_review.js -v          # 78.687 casos, 2 min 45 s
node tools/pt/diag_review.js             # 21.979 casos, 19 s
node tools/it/diag_review.js --json X    # y python3 clasif.py
node <scratchpad>/validas.js it|pt       # variantes válidas
node <scratchpad>/scrivi_med.js it|pt    # recall, precisión, mensajes
python3 <scratchpad>/muestra.py          # plantillas, contraste, muestra de 50
```
