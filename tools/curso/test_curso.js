/* Ágora — el curso compilado de cada edición (docs/lang/<código>/data/
   course.json, lo arma tools/curso/build_course.py) y el núcleo jugándolo
   (tools/lib/pack.js):
   - el formato de cada ejercicio, semana, lección y concepto;
   - cada respuesta se corrige como buena (con o sin tildes);
   - las lecciones: un chequeo por bloque, con una sola opción correcta;
   - las rondas, la pausa y el repaso traen solo ejercicios del curso;
   - las épocas cubren las 52 semanas, en orden, y cada semana trae la suya;
   - nada se guarda con las claves de La Via C1 (mismo origen: no se pisan).
   Corre: node tools/curso/test_curso.js */
"use strict";
var fs = require("fs"), path = require("path");
var pack = require("../lib/pack.js");
var T = require("../lib/testkit.js")("curso"), ok = T.ok;

var nfc = function (s) { return typeof s !== "string" || s === s.normalize("NFC"); };
var TYPES = ["choice", "cloze", "typed"];

pack.ALL.forEach(function (code) {
  var ctx = pack(code);
  var Engine = ctx.Engine, Drills = ctx.Drills, Lez = ctx.Lezione, LANG = ctx.LANG;
  var course = pack.data(code, "course.json");
  Engine.setCourse(course);
  var tag0 = "[" + code + "] ";

  /* ------------------------------------------------ el paquete */
  ok(LANG.code === code && LANG.brand === "Ágora" && /^agora-/.test(LANG.storage), tag0 + "lang.js: código, marca y guardado propio (" + LANG.storage + ")");
  ok(LANG.rules && LANG.rules.grade && LANG.rules.traps && LANG.rules.distract && LANG.rules.ranks.length >= 5, tag0 + "rules.js");
  ok(course.lang === code, tag0 + "el curso es de la edición");

  /* ------------------------------------------------ las épocas y las estaciones */
  ok(course.nweeks >= course.weeks.length && course.nweeks % 13 === 0, tag0 + "el temario: " + course.nweeks + " semanas, en estaciones de 13");
  ok(Engine.weeks() === course.weeks.length && Engine.finalWeek() === course.nweeks, tag0 + "el motor sabe cuántas semanas hay y cuál es el examen final");
  ok(course.eras.length === 8 && course.eras[0].weeks[0] === 1 && course.eras[course.eras.length - 1].weeks[1] === course.nweeks,
     tag0 + "ocho épocas, de la semana 1 a la " + course.nweeks);
  course.eras.forEach(function (e, k) {
    ok(e.n === k + 1 && e.name && e.id, tag0 + "época " + (k + 1));
    if (k) ok(e.weeks[0] === course.eras[k - 1].weeks[1] + 1, tag0 + "las épocas van seguidas: " + e.id);
  });
  ok(course.seasons.length >= 1 && course.seasons[course.seasons.length - 1].weeks[1] === course.weeks.length, tag0 + "las estaciones cubren las semanas");

  var ids = {}, map = {};
  course.items.forEach(function (it) {
    ok(!ids[it.id], tag0 + "id repetido " + it.id); ids[it.id] = 1; map[it.id] = it;
    ok(TYPES.indexOf(it.type) >= 0, it.id + ": tipo " + it.type);
    ok(it.prompt && it.stem && it.answer && it.note, it.id + ": prompt, stem, answer y nota");
    ok(it.accept.indexOf(it.answer) >= 0, it.id + ": accept trae la respuesta");
    if (it.options) {
      ok(it.options.indexOf(it.answer) >= 0, it.id + ": la respuesta está entre las opciones");
      ok(new Set(it.options.map(function (o) { return o.toLowerCase(); })).size === it.options.length, it.id + ": opciones repetidas (sin mirar mayúsculas)");
    }
    if (it.type === "cloze") ok(/_{3,}/.test(it.stem), it.id + ": el hueco ___");
    [it.stem, it.answer, it.note].concat(it.options || [], it.accept).forEach(function (s) { ok(nfc(s), it.id + ": NFC «" + s + "»"); });
    ok(Engine.grade(it.answer, it) === "giusto", it.id + ": su respuesta se corrige como buena");
    it.accept.forEach(function (a) { ok(Engine.grade(a, it) === "giusto", it.id + ": la variante «" + a + "» se acepta"); });
  });

  var words = {};
  course.weeks.forEach(function (w, k) {
    var tag = tag0 + "semana " + w.week;
    ok(w.week === k + 1, tag + ": en orden");
    ok(!!w.boss === (w.week % 13 === 0 || w.week === course.nweeks), tag + ": es de examen si cierra una estación");
    if (w.boss) {
      // an exam: every exercise of its season, and a review block per week
      var season = course.weeks.filter(function (x) { return !x.boss && x.season === w.season; });
      ok(season.length === 12 && w.items.length === season.reduce(function (n, x) { return n + x.items.length; }, 0),
         tag + ": el examen trae todos los ejercicios de su estación");
      ok(w.lesson.blocks.length === season.length, tag + ": un bloque de repaso por semana");
      var bossRound = Drills.buildBoss(course, w, Engine.load(), { map: Drills.itemsById(course) });
      ok(bossRound.length >= 20, tag + ": el examen arma una ronda (" + bossRound.length + ")");
      return;
    }
    ok(w.seminario && w.seminario.tramos.length >= 3, tag + ": el seminario de la semana");
    ok((w.dilemas || []).length >= 1, tag + ": al menos un dilema");
    ok(w.items.filter(function (id) { return map[id] && map[id].apl; }).length >= 0.4 * w.items.length, tag + ": el 40 % de aplicación");
    ok(w.title && w.focus && w.keys.length >= 4, tag + ": título, foco y claves");
    var era = course.eras.filter(function (e) { return w.week >= e.weeks[0] && w.week <= e.weeks[1]; })[0];
    ok(era && w.era === era.n, tag + ": su época (" + w.era + ")");
    ok(w.items.length >= 45, tag + ": ejercicios " + w.items.length);
    ok(w.items.every(function (id) { return map[id]; }), tag + ": ejercicios existentes");
    ok(w.vocab.length >= 12, tag + ": conceptos " + w.vocab.length);
    w.vocab.forEach(function (v) {
      ok(v.length === 4 && v.every(Boolean), tag + ": concepto completo «" + v[0] + "»");
      ok(!words[v[0]], tag + ": «" + v[0] + "» ya estaba en la semana " + words[v[0]]); words[v[0]] = w.week;
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
      (b.q || []).forEach(function (q) {
        ok(q.options.indexOf(q.answer) >= 0 && new Set(q.options).size === q.options.length, tag + " bloque " + i + ": chequeo «" + q.prompt + "»");
      });
    });
    // the lesson: every check has its answer among options that are all different
    for (var r = 0; r < 5; r++) {
      var st = Lez.steps(w.lesson, Math.random, w.week, null, null);
      var quiz = st.filter(function (x) { return x.kind === "quiz"; });
      ok(quiz.length >= bl.length, tag + ": la lección tiene un chequeo por bloque (" + quiz.length + ")");
      quiz.forEach(function (x) {
        var o = x.q.options.map(String);
        ok(o.indexOf(String(x.q.answer)) >= 0 && new Set(o).size === o.length, tag + ": chequeo «" + (x.q.stem || x.q.prompt) + "» → " + JSON.stringify(x.q.options));
      });
    }
    // a round of the week: items of this course, concepts of the week
    var state = Engine.load();
    var round = Drills.buildRound(course, w, { map: Drills.itemsById(course), state: state, size: 12 })
      .filter(function (it) { return it.type !== "word"; });      // the cards that present a new concept
    ok(round.length >= 10, tag + ": ronda de " + round.length);
    ok(round.every(function (it) { return it.src === "vocab" || (/^f\d/.test(it.id) && it.wk <= w.week) || /^f\d/.test(it.orig || ""); }),
       tag + ": la ronda es del curso: " + round.map(function (it) { return it.id; }).join(","));
    var vs = Drills.vocabSession(course, w, state, 14);
    ok(vs.length >= 8 && vs.every(function (it) { return !it.options || it.options.indexOf(it.answer) >= 0; }), tag + ": conceptos de la semana");
  });

  /* ------------------------------------------------ la pausa y el repaso */
  var s1 = Engine.load();
  s1.read = { 1: Date.now() };
  var pausa = Drills.buildPausa(course, s1, course.weeks[0], { map: Drills.itemsById(course) });
  ok(pausa.length >= 4 && pausa.every(function (it) { return it && (it.src === "vocab" || /^f\d/.test(it.id)); }),
     tag0 + "la pausa trae solo el curso: " + pausa.map(function (it) { return it && it.id; }).join(","));
  var s2 = Engine.load(), now = Date.now();
  s2.cards[course.items[0].id] = { due: now - 1000, s: 1, d: 5, reps: 1, lapses: 0, ok: 1, last: now - 86400000, state: 2 };
  var rev = Drills.buildReview(course, s2, 10, { map: Drills.itemsById(course) });
  ok(rev.length >= 1 && rev[0].id === course.items[0].id, tag0 + "el repaso trae las fichas del curso");

  /* ------------------------------------------------ la corrección */
  var it1 = { answer: "ontología", accept: ["ontología"] };
  ok(Engine.grade("ontologia", it1) === "giusto", tag0 + "sin tilde: bien");
  ok(Engine.grade("Ontología", it1) === "giusto", tag0 + "con mayúscula: bien");
  ok(Engine.grade("ontología".normalize("NFD"), it1) === "giusto", tag0 + "tilde combinada (NFD)");
  ok(Engine.grade("teología", it1) !== "giusto", tag0 + "otra palabra: no");
});

