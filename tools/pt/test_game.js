/* Rumo C1 — controles del curso compilado y de la lógica del juego.
   Corre: node tools/pt/test_game.js
   Lee docs/lang/pt/data/course.json (lo arma tools/pt/build_course.py), el
   conjugador portugués (docs/lang/pt/conjugator.js) y el temario
   (tools/pt/curriculo.py), con el núcleo cargado por tools/lib/pack.js. */
var fs = require("fs");
var path = require("path");
var pack = require("../lib/pack.js");

var ROOT = pack.ROOT;
var ctx = pack("pt");
var Conj = ctx.Conj;
var Engine = ctx.Engine;
var Drills = ctx.Drills;
var Lez = ctx.Lezione;

var course = pack.data("pt", "course.json");

var T = require("../lib/testkit.js")("pt"), ok = T.ok;

/* ------------------------------------------------ integridad de los datos */

ok(course.weeks.length === 52, "52 semanas");
ok(course.seasons.length === 4, "4 estaciones");

var ids = {};
course.items.forEach(function (it) {
  ok(!ids[it.id], "id duplicado: " + it.id);
  ids[it.id] = it;
  ok(!!it.answer, "ítem sin respuesta: " + it.id);
  ok(!!it.stem, "ítem sin enunciado: " + it.id);
  ok(!!it.prompt, "ítem sin consigna: " + it.id);
  if (it.type === "choice") {
    ok(it.options && it.options.length >= 2, "pocas opciones: " + it.id);
    ok(it.options.indexOf(it.answer) >= 0, "respuesta fuera de las opciones: " + it.id);
  }
});

course.weeks.forEach(function (w) {
  ok(w.items.length > 0 || (w.verbs && w.verbs.length),
     "semana " + w.week + " sin contenido jugable");
  w.items.forEach(function (id) {
    ok(!!ids[id], "la semana " + w.week + " apunta a un ítem que no existe: " + id);
  });
  ok(w.keys && w.keys.length >= 3, "semana " + w.week + " sin briefing");
  (w.verbs || []).forEach(function (v) {
    ok(Conj.VERBS[v], "semana " + w.week + ": verbo desconocido " + v);
  });
  (w.tenses || []).forEach(function (t) {
    ok(Conj.TENSE_LABELS[t], "semana " + w.week + ": tiempo desconocido " + t);
  });
});

/* Nada antes de su teoría: build_course.py marca en «wk» la primera semana
   cuyas lecciones cubren todo lo que un ítem usa (tools/sillabo.py), y
   ninguna semana puede pedir algo posterior.  Las semanas de cada tiempo
   salen de tools/curriculo.py (TENSE_WEEK); el presente de ser, estar y ter
   se enseña desde la semana 1 (el de los demás verbos, desde la 5). */
var TENSE_WEEK = (function () {
  var src = fs.readFileSync(path.join(__dirname, "curriculo.py"), "utf8");
  var m = /TENSE_WEEK\s*=\s*\{([\s\S]*?)\}/.exec(src), out = {};
  (m ? m[1] : "").replace(/"(\w+)"\s*:\s*(\d+)/g, function (_, k, v) { out[k] = +v; return ""; });
  return out;
})();
ok(Object.keys(TENSE_WEEK).length >= 15, "TENSE_WEEK leído de curriculo.py: " + Object.keys(TENSE_WEEK).length);
var FIRST_VERBS = { ser: 1, estar: 1, ter: 1 };
function tenseWeek(t) { return t === "presente" ? 1 : (TENSE_WEEK[t] || 99); }
course.weeks.forEach(function (w) {
  (w.items || []).concat(w.extra || []).forEach(function (id) {
    var it = ids[id];
    ok(it && it.wk && it.wk <= w.week,
       "la semana " + w.week + " pide " + id + " antes de su teoría (semana " + (it && it.wk) + ")");
  });
  (w.tenses || []).forEach(function (t) {
    ok(w.boss || tenseWeek(t) <= w.week,
       "semana " + w.week + ": el conjugador pide " + t + " antes de su teoría");
  });
  (w.known || []).forEach(function (t) {
    ok(tenseWeek(t) <= w.week, "semana " + w.week + ": distractores en " + t);
  });
  if (w.week < (TENSE_WEEK.presente || 5) && !w.boss) (w.verbs || []).forEach(function (v) {
    ok(FIRST_VERBS[v], "semana " + w.week + ": el gimnasio pide «" + v + "» antes del presente regular");
  });
});
(course.challenges || []).forEach(function (c) {
  course.weeks.forEach(function (w) {
    if ((w.challenges || []).indexOf(c.id) >= 0) {
      (c.play || []).forEach(function (id) {
        ok(ids[id] && ids[id].wk <= w.week, "desafío " + c.id + " en la semana " + w.week + " antes de la teoría: " + id);
      });
    }
  });
});

