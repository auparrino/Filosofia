/* Semanas del banco y primeras semanas (tools/lib/semanas_banco.py,
 * tools/{it,pt}/rasgos_banco.py, tools/it/bank/parole_settimana.py):
 * lo que el banco pide producir ya se vio, en los dos idiomas.
 *
 *   node tools/lib/test_fix_banco.js
 */
"use strict";
var pack = require("./pack.js");
var n = 0, bad = 0;
function ok(c, m) { n++; if (!c) { bad++; console.log("FAIL " + m); } }

function find(bank, re) {
  return bank.sentences.filter(function (s) { return re.test(s.it[0]); });
}
function wOf(bank, re) {
  var s = find(bank, re);
  return s.length ? s[0].w : null;
}
function errW(bank, re) {
  var e = bank.errors.filter(function (x) { return re.test(x.wrong); });
  return e.length ? e[0].w : null;
}
function anyVariant(s, re) { return s.it.every(function (v) { return re.test(v); }); }

/* ------------------------------------------------------------ italiano */
(function () {
  var c = pack("it"), bank = pack.data("it", "bank.json"), course = pack.data("it", "course.json");
  // verbos irregulares del banco que el sillabo no reconocía (152)
  ok(wOf(bank, /^Domani pioverà/) >= 19, "it: Domani pioverà → futuro (19): " + wOf(bank, /^Domani pioverà/));
  ok(wOf(bank, /^Cos'è successo\?/) >= 11, "it: Cos'è successo? → passato prossimo (11)");
  ok(wOf(bank, /è cresciuto/) >= 11, "it: è cresciuto → passato prossimo (11)");
  ok(wOf(bank, /paese è cambiato/) >= 11, "it: è cambiato → passato prossimo (11)");
  // gramática no verbal y etiquetas
  // «ci vediamo» es recíproco (12), no el «ci» de lugar (21)
  ok(wOf(bank, /^Ci vediamo domani/) === 12, "it: Ci vediamo domani → recíproco (12): " + wOf(bank, /^Ci vediamo domani/));
  ok(wOf(bank, /^Mi manchi/) >= 14, "it: Mi manchi → piacere y familia (14)");
  ok(wOf(bank, /^In Svizzera si parla/) >= 36, "it: si impersonale (36)");
  ok(wOf(bank, /^Chiudi la porta/) >= 12, "it: imperativo (12)");
  ok(errW(bank, /^Laura piace molto ballare/) >= 14, "it: error de piacere antes de la semana 14");
  ok(errW(bank, /^Ai miei genitori gli piace/) >= 14, "it: error de piacere antes de la semana 14 (2)");
  // invariantes: etiquetas y rasgos visibles en la respuesta
  var TAG = { piacere: 14, imperativo: 12, futuro: 19, congiuntivo_presente: 24, passivo: 35,
              passato_remoto: 37, si_impersonale: 36, pronomi_combinati: 22 };
  bank.sentences.forEach(function (s) {
    s.tags.forEach(function (t) {
      if (TAG[t]) ok(s.w >= TAG[t] && (!s.gap || s.wg >= TAG[t]), "it: etiqueta " + t + " antes de su semana: " + s.it[0] + " w" + s.w);
    });
    if (anyVariant(s, /\b(mio|mia|miei|mie|tuo|tua|tuoi|tue|suo|sua|nostr[oaie])\b/i))
      ok(s.w >= 3, "it: posesivo antes de la semana 3: " + s.it[0]);
    if (anyVariant(s, /\b(dieci|venti|trenta|quaranta|cinquanta|cento|mille)\b/i))
      ok(s.w >= 7, "it: número antes de la semana 7: " + s.it[0]);
  });
  // el conjugador de la app no cambió: el gimnasio sigue con sus verbos
  ok(!c.Conj.VERBS.piovere && !c.Conj.VERBS.succedere, "it: los irregulares del banco no entran al conjugador de la app");
  // la lexicón de formas sí los conoce
  var lex = JSON.parse(require("child_process").execFileSync("node", [require("path").join(pack.ROOT, "tools", "it", "forms_lexicon.js")], { maxBuffer: 64 * 1024 * 1024 }).toString());
  ["pioverà", "crebbe", "sorprese", "produrrà", "appaio"].forEach(function (f) {
    ok(lex.simple[f], "it: el léxico de formas no conoce «" + f + "»");
  });
  ["successo", "cresciuto", "sceso", "corretto", "proposto"].forEach(function (f) {
    ok(lex.participles[f], "it: el léxico de formas no conoce el participio «" + f + "»");
  });
  ok((lex.participles.piovuto || []).indexOf("essere") >= 0, "it: piovuto va con essere y con avere");

  // semanas 1 a 4: palabras del campo de la semana, ejemplos sin gramática posterior
  var FIELD = { 1: ["ciao", "grazie", "arrivederci", "nome"], 2: ["penna", "sedia", "zaino"],
                3: ["cornetto", "bicchiere", "scontrino"], 4: ["capelli", "biondo", "basso"] };
  var NOT_YET = /\b(fare|andare|volere|mangiare|prendere|dovere|piacere mi|partire|arrivare|scrivere)\b/;
  var IRR_OK = /^(sono|sei|è|siamo|siete|ho|hai|ha|abbiamo|avete|hanno|c'è|ci)$/;
  var FORMS = {}, NOMI = {};
  c.Conj.list().forEach(function (inf) {
    c.Conj.SIMPLE_TENSES.forEach(function (t) {
      try { c.Conj.conjugate(inf, t).forEach(function (f) { FORMS[f.split(" ").pop()] = inf; }); } catch (e) { /* no */ }
    });
  });
  bank.nouns.forEach(function (x) { NOMI[x[0]] = NOMI[x[2]] = 1; });
  bank.adjectives.forEach(function (x) { x.slice(0, 4).forEach(function (f) { NOMI[f] = 1; }); });
  bank.words.forEach(function (x) { NOMI[x[0]] = 1; });
  ["ecco", "piacere", "prego", "grazie", "scusa"].forEach(function (x) { NOMI[x] = 1; });
  [1, 2, 3, 4].forEach(function (wk) {
    var W = course.weeks[wk - 1], words = W.vocab.map(function (v) { return v[0]; });
    ok(W.vocab.length >= 10, "it: semana " + wk + " con pocas palabras: " + words.join(", "));
    FIELD[wk].forEach(function (x) { ok(words.indexOf(x) >= 0, "it: semana " + wk + " sin «" + x + "»: " + words.join(", ")); });
    ok(!words.some(function (x) { return NOT_YET.test(x); }), "it: semana " + wk + " con verbos de semanas posteriores: " + words.join(", "));
    W.vocab.forEach(function (v) {
      var ex = v[2] || "";
      ok(!/\b(è|sono|sei|siamo|siete|ho|hai|ha|abbiamo|avete|hanno)\s+\w+(ato|uto|ito|ata|uti|iti)\b/.test(ex) || /\bè (chius|apert)/.test(ex),
         "it: ejemplo en pasado en la semana " + wk + ": " + ex);
      ok(!/\b(due|tre|quattro|cinque|sei anni|dieci|venti|trenta)\b/.test(ex), "it: número en un ejemplo de la semana " + wk + ": " + ex);
      // un verbo conjugado que no sea essere / avere: solo desde la semana 5
      ex.toLowerCase().replace(/[.,!?¿¡—«»]/g, " ").split(/\s+/).forEach(function (t) {
        if (t && !IRR_OK.test(t) && FORMS[t] && !NOMI[t])
          ok(false, "it: ejemplo de la semana " + wk + " con «" + t + "» (" + FORMS[t] + "): " + ex);
      });
    });
  });
  // Scrivi 1 no pide la edad (los números llegan en la semana 7)
  var T1 = c.Scrivi.TASKS[1];
  ok(!/años|edad/.test(T1.t), "it: Scrivi 1 pide la edad: " + T1.t);
  ok(!/anni|\d/.test(T1.model), "it: el modelo de Scrivi 1 tiene una edad: " + T1.model);
})();

/* ----------------------------------------------------------- portugués */
(function () {
  var bank = pack.data("pt", "bank.json"), course = pack.data("pt", "course.json");
  // vocabulario: la primera semana en que la palabra aparece en el curso
  // (lección, palabras de la semana o ejercicio), o su lugar en el banco
  function firstSeen(word) {
    var re = new RegExp("(^|[^a-zà-úç])" + word + "([^a-zà-úç]|$)", "i"), items = {};
    course.items.forEach(function (i) { items[i.id] = i; });
    for (var k = 0; k < course.weeks.length; k++) {
      var W = course.weeks[k];
      var txt = JSON.stringify(W.lesson || {}) + JSON.stringify(W.vocab || []) +
        (W.items || []).concat(W.extra || []).map(function (id) { var i = items[id] || {}; return (i.stem || "") + " " + (i.answer || ""); }).join(" ");
      if (re.test(txt)) return W.week;
    }
    return 99;
  }
  // las del informe: palabras que se pedían antes de verlas
  [["geladeira", /geladeira/], ["feijão", /feijão/], ["suco", /suco de laranja/], ["churrasco", /churrasco no sábado/],
   ["brincando", /brincando/]].forEach(function (p) {
    find(bank, p[1]).forEach(function (s) {
      ok(s.w >= 5, "pt: «" + p[0] + "» todavía en la semana " + s.w + ": " + s.it[0]);
    });
  });
  // o su semana en «Palabras» del banco: las de A1 (semanas 1-8), de la
  // más frecuente a la menos, repartidas entre las semanas del nivel
  var lemmi = (pack.data("pt", "frequenza.json") || {}).lemmi || {};
  var A1 = [];
  bank.nouns.concat(bank.verbs, bank.adjectives).forEach(function (x) { if (x[5] === "A1" && A1.indexOf(x[0]) < 0) A1.push(x[0]); });
  bank.words.forEach(function (x) { if (x[3] === "A1" && A1.indexOf(x[0]) < 0) A1.push(x[0]); });
  var order = A1.map(function (wd, k) { return [wd, k]; }).sort(function (a, b) {
    return (((lemmi[b[0]] || [0])[0] || 0) - ((lemmi[a[0]] || [0])[0] || 0)) || a[1] - b[1];
  }).map(function (x) { return x[0]; });
  function bankWeek(lemma) {
    var r = order.indexOf(lemma);
    return r < 0 ? 99 : 1 + Math.floor(r * 8 / order.length);
  }
  [["cachorro", "cachorro"], ["vizinhos", "vizinho"]].forEach(function (p) {
    var w = p[0], fs = Math.min(firstSeen(w), firstSeen(p[1]), bankWeek(p[1]));
    find(bank, new RegExp("\\b" + w + "\\b")).forEach(function (s) {
      if (s.it.every(function (v) { return v.indexOf(w) >= 0; }) && fs < 99)
        ok(s.w >= fs, "pt: «" + w + "» (vista en la semana " + fs + ") pedida en la " + s.w + ": " + s.it[0]);
    });
  });
  // gramática no verbal
  var POSS = /\b(meu|minha|meus|minhas|teu|tua|seu|sua|seus|suas|nosso|nossa|nossos|nossas|dele|dela)\b/i;
  var FORMULA = /\b(meu nome|seu nome)\b/i;
  bank.sentences.forEach(function (s) {
    if (anyVariant(s, POSS) && !s.it.some(function (v) { return FORMULA.test(v); }))
      ok(s.w >= 10, "pt: posesivo antes de la semana 10: " + s.it[0] + " (w" + s.w + ")");
    if (anyVariant(s, /\b(fazendo|brincando|dormindo|correndo|falando|aprendendo|chovendo|trabalhando|esperando|estudando)\b/))
      ok(s.w >= 8, "pt: gerúndio antes de la semana 8: " + s.it[0]);
    if (anyVariant(s, /\b(dez|vinte|trinta|quarenta|cinquenta|cem|mil)\b/))
      ok(s.w >= 7, "pt: número antes de la semana 7: " + s.it[0]);
    if (anyVariant(s, /\b(né|cadê)\b/)) ok(s.w >= 38, "pt: né / cadê antes de la semana 38: " + s.it[0]);
    ok(s.wg >= 1 && s.w >= 1 && s.w <= 52 && s.wg <= 52, "pt: semana fuera de rango: " + s.it[0]);
  });
  bank.errors.forEach(function (e) {
    if (POSS.test(e.right) && !FORMULA.test(e.right)) ok(e.w >= 10, "pt: error con posesivo antes de la semana 10: " + e.wrong + " (w" + e.w + ")");
  });
  ok(wOf(bank, /^A minha mãe é professora/) >= 10, "pt: A minha mãe é professora → 10");
  ok(wOf(bank, /^Está fazendo trinta graus/) >= 8, "pt: Está fazendo trinta graus → 8");
})();

/* ----------------------------------- sesiones: nada antes de su semana */
["it", "pt"].forEach(function (code) {
  var c = pack(code), bank = pack.data(code, "bank.json");
  c.Banca.load(bank);
  [5, 8, 10, 12].forEach(function (wk) {
    var st = { unlocked: wk, cards: {} };
    for (var r = 0; r < 5; r++) {
      c.Banca.translateSession(st, 12).forEach(function (it) {
        var i = +it.id.split(":")[2];
        ok(bank.sentences[i].w <= wk, code + ": traducir en la semana " + wk + " trae la oración de la semana " + bank.sentences[i].w);
      });
    }
  });
});

console.log("controles: " + n + "   errores: " + bad);
process.exit(bad ? 1 : 0);
