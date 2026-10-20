/*
 * «📖 ¿Por qué?» y «🧐 ¿Qué tenía de malo?».
 *
 * 1. Cada ejercicio (del curso, del banco, del gimnasio, de las frases)
 *    queda enlazado al bloque de teoría que lo explica: blockFor(item) →
 *    { week, i }.  Se calcula acá, en tiempo de ejecución, para todos los
 *    ejercicios, también los que se generan en la ronda (el gimnasio, el
 *    banco, las frases):
 *      - un ejercicio del curso vive en una semana y en una parte de su
 *        lección (course.weeks[].parts, que build_course arma con los
 *        patrones de cada parte): el bloque sale de esa parte;
 *      - lo demás busca entre las lecciones ya abiertas: el tiempo verbal
 *        (gimnasio), las etiquetas (banco), la semana de la escena (frases);
 *      - dentro de los candidatos gana el bloque cuyas formas (las cursivas
 *        de la regla, la tabla, los ejemplos) más se parecen a lo que el
 *        ejercicio pregunta, pesando más lo que distingue la respuesta de
 *        las opciones falsas (BM25 sobre las formas del idioma).
 *    En la devolución, el botón abre ese bloque en una hoja superpuesta,
 *    sin salir de la ronda (el feedback elaborado rinde más cuando dice el
 *    porqué: Shute 2008; Wisniewski, Zierer y Hattie 2020).
 *
 * 2. Después de una respuesta correcta en opción múltiple, a veces (1 de
 *    cada 4 o 5) se pregunta por qué otra de las opciones estaba mal, con
 *    tres explicaciones: la verdadera (la categoría que da Diagnosi) y dos
 *    plausibles de otras categorías.  Explicarse el porqué fija la regla
 *    (autoexplicación: Bisra et al. 2018, g = 0,55).  Suma xp y queda
 *    registrado en state.porque.
 *
 * Lo que depende del idioma (qué se le dice al alumno de cada categoría de
 * error, qué categorías se confunden entre sí) está en el paquete:
 * docs/lang/<código>/porque_data.js (window.PORQUE_DATA).  El núcleo no
 * nombra ningún idioma.
 *
 *   Porque.blockFor(item, { course, week, unlocked })  → { week, i, sure } | null
 *   Porque.quiz(item, { rnd })                          → { opt, cat, explain, choices } | null
 *   Porque.shouldAsk(state, rnd)                        → true 1 de cada 4-5 veces
 *   Porque.init(hooks); Porque.after(item, info)        → la interfaz (navegador)
 */
