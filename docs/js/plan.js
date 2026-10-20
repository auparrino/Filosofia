/*
 * «Hoy»: el plan del día, armado por minutos.
 *
 * Una función pura, sin DOM (se prueba en node: tools/lib/test_plan.js):
 *
 *   Plan.today(course, state, minutos, ctx)
 *
 * arma el día para 5, 15 o 30 minutos con tres bloques, en este orden:
 *
 *   1. lo vencido del repaso, nunca más de la mitad del tiempo;
 *   2. el próximo paso de la semana (la misión siguiente del percorso);
 *   3. un bloque de lectura (la Biblioteca), contado en minutos.
 *
 * Si sobra tiempo, otra misión que entre o más repaso.  En el modo
 * mantenimiento (después del examen final) el eje cambia: repaso a meses
 * y lectura extensiva.
 *
 * Los minutos salen de los segundos por tipo de ítem que usa la
 * simulación del año (tools/it/sim_carriera.js: SEC), calibrados con los
 * tiempos reales del alumno: el 7.º campo de cada fila de state.log son los
 * segundos que tardó en responder.
 *
 * ctx (lo arma inicio.js con lo que sabe app.js; todo es opcional):
 *   now        Date
 *   due        fichas vencidas del repaso (Drills.dueCount)
 *   week       la semana en curso (course.weeks[unlocked - 1])
 *   missions   el plan de la semana (weekPlan): [{kind, arg, title, ico, done, opt, words}]
 *   change     lo que el alumno dijo que cambia esta semana (cierre semanal)
 *   inputs     { biblio: bool, pausa: bool }
 *   days       días por semana que el alumno piensa estudiar
 */
