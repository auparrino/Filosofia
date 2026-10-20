/* Las capas (docs/js/capas.js) y lo que las alimenta, en los dos idiomas:
 *
 * - las misiones opcionales del percorso: «Leé un capítulo» (Biblioteca)
 *   desde la semana en que abre el primer libro, con el capítulo que
 *   recomienda la cobertura, y «Tres vueltas» las semanas de Scrivi; nunca
 *   bloquean la semana (opt);
 * - el plegado por estación, con la actual abierta; los minutos de input;
 * - la relectura cronometrada (Letture.speed*): cuenta con 70 % o más;
 * - el diccionario de «Consultar» (Referencia.lookup / suggest) y Mi
 *   gramática sin tope de semana;
 * - la escritura guiada sobre textos largos: la lectura larga y la escucha
 *   transcripta como fuentes, por pasajes, con la dificultad de la semana;
 * - el núcleo no nombra ningún idioma.
 *
 *   node tools/lib/test_capas.js */
"use strict";
var fs = require("fs"), path = require("path");
var pack = require("./pack.js");
var Boot = require(path.join(pack.DOCS, "js", "boot.js"));

var fails = 0, checks = 0;
function ok(cond, msg) { checks++; if (!cond) { fails++; console.log("  ✗ " + msg); } }

var SRC = fs.readFileSync(path.join(pack.DOCS, "js", "capas.js"), "utf8");
ok(!/italian|portugu|brasil|\bLa Via\b|Rumo C1/i.test(SRC.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "")), "capas.js no nombra ningún idioma");
ok(Boot.ORDER.some(function (e) { return e.core === "capas.js"; }), "capas.js está en ORDER de boot.js");
ok(Boot.coreFiles().indexOf("js/capas.js") >= 0, "el service worker guarda capas.js");
var APP = fs.readFileSync(path.join(pack.DOCS, "js", "app.js"), "utf8");
ok(/Capas\.missions\(w, state\)\.forEach\(m\)/.test(APP), "weekPlan llama a Capas.missions");
ok(/Capas\.handles\(kind\)\) Capas\.go\(kind, arg\)/.test(APP), "goMission lleva las misiones de las capas");

