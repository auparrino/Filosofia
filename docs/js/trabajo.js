/*
 * «Para el trabajo» (Per il lavoro / Para o trabalho): una ruta paralela al
 * percorso, desde el A2, con escenas de oficina: presentarse en una
 * reunión, escribir y contestar mails, llamadas y videollamadas, pedir y dar
 * explicaciones, negociar plazos, presentar resultados, quejarse con
 * cortesía (auditorias/PLAN.md, pasos 1.4 y 1.5).
 *
 * Cada escena se engancha a la semana cuya gramática usa (el condicional
 * para pedir, el congiuntivo / subjuntivo para opinar…) y trae:
 *   - un diálogo modelo, con su traducción y las palabras glosadas, que se
 *     escucha línea por línea o entero (una voz por personaje);
 *   - 10-15 frases de uso con su construcción: son frases como las de las
 *     escenas de conversación (Frasi las carga con sus ids «frase:<escena>:<n>»:
 *     mismos ejercicios, mismo repaso), pero viven en esta pantalla;
 *   - ítems de producción (traducir, completar, transformar, corregir), que
 *     van por la ronda de siempre y vuelven al repaso como «trab:<escena>:<n>»;
 *   - una tarea (un mail, un mensaje) con su lista de chequeo, el corrector
 *     de Scrivi y un modelo para comparar.
 *
 *   Trabajo.scenes() / scene(id)     las escenas del idioma (puede no haber)
 *   Trabajo.items(id) / reviewItem(id)   los ítems de producción
 *   Trabajo.session(arg, state, opts)    la ronda: «<escena>:frasi» o «<escena>:prod»
 *   Trabajo.roundDone(state, arg, pct)   el mejor porcentaje de cada parte
 *   Trabajo.review(state, id, texto)     la tarea, con Scrivi.check
 *   Trabajo.missions(w, state)       la misión opcional «💼 …» de la semana
 *   Trabajo.weekButtons / allenaFold la escena de la semana y todas, en Allena
 *   Trabajo.open(id, desde) / render / wire   la pantalla «trabajo»
 *
 * Datos: lang/<código>/trabajo_data.js (window.TRABAJO_DATA: label, blurb y
 * SCENES).  Guarda en state.trabajo = { <escena>: { d, f, p, t, n, hard,
 * paid, k: [puntos marcados], at } } (d: el diálogo escuchado o leído; f y
 * p: el mejor % de las frases y de la producción).
 * Test: tools/lib/test_trabajo.js y tools/it/check_trabajo.py; en el
 * navegador, tools/lib/smoke_trabajo.js.
 */
