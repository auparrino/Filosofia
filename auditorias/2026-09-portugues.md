# Auditoría pedagógica: Rumo C1 (portugués de Brasil) y el núcleo común

Rama `claude/dazzling-cannon-iw4148`, versión 2.1 (ya incluye el desglose «🔎 Cómo se arma»).
Solo lectura: no toqué el repo. Los scripts de medición están en
`scratchpad/review_pt/`:

| Script | Qué hace |
|---|---|
| `expo.js` | junta los 10.507 textos en portugués que ve el alumno, con semana, módulo y rol (lee / elige / produce) |
| `tag.js` | marca cada forma verbal, contracción y pronombre que aparece antes de la semana en que se enseña → `early.json` |
| `vocab.js` | detecta palabras que hay que producir sin haberlas visto nunca antes |
| `diag.js` | ¿el diagnóstico explica cada distractor? Opciones del «Adiviná» y sus trampas |
| `dump.js` | vuelca la lección y los ítems de una semana (`lessons.txt`, `items.txt`) |
| `pw_*.js` | recorridas en Chromium (390 px): Desafio do dia, Cafezinho, lección 1, escena de semana 11 abierta en la semana 1, Treino, Ler |

Me puse en el lugar de un principiante absoluto que arranca en la semana 1 sin
leer nada y avanza semana a semana. Más abajo separo los problemas del
**núcleo** (`docs/js/`, pegan en los dos idiomas; cuando pude, medí también el
italiano) de los **propios del portugués** (`docs/lang/pt/`, `tools/pt/`).
No hay ninguna recomendación de ejercicios orales.

---

## Las 10 recomendaciones principales

1. **(Núcleo, alta) Treino abre las 26 escenas de frases desde el primer día.** Un alumno de la semana 1 entra a «O fim de semana» (semana 11) y hace «Adiviná» con *fez, fui, comi, à*. Es la causa más directa de «aparece y no explica nada».
2. **(Núcleo, alta) El «Adiviná» no enseña por qué la opción está mal.** 106 de 455 frases usan otra frase entera como distractor (en italiano, 66 de 358). Además, el diagnóstico ya tiene una explicación para 753 de las 780 trampas, pero la pantalla no la muestra.
3. **(Núcleo, alta) «Cómo se arma» explica mal o no explica.** Toma *como* por el verbo *comer*, *casa* por *casar*, *mate* por el subjuntivo de *matar* y *beijo*, *trabalho*, *posto* o *visto* por verbos. En 101 de 455 frases no dice nada de *me, se, tudo, a gente, até, meu, essa*. Pone nombres de tiempos que el alumno todavía no vio.
4. **(Núcleo, alta) Los chequeos automáticos de la lección no chequean el bloque.** Solo el 44 % toca la forma que enseña el bloque (en italiano, 29 %). Además salen preguntas sin sentido (Letra K → Letra), reglas sin hueco y consignas que en vez de traducción muestran un comentario («También es correcto sin eu»).
5. **(Núcleo, alta) «Segunda vez, más fácil» muestra la respuesta antes de preguntar.** La nota que aparece arriba trae la respuesta literal en 1.426 de 2.464 ítems (58 %) y quedan solo 2 opciones. El alumno copia, no recupera.
6. **(PT, alta) 36 frases usan gramática de semanas posteriores y solo 3 notas lo avisan.** «Salva-vidas» (semana 2) es casi toda *pode, sei, quer, entendi, aprendendo*.
7. **(PT, alta) El banco «Traduza» pide palabras y gramática que nunca se vieron.** Son 65 oraciones del banco y 10 ítems: *cachorro* en la semana 1, *geladeira, chaves, vizinhos, feijão, suco, crianças*. Otras 12 oraciones piden posesivos (*A minha mãe é professora*, semana 3) siete semanas antes de enseñarlos.
8. **(Núcleo, media) La respuesta correcta es la opción más larga.** Pasa en el 75 % de las preguntas de lectura (227 de 303) y en el 81 % de «Descubrí la regla» (78 de 96). En italiano, 171 de 261 y 19 de 25.
9. **(PT, media) 32 ítems de escucha cuelgan de la parte equivocada de la lección.** Los 20 pares mínimos de la semana 1 entran con «ser, estar y ter». Además, el duelo ser/estar de la semana 1 no toca el contraste que de verdad importa: la ubicación fija va con *ser* o *ficar*, como en *o apartamento é em Botafogo*.
10. **(Núcleo, media) Metalenguaje y devoluciones.** «presente do indicativo» aparece desde el día 1 en el gimnasio y en el desglose, pero la teoría dice *indicativo* recién en la semana 23. «🔎 Casi. Revisalo» sale para cualquier error, incluso «xx». En «¿Qué significa?», 34 glosas delatan la respuesta porque contienen la propia palabra portuguesa, como *borracha* → «goma de borrar (no «borracha» = ebria)».