pack.LANGS.forEach(function (code) {
  console.log("— " + code);
  var tag = code + ": ";
  var ctx = pack(code), C = ctx.Capas, B = ctx.Biblioteca, L = ctx.Letture, R = ctx.Referencia, E = ctx.Escritos;
  ok(!!C && !!B && !!L && !!R && !!E, tag + "módulos cargados");
  var course = pack.data(code, "course.json"), bank = pack.data(code, "bank.json"), gloss = pack.data(code, "glossario.json");
  ctx.Banca.load(bank);
  ctx.Freq.load(pack.data(code, "frequenza.json"));
  R.setData({ course: course, bank: bank, gloss: gloss });

  /* ------------------------------------------------ las misiones */
  var index = JSON.parse(fs.readFileSync(path.join(pack.DOCS, "lang", code, "biblioteca", "index.json"), "utf8"));
  ok(C.missions({ week: 20 }, { unlocked: 20, cards: {} }).every(function (m) { return m.kind !== "lib"; }), tag + "sin el índice, no hay misión de la Biblioteca");
  B.setData({ index: index });
  var first = B.firstOpenWeek(index);
  ok(first >= 5 && first <= 26, tag + "el primer libro abre en la semana " + first);
  index.books.forEach(function (bk) {
    var w = B.openWeek(bk);
    ok(w >= 1 && w <= 52, tag + bk.id + " abre en una semana del curso (" + w + ")");
  });
  var libWeeks = 0;
  course.weeks.forEach(function (w) {
    var st = { unlocked: w.week, cards: {} };
    var ms = C.missions(w, st), lib = ms.filter(function (m) { return m.kind === "lib"; })[0];
    ms.forEach(function (m) { ok(m.opt === true && C.handles(m.kind), tag + "misión " + m.kind + " de la semana " + w.week + " opcional y con destino"); });
    if (w.boss) ok(!ms.length, tag + "la semana del jefe no suma misiones de las capas");
    else if (w.week < first) ok(!lib, tag + "semana " + w.week + ": la Biblioteca todavía no");
    else {
      ok(!!lib, tag + "semana " + w.week + ": «Leé un capítulo»");
      if (lib) {
        libWeeks++;
        var a = lib.arg.split("|"), bk = index.books.filter(function (b) { return b.id === a[0]; })[0];
        ok(bk && bk.chapters[+a[1]], tag + "semana " + w.week + ": el capítulo recomendado existe");
        ok(bk && B.openWeek(bk) <= w.week, tag + "semana " + w.week + ": recomienda un libro ya abierto");
      }
    }
    ok(!ms.some(function (m) { return m.kind === "tre"; }), tag + "semana " + w.week + ": «Tres vueltas» ya no es misión");
  });
  ok(libWeeks >= 20, tag + "la Biblioteca está en " + libWeeks + " semanas del percorso");
  // leer un capítulo en esa semana la cumple
  var sw = { unlocked: first + 2, cards: {} };
  B.markRead(sw, index.books[0].id, 0);
  var lm = C.missions({ week: first + 2 }, sw).filter(function (m) { return m.kind === "lib"; })[0];
  ok(lm && lm.done, tag + "un capítulo leído en la semana cumple la misión");
  B.markRead(sw, index.books[0].id, 0);
  ok(sw.biblio.wk[first + 2] === 1, tag + "releer el mismo capítulo no cuenta dos veces");
  /* ------------------------------------------------ el plegado */
  var items = [];
  for (var wk = 1; wk <= 52; wk += 3) items.push({ week: wk, done: wk < 10, html: "<b>" + wk + "</b>" });
  var h = C.seasons("t", items, 30, ["A", "B", "C", "D"]);
  ok((h.match(/<details/g) || []).length === 4, tag + "cuatro estaciones");
  ok(/data-capa="t:3" open/.test(h) && !/data-capa="t:1" open/.test(h), tag + "la estación actual abierta, las otras plegadas");
  ok(/desde la semana 40/.test(h), tag + "la que viene dice desde qué semana");
  var f = C.fold("k", "Título", "3 / 5", "<p>x</p>", false);
  ok(/<details class="capa" data-capa="k">/.test(f) && /3 \/ 5/.test(f), tag + "una sección plegada con su dato");

  /* ------------------------------------------------ la velocidad */
  var ep = L.EPISODI.filter(function (e) { return e.series === "settimana"; })[10];
  var s = { cards: {} }, words = L.wordsOf(ep);
  ok(words > 30, tag + "la lectura tiene " + words + " palabras");
  L.speedNote(s, ep, 60000, { week: 11 });
  var r1 = L.speedCommit(s, ep.id, 60, Date.now());
  ok(!r1.counted && r1.why === "comp", tag + "con 60 % de comprensión, no cuenta");
  L.speedNote(s, ep, 60000, { week: 11 });
  var r2 = L.speedCommit(s, ep.id, 80, Date.now());
  ok(r2.counted && r2.wpm === words, tag + "con 80 %: " + r2.wpm + " palabras por minuto");
  L.speedNote(s, ep, 30000, { week: 12 });
  var r3 = L.speedCommit(s, ep.id, 100, Date.now());
  ok(r3.counted && r3.re && r3.prev === words && s.lectura.best[ep.id] === r3.wpm, tag + "releer más rápido mejora el récord");
  L.speedNote(s, ep, 2000, { week: 12 });
  ok(L.speedCommit(s, ep.id, 100).why === "fast", tag + "demasiado rápido no es lectura");
  L.speedNote(s, ep, 60000, { week: 12, kar: true });
  ok(L.speedCommit(s, ep.id, 100).why === "audio", tag + "con el karaoke fue escucha");
  ok(L.speedCommit(s, ep.id, 100).why === "none", tag + "sin «Terminé», nada que contar");
  var curve = L.speedCurve(s);
  ok(curve.length === 1 && curve[0].w === 11, tag + "la curva toma la primera lectura, no la relectura");
  ok(L.speedMinutes(s, 7) === 2, tag + "minutos de lectura cronometrada en 7 días");
  ok(/<svg class="speed-curve"/.test(C.curveSvg(curve)), tag + "la curva se dibuja");
  var inp = C.inputWeek({ ascolto: {}, lectura: s.lectura, biblio: null, cards: {} });
  ok(inp.read === 2 && inp.listen === 0, tag + "input semanal: lectura y escucha");

  /* ------------------------------------------------ Consultar */
  var word = code === "it" ? ["fame", "avere fame"] : ["gostar", "gostar de"];
  var x = R.lookup(word[0], { week: 30 });
  ok(x.known && x.es && x.taught >= 1, tag + "el diccionario conoce «" + word[0] + "»: " + x.es);
  ok(x.hits.length >= 3 && x.hits.length <= 5, tag + "3-5 usos reales (" + x.hits.length + ")");
  ok(x.hits.every(function (h) { return h.w <= 30; }), tag + "los usos, de lo que ya se puede leer");
  ok(x.colloc.some(function (c) { return c.r.indexOf(word[1]) >= 0; }), tag + "combinaciones: «" + word[1] + "» (" + x.colloc.map(function (c) { return c.r; }).join(", ") + ")");
  ok(x.bank && x.level, tag + "ficha del banco y nivel");
  var verb = code === "it" ? "andato" : "fui";
  ok(R.lookup(verb, { week: 30 }).lines.length > 0, tag + "la forma verbal de «" + verb + "» (Desglose)");
  var sug = R.suggest(code === "it" ? "hambre" : "extrañar", 5);
  ok(sug.length > 0, tag + "la búsqueda en castellano encuentra la palabra: " + sug.map(function (y) { return y.lemma; }).join(", "));
  ok(R.suggest("ca", 8).length === 8, tag + "sugerencias por el principio");
  // Mi gramática sin tope: lo que viene también se consulta
  var all = R.blocks(), seen = R.grammar(10);
  ok(all.length > seen.length, tag + "Mi gramática tiene " + all.length + " bloques; hasta la semana 10, " + seen.length);
  var later = all.filter(function (b) { return b.week > 40; })[0];
  ok(later && R.blockIdOf(course.weeks[later.week - 1].lesson.blocks[later.i]) === later.id, tag + "el bloque se reconoce desde la lección");
  ok(R.lessonNote(later.week).indexOf('data-ref-gram="' + later.id + '"') >= 0, tag + "al cerrar la lección, el enlace a Mi gramática");
  ok(R.blockLink(course.weeks[later.week - 1].lesson.blocks[later.i]).indexOf('data-refblk="' + later.id + '"') >= 0, tag + "en la lección y en «¿Por qué?», el enlace al bloque");

  /* ------------------------------------------------ escritura guiada larga */
  var srcs = E.allSources();
  var larga = srcs.filter(function (y) { return y.kind === "larga"; }), escu = srcs.filter(function (y) { return y.kind === "escucha"; });
  ok(larga.length >= 20 && escu.length >= 20, tag + "fuentes largas: " + larga.length + " lecturas, " + escu.length + " escuchas");
  var st4 = { unlocked: 35, cards: {}, letture: {}, tramo: { asc: {} }, escritos: {} };
  ok(!E.sources(st4).some(function (y) { return y.kind === "escucha"; }), tag + "una escucha no hecha no es fuente");
  st4.letture["l-35"] = { pct: 80 }; st4.tramo.asc[35] = { pct: 90 };
  var ms4 = E.missions({ week: 35 }, st4);
  var or = ms4.filter(function (m) { return m.kind === "esc-ordenar"; })[0];
  ok(!ms4.some(function (m) { return m.kind === "esc-huecos"; }), tag + "el C-test ya no es misión de la semana");
  ok(or && !/^(as|ep|dg):[^|]*35\|/.test(or.arg) && E.byId(or.arg.split("|")[0]).week < 35, tag + "«Ordená» de la semana 35 no es el texto de esa semana (" + (or && or.arg) + ")");
  var lsrc = larga.filter(function (y) { return y.week === 45; })[0];
  var ps = E.passages(lsrc.text, E.passageWords(45));
  ok(ps.length >= 2 && ps.every(function (p) { return p.split(/\s+/).length <= 700; }), tag + "la lectura larga se trabaja por pasajes (" + ps.length + ")");
  ok(E.passage(lsrc, 45, 1).i === 1 && E.passage(lsrc, 45, ps.length).i === 0, tag + "«Otro pasaje» avanza y vuelve al principio");
  var CT = ctx.CTest, early = CT.build(ep.text, "ctest", CT.level(5).ctest), late = CT.build(E.passage(lsrc, 45, 0).text, "ctest", CT.level(45).ctest);
  ok(early.gaps.every(function (g) { return g.full.length >= 3; }), tag + "al principio no se cortan palabras de dos letras");
  ok(early.gaps.length <= 15 && late.gaps.length > 20, tag + "más huecos a medida que avanza: " + early.gaps.length + " → " + late.gaps.length);
  var clEarly = CT.build(ep.text, "cloze", CT.level(10).cloze);
  ok(clEarly.gaps.every(function (g) { return g.answer.length >= 2; }), tag + "el cloze temprano no pregunta la «e» ni la «a» sueltas");
  ok(ctx.Ordenar.level(5).maxPars < ctx.Ordenar.level(45).maxPars, tag + "más piezas para ordenar al final");
});

console.log((fails ? "✗ " : "✓ ") + (checks - fails) + "/" + checks + " chequeos de las capas");
process.exit(fails ? 1 : 0);
