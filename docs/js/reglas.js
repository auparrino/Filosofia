/*
 * Un aprendizaje que se adapta: la regla como ficha, lo que se hace con
 * cada respuesta, y la transferencia de un módulo al repaso.
 *
 * 1. La regla como ficha (r:<semana>:<bloque>).  Cada ejercicio del curso
 *    está enlazado al bloque de teoría que lo explica (Porque.blockFor).
 *    Contestar un ejercicio abre o alimenta la ficha de su regla, una vez
 *    por día; cuando la ficha vence, el repaso no repite la oración de
 *    siempre: pide otro ejercicio del curso del mismo bloque, escrito y el
 *    menos visto.
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
 *    fallado vuelve mañana como ficha propia (Metcalfe 2017).
 *
 * 4. Para las rondas: la sfida del día (seis preguntas escritas de reglas
 *    vencidas), las reglas de hace un mes o más en Dominala, la escalera dentro de la ronda (un
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
 *   Reglas.adaptNext(round, item, q, fast)   la escalera dentro de la ronda
 *   Reglas.fromLesson(state, week, q)        el chequeo fallado, mañana
 *   Reglas.ownItem(state, id)
 */
(function (root) {
  "use strict";

  var DAY = 86400000;
  function E() { return root.Engine; }

  var COURSE = null, MAP = null;
  var RULE = {}, BYWEEK = {};
  function use(course, map) {
    if (course && course !== COURSE) { COURSE = course; RULE = {}; BYWEEK = {}; }
    if (map) MAP = map;
  }

  function hash(s) {
    var h = 5381;
    s = String(s);
    for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36);
  }
  function strip(s) { return String(s == null ? "" : s).replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1").trim(); }
  function unlocked(state) { return Math.min(root.Engine.weeks(), (state && state.unlocked) || 1); }

  /* ------------------------------------------------------ la regla de un ítem */

  var SKIP_SRC = { vocab: 1, lezione: 1 };
  function eligible(it) {
    return !!(it && it.id && !SKIP_SRC[it.src] && it.type !== "word" && it.type !== "card");
  }
  function ruleOf(it) {
    if (!it) return null;
    if (it.rule) return it.rule;
    if (!eligible(it) || !COURSE || !root.Porque) return null;
    if (RULE.hasOwnProperty(it.id)) return RULE[it.id];
    var base = MAP && MAP[it.id], r = null;
    if (base) {
      var b = null;
      try { b = root.Porque.blockFor(base, { course: COURSE, week: base.week, unlocked: 999 }); } catch (e) { b = null; }
      if (b) r = "r:" + b.week + ":" + b.i;
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
  // What the review of a rule can ask (a listening or a sound, never).
  function askable(id) { var it = MAP && MAP[id]; return !!it && it.type !== "listen" && !it.nopeek; }
  function known(rule) { return courseOf(rule).some(askable); }

  var TYPED = { cloze: 1, translate: 1, conjugate: 1, plural: 1, numbers: 1, qa: 1, typed: 1 };
  // Production proper: a sentence (or most of one) written, not a form.
  var SENTENCE = { translate: 1, write: 1, qa: 1, combina: 1 };
  function production(it) {
    return !!(SENTENCE[it.type] || String(it.answer || "").trim().split(/\s+/).length >= 3);
  }

  /* The review of a rule: an exercise of the course of the same block,
     written and never written before (or the one seen longest ago), never
     a listening. */
  function reviewItem(rule, state) {
    var p = parse(rule);
    if (!p) return null;
    var cards = (state && state.cards) || {};
    var ids = courseOf(rule).filter(askable);
    var rank = function (id) {
      var it = MAP[id], c = cards[id];
      return (TYPED[it.type] ? 0 : 4) + (c ? 1 + Math.min(0.99, (c.last || 0) / 1e13) : Math.random() * 0.5);
    };
    ids = ids.map(function (id) { return { id: id, r: rank(id) }; }).sort(function (a, b) { return a.r - b.r; });
    var out = ids.length ? MAP[ids[0].id] : null;
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
    if (!it.nocard) {
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
        var light = produced && it.src !== "vocab" && !it.retry && !it.ruleReview && !!LIGHT[o.kind];
        state.cards[it.id] = Eg.schedule(state.cards[it.id], q, {
          light: light, kind: o.ekind, id: it.id, state: state, retry: !!it.retry, hint: !!o.hint,
          fast: !!o.fast, slow: !!o.slow, ms: o.ms, notte: o.notte, now: now });
        if (produced && q === 2) state.cards[it.id].prod = 1;
        Eg.maybeFit(state);
        res.card = true;
      }
    }
    if (it.ruleReview && it.rule) res.rule = feed(state, it.rule, q, { now: now, fast: o.fast, slow: o.slow, hint: o.hint, retry: it.retry, notte: o.notte });
    else if (!it.retry) res.rule = touch(state, it, q, { now: now, produced: produced, fast: o.fast });
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
  function ownItem(state, id) {
    var o = state && state.own && state.own[id];
    if (!o || !o.it) return null;
    var copy = {};
    Object.keys(o.it).forEach(function (k) { copy[k] = o.it[k]; });
    return copy;
  }
  var api = {
    use: use, ruleOf: ruleOf, parse: parse, courseOf: courseOf, known: known,
    reviewItem: reviewItem, isOld: isOld, afterAnswer: afterAnswer, touch: touch, feed: feed,
    coldest: coldest, coldRules: coldRules, dailyItems: dailyItems, oldItems: oldItems,
    adaptNext: adaptNext, fromLesson: fromLesson, ownItem: ownItem, hash: hash
  };
  if (typeof module === "object" && module.exports) module.exports = api;
  root.Reglas = api;
})(typeof window !== "undefined" ? window : globalThis);
