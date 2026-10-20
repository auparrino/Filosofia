/*
 * Duelos: dos formas que compiten, mezcladas en la misma sesión.
 *
 * Intercalar funciona cuando las categorías se parecen entre sí (Brunmair &
 * Richter 2019, g = 0,42, y más cuanto más parecidas); pedir que expliques
 * por qué suma (Bisra et al. 2018, g = 0,55).  Cada oración trae la pista
 * que decide («cue», un pedazo de la oración): después de elegir la forma,
 * «¿qué te lo dijo?».  Cada duelo se abre cuando las dos formas ya se
 * enseñaron («week»).
 *
 * Los duelos son del paquete de cada idioma (docs/lang/<código>/
 * duelli_data.js → window.DUELLI_DATA.DUELLI).  Cada oración: s, con ___;
 * a, la forma correcta; b, la que compite; cue, lo que decide (un pedazo de
 * la oración); why, la regla en una línea; k, el lado del duelo (0 = la
 * primera forma del título, 1 = la segunda).
 */
(function (root) {
  "use strict";

  var DUELLI = (root.DUELLI_DATA && root.DUELLI_DATA.DUELLI) || [];

  function shuffle(a, rnd) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor((rnd || Math.random)() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function byId(id) { for (var i = 0; i < DUELLI.length; i++) if (DUELLI[i].id === id) return DUELLI[i]; return null; }
  function open(week) { return DUELLI.filter(function (d) { return d.week <= (week || 1); }); }
  function filled(x) { return x.s.replace("___", x.a); }

  // The form to choose: the two options, the rule as the note.
  function item(d, k) {
    var x = d.items[k];
    return { id: "duel:" + d.id + ":" + k, src: "duello", type: "choice", topic: "duello",
             prompt: "Duelo · " + d.title, stem: x.s, options: shuffle([x.a, x.b]),
             answer: x.a, accept: [x.a], note: x.why, duel: d.id };
  }
  // «¿Qué te lo dijo?»: the cue among two other pieces of the sentence.
  function cueItem(d, k, rnd) {
    var x = d.items[k], full = filled(x), cue = x.cue.toLowerCase();
    var ans = x.a.toLowerCase().split(" ");
    var toks = full.replace(/[.,;:!?]/g, "").split(/\s+/).filter(function (t) {
      var l = t.toLowerCase();
      return l.length >= 3 && cue.split(" ").indexOf(l) < 0 && ans.indexOf(l) < 0 && cue.indexOf(l) < 0;
    });
    var others = shuffle(toks, rnd).filter(function (t, i, a) { return a.indexOf(t) === i; }).slice(0, 2);
    if (others.length < 2) return null;
    return { id: "duel:" + d.id + ":" + k + ":cue", src: "duello", type: "choice", topic: "duello", nocard: true, cue: true,
             prompt: "¿Qué te lo dijo? Tocá la pista", stem: full, options: shuffle([x.cue].concat(others), rnd),
             answer: x.cue, accept: [x.cue], note: x.why, duel: d.id };
  }
  // Which of the two forms an item asks for (0 or 1), so that a session
  // brings both in the same measure.
  function side(d, x) {
    return x && x.k ? 1 : 0;
  }

  // A session: eight sentences, four of each side, each one followed by its
  // cue; what was failed and what is due come first.
  function session(id, cards, rnd) {
    var d = byId(id);
    if (!d) return [];
    cards = cards || {};
    var now = Date.now();
    var rank = function (k) {
      var c = cards["duel:" + d.id + ":" + k];
      return (!c ? 1 : c.due <= now ? 0 : 2) + (rnd || Math.random)();
    };
    var even = [], odd = [];
    d.items.forEach(function (x, k) { (side(d, x) === 0 ? even : odd).push(k); });
    var pick = function (l) { return l.map(function (k) { return { k: k, r: rank(k) }; }).sort(function (a, b) { return a.r - b.r; }).slice(0, 4).map(function (o) { return o.k; }); };
    var ks = shuffle(pick(even).concat(pick(odd)), rnd), out = [];
    ks.forEach(function (k) {
      out.push(item(d, k));
      var c = cueItem(d, k, rnd);
      if (c) out.push(c);
    });
    return out;
  }
  // A single sentence for the review queue (no cue: that is for the session).
  function reviewItem(id) {
    var m = /^duel:([^:]+):(\d+)$/.exec(id || "");
    var d = m && byId(m[1]);
    return d && d.items[+m[2]] ? item(d, +m[2]) : null;
  }

  var api = { DUELLI: DUELLI, side: side, byId: byId, open: open, item: item, cueItem: cueItem, session: session, reviewItem: reviewItem, filled: filled };
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Duelli = api;
})(typeof window !== "undefined" ? window : globalThis);
