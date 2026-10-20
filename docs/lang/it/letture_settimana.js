/*
 * La settimana: un texto corto por cada semana del curso, escrito a mano (no
 * con IA) (Jeon & Day 2016: la lectura extensiva rinde, d = 0,57).  Cada uno
 * usa la gramática de su semana y palabras ya vistas o glosadas, para leer
 * sin diccionario (Hu & Nation 2000: 98 % de cobertura).  Los controla
 * tools/check_letture.py (gramática y vocabulario por semana).
 */
(function (root) {
  "use strict";

  var TESTI = [
    { id: "w-02", week: 2, n: 1, level: "A1", emoji: "🍽️", title: "La cucina di Anna",
      grammar: "nomi: genere e numero",
      text:
        "Anna ha una cucina piccola ma bella. C'è un tavolo e ci sono quattro sedie. " +
        "Sopra il tavolo ci sono due bicchieri, tre piatti e un vaso con i fiori.\n\n" +
        "Il frigorifero è pieno: ci sono le uova, il latte, due formaggi e tante verdure. " +
        "Anna ha anche la pasta, il riso, lo zucchero e il caffè. Il caffè è importante: " +
        "in Italia la mattina è sacro!\n\n" +
        "Sopra il divano ci sono le foto di famiglia: i nonni, gli zii e i cugini. " +
        "In una foto c'è anche il cane, Otto. Otto è vecchio, ma è ancora il re di casa.",
      gloss: { bicchieri: "vasos", piatti: "platos", vaso: "florero", fiori: "flores", frigorifero: "heladera",
               pieno: "lleno", uova: "huevos", verdure: "verduras", divano: "sillón", sopra: "sobre, arriba de", cugini: "primos",
               cane: "perro", vecchio: "viejo", ancora: "todavía", sacro: "sagrado", re: "rey" },
      questions: [
        ["¿Cuántas sillas hay en la cocina?", ["cuatro", "dos", "tres", "seis"], "cuatro"],
        ["¿Qué hay en la heladera?", ["huevos, leche, quesos y verduras", "solo café", "pasta, arroz y una botella de vino", "nada"], "huevos, leche, quesos y verduras"],
        ["¿Quién es Otto?", ["el perro", "el abuelo", "un primo", "el rey de Italia"], "el perro"]
      ],
      vf: [["Nella cucina ci sono quattro sedie.", "vero"], ["Il frigorifero è vuoto.", "falso"], ["Anna ha una cucina grande.", "falso"]],
      hunt: { label: "Tocá los sustantivos en plural", targets: ["sedie", "bicchieri", "piatti", "fiori", "uova", "formaggi", "verdure", "foto", "nonni", "zii", "cugini"] } },

    { id: "w-03", week: 3, n: 2, level: "A1", emoji: "🏘️", title: "La mia via",
      grammar: "articoli e preposizioni articolate",
      text:
        "Abito in una via tranquilla, vicino alla stazione. All'angolo c'è un bar: " +
        "il barista è un amico e il caffè è buono. Accanto al bar c'è lo studio di un dentista " +
        "e poi c'è un'edicola.\n\n" +
        "Nella piazza ci sono gli alberi e le panchine. La mattina ci sono degli anziani " +
        "con i giornali e dei bambini con lo zaino. Il sabato c'è il mercato: " +
        "c'è della frutta, c'è del pesce e ci sono dei fiori.\n\n" +
        "Dalla finestra vedo il campanile della chiesa. La sera la via è vuota " +
        "e c'è solo il rumore dell'acqua della fontana.",
      gloss: { via: "calle", tranquilla: "tranquila", angolo: "esquina", accanto: "al lado", edicola: "kiosco de diarios",
               panchine: "bancos (de plaza)", anziani: "ancianos", giornali: "diarios", zaino: "mochila",
               pesce: "pescado", campanile: "campanario", vuota: "vacía", rumore: "ruido",
               fontana: "fuente", vedo: "veo" },
      questions: [
        ["¿Qué hay en la esquina?", ["un bar", "una iglesia", "una estación", "un mercado"], "un bar"],
        ["¿Qué pasa los sábados?", ["hay mercado", "cierra el bar", "no hay nadie", "hay misa"], "hay mercado"],
        ["¿Cómo está la calle de noche?", ["vacía y tranquila", "llena de gente y de música", "con música", "con tráfico"], "vacía y tranquila"]
      ],
      vf: [["Il barista è un amico.", "vero"], ["Il mercato c'è la domenica.", "falso"], ["La fontana è molto antica.", "non si dice"]],
      hunt: { label: "Tocá las preposiciones articuladas (alla, al, nella…)", targets: ["alla", "al", "nella", "della", "del", "dei", "degli", "dalla"] } },

    { id: "w-04", week: 4, n: 3, level: "A1", emoji: "👯", title: "Due sorelle diverse",
      grammar: "aggettivi",
      text:
        "Marta ed Elisa sono sorelle, ma sono molto diverse. Marta è alta e magra, " +
        "ha i capelli lunghi e neri e gli occhi verdi. È una ragazza seria e precisa. " +
        "Elisa è bassa, ha i capelli corti e biondi ed è sempre allegra.\n\n" +
        "Marta ama i vestiti eleganti e le scarpe nere. Elisa preferisce le magliette " +
        "colorate e i pantaloni comodi. Marta ha una macchina nuova; Elisa ha una bici rossa.\n\n" +
        "Però hanno una cosa in comune: sono due buone amiche e hanno un bel rapporto. " +
        "E tutte e due amano la pizza napoletana!",
      gloss: { sorelle: "hermanas", diverse: "distintas", magra: "flaca", capelli: "pelo", occhi: "ojos",
               bassa: "baja", corti: "cortos", allegra: "alegre", vestiti: "ropa, vestidos", scarpe: "zapatos",
               magliette: "remeras", colorate: "de colores", pantaloni: "pantalones", comodi: "cómodos", bici: "bici", comune: "común (in comune = en común)",
               rapporto: "relación", tutte: "todas (tutte e due = las dos)" },
      questions: [
        ["¿Cómo es Marta?", ["alta, flaca y seria", "baja y alegre", "rubia y de pelo corto", "desordenada"], "alta, flaca y seria"],
        ["¿Qué tiene Elisa?", ["una bici roja", "un auto nuevo", "zapatos negros", "vestidos elegantes"], "una bici roja"],
        ["¿Qué tienen en común?", ["son buenas amigas y aman la pizza", "el mismo pelo largo y los ojos verdes", "la misma ropa", "nada"], "son buenas amigas y aman la pizza"]
      ],
      vf: [["Marta ha i capelli biondi.", "falso"], ["Elisa ha una bici rossa.", "vero"], ["Marta ed Elisa abitano insieme.", "non si dice"]],
      hunt: { label: "Tocá los adjetivos de color", targets: ["neri", "verdi", "biondi", "nere", "colorate", "rossa"] } },

    { id: "w-06", week: 6, n: 4, level: "A1", emoji: "⏰", title: "Una giornata di Sara",
      grammar: "presente irregolare",
      text:
        "Sara fa l'infermiera e lavora in un ospedale di Torino. Esce di casa alle sei " +
        "e va al lavoro in autobus. Dice sempre che la mattina presto la città è molto bella.\n\n" +
        "In ospedale non può mai stare ferma: deve controllare i pazienti, dare le medicine " +
        "e parlare con i medici. A mezzogiorno beve un caffè veloce con i colleghi.\n\n" +
        "Il pomeriggio torna a casa stanca, ma la sera esce con gli amici. " +
        "\"Vuoi venire al cinema?\" chiede la sua amica Laura. \"Sì, vengo volentieri, " +
        "ma domani devo lavorare presto!\" risponde Sara.",
      gloss: { fa: "(fare l'infermiera) trabaja de enfermera", mai: "nunca (non può mai = nunca puede)", infermiera: "enfermera", ospedale: "hospital", ferma: "quieta", controllare: "controlar",
               pazienti: "pacientes", medici: "médicos", mezzogiorno: "mediodía", veloce: "rápido",
               colleghi: "compañeros de trabajo", stanca: "cansada", volentieri: "con gusto", presto: "temprano" },
      questions: [
        ["¿Cómo va Sara al trabajo?", ["en colectivo", "a pie", "en auto", "en tren y después a pie"], "en colectivo"],
        ["¿Qué hace al mediodía?", ["toma un café rápido", "almuerza en casa con su familia", "duerme", "va al cine"], "toma un café rápido"],
        ["¿Qué tiene que hacer Sara mañana?", ["trabajar temprano", "estar enferma", "ir al cine con Laura", "quedarse en casa"], "trabajar temprano"]
      ],
      vf: [["Sara fa l'infermiera.", "vero"], ["Sara esce di casa alle otto.", "falso"], ["Laura lavora con Sara in ospedale.", "non si dice"]],
      hunt: { label: "Tocá los verbos irregulares (fa, esce, va, dice…)", targets: ["fa", "esce", "va", "dice", "può", "deve", "beve", "vuoi", "vengo", "devo"] } },

    { id: "w-07", week: 7, n: 5, level: "A1", emoji: "📅", title: "L'agenda di Paolo",
      grammar: "numeri, date e ora",
      text:
        "Oggi è lunedì dodici marzo e Paolo ha una settimana piena. Alle otto e mezza " +
        "ha una riunione in ufficio. Alle dieci e un quarto deve chiamare un cliente di Milano.\n\n" +
        "Martedì tredici è il compleanno di sua madre: compie sessantacinque anni. " +
        "Paolo compra una torta e ventiquattro rose rosse.\n\n" +
        "Mercoledì alle diciannove ha lezione di inglese e giovedì alle sette di mattina " +
        "va in palestra. Venerdì sedici prende per Napoli il treno delle quindici e quaranta.\n\n" +
        "Il biglietto costa trentotto euro. \"Che ore sono?\" chiede Paolo al collega. " +
        "\"Sono le nove meno cinque\". Paolo corre: è già in ritardo!",
      gloss: { riunione: "reunión", ufficio: "oficina", quarto: "cuarto",
               cliente: "cliente", compleanno: "cumpleaños", compie: "cumple", torta: "torta", palestra: "gimnasio",
               biglietto: "pasaje", collega: "compañero de trabajo", corre: "corre", ritardo: "retraso (in ritardo = tarde)" },
      questions: [
        ["¿A qué hora es la reunión del lunes?", ["a las ocho y media", "a las diez y cuarto", "a las siete", "a las nueve"], "a las ocho y media"],
        ["¿Cuántos años cumple la madre?", ["sesenta y cinco", "cincuenta y seis", "setenta", "sesenta"], "sesenta y cinco"],
        ["¿Cuánto cuesta el pasaje?", ["treinta y ocho euros", "veintiocho euros con cincuenta", "cuarenta euros", "dieciocho euros"], "treinta y ocho euros"]
      ],
      vf: [["Martedì è il compleanno della madre di Paolo.", "vero"], ["Paolo va in palestra il venerdì.", "falso"], ["Il treno per Napoli è in ritardo.", "non si dice"]],
      hunt: { label: "Tocá los números escritos en letras", targets: ["dodici", "otto", "dieci", "tredici", "sessantacinque", "ventiquattro", "diciannove", "sette", "sedici", "quindici", "quaranta", "trentotto", "nove", "cinque"] } },

    { id: "w-08", week: 8, n: 6, level: "A1", emoji: "🎙️", title: "Un'intervista alla radio",
      grammar: "domande e interrogativi",
      text:
        "Oggi alla radio c'è un'intervista con Luca, un giovane cuoco di Palermo.\n\n" +
        "\"Luca, chi è la persona speciale nella tua cucina?\" " +
        "\"Mia nonna, senza dubbio.\"\n" +
        "\"Dove lavori adesso?\" \"In un piccolo ristorante vicino al porto.\"\n" +
        "\"Quando apri la mattina?\" \"Alle undici, ma arrivo alle otto.\"\n" +
        "\"Che cosa cucini di solito?\" \"Pesce, soprattutto. E la pasta con le sarde.\"\n" +
        "\"Quanti clienti hai ogni sera?\" \"Circa cinquanta.\"\n" +
        "\"Perché fai questo lavoro?\" \"Perché amo il mare e amo le persone.\"\n" +
        "\"E come stai, dopo tante ore in cucina?\" \"Stanco, ma felice!\"",
      gloss: { intervista: "entrevista", giovane: "joven", cuoco: "cocinero", dubbio: "duda (senza dubbio = sin duda)",
               porto: "puerto", solito: "habitual (di solito = por lo general)", soprattutto: "sobre todo", sarde: "sardinas",
               circa: "más o menos", felice: "feliz" },
      questions: [
        ["¿Quién es la persona especial en su cocina?", ["su abuela", "su madre", "un cliente", "su jefe"], "su abuela"],
        ["¿Dónde trabaja?", ["en un restaurante cerca del puerto", "en un hotel de lujo, frente a la playa", "en la radio", "en Milán"], "en un restaurante cerca del puerto"],
        ["¿Por qué hace este trabajo?", ["ama el mar y a la gente", "gana mucho", "no tiene otra opción de trabajo", "por su padre"], "ama el mar y a la gente"]
      ],
      vf: [["Luca è un cuoco di Palermo.", "vero"], ["Il ristorante apre alle otto.", "falso"], ["Luca ha due figli.", "non si dice"]],
      hunt: { label: "Tocá las palabras interrogativas", targets: ["chi", "dove", "quando", "che", "quanti", "perché", "come"] } },

    { id: "w-10", week: 10, n: 7, level: "A2", emoji: "🎁", title: "Il regalo per la nonna",
      grammar: "pronomi personali",
      text:
        "Domenica è la festa della nonna Rosa e i nipoti preparano un regalo. " +
        "\"Le compriamo un libro?\" chiede Giulia. \"No, la nonna ha già tanti libri e non li legge più\", " +
        "risponde Marco.\n\n" +
        "\"Allora le regaliamo una pianta?\" \"Buona idea! La mettiamo sul balcone e lei la guarda ogni mattina.\"\n\n" +
        "Marco chiama il fioraio e gli chiede un'orchidea bianca. Il fioraio la prepara e " +
        "gli dice: \"La potete prendere sabato\".\n\n" +
        "Domenica la nonna apre il pacco e sorride: \"Ragazzi, mi fate sempre felice! " +
        "Vi voglio bene\". I nipoti la abbracciano forte.",
      gloss: { festa: "fiesta", nipoti: "nietos", regalo: "regalo", già: "ya", pianta: "planta", balcone: "balcón",
               fioraio: "florista", orchidea: "orquídea", pacco: "paquete", sorride: "sonríe",
               bene: "bien (vi voglio bene = los quiero)", abbracciano: "abrazan", forte: "fuerte" },
      questions: [
        ["¿Por qué no le regalan un libro?", ["ya tiene muchos y no los lee", "no le gusta leer novelas largas", "son caros", "no hay librería"], "ya tiene muchos y no los lee"],
        ["¿Qué le regalan al final?", ["una orquídea blanca", "un libro", "una torta de chocolate", "un viaje"], "una orquídea blanca"],
        ["¿Qué hace la abuela?", ["sonríe y les dice que los quiere", "llora", "se enoja", "no abre el paquete hasta la noche"], "sonríe y les dice que los quiere"]
      ],
      vf: [["La nonna ha già molti libri.", "vero"], ["I nipoti regalano un libro alla nonna.", "falso"], ["L'orchidea costa molto.", "non si dice"]],
      hunt: { label: "Tocá los pronombres de objeto (le, la, li, gli, mi, vi)", targets: ["le", "la", "li", "gli", "mi", "vi"] } },

    { id: "w-14", week: 14, n: 8, level: "A2", emoji: "🍕", title: "Gusti di famiglia",
      grammar: "piacere e verbi simili",
      text:
        "Nella famiglia Bianchi nessuno ha gli stessi gusti. A papà piace il calcio, " +
        "ma non gli piacciono i film romantici. A mamma piacciono i libri gialli e le passeggiate in montagna.\n\n" +
        "A Chiara, la figlia, piace ballare. Le piacciono la musica pop e i concerti. " +
        "Il fratello, Tommaso, preferisce i videogiochi: gli piace stare a casa.\n\n" +
        "La domenica è difficile decidere cosa fare. Ieri Chiara ha proposto il mare: " +
        "a tutti è piaciuta l'idea, tranne a Tommaso. Alla fine sono andati al mare " +
        "e Tommaso ha giocato sul telefono. \"Mi manca il mio computer!\" ha detto.",
      gloss: { gusti: "gustos", nessuno: "nadie", stessi: "mismos", gialli: "policiales (libri gialli = novelas policiales)",
               passeggiate: "caminatas", ballare: "bailar", concerti: "recitales", videogiochi: "videojuegos",
               decidere: "decidir", proposto: "propuesto", tranne: "excepto", manca: "extraña (me falta)" },
      questions: [
        ["¿Qué no le gusta al papá?", ["las películas románticas", "el fútbol", "la montaña", "la música"], "las películas románticas"],
        ["¿Qué le gusta a Tommaso?", ["los videojuegos", "bailar", "los libros de aventuras", "la montaña"], "los videojuegos"],
        ["¿Qué extraña Tommaso en la playa?", ["su computadora", "a su mamá", "la pizza", "la montaña"], "su computadora"]
      ],
      vf: [["Al papà piace il calcio.", "vero"], ["A Tommaso piace andare al mare.", "falso"], ["La mamma va in montagna ogni settimana.", "non si dice"]],
      hunt: { label: "Tocá las formas de piacere y mancare", targets: ["piace", "piacciono", "piaciuta", "manca"] } },

    { id: "w-16", week: 16, n: 9, level: "A2", emoji: "😴", title: "Una mattina storta",
      grammar: "riflessivi al passato",
      text:
        "Ieri Giorgio non ha sentito la sveglia e si è svegliato alle otto e mezza. " +
        "Si è alzato di corsa, si è lavato in due minuti e non si è fatto la barba.\n\n" +
        "Si è vestito al buio e si è messo due calzini diversi: un calzino blu e un calzino verde. " +
        "Poi si è accorto che pioveva e non trovava l'ombrello.\n\n" +
        "In ufficio i colleghi si sono messi a ridere. Giorgio si è arrabbiato un po', " +
        "ma poi si è guardato i piedi e anche lui si è divertito.\n\n" +
        "La sera lui e sua moglie si sono seduti sul divano e si sono raccontati la giornata.",
      gloss: { sveglia: "despertador", corsa: "carrera (di corsa = a las corridas)", barba: "barba",
               buio: "oscuridad", calzini: "medias", pioveva: "llovía",
               ombrello: "paraguas", ridere: "reírse", arrabbiato: "enojado", piedi: "pies",
               divano: "sillón", raccontati: "contado (se contaron)", accorto: "dado cuenta" },
      questions: [
        ["¿Por qué se despertó tarde?", ["no oyó el despertador", "estaba enfermo", "era domingo", "se quedó sin luz toda la noche"], "no oyó el despertador"],
        ["¿Qué tenía de raro?", ["dos medias distintas", "dos zapatos distintos", "la camisa al revés", "no tenía zapatos"], "dos medias distintas"],
        ["¿Cómo terminó el día?", ["contándose el día con su mujer", "enojado", "en la oficina, trabajando hasta tarde", "sin cenar"], "contándose el día con su mujer"]
      ],
      vf: [["Giorgio si è svegliato tardi.", "vero"], ["Giorgio aveva due calzini uguali.", "falso"], ["Giorgio è arrivato in ufficio in ritardo.", "non si dice"]],
      hunt: { label: "Tocá los auxiliares de los reflexivos (è, sono)", targets: ["è", "sono"] } },

    { id: "w-17", week: 17, n: 10, level: "A2", emoji: "📦", title: "Il trasloco",
      grammar: "dimostrativi, possessivi, indefiniti",
      text:
        "Oggi Elena e Marco cambiano casa. Ci sono scatole dappertutto. " +
        "\"Di chi è questa scatola?\" chiede Marco. \"È mia: dentro ci sono i miei libri\".\n\n" +
        "\"E quella lì, vicino alla porta?\" \"Quella è tua: ci sono le tue scarpe e qualche maglione\".\n\n" +
        "Alcuni amici aiutano con i mobili. Ognuno porta qualcosa: Luca porta le sedie, " +
        "Anna porta quel vecchio specchio della nonna.\n\n" +
        "Alla fine della giornata sono tutti stanchi. \"Questo appartamento è perfetto\", dice Elena. " +
        "\"Sì, ma quelle scale... Nessuno vuole più portare niente!\" risponde Marco, e ride.",
      gloss: { nessuno: "nadie", niente: "nada (non... più niente = ya nada)", scatole: "cajas", scatola: "caja", dappertutto: "por todas partes", dentro: "adentro",
               maglione: "pulóver", mobili: "muebles", ognuno: "cada uno", specchio: "espejo", scale: "escaleras",
               ride: "se ríe", appartamento: "departamento" },
      questions: [
        ["¿Qué hay en la caja de Elena?", ["sus libros", "zapatos", "platos", "ropa"], "sus libros"],
        ["¿Qué lleva Anna?", ["el espejo viejo de la abuela", "las sillas", "una caja de libros y los platos", "nada"], "el espejo viejo de la abuela"],
        ["¿De qué se queja Marco al final?", ["de las escaleras", "del departamento", "de los amigos", "del precio"], "de las escaleras"]
      ],
      vf: [["Nella scatola di Elena ci sono i libri.", "vero"], ["Luca porta lo specchio della nonna.", "falso"], ["Il nuovo appartamento è al quinto piano.", "non si dice"]],
      hunt: { label: "Tocá los demostrativos (questa, quella, quel…)", targets: ["questa", "quella", "quel", "questo", "quelle"] } },

    { id: "w-23", week: 23, n: 11, level: "B1", emoji: "⚖️", title: "Bologna o Milano?",
      grammar: "comparativi e superlativi",
      text:
        "Francesca deve scegliere dove vivere. Milano è più grande di Bologna e offre più lavoro, " +
        "ma è anche più cara. Un appartamento a Milano costa molto più che a Bologna.\n\n" +
        "Bologna è meno caotica e più tranquilla. Per molti è la città più simpatica d'Italia, " +
        "e la cucina è migliore: i tortellini sono buonissimi!\n\n" +
        "A Milano però lo stipendio è più alto e ci sono più opportunità per una giovane architetta. " +
        "Francesca pensa: \"Il lavoro è importante quanto la qualità della vita\".\n\n" +
        "Alla fine sceglie Bologna, ma lavora due giorni a settimana a Milano. " +
        "Il treno ci mette solo un'ora: è la soluzione migliore.",
      gloss: { scegliere: "elegir", offre: "ofrece", cara: "cara", caotica: "caótica", stipendio: "sueldo",
               opportunità: "oportunidades", architetta: "arquitecta", qualità: "calidad", mette: "tarda (ci mette)",
               soluzione: "solución" },
      questions: [
        ["¿Qué ciudad es más cara?", ["Milán", "Bolonia", "las dos igual", "ninguna"], "Milán"],
        ["¿Qué ofrece Milán?", ["un sueldo más alto", "mejor comida", "más tranquilidad", "casas más baratas y grandes"], "un sueldo más alto"],
        ["¿Qué decide Francesca?", ["vivir en Bolonia y trabajar dos días en Milán", "vivir en Milán", "quedarse en Bolonia y dejar el trabajo de Milán", "irse al exterior"], "vivir en Bolonia y trabajar dos días en Milán"]
      ],
      vf: [["Milano è più cara di Bologna.", "vero"], ["Francesca sceglie di vivere a Milano.", "falso"], ["Francesca ha un fidanzato a Bologna.", "non si dice"]],
      hunt: { label: "Tocá las formas de comparación (più, meno, migliore…)", targets: ["più", "meno", "migliore", "buonissimi", "quanto"] } },

    { id: "w-27", week: 27, n: 12, level: "B1", emoji: "💼", title: "Il primo mese di Chiara",
      grammar: "avverbi",
      text:
        "Chiara lavora in una casa editrice da appena un mese. Arriva sempre puntualmente alle nove " +
        "e spesso resta fino a tardi.\n\n" +
        "All'inizio parlava pochissimo: ascoltava attentamente i colleghi e prendeva appunti. " +
        "Adesso si sente già più sicura e discute tranquillamente con il capo.\n\n" +
        "Il lavoro è davvero interessante, ma a volte è piuttosto faticoso. " +
        "Ieri, per esempio, ha letto velocemente tre manoscritti e alla fine era completamente stanca.\n\n" +
        "Comunque Chiara è contenta: finalmente fa il lavoro che sognava. " +
        "\"Non ho ancora capito tutto\", dice, \"ma imparo qualcosa ogni giorno\".",
      gloss: { editrice: "editorial (casa editrice)", appena: "apenas", resta: "se queda",
               inizio: "principio (all'inizio = al principio)", appunti: "apuntes", sicura: "segura", capo: "jefe", davvero: "de verdad",
               volte: "veces (a volte = a veces)", attentamente: "con atención", piuttosto: "bastante", faticoso: "cansador", manoscritti: "manuscritos",
               sognava: "soñaba", imparo: "aprendo" },
      questions: [
        ["Da quanto tempo Chiara lavora nella casa editrice?", ["da appena un mese", "da un anno", "da una settimana", "da tre mesi"], "da appena un mese"],
        ["Che cosa faceva Chiara all'inizio?", ["ascoltava e prendeva appunti", "parlava molto con tutti i colleghi", "arrivava tardi quasi ogni mattina", "discuteva di ogni cosa con il capo"], "ascoltava e prendeva appunti"],
        ["Che cosa si capisce dell'atteggiamento di Chiara verso il lavoro?", ["è stanca, ma motivata e contenta", "vuole cambiare lavoro al più presto", "non le interessa imparare cose nuove", "pensa che il lavoro sia troppo facile"], "è stanca, ma motivata e contenta"]
      ],
      vf: [["Chiara lavora in una casa editrice.", "vero"], ["All'inizio Chiara parlava molto.", "falso"], ["Chiara guadagna bene.", "non si dice"]],
      hunt: { label: "Tocá los adverbios en -mente", targets: ["puntualmente", "attentamente", "tranquillamente", "velocemente", "completamente", "finalmente"] } },

    { id: "w-28", week: 28, n: 13, level: "B1", emoji: "🏙️", title: "Città o campagna?",
      grammar: "connettivi",
      text:
        "Molti giovani italiani lasciano i piccoli paesi e vanno in città. Infatti in città ci sono " +
        "più università e più lavoro. Inoltre la vita culturale è più ricca.\n\n" +
        "Tuttavia la città ha anche dei problemi: gli affitti sono alti, quindi molti vivono " +
        "in appartamenti piccoli. E poi il traffico e il rumore stancano.\n\n" +
        "In campagna, invece, la vita è più lenta e le case costano meno. " +
        "Però i servizi sono pochi e spesso bisogna prendere la macchina per tutto.\n\n" +
        "Insomma, nessuna scelta è perfetta. Comunque, grazie al lavoro da casa, " +
        "oggi alcuni giovani tornano nei paesi, anche se non è sempre facile.",
      gloss: { paesi: "pueblos", lasciano: "dejan", ricca: "rica", affitti: "alquileres", rumore: "ruido",
               stancano: "cansan", lenta: "lenta", servizi: "servicios", bisogna: "hay que", scelta: "elección" },
      questions: [
        ["Perché molti giovani vanno in città?", ["per l'università e il lavoro", "perché le case costano meno", "perché la vita è più tranquilla", "perché c'è meno traffico"], "per l'università e il lavoro"],
        ["Qual è il problema principale della campagna?", ["i servizi sono pochi", "gli affitti sono alti", "c'è troppo rumore", "il traffico stanca"], "i servizi sono pochi"],
        ["Qual è la conclusione dell'autore?", ["ogni scelta ha vantaggi e svantaggi", "la città è sempre la scelta migliore", "in campagna non si può più vivere", "il lavoro da casa ha risolto tutto"], "ogni scelta ha vantaggi e svantaggi"]
      ],
      vf: [["In città gli affitti sono alti.", "vero"], ["In campagna ci sono molti servizi.", "falso"], ["Il lavoro da casa ha aiutato alcuni giovani a tornare nei paesi.", "vero"]],
      hunt: { label: "Tocá los conectores (infatti, inoltre, tuttavia…)", targets: ["infatti", "inoltre", "tuttavia", "quindi", "invece", "però", "insomma", "comunque"] } },

    { id: "w-32", week: 32, n: 14, level: "B2", emoji: "✉️", title: "La lettera del nonno",
      grammar: "concordanza dei tempi",
      text:
        "Mentre riordinava la soffitta, Laura ha trovato una lettera che il nonno aveva scritto alla nonna nel 1962.\n\n" +
        "\"Cara Maria, pensavo che non mi rispondessi più. Temevo che tuo padre ti avesse proibito " +
        "di scrivermi. Quando è arrivata la tua lettera, ho capito che mi avevi aspettato.\n\n" +
        "Ti prometto che troverò un lavoro e che ti sposerò entro un anno. " +
        "Spero che tu non abbia cambiato idea e che mi aspetti ancora un po'.\"\n\n" +
        "Laura ha pianto mentre la leggeva. Sapeva che i nonni si erano sposati nel 1963, " +
        "ma non immaginava che fosse stato così difficile.",
      gloss: { riordinava: "ordenaba", soffitta: "altillo", temevo: "temía", proibito: "prohibido",
               prometto: "prometo", sposerò: "me casaré con", entro: "dentro de", pianto: "llorado",
               immaginava: "imaginaba" },
      questions: [
        ["Dove ha trovato la lettera Laura?", ["in soffitta", "in un libro", "nella posta", "in cucina"], "in soffitta"],
        ["Che cosa temeva il nonno?", ["che il padre di lei lo proibisse", "di non trovare un lavoro", "che la lettera andasse persa", "che Maria avesse un altro uomo"], "che il padre di lei lo proibisse"],
        ["Perché Laura piange leggendo la lettera?", ["capisce quanto hanno lottato i nonni", "la lettera racconta una separazione", "la nonna non ha mai risposto al nonno", "il nonno non ha mantenuto la promessa"], "capisce quanto hanno lottato i nonni"]
      ],
      vf: [["Il nonno ha scritto la lettera nel 1962.", "vero"], ["I nonni si sono sposati nel 1962.", "falso"], ["La nonna ha risposto subito alla lettera.", "non si dice"]],
      hunt: { label: "Tocá los congiuntivi (rispondessi, avesse, abbia, aspetti, fosse)", targets: ["rispondessi", "avesse", "abbia", "aspetti", "fosse"] } },

    { id: "w-35", week: 35, n: 15, level: "B2", emoji: "🧀", title: "Com'è fatto il parmigiano",
      grammar: "la voce passiva",
      text:
        "Il Parmigiano Reggiano è prodotto soltanto in alcune province dell'Emilia-Romagna e della Lombardia. " +
        "Il latte viene munto la sera e la mattina, e viene lavorato in grandi caldaie di rame.\n\n" +
        "La forma viene poi immersa in acqua e sale per circa venti giorni. " +
        "Dopo, le forme sono sistemate su lunghi scaffali, dove vengono girate e controllate regolarmente.\n\n" +
        "Il formaggio deve essere stagionato almeno dodici mesi. Ogni forma è esaminata da un esperto, " +
        "che la batte con un martelletto per sentire se è perfetta.\n\n" +
        "Pare che il parmigiano fosse già apprezzato nel Medioevo: " +
        "è stato citato perfino da Boccaccio nel Decameron.",
      gloss: { soltanto: "solamente", province: "provincias", munto: "ordeñado", caldaie: "calderas", rame: "cobre",
               forma: "horma", immersa: "sumergida", sistemate: "acomodadas", scaffali: "estantes",
               girate: "dadas vuelta", stagionato: "curado", almeno: "por lo menos", esaminata: "examinada",
               batte: "golpea", martelletto: "martillito", apprezzato: "apreciado", pare: "parece", perfino: "hasta, incluso", citato: "citado" },
      questions: [
        ["Quando viene munto il latte?", ["la sera e la mattina", "solo di notte", "una volta alla settimana", "a mezzogiorno"], "la sera e la mattina"],
        ["Per quanto tempo deve stagionare almeno il formaggio?", ["dodici mesi", "venti giorni", "due anni", "sei mesi"], "dodici mesi"],
        ["Perché l'autore cita Boccaccio?", ["per dire che il formaggio è antico", "per consigliare di leggere il Decameron", "perché Boccaccio produceva formaggio", "per spiegare come si stagiona la forma"], "per dire che il formaggio è antico"]
      ],
      vf: [["Il parmigiano si stagiona almeno dodici mesi.", "vero"], ["Il latte si lavora in caldaie di plastica.", "falso"], ["Un chilo di parmigiano costa venti euro.", "non si dice"]],
      hunt: { label: "Tocá los participios de la pasiva (prodotto, munto…)", targets: ["prodotto", "munto", "lavorato", "immersa", "sistemate", "girate", "controllate", "stagionato", "esaminata", "citato"] } },

    { id: "w-43", week: 43, n: 16, level: "C1", emoji: "🎓", title: "Imparare da adulti",
      grammar: "l'infinito",
      text:
        "Imparare una lingua da adulti non è impossibile, ma richiede costanza. " +
        "Secondo molti studiosi, studiare venti minuti ogni giorno è più utile che passare " +
        "tre ore sui libri la domenica.\n\n" +
        "Dopo aver letto un testo, conviene riassumerlo con parole proprie: " +
        "ripetere senza capire serve a poco. Prima di andare a dormire, è utile " +
        "ripassare le parole nuove, perché il sonno aiuta a ricordarle.\n\n" +
        "L'importante è non avere paura di sbagliare. Sbagliare fa parte del processo, " +
        "e correggersi da soli insegna più che ricevere la risposta giusta.\n\n" +
        "Per non perdere la motivazione, basta fissarsi obiettivi piccoli e festeggiare ogni progresso.",
      gloss: { richiede: "requiere", costanza: "constancia", studiosi: "investigadores", conviene: "conviene",
               riassumerlo: "resumirlo", proprie: "propias", ripassare: "repasar", sonno: "sueño",
               sbagliare: "equivocarse", correggersi: "corregirse", fissarsi: "ponerse", obiettivi: "objetivos",
               festeggiare: "festejar", motivazione: "motivación" },
      questions: [
        ["Che cosa è più utile, secondo il testo?", ["studiare venti minuti al giorno", "studiare tre ore ogni domenica", "non studiare affatto", "leggere molto senza capire tutto"], "studiare venti minuti al giorno"],
        ["Perché conviene ripassare prima di dormire?", ["il sonno aiuta a ricordare", "la sera si ha più tempo libero", "di sera si è più svegli", "è più divertente"], "il sonno aiuta a ricordare"],
        ["Che cosa pensa l'autore degli errori?", ["fanno parte dell'apprendimento", "bisogna evitarli a ogni costo", "sono sempre colpa dell'insegnante", "non hanno nessuna importanza"], "fanno parte dell'apprendimento"]
      ],
      vf: [["Studiare un po' ogni giorno è più utile che studiare molto la domenica.", "vero"], ["Secondo il testo, sbagliare non serve a niente.", "falso"], ["Il testo consiglia di usare un'app.", "non si dice"]],
      hunt: { label: "Tocá los infinitivos usados como sustantivo o después de preposición", targets: ["imparare", "studiare", "passare", "aver", "andare", "dormire", "ripassare", "ricordarle", "avere", "sbagliare", "perdere", "fissarsi", "festeggiare"] } },

    { id: "w-46", week: 46, n: 17, level: "C1", emoji: "🐱", title: "Il gattino del vicino",
      grammar: "suffissi e alterazione",
      text:
        "Nel palazzone dove abito vive un vecchietto simpaticissimo, il signor Bruno. " +
        "Ha un gattino nero e un cagnolino bianco che abbaia a tutti.\n\n" +
        "Ogni mattina il signor Bruno scende con il suo cappellino e un giornalino sotto il braccio. " +
        "Si siede su una panchina del giardinetto e dà qualche briciolina ai passerotti.\n\n" +
        "Ieri il gattino è sparito. Il vecchietto era disperato: l'ha cercato in ogni angolino. " +
        "Alla fine l'abbiamo trovato dentro uno scatolone, addormentato su un vecchio maglione.\n\n" +
        "\"Che furbacchione!\" ha detto il signor Bruno, e per festeggiare " +
        "ci ha offerto un caffettino al bar.",
      gloss: { palazzone: "edificio grandote", vecchietto: "viejito", abbaia: "ladra", scende: "baja",
               cappellino: "sombrerito", giornalino: "revistita, diarito", braccio: "brazo", briciolina: "miguita",
               passerotti: "gorriones", sparito: "desaparecido", angolino: "rinconcito", scatolone: "cajón, caja grande",
               addormentato: "dormido", furbacchione: "pícaro, vivo", caffettino: "cafecito" },
      questions: [
        ["Quali animali ha il signor Bruno?", ["un gattino e un cagnolino", "due cagnolini bianchi e neri", "un uccellino e un pesce rosso", "un gatto bianco molto grasso"], "un gattino e un cagnolino"],
        ["Dove hanno trovato il gattino?", ["in uno scatolone", "al bar", "in giardino", "in strada"], "in uno scatolone"],
        ["Perché il signor Bruno chiama il gatto «furbacchione»?", ["si era trovato un posto comodo", "aveva mangiato il cibo del cane", "era scappato dalla finestra", "aveva spaventato tutti i passerotti"], "si era trovato un posto comodo"]
      ],
      vf: [["Il signor Bruno ha un gattino e un cagnolino.", "vero"], ["Il gattino si era perso in strada.", "falso"], ["Il signor Bruno vive al primo piano.", "non si dice"]],
      hunt: { label: "Tocá las palabras con sufijo (-ino, -etto, -one…)", targets: ["palazzone", "vecchietto", "gattino", "cagnolino", "cappellino", "giornalino", "giardinetto", "briciolina", "passerotti", "angolino", "scatolone", "furbacchione", "caffettino"] } },

    { id: "w-47", week: 47, n: 18, level: "C1", emoji: "🧮", title: "La ricetta della nonna",
      grammar: "numerali, misure e quantità",
      text:
        "Per il ragù della nonna servono mezzo chilo di carne macinata, un etto di pancetta, " +
        "una carota, una costa di sedano e mezza cipolla.\n\n" +
        "Si aggiungono un bicchiere di vino rosso, due cucchiai di concentrato di pomodoro " +
        "e circa un litro e mezzo di passata. Il sugo deve cuocere almeno tre ore a fuoco basso.\n\n" +
        "La nonna dice che la ricetta basta per una decina di persone, " +
        "ma la nostra famiglia è di sei persone: gli avanzi finiscono in freezer.\n\n" +
        "Un terzo del ragù va sulle tagliatelle della domenica; il resto, " +
        "la metà almeno, lo regaliamo agli zii, che ne vanno pazzi.",
      gloss: { ragù: "salsa boloñesa", macinata: "picada", etto: "cien gramos", pancetta: "panceta",
               costa: "rama", sedano: "apio", cipolla: "cebolla", aggiungono: "agregan", cucchiai: "cucharadas",
               passata: "puré de tomate", sugo: "salsa", cuocere: "cocinarse", fuoco: "fuego",
               decina: "unas diez", avanzi: "sobras", pazzi: "locos (ne vanno pazzi = les encanta)", tagliatelle: "tallarines al huevo" },
      questions: [
        ["Quanto deve cuocere il sugo?", ["almeno tre ore", "mezz'ora", "un giorno intero", "un'ora a fuoco alto"], "almeno tre ore"],
        ["Per quante persone basta la ricetta?", ["per una decina", "per sei", "per due", "per venti"], "per una decina"],
        ["Perché gli avanzi finiscono nel freezer?", ["sono in sei e la ricetta è per dieci", "il ragù non piace ai bambini di casa", "la nonna ne cucina ogni sera di più", "agli zii il ragù non piace per niente"], "sono in sei e la ricetta è per dieci"]
      ],
      vf: [["Il ragù cuoce almeno tre ore.", "vero"], ["La famiglia è di dieci persone.", "falso"], ["La nonna usa carne di maiale.", "non si dice"]],
      hunt: { label: "Tocá las medidas y cantidades (mezzo, etto, decina…)", targets: ["mezzo", "chilo", "etto", "mezza", "litro", "decina", "terzo", "metà"] } },

    { id: "w-50", week: 50, n: 19, level: "C1", emoji: "🔤", title: "Parole che ingannano",
      grammar: "lessico avanzato e falsi amici",
      text:
        "Appena arrivata a Roma, Valeria ha detto al suo coinquilino che era \"molto imbarazzata\", " +
        "volendo dire che si vergognava. Lui ha capito subito, ma altre parole sono state più insidiose.\n\n" +
        "Una sera il coinquilino le ha chiesto di passargli il \"burro\" e lei, che pensava all'animale, " +
        "è rimasta a guardarlo confusa: in italiano il burro si spalma sul pane. Poi ha raccontato che il suo capo era \"molto largo\", " +
        "pensando alla generosità, e i colleghi si sono messi a ridere.\n\n" +
        "Ormai Valeria ha imparato la lezione: prima di usare una parola che somiglia allo spagnolo, " +
        "la controlla sul dizionario. \"Le parole più pericolose\", dice, " +
        "\"sono quelle che sembrano facili\".",
      gloss: { imbarazzata: "avergonzada, incómoda", vergognava: "le daba vergüenza", coinquilino: "compañero de departamento",
               insidiose: "traicioneras", burro: "manteca (no el animal)", spalma: "se unta", largo: "ancho",
               generosità: "generosidad", ormai: "a esta altura", somiglia: "se parece", pericolose: "peligrosas" },
      questions: [
        ["Che cosa le ha chiesto il coinquilino?", ["di passargli il burro", "di passargli il pane", "di passargli il formaggio", "di passargli il sale"], "di passargli il burro"],
        ["Perché i colleghi hanno riso?", ["ha usato «largo» per «generoso»", "è arrivata tardi alla riunione", "ha parlato spagnolo con il capo", "ha sbagliato il nome del capo"], "ha usato «largo» per «generoso»"],
        ["Che cosa vuol dire Valeria con l'ultima frase?", ["che le somiglianze possono ingannare", "che l'italiano è una lingua facile", "che il dizionario non serve a niente", "che è meglio parlare poco e ascoltare"], "che le somiglianze possono ingannare"]
      ],
      vf: [["Il coinquilino ha chiesto a Valeria di passargli il burro.", "vero"], ["I colleghi hanno capito subito cosa voleva dire con largo.", "falso"], ["Valeria studia medicina.", "non si dice"]],
      hunt: { label: "Tocá los falsos amigos del texto", targets: ["imbarazzata", "burro", "largo"] } },

    { id: "w-01", week: 1, level: "A1", emoji: "👋", title: "Sono Lucia",
      grammar: "essere e avere",
      text:
        "Ciao! Sono Lucia. Sono italiana, di Roma, e ho ventiquattro anni. " +
        "Sono una studentessa di musica.\n\n" +
        "Ho un fratello, Paolo. Paolo ha trent'anni ed è medico a Milano. " +
        "È alto, simpatico e un po' pigro.\n\n" +
        "Ho anche una gatta, Nina. Nina è piccola e bianca, e ha gli occhi verdi. " +
        "La mia casa è vecchia ma bella, e ha un balcone con i fiori.\n\n" +
        "Oggi è domenica: sono a casa, ho un caffè e un libro. Il libro è nuovo ed è molto bello. Sono contenta!",
      gloss: { ventiquattro: "veinticuatro", "trent'anni": "treinta años (los números, en la semana 7)", po: "(un po') un poco", mia: "mi (la mia casa = mi casa)", studentessa: "estudiante (mujer)", fratello: "hermano", medico: "médico", pigro: "vago, perezoso",
               anche: "también", gatta: "gata", piccola: "chiquita", bianca: "blanca", occhi: "ojos",
               vecchia: "vieja", balcone: "balcón", fiori: "flores", oggi: "hoy", contenta: "contenta" },
      questions: [
        ["¿Cuántos años tiene Lucia?", ["veinticuatro", "treinta", "veinte", "catorce"], "veinticuatro"],
        ["¿Qué hace Paolo?", ["es médico en Milán", "es estudiante", "es músico", "trabaja en un banco en Roma"], "es médico en Milán"],
        ["¿Cómo es la gata?", ["chiquita y blanca, de ojos verdes", "grande y negra, de ojos amarillos", "vieja y gorda", "no tiene gata"], "chiquita y blanca, de ojos verdes"]
      ],
      vf: [["Lucia è di Milano.", "falso"], ["Paolo è il fratello di Lucia.", "vero"], ["Lucia suona il pianoforte.", "non si dice"]],
      hunt: { label: "Tocá las formas de essere y avere", targets: ["sono", "ho", "ha", "è"] } },

    { id: "w-05", week: 5, level: "A1", emoji: "📚", title: "La libraia",
      grammar: "presente dei verbi regolari",
      text:
        "Carla abita a Firenze e lavora in una libreria del centro. La mattina prende " +
        "l'autobus alle otto e legge il giornale. Alle nove apre la libreria e parla con i clienti.\n\n" +
        "A mezzogiorno mangia un panino con la collega, Marta. Il pomeriggio ordina i libri nuovi " +
        "e risponde alle email. Finisce di lavorare alle sette.\n\n" +
        "La sera cucina qualcosa di semplice, guarda un film o telefona alla madre. " +
        "Dorme poco, perché legge sempre fino a tardi. \"I libri sono la mia vita\", dice Carla.",
      gloss: { qualcosa: "algo (qualcosa di semplice = algo simple)", libreria: "librería", giornale: "diario", clienti: "clientes",
               mezzogiorno: "mediodía", panino: "sándwich", collega: "compañera de trabajo", ordina: "ordena",
               risponde: "responde", finisce: "termina", cucina: "cocina", semplice: "simple", tardi: "tarde" },
      questions: [
        ["¿Dónde trabaja Carla?", ["en una librería del centro", "en un diario", "en una escuela del barrio, como maestra", "en un bar"], "en una librería del centro"],
        ["¿A qué hora termina de trabajar?", ["a las siete", "a las nueve", "al mediodía", "a las ocho"], "a las siete"],
        ["¿Por qué duerme poco?", ["lee hasta tarde", "trabaja de noche", "mira películas", "habla con la madre"], "lee hasta tarde"]
      ],
      vf: [["Carla lavora in una libreria.", "vero"], ["Carla va al lavoro in bicicletta.", "falso"], ["Marta è la sorella di Carla.", "falso"]],
      hunt: { label: "Tocá los verbos en presente de la tercera persona (abita, lavora…)", targets: ["abita", "lavora", "prende", "legge", "apre", "parla", "mangia", "ordina", "risponde", "finisce", "cucina", "guarda", "telefona", "dorme"] } },

    { id: "w-09", week: 9, level: "A2", emoji: "🚆", title: "Da Genova a Lugano",
      grammar: "preposizioni",
      text:
        "Tommaso vive a Genova, ma lavora in Svizzera. Ogni lunedì parte da Genova alle sei " +
        "e arriva a Lugano in tre ore. Va in treno, con un libro e un caffè.\n\n" +
        "A Lugano abita da un amico, Marco, in un piccolo appartamento vicino al lago. " +
        "Lavora per una banca e parla tedesco, francese e italiano.\n\n" +
        "Il venerdì torna a casa per il fine settimana. Il sabato va al mercato con la moglie " +
        "e la domenica pranza dai genitori. Tra un viaggio e l'altro Tommaso è sempre stanco, " +
        "ma dice: \"Per ora va bene così\".",
      gloss: { svizzera: "Suiza", ogni: "cada", treno: "tren", appartamento: "departamento", lago: "lago",
               banca: "banco", tedesco: "alemán", torna: "vuelve", moglie: "esposa", pranza: "almuerza",
               genitori: "padres", viaggio: "viaje", stanco: "cansado" },
      questions: [
        ["¿Cómo va Tommaso a Lugano?", ["en tren", "en auto", "en avión", "en colectivo"], "en tren"],
        ["¿Con quién vive en Lugano?", ["con un amigo", "con su esposa", "solo", "con sus padres"], "con un amigo"],
        ["¿Qué hace el domingo?", ["almuerza con sus padres", "trabaja", "va al mercado con su hermana", "viaja a Suiza"], "almuerza con sus padres"]
      ],
      vf: [["Tommaso lavora in Svizzera.", "vero"], ["A Lugano Tommaso vive da solo.", "falso"], ["Marco lavora in banca con Tommaso.", "non si dice"]],
      hunt: { label: "Tocá las preposiciones simples (a, in, da, con, per, tra)", targets: ["a", "in", "da", "con", "per", "tra"] } },

    { id: "w-11", week: 11, level: "A2", emoji: "🚤", title: "Un sabato a Venezia",
      grammar: "passato prossimo",
      text:
        "Sabato scorso Anna e Luca sono andati a Venezia. Sono partiti da Padova alle nove " +
        "e sono arrivati in mezz'ora. Hanno camminato per ore tra calli e ponti e hanno visto piazza San Marco.\n\n" +
        "A pranzo hanno mangiato le sarde in saor in una piccola osteria. Anna ha comprato " +
        "una maschera per sua sorella, Luca ha fatto molte foto.\n\n" +
        "Il pomeriggio hanno preso il vaporetto fino a Murano e hanno visitato una fornace del vetro. " +
        "La sera sono tornati a casa stanchi. \"Abbiamo speso troppo\", ha detto Luca, " +
        "\"ma è stata una giornata perfetta\".",
      gloss: { scorso: "pasado", calli: "callecitas (de Venecia)", ponti: "puentes", pranzo: "almuerzo",
               sarde: "sardinas", osteria: "fonda, bodegón", maschera: "máscara", sorella: "hermana",
               vaporetto: "lancha colectivo", fornace: "horno", vetro: "vidrio", speso: "gastado", troppo: "demasiado" },
      questions: [
        ["¿De dónde salieron?", ["de Padua", "de Roma", "de Murano", "de Milán"], "de Padua"],
        ["¿Qué compró Anna?", ["una máscara para su hermana", "un vaso de vidrio de Murano", "sardinas", "un libro"], "una máscara para su hermana"],
        ["¿Qué dice Luca al final?", ["gastaron mucho, pero fue un día perfecto", "fue un día aburrido", "quiere volver mañana a ver más museos y canales", "Venecia es fea"], "gastaron mucho, pero fue un día perfecto"]
      ],
      vf: [["Anna e Luca sono partiti da Padova.", "vero"], ["Luca ha comprato una maschera.", "falso"], ["A Murano hanno comprato un vaso.", "non si dice"]],
      hunt: { label: "Tocá los participios con essere (andati, partiti…)", targets: ["andati", "partiti", "arrivati", "tornati", "stata"] } },

    { id: "w-12", week: 12, level: "A2", emoji: "👵", title: "Le regole della nonna",
      grammar: "riflessivi e imperativo",
      text:
        "Quando i nipoti arrivano, la nonna Pina dà sempre le sue regole. \"Lavatevi le mani " +
        "prima di mangiare! Sedetevi a tavola e non alzatevi fino alla frutta.\"\n\n" +
        "La mattina i ragazzi si svegliano tardi. \"Alzati, Giacomo! Vestiti e fai colazione\", " +
        "dice la nonna. Giacomo si lamenta, ma si alza.\n\n" +
        "Il pomeriggio si divertono in giardino e la sera si riposano davanti alla televisione. " +
        "\"Non vi addormentate sul divano!\" ripete la nonna. Alla fine, però, è la nonna che si " +
        "addormenta per prima, con gli occhiali sul naso. I nipoti ridono e la coprono con una coperta.",
      gloss: { nipoti: "nietos", regole: "reglas", mani: "manos", tavola: "mesa", svegliano: "despiertan",
               colazione: "desayuno", lamenta: "queja", divertono: "divierten", riposano: "descansan",
               divano: "sillón", occhiali: "anteojos", naso: "nariz", ridono: "se ríen", coperta: "manta" },
      questions: [
        ["¿Qué deben hacer antes de comer?", ["lavarse las manos", "vestirse", "ir al jardín", "mirar la tele"], "lavarse las manos"],
        ["¿Qué hace Giacomo cuando la abuela lo llama?", ["se queja, pero se levanta", "sigue durmiendo", "se enoja y se va a su cuarto", "llora"], "se queja, pero se levanta"],
        ["¿Quién se duerme primero?", ["la abuela", "Giacomo", "los nietos", "nadie"], "la abuela"]
      ],
      vf: [["La nonna vuole che i nipoti si lavino le mani.", "vero"], ["Giacomo si sveglia presto.", "falso"], ["La nonna guarda un film alla televisione.", "non si dice"]],
      hunt: { label: "Tocá los imperativos (lavatevi, sedetevi, alzati…)", targets: ["lavatevi", "sedetevi", "alzatevi", "alzati", "vestiti", "fai", "addormentate"] } },

    { id: "w-13", week: 13, level: "A2", emoji: "🍷", title: "La nuova vicina",
      grammar: "ripasso: presente, passato prossimo, pronomi",
      text:
        "Ieri è arrivata una nuova vicina, Sara. È di Bari e ha ventinove anni. Fa l'architetta " +
        "e lavora in uno studio del centro.\n\n" +
        "L'ho incontrata sulle scale con tre scatole pesanti e l'ho aiutata. Lei mi ha ringraziato " +
        "e mi ha offerto un caffè. Abbiamo parlato di tutto: del lavoro, della città, dei ristoranti. " +
        "Le ho consigliato la trattoria sotto casa e le ho dato il mio numero.\n\n" +
        "Stamattina mi ha scritto: \"Grazie per ieri! Stasera vieni a cena da me?\" Ho messo una camicia elegante, " +
        "ho comprato una bottiglia di vino e alle otto ho suonato alla sua porta.",
      gloss: { vicina: "vecina", architetta: "arquitecta", studio: "estudio", scale: "escaleras",
               scatole: "cajas", pesanti: "pesadas", ringraziato: "agradecido", consigliato: "recomendado",
               trattoria: "bodegón", stamattina: "esta mañana", bottiglia: "botella", suonato: "tocado el timbre" },
      questions: [
        ["¿De dónde es Sara?", ["de Bari", "de Roma", "de Milán", "de Nápoles"], "de Bari"],
        ["¿Cómo se conocieron?", ["en la escalera, con unas cajas", "en un bar", "en el trabajo", "en la trattoria de abajo, un sábado"], "en la escalera, con unas cajas"],
        ["¿Qué lleva el narrador a la cena?", ["una botella de vino", "flores", "una torta", "nada"], "una botella de vino"]
      ],
      vf: [["Sara è di Bari.", "vero"], ["Il narratore ha incontrato Sara al bar.", "falso"], ["Sara ha cucinato il pesce.", "non si dice"]],
      hunt: { label: "Tocá los pronombres de objeto (l', le, mi)", targets: ["l'ho", "le", "mi"] } },

    { id: "w-15", week: 15, level: "A2", emoji: "🌳", title: "L'estate dal nonno",
      grammar: "imperfetto e passato prossimo",
      text:
        "Quando ero bambino passavo le estati dal nonno, in un paese della Puglia. La casa era bianca " +
        "e aveva un grande fico nel cortile.\n\n" +
        "Ogni mattina il nonno mi svegliava presto e andavamo insieme al mercato. Lui conosceva tutti " +
        "e parlava con tutti. Il pomeriggio faceva troppo caldo: dormivamo o giocavamo a carte.\n\n" +
        "Un giorno, però, è successa una cosa strana: mentre raccoglievo i fichi, ho visto un piccolo " +
        "cane sotto l'albero. Era magro e aveva paura. Il nonno l'ha adottato subito e l'ha chiamato Fico.",
      gloss: { estati: "veranos", paese: "pueblo", fico: "higuera, higo", fichi: "higos", cortile: "patio",
               svegliava: "despertaba", presto: "temprano", caldo: "calor", carte: "cartas",
               successa: "pasado, sucedido", raccoglievo: "juntaba", albero: "árbol", magro: "flaco",
               paura: "miedo", adottato: "adoptado" },
      questions: [
        ["¿Dónde pasaba los veranos?", ["en un pueblo de Apulia", "en Roma", "en la playa", "en la montaña"], "en un pueblo de Apulia"],
        ["¿Qué hacían a la tarde?", ["dormían o jugaban a las cartas", "iban al mercado y después a la playa", "nadaban", "trabajaban"], "dormían o jugaban a las cartas"],
        ["¿Cómo se llamó el perro?", ["Fico", "Nonno", "Puglia", "Bianco"], "Fico"]
      ],
      vf: [["La casa del nonno era in Puglia.", "vero"], ["Il pomeriggio andavano al mercato.", "falso"], ["Il cane è vissuto molti anni.", "non si dice"]],
      hunt: { label: "Tocá los verbos en imperfetto", targets: ["ero", "passavo", "era", "aveva", "svegliava", "andavamo", "conosceva", "parlava", "faceva", "dormivamo", "giocavamo", "raccoglievo"] } },

    { id: "w-18", week: 18, level: "A2", emoji: "😩", title: "Che giornata!",
      grammar: "negazioni ed esclamazioni",
      text:
        "Che giornata! Stamattina non ha suonato la sveglia e non ho fatto colazione. Alla fermata " +
        "non c'era nessuno: ho perso l'autobus.\n\n" +
        "In ufficio non funzionava niente, né il computer né la stampante. Il capo non c'era ancora " +
        "e i colleghi non sapevano cosa fare.\n\n" +
        "A pranzo non ho mangiato neanche un panino, perché non avevo più soldi nel portafoglio. Che fame! " +
        "La sera, finalmente, sono arrivato davanti a casa... e non avevo le chiavi! " +
        "Mai più una giornata così, per favore. Che disastro!",
      gloss: { sveglia: "despertador", colazione: "desayuno", fermata: "parada", funzionava: "funcionaba",
               stampante: "impresora", capo: "jefe", colleghi: "compañeros", neanche: "ni siquiera",
               soldi: "plata", portafoglio: "billetera", fame: "hambre", chiavi: "llaves", disastro: "desastre" },
      questions: [
        ["¿Qué pasó en la parada?", ["perdió el colectivo", "era domingo", "llovía", "había paro"], "perdió el colectivo"],
        ["¿Qué no funcionaba en la oficina?", ["ni la computadora ni la impresora", "el ascensor ni el aire acondicionado", "la luz", "el teléfono"], "ni la computadora ni la impresora"],
        ["¿Qué le faltaba a la noche?", ["las llaves", "la billetera", "el celular", "el colectivo"], "las llaves"]
      ],
      vf: [["Stamattina il narratore non ha fatto colazione.", "vero"], ["A pranzo ha mangiato un panino.", "falso"], ["Il narratore ha chiamato un fabbro.", "non si dice"]],
      hunt: { label: "Tocá las palabras negativas (non, nessuno, niente, né…)", targets: ["non", "nessuno", "niente", "né", "neanche", "più", "mai"] } },

    { id: "w-19", week: 19, level: "B1", emoji: "✈️", title: "Il piano di Giulia",
      grammar: "futuro",
      text:
        "Il prossimo anno Giulia finirà l'università e partirà per un anno in Spagna. Vivrà a Valencia " +
        "con due amiche e studierà lo spagnolo.\n\n" +
        "All'inizio cercherà un lavoro in un bar o in un albergo. Poi, quando parlerà bene la lingua, " +
        "farà domanda in una scuola di italiano.\n\n" +
        "I genitori sono un po' preoccupati. \"Come farai con i soldi? Dove abiterai?\" chiede la madre. " +
        "\"Non preoccuparti, mamma: andrà tutto bene\", risponde Giulia. Il padre, invece, sorride: " +
        "\"Sarà un'esperienza bellissima. E noi verremo a trovarti a Natale!\"",
      gloss: { prossimo: "próximo", cercherà: "buscará", albergo: "hotel", lingua: "idioma",
               domanda: "solicitud (fare domanda = postularse)", genitori: "padres", preoccupati: "preocupados",
               soldi: "plata", sorride: "sonríe", esperienza: "experiencia", trovarti: "visitarte" },
      questions: [
        ["¿Adónde se va Giulia?", ["a Valencia, en España", "a Madrid", "a Roma", "a Londres"], "a Valencia, en España"],
        ["¿Dónde trabajará al principio?", ["en un bar o en un hotel", "en una escuela", "en una oficina", "en la universidad, como profesora"], "en un bar o en un hotel"],
        ["¿Qué harán los padres en Navidad?", ["la visitarán", "se quedarán en casa", "irán a la playa", "le mandarán plata"], "la visitarán"]
      ],
      vf: [["Giulia vivrà a Valencia.", "vero"], ["La madre chiede dove abiterà Giulia.", "vero"], ["Giulia ha già un lavoro in Spagna.", "falso"]],
      hunt: { label: "Tocá los verbos en futuro", targets: ["finirà", "partirà", "vivrà", "studierà", "cercherà", "parlerà", "farà", "farai", "abiterai", "andrà", "sarà", "verremo"] } },

    { id: "w-20", week: 20, level: "B1", emoji: "🌅", title: "Un ristorante al mare",
      grammar: "condizionale presente",
      text:
        "Marco lavora in banca, ma non è felice. \"Mi piacerebbe cambiare vita\", dice all'amico Paolo. " +
        "\"Vorrei aprire un piccolo ristorante al mare.\"\n\n" +
        "\"E dove lo apriresti?\" chiede Paolo. \"In Sardegna. Cucinerei pesce fresco e la sera guarderei " +
        "il tramonto dalla terrazza.\"\n\n" +
        "\"Sarebbe bello\", risponde Paolo, \"ma dovresti imparare a cucinare! E il ristorante potrebbe anche non " +
        "guadagnare niente.\" Marco ride: \"Hai ragione. Però almeno sarei libero. Tu verresti a lavorare " +
        "con me?\" \"Forse... ma solo come cliente!\" Ridono tutti e due, ma Marco non dimentica il suo sogno.",
      gloss: { felice: "feliz", pesce: "pescado", fresco: "fresco", tramonto: "atardecer", terrazza: "terraza",
               imparare: "aprender", guadagnare: "ganar (plata)", almeno: "al menos", libero: "libre", forse: "quizás" },
      questions: [
        ["¿Qué quiere hacer Marco?", ["abrir un restaurante frente al mar", "cambiar de banco", "irse a vivir con Paolo a Cerdeña", "aprender a nadar"], "abrir un restaurante frente al mar"],
        ["¿Qué problema ve Paolo?", ["Marco no sabe cocinar", "Cerdeña es cara", "no hay pescado", "Marco es muy joven para eso"], "Marco no sabe cocinar"],
        ["¿Cómo iría Paolo al restaurante?", ["solo como cliente", "como cocinero", "como socio", "no iría"], "solo como cliente"]
      ],
      vf: [["Marco lavora in banca.", "vero"], ["Marco vorrebbe un ristorante in montagna.", "falso"], ["Paolo sa cucinare molto bene.", "non si dice"]],
      hunt: { label: "Tocá los verbos en condizionale", targets: ["piacerebbe", "vorrei", "apriresti", "cucinerei", "guarderei", "sarebbe", "dovresti", "potrebbe", "sarei", "verresti"] } },

    { id: "w-21", week: 21, level: "B1", emoji: "🧺", title: "Il mercato del sabato",
      grammar: "ne e ci",
      text:
        "Il sabato vado al mercato di piazza delle Erbe: ci vado da dieci anni. Compro sempre la frutta " +
        "dal signor Bepi. \"Quante mele vuole?\" \"Ne prendo un chilo.\"\n\n" +
        "Poi passo dal formaggio. \"Il parmigiano? Ne vorrei due etti.\" Al banco del pesce c'è sempre " +
        "la fila, ma ci resto volentieri perché le persone chiacchierano.\n\n" +
        "A volte ci trovo anche la mia amica Lucia. Parliamo del lavoro e dei figli, e ne ridiamo insieme. " +
        "Quando torno a casa la borsa è pesante: ci sono troppe cose! Ma è il mio momento preferito della settimana.",
      gloss: { mele: "manzanas", etti: "cien gramos (due etti = 200 g)", banco: "puesto", fila: "fila, cola",
               volentieri: "con gusto", chiacchierano: "charlan", figli: "hijos", volte: "veces (a volte = a veces)", ridiamo: "nos reímos",
               borsa: "bolsa", pesante: "pesada" },
      questions: [
        ["¿Hace cuánto va a ese mercado?", ["diez años", "un año", "dos meses", "toda la vida"], "diez años"],
        ["¿Cuánto parmesano pide?", ["doscientos gramos", "un kilo", "cien gramos", "medio kilo"], "doscientos gramos"],
        ["¿Por qué no le molesta la fila del pescado?", ["la gente charla", "es corta", "no compra pescado", "va con Lucia"], "la gente charla"]
      ],
      vf: [["Il narratore va al mercato da dieci anni.", "vero"], ["Compra un chilo di parmigiano.", "falso"], ["Lucia vende il pesce al mercato.", "non si dice"]],
      hunt: { label: "Tocá ci y ne", targets: ["ci", "ne"] } },

    { id: "w-22", week: 22, level: "B1", emoji: "📕", title: "Il libro prestato",
      grammar: "pronomi combinati",
      text:
        "Due mesi fa ho prestato un libro a Giorgio. Ieri gliel'ho chiesto: \"Me lo ridai?\" " +
        "\"Certo, te lo porto domani\", mi ha detto.\n\n" +
        "Oggi Giorgio è arrivato senza libro. \"L'ho dato a mia sorella: gliel'ho prestato perché le piace " +
        "quell'autore. Glielo chiedo stasera.\" Mi sono arrabbiato un po'. \"Ma il libro è mio! " +
        "Me l'ha regalato mia madre.\"\n\n" +
        "Giorgio si è scusato: \"Hai ragione. Te lo riporto sabato, te lo prometto.\" " +
        "Sabato il libro è tornato, con un biglietto di sua sorella: \"Grazie! Me lo presti ancora?\"",
      gloss: { prestato: "prestado", ridai: "devolvés", porto: "traigo", sorella: "hermana", autore: "autor",
               arrabbiato: "enojado", regalato: "regalado", scusato: "disculpado", riporto: "devuelvo",
               prometto: "prometo", biglietto: "notita", presti: "prestás" },
      questions: [
        ["¿A quién le dio Giorgio el libro?", ["a su hermana", "a su madre", "a un amigo", "a la biblioteca"], "a su hermana"],
        ["¿Quién le regaló el libro al narrador?", ["su madre", "Giorgio", "su hermana", "un autor"], "su madre"],
        ["¿Qué pide la hermana al final?", ["que se lo preste otra vez", "otro libro de la misma autora", "perdón", "nada"], "que se lo preste otra vez"]
      ],
      vf: [["Giorgio ha dato il libro a sua sorella.", "vero"], ["Il libro è di Giorgio.", "falso"], ["La sorella di Giorgio fa la scrittrice.", "non si dice"]],
      hunt: { label: "Tocá los pronombres combinados (me lo, te lo, glielo…)", targets: ["gliel'ho", "me", "te", "glielo"] } },

    { id: "w-24", week: 24, level: "B1", emoji: "🎂", title: "Il nuovo collega",
      grammar: "congiuntivo presente",
      text:
        "Al lavoro è arrivato un nuovo collega, Stefano. Tutti hanno un'opinione su di lui. Chiara pensa " +
        "che sia simpatico, ma crede che parli troppo. Marco, invece, pensa che lavori poco e che arrivi sempre tardi.\n\n" +
        "Io non lo conosco bene. Credo che abbia bisogno di tempo: è nuovo e forse è timido. " +
        "Spero che si trovi bene con noi.\n\n" +
        "Oggi Stefano ha portato una torta per tutti. \"È il mio compleanno\", ha detto. " +
        "Adesso tutti pensano che sia il collega migliore dell'ufficio!",
      gloss: { collega: "compañero de trabajo", opinione: "opinión", troppo: "demasiado", bisogno: "necesidad (avere bisogno = necesitar)",
               forse: "quizás", timido: "tímido", trovi: "encuentre (trovarsi bene = sentirse a gusto)", torta: "torta",
               compleanno: "cumpleaños", migliore: "mejor", ufficio: "oficina" },
      questions: [
        ["¿Qué piensa Chiara de Stefano?", ["que es simpático pero habla mucho", "que trabaja poco y siempre llega tarde", "que llega tarde", "que es tímido"], "que es simpático pero habla mucho"],
        ["¿Qué cree el narrador?", ["que necesita tiempo", "que es antipático con todos", "que se va a ir", "que es el jefe"], "que necesita tiempo"],
        ["¿Por qué trajo una torta?", ["era su cumpleaños", "para pedir perdón", "se iba", "era viernes"], "era su cumpleaños"]
      ],
      vf: [["Stefano è un nuovo collega.", "vero"], ["Chiara pensa che Stefano parli poco.", "falso"], ["Stefano ha fatto la torta da solo.", "non si dice"]],
      hunt: { label: "Tocá los verbos en congiuntivo", targets: ["sia", "parli", "lavori", "arrivi", "abbia", "trovi"] } },

    { id: "w-25", week: 25, level: "B1", emoji: "👔", title: "Consigli per un colloquio",
      grammar: "congiuntivo: quando si usa",
      text:
        "Domani Elena ha un colloquio importante. Sua sorella le dà qualche consiglio. \"È importante che tu " +
        "arrivi dieci minuti prima. Bisogna che ti vesta in modo semplice ed elegante.\"\n\n" +
        "\"E se mi fanno domande difficili?\" \"È normale che tu sia nervosa. Prima di rispondere, ascolta " +
        "bene la domanda. Anche se non sai tutto, è meglio che tu dica la verità.\"\n\n" +
        "Elena ha paura che il direttore sia antipatico. \"Non credo che sia così\", dice la sorella. " +
        "\"Basta che tu sorrida e che parli con calma. Sono sicura che andrà bene.\"",
      gloss: { colloquio: "entrevista de trabajo", consiglio: "consejo", bisogna: "hace falta", vesta: "vistas",
               semplice: "simple", nervosa: "nerviosa", verità: "verdad", paura: "miedo", direttore: "director",
               basta: "alcanza con", sorrida: "sonrías", calma: "calma" },
      questions: [
        ["¿Cuándo tiene que llegar Elena?", ["diez minutos antes", "a la hora justa", "una hora antes", "tarde"], "diez minutos antes"],
        ["¿Qué hacer si no sabe algo?", ["decir la verdad", "inventar", "cambiar de tema", "irse"], "decir la verdad"],
        ["¿De qué tiene miedo Elena?", ["de que el director sea antipático", "de llegar tarde el primer día de trabajo", "de la ropa", "de su hermana"], "de que el director sea antipático"]
      ],
      vf: [["Elena ha un colloquio domani.", "vero"], ["La sorella le consiglia di arrivare in ritardo.", "falso"], ["Il colloquio è in una banca.", "non si dice"]],
      hunt: { label: "Tocá los congiuntivi", targets: ["arrivi", "vesta", "sia", "dica", "sorrida", "parli"] } },

    { id: "w-26", week: 26, level: "B1", emoji: "📔", title: "Caro diario",
      grammar: "ripasso: futuro, congiuntivo, pronomi",
      text:
        "Caro diario, domani comincia il mio nuovo lavoro a Torino e sono un po' agitato. Ho già preparato " +
        "tutto: i vestiti, la borsa e i documenti. Mia madre me li ha controllati due volte.\n\n" +
        "Spero che i colleghi siano gentili e che il capo non sia troppo severo. Penso che all'inizio farò " +
        "qualche errore, ma imparerò in fretta.\n\n" +
        "Quando ero studente sognavo un lavoro così. Ora ci sono quasi: domani alle nove entrerò in ufficio " +
        "e dirò \"Buongiorno!\" con il mio sorriso migliore. Chissà come andrà!",
      gloss: { diario: "diario (íntimo)", agitato: "nervioso", vestiti: "ropa", documenti: "papeles",
               controllati: "revisado", volte: "veces", severo: "severo", inizio: "principio", fretta: "apuro (in fretta = rápido)",
               sognavo: "soñaba", quasi: "casi", sorriso: "sonrisa", chissà: "quién sabe" },
      questions: [
        ["¿Dónde empieza a trabajar?", ["en Turín", "en Roma", "en Milán", "en casa"], "en Turín"],
        ["¿Quién revisó los papeles?", ["su madre", "el jefe", "un colega", "nadie"], "su madre"],
        ["¿Qué espera de los colegas?", ["que sean amables", "que lo ayuden con plata", "que no estén", "que hablen inglés"], "que sean amables"]
      ],
      vf: [["Il nuovo lavoro è a Torino.", "vero"], ["La madre ha controllato i documenti una volta sola.", "falso"], ["Il capo è una donna.", "non si dice"]],
      hunt: { label: "Tocá los verbos en futuro", targets: ["farò", "imparerò", "entrerò", "dirò", "andrà"] } },

    { id: "w-29", week: 29, level: "B2", emoji: "🎸", title: "Il concerto",
      grammar: "congiuntivo passato",
      text:
        "Ieri sera c'era il concerto di Vasco Rossi, ma Luca non è venuto. I suoi amici non capiscono perché. " +
        "\"Credo che abbia perso il treno\", dice Sara. \"Penso che se ne sia dimenticato\", risponde Paolo. " +
        "\"È strano che non ci abbia scritto niente.\"\n\n" +
        "Stamattina Luca ha telefonato: \"Scusate! Mi dispiace che siate rimasti ad aspettarmi. Ho avuto " +
        "la febbre tutta la notte.\"\n\n" +
        "\"Speriamo che tu sia guarito, almeno\", ha detto Sara. \"Sì, sto meglio. Ma mi dispiace " +
        "che il concerto sia finito senza di me!\"",
      gloss: { concerto: "recital", perso: "perdido", dimenticato: "olvidado", strano: "raro", scusate: "disculpen",
               dispiace: "da pena (mi dispiace = lo siento)", rimasti: "quedado", aspettarmi: "esperarme",
               febbre: "fiebre", guarito: "curado", almeno: "al menos" },
      questions: [
        ["Che cosa pensa Sara?", ["che Luca abbia perso il treno", "che Luca se ne sia dimenticato", "che Luca sia arrabbiato", "che Luca si sia addormentato"], "che Luca abbia perso il treno"],
        ["Perché Luca non è andato al concerto?", ["perché aveva la febbre", "perché ha perso il treno", "perché se n'era dimenticato", "perché doveva lavorare"], "perché aveva la febbre"],
        ["Che cosa si capisce dalla frase di Paolo «È strano che non ci abbia scritto niente»?", ["che di solito Luca avvisa se non viene", "che Luca arriva sempre tardi ai concerti", "che il concerto era stato annullato ieri", "che Luca non ama Vasco Rossi"], "che di solito Luca avvisa se non viene"]
      ],
      vf: [["Luca non è andato al concerto.", "vero"], ["Luca ha perso il treno.", "falso"], ["Il concerto è finito a mezzanotte.", "non si dice"]],
      hunt: { label: "Tocá los auxiliares del congiuntivo passato (abbia, sia, siate)", targets: ["abbia", "sia", "siate"] } },

    { id: "w-30", week: 30, level: "B2", emoji: "🎹", title: "Il pianoforte",
      grammar: "congiuntivo imperfetto e trapassato",
      text:
        "Da piccola Marta voleva che suo padre la portasse ogni domenica al mare. Sperava che il sole " +
        "non finisse mai e che l'estate durasse tutto l'anno.\n\n" +
        "Sua madre, invece, voleva che studiasse il pianoforte. \"Se non studi, non imparerai mai\", diceva. " +
        "Marta faceva finta che le piacesse, ma pensava solo al mare.\n\n" +
        "Anni dopo, Marta ha scoperto che sua madre da giovane aveva suonato in un'orchestra. Non immaginava " +
        "che avesse avuto quel sogno e che ci avesse rinunciato per la famiglia. Quella sera ha riaperto il pianoforte.",
      gloss: { portasse: "llevara", sperava: "esperaba", durasse: "durara", studiasse: "estudiara",
               pianoforte: "piano", finta: "de cuenta (fare finta = hacer de cuenta)", scoperto: "descubierto",
               suonato: "tocado", orchestra: "orquesta", sogno: "sueño", rinunciato: "renunciado", riaperto: "vuelto a abrir" },
      questions: [
        ["Che cosa voleva Marta da piccola?", ["andare al mare la domenica", "studiare il pianoforte", "suonare in un'orchestra", "restare a casa con la madre"], "andare al mare la domenica"],
        ["Che cosa ha scoperto Marta anni dopo?", ["che la madre aveva suonato da giovane", "che il padre era stato un musicista", "che la madre odiava il pianoforte", "che l'orchestra cercava una pianista"], "che la madre aveva suonato da giovane"],
        ["Perché, secondo te, quella sera Marta riapre il pianoforte?", ["perché ha capito il sogno della madre", "perché aveva un concerto il giorno dopo", "perché voleva tornare al mare", "perché la madre gliel'aveva ordinato"], "perché ha capito il sogno della madre"]
      ],
      vf: [["Da piccola Marta amava il mare.", "vero"], ["Il padre voleva che Marta suonasse il pianoforte.", "falso"], ["La madre suonava il violino.", "non si dice"]],
      hunt: { label: "Tocá los congiuntivi imperfetti y trapassati", targets: ["portasse", "finisse", "durasse", "studiasse", "piacesse", "avesse"] } },

    { id: "w-31", week: 31, level: "B2", emoji: "🚕", title: "Il treno perso",
      grammar: "condizionale passato",
      text:
        "Venerdì Paolo doveva partire per Roma alle sette. Avrebbe voluto dormire di più, ma aveva un " +
        "appuntamento importante. Purtroppo il taxi è arrivato tardi e il treno è partito senza di lui.\n\n" +
        "\"Sarei dovuto uscire prima\", ha pensato. \"Avrei potuto prendere la metro.\" Ha telefonato al " +
        "cliente: \"Mi dispiace, sarei arrivato alle dieci, ma adesso arriverò a mezzogiorno.\"\n\n" +
        "Il cliente è stato gentile: \"Non si preoccupi. Anch'io avrei preferito vederla più tardi: " +
        "ho avuto una mattinata terribile!\" Paolo ha riso, finalmente tranquillo.",
      gloss: { appuntamento: "cita", purtroppo: "lamentablemente", metro: "subte",
               cliente: "cliente", dispiace: "lamento", mezzogiorno: "mediodía", preoccupi: "preocupe",
               preferito: "preferido", mattinata: "mañana" },
      questions: [
        ["Perché Paolo ha perso il treno?", ["il taxi è arrivato tardi", "si è svegliato tardi", "c'era uno sciopero", "ha sbagliato stazione"], "il taxi è arrivato tardi"],
        ["Che cosa avrebbe potuto fare Paolo?", ["prendere la metro", "andare in macchina", "partire il giorno dopo", "telefonare prima"], "prendere la metro"],
        ["Perché alla fine Paolo è tranquillo?", ["il cliente non è arrabbiato", "ha preso il treno successivo", "il cliente ha annullato tutto", "è arrivato in orario"], "il cliente non è arrabbiato"]
      ],
      vf: [["Paolo ha perso il treno delle sette.", "vero"], ["Il cliente si è arrabbiato.", "falso"], ["Paolo lavora a Roma.", "non si dice"]],
      hunt: { label: "Tocá los condizionali passati (avrebbe voluto, sarei dovuto…)", targets: ["avrebbe", "sarei", "avrei"] } },

    { id: "w-33", week: 33, level: "B2", emoji: "🏛️", title: "Se fossi sindaco",
      grammar: "periodo ipotetico",
      text:
        "A scuola la maestra chiede ai bambini: \"Che cosa fareste se foste sindaci della città?\" Luca risponde " +
        "subito: \"Se fossi sindaco, costruirei un parco giochi in ogni quartiere.\"\n\n" +
        "Giulia ci pensa un po': \"Se avessi tanti soldi, darei una casa a tutte le persone che non ce l'hanno.\" " +
        "Marco, invece, ride: \"Se comandassi io, la scuola comincerebbe alle dieci!\"\n\n" +
        "La maestra sorride. \"E se foste stati sindaci l'anno scorso, che cosa avreste cambiato?\" \"Avremmo " +
        "chiuso le strade alle macchine\", dice Giulia. \"Così adesso potremmo giocare fuori!\"",
      gloss: { maestra: "maestra", sindaco: "intendente", sindaci: "intendentes", costruirei: "construiría",
               giochi: "juegos (parco giochi = plaza de juegos)", quartiere: "barrio", comandassi: "mandara",
               chiuso: "cerrado", strade: "calles", fuori: "afuera" },
      questions: [
        ["Che cosa costruirebbe Luca?", ["un parco giochi in ogni quartiere", "una scuola nuova in ogni quartiere", "uno stadio vicino alla scuola", "una casa per ogni famiglia"], "un parco giochi in ogni quartiere"],
        ["Che cosa cambierebbe Marco?", ["l'orario della scuola", "il traffico della città", "il numero delle case", "i giochi del parco"], "l'orario della scuola"],
        ["Perché, secondo Giulia, chiudere le strade sarebbe stato utile?", ["oggi i bambini potrebbero giocare fuori", "le macchine andrebbero più piano in centro", "la scuola comincerebbe più tardi la mattina", "il sindaco sarebbe più contento"], "oggi i bambini potrebbero giocare fuori"]
      ],
      vf: [["Luca costruirebbe un parco giochi.", "vero"], ["Marco vorrebbe cominciare la scuola alle otto.", "falso"], ["La maestra è stata sindaca.", "non si dice"]],
      hunt: { label: "Tocá los verbos de las condiciones con «se»", targets: ["foste", "fossi", "avessi", "comandassi"] } },

    { id: "w-34", week: 34, level: "B2", emoji: "📖", title: "La mia libreria",
      grammar: "pronomi relativi",
      text:
        "C'è una libreria in cui passo ore intere. È in una piccola via che pochi conoscono, vicino a un ponte " +
        "da cui vedo il fiume.\n\n" +
        "Il proprietario, che si chiama Ettore, è un signore anziano con cui parlo sempre di romanzi. " +
        "Conosce ogni libro che ha sugli scaffali. Gli scaffali sono pieni di libri usati, alcuni dei quali " +
        "hanno più di cent'anni.\n\n" +
        "I clienti che entrano per la prima volta restano sorpresi. La cosa che mi piace di più è l'odore " +
        "della carta. È il posto in cui mi sento a casa.",
      gloss: { libreria: "librería", intere: "enteras", ponte: "puente", fiume: "río", proprietario: "dueño",
               anziano: "mayor, viejo", romanzi: "novelas", scaffali: "estantes", usati: "usados",
               sorpresi: "sorprendidos", odore: "olor", carta: "papel" },
      questions: [
        ["Che cosa si vede dal ponte?", ["il fiume", "il mare", "la libreria", "la piazza"], "il fiume"],
        ["Chi è Ettore?", ["il libraio", "un cliente abituale", "uno scrittore anziano", "il nonno del narratore"], "il libraio"],
        ["Perché il narratore dice che lì si sente a casa?", ["è un posto familiare e tranquillo", "ci lavora da molti anni ormai", "abita proprio sopra la libreria", "ci trova sempre libri molto economici"], "è un posto familiare e tranquillo"]
      ],
      vf: [["Il proprietario si chiama Ettore.", "vero"], ["La libreria vende solo libri nuovi.", "falso"], ["Ettore ha scritto un romanzo.", "non si dice"]],
      hunt: { label: "Tocá los relativos (che, cui, quali)", targets: ["che", "cui", "quali"] } },

    { id: "w-36", week: 36, level: "B2", emoji: "🍝", title: "In Italia si fa così",
      grammar: "si passivante e si impersonale",
      text:
        "In Italia, a tavola, si seguono alcune regole. Il cappuccino si beve solo la mattina, mai dopo pranzo. " +
        "La pasta non si taglia con il coltello e sugli spaghetti al pesce non si mette il parmigiano.\n\n" +
        "Al bar si paga prima alla cassa e poi si ordina al banco. Il caffè si prende in piedi, velocemente.\n\n" +
        "La domenica si pranza con la famiglia e si sta a tavola per ore. Si parla di tutto: di politica, " +
        "di calcio, di cucina. E quando si va a casa di qualcuno, non si arriva mai a mani vuote: " +
        "si porta un dolce o una bottiglia di vino.",
      gloss: { regole: "reglas", taglia: "corta", coltello: "cuchillo", pesce: "pescado", cassa: "caja",
               banco: "barra", piedi: "pie (in piedi = parado)", velocemente: "rápido", calcio: "fútbol",
               mani: "manos", vuote: "vacías", dolce: "postre" },
      questions: [
        ["Quando si beve il cappuccino?", ["solo la mattina", "dopo pranzo", "la sera", "a ogni ora"], "solo la mattina"],
        ["Che cosa si fa prima, al bar?", ["si paga alla cassa", "si ordina al banco", "ci si siede al tavolo", "si beve il caffè"], "si paga alla cassa"],
        ["Che cosa si capisce del pranzo della domenica?", ["è un momento lungo e importante", "è un pasto veloce e leggero", "si mangia sempre al ristorante", "si fa solo per le feste"], "è un momento lungo e importante"]
      ],
      vf: [["In Italia il cappuccino si beve la mattina.", "vero"], ["Al bar si ordina prima di pagare.", "falso"], ["In Italia si cena alle nove.", "non si dice"]],
      hunt: { label: "Tocá el «si»", targets: ["si"] } },

    { id: "w-37", week: 37, level: "B2", emoji: "🌊", title: "La leggenda di Colapesce",
      grammar: "passato remoto",
      text:
        "Tanto tempo fa, a Messina, visse un ragazzo che si chiamava Cola. Passava le giornate in mare e nuotava " +
        "come un pesce: per questo lo chiamarono Colapesce.\n\n" +
        "Un giorno il re volle metterlo alla prova. Gettò una coppa d'oro in mare e Cola la riportò. Poi gettò " +
        "una corona, e Cola la ritrovò.\n\n" +
        "Alla fine il re lanciò un anello nel punto più profondo. Cola si tuffò e scoprì che la Sicilia " +
        "poggiava su tre colonne, e che una era rotta. Decise di restare sotto il mare a sostenerla. " +
        "Da quel giorno nessuno lo vide più.",
      gloss: { nuotava: "nadaba", pesce: "pez", prova: "prueba", gettò: "tiró",
               coppa: "copa", oro: "oro", corona: "corona", anello: "anillo", profondo: "profundo",
               tuffò: "zambulló", poggiava: "se apoyaba", colonne: "columnas", rotta: "rota", sostenerla: "sostenerla" },
      questions: [
        ["Perché chiamarono il ragazzo Colapesce?", ["nuotava come un pesce", "vendeva pesce al mercato", "era figlio di un pescatore", "aveva paura del mare"], "nuotava come un pesce"],
        ["Che cosa scoprì Cola in fondo al mare?", ["che una delle colonne era rotta", "un tesoro pieno di monete d'oro", "una città sommersa e deserta", "l'anello e la corona del re"], "che una delle colonne era rotta"],
        ["Che cosa vuole spiegare la leggenda?", ["perché la Sicilia non affonda", "perché il re era crudele", "perché a Messina si pesca molto", "come è nato il mare"], "perché la Sicilia non affonda"]
      ],
      vf: [["Cola nuotava come un pesce.", "vero"], ["Cola non riuscì a riportare la coppa.", "falso"], ["Il re aveva tre figlie.", "non si dice"]],
      hunt: { label: "Tocá los verbos en passato remoto", targets: ["visse", "chiamarono", "volle", "gettò", "riportò", "ritrovò", "lanciò", "tuffò", "scoprì", "decise", "vide"] } },

    { id: "w-38", week: 38, level: "B2", emoji: "☎️", title: "La telefonata di Anna",
      grammar: "discorso indiretto",
      text:
        "Ieri Anna mi ha telefonato. Mi ha detto che aveva trovato un nuovo lavoro a Milano e che sarebbe " +
        "partita la settimana dopo. Mi ha chiesto se potevo aiutarla con il trasloco.\n\n" +
        "Le ho risposto che quel sabato lavoravo, ma che la domenica ero libero. Lei ha detto che andava " +
        "benissimo e che mi avrebbe offerto la cena.\n\n" +
        "Poi mi ha raccontato che il suo capo le aveva promesso uno stipendio più alto. Mi ha detto di non " +
        "dirlo a nessuno, perché non era ancora sicura. Io le ho promesso che avrei mantenuto il segreto.",
      gloss: { trasloco: "mudanza", libero: "libre", offerto: "invitado, ofrecido",
               capo: "jefe", promesso: "prometido", stipendio: "sueldo", sicura: "segura", mantenuto: "guardado",
               segreto: "secreto" },
      questions: [
        ["Che cosa ha chiesto Anna al narratore?", ["un aiuto per il trasloco", "un prestito", "un lavoro a Milano", "un consiglio sul capo"], "un aiuto per il trasloco"],
        ["Quando può aiutarla il narratore?", ["la domenica", "il sabato", "il venerdì", "mai"], "la domenica"],
        ["Perché Anna chiede di non dire niente dello stipendio?", ["non è ancora sicura di averlo", "vuole farne una sorpresa al marito", "il capo le ha chiesto il segreto", "teme l'invidia dei vecchi colleghi"], "non è ancora sicura di averlo"]
      ],
      vf: [["Anna ha trovato un lavoro a Milano.", "vero"], ["Il narratore è libero il sabato.", "falso"], ["Anna si trasferisce con il fidanzato.", "non si dice"]],
      hunt: { label: "Tocá los condizionali passati del discurso indirecto", targets: ["sarebbe", "avrebbe", "avrei"] } },

    { id: "w-39", week: 39, level: "B2", emoji: "🚢", title: "Il nonno emigrante",
      grammar: "ripasso: passato remoto, periodo ipotetico, congiuntivo",
      text:
        "Mio nonno partì per l'Argentina nel 1951. Aveva vent'anni e non parlava una parola di spagnolo. " +
        "Raccontava sempre che, se non fosse partito, avrebbe fatto il contadino come suo padre.\n\n" +
        "A Buenos Aires trovò lavoro in una fabbrica, dove conobbe mia nonna, che era figlia di italiani. " +
        "Si sposarono due anni dopo.\n\n" +
        "Quando gli chiedevo se gli mancasse l'Italia, mi rispondeva che l'Italia era nei suoi ricordi, " +
        "ma che la sua casa era lì. Credo che sia stato un uomo coraggioso: non so se io ci sarei riuscito.",
      gloss: { raccontava: "contaba", contadino: "campesino", fabbrica: "fábrica",
               conobbe: "conoció", sposarono: "casaron", mancasse: "extrañara", ricordi: "recuerdos",
               coraggioso: "valiente", riuscito: "logrado" },
      questions: [
        ["Quando partì il nonno?", ["nel 1951", "nel 1915", "nel 1981", "nel 1961"], "nel 1951"],
        ["Dove conobbe la nonna?", ["in una fabbrica", "sulla nave", "in Italia", "a una festa"], "in una fabbrica"],
        ["Che cosa pensa il narratore del nonno?", ["che fosse un uomo coraggioso", "che abbia sbagliato a partire", "che fosse infelice in Argentina", "che volesse tornare in Italia"], "che fosse un uomo coraggioso"]
      ],
      vf: [["Il nonno partì per l'Argentina a vent'anni.", "vero"], ["Il nonno parlava bene lo spagnolo.", "falso"], ["Il nonno tornò in Italia da vecchio.", "non si dice"]],
      hunt: { label: "Tocá los verbos en passato remoto", targets: ["partì", "trovò", "conobbe", "sposarono"] } },

    { id: "w-40", week: 40, level: "C1", emoji: "🏡", title: "Una casa da sistemare",
      grammar: "causativo: fare e lasciare",
      text:
        "Io e mio marito abbiamo comprato una casa vecchia in campagna. Non sappiamo fare niente, quindi " +
        "facciamo fare tutto agli altri.\n\n" +
        "Abbiamo fatto rifare il tetto da un'impresa e abbiamo fatto dipingere le pareti da un amico pittore. " +
        "Ieri ho fatto controllare l'impianto elettrico, perché le luci si spegnevano da sole.\n\n" +
        "I vicini ci guardano curiosi. La signora Rosa ci ha lasciato usare il suo giardino per i materiali, " +
        "e suo figlio ci ha fatto vedere dove comprare la legna. Mio marito dice che si farà crescere la barba " +
        "e vivrà come un contadino. Io lo lascio sognare.",
      gloss: { marito: "marido", campagna: "campo", tetto: "techo", impresa: "empresa",
               dipingere: "pintar", pareti: "paredes", pittore: "pintor", impianto: "instalación",
               spegnevano: "apagaban", legna: "leña", barba: "barba", contadino: "campesino", sognare: "soñar" },
      questions: [
        ["Chi ha dipinto le pareti?", ["un amico pittore", "loro stessi", "un'impresa", "la vicina"], "un amico pittore"],
        ["Perché hanno fatto controllare l'impianto elettrico?", ["le luci si spegnevano da sole", "l'impianto era troppo vecchio", "la vicina si lamentava del rumore", "mancava la corrente da giorni"], "le luci si spegnevano da sole"],
        ["Che cosa pensa la narratrice del sogno del marito?", ["che sia solo un sogno innocuo", "che sia un'idea pericolosa", "che sia già realtà", "che debba realizzarlo subito"], "che sia solo un sogno innocuo"]
      ],
      vf: [["La casa è in campagna.", "vero"], ["Hanno rifatto il tetto da soli.", "falso"], ["La signora Rosa vive da sola.", "non si dice"]],
      hunt: { label: "Tocá fare y lasciare seguidos de infinitivo", targets: ["fare", "fatto", "lasciato", "farà", "lascio"] } },

    { id: "w-41", week: 41, level: "C1", emoji: "🌙", title: "Una notte in campagna",
      grammar: "verbi di percezione",
      text:
        "La prima notte in campagna non riuscivo a dormire. Sentivo le cicale cantare e i cani abbaiare " +
        "lontano. Dalla finestra vedevo la luna salire dietro le colline.\n\n" +
        "A un certo punto ho sentito qualcuno camminare in giardino. Ho visto un'ombra passare vicino alla " +
        "porta e ho sentito il cuore battere forte.\n\n" +
        "Ho acceso la luce e ho visto... un gatto nero mangiare dalla ciotola del cane! Mi ha guardato un " +
        "momento e poi è scappato. Ho riso da sola e finalmente mi sono addormentata, mentre sentivo il " +
        "vento muovere le foglie.",
      gloss: { riuscivo: "lograba", cicale: "chicharras", abbaiare: "ladrar", lontano: "lejos", colline: "colinas",
               ombra: "sombra", cuore: "corazón", battere: "latir", acceso: "prendido", ciotola: "cuenco",
               scappato: "escapado", vento: "viento", foglie: "hojas" },
      questions: [
        ["Che cosa sentiva la narratrice all'inizio?", ["le cicale e i cani lontano", "la musica di una festa", "il mare e le campane", "le macchine sulla strada vicina"], "le cicale e i cani lontano"],
        ["Chi c'era in giardino?", ["un gatto nero", "un ladro", "il cane", "il vicino"], "un gatto nero"],
        ["Perché la narratrice ride da sola?", ["si era spaventata per niente", "il gatto era buffo", "si ricordava una barzelletta", "il cane dormiva"], "si era spaventata per niente"]
      ],
      vf: [["La prima notte la narratrice non riusciva a dormire.", "vero"], ["In giardino c'era un ladro.", "falso"], ["Il cane dormiva in casa.", "non si dice"]],
      hunt: { label: "Tocá los verbos de percepción (sentivo, vedevo, ho visto…)", targets: ["sentivo", "vedevo", "sentito", "visto"] } },

    { id: "w-42", week: 42, level: "C1", emoji: "🏃", title: "Buoni propositi",
      grammar: "verbi e preposizioni",
      text:
        "A gennaio Luca ha deciso di cambiare vita. Ha smesso di fumare e ha cominciato a correre ogni mattina. " +
        "Ha promesso alla moglie di tornare a casa prima di sera e ha provato a imparare a cucinare.\n\n" +
        "Ha anche pensato di iscriversi a un corso di chitarra, ma non è riuscito a trovare il tempo. " +
        "Si è abituato a svegliarsi alle sei, però si è stancato di mangiare solo insalata.\n\n" +
        "A marzo sua moglie gli ha chiesto: \"Continui a correre?\" Luca ha finto di non sentire. " +
        "\"Almeno hai smesso di fumare\", ha detto lei. \"Quello sì\", ha risposto lui, orgoglioso.",
      gloss: { smesso: "dejado", fumare: "fumar", provato: "intentado",
               iscriversi: "anotarse", chitarra: "guitarra", riuscito: "logrado", abituato: "acostumbrado",
               stancato: "cansado", insalata: "ensalada", finto: "fingido", orgoglioso: "orgulloso" },
      questions: [
        ["Che cosa ha smesso di fare Luca a gennaio?", ["di fumare", "di correre", "di lavorare", "di cucinare"], "di fumare"],
        ["Perché non ha fatto il corso di chitarra?", ["non ha trovato il tempo", "il corso costava troppo", "la chitarra non gli piaceva", "si è fatto male a una mano"], "non ha trovato il tempo"],
        ["Perché Luca finge di non sentire la domanda della moglie?", ["ha smesso di correre", "non ha capito la domanda", "è diventato sordo", "sta ascoltando la musica"], "ha smesso di correre"]
      ],
      vf: [["Luca ha smesso di fumare.", "vero"], ["Luca si è iscritto a un corso di chitarra.", "falso"], ["Luca ha perso cinque chili.", "non si dice"]],
      hunt: { label: "Tocá las preposiciones que siguen al verbo (di, a)", targets: ["di", "a"] } },

    { id: "w-44", week: 44, level: "C1", emoji: "🌉", title: "Tornando a casa",
      grammar: "gerundio e participio",
      text:
        "Tornando a casa dal lavoro, Silvia ha incontrato una vecchia amica. Parlando del passato, si sono " +
        "accorte di non vedersi da dieci anni.\n\n" +
        "Finita la cena, hanno camminato lungo il fiume, ridendo come ragazze. Arrivate al ponte, si sono " +
        "fermate a guardare le luci della città.\n\n" +
        "\"Pensando a quegli anni, mi viene nostalgia\", ha detto l'amica. Silvia, sorridendo, le ha preso il " +
        "braccio: \"Vedendoti, mi sembra ieri.\" Prima di salutarsi davanti alla stazione, si sono promesse " +
        "di rivedersi presto. E questa volta, conoscendole, lo faranno davvero.",
      gloss: { accorte: "dado cuenta", lungo: "a lo largo de", fiume: "río", ridendo: "riéndose", ponte: "puente",
               fermate: "detenido", nostalgia: "nostalgia", sorridendo: "sonriendo", braccio: "brazo",
               salutarsi: "despedirse", promesse: "prometido", davvero: "de verdad" },
      questions: [
        ["Da quanto tempo le due amiche non si vedevano?", ["da dieci anni", "da un anno", "da vent'anni", "da un mese"], "da dieci anni"],
        ["Dove si sono fermate a guardare le luci?", ["sul ponte", "alla stazione", "al bar", "a casa"], "sul ponte"],
        ["Che cosa vuol dire l'ultima frase del testo?", ["che il narratore ci crede davvero", "che probabilmente non si rivedranno più", "che si sono già riviste il giorno dopo", "che faranno un viaggio insieme"], "che il narratore ci crede davvero"]
      ],
      vf: [["Silvia e l'amica non si vedevano da dieci anni.", "vero"], ["Si sono salutate al ponte.", "falso"], ["L'amica abita in un'altra città.", "non si dice"]],
      hunt: { label: "Tocá los gerundios y participios (tornando, finita…)", targets: ["tornando", "parlando", "finita", "ridendo", "arrivate", "pensando", "sorridendo", "vedendoti", "conoscendole"] } },

    { id: "w-45", week: 45, level: "C1", emoji: "🏅", title: "La maratona",
      grammar: "costruzioni verbali speciali",
      text:
        "Domenica Paolo ha corso la sua prima maratona. Ci ha messo quattro ore e mezza, ma ce l'ha fatta. " +
        "Al trentesimo chilometro voleva andarsene a casa: le gambe non ce la facevano più.\n\n" +
        "Un signore anziano l'ha superato sorridendo, e Paolo se l'è presa un po'. \"Se ce la fa lui, " +
        "ce la faccio anch'io\", ha pensato.\n\n" +
        "All'arrivo sua figlia gli ha detto: \"Te la sei cavata bene, papà!\" Paolo non ci credeva: era " +
        "stanco morto ma felice. \"L'anno prossimo ci metterò meno\", ha promesso. \"Vedremo\", ha detto la moglie ridendo.",
      gloss: { maratona: "maratón", messo: "tardado (metterci)", trentesimo: "trigésimo", andarsene: "irse",
               gambe: "piernas", anziano: "mayor", superato: "pasado", presa: "ofendido (prendersela)",
               arrivo: "llegada", cavata: "arreglado (cavarsela = arreglárselas)", morto: "muerto" },
      questions: [
        ["Quanto ci ha messo Paolo?", ["quattro ore e mezza", "tre ore e un quarto", "cinque ore e mezza", "due ore e mezza"], "quattro ore e mezza"],
        ["Perché Paolo se l'è presa?", ["un signore anziano l'ha superato", "ha cominciato a piovere forte", "faceva troppo caldo per correre", "la figlia è arrivata prima di lui"], "un signore anziano l'ha superato"],
        ["Che cosa pensa la moglie della promessa di Paolo?", ["è un po' scettica", "è entusiasta", "è arrabbiata", "non l'ha sentita"], "è un po' scettica"]
      ],
      vf: [["Paolo ci ha messo quattro ore e mezza.", "vero"], ["Paolo si è ritirato al trentesimo chilometro.", "falso"], ["La figlia di Paolo ha corso con lui.", "non si dice"]],
      hunt: { label: "Tocá las partículas de los verbos pronominales (ce, ci, se, te)", targets: ["ce", "ci", "se", "te"] } },

    { id: "w-48", week: 48, level: "C1", emoji: "☕", title: "Il barista Gino",
      grammar: "ordine delle parole e dislocazioni",
      text:
        "Il caffè, lo prendo sempre al bar sotto casa. Il barista, Gino, lo conosco da vent'anni. Di calcio, " +
        "con lui, ne parlo ogni mattina, anche se tifiamo per squadre diverse.\n\n" +
        "\"La Juve, quest'anno, non la ferma nessuno\", dice lui. \"Ma che dici? Lo scudetto lo vince l'Inter\", " +
        "rispondo io.\n\n" +
        "È stato lui a farmi conoscere mia moglie: era una cliente anche lei. Il cornetto, invece, l'ho sempre " +
        "preso altrove, perché quelli di Gino sono duri come pietre. Ma questo, a lui, non gliel'ho mai detto.",
      gloss: { tifiamo: "somos hinchas", squadre: "equipos", ferma: "para", scudetto: "campeonato",
               cornetto: "medialuna", altrove: "en otro lado", duri: "duros", pietre: "piedras" },
      questions: [
        ["Da quanto tempo il narratore conosce Gino?", ["da vent'anni", "da due anni", "da dieci anni", "da quando era bambino"], "da vent'anni"],
        ["Che cosa deve il narratore a Gino?", ["gli ha fatto conoscere sua moglie", "gli ha trovato un lavoro in centro", "gli ha prestato dei soldi", "gli offre sempre il caffè"], "gli ha fatto conoscere sua moglie"],
        ["Perché il narratore non ha mai detto a Gino la verità sui cornetti?", ["per non offenderlo", "perché Gino è di un'altra squadra", "perché non lo sa", "perché non è vero"], "per non offenderlo"]
      ],
      vf: [["Il narratore conosce Gino da vent'anni.", "vero"], ["Il narratore compra i cornetti da Gino.", "falso"], ["Gino tifa per la Juventus.", "vero"]],
      hunt: { label: "Tocá los pronombres que retoman lo dislocado (lo, la, ne, l')", targets: ["lo", "la", "ne", "l'ho"] } },

    { id: "w-49", week: 49, level: "C1", emoji: "📢", title: "Avviso ai condomini",
      grammar: "registro alto e coesione",
      text:
        "Gentili condomini, si comunica che, a partire da lunedì 3 marzo, avranno inizio i lavori di " +
        "manutenzione dell'ascensore. Durante tale periodo, la cui durata è prevista in due settimane, " +
        "l'impianto non sarà utilizzabile.\n\n" +
        "Si invitano pertanto i residenti a servirsi delle scale e a prestare particolare attenzione ai " +
        "materiali depositati nell'atrio. Qualora vi fossero esigenze specifiche, in particolare per persone " +
        "anziane o con disabilità, si prega di contattare l'amministrazione.\n\n" +
        "Ci scusiamo per il disagio e confidiamo nella consueta collaborazione. Distinti saluti, l'Amministratore.",
      gloss: { condomini: "vecinos del consorcio", manutenzione: "mantenimiento",
               ascensore: "ascensor", tale: "dicho", impianto: "instalación", pertanto: "por lo tanto",
               servirsi: "valerse", atrio: "hall", qualora: "en caso de que", esigenze: "necesidades", utilizzabile: "utilizable", depositati: "depositados", amministrazione: "administración", disabilità: "discapacidad", confidiamo: "confiamos", collaborazione: "colaboración", distinti: "atentos (distinti saluti = saludos atentos)",
               prega: "ruega", disagio: "molestia", consueta: "habitual" },
      questions: [
        ["Quanto dureranno i lavori?", ["due settimane", "un mese", "tre giorni", "non si sa"], "due settimane"],
        ["Che cosa devono usare i condomini durante i lavori?", ["le scale", "l'ascensore di servizio", "la porta sul retro", "il montacarichi"], "le scale"],
        ["Qual è lo scopo principale dell'avviso?", ["avvisare dei lavori e chiedere pazienza", "raccogliere soldi per l'ascensore nuovo", "lamentarsi del disordine nell'atrio", "convocare un'assemblea dei condomini"], "avvisare dei lavori e chiedere pazienza"]
      ],
      vf: [["I lavori riguardano l'ascensore.", "vero"], ["I lavori durano un mese.", "falso"], ["I lavori costano mille euro.", "non si dice"]],
      hunt: { label: "Tocá los conectores formales (pertanto, qualora, durante…)", targets: ["pertanto", "qualora", "durante", "tale"] } },

    { id: "w-51", week: 51, level: "C1", emoji: "✉️", title: "Lettera a me stesso",
      grammar: "ripasso generale C1",
      text:
        "Caro me, se stai leggendo queste righe, vuol dire che è passato un anno da quando hai cominciato " +
        "a studiare italiano. Ti ricordi quanto faticavi a distinguere il passato prossimo dall'imperfetto? " +
        "E quante volte hai sbagliato l'ausiliare di \"andare\"?\n\n" +
        "Oggi, invece, leggi un giornale senza vocabolario e capisci quasi tutto quello che senti alla radio. " +
        "Non che tu sia diventato perfetto, sia chiaro: il congiuntivo ti fa ancora qualche scherzo.\n\n" +
        "Però, se ti fossi arreso a febbraio, non saresti arrivato fin qui. Continua così, e il prossimo anno " +
        "scrivimi in italiano, possibilmente senza errori.",
      gloss: { righe: "líneas", faticavi: "te costaba", distinguere: "distinguir", vocabolario: "diccionario",
               quasi: "casi", chiaro: "claro", scherzo: "broma, jugada", volte: "veces", arreso: "rendido", possibilmente: "si es posible" },
      questions: [
        ["Quanto tempo è passato dall'inizio dello studio?", ["un anno", "un mese", "dieci anni", "una settimana"], "un anno"],
        ["Che cosa gli crea ancora problemi?", ["il congiuntivo", "leggere il giornale", "capire la radio", "il passato prossimo"], "il congiuntivo"],
        ["Qual è il tono della lettera?", ["incoraggiante e un po' ironico", "triste e pieno di rimpianti amari", "severo e molto critico con se stesso", "freddo, formale e distaccato"], "incoraggiante e un po' ironico"]
      ],
      vf: [["È passato un anno da quando ha cominciato a studiare.", "vero"], ["Il congiuntivo non è più un problema.", "falso"], ["Ha studiato in Italia.", "non si dice"]],
      hunt: { label: "Tocá los congiuntivi y el condizionale (sia, fossi, saresti)", targets: ["sia", "fossi", "saresti"] } },

    { id: "w-52", week: 52, level: "C1", emoji: "🎓", title: "Il giorno dell'esame",
      grammar: "tutto l'anno",
      text:
        "Alle otto e mezza Martina era già davanti all'università, con il documento in mano e il cuore che " +
        "batteva forte. Aveva studiato per un anno intero e ora doveva dimostrare di aver raggiunto il livello C1.\n\n" +
        "La prova di ascolto fu la più difficile: due giornalisti parlavano velocissimi di economia. Nella " +
        "produzione scritta, invece, si sentì a suo agio: le chiedevano di argomentare sui pro e i contro " +
        "del lavoro da casa.\n\n" +
        "Un mese dopo arrivò la mail: \"Esame superato.\" Martina la lesse tre volte prima di crederci. " +
        "Poi chiamò la sua insegnante: \"Ce l'ho fatta!\"",
      gloss: { documento: "documento", cuore: "corazón", batteva: "latía", dimostrare: "demostrar",
               raggiunto: "alcanzado", prova: "prueba", ascolto: "escucha", giornalisti: "periodistas",
               agio: "comodidad (a suo agio = cómoda)", produzione: "producción", volte: "veces", argomentare: "argumentar", superato: "aprobado",
               insegnante: "profesora" },
      questions: [
        ["Quale prova è stata la più difficile per Martina?", ["l'ascolto", "lo scritto", "l'orale", "la lettura"], "l'ascolto"],
        ["Su che cosa ha dovuto argomentare?", ["sul lavoro da casa", "sull'economia", "sull'università", "sullo sport"], "sul lavoro da casa"],
        ["Perché Martina legge la mail tre volte?", ["quasi non ci crede", "la mail è scritta male", "non capisce bene l'italiano", "vuole ricordarla a memoria"], "quasi non ci crede"]
      ],
      vf: [["La prova di ascolto è stata la più difficile.", "vero"], ["Martina ha saputo il risultato il giorno stesso.", "falso"], ["Martina ha preso il voto massimo.", "non si dice"]],
      hunt: { label: "Tocá los verbos en passato remoto", targets: ["fu", "sentì", "arrivò", "lesse", "chiamò"] } }
  ];

  // «Vero, falso o non si dice?»: comprehension in Italian, as in the CILS.
  var api = { TESTI: TESTI };
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.LettureSettimana = api;
})(typeof window !== "undefined" ? window : globalThis);
