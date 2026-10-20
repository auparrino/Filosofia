/* Rumo C1 — el motor de la memoria: FSRS, mantenimiento, noche y mañana,
   registro de repasos, velocidad estimada,
   reglas como fichas, cola de repaso, saneamiento del guardado y hábito.
   Corre: node tools/pt/test_memoria.js  */
var pack = require("../lib/pack.js");
var ctx = pack("pt");
var Engine = ctx.Engine;
var Frasi = ctx.Frasi;
var Drills = ctx.Drills;
var T = require("../lib/testkit.js")("pt"), ok = T.ok;
function near(a, b, tol) { return Math.abs(a - b) <= tol; }
var DAY = 86400000;
// a fixed noon, so the night mode does not kick in by accident
var NOON = new Date(2026, 2, 10, 12, 0, 0).getTime();

/* --------------------------------------------------------- fórmulas */
ok(Engine.retrievability(0, 10) === 1, "R(0) = 1");
ok(near(Engine.retrievability(10, 10), 0.9, 0.001), "R(S) = 0.9: " + Engine.retrievability(10, 10));
ok(Engine.intervalFor(10, 0.9) === 10, "intervalo con retención 0.9 = S");
ok(Engine.intervalFor(10, 0.85) > Engine.intervalFor(10, 0.95), "retención baja = intervalos largos");
ok(Engine.intervalFor(0.1, 0.9) === 1, "nunca menos de un día");

/* --------------------------------------------------------- notas */
ok(Engine.ratingFor(0) === 1, "incorrecto = Again");
ok(Engine.ratingFor(1) === 2, "casi = Hard");
ok(Engine.ratingFor(1, { kind: "slip" }) === 3, "un tipeo no es un error: Good");
ok(Engine.ratingFor(2) === 3, "correcto = Good");
ok(Engine.ratingFor(2, { hint: true }) === 2, "correcto con pista = Hard");
ok(Engine.ratingFor(2, { retry: true }) === 2, "la segunda vez, más fácil = Hard");
ok(Engine.ratingFor(2, { light: true }) === 4, "correcto a la primera en el entrenamiento = Easy");

/* --------------------------------------------------- una ficha */
var c = Engine.schedule(null, 2, { now: NOON, notte: false });
ok(near(c.s, 3.173, 0.01) && c.interval === 3 && c.state === "rev", "nueva con Good: S 3.17, 3 días");
var e = Engine.schedule(null, 2, { now: NOON, notte: false, light: true });
ok(c.interval < e.interval && e.interval >= 14, "Easy dura más: " + e.interval);
// Good every time, exactly when due: maintenance within a handful of reviews
var card = null, t = NOON, n = 0;
while (n < 10 && !(card && card.state === "maint")) {
  card = Engine.schedule(card, 2, { now: t, notte: false });
  t = card.due; n++;
}
ok(card.state === "maint" && n <= 8, "mantenimiento tras pocos aciertos: " + n + " repasos, S " + Math.round(card.s));
ok(Engine.retired(card), "en mantenimiento la ficha cuenta como sabida");
var before = card.s;
card = Engine.schedule(card, 0, { now: card.due, notte: false });
ok(card.reps === 0 && card.lapses === 1 && card.s < before && card.interval === 1 && card.state === "learn", "el error vuelve a empezar, mañana");
ok(!Engine.retired(card), "después del error ya no cuenta como sabida");
// Difficulty stays within bounds whatever happens
var d = null;
for (var k = 0; k < 30; k++) d = Engine.schedule(d, k % 3 === 0 ? 0 : 2, { now: NOON + k * DAY, notte: false });
ok(d.d >= 1 && d.d <= 10 && d.s > 0, "dificultad entre 1 y 10");

/* ------------------------------------------------- la ficha vieja (SM-2) */
var old = Engine.upgradeCard({ ease: 2.5, interval: 20, reps: 3, ok: 3, due: 1, last: 1 });
ok(old.s === 20 && old.d === 5 && old.state === "maint", "una ficha SM-2 retirada pasa a mantenimiento");
var old2 = Engine.upgradeCard({ ease: 1.3, interval: 1, reps: 1, due: 1, last: 1 });
ok(old2.d > 8 && old2.state === "rev", "ease baja = difícil");
ok(Engine.schedule({ ease: 2.5, interval: 5, reps: 2, due: NOON, last: NOON - 5 * DAY }, 2, { now: NOON, notte: false }).s > 5, "una ficha vieja sigue");

