/* Scrivi: cada texto modelo cumple su consigna y el corrector no le marca
   nada; los errores típicos escritos a mano sí se marcan, con su categoría.
   Run: node tools/it/test_scrivi.js  */
var fs = require("fs");
var path = require("path");
var pack = require("../lib/pack.js");
var ctx = pack("it");
var Banca = ctx.Banca;
Banca.load(pack.data("it", "bank.json"));
var S = ctx.Scrivi;
// The frequency lexicon, as in the app (slogan, calo, marchi exist).
ctx.Freq.load(pack.data("it", "frequenza.json"));
var Frasi = ctx.Frasi;
var Letture = ctx.Letture;
S.learnCourse({ items: pack.data("it", "course.json").items,
  bank: Banca.bank(), phrases: Frasi.ALL, readings: Letture.EPISODI,
  glossario: pack.data("it", "glossario.json") });

var T = require("../lib/testkit.js")("it"), ok = T.ok, verbose = process.argv.indexOf("-v") >= 0;

S.weeks().forEach(function (w) {
  var t = S.TASKS[w], r = S.check(t.model, w);
  r.reqs.forEach(function (q) { ok(q.ok, "semana " + w + ": el modelo no cumple «" + q.label + "» (" + q.n + "/" + q.need + ")"); });
  var hard = r.findings.filter(function (f) { return !f.soft; });
  ok(!hard.length, "semana " + w + ": el modelo tiene errores marcados: " + hard.map(function (f) { return f.msg; }).join(" | "));
  if (verbose && r.findings.length) console.log("  sem " + w + " notas: " + r.findings.map(function (f) { return f.msg; }).join(" | "));
});

// De la 8 a la 25, tareas situadas (destinatario y propósito) de 40-80
// palabras; desde la 14 la consigna va en italiano.
S.weeks().filter(function (w) { return w >= 8 && w <= 25; }).forEach(function (w) {
  var t = S.TASKS[w], n = S.check(t.model, w).reqs[0].n;
  ok(t.min >= 40 && t.min <= 55 && n >= t.min && n <= 80, "semana " + w + ": tarea de 40-80 palabras (mínimo " + t.min + ", modelo " + n + ")");
  if (w >= 14) ok(/\b(scrivi|rispondi|racconta|chiedi)\w*/i.test(t.t) && !/[¿¡]|\b(contá|escribí|decile)\b/i.test(t.t), "semana " + w + ": la consigna va en italiano");
});

