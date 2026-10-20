/* Sons, dictogloss, voces y capa de frecuencia: datos íntegros, sesiones que
   se arman, puntuación del dictogloss, voces de Lingua Libre (portugués),
   Common Voice vacío pero funcional, cobertura y verificador léxico.
   Run: node tools/pt/test_suoni.js  */
var fs = require("fs"), path = require("path");
var pack = require("../lib/pack.js");
var ctx = pack("pt");
var Engine = ctx.Engine;
var Banca = ctx.Banca;
var bankFile = pack.dataPath("pt", "bank.json");
if (fs.existsSync(bankFile)) Banca.load(JSON.parse(fs.readFileSync(bankFile, "utf8")));
var A = ctx.AscoltoData;
var Dg = ctx.DictoglossData;
var S = ctx.Suoni;
var V = ctx.Voci;
var CV = ctx.VociCV;
var T = require("../lib/testkit.js")("pt"), ok = T.ok;
function optional(name, fn) {
  try { fn(); } catch (e) { console.log("aviso: " + name + " sin probar (" + e.message + ")"); }
}

/* ---------------------------------------------------------- escucha */
var ids = {};
[].concat(A.PAIRS, A.CONNESSO, A.INTONAZIONE, A.ACCENTO).forEach(function (x) {
  ok(!ids[x.id], "id repetido: " + x.id); ids[x.id] = 1;
  ok(x.week >= 1 && x.week <= 52, "semana fuera de rango: " + x.id);
  if (x.options) ok(x.options.indexOf(x.answer) >= 0 && new Set(x.options).size === x.options.length, "opciones: " + x.id);
});
ok(A.PAIRS.length >= 170, "al menos 170 pares: " + A.PAIRS.length);
var pairKeys = {};
A.PAIRS.forEach(function (p) {
  ok(p.a !== p.b && p.es && p.es.length === 2 && p.es[0] && p.es[1] && p.cat && p.note, "par incompleto: " + p.id);
  ok(S.CAT_ES[p.cat], "categoría sin nombre: " + p.id + " / " + p.cat);
  ok(!p.written, "los pares se escriben distinto, sin «written»: " + p.id);
  ok(p.week <= 40, "los pares llegan hasta la semana 40: " + p.id);
  var k = [p.a, p.b].sort().join("|");
  ok(!pairKeys[k], "par repetido: " + p.id + " " + k); pairKeys[k] = 1;
  ok(V.usable(p.a) && V.usable(p.b), "palabras sueltas, buscables en Lingua Libre: " + p.id);
});
var cats = {};
A.PAIRS.forEach(function (p) { cats[p.cat] = (cats[p.cat] || 0) + 1; });
ok(Object.keys(S.CAT_ES).every(function (c) { return cats[c] >= 8; }) && cats.vogais >= 15 && cats.nasais >= 20 && cats.tonica >= 20,
   "categorías cubiertas: " + JSON.stringify(cats));
var weeks = {};
A.PAIRS.forEach(function (p) { weeks[p.week] = 1; });
ok(Object.keys(weeks).length >= 30, "pares repartidos en al menos 30 semanas: " + Object.keys(weeks).length);
for (var w = 1; w <= 40; w++) ok(A.PAIRS.filter(function (p) { return p.week <= w; }).length >= 3 * Math.min(w, 10), "pares disponibles en la semana " + w);
ok(A.CONNESSO.length >= 40, "al menos 40 de habla conectada: " + A.CONNESSO.length);
ok(A.CONNESSO.every(function (c) { return c.kind === "conta" || c.kind === "scegli"; }), "habla conectada: conta o scegli");
ok(A.CONNESSO.filter(function (c) { return c.kind === "conta"; }).every(function (c) {
  return /^\d+$/.test(c.answer) && c.say.replace(/[.,!?]/g, "").split(/\s+/).length === +c.answer;
}), "conta: la respuesta es el número de palabras escritas");
ok(A.CONNESSO.filter(function (c) { return c.kind === "scegli" && c.say !== c.answer; }).length >= 10, "formas reducidas (tá, cê, pra, tô)");
ok(A.INTONAZIONE.length >= 80, "al menos 40 pares de entonación: " + A.INTONAZIONE.length / 2);
ok(A.INTONAZIONE.every(function (x) { return (x.answer === "pregunta") === /\?$/.test(x.say); }), "entonación: el signo de pregunta decide");
ok(A.ACCENTO.length >= 30, "al menos 30 de acento tónico: " + A.ACCENTO.length);
A.ACCENTO.forEach(function (x) {
  ok(x.options.every(function (o) { return /^[^·]+(·[^·]+)*$/.test(o) && o !== o.toLowerCase(); }), "acento: sílabas con la tónica en mayúsculas: " + x.id);
  // las sílabas de la respuesta, juntas, son la palabra que se dice
  ok(x.answer.replace(/·/g, "").toLowerCase() === x.say.toLowerCase(), "acento: la respuesta es la palabra dicha: " + x.id);
});

