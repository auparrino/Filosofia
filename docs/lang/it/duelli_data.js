/*
 * Duelli de La Via C1: dos formas que compiten.  Solo los datos: la lógica
 * (sesión, pista, lados) está en el núcleo, docs/js/duelli.js, que lee
 * window.DUELLI_DATA.  Cada duelo se abre cuando las dos formas ya se
 * enseñaron («week»).
 */
(function (root) {
  "use strict";

  // s: la oración con ___; a: la forma correcta; b: la que compite;
  // cue: lo que decide (un pedazo de la oración); why: la regla en una línea.
  var DUELLI = [
    { id: "ausiliare", week: 11, title: "essere o avere", sub: "el auxiliar del passato prossimo", items: [
      { s: "Ieri ___ andato al cinema.", a: "sono", b: "ho", cue: "andato", why: "«andare» es movimiento: essere." },
      { s: "Ieri ___ visto un bel film.", a: "ho", b: "sono", cue: "visto", why: "«vedere» tiene objeto: avere." },
      { s: "Maria ___ partita alle otto.", a: "è", b: "ha", cue: "partita", why: "«partire» es movimiento: essere, y el participio concuerda (-a)." },
      { s: "Maria ___ mangiato una pizza.", a: "ha", b: "è", cue: "mangiato", why: "«mangiare» tiene objeto: avere." },
      { s: "Noi ___ rimasti a casa.", a: "siamo", b: "abbiamo", cue: "rimasti", why: "«rimanere» (quedarse): essere." },
      { s: "Noi ___ dormito poco.", a: "abbiamo", b: "siamo", cue: "dormito", why: "«dormire»: avere, aunque no tenga objeto." },
      { s: "Il film ___ finito tardi.", a: "è", b: "ha", cue: "Il film", why: "«finire» sin objeto (la cosa termina): essere." },
      { s: "___ finito il lavoro alle sei.", a: "Ho", b: "Sono", cue: "il lavoro", why: "«finire» con objeto (terminás algo): avere." },
      { s: "I ragazzi ___ nati a Roma.", a: "sono", b: "hanno", cue: "nati", why: "«nascere»: essere." },
      { s: "I ragazzi ___ studiato tutto il giorno.", a: "hanno", b: "sono", cue: "studiato", why: "«studiare»: avere." }
    ] },
    { id: "pronomi", week: 10, title: "lo / la o gli / le", sub: "directo o indirecto", items: [
      { s: "Vedi Marco? Sì, ___ vedo stasera.", a: "lo", b: "gli", cue: "Vedi Marco", why: "«vedere qualcuno», sin «a»: directo, lo." },
      { s: "Telefoni a Marco? Sì, ___ telefono stasera.", a: "gli", b: "lo", cue: "a Marco", why: "«telefonare a qualcuno»: indirecto, gli." },
      { s: "Conosci Anna? Sì, ___ conosco bene.", a: "la", b: "le", cue: "Conosci Anna", why: "«conoscere qualcuno»: directo, la." },
      { s: "Scrivi ad Anna? Sì, ___ scrivo domani.", a: "le", b: "la", cue: "ad Anna", why: "«scrivere a qualcuno»: indirecto, le." },
      { s: "Aiuti tuo fratello? Sì, ___ aiuto sempre.", a: "lo", b: "gli", cue: "Aiuti tuo fratello", why: "«aiutare qualcuno» es directo en italiano (en castellano, «le ayudo»)." },
      { s: "Chiedi a tuo padre? Sì, ___ chiedo stasera.", a: "gli", b: "lo", cue: "a tuo padre", why: "«chiedere a qualcuno»: indirecto, gli." },
      { s: "Inviti Giulia? Sì, ___ invito alla festa.", a: "la", b: "le", cue: "Inviti Giulia", why: "«invitare qualcuno»: directo, la." },
      { s: "Rispondi alla professoressa? Sì, ___ rispondo subito.", a: "le", b: "la", cue: "alla professoressa", why: "«rispondere a qualcuno»: indirecto, le." },
      { s: "Ascolti la radio? Sì, ___ ascolto ogni mattina.", a: "la", b: "le", cue: "Ascolti la radio", why: "«ascoltare qualcosa»: directo, la." },
      { s: "Dai il libro a Paolo? Sì, ___ do il libro.", a: "gli", b: "lo", cue: "a Paolo", why: "El libro es el directo; «a Paolo», el indirecto: gli." }
    ] },
    { id: "dida", week: 9, title: "di o da", sub: "origen, desde, posesión", items: [
      { s: "Sono ___ Roma, ma vivo a Milano.", a: "di", b: "da", cue: "Sono", why: "«essere di» + ciudad: de dónde sos." },
      { s: "Vengo ___ Roma in treno.", a: "da", b: "di", cue: "Vengo", why: "«venire da»: de dónde llegás." },
      { s: "Studio italiano ___ tre anni.", a: "da", b: "di", cue: "tre anni", why: "«da» + tiempo: desde hace." },
      { s: "Il libro ___ Marco è sul tavolo.", a: "di", b: "da", cue: "Il libro", why: "Posesión: di." },
      { s: "Stasera vado ___ Luca.", a: "da", b: "di", cue: "vado", why: "A casa de alguien: da + persona." },
      { s: "È la macchina ___ mio padre.", a: "di", b: "da", cue: "la macchina", why: "Posesión: di." },
      { s: "Abito qui ___ gennaio.", a: "da", b: "di", cue: "gennaio", why: "«da»: desde un momento." },
      { s: "Domani parto ___ Milano.", a: "da", b: "di", cue: "parto", why: "«partire da»: el punto de partida." },
      { s: "Oggi vado ___ medico.", a: "dal", b: "del", cue: "vado", why: "Ir a lo de un profesional: da + artículo, dal medico." },
      { s: "Stasera ho voglia ___ un gelato.", a: "di", b: "da", cue: "voglia", why: "«avere voglia di»: ganas de." }
    ] },
    { id: "passato", week: 15, title: "passato prossimo o imperfetto", sub: "el hecho o el fondo", items: [
      { s: "Da bambino ___ sempre a calcio.", a: "giocavo", b: "ho giocato", cue: "sempre", why: "Hábito en el pasado: imperfetto." },
      { s: "Ieri ___ a calcio con gli amici.", a: "ho giocato", b: "giocavo", cue: "Ieri", why: "Un hecho puntual y terminado: passato prossimo." },
      { s: "Mentre ___, è suonato il telefono.", a: "cucinavo", b: "ho cucinato", cue: "Mentre", why: "La acción en curso que otra interrumpe: imperfetto." },
      { s: "All'improvviso ___ il telefono di casa.", a: "è suonato", b: "suonava", cue: "All'improvviso", why: "Lo que pasa de golpe: passato prossimo." },
      { s: "La casa dei nonni ___ grande e luminosa.", a: "era", b: "è stata", cue: "grande e luminosa", why: "Una descripción: imperfetto." },
      { s: "Nel 2010 ___ in Italia per un mese.", a: "sono stato", b: "stavo", cue: "per un mese", why: "Un período cerrado, con duración: passato prossimo." },
      { s: "Ogni estate ___ al mare con i nonni.", a: "andavamo", b: "siamo andati", cue: "Ogni estate", why: "Lo que se repetía: imperfetto." },
      { s: "Sabato scorso ___ al mare con Luca.", a: "siamo andati", b: "andavamo", cue: "Sabato scorso", why: "Una vez, en un momento dado: passato prossimo." },
      { s: "Non sono uscito perché ___ la febbre.", a: "avevo", b: "ho avuto", cue: "perché", why: "La causa, el estado de fondo: imperfetto." },
      { s: "___ il libro di Eco in due giorni.", a: "Ho letto", b: "Leggevo", cue: "in due giorni", why: "Una acción completa, con su límite: passato prossimo." }
    ] },
    { id: "futcond", week: 20, title: "futuro o condizionale", sub: "lo que va a pasar o lo que pasaría", items: [
      { s: "Domani ___ alle otto.", a: "partirò", b: "partirei", cue: "Domani", why: "Un hecho futuro: futuro." },
      { s: "___ un caffè macchiato, per favore.", a: "Vorrei", b: "Vorrò", cue: "per favore", why: "Un pedido cortés: condizionale." },
      { s: "Al posto tuo ___ con lui.", a: "parlerei", b: "parlerò", cue: "Al posto tuo", why: "Un consejo: condizionale." },
      { s: "L'anno prossimo ___ a Roma con mia sorella.", a: "andrò", b: "andrei", cue: "L'anno prossimo", why: "Un plan futuro: futuro." },
      { s: "Con più soldi ___ una casa al mare.", a: "comprerei", b: "comprerò", cue: "Con più soldi", why: "Una hipótesis: condizionale." },
      { s: "Stasera ___ tardi dal lavoro.", a: "tornerò", b: "tornerei", cue: "Stasera", why: "Un hecho futuro: futuro." },
      { s: "___ volentieri alla festa, ma non posso.", a: "Verrei", b: "Verrò", cue: "ma non posso", why: "Un deseo que no se cumple: condizionale." },
      { s: "Quando arriverai alla stazione, ti ___.", a: "chiamerò", b: "chiamerei", cue: "Quando arriverai", why: "Después de «quando» + futuro, futuro." },
      { s: "Scusi, mi ___ dire l'ora?", a: "saprebbe", b: "saprà", cue: "Scusi", why: "Una pregunta cortés: condizionale." },
      { s: "Fra dieci minuti ___ il treno per Napoli.", a: "arriverà", b: "arriverebbe", cue: "Fra dieci minuti", why: "Un hecho futuro: futuro." }
    ] },
    { id: "cine", week: 21, title: "ci o ne", sub: "el lugar o «de eso»", items: [
      { s: "Vai a Roma? Sì, ___ vado domani.", a: "ci", b: "ne", cue: "a Roma", why: "«ci» reemplaza un lugar: a Roma." },
      { s: "Quanti fratelli hai? ___ ho due.", a: "Ne", b: "Ci", cue: "Quanti", why: "«ne» con una cantidad: de eso, dos." },
      { s: "Pensi all'esame? Sì, ___ penso sempre.", a: "ci", b: "ne", cue: "all'esame", why: "«pensare a qualcosa»: ci." },
      { s: "Parli del problema? Sì, ___ parlo domani.", a: "ne", b: "ci", cue: "del problema", why: "«parlare di qualcosa»: ne." },
      { s: "Vuoi del pane? Sì, ___ voglio un po'.", a: "ne", b: "ci", cue: "un po'", why: "«ne» con una cantidad." },
      { s: "Sei mai stato in Sicilia? Sì, ___ sono stato l'anno scorso.", a: "ci", b: "ne", cue: "in Sicilia", why: "«ci» reemplaza un lugar." },
      { s: "Quanti caffè bevi? ___ bevo tre al giorno.", a: "Ne", b: "Ci", cue: "tre", why: "«ne» con una cantidad." },
      { s: "Credi ai fantasmi? No, non ___ credo.", a: "ci", b: "ne", cue: "ai fantasmi", why: "«credere a qualcosa»: ci." },
      { s: "Che ___ pensi di questo film?", a: "ne", b: "ci", cue: "di questo film", why: "«pensare di» (qué opinás de): ne." },
      { s: "Vivi a Milano? Sì, ___ vivo da due anni.", a: "ci", b: "ne", cue: "a Milano", why: "«ci» reemplaza un lugar." }
    ] },
    { id: "congiuntivo", week: 25, title: "indicativo o congiuntivo", sub: "lo que sabés o lo que opinás", items: [
      { s: "Penso che Marco ___ stanco.", a: "sia", b: "è", cue: "Penso che", why: "Una opinión: congiuntivo." },
      { s: "So che Marco ___ stanco.", a: "è", b: "sia", cue: "So che", why: "Algo que sabés: indicativo." },
      { s: "Spero che tu ___ bene in Italia.", a: "stia", b: "stai", cue: "Spero che", why: "Un deseo: congiuntivo." },
      { s: "È vero che Anna ___ a Roma.", a: "abita", b: "abiti", cue: "È vero che", why: "Una certeza: indicativo." },
      { s: "Credo che ___ tardi per uscire.", a: "sia", b: "è", cue: "Credo che", why: "Una opinión: congiuntivo." },
      { s: "Sono sicuro che Marco ___ ragione.", a: "ha", b: "abbia", cue: "Sono sicuro che", why: "Una certeza: indicativo." },
      { s: "Voglio che tu ___ con me al cinema.", a: "venga", b: "vieni", cue: "Voglio che", why: "Querer que otro haga algo: congiuntivo." },
      { s: "Vedo che oggi ___ molto stanco.", a: "sei", b: "sia", cue: "Vedo che", why: "Lo que ves: indicativo." },
      { s: "Benché ___ tardi, esco.", a: "sia", b: "è", cue: "Benché", why: "«benché» pide siempre congiuntivo." },
      { s: "Dico che ___ una buona idea.", a: "è", b: "sia", cue: "Dico che", why: "Lo que afirmás: indicativo." }
    ] },
    { id: "relativi", week: 34, title: "che o cui", sub: "con o sin preposición", items: [
      { s: "Il libro ___ leggo è bello.", a: "che", b: "cui", cue: "leggo", why: "Objeto directo, sin preposición: che." },
      { s: "Il libro di ___ ti ho parlato è bello.", a: "cui", b: "che", cue: "di", why: "Después de preposición: cui." },
      { s: "La ragazza ___ abita qui è spagnola.", a: "che", b: "cui", cue: "abita", why: "Sujeto: che." },
      { s: "La ragazza con ___ esco è spagnola.", a: "cui", b: "che", cue: "con", why: "Después de preposición: cui." },
      { s: "La città in ___ vivo è piccola.", a: "cui", b: "che", cue: "in", why: "Después de preposición: cui." },
      { s: "Il film ___ abbiamo visto era lungo.", a: "che", b: "cui", cue: "abbiamo visto", why: "Objeto directo: che." },
      { s: "L'amico a ___ scrivo vive a Roma.", a: "cui", b: "che", cue: "a", why: "Después de preposición: cui." },
      { s: "Le persone ___ lavorano qui sono gentili.", a: "che", b: "cui", cue: "lavorano", why: "Sujeto: che." },
      { s: "Il motivo per ___ sono qui è semplice.", a: "cui", b: "che", cue: "per", why: "Después de preposición: cui." },
      { s: "La casa ___ ho comprato è vecchia.", a: "che", b: "cui", cue: "ho comprato", why: "Objeto directo: che." }
    ] }
  ];

  // k: el lado del duelo (0 = la primera forma del título, 1 = la segunda),
  // para que una sesión traiga las dos en la misma medida.
  function side(d, x) {
    var a = x.a.toLowerCase();
    switch (d.id) {
      case "ausiliare": return /essere/.test(x.why) ? 0 : 1;
      case "pronomi": return /indirecto/.test(x.why) ? 1 : 0;
      case "dida": return /^da/.test(a) ? 0 : 1;
      case "passato": return /imperfetto/.test(x.why) ? 0 : 1;
      case "futcond": return /condizionale/.test(x.why) ? 1 : 0;
      case "cine": return a === "ci" ? 0 : 1;
      case "congiuntivo": return /congiuntivo/.test(x.why) ? 0 : 1;
      case "relativi": return a === "che" ? 0 : 1;
    }
    return 0;
  }
  DUELLI.forEach(function (d) { d.items.forEach(function (x) { if (x.k == null) x.k = side(d, x); }); });

  root.DUELLI_DATA = { DUELLI: DUELLI };
})(typeof window !== "undefined" ? window : globalThis);