// [texto, semana, categoría esperada]
var ERR = [
  ["Ieri ho andato al cinema con Marco.", 11, "ausiliare"],
  ["Stamattina mi ho lavato in fretta.", 16, "ausiliare"],
  ["Ho conosciuto a Giulia in vacanza.", 11, "a_personale"],
  ["Il mio padre lavora in banca.", 17, "articolo_possessivo"],
  ["Mio libro è sul tavolo.", 17, "articolo_possessivo"],
  ["Vado a il cinema stasera.", 9, "preposizione_articolata"],
  ["Se avrei tempo, verrei con te.", 33, "periodo_ipotetico"],
  ["Penso che è troppo tardi.", 25, "congiuntivo"],
  ["Ho molto amici a Roma.", 17, "accordo"],
  ["C'è due gatti in giardino.", 9, "ci_ne"],
  ["Lui e alto e simpatico.", 4, "accento"],
  ["Sono trenta anni che vivo qui.", 5, null],
  ["Ho trenta anni e sono muy contento.", 5, "parola_spagnola"],
  ["Il studente è bravo.", 3, "articolo"],
  ["La problema è grande.", 3, "genere"],
  ["Mio nono è simpatico e la citta è bella.", 4, "accento"],
  ["Ho due fratelli y una sorella.", 2, "parola_spagnola"]
];
ERR.forEach(function (e) {
  var f = S.lint(e[0], e[1]).filter(function (x) { return !x.soft; });
  if (e[2]) ok(f.some(function (x) { return x.cat === e[2]; }), "«" + e[0] + "» debería marcar " + e[2] + " (marca: " + f.map(function (x) { return x.cat; }).join(", ") + ")");
});
// El texto de la captura del usuario: cinco errores, los cinco marcados.
(function () {
  var f = S.lint("Ciao. Mi chiami Augusto. Hanno 32 anne e siamo argentino. Sono felici a Buenos Aires. Ciao!", 1).filter(function (x) { return !x.soft; });
  var cats = f.map(function (x) { return x.cat; });
  ok(f.length >= 5 && cats.filter(function (c) { return c === "persona_verbale"; }).length >= 3 &&
     cats.indexOf("plurale") >= 0 && cats.indexOf("accordo") >= 0, "presentación con cinco errores: marca " + cats.join(", "));
})();
// Plural en castellano: la palabra italiana, ya en plural.
(function () {
  var m = S.lint("Ho 32 annos e due gatos. Mi piacciono los libros.", 1).map(function (x) { return x.msg; }).join(" | ");
  ok(/anni/.test(m) && /gatti/.test(m) && /libri/.test(m), "plurales en castellano con su traducción: " + m);
})();
// frases correctas que no se marcan
["Mi ha detto che viene domani.", "Ci abbiamo pensato a lungo.", "Mi chiedo se sarebbe d'accordo.", "La mia mamma è qui.",
 "Il loro padre è medico.", "Conosco Giulia da anni.", "Vado da Marco a piedi.", "Credo che sia vero.",
 "Questo libro è mio.", "Ho trent'anni.", "Lui è alto.", "Mi piacciono i film. Marco e Anna sono felici.",
 "Siamo in tre: io, Marco e Anna.", "Mi chiami domani? Io sono stanco.", "Arrivo il tredici maggio.",
 "Sono di Roma. Hai vent'anni? Mia sorella è simpatica e i miei genitori sono contenti."].forEach(function (t) {
  var f = S.lint(t, 52).filter(function (x) { return !x.soft; });
  ok(!f.length, "«" + t + "» no debería marcar nada: " + f.map(function (x) { return x.msg; }).join(" | "));
});

// La IA clasifica cada error con las categorías de la clínica; «stile» es
// sugerencia, no error; una «corrección» igual al original no se muestra.
(function () {
  var f = S.fromAI("Io ho andato a casa. Mi piace molto.", { errores: [
    { mal: "Mi piace molto", bien: "Mi piace tanto", tipo: "stile", explicacion: "y" },
    { mal: "ho andato", bien: "sono andato", tipo: "ausiliare", explicacion: "x" },
    { mal: "casa", bien: "casa", tipo: "lessico", explicacion: "z" },
    { mal: "Io", bien: "", tipo: "inventado", explicacion: "w" }] }, []);
  ok(f.length === 3 && f[0].cat === "ia" && f[1].cat === "ausiliare" && !f[1].soft && f[2].cat === "stile" && f[2].soft,
     "IA: tipos de error: " + JSON.stringify(f.map(function (x) { return [x.cat, x.soft]; })));
  ok(/ausiliare/.test(S.aiPrompt("x", 11, S.TASKS[11])) && /passato prossimo/.test(S.aiPrompt("x", 11, S.TASKS[11])), "IA: el pedido lleva la lista de tipos y las estructuras de la semana");
})();

(function () {
  var f = S.fromAI("Hanno 32 annos e sono qui.", { errores: [
    { mal: "Hanno 32 annos", bien: "Ho 32 anni", tipo: "persona_verbale", explicacion: "a" },
    { mal: "annos", bien: "anni", tipo: "parola_spagnola", explicacion: "b" }] }, []);
  ok(f.length === 1, "IA: un error adentro de otro ya marcado no se repite (" + f.length + ")");
})();

