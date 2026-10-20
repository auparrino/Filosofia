#!/usr/bin/env node
/*
 * Lessico delle forme verbali, per il sillabo.
 *
 * Coniuga tutti i verbi del coniugatore più i regolari del banco e stampa in
 * JSON quale tempo può esprimere ogni forma.  tools/sillabo.py lo usa per
 * sapere quali tempi compaiono in un esercizio e quindi da quale settimana
 * in poi lo si può proporre.
 *
 *   node tools/forms_lexicon.js > lessico.json
 */
"use strict";
var path = require("path");
var fs = require("fs");
var Conj = require(path.join(__dirname, "..", "..", "docs", "lang", "it", "conjugator.js"));

var bank = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "docs", "lang", "it", "data", "bank.json"), "utf8"));
bank.verbs.forEach(function (v) {
  if (!v[4]) Conj.register(v[0], { es: v[1], aux: v[2], isc: v[3] });
});
// The irregular verbs of the bank (piovere, succedere, crescere…), described
// in tools/it/verbi_irregolari.js: their tenses count too.
require(path.join(__dirname, "verbi_irregolari.js")).install(Conj, bank.verbs.filter(function (v) { return v[4]; }));

var simple = {};        // forma -> [tempi]
var participles = {};   // participio (4 desinenze) -> [ausiliari]
var gerunds = {};
var imperatives = {};   // solo le forme che non coincidono con altri tempi
var aux = {};           // forme di essere/avere/venire -> [verbo:tempo]
var lemmas = {};        // qualsiasi forma -> [infinito], per il lessico
var irrPres = {};       // presente irregolare (vado, faccio): si impara nella settimana 6

function add(map, form, val) {
  form = form.toLowerCase();
  if (!map[form]) map[form] = [];
  if (map[form].indexOf(val) < 0) map[form].push(val);
}

Conj.list().forEach(function (inf) {
  var info = Conj.info(inf);
  Conj.SIMPLE_TENSES.forEach(function (t) {
    var forms;
    try { forms = Conj.conjugate(inf, t); } catch (e) { return; }
    forms.forEach(function (f) {
      var w = f.split(" ");
      add(simple, w[w.length - 1], t);
      add(lemmas, w[w.length - 1], inf);
      if (inf === "essere" || inf === "avere" || inf === "venire") add(aux, f, inf + ":" + t);
    });
  });
  try {
    var reg = Conj.regular(inf, "presente"), pres = Conj.conjugate(inf, "presente");
    pres.forEach(function (f, i) {
      var w = f.split(" ").pop();
      if (w !== reg[i].split(" ").pop()) irrPres[w.toLowerCase()] = 1;
    });
  } catch (e) { /* no */ }
  try {
    var pp = Conj.participle(inf);
    var ausiliare = info.refl ? "essere" : info.aux;
    ["o", "a", "i", "e"].forEach(function (e) {
      // «both» (piovere, crescere, vivere): è piovuto and ha piovuto
      (ausiliare === "both" ? ["essere", "avere"] : [ausiliare]).forEach(function (a) {
        add(participles, pp.replace(/[oaie]$/, e), a);
      });
      add(lemmas, pp.replace(/[oaie]$/, e), inf);
    });
  } catch (e) { /* senza participio */ }
  try {
    add(gerunds, Conj.gerund(inf).replace(/si$/, ""), inf);
    add(lemmas, Conj.gerund(inf).replace(/si$/, ""), inf);
  } catch (e) { /* no */ }
  add(lemmas, inf, inf);
  add(lemmas, inf.replace(/rsi$/, "re"), inf);
  add(lemmas, inf.replace(/rsi$/, "r").replace(/re$/, "r"), inf);   // tronco: far, dir

  try {
    var im = Conj.imperative(inf);
    if (im) {
      add(imperatives, im.tu.split(" ").pop(), inf);
      ["tu", "Lei", "noi", "voi"].forEach(function (k) { add(lemmas, im[k].split(" ").pop(), inf); });
    }
  } catch (e) { /* no */ }
});

// Irregular verbs of the bank that the conjugator does not describe: their
// regular-looking forms still identify the lemma (cadere → caduto, cadrà),
// only for the lexicon, never as tenses.
bank.verbs.forEach(function (v) {
  if (!v[4] || Conj.VERBS[v[0]]) return;
  if (!Conj.register(v[0], { es: v[1], aux: v[2], isc: v[3] })) return;
  Conj.SIMPLE_TENSES.forEach(function (t) {
    try { Conj.conjugate(v[0], t).forEach(function (f) { add(lemmas, f.split(" ").pop(), v[0]); }); } catch (e) { /* no */ }
  });
  try {
    var pp = Conj.participle(v[0]);
    ["o", "a", "i", "e"].forEach(function (e) { add(lemmas, pp.replace(/[oaie]$/, e), v[0]); });
  } catch (e) { /* no */ }
  add(lemmas, v[0], v[0]);
});

process.stdout.write(JSON.stringify({
  simple: simple, participles: participles, aux: aux, lemmas: lemmas,
  gerunds: Object.keys(gerunds), imperatives: Object.keys(imperatives),
  irrPres: Object.keys(irrPres)
}));
