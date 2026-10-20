/*
 * «Ahora vos: una más» (auditoría 3.0, C-correccion P3): después de un
 * error de regla, la hoja de corrección ofrece UN ítem nuevo de la misma
 * regla con otras palabras.  Es transferencia, no repetición: prueba que
 * la regla generaliza, como el jefe.  No reemplaza la vuelta más fácil del
 * mismo ítem (que sigue viniendo tres preguntas después): es opcional,
 * entra como la pregunta siguiente y cuenta como práctica escrita (xp de
 * la cuerda output), sin quitar vidas ni sumar a las estrellas de la
 * semana.
 *
 * Cuándo: la respuesta salió mal (o casi) por una regla, es decir, una
 * categoría de gramática: ni de vocabulario (GROUPS.lexical), ni un desliz
 * (dg.slip, GROUPS.slips), ni lo que la Clínica no conoce
 * (Errores.clinicCat).  Una vez por ítem y por ronda, nunca en el jefe, el
 * examen, Dominala ni las rondas de lectura, oído o frases.
 *
 * De dónde sale, en este orden (nada antes de su teoría):
 *   1. una oración del banco con la misma regla (Reglas.bankOf) y toda su
 *      gramática ya enseñada (Banca.sentenceOk): el hueco o, si no tiene,
 *      la traducción;
 *   2. otro ejercicio del mismo bloque de la lección (Reglas.courseOf, que
 *      arma Porque.blockFor), escrito y el menos visto;
 *   3. una oración del banco de la misma categoría de error (Banca.CURE:
 *      gapSession / translateSession por etiqueta, errorSession).
 * Siempre con otra respuesta y otro enunciado que el ítem fallado, y nada
 * que ya esté en la ronda.
 *
 *   UnaMas.offer(item, ctx) → ítem nuevo | null
 *       ctx: { q (0 mal, 1 casi), ekind ("rule" | "vocab" | "slip"),
 *              dg (el diagnóstico), kind (de la ronda), state, round, course }
 *   UnaMas.take(round, nuevo)     lo pone como la pregunta siguiente
 *   UnaMas.button() / badge(item) el html de la hoja y del enunciado
 *
 * Sin DOM; el núcleo no nombra un idioma.  Test: tools/lib/test_unamas.js.
 */
