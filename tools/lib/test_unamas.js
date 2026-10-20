/* «Ahora vos: una más» (docs/js/unamas.js), en los dos idiomas:
   - solo después de un error de regla: no con un desliz, ni con una palabra
     (GROUPS.lexical), ni con lo que acertó, ni con lo que la Clínica no
     conoce (Errores.clinicCat);
   - solo en las rondas de práctica (ni el jefe, ni el examen, ni Dominala);
   - el ítem nuevo es de la misma regla (Reglas.ruleOf) o, si no hay, de la
     misma categoría (Banca.CURE), con otra respuesta, otro enunciado y otra
     oración (no el hueco y su traducción), nada
     que ya esté en la ronda, escrito, y con su gramática ya enseñada
     (Banca.sentenceOk para el banco; la semana de la regla ≤ la abierta);
   - con errores reales del diagnóstico (Diagnosi.diagnose) sobre los
     ejercicios de las semanas 5-30, casi siempre hay uno para ofrecer;
   - take() lo pone como la pregunta siguiente, una vez por ítem, y no se
     encadena (una más de una más, no);
   - los ganchos de app.js: botón, xp de la cuerda output, sin quitar vidas,
     fuera de las estrellas de la semana y sin la vuelta más fácil.
   Run: node tools/lib/test_unamas.js */
"use strict";
var fs = require("fs"), path = require("path");
var pack = require("./pack.js");
var Boot = require(path.join(pack.DOCS, "js", "boot.js"));
var T = require("./testkit.js")("es"), ok = T.ok;

var SRC = fs.readFileSync(path.join(pack.DOCS, "js", "unamas.js"), "utf8");
var code0 = SRC.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
ok(!/italian|portugu|\bitaliano\b|\bportugués\b/i.test(code0), "unamas.js no nombra ningún idioma");
var ord = Boot.ORDER.map(function (e) { return e.core || e.lang || e.shared; });
ok(ord.indexOf("unamas.js") > ord.indexOf("reglas.js") && ord.indexOf("unamas.js") < ord.indexOf("app.js"),
   "unamas.js en ORDER de boot.js, después de reglas.js");

