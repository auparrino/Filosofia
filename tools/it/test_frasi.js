/* Controlli sul banco di frasi e sulle meccaniche d'aggancio
   (obiettivo del giorno, scudi della serie, forziere, pausa, lampo).
   Run: node tools/it/test_frasi.js  */
var pack = require("../lib/pack.js");
var ctx = pack("it");
var Frasi = ctx.Frasi;
var Engine = ctx.Engine;
var Drills = ctx.Drills;
var Lab = ctx.Lab;
var Letture = ctx.Letture;
var course = pack.data("it", "course.json");

var T = require("../lib/testkit.js")("it"), ok = T.ok;
function uniq(a) {
  var m = {};
  a.forEach(function (x) { m[x] = true; });
  return Object.keys(m).length === a.length;
}

/* ---------------------------------------------------------- il banco */

ok(Frasi.SCENES.length >= 12, "almeno 12 scene");
ok(Frasi.ALL.length >= 200, "almeno 200 frasi: " + Frasi.ALL.length);
ok(uniq(Frasi.ALL.map(function (f) { return f.id; })), "id di frase unici");
ok(uniq(Frasi.ALL.map(function (f) { return f.it; })), "nessuna frase italiana ripetuta");
ok(uniq(Frasi.SCENES.map(function (s) { return s.id; })), "id di scena unici");
Frasi.ALL.forEach(function (f) {
  ok(f.it && f.es, "frase incompleta: " + f.id);
  ok(Frasi.words(f.it).length >= 1, "frase senza parole: " + f.id);
  ok(!/\s{2}/.test(f.it), "spazi doppi: " + f.id);
});
Frasi.SCENES.forEach(function (s) {
  ok(Frasi.ofScene(s.id).length >= 12, "scena corta: " + s.id);
});

/* ------------------------------------------------------ gli esercizi */

Frasi.ALL.forEach(function (f) {
  for (var r = 0; r < 3; r++) {
    var t = Frasi.tilesItem(f);
    // Le tessere giuste, nell'ordine giusto, danno la frase.
    var own = Frasi.tileWords(f.it);
    var pool = t.tiles.slice();
    var allThere = own.every(function (w) {
      var k = pool.indexOf(w);
      if (k < 0) return false;
      pool.splice(k, 1);
      return true;
    });
    ok(allThere, "tessere mancanti: " + f.id);
    ok(Frasi.words(own.join(" ")).join(" ") === Frasi.words(f.it).join(" "),
       "le tessere ricompongono la frase: " + f.id);
    ok(t.tiles.length <= own.length + 3, "troppe tessere: " + f.id);
    // Tiles must not give the order away.
    t.tiles.forEach(function (w) {
      ok(!/[.,!?;:…]$/.test(w), "tessera con punteggiatura: " + f.id + " «" + w + "»");
      ok(!/^[A-ZÀ-Ý]/.test(w) || Frasi.PROPER[w], "tessera con maiuscola iniziale: " + f.id + " «" + w + "»");
    });

    var l = Frasi.listenItem(f);
    ok(l.options.indexOf(f.es) >= 0, "ascolto senza risposta: " + f.id);
    ok(uniq(l.options), "ascolto con opzioni doppie: " + f.id);
    ok(l.options.length === 4, "ascolto con " + l.options.length + " opzioni: " + f.id);
  }

  // Scrivere: la frase esatta, o scritta dal telefono senza accenti né
  // punteggiatura, è giusta.
  ok(Frasi.gradeWritten(f.it, f.it).verdict === "giusto", "frase esatta: " + f.id);
  var phone = f.it.normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[?!.,«»…]/g, "").toLowerCase();
  ok(Frasi.gradeWritten(phone, f.it).verdict === "giusto",
     "senza accenti né punti: " + f.id + " (" + phone + ")");
});

ok(Frasi.gradeWritten("Sono appena arivato", "Sono appena arrivato.").verdict === "sbagliato" ||
   Frasi.gradeWritten("Sono appena arivato", "Sono appena arrivato.").verdict === "quasi",
   "un refuso non è giusto");
