/*
 * El test de ubicación: para quien no empieza de cero.
 *
 * Un test escrito y adaptativo, de unas 25 preguntas, armado con los
 * ejercicios del propio curso (los de opción múltiple y los de completar,
 * nunca los de escucha).  Cada pregunta es de una semana; el nivel se
 * estima con una distribución sobre «hasta qué semana sabés» (0-51) que se
 * actualiza después de cada respuesta (un modelo logístico con la chance
 * de adivinar y de errar por descuido), y la pregunta siguiente es de la
 * semana donde la estimación está más en duda.  «No sé» vale más que
 * adivinar: el test lo dice.
 *
 * Al final propone la semana de arranque (un poco por debajo de la
 * estimación: mejor repasar que perderse) y, si se acepta, abre las
 * semanas anteriores sin estrellas: se pueden visitar y jugar cuando se
 * quiera.  Nunca baja lo desbloqueado ni toca el progreso de quien ya
 * avanzó.
 *
 * El núcleo no nombra un idioma: los ejercicios salen del curso del
 * paquete y la corrección de lo escrito, de Engine.grade.
 *
 *   Ubicacion.pool(course)          las preguntas posibles, por semana
 *   Ubicacion.create(course, opts)  una sesión: next(), answer(ok), done(), result()
 *   Ubicacion.apply(state, start)   abre hasta la semana start (solo sube)
 *   Ubicacion.fresh(state)          ¿un idioma recién empezado?
 *   Ubicacion.start(ctx) / html() / wire(el) / banner(state) / card(state)
 *                                   la pantalla, para app.js
 */
