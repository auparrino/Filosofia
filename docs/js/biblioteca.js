/*
 * La Biblioteca: libros reales de dominio público (Project Gutenberg) para
 * leer mucho dentro de la app — lectura extensiva (Nation y Waring: cientos
 * de miles de palabras leídas con gusto, entendiendo casi todo).
 *
 * Datos (del paquete del idioma, se bajan cuando se abren, no se
 * precachean): lang/<código>/biblioteca/index.json con las fichas y la
 * cobertura por semana precalculada, y lang/<código>/biblioteca/<id>.json con
 * el texto partido en capítulos o cuentos (los arma
 * tools/lib/build_biblioteca.js).  Lo que depende de la lengua (los
 * cognados por sufijo, los textos de la sección) está en
 * window.BIBLIO_DATA (lang/<código>/biblioteca_data.js).
 *
 * El nivel: la cobertura léxica, el porcentaje de palabras del texto que el
 * alumno probablemente ya conoce en la semana N (Hu y Nation 2000: con 95 %
 * se lee con ayuda, con 98 % solo).  Una palabra se da por conocida en la
 * semana N si es una palabra gramatical, si el curso la enseñó antes de esa
 * semana (glosario), si su lema está entre los 100·N más frecuentes
 * (data/frequenza.json), o si es un cognado transparente (el glosario la
 * traduce con casi la misma palabra —Desglose.transparent— o tiene un sufijo
 * que un hispanohablante lee solo: -ção, -zione, -dade, -ità…).  La
 * autoevaluación al final de cada capítulo («¿Entendiste lo esencial?»)
 * corre esa semana hacia adelante o hacia atrás.
 *
 * El lector: páginas cómodas en el teléfono, tocar una palabra da su
 * significado (glosario; si no está, el lema con su frecuencia y el
 * desglose de la forma verbal) y «📌 al repaso» la convierte en tarjeta
 * (la del curso «v:», la del banco «b:voc:» o una propia «lib:»); guarda
 * dónde quedaste, marca capítulos leídos y cuenta palabras y minutos de
 * lectura por día («input» en el perfil), con xp moderada solo por páginas
 * a las que se les dedicó el tiempo mínimo de leerlas.  «Leer en voz alta»
 * usa el karaoke de las lecturas (escucha, no producción oral).
 *
 * La lógica (páginas, cobertura, estadísticas, recomendación, tarjetas)
 * no toca el DOM: se prueba en node (tools/lib/test_biblioteca.js).  La
 * interfaz la llama app.js: Biblioteca.init(host), owns(pantalla),
 * render(pantalla, view), wire(pantalla, view), leggiCard(), ioCard().
 */