ok(Frasi.gradeWritten("Vorrei un cappuccino e cornetto",
                      "Vorrei un cappuccino e un cornetto.").verdict === "quasi",
   "una parola mancante in una frase lunga = quasi");
ok(Frasi.gradeWritten("un cornetto e un cappuccino vorrei",
                      "Vorrei un cappuccino e un cornetto.").verdict !== "giusto",
   "l'ordine delle parole conta");
ok(Frasi.gradeWritten("", "Ciao!").verdict === "sbagliato", "risposta vuota");
ok(Frasi.gradeWritten("dove il bagno", "Dov'è il bagno?").verdict === "giusto",
   "l'elisione si scrive anche per esteso");

/* ------------------------------------------------ sessioni di scena */

var cards = {};
Frasi.SCENES.forEach(function (s) {
  var sess = Frasi.sceneSession(s.id, cards, {});
  // A new phrase is met once (presented or guessed) and retrieved once.
  // (a guessed one is also shown on its card: «Adiviná», then «Frase nueva»)
  var intros = sess.filter(function (it) { return it.type === "intro"; });
  ok(intros.length === 6, "6 frasi nuove per sessione: " + s.id);
  var times = {}; sess.forEach(function (it) { times[it.id] = (times[it.id] || 0) + 1; });
  ok(Object.keys(times).every(function (k) { return times[k] <= 3; }), "ogni frase al massimo 3 volte per sessione: " + s.id);
  ok(sess.length >= 8, "sessione troppo corta: " + s.id);
  sess.forEach(function (it) {
    ok(it.answer && it.frase && Frasi.BY_ID[it.id], "item di scena malformato: " + s.id);
    if (it.type !== "intro") cards[it.id] = Engine.schedule(cards[it.id], 2);
  });
  var silent = Frasi.sceneSession(s.id, cards, { silent: true });
  ok(silent.every(function (it) { return it.type !== "listen"; }),
     "in modalità ufficio niente ascolto automatico: " + s.id);
});
var p = Frasi.progress("ciao", cards);
ok(p.seen === 6 && p.total === Frasi.ofScene("ciao").length, "progresso di scena");

/* ------------------------------------------------ ripasso con frasi */

var st = Engine.blankSave();
Frasi.ofScene("bar").forEach(function (f) {
  st.cards[f.id] = Engine.schedule(null, 2);
  st.cards[f.id].due = Date.now() - 1000;
});
ok(Drills.dueCount(course, st) === Frasi.ofScene("bar").length,
   "le frasi scadute contano nel ripasso");
var rev = Drills.buildReview(course, st, 50);
ok(rev.length === Frasi.ofScene("bar").length, "il ripasso rigenera le frasi");
rev.forEach(function (it) { ok(it.frase && it.type !== "intro", "ripasso di frase valido"); });

/* ---------------------------------------------------- pausa e lampo */

course.weeks.forEach(function (w) {
  var s = Engine.blankSave();
  var items = Drills.buildPausa(course, s, w, {});
  ok(items.length >= 5 && items.length <= 10, "pausa di lunghezza giusta, settimana " + w.week);
  items.forEach(function (it) {
    if (it.src !== "frasi" && it.src !== "lab") {
      ok(it.type !== "cloze" && it.type !== "translate",
         "in pausa niente domande da scrivere del libro, settimana " + w.week);
    }
    if (it.type === "choice") ok(it.options.indexOf(it.answer) >= 0, "pausa: scelta senza risposta");
  });
});

var ls = Engine.blankSave();
for (var i = 0; i < 300; i++) {
  var li = Drills.lampoItem(ls);
  ok(li.options.indexOf(li.answer) >= 0 && uniq(li.options) && li.options.length === 4,
     "lampo con opzioni valide");
}


/* ------------------------------------------------------- laboratorio */

