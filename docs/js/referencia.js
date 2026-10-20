/*
 * Referencia: «¿Cómo se usa de verdad?» y «Mi gramática».
 *
 * Concordancias.  Al tocar un concepto (los de la semana, el diccionario
 * de «Consultar») se ven de 5 a 8 oraciones reales del curso —ejemplos de
 * las lecciones y de los conceptos— con la forma resaltada, solo de lo que el alumno ya puede leer
 * (semana ≤ la desbloqueada), y un mini ejercicio: de dos usos, cuál está
 * bien.  Aprendizaje basado en datos: mirar muchos usos reales de una forma
 * enseña su gramática y sus combinaciones mejor que una regla sola (Boulton
 * & Cobb 2017, metaanálisis: d ≈ 0,95).
 *
 * «Mi gramática».  El índice de todas las construcciones vistas hasta la
 * semana actual (los bloques de las lecciones: título, regla corta, tabla),
 * cada una con ejemplos de las lecturas, cuántas veces se acertó y se falló
 * (tarjetas de los ejercicios de esa semana que usan sus formas, el registro
 * de errores y los mini ejercicios de acá) y un estado: vista,
 * practicada o dominada.  Se puede buscar.
 *
 * Todo sale de lo que ya trae el paquete de la edición (course.json, con
 * sus conceptos, y Lezione.traps): el núcleo no nombra ninguna edición.
 * La lógica no necesita el DOM; la parte de pantalla se activa cuando
 * app.js llama a Referencia.attach(hooks).
 *
 *   Referencia.setData({ course })
 *   Referencia.concordance("andato", { week: 12 })
 *     → { term, lemma, es, forms, hits: [{ t, es, w, src, label, marks }], total, later }
 *   Referencia.grammar(12)  → [{ id, week, h, r, table, forms, … }]
 *   Referencia.exercise({ forms, hits }, 12, rnd) → { right, wrong, why, good, bad }
 *   Referencia.blockStats(block, state) → { ok, ko, status }
 */
