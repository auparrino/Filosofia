/*
 * La capa de frecuencia del vocabulario: cuán frecuente es cada palabra
 * (escrita y hablada) y a qué nivel MCER pertenece.  Con eso se mide la
 * cobertura (Nation 2006: los 2.000 lemas más frecuentes cubren cerca del
 * 90 % de lo que se dice; De Mauro 2016: 2.000 lemas fundamentales, el
 * 86 %), se prioriza lo frecuente que falta, se arman distractores de la
 * misma banda y se verifica en el teléfono que un texto generado use solo
 * palabras conocidas (Dugan et al. 2026).
 *
 * Datos: data/frequenza.json del paquete de cada idioma.  Lo que es de la
 * lengua viene de window.FREQ_DATA (en lang/<código>/freq_data.js): letters (las
 * letras, una clase de regex), elision (partir l'amico en l', amico), STOP
 * (las palabras gramaticales, que nunca cuentan como desconocidas),
 * stopLemmas (contar también el lema de esas palabras),
 * lemmaPre / lemmaPost (reglas de lema propias: clíticos con guion,
 * diminutivos…) y pseudo (la fonotáctica de las pseudopalabras).
 */
(function (root) {
  "use strict";

  var D = null;                 // { lemmi: {lemma: [zipfEscrito, zipfOral, nivel, pos]}, forme: {forma: lemma} }
  var LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
  var F = root.FREQ_DATA || {};
  var L = F.letters || "a-zà-ÿ";
  var RE_EDGE = new RegExp("^[^" + L + "']+|[^" + L + "']+$", "g");
  var RE_SPLIT = new RegExp("[^" + L + "'-]+");
  var RE_ELIDE = new RegExp("([" + L + "])'([" + L + "])", "g");
  // Function words a learner meets from day one: they never count as unknown.
  var STOP = F.STOP || [];
  var STOPSET = {};
  STOP.forEach(function (w) { STOPSET[w] = 1; });

  function load(data) { D = data && data.lemmi ? data : null; PLAIN = null; }
  function loaded() { return !!D; }

  function clean(w) {
    return String(w || "").toLowerCase().replace(/[’‘`´]/g, "'").replace(RE_EDGE, "");
  }
  // Tokens of a text: hyphenated words split (chamo-me → chamo, me), and
  // elided articles too where the language elides (l'amico → l', amico).
  function tokens(text) {
    var s = String(text || "").toLowerCase().replace(/[’‘`´]/g, "'");
    if (F.elision) s = s.replace(RE_ELIDE, "$1' $2");
    return s.split(RE_SPLIT).join(" ").replace(/-/g, " ").split(/\s+/).map(clean).filter(Boolean);
  }
  function lemma(w) {
    w = clean(w);
    if (!D) return w;
    if (D.lemmi[w]) return w;
    var l = D.forme[w];
    if (l) return l;
    var r = F.lemmaPre ? F.lemmaPre(w, D, lemma) : null;
    if (r) return r;
    var k = w.indexOf("'");
    if (k >= 0 && k < w.length - 1) return lemma(w.slice(k + 1));     // l'inferno, d'água
    r = F.lemmaPost ? F.lemmaPost(w, D, lemma) : null;
    if (r) return r;
    return w;
  }
  function info(w) { return D ? D.lemmi[lemma(w)] || null : null; }
  function zipf(w) { var i = info(w); return i ? Math.max(i[0], i[1]) : 0; }
  function level(w) { var i = info(w); return i && i[2] ? i[2] : ""; }
  function pos(w) { var i = info(w); return i ? i[3] : ""; }
  function known(w) { var i = info(w); return !!i && (i[0] >= 3.2 || i[1] >= 3.5 || !!i[2]); }

  /* The lemmas of the words a learner has met and holds: the words of the
     week and of the bank whose cards are past the first success (a verb
     needs three), the phrases learnt (every word in them), the readings
     done.  Returns { lemma: true }. */
  function knownLemmas(state, extra) {
    var out = {}, cards = (state && state.cards) || {};
    var add = function (text) { tokens(text).forEach(function (t) { out[lemma(t)] = true; }); };
    Object.keys(cards).forEach(function (id) {
      var c = cards[id], w = null;
      if (id.indexOf("v:") === 0) w = id.slice(2);
      else if (id.indexOf("b:voc:") === 0) w = id.slice(6);
      else if (id.indexOf("ponte:") === 0) return;
      if (w) {
        var ok = c.ok || 0, need = pos(w) === "v" ? 3 : 1;
        if (ok >= need || c.state === "maint") out[lemma(w)] = true;
        return;
      }
      if (id.indexOf("frase:") === 0 && extra && extra.phrase) { var f = extra.phrase(id); if (f && (c.ok || 0) >= 1) add(f); }
    });
    (extra && extra.texts || []).forEach(add);
    // stopLemmas: the lemma of a function word too (está → estar); not where
    // the lemma list would mistake one (dei → dio, dai → dare).
    STOP.forEach(function (w) { out[w] = true; if (F.stopLemmas) out[lemma(w)] = true; });
    return out;
  }

  /* Coverage per level: how many of the lemmas of each level the learner
     knows, and the share of the fundamental vocabulary (A1 + A2). */
  function coverage(knownSet) {
    var out = { levels: {}, fundamental: [0, 0] };
    LEVELS.forEach(function (l) { out.levels[l] = [0, 0]; });
    if (!D) return out;
    Object.keys(D.lemmi).forEach(function (l) {
      var lvl = D.lemmi[l][2];
      if (!lvl) return;
      out.levels[lvl][1]++;
      if (knownSet[l]) out.levels[lvl][0]++;
      if (lvl === "A1" || lvl === "A2") { out.fundamental[1]++; if (knownSet[l]) out.fundamental[0]++; }
    });
    return out;
  }

  // The most frequent lemmas up to a level the learner does not know yet.
  function nextWords(knownSet, maxLevel, n, posFilter) {
    if (!D) return [];
    var maxI = LEVELS.indexOf(maxLevel || "B1");
    return Object.keys(D.lemmi).filter(function (l) {
      var r = D.lemmi[l];
      return r[2] && LEVELS.indexOf(r[2]) <= maxI && !knownSet[l] && l.length > 2 && l.indexOf("'") < 0 &&
        (!posFilter || r[3] === posFilter);
    }).sort(function (a, b) { return Math.max(D.lemmi[b][0], D.lemmi[b][1]) - Math.max(D.lemmi[a][0], D.lemmi[a][1]); })
      .slice(0, n || 10);
  }

  /* Token miss rate of a text against what the learner knows (Dugan et
     al. 2026): the share of content words outside the known set.  Names
     (capitalised inside the sentence) are not counted. */
  function missRate(text, knownSet) {
    var raw = String(text || ""), miss = [], n = 0;
    raw.split(/(?<=[.!?])\s+/).forEach(function (sent) {
      sent.split(/\s+/).forEach(function (tok, i) {
        if (i > 0 && /^[A-ZÀ-Ý]/.test(tok.replace(/^[«"“(¿¡]+/, ""))) return;     // a name
        tokens(tok).forEach(function (w) {
          // an elided function word (l', dell', c') is a function word
          if (!w || STOPSET[w] || STOPSET[w.replace(/'$/, "")] || /^\d+$/.test(w)) return;
          n++;
          var l = lemma(w);
          if (!knownSet[l] && !knownSet[w]) miss.push(w);
        });
      });
    });
    return { n: n, miss: miss, rate: n ? miss.length / n : 0 };
  }

  /* Distractors of the same class and frequency band (LLM distractors are
     too rare: they give themselves away). */
  function sameBand(w, n, rnd) {
    if (!D) return [];
    var i = info(w);
    if (!i) return [];
    var z = Math.max(i[0], i[1]), l = lemma(w), out = [];
    var cand = Object.keys(D.lemmi).filter(function (x) {
      var r = D.lemmi[x];
      return x !== l && r[3] === i[3] && Math.abs(Math.max(r[0], r[1]) - z) <= 0.5 && x.length > 2 && x.indexOf("'") < 0 &&
        Math.abs(x.length - l.length) <= 3;
    });
    rnd = rnd || Math.random;
    while (cand.length && out.length < (n || 3)) out.push(cand.splice(Math.floor(rnd() * cand.length), 1)[0]);
    return out;
  }

  /* ------------------------------------------------------ pseudopalabras
     For the recognition-fluency game (real word or not, in under a
     second).  A pseudo-word is a real word with one letter of its stem
     swapped for another of its kind, keeping the phonotactics of the
     language (FREQ_DATA.pseudo: vow, cons, tries, only, endings kept,
     digraphs never broken, keep(r, w, k), ok(p)), and never a word of the
     lists (with pseudo.plain: not even once the accents are taken away or
     the plural -s is dropped). */
  var PLAIN = null;
  function isWord(p) {
    if (!D) return false;
    if (D.lemmi[p] || D.forme[p]) return true;
    var P = F.pseudo || {};
    if (!P.plain) return false;
    if (!PLAIN) {
      PLAIN = {};
      Object.keys(D.lemmi).forEach(function (x) { PLAIN[P.plain(x)] = 1; });
      Object.keys(D.forme).forEach(function (x) { PLAIN[P.plain(x)] = 1; });
    }
    var q = P.plain(p);
    return !!(PLAIN[q] || (/s$/.test(q) && PLAIN[q.slice(0, -1)]));
  }
  function pseudo(w, rnd) {
    var P = F.pseudo || {}, VOW = P.vow || "aeiou", CONS = P.cons || "bcdfglmnprstvz";
    rnd = rnd || Math.random;
    w = clean(w);
    if (w.length < 4 || (P.only && !P.only.test(w))) return null;
    var m = P.endings ? P.endings.exec(w) : null, stemEnd = m && m.index >= 2 ? m.index : w.length - 1;
    for (var tries = 0; tries < (P.tries || 20); tries++) {
      var k = 1 + Math.floor(rnd() * Math.max(1, stemEnd - 1)), c = w[k];
      if (k >= stemEnd) continue;
      if (P.digraph && (P.digraph.test(w.slice(k - 1, k + 1)) || P.digraph.test(w.slice(k, k + 2)))) continue;
      var set = VOW.indexOf(c) >= 0 ? VOW : CONS.indexOf(c) >= 0 ? CONS : null;
      if (!set) continue;                                        // accented vowels, other letters: kept
      var r = set[Math.floor(rnd() * set.length)];
      if (r === c) continue;
      var p = w.slice(0, k) + r + w.slice(k + 1);
      if (P.keep && !P.keep(r, w, k)) continue;
      if ((!P.ok || P.ok(p)) && !isWord(p) && !info(p)) return p;
    }
    return null;
  }

  var api = { load: load, loaded: loaded, LEVELS: LEVELS, tokens: tokens, lemma: lemma, info: info, zipf: zipf, level: level,
              pos: pos, known: known, knownLemmas: knownLemmas, coverage: coverage, nextWords: nextWords, missRate: missRate,
              sameBand: sameBand, pseudo: pseudo, STOP: STOP };
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Freq = api;
})(typeof window !== "undefined" ? window : globalThis);
