/* Il motore della memoria: FSRS, mantenimento, notte/mattina,
   registro dei ripassi, velocità stimata,
   regole come schede e coda di ripasso.
   Run: node tools/it/test_memoria.js  */
var pack = require("../lib/pack.js");
var ctx = pack("it");
var Engine = ctx.Engine;
var Frasi = ctx.Frasi;
var Drills = ctx.Drills;
var T = require("../lib/testkit.js")("it"), ok = T.ok;
function near(a, b, tol) { return Math.abs(a - b) <= tol; }
var DAY = 86400000;
// a fixed noon, so the night mode does not kick in by accident
var NOON = new Date(2026, 2, 10, 12, 0, 0).getTime();

/* --------------------------------------------------------- formule */
ok(Engine.retrievability(0, 10) === 1, "R(0) = 1");
ok(near(Engine.retrievability(10, 10), 0.9, 0.001), "R(S) = 0.9: " + Engine.retrievability(10, 10));
ok(Engine.intervalFor(10, 0.9) === 10, "intervallo a ritenzione 0.9 = S");
ok(Engine.intervalFor(10, 0.85) > Engine.intervalFor(10, 0.95), "ritenzione bassa = intervalli lunghi");
ok(Engine.intervalFor(0.1, 0.9) === 1, "mai meno di un giorno");

/* --------------------------------------------------------- voti */
ok(Engine.ratingFor(0) === 1, "sbagliato = Again");
ok(Engine.ratingFor(1) === 2, "quasi = Hard");
ok(Engine.ratingFor(1, { kind: "slip" }) === 3, "un refuso non è un errore: Good");
ok(Engine.ratingFor(2) === 3, "giusto = Good");
ok(Engine.ratingFor(2, { hint: true }) === 2, "giusto con pista = Hard");
ok(Engine.ratingFor(2, { retry: true }) === 2, "la seconda volta più facile = Hard");
ok(Engine.ratingFor(2, { light: true }) === 4, "giusto a prima vista in allenamento = Easy");

/* --------------------------------------------------- una scheda */
var c = Engine.schedule(null, 2, { now: NOON, notte: false });
ok(near(c.s, 3.173, 0.01) && c.interval === 3 && c.state === "rev", "nuova con Good: S 3.17, 3 giorni");
var e = Engine.schedule(null, 2, { now: NOON, notte: false, light: true });
ok(c.interval < e.interval && e.interval >= 14, "Easy dura di più: " + e.interval);
// Good every time, exactly when due: maintenance within a handful of reviews
var card = null, t = NOON, n = 0;
while (n < 10 && !(card && card.state === "maint")) {
  card = Engine.schedule(card, 2, { now: t, notte: false });
  t = card.due; n++;
}
ok(card.state === "maint" && n <= 8, "mantenimento dopo pochi successi: " + n + " ripassi, S " + Math.round(card.s));
ok(Engine.retired(card), "in mantenimento la scheda conta come nota");
var before = card.s;
card = Engine.schedule(card, 0, { now: card.due, notte: false });
ok(card.reps === 0 && card.lapses === 1 && card.s < before && card.interval === 1 && card.state === "learn", "l'errore riparte da capo, domani");
ok(!Engine.retired(card), "dopo l'errore non è più nota");
// Difficulty stays within bounds whatever happens
var d = null;
for (var k = 0; k < 30; k++) d = Engine.schedule(d, k % 3 === 0 ? 0 : 2, { now: NOON + k * DAY, notte: false });
ok(d.d >= 1 && d.d <= 10 && d.s > 0, "difficoltà fra 1 e 10");

/* ------------------------------------------------- la vecchia scheda */
var old = Engine.upgradeCard({ ease: 2.5, interval: 20, reps: 3, ok: 3, due: 1, last: 1 });
ok(old.s === 20 && old.d === 5 && old.state === "maint", "una scheda SM-2 ritirata passa a mantenimento");
var old2 = Engine.upgradeCard({ ease: 1.3, interval: 1, reps: 1, due: 1, last: 1 });
ok(old2.d > 8 && old2.state === "rev", "ease bassa = difficile");
ok(Engine.schedule({ ease: 2.5, interval: 5, reps: 2, due: NOON, last: NOON - 5 * DAY }, 2, { now: NOON, notte: false }).s > 5, "una scheda vecchia continua");

/* ------------------------------------------------------- ritenzione */
var st = Engine.blankSave();
st.retention = 0.85;
var lo = Engine.schedule(null, 2, { now: NOON, notte: false, state: st, id: "x" });
st.retention = 0.95;
var hi = Engine.schedule(null, 2, { now: NOON, notte: false, state: st, id: "x" });
ok(lo.interval > hi.interval, "la ritenzione scelta cambia l'intervallo: " + lo.interval + " > " + hi.interval);

/* ------------------------------------------------- notte e mattina */
var NIGHT = new Date(2026, 2, 10, 22, 30).getTime();
var nc = Engine.schedule(null, 2, { now: NIGHT });
var due = new Date(nc.due);
ok(due.getDate() === 11 && due.getHours() === 7 && nc.night === Engine.dayKey(due), "nuovo di sera: torna domattina alle 7");
var nc2 = Engine.schedule(null, 2, { now: NIGHT, notte: false });
ok(nc2.due > NIGHT + 2 * DAY, "modo notte spento: intervallo normale");
var day = Engine.schedule(null, 2, { now: NOON });
ok(!day.night && day.due > NOON + 2 * DAY, "di giorno niente notte");

