/* La Biblioteca (docs/js/biblioteca.js y docs/lang/<código>/biblioteca/),
 * en los dos idiomas.
 *
 *   node tools/lib/test_biblioteca.js
 *
 * - el índice es válido: de 6 a 10 obras, fichas completas, crédito de
 *   Project Gutenberg, cobertura por semana (52 valores, sin bajar) de cada
 *   capítulo y del libro, cuentos antes que novelas;
 * - cada libro existe, coincide con su ficha, y sus capítulos no están
 *   vacíos; en el cuerpo no queda nada de la licencia ni del encabezado de
 *   Gutenberg, ni marcas de edición (_cursivas_, [1], ^{mo});
 * - portugués: ninguna grafía antigua de la lista de tools/pt/ortografia.js
 *   (pharmacia, elle, sahir, anno…), y la modernización de muestra;
 * - la biblioteca de cada idioma pesa ≤ 15 MB y no está en ORDER (se baja
 *   a demanda);
 * - el lector anda en node sin DOM: páginas que no pierden palabras,
 *   palabras leídas y minutos (una página pasada de largo no cuenta, la xp
 *   tiene tope), autoevaluación que corre el nivel, recomendación ≥ 95 %,
 *   📌 al repaso con su ejercicio, y las pantallas se dibujan;
 * - el núcleo no nombra ningún idioma. */
"use strict";
var fs = require("fs"), path = require("path");
var pack = require("./pack.js");

var fails = 0, checks = 0;
function ok(cond, msg) { checks++; if (!cond) { fails++; console.log("  ✗ " + msg); } }
function rng(seed) { var s = seed || 1; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }

var SRC = fs.readFileSync(path.join(pack.DOCS, "js", "biblioteca.js"), "utf8");
ok(!/italian|portugu|brasil|\bLa Via\b|Rumo C1/i.test(SRC.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "")),
   "biblioteca.js no nombra ningún idioma");
