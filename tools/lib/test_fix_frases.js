/* «Adiviná», Treino y frases, en los dos idiomas:
   - las trampas del «Adiviná» solo usan la gramática de la semana de la
     escena y nunca son otra frase entera (2 o 3 opciones, o ninguna);
   - cada opción equivocada tiene una explicación (diagnóstico del idioma o
     lo que cambia la opción);
   - después del «Adiviná» va la tarjeta «Frase nueva» de la misma frase, y
     una frase nueva no se pide escrita de memoria en su primera sesión;
   - las fórmulas fijas (gramática de una semana posterior) tienen su línea
     «🧱» y vuelven en la lección de su semana («Ya lo venías usando»);
   - formule_data.js está al día con tools/lib/formule.py.
   Run: node tools/lib/test_fix_frases.js */
"use strict";
var path = require("path");
var cp = require("child_process");
var pack = require("./pack.js");

var fails = 0, checks = 0;
function ok(cond, what) {
  checks++;
  if (!cond) { fails++; console.log("FAIL " + what); }
}

// a seeded random, so a failure can be reproduced
function seeded(n) {
  return function () { n = (n * 1103515245 + 12345) % 2147483648; return n / 2147483648; };
}

var RECOGNISE = { tiles: 1, listen: 1 };
var PRODUCE = { write: 1, cloze: 1, dictation: 1, flash: 1 };

// What each language does in the traps before the week that teaches it.
var EARLY = {
  // week < 3: the article swapped (il → lo) or the contraction undone (al → a il)
  it: { week: 3, re: /\b(a il|di il|in il|da il|su il|a la|di la|in la|a i|di i|in i|a le|di le)\b/ },
  // week < 3: em o, de a, por o…; el / la / los / las in place of the article
  pt: { week: 3, re: /\b(en el|en la|en las|del|de la|de los|de las|al|a los|a la|a las|por el|por la|en un|en una)\b/ }
};

