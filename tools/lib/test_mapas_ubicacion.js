/* Mapas de preposiciones (docs/js/mapas.js + lang/<código>/mapas_data.js) y
   test de ubicación (docs/js/ubicacion.js), en los dos idiomas.
   Run: node tools/lib/test_mapas_ubicacion.js */
"use strict";
var pack = require("./pack.js");

var fails = 0, checks = 0;
function ok(cond, what) {
  checks++;
  if (!cond) { fails++; console.log("FAIL " + what); }
}

// A seeded random: the simulated learners give the same result every run.
function seeded(seed) {
  var s = seed >>> 0;
  return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

pack.LANGS.forEach(function (code) {
  var ctx = pack(code);
  var M = ctx.Mapas, D = ctx.MAPAS_DATA, U = ctx.Ubicacion, Lez = ctx.Lezione, E = ctx.Engine;
  var tag = "[" + code + "] ";
  ok(!!M && !!D && !!U, tag + "cargan Mapas, MAPAS_DATA y Ubicacion");
  if (!M || !D || !U) return;

  /* ------------------------------------------------------------ mapas */
  var course = pack.data(code, "course.json");
  ok(D.week === 9, tag + "los mapas van en la semana 9");
  ok(/preposi/i.test(course.weeks[D.week - 1].title), tag + "la semana " + D.week + " es la de preposiciones: " + course.weeks[D.week - 1].title);

  Object.keys(D.scenes).forEach(function (id) {
    var sc = D.scenes[id], s = M.svg(id);
    ok(/^<svg[^>]*role="img"[^>]*aria-label="[^"]+"/.test(s) && /<\/svg>$/.test(s), tag + "escena " + id + ": svg con descripción");
    ok(!/NaN|undefined/.test(s), tag + "escena " + id + ": sin NaN");
    ok(["caja", "zona", "superficie", "punto", "casa"].indexOf(sc.lm) >= 0, tag + "escena " + id + ": fondo conocido");
    ok(["", "hacia", "idaVuelta", "desde", "por", "rumbo", "lazo"].indexOf(sc.mov || "") >= 0, tag + "escena " + id + ": movimiento conocido");
    ok((s.match(/class="tr"/g) || []).length === 1, tag + "escena " + id + ": una sola figura");
    ok(!/#[0-9a-f]{3,6}/i.test(s), tag + "escena " + id + ": sin colores fijos (tokens del tema)");
  });

  var preps = {};
  D.blocks.forEach(function (b, bi) {
    ok(b.h && b.r && b.ex && b.ex.length >= 3, tag + "bloque " + bi + ": título, regla y ejemplos");
    [].concat(b.fig || []).forEach(function (id) {
      ok(!!D.scenes[id], tag + "bloque " + bi + ": escena " + id);
      var sc = D.scenes[id] || {};
      ok(sc.prep && sc.cap && sc.es, tag + "escena " + id + ": epígrafe completo");
      preps[sc.prep] = 1;
    });
    var fig = M.figure(b.fig);
    ok((fig.match(/<figure/g) || []).length === [].concat(b.fig).length, tag + "bloque " + bi + ": una figura por escena");
    (b.qq || []).forEach(function (q, k) {
      var w = tag + "bloque " + bi + " ejercicio " + k + " ";
      ok(!!D.scenes[q.fig], w + "tiene dibujo");
      ok(q.options.indexOf(q.answer) >= 0, w + "la respuesta está entre las opciones");
      ok(new Set(q.options).size === q.options.length && q.options.length >= 3, w + "tres opciones distintas");
      ok(q.stem.split("___").length === 2, w + "un solo hueco");
      ok(/mirando el dibujo/.test(q.prompt), w + "consigna «mirando el dibujo»");
      // the picture of an exercise never says the answer
      var bare = M.figure(q.fig, { bare: true });
      ok(bare.indexOf("figcaption") < 0, w + "dibujo sin epígrafe");
      var label = (D.scenes[q.fig] || {}).label || "";
      ok(q.options.every(function (o) { return label.toLowerCase().split(/\s+/).indexOf(o.toLowerCase()) < 0; }), w + "el rótulo no trae una opción");
    });
  });
  var want = code === "it" ? ["in", "a", "da", "di", "su", "per"] : ["em", "a", "para", "por", "de"];
  want.forEach(function (p) { ok(preps[p], tag + "hay dibujo de «" + p + "»"); });

  // In the lesson: at the end, in the last part, once; checks with pictures.
  var w9 = course.weeks[D.week - 1], nb = w9.lesson.blocks.length, lastPart = w9.parts[w9.parts.length - 1].blocks.slice();
  ok(M.install(course) === true, tag + "install suma los bloques");
  ok(M.install(course) === false, tag + "install no los repite");
  ok(w9.lesson.blocks.length === nb + D.blocks.length, tag + "bloques al final de la lección");
  var added = D.blocks.map(function (_, k) { return nb + k; });
  ok(JSON.stringify(w9.parts[w9.parts.length - 1].blocks) === JSON.stringify(lastPart.concat(added)), tag + "en la última parte");
  var isWord = function () { return true; };
  for (var run = 0; run < 20; run++) {
    var st = Lez.steps(w9.lesson, seeded(run + 1), 9, isWord, added);
    var quiz = st.filter(function (x) { return x.kind === "quiz"; });
    var withFig = quiz.filter(function (x) { return x.q.fig; });
    ok(withFig.length === D.blocks.reduce(function (n, b) { return n + (b.qq || []).length; }, 0), tag + "cada ejercicio del dibujo entra en la lección");
    quiz.forEach(function (x) {
      ok(x.q.options.indexOf(x.q.answer) >= 0, tag + "chequeo con respuesta entre las opciones: " + x.q.prompt + " " + x.q.stem);
      ok(new Set(x.q.options).size === x.q.options.length, tag + "chequeo sin opciones repetidas: " + x.q.stem);
    });
    ok(st.some(function (x) { return x.kind === "rule"; }), tag + "la regla con sus dibujos es un paso");
  }

  /* ------------------------------------------------------- ubicación */
  var fresh = pack.data(code, "course.json");
  var bank = U.pool(fresh);
  var weeks = Object.keys(bank).map(Number);
  ok(weeks.length >= 35, tag + "preguntas en al menos 35 semanas (" + weeks.length + ")");
  var total = weeks.reduce(function (n, k) { return n + bank[k].length; }, 0);
  ok(total >= 300, tag + "banco de ubicación con 300+ preguntas (" + total + ")");
  weeks.forEach(function (k) {
    bank[k].forEach(function (it) {
      ok(it.type !== "listen" && !/escuch/i.test(it.prompt), tag + "nada de escucha: " + it.id);
      if (it.options && it.options.length) ok(it.options.indexOf(it.answer) >= 0, tag + "respuesta entre opciones: " + it.id);
      else ok(E.grade(it.answer, it) === E.VERDICT.RIGHT, tag + "la respuesta escrita se corrige bien: " + it.id);
    });
  });

  // Simulated learners who know up to week T answer (almost) everything
  // up to T and (almost) nothing after: the estimate lands near T.
  [0, 4, 10, 18, 27, 38, 48].forEach(function (T) {
    var starts = [];
    for (var r = 0; r < 12; r++) {
      var rnd = seeded(1000 * T + r + 7);
      var s = U.create(fresh, { rnd: rnd, pool: bank }), q, n = 0;
      while ((q = s.next())) {
        n++;
        var g = q.it.options && q.it.options.length ? 1 / q.it.options.length : 0;
        var knows = q.week <= T ? rnd() > 0.08 : rnd() < g;
        s.answer(knows);
      }
      ok(n <= U.MAX_Q, tag + "a lo sumo " + U.MAX_Q + " preguntas (" + n + ")");
      if (T === 0) ok(n <= 14, tag + "quien empieza de cero termina rápido (" + n + ")");
      starts.push(s.result().start);
    }
    starts.sort(function (a, b) { return a - b; });
    var med = starts[Math.floor(starts.length / 2)];
    // a little under the level is fine; far above never
    ok(med <= T + 3 && med >= Math.max(1, T - 7), tag + "nivel " + T + ": arranca en la semana " + med + " (" + starts.join(",") + ")");
  });

  // apply: opens the weeks before, without stars; never goes down.
  var s0 = E.blankSave();
  ok(U.fresh(s0), tag + "guardado nuevo = recién empezado");
  var opened = U.apply(s0, 14, { level: 14, asked: 20, right: 12 });
  ok(opened === 13 && s0.unlocked === 14, tag + "abre las semanas 1-13");
  ok(!Object.keys(s0.read).length && !Object.keys(s0.weekStats).length && !Object.keys(s0.cards).length, tag + "sin estrellas ni fichas regaladas");
  ok(s0.ubicacion && s0.ubicacion.start === 14 && s0.ubicacion.from === 1, tag + "queda registrado");
  var s1 = E.blankSave();
  s1.unlocked = 30; s1.read = { 1: 1 }; s1.weekStats = { 1: { attempts: 20, right: 20 } };
  ok(!U.fresh(s1), tag + "quien avanzó no es nuevo");
  ok(U.apply(s1, 12) === 0 && s1.unlocked === 30, tag + "nunca baja lo desbloqueado");
  ok(s1.read[1] === 1 && s1.weekStats[1].right === 20, tag + "no toca el progreso");
  ok(U.banner(s1) === "", tag + "sin oferta para quien ya avanzó");
  ok(/ubicgo/.test(U.banner(E.blankSave())), tag + "oferta al empezar");
  ok(/ubicgo/.test(U.card(s1)), tag + "en el perfil, siempre");
  // the save keeps the record
  var san = E.sanitize ? E.sanitize(JSON.parse(JSON.stringify(s0))) : s0;
  ok(san.ubicacion && san.ubicacion.start === 14 && san.unlocked === 14, tag + "el guardado conserva la ubicación");
});

console.log("mapas + ubicación: " + checks + " controles, " + fails + " errores");
process.exit(fails ? 1 : 0);