(function (root) {
  "use strict";

  var LG = root.LANG || {};
  var DATA = function () { return root.PORQUE_DATA || {}; };
  // Words of the language; the apostrophe splits (gliel'ho → gliel, ho).
  var WORD = new RegExp("[a-zà-ÿ" + (LG.hyphenWords ? "-" : "") + "]+", "g");

  function deaccent(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  function words(s) {
    return (String(s || "").toLowerCase().match(WORD) || [])
      .map(function (w) { return w.replace(/^-+|-+$/g, ""); })
      .filter(function (w) { return w.length > 0; });
  }
  // The italic segments of a text of the lesson: the forms of the language.
  function italics(s) {
    var out = [];
    String(s || "").replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, function (m, x) { out.push(x); return m; });
    return out;
  }
  function strip(s) { return String(s || "").replace(/\*+/g, ""); }
  // The endings a rule teaches (*-ões*, *-isc-*): «~ões», so that
  // violões finds the block of the plurals in -ão.
  function endings(s) {
    var out = [];
    String(s || "").toLowerCase().replace(/(^|[\s\/,(→])-([a-zà-ÿ]{1,5})-?(?![a-zà-ÿ])/g, function (m, a, e) { out.push("~" + e); return m; });
    return out;
  }
  function tails(w) {
    var out = [];
    for (var k = 2; k <= 4; k++) if (w.length > k + 1) out.push("~" + w.slice(-k));
    return out;
  }

  /* ------------------------------------------------ el índice de bloques */

  var IDX = null, IDX_OF = null;

  function bagAdd(bag, list, w) {
    list.forEach(function (x) { bag[x] = (bag[x] || 0) + w; });
  }

  function blockBag(b) {
    var bag = {};
    // The forms the block teaches (its rule's italics, the cells of its
    // table: Lezione.forms), then its examples and the italics of the rest.
    var forms = root.Lezione && root.Lezione.forms ? root.Lezione.forms(b) : [];
    forms.forEach(function (f) { bagAdd(bag, words(f), 2); bagAdd(bag, endings(f), 2); });
    [b.h, b.r, b.warn, b.tip].concat(b.p || [], b.more || []).forEach(function (t) {
      italics(t).forEach(function (x) { bagAdd(bag, words(x), 1); bagAdd(bag, endings(x), 1); });
    });
    (b.ex || []).forEach(function (e) { bagAdd(bag, words(strip(e[0])), 1); });
    if (b.table) (b.table.rows || []).forEach(function (r) {
      r.forEach(function (c) { if (strip(c).length <= 40) bagAdd(bag, words(strip(c)), 0.5); });
    });
    (b.q || []).forEach(function (q) { bagAdd(bag, words(q.answer), 1); });
    return bag;
  }
  // What the block names as its subject: the forms of its rule and its
  // table, without the words its examples happen to use.
  function coreOf(b) {
    var core = {};
    (root.Lezione && root.Lezione.forms ? root.Lezione.forms(b) : []).forEach(function (f) { bagAdd(core, words(f), 1); });
    [b.h, b.r, b.warn, b.tip].concat(b.p || []).forEach(function (t) {
      italics(t).forEach(function (x) { bagAdd(core, words(x), 1); });
    });
    return core;
  }

  function index(course) {
    if (IDX && IDX_OF === course) return IDX;
    var blocks = [], df = {}, byWeek = {}, part = {}, weeksOf = {}, firstTense = {};
    (course.weeks || []).forEach(function (w) {
      (w.tenses || []).forEach(function (t) { if (!firstTense[t]) firstTense[t] = w.week; });
      (w.items || []).forEach(function (id) { (weeksOf[id] = weeksOf[id] || []).push(w.week); });
      (w.parts || []).forEach(function (p) {
        (p.items || []).forEach(function (id) { part[w.week + ":" + id] = p.blocks; });
      });
      var L = w.lesson;
      if (!L || !L.blocks) return;
      byWeek[w.week] = [];
      L.blocks.forEach(function (b, i) {
        var bag = blockBag(b), len = 0;
        Object.keys(bag).forEach(function (t) { df[t] = (df[t] || 0) + 1; len += bag[t]; });
        var meta = deaccent([b.h, b.r, b.warn, b.tip].concat(b.p || []).map(strip).join(" "));
        var x = { week: w.week, i: i, bag: bag, core: coreOf(b), len: len, meta: meta, h: b.h || "" };
        blocks.push(x);
        byWeek[w.week].push(x);
      });
    });
    var N = blocks.length, avg = blocks.reduce(function (s, x) { return s + x.len; }, 0) / (N || 1);
    var idf = {};
    Object.keys(df).forEach(function (t) { idf[t] = Math.log(1 + (N - df[t] + 0.5) / (df[t] + 0.5)); });
    IDX = { blocks: blocks, byWeek: byWeek, idf: idf, avg: avg, part: part, weeksOf: weeksOf,
            tenseWeek: tenseWeeks(course, firstTense), firstTense: firstTense, N: N };
    IDX_OF = course;
    return IDX;
  }

  /* The week that teaches each tense of the conjugator: the one whose title
     names it best (Passato prossimo, Futuro do presente), the earliest on a
     tie; if none names it, the first week that practises it. */
  function tenseWeeks(course, first) {
    var C = root.Conj, out = {};
    var labels = (C && C.TENSE_LABELS) || {};
    Object.keys(first).concat(Object.keys(labels)).forEach(function (t) {
      if (out[t]) return;
      var lab = deaccent(labels[t] || t).replace(/\(.*?\)/g, " ");
      var ws = lab.split(/[^a-z]+/).filter(function (x) { return x.length >= 3; });
      var best = 0, bn = 0;
      var like = function (a, b) { return a === b || (a.length >= 5 && b.length >= 5 && (a.indexOf(b) === 0 || b.indexOf(a) === 0)); };
      (course.weeks || []).forEach(function (w) {
        var title = deaccent(w.title).split(/[^a-z]+/);
        var n = ws.filter(function (x) { return title.some(function (y) { return like(x, y); }); }).length;
        if (n > bn) { bn = n; best = w.week; }
      });
      out[t] = best || first[t] || 0;
    });
    return out;
  }

  /* ------------------------------------------------ lo que pregunta el ítem */

  function spanishSide(it) {
    // Where the item's text is Spanish: the stem of a translation, the
    // options of «¿Qué significa?».
    return {
      stem: it.type === "translate" || it.dir === "es-it" || !!(it.frase && it.stem === it.frase.es),
      options: /significa|traducción|en español/i.test(it.prompt || "") || it.src === "vocab" || it.bank === "voc" || it.dir === "it-es"
    };
  }

  function query(it) {
    var q = {}, sp = spanishSide(it);
    var add = function (list, w) { list.forEach(function (x) { q[x] = Math.max(q[x] || 0, w); }); };
    var ans = sp.options ? [] : words(strip(it.answer).replace(/\|/g, " "));
    var wrong = {};
    if (!sp.options) (it.options || []).forEach(function (o) {
      if (deaccent(o) !== deaccent(it.answer)) words(o).forEach(function (w) { wrong[w] = 1; });
    });
    // What makes the answer right and the options wrong (or the word to
    // fix): that is the point, the key of the item.
    var key = it.good ? words(it.good) : it.bad ? [] : ans.filter(function (w) { return !wrong[w]; });
    if (it.type === "fixerr" && !it.good) key = [];
    add(ans, it.type === "fixerr" ? 0.5 : 1.5);
    add(key, 3);
    // endings (violões → ~ões) only for single forms, not for whole phrases
    if (!it.frase) key.forEach(function (w) { add(tails(w), 1.2); });
    if (!sp.options) (it.accept || []).forEach(function (a) { add(words(strip(a)), 1); });
    if (!sp.options) add(Object.keys(wrong), 0.6);
    if (!sp.stem && it.stem) add(words(strip(it.stem).replace(/_{2,}/g, " ")), it.type === "fixerr" ? 0.4 : 1);
    if (it.frase) add(words(it.frase.it), 1.5);
    if (it.bad) add(words(it.bad), 1);
    if (it.context) add(words(it.context), 0.8);
    // The note of the item says it with the forms in italics.
    italics(it.note).forEach(function (x) { add(words(x), 1.5); });
    if (it.src === "coniugatore" && it.note) add(words(String(it.note).split(":").slice(1).join(" ")), 1.2);
    // The words a block must have to explain the item: the key and the
    // forms its note marks; for a phrase, what its note marks (Stai es de
    // stare), not any word of it.
    var marked = italics(it.note).map(words).reduce(function (a, b) { return a.concat(b); }, []);
    var need = it.frase ? (marked.length ? marked : it.options ? key : []) : key.concat(marked);
    Object.defineProperty(q, "_key", { value: need, enumerable: false });
    return q;
  }

  // Words of the metalanguage the item names: the tense of the gym, the
  // tags of the bank, the category of an error to find.
  function metaOf(it) {
    var out = [];
    if (it.src === "coniugatore") {
      var t = String(it.id || "").split(":")[2];
      var C = root.Conj, lab = C && C.TENSE_LABELS && C.TENSE_LABELS[t];
      if (lab) out.push(deaccent(lab).replace(/\(.*?\)/g, "").trim());
    }
    (it.tags || []).forEach(function (t) { out.push(deaccent(String(t).replace(/_/g, " "))); });
    // the category of the error, as the diagnosis names it (Dobles consonantes)
    var D = root.Diagnosi;
    if (it.cat && D && D.LABEL && D.LABEL[it.cat]) out.push(deaccent(D.LABEL[it.cat]).replace(/\(.*?\)/g, "").trim());
    return out.filter(Boolean);
  }

  // BM25 over the forms of the block; +6 for each metalanguage word of the
  // item (the tense, the tag) found in its rule.  hits: the distinct words
  // of the item the block has.
  function score(x, q, meta, I) {
    var s = 0, hits = 0, keys = 0, k1 = 1.2, b = 0.5, norm = k1 * (1 - b + b * x.len / I.avg);
    var key = q._key || [];
    Object.keys(q).forEach(function (t) {
      var tf = x.bag[t];
      if (!tf) return;
      hits++;
      if (key.indexOf(t) >= 0 && x.core[t]) keys += I.idf[t] || 0;
      s += (I.idf[t] || 0) * q[t] * tf * (k1 + 1) / (tf + norm);
    });
    meta.forEach(function (m) {
      if (m.length >= 4 && x.meta.indexOf(m) >= 0) { s += 6; hits++; keys += 3; }
    });
    return { s: s, hits: hits, keys: keys };
  }

  function bestOf(cands, q, meta, I, bonus) {
    var best = null, bs = 0, bh = 0, bk = 0;
    cands.forEach(function (x) {
      var r = score(x, q, meta, I), s = r.s * (bonus ? bonus(x) : 1);
      if (s > bs) { bs = s; best = x; bh = r.hits; bk = r.keys; }
    });
    return { x: best, s: bs, hits: bh, keys: bk };
  }

  /* The block of theory that explains an item.
     ctx: { course, week (the round's), unlocked }.
     → { week, i, h, sure, score } or null (no block good enough). */
  var SKIP_TYPES = { intro: 1, word: 1, card: 1, hunt: 1 };
  var SKIP_SRC = { lettura: 1, lab: 1, ascolto: 1, suoni: 1, vocab: 1, esame: 1 };
  function eligibleForBlock(it) {
    if (!it || SKIP_TYPES[it.type] || SKIP_SRC[it.src]) return false;
    if (it.bank === "voc" || it.topic === "esame") return false;
    return true;
  }

  function found(x, s, sure) {
    return { week: x.week, i: x.i, h: x.h, sure: !!sure, score: Math.round(s * 10) / 10 };
  }

  function blockFor(it, ctx) {
    ctx = ctx || {};
    var course = ctx.course;
    if (!course || !eligibleForBlock(it)) return null;
    var I = index(course);
    if (!I.N) return null;
    var P = DATA(), MIN = P.minScore || 6;
    var unlocked = Math.max(1, Math.min(52, ctx.unlocked || 52));
    var q = query(it), meta = metaOf(it), r;

    // 1. An exercise of the course: its week, its part (the patterns of
    //    the part placed it there), the best block of that part.
    var ws = I.weeksOf[it.id];
    if (ws && ws.length) {
      var wk = ctx.week && ws.indexOf(ctx.week) >= 0 ? ctx.week : ws[0];
      var inWeek = I.byWeek[wk] || [];
      var pb = I.part[wk + ":" + it.id];
      var mine = pb ? inWeek.filter(function (x) { return pb.indexOf(x.i) >= 0; }) : inWeek;
      if (mine.length) {
        r = bestOf(mine, q, meta, I);
        return found(r.x || mine[0], r.s, mine.length === 1 || r.s >= MIN);
      }
    }

    // 2. The week that teaches it: the tense of the gym, the tag, the
    //    category of error or the kind of form of the bank.
    var homes = [], byKind = false;
    if (it.src === "coniugatore") {
      var t = String(it.id || "").split(":")[2];
      // the week that practises the tense first (terei feito: the compound
      // tenses), then the one whose title names it (futuro)
      if (I.firstTense[t]) homes.push(I.firstTense[t]);
      if (I.tenseWeek[t] && homes.indexOf(I.tenseWeek[t]) < 0) homes.push(I.tenseWeek[t]);
    } else if (!it.frase) {
      var W = P.weeks || {};
      var kind = String(it.id || "").split(":").slice(0, 2).join(":");      // b:art, b:pl, b:prep…
      // [week, block]: one block explains every exercise of that kind
      if (Array.isArray(W[kind])) {
        var one = (I.byWeek[W[kind][0]] || [])[W[kind][1]];
        if (one) return found(one, 0, true);
      } else if (W[kind]) { homes.push(W[kind]); byKind = true; }
      [it.cat].concat(it.tags || []).forEach(function (k) { if (k && W[k] && homes.indexOf(W[k]) < 0) homes.push(W[k]); });
      if (it.w && homes.indexOf(+it.w) < 0) homes.push(+it.w);
    }
    if (homes.length) {
      var inHome = I.blocks.filter(function (x) { return homes.indexOf(x.week) >= 0; });
      // (the first home weighs more: for the gym, the week that practises
      // the tense; terei feito is in the compound tenses)
      r = bestOf(inHome, q, meta, I, function (x) { return x.week === homes[0] ? 1.3 : 1; });
      if (r.x && r.s >= MIN / 2) return found(r.x, r.s, r.s >= MIN);
      // a form of the bank (an article, a plural), a tense of the gym: the
      // first block of the week that teaches it says it
      var first = (I.byWeek[homes[0]] || [])[0];
      if ((byKind || it.src === "coniugatore") && first) return found(first, r.s, false);
    }

    // 3. Everything else (the phrases, a sentence of the bank with no
    //    tag): the lessons open so far (the scene's week, if later), the
    //    review weeks worth less.  Two words in common at least: one word
    //    alone (Nossa!) is a coincidence, not an explanation.
    var limit = unlocked;
    if (it.frase && root.Frasi && root.Frasi.scene) {
      var sc = root.Frasi.scene(it.frase.scene);
      if (sc && sc.week > limit) limit = sc.week;
    }
    var review = {};
    (P.review || []).forEach(function (w) { review[w] = 1; });
    var open = I.blocks.filter(function (x) { return x.week <= limit; });
    r = bestOf(open, q, meta, I, function (x) {
      return (homes.indexOf(x.week) >= 0 ? 1.3 : 1) * (review[x.week] ? 0.7 : 1);
    });
    // A phrase asks more: its note has to point at what the block teaches
    // (rare words of the key, not «mi» or «o»).
    var min = it.frase ? 1.5 * MIN : MIN, keyMin = it.frase ? (P.keyMin || 3.5) : 2;
    if (!r.x || r.s < min || r.hits < 2 || (q._key.length && r.keys < keyMin)) return null;
    return found(r.x, r.s, r.s >= 2 * MIN);
  }

  /* --------------------------------------- «¿Qué tenía de malo?» (autoexplicación) */

  function groups() {
    var G = (root.Diagnosi && root.Diagnosi.GROUPS) || LG.diagGroups || {};
    return G;
  }

  // Multiple choice whose options are in the language: the same test as
  // app.js answer() uses to decide whether a wrong option can be diagnosed.
  function optionsInLanguage(it) {
    if (!it || !it.options || it.options.length < 2) return false;
    if (it.recog && it.orig === "translate") return false;
    if (it.type !== "choice" && it.type !== "guess") return false;
    if (it.choiceDiag || it.src === "coniugatore") return true;
    if (it.src === "frasi") return it.type === "choice" || it.type === "guess";
    return it.src !== "banca" && it.src !== "lab" && it.src !== "lettura" && it.src !== "vocab" &&
      it.src !== "ascolto" && it.type !== "scopri" && it.topic !== "esame";
  }

  function diagOf(it, opt) {
    var D = root.Diagnosi;
    if (!D || !D.explainChoice) return null;
    var cd = it.choiceDiag || { before: "", after: "" };
    var d;
    try {
      d = D.explainChoice(cd.before + opt + cd.after, cd.before + it.answer + cd.after,
        it.choiceDiag ? {} : { stem: it.stem, nominal: it.type === "plural" || /plural/i.test(it.prompt || "") });
    } catch (e) { return null; }
    var why = DATA().why || {}, G = groups().generic || {};
    if (!d || !d.cat || G[d.cat] || !why[d.cat]) return null;
    return d;
  }

  function shuffle(a, rnd) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rnd() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* The question: which wrong option, what was wrong with it, three
     explanations.  → { opt, cat, label, explain, choices: [{ cat, text, ok }] } */
  function quiz(it, opts) {
    opts = opts || {};
    var rnd = opts.rnd || Math.random;
    if (!optionsInLanguage(it)) return null;
    // Options that are Spanish glosses (Guardo la televisione → mirar /
    // guardar / cuidar): «what was wrong» would be «it is Spanish», always.
    var U = root.Diagnosi && root.Diagnosi.util, known = U && (U.isItalian || U.isPortuguese);
    if (known && words(it.answer).some(function (w) { return w.length >= 3 && !known(w); })) return null;
    var norm = function (s) { return deaccent(s).replace(/[^a-zà-ÿ0-9 ]/g, "").trim(); };
    var cands = [];
    it.options.forEach(function (o) {
      if (norm(o) === norm(it.answer)) return;
      if ((it.accept || []).some(function (a) { return norm(a) === norm(o); })) return;
      var d = diagOf(it, o);
      if (d) cands.push({ opt: o, d: d });
    });
    if (!cands.length) return null;
    // An option that breaks a rule of the language teaches more than one
    // that is just a Spanish word (Las praias): that one first.
    var lex = groups().lexical || {};
    var rule = cands.filter(function (x) { return !lex[x.d.cat]; });
    if (rule.length) cands = rule;
    var c = cands[Math.floor(rnd() * cands.length)];
    var P = DATA(), why = P.why, near = P.near || {};
    var used = {};
    (c.d.all || [c.d.cat]).forEach(function (k) { used[k] = 1; });
    used[c.d.cat] = 1;
    var ok = function (k) { return why[k] && !used[k]; };
    // One distractor close to the real category (the same family of error),
    // one from another family: both plausible, neither true.
    var close = shuffle((near[c.d.cat] || []).filter(ok), rnd);
    var picks = close.slice(0, 1);
    picks.forEach(function (k) { used[k] = 1; });
    var fam = {};
    (near[c.d.cat] || []).forEach(function (k) { fam[k] = 1; });
    var far = shuffle(Object.keys(why).filter(function (k) { return ok(k) && !fam[k]; }), rnd);
    while (picks.length < 2 && far.length) { var k = far.shift(); picks.push(k); used[k] = 1; }
    while (picks.length < 2 && close.length > picks.length) picks.push(close[picks.length]);
    if (picks.length < 2) return null;
    var choices = shuffle([{ cat: c.d.cat, text: why[c.d.cat], ok: true }].concat(picks.map(function (k) {
      return { cat: k, text: why[k], ok: false };
    })), rnd);
    return { opt: c.opt, cat: c.d.cat, label: c.d.label || "", explain: c.d.explain || "", choices: choices };
  }

  /* 1 de cada 4 o 5 respuestas correctas que se pueden preguntar: nunca dos
     seguidas, a lo sumo siete sin preguntar. */
  function shouldAsk(state, rnd) {
    rnd = rnd || Math.random;
    var P = ensure(state);
    P.since = (P.since || 0) + 1;
    var ask = P.since >= 7 || (P.since >= 2 && rnd() < 0.2);
    if (ask) P.since = 0;
    return ask;
  }

  function ensure(state) {
    if (!state.porque) state.porque = { open: 0, asked: 0, right: 0, since: 0, cats: {}, log: [] };
    var P = state.porque;
    if (!P.cats) P.cats = {};
    if (!P.log) P.log = [];
    return P;
  }

  // The learner's answer: registered, and the xp it earns.
  var XP = { right: 3, wrong: 1 };
  function record(state, it, qz, ok) {
    var P = ensure(state);
    P.asked++;
    if (ok) P.right++;
    var c = P.cats[qz.cat] || (P.cats[qz.cat] = { n: 0, ok: 0 });
    c.n++; if (ok) c.ok++;
    P.log.unshift({ id: String(it.id || "").slice(0, 60), cat: qz.cat, ok: !!ok, at: Date.now() });
    P.log = P.log.slice(0, 50);
    return ok ? XP.right : XP.wrong;
  }

  /* ------------------------------------------------------- la interfaz */

  var H = {};              // hooks from app.js: course, state, week, renderBlock, mk, esc, speak, gain…
  function init(hooks) { H = hooks || {}; }

  function esc(s) {
    return H.esc ? H.esc(s) : String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function mk(s) { return H.mk ? H.mk(s) : esc(strip(s)); }
  // the names of tenses and moods not taught yet, in plain Spanish (devolucion.js)
  function plain(s) { return root.Devolucion ? root.Devolucion.plain(s) : s; }
  function $(s, el) { return (el || document).querySelector(s); }

  function ctxNow() {
    var st = H.state ? H.state() : {};
    return { course: H.course ? H.course() : null, week: H.week ? H.week() : null, unlocked: (st && st.unlocked) || 52 };
  }

  /* After the answer: the «¿Por qué?» button in the feedback and, now and
     then, the self-explanation question.  info: { q (0-2), given, round }. */
  function after(it, info) {
    info = info || {};
    var fb = $("#fb");
    if (!fb || typeof document === "undefined") return;
    var box = $(".feedback", fb);
    if (!box) return;
    var ctx = ctxNow(), blk = null;
    try { blk = blockFor(it, ctx); } catch (e) { blk = null; }
    var row = $(".row", box);
    if (blk && row) {
      var b = document.createElement("button");
      b.className = "tab porque-btn";
      b.id = "porque";
      b.type = "button";
      b.textContent = "📖 ¿Por qué?";
      b.onclick = function () { open(blk.week, blk.i); };
      var next = $("#next", row);
      if (next && next.nextSibling) row.insertBefore(b, next.nextSibling); else row.appendChild(b);
    }
    var st = H.state ? H.state() : null;
    var r = info.round || {};
    if (info.q === 2 && st && !it.retry && r.kind !== "esame" && optionsInLanguage(it)) {
      var qz = quiz(it);
      if (qz && shouldAsk(st, info.rnd)) showQuiz(box, it, qz, st, r);
      if (H.persist) H.persist();
    }
  }

  function showQuiz(box, it, qz, st, r) {
    var div = document.createElement("div");
    div.className = "porque-quiz";
    div.innerHTML = '<div class="pq-h">🧐 ¿Qué tenía de malo <b>«' + esc(qz.opt) + '»</b>?</div>' +
      '<div class="pq-opts">' + qz.choices.map(function (c, k) {
        return '<button class="pq-opt" type="button" data-pq="' + k + '">' + mk(plain(c.text)) + "</button>";
      }).join("") + '</div><div class="pq-out"></div>';
    var row = $(".row", box);
    box.insertBefore(div, row || null);
    Array.prototype.forEach.call(div.querySelectorAll(".pq-opt"), function (btn) {
      btn.onclick = function () {
        if (div.dataset.done) return;
        div.dataset.done = "1";
        var c = qz.choices[+btn.dataset.pq];
        var ok = !!c.ok;
        var xp = record(st, it, qz, ok);
        Array.prototype.forEach.call(div.querySelectorAll(".pq-opt"), function (o) {
          o.disabled = true;
          if (qz.choices[+o.dataset.pq].ok) o.classList.add("right");
          else if (o === btn) o.classList.add("wrong");
        });
        if (r) r.xp = (r.xp || 0) + xp;
        if (H.gain) H.gain(xp);
        if (H.persist) H.persist();
        if (H.renderHeader) H.renderHeader();
        if (H.xpFly) H.xpFly(xp);
        $(".pq-out", div).innerHTML = '<p class="pq-verdict">' + (ok ? "¡Exacto! Explicártelo es lo que fija la regla." : "No era eso. Fijate:") +
          ' <span class="xpgain">+' + xp + " xp</span></p>" +
          '<div class="diag"><span class="tag">' + esc(plain(qz.label)) + "</span><p>" + mk(plain(qz.explain)) + "</p></div>";
      };
    });
  }

  // The sheet: the block of the lesson over the round, with its neighbours.
  function open(week, i) {
    var course = H.course ? H.course() : null;
    var w = course && course.weeks[week - 1];
    if (!w || !w.lesson || !w.lesson.blocks[i]) return;
    var st = H.state ? H.state() : null;
    if (st) { ensure(st).open++; if (H.persist) H.persist(); }
    close();
    var n = w.lesson.blocks.length;
    var later = st && st.unlocked && week > st.unlocked;
    var bhtml = H.renderBlock ? H.renderBlock(w.lesson.blocks[i], i) : "<section class=\"blk\"><h2>" + mk(w.lesson.blocks[i].h) + "</h2><p>" + mk(w.lesson.blocks[i].r) + "</p></section>";
    var wrap = document.createElement("div");
    wrap.id = "porquesheet";
    wrap.className = "porque-back";
    wrap.innerHTML = '<div class="lesson porque-sheet" role="dialog" aria-modal="true" aria-label="La teoría de este ejercicio">' +
      '<div class="ps-top"><span class="ps-where">📖 ' + esc((H.weekLabel ? H.weekLabel(week) : "Semana " + week)) +
        " · " + esc(w.title || "") + "</span>" +
        '<button class="btn ghost ps-close" type="button" aria-label="cerrar">✕</button></div>' +
      (later ? '<p class="muted small">Esto lo vas a ver en la semana ' + esc(H.weekNum ? H.weekNum(week) : week) + ": te lo adelanto.</p>" : "") +
      bhtml +
      '<div class="ps-nav">' +
        (i > 0 ? '<button class="tab" type="button" data-go="' + (i - 1) + '">← anterior</button>' : "<span></span>") +
        '<span class="muted small">bloque ' + (i + 1) + " de " + n + "</span>" +
        (i < n - 1 ? '<button class="tab" type="button" data-go="' + (i + 1) + '">siguiente →</button>' : "<span></span>") +
      "</div>" +
      '<button class="btn wide ps-back" type="button">Volver a la ronda</button></div>';
    document.body.appendChild(wrap);
    document.body.classList.add("porque-open");
    wrap.onclick = function (e) { if (e.target === wrap) close(); };
    Array.prototype.forEach.call(wrap.querySelectorAll(".ps-close, .ps-back"), function (b) { b.onclick = close; });
    Array.prototype.forEach.call(wrap.querySelectorAll("[data-go]"), function (b) {
      b.onclick = function () { open(week, +b.dataset.go); };
    });
    // 🔊 in the examples and the table: read the text beside the button.
    Array.prototype.forEach.call(wrap.querySelectorAll("button.say"), function (b) {
      b.onclick = function (e) {
        e.stopPropagation();
        var host = b.closest("li") ? b.closest("li").querySelector(".it") : b.parentNode;
        var txt = host ? host.textContent.replace(/🔊/g, "").trim() : "";
        if (txt && H.speak) H.speak(txt, true);
      };
    });
    wrap._key = function (e) { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", wrap._key);
    var sheet = $(".porque-sheet", wrap);
    if (sheet) { sheet.scrollTop = 0; var cb = $(".ps-close", sheet); if (cb) cb.focus(); }
  }

  function close() {
    var w = typeof document !== "undefined" && document.getElementById("porquesheet");
    if (!w) return;
    if (w._key) document.removeEventListener("keydown", w._key);
    w.parentNode.removeChild(w);
    document.body.classList.remove("porque-open");
    var b = document.getElementById("porque");
    if (b) b.focus();
  }

  var api = {
    blockFor: blockFor, quiz: quiz, shouldAsk: shouldAsk, record: record, optionsInLanguage: optionsInLanguage,
    index: index, init: init, after: after, open: open, close: close, XP: XP,
    _reset: function () { IDX = null; IDX_OF = null; }
  };
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Porque = api;
})(typeof window !== "undefined" ? window : globalThis);