/* ---------------------------------------------------------- sesión */
var st = Engine.blankSave(); st.unlocked = 12;
var ses = S.session(st, 12, {});
ok(ses.length >= 10 && ses.length <= 14, "sesión de Sons: " + ses.length);
ok(ses.filter(function (x) { return x.type === "coppia"; }).length === 6, "seis pares");
ok(ses.every(function (x) { return x.id && x.src === "ascolto" && x.answer && x.voice; }), "ítems completos");
ok(ses.every(function (x) { return x.options == null || x.options.indexOf(x.answer) >= 0; }), "la respuesta está entre las opciones");
var byCat = {};
ses.filter(function (x) { return x.type === "coppia"; }).forEach(function (x) { byCat[x.cat] = (byCat[x.cat] || 0) + 1; });
ok(Object.keys(byCat).every(function (c) { return byCat[c] <= 3; }), "como mucho tres pares de la misma categoría");
var hasFragments = S.fragments(12, st).length > 0;
if (hasFragments) ok(ses.some(function (x) { return x.type === "dictation" && x.dettato; }), "un dictado");
else console.log("aviso: sin oraciones para el dictado (banca y frases vacías o sin portar)");
ok(S.session(st, 12, { silent: true }).every(function (x) { return x.type !== "dictation"; }), "en la oficina, sin dictado");
// las vencidas primero
st.cards["suoni:" + A.PAIRS[0].id] = { s: 1, d: 5, due: Date.now() - 1000, last: Date.now() - 86400000, reps: 1 };
var ses2 = S.session(st, 12, {});
ok(ses2.some(function (x) { return x.id === "suoni:" + A.PAIRS[0].id; }), "el par vencido vuelve");
ok(S.randomItem(st, 3) && S.randomItem(st, 3).src === "ascolto", "ítem para la pausa");
var sp = S.progress(12, st.cards);
ok(sp.total > 30 && sp.seen === 1, "progreso: " + JSON.stringify(sp));
// el ítem de un par dice una de las dos y la respuesta es esa
A.PAIRS.forEach(function (p, k) {
  var pi = S.pairItem(p, k);
  var idx = pi.say === pi.pair.a ? 0 : 1;
  ok(pi.options[idx] === pi.answer && pi.answer === pi.say, "la respuesta es la palabra dicha: " + pi.id);
});
// habla conectada: consigna según el tipo
var seenRed = false, seenTr = false, seenConta = false;
for (var r = 0; r < 200 && !(seenRed && seenTr && seenConta); r++) {
  S.session(Engine.blankSave(), 40, { silent: true }).forEach(function (x) {
    if (x.type === "conta") seenConta = seenConta || /cuántas palabras/i.test(x.prompt);
    if (x.type === "scegli" && x.say !== x.answer) seenRed = seenRed || /forma completa/.test(x.prompt);
    if (x.type === "scegli" && x.say === x.answer) seenTr = seenTr || /transcripción/.test(x.prompt);
  });
}
ok(seenRed && seenTr && seenConta, "consignas de habla conectada: contar, transcribir, forma completa");
ok(S.voiceOf(0).rate && S.voiceOf(4).pitch, "voz con velocidad y tono");

/* ------------------------------------------------ voces de Lingua Libre */
ok(V.usable("avô") && V.usable("caça") && V.usable("pão") && !V.usable("pra casa") && !V.usable("pau-brasil"), "palabras buscables");
var t = V.parseTitle("File:LL-Q5146 (por)-Ederporto-avô.wav");
ok(t && t.user === "Ederporto" && t.word === "avô", "título de Lingua Libre portugués: " + JSON.stringify(t));
ok(!V.parseTitle("File:LL-Q652 (ita)-Qualcuno-nonno.wav"), "no toma grabaciones italianas");
ok(/LL-Q5146%20\(por\)|LL-Q5146 \(por\)/.test(decodeURIComponent(V.searchUrl("avô"))), "busca en portugués");
var json = { query: { pages: {
  1: { title: "File:LL-Q5146 (por)-Alguém-avó.wav", imageinfo: [{ url: "https://x/avo1.wav" }] },
  2: { title: "File:LL-Q5146 (por)-Alguém-avô.wav", imageinfo: [{ url: "https://x/avo2.wav" }] },
  3: { title: "File:LL-Q5146 (por)-Ederporto-avô.wav", imageinfo: [{ url: "https://x/avo3.wav" }] },
  4: { title: "File:LL-Q5146 (por)-Ederporto-avô.ogg", imageinfo: [{ url: "https://x/avo4.ogg" }] }
} } };
var got = V.fromApi("avô", json);
ok(got.length === 2 && got.every(function (r) { return /avo[34]|avo2/.test(r.url); }) && got[0].user === "Ederporto",
   "solo la palabra exacta (avô, no avó), un archivo por hablante, Brasil primero: " + JSON.stringify(got));
ok(V.fromApi("avô".normalize("NFD"), json).length === 2, "tildes en NFD o NFC dan igual");

