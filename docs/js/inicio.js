/*
 * El día, el principio y el final.
 *
 *   · «Hoy»: después del curso, la tarjeta de arriba de Oggi / Hoje (durante
 *     el curso la organización es el percorso: su próxima misión va arriba
 *     de Oggi, desde la 3.2).  El plan del día
 *     (Plan.today, js/plan.js) como lista tildable, el selector 5 / 15 / 30
 *     minutos (queda recordado), un botón «Empezar» que encadena los pasos
 *     y la meta en minutos con la fecha estimada de llegada a C1.  El plan
 *     se congela por día (state.hoy) para que la lista no cambie mientras
 *     se hace; cada paso se tilda solo cuando se cumple, o a mano.
 *   · Las tarjetas de hábito (volviste, cierre semanal, copia, para qué,
 *     esta semana): como mucho una por día, con «Después».  La de regreso
 *     tiene prioridad.
 *   · El primer arranque: tres pantallas una sola vez, después del
 *     selector de idioma (para qué y cuántos minutos; ¿de cero o con el test
 *     de ubicación?; cómo funciona la semana y las pestañas), y Oggi
 *     con una sola tarjeta hasta terminar la primera lección.  Nunca a quien
 *     ya tiene progreso.
 *   · Después del curso: aprobado el examen de la semana 52,
 *     state.phase = "mantenimiento".  Oggi cambia de eje (lo arma Plan) y
 *     aparece el cierre del año, compartible como imagen.
 *
 * Se engancha con app.js por Inicio.attach(host) (como tramo.js): render,
 * wire, owns, y los ganchos oggiTop / habit / resultButton / boot.
 *
 * Guarda: state.onboard {step, at}, state.hoy {dk, min, steps, tick, fin,
 * run, card, snooze}, state.phase, state.phaseAt, state.cierre, state.simAt.
 */
