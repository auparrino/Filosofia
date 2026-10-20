/*
 * «Fuera de la app» (Fuori dalla app / Fora do app): una misión opcional
 * por semana, de la 6 a la 52, con una ficha de escucha o lectura guiada de
 * material auténtico de afuera, elegido por nivel (PROPUESTAS 9; auditoría
 * 3.0, eje 3; D5.5 del italiano, P5 del portugués).
 *
 * La ficha tiene: para qué sirve, el enlace (solo el enlace: la app no
 * reproduce nada, se abre en otra pestaña) y qué buscar si el enlace dejó
 * de andar, 6-8 palabras que van a aparecer con su glosa, tres preguntas de
 * autocontrol (en castellano hasta la 13, en la lengua meta desde la 14) y
 * un «después, contalo en 40-60 palabras» que se escribe acá, con el
 * corrector de Scrivi y sin consigna obligatoria.
 *
 * Los minutos se anotan con un toque (5, 10, 20, 30) y cuentan como input:
 * van al reloj de estudio (Progreso.addTime, cuerda input: la meta del día
 * y las horas por destreza), a los minutos de input de la semana
 * (Progreso.inputWeek y Capas.inputWeek los suman) y dan xp de la cuerda
 * input (uno por minuto, 30 por día como mucho, como la escucha).  Un día
 * anota 120 minutos como mucho; el último toque del día se puede deshacer.
 * En el plan del día (js/plan.js), «fuera» es un bloque de input opcional.
 *
 *   Fuera.missions(w, state)      la misión «📺 …» de la semana (weekPlan),
 *                                 opcional; hecha cuando se anotan minutos
 *   Fuera.log(state, semana, min) / undo(state, semana)
 *   Fuera.minutes(state, días)    minutos anotados en los últimos días
 *   Fuera.review(state, semana, texto)   el «contalo», con Scrivi.check
 *   Fuera.weekButtons / leggiFold la ficha de la semana y todas, en Leggi
 *   Fuera.open(semana, desde) / render / wire   la pantalla «fuera»
 *
 * Datos: lang/<código>/fuera_data.js (window.FUERA_DATA: las fuentes y una
 * ficha por semana).  Guarda en state.fuera = { w: {semana: {min, taps,
 * q, t, n, hard, at}}, d: {"aaaa-m-d": [minutos, xp]} }.
 * Test: tools/lib/test_fuera.js; en el navegador, tools/lib/smoke_fuera.js.
 */