ok(uniq(Object.keys(Lab.BY_ID)), "id del laboratorio unici");
Lab.RULES.forEach(function (r) {
  ok(r.words.length >= 10, "regola ponte con poche parole: " + r.id);
  ok(uniq(r.words.map(function (w) { return w[0]; })), "parole ripetute nella regola " + r.id);
});
Object.keys(Lab.BY_ID).forEach(function (id) {
  for (var k = 0; k < 3; k++) {
    var it = Lab.item(id);
    ok(Engine.grade(it.answer, it) === "giusto", "la risposta del laboratorio è accettata: " + id);
    if (it.type === "choice") {
      ok(it.options.indexOf(it.answer) >= 0, "opzione giusta presente: " + id);
      ok(uniq(it.options), "opzioni doppie: " + id);
      if (it.lab === "falsi") ok(it.options.indexOf(it.trap) >= 0, "il falso amico mostra la trappola: " + id);
    }
  }
});
Lab.CAPIRE.forEach(function (c) {
  c.items.forEach(function (x) {
    ok(c.opts.indexOf(x[1]) >= 0, "capire: risposta fuori dalle opzioni: " + x[0]);
  });
  // Every option of a set is the right answer at least once: the form decides.
  c.opts.forEach(function (o) {
    ok(c.items.some(function (x) { return x[1] === o; }), "capire " + c.id + ": opzione mai giusta: " + o);
  });
});
var ps = Lab.ponteSession({});
ok(ps[0].type === "card" && ps.length >= 9, "ponte: prima la regola, poi le parole");
ok(Lab.capireSession({})[0].type === "card", "capire: prima la spiegazione");
ok(Lab.falsiSession({}).length === 10, "falsi amici: 10 domande");
for (var r2 = 0; r2 < 50; r2++) ok(!!Lab.randomItem({}), "item casuale del laboratorio");

var lst = Engine.blankSave();
Object.keys(Lab.BY_ID).slice(0, 20).forEach(function (id) {
  lst.cards[id] = Engine.schedule(null, 2);
  lst.cards[id].due = Date.now() - 1;
});
ok(Drills.buildReview(course, lst, 50).length === 20, "il ripasso include il laboratorio");

/* ----------------------------------------------------------- letture */

ok(Letture.ofSeries("martin").length === 13, "13 puntate di Martín");
ok(Letture.ofSeries("cultura").length >= 10, "almeno 10 letture di cultura");
ok(uniq(Letture.EPISODI.map(function (e) { return e.id; })), "id di lettura unici");
Letture.EPISODI.forEach(function (ep) {
  var toks = Letture.allTokens(ep);
  // Le inondazioni (input flood) sono più lunghe: la struttura deve ripetersi.
  // Le letture lunghe del tramo C1 crescono da 350 a 900 parole (test_tramo.js).
  var lo = ep.series === "flood" ? 150 : ep.series === "lunga" ? 300 : 80, hi = ep.series === "flood" ? 240 : ep.series === "lunga" ? 1100 : 140;
  ok(toks.length >= lo && toks.length <= hi, "lunghezza della lettura " + ep.id + ": " + toks.length);
  Object.keys(ep.gloss).forEach(function (k) {
    ok(toks.some(function (t) { return Letture.glossFor(ep, t) === ep.gloss[k]; }),
       "glossa senza parola nel testo: " + ep.id + "/" + k);
  });
  ep.hunt.targets.forEach(function (t) {
    ok(toks.some(function (x) { return Letture.bare(x) === t || Letture.core(x) === t; }),
       "caccia: forma assente dal testo: " + ep.id + "/" + t);
  });
  ep.questions.forEach(function (q) {
    ok(q[1].indexOf(q[2]) >= 0 && uniq(q[1]), "domanda malformata: " + ep.id + " " + q[0]);
  });
  var want = Letture.huntTargets(ep);
  ok(Letture.gradeHunt(ep, want).verdict === "giusto", "caccia perfetta = giusto: " + ep.id);
  ok(Letture.gradeHunt(ep, []).verdict === "sbagliato", "caccia vuota = sbagliato: " + ep.id);
  var all = toks.map(function (_, i) { return i; });
  ok(Letture.gradeHunt(ep, all).verdict === "sbagliato", "toccare tutto non paga: " + ep.id);
  var sess = Letture.session(ep);
  (ep.vf || []).forEach(function (x) {
    ok(["vero", "falso", "non si dice"].indexOf(x[1]) >= 0 && x[0].length > 8, "vero/falso malformato: " + ep.id + " " + x[0]);
  });
  if (ep.series === "settimana") ok((ep.vf || []).length === 3, "la settimana: tres afirmaciones vero/falso: " + ep.id);
  ok(sess.length === ep.questions.length + (ep.vf || []).length + 1 && sess[sess.length - 1].type === "hunt",
     "sessione di lettura: domande e poi caccia: " + ep.id);
});
ok(Letture.isOpen(Letture.byId("ep1"), {}) && !Letture.isOpen(Letture.byId("ep2"), {}),
   "Martín si sblocca in ordine");