(function (root) {
  "use strict";

  // The rounds where it makes sense: practice of rules.  Not the boss, the
  // exam, Dominala (they measure), nor reading, listening or phrases.
  var ROUNDS = { round: 1, gym: 1, debil: 1, clinica: 1, "b-gap": 1, "b-tr": 1, "b-err": 1, lista: 1,
                 giorno: 1, pausa: 1, micro: 1, review: 1, sfida: 1, ritorno: 1 };
  var TYPED = { cloze: 1, translate: 1, conjugate: 1, plural: 1, typed: 1, qa: 1, write: 1 };

  function Rg() { return root.Reglas || null; }
  function Bk() { return root.Banca && root.Banca.loaded && root.Banca.loaded() ? root.Banca : null; }
  function groups() {
    var D = root.Diagnosi, L = root.LANG || {};
    return (D && D.GROUPS) || L.diagGroups || {};
  }
  function norm(s) {
    var E = root.Engine;
    return E && E.normalise ? E.normalise(String(s == null ? "" : s)) : String(s == null ? "" : s).toLowerCase().trim();
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  /* A mistake of a rule: grammar, not a word nor a slip. */
  function isRule(ctx) {
    if (!ctx || ctx.q == null || ctx.q >= 2) return false;
    if (ctx.ekind === "slip" || ctx.ekind === "vocab") return false;
    var dg = ctx.dg, G = groups();
    if (dg && dg.cat) {
      if (dg.slip || (G.lexical || {})[dg.cat] || (G.slips || {})[dg.cat]) return false;
      var Er = root.Errores;
      if (Er && Er.clinicCat && !Er.clinicCat(dg.cat)) return false;
    }
    return true;
  }

  // A written item (not picked among options, not heard).
  function written(it) {
    return !!it && !it.options && it.type !== "choice" && it.type !== "listen" && it.type !== "dictation" &&
           it.type !== "hunt" && it.type !== "tiles" && !it.nopeek && !it.frase;
  }

  /* The sentence of the target language an item works on: the gap filled,
     or the answer when it is a whole sentence (a translation). */
  function sentenceOf(it) {
    var st = String(it.stem || ""), ans = String(it.answer || "").split("|")[0];
    if (/_{3,}/.test(st) && !/^\s*_+\s*$/.test(st)) return st.replace(/\([^)]*\)/g, " ").replace(/_{3,}/, ans);
    return ans;
  }
  function words(s) {
    return norm(s).split(/[^a-z0-9\u00c0-\u024f']+/).filter(function (t) { return t.length > 1; });
  }
  // Two sentences with mostly the same words (Jaccard over the words).
  function same(a, b) {
    var A = words(a), Bw = words(b);
    if (!A.length || !Bw.length) return false;
    var set = {}, inter = 0, uni = {};
    A.forEach(function (t) { set[t] = 1; uni[t] = 1; });
    Bw.forEach(function (t) { if (set[t] === 1) { inter++; set[t] = 2; } uni[t] = 1; });
    return inter / Object.keys(uni).length > 0.5;
  }

  // What the new one cannot be: the same exercise, the same answer or
  // statement, the same sentence with other clothes (a gap and its
  // translation), or something the round already has.
  function usedOf(it, round) {
    var ids = {}, answers = {}, stems = {}, sent = sentenceOf(it);
    ids[it.id] = 1;
    answers[norm(it.answer)] = 1;
    if (it.stem) stems[norm(it.stem)] = 1;
    if (round) {
      (round.items || []).forEach(function (x) { if (x && x.id) ids[x.id] = 1; });
      (round.log || []).forEach(function (x) { if (x && x.id) ids[x.id] = 1; });
    }
    return function (x) {
      return !x || ids[x.id] || answers[norm(x.answer)] || (x.stem && stems[norm(x.stem)]) || same(sent, sentenceOf(x));
    };
  }

  function fromBankRule(rule, state, used) {
    var R = Rg(), B = Bk();
    if (!R || !R.bankOf || !B || !B.sentenceOk) return null;
    var cards = (state && state.cards) || {};
    var idx = R.bankOf(rule).filter(function (i) { return B.sentenceOk(i, state, "wg") || B.sentenceOk(i, state, "w"); });
    // the ones never met first
    var fresh = idx.filter(function (i) { return !cards["b:gap:" + i] && !cards["b:tr:" + i]; });
    var list = shuffle(fresh).concat(shuffle(idx.filter(function (i) { return fresh.indexOf(i) < 0; })));
    for (var k = 0; k < list.length; k++) {
      var i = list[k];
      var x = (B.sentenceOk(i, state, "wg") && B.gapItem(i)) || (B.sentenceOk(i, state, "w") ? B.translateItem(i) : null);
      if (x && !used(x)) return x;
    }
    return null;
  }

  function fromCourse(rule, state, used, map) {
    var R = Rg();
    if (!R || !R.courseOf || !map) return null;
    var p = R.parse ? R.parse(rule) : null;
    if (p && p.week > Math.min(52, (state && state.unlocked) || 1)) return null;
    var cards = (state && state.cards) || {};
    var ids = R.courseOf(rule).filter(function (id) { var x = map[id]; return written(x) && !used(x); });
    var rank = function (id) {
      var c = cards[id];
      return (TYPED[map[id].type] ? 0 : 4) + (c ? 1 + Math.min(0.99, (c.last || 0) / 1e13) : Math.random() * 0.5);
    };
    ids = ids.map(function (id) { return { id: id, r: rank(id) }; }).sort(function (a, b) { return a.r - b.r; });
    return ids.length ? map[ids[0].id] : null;
  }

  function fromCategory(cat, state, used) {
    var B = Bk(), c = B && B.CURE && cat ? B.CURE[cat] : null;
    if (!c) return null;
    var cands = [];
    if (c.tags) cands = cands.concat(B.gapSession(state, 8, c.tags), B.translateSession(state, 4, c.tags));
    if (c.err && B.errorSession) cands = cands.concat(B.errorSession(state, 4, c.err));
    cands = cands.filter(function (x) { return x && !used(x); });
    return cands[0] || null;
  }

  // The title of the lesson block of a rule («r:W:B»), to say which rule.
  function ruleTitle(rule, course) {
    var R = Rg(), p = R && R.parse ? R.parse(rule) : null;
    var w = p && course && course.weeks ? course.weeks[p.week - 1] : null;
    var b = w && w.lesson && w.lesson.blocks ? w.lesson.blocks[p.i] : null;
    return b && b.h ? String(b.h).replace(/\*/g, "") : "";
  }

  /* The new item for this mistake, or null. */
  function offer(it, ctx) {
    ctx = ctx || {};
    if (!it || it.unamas || !ROUNDS[ctx.kind] || !isRule(ctx)) return null;
    var round = ctx.round || null;
    if (round && round.unamas && round.unamas[it.id]) return null;
    var R = Rg(), state = ctx.state || {};
    var rule = R && R.ruleOf ? R.ruleOf(it) : null;
    var cat = ctx.dg && ctx.dg.cat ? ctx.dg.cat : it.cat || null;
    if (!rule && !cat) return null;
    var used = usedOf(it, round), map = ctx.map || null, out = null, src = "";
    if (rule) { out = fromBankRule(rule, state, used); src = "banco"; }
    if (!out && rule) { out = fromCourse(rule, state, used, map); src = "curso"; }
    if (!out && cat) { out = fromCategory(cat, state, used); src = "categoria"; }
    if (!out) return null;
    var copy = {};
    Object.keys(out).forEach(function (k) { copy[k] = out[k]; });
    delete copy.retry;
    copy.unamas = true;
    copy.unamasOf = it.id;
    copy.unamasSrc = src;
    if (rule && src !== "categoria") copy.rule = rule;
    var Er = root.Errores;
    copy.unamasH = (rule && src !== "categoria" ? ruleTitle(rule, ctx.course) : "") ||
      (cat && Er && Er.label ? Er.label(cat) : "");
    return copy;
  }

  /* Next question: the new one, right after the sheet. */
  function take(round, item) {
    if (!round || !item) return false;
    if (!round.unamas) round.unamas = {};
    round.unamas[item.unamasOf] = 1;
    round.items.splice(round.i + 1, 0, item);
    round.unamasN = (round.unamasN || 0) + 1;
    return true;
  }
  function button() {
    return '<button class="tab" id="unamas" title="Un ejercicio nuevo de la misma regla, con otras palabras">✍️ Ahora vos: una más</button>';
  }
  function badge(it) {
    if (!it || !it.unamas) return "";
    return '<div class="badge-new">✍️ Ahora vos: una más</div>' +
      '<div class="muted small">La misma regla' + (it.unamasH ? " (<b>" + esc(it.unamasH) + "</b>)" : "") +
      ", con otras palabras. No quita vidas.</div>";
  }

  var api = { ROUNDS: ROUNDS, isRule: isRule, written: written, sentenceOf: sentenceOf, same: same, offer: offer, take: take,
              button: button, badge: badge, ruleTitle: ruleTitle };
  if (typeof module === "object" && module.exports) module.exports = api;
  root.UnaMas = api;
})(typeof window !== "undefined" ? window : globalThis);
