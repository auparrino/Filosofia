/* Nada antes de su lección: un alumno que está leyendo la lección de la
   semana (leyó solo la primera parte) no recibe, en ningún modo de juego,
   ejercicios de las partes que todavía no leyó.  Ejemplo que lo motivó: los
   posesivos del italiano están en la cuarta parte de la semana 3, y
   «Dominala», «Puntos débiles» y el banco de oraciones los preguntaban
   antes.  Para cada idioma y cada semana con la lección en partes:
     - el entrenamiento de la semana, la sfida del giorno y los puntos
       débiles traen solo ejercicios de la parte leída;
     - el banco (traducir, completar, encontrar el error, la pausa) usa la
       gramática de la semana anterior;
     - la pausa pregunta de la última lección leída entera.
   Run: node tools/lib/test_orden_lecciones.js */
"use strict";
var pack = require("./pack.js");
var bad = 0, checks = 0;
function ok(c, m) { checks++; if (!c) { bad++; if (bad <= 25) console.log("FAIL " + m); } }

pack.LANGS.forEach(function (code) {
  var ctx = pack(code), D = ctx.Drills, B = ctx.Banca, Engine = ctx.Engine;
  var course = pack.data(code, "course.json");
  B.load(pack.data(code, "bank.json"));
  var map = {}; course.items.forEach(function (it) { map[it.id] = it; });
  course.weeks.forEach(function (w) {
    if (!w.parts || w.parts.length < 2 || w.boss) return;
    var first = {}, later = {};
    w.parts[0].items.forEach(function (id) { first[id] = 1; });
    // what the unread parts teach for the first time (a review week brings
    // back exercises of earlier weeks, whose lessons are read)
    var before = {};
    course.weeks.forEach(function (x) { if (x.week < w.week) (x.items || []).forEach(function (id) { before[id] = 1; }); });
    w.parts.slice(1).forEach(function (p) { p.items.forEach(function (id) { if (!first[id] && !before[id]) later[id] = 1; }); });
    var state = Engine.blank ? Engine.blank() : { cards: {}, weekStats: {} };
    state.unlocked = w.week;
    state.read = {}; for (var k = 1; k < w.week; k++) state.read[k] = 1;
    state.readParts = {}; state.readParts[w.week] = { 0: 1 };
    var where = code + " semana " + w.week + ": ";
    for (var r = 0; r < 4; r++) {
      D.buildRound(course, w, { map: map, state: state, only: first }).forEach(function (it) {
        ok(!later[it.id], where + "el entrenamiento trae «" + it.id + "» de una parte sin leer");
      });
      D.buildWeak(course, w, state, { map: map, size: 15, only: first }).forEach(function (it) {
        ok(!later[it.id], where + "puntos débiles trae «" + it.id + "» de una parte sin leer");
      });
      var taught = course.weeks[w.week - 2];
      D.buildPausa(course, state, taught, { map: map }).forEach(function (it) {
        ok(!later[it.id], where + "la pausa trae «" + it.id + "» de la lección que se está leyendo");
      });
      [B.translateSession(state, 8), B.gapSession(state, 8), B.errorSession(state, 8), [B.pausaItem(state)]].forEach(function (list) {
        (list || []).filter(Boolean).forEach(function (it) {
          var m = /^b:(tr|gap|err):(\d+)$/.exec(it.id), bk = B.bank();
          var x = m ? (m[1] === "err" ? bk.errors : bk.sentences)[+m[2]] : null;
          var wk = x ? (m[1] === "gap" ? (x.wg || x.w) : x.w) : null;
          if (wk != null) ok(wk < w.week, where + "el banco trae «" + it.id + "» (semana " + wk + ") antes de terminar la lección");
        });
      });
    }
  });
  // the bank's week: the open one only once its lesson is read
  var st = { unlocked: 3, read: { 1: 1, 2: 1 } };
  ok(B.translateSession(st, 50).every(function (it) { var x = B.bank().sentences[+it.id.split(":")[2]]; return x.w <= 2; }),
     code + ": traducir en la semana 3 sin la lección leída usa hasta la 2");
});
console.log(bad ? "✗ orden de las lecciones: " + bad + " problemas en " + checks + " controles" : "✓ orden de las lecciones: " + checks + " controles");
process.exit(bad ? 1 : 0);