/* ------------------------------------------------------- retención */
var st = Engine.blankSave();
st.retention = 0.85;
var lo = Engine.schedule(null, 2, { now: NOON, notte: false, state: st, id: "x" });
st.retention = 0.95;
var hi = Engine.schedule(null, 2, { now: NOON, notte: false, state: st, id: "x" });
ok(lo.interval > hi.interval, "la retención elegida cambia el intervalo: " + lo.interval + " > " + hi.interval);

/* ------------------------------------------------- noche y mañana */
var NIGHT = new Date(2026, 2, 10, 22, 30).getTime();
var nc = Engine.schedule(null, 2, { now: NIGHT });
var due = new Date(nc.due);
ok(due.getDate() === 11 && due.getHours() === 7 && nc.night === Engine.dayKey(due), "lo nuevo de noche vuelve mañana a las 7");
var nc2 = Engine.schedule(null, 2, { now: NIGHT, notte: false });
ok(nc2.due > NIGHT + 2 * DAY, "modo noche apagado: intervalo normal");
var day = Engine.schedule(null, 2, { now: NOON });
ok(!day.night && day.due > NOON + 2 * DAY, "de día, sin modo noche");

/* ------------------------------------------------ registro y velocidad */
var s2 = Engine.blankSave();
s2.cards["v:praia"] = Engine.schedule(null, 2, { now: NOON, state: s2, id: "v:praia", notte: false });
ok(s2.log.length === 1 && s2.log[0][0] === "v:praia" && s2.log[0][2] === 3 && s2.log[0][5] === "v", "el repaso queda en el registro");
ok(Engine.cardKind("frase:boteco:1") === "v" && Engine.cardKind("s1-03-01") === "g", "léxico y gramática");
// a learner who forgets grammar 40 % faster: the fit finds it
var s3 = Engine.blankSave();
var seed = 7; function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
for (var i = 0; i < 600; i++) {
  var S = 2 + rnd() * 30, el = 1 + rnd() * 40;
  var p = Engine.retrievability(el, S * 0.6);
  s3.log.push(["g" + i, 0, rnd() < p ? 3 : 1, el, S, "g"]);
}
var fit = Engine.fitSpeed(s3);
ok(near(fit.g.k, 0.6, 0.15) && fit.v.k === 1, "velocidad estimada: g " + fit.g.k + " (esperado 0.6), v " + fit.v.k);
ok(Engine.maybeFit(Engine.blankSave()) === null, "con menos de 100 repasos no se estima");
// the fitted speed changes the intervals
var s4 = Engine.blankSave(); s4.speed = { g: { k: 0.5, n: 200 }, v: { k: 1, n: 0 } };
var slow = Engine.schedule(null, 2, { now: NOON, notte: false, state: s4, id: "d01" });
ok(slow.interval < c.interval, "quien olvida antes repasa antes: " + slow.interval + " < " + c.interval);
var ms = Engine.memoryStats(s2, NOON);
ok(ms.n === 1 && ms.recall === 100, "estadísticas de la memoria");

/* ------------------------------------------- la regla como ficha */
var s6 = Engine.blankSave();
Engine.noteProduction(s6, 5, new Date(NOON));
Engine.noteProduction(s6, 5, new Date(NOON));
Engine.noteProduction(s6, 5, new Date(NOON + DAY));
ok(!Engine.consolidated(s6.weekStats[5]), "dos días no alcanzan");
Engine.noteProduction(s6, 5, new Date(NOON + 3 * DAY));
ok(Engine.consolidated(s6.weekStats[5]), "tres días de producción: regla consolidada");

