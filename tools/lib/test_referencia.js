/* Concordancias y «Mi gramática» (docs/js/referencia.js), en los dos idiomas.
 *
 *   node tools/lib/test_referencia.js
 *
 * - el corpus junta lecturas, frases, banco, ejemplos de lecciones y de
 *   palabras, todo en la lengua meta;
 * - una concordancia trae de 5 a 8 oraciones con la forma resaltada, solo de
 *   semanas que el alumno ya puede leer, y avisa en qué semana llega si no hay;
 * - el mini ejercicio da dos versiones distintas y la correcta es una oración
 *   del curso (o del banco de errores);
 * - «Mi gramática»: los bloques hasta la semana, con formas de la lengua,
 *   buscables, con aciertos, fallos y estado;
 * - el núcleo no nombra ningún idioma. */
"use strict";
var fs = require("fs"), path = require("path");
var pack = require("./pack.js");

var fails = 0, checks = 0;
function ok(cond, msg) { checks++; if (!cond) { fails++; console.log("  ✗ " + msg); } }

// A seeded random, so the test is the same every time.
function rng(seed) { var s = seed || 1; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }

var SRC = fs.readFileSync(path.join(pack.DOCS, "js", "referencia.js"), "utf8");
ok(!/italian|portugu|brasil|\bLa Via\b|Rumo C1/i.test(SRC.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "")),
   "referencia.js no nombra ningún idioma");
var Boot = require(path.join(pack.DOCS, "js", "boot.js"));
ok(Boot.ORDER.some(function (e) { return e.core === "referencia.js"; }), "referencia.js está en ORDER de boot.js");

var WORDS = {
  it: { common: ["casa", "andato", "piace", "nel", "sono", "fare", "bene", "molto"], week: 15 },
  pt: { common: ["casa", "fui", "gosto", "na", "está", "fazer", "muito", "bem"], week: 15 }
};

