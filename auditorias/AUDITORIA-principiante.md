# Auditoría: una partida de un principiante disperso

**Quién jugó.** Un estudiante que no sabe nada de italiano, se dispersa fácil y
le cuesta comprometerse. Entró a la app sin leer nada, tocó lo más llamativo,
cerró la app a mitad de camino un par de veces, adivinó cuando no sabía y, al
escribir, escribió en español o con interferencia del español.

**Cómo se jugó.** Con la app publicada en `docs/` corriendo en un Chromium de
390×844 (celular), con perfil persistente para que el `localStorage` sobreviva
entre cierres. Se jugaron, en este orden: Pausa caffè (sin haber leído la
lección), lección 1 completa, Allenamento de la semana 1 («A entrenar»), escena
*Primi passi*, lectura *Arrivo a Bologna*, banco *Traduci*, gimnasio de verbos y
el arranque del Ripasso. Al final: 100 respuestas, 18 correctas, 81
incorrectas, meta diaria cumplida.

Los hallazgos van ordenados por área y, dentro de cada una, de más a menos
grave. Al final hay una lista priorizada.

---

## 1. Aprendizaje: qué se enseña antes de pedirlo

### 1.1 El entrenamiento pide reglas que la teoría no explicó (grave)

Después de la lección 1 (*Suoni e ortografia*: alfabeto, c/g, dobles, acento,
siete vocales, *essere* y *avere*), «A entrenar» arma una ronda con el pool de
80 ítems de la semana 1. Varios de esos ítems exigen reglas que ninguna
pantalla mostró:

| Ítem | Pide | Dónde se enseña |
|---|---|---|
| `rf-1-17` *Stasera esco con ___ di Laura* → un amico / un'amico | elisión del artículo indeterminado | artículos (semana 3) |
| `rf-1-16` *un po'* | apóstrofo | no está en la lección 1 |
| `rf-1-04`, `rf-1-05`, `a2-ort-02` parchi / laghi / amici | plural de -co/-go | sustantivos (semana 2) |
| `rf-1-22` *Mio nonno ha novant'anni* | posesivo sin artículo, numeral, elisión | semanas 7 y 17 |
| `rf-1-23` *Dov'è il cinema?* | *dove* + elisión + artículo | semanas 3 y 8 |
| `d07-013` *Lei, signora, ___ il biglietto?* | *Lei* formal | la lección 1 no menciona el *Lei* de cortesía |
| `d07-023` *La nonna ha ottanta anni* | numeral 80 | semana 7 |

**Por qué pasa.** `tools/build_course.py:790-801` ubica cada ítem en «la primera
semana cuya teoría lo cubre», pero *cubrir* significa solo tiempos verbales
(`sillabo.py`) y vocabulario (`lessico.py`). Reglas como elisión, apóstrofo,
plurales en -chi/-ghi, posesivos o *Lei* formal no son rasgos que el sillabo
detecte, así que un ítem de nivel A1 con verbos en presente cae en la semana 1
aunque su regla llegue diez semanas después. Los ítems propios de refuerzo
(`tools/authored/refuerzo.py`) llevan `rf-1-*` en el id pero eso no fuerza la
semana; la decide el sillabo.

**Qué hacer.** Dos opciones que no se excluyen: (a) que el sillabo reconozca
también estas construcciones (apóstrofo/elisión, plural -chi/-ghi, posesivo,
numerales, *Lei* formal) y mueva el ítem a la semana que las enseña, como ya
hace con los tiempos; (b) que el `note` de un ítem que anticipa una regla se
muestre **antes** de responder, no después, como tarjeta «📐» (el tipo `card`
ya existe en `renderGioco`).

### 1.2 Las palabras de la semana se preguntan sin haberse presentado (grave)

`buildRound` (`docs/js/drills.js`) mete dos «palabras de la semana» en cada
ronda como «¿Qué significa? *andare*» con cuatro opciones. Un principiante que
no abrió la tarjeta *Palabras de la semana* del briefing nunca vio *andare*: la
primera vez que la ve es en el examen. Las frases sí tienen paso de
presentación (tipo `intro`: «Frase nueva… La tengo →»); las palabras no.

