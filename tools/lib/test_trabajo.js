/* «Para el trabajo» (docs/js/trabajo.js, lang/<código>/trabajo_data.js), en
 * los dos idiomas (el portugués puede no tener escenas todavía: paso 1.5):
 * - cada escena: id «t-…» único, una semana del curso del A2 en adelante (sin
 *   los jefes) con su nivel, presentación, gramática y situación; un diálogo
 *   de 10-16 turnos con dos voces o más y su traducción; 10-15 frases con su
 *   construcción y su registro, que no repiten ninguna otra frase; 5-8 ítems
 *   de producción (al menos tres para traducir y uno de «Trova l'errore»),
 *   con la respuesta entre las aceptadas y las consignas con voseo; una tarea
 *   (mail o mensaje) con su lista, su largo y un modelo de ese largo;
 * - las frases son frases de Frasi (ids «frase:<escena>:<n>», mismo repaso)
 *   pero no entran en Frasi.SCENES (Allena, la simulación); los ítems vuelven
 *   al repaso como «trab:<escena>:<n>» (Drills);
 * - la misión de la semana es opcional y queda hecha con la producción en
 *   60 % o más y la tarea escrita a su largo; la tarea paga xp una vez;
 * - cada oración del diálogo y del modelo empieza con mayúscula (la tercera
 *   pasada encontró cinco «Le» de cortesía bajados a minúscula al empezar);
 * - el guardado descarta un state.trabajo roto; el núcleo no nombra ningún
 *   idioma; app.js llama al módulo en la semana, la ronda, Allena y la pantalla.
 * La gramática y las palabras de cada escena, contra el curso: tools/it/check_trabajo.py.
 *   Run: node tools/lib/test_trabajo.js */
"use strict";
var fs = require("fs"), path = require("path");
var pack = require("./pack.js");
var Boot = require(path.join(pack.DOCS, "js", "boot.js"));
var T = require("./testkit.js")("es"), ok = T.ok;

var SRC = fs.readFileSync(path.join(pack.DOCS, "js", "trabajo.js"), "utf8");
ok(!/italian|portugu|brasil|\bLa Via\b|Rumo C1/i.test(SRC.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "")), "trabajo.js no nombra ningún idioma");
ok(Boot.coreFiles().indexOf("js/trabajo.js") >= 0, "el service worker guarda trabajo.js");
var ORD = Boot.ORDER.map(function (e) { return e.lang || e.core || e.shared; });
ok(ORD.indexOf("trabajo_data.js") > ORD.indexOf("frasi_data.js") && ORD.indexOf("trabajo_data.js") < ORD.indexOf("frasi.js"),
   "trabajo_data.js se carga antes de frasi.js (sus frases son frases)");
var APP = fs.readFileSync(path.join(pack.DOCS, "js", "app.js"), "utf8");
ok(/Trabajo\.missions\(w, state\)\.forEach\(m\)/.test(APP), "weekPlan llama a Trabajo.missions");
ok(/Trabajo\.handles\(kind\)\) Trabajo\.go\(kind, arg\)/.test(APP), "goMission lleva la escena");
ok(/Trabajo\.owns\(s\)\) html = Trabajo\.render\(s\)/.test(APP) && /Trabajo\.wire\(view\.screen\)/.test(APP), "la pantalla «trabajo» se dibuja y se cablea");
ok(/kind === "trabajo"\) items = window\.Trabajo \? Trabajo\.session\(arg, state/.test(APP), "startRound arma la ronda de la escena");
ok(/Trabajo\.roundDone\(state, round\.arg, pct\)/.test(APP) && /Trabajo\.reopen\(round\.arg\)/.test(APP), "al terminar la ronda: el porcentaje y la vuelta a la escena");
ok(/Trabajo\.weekButtons\(state, week\)/.test(APP) && /Trabajo\.allenaFold\(state, week/.test(APP), "Allena muestra la escena de la semana y todas");
ok(/"trabajo", "sync"\]/.test(fs.readFileSync(path.join(pack.DOCS, "js", "engine.js"), "utf8")), "state.trabajo es un campo de módulo del guardado");

