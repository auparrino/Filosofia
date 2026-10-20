/* Tres lenguas (docs/js/tres_lenguas.js + docs/lang/tres_lenguas_data.js),
   en los dos idiomas: los datos, el diagnóstico «¡eso es portugués!» /
   «¡eso es italiano!» sin falsas alarmas sobre las palabras del propio
   idioma, el candado (progreso en los dos guardados o activación a mano),
   el duelo y la interfaz sin DOM.
   Run: node tools/lib/test_tres_lenguas.js  */
"use strict";
var pack = require("./pack.js");
var path = require("path");
var Boot = require(path.join(pack.DOCS, "js", "boot.js"));
var DATA = require(path.join(pack.DOCS, "lang", "tres_lenguas_data.js"));

var fails = 0, checks = 0;
function ok(cond, what) { checks++; if (!cond) { fails++; console.log("FAIL " + what); } }

/* --------------------------------------------------------------- datos */

var n = 0, ids = {};
Object.keys(DATA.CONTRASTS).forEach(function (t) {
  ok(DATA.TOPICS.some(function (x) { return x.id === t; }), "tema sin ficha: " + t);
  DATA.CONTRASTS[t].forEach(function (c) {
    n++;
    ok(!ids[t + ":" + c[0]], "id repetido " + c[0]);
    ids[t + ":" + c[0]] = 1;
    for (var k = 1; k <= 5; k++) ok(typeof c[k] === "string" && c[k].trim(), "contraste " + c[0] + " sin campo " + k);
    if (c[6]) ok(c[6].length === 3 && c[6].every(function (s) { return s && s.trim(); }), "ejemplo incompleto " + c[0]);
    ok(!/(hablá|repetí|grabate|pronunciá|en voz alta)/i.test(c[5]), "consigna oral en " + c[0]);
  });
});
ok(n >= 150, "hay " + n + " contrastes (≥ 150)");
ok(DATA.CONTRASTS.gram.length >= 40 && DATA.CONTRASTS.lex.length >= 50 && DATA.CONTRASTS.orto.length >= 20, "los tres temas bien cargados");
DATA.PAIRS.forEach(function (p) { ok(p.length === 3 && p.every(function (s) { return s; }), "par incompleto " + p); });
DATA.DUEL.forEach(function (x) {
  ok(x[1] === "it" || x[1] === "pt", "duelo: lengua " + x[0]);
  if (x[2]) {
    ok(x[0].indexOf(x[2]) >= 0, "duelo: «" + x[2] + "» no está en «" + x[0] + "»");
    ok(x[3] && x[3] !== x[2], "duelo: corrección de " + x[0]);
  }
});

/* --------------------------------------------------------------- boot */

ok(Boot.ORDER.some(function (e) { return e.shared === "tres_lenguas_data.js"; }), "boot carga los datos compartidos");
ok(Boot.coreFiles().indexOf("lang/tres_lenguas_data.js") >= 0, "el service worker guarda los datos compartidos");
ok(Boot.coreFiles().indexOf("js/tres_lenguas.js") >= 0, "el service worker guarda el módulo");
ok(Boot.langFiles("it").indexOf("lang/tres_lenguas_data.js") < 0, "los datos compartidos no son de un paquete");

/* ------------------------------------------------------ por idioma */

function fakeStorage(init) {
  var m = Object.assign({}, init || {});
  return { getItem: function (k) { return k in m ? m[k] : null; }, setItem: function (k, v) { m[k] = String(v); },
           removeItem: function (k) { delete m[k]; }, _m: m };
}

