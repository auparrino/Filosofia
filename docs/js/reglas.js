/*
 * Un aprendizaje que se adapta: la regla como ficha, lo que se hace con
 * cada respuesta, y la transferencia de un módulo al repaso.
 *
 * 1. La regla como ficha (r:<semana>:<bloque>).  Cada ejercicio del curso
 *    está enlazado al bloque de teoría que lo explica (Porque.blockFor).
 *    Contestar un ejercicio abre o alimenta la ficha de su regla, una vez
 *    por día; cuando la ficha vence, el repaso no repite la oración de
 *    siempre: pide una oración NUEVA con esa regla, del banco (con toda su
 *    gramática ya enseñada: Banca.sentenceOk) o, si el banco no tiene,
 *    otro ejercicio del curso del mismo bloque, escrito y el menos visto.
 *    La retención larga de la gramática pide reaprendizaje espaciado en
 *    producción y sobre material nuevo (Rawson & Dunlosky 2022; Serfaty &
 *    Serrano 2024; Loewen et al. 2019).
 *
 * 2. Lo que se hace con una respuesta (afterAnswer): la ficha del ítem, con
 *    un criterio (F4): en las rondas, un reconocimiento acertado de un
 *    ejercicio sin ficha no crea ficha (queda anotado: la próxima vez viene
 *    escrito, y la regla ya tiene la suya); entra lo que falló y lo que se
 *    escribió.
 *
 * 3. Transferencia por ítem (Engine.enqueue): el chequeo de la lección
 *    fallado, la pregunta de lectura fallada, el bloque del dictogloss que
 *    no salió, el hueco del C-test, vuelven mañana como ficha propia, y la
 *    Clínica abre con «tus errores de esta semana» (Metcalfe 2017).
 *
 * 4. Para las rondas: la sfida del día (seis preguntas escritas de reglas
 *    vencidas), las reglas de hace un mes o más en Dominala, la estructura
 *    del mes anterior en Scrivi, la escalera dentro de la ronda (un
 *    reconocimiento bien y rápido: lo siguiente de la misma regla, escrito;
 *    un escrito fallado: con opciones) y las fichas más frías para volver.
 *
 * Sin DOM.  El núcleo no nombra un idioma.
 *
 *   Reglas.use(course, map)                  el curso (lo llama Drills.itemsById)
 *   Reglas.ruleOf(item) → "r:W:B" | null
 *   Reglas.reviewItem(ruleId, state)         una oración nueva de esa regla
 *   Reglas.afterAnswer(state, item, q, o)    ficha del ítem y de su regla
 *   Reglas.isOld(item, state)                ¿una regla de hace un mes o más?
 *   Reglas.dailyItems(state, n) · oldItems(state, week, n)
 *   Reglas.coldest(state, n, known)          las fichas con menos chance de recuerdo
 *   Reglas.scriviExtra(state, week)          la estructura del mes anterior
 *   Reglas.adaptNext(round, item, q, fast)   la escalera dentro de la ronda
 *   Reglas.fromLesson / fromReading / fromDictogloss / fromCtest
 *   Reglas.ownItem(state, id) · ownRecent(state, n) · clinicIntro(state)
 */
