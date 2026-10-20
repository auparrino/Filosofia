/* «Lo que más te cuesta» (banca.js): las rondas de reconocer armadas con
   los puntos flojos del alumno, y sus ítems: «¿qué preposición va?»,
   «¿qué palabra va?» (conectores), «¿cuál está bien?», «¿qué verbo va?»
   (essere/avere, ser/estar), «¿qué pronombre va?» y «¿qué significa
   acá?» (un falso amigo en su oración).
     - cada ítem de preposición tiene la respuesta entre las opciones, una
       sola correcta (sin equivalentes: tra/fra, para/pra), el motor la
       acepta y vuelve igual desde su id (la tarjeta del repaso);
     - sin errores todavía: preposiciones, errores y formas;
     - con un patrón de errores de preposición, la ronda va a eso.
   Run: node tools/lib/test_identificar.js */
"use strict";
var pack = require("./pack.js");
var T = require("./testkit.js")("lib"), ok = T.ok;

pack.LANGS.forEach(function (code) {
  var ctx = pack(code), B = ctx.Banca, D = ctx.ESCRITOS_DATA;
  B.load(pack.data(code, "bank.json"));
  var all = B.prepChoiceSession({ cards: {}, unlocked: 52 }, 1000);
  ok(all.length >= 100, code + ": ítems de preposición (" + all.length + ")");
  all.forEach(function (x) {
    var tag = code + " " + x.id + " «" + x.stem + "»";
    ok(/___/.test(x.stem) && x.options.indexOf(x.answer) >= 0 && x.options.length >= 3, tag + ": hueco y opciones");
    var right = x.options.filter(function (o) { return x.accept.indexOf(o) >= 0; });
    ok(right.length === 1, tag + ": una sola opción correcta (" + x.options.join("/") + ")");
    (D.equiv || []).forEach(function (g) {
      if (g.indexOf(x.answer) >= 0) ok(x.options.filter(function (o) { return g.indexOf(o) >= 0; }).length === 1, tag + ": sin equivalentes entre las opciones");
    });
    ok(ctx.Engine.grade(x.answer, x) === "giusto", tag + ": el motor acepta la respuesta");
    var y = B.item(x.id);
    ok(y && y.answer === x.answer && y.stem === x.stem, tag + ": vuelve igual desde su id");
  });
  // ¿qué palabra va? (conectores) y ¿cuál está bien?
  var cc = B.connChoiceSession({ cards: {}, unlocked: 52 }, 1000), cual = B.whichSession({ cards: {}, unlocked: 52 }, 3000);
  ok(cc.length >= 30 && cual.length >= 300, code + ": conectores " + cc.length + ", ¿cuál está bien? " + cual.length);
  cc.concat(cual).forEach(function (x) {
    var tag = code + " " + x.id;
    var right = x.options.filter(function (o) { return x.accept.indexOf(o) >= 0; });
    ok(right.length === 1 && ctx.Engine.grade(x.answer, x) === "giusto", tag + ": una sola correcta (" + x.options.join(" / ") + ")");
    var y = B.item(x.id);
    ok(y && y.answer === x.answer, tag + ": vuelve igual desde su id");
  });
  ok(cc.every(function (x) { return !/^___.*\?\s*$/.test(x.stem); }), code + ": sin preguntas que abren con la palabra (cuándo)");
  ok(cual.every(function (x) { return x.options.length === 2; }), code + ": ¿cuál está bien?, dos versiones");
  // ¿qué verbo va? (essere/avere, ser/estar), ¿qué pronombre va?, ¿qué significa acá? (falsos amigos)
  var vp = B.verbPairSession({ cards: {}, unlocked: 52 }, 2000), cl = B.cliticSession({ cards: {}, unlocked: 52 }, 2000),
      fa = B.falsoSession({ cards: {}, unlocked: 52 }, 2000);
  ok(vp.length >= 25 && cl.length >= 40 && fa.length >= 25, code + ": verbo " + vp.length + ", pronombre " + cl.length + ", falsos amigos " + fa.length);
  vp.concat(cl, fa).forEach(function (x) {
    var tag = code + " " + x.id + " «" + x.stem + "»";
    var right = x.options.filter(function (o) { return x.accept.indexOf(o) >= 0; });
    ok(x.options.length >= 2 && right.length === 1 && ctx.Engine.grade(x.answer, x) === "giusto", tag + ": una sola correcta (" + x.options.join(" | ") + ")");
    var y = B.item(x.id);
    ok(y && y.answer === x.answer && y.stem === x.stem, tag + ": vuelve igual desde su id");
  });
  var pair = ctx.LANG.rules.banca.verbPair;
  vp.forEach(function (x) {
    ok(!/^___/.test(x.stem) || x.answer[0] === x.answer[0].toUpperCase(), code + " " + x.id + ": mayúscula al empezar");
  });
  ok(!vp.some(function (x) { return /___ (Paulo|Luís)/.test(x.stem); }), code + ": «São Paulo» no es el verbo ser");
  ok(!cl.some(function (x) { return /___ (ser|marcas|casa)\b/.test(x.stem); }), code + ": ni artículos ni la preposición «a» como pronombre");
  ok(!fa.some(function (x) { return /«(di|su|alla|come|mas|da)»/i.test(x.stem); }), code + ": las palabras gramaticales no son falsos amigos");
  ok(fa.every(function (x) { return /«[^»]+»/.test(x.stem); }), code + ": el falso amigo marcado en la oración");
  ok(pair && pair.length === 2, code + ": el par de verbos del paquete");
  var early = B.prepChoiceSession({ cards: {}, unlocked: 3 }, 50);
  ok(early.every(function (x) { return x.lvl === "A1"; }), code + ": al principio, solo oraciones A1");

  var fresh = B.weakSession({ cards: {}, unlocked: 10, errs: {} }, 12);
  ok(fresh.length >= 10, code + ": ronda sin errores todavía (" + fresh.length + ")");
  var kinds = {};
  fresh.forEach(function (x) { kinds[x.id.split(":")[1]] = 1; });
  ok(Object.keys(kinds).length >= 4 && kinds.pc, code + ": mezcla tipos de reconocer (" + Object.keys(kinds).join(",") + ")");
  var cat = code === "it" ? "preposizione" : "preposicion";
  var errs = {}; errs[cat] = { n: 6, last: Date.now() };
  var weak = B.weakSession({ cards: {}, unlocked: 10, errs: errs }, 12);
  ok(weak.filter(function (x) { return x.clinic === cat; }).length >= 5, code + ": con errores de preposición, la ronda va a eso (" +
     weak.filter(function (x) { return x.clinic === cat; }).length + ")");
  var ids = {};
  ok(weak.every(function (x) { var d = !ids[x.id]; ids[x.id] = 1; return d; }), code + ": sin repetidos");
});
T.done("identificar   ");
