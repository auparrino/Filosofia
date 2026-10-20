/* La corrección como aprendizaje (auditoría 3.0, eje 5: C8, C9, P1-P7), en
   los dos idiomas:
   - el objeto de error común (js/errores.js): niveles de los dos
     diagnósticos, lo que cuenta para la Clínica y lo que queda fuera del
     puntaje (LanguageTool «grammatica», la IA sin tipo), lo aceptable que no
     se anota, deshacer un registro («🙋 Mi respuesta es válida»);
   - el registro: *pra* vale con nota en una respuesta cualquiera y es
     «casi» con registro formal (portugués); la tarea del tramo pasa el
     registro del género y pide las estructuras de la semana;
   - Scrivi por unión (fromAI): lo local queda, lo de la IA se suma con
     bad/good/why, las dos opiniones cuando no coinciden, nada se tira;
   - los pedidos a la IA llevan la evidencia y el curso (la corrección de la
     app, la categoría, la semana, la gramática vista, las flojas, las marcas
     seguras, foco en A1-A2), y el juez de respuestas no previstas, con
     fetch simulado;
   - el caché de explicaciones (hash, normalización, tope);
   - la explicación a la medida (P6) y que toda fuente anote con el objeto
     común (P7: nada de «recordError({cat, target: f.msg})»).
   Run: node tools/lib/test_errores.js */
"use strict";
var fs = require("fs"), path = require("path");
var pack = require("./pack.js");
var T = require("./testkit.js")("lib"), ok = T.ok;

function memStore(ctx) {
  var mem = {};
  ctx.localStorage = { getItem: function (k) { return k in mem ? mem[k] : null; }, setItem: function (k, v) { mem[k] = String(v); },
                       removeItem: function (k) { delete mem[k]; } };
  return mem;
}
function jsonResp(body) {
  return Promise.resolve({ ok: true, status: 200, json: function () { return Promise.resolve(body); },
                           text: function () { return Promise.resolve(JSON.stringify(body)); } });
}
function reply(obj) { return { model: "claude-haiku-5-5", stop_reason: "end_turn", content: [{ type: "text", text: JSON.stringify(obj) }] }; }

