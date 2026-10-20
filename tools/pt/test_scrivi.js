/* Scrivi: cada texto modelo cumple su consigna y el corrector no le marca
   nada; los errores típicos escritos a mano sí se marcan, con su categoría;
   el corpus de textos de hispanohablantes (tools/scrivi_corpus.json) mide
   cuántos errores ve el corrector propio y que no marque nada en las
   versiones corregidas ni en las frases del curso.
   Run: node tools/pt/test_scrivi.js [-v]  */
var fs = require("fs");
var path = require("path");
var pack = require("../lib/pack.js");
var ctx = pack("pt");
var Diagnosi = ctx.Diagnosi;

var verbose = process.argv.indexOf("-v") >= 0;
var T = require("../lib/testkit.js")("pt"), ok = T.ok;
// El recall honesto de la tanda nueva del corpus, medido: si una regla lo baja, algo se rompió.
var TANDA_FLOOR = 0.9;

// The course data, when it is already Portuguese (the port goes module by
// module): the bank feeds the diagnosis, and everything feeds the lexicon.
function readJSON(p) { try { return pack.data("pt", p); } catch (e) { return null; } }
function isPt(list) {
  var txt = (list || []).slice(0, 300).join(" ");
  return /\b(você|não|também|está)\b/.test(txt) && !/\b(sono|della|perché|anche)\b/.test(txt);
}
var bank = readJSON("bank.json");
// Como en la app: la frecuencia (window.Freq) le dice al corrector qué palabras existen aunque el curso no las enseñe.
if (ctx.Freq && readJSON("frequenza.json")) ctx.Freq.load(readJSON("frequenza.json"));
var Banca = null;
if (bank && isPt((bank.sentences || []).map(function (s) { return (s.pt || s.it || [])[0]; }))) {
  try { Banca = ctx.Banca; Banca.load(bank); } catch (e) { Diagnosi.init(bank); }
} else bank = null;
var S = ctx.Scrivi;
var course = readJSON("course.json"), glossario = readJSON("glossario.json");
var Frasi = null, Letture = null;
Frasi = ctx.Frasi || null;
Letture = ctx.Letture || null;
var phrases = Frasi && Frasi.ALL && isPt(Frasi.ALL.map(function (f) { return f.pt || f.it; })) ? Frasi.ALL : null;
var readings = Letture && Letture.EPISODI && isPt(Letture.EPISODI.map(function (e) { return e.text; })) ? Letture.EPISODI : null;
var items = course && isPt((course.items || []).map(function (i) { return String(i.answer || ""); })) ? course.items : null;
S.learnCourse({ items: items || [], bank: bank ? (Banca && Banca.bank ? Banca.bank() : bank) : null, phrases: phrases || [], readings: readings || [],
  glossario: glossario && isPt(Object.keys(glossario)) ? glossario : {} });
if (!bank || !items || !phrases || !readings) console.log("(datos del curso todavía no portados: " +
  [!bank && "banco", !items && "ítems", !phrases && "frases", !readings && "lecturas"].filter(Boolean).join(", ") + ")");

/* ------------------------------------------------ las tareas y sus modelos */

