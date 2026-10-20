/* Variantes válidas: el portugués de Brasil dice lo mismo de varias maneras
   y la corrección de las respuestas cerradas las tiene que aceptar todas.
   El test toma las oraciones del banco y las traducciones del curso, arma
   variantes correctas que el alumno escribe de verdad (el adverbio de tiempo
   al final o al principio, el sujeto dicho o callado, los números en cifras,
   el registro del habla —pra, tô, tá, tava, cê, amo você, vi ele—, a gente
   por nós, sinónimos comunes) y controla que se acepten como las acepta la
   app (Engine.grade + Diagnosi.diagnose, igual que produce en app.js).
   Además arma variantes incorrectas de control (em o, muy, tengo, gosto sin
   de, vou a + infinitivo, a gente vamos) que tienen que seguir rechazadas.

   El registro sigue la tabla del paquete (Diagnosi.REGISTRO): en una oración
   sin registro formal, la forma del habla vale con una nota (level
   "ok_note"); en una marcada como formal (etiqueta «formal» del banco o
   «(formal)», «(culto)» en la consigna) es «Casi» (level "close").

   Run: node tools/pt/test_variantes.js [-v] [--fam nombre]  */
"use strict";
var pack = require("../lib/pack.js");
var ctx = pack("pt");
var D = ctx.Diagnosi, Engine = ctx.Engine;
var bank = pack.data("pt", "bank.json");
if (ctx.Banca) ctx.Banca.load(bank); else D.init(bank);
var course = pack.data("pt", "course.json");
var args = process.argv.slice(2), verbose = args.indexOf("-v") >= 0;
var onlyFam = args.indexOf("--fam") >= 0 ? args[args.indexOf("--fam") + 1] : null;

var fails = 0, checks = 0;
function ok(c, what) { checks++; if (!c) { fails++; console.log("FAIL " + what); } }

/* ------------------------------------------------------- las oraciones */