var CASES = {
  it: [["Oggi fa muito caldo", "Oggi fa molto caldo", "molto"], ["Ieri fiz la spesa", "Ieri ho fatto la spesa", "ho fatto"],
       ["La mia família è grande", "La mia famiglia è grande", "famiglia"], ["Torno a casa hoje", "Torno a casa oggi", "oggi"],
       ["Anch'io quero un caffè", "Anch'io voglio un caffè", "voglio"], ["Mia mãe lavora", "Mia madre lavora", "madre"],
       ["Dov'è la estação?", "Dov'è la stazione?", "stazione"], ["Anche io, obrigado", "Anche io, grazie", "grazie"]],
  pt: [["Hoje está molto quente", "Hoje está muito quente", "muito"], ["A minha famiglia é grande", "A minha família é grande", "família"],
       ["Eu anche quero um café", "Eu também quero um café", "também"], ["Io sou argentino", "Eu sou argentino", "eu"],
       ["Ho fatto as compras", "Fiz as compras", "fiz"], ["Tutto bem?", "Tudo bem?", "tudo"],
       ["Vou à spiaggia", "Vou à praia", "praia"], ["Estou com fretta", "Estou com pressa", "pressa"]]
};
// What must keep its own diagnosis (not the other language).
var KEEP = {
  it: [["Oggi fa mucho caldo", "Oggi fa molto caldo"], ["Mio nono è simpatico", "Mio nonno è simpatico"],
       ["Lei e italiana", "Lei è italiana"], ["Vado a il cinema", "Vado al cinema"], ["Ieri ho andato al cinema", "Ieri sono andato al cinema"]],
  pt: [["Vou a o cinema", "Vou ao cinema"], ["Eu muitto", "Eu muito"], ["Yo sou argentino", "Eu sou argentino"],
       ["Eu tenho comido", "Eu comi"], ["Ela e bonita", "Ela é bonita"]]
};

