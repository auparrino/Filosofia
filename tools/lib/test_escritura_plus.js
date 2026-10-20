/* Escritura plus (docs/js/escritura_plus.js), en los dos idiomas:
   - tres vueltas: la meta de palabras (40-80), la medición con el corrector
     del idioma y la comparación de las vueltas;
   - reformulación: la alineación de dos textos (las diferencias que el
     alumno puede tocar), el corrector propio aplicado sin clave (sobre el
     corpus de textos corregidos a mano de cada idioma: la mayoría de los
     arreglos van en la dirección de la corrección), las tarjetas al repaso
     y su ítem, que el repaso de Drills encuentra;
   - el prompt de la IA vive en el paquete y pide el texto reescrito sin
     marcar errores, y la respuesta se lee por Scrivi.llm (sin red: simulada).
   Run: node tools/lib/test_escritura_plus.js  */
var pack = require("./pack.js");

var fails = 0, checks = 0;
function ok(c, what) { checks++; if (!c) { fails++; console.log("FAIL " + what); } }

pack.LANGS.forEach(function (code) {
  var ctx = pack(code), E = ctx.EscrituraPlus, S = ctx.Scrivi;
  ok(!!E, code + ": EscrituraPlus se carga en el orden de boot.js");
  if (!E) return;
  ctx.Banca.load(pack.data(code, "bank.json"));
  var course = pack.data(code, "course.json");
  S.learnCourse({ items: course.items, bank: ctx.Banca.bank(), phrases: ctx.Frasi.ALL, readings: ctx.Letture.EPISODI,
                  glossario: pack.data(code, "glossario.json") });

  /* ---- tres vueltas */
  ok(E.SECS.join() === "300,240,180", code + ": 5, 4 y 3 minutos");
  for (var w = 1; w <= 52; w++) {
    var g = E.goalWords(w);
    ok(g >= 40 && g <= 80, code + ": semana " + w + ": meta de " + g + " palabras fuera de 40-80");
    ok(!!E.taskFor(w), code + ": semana " + w + " sin consigna (tampoco la de una semana anterior)");
  }
  var tw = S.weeks()[10];
  var model = S.TASKS[tw].model;
  var m1 = E.measure(model.split(/\s+/).slice(0, 12).join(" "), tw, 300);
  var m3 = E.measure(model, tw, 180);
  ok(m3.words > m1.words, code + ": measure cuenta palabras");
  ok(m3.errors === 0, code + ": el modelo de la semana " + tw + " no tiene errores marcados (" + m3.errors + ")");
  ok(m3.reqsN > 0 && m3.reqsOk === m3.reqsN, code + ": el modelo cumple las estructuras pedidas");
  ok(m3.wpm === Math.round(m3.words / 3 * 10) / 10, code + ": palabras por minuto");
  var cmp = E.compare([m1, E.measure(model, tw, 240), m3]);
  ok(cmp.rows.length === 4 && cmp.rows[0].vals.length === 3, code + ": la comparación trae 4 medidas × 3 vueltas");
  ok(cmp.rows[0].delta > 0 && cmp.rows[0].good, code + ": más palabras cuenta como mejora");
  ok(cmp.lines.length >= 3 && /palabras/.test(cmp.lines[0]), code + ": la comparación se explica en castellano");
  var worse = E.compare([{ words: 50, errors: 1, structs: 3, reqsN: 1, wpm: 10 }, { words: 40, errors: 4, structs: 1, reqsN: 1, wpm: 13.3 }]);
  ok(!worse.rows[1].good && /Subieron/.test(worse.lines[1]), code + ": más errores no cuenta como mejora");

  /* ---- alineación */
  var d = E.diff("Uno dos tres cuatro.", "Uno dos tres cuatro.");
  ok(d.same && d.chunks.length === 0, code + ": dos textos iguales no tienen diferencias");
  d = E.diff("a b c d e", "a x c d e f");
  ok(d.chunks.length === 2, code + ": un cambio y un agregado son dos diferencias (" + d.chunks.length + ")");
  ok(d.chunks[0].nat === "x" && d.chunks[0].mineText === "b", code + ": la diferencia guarda lo tuyo y lo del nativo");
  ok(d.owner[1] === 0 && d.owner[2] == null, code + ": cada palabra sabe a qué diferencia pertenece");
  d = E.diff("a b c d", "a c d");
  ok(d.chunks.length === 1 && d.chunks[0].nat === "c" && d.chunks[0].mineText === "b c", code + ": lo que el nativo quita se toca en la palabra siguiente");
  d = E.diff("Ciao, sono Ana.", "ciao sono Ana!");
  ok(d.same, code + ": mayúsculas y puntuación no son diferencias");

  /* ---- sin clave: el corrector propio, sobre el corpus corregido a mano */
  var corpus = require(pack.ROOT + "/tools/" + code + "/scrivi_corpus.json");
  var fixes = 0, toward = 0, closer = 0, farther = 0;
  corpus.forEach(function (x) {
    var r = E.localRewrite(x.text, x.week);
    fixes += r.changes.length;
    r.changes.forEach(function (ch) { if (x.corrected.toLowerCase().indexOf(ch.to.toLowerCase()) >= 0) toward++; });
    var before = E.diff(x.text, x.corrected).chunks.length, after = E.diff(r.text, x.corrected).chunks.length;
    if (after < before) closer++; else if (after > before) farther++;
  });
  if (process.argv.indexOf("-v") >= 0) console.log(code + ": " + fixes + " arreglos, " + toward + " hacia la corrección; " + closer + " textos más cerca, " + farther + " más lejos de " + corpus.length);
  ok(fixes >= corpus.length, code + ": el corrector arregla algo en el corpus (" + fixes + " arreglos)");
  ok(toward / fixes >= 0.85, code + ": los arreglos van hacia la corrección humana (" + toward + " / " + fixes + ")");
  ok(closer >= corpus.length * 0.6 && farther <= corpus.length * 0.05, code + ": el texto arreglado queda más cerca del corregido (" + closer + " más cerca, " + farther + " más lejos)");
  S.weeks().forEach(function (wk) {
    var r = E.localRewrite(S.TASKS[wk].model, wk);
    ok(r.text === S.TASKS[wk].model.replace(/[’‘`´]/g, "'"), code + ": semana " + wk + ": el corrector cambió el modelo: " + r.changes.map(function (c) { return c.from + "→" + c.to; }).join(", "));
  });

  /* ---- tarjetas al repaso */
  var x0 = corpus[0], rw = E.localRewrite(x0.text, x0.week), dd = E.diff(x0.text, rw.text);
  ok(dd.chunks.length > 0, code + ": el primer texto del corpus tiene algo que arreglar");
  var card = E.cardFor(dd, 0, { week: x0.week, src: "local" });
  ok(card && /^ep:/.test(card.id) && card.s.indexOf("___") >= 0 && card.n, code + ": la tarjeta tiene hueco y respuesta");
  ok(card.s.replace("___", card.n).replace(/\s+/g, " ").indexOf(card.n) >= 0, code + ": el hueco se llena con lo del nativo");
  var state = ctx.Engine.blankSave();
  var added = ctx.EscrituraPlus.addCards(state, [card, card]);
  ok(added === 1 && state.cards[card.id] && state.cards[card.id].reps === 0, code + ": la tarjeta entra una sola vez al repaso");
  ok(state.cards[card.id].due > Date.now(), code + ": vuelve mañana, no enseguida");
  var it = E.reviewItem(card.id, state);
  ok(it && it.type === "typed" && it.answer === card.n && it.stem === card.s, code + ": el ítem de repaso pide lo del nativo en el hueco");
  ok(it && !/error|mal\b/i.test(it.prompt), code + ": el ítem no habla de errores: " + (it && it.prompt));
  state.cards[card.id].due = Date.now() - 1000;
  var rev = ctx.Drills.buildReview(course, state, 50);
  ok(rev.some(function (r) { return r.id === card.id && r.src === "eplus"; }), code + ": el repaso de Drills trae la tarjeta cuando vence");
  // sanitize (a reload) keeps the cards and their content
  var again = ctx.Engine.sanitize(JSON.parse(JSON.stringify(state)));
  ok(again.escrituraPlus && again.escrituraPlus.cards[card.id] && again.cards[card.id], code + ": las tarjetas sobreviven al guardado");
  var mu = E.split(S.TASKS[tw].model), mc = E.modelCard(mu, 2, 4, { week: tw });
  ok(mc && mc.src === "modelo" && mc.s.indexOf("___") >= 0, code + ": una expresión del modelo también se vuelve tarjeta");

  /* ---- la IA: el prompt del paquete y la respuesta por Scrivi.llm */
  var p = E.aiPrompt("Testo di prova.", { week: 11, level: "A2", task: S.TASKS[11] });
  ok(typeof p === "string" && /JSON/.test(p) && /testo/.test(p), code + ": el paquete trae el prompt de la reformulación");
  ok(p.indexOf(S.TASKS[11].t) >= 0, code + ": el prompt lleva la consigna de la semana");
  ok(typeof S.llm === "function", code + ": Scrivi expone llm (las mismas claves y proveedores)");
  var realLlm = S.llm, got = null;
  S.llm = function (prompt, keys, done) { done(null, { testo: "Frase  nuova ’bella’." }, { provider: "X", model: "y" }); };
  E.reformulate("Frase vecchia.", { week: 11 }, { claude: "k" }, function (err, t, meta) { got = [err, t, meta]; });
  ok(got && !got[0] && got[1] === "Frase nuova 'bella'." && got[2].model === "y", code + ": la respuesta de la IA se limpia y llega");
  S.llm = function (prompt, keys, done) { done(null, { otra: 1 }); };
  E.reformulate("Frase vecchia.", { week: 11 }, { claude: "k" }, function (err) { got = [err]; });
  ok(got && got[0], code + ": una respuesta sin texto es un error (y la app cae al corrector propio)");
  S.llm = realLlm;
});

console.log((fails ? fails + " errores" : "0 errores") + " · " + checks + " chequeos (escritura plus, it + pt)");
process.exit(fails ? 1 : 0);