(function (root) {
  "use strict";

  var H = null;
  var DAY = 864e5;
  function esc(s) { return H ? H.esc(s) : String(s == null ? "" : s); }
  function S() { return H.state(); }
  function P() { return root.Progreso; }
  function dk(d) { return P() ? P().dayKey(d) : (function (x) { x = x || new Date(); return x.getFullYear() + "-" + (x.getMonth() + 1) + "-" + x.getDate(); })(d); }
  function UI() { return H.ui(); }

  /* ------------------------------------------------------ el primer arranque */

  // A language just chosen, with nothing done: the three screens (once).
  function needs(state) {
    if (!state) return false;
    if (state.onboard && typeof state.onboard === "object") return !state.onboard.at;
    var fresh = root.Ubicacion ? root.Ubicacion.fresh(state)
      : (state.unlocked || 1) <= 1 && !Object.keys(state.read || {}).length && !(state.totals && state.totals.attempts);
    return fresh && !state.ubicacion && !(state.xp > 0);
  }
  var ob = null;          // the choices on the way: { why, min, days, time }
  function obState() {
    var st = S();
    if (!st.onboard || typeof st.onboard !== "object") st.onboard = { step: 1 };
    if (!ob) {
      var r = P() ? P().ritmo(st) : { min: 20, days: 5 };
      ob = { why: (st.ideal && st.ideal.why) || "", min: r.min, days: r.days, time: st.remind || "" };
    }
    return st.onboard;
  }

  function chip(attr, val, label, on) {
    return '<button class="tab chip' + (on ? " on" : "") + '" ' + attr + '="' + esc(val) + '" aria-pressed="' + (on ? "true" : "false") + '">' + label + "</button>";
  }
  function dots(n) {
    return '<p class="onb-dots" aria-label="Paso ' + n + ' de 3">' + [1, 2, 3].map(function (k) { return '<i class="' + (k === n ? "on" : k < n ? "done" : "") + '"></i>'; }).join("") + "</p>";
  }

  function onbStep1() {
    var LG = H.lg(), why = LG.why || [];
    return dots(1) + '<h1 class="onb-h">Hola. Antes de empezar, dos cosas</h1>' +
      '<div class="card onb"><h2>¿Para qué querés ' + esc(UI().langEs) + "?</h2>" +
      '<p class="muted small">Tener la meta a la vista ayuda a sostener el esfuerzo. Podés cambiarla en ' + esc(UI().me) + ".</p>" +
      '<span class="chips">' + why.map(function (w) { return chip("data-obwhy", w[0], esc(w[1]), ob.why === w[0]); }).join("") + "</span></div>" +
      '<div class="card onb"><h2>¿Cuánto tiempo por día?</h2>' +
      '<p class="muted small">Con 20 minutos, 5 días por semana, el curso lleva un año. Menos también sirve: tarda más.</p>' +
      '<span class="chips">' + [10, 15, 20, 30, 45].map(function (m) { return chip("data-obmin", m, m + " min", ob.min === m); }).join("") + "</span>" +
      '<p class="muted small" style="margin-top:10px">¿Cuántos días por semana?</p>' +
      '<span class="chips">' + [3, 4, 5, 6, 7].map(function (d) { return chip("data-obdays", d, d + " días", ob.days === d); }).join("") + "</span>" +
      '<label class="set onb-time"><span>¿A qué hora te aviso?<small>opcional: un recordatorio en tu calendario, sin cuentas ni servidores</small></span>' +
        '<input type="time" id="obtime" value="' + esc(ob.time || "") + '"></label>' +
      '<p class="muted small">' + esc(etaFor(ob.min, ob.days)) + "</p></div>" +
      '<div class="row onb-foot"><button class="btn" id="obnext">Siguiente</button><button class="tab" id="obskip">Saltar</button></div>';
  }
  function etaFor(min, days) {
    if (!P()) return "";
    var pace = min * days / P().weekMinutes(1), d = new Date(Date.now() + 52 / Math.max(0.05, pace) * 7 * DAY);
    return "A ese ritmo, llegás a C1 en " + P().fmtMonth(d) + ".";
  }

  function onbStep2() {
    return dots(2) + '<h1 class="onb-h">¿Empezás de cero o ya sabés algo?</h1>' +
      '<div class="onb-pick">' +
      '<button class="card onb-opt" id="obzero"><span class="e">🌱</span><b>Empiezo de cero</b>' +
        '<span class="muted">Arrancás en la semana 1: el alfabeto, los saludos, los primeros verbos.</span></button>' +
      '<button class="card onb-opt" id="obtest"><span class="e">🧭</span><b>Ya sé algo</b>' +
        '<span class="muted">Un test de unas 25 preguntas escritas (cinco a ocho minutos) te dice en qué semana arrancar. ' +
        "Las anteriores quedan abiertas.</span></button></div>" +
      '<div class="row onb-foot"><button class="tab" id="obback">← Volver</button></div>';
  }

  function onbStep3() {
    var st = S(), U = UI(), tabs = U.tabs || [];
    var TAB = {
      oggi: "la próxima misión de tu semana, el repaso y atajos.",
      frasi: "para practicar más: frases, palabras, sonidos, la Clínica de tus errores.",
      leggi: "lecturas y escuchas de tu nivel, y la Biblioteca de libros enteros.",
      percorso: "las 52 semanas en cuatro estaciones; cada semana trae sus palabras, sus misiones y más práctica; cada estación termina con un " + esc(U.boss || "jefe") + ".",
      io: "tu progreso, tus ajustes, la copia de seguridad y todo el material junto: lecturas, Biblioteca, práctica, Consultar."
    };
    var start = st.unlocked > 1 ? "Arrancás en la semana " + st.unlocked + "." : "Arrancás en la semana 1.";
    return dots(3) + '<h1 class="onb-h">Cómo funciona</h1>' +
      '<div class="card onb"><h2>Una semana, un tema</h2>' +
      '<p class="muted">Cada semana tiene su gramática y sus palabras. El camino es siempre el mismo:</p>' +
      '<ol class="onb-week"><li>📘 la lección, en pasos cortos</li><li>📚 las palabras</li><li>🎯 entrenar hasta 20 respuestas bien</li>' +
      "<li>✍️ un texto tuyo</li><li>💬 frases para usar</li><li>📖 una lectura</li><li>🏆 «Dominala»: una sesión que muestra que la sabés</li></ol>" +
      '<p class="muted small">Cuando terminás las misiones se abre la semana siguiente. En ' + esc(U.today || "Hoy") + " siempre está la próxima misión de tu semana.</p></div>" +
      '<div class="card onb"><h2>Las ' + (tabs.length === 3 ? "tres" : tabs.length) + ' pestañas</h2><ul class="onb-tabs">' +
      tabs.map(function (t) { return "<li><span>" + t[1] + "</span><span><b>" + esc(t[2]) + "</b> · " + (TAB[t[0]] || "") + "</span></li>"; }).join("") + "</ul></div>" +
      '<p class="muted onb-start">' + esc(start) + "</p>" +
      '<div class="row onb-foot"><button class="btn" id="obgo">Empezar</button>' +
      (ob.time ? '<button class="btn ghost" id="obics">📅 Recordatorio a las ' + esc(ob.time) + "</button>" : "") + "</div>";
  }

  function renderOnboard() {
    var o = obState();
    return '<div class="onbwrap">' + (o.step === 2 ? onbStep2() : o.step === 3 ? onbStep3() : onbStep1()) + "</div>";
  }

  function saveChoices() {
    var st = S();
    if (P()) P().setRitmo(st, { min: ob.min, days: ob.days });
    if (ob.why) st.ideal = Object.assign({}, st.ideal || {}, { why: ob.why, text: (st.ideal && st.ideal.text) || "", at: Date.now() });
    if (ob.time) st.remind = ob.time;
    var h = hoy(st); h.min = ob.min >= 30 ? 30 : ob.min >= 15 ? 15 : 5;
  }
  function finishOnboard() {
    var st = S();
    saveChoices();
    st.onboard = { step: 3, at: Date.now() };
    H.persist();
    ob = null;
    H.go("oggi");
  }

  function wireOnboard() {
    var st = S(), o = obState();
    var q = function (sel) { return root.document.querySelectorAll(sel); };
    var on = function (id, fn) { var b = root.document.getElementById(id); if (b) b.onclick = fn; };
    var pick = function (attr, key, num) {
      q("[" + attr + "]").forEach(function (b) {
        b.onclick = function () {
          ob[key] = num ? +b.getAttribute(attr) : b.getAttribute(attr);
          q("[" + attr + "]").forEach(function (x) { var y = x === b; x.classList.toggle("on", y); x.setAttribute("aria-pressed", y ? "true" : "false"); });
          var p = root.document.querySelector(".onb-time + p.small, .onb p.small:last-child");
          if (key !== "why" && p) p.textContent = etaFor(ob.min, ob.days);
        };
      });
    };
    pick("data-obwhy", "why"); pick("data-obmin", "min", true); pick("data-obdays", "days", true);
    var t = root.document.getElementById("obtime");
    if (t) t.onchange = function () { ob.time = t.value || ""; };
    on("obnext", function () { if (t) ob.time = t.value || ""; saveChoices(); o.step = 2; H.persist(); H.render(); root.scrollTo(0, 0); });
    on("obskip", function () { if (t) ob.time = t.value || ""; finishOnboard(); });
    on("obback", function () { o.step = 1; H.render(); root.scrollTo(0, 0); });
    on("obzero", function () { o.step = 3; H.persist(); H.render(); root.scrollTo(0, 0); });
    on("obtest", function () {
      o.step = 3; H.persist();
      H.ubicacion(function () { H.show("inicio"); });
    });
    on("obgo", finishOnboard);
    on("obics", function () { if (ob.time) H.ics(ob.time); });
    void st;
  }

  // Until the first lesson is done, Oggi has a single card.
  function firstMode(state) {
    if (!state.onboard || !state.onboard.at || state.phase) return false;
    return !Object.keys(state.read || {}).length && !Object.keys(state.readSess || {}).length && !((state.totals || {}).attempts >= 20);
  }
  function firstCard() {
    var w = H.week(), nm = H.nextMission(w), st = S();
    var min = nm && root.Plan ? root.Plan.minutesFor(Object.assign({ level: w.level }, nm), st) : 4;
    return '<div class="card weekcard first hero hoy-first" id="hoyplan"><span class="muted">🌱 Tu primer paso · semana ' + w.week + " · " + esc(w.title) + "</span>" +
      (nm ? "<b>" + nm.ico + " " + esc(nm.title) + ' <span class="hs-min">' + min + "′</span></b>" +
            '<span class="muted">' + nm.sub + "</span>" +
            '<span class="row" style="margin-top:12px"><button class="btn" id="hoyfirst">▶︎ Empezar</button></span>' : "") +
      '<span class="muted small" style="margin-top:10px">Después de esta lección aparece tu plan del día: el repaso de lo que viste, el paso siguiente y algo para leer.</span></div>';
  }

  /* ------------------------------------------------------------- «Hoy» */

  function hoy(st) {
    st = st || S();
    if (!st.hoy || typeof st.hoy !== "object" || Array.isArray(st.hoy)) st.hoy = {};
    var h = st.hoy;
    ["tick", "fin", "snooze", "card"].forEach(function (k) { if (!h[k] || typeof h[k] !== "object" || Array.isArray(h[k])) h[k] = {}; });
    if ([5, 15, 30].indexOf(h.min) < 0) {
      var r = P() ? P().ritmo(st).min : 20;
      h.min = r >= 30 ? 30 : r >= 15 ? 15 : 5;
    }
    return h;
  }

  // What Plan needs from the app.
  function planCtx() {
    var st = S(), w = H.week(), change = "";
    var prevWk = root.Engine ? root.Engine.weekKey(new Date(Date.now() - 7 * DAY)) : "";
    if (st.reflect && st.reflect[prevWk]) change = st.reflect[prevWk].change || "";
    var ms = H.missions(w).map(function (m) {
      var o = { kind: m.kind, arg: m.arg, title: m.title, ico: m.ico, done: !!m.done, opt: !!m.opt, week: w.week };
      if (m.kind === "ep") o.words = H.words(m.arg);
      return o;
    });
    var ctx = {
      now: new Date(), due: H.due(), week: w, missions: ms, strands: root.Engine ? root.Engine.strandsLast(st, 7) : {},
      change: change, langName: UI().langEs, days: P() ? P().ritmo(st).days : 5, daysDone: P() ? P().daysThisWeek(st) : 0,
      inputs: { biblio: !!root.Biblioteca, facile: H.readingsDone(), btr: H.canTranslate(), pausa: H.canPausa() }
    };
    if (st.phase === "mantenimiento") ctx.maint = H.maint();
    return ctx;
  }

  function plan(force) {
    var st = S(), h = hoy(st), today = dk(), phase = st.phase || "curso";
    if (force || h.dk !== today || !Array.isArray(h.steps) || h.phase !== phase || h.planMin !== h.min) {
      if (h.dk !== today) { h.tick = {}; h.fin = {}; h.run = null; h.extra = 0; }
      var p = root.Plan.today(H.course(), st, h.min, planCtx());
      h.dk = today; h.phase = phase; h.planMin = h.min;
      h.steps = p.steps.map(function (s) {
        var o = { id: s.id, kind: s.kind, arg: s.arg, title: s.title, ico: s.ico, min: s.min, block: s.block };
        if (s.mission) o.week = H.week().week;
        if (s.n) o.n = s.n;
        return o;
      });
      h.notes = p.notes || [];
      H.persist();
    }
    return h;
  }

  function isDone(s) {
    var st = S(), h = hoy(st), today = dk();
    if (h.tick[s.id] || h.fin[s.id]) return true;
    if (s.week) return H.missionDone(s.kind, s.arg, s.week);
    var at = function (t) { return t && dk(new Date(t)) === today; };
    if (s.kind === "review" || s.kind === "micro") return !H.due();
    if (s.kind === "ep") return !!(st.letture && st.letture[s.arg] && at(st.letture[s.arg].at));
    if (s.kind === "biblio") return (((st.biblio || {}).days || {})[today] || {}).s >= s.min * 36;
    if (s.kind === "facile") return ((st.ascolto || {})[today] || {}).sec >= s.min * 36;
    if (s.kind === "tr-asc" || s.kind === "tr-scr") {
      var t = st.tramo || {}, x = (s.kind === "tr-asc" ? t.asc : t.scr) || {};
      return !!(x[s.arg] && at(x[s.arg].at));
    }
    if (s.kind === "esame") return Object.keys(st.esame || {}).some(function (k) { return at(st.esame[k].at); });
    return false;
  }

  function nextStep(h) { return (h.steps || []).filter(function (s) { return !isDone(s); })[0] || null; }

  function run(s) {
    var st = S(), h = hoy(st);
    h.run = s.id;
    H.persist();
    if (s.kind === "review" || s.kind === "micro" || s.kind === "pausa" || s.kind === "b-tr") H.startRound(s.kind, null, "hoy");
    else if (s.kind === "biblio") H.openBiblio();
    else if (s.kind === "facile") { h.fin[s.id] = true; H.persist(); H.playFacile(); H.render(); }
    else if (s.kind === "esame") { st.simAt = Date.now(); H.persist(); H.openExam(); }
    else if (s.week) H.startMission(s.kind, s.arg, s.week);
    else if (s.kind === "ep") H.openReading(s.arg);
    else if (s.kind === "tr-asc" || s.kind === "tr-scr") H.openTramo(s.kind, s.arg);
  }

  function metaLine() {
    var st = S(), Pr = P();
    if (!Pr) return "";
    var r = Pr.ritmo(st), mins = Math.round(Pr.todaySec(st) / 60), days = Pr.daysThisWeek(st);
    var lv = Pr.levelNow(H.course(), st), inW = Pr.inputWeek(st, { words: H.words }), inT = Pr.inputTarget(lv);
    var T = Pr.target(st);
    var goalPct = Math.min(100, Math.round(mins / Math.max(1, r.min) * 100));
    return '<div class="hoy-meta">' +
      '<div class="hm"><span>Hoy</span><b>' + mins + " / " + r.min + ' min</b><i class="hm-bar"><i style="width:' + goalPct + '%"></i></i></div>' +
      '<div class="hm"><span>Esta semana</span><b>' + (days >= r.days ? days + " días ✓" : days + " de " + r.days + " días") + '</b><i class="hm-bar"><i style="width:' + Math.min(100, Math.round(days / r.days * 100)) + '%"></i></i></div>' +
      '<div class="hm"><span>Input</span><b>' + inW + " / " + inT + ' min</b><i class="hm-bar in"><i style="width:' + Math.min(100, Math.round(inW / inT * 100)) + '%"></i></i></div>' +
      "</div>" +
      (st.phase ? "" : '<p class="muted small hoy-eta">' + Pr.etaLine(st) + (T && !T.done ? " " + (T.late ? "La fecha de tu meta ya pasó." : "Tu meta (semana " + T.week + ") pide unos " + T.minutes + " min por día.") : "") +
        ' <button class="linkbtn" id="toprog2">Ver tu progreso</button></p>');
  }

  function hoyCard() {
    var st = S(), h = plan(), steps = h.steps || [];
    var total = steps.reduce(function (a, s) { return a + (s.min || 0); }, 0);
    var nx = nextStep(h), doneN = steps.filter(isDone).length, maint = st.phase === "mantenimiento";
    var html = '<div class="card hoy" id="hoyplan">' +
      '<div class="hoy-head"><h2>' + (maint ? "Mantenimiento · " : "") + "Hoy: " + total + " min</h2>" +
      '<div class="seg" role="group" aria-label="¿Cuánto tiempo tenés hoy?">' + [5, 15, 30].map(function (m) {
        return '<button data-hmin="' + m + '" class="' + (h.min === m ? "on" : "") + '" aria-pressed="' + (h.min === m ? "true" : "false") + '">' + m + "′</button>";
      }).join("") + "</div></div>" +
      (maint ? '<p class="muted small">Terminaste el curso: ahora se trata de no perderlo. Repaso a meses, leer y escuchar mucho, escribir de vez en cuando.</p>' : "") +
      '<ol class="hoy-steps">' + steps.map(function (s) {
        var d = isDone(s), cur = nx && nx.id === s.id;
        return '<li class="hs' + (d ? " done" : "") + (cur ? " cur" : "") + '">' +
          '<button class="hs-check" data-hcheck="' + esc(s.id) + '" aria-pressed="' + (d ? "true" : "false") + '" aria-label="' + (d ? "Hecho: " : "Marcar como hecho: ") + esc(s.title) + '">' + (d ? "✓" : "") + "</button>" +
          '<button class="hs-go" data-hgo="' + esc(s.id) + '"><span class="hs-ico">' + s.ico + '</span><span class="hs-t">' + esc(s.title) + "</span>" +
          '<span class="hs-min">' + s.min + "′</span></button></li>";
      }).join("") + "</ol>" +
      (h.notes && h.notes.length ? '<p class="muted small">' + h.notes.map(esc).join(" ") + "</p>" : "") +
      (!steps.length ? '<p class="muted">Nada pendiente para hoy. Si querés, abrí ' + esc(UI().read || "Leggi") + " y leé algo que te guste.</p>" : "") +
      '<div class="row hoy-go">' + (nx
        ? '<button class="btn" id="hoystart">▶︎ ' + (doneN || h.run ? "Seguir: " + esc(short(nx.title)) : "Empezar") + "</button>"
        : steps.length ? '<span class="hoy-done">✓ Listo por hoy.</span><button class="btn ghost" id="hoymore">Otra tanda</button>' : "") + "</div>" +
      chestLine() + metaLine() + "</div>";
    return html;
  }
  function short(t) { t = String(t || ""); return t.length > 34 ? t.slice(0, 32) + "…" : t; }

  // The daily chest (xp is the game's currency): in sight when it can be opened.
  function chestLine() {
    var st = S(), E = root.Engine;
    if (!E) return "";
    var reached = E.todayXp(st) >= E.goalFor(st), open = st.chest === E.dayKey();
    return reached && !open ? '<p class="hoy-chest"><button class="btn gold pulse" id="chest">🎁 Abrir el cofre del día</button></p>' : "";
  }

  // Oggi's top: the single card of the first day, or the plan.
  function oggiTop() {
    var st = S();
    checkPhase();
    if (P()) P().snapshot(st, null);
    if (firstMode(st)) return { first: true, html: firstCard() };
    // During the course the percorso organises the day (its next mission is
    // on top of Oggi, app.js): the plan by minutes was clearer on paper than
    // in use (3.2).  After the exam there is no percorso: the maintenance plan.
    if (st.phase !== "mantenimiento") return { first: false, html: "" };
    return { first: false, html: hoyCard() + cierreCard() };
  }

  /* ------------------------------------------------------ tarjetas de hábito */

  var SNOOZE = { agenda: 3, ritorno: 1, reflect: 1, copia: 3, why: 2, semana: 3 };
  function addDays(n) { var d = new Date(); d.setDate(d.getDate() + n); return dk(d); }
  function before(a, b) {   // day key a earlier than b
    var p = function (k) { var x = String(k).split("-"); return Date.UTC(+x[0], +x[1] - 1, +x[2]); };
    return p(a) < p(b);
  }
  /* cands: [{id, html}] in priority order (the return first).  One a day:
     the one chosen stays the whole day; answered or put off, none more. */
  function pickHabit(cands) {
    var st = S(), h = hoy(st), today = dk();
    var byId = {};
    cands.forEach(function (c) { byId[c.id] = c; });
    if (h.card.dk === today) return h.card.id && byId[h.card.id] ? byId[h.card.id] : null;
    var c = cands.filter(function (x) { var until = h.snooze[x.id]; return !until || !before(today, until); })[0] || null;
    if (!c) return null;
    h.card = { dk: today, id: c.id };
    return c;
  }
  function habit(cands) {
    var c = pickHabit(cands);
    if (!c) return "";
    return c.html.replace(/<\/div>\s*$/, "") +
      '<span class="row habit-later"><button class="tab" data-hlater="' + esc(c.id) + '">Después</button></span></div>';
  }

  /* ------------------------------------------------------ post-curso */

  function checkPhase() {
    var st = S();
    if (st.phase) return;
    var ws = (st.weekStats || {})[52], ex = H.exam ? H.exam() : null;
    if ((ws && ws.bossPassed) || (ex && ex.passed)) {
      st.phase = "mantenimiento";
      st.phaseAt = Date.now();
      if (!st.simAt) st.simAt = Date.now();
      H.persist();
    }
  }
  function cierreCard() {
    var st = S();
    if (st.cierre && st.cierre.hide) return "";
    var y = yearNumbers();
    return '<div class="card cierre"><h2>🎓 Tu año de ' + esc(UI().langEs) + "</h2>" +
      '<table class="res"><tr><td>Horas de estudio</td><td>' + y.hours + "</td></tr>" +
      "<tr><td>Palabras en tu repaso</td><td>" + y.words + "</td></tr>" +
      "<tr><td>Jefes vencidos</td><td>" + y.bosses + " / 4</td></tr>" +
      (y.exam ? "<tr><td>Examen C1</td><td>" + y.exam + "</td></tr>" : "") + "</table>" +
      '<div class="row"><button class="btn" id="yearshare">📤 Compartir tu año</button><button class="tab" id="yearhide">Guardar para después</button></div></div>';
  }
  function yearNumbers() {
    var st = S(), Pr = P(), ex = H.exam ? H.exam() : null, ws = st.weekStats || {};
    var hrs = Pr ? Pr.hours(st) : { h: 0, measured: true };
    return {
      hours: String(hrs.h).replace(".", ",") + (hrs.measured ? " h" : " h (aprox.)"),
      words: (Pr ? Pr.wordCards(st) : 0).toLocaleString("es-AR"),
      bosses: [13, 26, 39, 52].filter(function (b) { return ws[b] && ws[b].bossPassed; }).length,
      exam: ex ? ex.avg + " %" + (ex.passed ? " · aprobado" : "") : ""
    };
  }
  function shareYear() {
    var LG = H.lg(), K = LG.card, U = UI();
    if (!K || typeof root.document === "undefined") return;
    var c = root.document.createElement("canvas"), W = 720, Hh = 400;
    c.width = W; c.height = Hh;
    var g = c.getContext("2d"), y = yearNumbers();
    K.frame(g, W, Hh);
    g.fillStyle = K.head.color || K.text; g.textAlign = "center";
    g.font = "bold 22px Georgia, serif";
    g.fillText((LG.brand + " · un año").toUpperCase(), W / 2, K.head.y);
    g.fillStyle = K.text; g.font = K.rank.font;
    g.fillText("C1 · " + U.langEs.toUpperCase(), W / 2, K.rank.y);
    g.font = "26px system-ui, sans-serif";
    g.fillText(y.hours + " · " + y.bosses + " jefes de 4", W / 2, K.lines[0]);
    g.fillText(y.words + " palabras", W / 2, K.lines[1]);
    g.font = "20px system-ui, sans-serif"; g.fillStyle = K.muted;
    g.fillText(y.exam ? "Examen C1: " + y.exam : "52 semanas, de cero a C1", W / 2, K.lines[2]);
    c.toBlob(function (blob) { H.share(blob, K.file + "un-ano.png", "Mi año de " + U.langEs); }, "image/png");
  }

  /* ------------------------------------------------------ el resultado */

  // On the result of a round started from the plan: the next step.
  function resultButton() {
    var st = S(), h = hoy(st);
    if (h.run) { h.fin[h.run] = true; h.run = null; H.persist(); }
    var nx = nextStep(h);
    return nx ? '<button class="btn" id="hoynext">▶︎ Sigue: ' + esc(short(nx.title)) + "</button>"
              : '<button class="btn" id="hoyback">✓ Plan de hoy hecho</button>';
  }

  /* ------------------------------------------------------ cableado */

  function wire(screen) {
    if (!H || typeof root.document === "undefined") return;
    if (screen === "inicio") { wireOnboard(); return; }
    var doc = root.document, st = S(), h = hoy(st);
    var on = function (id, fn) { var b = doc.getElementById(id); if (b) b.onclick = fn; };
    var find = function (id) { return (h.steps || []).filter(function (s) { return s.id === id; })[0]; };
    doc.querySelectorAll("[data-hmin]").forEach(function (b) {
      b.onclick = function () { h.min = +b.dataset.hmin; H.persist(); H.render(); };
    });
    doc.querySelectorAll("[data-hcheck]").forEach(function (b) {
      b.onclick = function () {
        var id = b.dataset.hcheck;
        if (h.tick[id]) delete h.tick[id]; else h.tick[id] = true;
        H.persist(); H.render();
      };
    });
    doc.querySelectorAll("[data-hgo]").forEach(function (b) {
      b.onclick = function () { var s = find(b.dataset.hgo); if (s) run(s); };
    });
    on("hoystart", function () { var s = nextStep(h); if (s) run(s); });
    on("hoynext", function () { var s = nextStep(h); if (s) run(s); else H.go("oggi"); });
    on("hoyback", function () { H.go("oggi"); });
    on("hoymore", function () {
      h.extra = (h.extra || 0) + 1; h.tick = {}; h.fin = {};
      plan(true); H.render();
    });
    on("hoyfirst", function () {
      var w = H.week(), nm = H.nextMission(w);
      if (nm) H.startMission(nm.kind, nm.arg, w.week);
    });
    on("toprog2", function () { H.show("progreso"); });
    doc.querySelectorAll("[data-hlater]").forEach(function (b) {
      b.onclick = function () {
        var id = b.dataset.hlater;
        h.snooze[id] = addDays(SNOOZE[id] || 1);
        h.card = { dk: dk(), id: null };
        H.persist(); H.render();
      };
    });
    on("yearshare", shareYear);
    on("yearhide", function () { st.cierre = { hide: Date.now() }; H.persist(); H.render(); });
    var mas = doc.getElementById("masoggi");
    if (mas) mas.addEventListener("toggle", function () { masOpen = mas.open; });
  }
  var masOpen = false;
  function moreOpen() { return masOpen; }

  function owns(s) { return s === "inicio"; }
  function render(s) { return s === "inicio" ? renderOnboard() : ""; }
  // At start: the three screens for a new learner; #hoy opens the plan.
  function boot(view) {
    if (needs(S())) { view.screen = view.tab = "inicio"; return "inicio"; }
    return null;
  }
  function attach(host) { H = host; }

  var api = { attach: attach, owns: owns, render: render, wire: wire, boot: boot, needs: needs, firstMode: firstMode,
              oggiTop: oggiTop, habit: habit, pickHabit: pickHabit, resultButton: resultButton, isDone: isDone,
              plan: plan, hoy: hoy, checkPhase: checkPhase, shareYear: shareYear, moreOpen: moreOpen, SNOOZE: SNOOZE };
  if (typeof module === "object" && module.exports) module.exports = api;
  root.Inicio = api;
})(typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : this);