var SRC = [];
bank.sentences.forEach(function (s, i) {
  var v = (s.pt || s.it || []).filter(Boolean);
  if (!v.length) return;
  SRC.push({ id: "banco:" + i, base: v[0], accept: v, stem: s.es,
             formal: (s.tags || []).indexOf("formal") >= 0 || /\((formal|culto)/i.test(s.es || "") });
});
course.items.forEach(function (it) {
  if (it.type !== "translate") return;
  var acc = (it.accept && it.accept.length ? it.accept : [it.answer]).filter(Boolean);
  SRC.push({ id: it.id, base: it.answer, accept: acc, stem: it.stem, prompt: it.prompt,
             formal: /formal|culto|culta/i.test((it.prompt || "") + " " + (it.stem || "")) });
});

/* -------------------------------------------------- herramientas */

function words(s) { return String(s).split(/\s+/).filter(Boolean); }
function core(t) { return t.replace(/^[«»"“”¿¡(\[—–-]+|[.,;:!?«»"“”()\]…—–]+$/g, ""); }
function low(t) { return core(t).toLowerCase(); }
function capFirst(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function lowFirst(s) { return /^(Eu|Você|Vocês)\b/.test(s) || !/^[A-ZÀ-Ý][a-zà-ÿ]/.test(s) ? s : s.charAt(0).toLowerCase() + s.slice(1); }
function forms(w) { return D.verbForms(w); }
function finiteP(w, p) { return forms(w).some(function (v) { return v.p === p && v.tense !== "infPessoal"; }); }
function endPunct(s) { var m = /[.!?…]+$/.exec(s.trim()); return m ? m[0] : ""; }
function body(s) { return s.trim().replace(/[.!?…]+$/, ""); }
function same(a, b) { return D.tokens(a).join(" ") === D.tokens(b).join(" "); }

var NUM = { dois: 2, duas: 2, "três": 3, quatro: 4, cinco: 5, seis: 6, sete: 7, oito: 8, nove: 9, dez: 10, onze: 11, doze: 12,
  treze: 13, catorze: 14, quatorze: 14, quinze: 15, dezesseis: 16, dezessete: 17, dezoito: 18, dezenove: 19, vinte: 20, trinta: 30,
  quarenta: 40, cinquenta: 50, sessenta: 60, setenta: 70, oitenta: 80, noventa: 90, cem: 100, cento: 100, duzentos: 200, duzentas: 200,
  trezentos: 300, quinhentos: 500, mil: 1000 };
var TIME = /^(hoje|ontem|amanhã|agora|anteontem|depois|cedo)$/i;
var TIME2 = /^(de manhã|à noite|à tarde|de noite|de tarde|todo dia|todos os dias|no sábado|no domingo|amanhã cedo|ontem à noite|hoje à noite|esta semana|este ano|no verão|no inverno)$/i;

/* ---------------------------------------------- variantes válidas */

var VALID = {
  // Hoje eu acordei cedo → Eu acordei cedo hoje (y al revés)
  adverbio: function (s) {
    var b = body(s), p = endPunct(s), w = words(b), out = [];
    if (w.length < 3 || w.length > 11 || /,.*,/.test(b)) return out;
    var take = function (n) { return w.slice(0, n).map(core).join(" "); };
    [2, 1].some(function (n) {
      var head = take(n);
      if (!(n === 1 ? TIME.test(head) : TIME2.test(head))) return false;
      var rest = w.slice(n).join(" ").replace(/^,\s*/, "");
      if (/,/.test(rest) || !rest) return true;
      out.push(capFirst(lowFirst(rest)) + " " + head.toLowerCase() + p);
      return true;
    });
    [2, 1].some(function (n) {
      var tail = w.slice(-n).map(core).join(" ");
      if (!(n === 1 ? TIME.test(tail) : TIME2.test(tail))) return false;
      var rest = w.slice(0, -n).join(" ").replace(/,\s*$/, "");
      if (/,/.test(rest) || !rest || /^(que|se|quando|como)$/i.test(core(w[w.length - n - 1] || ""))) return true;
      out.push(capFirst(tail.toLowerCase()) + " " + lowFirst(rest) + p);
      return true;
    });
    return out;
  },
  // Tenho trinta anos → Eu tenho trinta anos; Eu moro no Rio → Moro no Rio
  sujeto: function (s) {
    var w = words(s), out = [];
    if (!w.length) return out;
    var w0 = low(w[0]), w1 = low(w[1] || "");
    if (/^[A-ZÀ-Ý]/.test(w[0]) && finiteP(w0, 0) && !D.DATA.nouns[w0] && !/^(sou|vou)$/.test("x")) out.push("Eu " + lowFirst(s));
    if (w0 === "eu" && finiteP(w1, 0)) out.push(capFirst(w.slice(1).join(" ")));
    if (w0 === "nós" && finiteP(w1, 3)) out.push(capFirst(w.slice(1).join(" ")));
    // «Você quer um café?» → «Quer um café?»: la pregunta con você callado
    if (w0 === "você" && finiteP(w1, 2) && /\?$/.test(s.trim())) out.push(capFirst(w.slice(1).join(" ")));
    return out;
  },
  // Tenho trinta e dois anos → Tenho 32 anos
  cifras: function (s) {
    var w = words(s), out = [];
    for (var i = 0; i < w.length; i++) {
      var t = low(w[i]);
      if (NUM[t] == null) continue;
      var val = NUM[t], j = i + 1;
      while (j + 1 < w.length && low(w[j]) === "e" && NUM[low(w[j + 1])] != null && NUM[low(w[j + 1])] < val) { val += NUM[low(w[j + 1])]; j += 2; }
      if (core(w[j - 1]) !== w[j - 1]) continue;       // «dois.» al final: el número solo
      var nx = low(w[j] || "");
      if (!nx || !/^[a-zà-ÿ]/.test(nx) || /^(e|de|do|da|ou|horas?|mil|milhões)$/.test(nx) || /^(mil)$/.test(t)) continue;
      if (/^(às|as|à|a|das|desde)$/.test(low(w[i - 1] || ""))) continue;   // las horas se escriben con letras o 14h
      var copy = w.slice(0, i).concat([String(val)], w.slice(j));
      out.push(copy.join(" "));
      break;
    }
    return out;
  },
  // El registro del habla: pra, pro, tô, tá, tava, cê
  habla: function (s) {
    var out = [];
    var rep = function (re, to) { var x = s.replace(re, to); if (x !== s) out.push(x); };
    rep(/\bpara a\b(?! gente)/, "pra");
    rep(/\bpara o\b/, "pro");
    rep(/\bpara os\b/, "pros");
    rep(/\bpara (?!(o|a|os|as|que|mim|eu|ele|ela|você)\b)/, "pra ");
    rep(/\b[Ee]stou\b/, function (m) { return m.charAt(0) === "E" ? "Tô" : "tô"; });
    rep(/\b[Ee]stá\b(?!-)/, function (m) { return m.charAt(0) === "E" ? "Tá" : "tá"; });
    rep(/\b[Ee]stava\b(?!-)/, function (m) { return m.charAt(0) === "E" ? "Tava" : "tava"; });
    if (/^Você [a-zà-ÿ]+/.test(s) && finiteP(low(words(s)[1]), 2)) out.push(s.replace(/^Você /, "Cê "));
    return out;
  },
  // Eu te amo → Eu amo você; eu o vi → eu vi ele
  pronombre_habla: function (s) {
    var out = [], m;
    m = /\bte (amo|adoro|conheço|espero|vejo|ajudo|convido|entendo|procuro|busco|levo)\b/i.exec(s);
    if (m) out.push(s.slice(0, m.index) + m[1] + " você" + s.slice(m.index + m[0].length));
    m = /\b(eu|ele|ela|nós|você) (o|a) (vi|conheço|conheci|encontrei|esperei|ajudei|convidei|levei|chamei|amo)\b/i.exec(s);
    if (m) out.push(s.slice(0, m.index) + m[1] + " " + m[3] + " " + (m[2].toLowerCase() === "o" ? "ele" : "ela") + s.slice(m.index + m[0].length));
    m = /\bte (ligo|ligar|ligou|liguei)\b/i.exec(s);
    if (m) out.push(s.slice(0, m.index) + m[1] + " pra você" + s.slice(m.index + m[0].length));
    return out;
  },
  // Nós vamos → A gente vai
  a_gente: function (s) {
    var w = words(s), out = [];
    for (var i = 0; i < w.length - 1; i++) {
      if (low(w[i]) !== "nós") continue;
      var v = forms(low(w[i + 1])).filter(function (x) { return x.p === 3 && x.tense !== "infPessoal"; })[0];
      if (!v) continue;
      var f;
      try { f = String(ctx.Conj.conjugate(v.lemma, v.tense)[2]).split(/\s+/).pop().split("/")[0]; } catch (e) { f = null; }
      if (!f || /-/.test(f)) continue;
      var c = w.slice();
      c[i] = w[i].replace(/Nós|nós/, function (x) { return x === "Nós" ? "A gente" : "a gente"; });
      c[i + 1] = w[i + 1].replace(core(w[i + 1]), f);
      out.push(c.join(" "));
      break;
    }
    return out;
  },
  // sinónimos del habla y de todos los días
  sinonimos: function (s) {
    var out = [];
    var rep = function (re, to) { var x = s.replace(re, to); if (x !== s) out.push(x); };
    rep(/\bdinheiro\b/, "grana");
    rep(/\blegal\b/, "bacana");
    rep(/^Talvez /, "Quem sabe ");
    rep(/\bônibus\b/, "busão");
    rep(/^Mas /, "Porém, ");
    rep(/\bautomóvel\b/, "carro");
    rep(/\bgaroto\b/, "menino");
    rep(/\bmenino\b/, "garoto");
    rep(/\bcelular\b/, "telefone");
    rep(/\bcomeçou\b/, "iniciou");
    return out;
  }
};

/* ------------------------------------------- incorrectas de control */

var WRONG = {
  em_o: function (s) { var x = s.replace(/\bno\b(?= [a-zà-ÿ])/, "em o"); return x !== s ? [x] : []; },
  muy: function (s) { var x = s.replace(/\bmuito\b(?= [a-zà-ÿ]+(o|a)\b)/, "muy"); return x !== s ? [x] : []; },
  tengo: function (s) { var x = s.replace(/\b([Tt])enho\b/, "$1engo"); return x !== s ? [x] : []; },
  gostar_sin_de: function (s) { var x = s.replace(/\b(gosto|gosta|gostam|gostamos) de\b/, "$1"); return x !== s ? [x] : []; },
  ir_a_inf: function (s) {
    var m = /\b(vou|vai|vamos|vão) ([a-zà-ÿ]+(ar|er|ir))\b/.exec(s);
    return m && D.util.isInfinitive(m[2]) ? [s.slice(0, m.index) + m[1] + " a " + m[2] + s.slice(m.index + m[0].length)] : [];
  },
  a_gente_vamos: function (s) { var x = s.replace(/\b([Aa]) gente vai\b/, "$1 gente vamos"); return x !== s ? [x] : []; }
};

/* ------------------------------------------------- la corrección */

// Como produce en app.js: Engine.grade + Diagnosi.diagnose.
function judge(given, src) {
  var dctx = { stem: src.stem, prompt: src.prompt, week: 52 };
  if (src.formal) dctx.registro = "formal";
  var d = D.diagnose(given, src.accept, dctx);
  var v1 = Engine.grade(given, { accept: src.accept, answer: src.accept[0] });
  var verdict = v1 === "giusto" || d.verdict === "giusto" ? "giusto"
              : d.verdict === "sbagliato" && d.cat ? "sbagliato"
              : v1 === "quasi" || d.verdict === "quasi" ? "quasi" : "sbagliato";
  return { verdict: verdict, d: d };
}

var stat = {}, bad = {}, wrongStat = {}, wrongBad = {};
function tally(map, k, good) { var c = map[k] = map[k] || [0, 0]; c[1]++; if (good) c[0]++; }
SRC.forEach(function (src) {
  var seen = {};
  Object.keys(VALID).forEach(function (fam) {
    var made = [];
    src.accept.forEach(function (b) { VALID[fam](b).forEach(function (v) { made.push(v); }); });
    made.forEach(function (v) {
      var key = D.tokens(v).join(" ");
      if (seen[key] || src.accept.some(function (a) { return same(a, v); })) return;
      seen[key] = 1;
      var j = judge(v, src);
      var reg = fam === "habla" || fam === "pronombre_habla" ||
                (fam === "sinonimos" && /\b(grana|busão)\b/.test(v));   // sinónimos del habla
      // registro formal: la forma del habla es «Casi», no «bien» ni «mal»
      var good = reg && src.formal ? j.verdict === "quasi" : j.verdict === "giusto";
      tally(stat, fam, good);
      if (!good) (bad[fam] = bad[fam] || []).push([src.id, v, src.accept[0], j]);
    });
  });
  Object.keys(WRONG).forEach(function (fam) {
    WRONG[fam](src.base).forEach(function (v) {
      if (src.accept.some(function (a) { return same(a, v); })) return;
      var j = judge(v, src);
      var good = j.verdict !== "giusto";
      tally(wrongStat, fam, good);
      if (!good) (wrongBad[fam] = wrongBad[fam] || []).push([src.id, v, src.accept[0], j]);
    });
  });
});

function show(list) {
  list.slice(0, verbose ? 400 : 5).forEach(function (x) {
    console.log("    [" + x[0] + "] «" + x[1] + "» ⇒ «" + x[2] + "»  " + x[3].verdict + " · " + (x[3].d.cat || "") + " · " + (x[3].d.explain || "").slice(0, 110));
  });
}
var tv = 0, tg = 0;
console.log("variantes válidas (" + SRC.length + " oraciones):");
Object.keys(stat).forEach(function (k) {
  tv += stat[k][1]; tg += stat[k][0];
  console.log("  " + (k + "                  ").slice(0, 18) + stat[k][0] + "/" + stat[k][1] + " aceptadas");
  if ((onlyFam === k || verbose) && bad[k]) show(bad[k]);
});
var rate = (tv - tg) / tv;
console.log("  total: " + tg + "/" + tv + " · rechazo " + (rate * 100).toFixed(1) + " %");
var tw = 0, tr = 0;
console.log("incorrectas de control:");
Object.keys(wrongStat).forEach(function (k) {
  tw += wrongStat[k][1]; tr += wrongStat[k][0];
  console.log("  " + (k + "                  ").slice(0, 18) + wrongStat[k][0] + "/" + wrongStat[k][1] + " rechazadas");
  if ((onlyFam === k || verbose) && wrongBad[k]) show(wrongBad[k]);
});

ok(tv >= 600, "hay variantes para medir: " + tv);
ok(rate < 0.05, "rechazo de variantes válidas por debajo del 5 %: " + (rate * 100).toFixed(1) + " %");
Object.keys(stat).forEach(function (k) {
  ok(stat[k][1] < 10 || stat[k][0] / stat[k][1] >= 0.85, "variantes «" + k + "»: " + stat[k][0] + "/" + stat[k][1]);
});
ok(tr === tw, "incorrectas de control rechazadas: " + tr + "/" + tw);

console.log("\ncontroles: " + checks + "   errores: " + fails);
process.exit(fails ? 1 : 0);
