/* «Hoy» y «Tu progreso» (docs/js/plan.js, docs/js/progreso.js, docs/js/inicio.js):
   el plan del día por minutos, el modo mantenimiento, la calibración con los
   tiempos reales, el ritmo y las fechas de los jefes, la serie semanal, la
   cuota de palabras recalibrada y el primer arranque.  En los dos idiomas.
   Run: node tools/lib/test_plan.js */
"use strict";
var pack = require("./pack.js");

var fails = 0, checks = 0;
function ok(cond, what) {
  checks++;
  if (!cond) { fails++; console.log("FAIL " + what); }
}
var DAY = 864e5;
// A Wednesday at 10: no weekend rules unless asked.
var WED = new Date(2026, 8, 23, 10, 0, 0);
var SAT = new Date(2026, 8, 26, 10, 0, 0);

function missionsOf(w) {
  var out = [];
  for (var k = 0; k < 3; k++) out.push({ kind: "lez", arg: String(k), title: "Lección " + (k + 1) + "/3", ico: "📘", done: false });
  out.push({ kind: "vocab", title: "Palabras de la semana", ico: "📚", done: false });
  out.push({ kind: "play", title: "Superá la semana", ico: "🎯", done: false });
  out.push({ kind: "scrivi", title: "Scrivi", ico: "✍️", done: false });
  out.push({ kind: "ep", arg: "m1", title: "Lectura: Martín", ico: "🧳", done: false, words: 240 });
  out.push({ kind: "dictogloss", title: "Dictogloss", ico: "📝", done: false });
  out.push({ kind: "play2", title: "Dominala", ico: "🏆", done: false });
  void w;
  return out;
}
function sum(p) { return p.steps.reduce(function (a, s) { return a + s.min; }, 0); }
function kinds(p) { return p.steps.map(function (s) { return s.kind; }); }

