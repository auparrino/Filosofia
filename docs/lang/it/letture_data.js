/*
 * Le letture: "Martín a Bologna", una serie a puntate graduata da A1 a B2.
 *
 * Input comprensibile (Krashen 1985): testi appena sopra il livello, con le
 * parole meno frequenti glossate perché la copertura resti vicina al 98%
 * che serve per capire senza fatica (Hu & Nation 2000).  Ogni puntata usa la
 * grammatica di quel punto del percorso, e finisce con una "caccia" alle
 * forme: notare la forma dentro un testo che hai già capito (Schmidt 1990).
 * La storia continua: la voglia di sapere come va a finire è motivazione.
 *
 * Ogni puntata: testo, glossario {parola: significato}, domande di
 * comprensione (in castellano, sul significato) e una caccia {label, targets}
 * dove targets sono le parole esatte (minuscole) da trovare nel testo.
 *
 * Solo i dati (le puntate, le serie, le impostazioni del vero/falso e della
 * caccia): la logica è nel nucleo, docs/js/letture.js, che legge
 * window.LETTURE_DATA e aggiunge i testi di «La settimana»
 * (letture_settimana.js).  La capa de frecuencia está en freq_data.js.
 */
(function (root) {
  "use strict";

  var EPISODI = [
    { id: "ep1", week: 1, n: 1, level: "A1", emoji: "🧳", title: "Arrivo a Bologna",
      grammar: "essere e avere",
      // Day one: only essere, avere and words you can guess (argentino,
      // grande, piccolo).  Short sentences, one idea each.
      text:
        "Ciao! Io sono Martín. Sono argentino e ho 32 anni. " +
        "Oggi sono a Bologna!\n\n" +
        "Bologna è bella. Ho una valigia grande e uno zaino piccolo. " +
        "La casa è in via Zamboni. È piccola ma bella. Ho una mappa e un telefono: " +
        "la mappa è grande, il telefono è piccolo.\n\n" +
        "Giulia è la mia coinquilina. È di Napoli e ha 28 anni. " +
        "È molto simpatica. Giulia ha un gatto. Il gatto è nero e bello. " +
        "Io sono stanco, ma sono contento!",
      gloss: { oggi: "hoy", bella: "linda", valigia: "valija", zaino: "mochila",
               coinquilina: "compañera de departamento", mia: "mi (la mia = mi)",
               ma: "pero", mappa: "mapa", gatto: "gato", nero: "negro", stanco: "cansado", contento: "contento, feliz", molto: "muy" },
      questions: [
        ["¿De dónde es Giulia?", ["de Nápoles", "de Bolonia", "de Buenos Aires", "de Roma"], "de Nápoles"],
        ["¿Cómo es la casa?", ["chica pero linda", "grande y fea", "lejos del centro", "en Nápoles"], "chica pero linda"],
        ["¿Cómo está Martín?", ["cansado pero contento", "triste porque extraña su casa", "enojado", "enfermo"], "cansado pero contento"]
      ],
      hunt: { label: "Tocá todas las formas de essere (sono, è)", targets: ["sono", "è"] } },

    { id: "ep2", week: 5, n: 2, level: "A1", emoji: "🧀", title: "Al mercato",
      grammar: "presente e articoli",
      text:
        "Il sabato mattina Giulia e Martín vanno al Mercato di Mezzo. Giulia compra " +
        "sempre il pane fresco e la frutta. Martín guarda tutto con curiosità: ci sono " +
        "tortellini, mortadella e formaggi di ogni tipo.\n\n" +
        "«Cosa prendi?» chiede Giulia.\n" +
        "«Non lo so. Tutto sembra buonissimo!» risponde Martín.\n\n" +
        "Il signore del banco sorride e taglia un pezzo di parmigiano. «Questo è " +
        "stagionato trenta mesi. Lo vuole provare?» Martín mangia e chiude gli occhi. " +
        "«Mamma mia! Prendo mezzo chilo!»\n\n" +
        "Giulia ride: «Benvenuto in Emilia-Romagna. Qui si mangia bene, ma si spende " +
        "anche tanto.»",
      gloss: { banco: "puesto (del mercado)", taglia: "corta", pezzo: "pedazo",
               stagionato: "curado, añejado", provare: "probar",
               occhi: "ojos", ride: "se ríe", spende: "gasta", sembra: "parece" },
      questions: [
        ["¿Qué compra siempre Giulia?", ["pan fresco y fruta", "queso, mortadela y vino", "tortellini", "vino"], "pan fresco y fruta"],
        ["¿Qué hace el señor del puesto?", ["le da a probar parmesano", "le cobra de más", "le vende fruta de la estación", "no lo atiende"], "le da a probar parmesano"],
        ["¿Qué dice Giulia de la región?", ["se come bien pero se gasta mucho", "es barata", "la comida es mala y todo es caro", "es muy fría"], "se come bien pero se gasta mucho"]
      ],
      hunt: { label: "Tocá las comidas que aparecen", targets:
        ["pane", "frutta", "tortellini", "mortadella", "formaggi", "parmigiano"] } },

    { id: "ep3", week: 12, n: 3, level: "A1", emoji: "⏰", title: "Una giornata tipo",
      grammar: "verbi riflessivi",
      text:
        "Di solito mi sveglio alle sette meno un quarto. Non mi alzo subito: resto " +
        "cinque minuti a letto e guardo il telefono. Poi mi faccio la doccia, mi vesto " +
        "e preparo il caffè con la moka. Giulia invece si alza tardi, perché lavora di " +
        "sera in un ristorante.\n\n" +
        "Esco di casa alle otto e prendo l'autobus numero 13. In ufficio i colleghi " +
        "sono gentili, ma parlano in dialetto quando sono arrabbiati. A pranzo mangio " +
        "un panino al bar sotto l'ufficio.\n\n" +
        "La sera torno a casa stanco, ma felice. Prima di dormire studio l'italiano per " +
        "venti minuti. Mi addormento sempre con il libro in mano.",
      gloss: { resto: "me quedo", letto: "cama", invece: "en cambio",
               tardi: "tarde", colleghi: "compañeros de trabajo", arrabbiati: "enojados",
               pranzo: "almuerzo", stanco: "cansado", addormento: "(me) duermo" },
      questions: [
        ["¿Por qué Giulia se levanta tarde?", ["trabaja de noche en un restaurante", "está enferma", "no tiene trabajo", "estudia de noche en la universidad"], "trabaja de noche en un restaurante"],
        ["¿Cuándo hablan en dialecto los compañeros?", ["cuando están enojados", "en el almuerzo", "siempre", "con el jefe"], "cuando están enojados"],
        ["¿Qué hace Martín antes de dormir?", ["estudia italiano veinte minutos", "mira series", "llama a su mamá a Buenos Aires por video", "sale a correr"], "estudia italiano veinte minutos"]
      ],
      hunt: { label: "Tocá los verbos reflexivos (los que van con mi / si)", targets:
        ["sveglio", "alzo", "faccio", "vesto", "alza", "addormento"] } },

    { id: "ep4", week: 11, n: 4, level: "A2", emoji: "🚆", title: "Gita a Firenze",
      grammar: "passato prossimo",
      text:
        "Sabato scorso Martín e Giulia sono andati a Firenze in treno. Sono partiti " +
        "presto, alle otto, e sono arrivati in un'ora e mezza. Prima hanno visitato il " +
        "Duomo, poi hanno camminato fino a Ponte Vecchio.\n\n" +
        "A pranzo hanno mangiato una bistecca enorme in una trattoria vicino a Santa " +
        "Croce. Martín ha bevuto un bicchiere di Chianti e ha detto: «Questa è la " +
        "bistecca migliore della mia vita». Giulia ha riso: «Perché non hai mai " +
        "assaggiato quella di mia nonna!»\n\n" +
        "Il pomeriggio è stato lungo. Hanno perso il treno delle sei e sono tornati a " +
        "casa a mezzanotte, stanchissimi ma contenti.",
      gloss: { scorso: "pasado", presto: "temprano", camminato: "caminado",
               bistecca: "bife", trattoria: "fonda, restaurante sencillo",
               bicchiere: "vaso", migliore: "mejor", assaggiato: "probado",
               perso: "perdido" },
      questions: [
        ["¿Cómo viajaron a Florencia?", ["en tren", "en auto", "en colectivo", "en avión"], "en tren"],
        ["¿Qué opina Giulia del bife?", ["que el de su abuela es mejor", "que está crudo", "que es carísimo", "que es el mejor de su vida"], "que el de su abuela es mejor"],
        ["¿Por qué volvieron a medianoche?", ["perdieron el tren de las seis", "se quedaron a cenar", "el tren estaba demorado por la nieve", "se perdieron"], "perdieron el tren de las seis"]
      ],
      hunt: { label: "Tocá los participios del passato prossimo", targets:
        ["andati", "partiti", "arrivati", "visitato", "camminato", "mangiato", "bevuto",
         "detto", "riso", "assaggiato", "stato", "perso", "tornati"] } },

    { id: "ep5", week: 15, n: 5, level: "A2", emoji: "🌊", title: "Quando ero piccola",
      grammar: "imperfetto e passato prossimo",
      text:
        "Una sera Giulia racconta la sua infanzia a Martín.\n\n" +
        "«Quando ero piccola, abitavamo in un palazzo vicino al mare. Mio padre faceva " +
        "il pescatore e usciva ogni notte con la barca. Mia madre cucinava per tutto il " +
        "quartiere: la domenica a pranzo eravamo sempre in venti! Io andavo a scuola a " +
        "piedi e il pomeriggio giocavo a pallone con mio fratello per strada.\n\n" +
        "Un giorno, però, è successa una cosa strana: mio padre è tornato senza pesce, " +
        "ma con un cane bagnato. L'abbiamo chiamato Totò ed è rimasto con noi quindici " +
        "anni.»\n\n" +
        "Martín sorride: «Ecco perché ami tanto i cani!»",
      gloss: { racconta: "cuenta", infanzia: "infancia", pescatore: "pescador",
               barca: "barco, bote", quartiere: "barrio", pallone: "pelota",
               strada: "calle", successa: "pasado, sucedido", bagnato: "mojado",
               rimasto: "quedado" },
      questions: [
        ["¿De qué trabajaba el padre de Giulia?", ["era pescador", "era cocinero", "era maestro", "era taxista"], "era pescador"],
        ["¿Cuántos eran los domingos al mediodía?", ["veinte", "cuatro", "diez", "dos"], "veinte"],
        ["¿Qué trajo el padre un día?", ["un perro mojado", "un pescado enorme", "un gato", "nada"], "un perro mojado"]
      ],
      hunt: { label: "Tocá los verbos en imperfetto (lo que pasaba siempre)", targets:
        ["ero", "abitavamo", "faceva", "usciva", "cucinava", "eravamo", "andavo", "giocavo"] } },

    { id: "ep6", week: 19, n: 6, level: "B1", emoji: "💼", title: "Il colloquio",
      grammar: "futuro semplice",
      text:
        "Lunedì Martín avrà un colloquio importante in un'azienda di Modena che produce " +
        "motori elettrici. Ha paura di non capire le domande, così Giulia lo aiuta a " +
        "prepararsi.\n\n" +
        "«Ti chiederanno perché vuoi lavorare con loro. Tu risponderai che la loro " +
        "tecnologia ti affascina da anni.»\n" +
        "«E se mi faranno domande tecniche?»\n" +
        "«Parlerai lentamente e userai le parole che conosci. Se non capisci, chiederai " +
        "di ripetere: non è una vergogna.»\n\n" +
        "Martín ripassa tutta la domenica. La sera è nervoso: «Domani a quest'ora saprò " +
        "se il mio italiano basta.» Giulia gli prepara una tisana: «Andrà benissimo, " +
        "vedrai.»",
      gloss: { colloquio: "entrevista (de trabajo)", azienda: "empresa",
               affascina: "fascina", lentamente: "despacio", vergogna: "vergüenza",
               ripassa: "repasa", basta: "alcanza", tisana: "té de hierbas" },
      questions: [
        ["¿Qué produce la empresa?", ["motores eléctricos", "autos deportivos de lujo", "software", "queso"], "motores eléctricos"],
        ["¿Qué consejo le da Giulia si no entiende?", ["pedir que repitan", "hablar en español", "sonreír y asentir", "cambiar de tema"], "pedir que repitan"],
        ["¿Cómo está Martín el domingo a la noche?", ["nervioso", "tranquilo", "enojado", "aburrido"], "nervioso"]
      ],
      hunt: { label: "Tocá los verbos en futuro", targets:
        ["avrà", "chiederanno", "risponderai", "faranno", "parlerai", "userai",
         "chiederai", "saprò", "andrà", "vedrai"] } },

    { id: "ep7", week: 22, n: 7, level: "B1", emoji: "📞", title: "Com'è andata?",
      grammar: "pronomi diretti, indiretti e combinati",
      text:
        "Martín esce dal colloquio e chiama subito Giulia.\n\n" +
        "«Allora? Com'è andata?»\n" +
        "«Non lo so ancora. Mi hanno fatto tantissime domande. Il direttore mi ha chiesto " +
        "il curriculum, anche se gliel'ho già mandato per email.»\n" +
        "«E tu?»\n" +
        "«Gliel'ho dato un'altra volta, ovviamente, e poi gli ho spiegato il mio " +
        "progetto in Argentina. Gli è piaciuto, credo.»\n" +
        "«Ti hanno detto quando ti rispondono?»\n" +
        "«Me lo diranno entro venerdì.»\n" +
        "«Allora stasera festeggiamo lo stesso. Compro una pizza e te la porto a casa.»\n" +
        "«Portamene due, ho una fame da lupo!»",
      gloss: { subito: "enseguida", ancora: "todavía", chiesto: "pedido",
               spiegato: "explicado", entro: "a más tardar, dentro de",
               festeggiamo: "festejamos", stesso: "(lo stesso) igual, de todos modos" },
      questions: [
        ["¿Qué le pidió el director?", ["el currículum, otra vez", "una carta de recomendación", "que hablara en inglés", "el pasaporte"], "el currículum, otra vez"],
        ["¿Cuándo le van a contestar?", ["a más tardar el viernes", "mañana", "en un mes", "no le dijeron"], "a más tardar el viernes"],
        ["¿Qué pide Martín al final?", ["dos pizzas", "una cerveza", "que Giulia lo llame", "silencio"], "dos pizzas"]
      ],
      hunt: { label: "Tocá los pronombres de objeto indirecto sueltos (mi, ti, gli, me, te)", targets:
        ["mi", "ti", "gli", "me", "te"] } },

    { id: "ep8", week: 20, n: 8, level: "B1", emoji: "✉️", title: "La risposta",
      grammar: "condizionale",
      text:
        "Venerdì mattina arriva la mail: l'azienda di Modena gli offre il posto. Martín " +
        "dovrebbe essere felicissimo, ma è confuso. Il lavoro è ottimo, però " +
        "significa lasciare Bologna, Giulia e i nuovi amici.\n\n" +
        "«Cosa faresti tu al posto mio?» chiede a Giulia.\n" +
        "«Io accetterei subito. Modena è a mezz'ora di treno: potresti venire qui ogni " +
        "fine settimana.»\n" +
        "«Sì, ma mi mancherebbe la vita di qui.»\n" +
        "«Allora non traslocare! Potresti fare il pendolare, come fanno in tanti.»\n\n" +
        "Martín ci pensa tutta la notte. Alle tre scrive un messaggio a sua madre: " +
        "«Mamma, secondo te sarei capace di ricominciare da capo, un'altra volta?»",
      gloss: { pensa: "(ci pensa) lo piensa, le da vueltas: ci = en eso", posto: "puesto (de trabajo); al posto mio = en mi lugar", ottimo: "excelente", lasciare: "dejar",
               mancherebbe: "extrañaría (me faltaría)",
               traslocare: "mudarse", pendolare: "persona que viaja todos los días al trabajo",
               capo: "(da capo) desde cero", capace: "capaz" },
      questions: [
        ["¿Qué le ofrece la empresa?", ["el puesto", "una beca", "un aumento", "un viaje"], "el puesto"],
        ["¿Qué haría Giulia?", ["aceptaría enseguida", "lo pensaría un mes", "rechazaría la oferta", "se mudaría con él"], "aceptaría enseguida"],
        ["¿Qué alternativa le propone?", ["viajar todos los días en tren", "trabajar desde casa", "volver a Argentina", "buscar otro trabajo en Bolonia"], "viajar todos los días en tren"]
      ],
      hunt: { label: "Tocá los verbos en condizionale", targets:
        ["dovrebbe", "faresti", "accetterei", "potresti", "mancherebbe", "sarei"] } },

    { id: "ep9", week: 30, n: 9, level: "B2", emoji: "💌", title: "Il consiglio della mamma",
      grammar: "congiuntivo",
      text:
        "La risposta della madre arriva la mattina dopo, per colpa del fuso orario.\n\n" +
        "«Caro Martín, penso che tu sia già capace di tutto, anche se non te ne accorgi. " +
        "Non credo che la città conti molto: conta che tu faccia un lavoro che ti " +
        "appassiona. Mi sembra che Giulia sia una buona amica, e gli amici veri restano, " +
        "anche a quaranta chilometri.\n\n" +
        "Vorrei che tu non avessi paura di sbagliare: è normale che una scelta " +
        "importante faccia un po' paura. Qualunque cosa tu decida, sono orgogliosa di te. " +
        "Un bacio grande, mamma.\n\n" +
        "P.S. Spero che tu abbia imparato a cucinare, perché a Modena Giulia non ti " +
        "preparerà la cena.»",
      gloss: { fuso: "(fuso orario) huso horario",
               accorgi: "(te ne accorgi) te das cuenta", appassiona: "apasiona",
               sbagliare: "equivocarse", scelta: "elección, decisión",
               qualunque: "cualquier", orgogliosa: "orgullosa" },
      questions: [
        ["¿Por qué la respuesta llega a la mañana?", ["por la diferencia horaria", "porque la madre dormía la siesta", "porque se cortó internet", "porque estaba ocupada"], "por la diferencia horaria"],
        ["Según la madre, ¿qué es lo que importa?", ["hacer un trabajo que lo apasione", "la ciudad", "ganar mucho", "estar cerca de ella"], "hacer un trabajo que lo apasione"],
        ["¿Qué dice la posdata?", ["que ojalá haya aprendido a cocinar", "que ella lo va a visitar en Navidad", "que Giulia es su novia", "que vuelva a casa"], "que ojalá haya aprendido a cocinar"]
      ],
      hunt: { label: "Tocá los verbos en congiuntivo", targets:
        ["sia", "conti", "faccia", "avessi", "decida", "abbia"] } },

    { id: "ep10", week: 33, n: 10, level: "B2", emoji: "🥂", title: "Un anno dopo",
      grammar: "periodo ipotetico",
      text:
        "È passato un anno da quando Martín è arrivato a Bologna. Alla fine ha accettato " +
        "il lavoro e fa il pendolare: ogni mattina prende il treno delle 7:40 per Modena. " +
        "Stasera festeggia con Giulia nel bar sotto casa, dove hanno preso il primo caffè insieme.\n\n" +
        "«Se non avessi trovato te come coinquilina, non avrei mai imparato l'italiano " +
        "così in fretta» le dice.\n" +
        "«E se tu non fossi venuto, io non avrei mai assaggiato l'asado» risponde lei.\n\n" +
        "Ridono. Martín ripensa al primo giorno, quando capiva una parola su dieci. " +
        "Adesso sogna in italiano, litiga in italiano e, soprattutto, scherza in " +
        "italiano.\n\n" +
        "«Sai qual è la cosa più strana?» dice. «Se dovessi tornare a Buenos Aires " +
        "domani, mi mancherebbero perfino i portici.»",
      gloss: { fretta: "(in fretta) rápido, apuro",
               ripensa: "vuelve a pensar, recuerda", sogna: "sueña", litiga: "discute, se pelea",
               scherza: "bromea", perfino: "hasta, incluso", portici: "soportales, galerías techadas" },
      questions: [
        ["¿Cómo va Martín a Módena?", ["en tren, todos los días", "en auto", "se mudó allá", "en bicicleta"], "en tren, todos los días"],
        ["¿Dónde festejan?", ["en el bar donde tomaron el primer café juntos", "en Florencia", "en la empresa, con los compañeros de trabajo", "en Nápoles"], "en el bar donde tomaron el primer café juntos"],
        ["¿Qué extrañaría Martín si volviera?", ["hasta los portici", "solo la comida", "el trabajo", "nada"], "hasta los portici"]
      ],
      hunt: { label: "Tocá el verbo de cada condición con «se» (congiuntivo)", targets:
        ["avessi", "fossi", "dovessi"] } },

    /* La quarta stagione: tre puntate C1, una ogni quattro settimane, così
       la strada verso l'esame ha ancora una storia da leggere. */
    { id: "ep11", week: 41, n: 11, level: "C1", emoji: "🧑‍💼", title: "Il capo nuovo",
      grammar: "causativo e verbi di percezione",
      text:
        "A settembre in azienda arriva un direttore nuovo, Fabrizio, e in una settimana fa rifare a tutti " +
        "i rapporti del trimestre. Non lascia parlare nessuno nelle riunioni e ha fatto aspettare " +
        "Martín un'ora davanti al suo ufficio.\n\n" +
        "«Lo sento urlare dal corridoio» dice Giulia al telefono. «Non lasciarti mettere i piedi in testa.»\n" +
        "Martín ci pensa. Il giorno dopo si fa ricevere alle otto, prima di tutti, e gli porta un " +
        "piano di lavoro di una pagina. Martín lo guarda leggere in silenzio; poi Fabrizio sorride per la prima volta.\n\n" +
        "«Finalmente qualcuno che mi fa risparmiare tempo» dice. Da quel giorno lo fa sedere accanto a sé.",
      gloss: { azienda: "empresa", rifare: "rehacer", rapporti: "informes", trimestre: "trimestre",
               urlare: "gritar", corridoio: "pasillo", "testa": "(mettere i piedi in testa) pisotear, abusar",
               ricevere: "(farsi ricevere) conseguir que lo atiendan", risparmiare: "ahorrar", accanto: "al lado" },
      questions: [
        ["¿Qué hace Fabrizio en su primera semana?", ["hace rehacer los informes", "despide a Martín", "organiza una fiesta para el equipo", "se va de vacaciones"], "hace rehacer los informes"],
        ["¿Qué le aconseja Giulia?", ["que no se deje pisotear", "que renuncie", "que grite también", "que llegue tarde"], "que no se deje pisotear"],
        ["¿Cómo termina?", ["Fabrizio lo sienta a su lado", "Martín cambia de trabajo y de ciudad", "Fabrizio se va", "nadie habla más"], "Fabrizio lo sienta a su lado"]
      ],
      hunt: { label: "Tocá las formas de «fare» y «lasciare» seguidas de infinitivo (causativo)", targets:
        ["fa", "fatto", "lascia", "lasciarti"] } },

    { id: "ep12", week: 45, n: 12, level: "C1", emoji: "🍷", title: "La cena di lavoro",
      grammar: "gerundio e participio",
      text:
        "Essendo l'unico straniero della squadra, a Martín tocca il brindisi della cena di fine anno. " +
        "Avendo preparato due righe in italiano, le legge dal telefono, ma sbagliando una doppia: " +
        "dice «pena» invece di «penna» e tutti ridono.\n\n" +
        "Finita la cena, Fabrizio lo prende da parte. «Sapendo quanto ti costa, ti ringrazio il doppio.» " +
        "Martín, arrossendo, risponde che dopo un anno una doppia sbagliata è quasi un lusso.\n\n" +
        "Tornando a casa a piedi sotto i portici, pensa che la lingua non si impara: si abita.",
      gloss: { squadra: "equipo", brindisi: "brindis", righe: "renglones", doppia: "consonante doble",
               ridono: "ríen", "parte": "(prendere da parte) llevar aparte", arrossendo: "sonrojándose",
               lusso: "lujo", portici: "soportales", abita: "(si abita) se habita, se vive" },
      questions: [
        ["¿Por qué le toca el brindis a Martín?", ["porque es el único extranjero", "porque es el jefe", "porque cumple años ese mismo día", "porque lo pidió"], "porque es el único extranjero"],
        ["¿Qué error comete?", ["una consonante doble", "un verbo en pasado", "el nombre del jefe", "el número de mesa"], "una consonante doble"],
        ["¿Qué piensa al volver?", ["que la lengua se habita, no se aprende", "que quiere volver a Buenos Aires cuanto antes", "que odia los brindis", "que Fabrizio es malo"], "que la lengua se habita, no se aprende"]
      ],
      hunt: { label: "Tocá todos los gerundios (essendo, sapendo…)", targets:
        ["essendo", "avendo", "sbagliando", "sapendo", "arrossendo", "tornando"] } },

    { id: "ep13", week: 49, n: 13, level: "C1", emoji: "✉️", title: "L'ultima lettera",
      grammar: "registro alto e coesione",
      text:
        "Gentile professoressa Bianchi,\n\n" +
        "le scrivo affinché sappia quanto le sono grato. Nonostante il mio italiano fosse, all'inizio, " +
        "un impasto di spagnolo e buona volontà, lei non mi ha mai corretto con impazienza. Tuttavia " +
        "non mi ha nemmeno lasciato passare una preposizione sbagliata, e di questo la ringrazio.\n\n" +
        "Qualora l'università organizzasse ancora il corso per stranieri, sarei lieto di tornare " +
        "come volontario. Infatti, dopo un anno, mi sono reso conto che si impara davvero solo " +
        "insegnando a qualcun altro.\n\n" +
        "Con stima e riconoscenza,\nMartín",
      gloss: { affinché: "para que (+ congiuntivo)", grato: "agradecido", nonostante: "a pesar de que",
               impasto: "mezcla, masa", tuttavia: "sin embargo", nemmeno: "ni siquiera", qualora: "en caso de que (+ congiuntivo)",
               lieto: "contento (registro alto)", volontario: "voluntario", stima: "estima", riconoscenza: "gratitud" },
      questions: [
        ["¿A quién le escribe Martín?", ["a su profesora", "a Fabrizio", "a Giulia", "al Comune"], "a su profesora"],
        ["¿Qué agradece?", ["que lo corrigiera sin impaciencia y sin dejar pasar errores", "que le regalara un diccionario y una gramática al final del curso", "que le diera trabajo", "que le enseñara a cocinar"], "que lo corrigiera sin impaciencia y sin dejar pasar errores"],
        ["¿Qué descubrió después de un año?", ["que se aprende enseñando", "que el italiano es fácil", "que no quiere volver", "que odia las preposiciones"], "que se aprende enseñando"]
      ],
      hunt: { label: "Tocá los conectores (affinché, nonostante, tuttavia, qualora, infatti)", targets:
        ["affinché", "nonostante", "tuttavia", "qualora", "infatti"] } },

    /* ---------------------------------------------- Cultura: storia, idee, libri.
       Contenuto che interessa (Hidi & Renninger 2006): l'interesse per il tema
       aumenta comprensione e memoria.  Si scelgono liberamente. */

    { id: "c-dante", week: 11, series: "cultura", area: "Letteratura", n: 1, level: "A2", emoji: "📜",
      title: "Dante e la lingua italiana", grammar: "presente storico",
      text:
        "Dante Alighieri nasce a Firenze nel 1265. Scrive la Divina Commedia in volgare " +
        "fiorentino e non in latino, la lingua dei dotti. È una scelta rivoluzionaria: " +
        "vuole essere letto da tutti, non solo dai professori.\n\n" +
        "Il poema racconta un viaggio immaginario in tre parti: l'Inferno, il Purgatorio " +
        "e il Paradiso. Nel primo regno e in quasi tutto il secondo la guida di Dante è il poeta latino Virgilio; " +
        "poi lo accompagna Beatrice, la donna che ha amato da giovane.\n\n" +
        "Dante muore in esilio a Ravenna nel 1321, lontano dalla sua città. Ancora oggi " +
        "molti italiani sanno a memoria il primo verso: «Nel mezzo del cammin di nostra " +
        "vita». Non a caso lo chiamano il padre della lingua italiana.",
      gloss: { volgare: "lengua vulgar, la hablada por el pueblo", dotti: "sabios, eruditos",
               scelta: "elección", poema: "poema", regno: "reino", guida: "guía",
               accompagna: "acompaña", esilio: "exilio", cammin: "(cammino) camino",
               verso: "verso" },
      questions: [
        ["¿Por qué escribe en volgare y no en latín?", ["para que lo lean todos", "porque no sabía latín", "porque se lo pidió el papa", "para vender más"], "para que lo lean todos"],
        ["¿Quién lo guía en el Paraíso?", ["Beatrice", "Virgilio", "su padre", "nadie"], "Beatrice"],
        ["¿Dónde muere Dante?", ["en el exilio, en Ravenna", "en Florencia", "en Roma", "en la cárcel, en Florencia"], "en el exilio, en Ravenna"]
      ],
      hunt: { label: "Tocá los tres reinos del viaje (cada vez que aparecen)", targets:
        ["inferno", "purgatorio", "paradiso"] } },

    { id: "c-machiavelli", week: 38, series: "cultura", area: "Filosofia", n: 2, level: "B1", emoji: "🦊",
      title: "Machiavelli e Il Principe", grammar: "passato prossimo e remoto",
      text:
        "Nel 1513 Niccolò Machiavelli è fuori dalla politica. I Medici sono tornati al " +
        "potere a Firenze e lui, sospettato di aver partecipato a una congiura, è stato " +
        "arrestato e torturato. Si ritira in campagna, vicino a San Casciano, e scrive un " +
        "libro breve che cambierà il pensiero politico: Il Principe.\n\n" +
        "Machiavelli non descrive lo Stato ideale, ma la politica com'è davvero. Un " +
        "principe, scrive, deve saper essere «golpe e lione», cioè astuto come la volpe " +
        "e forte come il leone.\n\n" +
        "Spesso gli si attribuisce la frase «il fine giustifica i mezzi», ma nel libro " +
        "non c'è: è una sintesi, e un po' una caricatura, del suo pensiero. Il Principe " +
        "fu pubblicato nel 1532, cinque anni dopo la morte del suo autore.",
      gloss: { sospettato: "sospechado", congiura: "conspiración", ritira: "(si ritira) se retira",
               campagna: "campo", pensiero: "pensamiento", davvero: "de verdad",
               golpe: "zorra (italiano antiguo: volpe)", lione: "león (italiano antiguo: leone)",
               astuto: "astuto", volpe: "zorro", fine: "fin, objetivo", mezzi: "medios" },
      questions: [
        ["¿Qué le pasó a Maquiavelo en 1513?", ["lo arrestaron y torturaron", "lo nombraron embajador en Francia", "se casó", "se fue a Francia"], "lo arrestaron y torturaron"],
        ["¿Qué describe El Príncipe?", ["la política como es realmente", "el Estado ideal", "la vida de los santos y los papas", "la historia de Roma"], "la política como es realmente"],
        ["¿Qué pasa con «el fin justifica los medios»?", ["no está en el libro", "es la primera frase", "la dijo un Medici", "es el título original"], "no está en el libro"]
      ],
      hunt: { label: "Tocá los animales (en italiano antiguo y moderno)", targets:
        ["golpe", "lione", "volpe", "leone"] } },

    { id: "c-galileo", week: 29, series: "cultura", area: "Storia", n: 3, level: "B1", emoji: "🔭",
      title: "Galileo e il cannocchiale", grammar: "congiuntivo e condizionale",
      text:
        "Nel 1609 Galileo Galilei sente parlare di uno strumento olandese che fa sembrare " +
        "vicine le cose lontane. Lo costruisce da solo, lo migliora e lo punta verso il " +
        "cielo. Quello che vede cambia tutto: la Luna ha montagne e valli, e intorno a " +
        "Giove girano quattro satelliti. Se non tutto gira intorno alla Terra, forse " +
        "aveva ragione Copernico.\n\n" +
        "Galileo difende questa idea nel Dialogo sopra i due massimi sistemi del mondo, " +
        "scritto in italiano perché lo possano leggere tutti. Nel 1633 l'Inquisizione " +
        "lo processa e lo costringe ad abiurare.\n\n" +
        "Secondo la leggenda, dopo il processo avrebbe mormorato «Eppur si muove», ma non " +
        "ci sono prove che l'abbia detto davvero. Passa gli ultimi anni agli arresti " +
        "domiciliari, vicino a Firenze.",
      gloss: { strumento: "instrumento", olandese: "holandés", migliora: "mejora",
               punta: "apunta", valli: "valles", girano: "giran", massimi: "máximos",
               costringe: "obliga", abiurare: "abjurar, renegar", mormorato: "(avrebbe mormorato) habría murmurado, se dice que murmuró: condicional compuesto para lo no confirmado (semana 31)",
               eppur: "(eppure) y sin embargo", prove: "pruebas",
               domiciliari: "(arresti domiciliari) prisión domiciliaria" },
      questions: [
        ["¿Qué descubre Galileo alrededor de Júpiter?", ["cuatro satélites", "anillos", "montañas", "nada"], "cuatro satélites"],
        ["¿Por qué escribe el Dialogo en italiano?", ["para que lo pueda leer todo el mundo", "porque la Iglesia se lo exigió por escrito", "porque no sabía latín", "para esconderlo"], "para que lo pueda leer todo el mundo"],
        ["¿Dijo realmente «Eppur si muove»?", ["no hay pruebas de que lo haya dicho", "sí, delante del tribunal, en voz baja", "sí, en su libro", "lo dijo Copérnico"], "no hay pruebas de que lo haya dicho"]
      ],
      hunt: { label: "Tocá los verbos en congiuntivo o condizionale", targets:
        ["possano", "avrebbe", "abbia"] } },

    { id: "c-garibaldi", week: 31, series: "cultura", area: "Storia", n: 4, level: "B1", emoji: "🇮🇹",
      title: "Garibaldi e l'Unità", grammar: "presente storico e futuro nel passato",
      text:
        "Nel maggio del 1860 Giuseppe Garibaldi parte da Quarto, vicino a Genova, con " +
        "circa mille volontari. Sono i famosi Mille, e portano la camicia rossa. Sbarcano " +
        "a Marsala, in Sicilia, e in pochi mesi conquistano il Regno delle Due Sicilie. " +
        "A Teano, in ottobre, Garibaldi incontra il re Vittorio Emanuele II e gli " +
        "consegna il Sud.\n\n" +
        "Il 17 marzo 1861 nasce il Regno d'Italia, ma Roma non ne fa ancora parte: " +
        "diventerà capitale solo nel 1871.\n\n" +
        "Secondo la tradizione, Massimo d'Azeglio avrebbe detto: «Abbiamo fatto l'Italia, " +
        "ora dobbiamo fare gli italiani». Aveva ragione: allora solo una piccola minoranza " +
        "parlava italiano, gli altri parlavano i loro dialetti.",
      gloss: { volontari: "voluntarios", camicia: "camisa", sbarcano: "desembarcan",
               conquistano: "conquistan", consegna: "entrega", diventerà: "se convertirá en",
               minoranza: "minoría", dialetti: "dialectos",
               parte: "(non ne fa ancora parte) todavía no forma parte (de él)" },
      questions: [
        ["¿Cuántos voluntarios llevaba Garibaldi?", ["unos mil", "unos cien", "diez mil", "trescientos"], "unos mil"],
        ["¿Cuándo pasa Roma a ser capital?", ["en 1871", "en 1861", "en 1860", "en 1946"], "en 1871"],
        ["¿Qué quiere decir la frase de d'Azeglio?", ["que faltaba crear una identidad común", "que los italianos no querían la unidad", "que Italia era demasiado grande", "que había que hacer la guerra"], "que faltaba crear una identidad común"]
      ],
      hunt: { label: "Tocá los lugares geográficos", targets:
        ["quarto", "genova", "marsala", "sicilia", "teano", "italia", "roma"] } },

    { id: "c-gramsci", week: 45, series: "cultura", area: "Sociologia", n: 5, level: "B2", emoji: "📓",
      title: "Gramsci e l'egemonia", grammar: "passato remoto",
      text:
        "Antonio Gramsci, nato in Sardegna nel 1891, fu tra i fondatori del Partito " +
        "Comunista d'Italia. Nel 1926 il regime fascista lo arrestò e nel 1928 lo condannò a più " +
        "di vent'anni di carcere. «Per vent'anni dobbiamo impedire a questo cervello di " +
        "funzionare», avrebbe detto il pubblico ministero.\n\n" +
        "Eppure in prigione Gramsci scrisse migliaia di pagine: i Quaderni del carcere. " +
        "Il concetto più famoso è quello di egemonia: una classe non domina solo con la " +
        "forza, ma soprattutto con il consenso, facendo sì che le sue idee sembrino " +
        "naturali a tutti. Per questo, secondo Gramsci, la cultura, la scuola e i " +
        "giornali sono campi di battaglia politica.\n\n" +
        "Morì a Roma nel 1937, pochi giorni dopo aver riacquistato la libertà.",
      gloss: { fondatori: "fundadores", carcere: "cárcel", impedire: "impedir",
               cervello: "cerebro", "ministero": "(pubblico ministero) fiscal",
               quaderni: "cuadernos", egemonia: "hegemonía", consenso: "consenso",
               giornali: "diarios", riacquistato: "recuperado" },
      questions: [
        ["¿Qué quería impedir el fiscal?", ["que su cerebro funcionara", "que escapara", "que hablara con la prensa", "que viera a su familia"], "que su cerebro funcionara"],
        ["Según Gramsci, ¿cómo domina una clase?", ["sobre todo con el consenso", "solo con la fuerza", "con el dinero", "con la religión"], "sobre todo con el consenso"],
        ["¿Por qué la escuela y los diarios son campos de batalla?", ["porque ahí se construye el consenso", "porque son del Estado", "porque ahí hubo violencia", "porque los cerró el fascismo en los años veinte"], "porque ahí se construye el consenso"]
      ],
      hunt: { label: "Tocá los verbos en passato remoto", targets:
        ["fu", "arrestò", "condannò", "scrisse", "morì"] } },

    { id: "c-levi", week: 42, series: "cultura", area: "Letteratura", n: 6, level: "B2", emoji: "🕯️",
      title: "Primo Levi, testimone", grammar: "passato remoto e congiuntivo",
      text:
        "Primo Levi era un chimico ebreo di Torino. Nel 1944 fu deportato ad Auschwitz, " +
        "dove rimase fino alla liberazione del campo, nel gennaio del 1945. Sopravvisse " +
        "anche grazie al suo mestiere: lavorava in un laboratorio del campo.\n\n" +
        "Tornato a casa, sentì il bisogno di raccontare. In Se questo è un uomo descrive " +
        "la vita nel Lager con una prosa limpida, quasi scientifica, senza gridare. Non " +
        "vuole solo commuovere il lettore: vuole che capisca come un sistema possa " +
        "distruggere l'umanità delle persone.\n\n" +
        "Molti anni dopo, nei Sommersi e i salvati, riflette sulla «zona grigia», lo " +
        "spazio ambiguo tra vittime e carnefici. «È avvenuto, quindi può accadere di " +
        "nuovo», scrisse: per questo ricordare è un dovere.",
      gloss: { chimico: "químico", ebreo: "judío", sopravvisse: "sobrevivió",
               mestiere: "oficio", bisogno: "necesidad", limpida: "límpida, clara",
               gridare: "gritar", commuovere: "conmover", sommersi: "hundidos",
               carnefici: "verdugos", avvenuto: "ocurrido", dovere: "deber" },
      questions: [
        ["¿Qué lo ayudó a sobrevivir?", ["su oficio de químico", "un amigo guardia", "estar enfermo", "escapar"], "su oficio de químico"],
        ["¿Cómo escribe sobre el Lager?", ["con una prosa clara, casi científica", "con mucho enojo", "en forma de poesía, con mucha rima y metáfora", "con humor"], "con una prosa clara, casi científica"],
        ["¿Qué es la «zona gris»?", ["el espacio ambiguo entre víctimas y verdugos", "una parte del campo donde vivían los guardias", "el invierno polaco", "la memoria olvidada"], "el espacio ambiguo entre víctimas y verdugos"]
      ],
      hunt: { label: "Tocá los verbos en passato remoto", targets:
        ["fu", "rimase", "sopravvisse", "sentì", "scrisse"] } },

    { id: "c-boom", week: 24, series: "cultura", area: "Sociologia", n: 7, level: "B1", emoji: "📺",
      title: "Il boom economico", grammar: "presente e passato prossimo",
      text:
        "Tra la fine degli anni Cinquanta e l'inizio dei Sessanta l'Italia cambia " +
        "faccia. È il miracolo economico: le fabbriche del Nord crescono, e milioni di " +
        "persone lasciano i campi del Sud per andare a lavorare a Torino e a Milano. " +
        "Nelle case arrivano il frigorifero, la lavatrice e soprattutto la " +
        "televisione.\n\n" +
        "Nel 1954 la Rai comincia le trasmissioni televisive, e un programma come Non è mai troppo " +
        "tardi insegna a leggere e a scrivere agli adulti. Secondo il linguista Tullio " +
        "De Mauro, la televisione ha fatto moltissimo per l'unità della lingua.\n\n" +
        "Ma il boom ha anche un lato oscuro: le periferie crescono senza regole, e Pier " +
        "Paolo Pasolini accusa la società dei consumi di cancellare le culture popolari.",
      gloss: { faccia: "cara", fabbriche: "fábricas", crescono: "crecen",
               lavatrice: "lavarropas", trasmissioni: "transmisiones", insegna: "enseña",
               oscuro: "oscuro", periferie: "periferias, suburbios", regole: "reglas",
               consumi: "consumo", cancellare: "borrar" },
      questions: [
        ["¿Adónde se mudan millones de personas?", ["a las ciudades industriales del norte", "al extranjero", "al campo", "a Roma"], "a las ciudades industriales del norte"],
        ["¿Qué hacía «Non è mai troppo tardi»?", ["enseñaba a leer y escribir a adultos", "era un concurso", "daba noticias", "vendía electrodomésticos por televisión"], "enseñaba a leer y escribir a adultos"],
        ["¿De qué acusa Pasolini a la sociedad de consumo?", ["de borrar las culturas populares", "de empobrecer al norte", "de censurar la televisión y los diarios", "de cerrar fábricas"], "de borrar las culturas populares"]
      ],
      hunt: { label: "Tocá los aparatos que llegan a las casas", targets:
        ["frigorifero", "lavatrice", "televisione"] } },

    { id: "c-calvino", week: 34, series: "cultura", area: "Letteratura", n: 8, level: "B1", emoji: "🏙️",
      title: "Calvino e le città invisibili", grammar: "congiuntivo imperfetto",
      text:
        "Nel libro Le città invisibili, pubblicato nel 1972, Italo Calvino immagina un dialogo " +
        "tra Marco Polo e l'imperatore dei Tartari, Kublai Kan. Marco Polo racconta le " +
        "città che ha visitato nei suoi viaggi: città sottili, città continue, città " +
        "nascoste. Ogni città ha un nome di donna: Zaira, Despina, Ottavia.\n\n" +
        "Ma sono città vere? Poco a poco il lettore capisce che forse Marco Polo descrive " +
        "sempre la stessa città: Venezia, quella da cui è partito. Il libro non ha una " +
        "trama: si può aprire a caso, come un atlante di sogni.\n\n" +
        "Calvino, nato a Cuba nel 1923 da genitori italiani, pensava che la leggerezza " +
        "fosse una virtù, non un difetto: lo spiega nelle Lezioni americane.",
      gloss: { imperatore: "emperador", sottili: "sutiles", nascoste: "escondidas",
               trama: "trama, argumento", caso: "(a caso) al azar", atlante: "atlas",
               sogni: "sueños", genitori: "padres", leggerezza: "levedad, liviandad",
               difetto: "defecto" },
      questions: [
        ["¿Entre quiénes es el diálogo?", ["Marco Polo y Kublai Kan", "Calvino y un lector", "dos emperadores", "Marco Polo y su padre Niccolò"], "Marco Polo y Kublai Kan"],
        ["¿Qué ciudad se esconde detrás de todas?", ["Venecia", "Roma", "Pekín", "La Habana"], "Venecia"],
        ["¿Qué pensaba Calvino de la levedad?", ["que era una virtud", "que era un defecto", "que era imposible", "que era aburrida"], "que era una virtud"]
      ],
      hunt: { label: "Tocá los nombres de ciudades", targets:
        ["zaira", "despina", "ottavia", "venezia"] } },

    { id: "c-beccaria", week: 36, series: "cultura", area: "Filosofia", n: 9, level: "B2", emoji: "⚖️",
      title: "Beccaria contro la pena di morte", grammar: "presente storico e imperfetto",
      text:
        "Nel 1764 un giovane nobile milanese di ventisei anni, Cesare Beccaria, pubblica " +
        "un libretto che fa il giro d'Europa: Dei delitti e delle pene. In un'epoca in " +
        "cui la tortura era normale, Beccaria sostiene che è inutile e crudele: un " +
        "colpevole robusto può resistere, e un innocente debole può confessare pur di " +
        "smettere di soffrire.\n\n" +
        "Si oppone anche alla pena di morte: secondo lui, a scoraggiare il crimine non è " +
        "la crudeltà della pena, ma la sua certezza. Voltaire lo commenta con entusiasmo, " +
        "e nel 1786 il Granducato di Toscana diventa il primo Stato moderno ad abolire " +
        "la pena capitale.\n\n" +
        "Una curiosità: Beccaria era il nonno di Alessandro Manzoni.",
      gloss: { delitti: "delitos", pene: "penas", sostiene: "sostiene",
               crudele: "cruel", colpevole: "culpable", "pur": "(pur di) con tal de",
               smettere: "dejar de", scoraggiare: "desalentar (a scoraggiare... non è X, ma Y: lo que desalienta no es X sino Y)", certezza: "certeza",
               nonno: "abuelo" },
      questions: [
        ["¿Por qué la tortura es inútil según Beccaria?", ["un culpable fuerte resiste y un inocente débil confiesa", "porque es cara", "porque la Iglesia la prohíbe en todos los tribunales desde hace siglos", "porque nadie confiesa"], "un culpable fuerte resiste y un inocente débil confiesa"],
        ["¿Qué desalienta el crimen, según él?", ["la certeza de la pena", "la crueldad de la pena", "la religión", "la pobreza"], "la certeza de la pena"],
        ["¿Qué pasó en Toscana en 1786?", ["abolió la pena de muerte", "prohibió el libro", "coronó a Beccaria", "invadió Milán"], "abolió la pena de muerte"]
      ],
      hunt: { label: "Tocá las palabras del derecho penal", targets:
        ["delitti", "pene", "tortura", "pena", "crimine"] } },

    { id: "c-ginzburg", week: 48, series: "cultura", area: "Letteratura", n: 10, level: "B1", emoji: "🍽️",
      title: "Natalia Ginzburg, Lessico famigliare", grammar: "imperfetto",
      text:
        "«Non fate malagrazie!» gridava il padre a tavola. Con frasi come questa comincia " +
        "Lessico famigliare, il libro in cui Natalia Ginzburg racconta la sua famiglia " +
        "torinese, i Levi, dagli anni Venti al dopoguerra.\n\n" +
        "Il libro non segue una trama: segue le parole. Ogni famiglia, scrive Ginzburg, " +
        "ha delle espressioni sue, che bastano per riconoscersi anche dopo anni, anche in " +
        "una grotta buia, tra milioni di persone.\n\n" +
        "Sullo sfondo c'è la storia: il fascismo, le leggi razziali, la guerra, l'arresto " +
        "e la morte del marito Leone Ginzburg. Ma il tono resta ironico e leggero. Il " +
        "libro vinse il Premio Strega nel 1963.",
      gloss: { malagrazie: "groserías, malos modales", gridava: "gritaba",
               tavola: "mesa", lessico: "léxico", famigliare: "familiar",
               dopoguerra: "posguerra", riconoscersi: "reconocerse", grotta: "gruta, cueva",
               buia: "oscura", sfondo: "fondo", razziali: "raciales", marito: "marido" },
      questions: [
        ["¿Qué sigue el libro, en lugar de una trama?", ["las palabras de la familia", "la vida del padre", "la guerra", "un crimen"], "las palabras de la familia"],
        ["¿Para qué sirven las expresiones familiares?", ["para reconocerse aun después de años", "para hablar en secreto", "para educar a los hijos con disciplina", "para escribir libros"], "para reconocerse aun después de años"],
        ["¿Cuál es el tono del libro?", ["irónico y liviano", "trágico y solemne", "político y agresivo", "técnico"], "irónico y liviano"]
      ],
      hunt: { label: "Tocá las palabras que remiten a la historia del siglo XX", targets:
        ["dopoguerra", "fascismo", "razziali", "guerra", "arresto"] } },

    /* ---------------------------------------------- Inondazioni.
       Input flood + textual enhancement (Trahey & White 1993; Lee & Huang
       2008): una struttura ripetuta molte volte in un testo naturale; prima
       si legge senza segni, poi con la struttura evidenziata.  `flood.forms`
       sono i token esatti (minuscoli) da evidenziare alla seconda lettura;
       la caccia usa gli stessi bersagli. */

    { id: "fl-da", week: 9, series: "flood", n: 1, level: "A2", emoji: "⏳",
      title: "Da quanto tempo?", grammar: "da + tempo (presente)",
      flood: { target: "da + tiempo", forms: ["da"], n: 14,
               es: "Fijate en «da» + tiempo: en italiano va con el presente («vivo qui da tre anni» = vivo acá desde hace tres años), nunca con el pasado." },
      text:
        "Martín è a Bologna da tre mesi. Abita in via Zamboni da settembre, con Giulia. " +
        "Giulia abita in questa casa da due anni e conosce tutti nel palazzo.\n\n" +
        "Ogni mattina, alle otto, Martín va al bar sotto casa. Il barista, Paolo, lavora lì da vent'anni " +
        "e conosce tutti i clienti. «Da quanto tempo sei in Italia?» chiede Paolo. " +
        "«Da tre mesi» risponde Martín. «E parli già bene!» «Grazie. Studio l'italiano da un " +
        "anno, ma parlo solo da poco.»\n\n" +
        "Al bar c'è anche Paola, una studentessa di Roma. Paola studia a Bologna da quattro " +
        "anni e ha un gatto da sei mesi. Il gatto ha un nome strano: Dante, come il poeta. «Penso a questo " +
        "nome da molto tempo» dice Paola. «Dante è un nome perfetto per un gatto.»\n\n" +
        "Martín e Paola parlano da mezz'ora, e Martín non guarda il telefono da mezz'ora! " +
        "È un record. Da oggi Martín ha una nuova amica.",
      gloss: { palazzo: "edificio", sotto: "debajo de", barista: "el que atiende el bar",
               "vent'anni": "veinte años", già: "ya", poco: "(da poco) hace poco",
               gatto: "gato", strano: "raro", penso: "pienso", "mezz'ora": "media hora",
               guarda: "mira", oggi: "hoy" },
      questions: [
        ["¿Desde cuándo vive Martín en Bolonia?", ["desde hace tres meses", "desde hace un año", "desde hace dos años", "desde ayer"], "desde hace tres meses"],
        ["¿Desde cuándo trabaja Paolo en el bar?", ["desde hace veinte años", "desde hace treinta años", "desde septiembre", "desde hace seis meses"], "desde hace veinte años"],
        ["¿Qué tiene Paola desde hace seis meses?", ["un gato", "un perro", "un departamento", "un novio"], "un gato"]
      ],
      hunt: { label: "Tocá todos los da", targets: ["da"] } },

    { id: "fl-mica", week: 18, series: "flood", n: 2, level: "A2", emoji: "🚫",
      title: "Non è mica tardi", grammar: "mica e le negazioni",
      flood: { target: "mica / negazioni", forms: ["mica", "niente", "nulla", "nessuno", "mai", "neanche", "nemmeno", "più"], n: 19,
               es: "Mirá cómo «mica» refuerza la negación («non è mica tardi» = no es tarde para nada) y cómo niente, mai, nessuno van después del verbo, con «non» adelante." },
      text:
        "Domenica sera. Martín apre il frigorifero: non c'è niente. Nemmeno un uovo.\n\n" +
        "«Giulia, non hai fatto la spesa?»\n" +
        "«No, non ho avuto tempo. E tu? Non hai mica comprato qualcosa?»\n" +
        "«Neanche io. Non ho comprato nulla, ieri il mercato era chiuso.»\n\n" +
        "Giulia guarda l'orologio: le nove. «Non è mica tardi. Il ristorante di Marco è " +
        "aperto fino a mezzanotte.»\n" +
        "«Non ho mica voglia di uscire. Piove.»\n" +
        "«Non piove più, guarda! E poi non c'è nessuno per strada, è tranquillo.»\n" +
        "«Ma io non ho mica soldi, oggi. Lo stipendio arriva domani.»\n" +
        "«Pago io. Non è mica un problema.»\n\n" +
        "Martín sorride. Con Giulia non è mai un problema. Non ha mai visto una persona " +
        "così: non si arrabbia mai, non si lamenta mai, non dice mai di no.\n\n" +
        "Al ristorante Marco porta due piatti di tagliatelle. Martín mangia tutto, non " +
        "lascia niente nel piatto. Giulia ride: «Non avevi mica fame, eh?» «Non tanto» " +
        "risponde Martín. «Mica tanto.»",
      gloss: { uovo: "huevo", spesa: "(fare la spesa) hacer las compras",
               mica: "para nada, ni (refuerza la negación)", orologio: "reloj", tardi: "tarde",
               voglia: "(avere voglia di) tener ganas de", piove: "llueve", soldi: "plata",
               stipendio: "sueldo", arrabbia: "(si arrabbia) se enoja", lamenta: "(si lamenta) se queja",
               piatti: "platos", lascia: "deja", ride: "se ríe" },
      questions: [
        ["¿Por qué no hay nada en la heladera?", ["ninguno de los dos hizo las compras", "Giulia se comió todo", "se rompió la heladera el fin de semana", "Martín está de viaje"], "ninguno de los dos hizo las compras"],
        ["¿Por qué Martín no puede pagar hoy?", ["el sueldo le llega mañana", "es tacaño", "Giulia se lo prohibió", "el restaurante es gratis"], "el sueldo le llega mañana"],
        ["¿Qué hace Martín con las tagliatelle?", ["se come todo", "deja la mitad", "no las prueba", "las comparte con Marco"], "se come todo"]
      ],
      hunt: { label: "Tocá todas las palabras negativas (mica, niente, mai, nessuno…)", targets:
        ["mica", "niente", "nulla", "nessuno", "mai", "neanche", "nemmeno", "più"] } },

    { id: "fl-ne", week: 21, series: "flood", n: 3, level: "B1", emoji: "🥟",
      title: "Quanti ne vuole?", grammar: "ne partitivo",
      flood: { target: "ne partitivo", forms: ["ne"], n: 14,
               es: "Fijate en «ne»: reemplaza «de eso / de ellos» y aparece siempre que hay una cantidad («ne prendo un chilo», «non ne ho neanche uno»). En castellano no lo decimos; acá es obligatorio." },
      text:
        "Sabato Martín organizza una cena a casa. Al mercato compra i tortellini: «Quanti " +
        "ne vuole?» chiede il signore del banco. «Siamo in sei… ne prendo un chilo.» «Un " +
        "chilo? Ne basta la metà. I tortellini sono piccoli ma pesanti.» Martín ne prende " +
        "mezzo chilo.\n\n" +
        "Poi passa dal fornaio. «Ha il pane di ieri?» «Ne ho ancora un po', ma oggi è " +
        "meglio quello fresco. Quanto ne vuole?» «Ne vorrei due filoni.» «Con sei persone " +
        "ne basta uno.»\n\n" +
        "A casa Giulia guarda le buste: «Hai comprato il vino?» «Ne ho comprate tre " +
        "bottiglie, di rosso.» «E il parmigiano?» «Ne ho preso un pezzo grande.» «E i tovaglioli?» " +
        "Silenzio. «Non ne ho neanche uno.» Giulia ride: «Ne ho io, tranquillo.»\n\n" +
        "Alle otto arrivano gli amici, tutti con fame. Alla fine della cena Paola chiede: «Sono rimasti " +
        "tortellini?» Martín guarda la pentola: «No, non ne è rimasto nemmeno uno. Ma di " +
        "dolce ne ho fatti due!»",
      gloss: { banco: "puesto (del mercado)", metà: "mitad", pesanti: "pesados", fornaio: "panadero",
               filoni: "(filone) pan largo, flauta", buste: "bolsas", pezzo: "pedazo",
               tovaglioli: "servilletas", neanche: "ni siquiera", tranquillo: "quedate tranquilo",
               rimasti: "quedado (rimanere = quedar, sobrar)", pentola: "olla", nemmeno: "ni siquiera",
               dolce: "postre" },
      questions: [
        ["¿Cuántos tortellini compra al final?", ["medio kilo", "un kilo", "dos kilos", "ninguno"], "medio kilo"],
        ["¿Qué se olvidó de comprar?", ["las servilletas", "el vino", "el pan", "el queso"], "las servilletas"],
        ["¿Qué sobró al final de la cena?", ["ni un tortellino, pero hay dos postres", "medio kilo de tortellini y un poco de vino", "todo el vino", "el pan"], "ni un tortellino, pero hay dos postres"]
      ],
      hunt: { label: "Tocá todos los ne", targets: ["ne"] } },

    { id: "fl-ci", week: 21, series: "flood", n: 4, level: "B1", emoji: "📚",
      title: "Ci vado ogni giorno", grammar: "ci locativo",
      flood: { target: "ci locativo", forms: ["ci"], n: 15,
               es: "Mirá «ci» = ahí/allá: reemplaza el lugar ya nombrado («ci vado», «ci lavora»). En castellano lo omitimos («voy», «trabaja»); en italiano casi siempre hace falta." },
      text:
        "Martín ha scoperto una biblioteca in via del Piombo. Ci va quasi ogni pomeriggio, " +
        "perché a casa non riesce a studiare. Ci sono lunghe tavole di legno, luce calda e " +
        "silenzio.\n\n" +
        "«Ci vieni anche tu?» chiede a Paola. «Io ci sono già stata, ma non ci torno: ci " +
        "fa troppo freddo d'inverno.» «Freddo? Io ci sto benissimo. Ci resto fino alle sette " +
        "e nessuno mi disturba.»\n\n" +
        "Giulia invece conosce un posto diverso: il bar sotto i portici di via Saragozza. " +
        "«Ci lavora mia cugina. Ci puoi stare tutto il giorno con un solo caffè.» Martín ci " +
        "prova il giorno dopo. Ci arriva alle tre, si siede vicino alla finestra e apre il " +
        "libro. Alle tre e mezza ci entra un gruppo di studenti che parlano forte. Alle " +
        "quattro ci passa la cugina di Giulia con un piatto di cornetti. Alle cinque Martín " +
        "chiude il libro: non ha letto nemmeno una pagina.\n\n" +
        "Il giorno dopo torna in biblioteca. Al bar ci andrà la domenica, per i cornetti.",
      gloss: { scoperto: "descubierto", riesce: "(riuscire a) logra", tavole: "mesas grandes",
               legno: "madera", freddo: "frío", disturba: "molesta", posto: "lugar",
               portici: "soportales", cugina: "prima", prova: "(ci prova) lo intenta",
               finestra: "ventana", forte: "(parlare forte) hablar alto", cornetti: "medialunas",
               nemmeno: "ni siquiera" },
      questions: [
        ["¿Por qué Paola no vuelve a la biblioteca?", ["hace demasiado frío", "es muy ruidosa", "queda lejos", "cierra temprano los sábados"], "hace demasiado frío"],
        ["¿Quién trabaja en el bar de via Saragozza?", ["la prima de Giulia", "la mamá de Paola", "Marco", "un amigo de Martín"], "la prima de Giulia"],
        ["¿Cuántas páginas lee Martín en el bar?", ["ninguna", "una", "diez", "todo el libro"], "ninguna"]
      ],
      hunt: { label: "Tocá todos los ci", targets: ["ci"] } },

    { id: "fl-combinati", week: 22, series: "flood", n: 5, level: "B1", emoji: "🎁",
      title: "Glielo porto io", grammar: "pronomi combinati",
      flood: { target: "pronomi combinati", forms: ["glielo", "gliela", "glieli", "gliene", "restituirglielo", "dirglielo", "portaglielo"], n: 14,
               es: "Fijate en los pronombres combinados: gli/le + lo/la/li/le/ne se funden en una sola palabra (glielo, gliela, gliene), sea para él o para ella, y van pegados al infinitivo y al imperativo (portaglielo)." },
      text:
        "Martín ha un problema piccolo ma fastidioso: ha ancora il libro della professoressa " +
        "Bianchi, un dizionario che lei gli ha prestato a settembre. Il corso è finito e lui " +
        "non sa come restituirglielo.\n\n" +
        "«Glielo porto in ufficio?» chiede a Giulia. «Non so se lei è ancora all'università.»\n" +
        "«Glielo puoi lasciare in portineria. Oppure glielo mandi per posta.»\n" +
        "«Per posta? È pesante, e poi vorrei anche ringraziarla. Vorrei dirglielo di persona.»\n" +
        "«Allora scrivile. Chiedile un appuntamento e portaglielo tu.»\n\n" +
        "Martín scrive. La professoressa risponde in cinque minuti: «Il dizionario? Glielo " +
        "regalo: a lei serve più che a me. E gli appunti del corso, se li ho ancora, glieli lascio " +
        "volentieri.»\n" +
        "Martín legge il messaggio a Giulia due volte. «Gliene devo almeno uno, di caffè.»\n" +
        "«Gliene devi una decina, direi. E anche una torta.»\n" +
        "«La torta gliela faccio io, tu però mi dai la ricetta.»\n" +
        "«Certo. Ma la crema gliela prepari tu, che io sono stanca.»\n\n" +
        "La settimana dopo Martín porta la torta in ufficio. La professoressa la assaggia e " +
        "sorride: «Glielo dico subito: la prossima gliela chiedo per il mio compleanno.»",
      gloss: { più: "más (più che a me = más que a mí)", fastidioso: "molesto (no «aburrido»)", prestato: "prestado", restituirglielo: "(restituire) devolvérselo",
               portineria: "portería, conserjería", oppure: "o bien", pesante: "pesado",
               ringraziarla: "agradecerle", appuntamento: "cita", serve: "(servire a) le sirve, le hace falta",
               decina: "unos diez", direi: "diría", ricetta: "receta", assaggia: "prueba",
               compleanno: "cumpleaños" },
      questions: [
        ["¿Qué tiene que devolver Martín?", ["un diccionario", "una torta", "una receta", "un libro de poesía"], "un diccionario"],
        ["¿Qué decide la profesora?", ["se lo regala", "quiere que se lo mande por correo", "lo pide de vuelta enseguida", "se olvidó del libro"], "se lo regala"],
        ["¿Quién prepara la torta?", ["Martín, con la receta de Giulia", "Giulia sola", "la profesora", "la prima de Giulia"], "Martín, con la receta de Giulia"]
      ],
      hunt: { label: "Tocá todos los pronombres combinados (glielo, gliela, gliene…)", targets:
        ["glielo", "gliela", "glieli", "gliene", "restituirglielo", "dirglielo", "portaglielo"] } },

    { id: "fl-congiuntivo", week: 25, series: "flood", n: 6, level: "B1", emoji: "💭",
      title: "Credo che sia stanco", grammar: "congiuntivo presente dopo opinione",
      flood: { target: "congiuntivo presente dopo verbi di opinione", forms: ["sia", "lavori", "abbia", "manchi", "stia", "voglia", "racconti", "faccia"], n: 12,
               es: "Mirá qué pasa después de «penso che», «credo che», «mi sembra che», «spero che»: el verbo va en congiuntivo (sia, abbia, faccia). En castellano decimos «creo que es»; en italiano, «credo che sia»." },
      text:
        "Da qualche settimana Martín parla meno del solito, e al bar tutti hanno un'opinione.\n\n" +
        "«Secondo me è innamorato» dice Paolo, il barista. «Credo che sia una del corso di italiano.»\n" +
        "«Non credo», risponde Giulia. «Penso che sia stanco e basta. Mi sembra che lavori troppo: " +
        "esce alle sette e torna alle nove.»\n" +
        "«Io invece penso che abbia nostalgia» dice Paola. «Non credo che sia facile stare " +
        "così lontano dalla famiglia. Immagino che sua madre gli manchi molto.»\n" +
        "«È possibile che abbia semplicemente bisogno di dormire» aggiunge la cugina di Giulia.\n\n" +
        "A mezzogiorno Martín entra, ordina un caffè e non dice una parola.\n" +
        "«Ho l'impressione che stia male» sussurra Paolo.\n" +
        "«Dubito che voglia parlarne» dice Giulia. «Ma spero che ci racconti qualcosa.»\n\n" +
        "Martín beve il caffè, guarda tutti e sorride: «Vi sento, sapete. Non sono innamorato, " +
        "non sono malato e mia madre sta benissimo. È che studio l'inglese per il lavoro, e mi " +
        "sembra che il cervello non ce la faccia con due lingue nuove.»\n" +
        "Giulia ride: «Allora credo che tu abbia bisogno di una birra, non di un caffè.»",
      gloss: { solito: "(meno del solito) menos que de costumbre", innamorato: "enamorado",
               basta: "(e basta) y nada más", nostalgia: "(avere nostalgia) extrañar",
               manchi: "(gli manchi) la extrañe (mancare = hacer falta)", aggiunge: "agrega",
               impressione: "(avere l'impressione) tener la sensación", sussurra: "susurra",
               dubito: "dudo", parlarne: "hablar de eso", racconti: "cuente", cervello: "cerebro",
               faccia: "(ce la faccia) pueda, dé abasto", birra: "cerveza" },
      questions: [
        ["¿Qué cree Paolo, el barista?", ["que Martín está enamorado", "que está enfermo", "que trabaja demasiado", "que extraña a su madre y a Buenos Aires"], "que Martín está enamorado"],
        ["¿Qué le pasa en realidad a Martín?", ["estudia inglés y el cerebro no le da abasto", "está enamorado", "está enfermo", "su madre está enferma"], "estudia inglés y el cerebro no le da abasto"],
        ["¿Qué le propone Giulia al final?", ["una cerveza", "un café", "dormir", "dejar el inglés"], "una cerveza"]
      ],
      hunt: { label: "Tocá todos los verbos en congiuntivo (sia, abbia, faccia…)", targets:
        ["sia", "lavori", "abbia", "manchi", "stia", "voglia", "racconti", "faccia"] } },

    { id: "fl-condpassato", week: 31, series: "flood", n: 7, level: "B2", emoji: "🚆",
      title: "Avrei dovuto chiamare", grammar: "condizionale passato",
      flood: { target: "condizionale passato", forms: ["avrei", "avresti", "avrebbe", "avremmo", "sarei", "saresti", "dovuto", "potuto", "voluto"], n: 24,
               es: "Fijate en el condizionale passato: avrei/avresti/avrebbe + participio («avrei dovuto chiamare» = tendría que haber llamado). Lo que en castellano son dos verbos, acá es un solo tiempo compuesto." },
      text:
        "Lunedì è stato un disastro, e Martín lo sa. Seduto al bar con Giulia, fa la lista di " +
        "tutto quello che avrebbe dovuto fare diversamente.\n\n" +
        "«Avrei dovuto mettere la sveglia alle sei, non alle sei e mezza. Avrei potuto prendere " +
        "il treno delle 7:20 e sarei arrivato in tempo alla riunione.»\n" +
        "«E invece?»\n" +
        "«E invece ho perso quello delle 7:40, e alla riunione il direttore ha presentato il mio " +
        "progetto senza di me. Avrei voluto vedere la sua faccia quando ha aperto le slide sbagliate.»\n\n" +
        "Giulia ride, ma poi diventa seria. «Avresti dovuto chiamarlo dal treno. Ti avrebbe " +
        "aspettato dieci minuti.»\n" +
        "«Lo so. Avrei dovuto chiamare, avrei dovuto scrivere, avrei dovuto fare qualcosa. Invece " +
        "ho guardato il finestrino per quaranta minuti.»\n" +
        "«Ti saresti sentito meglio?»\n" +
        "«No. Ma almeno sarei stato una persona che ci prova.»\n\n" +
        "Giulia gli passa il suo cornetto. «Sai cosa avrei fatto io? La stessa cosa. E poi avrei " +
        "mangiato due cornetti invece di uno.»\n" +
        "Martín sorride per la prima volta in tutto il giorno. «Avremmo dovuto aprire un bar, noi " +
        "due, invece di lavorare per gli altri.»",
      gloss: { seduto: "sentado", sveglia: "despertador", riunione: "reunión",
               perso: "(ho perso il treno) perdí", faccia: "cara", sbagliate: "equivocadas",
               seria: "(diventa seria) se pone seria", finestrino: "ventanilla", almeno: "al menos",
               prova: "(ci prova) lo intenta", passa: "(gli passa) le alcanza", cornetto: "medialuna",
               stessa: "misma", altri: "(gli altri) los demás" },
      questions: [
        ["¿A qué hora debería haber puesto el despertador?", ["a las seis", "a las seis y media", "a las siete", "a las siete y veinte"], "a las seis"],
        ["¿Qué pasó en la reunión?", ["el director presentó el proyecto sin él", "la cancelaron", "Martín llegó tarde pero presentó igual el proyecto", "el director no fue"], "el director presentó el proyecto sin él"],
        ["¿Qué habría hecho Giulia en su lugar?", ["lo mismo, y comer dos medialunas", "llamar desde el tren", "renunciar", "escribir un mail"], "lo mismo, y comer dos medialunas"]
      ],
      hunt: { label: "Tocá los verbos del condizionale passato (avrei dovuto, sarei arrivato…)", targets:
        ["avrei", "avresti", "avrebbe", "avremmo", "sarei", "saresti", "dovuto", "potuto", "voluto"] } },

    { id: "fl-relativi", week: 34, series: "flood", n: 8, level: "B2", emoji: "🏛️",
      title: "La città in cui vivo", grammar: "pronomi relativi cui e il quale",
      flood: { target: "cui / il quale", forms: ["cui", "quale", "quali"], n: 16,
               es: "Mirá los relativos: «cui» va siempre después de una preposición (in cui, per cui, a cui) y no cambia; «il quale / la quale / i quali / le quali» concuerda en género y número y suena más formal." },
      text:
        "Per il corso di scrittura, la professoressa Bianchi chiede un testo sulla città. " +
        "Martín scrive di Bologna.\n\n" +
        "«La città in cui vivo ha quaranta chilometri di portici, sotto i quali è possibile " +
        "camminare per ore senza bagnarsi. Il palazzo in cui abito è in via Zamboni, la strada " +
        "nella quale passano ogni giorno migliaia di studenti. La ragione per cui sono venuto " +
        "qui era il lavoro; il motivo per cui resto è un altro, e non so ancora spiegarlo.\n\n" +
        "Il bar a cui sono più affezionato è quello sotto casa. Il barista, con il quale parlo " +
        "ogni mattina, si chiama Paolo e conosce le storie di tutto il quartiere. Ci sono due " +
        "amiche senza le quali non avrei capito niente di questa città: Giulia, con cui divido " +
        "la casa, e Paola, grazie alla quale ho scoperto la biblioteca in cui studio.\n\n" +
        "C'è un momento della giornata a cui tengo molto: le sette di sera, l'ora in cui le " +
        "torri diventano rosse e le campane suonano insieme. È il momento durante il quale, per " +
        "qualche minuto, mi sembra di essere a casa.»\n\n" +
        "La professoressa scrive in fondo alla pagina: «Ottimo. Ma il motivo per cui resti, " +
        "prima o poi, dovrai dirlo.»",
      gloss: { portici: "soportales", bagnarsi: "mojarse", migliaia: "miles", motivo: "motivo, razón", affezionato: "(essere affezionato a) tenerle cariño a",
               quartiere: "barrio", divido: "(dividere la casa) comparto", scoperto: "descubierto",
               tengo: "(tenerci a) le doy mucha importancia", torri: "torres", campane: "campanas",
               suonano: "suenan", fondo: "(in fondo a) al pie de", prima: "(prima o poi) tarde o temprano" },
      questions: [
        ["¿Cuántos kilómetros de portici tiene Bolonia?", ["cuarenta", "cuatro", "catorce", "cuatrocientos"], "cuarenta"],
        ["¿Por qué vino Martín a Bolonia?", ["por el trabajo", "por Giulia", "por la universidad", "por la comida"], "por el trabajo"],
        ["¿Qué pasa a las siete de la tarde?", ["las torres se ponen rojas y suenan las campanas", "cierra el bar", "llegan los estudiantes a la plaza y abren los bares", "empieza el curso"], "las torres se ponen rojas y suenan las campanas"]
      ],
      hunt: { label: "Tocá todos los cui, quale y quali", targets: ["cui", "quale", "quali"] } },

    { id: "fl-si", week: 36, series: "flood", n: 9, level: "B2", emoji: "☕",
      title: "Come si fa in Italia", grammar: "si impersonale e passivante",
      flood: { target: "si impersonale / passivante", forms: ["si"], n: 20,
               es: "Fijate en «si» + verbo en tercera persona: «si beve», «si mangia». Es el «se» impersonal del castellano («se come tarde»); con objeto plural el verbo va en plural («i tortellini si mangiano in brodo»)." },
      text:
        "A Bologna, e in genere in Italia, il caffè si beve in piedi, al banco, e si paga prima " +
        "o dopo a seconda del bar. Si ordina «un caffè» e arriva un espresso: se si vuole quello " +
        "lungo, bisogna dirlo. Il cappuccino si prende solo la mattina; dopo pranzo, se lo si " +
        "chiede, nessuno dice niente, ma si capisce subito che uno è straniero.\n\n" +
        "A tavola si comincia tardi. La cena è verso le otto e mezza, e la domenica si mangia " +
        "anche per tre ore. I tortellini si mangiano in brodo, non con la panna. Il pane non " +
        "si mangia con la pasta: si lascia per il secondo, o per pulire il piatto, cosa normale " +
        "in famiglia ma non al ristorante. L'acqua si chiede «naturale» o «frizzante», e il " +
        "vino si versa poco alla volta.\n\n" +
        "Nelle case si entra senza scarpe solo se lo dice il padrone di casa. Ai vicini si dice " +
        "«buongiorno» in ascensore, anche a chi non si conosce. In città si va in bicicletta e " +
        "si protesta ogni giorno contro il traffico, ma nessuno rinuncia alla macchina.\n\n" +
        "Martín ha imparato tutto questo in un anno. Ora, quando un amico argentino arriva, " +
        "glielo spiega in un pomeriggio. Poi lo porta al bar, dove si beve il caffè in piedi.",
      gloss: { banco: "barra, mostrador", seconda: "(a seconda di) según", bisogna: "hay que",
               straniero: "extranjero", brodo: "caldo", panna: "crema de leche", pulire: "limpiar",
               frizzante: "con gas", versa: "sirve, vuelca", volta: "(poco alla volta) de a poco",
               scarpe: "zapatos", padrone: "(padrone di casa) dueño de casa", vicini: "vecinos",
               ascensore: "ascensor", rinuncia: "renuncia", macchina: "auto" },
      questions: [
        ["¿Cómo se toma el café en Italia?", ["de pie, en la barra", "sentado y con leche", "siempre como cappuccino", "en la calle"], "de pie, en la barra"],
        ["¿Cuándo se come el pan, según el texto?", ["con el segundo plato o para limpiar el plato", "con la pasta", "antes de la comida", "nunca"], "con el segundo plato o para limpiar el plato"],
        ["¿Qué hace la gente con el auto?", ["protesta contra el tráfico pero no renuncia al auto", "lo deja en casa", "lo usa solo el domingo, para ir a comer a lo de los suegros", "lo vende"], "protesta contra el tráfico pero no renuncia al auto"]
      ],
      hunt: { label: "Tocá todos los si", targets: ["si"] } },

    { id: "fl-remoto", week: 37, series: "flood", n: 10, level: "B2", emoji: "🍲",
      title: "La leggenda del tortellino", grammar: "passato remoto narrativo",
      flood: { target: "passato remoto", forms: ["scesero", "viaggiarono", "fermarono", "diede", "preparò", "bevve", "raccontò", "andò", "riuscì", "salì", "guardò", "vide", "corse", "prese", "riempì", "chiuse", "nacque", "partirono", "servì", "trovarono", "passò", "fu"], n: 22,
               es: "Mirá el passato remoto, el tiempo de los cuentos y de la historia (scese, diede, vide, nacque). Se parece al pretérito castellano en forma y en uso escrito, pero en el norte de Italia casi no se habla." },
      text:
        "Sul tortellino esiste una leggenda che a Bologna tutti conoscono. Una notte, molti " +
        "secoli fa, tre dèi scesero sulla terra: Venere, Bacco e Marte. Viaggiarono a lungo e, " +
        "stanchi, si fermarono in una locanda di Castelfranco Emilia, a metà strada tra Bologna " +
        "e Modena.\n\n" +
        "L'oste diede loro la stanza migliore e preparò la cena. Bacco bevve tutto il vino della " +
        "casa, Marte raccontò le sue battaglie e Venere andò a dormire presto. L'oste, però, non " +
        "riuscì a dimenticare la bellezza della dea. Salì le scale in silenzio, guardò dal buco " +
        "della serratura e vide il suo ombelico.\n\n" +
        "Corse in cucina, prese un pezzo di pasta, lo riempì di carne e lo chiuse intorno al " +
        "dito, per ripetere quella forma perfetta. Nacque così il tortellino.\n\n" +
        "La mattina dopo gli dèi partirono senza dire niente. L'oste servì i tortellini in brodo " +
        "ai clienti, che li trovarono deliziosi. La ricetta passò di madre in figlia fino a oggi.\n\n" +
        "Bologna e Modena discutono ancora su chi fu il vero inventore. Castelfranco, che sta " +
        "nel mezzo, sorride e non dice nulla.",
      gloss: { dèi: "dioses", scesero: "bajaron (scendere)", locanda: "posada", oste: "posadero",
               battaglie: "batallas", riuscì: "(riuscire a) logró", scale: "escaleras", buco: "agujero",
               serratura: "cerradura", ombelico: "ombligo", riempì: "llenó (riempire)", dito: "dedo",
               brodo: "caldo", inventore: "inventor", mezzo: "(nel mezzo) en el medio" },
      questions: [
        ["¿Dónde se detienen los dioses?", ["en una posada de Castelfranco Emilia", "en Bolonia", "en una posada de Módena, cerca del Duomo", "en Venecia"], "en una posada de Castelfranco Emilia"],
        ["¿Qué vio el posadero por la cerradura?", ["el ombligo de Venus", "a Baco borracho", "a Marte dormido", "la cocina"], "el ombligo de Venus"],
        ["¿Quién ganó la discusión sobre el inventor?", ["nadie: Bolonia y Módena siguen discutiendo", "Bolonia", "Módena", "Castelfranco"], "nadie: Bolonia y Módena siguen discutiendo"]
      ],
      hunt: { label: "Tocá todos los verbos en passato remoto", targets:
        ["scesero", "viaggiarono", "fermarono", "diede", "preparò", "bevve", "raccontò", "andò", "riuscì", "salì", "guardò", "vide", "corse", "prese", "riempì", "chiuse", "nacque", "partirono", "servì", "trovarono", "passò", "fu"] } },

    { id: "fl-causativo", week: 40, series: "flood", n: 11, level: "C1", emoji: "🍝",
      title: "La madre di Giulia", grammar: "causativo fare + infinito",
      flood: { target: "fare / lasciare + infinito", forms: ["fa", "faccio", "fai", "fare", "fatto", "lasciare", "lascia", "lasciamo"], n: 19,
               es: "Mirá «fare + infinitivo»: hacer que otro haga algo («fa lavare le tende a Giulia» = le hace lavar las cortinas a Giulia). «Lasciare + infinitivo» es dejar hacer. Quien hace la acción va con «a» cuando hay objeto directo." },
      text:
        "La madre di Giulia arriva da Napoli per tre giorni e in tre giorni cambia la casa. Il " +
        "primo giorno fa spostare il divano a Martín, fa lavare le tende a Giulia e fa venire un " +
        "idraulico per il rubinetto che gocciola da mesi.\n\n" +
        "«Non lasciare mai un rubinetto così» dice a Martín. «L'acqua fa marcire tutto.» Martín, " +
        "che non ha mai toccato un rubinetto in vita sua, annuisce e la lascia parlare.\n\n" +
        "Il secondo giorno la signora fa assaggiare a tutti il suo ragù. Lo fa cuocere per sei ore " +
        "e non lascia entrare nessuno in cucina. «Lo faccio riposare una notte, domani è meglio.» " +
        "Fa comprare a Giulia il pane giusto, quello di Altamura, e fa sedere Martín a capotavola, " +
        "come un ospite importante.\n\n" +
        "Il terzo giorno vuole vedere Bologna. Martín le fa visitare le torri e i portici e la fa " +
        "salire fino a San Luca a piedi. In cima lei si ferma e lo guarda: «Tu mi fai camminare " +
        "troppo, ma mi hai fatto vedere una città bellissima.»\n\n" +
        "Quando riparte, la casa è pulita, il rubinetto non gocciola più e in frigorifero c'è ragù " +
        "per una settimana. Giulia sospira: «Mia madre fa fare a tutti quello che vuole. Ma poi la " +
        "lasciamo tornare, e già ci manca.»",
      gloss: { spostare: "mover, correr de lugar", tende: "cortinas", idraulico: "plomero",
               rubinetto: "canilla", gocciola: "gotea", marcire: "pudrirse", annuisce: "asiente con la cabeza",
               cuocere: "cocinar (al fuego)", riposare: "reposar", capotavola: "cabecera de la mesa",
               ospite: "invitado", cima: "(in cima) en la cima", sospira: "suspira", manca: "(ci manca) la extrañamos" },
      questions: [
        ["¿Para qué hace venir a un plomero?", ["por una canilla que gotea", "por el sofá", "por las cortinas del living", "por la heladera"], "por una canilla que gotea"],
        ["¿Cuánto tiempo hace cocinar el ragú?", ["seis horas", "una hora", "tres días", "una noche"], "seis horas"],
        ["¿Adónde lleva Martín a la madre de Giulia a pie?", ["a San Luca", "a Módena", "al mercado", "a Nápoles"], "a San Luca"]
      ],
      hunt: { label: "Tocá las formas de fare y lasciare seguidas de infinitivo", targets:
        ["fa", "faccio", "fai", "fare", "fatto", "lasciare", "lascia", "lasciamo"] } },

    { id: "fl-gerundio", week: 44, series: "flood", n: 12, level: "C1", emoji: "🏃",
      title: "Salendo a San Luca", grammar: "gerundio",
      flood: { target: "gerundio", forms: ["ridendo", "pensando", "attraversando", "arrivando", "sudando", "contando", "correndo", "sapendo", "appoggiandosi", "guardando", "riprendendo", "camminando", "parlando", "sedendosi", "essendo", "scendendo", "vedendolo"], n: 17,
               es: "Fijate en el gerundio (-ando / -endo): dice cómo o cuándo pasa algo («ridendo», «guardando in basso») y lleva los pronombres pegados (appoggiandosi, vedendolo). Con «stare» arma el progresivo: «sta sudando»." },
      text:
        "Paola convince Martín a correre con lei fino a San Luca, la basilica sulla collina: 666 " +
        "arcate di portico in salita. Martín accetta ridendo, pensando che sia uno scherzo. Non lo è.\n\n" +
        "Partono alle sette, attraversando la città ancora vuota. Arrivando all'arco del Meloncello, " +
        "dove comincia la salita, Martín sta già sudando. «Respira contando i gradini» dice Paola, " +
        "correndo davanti a lui senza fatica. «Sapendo quanti ne mancano, ti stanchi meno.» Martín " +
        "prova, ma perde il conto dopo il primo tornante.\n\n" +
        "A metà strada si ferma, appoggiandosi a una colonna. Guardando in basso vede Bologna " +
        "intera: le torri, i tetti rossi, la nebbia sulla pianura. «Vale la pena» pensa, riprendendo " +
        "fiato. Paola torna indietro e lo aspetta camminando al suo fianco. Salgono l'ultimo tratto " +
        "parlando di tutto, tranne che della salita.\n\n" +
        "In cima, sedendosi sui gradini della basilica, Martín tira fuori il telefono e manda una " +
        "foto a sua madre: «Ce l'ho fatta». Lei risponde subito, pur essendo le tre di notte a Buenos " +
        "Aires: «Sapevo che ce la facevi. Ora scendi con calma.»\n\n" +
        "Scendendo, Martín capisce che Paola l'ha ingannato: la corsa era la scusa. Vedendolo " +
        "felice, lei sorride e non dice niente.",
      gloss: { collina: "colina", arcate: "arcos (de un pórtico)", salita: "subida", scherzo: "broma",
               sudando: "sudando (sudare)", gradini: "escalones", stanchi: "(ti stanchi) te cansás",
               tornante: "curva cerrada de una subida", appoggiandosi: "apoyándose", tetti: "techos",
               nebbia: "niebla", pianura: "llanura", fiato: "(riprendere fiato) recuperar el aliento",
               tratto: "tramo", fatta: "(ce l'ho fatta) lo logré", ingannato: "engañado" },
      questions: [
        ["¿Cuántos arcos tiene el pórtico de San Luca?", ["666", "66", "1000", "40"], "666"],
        ["¿Qué consejo le da Paola para cansarse menos?", ["respirar contando los escalones", "no mirar hacia arriba mientras sube", "correr más rápido", "tomar agua"], "respirar contando los escalones"],
        ["¿A qué hora recibe la foto la madre?", ["a las tres de la mañana", "a las siete", "al mediodía", "a las nueve de la noche"], "a las tres de la mañana"]
      ],
      hunt: { label: "Tocá todos los gerundios", targets:
        ["ridendo", "pensando", "attraversando", "arrivando", "sudando", "contando", "correndo", "sapendo", "appoggiandosi", "guardando", "riprendendo", "camminando", "parlando", "sedendosi", "essendo", "scendendo", "vedendolo"] } },

    /* ---------------------------------------------- Cultura: civiltà.
       Una tarjeta por semana del tramo (27-51, sin la 39) sobre cómo funciona
       la vida en Italia (escuela y universidad, sanidad, trabajo, casa y
       alquiler, fiestas, comer, Estado y política, medios), atada al campo
       léxico y a la gramática de su semana, con preguntas en italiano.  Son
       lecturas opcionales de la serie Cultura (auditoría 3.0, D5.9). */

    { id: "cv-27", week: 27, series: "cultura", area: "Civiltà", n: 11, level: "B1", emoji: "☕",
      title: "Il bar: al banco o al tavolo", grammar: "avverbi in -mente",
      text:
        "In Italia il bar è soprattutto un luogo di passaggio. La mattina molti italiani entrano, ordinano velocemente " +
        "un caffè e un cornetto e fanno colazione in piedi, al banco, in cinque minuti.\n\n" +
        "Nei bar delle città, di solito, prima paghi alla cassa e ricevi lo scontrino; poi lo dai al barista e ordini. " +
        "Attenzione ai prezzi: al banco un caffè costa circa un euro e venti, ma se ti siedi al tavolo il conto può " +
        "essere tranquillamente il doppio, perché paghi anche il servizio.\n\n" +
        "Il cappuccino, tradizionalmente, è una bevanda della mattina. Dopo pranzo gli italiani prendono quasi sempre " +
        "un espresso, e ordinare un cappuccino alle tre del pomeriggio fa sorridere il barista. Naturalmente nessuno te lo vieta!",
      gloss: { passaggio: "paso", banco: "barra (del bar)", cornetto: "medialuna", cassa: "caja", scontrino: "ticket (de caja)",
               servizio: "servicio de mesa", bevanda: "bebida", sorridere: "sonreír", vieta: "prohíbe" },
      questions: [
        ["Dove fanno colazione molti italiani, la mattina?", ["al banco, in piedi", "seduti al tavolo", "a casa, a letto", "in ufficio, in riunione"], "al banco, in piedi"],
        ["Che cosa fai prima di ordinare, nei bar di città?", ["paghi alla cassa", "chiedi il menù", "lasci la mancia", "ti siedi al tavolo"], "paghi alla cassa"],
        ["Perché al tavolo il caffè costa di più?", ["perché paghi il servizio", "perché la tazza è più grande", "perché è più buono", "perché lo porta il capo"], "perché paghi il servizio"]
      ],
      hunt: { label: "Tocá los adverbios en -mente", targets: ["velocemente", "tranquillamente", "tradizionalmente", "naturalmente"] } },

    { id: "cv-28", week: 28, series: "cultura", area: "Civiltà", n: 12, level: "B1", emoji: "🏘️",
      title: "Comune, Provincia, Regione", grammar: "connettivi",
      text:
        "Chi vive in Italia ha a che fare soprattutto con il Comune. Infatti è il Comune che raccoglie i rifiuti, " +
        "gestisce l'anagrafe e decide dove costruire una scuola o un parcheggio. Alla sua guida c'è il sindaco, che i " +
        "cittadini eleggono ogni cinque anni.\n\n" +
        "Sopra i Comuni ci sono le Regioni, che sono venti. Cinque hanno uno statuto speciale, cioè più autonomia: tra " +
        "queste, la Sicilia e la Valle d'Aosta. Inoltre le Regioni hanno un compito molto importante: organizzano la " +
        "sanità. Per questo un ospedale in Lombardia non funziona esattamente come uno in Calabria.\n\n" +
        "E le Province? Esistono ancora, però contano meno di prima: si occupano soprattutto di strade e di scuole " +
        "superiori. Insomma, per un documento vai in Comune; per il medico, invece, dipende dalla Regione.",
      gloss: { rifiuti: "residuos", gestisce: "maneja, administra", anagrafe: "registro civil", guida: "(alla guida) al frente",
               sindaco: "intendente", eleggono: "eligen", statuto: "estatuto", compito: "tarea, función", sanità: "salud pública",
               contano: "pesan, cuentan" },
      questions: [
        ["Chi guida il Comune?", ["il sindaco", "il presidente", "il prefetto", "il ministro"], "il sindaco"],
        ["Quante sono le Regioni italiane?", ["venti", "cinque", "cento", "dodici"], "venti"],
        ["Che cosa organizzano le Regioni?", ["la sanità", "l'anagrafe", "la raccolta dei rifiuti", "le carte d'identità"], "la sanità"]
      ],
      hunt: { label: "Tocá los conectores", targets: ["infatti", "cioè", "inoltre", "però", "insomma", "invece"] } },

    { id: "cv-29", week: 29, series: "cultura", area: "Civiltà", n: 13, level: "B2", emoji: "🗳️",
      title: "Il referendum", grammar: "congiuntivo passato",
      text:
        "Il referendum è uno strumento che gli italiani conoscono bene. Il più famoso è quello del 2 giugno 1946, quando " +
        "i cittadini hanno scelto tra monarchia e repubblica, e per la prima volta hanno votato anche le donne.\n\n" +
        "Oggi il referendum più comune è quello abrogativo: i cittadini possono cancellare una legge o una parte di una " +
        "legge. Per chiederlo servono cinquecentomila firme. Però attenzione al quorum: il risultato vale solo se ha " +
        "votato più della metà degli elettori.\n\n" +
        "Negli ultimi anni molti referendum non hanno raggiunto il quorum. Alcuni pensano che gli italiani abbiano perso " +
        "interesse per la politica; altri credono che molti elettori siano rimasti a casa apposta, perché restare a casa " +
        "è anche un modo di votare «no». Probabilmente hanno ragione un po' tutti.",
      gloss: { strumento: "herramienta", monarchia: "monarquía", abrogativo: "derogatorio (anula una ley)", firme: "firmas",
               quorum: "quórum", elettori: "electores", raggiunto: "alcanzado", apposta: "a propósito" },
      questions: [
        ["Che cosa hanno scelto gli italiani il 2 giugno 1946?", ["tra monarchia e repubblica", "il nuovo presidente", "una nuova legge sul lavoro", "tra due partiti"], "tra monarchia e repubblica"],
        ["Quando è valido un referendum abrogativo?", ["se vota più della metà degli elettori", "se lo firmano cinquecentomila cittadini", "se il governo è d'accordo", "sempre, con qualsiasi risultato"], "se vota più della metà degli elettori"],
        ["Che cosa pensano alcuni degli italiani di oggi?", ["che non si interessino più alla politica", "che votino troppo spesso", "che non abbiano mai capito come si vota", "che preferiscano la monarchia"], "che non si interessino più alla politica"]
      ],
      hunt: { label: "Tocá los auxiliares del congiuntivo passato (abbiano, siano)", targets: ["abbiano", "siano"] } },

    { id: "cv-30", week: 30, series: "cultura", area: "Civiltà", n: 14, level: "B2", emoji: "📺",
      title: "La Rai e i giornali", grammar: "congiuntivo imperfetto",
      text:
        "Per molti anni in Italia c'è stata solo la Rai, la televisione pubblica. Negli anni Cinquanta poche famiglie " +
        "avevano un televisore, e la sera i vicini andavano al bar perché tutti potessero vedere in compagnia i quiz " +
        "del giovedì. Negli anni Sessanta un maestro, Alberto Manzi, ha insegnato a leggere agli adulti con il programma " +
        "Non è mai troppo tardi: lo Stato voleva che anche chi non era andato a scuola imparasse l'italiano. Ancora " +
        "oggi chi ha un televisore paga il canone Rai, che arriva con la bolletta della luce.\n\n" +
        "Anche i giornali hanno una lunga storia. I quotidiani più letti sono il Corriere della Sera e la Repubblica, " +
        "ma per molto tempo il più venduto è stato un giornale sportivo, la Gazzetta dello Sport, su carta rosa. Molti " +
        "lettori, però, vorrebbero che i giornali online fossero gratis.",
      gloss: { televisore: "televisor", quiz: "programa de preguntas", maestro: "maestro de escuela", tardi: "tarde",
               canone: "abono, tasa", bolletta: "factura", quotidiani: "diarios", venduto: "vendido", gratis: "gratis" },
      questions: [
        ["Perché negli anni Cinquanta i vicini andavano al bar?", ["per vedere la televisione insieme", "per leggere il giornale", "per ascoltare la radio", "per giocare a carte con gli amici"], "per vedere la televisione insieme"],
        ["Che cosa voleva lo Stato con il programma di Manzi?", ["che gli adulti imparassero a leggere", "che i bambini guardassero la tv", "che la gente comprasse un televisore", "che i giornali costassero meno"], "che gli adulti imparassero a leggere"],
        ["Di che colore è la carta della Gazzetta dello Sport?", ["rosa", "bianca", "gialla", "verde"], "rosa"]
      ],
      hunt: { label: "Tocá el congiuntivo imperfetto", targets: ["potessero", "imparasse", "fossero"] } },

    { id: "cv-31", week: 31, series: "cultura", area: "Civiltà", n: 15, level: "B2", emoji: "💼",
      title: "Il contratto e la busta paga", grammar: "condizionale passato",
      text:
        "Chi comincia a lavorare in Italia deve capire prima di tutto il suo contratto. Il più sicuro è quello a tempo " +
        "indeterminato; molti giovani, però, cominciano con un contratto a termine o con uno stage.\n\n" +
        "Ogni mese arriva la busta paga, e la prima sorpresa è la differenza tra lordo e netto: dallo stipendio lordo " +
        "spariscono le tasse e i contributi per la pensione, che vanno all'INPS. Ma ci sono anche buone notizie: a " +
        "dicembre molti lavoratori ricevono la tredicesima, uno stipendio in più, e quando il contratto finisce c'è il " +
        "TFR, una somma che l'azienda ha messo da parte per te.\n\n" +
        "Martina, ventisei anni, racconta: «Al primo stipendio avrei voluto comprare mille cose. Poi ho visto il netto " +
        "e ho capito che avrei dovuto leggere meglio il contratto!»",
      gloss: { indeterminato: "(a tempo indeterminato) por tiempo indeterminado, fijo", termine: "(a termine) a plazo fijo",
               stage: "pasantía", busta: "(busta paga) recibo de sueldo", lordo: "bruto", netto: "neto", stipendio: "sueldo",
               contributi: "aportes", pensione: "jubilación", tredicesima: "aguinaldo", somma: "suma" },
      questions: [
        ["Che cos'è la tredicesima?", ["uno stipendio in più a dicembre", "una tassa per la pensione", "un contratto che dura tredici mesi", "un giorno di ferie"], "uno stipendio in più a dicembre"],
        ["Dove vanno i contributi per la pensione?", ["all'INPS", "al Comune", "all'azienda", "alla banca"], "all'INPS"],
        ["Che cosa avrebbe dovuto fare Martina?", ["leggere meglio il contratto", "chiedere uno stipendio più alto", "comprare meno cose", "cambiare lavoro subito"], "leggere meglio il contratto"]
      ],
      hunt: { label: "Tocá el auxiliar del condizionale passato", targets: ["avrei"] } },

    { id: "cv-32", week: 32, series: "cultura", area: "Civiltà", n: 16, level: "B2", emoji: "🪪",
      title: "Codice fiscale e tessera sanitaria", grammar: "concordanza dei tempi",
      text:
        "Quando Julián è arrivato a Torino, pensava che per lavorare bastasse il passaporto. All'agenzia, invece, gli " +
        "hanno detto che prima doveva avere il codice fiscale.\n\n" +
        "Il codice fiscale è una sigla di sedici caratteri, tra lettere e numeri, che contiene il cognome, il nome, la " +
        "data e il luogo di nascita. Serve quasi per tutto: per firmare un contratto d'affitto, per aprire un conto in " +
        "banca, per comprare un telefono. Gli stranieri lo chiedono all'Agenzia delle Entrate o al consolato.\n\n" +
        "Qualche settimana dopo è arrivata per posta la tessera sanitaria, con lo stesso codice. Julián non sapeva che " +
        "servisse anche in farmacia: il farmacista gli ha spiegato che con la tessera avrebbe potuto scaricare le spese " +
        "dei medicinali dalle tasse. «Nessuno me l'aveva detto!», racconta.",
      gloss: { sigla: "sigla, código", caratteri: "caracteres", cognome: "apellido", affitto: "alquiler",
               entrate: "(Agenzia delle Entrate) la oficina de impuestos", tessera: "tarjeta", sanitaria: "de salud",
               scaricare: "deducir", spese: "gastos", medicinali: "remedios" },
      questions: [
        ["Che cosa pensava Julián quando è arrivato?", ["che bastasse il passaporto", "che il lavoro fosse facile", "che Torino fosse piccola", "che servisse un visto"], "che bastasse il passaporto"],
        ["Quanti caratteri ha il codice fiscale?", ["sedici", "dieci", "otto", "venti"], "sedici"],
        ["A che cosa serve la tessera in farmacia?", ["a scaricare le spese dalle tasse", "a pagare meno le medicine subito", "a comprare medicine senza ricetta", "a vedere il medico di base"], "a scaricare le spese dalle tasse"]
      ],
      hunt: { label: "Tocá los verbos de la concordancia en pasado", targets: ["bastasse", "doveva", "servisse", "avrebbe", "aveva"] } },

    { id: "cv-33", week: 33, series: "cultura", area: "Civiltà", n: 17, level: "B2", emoji: "🎓",
      title: "L'università italiana", grammar: "periodo ipotetico",
      text:
        "L'università italiana ha due livelli: la laurea triennale, di tre anni, e la laurea magistrale, di altri due. " +
        "Medicina e Giurisprudenza, invece, durano cinque o sei anni tutte insieme.\n\n" +
        "Una differenza che sorprende gli argentini sono gli esami. Molti sono orali: lo studente si siede davanti al " +
        "professore e risponde alle domande per venti minuti. Il voto va da diciotto a trenta, e i più bravi prendono " +
        "«trenta e lode». Se il voto non ti piace, puoi rifiutarlo e ripetere l'esame alla sessione successiva.\n\n" +
        "«Se avessi saputo che gli esami erano orali, avrei studiato in un altro modo», racconta Tomás, studente a " +
        "Padova. «Ma se dovessi scegliere di nuovo, sceglierei ancora l'Italia: il giorno della laurea, con la corona " +
        "d'alloro in testa, è stato indimenticabile.»",
      gloss: { laurea: "título universitario", triennale: "de tres años", giurisprudenza: "Derecho", lode: "(trenta e lode) diez felicitado",
               rifiutarlo: "rechazarlo", sessione: "turno de exámenes", corona: "corona", alloro: "laurel", indimenticabile: "inolvidable" },
      questions: [
        ["Quanto dura la laurea triennale?", ["tre anni", "due anni", "cinque anni", "sei anni"], "tre anni"],
        ["Che cosa puoi fare se il voto non ti piace?", ["rifiutarlo e ripetere l'esame", "chiedere di cambiare professore subito", "pagare per cambiarlo", "scrivere al rettore"], "rifiutarlo e ripetere l'esame"],
        ["Che cosa avrebbe fatto Tomás, se avesse saputo degli esami orali?", ["avrebbe studiato in un altro modo", "avrebbe scelto un'altra università", "non sarebbe venuto in Italia", "avrebbe cambiato facoltà"], "avrebbe studiato in un altro modo"]
      ],
      hunt: { label: "Tocá el congiuntivo después de se", targets: ["avessi", "dovessi"] } },

    { id: "cv-34", week: 34, series: "cultura", area: "Civiltà", n: 18, level: "B2", emoji: "🎄",
      title: "Da Natale alla Befana", grammar: "pronomi relativi",
      text:
        "Le feste di fine anno, in Italia, durano quasi due settimane. Il 24 dicembre molte famiglie del Sud mangiano il " +
        "cenone della vigilia, in cui di solito non c'è carne ma molto pesce. Il 25 è il giorno del pranzo in famiglia, " +
        "che può durare tutto il pomeriggio.\n\n" +
        "Poi arriva il Capodanno. La sera del 31 gli italiani mangiano le lenticchie, che secondo la tradizione portano " +
        "soldi, e a mezzanotte brindano con lo spumante.\n\n" +
        "La festa che chiude tutto è il 6 gennaio, l'Epifania. La notte prima passa la Befana, una vecchia signora su una " +
        "scopa che porta dolci ai bambini buoni e carbone a quelli cattivi. C'è un proverbio che tutti i bambini " +
        "conoscono: «L'Epifania tutte le feste porta via».",
      gloss: { cenone: "gran cena", vigilia: "víspera (Nochebuena)", lenticchie: "lentejas", brindano: "brindan",
               spumante: "espumante", scopa: "escoba", carbone: "carbón", proverbio: "refrán", via: "(portare via) llevarse" },
      questions: [
        ["Che cosa mangiano molte famiglie del Sud la sera del 24?", ["molto pesce", "solo carne", "le lenticchie", "il panettone e basta"], "molto pesce"],
        ["Perché gli italiani mangiano le lenticchie a Capodanno?", ["perché portano soldi", "perché sono leggere", "perché costano poco", "perché piacciono ai bambini"], "perché portano soldi"],
        ["Che cosa porta la Befana ai bambini cattivi?", ["il carbone", "i dolci", "i regali", "niente"], "il carbone"]
      ],
      hunt: { label: "Tocá los pronombres relativos", targets: ["cui", "che"] } },

    { id: "cv-35", week: 35, series: "cultura", area: "Civiltà", n: 19, level: "B2", emoji: "♻️",
      title: "La raccolta differenziata", grammar: "voce passiva",
      text:
        "In molte città italiane i rifiuti vengono divisi in casa: la carta, la plastica, il vetro, l'umido e " +
        "l'indifferenziata. Ogni tipo di rifiuto va messo in un sacchetto o in un bidone di un colore diverso.\n\n" +
        "In alcuni Comuni i bidoni sono in strada; in altri la raccolta viene fatta porta a porta, con un calendario " +
        "preciso: il lunedì viene ritirata la carta, il martedì l'umido, e così via. Chi sbaglia rischia una multa, e un " +
        "sacchetto sbagliato può essere lasciato davanti alla porta con un adesivo rosso.\n\n" +
        "Per uno straniero, all'inizio, è un piccolo incubo. Però i risultati sono evidenti: in alcune regioni del Nord " +
        "più del settanta per cento dei rifiuti viene riciclato.",
      gloss: { rifiuti: "residuos", vetro: "vidrio", umido: "residuos orgánicos", indifferenziata: "lo que no se recicla",
               sacchetto: "bolsita", bidone: "tacho", ritirata: "retirada", adesivo: "calco, etiqueta", incubo: "pesadilla",
               riciclato: "reciclado" },
      questions: [
        ["Come viene fatta la raccolta in alcuni Comuni?", ["porta a porta, con un calendario", "solo una volta al mese", "dai cittadini, con la propria macchina", "di notte, senza calendario"], "porta a porta, con un calendario"],
        ["Che cosa rischia chi sbaglia?", ["una multa", "il carcere", "un corso obbligatorio", "niente"], "una multa"],
        ["Quanti rifiuti vengono riciclati in alcune regioni del Nord?", ["più del settanta per cento", "meno della metà", "circa il dieci per cento", "tutti"], "più del settanta per cento"]
      ],
      hunt: { label: "Tocá los auxiliares de la pasiva (venire, andare)", targets: ["vengono", "viene", "va"] } },

    { id: "cv-36", week: 36, series: "cultura", area: "Civiltà", n: 20, level: "B2", emoji: "🏢",
      title: "Vivere in condominio", grammar: "si passivante e impersonale",
      text:
        "Gli italiani che abitano in città vivono quasi sempre in un condominio. Le regole si trovano nel regolamento, e " +
        "chi non le rispetta se ne accorge presto: in condominio si sa tutto di tutti.\n\n" +
        "Di solito non si può fare rumore dopo le dieci di sera e nelle ore del riposo, dopo pranzo. Non si stendono i " +
        "panni sul balcone che dà sulla strada, e le biciclette non si lasciano nell'androne.\n\n" +
        "Le spese comuni, come le pulizie delle scale o l'ascensore, si dividono in millesimi: chi ha un appartamento " +
        "più grande paga di più. Una volta all'anno si fa l'assemblea, dove si discute di tutto, dal tetto che perde al " +
        "vicino che parcheggia male. L'amministratore scrive il verbale e si cerca di mettere d'accordo tutti.",
      gloss: { regolamento: "reglamento", accorge: "(accorgersene) darse cuenta", riposo: "descanso, siesta",
               stendono: "cuelgan (la ropa)", panni: "ropa lavada", androne: "hall de entrada", pulizie: "limpieza",
               millesimi: "milésimos (según el tamaño)", tetto: "techo", verbale: "acta" },
      questions: [
        ["Quando non si può fare rumore?", ["dopo le dieci e dopo pranzo", "solo la domenica mattina", "mai, in nessun momento", "prima delle otto di mattina"], "dopo le dieci e dopo pranzo"],
        ["Come si dividono le spese comuni?", ["in millesimi, secondo l'appartamento", "in parti uguali tra tutti", "le paga l'amministratore", "le paga chi abita al piano terra"], "in millesimi, secondo l'appartamento"],
        ["Chi scrive il verbale dell'assemblea?", ["l'amministratore", "il vicino più anziano", "il portiere", "il sindaco"], "l'amministratore"]
      ],
      hunt: { label: "Tocá cada si impersonal o pasivante", targets: ["si"] } },

    { id: "cv-37", week: 37, series: "cultura", area: "Civiltà", n: 21, level: "B2", emoji: "🏥",
      title: "Il Servizio sanitario nazionale", grammar: "passato remoto",
      text:
        "Il Servizio sanitario nazionale nacque nel dicembre del 1978. Prima di quella data l'assistenza dipendeva dalle " +
        "«mutue», cioè da casse diverse per ogni categoria di lavoratori, e molte persone non avevano nessuna copertura. " +
        "La riforma stabilì un principio semplice: la salute è un diritto di tutti, e lo Stato la garantisce con le tasse.\n\n" +
        "Da allora ogni residente ha un medico di base, che si sceglie da un elenco della ASL, l'azienda sanitaria " +
        "locale. Le visite dal medico di base sono gratuite; per gli esami e le visite specialistiche, invece, si paga " +
        "spesso una piccola quota, il ticket.\n\n" +
        "La legge fu votata quasi da tutti i partiti, e Tina Anselmi, la ministra che la firmò, era stata due anni " +
        "prima la prima donna ministro della storia d'Italia.",
      gloss: { assistenza: "atención médica", sanitario: "de salud", sanitaria: "sanitaria (de salud)", residente: "residente", base: "(medico di base) médico de cabecera", specialistiche: "de especialistas", mutue: "obras sociales (de antes)", casse: "cajas", copertura: "cobertura", stabilì: "estableció",
               diritto: "derecho", elenco: "lista", visite: "consultas", quota: "cuota", ticket: "copago", firmò: "firmó" },
      questions: [
        ["Quando nacque il Servizio sanitario nazionale?", ["nel 1978", "nel 1946", "nel 1968", "nel 1990"], "nel 1978"],
        ["Che cosa si paga spesso per gli esami?", ["il ticket", "la mutua", "il medico di base", "la tessera"], "il ticket"],
        ["Chi era Tina Anselmi?", ["la ministra che firmò la legge", "la prima presidente della Repubblica", "una dottoressa della ASL", "la fondatrice delle mutue"], "la ministra che firmò la legge"]
      ],
      hunt: { label: "Tocá el passato remoto", targets: ["nacque", "stabilì", "fu", "firmò"] } },

    { id: "cv-38", week: 38, series: "cultura", area: "Civiltà", n: 22, level: "B2", emoji: "✊",
      title: "Il sindacato e lo sciopero", grammar: "discorso indiretto",
      text:
        "In Italia lo sciopero è un diritto scritto nella Costituzione, e i sindacati sono ancora forti: i tre più grandi " +
        "sono CGIL, CISL e UIL.\n\n" +
        "Venerdì scorso i lavoratori dei trasporti hanno incrociato le braccia per ventiquattro ore. I sindacati hanno " +
        "spiegato che chiedevano contratti migliori e che gli stipendi erano fermi da anni. Il ministro ha risposto che " +
        "il governo avrebbe aperto un tavolo di trattativa la settimana successiva.\n\n" +
        "Chi usa i mezzi pubblici conosce bene le «fasce di garanzia»: anche durante lo sciopero, treni e autobus devono " +
        "circolare in alcune ore, di solito la mattina presto e il tardo pomeriggio. Una pendolare ha detto che quel " +
        "giorno era uscita di casa alle sei e che sperava di tornare prima di sera.",
      gloss: { sciopero: "huelga", sindacati: "sindicatos", incrociato: "(incrociare le braccia) parar, hacer huelga",
               braccia: "brazos", fermi: "congelados, quietos", tavolo: "(tavolo di trattativa) mesa de negociación",
               trattativa: "negociación", fasce: "franjas", garanzia: "garantía",
               pendolare: "persona que viaja todos los días al trabajo" },
      questions: [
        ["Che cosa chiedevano i sindacati?", ["contratti migliori", "meno ore di lavoro", "nuovi treni", "un ministro diverso"], "contratti migliori"],
        ["Che cosa ha risposto il ministro?", ["che avrebbe aperto una trattativa", "che lo sciopero era illegale", "che gli stipendi sarebbero aumentati", "che non c'erano soldi"], "che avrebbe aperto una trattativa"],
        ["Che cosa sono le fasce di garanzia?", ["ore in cui i mezzi devono circolare", "giorni in cui è vietato scioperare", "sconti sui biglietti del treno", "aumenti di stipendio garantiti"], "ore in cui i mezzi devono circolare"]
      ],
      hunt: { label: "Tocá los verbos que presentan lo que dijo otro", targets: ["spiegato", "risposto", "detto"] } },

    { id: "cv-40", week: 40, series: "cultura", area: "Civiltà", n: 23, level: "C1", emoji: "🗂️",
      title: "All'anagrafe", grammar: "il causativo: fare e lasciare",
      text:
        "Per avere la residenza in Italia bisogna andare all'anagrafe del Comune. È lì che uno straniero si fa registrare " +
        "e, qualche giorno dopo, riceve la visita di un vigile, che controlla che abiti davvero a quell'indirizzo.\n\n" +
        "Con la residenza puoi farti fare la carta d'identità elettronica. Di solito si prende appuntamento online; allo " +
        "sportello poi ti fanno lasciare le impronte e ti fanno firmare un modulo. La foto, invece, te la fai fare prima, " +
        "in una cabina o da un fotografo. La carta arriva per posta dopo circa sei giorni.\n\n" +
        "«Il primo giorno volevo sbrigare tutto da sola», racconta Camila, venezuelana, «ma l'impiegata mi ha lasciato " +
        "parlare dieci minuti in spagnolo senza capire niente. Alla fine mi sono fatta aiutare da una vicina.»",
      gloss: { residenza: "domicilio legal", anagrafe: "registro civil", registrare: "registrar", vigile: "agente municipal",
               sportello: "ventanilla", impronte: "huellas", modulo: "formulario", cabina: "cabina (de fotos)",
               sbrigare: "resolver (un trámite)", impiegata: "empleada" },
      questions: [
        ["Chi controlla l'indirizzo dopo la registrazione?", ["un vigile", "il sindaco", "un vicino di casa", "il proprietario"], "un vigile"],
        ["Quanto tempo ci vuole per ricevere la carta?", ["circa sei giorni", "più o meno due mesi", "un anno", "un'ora"], "circa sei giorni"],
        ["Chi ha aiutato Camila?", ["una vicina", "l'impiegata", "un fotografo", "un vigile"], "una vicina"]
      ],
      hunt: { label: "Tocá las formas de fare y lasciare del causativo", targets: ["fa", "farti", "fanno", "fai", "lasciato", "fatta"] } },

    { id: "cv-41", week: 41, series: "cultura", area: "Civiltà", n: 24, level: "C1", emoji: "🚨",
      title: "Il 112, numero unico", grammar: "verbi di percezione",
      text:
        "In Italia, per ogni emergenza, oggi basta un solo numero: il 112. Prima c'erano numeri diversi per la polizia, " +
        "i carabinieri, i pompieri e l'ambulanza; oggi, in quasi tutte le regioni, risponde una centrale unica che " +
        "smista la chiamata.\n\n" +
        "Quando chiami, l'operatore ti chiede subito dove ti trovi e che cosa succede. Cerca di descrivere quello che " +
        "vedi e senti: se vedi uscire del fumo da una finestra, se senti qualcuno gridare, se hai visto una macchina " +
        "uscire di strada. Non riattaccare finché l'operatore non te lo dice.\n\n" +
        "«Ho sentito la voce dell'operatrice rimanere calmissima», racconta Andrea, che una notte ha visto il palazzo di " +
        "fronte riempirsi di fumo. «E dopo otto minuti ho sentito arrivare i pompieri.»",
      gloss: { carabinieri: "carabineros (policía militar)", pompieri: "bomberos", centrale: "central", smista: "deriva, distribuye",
               fumo: "humo", gridare: "gritar", riattaccare: "cortar (el teléfono)", finché: "hasta que", riempirsi: "llenarse" },
      questions: [
        ["Che cosa fa la centrale unica?", ["smista la chiamata", "manda sempre la polizia", "chiama i parenti", "scrive una multa"], "smista la chiamata"],
        ["Che cosa non devi fare durante la chiamata?", ["riattaccare prima del tempo", "descrivere quello che vedi", "dire dove ti trovi", "rispondere alle domande"], "riattaccare prima del tempo"],
        ["Dopo quanti minuti sono arrivati i pompieri?", ["otto", "due", "venti", "quaranta"], "otto"]
      ],
      hunt: { label: "Tocá los infinitivos después de vedere y sentire", targets: ["uscire", "gridare", "rimanere", "riempirsi", "arrivare"] } },

    { id: "cv-42", week: 42, series: "cultura", area: "Civiltà", n: 25, level: "C1", emoji: "💻",
      title: "SPID e PEC", grammar: "verbi e preposizioni",
      text:
        "Chi ha a che fare con la burocrazia italiana impara presto due sigle: SPID e PEC. Lo SPID è un'identità " +
        "digitale: con un nome utente e una password permette di accedere ai siti della pubblica amministrazione, " +
        "dall'INPS all'Agenzia delle Entrate, senza andare allo sportello.\n\n" +
        "La PEC, la posta elettronica certificata, serve invece a mandare messaggi con lo stesso valore di una " +
        "raccomandata con ricevuta di ritorno. Molti uffici chiedono di inviare i documenti via PEC e si rifiutano di " +
        "accettare una mail normale.\n\n" +
        "Il linguaggio, però, resta difficile. Una lettera tipica invita il cittadino «a provvedere al pagamento entro " +
        "trenta giorni» e gli ricorda «di attenersi alle istruzioni». Tradotto: paga entro un mese e segui le regole. " +
        "Molti stranieri finiscono per rivolgersi a un patronato, che li aiuta gratis.",
      gloss: { certificata: "certificada", inviare: "enviar", linguaggio: "lenguaje", sigle: "siglas", utente: "(nome utente) usuario", accedere: "acceder", sportello: "ventanilla",
               raccomandata: "carta certificada", ricevuta: "(ricevuta di ritorno) acuse de recibo", rifiutano: "(si rifiutano) se niegan",
               provvedere: "(provvedere a) encargarse de", attenersi: "atenerse", rivolgersi: "recurrir",
               patronato: "oficina gratuita de ayuda con trámites" },
      questions: [
        ["A che cosa serve lo SPID?", ["ad accedere ai siti pubblici", "a mandare lettere certificate", "a pagare le tasse in banca", "a chiedere la residenza"], "ad accedere ai siti pubblici"],
        ["Che valore ha un messaggio PEC?", ["quello di una raccomandata", "nessun valore legale", "quello di una firma dal notaio", "quello di una telefonata"], "quello di una raccomandata"],
        ["Che cosa fanno molti stranieri alla fine?", ["si rivolgono a un patronato", "chiedono aiuto al sindaco", "rinunciano alla residenza", "pagano un avvocato"], "si rivolgono a un patronato"]
      ],
      hunt: { label: "Tocá los verbos que piden a o di", targets: ["permette", "serve", "chiedono", "rifiutano", "invita", "provvedere", "ricorda", "attenersi", "finiscono", "rivolgersi"] } },

    { id: "cv-43", week: 43, series: "cultura", area: "Civiltà", n: 26, level: "C1", emoji: "🩺",
      title: "Il medico di base", grammar: "l'infinito",
      text:
        "Scegliere il medico di base è una delle prime cose da fare dopo aver preso la residenza. Il medico si sceglie " +
        "alla ASL o online, da un elenco di medici della zona, e visitarlo non costa niente.\n\n" +
        "Ma attenzione: il medico di base non fa tutto. Per un esame del sangue o per vedere uno specialista bisogna " +
        "farsi scrivere prima la ricetta, chiamata anche impegnativa. Poi si prenota attraverso il CUP, il centro unico " +
        "di prenotazione, e si paga il ticket. Aspettare mesi per una visita specialistica, purtroppo, non è raro.\n\n" +
        "«All'inizio non capivo perché dovessi passare sempre dal medico prima di prenotare», racconta Lucía, di " +
        "Montevideo. «Adesso lo trovo comodo: sapere che qualcuno conosce tutta la mia storia è rassicurante.»",
      gloss: { base: "(medico di base) médico de cabecera", residenza: "domicilio legal", elenco: "lista", sangue: "sangre", specialista: "especialista", ricetta: "receta, orden médica",
               impegnativa: "orden de derivación", prenota: "(prenotare) sacar turno", prenotazione: "turnos",
               ticket: "copago", rassicurante: "tranquilizador" },
      questions: [
        ["Quanto costa una visita dal medico di base?", ["niente", "il ticket", "trenta euro", "dipende dalla ASL"], "niente"],
        ["Che cosa serve per vedere uno specialista?", ["la ricetta del medico di base", "solo la tessera sanitaria", "una lettera firmata dall'ospedale", "il permesso del Comune"], "la ricetta del medico di base"],
        ["Che cosa pensa oggi Lucía del medico di base?", ["che è comodo e rassicurante", "che è inutile e lento", "che costa troppo", "che non conosce la sua storia"], "che è comodo e rassicurante"]
      ],
      hunt: { label: "Tocá los infinitivos", targets: ["scegliere", "fare", "aver", "visitarlo", "vedere", "farsi", "scrivere", "prenotare", "aspettare", "passare", "sapere"] } },

    { id: "cv-44", week: 44, series: "cultura", area: "Civiltà", n: 27, level: "C1", emoji: "🚑",
      title: "Al pronto soccorso", grammar: "gerundio e participio",
      text:
        "Arrivati al pronto soccorso, i pazienti non vengono visitati in ordine di arrivo. Un infermiere, parlando con il " +
        "paziente e misurando pressione e febbre, decide subito la gravità del caso e gli assegna un codice.\n\n" +
        "Il sistema, cambiato di recente in molte regioni, usa numeri e colori: il rosso è per chi è in pericolo di vita, " +
        "mentre chi arriva con un codice bianco, cioè con un problema non urgente, può aspettare anche molte ore. In " +
        "questi casi, avendo tempo, conviene andare dal medico di base o dalla guardia medica, che di notte e nei giorni " +
        "festivi sostituisce il medico.\n\n" +
        "«Ho aspettato cinque ore per una distorsione alla caviglia», racconta Diego. «Arrabbiato, ho chiesto " +
        "spiegazioni. Poi, vedendo arrivare un'ambulanza dopo l'altra, ho capito.»",
      gloss: { soccorso: "(pronto soccorso) guardia, emergencias", infermiere: "enfermero", pressione: "presión",
               gravità: "gravedad", assegna: "asigna", guardia: "(guardia medica) médico de guardia", festivi: "feriados",
               distorsione: "esguince", caviglia: "tobillo" },
      questions: [
        ["Chi decide il codice?", ["un infermiere", "il primo medico libero", "il paziente", "la guardia medica"], "un infermiere"],
        ["Che cosa significa il codice bianco?", ["un problema non urgente", "un pericolo di vita", "un caso da operare subito", "un paziente di passaggio"], "un problema non urgente"],
        ["Perché Diego alla fine ha capito?", ["ha visto arrivare molte ambulanze", "un medico gli ha spiegato tutto", "la caviglia non gli faceva più male", "ha letto un cartello"], "ha visto arrivare molte ambulanze"]
      ],
      hunt: { label: "Tocá los gerundios", targets: ["parlando", "misurando", "avendo", "vedendo"] } },

    { id: "cv-45", week: 45, series: "cultura", area: "Civiltà", n: 28, level: "C1", emoji: "🍝",
      title: "Il conto, per favore", grammar: "costruzioni verbali speciali",
      text:
        "Al ristorante, in Italia, ci vuole un po' di pazienza: il cameriere non porta il conto finché non lo chiedi tu. " +
        "Portarlo prima sarebbe scortese, come dire «andatevene».\n\n" +
        "Quando arriva il conto, molti stranieri se la prendono per due voci misteriose: il coperto, cioè il pane e il " +
        "servizio della tavola, da uno a tre euro a persona, e a volte il servizio. Se il menù le indica, il ristorante ha il diritto di farle pagare. La " +
        "mancia, invece, non è obbligatoria: chi desidera lascia qualche euro, ma nessuno ci rimane male se non lo fai.\n\n" +
        "E se il gruppo è grande? Gli italiani spesso pagano «alla romana», cioè dividendo il totale in parti uguali. Chi " +
        "ha mangiato solo un'insalata magari non ci sta, ma di solito se ne frega e paga lo stesso.",
      gloss: { pazienza: "paciencia", scortese: "descortés", coperto: "cubierto (pan y servicio de mesa)", voci: "ítems",
               mancia: "propina", rimane: "(rimanerci male) ofenderse", romana: "(alla romana) en partes iguales",
               insalata: "ensalada", frega: "(fregarsene) no importarle nada" },
      questions: [
        ["Quando porta il conto il cameriere?", ["quando lo chiedi tu", "subito dopo il dolce", "insieme al caffè", "prima di servire"], "quando lo chiedi tu"],
        ["Che cos'è il coperto?", ["il pane e il servizio della tavola", "la mancia per il cameriere", "una tassa del Comune", "il prezzo del vino della casa e dell'acqua"], "il pane e il servizio della tavola"],
        ["Che cosa significa pagare «alla romana»?", ["dividere il totale in parti uguali", "pagare solo quello che hai mangiato", "lasciare pagare chi ha invitato", "pagare in contanti"], "dividere il totale in parti uguali"]
      ],
      hunt: { label: "Tocá los verbos pronominales (ci vuole, se la prendono…)", targets: ["vuole", "andatevene", "prendono", "rimane", "sta", "frega"] } },

    { id: "cv-46", week: 46, series: "cultura", area: "Civiltà", n: 29, level: "C1", emoji: "🎪",
      title: "Sagre e feste di paese", grammar: "suffissi e alterazione",
      text:
        "D'estate, in quasi ogni paesino italiano, c'è una sagra: una festa popolare dedicata a un prodotto tipico, come " +
        "la sagra del tortellino, della porchetta o del pesce azzurro. Nella piazzetta si montano tavoloni di legno e i " +
        "volontari del paese cucinano per centinaia di persone.\n\n" +
        "Si mangia bene e si spende poco: un piatto di pasta costa sette o otto euro, un bicchiere di vinello della casa " +
        "due. Tra le bancarelle si trovano formaggini, salamini e dolcetti fatti in casa.\n\n" +
        "La sera arriva l'orchestrina e anche i nonni ballano il liscio. I ragazzini corrono tra i tavoli, e qualcuno " +
        "torna a casa con un palloncino in mano. L'unico difetto? Il parcheggio: bisogna lasciare la macchina " +
        "lontanissimo e fare una bella camminata.",
      gloss: { sagra: "fiesta popular (gastronómica)", porchetta: "cerdo asado", tavoloni: "mesones", legno: "madera",
               volontari: "voluntarios", bancarelle: "puestitos", liscio: "baile de salón popular", palloncino: "globito",
               camminata: "caminata" },
      questions: [
        ["Che cos'è una sagra?", ["una festa dedicata a un prodotto tipico", "una gara di cucina tra i ristoranti della regione", "un mercato di vestiti usati", "la festa del patrono in chiesa"], "una festa dedicata a un prodotto tipico"],
        ["Chi cucina alla sagra?", ["i volontari del paese", "i ristoranti vicini", "un cuoco famoso", "le scuole"], "i volontari del paese"],
        ["Qual è l'unico difetto della sagra?", ["il parcheggio", "i prezzi alti", "la musica", "il cibo freddo"], "il parcheggio"]
      ],
      hunt: { label: "Tocá las palabras con sufijo (-ino, -etto, -one, -ello…)", targets: ["paesino", "piazzetta", "tavoloni", "vinello", "formaggini", "salamini", "dolcetti", "orchestrina", "ragazzini", "palloncino"] } },

    { id: "cv-47", week: 47, series: "cultura", area: "Civiltà", n: 30, level: "C1", emoji: "🔑",
      title: "Cercare casa in affitto", grammar: "numerali, misure e quantità",
      text:
        "Chi cerca casa in affitto in Italia deve conoscere qualche numero. Il contratto più comune è il «quattro più " +
        "quattro»: dura quattro anni e si rinnova automaticamente per altri quattro. Esiste anche il «tre più due», a " +
        "canone concordato, con un affitto più basso e qualche vantaggio fiscale.\n\n" +
        "Alla firma il proprietario chiede di solito una caparra di due o tre mensilità, che restituisce alla fine se la " +
        "casa è in buone condizioni. A questa somma si aggiungono le spese condominiali, spesso tra i cinquanta e i cento " +
        "euro al mese, e, se c'è un'agenzia, una provvigione pari a circa una mensilità.\n\n" +
        "In una grande città una stanza per studenti fuorisede può costare più di cinquecento euro. Non a caso, quasi un " +
        "giovane su due vive ancora con i genitori.",
      gloss: { affitto: "alquiler", rinnova: "renueva", canone: "monto del alquiler", concordato: "acordado (regulado)",
               caparra: "depósito de garantía", mensilità: "mes (de alquiler)", restituisce: "devuelve",
               condominiali: "(spese condominiali) expensas", provvigione: "comisión",
               fuorisede: "que estudia lejos de su ciudad" },
      questions: [
        ["Quanto dura il primo periodo del contratto «quattro più quattro»?", ["quattro anni", "otto anni", "due anni", "un anno"], "quattro anni"],
        ["Che cos'è la caparra?", ["un deposito restituito alla fine", "una tassa del Comune che non si recupera", "il costo dell'agenzia", "l'affitto del primo mese"], "un deposito restituito alla fine"],
        ["Quanti giovani vivono ancora con i genitori?", ["quasi uno su due", "uno su dieci", "quasi tutti", "pochissimi"], "quasi uno su due"]
      ],
      hunt: { label: "Tocá los números", targets: ["quattro", "tre", "due", "cinquanta", "cento", "cinquecento"] } },

    { id: "cv-48", week: 48, series: "cultura", area: "Civiltà", n: 31, level: "C1", emoji: "🏛️",
      title: "Camera e Senato", grammar: "ordine delle parole e dislocazioni",
      text:
        "Le leggi, in Italia, le fa il Parlamento, che ha due Camere: la Camera dei deputati e il Senato. È un sistema " +
        "che si chiama «bicameralismo perfetto»: ogni legge deve essere approvata da tutte e due, con un testo identico.\n\n" +
        "Il governo, invece, lo guida il presidente del Consiglio, e per governare ha bisogno della fiducia delle due " +
        "Camere. Se la perde, cade. Nella storia della Repubblica i governi sono stati quasi settanta: è stata " +
        "l'instabilità, più che le idee, a fare notizia all'estero.\n\n" +
        "E il presidente della Repubblica? Lo eleggono deputati e senatori insieme, ogni sette anni. Il suo ruolo, lo " +
        "dicono tutti i manuali, è quello di un arbitro: non governa, ma può sciogliere le Camere e firma le leggi prima " +
        "che entrino in vigore.",
      gloss: { bicameralismo: "sistema de dos cámaras", senatori: "senadores", deputati: "diputados", approvata: "aprobada", consiglio: "(presidente del Consiglio) primer ministro",
               fiducia: "confianza (del Parlamento)", cade: "cae", instabilità: "inestabilidad", eleggono: "eligen",
               arbitro: "árbitro", sciogliere: "disolver", vigore: "(entrare in vigore) entrar en vigencia" },
      questions: [
        ["Che cosa significa «bicameralismo perfetto»?", ["le due Camere approvano lo stesso testo", "il presidente sceglie quale Camera vota la legge", "c'è una sola Camera", "il governo scrive le leggi"], "le due Camere approvano lo stesso testo"],
        ["Che cosa succede se il governo perde la fiducia?", ["cade", "cambia nome", "va al Senato", "resta per un anno"], "cade"],
        ["Ogni quanti anni viene eletto il presidente della Repubblica?", ["sette", "cinque", "quattro", "dieci"], "sette"]
      ],
      hunt: { label: "Tocá los pronombres que retoman lo ya dicho", targets: ["lo"] } },

    { id: "cv-49", week: 49, series: "cultura", area: "Civiltà", n: 32, level: "C1", emoji: "🏫",
      title: "La scuola in Italia", grammar: "registro alto e coesione testuale",
      text:
        "Il sistema scolastico italiano si articola in tre cicli. Dopo la scuola dell'infanzia, facoltativa, i bambini " +
        "frequentano cinque anni di scuola primaria e tre di secondaria di primo grado, che molti chiamano ancora «le " +
        "medie».\n\n" +
        "Successivamente gli studenti scelgono tra licei, istituti tecnici e istituti professionali. Tale scelta, sebbene " +
        "avvenga a soli quattordici anni, condiziona spesso l'intero percorso di studi; pertanto molte famiglie la vivono " +
        "con una certa ansia. L'obbligo scolastico, peraltro, dura fino ai sedici anni.\n\n" +
        "Il percorso si conclude con l'esame di Stato, la cosiddetta maturità. Va inoltre ricordato che la scuola " +
        "pubblica è largamente maggioritaria: le scuole private, in gran parte cattoliche, accolgono meno di un alunno " +
        "su dieci. In conclusione, si tratta di un sistema tradizionale, ma radicato.",
      gloss: { scolastico: "escolar", cicli: "ciclos", primaria: "primaria", secondaria: "secundaria", medie: "(le medie) la secundaria básica", istituti: "institutos, escuelas", professionali: "profesionales", condiziona: "condiciona", peraltro: "por otra parte", articola: "se organiza", facoltativa: "optativa", frequentano: "cursan", licei: "liceos (bachilleratos)",
               avvenga: "ocurra", percorso: "recorrido", obbligo: "obligatoriedad", cosiddetta: "la llamada",
               accolgono: "reciben", radicato: "arraigado" },
      questions: [
        ["Come chiamano molti la secondaria di primo grado?", ["le medie", "il liceo", "le elementari", "la maturità"], "le medie"],
        ["A che età gli studenti scelgono la scuola superiore?", ["a quattordici anni", "a sedici anni", "a dieci anni", "a diciotto anni"], "a quattordici anni"],
        ["Quanti alunni frequentano le scuole private?", ["meno di uno su dieci", "circa la metà", "quasi tutti", "uno su tre"], "meno di uno su dieci"]
      ],
      hunt: { label: "Tocá los conectores del registro alto", targets: ["successivamente", "tale", "sebbene", "pertanto", "peraltro", "inoltre", "conclusione"] } },

    { id: "cv-50", week: 50, series: "cultura", area: "Civiltà", n: 33, level: "C1", emoji: "📝",
      title: "La maturità", grammar: "lessico avanzato e falsi amici",
      text:
        "A giugno, per circa mezzo milione di ragazzi, arriva la maturità, l'esame che chiude la scuola superiore. Il " +
        "primo giorno c'è la prima prova, un tema di italiano che il ministero comunica solo la mattina stessa. Per " +
        "settimane i giornali cercano di indovinare gli autori: uscirà Pascoli? Toccherà a Ungaretti o a Montale?\n\n" +
        "Il giorno dopo c'è la seconda prova, diversa per ogni scuola: latino al liceo classico, matematica allo " +
        "scientifico. Infine c'è il colloquio orale, davanti a una commissione di professori. Molti studenti confessano " +
        "un certo disagio, e qualcuno arriva così imbarazzato da non riuscire a parlare.\n\n" +
        "L'esito si esprime in centesimi, da sessanta a cento, con la lode per i migliori. Anni dopo, quasi tutti gli " +
        "italiani ricordano ancora la traccia che scelsero quel giorno.",
      gloss: { ministero: "ministerio", confessano: "confiesan", tema: "composición (redacción)", indovinare: "adivinar", toccherà: "(toccare a) le tocará a",
               colloquio: "examen oral", commissione: "tribunal", disagio: "incomodidad, malestar",
               imbarazzato: "incómodo, avergonzado (no «embarazado»)", esito: "resultado (no «éxito»)",
               centesimi: "centésimos", traccia: "consigna (del tema)" },
      questions: [
        ["Quando conoscono gli studenti gli autori della prima prova?", ["la mattina stessa", "una settimana prima", "il giorno dopo", "a maggio"], "la mattina stessa"],
        ["Che cosa significa «esito» in questo testo?", ["risultato", "successo", "uscita", "voto massimo"], "risultato"],
        ["Com'è la seconda prova?", ["diversa per ogni tipo di scuola", "sempre di matematica, in tutte le scuole", "uguale per tutti", "solo orale"], "diversa per ogni tipo di scuola"]
      ],
      hunt: { label: "Tocá los falsos amigos (tema, colloquio, disagio…)", targets: ["tema", "colloquio", "disagio", "imbarazzato", "esito", "traccia"] } },

    { id: "cv-51", week: 51, series: "cultura", area: "Civiltà", n: 34, level: "C1", emoji: "☀️",
      title: "Ferragosto e le ferie", grammar: "ripasso generale C1",
      text:
        "Se c'è una data che ferma l'Italia, è il 15 agosto, Ferragosto. Il nome viene dalle «feriae Augusti», il " +
        "riposo che l'imperatore Augusto concesse ai Romani; più tardi la Chiesa fece coincidere la festa con " +
        "l'Assunzione di Maria.\n\n" +
        "Per decenni molte fabbriche chiudevano per tutto il mese e le città si svuotavano: chi poteva partiva per il " +
        "mare o la montagna, e chi restava trovava i negozi con il cartello «chiuso per ferie». Oggi le cose sono " +
        "cambiate, sebbene agosto resti il mese delle vacanze per eccellenza: i lavoratori hanno diritto ad almeno " +
        "quattro settimane di ferie pagate, e molti le spezzano in più periodi.\n\n" +
        "Resta intatto, invece, il rito del giorno: una grigliata con gli amici, un bagno al mare e, per i più " +
        "fortunati, i fuochi d'artificio sulla spiaggia.",
      gloss: { imperatore: "emperador", ferie: "vacaciones (del trabajo)", eccellenza: "(per eccellenza) por excelencia", intatto: "intacto", concesse: "concedió", coincidere: "coincidir", assunzione: "Asunción", decenni: "décadas", fabbriche: "fábricas",
               svuotavano: "vaciaban", cartello: "cartel", spezzano: "dividen", rito: "ritual", grigliata: "asado a la parrilla",
               fuochi: "(fuochi d'artificio) fuegos artificiales" },
      questions: [
        ["Da dove viene il nome Ferragosto?", ["dal riposo concesso da Augusto", "da una festa della Chiesa", "dal nome di un santo", "da una battaglia romana"], "dal riposo concesso da Augusto"],
        ["Quante settimane di ferie pagate hanno almeno i lavoratori?", ["quattro", "due", "sei", "otto"], "quattro"],
        ["Che cosa fanno molti italiani il giorno di Ferragosto?", ["una grigliata con gli amici", "una visita ai nonni in città", "un pranzo di lavoro", "una gita in montagna da soli"], "una grigliata con gli amici"]
      ],
      hunt: { label: "Tocá el passato remoto y el congiuntivo", targets: ["concesse", "fece", "resti"] } }
  ];

  var SERIES = [
    { id: "martin", name: "Martín a Bologna", emoji: "📖",
      blurb: "Una historia por capítulos, de A1 a B2. Cada episodio usa la gramática que estás viendo y abre el siguiente." },
    { id: "cultura", name: "Cultura", emoji: "🏛️",
      blurb: "Historia, filosofía, sociología y literatura italianas en textos graduados, y desde la semana 27 la civiltà: cómo funcionan en Italia la escuela, la sanidad, el trabajo, la casa, las fiestas, la mesa, el Estado y los medios. Cada uno se abre con la gramática que usa; entre los abiertos, elegí el que te interese." },
    { id: "settimana", name: "La settimana", emoji: "🗞️",
      blurb: "Un texto corto por semana con la gramática que estás viendo y palabras que ya conocés: para leer sin diccionario." },
    { id: "flood", name: "Inondazioni", emoji: "🌊",
      blurb: "Textos que repiten una estructura muchas veces: primero la leés sin marcas, después con la estructura resaltada. Así el oído y el ojo la fijan." }
  ];

  root.LETTURE_DATA = {
    EPISODI: EPISODI,
    SERIES: SERIES,
    // Multiple-choice glosses: grammar words are never asked.
    MC_SKIP: /^(molto|anche|ancora|sempre|poi|però|perché|quando|dove|come|questo|questa|quello|quella|mia|mio|tuo|tua|suo|sua)$/,
    // Comprehension in Italian (CILS, CELI): true, false or not said.
    vf: { prompt: "Vero, falso o non si dice?", options: ["vero", "falso", "non si dice"] },
    hunt: "Caccia alle forme · "
  };
})(typeof window !== "undefined" ? window : globalThis);