pack.LANGS.forEach(function (code) {
  var ctx = pack(code, { upTo: "desglose.js" });
  var Frasi = ctx.Frasi, Formule = ctx.Formule, Drills = ctx.Drills, Lezione = ctx.Lezione;
  ctx.Banca.load(pack.data(code, "bank.json"));
  var D = ctx.Diagnosi;
  var UNREC = (D.GROUPS && D.GROUPS.unrecorded) || (ctx.LANG.diagGroups || {}).unrecorded || {};
  var ALLTEXT = {};
  Frasi.ALL.forEach(function (f) { ALLTEXT[f.it] = true; });

  /* ------------------------------------------------ (b) las trampas */

  var none = 0, two = 0, total = 0;
  Frasi.ALL.forEach(function (f, n) {
    for (var r = 0; r < 3; r++) {
      var g = Frasi.guessItem(f, seeded(n * 7 + r + 1));
      total++;
      if (!g) { none++; continue; }
      if (g.options.length === 2) two++;
      ok(g.options.length >= 2 && g.options.length <= 3 && g.options.indexOf(f.it) >= 0 &&
         new Set(g.options).size === g.options.length, code + " adiviná: opciones " + f.id);
      g.options.forEach(function (o) {
        if (o === f.it) return;
        // never another phrase: not a phrase of the bank, and the same phrase
        // (the same number of words, or the same words in another order)
        ok(!ALLTEXT[o], code + " adiviná: otra frase como opción: " + f.id + " «" + o + "»");
        var same = Frasi.words(o).slice().sort().join(" ") === Frasi.words(f.it).slice().sort().join(" ");
        ok(g.why[o] === "order" ? same : o.split(" ").length === f.it.split(" ").length ||
           Math.abs(o.split(" ").length - f.it.split(" ").length) <= 1,
           code + " adiviná: la opción no es la misma frase: " + f.id + " «" + o + "»");
        // only the grammar of the scene's week
        if ((f.week || 1) < EARLY[code].week) {
          var bad = EARLY[code].re.exec(o.toLowerCase()), was = EARLY[code].re.exec(f.it.toLowerCase());
          ok(!bad || (was && was[0] === bad[0]), code + " adiviná: trampa de una semana posterior: " + f.id + " «" + o + "»");
        }
        // (c) always something to say about that option
        var d = g.why[o] ? null : D.explainChoice(o, f.it, {});
        var said = (d && d.cat && d.explain && !UNREC[d.cat]) || Frasi.explainOption(o, g);
        ok(!!said, code + " adiviná: opción sin explicación: " + f.id + " «" + o + "»");
      });
    }
  });
  ok(none <= total * 0.07, code + " adiviná: frases sin ningún error posible: " + none + "/" + total);
  ok(two <= total * 0.15, code + " adiviná: con dos opciones: " + two + "/" + total);

  // the week reaches the traps: fewer (or the same) traps in week 1 than in 52
  var fewer = 0;
  Frasi.ALL.filter(function (f) { return f.week >= 3; }).slice(0, 60).forEach(function (f) {
    var a = Frasi.traps(f.it, seeded(3), 1), b = Frasi.traps(f.it, seeded(3), 52);
    ok(a.every(function (t) { return b.indexOf(t) >= 0; }), code + " traps: la semana 1 inventa trampas: " + f.id);
    if (a.length < b.length) fewer++;
  });
  ok(fewer > 0, code + " traps: la semana no cambia nada");

  // explainOption: the order, a word changed
  var e1 = Frasi.explainOption("B A c", { answer: "A B c", why: { "B A c": "order" } });
  ok(/orden/.test(e1) && /\*a b\*/.test(e1), code + " explainOption: el orden: " + e1);
  var e2 = Frasi.explainOption("Mesa para dos.", { answer: "Mesa para dois." });
  ok(e2 === "Tu opción dice *dos* donde va *dois*.", code + " explainOption: la palabra: " + e2);

  /* --------------------------- (d) «Adiviná» → «Frase nueva» → reconocer */

  Frasi.SCENES.forEach(function (s) {
    for (var r = 0; r < 3; r++) {
      var sess = Frasi.sceneSession(s.id, {}, { silent: r === 2 });
      var met = {}, recognised = {};
      sess.forEach(function (it, k) {
        if (it.type === "guess") {
          var nx = sess[k + 1];
          ok(nx && nx.type === "intro" && nx.id === it.id && nx.afterGuess,
             code + " después del «Adiviná» va su tarjeta: " + s.id);
        }
        if (it.type === "intro") { met[it.id] = true; return; }
        if (it.type === "guess") return;
        ok(met[it.id], code + " una frase nueva se practica antes de su tarjeta: " + it.id);
        if (PRODUCE[it.type]) ok(false, code + " frase nueva pedida de memoria en su primera sesión: " + it.id + " (" + it.type + ")");
        if (RECOGNISE[it.type]) recognised[it.id] = true;
      });
      ok(Object.keys(met).length === 6 && Object.keys(met).every(function (id) { return recognised[id]; }),
         code + " cada frase nueva se reconoce en la sesión: " + s.id);
    }
  });
  // the coffee break: the new phrase is recognised too
  var fresh = Frasi.pickItem(Frasi.ALL[0], { fresh: true });
  ok(RECOGNISE[fresh.type], code + " pickItem fresh: reconocer");
  for (var i = 0; i < 20; i++) ok(Frasi.pickItem(Frasi.ALL[i], { fresh: true, silent: true }).type === "tiles", code + " fresh + silencio: fichas");

  /* ------------------------------------------------- (a) Treino y semanas */

  Frasi.SCENES.forEach(function (s) {
    ok(Drills.sceneWeek(s.id) === s.week, code + " sceneWeek = semana de la escena: " + s.id);
  });
  ok(Frasi.openScenes(1).every(function (s) { return Drills.sceneWeek(s.id) <= 1; }), code + " semana 1: solo escenas abiertas");

  /* --------------------------------------------------- (e) fórmulas fijas */

  ok(Formule && Object.keys(Formule.DATA).length >= 20, code + " formule_data cargado: " + (Formule ? Object.keys(Formule.DATA).length : 0));
  Object.keys(Formule.DATA).forEach(function (id) {
    var f = Frasi.BY_ID[id];
    ok(!!f, code + " fórmula de una frase que no existe: " + id);
    if (!f) return;
    var e = Formule.of(f);
    ok(e.length && e.every(function (x) { return x[0] > f.week && x[0] <= 52 && x[1]; }), code + " fórmula: semana posterior: " + id);
    var l = Formule.line(f, f.week);
    ok(/^🧱 Fórmula fija/.test(l) && l.indexOf("semana " + e[0][0]) >= 0, code + " línea de la fórmula: " + id + " " + l);
    ok(/ya viste/.test(Formule.line(f, 52)), code + " fórmula ya enseñada: " + id);
    e.forEach(function (x) {
      ok(f.it.toLowerCase().indexOf(x[1].split(", ")[0]) >= 0, code + " la forma está en la frase: " + id + " «" + x[1] + "»");
      ok(Formule.bridge(x[0], {}, 99).some(function (b) { return b.f.id === id; }), code + " «Ya lo venías usando» la trae: " + id);
    });
  });
  ok(Formule.line(Frasi.ALL.filter(function (f) { return !Formule.DATA[f.id]; })[0], 1) === "", code + " sin fórmula, sin línea");

  // the lesson of the week: the step right after the intro, the seen ones first
  var course = pack.data(code, "course.json");
  var weeks = {};
  Object.keys(Formule.DATA).forEach(function (id) { Formule.DATA[id].forEach(function (x) { weeks[x[0]] = true; }); });
  Object.keys(weeks).forEach(function (wk) {
    wk = +wk;
    var w = course.weeks[wk - 1];
    if (!w || !w.lesson) return;
    var st = Lezione.steps(w.lesson, seeded(wk), wk, null, null);
    var n = st.length;
    Formule.addStep(st, wk, {});
    ok(st.length === n + 1 && st[1].kind === "formule" && st[1].ids.length >= 1, code + " lección " + wk + ": paso «Ya lo venías usando»");
  });
  var some = Object.keys(Formule.DATA)[0], swk = Formule.DATA[some][0][0], cards = {};
  cards[some] = { due: 1 };
  var br = Formule.bridge(swk, cards);
  ok(br[0].f.id === some && br[0].seen, code + " «Ya lo venías usando»: primero las ya vistas");
  var part = [{ kind: "look", i: 0 }];
  Formule.addStep(part, swk, {});
  ok(part.length === 1, code + " sin intro (segunda parte de la lección): sin paso");
});