// Corpus de textos de estudiantes hispanohablantes con cada error anotado
// (tools/scrivi_corpus.json): cuántos errores marca el corrector propio
// por familia, y que no marque nada en las versiones corregidas ni en las
// frases del curso.  Los pisos de abajo son el nivel medido: si una regla
// nueva los baja, algo se rompió.
(function () {
  var C = JSON.parse(fs.readFileSync(path.join(__dirname, "scrivi_corpus.json"), "utf8"));
  var hit = 0, tot = 0, falsos = [], byCat = {};
  C.forEach(function (o) {
    var tk = S.toks(o.text), f = S.lint(o.text, o.week).filter(function (x) { return !x.soft; });
    o.errors.forEach(function (e) {
      var a = o.text.indexOf(e.wrong), b = a + e.wrong.length, ids = [];
      tk.forEach(function (t, i) { if (t.w && t.at < b && t.at + t.len > a) ids.push(i); });
      var got = f.some(function (x) { for (var k = x.i; k < x.i + x.n; k++) if (ids.indexOf(k) >= 0) return true; return false; });
      var c = byCat[e.cat] = byCat[e.cat] || [0, 0];
      c[1]++; tot++;
      if (got) { c[0]++; hit++; }
    });
    var tc = S.toks(o.corrected);
    S.lint(o.corrected, o.week).filter(function (x) { return !x.soft; }).forEach(function (x) {
      falsos.push("semana " + o.week + " «" + tc.slice(x.i, x.i + x.n).map(function (z) { return z.o; }).join(" ") + "»: " + x.msg);
    });
  });
  ok(hit / tot >= 0.67, "corpus: el corrector propio marca " + hit + "/" + tot + " errores (piso 67%; 61% antes de las familias B1-C1)");
  // (ci_ne 0/14, orden 1/9, pronombres 9/50, participio 11/37, tiempo y modo
  // 29/78 y persona 16/43 antes de las reglas de lintB2)
  var FLOOR = { spagnolo: 0.85, preposizione: 0.75, articolo: 0.9, ausiliare: 0.9, accento: 0.9, concordanza: 0.55, a_personale: 0.75, ortografia: 0.6, doppie: 0.8,
                ci_ne: 0.65, ordine: 0.5, pronome: 0.4, participio: 0.55, tempo_modo: 0.45, persona: 0.45 };
  Object.keys(FLOOR).forEach(function (k) {
    var c = byCat[k] || [0, 1];
    ok(c[0] / c[1] >= FLOOR[k], "corpus, " + k + ": " + c[0] + "/" + c[1] + " (piso " + Math.round(FLOOR[k] * 100) + "%)");
  });
  ok(!falsos.length, "corpus: marca errores en textos corregidos: " + falsos.slice(0, 5).join(" | "));

  // Lo que se guarda de cada marca (C9): lo escrito, la corrección si se
  // sabe, el porqué; y mensajes que explican (C7: antes el 62 % tenía menos
  // de 45 caracteres).
  var all = [];
  C.forEach(function (o) { S.lint(o.text, o.week).forEach(function (x) { all.push(x); }); });
  var sinBad = all.filter(function (x) { return typeof x.bad !== "string" || !x.bad; });
  var sinWhy = all.filter(function (x) { return !x.why; });
  var conGood = all.filter(function (x) { return typeof x.good === "string"; });
  ok(!sinBad.length, "marcas sin «bad»: " + sinBad.length);
  ok(sinWhy.length <= all.length * 0.02, "marcas sin «why»: " + sinWhy.length + "/" + all.length);
  ok(conGood.length >= all.length * 0.85, "marcas con «good»: " + conGood.length + "/" + all.length);
  ok(all.every(function (x) { return x.good == null || x.good.toLowerCase() !== x.bad.toLowerCase(); }), "una corrección igual a lo escrito");
  var cortos = all.filter(function (x) { return x.msg.length < 45; }).length;
  ok(cortos <= all.length * 0.1, "mensajes de menos de 45 caracteres: " + cortos + "/" + all.length);
  if (verbose) console.log("  marcas: " + all.length + ", con good " + conGood.length + ", cortas " + cortos);
  var cav = S.lint("Alla fine me l'ho cavata da solo.", 40).filter(function (x) { return x.cat === "ausiliare"; })[0];
  ok(cav && cav.good === "la sono cavata" || (cav && /me la sono cavata/.test(cav.msg)), "me l'ho cavata → me la sono cavata: " + (cav && cav.msg));
  var ap = S.lint("Ho conosciuto a Giulia in vacanza.", 11).filter(function (x) { return x.cat === "a_personale"; })[0];
  ok(ap && ap.bad === "a" && ap.good === "", "a personal: bad «a», good vacío: " + JSON.stringify(ap));

  // El texto nativo del tramo (lecturas y escuchas de las semanas 27-51):
  // ninguna marca (antes 18 en 25.489 palabras: piovve, slogan, calo…).
  var tdir = path.join(__dirname, "tramo"), tramoBad = [];
  fs.readdirSync(tdir).filter(function (f) { return /^w\d+\.json$/.test(f); }).forEach(function (f) {
    var j = JSON.parse(fs.readFileSync(path.join(tdir, f), "utf8")), wk = +f.slice(1, 3);
    var texts = [];
    if (j.lettura && j.lettura.text) texts.push(j.lettura.text);
    if (j.ascolto && j.ascolto.turns) texts.push(j.ascolto.turns.map(function (t) { return t[1]; }).join("\n"));
    texts.forEach(function (t) {
      S.lint(t, wk).filter(function (x) { return !x.soft; }).forEach(function (x) { tramoBad.push(f + " «" + x.bad + "»: " + x.msg.slice(0, 80)); });
    });
  });
  ok(!tramoBad.length, "tramo: " + tramoBad.length + " marcas en texto nativo: " + tramoBad.slice(0, 5).join(" | "));
  if (verbose) console.log("  corpus: " + hit + "/" + tot + " · " + Object.keys(byCat).map(function (k) { return k + " " + byCat[k][0] + "/" + byCat[k][1]; }).join(", "));

  var clean = [];
  Frasi.ALL.forEach(function (f) { clean.push(f.it); });
  // The long C1 readings (series «lunga») stay out: their prose goes beyond
  // what the rules are tuned for (si fermò… per far passare le capre, mi resi
  // conto); test_tramo.js checks them, and the task marks never block.
  Letture.EPISODI.forEach(function (e) { if (e.series !== "lunga") e.text.split(/\n+/).forEach(function (l) { clean.push(l); }); });
  (Banca.bank().sentences || []).forEach(function (x) { (x.it || []).forEach(function (a) { clean.push(a); }); });
  clean = clean.filter(function (t) { return t && !/→|_{2,}|\/|[¡¿]|\s{3,}/.test(t); });
  var bad = [];
  clean.forEach(function (t) {
    var tk = S.toks(t);
    S.lint(t, 52).filter(function (x) { return !x.soft; }).forEach(function (x) { bad.push("«" + tk.slice(x.i, x.i + x.n).map(function (z) { return z.o; }).join(" ") + "» en «" + t.slice(0, 60) + "»: " + x.msg); });
  });
  ok(!bad.length, "frases del curso (" + clean.length + "): " + bad.length + " marcadas: " + bad.slice(0, 5).join(" | "));
})();