(function (root) {
  "use strict";

  var H = null;                       // the host (app.js)
  var TAPS = [5, 10, 20, 30];         // the minutes of one tap
  var DAY_MAX = 120;                  // minutes a day at most
  var XP_DAY = 30;                    // xp a day at most (as listening)
  var TELL = [40, 60];                // «contalo»: words
  var KIND = { escucha: "🎧", video: "📺", lectura: "📰", cancion: "🎵" };
  var KIND_ES = { escucha: "escucha", video: "video", lectura: "lectura", cancion: "canción" };

  function D() { return root.FUERA_DATA || { FICHAS: [], FUENTES: {} }; }
  function LG() { return root.LANG || {}; }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function langAttr() { return ' lang="' + (LG().tts || LG().code || "") + '"'; }
  function label() { return D().label || "Fuera de la app"; }
  function metaFrom() { return D().metaFrom || 14; }

  function fichas() { return D().FICHAS || []; }
  function ficha(n) {
    var list = fichas();
    for (var i = 0; i < list.length; i++) if (list[i].week === +n) return list[i];
    return null;
  }
  function weeks() { return fichas().map(function (f) { return f.week; }); }
  function fuente(f) { return (D().FUENTES || {})[f && f.fuente] || {}; }
  // The questions in the target language from metaFrom on.
  function qlang(n) { return +n >= metaFrom() ? (LG().code || "") : "es"; }

  /* ------------------------------------------------------------ fechas */

  function dayKey(d) { d = d || new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); }
  function daysBetween(a, b) {
    var p = function (k) { var x = String(k).split("-"); return Date.UTC(+x[0], +x[1] - 1, +x[2]); };
    return Math.round((p(b) - p(a)) / 864e5);
  }

  /* ------------------------------------------------------------ guardado */

  function store(state) {
    var s = state || {};
    if (!s.fuera || typeof s.fuera !== "object" || Array.isArray(s.fuera)) s.fuera = {};
    if (!s.fuera.w || typeof s.fuera.w !== "object") s.fuera.w = {};
    if (!s.fuera.d || typeof s.fuera.d !== "object") s.fuera.d = {};
    return s.fuera;
  }
  function rec(state, n) { return store(state).w[n] || null; }
  function recOf(state, n) {
    var w = store(state).w;
    return w[n] || (w[n] = { min: 0, taps: [], q: [], t: "", n: 0, hard: 0, at: 0 });
  }

  /* Minutes of one tap: to the week's card, to the day, to the study clock
     (input) and a little xp of the input strand.  → {min, xp} added. */
  function log(state, n, min, now) {
    min = +min;
    if (TAPS.indexOf(min) < 0 || !ficha(n)) return { min: 0, xp: 0 };
    now = now || new Date();
    var f = store(state), k = dayKey(now), d = f.d[k] || (f.d[k] = [0, 0]);
    var add = Math.max(0, Math.min(min, DAY_MAX - d[0]));
    if (!add) return { min: 0, xp: 0 };
    var r = recOf(state, n);
    r.min += add;
    r.taps.push([k, add]);
    if (r.taps.length > 30) r.taps = r.taps.slice(-30);
    r.at = now.getTime();
    d[0] += add;
    var xp = Math.max(0, Math.min(add, XP_DAY - d[1]));
    d[1] += xp;
    if (root.Progreso && root.Progreso.addTime) root.Progreso.addTime(state, "input", add * 60, now);
    // the days older than 120 go (as state.tiempo)
    Object.keys(f.d).forEach(function (kk) { if (daysBetween(kk, k) > 120) delete f.d[kk]; });
    return { min: add, xp: xp };
  }
  // The last tap of today, undone (the xp stays counted for the day).
  function undo(state, n, now) {
    now = now || new Date();
    var r = rec(state, n), k = dayKey(now);
    if (!r || !r.taps.length || r.taps[r.taps.length - 1][0] !== k) return 0;
    var min = r.taps.pop()[1], f = store(state), d = f.d[k];
    r.min = Math.max(0, r.min - min);
    if (d) d[0] = Math.max(0, d[0] - min);
    var t = state.tiempo && state.tiempo[k], i = root.Progreso && root.Progreso.STRANDS ? root.Progreso.STRANDS.indexOf("input") : 0;
    if (Array.isArray(t)) t[i] = Math.max(0, (t[i] || 0) - min * 60);
    return min;
  }
  function canUndo(state, n, now) {
    var r = rec(state, n);
    return !!(r && r.taps.length && r.taps[r.taps.length - 1][0] === dayKey(now || new Date()));
  }
  // Minutes logged in the last `days` days (7: the week of Leggi).
  function minutes(state, days, now) {
    var d = ((state && state.fuera) || {}).d || {}, k = dayKey(now || new Date()), sum = 0;
    Object.keys(d).forEach(function (kk) { if (daysBetween(kk, k) < (days || 7)) sum += (d[kk] || [])[0] || 0; });
    return sum;
  }
  function total(state) {
    var w = ((state && state.fuera) || {}).w || {}, sum = 0;
    Object.keys(w).forEach(function (k) { sum += (w[k] || {}).min || 0; });
    return sum;
  }
  function toggleQ(state, n, i) {
    var r = recOf(state, n);
    r.q[i] = r.q[i] ? 0 : 1;
    return !!r.q[i];
  }
  function done(r) { return !!r && r.min > 0; }

  /* ------------------------------------------------------ «contalo» */

  function words(text) { return String(text || "").split(/\s+/).filter(function (x) { return /[A-Za-zÀ-ÿ]/.test(x); }).length; }
  /* The text after the listening, with the week's checker (Scrivi.check),
     no structures required.  Kept in the card; the first one of 40 words
     or more pays xp of the output strand.  → {n, findings, hard, xp} */
  function review(state, n, text, check) {
    text = String(text || "").slice(0, 3000);
    var S = root.Scrivi, chk = check || (S && S.check ? S.check(text, Math.min(52, +n || 52)) : { findings: [] });
    var findings = (chk && chk.findings) || [], hard = findings.filter(function (x) { return !x.soft; }).length;
    var r = recOf(state, n), nw = words(text), first = !r.paid && nw >= TELL[0];
    var E = root.Engine, xp = 0;
    if (first) { xp = E && E.xpText ? E.xpText(nw, 0, !hard) : Math.round(nw / 2); r.paid = 1; }
    r.t = text; r.n = nw; r.hard = hard; r.at = Date.now();
    return { n: nw, findings: findings, hard: hard, xp: xp, first: first };
  }

  /* ---------------------------------------------------------- misiones */

  function missions(w, state) {
    if (!w) return [];
    var f = ficha(w.week);
    if (!f) return [];
    var r = rec(state, w.week), ok = done(r), src = fuente(f);
    return [{ kind: "fuera", arg: String(w.week), done: ok, opt: true, ico: KIND[f.kind] || "📺",
      title: esc(label()) + ": " + esc(f.title),
      sub: ok ? "Hecha · " + r.min + " min anotados" + (r.n ? " · lo contaste en " + r.n + " palabras" : "")
        : "Opcional · " + (KIND_ES[f.kind] || "") + " en " + esc(src.name || "") + " · unos " + f.min + " minutos · anotalos: cuentan como input" }];
  }
  function handles(kind) { return kind === "fuera"; }
  function go(kind, arg, from) { open(+arg, from || "briefing"); }

  /* ------------------------------------------------------ en «Leggi» */

  function button(state, f, open_) {
    var r = rec(state, f.week), src = fuente(f);
    return '<button class="ep' + (done(r) ? " done" : "") + '" data-fuera="' + f.week + '"' + (open_ ? "" : " disabled") + ">" +
      '<span class="e">' + (open_ ? KIND[f.kind] || "📺" : "🔒") + "</span><span><b>" + esc(f.title) + "</b>" +
      '<span class="muted">' + esc(label()) + " · semana " + f.week + " · " + esc(f.level) + " · " +
        (open_ ? esc(src.name || "") : "se abre en la semana " + f.week) + "</span></span>" +
      (done(r) ? '<span class="score">' + r.min + "′</span>" : "") + "</button>";
  }
  function weekButtons(state, week) {
    var f = ficha(week);
    return f ? [button(state, f, true)] : [];
  }
  function leggiFold(state, week, seasonNames) {
    var list = fichas(), C = root.Capas;
    if (!list.length) return "";
    var items = list.map(function (f) { return { week: f.week, done: done(rec(state, f.week)), html: button(state, f, f.week <= week) }; });
    var tot = total(state);
    var body = '<p class="muted">' + esc(D().blurb || "") + "</p>" +
      (C ? C.seasons("lg:fuera", items, week, seasonNames) : '<div class="eps">' + items.map(function (x) { return x.html; }).join("") + "</div>");
    var meta = week < list[0].week ? "🔒 desde la semana " + list[0].week : tot ? tot + " min en total" : "opcional";
    var title = "📺 " + esc(label());
    return C ? C.fold("lg:fuera", title, meta, body) : "<h2>" + title + "</h2>" + body;
  }

  /* ----------------------------------------------------------- pantalla */

  var cur = null;          // { week, from, check }
  var saveTimer = null;

  function open(n, from) {
    if (!ficha(n) || !H) return;
    cur = { week: +n, from: from || "briefing", check: null };
    H.show("fuera");
  }
  function back() {
    var from = cur ? cur.from : "briefing";
    cur = null;
    if (from === "leggi") H.go("leggi");
    else if (from === "hoy") H.go("oggi");
    else H.toWeek();
  }
  function owns(screen) { return screen === "fuera"; }

  function minutesLine(state, n) {
    var r = rec(state, n), wk = minutes(state, 7);
    return (r && r.min ? "Anotaste <b>" + r.min + " min</b> con esta ficha" : "Todavía no anotaste minutos con esta ficha") +
      " · fuera de la app, en 7 días: <b>" + wk + " min</b>";
  }
  function countLine(text) {
    var n = words(text);
    return n + " palabras · " + TELL[0] + "–" + TELL[1] + (n && n < TELL[0] ? " · faltan " + (TELL[0] - n) : n > TELL[1] ? " · te pasaste un poco: está bien" : n ? " ✓" : "");
  }
  function checkHtml(r, text) {
    var S = root.Scrivi, mk = H && H.mk ? H.mk : esc;
    var head = r.findings.length ? "🔎 El corrector marcó " + r.findings.length + (r.findings.length === 1 ? " cosa" : " cosas")
      : "✅ El corrector no marcó nada";
    return '<div class="card"><h3>' + head + " · " + r.n + " palabras</h3>" +
      (r.findings.length && S && S.markup ? '<p class="scrivi-marked"' + langAttr() + ">" + S.markup(text, r.findings, esc) + "</p>" +
        '<ol class="findings small">' + r.findings.slice(0, 10).map(function (f) { return "<li>" + mk(f.msg) + "</li>"; }).join("") + "</ol>" : "") +
      '<p class="muted small">Es el corrector de ' + esc((H && H.ui && H.ui().scrivi) || "Scrivi") + ": marca los errores típicos que conoce, no la calidad del texto. " +
      "No hay consigna: lo que cuentes está bien.</p></div>";
  }

  function render() {
    if (!cur) return '<button class="btn ghost" id="fuback">← a la semana</button>';
    var st = H.state(), n = cur.week, f = ficha(n), src = fuente(f), r = rec(st, n) || { q: [], t: "" };
    var ql = qlang(n) === "es" ? "" : langAttr(), lname = (LG().ui || {}).langEs || "la lengua";
    var backTo = cur.from === "leggi" ? "a " + esc((H.ui && H.ui().read) || "Leggi") : cur.from === "hoy" ? "a Hoy" : "a la semana";
    if (H.lexicon) H.lexicon();
    var html = '<button class="btn ghost" id="fuback">← ' + backTo + "</button>" +
      "<h1>" + (KIND[f.kind] || "📺") + " " + esc(f.title) + "</h1>" +
      '<p class="lead">' + esc(label()) + " · semana " + n + " · " + esc(f.level) + " · " + esc(KIND_ES[f.kind] || "") + " · unos " + f.min + " minutos</p>" +
      '<div class="card fu-card"><p><b>Para qué sirve.</b> ' + esc(f.why) + "</p>" +
      "<p><b>Cómo.</b> " + esc(f.how) + "</p>" +
      '<a class="btn wide fu-go" id="fugo" href="' + esc(f.url) + '" target="_blank" rel="noopener noreferrer">Abrir ' + esc(src.name || "el enlace") + " ↗</a>" +
      '<p class="muted small">Se abre fuera de la app y necesita internet; acá no se reproduce nada. ' + esc(src.note || "") +
        (f.buscar ? " Si el enlace no anda, buscá <i" + langAttr() + ">«" + esc(f.buscar) + "»</i>." : "") + "</p></div>" +
      '<div class="card"><h3>Palabras que vas a ' + (f.kind === "lectura" ? "leer" : "oír") + "</h3>" +
      '<ul class="fu-words">' + f.words.map(function (x) {
        return "<li><b" + langAttr() + ">" + esc(x[0]) + "</b> <span class=\"muted\">—</span> " + esc(x[1]) + "</li>";
      }).join("") + "</ul></div>" +
      '<div class="card"><h3>Tres preguntas para vos</h3>' +
      '<p class="muted small">Leelas antes de abrir el enlace; después, contestalas de memoria' + (ql ? ", en " + esc(lname) : "") +
        ". No hay respuesta que controlar: marcá las que pudiste contestar.</p>" +
      '<ol class="fu-q">' + f.questions.map(function (q, i) {
        return "<li><span" + ql + ">" + esc(q) + '</span> <button class="chip' + (r.q[i] ? " on" : "") + '" data-fuq="' + i + '" aria-pressed="' + (r.q[i] ? "true" : "false") + '">' +
          (r.q[i] ? "✓ La contesté" : "La contesté") + "</button></li>";
      }).join("") + "</ol></div>" +
      '<div class="card"><h3>Anotá los minutos</h3>' +
      '<p class="muted small">Un toque por cada rato que escuchaste, miraste o leíste. Cuentan como input en tu semana y en tu meta del día.</p>' +
      '<div class="chips fu-min">' + TAPS.map(function (m) { return '<button class="chip" data-fumin="' + m + '">+' + m + " min</button>"; }).join("") + "</div>" +
      '<p class="small" id="fumins">' + minutesLine(st, n) + "</p>" +
      (canUndo(st, n) ? '<button class="tab" id="fuundo">Deshacer el último</button>' : "") + "</div>" +
      '<div class="card"><h3>Después, contalo</h3>' +
      "<p>En " + TELL[0] + "–" + TELL[1] + " palabras, en " + esc(lname) + ": qué escuchaste o leíste, qué entendiste y qué te llamó la atención. Opcional, sin consigna." +
        (f.tell ? ' <span class="muted">Por ejemplo: ' + esc(f.tell) + "</span>" : "") + "</p>" +
      '<textarea id="futext" class="grow scrivi" rows="6" spellcheck="false" autocapitalize="sentences"' + langAttr() + ">" + esc(r.t || "") + "</textarea>" +
      '<p class="muted small" id="fucount">' + countLine(r.t || "") + "</p>" +
      '<div class="row"><button class="btn" id="fucheck">🔎 Revisar</button></div>' +
      '<div id="fuout">' + (cur.check ? checkHtml(cur.check, r.t || "") : "") + "</div></div>";
    return html;
  }

  function saveText(text) {
    var st = H.state();
    recOf(st, cur.week).t = String(text || "").slice(0, 3000);
    H.persist();
  }

  function wire(screen) {
    if (typeof document === "undefined") return;
    document.querySelectorAll("[data-fuera]").forEach(function (b) {
      b.onclick = function () { open(+b.getAttribute("data-fuera"), screen === "leggi" ? "leggi" : "briefing"); };
    });
    if (!owns(screen) || !cur) return;
    var on = function (id, fn) { var b = document.getElementById(id); if (b) b.onclick = fn; };
    on("fuback", back);
    document.querySelectorAll("[data-fumin]").forEach(function (b) {
      b.onclick = function () {
        var st = H.state(), r = log(st, cur.week, +b.getAttribute("data-fumin"));
        if (!r.min) { H.toast("Por hoy ya anotaste " + DAY_MAX + " minutos fuera de la app."); return; }
        if (r.xp) H.gain(r.xp, "input");
        H.persist();
        H.toast("⏱️ +" + r.min + " min de input" + (r.xp ? " · +" + r.xp + " xp" : ""));
        H.render();
      };
    });
    on("fuundo", function () {
      var m = undo(H.state(), cur.week);
      if (m) { H.persist(); H.toast("Deshecho: −" + m + " min"); }
      H.render();
    });
    document.querySelectorAll("[data-fuq]").forEach(function (b) {
      b.onclick = function () {
        var yes = toggleQ(H.state(), cur.week, +b.getAttribute("data-fuq"));
        H.persist();
        b.classList.toggle("on", yes);
        b.setAttribute("aria-pressed", yes ? "true" : "false");
        b.textContent = yes ? "✓ La contesté" : "La contesté";
      };
    });
    var box = document.getElementById("futext"), cnt = document.getElementById("fucount");
    if (box) {
      box.addEventListener("input", function () {
        if (cnt) cnt.textContent = countLine(box.value);
        clearTimeout(saveTimer);
        var text = box.value;
        saveTimer = setTimeout(function () { saveText(text); }, 400);
      });
      box.addEventListener("blur", function () { clearTimeout(saveTimer); saveText(box.value); });
    }
    on("fucheck", function () {
      if (!box) return;
      clearTimeout(saveTimer);
      var text = box.value, st = H.state();
      if (!words(text)) { H.toast("Primero escribí algo."); return; }
      if (H.lexicon) H.lexicon();
      var prev = (rec(st, cur.week) || {}).t;
      var r = review(st, cur.week, text);
      cur.check = r;
      if (r.xp) { H.gain(r.xp, "output"); H.toast("✍️ Contado · +" + r.xp + " xp"); }
      // what the checker marked goes to the error profile, once per text
      if (H.recordFindings && prev !== text) H.recordFindings(r.findings, text);
      H.persist();
      var out = document.getElementById("fuout");
      if (out) { out.innerHTML = checkHtml(r, text); out.scrollIntoView({ block: "nearest", behavior: "smooth" }); }
    });
  }

  function attach(host) { H = host; }

  var api = { TAPS: TAPS, DAY_MAX: DAY_MAX, XP_DAY: XP_DAY, TELL: TELL, KIND: KIND,
              fichas: fichas, ficha: ficha, weeks: weeks, fuente: fuente, qlang: qlang, label: label, metaFrom: metaFrom,
              store: store, log: log, undo: undo, canUndo: canUndo, minutes: minutes, total: total, toggleQ: toggleQ, done: done,
              words: words, review: review, missions: missions, handles: handles, go: go,
              weekButtons: weekButtons, leggiFold: leggiFold, open: open, owns: owns, render: render, wire: wire, attach: attach,
              current: function () { return cur; } };
  if (typeof module === "object" && module.exports) module.exports = api;
  root.Fuera = api;
})(typeof window !== "undefined" ? window : globalThis);
