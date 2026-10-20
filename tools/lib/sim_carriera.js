/*
 * Una carrera entera: un estudiante aplicado (acierta el 90 % en opciones,
 * el 80 % escribiendo) juega las 52 semanas siguiendo las misiones del
 * percorso, con un reloj simulado de un día por sesión.  Mide por semana
 * cuánto hay que jugar, cuánto tarda, qué se repite, qué queda sin usar,
 * cuánto ripasso se acumula, y verifica la integridad de cada ítem y de
 * los chequeos de cada lección.
 *
 *   node tools/lib/sim_carriera.js it              resumen por pantalla
 *   node tools/lib/sim_carriera.js pt --json       todo, en JSON
 *   node tools/lib/sim_carriera.js it --seed 7     otra semilla (por defecto 12345)
 *
 * Todo el azar (el del jugador y el de los módulos, que usan Math.random)
 * sale de la misma semilla: la misma corrida da siempre lo mismo.
 *
 * Termina con código 1 (y así falla `npm run sim` y el CI) si una semana
 * queda sin dominar, si un jefe no se pasa, si hay errores (el gimnasio, la
 * pausa, el repaso), ítems duplicados o chequeos de lección rotos.  Los
 * avisos de ítems (respuestas largas…) se informan pero no fallan.
 */
"use strict";
var fs = require("fs"), path = require("path"), vm = require("vm");

var pack = require("./pack.js");
var args = process.argv.slice(2);
var CODE = args.filter(function (a, i) { return a[0] !== "-" && args[i - 1] !== "--seed"; })[0];
if (!CODE || pack.ALL.indexOf(CODE) < 0) {
  console.error("uso: node tools/lib/sim_carriera.js <" + pack.ALL.join("|") + "> [--json] [--seed N]");
  process.exit(2);
}
var SEED = args.indexOf("--seed") >= 0 ? +args[args.indexOf("--seed") + 1] : 12345;
var clock = { t: Date.UTC(2026, 0, 5, 12) };          // lunes
var RealDate = Date;
function FakeDate() {
  if (arguments.length) return new (Function.prototype.bind.apply(RealDate, [null].concat([].slice.call(arguments))))();
  return new RealDate(clock.t);
}
FakeDate.now = function () { return clock.t; };
FakeDate.UTC = RealDate.UTC; FakeDate.parse = RealDate.parse;
FakeDate.prototype = RealDate.prototype;

