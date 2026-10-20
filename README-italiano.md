# La Via C1 — italiano hasta C1 en un año

Curso-juego construido a partir de dos manuales de gramática italiana:

- **Italian Grammar For Dummies** (Beth Bartolini-Salimbeni) — aporta el banco de
  ejercicios auto-corregibles, porque su edición digital trae la clave de
  respuestas de cada capítulo.
- **Soluzioni: A Practical Grammar of Contemporary Italian** (Routledge) — aporta
  el temario de nivel alto: sus 29 capítulos son la columna vertebral del año, y
  sus *Esercizi* entran al juego como desafíos abiertos.

El curso está escrito **en español para hispanohablantes**: casi todo el material
propio ataca los puntos donde el español y el italiano se parecen lo suficiente
como para hacerte tropezar.

## En el celular (lo principal)

Es una **app web instalable** (PWA): se publica una vez y queda en tu pantalla de
inicio como cualquier app, **funciona sin internet** y guarda tu progreso **solo en
tu teléfono**. No usa cuentas ni servidores; la IA es opcional, con una clave de Anthropic tuya (Claude Haiku).

1. Publicá la carpeta `docs/` con GitHub Pages: *Settings → Pages → Deploy from a
   branch →* la rama que tenga estos cambios, carpeta `/docs`.
2. Abrí la URL en el celular una vez con internet.
3. **iPhone** (Safari): *Compartir → Agregar a inicio*. **Android** (Chrome):
   el botón *Instalar app* de la pantalla Oggi, o *menú ⋮ → Instalar app*.
4. Desde ahí abre sin conexión. Al publicar una versión nueva, se actualiza sola
   la próxima vez que la abras con internet.

### Pensada para el trabajo aburrido

- **☕ Pausa caffè**: 3 minutos. Mezcla un poco de repaso, dos frases nuevas,
  frases que ya viste, una pregunta del laboratorio y un par de preguntas de
  gramática de tu semana.
- **⚡ Lampo 60″**: contrarreloj de un minuto, del castellano al italiano, con
  frases que ya viste (se abre con 12). Cada error resta 3 segundos. Guarda tu
  récord.
- **🗣️ Frasi**: 21 escenas y 358 frases de conversación de alta frecuencia (bar,
  oficina, charla, reacciones, conectores, opiniones con congiuntivo, falsos
  amigos). Cada escena te presenta frases nuevas y después te las pide de cinco
  maneras: armarla con fichas, escucharla, tarjeta rápida y, sobre todo,
  **escribirla de memoria**, que es lo que te hace rápido para hablar. Al
  escribir no cuentan los acentos ni la puntuación, pero sí el orden de las palabras.
- **🤫 Modo oficina** (botón arriba a la derecha): no suena nada solo y no
  aparecen ejercicios de escucha. El 🔊 sigue andando si lo tocás con auriculares.

### Lo que te mantiene enganchado

- **Meta diaria** (100, 200, 350 o 500 xp; una Pausa da entre 30 y 60) con anillo de progreso en la cabecera.
  El sábado y el domingo la meta baja a la mitad: el fin de semana es para algo
  liviano, no para cortar la racha.
- **Sfida del giorno**: seis preguntas de tu semana con doble xp, una vez por
  día. La primera ronda de cada día suma +25 xp.
- **Racha de 7 días: xp ×1,2** mientras dure. El cofre puede dar un 🎟️ de
  doble xp para la próxima ronda.
- **Misiones y semana perfecta**: cada misión que cerrás se anuncia con su
  cuenta (★ 4/7), y completar todas las de una semana da +100 xp, confeti y
  las medallas *Settimana perfetta* y *Dieci perfette*.
- **Tus cuatro cuerdas** (Nation): Oggi muestra cuánto de tu semana fue input,
  output, forma y fluidez, y qué te falta.
- **Cuaderno itañol** en *Io*: las interferencias del español que se fosilizan
  (a personal, dobles, è/e, essere/avere, ci/ne, artículos…), en verde cuando
  llevás catorce días sin ese error.
- **🎁 Cofre diario** al cumplir la meta: premio sorpresa (xp, premio gordo o un
  escudo).
- **🔥 Racha con 🛡️ escudos**: cada 7 días de racha ganás un escudo, y cada
  escudo salva la racha por un día que no pudiste jugar (máximo 3).
- **Rangos**, de *Turista* a *Madrelingua*, además del nivel.
- **Calendario** de tus últimas 4 semanas, combos, confeti, sonidos y vibración.
- **Repaso espaciado sin deuda**: lo que fallás, las frases y las palabras
  entran en la cola; lo que sale bien a la primera en el entrenamiento vuelve
  una sola vez a las dos semanas, y una ficha con cuatro aciertos seguidos se
  retira. La cola muestra «hoy: 20», nunca un total de miles.
- **Seguí donde estabas**: si cerrás la app a mitad de una ronda o de una
  lección, Oggi te ofrece retomarla en el mismo punto (queda en el teléfono
  dos días).
- **Recordatorio diario**: en *Io* elegís una hora y se agrega a tu calendario
  un evento que se repite todos los días. Anda sin servidor ni notificaciones push.

### 📖 Leggi: lectura graduada

- **La settimana**: 52 textos cortos (80 a 110 palabras) escritos a mano,
  uno por semana, jefes incluidos, con la gramática de esa semana y palabras
  ya vistas o glosadas. Reemplazan al cuento generado con IA.
  Cada uno trae, además de las preguntas, **tres afirmaciones en italiano
  para juzgar: *vero*, *falso* o *non si dice***, el formato de la
  comprensión lectora del CILS y el CELI: hay que entender el texto en
  italiano, no reconocer una respuesta. En el percorso es la misión
  «Lectura y comprensión». `tools/it/check_letture.py` controla
  que la gramática no pase de la semana y que queden como mucho tres
  palabras desconocidas sin glosa (Jeon & Day 2016; Hu & Nation 2000).
- **Letture lunghe** (tramo C1, semanas 27 a 51): un texto largo por semana
  de un género real (reportaje, editorial, reseña, relato, ensayo breve,
  entrevista), que crece de 350 a 900 palabras hasta llegar al largo del
  examen, con cinco preguntas y cinco *vero / falso / non si dice* en
  italiano. Tiene el mismo lector, con glosas, karaoke y caza de formas de la
  gramática de la semana. En el percorso es la misión «Lectura larga».
- **Glosas de opción múltiple**: en cada lectura, tres o cuatro palabras
  nuevas (no cognados ni palabras gramaticales) no se dicen: se preguntan.
  Las tocás y elegís entre tres significados por el contexto; después quedan
  como glosa normal y, si el banco las tiene, entran al repaso. Son las
  glosas que más vocabulario dejan (Yanagisawa, Webb & Uchihara 2020).
- **Martín a Bologna**: una historia en 10 episodios, de A1 a B2. Cada episodio
  usa la gramática del momento (presente, passato prossimo, imperfetto,
  futuro, pronombres, condizionale, congiuntivo, periodo hipotético) y abre el
  siguiente.
- **Cultura** (opcional, para cuando tengas ganas): 10 textos de historia,
  filosofía, sociología y literatura italianas: Dante, Maquiavelo, Galileo,
  Garibaldi, Gramsci, Primo Levi, el *boom* económico, Calvino, Beccaria y
  Natalia Ginzburg. Donde una frase famosa es apócrifa, el texto lo dice.
  Desde la semana 27 se suman **24 tarjetas de *civiltà*** (`area:
  "Civiltà"`, ids `cv-27` a `cv-51`), una por semana del tramo: cómo
  funciona la vida en Italia para quien vive ahí. Escuela y universidad
  (la triennale y el *trenta e lode*, el sistema escolar, la maturità),
  sanidad (el SSN de 1978, el medico di base y la ricetta, el pronto
  soccorso), trabajo (contrato y busta paga, sindicato y huelga), casa
  (condominio, alquiler, residuos), fiestas (de Navidad a la Befana, las
  sagre, Ferragosto), la mesa (el bar, el conto y el coperto), Estado y
  política (Comune y Regione, el referendum, Camera y Senato, anagrafe,
  SPID y PEC, el 112) y medios (la Rai y los diarios). Cada una tiene
  120-140 palabras, va atada al campo léxico y a la gramática de su semana
  (el SSN en passato remoto en la 37, la anagrafe con el causativo en la
  40, el pronto soccorso con gerundios en la 44) y trae tres preguntas en
  italiano y su caza de formas. `check_letture.py cv-` controla la
  gramática y las palabras sin glosa (auditoría 3.0, D5.9).
- Cada texto se abre en la semana cuya gramática usa (el episodio del
  imperfetto, en la 15; los de passato remoto, en la 37), así nunca leés
  antes de la teoría.
- Cada lectura tiene glosario (tocás la palabra subrayada), preguntas de
  comprensión y una **caza de formas**: marcar en el texto los verbos en
  passato remoto, los congiuntivi, etc.

### 🩺 Cómo te corrige

La app no se limita a decir "incorrecto, era X". Un motor de diagnóstico
(`docs/lang/it/diagnosi.js`) compara tu respuesta con la correcta palabra por palabra
y reconoce *qué tipo* de error cometiste. Tiene unas 30 categorías pensadas para
hispanohablantes: auxiliar *essere/avere*, concordancia del participio, «a»
personal, preposiciones y contracciones (*a il → al*), artículo (*il zaino →
lo zaino*), artículo con posesivos (*la mia madre*), género distinto del
español (*la latte*), concordancia, plurales irregulares, persona y tiempo del
verbo, congiuntivo tras *penso che*, periodo hipotético (*se avrei*), verbos
irregulares regularizados (*ando, prenduto*), *-isc-*, *-care/-gare*, dobles
consonantes, tildes (*è/e*), palabras y grafías del español (*muy, ñ, ll*),
falsos amigos, lugar del pronombre, *ci/ne*, palabras que faltan o sobran, y
tipeos.