var chalIds = {};
(course.challenges || []).forEach(function (c) { chalIds[c.id] = true; });
course.weeks.forEach(function (w) {
  (w.challenges || []).forEach(function (id) {
    ok(chalIds[id], "desafío inexistente: " + id);
  });
});

/* --------------------------------------------------- armado de las rondas */

course.weeks.forEach(function (w) {
  var r = Drills.buildRound(course, w, { size: 12 });
  ok(r.length > 0, "ronda vacía en la semana " + w.week);
  r.forEach(function (it) {
    ok(!!it && !!it.answer, "ronda de la semana " + w.week + ": ítem mal formado");
    if (it.type === "choice") {
      ok(it.options.indexOf(it.answer) >= 0,
         "distractores sin la respuesta, semana " + w.week + ", " + it.id);
      var uniq = {};
      it.options.forEach(function (o) { uniq[o] = true; });
      ok(Object.keys(uniq).length === it.options.length,
         "opciones repetidas: " + it.id);
    }
  });
});

[13, 26, 39, 52].forEach(function (n) {
  var w = course.weeks[n - 1];
  ok(w.boss === true, "la semana " + n + " tiene que ser un Chefão");
  var b = Drills.buildBoss(course, w, Engine.blankSave());
  ok(b.length >= 20, "Chefão " + n + " demasiado corto: " + b.length);
});

/* ---------------------------------------------- el conjugador en los drills */

var vos = 0, tuN = 0, persons = 0;
for (var i = 0; i < 4000; i++) {
  var verbs = Conj.list();
  var v = verbs[i % verbs.length];
  var t = Conj.ALL_TENSES[i % Conj.ALL_TENSES.length];
  var d;
  try { d = Drills.conjugationDrill(v, t); } catch (e) { continue; }   // un verbo sin ese tiempo
  ok(d.options.indexOf(d.answer) >= 0, "drill sin respuesta: " + v + "/" + t);
  ok(d.options.length === 4, "drill con " + d.options.length + " opciones: " + v);
  var u = {};
  d.options.forEach(function (o) { u[o] = true; });
  ok(Object.keys(u).length === 4, "drill con opciones repetidas: " + v + "/" + t);
  persons++;
  if (/:4$/.test(d.id)) vos++;
  if (/:1$/.test(d.id)) tuN++;
  var dt;
  try { dt = Drills.conjugationTyped(v, t); } catch (e) { continue; }
  if (/:4$/.test(dt.id)) vos++;
}
ok(persons > 1000, "drills de conjugación armados: " + persons);
ok(vos === 0, "«vós» no se ejercita nunca: " + vos + " drills");
ok(tuN > 0 && tuN < persons * 0.15, "«tu» aparece poco: " + tuN + " de " + persons);

/* ----------------------------------------------------- corrección y SRS */