// the hooks of app.js
var APP = fs.readFileSync(path.join(pack.DOCS, "js", "app.js"), "utf8");
ok(/UnaMas\.offer\(it, \{ q: q, ekind: ekind/.test(APP), "app.js: settle pide «una más» con el tipo de error");
ok(/oneMore \? UnaMas\.button\(\)/.test(APP) && /UnaMas\.take\(round, oneMore\)/.test(APP), "app.js: el botón en la hoja y la pregunta siguiente");
ok(/if \(it\.unamas\) return "output"/.test(APP), "app.js: cuenta como escritura (cuerda output)");
ok(/round\.lives !== Infinity && !it\.unamas/.test(APP), "app.js: no quita vidas");
ok((APP.match(/!it\.ruleReview && !it\.old && !it\.unamas/g) || []).length === 2, "app.js: fuera de las estrellas y de la producción de la semana");
ok(/!it\.retry && !it\.unamas && !\(round\.again/.test(APP), "app.js: la una más no trae su vuelta más fácil");
ok(/UnaMas\.badge\(it\)/.test(APP), "app.js: el enunciado dice «Ahora vos: una más»");

pack.LANGS.forEach(function (code) {
  var L = code + " · ";
  var ctx = pack(code);
  var U = ctx.UnaMas, R = ctx.Reglas, B = ctx.Banca, D = ctx.Drills, E = ctx.Engine, Dg = ctx.Diagnosi;
  ok(!!U && !!R && !!B, L + "cargan UnaMas, Reglas y Banca");
  if (!U) return;
  var course = pack.data(code, "course.json");
  B.load(pack.data(code, "bank.json"));
  var map = D.itemsById(course);      // also Reglas.use(course, map)
  var G = Dg.GROUPS || ctx.LANG.diagGroups || {};
  var lexCat = Object.keys(G.lexical || {})[0];
  var gramCat = Object.keys(B.CURE).filter(function (c) { return !(G.lexical || {})[c] && !(G.slips || {})[c] && B.CURE[c].tags; })[0];
  ok(!!gramCat, L + "hay una categoría de gramática con remedio en el banco (" + gramCat + ")");

  /* ------------------------------------------------ cuándo se ofrece */
  ok(!U.isRule({ q: 2, ekind: null }), L + "lo acertado, no");
  ok(!U.isRule({ q: 1, ekind: "slip" }), L + "un desliz, no");
  ok(!U.isRule({ q: 0, ekind: "vocab", dg: { cat: lexCat } }), L + "una palabra, no (" + lexCat + ")");
  ok(!U.isRule({ q: 0, ekind: "rule", dg: { cat: lexCat } }), L + "una categoría de vocabulario, aunque venga como regla, no");
  ok(!U.isRule({ q: 0, ekind: "rule", dg: { cat: "x", slip: true } }), L + "un diagnóstico de desliz, no");
  ok(!U.isRule({ q: 0, ekind: "rule", dg: { cat: "grammatica" } }), L + "lo que la Clínica no conoce (grammatica de LanguageTool), no");
  ok(U.isRule({ q: 0, ekind: "rule", dg: { cat: gramCat } }), L + "un error de regla (" + gramCat + "), sí");
  ok(U.isRule({ q: 1, ekind: null, dg: { cat: gramCat } }), L + "un casi con categoría de gramática, sí");

  var fresh = function (wk) { var s = E.blankSave(); s.unlocked = wk; for (var k = 1; k <= wk; k++) s.read[k] = 1; return s; };

  /* ------------------------------------------ con errores reales del curso */
  var tried = 0, offered = 0, bySrc = { banco: 0, curso: 0, categoria: 0 }, bad = [];
  for (var wk = 5; wk <= 30; wk++) {
    var w = course.weeks[wk - 1];
    if (w.boss) continue;
    var st = fresh(wk);
    (w.items || []).forEach(function (id) {
      var it = map[id];
      if (!it || !R.ruleOf(it) || !U.written(it) || it.type === "write") return;
      // a wrong answer: the answer with the last letter changed (a form
      // of another person, gender or number), diagnosed as the app does
      var ans = String(it.answer || "");
      if (!/[aeio]$/.test(ans) || ans.split(/\s+/).length > 3) return;
      var given = ans.slice(0, -1) + (/a$/.test(ans) ? "o" : "a");
      var dg = null;
      try { dg = Dg.diagnose(given, [ans].concat(it.accept || []), { stem: it.stem }); } catch (e) { dg = null; }
      if (!dg || dg.verdict === E.VERDICT.RIGHT) return;
      var q = dg.verdict === E.VERDICT.CLOSE ? 1 : 0;
      var ekind = q === 1 && dg.slip ? "slip" : q === 0 && (G.lexical || {})[dg.cat] ? "vocab" : q === 0 ? "rule" : null;
      if (!U.isRule({ q: q, ekind: ekind, dg: dg })) return;
      tried++;
      var round = { kind: "round", items: [it], i: 0, log: [] };
      var nw = U.offer(it, { q: q, ekind: ekind, dg: dg, kind: "round", state: st, round: round, map: map, course: course });
      if (!nw) return;
      offered++;
      bySrc[nw.unamasSrc]++;
      var why = [];
      if (!nw.unamas || nw.unamasOf !== it.id) why.push("sin marca");
      if (nw.id === it.id) why.push("el mismo ítem");
      if (E.normalise(nw.answer) === E.normalise(it.answer)) why.push("la misma respuesta");
      if (nw.stem && it.stem && E.normalise(nw.stem) === E.normalise(it.stem)) why.push("el mismo enunciado");
      if (U.same(U.sentenceOf(it), U.sentenceOf(nw))) why.push("la misma oración con otra consigna");
      if (!U.written(nw)) why.push("no es escrito");
      if (nw.retry) why.push("viene como vuelta");
      if (nw.unamasSrc !== "categoria" && R.ruleOf(nw) !== R.ruleOf(it)) why.push("otra regla: " + R.ruleOf(nw));
      var m = /^b:(gap|tr|err):(\d+)$/.exec(nw.id);
      if (m && m[1] !== "err" && !B.sentenceOk(+m[2], st, m[1] === "gap" ? "wg" : "w")) why.push("gramática no enseñada todavía");
      if (map[nw.id] && map[nw.id].week > wk) why.push("de una semana que no llegó");
      if (!nw.unamasH) why.push("sin el nombre de la regla");
      if (why.length) bad.push("semana " + wk + " " + it.id + " → " + nw.id + ": " + why.join(", "));
    });
  }
  ok(tried >= 40, L + "errores de regla probados: " + tried);
  ok(offered >= tried * 0.6, L + "casi siempre hay una más: " + offered + " de " + tried + " (banco " + bySrc.banco + ", curso " + bySrc.curso + ", categoría " + bySrc.categoria + ")");
  ok(bySrc.banco > 0 && bySrc.curso > 0, L + "sale del banco y del bloque de la lección");
  ok(!bad.length, L + "los ítems ofrecidos cumplen todo" + (bad.length ? ":\n  " + bad.slice(0, 8).join("\n  ") : ""));

  /* ------------------------------------------------------ en la ronda */
  var st2 = fresh(20), sample = null, sdg = null;
  for (var w2 = 11; w2 <= 20 && !sample; w2++) {
    (course.weeks[w2 - 1].items || []).some(function (id) {
      var it = map[id];
      if (!it || !R.ruleOf(it) || !U.written(it)) return false;
      var o = U.offer(it, { q: 0, ekind: "rule", dg: { cat: gramCat }, kind: "round", state: st2, round: { items: [it], i: 0, log: [] }, map: map, course: course });
      if (o) { sample = it; sdg = { cat: gramCat }; }
      return !!o;
    });
  }
  ok(!!sample, L + "hay un ítem de ejemplo para la ronda");
  if (sample) {
    var other = map[course.weeks[10].items[0]];
    var round2 = { kind: "round", items: [other, sample, other], i: 1, log: [{ id: other.id }] };
    var c = { q: 0, ekind: "rule", dg: sdg, state: st2, round: round2, map: map, course: course };
    ["boss", "esame", "domina", "lettura", "suoni", "scene"].forEach(function (k) {
      ok(U.offer(sample, Object.assign({}, c, { kind: k })) === null, L + "en la ronda «" + k + "», no");
    });
    ok(U.offer(sample, Object.assign({}, c, { kind: "round", q: 2 })) === null, L + "acertado, no");
    var nw2 = U.offer(sample, Object.assign({}, c, { kind: "round" }));
    ok(nw2 && nw2.id !== other.id, L + "nada que ya esté en la ronda");
    ok(U.offer(nw2, Object.assign({}, c, { kind: "round" })) === null, L + "no se encadena: una más de una más, no");
    ok(U.take(round2, nw2) && round2.items[2] === nw2 && round2.items.length === 4, L + "take: la pregunta siguiente");
    ok(U.offer(sample, Object.assign({}, c, { kind: "round" })) === null, L + "una vez por ítem y por ronda");
    ok(/id="unamas"/.test(U.button()) && /Ahora vos: una más/.test(U.button()), L + "el botón de la hoja");
    ok(/Ahora vos: una más/.test(U.badge(nw2)) && U.badge(sample) === "", L + "el enunciado lo dice, solo en la una más");
    // xp: a written item is written practice
    ok(E.xpFor("giusto", 0, nw2) === E.XP.written || E.xpFor("giusto", 0, nw2) === E.XP.phrase, L + "paga como escritura: " + E.xpFor("giusto", 0, nw2));
    // what it leaves: the rule card is not fed twice the same day
    var st3 = fresh(20), rule = R.ruleOf(sample);
    R.afterAnswer(st3, sample, 0, { kind: "round", ekind: "rule", produced: true });
    var due1 = st3.cards[rule] && st3.cards[rule].due;
    R.afterAnswer(st3, nw2, 2, { kind: "round", produced: true });
    ok(!!due1 && st3.cards[rule].due === due1, L + "acertar la una más no reprograma la ficha de la regla ese mismo día");
  }
});

T.done();