Además, las 12 palabras de la semana 1 (*fare, andare, volere, mangiare,
uscire, prendere…*) no tienen relación con la lección de sonidos, y el ejemplo
de *fare* es *Quest'inverno vado a fare sci a Cortina*, que usa *vado* y
*quest'inverno* en la semana 1. Siete de las doce no tienen frase de ejemplo.

**Qué hacer.** Insertar una tarjeta de palabra nueva (italiano, significado,
audio, ejemplo) dos o tres ítems antes de la primera pregunta sobre esa
palabra, igual que se hace con las frases. Y revisar que los ejemplos de las
palabras de la semana N usen solo gramática de la semana N.

### 1.3 El banco *Traduci* está abierto desde la semana 1 y pide gramática de meses después (grave)

En *Allena → Traduci*, sin ninguna semana superada, pide *Mi novio es muy alto*,
*Mi habitación es chica* (posesivo con artículo: semana 17), *Las chicas están
en el jardín* (artículos plurales: semana 3), *Vivo en Buenos Aires con mi
novia* (presente regular: semana 5). `docs/js/banca.js:55-56` filtra por el
campo `w` de la oración, y `w` solo mide tiempos verbales: 235 oraciones
quedan «aptas» para la semana 1. Para un principiante es una pared: en 8
ítems (que se convirtieron en 21 por la repetición) escribió todo en español
y no acertó ninguno.