pack.LANGS.forEach(function (code) {
  var other = code === "it" ? "pt" : "it";
  var storage = fakeStorage();
  var ctx = pack(code, { extra: { localStorage: storage } });
  var bank = pack.data(code, "bank.json");
  ctx.Banca.load(bank);
  var D = ctx.Diagnosi, T = ctx.TresLenguas;
  var tag = "[" + code + "] ";
  ok(T && T.HOME === code && T.OTHER === other, tag + "módulo cargado con la lengua en uso");
  ok(D.LABEL.otra_lengua && D.LABEL.otra_lengua.toLowerCase().indexOf(DATA.LANGS[other].name) >= 0, tag + "categoría con nombre: " + D.LABEL.otra_lengua);
  ok(D.SEVERITY.otra_lengua > 0, tag + "severidad");

  CASES[code].forEach(function (c) {
    var d = D.diagnose(c[0], [c[1]]);
    ok(d.cat === "otra_lengua", tag + c[0] + " → " + d.cat);
    ok(d.verdict === "sbagliato", tag + c[0] + " no pasa como casi");
    ok(/^¡Eso es /.test(d.hint) && d.hint.indexOf(DATA.LANGS[other].name) >= 0, tag + "pista «¡eso es…!»: " + d.hint);
    ok(d.explain.indexOf("*" + c[2] + "*") >= 0, tag + c[0] + ": la forma correcta " + c[2] + " en «" + d.explain + "»");
    ok((d.given || []).some(function (t) { return t.bad; }), tag + c[0] + ": palabra marcada");
  });
  // A multiple-choice option in the other language
  var mc = code === "it" ? D.explainChoice("muito", "molto", {}) : D.explainChoice("molto", "muito", {});
  ok(mc && mc.cat === "otra_lengua", tag + "opción múltiple: " + (mc && mc.cat));
  KEEP[code].forEach(function (c) {
    var d = D.diagnose(c[0], [c[1]]);
    ok(d.cat !== "otra_lengua", tag + c[0] + " sigue siendo " + d.cat);
  });
  ok(D.diagnose(c1(code), [c1(code)]).verdict === "giusto", tag + "lo correcto sigue correcto");

  // Every mixed duel sentence of this language is caught.
  DATA.DUEL.filter(function (x) { return x[1] === code && x[2]; }).forEach(function (x) {
    var d = D.diagnose(x[0], [x[0].replace(x[2], x[3])]);
    ok(d.cat === "otra_lengua" && d.explain.indexOf(x[3]) >= 0, tag + "duelo: " + x[0] + " → " + d.cat + " / " + d.explain);
  });
  // No false alarms: no word of the language (bank) and no pure duel item.
  var words = [];
  (bank.nouns || []).forEach(function (w) { words.push(w[0], w[2]); });
  (bank.adjectives || []).forEach(function (w) { words.push(w[0], w[1], w[2], w[3]); });
  (bank.verbs || []).forEach(function (w) { words.push(w[0]); });
  (bank.words || []).forEach(function (w) { if (w[0].indexOf(" ") < 0) words.push(w[0]); });
  var fp = words.filter(function (w) { return w && T.intruders(String(w).toLowerCase(), ["zzz"]).length; });
  ok(fp.length === 0, tag + "palabras del banco tomadas por la otra lengua: " + fp.slice(0, 12).join(", ") + " (" + fp.length + "/" + words.length + ")");
  DATA.DUEL.filter(function (x) { return x[1] === code && !x[2]; }).forEach(function (x) {
    ok(T.intruders(x[0], ["zzz"]).length === 0, tag + "falsa alarma en «" + x[0] + "»");
  });
  // A doubled letter in a word of the answer is a typo, not the other language.
  if (code === "pt") [["Moro na cidde grande", "Moro na cidade grande"], ["É veradde", "É verdade"],
                      ["Ultimmente trabalho muito", "Ultimamente trabalho muito"]].forEach(function (x) {
    ok(T.intruders(x[0], [x[1]]).length === 0, tag + "tipeo con doble tomado por italiano: " + x[0]);
  });
  if (code === "it") ok(T.intruders("Vuoi quaclhe cosa?", ["Vuoi qualche cosa?"]).length === 0, tag + "tipeo con lh tomado por portugués");
  // The course's own sentences (bank) are never taken for the other language.
  var sents = (bank.sentences || []).map(function (s) { return s[0]; }).filter(Boolean);
  var fps = sents.filter(function (s) { return T.intruders(s, ["zzz"]).length; });
  ok(fps.length <= Math.max(2, sents.length * 0.005), tag + "oraciones del banco con falsa alarma: " + fps.length + "/" + sents.length + " " + fps.slice(0, 5).join(" | "));

  // The lock: progress in both saves, or by hand.
  var st = function (xp) { return JSON.stringify({ xp: xp, cards: {} }); };
  ok(!T.available({ xp: 0, cards: {} }), tag + "cerrado sin progreso");
  storage.setItem(DATA.LANGS[code].storage + ".save.v1", st(40));
  ok(!T.available(null), tag + "cerrado con un solo idioma");
  storage.setItem(DATA.LANGS[other].storage + ".save.v1", st(10));
  ok(T.available(null), tag + "abierto con los dos idiomas");
  storage.removeItem(DATA.LANGS[other].storage + ".save.v1");
  ok(T.available({ xp: 5, cards: {} }) === false, tag + "el estado propio no alcanza");
  // Lo que se guarda va en el estado del idioma (state.tres), no suelto en localStorage.
  var S = { xp: 5, cards: {} };
  T.use(function () { return S; });
  T.enable(true);
  ok(T.available(S) && S.tres && S.tres.on === true, tag + "abierto a mano, guardado en state.tres");
  ok(storage.getItem(T.KEY) === null, tag + "no escribe en la clave vieja");
  T.enable(false);
  ok(!T.available(S), tag + "cerrado otra vez");
  // El guardado viejo (c1.tres.v1) se copia una vez al estado del idioma.
  storage.setItem(T.KEY, JSON.stringify({ on: true, best: { duel: 70 }, rounds: 3 }));
  var S2 = { xp: 1, cards: {} };
  ok(T.store(S2).on === true && S2.tres.best.duel === 70 && S2.tres.rounds === 3, tag + "copia el guardado viejo");
  S2.tres.on = false;
  ok(T.store(S2).on === false, tag + "la copia se hace una sola vez");
  storage.removeItem(T.KEY);

  // The duel round
  var s = T.duelSession(Math.random, 10);
  ok(s.length === 10, tag + "ronda de 10");
  ok(s.filter(function (x) { return x.bad; }).length === 4, tag + "cuatro con palabra colada");
  ok(s.some(function (x) { return !x.bad && x.l === "it"; }) && s.some(function (x) { return !x.bad && x.l === "pt"; }), tag + "las dos lenguas");

  // The interface without DOM: card, menu, topics, a whole duel.
  var gained = 0, shown = 0;
  var S3 = { xp: 0, cards: {} };
  T.wire(null, { show: function () { shown++; }, back: function () {}, gain: function (x) { gained += x; }, toast: function () {},
                 state: function () { return S3; }, persist: function () {} });
  var shut = T.card(S3);
  ok(/data-tres="on"/.test(shut) && /data-tres="menu"/.test(shut), tag + "los contrastes siempre abiertos; el duelo, con «activar»");
  T.enable(true);
  var card = T.card(S3);
  ok(/data-tres="menu"/.test(card) && /data-tres="duel"/.test(card), tag + "tarjeta abierta");
  ok(/data-tres="topic"/.test(T.render()), tag + "menú de temas");
  DATA.TOPICS.forEach(function (t) {
    T._ui.screen = "topic"; T._ui.topic = t.id;
    var h = T.render();
    ok((h.match(/<details/g) || []).length === DATA.CONTRASTS[t.id].length, tag + "tema " + t.id + " completo");
  });
  T._ui.screen = "duel";
  T._ui.duel = { items: T.duelSession(Math.random, 10), i: 0, step: "lang", pts: 0, max: 0, log: [], fails: [] };
  var btn = function (attrs, text) { return { getAttribute: function (k) { return attrs[k]; }, textContent: text || "" }; };
  var guard = 0;
  while (T._ui.duel.i < T._ui.duel.items.length && guard++ < 100) {
    var x = T._ui.duel.items[T._ui.duel.i], step = T._ui.duel.step;
    var html = T.render();
    ok(html.indexOf("data-tres") >= 0, tag + "duelo dibuja " + step);
    if (step === "lang") T._act("lang", btn({ "data-l": x.l }));
    else if (step === "check") x.bad ? T._act("tok", btn({}, x.bad)) : T._act("clean", btn({}));
    else if (step === "fix") T._act("fix", btn({ "data-k": String(T._ui.duel.opts.indexOf(x.fix)) }));
    else T._act("next", btn({}));
  }
  ok(T._ui.duel.pts === T._ui.duel.max && T._ui.duel.max > 10, tag + "duelo perfecto: " + T._ui.duel.pts + "/" + T._ui.duel.max);
  ok(/100 %/.test(T.render()), tag + "resultado 100 %");
  ok(gained > 0, tag + "suma xp");
  ok(S3.tres.best.duel === 100 && S3.tres.rounds === 1, tag + "guarda el mejor en state.tres");
  ok(!Object.keys(S3.cards).some(function (k) { return /^tres:/.test(k); }), tag + "un duelo perfecto no manda nada al repaso");
  // Un duelo con errores: lo fallado vuelve como ficha.
  T._ui.screen = "duel";
  T._ui.duel = { items: T.duelSession(Math.random, 10), i: 0, step: "lang", pts: 0, max: 0, log: [], fails: [] };
  guard = 0;
  while (T._ui.duel.i < T._ui.duel.items.length && guard++ < 100) {
    var y = T._ui.duel.items[T._ui.duel.i], st2 = T._ui.duel.step;
    T.render();
    if (st2 === "lang") T._act("lang", btn({ "data-l": y.l === "it" ? "pt" : "it" }));
    else if (st2 === "check") T._act("clean", btn({}));
    else if (st2 === "fix") T._act("fix", btn({ "data-k": String(T._ui.duel.opts.indexOf(y.bad)) }));
    else T._act("next", btn({}));
  }
  var tres = Object.keys(S3.cards).filter(function (k) { return /^tres:\d+$/.test(k); });
  ok(tres.length >= 8, tag + "lo fallado va al repaso: " + tres.length + " fichas");
  ok(/vuelven en tu repaso/.test(T.render()), tag + "el resultado lo dice");
  // Cada ítem del duelo sabe volver como ficha: opción múltiple con la respuesta entre las opciones.
  DATA.DUEL.forEach(function (x, k) {
    var it = T.reviewItem("tres:" + k);
    ok(it && it.type === "choice" && it.options.indexOf(it.answer) >= 0 && it.options.length >= 2, tag + "ficha del duelo " + k + " «" + x[0] + "»");
    if (it && x[2] && /Cómo se dice «/.test(it.prompt)) ok(it.options.length === new Set(it.options).size, tag + "opciones distintas " + k);
  });
  ok(T.reviewItem("tres:99999") === null && T.reviewItem("duel:x:1") === null, tag + "ids ajenos: nada");
  T.enable(false);
  T.use(null);
});

function c1(code) { return code === "it" ? "Oggi fa molto caldo" : "Hoje está muito quente"; }

console.log((fails ? "✗ " : "✓ ") + (checks - fails) + "/" + checks + " chequeos de Tres lenguas");
process.exit(fails ? 1 : 0);
