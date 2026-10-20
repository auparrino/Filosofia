/* Weg C1 — el curso de alemán compilado (docs/lang/de/data/course.json, lo
   arma tools/de/build_course.py) y el núcleo jugándolo con el paquete
   alemán (tools/lib/pack.js):
   - el formato de cada ejercicio, semana, lección y palabra;
   - cada respuesta se corrige como buena, con las diéresis y la ß;
   - las lecciones: un chequeo por bloque, con una sola opción correcta;
   - las rondas, la pausa y el repaso traen solo ejercicios del alemán;
   - el guardado es propio (wegc1.save.v1).
   Corre: node tools/de/test_curso.js */
"use strict";
var pack = require("../lib/pack.js");
var ctx = pack("de");
var Engine = ctx.Engine, Drills = ctx.Drills, Lez = ctx.Lezione, LANG = ctx.LANG;
var course = pack.data("de", "course.json");
var T = require("../lib/testkit.js")("de"), ok = T.ok;

var nfc = function (s) { return typeof s !== "string" || s === s.normalize("NFC"); };
// Spanish-only letters inside an answer in German: a slip of the author
var SPANISH = /[ñáéíóú¿¡]/i;

/* ------------------------------------------------ el paquete */
ok(LANG.code === "de" && LANG.storage === "wegc1" && LANG.tts === "de-DE", "lang.js del alemán");
ok(LANG.rules && LANG.rules.grade && LANG.rules.traps && LANG.rules.distract, "rules.js del alemán");
ok(LANG.ui.kbRows && LANG.ui.kbRows[0].indexOf("z") === 5, "el teclado de la app es QWERTZ");
ok(["ä", "ö", "ü", "ß"].every(function (c) { return LANG.ui.keys.indexOf(c) >= 0; }), "las teclas ä ö ü ß");

/* ------------------------------------------------ el curso */
ok(course.weeks.length >= 6, "semanas: " + course.weeks.length);
ok(course.seasons.length === 1 && course.seasons[0].weeks[1] === course.weeks.length, "la temporada cubre las semanas");

var ids = {}, map = {};
course.items.forEach(function (it) {
  ok(!ids[it.id], "id repetido " + it.id); ids[it.id] = 1; map[it.id] = it;
  ok(["choice", "cloze", "translate", "listen", "typed"].indexOf(it.type) >= 0, it.id + ": tipo " + it.type);
  ok(it.prompt && it.stem && it.answer, it.id + ": prompt, stem y answer");
  ok(it.accept.indexOf(it.answer) >= 0, it.id + ": accept trae la respuesta");
  if (it.options) {
    ok(it.options.indexOf(it.answer) >= 0, it.id + ": la respuesta está entre las opciones");
    // the correction does not look at capitals: two options that only differ in them would both be right
    ok(new Set(it.options.map(function (o) { return o.toLowerCase(); })).size === it.options.length, it.id + ": opciones repetidas (sin mirar mayúsculas)");
  }
  if (it.type === "cloze") ok(/_{3,}/.test(it.stem), it.id + ": el hueco ___");
  if (it.type === "translate" || it.type === "typed" || it.type === "cloze")
    ok(it.accept.every(function (a) { return !SPANISH.test(a); }), it.id + ": las respuestas escritas son en alemán");
  if (it.type === "listen") ok(!SPANISH.test(it.stem) && it.nopeek, it.id + ": escucha en alemán");
  [it.stem, it.answer, it.note].concat(it.options || [], it.accept).forEach(function (s) { ok(nfc(s), it.id + ": NFC «" + s + "»"); });
  ok(Engine.grade(it.answer, it) === "giusto", it.id + ": su respuesta se corrige como buena");
});

