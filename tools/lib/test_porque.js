/* «📖 ¿Por qué?» y «🧐 ¿Qué tenía de malo?» (docs/js/porque.js), en los dos
   idiomas: cada ejercicio encuentra su bloque de teoría y la pregunta de
   autoexplicación está bien armada. */
"use strict";
var pack = require("./pack.js");
var n = 0, bad = 0;
function ok(c, m) { n++; if (!c) { bad++; console.log("FAIL " + m); } }

var seed = 11;
function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }

// Hand-checked cases: [kind, item, week, block] (block null: any block of that week).
var CASES = {
  it: [
    ["err", { id: "b:err:x", src: "banca", bank: "err", type: "fixerr", stem: "Mia nona fa i biscotti.", answer: "Mia nonna fa i biscotti.",
              bad: "nona", good: "nonna", cat: "doppie" }, 1, 2],
    ["forme", { id: "b:prep:x", src: "banca", bank: "forme", type: "typed", prompt: "Uní la preposición con el artículo",
                stem: "(di + la) nota → ___ nota", answer: "della" }, 3, 11],
    ["forme", { id: "b:pl:x", src: "banca", bank: "forme", type: "typed", prompt: "Escribí el plural",
                stem: "il collega → i ___", answer: "colleghi" }, 2, 1]
  ],
  pt: [
    ["forme", { id: "b:pl:x", src: "banca", bank: "forme", type: "typed", prompt: "Escribí el plural",
                stem: "o violão → os ___", answer: "violões" }, 2, 1],
    ["err", { id: "b:err:x", src: "banca", bank: "err", type: "fixerr", stem: "O Rio é mucho bonito.", answer: "O Rio é muito bonito.",
              bad: "mucho", good: "muito", cat: "muito" }, 4, 4],
    ["forme", { id: "b:prep:x", src: "banca", bank: "forme", type: "typed", prompt: "Uní la preposición con el artículo",
                stem: "(por + as) gramáticas → ___ gramáticas", answer: "pelas" }, 3, 4]
  ]
};
// The gym: the tense → the week that teaches it.
var GYM = {
  it: [["parlare", "presente", 5], ["parlare", "passatoProssimo", 11], ["parlare", "imperfetto", 15],
       ["parlare", "futuro", 19], ["parlare", "congiuntivo", 24], ["essere", "futuroAnteriore", 19]],
  pt: [["falar", "presente", 5], ["falar", "perfeito", 11], ["falar", "imperfeito", 15],
       ["falar", "futuro", 17], ["fazer", "futuroComposto", 30]]
};