var G = function (given, answer) { return Engine.grade(given, { answer: answer, accept: [answer] }); };
ok(G("falo", "falo") === Engine.VERDICT.RIGHT, "respuesta exacta");
ok(G("Falo.", "falo") === Engine.VERDICT.RIGHT, "mayúsculas y puntuación no cuentan");
ok(G("fala", "falo") === Engine.VERDICT.WRONG, "la desinencia equivocada no se perdona");
ok(G("falara", "falará") === Engine.VERDICT.CLOSE, "tilde que falta = casi");
ok(G("voce", "você") === Engine.VERDICT.CLOSE, "circunflejo que falta = casi");
ok(G("cabeca", "cabeça") === Engine.VERDICT.CLOSE, "cedilla que falta = casi");
ok(G("nao", "não") === Engine.VERDICT.CLOSE, "til que falta = casi");
ok(G("avô", "avó") === Engine.VERDICT.WRONG, "avô ≠ avó: otra palabra, no un desliz");
ok(G("é", "e") === Engine.VERDICT.WRONG, "é ≠ e");
ok(G("vou a praia", "vou à praia") === Engine.VERDICT.WRONG, "la crase cuenta: «a» por «à» es un error de regla");
ok(G("as duas horas", "às duas horas") === Engine.VERDICT.WRONG, "la crase cuenta: «as» por «às»");
ok(G("vou à praia amanhã de manhã", "vou à praia amanhã de manhã") === Engine.VERDICT.RIGHT, "con crase: correcto");
ok(G("chama se", "chama-se") === Engine.VERDICT.CLOSE, "el guion de la ênclise que falta = casi");
ok(G("chama - se", "chama-se") === Engine.VERDICT.RIGHT, "espacios alrededor del guion no cuentan");
ok(G("", "falo") === Engine.VERDICT.WRONG, "respuesta vacía");
ok(Engine.grade("grandes", { answer: "grandes, bons", accept: ["grandes, bons"] })
   === Engine.VERDICT.RIGHT, "una de las respuestas válidas del banco");

var card = null;
for (var k = 0; k < 5; k++) card = Engine.schedule(card, 2);
ok(card.interval > 10, "el intervalo crece con los aciertos: " + card.interval);
var sBefore = card.s;
card = Engine.schedule(card, 0);
ok(card.interval <= 1 && card.reps === 0 && card.s < sBefore, "el error reinicia la ficha y baja la estabilidad");

ok(Engine.levelFor(0).level === 1, "nivel inicial");
ok(Engine.levelFor(100).level === 2, "segundo nivel a los 100 xp");
ok(Engine.xpFor(Engine.VERDICT.RIGHT, 5) > Engine.xpFor(Engine.VERDICT.RIGHT, 0), "el combo paga más");
ok(Engine.xpFor(Engine.VERDICT.WRONG, 9) === 0, "sin xp para los errores");
ok(Engine.rankFor(1) === "Turista" && Engine.rankFor(40) === "Carioca da gema", "rangos: de Turista a Carioca da gema");

/* ------------------------------------- una partida simulada de un año */

var state = Engine.blankSave();
var weeksCleared = 0;
course.weeks.forEach(function (w) {
  var round = w.boss ? Drills.buildBoss(course, w, state)
                     : Drills.buildRound(course, w, { size: 25 });
  var right = 0;
  round.forEach(function (it) {
    if (it.type === "word") return;     // la tarjeta de una palabra nueva no se responde
    // Un jugador que responde siempre bien tiene que poder avanzar.
    var verdict = Engine.grade(it.answer, it);
    if (verdict === Engine.VERDICT.RIGHT) right++;
    else console.log("  no aceptada: " + it.id + " «" + it.answer + "»");
    if (it.src !== "coniugatore") {
      state.cards[it.id] = Engine.schedule(state.cards[it.id], 2);
    }
    state.totals.attempts++;
    state.totals.right++;
    state.xp += Engine.xpFor(verdict, 0);
  });
  var gradable = round.filter(function (it) { return it.type !== "word"; }).length;
  ok(right === gradable,
     "semana " + w.week + ": la respuesta esperada tiene que aceptarse (" +
     right + "/" + gradable + ")");
  var ws = state.weekStats[w.week] = { attempts: gradable, right: right,
                                       bossPassed: w.boss };
  if (ws.right >= 20) weeksCleared++;
});
ok(weeksCleared === 52, "todas las semanas se pueden superar: " + weeksCleared);
ok(state.xp > 5000, "xp acumulada en un año: " + state.xp);

