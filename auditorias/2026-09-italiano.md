# Auditoría pedagógica: La Via C1 (italiano) jugada como principiante absoluto

Rama `claude/dazzling-cannon-iw4148`, versión v2.1 (con el desglose «🔎 Cómo se arma»).
Solo lectura: no se tocó ningún archivo del repo. Los scripts de medición están en
`scratchpad/review_it/` (lista al final).

**Cómo se hizo.** (1) Se cargó el italiano completo en node con `tools/lib/pack.js` y se
midió cada fuente de contenido: curso (`course.json`: 52 semanas, 3716 ítems), frases (358),
«Adiviná», desglose, banco (864 oraciones, 584 errores), laboratorio, duelos, lecturas,
dictogloss, escritura y chequeos de las lecciones. Para eso se armó un detector de gramática
por semana más amplio que `tools/it/sillabo.py` (tiempos, auxiliar + participio,
pronombres átonos, *piacere*, *ne*, *cui*, gerundio), y se pasó el diagnóstico
(`Diagnosi`) por respuestas simuladas. (2) Se jugó la app en Chromium a 390 px con
`?lang=it`: escena *Primi passi* con el «Adiviná», entrenamiento de la semana 1,
entrenamiento de la semana 6 (con estado inyectado) y la lección 1, contestando mal
a propósito para ver las devoluciones.

Las cifras son de esas mediciones. Cuando dependen de una tabla de «qué semana enseña qué»
armada para esta auditoría, se aclara como *aprox.* No se recomienda ningún ejercicio oral.

---

## Resumen: las 10 principales

| # | Prioridad | Qué | Dónde | Esfuerzo |
|---|---|---|---|---|
| 1 | Alta · núcleo | «Adiviná»: explicar cada opción equivocada, no usar otra frase como distractor, trampas según la semana, y mostrar la tarjeta de la frase después de adivinar | `js/app.js` `settleGuess`, `js/frasi.js` `guessItem`/`traps` | S |
| 2 | Alta · núcleo | Completar el desglose: pronombres átonos, tiempos compuestos, enclíticos, elisiones, nombres propios, homógrafos, etiquetas que dependan de la semana | `js/desglose.js` + `LANG.rules` | M |
| 3 | Alta · núcleo | Si la respuesta no se parece en nada a la correcta, no inventar una regla («Falta el auxiliar» para *boh*) | `js/app.js` (antes del hint), `diagnosi.js` | S |
| 4 | Alta · it | El banco (*Traduci*, *Encontrá el error*) ubica oraciones antes de su gramática; al sillabo le faltan 152 verbos irregulares | `tools/it/build_bank.py`, `sillabo.py`, `forms_lexicon.js` | M |
| 5 | Alta · it | El diagnóstico dice «Acá va congiuntivo» en ejercicios de presente (semanas 2 a 6) | `lang/it/diagnosi.js` `tenseRule` | S |
| 6 | Alta · it | Palabras de la semana 1 a 4 fuera de tema y con ejemplos que usan passato prossimo o verbos irregulares; *Scrivi* de la semana 1 pide la edad (números: semana 7) | `build_course.py` / lecciones, `scrivi.js` | S |
| 7 | Media · núcleo | Unir las fórmulas con su gramática: bloque «Ya la venías usando» en la semana en que se enseña lo que una frase ya usaba | `lezione.js`, `frasi_data.js`, `app.js` | M |
| 8 | Media · núcleo | Chequeos de lección que preguntan la columna «Ejemplo/Nota» (≈10 %), repetidos, y 11 bloques sin chequeo | `js/lezione.js` `tableQuestion`, `tools/it/lessons` | S–M |
| 9 | Media · it | Notas: el 25 % de los ítems de las semanas 1 a 12 no tiene nota (el reintento no muestra ninguna regla) y 328 notas son solo una equivalencia | `course.json` (Dummies), `build_course.py` | M–L |
| 10 | Media · núcleo | Frase nueva: la mitad se pide escrita de memoria tras verla una vez, y la consigna dice «Escribí…» sobre botones (277 ítems) | `js/frasi.js` `sceneSession`, `js/drills.js` `recognitionOf` | S |

---

## A. Núcleo común (afecta a los dos idiomas)

### A1. «Adiviná»: no explica, a veces se resuelve por el sentido y usa reglas que no se enseñaron (ALTA)

**Qué pasa.**
- La devolución (`app.js` `settleGuess`, l. 2569) dice «Era esta. Ahora ya la conocés.»,
  muestra la nota y el desglose, pero **nunca dice qué estaba mal en la opción que
  elegiste**. Si elegís *Chao, come stai?* no te enterás de que el error es la grafía
  *ciao*. Esto es justo lo que se queja el usuario: la frase «solo aparece».
