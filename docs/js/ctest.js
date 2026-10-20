/*
 * C-test y cloze racional sobre un texto que ya leíste.
 *
 * C-test (Klein-Braley 1985; Klein-Braley y Raatz 1984): la primera
 * oración queda entera; desde la segunda, a cada segunda palabra se le
 * borra la segunda mitad (si tiene un número impar de letras, la mitad más
 * larga).  Se reconstruye el texto con lo que se entiende del contexto y lo
 * que se sabe de la forma: mide la competencia general y obliga a mirar
 * terminaciones, artículos y concordancias.  Hasta 25 huecos; la última
 * oración también queda entera cuando el texto da para eso.
 *
 * Cloze racional (Bachman 1985): no se borra cada n-ésima palabra sino las
 * que elige quien diseña; acá, solo los conectores y las preposiciones
 * (simples y contraídas) de la lista del paquete (ESCRITOS_DATA.conn /
 * .prep): la cohesión y el régimen, lo que el hispanohablante transfiere
 * mal.  Espaciados, hasta 15.
 *
 * Solo la mecánica, sin DOM: build() arma los tramos y los huecos,
 * grade() corrige cada hueco.  La pantalla está en escritos.js.
 *
 * La dificultad según la semana (level(week)): cuántos huecos, desde qué
 * largo se corta una palabra (al principio, tres letras o más: cortar *un*
 * o *lo* en un teléfono son toques que no enseñan), cada cuántas palabras
 * va un hueco del cloze y si entran las conjunciones de una letra (*e*,
 * *a*), que casi no informan.
 *
 * API (window.CTest y module.exports):
 *   level(week)              {ctest: {max, minLen}, cloze: {max, every, minLen}}
 *   build(text, mode, opts)  {mode, parts: [{t} | {gap}], gaps: [{k, shown,
 *                            answer, full, cat, alt}], sentences}
 *   grade(gap, given)        "giusto" | "quasi" | "sbagliato"
 *   score(gaps, answers)     {right, close, n, pct, per: [verdict…]}
 *   sentences(text)          el texto partido en oraciones
 */
