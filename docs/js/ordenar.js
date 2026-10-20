/*
 * «Ordená el texto»: los párrafos (o las oraciones) de un texto que ya
 * leíste o que reconstruiste en el dictogloss, desordenados, para volver a
 * armarlo.  Es la tarea de cohesión de los exámenes (Celpe-Bras, CELI):
 * lo que ordena un texto son los conectores (después, pero, así que), el
 * tiempo (a la mañana, a la noche, al día siguiente) y lo que remite a algo
 * ya dicho (él, ella, eso).  La app los marca como pista.
 *
 * La primera pieza queda en su lugar (el ancla); el resto se ordena.  Las
 * pistas tienen que estar repartidas: como mucho una pieza sin ninguna (si
 * no, las oraciones sin pista se pegan a la anterior o el texto no sirve).  Se
 * puntúa por pares: cuántas piezas tienen detrás la que va (una pieza fuera
 * de lugar no arruina todo lo demás).
 *
 * Solo la mecánica, sin DOM: la pantalla está en escritos.js; las listas de
 * pistas son del paquete (ESCRITOS_DATA.clues, .refer).
 *
 * API (window.Ordenar y module.exports):
 *   build(text, opts)     {unit: "párrafos" | "oraciones" | "partes" | opts.unit, units: [texto],
 *                         shuffled: [índice], anchor: 0} o null
 *   grade(units, order)   {pairs, of, pct, inPlace: [bool], ok}
 *   clues(unit)           [{at, end, word, hint, kind}] las pistas marcables
 *   level(week)           {maxPars, maxSent}: más piezas a medida que avanza el curso
 */
(function (root) {
  "use strict";

  function data() { return root.ESCRITOS_DATA || {}; }
  function sentences(text) {
    return root.CTest ? root.CTest.sentences(text)
      : String(text).split(/(?<=[.!?…])\s+/).filter(Boolean);
  }

  function shuffle(a, rnd) {
    rnd = rnd || Math.random;
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  // The window of consecutive sentences with the most cohesion clues.
  function bestWindow(ss, size) {
    if (ss.length <= size) return ss;
    var best = 0, at = 0;
    for (var i = 0; i + size <= ss.length; i++) {
      var n = 0;
      for (var j = i + 1; j < i + size; j++) if (clues(ss[j]).length) n++;
      if (n > best) { best = n; at = i; }
    }
    return ss.slice(at, at + size);
  }

  /* The pieces after the anchor carry the clues: at most one without any
     (a text whose only connectors sit in one sentence cannot be ordered by
     them, it is a guess). */
  function spread(units) {
    var bare = 0;
    // a turn that answers a question has its clue in the question
    for (var i = 1; i < units.length; i++) if (!clues(units[i]).length && !/\?\s*$/.test(units[i - 1])) bare++;
    return bare <= 1;
  }
  // Each sentence without a clue joins the one before it.
  function glue(ss) {
    var out = [];
    ss.forEach(function (s, i) {
      if (i > 0 && out.length && !clues(s).length) out[out.length - 1] += " " + s;
      else out.push(s);
    });
    return out;
  }

  function build(text, opts) {
    opts = opts || {};
    var pars = String(text).split(/\n+/).map(function (p) { return p.trim(); }).filter(Boolean);
    var units, unit;
    var maxPars = opts.maxPars || 6, maxSent = opts.maxSent || 6;
    if (pars.length >= 4 && pars.length <= maxPars) { units = pars; unit = opts.unit || "párrafos"; }
    else if (pars.length > maxPars && !opts.sentences) {
      // a long text: a run of consecutive paragraphs (opts.from, or the
      // start; if its clues are not spread, the next run that has them)
      var last = pars.length - maxPars, from = Math.max(0, Math.min(last, opts.from || 0));
      for (var f = 0; f <= last; f++) {
        var at = (from + f) % (last + 1);
        if (spread(pars.slice(at, at + maxPars))) { from = at; break; }
      }
      units = pars.slice(from, from + maxPars); unit = opts.unit || "párrafos";
    }
    else {
      var ss = sentences(text).filter(function (s) { return s.split(/\s+/).length >= 3; });
      units = bestWindow(ss, maxSent); unit = "oraciones";
      // pistas amontonadas en una sola oración: cada oración sin pista se
      // pega a la anterior, así cada pieza trae algo que la ubica
      if (!spread(units)) { units = bestWindow(glue(ss), maxSent); unit = "partes"; }
    }
    if (units.length < 4 || !spread(units)) return null;
    var rest = units.map(function (_, i) { return i; }).slice(1), sh = rest;
    for (var tries = 0; tries < 10; tries++) {
      sh = shuffle(rest, opts.rnd);
      // never the right order, nor almost (at most one pair left in place)
      var kept = 0;
      for (var k = 1; k < sh.length; k++) if (sh[k] === sh[k - 1] + 1) kept++;
      if (sh[0] !== 1) kept++;
      if (kept <= 1) break;
    }
    return { unit: unit, units: units, shuffled: sh, anchor: 0 };
  }

  /* order: the indices after the anchor, as the learner placed them. */
  function grade(units, order) {
    var seq = [0].concat(order || []);
    var pairs = 0, inPlace = [];
    for (var i = 1; i < seq.length; i++) {
      if (seq[i] === seq[i - 1] + 1) pairs++;
      inPlace.push(seq[i] === i);
    }
    var of = units.length - 1;
    return { pairs: pairs, of: of, pct: of ? Math.round(pairs / of * 100) : 0, inPlace: inPlace,
             ok: pairs === of && seq.length === units.length };
  }

  function esc(s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  var L = "A-Za-zÀ-ÖØ-öø-ÿ";
  var cache = null;
  function patterns() {
    if (cache) return cache;
    var D = data(), out = [];
    (D.clues || []).slice().sort(function (a, b) { return b[0].length - a[0].length; }).forEach(function (c) {
      out.push({ re: new RegExp("(^|[^" + L + "])(" + esc(c[0]) + ")(?![" + L + "])", "gi"), word: c[0], hint: c[1], kind: "conector" });
    });
    (D.refer || []).forEach(function (w) {
      out.push({ re: new RegExp("(^|[^" + L + "])(" + esc(w) + ")(?![" + L + "])", "gi"), word: w, hint: "remite a algo ya dicho", kind: "referencia" });
    });
    cache = out;
    return out;
  }

  /* The cohesion clues of one piece, without overlaps (longer ones first). */
  function clues(unit) {
    var found = [];
    patterns().forEach(function (p) {
      p.re.lastIndex = 0;
      var m;
      while ((m = p.re.exec(unit))) {
        var at = m.index + m[1].length, end = at + m[2].length;
        if (!found.some(function (f) { return at < f.end && end > f.at; }))
          found.push({ at: at, end: end, word: unit.slice(at, end), hint: p.hint, kind: p.kind });
        if (m[0].length === 0) p.re.lastIndex++;
      }
    });
    return found.sort(function (a, b) { return a.at - b.at; });
  }

  // More pieces as the course goes on: 4 → 8.
  function level(week) {
    week = +week || 1;
    var n = week < 14 ? 4 : week < 27 ? 5 : week < 40 ? 6 : 8;
    return { maxPars: n, maxSent: n };
  }

  var api = { build: build, level: level, grade: grade, clues: clues, shuffle: shuffle, spread: spread };
  if (typeof module === "object" && module.exports) module.exports = api;
  root.Ordenar = api;
})(typeof window !== "undefined" ? window : globalThis);