- Para las frases adivinadas (la mitad de las nuevas, `frasi.js` l. 392: `i % 2 === 0`) nunca
  se muestra la tarjeta «✨ Frase nueva». El primer contacto es una prueba de tres
  opciones sin ninguna ayuda.
- **Distractores que son otra frase:** cuando no hay dos errores posibles, se completa con
  las frases «más parecidas». Se resuelve por el sentido: *¡Nos vemos después!* →
  *Ci vediamo dopo! / Ci bediamo dopo! / Mi chiamo Augusto.*; *Un gusto conocerte* → …
  */ Salutami tua sorella.*; *No importa* → … */ Non mi ricordo la parola.* Medido en 5
  corridas: **19 % de los «Adiviná» del italiano (332/1790) y 23 % del portugués
  (530/2275)** tienen al menos una opción que es otra frase.
- **Trampas de cualquier semana:** `frasi.js` l. 218 llama a `Lezione.traps(…, 52, …)`,
  así que el «Adiviná» de la semana 1 o 2 puede preguntar *cui/qui* (semana 34),
  *lo bagno* (artículo lo, semana 3), *di/da* (semana 9). *Aprox.* el 8 % de los errores
  fabricados prueba una regla posterior a la semana de la escena (258/3163).
- La tabla de trampas del italiano cambia el pronombre *lo* por el artículo *il*: *Non il so*,
  *Il prendo al banco*, *Tra l'altro, il conosco*, *È meglio che tu il sappia* (8 frases).
  No es un error típico de nadie (ver B6).

**Por qué importa.** Adivinar antes de estudiar ayuda a recordar solo si después hay
retroalimentación, y cuanto más se explica esa retroalimentación, mejor (Kornell, Hays &
Bjork 2009; Shute 2008). Si una opción se descarta por el sentido, no hace falta
fijarse en la forma, que es lo que se buscaba.

**Qué cambiar.**
1. En `settleGuess`, anotar las tres opciones con `Diagnosi.explainChoice(opción,
   respuesta)`, igual que en `app.js` l. 2153. Probado: **las 716 opciones fabricadas del
   italiano tienen una explicación** (0 sin diagnóstico), por ejemplo *Un atimo* →
   «Consonante doble: *attimo*», *Facciamo a la romana?* → «*a + la* se contrae: *alla*»,
   *He mangiato* → «*he* viene del español; en italiano va *ho*».
2. Pasar la semana de la escena a `traps` (`Lezione.traps(sentence, rnd, scene.week, …)`).
3. Si quedan menos de dos opciones fabricadas: presentar la frase con la tarjeta
   «Frase nueva» en vez de adivinar, o usar dos opciones. Nunca otra frase.
4. Después de la devolución, mostrar la tarjeta «Frase nueva» de esa misma frase (nota y
   desglose abiertos): una pantalla más a cambio de que nada «solo aparezca».
5. Cambiar «Ahora ya la conocés» por algo como «Así se arma: …».

**Esfuerzo.** S (un día), más los tests en `tools/it/test_frasi.js` y `tools/pt/…`.

### A2. «🔎 Cómo se arma»: justo lo que más cuesta armar queda sin explicar (ALTA)

**Qué pasa** (`js/desglose.js`, medido sobre las 358 frases del italiano y las 455 del
portugués):
- **Pronombres átonos:** unas **100 frases del italiano (102/358)** tienen un pronombre
  delante del verbo (*Mi chiamo*, *Ci vediamo*, *Non lo so*, *Mi serve aiuto*, *ci penso*,
  *ce la faccio*, *ne parliamo*). El desglose no dice nada de ninguno: *Mi chiamo
  Augusto* → solo «*chiamo*: de *chiamare* o *chiamarsi* (presente, io) — llamar».
- **Tiempos compuestos:** *ho capito* sale como «*ho*: de *avere* (presente) — tener /
  haber» y «*capito*: de *capire* (participio)». Nunca dice «passato prossimo = entendí».
  En *Ho sbagliato*, *sbagliato* sale como adjetivo («equivocado»).
- **Enclíticos:** *conoscerti*, *salutami*, *correggermi* y *farcela* no se separan
  (*Salutami tua sorella* solo desglosa *sorella*).
