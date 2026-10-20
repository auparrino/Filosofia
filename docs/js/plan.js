/*
 * «Hoy»: el plan del día, armado por minutos.
 *
 * Una función pura, sin DOM (se prueba en node: tools/lib/test_plan.js):
 *
 *   Plan.today(course, state, minutos, ctx)
 *
 * arma el día para 5, 15 o 30 minutos con cuatro bloques, en este orden:
 *
 *   1. lo vencido del repaso, nunca más de la mitad del tiempo;
 *   2. el próximo paso de la semana (la misión siguiente del percorso);
 *   3. un bloque de input de la semana (una lectura o una escucha que
 *      falta, si no la Biblioteca o Ascolto facile), contado en minutos;
 *   4. un bloque de producción cuando la cuerda de output viene baja
 *      (o cuando el alumno pidió «más escritura» en el cierre semanal).
 *
 * Si sobra tiempo, otra misión que entre o más repaso.  En el modo
 * mantenimiento (después del examen de la semana 52) el eje cambia:
 * repaso a meses, lectura extensiva, escuchas largas, una tarea al azar
 * de las del tramo C1 y un simulacro del examen cada tres meses.
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
 *   strands    Engine.strandsLast(state, 7)
 *   change     lo que el alumno dijo que cambia esta semana (cierre semanal)
 *   inputs     { biblio: bool, facile: n lecturas hechas, btr: bool, pausa: bool }
 *   days       días por semana que el alumno piensa estudiar
 *   maint      para el mantenimiento: { reads: [{id, title, words}], asc: [{week, title}],
 *              scr: [{week, title}], lastTask, lastSim, since }
 */
