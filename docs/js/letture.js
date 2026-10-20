/*
 * Las lecturas: una historia por capítulos graduada de A1 a B2 («Martín»),
 * textos de cultura, un texto corto por semana y «inundaciones» (textos que
 * repiten una estructura).
 *
 * Input comprensible (Krashen 1985): textos apenas por encima del nivel, con
 * las palabras menos frecuentes glosadas para que la cobertura quede cerca
 * del 98 % que hace falta para entender sin esfuerzo (Hu & Nation 2000).
 * Cada capítulo usa la gramática de ese punto del curso y termina con una
 * «caza» de formas: notar la forma dentro de un texto que ya entendiste
 * (Schmidt 1990).  La historia sigue: las ganas de saber cómo termina son
 * motivación.
 *
 * Los textos son del paquete de cada idioma (docs/lang/<código>/
 * letture_data.js → window.LETTURE_DATA: EPISODI, SERIES, MC_SKIP, vf,
 * hunt) más «La settimana» / «A semana» (letture_settimana.js →
 * window.LettureSettimana).  Cada texto: text, gloss {palabra: significado},
 * questions de comprensión (en castellano, sobre el sentido), vf opcional
 * (verdadero / falso / no se dice, en la lengua meta) y hunt {label,
 * targets}, donde targets son las palabras exactas (en minúscula) que hay
 * que encontrar en el texto.
 */