var Boot = require(path.join(pack.DOCS, "js", "boot.js"));
ok(Boot.ORDER.some(function (e) { return e.core === "biblioteca.js"; }), "biblioteca.js está en ORDER de boot.js");
ok(Boot.ORDER.some(function (e) { return e.lang === "biblioteca_data.js"; }), "biblioteca_data.js está en ORDER de boot.js");
ok(!Boot.langFiles("it").concat(Boot.coreFiles()).some(function (f) { return /biblioteca\//.test(f); }),
   "los libros no se precachean");

var Orto = require(path.join(pack.ROOT, "tools", "pt", "ortografia.js"));
var OLD = {};
Orto.OLD.forEach(function (w) { OLD[w] = 1; });

// What must never be in the body of a book.
var LICENSE = /Project Gutenberg|gutenberg\.(org|net)|\bPG\b|\*\*\* ?(START|END)|\bE-?book\b|\bLicen[sc]e\b|www\.|http|Produced by|Distributed Proofread|\[Illustra|End of (the )?Project/i;
var MARKUP = /(^|[\s(«"])_[^_\s]|[^_\s]_([\s.,;:!?»")]|$)|\[\d+\]|\^\{|\{\}|<\/?[a-z]/;
var WORD = /[a-zà-öø-ÿ]+(?:-[a-zà-öø-ÿ]+)*/g;
var KINDS = ["cuentos", "novela corta", "novela"];

pack.LANGS.forEach(function (code) {
  console.log("— " + code);
  var dir = path.join(pack.langDir(code), "biblioteca");
  ok(fs.existsSync(path.join(dir, "index.json")), code + ": hay biblioteca/index.json");
  if (!fs.existsSync(path.join(dir, "index.json"))) return;
  var index = JSON.parse(fs.readFileSync(path.join(dir, "index.json"), "utf8"));
  var ctx = pack(code), B = ctx.Biblioteca;
  ok(!!B, code + ": window.Biblioteca existe");
  ok(!!ctx.BIBLIO_DATA && (ctx.BIBLIO_DATA.stems || []).length > 5, code + ": BIBLIO_DATA con las reglas del idioma");
  if (!B) return;
  B.setData({ index: index });

  /* ------------------------------------------------------------ índice */
  var books = index.books || [];
  ok(books.length >= 6 && books.length <= 10, code + ": de 6 a 10 obras (" + books.length + ")");
  var total = 0, lastKind = 0, size = 0, ids = {};
  books.forEach(function (bk) {
    var tag = code + "/" + bk.id;
    ok(!ids[bk.id], tag + ": id único"); ids[bk.id] = 1;
    ok(bk.title && bk.author && bk.year > 1800 && bk.year < 1956, tag + ": título, autor y año");
    ok(bk.died && bk.died < new Date().getFullYear() - 70, tag + ": autor muerto hace más de 70 años (dominio público)");
    ok(/Project Gutenberg/.test(bk.credit || "") && /dominio público/.test(bk.credit || ""), tag + ": crédito de Project Gutenberg y dominio público");
    ok(KINDS.indexOf(bk.kind) >= 0, tag + ": tipo conocido");
    ok(KINDS.indexOf(bk.kind) >= lastKind, tag + ": los cuentos van antes que las novelas");
    lastKind = Math.max(lastKind, KINDS.indexOf(bk.kind));
    ok(/^(A2|B1|B2|C1|C1\+)$/.test(bk.level || ""), tag + ": nivel estimado (" + bk.level + ")");
    var covOk = function (cov) {
      return Array.isArray(cov) && cov.length === 52 && cov.every(function (x, i) { return x >= 0 && x <= 1000 && (!i || x >= cov[i - 1]); });
    };
    ok(covOk(bk.cov), tag + ": cobertura del libro por semana (52, sin bajar)");
    ok(B.covAt(bk, 52) > 85 && B.covAt(bk, 1) < B.covAt(bk, 52), tag + ": la cobertura crece con las semanas y es verosímil");
    ok((bk.chapters || []).length >= 5, tag + ": al menos 5 capítulos o cuentos");
    ok((bk.chapters || []).every(function (c) { return c.t && c.w > 30 && covOk(c.cov); }), tag + ": cada capítulo con título, palabras y cobertura");
    var sum = bk.chapters.reduce(function (a, c) { return a + c.w; }, 0);
    ok(sum === bk.words, tag + ": las palabras del libro son las de sus capítulos");
    total += bk.words;

    /* ---------------------------------------------------------- el libro */
    var file = path.join(dir, bk.id + ".json");
    ok(fs.existsSync(file), tag + ": existe " + bk.id + ".json");
    if (!fs.existsSync(file)) return;
    var book = JSON.parse(fs.readFileSync(file, "utf8"));
    ok(book.id === bk.id && book.chapters.length === bk.chapters.length, tag + ": el libro coincide con su ficha");
    ok(book.wk && typeof book.wk === "object" && Object.keys(book.wk).length > 100, tag + ": trae la semana de sus palabras difíciles (wk)");
    var bad = [], markup = [], old = {}, empty = 0;
    book.chapters.forEach(function (ch, i) {
      if (!ch.p || !ch.p.length || B.chapterWords(ch) < 30) empty++;
      ok(B.chapterWords(ch) === bk.chapters[i].w, tag + " cap. " + (i + 1) + ": las palabras coinciden con el índice");
      [ch.t].concat(ch.p).forEach(function (p) {
        if (LICENSE.test(p)) bad.push(p.slice(0, 80));
        if (MARKUP.test(p)) markup.push(p.slice(0, 80));
        if (code === "pt") (p.toLowerCase().match(WORD) || []).forEach(function (w) { if (OLD[w]) old[w] = (old[w] || 0) + 1; });
      });
    });
    ok(!empty, tag + ": ningún capítulo vacío (" + empty + ")");
    ok(!bad.length, tag + ": sin restos de la licencia de Gutenberg: " + bad.slice(0, 2).join(" | "));
    ok(markup.length <= 2, tag + ": sin marcas de edición (" + markup.length + "): " + markup.slice(0, 2).join(" | "));
    if (code === "pt") ok(!Object.keys(old).length, tag + ": ortografía modernizada, sin grafías antiguas: " + JSON.stringify(old));
    size += fs.statSync(file).size;
    B.setData({ books: (function () { var o = {}; o[bk.id] = book; return o; })() });
  });
  size += fs.statSync(path.join(dir, "index.json")).size;
  ok(total >= 250000, code + ": cientos de miles de palabras para leer (" + total + ")");
  ok(size <= 15 * 1048576, code + ": la biblioteca pesa ≤ 15 MB (" + (size / 1048576).toFixed(1) + " MB)");
  ok(fs.readdirSync(dir).every(function (f) { return f === "index.json" || ids[f.replace(/\.json$/, "")]; }), code + ": ningún libro fuera del índice");
  console.log("  " + books.length + " obras, " + total + " palabras, " + (size / 1048576).toFixed(1) + " MB");

  /* ---------------------------------------------------------- el lector */
  var freq = pack.data(code, "frequenza.json"), gloss = pack.data(code, "glossario.json");
  B.setData({ freq: freq, gloss: gloss });
  var first = books[0], book0 = JSON.parse(fs.readFileSync(path.join(dir, first.id + ".json"), "utf8"));

  // pages: no word lost, comfortable size
  var ch0 = book0.chapters[0], pgs = B.pages(ch0.p);
  var pw = pgs.map(function (pg) { return pg.reduce(function (a, p) { return a + (B.isHeading(p) ? 0 : B.wordCount(p)); }, 0); });
  ok(pw.reduce(function (a, b) { return a + b; }, 0) === B.chapterWords(ch0), code + ": las páginas no pierden palabras");
  ok(pw.every(function (n) { return n <= B.PAGE_WORDS * 1.6; }), code + ": páginas cómodas (≤ " + Math.round(B.PAGE_WORDS * 1.6) + " palabras): " + Math.max.apply(null, pw));
  ok(pgs.every(function (pg) { return !B.isHeading(pg[pg.length - 1]) || pg.length === 1; }), code + ": un subtítulo no queda solo al pie de una página");

  // the model: coverage computed, a known text is well covered
  var model = new B.Model({ lemmi: freq.lemmi, gloss: gloss, stop: ctx.FREQ_DATA.STOP, lemma: (ctx.Freq.load(freq), ctx.Freq.lemma),
    tokens: ctx.Freq.tokens, transparent: ctx.Desglose.transparent, cognates: ctx.BIBLIO_DATA.cognates, stems: ctx.BIBLIO_DATA.stems });
  var cov = B.coverageOf(model.histogram(ch0.p));
  ok(cov.length === 52 && cov[51] >= cov[0] && cov[51] > 800, code + ": la cobertura se calcula en node (" + cov[51] / 10 + " % en la semana 52)");
  var sample = { it: ["tutti", "domandò", "casa"], pt: ["casinhas", "falou", "cidades"] }[code];
  sample.forEach(function (w) { ok(model.week(w) <= 52, code + ": «" + w + "» llega a su lema (semana " + model.week(w) + ")"); });

  // state: pages read, minutes, xp capped, fast pages do not count
  var state = { cards: {}, unlocked: 20 };
  var now = new Date(2026, 8, 25, 10);
  var fast = B.notePage(state, { book: first.id, ch: 0, pg: 0, words: 170, sec: 5, now: now });
  ok(!fast.counted && fast.why === "fast", code + ": una página pasada de largo no cuenta");
  var slow = B.notePage(state, { book: first.id, ch: 0, pg: 0, words: 170, sec: 60, now: now });
  ok(slow.counted && slow.xp > 0 && state.biblio.total.w === 170, code + ": una página leída suma palabras y xp");
  var again = B.notePage(state, { book: first.id, ch: 0, pg: 0, words: 170, sec: 60, now: now });
  ok(!again.counted, code + ": la misma página no cuenta dos veces");
  var xp = slow.xp;
  for (var i = 1; i < 60; i++) xp += B.notePage(state, { book: first.id, ch: 1, pg: i, words: 150, sec: 45, now: now }).xp;
  ok(xp <= 40, code + ": la xp de lectura por día tiene tope (" + xp + ")");
  var idle = B.notePage(state, { book: first.id, ch: 2, pg: 0, words: 100, sec: 7200, now: now });
  ok(idle.sec <= 900, code + ": el tiempo sin tocar nada no cuenta entero");
  var today = B.statsDays(state, 1, now);
  ok(today.w === state.biblio.total.w && today.s > 0 && today.pg > 0, code + ": palabras, minutos y páginas de hoy");

  // self-assessment moves the reading week; recommendation
  var w0 = B.readingWeek(state);
  B.selfAssess(state, first.id, 0, 1);
  ok(B.readingWeek(state) < w0 && B.isRead(state, first.id, 0), code + ": «Poco» baja el nivel y marca el capítulo leído");
  B.selfAssess(state, first.id, 0, 3);
  ok(B.readingWeek(state) > w0, code + ": cambiar a «casi todo» lo sube");
  // a chapter opened from the mission of an earlier week counts for that week
  var sw = { cards: {}, unlocked: 20 }, vw = {};
  B.openChapter(vw, first.id, 3, 18);
  B.markRead(sw, first.id, 3);
  B.openChapter(vw, first.id, 4);
  B.markRead(sw, first.id, 4);
  ok(sw.biblio.wk[18] === 1 && sw.biblio.wk[20] === 1, code + ": el capítulo cuenta para la semana de la misión que lo abrió: " + JSON.stringify(sw.biblio.wk));
  var s52 = { cards: {}, unlocked: 52 };
  var rec = B.recommend(index, s52);
  ok(rec && rec.book && rec.ch >= 0 && rec.cov > 0, code + ": recomienda un texto");
  var anyOk = books.some(function (bk) { return bk.chapters.some(function (c) { return B.covAt(c, 52) >= B.TARGET; }); });
  ok(!anyOk || rec.ok, code + ": con algo ≥ 95 % para la semana, lo recomendado llega al 95 %");
  var s1 = { cards: {}, unlocked: 1 }, rec1 = B.recommend(index, s1);
  ok(rec1 && !rec1.ok, code + ": en la semana 1 no hay nada al 95 % y lo dice");

  // 📌 al repaso
  var st2 = { cards: {}, unlocked: 10 };
  var id = B.pin(st2, { w: "zzqx", lemma: "zzqx", es: "cosa rara", ctx: "una frase con zzqx.", book: first.id }, { Engine: ctx.Engine });
  ok(id === "lib:zzqx" && st2.cards[id] && st2.cards[id].due, code + ": 📌 una palabra fuera del curso crea su tarjeta lib:");
  B.pin(st2, { w: "yyqx", lemma: "yyqx", es: "otra cosa", ctx: "", book: first.id }, { Engine: ctx.Engine });
  B.pin(st2, { w: "wwqx", lemma: "wwqx", es: "una tercera", ctx: "", book: first.id }, { Engine: ctx.Engine });
  var it = B.reviewItem("lib:zzqx", st2, rng(3));
  ok(it && it.answer === "cosa rara" && it.options && it.options.indexOf("cosa rara") >= 0, code + ": la tarjeta lib: da un ejercicio con su significado");
  var course = pack.data(code, "course.json");
  Object.keys(st2.cards).forEach(function (k) { st2.cards[k].due = 1; });
  var rev = ctx.Drills.buildReview(course, st2, 20, {});
  ok(rev.some(function (x) { return x.id === "lib:zzqx"; }), code + ": la tarjeta lib: entra en el repaso (drills.js)");
  var w1 = Object.keys(gloss).filter(function (k) { return k.indexOf(" ") < 0; })[0];
  ok(B.pin({ cards: {}, unlocked: 1 }, { w: "", lemma: "" }) === null, code + ": sin palabra no hay tarjeta");
  ok(!!w1, code + ": el glosario tiene palabras");

  // screens without DOM
  var view = { screen: "biblioteca", tab: "leggi" };
  var h1 = B.render("biblioteca", view);
  ok(/bx-book/.test(h1) && h1.indexOf(first.title.replace(/[&<>"']/g, "")) >= 0 || /bx-book/.test(h1), code + ": la pantalla de la Biblioteca se dibuja");
  view.bxBook = first.id;
  var h2 = B.render("libro", view);
  ok(/data-bxread/.test(h2) && /Project Gutenberg/.test(h2), code + ": la ficha del libro con sus capítulos y el crédito");
  view.bxCh = 0;
  var h3 = B.render("lector", view);
  ok(/class="w/.test(h3) && /bx-next|bx-end/.test(h3) && /entendés/.test(h3), code + ": el lector dibuja la página con palabras tocables");
  ensureUnder(B, h3, code);
  var lk = B.lookup(sample[0]);
  ok(lk.w && lk.lemma, code + ": tocar «" + sample[0] + "» da su lema (" + lk.lemma + ")");
  ok(typeof B.leggiCard() === "string" && /bx-open/.test(B.ioCard()), code + ": las tarjetas de Leggi/Ler y del perfil");
});

// The underline is on by default and can be switched off.
function ensureUnder(B, html, code) {
  var st = B.ensure({ cards: {}, unlocked: 1 });
  ok(st.under === true, code + ": el subrayado de palabras difíciles viene prendido");
}

/* ------------------------------------------------ la ortografía (muestra) */
console.log("— ortografía pt (muestra, sin la lista de palabras)");
var m = Orto.modernizer();
[["Ella sahiu da pharmacia.", "Ela saiu da farmácia."], ["Ha muitos annos.", "Há muitos anos."],
 ["Aquelle estylo é bello.", "Aquele estilo é belo."], ["Quiz ouvil-o hontem.", "Quis ouvi-lo ontem."],
 ["O theatro e a sciencia.", "O teatro e a ciência."]].forEach(function (x) {
  var got = m.text(x[0]);
  ok(got === x[1], "«" + x[0] + "» → «" + x[1] + "» (dio «" + got + "»)");
});
ok(m.text("_Eppur si muove_") === "_Eppur si muove_", "una cita extranjera en cursiva no se toca");
ok(m.text("Capítulo VII") === "Capítulo VII", "los números romanos no se tocan");

console.log(checks + " comprobaciones, " + fails + " errores");
process.exit(fails ? 1 : 0);
