/* «Fuera de la app» (docs/js/fuera.js, lang/<código>/fuera_data.js), en los
 * dos idiomas:
 * - una ficha por semana de la 6 a la 52, con el nivel de la semana en
 *   course.json, una fuente conocida, un enlace https y qué buscar si se
 *   rompe, 6-8 palabras con glosa y tres preguntas: en castellano hasta la
 *   13, en la lengua meta desde la 14;
 * - las canciones llevan solo título y quién canta: nada de letra;
 * - los minutos: solo los toques de 5, 10, 20 y 30, 120 por día como mucho,
 *   30 de xp por día, al reloj de estudio como input y a los minutos de
 *   input de la semana (Capas.inputWeek y Progreso.inputWeek); el último
 *   toque de hoy se deshace;
 * - la misión de la semana es opcional y queda hecha con minutos anotados;
 * - el «contalo» pasa por el corrector de la semana y paga xp una sola vez;
 * - el plan del día la toma como input; el guardado descarta un state.fuera
 *   roto; el núcleo no nombra ningún idioma;
 * - la pantalla: el enlace se abre afuera, las preguntas con el lang del
 *   idioma desde la 14, los toques suman.
 *   Run: node tools/lib/test_fuera.js */
"use strict";
var fs = require("fs"), path = require("path");
var pack = require("./pack.js");
var Boot = require(path.join(pack.DOCS, "js", "boot.js"));
var T = require("./testkit.js")("es"), ok = T.ok;

var SRC = fs.readFileSync(path.join(pack.DOCS, "js", "fuera.js"), "utf8");
ok(!/italian|portugu|brasil|\bLa Via\b|Rumo C1/i.test(SRC.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "")), "fuera.js no nombra ningún idioma");
ok(Boot.coreFiles().indexOf("js/fuera.js") >= 0, "el service worker guarda fuera.js");
var APP = fs.readFileSync(path.join(pack.DOCS, "js", "app.js"), "utf8");
ok(/Fuera\.missions\(w, state\)\.forEach\(m\)/.test(APP), "weekPlan llama a Fuera.missions");
ok(/Fuera\.handles\(kind\)\) Fuera\.go\(kind, arg\)/.test(APP), "goMission lleva la misión de afuera");
ok(/Fuera\.owns\(s\)\) html = Fuera\.render\(s\)/.test(APP) && /Fuera\.wire\(view\.screen\)/.test(APP), "la pantalla «fuera» se dibuja y se cablea");
ok(/Fuera\.leggiFold\(state, week, sNames\)/.test(APP) && /Fuera\.weekButtons\(state, week\)/.test(APP), "Leggi muestra la ficha de la semana y todas");

var WEEKS = [];
for (var w = 6; w <= 52; w++) WEEKS.push(w);
var KINDS = ["escucha", "video", "lectura", "cancion"];

function dayAt(y, m, d, h) { return new Date(y, m - 1, d, h || 12); }