var TYPES = { translate: 1, cloze: 1, typed: 1, fixerr: 1, combina: 1, choice: 1 };
var BOSS = { 13: 1, 26: 1, 39: 1, 52: 1 };
// consignas con voseo: nada de «Traduce», «Completa», «Escribe», «Elige»…
var TU = /\b(Traduce|Completa|Escribe|Elige|Corrige|Pasa|Transforma|Busca|Toca|Usa|Responde|Contesta)\b/;
var LEVEL = { A2: 7, B1: 19, B2: 29, C1: 40 };

function words(s) { return String(s || "").split(/\s+/).filter(function (x) { return /[A-Za-zÀ-ÿ]/.test(x); }).length; }

pack.LANGS.forEach(function (code) {
  var L = code + " · ";
  ok(Boot.langFiles(code).indexOf("lang/" + code + "/trabajo_data.js") >= 0, L + "trabajo_data.js en los archivos del idioma");
  var ctx = pack(code, { upTo: "app.js" });
  var W = ctx.Trabajo, D = ctx.TRABAJO_DATA, F = ctx.Frasi, course = JSON.parse(fs.readFileSync(pack.dataPath(code, "course.json"), "utf8"));
  ok(W && D && Array.isArray(D.SCENES) && D.label, L + "trabajo.js y trabajo_data.js cargados, con nombre");
  if (!W || !D) return;
  var list = W.scenes();
  ok(list.length === D.SCENES.length, L + "todas las escenas tienen frases");
  if (!list.length) {
    // without scenes: nothing anywhere
    ok(!W.missions(course.weeks[19], { cards: {} }).length && W.allenaFold({ cards: {} }, 52, []) === "", L + "sin escenas no hay misión ni sección");
    return;
  }
  ok(list.length >= 12, L + "al menos doce escenas: " + list.length);
  ok(D.blurb && D.blurb.length > 40, L + "la presentación de la ruta");

  /* --------------------------------------------------------- la forma */
  var ids = {}, texts = {}, prev = 0;
  F.ALL.forEach(function (f) { if (!f.work) texts[f.it.toLowerCase()] = f.id; });
  list.forEach(function (s) {
    var S = L + s.id + " · ", cw = course.weeks[s.week - 1];
    ok(/^t-[a-z]+$/.test(s.id) && !ids[s.id], S + "id «t-…» único");
    ids[s.id] = 1;
    ok(cw && s.week >= 7 && !BOSS[s.week], S + "una semana del A2 en adelante, sin los jefes: " + s.week);
    ok(s.week >= prev, S + "en el orden de las semanas");
    prev = s.week;
    ok(cw && s.level === cw.level, S + "el nivel de la semana (" + (cw && cw.level) + "): " + s.level);
    ok(s.emoji && s.name && s.blurb && s.grammar && s.situazione, S + "emoji, nombre, presentación, gramática y situación");
    // the dialogue
    var who = {};
    ok(Array.isArray(s.dialogo) && s.dialogo.length >= 10 && s.dialogo.length <= 16, S + "diálogo de 10-16 turnos: " + (s.dialogo || []).length);
    (s.dialogo || []).forEach(function (d, i) {
      ok(Array.isArray(d) && d.length === 3 && d[0] && d[1] && d[2], S + "turno " + i + ": [quién, lengua, castellano]");
      who[d[0]] = 1;
      ok(!/[¿¡]/.test(d[1]), S + "turno " + i + ": sin ¿ ni ¡ en la lengua meta");
      // «… alle cinque. la chiamo»: a sentence starts with a capital (the polite «Le» lowered by mistake)
      ok(!/[.!?]\s+[a-zà-ù]/.test(d[1]) && !/^[a-zà-ù]/.test(d[1]), S + "turno " + i + ": cada oración empieza con mayúscula: " + d[1]);
    });
    ok(Object.keys(who).length >= 2, S + "dos voces o más");
    ok(!s.gloss || Object.keys(s.gloss).every(function (k) { return s.gloss[k]; }), S + "cada glosa con su significado");
    // the phrases
    ok(s.phrases.length >= 10 && s.phrases.length <= 15, S + "10-15 frases: " + s.phrases.length);
    s.phrases.forEach(function (p, i) {
      var P = S + "frase " + i + " · ";
      ok(p.length === 4 && p[0] && p[1] && p[2], P + "[lengua, castellano, nota, registro]");
      ok("fnce".indexOf(p[3]) >= 0 && p[3].length === 1, P + "registro f, n, c o e: " + p[3]);
      ok(p[2].length >= 60 && p[2].length <= 380, P + "la nota explica la construcción (60-380 caracteres): " + p[2].length);
      ok(/\*[^*]+\*/.test(p[2]), P + "la nota marca las formas con *asteriscos*");
      var k = p[0].toLowerCase();
      ok(!texts[k], P + "no repite otra frase (" + texts[k] + "): «" + p[0] + "»");
      texts[k] = s.id;
      var f = F.BY_ID["frase:" + s.id + ":" + i];
      ok(f && f.it === p[0] && f.work, P + "es una frase de Frasi, marcada como de trabajo");
    });
    ok(!F.SCENES.some(function (x) { return x.id === s.id; }) && F.WORK.some(function (x) { return x.id === s.id; }),
       S + "fuera de Frasi.SCENES, en Frasi.WORK");
    // the items
    var its = W.items(s.id), kinds = {};
    ok(its.length >= 5 && its.length <= 8, S + "5-8 ítems: " + its.length);
    its.forEach(function (it, i) {
      var I = S + "ítem " + i + " · ";
      kinds[it.type] = (kinds[it.type] || 0) + 1;
      ok(TYPES[it.type], I + "tipo conocido: " + it.type);
      ok(it.id === "trab:" + s.id + ":" + i && W.reviewItem(it.id) && W.reviewItem(it.id).answer === it.answer, I + "id y repaso");
      ok(it.prompt && it.stem && it.answer && it.note, I + "consigna, enunciado, respuesta y nota");
      ok(!TU.test(it.prompt), I + "consigna con voseo: " + it.prompt);
      ok(it.accept.indexOf(it.answer) >= 0 && new Set(it.accept).size === it.accept.length, I + "la respuesta entre las aceptadas, sin repetidas");
      if (it.type === "cloze" || it.type === "typed") ok(/___/.test(it.stem), I + "el hueco ___ en el enunciado");
      if (it.type === "translate") ok(!/___/.test(it.stem) && !/[¿¡]/.test(it.answer), I + "traducir: sin hueco, la respuesta sin ¿ ni ¡");
      if (it.type === "fixerr") {
        ok(it.bad && it.good && it.stem.indexOf(it.bad) >= 0 && it.answer.indexOf(it.good) >= 0 && it.stem !== it.answer,
           I + "Trova l'errore: lo malo en el enunciado, lo bueno en la respuesta");
      }
      if (it.type === "choice") ok(Array.isArray(it.options) && it.options.indexOf(it.answer) >= 0, I + "opción: la respuesta entre las opciones");
    });
    ok((kinds.translate || 0) >= 3 && (kinds.fixerr || 0) >= 1, S + "al menos tres para traducir y uno de corregir");
    var stems = its.map(function (it) { return it.stem; });
    ok(new Set(stems).size === stems.length, S + "sin enunciados repetidos");
    // the task
    var c = s.compito || {};
    ok(c.genre === "mail" || c.genre === "messaggio" || c.genre === "mensagem", S + "la tarea es un mail o un mensaje: " + c.genre);
    ok(c.title && c.t && c.model, S + "título, consigna y modelo");
    ok(!/[.!?]\s+[a-zà-ù]/.test(c.model), S + "el modelo: cada oración empieza con mayúscula");
    ok(Array.isArray(c.punti) && c.punti.length >= 4 && c.punti.length <= 6, S + "4-6 puntos para chequear");
    ok(c.min >= 30 && c.max > c.min && c.max <= 180, S + "el largo: " + c.min + "-" + c.max);
    var nm = words(c.model);
    ok(nm >= c.min && nm <= Math.round(c.max * 1.15), S + "el modelo tiene el largo que pide (" + nm + " palabras, " + c.min + "-" + c.max + ")");
  });
  Object.keys(LEVEL).forEach(function (lv) {
    ok(list.some(function (s) { return s.level === lv; }), L + "hay escenas de " + lv);
  });

  /* ----------------------------------------------- misiones y ronda */
  var s0 = list[0], st = { unlocked: s0.week, cards: {} };
  var wk = course.weeks[s0.week - 1];
  var m0 = W.missions(wk, st);
  ok(m0.length === 1 && m0[0].kind === "trabajo" && m0[0].arg === s0.id && m0[0].opt && !m0[0].done && !m0[0].half,
     L + "la misión de la semana, opcional y sin empezar");
  ok(!W.missions(course.weeks[s0.week - 2], st).length, L + "sin misión la semana anterior");
  var fr = W.session(s0.id + ":frasi", st, {});
  ok(fr.length >= 6 && fr.every(function (it) { return it.frase && it.id.indexOf("frase:" + s0.id + ":") === 0; }), L + "la ronda de frases: frases de la escena");
  var pr = W.session(s0.id + ":prod", st, {});
  ok(pr.length === W.items(s0.id).length && pr.every(function (it) { return it.src === "trabajo"; }), L + "la ronda de producción: los ítems de la escena");
  ok(!W.session("t-nada:prod", st).length, L + "una escena que no existe no arma ronda");
  W.roundDone(st, s0.id + ":prod", 50);
  ok(W.missions(wk, st)[0].half && !W.done(st, s0.id), L + "empezada: a medias");
  W.roundDone(st, s0.id + ":prod", 83);
  W.roundDone(st, s0.id + ":prod", 40);
  ok(st.trabajo[s0.id].p === 83, L + "queda el mejor porcentaje");
  W.roundDone(st, s0.id + ":frasi", 70);
  ok(st.trabajo[s0.id].f === 70, L + "y el de las frases, aparte");
  var txt = [];
  for (var i = 0; i < s0.compito.min; i++) txt.push(code === "it" ? "parola" : "palavra");
  var short = W.review(st, s0.id, txt.slice(0, 5).join(" "), { findings: [] });
  ok(!short.first && !short.xp && !W.done(st, s0.id), L + "una tarea corta no paga ni cierra la misión");
  var r1 = W.review(st, s0.id, txt.join(" "), { findings: [] });
  ok(r1.first && r1.xp > 0 && W.done(st, s0.id) && W.missions(wk, st)[0].done, L + "la tarea a su largo paga y cierra la misión");
  var r2 = W.review(st, s0.id, txt.join(" "), { findings: [] });
  ok(!r2.first && !r2.xp, L + "la segunda vez no vuelve a pagar");
  ok(Array.isArray(W.review(st, s0.id, txt.slice(0, 8).join(" ")).findings), L + "sin corrector de prueba usa Scrivi.check de la semana");
  ok(W.togglePoint(st, s0.id, 1) && !W.togglePoint(st, s0.id, 1), L + "los puntos se marcan y se desmarcan");

  /* --------------------------------------------------------- el repaso */
  var Dr = ctx.Drills, id0 = "trab:" + s0.id + ":0", fid = "frase:" + s0.id + ":0";
  var stR = { unlocked: 52, cards: {} };
  stR.cards[id0] = { due: Date.now() - 1000, reps: 0, s: 1, d: 5, state: "learn" };
  stR.cards[fid] = { due: Date.now() - 1000, reps: 0, s: 1, d: 5, state: "learn" };
  var due = Dr.dueList({}, stR).map(function (x) { return x.id; });
  ok(due.indexOf(id0) >= 0 && due.indexOf(fid) >= 0, L + "las fichas de trabajo vencidas entran en el repaso");
  var rev = Dr.buildReview(course, stR, 20, { map: {} });
  var back = rev.filter(function (it) { return it.id === id0; })[0];
  ok(back && back.answer === W.items(s0.id)[0].answer && rev.some(function (it) { return it.id === fid; }),
     L + "el repaso rearma el ítem y la frase de trabajo");

  /* ------------------------------------------------------ el guardado */
  var saved = ctx.Engine.fromRaw ? ctx.Engine.fromRaw(JSON.stringify({ unlocked: 3, cards: {}, trabajo: "roto" })) : null;
  ok(!saved || !("trabajo" in saved) || typeof saved.trabajo === "object", L + "un state.trabajo roto se descarta al cargar");

  /* ------------------------------------------------------ la pantalla */
  var shown = [], toasts = [], rounds = [], store = { unlocked: s0.week, cards: {} };
  W.attach({ state: function () { return store; }, persist: function () {}, render: function () {}, go: function () {},
             toast: function (t) { toasts.push(t); }, gain: function () {}, show: function (x) { shown.push(x); },
             toWeek: function () {}, ui: function () { return {}; }, lexicon: function () {}, speak: function () { return null; },
             startRound: function (k, a) { rounds.push([k, a]); } });
  var late = list[list.length - 1];
  W.open(late.id, "frasi");
  ok(!shown.length && /semana/.test(toasts[0] || ""), L + "una escena de una semana que no llegó no se abre");
  W.open(s0.id, "frasi");
  ok(shown[0] === "trabajo" && W.owns("trabajo"), L + "la escena abre su pantalla");
  var html = W.render("trabajo");
  ok((html.match(/data-trsay="/g) || []).length === s0.dialogo.length, L + "un 🔊 por turno del diálogo");
  ok((html.match(/class="tr-f"/g) || []).length === s0.phrases.length, L + "las frases, cada una con su nota");
  ok(new RegExp('<span lang="' + ctx.LANG.tts + '">').test(html), L + "la lengua meta con su lang");
  ok(/id="trfrasi"/.test(html) && /id="trprod"/.test(html) && /id="trtext"/.test(html), L + "practicar, escribir y la tarea");
  ok(!/tr-model/.test(html), L + "el modelo no aparece antes de escribir");
  ok(!/tr-es/.test(html), L + "la traducción, oculta al principio");
  W.current().es = true;
  ok((W.render("trabajo").match(/tr-es/g) || []).length === s0.dialogo.length, L + "«Ver la traducción» la muestra");
  store.trabajo = { };
  store.trabajo[s0.id] = { t: "x", n: 1, k: [] };
  ok(/tr-model/.test(W.render("trabajo")), L + "con el texto escrito, el modelo");
  ok(W.reopen(s0.id + ":prod") && shown[shown.length - 1] === "trabajo", L + "al terminar la ronda vuelve a la escena");
  var fold = W.allenaFold(store, s0.week, ["Otoño", "Invierno", "Primavera", "Verano"]);
  ok(new RegExp('data-trabajo="' + s0.id + '"').test(fold) && new RegExp('data-trabajo="' + late.id + '"[^>]*disabled').test(fold),
     L + "Allena: las pasadas se abren, las que vienen no");
  ok(W.weekButtons(store, s0.week).length === 1 && !W.weekButtons(store, s0.week - 1).length, L + "la escena de esta semana, arriba en Allena");
});

T.done();