(function (root) {
  "use strict";

  var DURATIONS = [5, 15, 30];

  // Seconds per item type in the simulation of the year (sim_carriera.js).
  var SEC = { choice: 8, typed: 20, word: 6, card: 10, flash: 8, tiles: 14, listen: 12 };
  // A review card, with the feedback read: the mix of the queue (two
  // recognitions for one written answer) plus three seconds of feedback.
  var CARD_SEC = Math.round((2 * SEC.choice + SEC.typed) / 3 + 3);      // 15

  // Minutes of one sitting of each mission of the week (weekPlan kinds),
  // before calibration.  Measured on the simulation: a lesson session is
  // up to twelve steps; a round, twelve items; Dominala, thirty.
  var MISSION_MIN = {
    lez: 4, vocab: 4, play: 4, play2: 7, duello: 3, debil: 5, review: 0, micro: 0,
    pausa: 3, biblio: 8, boss: 8
  };
  // Kinds whose time is items answered: the learner's own speed moves them.
  var ITEMS = { vocab: 1, play: 1, play2: 1, duello: 1, debil: 1, pausa: 1, boss: 1 };

  // Input minutes a week, by level (A E6: 40 in A1, 90 in B1, 150 in B2+).
  function inputTarget(level) {
    var l = String(level || "A1").slice(0, 2).toUpperCase();
    return l === "A1" ? 40 : l === "A2" ? 60 : l === "B1" ? 90 : 150;
  }
  function levelOf(week) { return String((week && week.level) || "A1").slice(0, 2).toUpperCase(); }

  /* The learner's real seconds per review card: the median answer time of
     the last 300 reviews (the 7th field of state.log) plus the feedback.
     Needs 30 timed answers; before that, the simulation's number. */
  function secPerCard(state) {
    var rows = ((state && state.log) || []).slice(-300)
      .map(function (x) { return Array.isArray(x) ? +x[6] : NaN; })
      .filter(function (s) { return isFinite(s) && s > 0 && s < 600; });
    if (rows.length < 30) return CARD_SEC;
    rows.sort(function (a, b) { return a - b; });
    var med = rows[Math.floor(rows.length / 2)];
    return Math.max(6, Math.min(40, Math.round(med + 3)));
  }
  // How much slower (> 1) or faster (< 1) than the simulated learner.
  function factor(state) {
    return Math.max(0.7, Math.min(1.8, secPerCard(state) / CARD_SEC));
  }

  /* Minutes of a step: {kind, n (cards), boss}. */
  function minutesFor(step, state, f) {
    f = f || factor(state);
    var k = step.kind;
    if (k === "review" || k === "micro") return Math.max(1, Math.round((step.n || 0) * secPerCard(state) / 60));
    if (k === "play" && step.boss) return Math.round(MISSION_MIN.boss * f);
    var m = MISSION_MIN[k] != null ? MISSION_MIN[k] : 5;
    if (step.min) m = step.min;
    return Math.max(1, Math.round(ITEMS[k] ? m * f : m));
  }

  function dayIndex(now) {
    var d = now || new Date();
    return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5);
  }

  function stepOf(m, block, extra) {
    var s = { id: (block === "paso" || block === "input" || block === "output" ? "m:" : "") + m.kind + ":" + (m.arg == null ? "" : m.arg),
              kind: m.kind, arg: m.arg == null ? null : m.arg, title: m.title, ico: m.ico || "▶︎", block: block,
              mission: !!m.mission };
    Object.keys(extra || {}).forEach(function (k) { s[k] = extra[k]; });
    return s;
  }

  /* The review block: the whole queue of the day (20) when it fits in half
     the time, five cards otherwise.  Returns a step or null. */
  function reviewStep(state, due, cap, tag) {
    if (!due) return null;
    var spc = secPerCard(state);
    var n = Math.min(due, 20);
    var kind = "review";
    if (n * spc > cap || due <= 5) { n = Math.min(due, 5); kind = "micro"; }
    if (n * spc > cap && cap < 60) return null;
    var st = { id: (tag || "rev") + ":" + kind, kind: kind, arg: null, n: n, block: "repaso", ico: "🔁",
               title: (kind === "micro" ? "Repaso corto · " : "Repaso · ") + n + (n === 1 ? " ficha" : " fichas") };
    st.min = minutesFor(st, state);
    return st;
  }

  /* ---------------------------------------------------------------- hoy */

  function today(course, state, minutes, ctx) {
    ctx = ctx || {};
    state = state || {};
    minutes = DURATIONS.indexOf(+minutes) >= 0 ? +minutes : 15;
    if (state.phase === "mantenimiento") return maintenance(state, minutes, ctx);
    var now = ctx.now || new Date(), f = factor(state);
    var budget = minutes * 60, used = 0, steps = [], notes = [];
    var week = ctx.week || {};
    var missions = (ctx.missions || []).map(function (m) {
      return Object.assign({ boss: !!week.boss }, m, { mission: true });
    });
    var inputs = ctx.inputs || {};
    var change = ctx.change || "";
    var taken = {};
    var key = function (m) { return m.kind + ":" + (m.arg == null ? "" : m.arg); };
    var add = function (s) { s.min = s.min || minutesFor(s, state, f); steps.push(s); used += s.min * 60; taken[key(s)] = 1; return s; };
    var left = function () { return budget - used; };
    var est = function (m) { return minutesFor(m, state, f) * 60; };

    // 1. the review: at most half the time (60 % if the learner asked for more review)
    var cap = Math.floor(budget * (change === "repaso" ? 0.6 : 0.5));
    var rv = reviewStep(state, ctx.due || 0, cap);
    if (rv) add(rv);

    // 2. the next step of the week
    var open = missions.filter(function (m) { return !m.done; });
    // The weekend is light (review and input) once the week's days are done.
    var weekend = now.getDay() === 0 || now.getDay() === 6;
    var restDay = weekend && (ctx.days || 5) <= 5 && minutes < 30 && (ctx.daysDone || 0) >= (ctx.days || 5);
    var steps2 = open;
    var req = steps2.filter(function (m) { return !m.opt; }), firstReq = req[0] || steps2[0] || null;
    var paso = null;
    if (!restDay && firstReq) {
      // what fits: the first mission, or the next one that fits in what is
      // left (a long task waits for a day with more time); with 15 minutes
      // or more, the first one anyway
      var fits = function (m) { return est(m) <= Math.max(left(), 240) * 1.3; };
      paso = req.filter(fits)[0] || steps2.filter(fits)[0] || (minutes >= 15 ? firstReq : null);
      if (paso) add(stepOf(paso, "paso"));
    }
    if (restDay) notes.push("Fin de semana: repaso y algo para leer. Si tenés media hora, sumo una misión.");

    // 3. input: the Library, when there is time
    if ((left() >= 150 || steps.length === 0) && inputs.biblio) {
      add({ id: "in:biblio", kind: "biblio", arg: null, block: "input", input: true, ico: "📚",
            title: "Biblioteca: unas páginas de tu libro", min: Math.max(3, Math.min(10, Math.round(left() / 60))) });
    }

    // 4. time left: another mission that fits, then more review, then a pause
    var guard = 0;
    while (left() >= 180 && guard++ < 4) {
      var more = open.filter(function (m) { return !taken[key(m)] && !m.opt && est(m) <= left() * 1.15; })[0];
      if (more && !restDay) { add(stepOf(more, "paso")); continue; }
      var rest = (ctx.due || 0) - (rv ? rv.n : 0);
      if (rest > 0 && !taken["review2:"]) {
        var r2 = reviewStep(state, rest, left(), "rev2");
        if (r2) { r2.kind = r2.kind === "review" ? "review" : "micro"; r2.title = r2.title.replace("Repaso", "Más repaso"); add(r2); taken["review2:"] = 1; continue; }
      }
      if (restDay && !taken["biblio:"] && inputs.biblio) {
        add({ id: "in:biblio", kind: "biblio", arg: null, block: "input", input: true, ico: "📚", title: "Biblioteca: unas páginas de tu libro", min: Math.min(10, Math.round(left() / 60)) });
        continue;
      }
      if (inputs.pausa && !taken["pausa:"]) { add({ id: "pausa", kind: "pausa", arg: null, block: "extra", ico: "☕", title: "Pausa: la semana mezclada", min: minutesFor({ kind: "pausa" }, state, f) }); continue; }
      break;
    }
    if (!steps.length && inputs.pausa) add({ id: "pausa", kind: "pausa", arg: null, block: "extra", ico: "☕", title: "Pausa: la semana mezclada", min: 3 });

    return { minutes: minutes, total: steps.reduce(function (a, x) { return a + x.min; }, 0), steps: steps, notes: notes, phase: "curso" };
  }

  /* After the course: keep it alive.  Review months apart and extensive
     reading (A E11, B 4.6). */
  function maintenance(state, minutes, ctx) {
    var budget = minutes * 60, used = 0, steps = [];
    var add = function (s) { steps.push(s); used += s.min * 60; };
    var rv = reviewStep(state, ctx.due || 0, Math.floor(budget / 2));
    if (rv) add(rv);
    if (ctx.inputs && ctx.inputs.biblio) add({ id: "mt:biblio", kind: "biblio", arg: null, block: "input", input: true, ico: "📚",
      title: "Lectura extensiva: tu libro de la Biblioteca", min: Math.max(4, Math.min(12, Math.round((budget - used) / 60))) });
    return { minutes: minutes, total: steps.reduce(function (a, x) { return a + x.min; }, 0), steps: steps, notes: [], phase: "mantenimiento" };
  }

  var api = { DURATIONS: DURATIONS, SEC: SEC, CARD_SEC: CARD_SEC, MISSION_MIN: MISSION_MIN,
              today: today, secPerCard: secPerCard, factor: factor, minutesFor: minutesFor,
              inputTarget: inputTarget, levelOf: levelOf, dayIndex: dayIndex };
  if (typeof module === "object" && module.exports) module.exports = api;
  root.Plan = api;
})(typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : this);
