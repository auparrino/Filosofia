/* Controles del banco de frases, del laboratorio, de los duelos y de las
   mecánicas de enganche (meta del día, escudos de la racha, cofre, pausa,
   relámpago).
   Run: node tools/pt/test_frasi.js  */
var fs = require("fs");
var path = require("path");
var pack = require("../lib/pack.js");

var ctx = pack("pt");
var Frasi = ctx.Frasi;
var Engine = ctx.Engine;
var Drills = ctx.Drills;
var Lab = ctx.Lab;
var Duelli = ctx.Duelli;
var Letture = ctx.Letture;
var course = pack.data("pt", "course.json");

var T = require("../lib/testkit.js")("pt"), ok = T.ok;
function uniq(a) {
  var m = {};
  a.forEach(function (x) { m[x] = true; });
  return Object.keys(m).length === a.length;
}

// TENSE_WEEK del temario (tools/curriculo.py): nada antes de su teoría.
var TW = {};
(function () {
  var src = fs.readFileSync(path.join(__dirname, "curriculo.py"), "utf8");
  var m = /TENSE_WEEK\s*=\s*\{([\s\S]*?)\}/.exec(src);
  (m ? m[1] : "").replace(/"(\w+)"\s*:\s*(\d+)/g, function (_, k, w) { TW[k] = +w; });
})();
ok(TW.perfeito === 11 && TW.subjPresente === 23, "TENSE_WEEK leído del temario");

/* ------------------------------------------------------------- el banco */

ok(Frasi.SCENES.length >= 20, "al menos 20 escenas: " + Frasi.SCENES.length);
ok(Frasi.ALL.length >= 360, "al menos 360 frases: " + Frasi.ALL.length);
ok(uniq(Frasi.ALL.map(function (f) { return f.id; })), "ids de frase únicos");
ok(uniq(Frasi.ALL.map(function (f) { return f.it; })), "ninguna frase portuguesa repetida");
ok(uniq(Frasi.SCENES.map(function (s) { return s.id; })), "ids de escena únicos");
Frasi.ALL.forEach(function (f) {
  ok(f.it && f.es, "frase incompleta: " + f.id);
  ok(f.pt === f.it, "pt = it: " + f.id);
  ok(Frasi.words(f.it).length >= 1, "frase sin palabras: " + f.id);
  ok(!/\s{2}/.test(f.it) && f.it === f.it.trim(), "espacios de más: " + f.id);
  ok(!/[—–]/.test(f.it), "guion largo en la frase (se vuelve ficha): " + f.id);
  // Ortografía del Acuerdo de 1990 y errores de hispanohablante que no
  // deberían estar en el banco.
  ok(!/\b(idéia|vôo|lingüiça|cinqüenta|freqüente|pára|muy|más|ñ)\b|ñ|ll(?!e)/i.test(f.it) || /Gonzalez/.test(f.it),
     "grafía sospechosa: " + f.id + " «" + f.it + "»");
});
Frasi.SCENES.forEach(function (s) {
  ok(Frasi.ofScene(s.id).length >= 12, "escena corta: " + s.id);
  ok(s.week >= 1 && s.week <= 52 && s.week === Math.round(s.week), "escena sin semana válida: " + s.id);
  ok(Frasi.SCENE_WEEK[s.id] === s.week, "SCENE_WEEK: " + s.id);
});
ok(Frasi.SCENES.filter(function (s) { return s.week >= 27; }).length >= 5,
   "contenido B1+ (semana 27 en adelante): al menos 5 escenas");