/* ------------------------------------------------------ la cola */
var s7 = Engine.blankSave();
var fr = Frasi.ALL.slice(0, 40);
fr.forEach(function (f, i) {
  var cc = { s: 3, d: 5, reps: 1, ok: 1, state: "rev", due: Date.now() - 1000, last: Date.now() - 5 * DAY };
  if (i < 10) { cc.state = "maint"; cc.s = 100; }
  if (i === 20) { cc.night = Engine.dayKey(); }
  if (i === 21) { cc.reps = 0; }
  s7.cards[f.id] = cc;
});
var q = Drills.dueList({}, s7);
ok(q.filter(function (x) { return x.maint; }).length === 6, "como mucho seis fichas de mantenimiento por día");
ok(q[0].id === fr[20].id, "primero la aprendida anoche");
ok(q[1].id === fr[21].id, "después el error");
ok(Drills.dueCount({ weeks: [], items: [] }, s7) === 36, "cuenta: 30 + 6 de mantenimiento");

/* ------------------------------------------------------ saneamiento */
var raw = Engine.blankSave();
raw.cards["frase:boteco:1"] = { s: "9", d: 99, reps: 2, due: 5, last: 5, state: "sei-la" };
raw.retention = 0.5; raw.log = "no";
var san = Engine.sanitize(JSON.parse(JSON.stringify(raw)));
ok(san.cards["frase:boteco:1"].s === 9 && san.cards["frase:boteco:1"].d === 10 && !san.cards["frase:boteco:1"].state, "ficha saneada");
ok(san.retention === 0.9 && Array.isArray(san.log), "ajustes saneados");

/* ------------------------------------------------- hábito y metas */
var s8 = Engine.blankSave();
var MON = new Date(2026, 2, 9, 12);   // a Monday
[0, 1, 2, 7, 8, 9, 14].forEach(function (d) { s8.days[Engine.dayKey(new Date(2026, 2, 9 + d, 12))] = 50; });
ok(Engine.weekStreak(s8, new Date(2026, 2, 23, 12)) === 2, "dos semanas seguidas con tres días: " + Engine.weekStreak(s8, new Date(2026, 2, 23, 12)));
ok(Engine.noteSession(s8, MON) === 1 && Engine.noteSession(s8, MON) === 2 && Engine.sessionsToday(s8, MON) === 2, "sesiones del día");
s8.lastPlayed = Engine.dayKey(MON);
ok(Engine.daysAway(s8, new Date(2026, 2, 13, 12)) === 4, "días de pausa");
ok(Engine.freshStart(MON) === "semana" && Engine.freshStart(new Date(2026, 3, 1, 12)) === "mes" && !Engine.freshStart(new Date(2026, 2, 11, 12)), "nuevo comienzo");
s8.log = [["v:praia", Math.round(Date.now() / 60000), 3, 0, 0, "v"], ["s1-01", Math.round(Date.now() / 60000), 3, 0, 0, "g"], ["v:velha", Math.round(Date.now() / 60000) - 20 * 1440, 3, 0, 0, "v"]];
ok(Engine.newWordsThisWeek(s8) === 1, "palabras nuevas de la semana");
var sg = Engine.subGoals(s8);
ok(sg.boss === 13 && sg.level === "A2" && sg.wordsPerWeek >= 10 && sg.weeksLeft === 13, "submetas: " + JSON.stringify(sg));
ok(!Engine.noteRecord(s8, "sessione", 80) && Engine.noteRecord(s8, "sessione", 90) && !Engine.noteRecord(s8, "sessione", 85), "récord personal");

/* ------------------------------------------------------ guardado propio */
// The save lives under «rumoc1.»: the Italian app shares the origin.
var store = {};
ctx.localStorage = { getItem: function (k) { return store[k] == null ? null : store[k]; },
                        setItem: function (k, v) { store[k] = String(v); }, removeItem: function (k) { delete store[k]; } };
var sv = Engine.blankSave(); sv.xp = 123;
ok(Engine.save(sv) && Object.keys(store).join() === "rumoc1.save.v1", "se guarda con la clave propia: " + Object.keys(store).join());
store["laviac1.save.v1"] = JSON.stringify({ xp: 999999, cards: {} });
ok(Engine.load().xp === 123, "la partida de La Via C1 no se lee ni se pisa");
store["rumoc1.save.v1"] = "{roto";
var dam = Engine.load();
ok(dam.xp === 0 && store["rumoc1.save.v1.damaged"] === "{roto", "un guardado roto se aparta y se empieza de cero");
ctx.localStorage = null;

T.done("");
