/*
 * Variazioni: una frase già imparata, riscritta cambiando un solo pezzo
 * (un'altra persona, la negativa, un'altra cosa, il passato, il plurale).
 * Solo dati: la logica è nel nucleo, docs/js/variaciones.js, che coniuga
 * con Conj e corregge con il motore (Diagnosi).
 *
 * Ogni cornice (frame):
 *   f    l'id della frase (frasi_data.js)
 *   v    l'infinito del verbo che si coniuga; p la persona (0-5); t il tempo
 *        (predefinito: presente)
 *   tpl  la frase come stampo: {v} il verbo coniugato (con il suo pronome
 *        riflessivo), {n} dove va la negazione, {s} il soggetto (quando la
 *        frase lo dice), {o} la cosa (o)
 *   vars le variazioni:
 *        per  un'altra persona (p; s il soggetto, sub [[da, a]] altri
 *             cambi che vanno con la persona, fem: participio al femminile)
 *        neg  la negativa
 *        obj  un'altra cosa (o, cue: come si dice in castellano)
 *        pas  il passato prossimo (sub: ieri al posto di oggi…)
 *        plu  il plurale (p e/o o)
 *        w    la settimana da cui vale (se no: quella del tipo, sotto)
 * Il test (tools/lib/test_ejercicios.js) controlla che lo stampo rifaccia
 * la frase esatta e che ogni variazione passi dal correttore.
 */