ok(Letture.isOpen(Letture.byId("ep2"), { ep1: { pct: 50 } }), "letto ep1, si apre ep2");
ok(Letture.isOpen(Letture.byId("c-gramsci"), {}), "la cultura è tutta aperta");
ok(Letture.next({}).id === "ep1" && Letture.next({ ep1: {} }).id === "ep2", "prossima puntata");

/* ------------------------------------------- nuovi esercizi di frase */

Frasi.ALL.forEach(function (f) {
  var c = Frasi.clozeItem(f);
  if (c.type === "cloze") {
    ok(c.stem.indexOf("___") >= 0, "cloze senza buco: " + f.id);
    ok(c.stem.replace("___", c.answer) === Frasi.tiles(f.it).join(" "),
       "il buco ricompone la frase: " + f.id);
    ok(Engine.grade(c.answer, c) === "giusto", "cloze: la parola è accettata: " + f.id);
  }
  var g = Frasi.guessItem(f);
  // null: no possible mistake, the phrase is presented; else 2 or 3 options
  ok(!g || (g.options.indexOf(f.it) >= 0 && uniq(g.options) && g.options.length >= 2 && g.options.length <= 3),
     "indovina: opzioni valide: " + f.id);
  ok(Frasi.gradeWritten(f.it, Frasi.dictationItem(f).answer).verdict === "giusto",
     "dettato accetta la frase: " + f.id);
});
var fresh = Frasi.sceneSession("idee", {}, {});
ok(fresh[0].type === "guess" && fresh[1].type === "intro", "pretest prima della frase nuova");

/* ----------------------------------- serie, scudi, obiettivo, forziere */

function day(y, m, d, h) { return new Date(y, m - 1, d, h || 12); }

var s = Engine.blankSave();
Engine.touchStreak(s, day(2026, 3, 1));
Engine.touchStreak(s, day(2026, 3, 2));
Engine.touchStreak(s, day(2026, 3, 2, 20));
ok(s.streak === 2, "due giorni di fila: " + s.streak);
ok(s.shields === 1, "si parte con uno scudo");
Engine.touchStreak(s, day(2026, 3, 4));       // saltato il 3
ok(s.streak === 3 && s.shields === 1 && s.jokerWeek, "il jolly della settimana salva la serie (non lo scudo): " + s.streak + "/" + s.shields);
Engine.touchStreak(s, day(2026, 3, 7));       // saltati 5 e 6, niente scudi
ok(s.streak === 1, "senza scudi la serie riparte");
for (var d = 8; d <= 13; d++) Engine.touchStreak(s, day(2026, 3, d));
ok(s.streak === 7 && s.shields === 2, "7 giorni regalano uno scudo: " + s.shields);
Engine.touchStreak(s, day(2026, 3, 31));
Engine.touchStreak(s, day(2026, 4, 1));
ok(s.streak === 2, "la serie attraversa il cambio di mese");

var g = Engine.blankSave();
g.goal = 50;
var now = day(2026, 5, 10);
ok(Engine.addXp(g, 30, now) === false, "sotto l'obiettivo");
ok(Engine.openChest(g, null, now) === null, "forziere chiuso prima dell'obiettivo");
ok(Engine.addXp(g, 25, now) === true, "obiettivo raggiunto una volta");
ok(Engine.addXp(g, 25, now) === false, "e non si ripete nello stesso giorno");
ok(Engine.todayXp(g, now) === 80 && g.xp === 80, "xp del giorno e totale");
var before = g.xp;
var prize = Engine.openChest(g, function () { return 0.9; }, now);
ok(prize && prize.xp > 0 && g.xp === before + prize.xp, "il forziere paga");
ok(Engine.openChest(g, null, now) === null, "un forziere al giorno");
ok(Engine.lastDays(g, 28, now).length === 28, "calendario di 28 giorni");
ok(Engine.lastDays(g, 28, now)[27].xp === 80, "oggi è l'ultimo giorno del calendario");