**Qué hacer.** Que *Traduci*, *Coniuga in contesto* y *Forme* se abran cuando
haya algo que traducir con lo enseñado (por ejemplo desde la semana 3 o 5,
como ya se hace con *Trova l'errore* en la 5), o que `build_bank.py` marque en
`w` también artículos, posesivos y plurales.

### 1.4 La lección enseña sonidos sin dejar escucharlos (medio)

La tabla de c/g (11 filas: *casa, cena, chiave, ciao, gelato, ghiaccio, gli,
sce…*) no tiene botón 🔊 por fila; solo los ejemplos sueltos de cada bloque lo
tienen. En la lección cuyo objetivo es «cómo suena el italiano», el material
central no suena. Lo mismo con «Se escribe / Suena» donde «suena» se explica
con «dy, como la j inglesa de jeans» en vez de dejar escucharlo.

### 1.5 Los chequeos rápidos son de dos opciones y no vuelven a la regla (medio)

De los 5 chequeos de la lección 1, 4 son binarios (nono/nonno, e/è,
pésca/pèsca, sete/sette): el azar da 50 %. El de tabla («Se escribe: z →
Ejemplo») es buscar una fila en la tabla que quedó arriba. Al errar, el
feedback es solo «Era esta: *nonno*» (`docs/js/app.js:724`): no repite la regla
del bloque («la doble dura más: nonno = abuelo, nono = noveno»), que es
justamente lo que el estudiante acaba de no aprender.

### 1.6 La Pausa caffè antes de la lección 1 (leve)

Funciona bien (solo frases y palabras), pero su segunda pregunta fue *topo*
(ratón) para alguien que lleva 20 segundos en la app. El falso amigo está bien
elegido; lo raro es preguntarlo sin haberlo presentado.

---

## 2. Ejercicios: variedad y calidad

### 2.1 Cada ronda se duplica o triplica por la repetición (grave para este perfil)

El «reaprendizaje sucesivo» reinserta cada error hasta dos veces
(`docs/js/app.js:1256-1265`). Para quien acierta poco, la ronda de 12 pasó a
28 preguntas, el gimnasio de 15 pasó a 37 y *Traduci* de 8 a 21. Un
estudiante que se dispersa no llega al final de una sesión que prometía «3
minutos» y termina con 37 preguntas y 23 corazones vacíos de más («🤍🤍🤍🤍🤍
+23» en el HUD).

Peor: la repetición es **idéntica**. *Micia ha sete* se preguntó 3 veces con
las mismas 4 opciones y el mismo feedback; *Il pe___e è fresco* 3 veces; *voi
(avere)* 3 veces. El tercer intento no trae ninguna ayuda nueva.

**Qué hacer.** Repetir una sola vez por ítem (o una en total para sesiones de
principiante) y que la repetición cambie de forma: si falló la opción múltiple,
volver con dos opciones y la regla visible; si falló escribiendo, volver con
fichas. Cerrar la ronda en el tamaño prometido y mandar el resto al Ripasso,
que para eso está.

### 2.2 Distractores sin sentido (medio)

- *Completá con las letras que faltan (sonido [ʃ])*: opciones **parchi | sc |
  ho | è**. Solo una es un grupo de letras. Viene de `recognitionOf`
  (`docs/js/drills.js`), que rellena con «respuestas del mismo tipo de la
  semana» cuando no hay trampas: mezcla respuestas de cloze de temas
  distintos.
- Versión de reconocimiento de una traducción: «¿Cuál es la traducción de
  *Micia tiene sed*?» con opciones *Ho fame / Paolo ha caldo / La città è
  bella / Micia ha sete*: las tres distractoras no comparten sujeto ni verbo,
  se descarta por la palabra *Micia*.

### 2.3 Se pide «Conjugá essere — lui/lei» sin contexto (leve)

Los ítems del gimnasio son puramente formales (*voi (avere) → ___*). Están bien
como drill, pero la mitad de la ronda de la semana 1 es eso, y en la semana 1
el estudiante todavía no tiene una oración donde ponerlo.

### 2.4 Escena de frases: el ciclo funciona (positivo)

Adiviná → frase nueva con audio → fichas → escribir de memoria → volver. Es la
parte mejor diseñada para un principiante: la escritura de memoria llega
después de haber visto la frase dos veces, y la pista de primer intento
(«*como* suena a español») deja autocorregirse.

### 2.5 Lectura: bien graduada, pero el feedback no señala el texto (leve)

*Arrivo a Bologna* se entiende de verdad en A1. Al errar «¿De dónde es Giulia?»
la respuesta es «de Nápoles» sin mostrar la oración *È di Napoli*, que está a
un toque. La caza de formas pide marcar 14 formas de *essere* en un texto de
tres párrafos; para la primera vez, 14 es mucho.

### 2.6 Cultura promete elección libre y está toda cerrada (leve)

«Elegí el que te interese» y los diez textos dicen «se abre en la semana
11…37». La motivación por elección (que el README cita) no existe hasta el
tercer mes.

---

## 3. Correcciones

### 3.1 Diagnostica la opción en español como si fuera italiano (bug, grave)

«¿Qué significa? *andare*» → elegí *salir (de un lugar)* → «**ARTÍCULOS**: acá no
va artículo: sobra *un*. + 3 detalles más». Elegí *querer* → «**PALABRAS DEL
ESPAÑOL**: querer es español; en italiano: volere». Las opciones **son** en
español: el mensaje no tiene sentido y encima queda registrado en *Tus
errores* («Palabras del español 25», «Artículos 1») y alimenta la Clínica.

Causa: `docs/js/app.js:1109`, `italianOptions` excluye `banca`, `lab`,
`lettura` y `frasi`, pero no `vocab` (las palabras de la semana), así que
`Diagnosi.explainChoice` compara «salir (de un lugar)» con «ir».

### 3.2 Explica una traducción entera elegida mal como «falso amigo» (bug, medio)

Reconocimiento de traducción: elegí *Paolo ha caldo* en vez de *Micia ha sete*
→ «FALSOS AMIGOS: caldo significa caliente. Acá va sete». El estudiante no
confundió *caldo* con caldo: eligió otra oración. La diagnosis palabra a
palabra no aplica a opciones que son oraciones distintas (`recognitionOf`
marca `recog: true`; `answer()` no lo mira).

### 3.3 «Persona del verbo» se equivoca de sujeto (bug, medio)

- *loro (essere)* → elegí *sei* → «sei es la forma de tu; el sujeto acá es
  **io**: sono». El sujeto era *loro*. `docs/js/diagnosi.js:669-674` toma la
  primera persona que produce *sono* en vez de la del enunciado.
- *lui/lei (avere)* → elegí *hai* → «Con *Lei* (usted) el verbo va en tercera
  persona… *Signora, come sta?*» (`diagnosi.js:673`). El *lei* del drill es
  «ella», no el *Lei* de cortesía; la explicación confunde más de lo que ayuda.

### 3.4 Cuando la respuesta está entera en español, la pista es de una palabra (medio)

*Las chicas están en el jardín* → escribí *las chicas están en el jardín* →
«*las* suena a español. ¿Cómo se dice en italiano?». Corrijo *las* y me quedan
cinco palabras en español. Cuando más de la mitad de las palabras son
españolas, la pista útil es otra: «esto está en español; ¿querés fichas?»
(el botón *dame fichas* ya existe) o mostrar la oración con los huecos.

### 3.5 Fichas: sin diagnóstico (leve)

Armé *ciao come sto* por *ciao come stai* → «No, era así: Ciao, come stai?».
No marca cuál ficha estaba mal ni dice *sto* = yo / *stai* = vos, aunque el
motor de diagnóstico lo sabe: `gradeTiles` (`app.js:1091`) compara la cadena
entera y no pasa por `Diagnosi`.

### 3.6 «+ 3 detalles más» que no se pueden ver (leve)

El feedback dice «+ 3 detalles más» / «+ 5 detalles más» y no hay forma de
abrirlos. O se muestran plegados o no se anuncian.

### 3.7 «La próxima vez esta la vas a escribir» en cada feedback (leve)

Aparece en cada ítem de reconocimiento, también cuando erraste
(`drills.js:200`). Para quien acaba de fallar suena a amenaza y tapa la
explicación real. Mejor una sola vez por sesión, y solo al acertar.

### 3.8 La pista de primer intento y la autocorrección (positivo)

«*como* suena a español» → corrijo → «🎯 ¡Lo corregiste vos!». Bien pensado y
bien ejecutado. La explicación de *siete/sette*, *abbiamo/avete* y *ho/hai*
por persona es clara.

---

## 4. Enganche y compromiso

### 4.1 La meta diaria premia volumen, no aprendizaje (grave)

Con 18 aciertos y 81 errores la meta de 200 xp quedó **cumplida** (273 xp) y
salió el cofre. XP = 10 por acierto + combo; con rondas que se triplican por
errores, quien más falla más preguntas responde y más xp junta. Al revés de lo
que uno quiere que aprenda un estudiante al que le cuesta comprometerse.

### 4.2 Pantalla de resultado desmoralizante y poco legible (grave para este perfil)

- Primera sesión de la vida: «💪 Sesión terminada · **40 %**» cuando en
  realidad terminó acertando todo lo que le preguntaron dos veces. La
  autocorrección cuenta como «Casi», no como acierto.
- Después: **25 %**, **24 %**, con tablas de 21 y 28 filas «para repasar».
- La tabla «Para repasar» tiene filas duplicadas (*Hola, ¿cómo estás?* dos
  veces) y la columna izquierda mezcla lo que **respondí** (*topo (animal)*,
  *siete*, *ho*) con lo que **se preguntó** (`app.js:1468`): no se entiende
  qué era la pregunta.

**Qué hacer.** Para principiantes: contar lo autocorregido como acierto,
mostrar «lo que aprendiste hoy» (3 cosas) en vez de un porcentaje, y agrupar
los errores por ítem (no por intento).

### 4.3 Los textos de la meta no coinciden con la realidad (medio)

*Io* dice «Relajada · 100 xp (1 pausa)», «Normal · 200 xp (2 pausas)»
(`app.js:1632`) y el README dice que una pausa «da unos 100». Una pausa de 5 a
7 ítems da 30 a 60 xp. Con la meta normal hacen falta 4 a 6 pausas.

### 4.4 Cerrar la app a mitad de camino pierde todo (grave para este perfil)

Un disperso cierra la app. Cerré a mitad de la Pausa caffè y a mitad de la
lección (6/14): al volver, Oggi arranca de cero, sin «seguí donde estabas», y
la lección se reinicia desde la pantalla 1. Las respuestas ya dadas se guardan,
pero la sesión no. Para este perfil, retomar en el mismo ítem es la función
que más racha salva.

### 4.5 Oggi es demasiado largo y manda señales cruzadas (medio)

La pantalla de inicio mide dos pantallas y media y ofrece 9 acciones distintas
(lección 1, meta, pausa, lampo, escena, ripasso, semana, palabras, lectura,
frase del día, calendario, instalar). El texto dice «primero la lección 1»,
pero el botón grande y verde es Pausa caffè, y es lo que toqué. Después de la
lección, Oggi dice «Arrancá con una pausa caffè» en lugar de «ahora entrená la
semana 1». Un solo «siguiente paso» grande, y el resto plegado, iría mejor
para quien se dispersa.

### 4.6 Vidas que quedan en negativo (leve)

«🤍🤍🤍🤍🤍 +23» en la cabecera durante 20 preguntas. El README dice que las
vidas son un indicador, no un castigo; pero un contador de errores creciendo
al lado del progreso es un castigo visual. Cuando se vacían, mejor esconderlas.

### 4.7 Detalles que sí enganchan (positivo)

Confeti, «+12 xp» volando, combo, «¡Lo corregiste vos!», la medalla *Primo
passo* en la primera ronda, el cofre. La estética (placas, maiólica, modo
oscuro) es de las más cuidadas que se ven en apps caseras.

---

## 5. Funciones de la app

- **Reanudar sesión** (ver 4.4): guardar `round`/`les` en `localStorage` y
  ofrecer «Seguir» en Oggi.
- **Un solo próximo paso** en Oggi (ver 4.5).
- **Tocar la palabra para ver el significado** está en los ejercicios, pero no
  en las opciones de respuesta ni en el feedback, que es donde el principiante
  más lo necesita (*Micia*, *fretta*, *torto*).
- **Lampo** se abre con 12 frases vistas: bien, pero el botón grande apagado
  con «llevás 3» es espacio muerto durante los primeros días.
- **Botón «ver la respuesta»** en la pista de primer intento: para un disperso
  es la salida fácil; cabría un segundo nivel de pista antes (mostrar la
  palabra con hueco: *c_me*).
- **Recordatorio diario** por `.ics`: funciona sin servidor, pero el estudiante
  que le cuesta comprometerse no va a abrir *Io → Recordatorio*. Ofrecerlo al
  terminar la primera sesión, cuando está contento, tiene más chance.
- **Hueco en el enunciado** se pierde en la lectura en voz alta y en el
  texto: *Il pe e è fresco* (el hueco se ve como espacio).
- **Briefing**: «Lectura de apoyo» queda vacío en la semana 1.

---

## 6. Cambio hecho: el percorso como eje (pedido del 23/9)

Pedido: «que el percorso sea la diva de la app; todo lo demás son buenas
prácticas, pero tiene que estar dentro del percorso para un aprendizaje
ordenado». Implementado así:

- **Oggi** arranca con la semana en curso y su **próximo paso** (un solo botón
  grande: «▶︎ Jugá la lección», después «Palabras de la semana», etc.), con el
  avance de misiones de la semana. Desaparecen de Oggi las tarjetas sueltas de
  semana, palabras, escena y lectura: todo vive en la semana.
- **Cada semana** lista sus misiones **en orden**: 1. lección, 2. palabras,
  3. superá la semana, 4. frases de la escena que le corresponde, 5. lectura
  que se abre esa semana, 6. laboratorio (Ponte / Falsi amici / Capire) cuando
  toca, 7. dominala. El contador «n / m misiones» se ve en Oggi y en la
  semana.
- **Escenas con semana** (`SCENE_WEEK` en `docs/js/drills.js`): *Primi passi*
  1, *Salvavita* 2, *Al bar* 3, *A tavola* 4, *In giro* 5, *Casa e famiglia*
  6, *In ufficio* 7, *Negozi e salute* 8, *Reazioni* 9, *Connettori* 10,
  *Falsi amici* 12, *Chiacchiere* 14 (passato prossimo, *piace*), *Sentimenti*
  15, *Passato e futuro* 19 (futuro), *Opinioni* 27 (congiuntivo), *Parlare di
  idee* 30, *Citazioni* 40. La Pausa caffè y el botón de escena siguen ese
  orden: nunca presentan una escena de una semana futura.
- **Laboratorio con semana**: una regla de *Ponte* por semana de la 2 a la 10,
  *Falsi amici* en la 11, cada set de *Capire* en la semana de su forma (ya
  tenían semana).
- **Lecturas**: cada episodio es misión de la semana en que se abre; los de
  Martín respetan el orden de la historia (el episodio 4, marcado semana 11,
  espera al 3, de la semana 12).
- Salir de una escena, lectura o laboratorio abiertos desde la semana
  **vuelve a la semana**, y la pantalla de resultado ofrece «← Seguir el
  percorso».
- *Allena* y *Leggi* quedan como atajos libres (buenas prácticas, no camino).

Queda para después, en la misma línea: que el nodo del percorso muestre
«n / m misiones» además de las estrellas, y que el banco (*Traduci*, *Forme*,
*Coniuga in contesto*) se abra como misión en la semana en que tiene sentido
(ver 1.3).

---

## 7. Estado de las correcciones (23/9)

Todo lo de las secciones 1 a 5 quedó corregido en el código, salvo lo que se
indica. Resumen por punto:

| Punto | Qué se hizo |
|---|---|
| 1.1 | `tools/sillabo.py` reconoce elisión/apóstrofo (semana 3), plural pedido en la consigna (2), números escritos (7), posesivos producidos (3) y *Lei* de cortesía (5). Nueve ítems salieron de la semana 1 hacia su semana; el curso se reconstruyó (`build_course.py`). |
| 1.2 | Tarjeta **Palabra nueva** (palabra, significado, audio, ejemplo) dos ítems antes de la primera pregunta sobre esa palabra, en el entrenamiento y en *Palabras de la semana* (`Drills.withWordIntros`). |
| 1.3 | El banco se abre con su gramática: *Forme* en la semana 3, *Traduci* y *Coniuga in contesto* en la 5 (`Banca.FORME_WEEK`, `TR_WEEK`, `GAP_WEEK`); en *Allena* aparecen apagados con la semana en que se abren, y entran como misión de esa semana en el percorso. |
| 1.4 | 🔊 en cada celda «Ejemplo» de las tablas de la lección. |
| 1.5 | Los chequeos de pares mínimos tienen tres opciones; al errar se muestra la regla del bloque (📐). |
| 1.6 | La Pausa caffè no mete una pregunta del laboratorio antes de la primera lección. |
| 2.1 | Un solo reintento por ítem y en otra forma: dos opciones con la nota a la vista, versión de reconocimiento de lo que había que escribir, o la frase con fichas. La segunda vez paga la mitad de xp. |
| 2.2 | `recognitionOf`: distractores de la misma forma (grupo de letras contra grupos de letras), del mismo tema, y las oraciones que comparten más palabras primero. |
| 2.3 | Sin cambio (el gimnasio sigue siendo un drill formal). |
| 2.5 | Al errar una pregunta de comprensión se abre el texto para buscar la respuesta. La caza de formas queda igual. |
| 2.6 | El texto de *Cultura* dice que cada texto se abre con su gramática. |
| 3.1 | Las opciones en español (`src: "vocab"`) ya no se diagnostican. |
| 3.2 | Una oración entera elegida mal en el reconocimiento de una traducción no se diagnostica palabra a palabra. |
| 3.3 | La diagnosis recibe el enunciado: «el sujeto acá es *loro*» cuando el sujeto es *loro*, y el *Lei* de cortesía solo si la frase trata de usted. |
| 3.4 | Respuesta entera en español → «Eso está en español. Escribila en italiano; si todavía no la sabés, pedí las fichas». |
| 3.5 | Las fichas pasan por el diagnóstico (marca la palabra y explica). |
| 3.6 | «+ 3 detalles más» → «También: Artículos, Concordancia». |
| 3.7 | «La próxima vez esta la vas a escribir» solo al acertar. |
| 4.1 / 4.2 | Lo autocorregido cuenta como acierto en el porcentaje y en la tabla («Corregidas por vos»); «Lo que aprendiste hoy» lista cada ítem una sola vez con la pregunta a la izquierda; la segunda vuelta paga la mitad. |
| 4.3 | Textos de la meta: 100 xp (2 o 3 pausas), 200 xp (4 o 5). README corregido. |
| 4.4 | **Seguí donde estabas**: la ronda o la lección a medias se guardan (`laviac1.pending.v1`) y Oggi ofrece retomarlas en el mismo punto. |
| 4.5 | Oggi con un solo próximo paso (sección 6). |
| 4.6 | Sin contador «+N» al vaciarse los corazones. |
| 5 | Lampo aparece como línea de texto hasta abrirse; segundo nivel de pista (💡 más pista: *c_me*) antes de «Ver la respuesta»; ofrecimiento del recordatorio al terminar las primeras sesiones; «Lectura de apoyo» no se muestra vacía. Pendiente: glosario al tocar palabras dentro de opciones y feedback. |
| Percorso | Cada nodo muestra «n/m misiones»; el banco entra como misión en las semanas 3 y 5. |

---

## 8. Prioridad sugerida (original)

1. **Bug 3.1** (diagnóstico sobre opciones en español, contamina el perfil de
   errores y la Clínica). Una línea en `app.js:1109`.
2. **1.1 + 1.3**: nada antes de su teoría también para elisión, plurales,
   posesivos, *Lei*; y el banco de traducción cerrado hasta que haya gramática
   para traducir.
3. **1.2**: tarjeta de palabra nueva antes de preguntarla.
4. **2.1**: una sola repetición, distinta de la original; ronda del tamaño
   prometido.
5. **4.2 + 4.1**: resultado que cuente la autocorrección y muestre lo
   aprendido; meta que no se cumpla a fuerza de errores.
6. **4.4**: reanudar la sesión interrumpida.
7. **3.2, 3.3, 3.5, 3.6, 3.7**: ajustes de corrección.
8. **1.4, 1.5**: audio en las tablas de sonidos; regla del bloque al errar el
   chequeo.
9. **4.3, 4.5, 4.6**: textos de la meta, Oggi con un solo próximo paso, vidas
   en negativo.

---

## Anexo: la partida en números

| Sesión | Preguntas prometidas | Preguntas reales | Aciertos | % mostrado |
|---|---|---|---|---|
| Pausa caffè (sin lección) | 5 | 7 | 2 + 1 autocorregida | 40 % |
| Lección 1 | 14 pasos, 5 chequeos | 14 | 2 / 5 | «2/5» |
| Allenamento semana 1 | 12 | 28 | 7 | 25 % |
| Escena Primi passi | 10 | 12+ | — | interrumpida |
| Lectura ep. 1 | 4 | 4 | 0 | — |
| Traduci (banco) | 8 | 21 | 0 | 0 % |
| Gimnasio de verbos | 15 | 37 | 9 | 24 % |
| **Total** | | **100** | **18** | meta diaria cumplida |

Los tests del repo (`test_game`, `test_frasi`, `test_diagnosi`,
`test_conjugator`) pasan todos: ninguno de los problemas de arriba es una
regresión, son huecos de diseño y de datos que los tests no miden.