// Nada antes de su teoría: formas que delatan un tiempo, en escenas que se
// abren antes de su semana.
var TENSE_FORMS = {
  subjPresente: ["seja", "sejam", "esteja", "estejam", "tenha", "tenham", "venha", "venham",
                 "faça", "façam", "possa", "possam", "queira", "saiba", "goste", "fique", "participem"],
  subjFuturo: ["vier", "tiver", "puder", "quiser", "fizer", "souber", "disser", "estiver", "vierem",
               "tiverem", "puderem", "fizerem"],
  subjImperfeito: ["fosse", "tivesse", "pudesse", "quisesse", "fizesse", "estivesse"],
  futuro: ["será", "terá", "fará", "irá", "choverá", "estará"],
  condicional: ["seria", "gostaria", "poderia", "deveria", "diria", "faria"]
};
Frasi.ALL.forEach(function (f) {
  // «Ou seja» (o sea) es una fórmula fija, no un subjuntivo que se enseña.
  var w = Frasi.words(f.it.replace(/\bou seja\b/gi, ""));
  Object.keys(TENSE_FORMS).forEach(function (t) {
    var bad = TENSE_FORMS[t].filter(function (x) { return w.indexOf(Frasi.words(x)[0]) >= 0; });
    ok(!bad.length || f.week >= TW[t], "«" + bad.join(", ") + "» (" + t + ", semana " + TW[t] + ") en la escena " +
       f.scene + " (semana " + f.week + "): " + f.it);
  });
});

/* ---------------------------------------------- errores de hispanohablante */

function trapOf(s) { return Frasi.traps(s, function () { return 0.3; }); }
ok(trapOf("Muito obrigado!").indexOf("Muy obrigado!") >= 0, "muito → muy");
ok(trapOf("Vamos à praia?").indexOf("Vamos a la praia?") >= 0, "à → a la");
ok(trapOf("Moro no Rio.").indexOf("Moro en el Rio.") >= 0, "no → en el");
ok(trapOf("Até amanhã!").indexOf("Até amañã!") >= 0, "nh → ñ");
ok(trapOf("Tenho muito trabalho.").some(function (t) { return /trabajo|traballo/.test(t); }), "trabalho → trabajo / traballo");
ok(trapOf("Oi, tudo bem?").indexOf("Oi, todo bem?") >= 0, "tudo → todo");
ok(trapOf("Minha avó mora em Niterói.").every(function (t) { return /Niterói/.test(t); }), "los nombres no se tocan");
Frasi.ALL.forEach(function (f) {
  Frasi.traps(f.it).forEach(function (t) {
    ok(Frasi.words(t).join(" ") !== Frasi.words(f.it).join(" "), "trampa igual a la frase: " + f.id + " «" + t + "»");
  });
});

/* ------------------------------------------------------- los ejercicios */

Frasi.ALL.forEach(function (f) {
  for (var r = 0; r < 3; r++) {
    var t = Frasi.tilesItem(f);
    // Las fichas justas, en el orden justo, dan la frase.
    var own = Frasi.tileWords(f.it);
    var pool = t.tiles.slice();
    var allThere = own.every(function (w) {
      var k = pool.indexOf(w);
      if (k < 0) return false;
      pool.splice(k, 1);
      return true;
    });
    ok(allThere, "fichas que faltan: " + f.id);
    ok(Frasi.words(own.join(" ")).join(" ") === Frasi.words(f.it).join(" "),
       "las fichas rearman la frase: " + f.id);
    ok(t.tiles.length <= own.length + 3, "demasiadas fichas: " + f.id);
    // Tiles must not give the order away.
    t.tiles.forEach(function (w) {
      ok(!/[.,!?;:…]$/.test(w), "ficha con puntuación: " + f.id + " «" + w + "»");
      ok(!/^[A-ZÀ-Ý]/.test(w) || Frasi.PROPER[w], "ficha con mayúscula inicial: " + f.id + " «" + w + "»");
    });

    var l = Frasi.listenItem(f);
    ok(l.options.indexOf(f.es) >= 0, "escucha sin respuesta: " + f.id);
    ok(uniq(l.options), "escucha con opciones dobles: " + f.id);
    ok(l.options.length === 4, "escucha con " + l.options.length + " opciones: " + f.id);
  }

  // Escribir: la frase exacta, o escrita desde el celular sin tildes ni
  // puntuación, está bien.
  ok(Frasi.gradeWritten(f.it, f.it).verdict === "giusto", "frase exacta: " + f.id);
  var phone = f.it.normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[?!.,«»…;:]/g, "").toLowerCase();
  ok(Frasi.gradeWritten(phone, f.it).verdict === "giusto",
     "sin tildes ni puntos: " + f.id + " (" + phone + ")");
});

