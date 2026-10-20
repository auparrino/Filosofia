/*
 * Las capas: los módulos ordenados por lo que hacen, no por dónde cupieron.
 *
 *   Input       Leggi / Ler: la Biblioteca.  Arriba, lo de esta semana.
 *   Práctica    Allena / Treino: duelos y escritura guiada.
 *   Referencia  «Consultar»: el diccionario de los conceptos y Mi gramática.
 *
 * Este módulo tiene tres cosas:
 *
 *  1. La misión opcional que lleva al percorso lo que vivía fuera de él:
 *     «Leé un capítulo» de la Biblioteca desde la semana en que abre el
 *     primer libro (con el capítulo que recomienda la cobertura).
 *     missions(w, state) / handles(kind) / go(kind, arg).
 *  2. La pantalla «consultar» (render / wire), con el diccionario:
 *     Referencia.lookup (qué significa, la semana, las combinaciones, usos
 *     reales ya leídos).
 *  3. El plegado de Leggi y Allena: secciones <details> que recuerdan si
 *     estaban abiertas, y listas por estación con la actual abierta
 *     (fold, seasons), más los minutos de lectura de la semana (inputWeek).
 *
 * El núcleo no nombra una edición: lo que cambia viene de LANG.ui.  app.js
 * le pasa lo que necesita en attach().
 */