/* ------------------------------------------------ separada de La Via C1 */
var DOCS = pack.DOCS, read = function (f) { return fs.readFileSync(path.join(DOCS, f), "utf8"); };
var Boot = require(path.join(DOCS, "js", "boot.js"));
ok(Boot.KEY === "agora.lang" && Boot.ERA === "agora.era", "boot.js: claves propias (" + Boot.KEY + ", " + Boot.ERA + ")");
ok(Object.keys(Boot.LANGS).every(function (c) { return /^agora-/.test(Boot.LANGS[c].storage); }), "cada edición guarda con «agora-»");
ok(/var VERSION = "agora-v/.test(read("sw.js")) && /var PREFIX = "agora-";/.test(read("sw.js")) && !/LEGACY/.test(read("sw.js")),
   "sw.js: cachés «agora-», y no borra las de La Via C1");
var code = fs.readdirSync(path.join(DOCS, "js")).map(function (f) { return read("js/" + f); }).join("\n");
var keys = code.match(/["'](c1|laviac1|rumoc1|wegc1)\.[a-z0-9.]+["']/g) || [];
ok(!keys.length, "el núcleo no usa claves de La Via C1: " + keys.join(", "));
ok(!/app: "c1"|app === "c1"/.test(code), "las copias son de Ágora ({app: \"agora\"}), no de La Via");

T.done();