Según lo que dice la investigación:

- **Primer intento con error de regla:** la app no te da la respuesta. Te
  marca la palabra y te da una pista ("Revisá el auxiliar de *andare*: ¿essere
  o avere?"), y vos lo corregís. Las pistas que te hacen autocorregirte
  funcionan mejor que darte la forma correcta (Lyster y Ranta 1997; metaanálisis
  de Lyster y Saito 2010).
- **Segundo intento:** ves tu respuesta al lado de la correcta, con la
  diferencia marcada, y la regla explicada. La retroalimentación específica a
  *tu* respuesta supera a la simple verificación (Shute 2008).
- **Lo que fallás vuelve una vez, más fácil:** una pregunta de opciones vuelve
  con dos opciones y la regla a la vista; una de escribir vuelve como
  reconocimiento; una frase vuelve con fichas. Nunca la misma pantalla dos
  veces, y la segunda vez paga la mitad de xp.
- **Errores de regla y de vocabulario:** los de regla (auxiliar, concordancia,
  artículo, tiempo) se corrigen con la regla; los de vocabulario, con el
  significado de la palabra que usaste ("*caldo* significa caliente"),
  siguiendo la distinción de Ferris entre errores tratables y no tratables.
- **Deslices:** un tipeo, una tilde o un pronombre sujeto de más se marcan sin
  hacerte repetir (Corder: *mistakes* y *errors*).
- **Un hueco se juzga en su oración:** en «___ casa» o «Sono le ___» el
  diagnóstico rellena el hueco y mira la frase entera, así el artículo ve el
  sustantivo que lo sigue y la hora ve el *sono* de antes.
- **Español dentro del italiano:** *los, que, muy, tengo* y también palabras
  que ningún diccionario trae pero suenan a castellano (*tienes, señor,
  televisión*) se reconocen como español, no como tipeo; si copiaste la
  consigna entera, te lo dice.
- **Lo que no es ninguna palabra** (*gle* por *gli*, *mangie* por *mangia*,
  *genti* por *gente*) se explica como lo que es: el artículo de ese
  sustantivo, la terminación del verbo, la ortografía de la palabra; nunca
  como «concordancia» a secas.
- **Opción múltiple:** si elegiste mal, te explica por qué *esa* opción está
  mal ("*vai* es la forma de *tu*; el sujeto es *noi*").
- **Tu perfil de errores:** cada error se anota por tipo. La **Clínica** arma
  sesiones con lo que más te cuesta, y los errores que corregís vos solo cuentan
  como avance (Metcalfe 2017: equivocarse y analizar el error enseña).

### 🧠 La memoria: FSRS, confianza y mantenimiento

Desde la v41 el repaso lo programa **FSRS** (Free Spaced Repetition
Scheduler, Jarrett Ye / open-spaced-repetition, versión 5, parámetros por
defecto), que en el benchmark público de 519 millones de repasos predice
mejor que SM-2 y que el algoritmo de Duolingo. Cada ficha tiene una
*estabilidad* (los días hasta que la probabilidad de recordarla baja al
90 %) y una *dificultad*. Lo que cambia para el que estudia:

- **Nada se retira.** Antes, cuatro aciertos sacaban la ficha del repaso;
  la investigación dice que la retención larga exige re-aprendizaje
  espaciado (Rawson & Dunlosky 2022; Bahrick 1993; Serfaty & Serrano 2024).
  Ahora la ficha pasa a **mantenimiento**: vuelve a intervalos de meses,
  con un tope de seis por día para que la cola nunca sea una deuda.
- **Noche y mañana.** Lo nuevo después de las 20 h se repasa al desayuno,
  con el sueño en el medio (Mazza et al. 2016: la mitad de intentos y mejor
  retención a seis meses).
- **Retención elegible**: 85, 90 o 95 %. Menos retención, menos repasos por
  día.
- **Tu curva de olvido.** Cada repaso queda en un registro; con cien, la
  app estima en el teléfono cuánto más rápido o más lento olvidás
  vocabulario y gramática que el promedio, y ajusta los intervalos.
- **Cada regla es una ficha**: la semana cuenta sus días de práctica
  productiva y la regla se da por consolidada a los tres.
- **Corte por fatiga**: si la precisión de las últimas ocho respuestas cae
  veinte puntos, la ronda ofrece cerrar ahí.

`tools/it/test_memoria.js` prueba las fórmulas, el mantenimiento, la
migración de las fichas viejas, el modo noche, la estimación de velocidad
y el hábito.

### 🎧 Suoni: el oído

Los hispanohablantes son de los grupos menos sensibles a las consonantes
dobles del italiano, y la escucha era el punto más flojo del curso. Ahora
cada semana trae la misión **Suoni**: seis pares mínimos con identificación
y feedback inmediato (HVPT: Uchihara, Karas & Thomson 2025, g = 0,92 en
percepción), dos de habla conectada, dos de entonación, uno de acento
tónico y un dictado por fragmentos.

- **190 pares mínimos** en `docs/lang/it/ascolto_data.js`, repartidos en 40
  semanas: dobles (*pala/palla, nono/nonno, sete/sette*), vocales abiertas y
  cerradas (*pésca/pèsca*), africadas (*zio, pazzo/passo, mezzo/messo*),
  palatales (*figlio/filo, sogno/sono, pesce/pese*), v/b y s sonora,
  r/rr, c/g/qu. La variabilidad de hablantes que el HVPT necesita se simula
  con las voces italianas del teléfono a tres velocidades y tres tonos.
- **Habla conectada** (50): ¿cuántas palabras escuchaste? (*dov'è andato*,
  *ce l'ho fatta*, *andiamocene*) y elegir la transcripción correcta.
- **Entonación** (50 pares): pregunta o afirmación con las mismas palabras;
  el signo de interrogación cambia la curva del TTS.
- **Acento tónico** (30): *àncora/ancóra*, *prìncipi/princìpi*, *sùbito/subìto*,
  y las esdrújulas que el español desplaza (*tàvolo, càmera, mèdico*).
- **Dictado por fragmentos**: oraciones del banco de la semana, con las
  dobles y las tildes contadas; dos de cada tres veces, una oración grabada
  por una persona real (Common Voice).
- **¿Qué forma escuchaste?** (26): una oración grabada con el verbo en
  blanco y dos formas que compiten (*andassi / andavo*, *esca / esce*,
  *dedicata / dedicato*); decide solo el oído. Se abre con la semana de
  cada forma.
- La Pausa caffè trae un ítem de escucha, y *Allena* tiene el módulo libre.

**Voces reales en Suoni** (`docs/js/voci.js`): las palabras de los pares
mínimos suenan con grabaciones de hablantes reales de Lingua Libre
(Wikimedia Commons, CC BY-SA 4.0), un hablante distinto en cada toque y
con su nombre a la vista; *Io* lista los créditos. La app las busca desde el
teléfono la primera vez y el service worker guarda el audio para usarlo sin
conexión; si no hay grabación (o es un par de vocal abierta/cerrada), suena
la voz del teléfono.

**Oraciones grabadas** (`docs/lang/it/voci_cv_data.js`, `docs/lang/it/audio/cv/`): 128
oraciones de Common Voice (Mozilla, CC0) leídas por voluntarios distintos,
revisadas a mano, con su semana. Suenan en el dictado y en «¿Qué forma
escuchaste?»; el service worker las guarda la primera vez que suenan. Cómo
se eligieron y cómo sumar más: `tools/it/VOCES.md`.

### 📝 Dictogloss

Cada semana (menos las de jefe) un texto de 50 a 110 palabras
(`docs/lang/it/dictogloss_data.js`, 47 textos): lo escuchás dos veces y en la
segunda anotás en la app, con las palabras clave a la vista. Después lo
reconstruís en la app con tus notas arriba, y al final ves tu versión y el
texto original con los bloques recuperados en verde y los que faltaron en
rojo. No hace falta papel.
Se puntúan seis bloques léxicos (*ci vediamo*, *per fortuna*, *sono andato a
trovare*): lo recuperado es lo que queda (Yu, Boers & Tremblay 2025). El
corrector propio marca después lo demás.

### 🎧 Leggi e ascolta

Cada lectura se puede **leer mientras se escucha**: la palabra que se dice
se ilumina (Webb & Chang 2015: 37 % más vocabulario a los tres meses), con
una escalera de velocidad 0,8 → 1 → 1,15, subtítulos parciales (solo las
palabras glosadas) y modo solo audio. Los minutos de escucha cuentan como
input y suman xp. Con las lecturas ya hechas, *Ascolto facile* las
reproduce una tras otra, solo audio, y se controla desde la pantalla de
bloqueo (Media Session).

### 📻 Radio Portici: una escucha por semana de la 6 a la 25

Hasta el tramo C1 casi no había qué escuchar con contexto. Ahora, de la
semana 6 a la 25 (sin el jefe de la 13), cada semana trae un episodio de
**Radio Portici**, la radio del barrio en Bologna: Sara y Dario conducen
«Buongiorno Portici» y llaman Martín (el de las lecturas: su hora en
Rosario, la entrevista de trabajo en Módena, la oferta), la signora Franca y
Leo, el cronista en bicicleta. Son 19 programas a dos voces, de 134 palabras
en la 6 a 285 en la 25 (4.100 en total), cada uno con la gramática y las
palabras de su semana (el presente irregular en la 6, el passato prossimo en
la 11, *ne* y *ci* en la 21, el congiuntivo en la 24 y la 25).

- Se escucha con el reproductor de las escuchas largas: dos voces del
  teléfono, **dos escuchas con las preguntas a la vista**, 0,9× o 1× y la
  **transcripción al final**; las glosas, antes de escuchar.
- Tres preguntas de comprensión (en castellano hasta la 13, en italiano
  desde la 14) y dos o tres **«¿lo dice o no lo dice?»**.
- En el percorso es la misión **«📻 Radio: …»**, obligatoria: queda hecha con
  60 % o al responder por segunda vez (como la lectura, con 70 % o releerla).
  El plan del día la pone como bloque de input y los minutos escuchados
  cuentan como input. En Leggi, la serie entera, plegada por estación.
- `tools/it/check_radio.py` controla, como con las lecturas, que ni el guion
  ni las preguntas en italiano usen gramática posterior a la semana y que
  queden como mucho tres palabras desconocidas sin glosa;
  `tools/lib/test_radio.js`, el largo, las voces, las preguntas, las formas y
  palabras de la semana y que la transcripción sea el guion.

### 📺 Fuori dalla app: una ficha por semana de la 6 a la 52

La app no puede ser todo el input. Cada semana, desde la 6, trae una ficha
**opcional** que manda afuera: entrevistas en la calle de *Easy Italian*, una
receta de GialloZafferano, *Radio3 Scienza*, *Ulisse* de Alberto Angela, *Un
posto al sole*, Montalbano, un cuento de Verga o de Pirandello, las clases de
Barbero, y alguna canción (*Nel blu dipinto di blu*, *Azzurro*, *Caruso*).
Cada ficha dice para qué sirve y cómo usarla, trae el enlace (se abre en otra
pestaña; si se rompe, dice qué buscar), 6-8 palabras que vas a oír o leer con
su glosa y tres preguntas para vos (en castellano hasta la 13, en italiano
desde la 14).

- **Anotás los minutos** con un toque (+5, +10, +20, +30): cuentan como
  input en la meta del día, en el reloj de estudio y en los minutos de input
  de la semana (120 por día como mucho; el último toque se puede deshacer).
- **Después, contalo** en 40-60 palabras, con el corrector de Scrivi de la
  semana y sin consigna obligatoria.
- En el percorso es la misión **«📺 Fuori dalla app: …»**, opcional; en Leggi,
  todas las fichas, plegadas por estación. Datos en
  `docs/lang/it/fuera_data.js`; test en `tools/lib/test_fuera.js`.

**Inondazioni**: doce textos de 150 a 230 palabras que repiten ocho veces o
más una estructura que el español no tiene (*ne*, *ci*, *da* + tiempo,
*mica*, pronombres combinados, congiuntivo, condizionale passato, relativos,
*si* impersonal, passato remoto, causativo, gerundio). Primera lectura sin
marcas; segunda con la estructura resaltada y la pregunta de por qué está
así (Trahey & White 1993; Rassaei & Jabbarpoor 2025).

### ⚔️ Duelos: dos formas que se confunden

Ocho duelos en *Allena* (y como misión opcional en la semana en que se
abren): *essere* o *avere* (semana 11), *lo/la* o *gli/le* (10), *di* o *da*
(9), passato prossimo o imperfetto (15), futuro o condizionale (20), *ci* o
*ne* (21), indicativo o congiuntivo (25), *che* o *cui* (34). Cada sesión
mezcla ocho oraciones, cuatro de cada forma, y después de cada una pregunta
**«¿qué te lo dijo?»**: tocás la pista de la oración (*ieri*, *penso che*, *a
Marco*). Intercalar funciona cuando las formas se parecen (Brunmair &
Richter 2019, g = 0,42) y explicar el porqué suma (Bisra et al. 2018,
g = 0,55). Datos en `docs/js/duelli.js`; las oraciones entran al repaso.

### 🧪 El jefe mide si la regla generaliza

Cada jefe suma un 20 % de oraciones del banco que **nunca viste**, sobre
gramática ya enseñada. No cuentan para aprobar ni para la tabla por
*abilità*, pero el resultado las muestra aparte: «con lo que practicaste:
88 %; con frases nuevas: 71 %». Si hay distancia, te lo dice.

### 🎯 «Adiviná» con opciones parecidas

Antes de aprender una frase nueva, la adivinás entre tres opciones que son
**la misma frase con el error típico del hispanohablante** (*Grazie mile*,
*Me chiamo*, *De dove sei?*, *Il treno è a ritardo*), no otras frases que se
descartan por el sentido. Solo se usan errores que siempre son error
(artículo, preposición, *è/e*, tildes, dobles, castellano metido, *gn → ñ*);
las pocas interjecciones sin error posible (*Prego!*, *Magari!*) usan las
frases más parecidas.

### 🪤 Garden path, Scopri la regola y compañía

`tools/it/authored/grammatica2.py` (435 ítems) trae seis tipos nuevos:

- **Garden path** (60): tres ejemplos regulares, pedir el cuarto, dejar
  caer en la trampa del español (*aprito, ho andato, la mia madre*) y
  corregir (Tomasello & Herron 1988: inducir el error supera explicar la
  excepción antes).
- **Scopri la regola** (25 conjuntos con 75 aplicaciones): seis oraciones y
  elegir la regla entre tres formulaciones (Fotos & Ellis 1991).
- **Output empujado** (72): después de cada *Capire*, producir la forma en
  bloques de doce (Shintani, Li & Ellis 2013; DeKeyser & Suzuki 2025).
- **Traducción contrastiva** (75): frases del español con tres o cuatro
  contrastes juntos, y diez del italiano al español para colocaciones
  opacas (Laufer & Girsai 2008).
- **Combinación de oraciones** (44, B2 a C1): dos o tres oraciones y el
  conector (*benché, purché, pur + gerundio, dopo aver*).
- **Ítems tipo VALICO** (84): frases de aprendices hispanohablantes con un
  error real que hay que encontrar y corregir.

### 📚 Vocabulario por frecuencia

`tools/it/build_frequenza.py` compila tres listas abiertas en
`docs/lang/it/data/frequenza.json`: itWaC (Baroni et al. 2009; listas de franfranz,
MIT), OpenSubtitles 2018 (CC BY-SA) y KELLY (Kilgarriff et al. 2014, 6.900
palabras con nivel A1-C2). Con eso la app:

- muestra en *Io* la **cobertura** por nivel y cuántas de las 2.000
  fundamentales conocés (De Mauro 2016: cubren el 86 % de lo que se dice);
- ofrece las **frecuentes que faltan** y las practica desde el banco;
- prioriza lo frecuente en *Parole*;
- verifica en el teléfono que un texto generado por la IA use solo palabras
  conocidas (tasa de palabras fuera de lista; Dugan et al. 2026);
- arma **distractores de la misma clase y banda de frecuencia**;
- genera **pseudopalabras** para *Parola o no?*, sesenta segundos de
  reconocer palabras reales en menos de un segundo (fluidez léxica).

Además: **colocaciones con verbo soporte** (98 ítems: *fare colazione, dare
un esame, prendere in giro*) y **marcadores discursivos** (60: *magari, mica,
appunto, ormai, anzi, comunque, insomma, addirittura*), en
`tools/it/authored/lessico2.py`; una **imagen mnemónica** escrita por vos para
las palabras opacas (*burro* → «un burro untado en manteca»), que reaparece
cuando la palabra falla; un verbo cuenta como conocido recién con tres
aciertos.

### 🤖 Con la clave: Parla, Storia y pistas graduadas

- **Parla**: un role-play con un personaje, una situación de la semana y
  tres objetivos verificables: tiempos permitidos y largo máximo. El
  personaje responde lo que le preguntás, no se repite y apunta a los
  objetivos que faltan; un objetivo cuenta si lo lograste de forma
  comprensible, aunque sea con errores. **El italiano va primero**: las
  palabras que ya conocés son una preferencia, no una lista cerrada; si la
  respuesta tiene más del 15 % de palabras desconocidas, se piden sinónimos
  solo para esas, y la versión nueva se toma si el corrector propio no le
  encuentra más errores. Sin corrección en el diálogo: al terminar, un
  segundo pedido revisa todas tus frases juntas, con corrección mínima y
  atención a las palabras que cambian el sentido (*cappelli / capelli*,
  *troppo / molto*) (Wang et al. 2025, g = 0,48; Dugan et al. 2026).
- **Storia della settimana**: ya no se genera con IA. Cada semana tiene su
  texto escrito a mano en *La settimana* (ver *Leggi*); las historias que ya
  se habían generado siguen en *Leggi*.
- **El modelo**: la app prueba los modelos de cada proveedor del mejor al
  peor, y el que respondió la última vez va primero solo si está entre los
  tres mejores (antes, un modelo chico que respondió una vez quedaba fijo).
- **Pistas graduadas**: «Explicame» ya no da la explicación de entrada:
  primero una pista implícita, después la regla como pregunta, al final la
  explicación (evaluación dinámica; LearnLM 2024).
- **Revisión con evidencia**: el segundo profesor recibe las marcas del
  corrector propio y de LanguageTool para contrastar, porque un modelo no
  corrige su propio trabajo sin evidencia externa (Kamoi et al. 2024), y se
  le exige corrección mínima (los correctores automáticos sobrecorrigen,
  Park et al. 2025). Y no da la razón por cortesía.

### 📌 Hábito

- **Tu meta**: para qué querés italiano, con tus palabras (el yo ideal de
  Dörnyei; Al-Hoorie 2018).
- **Esta semana**: la cuota de palabras nuevas hacia el próximo jefe, que se
  recalcula sola si te atrasás (Bandura & Schunk 1981).
- **Regreso sin castigo**: después de tres días o más, cinco minutos con
  las diez fichas más frías, sin mostrar deuda, y una pregunta de un toque
  (¿qué pasó?) que ajusta la retención si se puso difícil. Los lunes y los
  primeros de mes se anuncian como nuevo comienzo (Dai, Milkman & Riis 2014).
- **Cierre de la semana**: tres toques (qué costó, qué cambiás, cuándo
  estudiás) y la semana siguiente te lo recuerda.
- **Récords personales** en vez de tablas (Hanus & Fox 2015), racha semanal
  (tres días por semana), sesiones por día como medida principal (Sudina &
  Plonsky 2024), tarjeta de la semana para compartir, atajo «Ripasso 2 min»
  en el ícono y el número de fichas vencidas en el badge de la app.

### 🎓 Esame C1

La semana 52 ya no es una ronda más: cinco pruebas como en el CILS TRE-C1,
el CELI 4 y el PLIDA C1 (sin la parte oral), cada una con mínimo del 55 % y
promedio del 60 %, todo en italiano:

- **Ascolto**, en dos partes. Un diálogo leído a dos voces con ocho
  preguntas y cuatro huecos, y un monólogo de 4-5 minutos (una conferencia,
  una presentación, un notiziario) con una tabla de 9 a 12 datos para
  completar mientras se escucha. Cada grabación, dos veces. La tabla acepta
  «quindici» por «15» y «alle 18» por «18:00» (`Tramo.cellOk`).
- **Lettura**, en dos partes. Un texto de 600 palabras con título por
  párrafo y vero/falso, y la *ricostruzione del testo*: seis párrafos con el
  primero fijo y los otros cinco para ordenar (un punto por párrafo en su
  lugar).
- **Strutture**: 20 huecos racionales y transformaciones (*Sebbene fosse
  tardi → Pur essendo tardi*).
- **Lessico**: formación de palabras y registro.
- **Scrittura**: un argumentativo de 250 palabras (230-280) y una carta
  formal de 180 (160-200). Con clave, los califica la IA con la rúbrica de
  la certificación. Sin clave, la revisión de la tarea C1 (`Tramo.evaluate`:
  extensión, variedad léxica, estructura del género, conectores, errores),
  que no aprueba un texto relleno.

**Tres versiones** (A, B, C), cada una un examen entero con otro diálogo,
otro monólogo, otra lectura, otro texto para ordenar, otras consignas y sus
propios ítems de strutture y lessico. La primera vez toca la A; si no
aprobás, el intento siguiente usa la versión que todavía no hiciste. La
pantalla dice qué versión estás haciendo y cómo te fue en las otras.
Después de aprobar, el plan de mantenimiento propone un simulacro cada tres
meses con la versión siguiente. Se guarda en `state.esame`: la versión en
curso y, por versión, las pruebas del intento y la mejor nota.

Datos en `docs/lang/it/esame_data.js` (`EsameData.versioni`,
`EsameData.versione(id)`) y `tools/it/authored/esame_c1.py` (los ítems,
con `ver`).

### 🏦 El banco

`tools/it/bank/` tiene el contenido en Python legible y `tools/it/build_bank.py` lo
valida (formato, duplicados, errores bien construidos, verbos que el conjugador
generaría mal) y lo compila a `docs/lang/it/data/bank.json`:

| Contenido | Para qué |
|---|---|
| 1.827 sustantivos con género, plural, nivel y nota contrastiva | *Parole*, artículos, plurales, preposiciones con artículo, concordancia |
| 636 verbos con auxiliar, *-isc-* e irregularidad | Vocabulario; los regulares se suman al gimnasio de conjugación |
| 423 adjetivos con sus cuatro formas | Concordancia |
| 354 adverbios, conectores, preposiciones y pronombres | Vocabulario |
| 864 oraciones español → italiano (A1–C1), con variantes aceptadas | *Traduci* y *Coniuga in contesto* |
| 584 errores típicos de hispanohablantes con explicación | *Trova l'errore* |
| 1.137 interferencias del español, 97 falsos amigos y 48 grafías | Reconocer el español dentro de tu italiano |

### 🔬 En qué investigación se basa cada ejercicio

No es "toda la bibliografía", porque nadie la puede leer entera. Son los
hallazgos más replicados de la investigación en adquisición de segundas
lenguas y en psicología de la memoria:

| Principio | Dónde está en la app | Referencia |
|---|---|---|
| Práctica de recuperación: acordarse fija más que releer | Escribir de memoria, cloze, tarjetas, ronda | Roediger & Karpicke 2006 |
| Repetición espaciada | Ripasso (SM-2), la Pausa mezcla repaso | Cepeda et al. 2006 |
| Reaprendizaje sucesivo: lo que errás vuelve hasta que sale | Toda sesión salvo el boss | Rawson & Dunlosky 2011 |
| Efecto del pretest: adivinar antes de aprender | «Adiviná» antes de cada frase nueva | Kornell, Hays & Bjork 2009 |
| Espaciado dentro de la sesión | La frase nueva se pregunta después de otras | Cepeda et al. 2006 |
| Intercalado | Pausa y repaso mezclan tipos y temas | Rohrer & Taylor 2007 |
| Dificultad deseable | Primero reconocer (fichas), después producir (escribir) | Bjork 1994 |
| Bloques léxicos y frases hechas | 21 escenas, 358 frases | Wray 2002; Boers & Lindstromberg 2012 |
| Input comprensible con 98% de cobertura | Lecturas graduadas con glosario | Krashen 1985; Hu & Nation 2000 |
| Noticing: notar la forma en el texto | Caza de formas | Schmidt 1990 |
| Input estructurado: interpretar la forma antes de producirla | Laboratorio *Capire* | VanPatten & Cadierno 1993 |
| Transferencia desde la lengua materna | Laboratorio *Ponte* (9 reglas, 121 cognados) y *Falsi amici* | Ringbom 2007 |
| Fluidez con material conocido y bajo presión de tiempo | Lampo 60″ | Nation 2007 (four strands) |
| Interés y elección sostienen la motivación | Lecturas de cultura de libre elección | Hidi & Renninger 2006; Deci & Ryan 2000 |
| Pistas para autocorregirse (*prompts*) antes que la respuesta | Primer intento con error de regla | Lyster & Ranta 1997; Lyster & Saito 2010 |
| Retroalimentación específica a la respuesta dada | Diagnóstico de errores y de opciones elegidas | Shute 2008 |
| Errores tratables (regla) y no tratables (léxico) | La explicación cambia según el tipo | Ferris 1999; Ellis 2009 |
| Aprender del error propio, con análisis | Perfil de errores y Clínica | Metcalfe 2017 |
| Interferencias típicas del hispanohablante (preposiciones, auxiliar, «a» personal) | Categorías del diagnóstico y *Trova l'errore* | Calvi; Schmid; corpus VALICO |

### El repaso según el error

No todos los errores pesan lo mismo en el ripasso. Un desliz (un tipeo, una
tilde) deja la tarjeta avanzando; un error de regla (auxiliar, concordancia,
modo) la vuelve a empezar; un error de vocabulario también, pero pierde menos
«facilidad» y vuelve antes. Y lo que respondiste bien tres veces seguidas,
en días distintos (1, 3 y 8 días), se retira del repaso. En la simulación
del año la cola de ripasso nunca pasa de unas 150 tarjetas.

### Opciones que no regalan la respuesta

En una pregunta de opción múltiple las opciones se parecen: la misma frase
con un error típico (*La ragazze*, *Le ragaze*), las otras formas del mismo
verbo (*sono / sei / siamo*), los otros miembros de la misma clase de palabra
(*dove / quando / come*; *a / in / da*). Nunca otra frase que se descarta por
su significado. Vale para todos los tipos: en «Completá la tabla» las otras
celdas más parecidas a la respuesta (y nunca la única que repite palabras de
la fila), en «Completá la regla» formas de la misma clase, en «¿Qué
significa?» palabras del mismo campo (*fratello*: hermano / hija / tío) y del
mismo tipo, en las escuchas y en el Lampo las frases que más se parecen.
`test_game.js` lo controla en las lecciones y en las versiones de
reconocimiento.

### Tu memoria

Todo queda en el `localStorage` del teléfono. La app le pide al navegador
almacenamiento persistente, y al instalarla en la pantalla de inicio es mucho menos
probable que se borre. Igual, en *Io → Guardar copia* bajás (o compartís a Drive o
WhatsApp) un `.json` con todo tu progreso, y con *Restaurar copia* lo recuperás
en otro teléfono.

### Tu copia en otro teléfono: GitHub Gist (opcional)

Para seguir en otro teléfono sin pasarte archivos y sin servidor de la app,
en *Io → Tu copia → ☁️ Sincronizar con tu GitHub Gist* pegás un token
personal de GitHub con permiso **solo de gist** (el enlace abre
*github.com/settings/tokens/new* con «gist» ya marcado: elegís el
vencimiento y tocás *Generate token*). Vale para los dos idiomas.

- **Subir ahora**: la primera vez crea un gist **secreto** en tu cuenta,
  con `laviac1.json` (el mismo sobre que *Guardar copia*: app, idioma,
  versión, fecha y progreso) y un `LEEME.md`; después lo actualiza. Si otro
  teléfono subió después de la última vez que este sincronizó, pregunta
  antes de pisarla.
- **Traer de la nube**: en el otro teléfono, con el mismo token, encuentra
  el gist por el nombre del archivo, te dice si la copia es más nueva o más
  vieja que lo que hay en el teléfono (con fecha y xp) y pregunta antes de
  reemplazar; se restaura igual que un archivo (una copia de Rumo C1 no se
  restaura en La Via C1).
- **Subir sola al cerrar la app**: si la activás, al salir de la app sube
  una vez por día como mucho, y solo si cambió algo. Si otro teléfono subió
  una copia que este no trajo, no sube y te avisa en *Io*.

El token queda solo en este teléfono, con las claves de IA, y nunca entra en
la copia ni en el gist. Cómo funciona por dentro: `ARQUITECTURA.md`, «La
copia en un GitHub Gist».

## Jugar en la computadora

```sh
cd docs && python3 -m http.server 8000
# abrir http://localhost:8000
```

Es un sitio estático sin dependencias.

## Cómo está armado el año

52 semanas en cuatro estaciones, cada una cerrada por un **boss** que hay que
aprobar con 85% para desbloquear la siguiente:

| Estación | Semanas | Nivel | Contenido |
|---|---|---|---|
| Le Fondamenta | 1–13 | A1 → A2 | Sonidos (vocales abiertas y cerradas, dobles), essere y avere, género, artículos, presente completo, pronombres, **passato prossimo**, reflexivos e imperativo |
| Il Ponte | 14–26 | A2 → B1 | Piacere, imperfetto, futuro, condicional, **ne y ci**, **pronombres combinados**, comparativos, **congiuntivo presente** |
| La Corrente | 27–39 | B1 → B2 | Congiuntivo pasado e imperfecto, concordancia, periodo hipotético, pasiva, relativos, **passato remoto**, **discurso indirecto** |
| La Vetta | 40–52 | B2 → C1 | Causativo, percepción, formas no finitas, construcciones especiales, orden de palabras, registro alto, léxico C1 |

El orden sigue la guía basada en evidencia del proyecto (y la secuencia de
adquisición del italiano L2 del Progetto di Pavia: presente → passato prossimo
→ imperfetto → futuro → condicional → congiuntivo): el passato prossimo llega
en el primer trimestre, y los clíticos *ne/ci*, los pronombres combinados y el
congiuntivo presente en el segundo. Desde la primera semana se atacan las
interferencias del castellano (dobles, vocales abiertas, *a* personal,
*essere/avere*).

El percorso es **el eje de la app**: la pantalla Oggi muestra la semana en
curso y su próximo paso, y cada semana lista **en orden** todo lo que trae:
la lección, las palabras de la semana, el entrenamiento, la escena de frases
que le corresponde (cada una de las 21 escenas tiene su semana: *Primi passi*
en la 1, *Al bar* en la 3, *Opinioni* con congiuntivo en la 27), la lectura
que se abre esa semana, el laboratorio (*Ponte* una regla por semana de la 2 a
la 10, *Falsi amici* en la 11, *Capire* cuando llega su forma) y la maestría.
Las pestañas *Allena* y *Leggi* siguen como atajos libres, y la Pausa caffè
mezcla lo de la semana en curso. Es un **camino** de 52 nodos. Cada semana
tiene **3 estrellas**, una por misión:

1. **Jugá la lección** — la teoría en pasos cortos (tablas, ejemplos con audio,
   *la trampa* que induce el castellano y *el atajo*), y después de cada bloque
   un **chequeo rápido** generado de su propio material: completar la tabla o
   elegir la frase bien escrita entre dos trampas con el error típico
   (auxiliar, concordancia, contracción, dobles). Leer y enseguida recuperar
   fija más que releer.
2. **Superá la semana** — 20 respuestas correctas con los ejercicios de la
   semana en el *Allenamento*: 12 preguntas con ejercicios del libro, banco
   propio y gimnasio de verbos, cinco vidas y combo de XP (el gimnasio y las
   palabras no cuentan para la estrella).
3. **Dominala** — **una sola sesión** de 30 preguntas de toda la semana, sin
   vidas, con lo no visto primero: con 85 % de acierto se gana. Cuenta la
   primera respuesta de cada pregunta (la segunda vuelta, más fácil, es para
   aprender); lo escrito se escribe, no se reconoce. Si no llega, el briefing
   muestra el mejor intento. El gimnasio y las palabras no cuentan para las
   estrellas.

**La semana siguiente se abre al completar todas las misiones de la semana
menos *Dominala***: la lección, las palabras, las 20 correctas, la escena de
frases, la lectura, el laboratorio y el banco que le tocan. El briefing dice
qué falta. Cada sesión de escena trae seis frases nuevas y las de laboratorio
dan primero lo no visto, así el contador avanza en cada sesión.

Los **boss** cierran cada estación: examen acumulativo (la mitad de la estación
que cierra, un cuarto de la anterior, el resto libre; el gimnasio pesa un
20 %), 85% para pasar, con el resultado por *abilità* (ascolto, lettura,
strutture, produzione), como el CILS.
Las **vidas** son un indicador, no un castigo: cada error vacía un corazón para que
veas dónde te equivocaste, pero la ronda se juega siempre hasta el final.
Aparte están el **gimnasio de verbos** (conjugación generada al vuelo) y las
**Sfide del Maestro**: los desafíos del *Soluzioni* con clave de respuestas,
cada uno una ronda corregida (elegir, completar varios blancos, traducir del
español) con la regla explicada al responder; 80% o más gana su estrella.

Cada semana trae además **📚 Palabras de la semana** (12 en las semanas 1-4,
19 o 20 desde la 5; ninguna en las de jefe), elegidas a mano por el campo de la
semana y rescatadas de sus lecturas, con audio, una frase de ejemplo que usa
solo la gramática ya vista y una nota de uso (régimen, auxiliar, colocación,
falso amigo): primero elegís qué significan, después las escribís; quedan en el
ripasso con repetición espaciada. Están en `tools/it/bank/parole_settimana.py`
(1-4), `parole_ponte.py` (5-25) y `parole_c1.py` (27-51). En *Oggi* ves cuántas palabras practicaste
contra la meta del trimestre (2.000 en el primero).

**Reconocer antes de producir**: la primera vez que aparece un ejercicio de
escribir (conjugar, completar, traducir) llega como opción múltiple; la
próxima vez, ya lo escribís. Cada palabra de la semana se presenta primero
(tarjeta con significado, audio y ejemplo) y recién después se pregunta.
El banco se abre con su gramática: *Forme* en la semana 3 (artículos),
*Traduci* y *Coniuga in contesto* en la 5 (presente), *Trova l'errore* en la 5. La semana 1 incluye **escucha sin texto**
(*nonno* o *nono*, *casa* o *cassa*, *cena* o *scena*) y *Trova l'errore* se
abre en la semana 5, cuando ya podés leer la oración.

Además hay una cola de **ripasso** con repetición espaciada (SM-2 simplificado)
sobre todo lo ya jugado, racha diaria y once medallas.

### Nada antes de su teoría

Cada semana toma ejercicios de los dos libros, y un capítulo de sustantivos
puede traer frases en imperfetto (*il popolo danese era contro…*) o un
superlativo en passato prossimo (*le vittime più tragiche sono state…*).
`tools/it/sillabo.py` lee cada ejercicio, reconoce los tiempos verbales que usa
(con un léxico de formas generado por el conjugador: `tools/it/forms_lexicon.js`)
y otras construcciones (pronombres combinados, *ne*, *cui*, gerundio,
comparativos, y también la elisión *un'amica / dov'è / un po'*, los plurales
en *-chi/-ghi*, los números escritos, los posesivos y el *Lei* de cortesía,
que no usan ningún tiempo nuevo pero sí una regla de una semana concreta), y
calcula **la primera semana cuya teoría lo cubre todo**:

- En el enunciado, que solo se lee, el presente vale desde el principio.
- En la respuesta, lo que escribís o elegís, el presente cuenta desde la
  semana 5; *essere* y *avere* se enseñan en la semana 1.
- Lo que una semana todavía no puede pedir pasa, como repaso, a la semana
  donde ya se enseñó; ahí cada ronda mezcla unos pocos (la cuarta parte como
  máximo).
- Los ejercicios de *For Dummies* se reparten por tema, bloque por bloque, y
  no por capítulo: el capítulo 3 mezcla sustantivos (semana 2), artículos
  (semana 3) y sufijos (semana 46). Lo mismo con las secciones de cada capítulo del
  *Soluzioni*: cada una va a la semana de su tema, y cada ejercicio aparece una sola
  vez fuera de los exámenes y repasos.
- El gimnasio de verbos solo usa como distractores tiempos ya vistos; el
  banco (*Traduci*, *Completa*, *Trova l'errore*, la Clínica y la Pausa)
  y los juegos de *Capire* filtran por la semana a la que llegaste.

- **Vocabulario**: `tools/it/lessico.py` sabe desde qué semana se conoce cada
  palabra (el nivel del banco, lo que ya mostró la teoría, o cognado
  transparente para un hispanohablante, que se comprueba contra el diccionario
  de castellano con las reglas del Ponte). Lo que escribís tiene que ser
  vocabulario ya visto; en lo que leés se toleran hasta dos palabras nuevas.
  Las palabras que no están en el banco tienen significado y nivel en
  `tools/it/bank/glossario.py`.
- **Toque en la palabra**: en cualquier ejercicio (salvo los que preguntan el
  significado) tocás una palabra italiana y ves qué significa; las que todavía
  no viste en el curso aparecen subrayadas (`docs/lang/it/data/glossario.json`).

### La lección, una idea por pantalla

Cada bloque de teoría se juega en pasos cortos en vez de una pantalla
cargada: **👀 Mirá** (los ejemplos solos, con audio y la forma que se
enseña resaltada: las de la regla, las de la tabla, las terminaciones que
nombra y, en las semanas de un tiempo verbal, las formas de ese tiempo que
genera el conjugador), **📐 La regla** (sola, grande), **🗂️ La tabla** (las tablas
largas en pantallas de tres o cuatro filas, una debajo de la otra, con un
chequeo rápido entre pantalla y pantalla y la tabla entera plegada al final), **⚠️ Ojo / El atajo** y los chequeos. Es lo
que hacen Babbel, el modelo PACE y los manuales con sección de reflexión:
primero la forma en contexto, después la regla; y lo que dice la
investigación de diseño multimedia: segmentar (g ≈ 0,3) y resaltar lo
importante (d = 0,38). La *Teoria* completa sigue disponible como
referencia, en una sola página.

La teoría de las 52 semanas está escrita para ese formato: cada bloque
tiene 2 a 4 ejemplos con la forma que enseña marcada a mano (`*abbia*`),
una regla de 22 palabras como máximo y el detalle en *Ojo*, *El atajo* o
*Más detalle*. `python3 tools/it/check_lessons.py --estilo` lo controla
(ejemplos, largo de la regla, forma marcada en cada ejemplo).

### Lecciones cortas

Ninguna lección pasa de unos doce pasos: cada lección (o cada parte) se
corta en sesiones de bloques enteros, y cada sesión es su propia misión
del percorso («Lección 2/5: …»). En total son 161 lecciones cortas en vez
de 95 largas. Una parte cuenta como leída cuando terminaste todas sus
sesiones, y recién ahí se ofrece «A entrenar esta parte»; lo que ya habías
leído sigue leído.

### Lecciones en partes

Una semana cargada no se estudia de una sentada. Las semanas 1, 2, 3, 5, 6,
7, 8, 9, 10, 11, 12, 15, 17, 18, 19, 21, 23, 24, 28, 30, 33, 34, 40, 42, 44,
50 y 51 tienen la lección dividida en **partes** (dos a seis), cada una con sus propios bloques de teoría y sus propios ejercicios.
La semana 3, los artículos, tiene seis: *Género y el, la*, *lo, gli y el
plural*, *Indeterminados*, *Dónde va el artículo (y dónde no)*,
*Preposiciones articuladas* y *Partitivo y cantidades*, con uno a tres
bloques por parte (14 en total: el apóstrofo del indeterminado, la tabla sin mirar y el negativo del partitivo se juntaron con el bloque vecino, como trampa o como «Más detalle») y dos o tres chequeos después de cada bloque. En el
percorso cada parte es una misión («Lección 3/6: Indeterminados»), y «A
entrenar esta parte» arma una ronda **solo** con los ejercicios de esa
parte: sin gimnasio de verbos, sin repaso de otras semanas y sin palabras
sueltas. La semana siguiente se abre cuando están todas las partes.

Las partes se declaran en `tools/it/lessons/` (`"parts"`: título, bloques, los
ejercicios puestos a mano en `"ids"` y una expresión regular que reparte el
resto por su consigna); `"qq"` en un bloque son chequeos escritos a mano que
se preguntan todos. `tools/it/build_course.py` comprueba que las partes cubran
todos los bloques una sola vez y
manda lo que no encaja en ninguna a la última parte.

### Antes del jefe

Las semanas de jefe (13, 26, 39 y 52) traen la teoría de la estación en
repasos por tema («Repaso: pronombres, passato prossimo, reflexivos»), cada
uno con sus ejercicios, y la misión **🩹 Tus puntos débiles**: una ronda con
lo que fallaste de la estación y lo que casi no viste. Son opcionales: la
semana siguiente la abre el jefe. El jefe pregunta más de las semanas donde
acertaste menos (hasta tres turnos por semana en vez de uno) y, dentro de
cada semana, primero lo que fallaste.

### ✍️ Scrivi: tu texto de la semana

Cada semana, menos las de jefe, pide un texto corto con la función de la
semana: presentarte (semana 1), contar el fin de semana (11), pedir una
habitación con cortesía (20), opinar con congiuntivo (25), contar la vida de
Garibaldi en passato remoto (37), un texto argumentativo formal (49). La
consigna pide un mínimo de palabras (15 en A1, 60 en C1) y las estructuras de
la semana («4 verbos en passato prossimo»), y la lista se va tildando
mientras escribís. **Revisar** marca en el texto los errores que el
hispanohablante comete de verdad, con la explicación: español metido
(*cansado*), artículo que no va con el sustantivo (*una amica*, *la
problema*), *ho andato*, *mi ho lavato*, «a» personal, *il mio padre*, *mio
libro*, *a il*, *se avrei*, *penso che è* (desde el congiuntivo), *molto
pasta*, *c'è due*, *lui e alto*, *sono trenta anni*, dobles y tildes, y
además familias enteras: castellano escrito a la italiana (*perfectamente*,
*manejare*, *casita*, *andarò*), calcos (*ho che studiare*, *lo che*, *di
accordo*), preposiciones con ciudades, países, lugares y personas (*in Roma*,
*a Toscana*, *al medico*, *alla banca*) y con infinitivos (*comincio
studiare*, *voglio di*), artículos por sonido (*i snack*, *la aranciata*),
pronombres combinados (*mi la*, *gli la*), relativos (*in che*),
concordancias (*questo foto*, *i miei chiavi*, *vino rossi*), persona con
sujeto (*io aiutava*, *la gente sono*, *mi piace i*), auxiliares y
participios en todos los tiempos (*avrei andato*, *siamo tornato*, *li ho
visto*, *vivuto*), congiuntivo después de *penso che*, *benché*, *pensavo
che*, *come se*, y falsos amigos en contexto (*salgo di casa*, *un vaso
d'acqua*, *toccare la chitarra*). Las reglas se miden con un corpus de 144
textos de estudiantes con 748 errores anotados (`tools/it/scrivi_corpus.json`),
escrito en dos tandas: con la primera se armaron las reglas y la segunda,
con otros temas y otras palabras, sirvió para ver si generalizaban (de
entrada marcaron el 45 %; después de corregir por familia, el 61 %). Hoy el
corrector propio marca el 62 % del total sin marcar nada en las versiones
corregidas ni en las frases del curso, y `tools/it/test_scrivi.js` fija esos
pisos por familia. Lo que se escapa (pronombres por referente, tiempos
según el contexto, léxico) lo agarran la IA y LanguageTool. Después
podés ver un texto modelo. Lo que entregás cuenta como **output** en las
cuatro cuerdas, suma xp y los errores van al perfil de la clínica. La misión
es obligatoria para abrir la semana siguiente: es el único lugar del curso
donde escribís sin respuesta cerrada.

**Tareas situadas desde la semana 8 (v3.1).** Hasta el tramo, Scrivi pedía
«contá tu fin de semana» sin nadie del otro lado. De la 8 a la 25 las
consignas son ahora tareas de 40 a 80 palabras con **destinatario y
propósito**, como la tarea del tramo en chico (auditoría 3.0, A-nucleo E9;
el portugués ya lo tenía): un mensaje de bienvenida a un compañero nuevo con
cinco preguntas (8), cómo llegar de la estación a tu casa (9), una nota en
la heladera para el compañero que llega tarde (12), un mensaje a la futura
compañera de departamento sobre tus gustos (14), el relato para una revista
de extranjeros (15), un mail al hotel de Florencia (20), las compras del
mercado por WhatsApp con *ne* y *ci* (21), el consejo a un amigo que no sabe
si mudarse a Milán o a Bolonia (23), el mail a la responsable de personal
sobre el trabajo desde casa (25). **Desde la 14 la consigna va en
italiano.** Las estructuras de la semana siguen siendo el criterio que se
tilda; cada modelo cumple la consigna sin marcas del corrector y no usa
gramática posterior a su semana (`tools/it/sillabo.py`), y
`tools/it/test_scrivi.js` controla el largo (mínimo 40-55, modelo de hasta
80 palabras) y que desde la 14 la consigna esté en italiano.

**Segunda opinión de LanguageTool.** Al revisar, la app también manda el
texto a la API pública y gratuita de LanguageTool (sin clave; unas 20
consultas por minuto, de sobra para una persona). Lo que encuentra se suma a
la lista, con su mensaje en italiano y la corrección propuesta («Gramática
(LanguageTool): … → *piena*»); lo que el corrector propio ya marcó, con su
explicación en castellano, no se repite. La revisión local aparece al
instante y la de LanguageTool cuando llega; sin conexión o sin cupo, queda
solo la local. Se puede apagar con la casilla de la pantalla, porque el
texto se envía a sus servidores.

**Con clave, la corrección la hace la IA.** Si hay una clave cargada en
Io, Scrivi manda el texto a la IA y muestra solo su corrección: cada error
con su arreglo, el tipo de error (el mismo de la clínica, así lo que falla
va al repaso por errores) y la regla en castellano, además de si cumplió la
consigna, una devolución y el texto corregido. Lo correcto pero poco
natural aparece como sugerencia y no cuenta como error. La corrección pasa
por dos consultas: la primera corrige y la segunda, como un segundo
profesor, la revisa (saca lo que no es error o está repetido, arregla
explicaciones equivocadas y agrega lo que faltó); si la revisión falla,
queda la primera. Abajo se ve qué servicio y qué modelo corrigió y cuál
revisó, y lo mismo en «🤖 Explicame». Las reglas propias
y LanguageTool quedan de respaldo: se usan si no hay clave o si la IA no
responde, con un botón para volver a probar la IA.

**Corrector con IA (opcional).** LanguageTool casi no controla la
concordancia ni la persona del verbo en italiano. Para una corrección
completa, la app usa **Claude Haiku** (`claude-haiku-5-5`, de Anthropic) con
una clave del usuario (*console.anthropic.com/settings/keys → Create Key*,
empieza con `sk-ant-`; la API se paga por uso, y con Haiku son centavos).
La IA marca cada error del texto con su explicación en castellano y
agrega la versión corregida y una devolución. Cada pedido espera hasta 20
segundos; si Anthropic está saturado, prueba dos veces más. La clave queda
solo en el teléfono (no entra en las copias de seguridad) y el texto se
envía a Anthropic. Lo que la IA marca reemplaza lo que el corrector
propio o LanguageTool dijeron sobre las mismas palabras.

**«🤖 Explicame» en cualquier ejercicio.** Con la clave guardada (en
*Io → Corrector con IA*, el único lugar donde se cargan las claves; Scrivi
solo muestra si la IA está activa y lleva a Io), después de un error aparece el botón: la IA
explica qué está mal y la regla, y dice si la respuesta en realidad también
valía o si la corrección de la app confunde. Esos casos quedan en *Io →
Correcciones para revisar*, con un botón para copiarlos todos juntos.

El corrector propio también sabe **quién habla**: en un texto en primera
persona («Mi chiamo…», «io», «mio»), un verbo sin sujeto en otra persona se
marca (*Mi chiami → mi chiamo*, *Hanno 32 anni → ho*), igual que un adjetivo
en otro número (*sono felici → felice*, *siamo contento → contenti*) y el
singular después de un número (*32 anno*, *due fratello*).

El corrector (`docs/lang/it/scrivi.js`) usa como diccionario todo el italiano del
curso (respuestas, frases, lecturas, banco y glosario): una palabra que no
conoce no se marca como error, porque en un texto libre es más probable que
sea rara que mal escrita. `tools/it/test_scrivi.js` comprueba que los 48 textos
modelo cumplan su consigna sin marcas y que los errores típicos se detecten.

`test_game.js` verifica que ninguna semana pida nada antes de su teoría, y
`python3 tools/it/sillabo.py` lista qué ejercicio esperó a qué semana y por qué.
Si se reordena el programa, las semanas de cada tiempo se ajustan en
`TENSE_WEEK`, dentro de `tools/it/sillabo.py`.

## Contenido

| Fuente | Cantidad |
|---|---|
| Ejercicios auto-corregibles de *For Dummies* | 871 |
| Ítems propios de nivel B2/C1 en español | 144 |
| Desafíos del *Soluzioni*, con clave de respuestas | 339 grupos / 1.637 sub-ítems |
| Lecciones de teoría (una por semana) | 52, con 221 bloques |
| Tablas gramaticales y ejemplos bilingües | 76 tablas / 349 ejemplos |
| Verbos en el motor de conjugación | 96 |
| Tiempos y modos generables | 14 |

**Revisión lingüística.** Todo el contenido pasó por una revisión de italiano
nativo: banco de frases y errores, palabras, lecciones, ítems propios, lecturas
y los dos bancos extraídos de libros (este último con ~125 respuestas corregidas
en *Dummies* y errores de extracción limpiados en *Soluzioni*). Las reglas que
el corrector enuncia en español también se revisaron una por una.

**Diseño: la Riviera.** La Italia de mediodía: un cielo azul de verdad
arriba, blanco de sol abajo y los colores de las casas de Positano para todo
lo que se toca: coral, limón, albahaca y mar. Sin patrones ni sombras
gruesas: plano, vivo y legible. «La Via» es una calle, así que el logo sigue
siendo una **placa de calle romana** en travertino. En cada ejercicio la ficha
lleva un filete de sol (limón a coral), el contador dice *3 di 10* en cursiva
azul y, cuando falta poco, un aliento en italiano (*Ci sei quasi. — Ultima!*);
el veredicto llega en italiano (*Bravo!*, *Quasi! Ci sei.*, *Capita. Era
così:*) y el botón es *Avanti*. Tipografías: *Bodoni Moda* (Bodoni era de
Parma) solo en la placa «VIA C1», porque sus trazos finos desaparecen en la
pantalla del teléfono, y *Atkinson Hyperlegible Next*, diseñada para leer
fácil, para todo lo demás, servidas desde `docs/fonts/` (licencia SIL OFL,
incluida) para que funcionen sin red. Con modo oscuro: cielo de noche sobre el
mar. Sigue al teléfono, y el ☀️/🌙 de la cabecera (o el ajuste *Tema* en Io)
lo fuerza claro u oscuro.

El gimnasio de verbos genera preguntas en vez de almacenarlas: 96 verbos × 14
tiempos × 6 personas dan más de 8.000 formas distintas, con distractores tomados
de otras personas y otros tiempos del mismo verbo — es decir, los errores que un
estudiante comete de verdad.

## Estructura del repo

El núcleo es común a los dos idiomas; lo del italiano está en su paquete y en
sus herramientas. El mapa completo está en [ARQUITECTURA.md](ARQUITECTURA.md),
y dónde va cada cosa que se escribe (ítems, lecciones, lecturas, frases,
tramo C1) y qué test la controla, en [CONTENIDO.md](CONTENIDO.md).

```
docs/                    el juego (sitio estático, listo para GitHub Pages)
  index.html, sw.js, manifest.webmanifest, css/, icons/, fonts/
  js/                    el núcleo: boot, engine, drills, lezione, banca, frasi,
                         lab, letture, suoni, voci, biblioteca, tramo, app…
  lang/it/               el paquete del italiano
    lang.js, rules.js    textos de la interfaz y reglas del idioma
    conjugator.js        motor de conjugación
    diagnosi.js          diagnóstico de errores: categoría, pista y explicación
    scrivi.js            la escritura libre y su corrector
    *_data.js            frases, laboratorio, lecturas, sonidos, dictogloss,
                         examen, tramo C1…
    data/                course.json, bank.json, glossario.json, frequenza.json
                         (los compila tools/it)
    biblioteca/          los libros de dominio público (tools/lib/build_biblioteca.js)
    audio/               voces reales (tools/it/VOCES.md)
tools/it/
  build_bank.py          valida y compila el banco (bank/ → data/bank.json)
  build_course.py        arma data/course.json con authored/, lessons/ y fuentes/
  bank/                  el banco en Python legible
  authored/              ítems propios por tema
  lessons/               la teoría de las 52 semanas (s1..s4, una por estación)
  tramo/                 lecturas, escuchas y tareas largas de las semanas 27-51
  radio/                 Radio Portici: un episodio por semana, de la 6 a la 25
  fuentes/               extractos de los dos manuales y sus parches (no se publican)
  sillabo.py, lessico.py desde qué semana se puede pedir cada ejercicio y cada palabra
  check_lessons.py, check_letture.py, check_radio.py   formato y sillabo de la teoría, las lecturas y la radio
  test_*.js              los tests del italiano (npm run test:it)
  audit/                 la auditoría de contenido por pasadas (su README)
tools/lib/               lo común: pack.js, sim_carriera.js, build_tramo.js, build_radio.js,
                         build_biblioteca.js, smoke_browser.js y los test_*.js
```

## Cómo se acomoda a los cursos oficiales

Las instituciones (Dante Alighieri, Istituto Italiano di Cultura, Università
per Stranieri, con el *Profilo della lingua italiana* y manuales como *Nuovo
Espresso* o *Nuovo Contatto*) organizan el italiano en **unidades
comunicativas**: cada una dice qué se aprende a hacer, con qué gramática y en
qué campo léxico, y ocupa unas tres clases. El curso toma esa estructura sin
romper su orden gramatical:

- Cada semana lleva, además del tema de gramática, **lo que vas a poder hacer
  al final** y su campo léxico (en el briefing: «🎯 Al final de la semana:
  pedir algo en el bar y decir qué hay · Café y bar italiano»). La tabla está
  en `SAI_FARE`, dentro de `tools/it/build_course.py`, semana por semana.
- Una unidad son varias clases: por eso las semanas cargadas tienen la lección
  en partes (ver «Lecciones en partes»).
- Las cuatro estaciones siguen las bandas del MCER como esos programas: A1 en
  las semanas 1–6, A2 en 7–18, B1 en 19–28, B2 en 29–39 y C1 en 40–52, con un
  examen al cerrar cada banda. En horas, el año (~105 h con las siete sesiones
  semanales de la simulación) queda dentro del rango que esas escuelas dan a
  cada nivel sumado a lo que se practica en la app fuera de clase.

## Qué toma de la guía «Aprender italiano hasta C1 en un año»

| La guía dice | En la app |
|---|---|
| Retención sin backlog: 20-30 fichas nuevas por día, cola al día | Fichas ligeras para lo que sale bien, retiro a los cuatro aciertos, «hoy: 20» |
| Recuperación y espaciado son las únicas técnicas de alta utilidad | Todo es recuperación: ronda, ripasso, escribir de memoria, sfida del giorno |
| Cuatro destrezas de Nation en partes iguales | Medidor «Tus cuatro cuerdas» con el consejo de lo que falta |
| Cuaderno de errores itañol | Cuaderno itañol en *Io*, Clínica de errores, diagnóstico por categoría |
| Fin de semana liviano, sin parar del todo | Meta a la mitad sábado y domingo |
| Simulacros CILS por *abilità* al cierre de cada fase | Los jefes ponderan la estación y muestran el resultado por abilità |
| Vocabulario escalonado y medible | Meta de palabras por trimestre alcanzable (800 / 1.800 / 2.800 / 3.800) y *Parole* a un toque en Oggi |
| Registro formal y colocaciones en C1 | Escenas C1: la mail formal, discutir, el aneddoto, la burocracia; Martín 11-13 |
| Pronunciación explícita temprana | Escucha sin texto en la semana 1, audio en las tablas de sonidos |

## Reconstruir los datos

Los `.epub` no están en el repo. Con tus propias copias:

```sh
python3 tools/it/extract_dummies.py   ruta/al/dummies.epub   tools/it/fuentes/bank_dummies.json
python3 tools/it/extract_routledge.py ruta/al/soluzioni.epub tools/it/fuentes/bank_routledge.json
python3 tools/it/build_course.py
```

Los extractos quedan en `tools/it/fuentes/`, fuera de `docs/`: los usa el build
pero no se publican.

## Tests

```sh
npm test            # todo: italiano, portugués, lo común y los chequeos de contenido
npm run test:it     # los siete juegos de tests del italiano
npm run build       # recompila el banco, el curso, el tramo y la Biblioteca
npm run sim         # la carrera simulada de un año (falla si una semana no se domina)
```

| Test | Qué comprueba |
|---|---|
| `tools/it/test_conjugator.js` | 1.442 formas verbales |
| `tools/it/test_game.js` | datos del curso, rondas, sillabo, opciones que no regalan la respuesta |
| `tools/it/test_frasi.js` | frases, laboratorio, lecturas (incluidas las inundaciones), pausa, racha, cofre, guardado |
| `tools/it/test_diagnosi.js` | ~1.600 errores típicos inyectados en oraciones del banco |
| `tools/it/test_scrivi.js` | los textos modelo cumplen su consigna sin marcas; el corpus de errores |
| `tools/it/test_memoria.js` | FSRS, mantenimiento, noche y mañana, registro, velocidad, hábito |
| `tools/it/test_suoni.js` | datos de escucha, sesiones de Suoni, dictogloss, capa de frecuencia, examen, inundaciones |

GitHub Actions (`.github/workflows/test.yml`) corre todo en cada push: los
tests, el lint, la simulación, la prueba de humo en Chromium y que `docs/`
entero esté al día con `tools/` (detalle en [CONTENIDO.md](CONTENIDO.md)).

## Dos advertencias honestas

**El *Soluzioni* no trae soluciones.** Su edición digital deja las respuestas en
el sitio del editor, así que sus 1.632 sub-ítems **no se corrigen solos**: el
juego los presenta como desafíos abiertos que resolvés por escrito, verificás
contra el capítulo y puntuás vos. Todo lo que el juego corrige automáticamente
sale del banco de *For Dummies*, del motor de conjugación y del banco propio.

**Los desafíos del *Soluzioni* se corrigen.** (Aviso viejo, ya resuelto: 338
de los 339 grupos se juegan con corrección automática; quedan repartidos a lo
sumo 12 por semana.)

**Esto es gramática, no un curso completo.** Un año de este juego te da el
sistema gramatical del C1 con solidez, pero el C1 real también exige volumen de
lectura, escucha y producción oral. El curso es el andamio; la exposición al
idioma la tenés que poner aparte.

Los dos manuales son obra con derechos de autor y no se incluyen en el repo:
los scripts de extracción trabajan sobre las copias que tengas vos, y el material
generado es para estudio personal.

## Tramo C1: leer, escuchar y escribir en serio (semanas 27 a 51)

Hasta la semana 26 el curso crece en todo. Desde la 27, la gramática llega a
C1, pero lo que se leía, se escuchaba y se escribía seguía siendo corto:
textos de unas 94 palabras, escuchas de 100 y *Scrivi* de 60. El tramo C1 le
agrega a cada semana tres misiones obligatorias que suben de a poco hasta el
largo del CILS y el CELI:

| | Semana 27 | Semana 51 |
|---|---|---|
| 📰 Lectura larga (preguntas y *vero / falso / non si dice* en italiano) | ~350 palabras | ~900 palabras |
| 🎧 Escucha larga a dos voces (entrevista, podcast, debate, consulta radial) | ~250 palabras | ~600 palabras |
| 🖋️ Tarea integrada: un género que parte de lo leído o escuchado | 120 palabras | 250 palabras |

- **Escucha**: las preguntas se leen antes, se escucha dos veces a dos voces
  distintas (a 1× o 0,9×) y la transcripción aparece después de entregar,
  con las palabras difíciles. Suma minutos de escucha e input. También están
  en *Leggi*, en «Ascolti lunghi».
- **Tarea**: carta formal, e-mail, carta al diario, artículo, reseña,
  texto argumentativo, síntesis o informe. La consigna está en italiano y
  pide usar lo leído o escuchado. Sin IA, la revisión no se engaña con
  relleno:
  - **Obligatorios**: la extensión mínima, la variedad léxica (relación
    tipo/token sobre las primeras 150 palabras, y ninguna palabra que tape
    el texto), no copiar frases de la fuente (secuencias de cinco palabras)
    y cubrir los puntos de la consigna.
  - **Sugerencias**: apertura y cierre del género, título, párrafos,
    conectores y lo que marca el corrector de la semana.

  Con una clave de IA, además se califica con la rúbrica C1 (*adeguatezza,
  coesione, correttezza, lessico*). El modelo se puede ver después.
- Datos: `tools/it/tramo/wNN.json` (una semana cada uno) y `generi.json`
  (los géneros y sus marcas). `npm run build` arma
  `docs/lang/it/tramo_data.js`, y `tools/lib/test_tramo.js` controla los
  largos de cada semana, la clave de las preguntas, que el modelo pase la
  revisión y que la basura, la copia y los textos cortos no la pasen.

### Palabras de la semana B2-C1 y un corrector que no molesta al nivel C1 (v2.7)

- **Palabras**: de la semana 27 a la 51, veinte palabras por semana elegidas
  a mano (`tools/it/bank/parole_c1.py`). Son léxico B2-C1 de la lista de
  frecuencia (verbos de decir, conectores de registro alto, sustantivos
  abstractos, falsos amigos), casi siempre tomado de la lectura o la escucha
  larga de esa semana, así se aprende en el contexto que ya se leyó. Antes
  eran entre 1 y 15 por semana, elegidas solas de los ejercicios. Palabras
  enseñadas de las bandas B2 y C1: de 38 y 41 a 105 y 93.
- **Corrector de *Scrivi* y de las tareas**: en todo el texto nativo del
  tramo (unas 30.000 palabras) marcaba 41 falsas alarmas y ahora marca 12.
  - No marca lo que está citado (entre comillas cortas o después de
    *la parola…*).
  - Aprende el léxico de las escuchas y los modelos.
  - Suma *rendere* y *piovere* al conjugador.
  - Corrige las reglas que confundían *uno dei*, *la regista*, *le orecchie*,
    *il moto*, *la escluderei*, *si fermò due volte*, *se + congiuntivo*,
    *Pensi che…* o *Senti, …* dichos a alguien, y la elisión opcional
    (*lo ha*).

  `tools/lib/test_tramo.js` controla que las falsas alarmas no vuelvan a
  subir y `test_scrivi.js`, que los errores reales se sigan detectando.

## Las capas: Input, Práctica, Referencia

Cada pestaña es una capa. **Leggi** es el input: arriba lo de esta semana (la
lectura y la escucha pendientes, el capítulo recomendado de la Biblioteca y
los minutos leídos y escuchados en 7 días), después Historias, La semana,
Lecturas largas, Escuchas y Biblioteca, plegadas por estación con la actual
abierta, y la velocidad de lectura: cada lectura se cronometra sola y cuenta
si después entendiste el 70 % o más, con la curva del año y los textos para
releer contra el reloj. **Allena** es la práctica, con el mismo patrón.
**Consultar** es la referencia: un diccionario del curso (glosa, semana,
nivel y frecuencia, la forma verbal, combinaciones y usos reales ya leídos),
Mi gramática (también lo que todavía no llegó, con aviso), Palabra por
palabra, los mapas de preposiciones, las fórmulas fijas y los contrastes de
Tres lenguas. En el percorso aparecen, opcionales, «Leé un capítulo» de la
Biblioteca y «Tres vueltas». Qué hace cada módulo (Escritura guiada,
Variaciones, C-test, Ordená, Tres vueltas, Reformulación, Mapas, Ubicación,
Mi gramática, Desglose, Tres lenguas, Frecuencia): `ARQUITECTURA.md`, «Las
capas y los módulos».
