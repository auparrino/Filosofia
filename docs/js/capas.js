/*
 * Las capas: los módulos ordenados por lo que hacen, no por dónde cupieron.
 *
 *   Input       Leggi / Ler: lecturas de todas las series, escuchas largas,
 *               Ascolto facile, la Biblioteca.  Arriba, lo de esta semana.
 *   Práctica    Allena / Treino: rondas, Lab, Suoni, escritura guiada,
 *               duelos, banco, escenas, Tres lenguas (el duelo).
 *   Producción  Scrivi / Escreva y lo que cuelga de ella (Tres vueltas).
 *   Referencia  «Consultar»: el diccionario propio, Mi gramática, Palabra
 *               por palabra (Desglose), los mapas de preposiciones, las
 *               fórmulas fijas y los contrastes de Tres lenguas.
 *
 * Este módulo tiene tres cosas:
 *
 *  1. Las misiones opcionales que llevan al percorso lo que vivía fuera de
 *     él: «Leé un capítulo» de la Biblioteca desde la semana en que abre el
 *     primer libro (con el capítulo que recomienda la cobertura) y «Tres
 *     vueltas» (Escritura plus) las semanas que tienen consigna de Scrivi.
 *     missions(w, state) / handles(kind) / go(kind, arg), como Tramo.
 *  2. La pantalla «consultar» (render / wire), con el diccionario:
 *     Referencia.lookup (glosa, semana, nivel y frecuencia, forma verbal,
 *     ficha del banco, combinaciones, usos reales ya leídos).
 *  3. El plegado de Leggi y Allena: secciones <details> que recuerdan si
 *     estaban abiertas, y listas por estación con la actual abierta
 *     (fold, seasons), más los minutos de input de la semana (inputWeek).
 *
 * El núcleo no nombra un idioma: lo que cambia viene de LANG.ui y de los
 * módulos del paquete.  La lógica sin DOM se prueba en node
 * (tools/lib/test_capas.js).  app.js le pasa lo que necesita en attach().
 */