/* ---------------------------------------------- Common Voice (vacío) */
ok(Array.isArray(CV.ALL) && CV.LICENSE && typeof CV.url === "function", "API de Common Voice");
ok(CV.ALL.length === 0, "todavía sin grabaciones de Common Voice en portugués");
ok(S.formPool(30).length === 0 && S.realFragments(30).length === 0, "sin grabaciones no hay «¿Qué forma?» ni dictado grabado");
var st30 = Engine.blankSave(); st30.unlocked = 30;
var ses30 = S.session(st30, 30, {});
ok(ses30.length >= 9 && ses30.every(function (x) { return x.type !== "forma"; }), "la sesión anda con la lista vacía");
// si se suman grabaciones, el esquema tiene que servir
var fake = { f: "123", w: 5, pt: "Eu fui à praia ontem.", a: "fui", b: "ia", fw: 15, why: "Un hecho cerrado: perfeito." };
CV.ALL.push(fake);
var fi = S.formItem(fake, 0);
ok(fi.stem.indexOf("___") >= 0 && fi.stem.indexOf("fui") < 0 && fi.options.indexOf("fui") >= 0 && fi.audio === CV.url(fake) &&
   /common_voice_pt_123\.mp3$/.test(fi.audio), "ítem «¿Qué forma?» con el campo pt");
ok(S.formPool(15).length === 1 && S.formPool(10).length === 0 && S.realFragments(5)[0].text === fake.pt, "las formas se abren con su semana");
CV.ALL.length = 0;

/* --------------------------------------------------------- dictogloss */
ok(Dg.TESTI.length === 47, "47 textos de dictogloss: " + Dg.TESTI.length);
var dgWeeks = Dg.TESTI.map(function (x) { return x.week; });
var expected = [];
for (var ww = 2; ww <= 51; ww++) if ([13, 26, 39].indexOf(ww) < 0) expected.push(ww);
ok(JSON.stringify(dgWeeks) === JSON.stringify(expected), "semanas 2-51 salvo los jefes, en orden");
Dg.TESTI.forEach(function (t) {
  var n = t.text.split(/\s+/).filter(function (x) { return /\w/.test(x); }).length;
  ok(n >= 50 && n <= 110, "entre 50 y 110 palabras: semana " + t.week + " (" + n + ")");
  ok(t.title && t.es && t.level && t.keywords.length >= 6, "título, resumen, nivel y palabras clave: " + t.week);
  ok(t.chunks.length === 6 && new Set(t.chunks).size === 6, "seis bloques: semana " + t.week);
  t.chunks.forEach(function (c) {
    ok(S.chunkFound(c, t.text), "bloque en el texto: " + t.week + " / " + c);
  });
  t.keywords.forEach(function (k) {
    ok(S.norm(t.text).indexOf(S.norm(k)) >= 0, "palabra clave en el texto: " + t.week + " / " + k);
  });
  ok(S.dgScore(t, t.text).pct === 100, "el texto entero recupera todo: " + t.week);
  ok(S.dgScore(t, "olá").found.length === 0, "nada no recupera nada: " + t.week);
  ok(!/\b(idéia|vôo|lingüiça|pára|pêlo|heróico|assembléia|européia|jóia)\b/i.test(t.text), "ortografía del Acuerdo de 1990: " + t.week);
});
ok(S.dgFor(13) === null && S.dgFor(26) === null && S.dgFor(39) === null && S.dgFor(11), "semanas de jefe sin texto");
ok(S.chunkFound("a gente se vê amanhã", "a gente se vê logo amanhã") && S.chunkMatch("a gente se vê amanhã", "amanhã a gente se vê") === "variant" && !S.chunkFound("a gente se vê amanhã", "olá, tudo bem"), "orden y ventana: en otro orden cuenta, con el bloque original a la vista");
ok(S.chunkFound("caça", "caca") && S.chunkFound("pau-brasil", "pau brasil") && S.chunkFound("não sei, não", "Não sei não"), "sin tildes, ç, guiones ni comas");
ok(S.chunkFound("tinha percebido", "tinha percebdo"), "un error de tipeo perdonado en palabras largas");

/* ------------------------------------------------ frecuencia (opcional) */
optional("frequenza", function () {
  var F = ctx.Freq;
  F.load(pack.data("pt", "frequenza.json"));
  if (!F.info("você")) throw new Error("frequenza.json todavía no es portugués");
  ok(F.level("casa") === "A1" && F.zipf("casa") > 5, "casa: A1 y frecuente");
  ok(F.lemma("casas") === "casa", "formas → lema");
  var s2 = Engine.blankSave();
  s2.cards["v:casa"] = { ok: 2 }; s2.cards["b:voc:livro"] = { ok: 1 };
  var kn = F.knownLemmas(s2);
  ok(kn.casa && kn.livro, "lemas conocidos");
  for (var q = 0; q < 30; q++) { var ps = F.pseudo("janela"); ok(ps && ps !== "janela" && !F.info(ps), "pseudopalabra: " + ps); }
});

T.done("");