var badges = Engine.checkBadges(state);
ok(badges.length >= 4, "medallas ganadas a fin de año: " + badges.length);

/* --------------------------------------------------------------- repaso */

var review = Drills.buildReview(course, state, 20);
ok(Array.isArray(review), "la cola de repaso es una lista");
Object.keys(state.cards).filter(function (id) { return !Engine.retired(state.cards[id]); }).slice(0, 30).forEach(function (id) {
  state.cards[id].due = Date.now() - 1000;
});
ok(Drills.dueCount(course, state) >= 30, "las fichas vencidas vuelven a la cola");

/* ------------------------------------------- guardado y migración */

(function () {
  ok(Engine.blankSave().syllabusV === 1, "una partida nueva nace con el temario v1");
  var s = Engine.migrateSyllabus({ unlocked: 3, week: 2 });
  ok(s.syllabusV === 1 && s.unlocked === 3, "migración: marca la versión y no toca nada más");
  ok(/^rumoc1\./.test(Engine.STORAGE_KEY), "la clave de guardado tiene el prefijo propio: " + Engine.STORAGE_KEY);
  // Nothing of ours may touch the storage of the other language: the core
  // writes no prefix, it takes LANG.storage.
  ["docs/js/app.js", "docs/js/engine.js", "docs/js/drills.js", "docs/js/lezione.js", "docs/sw.js"].forEach(function (f) {
    var src = fs.readFileSync(path.join(ROOT, f), "utf8");
    var keys = src.match(/["']((laviac1|rumoc1)[.\-][^"']*)["']/g) || [];
    ok(!keys.length, f + ": claves de guardado escritas en el código: " + keys.join(", "));
  });
  var sw = fs.readFileSync(path.join(ROOT, "docs/sw.js"), "utf8");
  ok(/k\.indexOf\(PREFIX\) === 0/.test(sw) && /PREFIX = "c1-"/.test(sw) && !/rumoc1-/.test(sw), "el service worker solo borra sus propias cachés");
})();

/* ------------------------------------------- las trampas del hispanohablante */