/* La llamada a la IA (Claude Haiku), con fetch simulado: un pedido bien
   armado; saturado → otra vuelta; clave mala → error claro; lee el JSON
   aunque venga con ``` o texto alrededor. */
var GEM = [];
function gem(name, plan, check, keys, mode) { GEM.push([name, plan, check, keys, mode]); }
function runGem() {
  if (!GEM.length) return T.done();
  ctx.IA.retryWaits([0, 0]);
  var g = GEM.shift(), calls = [], mem = {};
  ctx.localStorage = { getItem: function (k) { return mem[k] || null; }, setItem: function (k, v) { mem[k] = v; } };
  ctx.fetch = function (url, opt) {
    var body = JSON.parse(opt.body);
    calls.push(body.model + (/anthropic\.com\/v1\/messages$/.test(url) && opt.headers["x-api-key"] ? "~" : "?") +
               (/segundo profesor/.test(body.messages[0].content) ? "#rev" : ""));
    var a = g[1](calls.length, body);
    return Promise.resolve({ ok: a.status === 200, status: a.status, json: function () { return Promise.resolve(a.body); },
                             text: function () { return Promise.resolve(JSON.stringify(a.body || {})); } });
  };
  var cb = function (err, data, meta) {
    ok(g[2](err, data, calls, meta), "ia " + g[0] + ": " + (err ? err.message : "ok") + " · " + calls.join(" → "));
    runGem();
  };
  if (g[4] === "aicheck") S.aiCheck("Io ho andato a casa.", 11, g[3] || "K", cb);
  else S.explain({ prompt: "p", stem: "s", given: "a", answer: "b" }, g[3] || "K", cb);
}
function reply(txt) { return { model: "claude-haiku-5-5", stop_reason: "end_turn", content: [{ type: "text", text: txt }] }; }
var GOOD = reply('{"tambien_correcta":false,"explicacion":"x"}');
gem("Claude Haiku", function () { return { status: 200, body: GOOD }; },
    function (e, d, c, m) { return !e && d.explicacion === "x" && c[0] === "claude-haiku-5-5~" && m.provider === "Claude"; });