/* ------------------------------------------------ registro e velocità */
var s2 = Engine.blankSave();
s2.cards["v:casa"] = Engine.schedule(null, 2, { now: NOON, state: s2, id: "v:casa", notte: false });
ok(s2.log.length === 1 && s2.log[0][0] === "v:casa" && s2.log[0][2] === 3 && s2.log[0][5] === "v", "il ripasso finisce nel registro");
ok(Engine.cardKind("frase:bar:1") === "v" && Engine.cardKind("d03-01") === "g", "lessico e grammatica");
// a learner who forgets grammar 40 % faster: the fit finds it
var s3 = Engine.blankSave();
var seed = 7; function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
for (var i = 0; i < 600; i++) {
  var S = 2 + rnd() * 30, el = 1 + rnd() * 40;
  var p = Engine.retrievability(el, S * 0.6);
  s3.log.push(["g" + i, 0, rnd() < p ? 3 : 1, el, S, "g"]);
}
var fit = Engine.fitSpeed(s3);
ok(near(fit.g.k, 0.6, 0.15) && fit.v.k === 1, "velocità stimata: g " + fit.g.k + " (atteso 0.6), v " + fit.v.k);
ok(Engine.maybeFit(Engine.blankSave()) === null, "sotto i 100 ripassi non si stima");
// the fitted speed changes the intervals
var s4 = Engine.blankSave(); s4.speed = { g: { k: 0.5, n: 200 }, v: { k: 1, n: 0 } };
var slow = Engine.schedule(null, 2, { now: NOON, notte: false, state: s4, id: "d01" });
ok(slow.interval < c.interval, "chi dimentica prima ripassa prima: " + slow.interval + " < " + c.interval);
var ms = Engine.memoryStats(s2, NOON);
ok(ms.n === 1 && ms.recall === 100, "statistiche della memoria");

/* ------------------------------------------- la regola come scheda */
var s6 = Engine.blankSave();
Engine.noteProduction(s6, 5, new Date(NOON));
Engine.noteProduction(s6, 5, new Date(NOON));
Engine.noteProduction(s6, 5, new Date(NOON + DAY));
ok(!Engine.consolidated(s6.weekStats[5]), "due giorni non bastano");
Engine.noteProduction(s6, 5, new Date(NOON + 3 * DAY));
ok(Engine.consolidated(s6.weekStats[5]), "tre giorni di produzione: regola consolidata");

/* ------------------------------------------------------ la coda */
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
ok(q.filter(function (x) { return x.maint; }).length === 6, "al massimo sei schede di mantenimento al giorno");
ok(q[0].id === fr[20].id, "prima quella imparata ieri sera");
ok(q[1].id === fr[21].id, "poi l'errore");
ok(Drills.dueCount({ weeks: [], items: [] }, s7) === 36, "conteggio: 30 + 6 di mantenimento");

/* ------------------------------------------------------ sanitize */
var raw = Engine.blankSave();
raw.cards["frase:bar:1"] = { s: "9", d: 99, reps: 2, due: 5, last: 5, state: "boh" };
raw.retention = 0.5; raw.log = "no";
var san = Engine.sanitize(JSON.parse(JSON.stringify(raw)));
ok(san.cards["frase:bar:1"].s === 9 && san.cards["frase:bar:1"].d === 10 && !san.cards["frase:bar:1"].state, "scheda ripulita");
ok(san.retention === 0.9 && Array.isArray(san.log), "impostazioni ripulite");

/* ------------------------------------------------- abitudine e mete */
var s8 = Engine.blankSave();
var MON = new Date(2026, 2, 9, 12);   // a Monday
[0, 1, 2, 7, 8, 9, 14].forEach(function (d) { s8.days[Engine.dayKey(new Date(2026, 2, 9 + d, 12))] = 50; });
ok(Engine.weekStreak(s8, new Date(2026, 2, 23, 12)) === 2, "due settimane di fila con tre giorni: " + Engine.weekStreak(s8, new Date(2026, 2, 23, 12)));
ok(Engine.noteSession(s8, MON) === 1 && Engine.noteSession(s8, MON) === 2 && Engine.sessionsToday(s8, MON) === 2, "sessioni del giorno");
s8.lastPlayed = Engine.dayKey(MON);
ok(Engine.daysAway(s8, new Date(2026, 2, 13, 12)) === 4, "giorni di pausa");
ok(Engine.freshStart(MON) === "semana" && Engine.freshStart(new Date(2026, 3, 1, 12)) === "mes" && !Engine.freshStart(new Date(2026, 2, 11, 12)), "nuovo inizio");
s8.log = [["v:casa", Math.round(Date.now() / 60000), 3, 0, 0, "v"], ["d1", Math.round(Date.now() / 60000), 3, 0, 0, "g"], ["v:vecchia", Math.round(Date.now() / 60000) - 20 * 1440, 3, 0, 0, "v"]];
ok(Engine.newWordsThisWeek(s8) === 1, "parole nuove della settimana");
var sg = Engine.subGoals(s8);
ok(sg.boss === 13 && sg.level === "A2" && sg.wordsPerWeek >= 10 && sg.weeksLeft === 13, "sotto-obiettivi: " + JSON.stringify(sg));
ok(!Engine.noteRecord(s8, "sessione", 80) && Engine.noteRecord(s8, "sessione", 90) && !Engine.noteRecord(s8, "sessione", 85), "record personale");

T.done("");