(function (root) {
  "use strict";

  var BD = root.BIBLIO_DATA || {};
  var TX = BD.ui || {};
  var WEEKS = 52;
  var RANK_PER_WEEK = 150;     // lemmas de frecuencia que se suman por semana de curso
  var COG_WEEK = 10;           // un cognado transparente raro se lee solo desde esta semana
  var PAGE_WORDS = 130;        // una pantalla de teléfono con letra de lectura
  var TARGET = 95;             // cobertura recomendada para empezar (Hu y Nation 2000)
  var MAX_WPM = 350;           // más rápido que esto no es leer: la página no cuenta
  var XP_PAGE = 2, XP_DAY = 40;
  var KEEP_DAYS = 90;

  /* ------------------------------------------------------------ el texto */

  function isHeading(p) { return /^## /.test(p); }
  function isBreak(p) { return p === "⁂"; }
  function headingText(p) { return String(p).replace(/^## /, ""); }
  function wordCount(s) {
    var n = 0;
    String(s || "").split(/\s+/).forEach(function (t) { if (/[A-Za-zÀ-ÿ]/.test(t)) n++; });
    return n;
  }
  function chapterWords(ch) {
    var n = 0;
    (ch.p || []).forEach(function (p) { if (!isHeading(p)) n += wordCount(p); });
    return n;
  }

  // Sentences of a paragraph (no lookbehind: old Safari).
  function sentences(p) {
    var out = String(p).match(/[^.!?…]+(?:[.!?…]+[»"”’)]*\s*|$)/g) || [p];
    return out.map(function (s) { return s.trim(); }).filter(Boolean);
  }

  /* The pages of a chapter: whole paragraphs up to ~PAGE_WORDS words; a
     longer paragraph is cut between sentences.  A heading never ends a
     page. */
  function pages(paras, size) {
    size = size || PAGE_WORDS;
    var out = [], cur = [], n = 0;
    function flush() { if (cur.length) out.push(cur); cur = []; n = 0; }
    function push(p) {
      var w = wordCount(p);
      if (n && n + w > size * 1.15) {
        var carry = [];
        while (cur.length && isHeading(cur[cur.length - 1])) carry.unshift(cur.pop());
        flush();
        cur = carry;
      }
      cur.push(p);
      n += w;
      if (n >= size && !isHeading(p)) flush();
    }
    (paras || []).forEach(function (p) {
      if (wordCount(p) <= size * 1.3) { push(p); return; }
      var chunk = "";
      sentences(p).forEach(function (s) {
        if (chunk && wordCount(chunk) + wordCount(s) > size * 0.9) { push(chunk); chunk = ""; }
        chunk = chunk ? chunk + " " + s : s;
      });
      if (chunk) push(chunk);
    });
    flush();
    return out;
  }

  /* ------------------------------------------------------- la cobertura */

  function strip(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }

  /* The model of what a learner of week N knows.  o: { lemmi (frequenza.json),
     gloss (glossario.json), stop (FREQ_DATA.STOP), lemma(w), tokens(text),
     transparent(w, es), cognates: [regex], stems: [[regex, reemplazo]]
     (plural, femenino, diminutivos, clíticos: BIBLIO_DATA.stems), verbs:
     {forma: [infinitivos]} (the conjugator backwards: the build tool has
     it), cognate(w) (true for a transparent cognate: the build tool has
     it), rankPerWeek, learnAfter (a word met that many times in a chapter
     is known from then on: the reader looked it up) }. */
  function Model(o) {
    this.o = o;
    var lemmi = o.lemmi || {};
    var rank = this.rank = Object.create(null), plain = this.plain = Object.create(null);
    Object.keys(lemmi).map(function (l) { var r = lemmi[l]; return [l, Math.max(r[0], r[1])]; })
      .sort(function (a, b) { return b[1] - a[1]; })
      .forEach(function (x, i) { rank[x[0]] = i + 1; var k = strip(x[0]); if (!plain[k]) plain[k] = x[0]; });
    var stop = this.stop = Object.create(null);
    (o.stop || []).forEach(function (w) { stop[w] = 1; });
    this.gloss = Object.create(null);
    var g = o.gloss || {}, G = this.gloss;
    Object.keys(g).forEach(function (k) { if (k.indexOf(" ") < 0) G[k] = g[k]; });
    this.cog = (o.cognates || []).map(function (c) { return c instanceof RegExp ? c : new RegExp(c); });
    this.stems = (o.stems || []).map(function (x) { return [x[0] instanceof RegExp ? x[0] : new RegExp(x[0]), x[1]]; });
    this.perWeek = o.rankPerWeek || RANK_PER_WEEK;
    this.memo = Object.create(null);
  }
  /* The lemmas a form can come from: the frequency layer's own, the
     conjugator's, the same word with its old accents (potè, sè), and the
     forms without inflection, diminutive or clitic (tutti → tutto,
     casinha → casa, voltandosi → voltando → voltare). */
  Model.prototype.lemmas = function (w) {
    var o = this.o, out = [], self = this;
    var add = function (x) {
      if (!x || out.indexOf(x) >= 0) return;
      out.push(x);
      if (o.lemma) { var l = o.lemma(x); if (l && out.indexOf(l) < 0) out.push(l); }
      ((o.verbs && o.verbs[x]) || []).forEach(function (v) { if (out.indexOf(v) < 0) out.push(v); });
      var p = self.plain[strip(x)];
      if (p && out.indexOf(p) < 0) out.push(p);
    };
    add(w);
    var n0 = out.length;
    var step = function (v) {
      self.stems.forEach(function (st) {
        if (!st[0].test(v)) return;
        var x = v.replace(st[0], st[1]);
        if (x.length >= 2 && x !== v) add(x);
      });
    };
    step(w);
    // one more step for a form with a clitic and an inflection
    out.slice(n0).forEach(step);
    return out;
  };
  /* The first week at which a word (lower case, no punctuation) counts as
     known: 1 for the grammar words and the transparent cognates, the week
     the course teaches it, or the week its lemma enters the frequency band;
     99 = not before the end of the course. */
  Model.prototype.week = function (w) {
    var m = this.memo[w];
    if (m != null) return m;
    var o = this.o, best = 99, self = this;
    if (!/[a-zà-ÿ]/.test(w) || /\d/.test(w)) best = 1;
    else if (this.stop[w] || this.stop[w.replace(/'$/, "")]) best = 1;
    else {
      var ls = this.lemmas(w);
      ls.forEach(function (l, i) {
        if (i > 0 && self.stop[l]) best = 1;
        var x = self.gloss[l];
        if (x) {
          if (o.transparent && (o.transparent(w, x[1]) || o.transparent(x[0], x[1]))) best = 1;
          else if (+x[2] && +x[2] < best) best = +x[2];
        }
        var r = self.rank[l];
        if (r) best = Math.min(best, Math.max(1, Math.ceil(r / self.perWeek)));
      });
      // A transparent cognate (a suffix a Spanish speaker reads alone, or
      // o.cognate: a Spanish word spelled almost the same, which the build
      // tool checks against a Spanish word list) comes three times sooner
      // than its frequency says; a rare one, once the basics are in.
      if (best > 1 && (this.cog.some(function (re) { return re.test(w); }) ||
          (o.cognate && ls.some(function (l, i) { return (i === 0 || self.rank[l]) && o.cognate(l); })))) {
        var rk = 0;
        ls.forEach(function (l) { if (self.rank[l] && (!rk || self.rank[l] < rk)) rk = self.rank[l]; });
        best = Math.min(best, rk ? Math.max(1, Math.ceil(rk / (3 * self.perWeek))) : COG_WEEK);
      }
      if (best > WEEKS) best = 99;
    }
    this.memo[w] = best;
    return best;
  };
  function capInfo(raw) {
    var bare = raw.replace(/^[^A-Za-zÀ-ÿ]+/, "");
    return { bare: bare, cap: /^[A-ZÀ-Ý]/.test(bare) && !/^[A-ZÀ-Ý]{2,}/.test(bare) };
  }
  /* The words of a text, each with the week it becomes known.  Names count
     as known: with «names» (the words the book never writes in lower case,
     namesOf) a capitalised word among them; without it, any word
     capitalised inside a sentence. */
  Model.prototype.words = function (text, names) {
    var o = this.o, self = this, out = [];
    var toks = o.tokens || function (s) { return String(s).toLowerCase().match(/[a-zà-ÿ']+/g) || []; };
    sentences(text).forEach(function (sent) {
      sent.split(/\s+/).forEach(function (raw, i) {
        var c = capInfo(raw);
        if (!c.bare) return;
        toks(raw).forEach(function (w) {
          var name = c.cap && (names ? !!names[w] : i > 0);
          out.push({ w: w, week: name ? 1 : self.week(w), name: name });
        });
      });
    });
    return out;
  };
  /* The names of a book: words it writes with a capital inside sentences
     and never in lower case. */
  function namesOf(paras, tokens) {
    var cap = Object.create(null), low = Object.create(null), out = {};
    tokens = tokens || function (s) { return String(s).toLowerCase().match(/[a-zà-ÿ']+/g) || []; };
    (paras || []).forEach(function (p) {
      if (isHeading(p)) return;
      sentences(p).forEach(function (sent) {
        sent.split(/\s+/).forEach(function (raw, i) {
          var c = capInfo(raw), upper = /^[A-ZÀ-Ý]/.test(c.bare);
          if (!c.bare) return;
          tokens(raw).forEach(function (w) {
            if (!upper) low[w] = 1;
            else if (i > 0 && c.cap) cap[w] = 1;
          });
        });
      });
    });
    Object.keys(cap).forEach(function (w) { if (!low[w]) out[w] = 1; });
    return out;
  }
  /* A histogram of the text: how many words become known at each week
     (index 0..51) and how many not in the course (index 52). */
  Model.prototype.histogram = function (paras, names) {
    var h = [], self = this, met = Object.create(null), learn = this.o.learnAfter || 0;
    for (var i = 0; i <= WEEKS; i++) h.push(0);
    (paras || []).forEach(function (p) {
      if (isHeading(p) || isBreak(p)) return;
      self.words(p, names).forEach(function (x) {
        var wk = x.week;
        // a word that keeps coming back in the chapter: after «learn»
        // meetings, with its meaning a tap away, it no longer stops the reading
        if (learn && wk > 1) { met[x.w] = (met[x.w] || 0) + 1; if (met[x.w] > learn) wk = 1; }
        h[wk > WEEKS ? WEEKS : wk - 1]++;
      });
    });
    return h;
  };
  // Coverage per week (per mille, 52 values) from a histogram.
  function coverageOf(h) {
    var total = h.reduce(function (a, b) { return a + b; }, 0), acc = 0, out = [];
    for (var i = 0; i < WEEKS; i++) { acc += h[i]; out.push(total ? Math.round(acc * 1000 / total) : 1000); }
    return out;
  }
  function addHist(a, b) { return a.map(function (x, i) { return x + (b[i] || 0); }); }
  // Coverage (percent) of an index entry at a week.
  function covAt(entry, week) {
    var c = entry && entry.cov;
    if (!c || !c.length) return 0;
    week = Math.max(1, Math.min(WEEKS, Math.round(week || 1)));
    return c[week - 1] / 10;
  }
  // The first week a text reaches the target coverage (99: never).
  function weekFor(cov, target) {
    for (var i = 0; i < (cov || []).length; i++) if (cov[i] >= (target || TARGET) * 10) return i + 1;
    return 99;
  }
  function levelOfWeek(w) { return w <= 13 ? "A2" : w <= 26 ? "B1" : w <= 39 ? "B2" : w <= 52 ? "C1" : "C2"; }

  /* ------------------------------------------------------------ el estado */

  function ensure(state) {
    var b = state.biblio;
    if (!b || typeof b !== "object") b = state.biblio = {};
    ["pos", "done", "days", "seen", "self", "words", "wk"].forEach(function (k) { if (!b[k] || typeof b[k] !== "object") b[k] = {}; });
    if (!b.total || typeof b.total !== "object") b.total = { w: 0, s: 0, pg: 0 };
    if (typeof b.adj !== "number") b.adj = 0;
    if (typeof b.under !== "boolean") b.under = true;
    if (typeof b.size !== "number") b.size = 0;
    return b;
  }
  // The learner's reading week: the week of the course, moved by the self-assessments.
  function readingWeek(state) {
    var b = ensure(state);
    return Math.max(1, Math.min(WEEKS, Math.round((state.unlocked || 1) + b.adj)));
  }

  function dayKey(d) {
    if (root.Engine && root.Engine.dayKey) return root.Engine.dayKey(d);
    d = d || new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }
  function daysBetween(a, b) {
    if (root.Engine && root.Engine.daysBetween) return root.Engine.daysBetween(a, b);
    var p = function (k) { var x = k.split("-"); return Date.UTC(+x[0], +x[1] - 1, +x[2]); };
    return Math.round((p(b) - p(a)) / 864e5);
  }

  // The least time a page needs to have been read (seconds).
  function minSeconds(words) { return Math.max(8, Math.round(words * 60 / MAX_WPM)); }

  /* A page left forward: it counts (words, time, xp) once, and only if the
     learner stayed long enough to read it.  Returns { counted, xp, words }. */
  function notePage(state, info) {
    var b = ensure(state), now = info.now || new Date();
    var key = info.book + "|" + info.ch, seen = b.seen[key] || (b.seen[key] = []);
    var words = info.words || 0, sec = Math.max(0, info.sec || 0);
    if (seen.indexOf(info.pg) >= 0) return { counted: false, xp: 0, words: 0, why: "seen" };
    if (sec < minSeconds(words)) return { counted: false, xp: 0, words: 0, why: "fast" };
    seen.push(info.pg);
    // idle time does not count: at most a slow reading of the page
    var s = Math.round(Math.min(sec, Math.round(words * 60 / 40) + 60, 900));
    var k = dayKey(now), d = b.days[k] || (b.days[k] = { w: 0, s: 0, pg: 0, xp: 0 });
    d.w += words; d.s += s; d.pg++;
    b.total.w += words; b.total.s += s; b.total.pg++;
    var xp = Math.max(0, Math.min(XP_PAGE, XP_DAY - d.xp));
    d.xp += xp;
    Object.keys(b.days).forEach(function (kk) { if (daysBetween(kk, k) > KEEP_DAYS) delete b.days[kk]; });
    return { counted: true, xp: xp, words: words, sec: s };
  }
  function statsDays(state, n, now) {
    var b = ensure(state), k = dayKey(now), out = { w: 0, s: 0, pg: 0 };
    Object.keys(b.days).forEach(function (kk) {
      if (daysBetween(kk, k) < n) { var d = b.days[kk]; out.w += d.w || 0; out.s += d.s || 0; out.pg += d.pg || 0; }
    });
    return out;
  }

  /* «¿Entendiste lo esencial?»: 3 casi todo, 2 lo esencial, 1 poco.  Moves
     the reading week (a text of that coverage was easy or hard for this
     learner) and marks the chapter read. */
  var SELF = { 3: 2, 2: 0.5, 1: -3 };
  function selfAssess(state, book, ch, level) {
    var b = ensure(state), key = book + "|" + ch, prev = b.self[key];
    if (prev) b.adj -= SELF[prev] || 0;
    b.self[key] = level;
    b.adj = Math.max(-20, Math.min(20, b.adj + (SELF[level] || 0)));
    markRead(state, book, ch);
    return b.adj;
  }
  function markRead(state, book, ch) {
    var b = ensure(state), first = !(b.done[book] && b.done[book][ch]);
    (b.done[book] || (b.done[book] = {}))[ch] = 1;
    // the week of the course it was read in (the percorso's «Leé un capítulo»):
    // the week whose mission opened it, else the one the learner is in (a
    // chapter opened from an earlier week counted for the current one, and
    // the mission it came from never got done)
    if (first) {
      var w = Math.max(1, Math.min(WEEKS, creditWeek && creditWeek <= (state.unlocked || 1) ? creditWeek : state.unlocked || 1));
      b.wk[w] = (b.wk[w] || 0) + 1;
      creditWeek = null;
    }
  }
  function isRead(state, book, ch) { var b = ensure(state); return !!(b.done[book] && b.done[book][ch]); }
  function readCount(state, book) { var b = ensure(state); return Object.keys(b.done[book] || {}).length; }

  // The next chapter of a book: where the learner left it, or the first unread.
  function nextChapter(state, book) {
    var b = ensure(state), p = b.pos[book.id];
    if (p && p.c < book.chapters.length && !isRead(state, book.id, p.c)) return p.c;
    for (var i = 0; i < book.chapters.length; i++) if (!isRead(state, book.id, i)) return i;
    return -1;
  }

  /* What to read now: a book already started if its next chapter is still
     comfortable; otherwise the first text (in library order) at ≥ 95 % for
     the reading week — in a collection any story that is not the middle of
     a long one, in a novel its next chapter; if nothing is there yet, the
     most accessible one. */
  function startsHere(bk, i) {
    return bk.kind !== "cuentos" ? false : !/\((?!1\/)\d+\/\d+/.test(bk.chapters[i].t || "");
  }
  function recommend(index, state) {
    var week = readingWeek(state), best = null, easiest = null, started = null;
    ((index && index.books) || []).forEach(function (bk) {
      var c = nextChapter(state, bk);
      if (c < 0) return;
      var p = ensure(state).pos[bk.id];
      var cands = [c];
      if (!p) bk.chapters.forEach(function (x, i) { if (i !== c && !isRead(state, bk.id, i) && startsHere(bk, i)) cands.push(i); });
      cands.forEach(function (i) {
        var cand = { book: bk, ch: i, cov: covAt(bk.chapters[i], week) };
        if (p && i === c && !started && cand.cov >= TARGET - 3) started = cand;
        if (!best && cand.cov >= TARGET) best = cand;
        if (!easiest || cand.cov > easiest.cov) easiest = cand;
      });
    });
    var r = started || best || easiest;
    if (r) r.ok = r.cov >= TARGET;
    return r;
  }

  /* ------------------------------------------------- en el percorso */

  /* The week a book opens: the first week one of its texts reaches 95 %
     (its own «week» in the index if earlier; 94 % for a book that never
     gets to 95; the last week if not even that). */
  function openWeek(bk) {
    if (!bk) return 99;
    var best = +bk.week || 99, near = 99;
    (bk.chapters || []).forEach(function (ch) { best = Math.min(best, weekFor(ch.cov, TARGET)); near = Math.min(near, weekFor(ch.cov, TARGET - 1)); });
    return best < 99 ? best : near < 99 ? near : WEEKS;
  }
  function firstOpenWeek(index) {
    var w = 99;
    ((index && index.books) || []).forEach(function (bk) { w = Math.min(w, openWeek(bk)); });
    return w;
  }
  /* «Leé un capítulo» (optional) from the week the first book opens: the
     chapter recommend() picks among the books already open; done with a
     chapter finished while in that week of the course. */
  function mission(index, w, state) {
    if (!index || !w || w.boss) return null;
    var week = w.week || w, first = firstOpenWeek(index);
    if (week < first) return null;
    var b = ensure(state), upTo = Math.max(week, state.unlocked || 1);
    var open = { books: index.books.filter(function (bk) { return openWeek(bk) <= upTo; }) };
    var rec = recommend(open.books.length ? open : index, state), n = b.wk[week] || 0;
    var min = mins(statsDays(state, 7).s);
    var sub = n ? "Hecho · " + n + (n === 1 ? " capítulo" : " capítulos") + " esta semana"
      : "Opcional · " + (rec ? rec.book.chapters[rec.ch].t + " · entendés ~" + Math.round(rec.cov) + " %" : "un capítulo de un libro de verdad");
    return { kind: "lib", arg: rec ? rec.book.id + "|" + rec.ch : "", done: n > 0, ico: "📚", opt: true,
             title: "Leé un capítulo" + (rec ? ": «" + rec.book.title + "»" : ""),
             sub: sub + (min ? " · " + min + " min de lectura en 7 días" : "") };
  }
  // Minutes read in the library in the last n days (input).
  function minutes(state, n) { return mins(statsDays(state, n || 7).s); }
  function loaded() { return !!DATA.index; }
  function index() { return DATA.index; }

  /* ------------------------------------------------------ las tarjetas */

  /* 📌 al repaso: the course's own card for the word when there is one
     (v: the words of the weeks, b:voc: the bank), otherwise a card of the
     library (lib:) with the meaning and the sentence where it was met. */
  function cardIdFor(lemma, env) {
    env = env || {};
    var D = env.Drills || root.Drills, B = env.Banca || root.Banca;
    try { if (D && D.vocabItem && D.vocabItem(lemma, null)) return "v:" + lemma; } catch (e) { /* sin curso */ }
    if (B && B.loaded && B.loaded() && B.hasWord(lemma)) return "b:voc:" + lemma;
    return "lib:" + lemma;
  }
  function pin(state, word, env) {
    env = env || {};
    var b = ensure(state), E = env.Engine || root.Engine;
    var lemma = String(word.lemma || word.w || "").toLowerCase();
    if (!lemma) return null;
    var id = cardIdFor(lemma, env);
    if (id.indexOf("lib:") === 0) {
      if (!word.es) return null;
      b.words[lemma] = { es: String(word.es).slice(0, 120), ctx: String(word.ctx || "").slice(0, 220), f: word.w || lemma, b: word.book || "" };
    }
    if (E && E.schedule) state.cards[id] = E.schedule(state.cards[id], 0, { id: id, state: state, kind: "vocab" });
    else state.cards[id] = state.cards[id] || { reps: 0, due: Date.now() };
    return id;
  }
  function shuffle(a, rnd) {
    a = a.slice(); rnd = rnd || Math.random;
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  // Meanings of the course's glossary, for the options of a lib: card.
  var POOL = null;
  function glossPool() {
    if (POOL) return POOL;
    var g = DATA.gloss || (H && H.glossary && H.glossary());
    if (!g) return [];
    var seen = {};
    POOL = Object.keys(g).slice(0, 4000).map(function (k) { return g[k][1]; })
      .filter(function (x) { if (!x || x.length >= 40 || seen[x]) return false; seen[x] = 1; return true; }).slice(0, 400);
    return POOL;
  }
  /* The review item of a lib: card, like the words of the week: first the
     meaning among options, then the word from its meaning. */
  function reviewItem(id, state, rnd) {
    if (!state || String(id).indexOf("lib:") !== 0) return null;
    var b = ensure(state), lemma = id.slice(4), e = b.words[lemma];
    if (!e) return null;
    var card = state.cards && state.cards[id];
    var note = e.ctx ? "Lo encontraste en la Biblioteca: *" + e.ctx + "*" : "";
    if (!card || !(card.ok >= 1)) {
      var pool = Object.keys(b.words).filter(function (k) { return k !== lemma && b.words[k].es !== e.es; })
        .map(function (k) { return b.words[k].es; });
      var G = glossPool();
      var opts = [e.es];
      shuffle(pool, rnd).concat(shuffle(G, rnd)).forEach(function (x) { if (opts.length < 4 && opts.indexOf(x) < 0) opts.push(x); });
      if (opts.length >= 3) {
        return { id: id, src: "biblio", type: "choice", topic: "vocabolario", prompt: "¿Qué significa?",
                 stem: lemma, options: shuffle(opts, rnd), answer: e.es, accept: [e.es], note: note, say: lemma };
      }
    }
    return { id: id, src: "biblio", type: "cloze", topic: "vocabolario", prompt: (root.LANG && root.LANG.ui && root.LANG.ui.howSay) || "¿Cómo se dice?",
             stem: "«" + e.es + "» → ___", answer: lemma, accept: [lemma, e.f].filter(Boolean), note: note, say: lemma };
  }

  /* --------------------------------------------------------- los datos */

  var DATA = { index: null, books: {}, model: null, gloss: null, freq: null, loading: {} };
  function base() { return ((root.LANG && root.LANG.base) || "") ; }
  function getJSON(url) {
    return root.fetch(url).then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); });
  }
  function load(what, url, set) {
    if (DATA.loading[what]) return DATA.loading[what];
    var p = DATA.loading[what] = getJSON(url).then(function (x) { set(x); return x; })
      .catch(function (e) { delete DATA.loading[what]; throw e; });
    return p;
  }
  function loadIndex() {
    // a package without a library yet (no biblioteca_data.js): nothing to ask for
    if (!root.BIBLIO_DATA) return Promise.reject(new Error("sin biblioteca"));
    return DATA.index ? Promise.resolve(DATA.index) : load("index", base() + "biblioteca/index.json", function (x) { DATA.index = x; });
  }
  function loadBook(id) {
    return DATA.books[id] ? Promise.resolve(DATA.books[id]) : load("b:" + id, base() + "biblioteca/" + id + ".json", function (x) { DATA.books[id] = x; });
  }
  function makeModel(freq, gloss) {
    var F = root.Freq, De = root.Desglose;
    if (F && freq && !F.loaded()) F.load(freq);
    return new Model({
      lemmi: freq && freq.lemmi, gloss: gloss, stop: (root.FREQ_DATA && root.FREQ_DATA.STOP) || (F && F.STOP) || [],
      lemma: F && F.loaded() ? F.lemma : null, tokens: F ? F.tokens : null,
      transparent: De && De.transparent, cognates: BD.cognates || []
    });
  }
  function loadModel() {
    if (DATA.model) return Promise.resolve(DATA.model);
    // what the app already has in memory is not downloaded again
    var hg = H && H.glossary && H.glossary(), hf = H && H.freq && H.freq();
    if (hg) DATA.gloss = hg;
    if (hf) DATA.freq = hf;
    return Promise.all([
      DATA.freq ? null : load("freq", base() + "data/frequenza.json", function (x) { DATA.freq = x; }),
      DATA.gloss ? null : load("gloss", base() + "data/glossario.json", function (x) { DATA.gloss = x; })
    ]).then(function () {
      DATA.model = makeModel(DATA.freq, DATA.gloss);
      return DATA.model;
    });
  }
  // For the tests and tools: data given directly.
  function setData(d) {
    if (d.index) DATA.index = d.index;
    Object.keys(d.books || {}).forEach(function (k) { DATA.books[k] = d.books[k]; });
    if (d.freq || d.gloss) { DATA.freq = d.freq || DATA.freq; DATA.gloss = d.gloss || DATA.gloss; DATA.model = makeModel(DATA.freq, DATA.gloss); }
  }

  /* --------------------------------------------------------- la interfaz */

  var H = null;               // the host (app.js): state, persist, gain, render…
  function init(host) { H = host; }
  function st() { return H ? H.state() : { cards: {}, unlocked: 1 }; }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function pct(x) { return Math.round(x) + " %"; }
  function fmtNum(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
  function mins(s) { return Math.round((s || 0) / 60); }

  var SCREENS = { biblioteca: 1, libro: 1, lector: 1 };
  function owns(s) { return !!SCREENS[s]; }

  function bookById(id) {
    return ((DATA.index && DATA.index.books) || []).filter(function (b) { return b.id === id; })[0] || null;
  }

  function covBadge(cov) {
    var cls = cov >= TARGET ? "ok" : cov >= 90 ? "mid" : "hard";
    return '<span class="bx-cov ' + cls + '">~' + pct(cov) + "</span>";
  }

  function leggiCard() {
    var s = st(), b = ensure(s), tot = b.total || {};
    return '<div class="card bx-entry"><h2>📚 ' + esc(TX.name || "Biblioteca") + "</h2>" +
      '<p class="muted">' + esc(TX.blurb || "Libros de verdad, de dominio público, para leer mucho entendiendo casi todo.") + "</p>" +
      (tot.w ? '<p class="small muted">Llevás <b>' + fmtNum(tot.w) + "</b> palabras leídas en " + mins(tot.s) + " min.</p>" : "") +
      '<button class="btn" id="bx-open">Abrir la Biblioteca</button></div>';
  }

  function statsLine(s) {
    var b = ensure(s), today = statsDays(s, 1), week = statsDays(s, 7);
    return '<div class="bx-stats"><div><b>' + fmtNum(today.w) + "</b><span>palabras hoy</span></div>" +
      "<div><b>" + mins(today.s) + "</b><span>min hoy</span></div>" +
      "<div><b>" + fmtNum(week.w) + "</b><span>en 7 días</span></div>" +
      "<div><b>" + fmtNum(b.total.w) + "</b><span>en total</span></div></div>";
  }

  function ioCard() {
    var s = st(), b = ensure(s);
    var books = Object.keys(b.done).length;
    var week = statsDays(s, 7);
    return '<div class="card"><h2>📖 Input: lectura</h2>' + statsLine(s) +
      '<p class="muted small">Minutos leyendo en total: <b>' + mins(b.total.s) + "</b> · páginas: " + (b.total.pg || 0) +
      (books ? " · libros empezados: " + books : "") + ". Esta semana: " + mins(week.s) + " min. " +
      "Cuenta la página que te quedaste el tiempo de leer (no la que pasás de largo), y suma xp moderada.</p>" +
      '<div class="row"><button class="btn ghost" id="bx-open">📚 ' + esc(TX.name || "Biblioteca") + "</button></div></div>";
  }

  function renderBiblioteca(view) {
    var s = st(), b = ensure(s), idx = DATA.index, ui = (root.LANG && root.LANG.ui) || {};
    var from = view && view.tab === "io" ? ui.me : ui.read;
    var html = '<button class="btn ghost" id="bx-back">← a ' + esc(from || "leer") + "</button>" +
      "<h1>📚 " + esc(TX.name || "Biblioteca") + "</h1>" +
      '<p class="lead">' + esc(TX.lead || "Libros de verdad para leer mucho.") + "</p>";
    if (!idx) {
      loadIndex().then(function () { if (H && owns(H.view().screen)) H.render(); })
        .catch(function () { var e = root.document && root.document.getElementById("bx-load"); if (e) e.textContent = "No se pudo bajar la biblioteca: hace falta internet la primera vez."; });
      return html + '<div class="card"><p class="muted" id="bx-load">Cargando la biblioteca…</p></div>';
    }
    var week = readingWeek(s), rec = recommend(idx, s);
    html += '<div class="card">' + statsLine(s) +
      '<p class="muted small">Tu nivel de lectura: <b>semana ' + week + "</b>" +
      (b.adj ? " (tu semana " + (s.unlocked || 1) + (b.adj > 0 ? " + " : " − ") + Math.abs(Math.round(b.adj * 10) / 10) + " por lo que contestaste al terminar capítulos)" : "") +
      ". Te recomiendo empezar donde entiendas <b>95 % o más</b>: con eso se lee con gusto y se aprende de paso (Hu y Nation 2000).</p>";
    if (rec) {
      var rc = rec.book.chapters[rec.ch];
      html += '<div class="bx-rec"><span>' + (rec.ok ? "Para vos ahora" : "Lo más accesible por ahora") + "</span><b>" + esc(rec.book.title) + "</b>" +
        '<span class="muted">' + esc(rc.t) + " · entendés " + covBadge(rec.cov) + "</span>" +
        '<button class="btn" data-bxread="' + esc(rec.book.id) + '" data-bxch="' + rec.ch + '">' + (ensure(s).pos[rec.book.id] ? "Seguir leyendo" : "Empezar") + " →</button></div>";
      if (!rec.ok) html += '<p class="muted small">Todavía ningún capítulo llega al 95 % para tu semana: podés leer igual tocando las palabras, o volver en unas semanas.</p>';
    }
    html += "</div>";
    var groups = [["cuentos", "Cuentos: para empezar"], ["novela corta", "Novela corta"], ["novela", "Novelas"]];
    groups.forEach(function (g) {
      var list = idx.books.filter(function (bk) { return bk.kind === g[0]; });
      if (!list.length) return;
      html += "<h2>" + esc(g[1]) + '</h2><div class="eps">';
      list.forEach(function (bk) {
        var c = nextChapter(s, bk), cov = covAt(c >= 0 ? bk.chapters[c] : bk, week), n = readCount(s, bk.id);
        html += '<button class="ep bx-book' + (n >= bk.chapters.length ? " done" : "") + '" data-bxbook="' + esc(bk.id) + '">' +
          '<span class="e">' + (bk.kind === "cuentos" ? "📗" : "📕") + "</span><span><b>" + esc(bk.title) + "</b>" +
          '<span class="muted">' + esc(bk.author) + " · " + bk.year + (bk.note ? " · " + esc(bk.note) : "") + " · " + fmtNum(bk.words) + " palabras · " +
          bk.chapters.length + " " + (bk.kind === "cuentos" ? "textos" : "capítulos") + (n ? " · leídos " + n : "") + "</span></span>" +
          covBadge(cov) + "</button>";
      });
      html += "</div>";
    });
    html += '<p class="muted science">🔬 Lectura extensiva (Nation y Waring 2020): mucho texto, fácil, por gusto. Con 95 % de palabras conocidas ' +
      "se entiende con ayuda; con 98 %, solo. La cobertura es una estimación con tu semana del curso, la frecuencia de cada palabra y los cognados.</p>";
    return html;
  }

  function renderLibro(view) {
    var s = st(), bk = bookById(view.bxBook);
    if (!bk) return renderBiblioteca();
    var week = readingWeek(s), c = nextChapter(s, bk);
    var html = '<button class="btn ghost" id="bx-lib">← a la biblioteca</button>' +
      "<h1>" + esc(bk.title) + "</h1>" +
      '<p class="lead">' + esc(bk.author) + " · " + bk.year + " · " + esc(bk.kind) + " · " + fmtNum(bk.words) + " palabras · nivel estimado " + esc(bk.level) + "</p>" +
      '<div class="card bx-ficha"><p class="muted small">' + esc(bk.credit || "") + "</p>" +
      (bk.note ? '<p class="small">ℹ️ ' + esc(bk.noteLong || bk.note) + "</p>" : "") +
      (c >= 0 ? '<button class="btn" data-bxread="' + esc(bk.id) + '" data-bxch="' + c + '">' + (ensure(s).pos[bk.id] ? "Seguir: " : "Empezar: ") + esc(bk.chapters[c].t) + " →</button>" :
        '<p><b>¡Lo terminaste!</b></p>') + "</div>" +
      '<div class="eps">';
    bk.chapters.forEach(function (ch, i) {
      var cov = covAt(ch, week), read = isRead(s, bk.id, i);
      html += '<button class="ep' + (read ? " done" : "") + '" data-bxread="' + esc(bk.id) + '" data-bxch="' + i + '">' +
        '<span class="e">' + (read ? "✓" : i + 1) + "</span><span><b>" + esc(ch.t) + "</b>" +
        '<span class="muted">' + fmtNum(ch.w) + " palabras · ~" + Math.max(1, Math.round(ch.w / 150)) + " min" +
        (cov >= TARGET && !read ? " · recomendado" : "") + "</span></span>" + covBadge(cov) + "</button>";
    });
    return html + "</div>";
  }

  /* The reader. */
  var reading = null;       // { book, ch, pages, pg, t0 }
  var warnedFast = 0;       // the «too fast» notice, once per session
  var tapWords = [];

  // The week a word of the book becomes known (the build tool computed it
  // with the same model as the coverage): 1 when the book does not list it.
  function wordWeek(book, w) { return (book && book.wk && book.wk[w]) || 1; }
  function toks(t) {
    var F = root.Freq;
    return F && F.tokens ? F.tokens(t) : (String(t).toLowerCase().match(/[a-zà-öø-ÿ']+/g) || []);
  }
  function tokenSpans(par, k0, book) {
    var i = k0, W = /[A-Za-zÀ-ÖØ-öø-ÿ]/;
    var s = st(), b = ensure(s), week = readingWeek(s);
    var html = par.split(/\s+/).filter(Boolean).map(function (t) {
      var k = i++;
      var cls = "w";
      if (b.under && W.test(t) && toks(t).some(function (w) { return wordWeek(book, w) > week; })) cls += " bx-new";
      tapWords[k] = t;
      return '<span class="' + cls + '" data-k="' + k + '">' + esc(t) + "</span>";
    }).join(" ");
    return { html: html, next: i };
  }

  function renderLector(view) {
    var s = st(), b = ensure(s), bk = bookById(view.bxBook);
    var book = DATA.books[view.bxBook];
    var back = '<button class="btn ghost" id="bx-tobook">← ' + esc(bk ? bk.title : "libro") + "</button>";
    if (!book || !DATA.model) {
      Promise.all([loadBook(view.bxBook), loadModel(), loadIndex()]).then(function () { if (H && H.view().screen === "lector") H.render(); })
        .catch(function () { var e = root.document && root.document.getElementById("bx-load"); if (e) e.textContent = "No se pudo bajar el libro: hace falta internet la primera vez que lo abrís."; });
      return back + '<div class="card"><p class="muted" id="bx-load">Cargando el libro…</p></div>';
    }
    var chN = Math.max(0, Math.min(book.chapters.length - 1, view.bxCh | 0));
    var ch = book.chapters[chN];
    if (!reading || reading.book !== book.id || reading.ch !== chN) {
      reading = { book: book.id, ch: chN, pages: pages(ch.p), pg: 0 };
      var pos = b.pos[book.id];
      if (pos && pos.c === chN) reading.pg = Math.min(pos.p || 0, reading.pages.length - 1);
    }
    if (view.bxPg != null) { reading.pg = Math.max(0, Math.min(reading.pages.length - 1, view.bxPg)); view.bxPg = null; }
    b.pos[book.id] = { c: chN, p: reading.pg, t: Date.now() };
    reading.t0 = Date.now();
    var page = reading.pages[reading.pg] || [], last = reading.pg >= reading.pages.length - 1;
    tapWords = [];
    var k = 0, body = page.map(function (p) {
      if (isBreak(p)) return '<p class="bx-break">⁂</p>';
      var r = tokenSpans(isHeading(p) ? headingText(p) : p, k, book);
      k = r.next;
      return isHeading(p) ? '<p class="bx-h">' + r.html + "</p>" : "<p>" + r.html + "</p>";
    }).join("");
    var cov = bk ? covAt(bk.chapters[chN], readingWeek(s)) : 0;
    var prog = Math.round((reading.pg + 1) * 100 / reading.pages.length);
    var html = back +
      '<div class="bx-head"><b>' + esc(ch.t) + '</b><span class="muted small">página ' + (reading.pg + 1) + " de " + reading.pages.length +
        (cov ? " · entendés " + covBadge(cov) : "") + "</span></div>" +
      '<div class="progressline bx-prog"><i style="width:' + prog + '%"></i></div>' +
      '<div class="card bx-page"><div class="text bx-text' + (b.size ? " bx-s" + b.size : "") + (b.serif ? " bx-serif" : "") + '">' + body + "</div></div>" +
      '<div class="bx-nav"><button class="btn ghost" id="bx-prev"' + (reading.pg || chN ? "" : " disabled") + ">←</button>" +
        (last ? '<button class="btn" id="bx-end">Terminé el ' + (bk && bk.kind === "cuentos" ? "texto" : "capítulo") + " ✓</button>"
              : '<button class="btn" id="bx-next">Siguiente →</button>') + "</div>" +
      '<div class="bx-tools"><button class="tab" id="bx-kar">🎧 Leer en voz alta</button>' +
        '<button class="tab' + (b.under ? " on" : "") + '" id="bx-under">subrayar difíciles</button>' +
        '<button class="tab" id="bx-smaller">A−</button><button class="tab" id="bx-bigger">A+</button>' +
        '<button class="tab' + (b.serif ? " on" : "") + '" id="bx-serif">letra de libro</button></div>' +
      '<p class="muted small">Tocá cualquier palabra para ver qué significa.' + (b.under ? ' Las <span class="w bx-new">subrayadas</span> probablemente no las conocés todavía.' : "") + "</p>";
    if (view.bxAsk) {
      html += '<div class="card bx-self"><h2>¿Entendiste lo esencial?</h2><p class="muted small">Sin preguntas: vos sabés. Tu respuesta ajusta qué te recomiendo.</p>' +
        '<div class="options"><button class="opt" data-bxself="3">😀 Sí, casi todo</button><button class="opt" data-bxself="2">🙂 Lo esencial, sí</button>' +
        '<button class="opt" data-bxself="1">😕 Poco</button></div></div>';
    }
    return html;
  }

  function render(screen, view) {
    if (screen === "biblioteca") return renderBiblioteca(view);
    if (screen === "libro") {
      if (!DATA.index) return renderBiblioteca(view);
      return renderLibro(view);
    }
    if (screen === "lector") return renderLector(view);
    return "";
  }

  /* ------------------------------------------------------ el toque */

  function sentenceOf(k) {
    // the sentence around the word k on this page
    var toks = tapWords, a = k, z = k;
    while (a > 0 && !/[.!?…]["»”]?$/.test(toks[a - 1] || "")) a--;
    while (z < toks.length - 1 && !/[.!?…]["»”]?$/.test(toks[z] || "")) z++;
    return toks.slice(Math.max(a, k - 18), Math.min(z + 1, k + 18)).join(" ");
  }

  function lookup(raw) {
    var model = DATA.model, F = root.Freq, gloss = DATA.gloss || {};
    var toks = F ? F.tokens(raw) : [String(raw).toLowerCase()];
    var w = toks.filter(function (x) { return !(model && model.stop[x]); }).pop() || toks[toks.length - 1] || "";
    // the lemma: the glossary's, else the first candidate the frequency
    // list knows (tutti → tutto, casinhas → casa, domandò → domandare)
    var cands = model ? model.lemmas(w) : [w];
    var g = gloss[w], lemma = g ? g[0] : null;
    if (!lemma) cands.some(function (c) { if (gloss[c]) { lemma = gloss[c][0]; return true; } return false; });
    if (!lemma && model) cands.some(function (c) { if (model.rank[c]) { lemma = c; return true; } return false; });
    // the bank of the course also knows meanings (its nouns, verbs, adjectives)
    var Bk = root.Banca, bankEs = function (l) {
      if (!Bk || !Bk.loaded || !Bk.loaded() || !Bk.hasWord(l)) return "";
      try { var it = Bk.vocabSessionFor({ cards: {} }, [l], 1)[0]; return it && it.type === "choice" ? it.answer : ""; } catch (e) { return ""; }
    };
    if (!lemma) cands.some(function (c) { if (bankEs(c)) { lemma = c; return true; } return false; });
    lemma = lemma || w;
    var gl = gloss[lemma];
    var es = g ? g[1] : gl ? gl[1] : bankEs(lemma);
    var info = F && F.loaded() ? (F.info(w) || F.info(lemma)) : null;
    var lines = [];
    try { if (root.Desglose) lines = root.Desglose.lines(w, { gloss: gloss }); } catch (e) { lines = []; }
    var book = reading && DATA.books[reading.book];
    return { w: w, lemma: lemma, es: es, level: info ? info[2] : "", zipf: info ? Math.max(info[0], info[1]) : 0,
             week: book ? wordWeek(book, w) : model ? model.week(w) : 99, lines: lines };
  }
  function freqWord(z) {
    return !z ? "muy rara (no está en la lista de frecuencias)" : z >= 5 ? "muy frecuente" : z >= 4 ? "frecuente" : z >= 3 ? "poco frecuente" : "rara";
  }
  function mk(s) { return esc(s).replace(/\*([^*]+)\*/g, "<i>$1</i>"); }

  function showWord(k) {
    var doc = root.document, raw = tapWords[k];
    if (!raw) return;
    var x = lookup(raw);
    if (!x.w) return;
    var box = doc.getElementById("bxbox");
    if (!box) { box = doc.createElement("div"); box.id = "bxbox"; box.className = "mcbox bx-box"; doc.body.appendChild(box); }
    var s = st(), id = cardIdFor(x.lemma), has = !!(s.cards && s.cards[id]);
    box.innerHTML = '<p class="it"><b>' + esc(x.w) + "</b>" + (x.lemma && x.lemma !== x.w ? ' <span class="muted">(de <i>' + esc(x.lemma) + "</i>)</span>" : "") +
      ' <button class="tab" id="bx-say" aria-label="escuchar">🔊</button></p>' +
      (x.es ? '<p class="bx-es">' + esc(x.es) + "</p>" : '<p class="muted small">No está en el glosario del curso.</p>') +
      (x.lines.length ? '<p class="small">' + x.lines.map(mk).join("<br>") + "</p>" : "") +
      '<p class="muted small">Palabra ' + freqWord(x.zipf) + (x.level ? " · nivel " + esc(x.level) : "") + "</p>" +
      (has ? '<p class="small">📌 Ya está en tu repaso.</p>' :
        (x.es || id.indexOf("lib:") !== 0 ? '<button class="btn" id="bx-pin">📌 al repaso</button>' :
          '<div class="typed"><input id="bx-mine" maxlength="60" placeholder="¿qué creés que significa?"><button class="tab" id="bx-pin">📌 al repaso</button></div>')) +
      ' <button class="tab" id="bxclose">cerrar</button>';
    box.classList.add("on");
    var on = function (id2, fn) { var e = doc.getElementById(id2); if (e) e.onclick = fn; };
    on("bxclose", function () { box.classList.remove("on"); });
    on("bx-say", function () { if (H && H.speak) H.speak(x.w, true); });
    on("bx-pin", function () {
      var mine = doc.getElementById("bx-mine");
      var es = x.es || (mine && mine.value.trim());
      if (!es && id.indexOf("lib:") === 0) { if (mine) mine.focus(); return; }
      var got = pin(s, { w: x.w, lemma: x.lemma, es: es, ctx: sentenceOf(k), book: reading && reading.book });
      if (got) {
        if (H) { H.persist(); H.toast("📌 «" + x.lemma + "» va a tu repaso."); }
        box.classList.remove("on");
      }
    });
  }

  function leavePage(forward) {
    if (!reading) return;
    var s = st();
    if (forward) {
      var words = 0;
      (reading.pages[reading.pg] || []).forEach(function (p) { if (!isHeading(p)) words += wordCount(p); });
      var r = notePage(s, { book: reading.book, ch: reading.ch, pg: reading.pg, words: words, sec: (Date.now() - (reading.t0 || Date.now())) / 1000 });
      if (r.counted && r.xp && H) { H.gain(r.xp); if (H.strand) H.strand(r.xp); }
      if (!r.counted && r.why === "fast" && H && !warnedFast++) H.toast("Esa página fue muy rápida: no la cuento como leída.", 1800);
    }
    if (H && H.karaoke) H.karaoke.stop();
  }

  function go(view, screen) {
    view.screen = screen;
    if (H) { H.render(); if (root.scrollTo) root.scrollTo(0, 0); }
  }

  // Straight to a chapter (the percorso's «Leé un capítulo»); without one, the book.
  var creditWeek = null;   // the week of the mission that opened the chapter
  function openChapter(view, id, ch, week) {
    creditWeek = week || null;
    view.bxBook = id; view.bxAsk = false;
    if (ch == null || isNaN(ch)) { go(view, id ? "libro" : "biblioteca"); return; }
    view.bxCh = +ch;
    var p = ensure(st()).pos[id];
    view.bxPg = p && p.c === view.bxCh ? p.p : 0;
    reading = null;
    go(view, "lector");
  }

  function wire(screen, view) {
    var doc = root.document;
    if (!doc) return;
    var on = function (id, fn) { var e = doc.getElementById(id); if (e) e.onclick = fn; };
    on("bx-open", function () { go(view, "biblioteca"); });
    on("bx-back", function () { if (H) H.go(view.tab || "leggi"); });
    on("bx-lib", function () { go(view, "biblioteca"); });
    on("bx-tobook", function () { leavePage(false); go(view, "libro"); });
    doc.querySelectorAll("[data-bxbook]").forEach(function (e) {
      e.onclick = function () { view.bxBook = e.dataset.bxbook; go(view, "libro"); };
    });
    doc.querySelectorAll("[data-bxread]").forEach(function (e) {
      e.onclick = function () {
        view.bxBook = e.dataset.bxread; view.bxCh = +e.dataset.bxch; view.bxAsk = false;
        creditWeek = null;
        var s = st(), p = ensure(s).pos[view.bxBook];
        view.bxPg = p && p.c === view.bxCh ? p.p : 0;
        reading = null;
        go(view, "lector");
      };
    });
    if (screen !== "lector" || !reading) return;
    var s = st(), b = ensure(s);
    doc.querySelectorAll(".bx-text .w").forEach(function (e) {
      e.onclick = function () { showWord(+e.dataset.k); };
    });
    on("bx-next", function () { leavePage(true); view.bxPg = reading.pg + 1; if (H) H.persist(); go(view, "lector"); });
    on("bx-prev", function () {
      leavePage(false);
      if (reading.pg > 0) { view.bxPg = reading.pg - 1; go(view, "lector"); return; }
      if (reading.ch > 0) { view.bxCh = reading.ch - 1; view.bxPg = 1e6; reading = null; go(view, "lector"); }
    });
    on("bx-end", function () {
      leavePage(true);
      markRead(s, reading.book, reading.ch);
      if (H) H.persist();
      view.bxAsk = true;
      H.render();
      var e = doc.querySelector(".bx-self");
      if (e && e.scrollIntoView) e.scrollIntoView({ behavior: "smooth" });
    });
    doc.querySelectorAll("[data-bxself]").forEach(function (e) {
      e.onclick = function () {
        selfAssess(s, reading.book, reading.ch, +e.dataset.bxself);
        if (H) { H.persist(); H.toast(+e.dataset.bxself === 1 ? "Anotado: te voy a recomendar textos más fáciles." : "¡Bien! Capítulo leído."); }
        view.bxAsk = false;
        var book = DATA.books[reading.book];
        if (book && reading.ch + 1 < book.chapters.length) { view.bxCh = reading.ch + 1; view.bxPg = 0; reading = null; go(view, "lector"); }
        else go(view, "libro");
      };
    });
    on("bx-under", function () { b.under = !b.under; if (H) H.persist(); view.bxPg = reading.pg; go(view, "lector"); });
    on("bx-serif", function () { b.serif = !b.serif; if (H) H.persist(); view.bxPg = reading.pg; go(view, "lector"); });
    on("bx-bigger", function () { b.size = Math.min(3, (b.size || 0) + 1); if (H) H.persist(); view.bxPg = reading.pg; go(view, "lector"); });
    on("bx-smaller", function () { b.size = Math.max(-1, (b.size || 0) - 1); if (H) H.persist(); view.bxPg = reading.pg; go(view, "lector"); });
    on("bx-kar", function () {
      if (!H || !H.karaoke) return;
      var btn = doc.getElementById("bx-kar");
      if (H.karaoke.playing()) { H.karaoke.stop(); if (btn) btn.textContent = "🎧 Leer en voz alta"; return; }
      var page = reading.pages[reading.pg] || [];
      var text = page.filter(function (p) { return !isBreak(p); }).map(function (p) { return isHeading(p) ? headingText(p) : p; }).join("\n");
      if (btn) btn.textContent = "⏹ Parar";
      H.karaoke.start({ id: "bx:" + reading.book, title: (bookById(reading.book) || {}).title || "", text: text }, 1, "full");
      // back to «Leer en voz alta» when the page is over
      var t = root.setInterval(function () {
        var b2 = doc.getElementById("bx-kar");
        if (!b2 || !H.karaoke.playing()) { root.clearInterval(t); if (b2) b2.textContent = "🎧 Leer en voz alta"; }
      }, 800);
    });
  }

  var api = {
    WEEKS: WEEKS, TARGET: TARGET, PAGE_WORDS: PAGE_WORDS, RANK_PER_WEEK: RANK_PER_WEEK,
    Model: Model, namesOf: namesOf, coverageOf: coverageOf, addHist: addHist, covAt: covAt, weekFor: weekFor, levelOfWeek: levelOfWeek,
    wordCount: wordCount, chapterWords: chapterWords, sentences: sentences, pages: pages, isHeading: isHeading, strip: strip,
    ensure: ensure, readingWeek: readingWeek, minSeconds: minSeconds, notePage: notePage, statsDays: statsDays,
    selfAssess: selfAssess, markRead: markRead, isRead: isRead, nextChapter: nextChapter, recommend: recommend,
    openWeek: openWeek, firstOpenWeek: firstOpenWeek, mission: mission, minutes: minutes, loaded: loaded, index: index,
    cardIdFor: cardIdFor, pin: pin, reviewItem: reviewItem,
    setData: setData, loadIndex: loadIndex, loadBook: loadBook, loadModel: loadModel, lookup: lookup,
    init: init, owns: owns, render: render, wire: wire, leggiCard: leggiCard, ioCard: ioCard, openChapter: openChapter
  };
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Biblioteca = api;
})(typeof window !== "undefined" ? window : globalThis);
