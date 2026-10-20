/* Controlli sul corso costruito e sulla logica di gioco.
   Run: node tools/it/test_game.js  */
var fs = require("fs");
var path = require("path");
var pack = require("../lib/pack.js");

var ROOT = pack.ROOT;
var ctx = pack("it");
var Conj = ctx.Conj;
var Engine = ctx.Engine;
var Drills = ctx.Drills;

var course = pack.data("it", "course.json");

var T = require("../lib/testkit.js")("it"), ok = T.ok;

/* ------------------------------------------------ integrità dei dati */

ok(course.weeks.length === 52, "52 settimane");
ok(course.seasons.length === 4, "4 stagioni");

var ids = {};
course.items.forEach(function (it) {
  ok(!ids[it.id], "id duplicato: " + it.id);
  ids[it.id] = it;
  ok(!!it.answer, "item senza risposta: " + it.id);
  ok(!!it.stem, "item senza enunciato: " + it.id);
  ok(!!it.prompt, "item senza consegna: " + it.id);
  if (it.type === "choice") {
    ok(it.options && it.options.length >= 2, "poche opzioni: " + it.id);
    ok(it.options.indexOf(it.answer) >= 0, "risposta fuori opzioni: " + it.id);
  }
});

course.weeks.forEach(function (w) {
  ok(w.items.length > 0 || (w.verbs && w.verbs.length),
     "settimana " + w.week + " senza contenuto giocabile");
  w.items.forEach(function (id) {
    ok(!!ids[id], "settimana " + w.week + " punta a un item inesistente: " + id);
  });
  ok(w.keys && w.keys.length >= 3, "settimana " + w.week + " senza briefing");
  (w.verbs || []).forEach(function (v) {
    ok(Conj.VERBS[v], "settimana " + w.week + ": verbo sconosciuto " + v);
  });
  (w.tenses || []).forEach(function (t) {
    ok(Conj.TENSE_LABELS[t], "settimana " + w.week + ": tempo sconosciuto " + t);
  });
});

/* Nothing before its theory: build_course.py marks in «wk» the first week
   whose lessons cover every tense and construction an item uses
   (tools/sillabo.py), and no week may ask anything later. */
var TENSE_WEEK = { presente: 1, imperfetto: 15, futuro: 19, condizionale: 20, congiuntivo: 24,
                   congImperfetto: 30, passatoRemoto: 37, passatoProssimo: 11,
                   trapassatoProssimo: 26, futuroAnteriore: 19, trapassatoRemoto: 37,
                   condizionalePassato: 31, congiuntivoPassato: 29, congiuntivoTrapassato: 30 };
course.weeks.forEach(function (w) {
  (w.items || []).concat(w.extra || []).forEach(function (id) {
    var it = ids[id];
    ok(it && it.wk && it.wk <= w.week,
       "settimana " + w.week + " chiede " + id + " prima della sua teoria (settimana " + (it && it.wk) + ")");
  });
  (w.tenses || []).forEach(function (t) {
    ok(w.boss || (TENSE_WEEK[t] || 99) <= w.week,
       "settimana " + w.week + ": il coniugatore chiede " + t + " prima della sua teoria");
  });
  (w.known || []).forEach(function (t) {
    ok((TENSE_WEEK[t] || 99) <= w.week, "settimana " + w.week + ": distrattori in " + t);
  });
});
course.challenges.forEach(function (c) {
  course.weeks.forEach(function (w) {
    if ((w.challenges || []).indexOf(c.id) >= 0) {
      (c.play || []).forEach(function (id) {
        ok(ids[id].wk <= w.week, "sfida " + c.id + " alla settimana " + w.week + " prima della teoria: " + id);
      });
    }
  });
});

var chalIds = {};
course.challenges.forEach(function (c) { chalIds[c.id] = true; });
course.weeks.forEach(function (w) {
  (w.challenges || []).forEach(function (id) {
    ok(chalIds[id], "sfida inesistente: " + id);
  });
});

/* --------------------------------------------------- generazione dei round */

course.weeks.forEach(function (w) {
  var r = Drills.buildRound(course, w, { size: 12 });
  ok(r.length > 0, "round vuoto alla settimana " + w.week);
  r.forEach(function (it) {
    ok(!!it && !!it.answer, "round settimana " + w.week + ": item malformato");
    if (it.type === "choice") {
      ok(it.options.indexOf(it.answer) >= 0,
         "distrattori senza risposta, settimana " + w.week + ", " + it.id);
      var uniq = {};
      it.options.forEach(function (o) { uniq[o] = true; });
      ok(Object.keys(uniq).length === it.options.length,
         "opzioni duplicate: " + it.id);
    }
  });
});