(function (root) {
  "use strict";

  var DAY = 86400000;
  function E() { return root.Engine; }
  function Bk() { return root.Banca && root.Banca.loaded && root.Banca.loaded() ? root.Banca : null; }

  var COURSE = null, MAP = null;
  var RULE = {}, BYWEEK = {}, BANK = null;
  function use(course, map) {
    if (course && course !== COURSE) { COURSE = course; RULE = {}; BYWEEK = {}; BANK = null; }
    if (map) MAP = map;
  }

  function hash(s) {
    var h = 5381;
    s = String(s);
    for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36);
  }
  function strip(s) { return String(s == null ? "" : s).replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1").trim(); }
  function unlocked(state) { return Math.min(52, (state && state.unlocked) || 1); }

  /* ------------------------------------------------------ la regla de un ítem */

  var SKIP_SRC = { lettura: 1, lab: 1, vocab: 1, frasi: 1, coniugatore: 1, ascolto: 1, suoni: 1, esame: 1,
                   lezione: 1, dictogloss: 1, ctest: 1 };
  function eligible(it) {
    return !!(it && it.id && !SKIP_SRC[it.src] && !it.frase && it.topic !== "esame" && it.type !== "hunt" &&
              it.type !== "intro" && it.type !== "word" && it.type !== "card");
  }
  function ruleOf(it) {
    if (!it) return null;
    if (it.rule) return it.rule;
    if (!eligible(it) || !COURSE || !root.Porque) return null;
    if (RULE.hasOwnProperty(it.id)) return RULE[it.id];
    var base = MAP && MAP[it.id], r = null;
    if (base || /^b:(gap|tr|err):/.test(it.id)) {
      var b = null;
      try { b = root.Porque.blockFor(base || it, { course: COURSE, week: base ? base.week : undefined, unlocked: 52 }); } catch (e) { b = null; }
      if (b && (base || b.sure)) r = "r:" + b.week + ":" + b.i;
    }
    RULE[it.id] = r;
    return r;
  }
  function parse(id) {
    var p = String(id || "").split(":");
    return p[0] === "r" && p.length === 3 ? { week: +p[1], i: +p[2] } : null;
  }
  // The exercises of the course a rule has (built a week at a time).
  function courseOf(rule) {
    var p = parse(rule);
    if (!p || !COURSE || !MAP) return [];
    if (!BYWEEK[p.week]) {
      var out = {}, w = COURSE.weeks[p.week - 1];
      ((w && w.items) || []).forEach(function (id) {
        var it = MAP[id], r = it && ruleOf(it);
        if (r) (out[r] = out[r] || []).push(id);
      });
      BYWEEK[p.week] = out;
    }
    return BYWEEK[p.week][rule] || [];
  }
  // The sentences of the bank a rule has (built once, the first time).
  function bankOf(rule) {
    var B = Bk();
    if (!B || !COURSE || !root.Porque) return [];
    if (!BANK) {
      BANK = {};
      ((B.bank() || {}).sentences || []).forEach(function (s, i) {
        var it = B.gapItem(i) || B.translateItem(i), b = null;
        try { b = root.Porque.blockFor(it, { course: COURSE, unlocked: 52 }); } catch (e) { b = null; }
        if (b && b.sure) { var k = "r:" + b.week + ":" + b.i; (BANK[k] = BANK[k] || []).push(i); }
      });
    }
    return BANK[rule] || [];
  }
  // What the review of a rule can ask (a listening or a sound, never).
  function askable(id) { var it = MAP && MAP[id]; return !!it && it.type !== "listen" && !it.nopeek; }
  function known(rule) { return courseOf(rule).some(askable) || bankOf(rule).length > 0; }

  var TYPED = { cloze: 1, translate: 1, conjugate: 1, plural: 1, numbers: 1, qa: 1, typed: 1 };
  // Production proper: a sentence (or most of one) written, not a form.
  var SENTENCE = { translate: 1, write: 1, qa: 1, combina: 1 };
  function production(it) {
    return !!(SENTENCE[it.type] || String(it.answer || "").trim().split(/\s+/).length >= 3);
  }

  /* The review of a rule: a new sentence with it.  First a sentence of the
     bank never met whose grammar is all taught; then an exercise of the
     course of the same block, written and never written before (or the one
     seen longest ago), never a listening. */
  function reviewItem(rule, state) {
    var p = parse(rule);
    if (!p) return null;
    var cards = (state && state.cards) || {}, B = Bk(), out = null;
    if (B && B.sentenceOk) {
      var cands = bankOf(rule).filter(function (i) {
        return !cards["b:gap:" + i] && !cards["b:tr:" + i] && (B.sentenceOk(i, state, "wg") || B.sentenceOk(i, state, "w"));
      });
      if (cands.length) {
        var i = cands[Math.floor(Math.random() * cands.length)];
        out = (B.sentenceOk(i, state, "wg") && B.gapItem(i)) || (B.sentenceOk(i, state, "w") ? B.translateItem(i) : null);
        if (out) out.novel = true;
      }
    }
    if (!out) {
      var ids = courseOf(rule).filter(askable);
      var rank = function (id) {
        var it = MAP[id], c = cards[id];
        return (TYPED[it.type] ? 0 : 4) + (c ? 1 + Math.min(0.99, (c.last || 0) / 1e13) : Math.random() * 0.5);
      };
      ids = ids.map(function (id) { return { id: id, r: rank(id) }; }).sort(function (a, b) { return a.r - b.r; });
      if (ids.length) out = MAP[ids[0].id];
    }
    if (!out) return null;
    var copy = {};
    Object.keys(out).forEach(function (k) { copy[k] = out[k]; });
    copy.rule = rule;
    copy.ruleReview = true;
    return copy;
  }

  // A rule of a month ago or more (for the xp and the reports apart).
  function isOld(it, state) {
    var wk = 0, p = parse(it && it.rule);
    if (p) wk = p.week;
    else if (it && MAP && MAP[it.id]) wk = MAP[it.id].week || 0;
    return !!wk && wk <= unlocked(state) - 4;
  }

  /* ------------------------------------------------------ una respuesta */

  // Rounds whose exercises are the course's (the review has its own cards).
  var ROUNDISH = { round: 1, sfida: 1, giorno: 1, boss: 1, domina: 1, debil: 1 };
  var LIGHT = { round: 1, sfida: 1, giorno: 1, boss: 1, domina: 1 };

  /* The rule card, from an answer in a round: opened by an exercise of the
     course, fed at most once a day (practising a rule ten times in a
     session is one review, not ten), except a first miss of the day.  A
     right recognition only opens it (it comes back written in three or
     four days); on an open card it says nothing about producing. */
  function touch(state, it, q, o) {
    var rule = ruleOf(it);
    if (!rule) return null;
    var Eg = E(), cards = state.cards, c = cards[rule], now = o.now || Date.now();
    if (!c && !(MAP && MAP[it.id])) return null;
    var today = Eg.dayKey(new Date(now));
    if (c && c.last && Eg.dayKey(new Date(c.last)) === today && !(q === 0 && c.failDay !== today)) return c;
    var rating = q === 0 ? 1 : q === 1 ? 2 : o.produced && o.fast ? 4 : 3;
    if (!o.produced && q === 2 && c) return c;
    c = cards[rule] = Eg.schedule(c, q, { rating: rating, id: rule, state: state, now: now, notte: false });
    if (q === 0) c.failDay = today;
    return c;
  }
  // The rule card when its own review is answered (a new sentence).
  function feed(state, rule, q, o) {
    var Eg = E(), now = o.now || Date.now();
    var c = state.cards[rule] = Eg.schedule(state.cards[rule], q, {
      id: rule, state: state, now: now, fast: !!o.fast, slow: !!o.slow, hint: !!o.hint,
      retry: !!o.retry, notte: o.notte });
    if (q === 0) c.failDay = Eg.dayKey(new Date(now));
    return c;
  }

  /* afterAnswer(state, it, q, o): the card of the item and of its rule.
     q: 0 wrong, 1 close, 2 right.  o: { kind (of the round), now, ekind
     (slip / vocab / rule), fast, slow, ms, hint, notte, produced }.
     → { card: created or updated, rule: the rule card or null } */
  function afterAnswer(state, it, q, o) {
    o = o || {};
    var Eg = E(), now = o.now || Date.now();
    if (!state.cards) state.cards = {};
    var produced = o.produced != null ? !!o.produced : !it.recog && it.type !== "choice" && !it.options;
    var res = { card: false, rule: null };
    // A question of a reading missed comes back tomorrow, with its text.
    var own = String(it.id).indexOf("own:") === 0;
    if (it.src === "lettura" && q < 2 && !it.nocard && !own && it.type === "choice" && !it.retry) fromReading(state, it, now);
    if (it.src !== "coniugatore" && (it.src !== "lettura" || own) && !it.nocard) {
      var had = !!state.cards[it.id], isCourse = !!(MAP && MAP[it.id]);
      // F4: in the rounds, an exercise of the course right at first makes a
      // card only when it was real production (a sentence written, not a
      // form in a gap: the rule card keeps the form coming back, in new
      // sentences).  What fails enters: a sentence or a recognition as its
      // own card; a form written wrong, as the card of its rule, which is
      // due tomorrow with another sentence (the rule is the unit).  The
      // new sentence of a rule makes none (its rule card brings another
      // one, right or wrong).
      var form = isCourse && ROUNDISH[o.kind] && !production(it);
      var skip = !had && ((q === 2 && isCourse && ROUNDISH[o.kind] && !(produced && production(it))) ||
                          (q < 2 && form && produced && !it.retry && !!ruleOf(it)) || it.ruleReview);
      if (skip && q === 2) {
        if (!state.recog) state.recog = {};
        state.recog[it.id] = Math.round(now / 60000);
      }
      if (!skip) {
        var light = produced && !it.frase && it.src !== "vocab" && it.src !== "lab" && it.src !== "banca" &&
                    !it.retry && !it.ruleReview && !!LIGHT[o.kind];
        state.cards[it.id] = Eg.schedule(state.cards[it.id], q, {
          light: light, kind: o.ekind, id: it.id, state: state, retry: !!it.retry, hint: !!o.hint,
          fast: !!o.fast, slow: !!o.slow, ms: o.ms, notte: o.notte, now: now });
        if (produced && q === 2) state.cards[it.id].prod = 1;
        Eg.maybeFit(state);
        res.card = true;
      }
    }
    if (it.ruleReview && it.rule) res.rule = feed(state, it.rule, q, { now: now, fast: o.fast, slow: o.slow, hint: o.hint, retry: it.retry, notte: o.notte });
    else if (!it.retry && it.src !== "coniugatore") res.rule = touch(state, it, q, { now: now, produced: produced, fast: o.fast });
    return res;
  }

  /* ------------------------------------------------------ fichas más frías */

  function recallOf(c, now) {
    var Eg = E();
    if (!c || !c.last || !(c.s > 0)) return 0;
    return Eg.retrievability(Math.max(0, (now - c.last) / DAY), c.s);
  }
  /* The cards with the lowest chance of recall right now (retrievability),
     among those the review can ask (knownFn). */
  function coldest(state, n, knownFn) {
    var now = Date.now(), cards = (state && state.cards) || {};
    return Object.keys(cards).filter(function (id) { return !knownFn || knownFn(id); })
      .map(function (id) { return { id: id, r: recallOf(cards[id], now) }; })
      .sort(function (a, b) { return a.r - b.r; })
      .slice(0, n).map(function (x) { return x.id; });
  }
  // The rule cards, the due ones first, the coldest first.
  function coldRules(state, opts) {
    opts = opts || {};
    var now = Date.now(), cards = (state && state.cards) || {};
    return Object.keys(cards).filter(function (id) {
      var p = parse(id);
      if (!p || (opts.maxWeek && p.week > opts.maxWeek)) return false;
      return known(id);
    }).map(function (id) {
      var c = cards[id];
      return { id: id, r: recallOf(c, now) - (c.due && c.due <= now ? 1 : 0) };
    }).sort(function (a, b) { return a.r - b.r; }).map(function (x) { return x.id; });
  }
  function writtenItem(it) { return it && !it.options && it.type !== "choice" && it.type !== "listen"; }

  /* The daily challenge: six written questions of the rules that are due
     (the coldest first).  Short of rules, written exercises of the course
     already met, then of the open week. */
  function dailyItems(state, n) {
    n = n || 6;
    var out = [], seen = {};
    var add = function (it) { if (it && !seen[it.id] && out.length < n) { seen[it.id] = 1; out.push(it); } };
    coldRules(state).slice(0, n * 3).forEach(function (rule) {
      if (out.length >= n) return;
      var it = reviewItem(rule, state);
      if (writtenItem(it)) add(it);
    });
    if (out.length < n && COURSE && MAP) {
      var wk = unlocked(state), cands = [];
      for (var w = wk; w >= 1 && cands.length < 60; w--) {
        ((COURSE.weeks[w - 1] || {}).items || []).forEach(function (id) {
          var it = MAP[id];
          if (writtenItem(it) && TYPED[it.type] && (state.cards[id] || w === wk)) cands.push(it);
        });
      }
      var D = root.Drills;
      (D ? D.pickFresh(cands, n * 2, state) : cands).forEach(add);
    }
    return out;
  }

  /* Dominala asks, besides the week, a few rules of a month ago or more
     (reported apart: they say whether what was learnt stayed). */
  function oldItems(state, week, n) {
    var out = [], seen = {};
    coldRules(state, { maxWeek: week - 4 }).forEach(function (rule) {
      if (out.length >= n) return;
      var it = reviewItem(rule, state);
      if (it && !seen[it.id] && writtenItem(it)) { seen[it.id] = 1; it.old = true; out.push(it); }
    });
    return out;
  }

  /* ------------------------------------------------------ Scrivi */

  /* Scrivi of week W asks, besides its own structures, one of the month
     before: the one of the most overdue rule card of four weeks ago or
     more (the structures are the package's: Scrivi.TASKS[week].use, and
     its detectors do the counting).  Chosen once per week and kept in
     state.scriviExtra; added to the task in memory, the package's file
     is not touched. */
  function scriviExtra(state, week) {
    var S = root.Scrivi, task = S && S.TASKS && S.TASKS[week];
    if (!task || !task.use) return null;
    if (!state.scriviExtra) state.scriviExtra = {};
    var saved = state.scriviExtra[week];
    if (saved === undefined && week >= 5 && !(state.scritti || {})[week]) {
      saved = null;
      var have = {};
      task.use.forEach(function (u) { if (!u.extra) have[u[0]] = 1; });
      var weeks = [];
      coldRules(state, { maxWeek: week - 4 }).forEach(function (r) { var p = parse(r); if (weeks.indexOf(p.week) < 0) weeks.push(p.week); });
      for (var k = week - 4; k >= Math.max(1, week - 8); k--) if (weeks.indexOf(k) < 0) weeks.push(k);
      for (var i = 0; i < weeks.length && !saved; i++) {
        var t = S.TASKS[weeks[i]];
        ((t && t.use) || []).forEach(function (u) {
          if (saved || u.extra || have[u[0]]) return;
          saved = [u[0], 1, "Del mes pasado (semana " + weeks[i] + "): " + String(u[2]).replace(/^\d+\s+/, "") + ", al menos 1", weeks[i]];
        });
      }
      state.scriviExtra[week] = saved;
    }
    task.use = task.use.filter(function (u) { return !u.extra; });
    if (saved) {
      var e = saved.slice(0, 3);
      e.extra = true;
      task.use.push(e);
    }
    return saved || null;
  }

  /* ------------------------------------------------------ la escalera */

  /* Inside a round: a recognition right and quick → the next exercise of
     the same rule comes written; a written one missed → the next of the
     same rule comes with options.  Changes round.items in place. */
  function adaptNext(round, it, q, fast) {
    if (!round || !round.items || !it || it.retry || !MAP) return null;
    var rule = ruleOf(it);
    if (!rule) return null;
    var D = root.Drills;
    for (var k = round.i + 1; k < round.items.length; k++) {
      var nx = round.items[k];
      if (!nx || nx.retry || nx.id === it.id || ruleOf(nx) !== rule) continue;
      if (it.recog && q === 2 && fast && nx.recog && MAP[nx.id] && TYPED[MAP[nx.id].type]) {
        round.items[k] = MAP[nx.id];
        return "written";
      }
      var wrote = !it.recog && !it.options && it.type !== "choice";
      if (wrote && q === 0 && !nx.recog && !nx.options && D && D.recognitionOf) {
        var rc = D.recognitionOf(nx, round.items, round.week);
        if (rc) { round.items[k] = rc; return "options"; }
      }
      return null;
    }
    return null;
  }

  /* ------------------------------------------------------ transferencia */

  function enqueue(state, id, item, opts) { return E() && E().enqueue ? E().enqueue(state, id, item, opts) : null; }

  // A check of the lesson missed: back tomorrow, recognising, with the rule in sight.
  function fromLesson(state, w, q, now) {
    if (!state || !w || !q || !q.options || !q.answer) return null;
    var b = ((w.lesson || {}).blocks || [])[q.block] || {};
    var rule = strip(b.r || b.warn || b.tip || "");
    var id = "own:lez:" + w.week + ":" + (q.block == null ? "x" : q.block) + ":" + hash(q.prompt + "|" + (q.stem || "") + "|" + q.answer);
    return enqueue(state, id, {
      src: "lezione", type: "choice", prompt: q.prompt, stem: q.stem || "", options: q.options.slice(),
      answer: q.answer, accept: [q.answer], note: rule, ruleShown: rule.length <= 260 ? rule : "", fig: q.fig,
      week: w.week, block: q.block, from: "Chequeo de la lección " + w.week }, { src: "lezione", week: w.week, now: now });
  }
  // A question of a reading missed: back tomorrow, with its text.
  function fromReading(state, it, now) {
    return enqueue(state, "own:" + it.id, {
      src: "lettura", type: "choice", prompt: it.prompt, stem: it.stem, options: (it.options || []).slice(),
      answer: it.answer, accept: it.accept || [it.answer], note: it.note || "", ep: it.ep, withText: !!it.ep,
      nocard: false, from: "Lectura" }, { src: "lettura", now: now });
  }
  // The sentence of a text that holds a piece (for a gap of that piece).
  function sentenceWith(text, piece, norm) {
    norm = norm || function (x) { return String(x).toLowerCase(); };
    var ss = String(text || "").replace(/([.!?…]["»”)]*)\s+/g, "$1\n").split(/\n+/);
    for (var i = 0; i < ss.length; i++) if (norm(ss[i]).indexOf(norm(piece)) >= 0) return ss[i].trim();
    return "";
  }
  function gapIn(sent, piece) {
    var at = sent.toLowerCase().indexOf(String(piece).toLowerCase());
    return at < 0 ? "" : sent.slice(0, at) + "___" + sent.slice(at + piece.length);
  }
  // The blocks of the dictogloss not recovered: each one as a gap in its sentence.
  function fromDictogloss(state, t, r, week, now) {
    if (!state || !t || !r) return 0;
    var n = 0;
    (r.missed || []).slice(0, 3).forEach(function (chunk) {
      var sent = sentenceWith(t.text, chunk);
      var stem = sent && gapIn(sent, chunk);
      if (!stem) return;
      enqueue(state, "own:dg:" + (week || t.week) + ":" + hash(chunk), {
        src: "dictogloss", type: "cloze", prompt: "El bloque que no salió en el dictogloss «" + (t.title || "") + "»",
        stem: stem, answer: chunk, accept: [chunk], note: t.es || "", say: sent, week: week || t.week,
        from: "Dictogloss" }, { src: "dictogloss", week: week || t.week, now: now });
      n++;
    });
    return n;
  }
  /* The gaps of the C-test (or of the rational cloze) missed at the first
     try: each one in its sentence, the rest of the text whole. */
  function fromCtest(state, built, first, now) {
    if (!state || !built || !first || !first.per) return 0;
    var n = 0;
    first.per.forEach(function (v, i) {
      if (v === "giusto" || n >= 5) return;
      var g = built.gaps[i];
      if (!g) return;
      var MARK = "\u0001", text = "";
      (built.parts || []).forEach(function (p) {
        if (p.t != null) text += p.t;
        else if (p.gap === i) text += (g.shown || "") + MARK;
        else if (built.gaps[p.gap]) text += built.gaps[p.gap].full;
      });
      var sent = sentenceWith(text, MARK);
      if (!sent) return;
      var ans = g.cat === "ctest" ? g.answer : g.full;
      enqueue(state, "own:ct:" + hash(sent + "|" + g.full), {
        src: "ctest", type: "cloze", prompt: g.cat === "ctest" ? "Completá la palabra" : "Completá con la palabra que falta",
        stem: sent.replace(MARK, "___"), answer: ans, accept: [ans, g.full].concat(g.alt || []),
        note: "", say: sent.replace(MARK, g.cat === "ctest" ? g.answer : g.full), from: "C-test" }, { src: "ctest", now: now });
      n++;
    });
    return n;
  }

  function ownItem(state, id) {
    var o = state && state.own && state.own[id];
    if (!o || !o.it) return null;
    var copy = {};
    Object.keys(o.it).forEach(function (k) { copy[k] = o.it[k]; });
    return copy;
  }
  // The learner's own items of the last seven days not yet learnt, the newest first.
  function ownRecent(state, n) {
    var now = Date.now(), cards = (state && state.cards) || {}, own = (state && state.own) || {};
    return Object.keys(own).filter(function (id) {
      var c = cards[id];
      return now - (own[id].at || 0) < 7 * DAY && (!c || !c.reps);
    }).sort(function (a, b) { return own[b].at - own[a].at; }).slice(0, n || 6)
      .map(function (id) { var it = ownItem(state, id); if (it) it.clinic = "own"; return it; }).filter(Boolean);
  }
  // «Tus errores de esta semana», with their rule, before the exercises.
  function clinicIntro(state) {
    var now = Date.now(), seen = {}, rows = [];
    ((state && state.errLog) || []).forEach(function (e) {
      if (!e || now - (e.at || 0) > 7 * DAY || seen[e.cat] || rows.length >= 4) return;
      seen[e.cat] = 1;
      rows.push(e);
    });
    if (!rows.length) return null;
    var D = root.Diagnosi, label = function (e) { return e.l || (D && D.LABEL && D.LABEL[e.cat]) || e.cat; };
    return { id: "clinica:intro", src: "clinica", type: "card", prompt: "Tus errores de esta semana",
             h: "Lo que más se te escapó estos días",
             body: rows.map(function (e) { return "**" + label(e) + "**" + (e.x ? ": " + strip(e.x) : "."); }).join(" · ") +
               " Ahora, ejercicios con eso: primero los tuyos, después otros de la misma regla.",
             ex: rows.filter(function (e) { return e.g && e.e; }).map(function (e) { return [e.g, e.e]; }) };
  }

  var api = {
    use: use, ruleOf: ruleOf, parse: parse, courseOf: courseOf, bankOf: bankOf, known: known,
    reviewItem: reviewItem, isOld: isOld, afterAnswer: afterAnswer, touch: touch, feed: feed,
    coldest: coldest, coldRules: coldRules, dailyItems: dailyItems, oldItems: oldItems,
    scriviExtra: scriviExtra, adaptNext: adaptNext,
    fromLesson: fromLesson, fromReading: fromReading, fromDictogloss: fromDictogloss, fromCtest: fromCtest,
    ownItem: ownItem, ownRecent: ownRecent, clinicIntro: clinicIntro, hash: hash
  };
  if (typeof module === "object" && module.exports) module.exports = api;
  root.Reglas = api;
})(typeof window !== "undefined" ? window : globalThis);