ok(Frasi.gradeWritten("Acabei de chgar", "Acabei de chegar.").verdict !== "giusto",
   "una errata no está bien");
ok(Frasi.gradeWritten("Eu queria um pingado e pão de queijo",
                      "Eu queria um pingado e um pão de queijo.").verdict === "quasi",
   "una palabra que falta en una frase larga = casi");
ok(Frasi.gradeWritten("um pão de queijo e um pingado eu queria",
                      "Eu queria um pingado e um pão de queijo.").verdict !== "giusto",
   "el orden de las palabras cuenta");
ok(Frasi.gradeWritten("", "Oi!").verdict === "sbagliato", "respuesta vacía");
ok(Frasi.gradeWritten("me passa um copo dagua", "Me passa um copo d'água?").verdict === "giusto",
   "el apóstrofo no cuenta");
ok(Frasi.gradeWritten("mudam se os tempos mudam se as vontades", "Mudam-se os tempos, mudam-se as vontades.").verdict === "giusto",
   "el guion del clítico cuenta como espacio");
ok(Frasi.gradeWritten("Muy obrigado", "Muito obrigado!").verdict !== "giusto", "muy no es muito");

/* ---------------------------------------------------- sesiones de escena */

var cards = {};
Frasi.SCENES.forEach(function (s) {
  var sess = Frasi.sceneSession(s.id, cards, {});
  // A new phrase is met once (presented or guessed) and retrieved once.
  // (a guessed one is also shown on its card: «Adiviná», then «Frase nueva»)
  var intros = sess.filter(function (it) { return it.type === "intro"; });
  ok(intros.length === 6, "6 frases nuevas por sesión: " + s.id);
  var times = {}; sess.forEach(function (it) { times[it.id] = (times[it.id] || 0) + 1; });
  ok(Object.keys(times).every(function (k) { return times[k] <= 3; }), "cada frase como mucho 3 veces por sesión: " + s.id);
  ok(sess.length >= 8, "sesión demasiado corta: " + s.id);
  sess.forEach(function (it) {
    ok(it.answer && it.frase && Frasi.BY_ID[it.id], "ítem de escena mal formado: " + s.id);
    if (it.type !== "intro") cards[it.id] = Engine.schedule(cards[it.id], 2);
  });
  var silent = Frasi.sceneSession(s.id, cards, { silent: true });
  ok(silent.every(function (it) { return it.type !== "listen"; }),
     "en modo oficina no hay escucha automática: " + s.id);
});
var p = Frasi.progress("oi", cards);
ok(p.seen === 6 && p.total === Frasi.ofScene("oi").length, "progreso de escena");
ok(Frasi.openScenes(1).length === 1 && Frasi.openScenes(52).length === Frasi.SCENES.length, "escenas abiertas por semana");

/* -------------------------------------------------- repaso con frases */

var st = Engine.blankSave();
Frasi.ofScene("boteco").forEach(function (f) {
  st.cards[f.id] = Engine.schedule(null, 2);
  st.cards[f.id].due = Date.now() - 1000;
});
ok(Drills.dueCount(course, st) === Frasi.ofScene("boteco").length,
   "las frases vencidas cuentan en el repaso");
var rev = Drills.buildReview(course, st, 50);
ok(rev.length === Frasi.ofScene("boteco").length, "el repaso regenera las frases");
rev.forEach(function (it) { ok(it.frase && it.type !== "intro", "repaso de frase válido"); });

/* ---------------------------------------------------- pausa y relámpago */

course.weeks.forEach(function (w) {
  var s = Engine.blankSave();
  var items = Drills.buildPausa(course, s, w, {});
  ok(items.length >= 5 && items.length <= 10, "pausa de largo justo, semana " + w.week);
  items.forEach(function (it) {
    if (it.src !== "frasi" && it.src !== "lab") {
      ok(it.type !== "cloze" && it.type !== "translate",
         "en la pausa no hay preguntas para escribir del libro, semana " + w.week);
    }
    if (it.type === "choice") ok(it.options.indexOf(it.answer) >= 0, "pausa: elección sin respuesta");
  });
});