(function (root) {
  "use strict";

  var MAX_Q = 25, MIN_Q = 12, TOP = 51;       // hasta la semana 51: la 52 es el examen
  var SLIP = 0.06, SCALE = 2.2;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ------------------------------------------------------------ el banco */

  // An exercise that can be answered in writing, without sound or context.
  function usable(it) {
    if (!it || !it.answer || !it.stem || it.type === "listen" || it.nopeek) return false;
    if (/escuch|audio|oí|grab/i.test(String(it.prompt || ""))) return false;
    var stem = String(it.stem);
    if (it.options && it.options.length >= 2) {
      return it.options.length <= 4 && it.options.indexOf(it.answer) >= 0 && stem.length <= 140;
    }
    if (it.type === "cloze") {
      return stem.split("___").length === 2 && String(it.answer).length <= 28 &&
        String(it.answer).indexOf("|") < 0 && stem.length <= 140;
    }
    return false;
  }

  // week → the usable exercises taught that week (week.items), bosses aside.
  function pool(course) {
    var map = {}, out = {};
    (course.items || []).forEach(function (it) { map[it.id] = it; });
    (course.weeks || []).forEach(function (w) {
      if (w.boss || w.week > TOP) return;
      var list = (w.items || []).map(function (id) { return map[id]; }).filter(usable);
      if (list.length) out[w.week] = list;
    });
    return out;
  }

  /* --------------------------------------------------------- la estimación */

  // P(right) for an exercise of week k when the learner knows up to week L.
  function pRight(L, k, guess) {
    var s = 1 / (1 + Math.exp(-(L - k + 0.5) / SCALE));
    return guess + (1 - guess - SLIP) * s;
  }
  function guessOf(it) { return it.options && it.options.length ? 1 / it.options.length : 0.02; }

  function prior() {
    // Most who take it know a little: the prior leans to the start.
    var p = [], sum = 0;
    for (var L = 0; L <= TOP; L++) { p[L] = Math.exp(-L / 16); sum += p[L]; }
    return p.map(function (x) { return x / sum; });
  }
  function quantile(p, q) {
    var acc = 0;
    for (var L = 0; L < p.length; L++) { acc += p[L]; if (acc >= q) return L; }
    return p.length - 1;
  }
  function mean(p) { var m = 0; p.forEach(function (x, L) { m += x * L; }); return m; }
  function sd(p) { var m = mean(p), v = 0; p.forEach(function (x, L) { v += x * (L - m) * (L - m); }); return Math.sqrt(v); }

  /* A session: next() gives the question, answer(ok) updates the estimate. */
  function create(course, opts) {
    opts = opts || {};
    var rnd = opts.rnd || Math.random;
    var bank = opts.pool || pool(course);
    var weeks = Object.keys(bank).map(Number).sort(function (a, b) { return a - b; });
    var S = { post: prior(), asked: [], used: {}, cur: null, right: 0 };

    function pickNear(k) {
      // the closest week with something not yet asked
      for (var d = 0; d <= TOP; d++) {
        var cands = [k + d, k - d].filter(function (x, i) { return (i === 0 || d > 0) && bank[x]; });
        for (var c = 0; c < cands.length; c++) {
          var left = bank[cands[c]].filter(function (it) { return !S.used[it.id]; });
          if (left.length) return { week: cands[c], it: left[Math.floor(rnd() * left.length)] };
        }
      }
      return null;
    }
    function next() {
      if (done()) return null;
      // where the estimate is most in doubt: just above the median
      var k = Math.max(weeks[0] || 1, Math.min(TOP, quantile(S.post, 0.5) + 1));
      var q = pickNear(k);
      if (!q) return null;
      S.used[q.it.id] = 1;
      S.cur = q;
      return q;
    }
    function answer(ok) {
      var q = S.cur;
      if (!q) return;
      var g = guessOf(q.it), sum = 0;
      S.post = S.post.map(function (x, L) {
        var p = pRight(L, q.week, g);
        var y = x * (ok ? p : 1 - p);
        sum += y;
        return y;
      });
      S.post = S.post.map(function (x) { return x / (sum || 1); });
      S.asked.push({ id: q.it.id, week: q.week, ok: !!ok });
      if (ok) S.right++;
      S.cur = null;
    }
    function beginner() { return S.post[0] + S.post[1] >= 0.9; }
    function done() {
      var n = S.asked.length;
      if (n >= MAX_Q) return true;
      if (n >= 8 && beginner()) return true;
      if (n >= MIN_Q && sd(S.post) <= 1.6) return true;
      return false;
    }
    function result() {
      var median = quantile(S.post, 0.5), low = quantile(S.post, 0.25);
      // a little under the estimate: better to review than to get lost
      var start = Math.max(1, Math.min(TOP, low + 1));
      if (start <= 2) start = 1;
      return { level: median, start: start, asked: S.asked.length, right: S.right,
               top: S.asked.reduce(function (m, a) { return a.ok ? Math.max(m, a.week) : m; }, 0),
               sd: sd(S.post),
               // what went wrong («No sé» too): it goes to the review
               failed: S.asked.filter(function (a) { return !a.ok; }).map(function (a) { return a.id; }) };
    }
    return { next: next, answer: answer, done: done, result: result, state: S,
             total: function () { return MAX_Q; } };
  }

  /* ------------------------------------------------------------- guardado */

  // A language just started: nothing read, nothing played, week 1.
  function fresh(state) {
    if (!state) return false;
    return (state.unlocked || 1) <= 1 && !Object.keys(state.read || {}).length &&
      !Object.keys(state.weekStats || {}).length && !(state.totals && state.totals.attempts);
  }

  // Opens the weeks before start (without stars: those are earned playing).
  // Never lowers what is open.  Returns how many weeks it opened.
  // With the course, the test talks to the review too (seed).
  function apply(state, start, res, course) {
    start = Math.max(1, Math.min(52, Math.round(+start || 1)));
    var before = state.unlocked || 1;
    var rec = { at: Date.now(), start: start, from: before };
    if (res) { rec.level = res.level; rec.asked = res.asked; rec.right = res.right; }
    if (start > before) state.unlocked = start;
    if (course && start > before) rec.seeded = seed(state, course, before, start, res);
    state.ubicacion = rec;
    return Math.max(0, start - before);
  }

  /* The placement test talks to the review: the words and the phrases of
     the weeks skipped become cards in maintenance (known: they come back a
     few a day, and the review finds the gaps by itself, never as a debt);
     what the test got wrong becomes a card due now.  A card already there
     is never touched. */
  function seed(state, course, from, start, res) {
    var E = G(), D = root.Drills, F = root.Frasi, n = { words: 0, phrases: 0, failed: 0 };
    if (!E || !E.enqueue) return n;
    var now = Date.now(), DAY = 86400000, k = 0;
    // spread over the coming weeks, so the first days are not all old words
    var when = function () { return now + (k++ % 60) * DAY; };
    (course.weeks || []).forEach(function (w) {
      if (w.week < from || w.week >= start) return;
      (w.vocab || []).forEach(function (v) {
        if (!state.cards["v:" + v[0]]) { E.enqueue(state, "v:" + v[0], null, { maint: true, due: when(), now: now }); n.words++; }
      });
      if (D && F && D.scenesOfWeek) D.scenesOfWeek(w.week).forEach(function (sc) {
        F.ofScene(sc.id).forEach(function (f) {
          if (!state.cards[f.id]) { E.enqueue(state, f.id, null, { maint: true, due: when(), now: now }); n.phrases++; }
        });
      });
    });
    ((res && res.failed) || []).forEach(function (id) {
      if (!state.cards[id] || state.cards[id].seeded) { delete state.cards[id]; E.enqueue(state, id, null, { due: now, now: now }); n.failed++; }
    });
    return n;
  }

  /* A mini diagnosis of interference (ten sentences of «find the error»,
     one per category of the bank, from the grammar already open): the
     answers start the error profile, which is otherwise empty until the
     first round. */
  function diagnosis(state, size) {
    var B = root.Banca;
    if (!B || !B.loaded || !B.loaded() || !B.errorItem) return [];
    var errs = (B.bank() || {}).errors || [], byCat = {}, wk = (state && state.unlocked) || 1;
    errs.forEach(function (e, i) { if ((e.w || 1) <= wk) (byCat[e.cat] = byCat[e.cat] || []).push(i); });
    var cats = Object.keys(byCat).sort(function () { return Math.random() - 0.5; });
    return cats.slice(0, size || 10).map(function (c) {
      var l = byCat[c];
      return B.errorItem(l[Math.floor(Math.random() * l.length)]);
    });
  }

  /* ------------------------------------------------------------ pantalla */

  var ctx = null, ses = null, view = "intro", curQ = null, res = null, msg = "";

  function G() { return root.Engine; }

  function start(c) {
    ctx = c; ses = null; view = "intro"; curQ = null; res = null; msg = "";
  }
  function redraw() { if (ctx && ctx.render) ctx.render(); if (root.scrollTo) root.scrollTo(0, 0); }

  function weekTitle(n) {
    var w = ctx && ctx.course && ctx.course.weeks[n - 1];
    return w ? w.title + " · " + w.level : "";
  }

  function htmlIntro() {
    var st = ctx.state, adv = (st.unlocked || 1) > 1;
    return '<button class="btn ghost" id="ubback">← Volver</button>' +
      "<h1>🧭 Test de ubicación</h1>" +
      '<div class="card ubic">' +
      '<p class="lead">¿No empezás de cero? Unas 25 preguntas escritas, ' +
      "del curso mismo, que se ajustan a cómo vas: si acertás, suben; si no, bajan. Tarda unos cinco a ocho minutos.</p>" +
      "<ul class=\"ubic-list\"><li>Si no sabés, tocá <b>No sé</b>: adivinar solo confunde el resultado.</li>" +
      "<li>No hay nada oral ni de escucha: todo se lee y se escribe.</li>" +
      "<li>Al final te proponemos una semana para arrancar. Las anteriores quedan abiertas, sin estrellas, para visitarlas cuando quieras.</li>" +
      (adv ? "<li>Ya vas por la semana " + st.unlocked + ": el test no te va a bajar nunca, como mucho te abre semanas más adelante.</li>" : "") +
      "</ul>" +
      '<div class="row"><button class="btn" id="ubgo">Empezar el test</button>' +
      '<button class="btn ghost" id="ubskip">' + (adv ? "Ahora no" : "Empiezo de cero") + "</button></div></div>";
  }

  function htmlQuestion() {
    var q = curQ, it = q.it, n = ses.state.asked.length + 1;
    var pct = Math.round((n - 1) / MAX_Q * 100);
    var body;
    if (it.options && it.options.length) {
      body = '<div class="options">' + it.options.map(function (o, k) {
        return '<button class="opt" data-ubo="' + k + '">' + esc(o) + "</button>";
      }).join("") + "</div>";
    } else {
      body = '<div class="typed"><input id="ubin" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Escribí la respuesta">' +
        '<button class="btn" id="ubsend">Listo</button></div>';
    }
    return '<div class="hud"><span class="progressline"><i style="width:' + pct + '%"></i></span>' +
      '<span class="muted">' + n + " de ~" + MAX_Q + "</span>" +
      '<button class="btn ghost" id="ubquit" aria-label="Salir del test">✕</button></div>' +
      '<div class="card lescard quiz ubic-q"><div class="badge-new">🧭 Test de ubicación</div>' +
      '<div class="prompt">' + esc(it.prompt) + "</div>" +
      '<div class="stem">' + esc(it.stem) + "</div>" + body +
      '<div class="row ubic-foot"><button class="tab" id="ubdunno">No sé</button>' +
      (n > 8 ? '<button class="tab" id="ubend">Terminar acá</button>' : "") + "</div></div>";
  }

  function htmlResult() {
    var st = ctx.state, r = res, cur = st.unlocked || 1;
    var html = '<div class="card ubic center"><div class="bigstar">🧭</div>';
    if (r.start <= 1) {
      html += "<h1>Arrancá por la semana 1</h1>" +
        '<p class="lead">Acertaste ' + r.right + " de " + r.asked + ". Lo mejor es empezar desde el principio: las primeras semanas van rápido si algo ya sabés.</p>";
    } else {
      html += "<h1>Tu punto de partida: semana " + r.start + "</h1>" +
        '<p class="lead">' + esc(weekTitle(r.start)) + "</p>" +
        '<p class="muted">Acertaste ' + r.right + " de " + r.asked + (r.top ? "; respondiste bien hasta preguntas de la semana " + r.top : "") +
        ". Te proponemos arrancar un poco antes de donde llegaste: mejor repasar que perderse.</p>";
    }
    if (msg) html += '<p class="note">' + esc(msg) + "</p>";
    html += '<div class="row centerrow" style="margin-top:14px">';
    if (r.start > cur) {
      html += '<button class="btn" id="ubapply">Empezar en la semana ' + r.start + "</button>" +
        '<button class="btn ghost" id="ubkeep">' + (cur > 1 ? "Seguir en la semana " + cur : "Prefiero empezar de cero") + "</button>";
    } else {
      html += (r.start > 1 && cur > 1 ? '<p class="muted">Ya vas por la semana ' + cur + ": tu progreso queda como está.</p>" : "") +
        '<button class="btn" id="ubkeep">Listo</button>';
    }
    html += "</div>" +
      (r.start > cur ? '<p class="muted small">Las semanas 1 a ' + (r.start - 1) + " quedan abiertas y sin estrellas: podés leer su teoría y jugarlas cuando quieras. Lo que ya jugaste no cambia.</p>" : "") +
      "</div>";
    return html;
  }

  // After applying: what went to the review, and the mini diagnosis.
  function htmlApplied() {
    var sd = (ctx.state.ubicacion || {}).seeded || {};
    return '<div class="card ubic center"><div class="bigstar">🔓</div>' +
      "<h1>Arrancás en la semana " + (ctx.state.unlocked || 1) + "</h1>" +
      '<p class="lead">Lo de las semanas que saltaste no se pierde: ' +
      (sd.words ? sd.words + " palabras" : "") + (sd.words && sd.phrases ? " y " : "") + (sd.phrases ? sd.phrases + " frases" : "") +
      (sd.words || sd.phrases ? " entran al repaso de a poco, como ya sabidas; si algo no sale, vuelve más seguido." : "") +
      (sd.failed ? " Lo que fallaste en el test (" + sd.failed + ") vuelve hoy mismo." : "") + "</p>" +
      '<p class="muted">¿Diez oraciones para ver dónde te traiciona el castellano? Arman tu perfil de errores desde el primer día (unos tres minutos).</p>' +
      '<div class="row centerrow" style="margin-top:14px"><button class="btn" id="ubdiag">🔎 Mini diagnóstico</button>' +
      '<button class="btn ghost" id="ubdone">Ahora no: al camino</button></div></div>';
  }

  function html() {
    if (!ctx) return "";
    if (view === "applied") return htmlApplied();
    if (view === "q" && curQ) return htmlQuestion();
    if (view === "result" && res) return htmlResult();
    return htmlIntro();
  }

  function finish(applied, next) {
    var c = ctx;
    ctx = null; ses = null; curQ = null;
    if (c && c.done) c.done(applied, next);
  }

  function advance() {
    curQ = ses.next();
    if (!curQ) { res = ses.result(); view = "result"; }
    else view = "q";
    redraw();
  }

  function answered(ok) {
    ses.answer(ok);
    advance();
  }

  function on(el, sel, fn) { var b = el.querySelector(sel); if (b) b.onclick = fn; }

  function wire(el) {
    if (!ctx || !el) return;
    on(el, "#ubback", function () { finish(false); });
    on(el, "#ubskip", function () {
      if (!ctx.state.ubicacion) ctx.state.ubicacion = { at: Date.now(), no: true };
      finish(false);
    });
    on(el, "#ubgo", function () { ses = create(ctx.course); advance(); });
    on(el, "#ubquit", function () { finish(false); });
    on(el, "#ubdunno", function () { answered(false); });
    on(el, "#ubend", function () { res = ses.result(); view = "result"; redraw(); });
    Array.prototype.forEach.call(el.querySelectorAll("[data-ubo]"), function (b) {
      b.onclick = function () { answered(curQ.it.options[+b.getAttribute("data-ubo")] === curQ.it.answer); };
    });
    var inp = el.querySelector("#ubin");
    var send = function () {
      var v = inp.value.trim();
      if (!v) { inp.focus(); return; }
      var E = G(), vd = E && E.grade ? E.grade(v, curQ.it) : (v.toLowerCase() === String(curQ.it.answer).toLowerCase() ? "giusto" : "sbagliato");
      // a missing accent is still knowing the form
      answered(vd === ((E && E.VERDICT) || {}).RIGHT || vd === ((E && E.VERDICT) || {}).CLOSE || vd === "giusto" || vd === "quasi");
    };
    if (inp) {
      inp.onkeydown = function (e) { if (e.key === "Enter") { e.preventDefault(); send(); } };
      on(el, "#ubsend", send);
      try { inp.focus(); } catch (e) { /* */ }
    }
    on(el, "#ubapply", function () {
      apply(ctx.state, res.start, res, ctx.course);
      view = "applied";
      redraw();
    });
    on(el, "#ubdiag", function () { finish(true, "diag"); });
    on(el, "#ubdone", function () { finish(true); });
    on(el, "#ubkeep", function () {
      if (!ctx.state.ubicacion || ctx.state.ubicacion.no) {
        ctx.state.ubicacion = { at: Date.now(), start: res.start, from: ctx.state.unlocked || 1, level: res.level, kept: true };
      }
      finish(false);
    });
  }

  // On the first screen of a language just started: the offer, once.
  function banner(state) {
    if (!fresh(state) || state.ubicacion) return "";
    return '<div class="card ubic-banner"><b>🧭 ¿Ya sabés algo?</b>' +
      '<p class="muted small">Un test escrito de unas 25 preguntas te dice desde qué semana arrancar, y abre las anteriores.</p>' +
      '<span class="row"><button class="btn" id="ubicgo">Hacer el test</button>' +
      '<button class="tab" id="ubicno">Empiezo de cero</button></span></div>';
  }

  // In the profile: always there.
  function card(state) {
    var u = state && state.ubicacion;
    var last = u && u.start && !u.no ? "La última vez: semana " + u.start + (u.kept ? " (seguiste donde estabas)" : "") + "." : "";
    return '<div class="card"><h2>🧭 Test de ubicación</h2>' +
      '<p class="muted small">Unas 25 preguntas escritas que estiman desde qué semana seguir. Si da más adelante de donde estás, ' +
      "te ofrece abrir las semanas intermedias (sin estrellas); nunca te baja. " + esc(last) + "</p>" +
      '<div class="row"><button class="btn ghost" id="ubicgo">Hacer el test</button></div></div>';
  }

  var api = { pool: pool, usable: usable, create: create, apply: apply, seed: seed, diagnosis: diagnosis, fresh: fresh, pRight: pRight,
              start: start, html: html, wire: wire, banner: banner, card: card,
              active: function () { return !!ctx; }, current: function () { return curQ; }, MAX_Q: MAX_Q };
  if (typeof module === "object" && module.exports) module.exports = api;
  root.Ubicacion = api;
})(typeof window !== "undefined" ? window : this);