(function (root) {
  "use strict";

  var H = null;                 // the host (app.js)
  var SEASON = 13;              // weeks per season (four seasons of 13)
  var MISSION_KINDS = { lib: 1 };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function mk(s) { return esc(s).replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>").replace(/\*([^*]+)\*/g, '<i class="it">$1</i>'); }
  function st() { return H && H.state ? H.state() : { unlocked: 1, cards: {} }; }
  function curWeek(s) { return Math.min(Math.max((s || st()).unlocked || 1, 1), root.Engine.weeks()); }
  function seasonOf(w) { return Math.min(4, Math.max(1, Math.ceil((+w || 1) / SEASON))); }

  /* ======================================================== las misiones */

  function missions(w, state) {
    if (!w || w.boss) return [];
    var out = [];
    var B = root.Biblioteca;
    if (B && B.mission) {
      if (B.loaded && !B.loaded() && B.loadIndex && !missions.asked && typeof root.fetch === "function") {
        // the index comes on demand (it is not precached): ask once, redraw
        missions.asked = true;
        B.loadIndex().then(function () { if (H && H.refresh) H.refresh(); }).catch(function () { missions.asked = false; });
      }
      var lm = B.loaded && B.loaded() ? B.mission(B.index(), w, state) : null;
      if (lm) out.push(lm);
    }
    return out;
  }
  function handles(kind) { return !!MISSION_KINDS[kind]; }
  function go(kind, arg) {
    if (!H) return;
    if (kind === "lib") { var a = String(arg || "").split("|"); H.openBook(a[0], a[1] === "" || a[1] == null ? null : +a[1]); }
  }

  /* ============================================================ el plegado */

  var opened = {};          // key → true/false (what the learner opened or closed)

  /* A section: <details> with its title and a line of meta; open when the
     learner left it open, else by default. */
  function fold(key, title, meta, body, open, cls) {
    var isOpen = opened[key] != null ? opened[key] : !!open;
    return '<details class="capa' + (cls ? " " + cls : "") + '" data-capa="' + esc(key) + '"' + (isOpen ? " open" : "") + ">" +
      '<summary><span class="capa-t">' + title + "</span>" + (meta ? '<span class="capa-m">' + meta + "</span>" : "") + "</summary>" +
      '<div class="capa-b">' + body + "</div></details>";
  }

  /* A list by season: items [{week, html}] in groups of 13 weeks, the
     current season open, the ones to come folded with their week. */
  function seasons(key, items, cur, names) {
    var by = {};
    items.forEach(function (x) { (by[seasonOf(x.week)] = by[seasonOf(x.week)] || []).push(x); });
    var now = seasonOf(cur), ks = Object.keys(by).map(Number).sort(function (a, b) { return a - b; });
    if (ks.length === 1) return '<div class="eps">' + by[ks[0]].map(function (x) { return x.html; }).join("") + "</div>";
    return ks.map(function (n) {
      var list = by[n], done = list.filter(function (x) { return x.done; }).length;
      var from = (n - 1) * SEASON + 1, to = n * SEASON;
      var nm = names && names[n - 1] ? names[n - 1] : "Estación " + n;
      var meta = n > now ? "🔒 desde la semana " + from : done + " / " + list.length;
      return fold(key + ":" + n, esc(nm) + ' <small class="muted">· semanas ' + from + "–" + to + "</small>", meta,
        '<div class="eps">' + list.map(function (x) { return x.html; }).join("") + "</div>", n === now, "capa-sub");
    }).join("");
  }

  function onToggle(e) {
    var d = e.target;
    if (!d || !d.classList || !d.classList.contains("capa")) return;
    opened[d.getAttribute("data-capa")] = d.open;
  }

  /* ======================================================== input semanal */

  /* The minutes of reading of the last seven days: the library's pages
     (Biblioteca). */
  function inputWeek(state) {
    state = state || st();
    var lib = root.Biblioteca && root.Biblioteca.minutes ? root.Biblioteca.minutes(state, 7) : 0;
    return { read: lib, lib: lib, total: lib };
  }

  /* ============================================================ Consultar */

  var cq = { q: "", word: null };

  function wordCard(term) {
    var R = root.Referencia;
    if (!R || !R.lookup) return "";
    var week = curWeek(), x = R.lookup(term, { week: week, max: 5 });
    if (!x.known) return '<div class="card cq-word"><p>No encontré <b>' + esc(term) + "</b> en el curso. Probá con otra forma o en castellano.</p></div>";
    var chips = [];
    if (x.taught) chips.push(x.taught > week ? "🔒 se enseña en la semana " + x.taught : "📘 semana " + x.taught);
    return '<div class="card cq-word" id="cqword"><div class="cq-head"><h2><i class="it">' + esc(x.term) + "</i>" +
        (x.lemma && x.lemma !== x.term ? ' <small class="muted">de <i class="it">' + esc(x.lemma) + "</i></small>" : "") + "</h2>" +
        '<button class="tab" data-csay="' + esc(x.term) + '" aria-label="escuchar">🔊</button></div>' +
      (x.es ? '<p class="cq-es">' + esc(x.es) + "</p>" : "") +
      (chips.length ? '<p class="chips cq-chips">' + chips.map(function (c) { return '<span class="chip">' + c + "</span>"; }).join("") + "</p>" : "") +
      (x.colloc.length ? '<h3>Combinaciones</h3><ul class="cq-coll">' + x.colloc.map(function (c) {
        return "<li><b class=\"it\">" + esc(c.r) + "</b>" + (c.l ? ' <span class="muted">' + esc(c.l) + "</span>" : "") +
          (c.w > week ? ' <small class="muted">· semana ' + c.w + "</small>" : "") + "</li>";
      }).join("") + "</ul>" : "") +
      (x.hits.length ? "<h3>Usos reales, en lo que ya leíste</h3>" + R.hitsHtml(x.hits) +
        '<div class="row"><button class="btn ghost" data-ref="' + esc(x.term) + '">Más usos y un ejercicio →</button></div>'
        : '<p class="muted small">Todavía no aparece en lo que ya podés leer' + (x.later ? ": la vas a ver en la semana " + x.later : "") + ".</p>") +
      "</div>";
  }

  function resultsHtml() {
    var R = root.Referencia, q = cq.q.trim();
    if (!R || !R.suggest) return "";
    if (R.ready) R.ready();
    if (cq.word) return wordCard(cq.word);
    if (q.length < 2) return "";
    var list = R.suggest(q, 8), week = curWeek();
    var blocks = R.search ? R.search(R.blocks(), q).slice(0, 4) : [];
    var html = "";
    if (list.length) html += '<div class="cq-sug">' + list.map(function (s) {
      return '<button class="ep cq-pick" data-cword="' + esc(s.lemma) + '"><span><b class="it">' + esc(s.lemma) + "</b>" +
        '<span class="muted">' + esc(s.es) + (s.week > week ? " · 🔒 semana " + s.week : "") + "</span></span></button>";
    }).join("") + "</div>";
    if (blocks.length) html += '<h3 class="cq-h3">En Mi gramática</h3><div class="cq-sug">' + blocks.map(function (b) {
      return '<button class="ep" data-ref-gram="' + b.id + '"><span><b>' + mk(b.h || "") + "</b>" +
        '<span class="muted">semana ' + b.week + (b.week > week ? " · 🔒 todavía no" : "") + "</span></span></button>";
    }).join("") + "</div>";
    return html || '<p class="muted">Nada con «' + esc(q) + "». Probá con otra palabra.</p>";
  }

  function renderHome() {
    var R = root.Referencia;
    var html = '<button class="btn ghost" id="cback">← Volver</button>' +
      "<h1>📖 Consultar</h1>" +
      '<p class="lead">El diccionario de los conceptos del curso y tu gramática. ' +
      "Consultar no cuesta nada: lo que todavía no viste aparece con aviso.</p>" +
      '<div class="card cq-search"><label class="small muted" for="cq">Diccionario</label>' +
      '<input type="search" id="cq" class="ref-q" placeholder="Un concepto o lo que significa" value="' + esc(cq.q) + '" autocomplete="off" autocapitalize="off" spellcheck="false">' +
      '<div id="cqres">' + resultsHtml() + "</div></div>";
    if (R && R.entry) html += R.entry();
    html += '<p class="muted science">🔬 Mirar un concepto en sus usos reales (concordancias) enseña cómo se usa mejor que la definición sola (Boulton y Cobb 2017).</p>';
    return html;
  }

  function render(screen) {
    if (screen !== "consultar") return "";
    return renderHome();
  }
  function owns(screen) { return screen === "consultar"; }

  function refreshResults() {
    var el = root.document && root.document.getElementById("cqres");
    if (el) el.innerHTML = resultsHtml();
  }

  function wire(screen) {
    var doc = root.document;
    if (!doc) return;
    // the entries to «Consultar» from Leggi, Allena (and Io)
    Array.prototype.forEach.call(doc.querySelectorAll("[data-consultar]"), function (b) {
      b.onclick = function () { open(b.getAttribute("data-consultar") || ""); };
    });
    if (screen !== "consultar") return;
    var on = function (id, fn) { var e = doc.getElementById(id); if (e) e.onclick = fn; };
    on("cback", function () { if (H) H.back(); });
    var box = doc.getElementById("cq");
    if (box) {
      var t = null;
      box.addEventListener("input", function () {
        cq.q = box.value; cq.word = null;
        clearTimeout(t);
        t = setTimeout(refreshResults, 140);
      });
      box.addEventListener("keydown", function (e) {
        if (e.key !== "Enter") return;
        e.preventDefault();
        var R = root.Referencia, first = R && R.suggest ? R.suggest(box.value, 1)[0] : null;
        cq.word = first ? first.lemma : box.value.trim();
        refreshResults();
      });
    }
    var res = doc.getElementById("cqres");
    if (res) res.onclick = function (e) {
      var b = e.target && e.target.closest ? e.target.closest("[data-cword],[data-csay]") : null;
      if (!b) return;
      if (b.hasAttribute("data-csay")) { if (H && H.speak) H.speak(b.getAttribute("data-csay"), true); return; }
      cq.word = b.getAttribute("data-cword");
      refreshResults();
      var w = doc.getElementById("cqword");
      if (w && w.scrollIntoView) w.scrollIntoView({ block: "nearest" });
    };
  }

  // «Consultar» from anywhere (Leggi, Allena, Io): optionally with a word.
  function open(word) {
    if (word) { cq.q = word; cq.word = word; }
    if (H) H.show("consultar");
  }

  // The entry card (Allena, Leggi, Io).
  function entryHtml(compact) {
    if (compact) return '<button class="btn ghost cq-entry" data-consultar="">📖 Consultar: diccionario y gramática</button>';
    return '<button class="card cq-card" data-consultar=""><span class="e">📖</span><span><b>Consultar</b>' +
      '<span class="muted">El diccionario del curso y todas las ideas de las lecciones.</span></span><span class="go">›</span></button>';
  }

  function attach(host) {
    H = host;
    if (attach.done || !root.document) return;
    attach.done = true;
    root.document.addEventListener("toggle", onToggle, true);
  }

  var api = { attach: attach, missions: missions, handles: handles, go: go, fold: fold, seasons: seasons, seasonOf: seasonOf,
              inputWeek: inputWeek, render: render, owns: owns, wire: wire, open: open,
              openConsultar: function () { open(""); }, entryHtml: entryHtml, wordCard: wordCard,
              _cq: cq, _opened: opened };
  if (typeof module === "object" && module.exports) module.exports = api;
  root.Capas = api;
})(typeof window !== "undefined" ? window : globalThis);