---

## A. Núcleo común (los dos idiomas)

### A1. Treino abre todas las escenas de frases desde el día 1 · ALTA · esfuerzo S (1-2 h)

**Qué pasa.** `renderTreino` (`docs/js/app.js` ~l. 815) recorre `Frasi.SCENES` y
dibuja todas las escenas como botones activos. No mira `Drills.sceneWeek`. En
portugués son 25 escenas con semana mayor que 1, con 436 frases; en italiano,
20 escenas con 340 frases.

Lo probé en el navegador con un perfil nuevo en la semana 1: tocar «O fim de
semana» (semana 11) arranca la sesión. Lo primero que aparece es «Adiviná:
¿Qué hiciste el fin de semana?» con *O que você fez no fim de semana?*. Siguen
*Fui à praia com uns amigos* y *Comi uma feijoada incrível*: el perfeito y la
crase, diez semanas antes de enseñarlos. `rules.js` (l. 382) dice que la idea
es justamente la contraria: «las frases llegan cuando la gramática que usan ya
se vio (…) no el primer día». Los duelos y las lecturas sí se bloquean («Se
abre en la semana 9»); las frases no.

**Por qué importa.** Es el caso exacto del usuario: una frase aparece en el
«Adiviná», no se explica cómo se arma y además todavía no toca verla.

**Qué cambiar.** En `renderTreino`, poner `disabled` y el texto «Se abre en la
semana N» cuando `Drills.sceneWeek(s.id) > state.unlocked`, igual que con los
duelos y el banco. Si se quiere dejar mirar, que se pueda abrir la escena
futura en modo lectura (tarjetas «Frase nueva» con su desglose), sin «Adiviná»
y sin que entre al repaso.

### A2. «Adiviná»: distractores que no enseñan y error sin explicar · ALTA · esfuerzo M (medio día)

**Qué pasa.**
1. **Otra frase como distractor.** `guessItem` (`docs/js/frasi.js` l. 339-362) completa con `similar()` cuando la frase tiene menos de dos trampas. Eso pasa en 106 de 455 frases en portugués y en 66 de 358 en italiano. Ejemplos reales:
   - «¡Mucho gusto!» → *Muito prazer!* / *Muy prazer!* / **Valeu, falou!**
   - «Ya comí, gracias.» → *Já comi, obrigado.* / *Já comi, obligado.* / **Foi muito divertido!**
   - «¡Todo genial!» → **Até amanhã!**

   Se resuelve por el sentido, no por la forma. Es lo que el propio comentario del código dice que no hay que hacer.
2. **No se explica el error.** `settleGuess` (`app.js` l. 2569) muestra «Era esta. Ahora ya la conocés.», la nota y el desglose, pero nunca por qué la opción elegida estaba mal. `Diagnosi.explainChoice` ya da una explicación específica para 753 de las 780 trampas de las primeras dos opciones. Por ejemplo: «*bien* es español. ¿Cómo se dice en portugués?», o «Revisá cómo termina la palabra marcada» para *Bon dia*.
3. **Las trampas tientan poco.** Casi todas meten una palabra en español (*Oi, tudo bien?*, *Boa noche!*). Con eso el alumno aprende a descartar lo que suena a castellano, no la construcción. Las trampas que sí enseñan (*Todo bem*, *em o*, *Você és*, *tem/têm*) aparecen menos.

**Por qué importa.** La prueba previa ayuda a recordar solo si al error le sigue
una corrección que lo explica (Kornell, Hays y Bjork 2009; Metcalfe 2017,
aprendizaje con errores). Un distractor que se descarta por el sentido no deja
nada que corregir.