(function (root) {
  "use strict";

  var FRAMES = [
    { f: "frase:ciao:3", v: "chiamarsi", p: 0, tpl: "{n} {v} Augusto.",
      vars: [{ k: "per", p: 1, sub: [["Augusto", "Anna"]] }, { k: "per", p: 2, s: "lei", sub: [["Augusto", "Anna"]] },
             { k: "neg" }, { k: "plu", p: 5, s: "loro", sub: [["Augusto", "Anna e Marco"]] }] },
    { f: "frase:ciao:5", v: "essere", p: 1, tpl: "Di dove {v}?",
      vars: [{ k: "plu", p: 4, s: "voi" }, { k: "plu", p: 5, s: "loro" }] },
    { f: "frase:ciao:6", v: "essere", p: 0, tpl: "{s} {v} argentino, di Buenos Aires.",
      vars: [{ k: "per", p: 2, s: "lei", sub: [["argentino", "argentina"]] },
             { k: "plu", p: 3, s: "noi", sub: [["argentino", "argentini"]] }] },
    { f: "frase:ciao:7", v: "fare", p: 1, tpl: "Che lavoro {v}?",
      vars: [{ k: "per", p: 2, s: "Lei" }, { k: "plu", p: 4, s: "voi" }] },
    { f: "frase:ciao:8", v: "abitare", p: 0, tpl: "{n} {v} qui da due anni.",
      vars: [{ k: "per", p: 1 }, { k: "plu", p: 3 }, { k: "neg" },
             { k: "obj", sub: [["due anni", "tre mesi"]], cue: "tres meses (tre mesi)" }] },
    { f: "frase:ciao:9", v: "parlare", p: 1, tpl: "{n} {v} {o}?", o: "spagnolo",
      vars: [{ k: "per", p: 2, s: "Lei" }, { k: "plu", p: 4, s: "voi" }, { k: "neg" },
             { k: "obj", o: "inglese", cue: "inglés (inglese)" }] },
    { f: "frase:ciao:10", v: "parlare", p: 0, tpl: "{v} un po' di {o}.", o: "italiano",
      vars: [{ k: "plu", p: 3 }, { k: "per", p: 2, s: "lei" }, { k: "obj", o: "francese", cue: "francés (francese)" }] },
    { f: "frase:salva:0", v: "capire", p: 0, t: "passatoProssimo", tpl: "Scusa, non {v}.",
      vars: [{ k: "plu", p: 3 }, { k: "plu", p: 5, s: "loro" }, { k: "per", p: 2, s: "lui" }] },
    { f: "frase:salva:1", v: "potere", p: 1, tpl: "{v} ripetere, per favore?",
      vars: [{ k: "per", p: 2, s: "Lei" }, { k: "plu", p: 4, s: "voi" }] },
    { f: "frase:salva:8", v: "stare", p: 0, tpl: "{n} {v} imparando {o}.", o: "l'italiano",
      vars: [{ k: "plu", p: 3 }, { k: "neg" }, { k: "obj", o: "lo spagnolo", cue: "el español (spagnolo, m.)" },
             { k: "obj", o: "il portoghese", cue: "el portugués (portoghese, m.)" }] },
    { f: "frase:bar:1", v: "volere", p: 0, t: "condizionale", tpl: "{v} {o}.", o: "un cappuccino e un cornetto",
      vars: [{ k: "plu", p: 3 },
             { k: "obj", o: "un caffè e una brioche", cue: "un café y una brioche (brioche, f.)" },
             { k: "obj", o: "un'aranciata", cue: "una naranjada (aranciata, f.)" }] },
    { f: "frase:bar:3", v: "potere", p: 0, tpl: "{v} pagare con la carta?",
      vars: [{ k: "plu", p: 3 }, { k: "per", p: 1 }] },
    { f: "frase:bar:11", v: "prendere", p: 0, tpl: "{n} lo {v} al banco.",
      vars: [{ k: "plu", p: 3 }, { k: "neg" }, { k: "per", p: 2, s: "lei" }] },
    { f: "frase:tavola:0", v: "avere", p: 4, tpl: "{v} un tavolo per due?",
      vars: [{ k: "per", p: 2, s: "Lei" }, { k: "obj", sub: [["per due", "per quattro"]], cue: "para cuatro (quattro)" }] },
    { f: "frase:tavola:2", v: "potere", p: 3, tpl: "{v} vedere {o}?", o: "il menù",
      vars: [{ k: "per", p: 0 }, { k: "obj", o: "il conto", cue: "la cuenta (conto, m.)" },
             { k: "obj", o: "la lista dei vini", cue: "la carta de vinos (lista dei vini, f.)" }] },
    { f: "frase:tavola:4", v: "prendere", p: 0, tpl: "{v} {o}.", o: "gli spaghetti alle vongole",
      vars: [{ k: "plu", p: 3 }, { k: "obj", o: "la pizza margherita", cue: "la pizza margherita (f.)" },
             { k: "obj", o: "un'insalata", cue: "una ensalada (insalata, f.)" }, { k: "pas" }] },
    { f: "frase:tavola:12", v: "passare", p: 1, tpl: "{n} mi {v} {o}?", o: "il sale",
      vars: [{ k: "per", p: 2, s: "Lei" }, { k: "plu", p: 4, s: "voi" }, { k: "neg" },
             { k: "obj", o: "l'acqua", cue: "el agua (acqua, f.)", bad: ["Mi passi la acqua?"] },
             { k: "obj", o: "il pane", cue: "el pan (pane, m.)" },
             { k: "plu", o: "i tovaglioli", cue: "las servilletas (tovaglioli, m. pl.)", bad: ["Mi passi le tovaglioli?"] }] },
    { f: "frase:tavola:16", v: "fare", p: 0, tpl: "{n} {v} {s} la spesa stasera.", s: true,
      vars: [{ k: "per", p: 1 }, { k: "plu", p: 3 }, { k: "pas", sub: [["stasera", "ieri sera"]] }] },
    { f: "frase:giro:5", v: "partire", p: 2, tpl: "A che ora {v} {o}?", o: "il treno",
      vars: [{ k: "obj", o: "l'autobus", cue: "el colectivo (autobus, m.)" },
             { k: "plu", p: 5, o: "i treni", cue: "los trenes", bad: ["A che ora parte i treni?"] }] },
    { f: "frase:giro:8", v: "dovere", p: 0, tpl: "{n} {v} scendere alla prossima fermata.",
      vars: [{ k: "plu", p: 3 }, { k: "neg" }, { k: "per", p: 2, s: "lei" }] },
    { f: "frase:negozi:11", v: "raffreddarsi", p: 0, t: "passatoProssimo", tpl: "{n} {v}.",
      vars: [{ k: "per", p: 2, s: "lei", fem: true }, { k: "plu", p: 3 }, { k: "neg" }] },
    { f: "frase:lavoro:0", v: "avere", p: 0, tpl: "{n} {v} una riunione alle tre.",
      vars: [{ k: "plu", p: 3 }, { k: "obj", sub: [["alle tre", "alle cinque"]], cue: "a las cinco (cinque)" }, { k: "pas" }] },
    { f: "frase:lavoro:10", v: "lavorare", p: 0, tpl: "Oggi {n} {v} da casa.",
      vars: [{ k: "plu", p: 3 }, { k: "neg" }, { k: "per", p: 2, s: "lei" }, { k: "pas", sub: [["Oggi", "Ieri"]] }] },
    { f: "frase:lavoro:13", v: "fare", p: 0, tpl: "{n} {v} una pausa.",
      vars: [{ k: "plu", p: 3 }, { k: "per", p: 1 }, { k: "pas" }] },
    { f: "frase:casa:4", v: "alzarsi", p: 0, tpl: "{n} {v} alle sette.",
      vars: [{ k: "per", p: 1 }, { k: "plu", p: 3 }, { k: "neg" },
             { k: "obj", sub: [["alle sette", "alle otto"]], cue: "a las ocho (otto)" }, { k: "pas" }] },
    { f: "frase:casa:6", v: "cucinare", p: 0, tpl: "Stasera {n} {v} {s}.", s: true,
      vars: [{ k: "per", p: 1 }, { k: "plu", p: 3 }, { k: "pas", sub: [["Stasera", "Ieri sera"]] }] },
    { f: "frase:casa:8", v: "andare", p: 0, tpl: "{n} {v} a letto presto.",
      vars: [{ k: "plu", p: 3 }, { k: "neg" }, { k: "per", p: 2, s: "lei" }, { k: "pas" }] },
    { f: "frase:negozi:10", v: "avere", p: 0, tpl: "{n} {v} la febbre.",
      vars: [{ k: "per", p: 2, s: "lui" }, { k: "neg" }, { k: "plu", p: 5, s: "loro" }] },
    { f: "frase:trappole:12", v: "fare", p: 0, tpl: "{n} {v} colazione alle otto.",
      vars: [{ k: "plu", p: 3 }, { k: "neg" }, { k: "per", p: 1 }, { k: "pas" }] }
  ];

  root.VARIACIONES_DATA = {
    frames: FRAMES,
    // Soggetti: [pronome da mostrare, come si dice in castellano]; il
    // soggetto in italiano si può omettere (proDrop): vale con e senza.
    subj: [["io", "yo"], ["tu", "vos"], ["lui", "él"], ["noi", "nosotros"], ["voi", "ustedes"], ["loro", "ellos"]],
    subjAlt: { lei: "ella", Lei: "usted", lui: "él", loro: "ellos" },
    proDrop: true,
    neg: "non",
    // L'errore tipico: il «no» castellano al posto di «non».
    negTrap: "no",
    negNote: "*Non* va antes del verbo y antes de los pronombres que se le pegan: *non mi chiamo*, *non lo prendo*.",
    // Il passato delle variazioni e da quale settimana (la prima del corso
    // che lo tiene nei tempi; il fallback vale senza corso).
    past: { tense: "passatoProssimo", week: 11,
            note: "*avere* o *essere* + participio.",
            agree: "Con *essere* (verbos de movimiento y pronominales) el participio concuerda: *sono andato / andata*." },
    // Settimana da cui si propone ogni tipo di cambio.
    weeks: { per: 1, neg: 1, obj: 3, plu: 2 }
  };
})(typeof window !== "undefined" ? window : globalThis);
