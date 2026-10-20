/* Tramo C1 (js/tramo.js, lang/<código>/tramo_data.js): cada semana de la 27
   a la 51 (sin la 39) tiene lectura larga, escucha larga y tarea con los
   largos que suben semana a semana; los datos generados están al día con
   tools/<código>/tramo/; la revisión local acepta los modelos y rechaza el
   relleno, el texto copiado de la fuente y lo que no llega al mínimo.
   Desde v3: si el idioma trae fichas de género (tramo/fichas.json), cada
   género que se pide tiene la suya (4-6 pantallas, fórmulas, modelo
   anotado); si trae ADEQ, los modelos pasan los criterios de adequação
   (tratamiento, propósito, uso de la fuente, registro) y los textos que
   los violan no; los puntos de la consigna no son palabras genéricas.
   Desde v3.1 también el portugués trae la escucha corta de cada semana
   (breve: monólogo, tabla de datos y afirmaciones «diz / não diz»).
   Run: node tools/lib/test_tramo.js */
"use strict";
var fs = require("fs"), path = require("path");
var pack = require("./pack.js");
var LANG = null, bad = 0, checks = 0;
function err(f, m) { bad++; console.log("✗ " + f + ": " + m); }
function ok(cond, m) { checks++; if (!cond) err(LANG, m); }
const WEEKS = [27,28,29,30,31,32,33,34,35,36,37,38,40,41,42,43,44,45,46,47,48,49,50,51];
function idx(w) { return WEEKS.indexOf(w); }
function lerp(a, b, w) { return Math.round(a + (b - a) * idx(w) / (WEEKS.length - 1)); }
const TARGET = {
  read: (w) => lerp(350, 900, w),     // words of the long reading
  listen: (w) => lerp(250, 600, w),   // words of the listening script
  min: (w) => lerp(120, 250, w)       // minimum words of the task
};
const GENRES = {
  it: ["lettera_formale", "email_informale", "lettera_lettore", "articolo", "recensione", "saggio", "sintesi", "relazione"],
  pt: ["carta_formal", "email_informal", "carta_leitor", "artigo", "resenha", "texto_opiniao", "resumo", "relato",
       "carta_aberta", "post_blog", "texto_instrucional", "proposta"]
};
// Palabras que cualquier texto trae: un punto de la consigna que se cumple
// con ellas no mide nada (auditoría v3: «quando», «semana», «hoje»).
const GENERIC = { pt: ["quando", "semana", "hoje", "morava", "cheguei", "comigo", "aconteceu", "experiência", "no meu caso",
                       "portanto", "por isso", "assim", "enfim", "em suma", "oi", "querida", "olá", "beijo", "abraço",
                       "prezad", "atenciosamente", "cordialmente", "respeitosamente", "tecnologia", "leitura", "porém"] };
