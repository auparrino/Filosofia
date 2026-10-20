/* Scrivi: una misión semanal de producción libre.
 *
 * Cada semana (menos las de jefe) pide un texto corto con la función
 * comunicativa de la semana («contá tu fin de semana», «pedí algo con
 * cortesía») y con sus estructuras («al menos 4 verbos en passato
 * prossimo»).  No hay una respuesta única: el corrector cuenta las
 * estructuras pedidas y busca en el texto los errores que un
 * hispanohablante comete de verdad (español metido, artículo que no va con
 * el sustantivo, «ho andato», «a» personal, «il mio padre», «se avrei»…),
 * con el mismo diagnóstico del resto del curso.  Cada tarea trae un texto
 * modelo para comparar después de escribir.  De la 8 a la 25 son tareas
 * situadas de 40-80 palabras, con destinatario y propósito (un mensaje a un
 * amigo, una nota al compañero de casa, un mail al hotel), y desde la 14 la
 * consigna va en italiano; las estructuras de la semana son el criterio.
 */
(function (root) {
  "use strict";
  var D = root.Diagnosi || (typeof require === "function" ? require("./diagnosi.js") : null);
  var Conj = root.Conj || (typeof require === "function" ? require("./conjugator.js") : null);

  /* ------------------------------------------------------------ tareas
     t: la consigna; min: palabras; use: [estructura, cuántas, etiqueta];
     model: un texto que cumple todo (tools/test_scrivi.js lo verifica). */
  var TASKS = {
    1: { t: "Presentate: cómo te llamás, de dónde sos, qué tenés (un perro, un auto, hermanos…) y cómo estás hoy.", min: 15,
         use: [["essere", 2, "2 formas de essere (sono, sei, è…)"], ["avere", 1, "1 forma de avere (ho, hai, ha…)"]],
         model: "Ciao! Sono Luca e sono argentino. Sono di Buenos Aires. Ho un cane e una bicicletta. Oggi sono stanco, ma sono contento." },
    2: { t: "Contá qué tenés: hermanos, animales, cosas de tu casa. Usá sustantivos en plural.", min: 15,
         use: [["plurali", 4, "4 sustantivos en plural"]],
         model: "Ho due fratelli e tre sorelle. Ho un cane e due gatti. Ho molti libri, tre penne e due computer. I libri sono vecchi." },
    3: { t: "Estás en un bar: pedí para vos y para un amigo, y contá qué hay en la barra.", min: 15,
         use: [["articoli", 5, "5 artículos (il, lo, la, un, una…)"], ["prepArt", 1, "1 preposición articulada (sul, del, al…)"]],
         model: "Buongiorno! Un caffè e un cappuccino, per favore. E anche una brioche e un succo d'arancia. Sul bancone ci sono i cornetti, le paste e lo zucchero. Il caffè del bar è buono." },
    4: { t: "Describí a una persona que conocés: de dónde es, cómo es por fuera y por dentro.", min: 15,
         use: [["aggettivi", 5, "5 adjetivos concordados"]],
         model: "Marta è una ragazza spagnola. È alta e magra, ha i capelli lunghi e neri e gli occhi verdi. È simpatica e intelligente, ma un po' timida. È una brava insegnante." },
    5: { t: "Contá tu rutina de un día de semana: dónde trabajás o estudiás, qué comés, qué hacés a la noche.", min: 15,
         use: [["presente", 5, "5 verbos en presente"]],
         model: "La mattina prendo il treno alle otto. Lavoro in un ufficio in centro e parlo molto al telefono. A mezzogiorno mangio un panino con i colleghi. La sera leggo un libro o guardo la televisione. Dormo poco!" },
    6: { t: "Contá tu fin de semana típico: adónde vas, qué hacés, quién viene, qué tenés que hacer.", min: 15,
         use: [["irregolari", 4, "4 verbos irregulares (andare, fare, uscire, venire, dovere, volere, potere…)"]],
         model: "Il sabato esco con gli amici. Andiamo al cinema o facciamo una passeggiata in centro. La domenica vengono i nonni a pranzo e devo cucinare. Voglio riposare, ma non posso: faccio sempre tante cose!" },
    7: { t: "Escribí tu agenda de la semana: qué día, a qué hora y qué hacés. Los números, con letras.", min: 25,
         use: [["ore", 3, "3 horas (alle nove, all'una…)"], ["numeri", 3, "3 números escritos con letras"]],
         model: "Lunedì alle nove ho una riunione in ufficio. Martedì pomeriggio, alle cinque e mezza, vado in palestra. Mercoledì dodici è il compleanno di Anna: la festa comincia alle otto e mezza. Venerdì all'una pranzo con Paolo." },
    8: { t: "Marco, un compañero nuevo, entra a tu curso de italiano. Mandale un mensaje de bienvenida: presentate en dos o tres líneas y hacele cinco preguntas para conocerlo (de dónde es, dónde vive, qué hace, cuándo tiene tiempo para un café).", min: 40,
         use: [["domande", 5, "5 preguntas"]],
         model: "Ciao Marco, benvenuto nel corso! Io sono Sofía, sono argentina e abito a Bologna da un anno. Lavoro in una libreria del centro e studio italiano la sera. E tu? Di dove sei? Dove abiti adesso? Che lavoro fai? Perché studi l'italiano? Quando sei libero per un caffè dopo la lezione? A giovedì!" },
    9: { t: "Giulia, una amiga italiana, viene a visitarte el sábado y llega en tren. Escribile un mensaje para explicarle cómo llegar a tu casa desde la estación: qué toma, dónde baja, dónde queda tu casa y adónde van a la noche.", min: 45,
         use: [["preposizioni", 6, "6 preposiciones (a, in, da, di, con, per…)"]],
         model: "Ciao Giulia! Dalla stazione a casa mia è facile. Prendi l'autobus 27 davanti alla stazione e scendi in piazza Maggiore, dopo quattro fermate. Io abito in via Castiglione, al numero 12, sopra la farmacia Centrale. Il citofono è sul portone verde. Sabato sera andiamo a cena da Paolo, in centro, a piedi. Hai una giacca? La sera fa freddo. A sabato!" },
    10: { t: "Tu hermana organiza una fiesta y te manda preguntas: «¿Conocés a Marco? ¿Invitás a los vecinos? ¿Llamás vos a la abuela?». Respondele con un mensaje, sin repetir los nombres: usá pronombres.", min: 40,
          use: [["pronomi", 4, "4 pronombres de objeto (lo, la, li, gli, le…)"]],
          model: "Ciao Laura! Marco? Sì, lo conosco bene: è il cugino di Paola. Lo chiamo stasera e gli dico della festa. I vicini? Li invito, certo, ma solo i signori del terzo piano. La nonna la chiamo io domani mattina: le parlo della festa e le chiedo la ricetta della torta. E tu mi mandi l'indirizzo del locale? A sabato!" },
    11: { t: "Nico, un amigo de Buenos Aires, te pregunta por WhatsApp cómo fue tu primer fin de semana en Bolonia. Contale adónde fuiste, qué comiste y con quién estuviste.", min: 45,
          use: [["pp", 4, "4 verbos en passato prossimo"]],
          model: "Ciao Nico! Il fine settimana è stato molto bello. Sabato mattina sono andata al mercato di Mezzo e ho comprato il formaggio per la cena. Nel pomeriggio ho visitato la basilica di San Petronio con Giulia e abbiamo mangiato un gelato enorme. Domenica ho dormito fino alle dieci, poi sono salita a San Luca a piedi: la vista è fantastica! Un abbraccio." },
    12: { t: "Luca, tu compañero de departamento, llega siempre tarde a la facultad. Dejale una nota en la heladera: contale cómo es tu mañana y dale tres consejos.", min: 45,
          use: [["riflessivi", 2, "2 verbos reflexivos"], ["imperativo", 2, "2 imperativos"]],
          model: "Luca, ti scrivo due righe. Io mi sveglio alle sette, mi alzo subito e mi faccio la doccia. Poi faccio colazione con calma e alle otto esco di casa. Tre consigli per te: metti la sveglia alle sette, prepara lo zaino la sera e non guardare il telefono a letto! E domani non dimenticare le chiavi. Ciao, Sofía" },
    14: { t: "Da lunedì dividi un appartamento con una studentessa che ancora non conosci. Scrivile un messaggio: raccontale che cosa ti piace e che cosa non ti piace (cibo, musica, sport) e chiedile dei suoi gusti.", min: 45,
          use: [["piacere", 4, "4 formas de piacere"]],
          model: "Ciao Chiara! Sono Sofía e da lunedì abito con te. Mi piace molto cucinare, soprattutto la pasta al forno, ma non mi piacciono i peperoni. Mi piace la musica italiana degli anni Sessanta e la domenica mi piace correre al parco. Non mi piace il rumore dopo mezzanotte. E a te? Che cosa ti piace fare nel tempo libero? Ti piacciono i gatti? Io ho un gatto nero!" },
    15: { t: "Una rivista per stranieri in Italia raccoglie brevi racconti sul tema «La città dove sono cresciuto». Scrivi il tuo: com'era la tua città, che cosa facevi da bambino e una cosa che è successa un giorno.", min: 50,
          use: [["imperfetto", 3, "3 verbos en imperfetto"], ["pp", 1, "1 passato prossimo para lo que pasó"]],
          model: "Sono cresciuto a Rosario, in una casa vicino al fiume. Da bambino passavo le estati in strada con i vicini: giocavamo a calcio fino a sera e la nonna preparava le empanadas la domenica. La città era tranquilla e tutti si conoscevano. Un giorno un temporale ha rotto il grande albero davanti a casa, e tutto il quartiere è venuto ad aiutare." },
    16: { t: "Ieri hai avuto una giornata storta. Scrivi un messaggio a un'amica e raccontale la tua giornata, da quando ti sei svegliato fino a sera.", min: 50,
          use: [["riflPass", 3, "3 reflexivos en pasado (mi sono…, ci siamo…)"]],
          model: "Ciao Marta, ieri è stata una giornata terribile! Mi sono svegliata tardi perché la sveglia non ha suonato. Mi sono vestita in fretta e sono uscita senza colazione. In ufficio ho visto che il telefono era a casa, e il capo si è arrabbiato per una riunione. La sera io e Paolo ci siamo visti in pizzeria e finalmente mi sono rilassata. E tu, come stai?" },
    17: { t: "L'insegnante chiede a ogni studente di presentare la sua famiglia al gruppo con una foto. Scrivi il testo che accompagna la foto: chi è chi e di chi sono le cose.", min: 50,
          use: [["possessivi", 3, "3 posesivos"], ["dimostrativi", 1, "1 demostrativo (questo, quello…)"]],
          model: "Ciao a tutti! In questa foto c'è la mia famiglia davanti alla casa dei miei nonni, a Córdoba. Questo con la camicia blu è mio padre e la signora accanto a lui è mia madre. Quella ragazza con il cappello è mia sorella Lucía: il cane è suo e si chiama Tango. E quella bicicletta rossa? È mia! La nostra casa è piccola, ma è sempre piena di gente." },
    18: { t: "Il tuo amico Paolo ti invita a una festa stasera, ma sei stanco e non hai voglia di uscire. Rispondi al suo messaggio: di' di no a tutto, con gentilezza e un po' di ironia.", min: 45,
          use: [["negazioni", 3, "3 negaciones (mai, niente, nessuno, neanche…)"], ["esclamazione", 1, "1 exclamación con che, come o quanto"]],
          model: "Ciao Paolo, grazie dell'invito, ma stasera non vado da nessuna parte. Non conosco nessuno a quella festa e non ho niente da mettere. E poi non bevo mai il sabato sera: domani lavoro alle otto. Non viene neanche Marta? Allora resto a casa sul divano con un film. Che noia, lo so! Alla prossima, promesso." },
    19: { t: "Quest'estate vieni in Italia. Scrivi un'email a Gennaro, un amico che vive a Napoli: racconta i tuoi programmi e fai un'ipotesi su come sarà il tempo.", min: 50,
          use: [["futuro", 4, "4 verbos en futuro"]],
          model: "Caro Gennaro, ad agosto finalmente verrò in Italia! Arriverò a Roma il tre e resterò lì una settimana con mia cugina. Poi prenderò il treno per Napoli e starò da te tre giorni, se per te va bene. Visiteremo Pompei e mangeremo la pizza vera. Ad agosto a Napoli farà molto caldo, immagino: sarà bello uscire la sera. Ti scriverò l'orario del treno. Un abbraccio, Martín" },
    20: { t: "Vuoi passare tre notti in un piccolo albergo di Firenze con la tua compagna. Scrivi un'email all'albergo: chiedi una camera e due cose in più, con gentilezza.", min: 50,
          use: [["condizionale", 3, "3 verbos en condicional"]],
          model: "Buongiorno, vorrei prenotare una camera doppia per tre notti, dal dieci al tredici maggio. Sarebbe possibile avere una camera tranquilla, con vista sul giardino? La mia compagna è celiaca: potreste preparare una colazione senza glutine? Arriveremo in treno verso mezzanotte: ci sarebbe qualcuno alla reception a quell'ora? Grazie mille. Cordiali saluti, Martín Pérez" },
    21: { t: "Stasera cucini per sei amici. La tua coinquilina è al mercato e ti chiede per messaggio che cosa deve comprare e quanto. Rispondile, con ne e ci.", min: 50,
          use: [["ne", 2, "2 veces ne"], ["ci", 2, "2 veces ci"]],
          model: "Ciao Giulia! Per il sugo servono i pomodori: ne prendi un chilo? Il parmigiano c'è già, ma di basilico ne compri due mazzi. Il pane lo prendo io dal fornaio: ci vado alle sei. Al mercato ci sono le fragole? Se ci sono, ne prendi mezzo chilo per il dolce. Il vino lo porta Marco. Grazie mille, a stasera!" },
    22: { t: "Sabato è il compleanno di Giulia e organizzi la festa con due amici. Scrivi un messaggio al gruppo: chi dà che cosa a chi, chi porta che cosa e chi manda che cosa.", min: 50,
          use: [["combinati", 3, "3 pronombres combinados (glielo, me la, te le…)"]],
          model: "Ragazzi, il regalo per Giulia l'ho già comprato: è un libro di ricette, e glielo diamo alla fine della cena. La torta? Ce la prepara la nonna di Marco, che è molto brava. Paolo, tu hai le candeline? Me le porti sabato mattina? L'indirizzo del locale non lo sa nessuno: ve lo mando stasera. Le foto della festa, poi, gliele stampiamo per l'album. A sabato!" },
    23: { t: "Un amico argentino non sa se trasferirsi a Milano o a Bologna e ti chiede un consiglio. Scrivigli un messaggio: confronta le due città (prezzi, lavoro, vita) e di' quale sceglieresti.", min: 55,
          use: [["comparativi", 3, "3 comparaciones (più… di, meno… che, migliore…)"]],
          model: "Ciao Nico! Milano è più grande di Bologna e c'è più lavoro, soprattutto nella moda e nelle banche. Però gli affitti sono più cari che a Bologna: una stanza costa quasi il doppio. Bologna è meno caotica e più comoda: in bicicletta arrivi dappertutto. Anche il cibo è migliore, secondo me, e la gente è simpaticissima. Io sceglierei Bologna: la qualità della vita è migliore. Un abbraccio!" },
    24: { t: "Luca, un amico, ha un problema con il suo capo e ti chiede un consiglio. Rispondi al suo messaggio: dì che cosa pensi, che cosa credi e che cosa speri.", min: 55,
          use: [["congiuntivo", 3, "3 verbos en congiuntivo (che sia, che abbia…)"]],
          model: "Caro Luca, mi dispiace per la situazione. Penso che tu abbia ragione: il tuo capo esagera. Credo però che anche lui sia molto stressato, con il progetto nuovo. È importante che tu gli parli presto, con calma, e che non scriva email arrabbiate! Spero che capisca e che le cose vadano meglio già la settimana prossima. Se vuoi, domani ne parliamo a pranzo. Un abbraccio, Marta" },
    25: { t: "La tua azienda chiede ai dipendenti un parere sul lavoro da casa. Scrivi un'email breve alla responsabile del personale, la dottoressa Rossi: che cosa pensi, di che cosa dubiti, che cosa speri.", min: 55,
          use: [["congiuntivo", 4, "4 verbos en congiuntivo"]],
          model: "Gentile dottoressa Rossi, le scrivo per rispondere al questionario sul lavoro da casa. Credo che due giorni a casa siano utili a tutti: risparmiamo tempo e soldi. Penso però che l'ufficio sia importante per il gruppo. Mi sembra che alcuni colleghi si sentano soli, e dubito che le riunioni online funzionino sempre bene. Spero che l'azienda permetta a ognuno di scegliere. Cordiali saluti, Martín Pérez" },
    27: { t: "Describí cómo estudia o trabaja alguien que conocés.", min: 35,
         use: [["avverbi", 5, "5 adverbios en -mente"]],
         model: "Mio fratello studia sempre attentamente e lavora velocemente. Parla lentamente e chiaramente, e ascolta pazientemente tutti. Raramente si arrabbia. Purtroppo, però, arriva spesso in ritardo. Ieri, per esempio, è arrivato tranquillamente alle dieci, e il professore l'ha guardato severamente." },
    28: { t: "¿Es mejor vivir en la ciudad o en el campo? Escribí un párrafo con tu opinión.", min: 35,
         use: [["connettivi", 5, "5 conectores distintos (però, quindi, infatti, invece, anche se…)"]],
         model: "Secondo me è meglio vivere in città, anche se il traffico è un problema. Infatti in città ci sono più servizi: ospedali, scuole e trasporti. In campagna, invece, la vita è più tranquilla e l'aria è pulita. Però per lavorare bisogna usare sempre la macchina, quindi si perde molto tempo. Inoltre d'inverno le giornate sono lunghe e noiose." },
    29: { t: "Te contaron noticias de amigos: reaccioná (me alegra que…, no creo que…, qué raro que…).", min: 45,
         use: [["congPassato", 4, "4 congiuntivos pasados (abbia trovato, sia partito…)"]],
         model: "Sono contento che Marta abbia trovato un lavoro nuovo. Non credo che Luca sia partito davvero per l'Australia: è strano che non mi abbia detto niente! Mi dispiace che i cugini non siano venuti alla festa. Spero che almeno abbiano ricevuto l'invito. Chissà se Paola ha già finito la tesi: le scrivo stasera." },
    30: { t: "Contá qué querían tus padres o tus maestros que hicieras de chico, y qué te gustaría que cambiara hoy.", min: 45,
         use: [["congImperfetto", 4, "4 verbos en congiuntivo imperfetto"]],
         model: "Da piccolo i miei genitori volevano che studiassi medicina e che diventassi un bravo dottore. Mia madre sperava che imparassi il pianoforte. Io, invece, desideravo che mi lasciassero giocare a calcio tutto il giorno con gli amici. Oggi vorrei che le scuole dessero più tempo allo sport e alla musica." },
    31: { t: "Contá qué habrías hecho distinto el año pasado y algo que alguien dijo que haría y no hizo.", min: 45,
         use: [["condPassato", 4, "4 condicionales compuestos (avrei fatto, sarei andato…)"]],
         model: "L'anno scorso avrei dovuto studiare di più e sarei andato volentieri a vivere all'estero. Avrei preferito un lavoro meno stressante, ma non ho avuto il coraggio di cambiare. Marco aveva detto che mi avrebbe aiutato con il trasloco, ma non è venuto: avrebbe potuto almeno telefonarmi!" },
    32: { t: "Contá un malentendido: qué creías, qué sabías y qué pensabas que iba a pasar.", min: 45,
         use: [["concordanza", 5, "5 verbos de la concordancia en pasado (fosse, avesse fatto, sarebbe venuto, era partito…)"]],
         model: "Pensavo che il treno partisse alle otto, invece era già partito alle sette e mezza. Credevo che Anna mi avesse lasciato un messaggio, ma non c'era niente. Sapevo che sarebbe arrivata in ritardo, però non immaginavo che non venisse proprio. Alla fine ho capito che si era dimenticata dell'appuntamento." },
    33: { t: "¿Qué harías si ganaras la lotería? ¿Qué habría pasado si no hubieras empezado italiano? Usá los tres tipos.", min: 45,
         use: [["se", 4, "4 condiciones con se"], ["congImperfetto", 2, "2 congiuntivos imperfectos o pluscuamperfectos"], ["condizionale", 2, "2 condicionales"]],
         model: "Se vincessi la lotteria, comprerei una casa in Toscana e smetterei di lavorare. Se avessi più tempo, viaggerei ogni mese e imparerei a cucinare bene. Se non avessi cominciato a studiare italiano, non avrei conosciuto tanti amici nuovi. Se domani fa bel tempo, andiamo al mare." },
    34: { t: "Describí tu barrio: la gente que vive ahí, el lugar donde…, la persona con la que…", min: 45,
         use: [["relativi", 4, "4 relativos (che, cui, il quale…)"]],
         model: "Abito in un quartiere che mi piace molto. La piazza in cui gioco a carte con i vicini è piccola ma piena di vita. Il fornaio da cui compro il pane è un signore che conosce tutti. La ragazza con la quale divido l'appartamento lavora in un teatro che si trova in centro." },
    35: { t: "Contá la historia de un monumento: cuándo fue construido, por quién, qué le pasó después.", min: 45,
         use: [["passiva", 4, "4 pasivas (è stato costruito, viene restaurato…)"]],
         model: "Il Colosseo è stato costruito dai Romani nel primo secolo. Per secoli è stato usato per gli spettacoli dei gladiatori. Nel Medioevo è stato danneggiato da molti terremoti e le sue pietre sono state usate per altri palazzi. Oggi è visitato da milioni di turisti e viene restaurato regolarmente." },
    36: { t: "Explicá cómo se hace algo típico (la pizza, el mate, el asado) con el si passivante e impersonale.", min: 45,
         use: [["si", 6, "6 construcciones con si"]],
         model: "Per fare la pizza napoletana si usa una farina speciale. Si impasta la farina con acqua, sale e lievito e si lascia riposare l'impasto per molte ore. Poi si stende la pasta, si mettono il pomodoro e la mozzarella e si cuoce nel forno a legna. Si mangia calda, con le mani!" },
    37: { t: "Contá la vida de un personaje histórico en passato remoto.", min: 45,
         use: [["remoto", 6, "6 verbos en passato remoto"]],
         model: "Giuseppe Garibaldi nacque a Nizza nel 1807. Da giovane fece il marinaio e viaggiò in tutto il mondo. Visse molti anni in America del Sud, dove combatté in Brasile e in Uruguay. Nel 1860 partì da Quarto con mille volontari e conquistò la Sicilia. Morì a Caprera nel 1882. Ancora oggi in molte città italiane c'è una piazza che porta il suo nome, e lo chiamano ancora «l'eroe dei due mondi»." },
    38: { t: "Contá una conversación reciente en estilo indirecto: qué te dijo, qué te preguntó, qué respondiste.", min: 45,
         use: [["indiretto", 4, "4 verbos de decir con che, se o di (mi ha detto che…)"]],
         model: "Il mese scorso ho incontrato Paola. Mi ha detto che aveva cambiato lavoro e che era molto contenta. Mi ha chiesto se volessi andare con lei a una festa il sabato dopo. Le ho risposto che mi sarebbe piaciuto, ma che dovevo lavorare. Allora mi ha detto di chiamarla la settimana successiva. Le ho promesso che l'avrei fatto e ci siamo salutati davanti al bar." },
    40: { t: "Contá qué cosas hacés hacer y cuáles dejás hacer (el auto, el pelo, los chicos…).", min: 60,
         use: [["causativo", 5, "5 causativos (faccio riparare, lascio fare…)"]],
         model: "Quando la macchina si rompe, la faccio riparare dal meccanico sotto casa, perché io non ne capisco niente. Ogni mese mi faccio tagliare i capelli da Gino, un barbiere che conosco da anni. A casa, invece, lascio fare molte cose ai miei figli: li lascio cucinare la domenica e gli faccio pulire la loro camera. Mia figlia vorrebbe farsi fare un tatuaggio, ma io non glielo lascio fare: è troppo giovane." },
    41: { t: "Contá lo que viste y oíste esta mañana desde tu ventana o en la calle.", min: 60,
         use: [["percezione", 5, "5 verbos de percepción con infinitivo (ho visto… attraversare)"]],
         model: "Stamattina, dalla finestra, ho visto un signore anziano attraversare la strada molto lentamente. Poi ho sentito due vicini litigare per un parcheggio: gridavano così forte che li ho sentiti anche con la finestra chiusa. Più tardi ho visto dei bambini giocare nel cortile e ho sentito una ragazza cantare una vecchia canzone di Mina. Alla fine ho visto il sole sparire dietro le nuvole e ho sentito la pioggia battere sui vetri." },
    42: { t: "Escribí un mail formal a una escuela de idiomas: qué decidiste, qué intentás, qué necesitás.", min: 60,
         use: [["infPrep", 5, "5 verbos con a o di + infinitivo (decidere di, riuscire a…)"]],
         model: "Gentile segreteria, vi scrivo perché ho deciso di iscrivermi al vostro corso di italiano avanzato. Da qualche mese cerco di leggere un giornale italiano ogni giorno, ma non riesco ancora a capire tutti gli articoli di politica. Vorrei cominciare a frequentare le lezioni a settembre e continuare a studiare fino a dicembre. Vi chiedo di inviarmi il programma e di indicarmi il costo. Spero di ricevere presto una vostra risposta. Distinti saluti, Laura Gómez" },
    43: { t: "¿Qué es lo más difícil de aprender un idioma? Usá el infinitivo como sujeto y después de preposición.", min: 60,
         use: [["infinito", 8, "8 infinitivos"]],
         model: "Imparare una lingua da adulti non è facile. Parlare con i nativi fa paura, e sbagliare davanti agli altri è ancora peggio. Secondo me, prima di cominciare bisogna trovare un motivo forte. Dopo aver studiato la grammatica di base, conviene leggere molto e ascoltare podcast ogni giorno. Il segreto è non smettere mai: anche dieci minuti al giorno bastano per non dimenticare quello che si è imparato." },
    44: { t: "Contá cómo aprendiste a hacer algo (cocinar, manejar…) con gerundios y un participio absoluto.", min: 60,
         use: [["gerundio", 3, "3 gerundios"], ["partAss", 1, "1 participio absoluto (Finito il corso, …)"]],
         model: "Ho imparato a cucinare guardando mia nonna. Stando accanto a lei in cucina, ho capito i segreti della pasta fatta in casa. Sbagliando molte volte, ho imparato a dosare la farina e le uova. Finito il corso di cucina che ho fatto l'anno scorso, ho cominciato a preparare la cena per gli amici. Arrivati a casa mia, tutti chiedono sempre la stessa cosa: le lasagne della nonna!" },
    45: { t: "Contá una situación difícil: si al final lo lograste, si te fuiste, si te enojaste (farcela, andarsene, prendersela…).", min: 60,
         use: [["pronominali", 5, "5 verbos pronominales (farcela, andarsene, metterci…)"]],
         model: "Il mese scorso ho dovuto traslocare da solo. Ci sono volute tre settimane per trovare un appartamento, e ci ho messo due giorni a riempire gli scatoloni. A un certo punto ho pensato di non farcela e volevo andarmene in vacanza. Il padrone di casa se l'è presa perché ho graffiato il pavimento, ma alla fine me la sono cavata pagando un piccolo risarcimento. Quando è finito tutto, ho detto: ce l'ho fatta!" },
    46: { t: "Describí tu casa y tu barrio con diminutivos, aumentativos y despectivos (casetta, gattone, tempaccio…).", min: 60,
         use: [["suffissi", 6, "6 palabras con sufijo (-etto, -ino, -one, -accio…)"]],
         model: "Abito in una casetta con un giardinetto pieno di fiorellini. Il vicino ha un gattone grasso che dorme tutto il giorno sul muretto. Purtroppo in questi giorni fa un tempaccio: piove sempre e il cielo è grigio. In fondo alla strada c'è un localino dove fanno dei panini buonissimi. Il proprietario è un omone simpatico con un vocione che si sente da lontano. La sera i ragazzini giocano a pallone nella piazzetta." },
    47: { t: "Escribí la lista de compras para una cena de ocho personas, con cantidades, pesos, porcentajes y aproximaciones.", min: 60,
         use: [["quantita", 6, "6 cantidades (un chilo, tre etti, una decina, il trenta per cento…)"]],
         model: "Per la cena di sabato siamo in otto. Mi servono un chilo e mezzo di pasta, tre etti di parmigiano e mezzo litro di panna. Per l'antipasto compro una dozzina di uova e un paio di etti di prosciutto crudo. Il vino? Direi una decina di bottiglie. Ho un budget di cento euro: il trenta per cento va per il vino e metà per la carne. Il resto lo spendo per il dolce, che deve bastare per una ventina di fette." },
    48: { t: "Contá una anécdota de una fiesta con dislocaciones y frases escindidas (La torta l'ha fatta…, È stata lei a…).", min: 60,
         use: [["dislocazioni", 4, "4 dislocaciones o frases escindidas"]],
         model: "La torta l'ha fatta mia sorella, non io. È stata lei a decidere il menù della festa, e i biglietti d'invito li ha scritti a mano. Io, il vino, l'ho scelto all'ultimo momento. Alla festa è arrivato anche Paolo, che non vedevamo da anni. È stato lui che ha portato la chitarra, e le canzoni le abbiamo cantate fino alle tre. I vicini, però, non li abbiamo invitati, e il giorno dopo si sono lamentati del rumore." },
    49: { t: "Texto argumentativo formal: ¿las ciudades deberían prohibir los autos en el centro? Introducción, argumentos y conclusión.", min: 60,
         use: [["connettiviAlti", 5, "5 conectores de registro alto (pertanto, inoltre, sebbene, in conclusione…)"]],
         model: "In primo luogo, occorre ricordare che il traffico è una delle principali cause dell'inquinamento urbano. Chiudere il centro alle automobili, pertanto, migliorerebbe la qualità dell'aria. Inoltre, le strade liberate potrebbero diventare spazi per i pedoni e per il commercio. D'altro canto, sebbene i vantaggi siano evidenti, non si può ignorare il problema di chi lavora in centro e non dispone di mezzi pubblici adeguati. In conclusione, ritengo che il divieto sia auspicabile, purché venga accompagnato da un serio investimento nel trasporto pubblico." },
    50: { t: "Escribile a un amigo italiano un malentendido que tuviste con un falso amigo (burro, salire, imbarazzata…).", min: 60,
         use: [["falsi", 3, "3 falsos amigos bien usados"]],
         model: "Caro Marco, ti racconto una figuraccia. Ieri, in un bar di Bologna, ho chiesto un panino con il burro: pensavo di aver ordinato qualcosa di esotico, e invece era solo pane e burro! Poi ho detto alla barista che ero imbarazzata, e per fortuna ha capito che mi vergognavo e non che aspettavo un bambino, come avrebbe capito un argentino. Alla fine, per salire al mio appartamento, ho preso l'ascensore sbagliato. Un abbraccio, Sofia" },
    51: { t: "Escribile una carta a tu yo de hace un año: qué habría pasado si no hubieras empezado, qué lograste, qué le pedirías.", min: 60,
         use: [["congiuntivo", 2, "2 congiuntivos"], ["se", 1, "1 hipótesis con se"], ["condizionale", 2, "2 condicionales"]],
         model: "Caro me stesso di un anno fa, ti scrivo per dirti che ce l'hai fatta. Se non avessi cominciato a studiare italiano quella sera di settembre, oggi non potrei leggere questa lettera senza dizionario. Penso che il segreto sia stato studiare un po' ogni giorno, anche quando non ne avevi voglia. Non credo che tu abbia mai immaginato di arrivare fin qui. Ti chiederei solo una cosa: sbaglia pure, ma non smettere di parlare. Sarebbe un peccato che tutta questa fatica finisse in un cassetto. Con affetto, il tuo io del futuro." }
  };

  /* ------------------------------------------------------------ tokens */

  function toks(text) {
    var out = [], re = /[A-Za-zÀ-ÖØ-öø-ÿ]+'?|\d+|[.!?,;:]/g, m, start = true, clause = true, sentAt = 0;
    var src = String(text || "").replace(/[’‘`´]/g, "'");
    while ((m = re.exec(src))) {
      var o = m[0];
      if (/^[.!?,;:]$/.test(o)) { out.push({ p: o, at: m.index }); clause = true; if (/[.!?]/.test(o)) { start = true; sentAt = m.index + 1; } continue; }
      out.push({ o: o, w: o.toLowerCase(), at: m.index, len: o.length, start: start, clause: clause || start,
                 cap: /^[A-ZÀ-Ý]/.test(o), dlg: /[–—«"“]/.test(src.slice(sentAt, m.index)) });
      start = false; clause = false;
    }
    return out;
  }
  /* Every Italian word the course shows (answers, phrases, readings, the
     bank, the glossary): a word the learner writes that is in here exists. */
  var LEXI = Object.create(null), lexiN = 0;
  function learn(list) {
    (list || []).forEach(function (txt) {
      String(txt || "").toLowerCase().replace(/[’‘`´]/g, "'").split(/[^a-zà-ÿ']+/).forEach(function (w) {
        w = w.replace(/^'+/, "");
        if (w.length > 1 && !LEXI[w]) { LEXI[w] = 1; lexiN++; }
        var m = /^([a-zà-ÿ]+')(.+)$/.exec(w);   // dell'acqua
        if (m) [m[1], m[2]].forEach(function (x) { if (!LEXI[x]) { LEXI[x] = 1; lexiN++; } });
      });
    });
  }
  function learnCourse(src) {
    if (lexiN > 5000) return;
    src = src || {};
    var list = [];
    (src.items || []).forEach(function (it) {
      // Only what the learner has to write: stems and choice options carry Spanish.
      // (not the translations into Spanish, dir «it-es»: their answers are Spanish)
      if ((it.type === "translate" && it.dir !== "it-es") || it.type === "cloze" || it.type === "conjugate" || it.type === "plural") {
        list.push(String(it.answer || "").replace(/\|/g, " "));
        (it.accept || []).forEach(function (a) { list.push(a); });
      }
    });
    (src.bank && src.bank.sentences || []).forEach(function (x) { (x.it || []).forEach(function (a) { list.push(a); }); });
    (src.phrases || []).forEach(function (f) { list.push(f.it); });
    (src.readings || []).forEach(function (e) { list.push(e.text); });
    (src.extra || []).forEach(function (t) { list.push(t); });   // the long listenings and the models (tramo.js)
    learn(list);
    learn(Object.keys(src.glossario || {}));
    learn(Object.keys(DATA.lex || {}));
    learn(["base basi basso bassa bassi basse fine alto alta alti alte nativo nativa nativi native peggio meglio podcast budget omone vocione " +
           "piovve piovvero piovuto " +
           "tutto tutta tutti tutte questo questa questi queste quello quella quelli quelle ogni ognuno qualche qualcuno qualcosa niente nulla " +
           "sempre mai già ancora poi dopo prima adesso ora oggi domani ieri stasera stamattina insieme davvero proprio soltanto solo " +
           "severo severa severi severe gentile gentili felice felici stanco stanca stanchi stanche contento contenta contenti contente"]);
  }
  function known(w) { return !!(LEXI[w] || (U.isItalian && U.isItalian(w))); }
  /* A word of the frequency lexicon (data/frequenza.json, loaded by the app
     as Freq): slogan, calo, marchi, corsie exist even if the course does not
     teach them.  But the web corpora it comes from also count the usual
     slips (citta, perchè, gia, sopratutto, computers), so a word that is a
     known word without its accent, with another accent, with one consonant
     less or more, or with an English -s, is not «known» here. */
  var DEGEM = null;
  function freqKnown(w) {
    var F = root.Freq, info = null;
    try { info = F && F.loaded && F.loaded() ? F.info(w) : null; } catch (e) { info = null; }
    if (!info || Math.max(info[0] || 0, info[1] || 0) < 3) return false;
    if ((typeof ES_EXTRA !== "undefined" && ES_EXTRA[w]) || (typeof ES_STRONG !== "undefined" && ES_STRONG[w]) || (U.spanishWord && U.spanishWord(w))) return false;
    var acc = { a: "à", e: "èé", i: "ì", o: "ò", u: "ù", "à": "a", "è": "eé", "é": "eè", "ì": "i", "ò": "o", "ù": "u" }[w.slice(-1)] || "";
    for (var k = 0; k < acc.length; k++) if (known(w.slice(0, -1) + acc[k])) return false;
    if (/[^aeiou]s$/.test(w) && known(w.slice(0, -1))) return false;
    if (!DEGEM) { DEGEM = Object.create(null); Object.keys(LEXI).forEach(function (x) { DEGEM[U.degeminate(x)] = x; }); }
    var twin = DEGEM[U.degeminate(w)];
    return !(twin && twin !== w);
  }
  function exists(w) { return known(w) || freqKnown(w); }
  // An adverb in -mente whose adjective the course knows (velocemente, facilmente).
  function menteOK(w) {
    if (!/mente$/.test(w)) return false;
    var b = w.replace(/mente$/, "");
    if (/[aeiou][lr]e$/.test(b)) return false;   // normalemente → normalmente
    return [b + "e", b + "o", b.replace(/a$/, "o"), b.replace(/l$/, "le"), b.replace(/r$/, "re"), b].some(function (x) { return x !== w && known(x); });
  }

  function words(tk) { return tk.filter(function (t) { return t.w && /[a-zà-ÿ]/.test(t.w); }); }

  var U = D ? D.util : {};
  var DATA = D ? D.DATA : { lex: {}, nouns: {}, nounsByPlural: {}, adj: {}, falsi: {} };
  function V(w) { return D ? D.verbForms(w) : []; }
  function PP(w) {
    if (!w) return null;
    if (D && D.participleOf(w)) return D.participleOf(w);
    if (IRR_PART[w]) return IRR_PART[w];
    return null;
  }
  var IRR_PART = {};
  ("fatto:fare detto:dire visto:vedere preso:prendere messo:mettere scritto:scrivere letto:leggere stato:essere venuto:venire " +
   "rimasto:rimanere nato:nascere morto:morire aperto:aprire chiuso:chiudere corso:correre vissuto:vivere bevuto:bere scelto:scegliere " +
   "perso:perdere risposto:rispondere chiesto:chiedere speso:spendere rotto:rompere acceso:accendere spento:spegnere vinto:vincere " +
   "successo:succedere piaciuto:piacere offerto:offrire sceso:scendere salito:salire deciso:decidere diviso:dividere promesso:promettere " +
   "permesso:permettere tradotto:tradurre ridotto:ridurre condotto:condurre dipinto:dipingere nascosto:nascondere " +
   "compreso:comprendere sorpreso:sorprendere appreso:apprendere ripreso:riprendere offeso:offendere difeso:difendere " +
   "deluso:deludere concluso:concludere incluso:includere escluso:escludere espresso:esprimere ammesso:ammettere " +
   "commesso:commettere discusso:discutere risolto:risolvere sciolto:sciogliere raccolto:raccogliere tolto:togliere " +
   "accolto:accogliere coinvolto:coinvolgere rivolto:rivolgere sconfitto:sconfiggere distrutto:distruggere prodotto:produrre").split(" ").forEach(function (x) {
    var p = x.split(":");
    ["o", "a", "i", "e"].forEach(function (v) { IRR_PART[p[0].slice(0, -1) + v] = p[1]; });
  });
  function isPart(w) { return !!PP(w) || (/(at|ut|it)[oaie]$/.test(w) && w.length > 4 && !DATA.nouns[w] && !DATA.nounsByPlural[w]); }
  function isNoun(w) { return !!(DATA.nouns[w] || DATA.nounsByPlural[w]); }
  function nounLike(w) { return isNoun(w) || !!DATA.adj[w]; }
  function isInf(w) {
    if (!w) return false;
    if (w === "aver" || w === "esser") return true;
    if (U.isInfinitive && U.isInfinitive(w)) return true;
    return /(are|ere|ire|rre)$/.test(w) && w.length > 4 && !nounLike(w) && !V(w).length;
  }
  function isInfCl(w) {   // farlo, vederti, andarsene
    if (isInf(w)) return true;
    var m = /^(.+?[aei]r)(mi|ti|si|ci|vi|lo|la|li|le|ne|gli|sene|mene|tene|cela|glielo|gliela|melo|mela|telo|tela)$/.exec(w || "");
    return !!(m && isInf(m[1] + "e")) && !PP(w);
  }

  var AUX_PRES = { ho: 1, hai: 1, ha: 1, abbiamo: 1, avete: 1, hanno: 1, sono: 1, sei: 1, "è": 1, siamo: 1, siete: 1 };
  var AVE_PRES = { ho: 1, hai: 1, ha: 1, abbiamo: 1, avete: 1, hanno: 1 };
  var ESS_ALL = {};
  (U.ESSERE || []).forEach(function (x) { ESS_ALL[x] = 1; });
  var SKIP_ADV = { "già": 1, mai: 1, ancora: 1, appena: 1, sempre: 1, anche: 1, bene: 1, molto: 1, poi: 1, tutto: 1, "più": 1, davvero: 1, proprio: 1, subito: 1, finalmente: 1 };
  function nextPart(tk, i, max) {   // participle after the auxiliary, skipping già, mai…
    for (var k = i + 1; k < tk.length && k <= i + (max || 3); k++) {
      var t = tk[k];
      if (!t.w) return -1;
      if (isPart(t.w) && !SKIP_ADV[t.w]) return k;
      if (!SKIP_ADV[t.w]) return -1;
    }
    return -1;
  }
  function isVerb(w) { return !!(w && (V(w).length || AUX_PRES[w] || ESS_ALL[w] || (U.AVERE || []).indexOf(w) >= 0)); }

  var ESS_VERBS = { andare: 1, venire: 1, partire: 1, arrivare: 1, uscire: 1, tornare: 1, ritornare: 1, essere: 1, nascere: 1,
                    morire: 1, rimanere: 1, restare: 1, entrare: 1, cadere: 1, diventare: 1, riuscire: 1, succedere: 1, piacere: 1,
                    sembrare: 1, stare: 1, costare: 1, bastare: 1, mancare: 1 };
  function auxOf(lemma) {
    if (!lemma) return null;
    if (ESS_VERBS[lemma]) return "essere";
    try { return Conj ? Conj.auxiliary(lemma) : null; } catch (e) { return null; }
  }

  var NUMS = /^(uno|una|due|tre|quattro|cinque|sei|sette|otto|nove|dieci|undici|dodici|tredici|quattordici|quindici|sedici|diciassette|diciotto|diciannove|venti\w*|ventuno|ventitré|trenta\w*|quaranta\w*|cinquanta\w*|sessanta\w*|settanta\w*|ottanta\w*|novanta\w*|cento\w*|mille|mila|primo|prima|secondo|terzo|quarto|quinto|sesto|settimo|ottavo|nono|decimo|mezzogiorno|mezzanotte)$/;
  var POSS = { mio: 1, mia: 1, miei: 1, mie: 1, tuo: 1, tua: 1, tuoi: 1, tue: 1, suo: 1, sua: 1, suoi: 1, sue: 1,
               nostro: 1, nostra: 1, nostri: 1, nostre: 1, vostro: 1, vostra: 1, vostri: 1, vostre: 1 };
  var DEM = /^(questo|questa|questi|queste|quest'|quel|quello|quella|quei|quegli|quelle|quell')$/;
  var NEG = { niente: 1, nulla: 1, nessuno: 1, nessuna: 1, nessun: 1, mai: 1, neanche: 1, nemmeno: 1, neppure: 1, affatto: 1, mica: 1 };
  var CONN = ["però", "ma", "quindi", "allora", "infatti", "invece", "comunque", "anche se", "mentre", "siccome", "perciò", "poi",
              "inoltre", "tuttavia", "dunque", "perché", "oppure", "cioè", "insomma", "eppure", "sebbene", "benché", "nonostante",
              "secondo me", "da una parte", "dall'altra", "prima di tutto", "alla fine", "per esempio", "invece di"];
  var CONN_ALTI = ["in primo luogo", "in secondo luogo", "pertanto", "inoltre", "tuttavia", "dunque", "sebbene", "benché",
                   "d'altro canto", "per contro", "in conclusione", "in definitiva", "ciononostante", "di conseguenza",
                   "vale a dire", "ovvero", "poiché", "dal momento che", "affinché", "qualora", "purché", "altresì",
                   "ne consegue", "occorre", "in altri termini", "per di più", "nondimeno", "a mio avviso", "infine"];
  var SAY = { detto: 1, disse: 1, dissero: 1, dice: 1, dicono: 1, diceva: 1, chiesto: 1, chiese: 1, chiesero: 1, risposto: 1,
              rispose: 1, risposero: 1, promesso: 1, promise: 1, spiegato: 1, "spiegò": 1, raccontato: 1, "raccontò": 1,
              domandato: 1, "domandò": 1, scritto: 1, scrisse: 1 };
  var PRONOM = /\b(farcela|ce l'ho fatta|ce l'hai fatta|ce l'ha fatta|ce l'abbiamo fatta|ce l'hanno fatta|ce la faccio|ce la fai|ce la fa|ce la facciamo|non ce la|andarsene|andarmene|andartene|me ne vado|te ne vai|se ne va|se ne vanno|se n'è andat\w|me ne sono andat\w|prendersela|se l'è presa|se l'è preso|se la prende|me la prendo|te la prendi|cavarsela|me la cavo|te la cavi|se la cava|me la sono cavat\w|ce la siamo cavat\w|metterci|ci ho messo|ci ha messo|ci hanno messo|ci metto|ci mette|ci mettiamo|volerci|ci vuole|ci vogliono|ci sono volut\w|ci è volut\w|fregarsene|me ne frego|me ne sono fregat\w|sentirsela|me la sento|non me la sento|averci|ce l'ho|ce l'hai|ce l'ha)\b/g;
  var QUANT = /\b(chilo|chili|etto|etti|grammi|grammo|litro|litri|mezzo|mezza|decina|decine|dozzina|ventina|trentina|centinaio|centinaia|migliaio|migliaia|metà|per cento|percento|terzo|terzi|quarto|quarti|doppio|triplo|paio|bottiglia|bottiglie|scatola|scatole|fetta|fette|metro|metri|chilometri|chilometro)\b|%/g;
  var SUFF = /^(.{3,}?)(ettino|ellino|ellini|ellina|ettina|etto|etta|etti|ette|ino|ina|ini|ine|ello|ella|elli|elle|one|ona|oni|accio|accia|acci|acce|uccio|uccia|ucci|otto|otta)$/;

  function suffixed(w) {
    if (DATA.lex[w] || !SUFF.test(w)) return false;
    var m = SUFF.exec(w), stem = m[1];
    if ({ omone: 1, omoni: 1 }[w]) return true;
    var cands = [stem + "o", stem + "a", stem + "e", stem, stem.replace(/(c|g)h$/, "$1") + "o", stem.replace(/(c|g)h$/, "$1") + "a",
                 stem.replace(/i$/, "") + "e", stem.replace(/i$/, "") + "o"];
    return cands.some(function (c) { return DATA.lex[c] && !V(c).length; });
  }

  /* ------------------------------------------------ estructuras (features) */

  function features(text) {
    var tk = toks(text), ws = words(tk), low = " " + ws.map(function (t) { return t.w; }).join(" ") + " ";
    var f = {};
    var add = function (k, n) { f[k] = (f[k] || 0) + (n == null ? 1 : n); };
    var norm = String(text || "").toLowerCase().replace(/[’‘`´]/g, "'");
    var prevW = function (i) { for (var k = i - 1; k >= 0; k--) if (tk[k].w) return tk[k].w; return ""; };
    tk.forEach(function (t, i) {
      if (t.p) { if (t.p === "?") add("domande"); return; }
      var w = t.w, nx = tk[i + 1] || {}, n = nx.w || "", fv = V(w);
      var tense = function (x) { return fv.some(function (v) { return v.tense === x; }); };
      if ({ sono: 1, sei: 1, "è": 1, siamo: 1, siete: 1 }[w]) add("essere");
      if (AVE_PRES[w]) add("avere");
      if (DATA.nounsByPlural[w] && DATA.nounsByPlural[w].s !== w) add("plurali");
      if (U.ARTICLES && U.ARTICLES[w]) add("articoli");
      var pi = U.prepInfo ? U.prepInfo(w) : null;
      if (pi) { add("preposizioni"); if (pi.art) add("prepArt"); }
      if (DATA.adj[w] && !POSS[w]) add("aggettivi");
      if (tense("presente") && !AUX_PRES[w]) add("presente");
      if (fv.some(function (v) { return v.tense === "presente" && /^(andare|fare|uscire|venire|dovere|volere|potere|dire|stare|dare|bere|sapere|rimanere|tenere|scegliere|salire|tradurre|porre)$/.test(v.lemma); })) add("irregolari");
      if (/^(alle|all'|dalle|dall'|mezzogiorno|mezzanotte)$/.test(w) || (w === "le" && NUMS.test(n)) || (w === "l'" && n === "una")) add("ore");
      if (NUMS.test(w) && !(w === "sei" && (!tk[i + 1] || !NUMS.test(n)) && /^(tu|non|ci|lo|la)$/.test(prevW(i)))) add("numeri");
      if (/^(lo|la|li|le|gli|l'|ne)$/.test(w) && isVerb(n) && !isNoun(n)) add("pronomi");
      if (AUX_PRES[w] && nextPart(tk, i) > 0) add("pp");
      if (/^(mi|ti|si|ci|vi)$/.test(w) && isVerb(n) && !/^piac/.test(n)) add("riflessivi");
      if (/^(mi|ti|si|ci|vi|me|te|se|ce|ve)$/.test(w) && ESS_ALL[n] && nextPart(tk, i + 1) > 0) add("riflPass");
      if (t.clause || /^(e|ma)$/.test(prevW(i))) {
        var imp = fv.some(function (v) {
          return v.tense === "presente" && ((v.p === 1 && /(ere|ire|rre)$/.test(v.lemma)) || (v.p === 2 && /are$/.test(v.lemma)) || v.p === 4);
        }) || /^(va'|vai|fa'|fai|di'|dimmi|sta'|stai|da'|dai|vieni|abbi|sii|esci|fammi|dammi|alzati|svegliati|riposati|vestiti|lavati|siediti|calmati|sbrigati|guarda|senti|scusa|aspetta|ascolta)$/.test(w) ||
          (w === "non" && isInf(n));
        if (imp && !AUX_PRES[w]) add("imperativo");
      }
      if (/^piac/.test(w)) add("piacere");
      if (tense("imperfetto") || /^(ero|eri|era|eravamo|eravate|erano)$/.test(w) ||
          (/(av|ev|iv)(o|i|a|amo|ate|ano)$/.test(w) && w.length > 4 && !nounLike(w) && !DATA.lex[w])) add("imperfetto");
      if (POSS[w] || (w === "loro" && U.ARTICLES && U.ARTICLES[prevW(i)])) add("possessivi");
      if (DEM.test(w)) add("dimostrativi");
      if (NEG[w]) add("negazioni");
      if (tense("futuro") || (/([aei]r|rr|dr|vr)(ò|ai|à|emo|ete|anno)$/.test(w) && w.length > 4 && !/^(però|perciò)$/.test(w) && !nounLike(w))) add("futuro");
      if (tense("condizionale") || (/(rei|resti|rebbe|remmo|reste|rebbero)$/.test(w) && w.length > 5 && !nounLike(w))) add("condizionale");
      if (w === "ne" || w === "n'") add("ne");
      if (w === "ci" || w === "c'") add("ci");
      if (/^(glielo|gliela|glieli|gliele|gliene|gliel')$/.test(w) || (/^(me|te|ce|ve|se)$/.test(w) && /^(lo|la|li|le|ne|l')$/.test(n))) add("combinati");
      if (/^(più|meno)$/.test(w)) {
        for (var k = i + 1; k <= i + 4 && k < tk.length && tk[k].w; k++)
          if (/^(di|che|del|della|dei|degli|delle|dello|dell')$/.test(tk[k].w)) { add("comparativi"); break; }
      }
      if (/^(migliore|migliori|peggiore|peggiori|maggiore|maggiori|minore|minori)$/.test(w) || /issim[oaie]$/.test(w)) add("comparativi");
      if (/^(il|la|i|le|gli|lo)$/.test(w) && /^(più|meno)$/.test(n) && tk[i + 2] && nounLike(tk[i + 2].w || "")) add("comparativi");
      var trig = false;
      for (var q = i - 1; q >= Math.max(0, i - 5); q--) if (tk[q].w && /^(che|affinché|benché|sebbene|purché|prima|qualora)$/.test(tk[q].w)) { trig = true; break; }
      if (trig && fv.some(function (v) { return v.tense === "congiuntivo"; })) add("congiuntivo");
      if (/^(abbia|abbiano|abbiate|sia|siano|siate)$/.test(w) && nextPart(tk, i) > 0) { add("congPassato"); if (trig) add("congiuntivo", 0); }
      if (tense("congImperfetto") || (/(assi|asse|assimo|assero|essi|esse|essimo|essero|issi|isse|issimo|issero)$/.test(w) && w.length > 5 && !nounLike(w) && !DATA.lex[w])) add("congImperfetto");
      if (/^(avrei|avresti|avrebbe|avremmo|avreste|avrebbero|sarei|saresti|sarebbe|saremmo|sareste|sarebbero)$/.test(w) && nextPart(tk, i) > 0) add("condPassato");
      if (/^(avevo|avevi|aveva|avevamo|avevate|avevano|ero|eri|era|eravamo|eravate|erano)$/.test(w) && nextPart(tk, i) > 0) add("trapassato");
      if (w === "se" && !/^(lo|la|li|le|ne|l')$/.test(n)) add("se");
      if (w === "cui" || (/^(quale|quali)$/.test(w) && U.ARTICLES && (U.ARTICLES[prevW(i)] || (U.prepInfo(prevW(i)) || {}).art))) add("relativi");
      if (w === "che" && (isNoun(prevW(i)) || /^(quello|ciò|quella|quelli|quelle)$/.test(prevW(i)))) add("relativi");
      if ((ESS_ALL[w] || /^(viene|vengono|veniva|venivano|venne|vennero|verrà|verranno|venga|vengano)$/.test(w))) {
        var pk = nextPart(tk, i, 3);
        if (pk > 0 && /^(stato|stata|stati|state)$/.test(tk[pk].w)) pk = nextPart(tk, pk, 2);
        if (pk > 0 && auxOf(PP(tk[pk].w)) !== "essere" && !/^(stato|stata|stati|state)$/.test(tk[pk].w)) add("passiva");
      }
      if (w === "si" && (isVerb(n) || /^(può|possono|deve|devono)$/.test(n) || (/[^aeiou](a|ano|e|ono)$/.test(n) && !isNoun(n) && !DATA.adj[n]))) add("si");
      if (tense("passatoRemoto") || (/[^r]ò$/.test(w) && !/^(può|ciò|però|perciò|farò)$/.test(w)) ||
          (/(arono|erono|irono|ettero)$/.test(w) && !nounLike(w))) add("remoto");
      if (SAY[w]) {
        for (var s2 = i + 1; s2 <= i + 3 && s2 < tk.length && tk[s2].w; s2++)
          if (/^(che|se|di|come|dove|quando|perché|cosa)$/.test(tk[s2].w)) { add("indiretto"); break; }
      }
      var isFare = fv.some(function (v) { return v.lemma === "fare" || v.lemma === "lasciare"; }) || /^(fatto|fatta|fatti|fatte|lasciato|lasciata|lasciati|lasciate|fare|lasciare|farsi|farlo|farla|farli|farle|fargli|farmi|farti|lasciarlo|lasciarla|lasciarli|lasciarmi)$/.test(w);
      if (isFare) {
        for (var c2 = i + 1; c2 <= i + 3 && c2 < tk.length && tk[c2].w; c2++) {
          var cw = tk[c2].w;
          if (isInfCl(cw)) { add("causativo"); break; }
          if (!/^(lo|la|li|le|gli|l'|mi|ti|ci|vi|si|ne)$/.test(cw)) break;
        }
      }
      var isPerc = fv.some(function (v) { return /^(vedere|sentire|guardare|ascoltare|osservare)$/.test(v.lemma); }) || /^(visto|vista|visti|viste|sentito|sentita|sentiti|sentite|guardato|ascoltato|osservato)$/.test(w);
      if (isPerc) {
        for (var p2 = i + 1; p2 <= i + 4 && p2 < tk.length && tk[p2].w; p2++) if (isInfCl(tk[p2].w)) { add("percezione"); break; }
      }
      if (/^(a|ad|di|da)$/.test(w) && isInfCl(n)) add("infPrep");
      if (isInfCl(w)) add("infinito");
      if (/(ando|endo)$/.test(w) && w.length > 5 && !nounLike(w) && !/^(quando|secondo|mondo|tremendo|stupendo|orrendo)$/.test(w)) add("gerundio");
      if (t.start && isPart(w) && !AUX_PRES[w] && (U.ARTICLES && U.ARTICLES[n] || /^(a|al|alla|in|da|dal)$/.test(n))) add("partAss");
      if (suffixed(w)) add("suffissi");
      if (DATA.falsi && DATA.falsi[w]) add("falsi");
      if (/mente$/.test(w) && w.length > 6 && !isNoun(w)) add("avverbi");
    });
    f.concordanza = (f.congImperfetto || 0) + (f.condPassato || 0) + (f.trapassato || 0);
    // multi-word counts on the text
    var count = function (list) {
      var used = {};
      list.forEach(function (c) { if ((" " + low + " ").indexOf(" " + c + " ") >= 0 || norm.indexOf(c + " ") >= 0 && /'/.test(c)) used[c] = 1; });
      return Object.keys(used).length;
    };
    f.connettivi = count(CONN);
    f.connettiviAlti = count(CONN_ALTI);
    f.pronominali = (norm.match(PRONOM) || []).length;
    f.quantita = (norm.match(QUANT) || []).length;
    f.dislocazioni = dislocations(tk);
    f.esclamazione = exclamations(tk);
    f.words = ws.length;
    return f;
  }

  function sentences(tk) {
    var out = [], cur = [];
    tk.forEach(function (t) {
      if (t.p && /[.!?]/.test(t.p)) { if (cur.length) out.push({ t: cur, end: t.p }); cur = []; }
      else cur.push(t);
    });
    if (cur.length) out.push({ t: cur, end: "" });
    return out;
  }
  function exclamations(tk) {
    return sentences(tk).filter(function (s) {
      var first = s.t.filter(function (x) { return x.w; })[0];
      return s.end === "!" && first && /^(che|come|quanto|quanta|quanti|quante|quale)$/.test(first.w);
    }).length;
  }
  function dislocations(tk) {
    var n = 0, ART = U.ARTICLES || {};
    for (var i = 0; i < tk.length; i++) {
      var t = tk[i];
      if (!t.w) continue;
      // Left: «il vino, l'ho scelto» — article/demonstrative + noun, then a clitic + verb, no verb in between.
      if ((ART[t.w] && ART[t.w][2] === "det" || DEM.test(t.w)) && tk[i + 1] && tk[i + 1].w && !isVerb(tk[i + 1].w)) {
        for (var k = i + 2; k < tk.length && k <= i + 7; k++) {
          var x = tk[k];
          if (x.p && /[.!?]/.test(x.p)) break;
          if (!x.w) continue;
          if (/^(lo|la|li|le|l'|ne)$/.test(x.w) && tk[k + 1] && isVerb(tk[k + 1].w)) { n++; i = k; break; }
          if (isVerb(x.w) && x.w !== "non") break;
        }
      }
      // Cleft: «è stata lei a…», «è stato lui che…», «è Marco che…»
      if (/^(è|era|fu)$/.test(t.w)) {
        var j = i + 1;
        if (tk[j] && /^(stato|stata|stati|state)$/.test(tk[j].w || "")) j++;
        var who = tk[j];
        if (who && who.w && (/^(lui|lei|io|tu|noi|voi|loro)$/.test(who.w) || who.cap) && tk[j + 1] && /^(che|a|ad)$/.test(tk[j + 1].w || "")) n++;
      }
    }
    return n;
  }

  /* ------------------------------------------------------------ errores */

  var DO_VERBS = /^(conoscere|vedere|aspettare|chiamare|salutare|incontrare|visitare|ascoltare|guardare|amare|trovare|accompagnare|invitare|ringraziare|aiutare)$/;
  var DO_PART = /^(conosciut|vist|aspettat|chiamat|salutat|incontrat|visitat|ascoltat|guardat|amat|trovat|accompagnat|invitat|ringraziat|aiutat)[oaie]$/;
  var TO_SUBJ = { "è": "sia", sono: "sia (io) / siano (loro)", ha: "abbia", hanno: "abbiano", va: "vada", vanno: "vadano", fa: "faccia", fanno: "facciano",
                  "può": "possa", possono: "possano", vuole: "voglia", vogliono: "vogliano", deve: "debba", devono: "debbano",
                  sa: "sappia", sanno: "sappiano", viene: "venga", vengono: "vengano", vieni: "venga", esce: "esca", dice: "dica",
                  sta: "stia", stanno: "stiano", "c'è": "ci sia" };
  var OPINION = /^(penso|pensi|pensa|credo|credi|crede|spero|speri|spera|voglio|vuoi|vuole|dubito|immagino|temo|sembra|pare|bisogna|importante|possibile|probabile|meglio|peccato|necessario)$/;
  var ASK = /^(chiedo|chiedi|chiede|chiesto|chiese|domando|domanda|so|sai|sa|sapere|sapevo|dubito|capire|capisco|vedere|vediamo|dimmi|dico)$/;

  function expectedArticle(art, noun) {
    var A = U.ARTICLES[art], info = DATA.nouns[noun] || DATA.nounsByPlural[noun];
    if (!A || !info) return null;
    var plural = DATA.nounsByPlural[noun] && info.pl === noun && info.s !== noun;
    var sing = DATA.nouns[noun] && info.s === noun;
    if (plural && sing) return null;
    var num = info.s === info.pl ? A[1] : plural ? "p" : "s";   // invariable: trust the article's number
    var g = info.g, snd = U.soundRule(noun);
    if (num === "p" && /a$/.test(noun) && /o$/.test(info.s)) g = "f";   // le uova, le braccia, le dita
    if (A[2] === "det") {
      if (num === "s") return g === "m" ? (snd === "sz" ? "lo" : snd === "v" ? "l'" : "il") : (snd === "v" ? "l'" : "la");
      return g === "m" ? (snd === "c" ? "i" : "gli") : "le";
    }
    if (num === "p") return null;
    return g === "m" ? (snd === "sz" ? "uno" : "un") : (snd === "v" ? "un'" : "una");
  }

  /* Who is talking: a text in first person singular («Mi chiamo…», «io»,
     «mio», a verb in the io form) with no noi / voi / loro as subject.  In
     such a text a verb with no subject of its own is the learner's. */
  var NOT_PERSONAL = /^(piacere|sembrare|mancare|servire|interessare|bastare|dispiacere|volerci|occorrere|succedere|costare|parere|convenire|importare)$/;
  function speakerIo(tk) {
    var io = 0, pl = 0;
    tk.forEach(function (t, i) {
      if (!t.w) return;
      if (/^(io|mio|mia|miei|mie|me)$/.test(t.w)) io++;
      if (t.w === "mi" && t.start) io++;
      if (/^(noi|voi|loro|nostro|nostra|nostri|nostre)$/.test(t.w)) pl++;
      if (V(t.w).some(function (v) { return v.p === 0 && v.tense !== "congiuntivo" && v.tense !== "congImperfetto"; }) &&
          !V(t.w).some(function (v) { return v.p !== 0; })) io++;
    });
    return io > 0 && pl === 0;
  }
  function ioForm(lemma, tense) {
    try { var f = Conj.conjugate(lemma, tense)[0]; return f.split(" ").pop(); } catch (e) { return null; }
  }
  // An adjective in the other number: felici → felice, argentino → argentini.
  function adjNumber(w, plural) {
    var lem = DATA.adj[w];
    if (!lem) return null;
    var stem = w.replace(/(he|hi)$/, "h").replace(/[oaie]$/, "");
    var cands = plural ? (/[ie]$/.test(w) && /e$/.test(lem) ? [stem + "i"] : /a$/.test(w) ? [stem + "e", stem.replace(/(c|g)$/, "$1h") + "e"] : [stem + "i", stem.replace(/(c|g)$/, "$1h") + "i"])
                       : (/e$/.test(lem) ? [stem + "e"] : /e$/.test(w) ? [stem + "a"] : [stem + "o"]);
    for (var k = 0; k < cands.length; k++) if (DATA.adj[cands[k]] === lem) return cands[k];
    return null;
  }

  /* Words cited, not used: inside a short quote (up to six words: «pisar la
     pelota», “hacer una vaca”) or right after a word that names them («la
     parola *slogan*», «a palavra *propina*»).  The text talks about them, so
     they are not the learner's mistakes. */
  function citedOut(src, tk, out, NAMES) {
    var spans = [], re = /“([^”\n]*)”|«([^»\n]*)»|"([^"\n]*)"/g, m;
    while ((m = re.exec(src))) {
      var inner = m[1] != null ? m[1] : m[2] != null ? m[2] : m[3];
      if (inner.split(/\s+/).filter(Boolean).length <= 6) spans.push([m.index, m.index + m[0].length]);
    }
    return out.filter(function (f) {
      var t = tk[f.i];
      if (!t || t.at == null) return true;
      if (spans.some(function (s) { return t.at >= s[0] && t.at < s[1]; })) return false;
      for (var k = f.i - 1; k >= 0 && k >= f.i - 1; k--) if (tk[k].w && NAMES.test(tk[k].w)) return false;
      return true;
    });
  }

  // A finding with its minimal correction (Scrivi.check → «Tus errores»).
  function withGood(f, good) { if (f) f.good = good; return f; }
  function lint(text, week) {
    week = week || 52;
    var tk = toks(text), out = [];
    var isIo = speakerIo(tk), personFlag = {};
    // A text that talks to someone (tu, ti, tuo…; Lei, La, Sua… with a capital
    // in mid-sentence; Caro / Gentile at the start): a second person there is
    // the addressee, not a slip for io.
    var addressed = tk.some(function (t, k) {
      return t.w && (/^(tu|ti|te|tuo|tua|tuoi|tue|vi|voi|vostro|vostra)$/.test(t.w) ||
        (t.cap && !t.start && /^(lei|la|le|sua|suo|sue|suoi)$/.test(t.w)) || (k < 3 && /^(caro|cara|cari|care|gentile|egregio|egregia)$/.test(t.w)));
    });
    var push = function (i, n, cat, msg, soft) { out.push({ i: i, n: n || 1, cat: cat, msg: msg, soft: !!soft }); };
    var it = function (s) { return "*" + s + "*"; };
    var wi = function (k, dir) { for (var x = k + dir; x >= 0 && x < tk.length; x += dir) if (tk[x].w) return x; return -1; };
    var lexKeys = null;
    tk.forEach(function (t, i) {
      if (!t.w) return;
      var w = t.w, ni = wi(i, 1), n = ni >= 0 ? tk[ni].w : "", pi = wi(i, -1), p = pi >= 0 ? tk[pi].w : "";
      var nxt = ni >= 0 ? tk[ni] : null;
      // A capital in mid-sentence, or two capitals in a row (Buenos Aires): a name.
      var proper = t.cap && (!t.start || (nxt && nxt.cap && ni === i + 1));
      var already = out.some(function (f) { return i >= f.i && i < f.i + f.n; });
      var truncated = /^(aver|esser|far|dir|star|andar|poter|voler|dover|saper|fin|per|cuor|buon|bel|gran|san|qual|tal|signor|dottor|professor|mar|ben|son|vien)$/.test(w);
      // 1. Español metido
      if (!already && !proper && !truncated && !LEXI[w] && U.spanishWord && (U.spanishWord(w) || ES_EXTRA[w] || (U.looksSpanish(w) && !t.cap && !freqKnown(w)))) {
        var tr = ES_EXTRA[w] || U.spanishWord(w);
        // a Spanish plural: translate the singular and make it plural (gatos → gatti)
        if (!tr && /s$/.test(w)) {
          [w.replace(/es$/, ""), w.replace(/s$/, "")].some(function (sg) {
            if (DATA.nouns[sg] && DATA.nouns[sg].pl) { tr = DATA.nouns[sg].pl; return true; }   // libros → libri
            var t1 = U.spanishWord(sg);
            if (!t1) return false;
            var it1 = String(t1).split(" / ")[0], nn = DATA.nouns[it1];
            tr = nn && nn.pl ? nn.pl : it1;
            return true;
          });
        }
        push(i, 1, "parola_spagnola", it(t.o) + " es español" + (tr ? "; en italiano: " + it(String(tr).split(" / ")[0]) : "") + ".");
        return;
      }
      // 2. Palabra que no existe: tipeo, doble, tilde
      if (!already && !proper && !truncated && /^[a-zà-ÿ]+'?$/.test(w) && w.length > 2 && !exists(w) && !partStrict(w) && !infStrict(w) &&
          !suffixed(w) && !/(ando|endo)$/.test(w) && !menteOK(w)) {
        var grave = w.replace(/ó$/, "ò").replace(/á$/, "à").replace(/í$/, "ì").replace(/ú$/, "ù");
        if (grave !== w && (known(grave) || V(grave).length)) { push(i, 1, "accento", "La tilde final va hacia el otro lado: " + it(grave) + "."); return; }
        if (!lexKeys) lexKeys = Object.keys(LEXI).concat(Object.keys(DATA.lex));
        DEGEM = null;
        var best = null, bd = 9, lim = w.length > 6 ? 2 : 1;
        for (var k = 0; k < lexKeys.length; k++) {
          var c = lexKeys[k];
          if (Math.abs(c.length - w.length) > lim || c.indexOf(" ") >= 0) continue;
          if (U.deaccent(c) === U.deaccent(w) || U.degeminate(c) === U.degeminate(w)) {
            if (best && bd === 0 && !(/[àèéìòù]/.test(w) && /[àèéìòù]/.test(c) && !/[àèéìòù]/.test(best))) continue;
            best = c; bd = 0; if (!/[àèéìòù]/.test(w)) break; continue;
          }
          if (bd === 0) continue;
          var d = U.editDistance(c, w);
          if (d < bd) { bd = d; best = c; }
        }
        if (ES_EXTRA[w]) { push(i, 1, "parola_spagnola", it(t.o) + " es español; en italiano: " + it(ES_EXTRA[w]) + "."); return; }
        var sibling = /[oaie]$/.test(w) && ["o", "a", "i", "e"].some(function (e) { return known(w.slice(0, -1) + e); });
        if (sibling && best && bd === 0 && U.deaccent(best) !== U.deaccent(w)) return;   // compresa: a form of compreso
        if (best && bd === 0 && U.deaccent(best) === U.deaccent(w)) { push(i, 1, "accento", "Falta la tilde: " + it(best) + "."); return; }
        if (!(best && bd === 0) && !t.cap && !sibling) {   // matta is a form of matto, not a typo
          // Another form of a known word: clasica ~ classico, piati ~ piatto, tranquilamente ~ tranquillo.
          var mm = /^(.+?)(amente|emente|mente)$/.exec(w), stemW = mm ? mm[1] : w.slice(0, -1), endW = mm ? mm[2] : w.slice(-1);
          var dW = U.degeminate(stemW);
          for (var k2 = 0; k2 < lexKeys.length && !(best && bd === 0); k2++) {
            var c3 = lexKeys[k2];
            if (!/[oaie]$/.test(c3) || Math.abs(c3.length - 1 - stemW.length) > 2) continue;
            var st3 = c3.slice(0, -1);
            if (st3 !== stemW && U.degeminate(st3) === dW && (!mm || DATA.adj[c3] || /[oe]$/.test(c3))) { best = st3 + endW; bd = 0; }
          }
        }
        if (best && bd === 0) { push(i, 1, "doppie", "Se escribe " + it(best) + " (" + (best.length > w.length ? "con doble" : "sin doble") + ")."); return; }
        var esT = esLookup(w), ff = !esT && futureFix(w), trx = !esT && !ff && esTransform(w);
        if (esT) { if (/a$/.test(w) && /o$/.test(esT)) esT = esT.slice(0, -1) + "a"; push(i, 1, "parola_spagnola", it(t.o) + " es español; en italiano: " + it(esT) + "."); return; }
        if (ff) { push(i, 1, "ortografia", "La forma es " + it(ff) + "."); return; }
        if (trx) { push(i, 1, trx.es ? "parola_spagnola" : "ortografia", trx.es ? it(t.o) + " es español; en italiano: " + it(trx.it) + "." : "Se escribe " + it(trx.it) + "."); return; }
        var dm = /^(.+?)c?it([oa])s?$/.exec(w), dbase = dm && [dm[1] + "a", dm[1] + "o", dm[1] + "e"].filter(known)[0];
        if (dbase && !t.cap && !infStrict(dm[1] + "ire") && !infStrict(dm[1] + "are")) {
          var dsug = [dm[1] + "ett" + dm[2], dm[1] + "in" + dm[2], dm[1] + "cin" + dm[2]].filter(known)[0] || dm[1] + "ett" + dm[2];
          push(i, 1, "parola_spagnola", "El diminutivo castellano " + it("-ito") + " no existe en italiano: " + it(dsug) + " (" + it("-etto") + ", " + it("-ino") + ")."); return;
        }
        if (/[^aeiou]s$/.test(w) && known(w.slice(0, -1))) { push(i, 1, "plurale", "En italiano " + it(w.slice(0, -1)) + " no cambia en plural (sin *-s*)."); return; }
        if (sibling) return;
        // A near word is only a guess: with the whole course as lexicon, a
        // word it does not know is more often rare than wrong (pertanto is
        // not a typo of portato), so no guess then.
        else if (best && bd <= lim && lexiN < 5000) push(i, 1, "refuso", "¿Quisiste decir " + it(best) + "?", true);
        else if (lexiN < 5000) push(i, 1, "lessico", "No conozco " + it(t.o) + ": revisá cómo se escribe.", true);
        return;
      }
      // 3. Artículo y sustantivo
      if (U.ARTICLES[w] && n && isNoun(n) && !V(n).length && !DATA.adj[n] && !(ni >= 0 && tk[ni].cap) && !AMBI_GENDER.test(n) && !NUMS.test(n) && !COMMON_G.test(n) &&
          !(/^(uno|una)$/.test(w) && isPart(n) && /^(su|di|da|in|con|per|a|tra|fra)$/.test(ni >= 0 ? (tk[wi(ni, 1)] || {}).w || "" : "")) &&
          !(w === "lo" && U.soundRule(n) === "c" && (DATA.nouns[n] || {}).g === "f") &&
          !(/^(lo|la|l'|li|le|gli)$/.test(w) && (/^(me|te|se|ce|ve|non|mi|ti|ci|vi)$/.test(p) || (/([ae]|ano|ono|ava|eva)$/.test(n) && pi >= 0 && pi === i - 1 && (tk[pi].cap || (isNoun(p) && !V(p).length) || /^(lui|lei|chi|che|io|tu|noi|voi|loro)$/.test(p)))))) {
        var ea = expectedArticle(w, n);
        if (ea && ea !== w && !(w === "l'" && ea === "l'")) {
          var gen = U.ARTICLES[ea][0] !== U.ARTICLES[w][0] && U.ARTICLES[w][0] !== "?";
          push(i, 2, gen ? "genere" : "articolo", "Con " + it(n) + " va " + it(ea + (ea.slice(-1) === "'" ? "" : " ") + n) + ".");
        }
      }
      // 4. Auxiliar: «ho andato», «mi ho lavato»
      if (AVE_PRES[w]) {
        var pk = nextPart(tk, i);
        if (pk > 0) {
          var lem = PP(tk[pk].w);
          if (!lem) { var mr = /^(.+)(at|ut|it)[oaie]$/.exec(tk[pk].w); if (mr && ESS_VERBS[mr[1] + { at: "are", ut: "ere", it: "ire" }[mr[2]]]) lem = mr[1] + { at: "are", ut: "ere", it: "ire" }[mr[2]]; }
          if (lem && /rsi$/.test(lem)) lem = lem.slice(0, -3) + "re";   // li ho sentiti: sentire, not sentirsi
          var refl = { mi: "ho", ti: "hai", si: "ha", vi: "avete" }[p] === w || (p === "si" && w === "hanno");
          if (refl || (lem && auxOf(lem) === "essere" && lem !== "essere")) {
            var pw4 = tk[pk].w, pl4 = /^(abbiamo|avete|hanno)$/.test(w), end4 = pl4 ? (/e$/.test(pw4) ? "e" : "i") : (/a$/.test(pw4) ? "a" : "o");
            push(i, pk - i + 1, "ausiliare", (refl ? "Los reflexivos van con *essere*: " : /^stat/.test(pw4) ? it(pw4) + " va con *essere*: " : "Con " + it(lem) + " va *essere*: ") +
              it((refl ? p + " " : "") + ({ ho: "sono", hai: "sei", ha: "è", abbiamo: "siamo", avete: "siete", hanno: "sono" })[w] + " " + pw4.replace(/[oaie]$/, end4)) + " (el participio concuerda con el sujeto).");
          }
        }
      }
      // 5. «a» personal
      if (w === "a" && pi >= 0 && (V(p).some(function (v) { return DO_VERBS.test(v.lemma); }) || DO_PART.test(p)) &&
          ni >= 0 && (tk[ni].cap || POSS[n] || /^(lui|lei|loro)$/.test(n)) && !/^(casa|scuola|letto)$/.test(n) && !CITIES.test(n) && !COUNTRY[n] &&
          !/^(si|ci|vi|mi|ti)$/.test(pi > 0 ? (tk[wi(pi, -1)] || {}).w || "" : "")) {
        push(i, 1, "a_personale", "Sin «a»: el objeto directo de persona va directo (" + it(p + " " + tk[ni].o + (POSS[n] && tk[ni + 1] && tk[ni + 1].w ? " " + tk[ni + 1].o : "")) + ").");
      }
      // 6. «il mio padre»
      if (/^(il|la|lo)$/.test(w) && POSS[n] && tk[ni + 1] && !(tk[ni + 2] && tk[ni + 2].w && (DATA.adj[tk[ni + 2].w] || /^(più|che|di)$/.test(tk[ni + 2].w))) && /^(madre|padre|fratello|sorella|moglie|marito|figlio|figlia|nonno|nonna|zio|zia|cugino|cugina|suocero|suocera|cognato|cognata|nipote)$/.test(tk[ni + 1].w || "")) {
        push(i, 1, "articolo_possessivo", "Con un familiar en singular, sin artículo: " + it(n + " " + tk[ni + 1].w) + ".");
      }
      // 7. Posesivo sin artículo con una cosa: «mio libro»
      if (POSS[w] && ni === i + 1 && isNoun(n) && !(isNoun(p) && !U.ARTICLES[p]) && !/^(avviso|parere|volta|vita|conto|insaputa|disposizione)$/.test(n) && !(/^(madre|padre|fratello|sorella|moglie|marito|figlio|figlia|nonno|nonna|zio|zia|cugino|cugina|mamma|papà|suocero|suocera|nipote|cognato|cognata)$/.test(n) && !/^(miei|mie|tuoi|tue|suoi|sue|nostri|nostre|vostri|vostre)$/.test(w)) &&
          !(U.ARTICLES[p] || (U.prepInfo(p) || {}).art || ESS_ALL[p] || DEM.test(p) || /^(un|una|uno|un'|alcuni|alcune|molti|molte|pochi|poche|tanti|tante|troppi|troppe|certi|certe|parecchi|parecchie|diversi|diverse|vari|varie|qualche|ogni|nessun|nessuna|tutti|tutte)$/.test(p) || NUMS.test(p) || /^\d+$/.test(p))) {
        var gP = nounGN(n), gnP = gP && gP.g + (gP.n || (/^(miei|mie|tuoi|tue|suoi|sue|nostri|nostre|vostri|vostre)$/.test(w) ? "p" : "s")), sP = U.soundRule(w);
        var eaP = gnP && { ms: sP === "c" ? "il" : sP === "sz" ? "lo" : "l'", fs: sP === "v" ? "l'" : "la", mp: sP === "c" ? "i" : "gli", fp: "le" }[gnP];
        if (eaP) push(i, 2, "articolo_possessivo", "Con el posesivo va el artículo: " + it(eaP + (eaP.slice(-1) === "'" ? "" : " ") + w + " " + n) + ".");
      }
      // 8. «a il» → «al»
      if (/^(a|di|da|in|su)$/.test(w) && /^(il|lo|la|i|gli|le|l')$/.test(n) && ni === i + 1 && !tk[ni].cap &&
          !(w === "su" && (V(p).length || /(ando|endo)$/.test(p) || isInf(p)))) {
        var cf = U.contract(w, n);
        var n8 = tk[ni + 1] && tk[ni + 1].w;
        if (cf && w === "a" && n8 && IN_PLACES.test(n8)) push(i, 3, "preposizione", "Con " + it(n8) + " va " + it("in " + n8) + ".");
        else if (cf) push(i, 2, "preposizione_articolata", it(w + " " + n) + " se escribe junto: " + it(cf + (cf.slice(-1) === "'" ? "" : " ") + (n8 || "")) + ".");
      }
      // 9. «se avrei»
      if (w === "se" && !/^(lo|la|li|le|ne|l')$/.test(n) && !ASK.test(p) && !ASK.test(pi > 0 ? (tk[wi(pi, -1)] || {}).w || "" : "")) {
        for (var s = i + 1; s < tk.length && s <= i + 4 && tk[s].w; s++) {
          var sw = tk[s].w;
          if (/^(non|mi|ti|ci|vi|si|lo|la|li|le|gli|ne|io|tu|lui|lei|noi|voi|loro|già|mai|davvero)$/.test(sw)) continue;
          if (V(sw).some(function (v) { return v.tense === "condizionale"; }) || (!V(sw).length && /(rei|resti|rebbe|remmo|reste|rebbero)$/.test(sw) && sw.length > 5)) {
            push(s, 1, "periodo_ipotetico", "Después de *se* hipotético no va condicional: *se avessi…*, *se potessi…* (el condicional va en la otra parte).");
          }
          break;
        }
      }
      // 10. «penso che è» (desde la semana del congiuntivo)
      if (week >= 24 && w === "che" && OPINION.test(p)) {
        for (var q = i + 1; q < tk.length && q <= i + 3 && tk[q].w; q++) {
          var qw = tk[q].w;
          if (/^(io|tu|lui|lei|noi|voi|loro|non|mi|ti|ci|vi|si|lo|la|gli|le)$/.test(qw) || tk[q].cap) continue;
          var key = qw === "c'" && tk[q + 1] && tk[q + 1].w === "è" ? "c'è" : qw;
          if (TO_SUBJ[key]) push(q, key === "c'è" ? 2 : 1, "congiuntivo", "Después de " + it(p + " che") + " va congiuntivo: " + it(TO_SUBJ[key]) + ".");
          break;
        }
      }
      // 11. «molto amici»
      if (/^(molto|tanto|poco|troppo)$/.test(w) && ni === i + 1 && DATA.nounsByPlural[n] && DATA.nounsByPlural[n].s !== n) {
        var g11 = DATA.nounsByPlural[n].g;
        push(i, 1, "accordo", "Delante de un sustantivo concuerda: " + it((w === "poco" ? "poch" : w.slice(0, -1)) + (g11 === "f" ? "e" : "i") + " " + n) + ".");
      }
      // 11b. «molto pasta» → «molta pasta»
      if (/^(molto|tanto|poco|troppo)$/.test(w) && ni === i + 1 && DATA.nouns[n] && DATA.nouns[n].s === n && DATA.nouns[n].g === "f" &&
          !DATA.adj[n] && !V(n).length) {
        push(i, 1, "accordo", "Delante de un sustantivo concuerda: " + it(w.slice(0, -1) + "a " + n) + ".");
      }
      // 12. «c'è due» → «ci sono»
      if (w === "è" && p === "c'" && ni >= 0 && (/^(due|tre|quattro|cinque|sei|sette|otto|nove|dieci|molti|molte|tanti|tante|alcuni|alcune|dei|degli|delle|parecchi|parecchie)$/.test(n) || (U.ARTICLES[n] && U.ARTICLES[n][1] === "p"))) {
        push(pi, 2, "ci_ne", "Con plural va *ci sono*: " + it("ci sono " + n) + ".");
      }
      // 13. «lui e alto» → «è»
      if (w === "e" && (/^(lui|lei)$/.test(p) || (pi >= 0 && tk[pi].cap && !tk[pi].start && !PREPS.test((tk[wi(pi, -1)] || {}).w || ""))) && ni >= 0 && (DATA.adj[n] || isPart(n)) && !(tk[ni].cap)) {
        push(i, 1, "accento", "El verbo lleva tilde: " + it("è") + " (*e* sin tilde es «y»).");
      }
      // 15. Persona: hablás de vos y el verbo no tiene sujeto propio
      //     (Mi chiami → mi chiamo, Hanno 32 anni → ho, e siamo → sono).
      if (isIo && !proper) {
        var clauseStart = t.start || /^(e|ma|però|poi|anche|quindi)$/.test(p) ||
          (pi >= 0 && tk[pi].start && /^(mi|ti|ci|vi|si|non)$/.test(p));
        var subjBefore = false;
        for (var sb = i - 1; sb >= 0 && (tk[sb].w || (tk[sb].p === "," && /^(e|ma|però|poi|quindi)$/.test(p))); sb--) {
          if (!tk[sb].w) continue; if (/^(io|tu|lui|lei|noi|voi|loro)$/.test(tk[sb].w) || (tk[sb].cap && !tk[sb].start) || isNoun(tk[sb].w)) { subjBefore = true; break; } }
        var ind = V(w).filter(function (v) { return !/congiuntivo|congImperfetto/.test(v.tense); });
        // noi / voi («siamo in tre») only with a singular adjective after it
        // (siamo argentino); tu in a question is someone else (mi chiami domani?)
        var nxAdj = ni >= 0 && DATA.adj[n] && !/[ie]$/.test(n) ? n : null;
        var sEnd = null;
        for (var se = i + 1; se < tk.length; se++) if (tk[se].p && /[.!?]/.test(tk[se].p)) { sEnd = tk[se].p; break; }
        if (ind.length && ind.every(function (v) { return v.p === 3 || v.p === 4; }) && !nxAdj) ind = [];
        if (ind.length && ind.every(function (v) { return v.p === 1; }) && sEnd === "?") ind = [];
        var objCl = /^(mi|ti|ci|vi|gli|le|lo|la|li|ne)$/.test(p) && (AVE_PRES[w] || !REFLEXIVE_L.test(ind.length ? ind[0].lemma : "") || ind.some(function (v) { return v.p === 5; }));
        var alone = (tk[i + 1] && tk[i + 1].p && t.start) || isNoun(w) || (t.start && IMPV_WORDS.test(w)) || p === "si";
        if (t.dlg) alone = true;
        // «Pensi che…», «Senti, …», «Vedrai che…»: speaking to someone
        if (ind.some(function (v) { return v.p === 1; }) && (addressed || (tk[i - 1] && tk[i - 1].p === "," && tk[i + 1] && tk[i + 1].p) ||
            (t.start && (n === "che" || (tk[i + 1] && tk[i + 1].p) || U.ARTICLES[n] || (U.prepInfo && U.prepInfo(n)))))) alone = true;
        if (ind.length && ind.every(function (v) { return v.p === 5; }) && !(NUMS.test(n) || /^\d+$/.test(n) || (DATA.adj[n] && !isNoun(n)) || /^(chiamare|chiamarsi)$/.test(ind[0].lemma))) alone = true;
        if (ESS_ALL[w] && /^(anni|mesi|giorni|ore|settimane|secoli|tempo)$/.test(n)) alone = true;
        if (clauseStart && !subjBefore && !objCl && !alone && ind.length && !ind.some(function (v) { return v.p === 0 || v.p === 2; }) &&
            !NOT_PERSONAL.test(ind[0].lemma)) {
          var v0 = ind[0] || V(w)[0], f0 = v0 && ioForm(v0.lemma, v0.tense);
          if (f0 && f0 !== w && !NOT_PERSONAL.test(v0.lemma) || (v0 && v0.lemma === "essere" && f0 && f0 !== w)) {
            personFlag[i] = 1;
            push(i, 1, "persona_verbale", "Hablás de vos (*io*): " + it((p === "mi" ? "mi " : "") + f0) + ", no " + it(w) + ".");
          }
        }
      }
      // 16. Adjetivo con essere: el número del sujeto (è felici, siamo contento, io sono felici)
      if (ESS_ALL[w] && !personFlag[i] && !/^(si|mi|ti|ci|vi)$/.test(p)) {
        var aj = ni;
        if (aj >= 0 && /^(molto|tanto|così|più|proprio|davvero|un po'|sempre|già)$/.test(n)) aj = wi(ni, 1);
        var aw = aj >= 0 ? tk[aj].w : "";
        if (aw && DATA.adj[aw] && !isNoun(aw)) {
          var subj16 = false;
          for (var s6 = i - 1; s6 >= 0 && tk[s6].w; s6--) {
            if (/^(tu|lui|lei|noi|voi|loro)$/.test(tk[s6].w) || (tk[s6].cap && !tk[s6].start) || isNoun(tk[s6].w) || (tk[s6].cap && s6 !== i - 1 && !/^(mi|io|non)$/.test(tk[s6].w))) { subj16 = true; break; }
            if (tk[s6].w === "e" && s6 > 0 && tk[s6 - 1].cap) { subj16 = true; break; }
          }
          // a plural subject earlier in the sentence (i film romantici: sono noiosi)
          for (var s7 = i - 1; s7 >= 0 && !(tk[s7].p && /[.!?]/.test(tk[s7].p)); s7--) {
            var x7 = tk[s7].w;
            if (x7 && ((DATA.nounsByPlural[x7] && DATA.nounsByPlural[x7].s !== x7) || /^(loro|noi|voi|tutti|tutte)$/.test(x7) ||
                (/^(i|gli|le)$/.test(x7) && tk[s7 + 1] && isNoun(tk[s7 + 1].w || "")))) { subj16 = true; break; }
          }
          var sing = /^(sei|è|ero|eri|era|sarò|sarai|sarà|sarei|saresti|sarebbe|sia)$/.test(w) || (isIo && !subj16 && /^(sono|ero|sarò|sarei)$/.test(w));
          var plu = /^(siamo|siete|eravamo|eravate|erano|saremo|sarete|saranno|saremmo|sareste|sarebbero|siano)$/.test(w) || (!isIo && w === "sono" && false);
          var isPl = /[ie]$/.test(aw) && DATA.adj[aw] !== aw && !(/e$/.test(aw) && DATA.adj[aw] === aw);
          var fix = sing && isPl ? adjNumber(aw, false) : plu && !isPl ? adjNumber(aw, true) : null;
          if (fix && fix !== aw) push(aj, 1, "accordo", (sing && isIo && w === "sono" ? "Hablás de vos: el adjetivo va en singular: " : "Concuerda con el sujeto de " + it(w) + ": ") + it(fix) + ".");
        }
      }
      // 17. Después de un número, plural: 32 anni (no «anno», ni «anne»)
      if ((/^\d+$/.test(w) && +w > 1) || (NUMS.test(w) && !/^(uno|una|un|primo|prima|secondo|terzo|quarto|quinto|sesto|settimo|ottavo|nono|decimo|mezzogiorno|mezzanotte|sei)$/.test(w))) {
        // «del 10% rispetto all'anno scorso»: a percentage, not a count of «rispetto»
        if (ni === i + 1 && !personFlag[ni] && !/^(alle|le|dalle|entro|verso|delle)$/.test(p) && String(text).charAt(t.at + t.len) !== "%" && !/^(gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre|euro|per|volte|e|o)$/.test(n)) {
          var nw = n, pluralOk = DATA.nounsByPlural[nw] && DATA.nounsByPlural[nw].pl === nw;
          var cand = DATA.nouns[nw] && DATA.nouns[nw].s === nw && DATA.nouns[nw].pl !== nw ? DATA.nouns[nw].pl : null;
          if (ES_EXTRA[nw]) cand = null;
          else if (!pluralOk && !cand && !known(nw)) {
            var st = nw.replace(/s$/, "").replace(/[oaie]$/, "");   // annos, anne → anni
            if (/o$/.test(nw) && !V(nw).length && known(st + "i") && !V(st + "i").length) cand = st + "i";   // tre etto → etti
            ["i", "e"].forEach(function (x) { if (!cand && DATA.nounsByPlural[st + x] && DATA.nounsByPlural[st + x].pl === st + x) cand = st + x; });
          }
          if (cand && !pluralOk) {
            // a word already flagged as unknown is replaced by this clearer one
            out = out.filter(function (f) { return f.i !== ni; });
            push(ni, 1, "plurale", "Después de " + it(t.o) + " va el plural: " + it(cand) + ".");
          }
        }
      }
      // 14. «sono trenta anni» → «ho trent'anni»
      if (w === "sono" && ni >= 0 && (NUMS.test(n) || /^\d+$/.test(n)) && tk[ni + 1] && tk[ni + 1].w === "anni" && !(tk[ni + 2] && /^(che|fa)$/.test(tk[ni + 2].w || ""))) {
        push(i, 1, "lessico", "La edad va con *avere*: " + it("ho " + n + " anni") + ".");
      }
    });
    lint2(tk, week, out, isIo);
    out = citedOut(String(text || "").replace(/[’‘`´]/g, "'"), tk, out, /^(parola|parole|termine|termini|verbo|verbi|espressione|aggettivo|sostantivo|forma|voce)$/);
    out.forEach(function (f) { enrich(f, tk); });
    return out.sort(function (a, b) { return a.i - b.i; });
  }

  /* ---------------------------------------------- lo que se guarda de cada marca

     Cada hallazgo trae, además de i, n, cat, msg y soft:
       bad   lo escrito (las palabras marcadas, tal como están en el texto)
       good  la corrección mínima de esas palabras, si el corrector la sabe
             (si no, null)
       why   el porqué de la categoría, en una o dos líneas, con el contraste
             con el español cuando sirve
     msg es el mensaje entero que se muestra: el aviso corto y, si era muy
     corto, el porqué a continuación. */
  var WHY = {
    parola_spagnola: "Es una palabra del español que se coló: en italiano se dice de otra manera.",
    doppie: "En italiano la consonante doble se pronuncia más larga y cambia el significado (nono = noveno, nonno = abuelo).",
    accento: "En italiano la tilde va solo en la vocal final cuando el acento cae ahí (città, perché, è), y distingue palabras (è = es, e = y).",
    ortografia: "Algunos sonidos se escriben distinto que en español: ch, gh, gli, gn, z, y la h de ho, hai, ha, hanno.",
    articolo: "El artículo depende del género, del número y del sonido con que empieza la palabra siguiente: il / lo / l', la / l', i / gli, le.",
    genere: "El género de muchos sustantivos no coincide con el español, y el artículo y los adjetivos lo siguen.",
    accordo: "Artículos, adjetivos y participios toman el género y el número del sustantivo, como en español, pero el plural cambia la vocal en vez de sumar -s.",
    plurale: "El plural italiano cambia la vocal final (libro → libri, casa → case) y no lleva -s; las palabras extranjeras no cambian.",
    ausiliare: "El movimiento, los cambios de estado, piacere y los reflexivos arman el pasado con essere y el participio concuerda; los demás verbos, con avere. En español todo va con «haber».",
    a_personale: "En italiano la persona que recibe la acción va sin «a»: conosco Giulia (conozco a Giulia).",
    articolo_possessivo: "El posesivo va con artículo (la mia casa), salvo con un familiar en singular (mia madre).",
    possessivo: "Los posesivos cambian con lo poseído: mio, mia, miei, mie (no «mi» como en español).",
    preposizione_articolata: "a, di, da, in, su se funden con el artículo: al, del, dal, nel, sul (como «al» y «del», pero con todas).",
    preposizione: "Las preposiciones no se traducen una a una desde el español: se aprenden con su verbo o su expresión (vado a Roma, in Italia, dal medico).",
    periodo_ipotetico: "En la condición irreal, después de se va el congiuntivo imperfetto (se avessi) y en la otra parte el condicional (verrei), como «si tuviera, vendría».",
    congiuntivo: "Después de lo que expresa opinión, deseo o duda (penso che, spero che, benché) va el congiuntivo, como el subjuntivo del español.",
    ci_ne: "c'è va con singular y ci sono con plural (el «hay» del español no cambia; el italiano sí); ci vuole / ci vogliono igual.",
    persona_verbale: "La terminación del verbo dice quién hace la acción: tiene que coincidir con el sujeto de la frase.",
    lessico: "Es una palabra italiana, pero acá no dice lo que querés decir.",
    falso_amico: "Se parece a una palabra del español pero en italiano significa otra cosa.",
    tempo_modo: "El tiempo del verbo tiene que ir con el momento que cuenta la frase y con el otro verbo.",
    pronome: "El pronombre cambia según sea directo (lo, la) o indirecto (gli, le), y dos juntos se combinan: me lo, glielo.",
    participio: "Con essere el participio concuerda con el sujeto; con avere, solo si antes va lo, la, li, le. Y muchos participios son irregulares (fatto, preso, scritto).",
    ordine: "El orden sigue casi siempre el del español; ojo con los adverbios como già y mai, que van entre el auxiliar y el participio.",
    refuso: "Parece un error de tipeo."
  };
  var META_WORDS = /^(essere|avere|stare|io|tu|lui|lei|noi|voi|loro|se|che|-s|-ito|-etto|-ino|ci sono|c'è|non … mai|dovere|farcela|cui)$/;
  function goodOf(f, tk) {
    var msg = String(f.msg || ""), bad = String(f.bad || "").toLowerCase();
    var segs = [], re = /\*([^*]+)\*/g, m;
    while ((m = re.exec(msg))) segs.push({ t: m[1], at: m.index });
    var colon = msg.lastIndexOf(":");
    var cands = segs.filter(function (x) {
      var before = msg.slice(Math.max(0, x.at - 5), x.at);
      return !/…|\//.test(x.t) && x.t.toLowerCase() !== bad && !/(^|[\s(])(no|sin) $/.test(before) && !META_WORDS.test(x.t.toLowerCase());
    });
    var after = cands.filter(function (x) { return x.at > colon; });
    var c = (after.length ? after : cands).slice(-1)[0];
    if (!c) return null;
    // only the words that replace the marked ones: drop the ones around them
    var g = c.t.replace(/\s*\?$/, "").split(/\s+/);
    var before1 = [], after1 = [];
    for (var k = f.i - 1; k >= 0 && before1.length < 3; k--) if (tk[k] && tk[k].w) before1.unshift(tk[k].w);
    for (var k2 = f.i + f.n; k2 < tk.length && after1.length < 3; k2++) if (tk[k2] && tk[k2].w) after1.push(tk[k2].w);
    while (g.length > 1 && before1.length && g[0].toLowerCase() === before1[before1.length - 1]) { g.shift(); before1.pop(); }
    while (g.length > 1 && after1.length && g[g.length - 1].toLowerCase() === after1[0]) { g.pop(); after1.shift(); }
    var out = g.join(" ");
    return out.toLowerCase() === bad ? null : out;
  }
  function enrich(f, tk) {
    var words = [];
    for (var k = f.i; k < f.i + (f.n || 1); k++) if (tk[k] && tk[k].w) words.push(tk[k].o);
    f.bad = words.join(" ").replace(/' /g, "'");
    // the «a» of the person goes away (conosco a Giulia → conosco Giulia; ai → i)
    if (f.good === undefined && f.cat === "a_personale") {
      var ap = U.prepInfo && U.prepInfo(String(f.bad).toLowerCase());
      f.good = ap && ap.art ? ap.art : /^(a|ad)$/i.test(f.bad) ? "" : undefined;
    }
    if (f.good === undefined) f.good = goodOf(f, tk);
    if (!f.why) f.why = WHY[f.cat] || null;
    if (f.why && String(f.msg).length < 60 && String(f.msg).indexOf(f.why) < 0) f.msg = f.msg + " " + f.why;
  }

  /* ------------------------------------------------ más familias de errores
     Reglas por familia de error, medidas con un corpus de textos de
     estudiantes hispanohablantes anotados a mano (tools/scrivi_corpus.json):
     castellano metido y calcos, preposiciones con lugares y con infinitivos,
     artículos por sonido, pronombres combinados, concordancias, persona del
     verbo, auxiliares y congiuntivo.  Cada regla mira una construcción, no
     una palabra suelta, y no marca nada que ya marcó otra. */

  // Palabras frecuentes del castellano rioplatense que no están en las glosas del curso.
  var ES_EXTRA = {};
  ("pesado:pesante aburrido:noioso receta:ricetta abrazo:abbraccio abrazos:abbracci besos:baci beso:bacio mudanza:trasloco plata:soldi " +
   "vergüenza:vergogna verguenza:vergogna propina:mancia relleno:ripieno casado:sposato enojado:arrabbiato cansado:stanco lindo:carino " +
   "flaco:magro gordo:grasso rubio:biondo morocho:moro colectivo:autobus subte:metro celular:cellulare computadora:computer " +
   "heladera:frigorifero pileta:piscina laburo:lavoro pibe:ragazzo chico:ragazzo chica:ragazza cumpleaños:compleanno apellido:cognome " +
   "ciudad:città pueblo:paese calle:strada esquina:angolo barrio:quartiere cuadra:isolato departamento:appartamento alquiler:affitto " +
   "vereda:marciapiede zapatos:scarpe zapatillas:scarpe remera:maglietta pollera:gonna campera:giacca anteojos:occhiali sueño:sonno " +
   "almuerzo:pranzo desayuno:colazione merienda:merenda manteca:burro huevo:uovo huevos:uova leche:latte jugo:succo queso:formaggio " +
   "jamón:prosciutto durazno:pesca frutilla:fragola azúcar:zucchero cuchara:cucchiaio cuchillo:coltello tenedor:forchetta taza:tazza " +
   "olla:pentola sartén:padella horno:forno baño:bagno cocina:cucina ventana:finestra puerta:porta techo:tetto pared:parete silla:sedia " +
   "mesa:tavolo almohada:cuscino llave:chiave trabajo:lavoro empleo:impiego jefe:capo sueldo:stipendio oficina:ufficio reunión:riunione " +
   "mejor:meglio peor:peggio siempre:sempre nunca:mai todavía:ancora ahora:adesso mañana:domani ayer:ieri hoy:oggi también:anche " +
   "cariñoso:affettuoso cariñosa:affettuosa negro:nero tinto:rosso rico:buono rica:buona lluvia:pioggia nieve:neve playa:spiaggia " +
   "fútbol:calcio futbol:calcio perro:cane perros:cani hermano:fratello hermana:sorella hijo:figlio hija:figlia abuela:nonna abuelo:nonno " +
   "blando:morbido alojamiento:alloggio peaton:pedone peatones:pedoni peatoni:pedoni autopista:autostrada medialuna:cornetto medialunas:cornetti " +
   "facturas:paste frutilla:fragola frutillas:fragole hermanas:sorelle hermanos:fratelli inmigrante:immigrato inmigrantes:immigrati inmigranti:immigrati " +
   "primos:cugini primas:cugine novio:fidanzato novia:fidanzata amigo:amico amiga:amica gente:gente plata:soldi guita:soldi auto:auto").split(" ").forEach(function (x) {
    var p = x.split(":"); if (p[0] !== p[1]) ES_EXTRA[p[0]] = p[1];
  });
  // Verbos castellanos con terminación italiana: manejare, pintare, ho lograto, ganassi.
  var ES_VERB = { manejar: "guidare", pintar: "dipingere", regar: "annaffiare", lograr: "riuscire", ganar: "vincere / guadagnare",
                  mirar: "guardare", hablar: "parlare", llamar: "chiamare", llegar: "arrivare", llevar: "portare", buscar: "cercare",
                  encontrar: "trovare", olvidar: "dimenticare", empezar: "cominciare", querer: "volere", necesitar: "avere bisogno di",
                  ayudar: "aiutare", esperar: "aspettare / sperare", escuchar: "ascoltare", tomar: "prendere", bajar: "scendere",
                  subir: "salire", volver: "tornare", dejar: "lasciare", elegir: "scegliere", escribir: "scrivere", leer: "leggere",
                  caminar: "camminare", cocinar: "cucinare", limpiar: "pulire", gastar: "spendere", ahorrar: "risparmiare",
                  pedir: "chiedere", preguntar: "chiedere", alquilar: "affittare", laburar: "lavorare", enojar: "arrabbiare",
                  casar: "sposare", aburrir: "annoiare", manejando: "guidare", disfrutar: "godersi", extrañar: "sentire la mancanza",
                  quedar: "restare", pasear: "passeggiare", charlar: "chiacchierare", arreglar: "aggiustare / riparare", mudar: "traslocare",
                  bailar: "ballare", duchar: "farsi la doccia", comer: "mangiare", cambiar: "cambiare",
                  viajar: "viaggiare", trabajar: "lavorare", estudiar: "studiare", jugar: "giocare", salir: "uscire" };
  var ES_STRONG = { de: "di / da", el: "il", los: "i / gli", las: "le", y: "e", muy: "molto", que: "che", porque: "perché",
                    cuando: "quando", donde: "dove", pero: "però", como: "come", es: "è", está: "è / sta",
                    estoy: "sto", soy: "sono", hay: "c'è / ci sono", también: "anche", más: "più", entonces: "allora" };
  // Préstamos que el italiano usa tal cual (comida, cultura).
  var LOANS = "empanada empanadas mate asado tango tanghi alfajor alfajores gaucho gauchos milonga locro chimichurri tapas paella tortilla " +
              "dulce leche churros choripán fernet malbec telenovela telenovelas bandoneón bandoneon milanesa milanese parrilla cumbia murga " +
              "pampa pampas yerba quincho provoleta carro carri";
  learn([LOANS]);

  // Transformaciones castellano → italiano en una palabra desconocida.
  var ES_TR = [[/ct/g, "tt", 1], [/pt/g, "tt", 1], [/ns/g, "s", 1], [/x/g, "ss", 1], [/ñ/g, "gn", 1], [/j/g, "g", 1], [/j/g, "gi", 1],
               [/^es(?=[cpqtm])/, "s", 1], [/ie/g, "e", 1], [/ie/g, "i", 1], [/ue/g, "o", 1], [/ado$/, "ato", 1], [/ada$/, "ata", 1],
               [/ados$/, "ati", 1], [/adas$/, "ate", 1], [/ido$/, "ito", 1], [/ida$/, "ita", 1], [/cc(?=i)/g, "z", 1], [/ci(?=on)/g, "zi", 1],
               [/ción$/, "zione", 1], [/sión$/, "sione", 1], [/dad$/, "tà", 1], [/ble$/, "bile", 1], [/qu(?=[ei])/g, "ch", 1],
               [/^(vent|trent|quarant|cinquant|sessant|settant|ottant|novant)[ia](uno|otto)$/, "$1$2", 0],
               [/k(?=[ei])/g, "ch", 0], [/k/g, "c", 0], [/ph/g, "f", 0], [/th/g, "t", 0], [/y/g, "i", 0],
               [/([lr])emente$/, "$1mente", 0], [/(un|do|tre|quattor|quin|se)dice$/, "$1dici", 0], [/([cg])([ei])$/, "$1h$2", 0], [/([cg])h([ie])$/, "$1$2", 0],
               [/sch([ei])$/, "sc$1", 0], [/cie/g, "ce", 0], [/eno$/, "ono", 0], [/nm/g, "mm", 1], [/^ri(?=st)/, "re", 0], [/^re(?=st)/, "ri", 0]];
  function esTransform(w) {
    var tried = {};
    var one = function (x, k) { var r = ES_TR[k], y = x.replace(r[0], r[1]); return y !== x ? y : null; };
    for (var a = 0; a < ES_TR.length; a++) {
      var c1 = one(w, a);
      if (!c1) continue;
      if (known(c1) || menteOK(c1) || partStrict(c1)) return { it: c1, es: !!ES_TR[a][2] };
      tried[c1] = a;
    }
    for (var x in tried) for (var b = 0; b < ES_TR.length; b++) {
      if (b === tried[x]) continue;
      var c2 = one(x, b);
      if (c2 && (known(c2) || menteOK(c2) || partStrict(c2))) return { it: c2, es: !!(ES_TR[tried[x]][2] || ES_TR[b][2]) };
    }
    return null;
  }
  function esLookup(w) {
    var cands = [w, w.replace(/a$/, "o"), w.replace(/as$/, "o"), w.replace(/os$/, "o"), w.replace(/es$/, ""), w.replace(/s$/, "")];
    for (var k = 0; k < cands.length; k++) if (ES_EXTRA[cands[k]]) return ES_EXTRA[cands[k]];
    var m = /^(.+?)(are|ato|ata|ati|ate|ando|assi|asse|assero|avo|ava|avano|ere|ire|ito|ita|uto|arò|arai|arà|aremo|arete|aranno|arei|aresti|arebbe|aremmo|arebbero|erò|erai|erà|eremo|erete|eranno|erei|erebbe|iamo|ano|ono|o|i|a)$/.exec(w);
    if (m && (m[2].length > 1 || m[1].length >= 4)) for (var e = 0; e < 3; e++) { var inf = m[1] + ["ar", "er", "ir"][e]; if (ES_VERB[inf]) return ES_VERB[inf]; }
    return null;
  }
  // Futuro y condicional mal armados: andarò, mangiaremo, comprarei, vederò.
  var FUT_END = ["ò", "ai", "à", "emo", "ete", "anno"], COND_END = ["ei", "esti", "ebbe", "emmo", "este", "ebbero"];
  function conjSafe(lemma, tense) {
    var C = Conj && Conj.VERBS;
    if (!C) return null;
    var tmp = false;
    if (!C[lemma] && C[lemma.replace(/e$/, "si")]) lemma = lemma.replace(/e$/, "si");
    if (!C[lemma]) {
      if (!known(lemma) || !/(are|ere)$/.test(lemma)) return null;
      C[lemma] = { es: "", aux: "avere" }; tmp = true;
    }
    try { return Conj.conjugate(lemma, tense).map(function (f) { return f.split(" ").pop(); }); }
    catch (e) { return null; }
    finally { if (tmp) delete C[lemma]; }
  }
  function futureFix(w) {
    var m = /^(.+?)([aei])r(ò|ai|à|emo|ete|anno|ei|esti|ebbe|emmo|este|ebbero)$/.exec(w);
    if (!m) return null;
    var cond = COND_END.indexOf(m[3]) >= 0, p = (cond ? COND_END : FUT_END).indexOf(m[3]);
    if (p < 0) return null;
    var lemmas = [m[1] + "are", m[1] + "ere", m[1] + "ire", m[1] + "rre"];
    for (var k = 0; k < lemmas.length; k++) {
      var forms = conjSafe(lemmas[k], cond ? "condizionale" : "futuro");
      if (forms && forms[p] && forms[p] !== w) return forms[p];
    }
    return null;
  }
  // An infinitive the course or the conjugator knows (with clitics too: farlo).
  function infStrict(w) {
    var k = function (x) { return known(x) || !!(U.isInfinitive && U.isInfinitive(x)) || !!(Conj && Conj.VERBS && Conj.VERBS[x]); };
    if (k(w)) return true;
    var m = /^(.+?[aei]r)(mi|ti|si|ci|vi|lo|la|li|le|ne|gli|sene|mene|tene|cela|glielo|gliela|glieli|gliele|melo|mela|telo|tela)$/.exec(w || "");
    return !!(m && k(m[1] + "e"));
  }
  function partStrict(w) {
    if (PP(w)) return true;
    var m = /^(.+)(at|ut|it)[oaie]$/.exec(w);
    if (!m || DATA.nouns[w] || DATA.nounsByPlural[w]) return false;
    var inf = m[1] + { at: "are", ut: "ere", it: "ire" }[m[2]];
    return known(inf) || !!(U.isInfinitive && U.isInfinitive(inf)) || !!(Conj && Conj.VERBS && Conj.VERBS[inf]);
  }

  var CITIES = /^(roma|milano|napoli|torino|firenze|venezia|bologna|genova|palermo|bari|verona|padova|pisa|siena|trieste|parma|modena|catania|cagliari|perugia|lecce|bergamo|brescia|rimini|ravenna|trento|bolzano|salerno|sorrento|amalfi|assisi|lucca|mantova|ferrara|urbino|matera|taormina|montevideo|rosario|mendoza|córdoba|cordoba|tigre|ushuaia|bariloche|salta|madrid|barcellona|parigi|londra|berlino|lisbona|vienna|praga|atene|bruxelles|amsterdam|mosca|dublino|varsavia|budapest|ginevra|zurigo|tokyo|pechino|lima|bogotá|caracas|miami|chicago|boston|toronto|buenos|new|san|bahía|bahia|mar|tucumán|tucuman|neuquén|neuquen|paraná|parana|posadas|jujuy|viedma|trelew|quito|cusco|asunción|valparaíso|medellín|cartagena|guadalajara|siviglia|valencia|marsiglia|nizza|lione|monaco)$/;
  var COUNTRY = { italia: "f", argentina: "f", spagna: "f", francia: "f", germania: "f", inghilterra: "f", grecia: "f", svizzera: "f",
                  austria: "f", olanda: "f", irlanda: "f", scozia: "f", svezia: "f", norvegia: "f", russia: "f", cina: "f", india: "f",
                  australia: "f", colombia: "f", bolivia: "f", europa: "f", america: "f", asia: "f", africa: "f", patagonia: "f",
                  toscana: "f", sicilia: "f", sardegna: "f", puglia: "f", calabria: "f", campania: "f", lombardia: "f", liguria: "f",
                  umbria: "f", basilicata: "f", lazio: "m", piemonte: "m", veneto: "m", molise: "m", trentino: "m", friuli: "m",
                  abruzzo: "m", brasile: "m", cile: "m", "perù": "m", paraguay: "m", uruguay: "m", messico: "m", canada: "m",
                  giappone: "m", portogallo: "m", belgio: "m", marocco: "m", egitto: "m", ecuador: "m", venezuela: "m", stati: "mp" };
  var IN_PLACES = /^(banca|montagna|ufficio|farmacia|biblioteca|lavanderia|cucina|piscina|palestra|pizzeria|libreria|chiesa|campagna|macelleria|panetteria|salumeria|gelateria|discoteca|città|vacanza|periferia|profumeria|tabaccheria|questura)$/;
  var PLACES = /^(ristorante|bar|supermercato|mercato|negozio|cinema|teatro|museo|albergo|hotel|ospedale|parco|aeroporto|stazione|trattoria|osteria|agenzia|ufficio|banca|farmacia|biblioteca|lavanderia|piscina|palestra|pizzeria|libreria|chiesa|macelleria|panetteria|gelateria|discoteca|azienda|fabbrica|negozio)$/;
  var DA_PERSONS = /^(medico|dottore|dottoressa|dentista|meccanico|parrucchiere|parrucchiera|barbiere|avvocato|avvocata|veterinario|idraulico|commercialista|elettricista|estetista|macellaio|fornaio|panettiere|fruttivendolo|oculista|pediatra|notaio|sarto|calzolaio|psicologo|psicologa|fisioterapista)$/;
  var FAMILY = /^(madre|padre|fratello|sorella|moglie|marito|figlio|figlia|nonno|nonna|zio|zia|cugino|cugina|mamma|papà|suocero|suocera|nipote|cognato|cognata|fidanzato|fidanzata|amico|amica|ragazzo|ragazza|genitori|nonni|zii|cugini|amici)$/;
  var PERSON_N = /^(ragazzo|ragazza|ragazzi|ragazze|uomo|uomini|donna|donne|bambino|bambina|bambini|bambine|amico|amica|amici|amiche|persona|persone|gente|signore|signora|signori|professore|professoressa|collega|colleghi|vicino|vicina|vicini|turisti|turista|clienti|cliente|studenti|studente|cane|gatto|cani|gatti|parenti|genitori|figli|nonni)$/;
  var A_VERBS = /^(cominciare|iniziare|imparare|continuare|aiutare|riuscire|insegnare|abituare|abituarsi|prepararsi|mettersi|provare|andare|venire|tornare|invitare|obbligare|costringere|rinunciare|convincere)$/;
  var DI_VERBS = /^(finire|decidere|cercare|smettere|sperare|dimenticare|ricordare|ricordarsi|promettere|evitare|tentare|sognare|temere|fingere|accettare|rifiutare|minacciare|pensare|credere|dire|chiedere|permettere|ordinare)$/;
  var DI_STRICT = /^(finire|decidere|cercare|smettere|sperare|dimenticare|promettere|evitare|tentare|sognare|accettare|rifiutare)$/;
  var DI_NOUNS = /^(bisogno|voglia|intenzione|paura|occasione|possibilità|diritto)$/;
  var ZERO_VERBS = /^(volere|potere|dovere|bisognare|piacere)$/;
  var IMPERS_ADJ = /^(difficile|facile|importante|necessario|possibile|impossibile|bello|utile|inutile|meglio|vietato|pericoloso|giusto|normale|strano|interessante|fondamentale|essenziale)$/;
  var NUMW = /^(due|tre|quattro|cinque|sei|sette|otto|nove|dieci|undici|dodici|tredici|quattordici|quindici|venti|trenta|cento|\d+)$/;
  var HOURW = /^(una|due|tre|quattro|cinque|sei|sette|otto|nove|dieci|undici|dodici|mezzogiorno|mezzanotte|\d{1,2})$/;
  var PL_DET = /^(i|gli|le|questi|queste|quei|quegli|quelle|molti|molte|tanti|tante|alcuni|alcune|pochi|poche|diversi|diverse|parecchi|parecchie|troppi|troppe|miei|mie|tuoi|tue|suoi|sue|nostri|nostre|vostri|vostre|due|tre|quattro|cinque|sei|sette|otto|nove|dieci|dei|degli|delle)$/;
  var CLITIC = /^(mi|ti|ci|vi|si|lo|la|li|le|gli|ne|me|te|ce|ve|se|l'|glielo|gliela|glieli|gliele|gliene|m'|t'|c'|v'|s')$/;
  var SKIP_V = /^(non|mi|ti|ci|vi|si|lo|la|li|le|gli|ne|me|te|ce|ve|se|l'|glielo|gliela|glieli|gliele|gliene|già|mai|sempre|ancora|anche|spesso|poi|proprio|davvero|solo|soltanto|forse|pure|m'|t'|c'|v'|s')$/;
  var ADV_SKIP = /^(non|già|mai|sempre|ancora|anche|più|spesso|poi|proprio|davvero|solo|soltanto|subito|molto|tanto|forse|pure|quasi|appena)$/;
  var PREPS = /^(a|ad|di|da|in|con|su|per|tra|fra|senza|verso|come|anche|pure|neanche|nemmeno|quanto|più|meno|dopo|prima|contro|secondo|tranne|oltre|dietro|sopra|sotto)$/;
  var REFLEXIVE_L = /^(chiamare|svegliare|alzare|lavare|vestire|sentire|trovare|trasferire|preparare|divertire|annoiare|riposare|sedere|fermare|sposare|laureare|iscrivere|arrabbiare|preoccupare|ricordare|innamorare|abituare|occupare|addormentare|pettinare|truccare|radere|trovare|chiedere|domandare|rilassare|muovere|perdere|trasferirsi|chiamarsi|svegliarsi|alzarsi|sentirsi|trovarsi)$/;
  var IMPV_WORDS = /^(scusi|scusa|senti|senta|guarda|guardi|dai|tieni|tenga|aspetta|aspetti|ascolta|ascolti|dimmi|mi|figurati|prego|pensa|immagina|vieni|vai|stai|hai|sai)$/;
  // Nouns whose gender changes the meaning (il moto / la moto) or with an
  // irregular plural of the other gender (l'orecchio → le orecchie).
  var AMBI_GENDER = /^(fine|presente|metro|capitale|fronte|carcere|eco|fronte|radice|moto|orecchie|braccia|dita|ginocchia|labbra|ciglia|lenzuola|mura|ossa|uova|paia|centinaia|migliaia)$/;
  var INTR_AVERE = /^(dormire|lavorare|camminare|viaggiare|telefonare|nuotare|ridere|piangere|cenare|pranzare|giocare|passeggiare|sciare|ballare|litigare|chiacchierare|sorridere|russare)$/;
  var AV2ES = { avevo: "ero", avevi: "eri", aveva: "era", avevamo: "eravamo", avevate: "eravate", avevano: "erano", "avrò": "sarò",
                avrai: "sarai", "avrà": "sarà", avremo: "saremo", avrete: "sarete", avranno: "saranno", avrei: "sarei", avresti: "saresti",
                avrebbe: "sarebbe", avremmo: "saremmo", avreste: "sareste", avrebbero: "sarebbero", abbia: "sia", abbiano: "siano",
                avessi: "fossi", avesse: "fosse", avessimo: "fossimo", aveste: "foste", avessero: "fossero", avere: "essere", aver: "esser",
                avendo: "essendo" };
  // Common gender: the article tells the sex (il / la collega), and so do
  // all the nouns in -ista (il / la regista, il / la farmacista).
  var COMMON_G = /^([a-z]+ist[ai]|ospite|ospiti|consorte|erede|coniuge|nipoti|collega|colleghi|colleghe|cantante|cantanti|insegnante|insegnanti|giornalista|giornalisti|giornaliste|turista|turisti|turiste|artista|artisti|artiste|pianista|dentista|cliente|clienti|parente|parenti|abitante|abitanti|paziente|pazienti|agente|agenti|musicista|musicisti|atleta|atleti|atlete|interprete|interpreti|custode|preside|giovane|giovani|utente|utenti|docente|docenti|testimone|testimoni|nipote|presidente|presidenti|rappresentante|rappresentanti|concorrente|concorrenti|dirigente|dirigenti|assistente|assistenti|residente|residenti|manifestante|manifestanti|partecipante|partecipanti)$/;
  var TIME_N = /^(sera|mattina|pomeriggio|notte|giorno|giorni|anno|anni|mese|mesi|settimana|settimane|domenica|lunedì|martedì|mercoledì|giovedì|venerdì|sabato|estate|inverno|primavera|autunno|volta|volte|fine|weekend|mattino|ora|ore|momento|tempo|secolo|periodo|scorso|prossimo|giornata|serata|stagione|vacanze|dopo)$/;
  var AV_PERSON = { avevo: "0", avevi: "1", aveva: "2", avevamo: "3", avevate: "4", avevano: "5", "avrò": "0", avrai: "1", "avrà": "2",
                    avremo: "3", avrete: "4", avranno: "5", avrei: "0", avresti: "1", avrebbe: "2", avremmo: "3", avreste: "4", avrebbero: "5",
                    abbia: "012", abbiano: "5", avessi: "01", avesse: "2", avessimo: "3", aveste: "4", avessero: "5" };
  var PRES_TRIG = /^(penso|pensi|pensa|pensiamo|pensate|pensano|credo|credi|crede|crediamo|credono|spero|speri|spera|speriamo|sperano|voglio|vuoi|vuole|vogliamo|volete|vogliono|dubito|dubiti|dubita|immagino|temo|sembra|pare|bisogna|occorre|importante|possibile|probabile|meglio|peccato|necessario|preferisco|preferisce|desidero|suppongo|impossibile|giusto|normale|naturale|strano|sufficiente|basta)$/;
  var PAST_TRIG = /^(pensavo|pensava|pensavamo|pensavano|credevo|credeva|credevano|speravo|sperava|speravano|volevo|voleva|volevano|dubitavo|immaginavo|temevo|sembrava|pareva|bisognava|occorreva|pensato|creduto|sperato|voluto|vorrei|vorresti|vorrebbe|vorremmo|vorrebbero|preferirei|preferivo|desideravo|piacerebbe|sarebbe)$/;
  var CONJ_TRIG = /^(benché|sebbene|affinché|purché|nonostante|qualora|malgrado)$/;
  var CONJ_TRIG2 = { prima: "che", senza: "che", meno: "che", patto: "che", modo: "che" };
  var DET_F = { questo: "ms", questa: "fs", questi: "mp", queste: "fp", nessun: "ms", nessuno: "ms", nessuna: "fs", molti: "mp", molte: "fp",
                tanti: "mp", tante: "fp", pochi: "mp", poche: "fp", alcuni: "mp", alcune: "fp", troppi: "mp", troppe: "fp", quella: "fs",
                quelle: "fp", quei: "mp", quegli: "mp", quel: "ms", quanto: "ms", quanta: "fs", quanti: "mp", quante: "fp", mezzo: "ms", mezza: "fs" };
  var DET_FORMS = { quest: ["questo", "questa", "questi", "queste"], nessun: ["nessun", "nessuna", null, null], molt: ["molto", "molta", "molti", "molte"],
                    tant: ["tanto", "tanta", "tanti", "tante"], poc: ["poco", "poca", "pochi", "poche"], alcun: [null, null, "alcuni", "alcune"],
                    tropp: ["troppo", "troppa", "troppi", "troppe"], quel: ["quel", "quella", "quei", "quelle"], quant: ["quanto", "quanta", "quanti", "quante"],
                    mezz: ["mezzo", "mezza", null, null] };
  var POSS_FORMS = { mi: ["mio", "mia", "miei", "mie"], tu: ["tuo", "tua", "tuoi", "tue"], su: ["suo", "sua", "suoi", "sue"],
                     nostr: ["nostro", "nostra", "nostri", "nostre"], vostr: ["vostro", "vostra", "vostri", "vostre"] };
  function possKey(w) { return /^(mio|mia|miei|mie)$/.test(w) ? "mi" : /^(tuo|tua|tuoi|tue)$/.test(w) ? "tu" : /^(suo|sua|suoi|sue)$/.test(w) ? "su" : /^nostr/.test(w) ? "nostr" : /^vostr/.test(w) ? "vostr" : null; }
  var GN_IX = { ms: 0, fs: 1, mp: 2, fp: 3 };
  // Gender and number of a noun, when the lexicon knows it: {g, n} (n null if invariable).
  function nounGN(w) {
    var s = DATA.nouns[w], p = DATA.nounsByPlural[w];
    if (s && p && s.s === w && p.pl === w) return s.s === s.pl ? { g: s.g, n: null } : null;
    if (s && s.s === w) return { g: s.g, n: s.s === s.pl ? null : "s" };
    if (p && p.pl === w) { var g = p.g; if (/a$/.test(w) && /o$/.test(p.s)) g = "f"; return { g: g, n: "p" }; }
    var sa = DATA.nouns[w.replace(/e$/, "a")], so = DATA.nouns[w.replace(/i$/, "o")];
    if (/e$/.test(w) && sa && sa.g === "f" && !sa.pl) return { g: "f", n: "p" };
    if (/i$/.test(w) && so && so.g === "m" && !so.pl) return { g: "m", n: "p" };
    return null;
  }
  function adjForm(lemma, gn) {
    if (!lemma) return null;
    var st = lemma.replace(/[oe]$/, ""), hard = /[cg]o$/.test(lemma);
    var out = /o$/.test(lemma) ? [lemma, st + "a", st + (hard ? "hi" : "i"), st + (hard ? "he" : "e")] :
              /e$/.test(lemma) ? [lemma, lemma, st + "i", st + "i"] : [lemma, lemma, lemma, lemma];
    var f = out[GN_IX[gn]];
    if (hard && DATA.adj[f] !== lemma) f = f.replace(/h([ie])$/, "$1");   // simpatici, amici
    return DATA.adj[f] === lemma ? f : null;
  }
  function sndArt(art, word, fem) {
    if (!word || /^[hwyxjk]|^i[aeiou]/.test(word)) return null;
    var s = U.soundRule(word);
    switch (art) {
      case "il": return s === "sz" ? "lo" : s === "v" ? "l'" : null;
      case "lo": return s === "v" ? "l'" : s === "c" ? "il" : null;
      case "la": return s === "v" ? "l'" : null;
      case "i": return s === "c" ? null : "gli";
      case "gli": return s === "c" ? "i" : null;
      case "un": return s === "sz" && !fem ? "uno" : s === "v" && fem ? "un'" : null;
      case "uno": return s === "sz" ? null : "un" + (fem && s === "v" ? "'" : "");
      case "una": return s === "v" ? "un'" : null;
    }
    return null;
  }
  function feminine(w) {
    var gn = nounGN(w);
    if (gn) return gn.g === "f";
    if (DATA.adj[w]) return /a$/.test(w);
    return /a$/.test(w) && !/(ma|ista|ga)$/.test(w);
  }

  function lint2(tk, week, out, isIo) {
    var it = function (s) { return "*" + s + "*"; };
    var W = function (k) { return tk[k] && tk[k].w || ""; };
    var taken = function (a, n) { return out.some(function (f) { return a < f.i + f.n && f.i < a + (n || 1); }); };
    var push = function (i, n, cat, msg, soft) {
      if (taken(i, n)) return null;
      var f = { i: i, n: n || 1, cat: cat, msg: msg, soft: !!soft };
      out.push(f);
      return f;
    };
    var lem = function (w) { return V(w).map(function (v) { return v.lemma; }); };
    var hasLem = function (w, re) { return lem(w).some(function (l) { return re.test(l); }) || (PP(w) && re.test(PP(w))); };
    var nextW = function (k, skip) { for (var x = k + 1; x < tk.length && tk[x].w; x++) if (!(skip && skip.test(tk[x].w))) return x; return -1; };
    var finite = function (w) { return V(w).length > 0 && !isInf(w); };

    for (var i = 0; i < tk.length; i++) {
      var t = tk[i];
      if (!t.w) continue;
      var w = t.w, n = W(i + 1), n2 = W(i + 2), p = W(i - 1), p2 = W(i - 2);
      var cap1 = tk[i + 1] && tk[i + 1].cap;

      /* --- castellano en contexto --- */
      if (!t.cap && ES_STRONG[w] && !known(w) && w !== "come") push(i, 1, "parola_spagnola", it(w) + " es español; en italiano: " + it(ES_STRONG[w]) + ".");
      if (w === "de" && !t.cap && !(tk[i - 1] && tk[i - 1].cap && tk[i + 1] && tk[i + 1].cap) && !(p === "dulce" && n === "leche")) push(i, 1, "parola_spagnola", it("de") + " es español: en italiano " + it("di") + " (o " + it("da") + ").");
      if (w === "di" && n === "accordo") push(i, 2, "parola_spagnola", "«De acuerdo» es " + it("d'accordo") + ".");
      if (w === "dentro" && /^(di|de)$/.test(n) && (NUMW.test(n2) || /^(un|una|qualche|pochi|poche)$/.test(n2)))
        push(i, 2, "parola_spagnola", "«Dentro de» + tiempo es " + it("fra") + " o " + it("tra") + ": " + it("fra " + n2 + "…") + ".");
      if (n === "la" && n2 === "compra" && hasLem(w, /^fare$/)) push(i + 1, 2, "parola_spagnola", "«Hacer las compras» es " + it("fare la spesa") + ".");
      if (/^(molti|tanti|alcuni|pochi)$/.test(w) && n === "tempi" && !/^(morti|supplementari|moderni|antichi|lunghi|brevi|verbali)$/.test(n2)) push(i, 2, "lessico", "«Muchas veces» es " + it("molte volte") + " (" + it("tempo") + " es el tiempo).");
      if (w === "media" && /^(ora|dozzina|bottiglia|porzione|chilo|litro|pizza|giornata|pagina|mela)$/.test(n))
        push(i, 1, "parola_spagnola", "«Media» + sustantivo es " + it(n === "ora" ? "mezz'ora" : "mezza " + n) + ".");
      if (w === "media" && p === "e" && HOURW.test(p2)) push(i, 1, "parola_spagnola", "En la hora, «y media» es " + it("e mezza") + ".");
      if (w === "da" && n === "dove" && /^(sei|è|siete)$/.test(n2) && !partStrict(W(i + 3))) push(i, 1, "preposizione", "Para el origen: " + it("di dove " + n2) + "?");
      if (w === "che" && n === "se" && /^(chiesto|chiede|chiedo|chiese|chiedere|domandato|domanda|domando|chiedevo|chiedeva)$/.test(p)) push(i, 1, "parola_spagnola", "Después de " + it(p) + " va " + it("se") + " solo, sin " + it("che") + ".");
      if (w === "qual'" && n === "è") push(i, 2, "ortografia", "Se escribe " + it("qual è") + ", sin apóstrofo.");
      if (w === "quale" && n === "è") push(i, 2, "ortografia", "Se escribe " + it("qual è") + ".");
      if (w === "in" && /^1\d{3}$|^20\d\d$/.test(n)) push(i, 1, "preposizione", "Con el año va " + it("nel " + n) + ".");
      if (w === "alle" && n === "una") push(i, 2, "preposizione", "La una es singular: " + it("all'una") + ".");
      if (/^(siamo|siete|eravamo|eravate|saremo)$/.test(w) && NUMW.test(n) && (!tk[i + 2] || tk[i + 2].p || /^(a|e|in|al|alla|per|con|oggi|stasera)$/.test(n2)))
        push(i, 2, "preposizione", "Para decir cuántos son: " + it(w + " in " + n) + ".");
      if (w === "mai" && n === "non") push(i, 2, "ordine", "En italiano: " + it("non … mai") + " (" + it("non gioco mai") + ").");
      if (w === "a" && /^(me mi|te ti|lui gli|lei le|noi ci|voi vi|loro gli)$/.test(n + " " + n2)) push(i + 2, 1, "pronome", it("A " + n) + " y " + it(n2) + " dicen lo mismo: " + it("a " + n + " piace") + " o " + it(n2 + " piace") + ".");
      if (w === "più" && /^(meglio|migliore|migliori|peggio|peggiore|peggiori|maggiore|minore)$/.test(n)) push(i, 2, "lessico", it(n) + " ya es comparativo: sin " + it("più") + ".");
      if (/^(tanto|tanta|tanti|tante)$/.test(w) && DATA.adj[n] && n2 === "come") push(i, 3, "lessico", "Comparación de igualdad: " + it("tanto " + n + " quanto") + " o " + it("così " + n + " come") + ".");
      if (w === "prima" && isInfCl(n)) push(i, 2, "preposizione", "Antes de un infinitivo: " + it("prima di " + n) + ".");
      if (w === "senza" && n === "di" && isInfCl(n2)) push(i, 2, "preposizione", "Con infinitivo, " + it("senza") + " va solo: " + it("senza " + n2) + ".");
      if (w === "dopo" && n === "di" && isInfCl(n2)) push(i, 3, "tempo_modo", "«Después de» + acción: " + it("dopo aver/esser + participio") + " (" + it("dopo aver studiato") + ").");
      if (w === "invece" && isInfCl(n)) push(i, 2, "preposizione", it("invece di " + n) + ".");
      if (/^(niente|nulla|qualcosa|qualcos')$/.test(w) && /^(per|di)$/.test(n) && isInfCl(n2)) push(i + 1, 1, "preposizione", "Algo para + infinitivo: " + it(w + " da " + n2) + ".");
      if ((AVE_PRES[w] || /^(avevo|aveva|avevi|avevamo|avevano)$/.test(w)) && n === "che" && isInfCl(n2)) push(i, 3, "parola_spagnola", "«Tener que» es " + it("dovere") + ": " + it("devo " + n2) + ".");
      if (w === "no" && n && finite(n) && !isNoun(n) && !DATA.adj[n] && !/^(se|o|di|che)$/.test(p)) push(i, 1, "parola_spagnola", "Delante del verbo, la negación es " + it("non") + ".");
      if (/^(me|te)$/.test(w) && finite(n) && !CLITIC.test(n) && !PREPS.test(p) && !/^(e|o|che)$/.test(p) && !isNoun(n))
        push(i, 1, "parola_spagnola", "Delante del verbo: " + it((w === "me" ? "mi " : "ti ") + n) + ".");
      if (w === "se" && finite(n) && !isNoun(n) && !CLITIC.test(n) && (p === "non" || (tk[i - 1] && tk[i - 1].w && (isNoun(p) || /^(lui|lei|loro)$/.test(p) || (tk[i - 1].cap && !tk[i - 1].start)))) &&
          V(n).some(function (v) { return v.p === 2 || v.p === 5; }) &&
          !V(n).every(function (v) { return /congiuntivo|congImperfetto/.test(v.tense); })) push(i, 1, "parola_spagnola", "El reflexivo es " + it("si " + n) + " (" + it("se") + " es «si» condicional).");
      if (w === "lo" && n === "che") push(i, 2, "parola_spagnola", "«Lo que» es " + it("quello che") + " o " + it("ciò che") + ".");
      if (w === "lo" && p !== "per" && /^(peggio|meglio|migliore|peggiore|importante|bello|brutto|strano|difficile|facile|mejor|peor|più)$/.test(n) && !V(n).length)
        push(i, 2, "parola_spagnola", "El «lo» neutro no existe: " + it("la cosa " + (n === "peggio" ? "peggiore" : n === "meglio" ? "migliore" : n)) + " o " + it("il " + n) + ".");
      if (/^(mi|tu)$/.test(w) && isNoun(n) && !V(n).length && !DATA.adj[n] && !NUMS.test(n) && !/^(cosa|stesso|stessa|solo|sola)$/.test(n) &&
          !(n === "resi" && n2 === "conto")) {   // mi resi conto: rendersi conto, in the passato remoto
        var gnN = nounGN(n), pk0 = POSS_FORMS[w === "mi" ? "mi" : "tu"];
        push(i, 1, "possessivo", "El posesivo es " + it((gnN ? pk0[GN_IX[gnN.g + (gnN.n || "s")]] : pk0[0] + "/" + pk0[1]) + " " + n) + ".");
      }
      if (/^(tengo|tieni|tiene|teniamo|tenete|tengono|tenevo|teneva|tenevamo)$/.test(w)) {
        var tn = nextW(i, /^(un|una|uno|un'|due|tre|quattro|cinque|molti|molte|tanti|tante|tanta|tanto|molto|molta|poco|poca|il|la|i|le|dei|delle|degli|mal|di)$/);
        var obj = tn >= 0 ? tk[tn].w : "";
        if (/^(anni|fame|sete|sonno|freddo|caldo|paura|ragione|fretta|voglia|bisogno|figli|figlio|figlia|fratelli|fratello|sorella|sorelle|gatto|gatti|cane|cani|macchina|casa|tempo|problema|problemi|lezione|esame|febbre|testa|amici|lavoro|soldi)$/.test(obj) || (p === "anni" && p2 === "quanti")) {
          var vt = V(w)[0], av = vt && conjSafe("avere", vt.tense);
          push(i, 1, "parola_spagnola", "«Tener» es " + it("avere") + (av ? ": " + it(av[vt.p]) : "") + ".");
        }
      }
      if (/^(miro|miri|miriamo|mirate|mirano|miravo|mirava|miravano|mirando|mira)$/.test(w) && !(w === "mira" && (U.ARTICLES[p] || /^(di|la)$/.test(p))) &&
          (U.ARTICLES[n] || DEM.test(n) || POSS[n])) {
        var mv = V(w)[0], gv = mv && conjSafe("guardare", mv.tense);
        push(i, 1, "parola_spagnola", "«Mirar» es " + it("guardare") + (gv ? ": " + it(gv[mv.p]) : "") + ".");
      }

      /* --- preposiciones --- */
      var place = cap1 ? tk[i + 1].o + (tk[i + 2] && tk[i + 2].cap && tk[i + 2].w ? " " + tk[i + 2].o : "") : "";
      if (w === "in" && cap1 && CITIES.test(n)) push(i, 1, "preposizione", "Con ciudades va " + it("a") + ": " + it("a " + place) + ".");
      if (/^(a|ad)$/.test(w) && cap1 && COUNTRY[n]) push(i, 1, "preposizione", "Con países y regiones va " + it("in") + ": " + it((COUNTRY[n] === "mp" ? "negli " : "in ") + place) + ".");
      if (w === "da" && cap1 && COUNTRY[n] && COUNTRY[n] !== "mp") {
        var dA = COUNTRY[n] === "f" ? (/^[aeiou]/.test(n) ? "dall'" : "dalla ") : (/^[aeiou]/.test(n) ? "dall'" : "dal ");
        push(i, 1, "articolo", "Los países y regiones llevan artículo: " + it(dA + tk[i + 1].o) + ".");
      }
      if (/^(a|al|alla|all')$/.test(w) && IN_PLACES.test(n) && !/^(di|del|della|dello|dei|delle|degli|che|dove)$/.test(n2) && !DATA.adj[n2] && !tk[i + 1].cap &&
          !(w !== "a" && (n === "ufficio" || isNoun(n2))) &&
          !/^(vicino|vicina|vicini|accanto|davanti|intorno|fronte|fianco|fino|dietro|insieme|rispetto|grazie|oltre|uguale|simile|attaccato|vicinissimo)$/.test(p)) push(i, 2, "preposizione", "Con " + it(n) + " va " + it("in " + n) + ".");
      if (/^(a|ad)$/.test(w) && /^(un|una|uno|un')$/.test(n) && PLACES.test(n2) &&
          !hasLem(p, /^(assomigliare|somigliare|pensare|credere|rinunciare|partecipare|appartenere|sopravvivere|resistere|paragonare)$/) &&
          !/^(simile|uguale|vicino|davanti|fronte|grazie|rispetto|oltre|fino|insieme|accanto|intorno|dietro|più|meno)$/.test(p)) push(i, 1, "preposizione", "Con un lugar indeterminado va " + it("in " + n + " " + n2) + ".");
      if (/^(al|alla|allo|all')$/.test(w) && DA_PERSONS.test(n)) push(i, 1, "preposizione", "A la casa o consultorio de alguien: " + it((w === "alla" ? "dalla " : w === "all'" ? "dall'" : w === "allo" ? "dallo " : "dal ") + n) + ".");
      if (w === "a" && POSS[n] && FAMILY.test(n2) && hasLem(p, /^(andare|venire|tornare|passare|restare|rimanere|dormire)$/)) push(i, 1, "preposizione", "A la casa de alguien: " + it("da " + n + " " + n2) + ".");
      if (/^(vicino|accanto|intorno|davanti|lontano|lontana|lontani|lontane|fondo)$/.test(w) && /^(del|della|dello|dell'|dei|degli|delle)$/.test(n) && !U.ARTICLES[p] && !POSS[p]) {
        var toA = /^lontan/.test(w) ? "da" : "a", pi2 = U.prepInfo(n);
        var fixP = pi2 && U.contract(toA, pi2.art);
        if (fixP && !(w === "vicino" && n2 === "casa")) push(i + 1, 1, "preposizione", "Se dice " + it((w === "fondo" && p === "in" ? "in " : "") + w + " " + fixP + (fixP.slice(-1) === "'" ? "" : " ") + (tk[i + 2] && tk[i + 2].w ? tk[i + 2].o : "")) + ".");
      }
      if (/^(nel|nello)$/.test(w) && /^(primo|secondo|terzo|quarto|quinto|sesto|settimo|ottavo|ultimo)$/.test(n) && n2 === "piano") push(i, 1, "preposizione", "El piso va con " + it("al") + ": " + it("al " + n + " piano") + ".");
      if (/^(al|alla)$/.test(w) && /^(pranzo|cena|colazione)$/.test(n) && (!tk[i + 2] || tk[i + 2].p || /^(e|con|insieme|oggi|domani|stasera)$/.test(n2))) push(i, 2, "preposizione", "Con las comidas: " + it("a " + n) + ".");
      // verbo + preposición + infinitivo
      var inf1 = isInfCl(n) && !isNoun(n) ? i + 1 : (/^(a|ad|di)$/.test(n) && isInfCl(n2) ? i + 2 : -1);
      if (inf1 > 0 && (finite(w) || partStrict(w) || isInf(w)) && !U.ARTICLES[p] && !POSS[p] && !DI_NOUNS.test(w) && w !== "piacere" && !isNoun(w) &&
          !(/^(va|andava|andrebbe|vada)$/.test(w) && /^(mi|ti|gli|le|ci|vi)$/.test(p))) {
        var prep = inf1 === i + 2 ? n : "", lems = lem(w).concat(PP(w) ? [PP(w)] : []).concat(isInf(w) ? [w] : []);
        var refl = /^(mi|ti|si|ci|vi)$/.test(p) || /^(mi|ti|si|ci|vi)$/.test(p2) || /^(mi|ti|si|ci|vi)$/.test(W(i - 3)) || (partStrict(w) && (ESS_ALL[p] || (ESS_ALL[p2] && ADV_SKIP.test(p))));
        if (lems.some(function (l) { return A_VERBS.test(l); }) && prep !== "a" && prep !== "ad" && !lems.some(function (l) { return DI_VERBS.test(l) || ZERO_VERBS.test(l); }))
          push(i + 1, prep ? 1 : 1, "preposizione", "Se dice " + it(w + " a " + W(inf1)) + ".");
        else if (lems.some(function (l) { return DI_STRICT.test(l); }) && !refl && prep !== "di" && !lems.some(function (l) { return A_VERBS.test(l) || ZERO_VERBS.test(l); }))
          push(i + 1, 1, "preposizione", "Se dice " + it(w + " di " + W(inf1)) + ".");
        else if (lems.some(function (l) { return ZERO_VERBS.test(l); }) && prep && !lems.some(function (l) { return A_VERBS.test(l) || DI_VERBS.test(l); }))
          push(i + 1, 1, "preposizione", "Después de " + it(w) + " el infinitivo va directo: " + it(w + " " + W(inf1)) + ".");
      }
      if (DI_NOUNS.test(w) && (AVE_PRES[p] || /^(avevo|aveva|avrei|avere)$/.test(p) || hasLem(p, /^avere$/))) {
        if (isInfCl(n) && !isNoun(n)) push(i + 1, 1, "preposizione", "Se dice " + it(w + " di " + n) + ".");
        else if (/^(a|ad|per)$/.test(n) && isInfCl(n2) && w !== "paura") push(i + 1, 1, "preposizione", "Se dice " + it(w + " di " + n2) + ".");
      }
      if (IMPERS_ADJ.test(w) && n === "di" && isInfCl(n2) && /^(è|era|sarebbe|sarà|fu|sembra|diventa)$/.test(p)) push(i + 1, 1, "preposizione", "Después de " + it(p + " " + w) + " el infinitivo va directo: " + it(w + " " + n2) + ".");
      if (w === "bisogna" && n === "di" && isInfCl(n2)) push(i + 1, 1, "preposizione", it("bisogna") + " va sin " + it("di") + ": " + it("bisogna " + n2) + ".");
      // comparativo: più grande che Roma → di Roma
      if (/^(più|meno)$/.test(w) && DATA.adj[n] && !isNoun(n)) {
        var ck = n2 === "che" ? i + 2 : -1;
        if (ck > 0) {
          var after = W(ck + 1), ta = tk[ck + 1];
          if (ta && ta.w && (U.ARTICLES[after] || /^(me|te|lui|lei|noi|voi|loro|quello|quella|questo|questa)$/.test(after) || (ta.cap && !COUNTRY[after] && CITIES.test(after)) || (ta.cap && COUNTRY[after]) || (ta.cap && !ta.start))) {
            var art = U.ARTICLES[after] ? U.contract("di", after) : null;
            push(ck, 1, "preposizione", "En la comparación de dos cosas va " + it("di") + ": " + it(w + " " + n + " " + (art ? art + (art.slice(-1) === "'" ? "" : " ") + (tk[ck + 2] && tk[ck + 2].o || "") : "di " + ta.o)) + ".");
          }
        }
      }

      /* --- artículos por sonido y elisión --- */
      var fem1 = n ? feminine(n) : false;
      if (tk[i + 1] && tk[i + 1].w && !taken(i, 2) && !/^(e|o|a|ed|ad)$/.test(n)) {
        // «te la inoltro», «me lo mandi»: after me/te/ce/ve/se, a clitic, never an article
        var pronLike = (/^(lo|la|gli)$/.test(w) && (isVerb(n) || isInf(n) || AVE_PRES[n])) || (/^(lo|la|li|le)$/.test(w) && /^(me|te|ce|ve|se)$/.test(p));
        if (U.ARTICLES[w] && !pronLike && !(w === "gli" && !isNoun(n) && !DATA.adj[n] && known(n)) && !(w === "uno" && !isNoun(n) && !DATA.adj[n]) &&
            !(/^(uno|una)$/.test(w) && /^(di|d'|dei|degli|delle|del|dello|della|tra|fra|dai|dagli|dalle|che)$/.test(n)) &&   // uno dei, una delle: a pronoun
            !(w === "una" && !isNoun(n) && !DATA.adj[n] && known(n)) && !(w === "lo" && !isNoun(n) && !DATA.adj[n]) && !NUMS.test(n) &&
            !(/^(la|le|li|lo)$/.test(w) && (finite(n) || /(rei|resti|rebbe|remmo|reste|rebbero|ava|avano|eva|evano|iva|ivano)$/.test(n)) && !isNoun(n)) && !(w === "uno" && isPart(n) && /^(su|di|da|in|con|per|a)$/.test(n2))) {   // la escluderei, uno fatto su…
          var fa = sndArt(w, n, fem1);
          if (fa && fa !== w) push(i, 2, "articolo", "Por el sonido de " + it(n) + " va " + it(fa + (fa.slice(-1) === "'" ? "" : " ") + tk[i + 1].o) + ".");
        }
        var pi3 = U.prepInfo(w);
        if (pi3 && pi3.art && !NUMS.test(n) && (isNoun(n) || DATA.adj[n] || !known(n))) {
          var fa2 = sndArt(pi3.art, n, fem1), cf2 = fa2 && U.contract(pi3.base, fa2);
          if (cf2 && cf2 !== w) push(i, 2, "articolo", "Por el sonido de " + it(n) + " va " + it(cf2 + (cf2.slice(-1) === "'" ? "" : " ") + tk[i + 1].o) + ".");
        }
        if (/^(quello|quelli)$/.test(w) && (isNoun(n) || (!known(n) && !isVerb(n))) && !DATA.adj[n] && !/^(che|di|lì|là|chi|con|in|a|da|per)$/.test(n)) {
          var qf = { il: "quel", lo: "quello", "l'": "quell'", i: "quei", gli: "quegli" }[w === "quello" ? (U.soundRule(n) === "c" ? "il" : U.soundRule(n) === "v" ? "l'" : "lo") : (U.soundRule(n) === "c" ? "i" : "gli")];
          if (qf && qf !== w) push(i, 2, "articolo", "Delante del sustantivo: " + it(qf + (qf.slice(-1) === "'" ? "" : " ") + n) + ".");
        }
      }
      if (/^(lo|la)$/.test(w) && /^(ho|hai|ha)$/.test(n)) push(i, 2, "ortografia", "Delante de " + it(n) + " se suele apostrofar: " + it("l'" + n) + ".", true);
      if (/^(la|lo)$/.test(w) && n === "è" && /^(me|te|se|ce|ve)$/.test(p) && partStrict(n2)) push(i, 2, "ortografia", "Se apostrofa: " + it(p + " l'è " + n2) + ".");
      if (w === "glie" && /^(lo|la|li|le|ne)$/.test(n)) push(i, 2, "ortografia", "Va todo junto: " + it("glie" + n) + ".");

      /* --- pronombres combinados y relativos --- */
      if (/^(mi|ti|ci|vi|si)$/.test(w) && /^(lo|la|li|le|ne|l')$/.test(n)) push(i, 2, "pronome", "Antes de " + it(n) + ", " + it(w) + " pasa a " + it(w.charAt(0) + "e") + ": " + it(w.charAt(0) + "e " + n) + ".");
      if (/^(gli|le)$/.test(w) && /^(lo|la|li|ne)$/.test(n) && !(w === "le" && U.ARTICLES[p])) push(i, 2, "pronome", "Juntos: " + it("glie" + n) + ".");
      if (w === "gli" && n === "le" && isVerb(n2)) push(i, 2, "pronome", "Juntos: " + it("gliele") + ".");
      if (/^(lo|la|li|le)$/.test(w) && /^(mi|ti|gli|ci|vi)$/.test(n) && isVerb(n2)) push(i, 2, "pronome", "El orden es al revés: " + it(n === "gli" ? "glie" + w : n.charAt(0) + "e " + w) + ".");
      if (/^(in|di|a|da|con|per|su|tra|fra)$/.test(w) && /^(che|chi)$/.test(n) && isNoun(p) && !V(p).length && !/^(cosa|cos')$/.test(n2) && !isInf(n2) && tk[i - 1] && tk[i - 1].w && !(n === "chi" && w === "di"))
        push(i, 2, "pronome", "Después de preposición, el relativo es " + it("cui") + ": " + it(w + " cui") + ".", n === "chi");
      if (/^(lui|lei|quello|quella|quelli|quelle|tutti|persona|persone|gente)$/.test(w) && n === "chi" && finite(n2)) push(i + 1, 1, "pronome", "Relativo después de " + it(w) + ": " + it("che") + ".");

      /* --- acentos --- */
      if (w === "e" && tk[i - 1] && tk[i - 1].w && /^(chi|dove|come|cosa|quando|quanto|quale|perché|cos'|com'|dov'|qual|non|c')$/.test(p) && !/^(chi|dove|come|cosa|quando|quanto|quale|perché|non)$/.test(n) && (tk[i - 1].start || tk[i - 1].clause || /^(non|c')$/.test(p)) &&
          !(tk[i - 2] && tk[i - 2].p === "," && !/^(non|c')$/.test(p)) && !/^(quanti|quante|quanto|quanta)$/.test(W(i + 2)))
        push(i, 1, "accento", "El verbo lleva tilde: " + it(p === "c'" ? "c'è" : p + (/'$/.test(p) ? "" : " ") + "è") + ".");
      if (w === "e" && /^(perché|quando|ma|però|se|dove|mentre)$/.test(p) && !/^(chi|dove|come|cosa|quando|quanto|quale|perché|non|poi|anche)$/.test(n) &&
          (/^(lunedì|martedì|mercoledì|giovedì|venerdì|sabato|domenica|vero|tardi|presto|ora|meglio|facile|difficile)$/.test(n) || ((DATA.adj[n] || partStrict(n)) && !isNoun(n) && !V(n).length)))
        push(i, 1, "accento", "El verbo lleva tilde: " + it(p + " è " + n) + ".");
      if (w === "e" && /^(oggi|domani|ieri)$/.test(p) && tk[i - 1].start && !/^(oggi|domani|ieri|dopodomani)$/.test(n) && n) push(i, 1, "accento", "El verbo lleva tilde: " + it(p + " è") + ".");
      if (w === "li" && (!tk[i + 1] || tk[i + 1].p || /^(tutto|tutti|per|vicino|sopra|sotto|dentro|fuori|davanti|dietro|accanto|dove|quando|c')$/.test(n)) && !isVerb(n))
        push(i, 1, "accento", "El adverbio lleva tilde: " + it("lì") + ".");
      if (w === "si" && ((t.start && tk[i + 1] && /^[,!]$/.test(tk[i + 1].p || "")) || (p === "di" && (!tk[i + 1] || tk[i + 1].p))))
        push(i, 1, "accento", "La afirmación lleva tilde: " + it("sì") + ".");

      /* --- concordancia --- */
      if (/^(molta|molti|molte|tanta|tanti|tante|troppa|troppi|troppe|poca|pochi|poche)$/.test(w) && DATA.adj[n] && !isNoun(n) && !V(n).length && !isNoun(n2) && !DATA.adj[n2] && (ESS_ALL[p] || isVerb(p)))
        push(i, 1, "accordo", "Delante de un adjetivo es adverbio y no cambia: " + it(w.replace(/(hi|he|a|i|e)$/, "o") + " " + n) + ".");
      var dgn = DET_F[w];
      if (dgn) {
        var nk = i + 1, nn = W(nk);
        if (POSS[nn]) { nk++; nn = W(nk); }
        var ng = nn && !V(nn).length && !DATA.adj[nn] && !AMBI_GENDER.test(nn) ? nounGN(nn) : null;
        if (ng && dgn && ((ng.g !== dgn[0] && !COMMON_G.test(nn)) || (ng.n && ng.n !== dgn[1]))) {
          var stemD = Object.keys(DET_FORMS).filter(function (k) { return w.indexOf(k) === 0; })[0];
          var fx = stemD && DET_FORMS[stemD][GN_IX[ng.g + (ng.n || dgn[1])]];
          if (stemD === "quel" && fx) fx = fx === "quel" ? (U.soundRule(nn) === "sz" ? "quello" : U.soundRule(nn) === "v" ? "quell'" : "quel") : fx === "quei" ? (U.soundRule(nn) === "c" ? "quei" : "quegli") : fx === "quella" && U.soundRule(nn) === "v" ? "quell'" : fx;
          if (fx && fx !== w) push(i, nk - i + 1, "accordo", "Con " + it(nn) + " va " + it(fx + (fx.slice(-1) === "'" ? "" : " ") + (nk > i + 1 ? W(i + 1) + " " : "") + nn) + ".");
        }
      }
      if (U.ARTICLES[w] && U.ARTICLES[w][2] === "det" && (POSS[n] || n === "loro")) {
        var ng2 = n2 && !V(n2).length && !DATA.adj[n2] ? nounGN(n2) : null;
        if (ng2 && COMMON_G.test(n2)) ng2 = { g: U.ARTICLES[w][0] === "f" ? "f" : "m", n: ng2.n };
        if (ng2 && !AMBI_GENDER.test(n2) && !(FAMILY.test(n2) && ng2.n !== "p" && n !== "loro")) {
          var gnK = ng2.g + (ng2.n || U.ARTICLES[w][1]), sn = U.soundRule(n);
          var ea2 = { ms: sn === "c" ? "il" : sn === "sz" ? "lo" : "l'", fs: sn === "v" ? "l'" : "la", mp: sn === "c" ? "i" : "gli", fp: "le" }[gnK];
          var pf = n === "loro" ? "loro" : POSS_FORMS[possKey(n)][GN_IX[gnK]];
          if (ea2 && pf && (ea2 !== w || pf !== n)) push(i, 3, "accordo", "Con " + it(n2) + " va " + it(ea2 + (ea2.slice(-1) === "'" ? "" : " ") + pf + " " + n2) + ".");
        }
      }
      // sustantivo + adjetivo pegado
      if (isNoun(w) && (!V(w).length || U.ARTICLES[p] || DET_F[p] || NUMW.test(p)) && !DATA.adj[w] && tk[i + 1] && tk[i + 1].w && !tk[i + 1].cap && !COMMON_G.test(w) && DATA.adj[n] && !isNoun(n) && !V(n).length && !POSS[n] && !partStrict(n) &&
          !/^(blu|rosa|viola|beige|marrone|arancione|lilla|ogni|qualche|tale|pari|dispari|stesso|stessa|stessi|stesse|tutto|tutta|tutti|tutte|altro|altra|altri|altre|primo|prima|solo|piano|forte|chiaro|giusto|veloce|lento|diritto|dritto|sodo|caro|presto|tardi|meglio|peggio)$/.test(n) &&
          !(isNoun(p) && !U.ARTICLES[p] && !V(p).length) &&
          !isNoun(n2) && !(PREPS.test(p) && !/^(di|da)$/.test(p)) && !(/^(di|da)$/.test(p) && !isNoun(p2)) && !AMBI_GENDER.test(w)) {
        var gnw = nounGN(w), lemA = DATA.adj[n];
        if (gnw) {
          var okForms = (gnw.n ? [gnw.g + gnw.n] : [gnw.g + "s", gnw.g + "p"]).map(function (k) { return adjForm(lemA, k); });
          var heads = [okForms];
          if (/^(di|da)$/.test(p) && isNoun(p2) && nounGN(p2)) { var g2 = nounGN(p2); heads.push((g2.n ? [g2.g + g2.n] : [g2.g + "s", g2.g + "p"]).map(function (k) { return adjForm(lemA, k); })); }
          var good = okForms.filter(Boolean)[0];
          if (good && !heads.some(function (h) { return h.indexOf(n) >= 0; }))
            push(i + 1, 1, "accordo", "Concuerda con " + it(w) + ": " + it(w + " " + good) + ".");
        }
      }

      /* --- persona del verbo --- */
      if (/^(io|tu|noi|voi)$/.test(w) && !PREPS.test(p) && !/^(e|ed|,)$/.test(n) && !(tk[i + 1] && tk[i + 1].p) && p !== "anch'") {
        var target = { io: 0, tu: 1, noi: 3, voi: 4 }[w];
        var vk = nextW(i, SKIP_V);
        var vw = vk >= 0 ? W(vk) : "", rd = V(vw);
        var coord = /^(e|ed)$/.test(p) && (isNoun(p2) || /^(tu|lui|lei|io|noi|voi)$/.test(p2) || (tk[i - 2] && tk[i - 2].cap));
        if (rd.length && !isNoun(vw) && !DATA.adj[vw] && !rd.some(function (v) { return v.p === target || (coord && v.p === (target === 0 ? 3 : target === 1 ? 4 : target)); }) && !isInf(vw) && !partStrict(vw)) {
          var r0 = rd[0], forms = conjSafe(r0.lemma, r0.tense);
          if (forms && forms[target] && forms[target] !== vw) push(vk, 1, "persona_verbale", "Con " + it(w) + " el verbo es " + it(forms[target]) + ".");
        }
      }
      if (w === "gente" && p === "la") {
        var gk = nextW(i, /^(non|mi|ti|ci|vi|si|lo|la|li|le|gli|ne|già|mai|sempre|ancora|anche|spesso|poi)$/), gw = W(gk), gr = V(gw);
        if (gr.length && gr.every(function (v) { return v.p === 5; })) { var gf = conjSafe(gr[0].lemma, gr[0].tense); if (gf) push(gk, 1, "persona_verbale", it("La gente") + " es singular: " + it(gf[2]) + "."); }
      }
      var piac = V(w).filter(function (v) { return /^(piacere|servire|bastare|mancare|interessare|occorrere)$/.test(v.lemma); });
      if (piac.length && (piac[0].lemma === "piacere" || /^(mi|ti|gli|le|ci|vi)$/.test(p))) {
        var pk2 = nextW(i, /^(anche|molto|tanto|davvero|ancora|più|proprio|tantissimo|moltissimo|sempre|poi|solo|soltanto)$/), pw = W(pk2);
        var pl = PL_DET.test(pw) || /^\d+$/.test(pw) && +pw > 1 || (DATA.nounsByPlural[pw] && DATA.nounsByPlural[pw].s !== pw && !DATA.nouns[pw]);
        var pf2 = piac[0], forms2 = conjSafe(pf2.lemma, pf2.tense);
        if (pf2.p === 2 && pl && pk2 >= 0 && forms2 && !(pw === "le" && isVerb(W(pk2 + 1)))) push(i, 1, "persona_verbale", (pf2.lemma === "piacere" ? "Lo que gusta es plural: " : "El verbo concuerda con lo que viene después, que es plural: ") + it(forms2[5]) + ".");
        if (pf2.p === 5 && pk2 >= 0 && isInfCl(pw) && forms2) push(i, 1, "persona_verbale", "Con un infinitivo va en singular: " + it(forms2[2]) + ".");
      }
      if (p === "c'" && /^(era|sarà|sarebbe|fu|sia|fosse|è)$/.test(w)) {
        var ck2 = nextW(i, /^(anche|sempre|ancora|solo|soltanto|già|però|davvero)$/), cw = W(ck2);
        if (ck2 >= 0 && PL_DET.test(cw) && !taken(i - 1, 2))
          push(i - 1, 2, "ci_ne", "Con plural: " + it({ "è": "ci sono", era: "c'erano", "sarà": "ci saranno", sarebbe: "ci sarebbero", fu: "ci furono", sia: "ci siano", fosse: "ci fossero" }[w] + " " + cw) + ".");
      }
      if (w === "si" && tk[i + 1] && tk[i + 1].w) {
        var sr = V(n).filter(function (v) { return v.p === 2; });
        if (sr.length && (NUMW.test(n2) || /^(molti|molte|tanti|tante|alcuni|alcune|diversi|diverse|parecchi|parecchie)$/.test(n2)) &&
            !(TIME_N.test(W(i + 3)) || /^(volte|minuti|secondi|chilometri|metri|giorni|anni|ore|mesi|settimane)$/.test(W(i + 3)))) {
          var sf = conjSafe(sr[0].lemma, sr[0].tense);
          if (sf) push(i + 1, 1, "persona_verbale", "Con un objeto plural, el verbo va en plural: " + it("si " + sf[5]) + ".");
        }
      }

      /* --- auxiliares --- */
      if (AV2ES[w]) {
        var ak = nextPart(tk, i);
        if (ak > 0) {
          var al = PP(tk[ak].w);
          if (al && /rsi$/.test(al)) al = al.slice(0, -3) + "re";
          var avP = AV_PERSON[w] || "", reflA = !!avP && ((p === "mi" && avP === "0") || (p === "ti" && avP === "1") || (p === "si" && /^[25]+$/.test(avP)));
          if (reflA || (al && auxOf(al) === "essere")) push(i, ak - i + 1, "ausiliare", (reflA ? "Los reflexivos van con *essere*: " : "Con " + it(al) + " va *essere*: ") + it(AV2ES[w] + " " + tk[ak].w) + ".");
        }
      }
      if (ESS_ALL[w] && !/^(mi|ti|si|ci|vi|se|me|te|ce|ve)$/.test(p)) {
        var ek = nextPart(tk, i);
        if (ek > 0) { var el = PP(tk[ek].w); if (el && INTR_AVERE.test(el)) push(i, ek - i + 1, "ausiliare", "Con " + it(el) + " va *avere*: " + it("ho " + tk[ek].w.replace(/[aie]$/, "o")) + "."); }
      }

      /* --- a personal con más objetos --- */
      if (/^(a|ad|al|alla|allo|ai|alle|agli|all')$/.test(w) && tk[i - 1] && tk[i - 1].w) {
        var vp = i - 1;
        if (/mente$/.test(W(vp)) || /^(sempre|spesso|mai|ancora|anche|già|bene)$/.test(W(vp))) vp--;
        var vw2 = W(vp);
        var causa = isInf(vw2) && (hasLem(W(vp - 1), /^(fare|lasciare)$/) || /^(fatto|fatta|lasciato|lasciata|fare|lasciare)$/.test(W(vp - 1)));
        var isDo = !isNoun(vw2) && !causa && !(isInf(vw2) && w.length > 2) && (V(vw2).some(function (v) { return DO_VERBS.test(v.lemma) || /^(svegliare|sentire)$/.test(v.lemma); }) || (DO_VERBS.test(vw2) || /^(svegliare|sentire)$/.test(vw2))) || DO_PART.test(vw2) || /^sentit[oaie]$/.test(vw2) ||
                   /^(conoscend|vedend|aspettand|chiamand|salutand|incontrand|visitand|ascoltand|guardand|amand|trovand|accompagnand|invitand|ringraziand|aiutand|svegliand)o$/.test(vw2);
        var person = (w === "a" || w === "ad") ? (/^(nessuno|qualcuno|tutti|tutte|ognuno)$/.test(n) || (/^(un|una|uno|un'|il|la|lo|i|le|gli|l')$/.test(n) && PERSON_N.test(n2)) || (POSS[n] && (FAMILY.test(n2) || PERSON_N.test(n2))))
                                                : (PERSON_N.test(n) || FAMILY.test(n) || POSS[n] && (FAMILY.test(n2) || PERSON_N.test(n2)) || /^(miei|tuoi|suoi)$/.test(n));
        if (isDo && person && !isInfCl(n)) push(i, 1, "a_personale", "Sin «a»: el objeto directo de persona va directo" + (w.length > 2 ? " (" + it({ al: "il", alla: "la", allo: "lo", ai: "i", alle: "le", agli: "gli", "all'": "l'" }[w] + " " + n) + ")" : "") + ".");
      }

      /* --- participio --- */
      var mP = /^(.+)(ut|it|at)([oaie])$/.exec(w);
      if (mP && !known(w)) {
        var lemP = mP[1] + { ut: "ere", it: "ire", at: "are" }[mP[2]];
        if (Conj && Conj.VERBS && Conj.VERBS[lemP]) {
          var ppR = Conj.participle(lemP);
          if (ppR && ppR !== mP[1] + mP[2] + "o") push(i, 1, "participio", "El participio de " + it(lemP) + " es irregular: " + it(ppR.replace(/o$/, mP[3])) + ".");
        }
      }
      var ESS_PL = /^(siamo|siete|eravamo|eravate|erano|saremo|sarete|saranno|saremmo|sareste|sarebbero|siano|fossimo|foste|fossero)$/;
      var ESS_SG = /^(sei|è|ero|eri|era|sarò|sarai|sarà|sarei|saresti|sarebbe|sia|fossi|fosse)$/;
      if ((ESS_PL.test(w) || ESS_SG.test(w)) && !/^(ci|si)$/.test(p) || (/^(ci|vi)$/.test(p) && ESS_PL.test(w))) {
        var qk = nextPart(tk, i), qw = qk > 0 ? tk[qk].w : "";
        if (qk > 0 && /^(stati|state)$/.test(qw)) { var q2 = nextPart(tk, qk); if (q2 > 0 && /[oa]$/.test(tk[q2].w) && !/^(stato|stata)$/.test(tk[q2].w)) push(q2, 1, "participio", "Concuerda con " + it(qw) + ": " + it(tk[q2].w.replace(/o$/, "i").replace(/a$/, "e")) + "."); }
        else if (qk > 0 && PP(qw) && (auxOf(PP(qw)) === "essere" || /^(stato|stata|stati|state)$/.test(qw) || /^(ci|vi)$/.test(p))) {
          if (ESS_PL.test(w) && /[oa]$/.test(qw) && !(/^(siete|foste)$/.test(w)))
            push(qk, 1, "participio", "Con " + it(w) + " el participio va en plural: " + it(qw.replace(/o$/, "i").replace(/a$/, "e")) + ".");
          else if (ESS_SG.test(w) && /[ie]$/.test(qw) && p !== "si" && !/^(voi|loro)$/.test(p))
            push(qk, 1, "participio", "Con " + it(w) + " el participio va en singular: " + it(qw.replace(/i$/, "o").replace(/e$/, "a")) + ".");
        }
      }
      if (w === "li" && (AVE_PRES[n] || /^(avevo|aveva|avevamo|avevano|avrei|avrebbe|abbia|avessi|avesse)$/.test(n))) {
        var lk = nextPart(tk, i + 1);
        if (lk > 0 && /[oa]$/.test(tk[lk].w) && (U.ARTICLES[p] === undefined)) push(lk, 1, "participio", "Con " + it(w) + " delante, el participio concuerda: " + it(tk[lk].w.replace(/[oa]$/, w === "li" ? "i" : "e")) + ".");
      }
      if (w === "ce" && n === "l'" && /^(ho|hai|ha|abbiamo|avete|hanno)$/.test(n2) && /^fatto$/.test(W(i + 3))) push(i + 3, 1, "participio", "En " + it("farcela") + " el participio va en femenino: " + it("ce l'" + n2 + " fatta") + ".");
      if (/^(me|te|se|ce|ve)$/.test(w) && n === "la" && ESS_ALL[n2]) { var ck3 = nextPart(tk, i + 2); if (ck3 > 0 && /o$/.test(tk[ck3].w) && /^(cavat|pres|sentit|fatt)o$/.test(tk[ck3].w)) push(ck3, 1, "participio", "Con " + it(w + " la") + " el participio va en femenino: " + it(tk[ck3].w.replace(/o$/, "a")) + "."); }

      /* --- sujeto sustantivo y verbo --- */
      if ((U.ARTICLES[w] && U.ARTICLES[w][2] === "det" || /^(tutti|tutte)$/.test(w)) && (t.start || t.clause || /^(e|ma|poi|quando|perché|mentre|anche|però|se|dove)$/.test(p)) && !PREPS.test(p)) {
        var sx = i + 1;
        if (/^(tutti|tutte)$/.test(w) && U.ARTICLES[W(sx)]) sx++;
        if (POSS[W(sx)] || W(sx) === "loro") sx++;
        var sn2 = W(sx), sg2 = sn2 && !V(sn2).length && !DATA.adj[sn2] && !TIME_N.test(sn2) ? nounGN(sn2) : null;
        if (sg2 && sg2.n) {
          var vx = sx + 1;
          if (DATA.adj[W(vx)] && !V(W(vx)).length) vx++;
          var disl = false;
          while (tk[vx] && tk[vx].w && /^(non|mi|ti|ci|vi|si|lo|la|li|le|gli|ne|l'|già|sempre|ancora|anche|spesso|poi|proprio|davvero|mai)$/.test(tk[vx].w)) { if (/^(lo|la|li|le|l'|ne)$/.test(tk[vx].w)) disl = true; vx++; }
          var vr = tk[vx] && tk[vx].w ? V(tk[vx].w) : [];
          var wantP = sg2.n === "p" ? 5 : 2;
          if (vr.length && !disl && !isNoun(tk[vx].w) && !DATA.adj[tk[vx].w] && !(wantP === 2 && (p === "e" || ESS_ALL[tk[vx].w]))) {
            if (!vr.some(function (v) { return v.p === wantP || /cong/.test(v.tense); }) && vr.some(function (v) { return v.p === (wantP === 5 ? 2 : 5); })) {
              var r5 = vr.filter(function (v) { return v.p === (wantP === 5 ? 2 : 5); })[0], f5 = conjSafe(r5.lemma, r5.tense);
              if (f5 && f5[wantP]) push(vx, 1, "persona_verbale", "El sujeto (" + it(sn2) + ") es " + (wantP === 5 ? "plural" : "singular") + ": " + it(f5[wantP]) + ".");
            }
          }
        }
      }

      /* --- essere / stare --- */
      if (ESS_ALL[w] && /^(bene|male|benissimo|malissimo)$/.test(n) && !/^(che|a|da|per)$/.test(n2) && !isInfCl(n2) && w !== "è" && w !== "era" && w !== "sarebbe") {
        var sv2 = V(w)[0], stf = sv2 && conjSafe("stare", sv2.tense);
        push(i, 1, "lessico", "Para cómo estás se usa " + it("stare") + ": " + it((stf ? stf[sv2.p] : "sto") + " " + n) + ".");
      }
      if (V(w).some(function (v) { return v.lemma === "stare"; }) && !/^(stato|stata|stati|state)$/.test(w)) {
        var ax = i + 1;
        if (/^(molto|un|così|proprio|tanto|troppo|abbastanza|davvero)$/.test(W(ax))) ax += W(ax) === "un" ? 2 : 1;
        var aw2 = W(ax);
        if (aw2 && DATA.adj[aw2] && !isNoun(aw2) && !V(aw2).length && !/^(zitt|tranquill|attent|ferm|svegli|calm|comod|sedut|buon|bravo|brava|bravi|brave|fresc|allegr|in|sol|simpatic|antipatic)/.test(aw2) && !/(ando|endo)$/.test(aw2) && !/^(mi|ti|gli|le|ci|vi)$/.test(p)) {
          var sv3 = V(w).filter(function (v) { return v.lemma === "stare"; })[0], esf = conjSafe("essere", sv3.tense);
          push(i, 1, "lessico", "Con un adjetivo de estado va " + it("essere") + ": " + it((esf ? esf[sv3.p] : "sono") + " " + aw2) + ".");
        }
      }

      /* --- falsos amigos en contexto --- */
      if (hasLem(w, /^salire$/) && /^(di|da|dal|dalla|dall')$/.test(n) && /^(casa|lavoro|ufficio|scuola|palestra|università|cinema|teatro|negozio|bar|ristorante)$/.test(n2))
        push(i, 1, "falso_amico", it("Salire") + " es subir; salir de un lugar es " + it("uscire") + ".");
      if (/^(vaso|vasi)$/.test(w) && /^(d'|di)$/.test(n) && /^(acqua|vino|latte|birra|succo)$/.test(n2)) push(i, 1, "falso_amico", "El vaso para tomar es " + it(w === "vaso" ? "bicchiere" : "bicchieri") + " (" + it("vaso") + " es un florero).");
      if (hasLem(w, /^toccare$/) && (U.ARTICLES[n] ? /^(chitarra|pianoforte|piano|violino|batteria|flauto|basso|tromba|sassofono)$/.test(n2) : /^(chitarra|pianoforte|piano|violino|batteria)$/.test(n)))
        push(i, 1, "falso_amico", "Tocar un instrumento es " + it("suonare") + ".");
      if (/^(accidente|accidenti)$/.test(w) && (U.ARTICLES[p] || /^(un|l')$/.test(p))) push(i, 1, "falso_amico", "Un accidente es " + it("un incidente") + " (" + it("accidente") + " es una desgracia o un insulto).");
      if (hasLem(w, /^contestare$/) && /^(a|al|alla|ai|alle|all')$/.test(n)) push(i, 1, "falso_amico", "Contestar es " + it("rispondere") + " (" + it("contestare") + " es impugnar).");
      if (w === "attentamente" && t.start && tk[i + 1] && tk[i + 1].p === ",") push(i, 1, "falso_amico", "Para cerrar una carta: " + it("Cordiali saluti") + " (" + it("attentamente") + " es «con atención»).");
      if (w === "già" && (t.start || t.clause) && (AVE_PRES[n] || ESS_ALL[n]) && nextPart(tk, i + 1) > 0) push(i, 2, "ordine", "El adverbio va entre auxiliar y participio: " + it(n + " già " + tk[nextPart(tk, i + 1)].w) + ".", true);

      /* --- más concordancias --- */
      // sujeto simple + essere + adjetivo: le spiagge saranno bellissimi, la lavatrice era rotto
      if (ESS_ALL[w] && !/^(si|ci|mi|ti|vi)$/.test(p)) {
        var sb2 = i - 1;
        while (sb2 >= 0 && tk[sb2].w && /^(non|già|mai|ancora|sempre|anche|poi|davvero|proprio|forse)$/.test(tk[sb2].w)) sb2--;
        if (sb2 >= 0 && tk[sb2].w && DATA.adj[tk[sb2].w] && !isNoun(tk[sb2].w)) sb2--;   // le verdure fresche sono…
        var sw2 = sb2 >= 0 ? tk[sb2].w : "", det2 = sb2 > 0 ? tk[sb2 - 1].w : "";
        if (sw2 && det2 && (U.ARTICLES[det2] || POSS[det2] || DEM.test(det2)) && (tk[sb2 - 1].start || tk[sb2 - 1].clause || (sb2 > 1 && POSS[det2] && U.ARTICLES[W(sb2 - 2)] && (tk[sb2 - 2].start || tk[sb2 - 2].clause))) &&
            !tk[sb2].cap && !COMMON_G.test(sw2) && !AMBI_GENDER.test(sw2) && !TIME_N.test(sw2) &&
            !/^(metà|parte|maggioranza|maggior|resto|quarto|terzo|gruppo|numero|serie|coppia|decina|ventina|centinaio|migliaio|dozzina|totalità)$/.test(sw2)) {
          var gS = nounGN(sw2);
          if (gS && !V(sw2).length) {
            var ak2 = i + 1;
            while (tk[ak2] && tk[ak2].w && /^(molto|più|meno|così|tanto|troppo|davvero|proprio|sempre|già|ancora|abbastanza|stato|stata|stati|state)$/.test(tk[ak2].w)) ak2++;
            var aw3 = W(ak2), gn3 = gS.g + (gS.n || (/^(sono|siamo|siete|erano|saranno|sarebbero|siano|fossero)$/.test(w) ? "p" : "s"));
            if (aw3 && !isNoun(aw3) && !V(aw3).length && !POSS[aw3] && !isNoun(W(ak2 + 1)) && !/^(lontano|vicino|meglio|peggio|bene|male|presto|tardi|solo|piano|forte|giusto|pari|uguale)$/.test(aw3)) {
              var lem3 = DATA.adj[aw3], want3 = lem3 ? adjForm(lem3, gn3) : null;
              if (!lem3 && partStrict(aw3) && /^(.+)[oaie]$/.test(aw3) && /^(sono|è|era|erano|sarà|saranno|sia|siano|fosse|fossero|stato|stata)$/.test(w)) want3 = aw3.slice(0, -1) + { ms: "o", fs: "a", mp: "i", fp: "e" }[gn3];
              if (lem3 && /issim[oaie]$/.test(aw3)) want3 = aw3.slice(0, -1) + { ms: "o", fs: "a", mp: "i", fp: "e" }[gn3];
              if (want3 && want3 !== aw3 && !(/^(blu|rosa|viola|beige|marrone|arancione)$/.test(aw3)))
                push(ak2, 1, "accordo", "Concuerda con " + it(sw2) + ": " + it(want3) + ".");
            }
          }
        }
      }
      // sustantivo + molto/più + adjetivo: una persona molto simpatico
      if (isNoun(w) && !V(w).length && !DATA.adj[w] && /^(molto|più|meno|così|tanto|troppo|davvero|proprio|abbastanza)$/.test(n) && DATA.adj[n2] && !isNoun(n2) && !V(n2).length &&
          U.ARTICLES[p] && !COMMON_G.test(w) && !AMBI_GENDER.test(w) && !tk[i + 2].cap) {
        var gM = nounGN(w);
        if (gM) {
          var okM = (gM.n ? [gM.g + gM.n] : [gM.g + "s", gM.g + "p"]).map(function (k) { return adjForm(DATA.adj[n2], k); });
          var goodM = okM.filter(Boolean)[0];
          if (goodM && okM.indexOf(n2) < 0) push(i + 2, 1, "accordo", "Concuerda con " + it(w) + ": " + it(w + " " + n + " " + goodM) + ".");
        }
      }
      // una scuola nel quale → nella quale
      if (/^(quale|quali)$/.test(w) && (U.prepInfo(p) || {}).art && isNoun(p2) && !V(p2).length) {
        var gQ = nounGN(p2), pq = U.prepInfo(p);
        if (gQ && gQ.n) {
          var artQ = { ms: "il", fs: "la", mp: "i", fp: "le" }[gQ.g + gQ.n], cQ = U.contract(pq.base, artQ);
          var qq = gQ.n === "p" ? "quali" : "quale";
          if (cQ && (cQ !== p || qq !== w)) push(i - 1, 2, "accordo", "El relativo concuerda con " + it(p2) + ": " + it(cQ + " " + qq) + ".");
        }
      }
      // adjetivo delante del sustantivo: Gentile signori, bella giorno
      if (/^(gentile|gentili|caro|cara|cari|care|bello|bella|belli|belle|buono|buona|buoni|buone|nuovo|nuova|nuovi|nuove|vecchio|vecchia|vecchi|vecchie|piccolo|piccola|piccoli|piccole|grande|grandi|altro|altra|altri|altre|ultimo|ultima|ultimi|ultime|prossimo|prossima|prossimi|prossime|stesso|stessa|stessi|stesse|lungo|lunga|lunghi|lunghe|vero|vera|veri|vere)$/.test(w) &&
          (t.start || t.clause || U.ARTICLES[p] || POSS[p] || DEM.test(p)) && isNoun(n) && !V(n).length && !DATA.adj[n] && !COMMON_G.test(n) && !AMBI_GENDER.test(n) && tk[i + 1] && tk[i + 1].w && !tk[i + 1].cap) {
        var gP2 = nounGN(n), lP = DATA.adj[w];
        if (gP2 && lP && (gP2.n || /^(gentil|grand)/.test(w) === false)) {
          var okP = (gP2.n ? [gP2.g + gP2.n] : [gP2.g + "s", gP2.g + "p"]).map(function (k) { return adjForm(lP, k); });
          var goodP = okP.filter(Boolean)[0];
          if (goodP && okP.indexOf(w) < 0) push(i, 2, "accordo", "Concuerda con " + it(n) + ": " + it(goodP + " " + n) + ".");
        }
      }
      // ci vuole + plural → ci vogliono; si aggiunge le uova → si aggiungono
      if (p === "ci" && V(w).some(function (v) { return v.lemma === "volere" && v.p === 2; })) {
        var vk2 = nextW(i, /^(almeno|ancora|anche|solo|soltanto|circa|più)$/), vw3 = W(vk2);
        if (vk2 >= 0 && (PL_DET.test(vw3) || NUMW.test(vw3))) { var vv = V(w).filter(function (v) { return v.lemma === "volere"; })[0], fv2 = conjSafe("volere", vv.tense); if (fv2) push(i, 1, "persona_verbale", "Con plural: " + it("ci " + fv2[5] + " " + vw3) + "."); }
      }
      if (p === "ci" && w === "è" && /^(voluto|voluta)$/.test(n) && (PL_DET.test(n2) || NUMW.test(n2))) push(i, 2, "persona_verbale", "Con plural: " + it("ci sono volut" + (feminine(W(i + 3)) ? "e" : "i") + " " + n2) + ".");
      if (w === "si" && tk[i + 1] && tk[i + 1].w && /^(i|gli|le|dei|degli|delle)$/.test(n2)) {
        var srv = V(n).filter(function (v) { return v.p === 2 && /^(aggiungere|usare|vendere|comprare|trovare|mangiare|preparare|cucinare|tagliare|mescolare|cuocere|servire|bere|parlare|scrivere|leggere|fare|stendere|unire|lasciare|mettere_x|vedere|chiamare|festeggiare|celebrare|affittare|cercare)$/.test(v.lemma); })[0];
        var frm = srv && conjSafe(srv.lemma, srv.tense);
        if (frm) push(i + 1, 1, "persona_verbale", "Con un objeto plural, el verbo va en plural: " + it("si " + frm[5] + " " + n2) + ".");
      }
      if (/^(costa|costava|costerà|costerebbe)$/.test(w) && /^(i|gli|le|questi|queste|quei|quegli|quelle)$/.test(n)) {
        var cv = V(w)[0], cfm = cv && conjSafe("costare", cv.tense);
        if (cfm) push(i, 1, "persona_verbale", "Lo que cuesta es plural: " + it(cfm[5]) + ".");
      }

      /* --- más preposiciones, artículos y tildes --- */
      if (/^(accanto|vicino|insieme|intorno|fino|davanti|di fronte)$/.test(w) && /^(il|lo|la|l'|i|gli|le)$/.test(n) && !U.ARTICLES[p] && !POSS[p] && tk[i + 1] && tk[i + 1].w) {
        var cA = U.contract("a", n);
        if (cA) push(i, 2, "preposizione", "Se dice " + it(w + " " + cA + (cA.slice(-1) === "'" ? "" : " ") + (tk[i + 2] && tk[i + 2].w ? tk[i + 2].o : "")) + ".");
      }
      if (w === "con" && /^(bicicletta|bici|autobus|treno|macchina|auto|aereo|moto|metro|metropolitana|tram|taxi|nave|barca|pullman|traghetto)$/.test(n))
        push(i, 1, "preposizione", "Con los medios de transporte va " + it("in") + ": " + it("in " + n) + ".");
      if (/^(all'|alla)$/.test(w) && /^(altra|stessa)$/.test(n) && n2 === "parte") push(i, 1, "preposizione", "Se dice " + it("dall'" + n + " parte") + ".");
      if (/^(al|il|dal|nel)$/.test(w) && /^(mezzogiorno|mezzanotte)$/.test(n) && p !== "è") push(i, 2, "articolo", it(n) + " va sin artículo: " + it(({ al: "a ", il: "", dal: "da ", nel: "a " })[w] + n) + ".");
      if (/^(quel|nessun|buon|bel|alcun|ciascun)$/.test(w) && tk[i + 1] && tk[i + 1].w && (isNoun(n) || DATA.adj[n]) && !NUMS.test(n)) {
        var snd = U.soundRule(n), full = null;
        if (snd === "sz") full = { quel: "quello", nessun: "nessuno", buon: "buono", bel: "bello", alcun: "alcuno", ciascun: "ciascuno" }[w];
        if (snd === "v" && /^(quel|bel)$/.test(w)) full = w + "l'";
        if (full) push(i, 2, "articolo", "Por el sonido de " + it(n) + ": " + it(full + (full.slice(-1) === "'" ? "" : " ") + n) + ".");
      }
      if (w === "pò") push(i, 1, "accento", "Se escribe " + it("po'") + ", con apóstrofo (es «poco» cortado).");
      if (w === "te" && /^(il|un|del|al|nel|col)$/.test(p)) push(i, 1, "accento", "La bebida lleva tilde: " + it("tè") + ".");
      if (w === "e" && /^(questo|questa|questi|queste|ciò|quello|quella)$/.test(p) && tk[i - 1] && (tk[i - 1].start || tk[i - 1].clause) && (U.ARTICLES[n] || POSS[n] || (DATA.adj[n] && !isNoun(n))))
        push(i, 1, "accento", "El verbo lleva tilde: " + it(p + " è " + n) + ".");
      if (/^(me|te|se|ce|ve)$/.test(p2) && p === "l'" && AVE_PRES[w] && /^(pres|cavat)[oa]$/.test(n)) push(i - 1, 2, "ausiliare", "Con " + it(p2 + " l'") + " (prendersela, cavarsela) va " + it("essere") + ": " + it(p2 + " la " + ({ ho: "sono", hai: "sei", ha: "è", abbiamo: "siamo", avete: "siete", hanno: "sono" })[w] + " " + n.replace(/o$/, "a")) + " (el participio concuerda con *la*: me la sono cavata, se l'è presa).");
      if (w === "par" && p === "un") push(i, 1, "parola_spagnola", "«Un par de» es " + it("un paio di") + ".");
      if (w === "como" && !t.cap && (p === "io" || U.ARTICLES[n] || /^(un|una|la|il|le|i|della|del|dei|molto|poco)$/.test(n))) push(i, 1, "parola_spagnola", it("como") + " es español (comer): " + it("mangio") + ".");

      /* --- congiuntivo --- */
      if (week >= 24) {
        var trig = null;
        var imper = /^(pensa|pensate|immagina|immaginate|considera|guarda|senti)$/.test(p) && tk[i - 1] && (tk[i - 1].start || tk[i - 1].clause ||
          (/^(e|ma|poi|allora|quindi)$/.test(p2) && tk.slice(Math.max(0, i - 25), i).some(function (z) { return z.w && /(ate|ete|ite)(vi|ci|lo|la|li|le|ne|gli|mi)$/.test(z.w); })));
        if (w === "che" && PRES_TRIG.test(p) && !imper) trig = /^(sarebbe|era|fu|sembrava|sarebbe stato)$/.test(p2) ? (week >= 30 ? "past" : null) : "pres";
        if (w === "che" && PAST_TRIG.test(p)) trig = week >= 30 ? "past" : null;
        if (w === "che" && CONJ_TRIG2[p] && (p !== "meno" || p2 === "a")) trig = "any";
        if (CONJ_TRIG.test(w) || (w === "che" && p === "nonostante")) trig = "any";
        if (w === "se" && p === "come") trig = week >= 30 ? "past" : null;
        if (trig) {
          var sk = -1, subjP = null, sawNoun = false;
          for (var x = i + 1; x < tk.length && x <= i + 6 && tk[x].w; x++) {
            var xw = tk[x].w;
            if (/^(io|tu|lui|lei|noi|voi|loro)$/.test(xw)) { subjP = { io: 0, tu: 1, lui: 2, lei: 2, noi: 3, voi: 4, loro: 5 }[xw]; continue; }
            if (/^(tutti|tutte)$/.test(xw)) { subjP = 5; continue; }
            if (SKIP_V.test(xw) || U.ARTICLES[xw] || POSS[xw] || DEM.test(xw) || xw === "c'") continue;
            if ((isNoun(xw) && !V(xw).length) || (tk[x].cap && x > i + 1)) { sawNoun = true; var gx = nounGN(xw); if (gx && gx.n) subjP = gx.n === "p" ? 5 : 2; continue; }
            if (DATA.adj[xw] && !V(xw).length) continue;
            sk = x; break;
          }
          if (sawNoun && /^(nonostante|malgrado)$/.test(w)) sk = -1;
          var sw = W(sk), sv = V(sw);
          if (sk >= 0 && !tk[sk].cap && sv.length && !isNoun(sw) && !sv.some(function (v) { return /cong/.test(v.tense); })) {
            var pick = function (tn) { var rs = sv.filter(function (v) { return v.tense === tn; }); return rs.filter(function (v) { return v.p === subjP; })[0] || rs.filter(function (v) { return v.p === 2; })[0] || rs[0]; };
            var pres = pick("presente"), imp = pick("imperfetto");
            var want = null, fromV = null;
            if (pres && (trig === "pres" || trig === "any")) { fromV = pres; want = "congiuntivo"; }
            else if ((pres || imp) && trig === "past") { fromV = pres || imp; want = "congImperfetto"; }
            else if (imp && trig === "any") { fromV = imp; want = "congImperfetto"; }
            var cf3 = fromV && conjSafe(fromV.lemma, want);
            if (cf3 && cf3[fromV.p] && cf3[fromV.p] !== sw && !tk[sk].cap) push(sk, 1, "congiuntivo", "Después de " + it((CONJ_TRIG.test(w) ? w : p + " " + w)) + " va congiuntivo: " + it(cf3[fromV.p]) + ".");
          }
        }
      }

      lintB2(tk, i, push, it, W, finite, nextW);
    }
  }

  /* ------------------------------------------ familias de B1-C1 (C7)
     Las que el corpus mostraba casi sin marcar: ci / ne, el orden de los
     adverbios, los pronombres de un tema ya nombrado, el participio y el
     tiempo del discurso indirecto.  Cada regla pide un contexto que la
     hace segura: cero marcas en los textos corregidos, los modelos, las
     frases del curso y el texto nativo del tramo (test_scrivi.js). */
  var PERCEIVE = /^(vedere|sentire|guardare|ascoltare|osservare|notare)$/;
  var DO_STRICT = /^(chiamare|vedere|conoscere|aspettare|invitare|ringraziare|salutare|stimare|aiutare|incontrare|accompagnare|guardare|ascoltare|svegliare|amare|odiare|trovare|capire|ammirare)$/;
  var IND_ONLY = /^(telefonare|rispondere)$/;
  var IND_TOPIC = /^(telefonare|rispondere|scrivere|mandare|dire|raccontare|piacere|mancare|regalare|spiegare|chiedere|dare|portare)$/;
  var QUANT_UNIT = /^(chili|chilo|etti|etto|litri|litro|grammi|dozzina|decina|fette|fetta|bottiglie|bottiglia|pezzi|pezzo|scatole|scatola|kg)$/;
  var TIME_SPAN = /^(ore|ora|minuti|minuto|giorni|giorno|settimane|settimana|mesi|mese|anni|anno|secoli|tempo|un'ora|mezz'ora)$/;
  var PAST_SAY = /^(detto|promesso|scritto|giurato|assicurato|risposto|spiegato|annunciato|disse|promise|scrisse|rispose|sapevo|sapeva|sapevamo|pensavo|pensava|credevo|credeva|immaginavo|immaginava)$/;
  var STATIVE = /^(essere|avere|stare|sapere|volere|potere|dovere|piovere|sembrare|pensare|credere|conoscere|piacere|abitare|vivere|chiamarsi|sentirsi|trovarsi)$/;
  function lintB2(tk, i, push, it, W, finite, nextW) {
    var t = tk[i], w = t.w, n = W(i + 1), n2 = W(i + 2), p = W(i - 1), p2 = W(i - 2);
    var lemOf = function (x) { return V(x).map(function (v) { return v.lemma; }).concat(PP(x) ? [PP(x)] : []); };
    var sentEnd = function (k) { for (var x = k; x < tk.length; x++) if (tk[x].p && /[.!?]/.test(tk[x].p)) return tk[x].p; return "."; };
    var ESS_OR_AV = function (x) { return !!(AVE_PRES[x] || ESS_ALL[x] || (U.AVERE || []).indexOf(x) >= 0); };

    /* --- ci / ne --- */
    // «Compro due chili.», «ho cinque!»: a quantity with nothing after it asks for ne
    if (finite(w) && !isNoun(w) && !/^(ne|n'|ce|me|te|se|ve|ci|c')$/.test(p) && !ESS_ALL[w] &&
        (t.start || t.clause || (/^(lo|la|li|le)$/.test(p) && tk[i - 1] && (tk[i - 1].start || tk[i - 1].clause))) &&
        !tk.slice(Math.max(0, i - 3), i).some(function (z) { return z.w === "ne" || z.w === "n'"; }) &&
        lemOf(w).some(function (l) { return /^(avere|comprare|prendere|volere|mangiare|bere|leggere|vendere|usare|portare)$/.test(l); })) {
      var q = i + 1, qty = null;
      if (/^(un|una|mezzo|mezza)$/.test(W(q)) && QUANT_UNIT.test(W(q + 1))) qty = [q, q + 1];
      else if (NUMW.test(W(q)) && QUANT_UNIT.test(W(q + 1))) qty = [q, q + 1];
      else if (NUMW.test(W(q)) && W(q) !== "sei" && tk[q + 1] && tk[q + 1].p) qty = [q];
      var endQ = qty ? qty[qty.length - 1] + 1 : -1;
      if (qty && tk[endQ] && (tk[endQ].p || /^(per|al|alla|ogni|oggi|domani|stasera|anche)$/.test(W(endQ))) && W(endQ) !== "di") {
        var v0 = /^(lo|la|li|le)$/.test(p) ? i - 1 : i;
        withGood(push(v0, i - v0 + 1, "ci_ne", "Con una cantidad de algo ya nombrado va *ne*: " + it("ne " + t.o + " " + qty.map(function (k) { return tk[k].o; }).join(" ")) + " (de eso, de ellos)."), "ne " + t.o);
        return;
      }
    }
    // «ho messo settimane a trovare» → ci ho messo
    if (w === "messo" && ESS_OR_AV(p) && W(i - 2) !== "ci" && W(i - 2) !== "c'" &&
        (TIME_SPAN.test(n) || ((NUMW.test(n) || /^(un|una|qualche|molto|poco|tanto|troppo|due)$/.test(n)) && TIME_SPAN.test(n2)))) {
      withGood(push(i - 1, 2, "ci_ne", "«Tardar» un tiempo es *metterci*: " + it("ci " + p + " messo") + " (ci ho messo un'ora = tardé una hora)."), "ci " + p + " messo");
      return;
    }
    // «mi sono andato» → me ne sono andato; «andarmi» → andarmene
    if (/^(mi|ti|si)$/.test(w) && ESS_ALL[n] && /^andat[oaie]$/.test(n2)) {
      withGood(push(i, 3, "ci_ne", "«Irse» es *andarsene*: " + it(w.charAt(0) + "e ne " + n + " " + n2) + " (me ne vado = me voy)."), w.charAt(0) + "e ne " + n + " " + n2);
      return;
    }
    var am = /^andar(mi|ti|si|ci|vi)$/.exec(w);
    if (am && !/^(ne|n')$/.test(n)) {
      withGood(push(i, 1, "ci_ne", "«Irse» es *andarsene*: " + it("andar" + am[1].charAt(0) + "ene") + "."), "andar" + am[1].charAt(0) + "ene");
      return;
    }
    // «ne vado» → ci vado (ne is not «ahí»)
    if (w === "ne" && !/^(me|te|se|ce|ve)$/.test(p) && finite(n) && lemOf(n).some(function (l) { return /^(andare|venire|tornare)$/.test(l); }) &&
        !/^(andat|venut|tornat|pazz|matt)/.test(n2)) {
      withGood(push(i, 1, "ci_ne", "Para el lugar («ahí») va *ci*: " + it("ci " + n) + "; *ne* es «de eso»."), "ci");
      return;
    }
    // «l'abbiamo fatta ad arrivare» → ce l'abbiamo fatta
    if (w === "l'" && AVE_PRES[n] && n2 === "fatta" && /^(a|ad)$/.test(W(i + 3)) && p !== "ce") {
      withGood(push(i, 3, "ci_ne", "«Lograrlo» es *farcela*: " + it("ce l'" + n + " fatta") + "."), "ce l'" + n + " fatta");
      return;
    }

    /* --- orden --- */
    // «Mai vado» → non vado mai; «già ha finito» → ha già finito
    // («come mai sono…?» is «¿por qué…?», not a negation)
    if ((w === "mai" || w === "già") && (t.start || t.clause || (p && (isNoun(p) || tk[i - 1].cap || /^(io|tu|lui|lei|noi|voi|loro)$/.test(p)))) && p !== "non" && p !== "come") {
      var vk = i + 1;
      if (CLITIC.test(W(vk))) vk++;
      var vw = W(vk);
      var pk = ESS_OR_AV(vw) ? nextPart(tk, vk) : -1;
      if (w === "mai" && finite(vw) && !isNoun(vw) && !V(vw).some(function (v) { return /condizionale|cong/.test(v.tense); }) && W(i + 1) !== "più") {
        withGood(push(i, vk - i + 1, "ordine", "La negación con *mai* es *non* … *mai*: " + it("non " + (vk > i + 1 ? W(i + 1) + " " : "") + vw + (pk > 0 ? " mai " + W(pk) : " mai")) + " (no voy nunca = non vado mai)."), "non " + (vk > i + 1 ? W(i + 1) + " " : "") + vw + (pk > 0 ? "" : " mai"));
        return;
      }
      if (w === "già" && pk > 0 && vk === i + 1) {
        withGood(push(i, 2, "ordine", "*già* va entre el auxiliar y el participio: " + it(vw + " già " + W(pk)) + " (ya terminó = ha già finito)."), vw + " già");
        return;
      }
    }
    // «la più difficile cosa» → la cosa più difficile
    if (U.ARTICLES[w] && /^(più|meno)$/.test(n) && DATA.adj[n2] && !isNoun(n2) && isNoun(W(i + 3)) && !V(W(i + 3)).length) {
      withGood(push(i + 1, 3, "ordine", "En el superlativo el adjetivo va después del sustantivo: " + it(w + " " + W(i + 3) + " " + n + " " + n2) + " (la cosa más difícil)."), W(i + 3) + " " + n + " " + n2);
      return;
    }

    /* --- pronombres --- */
    // «A mi piacciono» → a me
    if (w === "a" && /^(mi|ti)$/.test(n) && finite(n2)) {
      withGood(push(i + 1, 1, "pronome", "Después de *a* va la forma larga: " + it("a " + (n === "mi" ? "me" : "te") + " " + n2) + " (o sin *a*: " + it(n + " " + n2) + ")."), n === "mi" ? "me" : "te");
      return;
    }
    // «Ascoltando lo e…» → ascoltandolo; «guardando a lui» → guardandolo
    var gerund = /(ando|endo)$/.test(w) && !isNoun(w) && [w.replace(/ando$/, "are"), w.replace(/endo$/, "ere"), w.replace(/endo$/, "ire")].some(function (x) { return x !== w && Conj && Conj.VERBS && Conj.VERBS[x]; });
    if (gerund && /^(lo|la|li|le|ne|mi|ti|ci|vi|gli)$/.test(n) && ((tk[i + 2] && tk[i + 2].p) || /^(e|ma|o|poi|per|con|ogni|sempre|bene|meglio)$/.test(n2))) {
      withGood(push(i, 2, "posizione_pronome", "Con el gerundio el pronombre va pegado al final: " + it(w + n) + " (escuchándolo)."), w + n);
      return;
    }
    if (/(ando|endo|are|ere|ire)$/.test(w) && n === "a" && /^(lui|lei|loro)$/.test(n2) && lemOf(w).concat([/(are|ere|ire)$/.test(w) ? w : ""]).some(function (l) { return DO_STRICT.test(l); })) {
      var cl = n2 === "lui" ? "lo" : n2 === "lei" ? "la" : "li";
      withGood(push(i, 3, "pronome", "Sin «a»: la persona es objeto directo y el pronombre se pega: " + it((/(are|ere|ire)$/.test(w) ? w.slice(0, -1) : w) + cl) + "."), (/(are|ere|ire)$/.test(w) ? w.slice(0, -1) : w) + cl);
      return;
    }
    // «la telefono» → le telefono; «gli chiamo» → li / lo chiamo
    if (/^(lo|la)$/.test(w) && finite(n) && !isNoun(n) && lemOf(n).some(function (l) { return IND_ONLY.test(l); }) && !U.ARTICLES[p]) {
      withGood(push(i, 1, "pronome", "Con *" + lemOf(n)[0] + "* la persona va en indirecto: " + it((w === "la" ? "le " : "gli ") + n) + " (" + (w === "la" ? "a ella" : "a él") + ")."), w === "la" ? "le" : "gli");
      return;
    }
    if (w === "la" && AVE_PRES[n] && /^rispost[oa]$/.test(n2)) {
      withGood(push(i, 1, "pronome", "Con *rispondere* la persona va en indirecto: " + it("le ho risposto") + " (le respondí)."), "le");
      return;
    }
    if (w === "gli" && !U.ARTICLES[p] && !U.prepInfo(p) && (finite(n) && lemOf(n).some(function (l) { return DO_STRICT.test(l); }) ||
        (AVE_PRES[n] && PP(n2) && DO_STRICT.test(PP(n2)))) && !isNoun(n)) {
      push(i, 1, "pronome", "*gli* es «le» (a él); con *" + (PP(n2) && AVE_PRES[n] ? PP(n2) : lemOf(n)[0]) + "* la persona es objeto directo: *lo* (a él), *la* (a ella), *li* (a ellos): " + it("li " + n) + " o " + it("lo " + n) + ".");
      return;
    }
    // «se lo compriamo», «se l'ho comprato» → glielo (the Spanish «se lo»)
    // (not the «se» of a condition: «Se l'avessi saputo, …», «Se lo fai, …»)
    var restNoComma = true;
    for (var rc = i + 1; rc < tk.length && !(tk[rc].p && /[.!?:]/.test(tk[rc].p)); rc++) if (tk[rc].p === ",") { restNoComma = false; break; }
    if (w === "se" && /^(lo|la|li|le|l')$/.test(n) && restNoComma && (!t.start || (tk[i - 1] && tk[i - 1].p === "?")) &&
        (t.start || t.clause || /^(io|e|poi|già)$/.test(p) || isNoun(p))) {
      var sv = n2, fsv = V(sv).filter(function (v) { return v.p !== 2 && v.p !== 5 && v.tense === "presente"; });
      if (fsv.length && V(sv).every(function (v) { return v.p !== 2 && v.p !== 5; }) && !/rsi$/.test(fsv[0].lemma)) {
        var gl = n === "l'" ? "gliel'" : "glie" + n;
        withGood(push(i, 2, "pronome", "El «se lo» del español (a él, a ella) en italiano es *glie-*: " + it(gl + (n === "l'" ? "" : " ") + sv) + "."), gl);
        return;
      }
    }
    // «Anna? Lo chiamo»: the pronoun of a topic already named agrees with it
    if (/^(lo|la|li|le|gli)$/.test(w) && (t.start || (p && /^(sì|no)$/.test(p) && tk[i - 1] && tk[i - 1].start)) && finite(n) && !isNoun(n)) {
      var q0 = i - 1;
      while (q0 >= 0 && !(tk[q0].p && tk[q0].p === "?")) { if (tk[q0].p && /[.!]/.test(tk[q0].p)) { q0 = -1; break; } q0--; }
      if (q0 > 0) {
        var st = q0 - 1;
        while (st > 0 && !(tk[st - 1].p && /[.!?:]/.test(tk[st - 1].p))) st--;
        var head = null, hk = st;
        while (hk < q0 && tk[hk].w && (U.ARTICLES[tk[hk].w] || POSS[tk[hk].w] || tk[hk].w === "loro")) hk++;
        if (hk < q0 && tk[hk].w) {
          var hw = tk[hk].w, gnH = isNoun(hw) ? nounGN(hw) : null;
          if (!gnH && tk[hk].cap && hk === st && (tk[hk + 1] || {}).p === "?") gnH = /a$/.test(hw) ? { g: "f", n: "s" } : /o$/.test(hw) ? { g: "m", n: "s" } : null;
          if (gnH && !gnH.n && U.ARTICLES[W(st)]) gnH.n = U.ARTICLES[W(st)][1];
          if (gnH && gnH.n && !COMMON_G.test(hw) && !AMBI_GENDER.test(hw)) {
            var ind = lemOf(n).some(function (l) { return IND_TOPIC.test(l); }) && !lemOf(n).some(function (l) { return DO_STRICT.test(l); });
            var want = ind ? (gnH.g === "f" && gnH.n === "s" ? "le" : "gli") : { ms: "lo", fs: "la", mp: "li", fp: "le" }[gnH.g + gnH.n];
            if (want && want !== w && !(ind && w === "gli" && gnH.n === "p")) {
              var _f = push(i, 1, "pronome", "El pronombre retoma " + it(tk[hk].o) + " (" + (gnH.g === "f" ? "femenino" : "masculino") + " " + (gnH.n === "p" ? "plural" : "singular") + ")" +
                (ind ? " y *" + lemOf(n)[0] + "* lleva indirecto" : "") + ": " + it(want + " " + n) + "."); if (_f) _f.good = want;
              return;
            }
          }
        }
      }
    }

    /* --- participio --- */
    // «ho leggiuto», «abbiamo vinciuto», «ho scopruto»: the irregular participle
    var mR = /^(.+?)i?(ut|it)([oaie])$/.exec(w);
    if (mR && ESS_OR_AV(p) && !known(w) && !exists(w)) {
      var base = w.replace(/(ut|it)[oaie]$/, "");
      var cands = [base + "ere", base + "ire", base.replace(/i$/, "") + "ere", base.replace(/i$/, "") + "ire", base.replace(/i$/, "") + "iere", base + "ere".replace(/^/, "")];
      for (var c = 0; c < cands.length; c++) {
        var lm = cands[c];
        if (Conj && Conj.VERBS && Conj.VERBS[lm]) {
          var real = Conj.participle(lm).replace(/o$/, mR[3]);
          if (real !== w) {
            withGood(push(i, 1, "participio", "El participio de " + it(lm) + " es irregular: " + it(real) + "."), real);
            return;
          }
        }
      }
    }
    // «le ho visto», «me le ha dato»: with lo, la, li, le before avere the participle agrees
    if (AVE_PRES[w] && /^(le|li)$/.test(p) && (/^(me|te|ce|ve|glie|se)$/.test(p2) || !U.ARTICLES[p2] && !isNoun(p2))) {
      var ppk = nextPart(tk, i);
      var direct = /^(me|te|ce|ve|glie|se)$/.test(p2) || (ppk > 0 && PP(tk[ppk].w) && DO_STRICT.test(PP(tk[ppk].w))) ||
        (ppk > 0 && /^(cantat|comprat|mangiat|lett|scritt|vist|trovat|pres|mess|fatt)o$/.test(tk[ppk].w) && /^(me|te|ce|ve|glie|se)$/.test(p2));
      if (ppk > 0 && direct && /[oa]$/.test(tk[ppk].w) && !(p === "li" && /i$/.test(tk[ppk].w))) {
        var fixPP = tk[ppk].w.replace(/[oa]$/, p === "li" ? "i" : "e");
        withGood(push(ppk, 1, "participio", "Con *" + p + "* antes de *avere*, el participio concuerda con él: " + it(fixPP) + " (le ho viste = las vi)."), fixPP);
        return;
      }
    }
    // «ce la siamo cavati» → cavata (the la of farcela, cavarsela)
    if (/^(me|te|se|ce|ve)$/.test(p2) && p === "la" && ESS_ALL[w]) {
      var ck = nextPart(tk, i);
      if (ck > 0 && /[oie]$/.test(tk[ck].w) && /^(cavat|pres|sentit|fatt)[oie]$/.test(tk[ck].w)) {
        var fixC = tk[ck].w.replace(/[oie]$/, "a");
        withGood(push(ck, 1, "participio", "Con *" + p2 + " la* el participio va en femenino: " + it(fixC) + " (concuerda con *la*)."), fixC);
        return;
      }
    }
    // «è stato cominciata»: stato and the participle agree with each other
    if (/^(stato|stata|stati|state)$/.test(w) && ESS_ALL[p] && PP(n) && /[oaie]$/.test(n) && w.slice(-1) !== n.slice(-1) && !/^(stato|stata|stati|state)$/.test(n)) {
      push(i, 2, "participio", "*" + w + "* y *" + n + "* concuerdan entre sí y con el sujeto: " + it(w.slice(0, -1) + n.slice(-1) + " " + n) + " o " + it(w + " " + n.slice(0, -1) + w.slice(-1)) + ".");
      return;
    }
    // «Preso la patente, …», «Finito le lezioni, …»: the absolute participle agrees with its noun
    if ((t.start || t.clause) && PP(w) && /[oaie]$/.test(w) && U.ARTICLES[n] && U.ARTICLES[n][2] === "det" && isNoun(n2)) {
      var gA = nounGN(n2);
      if (gA && gA.n && !COMMON_G.test(n2)) {
        var fixA = w.slice(0, -1) + { ms: "o", fs: "a", mp: "i", fp: "e" }[gA.g + gA.n];
        if (fixA !== w && tk[i + 3] && (tk[i + 3].p === "," || W(i + 3) === "e")) {
          withGood(push(i, 1, "participio", "El participio del comienzo concuerda con lo que sigue: " + it(fixA + " " + n + " " + n2) + " (una vez sacada la licencia)."), fixA);
          return;
        }
      }
    }

    /* --- tiempo y modo --- */
    // «ha detto che verrà / mi aiuterebbe» → sarebbe venuto, mi avrebbe aiutato
    var sayAfter = tk.slice(i + 1, i + 8).map(function (z) { return z.w || z.p; }).join(" ");
    if (w === "che" && PAST_SAY.test(p) && (/^(aveva|avevo|avevano|avevamo|avevi)$/.test(p2) || /^(aveva|avevo|avevano|avevamo|avevi)$/.test(W(i - 3)) ||
        /^(disse|promise|scrisse|rispose|sapevo|sapeva|sapevamo|pensavo|pensava|credevo|credeva|immaginavo|immaginava)$/.test(p) ||
        /\b(giorno dopo|l'indomani|settimana dopo|mese dopo|anno dopo)\b/.test(sayAfter))) {
      for (var x = i + 1; x < tk.length && x <= i + 5 && tk[x].w; x++) {
        var xw = tk[x].w;
        if (/^(io|tu|lui|lei|noi|voi|loro|non|mi|ti|ci|vi|si|lo|la|li|le|gli|ne|l')$/.test(xw) || U.ARTICLES[xw] || POSS[xw] || isNoun(xw) || tk[x].cap || /^(il giorno|anche|sempre|davvero|poi)$/.test(xw)) continue;
        var fv = V(xw).filter(function (v) { return v.tense === "futuro"; });
        if (fv.length && !isNoun(xw) && V(xw).every(function (v) { return v.tense === "futuro"; }) && !ESS_OR_AV(xw)) {
          var fl = fv[0].lemma.replace(/rsi$/, "re"), auxC = conjSafe(auxOf(fl) === "essere" ? "essere" : "avere", "condizionale"), ppC = null;
          try { ppC = Conj.participle(fl); } catch (e) { ppC = null; }
          if (auxC && ppC && !/^(dovere|potere|volere)$/.test(fl)) {
            var goodC = auxC[fv[0].p] + " " + ppC;
            withGood(push(x, 1, "tempo_modo", "Lo que era futuro, contado desde el pasado, va en condizionale passato: " + it(goodC) + " (dijo que vendría = ha detto che sarebbe venuto)."), goodC);
          }
        }
        break;
      }
    }
    // «dovrei aver studiato» → avrei dovuto studiare
    if (/^(dovrei|dovresti|dovrebbe|dovremmo|dovreste|dovrebbero|potrei|potresti|potrebbe)$/.test(w) && /^(aver|avere|esser|essere)$/.test(n) && PP(n2)) {
      var mod = V(w)[0], avC = conjSafe("avere", "condizionale"), ppM = mod && (mod.lemma === "dovere" ? "dovuto" : "potuto");
      var infR = PP(n2);
      if (avC && mod && infR) {
        withGood(push(i, 3, "tempo_modo", "«Debería haber…» es *avrei dovuto* + infinitivo: " + it(avC[mod.p] + " " + ppM + " " + infR) + "."), avC[mod.p] + " " + ppM + " " + infR);
        return;
      }
    }
    // «Se non cominciavo…, non avrei…» → se non avessi cominciato
    if (w === "se" && !/^(lo|la|li|le|ne|l')$/.test(n)) {
      var sk2 = nextW(i, /^(non|mi|ti|ci|vi|si|io|tu|lui|lei|noi|voi|loro)$/), sw2 = W(sk2), svi = V(sw2).filter(function (v) { return v.tense === "imperfetto"; });
      if (sk2 > 0 && svi.length && !V(sw2).some(function (v) { return /cong/.test(v.tense); })) {
        var hasCond = false, compound = false;
        for (var y = sk2 + 1; y < tk.length && y < sk2 + 16 && !(tk[y].p && /[.!?]/.test(tk[y].p)); y++) {
          var yv = V(W(y));
          if (yv.some(function (v) { return v.tense === "condizionale"; })) { hasCond = true; compound = ESS_OR_AV(W(y)) && !!PP(W(y + 1)); break; }
        }
        if (hasCond && !/^(stavo|stava|stavamo|stavano)$/.test(sw2)) {
          var sl = svi[0].lemma.replace(/rsi$/, "re"), gsc = null;
          if (compound) {
            var aux2 = conjSafe(auxOf(sl) === "essere" ? "essere" : "avere", "congImperfetto"), pp2 = null;
            try { pp2 = Conj.participle(sl); } catch (e) { pp2 = null; }
            gsc = aux2 && pp2 ? aux2[svi[0].p] + " " + pp2 : null;
          } else {
            var ci2 = conjSafe(sl, "congImperfetto");
            gsc = ci2 ? ci2[svi[0].p] : null;
          }
          if (gsc && !ESS_OR_AV(sw2) || (gsc && ESS_OR_AV(sw2) && !PP(W(sk2 + 1)))) {
            withGood(push(sk2, 1, "tempo_modo", "Con el condicional en la otra parte, la condición irreal va en congiuntivo: " + it("se " + gsc) + " (si hubiera empezado = se avessi cominciato)."), gsc);
          }
        }
      }
    }
    // «ho sentito un cane abbaiando» → abbaiare
    if (/(ando|endo)$/.test(w) && !isNoun(w) && (U.ARTICLES[W(i - 2)] || POSS[W(i - 2)]) && isNoun(p)) {
      var pv = W(i - 3), pvl = lemOf(pv).concat(PP(pv) ? [PP(pv)] : []);
      if (pvl.some(function (l) { return PERCEIVE.test(l); })) {
        var infG = w.replace(/ando$/, "are"), infE = w.replace(/endo$/, "ere"), infI = w.replace(/endo$/, "ire");
        var inf = /ando$/.test(w) ? infG : (Conj && Conj.VERBS && Conj.VERBS[infI] && !Conj.VERBS[infE]) ? infI : infE;
        withGood(push(i, 1, "tempo_modo", "Después de *vedere, sentire, guardare* va el infinitivo: " + it(p + " " + inf) + " (oí un perro ladrar = ho sentito un cane abbaiare)."), inf);
        return;
      }
    }
    // «Un giorno cadevo» → sono caduto: a single event
    if (/^(giorno|improvviso)$/.test(w) && ((p === "un" && tk[i - 1].start) || (p === "all'" && (tk[i - 1].start || tk[i - 1].clause)))) {
      var ek = i + 1;
      while (tk[ek] && (!tk[ek].w || /^(mi|ti|si|ci|vi|non|,)$/.test(tk[ek].w) || U.prepInfo(tk[ek].w) || U.ARTICLES[tk[ek].w] || isNoun(tk[ek].w) || tk[ek].p === ",") && ek < i + 6) ek++;
      var ew = W(ek), eim = V(ew).filter(function (v) { return v.tense === "imperfetto"; });
      if (eim.length && V(ew).every(function (v) { return v.tense === "imperfetto"; }) && !STATIVE.test(eim[0].lemma)) {
        var el = eim[0].lemma, refl = /^(mi|ti|si|ci|vi)$/.test(W(ek - 1)) || /rsi$/.test(el);
        el = el.replace(/rsi$/, "re");
        var auxE = conjSafe(refl || auxOf(el) === "essere" ? "essere" : "avere", "presente"), ppE = null;
        try { ppE = Conj.participle(el); } catch (e) { ppE = null; }
        if (auxE && ppE) {
          withGood(push(ek, 1, "tempo_modo", "Un hecho puntual («un día me caí») va en passato prossimo: " + it(auxE[eim[0].p] + " " + ppE) + "; el imperfetto describe o cuenta lo habitual."), auxE[eim[0].p] + " " + ppE);
        }
      }
    }
    // «va a venire» → verrà (the Spanish «ir a» + infinitive)
    if (/^(vado|vai|va|andiamo|andate|vanno)$/.test(w) && n === "a" && /^(venire|essere|stare|piovere|succedere|avere|potere|dovere|nevicare)$/.test(n2)) {
      var fF = conjSafe(n2, "futuro"), vp = V(w)[0];
      if (fF && vp) {
        withGood(push(i, 3, "tempo_modo", "El «ir a» + infinitivo del español se dice con el futuro (o el presente): " + it(fF[vp.p]) + "."), fF[vp.p]);
        return;
      }
    }
    // «non lavori troppo!» → non lavorare: the negative imperative for tu
    if (w === "non" && tk[i + 1] && tk[i + 1].w) {
      var rk = i + 1, rcl = /^(ti)$/.test(n) ? n : "";
      if (rcl) rk++;
      var rw = W(rk), rv = V(rw);
      var imperCtx = sentEnd(rk) === "!" || tk.slice(Math.max(0, i - 12), i + 12).some(function (z, k2) { return z.w === "non" && isInf(W(Math.max(0, i - 12) + k2 + 1)); });
      if (rv.length && rv.every(function (v) { return v.p === 1 && v.tense === "presente"; }) && imperCtx && !ESS_OR_AV(rw) && !/^(tu|perché|se|che|quando)$/.test(p) &&
          !tk.slice(Math.max(0, i - 4), i).some(function (z) { return z.w === "tu" || z.w === "se" || z.w === "che"; })) {
        var rl = rv[0].lemma, infN = rcl ? rl.replace(/si$/, "").replace(/e$/, "") + "ti" : rl.replace(/si$/, "e");
        if (rcl && !/rsi$/.test(rl)) infN = rl.replace(/e$/, "") + "ti";
        withGood(push(rcl ? i + 1 : rk, rcl ? 2 : 1, "tempo_modo", "Para decirle a alguien (tu) que no haga algo va *non* + infinitivo: " + it("non " + infN) + " (no trabajes = non lavorare)."), infN);
        return;
      }
    }

    /* --- persona --- */
    // «io e i miei colleghi mangiano» → mangiamo
    if (w === "io" && n === "e" && (t.start || t.clause)) {
      var zk = i + 2;
      while (zk < i + 7 && tk[zk] && tk[zk].w && (U.ARTICLES[tk[zk].w] || POSS[tk[zk].w] || isNoun(tk[zk].w) || DATA.adj[tk[zk].w] || tk[zk].cap || tk[zk].w === "loro") && !finite(tk[zk].w)) zk++;
      while (tk[zk] && /^(non|mi|ti|ci|vi|si|lo|la|li|le|ne|sempre|spesso|già|anche)$/.test(tk[zk].w || "")) zk++;
      var zw = W(zk), zv = V(zw);
      if (zk > i + 2 && zv.length && zv.every(function (v) { return v.p === 5 || v.p === 2; }) && !isNoun(zw)) {
        var zf = conjSafe(zv[0].lemma, zv[0].tense);
        if (zf && zf[3] && zf[3] !== zw) {
          withGood(push(zk, 1, "persona_verbale", "*io e…* es «nosotros»: el verbo va con *noi*: " + it(zf[3]) + "."), zf[3]);
          return;
        }
      }
    }
    // «È stato io» → sono stato io
    if (/^(è)$/.test(w) && /^(stato|stata)$/.test(n) && /^(io|tu|noi|voi)$/.test(n2)) {
      var ec = { io: "sono", tu: "sei", noi: "siamo", voi: "siete" }[n2];
      withGood(push(i, 1, "persona_verbale", "El verbo concuerda con " + it(n2) + ": " + it(ec + " " + (/^(noi|voi)$/.test(n2) ? n.replace(/[oa]$/, "i") : n) + " " + n2) + " (fui yo = sono stato io)."), ec);
      return;
    }
    // «la gente sono» → è
    if (w === "sono" && p === "gente" && p2 === "la") {
      withGood(push(i, 1, "persona_verbale", it("La gente") + " es singular: " + it("è") + "."), "è");
      return;
    }
  }

  /* ------------------------------------------------------------ revisión */

  function check(text, week) {
    var task = TASKS[week] || { min: 20, use: [] };
    var f = features(text);
    var reqs = [{ label: task.min + " palabras", n: f.words || 0, need: task.min }].concat(task.use.map(function (u) {
      return { id: u[0], label: u[2], n: f[u[0]] || 0, need: u[1] };
    }));
    reqs.forEach(function (r) { r.ok = r.n >= r.need; });
    var findings = lint(text, week);
    return { words: f.words || 0, features: f, reqs: reqs, findings: findings,
             hard: findings.filter(function (x) { return !x.soft; }).length,
             ok: reqs.every(function (r) { return r.ok; }) };
  }

  /* The text with the flagged words marked, for the result screen. */
  function markup(text, findings, esc) {
    esc = esc || function (s) { return s; };
    var tk = toks(text), marks = {};
    findings.forEach(function (f, k) { for (var j = 0; j < f.n; j++) if (tk[f.i + j] && tk[f.i + j].w) marks[f.i + j] = { k: k, soft: f.soft }; });
    var src = String(text || "").replace(/[’‘`´]/g, "'"), html = "", last = 0;
    tk.forEach(function (t, i) {
      if (!t.w || !marks[i]) return;
      html += esc(src.slice(last, t.at)) + '<mark class="' + (marks[i].soft ? "soft" : "bad") + '">' + esc(src.substr(t.at, t.len)) +
        "<sup>" + (marks[i].k + 1) + "</sup></mark>";
      last = t.at + t.len;
    });
    return html + esc(src.slice(last));
  }

  /* ------------------------------------------------------ LanguageTool
     A second opinion from the free public API of LanguageTool (no key; 20
     requests a minute, plenty for one learner).  It knows far more Italian
     than the local checker; the local findings keep their Spanish
     explanation, and what LanguageTool adds goes after them. */
  var LT_URL = "https://api.languagetool.org/v2/check";
  var LT_KIND = {
    GRAMMAR: ["grammatica", "Gramática", false], TYPOS: ["refuso", "Ortografía", false],
    CONFUSED_WORDS: ["lessico", "Palabra", false], PUNCTUATION: ["puntuazione", "Puntuación", true],
    CASING: ["maiuscole", "Mayúsculas", true], STYLE: ["stile", "Estilo", true], REDUNDANCY: ["stile", "Estilo", true],
    SEMANTICS: ["lessico", "Sentido", true], TYPOGRAPHY: ["stile", "Tipografía", true], COLLOCATIONS: ["lessico", "Combinación", true]
  };
  function ltCheck(text, done) {
    if (typeof fetch !== "function") return done(new Error("sin fetch"));
    var ctl = typeof AbortController === "function" ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctl) ctl.abort(); }, 12000);
    var body = "text=" + encodeURIComponent(String(text).slice(0, 18000)) + "&language=it&motherTongue=es";
    fetch(LT_URL, { method: "POST", body: body, signal: ctl ? ctl.signal : undefined,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" } })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(function (j) { clearTimeout(timer); done(null, (j && j.matches) || []); })
      .catch(function (e) { clearTimeout(timer); done(e); });
  }
  // LanguageTool's matches as findings on the same tokens, minus what the
  // local checker already said and what is noise for a learner (a name, a
  // word the course itself uses, a space).
  function fromLT(text, matches, local) {
    var tk = toks(text), taken = {};
    (local || []).forEach(function (f) { for (var j = 0; j < f.n; j++) taken[f.i + j] = 1; });
    var out = [];
    (matches || []).forEach(function (m) {
      var cat = (m.rule && m.rule.category && m.rule.category.id) || "";
      if (/WHITESPACE|DOUBLE_PUNCT|UNPAIRED/.test((m.rule && m.rule.id) || "")) return;
      var kind = LT_KIND[cat] || ["lt", "Revisar", true];
      var first = -1, n = 0;
      tk.forEach(function (t, i) {
        if (!t.w) return;
        if (t.at < m.offset + m.length && t.at + t.len > m.offset) { if (first < 0) first = i; n = i - first + 1; }
      });
      if (first < 0) return;
      for (var j = 0; j < n; j++) if (taken[first + j] && tk[first + j].w) return;
      var w = tk[first];
      if (cat === "TYPOS" && (w.cap && !w.start || known(w.w))) return;   // names and words of the course
      for (var q = 0; q < n; q++) taken[first + q] = 1;
      var rep = (m.replacements || []).slice(0, 2).map(function (r) { return "*" + r.value + "*"; }).join(" o ");
      out.push({ i: first, n: n, cat: kind[0], soft: kind[2], lt: true,
                 msg: kind[1] + " (LanguageTool): " + String(m.message || m.shortMessage || "").replace(/\s+/g, " ").trim() +
                      (rep ? " → " + rep : "") });
    });
    return out;
  }

  /* ------------------------------------------------------------ IA
     Optional: the learner's own free keys.  The client (providers, model
     ranking, reasoning off, streaming, which provider goes first) lives in
     the core, js/ia.js, the same for both languages; the prompts are here. */
  var IA = root.IA;
  var PROVIDERS = IA ? IA.PROVIDERS : [];
  // The error types of the clinic: the AI files each mistake under one of them.
  var AI_TYPES = {
    ausiliare: "essere/avere en tiempos compuestos", participio_accordo: "concordancia del participio",
    accordo: "concordancia de adjetivos y determinantes", genere: "género de un sustantivo", plurale: "plural de un sustantivo",
    articolo: "artículo (forma, falta o sobra)", articolo_possessivo: "artículo con posesivos", preposizione: "preposición",
    preposizione_articolata: "preposición + artículo", persona_verbale: "persona o número del verbo",
    tempo_verbale: "tiempo verbal elegido", congiuntivo: "congiuntivo", periodo_ipotetico: "período hipotético",
    condizionale: "condicional", irregolare: "forma de verbo irregular", pronome: "pronombre",
    posizione_pronome: "lugar del pronombre", ci_ne: "ci / ne", a_personale: "«a» personal del castellano",
    parola_spagnola: "palabra o construcción del castellano", falso_amico: "falso amigo", lessico: "palabra equivocada",
    ortografia: "ortografía", doppie: "consonantes dobles", accento: "tildes y apóstrofos", ordine: "orden de las palabras",
    parola_mancante: "falta una palabra", parola_in_piu: "sobra una palabra",
    stile: "correcto pero poco natural (sugerencia, no error)"
  };
  function aiPrompt(text, week, task, ctx) {
    var level = week <= 8 ? "A1" : week <= 18 ? "A2" : week <= 30 ? "B1" : week <= 42 ? "B2" : "C1";
    return "Sos profesor de italiano, nativo, para un hispanohablante rioplatense que está en la semana " + week +
      " de 52 de un curso hasta C1 (nivel actual aproximado: " + level + ").\n" +
      "Consigna del ejercicio: «" + (task ? task.t : "texto libre") + "»." +
      (task && task.use && task.use.length ? " Estructuras que tenía que usar: " + task.use.map(function (u) { return u[2]; }).join("; ") + "." : "") + "\n\n" +
      "Corregí su texto con mucho cuidado, oración por oración. Marcá TODOS los errores, sin dejar pasar ninguno: gramática, " +
      "concordancia, persona y tiempo del verbo, auxiliares, participios, pronombres, artículos, preposiciones, léxico, falsos amigos, " +
      "castellano metido, ortografía, tildes, dobles, orden. Lo que es correcto pero un italiano no diría así, marcalo como \"stile\". " +
      "No marques como error algo correcto solo porque se podría decir mejor, y no cambies el contenido. Corrección MÍNIMA: " +
      "arreglá cada error con el menor cambio posible y no reescribas el estilo (los correctores automáticos tienden a sobrecorregir; no lo hagas).\n" +
      "Cada error lleva un \"tipo\" de esta lista: " + Object.keys(AI_TYPES).map(function (k) { return k + " (" + AI_TYPES[k] + ")"; }).join(", ") + ".\n" +
      "Respondé SOLO con JSON: {\"errores\":[{\"mal\":\"fragmento EXACTO copiado del texto, lo más corto posible\"," +
      "\"bien\":\"la corrección de ese fragmento\",\"tipo\":\"uno de la lista\"," +
      "\"explicacion\":\"una o dos oraciones en castellano rioplatense: qué regla es y por qué, con el dato que le sirve para no repetirlo\"}]," +
      "\"corregido\":\"el texto completo corregido\",\"consigna\":\"una oración: si cumplió la consigna y usó bien las estructuras pedidas\"," +
      "\"comentario\":\"dos o tres oraciones de devolución en castellano: qué hizo bien y qué tiene que practicar\"}\n" +
      "Los errores van en el orden en que aparecen en el texto. Cada error se marca una sola vez: no repitas un error ni marques uno " +
      "adentro de otro (si en «Hanno 32 annos» hay dos errores, van separados: «Hanno» y «annos»). Las explicaciones, la consigna y el " +
      "comentario van en castellano, con italiano solo en los ejemplos. El comentario habla del texto del alumno, no del corregido. " +
      "Antes de responder, revisá que cada explicación sea cierta." + ctxBlock(ctx, true) + "\n\nTexto:\n" + text;
  }
  /* A second teacher checks the first one's correction: drops what is not
     an error or is repeated, fixes wrong explanations, adds what was missed. */
  function reviewPrompt(text, week, task, data, evidence, ctx) {
    var ev = "";
    if (evidence && ((evidence.local || []).length || (evidence.lt || []).length)) {
      // A model cannot check its own work without outside evidence (Kamoi
      // et al. 2024): the rule checker and LanguageTool are that evidence.
      // The rule checker has no false alarms measured: its marks are sure,
      // and the learner sees them anyway (the correction is the union).
      ev = ((evidence.local || []).length ? "\nMarcas SEGURAS del corrector de reglas de la app (reglas revisadas, 0 falsas alarmas medidas; el alumno ya las ve): " +
          "no hace falta repetirlas; si creés que alguna NO es un error, incluila con \"contradice\": true y explicá por qué.\n" +
          evidence.local.slice(0, 12).map(function (m) { return "- " + m; }).join("\n") + "\n" : "") +
        ((evidence.lt || []).length ? "\nLanguageTool (verificá cada punto: puede tener falsos positivos, no lo copies a ciegas):\n" +
          evidence.lt.slice(0, 12).map(function (m) { return "- " + m; }).join("\n") + "\n" : "");
    }
    return "Sos un segundo profesor de italiano, nativo, que revisa la corrección que un colega hizo del texto de un alumno " +
      "hispanohablante rioplatense (semana " + week + " de 52 de un curso hasta C1; consigna: «" + (task ? task.t : "texto libre") + "»).\n\n" +
      "Texto del alumno:\n" + text + "\n\nCorrección del colega (JSON):\n" + JSON.stringify(data) + "\n" + ev + "\n" +
      "Revisala y devolvé la versión buena:\n" +
      "1. Cada error tiene que ser un error de verdad en italiano estándar; sacá los que no lo sean.\n" +
      "2. \"mal\" tiene que estar copiado EXACTO del texto del alumno, lo más corto posible.\n" +
      "3. Ningún error repetido ni uno adentro de otro: si un fragmento tiene dos errores, separalos en dos fragmentos cortos.\n" +
      "4. Cada explicación tiene que ser cierta y precisa, en castellano rioplatense, con italiano solo en los ejemplos; corregí las que estén mal.\n" +
      "5. El \"tipo\" tiene que ser el que corresponde de esta lista: " + Object.keys(AI_TYPES).join(", ") + ".\n" +
      "6. Agregá los errores que el colega no vio (la evidencia externa puede señalarlos; confirmalos vos).\n" +
      "6b. Corrección mínima: cada \"bien\" cambia lo menos posible; sacá las correcciones de estilo disfrazadas de error.\n" +
      "7. \"corregido\" tiene que tener todos los arreglos y nada más; \"consigna\" y \"comentario\" tienen que ser ciertos y hablar del texto del alumno.\n" +
      "Respondé SOLO con el JSON revisado, con el mismo formato." + ctxBlock(ctx, true);
  }
  // done(err, data, meta): meta says which provider and model corrected and which reviewed.
  function aiCheck(text, week, keys, done, onStage, opts) {
    var task = TASKS[week];
    opts = opts || {};
    llm(aiPrompt(text, week, task, opts.ctx), keys, function (err, data, meta) {
      if (err) return done(err);
      if (onStage) onStage("review", meta);
      // the evidence may still be on its way (LanguageTool): wait for it a moment
      var go = function (evidence) {
        llm(reviewPrompt(text, week, task, data, evidence, opts.ctx), keys, function (err2, data2, meta2) {
          var good = !err2 && data2 && Array.isArray(data2.errores);
          done(null, good ? data2 : data, { first: meta, review: good ? meta2 : null, evidence: !!evidence });
        });
      };
      if (typeof opts.evidence === "function") opts.evidence(go); else go(opts.evidence || null);
    });
  }

  /* Any exercise: why is my answer wrong (or is it right after all)? */
  function explainPrompt(x) {
    return "Sos profesor de italiano para un hispanohablante rioplatense. Un alumno respondió un ejercicio de una app.\n" +
      "Consigna: " + (x.prompt || "") + "\nEnunciado: " + (x.stem || "") +
      (x.options && x.options.length ? "\nOpciones: " + x.options.join(" | ") : "") +
      "\nRespuesta del alumno: " + (x.given || "(vacía)") + "\nRespuesta que la app da por correcta: " + (x.answer || "") +
      (x.accept && x.accept.length > 1 ? "\nOtras respuestas que la app acepta: " + x.accept.join(" | ") : "") +
      (x.feedback ? "\nCorrección que mostró la app: " + x.feedback : "") +
      (x.diff ? "\nDiferencia exacta (calculada por la app, es un hecho): " + x.diff : "") +
      (x.note ? "\nNota del ejercicio (revisada, es la regla que aplica): " + x.note : "") +
      (x.stage === "mas" ? "\nEl alumno ya vio la solución y la explicación de la app, y pide que se lo expliques mejor: no repitas lo mismo con otras palabras; " +
        "da la regla de fondo, un contraste con el español y un ejemplo distinto del ejercicio." : "") +
      ctxBlock(x.ctx) +
      "\nNo inventes errores ni reglas: hablá solo del error que muestra la diferencia, todo en castellano rioplatense, sin comillas dobles ni HTML (las formas, entre *asteriscos*)." +
      "\n\nExplicale al alumno, en 2 a 4 oraciones en castellano rioplatense, qué está mal en su respuesta y cuál es la regla, " +
      "con un ejemplo corto en italiano. Si su respuesta en realidad también es correcta, o si la corrección de la app está mal o confunde, decilo claro.\n" +
      "No le des la razón por cortesía ni porque insista: «tambien_correcta» solo si su respuesta es italiano estándar correcto y cumple la consigna; " +
      "ante la duda, mantené la corrección de la app y explicá por qué. Verificá la regla antes de afirmarla; si no estás seguro, decilo.\n" +
      "Respondé SOLO con JSON: {\"tambien_correcta\": true o false, \"app_equivocada\": true o false, \"explicacion\": \"...\"}";
  }
  function explain(x, keys, done) { llm(explainPrompt(x), keys, done); }

  /* Graded hints (dynamic assessment, Aljaafreh & Lantolf 1994; LearnLM
     2024): first an implicit nudge, then the rule as a question, and only
     then the explanation.  One request, revealed step by step. */
  function hintsPrompt(x) {
    return "Sos profesor de italiano para un hispanohablante rioplatense. Tu método: no dar la respuesta de entrada; " +
      "primero una pista, después la regla como pregunta, y al final la explicación.\n" +
      "Consigna: " + (x.prompt || "") + "\nEnunciado: " + (x.stem || "") +
      (x.options && x.options.length ? "\nOpciones: " + x.options.join(" | ") : "") +
      "\nRespuesta del alumno: " + (x.given || "(vacía)") + "\nRespuesta correcta según la app: " + (x.answer || "") +
      (x.accept && x.accept.length > 1 ? "\nOtras respuestas aceptadas: " + x.accept.join(" | ") : "") +
      (x.diff ? "\nDiferencia exacta (calculada por la app, es un hecho): " + x.diff : "") +
      (x.note ? "\nNota del ejercicio (revisada, es la regla que aplica): " + x.note : "") +
      (x.feedback ? "\nLo que ya le dijo la app (su pista; no la repitas, sumá algo distinto): " + x.feedback : "") +
      ctxBlock(x.ctx) +
      "\n\nReglas estrictas:\n" +
      "- Todo en castellano rioplatense (vos), sin frases en italiano salvo los ejemplos entre *asteriscos*.\n" +
      "- Hablá SOLO del error real: el que muestra la diferencia exacta. No inventes errores ni reglas; si la nota del ejercicio dice la regla, usala tal cual.\n" +
      "- Si la diferencia es solo de puntuación, espacios o mayúsculas, decí que la respuesta está bien.\n" +
      "- No uses comillas dobles ni HTML; para las formas en italiano usá *asteriscos*.\n" +
      "pista1: una frase corta que señale DÓNDE está el problema (el hueco o la palabra), sin dar la respuesta.\n" +
      "pista2: una pregunta que apunte a la regla, sin dar la respuesta.\n" +
      "explicacion: 2 o 3 oraciones con la regla exacta y la forma correcta, con un ejemplo corto.\n" +
      "tambien_correcta: true solo si la respuesta del alumno es italiano estándar y cumple la consigna; no le des la razón por cortesía.\n" +
      "Respondé SOLO con JSON: {\"pista1\": \"...\", \"pista2\": \"...\", \"explicacion\": \"...\", \"tambien_correcta\": true o false, \"app_equivocada\": true o false}";
  }
  function hints(x, keys, done) { llm(hintsPrompt(x), keys, done); }

  /* The judge of an answer the item did not foresee (P4.1): the rules
     fired on the vocabulary or the order, and they are not sure; before
     the verdict, is it correct and does it say the same?  With what the app
     said as evidence.  What the AI accepts is kept as a local variant. */
  function judgePrompt(x) {
    return "Sos profesor de italiano para un hispanohablante rioplatense. Un alumno respondió un ejercicio de una app y su respuesta " +
      "no está entre las previstas. Decidí dos cosas: si es italiano estándar correcto y si dice lo mismo que la respuesta esperada (cumple la consigna).\n" +
      "Consigna: " + (x.prompt || "") + "\nEnunciado: " + (x.stem || "") +
      "\nRespuesta esperada: " + (x.answer || "") +
      (x.accept && x.accept.length > 1 ? "\nOtras respuestas que la app acepta: " + x.accept.join(" | ") : "") +
      "\nRespuesta del alumno: " + (x.given || "") +
      (x.feedback ? "\nLo que dijo el corrector de reglas de la app (se equivoca a veces con sinónimos, el orden o formas no previstas): " + x.feedback : "") +
      ctxBlock(x.ctx) + "\n" + "" +
      "No le des la razón por cortesía: si hay un error de gramática, de ortografía o el sentido cambia, es false. Ante la duda, false.\n" +
      "Respondé SOLO con JSON: {\"correcta\": true o false, \"mismo_sentido\": true o false, " +
      "\"explicacion\": \"una o dos oraciones en castellano rioplatense: por qué vale o qué tiene de malo, con las formas entre *asteriscos*\"}";
  }
  function judge(x, keys, done) { llm(judgePrompt(x), keys, done, { max: 300 }); }

  // The course and the learner, for any request (js/errores.js builds it).
  function ctxBlock(ctx, withFocus) {
    if (!ctx) return "";
    var E = root.Errores, t = typeof ctx === "string" ? ctx : E && E.promptCtx ? E.promptCtx(ctx) : "";
    var focus = withFocus && typeof ctx === "object" && E && E.focusCats ? E.focusCats(ctx) : null;
    if (focus && focus.length) t += "\nCorrección FOCALIZADA (el alumno es principiante): marcá todos los errores, pero cada uno lleva \"foco\": true si es de estas " +
      "categorías (" + focus.join(", ") + ") o impide entender, y \"foco\": false si no (la app los muestra plegados).";
    return t ? "\n\n" + t : "";
  }

  /* ------------------------------------------------------------ parla
     Role-play with a goal (Wang et al. 2025; Dugan et al. 2026): hard,
     measurable rules instead of a persona; a vocabulary list the reply
     must stay inside (the app measures the miss rate and asks for a
     rewrite); one recast and at most one note per turn. */
  function parlaScenarioPrompt(ctx) {
    return "Diseñá un role-play breve en italiano para un hispanohablante rioplatense de nivel " + ctx.level + " (semana " + ctx.week +
      " de 52). Función de la semana: «" + ctx.fare + "». Tema: «" + ctx.tema + "».\n" +
      "Reglas: el alumno tiene que conseguir TRES objetivos comunicativos concretos y verificables hablando con vos. " +
      "Vos hacés un personaje con un rol claro (empleado, vecino, amigo…), no un profesor. Frases de máximo " + ctx.maxWords + " palabras. " +
      "Usá solo estos tiempos verbales: " + ctx.tenses + ". " + ITALIANO_PRIMA + " El alumno conoce, entre otras: " + ctx.words.slice(0, 100).join(", ") + ".\n" +
      "Respondé SOLO con JSON: {\"titolo\": \"título corto en italiano\", \"ruolo_ia\": \"quién sos, en italiano\", " +
      "\"situazione_es\": \"la situación explicada al alumno en castellano, 2 oraciones\", " +
      "\"obiettivi\": [\"objetivo 1 en castellano\", \"objetivo 2\", \"objetivo 3\"], " +
      "\"apertura\": \"tu primera frase en italiano, en personaje\", \"parole_utili\": [\"6 palabras o expresiones italianas útiles\"]}";
  }
  // Italian first: the vocabulary list is a preference, never a reason to
  // write broken Italian («uomo grande fare servizio?»).
  var ITALIANO_PRIMA = "Tu italiano tiene que ser SIEMPRE correcto y natural, como lo diría un italiano: artículos y concordancias bien " +
    "(un ragazzo, l'uomo, una ragazza), mayúscula al empezar cada oración, frases completas con verbo. Preferí palabras simples y frecuentes, " +
    "pero nunca sacrifiques la gramática ni el sentido por usar palabras más simples.";
  function parlaTurnPrompt(scen, history, userText, ctx, done) {
    var pending = scen.obiettivi.map(function (o, i) { return (done || []).indexOf(i + 1) < 0 ? (i + 1) + ") " + o : null; }).filter(Boolean);
    return "Seguís un role-play en italiano con un alumno hispanohablante de nivel " + ctx.level + ". Tu personaje: " + scen.ruolo_ia +
      ". Situación: " + String(scen.situazione_es || "").replace(/\.\s*$/, "") + ". Objetivos del alumno: " + scen.obiettivi.map(function (o, i) { return (i + 1) + ") " + o; }).join(" ") +
      (pending.length ? ". Todavía le faltan: " + pending.join(" ") : "") + "\n" +
      "Cómo conversar: respondé primero a lo que el alumno acaba de decir o preguntar (si te pregunta algo, contestalo en personaje, con un dato concreto); " +
      "no repitas lo que ya dijiste antes; mantené el hilo de la situación; terminá con UNA pregunta simple que lo acerque a un objetivo pendiente. " +
      "Si el alumno escribe algo raro o fuera de tema, reaccioná con naturalidad y volvé a la situación.\n" +
      "Reglas: en personaje, en italiano, máximo " + ctx.maxWords + " palabras, solo estos tiempos: " + ctx.tenses + ". " + ITALIANO_PRIMA +
      " El alumno conoce, entre otras, estas palabras: " + ctx.words.slice(0, 100).join(", ") + ".\n" +
      "No corrijas dentro del diálogo. En \"recast\" dá la frase del alumno corregida con el cambio mínimo (o \"\" si estaba bien); fijate también en las " +
      "palabras equivocadas que cambian el sentido (cappelli = sombreros / capelli = pelo; troppo = demasiado / molto = muy). En \"nota_es\", UNA observación " +
      "breve en castellano sobre el error más importante (o vacío); no inventes reglas.\n" +
      "Objetivos: un objetivo está cumplido si el alumno lo logró de forma comprensible, aunque sea con errores (por ejemplo «Tu sei troppo alto» describe un rasgo físico).\n" +
      "Conversación hasta ahora:\n" + history.map(function (h) { return (h[0] === "ia" ? "Personaje: " : "Alumno: ") + h[1]; }).join("\n") +
      "\nAlumno: " + userText + "\n\n" +
      "Respondé SOLO con JSON: {\"risposta\": \"tu turno en italiano\", \"recast\": \"la frase del alumno corregida, o \\\"\\\" si estaba bien\", " +
      "\"nota_es\": \"una observación o vacío\", \"obiettivi_raggiunti\": [números de TODOS los objetivos cumplidos por el alumno hasta ahora], \"fine\": true si los tres objetivos están cumplidos}";
  }
  // Only the hard words, by simpler synonyms: the sentence stays Italian.
  function parlaRewritePrompt(reply, miss) {
    return "Riscrivi questa battuta in italiano semplice, sostituendo con sinonimi più comuni solo queste parole difficili: " + miss.join(", ") +
      ". Stesso significato, frase completa e grammaticalmente perfetta (articoli, accordi, maiuscola iniziale), massimo 25 parole. " +
      "Battuta: «" + reply + "». Rispondi SOLO con JSON: {\"risposta\": \"...\"}";
  }
  /* The learner's sentences reviewed at the end, all together, by a second
     request that does only that (the role-play model corrects on the fly
     and misses errors that change the meaning: cappelli for capelli). */
  function parlaReviewPrompt(scen, history) {
    var mine = history.map(function (h, i) { return h[0] === "me" ? i : -1; }).filter(function (i) { return i >= 0; });
    return "Sos profesor de italiano. Un alumno hispanohablante escribió estas frases en un role-play (situación: " + scen.situazione_es + ").\n" +
      "Conversación:\n" + history.map(function (h, i) { return (h[0] === "ia" ? "Personaje: " : "Alumno [" + i + "]: ") + h[1]; }).join("\n") + "\n\n" +
      "Revisá cada frase del alumno. Corrección mínima: cambiá solo lo que está mal, no reescribas lo que ya es correcto. Mirá gramática, concordancia, " +
      "artículos, ortografía y sobre todo las palabras equivocadas que cambian el sentido (cappelli = sombreros / capelli = pelo; troppo = demasiado / " +
      "molto = muy; grande = grande de tamaño o de edad según el contexto). Si la frase está bien, \"ok\": true. No inventes reglas.\n" +
      "Respondé SOLO con JSON: {\"frasi\": [{\"i\": número de la frase, \"ok\": true o false, \"corretta\": \"la frase corregida\", " +
      "\"nota\": \"una observación breve en castellano rioplatense, o vacío\", \"tipo\": \"el tipo del error principal, uno de: " + Object.keys(AI_TYPES).join(", ") + "\"}]} con una entrada para cada una de estas frases: " + mine.join(", ");
  }
  /* The turn as a chat: the rules, the character and the goals go in the
     system message (the same every turn, so the provider can reuse it), the
     conversation as real turns, and the format with the learner's message. */
  function parlaTurnChat(scen, history, userText, ctx, done) {
    var full = parlaTurnPrompt(scen, [], "", ctx, done);
    var cut = full.indexOf("Conversación hasta ahora:"), at = full.indexOf("Respondé SOLO con JSON");
    var rules = cut > 0 ? full.slice(0, cut).trim() : full, fmt = at > 0 ? full.slice(at) : "";
    var msgs = [{ role: "user", content: "(Empieza el role-play.)" }];
    history.forEach(function (h) {
      var text = String(h[1] || "");
      if (h[0] === "ia" && /^\(/.test(text)) return;                 // avisos de la app, no del personaje
      var role = h[0] === "ia" ? "assistant" : "user", last = msgs[msgs.length - 1];
      if (last.role === role) last.content += "\n" + text; else msgs.push({ role: role, content: text });
    });
    if (msgs[msgs.length - 1].role === "user") msgs[msgs.length - 1].content += "\n" + userText; else msgs.push({ role: "user", content: userText });
    // first what the learner just said (so the reply answers it), then the reply
    fmt = fmt.replace('{\"risposta\"', '{\"capito\": \"en castellano y en pocas palabras, qué dijo, pidió o preguntó el alumno en su ÚLTIMO mensaje\", \"risposta\"');
    return { system: rules + "\nCada mensaje del alumno llega como un turno. Tu \"risposta\" responde a ESE mensaje: si pregunta, contestá con un dato concreto; si pide algo, dáselo o negocialo en personaje; si cuenta algo, reaccioná a eso. Nunca sigas un guion propio ignorando lo que escribió.\n" + fmt, messages: msgs };
  }
  /* Which goals the learner has reached, judged apart from the reply (the
     role-play model, busy being the character, often forgot to mark them). */
  function parlaGoalsPrompt(scen, history) {
    return "Sos profesor de italiano. Un alumno hispanohablante hace un role-play escrito. Situación: " + String(scen.situazione_es || "") + "\n" +
      "Sus objetivos:\n" + scen.obiettivi.map(function (o, i) { return (i + 1) + ") " + o; }).join("\n") + "\n\n" +
      "Conversación:\n" + history.map(function (h) { return (h[0] === "ia" ? "Personaje: " : "Alumno: ") + h[1]; }).join("\n") + "\n\n" +
      "¿Qué objetivos ya cumplió el alumno con lo que ÉL escribió? Un objetivo está cumplido si lo intentó de forma comprensible, aunque tenga errores de " +
      "gramática o use palabras del español; no hace falta que use palabras exactas. No cuenta lo que dijo el personaje.\n" +
      "Respondé SOLO con JSON: {\"cumplidos\": [números], \"motivo\": \"una frase en castellano\"}";
  }
  function parlaGoals(scen, history, keys, done) { llm(parlaGoalsPrompt(scen, history), keys, done, { max: 200 }); }
  function parlaStart(ctx, keys, done) { llm(parlaScenarioPrompt(ctx), keys, done, { max: 900 }); }
  // opts.stream: the character's line as it is being written (the app shows it live).
  function parlaTurn(scen, history, userText, ctx, keys, done, reached, opts) {
    opts = opts || {};
    llm(parlaTurnChat(scen, history, userText, ctx, reached), keys, done, { stream: opts.stream, max: 600, hedge: opts.hedge || 8000, temperature: 0.5 });
  }
  function parlaRewrite(reply, miss, keys, done) { llm(parlaRewritePrompt(reply, miss), keys, done, { max: 300 }); }
  function parlaReview(scen, history, keys, done) { llm(parlaReviewPrompt(scen, history), keys, done, { think: "low" }); }

  /* ------------------------------------------------------- storia
     A short story built on the words due for review plus what the learner
     already knows (SRS-Stories, Kamzela, Lango & Dušek 2025): the app
     measures the miss rate and asks for a rewrite when it is too high. */
  function storiaPrompt(ctx) {
    return "Escribí un cuento corto en italiano para un hispanohablante de nivel " + ctx.level + " (semana " + ctx.week + " de 52; tema de la semana: «" +
      ctx.tema + "»). Tres párrafos, " + ctx.words + " palabras en total, frases cortas, gramática de estos tiempos solamente: " + ctx.tenses + ".\n" +
      "OBLIGATORIO: usá cada una de estas palabras al menos una vez (son las que el alumno tiene que repasar): " + ctx.targets.join(", ") + ".\n" +
      "Una historia de verdad: personajes con nombre, un problema y un final; que cada oración siga a la anterior. " + ITALIANO_PRIMA + "\n" +
      "Vocabulario: preferí palabras muy frecuentes y estas, que el alumno ya conoce: " + ctx.known.join(", ") + ". " +
      "Como máximo " + ctx.maxNew + " palabras que no sean frecuentes, y ponelas en el glosario.\n" +
      "Respondé SOLO con JSON: {\"titolo\": \"...\", \"testo\": \"párrafo uno\\n\\npárrafo dos\\n\\npárrafo tres\", " +
      "\"glossario\": [[\"palabra italiana tal como aparece\", \"significado en castellano\"], ...], " +
      "\"domande\": [[\"pregunta de comprensión en castellano\", [\"opción correcta\", \"distractor\", \"distractor\", \"distractor\"], \"opción correcta\"], ...3 preguntas]}";
  }
  function storiaRewritePrompt(text, miss) {
    return "Riscrivi questo testo in italiano sostituendo con sinonimi più comuni queste parole, troppo difficili per l'alunno: " + miss.join(", ") +
      ". Tutto il resto resta uguale. Il testo deve restare italiano corretto e naturale: articoli e accordi giusti (un ragazzo, l'uomo), " +
      "maiuscola all'inizio di ogni frase, la stessa storia. Testo:\n" + text +
      "\nRispondi SOLO con JSON: {\"testo\": \"...\"}";
  }
  // The errors the local checker found, fixed with the minimal change.
  function correggiPrompt(text, errs) {
    return "Correggi SOLO questi errori nel testo italiano, con il cambiamento minimo, senza toccare il resto: " + errs.join(" | ") +
      ". Controlla anche maiuscole a inizio frase e accordi articolo-nome. Testo:\n" + text + "\nRispondi SOLO con JSON: {\"testo\": \"...\"}";
  }
  function correggi(text, errs, keys, done) { llm(correggiPrompt(text, errs), keys, done); }
  function storia(ctx, keys, done) { llm(storiaPrompt(ctx), keys, done); }

  /* The written part of the C1 exam, graded with the certification rubric
     (adeguatezza, coesione, correttezza, lessico), 0-5 each. */
  function esamePrompt(task, text) {
    return "Sos examinador de italiano de una certificación C1 (CILS / CELI / PLIDA). Un candidato hispanohablante escribió este texto.\n" +
      "Consigna: " + task.t + "\nExtensión pedida: unas " + task.words + " palabras.\n\nTexto:\n" + text + "\n\n" +
      "Evaluá con la rúbrica oficial, de 0 a 5 cada criterio: adeguatezza (cumple la consigna, el registro y la extensión), " +
      "coesione (párrafos, conectores, progresión), correttezza (gramática y ortografía; un C1 tolera muy pocos errores), lessico (riqueza y precisión). " +
      "Sé exigente y justo: un texto A2 no pasa de 2 en correttezza y lessico. Listá los errores más importantes (máximo 8) con su corrección mínima.\n" +
      "Respondé SOLO con JSON: {\"punteggi\": {\"adeguatezza\": 0-5, \"coesione\": 0-5, \"correttezza\": 0-5, \"lessico\": 0-5}, " +
      "\"commento\": \"3 oraciones en castellano rioplatense: qué está bien, qué le falta para C1\", \"errori\": [[\"fragmento mal\", \"corrección\"], ...]}";
  }
  function esame(task, text, keys, done) { llm(esamePrompt(task, text), keys, done); }
  function storiaRewrite(text, miss, keys, done) { llm(storiaRewritePrompt(text, miss), keys, done); }

  // Every request goes through the core client (js/ia.js).
  function llm(prompt, keys, done, opts) {
    if (!IA) return done(new Error("sin cliente de IA"));
    return IA.llm(prompt, keys, done, opts);
  }

  /* The AI's errors as findings on the text's tokens, to add to the local
     ones (the union: C8).  Each one carries bad (the fragment as written),
     good (the AI's correction), why (its explanation) and level.  What the
     local checker already marked is not repeated, but when the AI proposes
     another correction for it, or says it is not an error («contradice»),
     both are shown (conflict).  A fragment not found word for word is looked
     for without accents and punctuation, and if it is not there, it is still
     listed (unplaced), never dropped.  foco: false (A1-A2) → minor, folded. */
  // Where a fragment starts as whole words (*em* is not the end of *Ontem*).
  function wordAt(hay, needle, from) {
    var L = /[a-zà-ÿ0-9]/i, at = hay.indexOf(needle, from);
    while (at >= 0) {
      var before = at > 0 ? hay.charAt(at - 1) : "", after = hay.charAt(at + needle.length);
      if ((!before || !L.test(before) || !L.test(needle.charAt(0))) && (!after || !L.test(after) || !L.test(needle.charAt(needle.length - 1)))) return at;
      at = hay.indexOf(needle, at + 1);
    }
    return -1;
  }
  function fromAI(text, data, local) {
    var src = String(text).normalize("NFC").replace(/[’‘`´]/g, "'"), tk = toks(text), taken = {}, low = src.toLowerCase(), from = 0, out = [];
    var loose = function (x) { return String(x).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); };
    var looseLow = loose(low);
    var locAt = {};
    (local || []).forEach(function (f) { if (!f.lt && !f.ai) for (var j = 0; j < f.n; j++) { taken[f.i + j] = 1; locAt[f.i + j] = f; } });
    ((data && data.errores) || []).forEach(function (e) {
      var bad = String(e.mal || "").normalize("NFC").replace(/[’‘`´]/g, "'").trim();
      var good = String(e.bien == null ? "" : e.bien).normalize("NFC").replace(/[’‘`´]/g, "'").trim();
      var contra = e.contradice === true;
      if (!bad || (!contra && good.toLowerCase() === bad.toLowerCase())) return;
      var at = wordAt(low, bad.toLowerCase(), from);
      if (at < 0) at = wordAt(low, bad.toLowerCase(), 0);
      if (at < 0) {   // the same without accents (same length: the offsets hold)
        var lb = loose(bad);
        if (lb.length === bad.length) at = wordAt(looseLow, lb, 0);
      }
      var tipo = String(e.tipo || "").trim().toLowerCase(), soft = tipo === "stile";
      var why = String(e.explicacion || "").trim();
      var f = { cat: AI_TYPES[tipo] && !soft ? tipo : soft ? "stile" : "ia", soft: soft, ai: true, bad: bad, good: e.bien == null ? null : good,
                why: why, level: soft ? "poco_natural" : "wrong", minor: e.foco === false,
                msg: (e.bien != null && !contra ? "*" + bad + "* → *" + (good || "(se borra)") + "*. " : "") + (soft ? "(Más natural) " : "") + why };
      var first = -1, n = 0;
      if (at >= 0) tk.forEach(function (t, i) { if (t.w && t.at < at + bad.length && t.at + t.len > at) { if (first < 0) first = i; n = i - first + 1; } });
      if (first < 0) { f.i = -1; f.n = 0; f.unplaced = true; out.push(f); return; }
      from = at + bad.length;
      f.i = first; f.n = n;
      var dup = true, j;
      for (j = 0; j < n; j++) if (!taken[first + j]) dup = false;
      if (dup) {
        // over a local mark: agreement is silence; another correction or a «no es error», both shown
        var lf = locAt[first], lg = lf && lf.good != null ? String(lf.good).toLowerCase() : null;
        if (!lf || (!contra && (lg == null || lg === good.toLowerCase()))) return;
        f.conflict = true; f.soft = true; f.minor = false;
        f.msg = (contra ? "🤖 La IA no lo ve como error: " : "🤖 La IA propone otra corrección: *" + (good || "(se borra)") + "*. ") + why;
        out.push(f);
        return;
      }
      for (j = 0; j < n; j++) taken[first + j] = 1;
      out.push(f);
    });
    out.sort(function (x, y) { return (x.i < 0 ? 1e9 : x.i) - (y.i < 0 ? 1e9 : y.i); });
    return out;
  }

  function weeks() { return Object.keys(TASKS).map(Number); }

  var api = { TASKS: TASKS, features: features, lint: lint, check: check, markup: markup, weeks: weeks, toks: toks,
              learn: learn, learnCourse: learnCourse, ltCheck: ltCheck, fromLT: fromLT,
              aiCheck: aiCheck, fromAI: fromAI, aiPrompt: aiPrompt, explain: explain, explainPrompt: explainPrompt, reviewPrompt: reviewPrompt,
              hints: hints, hintsPrompt: hintsPrompt, judge: judge, judgePrompt: judgePrompt, ctxBlock: ctxBlock, parlaStart: parlaStart, parlaTurn: parlaTurn, parlaRewrite: parlaRewrite, parlaReview: parlaReview, parlaReviewPrompt: parlaReviewPrompt, correggi: correggi,
              parlaScenarioPrompt: parlaScenarioPrompt, parlaTurnPrompt: parlaTurnPrompt, parlaTurnChat: parlaTurnChat, parlaGoals: parlaGoals, parlaGoalsPrompt: parlaGoalsPrompt, storia: storia, storiaRewrite: storiaRewrite, storiaPrompt: storiaPrompt, esame: esame, esamePrompt: esamePrompt, PROVIDERS: PROVIDERS, AI_TYPES: AI_TYPES };
  api.llm = llm;   // la reformulación de escritura_plus.js usa las mismas claves y proveedores
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Scrivi = api;
})(typeof window !== "undefined" ? window : globalThis);