[13, 26, 39, 52].forEach(function (n) {
  var w = course.weeks[n - 1];
  ok(w.boss === true, "la settimana " + n + " deve essere un boss");
  var b = Drills.buildBoss(course, w, Engine.blankSave());
  ok(b.length >= 20, "boss " + n + " troppo corto: " + b.length);
});

/* ---------------------------------------------- il coniugatore nei drill */

var seen = {};
for (var i = 0; i < 4000; i++) {
  var verbs = Conj.list();
  var v = verbs[i % verbs.length];
  var t = Conj.ALL_TENSES[i % Conj.ALL_TENSES.length];
  var d = Drills.conjugationDrill(v, t);
  seen[d.type] = true;
  ok(d.options.indexOf(d.answer) >= 0, "drill senza risposta: " + v + "/" + t);
  ok(d.options.length === 4, "drill con " + d.options.length + " opzioni: " + v);
  var u = {};
  d.options.forEach(function (o) { u[o] = true; });
  ok(Object.keys(u).length === 4, "drill con opzioni ripetute: " + v + "/" + t);
}

/* ----------------------------------------------------- correzione e SRS */

ok(Engine.grade("parli", { answer: "parli", accept: ["parli"] }) === "giusto",
   "risposta esatta");
ok(Engine.grade("parla", { answer: "parli", accept: ["parli"] }) === "sbagliato",
   "desinenza sbagliata non perdonata");
ok(Engine.grade("parlero", { answer: "parlerò", accept: ["parlerò"] }) === "quasi",
   "accento mancante = quasi");
ok(Engine.grade("", { answer: "parli", accept: ["parli"] }) === "sbagliato",
   "risposta vuota");
ok(Engine.grade("grandi", { answer: "grandi, buone", accept: ["grandi, buone"] })
   === "giusto", "una delle risposte valide della banca lessicale");

var card = null;
for (var k = 0; k < 5; k++) card = Engine.schedule(card, 2);
ok(card.interval > 10, "l'intervallo cresce con i successi: " + card.interval);
var sBefore = card.s;
card = Engine.schedule(card, 0);
ok(card.interval <= 1 && card.reps === 0 && card.s < sBefore, "l'errore riazzera la scheda e abbassa la stabilità");

ok(Engine.levelFor(0).level === 1, "livello iniziale");
ok(Engine.levelFor(100).level === 2, "secondo livello a 100 xp");
ok(Engine.xpFor("giusto", 5) > Engine.xpFor("giusto", 0), "il combo paga di più");
ok(Engine.xpFor("sbagliato", 9) === 0, "nessuna xp per gli errori");

/* ------------------------------------- partita simulata di un anno intero */

var state = Engine.blankSave();
var weeksCleared = 0;
course.weeks.forEach(function (w) {
  var round = w.boss ? Drills.buildBoss(course, w, state)
                     : Drills.buildRound(course, w, { size: 25 });
  var right = 0;
  round.forEach(function (it) {
    if (it.type === "word") return;     // la scheda di una parola nuova non si risponde
    // Un giocatore che risponde sempre giusto deve poter avanzare.
    var verdict = Engine.grade(it.answer, it);
    if (verdict === "giusto") right++;
    if (it.src !== "coniugatore") {
      state.cards[it.id] = Engine.schedule(state.cards[it.id], 2);
    }
    state.totals.attempts++;
    state.totals.right++;
    state.xp += Engine.xpFor(verdict, 0);
  });
  var gradable = round.filter(function (it) { return it.type !== "word"; }).length;
  ok(right === gradable,
     "settimana " + w.week + ": la risposta del libro deve essere accettata (" +
     right + "/" + gradable + ")");
  var ws = state.weekStats[w.week] = { attempts: gradable, right: right,
                                       bossPassed: w.boss };
  if (ws.right >= 20) weeksCleared++;
});
ok(weeksCleared === 52, "tutte le settimane superabili: " + weeksCleared);
ok(state.xp > 5000, "xp accumulata in un anno: " + state.xp);

var badges = Engine.checkBadges(state);
ok(badges.length >= 4, "medaglie sbloccate a fine anno: " + badges.length);

/* --------------------------------------------------------------- ripasso */

var review = Drills.buildReview(course, state, 20);
ok(Array.isArray(review), "la coda di ripasso è una lista");
// (cards already learnt are retired and never come back: only the others)
Object.keys(state.cards).filter(function (id) { return !Engine.retired(state.cards[id]); }).slice(0, 30).forEach(function (id) {
  state.cards[id].due = Date.now() - 1000;
});
ok(Drills.dueCount(course, state) >= 30, "le schede scadute rientrano in coda");