var ls = Engine.blankSave();
for (var i = 0; i < 300; i++) {
  var li = Drills.lampoItem(ls);
  ok(li.options.indexOf(li.answer) >= 0 && uniq(li.options) && li.options.length === 4,
     "relámpago con opciones válidas");
}

/* --------------------------------------------------------- laboratorio */

ok(uniq(Object.keys(Lab.BY_ID)), "ids del laboratorio únicos");
ok(uniq(Lab.RULES.map(function (r) { return r.id; })), "ids de regla únicos");
var ponteN = 0;
Lab.RULES.forEach(function (r) {
  ponteN += r.words.length;
  ok(r.words.length >= 10, "regla ponte con pocas palabras: " + r.id);
  ok(r.week >= 1 && r.week <= 52, "regla ponte sin semana: " + r.id);
  ok(uniq(r.words.map(function (w) { return w[0]; })), "palabras repetidas en la regla " + r.id);
  r.words.forEach(function (w) { ok(w[0] !== w[1], "cognado idéntico: " + r.id + " " + w[0]); });
});
ok(ponteN >= 150, "al menos 150 cognados: " + ponteN);
ok(Lab.FALSI.length >= 100, "al menos 100 falsos amigos: " + Lab.FALSI.length);
ok(uniq(Lab.FALSI.map(function (f) { return f[0]; })), "falsos amigos repetidos");
ok(uniq(Lab.FALSI.map(function (f) { return f[1]; })), "significados de falsos amigos repetidos");
Lab.FALSI.forEach(function (f) { ok(f[1] !== f[2] && f[3], "falso amigo mal formado: " + f[0]); });
ok(Lab.FALSI_WEEK >= 1 && Lab.FALSI_WEEK <= 52, "semana de los falsos amigos");
Object.keys(Lab.BY_ID).forEach(function (id) {
  for (var k = 0; k < 3; k++) {
    var it = Lab.item(id);
    ok(Engine.grade(it.answer, it) === "giusto", "la respuesta del laboratorio se acepta: " + id);
    if (it.type === "choice") {
      ok(it.options.indexOf(it.answer) >= 0, "opción justa presente: " + id);
      ok(uniq(it.options), "opciones dobles: " + id);
      if (it.lab === "falsi") ok(it.options.indexOf(it.trap) >= 0, "el falso amigo muestra la trampa: " + id);
    }
  }
});
var CAPIRE_TENSE = { tempo: "imperfeito", composto: "perfeitoComposto", certeza: "subjPresente",
                     cortesia: "condicional", futsubj: "subjFuturo", infpessoal: "infPessoal" };
Lab.CAPIRE.forEach(function (c) {
  c.items.forEach(function (x) {
    ok(c.opts.indexOf(x[1]) >= 0, "capire: respuesta fuera de las opciones: " + x[0]);
  });
  // Every option of a set is the right answer at least once: the form decides.
  c.opts.forEach(function (o) {
    ok(c.items.some(function (x) { return x[1] === o; }), "capire " + c.id + ": opción nunca justa: " + o);
  });
  if (CAPIRE_TENSE[c.id]) ok(c.week >= TW[CAPIRE_TENSE[c.id]], "capire " + c.id + " antes de su teoría");
  ok(uniq(c.items.map(function (x) { return x[0]; })), "capire " + c.id + ": oraciones repetidas");
});
var ps = Lab.ponteSession({});
ok(ps[0].type === "card" && ps.length >= 9, "ponte: primero la regla, después las palabras");
ok(Lab.capireSession({})[0].type === "card", "capire: primero la explicación");
ok(Lab.capireSession({}, null, 1).length === 0, "capire: nada abierto en la semana 1");
ok(Lab.falsiSession({}).length === 10, "falsos amigos: 10 preguntas");
for (var r2 = 0; r2 < 50; r2++) ok(!!Lab.randomItem({}), "ítem al azar del laboratorio");
for (var r3 = 0; r3 < 50; r3++) {
  var ri = Lab.randomItem({}, 3);
  ok(ri && (!ri.week || ri.week <= 3) && ri.lab !== "falsi", "ítem al azar respeta la semana");
}