var WEEKS = S.weeks();
ok(WEEKS.length === 48, "una tarea por semana menos las de jefe: " + WEEKS.length);
[13, 26, 39, 52].forEach(function (w) { ok(!S.TASKS[w], "la semana de jefe " + w + " no tiene tarea"); });
WEEKS.forEach(function (w) {
  var t = S.TASKS[w], r = S.check(t.model, w);
  ok(t.t && /[áéíóú]|[a-z]/.test(t.t) && t.use.length, "semana " + w + ": consigna y estructuras");
  r.reqs.forEach(function (q) { ok(q.ok, "semana " + w + ": el modelo no cumple «" + q.label + "» (" + q.n + "/" + q.need + ")"); });
  var hard = r.findings.filter(function (f) { return !f.soft; });
  var tk = S.toks(t.model);
  ok(!hard.length, "semana " + w + ": el modelo tiene errores marcados: " + hard.map(function (f) { return "«" + tk.slice(f.i, f.i + f.n).map(function (x) { return x.o; }).join(" ") + "» " + f.msg; }).join(" | "));
  if (verbose && r.findings.length) console.log("  sem " + w + " notas: " + r.findings.map(function (f) { return f.msg; }).join(" | "));
});
// Nothing before its theory: the tenses a model uses exist by its week.
(function () {
  var TW = { perfeito: 11, imperfeito: 15, futuro: 17, condicional: 18, subjPresente: 23, subjFuturo: 27, subjImperfeito: 28, infPessoal: 29, maisQuePerfeito: 41 };
  var FORM = { perfeitoComposto: 21, hipotesePassado: 30 };
  WEEKS.forEach(function (w) {
    var f = S.features(S.TASKS[w].model);
    if (w < 11) ok(!f.perfeito, "semana " + w + ": el modelo usa el perfeito antes de la semana 11");
    if (w < 15) ok(!f.imperfeito, "semana " + w + ": el modelo usa el imperfeito antes de la semana 15");
    if (w < 17) ok(!f.futuro, "semana " + w + ": el modelo usa el futuro antes de la semana 17");
    if (w < 18) ok(!f.condicional, "semana " + w + ": el modelo usa el condicional antes de la semana 18");
    if (w < 23) ok(!f.subjuntivo, "semana " + w + ": el modelo usa el subjuntivo antes de la semana 23");
    if (w < 27) ok(!f.futSubj, "semana " + w + ": el modelo usa el futuro do subjuntivo antes de la semana 27");
    if (w < 28) ok(!f.subjImperfeito, "semana " + w + ": el modelo usa el imperfeito do subjuntivo antes de la semana 28");
    if (w < 21) ok(!f.perfeitoComposto, "semana " + w + ": el modelo usa el perfeito composto antes de la semana 21");
    if (w < 41) ok(!f.maisQuePerfeito, "semana " + w + ": el modelo usa el mais-que-perfeito simples antes de la semana 41");
  });
  void TW; void FORM;
})();

/* ------------------------------------------- errores escritos a mano */