- **Elisiones** del italiano sin tratar: *d'*, *c'*, *dov'*, *l'*, *un'*, *all'*/*dall'*
  (*dov'*, *d'* y *c'* están entre las formas sin explicar más frecuentes).
- **Nombres propios** leídos como verbos: *Guido ___ (portare)* → «*guido*: de
  *guidare* — manejar».
- **«En esta frase» engaña.** Sale del glosario, que tiene un solo significado por
  palabra y no mira el contexto. En italiano, 5 de las 13 líneas están mal: *Di dove sei?* →
  «en esta frase: seis» (dos veces); *L'ho letto* → «cama»; *mi faccia sapere* → «cara»;
  *Oggi lavoro da casa* → «trabajo» (ahí es verbo). En portugués hay 42 líneas y los errores
  son más graves: *como* → de *comer*; *Quer vir comigo?* → *vir* de *ver* (futuro do
  subjuntivo); *casa* → de *casar-se*; *obrigado* → de *obrigar*; *livre* → *livrar*
  (subjuntivo).
- **Etiquetas que no tienen en cuenta la semana:** 33 de las 354 entradas de verbo
  muestran un tiempo que se enseña después (*Tenga il resto*, semana 3 → «congiuntivo
  presente, io / tu», con la persona equivocada para *Lei*; *vorrei*, *era*). En 15,
  antes de la semana 24, aparece «presente o congiuntivo» (*parli*, *vediamo*,
  *facciamo*).

**Por qué importa.** Descomponer un bloque hecho ayuda a retenerlo (Boers &
Lindstromberg 2012; es lo que cita el propio archivo), pero solo si se descompone lo que
el estudiante no ve solo. El verbo en presente casi se entiende por el español; lo que no
se entiende es *mi*, *ci*, *ce la*, *ho + participio* y *-ti* pegado al verbo.

**Qué cambiar** (`desglose.js` es del núcleo; los datos van en `LANG.rules.desglose`
de cada idioma):
1. **Clíticos:** una tabla por idioma (*mi* = me / a mí; *ci* = nos / ahí / a eso; *ne* =
   de eso; *lo/la* = lo/la; *gli* = le; *ce la* = *ci + la*) y una línea por pronombre
   que esté delante de un verbo.
2. **Auxiliar + participio** (con *già, mai, non…* en el medio, como en `sillabo.py`):
   una sola línea, «*ho capito*: passato prossimo de *capire* (yo) — entendí».
3. **Enclíticos:** separar las terminaciones -mi/-ti/-lo/-la/-ne/-ci/-cela/-glielo
   después de un infinitivo o un imperativo que existan.
4. **Elisiones:** `LANG.rules.desglose.elide` = {d': di, c': ci, dov': dove, l': lo/la,
   un': una, quant': quanto…}.
5. **Ambigüedades:** saltear las palabras con mayúscula que no están al principio.
   Después de un artículo, un posesivo o *che*, usar la lectura del glosario. Si la
   palabra es un infinitivo de la lista, no buscarle otro lema (*vir*). Cambiar «en esta
   frase» por «también puede ser: …», o resolver con esas reglas.
6. **Etiquetas según la semana:** pasarle a `Desglose.lines` la semana del estudiante.
   Si el tiempo llega después, mostrar «*ho capito* = entendí (passato prossimo: lo
   estudiás en la semana 11)» y no ofrecer «o congiuntivo» antes de la semana 24.
7. Agregar a `tools/lib/test_desglose.js` los casos de arriba, en los dos idiomas.

**Esfuerzo.** M (2 a 3 días).

### A3. Diagnóstico de respuestas que no se parecen a la correcta (ALTA)

**Qué pasa.** Se simuló contestar «boh» a las 358 frases: **el 100 % recibe una regla
concreta**. 91 veces «Falta el auxiliar» (*Di dove sei?* → «Los tiempos compuestos llevan
auxiliar + participio: *sei*»), 105 veces «Falta una preposición» y 32 veces «Falta el
artículo» (en *Non lo so*: «el sustantivo casi siempre lleva artículo…»). Con «no lo so»
sale «Sobra el artículo» o «Acá hace falta una preposición, no un artículo» para *Piacere
di conoscerti*. Pasó igual jugando la escena *Primi passi*. En portugués, «sei lá» también
recibe una categoría el 100 % de las veces. Además, cada uno de esos errores se anota en el
perfil que alimenta la Clínica.

**Por qué importa.** Las pistas metalingüísticas sirven cuando lo que escribió el
estudiante está cerca de la respuesta (Lyster & Ranta 1997). Si está lejos, lo que ayuda
es el modelo completo (Aljaafreh & Lantolf 1994). Una regla falsa enseña algo falso y
ensucia la Clínica.

**Qué cambiar.** Poner un filtro en el núcleo (`app.js`, antes de mostrar el `hint` o
`explain`): si la respuesta comparte menos del ~40 % de las palabras con la correcta, o
tiene una palabra y la correcta tres o más, mostrar «Te faltó casi toda la frase», la
respuesta y el desglose abierto, ofrecer las fichas y **no registrar la categoría**.

**Esfuerzo.** S.

### A4. Unir cada fórmula con la gramática que usa: «Ya la venías usando» (MEDIA)

**Qué pasa.** 67 de las 358 frases del italiano usan, como respuesta, gramática de una
semana posterior a su escena (medido con `sillabo.analyze`): *Scusa, non ho capito* y *Ho
sbagliato* (semana 2; passato prossimo, semana 11), *Era tutto buonissimo* (4;
imperfetto, 15), *Non ce la faccio più* (4), *Mi sono perso* (5; reflexivo en pasado, 16),
*Ne parliamo dopo?* (7; *ne*, 21), *Vorrei…* (3; condicional, 20), *Tenga il resto* (3;
congiuntivo, 24). Aprender fórmulas temprano está bien (Myles, Hooper & Mitchell 1998),
pero ninguna lección las retoma. El único puente es el bloque «Ya lo venías usando» de la
semana 24 (imperativo formal = congiuntivo). La lección del passato prossimo (semana 11)
no nombra *ho capito*, que el estudiante viene usando desde la semana 2.

**Por qué importa.** Así la fórmula pasa a ser regla: el estudiante ve que *ho capito* es
un caso de lo que está aprendiendo (Ellis 2002; Myles et al. 1998). De paso, la frase
vuelve espaciada.

**Qué cambiar.**
1. Agregar en `frasi_data.js` un campo `g: [["passatoProssimo", 11]]` por frase, o
   calcularlo en el build con el sillabo.
2. En `lezione.js` `steps`, cuando la semana enseña ese rasgo, agregar un paso «look» con
   las frases que el estudiante ya vio (`state.cards`) y un chequeo.
3. En la tarjeta de la frase, un sello «🧩 Fórmula: la gramática llega en la semana 11».

**Esfuerzo.** M.

### A5. Chequeos de las lecciones que no chequean nada (MEDIA)

**Qué pasa** (`lezione.js` `tableQuestion`, 5 corridas de las 52 lecciones):
- **Unos 200 de 1919 chequeos (≈10 %) preguntan la columna «Ejemplo», «Nota» u «Ojo con»**
  de una tabla. Ejemplos: «Singular: l'uomo → Nota» ⇒ *el hombre* (opciones: *cambia de
  género / el hombre / íd.*); «Singular: la città → Ejemplo» ⇒ *las ciudades*; «Singular:
  lo → Ejemplo» ⇒ *lo zio → gli zii* (se contesta buscando *lo*, no pensando);
  «Italiano: lì / là → Ojo con» ⇒ *íd.*
- 27 veces sale el mismo chequeo dos veces seguidas (por ejemplo «la città → Ejemplo» en la
  semana 3).
- 11 bloques no tienen ningún chequeo, entre ellos bloques centrales: semana 21 «NE: una
  cantidad», semana 25 «Cuándo NO va congiuntivo», semana 15 «Los pocos irregulares»,
  semana 22 «Con infinitivo e imperativo, pegados», semana 18 «Exclamaciones con che,
  come, quanto».
- Las lecciones están muy desparejas: la semana 3 tiene 17 bloques y 59 chequeos; la 4 y la 5,
  4 bloques y 5 chequeos cada una (ver B8).

**Qué cambiar.** En `tableQuestion`, preguntar solo las columnas que llevan la regla
(forma, plural, auxiliar, suena) y, si es un ejemplo, preguntar al revés (ejemplo →
regla). No repetir la última pregunta. Para los 11 bloques, escribir un `qq` a mano en
`tools/it/lessons/`.

**Esfuerzo.** S (código) + S (los 11 `qq`).

### A6. Frase nueva: primera recuperación demasiado difícil y consignas que no coinciden (MEDIA)

**Qué pasa.**
- En `frasi.js` l. 404 (`isNew[f.id] && Math.random() < 0.5 ? writeItem(f)`), **la mitad de
  las frases nuevas se piden escritas de memoria en la misma sesión**, después de verlas
  una sola vez. Esto pisa lo que el mismo archivo decide para las nuevas (`fresh`: fichas o
  cloze). Jugando *Primi passi* con errores, la ronda terminó 0/12 y todo volvió en
  «segunda vez».
- Las fichas de distracción salen de frases que el estudiante todavía no vio (*presto*,
  *domani*, *conoscerti* en la primera frase).
- `drills.js` l. 431 (`recognitionOf`) muestra botones pero deja la consigna de escribir:
  «Escribí la forma de «avere»…», «Escribilo bien: poné el verbo en presente.» Afecta a
  **277 ítems** del curso con consigna «Escribí/Traducí/Respondé…» y a todo el
  gimnasio (`conjugationTyped`).

**Qué cambiar.** Frase nueva: fichas o cloze con iniciales en la primera sesión, y escrita
recién desde la segunda. Recuperar con éxito es lo que fija; fallar sin nada que ayude
desanima. Fichas de distracción: tomarlas de frases ya vistas o de la misma frase con el
error típico. En `recognitionOf`, reescribir la consigna: `/^Escrib[íi]/` → «Elegí»,
«Completá con…» sigue igual.

**Esfuerzo.** S.

### A7. Detalles de interfaz (BAJA)

- **«Cómo se arma» aparece dos veces** en la tarjeta de frase nueva: la nota lleva ese
  título y el desglose también (`app.js` l. 1943–1944). Conviene llamar a la nota
  «Para qué sirve» y al desglose «🔎 Palabra por palabra».
- En la tarjeta de palabra el desglose está cerrado (`desgloseHtml(wv[2], false)`) y el
  ejemplo es justo lo que más lo necesita en las semanas 1 a 4 (ver B3): abrirlo por
  defecto hasta la semana 12.
- La pista «*no* es una palabra italiana, pero no es la que va acá» se lee como una
  contradicción cuando la palabra es *no*. Mejor: «La palabra *no* existe en italiano,
  pero acá no va».
- Las tarjetas dicen «Decila en voz alta» o «imaginate diciéndola». Si se quiere evitar lo
  oral, reemplazarlo por una acción escrita (tocar en la frase la palabra que significa
  «me», o copiarla con huecos).

---

## B. Específico del italiano

### B1. El banco saca oraciones antes de su gramática (ALTA)

**Qué pasa.**
- `tools/it/build_bank.py` (l. 241–262) calcula la semana de cada oración (`w`) solo con
  `sillabo.analyze`, que ve tiempos verbales y poco más. **No usa las etiquetas que la
  oración ya trae** (`tags`: *imperativo*, *piacere*, *riflessivi*, *si_impersonale*…).
- Al sillabo le falta léxico: **152 de los 636 verbos del banco** (los marcados
  irregulares: *piovere, crescere, succedere, scendere, correggere, spendere…*) no
  están en el conjugador ni en `forms_lexicon.js` (l. 17–20 registra solo los regulares).
  Por eso *Domani pioverà*, *Cos'è successo?*, *Ieri è piovuto* y *Mio figlio è
  cresciuto* quedan como de la semana 1.
- Resultado: 327 de las 864 oraciones tienen una `w` menor que la semana de alguna de sus
  etiquetas (260 con 5 semanas o más de diferencia, *aprox.*). El filtro por nivel lo
  suaviza, pero en la práctica, generando sesiones con `Banca.translateSession`:
  **semana 10: 30 de 186 oraciones distintas de *Traduci* (16 %)** usan algo de una semana
  posterior (*Il paese è cambiato molto* → passato prossimo; *Chiudi la porta* →
  imperativo; *Mi ricordo di quell'estate* → reflexivo); semana 12: 19/209 (*Mi manchi*,
  *In Svizzera si parla italiano*, *Ci vogliono due ore*). *Encontrá el error* en la
  semana 5: 7/111 con *piacere* (*Laura piace molto ballare*, *Ai miei genitori gli piace
  il tango*).
- El mismo hueco afecta al curso: los ejemplos de palabras «Ieri è piovuto tutto il
  giorno» y «Mio figlio è cresciuto» (semana 1) pasan el control por esto.

**Qué cambiar.** En `build_bank.py`: `w = max(sillabo, TAG_WEEK[t] for t in tags)`, con
`TAG_WEEK` en `sillabo.py` (junto a `FEATURE_WEEK`). En `forms_lexicon.js`: registrar
también los irregulares del banco, por lo menos su participio y la raíz de futuro y
condicional, o sumarlos al conjugador. Después, volver a compilar curso y banco.

**Esfuerzo.** M.

### B2. «Acá va congiuntivo» en semanas de presente (ALTA)

**Qué pasa.** `lang/it/diagnosi.js` `tenseRule` (l. 1255–1267) elige la lectura
«congiuntivo» cuando la forma correcta vale como presente de *tu* y como congiuntivo
(*mangi, paghi, frequenti, indichi, neghi*). En la semana 6 vi *Tu ___ troppo di affitto
(pagare)*: si elegís *pago*, la app contesta «CONGIUNTIVO: Acá va congiuntivo: *paghi*, no
*pago*. Opinión, deseo, duda o emoción → congiuntivo». Simulado en todos los ítems de
presente con hueco de una palabra (semanas ≤ 23): **19 de 1118 errores de persona salen
como congiuntivo, en 10 ítems** (`d06-002`, `d06-013`, `d06-017`…). En el gimnasio, 7 de 510
(*tu ___ (mangiare)* → *mangia*). En `d03-019` (plural de *bacio*) elegir *bacio* también
da «Acá va congiuntivo: *baci*».

**Qué cambiar.** Que la regla de congiuntivo solo salga si hay un disparador (`OPINION`,
*che* + verbo de opinión) o si la semana es la 24 o posterior. Si no, usar la regla de
persona. Cuando el ítem es nominal (consigna «plural»), no pasar por las reglas de verbo.
Sumar el caso a `tools/it/test_diagnosi.js`.

**Esfuerzo.** S.

### B3. Palabras de la semana 1 a 4 y la escritura de la semana 1 (ALTA)

**Qué pasa.**
- La meta de la semana 1 es «Saludar, despedirte y deletrear tu nombre», pero sus
  palabras son *fare, andare, volere, mangiare, prendere*, que son los irregulares de la
  semana 6, más *macchina, bello, giorno, bambino, figlio, stasera, abitare*. Ninguna
  de las fórmulas de la semana (*ciao, grazie, come, dove, nome…*).
- Los ejemplos de esas tarjetas usan gramática que todavía no se vio: «Ieri è piovuto tutto
  il giorno» y «Mio figlio è cresciuto molto quest'anno» (passato prossimo),
  «Quest'inverno **vado** a fare sci», «**Vuole** un caffè, signore?»; en la semana 3,
  «Mi **piace** tantissimo la pasta» (*piacere* es de la semana 14). En las semanas 1 a 4,
  **11 de 48 ejemplos** usan verbos o tiempos no enseñados (9 con presente de verbos que no
  son *essere* ni *avere*, 2 con passato prossimo). La tarjeta de *fare* recita toda la
  conjugación irregular en la semana 1.
- *Scrivi* de la semana 1 (`scrivi.js` `TASKS[1]`) pide «cuántos años tenés», pero los
  números se enseñan en la semana 7. El modelo usa *trent'anni* (elisión, semana 3).
- Glosa discutible: *prendere* = «agarrar», con el ejemplo *Prendo un caffè* (ahí es
  «tomo», como ya dice el desglose).

**Qué cambiar.** Elegir las palabras de las semanas 1 a 4 según la meta y las frases de
la semana (en `build_course.py`, al armar `vocab`). Reescribir los ejemplos con la
gramática de la semana y agregar el detector al control de `build_course.py`. En
*Scrivi* 1, dar un marco con huecos («Sono ___. Sono di ___. Ho ___ anni.») y la lista de
números hasta 40, o cambiar la edad por «qué tenés».

**Esfuerzo.** S.

### B4. Notas que faltan o que solo dan la respuesta (MEDIA)

**Qué pasa.** 691 de los 870 ítems de Dummies (79 %) no tienen nota. En las semanas 1 a 12,
323 de 1314 ítems (25 %) no tienen nota, y entonces la «🔁 Segunda vez, más fácil» no
muestra ninguna regla (el 📐 depende de `it.note`). Por tipo: *conjugate* 134/170,
*qa* 15/15, *numbers* 8/10, *plural* 8/20, *cloze* 348/1606. Además, 328 notas son solo
una equivalencia y no explican la regla: «Tener frío = avere freddo.», «Decimo, decima =
décimo.», «Ma = pero.».

**Qué cambiar.** Muchas consignas de Dummies ya dicen la regla («Completá con da, sola o
unida al artículo»). Se puede generar la nota con los datos de `rules.js` (`artWhy`,
`contr`, `formsNote`) y escribir a mano lo que quede. A las notas que son solo
equivalencia, sumarles la regla que generaliza: «*avere* con hambre, sed, frío, calor,
miedo: *ho fame*, *ho freddo*».

**Esfuerzo.** M a L, según cuánto se escriba a mano.

### B5. Glosario con un solo significado para palabras que tienen dos (MEDIA)

**Qué pasa.** 30 formas del glosario son también formas de otro verbo y guardan un solo
significado: *sei* = seis, *faccia* = cara, *letto* = cama, *sale* = sal, *porta* = puerta,
*lavoro* = trabajo, *chiese* = iglesia, *corso* = curso, *posto* = lugar… Ese glosario se
usa al tocar una palabra del enunciado (`glossify`) y en el desglose (A2). Tocar *sei* en
*Tu sei argentino* muestra «seis».

**Qué cambiar.** Permitir varios significados por entrada y elegir con reglas simples
(después de *tu* o delante de *?* → verbo; después de un artículo → sustantivo), o
mostrar los dos.

**Esfuerzo.** M.

### B6. Trampas y diagnóstico que confunden pronombre y artículo (MEDIA)

**Qué pasa.** Además de los 8 «Adiviná» con *il* por *lo* (A1), el diagnóstico explica
esos casos con la regla del artículo: *Il prendo* → «Delante de consonante normal va *il /
i / un* (masculino): *lo prendo*».

**Qué cambiar.** En `rules.js` `trapWord` (l. 141), no tocar *lo/la/li/le* delante de un
verbo; si se quiere, el error típico del hispanohablante es *le* por *gli* o *lo* por
*gli*. En `diagnosi.js`, antes de `articleRule`, ver si la palabra siguiente es un
verbo y usar `pronounRule`.

**Esfuerzo.** S.

### B7. Laboratorio y lectura con gramática posterior (MEDIA)

- *Capire* «pronomi» (semana 10, `lab_data.js` l. 204): *L'ho letto ieri / L'ho letta /
  Li ho letti / Le ho lette* son passato prossimo con concordancia (semana 11).
- *Capire* «accordo» (semana 11, l. 171): *Si è svegliata / Si sono svegliati presto* son
  reflexivos en pasado (semana 16).
- Lectura `w-12`, afirmación vero/falso: «La nonna vuole che i nipoti si lavino le mani»
  (congiuntivo, semana 24).
- Semanas 3 y 4: ítems con *mi piace/piacciono* (`b2-prep-07`, `ar-u-13`, `s:r02-03:e`,
  `rf-4-15`) y un chequeo de la lección 3 («Traducí: Me gusta el café»). En la semana 2 se
  producen artículos que se enseñan en la 3 (`g2-gd-34` *i turisti*, `g2-gd-35`,
  `g2-gd-36`, `g2-va-13`, `g2-va-26`).

**Qué cambiar.** Mover *pronomi* a la semana 11 o escribirlo en presente (*Lo leggo /
La leggo…*). Mover *accordo* a la 16 o usar *è arrivata*. Cambiar el vero/falso de
`w-12`. Que el sillabo sepa de artículos (semana 3) y de *piacere* (semana 14), como ya
sabe de elisión.

**Esfuerzo.** S.

### B8. La semana 3 está sobrecargada (MEDIA)

**Qué pasa.** Artículos, apóstrofo, posesivos, países y ciudades, preposiciones
articuladas, partitivo, *qualche/alcuni* y *nessun*: 17 bloques, 118 pasos, 59 chequeos y 109
ítems. La semana 4 tiene 4 bloques (20 pasos) y la 5 también 4 (21 pasos). Los posesivos
se vuelven a enseñar en la 17 y las preposiciones en la 9.

**Qué cambiar.** Dejar en la 3 los artículos y la contracción básica. Pasar los posesivos
a la 4 (que es de adjetivos) o a la 17, y el partitivo, *qualche* y *nessun* a la 8 o la 9.

**Esfuerzo.** M (mover bloques y recompilar; el sillabo reubica los ítems solo si sabe
de esos rasgos, ver B7).

### B9. Contenido y consistencia (BAJA)

- *gli* se describe de tres maneras: «casi «li» muy rápida» (tabla de la lección 1),
  «como la «ll» tradicional» (`a2-ort-06`) y «como la ll bien pronunciada» (`asc-1-13`).
  Conviene elegir una.
- Clave de *Traduci* demasiado estrecha en algunos casos: `rf-1-24` «La ciudad es linda»
  solo acepta *La città è bella* (tendría que aceptar *carina*).
- La diagnosis de *Hola, ¿cómo estás?* escrita en español propone *estás* = *sei* (en esa
  frase es *stai*).

---

## C. Mejoras de diseño de ejercicios según la investigación (sin ejercicios orales)

1. **«Adiviná y explicá».** Después de adivinar, preguntar con un toque «¿Qué tenía mal la
   otra?» (doble consonante / tilde / palabra del español / preposición), usando las
   categorías que ya da `Diagnosi`. Explicarse el porqué suma (Bisra et al. 2018, g =
   0,55) y fuerza a mirar la forma (Schmidt 1990). Los duelos ya hacen esto con
   «¿qué te lo dijo?». Núcleo: `frasi.js` + `app.js`. Esfuerzo S.
2. **Variaciones de la fórmula, por escrito.** Después de *Mi chiamo Augusto*, un ítem
   corto: «*Come ___ chiami?* / *Lei ___ chiama Anna*». Después de *Mi passi il sale?*:
   «*Mi passi ___ acqua?*». Muestra cómo se arma la frase cambiando una pieza (Myles et
   al. 1998; N. Ellis 2002, marcos con huecos). Tipo nuevo `variante` en `frasi.js`, con
   un campo `frame` en `frasi_data.js`. Esfuerzo M.
3. **Input estructurado con los pronombres de las frases.** Un *Capire* nuevo: «*Mi passi
   il sale?* / *Ti passo il sale*: ¿quién recibe la sal?». Sirve para interpretar el
   pronombre antes de producirlo (VanPatten 2004). Solo datos en `lab_data.js`. Esfuerzo
   S.
4. **Devolución según la distancia.** Pista si la respuesta está cerca; modelo, desglose y
   fichas si está lejos (A3; Aljaafreh & Lantolf 1994).
5. **Dictogloss con andamios en A1.** Los textos de las semanas 2 a 8 tienen entre 52 y 62
   palabras, se escuchan dos veces con la voz del teléfono y se reconstruyen: es mucho para
   la semana 2. Hasta la 8, empezar con un dictado con huecos y los bloques como fichas
   para ordenar, y dejar la reconstrucción libre desde A2 (Wajnryb 1990 lo propone para
   intermedios). Es escucha y escritura, sin hablar. Núcleo, en la pantalla de
   dictogloss de `app.js`. Esfuerzo M.
6. **Recordar con éxito primero.** Pasar de reconocer a completar con iniciales, después a
   fichas y recién después a escribir (A6). Recuperar con éxito, y espaciado, es lo que más
   rinde (Rowland 2014; Karpicke & Roediger 2008).

---

## Anexo: cifras y scripts

| Medición | Resultado |
|---|---|
| «Adiviná» con otra frase como opción | it 19 % (332/1790), pt 23 % (530/2275) |
| Opciones fabricadas del «Adiviná» con explicación disponible (`explainChoice`) | 716/716 |
| Frases it con pronombre átono delante del verbo, sin explicar en el desglose | 102/358 |
| Líneas «en esta frase» del desglose equivocadas | it 5/13; pt, muchas de 42 |
| «boh» como respuesta recibe una categoría gramatical | 358/358 (91 auxiliar, 105 preposición…) |
| Frases con gramática posterior a su escena | 67/358 |
| Errores de persona diagnosticados como congiuntivo (semanas ≤ 23) | 19/1118 en ítems; 7/510 en el gimnasio |
| Verbos del banco que no conoce el conjugador ni el sillabo | 152/636 |
| *Traduci*, semana 10, con estructura de una semana posterior | 30/186 (16 %) |
| Ejemplos de palabras (semanas 1–4) con gramática no enseñada | 11/48 |
| Chequeos de lección sobre la columna Ejemplo/Nota | ≈200/1919 (≈10 %) |
| Bloques de lección sin chequeo | 11 |
| Ítems con consigna «Escribí…» mostrados con botones | 277 (+ gimnasio) |
| Ítems sin nota, semanas 1–12 | 323/1314 (25 %); Dummies 691/870 |
| Notas que son solo una equivalencia | 328 |

Scripts (en `scratchpad/review_it/`): `det.js` (detector por semana), `scan.js`
(vocabulario, ejemplos de lección, frases, ítems, laboratorio, duelos), `sil_frasi.py`,
`desg.js` y `desgcov.js` (desglose), `guess.js`, `guessdiag.js` y `guess2.js` («Adiviná»),
`diagtest.js` (respuestas lejanas), `congdiag.js` (congiuntivo), `bank.js`, `banksess.js` y
`banktag.js` (banco), `lesq.js` y `lesq2.js` (chequeos), `let.js`, `let2.js` y `dg.js`
(lecturas y dictogloss), `voc14.js`, `pt.js`, y para el navegador `drive.js`,
`run_frasi.js`, `run_train.js` y `run_w.js` (con las salidas `out_*.txt`).