/* ------------------------------------------- migrazione del vecchio ordine */

(function () {
  // Chi aveva finito le vecchie settimane 1-10 (fino a Piacere) ...
  var old = { syllabusV: undefined, unlocked: 11, week: 10, read: { 8: 1, 10: 1 },
              weekStats: { 5: { attempts: 20, right: 18 }, 8: { attempts: 5, right: 5 } }, lessonScore: {} };
  var s = Engine.migrateSyllabus(old);
  ok(s.syllabusV === 2, "migrazione: versione segnata");
  ok(s.week === 14, "migrazione: la settimana corrente (Piacere) diventa la 14");
  ok(!!s.read[10] && !!s.read[14], "migrazione: lezioni lette rinumerate (pronomi 8→10, piacere 10→14)");
  ok(!!s.weekStats[7] && !!s.weekStats[10], "migrazione: statistiche rinumerate (numeri 5→7, pronomi 8→10)");
  // vecchie 1-10 → nuove 1,2,3,4,7,5,6,10,12,14: la prima mancante è la 8
  ok(s.unlocked === 8, "migrazione: sbloccata la prima settimana nuova non fatta (" + s.unlocked + ")");
  ok(Engine.migrateSyllabus(s).unlocked === 8, "migrazione: una sola volta");
  ok(Engine.blankSave().syllabusV === 2, "un salvataggio nuovo nasce col nuovo ordine");
})();

/* ------------------------------------------- opciones que no regalan la respuesta */