// known cases of the audits
(function () {

  var itc = pack("it", { upTo: "desglose.js" }), ptc = pack("pt", { upTo: "desglose.js" });
  var find = function (c, t) { return c.Frasi.ALL.filter(function (f) { return f.it === t; })[0]; };
  var hc = find(itc, "Scusa, non ho capito.");
  ok(hc && itc.Formule.of(hc).some(function (x) { return x[0] === 11 && /ho capito/.test(x[1]); }), "it: ho capito → semana 11");
  var ne = find(ptc, "Desculpa, não entendi.");
  ok(ne && ptc.Formule.of(ne).some(function (x) { return x[0] === 11 && /entendi/.test(x[1]); }), "pt: entendi → semana 11");
  var ap = find(ptc, "Estou aprendendo português.");
  ok(ap && ptc.Formule.of(ap).some(function (x) { return x[0] === 8; }), "pt: aprendendo → semana 8");
  // nouns and adjectives are not verbs: um beijo, a conta, batata frita
  ["Tchau, um beijo!", "A conta, por favor.", "Uma porção de batata frita."].forEach(function (t) {
    var f = find(ptc, t);
    ok(f && !ptc.Formule.DATA[f.id], "pt: no es fórmula: " + t);
  });
  // «mi puoi» is an object pronoun, not a reflexive (week 12)
  var mp = find(itc, "Mi puoi correggere se sbaglio?");
  ok(mp && !itc.Formule.of(mp).some(function (x) { return x[0] === 12; }), "it: mi puoi no es reflexivo");

})();

// formule_data.js up to date with the phrases and the syllabus
(function () {
  var r = cp.spawnSync("python3", [path.join(__dirname, "formule.py"), "--check"], { encoding: "utf8" });
  ok(r.status === 0, "formule_data.js al día: " + (r.stdout || "") + (r.stderr || ""));
})();

console.log("controles: " + checks + "   errores: " + fails);
process.exit(fails ? 1 : 0);
