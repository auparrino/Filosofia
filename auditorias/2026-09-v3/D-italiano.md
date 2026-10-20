# Auditoría de contenido didáctico, italiano v2.8: qué falta para un 3.0

Rama `main` en v2.8 (merge del PR #55, `4a70be0`). Solo lectura: no se tocó ningún archivo del
repo. Los scripts y las salidas están en el scratchpad de esta sesión (lista al final).

**Cómo se hizo.** (1) Se leyó entero `README-italiano.md`, las dos auditorías de septiembre
y los mensajes de los commits de la «revisión didáctica» y la «segunda pasada»
(`6c96b05`, `5ae7251`, `81a690c`, `1f38a3e`, `65e72e5`), y se corrieron los chequeos del repo
(`check_lessons.py --estilo`, `check_letture.py`, `sillabo.py`). (2) Se cargó todo el paquete
italiano en node con `tools/lib/pack.js` y se volcó a JSON (`dump.js`): frases, laboratorio,
lecturas, dictogloss, tramo C1, examen, duelos, variaciones, escritos. (3) Con
`course.json`, `bank.json` y `frequenza.json` se armó un mapa semana por semana (`map.py`:
teoría, ítems, vocabulario, escena, lectura, dictogloss, Scrivi, tramo) y se midió la
cobertura léxica por nivel KELLY, por semana y por estación (`lex.py`). (4) Se sacó una
muestra al azar con semilla fija (`sample.py`, semilla 20260927, estratificada por tipo) de
**150 unidades** entre 11.116 posibles: 22 bloques de teoría, 38 ítems, 24 oraciones y
errores del banco, 12 frases, 12 palabras de la semana, 8 glosas, 15 textos (settimana,
episodios, dictogloss), 15 unidades del tramo (lectura, escucha, tarea) y 6 notas del
banco. Se leyeron las 150 y se juzgó cada una con seis criterios (italiano, castellano
rioplatense, contraste, ejemplo, metalenguaje, consigna). (5) Se compararon los módulos entre
sí: glosas de la misma palabra en distintas fuentes, bloques repetidos en dos semanas,
terminología de las consignas.

Las cifras son de esas mediciones. Donde dependen de una heurística propia (lematización con
`frequenza.json`, sin diccionario de cognados), se aclara. **Fuera de alcance, a pedido:**
ejercicios que usen la voz del alumno.

**Referentes usados.** *Profilo della lingua italiana* (Spinelli & Parizzi 2010: funciones,
nociones, gramática y léxico por nivel A1-B2, más las orientaciones C1 del *Quadro*); los
sílabos y formatos de CILS TRE-C1, CELI 4 y PLIDA C1; la secuencia de adquisición del
Progetto di Pavia (Giacalone Ramat 2003: presente → (aux) participio → imperfetto → futuro →
condizionale → congiuntivo); Nation (2006, 2013) para el tamaño del léxico. No se consultaron
en línea: se usaron de memoria y por eso se citan como orientación, no como cita textual.

---

## Resumen: lo que justifica un 3.0

| # | Prioridad | Qué | Evidencia | Esfuerzo |
|---|---|---|---|---|
| 1 | Alta · léxico | El curso **enseña explícitamente 1.960 lemas** en el año (711 como «palabras de la semana»); un C1 necesita 4.000-5.000 familias. Al final del año se vieron el 39 % de los lemas C1 y el 47 % de los B2 de KELLY, y **1.564 lemas aparecen solo en lecturas**, nunca se enseñan ni se practican | `lex.py`; sección D2 | L |
| 2 | Alta · léxico | **Desierto léxico en la segunda estación**: las semanas 14-26 suman de mediana 9 lemas nuevos explícitos por semana (la 13: 2; la 16: 2; la 26: 4), contra 41 en la primera y 17-18 en las últimas. Justo cuando el alumno pasa a B1 | `lex.py`, tabla por semana | M |
| 3 | Alta · C1 | **Los ejercicios de las semanas 40-51 no son de C1**: 1.231 ítems, 36 % traducción y 41 % huecos de oración suelta; en 9 de 12 semanas más de la mitad tiene gramática mínima de la semana 13 o anterior (semana 50: 88 %; 42: 84 %; 43: 91 %). Transformación, nominalización, registro y coherencia existen casi solo en el examen (28 + 20 + 32 ítems) | `map.py`, sección D4 | M |
| 4 | Alta · pragmática | **No hay pragmática explícita**: 40 de 358 frases llevan una nota de registro; ninguna lección enseña actos de habla (quejarse, rechazar, atenuar, interrumpir, ironía); la escena *Discutere e argomentare* llega en la 44 con 16 frases. PROPUESTAS 5 sigue pendiente | `sample.py`, grep; D1 | S-M |
| 5 | Media · géneros | Recepción sin **habla espontánea ni monólogo**: las 24 escuchas largas son diálogos guionados (0 «boh», 0 «vabbè», 18 «cioè» en 10.000 palabras; turno mediano de 22 palabras). Faltan notiziario, avisos e instrucciones, formularios, chat y mensajes, texto con gráfico, prosa literaria real | `itdata.json`; D1.4 | M |
| 6 | Media · examen | El examen final sigue con las **preguntas de escucha en castellano**, dos escuchas de ~320 palabras, una sola versión y sin *riordino*; la escritura pide 200 + 120 palabras (CILS: ~250-300 + 150-200) | `esame_data.js`; D4.3 | M |
| 7 | Media · consistencia | **229 palabras glosadas distinto según el módulo** (de 1.557 glosadas en dos o más fuentes): *entro* = «entrar», *battuta* = «golpear», *fumo* = «fumar», *presa* = «agarrar» en `glossario.json`; «subjuntivo» en 146 consignas y «congiuntivo» en 205; cuatro bloques enseñados dos veces (molto, posesivos, stare + gerundio, conjunciones) | script de glosas; D3.3 | S-M |
| 8 | Media · consignas | Las consignas de grupo del *Soluzioni* quedan pegadas en cada subítem («Traducí usando al menos una vez cada verbo: alzarsi, bere, dire…» sobre una sola oración; «¿En qué oraciones…?» con dos opciones). En la muestra, 3 de 20 ítems `sfida` | `sample.txt` [45] [48] [50]; D3.2 | S |

**Lo que no cambia el veredicto.** El italiano es correcto y natural en las 150 unidades de la
muestra (0 errores de lengua), el castellano es rioplatense en 150 de 150, la secuencia
gramatical sigue al Progetto di Pavia y cubre lo que el *Profilo* pide para B2 y las
orientaciones C1, y el tramo C1 (lecturas de 385-900 palabras, escuchas a dos voces, tareas
de género) es de calidad de examen. El salto a 3.0 no es de corrección: es de **léxico,
pragmática, géneros y tipo de ejercicio**.

---

## Lo que ya está bien (y conviene no tocar)

- **La secuencia gramatical.** Presente (5-6) → passato prossimo (11) → imperfetto (15) →
  futuro (19) → condizionale (20) → congiuntivo (24): es la secuencia de Pavia, y los duelos
  (essere/avere en la 11, PP/imperfetto en la 15, indicativo/congiuntivo en la 25) llegan
  cuando las dos formas ya existen. Las 52 semanas cubren toda la gramática que el *Profilo*
  pone en B2 (congiuntivo imperfetto y trapassato, concordanza, periodo ipotetico, relativi
  con *cui* e *il quale*, passivo con *venire* y *andare*, si passivante, discorso indiretto,
  forme implicite) y las construcciones C1 que piden CILS y PLIDA (causativo, percezione,
  dislocazioni, frase scissa, participio assoluto, alterazione, connettivi testuali,
  nominalizzazione).
- **La revisión didáctica se hizo de verdad.** `check_lessons.py --estilo` deja 5 avisos (reglas
  de 24-28 palabras en las semanas 3, 4, 12, 25 y 47); `check_letture.py` da 0 problemas en los
  52 textos de *La settimana*; `sillabo.py` reubica 460 ejercicios que esperan a su teoría, y
  `MIN_WEEK` corrige a mano lo que el detector no ve. Los 337 glosarios nuevos del dictogloss y
  de los modelos del tramo están y marcan la semana de lo que se adelanta («da + persona = a lo
  de; se ve en la semana 9»).
- **Las lecciones explican con contraste.** En los 22 bloques de la muestra, 19 tienen un
  *warn* o un *tip* que apunta al hispanohablante y acierta: «Con *da', di', fa'* la consonante
  se duplica: *dammelo*; con *gli*, no: *diglielo*» (s22 b4); «El rioplatense hace lo mismo
  (“el pan lo compro yo”): te sale gratis» (s48 b0); «*Qual è* va sin apóstrofo: es un
  truncamiento» (s8 b3); «*Marco piace* = Marco le gusta a la gente» (s14 b0). No hay
  metalenguaje sin presentar: cada término aparece en la semana que lo enseña.
- **El tramo C1** (`tools/it/tramo/w27-51.json`). Lecturas de 385 a 902 palabras en once
  géneros reales (reportage, editoriale, recensione, racconto, intervista, rubrica, saggio
  breve, cronaca, inchiesta, divulgativo, cronaca economica); escuchas de 281 a 574 palabras
  en nueve formatos (intervista, podcast, dibattito, conversazione in redazione, conferenza
  con domande, riunione, consulenza radiofonica); tareas de ocho géneros con consigna en
  italiano, fuente obligatoria y modelo. **106 de las 240 preguntas** de lectura y escucha son
  inferenciales («Perché la sociologa risponde “Sembra, appunto”?», «Qual è l'atteggiamento
  di Elena verso Marco?»), y los *vero / falso / non si dice* tienen 31 «non si dice» sobre
  120. Es el formato CILS.
- **Las 20 palabras por semana de la 27 a la 51** (`parole_c1.py`): cada una con ejemplo del
  texto de la semana y una nota de uso que dice régimen, auxiliar, colocaciones y falso amigo
  («*pensionato*: falso amigo, no es alojamiento; *andare in pensione* = jubilarse»). Es el
  modelo a copiar para las semanas 14-26.
- **El banco.** Las 24 oraciones y errores de la muestra son correctos y sus notas explican la
  regla, no solo la equivalencia («Costare va con essere; lo mismo durare, bastare, sembrare,
  piacere»). Las 78 oraciones C1 son de verdad C1 («Per quanto si sforzi, non sarà mai
  soddisfatto», «Lungi dal risolversi, il conflitto si aggravò»).
- **Estado de lo pendiente en las auditorías anteriores** (italiano): «Adiviná» con otra frase
  como opción, «boh» con regla inventada, oraciones del banco antes de su gramática y
  chequeos sobre la columna Ejemplo siguen en 0 (no se volvieron a medir en detalle: los
  scripts de esta auditoría no lo contradicen). **Sigue abierto:** la semana 3 con 17 bloques;
  el glosario con un solo significado (B5), que acá reaparece agravado (D3.3); *gli* explicado
  de dos maneras (lección 1: «casi “li” rápida»; `ascolto_data.js` p-059: «no como “li”»); las
  propuestas 5 (pragmática) y 9 (input fuera de la app) de `PROPUESTAS.md`.

---

## D1. El sílabo frente a los referentes

### D1.1 Lo que está en su lugar

| Referente | Qué pide | Dónde está en el curso |
|---|---|---|
| Pavia | presente → PP → imperfetto → futuro → condizionale → congiuntivo | semanas 5, 11, 15, 19, 20, 24 |
| *Profilo* B1 | narrar en pasado, planes, cortesía, opinión simple, *ne/ci*, combinados, comparativos | 14-26 |
| *Profilo* B2 | congiuntivo imperfetto/trapassato, concordanza, hipótesis 2-3, relativos, pasiva, *si*, indirecto, remoto para leer | 29-38 |
| C1 (CILS/PLIDA) | causativo, percezione, reggenze, forme implicite, pronominali, alterazione, dislocazioni, coesione, registro | 40-50 |
| CILS *Analisi delle strutture* | cloze su testo, trasformazioni, formazione di parole, registro | semana 52 (`esame_c1.py`, 133 ítems) |

### D1.2 Lo que llega tarde o está de más

- **Los actos de habla de B1-B2 no tienen lección.** El *Profilo* lista para B1-B2 quejarse,
  reclamar, rechazar una invitación con excusa, disculparse, pedir aclaraciones,
  interrumpir, expresar acuerdo parcial, atenuar un pedido, cambiar de tema. En el curso están
  solo como frases sueltas: 40 de las 358 frases llevan una nota de registro (formal /
  coloquial / *Lei* / cortesía), y ninguna lección de las 52 tiene un bloque sobre cómo se
  pide, se rechaza o se atenúa. Lo más cercano: la escena *Discutere e argomentare* (semana 44,
  16 frases) y *Scrivere una mail* (42, 16). Un alumno de B2 (semana 30) no tiene todavía
  ninguna herramienta explícita para un desacuerdo cortés.
- **La semana 50 («Lessico avanzato») es, en los hechos, una semana de preposiciones A2.**
  Tiene 179 ítems, el 88 % con gramática mínima de la semana 13 o anterior: 123 ítems con
  `wk ≤ 9`, entre ellos 28 de «¿Adónde vas? / ¿Dónde se encuentran? Completá con a, da o in»
  (`s:r15-06`, `s:r15-07`) y los 15 «¿Qué significa *salire / aceto / guardare*?» de
  `b2_lessico.py`, que son de A2-B1. El título promete colocaciones y registro; la lección sí
  los trae (bloques 3 y 4), pero los ejercicios no.
- **Las colocaciones y los marcadores están todos antes de la semana 34.** Los 98 ítems de
  verbo soporte y los 60 de marcadores discursivos de `lessico2.py` caen en las semanas 5-34
  (59 de los 158 en las semanas 5 y 6). En las semanas 40-51 hay **0** ítems de colocación y 0 de
  marcadores; el léxico C1 no se practica como ítem, solo como palabra de la semana.
- **La semana 3 sigue con 17 bloques y 109 ítems** (B8 de la auditoría anterior): artículos,
  apóstrofo, posesivos, países, preposiciones articuladas, partitivo, *qualche*, *nessun*. Las
  semanas 4 y 5 tienen 6 y 4 bloques. Los posesivos se vuelven a enseñar enteros en la 17 y el
  partitivo en la 47.
- **Repeticiones sin marca de repaso.** Cuatro bloques se enseñan dos veces con el mismo
  contenido y hasta los mismos ejemplos: *molto* (semana 4 b5 y 17 b4: «Ho molti amici» en las
  dos), posesivos (3 b8 y 17 b1: tabla completa en las dos), *stare + gerundio* (6 b5 y 44 b3),
  conjunciones con congiuntivo (28 b4 y 49 b1: seis filas iguales). Son coherentes entre sí,
  pero un alumno que ya lo sabe lee la lección entera de nuevo. Convendría que la segunda vez
  sea un bloque «Ya lo viste en la semana N» de dos ejemplos y un chequeo.
- **La modalidad epistémica y las perífrasis aspectuales están dispersas.** El futuro de
  probabilidad (19), *dovrebbe / potrebbe* para suponer (20, en un *more*), *può darsi che* (25),
  *stare per* (6, en un *more*, y 45), *finire per / non fare che / avere un bel* (45). El
  *Profilo* B2 y las pruebas C1 piden tener el sistema entero (*sarà, dovrebbe, potrebbe,
  avrà avuto, dovrebbe aver*): hoy no hay un bloque que lo junte.
- **La semana 48 dice «neostandard» en el tema y enseña solo dislocaciones.** El *Sai fare*
  promete «manejar el italiano neostandard hablado; variedades sociales y geográficas», la
  lectura larga y la escucha lo tratan (dialetto, Nord/Sud), pero la lección no tiene ni una
  línea sobre *che* polivalente, *gli* por *le*, *lui/lei* sujeto, indicativo por congiuntivo,
  *a me mi*, *ci ho*, *tenere* por *avere* en el sur, *stare* por *essere*. Un C1 tiene que
  reconocerlos en la escucha.
- **Los siglos, las fracciones y las medidas (47) llegan a C1** cuando el *Profilo* los pone en
  B1-B2, y los numerales del mostrador (*due etti*) son A2. La semana entera tiene 25 ítems,
  18 de nivel B1 declarado. Es la semana más liviana del tramo final.

### D1.3 Campos léxicos: lo que falta

El `tema` de `SAI_FARE` cubre bar, ciudad, familia, trabajo, viajes, compras, comida, salud
(A2: farmacia), deporte y hobbies (14), ecología e instituciones (35), historia (37), prensa
(30), economía (47), ciencia (43-44), burocracia (40, 42, 48), literatura (50), humor (45),
variedades (48). Los lemas B2/C1 de KELLY que **nunca aparecen en ningún módulo** dibujan los
campos ausentes (ejemplos ordenados por frecuencia en itWaC):

| Campo | Lemas B2-C1 nunca vistos |
|---|---|
| Derecho y justicia | *magistratura, magistrato, imputato, giurisdizione, deroga, abrogare, sentenza, procedimento, sopprimere* |
| Fisco y finanzas personales | *retribuzione, versamento, previdenza, aliquota, ammontare, patrimoniale, punteggio* |
| Salud y sistema sanitario | *farmaco, gravidanza, disabile, handicap, coniuge, detenuto* |
| Deporte | *atleta, atletico, gol, giocatore, concorrente* |
| Religión, sociedad plural | *musulmano, laico, diocesi, extracomunitario, richiedente (asilo), immigrato* |
| Tecnología digital | *digitale, elettronico, impostare, variabile, standard, test* |
| Política internacional | *palestinese, israeliano, iracheno, socialista, globalizzazione* |

El sistema sanitario, la escuela, el trabajo formal (contrato, nómina) y la justicia son
campos habituales de los textos del CILS C1. Hoy la única semana con léxico de salud es la
12 (farmacia, A2).

### D1.4 Géneros textuales: recepción

**Lo que hay** (tramo, semanas 27-51): reportage ×3, editoriale ×3, recensione, racconto ×2,
intervista, resoconto, rubrica ×3, articolo d'opinione / di costume / di cronaca /
divulgativo / economico / di approfondimento, saggio breve ×2, inchiesta. Escucha:
intervista radiofonica ×5, podcast ×5, dibattito, conversazione (redazione, colleghi,
amiche) ×5, conferenza con domande ×3, riunione, consulenza radiofonica ×3. Más los 52
textos cortos de *La settimana* (narrativo-expositivos), 13 episodios de Martín y 10 de
Cultura.

**Lo que falta, por prueba de examen:**

- *Ascolto* CILS/CELI C1: **monólogos informativos** (notiziario, previsioni, annuncio in
  stazione, messaggio in segreteria, istruzioni), **tres o más voces** y **habla espontánea**.
  Las 24 escuchas son diálogos de dos voces, guionados: en 10.002 palabras hay 33 *allora*,
  18 *cioè*, 17 *ecco*, 16 *diciamo*, 7 *mah*, 3 *beh*, **0 *boh*, 0 *vabbè*, 0 *praticamente*,
  0 *mica***. El turno mediano tiene 22 palabras y el más largo 89: son párrafos escritos
  leídos por TTS, no conversación (sin falsos arranques, reformulaciones, superposiciones ni
  respuestas mínimas). Está bien como escalón; no prepara para la radio real.
- *Lettura*: **testo con dati** (tabla o gráfico más texto, que CILS y CELI usan), **avvisi,
  regolamenti, moduli e istruzioni** (la burocracia se tematiza en 40, 42 y 48, pero nunca se
  lee un formulario o una comunicación oficial auténtica: la lectura de la 42 es un ensayo
  *sobre* el burocratese), **pubblicità / annunci** (affitti, lavoro), **chat, messaggi vocali,
  post** (la única «e-mail informale» es una tarea, no una lectura), **prosa literaria real**
  (los textos de Cultura hablan *de* Calvino, Levi y Ginzburg; el único racconto es propio; hay
  autores de dominio público: Pirandello, Svevo, Deledda, Verga, Collodi, De Amicis).
- *La settimana* (52 textos): las **156 preguntas están en castellano** y son literales («¿Qué
  animales tiene el señor Bruno?»); solo los *vero / falso / non si dice* están en italiano.
  Desde la semana 27 conviven con las preguntas inferenciales en italiano del tramo: dos
  formatos para el mismo alumno la misma semana.

### D1.5 Equilibrio

| Estación | Bloques de teoría | Ítems | De los cuales léxico o pragmática | Palabras nuevas explícitas / semana (mediana) |
|---|---|---|---|---|
| 1-13 | 86 | 1.698 | 46 ortografía + 59 colocaciones | 41 |
| 14-26 | 66 | 1.232 | 45 colocaciones/marcadores | 9 |
| 27-39 | 61 | 980 | 13 marcadores + 25 adverbios | 17 |
| 40-52 | 66 | 2.864 | 26 sufijos + 15 falsos amigos | 18 |

Por `topic`, de los 3.716 ítems: gramática ≈ 3.300; léxico (collocazioni 98, discorsivi 60,
suffissi 26, falsi amici 10, espressioni 5) ≈ 200 (5 %); pragmática explícita 0; géneros
(tareas del tramo) 24. La relación gramática : léxico : pragmática : géneros es de
**≈ 90 : 5 : 0 : 1** en los ejercicios. En la teoría es parecida: de 279 bloques, unos 15 son de
léxico (adverbios, marcadores, colocaciones, sufijos, registro) y ninguno de pragmática.

---

## D2. Léxico: cuánto se enseña, cuánto se ve, dónde hay desierto

### D2.1 Cómo se midió

`lex.py` toma `frequenza.json` (17.206 lemas con entrada; **4.969 con nivel KELLY**: A1 952,
A2 981, B1 957, B2 996, C1 953, C2 130) y lematiza cada palabra del curso con la tabla
`forme` (17.931 formas) más una regla para clíticos pegados. Cuenta cuatro capas, cada una con
la semana en que aparece:

1. **explícito**: palabras de la semana (`weeks[].vocab`), frases de las escenas y lo que la
   lección muestra (ejemplos, tablas, formas marcadas);
2. **+ ejercicios**: enunciado y respuesta de los ítems de la semana;
3. **+ banco**: las 864 oraciones, por su `w`;
4. **todo**: además, *La settimana*, los episodios, el dictogloss, las lecturas, escuchas y
   modelos del tramo y el examen.

Dos límites que hay que tener en cuenta al leer los números: (a) los niveles de KELLY vienen
de un corpus web con mucho texto administrativo (*comma, decreto, legislativo* figuran como
A1; *kg* y *g* como C1), así que «A1 nunca visto» no siempre es un hueco real; (b) no se
descontaron los cognados (`lessico.py` lo hace con un diccionario hunspell que en este
entorno no está: `spanish()` devuelve `False`), y para un hispanohablante buena parte del
B2-C1 de KELLY es transparente (*amministrazione, responsabilità, comunicazione*). Las
cifras de «no visto» son por eso un techo, no un piso.

### D2.2 Cobertura por nivel al cierre de cada estación

Lemas KELLY del nivel ya vistos (sobre el total del nivel):

| Semana | Capa | A1 (952) | A2 (981) | B1 (957) | B2 (996) | C1 (953) | Total lemas distintos |
|---|---|---|---|---|---|---|---|
| 13 | explícito | 305 (32 %) | 129 (13 %) | 91 | 54 | 45 | 860 |
| 13 | todo | 460 (48 %) | 255 (26 %) | 169 (18 %) | 122 (12 %) | 98 (10 %) | 1.562 |
| 26 | explícito | 368 (39 %) | 173 (18 %) | 107 (11 %) | 72 | 64 | 1.098 |
| 26 | todo | 562 (59 %) | 336 (34 %) | 218 (23 %) | 182 (18 %) | 146 (15 %) | 2.116 |
| 39 | explícito | 439 (46 %) | 225 (23 %) | 153 (16 %) | 130 (13 %) | 102 (11 %) | 1.476 |
| 39 | todo | 753 (79 %) | 517 (53 %) | 382 (40 %) | 306 (31 %) | 255 (27 %) | 3.279 |
| 52 | explícito | 515 (54 %) | 307 (31 %) | 196 (20 %) | 192 (19 %) | 152 (16 %) | **1.960** |
| 52 | + ejercicios | 639 | 453 | 304 | 281 | 221 | 2.845 |
| 52 | + banco | 671 | 478 | 328 | 308 | 235 | 3.042 |
| 52 | todo | 858 (90 %) | 715 (73 %) | 556 (58 %) | 467 (47 %) | 375 (39 %) | **4.606** |

Lectura: **lo que el curso enseña y hace practicar llega a unos 3.000 lemas; lo que el alumno
ve alguna vez, a 4.600**. De los 4.969 lemas con nivel, 3.029 aparecen al menos una vez. Un C1
necesita conocer 4.000-5.000 familias (Nation 2006 para el 98 % de cobertura de textos no
técnicos; De Mauro: las 7.000 del *vocabolario di base* para leer la prensa). El curso queda
en la mitad si se cuenta lo enseñado, y en el borde si se cuenta cada exposición única, que
no es conocimiento (una palabra necesita 6-10 encuentros; Webb 2007).

- **Solo palabras de la semana**: 711 lemas en todo el año (147 A1, 101 A2, 71 B1, 110 B2,
  96 C1). Es la única capa con presentación, ejemplo, nota y repaso espaciado.
- **Solo frases**: 533 lemas, el 46 % de A1.
- **Solo lecturas y escuchas**: 3.687 lemas, y **1.564 no aparecen en ninguna otra capa**
  (187 A1, 237 A2, 228 B1, 159 B2, 140 C1). Son las glosas de opción múltiple y las glosas
  simples: se leen una vez y no vuelven.

### D2.3 Por semana: el desierto de la segunda estación

Lemas nuevos (no vistos antes en ninguna capa), por semana:

| Semanas | Palabras de la semana (media) | Nuevos explícitos (media / mediana) | Nuevos solo en lecturas (media) |
|---|---|---|---|
| 1-13 | 10,9 | 48,8 / 41 | 14 |
| **14-26** | **8,9** | **10,5 / 9** | 9 |
| 27-39 | 18,0 | 17,7 / 17 | 58 |
| 40-52 | 17,2 | 19,7 / 18 | 72 |

Las semanas con menos de 10 lemas nuevos explícitos: 8 (13), 10 (15), 13 (2), 14 (8), 15 (10),
16 (2), 20 (7), 21 (7), 22 (10), 24 (8), 25 (9), 26 (4). La 16 tiene 4 palabras de la semana, la
24 tiene 4 y la 25 tiene 5. Es el tramo A2 → B1, donde la meta trimestral del README dice 1.800
palabras: con 9 por semana se llega a unas 120 en la estación.

En las semanas 27-52 pasa lo contrario: 58-72 lemas nuevos por semana solo en lecturas (135 en
la 35, 123 en la 49, 118 en la 44), contra 18-20 enseñados. Lo que `check_letture.py` informa
como cobertura del 79-91 % en las lecturas largas (l-49: 79 %; l-44: 82 %; l-42: 84 %) es en
parte cognados, pero confirma que el alumno lee esos textos con 40-80 palabras que no conoce
y que el curso no retoma.

### D2.4 Colocaciones, fraseología, formación, registro, variación, medios

- **Colocaciones.** 98 ítems de verbo soporte (*fare colazione, dare un esame*) en las semanas
  5-12, más *fare* y *dare* en dos *more* de la semana 6. Las colocaciones de C1 aparecen en los
  textos (*prendere una decisione* 6 veces, *tenere conto* 5, *mettere in discussione* 5,
  *rendersi conto* 4) y en las notas de `parole_c1.py` («*alzare / abbassare la serranda*»,
  «*leggere, ascoltare, valutare attentamente*»), pero **no hay ítems que las pidan** ni una
  lista por campo (verbo + sustantivo abstracto: *trarre conclusioni, nutrire dubbi, porre una
  domanda, svolgere un ruolo, avanzare una proposta, sollevare obiezioni*). Esto es lo que
  separa un texto B2 de uno C1 en la rúbrica *lessico* del examen.
- **Fraseología.** Bien: 14 pronominales idiomáticos (45 b0), 8 perífrasis (45 b4), marcadores
  (27 b5, 60 ítems), 21 frases hechas de las escenas C1. Falta: modismos y *modi di dire* con
  imagen (*in bocca al lupo, prendere due piccioni, essere al verde, acqua in bocca*), que el
  tema de la 45 promete («Modi di dire, humor e ironía») y la lección no trae.
- **Formación de palabras.** Semana 46: alteración (4 bloques) y un bloque de prefijos; 32 ítems
  de formación en el examen (*efficace → efficacia, sicuro → sicurezza, libero → libertà*); las
  9 reglas del Ponte (2-10) enseñan los sufijos cognados desde el castellano. No hay derivación
  productiva como práctica semanal (*-zione / -mento / -ezza / -ità / -anza / -tore / -aio /
  -abile / -oso*), que es la prueba de léxico del CILS y la forma más barata de multiplicar el
  vocabulario que ya se tiene.
- **Registro.** Un bloque (50 b3: siete filas *un sacco di / molto / notevolmente*), las
  fórmulas impersonales de la 49, el condicional de prensa (20, 31) y 44 ítems que nombran el
  registro, 25 de ellos en el examen. No hay práctica de reescritura de registro fuera del
  examen (20 ítems de opción).
- **Variación regional.** Cuatro menciones en las lecciones (20: «*se avrei* regional»; 36: *si*
  toscano; 37: norte/sur y el remoto; 48: tema) y dos textos del tramo (48: *Il dialetto*;
  *Stare o essere? Nord e Sud*). No hay bloque de geografía lingüística ni de italiano
  neostandard (ver D1.2). Las voces son TTS: no hay acentos regionales en ninguna escucha
  (limitación aceptada; Common Voice tiene hablantes de todo el país y hoy solo se usa en el
  dictado).
- **Lenguaje de los medios.** Condicional de dissociazione (20 b2, 31 b3), *Il video
  dell'incendio* (30), cronaca (41), *Difendersi dai numeri* (47). Falta lo que el CILS pide en
  lectura de prensa: titoli nominali y elípticos («Sciopero, treni a rischio»), sigle (*Inps,
  Istat, Asl, Cgil*), *virgolettato*, el orden noticia-fuente, y el léxico de la política
  italiana (*maggioranza, decreto, emendamento, sindacato*: los tres últimos, «nunca vistos»).

---

## D3. Calidad de lengua y de didáctica (muestra de 150)

### D3.1 Tasas

| Criterio | Unidades juzgadas | Con problema | Tasa |
|---|---|---|---|
| Italiano correcto y natural | 150 | 0 | 0 % |
| Castellano rioplatense correcto | 150 | 0 | 0 % (en todo el corpus, 1 nota con «tú / vosotros»: `refuerzo.py:808`) |
| Contraste útil con el castellano (bloques, notas, frases, palabras) | 62 | 4 sin contraste (s26 b3, d15-020, d03-055, glosa *portata*) | 6 % |
| Ejemplo que muestra la regla | 62 | 1 (palabra *lieti*, semana 25: forma flexionada y ejemplo «Che voi siate molto lieti!») | 2 % |
| Metalenguaje sin presentar | 150 | 0 (el único caso dudoso, «passivante / impersonale» en s:r26-02b, es de la semana que lo enseña) | 0 % |
| Consigna clara y adaptada al ítem | 38 ítems | 4 (ver D3.2) | 11 % (3 de 20 `sfida`) |
| Nota que solo da la equivalencia | 38 ítems | 2 (d15-020 «*già* = ya», d03-055 «También le nozze») | 5 % |
| Enunciado castellano artificial (traducción del inglés de *Dummies*) | 38 | 1 (d18-025 «Ustedes van a saber estudiar») | 3 % |

Ortografía italiana en todo el contenido (grep de *qual'è, perchè, un pò, sè, sù, fà, e'*): solo
aparecen como trampas o errores a corregir (`errori_banca.py:666, 681`; `refuerzo.py:77, 90`;
`grammatica2.py:1879`) y en las tildes didácticas de `ascolto_data.js` (*sùbito, sèguito*).
Ninguna en texto que se presente como correcto.

### D3.2 Ejemplos concretos

- **Consigna de grupo pegada al subítem** (patrón sistemático de los ítems `s:rNN`, que vienen
  de un ejercicio del *Soluzioni* con una sola instrucción para 5-12 oraciones):
  - `s:r18-01b:f` (semana sin asignar, min 10): «Traducí al italiano usando al menos una vez
    cada verbo: alzarsi, bere, dire, essere, fare, fare colazione, riuscire a, sentire, uscire»
    sobre una sola oración: *¿Qué dice? No lo escucho.*
  - `s:r24-02d:c` (semana 32): «¿En qué oraciones el subjuntivo NO se refiere a un momento
    posterior al verbo principal?» con dos opciones para una oración («se refiere al futuro /
    no se refiere al futuro»): la pregunta y las opciones no se corresponden, y dice
    «subjuntivo» donde la lección dice *congiuntivo*.
  - `s:r13-03:d` (semana 34): «En dos oraciones sirven tanto che como il/la quale» para un
    ítem de una oración.
  - `s:r07-02:b` (semana 10): consigna «Enfatizá, contrastá y contradecí» para un hueco doble
    «voi | noi»: funciona, pero el separador `|` en la respuesta no se explica en la consigna.
- **Palabra de la semana elegida sola por el generador**: `w25 lieti` («contentos», ejemplo
  «Che voi siate molto lieti!», de un ejercicio de *Dummies*). La semana 25 tiene 5 palabras y
  la 24 tiene 4, porque salen de ejercicios con poco léxico; es el mismo mecanismo que en la
  auditoría anterior daba *fare, andare, volere* en la semana 1 (arreglado a mano para 1-4 y
  27-51, no para 5-26).
- **Glosa que confunde**: `portata` → «portare: llevar / traer» en `glossario.json`; en una
  lectura de restaurante *la portata* es el plato. Es el mismo problema de B5 (ver D3.3).
- **Verificación superficial de las tareas del tramo**: los `punti` se controlan por palabras
  clave (`w32`: «comentar los personajes» = que aparezca «personagg» o «nunziata»; `w41`:
  «expresar lo que sentiste» = «paura», «spavent», «emozion», «piangere», «tremav»). Sin
  clave de IA, un texto que nombra las palabras pasa el punto. Es lo que A2 de la auditoría
  general pedía evitar en el examen y acá se repite en 24 tareas.
- **Lo que está muy bien y sirve de modelo**: `g2-gd-01` (garden path *aprire → aperto* con la
  explicación «lo que engaña es el patrón que acabás de ver, no tu lengua»); `l2-d-25`
  (*infatti / anzi / invece* explicados los tres); `g2-cb-26` (*dopo che* con trapassato «o, en
  la lengua hablada, passato prossimo»); la nota de *metterci* («*Volerci* describe el mundo;
  *metterci*, a vos»); la escucha `w30` *Il video dell'incendio* (una jefa de redacción
  enseñando a verificar un video viral, con pregunta de actitud).