(function (root) {
  "use strict";

  var DURATIONS = [5, 15, 30];

  // Seconds per item type in the simulation of the year (sim_carriera.js).
  var SEC = { choice: 8, typed: 20, intro: 6, word: 6, card: 10, guess: 6, hunt: 40, flash: 8, tiles: 14, listen: 12, dictation: 25 };
  // A review card, with the feedback read: the mix of the queue (two
  // recognitions for one written answer) plus three seconds of feedback.
  var CARD_SEC = Math.round((2 * SEC.choice + SEC.typed) / 3 + 3);      // 15

  // Minutes of one sitting of each mission of the week (weekPlan kinds),
  // before calibration.  Measured on the simulation: a lesson session is
  // up to twelve steps; a round, twelve items; Dominala, thirty.
  var MISSION_MIN = {
    lez: 4, vocab: 4, play: 4, play2: 7, scrivi: 8, scene: 3, suoni: 4, dictogloss: 8,
    ponte: 3, falsi: 3, capire: 3, "b-forme": 4, "b-tr": 4, "b-gap": 4, duello: 3,
    parla: 8, debil: 5, storia: 6, "tr-asc": 10, radio: 7, "tr-scr": 25, review: 0, micro: 0, fuera: 15,
    pausa: 3, biblio: 8, facile: 6, boss: 8, esame: 45
  };
  // Kinds whose time is items answered: the learner's own speed moves them.
  var ITEMS = { vocab: 1, play: 1, play2: 1, scene: 1, suoni: 1, ponte: 1, falsi: 1, capire: 1,
                "b-forme": 1, "b-tr": 1, "b-gap": 1, duello: 1, debil: 1, pausa: 1, boss: 1 };
  // Input: reading, listening (the Radio series of weeks 6-25 too, and the
  // material out of the app of fuera.js).  Output: writing.
  var INPUT = { ep: 1, "tr-asc": 1, radio: 1, dictogloss: 1, biblio: 1, facile: 1, fuera: 1 };
  var OUTPUT = { scrivi: 1, "tr-scr": 1, parla: 1, "b-tr": 1 };
  // Words per minute reading a text of the level, a second language (and
  // with the glosses): slow at the start, near native at C1.
  var WPM = { A1: 70, A2: 90, B1: 110, B2: 130, C1: 150 };

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

  function readMinutes(words, level) {
    var wpm = WPM[level] || 100;
    return Math.max(2, Math.round((words || 250) / wpm + 1.5));
  }

  /* Minutes of a step: {kind, words, n (cards), weekLevel, boss, exam}. */
  function minutesFor(step, state, f) {
    f = f || factor(state);
    var k = step.kind;
    if (k === "review" || k === "micro") return Math.max(1, Math.round((step.n || 0) * secPerCard(state) / 60));
    if (k === "ep") return readMinutes(step.words, step.level);
    if (k === "play" && step.exam) return MISSION_MIN.esame;
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
    var week = ctx.week || {}, lvl = levelOf(week);
    var missions = (ctx.missions || []).map(function (m) {
      return Object.assign({ level: lvl, boss: !!week.boss, exam: !!week.boss && week.week === 52 }, m, { mission: true });
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

    // 2. the next step of the week (a mission that is not reading or listening)
    var open = missions.filter(function (m) { return !m.done; });
    // The weekend is light (review and input) once the week's days are done.
    var weekend = now.getDay() === 0 || now.getDay() === 6;
    var restDay = weekend && (ctx.days || 5) <= 5 && minutes < 30 && (ctx.daysDone || 0) >= (ctx.days || 5);
    var steps2 = open.filter(function (m) { return !INPUT[m.kind] && !(OUTPUT[m.kind] && m.kind !== "scrivi" && m.opt); });
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
    if (restDay) notes.push("Fin de semana: repaso y algo para leer o escuchar. Si tenés media hora, sumo una misión.");

    // 3. input: what the week still has to read or hear, else the Library or Ascolto facile
    var inOpen = open.filter(function (m) { return INPUT[m.kind] && !taken[key(m)]; });
    if (change === "escucha") inOpen.sort(function (a, b) { return (a.kind === "ep") - (b.kind === "ep"); });
    inOpen.sort(function (a, b) { return (a.opt ? 1 : 0) - (b.opt ? 1 : 0); });
    var inp = inOpen.filter(function (m) { return est(m) <= Math.max(left(), minutes >= 15 ? 180 : 0) * 1.3; })[0] || null;
    if (inp) add(stepOf(inp, "input", { input: true }));
    else if (left() >= 150 || steps.length === 0) {
      var room = Math.max(3, Math.min(10, Math.round(left() / 60)));
      if (inputs.facile && (change === "escucha" || !inputs.biblio)) add({ id: "in:facile", kind: "facile", arg: null, block: "input", input: true, ico: "🎧",
        title: "Ascolto facile: lecturas que ya hiciste, solo audio", min: room });
      else if (inputs.biblio) add({ id: "in:biblio", kind: "biblio", arg: null, block: "input", input: true, ico: "📚",
        title: "Biblioteca: unas páginas de tu libro", min: room });
    }

    // 4. output, when it comes low this week (or was asked for)
    var s = ctx.strands || {}, tot = (s.input || 0) + (s.output || 0) + (s.forma || 0) + (s.fluidez || 0);
    var lowOut = change === "escritura" ||
      (tot >= 60 && (s.output || 0) / tot < 0.15 && ["input", "forma", "fluidez"].every(function (k) { return (s.output || 0) <= (s[k] || 0); }));
    if (lowOut && left() >= 180) {
      var outM = open.filter(function (m) { return OUTPUT[m.kind] && !taken[key(m)] && est(m) <= left() * 1.2; })[0];
      if (outM) add(stepOf(outM, "output", { output: true }));
      else if (inputs.btr) add({ id: "out:b-tr", kind: "b-tr", arg: null, block: "output", output: true, ico: "✍️",
        title: "Traducí al " + (ctx.langName || "idioma") + ": ocho oraciones con corrección", min: minutesFor({ kind: "b-tr" }, state, f) });
    }

    // 5. time left: another mission that fits, then more review, then a pause
    var guard = 0;
    while (left() >= 180 && guard++ < 4) {
      var more = open.filter(function (m) { return !taken[key(m)] && !INPUT[m.kind] && !m.opt && est(m) <= left() * 1.15; })[0];
      if (more && !restDay) { add(stepOf(more, "paso")); continue; }
      var rest = (ctx.due || 0) - (rv ? rv.n : 0);
      if (rest > 0 && !taken["review2:"]) {
        var r2 = reviewStep(state, rest, left(), "rev2");
        if (r2) { r2.kind = r2.kind === "review" ? "review" : "micro"; r2.title = r2.title.replace("Repaso", "Más repaso"); add(r2); taken["review2:"] = 1; continue; }
      }
      if (restDay && !taken["biblio:"] && !taken["facile:"] && (inputs.biblio || inputs.facile)) {
        add(inputs.biblio ? { id: "in:biblio", kind: "biblio", arg: null, block: "input", input: true, ico: "📚", title: "Biblioteca: unas páginas de tu libro", min: Math.min(10, Math.round(left() / 60)) }
                          : { id: "in:facile", kind: "facile", arg: null, block: "input", input: true, ico: "🎧", title: "Ascolto facile: lecturas que ya hiciste, solo audio", min: Math.min(8, Math.round(left() / 60)) });
        continue;
      }
      if (inputs.pausa && !taken["pausa:"]) { add({ id: "pausa", kind: "pausa", arg: null, block: "extra", ico: "☕", title: "Pausa: la semana mezclada", min: minutesFor({ kind: "pausa" }, state, f) }); continue; }
      break;
    }
    if (!steps.length && inputs.pausa) add({ id: "pausa", kind: "pausa", arg: null, block: "extra", ico: "☕", title: "Pausa: la semana mezclada", min: 3 });

    return { minutes: minutes, total: steps.reduce(function (a, x) { return a + x.min; }, 0), steps: steps, notes: notes, phase: "curso" };
  }

  /* After the course: keep it alive.  Review months apart, extensive
     reading, long listenings, a task now and then, a mock exam every three
     months (A E11, B 4.6). */
  function maintenance(state, minutes, ctx) {
    var now = ctx.now || new Date(), di = dayIndex(now), m = ctx.maint || {};
    var budget = minutes * 60, used = 0, steps = [], notes = [];
    var add = function (s) { steps.push(s); used += s.min * 60; };
    var rv = reviewStep(state, ctx.due || 0, Math.floor(budget / 2));
    if (rv) add(rv);
    var DAY = 864e5, t = now.getTime();
    var simDue = !m.lastSim || t - m.lastSim > 90 * DAY;
    var taskDue = !m.lastTask || t - m.lastTask > 6 * DAY;
    var pick = function (list) { return list && list.length ? list[di % list.length] : null; };
    if (simDue && minutes >= 30) {
      add({ id: "mt:sim", kind: "esame", arg: null, block: "input", ico: "🎓", title: "Simulacro del examen C1 (cada tres meses)", min: MISSION_MIN.esame });
    } else {
      var asc = pick(m.asc), rd = pick(m.reads), scr = pick(m.scr);
      if (taskDue && scr && minutes >= 30) add({ id: "mt:scr:" + scr.week, kind: "tr-scr", arg: String(scr.week), block: "output", output: true,
        ico: "🖋️", title: "Tarea al azar: " + scr.title, min: MISSION_MIN["tr-scr"] });
      if (di % 2 === 0 && asc) add({ id: "mt:asc:" + asc.week, kind: "tr-asc", arg: String(asc.week), block: "input", input: true, ico: "🎧",
        title: "Escucha larga: " + asc.title, min: MISSION_MIN["tr-asc"] });
      else if (ctx.inputs && ctx.inputs.biblio) add({ id: "mt:biblio", kind: "biblio", arg: null, block: "input", input: true, ico: "📚",
        title: "Lectura extensiva: tu libro de la Biblioteca", min: Math.max(4, Math.min(12, Math.round((budget - used) / 60))) });
      else if (rd) add({ id: "mt:ep:" + rd.id, kind: "ep", arg: rd.id, block: "input", input: true, ico: "📰",
        title: "Lectura larga: " + rd.title, min: readMinutes(rd.words, "C1") });
      if (budget - used >= 8 * 60 && asc && di % 2 !== 0 && !steps.some(function (x) { return x.kind === "tr-asc"; })) add({ id: "mt:asc:" + asc.week, kind: "tr-asc", arg: String(asc.week), block: "input", input: true, ico: "🎧",
        title: "Escucha larga: " + asc.title, min: MISSION_MIN["tr-asc"] });
    }
    if (simDue && minutes < 30) notes.push("Toca un simulacro del examen (unos 45 minutos): elegí 30 minutos un día con tiempo.");
    if (!steps.length && ctx.inputs && ctx.inputs.biblio) add({ id: "mt:biblio", kind: "biblio", arg: null, block: "input", input: true, ico: "📚", title: "Lectura extensiva: tu libro", min: minutes });
    return { minutes: minutes, total: steps.reduce(function (a, x) { return a + x.min; }, 0), steps: steps, notes: notes, phase: "mantenimiento" };
  }

  var api = { DURATIONS: DURATIONS, SEC: SEC, CARD_SEC: CARD_SEC, MISSION_MIN: MISSION_MIN, INPUT: INPUT, OUTPUT: OUTPUT,
              today: today, secPerCard: secPerCard, factor: factor, minutesFor: minutesFor, readMinutes: readMinutes,
              inputTarget: inputTarget, levelOf: levelOf, dayIndex: dayIndex };
  if (typeof module === "object" && module.exports) module.exports = api;
  root.Plan = api;
})(typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : this);