**Qué cambiar.** Todo en el núcleo (`frasi.js` y `app.js`):
- Nunca completar con `similar()`. Si hay menos de dos trampas, que el ítem sea una tarjeta «Frase nueva» y no «Adiviná».
- En `settleGuess`, cuando `given !== answer`, llamar a `Diagnosi.explainChoice(given, answer)` y mostrar `diagHtml(d)` antes de la nota: «Elegiste *Todo bem*: *todo* va con sustantivo (*todo dia*); «todo» solo es *tudo*».
- Ordenar las trampas por la tabla del idioma (`traps.contr`, `traps.art`) antes que por `span`, así la primera trampa es un error de construcción.
- Dos cambios en portugués hacen falta para que esto rinda: B1 (avisar la gramática que falta) y A3 (arreglar el desglose).

### A3. «🔎 Cómo se arma»: análisis equivocados y huecos · ALTA · esfuerzo M (1 día)

Medido sobre las 455 frases (`desg.json`). Todo lo que sigue sale del núcleo
(`docs/js/desglose.js`) con los datos de portugués.

**1. Análisis equivocados.**
- *como* → «de *comer* (presente do indicativo, eu)» en 5 frases (*Boa tarde, como vai?*, *Como se escreve?*).
- 21 casos de sustantivo o adjetivo analizado como verbo aunque vaya después de un artículo o determinante:
  - *um beijo* → *beijar*; *muito trabalho* → *trabalhar*; *o posto nove* → *pôr*, participio; *seu visto* → *ver*;
  - *um mate* → «*matar*, presente do subjuntivo» (semana 8);
  - *a corte* → *cortar*; *o Estado Novo* → *estar*; *o argumento* → *argumentar* (2 veces); *a demora* → *demorar*; *pelo atraso* → *atrasar-se*.
- *em casa* → «*casar-se* o *casar* (presente)», en 4 frases, confirmado en pantalla.
- *obrigado* → «de *obrigar* (participio) — obligar».

**2. Ambigüedades sin resolver.** Hay 44 entradas con dos lemas o dos tiempos, y
el significado que se muestra es el del primero:
- «*Fui à praia*» → «*fui*: de *ser* o *ir* … — «ser»»;
- *vendo* → *ver* (gerundio) o *vender*;
- *vamos* → «presente o subjuntivo»;
- *deixa eu pensar* → «presente, ele/ela/você», cuando es un imperativo.

**3. No explica las palabras gramaticales que más confunden.** En 101 frases
queda sin explicar alguna de estas: *me* (21), *se* (14), *meu* (11),
*tudo* (10), *a gente* (9), *até* (7), *esse/essa/isso* (20). En las semanas 1-4
son 17 de 70 frases. *Oi, tudo bem?* se desglosa solo en «oi — hola» y «bem —
bien», y no dice que *tudo* ≠ «todo», que es justamente la trampa. 23 frases no
tienen ningún desglose (*Mais uma rodada!*, *Que legal!*).

**4. Metalenguaje antes de tiempo.** 61 entradas en 55 frases nombran un
tiempo que todavía no se enseñó: «pretérito perfeito» en la semana 1, «presente
do subjuntivo» en la 8. No hay traducción al español del rótulo ni aviso del
tipo «lo vas a ver en la semana 11».

**5. Rótulo duplicado.** La tarjeta «Frase nueva» (`app.js` l. 1943) pone la
nota bajo el título «**Cómo se arma**» y abajo el desplegable «🔎 Cómo se
arma». Muchas notas no hablan de cómo está armada la frase («La respuesta de
rigor es *Tudo bem, e você?*…»).

**Qué cambiar.**
- En `desglose.js`:
  - Tratar como sustantivo a la palabra que viene después de cualquier determinante: artículos, *meu/seu/esse/este/muito*, contracciones. Hoy solo se hace si el glosario da otro lema.
  - Una lista `LANG.rules.desglose.notVerb` por idioma (en portugués *como, casa, mate, posto, visto, corte, estado*), o preferir el glosario cuando su lema no es un verbo.
  - Con dos lemas, mostrar el significado de la frase (`f.es`) o los dos: «*fui*: de *ir* (aquí) — también es el perfeito de *ser*».
  - Una tabla `LANG.rules.desglose.function` para *tudo, a gente, me/te/se/lhe, até, esse/essa, mas, né, pra* con su explicación fija («*tudo* = todo, pronombre: nunca «todo bem»»).
  - Rótulo en castellano y semana: «*fez*: de *fazer*, pasado (pretérito perfeito, lo ves en la semana 11), él/ella/usted».