(function (root) {
  "use strict";

  var H = null;                 // the host (app.js)
  var SEASON = 13;              // weeks per season (four seasons of 13)
  var MISSION_KINDS = { lib: 1, tre: 1 };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function mk(s) { return esc(s).replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>").replace(/\*([^*]+)\*/g, '<i class="it">$1</i>'); }
  function UI() { return (root.LANG && root.LANG.ui) || {}; }
  function st() { return H && H.state ? H.state() : { unlocked: 1, cards: {} }; }
  function curWeek(s) { return Math.min(Math.max((s || st()).unlocked || 1, 1), 52); }
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
    // (Tres vueltas ya no es misión: queda en la pantalla de la consigna)
    return out;
  }
  function handles(kind) { return !!MISSION_KINDS[kind]; }
  function go(kind, arg) {
    if (!H) return;
    if (kind === "lib") { var a = String(arg || "").split("|"); H.openBook(a[0], a[1] === "" || a[1] == null ? null : +a[1]); }
    else if (kind === "tre") H.tre(+arg);
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

  /* The minutes of input of the last seven days: listening (karaoke, the
     tramo, «Ascolto facile»: state.ascolto), reading timed in the reader
     (Letture.speedMinutes), the library's pages (Biblioteca) and the
     minutes logged out of the app (Fuera, fuera.js). */
  function inputWeek(state, now) {
    state = state || st();
    now = now || Date.now();
    var E = root.Engine, k = E && E.dayKey ? E.dayKey(new Date(now)) : null, sec = 0;
    Object.keys(state.ascolto || {}).forEach(function (kk) {
      if (!k || !E.daysBetween || E.daysBetween(kk, k) < 7) sec += (state.ascolto[kk] || {}).sec || 0;
    });
    var listen = Math.round(sec / 60);
    var timed = root.Letture && root.Letture.speedMinutes ? root.Letture.speedMinutes(state, 7, now) : 0;
    var lib = root.Biblioteca && root.Biblioteca.minutes ? root.Biblioteca.minutes(state, 7) : 0;
    var out = root.Fuera && root.Fuera.minutes ? root.Fuera.minutes(state, 7, new Date(now)) : 0;
    return { listen: listen, read: timed + lib, lib: lib, timed: timed, out: out, total: listen + timed + lib + out };
  }

  /* The curve of the year (Letture.speedCurve) as a small SVG: words per
     minute by week of the course. */
  function curveSvg(points) {
    if (!points || !points.length) return "";
    var W = 320, Hh = 90, pad = 22, max = Math.max.apply(null, points.map(function (p) { return p.wpm; }).concat([60]));
    max = Math.ceil(max / 50) * 50;
    var x = function (w) { return pad + (w - 1) * (W - pad - 8) / 51; };
    var y = function (v) { return Hh - 16 - v * (Hh - 26) / max; };
    var path = points.map(function (p, i) { return (i ? "L" : "M") + x(p.w).toFixed(1) + " " + y(p.wpm).toFixed(1); }).join(" ");
    var dots = points.map(function (p) {
      return '<circle cx="' + x(p.w).toFixed(1) + '" cy="' + y(p.wpm).toFixed(1) + '" r="3"><title>Semana ' + p.w + ": " + p.wpm + " palabras por minuto</title></circle>";
    }).join("");
    return '<svg class="speed-curve" viewBox="0 0 ' + W + " " + Hh + '" role="img" aria-label="Palabras por minuto a lo largo del año">' +
      '<line class="ax" x1="' + pad + '" y1="' + (Hh - 16) + '" x2="' + (W - 8) + '" y2="' + (Hh - 16) + '"/>' +
      '<text x="' + pad + '" y="' + (Hh - 3) + '">1</text><text x="' + x(26) + '" y="' + (Hh - 3) + '" text-anchor="middle">26</text>' +
      '<text x="' + (W - 8) + '" y="' + (Hh - 3) + '" text-anchor="end">52</text>' +
      '<text x="2" y="' + (y(max) + 4) + '">' + max + "</text>" +
      '<path d="' + path + '"/>' + dots + "</svg>";
  }

  /* ============================================================ Consultar */

  var cq = { q: "", word: null, sub: "home", phrase: "" };

  function freqWord(z) {
    return !z ? "" : z >= 5 ? "muy frecuente" : z >= 4 ? "frecuente" : z >= 3 ? "poco frecuente" : "rara";
  }
  var POS = { noun: "sustantivo", verb: "verbo", adj: "adjetivo" };
  var GEN = { m: "masculino", f: "femenino" };

  function wordCard(term) {
    var R = root.Referencia;
    if (!R || !R.lookup) return "";
    var week = curWeek(), x = R.lookup(term, { week: week, max: 5 });
    if (!x.known) return '<div class="card cq-word"><p>No encontré <b>' + esc(term) + "</b> en el curso. Probá con otra forma o en castellano.</p></div>";
    var chips = [];
    if (x.taught) chips.push(x.taught > week ? "🔒 se enseña en la semana " + x.taught : "📘 semana " + x.taught);
    if (x.level) chips.push("nivel " + esc(x.level));
    if (freqWord(x.zipf)) chips.push(freqWord(x.zipf));
    var bk = x.bank, bline = "";
    if (bk) {
      bline = POS[bk.kind] + (bk.kind === "noun" ? " " + (GEN[bk.g] || bk.g || "") + (bk.pl ? ", plural <i class=\"it\">" + esc(bk.pl) + "</i>" : "") :
        bk.kind === "verb" && bk.aux ? ", pasado compuesto con <i class=\"it\">" + esc(bk.aux === "both" ? "avere / essere" : bk.aux) + "</i>" :
        bk.kind === "adj" && bk.forms ? ": <i class=\"it\">" + esc(bk.forms.join(", ")) + "</i>" : "");
    }
    return '<div class="card cq-word" id="cqword"><div class="cq-head"><h2><i class="it">' + esc(x.term) + "</i>" +
        (x.lemma && x.lemma !== x.term ? ' <small class="muted">de <i class="it">' + esc(x.lemma) + "</i></small>" : "") + "</h2>" +
        '<button class="tab" data-csay="' + esc(x.term) + '" aria-label="escuchar">🔊</button></div>' +
      (x.es ? '<p class="cq-es">' + esc(x.es) + "</p>" : "") +
      (chips.length ? '<p class="chips cq-chips">' + chips.map(function (c) { return '<span class="chip">' + c + "</span>"; }).join("") + "</p>" : "") +
      (bline ? '<p class="small">' + bline + "</p>" : "") +
      (bk && bk.note ? '<p class="note">' + mk(bk.note) + "</p>" : "") +
      (x.lines.length ? '<h3>La forma</h3><ul class="cq-lines">' + x.lines.map(function (l) { return "<li>" + mk(l) + "</li>"; }).join("") + "</ul>" : "") +
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
    return html || '<p class="muted">Nada con «' + esc(q) + "». Probá con otra forma, el infinitivo o la palabra en castellano.</p>";
  }

  function desgloseHtml() {
    var De = root.Desglose, t = cq.phrase.trim();
    if (!De || !t) return "";
    var ls = [];
    try { ls = De.lines(t, { gloss: H && H.glossary ? H.glossary() : null, week: curWeek(), max: 14 }) || []; } catch (e) { ls = []; }
    return ls.length ? '<ul class="cq-lines">' + ls.map(function (l) { return "<li>" + mk(l) + "</li>"; }).join("") + "</ul>"
      : '<p class="muted small">No encontré nada que desarmar: pronombres, tiempos compuestos, elisiones o locuciones.</p>';
  }

  function renderHome() {
    var R = root.Referencia, s = st();
    var html = '<button class="btn ghost" id="cback">← Volver</button>' +
      "<h1>📖 Consultar</h1>" +
      '<p class="lead">El diccionario del curso, tu gramática y las herramientas para mirar una frase de cerca. ' +
      "Consultar no cuesta nada: lo que todavía no viste aparece con aviso.</p>" +
      '<div class="card cq-search"><label class="small muted" for="cq">Diccionario</label>' +
      '<input type="search" id="cq" class="ref-q" placeholder="Una palabra, en ' + esc(UI().langEs || "la lengua") + ' o en castellano" value="' + esc(cq.q) + '" autocomplete="off" autocapitalize="off" spellcheck="false">' +
      '<div id="cqres">' + resultsHtml() + "</div></div>";
    if (R && R.entry) html += R.entry();
    html += '<div class="labs cq-tools">' +
      '<button class="lab" data-csub="desglose"><span class="e">🔎</span><b>Palabra por palabra</b><span class="muted">Pegá una frase y te la desarmo: pronombres, tiempos, elisiones, locuciones.</span></button>' +
      (root.Mapas && root.Mapas.data && root.Mapas.data() ? '<button class="lab" data-csub="mapas"><span class="e">🗺️</span><b>Mapas de preposiciones</b><span class="muted">Dónde estás, adónde vas, de dónde venís: en dibujos.</span></button>' : "") +
      (root.Formule && Object.keys(root.Formule.DATA || {}).length ? '<button class="lab" data-csub="formule"><span class="e">🧱</span><b>Fórmulas fijas</b><span class="muted">Las frases que usás enteras antes de su gramática, y cuándo llega la regla.</span></button>' : "") +
      (root.TresLenguas ? '<button class="lab" data-tres="menu"><span class="e">🔀</span><b>Tres lenguas: contrastes</b><span class="muted">Dónde se cruzan las dos lenguas y el español.</span></button>' : "") +
      "</div>" +
      '<p class="muted science">🔬 Consultar una palabra en sus usos reales (concordancias) enseña cómo se combina mejor que la definición sola (Boulton y Cobb 2017); ' +
      "las colocaciones son lo que más delata al hablante no nativo (Nesselhauf 2005).</p>";
    return html;
  }

  function renderSub() {
    var back = '<button class="btn ghost" id="chome">← Consultar</button>', week = curWeek();
    if (cq.sub === "desglose") {
      return back + "<h1>🔎 Palabra por palabra</h1>" +
        '<p class="lead">Una frase de la lengua (de una lectura, de un mensaje, de donde sea): te digo qué es cada pieza que no se ve a simple vista.</p>' +
        '<div class="card"><textarea id="cphrase" class="grow scrivi" rows="3" spellcheck="false" autocapitalize="sentences" placeholder="Pegá o escribí una frase">' + esc(cq.phrase) + "</textarea>" +
        '<div class="row" style="margin-top:8px"><button class="btn" id="cdes">Desarmar</button></div><div id="cdesout">' + desgloseHtml() + "</div></div>";
    }
    if (cq.sub === "mapas") {
      var M = root.Mapas, D = M && M.data ? M.data() : null;
      var ids = D && D.scenes ? Object.keys(D.scenes) : [];
      return back + "<h1>🗺️ Mapas de preposiciones</h1>" +
        (D && D.week > week ? '<p class="note">🔒 Esto llega en la semana ' + D.week + ": te lo adelanto para consultar.</p>"
          : '<p class="lead">Los dibujos de la lección de la semana ' + ((D && D.week) || "") + ": la forma del lugar y el movimiento deciden la preposición.</p>") +
        (ids.length ? M.figure(ids) : '<p class="muted">No hay mapas en este idioma.</p>');
    }
    if (cq.sub === "formule") {
      var F = root.Formule, Fr = root.Frasi, by = {};
      Object.keys((F && F.DATA) || {}).forEach(function (id) {
        var f = Fr && Fr.BY_ID ? Fr.BY_ID[id] : null;
        if (!f) return;
        F.of(f).forEach(function (x) { (by[x[0]] = by[x[0]] || []).push({ f: f, forms: x[1] }); });
      });
      var ws = Object.keys(by).map(Number).sort(function (a, b) { return a - b; });
      return back + "<h1>🧱 Fórmulas fijas</h1>" +
        '<p class="lead">Frases que se aprenden enteras, como un bloque, antes de su gramática. Cuando llega la semana de la regla, la fórmula pasa a ser un caso de la regla.</p>' +
        ws.map(function (w) {
          return '<div class="card"><h3>Gramática de la semana ' + w + (w > week ? ' <small class="muted">· 🔒 todavía no</small>' : ' <small class="muted">· ya la viste</small>') + "</h3>" +
            '<ul class="formule-list">' + by[w].map(function (x) {
              var t = x.f.it || x.f.t || "";
              return '<li><span class="it">' + mk(t) + '</span> <span class="muted small">' + esc(x.f.es || "") + " · la forma: *" + esc(x.forms) + "*</span></li>";
            }).join("").replace(/\*([^*<]+)\*/g, '<i class="it">$1</i>') + "</ul></div>";
        }).join("");
    }
    return renderHome();
  }

  function render(screen) {
    if (screen !== "consultar") return "";
    return cq.sub === "home" ? renderHome() : renderSub();
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
    on("cback", function () { cq.sub = "home"; if (H) H.back(); });
    on("chome", function () { cq.sub = "home"; H.show("consultar"); });
    Array.prototype.forEach.call(doc.querySelectorAll("[data-csub]"), function (b) {
      b.onclick = function () { cq.sub = b.getAttribute("data-csub"); H.show("consultar"); };
    });
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
    on("cdes", function () {
      var ta = doc.getElementById("cphrase");
      cq.phrase = ta ? ta.value : "";
      var out = doc.getElementById("cdesout");
      if (out) out.innerHTML = desgloseHtml();
    });
  }

  // «Consultar» from anywhere (Leggi, Allena, Io): optionally with a word.
  function open(word) {
    cq.sub = "home";
    if (word) { cq.q = word; cq.word = word; }
    if (H) H.show("consultar");
  }

  // The entry card (Allena, Leggi, Io).
  function entryHtml(compact) {
    if (compact) return '<button class="btn ghost cq-entry" data-consultar="">📖 Consultar: diccionario y gramática</button>';
    return '<button class="card cq-card" data-consultar=""><span class="e">📖</span><span><b>Consultar</b>' +
      '<span class="muted">Diccionario del curso, Mi gramática, Palabra por palabra, mapas, fórmulas y contrastes.</span></span><span class="go">›</span></button>';
  }

  function attach(host) {
    H = host;
    if (attach.done || !root.document) return;
    attach.done = true;
    root.document.addEventListener("toggle", onToggle, true);
  }

  var api = { attach: attach, missions: missions, handles: handles, go: go, fold: fold, seasons: seasons, seasonOf: seasonOf,
              inputWeek: inputWeek, curveSvg: curveSvg, render: render, owns: owns, wire: wire, open: open,
              openConsultar: function () { open(""); }, entryHtml: entryHtml, wordCard: wordCard,
              _cq: cq, _opened: opened };
  if (typeof module === "object" && module.exports) module.exports = api;
  root.Capas = api;
})(typeof window !== "undefined" ? window : globalThis);