// [texto, semana, categoría esperada]
var ERR = [
  ["Estou em o Rio com a minha família.", 3, "contraccion"],
  ["O carro de ele é azul.", 10, "contraccion"],
  ["Moro em Brasil há dois anos.", 5, "contraccion"],
  ["A Bia é muy simpática.", 4, "muito"],
  ["Tenho muito amigas no Rio.", 4, "muito"],
  ["Eu gosto café com leite.", 14, "gostar"],
  ["Me gusta o samba.", 14, "gostar"],
  ["Ontem vi ao João na praia.", 11, "a_personal"],
  ["Visitei a meus avós no domingo.", 11, "a_personal"],
  ["Ontem eu fazi um bolo.", 11, "regularizacion"],
  ["Eu sabo nadar muito bem.", 6, "regularizacion"],
  ["Hoje eu tenho comido muito.", 21, "perfeito_composto"],
  ["Ontem eu he ido à praia.", 11, "perfeito_composto"],
  ["Se eu ter tempo, vou à praia.", 27, "futuro_subj"],
  ["Quando eu chegue, te ligo.", 27, "futuro_subj"],
  ["É importante para eles saber a verdade.", 29, "inf_pessoal"],
  ["Espero que você vem amanhã.", 23, "subjuntivo"],
  ["Se eu teria dinheiro, viajaria.", 28, "subjuntivo"],
  ["Eu nao sei.", 1, "nasal"],
  ["Eu tengo dois irmãos.", 2, "espanol"],
  ["Pero eu não quero ir.", 6, "espanol"],
  ["Tenho um irmão y uma irmã.", 2, "espanol"],
  ["A leite está quente.", 2, "genero"],
  ["O viagem foi incrível.", 11, "genero"],
  ["Vou a praia no sábado.", 9, "crase"],
  ["A aula começa as três.", 7, "crase"],
  ["Tenho dois animals.", 2, "plural"],
  ["Você falas português?", 5, "persona"],
  ["A gente vamos ao cinema.", 5, "persona"],
  ["Eles tem dois filhos.", 5, "persona"],
  ["Isso é para mí.", 16, "pronome"],
  ["Ela vai com eu.", 16, "pronome"],
  ["Não disse-me nada.", 33, "colocacao"],
  ["A conta foi pagada ontem.", 22, "participio"],
  ["Ela namora com o Pedro.", 35, "regencia"],
  ["Penso você todos os dias.", 35, "regencia"],
  ["Eu estaba cansado.", 15, "espanol"],
  ["A cancion é linda.", 14, "espanol"],
  ["Houveram muitos problemas.", 40, "persona"],
  ["Ele e alto e simpático.", 4, "tilde"],
  ["Cheguei a dois anos.", 11, "ortografia"],
  ["Eu vou a comer.", 8, "espanol"],
  ["O Rio é mais grande que Salvador.", 19, "regularizacion"],
  ["Pedi um vaso de água.", 45, "falso_amigo"],
  ["Ela tem o pelo longo.", 4, "falso_amigo"],
  ["Me acordo da viagem.", 45, "falso_amigo"],
  ["Mais eu não quero.", 6, "lexico"],
  ["Porque você não vem?", 8, "ortografia"],
  ["Aqui no se permite fumar.", 32, "espanol"],
  ["Tomei una decisão.", 11, "espanol"],
  ["Tomo um cafecito na padaria.", 44, "espanol"],
  ["O senhor voce é muito gentil.", 43, "tilde"]
];
ERR.forEach(function (e) {
  var f = S.lint(e[0], e[1]).filter(function (x) { return !x.soft; });
  if (e[2]) ok(f.some(function (x) { return x.cat === e[2]; }), "«" + e[0] + "» debería marcar " + e[2] + " (marca: " + f.map(function (x) { return x.cat; }).join(", ") + ")");
});
// Una presentación con cinco errores: los cinco marcados.
(function () {
  var f = S.lint("Oi. Me chamo Augusto. Tengo 32 anos e soy argentino. Moro em o Rio. Eu gosto muy o samba.", 14).filter(function (x) { return !x.soft; });
  var cats = f.map(function (x) { return x.cat; });
  ok(f.length >= 5 && cats.filter(function (c) { return c === "espanol"; }).length >= 2 && cats.indexOf("contraccion") >= 0 &&
     cats.indexOf("muito") >= 0 && cats.indexOf("gostar") >= 0, "presentación con cinco errores: marca " + cats.join(", "));
})();
// Plural a la española: la palabra portuguesa, ya en plural.
(function () {
  var m = S.lint("Tenho dois animals e três papels. Os homems chegaram.", 2).map(function (x) { return x.msg; }).join(" | ");
  ok(/animais/.test(m) && /papéis/.test(m) && /homens/.test(m), "plurales a la española con su corrección: " + m);
})();
// Frases correctas que no se marcan.
["Ela disse que vem amanhã.", "Vi a Maria na praia.", "Conheço o João desde 2020.", "Moro em Portugal.", "Vou a Copacabana amanhã.",
 "Antes de ele chegar, saímos.", "Eu me chamo Ana e sou carioca.", "Chamo-me Ana.", "Acho que ele vem amanhã.", "Quando eu era criança, morava em Córdoba.",
 "Se você quiser, a gente vai.", "Tenho estudado muito ultimamente.", "Há dois anos moro no Rio.", "Gosto muito de samba.", "A gente vai à praia.",
 "Eles têm dois filhos.", "Ela é muito bonita.", "Faz muito calor.", "Vou para casa às duas.", "São três horas.", "Para eu fazer isso, preciso de ajuda.",
 "Não me disse nada.", "Comprei-o ontem.", "Vou vê-lo amanhã.", "Aluga-se apartamento.", "Não sei se seria possível.", "Moro num apartamento pequeno.",
 "O que você quer?", "Por que você não vem?", "Ele é alto e simpático.", "Ela está em casa.", "Minha casa é grande.", "Vi ele ontem no boteco.",
 "Tô cansado, né?", "No verão, a praia fica lotada.", "Ele mora no Leblon desde as seis da manhã.", "Quando chego em casa, janto."].forEach(function (t) {
  var f = S.lint(t, 52).filter(function (x) { return !x.soft; });
  ok(!f.length, "«" + t + "» no debería marcar nada: " + f.map(function (x) { return x.msg; }).join(" | "));
});

/* ---------------------------------------------------------------- la IA */

