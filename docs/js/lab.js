/*
 * El laboratorio: ejercicios construidos sobre resultados de la
 * investigación.
 *
 *  Ponte        — transferencia desde el español: reglas de correspondencia
 *                 entre cognados (Ringbom 2007; Otwinowska 2015).  Quien habla
 *                 español ya conoce miles de palabras de la lengua meta:
 *                 alcanza con la regla.
 *  Falsos amigos — la misma transferencia, donde traiciona.
 *  Capire       — input estructurado (VanPatten & Cadierno 1993; VanPatten
 *                 2004): antes de producir una forma, aprender a
 *                 interpretarla.  Cada ítem se resuelve solo mirando la forma,
 *                 no el contexto.
 *
 * Los datos son del paquete de cada idioma (docs/lang/<código>/lab_data.js →
 * window.LAB_DATA: RULES, FALSI, FALSI_WEEK, CAPIRE, ui).  Una regla del
 * Ponte o un set de Capire con `week` se abre en esa semana; sin `week`,
 * desde el principio.  FALSI_WEEK: la semana en que entran los falsos amigos
 * (0 o ausente: desde el principio).
 *
 * Sin dependencias del DOM.
 */
(function (root) {
  "use strict";

  var DATA = root.LAB_DATA || {};
  var RULES = DATA.RULES || [];
  var FALSI = DATA.FALSI || [];
  var FALSI_WEEK = DATA.FALSI_WEEK || 0;
  var CAPIRE = DATA.CAPIRE || [];
  var UI = DATA.ui || {};

  /* -------------------------------------------------------- generadores */

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  var BY_ID = {};

  RULES.forEach(function (r) {
    r.words.forEach(function (w, i) {
      var it = {
        id: "ponte:" + r.id + ":" + i, src: "lab", lab: "ponte", group: r.id, week: r.week,
        type: "cloze",
        prompt: (UI.ponte || "Pasalo") + " (regla " + r.h + ")",
        stem: w[0] + " → ___",
        answer: w[1],
        accept: [w[1]].concat(w[2] || []),
        note: "Regla: **" + r.h + "**"
      };
      BY_ID[it.id] = it;
    });
  });

  FALSI.forEach(function (f, i) {
    var others = FALSI.filter(function (g) { return g !== f; });
    var it = {
      id: "falso:" + i, src: "lab", lab: "falsi", type: "choice",
      prompt: UI.falsi || "¿Qué significa?",
      stem: f[0],
      // Options are rebuilt on every draw (see item()), this is the template.
      answer: f[1], accept: [f[1]], trap: f[2],
      note: f[3],
      pool: others.map(function (g) { return g[1]; })
    };
    BY_ID[it.id] = it;
  });

  CAPIRE.forEach(function (s) {
    s.items.forEach(function (x, i) {
      var it = {
        id: "capire:" + s.id + ":" + i, src: "lab", lab: "capire", group: s.id, week: x[2] || s.week,
        type: "choice", prompt: s.q, stem: x[0],
        options: s.opts.slice(), answer: x[1], accept: [x[1]],
        note: s.h + " — " + s.body.replace(/\*\*/g, "")
      };
      BY_ID[it.id] = it;
    });
  });

  // A fresh copy of an item, ready to play (false friends get new options).
  function item(id) {
    var base = BY_ID[id];
    if (!base) return null;
    var it = {};
    Object.keys(base).forEach(function (k) { it[k] = base[k]; });
    if (base.lab === "falsi") {
      var opts = [base.answer, base.trap];
      shuffle(base.pool).forEach(function (o) {
        if (opts.length < 4 && opts.indexOf(o) < 0) opts.push(o);
      });
      it.options = shuffle(opts);
      delete it.pool;
    }
    if (base.lab === "capire") it.options = base.options.slice();
    return it;
  }

  function card(h, body, ex) {
    return { id: "card:" + h, src: "lab", type: "card", prompt: "La regla", h: h,
             stem: h, body: body, ex: ex || [], answer: "" };
  }

  function ids(prefix) {
    return Object.keys(BY_ID).filter(function (k) { return k.indexOf(prefix) === 0; });
  }

  // The group with the fewest cards already seen goes first.
  function freshestGroup(groups, prefix, cards) {
    var best = null, bestSeen = 1e9;
    groups.forEach(function (g) {
      var seen = ids(prefix + g.id + ":").filter(function (k) { return cards[k]; }).length;
      if (seen < bestSeen) { best = g; bestSeen = seen; }
    });
    return best;
  }

  // The Ponte rules already reached in a given week (all of them without one).
  function ponteOpen(week) {
    return RULES.filter(function (r) { return !week || !r.week || r.week <= week; });
  }

  /* Ponte: la regla, después sus palabras, después dos palabras de reglas
     ya vistas (intercalar: Rohrer & Taylor 2007). */
  function ponteSession(cards, groupId, week) {
    var g = groupId ? RULES.filter(function (r) { return r.id === groupId; })[0]
                    : freshestGroup(ponteOpen(week).length ? ponteOpen(week) : RULES.slice(0, 1), "ponte:", cards);
    var out = [card(g.h, g.body, g.ex)];
    // The words not yet seen first: every session moves the rule forward.
    var all = ids("ponte:" + g.id + ":");
    shuffle(all.filter(function (k) { return !cards[k]; })).concat(shuffle(all.filter(function (k) { return cards[k]; })))
      .slice(0, 8).forEach(function (k) { out.push(item(k)); });
    var otherSeen = ids("ponte:").filter(function (k) {
      return cards[k] && k.indexOf("ponte:" + g.id + ":") !== 0;
    });
    shuffle(otherSeen).slice(0, 2).forEach(function (k) { out.push(item(k)); });
    return out;
  }

  function falsiSession(cards) {
    var all = ids("falso:");
    var unseen = shuffle(all.filter(function (k) { return !cards[k]; }));
    var seen = shuffle(all.filter(function (k) { return cards[k]; }));
    return unseen.concat(seen).slice(0, 10).map(item);
  }

  /* Cada set de Capire lee una forma que el curso enseña en una semana
     dada (el perfeito composto, el futuro do subjuntivo): antes, cerrado. */
  function capireOpen(week) {
    return CAPIRE.filter(function (s) { return !week || !s.week || s.week <= week; });
  }

  function capireSession(cards, groupId, week) {
    var open = capireOpen(week);
    if (!open.length) return [];
    var g = groupId ? CAPIRE.filter(function (s) { return s.id === groupId; })[0]
                    : freshestGroup(open, "capire:", cards);
    var out = [card(g.h, g.body)];
    var pool = ids("capire:" + g.id + ":").filter(function (k) { return !week || !BY_ID[k].week || BY_ID[k].week <= week; });
    // unseen first, then the rest
    shuffle(pool.filter(function (k) { return !cards[k]; })).concat(shuffle(pool.filter(function (k) { return cards[k]; })))
      .slice(0, 10).forEach(function (k) { out.push(item(k)); });
    return out;
  }

  /* Seen of all.  With a week, only what is open by then (a set of Capire
     has sentences of later weeks: counting them left the mission of its
     week impossible to finish, 10 / 12 with 100 %). */
  function progress(prefix, cards, week) {
    var all = ids(prefix).filter(function (k) { return !week || !BY_ID[k].week || BY_ID[k].week <= week; });
    return { total: all.length, seen: all.filter(function (k) { return cards[k]; }).length };
  }

  // One random item for interleaving into the coffee break.
  function randomItem(cards, week) {
    var pool = Object.keys(BY_ID).filter(function (k) {
      if (week && FALSI_WEEK && k.indexOf("falso:") === 0) return week >= FALSI_WEEK || !!cards[k];
      return !week || !BY_ID[k].week || BY_ID[k].week <= week;
    });
    if (!pool.length && RULES.length) pool = ids("ponte:" + RULES[0].id + ":");
    if (!pool.length) return null;                 // a package without a lab yet
    var seen = pool.filter(function (k) { return cards[k]; });
    var src = seen.length >= 6 && Math.random() < 0.5 ? seen : pool;
    var id = src[Math.floor(Math.random() * src.length)];
    // Don't drop a ponte word without its rule on a newcomer: prefer one
    // already seen, or else a false friend (they need no rule), if open.
    if (id.indexOf("ponte:") === 0 && !cards[id]) {
      var falsi = pool.filter(function (k) { return k.indexOf("falso:") === 0; });
      if (seen.length) id = seen[Math.floor(Math.random() * seen.length)];
      else if (falsi.length) id = falsi[Math.floor(Math.random() * falsi.length)];
    }
    return item(id);
  }

  var api = {
    RULES: RULES,
    FALSI: FALSI,
    FALSI_WEEK: FALSI_WEEK,
    CAPIRE: CAPIRE,
    BY_ID: BY_ID,
    item: item,
    ponteSession: ponteSession,
    ponteOpen: ponteOpen,
    falsiSession: falsiSession,
    capireSession: capireSession,
    capireOpen: capireOpen,
    progress: progress,
    randomItem: randomItem
  };

  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Lab = api;
})(typeof window !== "undefined" ? window : globalThis);