var CTX = {};
["it", "pt"].forEach(function (code) {
  var ctx = pack(code, { upTo: "plan.js", extra: { TextDecoder: TextDecoder, TextEncoder: TextEncoder, AbortController: AbortController } });
  memStore(ctx);
  CTX[code] = ctx;
  var E = ctx.Errores, S = ctx.Scrivi, D = ctx.Diagnosi;
  var tag = "[" + code + "] ";

  /* ---------------------------------------------------- niveles y objeto */
  ok(E && typeof E.record === "function", tag + "Errores cargado antes de la app (boot.js ORDER)");
  [[{ verdict: "giusto", level: "ok_note", note: "x" }, "note"], [{ verdict: "giusto", level: "aceptable", note: "x" }, "note"],
   [{ verdict: "giusto", level: "poco_natural", natural: "y" }, "note"], [{ verdict: "quasi", level: "close" }, "slip"],
   [{ verdict: "quasi", level: "desliz" }, "slip"], [{ verdict: "sbagliato", level: "wrong" }, "wrong"],
   [{ verdict: "sbagliato", level: "incorrecto" }, "wrong"], [{ verdict: "giusto" }, "ok"], [{ verdict: "giusto", level: "correcto" }, "ok"],
   [{ verdict: "quasi" }, "slip"], [{ verdict: "giusto", note: "n" }, "note"]].forEach(function (c) {
    T.eq(E.level(c[0]), c[1], tag + "nivel de " + JSON.stringify(c[0]));
  });
  ok(/Más natural: \*Ci sono\*/.test(E.noteOf({ level: "poco_natural", natural: "Ci sono", note: "es correcto" })), tag + "poco natural: «más natural: …»");

  var st = { errs: {}, errLog: [] };
  var cat = code === "it" ? "ausiliare" : "contraccion";
  var err = E.make({ cat: cat, mal: "ho andato", bien: "sono andato", pista: "¿con qué auxiliar?", regla: "Los verbos de movimiento van con essere.",
                     contraste: "En español siempre «haber».", registro: "formal" });
  var row = E.record(st, err);
  ok(row && st.errs[cat].n === 1 && st.errLog[0] === row, tag + "un error de la Clínica cuenta y queda en el registro");
  ok(row.g === "ho andato" && row.e === "sono andato" && /movimiento/.test(row.x) && row.p && row.c && row.r === "formal" && row.k === 1,
     tag + "la fila guarda lo escrito, la corrección, el porqué, la pista, el contraste y el registro: " + JSON.stringify(row));
  E.unrecord(st, row);
  ok(st.errs[cat].n === 0 && st.errLog.length === 0, tag + "deshacer el registro («🙋 Mi respuesta es válida»)");
  var lt = E.record(st, E.fromFinding({ cat: "grammatica", i: 0, n: 1, lt: true, msg: "Gramática (LanguageTool): algo → *x*" }, "algo más", {}));
  ok(lt && !st.errs.grammatica && lt.k === 0 && lt.f === "lt" && st.errLog.length === 1, tag + "«grammatica» de LanguageTool queda fuera del puntaje, con su porqué");
  var ia = E.record(st, E.fromRow("frase mal", "frase bien", "nota", "cualquier_cosa", {}));
  ok(ia && ia.cat === "ia" && !st.errs.ia && ia.f === "ia", tag + "un tipo desconocido de la IA queda fuera del puntaje");
  var known = E.record(st, E.fromRow("mal", "bien", "nota", cat, {}));
  ok(known && st.errs[cat].n === 1 && known.s === 0, tag + "un tipo de la Clínica que da la IA cuenta, marcado como no seguro");
  ok(E.record(st, E.make({ cat: cat, nivel: "aceptable" })) === null && E.record(st, E.make({ cat: cat, nivel: "poco_natural" })) === null,
     tag + "lo aceptable y lo poco natural no se anotan");
  var slip = code === "it" ? "refuso" : "tipeo";
  ok(E.record(st, E.make({ cat: slip, mal: "x" })) === null, tag + "el tipeo no se anota (grupo unrecorded)");
  var del = E.record(st, E.make({ cat: cat, mal: "a", bien: "" }));
  ok(del && del.d === 1 && del.e === "", tag + "«se borra» queda marcado");

  // a finding of the local checker: bad / good / why, or taken from the message
  var fnd = E.fromFinding({ cat: cat, i: 1, n: 1, msg: "La forma es: *sono*." }, "Io ho andato", {});
  ok(fnd.mal === "ho" && fnd.bien === "sono" && fnd.seguro === true && fnd.fuente === "reglas", tag + "sin bad/good: lo escrito del texto y la corrección del mensaje: " + JSON.stringify(fnd));
  var fnd2 = E.fromFinding({ cat: cat, i: 0, n: 1, bad: "X", good: "Y", why: "porque sí", level: "close", msg: "m" }, "X", {});
  ok(fnd2.mal === "X" && fnd2.bien === "Y" && fnd2.regla === "porque sí" && fnd2.nivel === "desliz", tag + "con bad/good/why, los usa");

  /* ------------------------------------------------ P6: capa según la historia */
  T.eq(E.depth({ errs: {} }, cat), "first", tag + "la primera vez, regla y contraste");
  T.eq(E.depth({ errs: (function () { var o = {}; o[cat] = { n: 3 }; return o; })() }, cat), "normal", tag + "la tercera, como viene");
  T.eq(E.depth({ errs: (function () { var o = {}; o[cat] = { n: 5 }; return o; })() }, cat), "brief", tag + "desde la quinta, solo la pista");

  /* ------------------------------------------------------------- el caché */
  E.cacheReset();
  E.cacheSet("hints", ["b:tr:1", "Ho  andato."], { pista1: "p" }, "item · resp");
  ok(E.cacheGet("hints", ["b:tr:1", "ho andato"]).pista1 === "p", tag + "caché: la respuesta normalizada (mayúsculas, espacios, punto final)");
  ok(!E.cacheGet("hints", ["b:tr:2", "ho andato"]) && !E.cacheGet("explain", ["b:tr:1", "ho andato"]), tag + "caché: otro ítem u otro tipo no coinciden");
  for (var k = 0; k < E.CACHE_MAX + 20; k++) E.cacheSet("explain", ["i" + k, "g"], { explicacion: "e" + k });
  E.cacheReset();
  ok(E.cacheAll().length === E.CACHE_MAX && E.cacheGet("explain", ["i" + (E.CACHE_MAX + 19), "g"]), tag + "caché con tope en localStorage, se va lo más viejo");
  ok(JSON.stringify(E.cacheAll()[0]).indexOf("explicacion") > 0, tag + "el caché se puede exportar (tipo, qué se preguntó, la respuesta)");

  /* ------------------------------------------------------ Scrivi por unión */
  var text = code === "it" ? "Ieri ho andato al mare con mio amico e abbiamo mangiato molto bene." : "Ontem eu fui em a praia com meu amigo e a gente comeu muito bem.";
  var tk = S.toks(text), wAt = function (w) { for (var i = 0; i < tk.length; i++) if (tk[i].w === w) return i; return -1; };
  var locW = code === "it" ? "ho" : "em";
  var local = [{ i: wAt(locW), n: 1, cat: cat, msg: "local", bad: locW, good: code === "it" ? "sono" : "na", why: "w" }];
  var aiW = code === "it" ? "mio" : "meu";
  var data = { errores: [
    { mal: locW, bien: local[0].good, tipo: cat, explicacion: "lo mismo" },                               // agrees: silence
    { mal: aiW, bien: code === "it" ? "il mio" : "o meu", tipo: code === "it" ? "articolo_possessivo" : "articulo", explicacion: "artículo con el posesivo", foco: false },
    { mal: code === "it" ? "molto bene" : "muito bem", bien: "x", tipo: "zzz", explicacion: "otra" },
    { mal: "frase que no está", bien: "y", tipo: cat, explicacion: "no está en el texto" }
  ] };
  var ai = S.fromAI(text, data, local);
  ok(!ai.some(function (f) { return f.i === local[0].i && !f.conflict; }), tag + "lo que la IA confirma de lo local no se repite");
  var add = ai.filter(function (f) { return f.bad === aiW; })[0];
  ok(add && add.ai && add.good && /posesivo/.test(add.why) && add.level === "wrong" && add.minor === true, tag + "lo de la IA se suma con bad/good/why y foco: " + JSON.stringify(add));
  ok(ai.some(function (f) { return f.cat === "ia"; }), tag + "un tipo desconocido queda como «ia»");
  var un = ai.filter(function (f) { return f.unplaced; })[0];
  ok(un && un.i === -1 && /no está/.test(un.why), tag + "lo que no está literal en el texto se lista igual, sin marca");
  var other = S.fromAI(text, { errores: [{ mal: locW, bien: "otra", tipo: cat, explicacion: "propone otra" }] }, local);
  ok(other.length === 1 && other[0].conflict && other[0].soft && /otra corrección/.test(other[0].msg), tag + "otra corrección sobre una marca local: las dos se ven");
  var contra = S.fromAI(text, { errores: [{ mal: locW, bien: locW, tipo: cat, explicacion: "está bien así", contradice: true }] }, local);
  ok(contra.length === 1 && contra[0].conflict && /no lo ve como error/.test(contra[0].msg), tag + "si la IA dice que no es error, se muestran las dos");
  var acc = S.fromAI(text.replace(code === "it" ? "abbiamo" : "comeu", code === "it" ? "àbbiamo" : "cómeu"),
                     { errores: [{ mal: code === "it" ? "abbiamo" : "comeu", bien: "q", tipo: cat, explicacion: "sin tilde" }] }, []);
  ok(acc.length === 1 && acc[0].i >= 0, tag + "un fragmento con otra tilde se encuentra igual");

  /* ------------------------------------------------ pedidos con evidencia */
  var course = pack.data(code, "course.json");
  var cst = { errs: {} };
  cst.errs[cat] = { n: 6, fixed: 0, last: Date.now() };
  var cx = E.courseCtx(course, cst, 5, { cat: cat, appSaid: "La app dijo: *sono andato*." });
  ok(cx.week === 5 && cx.grammar.length >= 3 && cx.tenses.length >= 1 && cx.weak.indexOf(cat) >= 0, tag + "el curso: semana, gramática vista, tiempos, flojas: " + JSON.stringify(cx).slice(0, 200));
  var pc = E.promptCtx(cx);
  ok(/semana 5/.test(pc) && /Gramática vista/.test(pc) && /flojas/.test(pc) && /español rioplatense/.test(pc) && /La app dijo/.test(pc), tag + "el contexto en texto");
  var x = { prompt: "Traducí", stem: "Fui al mar", given: "ho andato al mare", answer: "sono andato al mare", feedback: "Pista de la app: ¿qué auxiliar?", ctx: cx };
  var hp = S.hintsPrompt(x);
  ok(/Lo que ya le dijo la app/.test(hp) && /Pista de la app/.test(hp) && /semana 5/.test(hp) && /Categoría del error según la app/.test(hp), tag + "las pistas llevan lo que dijo la app, la categoría y la semana");
  var ep = S.explainPrompt({ prompt: "p", stem: "s", given: "g", answer: "a", feedback: "Corrección de la app", stage: "mas", ctx: cx });
  ok(/Corrección que mostró la app: Corrección de la app/.test(ep) && /contraste con el español/.test(ep) && /semana 5/.test(ep), tag + "«explicame más» con la corrección de la app y el curso");
  var jp = S.judgePrompt(x);
  ok(/no está entre las previstas/.test(jp) && /corrector de reglas de la app/.test(jp) && /mismo_sentido/.test(jp), tag + "el juez con la evidencia de la app");
  var ap = S.aiPrompt("testo", 5, S.TASKS[5] || null, E.courseCtx(course, cst, 5, { local: ["«ho» → «sono»: auxiliar"] }));
  ok(/FOCALIZADA/.test(ap) && /Marcas SEGURAS/.test(ap) && /«ho» → «sono»/.test(ap), tag + "A1-A2: corrección focalizada y las marcas locales como seguras");
  var ap2 = S.aiPrompt("testo", 45, S.TASKS[45] || null, E.courseCtx(course, cst, 45));
  ok(!/FOCALIZADA/.test(ap2) && /semana 45/.test(ap2), tag + "C1: sin foco, con el curso");
  var rp = S.reviewPrompt("testo", 5, null, { errores: [] }, { local: ["«a» → «b»: c"], lt: ["lt dice"] }, cx);
  ok(/Marcas SEGURAS del corrector de reglas/.test(rp) && /contradice/.test(rp) && /LanguageTool \(verificá/.test(rp), tag + "el segundo profesor: lo local seguro, LanguageTool a verificar");

  /* --------------------------------------------------------------- tramo */
  var TR = ctx.Tramo, s30 = TR.week(30);
  var ev = TR.evaluate(s30.compito, s30.compito.model, 30, s30);
  var sc = ev.crit.filter(function (c) { return c.id === "struct"; })[0];
  ok(sc && !sc.need && /Estructuras de la semana/.test(sc.label), tag + "la tarea del tramo pide las estructuras del Scrivi de la semana (criterio, no obligatorio)");
  ok(ev.ok, tag + "el modelo de la semana 30 sigue pasando");
  var formalG = code === "it" ? "lettera_formale" : "carta_formal", infG = code === "it" ? "email_informale" : "email_informal";
  T.eq(TR.registroOf({ genre: formalG }), "formal", tag + "carta formal: registro formal");
  T.eq(TR.registroOf({ genre: infG }), "informal", tag + "e-mail informal: registro informal");
  ok(TR.registroOf({ genre: code === "it" ? "relazione" : "artigo" }) === "formal", tag + "informe o artículo: formal");
});

/* ------------------------------------------- el registro en las cerradas (pt) */
(function () {
  var D = CTX.pt.Diagnosi, E = CTX.pt.Errores;
  var a = D.diagnose("Eu vou pra praia", ["Eu vou para a praia"], { stem: "", prompt: "Traducí" });
  ok(a.verdict === "giusto" && E.level(a) === "note" && /habla/.test(E.noteOf(a)), "[pt] *pra* sin registro pedido: «✓ Vale» con la nota: " + JSON.stringify([a.verdict, a.level, a.note]));
  var b = D.diagnose("Eu vou pra praia", ["Eu vou para a praia"], { registro: "formal" });
  ok(b.verdict !== "giusto" && E.level(b) === "slip", "[pt] con registro formal («Trova l'errore», ítem formal): «casi»: " + JSON.stringify([b.verdict, b.level]));
  var c = D.diagnose("Eu vou pra praia", ["Eu vou para a praia"], { tags: ["formal"] });
  ok(c.verdict !== "giusto", "[pt] la etiqueta «formal» del banco pide el registro formal");
})();

/* ------------------------------ P7: toda fuente anota con el objeto común */
(function () {
  var read = function (f) { return fs.readFileSync(path.join(pack.DOCS, "js", f), "utf8"); };
  var app = read("app.js");
  ok(!/recordError\(\{\s*cat:\s*f\.cat,\s*target:\s*f\.msg/.test(app), "Scrivi y el dictogloss ya no guardan el mensaje donde va la forma correcta");
  ok(/Errores\.recordFindings\(state, hard, text/.test(app), "Scrivi anota sus hallazgos con bad/good/why");
  ok(/Errores\.recordFindings\(state, dg\.findings/.test(app), "el dictogloss anota con el objeto común");
  ok(/Errores\.record\(state, Errores\.fromRow\(h\[1\]/.test(app), "la revisión final de Parla anota con el objeto común");
  ok(/recordFindings: function \(findings, text, reg\)/.test(app) && /H\.recordFindings\(r\.check\.findings/.test(read("tramo.js")), "la tarea del tramo anota sus errores");
  ok(/H\.recordRows\(a\.errors/.test(read("tramo.js")), "los errores de la rúbrica de la IA también (fuera del puntaje si no tienen tipo)");
  ok((read("escritura_plus.js").match(/h\.recordFindings\(/g) || []).length >= 2, "Escritura plus (tres vueltas y reformulación) anota");
  ok(/\.fromDiag\(d, given, o\)/.test(app), "las respuestas cerradas pasan por el objeto común");
  ok(/r\.local\.concat\(Scrivi\.fromAI\(text, data, r\.local\)\)/.test(app) && !/r\.findings = \[\]; r\.hard = 0; runAI\(\)/.test(app), "Scrivi con clave suma la IA a lo local (no lo tira)");
  ok(/id="aihint">🤖 Explicame/.test(app) && /Explicame más/.test(app), "«Explicame» antes de la solución y «Explicame más» en la hoja final");
  ok(/🙋 Mi respuesta es válida/.test(app) && /function claimValid/.test(app), "«🙋 Mi respuesta es válida» en la hoja de error");
  ok(/Diagnosi\.addWords\(Object\.keys\(g\)\)/.test(app), "el glosario se suma al diccionario del diagnóstico");
  ok(/opt: inTramo/.test(app), "en 27-51 el Scrivi corto no es misión obligatoria");
})();

/* ----------------------------- el juez y los pedidos, con fetch simulado */
(function () {
  var ctx = CTX.it, S = ctx.Scrivi, bodies = [];
  memStore(ctx);
  ctx.fetch = function (url, opt) {
    var b = JSON.parse(opt.body);
    bodies.push([b.system || ""].concat(b.messages.map(function (m) { return m.content; })).join("\n"));
    if (/no está entre las previstas/.test(bodies[bodies.length - 1])) return jsonResp(reply({ correcta: true, mismo_sentido: true, explicacion: "*Oggi non lavoro* también vale." }));
    return jsonResp(reply({ errores: [{ mal: "ho", bien: "sono", tipo: "ausiliare", explicacion: "movimiento" }], corregido: "", consigna: "", comentario: "" }));
  };
  var pending = 2;
  var fin = function () { if (--pending === 0) T.done(); };
  S.judge({ prompt: "Traducí", stem: "Hoy no trabajo", given: "Non lavoro oggi", answer: "Oggi non lavoro", feedback: "Orden: *Oggi non lavoro*" }, { claude: "k" }, function (e, d) {
    ok(!e && d.correcta === true && d.mismo_sentido === true, "[it] el juez responde con JSON (fetch simulado): " + (e ? e.message : JSON.stringify(d)));
    ok(/Orden: \*Oggi non lavoro\*/.test(bodies[0]), "[it] el juez recibe lo que dijo la app");
    fin();
  });
  var ctxC = ctx.Errores.courseCtx(pack.data("it", "course.json"), { errs: {} }, 6, { local: ["«ho» → «sono»: auxiliar"] });
  S.aiCheck("Ieri ho andato al mare.", 6, { claude: "k" }, function (e, d, meta) {
    var two = bodies.filter(function (b) { return /Marcas SEGURAS/.test(b); });
    ok(!e && d.errores.length === 1 && meta.review, "[it] corrige y revisa (dos pedidos)");
    ok(two.length >= 2 && two.every(function (b) { return /semana 6/.test(b); }), "[it] los dos pedidos llevan el curso y las marcas seguras");
    fin();
  }, null, { ctx: ctxC, evidence: { local: ["«ho» → «sono»: auxiliar"], lt: [] } });
})();