(function (root) {
  "use strict";

  var H = null;                       // the host (app.js)
  var PASS = 60;                      // the production round counts from here

  function D() { return root.TRABAJO_DATA || { SCENES: [] }; }
  function LG() { return root.LANG || {}; }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function langAttr() { return ' lang="' + (LG().tts || LG().code || "") + '"'; }
  function label() { return D().label || "Para el trabajo"; }

  function scenes() {
    return (D().SCENES || []).filter(function (s) { return s && s.id && s.phrases && s.phrases.length; });
  }
  function scene(id) {
    var list = scenes();
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }
  function ofWeek(week) { return scenes().filter(function (s) { return s.week === +week; }); }
  function firstWeek() { var l = scenes(); return l.length ? Math.min.apply(null, l.map(function (s) { return s.week; })) : 0; }

  /* ------------------------------------------------------------ ítems */

  // The production items of a scene, with their ids and what the round needs.
  function items(id) {
    var s = scene(id);
    if (!s) return [];
    return (s.items || []).map(function (x, i) {
      var it = {};
      Object.keys(x).forEach(function (k) { it[k] = x[k]; });
      it.id = "trab:" + s.id + ":" + i;
      it.src = "trabajo";
      it.scene = s.id;
      it.w = s.week;
      it.level = s.level;
      it.topic = "trabajo";
      var acc = (x.accept || []).slice();
      if (acc.indexOf(x.answer) < 0) acc.unshift(x.answer);
      it.accept = acc;
      return it;
    });
  }
  function reviewItem(id) {
    var m = /^trab:([^:]+):(\d+)$/.exec(String(id || ""));
    if (!m) return null;
    return items(m[1])[+m[2]] || null;
  }

  /* --------------------------------------------------------- guardado */

  function store(state) {
    var s = state || {};
    if (!s.trabajo || typeof s.trabajo !== "object" || Array.isArray(s.trabajo)) s.trabajo = {};
    return s.trabajo;
  }
  function rec(state, id) { return store(state)[id] || null; }
  function recOf(state, id) {
    var t = store(state);
    return t[id] || (t[id] = { d: 0, t: "", n: 0, k: [], at: 0 });
  }
  function phrasesSeen(state, id) {
    var F = root.Frasi;
    return F && F.progress ? F.progress(id, (state && state.cards) || {}) : { seen: 0, total: 0, strong: 0 };
  }
  // Done: the production round passed and the task written to its length.
  function done(state, id) {
    var r = rec(state, id);
    return !!r && (r.p || 0) >= PASS && !!r.paid;
  }
  function started(state, id) {
    var r = rec(state, id);
    return !!r && (r.d || r.f != null || r.p != null || r.n > 0);
  }

  /* --------------------------------------------------------- la ronda */

  function parseArg(arg) {
    var m = /^(.+):(frasi|prod)$/.exec(String(arg || ""));
    return m ? { id: m[1], part: m[2] } : { id: String(arg || ""), part: "prod" };
  }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  /* The round of a scene: its phrases (presented, guessed, then drilled:
     Frasi.sceneSession) or its production items, in another order each time. */
  function session(arg, state, opts) {
    opts = opts || {};
    var a = parseArg(arg), F = root.Frasi;
    if (!scene(a.id)) return [];
    if (a.part === "frasi") return F && F.sceneSession ? F.sceneSession(a.id, (state && state.cards) || {}, { silent: opts.silent }) : [];
    return shuffle(items(a.id));
  }
  function roundDone(state, arg, pct) {
    var a = parseArg(arg);
    if (!scene(a.id)) return;
    var r = recOf(state, a.id), k = a.part === "frasi" ? "f" : "p";
    r[k] = Math.max(r[k] || 0, Math.round(+pct || 0));
    r.at = Date.now();
  }
  function handlesRound(kind) { return kind === "trabajo"; }

  /* ------------------------------------------------------ la tarea */

  function words(text) { return String(text || "").split(/\s+/).filter(function (x) { return /[A-Za-zÀ-ÿ]/.test(x); }).length; }
  /* The task, with the week's checker (Scrivi.check).  The first one that
     reaches the minimum length pays xp of the output strand.
     → {n, findings, hard, xp, first} */
  function review(state, id, text, check) {
    var s = scene(id);
    text = String(text || "").slice(0, 4000);
    var S = root.Scrivi, wk = s ? s.week : 52;
    var chk = check || (S && S.check ? S.check(text, wk) : { findings: [] });
    var findings = (chk && chk.findings) || [], hard = findings.filter(function (x) { return !x.soft; }).length;
    var r = recOf(state, id), nw = words(text), min = s && s.compito ? s.compito.min : 40;
    var first = !r.paid && nw >= min, E = root.Engine, xp = 0;
    if (first) { xp = E && E.xpText ? E.xpText(nw, 0, !hard) : Math.round(nw / 2); r.paid = 1; }
    r.t = text; r.n = nw; r.hard = hard; r.at = Date.now();
    return { n: nw, findings: findings, hard: hard, xp: xp, first: first };
  }
  function togglePoint(state, id, i) {
    var r = recOf(state, id);
    if (!Array.isArray(r.k)) r.k = [];
    r.k[i] = r.k[i] ? 0 : 1;
    return !!r.k[i];
  }

  /* ---------------------------------------------------------- misiones */

  function statusLine(state, id) {
    var r = rec(state, id) || {}, s = scene(id), ps = phrasesSeen(state, id);
    var parts = [ps.seen + " / " + ps.total + " frases"];
    if (r.p != null) parts.push("producción " + r.p + " %");
    if (r.paid) parts.push((s.compito.genre === "mail" ? "mail" : "mensaje") + " escrito");
    return parts.join(" · ");
  }
  function missions(w, state) {
    if (!w) return [];
    return ofWeek(w.week).map(function (s) {
      var ok = done(state, s.id);
      return { kind: "trabajo", arg: s.id, done: ok, half: !ok && started(state, s.id), opt: true, ico: "💼",
        title: esc(label()) + ": " + esc(s.name),
        sub: started(state, s.id) ? (ok ? "Hecha · " : "") + statusLine(state, s.id)
          : "Opcional · " + esc(s.level) + " · diálogo, " + s.phrases.length + " frases, " + (s.items || []).length +
            " ejercicios y " + (s.compito.genre === "mail" ? "un mail" : "un mensaje") + " · " + esc(s.blurb) };
    });
  }
  function handles(kind) { return kind === "trabajo"; }
  function go(kind, arg, from) { open(arg, from || "briefing"); }

  /* ------------------------------------------------------ en «Allena» */

  function button(state, s, isOpen) {
    var ok = done(state, s.id);
    return '<button class="ep' + (ok ? " done" : "") + '" data-trabajo="' + esc(s.id) + '"' + (isOpen ? "" : " disabled") + ">" +
      '<span class="e">' + (isOpen ? s.emoji : "🔒") + "</span><span><b>" + esc(s.name) + "</b>" +
      '<span class="muted">' + "semana " + s.week + " · " + esc(s.level) + " · " +
        (isOpen ? (started(state, s.id) ? statusLine(state, s.id) : esc(s.blurb)) : "se abre en la semana " + s.week) + "</span></span></button>";
  }
  function weekButtons(state, week) {
    return ofWeek(week).map(function (s) { return button(state, s, true); });
  }
  function allenaFold(state, week, seasonNames) {
    var list = scenes(), C = root.Capas;
    if (!list.length) return "";
    var items_ = list.map(function (s) { return { week: s.week, done: done(state, s.id), html: button(state, s, s.week <= week) }; });
    var nDone = list.filter(function (s) { return done(state, s.id); }).length;
    var body = '<p class="muted">' + esc(D().blurb || "") + "</p>" +
      (C ? C.seasons("al:trab", items_, week, seasonNames) : '<div class="eps">' + items_.map(function (x) { return x.html; }).join("") + "</div>");
    var meta = week < firstWeek() ? "🔒 desde la semana " + firstWeek() : nDone + " / " + list.length + " hechas";
    var title = "💼 " + esc(label());
    return C ? C.fold("al:trab", title, meta, body) : "<h2>" + title + "</h2>" + body;
  }

  /* ----------------------------------------------------------- pantalla */

  var cur = null;          // { id, from, es (translation shown), check }
  var saveTimer = null;

  function open(id, from) {
    if (!scene(id) || !H) return;
    var s = scene(id), st = H.state();
    if ((st.unlocked || 1) < s.week) { if (H.toast) H.toast("Se abre en la semana " + s.week + ", con la gramática que usa."); return; }
    cur = { id: id, from: from || "briefing", es: false, check: null };
    H.show("trabajo");
  }
  // Back from a round of the scene: the same screen, where it was left.
  function reopen(arg) {
    var a = parseArg(arg);
    if (!scene(a.id) || !H) return false;
    if (!cur || cur.id !== a.id) cur = { id: a.id, from: "frasi", es: false, check: null };
    H.show("trabajo");
    return true;
  }
  function back() {
    var from = cur ? cur.from : "briefing";
    cur = null;
    if (from === "frasi") H.go("frasi");
    else if (from === "hoy") H.go("oggi");
    else H.toWeek();
  }
  function owns(screen) { return screen === "trabajo"; }

  // One voice per speaker, in the order they first speak.
  function voiceOf(s, who) {
    var seen = [];
    (s.dialogo || []).forEach(function (d) { if (seen.indexOf(d[0]) < 0) seen.push(d[0]); });
    return Math.max(0, seen.indexOf(who));
  }

  function countLine(s, text) {
    var n = words(text), c = s.compito;
    return n + " palabras · " + c.min + "–" + c.max + (n && n < c.min ? " · faltan " + (c.min - n) : n > c.max ? " · te pasaste un poco: está bien" : n ? " ✓" : "");
  }
  function checkHtml(r, text) {
    var S = root.Scrivi, mk = H && H.mk ? H.mk : esc;
    var head = r.findings.length ? "🔎 El corrector marcó " + r.findings.length + (r.findings.length === 1 ? " cosa" : " cosas")
      : "✅ El corrector no marcó nada";
    return '<div class="card"><h3>' + head + " · " + r.n + " palabras</h3>" +
      (r.findings.length && S && S.markup ? '<p class="scrivi-marked"' + langAttr() + ">" + S.markup(text, r.findings, esc) + "</p>" +
        '<ol class="findings small">' + r.findings.slice(0, 10).map(function (f) { return "<li>" + mk(f.msg) + "</li>"; }).join("") + "</ol>" : "") +
      '<p class="muted small">Es el corrector de ' + esc((H && H.ui && H.ui().scrivi) || "Scrivi") + ": marca los errores típicos que conoce, no si el " +
        "mail se entiende ni el tono. Para eso, la lista de arriba y el modelo.</p></div>";
  }

  function render() {
    if (!cur || !scene(cur.id)) return '<button class="btn ghost" id="trback">← volver</button>';
    var st = H.state(), s = scene(cur.id), r = rec(st, s.id) || { k: [], t: "" }, mk = H.mk || esc;
    var ps = phrasesSeen(st, s.id), c = s.compito, lname = (LG().ui || {}).langEs || "la lengua";
    var backTo = cur.from === "frasi" ? "a " + esc((H.ui && H.ui().train) || "Allena") : cur.from === "hoy" ? "a Hoy" : "a la semana";
    if (H.lexicon) H.lexicon();
    var gloss = s.gloss || {}, gk = Object.keys(gloss);
    var html = '<button class="btn ghost" id="trback">← ' + backTo + "</button>" +
      "<h1>" + s.emoji + " " + esc(s.name) + "</h1>" +
      '<p class="lead">' + esc(label()) + " · semana " + s.week + " · " + esc(s.level) + " · " + mk(s.grammar || "") + "</p>" +
      '<div class="card tr-sit"><p>' + esc(s.situazione || s.blurb) + "</p></div>" +

      // 1. the dialogue
      '<div class="card"><h2>1 · El diálogo</h2>' +
      '<div class="row"><button class="btn" id="trplay">▶︎ Escuchar todo</button>' +
        '<button class="tab" id="tres" aria-pressed="' + (cur.es ? "true" : "false") + '">' + (cur.es ? "Ocultar" : "Ver") + " la traducción</button></div>" +
      '<ol class="tr-dlg">' + s.dialogo.map(function (d, i) {
        return '<li><b class="tr-who">' + esc(d[0]) + "</b> " +
          '<button class="chip tr-say" data-trsay="' + i + '" aria-label="Escuchar">🔊</button> ' +
          "<span" + langAttr() + ">" + esc(d[1]) + "</span>" +
          (cur.es ? '<span class="muted tr-es">' + esc(d[2]) + "</span>" : "") + "</li>";
      }).join("") + "</ol>" +
      (gk.length ? '<details class="tr-gloss"><summary>Palabras del diálogo (' + gk.length + ")</summary><ul>" + gk.map(function (k) {
        return "<li><b" + langAttr() + ">" + esc(k) + "</b> — " + esc(gloss[k]) + "</li>";
      }).join("") + "</ul></details>" : "") +
      (r.d ? '<p class="muted small">✓ Diálogo hecho</p>' : '<button class="tab" id="trdlgok">✓ Lo entendí</button>') + "</div>" +

      // 2. the phrases
      '<div class="card"><h2>2 · Las frases <small class="muted">· ' + ps.seen + " / " + ps.total + " vistas</small></h2>" +
      '<p class="muted small">Lo que se dice en esta situación, con cómo está armado. Tocá una para ver la nota.</p>' +
      '<div class="tr-frasi">' + s.phrases.map(function (p, i) {
        return '<details class="tr-f"><summary><span' + langAttr() + ">" + esc(p[0]) + '</span> <span class="muted">' + esc(p[1]) + "</span></summary>" +
          '<div class="note">' + mk(p[2] || "") + ' <button class="chip tr-say" data-trph="' + i + '" aria-label="Escuchar">🔊</button></div></details>';
      }).join("") + "</div>" +
      '<button class="btn wide" id="trfrasi">💬 Practicar las frases' + (r.f != null ? " · tu mejor: " + r.f + " %" : "") + "</button></div>" +

      // 3. production
      '<div class="card"><h2>3 · Ahora vos</h2>' +
      '<p class="muted small">' + (s.items || []).length + " ejercicios para escribir lo de la escena: traducir, completar, pasar al usted, corregir. " +
        "Lo que falles vuelve en el repaso.</p>" +
      '<button class="btn wide" id="trprod">✍️ Escribir' + (r.p != null ? " · tu mejor: " + r.p + " %" : "") + "</button></div>" +

      // 4. the task
      '<div class="card"><h2>4 · ' + (c.genre === "mail" ? "📧 El mail" : "💬 El mensaje") + ": " + "<span" + langAttr() + ">" + esc(c.title || "") + "</span></h2>" +
      "<p>" + mk(c.t) + "</p>" +
      '<p class="muted small">Que tenga (marcalo cuando esté):</p>' +
      '<ul class="tr-punti">' + c.punti.map(function (p, i) {
        var on = r.k && r.k[i];
        return '<li><button class="chip' + (on ? " on" : "") + '" data-trk="' + i + '" aria-pressed="' + (on ? "true" : "false") + '">' + (on ? "✓" : "○") + "</button> " + mk(p) + "</li>";
      }).join("") + "</ul>" +
      '<textarea id="trtext" class="grow scrivi" rows="8" spellcheck="false" autocapitalize="sentences"' + langAttr() +
        ' aria-label="Tu texto, en ' + esc(lname) + '">' + esc(r.t || "") + "</textarea>" +
      '<p class="muted small" id="trcount">' + countLine(s, r.t || "") + "</p>" +
      '<div class="row"><button class="btn" id="trcheck">🔎 Revisar</button></div>' +
      '<div id="trout">' + (cur.check ? checkHtml(cur.check, r.t || "") : "") + "</div>" +
      (r.n || cur.check ? '<details class="tr-model"><summary>Ver un modelo</summary><p' + langAttr() + ">" + esc(c.model) + "</p></details>"
        : '<p class="muted small">El modelo aparece cuando revises tu texto: primero escribilo vos.</p>') + "</div>";
    return html;
  }

  function saveText(text) {
    var st = H.state();
    recOf(st, cur.id).t = String(text || "").slice(0, 4000);
    H.persist();
  }

  function playAll() {
    var s = scene(cur.id), i = 0;
    var next = function () {
      if (!cur || cur.id !== s.id || i >= s.dialogo.length) return;
      var d = s.dialogo[i++];
      var u = H.speak(d[1], true, null, { vi: voiceOf(s, d[0]), keep: i > 1, onend: next });
      if (!u) i = s.dialogo.length;
    };
    if (root.speechSynthesis) root.speechSynthesis.cancel();
    next();
    var st = H.state(), r = recOf(st, s.id);
    if (!r.d) { r.d = 1; H.persist(); }
  }

  function wire(screen) {
    if (typeof document === "undefined") return;
    document.querySelectorAll("[data-trabajo]").forEach(function (b) {
      b.onclick = function () { open(b.getAttribute("data-trabajo"), screen === "frasi" ? "frasi" : "briefing"); };
    });
    if (!owns(screen) || !cur || !scene(cur.id)) return;
    var s = scene(cur.id);
    var on = function (id, fn) { var b = document.getElementById(id); if (b) b.onclick = fn; };
    on("trback", back);
    on("tres", function () { cur.es = !cur.es; H.render(); });
    on("trplay", playAll);
    on("trdlgok", function () { recOf(H.state(), s.id).d = 1; H.persist(); H.render(); });
    document.querySelectorAll("[data-trsay]").forEach(function (b) {
      b.onclick = function () { var d = s.dialogo[+b.getAttribute("data-trsay")]; H.speak(d[1], true, null, { vi: voiceOf(s, d[0]) }); };
    });
    document.querySelectorAll("[data-trph]").forEach(function (b) {
      b.onclick = function (e) { e.preventDefault(); H.speak(s.phrases[+b.getAttribute("data-trph")][0], true); };
    });
    on("trfrasi", function () { H.startRound("trabajo", s.id + ":frasi"); });
    on("trprod", function () { H.startRound("trabajo", s.id + ":prod"); });
    document.querySelectorAll("[data-trk]").forEach(function (b) {
      b.onclick = function () {
        var yes = togglePoint(H.state(), s.id, +b.getAttribute("data-trk"));
        H.persist();
        b.classList.toggle("on", yes);
        b.setAttribute("aria-pressed", yes ? "true" : "false");
        b.textContent = yes ? "✓" : "○";
      };
    });
    var box = document.getElementById("trtext"), cnt = document.getElementById("trcount");
    if (box) {
      box.addEventListener("input", function () {
        if (cnt) cnt.textContent = countLine(s, box.value);
        clearTimeout(saveTimer);
        var text = box.value;
        saveTimer = setTimeout(function () { saveText(text); }, 400);
      });
      box.addEventListener("blur", function () { clearTimeout(saveTimer); saveText(box.value); });
    }
    on("trcheck", function () {
      if (!box) return;
      clearTimeout(saveTimer);
      var text = box.value, st = H.state();
      if (!words(text)) { H.toast("Primero escribí algo."); return; }
      if (H.lexicon) H.lexicon();
      var prev = (rec(st, s.id) || {}).t;
      var r = review(st, s.id, text);
      cur.check = r;
      if (r.xp) { H.gain(r.xp, "output"); H.toast("✍️ " + (s.compito.genre === "mail" ? "Mail" : "Mensaje") + " escrito · +" + r.xp + " xp"); }
      else if (r.n < s.compito.min) H.toast("Para que cuente, " + s.compito.min + " palabras como mínimo.");
      // what the checker marked goes to the error profile, once per text
      if (H.recordFindings && prev !== text) H.recordFindings(r.findings, text);
      H.persist();
      H.render();
      var out = document.getElementById("trout");
      if (out && out.scrollIntoView) out.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
  }

  function attach(host) { H = host; }

  var api = { PASS: PASS, label: label, scenes: scenes, scene: scene, ofWeek: ofWeek, firstWeek: firstWeek,
              items: items, reviewItem: reviewItem, store: store, done: done, started: started,
              session: session, roundDone: roundDone, handlesRound: handlesRound, parseArg: parseArg,
              words: words, review: review, togglePoint: togglePoint, statusLine: statusLine,
              missions: missions, handles: handles, go: go, weekButtons: weekButtons, allenaFold: allenaFold,
              open: open, reopen: reopen, owns: owns, render: render, wire: wire, attach: attach, voiceOf: voiceOf,
              current: function () { return cur; } };
  if (typeof module === "object" && module.exports) module.exports = api;
  root.Trabajo = api;
})(typeof window !== "undefined" ? window : globalThis);