(function (root) {
  "use strict";

  var LETTERS = "A-Za-zÀ-ÖØ-öø-ÿ";
  var WORD = new RegExp("^([^" + LETTERS + "]*)([" + LETTERS + "]+(?:['’][" + LETTERS + "]+)*(?:-[" + LETTERS + "]+)*)([^" + LETTERS + "]*)$");
  var END = /[.!?…]["»”)]*$/;

  function data() { return root.ESCRITOS_DATA || {}; }

  function deaccent(s) { return String(s).normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function norm(s) { return String(s == null ? "" : s).toLowerCase().replace(/[’`´]/g, "'").replace(/\s+/g, " ").trim(); }

  /* Tokens with their spacing: [{raw, lead, word, trail, space, sent, par}]. */
  function tokenize(text) {
    var out = [], sent = 0, par = 0;
    var bits = String(text).split(/(\s+)/);
    for (var i = 0; i < bits.length; i += 2) {
      var raw = bits[i], space = bits[i + 1] || "";
      if (!raw) { if (out.length) out[out.length - 1].space += space; continue; }
      var m = WORD.exec(raw);
      var tok = { raw: raw, lead: m ? m[1] : raw, word: m ? m[2] : "", trail: m ? m[3] : "", space: space, sent: sent, par: par };
      out.push(tok);
      if (END.test(raw)) sent++;
      if (/\n/.test(space)) { par++; if (!END.test(raw)) sent++; }
    }
    return out;
  }

  function sentences(text) {
    var toks = tokenize(text), out = [];
    toks.forEach(function (t) {
      if (!out[t.sent]) out[t.sent] = "";
      out[t.sent] += t.raw + (/\n/.test(t.space) ? " " : t.space);
    });
    return out.filter(Boolean).map(function (s) { return s.trim(); });
  }

  // A word the C-test may damage: only letters (no apostrophe, hyphen or
  // digit), two letters or more, not a name (capitalised in mid-sentence,
  // or at the start of a sentence when the text never has it in lower case).
  function damageable(t, toks, k, lower, minLen) {
    var w = t.word;
    if (!w || w.length < (minLen || 2) || /['’\-]/.test(w)) return false;
    if (/^[A-ZÀ-ÖØ-Þ]/.test(w)) {
      var first = k === 0 || toks[k - 1].sent !== t.sent;
      if (!first || !lower[w.toLowerCase()]) return false;
    }
    return true;
  }

  function buildCtest(text, opts) {
    var toks = tokenize(text), max = opts.max || 25;
    var nSent = toks.length ? toks[toks.length - 1].sent + 1 : 0;
    var lower = {};
    toks.forEach(function (t) { if (t.word && !/^[A-ZÀ-ÖØ-Þ]/.test(t.word)) lower[t.word.toLowerCase()] = 1; });
    var lastSent = nSent >= 4 ? nSent - 1 : nSent;
    var gaps = [], count = 0, stop = -1;
    // Klein-Braley: from the second word of the second sentence, every
    // second word (the first one counted stays whole).
    toks.forEach(function (t, k) {
      if (gaps.length >= max) { if (stop < 0) stop = t.sent + 1; return; }
      if (t.sent < 1 || t.sent >= lastSent) return;
      if (!damageable(t, toks, k, lower, opts.minLen)) return;
      count++;
      if (count % 2 === 0) {
        var keep = Math.floor(t.word.length / 2);
        t.gap = gaps.length;
        gaps.push({ k: gaps.length, shown: t.word.slice(0, keep), answer: t.word.slice(keep), full: t.word, cat: "ctest" });
      }
    });
    return finish(toks, gaps, stop, "ctest");
  }

  function buildCloze(text, opts) {
    var D = data(), max = opts.max || 15, gapEvery = opts.every || 4;
    var conn = {}, prep = {}, equiv = {};
    (D.conn || []).forEach(function (w) { conn[w] = 1; });
    (D.prep || []).forEach(function (w) { prep[w] = 1; });
    (D.equiv || []).forEach(function (g) { g.forEach(function (w) { equiv[w] = g; }); });
    var toks = tokenize(text), gaps = [], since = gapEvery, seen = {};
    toks.forEach(function (t) {
      since++;
      if (gaps.length >= max || t.sent < 1 || !t.word) return;
      var w = t.word.toLowerCase(), cat = conn[w] ? "conector" : prep[w] ? "preposición" : null;
      if (!cat || since < gapEvery || w.length < (opts.minLen || 1)) return;
      // variety: the same word at most three times
      if ((seen[w] = (seen[w] || 0) + 1) > 3) return;
      since = 0;
      t.gap = gaps.length;
      gaps.push({ k: gaps.length, shown: "", answer: t.word, full: t.word, cat: cat,
                  alt: (equiv[w] || []).filter(function (x) { return x !== w; }) });
    });
    return finish(toks, gaps, -1, "cloze");
  }

  /* The parts to draw: text runs and gaps (with what surrounds the word). */
  function finish(toks, gaps, stop, mode) {
    var parts = [], buf = "";
    var flush = function () { if (buf) { parts.push({ t: buf }); buf = ""; } };
    for (var i = 0; i < toks.length; i++) {
      var t = toks[i];
      // a long text is cut one sentence after the last gap
      if (stop >= 0 && t.sent > stop) break;
      if (t.gap == null) { buf += t.raw + t.space; continue; }
      buf += t.lead;
      flush();
      parts.push({ gap: t.gap });
      buf += t.trail + t.space;
    }
    flush();
    return { mode: mode, parts: parts, gaps: gaps };
  }

  /* The difficulty of the week: fewer gaps and longer words at the start,
     the full Klein-Braley test from the third season. */
  function level(week) {
    week = +week || 1;
    return {
      ctest: { max: week < 14 ? 15 : week < 27 ? 20 : week < 40 ? 25 : 30, minLen: week < 27 ? 3 : 2 },
      cloze: { max: week < 14 ? 8 : week < 27 ? 12 : week < 40 ? 15 : 20, every: week < 27 ? 5 : week < 40 ? 4 : 3,
               minLen: week < 40 ? 2 : 1 }
    };
  }

  function build(text, mode, opts) {
    opts = opts || {};
    return mode === "cloze" ? buildCloze(text, opts) : buildCtest(text, opts);
  }

  /* One gap: exact (without looking at case) is right; the whole word
     typed in a C-test gap is right too; the same letters without the
     accent (or with another one) is close; an equivalent connector
     (ma / però) is right. */
  function grade(gap, given) {
    var g = norm(given), a = norm(gap.answer);
    if (!g) return "sbagliato";
    if (g === a) return "giusto";
    if (gap.cat === "ctest" && g === norm(gap.full)) return "giusto";
    if ((gap.alt || []).some(function (x) { return norm(x) === g; })) return "giusto";
    if (deaccent(g) === deaccent(a) || (gap.cat === "ctest" && deaccent(g) === deaccent(norm(gap.full)))) return "quasi";
    return "sbagliato";
  }

  function score(gaps, answers) {
    var per = gaps.map(function (gp, i) { return grade(gp, (answers || [])[i]); });
    var right = per.filter(function (v) { return v === "giusto"; }).length;
    var close = per.filter(function (v) { return v === "quasi"; }).length;
    var n = gaps.length;
    return { right: right, close: close, n: n, per: per, pct: n ? Math.round((right + close * 0.5) / n * 100) : 0 };
  }

  var api = { build: build, level: level, grade: grade, score: score, sentences: sentences, tokenize: tokenize, norm: norm };
  if (typeof module === "object" && module.exports) module.exports = api;
  root.CTest = api;
})(typeof window !== "undefined" ? window : globalThis);