pack.LANGS.forEach(function (code) {
  var L = code + " · ";
  ok(Boot.langFiles(code).indexOf("lang/" + code + "/fuera_data.js") >= 0, L + "fuera_data.js en los archivos del idioma");
  var ctx = pack(code, { upTo: "app.js" });
  var F = ctx.Fuera, D = ctx.FUERA_DATA, course = JSON.parse(fs.readFileSync(pack.dataPath(code, "course.json"), "utf8"));
  ok(F && D, L + "fuera.js y fuera_data.js cargados en el orden de boot.js");
  if (!F || !D) return;
  T.eq(F.weeks(), WEEKS, L + "una ficha por semana de la 6 a la 52");
  ok(D.label && D.blurb && D.metaFrom === 14, L + "nombre, presentación y preguntas en la lengua desde la 14");
  var urls = {};
  D.FICHAS.forEach(function (f) {
    var W = L + "semana " + f.week + " · ", cw = course.weeks[f.week - 1];
    ok(f.level === cw.level, W + "el nivel de la semana (" + cw.level + "): " + f.level);
    ok(KINDS.indexOf(f.kind) >= 0, W + "tipo conocido: " + f.kind);
    ok(D.FUENTES[f.fuente] && D.FUENTES[f.fuente].name && D.FUENTES[f.fuente].note, W + "fuente con nombre y nota: " + f.fuente);
    ok(/^https:\/\/[a-z0-9.-]+\.[a-z]{2,}(\/|$)/.test(f.url), W + "enlace https: " + f.url);
    ok(f.buscar && f.buscar.length >= 5, W + "qué buscar si el enlace se rompe");
    ok(f.title && f.why && f.how && f.tell, W + "título, para qué, cómo y qué contar");
    ok(f.min >= 5 && f.min <= 30, W + "entre 5 y 30 minutos: " + f.min);
    ok(Array.isArray(f.words) && f.words.length >= 6 && f.words.length <= 8 &&
       f.words.every(function (x) { return Array.isArray(x) && x.length === 2 && x[0] && x[1]; }), W + "6-8 palabras con su glosa");
    ok(Array.isArray(f.questions) && f.questions.length === 3, W + "tres preguntas");
    var es = f.week < D.metaFrom;
    ok(F.qlang(f.week) === (es ? "es" : code), W + "las preguntas en " + (es ? "castellano" : "la lengua"));
    var spanish = f.questions.filter(function (q) { return /¿|^Anotá /.test(q); }).length;
    ok(es ? spanish === 3 : spanish === 0, W + "las preguntas en la lengua que toca: " + f.questions.join(" | "));
    // songs: title and who sings, never the lyrics
    if (f.kind === "cancion") {
      ok(/«[^»]+» \([^)]+\)/.test(f.title), W + "canción: «título» (quién canta)");
      ok(f.words.every(function (x) { return x[0].split(/\s+/).length <= 3; }), W + "canción: palabras sueltas, nada de versos");
    }
    urls[f.url] = (urls[f.url] || 0) + 1;
  });
  ok(Object.keys(D.FUENTES).every(function (k) { return D.FICHAS.some(function (f) { return f.fuente === k; }); }), L + "cada fuente se usa");
  ok(KINDS.every(function (k) { return D.FICHAS.filter(function (f) { return f.kind === k; }).length >= 4; }), L + "hay de los cuatro tipos");

  /* ------------------------------------------------ minutos y misiones */
  var st = { unlocked: 20, cards: {} };
  var now = dayAt(2026, 9, 28);
  var wk = course.weeks[9];
  var m0 = F.missions(wk, st);
  ok(m0.length === 1 && m0[0].kind === "fuera" && m0[0].opt && !m0[0].done, L + "la misión de la semana, opcional y sin hacer");
  ok(F.missions(course.weeks[4], st).length === 0, L + "sin misión antes de la semana 6");
  T.eq(F.log(st, 10, 7, now), { min: 0, xp: 0 }, L + "solo los toques de 5, 10, 20 y 30");
  T.eq(F.log(st, 10, 30, now), { min: 30, xp: 30 }, L + "30 minutos, 30 xp");
  T.eq(F.log(st, 10, 20, now), { min: 20, xp: 0 }, L + "el xp del día tiene tope de 30");
  ok(F.missions(wk, st)[0].done, L + "con minutos anotados la misión queda hecha");
  var tiempo = st.tiempo && st.tiempo["2026-9-28"];
  var iIn = ctx.Progreso.STRANDS.indexOf("input");
  ok(Array.isArray(tiempo) && tiempo[iIn] === 50 * 60, L + "los minutos van al reloj de estudio como input: " + JSON.stringify(tiempo));
  F.log(st, 10, 30, now); F.log(st, 11, 30, now);
  T.eq(F.log(st, 11, 30, now), { min: 10, xp: 0 }, L + "120 minutos por día como mucho");
  T.eq(F.log(st, 11, 5, now), { min: 0, xp: 0 }, L + "pasado el tope no suma");
  ok(F.minutes(st, 7, now) === 120, L + "minutos en 7 días: " + F.minutes(st, 7, now));
  ok(F.canUndo(st, 11, now) && F.undo(st, 11, now) === 10 && F.minutes(st, 7, now) === 110, L + "el último toque de hoy se deshace");
  ok(st.tiempo["2026-9-28"][iIn] === 110 * 60, L + "deshacer también descuenta del reloj");
  ok(!F.canUndo(st, 11, dayAt(2026, 9, 29)), L + "un toque de ayer ya no se deshace");
  T.eq(F.log(st, 11, 10, dayAt(2026, 9, 29)), { min: 10, xp: 10 }, L + "el día siguiente vuelve a sumar");
  ok(F.minutes(st, 7, dayAt(2026, 10, 7)) === 0, L + "a los 8 días ya no cuentan en la semana");
  // the input of the week counts the minutes out of the app
  var st2 = { unlocked: 20, cards: {} };
  F.log(st2, 10, 20, new Date());
  ok(ctx.Capas.inputWeek(st2).out === 20 && ctx.Capas.inputWeek(st2).total >= 20, L + "Capas.inputWeek suma los minutos de afuera");
  ok(ctx.Progreso.inputWeek(st2, {}) >= 20, L + "Progreso.inputWeek suma los minutos de afuera");
  ok(ctx.Plan.INPUT.fuera && ctx.Plan.MISSION_MIN.fuera > 0, L + "el plan del día la toma como input");

  /* ------------------------------------------------------ «contalo» */
  var txt = [];
  for (var i = 0; i < 45; i++) txt.push(code === "it" ? "parola" : "palavra");
  var r1 = F.review(st, 10, txt.join(" "), { findings: [] });
  ok(r1.n === 45 && r1.first && r1.xp > 0, L + "el primer «contalo» de 40 palabras paga xp: " + JSON.stringify(r1));
  var r2 = F.review(st, 10, txt.join(" "), { findings: [] });
  ok(!r2.first && r2.xp === 0, L + "el segundo no vuelve a pagar");
  var short = F.review(st, 12, "poche parole", { findings: [] });
  ok(!short.first && short.xp === 0, L + "con menos de 40 palabras no paga");
  var real = F.review(st, 15, txt.slice(0, 10).join(" "));
  ok(real && Array.isArray(real.findings), L + "sin corrector de prueba usa Scrivi.check de la semana");

  /* ------------------------------------------------------ el guardado */
  var saved = ctx.Engine.fromRaw ? ctx.Engine.fromRaw(JSON.stringify({ unlocked: 3, cards: {}, fuera: "roto" })) : null;
  ok(!saved || !("fuera" in saved) || typeof saved.fuera === "object", L + "un state.fuera roto se descarta al cargar");

  /* ------------------------------------------------------ la pantalla */
  var shown = [], toasts = [], gained = 0, store = { unlocked: 20, cards: {} };
  F.attach({ state: function () { return store; }, persist: function () {}, render: function () {}, go: function () {},
             toast: function (t) { toasts.push(t); }, gain: function (n) { gained += n; }, show: function (s) { shown.push(s); },
             toWeek: function () {}, ui: function () { return {}; }, lexicon: function () {} });
  F.open(20, "leggi");
  ok(shown[0] === "fuera" && F.owns("fuera"), L + "la ficha abre su pantalla");
  var html = F.render("fuera"), f20 = F.ficha(20);
  ok(html.indexOf('href="' + f20.url.replace(/&/g, "&amp;") + '"') >= 0 && /target="_blank" rel="noopener noreferrer"/.test(html), L + "el enlace se abre afuera");
  ok(new RegExp('<span lang="' + ctx.LANG.tts + '">').test(html), L + "las preguntas con el lang del idioma desde la 14");
  ok(/data-fumin="5"/.test(html) && /data-fumin="30"/.test(html) && /id="futext"/.test(html), L + "los toques de minutos y el «contalo»");
  F.open(8, "briefing");
  ok(!/<span lang="/.test(F.render("fuera").split('class="fu-q"')[1] || ""), L + "antes de la 14, las preguntas sin lang (castellano)");
  var fold = F.leggiFold(store, 20, ["Otoño", "Invierno", "Primavera", "Verano"]);
  ok(/data-fuera="20"/.test(fold) && /data-fuera="30"[^>]*disabled/.test(fold), L + "Leggi: las pasadas se abren, las que vienen no");
});

T.done();
