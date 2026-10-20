/*
 * Escritura guiada (variaciones.js, ctest.js, ordenar.js, escritos.js) en
 * los dos idiomas, cargados con pack.js:
 *   - cada marco de variación rehace su frase exacta, cada variación cambia
 *     algo, pasa por el motor (Engine.grade y Diagnosi) y trae su segunda
 *     vuelta con opciones (la correcta una sola vez);
 *   - el pasado solo aparece desde la semana en que el curso lo enseña;
 *   - las rondas salen solo de frases aprendidas;
 *   - C-test: primera oración entera, se borra la segunda mitad (la mayor
 *     si es impar), ≤ 25 huecos; cloze: solo conectores y preposiciones;
 *   - «Ordená el texto»: ancla fija, desorden real, grade() coherente;
 *   - misiones opcionales y el ítem de la pausa solo con textos ya leídos.
 *
 *   node tools/lib/test_ejercicios.js
 */
"use strict";
var pack = require("./pack.js");

var errors = 0, checks = 0;
function ok(cond, msg) { checks++; if (!cond) { errors++; console.log("  ✗ " + msg); } }

pack.LANGS.forEach(function (code) {
  console.log("== " + code);
  var ctx = pack(code);
  var course = pack.data(code, "course.json");
  var V = ctx.Variaciones, C = ctx.CTest, O = ctx.Ordenar, E = ctx.Escritos;
  ok(V && C && O && E, code + ": módulos cargados");
  if (!(V && C && O && E)) return;
  var pw = V.pastWeek(course);
  ok(pw > 1 && pw < 52, code + ": semana del pasado " + pw);

  // ---- variaciones
  var nItems = 0;
  V.FRAMES.forEach(function (fr) {
    var f = ctx.Frasi.BY_ID[fr.f];
    ok(!!f, code + ": existe la frase " + fr.f);
    if (!f) return;
    var base;
    try { base = V.fill(fr, {}); } catch (e) { ok(false, code + " " + fr.f + ": " + e.message); return; }
    ok(base === f.it, code + " " + fr.f + ": el molde rehace «" + f.it + "» (da «" + base + "»)");
    fr.vars.forEach(function (v, k) {
      var it;
      try { it = V.item(fr, v); } catch (e) { ok(false, code + " " + fr.f + "#" + k + ": " + e.message); return; }
      nItems++;
      ok(it.answer !== base, code + " " + fr.f + "#" + k + ": la variación cambia algo");
      ok(it.type === "variante" && it.nocard && /^var:/.test(it.id), code + " " + fr.f + "#" + k + ": forma del ítem");
      ok(/Reescribila cambiando una sola pieza/.test(it.prompt), code + " " + fr.f + "#" + k + ": consigna");
      it.accept.forEach(function (a) {
        ok(ctx.Engine.grade(a, it) === "giusto", code + " " + fr.f + "#" + k + ": el motor acepta «" + a + "»");
      });
      var d = ctx.Diagnosi.diagnose(it.answer, it.accept, { stem: it.stem, prompt: it.prompt });
      ok(d.verdict === "giusto", code + " " + fr.f + "#" + k + ": Diagnosi da giusto a la respuesta");
      ok(ctx.Engine.grade(base, it) !== "giusto", code + " " + fr.f + "#" + k + ": la frase sin cambiar no vale");
      if (v.k === "pas") ok(it.week >= pw, code + " " + fr.f + "#" + k + ": pasado antes de la semana " + pw);
      var r = it.retryAs;
      ok(!!r && r.options.length >= 2, code + " " + fr.f + "#" + k + ": segunda vuelta con opciones");
      if (r) {
        var right = r.options.filter(function (o) { return it.accept.some(function (a) { return a.toLowerCase() === o.toLowerCase(); }); });
        ok(right.length === 1 && right[0] === it.answer, code + " " + fr.f + "#" + k + ": una sola opción correcta (" + r.options.join(" / ") + ")");
      }
    });
  });
  ok(nItems >= 60, code + ": al menos 60 variaciones (" + nItems + ")");

  // rounds only from learned phrases; the past only from its week
  var state = { cards: {}, unlocked: 12, letture: {}, dictogloss: {} };
  ok(V.session(state, { week: 12 }).length === 0, code + ": sin frases aprendidas, no hay ronda");
  V.FRAMES.forEach(function (fr) { state.cards[fr.f] = { ok: 1, reps: 1 }; });
  var s12 = V.session(state, { week: 12, n: 8 });
  ok(s12.length === 8, code + ": ronda de 8 (" + s12.length + ")");
  var kinds = {};
  s12.forEach(function (x) { kinds[x.change] = 1; });
  ok(Object.keys(kinds).length >= 3, code + ": la ronda mezcla tipos de cambio (" + Object.keys(kinds).join(",") + ")");
  var early = [];
  for (var t = 0; t < 30; t++) early = early.concat(V.session(state, { week: pw - 1, n: 8 }));
  ok(early.every(function (x) { return x.change !== "pas" && x.week <= pw - 1; }), code + ": nada de pasado ni de semanas futuras antes de la semana " + pw);

  // ---- C-test
  var texts = ctx.Letture.EPISODI.filter(function (e) { return e.text; });
  ok(texts.length > 10, code + ": hay lecturas");
  texts.forEach(function (ep) {
    var b = C.build(ep.text, "ctest");
    var ss = C.sentences(ep.text);
    if (ss.length < 3) return;
    ok(b.gaps.length >= 5 && b.gaps.length <= 25, code + " " + ep.id + ": C-test con 5-25 huecos (" + b.gaps.length + ")");
    ok(b.parts[0].gap == null && b.parts[0].t.indexOf(ss[0]) === 0, code + " " + ep.id + ": la primera oración queda entera");
    b.gaps.forEach(function (g) {
      ok(g.shown.length === Math.floor(g.full.length / 2) && g.shown + g.answer === g.full, code + " " + ep.id + ": mitad borrada de «" + g.full + "»");
      ok(C.grade(g, g.answer) === "giusto" && C.grade(g, g.full) === "giusto" && C.grade(g, "") === "sbagliato", code + " " + ep.id + ": corrección de «" + g.full + "»");
    });
    // the drawn text is the source text
    var drawn = b.parts.map(function (p) { return p.gap != null ? b.gaps[p.gap].full : p.t; }).join("");
    ok(ep.text.replace(/\s+/g, " ").indexOf(drawn.replace(/\s+/g, " ").trim()) === 0, code + " " + ep.id + ": el texto con los huecos llenos es el original");
    var cz = C.build(ep.text, "cloze"), D = ctx.ESCRITOS_DATA;
    cz.gaps.forEach(function (g) {
      var w = g.answer.toLowerCase();
      ok(D.conn.indexOf(w) >= 0 || D.prep.indexOf(w) >= 0, code + " " + ep.id + ": el cloze solo borra conectores y preposiciones («" + w + "»)");
    });
    ok(cz.gaps.length <= 15, code + " " + ep.id + ": cloze ≤ 15");
  });
  var sc = C.score([{ answer: "sa", full: "casa", shown: "ca", cat: "ctest" }, { answer: "ma", full: "ma", shown: "", cat: "conector", alt: ["però", "porém"] }], ["sa", "però"]);
  ok(sc.right === 2 && sc.pct === 100, code + ": puntaje y equivalentes");

  // ---- ordenar
  var nOrd = 0;
  texts.concat(ctx.Suoni.dictogloss() ? ctx.Suoni.dictogloss().TESTI : []).forEach(function (ep) {
    var b = O.build(ep.text, { rnd: function () { return 0.37; } });
    if (!b) return;
    nOrd++;
    ok(b.units.length >= 4 && b.shuffled.length === b.units.length - 1 && b.shuffled.indexOf(0) < 0, code + ": ancla fija y el resto para ordenar");
    var right = b.units.map(function (_, i) { return i; }).slice(1);
    ok(O.grade(b.units, right).ok && O.grade(b.units, right).pct === 100, code + ": el orden original puntúa 100");
    ok(!O.grade(b.units, b.shuffled).ok, code + ": el desorden no es el orden");
  });
  ok(nOrd >= 20, code + ": textos para ordenar (" + nOrd + ")");
  ok(ctx.ESCRITOS_DATA.clues.length >= 15, code + ": pistas de cohesión");

  // ---- missions, pausa: only with what was read
  var w5 = course.weeks[4];
  var none = E.missions(w5, { cards: {}, letture: {}, dictogloss: {}, unlocked: 5 });
  ok(none.every(function (m) { return m.opt; }), code + ": misiones opcionales");
  ok(!none.some(function (m) { return m.kind === "esc-huecos"; }), code + ": sin textos leídos no hay huecos");
  var on = none.filter(function (m) { return m.kind === "esc-ordenar"; })[0];
  ok(!on || E.byId(on.arg.split("|")[0]).week < 5, code + ": sin textos leídos, «Ordená» usa uno de una semana anterior, sin leer");
  ok(E.pausaItem({ cards: {}, letture: {}, dictogloss: {} }, 5, function () { return 0.9; }) === null, code + ": pausa sin nada leído ni aprendido: nada");
  var read = { cards: {}, letture: {}, dictogloss: {}, unlocked: 5 };
  ctx.Letture.EPISODI.forEach(function (e) { if (e.week <= 5 && e.text) read.letture[e.id] = { pct: 80, at: 1 }; });
  var ms = E.missions(w5, read);
  ok(!ms.some(function (m) { return m.kind === "esc-huecos"; }) && ms.some(function (m) { return m.kind === "esc-ordenar"; }), code + ": con textos leídos, misión de orden (el C-test ya no es misión)");
  // «Ordená» nunca es el texto de la semana: uno de antes no leído, o leído hace 3 semanas o más
  var allRead = { cards: {}, letture: {}, dictogloss: {}, unlocked: 52, tramo: { asc: {} } };
  ctx.Letture.EPISODI.forEach(function (e) { if (e.text) allRead.letture[e.id] = { pct: 80, at: 1 }; });
  for (var aw = 1; aw <= 52; aw++) { allRead.tramo.asc[aw] = { pct: 90 }; allRead.dictogloss[aw] = { pct: 80 }; }
  course.weeks.forEach(function (w) {
    if (w.boss || w.week < 3) return;
    var mo = E.missions(w, allRead).filter(function (m) { return m.kind === "esc-ordenar"; })[0];
    ok(!!mo, code + " semana " + w.week + ": hay «Ordená»");
    if (!mo) return;
    var src = E.byId(mo.arg.split("|")[0]);
    ok(src.week < w.week && (w.week < 6 || src.week <= w.week - 3), code + " semana " + w.week + ": «Ordená» sobre un texto viejo (semana " + src.week + ")");
  });
  // las piezas de «Ordená» traen sus pistas repartidas: como mucho una sin
  // ninguna (la respuesta a una pregunta tiene la pista en la pregunta)
  var c0 = ctx.ESCRITOS_DATA.clues[0][0];
  ok(!O.spread(["A.", "B.", "C.", c0 + " D."]) && O.spread(["A.", c0 + " B.", "C?", "D."]), code + ": spread()");
  texts.forEach(function (ep) {
    var b = O.build(ep.text);
    if (!b) return;
    ok(O.spread(b.units), code + " " + ep.id + ": pistas repartidas en «Ordená»");
  });
  ok(E.pausaItem(read, 5, function () { return 0.2; }) === null, code + ": la pausa la mitad de las veces no trae nada");
  var got = 0;
  for (var i = 0; i < 40; i++) {
    var it = E.pausaItem(read, 5);
    if (!it) continue;
    got++;
    ok(it.nocard && (it.type === "cloze" || it.type === "tiles" || it.type === "variante"), code + ": ítem de pausa bien formado");
    if (it.type === "cloze") ok(/___/.test(it.stem) && ctx.Engine.grade(it.answer, it) === "giusto", code + ": el hueco de la pausa se corrige («" + it.stem + "»)");
    if (it.type === "tiles") ok(it.tiles.join(" ") !== it.answer && it.tiles.slice().sort().join("|") === it.answer.split(/(?<=[.!?…])\s+/).sort().join("|") || it.tiles.length === 3,
      code + ": tres oraciones desordenadas");
  }
  ok(got > 5, code + ": la pausa trae a veces un ítem de escritura (" + got + "/40)");
  ok(/Escritura guiada/.test(E.treinoHtml(read)), code + ": sección en Treino/Allena");
});

console.log(checks + " controles, " + errors + " errores");
process.exit(errors ? 1 : 0);