// La IA clasifica cada error con las categorías de la clínica; «estilo» es
// sugerencia, no error; una «corrección» igual al original no se muestra.
(function () {
  var f = S.fromAI("Eu tenho ido à praia. Gosto muito disso.", { errores: [
    { mal: "Gosto muito disso", bien: "Adoro isso", tipo: "estilo", explicacion: "y" },
    { mal: "tenho ido", bien: "fui", tipo: "perfeito_composto", explicacion: "x" },
    { mal: "praia", bien: "praia", tipo: "lexico", explicacion: "z" },
    { mal: "Eu", bien: "", tipo: "inventado", explicacion: "w" }] }, []);
  ok(f.length === 3 && f[0].cat === "ia" && f[1].cat === "perfeito_composto" && !f[1].soft && f[2].cat === "estilo" && f[2].soft,
     "IA: tipos de error: " + JSON.stringify(f.map(function (x) { return [x.cat, x.soft]; })));
  var pr = S.aiPrompt("x", 11, S.TASKS[11]);
  ok(/perfeito_composto/.test(pr) && /pretérito perfeito/.test(pr) && /Brasil/.test(pr), "IA: el pedido lleva la lista de tipos, las estructuras de la semana y la norma brasileña");
  Object.keys(S.AI_TYPES).forEach(function (k) {
    if (k !== "estilo") ok(Diagnosi.LABEL[k], "IA: el tipo «" + k + "» es una categoría del diagnóstico");
  });
  var ex = S.esamePrompt({ t: "Escribí un artículo de opinión.", words: 200, rubric: [["contexto", "x"]] }, "Texto.");
  ok(/"contexto"/.test(ex) && /"discursiva"/.test(ex) && /"linguistica"/.test(ex) && /"lexico"/.test(ex) && /Celpe-Bras/.test(ex) && !/CILS|CELI|PLIDA/.test(ex),
     "examen: la rúbrica del Celpe-Bras con sus cuatro claves");
})();
(function () {
  var f = S.fromAI("Eu tengo 32 anos e sou daqui.", { errores: [
    { mal: "Eu tengo 32 anos", bien: "Eu tenho 32 anos", tipo: "espanol", explicacion: "a" },
    { mal: "tengo", bien: "tenho", tipo: "espanol", explicacion: "b" }] }, []);
  ok(f.length === 1, "IA: un error adentro de otro ya marcado no se repite (" + f.length + ")");
})();

/* ----------------------------------------------------------- el corpus
   Textos de estudiantes hispanohablantes con cada error anotado: cuántos
   errores marca el corrector propio por familia, y que no marque nada en
   las versiones corregidas ni en las frases del curso.  Los pisos son el
   nivel medido: si una regla nueva los baja, algo se rompió. */