### D3.3 Inconsistencias entre módulos

- **Glosas.** De 1.557 palabras glosadas en dos o más fuentes (palabras de la semana, banco,
  `glossario.json`, glosas de *La settimana* y del tramo), **229 no comparten ni una palabra
  entre sus glosas**. Muchas son polisemia legítima que el alumno ve como contradicción si toca
  la palabra en el ejercicio equivocado: *vicino* («cercano» en la semana 10, «vecino» en el
  banco), *caldo* («caliente» / «calor»), *certo* («¡Claro!» / «cierto»), *forza* («¡Vamos!» /
  «fuerza»), *capo* («jefe» / «desde cero» en *da capo*). Otras son errores del
  `glossario.json`, que sigue con un significado por forma y prefiere el verbo: **entro =
  «entrar»** (es «dentro de», palabra de la semana 31), **battuta = «golpear / vencer»** (es
  «chiste», semana 27), **fumo = «fumar»** (es «humo», semana 41), **presa = «agarrar / tomar»**
  (es «enchufe» o *prendersela*), *studio* = «estudiar», *sveglia* = «despertarse», *sale* y
  *porta* según la fuente. El toque en la palabra (`glossify`) y el desglose leen ese archivo.
- **Terminología.** «Subjuntivo» en 146 consignas o notas de ítems (casi todas de *Dummies* y
  *Soluzioni*), «congiuntivo» en 205; las lecciones y los duelos dicen siempre *congiuntivo*.
  Lo mismo con «pretérito perfecto / indefinido / pluscuamperfecto» en 27 ítems frente a
  *passato prossimo / remoto / trapassato* en todo lo demás.