(function (root) {
  "use strict";

  var D = { course: null };
  var CORPUS = null;          // [{ t, low, es, w, src, label, ref, toks: [[form, start, end]], seq: [form] }]
  var INDEX = null;           // form → [sentence index]
  var VOCAB = null;           // the concepts of the course: lower(term) → { term, es, week }
  var BLOCKS = null;          // every block of every lesson, with its forms
  var ITEMS_BY_WEEK = null;
  var COLL = null;            // the combinations the notes of the course teach (collIndex)

  var L = "a-zà-öø-ÿ";
  var TOKEN_RE = new RegExp("[" + L + "]+(?:-[" + L + "]+)*'?", "gi");

  var SRC = { leccion: ["📘", "Lección"], palabra: ["📚", "Concepto"] };
  var SRC_ORDER = ["leccion", "palabra"];

  function lower(s) { return String(s == null ? "" : s).replace(/[’`]/g, "'").toLowerCase(); }
  function plain(s) { return lower(s).normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function strip(s) {
    return String(s == null ? "" : s).replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1").trim();
  }

  function setData(d) {
    d = d || {};
    if (d.course !== undefined && d.course !== D.course) { D.course = d.course; CORPUS = INDEX = BLOCKS = ITEMS_BY_WEEK = VOCAB = null; COLL = null; }
  }
  // The concepts of every week (week.vocab: [term, meaning, example, tip]).
  function vocab() {
    if (VOCAB) return VOCAB;
    VOCAB = {};
    ((D.course && D.course.weeks) || []).forEach(function (w) {
      (w.vocab || []).forEach(function (v) {
        var k = lower(v[0]);
        if (v[0] && !VOCAB[k]) VOCAB[k] = { term: v[0], es: v[1] || "", week: w.week };
      });
    });
    return VOCAB;
  }

  /* ------------------------------------------------------------ el corpus */

  // Tokens of a text with where they are: a hyphenated word counts whole
  // and by parts (chamo-me → chamo-me, chamo, me).
  function tokenize(text) {
    var t = String(text).replace(/[’`]/g, "'"), out = [], seq = [], m;
    TOKEN_RE.lastIndex = 0;
    while ((m = TOKEN_RE.exec(t))) {
      var w = m[0].toLowerCase(), at = m.index;
      if (w.indexOf("-") > 0) {
        out.push([w, at, at + w.length]);
        var off = at;
        w.split("-").forEach(function (p) { out.push([p, off, off + p.length]); seq.push([p, off, off + p.length]); off += p.length + 1; });
      } else {
        var tok = [w, at, at + w.length];
        out.push(tok); seq.push(tok);
        // l'uomo → «l'» and also «l»: dell'anno is found as dell'
        if (/'$/.test(w)) out.push([w.slice(0, -1), at, at + w.length - 1]);
      }
    }
    return { toks: out, seq: seq };
  }

  function add(list, seen, t, es, w, src, label, ref) {
    t = strip(t).replace(/\s+/g, " ");
    if (!t || /_{2,}| \/ /.test(t)) return;
    var key = lower(t).replace(/[^a-zà-öø-ÿ' ]/g, "").replace(/\s+/g, " ").trim();
    if (!key || seen[key]) return;
    var tk = tokenize(t);
    if (tk.seq.length < 3 || tk.seq.length > 30) return;
    seen[key] = 1;
    list.push({ t: t, es: es || "", w: +w || 1, src: src, label: label || "", ref: ref || "", toks: tk.toks, seq: tk.seq });
  }

  function corpus() {
    if (CORPUS) return CORPUS;
    var list = [], seen = {};
    // The lessons' examples and the examples of the week's words.
    var C = D.course;
    ((C && C.weeks) || []).forEach(function (w) {
      ((w.lesson && w.lesson.blocks) || []).forEach(function (b, i) {
        (b.ex || []).forEach(function (p) {
          if (/\*[^*\s]+\*[a-zà-ÿ]|[a-zà-ÿ]\*[^*\s]+\*/i.test(p[0])) return;   // «*j*azz»: spelling, not usage
          add(list, seen, p[0], p[1], w.week, "leccion", b.h, blockId(w.week, i));
        });
      });
      (w.vocab || []).forEach(function (v) { if (v[2]) add(list, seen, v[2], "", w.week, "palabra", v[0], "v:" + v[0]); });
    });
    CORPUS = list;
    INDEX = {};
    list.forEach(function (s, k) {
      var mine = {};
      s.toks.forEach(function (t) { if (!mine[t[0]]) { mine[t[0]] = 1; (INDEX[t[0]] = INDEX[t[0]] || []).push(k); } });
    });
    return CORPUS;
  }

  /* -------------------------------------------------------- las formas */

  function articles() {
    var R = root.LANG && root.LANG.rules, d = R && R.distract, out = {};
    ((d && d.artSg) || []).concat((d && d.artPl) || []).forEach(function (a) { out[lower(a)] = 1; });
    return out;
  }

  // «a aliança» (the glossary brings nouns with their article) → «aliança».
  function bareTerm(t) {
    var ws = lower(t).trim().split(/\s+/), arts = articles();
    if (ws.length > 1 && arts[ws[0].replace(/'$/, "")]) ws = ws.slice(1);
    if (ws.length === 1 && /^[a-zà-öø-ÿ]+'[a-zà-öø-ÿ]/.test(ws[0])) ws = [ws[0].split("'")[1]];   // l'amico → amico
    return ws.join(" ");
  }

  /* The forms of a word: the word as it is written, and its meaning when
     it is a concept of the course. */
  function formsOf(term) {
    var t = bareTerm(term), V = vocab();
    var e = V[lower(term)] || V[t] || null;
    return { term: t, lemma: t, es: e ? e.es : "", forms: [t] };
  }

  /* ------------------------------------------------------- concordancias */

  // Where the form is in the sentence: [start, end] or null.
  function find(s, form) {
    var ws = form.split(/\s+/);
    if (ws.length === 1) {
      for (var i = 0; i < s.toks.length; i++) if (s.toks[i][0] === form) return [s.toks[i][1], s.toks[i][2]];
      return null;
    }
    for (var k = 0; k + ws.length <= s.seq.length; k++) {
      var ok = true;
      for (var j = 0; j < ws.length && ok; j++) if (s.seq[k + j][0] !== ws[j]) ok = false;
      if (ok) return [s.seq[k][1], s.seq[k + ws.length - 1][2]];
    }
    return null;
  }

  function candidates(forms) {
    corpus();
    var ids = {};
    forms.forEach(function (f) {
      var first = f.split(/\s+/)[0];
      (INDEX[first] || []).forEach(function (k) { ids[k] = 1; });
    });
    return Object.keys(ids).map(Number);
  }

  function marksIn(s, forms) {
    var marks = [];
    forms.forEach(function (f) {
      var m = find(s, f);
      if (m && !marks.some(function (x) { return m[0] < x[1] && x[0] < m[1]; })) marks.push(m);
    });
    return marks.sort(function (a, b) { return a[0] - b[0]; });
  }

  /* Up to opts.max sentences (8) with the forms, only from week ≤ opts.week:
     the exact form first, then the other forms; sources taken in turns so
     the page shows lessons and concepts; short sentences first. */
  function pickHits(forms, opts) {
    opts = opts || {};
    var week = opts.week || 999, max = opts.max || 8, exact = opts.exact || [];
    var skip = opts.skip || null;
    var all = candidates(forms), later = 0, total = 0, buckets = {};
    all.forEach(function (k) {
      var s = CORPUS[k];
      if (skip && skip(s)) return;
      var marks = marksIn(s, forms);
      if (!marks.length) return;
      if (s.w > week) { if (!later || s.w < later) later = s.w; return; }
      total++;
      var isExact = exact.some(function (f) { return !!find(s, f); });
      var n = s.seq.length;
      var score = (isExact ? 100 : 0) - Math.abs(n - 9) - (n > 18 ? 10 : 0) + (s.es ? 2 : 0) + s.w / 52;
      (buckets[s.src] = buckets[s.src] || []).push({ s: s, marks: marks, score: score, exact: isExact });
    });
    Object.keys(buckets).forEach(function (b) { buckets[b].sort(function (x, y) { return y.score - x.score || x.s.t.length - y.s.t.length; }); });
    var out = [], round = 0, more = true;
    while (out.length < max && more) {
      more = false;
      // exact matches of every source before the other forms
      SRC_ORDER.forEach(function (src) {
        var b = buckets[src];
        if (!b || out.length >= max) return;
        if (b.length > round) { more = true; out.push(b[round]); }
      });
      round++;
    }
    out.sort(function (a, b) { return (b.exact ? 1 : 0) - (a.exact ? 1 : 0); });
    return {
      hits: out.map(function (h) {
        return { t: h.s.t, es: h.s.es, w: h.s.w, src: h.s.src, label: h.s.label, ref: h.s.ref, marks: h.marks, exact: h.exact };
      }),
      total: total, later: later
    };
  }

  function concordance(term, opts) {
    opts = opts || {};
    var f = formsOf(term);
    var r = pickHits(f.forms, { week: opts.week, max: opts.max, exact: [f.term] });
    return { kind: "word", term: f.term, lemma: f.lemma, es: f.es, forms: f.forms, hits: r.hits, total: r.total, later: r.later };
  }

  /* ------------------------------------------------------ las construcciones */

  function blockId(week, i) { return "w" + week + "b" + i; }

  /* The forms a block teaches: what its examples mark (*sono andato*), then
     what its rule marks; whole words only, up to four words each. */
  function blockForms(b) {
    var out = [];
    var take = function (text, fromEx) {
      var re = /\*([^*]+)\*/g, m, s = String(text || "");
      while ((m = re.exec(s))) {
        var before = s.charAt(m.index - 1), after = s.charAt(m.index + m[0].length);
        if (/[a-zà-öø-ÿ]/i.test(before) || /[a-zà-öø-ÿ]/i.test(after)) continue;   // part of a word
        m[1].split(/\s*(?:,|\/|;|…|\.\.\.)\s*/).forEach(function (f) {
          f = lower(f).replace(/[^a-zà-öø-ÿ' -]/g, " ").replace(/\s+/g, " ").trim();
          if (!f || /^-|-$/.test(f) || f.split(" ").length > 4 || f.length < 1) return;
          if (!fromEx && f.split(" ").length === 1 && f.length < 3) return;
          if (out.indexOf(f) < 0) out.push(f);
        });
      }
    };
    (b.ex || []).forEach(function (p) { take(p[0], true); });
    take(b.r, false);
    // Only forms of the language (the rule also marks Spanish: *puedo*,
    // *de salud*): every word must be in the course's sentences.
    corpus();
    out = out.filter(function (f) { return f.split(" ").every(function (w) { return INDEX[w]; }); });
    // Subject pronouns and the little words the lessons never highlight
    // (LANG.hlStop) are not the construction: they are in every sentence.
    var skip = {}, LG = root.LANG || {};
    Object.keys(LG.hlStop || {}).forEach(function (w) { skip[lower(w)] = 1; });
    var real = out.filter(function (f) { return !skip[f]; });
    if (real.length) out = real;
    // A block with real forms drops the tiny ones (e, a, o): they are everywhere.
    if (out.some(function (f) { return f.length >= 3 || / /.test(f); }))
      out = out.filter(function (f) { return f.length >= 3 || / /.test(f); });
    return out.slice(0, 14);
  }

  function blocks() {
    if (BLOCKS) return BLOCKS;
    BLOCKS = [];
    ((D.course && D.course.weeks) || []).forEach(function (w) {
      ((w.lesson && w.lesson.blocks) || []).forEach(function (b, i) {
        if (!b.h && !b.r) return;
        BLOCKS.push({ id: blockId(w.week, i), week: w.week, weekTitle: w.title, level: w.level, i: i,
                      h: b.h || "", r: b.r || "", table: b.table || null, ex: b.ex || [], warn: b.warn || "",
                      tip: b.tip || "", forms: blockForms(b) });
      });
    });
    return BLOCKS;
  }

  // The constructions seen up to the week.
  function grammar(week) {
    week = week || 999;
    return blocks().filter(function (b) { return b.week <= week; });
  }

  function blockById(id) {
    var bs = blocks();
    for (var i = 0; i < bs.length; i++) if (bs[i].id === id) return bs[i];
    return null;
  }

  function blockConcordance(b, opts) {
    opts = opts || {};
    var r = pickHits(b.forms, { week: opts.week, max: opts.max,
                                skip: function (s) { return s.ref === b.id; } });
    return { kind: "block", id: b.id, term: b.h, forms: b.forms, hits: r.hits, total: r.total, later: r.later };
  }

  function haystack(b) {
    var t = [b.h, b.r, b.warn, b.tip, b.weekTitle].concat(b.forms);
    if (b.table) t = t.concat(b.table.head || [], [].concat.apply([], b.table.rows || []));
    (b.ex || []).forEach(function (p) { t.push(p[0], p[1]); });
    return plain(strip(t.join(" ")));
  }

  // Search: every word of the query somewhere in the block (no accents needed).
  function search(list, q) {
    var ws = plain(q).split(/\s+/).filter(Boolean);
    if (!ws.length) return list;
    return list.filter(function (b) {
      var h = b._hay || (b._hay = haystack(b));
      return ws.every(function (w) { return h.indexOf(w) >= 0; });
    });
  }

  /* ---------------------------------------------------- aciertos y estado */

  function textHas(text, forms) {
    var s = { toks: tokenize(text).toks, seq: tokenize(text).seq };
    return forms.some(function (f) { return !!find(s, f); });
  }

  function itemsOfWeek(week) {
    if (!ITEMS_BY_WEEK) {
      ITEMS_BY_WEEK = {};
      ((D.course && D.course.items) || []).forEach(function (it) {
        var w = it.wk || it.w;
        if (w) (ITEMS_BY_WEEK[w] = ITEMS_BY_WEEK[w] || []).push(it);
      });
    }
    return ITEMS_BY_WEEK[week] || [];
  }

  /* How often the block was answered right and wrong: the review cards of
     that week's exercises that use its forms, the errors
     of the log that were about them, and the mini exercises of this page. */
  function blockStats(b, state) {
    state = state || {};
    var cards = state.cards || {}, ok = 0, ko = 0, seen = 0;
    var forms = b.forms;
    var count = function (id) {
      var c = cards[id];
      if (!c) return;
      seen++;
      ok += c.ok || 0;
      ko += c.lapses || 0;
    };
    if (forms.length) {
      itemsOfWeek(b.week).forEach(function (it) {
        if (cards[it.id] && textHas([it.stem, it.answer].join(" "), forms)) count(it.id);
      });
      // the error log: only forms long enough not to be everywhere
      var long = forms.filter(function (f) { return f.length >= 4 || / /.test(f); });
      if (long.length) (state.errLog || []).forEach(function (l) { if (l.e && textHas(l.e, long)) ko++; });
    }
    var mine = ((state.ref || {}).b || {})[b.id];
    if (mine) { ok += mine[0] || 0; ko += (mine[1] || 0) - (mine[0] || 0); }
    var n = ok + ko;
    var ws = (state.weekStats || {})[b.week] || {};
    var consolidated = !!(ws.prodDays && ws.prodDays.length >= 3) || !!ws.bossPassed;
    var status = "vista";
    if (n >= 3 || (mine && mine[1])) status = "practicada";
    if (n >= 6 && ok / n >= 0.85 && (consolidated || n >= 12)) status = "dominada";
    return { ok: ok, ko: ko, cards: seen, status: status };
  }

  /* -------------------------------------------------------- el ejercicio */

  function shuffle(a, rnd) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  // The first word that differs between two versions of a sentence.
  function diff(a, b) {
    var x = a.split(" "), y = b.split(" "), i = 0, j;
    while (i < x.length && i < y.length && x[i] === y[i]) i++;
    var ex = x.length - 1, ey = y.length - 1;
    while (ex > i && ey > i && x[ex] === y[ey]) { ex--; ey--; }
    j = { good: x.slice(i, ex + 1).join(" "), bad: y.slice(i, ey + 1).join(" ") };
    j.good = j.good.replace(/^[^a-zà-öø-ÿ']+|[^a-zà-öø-ÿ']+$/gi, "");
    j.bad = j.bad.replace(/^[^a-zà-öø-ÿ']+|[^a-zà-öø-ÿ']+$/gi, "");
    return j;
  }

  /* Two uses, one right: one of the concordance sentences with a trap of
     the lessons (Lezione.traps, only the changes that are always wrong) on
     the form. */
  function exercise(q, week, rnd) {
    rnd = rnd || Math.random;
    week = week || 999;
    var forms = q.forms || [], hits = q.hits || [];
    var fromTraps = function (onForm) {
      var LZ = root.Lezione;
      if (!LZ || !LZ.traps) return null;
      // the exact form the learner tapped first
      var hs = shuffle(hits, rnd).sort(function (a, b) { return (b.exact ? 1 : 0) - (a.exact ? 1 : 0); });
      for (var i = 0; i < hs.length; i++) {
        var t = hs[i].t, tr;
        try { tr = LZ.traps(t, rnd, week, null, true) || []; } catch (e) { tr = []; }
        for (var k = 0; k < tr.length; k++) {
          if (tr[k] === t) continue;
          var d = diff(t, tr[k]);
          if (!d.good || !d.bad || lower(d.good) === lower(d.bad)) continue;
          var g2 = " " + lower(d.good) + " ";
          var touches = forms.some(function (f) { return (" " + f + " ").indexOf(g2) >= 0 || g2.indexOf(" " + f + " ") >= 0; });
          if (onForm && !touches) continue;
          return { right: t, wrong: tr[k], why: "", good: d.good, bad: d.bad, src: hs[i].src };
        }
      }
      return null;
    };
    var r = fromTraps(true) || fromTraps(false);
    return r && r.right !== r.wrong ? r : null;
  }

  /* The id of a lesson block given the block itself (the lesson and the
     «¿Por qué?» sheet draw the object, not its place). */
  function blockIdOf(b) {
    var ws = (D.course && D.course.weeks) || [];
    for (var k = 0; k < ws.length; k++) {
      var bs = (ws[k].lesson && ws[k].lesson.blocks) || [];
      for (var i = 0; i < bs.length; i++) if (bs[i] === b) return blockId(ws[k].week, i);
    }
    return null;
  }

  /* ------------------------------------------------------- el diccionario */

  /* «Consultar»: un concepto con lo que el curso sabe de él —qué
     significa, la semana en que se enseña, las combinaciones que las notas
     del curso enseñan y 3-5 usos reales ya leídos. */
  // COLL: [{ l: left, r: right, rl: [words of the right], w, topic }]
  function arts() { return articles(); }
  function collIndex() {
    if (COLL) return COLL;
    COLL = [];
    var seen = {}, A = arts();
    ((D.course && D.course.items) || []).forEach(function (it) {
      if (!it || !it.note || String(it.note).indexOf("→") < 0) return;
      String(it.note).split(/(?:[.;])\s+/).forEach(function (s) {
        var m = /^(.{2,60}?)\s*→\s*(.+)$/.exec(s.trim());
        if (!m) return;
        var left = strip(m[1]).replace(/^.*?:\s*/, "").trim(), right = strip(m[2]).split(/[:(;]|, (?=[a-zà-ÿ]+ )/)[0].replace(/[.«»"]+$/g, "").trim();
        var ws = (right.toLowerCase().match(TOKEN_RE) || []);
        // a combination: at least two words of the language that are not articles
        if (ws.filter(function (w) { return !A[w.replace(/'$/, "")]; }).length < 2 || ws.length > 6 || !left) return;
        // and on the left, what one says in Spanish: two words or more (not «ir → fomos»)
        if (left.replace(/\([^)]*\)/g, " ").split(/\s+/).filter(function (w) { return /[a-záéíóúñ]/i.test(w); }).length < 2) return;
        var key = plain(left + "→" + right);
        if (seen[key]) return;
        seen[key] = 1;
        COLL.push({ l: left, r: right, rl: ws, w: +(it.w || it.wk) || 1, topic: it.topic || "" });
      });
    });
    return COLL;
  }
  function collocations(forms, max) {
    var set = {};
    forms.forEach(function (f) { if (!/ /.test(f)) set[f] = 1; });
    var out = collIndex().filter(function (c) { return c.rl.some(function (w) { return set[w]; }); });
    return out.sort(function (a, b) { return a.w - b.w; }).slice(0, max || 6);
  }
  function lookup(term, opts) {
    opts = opts || {};
    var week = opts.week || 999, f = formsOf(term), V = vocab();
    var e = V[lower(term)] || V[f.term] || null;
    var r = pickHits(f.forms, { week: week, max: opts.max || 5, exact: [f.term] });
    return { term: f.term, lemma: f.lemma, es: f.es, taught: e ? e.week : 0,
             colloc: collocations(f.forms), hits: r.hits, total: r.total, later: r.later,
             forms: f.forms, known: !!(e || r.total) };
  }

  /* Suggestions for the search box: the concepts that start with the
     query, and then the ones whose meaning has it. → [{ w, lemma, es, week }] */
  function suggest(q, n) {
    n = n || 8;
    var V = vocab(), p = plain(q).trim();
    if (!p || p.length < 2) return [];
    var out = [], seen = {};
    var add = function (k) {
      var e = V[k];
      if (seen[k]) return;
      seen[k] = 1;
      out.push({ w: e.term, lemma: e.term, es: e.es, week: e.week });
    };
    var keys = Object.keys(V);
    keys.filter(function (k) { return plain(k).indexOf(p) === 0; })
      .sort(function (a, b) { return a.length - b.length; })
      .forEach(function (k) { if (out.length < n) add(k); });
    if (out.length < n) {
      var re = new RegExp("(^|[^a-zñ])" + p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "([^a-zñ]|$)");
      keys.filter(function (k) { return re.test(plain(V[k].es)); })
        .sort(function (a, b) { return a.length - b.length; })
        .forEach(function (k) { if (out.length < n) add(k); });
    }
    return out;
  }

  /* ------------------------------------------------------------- guardado */

  // state.ref = { b: { blockId: [right, answered] }, w: { lemma: [right, answered] } }
  function record(state, kind, key, ok) {
    if (!state || !key) return;
    var R = state.ref || (state.ref = {});
    var bag = R[kind] || (R[kind] = {});
    var e = bag[key] || (bag[key] = [0, 0]);
    if (ok) e[0]++;
    e[1]++;
  }

  /* ================================================================ pantalla */

  var H = null;               // hooks from app.js
  var sheetQ = null;          // what the sheet shows
  var gramState = { q: "", filter: "", focus: null };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function mk(text) {
    return esc(text).replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>").replace(/\*([^*]+)\*/g, '<i class="it">$1</i>');
  }
  function st() { return (H && H.state && H.state()) || {}; }
  function curWeek() { return Math.min(Math.max(st().unlocked || 1, 1), root.Engine.weeks()); }
  function refresh() {
    if (!H) return;
    var c = H.course && H.course();
    if (c && c !== D.course) setData({ course: c });
  }

  function hlHtml(h) {
    var t = h.t, out = "", at = 0;
    h.marks.forEach(function (m) {
      out += esc(t.slice(at, m[0])) + '<mark class="ref-hl">' + esc(t.slice(m[0], m[1])) + "</mark>";
      at = m[1];
    });
    return out + esc(t.slice(at));
  }

  function hitsHtml(hits) {
    return '<ol class="ref-hits">' + hits.map(function (h) {
      var s = SRC[h.src] || ["•", ""];
      return '<li><span class="ref-t">' + hlHtml(h) + "</span>" +
        (h.es ? '<span class="ref-es">' + esc(h.es) + "</span>" : "") +
        '<small class="ref-src">' + s[0] + " " + s[1] + (h.label ? " · " + esc(h.label) : "") + " · sem. " + h.w + "</small></li>";
    }).join("") + "</ol>";
  }

  // Does the word have uses to show? (the glossary box offers the button)
  function has(term) {
    refresh();
    if (!term || !D.course) return false;
    try { refresh(); return concordance(term, { week: curWeek(), max: 1 }).total > 0; } catch (e) { return false; }
  }

  function exHtml(ex) {
    if (!ex) return '<p class="muted small">Todavía no hay un ejercicio para esto con lo que ya podés leer.</p>';
    var opts = [[ex.right, 1], [ex.wrong, 0]];
    if (Math.random() < 0.5) opts.reverse();
    return '<div class="ref-ex"><h3>¿Cuál está bien?</h3><div class="options ref-opts">' +
      opts.map(function (o) { return '<button class="opt" data-refans="' + o[1] + '">' + esc(o[0]) + "</button>"; }).join("") +
      '</div><div class="ref-why" hidden></div></div>';
  }

  function sheetHtml(q) {
    var head;
    if (q.kind === "block") {
      head = '<p class="muted small">¿Cómo se usa de verdad?</p><h2>' + mk(q.term) + "</h2>";
    } else {
      head = '<p class="muted small">¿Cómo se usa de verdad?</p><h2><i class="it">' + esc(q.term) + "</i>" +
        (q.lemma && q.lemma !== q.term ? ' <small class="muted">de <i class="it">' + esc(q.lemma) + "</i></small>" : "") + "</h2>" +
        (q.es ? '<p class="ref-gloss">' + esc(q.es) + "</p>" : "");
    }
    var body, foot = "";
    if (q.kind === "block") {
      // where it stands, and the way to the whole index (not in the middle of a round)
      var b = blockById(q.id), x = b ? blockStats(b, st()) : null, S = x ? STATUS[x.status] : null;
      var ingame = typeof document !== "undefined" && document.body && document.body.classList.contains("ingame");
      if (b && b.week > curWeek()) head += '<p class="muted small">🔒 Esto llega en la semana ' + b.week + ": te lo adelanto para consultar.</p>";
      else if (S) head += '<p class="small"><span class="ref-st ' + x.status + '">' + S[0] + " " + S[1] + "</span>" +
        (x.ok + x.ko ? ' <span class="ref-score">✔ ' + x.ok + " · ✘ " + x.ko + "</span>" : "") + "</p>";
      if (b && !ingame && H && H.open) foot = '<div class="row"><button class="btn ghost" data-ref-gram="' + b.id + '">🧩 Abrir en Mi gramática →</button></div>';
    }
    if (q.hits.length) {
      var one = q.hits.length === 1 && q.total <= 1;
      body = '<p class="muted small">' + q.hits.length + (q.total > q.hits.length ? " de " + q.total : "") +
        (one ? " oración del curso que ya podés leer:" : " oraciones del curso que ya podés leer:") + "</p>" +
        hitsHtml(q.hits) + exHtml(q.ex);
    } else {
      body = '<p class="muted">Todavía no aparece en lo que ya podés leer.' +
        (q.later ? " La vas a ver en la semana " + q.later + "." : "") + "</p>";
    }
    return '<div class="ref-top"><button class="tab" id="refclose" aria-label="cerrar">✕ cerrar</button></div>' + head + body + foot;
  }

  function openWord(term) {
    refresh();
    if (!D.course) return;
    var q = concordance(term, { week: curWeek() });
    q.ex = q.hits.length ? exercise(q, curWeek()) : null;
    showSheet(q);
  }
  function openBlock(id) {
    refresh();
    var b = blockById(id);
    if (!b) return;
    var q = blockConcordance(b, { week: curWeek() });
    q.ex = exercise(q, curWeek());
    showSheet(q);
  }

  function showSheet(q) {
    sheetQ = q;
    var box = document.getElementById("refsheet");
    if (!box) {
      box = document.createElement("div");
      box.id = "refsheet";
      box.className = "mcbox refsheet";
      box.setAttribute("role", "dialog");
      box.setAttribute("aria-label", "Cómo se usa");
      document.body.appendChild(box);
    }
    box.innerHTML = sheetHtml(q);
    box.scrollTop = 0;
    box.classList.add("on");
    document.body.classList.add("ref-open");
  }
  function closeSheet() {
    var box = document.getElementById("refsheet");
    if (box) box.classList.remove("on");
    document.body.classList.remove("ref-open");
    sheetQ = null;
  }

  function answer(btn) {
    var q = sheetQ, box = document.getElementById("refsheet");
    if (!q || !q.ex || !box) return;
    var ok = btn.getAttribute("data-refans") === "1";
    box.querySelectorAll("[data-refans]").forEach(function (b) {
      b.disabled = true;
      if (b.getAttribute("data-refans") === "1") b.classList.add("right");
      else if (b === btn) b.classList.add("wrong");
    });
    var ex = q.ex, why = box.querySelector(".ref-why");
    if (why) {
      why.hidden = false;
      why.innerHTML = (ok ? "<b>¡Bien!</b> " : "<b>Era la otra.</b> ") +
        (ex.good && ex.bad ? "Se dice <i class=\"it\">" + esc(ex.good) + "</i>, no <i class=\"it\">" + esc(ex.bad) + "</i>. " : "") +
        (ex.why ? esc(ex.why) : "") +
        ' <button class="tab" id="refagain">Otro ↻</button>';
      if (why.scrollIntoView) why.scrollIntoView({ block: "nearest" });
    }
    var s = st();
    if (q.kind === "block") record(s, "b", q.id, ok); else record(s, "w", q.lemma || q.term, ok);
    if (H && H.fx) try { H.fx(ok); } catch (e) { /* sin sonido */ }
    if (H && H.persist) H.persist();
  }

  function again() {
    var q = sheetQ;
    if (!q) return;
    q.ex = exercise(q, curWeek());
    showSheet(q);
  }

  // A small button next to a word (the concepts of the week).
  function button(term) {
    return '<button class="ref-go" data-ref="' + esc(term) + '" aria-label="Cómo se usa ' + esc(term) + '">usos</button>';
  }

  /* ------------------------------------------------------ Mi gramática */

  var STATUS = { vista: ["👁️", "vista"], practicada: ["✍️", "practicada"], dominada: ["⭐", "dominada"] };

  // The entry (Consultar, Io): a card with the counts.
  function entry() {
    refresh();
    if (!D.course) return "";
    var week = curWeek(), list = grammar(week), s = st(), n = { vista: 0, practicada: 0, dominada: 0 };
    list.forEach(function (b) { n[blockStats(b, s).status]++; });
    var ahead = blocks().length - list.length;
    return '<div class="card ref-entry"><h2>🧩 Mi gramática</h2>' +
      '<p class="muted">Las ' + list.length + " construcciones que viste hasta la semana " + week +
      ", con ejemplos de tus lecturas y cómo te va con cada una" + (ahead ? "; y las " + ahead + " que vienen, para consultar antes de tiempo" : "") + ".</p>" +
      '<p class="ref-counts">' + ["vista", "practicada", "dominada"].map(function (k) {
        return '<span class="ref-st ' + k + '">' + STATUS[k][0] + " " + n[k] + " " + STATUS[k][1] + (n[k] === 1 ? "" : "s") + "</span>";
      }).join(" ") + "</p>" +
      '<div class="row"><button class="btn" data-ref-gram="1">Abrir mi gramática</button></div></div>';
  }

  function tableHtml(t) {
    if (!t || !t.rows || !t.rows.length) return "";
    var rows = t.rows.slice(0, 8);
    return '<div class="tw"><table class="gram">' +
      (t.head && t.head.join("") ? "<thead><tr>" + t.head.map(function (c) { return "<th>" + mk(c) + "</th>"; }).join("") + "</tr></thead>" : "") +
      "<tbody>" + rows.map(function (r) {
        return "<tr>" + r.map(function (c, k) { return "<td" + (k === 0 ? ' class="k"' : "") + ">" + mk(c) + "</td>"; }).join("") + "</tr>";
      }).join("") + "</tbody></table></div>" +
      (t.rows.length > rows.length ? '<p class="muted small">… y ' + (t.rows.length - rows.length) + " filas más en la lección.</p>" : "");
  }

  function itemHtml(b, s, open) {
    var ahead = b.week > curWeek();
    var x = ahead ? null : blockStats(b, s), S = x ? STATUS[x.status] : null;
    return '<details class="ref-item' + (ahead ? " ahead" : "") + '" data-refblock="' + b.id + '"' + (open ? " open" : "") + "><summary>" +
      '<span class="ref-h">' + mk(b.h || strip(b.r).slice(0, 60)) + "</span>" +
      '<span class="ref-meta">' + (ahead ? '<span class="ref-st ahead">🔒 semana ' + b.week + "</span>" :
        '<span class="ref-st ' + x.status + '" title="' + S[1] + '">' + S[0] + " " + S[1] + "</span>" +
        (x.ok + x.ko ? ' <span class="ref-score">✔ ' + x.ok + " · ✘ " + x.ko + "</span>" : "")) + "</span></summary>" +
      '<div class="ref-body">' + (open ? bodyHtml(b) : "") + "</div></details>";
  }

  function bodyHtml(b) {
    var week = curWeek();
    if (b.week > week) {
      // «Nada antes de su teoría» vale para practicar, no para consultar: se lee con aviso.
      return '<p class="note">🔒 Esto llega en la semana ' + b.week + " (" + esc(b.weekTitle) + "). Te lo adelanto para consultar; " +
        "los ejercicios y los usos de tus lecturas aparecen cuando llegues.</p>" +
        (b.r ? '<p class="rule">' + mk(b.r) + "</p>" : "") + tableHtml(b.table) +
        ((b.ex || []).length ? '<ul class="exs ref-exs">' + b.ex.slice(0, 3).map(function (p) {
          return '<li><span class="it">' + mk(p[0]) + '</span> <span class="es">' + esc(p[1]) + "</span></li>";
        }).join("") + "</ul>" : "");
    }
    var q = blockConcordance(b, { week: week, max: 3 });
    return (b.r ? '<p class="rule">' + mk(b.r) + "</p>" : "") + tableHtml(b.table) +
      (q.hits.length ? '<h3>En lo que leíste</h3>' + hitsHtml(q.hits)
        : '<p class="muted small">Todavía no aparece en tus lecturas.</p>') +
      '<div class="row"><button class="btn ghost" data-refblk="' + b.id + '">Ver usos y practicar →</button></div>';
  }

  function groupHtml(list, s, desc) {
    var out = "", last = 0;
    list.slice().sort(function (a, b) { return (desc ? b.week - a.week : a.week - b.week) || a.i - b.i; }).forEach(function (b) {
      if (b.week !== last) {
        if (last) out += "</div>";
        out += '<h3 class="ref-wk">Semana ' + b.week + " · " + esc(b.weekTitle) + '</h3><div class="ref-group">';
        last = b.week;
      }
      out += itemHtml(b, s, gramState.focus === b.id);
    });
    return out ? out + "</div>" : "";
  }

  /* Everything, not only what was seen: the weeks to come are there to be
     looked up (with the notice «esto llega en la semana N»), folded after
     what was seen; a search opens them. */
  function listHtml() {
    var week = curWeek(), s = st();
    var all = search(blocks(), gramState.q);
    var seen = all.filter(function (b) { return b.week <= week; });
    var ahead = all.filter(function (b) { return b.week > week; });
    if (gramState.filter) { seen = seen.filter(function (b) { return blockStats(b, s).status === gramState.filter; }); ahead = []; }
    if (!seen.length && !ahead.length) return '<p class="muted">Nada con eso. Probá con otra palabra (una forma, un tiempo, «artículo»…).</p>';
    var focusAhead = ahead.some(function (b) { return b.id === gramState.focus; });
    return groupHtml(seen, s, true) +
      (ahead.length ? '<details class="ref-ahead"' + (gramState.q || focusAhead || !seen.length ? " open" : "") + '><summary>🔒 Lo que viene: ' + ahead.length +
        (ahead.length === 1 ? " construcción" : " construcciones") + " de las semanas " + ahead[0].week + "–" + ahead[ahead.length - 1].week + "</summary>" +
        '<p class="muted small">Para consultar antes de tiempo. Se practica cuando llega su semana.</p>' + groupHtml(ahead, s, false) + "</details>" : "");
  }

  function page() {
    refresh();
    var week = curWeek();
    return '<button class="btn ghost" id="refback">← Volver</button>' +
      "<h1>🧩 Mi gramática</h1>" +
      '<p class="lead">Todo lo que viste hasta la semana ' + week + ": la regla corta, la tabla y cómo aparece en " +
      "lo que ya leíste. Lo que viene también está, con aviso. Tocá una construcción para abrirla.</p>" +
      '<input type="search" id="refq" class="ref-q" placeholder="Buscar: una forma, un tiempo, «artículo»…" value="' + esc(gramState.q) + '" autocomplete="off">' +
      '<div class="chips ref-filters">' + [["", "Todas"], ["vista", "👁️ Vistas"], ["practicada", "✍️ Practicadas"], ["dominada", "⭐ Dominadas"]].map(function (f) {
        return '<button class="tab' + (gramState.filter === f[0] ? " on" : "") + '" data-reff="' + f[0] + '">' + f[1] + "</button>";
      }).join("") + "</div>" +
      '<div id="reflist">' + listHtml() + "</div>" +
      '<p class="muted science">🔬 Ver muchos usos reales de una forma y decidir cuál está bien enseña su gramática (aprendizaje basado en datos: Boulton y Cobb 2017).</p>';
  }

  /* The block in the lesson and in the «¿Por qué?» sheet: a way to its
     real uses and its state (the sheet), without leaving the round. */
  function blockLink(b) {
    refresh();
    if (!D.course || !b) return "";
    var id = blockIdOf(b);
    if (!id) return "";
    return '<p class="ref-blink"><button class="tab" data-refblk="' + id + '">🧩 Usos reales y cómo te va · Mi gramática</button></p>';
  }
  /* At the end of a lesson: what it leaves in «Mi gramática». */
  function lessonNote(week, idx) {
    refresh();
    var bs = grammar(999).filter(function (b) { return b.week === week && (!idx || idx.indexOf(b.i) >= 0); });
    if (!bs.length) return "";
    var names = bs.slice(0, 4).map(function (b) { return mk(b.h || strip(b.r).slice(0, 40)); });
    return '<p class="note ref-lesnote">🧩 Queda en tu gramática: ' + names.join(" · ") + (bs.length > 4 ? " y " + (bs.length - 4) + " más" : "") +
      '. <button class="tab" data-ref-gram="' + bs[0].id + '">Ver →</button></p>';
  }
  // Open «Mi gramática» at a block (or at the top).
  function openGram(id) {
    gramState.focus = id && id !== "1" ? id : null;
    if (gramState.focus) { gramState.q = ""; gramState.filter = ""; }
    closeSheet();
    if (H && H.open) H.open();
    if (gramState.focus && typeof document !== "undefined") setTimeout(function () {
      var el = document.querySelector('[data-refblock="' + gramState.focus + '"]');
      if (el && el.scrollIntoView) el.scrollIntoView({ block: "start" });
    }, 60);
  }

  function relist() {
    var l = document.getElementById("reflist");
    if (l) l.innerHTML = listHtml();
  }

  /* One listener for everything of this module (capture: before the
     screen's own handlers, so a «usos» inside a feedback panel does not also
     move the game on). */
  function onClick(e) {
    var t = e.target && e.target.closest ? e.target : null;
    if (!t) return;
    var el;
    if ((el = t.closest("[data-ref]"))) {
      e.preventDefault(); e.stopPropagation();
      openWord(el.getAttribute("data-ref"));
    } else if ((el = t.closest("[data-refblk]"))) {
      e.preventDefault(); e.stopPropagation();
      openBlock(el.getAttribute("data-refblk"));
    } else if ((el = t.closest("[data-ref-gram]"))) {
      e.preventDefault(); e.stopPropagation();
      openGram(el.getAttribute("data-ref-gram"));
    } else if (t.closest("#refclose")) {
      e.preventDefault(); closeSheet();
    } else if ((el = t.closest("[data-refans]"))) {
      e.preventDefault(); e.stopPropagation();
      if (!el.disabled) answer(el);
    } else if (t.closest("#refagain")) {
      e.preventDefault(); e.stopPropagation(); again();
    } else if (t.closest("#refback")) {
      e.preventDefault();
      if (H && H.back) H.back();
    } else if ((el = t.closest("[data-reff]"))) {
      gramState.filter = el.getAttribute("data-reff");
      document.querySelectorAll("[data-reff]").forEach(function (b) { b.classList.toggle("on", b === el); });
      relist();
    } else {
      var box = document.getElementById("refsheet");
      if (box && box.classList.contains("on") && !box.contains(t)) closeSheet();
    }
  }

  function attach(hooks) {
    H = hooks || {};
    refresh();
    // the corpus is built while the learner looks at the first screen
    if (D.course && !CORPUS) setTimeout(function () { try { corpus(); blocks(); } catch (e) { /* más tarde */ } }, 1200);
    if (attach.done || typeof document === "undefined") return;
    attach.done = true;
    document.addEventListener("click", onClick, true);
    document.addEventListener("input", function (e) {
      if (e.target && e.target.id === "refq") { gramState.q = e.target.value; gramState.focus = null; relist(); }
    });
    document.addEventListener("toggle", function (e) {
      var d = e.target;
      if (!d || !d.classList || !d.classList.contains("ref-item") || !d.open) return;
      var body = d.querySelector(".ref-body"), b = blockById(d.getAttribute("data-refblock"));
      if (body && b && !body.innerHTML) body.innerHTML = bodyHtml(b);
    }, true);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeSheet(); });
  }

  var api = {
    setData: setData, corpus: corpus, tokenize: tokenize, formsOf: formsOf, concordance: concordance,
    blocks: blocks, grammar: grammar, blockById: blockById, blockForms: blockForms, blockConcordance: blockConcordance,
    search: search, blockStats: blockStats, exercise: exercise, record: record, diff: diff,
    blockIdOf: blockIdOf, lookup: lookup, suggest: suggest, collocations: collocations,
    // pantalla
    attach: attach, button: button, entry: entry, page: page,
    openWord: openWord, openBlock: openBlock, close: closeSheet, has: has,
    blockLink: blockLink, lessonNote: lessonNote, openGram: openGram, hitsHtml: hitsHtml,
    ready: function () { refresh(); return !!D.course; }
  };
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Referencia = api;
})(typeof window !== "undefined" ? window : globalThis);