// Math.random with a seed, for the modules (shuffles, picks): the same run
// every time, so that a failure in the CI can be reproduced.  mulberry32,
// one stream for the modules and another for the player.
function mulberry(a) {
  a = a >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    var t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
var SeededMath = Object.create(Math);
SeededMath.random = mulberry(Math.imul(SEED, 2654435761) ^ 0x5bd1e995);

// The whole language (package + core, in the order of boot.js), with the
// simulated clock.
var ctx = pack(CODE, { extra: { Date: FakeDate, Math: SeededMath } });
var Engine = ctx.Engine, Drills = ctx.Drills, Frasi = ctx.Frasi, Lab = ctx.Lab, Letture = ctx.Letture,
    Lezione = ctx.Lezione, Banca = ctx.Banca, Conj = ctx.Conjugator || ctx.Conj;
var course = pack.data(CODE, "course.json");
// a language that is starting (Boot.LANGS.de) may have only its course
var optData = function (name) { return fs.existsSync(pack.dataPath(CODE, name)) ? pack.data(CODE, name) : null; };
var bank = optData("bank.json");
if (bank) Banca.load(bank);
var map = Drills.itemsById(course);
var Scrivi = ctx.Scrivi;
var glossario = optData("glossario.json") || {};
if (Scrivi) Scrivi.learnCourse({ items: course.items, bank: Banca.bank(), phrases: Frasi.ALL, readings: Letture.EPISODI, glossario: glossario });
var isTarget = function (w) { return !!glossario[String(w).toLowerCase()]; };

/* ------------------------------------------------------------ el jugador */

var rnd = mulberry(SEED);
var P = { choice: 0.9, typed: 0.8, retry: 0.95, lesson: 0.85, boss: 0.9 };
var SEC = { choice: 8, typed: 20, intro: 6, word: 6, card: 10, guess: 6, hunt: 40, flash: 8, tiles: 14, listen: 12, dictation: 25 };
var TYPED = { cloze: 1, translate: 1, conjugate: 1, typed: 1, write: 1, dictation: 1, plural: 1, numbers: 1, qa: 1, fixerr: 1 };
var SKIP = { intro: 1, word: 1, card: 1 };
var COUNT_KINDS = { round: 1, gym: 1, pausa: 1, boss: 1, vocab: 1 };
var DOMINA_TRIES = 8;

var state = Engine.blankSave();
var day = 0;
var log = { weeks: [], issues: [], itemIssues: [], lessonIssues: [], errors: [], gymSkipped: [] };
var served = {};                                 // id -> veces servido (ítems del curso)
var totalSec = 0;

function newDay() {
  day++;
  clock.t += 86400000;
  Engine.touchStreak(state, new FakeDate());
}

function secondsFor(it) {
  if (SKIP[it.type] || it.type === "guess") return SEC[it.type] || 6;
  if (it.type === "hunt") return SEC.hunt;
  if (TYPED[it.type]) return SEC.typed;
  return SEC[it.type] || SEC.choice;
}

/* Juega una lista de ítems como el juego: SRS, xp, estadísticas de la
   semana, y una repetición por error (más fácil). */
function play(items, kind, week, acc) {
  acc = acc || { asked: 0, right: 0, sec: 0, xp: 0, repeats: 0 };
  var combo = 0, again = {};
  for (var i = 0; i < items.length; i++) {
    var it = items[i];
    if (!it) { log.errors.push("ítem nulo en " + kind + " semana " + week); continue; }
    acc.sec += secondsFor(it);
    if (SKIP[it.type]) continue;
    if (it.type === "guess") { Engine.addXp(state, 3, new FakeDate()); acc.xp += 3; continue; }
    if (map[it.id]) served[it.id] = (served[it.id] || 0) + 1;
    var p = kind === "boss" ? P.boss : it.retry ? P.retry : TYPED[it.type] ? P.typed : P.choice;
    if (it.type === "hunt") p = 0.95;
    var right = rnd() < p;
    var q = right ? 2 : 0;
    // A third of the misses on what you write are slips (a typo, an accent).
    var ekind = right ? null : (TYPED[it.type] && rnd() < 0.33) ? "slip" : "rule";
    if (ekind === "slip") q = 1;
    acc.asked++;
    // the bonus grows with the written answers only («racha de escritos»)
    var wrote = Engine.written ? Engine.written(it) : true;
    if (right) { acc.right++; if (wrote) combo++; } else combo = 0;
    if (!it.retry) { acc.firstAsked = (acc.firstAsked || 0) + 1; if (right || q === 1) acc.firstRight = (acc.firstRight || 0) + 1; }
    var gained = Engine.xpFor(right ? "giusto" : q === 1 ? "quasi" : "sbagliato", combo, it,
                              { old: ctx.Reglas ? ctx.Reglas.isOld(it, state) : false });
    if (it.retry) gained = Math.ceil(gained / 2);
    acc.xp += gained;
    Engine.addXp(state, gained, new FakeDate());
    // what the app does with the answer (docs/js/reglas.js): the card of
    // the item and the one of its rule
    ctx.Reglas.afterAnswer(state, it, q, { kind: kind, now: clock.t, ekind: ekind });
    state.totals.attempts++;
    if (right) state.totals.right++; else state.totals.wrong++;
    if (!it.frase && it.src !== "lab" && it.src !== "lettura" && it.src !== "banca" &&
        it.src !== "coniugatore" && it.src !== "vocab" && COUNT_KINDS[kind]) {
      var ws = state.weekStats[week] || (state.weekStats[week] = { attempts: 0, right: 0, bossPassed: false });
      ws.attempts++; if (right) ws.right++;
      ws.last = (ws.last || []).concat([right ? 1 : 0]).slice(-30);
    }
    if (!right && kind !== "boss" && it.src !== "lettura" && !it.retry && !again[it.id]) {
      again[it.id] = 1;
      var copy = Object.assign({}, it, { retry: true });
      items.splice(Math.min(items.length, i + 3), 0, copy);
      acc.repeats++;
    }
  }
  totalSec += acc.sec;
  return acc;
}

function readingWeek(ep) {
  if (ep.series !== "martin") return ep.week;
  var wk = 1;
  Letture.ofSeries("martin").forEach(function (e) { if (e.n <= ep.n) wk = Math.max(wk, e.week); });
  return wk;
}
var PONTE_WEEK = { zione: 2, ta: 3, bile: 4, tt: 5, dittonghi: 6, effe: 7, pi: 8, aggio: 9, colte: 10 };
var FALSI_WEEK = 11;

/* ------------------------------------------------- integridad de los ítems */

function norm(s) { return Engine.normalise(String(s == null ? "" : s)); }
course.items.forEach(function (it) {
  var iss = function (m) { log.itemIssues.push({ id: it.id, wk: it.wk, type: it.type, msg: m }); };
  if (!it.type) iss("sin tipo");
  if (!it.answer && it.type !== "hunt") iss("sin respuesta");
  if (it.options) {
    var os = it.options.map(norm);
    if (os.indexOf(norm(it.answer)) < 0 && !(it.accept || []).some(function (a) { return os.indexOf(norm(a)) >= 0; })) iss("la respuesta no está entre las opciones");
    if (new Set(os).size !== os.length) iss("opciones repetidas");
    if (it.options.length < 2) iss("menos de dos opciones");
  }
  var gaps = (String(it.stem || "").match(/_{3,}/g) || []).length;
  var parts = String(it.answer || "").split("|").length;
  if (gaps > 1 && parts !== gaps && it.type !== "choice") iss("huecos (" + gaps + ") y respuestas (" + parts + ") no coinciden");
  if (String(it.answer || "").length > 90 && TYPED[it.type]) iss("respuesta de más de 90 caracteres: nunca tendrá versión de reconocimiento");
  // [entre corchetes] marca la parte que hay que reemplazar: no es un resto.
  var txt = (it.stem || "") + (it.prompt || "") + (it.answer || "");
  if (/corchetes/i.test(it.prompt || "")) txt = txt.replace(/[\[\]]/g, "");
  txt = txt.replace(/\[[^\[\]]{1,4}\]/g, "");   // notación fonética: [k], [ʎ], [dʒ]
  if (/[{}<>\[\]\\]|\bnull\b|undefined/.test(txt)) iss("restos de formato en el texto");
  if (!it.prompt && it.type !== "hunt") iss("sin consigna");
  if (it.type === "listen" && !it.stem) iss("escucha sin texto que leer en voz alta");
});
// Duplicados: misma consigna, mismo enunciado y misma respuesta con ids distintos
var sig = {};
course.items.forEach(function (it) {
  var k = norm(it.prompt) + "|" + norm(it.stem) + "|" + norm(it.answer);
  (sig[k] = sig[k] || []).push(it.id);
});
var dups = Object.keys(sig).filter(function (k) { return sig[k].length > 1; });
log.duplicates = dups.map(function (k) { return sig[k]; });

/* ------------------------------------------ integridad de los chequeos */

course.weeks.forEach(function (w) {
  if (!w.lesson) { log.lessonIssues.push({ wk: w.week, msg: "semana sin lección" }); return; }
  var binary = 0, quizzes = 0, blocks = w.lesson.blocks.length, noCheck = 0;
  for (var s = 0; s < 5; s++) {
    var steps;
    try { steps = Lezione.steps(w.lesson, rnd, w.week, isTarget); }
    catch (e) { log.lessonIssues.push({ wk: w.week, msg: "Lezione.steps lanza: " + e.message }); break; }
    var qs = steps.filter(function (x) { return x.kind === "quiz"; });
    qs.forEach(function (x) {
      var q = x.q;
      quizzes++;
      if (q.options.length === 2) binary++;
      if (q.options.indexOf(q.answer) < 0) log.lessonIssues.push({ wk: w.week, msg: "chequeo sin la respuesta entre las opciones: " + q.prompt });
      if (new Set(q.options).size !== q.options.length) log.lessonIssues.push({ wk: w.week, msg: "chequeo con opciones repetidas: " + q.prompt + " → " + q.options.join(" / ") });
    });
    if (s === 0) noCheck = blocks - qs.length;
  }
  log.weeks[w.week] = { week: w.week, title: w.title, cefr: w.level, boss: !!w.boss, blocks: blocks,
                        checksPerRun: quizzes / 5, binaryShare: quizzes ? binary / quizzes : 0, blocksWithoutCheck: noCheck };
});

/* -------------------------------------------------------- la carrera */

var by = { scene: {}, ep: {}, ponte: {}, capire: {} };
Frasi.SCENES.forEach(function (s) { (by.scene[Drills.sceneWeek(s.id)] = by.scene[Drills.sceneWeek(s.id)] || []).push(s); });
Letture.EPISODI.forEach(function (e) { (by.ep[readingWeek(e)] = by.ep[readingWeek(e)] || []).push(e); });
Lab.RULES.forEach(function (r) { (by.ponte[PONTE_WEEK[r.id] || 52] = by.ponte[PONTE_WEEK[r.id] || 52] || []).push(r); });
Lab.CAPIRE.forEach(function (c) { (by.capire[c.week] = by.capire[c.week] || []).push(c); });

var dueSeries = [];
function dailyExtras(taught) {
  // cada día: pausa y ripasso, como en el uso real
  var acc = { asked: 0, right: 0, sec: 0, xp: 0, repeats: 0 };
  try { play(Drills.buildPausa(course, state, taught, { map: map }), "pausa", taught ? taught.week : 1, acc); }
  catch (e) { log.errors.push("pausa semana " + (taught && taught.week) + ": " + e.message); }
  var due = Drills.dueCount(course, state, map);
  dueSeries.push({ day: day, due: due });
  try { play(Drills.buildReview(course, state, 20, { map: map }), "review", taught ? taught.week : 1, acc); }
  catch (e) { log.errors.push("ripasso día " + day + ": " + e.message); }
  return { acc: acc, due: due };
}

course.weeks.forEach(function (w) {
  var W = log.weeks[w.week];
  var t0 = totalSec, xp0 = state.xp, day0 = day;
  var missions = [], dueMax = 0, extraSec = 0, extraAsked = 0;
  var taught = w;
  function extras() { var r = dailyExtras(taught); dueMax = Math.max(dueMax, r.due); extraSec += r.acc.sec; extraAsked += r.acc.asked; }

  // 1. lección
  newDay();
  if (w.lesson) {
    var steps = Lezione.steps(w.lesson, rnd, w.week, isTarget), right = 0, asked = 0;
    steps.forEach(function (s) {
      totalSec += s.kind === "quiz" ? 8 : 14;
      if (s.kind === "quiz") { asked++; if (rnd() < P.lesson) right++; }
    });
    state.read = state.read || {}; state.read[w.week] = clock.t;
    Engine.addXp(state, Engine.XP.lesson + right * 2, new FakeDate());
    missions.push({ m: "lección", screens: steps.length, checks: asked });
  }
  extras();

  // 1b. Scrivi: el texto de la semana (la simulación entrega el modelo y
  // comprueba que cumpla la consigna; escribir, a unas 8 palabras por minuto)
  if (Scrivi && Scrivi.TASKS[w.week]) {
    var sr = Scrivi.check(Scrivi.TASKS[w.week].model, w.week);
    if (!sr.ok || sr.hard) log.itemIssues.push({ id: "scrivi:" + w.week, wk: w.week, type: "scrivi", msg: "el modelo no cumple la consigna o tiene errores marcados" });
    totalSec += Math.round(sr.words / 8 * 60) + 120;
    state.scritti = state.scritti || {}; state.scritti[w.week] = { n: sr.words, errs: sr.hard, at: clock.t };
    state.written = (state.written || 0) + 1;
    Engine.addXp(state, Engine.xpText ? Engine.xpText(sr.words, sr.reqs.filter(function (q) { return q.ok && q.id; }).length, !sr.hard)
                                      : 40 + Math.min(40, Math.floor(sr.words / 5)) + 20, new FakeDate());
    missions.push({ m: "scrivi", words: sr.words });
  }

  // 2. palabras de la semana
  if (w.vocab && w.vocab.length) {
    // until every word has been written once (the mission asks it), three sessions at most
    var acc = null, vs = 0;
    do { acc = play(Drills.withWordIntros(Drills.vocabSession(course, w, state, 14), state), "vocab", w.week, acc); vs++; }
    while (vs < 3 && w.vocab.some(function (v) { return !(state.cards["v:" + v[0]] || {}).prod; }));
    missions.push({ m: "palabras", n: w.vocab.length, asked: acc.asked, sec: acc.sec,
                    noExample: w.vocab.filter(function (v) { return !v[2]; }).length });
  }

  // 3. entrenamiento hasta dominar (o el jefe)
  var pool = (w.items || []).concat(w.extra || []);
  var poolServed = {};
  if (w.boss) {
    newDay();
    // Antes del jefe, la ronda de puntos débiles (opcional en la app; la
    // simulación la juega una vez).
    var wacc = play(Drills.buildWeak(course, w, state, { map: map, size: 15 }), "debil", w.week);
    missions.push({ m: "puntos débiles", asked: wacc.asked, weak: Drills.weakItems(course, w, state, map).length });
    var bacc = play(Drills.buildBoss(course, w, state, { map: map }), "boss", w.week);
    var pct = bacc.asked ? bacc.right / bacc.asked : 0;
    var ws0 = state.weekStats[w.week] || (state.weekStats[w.week] = { attempts: 0, right: 0, bossPassed: false });
    var tries = 1;
    while (pct < 0.85 && tries < 4) { tries++; bacc = play(Drills.buildBoss(course, w, state, { map: map }), "boss", w.week); pct = bacc.asked ? bacc.right / bacc.asked : 0; }
    ws0.bossPassed = pct >= 0.85;
    if (ws0.bossPassed) { Engine.addXp(state, Engine.XP.boss, new FakeDate()); state.unlocked = Math.min(52, w.week + 1); }
    // composición: de qué semanas vienen los ítems del jefe
    var comp = {};
    Drills.buildBoss(course, w, state).forEach(function (it) { var k = it.src === "coniugatore" ? "gym" : (map[it.id] ? "sem " + map[it.id].wk : it.src); comp[k] = (comp[k] || 0) + 1; });
    missions.push({ m: "jefe", tries: tries, pct: Math.round(pct * 100), items: bacc.asked, composition: comp });
    extras();
  } else {
    var rounds = 0, roundAsked = 0, roundSec = 0, ws;
    do {
      if (rounds % 3 === 0 && rounds) { newDay(); extras(); }
      rounds++;
      var items = Drills.buildRound(course, w, { map: map, state: state });
      items.forEach(function (it) { if (map[it.id]) poolServed[it.id] = (poolServed[it.id] || 0) + 1; });
      var racc = play(items, "round", w.week);
      roundAsked += racc.asked; roundSec += racc.sec;
      ws = state.weekStats[w.week] || { attempts: 0, right: 0 };
    } while (ws.right < 20 && rounds < 12);
    // Dominala: una sola sesión; si no llega al 85 %, otra ronda y otro
    // intento, como en la app (que no pone tope).  El jugador simulado no
    // aprende (acierta el 90 % / 80 % siempre) y queda justo en el umbral:
    // cada intento pasa con una probabilidad de 0,6-0,75 según cuántos
    // ejercicios escritos tenga la semana.  Con el tope viejo de 4 intentos,
    // alguna semana al azar (la 31, la 22, la 41…) quedaba sin dominar en una
    // de cada cuatro corridas; con 8, que una semana no se domine indica un
    // problema de la semana, no mala suerte.  Las que piden más de 4 intentos
    // se listan como aviso.
    var domTries = 0;
    while (!ws.dominated && domTries < DOMINA_TRIES) {
      domTries++;
      var dItems = Drills.buildDomina(course, w, state, { map: map });
      dItems.forEach(function (it) { if (map[it.id]) poolServed[it.id] = (poolServed[it.id] || 0) + 1; });
      var dacc = play(dItems, "round", w.week, null, true);
      roundAsked += dacc.asked; roundSec += dacc.sec;
      if (dacc.firstAsked && dacc.firstRight / dacc.firstAsked >= 0.85) ws.dominated = true;
      else { var r2 = play(Drills.buildRound(course, w, { map: map, state: state }), "round", w.week); roundAsked += r2.asked; roundSec += r2.sec; }
    }
    if (ws.right >= 20) state.unlocked = Math.min(52, w.week + 1);
    var distinct = Object.keys(poolServed).length;
    var maxRep = 0; Object.keys(poolServed).forEach(function (k) { maxRep = Math.max(maxRep, poolServed[k]); });
    missions.push({ m: "entrenamiento", rounds: rounds, asked: roundAsked, sec: roundSec, pool: pool.length,
                    distinctServed: distinct, maxRepeat: maxRep, mastered: Drills.dominated(ws, w, state), domTries: domTries });
    // gimnasio: una sesión, y todas las combinaciones verbo × tiempo
    // (una forma que el verbo no tiene, como el imperativo de poder, no se
    // pide: no es un error)
    var gymErr = 0, gymItems = [];
    (w.verbs || []).forEach(function (v) { (w.tenses || []).forEach(function (t) {
      if (Drills.lacksForm && Drills.lacksForm(v, t)) { log.gymSkipped.push(w.week + " " + v + "/" + t); return; }
      try {
        var gd = Drills.conjugationDrill(v, t, w.known, w.persons), gt = Drills.conjugationTyped(v, t, w.persons);
        gymItems.push(gd);
        [gd, gt].forEach(function (g) {
          var bad = !g.answer ? "sin respuesta" : g.options && g.options.indexOf(g.answer) < 0 ? "la respuesta no está entre las opciones"
                  : g.options && new Set(g.options).size !== g.options.length ? "opciones repetidas"
                  : g.options && g.options.length < 2 ? "menos de dos opciones" : /undefined|null/.test(g.stem + g.prompt) ? "restos en el texto" : "";
          if (bad) throw new Error(g.id + ": " + bad);
        });
      }
      catch (e) { gymErr++; log.errors.push("gimnasio semana " + w.week + " " + v + "/" + t + ": " + e.message); }
    }); });
    var gacc = play(Drills.firstRecognize(gymItems.slice(0, 15), state, w.week), "gym", w.week);
    missions.push({ m: "gimnasio", verbs: (w.verbs || []).length, tenses: (w.tenses || []).length, errors: gymErr, asked: gacc.asked, sec: gacc.sec });
  }

  // 4. frases de la semana
  newDay(); extras();
  (by.scene[w.week] || []).forEach(function (sc) {
    var sessions = 0, sacc = { asked: 0, right: 0, sec: 0, xp: 0, repeats: 0 }, pr;
    do { sessions++; play(Frasi.sceneSession(sc.id, state.cards, {}), "scene", w.week, sacc); pr = Frasi.progress(sc.id, state.cards); }
    while (pr.seen < pr.total && sessions < 10);
    missions.push({ m: "frases", scene: sc.name, sessions: sessions, phrases: pr.total, asked: sacc.asked, sec: sacc.sec });
  });

  // 5. lecturas
  (by.ep[w.week] || []).forEach(function (ep) {
    var eacc = play(Letture.session(ep), "lettura", w.week);
    state.letture = state.letture || {}; state.letture[ep.id] = { pct: Math.round(eacc.right / Math.max(1, eacc.asked) * 100), at: clock.t };
    Engine.addXp(state, 20, new FakeDate());
    var words = Letture.tokens(ep.text).length;
    missions.push({ m: ep.series === "martin" ? "lectura" : "cultura", title: ep.title, words: words, questions: eacc.asked, sec: eacc.sec + words * 0.6 });
    totalSec += words * 0.6;
  });

  // 5b. la serie Radio (radio.js, semanas 6-25): dos escuchas a ~130 palabras
  // por minuto y las preguntas; los minutos cuentan como input
  var rad = ctx.Radio && ctx.Radio.episode(w.week);
  if (rad && !w.boss) {
    var rw = ctx.Radio.words(rad), rsec = Math.round(rw / 130 * 60 * 2 + (rad.questions.length + rad.info.length) * 12);
    ctx.Radio.record(state, w.week, { pct: 80, ok: 4, n: 5 });
    Engine.addStrand(state, "input", Math.round(rsec / 10), new FakeDate());
    missions.push({ m: "radio", title: rad.title, words: rw, sec: rsec });
    totalSec += rsec;
  }

  // 6. laboratorio
  (by.ponte[w.week] || []).forEach(function (r) {
    var pacc = play(Lab.ponteSession(state.cards, r.id), "ponte", w.week);
    missions.push({ m: "ponte", rule: r.h, asked: pacc.asked, sec: pacc.sec });
  });
  if (w.week === FALSI_WEEK) { var facc = play(Lab.falsiSession(state.cards), "falsi", w.week); missions.push({ m: "falsi amici", asked: facc.asked, sec: facc.sec }); }
  (by.capire[w.week] || []).forEach(function (c) {
    var cacc = play(Lab.capireSession(state.cards, c.id, w.week), "capire", w.week);
    missions.push({ m: "capire", set: c.h, asked: cacc.asked, sec: cacc.sec });
  });

  // 7. banco (si el idioma lo tiene)
  if (Banca.loaded() && w.week === Banca.FORME_WEEK) { var fo = play(Banca.formsSession(state, 12), "b-forme", w.week); missions.push({ m: "banco forme", asked: fo.asked, sec: fo.sec }); }
  if (Banca.loaded() && w.week === Banca.TR_WEEK) { var tr = play(Banca.translateSession(state, 8), "b-tr", w.week); missions.push({ m: "banco traduci", asked: tr.asked, sec: tr.sec }); }
  if (Banca.loaded() && w.week === Banca.GAP_WEEK) { var ga = play(Banca.gapSession(state, 10), "b-gap", w.week); missions.push({ m: "banco coniuga", asked: ga.asked, sec: ga.sec }); }

  // 8. sfide del maestro
  var ch = (w.challenges || []).map(function (id) { return course.challenges.filter(function (c) { return c.id === id; })[0]; }).filter(Boolean);
  var playable = ch.filter(function (c) { return c.play && c.play.length; }), selfScored = ch.length - playable.length;
  var sfAsked = 0, sfSec = 0;
  if (playable.length) newDay();
  playable.forEach(function (c) {
    var items = c.play.map(function (id) { return map[id]; }).filter(Boolean);
    var sacc = play(Drills.firstRecognize(items, state, w.week), "sfida", w.week);
    sfAsked += sacc.asked; sfSec += sacc.sec;
    state.challengeLog[c.id] = { q: 2, pct: 90, at: clock.t };
    Engine.addXp(state, Engine.XP.challenge, new FakeDate());
  });
  if (ch.length) missions.push({ m: "sfide", groups: ch.length, playable: playable.length, selfScored: selfScored, asked: sfAsked, sec: sfSec });
  if (playable.length) extras();

  // The rest of the week, as in real life: a pausa and a ripasso every day.
  while (day - day0 < 7) { newDay(); extras(); }

  Engine.checkBadges(state);
  var lv = Engine.levelFor(state.xp);
  Object.assign(W, {
    days: day - day0, missions: missions, minutes: Math.round((totalSec - t0) / 60), xp: state.xp - xp0,
    level: lv.level, rank: Engine.rankFor(lv.level), unlockedAfter: state.unlocked, dueMax: dueMax,
    dailyExtrasMinutes: Math.round(extraSec / 60), dailyExtrasAsked: extraAsked,
    streak: state.streak, pool: pool.length
  });
});

/* ------------------------------------------------------------ cobertura */

var neverServed = course.items.filter(function (it) { return !served[it.id]; });
var inWeeks = {};
course.weeks.forEach(function (w) { (w.items || []).concat(w.extra || []).forEach(function (id) { inWeeks[id] = 1; }); });
var orphan = course.items.filter(function (it) { return !inWeeks[it.id]; });
var inSfide = {};
course.challenges.forEach(function (c) { (c.play || []).forEach(function (id) { inSfide[id] = 1; }); });

var notMastered = log.weeks.filter(function (W) {
  return W && W.missions.some(function (m) { return m.m === "entrenamiento" && !m.mastered; });
}).map(function (W) { return W.week; });
var hardWeeks = log.weeks.filter(function (W) {
  return W && W.missions.some(function (m) { return m.m === "entrenamiento" && m.domTries > 4; });
}).map(function (W) { return W.week; });
var bossFailed = course.weeks.filter(function (w) { return w.boss && !(state.weekStats[w.week] || {}).bossPassed; })
  .map(function (w) { return w.week; });

var summary = {
  lang: CODE, seed: SEED,
  days: day, hours: Math.round(totalSec / 3600), xp: state.xp, level: Engine.levelFor(state.xp).level,
  rank: Engine.rankFor(Engine.levelFor(state.xp).level), streak: state.streak, shields: state.shields,
  badges: state.badges, badgesTotal: Engine.BADGES.length, unlocked: state.unlocked,
  bossPassed: course.weeks.filter(function (w) { return w.boss; }).map(function (w) { return { week: w.week, passed: !!(state.weekStats[w.week] || {}).bossPassed }; }),
  cards: Object.keys(state.cards).length,
  wordsPractised: Object.keys(state.cards).filter(function (k) { return k.indexOf("v:") === 0 || k.indexOf("b:voc:") === 0; }).length,
  phrasesSeen: Object.keys(state.cards).filter(function (k) { return k.indexOf("frase:") === 0; }).length,
  phrasesTotal: Frasi.ALL.length,
  readings: Object.keys(state.letture || {}).length, readingsTotal: Letture.EPISODI.length,
  totals: state.totals,
  items: course.items.length, itemsServed: Object.keys(served).length,
  neverServed: neverServed.length,
  neverServedNotInSfide: neverServed.filter(function (it) { return !inSfide[it.id]; }).length,
  orphanItems: orphan.length,
  dueAtEnd: Drills.dueCount(course, state, map),
  dueMax: Math.max.apply(null, dueSeries.map(function (d) { return d.due; })),
  itemIssues: log.itemIssues.length, duplicates: log.duplicates.length, lessonIssues: log.lessonIssues.length, errors: log.errors.length,
  notMastered: notMastered, hardWeeks: hardWeeks, bossFailed: bossFailed
};

if (process.argv.indexOf("--json") >= 0) {
  console.log(JSON.stringify({ summary: summary, weeks: log.weeks.filter(Boolean), dueSeries: dueSeries, itemIssues: log.itemIssues,
                               duplicates: log.duplicates, lessonIssues: log.lessonIssues, errors: log.errors,
                               neverServed: neverServed.slice(0, 200).map(function (i) { return i.id; }) }, null, 1));
} else {
  console.log("RESUMEN", JSON.stringify(summary, null, 1));
  console.log("no dominadas:", notMastered, " más de 4 intentos de «Dominala»:", hardWeeks);
  [[40, 52]].forEach(function (r) {
    var kinds = {};
    log.weeks.filter(function (W) { return W && W.week >= r[0] && W.week <= r[1]; }).forEach(function (W) { W.missions.forEach(function (m) { kinds[m.m] = (kinds[m.m] || 0) + 1; }); });
    console.log("misiones semanas " + r[0] + "-" + r[1] + ":", JSON.stringify(kinds));
  });
  console.log("jefes:", JSON.stringify(log.weeks.filter(function (W) { return W && W.boss; }).map(function (W) { return W.missions.filter(function (m) { return m.m === "jefe"; })[0]; })));
  console.log("\nsem  nivel  días  min  xp    misiones  rondas  pool  distintos  rep.máx  due.máx  sfide(auto/manual)");
  log.weeks.filter(Boolean).forEach(function (W) {
    var tr = W.missions.filter(function (m) { return m.m === "entrenamiento"; })[0] || {};
    var sf = W.missions.filter(function (m) { return m.m === "sfide"; })[0] || {};
    console.log(String(W.week).padStart(3), W.cefr.padEnd(6), String(W.days).padStart(4), String(W.minutes).padStart(4), String(W.xp).padStart(5),
      String(W.missions.length).padStart(8), String(tr.rounds || "-").padStart(7), String(W.pool).padStart(5), String(tr.distinctServed || "-").padStart(9),
      String(tr.maxRepeat || "-").padStart(8), String(W.dueMax).padStart(8), (sf.groups ? sf.playable + "/" + sf.selfScored : "-").padStart(10),
      W.boss ? " ⚔️" : "", W.title.slice(0, 40));
  });
  if (log.gymSkipped.length) console.log("\ngimnasio, formas que el verbo no tiene (no se piden): " + log.gymSkipped.join(", "));
  if (log.errors.length) console.log("\nERRORES:\n" + log.errors.slice(0, 40).join("\n"));
  if (log.itemIssues.length) console.log("\nÍTEMS:\n" + log.itemIssues.slice(0, 60).map(function (x) { return x.id + " (sem " + x.wk + ", " + x.type + "): " + x.msg; }).join("\n"));
  if (log.lessonIssues.length) console.log("\nLECCIONES:\n" + log.lessonIssues.slice(0, 40).map(function (x) { return "sem " + x.wk + ": " + x.msg; }).join("\n"));
  if (log.duplicates.length) console.log("\nDUPLICADOS (" + log.duplicates.length + "):\n" + log.duplicates.slice(0, 30).map(function (d) { return d.join(" = "); }).join("\n"));
}

/* ------------------------------------------------------------ veredicto */

var fails = [];
if (notMastered.length) fails.push("semanas sin dominar: " + notMastered.join(", "));
if (bossFailed.length) fails.push("jefes sin pasar: " + bossFailed.join(", "));
if (log.errors.length) fails.push(log.errors.length + " errores");
if (log.duplicates.length) fails.push(log.duplicates.length + " ítems duplicados");
if (log.lessonIssues.length) fails.push(log.lessonIssues.length + " chequeos de lección rotos");
var out = process.argv.indexOf("--json") >= 0 ? console.error : console.log;
if (fails.length) {
  out("\nsim " + CODE + " FALLA (semilla " + SEED + "): " + fails.join("; "));
  process.exitCode = 1;
} else {
  out("\nsim " + CODE + " OK (semilla " + SEED + "): " + course.weeks.length + " semanas, todas dominadas, sin errores ni duplicados" +
      (log.itemIssues.length ? " (" + log.itemIssues.length + " avisos de ítems)" : ""));
}