var lst = Engine.blankSave();
Object.keys(Lab.BY_ID).slice(0, 20).forEach(function (id) {
  lst.cards[id] = Engine.schedule(null, 2);
  lst.cards[id].due = Date.now() - 1;
});
ok(Drills.buildReview(course, lst, 50).length === 20, "el repaso incluye el laboratorio");

/* --------------------------------------------------------------- duelos */

ok(Duelli.DUELLI.length === 8, "ocho duelos");
ok(uniq(Duelli.DUELLI.map(function (d) { return d.id; })), "ids de duelo únicos");
var DUEL_TENSE = { passado: ["imperfeito"], composto: ["perfeitoComposto"], subjuntivo: ["subjPresente"],
                   futinf: ["subjFuturo", "infPessoal"] };
Duelli.DUELLI.forEach(function (d) {
  ok(d.items.length >= 20, "duelo corto: " + d.id);
  (DUEL_TENSE[d.id] || []).forEach(function (t) { ok(d.week >= TW[t], "duelo " + d.id + " antes de " + t); });
  var sides = [0, 0];
  d.items.forEach(function (x, k) {
    sides[Duelli.side(d, x)]++;
    ok((x.s.match(/___/g) || []).length === 1, "duelo " + d.id + ":" + k + " sin un único hueco");
    ok(x.a !== x.b, "duelo " + d.id + ":" + k + " con las dos formas iguales");
    ok(Duelli.filled(x).toLowerCase().indexOf(x.cue.toLowerCase()) >= 0, "la pista no está en la oración: " + d.id + ":" + k);
    ok(x.why, "duelo sin regla: " + d.id + ":" + k);
    for (var z = 0; z < 5; z++) {
      var c = Duelli.cueItem(d, k);
      ok(c && c.options.length === 3 && uniq(c.options) && c.options.indexOf(c.answer) >= 0,
         "pista mal formada: " + d.id + ":" + k);
    }
    var it = Duelli.reviewItem("duel:" + d.id + ":" + k);
    ok(it && it.options.indexOf(it.answer) >= 0, "ítem de repaso del duelo: " + d.id + ":" + k);
  });
  ok(sides[0] >= 8 && sides[1] >= 8, "duelo desequilibrado: " + d.id + " " + sides.join("/"));
  var sess = Duelli.session(d.id, {});
  ok(sess.filter(function (x) { return !x.cue; }).length === 8, "sesión de duelo: 8 oraciones: " + d.id);
});
ok(Duelli.open(1).length === 1 && Duelli.open(52).length === 8, "duelos abiertos por semana");

/* ------------------------------------------------------------- lecturas */

ok(Letture.EPISODI.length >= 10, "al menos 10 lecturas");
ok(uniq(Letture.EPISODI.map(function (e) { return e.id; })), "ids de lectura únicos");
Letture.EPISODI.forEach(function (ep) {
  var toks = Letture.allTokens(ep);
  ok(toks.length >= 60, "largo de la lectura " + ep.id + ": " + toks.length);
  Object.keys(ep.gloss || {}).forEach(function (k) {
    ok(toks.some(function (t) { return Letture.glossFor(ep, t) === ep.gloss[k]; }),
       "glosa sin palabra en el texto: " + ep.id + "/" + k);
  });
  ((ep.hunt || {}).targets || []).forEach(function (t) {
    ok(toks.some(function (x) { return Letture.bare(x) === t || Letture.core(x) === t; }),
       "caza: forma ausente del texto: " + ep.id + "/" + t);
  });
  (ep.questions || []).forEach(function (q) {
    ok(q[1].indexOf(q[2]) >= 0 && uniq(q[1]), "pregunta mal formada: " + ep.id + " " + q[0]);
  });
  if (ep.hunt) {
    var want = Letture.huntTargets(ep);
    ok(Letture.gradeHunt(ep, want).verdict === "giusto", "caza perfecta = bien: " + ep.id);
    ok(Letture.gradeHunt(ep, []).verdict === "sbagliato", "caza vacía = mal: " + ep.id);
  }
});
if (Letture.byId("ep1") && Letture.byId("ep2")) {
  ok(Letture.isOpen(Letture.byId("ep1"), {}) && !Letture.isOpen(Letture.byId("ep2"), {}),
     "la serie se abre en orden");
  ok(Letture.isOpen(Letture.byId("ep2"), { ep1: { pct: 50 } }), "leída ep1, se abre ep2");
  ok(Letture.next({}).id === "ep1" && Letture.next({ ep1: {} }).id === "ep2", "próximo episodio");
}

