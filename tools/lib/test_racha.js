/* La racha amable (plan 1.3): el comodín semanal y «nunca dos días seguidos».
   Run: node tools/lib/test_racha.js */
"use strict";
var fs = require("fs"), path = require("path");
var pack = require("./pack.js");
var T = require("./testkit.js")("lib"), ok = T.ok;
var E = pack("it", { upTo: "app.js" }).Engine;
function day(m, d) { return new Date(2026, m - 1, d, 12); }

// 2026-03-02 es lunes.
var s = E.blankSave(); s.shields = 0;
E.touchStreak(s, day(3, 2)); E.touchStreak(s, day(3, 3));
E.touchStreak(s, day(3, 5));                       // se saltea el miércoles
ok(s.streak === 3 && s.shields === 0, "un día perdido en la semana no corta la racha y no gasta escudo: " + s.streak + "/" + s.shields);
ok(!E.jokerLeft(s, day(3, 5)), "el comodín de esa semana ya se usó");
E.touchStreak(s, day(3, 7));                       // se saltea el viernes: otro día perdido, misma semana
ok(s.streak === 1, "un segundo día perdido en la misma semana, sin escudos, corta la racha: " + s.streak);

var t = E.blankSave(); t.shields = 1;
E.touchStreak(t, day(3, 2)); E.touchStreak(t, day(3, 3));
E.touchStreak(t, day(3, 5)); E.touchStreak(t, day(3, 7));
ok(t.streak === 4 && t.shields === 0, "el segundo día de la semana lo cubre un escudo: " + t.streak + "/" + t.shields);

var u = E.blankSave(); u.shields = 0;
E.touchStreak(u, day(3, 2)); E.touchStreak(u, day(3, 4));   // lunes → miércoles (se saltea el martes)
E.touchStreak(u, day(3, 10));                              // la semana siguiente, un día perdido de nuevo: 3/5..3/9 son 5 días
ok(u.streak === 1, "cinco días perdidos no los cubre el comodín: " + u.streak);
var v = E.blankSave(); v.shields = 0;
E.touchStreak(v, day(3, 2)); E.touchStreak(v, day(3, 4));   // comodín de la semana del 2
E.touchStreak(v, day(3, 5)); E.touchStreak(v, day(3, 6)); E.touchStreak(v, day(3, 7)); E.touchStreak(v, day(3, 8));
E.touchStreak(v, day(3, 10));                              // se saltea el lunes 9: semana nueva, comodín nuevo
ok(v.streak === 7, "cada semana tiene su comodín: " + v.streak);

// El aviso al abrir la app (checkStreak) usa el mismo cálculo.
var w = E.blankSave(); w.shields = 0; w.streak = 5; w.lastPlayed = E.dayKey(day(3, 2));
ok(E.checkStreak(w, day(3, 4)).status === "saved", "al abrir, un día perdido con comodín: la racha se salva");
w.jokerWeek = E.dayKey(day(3, 2));
ok(E.checkStreak(w, day(3, 4)).status === "lost", "sin comodín ni escudos, se pierde");

var APP = fs.readFileSync(path.join(pack.DOCS, "js", "app.js"), "utf8");
ok(/var gentle = Engine\.daysAway\(state\) >= 2/.test(APP) && /dosCard\(gentle\)/.test(APP), "si ayer no hubo, arriba solo el botón de 2 minutos");
T.done();