pack.LANGS.forEach(function (code) {
  var c = pack(code), course = pack.data(code, "course.json"), bank = pack.data(code, "bank.json");
  c.Banca.load(bank);
  var P = c.Porque, D = c.Diagnosi, PD = c.PORQUE_DATA;
  ok(P && PD, code + ": porque.js y porque_data.js cargados");
  if (!P || !PD) return;
  P._reset();

  /* ---- los datos del idioma */
  var G = (c.LANG.diagGroups || {}), generic = G.generic || {}, unrec = G.unrecorded || {};
  Object.keys(D.LABEL).forEach(function (k) {
    if (generic[k] || unrec[k] || k === "grammatica" || k === "ia" || k === "vuoto" || k === "soggetto" ||
        k === "piacere" || k === "comparativo" || k === "lexico") return;
    ok(PD.why[k], code + ": falta la explicación de la categoría «" + k + "»");
  });
  Object.keys(PD.why).forEach(function (k) {
    ok(D.LABEL[k], code + ": «" + k + "» no es una categoría de diagnosi.js");
    ok(!/\b(vos|tú)\b/.test("") && PD.why[k].length < 120, code + ": explicación larga: " + k);
  });
  Object.keys(PD.near).forEach(function (k) {
    PD.near[k].forEach(function (x) { ok(PD.why[x] && x !== k, code + ": near." + k + " → «" + x + "» sin explicación"); });
  });
  Object.keys(PD.weeks).forEach(function (k) {
    var wk = [].concat(PD.weeks[k]), w = course.weeks[wk[0] - 1];
    if (wk.length > 1) ok(w && w.lesson.blocks[wk[1]], code + ": weeks." + k + " apunta a un bloque que no existe");
    ok(w && w.lesson && w.lesson.blocks.length, code + ": weeks." + k + " apunta a una semana sin teoría");
  });

  /* ---- 1. cada ejercicio del curso: el bloque de su parte */
  var itemMap = {}, wkOf = {};
  course.items.forEach(function (it) { itemMap[it.id] = it; });
  course.weeks.forEach(function (w) { (w.items || []).forEach(function (id) { if (!wkOf[id]) wkOf[id] = w.week; }); });
  var total = 0, got = 0, inPart = 0, sure = 0;
  course.weeks.forEach(function (w) {
    if (!w.lesson) return;
    (w.parts || [{ blocks: w.lesson.blocks.map(function (_, i) { return i; }), items: w.items }]).forEach(function (p) {
      p.items.forEach(function (id) {
        var it = itemMap[id];
        if (!it || it.topic === "esame") return;
        total++;
        var b = P.blockFor(it, { course: course, week: w.week, unlocked: w.week });
        if (!b) return;
        got++;
        if (b.week === w.week && p.blocks.indexOf(b.i) >= 0) inPart++;
        if (b.sure) sure++;
      });
    });
  });
  ok(total > 1000, code + ": ejercicios del curso: " + total);
  ok(got === total, code + ": ejercicios del curso sin bloque: " + (total - got));
  ok(inPart === got, code + ": bloques fuera de la parte del ejercicio: " + (got - inPart));
  console.log(code + ": curso " + got + "/" + total + " con bloque (" + Math.round(sure / total * 100) + " % seguros)");

  /* ---- 2. el banco */
  var state = { cards: {}, unlocked: 52, weekStats: {}, totals: {} };
  var bt = 0, bg = 0, seen = {};
  for (var k = 0; k < 20; k++) {
    ["gapSession", "errorSession", "formsSession", "translateSession"].forEach(function (f) {
      c.Banca[f](state, 12).forEach(function (it) {
        if (seen[it.id]) return;
        seen[it.id] = 1;
        bt++;
        var b = P.blockFor(it, { course: course, week: 52, unlocked: 52 });
        if (b) {
          bg++;
          var blk = course.weeks[b.week - 1].lesson.blocks[b.i];
          ok(!!blk, code + ": bloque inexistente " + b.week + ":" + b.i);
        }
      });
    });
  }
  ok(bg / bt >= 0.85, code + ": banco con bloque: " + bg + "/" + bt);
  console.log(code + ": banco " + bg + "/" + bt + " con bloque");
  // the vocabulary is not grammar: no button
  var voc = c.Banca.vocabSession(state, 5)[0];
  ok(!voc || !P.blockFor(voc, { course: course, unlocked: 52 }), code + ": una palabra del banco no tiene bloque de teoría");

  /* ---- 3. el gimnasio */
  GYM[code].forEach(function (g) {
    var it = c.Drills.conjugationTyped(g[0], g[1], code === "pt" ? [0, 1, 2, 3, 5] : [0, 1, 2, 3, 4, 5]);
    var b = P.blockFor(it, { course: course, week: g[2], unlocked: g[2] });
    ok(b && b.week === g[2], code + ": gimnasio " + g[1] + " → semana " + (b && b.week) + ", quería " + g[2]);
  });
  var gt = 0, gg = 0;
  course.weeks.forEach(function (w) {
    (w.tenses || []).forEach(function (t) {
      (w.verbs || []).slice(0, 2).forEach(function (v) {
        var it;
        try { it = c.Drills.conjugationDrill(v, t, w.known, w.persons); } catch (e) { return; }
        gt++;
        var b = P.blockFor(it, { course: course, week: w.week, unlocked: w.week });
        if (b) gg++;
      });
    });
  });
  ok(gg === gt, code + ": gimnasio con bloque: " + gg + "/" + gt);

  /* ---- 4. las frases: solo cuando hay un bloque que de verdad la explica */
  var ft = 0, fg = 0;
  c.Frasi.ALL.forEach(function (f) {
    var it = c.Frasi.pickItem(f, {});
    ft++;
    if (P.blockFor(it, { course: course, week: 52, unlocked: 52 })) fg++;
  });
  ok(fg / ft >= 0.5, code + ": frases con bloque: " + fg + "/" + ft);
  console.log(code + ": frases " + fg + "/" + ft + " con bloque");

  /* ---- casos a mano */
  CASES[code].forEach(function (cs) {
    var b = P.blockFor(cs[1], { course: course, week: 30, unlocked: 30 });
    ok(b && b.week === cs[2] && (cs[3] == null || b.i === cs[3]),
       code + ": " + cs[0] + " «" + (cs[1].stem || "") + "» → " + (b ? b.week + ":" + b.i + " " + b.h : "nada") + ", quería " + cs[2] + ":" + cs[3]);
  });
  ok(!P.blockFor({ id: "x", type: "intro", src: "frasi" }, { course: course }), code + ": una presentación no tiene «¿Por qué?»");
  ok(!P.blockFor({ id: "l", type: "choice", src: "lettura", options: ["a", "b"], answer: "a" }, { course: course }), code + ": una lectura no tiene «¿Por qué?»");

  /* ---- «¿Qué tenía de malo?» */
  var pool = course.items.filter(function (it) { return P.optionsInLanguage(it); });
  course.weeks.slice(0, 30).forEach(function (w) {
    (w.verbs || []).slice(0, 2).forEach(function (v) {
      (w.tenses || []).forEach(function (t) {
        try { pool.push(c.Drills.conjugationDrill(v, t, w.known, w.persons)); } catch (e) { /* */ }
      });
    });
  });
  c.Frasi.ALL.forEach(function (f) {
    var g = c.Frasi.guessItem ? c.Frasi.guessItem(f) : null;
    if (g) pool.push(g);
  });
  var asked = 0, byCat = {};
  pool.forEach(function (it) {
    var qz = P.quiz(it, { rnd: rnd });
    if (!qz) return;
    asked++;
    byCat[qz.cat] = (byCat[qz.cat] || 0) + 1;
    ok(qz.choices.length === 3, code + ": tres explicaciones: " + it.id);
    ok(qz.choices.filter(function (x) { return x.ok; }).length === 1, code + ": una sola explicación verdadera: " + it.id);
    var texts = qz.choices.map(function (x) { return x.text; });
    ok(texts[0] !== texts[1] && texts[1] !== texts[2] && texts[0] !== texts[2], code + ": explicaciones repetidas: " + it.id);
    ok(qz.opt !== it.answer && it.options.indexOf(qz.opt) >= 0, code + ": la opción preguntada es una de las falsas: " + it.id);
    var cd = it.choiceDiag || { before: "", after: "" };
    var d = D.explainChoice(cd.before + qz.opt + cd.after, cd.before + it.answer + cd.after,
      it.choiceDiag ? {} : { stem: it.stem, nominal: it.type === "plural" || /plural/i.test(it.prompt || "") });
    ok(d && d.cat === qz.cat, code + ": la explicación verdadera es la del diagnóstico: " + it.id);
    qz.choices.forEach(function (x) {
      if (!x.ok) ok((d.all || []).indexOf(x.cat) < 0, code + ": una explicación «falsa» también es cierta: " + it.id + " " + x.cat);
    });
    ok(qz.explain && qz.explain.length > 5, code + ": la devolución explica: " + it.id);
  });
  ok(asked >= 300, code + ": preguntas de autoexplicación posibles: " + asked + " de " + pool.length);
  console.log(code + ": «¿Qué tenía de malo?» en " + asked + " de " + pool.length + " ítems de opción múltiple · " +
    Object.keys(byCat).sort(function (a, b) { return byCat[b] - byCat[a]; }).slice(0, 8).map(function (k) { return k + " " + byCat[k]; }).join(", "));
  // Spanish glosses as options («¿Qué significa?») are never asked.
  ok(!P.quiz({ id: "b:voc:x", src: "banca", bank: "voc", type: "choice", options: ["plata", "oro", "hielo"], answer: "plata" }),
     code + ": opciones en castellano no se preguntan");

  /* ---- cuántas veces se pregunta y qué queda registrado */
  var st = {}, yes = 0, N = 20000, run = 0, maxRun = 0, last = true;
  for (var i = 0; i < N; i++) {
    var a = P.shouldAsk(st, rnd);
    if (a) { yes++; ok(!last, code + ": dos preguntas seguidas"); run = 0; } else { run++; maxRun = Math.max(maxRun, run); }
    last = a;
    if (!a) last = false;
  }
  var rate = yes / N;
  ok(rate >= 0.19 && rate <= 0.26, code + ": se pregunta 1 de cada 4-5: " + rate.toFixed(3));
  ok(maxRun <= 6, code + ": nunca más de seis sin preguntar: " + maxRun);
  var s2 = {}, it0 = { id: "t1" }, qz0 = { cat: Object.keys(PD.why)[0] };
  var x1 = P.record(s2, it0, qz0, true), x2 = P.record(s2, it0, qz0, false);
  ok(x1 === P.XP.right && x2 === P.XP.wrong && x1 > x2 && x2 > 0, code + ": xp de la autoexplicación");
  ok(s2.porque.asked === 2 && s2.porque.right === 1 && s2.porque.cats[qz0.cat].n === 2 && s2.porque.log.length === 2,
     code + ": queda registrada: " + JSON.stringify(s2.porque));
});

console.log("controles: " + n + "   errores: " + bad);
process.exit(bad ? 1 : 0);
