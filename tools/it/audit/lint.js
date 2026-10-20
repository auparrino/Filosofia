/* Linter deterministico dell'audit.  Deve finire con 0 problemi.
   Run: node tools/it/audit/corpus.js && node tools/it/audit/lint.js
   (requisiti: pip install spylls ; cd tools/it/audit && npm install)
   Parole sconosciute ma giuste → tools/it/audit/whitelist.txt (una per riga, # commento). */
var fs = require("fs");
var path = require("path");
var pack = require("../../lib/pack.js");
var OUT = path.join(__dirname, "out");
var ctx = pack("it");
var Conj = ctx.Conj;
var Engine = ctx.Engine;
var D = ctx.Diagnosi;
var bank = pack.data("it", "bank.json");
D.init(bank);

var units = fs.readFileSync(path.join(OUT, "corpus.jsonl"), "utf8").trim().split("\n").map(JSON.parse);
var problems = [];
function flag(u, rule, msg) { problems.push({ id: u.id, src: u.src, rule: rule, msg: msg }); }

/* ------------------------------------------------------------ lessico */
var WL = new Set();
var wlf = path.join(__dirname, "whitelist.txt");
if (fs.existsSync(wlf)) fs.readFileSync(wlf, "utf8").split("\n").forEach(function (l) {
  l = l.replace(/#.*/, "").trim().toLowerCase(); if (l) WL.add(l);
});
// Hunspell (dizionari di LibreOffice) via tools/it/audit/spell.py, in un colpo solo
var LEX = new Set();
var cp = require("child_process");
var UNKNOWN = null;   // parole che Hunspell non conosce, calcolate dopo aver raccolto tutto
function known(w) {
  if (LEX.has(w) || WL.has(w)) return true;
  return UNKNOWN ? !UNKNOWN.has(w) : true;
}
function addForms(v) {
  Conj.ALL_TENSES.forEach(function (t) { try { Conj.conjugate(v, t).forEach(function (f) { String(f).split(/\s+/).forEach(function (w) { LEX.add(w.toLowerCase()); }); }); } catch (e) { /* */ } });
  try { Conj.imperative(v).forEach(function (f) { String(f).split(/\s+|\//).forEach(function (w) { LEX.add(w.toLowerCase()); }); }); } catch (e) { /* */ }
  try { LEX.add(Conj.participle(v)); LEX.add(Conj.gerund(v)); } catch (e) { /* */ }
}
Conj.list().forEach(addForms);
bank.verbs.forEach(function (v) { LEX.add(v[0]); });
bank.nouns.forEach(function (n) { LEX.add(n[0]); LEX.add(n[2]); });
bank.adjectives.forEach(function (a) { a.slice(0, 4).forEach(function (w) { LEX.add(w); }); });

function strings(x, out) {
  out = out || [];
  if (typeof x === "string") out.push(x);
  else if (Array.isArray(x)) x.forEach(function (y) { strings(y, out); });
  else if (x && typeof x === "object") Object.keys(x).forEach(function (k) { strings(x[k], out); });
  return out;
}

var unknown = {};
var ALLWORDS = new Set();
var lexQueue = [];
function lexCheck(u, s) {
  s = s.replace(/Italian Grammar For Dummies/g, " ");   // titolo di un libro
  lexQueue.push([u, s]);
  (s.match(/[A-Za-zÀ-ÖØ-öø-ÿ]+/g) || []).forEach(function (w) { ALLWORDS.add(w.toLowerCase()); });
}
function lexCheckNow(u, s) {
  // Markdown, placeholders, code-ish bits out
  var clean = s.replace(/\*\*|\*|_{2,}|`/g, " ").replace(/https?:\S+/g, " ").replace(/\b\w*\d\w*\b/g, " ");
  (clean.match(/[A-Za-zÀ-ÖØ-öø-ÿ]+(?:['’][A-Za-zÀ-ÖØ-öø-ÿ]+)*/g) || []).forEach(function (tok) {
    tok.split(/['’]/).forEach(function (w, i, arr) {
      if (w.length < 2) return;
      var low = w.toLowerCase();
      if (known(low)) return;
      if (i < arr.length - 1 && (known(low + "'") || /^(l|un|d|c|m|t|s|v|n|all|dell|nell|sull|dall|quest|quell|bell|sant|tutt|com|dov|quand|anch|po)$/.test(low))) return;
      // enclitici e forme composte (dimmelo, andarsene): base + pronomi
      var base = low.replace(/(mi|ti|ci|vi|si|lo|la|li|le|gli|ne|glie|me|te|ce|ve|se)+$/, "");
      if (base !== low && base.length > 2 && (known(base) || known(base + "e") || known(base + "re"))) return;
      (unknown[low] = unknown[low] || { n: 0, ex: [] }).n++;
      if (unknown[low].ex.length < 2) unknown[low].ex.push(u.id + ": " + s.slice(0, 90));
    });
  });
}

/* ------------------------------------------------------------ regole */
// Word boundaries that know accented letters (\b does not).
var L = "A-Za-zÀ-ÖØ-öø-ÿ";
function W(src, flags) { return new RegExp(src.replace(/\\</g, "(?<![" + L + "'’])").replace(/\\>/g, "(?![" + L + "])"), flags || ""); }
var RULES = [
  [W("\\<(perch|bench|poich|affinch|giacch|finch|sicch|nonch|cosicch|anzich|purch)è\\>", "i"), "chè → ché (acento agudo)"],
  [W("\\<nè\\>", "i"), "nè → né"],
  [W("\\<pò\\>", "i"), "pò → po'"],
  [W("\\<qual'\\s?è\\>", "i"), "qual'è → qual è", /→|SIN apóstrofo|sin apóstrofo/],
  [W("\\<(quì|quà|sù|fà|stà|và|trè|rè|mè)\\>", "i"), "tilde sobrante en monosílabo italiano"],
  [/(^|[.!?]\s+|«|")E'(?=\s)/, "E' → È"],
  [/ {2,}/, "espacio doble"],
  [/[^\S\n][,.;:!?](?!\.)/, "espacio antes de puntuación"],
  [/\(\s|\s\)/, "espacio junto a paréntesis"],
  [W("\\<(il|la|lo|le|gli|un|una|di|da|in|che|non|el|los|las|de|que|en|the|to)\\s+\\1\\>", "i"), "palabra repetida"],
  [/[a-zà-ù][.!?][A-ZÀ-Ù][a-zà-ù]/, "falta espacio después del punto"],
  [W("\\<sè\\>", "i"), "sè → sé"]
];

function balance(s) {
  var errs = [];
  var pairs = [["(", ")"], ["«", "»"], ["[", "]"]];
  pairs.forEach(function (p) {
    var o = s.split(p[0]).length - 1, c = s.split(p[1]).length - 1;
    if (o !== c) errs.push("desbalanceado " + p[0] + p[1]);
  });
  if (s.split("¿").length > s.split("?").length) errs.push("¿ sin ?");
  if ((s.match(/\*\*/g) || []).length % 2) errs.push("** sin cerrar");
  return errs;
}

// un' + maschile / un + femminile che inizia per vocale (solo italiano sicuro)
var NG = {}; bank.nouns.forEach(function (n) { NG[n[0]] = n[1]; });
function elision(u, s) {
  var m, re1 = /\bun'([a-zàèéìòù]+)/gi;
  while ((m = re1.exec(s))) if (NG[m[1].toLowerCase()] === "m") flag(u, "un'+m", "«un'" + m[1] + "» es masculino: «un " + m[1] + "»");
  var re2 = /\bun ([aeiouàèéìòù][a-zàèéìòù]+)/gi;
  while ((m = re2.exec(s))) if (NG[m[1].toLowerCase()] === "f" && !/(^|\s)(es|un arma|un alma|un agua|un aula|un hacha|un ancla)\b/i.test(s)) {
    // solo se la frase sembra italiana
    if (/\b(il|la|di|che|non|è|sono|ho|una)\b/.test(s) && !/\b(el|los|que|de|y|es|está)\b/.test(s)) flag(u, "un+f", "«un " + m[1] + "» es femenino: «un'" + m[1] + "»");
  }
}

/* ------------------------------------------------------------ strutture */
function structure(u) {
  var d = u.data;
  if (u.kind === "esercizio") {
    if (d.accept && d.answer && d.accept.indexOf(d.answer) < 0 && !/\|/.test(d.answer)) flag(u, "answer∉accept", d.answer);
    if (d.options) {
      var n = d.options.filter(function (o) { return Engine.normalise(o) === Engine.normalise(d.answer); }).length;
      if (n !== 1) flag(u, "opciones", "la respuesta aparece " + n + " veces entre las opciones");
      var set = {}; d.options.forEach(function (o) { var k = Engine.normalise(o); if (set[k]) flag(u, "opciones", "opción repetida: " + o); set[k] = 1; });
    }
  }
  // A choice where more than one option counts as right tests nothing.
  function multiRight(q, where) {
    if (!q.options || !q.accept) return;
    var acc = q.accept.map(Engine.normalise);
    var n = q.options.filter(function (o) { return acc.indexOf(Engine.normalise(o)) >= 0; }).length;
    if (n > 1) flag(u, "opciones", where + n + " opciones aceptadas como correctas: " + q.options.join(" / "));
  }
  if (u.kind === "esercizio") multiRight(d, "");
  if (u.kind === "sfida" && d.play) d.play.forEach(function (q) { multiRight(q, (q.label || "") + ": "); });
  if (u.kind === "trova_errore") {
    if (d.wrong === d.right) flag(u, "errore", "wrong = right");
    var tw = D.tokens(d.wrong), tr = D.tokens(d.right);
    D.tokens(d.bad).forEach(function (t) { if (tw.indexOf(t) < 0) flag(u, "errore", "«" + d.bad + "» no está en la frase errada"); });
    if (d.good) D.tokens(d.good).forEach(function (t) { if (tr.indexOf(t) < 0) flag(u, "errore", "«" + d.good + "» no está en la frase correcta"); });
    if (D.diagnose(d.wrong, [d.right]).verdict === "giusto") flag(u, "errore", "la frase errada se acepta como correcta");
  }
  if (u.kind === "frase") {
    d.it.forEach(function (v) { if (D.diagnose(v, d.it).verdict !== "giusto") flag(u, "frase", "variante no aceptada: " + v); });
    var seen = {}; d.it.forEach(function (v) { var k = Engine.normalise(v); if (seen[k]) flag(u, "frase", "variante repetida: " + v); seen[k] = 1; });
  }
}

// Campi che contengono errori voluti o chiavi tecniche: esclusi dal lessico.
function visible(u) {
  var d = u.data;
  if (u.kind === "trova_errore") return { right: d.right, good: d.good, alt: d.alt, why: d.why };
  if (u.kind === "esercizio") {
    // Wrong options are wrong on purpose: only the right answer must be real Italian.
    var c = Object.assign({}, d); delete c.type; delete c.options; return c;
  }
  if (u.kind === "sfida" && d.play) {
    return { consigna: d.consigna, play: d.play.map(function (x) { var y = Object.assign({}, x); delete y.options; delete y.type; delete y.label; return y; }) };
  }
  if (/^testi:/.test(u.id)) return d.filter(function (x) { return !/^[a-z0-9 _-]+$/.test(x.trim()) && !/[<>=]/.test(x) && !/^[A-Z]+[:;]/.test(x.trim()); })
    .map(function (x) { return x.replace(/<[^>]*>/g, " "); });
  if (/^verbi:/.test(u.id)) return d.map(function (v) { return [v[0], v[1]]; });   // aux/isc: codici
  if (/^esit:/.test(u.id)) return d.map(function (r) { return r.slice(1); });   // la chiave è lo spagnolo senza tilde
  return d;
}

units.forEach(function (u) {
  structure(u);
  if (/^coniuga:|^formebanca:/.test(u.id)) return;   // generate: le rivede l'audit umano
  strings(visible(u)).forEach(function (s) {
    var frag = /^testi:/.test(u.id);   // pezzi di stringhe del codice: gli spazi li mette il template
    RULES.forEach(function (r) { if (frag && /espacio/.test(r[1])) return; if (r[0].test(s) && !(r[2] && r[2].test(s))) flag(u, "regla", r[1] + " — " + s.slice(0, 100)); });
    if (!/^testi:/.test(u.id)) balance(s).forEach(function (e) { flag(u, "balance", e + " — " + s.slice(0, 100)); });
    elision(u, s);
    lexCheck(u, s);
  });
});

var ask = Array.from(ALLWORDS).filter(function (w) { return !LEX.has(w) && !WL.has(w); });
var res = cp.spawnSync("python3", [path.join(__dirname, "spell.py")], { input: ask.join("\n"), maxBuffer: 64 << 20 });
if (res.status !== 0) { console.error(String(res.stderr)); process.exit(2); }
UNKNOWN = new Set(String(res.stdout).split("\n").filter(Boolean));
// Only one contrast language: Spanish.  English-only words are flagged, except
// the loanwords Italian really uses (tools/it/audit/prestiti.txt).
var LOANS = new Set();
var lf = path.join(__dirname, "prestiti.txt");
if (fs.existsSync(lf)) fs.readFileSync(lf, "utf8").split("\n").forEach(function (l) {
  l = l.replace(/#.*/, "").trim().toLowerCase(); if (l) LOANS.add(l);
});
var resEn = cp.spawnSync("python3", [path.join(__dirname, "spell.py"), "--english"],
  { input: Array.from(ALLWORDS).filter(function (w) { return !LEX.has(w) && !LOANS.has(w); }).join("\n"), maxBuffer: 64 << 20 });
var ENONLY = new Set(String(resEn.stdout).split("\n").filter(Boolean));
var english = {};
lexQueue.forEach(function (x) {
  (x[1].match(/[A-Za-zÀ-ÖØ-öø-ÿ]+/g) || []).forEach(function (w) {
    w = w.toLowerCase();
    if (!ENONLY.has(w) || WL.has(w)) return;
    var e = english[x[0].id] || (english[x[0].id] = { u: x[0], w: {} , s: x[1] });
    e.w[w] = 1;
  });
});
Object.keys(english).forEach(function (id) {
  var e = english[id];
  flag(e.u, "inglés", Object.keys(e.w).join(", ") + " — " + e.s.slice(0, 110));
});
lexQueue.forEach(function (x) { lexCheckNow(x[0], x[1]); });

Object.keys(unknown).sort().forEach(function (w) {
  problems.push({ id: unknown[w].ex[0].split(":").slice(0, 2).join(":"), rule: "lessico", msg: w + " ×" + unknown[w].n + " — " + unknown[w].ex.join(" | ") });
});

fs.writeFileSync(path.join(OUT, "lint.json"), JSON.stringify(problems, null, 1));
var by = {}; problems.forEach(function (p) { by[p.rule] = (by[p.rule] || 0) + 1; });
console.log("problemi: " + problems.length + "  " + JSON.stringify(by));
process.exit(problems.length ? 1 : 0);