- En `app.js`, poner a la nota un título según lo que dice («📝 Nota» o «💡 Uso») y dejar «🔎 Cómo se arma» solo para el desglose.

### A4. Los chequeos automáticos de la lección no chequean el bloque · ALTA · esfuerzo M-L (1-2 días)

**Qué pasa.** `Lezione.steps` (`docs/js/lezione.js`) arma los chequeos:
`trap` (3.779), `table` (4.280), `hand` (212), `rule` (29), en 20 semillas × 52
semanas. Hay cinco problemas:

1. **La trampa no toca el bloque.** Solo 1.649 de 3.779 chequeos de trampa (44 %) cambian una forma que el bloque enseña (en italiano, 470 de 1.631, 29 %). Ejemplos reales:
   - Bloque «ir + infinitivo» → *Você vai sair hoje? / Bocê vai… / Usted vai…*
   - «em + artículo: no, na» → *Estoy no Rio / Estei no Rio*
   - «isto, isso, aquilo» → *Isto ê um biscoito* / *Isto está*
   - «muito: nunca muy» → *no praia* / *gentes*
2. **Preguntas sin sentido.** «Completá la tabla — Letra: K → Letra: O / X / R» (semana 1, lo vi en pantalla). «1 um / uma → 12 doze» (semana 7). «Perfeito (eles): estiveram → Perfeito (eles): disseram» (semana 28). `tableQuestion` no distingue una tabla de dos columnas pareadas (Letra | Nombre | Letra | Nombre) de una tabla de filas.
3. **«Completá la regla» sin hueco.** Semana 1, bloques 4 y 5: la consigna muestra la regla entera y pide elegir *pão / mãe / põe*. `ruleQuestion` toma `src = b.r` aunque la forma elegida no esté ahí.
4. **Consigna con un comentario en lugar de la traducción.** 10 bloques, por ejemplo «¿Cuál está bien? «También es correcto sin eu.»» (semana 5), «…«Lo mismo, más formal.»» (29), «…«Estoy en camino (formal).»» (38).
5. **Distractores y devolución que no enseñan.**
   - 2.386 de 11.324 distractores de trampa (21 %) solo sacan o cambian una tilde (*Vocé*, *Nao tem problema*, *manha*).
   - Al errar, la devolución es la regla del bloque entera (📐), no por qué esa opción está mal. Con «Letra D → Nombre» el alumno recibe «Son 26 letras, con k, w, y…».

**Por qué importa.** El chequeo después de cada bloque es la práctica de
recuperación que fija la regla. Si pregunta otra cosa, el alumno pasa el
chequeo sin haber entendido el bloque (Roediger y Karpicke 2006: rinde lo que
se recupera, no lo que se relee).

**Qué cambiar.**
- `exQuestion`: aceptar solo trampas que cambien un token de `forms(b)`. Si no hay dos, usar `ruleQuestion` o `handQuestion`, y si tampoco, no preguntar.
- `tableQuestion`: descartar las tablas cuyo `head` repite un encabezado (Letra…Letra) y las filas sin columna de etiqueta.
- `ruleQuestion`: devolver `null` si `src` no contiene `*pick*`.
- `translation(p)`: excluir los ejemplos cuyo segundo elemento no es una traducción (entre paréntesis, «también», «formal», «lo mismo»). Mejor todavía, marcarlo en los datos: `ex: [pt, es, "c"]` para comentario.
- En las trampas de lección, no más de un distractor que sea solo de tilde, salvo que el bloque trate de tildes.
- Devolución: `Diagnosi.explainChoice` sobre la opción elegida, igual que en `answer()` de las rondas.

### A5. «Segunda vez, más fácil» regala la respuesta · ALTA · esfuerzo S (2 h)

**Qué pasa.** `retryVersion` (`app.js` l. 2554) deja 2 opciones y `renderGioco`
muestra `📐 it.note` arriba del ítem. En 1.426 de 2.464 ítems (58 %) la nota
trae la respuesta literal. Lo vi en el Desafio do dia: «📐 Dia es masculino (o
dia): bom dia.» y debajo «___ dia! Bom / Boa». Y se repregunta 3 ítems después
de haber visto la solución.

**Por qué importa.** Recuperar con esfuerzo es lo que fija. Copiar de la
pantalla no cuenta (Bjork 1994). Hoy la segunda vez es un regalo, y además
suma estrellas y cuenta como autocorrección.