const VF = { it: ["vero", "falso", "non si dice"], pt: ["verdadeiro", "falso", "não se diz"] };
function words(s) { return String(s).split(/\s+/).filter((x) => /[A-Za-zÀ-ÿ]/.test(x)).length; }
function bare(t) { return t.toLowerCase().replace(/^[^a-zà-öø-ÿ]+/, "").replace(/[^a-zà-öø-ÿ']+$/, "").replace(/'$/, ""); }
function low0(s) { return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
function toks(s) { return String(s).split(/\s+/).map(bare).filter(Boolean); }
function hasTok(text, w) {
  const all = toks(text);
  return all.some((t) => t === w || t.slice(t.lastIndexOf("'") + 1) === w);
}

function checkQs(f, where, qs, n, vfs, nvf) {
  if (!Array.isArray(qs) || qs.length < n) err(f, where + ": hacen falta " + n + " preguntas");
  let longest = 0;
  (qs || []).forEach((q, i) => {
    if (!Array.isArray(q) || q.length !== 3 || !Array.isArray(q[1])) return err(f, where + " q" + i + ": forma [pregunta, [opciones], respuesta]");
    if (q[1].length !== 4) err(f, where + " q" + i + ": cuatro opciones");
    if (q[1].indexOf(q[2]) < 0) err(f, where + " q" + i + ": la respuesta no está entre las opciones");
    if (new Set(q[1]).size !== q[1].length) err(f, where + " q" + i + ": opciones repetidas");
    const L = q[1].map((o) => o.length), max = Math.max.apply(null, L);
    if (q[2].length === max && L.filter((x) => x === max).length === 1) longest++;
  });
  if (qs && qs.length && longest > Math.ceil(qs.length * 0.4)) err(f, where + ": la correcta es la opción más larga en " + longest + " de " + qs.length);
  if (!Array.isArray(vfs) || vfs.length < nvf) err(f, where + ": hacen falta " + nvf + " afirmaciones vf");
  const kinds = new Set();
  (vfs || []).forEach((v, i) => {
    if (VF[LANG].indexOf(v[1]) < 0) err(f, where + " vf" + i + ": la respuesta tiene que ser " + VF[LANG].join(" / "));
    kinds.add(v[1]);
  });
  if (vfs && kinds.size < 3) err(f, where + ": las vf tienen que usar las tres respuestas");
}
function validate(f, d) {
  const w = d.week;
  if (idx(w) < 0) return err(f, "semana fuera del tramo (27-51 sin la 39)");
  const L = d.lettura || {}, A = d.ascolto || {}, C = d.compito || {};
  ["title", "emoji", "genre", "grammar", "text"].forEach((k) => { if (!L[k]) err(f, "lettura." + k + " falta"); });
  const rw = words(L.text || ""), rt = TARGET.read(w);
  if (rw < rt * 0.9 || rw > rt * 1.2) err(f, "lettura: " + rw + " palabras; para la semana " + w + " van " + Math.round(rt * 0.9) + "-" + Math.round(rt * 1.2));
  if ((L.text || "").split(/\n+/).length < 4) err(f, "lettura: al menos 4 párrafos (separados por \\n\\n)");
  checkQs(f, "lettura", L.questions, 5, L.vf, 5);
  const g = L.gloss || {};
  if (Object.keys(g).length < 15) err(f, "lettura.gloss: al menos 15 palabras");
  Object.keys(g).forEach((k) => { if (k !== k.toLowerCase() || !hasTok(L.text || "", k)) err(f, "lettura.gloss «" + k + "» no está tal cual (minúscula) en el texto"); });
  if (!L.hunt || !L.hunt.label || !(L.hunt.targets || []).length) err(f, "lettura.hunt falta");
  else L.hunt.targets.forEach((t) => { if (t !== t.toLowerCase() || !hasTok(L.text, t)) err(f, "hunt «" + t + "» no está tal cual en el texto"); });
  ["title", "genre", "es"].forEach((k) => { if (!A[k]) err(f, "ascolto." + k + " falta"); });
  // Two voices, or three (the third is the first voice with another pitch
  // and pace: js/tramo.js VOICE.C).
  if (!Array.isArray(A.speakers) || A.speakers.length < 2 || A.speakers.length > 3) err(f, "ascolto.speakers: dos o tres nombres");
  const VOICES = ["A", "B", "C"].slice(0, (A.speakers || []).length);
  if (!Array.isArray(A.turns) || A.turns.length < 6) err(f, "ascolto.turns: al menos 6 turnos");
  else A.turns.forEach((t, i) => { if (!Array.isArray(t) || VOICES.indexOf(t[0]) < 0 || !t[1]) err(f, "ascolto.turns[" + i + "]: [\"A\"|\"B\"|\"C\", texto]"); });
  if (VOICES.length === 3 && !A.turns.some((t) => t[0] === "C")) err(f, "ascolto: tres nombres, pero la tercera voz no habla");
  const aw = words((A.turns || []).map((t) => t[1]).join(" ")), at = TARGET.listen(w);
  if (aw < at * 0.9 || aw > at * 1.25) err(f, "ascolto: " + aw + " palabras; para la semana " + w + " van " + Math.round(at * 0.9) + "-" + Math.round(at * 1.25));
  checkQs(f, "ascolto", A.questions, 5, A.vf, 4);
  const at2 = (A.turns || []).map((t) => t[1]).join(" ");
  Object.keys(A.gloss || {}).forEach((k) => { if (!hasTok(at2, k)) err(f, "ascolto.gloss «" + k + "» no está en el audio"); });
  // The short listening (breve): a monologue of an exam genre, one voice,
  // a table of data and «does it say so?» statements.  Required in both languages.
  const Bv = d.breve;
  if (!Bv) err(f, "breve: falta la escucha corta");
  if (Bv) {
    ["title", "genre", "es", "speaker"].forEach((k) => { if (!Bv[k]) err(f, "breve." + k + " falta"); });
    if (!Array.isArray(Bv.text) || Bv.text.length < 3) err(f, "breve.text: al menos 3 párrafos");
    const bt = (Bv.text || []).join(" "), bw = words(bt), low = low0(bt);
    if (bw < 110 || bw > 320) err(f, "breve: " + bw + " palabras (110-320)");
    if (!Array.isArray(Bv.tabella) || Bv.tabella.length < 4 || Bv.tabella.length > 6) err(f, "breve.tabella: de 4 a 6 datos");
    (Bv.tabella || []).forEach((c, i) => {
      if (!Array.isArray(c) || typeof c[0] !== "string" || typeof c[1] !== "string" || !Array.isArray(c[2])) return err(f, "breve.tabella[" + i + "]: [dato, respuesta, [otras formas]]");
      if (![c[1]].concat(c[2]).some((a) => low.indexOf(low0(a)) >= 0)) err(f, "breve.tabella[" + i + "]: ninguna forma de la respuesta está en el audio: " + c[1]);
    });
    const info = Bv.info || [];
    if (info.length !== 6 || info.filter((v) => v[1] === true).length !== 3 || info.some((v) => typeof v[1] !== "boolean"))
      err(f, "breve.info: seis afirmaciones, tres que el audio dice (true) y tres que no (false)");
    Object.keys(Bv.gloss || {}).forEach((k) => { if (low.indexOf(low0(k)) < 0) err(f, "breve.gloss «" + k + "» no está en el audio"); });
  }
  if (GENRES[LANG].indexOf(C.genre) < 0) err(f, "compito.genre: uno de " + GENRES[LANG].join(", "));
  ["title", "t", "es", "fonte", "model"].forEach((k) => { if (!C[k]) err(f, "compito." + k + " falta"); });
  if (["lettura", "ascolto", "entrambi"].indexOf(C.fonte) < 0) err(f, "compito.fonte: lettura | ascolto | entrambi");
  const mt = TARGET.min(w);
  if (C.min !== mt) err(f, "compito.min tiene que ser " + mt);
  if (C.max !== mt + 60) err(f, "compito.max tiene que ser " + (mt + 60));
  const mw = words(C.model || "");
  if (mw < mt || mw > mt + 60) err(f, "compito.model: " + mw + " palabras; tiene que estar entre min y max");
  if (!Array.isArray(C.punti) || C.punti.length < 3 || C.punti.length > 5) err(f, "compito.punti: de 3 a 5");
  (C.punti || []).forEach((p, i) => {
    if (!Array.isArray(p) || typeof p[0] !== "string" || !Array.isArray(p[1]) || !p[1].length) return err(f, "punti[" + i + "]: [descripción, [claves]]");
    const m = String(C.model).toLowerCase();
    if (!p[1].some((k) => m.indexOf(k.toLowerCase()) >= 0)) err(f, "punti[" + i + "]: el modelo no contiene ninguna de sus claves");
    (p[1] || []).forEach((k) => { if ((GENERIC[LANG] || []).indexOf(String(k).toLowerCase()) >= 0) err(f, "punti[" + i + "]: «" + k + "» es una palabra que cualquier texto trae: poné un hecho de la fuente"); });
  });
  if (LANG === "pt" && /^Toc[áa]/.test((L.hunt || {}).label || "")) err(f, "lettura.hunt.label: la consigna de la caza va en portugués");
  return { rw: rw, aw: aw, mw: mw };
}

["it", "pt"].forEach(function (code) {
  LANG = code;
  var dir = path.join(pack.ROOT, "tools", code, "tramo");
  var files = fs.readdirSync(dir).filter(function (f) { return /^w\d\d\.json$/.test(f); }).sort();
  var got = files.map(function (f) { var d = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")); validate(code + "/" + f, d); return d.week; });
  ok(JSON.stringify(got) === JSON.stringify(WEEKS), "hacen falta las 24 semanas 27-51 sin la 39; hay: " + got.join(", "));
  // the generated file is up to date
  var gen = fs.readFileSync(path.join(pack.DOCS, "lang", code, "tramo_data.js"), "utf8");
  var before = gen;
  require("child_process").execFileSync(process.execPath, [path.join(__dirname, "build_tramo.js"), code]);
  var after = fs.readFileSync(path.join(pack.DOCS, "lang", code, "tramo_data.js"), "utf8");
  ok(before === after, "docs/lang/" + code + "/tramo_data.js no está al día: corré npm run build");

  var ctx = pack(code), T = ctx.Tramo, L = ctx.Letture, S = ctx.Scrivi;
  ctx.Banca.load(pack.data(code, "bank.json"));
  S.learnCourse({ items: pack.data(code, "course.json").items, bank: ctx.Banca.bank(), phrases: ctx.Frasi.ALL,
                  readings: L.EPISODI, glossario: pack.data(code, "glossario.json"), extra: T.lexTexts() });
  T.attach({ esc: function (s) { return String(s); }, langName: function () { return code; }, state: function () { return {}; } });
  ok(L.SERIES.some(function (s) { return s.id === "lunga"; }), "la serie «lunga» no está en Letture.SERIES");
  var course = pack.data(code, "course.json");
  WEEKS.forEach(function (w) {
    var s = T.week(w);
    if (!s) return;
    var ep = L.byId("l-" + w);
    ok(ep && ep.series === "lunga" && ep.week === w, "semana " + w + ": falta la lectura larga en Letture");
    ok(L.session(ep).length === s.lettura.questions.length + s.lettura.vf.length + 1, "semana " + w + ": la sesión de lectura no trae todas las preguntas");
    var ms = T.missions(course.weeks[w - 1], {});
    ok(ms.length === (s.breve ? 3 : 2) && ms.every(function (m) { return !m.done && !m.opt; }), "semana " + w + ": las misiones de escucha y tarea");
    // 3.1: the long listening with a blank sheet is half done, not done;
    // the third delivery completes it; a record from before 3.1 stays done
    var asc = function (rec) { return T.missions(course.weeks[w - 1], { tramo: { asc: (function () { var o = {}; o[w] = rec; return o; })(), scr: {}, brv: {} } })
      .filter(function (m) { return m.kind === "tr-asc"; })[0]; };
    var a0 = asc({ pct: 0, tries: 2, v: 31 });
    ok(a0 && !a0.done && a0.half && /Te falta/.test(a0.sub), "semana " + w + ": la escucha larga entregada en blanco dos veces queda a medias");
    ok(asc({ pct: 0, tries: 3, v: 31 }).done && asc({ pct: 70, tries: 1, v: 31 }).done && asc({ pct: 0 }).done,
       "semana " + w + ": la escucha larga se completa con 60 %, al tercer intento, o si es de antes de la 3.1");
    if (s.breve) {
      ok(ms.some(function (m) { return m.kind === "tr-brv" && T.handles(m.kind); }) && T.owns("tramo-brv"), "semana " + w + ": la misión de la escucha corta");
      // every accepted form of each cell passes, and another cell's answer does not
      s.breve.tabella.forEach(function (c, i) {
        [c[1]].concat(c[2]).forEach(function (a) { ok(T.cellOk(a, c) && T.cellOk(" " + a.toUpperCase() + ". ", c), "semana " + w + ": la tabla no acepta «" + a + "»"); });
        var other = s.breve.tabella[(i + 1) % s.breve.tabella.length];
        if (other[1] !== c[1] && c[2].indexOf(other[1]) < 0) ok(!T.cellOk(other[1], c), "semana " + w + ": la tabla acepta «" + other[1] + "» para «" + c[0] + "»");
      });
    }
    var r = T.evaluate(s.compito, s.compito.model, w, s);
    ok(r.ok, "semana " + w + ": el modelo no pasa la revisión: " + r.crit.filter(function (c) { return !c.ok; }).map(function (c) { return c.label; }).join(" | "));
    var hard = r.check.findings.filter(function (f) { return !f.soft; });
    // The checker still has false alarms on C1 texts (slogan, a secretaria,
    // a word quoted on purpose): at most three, and they never block the task.
    ok(hard.length <= 3, "semana " + w + ": el corrector marca " + hard.length + " errores en el modelo: " + hard.map(function (f) { return f.msg; }).join(" | "));
    var copy = s.lettura.text.split(/\s+/).slice(0, s.compito.min + 10).join(" ");
    ok(!T.evaluate(s.compito, copy, w, s, { noCheck: true }).ok, "semana " + w + ": copiar la lectura pasa la revisión");
    var junk = Array(s.compito.min + 5).fill(s.compito.punti.map(function (p) { return p[1][0]; }).join(" ")).join(" ").split(" ").slice(0, s.compito.min + 5).join(" ");
    ok(!T.evaluate(s.compito, junk, w, s, { noCheck: true }).ok, "semana " + w + ": una lista de palabras clave repetida pasa la revisión");
    ok(!T.evaluate(s.compito, s.compito.model.split(/\s+/).slice(0, Math.floor(s.compito.min * 0.7)).join(" "), w, s, { noCheck: true }).ok,
       "semana " + w + ": un texto corto pasa la revisión");
  });
  // The checker on native C1 prose (every reading, listening and model of the
  // tramo): each mark there is a false alarm.  From 41 (it) and 83 (pt) down
  // to about 12 and 20 in v2.7; this keeps them from coming back.
  var FALSE_MAX = { it: 15, pt: 24 }, fa = 0, faList = [];
  T.weeks().forEach(function (w) {
    var s = T.week(w), lines = s.lettura.text.split(/\n+/).concat(s.compito.model.split(/\n+/)).map(function (t) { return [w, t]; })
      .concat(s.ascolto.turns.map(function (t) { return [52, t[1]]; }));   // spoken: no formal-register week
    lines.forEach(function (x) {
      S.lint(x[1], x[0]).filter(function (f) { return !f.soft; }).forEach(function (f) { fa++; faList.push(w + ": " + f.msg); });
    });
  });
  ok(fa <= FALSE_MAX[code], "falsas alarmas del corrector en el tramo: " + fa + " (tope " + FALSE_MAX[code] + "): " + faList.slice(0, 5).join(" | "));

  /* ---- v3: fichas de género y adequação */
  var G = ctx.TRAMO_DATA.GENRES, used = {};
  WEEKS.forEach(function (w) { var s = T.week(w); if (s) used[s.compito.genre] = 1; });
  var withFicha = Object.keys(G).filter(function (g) { return T.fichaOf(G[g]); });
  if (withFicha.length) Object.keys(used).forEach(function (g) {
    var f = T.fichaOf(G[g]);
    ok(!!f, g + ": falta la ficha del género");
    if (!f) return;
    ok(f.length >= 4 && f.length <= 6, g + ": la ficha tiene " + f.length + " pantallas (4-6)");
    ok(f.every(function (x) { return x.h && x.p && (!x.list || x.list.every(function (r) { return Array.isArray(r) && r.length === 2 && r[0]; })); }), g + ": cada pantalla con h, p y pares [lengua, castellano]");
    ok(f.some(function (x) { return (x.list || []).length >= 8; }), g + ": una pantalla con 8-10 fórmulas");
    ok(f.some(function (x) { return (x.model || []).length >= 3; }), g + ": un modelo anotado");
    ok(T.fichaHtml(g, 0).indexOf(f[0].h) >= 0 && T.fichaHtml(g, 99).indexOf(f[f.length - 1].h) >= 0, g + ": fichaHtml dibuja la primera y la última pantalla");
  });
  var A = ctx.TRAMO_DATA.ADEQ, NEW = ["trat", "prop", "fonte", "reg"];
  WEEKS.forEach(function (w) {
    var s = T.week(w);
    if (!s) return;
    var r = T.evaluate(s.compito, s.compito.model, w, s, { noCheck: true }), ids = r.crit.map(function (c) { return c.id; });
    if (!A) { ok(!NEW.some(function (id) { return ids.indexOf(id) >= 0; }), "semana " + w + ": sin ADEQ, la revisión no cambia"); return; }
    r.crit.filter(function (c) { return NEW.indexOf(c.id) >= 0; }).forEach(function (c) { ok(c.ok, "semana " + w + ": el modelo no pasa «" + c.id + "»: " + c.label); });
    var g = G[s.compito.genre];
    ok(!g.proposito || ids.indexOf("prop") >= 0, "semana " + w + ": falta el criterio del propósito");
    ok(ids.indexOf("fonte") >= 0, "semana " + w + ": falta el criterio del uso de la fuente");
    // a text on the same genre that ignores the source
    var other = T.week(w === 27 ? 51 : 27), off = T.evaluate(s.compito, other.compito.model, w, s, { noCheck: true });
    var fo = off.crit.filter(function (c) { return c.id === "fonte"; })[0];
    ok(fo && !fo.ok, "semana " + w + ": un texto que no usa la fuente pasa «fonte»: " + (fo && fo.label));
    if (g.trat === "senhor") {
      var mixed = s.compito.model.replace(/\n\s*\n/, "\n\nVocê sabe que eu conto com você e te agradeço.\n\n");
      ok(!T.evaluate(s.compito, mixed, w, s, { noCheck: true }).crit.filter(function (c) { return c.id === "trat"; })[0].ok, "semana " + w + ": mezclar você con o senhor pasa «trat»");
    }
    if ((s.compito.registro || g.registro) === "formal") {
      var chat = s.compito.model + "\n\nPois é, a gente tá cansado, né? Tô falando pra você: cadê a solução?";
      ok(!T.evaluate(s.compito, chat, w, s, { noCheck: true }).crit.filter(function (c) { return c.id === "reg"; })[0].ok, "semana " + w + ": marcas del habla en un texto formal pasan «reg»");
    }
    if ((s.compito.registro || g.registro) === "informal") {
      var stiff = "Prezado senhor,\n\n" + s.compito.model + "\n\nAtenciosamente,";
      ok(!T.evaluate(s.compito, stiff, w, s, { noCheck: true }).crit.filter(function (c) { return c.id === "reg"; })[0].ok, "semana " + w + ": fórmulas de carta formal a un amigo pasan «reg»");
    }
    if (g.proposito) {
      var noprop = s.compito.model.replace(new RegExp(g.proposito.join("|"), "gi"), "");
      ok(!T.evaluate(s.compito, noprop, w, s, { noCheck: true }).crit.filter(function (c) { return c.id === "prop"; })[0].ok, "semana " + w + ": sin verbos del propósito pasa «prop»");
    }
  });

  // what the AI answers is taken only in the expected shape
  ok(T.readAI({ punteggi: { a: 4, b: "5", c: 9 }, errori: [["x", "y"], "z"], commento: 3 }).tot === 14, "readAI suma y recorta");
  ok(T.readAI({ punteggi: "bien" }) === null, "readAI descarta lo que no tiene forma");
  // the cells of a short listening: hours, articles and accents do not count
  var cell = ["Ora", "18", ["diciotto"]];
  ok(T.cellOk("alle 18", cell) && T.cellOk("18:00", cell) && T.cellOk("Diciotto", cell) && !T.cellOk("8", cell) && !T.cellOk("", cell), "cellOk: horas");
  ok(T.cellOk("il Lunedi", ["Giorno", "lunedì", []]) && !T.cellOk("martedì", ["Giorno", "lunedì", []]), "cellOk: tildes y artículos");
  if (code === "pt") {
    ok(T.cellOk("às 18h", cell) && T.cellOk("18 horas", cell) && T.cellOk("R$ 18", cell) && !T.cellOk("8h", cell), "cellOk (pt): às 18h, 18 horas, R$ 18");
    ok(T.cellOk("9h15", ["Hora", "9:15", []]) && T.cellOk("às 9h15", ["Hora", "9 e 15", []]) && !T.cellOk("9h", ["Hora", "9:15", []]), "cellOk (pt): 9h15");
  }
});
console.log(bad ? "✗ test_tramo: " + bad + " problemas" : "✓ test_tramo: " + checks + " controles");
process.exit(bad ? 1 : 0);