pack.LANGS.forEach(function (code) {
  console.log("— " + code);
  var ctx = pack(code), R = ctx.Referencia;
  ok(!!R, code + ": window.Referencia existe");
  if (!R) return;
  var course = pack.data(code, "course.json"), bank = pack.data(code, "bank.json"), gloss = pack.data(code, "glossario.json");
  var t0 = Date.now();
  R.setData({ course: course, bank: bank, gloss: gloss });
  var C = R.corpus();
  var ms = Date.now() - t0;
  console.log("  corpus: " + C.length + " oraciones en " + ms + " ms");
  ok(C.length > 2000, code + ": corpus con más de 2000 oraciones (" + C.length + ")");
  ok(ms < 2000, code + ": el corpus se arma en menos de 2 s (" + ms + " ms)");
  var bySrc = {};
  C.forEach(function (s) { bySrc[s.src] = (bySrc[s.src] || 0) + 1; });
  ["lettura", "frase", "banco", "leccion", "palabra"].forEach(function (s) {
    ok(bySrc[s] > 50, code + ": el corpus tiene oraciones de «" + s + "» (" + (bySrc[s] || 0) + ")");
  });
  ok(C.every(function (s) { return s.w >= 1 && s.w <= 52 && s.t && !/\*|_{2,}/.test(s.t); }), code + ": cada oración tiene semana y texto limpio");
  // no Spanish lesson translation slipped in as a sentence of the language
  var esLeak = C.filter(function (s) { return /\b(el|los|las|usted|ustedes|pero|también|porque)\b/i.test(s.t) && s.src !== "banco"; });
  ok(esLeak.length < C.length * 0.01, code + ": casi nada en castellano en el corpus (" + esLeak.length + ")");

  var W = WORDS[code], week = W.week;
  W.common.forEach(function (w) {
    var q = R.concordance(w, { week: week });
    ok(q.hits.length >= 5 && q.hits.length <= 8, code + ": «" + w + "» trae 5-8 oraciones (" + q.hits.length + ")");
    ok(q.hits.every(function (h) { return h.w <= week; }), code + ": «" + w + "» solo semanas ≤ " + week);
    ok(q.hits.every(function (h) {
      return h.marks.length && h.marks.every(function (m) { return q.forms.indexOf(h.t.slice(m[0], m[1]).toLowerCase().replace(/’/g, "'")) >= 0; });
    }), code + ": «" + w + "» resalta formas de la palabra");
    ok(q.hits.some(function (h) { return h.exact; }), code + ": «" + w + "» trae la forma exacta");
    var srcs = {};
    q.hits.forEach(function (h) { srcs[h.src] = 1; });
    ok(Object.keys(srcs).length >= 3, code + ": «" + w + "» mezcla fuentes (" + Object.keys(srcs).join(", ") + ")");
    var ex = R.exercise(q, week, rng(7));
    ok(ex && ex.right && ex.wrong && ex.right !== ex.wrong, code + ": «" + w + "» tiene mini ejercicio");
  });

  // Week filter: a word that is in the course only after week 3 is not shown
  // at week 3, and the sheet says in which week it comes.
  var firstWeek = {};
  C.forEach(function (s) { s.toks.forEach(function (t) { if (!firstWeek[t[0]] || s.w < firstWeek[t[0]]) firstWeek[t[0]] = s.w; }); });
  var late = Object.keys(firstWeek).filter(function (k) { return firstWeek[k] > 3 && gloss[k] && !/ /.test(k); }).slice(0, 150);
  var laterOk = 0;
  late.forEach(function (k) {
    var q = R.concordance(k, { week: 3 });
    if (q.hits.some(function (h) { return h.w > 3; })) ok(false, code + ": «" + k + "» se mostró antes de tiempo");
    if (q.hits.length || q.later > 3) laterOk++;
  });
  ok(laterOk === late.length, code + ": las palabras que todavía no se leen dicen en qué semana llegan (" + laterOk + "/" + late.length + ")");

  // Coverage: every glossary word that is in a sentence the learner can read
  // (week ≤ 20) has uses, and nearly all of them an exercise.
  var readable = {};
  C.forEach(function (s) { if (s.w <= 20) s.toks.forEach(function (t) { if (gloss[t[0]]) readable[t[0]] = 1; }); });
  var sample = Object.keys(readable).filter(function (k, i) { return i % 3 === 0; });
  var withUses = 0, withEx = 0, five = 0;
  var rnd = rng(3);
  sample.forEach(function (k) {
    var q = R.concordance(k, { week: 20 });
    if (q.hits.length) {
      withUses++;
      if (q.hits.length >= 5) five++;
      var ex = R.exercise(q, 20, rnd);
      if (ex) {
        withEx++;
        if (ex.right === ex.wrong) ok(false, code + ": ejercicio con dos versiones iguales para «" + k + "»");
      }
    }
  });
  console.log("  palabras legibles (semana ≤ 20): " + sample.length + ", con usos: " + withUses + ", con 5 o más: " + five + ", con ejercicio: " + withEx);
  ok(withUses === sample.length, code + ": toda palabra legible tiene usos (" + withUses + "/" + sample.length + ")");
  ok(withEx / Math.max(1, withUses) > 0.9, code + ": más del 90 % tiene ejercicio (" + withEx + "/" + withUses + ")");

  // «Mi gramática»
  var all = R.grammar(52), g15 = R.grammar(15);
  ok(all.length > 200, code + ": más de 200 construcciones en el curso (" + all.length + ")");
  ok(g15.length > 40 && g15.every(function (b) { return b.week <= 15; }), code + ": grammar(15) solo hasta la semana 15 (" + g15.length + ")");
  ok(all.every(function (b) { return b.id && b.h !== undefined && Array.isArray(b.forms); }), code + ": cada construcción tiene id, título y formas");
  var noForms = all.filter(function (b) { return !b.forms.length; }).length;
  ok(noForms < all.length * 0.2, code + ": casi todas las construcciones tienen formas (" + (all.length - noForms) + "/" + all.length + ")");
  var withHits = 0, withBEx = 0;
  all.forEach(function (b) {
    var q = R.blockConcordance(b, { week: 52 });
    if (q.hits.length) withHits++;
    if (q.hits.some(function (h) { return h.ref === b.id; })) ok(false, code + ": " + b.id + " se cita a sí mismo");
    if (R.exercise(q, 52, rnd, { blockWeek: b.week })) withBEx++;
  });
  console.log("  construcciones con ejemplos: " + withHits + "/" + all.length + ", con ejercicio: " + withBEx);
  ok(withHits / all.length > 0.75, code + ": más del 75 % de las construcciones tiene ejemplos (" + withHits + "/" + all.length + ")");
  ok(withBEx / all.length > 0.7, code + ": más del 70 % de las construcciones tiene ejercicio (" + withBEx + "/" + all.length + ")");

  // search
  ok(R.search(all, "gerundio").length > 0, code + ": buscar «gerundio» encuentra algo");
  ok(R.search(all, "ARTICULO").length > 0, code + ": buscar sin tildes ni mayúsculas («ARTICULO») encuentra artículos");
  ok(R.search(all, "zzzqqq").length === 0, code + ": una búsqueda sin sentido no encuentra nada");

  // stats and status: cards of the week's exercises, the log, the mini exercises
  var b = all.filter(function (x) { return x.week === 11 && x.forms.length; })[0] || all[10];
  var blank = R.blockStats(b, { cards: {}, weekStats: {} });
  ok(blank.status === "vista" && blank.ok === 0 && blank.ko === 0, code + ": sin práctica, la construcción está «vista»");
  var items = course.items.filter(function (it) { return it.wk === b.week; });
  var cards = {};
  items.forEach(function (it) { cards[it.id] = { ok: 3, lapses: 0, seen: 3 }; });
  var s1 = R.blockStats(b, { cards: cards, weekStats: {} });
  ok(s1.cards > 0, code + ": " + b.id + " cuenta las tarjetas de su semana con sus formas (" + s1.cards + ")");
  var state = { cards: {}, weekStats: {} };
  R.record(state, "b", b.id, true); R.record(state, "b", b.id, false); R.record(state, "b", b.id, true);
  var s2 = R.blockStats(b, state);
  ok(s2.ok === 2 && s2.ko === 1 && s2.status === "practicada", code + ": los mini ejercicios cuentan (2 ✔, 1 ✘ → practicada)");
  for (var i = 0; i < 10; i++) R.record(state, "b", b.id, true);
  state.weekStats[b.week] = { prodDays: ["a", "b", "c"] };
  var s3 = R.blockStats(b, state);
  ok(s3.status === "dominada", code + ": muchos aciertos y regla consolidada → dominada (" + s3.ok + "/" + s3.ko + ")");
  var errLog = [{ e: "", g: "" }];
  var long = b.forms.filter(function (f) { return f.length >= 4; })[0];
  if (long) {
    errLog = [{ cat: "x", g: "mal", e: long + " bien" }];
    var s4 = R.blockStats(b, { cards: {}, weekStats: {}, errLog: errLog });
    ok(s4.ko === 1, code + ": un error del registro con la forma «" + long + "» cuenta como fallo");
  }
  ok(state.ref && state.ref.b && state.ref.b[b.id][1] === 13, code + ": state.ref guarda los mini ejercicios");
});

console.log(checks + " chequeos, " + fails + " errores");
process.exit(fails ? 1 : 0);
