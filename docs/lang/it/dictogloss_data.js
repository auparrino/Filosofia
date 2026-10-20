/* Dictogloss: un texto por semana, con seis bloques léxicos a recuperar. Solo datos.
   Semanas 2-51 salvo las de jefe (13, 26, 39). El alumno escucha el texto dos veces,
   anota palabras clave y lo reconstruye; la app puntúa la recuperación de los `chunks`. */
(function (root) {
  "use strict";
  var TESTI = [
    { week: 2, level: "A1", title: "La casa",
      es: "Alguien describe su casa: las habitaciones, los muebles y los animales que tiene.",
      text: "La casa è piccola ma bella. Ci sono due camere, una cucina e un bagno. In cucina c'è un tavolo con quattro sedie. Ho un cane e due gatti. I gatti sono neri e il cane è bianco. In camera ci sono molti libri e una finestra grande. Non c'è un giardino, ma c'è un balcone piccolo.",
      chunks: ["ci sono due camere", "quattro sedie", "molti libri", "una finestra grande", "il cane è bianco", "un balcone piccolo"],
      keywords: ["casa", "camere", "cucina", "sedie", "gatti", "libri", "balcone"],
      gloss: {} },

    { week: 3, level: "A1", title: "Al bar",
      es: "Una mañana en un bar italiano: qué hay en la barra, qué toma la gente y cómo se pide un café.",
      text: "Al bar c'è sempre molta gente. Il caffè è buono e il cornetto è caldo. Sul bancone ci sono i giornali e lo zucchero. Un signore ha un cappuccino e una brioche. Le paste sono nella vetrina. Il barista è simpatico. Buongiorno, un caffè, per favore. Grazie mille. Prego, ecco il caffè.",
      chunks: ["molta gente", "sul bancone", "lo zucchero", "una brioche", "per favore", "grazie mille"],
      keywords: ["bar", "caffè", "cornetto", "bancone", "zucchero", "cappuccino", "barista"],
      gloss: {
        "cornetto": "medialuna (la del desayuno italiano)",
        "bancone": "la barra del bar",
        "Le paste": "las masitas, las facturas (acá «pasta» no son fideos)",
        "Prego": "de nada / acá tiene (respuesta a «grazie»)",
        "ecco il caffè": "acá está el café (ecco = acá está, aquí tiene)"
      } },

    { week: 4, level: "A1", title: "Marta e Paolo",
      es: "Descripción de dos amigos muy distintos: cómo son por fuera y por dentro.",
      text: "Marta è una ragazza italiana, di Bologna. È alta e magra, con i capelli lunghi e gli occhi verdi. È molto simpatica e un po' timida. Paolo è un amico argentino di Marta. È basso, ha i capelli corti e una barba nera. È intelligente ma pigro. Sono due persone diverse, ma sono buoni amici. Bologna è una città bella e antica.",
      chunks: ["alta e magra", "i capelli lunghi", "gli occhi verdi", "un po' timida", "buoni amici", "bella e antica"],
      keywords: ["Marta", "Bologna", "capelli", "occhi", "timida", "Paolo", "barba", "amici"],
      gloss: {
        "magra": "flaca (de una persona)",
        "pigro": "vago, perezoso"
      } },

    { week: 5, level: "A1", title: "La giornata di Luca",
      es: "La rutina de Luca, de lunes a viernes: el tren, el trabajo, la cena y la tele. Y el sábado, a dormir.",
      text: "Luca abita a Torino e lavora in un ufficio in centro. La mattina prende il treno alle otto. A mezzogiorno mangia un panino con i colleghi e parla di calcio. La sera torna a casa, cucina la pasta e guarda la televisione. Qualche volta legge un libro. Il sabato non lavora: dorme fino a tardi e scrive agli amici.",
      chunks: ["prende il treno", "un panino", "torna a casa", "guarda la televisione", "qualche volta", "fino a tardi"],
      keywords: ["Torino", "ufficio", "treno", "panino", "colleghi", "pasta", "televisione", "sabato"],
      gloss: {
        "abita": "vive (abitare = vivir en un lugar)",
        "colleghi": "compañeros de trabajo",
        "Qualche volta": "a veces",
        "fino a tardi": "hasta tarde"
      } },

    { week: 6, level: "A1", title: "Il fine settimana",
      es: "Qué hace alguien el sábado con los amigos y el domingo con los abuelos, entre lo que quiere y lo que debe hacer.",
      text: "Il sabato esco con gli amici. Andiamo al cinema o facciamo una passeggiata in centro. Poi beviamo qualcosa in un bar. La domenica vengono i nonni a pranzo e devo cucinare. Non so cucinare bene, ma faccio la pasta al pomodoro. Nel pomeriggio voglio riposare, ma non posso: i nonni vogliono giocare a carte. Sto bene con loro.",
      chunks: ["esco con gli amici", "una passeggiata", "devo cucinare", "non posso", "giocare a carte", "sto bene"],
      keywords: ["sabato", "amici", "cinema", "domenica", "nonni", "pranzo", "carte"],
      gloss: {
        "facciamo una passeggiata": "salimos a caminar, damos una vuelta",
        "a pranzo": "a almorzar (il pranzo = el almuerzo)",
        "giocare a carte": "jugar a las cartas",
        "Sto bene con loro": "la paso bien con ellos (stare bene = estar bien, pasarla bien)"
      } },

    { week: 7, level: "A1", title: "L'agenda della settimana",
      es: "La agenda de una semana: horarios, una reunión, un cumpleaños, el dentista y un viaje a Roma.",
      text: "Lunedì alle nove ho una riunione in ufficio. Martedì pomeriggio, alle cinque e mezza, vado in palestra. Mercoledì è il compleanno di Anna: ha ventisette anni e la festa comincia alle otto. Giovedì mattina vado dal dentista alle dieci e un quarto. Venerdì pranzo con Paolo all'una. Sabato e domenica sono libero. Il quindici giugno parto per Roma.",
      chunks: ["alle nove", "una riunione", "cinque e mezza", "il compleanno di Anna", "dieci e un quarto", "sono libero"],
      keywords: ["lunedì", "riunione", "palestra", "compleanno", "ventisette", "dentista", "Roma"],
      gloss: {
        "palestra": "gimnasio (no «palestra»)",
        "vado dal dentista": "voy al dentista (da + persona = a lo de, al consultorio de; se ve en la semana 9)",
        "pranzo con Paolo": "almuerzo con Paolo (pranzare = almorzar)",
        "all'una": "a la una",
        "parto per Roma": "salgo para Roma, me voy a Roma"
      } },

    { week: 8, level: "A2", title: "Un nuovo collega",
      es: "Llega un compañero nuevo a la oficina y todos le hacen preguntas. Él responde con calma.",
      text: "Oggi arriva un nuovo collega e tutti hanno domande. Come ti chiami? Di dove sei? Dove abiti adesso? Quanti anni hai? Che lavoro fai qui? Perché studi italiano? Con chi vivi? Quale musica preferisci? Lui risponde con calma: si chiama Diego, è argentino, abita in centro con un amico e ha trentadue anni. Alla fine chiede: chi vuole un caffè?",
      chunks: ["un nuovo collega", "come ti chiami", "di dove sei", "quanti anni hai", "che lavoro fai", "con calma"],
      keywords: ["collega", "domande", "chiami", "abiti", "lavoro", "musica", "Diego", "caffè"],
      gloss: {} },

    { week: 9, level: "A2", title: "Una settimana in giro",
      es: "Adónde va alguien cada día de la semana y cómo llega: en colectivo, en tren, a pie.",
      text: "Lunedì vado in ufficio in autobus. Martedì sera vado da Marta: studiamo italiano insieme da due mesi. Giovedì parto per Firenze in treno con Paola. Dormiamo a casa di un amico, vicino alla stazione. Sabato mattina andiamo al mercato a piedi e compriamo frutta per la settimana. Domenica resto a casa e parlo con la famiglia in Argentina.",
      chunks: ["in autobus", "da due mesi", "in treno", "vicino alla stazione", "a piedi", "resto a casa"],
      keywords: ["autobus", "Marta", "Firenze", "treno", "stazione", "mercato", "famiglia"],
      gloss: {
        "vado da Marta": "voy a lo de Marta (da + persona)",
        "da due mesi": "hace dos meses (que lo hacemos y seguimos): da + presente",
        "resto a casa": "me quedo en casa (restare = quedarse)"
      } },

    { week: 10, level: "A2", title: "Amici e telefonate",
      es: "Alguien cuenta cómo se relaciona con sus amigos y familiares: a quién ve, a quién llama, a quién le escribe.",
      text: "Marco? Sì, lo conosco bene: lo vedo ogni giorno al lavoro. Anna? La chiamo stasera e le racconto tutto. I cugini? Li vedo il sabato, quando vengono a pranzo. A Paolo scrivo spesso: gli mando molte foto e lui mi risponde subito. E tu? Ti aspetto domani alle sei, prendiamo un caffè insieme. Va bene? Ci vediamo!",
      chunks: ["lo conosco bene", "ogni giorno", "la chiamo stasera", "gli mando molte foto", "mi risponde subito", "ci vediamo"],
      keywords: ["Marco", "lavoro", "Anna", "cugini", "Paolo", "foto", "domani", "caffè"],
      gloss: {
        "Va bene?": "¿te parece bien? ¿dale?",
        "Ci vediamo!": "¡nos vemos!"
      } },

    { week: 11, level: "A2", title: "Una giornata lunga",
      es: "Lo que pasó ayer: tren, trabajo hasta tarde, visita a un amigo y vuelta a casa a medianoche.",
      text: "Ieri ho avuto una giornata lunga. La mattina ho preso il treno alle sette e sono arrivato in ufficio in ritardo. Ho lavorato fino alle sei e ho mangiato un panino. Poi sono andato a trovare un amico: abbiamo parlato per due ore e abbiamo bevuto un bicchiere di vino. Sono tornato a casa a mezzanotte e ho dormito. Per fortuna oggi è sabato!",
      chunks: ["ho preso il treno", "in ritardo", "sono andato a trovare", "per due ore", "sono tornato a casa", "per fortuna"],
      keywords: ["ieri", "treno", "ufficio", "panino", "amico", "vino", "mezzanotte", "sabato"],
      gloss: {
        "in ritardo": "tarde, con retraso",
        "sono andato a trovare": "fui a visitar (andare a trovare qualcuno = ir a ver a alguien)",
        "Per fortuna": "por suerte"
      } },

    { week: 12, level: "A2", title: "La mattina di Sara",
      es: "La rutina matinal de Sara y los consejos que le da su mamá.",
      text: "Sara si sveglia alle sette, ma si alza alle sette e mezza. Si fa la doccia, si veste in fretta e fa colazione. Poi si lava i denti ed esce di casa. La mamma le dice sempre: mangia qualcosa, dormi di più e non lavorare troppo! Sara ride e risponde: stai tranquilla, mamma. Si sente bene, ma la sera si addormenta davanti alla televisione.",
      chunks: ["si sveglia alle sette", "si fa la doccia", "in fretta", "esce di casa", "dormi di più", "stai tranquilla"],
      keywords: ["Sara", "sveglia", "doccia", "colazione", "denti", "mamma", "televisione"],
      gloss: {
        "in fretta": "rápido, a las apuradas",
        "stai tranquilla": "quedate tranquila",
        "si addormenta": "se queda dormida (addormentarsi = dormirse, quedarse dormido)"
      } },

    { week: 14, level: "B1", title: "Gusti diversi",
      es: "Los gustos de una familia: la comida, el fútbol, la lectura y los planes del domingo.",
      text: "A me piace molto la cucina italiana e la pasta fatta in casa. Mi piacciono anche i dolci, ma non mi piace il caffè amaro. A mio fratello, invece, piace il calcio e gli piacciono le partite. A mia madre piace leggere la sera, ma non le piacciono i film dell'orrore. E a te, cosa piace fare la domenica? A noi piace fare una passeggiata al parco e poi prendere un gelato. I gusti sono diversi, ma stiamo bene insieme.",
      chunks: ["a me piace molto", "mi piacciono anche", "non mi piace", "non le piacciono", "prendere un gelato", "stiamo bene insieme"],
      keywords: ["cucina", "pasta", "dolci", "fratello", "calcio", "madre", "leggere", "gelato"],
      gloss: {
        "fatta in casa": "casera, hecha en casa",
        "film dell'orrore": "películas de terror",
        "stiamo bene insieme": "la pasamos bien juntos"
      } },

    { week: 15, level: "B1", title: "Quando ero piccolo",
      es: "Recuerdos de infancia junto al mar: la playa, los primos, la abuela y el día en que todo cambió.",
      text: "Quando ero piccolo abitavo in un paese vicino al mare. Ogni estate andavo in spiaggia con i cugini e giocavamo a pallone tutto il giorno. La nonna preparava sempre il pranzo alle dodici e noi tornavamo a casa affamati. Un giorno, però, mentre correvo sulla sabbia, sono caduto e ho rotto gli occhiali. La mamma ha detto che non era grave, ma quell'estate ho giocato poco. Che estate strana!",
      chunks: ["quando ero piccolo", "ogni estate", "tutto il giorno", "mentre correvo", "sono caduto", "non era grave"],
      keywords: ["piccolo", "mare", "estate", "spiaggia", "cugini", "nonna", "sabbia", "occhiali"],
      gloss: {
        "paese": "pueblo (en este contexto; no «país»)",
        "a pallone": "a la pelota",
        "affamati": "muertos de hambre, con mucha hambre",
        "occhiali": "anteojos"
      } },

    { week: 16, level: "B1", title: "Una giornata storta",
      es: "Un día que empezó mal: alguien se despertó tarde, salió corriendo y llegó al trabajo con dos zapatos distintos.",
      text: "Ieri mi sono svegliata tardi perché non ho sentito la sveglia. Mi sono lavata in due minuti, mi sono vestita in fretta e sono uscita senza colazione. In ufficio mi sono accorta di avere le scarpe di due colori diversi! I colleghi si sono messi a ridere e io mi sono arrabbiata un po'. La sera, però, io e Marco ci siamo incontrati in centro e ci siamo divertiti molto. Mi sono addormentata felice, verso mezzanotte.",
      chunks: ["mi sono svegliata tardi", "in due minuti", "mi sono accorta", "mi sono arrabbiata", "ci siamo divertiti molto", "verso mezzanotte"],
      keywords: ["sveglia", "colazione", "ufficio", "scarpe", "colleghi", "Marco", "centro", "mezzanotte"],
      gloss: {
        "sveglia": "despertador",
        "mi sono accorta": "me di cuenta (accorgersi = darse cuenta)",
        "si sono messi a ridere": "se pusieron a reír (mettersi a + infinitivo = ponerse a)"
      } },

    { week: 17, level: "B1", title: "Le foto di famiglia",
      es: "Alguien muestra fotos de su familia y cuenta la tradición de las vacaciones de verano todos juntos.",
      text: "Guarda queste foto. Questa è mia madre e questo è mio padre, davanti alla loro casa in campagna. Quella ragazza con il cappello è mia cugina Laura, e quei bambini sono i suoi figli. Ogni estate andiamo tutti insieme al mare: è la nostra tradizione. Alcuni parenti vengono dall'Argentina, altri dalla Spagna. Nessuno manca mai, e ognuno porta qualcosa da mangiare. Quest'anno tocca a me portare il dolce.",
      chunks: ["queste foto", "mia madre", "la loro casa", "quei bambini", "tutti insieme", "tocca a me"],
      keywords: ["foto", "madre", "padre", "campagna", "cappello", "Laura", "mare", "dolce"],
      gloss: {
        "Nessuno manca mai": "nunca falta nadie",
        "tocca a me": "me toca a mí",
        "il dolce": "el postre"
      } },

    { week: 18, level: "B1", title: "No a tutto",
      es: "Marco propone planes y su amigo dice que no a todo: está cansado y solo quiere descansar.",
      text: "Marco mi propone sempre qualcosa, ma questa settimana dico di no a tutto. Non vado mai in discoteca e non conosco nessuno a quella festa. Non ho niente da mettere e non ho neanche voglia di uscire. Non mi interessa né il cinema né il concerto. Che settimana difficile! Sono stanco morto: dormo poco e lavoro troppo. Domenica, però, non faccio proprio niente: resto a letto tutto il giorno. Com'è bello riposare!",
      chunks: ["dico di no", "non vado mai", "non conosco nessuno", "niente da mettere", "neanche voglia", "stanco morto"],
      keywords: ["Marco", "discoteca", "festa", "cinema", "concerto", "stanco", "domenica", "letto"],
      gloss: {
        "Non ho niente da mettere": "no tengo nada que ponerme",
        "non ho neanche voglia": "ni siquiera tengo ganas",
        "stanco morto": "muerto de cansancio, hecho pelota",
        "non faccio proprio niente": "no hago absolutamente nada (proprio refuerza la negación)"
      } },

    { week: 19, level: "B1", title: "Vacanze in Sardegna",
      es: "Planes para el verano en Cerdeña con dos amigos, y una suposición sobre Marco, que no contesta el teléfono.",
      text: "Quest'estate andrò in Sardegna con due amici. Prenderemo il traghetto da Genova e staremo dieci giorni a Cagliari. Visiteremo le spiagge del sud, mangeremo tanto pesce e faremo il bagno ogni mattina. Se avremo tempo, andremo anche ad Alghero. Marco non risponde al telefono da ieri: sarà già in vacanza, o avrà dimenticato il caricabatterie. Al ritorno vi prometto che vi mostrerò tutte le foto e vi racconterò tutto.",
      chunks: ["andrò in Sardegna", "dieci giorni", "faremo il bagno", "se avremo tempo", "sarà già in vacanza", "vi prometto che"],
      keywords: ["Sardegna", "traghetto", "Genova", "Cagliari", "spiagge", "pesce", "Marco", "foto"],
      gloss: {
        "traghetto": "ferry, barco que cruza",
        "faremo il bagno": "nos vamos a meter al agua, a bañar en el mar",
        "caricabatterie": "cargador (del celular)"
      } },

    { week: 20, level: "B1", title: "Una prenotazione",
      es: "Un mail cortés a un hotel: pedir una habitación, preguntar por el desayuno y por el horario de llegada.",
      text: "Buongiorno, vorrei prenotare una camera doppia per tre notti, dal dieci al tredici maggio. Sarebbe possibile avere una camera con vista sul mare? Mi piacerebbe anche sapere se la colazione è inclusa nel prezzo. Potrebbe dirmi a che ora si può arrivare? Noi arriveremmo verso le nove di sera, dopo il lavoro. Un'ultima cosa: potreste tenere il bagaglio per un giorno? Grazie mille, aspetto una risposta entro venerdì.",
      chunks: ["vorrei prenotare", "sarebbe possibile", "mi piacerebbe anche sapere", "potrebbe dirmi", "un'ultima cosa", "entro venerdì"],
      keywords: ["camera", "notti", "maggio", "mare", "colazione", "prezzo", "bagaglio", "venerdì"],
      gloss: {
        "camera doppia": "habitación doble",
        "tenere il bagaglio": "guardarnos el equipaje",
        "entro venerdì": "antes del viernes, a más tardar el viernes"
      } },

    { week: 21, level: "B1", title: "Al mercato",
      es: "Las compras del sábado en el mercado: cuánto de cada cosa, y el café del final.",
      text: "Al mercato ci vado ogni sabato mattina, e ci resto almeno un'ora. Compro sempre la frutta: oggi ne prendo due chili. Le uova? Ne compro sei, non di più. Il pane, invece, lo prendo dal fornaio sotto casa. Al banco del formaggio c'è sempre una fila lunga, ma ne vale la pena. Di pomodori ne ho già a casa, quindi non ne compro. Alla fine prendo un caffè al bar dell'angolo: ci penso tutta la settimana!",
      chunks: ["ci vado ogni sabato", "ne prendo due chili", "sotto casa", "ne vale la pena", "ci penso", "alla fine"],
      keywords: ["mercato", "sabato", "frutta", "uova", "pane", "fornaio", "formaggio", "pomodori"],
      gloss: {
        "fornaio": "panadero, panadería",
        "sotto casa": "acá abajo, en la cuadra de casa",
        "ne vale la pena": "vale la pena",
        "ci penso tutta la settimana": "lo pienso toda la semana, me quedo pensando en eso"
      } },

    { week: 22, level: "B1", title: "La festa di Giulia",
      es: "Los preparativos de un cumpleaños sorpresa: quién compra qué, quién trae qué y a quién no hay que contarle nada.",
      text: "Sabato è il compleanno di Giulia e organizzo io la festa. Il regalo gliel'ho già comprato: è un libro di ricette, e glielo do a fine serata. La torta? Me la prepara la nonna, come sempre. Marco vuole sapere l'indirizzo: glielo mando stasera con un messaggio. Le sedie ce le presta il vicino. E tu, hai bisogno delle foto della festa dell'anno scorso? Te le porto io lunedì. Mi raccomando, non dirlo a Giulia: è una sorpresa!",
      chunks: ["gliel'ho già comprato", "me la prepara", "glielo mando stasera", "ce le presta", "te le porto io", "mi raccomando"],
      keywords: ["compleanno", "Giulia", "regalo", "ricette", "torta", "nonna", "indirizzo", "sedie"],
      gloss: {
        "a fine serata": "al final de la noche, de la fiesta",
        "Mi raccomando": "¡ojo!, te lo pido por favor"
      } },

    { week: 23, level: "B1", title: "Due città",
      es: "Comparación entre Buenos Aires y Roma: tamaño, precios, café, carne y ruido.",
      text: "Buenos Aires è più grande di Roma, ma Roma è molto più antica. A Roma la vita è più cara che a Buenos Aires, soprattutto gli affitti. Il caffè italiano è migliore, secondo me, ma la carne argentina è la più buona del mondo. Roma è bellissima, però il traffico è peggiore del previsto. Tra le due, la città più rumorosa è senza dubbio Buenos Aires. In ogni caso, le amo tutte e due.",
      chunks: ["più grande di", "più cara che", "secondo me", "la più buona", "senza dubbio", "in ogni caso"],
      keywords: ["Roma", "antica", "affitti", "caffè", "carne", "traffico", "rumorosa"],
      gloss: {
        "affitti": "alquileres",
        "peggiore del previsto": "peor de lo que esperaba",
        "tutte e due": "las dos, ambas"
      } },

    { week: 24, level: "B1", title: "Un consiglio a Luca",
      es: "Anna le escribe a Luca, que tiene problemas con su jefe: qué piensa, qué espera y qué le aconseja.",
      text: "Caro Luca, penso che tu abbia ragione: il tuo capo è davvero troppo severo. Credo che sia stanco anche lui, ma spero che capisca presto la situazione. È importante che tu parli con lui con calma, magari davanti a un caffè. Non credo che voglia perdere un bravo collaboratore come te. Se la cosa non cambia, mi sa che devi cercare un altro lavoro. Comunque vada, sappi che io ci sono. Un abbraccio, Anna.",
      chunks: ["che tu abbia ragione", "credo che sia", "spero che capisca", "è importante che", "mi sa che", "un abbraccio"],
      keywords: ["Luca", "capo", "severo", "stanco", "situazione", "caffè", "lavoro", "Anna"],
      gloss: {
        "capo": "jefe",
        "mi sa che": "me parece que, me da que (coloquial)",
        "Comunque vada": "pase lo que pase (congiuntivo de andare)",
        "sappi che io ci sono": "sabé que me tenés, que acá estoy (sappi = imperativo de sapere)"
      } },

    { week: 25, level: "B1", title: "Lavorare da casa",
      es: "Una opinión sobre el trabajo desde casa: es cómodo, pero no para todos, y falta la pausa del café.",
      text: "Credo che lavorare da casa sia comodo, ma penso che non sia per tutti. Sembra che molte persone lavorino di più e si riposino di meno. Dubito che le aziende vogliano tornare indietro, anche se qualcuno lo spera. Bisogna che ognuno possa scegliere, a seconda del lavoro che fa. A dire il vero, io preferisco l'ufficio: temo che a casa mi distragga troppo. Benché sia più comodo, mi manca la pausa caffè con i colleghi.",
      chunks: ["penso che non sia", "sembra che", "dubito che", "bisogna che ognuno possa", "a dire il vero", "benché sia"],
      keywords: ["casa", "comodo", "persone", "aziende", "scegliere", "ufficio", "pausa", "colleghi"],
      gloss: {
        "tornare indietro": "volver atrás",
        "a seconda del": "según el, dependiendo del",
        "A dire il vero": "a decir verdad",
        "mi distragga": "me distraiga (distrarsi = distraerse)"
      } },

    { week: 27, level: "B2", title: "Mio fratello al lavoro",
      es: "Cómo trabaja el hermano del narrador: puntual, paciente, amable, pero siempre agotado.",
      text: "Mio fratello lavora in una piccola agenzia di viaggi e, francamente, non conosco nessuno così preciso. Arriva puntualmente alle otto, saluta gentilmente tutti e si siede immediatamente al computer. Parla lentamente e chiaramente con i clienti, anche quando sono nervosi, e ascolta pazientemente ogni richiesta. Raramente si arrabbia. Purtroppo, però, la sera esce quasi sempre tardi e torna a casa distrutto. Ultimamente gli ho detto che dovrebbe riposare di più, ma lui, ovviamente, non mi ascolta affatto.",
      chunks: ["arriva puntualmente", "lentamente e chiaramente", "raramente si arrabbia", "quasi sempre", "riposare di più", "non mi ascolta affatto"],
      keywords: ["fratello", "agenzia", "puntualmente", "computer", "clienti", "pazientemente", "distrutto", "ultimamente"],
      gloss: {
        "distrutto": "hecho pedazos, agotado",
        "non mi ascolta affatto": "no me escucha para nada (affatto refuerza la negación)"
      } },

    { week: 28, level: "B2", title: "Città o campagna",
      es: "Argumentos a favor de vivir en la ciudad, con sus pros y sus contras, y una concesión al campo.",
      text: "A mio parere è meglio vivere in città, anche se il traffico è un problema serio. Infatti in città ci sono più servizi: ospedali, scuole, trasporti e, soprattutto, lavoro. In campagna, invece, la vita è più tranquilla e l'aria è pulita; tuttavia per lavorare bisogna usare la macchina ogni giorno. Inoltre, quando uno è giovane, ha voglia di uscire, di conoscere gente, di cambiare. Quindi io resto in città, almeno per ora. In fondo, il fine settimana uno può sempre scappare in collina.",
      chunks: ["a mio parere", "anche se", "l'aria è pulita", "ha voglia di uscire", "almeno per ora", "in fondo"],
      keywords: ["città", "traffico", "servizi", "campagna", "aria", "macchina", "giovane", "collina"],
      gloss: {
        "In fondo": "al fin y al cabo (literalmente «en el fondo»)",
        "scappare in collina": "escaparse a las sierras, a las colinas"
      } },

    { week: 29, level: "B2", title: "Notizie dagli amici",
      es: "Reacciones a las novedades de los amigos: un trabajo nuevo, un viaje dudoso, una ausencia y un compromiso.",
      text: "Ieri ho sentito un sacco di notizie. Sono contenta che Marta abbia finalmente trovato un lavoro nuovo: se lo meritava. Non credo che Luca sia partito davvero per l'Australia; è strano che non mi abbia detto niente, di solito mi racconta tutto. Mi dispiace che i cugini non siano venuti alla festa di sabato, anche se immagino che abbiano avuto un buon motivo. Spero che almeno abbiano ricevuto l'invito. Comunque, mi fa piacere che tutti stiano bene. Tra l'altro, pare che Anna si sia fidanzata!",
      chunks: ["un sacco di", "sono contenta che", "sia partito davvero", "non mi abbia detto", "di solito", "tra l'altro"],
      keywords: ["notizie", "Marta", "lavoro", "Luca", "Australia", "cugini", "festa", "Anna"],
      gloss: {
        "un sacco di": "un montón de",
        "se lo meritava": "se lo merecía",
        "Tra l'altro": "entre otras cosas, de paso",
        "pare che": "parece que (+ congiuntivo)",
        "si sia fidanzata": "se puso de novia, se comprometió"
      } },

    { week: 30, level: "B2", title: "Quello che volevano i miei",
      es: "Lo que los padres querían para el narrador cuando era chico, lo que él deseaba, y lo que hoy desea para sus hijos.",
      text: "Da piccolo i miei genitori volevano che studiassi medicina e che diventassi un bravo dottore, come lo zio. Mia madre sperava che imparassi il pianoforte e mi mandava a lezione ogni pomeriggio. Io, invece, desideravo che mi lasciassero giocare a calcio con gli amici fino a sera. Non sapevo che avessero già parlato con un'insegnante di musica. Oggi vorrei che i miei figli scegliessero da soli, senza pressioni, e che fossero felici. Magari avessi avuto io la stessa libertà!",
      chunks: ["da piccolo", "volevano che studiassi", "fino a sera", "non sapevo che avessero", "vorrei che", "magari avessi avuto"],
      keywords: ["genitori", "medicina", "dottore", "pianoforte", "calcio", "musica", "figli", "libertà"],
      gloss: {
        "da soli": "solos, por su cuenta",
        "Magari avessi avuto": "¡ojalá hubiera tenido! (magari + congiuntivo = ojalá)"
      } },

    { week: 31, level: "B2", title: "Rimpianti",
      es: "Lo que el narrador habría hecho distinto el año pasado, y las promesas que otros no cumplieron (*non si è fatto vivo* = no dio señales de vida).",
      text: "L'anno scorso avrei dovuto studiare di più e, onestamente, sarei andato volentieri a vivere all'estero per qualche mese. Avrei preferito un lavoro meno stressante, ma non ho avuto il coraggio di cambiare. Marco aveva detto che mi avrebbe aiutato con il trasloco, e invece non si è fatto vivo. Mia sorella mi aveva promesso che sarebbe venuta a trovarmi a Natale, ma all'ultimo momento ha cambiato idea. Chissà, forse senza tutti quegli imprevisti sarei stato più tranquillo. Pazienza: quest'anno ci riprovo.",
      chunks: ["avrei dovuto studiare", "sarei andato volentieri", "avrei preferito", "mi avrebbe aiutato", "si è fatto vivo", "all'ultimo momento"],
      keywords: ["studiare", "estero", "lavoro", "coraggio", "Marco", "trasloco", "sorella", "Natale"],
      gloss: {
        "trasloco": "mudanza",
        "non si è fatto vivo": "no dio señales de vida, no apareció (farsi vivo; se ve en la semana 40)",
        "Chissà": "quién sabe",
        "imprevisti": "imprevistos, contratiempos",
        "Pazienza": "qué se le va a hacer",
        "ci riprovo": "lo vuelvo a intentar"
      } },

    { week: 32, level: "B2", title: "Un malinteso",
      es: "Un malentendido con Anna: lo que el narrador creía, lo que sabía y lo que pasó de verdad.",
      text: "Pensavo che il treno partisse alle otto, invece era già partito alle sette e mezza. Credevo che Anna mi avesse lasciato un messaggio, ma sul telefono non c'era niente. Sapevo che sarebbe arrivata in ritardo, però non immaginavo che non venisse proprio. Alla fine ho scoperto che aveva capito male il giorno: era convinta che l'appuntamento fosse per domenica. Ci siamo fatti una risata e abbiamo deciso che la prossima volta ci saremmo scritti il giorno prima. Meglio così: almeno adesso la storia è divertente.",
      chunks: ["il treno partisse", "era già partito", "mi avesse lasciato", "aveva capito male", "la prossima volta", "meglio così"],
      keywords: ["treno", "Anna", "messaggio", "telefono", "ritardo", "appuntamento", "domenica", "risata"],
      gloss: {
        "non venisse proprio": "no viniera directamente, que no viniera para nada",
        "Ci siamo fatti una risata": "nos reímos un rato",
        "Meglio così": "mejor así"
      } },

    { week: 33, level: "B2", title: "Se vincessi",
      es: "Hipótesis de todo tipo: la lotería, más tiempo, el italiano nunca empezado, la lluvia de mañana y una mudanza a Italia (*come si deve* = como corresponde).",
      text: "Se vincessi la lotteria, comprerei una casa in Toscana e smetterei di lavorare il giorno dopo. Se avessi più tempo, viaggerei ogni mese e imparerei finalmente a cucinare come si deve. Se non avessi cominciato a studiare italiano, non avrei conosciuto tanti amici nuovi e non sarei mai andato a Bologna. Se domani piove, resto a casa a leggere; se invece esce il sole, vado in bicicletta fino al fiume. E se un giorno mi chiedessero di trasferirmi in Italia, sinceramente, non ci penserei due volte.",
      chunks: ["se vincessi la lotteria", "se avessi più tempo", "come si deve", "non avrei conosciuto", "se domani piove", "ci penserei due volte"],
      keywords: ["lotteria", "Toscana", "tempo", "cucinare", "italiano", "Bologna", "sole", "bicicletta"],
      gloss: {
        "come si deve": "como corresponde, como Dios manda",
        "smetterei di lavorare": "dejaría de trabajar (smettere di = dejar de)",
        "non ci penserei due volte": "no lo pensaría dos veces"
      } },

    { week: 34, level: "B2", title: "Il mio quartiere",
      es: "El barrio del narrador: la plaza, el panadero que conoce a todos, la compañera de departamento y la gente que todavía saluda.",
      text: "Abito in un quartiere che mi piace molto. La piazza in cui gioco a carte con i vicini è piccola ma piena di vita. Il fornaio da cui compro il pane ogni mattina è un signore anziano che conosce tutti per nome. La ragazza con la quale divido l'appartamento lavora in un teatro, il che significa che torna sempre tardi. Chi vive qui da anni dice che il quartiere è cambiato, ma quello che vedo io è un posto dove la gente si saluta ancora per strada.",
      chunks: ["in cui", "piena di vita", "da cui compro", "con la quale", "il che significa", "quello che vedo"],
      keywords: ["quartiere", "piazza", "carte", "vicini", "fornaio", "appartamento", "teatro", "strada"],
      gloss: {
        "divido l'appartamento": "comparto el departamento",
        "il che significa": "lo cual significa (il che retoma toda la frase anterior)",
        "quello che vedo io": "lo que veo yo"
      } },

    { week: 35, level: "B2", title: "Il Duomo di Milano",
      es: "La historia del Duomo de Milán: seis siglos de obras, el mármol del lago, los daños y las restauraciones.",
      text: "Il Duomo di Milano è stato costruito in quasi sei secoli. I lavori sono iniziati alla fine del Trecento e la facciata è stata completata solo nell'Ottocento, per volontà di Napoleone. Il marmo bianco veniva trasportato dal lago Maggiore attraverso i canali della città. Nel corso del tempo la chiesa è stata danneggiata dalle guerre e dall'inquinamento, perciò viene restaurata continuamente. Oggi il Duomo è visitato da milioni di persone ogni anno e le sue terrazze sono considerate uno dei posti più belli della città.",
      chunks: ["è stato costruito", "è stata completata", "veniva trasportato", "nel corso del tempo", "viene restaurata", "è visitato da milioni"],
      keywords: ["Duomo", "secoli", "facciata", "Napoleone", "marmo", "canali", "guerre", "terrazze"],
      gloss: {
        "Trecento": "el siglo XIV (los 1300: los siglos se nombran por centenas)",
        "Ottocento": "el siglo XIX (los 1800)",
        "per volontà di": "por decisión de",
        "Nel corso del tempo": "con el paso del tiempo"
      } },

    { week: 36, level: "B2", title: "Come si prepara il mate",
      es: "Cómo se prepara y se toma el mate en Argentina, explicado con el si impersonal.",
      text: "In Argentina il mate si beve a tutte le ore, ma non si prepara a caso. Prima si riempie la zucca per due terzi con l'erba, poi si inclina e si versa un po' d'acqua tiepida sulla parte bassa. Si aspetta un attimo, si inserisce la cannuccia e si aggiunge l'acqua calda. Il mate si passa di mano in mano e si beve in cerchio. Quando si dice grazie, significa che non se ne vuole più. In Italia si trova ormai in molti negozi, ma si dice che il sapore non sia lo stesso.",
      chunks: ["a tutte le ore", "si prepara a caso", "si aspetta un attimo", "di mano in mano", "se ne vuole più", "si dice che"],
      keywords: ["Argentina", "mate", "zucca", "erba", "acqua", "cannuccia", "cerchio", "negozi"],
      gloss: {
        "a caso": "de cualquier manera, al azar",
        "zucca": "el mate (el recipiente; literalmente «calabaza»)",
        "erba": "la yerba",
        "tiepida": "tibia",
        "cannuccia": "la bombilla (literalmente «pajita»)",
        "non se ne vuole più": "no se quiere más (ne = de eso)",
        "ormai": "ya, a esta altura"
      } },

    { week: 37, level: "B2", title: "Leonardo da Vinci",
      es: "La vida de Leonardo da Vinci en pocas líneas: la bottega, Milán, las obras inconclusas y los últimos años en Francia.",
      text: "Leonardo da Vinci nacque nel millequattrocentocinquantadue in un piccolo paese vicino a Firenze. Da ragazzo entrò nella bottega di un famoso pittore e imparò in fretta tutto quello che c'era da imparare. Visse molti anni a Milano, dove dipinse l'Ultima Cena e progettò macchine incredibili per l'epoca. Non finì mai molte delle sue opere, perché la curiosità lo portava sempre altrove. Negli ultimi anni si trasferì in Francia, invitato dal re, e lì morì nel millecinquecentodiciannove. Lasciò migliaia di pagine di appunti che ancora oggi stupiscono il mondo.",
      chunks: ["nacque nel", "da ragazzo", "visse molti anni", "non finì mai", "si trasferì in Francia", "ancora oggi"],
      keywords: ["Leonardo", "Firenze", "bottega", "pittore", "Milano", "macchine", "Francia", "appunti"],
      gloss: {
        "bottega": "taller (de un artista)",
        "altrove": "a otra parte",
        "stupiscono": "asombran (stupire = asombrar, no «estupidizar»)"
      } },

    { week: 38, level: "B2", title: "Un incontro con Paola",
      es: "Un encuentro casual con Paola contado en estilo indirecto: qué dijo, qué preguntó, qué prometió el narrador y no cumplió.",
      text: "Il mese scorso ho incontrato Paola per caso. Mi ha detto che aveva cambiato lavoro e che era molto contenta. Mi ha chiesto se volessi andare con lei a una festa il sabato dopo. Le ho risposto che mi sarebbe piaciuto, ma che purtroppo dovevo lavorare fino a tardi. Allora mi ha proposto di vederci la settimana successiva e mi ha raccomandato di non dimenticare, come al solito. Le ho promesso che l'avrei chiamata io. Ovviamente me ne sono dimenticato, e lei mi ha scritto per chiedermi se fossi ancora vivo.",
      chunks: ["per caso", "mi ha detto che", "mi ha chiesto se", "mi sarebbe piaciuto", "come al solito", "me ne sono dimenticato"],
      keywords: ["Paola", "lavoro", "contenta", "festa", "sabato", "settimana", "chiamata", "vivo"],
      gloss: {
        "per caso": "de casualidad",
        "come al solito": "como siempre, como de costumbre",
        "me ne sono dimenticato": "me olvidé (dimenticarsene = olvidarse de eso)",
        "se fossi ancora vivo": "si seguía vivo (en broma: por no dar señales)"
      } },

    { week: 40, level: "C1", title: "Fare e lasciar fare",
      es: "Lo que el narrador hace hacer a otros (el auto, el pelo) y lo que deja hacer a sus hijos en casa (*arrangiarsi* = arreglárselas).",
      text: "Quando la macchina si rompe, la faccio riparare dal meccanico sotto casa, perché io di motori non ne capisco niente. Ogni mese mi faccio tagliare i capelli da Gino, un barbiere che conosco da anni e che mi fa sempre ridere. A casa, invece, lascio fare molte cose ai miei figli: li lascio cucinare il sabato e faccio apparecchiare la tavola al più piccolo. Mia moglie dice che li faccio lavorare troppo, ma io penso che imparare ad arrangiarsi sia la cosa migliore. In fondo, nessuno mi ha mai fatto fare niente da piccolo, e me ne sono pentito.",
      chunks: ["la faccio riparare", "non ne capisco niente", "mi faccio tagliare", "mi fa sempre ridere", "lascio fare", "me ne sono pentito"],
      keywords: ["macchina", "meccanico", "capelli", "barbiere", "figli", "cucinare", "tavola", "moglie"],
      gloss: {
        "di motori non ne capisco niente": "de motores no entiendo nada",
        "apparecchiare la tavola": "poner la mesa",
        "arrangiarsi": "arreglárselas, rebuscárselas",
        "me ne sono pentito": "me arrepentí (pentirsi = arrepentirse)"
      } },

    { week: 41, level: "C1", title: "Dalla finestra",
      es: "Todo lo que el narrador vio y oyó una mañana desde la ventana de la cocina, y lo que descubrió al mirar (*a furia di* = a fuerza de).",
      text: "Stamattina, dalla finestra della cucina, ho visto un signore anziano attraversare la strada con una lentezza quasi commovente. Poi ho sentito due vicini litigare per un parcheggio: gridavano così forte che li ho sentiti anche con la finestra chiusa. Più tardi ho visto dei bambini correre verso la scuola, mentre una madre li guardava allontanarsi con le mani sui fianchi. Verso le nove ho sentito suonare le campane e, subito dopo, il camion della spazzatura passare rumorosamente. Ho osservato il quartiere svegliarsi a poco a poco, e mi sono reso conto che, a furia di stare al computer, non lo guardavo da anni.",
      chunks: ["attraversare la strada", "due vicini litigare", "così forte che", "li guardava allontanarsi", "a poco a poco", "mi sono reso conto"],
      keywords: ["finestra", "signore", "vicini", "parcheggio", "bambini", "scuola", "campane", "quartiere"],
      gloss: {
        "con le mani sui fianchi": "con los brazos en jarra",
        "spazzatura": "basura",
        "a poco a poco": "de a poco",
        "mi sono reso conto": "me di cuenta (rendersi conto)",
        "a furia di": "de tanto (a furia di + infinitivo)"
      } },

    { week: 42, level: "C1", title: "Un'email alla scuola",
      es: "Un mail formal a una escuela de idiomas: por qué quiere inscribirse, qué le cuesta, qué pide y qué prefiere evitar (*contare di* + infinitivo = pensar, tener previsto).",
      text: "Gentile segreteria, vi scrivo perché ho deciso di iscrivermi al vostro corso di italiano avanzato. Da qualche mese cerco di leggere un giornale italiano ogni giorno, ma non riesco ancora a capire tutti gli articoli di politica e mi stanco di consultare il dizionario. Vorrei quindi cominciare a lavorare seriamente sulla lingua, e conto di dedicarci almeno due sere alla settimana. Vi chiedo di indicarmi le date del prossimo livello e il costo dell'iscrizione. Se fosse possibile, preferirei evitare di frequentare il sabato, perché mi occupo dei miei nipoti. Vi ringrazio dell'attenzione e resto in attesa di una vostra risposta.",
      chunks: ["ho deciso di iscrivermi", "cerco di leggere", "non riesco ancora a", "conto di dedicarci", "vi chiedo di indicarmi", "resto in attesa di"],
      keywords: ["segreteria", "corso", "giornale", "politica", "dizionario", "livello", "iscrizione", "nipoti"],
      gloss: {
        "mi stanco di": "me canso de",
        "conto di": "pienso, tengo pensado (contare di + infinitivo)",
        "dedicarci": "dedicarle (a eso: ci = a la lengua)",
        "mi occupo dei miei nipoti": "cuido a mis nietos (o sobrinos: nipoti es ambas cosas)",
        "resto in attesa di": "quedo a la espera de"
      } },

    { week: 43, level: "C1", title: "Imparare da adulti",
      es: "Reflexión sobre aprender un idioma de grande: aceptar no entender todo, equivocarse sin vergüenza y no rendirse.",
      text: "Imparare una lingua da adulti è un'esperienza strana: significa tornare a essere bambini senza avere la loro pazienza. Capire tutto non è possibile, e accettarlo è forse la cosa più difficile. Bisogna sbagliare senza vergognarsi, parlare prima di sentirsi pronti e ascoltare molto, anche quando sembra inutile. Dopo aver studiato per mesi, uno si accorge di capire un film senza sottotitoli, e quel momento vale tutta la fatica. Il segreto, a mio avviso, sta nel non arrendersi: meglio dedicare dieci minuti al giorno che tre ore ogni tanto. E, soprattutto, non smettere mai di divertirsi.",
      chunks: ["da adulti", "senza vergognarsi", "prima di sentirsi pronti", "dopo aver studiato", "a mio avviso", "ogni tanto"],
      keywords: ["lingua", "bambini", "pazienza", "sbagliare", "film", "sottotitoli", "segreto", "minuti"],
      gloss: {
        "a mio avviso": "en mi opinión",
        "sta nel": "está en, consiste en",
        "arrendersi": "rendirse, bajar los brazos",
        "ogni tanto": "de vez en cuando"
      } },

    { week: 44, level: "C1", title: "Un pomeriggio in cucina",
      es: "El narrador prepara una cena para amigos, contada con gerundios y participios: la compra, el sugo, los invitados y el postre olvidado.",
      text: "Tornando a casa dal lavoro, ho deciso di preparare la cena per gli amici, pur non avendo molto tempo. Finita la spesa, ho acceso la radio e ho cominciato a tagliare le verdure canticchiando. Avendo dimenticato di comprare il basilico, ho chiesto alla vicina, che me ne ha dato un mazzetto sorridendo. Mentre il sugo cuoceva, ho apparecchiato la tavola, aggiungendo qualche candela per fare atmosfera. Arrivati gli ospiti, la casa profumava di pomodoro e di pane appena sfornato. Mangiando e chiacchierando, abbiamo fatto le due di notte. Sparecchiando, mi sono accorto che nessuno aveva toccato il dolce.",
      chunks: ["tornando a casa", "pur non avendo", "finita la spesa", "avendo dimenticato di", "arrivati gli ospiti", "appena sfornato"],
      keywords: ["cena", "spesa", "radio", "verdure", "basilico", "vicina", "sugo", "dolce"],
      gloss: {
        "pur non avendo": "aunque no tenía (pur + gerundio)",
        "canticchiando": "canturreando (-icchiare atenúa: se ve en la semana 46)",
        "per fare atmosfera": "para crear ambiente",
        "appena sfornato": "recién salido del horno",
        "abbiamo fatto le due di notte": "se nos hicieron las dos de la mañana",
        "Sparecchiando": "levantando la mesa (sparecchiare, lo contrario de apparecchiare)"
      } },

    { week: 45, level: "C1", title: "Una giornata così",
      es: "Un día lleno de contratiempos contado con verbos pronominales idiomáticos: el hermano enojado, la computadora, el almuerzo y el sofá.",
      text: "Stamattina stavo per uscire quando è squillato il telefono: era mio fratello, che ce l'aveva con me perché non l'avevo richiamato. Non me la sono presa, lo conosco: dopo due minuti ha finito per ridere. Poi mi sono messo a lavorare, ma il computer non partiva e ci ho messo un'ora a capire il problema. Ci vogliono nervi saldi, in certi giorni. A pranzo me ne sono andato al bar sotto l'ufficio, dove me la sono cavata con un panino. La sera, però, non ce la facevo più: mi sono buttato sul divano e sono stato a guardare il soffitto.",
      chunks: ["stavo per uscire", "ce l'aveva con me", "me la sono presa", "ci ho messo un'ora", "me la sono cavata", "ce la facevo più"],
      keywords: ["telefono", "fratello", "minuti", "computer", "problema", "pranzo", "panino", "divano"],
      gloss: {
        "ce l'aveva con me": "estaba enojado conmigo (avercela con qualcuno)",
        "Ci vogliono nervi saldi": "hacen falta nervios de acero",
        "mi sono buttato sul divano": "me tiré en el sillón",
        "sono stato a guardare il soffitto": "me quedé mirando el techo (stare a + infinitivo)"
      } },

    { week: 46, level: "C1", title: "Che tempaccio",
      es: "Una mañana de mal tiempo contada con sufijos: la llovizna, el cafecito, el perrito mojado y el solcito tímido.",
      text: "Che tempaccio, stamattina: un vento freddo, una pioggerellina fastidiosa e un cielo grigio che metteva tristezza. Mi sono infilato il giaccone di lana, ho preso l'ombrellino da borsa e sono uscito di corsa. Al bar, il solito caffettino ristretto e una chiacchierata con Tonino, il barista, che ha sempre una parolina gentile per tutti. Fuori, un ragazzino con uno zainetto enorme aspettava l'autobus e un cagnolino bagnato tremava sotto una panchina. Verso mezzogiorno, per fortuna, è uscito un solicello timido, e la giornata, da bruttina, è diventata quasi bellina. Poi però mi sono ricordato che dovevo lavorare, e la magia è finita.",
      chunks: ["che tempaccio", "una pioggerellina fastidiosa", "di corsa", "il solito caffettino", "una parolina gentile", "un cagnolino bagnato"],
      keywords: ["tempaccio", "pioggerellina", "giaccone", "ombrellino", "caffettino", "ragazzino", "zainetto", "solicello"],
      gloss: {
        "di corsa": "corriendo, a las apuradas",
        "ristretto": "corto y cargado (el café)",
        "che metteva tristezza": "que daba tristeza"
      } },

    { week: 47, level: "C1", title: "I conti della spesa",
      es: "Las cuentas de la compra semanal: cantidades, precios, porcentajes y el cinturón que hay que ajustar a fin de mes.",
      text: "Ogni settimana faccio i conti della spesa, e ogni volta mi sorprendo. Sabato ho comprato un paio di chili di pomodori, mezzo chilo di parmigiano, una decina di uova e un litro e mezzo d'olio. Al banco del pesce c'erano una ventina di persone, quindi ho rinunciato. In tutto ho speso circa novanta euro, cioè quasi un terzo del bilancio mensile per il cibo, e siamo solo al primo fine settimana. I prezzi sono aumentati del venti per cento nell'ultimo anno, ma a me sembra il doppio. Il ventesimo giorno del mese, di solito, si tira la cinghia: pasta in bianco e centinaia di buoni propositi.",
      chunks: ["faccio i conti", "un paio di chili", "una decina di uova", "una ventina di persone", "del venti per cento", "si tira la cinghia"],
      keywords: ["spesa", "chili", "parmigiano", "uova", "pesce", "novanta", "terzo", "doppio"],
      gloss: {
        "ho rinunciato": "desistí, lo dejé",
        "bilancio": "presupuesto",
        "si tira la cinghia": "se ajusta el cinturón",
        "pasta in bianco": "fideos solos, con manteca o aceite",
        "buoni propositi": "buenas intenciones, propósitos"
      } },

    { week: 48, level: "C1", title: "Chi ha fatto cosa",
      es: "Los preparativos de una cena contados con el orden marcado del italiano: el pan lo compré yo, el vino lo trae Marco, y Anna no aparece (*intendersene* = saber de algo; *restarci male* = quedar dolido; *un passaggio* = que te lleven en auto).",
      text: "Il pane l'ho comprato io, stamattina, ma il vino lo porta Marco. La torta, quella la fa mia madre, che di dolci se ne intende davvero. A Luca non gliel'ho ancora detto, della cena: mi sa che lo chiamo dopo. È Anna che non capisco: dice che viene e poi non si fa vedere. Lo sapevo già, questo, eppure ci resto male ogni volta. Ah, c'è Paolo che ti aspetta giù in cortile: gli hai promesso un passaggio, ricordi? Di tempo ne abbiamo poco, quindi muoviamoci. È arrivato anche il corriere, con il pacco dei bicchieri. Insomma, di cose da fare ce ne sono ancora tante.",
      chunks: ["l'ho comprato io", "se ne intende", "non si fa vedere", "lo sapevo già", "ci resto male", "ce ne sono ancora"],
      keywords: ["pane", "vino", "torta", "Luca", "Anna", "Paolo", "cortile", "corriere"],
      gloss: {
        "se ne intende": "sabe mucho de eso (intendersene di)",
        "non si fa vedere": "no aparece",
        "ci resto male": "me quedo mal, me duele",
        "un passaggio": "que lo lleves (en auto)",
        "muoviamoci": "apurémonos, movámonos"
      } },

    { week: 49, level: "C1", title: "Una lettera di reclamo",
      es: "Una carta formal de queja a un director de sucursal: la espera, la falta de información y la amenaza cortés de irse a otra parte.",
      text: "Gentile Direttore, Le scrivo in merito al disservizio verificatosi lo scorso martedì presso la vostra filiale di via Roma. Nonostante avessi prenotato un appuntamento con largo anticipo, sono stato ricevuto con oltre un'ora di ritardo, senza che nessuno si scusasse. In primo luogo, ritengo che l'attesa sia stata ingiustificata, in quanto gli sportelli erano per la maggior parte chiusi. Per di più, l'impiegato non è stato in grado di fornirmi le informazioni richieste. Qualora la situazione non venisse chiarita entro dieci giorni, mi vedrò costretto a rivolgermi altrove. Confido, in definitiva, in una Sua sollecita risposta e Le porgo distinti saluti.",
      chunks: ["in merito al", "con largo anticipo", "in primo luogo", "per di più", "mi vedrò costretto a", "distinti saluti"],
      keywords: ["Direttore", "disservizio", "filiale", "appuntamento", "ritardo", "sportelli", "impiegato", "giorni"],
      gloss: {
        "in merito al": "con respecto al",
        "disservizio": "mal servicio, falla en la atención",
        "verificatosi": "ocurrido (participio + pronombre pegado: que se produjo)",
        "con largo anticipo": "con mucha anticipación",
        "sportelli": "ventanillas",
        "Qualora": "en caso de que (+ congiuntivo)",
        "mi vedrò costretto": "me veré obligado",
        "sollecita": "pronta, rápida"
      } },

    { week: 50, level: "C1", title: "Una serie di figuracce",
      es: "Los papelones de una hispanohablante recién llegada a Italia por culpa de los falsos amigos: burro, salire, imbarazzata.",
      text: "Quando sono arrivata in Italia ho fatto una serie di figuracce con i falsi amici. Al ristorante ho rifiutato il burro, convinta che mi offrissero un asino, e il cameriere ha riso di gusto. Una sera ho detto che dovevo salire perché era tardi, e i miei amici mi hanno risposto che al primo piano non c'era niente. Volendo dire a una collega che aspettavo un bambino, le ho detto che ero imbarazzata: nessuno mi ha fatto gli auguri, ma tutti mi hanno chiesto di che cosa mi vergognassi. Col tempo ho imparato a prendere una decisione, a fare una domanda quando ho un dubbio e, soprattutto, a non dare niente per scontato. Sbagliando si impara.",
      chunks: ["una serie di figuracce", "ha riso di gusto", "fatto gli auguri", "prendere una decisione", "fare una domanda", "sbagliando si impara"],
      keywords: ["Italia", "figuracce", "burro", "asino", "cameriere", "salire", "imbarazzata", "collega"],
      gloss: {
        "figuracce": "papelones",
        "burro": "manteca (falso amigo)",
        "asino": "burro, el animal",
        "ha riso di gusto": "se rió con ganas",
        "salire": "subir (falso amigo: no es «salir»)",
        "imbarazzata": "avergonzada, incómoda (falso amigo: no es «embarazada», que se dice incinta)",
        "dare niente per scontato": "dar nada por sentado",
        "Sbagliando si impara": "equivocándose se aprende"
      } },

    { week: 51, level: "C1", title: "Bilancio di un anno",
      es: "Balance de un año de italiano: el primer libro terminado sin diccionario, los errores que quedan y la constancia que hizo falta.",
      text: "Un anno fa, se qualcuno mi avesse detto che avrei letto un romanzo in italiano senza dizionario, non ci avrei creduto. Eppure eccomi qui: il libro l'ho finito ieri sera, e mi sono persino commosso. Certo, gli errori li faccio ancora, soprattutto con il congiuntivo, ma ormai mi faccio correggere senza vergogna. Si dice che una lingua si impari solo vivendo nel paese; io penso invece che ci vogliano costanza e un po' di follia. Ho fatto ripetere le parole a chiunque avesse pazienza e ho scritto pagine intere che nessuno leggerà mai. Nonostante tutto, ne è valsa la pena. E adesso, che si faccia avanti l'esame.",
      chunks: ["mi avesse detto", "non ci avrei creduto", "eccomi qui", "mi faccio correggere", "è valsa la pena", "nonostante tutto"],
      keywords: ["romanzo", "dizionario", "libro", "errori", "congiuntivo", "lingua", "pazienza", "esame"],
      gloss: {
        "eccomi qui": "acá estoy",
        "persino": "hasta, incluso",
        "follia": "locura",
        "ne è valsa la pena": "valió la pena (valere, con essere)",
        "che si faccia avanti l'esame": "que venga el examen (farsi avanti = presentarse, dar un paso al frente)"
      } }
  ];
  var api = { TESTI: TESTI };
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.DictoglossData = api;
})(typeof window !== "undefined" ? window : globalThis);