pack.LANGS.forEach(function (code) {
  var ctx = pack(code, { upTo: "app.js" });
  var Plan = ctx.Plan, Pr = ctx.Progreso, Ini = ctx.Inicio, E = ctx.Engine;
  var tag = "[" + code + "] ";
  ok(!!Plan && !!Pr && !!Ini, tag + "cargan Plan, Progreso e Inicio (sin DOM)");
  if (!Plan || !Pr || !Ini) return;
  var course = pack.data(code, "course.json");
  var w = course.weeks[4];
  var base = function (extra) {
    return Object.assign({ now: WED, due: 40, week: w, missions: missionsOf(w), strands: { input: 50, output: 40, forma: 60, fluidez: 30 },
                           inputs: { biblio: true, facile: 3, btr: true, pausa: true }, days: 5, daysDone: 2 }, extra || {});
  };
  var st = E.blankSave();

  /* ------------------------------------------------ the three durations */
  [5, 15, 30].forEach(function (m) {
    var p = Plan.today(course, st, m, base());
    var rev = p.steps.filter(function (s) { return s.block === "repaso"; }).reduce(function (a, s) { return a + s.min; }, 0);
    ok(p.steps.length >= 1, tag + m + " min: hay pasos");
    ok(rev <= m / 2 + 0.01, tag + m + " min: el repaso no pasa de la mitad (" + rev + ")");
    ok(p.steps[0].block === "repaso", tag + m + " min: lo vencido primero");
    ok(sum(p) <= m * 1.35 + 2, tag + m + " min: el total se acerca a lo pedido (" + sum(p) + ")");
    ok(sum(p) >= Math.min(m * 0.6, 4), tag + m + " min: el total no queda corto (" + sum(p) + ")");
    ok(p.total === sum(p), tag + m + " min: total = suma de los pasos");
    var ids = p.steps.map(function (s) { return s.id; });
    ok(ids.length === new Set(ids).size, tag + m + " min: sin pasos repetidos: " + ids.join(", "));
  });
  var p15 = Plan.today(course, st, 15, base());
  ok(kinds(p15).indexOf("lez") >= 0, tag + "15 min: el paso siguiente de la semana (la lección)");
  ok(p15.steps.some(function (s) { return s.block === "input"; }), tag + "15 min: un bloque de input");
  ok(p15.steps.filter(function (s) { return s.kind === "ep"; }).length === 1, tag + "15 min: la lectura que falta es el input");
  var p30 = Plan.today(course, st, 30, base());
  ok(p30.steps.filter(function (s) { return s.block === "paso"; }).length >= 2, tag + "30 min: entra más de una misión");
  ok(Plan.today(course, st, 7, base()).minutes === 15, tag + "una duración desconocida vale 15");

  // the review: 20 cards if they fit in half, five if not; none without due
  ok(Plan.today(course, st, 5, base()).steps[0].kind === "micro", tag + "5 min: repaso corto (5 fichas)");
  ok(Plan.today(course, st, 15, base()).steps[0].kind === "review", tag + "15 min: el repaso del día (20)");
  ok(Plan.today(course, st, 15, base({ due: 0 })).steps.every(function (s) { return s.block !== "repaso"; }), tag + "sin vencidas, sin repaso");

  // input: when the week's readings are done, the Library or Ascolto facile
  var noIn = missionsOf(w).map(function (m) { return Object.assign({}, m, { done: m.kind === "ep" || m.kind === "dictogloss" }); });
  var pb = Plan.today(course, st, 15, base({ missions: noIn }));
  ok(kinds(pb).indexOf("biblio") >= 0, tag + "sin lecturas pendientes: la Biblioteca");
  ok(kinds(Plan.today(course, st, 15, base({ missions: noIn, inputs: { biblio: false, facile: 3, pausa: true } }))).indexOf("facile") >= 0,
     tag + "sin Biblioteca: Ascolto facile");
  ok(kinds(Plan.today(course, st, 15, base({ missions: noIn, change: "escucha" }))).indexOf("facile") >= 0, tag + "«más escucha»: Ascolto facile primero");

  // output when it comes low (or asked for)
  var low = { input: 200, output: 5, forma: 300, fluidez: 80 };
  var noScrivi = missionsOf(w).map(function (m) { return Object.assign({}, m, { done: m.kind === "scrivi" }); });
  ok(Plan.today(course, st, 30, base({ strands: low })).steps.some(function (s) { return s.block === "output"; }), tag + "output bajo: un bloque de producción");
  ok(kinds(Plan.today(course, st, 30, base({ strands: low, missions: noScrivi }))).indexOf("b-tr") >= 0, tag + "output bajo sin Scrivi pendiente: traducir");
  ok(!Plan.today(course, st, 15, base()).steps.some(function (s) { return s.block === "output"; }), tag + "output parejo: sin bloque de producción");
  ok(Plan.today(course, st, 30, base({ change: "escritura", missions: noScrivi })).steps.some(function (s) { return s.block === "output"; }), tag + "«más escritura»: producción");

  // the weekend is light once the week's days are done; not before
  ok(!Plan.today(course, st, 15, base({ now: SAT, daysDone: 5 })).steps.some(function (s) { return s.block === "paso"; }), tag + "sábado con la semana cumplida: sin misión");
  ok(Plan.today(course, st, 15, base({ now: SAT, daysDone: 2 })).steps.some(function (s) { return s.block === "paso"; }), tag + "sábado con días pendientes: con misión");

  // a long task waits for a day with time, with 5 minutes
  var onlyTask = [{ kind: "tr-scr", arg: "30", title: "Tarea", ico: "🖋️", done: false }, { kind: "play", title: "Superá", ico: "🎯", done: false }];
  var p5 = Plan.today(course, st, 5, base({ missions: onlyTask, due: 0 }));
  ok(kinds(p5).indexOf("tr-scr") < 0 && kinds(p5).indexOf("play") >= 0, tag + "5 min: la tarea larga espera, entra una ronda: " + kinds(p5).join(","));

  /* ------------------------------------------------ calibration */
  ok(Plan.secPerCard(st) === Plan.CARD_SEC, tag + "sin tiempos: los segundos de la simulación");
  var slow = E.blankSave();
  for (var i = 0; i < 60; i++) slow.log.push(["x" + i, 1000 + i, 3, 1, 1, "g", 25]);
  ok(Plan.secPerCard(slow) === 28, tag + "con tiempos: la mediana más la devolución (" + Plan.secPerCard(slow) + ")");
  ok(Plan.factor(slow) > 1.5, tag + "un alumno lento: factor > 1,5");
  var vocabSlow = Plan.minutesFor({ kind: "vocab" }, slow), vocabBase = Plan.minutesFor({ kind: "vocab" }, st);
  ok(vocabSlow > vocabBase, tag + "los minutos de una sesión crecen con el alumno lento (" + vocabBase + " → " + vocabSlow + ")");
  ok(Plan.minutesFor({ kind: "lez" }, slow) === Plan.minutesFor({ kind: "lez" }, st), tag + "la lección no depende del tiempo de respuesta");
  ok(Plan.readMinutes(900, "C1") > Plan.readMinutes(200, "A1"), tag + "leer 900 palabras lleva más que 200");
  ok(Plan.inputTarget("A1") === 40 && Plan.inputTarget("B1") === 90 && Plan.inputTarget("B2") === 150 && Pr.inputTarget("C1") === 150, tag + "minutos de input por nivel");

  /* ------------------------------------------------ maintenance */
  var mt = E.blankSave(); mt.phase = "mantenimiento";
  var maint = { reads: [{ id: "l1", title: "Una lectura larga", words: 700 }], asc: [{ week: 30, title: "Una escucha" }, { week: 31, title: "Otra" }],
                scr: [{ week: 30, title: "Carta formal" }], lastTask: 0, lastSim: WED.getTime() - 10 * DAY };
  var m30 = Plan.today(course, mt, 30, base({ maint: maint }));
  ok(m30.phase === "mantenimiento", tag + "mantenimiento: otra fase");
  ok(kinds(m30).indexOf("lez") < 0 && kinds(m30).indexOf("play") < 0, tag + "mantenimiento: sin misiones del curso");
  ok(kinds(m30).indexOf("tr-scr") >= 0, tag + "mantenimiento: una tarea al azar (hace más de 6 días)");
  ok(sum(m30) <= 36, tag + "mantenimiento 30 min: cerca de lo pedido (" + sum(m30) + ")");
  var m15 = Plan.today(course, mt, 15, base({ maint: maint }));
  ok(m15.steps.some(function (s) { return s.block === "input"; }), tag + "mantenimiento 15 min: lectura o escucha larga");
  var simOld = Object.assign({}, maint, { lastSim: WED.getTime() - 100 * DAY });
  ok(kinds(Plan.today(course, mt, 30, base({ maint: simOld }))).indexOf("esame") >= 0, tag + "mantenimiento: simulacro cada tres meses");
  ok(Plan.today(course, mt, 15, base({ maint: simOld })).notes.length === 1, tag + "mantenimiento: con 15 min, el simulacro como aviso");

  /* ------------------------------------------------ progreso: la meta y el ritmo */
  var s2 = E.blankSave();
  ok(Pr.ritmo(s2).min === 20 && Pr.ritmo(s2).days === 5, tag + "meta por defecto: 20 min, 5 días (de la meta en xp 200)");
  s2.goal = 500;
  ok(Pr.ritmo(s2).min === 45, tag + "un guardado viejo con 500 xp: 45 min");
  Pr.setRitmo(s2, { min: 10, days: 3 });
  ok(s2.goal === 100 && s2.ritmo.min === 10, tag + "la meta en xp sigue a los minutos");
  s2.unlocked = 10;
  var e1 = Pr.eta(s2, WED);
  ok(e1.src === "meta" && Math.abs(e1.pace - 30 / 137) < 0.01, tag + "sin historia: el ritmo sale de la meta (" + e1.pace + ")");
  ok(e1.bosses.length === 4 && e1.bosses[0].date > WED && e1.c1 > e1.bosses[2].date, tag + "fechas de los jefes en orden");
  s2.history = [];
  for (var k = 6; k >= 0; k--) {
    var d = new Date(WED.getTime() - k * 7 * DAY);
    s2.history.push({ w: Pr.weekKey(d), u: 10 - k, n: 100, m: 60, e: {} });
  }
  var e2 = Pr.eta(s2, WED);
  ok(e2.src === "semanas" && Math.abs(e2.pace - 1) < 0.01, tag + "con puntos semanales: una semana por semana (" + e2.pace + ")");
  ok(Math.round((e2.bosses[0].date - WED) / DAY / 7) === 4, tag + "el jefe 13, a cuatro semanas desde la 10");
  s2.weekStats = { 13: { bossPassed: true } };
  ok(Pr.eta(s2, WED).bosses[0].passed && !Pr.eta(s2, WED).bosses[0].date, tag + "el jefe vencido no tiene fecha");
  // a goal with a date
  Pr.setRitmo(s2, { week: 26, date: "2026-12-30" });
  var T = Pr.target(s2, WED);
  ok(T && T.toGo === 16 && T.pace > 1 && T.minutes > 30, tag + "meta con fecha: el ritmo que pide (" + (T && T.minutes) + " min por día)");
  ok(Pr.target(Object.assign({}, s2, { ritmo: { min: 20, days: 5, week: 26, date: "2026-1-1" } }), WED).late, tag + "meta vencida");

  /* ------------------------------------------------ el tiempo */
  var s3 = E.blankSave();
  Pr.addTime(s3, "input", 300, WED); Pr.addTime(s3, "forma", 600, WED);
  Pr.addTime(s3, "output", 120, new Date(WED.getTime() - 3 * DAY));
  Pr.addTime(s3, "nada", 999, WED);
  ok(Pr.todaySec(s3, WED) === 900, tag + "segundos de hoy");
  ok(Pr.thisWeek(s3, WED).sec === 900 + 0, tag + "esta semana empieza el lunes (el domingo anterior no cuenta)");
  var ser = Pr.weeksSeries(s3, 8, WED);
  ok(ser.length === 8 && ser[7].sec === 900 && ser[6].output === 120, tag + "serie de 8 semanas, la actual al final");
  ok(Pr.strandFor("gioco", "scene") === "fluidez" && Pr.strandFor("lettura") === "input" && Pr.strandFor("oggi", "", false) === null &&
     Pr.strandFor("oggi", "", true) === "input" && Pr.strandFor("tramo-scr") === "output", tag + "cada pantalla con su destreza");
  s3.ascolto = {}; s3.ascolto[Pr.dayKey(WED)] = { sec: 600, xp: 0 };
  ok(Pr.inputWeek(s3, null, WED) === 10, tag + "input de la semana: lo registrado cuando es más que lo medido");

  /* ------------------------------------------------ la serie y la tendencia */
  var s4 = E.blankSave();
  s4.history = [];
  s4.errs = { a: { n: 10, fixed: 0, last: WED.getTime() }, b: { n: 30, fixed: 2, last: WED.getTime() - 40 * DAY } };
  for (var j = 9; j >= 1; j--) {
    var dd = new Date(WED.getTime() - j * 7 * DAY);
    s4.history.push({ w: Pr.weekKey(dd), u: 1, n: 0, m: 0, e: { a: j > 4 ? 1 : 2, b: j > 4 ? 10 : 29 } });
  }
  var tr = Pr.errTrend(s4, WED);
  var ta = tr.filter(function (t) { return t.cat === "a"; })[0], tb = tr.filter(function (t) { return t.cat === "b"; })[0];
  ok(tr[0].cat === "b", tag + "tendencia: ordenadas por cantidad");
  ok(ta && ta.trend === "sube", tag + "tendencia: la que creció sube (" + (ta && ta.trend) + ")");
  ok(tb && tb.trend === "quieto", tag + "tendencia: la que no aparece hace 40 días, quieta");
  var n0 = s4.history.length;
  Pr.snapshot(s4, { b: [1, 2, 3, 4, 5] }, WED);
  ok(s4.history.length === n0 + 1 && s4.history[n0].b[4] === 5, tag + "un punto nuevo para la semana nueva");
  Pr.snapshot(s4, null, WED);
  ok(s4.history.length === n0 + 1 && s4.history[n0].b[0] === 1, tag + "la misma semana se sobrescribe y conserva las bandas");

  /* ------------------------------------------------ la cuota de palabras */
  var s5 = E.blankSave(); s5.unlocked = 21;
  var q = Pr.wordQuota(course, s5, WED, true), sg = E.subGoals(s5);
  var wk21 = (course.weeks[20].vocab || []).length;
  ok(q.target === wk21 + 12, tag + "cuota: las palabras de la semana y una sesión del banco (" + q.target + ")");
  ok(q.target * 3 < sg.wordsPerWeek, tag + "cuota: lejos de las " + sg.wordsPerWeek + " de antes");
  ok(q.boss === 26 && q.byBoss > 0, tag + "cuota: lo que el curso enseña hasta el jefe (" + q.byBoss + ")");

  /* ------------------------------------------------ el primer arranque */
  var nw = E.blankSave();
  ok(Ini.needs(nw), tag + "alumno nuevo: onboarding");
  var old = E.blankSave(); old.xp = 1234; old.unlocked = 3;
  ok(!Ini.needs(old), tag + "con progreso: nunca");
  var placed = E.blankSave(); placed.ubicacion = { at: 1, start: 20 };
  ok(!Ini.needs(placed), tag + "ubicado sin onboarding (versión vieja): nunca");
  var half = E.blankSave(); half.onboard = { step: 3 }; half.unlocked = 20;
  ok(Ini.needs(half), tag + "a mitad de camino (después del test): sigue");
  half.onboard.at = Date.now();
  ok(!Ini.needs(half), tag + "terminado: nunca más");
  ok(Ini.firstMode({ onboard: { at: 1 }, read: {}, readSess: {}, totals: { attempts: 0 } }), tag + "primer día: una sola tarjeta");
  ok(!Ini.firstMode({ onboard: { at: 1 }, read: {}, readSess: { 1: { 0: 1 } }, totals: { attempts: 3 } }), tag + "después de la primera lección: el plan");
  ok(!Ini.firstMode({ read: {}, totals: {} }), tag + "sin onboarding (guardado viejo): el plan");
});

console.log(checks + " comprobaciones, " + fails + " fallas");
process.exit(fails ? 1 : 0);