- ***gli***: lección 1 «casi “li” rápida», `ascolto_data.js` p-059 «no como “li”» (pendiente de
  la auditoría anterior).
- **Bloques repetidos** entre semanas (D1.2): coherentes, pero sin marca de repaso.
- **Dos formatos de comprensión la misma semana**: *La settimana* pregunta en castellano y
  literal; el tramo pregunta en italiano e inferencial.

---

## D4. Progresión hacia C1 (semanas 40-52)

### D4.1 Los ejercicios

1.231 ítems en las semanas 40-51: **504 cloze (41 %), 447 traducción castellano → italiano
(36 %), 259 opción múltiple (21 %), 17 combinación (1 %), 3 scopri, 1 fixerr, 0 typed**. El
62 % viene del *Soluzioni* (769), el 14 % de *Dummies* (173) y el 23 % es propio (289).

| Semana | Ítems | Gramática mínima ≤ 13 | ≤ 19 | Nivel declarado |
|---|---|---|---|---|
| 40 causativo | 62 | 50 % | 85 % | C1: 10 |
| 41 percezione | 34 | 55 % | 94 % | C1: 2 |
| 42 reggenze | 90 | 84 % | 97 % | C1: 7, B2: 4 |
| 43 infinito | 48 | 91 % | 100 % | C1: 6 |
| 44 gerundio | 44 | 45 % | 47 % | C1: 34 |
| 45 pronominali | 57 | 63 % | 75 % | C1: 38 |
| 46 alterazione | 46 | 73 % | 89 % | B1: 25, C1: 1 |
| 47 numerali | 25 | 72 % | 88 % | B1: 18 |
| 48 dislocazioni | 36 | 50 % | 52 % | C1: 36 |
| 49 coesione | 49 | 61 % | 71 % | C1: 7 |
| 50 lessico | 179 | 88 % | 97 % | B2: 15, C1: 1 |
| 51 ripasso | 561 | 42 % | 57 % | C1: 71 |