**Qué cambiar.** En la segunda vez mostrar la regla **con la respuesta
tapada**: reemplazar en la nota las apariciones de `it.answer` por «___», o
guardar en los datos un campo `rule` sin ejemplo. Otra opción es no mostrar
nada y dejar solo las 2 opciones: el espaciado de 3 ítems ya lo hace más fácil.

### A6. La correcta es la opción más larga · MEDIA · esfuerzo S (script) + M (reescritura de datos)

**Qué pasa.** Casos en que la respuesta correcta es la única opción más larga:

| Ejercicio | Portugués | Italiano | Al azar |
|---|---|---|---|
| Preguntas de lectura | 227/303 (75 %) | 171/261 | ≈25 % |
| «Descubrí la regla» | 78/96 (81 %) | 19/25 | ≈33 % |
| Ítems `choice` | 17 % | | |
| Chequeos a mano | 17 % | | |

Ejemplos: «¿Qué se ve desde la ventana?» → «el mar, las montañas y el Pan de
Azúcar» / «solo edificios» / «un estadio» / «un parque». En «Descubrí la
regla», la regla buena siempre es la más matizada.

**Por qué importa.** Es la pista clásica de las preguntas de opción múltiple
(Haladyna, Downing y Rodriguez 2002): se contesta sin leer el texto ni los
datos, y la comprensión que se mide es falsa.

**Qué cambiar.**
- Un control en `tools/pt/check_letture.py` y en un `test_*.js` del núcleo que falle si la correcta es la única más larga en más del 40 % de un conjunto.
- Reescribir los distractores para que tengan el mismo largo y la misma estructura, con detalles del texto que no responden a la pregunta: «el mar y los edificios de Copacabana» contra «el mar, las montañas y el Pan de Azúcar».
- En «Descubrí la regla», que las tres opciones sean reglas igual de precisas y una sola quede confirmada por los datos.

### A7. «¿Qué significa?» de las palabras de la semana: glosas que delatan · MEDIA · esfuerzo S (núcleo) + S (datos)

**Qué pasa.** `vocabItem` (`docs/js/drills.js` l. 521) usa la glosa completa
`v[1]` como opción. Hay tres problemas:
- 34 glosas contienen la propia palabra portuguesa, y la respuesta se reconoce por eso. Ejemplos:
  - *borracha* → «goma de borrar (no «borracha» = ebria)»
  - *oficina* → «taller mecánico (no «oficina»)»
  - *acordar* → «despertarse (no «acordar»)»
  - *legal*, *chato*, *balada*, *mala*, *sobremesa*, *pasta*, *largo*…
- 254 glosas llevan paréntesis o comillas. Como distractores son largos y raros, y se descartan por la forma.
- A veces los distractores son de otra categoría: *tchau* → «cerca / lejos / rubio», *prazer* → «abajo, debajo / cerca / rubio», *café da manhã* → «martes / vuelto / cajón».

