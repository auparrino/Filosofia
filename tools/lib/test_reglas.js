/* Un aprendizaje que se adapta (docs/js/reglas.js y lo que usa de engine.js,
   drills.js, banca.js y ubicacion.js), en los dos idiomas: la regla como
   ficha, qué ficha deja cada respuesta, Engine.enqueue y la transferencia,
   el jefe por destreza, la ubicación que siembra el repaso, la xp por
   costo, la escalera de la ronda.
   Run: node tools/lib/test_reglas.js */
"use strict";
var fs = require("fs"), path = require("path");
var pack = require("./pack.js");
var Boot = require(path.join(pack.DOCS, "js", "boot.js"));

var fails = 0, checks = 0;
function ok(cond, what) {
  checks++;
  if (!cond) { fails++; console.log("FAIL " + what); }
}
var DAY = 86400000;

var SRC = fs.readFileSync(path.join(pack.DOCS, "js", "reglas.js"), "utf8");
ok(!/italian|portugu|\bitaliano\b|\bportugués\b/i.test(SRC.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "")),
   "reglas.js no nombra ningún idioma");
ok(Boot.ORDER.some(function (e) { return e.core === "reglas.js"; }), "reglas.js está en ORDER de boot.js");
ok(!/\(\?<[=!]/.test(SRC), "reglas.js sin lookbehind (Safari viejo)");

pack.LANGS.forEach(function (code) {
  var ctx = pack(code);
  var E = ctx.Engine, D = ctx.Drills, R = ctx.Reglas, B = ctx.Banca, U = ctx.Ubicacion;
  var tag = "[" + code + "] ";
  ok(!!R && !!E.enqueue, tag + "cargan Reglas y Engine.enqueue");
  if (!R || !E.enqueue) return;
  var course = pack.data(code, "course.json");
  B.load(pack.data(code, "bank.json"));
  var map = D.itemsById(course);
  var fresh = function (wk) { var s = E.blankSave(); s.unlocked = wk || 1; for (var k = 1; k <= (wk || 1); k++) s.read[k] = 1; return s; };

  /* ---------------------------------------------------- xp por costo */
  var choice = { id: "x", type: "choice", options: ["a", "b"], answer: "a" };
  var cloze = { id: "y", type: "cloze", answer: "a" };
  var phrase = { id: "frase:z", type: "write", answer: "a b c", frase: { it: "a b c" } };
  ok(E.xpFor("giusto", 5, choice) === E.XP.recog, tag + "reconocer paga " + E.XP.recog + " y sin racha");
  ok(E.xpFor("giusto", 0, cloze) === E.XP.written, tag + "escribir paga " + E.XP.written);
  ok(E.xpFor("giusto", 0, cloze, { old: true }) === E.XP.oldRule, tag + "una regla de hace un mes paga " + E.XP.oldRule);
  ok(E.xpFor("giusto", 0, phrase) === E.XP.phrase, tag + "una frase de memoria paga " + E.XP.phrase);
  ok(E.xpFor("giusto", 3, cloze) === E.XP.written + 3 * E.XP.bonusCombo, tag + "la racha de escritos suma");
  ok(E.xpFor("giusto", 3) === E.XP.right + 3 * E.XP.bonusCombo, tag + "sin ítem, como siempre");
  ok(E.xpFor("sbagliato", 3, cloze) === 0, tag + "un error no paga");
  ok(E.xpText(40, 2, true) === 20 + 2 * E.XP.textStruct + E.XP.textClean, tag + "texto libre: por palabra, estructura y limpio");
  ok(E.xpText(1000, 0, false) === E.XP.textMax, tag + "texto libre: con tope");
  var sg = E.blankSave(); sg.goal = 200;
  ok(E.goalValue(200) === 140 && E.goalFor(sg, new Date(2026, 8, 23)) === 140, tag + "la meta diaria se recalibró a la xp por costo (200 → 140)");

  /* ---------------------------------------------------- Engine.enqueue */
  var st = fresh(10), now = Date.now();
  var c1 = E.enqueue(st, "own:test:1", { src: "x", type: "cloze", stem: "a ___", answer: "b" }, { now: now });
  ok(c1 && c1.reps === 0 && c1.due > now && c1.due <= now + 2 * DAY, tag + "enqueue: ficha para mañana");
  ok(st.own["own:test:1"] && st.own["own:test:1"].it.answer === "b", tag + "enqueue: guarda el ítem");
  ok(D.knownId(map, "own:test:1", st), tag + "el repaso conoce la ficha propia");
  var back = D.buildReview(course, st, 5, { map: map }).length === 0;
  ok(back, tag + "hoy no vence (es para mañana)");
  st.cards["own:test:1"].due = now - 1000;
  var rv = D.buildReview(course, st, 5, { map: map });
  ok(rv.some(function (x) { return x.id === "own:test:1" && x.answer === "b"; }), tag + "vencida, el repaso la trae");
  var wid = course.weeks[1].vocab[0][0];
  st.cards["v:" + wid] = { s: 3, d: 5, due: now + 5 * DAY, reps: 1, state: "rev" };
  E.enqueue(st, "v:" + wid, null, { maint: true });
  ok(st.cards["v:" + wid].state === "rev", tag + "enqueue en mantenimiento no pisa una ficha");
  for (var k = 0; k < 230; k++) E.enqueue(st, "own:many:" + k, { type: "cloze", answer: "x" }, { now: now + k });
  ok(Object.keys(st.own).length <= 200, tag + "las fichas propias tienen tope");

  /* ---------------------------------------------------- la regla como ficha */
  var W = 11, w = course.weeks[W - 1];
  var items = w.items.map(function (id) { return map[id]; }).filter(function (it) { return it && it.type !== "listen"; });
  var withRule = items.filter(function (it) { return R.ruleOf(it); });
  ok(withRule.length >= items.length * 0.8, tag + "la mayoría de los ejercicios de la semana tiene regla (" + withRule.length + "/" + items.length + ")");
  ok(withRule.every(function (it) { return R.parse(R.ruleOf(it)).week === it.week; }), tag + "la regla de un ejercicio es de la semana de su lección");
  var it0 = withRule[0], rule0 = R.ruleOf(it0);

  st = fresh(W);
  var t0 = Date.now();
  // a right recognition in the round: no card of its own, a mark and the rule card
  var rec = D.recognitionOf(it0, items, W) || Object.assign({}, it0, { recog: true, type: "choice", options: [it0.answer, "zz"] });
  R.afterAnswer(st, rec, 2, { kind: "round", now: t0 });
  ok(!st.cards[it0.id], tag + "reconocer bien en la ronda no crea ficha");
  ok(!!st.recog[it0.id], tag + "queda anotado como reconocido");
  ok(!!st.cards[rule0], tag + "abre la ficha de la regla");
  ok(D.firstRecognize([it0], st, W)[0].type === it0.type, tag + "la próxima vez viene escrito");
  var due0 = st.cards[rule0].due;
  // a second answer the same day does not move the rule (once a day)…
  R.afterAnswer(st, it0, 2, { kind: "round", now: t0 + 60000 });
  ok(st.cards[rule0].due === due0, tag + "la regla se alimenta una vez por día");
  // …a first miss does
  var other = withRule.filter(function (x) { return R.ruleOf(x) === rule0 && x.id !== it0.id; })[0] || it0;
  R.afterAnswer(st, other, 0, { kind: "round", now: t0 + 120000 });
  ok(st.cards[rule0].reps === 0, tag + "un error del día sí la mueve");
  var formOther = ({ cloze: 1, conjugate: 1, plural: 1, typed: 1 })[other.type] && String(other.answer).split(" ").length < 3;
  ok(formOther ? !st.cards[other.id] : !!st.cards[other.id], tag + "lo fallado entra al repaso (una forma, por la ficha de su regla)");
  var recWrong = D.recognitionOf(withRule[withRule.length - 1], items, W);
  if (recWrong) { R.afterAnswer(st, recWrong, 0, { kind: "round", now: t0 }); ok(!!st.cards[recWrong.id], tag + "un reconocimiento fallado entra como ficha"); }
  // a form written right at first in a round: no card (the rule has it); a sentence: yes
  var form = items.filter(function (x) { return x.type === "cloze" && String(x.answer).split(" ").length === 1 && !st.cards[x.id]; })[0];
  if (form) { R.afterAnswer(st, form, 2, { kind: "round", now: t0 }); ok(!st.cards[form.id], tag + "una forma escrita bien no crea ficha suelta"); }
  var tr = course.items.filter(function (x) { return x.type === "translate" && map[x.id]; })[0];
  if (tr) { R.afterAnswer(st, map[tr.id], 2, { kind: "round", now: t0 }); ok(!!st.cards[tr.id], tag + "una oración escrita bien sí crea ficha"); }

  // the review of a rule: a new sentence, written, with all its grammar taught
  st.cards[rule0].due = Date.now() - 1000;
  var ri = R.reviewItem(rule0, st);
  ok(!!ri && ri.ruleReview && ri.rule === rule0, tag + "la ficha de la regla trae un ejercicio de esa regla");
  ok(ri && !ri.options && ri.type !== "listen", tag + "y es escrito");
  var list = D.buildReview(course, st, 30, { map: map });
  ok(list.some(function (x) { return x.rule === rule0; }), tag + "el repaso la incluye");
  var before = st.cards[rule0].due;
  R.afterAnswer(st, ri, 2, { kind: "review", now: Date.now() + 2 * DAY });
  ok(st.cards[rule0].due > before, tag + "contestarla reprograma la regla");
  ok(!ri.novel || !st.cards[ri.id], tag + "la oración nueva acertada no deja ficha suelta");

  // «Nada antes de su teoría»: every bank sentence a rule brings is taught
  var bad = 0, seen = 0;
  [8, 15, 24, 33].forEach(function (wk) {
    var s2 = fresh(wk);
    course.weeks.slice(0, wk).forEach(function (cw) {
      (cw.lesson ? cw.lesson.blocks : []).forEach(function (b, i) {
        var r = "r:" + cw.week + ":" + i;
        if (!R.known(r)) return;
        for (var n = 0; n < 3; n++) {
          var x = R.reviewItem(r, s2);
          if (!x) continue;
          seen++;
          var m = /^b:(gap|tr):(\d+)$/.exec(x.id);
          if (m && !B.sentenceOk(+m[2], s2, m[1] === "gap" ? "wg" : "w")) bad++;
          if (!m && map[x.id] && (map[x.id].week || 99) > wk) bad++;
        }
      });
    });
  });
  ok(seen > 50 && bad === 0, tag + "ninguna oración de una regla pide gramática posterior (" + bad + " de " + seen + ")");

  // the daily challenge: six written questions of due rules
  var s3 = fresh(20);
  course.weeks.slice(0, 19).forEach(function (cw) {
    (cw.items || []).slice(0, 6).forEach(function (id) { if (map[id]) R.afterAnswer(s3, map[id], 2, { kind: "round", now: Date.now() - 30 * DAY }); });
  });
  var daily = R.dailyItems(s3, 6);
  ok(daily.length === 6, tag + "la sfida del día: seis preguntas");
  ok(daily.every(function (x) { return !x.options && x.type !== "choice"; }), tag + "todas escritas");
  ok(daily.filter(function (x) { return x.ruleReview; }).length >= 3, tag + "de reglas vencidas");
  // Dominala asks rules of a month ago, apart
  var dom = D.buildDomina(course, course.weeks[19], s3, { map: map });
  var olds = dom.filter(function (x) { return x.old; });
  ok(olds.length > 0 && olds.every(function (x) { return R.parse(x.rule).week <= 16; }), tag + "Dominala suma reglas de hace un mes o más (" + olds.length + ")");
  // Scrivi: a structure of the month before, from the package's list
  var S = ctx.Scrivi, sw = 20;
  if (S && S.TASKS[sw]) {
    var ex = R.scriviExtra(s3, sw);
    var uses = S.TASKS[sw].use.filter(function (u) { return u.extra; });
    ok(!!ex && uses.length === 1 && ex[3] <= sw - 4, tag + "Scrivi pide una estructura del mes anterior (semana " + (ex && ex[3]) + ")");
    R.scriviExtra(s3, sw);
    ok(S.TASKS[sw].use.filter(function (u) { return u.extra; }).length === 1, tag + "una sola vez");
    ok(typeof S.check("", sw).reqs.filter(function (q) { return q.id === ex[0]; })[0].n === "number", tag + "la revisión del paquete la cuenta");
  }
  // the coldest cards, by the chance of recall
  var cold = R.coldest(s3, 5, function (id) { return D.knownId(map, id, s3); });
  var rOf = function (id) { var c = s3.cards[id]; return E.retrievability((Date.now() - c.last) / DAY, c.s); };
  ok(cold.length === 5 && cold.every(function (id, i) { return i === 0 || rOf(cold[i - 1]) <= rOf(id) + 1e-9; }), tag + "las fichas más frías, por probabilidad de recuerdo");
  ok(D.buildColdest(course, s3, 10, { map: map }).length === 10, tag + "«cinco minutos para retomar»: diez fichas");

  /* ---------------------------------------------------- la escalera */
  var pool = withRule.filter(function (x) { return R.ruleOf(x) === rule0 && ({ cloze: 1, translate: 1, conjugate: 1, typed: 1 })[x.type]; });
  if (pool.length >= 2) {
    var a = D.recognitionOf(pool[0], items, W), b = D.recognitionOf(pool[1], items, W);
    if (a && b) {
      var round = { items: [a, b], i: 0, week: W };
      ok(R.adaptNext(round, a, 2, true) === "written" && !round.items[1].recog, tag + "reconocer bien y rápido: lo siguiente de la regla, escrito");
      var round2 = { items: [pool[0], pool[1]], i: 0, week: W };
      ok(R.adaptNext(round2, pool[0], 0, false) === "options" && round2.items[1].recog, tag + "un escrito fallado: lo siguiente, con opciones");
    }
  }
  var mix = D.roundMix(w, { weekStats: { 11: { last: [0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0] } } });
  ok(mix.extra < 1, tag + "con la semana floja, menos arrastre");
  ok(D.buildRound(course, w, { map: map, state: fresh(W), size: 8 }).filter(function (x) { return x.type !== "word"; }).length === 8, tag + "buildRound acepta size");

  /* ---------------------------------------------------- el jefe por destreza */
  [13, 26, 39].forEach(function (bw) {
    var sb = fresh(bw), boss = D.buildBoss(course, course.weeks[bw - 1], sb, { map: map });
    var by = {};
    boss.forEach(function (x) { if (!x.novel) by[x.skill || "?"] = (by[x.skill || "?"] || 0) + 1; });
    ok(by.lettura >= 3 && by.ascolto >= 3 && by.produzione >= 12 && by.strutture >= 4 && !by["?"],
       tag + "jefe " + bw + ": lectura, escucha, producción y estructuras " + JSON.stringify(by));
    ok(boss.filter(function (x) { return x.skill === "produzione"; }).every(function (x) { return !x.options; }), tag + "jefe " + bw + ": la producción es escrita");
    ok(boss.filter(function (x) { return x.skill === "ascolto"; }).every(function (x) { return x.type === "listen" && x.nopeek && x.parts && x.parts.length; }),
       tag + "jefe " + bw + ": la escucha no muestra el texto");
    var readEp = (boss.filter(function (x) { return x.skill === "lettura"; })[0] || {}).ep;
    var lw = ctx.Letture.byId(readEp);
    ok(lw && (bw >= 27 ? lw.series === "lunga" : lw.series === "settimana"), tag + "jefe " + bw + ": la lectura es " + (bw >= 27 ? "del tramo" : "de La settimana"));
    var again = D.buildBoss(course, course.weeks[bw - 1], sb, { map: map });
    var ids = {}; boss.forEach(function (x) { if (x.skill === "produzione" || x.skill === "strutture") ids[x.id] = 1; });
    var same = again.filter(function (x) { return ids[x.id]; }).length;
    ok(same <= 4, tag + "jefe " + bw + ": repetido el mismo día, otras preguntas (" + same + " repetidas)");
    ok((again.filter(function (x) { return x.skill === "lettura"; })[0] || {}).ep !== readEp, tag + "jefe " + bw + ": y otra lectura");
    var silent = D.buildBoss(course, course.weeks[bw - 1], fresh(bw), { map: map, silent: true });
    ok(!silent.some(function (x) { return x.skill === "ascolto"; }), tag + "jefe " + bw + ": en silencio, sin escucha");
  });

  /* ---------------------------------------------------- la ubicación */
  if (U && U.apply) {
    var su = E.blankSave();
    U.apply(su, 20, { level: 22, asked: 20, right: 14, failed: [course.weeks[4].items[0]] }, course);
    var seeded = Object.keys(su.cards).filter(function (id) { return su.cards[id].state === "maint"; });
    ok(seeded.some(function (id) { return id.indexOf("v:") === 0; }) && seeded.some(function (id) { return id.indexOf("frase:") === 0; }),
       tag + "la ubicación siembra palabras y frases en mantenimiento (" + seeded.length + ")");
    var fid = course.weeks[4].items[0];
    ok(su.cards[fid] && su.cards[fid].reps === 0 && su.cards[fid].due <= Date.now(), tag + "lo fallado en el test vence ya");
    ok(D.dueList(map, su).filter(function (d) { return d.maint; }).length <= 6, tag + "lo sembrado vuelve de a pocos por día");
    var dg = U.diagnosis(su);
    var cats = {}; dg.forEach(function (x) { cats[x.cat] = 1; });
    ok(dg.length >= 5 && dg.length <= 10 && Object.keys(cats).length === dg.length && dg.every(function (x) { return x.type === "fixerr"; }),
       tag + "mini diagnóstico: una oración por categoría (" + dg.length + ")");
  }

  /* ---------------------------------------------------- transferencia */
  var sl = fresh(12), lw2 = course.weeks[11];
  var steps = ctx.Lezione.steps(lw2.lesson, Math.random, 12);
  var qz = steps.filter(function (x) { return x.kind === "quiz"; })[0].q;
  R.fromLesson(sl, lw2, qz);
  var lid = Object.keys(sl.own).filter(function (id) { return id.indexOf("own:lez:12:") === 0; })[0];
  ok(!!lid && sl.own[lid].it.options.length >= 2, tag + "un chequeo fallado de la lección entra al repaso");
  var t = ctx.Suoni && ctx.Suoni.dgFor(12);
  if (t) {
    var n = R.fromDictogloss(sl, t, { missed: t.chunks.slice(0, 2), found: [] }, 12);
    var dgs = Object.keys(sl.own).filter(function (id) { return id.indexOf("own:dg:") === 0; });
    ok(n === dgs.length && n >= 1 && dgs.every(function (id) { return /___/.test(sl.own[id].it.stem); }), tag + "los bloques del dictogloss vuelven como hueco (" + n + ")");
  }
  if (ctx.CTest) {
    var text = "Questa è la prima frase del testo. Poi arriva la seconda frase con molte parole diverse e lunghe. E la terza chiude tutto quanto il discorso.";
    var built = ctx.CTest.build(text, "ctest");
    var first = ctx.CTest.score(built.gaps, built.gaps.map(function () { return ""; }));
    var nc = R.fromCtest(sl, built, first);
    var cts = Object.keys(sl.own).filter(function (id) { return id.indexOf("own:ct:") === 0; });
    ok(nc >= 1 && cts.every(function (id) { var x = sl.own[id].it; return /___/.test(x.stem) && x.accept.indexOf(x.answer) >= 0; }), tag + "los huecos del C-test vuelven (" + nc + ")");
  }
  var rq = { id: "lettura:w-03:0", src: "lettura", ep: "w-03", type: "choice", prompt: "p", stem: "s", options: ["a", "b"], answer: "a", withText: true };
  R.afterAnswer(sl, rq, 0, { kind: "lettura" });
  ok(!!sl.own["own:lettura:w-03:0"], tag + "una pregunta de lectura fallada vuelve con su texto");
  R.afterAnswer(sl, R.ownItem(sl, "own:lettura:w-03:0"), 0, { kind: "review" });
  ok(!sl.own["own:own:lettura:w-03:0"] && sl.cards["own:lettura:w-03:0"].seen >= 1, tag + "y al repasarla se reprograma (sin copias)");
  sl.errLog = [{ cat: "x", g: "io sono andato", e: "sono andata", at: Date.now(), l: "Concordancia", x: "El participio concuerda." }];
  var cl = B.clinicaSession(sl, 12);
  ok(cl.length && cl[0].type === "card" && /errores de esta semana/.test(cl[0].prompt), tag + "la Clínica abre con tus errores de esta semana");
  ok(cl.some(function (x) { return String(x.id).indexOf("own:") === 0; }), tag + "y mezcla tus ítems propios");

  /* «Palabras de la semana»: a round played to the end leaves words written
     (the mission counts the written ones); before 3.0.2 the first round was
     all recognition and the mission stayed at 0. */
  var wv = course.weeks.filter(function (w) { return (w.vocab || []).length >= 12; })[0];
  var sv = ctx.Engine.blankSave(), rounds = 0;
  function written() { return wv.vocab.filter(function (v) { return (sv.cards["v:" + v[0]] || {}).prod; }).length; }
  while (written() < wv.vocab.length && rounds < 6) {
    rounds++;
    var vs = D.vocabSession(course, wv, sv, 14);
    vs.forEach(function (it) {
      R.afterAnswer(sv, it, 2, { kind: "vocab", produced: !it.recog && it.type !== "choice" && !it.options });
    });
    if (rounds === 1) {
      ok(written() >= 5, tag + "semana " + wv.week + ": la primera ronda de palabras deja palabras escritas (" + written() + ")");
      var fstIdx = {}, ordered = true;
      vs.forEach(function (it, k) { if (it.type === "choice") fstIdx[it.id] = k; else if (it.id in fstIdx === false && !sv.cards[it.id]) ordered = false; });
      ok(ordered && vs.length <= 14, tag + "cada palabra nueva se reconoce antes de escribirse, y la ronda no pasa de 14");
    }
  }
  ok(written() === wv.vocab.length && rounds <= Math.ceil(wv.vocab.length / 7) + 1,
     tag + "semana " + wv.week + ": las " + wv.vocab.length + " palabras escritas en " + rounds + " rondas");
  ok(D.vocabSession(course, wv, ctx.Engine.blankSave(), 2).every(function (it) { return it.type === "choice"; }),
     tag + "dentro de una ronda (2 palabras) las nuevas solo se reconocen");
});

console.log("controles: " + checks + "   errores: " + fails);
process.exit(fails ? 1 : 0);