/* -------------------------------------------- ejercicios nuevos de frase */

Frasi.ALL.forEach(function (f) {
  var c = Frasi.clozeItem(f);
  if (c.type === "cloze") {
    ok(c.stem.indexOf("___") >= 0, "cloze sin hueco: " + f.id);
    ok(c.stem.replace("___", c.answer) === Frasi.tiles(f.it).join(" "),
       "el hueco rearma la frase: " + f.id);
    ok(Engine.grade(c.answer, c) === "giusto", "cloze: la palabra se acepta: " + f.id);
  }
  var g = Frasi.guessItem(f);
  // null: no possible mistake, the phrase is presented; else 2 or 3 options
  ok(!g || (g.options.indexOf(f.it) >= 0 && uniq(g.options) && g.options.length >= 2 && g.options.length <= 3),
     "adiviná: opciones válidas: " + f.id);
  ok(Frasi.gradeWritten(f.it, Frasi.dictationItem(f).answer).verdict === "giusto",
     "el dictado acepta la frase: " + f.id);
});
var fresh = Frasi.sceneSession("ideias", {}, {});
ok(fresh[0].type === "guess" && fresh[1].type === "intro", "pretest antes de la frase nueva");

/* ----------------------------------- racha, escudos, meta, cofre */

function day(y, m, d, h) { return new Date(y, m - 1, d, h || 12); }

var s = Engine.blankSave();
Engine.touchStreak(s, day(2026, 3, 1));
Engine.touchStreak(s, day(2026, 3, 2));
Engine.touchStreak(s, day(2026, 3, 2, 20));
ok(s.streak === 2, "dos días seguidos: " + s.streak);
ok(s.shields === 1, "se empieza con un escudo");
Engine.touchStreak(s, day(2026, 3, 4));       // se saltea el 3
ok(s.streak === 3 && s.shields === 1 && s.jokerWeek, "el comodín de la semana salva la racha (no el escudo): " + s.streak + "/" + s.shields);
Engine.touchStreak(s, day(2026, 3, 7));       // se saltean el 5 y el 6, sin escudos
ok(s.streak === 1, "sin escudos la racha vuelve a empezar");
for (var d = 8; d <= 13; d++) Engine.touchStreak(s, day(2026, 3, d));
ok(s.streak === 7 && s.shields === 2, "7 días regalan un escudo: " + s.shields);
Engine.touchStreak(s, day(2026, 3, 31));
Engine.touchStreak(s, day(2026, 4, 1));
ok(s.streak === 2, "la racha cruza el cambio de mes");

var g = Engine.blankSave();
g.goal = 50;
var now = day(2026, 5, 10);
ok(Engine.addXp(g, 30, now) === false, "debajo de la meta");
ok(Engine.openChest(g, null, now) === null, "cofre cerrado antes de la meta");
ok(Engine.addXp(g, 25, now) === true, "meta alcanzada una vez");
ok(Engine.addXp(g, 25, now) === false, "y no se repite el mismo día");
ok(Engine.todayXp(g, now) === 80 && g.xp === 80, "xp del día y total");
var before = g.xp;
var prize = Engine.openChest(g, function () { return 0.9; }, now);
ok(prize && prize.xp > 0 && g.xp === before + prize.xp, "el cofre paga");
ok(Engine.openChest(g, null, now) === null, "un cofre por día");
ok(Engine.lastDays(g, 28, now).length === 28, "calendario de 28 días");
ok(Engine.lastDays(g, 28, now)[27].xp === 80, "hoy es el último día del calendario");