gem("la clave en un objeto", function () { return { status: 200, body: GOOD }; },
    function (e, d, c) { return !e && c.length === 1; }, { claude: "sk-ant-x" });
gem("saturado → otra vuelta", function (n) { return n === 1 ? { status: 529, body: {} } : { status: 200, body: GOOD }; },
    function (e, d, c) { return !e && c.length === 2; });
gem("todo saturado", function () { return { status: 503, body: {} }; },
    function (e, d, c) { return e && /saturado/.test(e.message) && c.length === 3; });
gem("clave mala", function () { return { status: 401, body: { error: { message: "invalid x-api-key" } } }; },
    function (e, d, c) { return e && /clave/.test(e.message) && c.length === 1; });
gem("JSON con ``` y texto alrededor", function () { return { status: 200, body: reply('Acá va:\n```json\n{"tambien_correcta":true,"explicacion":"y"}\n```') }; },
    function (e, d) { return !e && d.tambien_correcta === true && d.explicacion === "y"; });
// Scrivi: corrige y un segundo profesor revisa; si la revisión falla, queda la primera.
var FIRST = reply(JSON.stringify({ errores: [{ mal: "ho andato", bien: "sono andato", tipo: "ausiliare", explicacion: "a" },
                                             { mal: "andato", bien: "andato", tipo: "ausiliare", explicacion: "dup" }], corregido: "x" }));
var REV = reply(JSON.stringify({ errores: [{ mal: "ho andato", bien: "sono andato", tipo: "ausiliare", explicacion: "revisada" }], corregido: "x" }));
gem("corrige y revisa", function (n, b) { return { status: 200, body: /segundo profesor/.test(b.messages[0].content) ? REV : FIRST }; },
    function (e, d, c, m) { return !e && d.errores.length === 1 && d.errores[0].explicacion === "revisada" && c.length === 2 && /#rev$/.test(c[1]) &&
      m && m.first.provider === "Claude" && m.first.model === "claude-haiku-5-5" && m.review && m.review.model === "claude-haiku-5-5"; }, "K", "aicheck");
gem("la revisión falla → queda la primera", function (n, b) { return /segundo profesor/.test(b.messages[0].content) ? { status: 401, body: {} } : { status: 200, body: FIRST }; },
    function (e, d, c, m) { return !e && d.errores.length === 2 && m && m.first && !m.review; }, "K", "aicheck");
runGem();