(function () {
  var seed = 5, rnd = function () { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  var has = function (list, x) { return list.indexOf(x) >= 0; };
  var t1 = Lez.traps("Eu moro no Rio.", rnd, 52, null, true);
  ok(has(t1, "Eu moro em o Rio."), "trampa: la contracción separada (em o)");
  ok(has(t1, "Yo moro no Rio."), "trampa: el castellano metido (yo)");
  var t2 = Lez.traps("Você gosta de café?", rnd, 52, null, false);
  ok(has(t2, "Você gosta café?"), "trampa: gostar sin de");
  ok(has(Lez.traps("Muito obrigado!", rnd, 52, null, true), "Muy obrigado!"), "trampa: muy");
  ok(has(Lez.traps("Os limões estão na mesa.", rnd, 52, null, true), "Os limãos estão na mesa.") ||
     has(Lez.traps("Os limões estão na mesa.", rnd, 52, null, true), "Os limães estão na mesa."), "trampa: el plural en -ões");
  ok(has(Lez.traps("Vamos à praia.", rnd, 52, null, true), "Vamos a praia."), "trampa: la crase (semana 36 en adelante)");
  ok(!has(Lez.traps("Vamos à praia.", rnd, 20, null, true), "Vamos a praia."), "sin trampa de crase antes de su semana");
  ok(!has(Lez.traps("Eu moro no Rio.", rnd, 2, null, true), "Eu moro em o Rio."), "sin trampa de contracción antes de la semana 3");
  // safe: never the original sentence, never a duplicate
  ["Bom dia! Tudo bem?", "A viagem para Salvador foi ótima.", "Chama-se João."].forEach(function (x) {
    var tr = Lez.traps(x, rnd, 52, null, true);
    ok(tr.indexOf(x) < 0 && new Set(tr).size === tr.length, "trampas limpias: " + x);
  });
})();

/* ------------------------------------------- opciones que no regalan la respuesta */

// Una pregunta de opción múltiple no se acierta por parecido: la lección
// ofrece la misma frase con un error (o frases que comparten la mitad de las
// palabras), y la versión de reconocimiento de un ejercicio escrito da
// otras formas de la misma palabra o del mismo verbo.
(function () {
  var words = function (x) { return String(x).toLowerCase().replace(/[.,;:!?¿¡«»"()’']/g, " ").split(/\s+/).filter(Boolean); };
  var shared = function (a, b) { var bw = words(b); return words(a).filter(function (w) { return bw.indexOf(w) >= 0; }).length; };
  var seed = 11, rnd = function () { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  var bad = 0, seen = 0;
  course.weeks.forEach(function (w) {
    if (!w.lesson) return;
    for (var r = 0; r < 4; r++) Lez.steps(w.lesson, rnd, w.week, null).forEach(function (st) {
      if (st.kind !== "quiz" || (st.q.kind !== "ex" && st.q.kind !== "trap")) return;
      seen++;
      var need = Math.ceil(words(st.q.answer).length / 2);
      if (words(st.q.answer).length === 1) return;   // una palabra: la trampa es otra forma de ella
      st.q.options.forEach(function (o) { if (o !== st.q.answer && shared(o, st.q.answer) < need) { bad++; if (bad < 4) console.log("  lejana: " + st.q.answer + " / " + o); } });
    });
  });
  ok(seen > 200 && bad === 0, "lección: " + bad + " distractores de otra frase en " + seen + " preguntas");
  // Reconocimiento de «traducí»: las opciones comparten un tercio de las palabras.
  var map = {}; course.items.forEach(function (it) { map[it.id] = it; });
  var far = 0, n = 0;
  course.weeks.forEach(function (w) {
    var pool = w.items.map(function (id) { return map[id]; }).filter(Boolean);
    pool.forEach(function (it) {
      if (it.type !== "translate" || words(it.answer).length < 3) return;
      var q = Drills.firstRecognize([it], { cards: {} }, w.week, pool)[0];
      if (!q || !q.recog) return;
      n++;
      q.options.forEach(function (o) { if (o !== it.answer && shared(o, it.answer) < Math.ceil(words(it.answer).length / 3)) { far++; console.log("  lejana: " + it.answer + " / " + o); } });
    });
  });
  ok(n > 100 && far === 0, "reconocimiento: " + far + " opciones de otra frase en " + n + " traducciones");
})();

// Dominala no repite un ejercicio: el mismo puede estar con dos ids.
(function () {
  var rep = 0;
  course.weeks.forEach(function (w) {
    for (var r = 0; r < 20; r++) {
      var seen = {};
      Drills.buildDomina(course, w, { cards: {}, unlocked: w.week }, {}).forEach(function (it) {
        var k = (it.prompt + "|" + it.stem + "|" + it.answer).toLowerCase(), k2 = (it.stem + "|" + it.answer).toLowerCase();
        if (/[a-zà-ÿ]/.test(it.stem || "") ? seen[k2] : seen[k]) { rep++; if (rep < 4) console.log("  repetida en la semana " + w.week + ": " + it.stem); }
        seen[k] = seen[k2] = 1;
      });
    }
  });
  ok(rep === 0, "Dominala: " + rep + " ejercicios repetidos en la misma sesión");
})();

// Duelos: cada oración tiene sus dos formas, la pista está en la oración y
// «¿qué te lo dijo?» se puede armar; cada sesión trae los dos lados.
(function () {
  var Duelli = ctx.Duelli;
  Duelli.DUELLI.forEach(function (d) {
    var sides = [0, 0];
    d.items.forEach(function (x, k) {
      sides[Duelli.side(d, x)]++;
      ok(x.a !== x.b && x.s.indexOf("___") >= 0, "duelo " + d.id + " " + k + ": formas o hueco");
      ok(Duelli.filled(x).indexOf(x.cue) >= 0, "duelo " + d.id + " " + k + ": la pista no está en la oración");
      ok(!!Duelli.cueItem(d, k), "duelo " + d.id + " " + k + ": sin «¿qué te lo dijo?»");
    });
    ok(Math.abs(sides[0] - sides[1]) <= 2, "duelo " + d.id + ": lados desparejos " + sides);
    var ses = Duelli.session(d.id, {});
    var chosen = ses.filter(function (it) { return !it.cue; });
    ok(chosen.length === 8 && chosen.every(function (it) { return it.options.indexOf(it.answer) >= 0; }), "duelo " + d.id + ": sesión");
  });
})();

// «Adiviná»: dos o tres opciones distintas, todas la misma frase (con un
// error o con el orden cambiado), nunca otra frase entera.
(function () {
  var Frasi = ctx.Frasi;
  var far = 0, none = 0;
  var lev = function (a, b) {
    var d = [], i, j;
    for (i = 0; i <= a.length; i++) d[i] = [i];
    for (j = 1; j <= b.length; j++) d[0][j] = j;
    for (i = 1; i <= a.length; i++) for (j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[a.length][b.length];
  };
  Frasi.ALL.forEach(function (f) {
    var g = Frasi.guessItem(f);
    // no possible mistake (Prego!, Sério?): no «Adiviná», the phrase is presented
    if (!g) { none++; return; }
    ok(g.options.length >= 2 && g.options.length <= 3 && g.options.indexOf(f.it) >= 0 &&
       new Set(g.options).size === g.options.length, "adiviná: opciones " + f.id);
    // near: at most a third of the letters changed (Obrigado / Obrigada, Muito / Muy)
    var near = g.options.filter(function (o) {
      // (short ones: the same number of words, Saúde! / Salud!, and never an existing phrase)
      return o !== f.it && !Frasi.ALL.some(function (h) { return h.it === o; }) &&
        (lev(o.toLowerCase(), f.it.toLowerCase()) <= f.it.length / 3 || g.why[o] === "order" ||
         o.split(" ").length === f.it.split(" ").length);
    });
    // every wrong option is the same phrase: never another whole phrase
    if (near.length !== g.options.length - 1) far++;
  });
  ok(far === 0, "adiviná: opciones que no son la misma frase: " + far);
  ok(none <= Frasi.ALL.length * 0.07, "adiviná: frases sin ningún error posible: " + none);
})();

// Glosas de opción múltiple: la respuesta entre tres opciones distintas.
(function () {
  var Letture = ctx.Letture;
  var n = 0;
  Letture.EPISODI.forEach(function (ep) {
    var toks = Letture.allTokens(ep);
    Letture.mcTargets(ep).forEach(function (i) {
      var o = Letture.mcOptions(ep, toks[i]);
      n++;
      ok(o.options.length === 3 && o.options.indexOf(o.answer) >= 0 && new Set(o.options).size === 3, "glosa múltiple: " + ep.id + "/" + o.word);
    });
  });
  ok(n >= 100, "glosas de opción múltiple: " + n);
})();

// Voces reales (Lingua Libre): solo la palabra exacta, un archivo por hablante.
(function () {
  var Voci = ctx.Voci;
  ok(JSON.stringify(Voci.parseTitle("File:LL-Q5146 (por)-Ana Souza-avó.wav")) === JSON.stringify({ user: "Ana Souza", word: "avó" }), "voces: título");
  ok(Voci.parseTitle("File:LL-Q150 (fra)-X-avó.wav") === null, "voces: otro idioma");
  var list = Voci.fromApi("casa", { query: { pages: {
    1: { title: "File:LL-Q5146 (por)-Ana-casa.wav", imageinfo: [{ url: "u1" }] },
    2: { title: "File:LL-Q5146 (por)-Ana-casa.wav", imageinfo: [{ url: "u2" }] },
    3: { title: "File:LL-Q5146 (por)-Bia-caça.wav", imageinfo: [{ url: "u3" }] },
    4: { title: "File:LL-Q5146 (por)-Caio-casa.wav", imageinfo: [{ url: "u4" }] } } } });
  ok(list.length === 2 && list[0].url === "u1" && list[1].user === "Caio", "voces: palabra exacta, un archivo por hablante");
  ok(Voci.usable("casa"), "voces: una palabra común se puede buscar");
})();

// La versión que muestra la app (Hoje, Eu) es la del service worker.
(function () {
  var sw = fs.readFileSync(path.join(ROOT, "docs/sw.js"), "utf8").match(/VERSION = "c1-(v[\d.]+)"/);
  var app = fs.readFileSync(path.join(ROOT, "docs/js/app.js"), "utf8").match(/APP_VERSION = "(v[\d.]+)"/);
  ok(sw && app && sw[1] === app[1], "versión de la app (" + (app && app[1]) + ") = versión del service worker (" + (sw && sw[1]) + ")");
})();

// La interfaz (app.js) y el paquete: el guardado de siempre, los textos del paquete.
(function () {
  var L = ctx.LANG;
  ok(L.storage === "rumoc1" && Engine.STORAGE_KEY === "rumoc1.save.v1", "el guardado sigue en rumoc1.save.v1: " + Engine.STORAGE_KEY);
  ok(L.code === "pt" && L.tts === "pt-BR" && L.base === "lang/pt/", "LANG: código, voz y carpeta del paquete");
  var core = fs.readFileSync(path.join(ROOT, "docs/js/app.js"), "utf8");
  ok(!/["']data\/[\w.]+\.json["']|["']it-IT["']|["']pt-BR["']|[ãõç]/.test(core), "app.js no pide docs/data/, no nombra una voz ni escribe letras del idioma");
  // Every text app.js reads from the package exists (app.js does not run under node).
  var need = {};
  (core.match(/\bUI\.[a-zA-Z0-9]+/g) || []).forEach(function (k) { need["ui." + k.slice(3)] = L.ui[k.slice(3)]; });
  (core.match(/\bEX\.[a-zA-Z0-9]+/g) || []).forEach(function (k) { need["exam." + k.slice(3)] = L.exam[k.slice(3)]; });
  (core.match(/\bLG\.[a-zA-Z0-9]+/g) || []).forEach(function (k) { need[k.slice(3)] = k.slice(3) in L ? true : undefined; });
  var missing = Object.keys(need).filter(function (k) { return need[k] === undefined; });
  ok(!missing.length, "LANG (lang/pt/lang.js) trae todo lo que usa app.js; faltan: " + missing.join(", "));
  ok(L.ui.tabs.length === 3 && L.ui.tabs[0][2] === "Hoje" && L.ui.tabs[2][2] === "Eu" && L.ui.allTabs.length === 2, "las pestañas (3.4): Hoje, Trilha, Eu; Treino y Ler desde Eu");
  ok(L.spanish.sure.test("¿Qué tal?") && L.spanish.notEs.test("Não sei") && !L.spanish.sure.test("Tudo bem?"), "español o portugués: ñ ¿ ¡ -ción / ã õ ç -ção");
  ok(L.glue("-se") === "prev" && L.glue("se") === null, "hueco con guion: chama-se se pega a la palabra de antes");
  ok(L.rules.persons.skip.indexOf(4) >= 0, "vós no se marca en las lecciones (LANG.rules.persons.skip)");
})();

T.done();