var words = {};
course.weeks.forEach(function (w, k) {
  var tag = "semana " + w.week;
  ok(w.week === k + 1, tag + ": en orden");
  ok(w.title && w.focus && w.keys.length >= 3, tag + ": título, foco y claves");
  ok(w.items.length >= 30, tag + ": ejercicios " + w.items.length);
  ok(w.items.every(function (id) { return map[id]; }), tag + ": ejercicios existentes");
  ok(w.vocab.length >= 8, tag + ": vocabulario " + w.vocab.length);
  w.vocab.forEach(function (v) {
    ok(v[0] && v[1] && !SPANISH.test(v[0]) && !SPANISH.test(v[2] || ""), tag + ": palabra «" + v[0] + "»");
    ok(!words[v[0]], tag + ": «" + v[0] + "» ya estaba en la semana " + words[v[0]]); words[v[0]] = w.week;
    // a noun goes with its article and a capital: der Kaffee
    if (/^(der|die|das) /.test(v[0])) ok(/^(der|die|das) [A-ZÄÖÜ]/.test(v[0]), tag + ": sustantivo con mayúscula «" + v[0] + "»");
  });
  var bl = w.lesson.blocks, seen = {};
  w.parts.forEach(function (p, pk) {
    ok(p.items.length > 0, tag + ": la parte " + (pk + 1) + " tiene ejercicios");
    p.blocks.forEach(function (i) { ok(bl[i] && !seen[i], tag + ": bloque " + i + " en una sola parte"); seen[i] = 1; });
  });
  ok(Object.keys(seen).length === bl.length, tag + ": todos los bloques en alguna parte");
  bl.forEach(function (b, i) {
    ok(b.h && b.r, tag + " bloque " + i + ": título y regla");
    ok((b.q || []).length >= 1, tag + " bloque " + i + ": chequeo a mano");
    (b.q || []).concat(b.qq || []).forEach(function (q) {
      ok(q.options.indexOf(q.answer) >= 0 && new Set(q.options).size === q.options.length, tag + " bloque " + i + ": chequeo «" + q.prompt + "»");
    });
  });
  // the lesson: every check has its answer among options that are all different
  for (var r = 0; r < 5; r++) {
    var st = Lez.steps(w.lesson, Math.random, w.week, null, null);
    var quiz = st.filter(function (x) { return x.kind === "quiz"; });
    ok(quiz.length >= bl.length, tag + ": la lección tiene un chequeo por bloque (" + quiz.length + ")");
    quiz.forEach(function (x) {
      // exact text: in German the capital is the lesson (das Hotel / das hotel, Sie / sie)
      var o = x.q.options.map(String);
      ok(o.indexOf(String(x.q.answer)) >= 0 && new Set(o).size === o.length, tag + ": chequeo «" + (x.q.stem || x.q.prompt) + "» → " + JSON.stringify(x.q.options));
    });
  }
  // a round of the week: items of this course, words of the week
  var state = Engine.load();
  var round = Drills.buildRound(course, w, { map: Drills.itemsById(course), state: state, size: 12 })
    .filter(function (it) { return it.type !== "word"; });      // the cards that present a new word
  ok(round.length >= 10, tag + ": ronda de " + round.length);
  ok(round.every(function (it) { return it.src === "vocab" || (/^de\d/.test(it.id) && it.wk <= w.week) || /^de\d/.test(it.orig || ""); }),
     tag + ": la ronda es del curso alemán: " + round.map(function (it) { return it.id; }).join(","));
  var vs = Drills.vocabSession(course, w, state, 14);
  ok(vs.length >= 8 && vs.every(function (it) { return !it.options || it.options.indexOf(it.answer) >= 0; }), tag + ": palabras de la semana");
});

/* ------------------------------------------------ la pausa y el repaso */
var s1 = Engine.load();
s1.read = { 1: Date.now() };
var pausa = Drills.buildPausa(course, s1, course.weeks[0], { map: Drills.itemsById(course) });
ok(pausa.length >= 4 && pausa.every(function (it) { return it && (it.src === "vocab" || /^de\d/.test(it.id)); }),
   "la pausa trae solo alemán: " + pausa.map(function (it) { return it && it.id; }).join(","));
var s2 = Engine.load(), now = Date.now();
s2.cards[course.items[0].id] = { due: now - 1000, s: 1, d: 5, reps: 1, lapses: 0, ok: 1, last: now - 86400000, state: 2 };
var rev = Drills.buildReview(course, s2, 10, { map: Drills.itemsById(course) });
ok(rev.length >= 1 && rev[0].id === course.items[0].id, "el repaso trae las fichas del alemán");

/* ------------------------------------------------ la corrección */
var it1 = { answer: "Ich heiße Ana.", accept: ["Ich heiße Ana."] };
ok(Engine.grade("ich heiße ana", it1) === "giusto", "sin mayúsculas ni punto final");
ok(Engine.grade("Ich heisse Ana", it1) !== "giusto", "ss en vez de ß: no es «bien»");
var it2 = { answer: "schön", accept: ["schön"] };
ok(Engine.grade("schon", it2) === "quasi", "sin diéresis: casi");
ok(Engine.grade("schön".normalize("NFD"), it2) === "giusto", "diéresis combinada (NFD)");
ok(Engine.grade("die Kaffee", { answer: "der Kaffee", accept: ["der Kaffee"] }) === "sbagliato", "otro artículo: mal");

T.done();