ok(Engine.rankFor(1) === "Turista" && Engine.rankFor(60) === "Madrelingua", "gradi");

// A save from the old version loads with the new fields filled in.
var old = { xp: 10, cards: {}, badges: [], totals: { attempts: 1, right: 1, close: 0, wrong: 0 } };
ctx.localStorage = { getItem: function () { return JSON.stringify(old); } };
var loaded = Engine.load();
ok(loaded.goal === 200 && loaded.goalV === 2 && loaded.days && loaded.shields === 1,
   "salvataggio vecchio aggiornato (obiettivo 50 → 200)");
old = { xp: 10, cards: {}, badges: [], goal: 20, totals: { attempts: 0, right: 0, close: 0, wrong: 0 } };
ok(Engine.load().goal === 100, "obiettivo rilassato: 20 → 100");
old = { xp: 10, cards: {}, badges: [], goal: 350, goalV: 2, totals: { attempts: 0, right: 0, close: 0, wrong: 0 } };
ok(Engine.load().goal === 350, "un obiettivo già nuovo non si tocca");
ctx.localStorage = null;

// Damaged saves are repaired, not trusted.
var weird = Engine.sanitize({ xp: "abc", cards: null, days: "x", badges: {}, totals: 5, weekStats: [],
  unlocked: 999, streak: -3, errs: { a: null, b: { n: "x" }, ausiliare: { n: 3 } }, errLog: {}, letture: 7,
  best: null, goal: "mucho", shields: 99 });
ok(weird.xp === 0 && weird.unlocked === 52 && weird.streak === 0 && weird.shields === 3,
   "numeri riportati nei limiti");
ok(weird.goal === 200 && Array.isArray(weird.badges) && Array.isArray(weird.errLog), "tipi ripristinati");
ok(Object.keys(weird.errs).join() === "ausiliare", "voci d'errore rotte eliminate");
ok(typeof weird.totals === "object" && weird.totals.right === 0, "totali ricostruiti");
ok(Engine.sanitize(null).xp === 0 && Engine.sanitize([1, 2]).xp === 0, "salvataggio non oggetto");
var goodSave = Engine.blankSave();
goodSave.xp = 1234; goodSave.cards["frase:bar:1"] = Engine.schedule(null, 2);
var kept = Engine.sanitize(JSON.parse(JSON.stringify(goodSave)));
ok(kept.xp === 1234 && kept.cards["frase:bar:1"].interval === goodSave.cards["frase:bar:1"].interval && kept.cards["frase:bar:1"].s === goodSave.cards["frase:bar:1"].s, "un salvataggio sano non si tocca");

var fdg = Frasi.ofTheDay(day(2026, 6, 1));
ok(fdg === Frasi.ofTheDay(day(2026, 6, 1, 23)), "la frase del giorno non cambia nel giorno");

// Clock moved back a day: the streak survives.
var sb = Engine.blankSave(); sb.streak = 10; sb.lastPlayed = Engine.dayKey(day(2026, 9, 23));
Engine.touchStreak(sb, day(2026, 9, 22));
ok(sb.streak === 10, "l'orologio indietro non azzera la serie");
Engine.touchStreak(sb, day(2026, 9, 24));
ok(sb.streak === 11, "e il giorno dopo la serie continua");
// Calendar strip: every day once, also across a DST change.
[day(2026, 3, 30, 0), day(2026, 10, 26, 23), day(2026, 3, 29, 12)].forEach(function (d) {
  var ks = Engine.lastDays({}, 7, d).map(function (x) { return x.key; });
  var uniq = ks.filter(function (k, i) { return ks.indexOf(k) === i; });
  ok(uniq.length === 7 && ks[6] === Engine.dayKey(d), "7 giorni distinti fino a oggi: " + ks.join(" "));
});

T.done();