ok(Engine.rankFor(1) === Engine.RANKS[0][1] && Engine.rankFor(60) === Engine.RANKS[Engine.RANKS.length - 1][1], "grados");

// A save from the old version loads with the new fields filled in.
var old = { xp: 10, cards: {}, badges: [], totals: { attempts: 1, right: 1, close: 0, wrong: 0 } };
ctx.localStorage = { getItem: function () { return JSON.stringify(old); } };
var loaded = Engine.load();
ok(loaded.goal === 200 && loaded.days && loaded.shields === 1,
   "una partida vieja se completa con los campos nuevos (meta 200)");
old = { xp: 10, cards: {}, badges: [], goal: 20, totals: { attempts: 0, right: 0, close: 0, wrong: 0 } };
ok(Engine.load().goal === 200, "una meta fuera de las opciones vuelve a 200");
old = { xp: 10, cards: {}, badges: [], goal: 350, goalV: 2, totals: { attempts: 0, right: 0, close: 0, wrong: 0 } };
ok(Engine.load().goal === 350, "una meta válida no se toca");
ctx.localStorage = null;

// Damaged saves are repaired, not trusted.
var weird = Engine.sanitize({ xp: "abc", cards: null, days: "x", badges: {}, totals: 5, weekStats: [],
  unlocked: 999, streak: -3, errs: { a: null, b: { n: "x" }, ausiliare: { n: 3 } }, errLog: {}, letture: 7,
  best: null, goal: "mucho", shields: 99 });
ok(weird.xp === 0 && weird.unlocked === 52 && weird.streak === 0 && weird.shields === 3,
   "números devueltos a sus límites");
ok(weird.goal === 200 && Array.isArray(weird.badges) && Array.isArray(weird.errLog), "tipos restaurados");
ok(Object.keys(weird.errs).join() === "ausiliare", "entradas de error rotas eliminadas");
ok(typeof weird.totals === "object" && weird.totals.right === 0, "totales reconstruidos");
ok(Engine.sanitize(null).xp === 0 && Engine.sanitize([1, 2]).xp === 0, "partida que no es un objeto");
var goodSave = Engine.blankSave();
goodSave.xp = 1234; goodSave.cards["frase:boteco:1"] = Engine.schedule(null, 2);
var kept = Engine.sanitize(JSON.parse(JSON.stringify(goodSave)));
ok(kept.xp === 1234 && kept.cards["frase:boteco:1"].interval === goodSave.cards["frase:boteco:1"].interval && kept.cards["frase:boteco:1"].s === goodSave.cards["frase:boteco:1"].s, "una partida sana no se toca");

var fdg = Frasi.ofTheDay(day(2026, 6, 1));
ok(fdg === Frasi.ofTheDay(day(2026, 6, 1, 23)), "la frase del día no cambia en el día");

// Clock moved back a day: the streak survives.
var sb = Engine.blankSave(); sb.streak = 10; sb.lastPlayed = Engine.dayKey(day(2026, 9, 23));
Engine.touchStreak(sb, day(2026, 9, 22));
ok(sb.streak === 10, "el reloj atrasado no borra la racha");
Engine.touchStreak(sb, day(2026, 9, 24));
ok(sb.streak === 11, "y al día siguiente la racha sigue");
// Calendar strip: every day once, also across a DST change.
[day(2026, 3, 30, 0), day(2026, 10, 26, 23), day(2026, 3, 29, 12)].forEach(function (d) {
  var ks = Engine.lastDays({}, 7, d).map(function (x) { return x.key; });
  var uniq = ks.filter(function (k, i) { return ks.indexOf(k) === i; });
  ok(uniq.length === 7 && ks[6] === Engine.dayKey(d), "7 días distintos hasta hoy: " + ks.join(" "));
});

T.done();
