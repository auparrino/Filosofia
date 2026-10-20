/* Serie «Radio»: generado por tools/lib/build_radio.js a partir de tools/it/radio/.
   No editar a mano: editá los JSON de cada semana y corré npm run build. */
(function (root) {
  "use strict";
  root.RADIO_DATA = {
 "name": "Radio Portici",
 "label": "Radio",
 "blurb": "La radio del barrio en Bologna, de la semana 6 a la 25: un programa corto por semana, a dos voces, con la gramática y las palabras de la semana. Sara y Dario conducen «Buongiorno Portici»; llaman Martín (el argentino de las lecturas), la signora Franca y Leo, el corresponsal en bicicleta. Dos escuchas con las preguntas a la vista y la transcripción al final.",
 "metaFrom": 14,
 "criterion": 60,
 "personaggi": {
  "Sara": "conduce «Buongiorno Portici»; boloñesa, ordenada, corre en los Giardini Margherita",
  "Dario": "co-conductor; napolitano, vive en Bologna hace poco, siempre con hambre y siempre tarde",
  "Martín": "el argentino de las lecturas (via Zamboni); llama cuando tiene una duda o una novedad",
  "Franca": "la signora Franca, 78 años, vecina de via del Pratello; llama casi todas las semanas",
  "Leo": "estudiante de 20 años, corresponsal en bicicleta"
 },
 "EPISODI": [
  {
   "week": 6,
   "level": "A1",
   "title": "Che cosa fate stasera?",
   "genre": "programma del mattino",
   "es": "Es viernes a la mañana en Radio Portici, la radio del barrio en Bologna. Sara, la conductora, le pregunta a Dario, su compañero, qué planes tiene para el fin de semana.",
   "speakers": [
    "Sara",
    "Dario"
   ],
   "turns": [
    [
     "A",
     "Buongiorno a tutti, qui è Radio Portici e io sono Sara. Oggi è venerdì e con me c'è Dario. Dario, che cosa fai stasera?"
    ],
    [
     "B",
     "Buongiorno, Sara! Stasera esco con due amici. Andiamo in piazza Maggiore: c'è un concerto gratis."
    ],
    [
     "A",
     "Che bello! E dopo, dove andate?"
    ],
    [
     "B",
     "Non lo so. Forse andiamo a mangiare una pizza. Vuoi venire con noi?"
    ],
    [
     "A",
     "Grazie, ma non posso. Stasera devo stare a casa: domani mattina vado al mercato con la mamma."
    ],
    [
     "B",
     "Al mercato il sabato? C'è tanta gente!"
    ],
    [
     "A",
     "Sì, ma lì trovo sempre il pane buono e incontro gli amici del quartiere. E tu, domani che cosa fai?"
    ],
    [
     "B",
     "Domani dormo! E domenica torno a Napoli: la nonna fa il ragù."
    ],
    [
     "A",
     "Allora buon viaggio! E voi, cari ascoltatori, che cosa fate questo fine settimana? Scrivete a Radio Portici: vogliamo sapere tutto!"
    ]
   ],
   "gloss": {
    "stasera": "esta noche",
    "gratis": "gratis",
    "quartiere": "barrio",
    "ragù": "salsa de carne que se cocina muchas horas",
    "ascoltatori": "oyentes",
    "fine settimana": "fin de semana"
   },
   "questions": [
    [
     "¿Adónde va Dario esta noche?",
     [
      "A un concierto gratis en piazza Maggiore",
      "Al mercado del barrio con su mamá",
      "A Nápoles, a comer con su abuela",
      "A la radio, a trabajar con Sara"
     ],
     "A un concierto gratis en piazza Maggiore"
    ],
    [
     "¿Por qué Sara no sale esta noche?",
     [
      "Porque tiene que trabajar en la radio",
      "Porque mañana temprano va al mercado",
      "Porque no le gustan los conciertos",
      "Porque no tiene plata para la pizza"
     ],
     "Porque mañana temprano va al mercado"
    ],
    [
     "¿Qué hace Dario el domingo?",
     [
      "Duerme todo el día",
      "Va al mercado con Sara",
      "Vuelve a Nápoles",
      "Escucha la radio"
     ],
     "Vuelve a Nápoles"
    ]
   ],
   "info": [
    [
     "Sara va al mercado el sábado a la mañana.",
     true
    ],
    [
     "El concierto de piazza Maggiore es caro.",
     false
    ],
    [
     "Dario vive con su abuela en Bologna.",
     false
    ]
   ],
   "grammatica": {
    "label": "presente de los irregulares: andare, fare, uscire, volere, potere, dovere",
    "forme": [
     "fai",
     "esco",
     "andiamo",
     "andate",
     "vuoi",
     "posso",
     "devo",
     "vado",
     "fa",
     "fate",
     "vogliamo"
    ]
   },
   "parole": [
    [
     "esco",
     "uscire"
    ],
    [
     "andiamo",
     "andare"
    ],
    [
     "venire",
     "venire"
    ],
    [
     "vuoi",
     "volere"
    ],
    [
     "posso",
     "potere"
    ],
    [
     "devo",
     "dovere"
    ],
    [
     "stare",
     "stare"
    ],
    [
     "trovo",
     "trovare"
    ],
    [
     "incontro",
     "incontrare"
    ],
    [
     "torno",
     "tornare"
    ],
    [
     "fai",
     "fare"
    ],
    [
     "sapere",
     "sapere"
    ]
   ],
   "qlang": "es",
   "infoPrompt": "¿Lo dice o no lo dice?",
   "infoYes": "Lo dice",
   "infoNo": "No lo dice"
  },
  {
   "week": 7,
   "level": "A2",
   "title": "Che ore sono a Rosario?",
   "genre": "telefonata in diretta",
   "es": "Temprano a la mañana llama a la radio Martín, el argentino que vive en via Zamboni. Tiene una pregunta sobre la hora: hoy es un día especial para su familia.",
   "speakers": [
    "Sara",
    "Martín"
   ],
   "turns": [
    [
     "A",
     "Sono le sette e mezza e siete su Radio Portici. Abbiamo una telefonata. Pronto?"
    ],
    [
     "B",
     "Pronto, Sara? Sono Martín, lo studente argentino di via Zamboni."
    ],
    [
     "A",
     "Ciao, Martín! Come stai?"
    ],
    [
     "B",
     "Bene, grazie. Ho una domanda. Mia madre abita a Rosario e oggi è il suo compleanno: compie sessant'anni. Qui è mattina, ma lì che ore sono?"
    ],
    [
     "A",
     "Allora: in estate la differenza è di cinque ore, in inverno di quattro. Oggi è il ventotto febbraio, quindi a Rosario sono le tre e mezza di notte."
    ],
    [
     "B",
     "Di notte? Allora adesso non telefono!"
    ],
    [
     "A",
     "No, meglio di no. Telefona a mezzogiorno: da noi è mezzogiorno, da voi sono le otto di mattina."
    ],
    [
     "B",
     "Perfetto. E stasera, alle nove, facciamo una videochiamata con tutta la famiglia."
    ],
    [
     "A",
     "Tanti auguri alla mamma, Martín! E voi, ascoltatori: alle otto e un quarto c'è il meteo e alle nove le notizie della giornata."
    ]
   ],
   "gloss": {
    "compleanno": "cumpleaños",
    "compie": "cumple (años)",
    "differenza": "diferencia",
    "videochiamata": "videollamada",
    "tanti auguri": "¡feliz cumpleaños!, ¡muchas felicidades!",
    "meteo": "el pronóstico del tiempo",
    "ascoltatori": "oyentes",
    "giornata": "(el) día, la jornada"
   },
   "questions": [
    [
     "¿Por qué llama Martín a la radio?",
     [
      "Quiere saber qué hora es en Rosario",
      "Quiere mandarle saludos a su mamá",
      "Quiere saber el pronóstico del tiempo",
      "Quiere escuchar una canción argentina"
     ],
     "Quiere saber qué hora es en Rosario"
    ],
    [
     "¿Cuántas horas de diferencia hay hoy entre Bologna y Rosario?",
     [
      "Tres horas",
      "Cuatro horas",
      "Cinco horas",
      "Seis horas"
     ],
     "Cuatro horas"
    ],
    [
     "¿Cuándo va a llamar Martín a su mamá?",
     [
      "Ahora, a las siete y media",
      "A las tres y media de la noche",
      "Al mediodía, hora de Italia",
      "Mañana a la mañana"
     ],
     "Al mediodía, hora de Italia"
    ]
   ],
   "info": [
    [
     "La mamá de Martín cumple sesenta años.",
     true
    ],
    [
     "Martín cumple años el 28 de febrero.",
     false
    ],
    [
     "A las ocho y cuarto dan el pronóstico del tiempo.",
     true
    ]
   ],
   "grammatica": {
    "label": "la hora, las fechas y los números",
    "forme": [
     "sono le sette e mezza",
     "le tre e mezza",
     "mezzogiorno",
     "le otto",
     "alle nove",
     "alle otto e un quarto",
     "il ventotto febbraio",
     "sessant'anni"
    ]
   },
   "parole": [
    [
     "mattina",
     "mattina"
    ],
    [
     "ore",
     "ora"
    ],
    [
     "estate",
     "estate"
    ],
    [
     "notte",
     "notte"
    ],
    [
     "mezzogiorno",
     "mezzogiorno"
    ],
    [
     "mezza",
     "mezzo"
    ],
    [
     "quarto",
     "quarto"
    ]
   ],
   "qlang": "es",
   "infoPrompt": "¿Lo dice o no lo dice?",
   "infoYes": "Lo dice",
   "infoNo": "No lo dice"
  },
  {
   "week": 8,
   "level": "A2",
   "title": "Il gioco «Dove sono?»",
   "genre": "gioco radiofonico",
   "es": "Todos los lunes Radio Portici juega a «¿Dónde estoy?»: Leo, el corresponsal en bicicleta, recorre la ciudad y cuenta el camino; Sara hace preguntas hasta adivinar el lugar.",
   "speakers": [
    "Sara",
    "Leo"
   ],
   "turns": [
    [
     "A",
     "Buongiorno! È lunedì e, come ogni lunedì, c'è il gioco «Dove sono?». Leo è in bicicletta da qualche parte in città. Leo, mi senti?"
    ],
    [
     "B",
     "Ti sento benissimo, Sara!"
    ],
    [
     "A",
     "Allora, dove sei? In quale strada?"
    ],
    [
     "B",
     "Eh, questo è il gioco! Sono in una via lunga, con i portici. Vado dritto e a destra c'è una porta antica della città."
    ],
    [
     "A",
     "Una porta... Ma quante porte ci sono a Bologna? Tante! E adesso che cosa fai?"
    ],
    [
     "B",
     "All'incrocio giro a sinistra. Poi attraverso la strada e comincio a salire. Qui c'è poca gente: qualche turista e tanti bolognesi in tuta."
    ],
    [
     "A",
     "Perché salgono? Che cosa cercano?"
    ],
    [
     "B",
     "Cercano una chiesa. È in alto, sopra la città, e da lì c'è una vista bellissima."
    ],
    [
     "A",
     "Ho un dubbio... Sei sotto il portico di San Luca?"
    ],
    [
     "B",
     "Esatto! Brava, Sara!"
    ],
    [
     "A",
     "E voi, cari ascoltatori: quanti archi ha questo portico? Chi sa la risposta scrive a Radio Portici."
    ]
   ],
   "gloss": {
    "da qualche parte": "en algún lugar",
    "benissimo": "muy bien, perfecto",
    "antica": "antigua",
    "salire": "subir",
    "salgono": "suben",
    "tuta": "ropa deportiva, jogging",
    "vista": "vista, panorama",
    "archi": "arcos",
    "ascoltatori": "oyentes"
   },
   "questions": [
    [
     "¿Cómo se mueve Leo por la ciudad?",
     [
      "En bicicleta",
      "En colectivo",
      "A pie",
      "En tren"
     ],
     "En bicicleta"
    ],
    [
     "¿Qué hace Leo en el cruce?",
     [
      "Dobla a la derecha",
      "Dobla a la izquierda",
      "Sigue derecho",
      "Se para un rato a descansar"
     ],
     "Dobla a la izquierda"
    ],
    [
     "¿Qué buscan las personas que suben?",
     [
      "Una puerta antigua",
      "Un bar con vista",
      "Una iglesia en lo alto",
      "La bicicleta de Leo"
     ],
     "Una iglesia en lo alto"
    ]
   ],
   "info": [
    [
     "El juego «Dove sono?» es todos los lunes.",
     true
    ],
    [
     "En la subida hay mucha gente.",
     false
    ],
    [
     "Sara adivina el lugar.",
     true
    ]
   ],
   "grammatica": {
    "label": "las preguntas: dove, quale, quante, che cosa, perché, chi",
    "forme": [
     "dove sei",
     "in quale strada",
     "quante porte",
     "che cosa fai",
     "perché salgono",
     "che cosa cercano",
     "quanti archi",
     "chi sa"
    ]
   },
   "parole": [
    [
     "dritto",
     "dritto"
    ],
    [
     "destra",
     "destra"
    ],
    [
     "incrocio",
     "incrocio"
    ],
    [
     "giro",
     "girare"
    ],
    [
     "sinistra",
     "sinistra"
    ],
    [
     "attraverso",
     "attraversare"
    ],
    [
     "cercano",
     "cercare"
    ],
    [
     "dubbio",
     "dubbio"
    ],
    [
     "strada",
     "strada"
    ],
    [
     "via",
     "via"
    ]
   ],
   "qlang": "es",
   "infoPrompt": "¿Lo dice o no lo dice?",
   "infoYes": "Lo dice",
   "infoNo": "No lo dice"
  },
  {
   "week": 9,
   "level": "A2",
   "title": "Dario è in viaggio",
   "genre": "collegamento dalla stazione",
   "es": "Lunes a la mañana: Dario todavía no llegó a la radio. Sara lo llama por teléfono y él cuenta, en directo, dónde está, de dónde viene y cómo va a llegar.",
   "speakers": [
    "Sara",
    "Dario"
   ],
   "turns": [
    [
     "A",
     "Buongiorno da Radio Portici! Oggi sono sola in studio: Dario non c'è. Telefoniamo... Dario, dove sei?"
    ],
    [
     "B",
     "Ciao, Sara! Sono alla stazione, sul binario tre. Arrivo da Napoli, in treno."
    ],
    [
     "A",
     "Da Napoli? Ma il treno non arriva alle sette?"
    ],
    [
     "B",
     "Di solito sì, ma oggi è in ritardo di un'ora. Aspetto un amico: porta la valigia, perché io ho già uno zaino piccolo e una borsa di mozzarelle."
    ],
    [
     "A",
     "Mozzarelle per la radio? Bravo! E come vieni qui? In autobus?"
    ],
    [
     "B",
     "No, l'autobus per il centro è pieno. Vengo a piedi: la stazione non è lontana dallo studio, sono venti minuti."
    ],
    [
     "A",
     "E perché non prendi la bicicletta? Qui fuori ci sono le bici del Comune."
    ],
    [
     "B",
     "Con la borsa delle mozzarelle? Impossibile! Esco dalla stazione, vado in via dell'Indipendenza, sotto i portici, e arrivo in piazza."
    ],
    [
     "A",
     "Va bene. Io resto qui con gli ascoltatori e metto un po' di musica. Ma prima, bevi un caffè al bar dello studio: offro io!"
    ],
    [
     "B",
     "Grazie, Sara! Arrivo tra venti minuti. Con le mozzarelle!"
    ]
   ],
   "gloss": {
    "in ritardo": "atrasado, con demora",
    "valigia": "valija",
    "zaino": "mochila",
    "mozzarelle": "mozzarelas",
    "bici del Comune": "bicicletas públicas de la ciudad",
    "offro io": "invito yo",
    "ascoltatori": "oyentes"
   },
   "questions": [
    [
     "¿Dónde está Dario cuando Sara lo llama?",
     [
      "En el andén tres de la estación",
      "En el colectivo, cerca del centro",
      "En el bar de la radio, tomando un café",
      "En Nápoles, en la casa de su familia"
     ],
     "En el andén tres de la estación"
    ],
    [
     "¿Por qué Dario no toma el colectivo?",
     [
      "Porque tiene que esperar a un amigo",
      "Porque el colectivo al centro está lleno",
      "Porque no tiene boleto",
      "Porque prefiere la bicicleta"
     ],
     "Porque el colectivo al centro está lleno"
    ],
    [
     "¿Qué trae Dario para la radio?",
     [
      "Una valija con ropa de invierno",
      "Una bicicleta",
      "Mozzarellas de Nápoles",
      "Un café"
     ],
     "Mozzarellas de Nápoles"
    ]
   ],
   "info": [
    [
     "El tren de Dario llega una hora tarde.",
     true
    ],
    [
     "Dario va a la radio en bicicleta.",
     false
    ],
    [
     "Sara invita el café.",
     true
    ]
   ],
   "grammatica": {
    "label": "las preposiciones de base: a, da, in, su, per, con",
    "forme": [
     "alla stazione",
     "sul binario",
     "da Napoli",
     "in treno",
     "in autobus",
     "a piedi",
     "per il centro",
     "dallo studio",
     "dalla stazione",
     "con gli ascoltatori",
     "tra venti minuti"
    ]
   },
   "parole": [
    [
     "binario",
     "binario"
    ],
    [
     "aspetto",
     "aspettare"
    ],
    [
     "porta",
     "portare"
    ],
    [
     "piccolo",
     "piccolo"
    ],
    [
     "autobus",
     "autobus"
    ],
    [
     "piedi",
     "piede"
    ],
    [
     "resto",
     "restare"
    ],
    [
     "bevi",
     "bere"
    ]
   ],
   "qlang": "es",
   "infoPrompt": "¿Lo dice o no lo dice?",
   "infoYes": "Lo dice",
   "infoNo": "No lo dice"
  },
  {
   "week": 10,
   "level": "A2",
   "title": "Un regalo per Tommaso",
   "genre": "telefonata in diretta",
   "es": "Llama la signora Franca, una vecina del barrio que escucha la radio todas las mañanas. Su nieto cumple años y ella no sabe qué regalarle: le pide ayuda a Sara.",
   "speakers": [
    "Sara",
    "Franca"
   ],
   "turns": [
    [
     "A",
     "Abbiamo un'altra telefonata. Pronto, chi parla?"
    ],
    [
     "B",
     "Buongiorno, sono la signora Franca, di via del Pratello. Vi ascolto ogni mattina!"
    ],
    [
     "A",
     "Buongiorno, signora Franca! Grazie. Come la possiamo aiutare?"
    ],
    [
     "B",
     "Ecco, sabato è il compleanno di mio nipote Tommaso: compie sedici anni. Voglio fargli un regalo, ma non so che cosa. Mi date un'idea?"
    ],
    [
     "A",
     "Certo! Gli piacciono i libri? Può regalargli un bel romanzo."
    ],
    [
     "B",
     "No, no. I libri non li legge: li guarda e basta. Lui ascolta la musica tutto il giorno."
    ],
    [
     "A",
     "Allora gli regala dei biglietti per un concerto! Così passa una bella sera con gli amici, e lei lo fa felice."
    ],
    [
     "B",
     "Che bella idea! Ma io i biglietti non li so comprare su internet."
    ],
    [
     "A",
     "Non è un problema: li compra al teatro Duse, in via Cartoleria. Oppure chiede aiuto a sua figlia."
    ],
    [
     "B",
     "Ha ragione. Adesso la chiamo subito. Grazie, Sara, siete gentilissimi!"
    ],
    [
     "A",
     "Grazie a lei, signora Franca! E tanti auguri a Tommaso. Lo abbracciamo tutti da Radio Portici!"
    ]
   ],
   "gloss": {
    "nipote": "nieto",
    "compie": "cumple (años)",
    "romanzo": "novela",
    "e basta": "y nada más",
    "gentilissimi": "muy amables"
   },
   "questions": [
    [
     "¿Qué quiere hacer la signora Franca?",
     [
      "Comprar entradas para ella",
      "Hacerle un regalo a su nieto",
      "Invitar a Sara a un concierto",
      "Aprender a comprar por internet"
     ],
     "Hacerle un regalo a su nieto"
    ],
    [
     "¿Por qué un libro no es un buen regalo para Tommaso?",
     [
      "Porque ya tiene muchos",
      "Porque no lee libros",
      "Porque son caros",
      "Porque su abuela los lee"
     ],
     "Porque no lee libros"
    ],
    [
     "¿Qué le aconseja Sara para comprar las entradas?",
     [
      "Comprarlas en el teatro o pedirle ayuda a la hija",
      "Comprarlas por internet con Tommaso",
      "Pedirle las entradas a la radio",
      "Esperar el cumpleaños de Tommaso"
     ],
     "Comprarlas en el teatro o pedirle ayuda a la hija"
    ]
   ],
   "info": [
    [
     "Tommaso cumple dieciséis años el sábado.",
     true
    ],
    [
     "A Tommaso le gusta la música.",
     true
    ],
    [
     "La signora Franca compra las entradas por internet.",
     false
    ]
   ],
   "grammatica": {
    "label": "los pronombres de objeto directo e indirecto",
    "forme": [
     "la possiamo aiutare",
     "fargli",
     "mi date",
     "gli piacciono",
     "regalargli",
     "li legge",
     "li guarda",
     "gli regala",
     "lo fa felice",
     "li compra",
     "la chiamo",
     "lo abbracciamo"
    ]
   },
   "parole": [
    [
     "ascolto",
     "ascoltare"
    ],
    [
     "aiutare",
     "aiutare"
    ],
    [
     "ecco",
     "ecco"
    ],
    [
     "pronto",
     "pronto"
    ],
    [
     "chiamo",
     "chiamare"
    ],
    [
     "abbracciamo",
     "abbracciare"
    ],
    [
     "signora",
     "signore"
    ],
    [
     "ascolta",
     "ascoltare"
    ]
   ],
   "qlang": "es",
   "infoPrompt": "¿Lo dice o no lo dice?",
   "infoYes": "Lo dice",
   "infoNo": "No lo dice"
  },
  {
   "week": 11,
   "level": "A2",
   "title": "Com'è andato il fine settimana?",
   "genre": "chiacchierata del lunedì",
   "es": "Lunes en Radio Portici: Sara y Dario se cuentan qué hicieron el fin de semana. Uno se fue de paseo y el otro se quedó en Bologna.",
   "speakers": [
    "Sara",
    "Dario"
   ],
   "turns": [
    [
     "A",
     "Buon lunedì a tutti! Dario, com'è andato il fine settimana? Hai la faccia un po' stanca..."
    ],
    [
     "B",
     "Ciao, Sara! Sabato sono andato in gita al mare con due amici. Abbiamo preso il treno delle sette e siamo arrivati a Rimini alle nove."
    ],
    [
     "A",
     "Al mare a marzo? E che cosa avete fatto?"
    ],
    [
     "B",
     "Abbiamo camminato sulla spiaggia, abbiamo mangiato il pesce e ho assaggiato la piadina con lo squacquerone. Buonissima! Ma è successa una cosa..."
    ],
    [
     "A",
     "Che cosa è successo?"
    ],
    [
     "B",
     "Domenica la mia squadra ha giocato contro il Bologna e ha perso tre a zero. Ho visto la partita in un bar pieno di bolognesi!"
    ],
    [
     "A",
     "Povero Dario! Io invece sono rimasta in città. Sabato ho ricevuto la visita di mia sorella e abbiamo scelto un ristorante nuovo in via del Pratello."
    ],
    [
     "B",
     "E com'è?"
    ],
    [
     "A",
     "Bello, ma domenica ha chiuso per il ponte: siamo arrivate e abbiamo trovato la porta chiusa! Allora abbiamo cucinato a casa."
    ],
    [
     "B",
     "E il Bologna ha vinto. Per te è stato un buon fine settimana!"
    ],
    [
     "A",
     "Sì, ma non ho viaggiato come te. E voi, ascoltatori, che cosa avete fatto lo scorso fine settimana? Scrivete a Radio Portici!"
    ]
   ],
   "gloss": {
    "faccia": "cara",
    "piadina": "pan chato de la Romaña, relleno",
    "squacquerone": "queso fresco, blando, de la Romaña",
    "povero": "pobre",
    "ponte": "fin de semana largo (el «puente»)",
    "ascoltatori": "oyentes"
   },
   "questions": [
    [
     "¿Adónde fue Dario el sábado?",
     [
      "A la playa de Rimini, con dos amigos",
      "A Nápoles, a ver a su familia",
      "A un restaurante de via del Pratello",
      "A la cancha, a ver al Bologna"
     ],
     "A la playa de Rimini, con dos amigos"
    ],
    [
     "¿Qué le pasó a Dario el domingo?",
     [
      "Perdió el tren de vuelta a Bologna",
      "Su equipo perdió tres a cero",
      "Comió pescado en mal estado",
      "No encontró un bar abierto"
     ],
     "Su equipo perdió tres a cero"
    ],
    [
     "¿Por qué Sara y su hermana cocinaron en casa?",
     [
      "Porque el restaurante estaba cerrado",
      "Porque no tenían plata",
      "Porque llovía mucho",
      "Porque la hermana cocina muy bien"
     ],
     "Porque el restaurante estaba cerrado"
    ]
   ],
   "info": [
    [
     "Dario llegó a Rimini a las nueve.",
     true
    ],
    [
     "Dario vio el partido en el estadio.",
     false
    ],
    [
     "El domingo Sara fue al mar.",
     false
    ]
   ],
   "grammatica": {
    "label": "el passato prossimo con avere y con essere",
    "forme": [
     "sono andato",
     "abbiamo preso",
     "siamo arrivati",
     "avete fatto",
     "ho assaggiato",
     "è successa",
     "ha perso",
     "sono rimasta",
     "ho ricevuto",
     "abbiamo scelto",
     "ha chiuso",
     "ha vinto",
     "ho viaggiato"
    ]
   },
   "parole": [
    [
     "gita",
     "gita"
    ],
    [
     "spiaggia",
     "spiaggia"
    ],
    [
     "assaggiato",
     "assaggiare"
    ],
    [
     "successo",
     "succedere"
    ],
    [
     "perso",
     "perdere"
    ],
    [
     "rimasta",
     "rimanere"
    ],
    [
     "ricevuto",
     "ricevere"
    ],
    [
     "scelto",
     "scegliere"
    ],
    [
     "ponte",
     "ponte"
    ],
    [
     "chiuso",
     "chiudere"
    ],
    [
     "vinto",
     "vincere"
    ],
    [
     "viaggiato",
     "viaggiare"
    ],
    [
     "scorso",
     "scorso"
    ]
   ],
   "qlang": "es",
   "infoPrompt": "¿Lo dice o no lo dice?",
   "infoYes": "Lo dice",
   "infoNo": "No lo dice"
  },
  {
   "week": 12,
   "level": "A2",
   "title": "Dario, riposati!",
   "genre": "rubrica «Stare bene»",
   "es": "Dario llega a la radio con la voz rara. Sara le pregunta cómo se siente, cómo es su día normal y le da unos cuantos consejos.",
   "speakers": [
    "Sara",
    "Dario"
   ],
   "turns": [
    [
     "A",
     "Buongiorno e benvenuti alla rubrica «Stare bene». Oggi il paziente è in studio con me: Dario, come ti senti?"
    ],
    [
     "B",
     "Male, Sara. Mi fa male la gola e anche la testa. Stamattina ho quasi perso la voce."
    ],
    [
     "A",
     "Eh, lo sento! Ma dimmi: com'è la tua giornata di solito?"
    ],
    [
     "B",
     "Di solito mi sveglio alle sei, mi alzo subito e vengo qui in bicicletta. La sera esco con gli amici e mi addormento tardi, all'una o alle due."
    ],
    [
     "A",
     "Ecco il problema! Allora, ascolta i consigli della dottoressa Sara. Prima: stasera non uscire. Resta a casa e vai a letto presto."
    ],
    [
     "B",
     "Presto? Alle dieci?"
    ],
    [
     "A",
     "Alle dieci, sì. Secondo: bevi molta acqua e un tè caldo con il miele. Terzo: dopo la trasmissione scendi in farmacia e chiedi uno sciroppo per la gola."
    ],
    [
     "B",
     "E domani? Devo venire in radio?"
    ],
    [
     "A",
     "No. Domani fermati un giorno e stai a letto. Domenica, se ti senti meglio, facciamo una passeggiata ai Giardini Margherita."
    ],
    [
     "B",
     "Va bene, dottoressa. Ma non ti arrabbiare se domani mi sveglio alle sei per abitudine!"
    ],
    [
     "A",
     "Non mi arrabbio. Ma tieni il telefono spento e dormi! E voi, ascoltatori, che cosa fate quando avete mal di gola?"
    ]
   ],
   "gloss": {
    "rubrica": "sección (de un programa)",
    "paziente": "paciente",
    "mi fa male": "me duele",
    "dimmi": "decime",
    "miele": "miel",
    "trasmissione": "programa, transmisión",
    "sciroppo": "jarabe",
    "per abitudine": "por costumbre",
    "spento": "apagado",
    "ascoltatori": "oyentes"
   },
   "questions": [
    [
     "¿Qué le duele a Dario?",
     [
      "La garganta y la cabeza",
      "La espalda y las piernas",
      "Los ojos y los oídos",
      "El estómago"
     ],
     "La garganta y la cabeza"
    ],
    [
     "¿Qué hace Dario de noche, normalmente?",
     [
      "Trabaja en la radio hasta tarde",
      "Sale con amigos y se duerme tarde",
      "Se acuesta a las diez",
      "Va en bicicleta al parque"
     ],
     "Sale con amigos y se duerme tarde"
    ],
    [
     "¿Qué tiene que pedir Dario en la farmacia?",
     [
      "Un té con miel",
      "Un jarabe para la garganta",
      "Algo para dormir toda la noche",
      "Una receta del médico"
     ],
     "Un jarabe para la garganta"
    ]
   ],
   "info": [
    [
     "Dario se despierta a las seis.",
     true
    ],
    [
     "Sara le dice que mañana vaya a la radio.",
     false
    ],
    [
     "Sara y Dario van a correr el domingo.",
     false
    ]
   ],
   "grammatica": {
    "label": "los reflexivos en presente y el imperativo de tú",
    "forme": [
     "ti senti",
     "mi sveglio",
     "mi alzo",
     "mi addormento",
     "ascolta",
     "non uscire",
     "resta",
     "vai a letto",
     "bevi",
     "scendi",
     "chiedi",
     "fermati",
     "non ti arrabbiare",
     "tieni",
     "dormi"
    ]
   },
   "parole": [
    [
     "gola",
     "gola"
    ],
    [
     "testa",
     "testa"
    ],
    [
     "solito",
     "solito"
    ],
    [
     "sveglio",
     "svegliarsi"
    ],
    [
     "alzo",
     "alzarsi"
    ],
    [
     "addormento",
     "addormentarsi"
    ],
    [
     "scendi",
     "scendere"
    ],
    [
     "fermati",
     "fermarsi"
    ],
    [
     "arrabbiare",
     "arrabbiarsi"
    ],
    [
     "tieni",
     "tenere"
    ],
    [
     "senti",
     "sentirsi"
    ],
    [
     "domenica",
     "domenica"
    ]
   ],
   "qlang": "es",
   "infoPrompt": "¿Lo dice o no lo dice?",
   "infoYes": "Lo dice",
   "infoNo": "No lo dice"
  },
  {
   "week": 14,
   "level": "A2",
   "title": "Che cosa ti piace di Bologna?",
   "genre": "sondaggio in diretta",
   "es": "Radio Portici hace una encuesta: ¿qué les gusta y qué no de la ciudad? Llama otra vez Martín, que ya lleva unos meses en Bologna, y termina recibiendo una invitación.",
   "speakers": [
    "Sara",
    "Martín"
   ],
   "turns": [
    [
     "A",
     "Oggi facciamo un sondaggio: che cosa vi piace di Bologna e che cosa no? In linea c'è un amico della radio: Martín!"
    ],
    [
     "B",
     "Ciao, Sara! Che bello sentirti."
    ],
    [
     "A",
     "Allora, Martín, tu sei qui da qualche mese. Che cosa ti piace di questa città?"
    ],
    [
     "B",
     "Mi piacciono i portici, perché quando piove non serve l'ombrello. E mi piace tantissimo il cibo: i tortellini, la mortadella, il gelato di via Castiglione..."
    ],
    [
     "A",
     "E che cosa non ti piace?"
    ],
    [
     "B",
     "Non mi piace la nebbia d'inverno. E poi mi manca il mare, e mi mancano gli amici e le grigliate della domenica."
    ],
    [
     "A",
     "Ti capisco. E lo sport? Ti piace il calcio italiano?"
    ],
    [
     "B",
     "Sì, ma non ho ancora una squadra. Sabato ho visto una partita del Bologna allo stadio: mi è sembrata lenta, ma i tifosi sono simpaticissimi!"
    ],
    [
     "A",
     "E la sera che cosa fai? Ti piace ballare?"
    ],
    [
     "B",
     "Mi piace suonare la chitarra, ma ballare... no, cioè, ballo solo il tango, e male!"
    ],
    [
     "A",
     "Allora ti faccio un invito: venerdì la radio organizza una festa in piazza Santo Stefano, con musica dal vivo. Ti va di venire a suonare una canzone argentina?"
    ],
    [
     "B",
     "Mi dispiace, venerdì non posso: ho lezione fino alle nove. Ma sabato sono libero!"
    ],
    [
     "A",
     "Peccato! Allora sabato facciamo una passeggiata e ti porto a mangiare il pesce in un posto buonissimo. D'accordo?"
    ],
    [
     "B",
     "D'accordo! A sabato, Sara!"
    ]
   ],
   "gloss": {
    "sondaggio": "encuesta",
    "in linea": "en línea, al teléfono",
    "nebbia": "niebla",
    "grigliate": "asados, parrilladas",
    "tifosi": "hinchas",
    "chitarra": "guitarra",
    "dal vivo": "en vivo",
    "Ti va di": "¿tenés ganas de…?"
   },
   "questions": [
    [
     "Perché a Martín piacciono i portici?",
     [
      "Perché sono antichi e famosi in tutto il mondo",
      "Perché con la pioggia non serve l'ombrello",
      "Perché ci sono tanti bar e negozi",
      "Perché sono vicini alla sua casa"
     ],
     "Perché con la pioggia non serve l'ombrello"
    ],
    [
     "Che cosa manca a Martín?",
     [
      "Il mare, gli amici e le grigliate",
      "La nebbia e il freddo",
      "Una squadra di calcio da tifare allo stadio",
      "Una chitarra per suonare"
     ],
     "Il mare, gli amici e le grigliate"
    ],
    [
     "Perché Martín non va alla festa di venerdì?",
     [
      "Perché non gli piace ballare",
      "Perché ha lezione fino alle nove",
      "Perché non sa suonare",
      "Perché va allo stadio"
     ],
     "Perché ha lezione fino alle nove"
    ]
   ],
   "info": [
    [
     "A Martín piace il gelato di via Castiglione.",
     true
    ],
    [
     "Martín ha già una squadra del cuore.",
     false
    ],
    [
     "Sara e Martín si vedono sabato.",
     true
    ]
   ],
   "grammatica": {
    "label": "piacere, mancare, sembrare y dispiacere con el pronombre indirecto",
    "forme": [
     "ti piace",
     "mi piacciono",
     "mi piace",
     "non mi piace",
     "mi manca",
     "mi mancano",
     "mi è sembrata",
     "mi dispiace",
     "che cosa vi piace"
    ]
   },
   "parole": [
    [
     "cibo",
     "cibo"
    ],
    [
     "gelato",
     "gelato"
    ],
    [
     "manca",
     "mancare"
    ],
    [
     "squadra",
     "squadra"
    ],
    [
     "partita",
     "partita"
    ],
    [
     "sembrata",
     "sembrare"
    ],
    [
     "ballare",
     "ballare"
    ],
    [
     "suonare",
     "suonare"
    ],
    [
     "cioè",
     "cioè"
    ],
    [
     "canzone",
     "canzone"
    ],
    [
     "dispiace",
     "dispiacere"
    ],
    [
     "passeggiata",
     "passeggiata"
    ],
    [
     "pesce",
     "pesce"
    ]
   ],
   "qlang": "it",
   "infoPrompt": "Lo dice o non lo dice?",
   "infoYes": "Lo dice",
   "infoNo": "Non lo dice"
  },
  {
   "week": 15,
   "level": "A2",
   "title": "Com'era il Pratello",
   "genre": "rubrica «Una volta»",
   "es": "En la nueva sección «Una volta» (Antes), la signora Franca cuenta cómo era su calle, via del Pratello, cuando ella era chica, y un día que no se olvida.",
   "speakers": [
    "Sara",
    "Franca"
   ],
   "turns": [
    [
     "A",
     "Buongiorno! Oggi comincia una nuova rubrica: «Una volta». E la prima ospite è un'amica della radio, la signora Franca. Signora, com'era via del Pratello quando lei era bambina?"
    ],
    [
     "B",
     "Oh, era tutta un'altra cosa! Non c'erano i locali e i ristoranti di oggi. C'erano tante botteghe: il fornaio, il calzolaio, la latteria."
    ],
    [
     "A",
     "E voi bambini dove giocavate?"
    ],
    [
     "B",
     "In cortile. Nel nostro cortile c'era un grande albero e noi giocavamo lì sotto tutto il giorno. I maschi giocavano a calcio con un pallone vecchio, io e le mie amiche saltavamo la corda."
    ],
    [
     "A",
     "E la scuola com'era?"
    ],
    [
     "B",
     "La maestra era molto severa e io avevo paura di lei. Eravamo in trenta in una classe! Molte famiglie erano povere, ma la mamma mi diceva sempre: «Franca, studia, perché la scuola è la tua ricchezza»."
    ],
    [
     "A",
     "Andavate in vacanza d'estate?"
    ],
    [
     "B",
     "Purtroppo no, quasi mai. Ma ogni agosto andavamo al paese dei nonni, in collina. Lì c'era un fiume e mio zio aveva una piccola barca."
    ],
    [
     "A",
     "C'è un giorno che non dimentica?"
    ],
    [
     "B",
     "Sì. Un inverno ero molto malata e dovevo stare a letto. Una mattina, invece, il cortile era tutto bianco: è arrivata la neve! Mia madre ha aperto la finestra e tutti i bambini del palazzo mi hanno salutato con una palla di neve in mano."
    ],
    [
     "A",
     "Che bel ricordo, signora Franca. Grazie! E voi, ascoltatori: com'era la vostra strada quando eravate bambini?"
    ]
   ],
   "gloss": {
    "rubrica": "sección (de un programa)",
    "ospite": "invitada",
    "locali": "bares y boliches",
    "botteghe": "negocios de barrio, talleres",
    "calzolaio": "zapatero",
    "latteria": "lechería",
    "saltavamo la corda": "saltábamos a la soga",
    "maestra": "maestra",
    "severa": "severa, estricta",
    "ricchezza": "riqueza",
    "collina": "colina, sierra",
    "fiume": "río",
    "neve": "nieve",
    "ricordo": "recuerdo",
    "ascoltatori": "oyentes"
   },
   "questions": [
    [
     "Che cosa c'era in via del Pratello quando Franca era bambina?",
     [
      "Tanti locali e ristoranti",
      "Tante botteghe e negozi",
      "Un grande parco pubblico",
      "Una scuola di calcio"
     ],
     "Tante botteghe e negozi"
    ],
    [
     "Dove andava Franca d'estate?",
     [
      "Al mare con la scuola",
      "In città dalla maestra",
      "Al paese dei nonni, in collina",
      "In barca con le amiche sul fiume"
     ],
     "Al paese dei nonni, in collina"
    ],
    [
     "Perché Franca ricorda quel giorno d'inverno?",
     [
      "Per la neve e il saluto dei bambini del palazzo",
      "Perché ha preso un brutto voto a scuola",
      "Perché lo zio le ha regalato una barca",
      "Perché è andata a giocare a calcio con i maschi"
     ],
     "Per la neve e il saluto dei bambini del palazzo"
    ]
   ],
   "info": [
    [
     "Da bambina Franca aveva paura della maestra.",
     true
    ],
    [
     "La famiglia di Franca andava in vacanza ogni estate al mare.",
     false
    ],
    [
     "Nel cortile c'era un grande albero.",
     true
    ]
   ],
   "grammatica": {
    "label": "el imperfetto para describir el pasado, y el passato prossimo para lo que pasó",
    "forme": [
     "com'era",
     "c'erano",
     "giocavate",
     "c'era",
     "giocavamo",
     "saltavamo",
     "avevo paura",
     "eravamo",
     "diceva",
     "andavamo",
     "ero molto malata",
     "dovevo",
     "è arrivata",
     "ha aperto"
    ]
   },
   "parole": [
    [
     "bambina",
     "bambino"
    ],
    [
     "giocavamo",
     "giocare"
    ],
    [
     "calcio",
     "calcio"
    ],
    [
     "pallone",
     "pallone"
    ],
    [
     "paura",
     "paura"
    ],
    [
     "povere",
     "povero"
    ],
    [
     "vacanza",
     "vacanza"
    ],
    [
     "purtroppo",
     "purtroppo"
    ],
    [
     "paese",
     "paese"
    ],
    [
     "albero",
     "albero"
    ],
    [
     "cortile",
     "cortile"
    ],
    [
     "barca",
     "barca"
    ],
    [
     "malata",
     "malato"
    ]
   ],
   "qlang": "it",
   "infoPrompt": "Lo dice o non lo dice?",
   "infoYes": "Lo dice",
   "infoNo": "Non lo dice"
  },
  {
   "week": 16,
   "level": "A2",
   "title": "Una mattina di corsa",
   "genre": "chiacchierata in studio",
   "es": "Dario llega corriendo a la radio, con un minuto de atraso y un aspecto extraño. Sara quiere saber qué pasó desde que se despertó; después cuenta su propia mañana.",
   "speakers": [
    "Sara",
    "Dario"
   ],
   "turns": [
    [
     "A",
     "Buongiorno da Radio Portici! Sono le sette e un minuto e Dario è appena entrato in studio... di corsa. Dario, che cosa ti è successo?"
    ],
    [
     "B",
     "Non chiedere! Stanotte è andata via la luce e la sveglia non ha suonato. Mi sono svegliato alle sei e mezza, al buio, e mi sono alzato di corsa."
    ],
    [
     "A",
     "E poi?"
    ],
    [
     "B",
     "Non mi sono fatto la doccia e non mi sono fatto la barba: non c'era tempo. Mi sono vestito al buio e mi sono messo la prima giacca che ho trovato."
    ],
    [
     "A",
     "Lo vedo! Guarda le scarpe: una è nera e una è marrone."
    ],
    [
     "B",
     "Oh no! E non è tutto. Sono uscito e pioveva, ma ho dimenticato l'ombrello. Allora mi sono tolto la giacca e l'ho messa sulla testa."
    ],
    [
     "A",
     "Bravo! Almeno la testa è asciutta. E sei venuto in bicicletta?"
    ],
    [
     "B",
     "Sì, e mi sono sbrigato tantissimo. Per questo sono arrivato con un solo minuto di ritardo!"
    ],
    [
     "A",
     "Io invece stamattina mi sono alzata alle cinque, come sempre. Mi sono preparata con calma, mi sono truccata e sono andata a correre ai Giardini Margherita."
    ],
    [
     "B",
     "Alle cinque? Con la pioggia? Tu sei matta, Sara!"
    ],
    [
     "A",
     "Un po' matta, sì, ma asciutta! E voi, ascoltatori, vi siete mai vestiti al buio? Raccontateci le vostre mattine di fretta!"
    ]
   ],
   "gloss": {
    "è andata via la luce": "se cortó la luz",
    "giacca": "saco, campera",
    "marrone": "marrón",
    "asciutta": "seca",
    "matta": "loca",
    "ascoltatori": "oyentes",
    "Raccontateci": "cuéntennos"
   },
   "questions": [
    [
     "Perché la sveglia di Dario non ha suonato?",
     [
      "Perché era rotta da una settimana",
      "Perché stanotte è andata via la luce",
      "Perché Dario l'ha dimenticata in radio",
      "Perché era domenica"
     ],
     "Perché stanotte è andata via la luce"
    ],
    [
     "Che cosa ha fatto Dario quando ha cominciato a piovere?",
     [
      "È tornato a casa a prendere l'ombrello",
      "Ha preso l'autobus",
      "Si è messo la giacca sulla testa",
      "Ha aspettato sotto i portici"
     ],
     "Si è messo la giacca sulla testa"
    ],
    [
     "Che cosa ha fatto Sara stamattina?",
     [
      "Si è alzata presto ed è andata a correre",
      "Si è svegliata tardi per la pioggia",
      "Ha preparato la colazione a Dario",
      "Si è vestita al buio come Dario"
     ],
     "Si è alzata presto ed è andata a correre"
    ]
   ],
   "info": [
    [
     "Dario si è fatto la barba in fretta.",
     false
    ],
    [
     "Le scarpe di Dario sono di due colori diversi.",
     true
    ],
    [
     "Dario è arrivato in ritardo di un'ora.",
     false
    ]
   ],
   "grammatica": {
    "label": "los reflexivos en passato prossimo, siempre con essere",
    "forme": [
     "mi sono svegliato",
     "mi sono alzato",
     "non mi sono fatto la barba",
     "mi sono vestito",
     "mi sono messo",
     "mi sono tolto",
     "mi sono sbrigato",
     "mi sono alzata",
     "mi sono preparata",
     "mi sono truccata",
     "vi siete mai vestiti"
    ]
   },
   "parole": [
    [
     "stanotte",
     "stanotte"
    ],
    [
     "sveglia",
     "sveglia"
    ],
    [
     "buio",
     "buio"
    ],
    [
     "corsa",
     "corsa"
    ],
    [
     "fatto la barba",
     "farsi la barba"
    ],
    [
     "messo",
     "mettersi"
    ],
    [
     "pioveva",
     "piovere"
    ],
    [
     "dimenticato",
     "dimenticare"
    ],
    [
     "tolto",
     "togliersi"
    ],
    [
     "bravo",
     "bravo"
    ],
    [
     "sbrigato",
     "sbrigarsi"
    ],
    [
     "stamattina",
     "stamattina"
    ],
    [
     "truccata",
     "truccarsi"
    ],
    [
     "fretta",
     "fretta"
    ]
   ],
   "qlang": "it",
   "infoPrompt": "Lo dice o non lo dice?",
   "infoYes": "Lo dice",
   "infoNo": "Non lo dice"
  },
  {
   "week": 17,
   "level": "A2",
   "title": "La famiglia di Dario",
   "genre": "chiacchierata in studio",
   "es": "El domingo la familia de Dario vino de Nápoles a visitarlo. Sara mira la foto de la comida en la computadora de la radio y quiere saber quién es cada uno.",
   "speakers": [
    "Sara",
    "Dario"
   ],
   "turns": [
    [
     "A",
     "Buongiorno! Dario, sul sito della radio c'è una foto bellissima: un tavolo lunghissimo e tante persone. Chi sono?"
    ],
    [
     "B",
     "È la mia famiglia! Domenica sono venuti tutti da Napoli per il mio compleanno. Abbiamo passato una giornata splendida."
    ],
    [
     "A",
     "Allora dimmi chi è chi. Questa signora con gli occhiali?"
    ],
    [
     "B",
     "Questa è mia madre. E quel signore alto vicino alla finestra è mio padre: è lui che ha cucinato."
    ],
    [
     "A",
     "E questi due ragazzi uguali?"
    ],
    [
     "B",
     "Sono i miei cugini, Gennaro e Ciro: sono gemelli. Nessuno li riconosce, neanche la loro madre! Lei è mia zia Rosa, la sorella di mio padre."
    ],
    [
     "A",
     "E quella bambina con il gelato in mano?"
    ],
    [
     "B",
     "È Sofia, mia nipote, la figlia di mia sorella. Mia sorella è quella con il vestito rosso, e quello con la barba è suo marito."
    ],
    [
     "A",
     "E i tuoi nonni?"
    ],
    [
     "B",
     "I miei nonni purtroppo non sono venuti: sono anziani e ogni viaggio è una fatica. Ma alcuni parenti hanno portato un regalo da parte loro: una scatola di sfogliatelle."
    ],
    [
     "A",
     "Quanta gente! E dove avete mangiato? A casa tua?"
    ],
    [
     "B",
     "Scherzi? La mia casa è piccolissima: ha solo una camera e una cucina. Abbiamo mangiato in un'osteria qui vicino. Il proprietario ci ha lasciato tutta la sala."
    ],
    [
     "A",
     "Che bella famiglia. È chiaro che ti vogliono bene!"
    ],
    [
     "B",
     "Sì. E qualcuno ha già bisogno di tornare: mia madre dice che a Bologna fa troppo freddo!"
    ]
   ],
   "gloss": {
    "sito": "sitio web",
    "splendida": "espléndida, hermosísima",
    "gemelli": "mellizos",
    "riconosce": "reconoce",
    "fatica": "esfuerzo, cansancio",
    "da parte loro": "de parte de ellos",
    "sfogliatelle": "masas de hojaldre típicas de Nápoles",
    "Scherzi?": "¿Me estás cargando?",
    "osteria": "bodegón, fonda",
    "proprietario": "dueño",
    "ti vogliono bene": "te quieren"
   },
   "questions": [
    [
     "Perché la famiglia di Dario è venuta a Bologna?",
     [
      "Per il compleanno di Dario",
      "Per il matrimonio della sorella",
      "Per vedere la radio",
      "Per le vacanze di Natale"
     ],
     "Per il compleanno di Dario"
    ],
    [
     "Chi è Sofia?",
     [
      "La cugina di Dario",
      "La figlia della sorella di Dario",
      "La zia di Dario, sorella del padre",
      "La moglie di Dario"
     ],
     "La figlia della sorella di Dario"
    ],
    [
     "Dove hanno mangiato?",
     [
      "A casa di Dario, in cucina",
      "In un'osteria vicino alla casa di Dario",
      "In un ristorante di Napoli",
      "Nella sala della radio"
     ],
     "In un'osteria vicino alla casa di Dario"
    ]
   ],
   "info": [
    [
     "Il padre di Dario ha cucinato.",
     true
    ],
    [
     "I nonni di Dario sono venuti in treno.",
     false
    ],
    [
     "La madre di Dario vuole trasferirsi a Bologna.",
     false
    ]
   ],
   "grammatica": {
    "label": "demostrativos, posesivos (sin artículo con los familiares) e indefinidos",
    "forme": [
     "questa signora",
     "questa è mia madre",
     "quel signore",
     "mio padre",
     "questi due ragazzi",
     "i miei cugini",
     "la loro madre",
     "mia zia",
     "quella bambina",
     "mia nipote",
     "suo marito",
     "i tuoi nonni",
     "i miei nonni",
     "nessuno",
     "ogni viaggio",
     "alcuni parenti",
     "qualcuno",
     "casa tua"
    ]
   },
   "parole": [
    [
     "cugini",
     "cugino"
    ],
    [
     "zia",
     "zio"
    ],
    [
     "sorella",
     "sorella"
    ],
    [
     "nipote",
     "nipote"
    ],
    [
     "figlia",
     "figlio"
    ],
    [
     "marito",
     "marito"
    ],
    [
     "nonni",
     "nonno"
    ],
    [
     "parenti",
     "parente"
    ],
    [
     "giornata",
     "giornata"
    ],
    [
     "lasciato",
     "lasciare"
    ],
    [
     "bisogno",
     "bisogno"
    ]
   ],
   "qlang": "it",
   "infoPrompt": "Lo dice o non lo dice?",
   "infoYes": "Lo dice",
   "infoNo": "Non lo dice"
  },
  {
   "week": 18,
   "level": "A2",
   "title": "Il portafoglio di Leo",
   "genre": "collegamento dal mercato",
   "es": "Leo, el corresponsal en bicicleta, tenía que contar el mercado de la Piazzola, pero llama a la radio desesperado: perdió algo importante.",
   "speakers": [
    "Sara",
    "Leo"
   ],
   "turns": [
    [
     "A",
     "E adesso andiamo al mercato della Piazzola con il nostro Leo. Leo, com'è il mercato stamattina?"
    ],
    [
     "B",
     "Sara, il mercato è bellissimo, ma io ho un problema: non trovo più il portafoglio!"
    ],
    [
     "A",
     "No! Che peccato! Ma sei sicuro? Guarda bene nello zaino."
    ],
    [
     "B",
     "Ho guardato dappertutto: non c'è. Non ho più niente: né i soldi, né i documenti, né la tessera dell'autobus."
    ],
    [
     "A",
     "Calma, Leo. Spiegaci che cosa è successo."
    ],
    [
     "B",
     "Allora, sono arrivato alle nove e ho fatto la spesa per mia madre: frutta, verdura e un chilo di pane. Poi avevo fame e ho mangiato una piadina. Quando ho pagato la piadina il portafoglio c'era, ma adesso non c'è più."
    ],
    [
     "A",
     "E non hai visto nessuno vicino a te?"
    ],
    [
     "B",
     "Boh! Non mi ricordo niente. C'era tantissima gente e io non ho mai fatto attenzione. Che sbadato!"
    ],
    [
     "A",
     "Non è mica colpa tua. Forza, torna al banco delle piadine. Magari l'hai lasciato lì."
    ],
    [
     "B",
     "Vado... Aspetta, Sara, c'è una signora che mi chiama con qualcosa in mano. Non ci credo: è il mio portafoglio!"
    ],
    [
     "A",
     "Che meraviglia! E chi è questa signora?"
    ],
    [
     "B",
     "È la signora Franca! Dice che ascolta sempre la radio e ha riconosciuto la mia voce. Grazie, signora! Non so come ringraziarla."
    ],
    [
     "A",
     "La signora Franca non spreca mai un'occasione per aiutare qualcuno! Leo, adesso puoi spendere i tuoi soldi: offri almeno un caffè alla signora!"
    ],
    [
     "B",
     "Ma figurati! Le offro anche la piadina!"
    ]
   ],
   "gloss": {
    "dappertutto": "por todos lados",
    "né": "ni (né… né: ni… ni)",
    "tessera": "tarjeta, abono",
    "Spiegaci": "explicanos",
    "fatto attenzione": "prestado atención (fare attenzione)",
    "banco": "puesto (del mercado)",
    "Non ci credo": "no lo puedo creer",
    "ha riconosciuto": "reconoció",
    "spreca": "desperdicia",
    "occasione": "ocasión, oportunidad",
    "piadina": "pan chato relleno de la Romaña",
    "ringraziarla": "agradecerle (a usted)"
   },
   "questions": [
    [
     "Che cosa ha perso Leo?",
     [
      "Lo zaino con la frutta",
      "Il portafoglio",
      "La bicicletta",
      "Il telefono della radio"
     ],
     "Il portafoglio"
    ],
    [
     "Che cosa ha fatto Leo al mercato prima di perdere il portafoglio?",
     [
      "Ha fatto la spesa e ha mangiato una piadina",
      "Ha comprato un regalo per la signora Franca",
      "Ha preso un caffè con un amico",
      "Ha parlato con alcune persone"
     ],
     "Ha fatto la spesa e ha mangiato una piadina"
    ],
    [
     "Come ha fatto la signora Franca a trovare Leo?",
     [
      "L'ha visto in televisione",
      "Ha riconosciuto la sua voce",
      "Ha chiamato la radio",
      "L'ha trovato sul banco delle piadine"
     ],
     "Ha riconosciuto la sua voce"
    ]
   ],
   "info": [
    [
     "Nel portafoglio c'erano anche i documenti di Leo.",
     true
    ],
    [
     "Leo ha visto chi ha preso il portafoglio.",
     false
    ],
    [
     "La signora Franca ha lasciato il portafoglio alla polizia.",
     false
    ]
   ],
   "grammatica": {
    "label": "la doble negación y las exclamaciones",
    "forme": [
     "non trovo più",
     "non ho più niente",
     "né i soldi",
     "non hai visto nessuno",
     "non mi ricordo niente",
     "non ho mai fatto",
     "non è mica",
     "che peccato",
     "che sbadato",
     "che meraviglia",
     "non spreca mai",
     "figurati"
    ]
   },
   "parole": [
    [
     "peccato",
     "peccato"
    ],
    [
     "portafoglio",
     "portafoglio"
    ],
    [
     "soldi",
     "soldi"
    ],
    [
     "spesa",
     "spesa"
    ],
    [
     "fame",
     "fame"
    ],
    [
     "boh",
     "boh"
    ],
    [
     "sbadato",
     "sbadato"
    ],
    [
     "mica",
     "mica"
    ],
    [
     "forza",
     "forza"
    ],
    [
     "magari",
     "magari"
    ],
    [
     "meraviglia",
     "meraviglia"
    ],
    [
     "spendere",
     "spendere"
    ],
    [
     "figurati",
     "figurati"
    ],
    [
     "spiegaci",
     "spiegare"
    ]
   ],
   "qlang": "it",
   "infoPrompt": "Lo dice o non lo dice?",
   "infoYes": "Lo dice",
   "infoNo": "Non lo dice"
  },
  {
   "week": 19,
   "level": "B1",
   "title": "Lunedì, il colloquio",
   "genre": "telefonata in diretta",
   "es": "Martín llama a la radio un viernes: el lunes tiene una entrevista de trabajo en una empresa de Módena y está nervioso. Sara lo ayuda a imaginarse el día, y hay una noticia que complica el viaje.",
   "speakers": [
    "Sara",
    "Martín"
   ],
   "turns": [
    [
     "A",
     "Buongiorno, ascoltatori! In linea abbiamo di nuovo Martín. Martín, ti sento agitato..."
    ],
    [
     "B",
     "Ciao, Sara. Sì, un po'. Lunedì avrò un colloquio di lavoro a Modena, in un'azienda che produce motori elettrici. È il mio primo colloquio in Italia."
    ],
    [
     "A",
     "Che bella notizia! A che ora sarà il colloquio?"
    ],
    [
     "B",
     "Alle nove e mezza. Prenderò il treno delle sette e quaranta e arriverò a Modena verso le otto e un quarto. Così avrò almeno un'ora per trovare l'azienda."
    ],
    [
     "A",
     "Aspetta, Martín... Hai sentito le notizie? Lunedì ci sarà uno sciopero dei treni regionali, dalle sei alle nove."
    ],
    [
     "B",
     "No! E adesso come farò?"
    ],
    [
     "A",
     "Calma. Hai la patente? Potrai prendere la macchina di un amico. Ma ricordati di fare benzina domenica sera."
    ],
    [
     "B",
     "Giulia ha una macchina: chiederò a lei. Ma se c'è traffico? Se succede un incidente in autostrada?"
    ],
    [
     "A",
     "Partirai presto e andrà tutto bene, sono sicura. Adesso pensiamo alle domande: che cosa ti chiederà il capo?"
    ],
    [
     "B",
     "Mi chiederà perché voglio lavorare lì, e forse quanto voglio di stipendio. Questo non lo so proprio!"
    ],
    [
     "A",
     "Chiedilo tu a loro, con gentilezza: in Italia è normale. E ricordati di chiedere quanti giorni di ferie avranno i dipendenti."
    ],
    [
     "B",
     "Ferie? Prima mi devono assumere!"
    ],
    [
     "A",
     "Ti assumeranno, vedrai. Quando avrai finito il colloquio, ci chiamerai e ci racconterai tutto in diretta?"
    ],
    [
     "B",
     "Promesso. Lunedì a quest'ora sarò in macchina... o sarò già davanti all'azienda!"
    ],
    [
     "A",
     "E quando tornerai a Bologna, festeggeremo. In bocca al lupo, Martín!"
    ],
    [
     "B",
     "Crepi! Grazie, Sara."
    ]
   ],
   "gloss": {
    "ascoltatori": "oyentes",
    "In linea": "en línea, al teléfono",
    "agitato": "nervioso",
    "motori elettrici": "motores eléctricos",
    "patente": "registro de conducir",
    "autostrada": "autopista",
    "gentilezza": "amabilidad",
    "festeggeremo": "vamos a festejar",
    "In bocca al lupo": "¡suerte! (literalmente, «en la boca del lobo»)",
    "Crepi": "respuesta de rigor a «in bocca al lupo»",
    "regionali": "regionales"
   },
   "questions": [
    [
     "Dove sarà il colloquio di Martín?",
     [
      "In un'azienda di Modena",
      "In un'azienda di Bologna",
      "Alla stazione di Modena",
      "In un albergo di Bologna"
     ],
     "In un'azienda di Modena"
    ],
    [
     "Perché Martín non potrà prendere il treno?",
     [
      "Perché il treno delle sette e quaranta non esiste",
      "Perché lunedì ci sarà uno sciopero dei treni",
      "Perché costa troppo",
      "Perché ha perso il biglietto"
     ],
     "Perché lunedì ci sarà uno sciopero dei treni"
    ],
    [
     "Che cosa consiglia Sara per la domanda sullo stipendio?",
     [
      "Di non parlare mai di soldi",
      "Di chiedere lui quanto pagano, con gentilezza",
      "Di chiedere lo stipendio del capo",
      "Di chiedere uno stipendio molto alto"
     ],
     "Di chiedere lui quanto pagano, con gentilezza"
    ]
   ],
   "info": [
    [
     "Il colloquio sarà alle nove e mezza.",
     true
    ],
    [
     "Martín ha già fatto altri colloqui in Italia.",
     false
    ],
    [
     "Martín chiederà la macchina a Giulia.",
     true
    ]
   ],
   "grammatica": {
    "label": "el futuro simple (planes, promesas y suposiciones) y el futuro anteriore",
    "forme": [
     "avrò",
     "sarà",
     "prenderò",
     "arriverò",
     "ci sarà",
     "farò",
     "potrai",
     "chiederò",
     "partirai",
     "andrà",
     "chiederà",
     "avranno",
     "assumeranno",
     "avrai finito",
     "chiamerai",
     "racconterai",
     "sarò in macchina",
     "tornerai",
     "festeggeremo"
    ]
   },
   "parole": [
    [
     "colloquio",
     "colloquio"
    ],
    [
     "azienda",
     "azienda"
    ],
    [
     "almeno",
     "almeno"
    ],
    [
     "sciopero",
     "sciopero"
    ],
    [
     "benzina",
     "benzina"
    ],
    [
     "incidente",
     "incidente"
    ],
    [
     "sicura",
     "sicuro"
    ],
    [
     "capo",
     "capo"
    ],
    [
     "stipendio",
     "stipendio"
    ],
    [
     "ferie",
     "ferie"
    ],
    [
     "dipendenti",
     "dipendente"
    ],
    [
     "assumere",
     "assumere"
    ]
   ],
   "qlang": "it",
   "infoPrompt": "Lo dice o non lo dice?",
   "infoYes": "Lo dice",
   "infoNo": "Non lo dice"
  },
  {
   "week": 20,
   "level": "B1",
   "title": "Che cosa faresti al mio posto?",
   "genre": "telefonata in diretta",
   "es": "Llegó la respuesta de la empresa de Módena. Martín vuelve a llamar a la radio, pero no para festejar: tiene que decidir algo y le pide consejo a Sara.",
   "speakers": [
    "Sara",
    "Martín"
   ],
   "turns": [
    [
     "A",
     "Ed eccolo di nuovo in linea: Martín! Allora? Ci sono notizie da Modena?"
    ],
    [
     "B",
     "Sì, Sara. Venerdì è arrivata la mail: l'azienda mi offre il posto."
    ],
    [
     "A",
     "Fantastico! Ma perché hai questa voce? Dovresti essere felicissimo."
    ],
    [
     "B",
     "Lo so, ma sono confuso. Il lavoro è ottimo e guadagnerei il doppio. Però dovrei trasferirmi a Modena, e io a Bologna sto veramente bene."
    ],
    [
     "A",
     "Capisco. Ma potresti fare il pendolare! Tanti lo fanno: in treno è mezz'ora."
    ],
    [
     "B",
     "Sì, l'ho pensato anch'io. Mi piacerebbe restare in via Zamboni, con i miei amici. Ma dovrei svegliarmi alle sei ogni giorno."
    ],
    [
     "A",
     "Io al tuo posto accetterei e resterei a Bologna. Sul treno potresti leggere, riposare, preparare le riunioni. Molti pendolari dicono che è un momento tranquillo della giornata."
    ],
    [
     "B",
     "Forse hai ragione. E il sabato non dovrei cambiare niente: la spesa al mercato, gli amici, la passeggiata sui colli al tramonto..."
    ],
    [
     "A",
     "Esatto. E poi, se d'inverno fa troppo freddo per la bici, qualche collega di Bologna ti darebbe un passaggio in macchina."
    ],
    [
     "B",
     "Vorrei solo una cosa: una scrivania vicino alla finestra. Nel mio ufficio di Rosario lavoravo senza finestre!"
    ],
    [
     "A",
     "Questo lo potresti chiedere il primo giorno. Allora, che cosa rispondi all'azienda?"
    ],
    [
     "B",
     "Ho un appuntamento con il capo giovedì. Ormai ho deciso: accetto, ma resto a Bologna. Stampo la risposta e la porto io, di persona."
    ],
    [
     "A",
     "Bravo! E voi, ascoltatori, che cosa fareste al posto di Martín? Scrivete alla radio: gli leggeremo i vostri consigli."
    ]
   ],
   "gloss": {
    "in linea": "en línea, al teléfono",
    "posto": "puesto (de trabajo)",
    "il doppio": "el doble",
    "riunioni": "reuniones",
    "colli": "cerros, colinas",
    "collega": "colega, compañero de trabajo",
    "ufficio": "oficina",
    "di persona": "en persona",
    "ascoltatori": "oyentes",
    "pendolari": "los que viajan todos los días al trabajo"
   },
   "questions": [
    [
     "Perché Martín è confuso?",
     [
      "Perché l'azienda non gli ha risposto",
      "Perché per il lavoro dovrebbe lasciare Bologna",
      "Perché lo stipendio è troppo basso",
      "Perché non gli piace il lavoro"
     ],
     "Perché per il lavoro dovrebbe lasciare Bologna"
    ],
    [
     "Che cosa farebbe Sara al posto di Martín?",
     [
      "Rifiuterebbe il posto",
      "Si trasferirebbe a Modena",
      "Accetterebbe e farebbe la pendolare",
      "Cercherebbe un altro lavoro a Bologna"
     ],
     "Accetterebbe e farebbe la pendolare"
    ],
    [
     "Che cosa ha deciso Martín alla fine?",
     [
      "Di accettare e di restare a Bologna",
      "Di cercare una casa in affitto a Modena",
      "Di tornare in Argentina",
      "Di aspettare un'altra offerta"
     ],
     "Di accettare e di restare a Bologna"
    ]
   ],
   "info": [
    [
     "Con il nuovo lavoro Martín guadagnerebbe il doppio.",
     true
    ],
    [
     "A Rosario Martín lavorava in un ufficio senza finestre.",
     true
    ],
    [
     "Martín ha già firmato il contratto.",
     false
    ]
   ],
   "grammatica": {
    "label": "el condicional: cortesía, deseo, consejo e hipótesis",
    "forme": [
     "dovresti",
     "guadagnerei",
     "dovrei",
     "potresti",
     "mi piacerebbe",
     "accetterei",
     "resterei",
     "darebbe",
     "vorrei",
     "fareste"
    ]
   },
   "parole": [
    [
     "guadagnerei",
     "guadagnare"
    ],
    [
     "trasferirmi",
     "trasferirsi"
    ],
    [
     "veramente",
     "veramente"
    ],
    [
     "pendolare",
     "pendolare"
    ],
    [
     "riposare",
     "riposare"
    ],
    [
     "tramonto",
     "tramonto"
    ],
    [
     "passaggio",
     "passaggio"
    ],
    [
     "scrivania",
     "scrivania"
    ],
    [
     "appuntamento",
     "appuntamento"
    ],
    [
     "ormai",
     "ormai"
    ],
    [
     "stampo",
     "stampare"
    ]
   ],
   "qlang": "it",
   "infoPrompt": "Lo dice o non lo dice?",
   "infoYes": "Lo dice",
   "infoNo": "Non lo dice"
  },
  {
   "week": 21,
   "level": "B1",
   "title": "La minestra della signora Franca",
   "genre": "rubrica di cucina",
   "es": "Llueve y hace frío en Bologna. En la sección de cocina, la signora Franca dicta por teléfono su receta de sopa de invierno, con cantidades y todo, mientras Sara anota.",
   "speakers": [
    "Sara",
    "Franca"
   ],
   "turns": [
    [
     "A",
     "Fuori piove e fa freddo: è il giorno giusto per una minestra calda. In linea c'è la nostra esperta, la signora Franca. Buongiorno, signora!"
    ],
    [
     "B",
     "Buongiorno, Sara! Oggi vi do la ricetta della minestra di mia nonna. È facile: ci riescono tutti."
    ],
    [
     "A",
     "Io ho carta e penna. Che cosa ci vuole?"
    ],
    [
     "B",
     "Allora: ci vogliono due cipolle, tre carote, un po' di sedano e un chilo di patate. E poi i fagioli."
    ],
    [
     "A",
     "Freschi o in scatola?"
    ],
    [
     "B",
     "Io li compro secchi e li metto nell'acqua la sera prima. Ma se non avete tempo, una scatola va bene. Ne basta una grande."
    ],
    [
     "A",
     "E la pasta? Quanta ne metto?"
    ],
    [
     "B",
     "Ne metto un etto e mezzo per quattro persone. Non di più, perché la minestra deve restare leggera, non pesante."
    ],
    [
     "A",
     "Dove compra la verdura, signora?"
    ],
    [
     "B",
     "Al mercato di via Ugo Bassi. Ci vado ogni sabato mattina. Il fruttivendolo mi conosce e mi dà sempre qualcosa in più: una mela, un limone... Il pane, invece, lo prendo dal fornaio sotto casa."
    ],
    [
     "A",
     "E quanto tempo ci vuole per cucinarla?"
    ],
    [
     "B",
     "Un'ora abbondante. Io la preparo la domenica e ne mangio metà subito. L'altra metà la metto in una busta nel congelatore."
    ],
    [
     "A",
     "Molto furba! Mio marito... cioè, il mio compagno non riesce ad abituarsi alle minestre: dice che non sono un pasto vero."
    ],
    [
     "B",
     "Si abituerà, cara! Ne mangia un piatto e poi ne vuole un altro. E se va in palestra, ha bisogno di energia."
    ],
    [
     "A",
     "Perfetto. Allora ricapitoliamo: due cipolle, tre carote, patate, fagioli e un etto e mezzo di pasta. Abbastanza facile!"
    ],
    [
     "B",
     "E un filo d'olio buono alla fine. Buon appetito a tutti!"
    ]
   ],
   "gloss": {
    "In linea": "en línea, al teléfono",
    "carta e penna": "papel y lapicera",
    "sedano": "apio",
    "fagioli": "porotos",
    "secchi": "secos",
    "fruttivendolo": "verdulero",
    "abbondante": "largo, generoso",
    "congelatore": "freezer",
    "furba": "viva, astuta",
    "compagno": "pareja",
    "pasto": "comida (del día)",
    "ricapitoliamo": "repasemos",
    "un filo d'olio": "un chorrito de aceite"
   },
   "questions": [
    [
     "Quante cipolle ci vogliono per la minestra?",
     [
      "Una",
      "Due",
      "Tre",
      "Quattro"
     ],
     "Due"
    ],
    [
     "Perché Franca non mette più di un etto e mezzo di pasta?",
     [
      "Perché la pasta costa cara",
      "Perché la minestra deve restare leggera",
      "Perché i fagioli sono già abbastanza",
      "Perché la nonna faceva così"
     ],
     "Perché la minestra deve restare leggera"
    ],
    [
     "Che cosa fa Franca con la metà della minestra che non mangia?",
     [
      "La regala al fruttivendolo",
      "La porta alla radio",
      "La mette nel congelatore",
      "La mangia la sera stessa"
     ],
     "La mette nel congelatore"
    ]
   ],
   "info": [
    [
     "Franca va al mercato ogni sabato mattina.",
     true
    ],
    [
     "Franca compra il pane al mercato.",
     false
    ],
    [
     "Il compagno di Sara va in palestra tutti i giorni.",
     false
    ]
   ],
   "grammatica": {
    "label": "ne (cantidad) y ci (lugar; ci vuole, ci riesco)",
    "forme": [
     "ci riescono",
     "ci vuole",
     "ci vogliono",
     "ne basta una",
     "quanta ne metto",
     "ne metto un etto",
     "ci vado",
     "ne mangio metà",
     "ne mangia un piatto",
     "ne vuole un altro"
    ]
   },
   "parole": [
    [
     "minestra",
     "minestra"
    ],
    [
     "riescono",
     "riuscire"
    ],
    [
     "cipolle",
     "cipolla"
    ],
    [
     "chilo",
     "chilo"
    ],
    [
     "scatola",
     "scatola"
    ],
    [
     "etto",
     "etto"
    ],
    [
     "pesante",
     "pesante"
    ],
    [
     "mela",
     "mela"
    ],
    [
     "fornaio",
     "fornaio"
    ],
    [
     "metà",
     "metà"
    ],
    [
     "busta",
     "busta"
    ],
    [
     "abituarsi",
     "abituarsi"
    ],
    [
     "palestra",
     "palestra"
    ],
    [
     "abbastanza",
     "abbastanza"
    ]
   ],
   "qlang": "it",
   "infoPrompt": "Lo dice o non lo dice?",
   "infoYes": "Lo dice",
   "infoNo": "Non lo dice"
  },
  {
   "week": 22,
   "level": "B1",
   "title": "Un pacco per Gennaro",
   "genre": "chiacchierata in studio",
   "es": "Uno de los primos mellizos de Dario se recibió en Nápoles. Dario quiere mandarle un regalo desde Bologna, pero tiene más ganas que organización; Sara lo ayuda con el paquete y con otra cosa.",
   "speakers": [
    "Sara",
    "Dario"
   ],
   "turns": [
    [
     "A",
     "Dario, che cos'è questa scatola enorme sulla tua scrivania?"
    ],
    [
     "B",
     "È un pacco per mio cugino Gennaro, quello dei gemelli. Venerdì a Napoli ha preso la laurea in ingegneria!"
    ],
    [
     "A",
     "Complimenti! E che cosa gli mandi?"
    ],
    [
     "B",
     "Un pezzo di parmigiano, un chilo di prosciutto e una bottiglia di vino dei colli bolognesi. Gliel'ho promesso a Natale: «Quando ti laurei, te lo mando io, il formaggio vero»."
    ],
    [
     "A",
     "E come glielo spedisci? Il prosciutto non può viaggiare una settimana."
    ],
    [
     "B",
     "Appunto, non lo so. Me lo spieghi tu? Tu spedisci sempre i pacchi a tua sorella a Londra."
    ],
    [
     "A",
     "Te lo spiego volentieri. Vai alla posta qui dietro e chiedi la spedizione veloce: in due giorni glielo portano a casa. Però la bottiglia non te la fanno spedire se non è protetta bene."
    ],
    [
     "B",
     "Allora la bottiglia gliela porto io, a Pasqua. E il resto? Me lo prepari tu, il pacco? Io sono un disastro con lo scotch."
    ],
    [
     "A",
     "Va bene, te lo preparo io. Ma tu in cambio mi fai un favore."
    ],
    [
     "B",
     "Dimmi."
    ],
    [
     "A",
     "Domani ho la cena con i genitori del mio compagno e non ho tempo di stirare la camicia. Me la stiri tu? So che sei bravissimo."
    ],
    [
     "B",
     "Te la stiro, promesso. Anche mia madre me lo diceva: «Dario, sai solo stirare e mangiare»."
    ],
    [
     "A",
     "E Gennaro? È stato bravo all'università?"
    ],
    [
     "B",
     "All'inizio no. Al primo anno l'hanno bocciato due volte in matematica: ripassava poco e gli capitavano sempre domande difficili. Poi un professore gli ha insegnato un metodo e da lì l'hanno sempre promosso."
    ],
    [
     "A",
     "Che bella storia! Allora mandiamogli anche un saluto da Radio Portici. Gennaro, questo messaggio te lo dedichiamo noi: auguri, ingegnere!"
    ],
    [
     "B",
     "E il prosciutto arriva mercoledì, promesso!"
    ]
   ],
   "gloss": {
    "enorme": "enorme",
    "gemelli": "mellizos",
    "ingegneria": "ingeniería",
    "Complimenti": "¡felicitaciones!",
    "ti laurei": "te recibís (en la universidad)",
    "Appunto": "justamente",
    "posta": "correo",
    "spedizione": "envío",
    "protetta": "protegida",
    "scotch": "cinta adhesiva",
    "in cambio": "a cambio",
    "genitori": "padres",
    "camicia": "camisa",
    "dedichiamo": "dedicamos"
   },
   "questions": [
    [
     "Perché Dario manda un pacco a Gennaro?",
     [
      "Per il suo compleanno",
      "Perché si è laureato",
      "Perché è a Londra",
      "Perché gliel'ha chiesto la madre"
     ],
     "Perché si è laureato"
    ],
    [
     "Perché la bottiglia di vino non va nel pacco?",
     [
      "Perché Dario la beve prima",
      "Perché la posta non la spedisce se non è protetta",
      "Perché Gennaro non beve vino",
      "Perché costa troppo spedirla"
     ],
     "Perché la posta non la spedisce se non è protetta"
    ],
    [
     "Che cosa farà Dario per Sara in cambio?",
     [
      "Le preparerà la cena",
      "Le stirerà la camicia",
      "Le porterà un pacco a Londra",
      "Le spedirà il prosciutto"
     ],
     "Le stirerà la camicia"
    ]
   ],
   "info": [
    [
     "Gennaro si è laureato in ingegneria.",
     true
    ],
    [
     "Dario sa preparare molto bene i pacchi.",
     false
    ],
    [
     "Gennaro ha passato tutti gli esami al primo tentativo.",
     false
    ]
   ],
   "grammatica": {
    "label": "los pronombres combinados: me lo, te la, glielo, gliela",
    "forme": [
     "gliel'ho promesso",
     "te lo mando",
     "glielo spedisci",
     "me lo spieghi",
     "te lo spiego",
     "glielo portano",
     "te la fanno spedire",
     "gliela porto",
     "me lo prepari",
     "te lo preparo",
     "me la stiri",
     "te la stiro",
     "me lo diceva",
     "te lo dedichiamo"
    ]
   },
   "parole": [
    [
     "pacco",
     "pacco"
    ],
    [
     "laurea",
     "laurea"
    ],
    [
     "formaggio",
     "formaggio"
    ],
    [
     "prosciutto",
     "prosciutto"
    ],
    [
     "spedisci",
     "spedire"
    ],
    [
     "stirare",
     "stirare"
    ],
    [
     "bocciato",
     "bocciare"
    ],
    [
     "volte",
     "volta"
    ],
    [
     "capitavano",
     "capitare"
    ],
    [
     "ripassava",
     "ripassare"
    ],
    [
     "insegnato",
     "insegnare"
    ],
    [
     "promosso",
     "promuovere"
    ]
   ],
   "qlang": "it",
   "infoPrompt": "Lo dice o non lo dice?",
   "infoYes": "Lo dice",
   "infoNo": "Non lo dice"
  },
  {
   "week": 23,
   "level": "B1",
   "title": "Meglio Bologna o Napoli?",
   "genre": "sfida in studio",
   "es": "Llegó el día del duelo: Sara, boloñesa, y Dario, napolitano, discuten al aire qué ciudad es mejor. Los oyentes votan por mensaje y al final se anuncia el resultado.",
   "speakers": [
    "Sara",
    "Dario"
   ],
   "turns": [
    [
     "A",
     "Buongiorno! Oggi a Radio Portici c'è la grande sfida: Bologna contro Napoli. Io difendo Bologna, naturalmente, e Dario difende Napoli. Gli ascoltatori votano con un messaggio. Cominciamo dal cibo?"
    ],
    [
     "B",
     "Facile! La pizza di Napoli è la migliore del mondo. E il caffè napoletano è più forte e più buono di quello di Bologna."
    ],
    [
     "A",
     "Più forte sì, più buono non so. Però i tortellini sono migliori di qualsiasi pizza, e la mortadella è il salume più famoso d'Italia."
    ],
    [
     "B",
     "Va bene, pareggio. Parliamo della città: Napoli è molto più grande di Bologna e più antica. Ha quasi tremila anni!"
    ],
    [
     "A",
     "Più grande non vuol dire più bella. Bologna è meno caotica e molto più tranquilla. Da noi vai dappertutto in bici, e il centro è più pulito."
    ],
    [
     "B",
     "Tranquilla? Io direi noiosa! Il mio quartiere a Napoli, i Quartieri Spagnoli, ha vicoli strettissimi e pieni di vita. Qui le strade sono più larghe, ma alle dieci di sera non c'è nessuno."
    ],
    [
     "A",
     "Non è vero: in via del Pratello alle dieci la sera comincia! E poi Bologna ha l'università più antica del mondo occidentale."
    ],
    [
     "B",
     "E Napoli ha il mare, il Vesuvio e il clima migliore. D'inverno qui c'è la nebbia, a Napoli c'è il sole."
    ],
    [
     "A",
     "E i prezzi? Qui l'affitto è caro, lo ammetto. Ma a Napoli la vita è più economica?"
    ],
    [
     "B",
     "Molto più economica! Con dieci euro mangi meglio che in qualsiasi ristorante di qui. E i vestiti: da noi ai mercati trovi tutte le taglie a metà prezzo."
    ],
    [
     "A",
     "E la gente? Dicono che i napoletani sono i più furbi d'Italia..."
    ],
    [
     "B",
     "Furbi? Siamo i più simpatici! E il treno per Roma è velocissimo, quindi anche i romani sono vicini."
    ],
    [
     "A",
     "Bene, arrivano i risultati. Hanno votato più di trecento ascoltatori. Per Napoli... centoquarantotto voti. Per Bologna... centoquarantotto!"
    ],
    [
     "B",
     "Pareggio! Allora la sfida continua la settimana prossima, con la pizza e i tortellini in studio. Il peggiore cuoco perde!"
    ]
   ],
   "gloss": {
    "sfida": "desafío, duelo",
    "salume": "fiambre",
    "pareggio": "empate",
    "caotica": "caótica",
    "dappertutto": "por todos lados",
    "vicoli": "callejones",
    "occidentale": "occidental",
    "affitto": "alquiler",
    "qualsiasi": "cualquier",
    "napoletani": "napolitanos",
    "napoletano": "napolitano"
   },
   "questions": [
    [
     "Secondo Dario, perché Napoli è migliore per mangiare?",
     [
      "Perché la pizza e il caffè sono i migliori",
      "Perché i ristoranti sono più eleganti",
      "Perché ci sono più mercati del pesce",
      "Perché i tortellini napoletani sono famosi"
     ],
     "Perché la pizza e il caffè sono i migliori"
    ],
    [
     "Che cosa dice Sara delle sere di Bologna?",
     [
      "Che alle dieci di sera non c'è nessuno",
      "Che in via del Pratello alle dieci la sera comincia",
      "Che è più caotica di quella di Napoli",
      "Che è troppo cara per gli studenti"
     ],
     "Che in via del Pratello alle dieci la sera comincia"
    ],
    [
     "Come finisce la sfida?",
     [
      "Vince Napoli",
      "Vince Bologna",
      "Finisce in pareggio",
      "Non vota nessuno degli ascoltatori"
     ],
     "Finisce in pareggio"
    ]
   ],
   "info": [
    [
     "Secondo Dario, a Napoli la vita costa meno.",
     true
    ],
    [
     "Sara ammette che a Bologna l'affitto è caro.",
     true
    ],
    [
     "Dario dice che a Napoli piove più che a Bologna.",
     false
    ]
   ],
   "grammatica": {
    "label": "comparativos (più… di, più… che, meno) y superlativos, con migliore, peggiore y meglio",
    "forme": [
     "la migliore del mondo",
     "più forte e più buono di quello",
     "migliori di qualsiasi pizza",
     "il salume più famoso",
     "molto più grande di Bologna",
     "meno caotica",
     "più tranquilla",
     "più larghe",
     "l'università più antica",
     "il clima migliore",
     "più economica",
     "meglio che in qualsiasi ristorante",
     "i più furbi",
     "il peggiore cuoco",
     "strettissimi",
     "velocissimo"
    ]
   },
   "parole": [
    [
     "migliore",
     "migliore"
    ],
    [
     "antica",
     "antico"
    ],
    [
     "noiosa",
     "noioso"
    ],
    [
     "quartiere",
     "quartiere"
    ],
    [
     "strettissimi",
     "stretto"
    ],
    [
     "larghe",
     "largo"
    ],
    [
     "economica",
     "economico"
    ],
    [
     "meglio",
     "meglio"
    ],
    [
     "vestiti",
     "vestito"
    ],
    [
     "taglie",
     "taglia"
    ],
    [
     "furbi",
     "furbo"
    ],
    [
     "velocissimo",
     "veloce"
    ],
    [
     "peggiore",
     "peggiore"
    ]
   ],
   "qlang": "it",
   "infoPrompt": "Lo dice o non lo dice?",
   "infoYes": "Lo dice",
   "infoNo": "Non lo dice"
  },
  {
   "week": 24,
   "level": "B1",
   "title": "L'autobus della notte",
   "genre": "commento alle notizie",
   "es": "En el diario del barrio sale una noticia que enoja a los estudiantes: la ciudad quiere sacar un colectivo nocturno. Sara y Leo la comentan, cada uno con su opinión, y leen los mensajes de los oyentes.",
   "speakers": [
    "Sara",
    "Leo"
   ],
   "turns": [
    [
     "A",
     "Buongiorno! Oggi commentiamo una notizia del giornale di quartiere: il Comune vuole cancellare l'autobus della notte, quello che parte dalla stazione a mezzanotte e mezza. In studio c'è Leo. Leo, che te ne pare?"
    ],
    [
     "B",
     "Mi pare una sciocchezza. Penso che sia un errore grave: molti studenti tornano a casa tardi dal lavoro, e senza l'autobus devono prendere un taxi o tornare a piedi."
    ],
    [
     "A",
     "Però il Comune dice che di notte i passeggeri sono pochi e che l'autobus costa troppo. Secondo me hanno un po' ragione: i soldi sono delle nostre tasse."
    ],
    [
     "B",
     "Non sono d'accordo. Credo che i mezzi pubblici servano proprio a questo: a chi non ha la macchina. E poi dubito che i passeggeri siano così pochi: io lo prendo ogni venerdì ed è sempre pieno."
    ],
    [
     "A",
     "Vediamo che cosa dicono gli ascoltatori. Scrive Marta: «Mi sembra che il Comune abbia torto. Io lavoro in un ristorante e finisco all'una. Voglio che qualcuno pensi anche a noi»."
    ],
    [
     "B",
     "Brava Marta! Ecco, è proprio questo l'argomento."
    ],
    [
     "A",
     "Scrive invece il signor Bruno: «Non credo che sia un problema: la notte i giovani fanno rumore sull'autobus e non sono educati. Meglio che stiano a casa!»"
    ],
    [
     "B",
     "Questo mi pare un pettegolezzo, non un argomento! Io non conosco nessuno che faccia rumore alle due di notte."
    ],
    [
     "A",
     "Va bene, calma. C'è anche chi propone una soluzione: un autobus più piccolo, ogni ora invece di ogni mezz'ora. Pare che il Comune ci stia pensando."
    ],
    [
     "B",
     "Una soluzione così mi piace. Basta che sia affidabile e che passi davvero, perché d'inverno aspettare alla fermata è terribile."
    ],
    [
     "A",
     "Allora speriamo che il Comune ascolti anche Radio Portici. E voi, ascoltatori: pensate che l'autobus della notte serva? Scriveteci, e leggeremo i messaggi domani."
    ]
   ],
   "gloss": {
    "quartiere": "barrio",
    "che te ne pare?": "¿qué te parece?",
    "grave": "grave, serio",
    "passeggeri": "pasajeros",
    "rumore": "ruido",
    "propone": "propone",
    "ci stia pensando": "lo esté pensando",
    "Basta che": "con tal de que, alcanza con que",
    "fermata": "parada",
    "Scriveteci": "escríbannos"
   },
   "questions": [
    [
     "Che cosa vuole fare il Comune?",
     [
      "Cancellare l'autobus della notte",
      "Aumentare il prezzo del biglietto",
      "Chiudere la stazione di notte",
      "Comprare autobus più grandi"
     ],
     "Cancellare l'autobus della notte"
    ],
    [
     "Perché Leo non crede che i passeggeri siano pochi?",
     [
      "Perché lo dice il giornale",
      "Perché lui prende l'autobus il venerdì ed è sempre pieno",
      "Perché lo ha letto in un messaggio",
      "Perché lavora in un ristorante fino all'una"
     ],
     "Perché lui prende l'autobus il venerdì ed è sempre pieno"
    ],
    [
     "Quale soluzione piace a Leo?",
     [
      "Un taxi gratis per tutti gli studenti",
      "Un autobus più piccolo, ogni ora",
      "Andare a casa a piedi",
      "Un autobus solo il venerdì"
     ],
     "Un autobus più piccolo, ogni ora"
    ]
   ],
   "info": [
    [
     "All'inizio Sara pensa che il Comune abbia un po' ragione.",
     true
    ],
    [
     "Marta lavora in un bar della stazione.",
     false
    ],
    [
     "Secondo il signor Bruno i giovani non sono educati.",
     true
    ]
   ],
   "grammatica": {
    "label": "el congiuntivo presente después de penso, credo, mi sembra, dubito, voglio, speriamo",
    "forme": [
     "penso che sia",
     "credo che i mezzi pubblici servano",
     "dubito che i passeggeri siano",
     "mi sembra che il comune abbia torto",
     "voglio che qualcuno pensi",
     "non credo che sia",
     "meglio che stiano",
     "nessuno che faccia",
     "pare che il comune ci stia pensando",
     "basta che sia",
     "che passi",
     "speriamo che il comune ascolti",
     "pensate che l'autobus della notte serva"
    ]
   },
   "parole": [
    [
     "notizia",
     "notizia"
    ],
    [
     "cancellare",
     "cancellare"
    ],
    [
     "pare",
     "parere"
    ],
    [
     "sciocchezza",
     "sciocchezza"
    ],
    [
     "tasse",
     "tasse"
    ],
    [
     "secondo",
     "secondo"
    ],
    [
     "d'accordo",
     "d'accordo"
    ],
    [
     "mezzi pubblici",
     "mezzi pubblici"
    ],
    [
     "dubito",
     "dubitare"
    ],
    [
     "torto",
     "torto"
    ],
    [
     "argomento",
     "argomento"
    ],
    [
     "educati",
     "educato"
    ],
    [
     "pettegolezzo",
     "pettegolezzo"
    ],
    [
     "affidabile",
     "affidabile"
    ]
   ],
   "qlang": "it",
   "infoPrompt": "Lo dice o non lo dice?",
   "infoYes": "Lo dice",
   "infoNo": "Non lo dice"
  },
  {
   "week": 25,
   "level": "B1",
   "title": "La posta del cuore",
   "genre": "rubrica di consigli",
   "es": "Último programa de la temporada: Sara y Dario abren «La posta del cuore» (el correo sentimental). Dario lee la carta de una oyente con un problema de pareja y los dos le dan consejos.",
   "speakers": [
    "Sara",
    "Dario"
   ],
   "turns": [
    [
     "A",
     "Ed eccoci all'ultima puntata della stagione: oggi apriamo «La posta del cuore». Dario, leggi tu la lettera?"
    ],
    [
     "B",
     "Volentieri. Scrive Chiara, ventisei anni: «Cari Sara e Dario, sto con Paolo da tre anni e siamo una bella coppia. Ma da qualche mese Paolo è geloso della mia amicizia con Luca, un collega di lavoro. Ogni volta che esco con i colleghi si lamenta e mi chiede con chi sono. Io non credo di aver fatto niente di male. Venerdì abbiamo litigato e adesso non ci parliamo. Che cosa mi consigliate?»"
    ],
    [
     "A",
     "Povera Chiara. Prima di tutto, è giusto che lei esca con i suoi colleghi. In un rapporto sano bisogna che ci sia fiducia."
    ],
    [
     "B",
     "Sono d'accordo, ma bisogna ammettere anche un'altra cosa: forse Paolo si sente escluso. È normale che una persona abbia paura di perdere chi ama."
    ],
    [
     "A",
     "Può darsi. Allora il mio consiglio è questo: bisogna che si parlino con calma, senza gridare. Chiara, è importante che tu spieghi a Paolo chi è Luca, e che lui ti dica che cosa lo preoccupa."
    ],
    [
     "B",
     "E io le consiglio di invitare Paolo alla prossima cena con i colleghi. Così vede che Luca è solo un amico."
    ],
    [
     "A",
     "Bella idea! Però attenzione: non è giusto nemmeno che Paolo controlli sempre il telefono di Chiara. Se non cambia, è meglio che lei ci pensi bene."
    ],
    [
     "B",
     "Vuoi dire che è meglio che si lascino?"
    ],
    [
     "A",
     "No, non dico questo. Spero che non si lascino! Dico solo che l'amore senza fiducia non dura."
    ],
    [
     "B",
     "Allora, Chiara, noi speriamo che facciate pace presto e che venerdì prossimo usciate tutti insieme."
    ],
    [
     "A",
     "Ti auguro che la cena vada benissimo! E voi, cari ascoltatori, grazie per questa stagione con Radio Portici. Ci sentiamo a settembre!"
    ],
    [
     "B",
     "Buone vacanze a tutti!"
    ]
   ],
   "gloss": {
    "eccoci": "acá estamos",
    "puntata": "emisión, capítulo",
    "stagione": "temporada",
    "collega": "compañero de trabajo",
    "colleghi": "compañeros de trabajo",
    "abbiamo litigato": "nos peleamos",
    "sano": "sano",
    "escluso": "excluido",
    "Può darsi": "puede ser",
    "gridare": "gritar",
    "lo preoccupa": "le preocupa",
    "nemmeno": "tampoco, ni siquiera",
    "dura": "dura"
   },
   "questions": [
    [
     "Perché Chiara scrive alla radio?",
     [
      "Perché Paolo è geloso di un suo collega",
      "Perché vuole lasciare il lavoro",
      "Perché Luca è innamorato di lei",
      "Perché Paolo non vuole uscire"
     ],
     "Perché Paolo è geloso di un suo collega"
    ],
    [
     "Che cosa consiglia Dario?",
     [
      "Di non uscire più la sera con i colleghi di lavoro",
      "Di invitare Paolo alla cena con i colleghi",
      "Di cambiare lavoro",
      "Di scrivere una lettera a Luca"
     ],
     "Di invitare Paolo alla cena con i colleghi"
    ],
    [
     "Secondo Sara, che cosa è necessario in una coppia?",
     [
      "La fiducia",
      "La gelosia",
      "Uscire sempre insieme",
      "Avere gli stessi amici"
     ],
     "La fiducia"
    ]
   ],
   "info": [
    [
     "Chiara e Paolo stanno insieme da tre anni.",
     true
    ],
    [
     "Dario pensa che Paolo abbia paura di perdere Chiara.",
     true
    ],
    [
     "Sara consiglia a Chiara di lasciare Paolo subito.",
     false
    ]
   ],
   "grammatica": {
    "label": "cuándo va el congiuntivo: è giusto che, bisogna che, spero che, è meglio che, ti auguro che",
    "forme": [
     "è giusto che lei esca",
     "bisogna che ci sia",
     "è normale che una persona abbia",
     "bisogna che si parlino",
     "è importante che tu spieghi",
     "che lui ti dica",
     "che paolo controlli",
     "è meglio che lei ci pensi",
     "che si lascino",
     "spero che non si lascino",
     "speriamo che facciate pace",
     "che usciate",
     "ti auguro che la cena vada"
    ]
   },
   "parole": [
    [
     "coppia",
     "coppia"
    ],
    [
     "geloso",
     "geloso"
    ],
    [
     "amicizia",
     "amicizia"
    ],
    [
     "lamenta",
     "lamentarsi"
    ],
    [
     "consigliate",
     "consigliare"
    ],
    [
     "giusto",
     "giusto"
    ],
    [
     "rapporto",
     "rapporto"
    ],
    [
     "bisogna",
     "bisognare"
    ],
    [
     "fiducia",
     "fiducia"
    ],
    [
     "ammettere",
     "ammettere"
    ],
    [
     "lascino",
     "lasciarsi"
    ],
    [
     "spero",
     "sperare"
    ],
    [
     "facciate pace",
     "fare pace"
    ],
    [
     "auguro",
     "augurare"
    ]
   ],
   "qlang": "it",
   "infoPrompt": "Lo dice o non lo dice?",
   "infoYes": "Lo dice",
   "infoNo": "Non lo dice"
  }
 ]
};
  if (typeof module === "object" && module.exports) module.exports = root.RADIO_DATA;
})(typeof window !== "undefined" ? window : globalThis);