(function (root) {
  "use strict";

  var DATA = root.LETTURE_DATA || {};
  var EPISODI = DATA.EPISODI || [];
  var VF_CFG = DATA.vf || {};
  var VF_OPTIONS = VF_CFG.options || ["verdadero", "falso", "no se dice"];
  var VF = VF_CFG.alias || {};
  var NOT_SAID = VF_OPTIONS[2];

  /* ------------------------------------------------------------ texto */

  // Tokens of a paragraph, keeping punctuation attached for display.
  function tokens(par) {
    return par.split(/\s+/).filter(Boolean);
  }

  // The bare word inside a token: lower case, no surrounding punctuation.
  // Hyphens inside the word stay (vende-se, contatá-lo, casa-grande); a
  // token that is only punctuation (the dialogue dash «—») comes back empty.
  var LETTER = "a-zà-öø-ÿ";
  var LEAD = new RegExp("^[^" + LETTER + "]+"), TRAIL = new RegExp("[^" + LETTER + "']+$");
  function bare(tok) {
    return String(tok).toLowerCase()
      .replace(LEAD, "")
      .replace(TRAIL, "")
      .replace(/'$/, "");
  }

  function paragraphs(ep) { return ep.text.split(/\n+/); }

  function allTokens(ep) {
    var out = [];
    paragraphs(ep).forEach(function (p) { tokens(p).forEach(function (t) { out.push(t); }); });
    return out;
  }

  // Gloss for a token.  Forms with an apostrophe (l'università, d'água)
  // look up the part after it too.
  function glossFor(ep, tok) {
    var b = bare(tok);
    if (ep.gloss[b]) return ep.gloss[b];
    var k = b.lastIndexOf("'");
    if (k >= 0 && ep.gloss[b.slice(k + 1)]) return ep.gloss[b.slice(k + 1)];
    return null;
  }

  /* Multiple-choice glosses (Yanagisawa, Webb & Uchihara 2020: the most
     effective kind): a few words per text are not told but asked, three
     meanings in Spanish, chosen by the context.  Words that are clean
     meanings, not cognates (mappa = mapa, bairro = barrio) and not grammar
     words (the language's MC_SKIP). */
  var MC_SKIP = DATA.MC_SKIP || /^$/;
  function plain(x) { return String(x).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
  function lev(a, b) {
    var d = [], i, j;
    for (i = 0; i <= a.length; i++) d[i] = [i];
    for (j = 1; j <= b.length; j++) d[0][j] = j;
    for (i = 1; i <= a.length; i++) for (j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[a.length][b.length];
  }
  function cleanMeaning(it, es) {
    es = String(es || "");
    if (!/^[a-záéíóúñü ]+$/i.test(es) || es.split(" ").length > 2) return false;
    var a = plain(it);
    if (a.length < 4 || MC_SKIP.test(it)) return false;
    // a cognate (mappa = mapa, exílio = exilio) is read, not guessed
    return plain(es).split(" ").every(function (w) { return w.length < 3 || lev(a, w) / Math.max(a.length, w.length) > 0.4; });
  }
  // Token indices of the asked words: the first time each appears, spread
  // over the text, the same ones every time the text is opened.
  function mcTargets(ep, n) {
    n = n || 4;
    var seen = {}, cands = [];
    allTokens(ep).forEach(function (t, i) {
      var b = core(t), g = glossFor(ep, t);
      if (!g || seen[b] || !cleanMeaning(b, g)) return;
      seen[b] = 1;
      cands.push(i);
    });
    if (cands.length <= n) return cands;
    var out = [];
    for (var k = 0; k < n; k++) out.push(cands[Math.floor((k + 0.5) * cands.length / n)]);
    return out;
  }
  // The right meaning and two others of the same text (plausible there).
  function mcOptions(ep, tok, rnd) {
    rnd = rnd || Math.random;
    var right = glossFor(ep, tok), me = core(tok);
    var pool = Object.keys(ep.gloss).filter(function (w) { return w !== me && cleanMeaning(w, ep.gloss[w]) && ep.gloss[w] !== right; })
      .map(function (w) { return ep.gloss[w]; });
    if (pool.length < 2) EPISODI.forEach(function (e) {
      Object.keys(e.gloss).forEach(function (w) { if (cleanMeaning(w, e.gloss[w]) && e.gloss[w] !== right && pool.indexOf(e.gloss[w]) < 0) pool.push(e.gloss[w]); });
    });
    // the same number of words as the answer: a long option is not a clue
    var nw = function (x) { return x.split(" ").length; };
    var same = pool.filter(function (x) { return nw(x) === nw(right); }), pick = [];
    while (pick.length < 2 && same.length) pick.push(same.splice(Math.floor(rnd() * same.length), 1)[0]);
    pool = pool.filter(function (x) { return pick.indexOf(x) < 0; });
    while (pick.length < 2 && pool.length) pick.push(pool.splice(Math.floor(rnd() * pool.length), 1)[0]);
    var opts = [right].concat(pick);
    for (var i = opts.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)), t = opts[i]; opts[i] = opts[j]; opts[j] = t; }
    return { word: me, answer: right, options: opts };
  }

  // The word after an apostrophe: l'inferno → inferno, d'água → água.
  function core(tok) {
    var b = bare(tok), k = b.lastIndexOf("'");
    return k >= 0 ? b.slice(k + 1) : b;
  }

  // Indices of the tokens the hunt is after.
  function huntTargets(ep) {
    var out = [];
    allTokens(ep).forEach(function (t, i) {
      if (ep.hunt.targets.indexOf(bare(t)) >= 0 ||
          ep.hunt.targets.indexOf(core(t)) >= 0) out.push(i);
    });
    return out;
  }

  /* Caza: selected is a list of token indices.  Every miss and every false
     hit costs; the verdict follows the net share found. */
  function gradeHunt(ep, selected) {
    var want = huntTargets(ep);
    var hit = 0, wrong = 0;
    selected.forEach(function (i) {
      if (want.indexOf(i) >= 0) hit++; else wrong++;
    });
    var score = Math.max(0, hit - wrong) / want.length;
    return {
      score: score, hit: hit, wrong: wrong, total: want.length, targets: want,
      // the verdicts are the engine's keys (Engine.grade), shared by every exercise
      verdict: score >= 0.85 ? "giusto" : score >= 0.5 ? "quasi" : "sbagliato"
    };
  }

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // The playable part of an episode: comprehension first (meaning), then the
  // hunt (form).
  function session(ep) {
    var out = ep.questions.map(function (q, i) {
      return { id: "lettura:" + ep.id + ":" + i, src: "lettura", ep: ep.id,
               type: "choice", prompt: "Comprensión", stem: q[0],
               options: shuffle(q[1]), answer: q[2], accept: [q[2]], withText: true };
    });
    // Comprehension in the target language (CILS, Celpe-Bras): true, false
    // or not said.  vf = [[statement, one of VF_OPTIONS (or an alias)], ...]
    (ep.vf || []).forEach(function (x, i) {
      var a = (VF.hasOwnProperty(String(x[1]).toLowerCase()) && VF[String(x[1]).toLowerCase()]) || x[1];
      out.push({ id: "lettura:" + ep.id + ":vf" + i, src: "lettura", ep: ep.id, type: "choice",
                 prompt: VF_CFG.prompt || "¿Verdadero, falso o no se dice?", stem: x[0], options: VF_OPTIONS.slice(),
                 answer: a, accept: [a], withText: true,
                 note: a === NOT_SAID ? "El texto no lo dice: no alcanza con que sea posible." : "" });
    });
    out.push({ id: "caccia:" + ep.id, src: "lettura", ep: ep.id, type: "hunt",
               prompt: (DATA.hunt || "Caza de formas · ") + ep.grammar, stem: ep.hunt.label,
               answer: ep.hunt.targets.join(", ") });
    return out;
  }

  function byId(id) {
    for (var i = 0; i < EPISODI.length; i++) if (EPISODI[i].id === id) return EPISODI[i];
    return null;
  }

  // Everything that isn't marked otherwise is part of Martín's story.
  EPISODI.forEach(function (e) { if (!e.series) e.series = "martin"; });
  // La settimana / A semana: one short text for each week that had none (letture_settimana.js).
  var LS = root.LettureSettimana || (typeof require === "function" ? require("./letture_settimana.js") : null);
  if (LS) LS.TESTI.slice().sort(function (a, b) { return a.week - b.week; }).forEach(function (e, k) { e.series = "settimana"; e.n = k + 1; EPISODI.push(e); });

  // Tramo C1 (tramo_data.js): the long reading of weeks 27-51, the «lunga»
  // series, with its questions in the target language (js/tramo.js has the
  // listening and the task of the same week).
  var TR = root.TRAMO_DATA || null;
  if (TR) (TR.SETTIMANE || []).forEach(function (s, k) {
    var e = {};
    Object.keys(s.lettura).forEach(function (key) { e[key] = s.lettura[key]; });
    e.id = "l-" + s.week; e.week = s.week; e.level = s.level; e.series = "lunga"; e.n = k + 1;
    EPISODI.push(e);
  });

  var SERIES = (DATA.SERIES || []).slice();
  if (TR && TR.series && (TR.SETTIMANE || []).length) SERIES.splice(Math.min(3, SERIES.length), 0, TR.series);

  function ofSeries(id) {
    return EPISODI.filter(function (e) { return e.series === id; });
  }

  /* Each text opens in the week whose grammar it uses («week», checked by
     tools/<código>/check_letture.py), so nothing is read before its theory.  Martín's episodes also
     go one after the other; culture texts are free to pick among the open
     ones (choice sustains motivation: Deci & Ryan 2000). */
  function isOpen(ep, done, week) {
    if (week && ep.week > week) return false;
    if (ep.series !== "martin") return true;
    return ep.n === 1 || !!(done || {})["ep" + (ep.n - 1)];
  }

  function next(done, series) {
    var list = ofSeries(series || "martin");
    for (var i = 0; i < list.length; i++) {
      if (!(done || {})[list[i].id]) return list[i];
    }
    return null;
  }

  /* ------------------------------------------------ relectura cronometrada */

  /* Palabras por minuto desde que se abre el texto hasta «Terminé», contadas
     solo si la comprensión de esa vuelta queda en 70 % o más (leer rápido
     sin entender no es leer: Nation 2009, fluidez lectora; Chang y Millett
     2013, relectura cronometrada).  La curva del año son las primeras
     lecturas por semana del curso; releer un texto conocido para bajar el
     tiempo es el ejercicio de fluidez.

       state.lectura = { pend: {id: {ms, words, at, kar}},
                         runs: [{id, w, wpm, pct, at, re}], best: {id: wpm} } */
  var SPEED_MIN_PCT = 70;          // comprensión mínima para que la vuelta cuente
  var SPEED_MAX = 600;             // más rápido que esto es mirar, no leer
  var SPEED_MIN = 15;              // más lento que esto: el texto quedó abierto
  var SPEED_KEEP = 400;            // vueltas guardadas

  function speedStore(state) {
    var s = state.lectura;
    if (!s || typeof s !== "object" || Array.isArray(s)) s = state.lectura = {};
    if (!s.pend || typeof s.pend !== "object") s.pend = {};
    if (!Array.isArray(s.runs)) s.runs = [];
    if (!s.best || typeof s.best !== "object") s.best = {};
    return s;
  }
  function wordsOf(ep) {
    return allTokens(ep).filter(function (t) { return /[a-zà-öø-ÿ]/i.test(t); }).length;
  }
  // «Terminé»: the time of this reading waits for the questions.
  function speedNote(state, ep, ms, opts) {
    if (!ep || !(ms > 0)) return null;
    opts = opts || {};
    var s = speedStore(state);
    s.pend[ep.id] = { ms: Math.round(ms), words: wordsOf(ep), at: opts.now || Date.now(), kar: !!opts.kar,
                      w: +opts.week || ep.week || 1 };
    return s.pend[ep.id];
  }
  /* The questions are over (pct of this attempt): the reading counts or not.
     → { counted, wpm, best, prev, why } */
  function speedCommit(state, id, pct, now) {
    var s = speedStore(state), p = s.pend[id];
    if (!p) return { counted: false, why: "none" };
    delete s.pend[id];
    if (p.kar) return { counted: false, why: "audio" };
    var wpm = Math.round(p.words / (p.ms / 60000));
    if (pct < SPEED_MIN_PCT) return { counted: false, why: "comp", wpm: wpm };
    if (wpm > SPEED_MAX) return { counted: false, why: "fast", wpm: wpm };
    if (wpm < SPEED_MIN) return { counted: false, why: "slow", wpm: wpm };
    var prev = s.best[id] || 0, re = s.runs.some(function (r) { return r.id === id; });
    s.runs.push({ id: id, w: p.w, wpm: wpm, pct: pct, at: now || Date.now(), re: re, ms: p.ms });
    if (s.runs.length > SPEED_KEEP) s.runs = s.runs.slice(-SPEED_KEEP);
    if (wpm > prev) s.best[id] = wpm;
    return { counted: true, wpm: wpm, prev: prev, best: Math.max(prev, wpm), re: re };
  }
  /* The curve of the year: the median of the first readings of each week of
     the course → [{w, wpm, n}], and the rereadings apart. */
  function speedCurve(state) {
    var s = speedStore(state), by = {};
    s.runs.forEach(function (r) {
      if (r.re) return;
      (by[r.w] = by[r.w] || []).push(r.wpm);
    });
    return Object.keys(by).map(Number).sort(function (a, b) { return a - b; }).map(function (w) {
      var l = by[w].slice().sort(function (a, b) { return a - b; });
      return { w: w, wpm: l[Math.floor(l.length / 2)], n: l.length };
    });
  }
  // Minutes of timed reading in the last `days` days.
  function speedMinutes(state, days, now) {
    var s = speedStore(state), since = (now || Date.now()) - (days || 7) * 864e5, ms = 0;
    s.runs.forEach(function (r) { if (r.at >= since) ms += r.ms || 0; });
    return Math.round(ms / 60000);
  }

  var api = {
    SPEED_MIN_PCT: SPEED_MIN_PCT,
    speedNote: speedNote,
    speedCommit: speedCommit,
    speedCurve: speedCurve,
    speedMinutes: speedMinutes,
    speedStore: speedStore,
    wordsOf: wordsOf,
    EPISODI: EPISODI,
    SERIES: SERIES,
    ofSeries: ofSeries,
    tokens: tokens,
    bare: bare,
    core: core,
    paragraphs: paragraphs,
    allTokens: allTokens,
    glossFor: glossFor,
    mcTargets: mcTargets,
    mcOptions: mcOptions,
    huntTargets: huntTargets,
    gradeHunt: gradeHunt,
    session: session,
    byId: byId,
    isOpen: isOpen,
    next: next
  };

  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Letture = api;
})(typeof window !== "undefined" ? window : globalThis);