«Gramática mínima» es el `wk` que calcula `sillabo.py`: la primera semana cuya teoría cubre
lo que el ítem usa. Que el causativo o la reggenza se puedan practicar con presente es
esperable (*ho fatto riparare*, *comincio a*), pero el resultado es que el alumno de C1 hace
en la semana 43 «Traducí al italiano: *Creen que entendieron* → *Credono di aver capito*» y en
la 50 «*Vado ___ supermercato (il supermercato)* → *al*», que son ítems B1 y A2.

**Lo que un ejercicio C1 pide y acá casi no existe** (fuera del examen):

| Tarea C1 (CILS *Analisi delle strutture* / PLIDA) | Ítems en 40-51 | Dónde sí está |
|---|---|---|
| Transformación esplicita ↔ implicita, attiva ↔ passiva, diretto ↔ indiretto | 17 `combina` | 28 `typed` en el examen (`ex-tr-*`) |
| Nominalización (*aumentano i prezzi → l'aumento dei prezzi*) | 2 (`rf-46-18`, `c1-ne-04`) | 3 en el examen; regla en 49 b3 |
| Cambio de registro (reescribir formal ↔ coloquial) | 3 de opción (49, 50) | 20 de opción en el examen |
| Formación de palabras | 26 (alteración, 46) | 32 en el examen (derivación) |
| Cloze razionale sobre un texto seguido | 0 sobre las lecturas largas | 53 en el examen; el C-test de *Escritos* usa solo *La settimana*, episodios y dictogloss (`escritos.js` `allSources`: `Letture.EPISODI` y `dictogloss`), nunca el tramo |
| Riordino di paragrafi / ricostruzione | *Ordenar* de *Escritos*, con los mismos textos cortos | 0 en el examen |
| Corrección de errores de aprendiz | 1 `fixerr` | 84 VALICO, casi todos antes de la 40 |
| Lectura inferencial | tramo: 106/240 preguntas ✓ | |
| Coherencia textual (conectores en texto, referencia) | 49: 34 cloze de conector en oración suelta | «*clues* / *refer*» de `escritos_data.js` (28 + 11) |

En las semanas 27-51 los tipos que exigen reformular suman 61 ítems (44 `combina`, 9
`scopri`, 8 `fixerr`) sobre 2.211. El alumno llega al examen habiendo hecho **cero**
transformaciones escritas del tipo «*Sebbene fosse tardi → Pur ___ tardi*» que ahí valen 28
puntos.

### D4.2 Lo que sí es C1

- Las lecciones 40-51: correctas, con contraste y bien dosificadas (5-6 bloques). La 49 (registro
  y cohesión) es un buen esqueleto del *testo argomentativo* (tabla de cinco partes, fórmulas
  impersonales, «una por párrafo»). La 48 explica bien las dislocaciones. Faltan lo de D1.2
  (neostandard, sistema epistémico).
- El tramo: lecturas de 655-902 palabras, escuchas de 449-574, tareas de 188-310 palabras con
  fuente obligatoria. Preguntas inferenciales, con actitud y propósito. Es la parte más C1 del
  curso y la única donde el input crece.
- *Scrivi* semanal pide 60 palabras; lo compensa la tarea del tramo. Las consignas están bien
  atadas a la gramática de la semana (45: 5 pronominales; 48: 4 dislocaciones; 49: 5
  conectores altos) y `scrivi.js` las cuenta de verdad (`f.connettiviAlti`, `f.pronominali`,
  `dislocations(tk)`).
- Las palabras de la semana 27-51 (458 palabras, notas de uso de calidad).

### D4.3 El examen final frente al CILS TRE-C1

| Prueba | CILS TRE-C1 (orientativo) | `esame_data.js` / `esame_c1.py` |
|---|---|---|
| Ascolto | 3 pruebas, grabaciones reales de 4-6 min, opción múltiple + individuazione + completamento | 2 escuchas TTS a dos voces de ~320 palabras (~2,5 min), 8 opciones + 4 huecos. **Las 16 preguntas siguen en castellano** («Según la experta, ¿qué quedó del trabajo remoto…?»); los huecos, en italiano ✓ |
| Lettura | 3 pruebas: scelta multipla, individuazione informazioni, ricostruzione del testo | 2 textos de 600-625 palabras, 8 títulos para 6 párrafos + V/F con cita ✓. Sin *ricostruzione* |
| Strutture | cloze en texto, trasformazione, formazione, registro | 53 cloze sobre dos textos ✓, 28 transformaciones ✓, 32 formación ✓, 20 registro ✓ |
| Scrittura | 2 textos: ~250-300 y ~150-200 | 200 y 120, con rúbrica de cuatro criterios ✓ (sin IA, la corrección local es la del tramo) |
| Versiones | — | Una sola; los 133 ítems son practicables en la 52 (A2 de la auditoría general, abierto) |

El examen es, en formato, el más parecido al real de todo el curso; lo que le falta es
volumen (escucha), lengua meta en las preguntas y variantes.

### D4.4 Géneros escritos y orales de recepción que faltan (resumen de D1.4)

Notiziario y monólogo informativo; avisos, instrucciones, reglamentos, formularios;
publicidad y anuncios; chat, mensaje de voz, post; texto con tabla o gráfico; prosa literaria
de autor; habla espontánea con tres voces; acentos regionales.

---

## D5. Propuesta para el 3.0 del contenido italiano

Ordenada por efecto esperado ÷ costo. «Herramienta» significa que un script puede generar
los candidatos y una persona revisa; «a mano» significa que hay que escribirlo.

### D5.1 Léxico: de 2.000 a 4.000 · ALTA · L (en varias entregas)

**Qué.**
1. **Palabras de la semana en las semanas 5-26**: pasar de 4-12 a 20 por semana con el
   formato de `parole_c1.py` (palabra, castellano, ejemplo con la gramática ya vista, nota de
   uso), elegidas por campo del `SAI_FARE` y frecuencia. Son 22 semanas × 20 = 440 entradas.
   *Herramienta*: `lex.py` ya lista, para cada semana, los lemas de la lectura, el dictogloss
   y los ítems que no se enseñan; `frequenza.json` ordena por Zipf. *A mano*: la nota de uso.
2. **Rescatar los 1.564 lemas que solo están en lecturas**: los de banda A2-B2 con frecuencia
   alta (unos 600) pasan a «palabras de la semana» de la semana en que se leen; el resto queda
   como glosa. *Herramienta*: el mismo script; el ejemplo sale de la lectura.
3. **Colocaciones por campo (semanas 27-51)**: 8-10 por semana, verbo + sustantivo abstracto y
   adjetivo + sustantivo del texto de la semana (*trarre conclusioni, sollevare obiezioni,
   avanzare una proposta, un problema annoso, una scelta obbligata*), con ítems de completar
   el verbo (el tipo `CV` de `lessico2.py` ya existe) y de elegir entre tres verbos parecidos.
   *Herramienta*: extraer de `tramo/wNN.json` los bigramas verbo-sustantivo y adjetivo-sustantivo
   y filtrarlos con `frequenza.json`; *a mano*: revisar y glosar.
4. **Formación de palabras como práctica semanal (27-51)**: un microbloque por semana
   (*-zione*, *-mento*, *-ezza*, *-ità*, *-anza / -enza*, *-tore / -trice*, *-aio / -aia*,
   *-abile / -ibile*, *-oso*, *-ista / -ismo*, *-ata*, *s- / dis- / in- / ri- / stra-*) y 5-8 ítems
   «Formá la palabra» como los `ex-fp-*` del examen, sobre familias de la lectura de esa
   semana. *Herramienta*: generar candidatos por sufijo desde `frequenza.json` (las familias
   comparten raíz); *a mano*: la nota y los falsos (*casino* no es *casa* + *-ino*).
5. **Campos que faltan** (D1.3): meter derecho y justicia, fisco y contrato de trabajo,
   sistema sanitario, escuela y universidad, deporte, sociedad plural y tecnología digital
   como campos de las semanas 29, 31, 33, 35, 41, 43, 47 (las que hoy los rozan), con la
   lectura larga o la escucha de esa semana ambientada ahí.

**Por qué.** Sin 4.000 familias no hay 98 % de cobertura de la prensa (Nation 2006), y la
rúbrica *lessico* del examen mira colocaciones y derivación, no cantidad de palabras raras.
Las palabras aprendidas en el texto donde se leyeron rinden más que las de lista (Webb &
Nation 2017). El repaso espaciado y las glosas de opción múltiple ya existen: el cuello de
botella es qué entra en la cola.

**Costo.** L en total, pero divisible: (1) M, (2) S con herramienta, (3) M, (4) M, (5) M.

### D5.2 Pragmática explícita · ALTA · S-M

**Qué.** Ocho microlecciones de 3-4 bloques, una por estación y media, cada una con la regla
dicha y 10-12 ítems «Elegí la opción adecuada a la situación» (tres versiones de la misma
frase: brusca, adecuada, exagerada):

| Semana | Acto de habla | Formas |
|---|---|---|
| 8 | Pedir y atenuar | *scusi, senta, volevo chiedere, un attimo, mi sa dire, per caso* |
| 14 | Invitar, aceptar, rechazar con excusa | *ti va di, che ne dici, mi dispiace ma, magari un'altra volta, purtroppo* |
| 20 | Pedir con cortesía en escala | *vorrei, potrebbe, le dispiacerebbe, sarebbe possibile, non è che* |
| 25 | Opinar y matizar | *secondo me, mi sa che, direi che, non so se, forse, mi sembra* |
| 31 | Quejarse y reclamar | *mi scusi ma, vorrei segnalare, non è possibile che, esigo, mi aspetto che* |
| 36 | Acuerdo parcial, interrumpir, tomar la palabra | *sì ma, da un lato… dall'altro, scusa se ti interrompo, posso dire una cosa* |
| 44 | Ironía, sobreentendidos, *understatement* | *bella roba, complimenti, non male, figurati, ma va'* |
| 48 | *Tu / Lei / voi*, cambio de registro en la misma conversación | *diamoci del tu, mi dia del tu, signora, dottore* |

Con esto, las 358 frases de las escenas reciben un campo `reg` (formal / neutro / coloquial /
solo escrito) que hoy tienen 40 en la nota, y el «Adiviná» puede fabricar la trampa
pragmática (*Voglio un caffè* en un bar: gramatical y brusco).

**Por qué.** La instrucción explícita de pragmática rinde más que la implícita (Taguchi 2015;
Plonsky & Zhuang 2019). El *Profilo* lo pone desde A2. Es PROPUESTAS 5, que sigue sin hacer.

**Costo.** S en código (es una lección más y un tipo de ítem que ya existe: `choice` con
nota por opción); M en contenido: a mano, 8 × (4 bloques + 12 ítems).

### D5.3 Ejercicios de C1 en las semanas 40-51 · ALTA · M

**Qué.**
1. **Transformaciones escritas (`typed`) cada semana de la 29 en adelante**, 8-10 por semana:
   esplicita ↔ implicita (29-30, 43-44), attiva ↔ passiva (35-36), diretta ↔ indiretta (38),
   causativo (40), nominalización (49), registro (50). El tipo `typed` y su corrección ya
   existen (`ex-tr-*`). *Herramienta*: generar a partir de las oraciones del banco con `tags`
   (una oración con `congiuntivo_imperfetto` y *sebbene* da su versión con *pur* + gerundio);
   *a mano*: revisar cada par.
2. **Cloze razionale y riordino sobre las lecturas largas**: extender `allSources()` de
   `escritos.js` a `TRAMO_DATA.SETTIMANE[].lettura` y a las escuchas transcritas, así el C-test
   y *Ordenar* trabajan con textos de 400-900 palabras y no con los de 90. *Herramienta*
   pura: es código.
3. **Reescritura de registro**: un ítem `typed` por semana desde la 42: «*C'è un casino di gente*
   → en un informe: *___*». Las siete filas de 50 b3 dan el primer material; la escucha
   *Riscrivere il sollecito* (42) da el segundo.
4. **Sacar de la semana 50 lo que no es de la 50**: los 123 ítems con `wk ≤ 9` (preposiciones
   *a / in / da*, falsos amigos A2) van a las semanas 9 y 13 como repaso o al banco; la 50 se
   queda con los 56 restantes más los de D5.1 (3) y (4).
5. **Corrección de errores de aprendiz C1**: 20-30 ítems `fixerr` del tipo VALICO con errores
   de C1 (concordanza, *gli* por *le*, condicional tras *se*, *dopo mangiare*, calcos de
   subordinación), que hoy están casi todos antes de la 40.

**Por qué.** Los ítems 40-51 miden si el alumno sabe la regla (huecos, traducción); el examen
mide si puede reformular un texto manteniendo el sentido. Son dos habilidades (DeKeyser &
Suzuki 2025); la segunda no se practica.

**Costo.** M: (2) es S y solo código; (1), (3), (5) son contenido con ayuda de herramienta; (4)
es una tarde con `MIN_WEEK`.

### D5.4 Géneros y habla real en la recepción · MEDIA · M

**Qué.**
1. **Una escucha corta más por semana en 27-51, de monólogo**: notiziario de 90 segundos
   (27, 30, 41, 47), previsioni del tempo (29), annuncio in stazione / aeroporto (33), messaggio
   in segreteria (34, 40), istruzioni (43), avviso pubblico (49), pubblicità radiofonica (46).
   Con las preguntas del formato *individuazione di informazioni* (tabla a completar).
2. **Reescribir tres o cuatro escuchas largas como habla espontánea**: turnos cortos (media
   12-15 palabras), tres voces, falsos arranques, *cioè, boh, vabbè, niente, tipo, praticamente,
   allora* al principio, superposiciones marcadas («—sì ma…»), y una pregunta de «¿qué quiso
   decir con…?». Hay dos voces del TTS: la tercera puede ser la misma voz a otra velocidad,
   como ya hace Suoni.
3. **Lecturas que faltan**: en cada estación desde la 27, una de estas: aviso o reglamento
   (condominio, biblioteca, *bando*), formulario o comunicación oficial con sus campos, chat
   o hilo de mensajes, anuncio de alquiler o de trabajo, texto con tabla o gráfico, página de
   autor de dominio público (Pirandello, Svevo, Deledda, Verga, Collodi) con glosas. Las
   preguntas siguen el formato CILS (*ricostruzione* para el hilo de mensajes; *individuazione*
   para el aviso).
4. **Las preguntas de *La settimana* en italiano desde la 27** (156 preguntas, 25 semanas):
   *herramienta* para traducir y *a mano* para revisar; y al menos una inferencial por texto.

**Por qué.** El CILS C1 pone monólogos y habla real; el alumno que solo escuchó diálogos
guionados de 22 palabras por turno se encuentra con otra lengua. Los géneros «pequeños»
(avisos, formularios, chat) son los que un residente lee todos los días y no están en ningún
lado.

**Costo.** M: (1) y (3) a mano (unas 25 escuchas cortas y 8 lecturas); (2) a mano sobre lo que
existe; (4) S con herramienta.

### D5.5 Input auténtico con guía · MEDIA · S-M

**Qué.** La misión opcional «📺 Fuori dalla app» (PROPUESTAS 9) con una lista curada por
estación y una **ficha de escucha guiada** por ítem: para qué sirve, 8 palabras que van a
aparecer (con su glosa), tres preguntas de autocontrol y un «después, en Scrivi: contá en 60
palabras». Fuentes libres y estables: RaiPlay Sound (Radio3, *Tutta la città ne parla*, *Ad
alta voce*), podcast de la Treccani, *Il Post* (podcast y *Morning*), *Italiano Automatico* y
*Podcast Italiano* para B1-B2, TG1 y TGR para el notiziario, canciones con letra (De André,
Battiato, Dalla). Sin reproducir nada dentro de la app: solo el enlace, la ficha y los minutos
anotados a un toque, que entran en la cuerda *input*.

**Por qué.** Video con subtítulos en italiano: g = 0,56 en vocabulario (Kurokawa et al. 2025).
El README lo dice con todas las letras: «la exposición al idioma la tenés que poner aparte».
La ficha convierte esa exposición en tarea.

**Costo.** S en código (una misión con enlace y contador); S-M en contenido (52 fichas de
media página). Riesgo: los enlaces caducan; conviene un chequeo anual.

### D5.6 Variación regional y neostandard · MEDIA · S

**Qué.** Un bloque por estación desde la 26 y uno entero en la 48:
- 26: mapa de las tres Italias lingüísticas (norte, centro, sur), *dialetto* vs *italiano
  regionale*; 5 rasgos que se oyen (*sé* norteño, *stare* por *essere* en el sur, *tenere* por
  *avere*, el remoto en Sicilia, el *si* toscano).
- 37 (remoto) y 36 (*si*): ya están; agregar el chequeo.
- 48: **italiano neostandard**: *che* polivalente, *gli* por *le* y *loro*, *lui / lei / loro*
  sujeto, indicativo por congiuntivo tras *penso che*, *a me mi*, *ci ho*, *mo'*, dislocaciones
  (ya está), *niente* como respuesta; con la regla «entendelo siempre, escribilo nunca» y un
  ítem «¿Escrito formal, hablado o los dos?».
- Escucha: elegir en Common Voice (ya usado en el dictado, con la región del hablante
  disponible en los metadatos) 20 oraciones de hablantes del sur y del norte para el módulo
  «¿Qué forma escuchaste?».

**Por qué.** El PLIDA C1 y el CILS ponen hablantes reales de distintas regiones; el *Profilo*
pide reconocer variedades desde B2. El tema de la 48 lo promete.

**Costo.** S (a mano, 4 bloques y 30 ítems; la selección de audios con herramienta).

### D5.7 Examen final · MEDIA · M

**Qué.** Preguntas de *Ascolto* en italiano (16, a mano); una tercera escucha de monólogo
(notiziario o conferenza) de 4-5 minutos con tabla a completar; *ricostruzione del testo*
(riordino de 6 párrafos, con `Ordenar`); escritura a 250 y 180 palabras; **tres versiones**
de cada prueba y los 133 ítems fuera del entrenamiento de la 52 (A2 de la auditoría general).
*Herramienta*: los cloze de las versiones 2 y 3 salen de las lecturas largas del tramo con el
generador de C-test; *a mano*: escuchas, lecturas, consignas.

**Costo.** M.

### D5.8 Consistencia entre módulos · MEDIA · S-M

**Qué.**
1. `glossario.json` con **varios significados por forma y desambiguación por contexto**
   (sustantivo si sigue a artículo, posesivo o adjetivo; verbo si sigue a pronombre átono o
   *non*; adverbio en lista cerrada: *entro, fumo, presa, battuta, studio, sveglia, sale,
   porta*). Es B5 de la auditoría anterior, con los 229 casos de esta como lista de prueba.
2. **Una sola terminología**: reescribir «subjuntivo» → *congiuntivo* y los nombres
   castellanos de los tiempos en las unas 170 consignas y notas afectadas (*herramienta*: reemplazo
   con revisión).
3. **Consignas de grupo**: un script que detecte en los `s:rNN` las frases «al menos una vez»,
   «en dos oraciones», «¿en qué oraciones», «cada verbo», «usando los verbos» y las reemplace
   por la consigna del subítem (para `translate`, «Traducí al italiano»; para `choice`, la
   pregunta en singular), con la lista de verbos como pista opcional. Unos 60-80 ítems.
4. **Bloques repetidos** → «Ya lo viste en la semana N» (4 casos).
5. ***gli*** con una sola descripción en los tres lugares.
6. Las palabras de la semana de las semanas 5-26 que son formas flexionadas de un ejercicio
   (*lieti*, *bocciati*, *pochissimo*, *figurati*: 4 de 12 formas no lematizadas; las otras 8
   son reflexivos y están bien): las tapa D5.1 (1).

**Costo.** S-M; (1) es lo único con código de verdad.

### D5.9 Cultura integrada · BAJA · M

**Qué.** Los 10 textos de Cultura están bien pero son «historia de los grandes». Para un
residente, la cultura de C1 es también *civiltà*: sistema escolar y universitario, sanità
(medico di base, ticket, ricetta), lavoro (contratto, busta paga, Inps), casa (contratto
d'affitto, condominio), feste y calendario, comer (orari, il conto, lo scontrino), Stato y
política (Comune, Regione, Parlamento, referendum), medios (Rai, i quotidiani). Una tarjeta
por semana de 120-150 palabras, atada al campo léxico de la semana y con dos o tres preguntas;
la mitad se puede escribir como lectura corta del tramo (D5.4).

**Costo.** M, a mano (52 tarjetas).

### D5.10 Qué generar con herramientas y qué escribir a mano

| Con herramienta (script + revisión) | A mano |
|---|---|
| Listas de candidatos léxicos por semana desde lecturas e ítems (`lex.py`) | Notas de uso de cada palabra |
| Colocaciones extraídas de los textos del tramo | Su glosa y el ítem de tres verbos parecidos |
| Familias de palabras por sufijo desde `frequenza.json` | Los falsos derivados y la regla |
| C-test, cloze razionale y riordino sobre las lecturas largas | Nada: es código |
| Transformaciones desde el banco etiquetado (esplicita → implicita) | Revisión y las que el banco no da (nominalización, registro) |
| Traducción de las 156 preguntas de *La settimana* al italiano | Revisión y una inferencial por texto |
| Reemplazo de terminología y de consignas de grupo | Revisión por muestreo |
| Selección de audios Common Voice por región | Las escuchas nuevas (monólogos, habla espontánea) |
| Versiones 2 y 3 del cloze del examen | Microlecciones de pragmática, bloques de variación, lecturas de género, fichas de input, tarjetas de cultura |

### D5.11 Orden sugerido

1. D5.8 (2), (3), (4) y D5.3 (2), (4): dos o tres días, sin escribir contenido nuevo, y dejan el
   material existente más consistente.
2. D5.1 (1) y (2): las semanas 14-26 dejan de ser un desierto con lo que ya está en los textos.
3. D5.3 (1), (3), (5) y D5.2: el tramo final pasa a tener ejercicios de C1 y pragmática.
4. D5.4, D5.6, D5.7: recepción y examen.
5. D5.1 (3)-(5), D5.5, D5.9: léxico por campo, input externo y cultura, que se pueden ir sumando
   por semanas.

---

## Lo que no se pudo medir

- **Cognados.** Sin el diccionario hunspell de castellano, `lessico.py` no descuenta cognados, y
  esta auditoría tampoco: las coberturas «no vistas» de B2-C1 incluyen palabras transparentes.
  Con el diccionario, la cifra de lemas que hacen falta enseñar baja, quizá a la mitad.
- **Conocimiento real del alumno.** Se midió exposición, no aprendizaje: cuántas veces vuelve
  cada palabra depende del FSRS y de lo que el alumno falla; no se simuló la carrera.
- **La voz del TTS.** No se escuchó ninguna escucha: la naturalidad del habla se juzgó sobre la
  transcripción.
- **El *Profilo* y los sílabos de CILS/CELI/PLIDA** se usaron de memoria (sin acceso a los
  documentos): las tablas de D1 son orientativas, no un cotejo línea por línea.
- **Las 3.716 ítems no se juzgaron todos**: las tasas de D3 son de una muestra de 150 con
  intervalo amplio (±8 puntos para una tasa del 10 %).
- **La corrección local de las tareas del tramo** (`tramo.js`) se leyó en los datos (`punti` por
  palabras clave), no se ejecutó con textos de prueba.

---

## Anexo: cifras y scripts

| Medición | Resultado |
|---|---|
| Lemas enseñados explícitamente (vocab + frases + lección), semana 52 | 1.960 |
| Lemas vistos en alguna capa, semana 52 | 4.606 (3.029 con nivel KELLY, de 4.969) |
| Lemas solo en lecturas y escuchas | 1.564 |
| Palabras de la semana en el año | 711 lemas (458 palabras en 27-51) |
| KELLY B2 / C1 vistos alguna vez | 47 % / 39 %; enseñados: 19 % / 16 % |
| Lemas nuevos explícitos por semana, mediana, semanas 14-26 | 9 (mín. 2) |
| Ítems 40-51 | 1.231: cloze 41 %, traducción 36 %, opción 21 %, combinación 1 %, typed 0 |
| Ítems 40-51 con gramática mínima ≤ semana 13 | 42-91 % según la semana (50: 88 %) |
| Ítems de reformulación en 27-51 (`combina`, `scopri`, `fixerr`) | 61 / 2.211 |
| Ítems que nombran la nominalización / el registro | 7 / 44 (25 en el examen) |
| Colocaciones y marcadores (`lessico2.py`) en las semanas 40-51 | 0 de 158 |
| Frases con nota de registro | 40 / 358 |
| Preguntas inferenciales en el tramo | 106 / 240; «non si dice» 31 / 120 |
| Preguntas de *La settimana* en castellano | 156 / 156 |
| Preguntas de *Ascolto* del examen en castellano | 16 / 16 |
| Escuchas del tramo: palabras / turno mediano / «boh», «vabbè» | 10.002 / 22 / 0, 0 |
| Muestra de 150: errores de italiano / de castellano | 0 / 0 |
| Muestra: consignas de grupo pegadas al subítem | 3 de 20 `sfida` |
| Palabras glosadas distinto en dos módulos | 229 / 1.557 |
| «subjuntivo» vs «congiuntivo» en consignas y notas | 146 / 205 |
| Bloques repetidos en dos semanas | 4 (molto, posesivos, stare + gerundio, conjunciones) |
| Semana 3 | 17 bloques, 109 ítems |
| `check_lessons.py --estilo` / `check_letture.py` (w-) / `sillabo.py` | 5 avisos / 0 / 460 ejercicios reubicados |

Scripts, en el scratchpad de la sesión: `dump.js` (vuelca los datos del paquete con
`pack.js` a `itdata.json`), `map.py` (mapa semana por semana → `map.txt`, `map.json`),
`lex.py` (cobertura léxica → `lex.txt`, `lex_rows.json`), `sample.py` (muestra de 150 →
`sample.txt`). Las comparaciones de glosas, bloques repetidos, terminología, ítems 40-51 y
marcadores de habla se corrieron en línea de comandos y sus salidas están citadas en el
texto.
