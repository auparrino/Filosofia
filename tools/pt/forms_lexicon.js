#!/usr/bin/env node
/*
 * Léxico de formas verbales, para el sílabo.
 *
 * Conjuga todos los verbos del conjugador más los regulares del banco e
 * imprime en JSON qué tiempo puede expresar cada forma.  tools/sillabo.py lo
 * usa para saber qué tiempos aparecen en un ejercicio y, por lo tanto, desde
 * qué semana se lo puede proponer.
 *
 *   node tools/forms_lexicon.js > lexico.json
 *
 * Salida:
 *   simple:      forma → [tiempos simples]  (falamos → presente, perfeito)
 *   participles: participio (con sus 4 terminaciones: feito/feita/feitos/
 *                feitas; entregue/entregues) → [infinitivos]
 *   aux:         forma de ter/haver/ser/estar/ir → ["verbo:tiempo"], para
 *                reconocer tiempos compuestos (tinha feito), pasiva (foi
 *                feito), estar + gerúndio e ir + infinitivo
 *   lemmas:      cualquier forma → [infinitivos]
 *   gerunds:     [gerúndios]
 *   imperatives: [formas afirmativas del imperativo, sin el clítico]
 *   irrPres:     [formas del presente que no siguen la regla]
 * Los reflexivos se indexan sin el pronombre (me levanto → levanto).
 */
"use strict";
var path = require("path");
var fs = require("fs");
var Conj = require(path.join(__dirname, "..", "..", "docs", "lang", "pt", "conjugator.js"));

// The bank is optional: verbs are [inf, es, …, irregular?, …] as in the
// Italian bank (v[4] = irregular).  Only Portuguese infinitives register.
var bank = { verbs: [] };
try {
  bank = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "docs", "lang", "pt", "data", "bank.json"), "utf8"));
} catch (e) { /* sin banco */ }
var bankVerbs = (bank.verbs || []).filter(function (v) { return Array.isArray(v) && typeof v[0] === "string"; });
bankVerbs.forEach(function (v) {
  if (!v[4]) Conj.register(v[0], { es: v[1] });
});

var simple = {};        // forma -> [tiempos]
var participles = {};   // participio -> [infinitivos]
var gerunds = {};
var imperatives = {};
var aux = {};           // formas de ter/haver/ser/estar/ir -> [verbo:tiempo]
var lemmas = {};        // cualquier forma -> [infinitivo]
var irrPres = {};       // presente irregular (faço, durmo): semana 6

var AUX = { ter: 1, haver: 1, ser: 1, estar: 1, ir: 1 };

function add(map, form, val) {
  if (!form) return;
  form = form.toLowerCase();
  if (!map[form]) map[form] = [];
  if (map[form].indexOf(val) < 0) map[form].push(val);
}
function lastWord(f) { return f.split(" ").pop(); }
function bareImperative(f) { return lastWord(f).replace(/-(me|te|se|nos|vos)$/, ""); }

// feito → feito, feita, feitos, feitas; entregue → entregue, entregues
function agreeing(pp) {
  if (/o$/.test(pp)) { var r = pp.slice(0, -1); return [pp, r + "a", r + "os", r + "as"]; }
  if (/e$/.test(pp)) return [pp, pp + "s"];
  return [pp];
}

function indexParticiples(inf) {
  var ps = Conj.participles(inf);
  [ps.regular, ps.irregular].forEach(function (pp) {
    if (!pp) return;
    agreeing(pp).forEach(function (f) { add(participles, f, inf); add(lemmas, f, inf); });
  });
}

Conj.list().forEach(function (inf) {
  Conj.SIMPLE_TENSES.forEach(function (t) {
    var forms;
    try { forms = Conj.conjugate(inf, t, { partial: true }); } catch (e) { return; }
    forms.forEach(function (f) {
      if (!f) return;
      add(simple, lastWord(f), t);
      add(lemmas, lastWord(f), inf);
      if (AUX[inf]) add(aux, f, inf + ":" + t);
    });
  });
  try {
    var reg = Conj.regular(inf, "presente"), pres = Conj.conjugate(inf, "presente", { partial: true });
    pres.forEach(function (f, i) {
      if (!f) return;
      var w = lastWord(f);
      if (w !== lastWord(reg[i])) irrPres[w.toLowerCase()] = 1;
    });
  } catch (e) { /* no */ }
  try { indexParticiples(inf); } catch (e) { /* sin participio */ }
  try {
    add(gerunds, Conj.gerund(inf), inf);
    add(lemmas, Conj.gerund(inf), inf);
  } catch (e) { /* no */ }
  add(lemmas, inf, inf);
  add(lemmas, inf.replace(/-se$/, ""), inf);

  try {
    var im = Conj.imperative(inf);
    if (im) {
      ["tu", "você", "nós", "vós", "vocês"].forEach(function (k) {
        add(imperatives, bareImperative(im[k]), inf);
        add(lemmas, bareImperative(im[k]), inf);
      });
    }
  } catch (e) { /* no */ }
});

// Irregular verbs of the bank that the conjugator does not describe: their
// regular-looking forms still identify the lemma, only for the lexicon,
// never as tenses.
bankVerbs.forEach(function (v) {
  if (!v[4] || Conj.VERBS[v[0]]) return;
  if (!Conj.register(v[0], { es: v[1] })) return;
  Conj.SIMPLE_TENSES.forEach(function (t) {
    try { Conj.conjugate(v[0], t).forEach(function (f) { add(lemmas, lastWord(f), v[0]); }); } catch (e) { /* no */ }
  });
  try { indexParticiples(v[0]); } catch (e) { /* no */ }
  add(lemmas, v[0], v[0]);
});

process.stdout.write(JSON.stringify({
  simple: simple, participles: participles, aux: aux, lemmas: lemmas,
  gerunds: Object.keys(gerunds), imperatives: Object.keys(imperatives),
  irrPres: Object.keys(irrPres)
}));