// Una pregunta de opción múltiple no se acierta por parecido: la lección
// ofrece la misma frase con un error (o frases que comparten la mitad de las
// palabras), y la versión de reconocimiento de un ejercicio escrito da
// otras formas de la misma palabra o del mismo verbo.
(function () {
  var Lez = ctx.Lezione;
  var words = function (x) { return String(x).toLowerCase().replace(/[.,;:!?¿¡«»"()’']/g, " ").split(/\s+/).filter(Boolean); };
  var shared = function (a, b) { var bw = words(b); return words(a).filter(function (w) { return bw.indexOf(w) >= 0; }).length; };
  var seed = 11, rnd = function () { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  var bad = 0, seen = 0;
  course.weeks.forEach(function (w) {
    if (!w.lesson) return;
    for (var r = 0; r < 4; r++) Lez.steps(w.lesson, rnd, w.week, null).forEach(function (st) {
      if (st.kind !== "quiz" || (st.q.kind !== "ex" && st.q.kind !== "trap")) return;
      seen++;
      var need = Math.ceil(words(st.q.answer).length / 2);
      if (words(st.q.answer).length === 1) return;   // una palabra: la trampa es otra forma de ella
      st.q.options.forEach(function (o) { if (o !== st.q.answer && shared(o, st.q.answer) < need) { bad++; if (bad < 4) console.log("  lejana: " + st.q.answer + " / " + o); } });
    });
  });
  ok(seen > 500 && bad === 0, "lección: " + bad + " distractores de otra frase en " + seen + " preguntas");
  // Reconocimiento de «traducí»: las opciones comparten la mitad de las palabras.
  var map = {}; course.items.forEach(function (it) { map[it.id] = it; });
  var far = 0, n = 0;
  course.weeks.forEach(function (w) {
    var pool = w.items.map(function (id) { return map[id]; }).filter(Boolean);
    pool.forEach(function (it) {
      if (it.type !== "translate" || words(it.answer).length < 3) return;
      var q = Drills.firstRecognize([it], { cards: {} }, w.week, pool)[0];
      if (!q || !q.recog) return;
      n++;
      q.options.forEach(function (o) { if (o !== it.answer && shared(o, it.answer) < Math.ceil(words(it.answer).length / 3)) { far++; console.log("  lejana: " + it.answer + " / " + o); } });
    });
  });
  ok(n > 300 && far === 0, "reconocimiento: " + far + " opciones de otra frase en " + n + " traducciones");
})();

// Dominala no repite un ejercicio: el mismo puede estar con dos ids
// (d03-013 y g2-gd-32 son «amico → amici»).
(function () {
  var rep = 0;
  course.weeks.forEach(function (w) {
    for (var r = 0; r < 20; r++) {
      var seen = {};
      Drills.buildDomina(course, w, { cards: {}, unlocked: w.week }, {}).forEach(function (it) {
        var k = (it.prompt + "|" + it.stem + "|" + it.answer).toLowerCase(), k2 = (it.stem + "|" + it.answer).toLowerCase();
        if (/[a-zà-ù]/.test(it.stem || "") ? seen[k2] : seen[k]) { rep++; if (rep < 4) console.log("  repetida en semana " + w.week + ": " + it.stem); }
        seen[k] = seen[k2] = 1;
      });
    }
  });
  ok(rep === 0, "Dominala: " + rep + " ejercicios repetidos en la misma sesión");
})();

// Duelos: cada oración tiene sus dos formas, la pista está en la oración y
// «¿qué te lo dijo?» se puede armar; cada sesión trae los dos lados.
(function () {
  var Duelli = ctx.Duelli;
  Duelli.DUELLI.forEach(function (d) {
    var sides = [0, 0];
    d.items.forEach(function (x, k) {
      sides[Duelli.side(d, x)]++;
      ok(x.a !== x.b && x.s.indexOf("___") >= 0, "duelo " + d.id + " " + k + ": formas o hueco");
      ok(Duelli.filled(x).indexOf(x.cue) >= 0, "duelo " + d.id + " " + k + ": la pista no está en la oración");
      ok(!!Duelli.cueItem(d, k), "duelo " + d.id + " " + k + ": sin «¿qué te lo dijo?»");
    });
    ok(Math.abs(sides[0] - sides[1]) <= 2, "duelo " + d.id + ": lados desparejos " + sides);
    var ses = Duelli.session(d.id, {});
    var chosen = ses.filter(function (it) { return !it.cue; });
    ok(chosen.length === 8 && chosen.every(function (it) { return it.options.indexOf(it.answer) >= 0; }), "duelo " + d.id + ": sesión");
  });
})();

// «Adiviná»: dos o tres opciones distintas, todas la misma frase (con un
// error o con el orden cambiado), nunca otra frase entera.
(function () {
  var Frasi = ctx.Frasi;
  var far = 0, none = 0;
  Frasi.ALL.forEach(function (f) {
    var g = Frasi.guessItem(f);
    // no possible mistake (Prego!, Sério?): no «Adiviná», the phrase is presented
    if (!g) { none++; return; }
    ok(g.options.length >= 2 && g.options.length <= 3 && g.options.indexOf(f.it) >= 0 &&
       new Set(g.options).size === g.options.length, "adiviná: opciones " + f.id);
    // near: at most a third of the letters changed (Esato / Esatto, Me chiamo / Mi chiamo)
    var lev = function (a, b) {
      var d = [], i, j;
      for (i = 0; i <= a.length; i++) d[i] = [i];
      for (j = 1; j <= b.length; j++) d[0][j] = j;
      for (i = 1; i <= a.length; i++) for (j = 1; j <= b.length; j++)
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      return d[a.length][b.length];
    };
    var near = g.options.filter(function (o) {
      // (short ones: the same number of words, Saúde! / Salud!, and never an existing phrase)
      return o !== f.it && !Frasi.ALL.some(function (h) { return h.it === o; }) &&
        (lev(o.toLowerCase(), f.it.toLowerCase()) <= f.it.length / 3 || g.why[o] === "order" ||
         o.split(" ").length === f.it.split(" ").length);
    });
    // every wrong option is the same phrase: never another whole phrase
    if (near.length !== g.options.length - 1) far++;
  });
  ok(far === 0, "adiviná: opciones que no son la misma frase: " + far);
  ok(none <= Frasi.ALL.length * 0.07, "adiviná: frases sin ningún error posible: " + none);
})();

// Glosas de opción múltiple: la respuesta entre tres opciones distintas.
(function () {
  var Letture = ctx.Letture;
  var n = 0;
  Letture.EPISODI.forEach(function (ep) {
    var toks = Letture.allTokens(ep);
    Letture.mcTargets(ep).forEach(function (i) {
      var o = Letture.mcOptions(ep, toks[i]);
      n++;
      ok(o.options.length === 3 && o.options.indexOf(o.answer) >= 0 && new Set(o.options).size === 3, "glosa múltiple: " + ep.id + "/" + o.word);
    });
  });
  ok(n >= 100, "glosas de opción múltiple: " + n);
})();

// Voces reales (Lingua Libre): solo la palabra exacta, un archivo por hablante.
(function () {
  var Voci = ctx.Voci;
  ok(JSON.stringify(Voci.parseTitle("File:LL-Q652 (ita)-Anna Rossi-nonno.wav")) === JSON.stringify({ user: "Anna Rossi", word: "nonno" }), "voci: título");
  ok(Voci.parseTitle("File:LL-Q150 (fra)-X-nonno.wav") === null, "voci: otro idioma");
  var list = Voci.fromApi("nonno", { query: { pages: {
    1: { title: "File:LL-Q652 (ita)-Anna-nonno.wav", imageinfo: [{ url: "u1" }] },
    2: { title: "File:LL-Q652 (ita)-Anna-nonno.wav", imageinfo: [{ url: "u2" }] },
    3: { title: "File:LL-Q652 (ita)-Beppe-nonna.wav", imageinfo: [{ url: "u3" }] },
    4: { title: "File:LL-Q652 (ita)-Carla-nonno.wav", imageinfo: [{ url: "u4" }] } } } });
  ok(list.length === 2 && list[0].url === "u1" && list[1].user === "Carla", "voci: palabra exacta, un archivo por hablante");
  ok(!Voci.usable("pèsca") && Voci.usable("pesca"), "voci: sin tildes (pèsca / pésca no se distinguen por el nombre)");
})();

// La versión que muestra la app (Oggi, Io) es la del service worker.
(function () {
  var sw = fs.readFileSync(path.join(ROOT, "docs/sw.js"), "utf8").match(/VERSION = "c1-(v[\d.]+)"/);
  var app = fs.readFileSync(path.join(ROOT, "docs/js/app.js"), "utf8").match(/APP_VERSION = "(v[\d.]+)"/);
  ok(sw && app && sw[1] === app[1], "versión de la app (" + (app && app[1]) + ") = versión del service worker (" + (sw && sw[1]) + ")");
})();

// La interfaz (app.js, sw.js) y el paquete: el guardado de siempre, los textos del paquete.
(function () {
  var L = ctx.LANG;
  // Who already studied Italian keeps everything: same prefix, same keys.
  ok(L.storage === "laviac1" && Engine.STORAGE_KEY === "laviac1.save.v1", "el guardado sigue en laviac1.save.v1: " + Engine.STORAGE_KEY);
  ok(L.code === "it" && L.tts === "it-IT" && L.base === "lang/it/", "LANG: código, voz y carpeta del paquete");
  var core = fs.readFileSync(path.join(ROOT, "docs/js/app.js"), "utf8");
  var sw = fs.readFileSync(path.join(ROOT, "docs/sw.js"), "utf8");
  [["docs/js/app.js", core], ["docs/sw.js", sw]].forEach(function (x) {
    var keys = x[1].match(/["'](laviac1|rumoc1)[.\-][^"']*["']/g) || [];
    ok(!keys.length, x[0] + ": claves de guardado escritas en el código (salen de LANG.storage): " + keys.join(", "));
  });
  ok(!/["']data\/[\w.]+\.json["']|["']it-IT["']|["']pt-BR["']/.test(core), "app.js no pide docs/data/ ni nombra una voz: todo sale del paquete");
  ok(/k\.indexOf\(PREFIX\) === 0/.test(sw) && /PREFIX = "c1-"/.test(sw), "el service worker solo borra sus propias cachés");
  // Every text app.js reads from the package exists (app.js does not run under node).
  var need = {};
  (core.match(/\bUI\.[a-zA-Z0-9]+/g) || []).forEach(function (k) { need["ui." + k.slice(3)] = L.ui[k.slice(3)]; });
  (core.match(/\bEX\.[a-zA-Z0-9]+/g) || []).forEach(function (k) { need["exam." + k.slice(3)] = L.exam[k.slice(3)]; });
  (core.match(/\bLG\.[a-zA-Z0-9]+/g) || []).forEach(function (k) { need[k.slice(3)] = k.slice(3) in L ? true : undefined; });
  var missing = Object.keys(need).filter(function (k) { return need[k] === undefined; });
  ok(!missing.length, "LANG (lang/it/lang.js) trae todo lo que usa app.js; faltan: " + missing.join(", "));
  ok(L.ui.tabs.length === 3 && L.ui.tabs[0][2] === "Oggi" && L.ui.tabs[2][2] === "Io" && L.ui.allTabs.length === 2, "las pestañas (3.4): Oggi, Percorso, Io; Allena y Leggi desde Io");
  ok(L.spanish.sure.test("¿Qué tal?") && !L.spanish.sure.test("Che cosa fai?"), "español o italiano: la ñ, ¿, ¡ y las tildes agudas");
  ok(L.glue("l'") === "next" && L.glue("un po'") === null, "hueco elidido: l'amica se pega, un po' no");
})();

T.done();