**Qué cambiar.**
- En el núcleo, usar como opción solo la parte de la glosa antes de «(» o «;». La advertencia sobre el falso amigo va en la devolución, que ya muestra `v[3]`.
- Para el rango de distractores, exigir el mismo `wordKind`. En saludos y fórmulas usar el campo *saludos* (hola, gracias, perdón, chau), que hoy no existe en `fieldOf`.
- En los datos (`tools/pt/vocab/s*.py`), separar `es` corto y `nota`.

### A8. Metalenguaje sin presentar · MEDIA · esfuerzo S-M

**Qué pasa.**
- El gimnasio rotula cada ítem «Conjugá «ter» (tener) — **presente do indicativo**» desde el día 1. Lo vi en el Desafio do dia, antes de cualquier lección. La palabra *indicativo* aparece en la teoría recién en la semana 23.
- El desglose usa «pretérito perfeito», «futuro do pretérito (condicional)» y «presente do subjuntivo» a cualquier semana.
- El diagnóstico pone etiquetas como «CONCORDANCIA: … Artículos, posesivos, adjetivos y participios toman el género y el número…» para *Boa noite* en el día 1.

**Qué cambiar.**
- Un rótulo doble castellano/idioma en `Conj.TENSE_LABELS`, por ejemplo `{es: "presente", pt: "presente do indicativo"}`. Mostrar el término portugués solo desde la semana en que la teoría lo presenta (`TENSE_WEEK`).
- Un glosario de términos (tocás «perfeito» y ves «pasado puntual, como *comí*; semana 11»).
- Mensajes de diagnóstico más cortos en las semanas 1-4: la regla aplicada al caso, sin la definición general.

### A9. «🔎 Casi. Revisalo» para cualquier error · MEDIA · esfuerzo S

**Qué pasa.** `showPrompt` (`app.js` l. 2289) siempre dice «Casi». Lo vi en el
navegador: al escribir «xx» para «Ya comí, gracias.» sale «🔎 Casi. Revisalo:
Te falta una palabra.». Y en el cloze «Oi, ___ bem?» sale «Casi… La palabra
marcada no existe».

**Qué cambiar.** Usar «Casi» solo si `d.verdict === "quasi"` o si la distancia
a la respuesta es chica. Si no, «Todavía no. Revisá esto:». Ajustar el mensaje
«Te falta una palabra» cuando la respuesta tiene una sola palabra y no se
parece en nada.

### A10. Desafio do dia antes de la primera lección · BAJA · esfuerzo S

El botón está en Hoje desde el primer minuto y mezcla conjugación y
concordancia sin tarjeta de regla. Como prueba previa sirve, pero si
`weekStats[1]` está vacío conviene poner primero una tarjeta 📐 de la regla
(ya existe el tipo `card`) o limitarlo a palabras y frases nuevas, que traen su
tarjeta de presentación.

---

## B. Portugués de Brasil

### B1. Frases con gramática de semanas posteriores, sin aviso · ALTA · esfuerzo M

**Qué pasa.** 36 frases usan gramática posterior a la semana de su escena y
solo 3 notas lo avisan («ese tiempo llega en la semana 11»). Ejemplos:
- Semana 1 (*Primeiros passos*): *Boa tarde, como vai?* (ir, semana 6); *Sou de Rosario, mas moro no Rio* (presente regular, semana 5; *no*, semana 3); *Você fala espanhol?*; *Falo um pouco de português*; *Valeu, falou!* (perfeito, semana 11).
- Semana 2 (*Salva-vidas*): 16 de 17 frases. *Pode repetir?*, *Não sei*, *Estou aprendendo português* (gerundio, semana 8), *Você quer dizer que…?*, *Onde fica o banheiro?*, *Pode me corrigir?* (clítico, semana 16).
- Semanas 3-8: *Me vê um chope?*, *Posso pagar com cartão?*, *Me dá dois pães?*, *O que você faz?*, *Esqueci a toalha!*
- Semana 17: *né* (se enseña en la 38).

**Por qué importa.** Que la frase llegue antes que la gramática está bien: son
fórmulas de supervivencia (Boers y Lindstromberg 2012). El problema es que
llega **sin decir que es una fórmula** y con un desglose que usa términos que
el alumno no conoce.

**Qué cambiar.**
1. En el núcleo (`frasi.js` y `app.js`), calcular por frase la semana mínima de su gramática con el mismo analizador que `tools/pt/sillabo.py`, precalculado en el build y guardado como `f.gw`. Si `f.gw > f.week`, mostrar en la tarjeta y en el «Adiviná» una línea automática, sin tocar notas: «🧱 Fórmula: aprendela entera. El *pode* (de *poder*) lo ves en la semana 6».
2. En `docs/lang/pt/frasi_data.js`, mover a la escena de su semana las frases que no son de supervivencia: *Estou aprendendo português* → semana 8; *Pode me corrigir* → 16; *né* → 38 o una nota de uso.

### B2. 32 ítems de escucha colgados de la parte equivocada · ALTA · esfuerzo S (15 min)

**Qué pasa.** `tools/pt/authored/ascolto.py` no pone `part`, y
`build_course.py` (~l. 238) manda esos ítems a la última parte de la semana.
En la semana 1, los 20 pares mínimos (*avó/avô, mão/mau, filha/fila…*) entran
en «Tus primeros verbos: ser, estar y ter». En la app, «Lección 5/5: ser,
estar y ter» anuncia «35 ejercicios de esta parte», de los cuales 20 son de
sonidos. Pasa lo mismo en las semanas 2 (plurales nasales) y 7 (números).

**Qué cambiar.** Agregar `part=` en `ascolto.py`: semana 1 → parte 1 («Los
sonidos que el español no tiene»); en las semanas 2 y 7, la parte de plurales
o de números. Y un aviso en `build_course.py` cuando un ítem sin `part`
termina en una parte cuyo título no coincide con su `topic`.

### B3. El banco pide producir lo que nunca se mostró · ALTA · esfuerzo M

**Qué pasa.**
- **Vocabulario.** 65 oraciones del banco (`bank.sentences`, en «Traduza» o «Conjugue no contexto») y 10 ítems de traducción del curso piden escribir palabras que no aparecieron en ninguna lección, palabra de la semana ni ejercicio anterior, y que no son transparentes. Ejemplos:
  - semana 1: «Tenemos un perro y un gato» → *cachorro*
  - semana 3: *geladeira*, *chaves*, *porta*, *vizinhos*
  - semana 5: *feijão*, *sozinha*, *garçom*
  - semana 6: *suco*, *churrasco*
  - semana 8: *crianças*, *brincando*
- **Gramática.** 12 oraciones piden posesivos antes de la semana 10 (*A minha mãe é professora*, semana 3; *As minhas mãos estão frias*, semana 4). Otras usan gerundio antes de la semana 8 (*Está fazendo trinta graus*, semana 7; *sobe a escada correndo*, semana 6).
- **Errores.** En «Ache o erro», 23 oraciones con posesivos, *estão dormindo* (semana 3) y *não se preocupe* (semana 3) aparecen en semanas anteriores a su gramática.

**Por qué.** `build_bank.py` asigna `w` solo según los tiempos verbales
(`sillabo.py`), no según el vocabulario ni según posesivos, contracciones o
clíticos.

**Qué cambiar.**
- Extender `sillabo.tense_weeks` con rasgos no verbales: posesivos → 10, demostrativos contraídos → 10, *dele/dela* → 10, clíticos → 16, *pra/tá/tô* → 8-9, *né/cadê* → 38. Tomar `w = max(tiempos, rasgos)`.
- Para el vocabulario, que `w` sea la primera semana en que la palabra aparece en una lección o en las palabras de la semana. Si no aparece, glosarla en la consigna en español: «Tenemos un perro (*cachorro*) y un gato». Producir una palabra exige haberla visto antes (Nation 2013).

### B4. Lo que se lee en las semanas 1-3 usa contracciones y presente regular sin glosa · MEDIA · esfuerzo M

**Qué pasa.**
- **Duelo ser/estar (semana 1).** 13 de sus 20 ítems usan cosas de semanas posteriores: *moro no Rio*, *num hospital*, *às três, na sala*, *do meu avô*, *pode esquentar?*, *dá para nadar*, *vamos comer?*, *fica em casa*.
- **Lecturas de la semana 1.**
  - *Chegada ao Rio*: *no Rio*, *na janela*, *Da janela*, *minha colega*.
  - *Olá, Rio!*: *estou no Rio*, *na praia*, *para mim*.

  Las glosas (`gloss`) cubren palabras de contenido (*bairro, janela*) pero no las contracciones.
- **Entender · contrações (semana 3).** 9 de 13 ítems usan presente regular (*Moro no Leblon, Venho do Leblon, Passo pelo Leblon*), que se enseña en la semana 5.
- **Modelos de escritura.** Semana 2: *do meu pai*; semana 4: *o cabelo dela*.

**Qué cambiar.**
- Reescribir los 13 ítems del duelo con *ser/estar/ter* y vocabulario de la semana 1.
- En `letture_data.js` y `letture_settimana.js`, agregar glosas gramaticales: `"no": "en el (em + o; semana 3)"`, `"da": "de la (de + a)"`, `"minha": "mi"`.
- En el núcleo (`letture.js`), un glosario automático que, al tocar una contracción, muestre `LANG.rules.banca.contr` (ya lo usa el desglose).

### B5. El duelo ser/estar no toca el contraste real · MEDIA · esfuerzo S

**Qué pasa.** Los 20 ítems (`duelli_data.js`, `serestar`) son usos iguales al
español (origen, profesión, estados). Falta el contraste que hace tropezar al
rioplatense: la **ubicación de lo fijo va con *ser* o *ficar***: *O apartamento
é em Botafogo*, *a padaria é ao lado*, *onde fica o metrô?*. La lectura de la
semana 1 lo usa («É em Botafogo»; «O apartamento é em Santa Teresa») sin
explicarlo. La advertencia llega recién en la semana 3 (bloque 6).

**Qué cambiar.**
- Agregar 4-6 ítems de ubicación fija contra ubicación de personas: *O Cristo ___ no Corcovado* (é / está, con el matiz *fica*), *A Bia ___ no Corcovado agora*.
- Un bloque o una advertencia de una línea en la lección 1 (`tools/pt/lessons/s1.py`, bloque 7): «¿Dónde queda algo fijo? *ser* o *ficar*: *o apartamento é / fica em Botafogo*».

### B6. Falsos amigos gramaticales sin advertencia temprana · MEDIA · esfuerzo S

- La lección de la semana 3 advierte que *da* no es del verbo *dar*, pero **no advierte que *no* (em + o) no es la negación española**. Para un hispanohablante es la confusión número uno al leer *Estou no Rio*. Agregar una advertencia en el bloque 2 de la semana 3: «*no* = en el. La negación es *não*».
- La negación básica *não* + verbo solo aparece en notas de ítems (s1-01-46) y la teoría la trata recién en la semana 20. Hace falta una línea en la lección 1 o 2.

### B7. Errores de contenido en los sonidos · MEDIA · esfuerzo S

- `asc-pt-1-07` y el par `p-...`: *sim / si*. *si* no es una palabra del portugués (se dice *se*), y la cabecera de `ascolto.py` promete que «todas las opciones son palabras que existen». Cambiar por *sim / sem* o *sim / si-* de *sítio*, o sacarlo.
- `asc-pt-1-13`: «já (ya) con la «ll» rioplatense, sonora». Para buena parte de los porteños jóvenes esa «ll» es sorda [ʃ] (*sheísmo*), o sea igual a la *ch* de *chá*, y la nota los confunde. Mejor: «*já* suena como la «y» de *yo* en un rioplatense que la hace zumbar, sonora; *chá*, como la «sh» de *show*, sorda».
- Pares de una sola letra con TTS (*é / e*, *só / sou*): la voz del teléfono lee «e» aislada como el nombre de la letra, [ɛ]. Conviene hacerlos en frase: *Ela é daqui / Ela e daqui*, o marcarlos solo para audio grabado.

### B8. Detalles de progresión · BAJA · esfuerzo S

- Semana 5: `s1-05-11` ofrece *acordo / me acordo / acordo-me* antes de los reflexivos (semana 12) y los clíticos (16). Semana 12: la palabra de la semana *machucar* trae de ejemplo *não se machuque* (subjuntivo, semana 23).
- Semana 1: los *garden path* `s1-01-41` (*año → ano*) y `s1-01-42` (*mitad → metade*) son excepciones sin regla, y el patrón -dad → -dade lo presenta Ponte en la semana 3. Moverlos a la semana 3 o después de Ponte.
- `rules.js` `sceneWeek` (l. 387) es una tabla de respaldo que mezcla ids italianos (*ciao, tavola, negozi*) y no coincide con `scene.week` (*boteco* 4 contra 3, *trabalho* 7 contra 5). No se usa porque las escenas traen `week`, pero confunde a quien edita: limpiarla o borrarla.

---

## Lo que está bien y conviene no romper

- Las notas escritas a mano de los ítems son buenas y casi siempre dan la regla: ningún ítem sin nota, y los *garden path* (144) explican la trampa con criterio.
- El corrector de escritura libre marca bien la interferencia (*Yo, llamo, em a, muy, es*) con mensajes cortos.
- El diagnóstico explica de forma específica 988 de 1.378 distractores de `choice` (72 %). Solo 14 quedan sin nada.
- Los *fixerr* son consistentes: en 199 de 199, reemplazar `bad` por `good` da la respuesta.
- No encontré ortografía anterior al Acuerdo de 1990 fuera de la lista de errores de `diagnosi.js`.

## Esfuerzo total aproximado

| Grupo | Esfuerzo |
|---|---|
| Arreglos de núcleo (A1, A2, A5, A9, A10) | ~1,5 días |
| Desglose (A3) | ~1 día |
| Generador de chequeos de la lección (A4) | 1-2 días |
| Opción más larga (A6), sobre todo reescribir distractores de lecturas y «Descubrí la regla» | 2-3 días |
| Portugués: B2, B5, B6, B7 | medio día |
| Portugués: B1, B3, B4, con el analizador de rasgos en `sillabo.py` compartido por banco, frases y lecturas | 2-3 días |