(function () {
  var ALL = JSON.parse(fs.readFileSync(path.join(__dirname, "scrivi_corpus.json"), "utf8"));
  // La tanda 2026-09 se escribió después de las reglas, con otros temas y otras
  // palabras: su recall es el honesto (auditoría C7).  Las primeras 144 sirvieron
  // para armar las reglas y se miden aparte, con los pisos de siempre.
  var C = ALL.filter(function (o) { return !o.tanda; }), NEW = ALL.filter(function (o) { return /^2026-09/.test(o.tanda || ""); });
  var hit = 0, tot = 0, falsos = [], byCat = {};
  ok(C.length >= 140, "corpus: " + C.length + " textos");
  ok(NEW.length >= 25, "corpus, tanda nueva: " + NEW.length + " textos");
  (function () {
    var h = 0, n = 0, miss = [], cats = {}, held = [0, 0];
    NEW.forEach(function (o) {
      var tk = S.toks(o.text), f = S.lint(o.text, o.week).filter(function (x) { return !x.soft; }), from = 0;
      o.errors.forEach(function (e) {
        var a = o.text.indexOf(e.wrong, from), b = a + e.wrong.length, ids = [];
        ok(a >= 0, "tanda nueva: «" + e.wrong + "» no está en el texto de la semana " + o.week);
        ok(Diagnosi.LABEL[e.cat], "tanda nueva: categoría desconocida " + e.cat);
        from = b;
        tk.forEach(function (t, i) { if (t.w && t.at < b && t.at + t.len > a) ids.push(i); });
        var got = f.some(function (x) { for (var k = x.i; k < x.i + x.n; k++) if (ids.indexOf(k) >= 0) return true; return false; });
        var c = cats[e.cat] = cats[e.cat] || [0, 0]; c[1]++; n++;
        if (o.tanda === "2026-09b") { held[1]++; if (got) held[0]++; }
        if (got) { c[0]++; h++; } else miss.push("semana " + o.week + " " + e.cat + " «" + e.wrong + "»");
      });
      var tc = S.toks(o.corrected);
      S.lint(o.corrected, o.week).filter(function (x) { return !x.soft; }).forEach(function (x) {
        falsos.push("tanda nueva, semana " + o.week + " «" + tc.slice(x.i, x.i + x.n).map(function (z) { return z.o; }).join(" ") + "»: " + x.msg);
      });
    });
    // 2026-09b no se usó para ajustar ninguna regla: es la medida honesta del corrector de hoy
    console.log("corpus, tanda 2026-09b (sin ajustar reglas): " + held[0] + "/" + held[1] + " (" + Math.round(100 * held[0] / (held[1] || 1)) + " %)");
    console.log("corpus, tandas nuevas: " + h + "/" + n + " (" + Math.round(100 * h / n) + " %) · " +
      Object.keys(cats).map(function (k) { return k + " " + cats[k][0] + "/" + cats[k][1]; }).join(", "));
    if (verbose) miss.forEach(function (m) { console.log("  no visto (tanda nueva): " + m); });
    ok(h / n >= TANDA_FLOOR, "corpus, tanda nueva: " + h + "/" + n + " (piso " + Math.round(TANDA_FLOOR * 100) + " %)");
  })();
  C.forEach(function (o) {
    var tk = S.toks(o.text), f = S.lint(o.text, o.week).filter(function (x) { return !x.soft; });
    var from = 0;
    o.errors.forEach(function (e) {
      var a = o.text.indexOf(e.wrong, from), b = a + e.wrong.length, ids = [];
      ok(a >= 0, "corpus: «" + e.wrong + "» no está en el texto de la semana " + o.week);
      from = b;
      ok(Diagnosi.LABEL[e.cat], "corpus: categoría desconocida " + e.cat);
      tk.forEach(function (t, i) { if (t.w && t.at < b && t.at + t.len > a) ids.push(i); });
      var got = f.some(function (x) { for (var k = x.i; k < x.i + x.n; k++) if (ids.indexOf(k) >= 0) return true; return false; });
      var c = byCat[e.cat] = byCat[e.cat] || [0, 0];
      c[1]++; tot++;
      if (got) { c[0]++; hit++; } else if (verbose) console.log("  no visto: semana " + o.week + " " + e.cat + " «" + e.wrong + "»");
    });
    var tc = S.toks(o.corrected);
    S.lint(o.corrected, o.week).filter(function (x) { return !x.soft; }).forEach(function (x) {
      falsos.push("semana " + o.week + " «" + tc.slice(x.i, x.i + x.n).map(function (z) { return z.o; }).join(" ") + "»: " + x.msg);
    });
  });
  ok(hit / tot >= 0.8, "corpus: el corrector propio marca " + hit + "/" + tot + " errores (piso 80%)");
  var FLOOR = { espanol: 0.9, contraccion: 0.95, gostar: 0.9, muito: 0.9, crase: 0.8, subjuntivo: 0.85, futuro_subj: 0.75, regencia: 0.75,
                perfeito_composto: 0.9, tilde: 0.85, preposicion: 0.8, persona: 0.8, regularizacion: 0.8, inf_pessoal: 0.7, colocacao: 0.7,
                falso_amigo: 0.7, participio: 0.7, plural: 0.7, pronome: 0.5, genero: 0.8, a_personal: 0.75, nasal: 0.6 };
  Object.keys(FLOOR).forEach(function (k) {
    var c = byCat[k] || [0, 1];
    ok(c[0] / c[1] >= FLOOR[k], "corpus, " + k + ": " + c[0] + "/" + c[1] + " (piso " + Math.round(FLOOR[k] * 100) + "%)");
  });
  ok(!falsos.length, "corpus: marca errores en textos corregidos: " + falsos.slice(0, 5).join(" | "));
  console.log("corpus: " + hit + "/" + tot + " errores vistos · " + Object.keys(byCat).map(function (k) { return k + " " + byCat[k][0] + "/" + byCat[k][1]; }).join(", "));

  // The course's own Portuguese: nothing to mark.
  var clean = [];
  (phrases || []).forEach(function (f) { clean.push(f.pt || f.it); });
  (readings || []).forEach(function (e) { String(e.text || "").split(/\n+/).forEach(function (l) { clean.push(l); }); });
  (bank && bank.sentences || []).forEach(function (x) { (x.pt || x.it || []).forEach(function (a) { clean.push(a); }); });
  (bank && bank.errors || []).forEach(function (x) { clean.push(x.right); });
  clean = clean.filter(function (t) { return t && !/→|_{2,}|\/|[¡¿]|\s{3,}|\*/.test(t); });
  var bad = [];
  clean.forEach(function (t) {
    var tk = S.toks(t);
    S.lint(t, 52).filter(function (x) { return !x.soft; }).forEach(function (x) { bad.push("«" + tk.slice(x.i, x.i + x.n).map(function (z) { return z.o; }).join(" ") + "» en «" + t.slice(0, 70) + "»: " + x.msg); });
  });
  ok(bad.length <= Math.ceil(clean.length * 0.002), "frases del curso (" + clean.length + "): " + bad.length + " marcadas: " + bad.slice(0, 6).join(" | "));
  if (verbose) bad.forEach(function (b) { console.log("  " + b); });

  // The native Portuguese of the tramo (tools/pt/tramo/wNN.json): the readings and
  // listenings are not the learner's text, so their register is free; the models
  // follow the week's task.  No false alarms (auditoría C7: 52 marcas en 30.085
  // palabras antes; queda una: una lectura sobre falsos amigos que cita «um vaso
  // de água» como ejemplo del error).
  (function () {
    var dir = path.join(__dirname, "tramo"), marks = [], words = 0;
    fs.readdirSync(dir).filter(function (f) { return /^w\d+\.json$/.test(f); }).forEach(function (f) {
      var d = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
      [["lectura", d.lettura && d.lettura.text, { registro: "informal" }],
       ["escucha", ((d.ascolto && d.ascolto.turns) || []).map(function (t) { return Array.isArray(t) ? t[1] : ""; }).join("\n"), { registro: "informal" }],
       ["modelo", d.compito && d.compito.model, null]].forEach(function (x) {
        var t = String(x[1] || ""), tk = S.toks(t);
        words += t.split(/\s+/).length;
        S.lint(t, d.week, x[2]).filter(function (m) { return !m.soft; }).forEach(function (m) {
          marks.push("semana " + d.week + " " + x[0] + " «" + tk.slice(m.i, m.i + m.n).map(function (z) { return z.o; }).join(" ") + "»: " + m.msg);
          ok(x[0] !== "modelo", "tramo: el modelo de la semana " + d.week + " tiene una marca: " + marks[marks.length - 1]);
        });
      });
    });
    console.log("tramo, texto nativo: " + marks.length + " marcas en " + words + " palabras");
    ok(marks.length <= 1, "tramo, texto nativo sin falsas alarmas: " + marks.join(" | "));
  })();

  // The bank's «find the error» sentences: the checker sees most of them.
  if (bank && bank.errors) {
    var seen = 0;
    bank.errors.forEach(function (e) { if (S.lint(e.wrong, 52).some(function (x) { return !x.soft; })) seen++; });
    console.log("errores del banco vistos por el corrector: " + seen + "/" + bank.errors.length);
    ok(seen / bank.errors.length >= 0.5, "errores del banco vistos: " + seen + "/" + bank.errors.length);
  }
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
  if (g[4] === "aicheck") S.aiCheck("Eu tenho ido à praia.", 11, g[3] || "K", cb);
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
var FIRST = reply(JSON.stringify({ errores: [{ mal: "tenho ido", bien: "fui", tipo: "perfeito_composto", explicacion: "a" },
                                             { mal: "ido", bien: "ido", tipo: "perfeito_composto", explicacion: "dup" }], corregido: "x" }));
var REV = reply(JSON.stringify({ errores: [{ mal: "tenho ido", bien: "fui", tipo: "perfeito_composto", explicacion: "revisada" }], corregido: "x" }));
gem("corrige y revisa", function (n, b) { return { status: 200, body: /segundo profesor/.test(b.messages[0].content) ? REV : FIRST }; },
    function (e, d, c, m) { return !e && d.errores.length === 1 && d.errores[0].explicacion === "revisada" && c.length === 2 && /#rev$/.test(c[1]) &&
      m && m.first.provider === "Claude" && m.first.model === "claude-haiku-5-5" && m.review && m.review.model === "claude-haiku-5-5"; }, "K", "aicheck");
gem("la revisión falla → queda la primera", function (n, b) { return /segundo profesor/.test(b.messages[0].content) ? { status: 401, body: {} } : { status: 200, body: FIRST }; },
    function (e, d, c, m) { return !e && d.errores.length === 2 && m && m.first && !m.review; }, "K", "aicheck");
runGem();
