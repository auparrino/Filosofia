#!/usr/bin/env node
/*
 * I verbi irregolari del banco che il coniugatore non descrive.
 *
 * El banco tiene 636 verbos; 152 son irregulares (piovere, succedere,
 * crescere, scendere, correggere…) y el conjugador de la app no los trae, así
 * que el léxico de formas (forms_lexicon.js) no reconocía «pioverà», «è
 * successo» ni «è cresciuto» y el sillabo daba esas oraciones por de la
 * semana 1.  Acá se describen con el mismo formato que docs/lang/it/
 * conjugator.js (pp, prStem, futStem, pres, cong…), casi siempre como un
 * derivado de un verbo que ya existe: sorprendere = sor + prendere,
 * mantenere = man + tenere, produrre = pro + (tra)durre.
 *
 * Solo para las herramientas: no se agregan al conjugador de la app (el
 * gimnasio de conjugación sigue con sus verbos).
 *
 *   require("./verbi_irregolari").install(Conj, bankVerbs)
 *     → la lista de infinitivos que registró en Conj.VERBS
 */
"use strict";

// Bases that are not verbs of the bank or of the conjugator, only families.
var BASES = {
  durre: { pp: "dotto", ger: "ducendo", impStem: "duce", futStem: "durr", congImpStem: "duce",
           prRegStem: "duc", prStem: "duss",
           pres: ["duco", "duci", "duce", "duciamo", "ducete", "ducono"],
           cong: ["duca", "duca", "duca", "duciamo", "duciate", "ducano"] },
  parire: { pp: "parso", prStem: "pars",
            pres: ["paio", "pari", "pare", "pariamo", "parite", "paiono"],
            cong: ["paia", "paia", "paia", "pariamo", "pariate", "paiano"] },
  cludere: { pp: "cluso", prStem: "clus" },
  fondere: { pp: "fuso", prStem: "fus" },
  volgere: { pp: "volto", prStem: "vols" },
  pendere: { pp: "peso", prStem: "pes" },
  tendere: { pp: "teso", prStem: "tes" },
  fendere: { pp: "feso", prStem: "fes" },
  stringere: { pp: "stretto", prStem: "strins" },
  giungere: { pp: "giunto", prStem: "giuns" },
  muovere: { pp: "mosso", prStem: "moss" },
  piangere: { pp: "pianto", prStem: "pians" },
  assumere: { pp: "assunto", prStem: "assuns" },
  dividere: { pp: "diviso", prStem: "divis" },
  cadere: { pp: "caduto", futStem: "cadr", prStem: "cadd" },
  sistere: { pp: "sistito" }
};

// Each verb: its own description, or [prefix, base] (base: a verb of the
// conjugator, of this table or of BASES).
var SPEC = {
  accendere: { pp: "acceso", prStem: "acces" },
  cuocere: { pp: "cotto", prStem: "coss",
             pres: ["cuocio", "cuoci", "cuoce", "cuociamo", "cuocete", "cuociono"],
             cong: ["cuocia", "cuocia", "cuocia", "cuociamo", "cuociate", "cuociano"] },
  muovere: ["", "muovere"],
  piangere: ["", "piangere"],
  spendere: ["s", "pendere"],
  succedere: { pp: "successo", prStem: "success" },
  dipendere: ["di", "pendere"],
  discutere: { pp: "discusso", prStem: "discuss" },
  esprimere: { pp: "espresso", prStem: "espress" },
  proteggere: { pp: "protetto", prStem: "protess" },
  raggiungere: ["rag", "giungere"],
  dipingere: { pp: "dipinto", prStem: "dipins" },
  spingere: { pp: "spinto", prStem: "spins" },
  piovere: { prStem: "piovv" },
  valere: { pp: "valso", futStem: "varr", prStem: "vals",
            pres: ["valgo", "vali", "vale", "valiamo", "valete", "valgono"],
            cong: ["valga", "valga", "valga", "valiamo", "valiate", "valgano"] },
  cadere: ["", "cadere"],
  crescere: { pp: "cresciuto", prStem: "crebb" },
  sorridere: ["sor", "ridere"],
  uccidere: { pp: "ucciso", prStem: "uccis" },
  mordere: { pp: "morso", prStem: "mors" },
  nascondere: { pp: "nascosto", prStem: "nascos" },
  condurre: ["con", "durre"],
  produrre: ["pro", "durre"],
  introdurre: ["intro", "durre"],
  ridurre: ["ri", "durre"],
  dirigere: { pp: "diretto", prStem: "diress" },
  correggere: { pp: "corretto", prStem: "corress" },
  eleggere: { pp: "eletto", prStem: "eless" },
  friggere: { pp: "fritto", prStem: "friss" },
  giungere: ["", "giungere"],
  mantenere: ["man", "tenere"],
  ottenere: ["ot", "tenere"],
  sostenere: ["sos", "tenere"],
  contenere: ["con", "tenere"],
  appartenere: ["appar", "tenere"],
  trattenere: ["trat", "tenere"],
  apparire: ["ap", "parire"],
  comparire: ["com", "parire"],
  scomparire: ["scom", "parire"],
  riempire: { pp: "riempito", ger: "riempiendo", impStem: "riempi", futStem: "riempir",
              congImpStem: "riempi",
              pres: ["riempio", "riempi", "riempie", "riempiamo", "riempite", "riempiono"],
              cong: ["riempia", "riempia", "riempia", "riempiamo", "riempiate", "riempiano"],
              pr: ["riempii", "riempisti", "riempì", "riempimmo", "riempiste", "riempirono"] },
  soddisfare: ["soddis", "fare"],
  scendere: { pp: "sceso", prStem: "sces" },
  rendere: { pp: "reso", prStem: "res" },
  sorprendere: ["sor", "prendere"],
  comprendere: ["com", "prendere"],
  riprendere: ["ri", "prendere"],
  apprendere: ["ap", "prendere"],
  promettere: ["pro", "mettere"],
  permettere: ["per", "mettere"],
  ammettere: ["am", "mettere"],
  smettere: ["s", "mettere"],
  trasmettere: ["tras", "mettere"],
  commettere: ["com", "mettere"],
  scommettere: ["scom", "mettere"],
  mettersi: ["", "mettere"],
  descrivere: ["de", "scrivere"],
  iscriversi: ["i", "scrivere"],
  convincere: ["con", "vincere"],
  riconoscere: ["ri", "conoscere"],
  dividere: ["", "dividere"],
  condividere: ["con", "dividere"],
  concludere: ["con", "cludere"],
  includere: ["in", "cludere"],
  escludere: ["es", "cludere"],
  interrompere: ["inter", "rompere"],
  attendere: ["at", "tendere"],
  difendere: ["di", "fendere"],
  offendere: ["of", "fendere"],
  stendere: ["s", "tendere"],
  tendere: ["", "tendere"],
  pretendere: ["pre", "tendere"],
  intendere: ["in", "tendere"],
  estendere: ["es", "tendere"],
  aggiungere: ["ag", "giungere"],
  fingere: { pp: "finto", prStem: "fins" },
  stringere: ["", "stringere"],
  costringere: ["co", "stringere"],
  rivolgersi: ["ri", "volgere"],
  svolgere: ["s", "volgere"],
  coinvolgere: ["coin", "volgere"],
  sconvolgere: ["scon", "volgere"],
  sciogliere: { pp: "sciolto", prStem: "sciols",
                pres: ["sciolgo", "sciogli", "scioglie", "sciogliamo", "sciogliete", "sciolgono"],
                cong: ["sciolga", "sciolga", "sciolga", "sciogliamo", "sciogliate", "sciolgano"] },
  raccogliere: ["rac", "cogliere"],
  accogliere: ["ac", "cogliere"],
  sorgere: { pp: "sorto", prStem: "sors" },
  emergere: { pp: "emerso", prStem: "emers" },
  assumere: ["", "assumere"],
  riassumere: ["ri", "assumere"],
  persuadere: { pp: "persuaso", prStem: "persuas" },
  invadere: { pp: "invaso", prStem: "invas" },
  evadere: { pp: "evaso", prStem: "evas" },
  radersi: { pp: "raso", prStem: "ras" },
  accadere: ["ac", "cadere"],
  scadere: ["s", "cadere"],
  sopravvivere: ["soprav", "vivere"],
  convivere: ["con", "vivere"],
  avvenire: ["av", "venire"],
  convenire: ["con", "venire"],
  intervenire: ["inter", "venire"],
  prevenire: ["pre", "venire"],
  svenire: ["s", "venire"],
  provenire: ["pro", "venire"],
  contraddire: ["contrad", "dire"],
  disfare: ["dis", "fare"],
  rifare: ["ri", "fare"],
  compiere: { pp: "compiuto", ger: "compiendo", impStem: "compi", futStem: "compir",
              congImpStem: "compi",
              pres: ["compio", "compi", "compie", "compiamo", "compite", "compiono"],
              cong: ["compia", "compia", "compia", "compiamo", "compiate", "compiano"],
              pr: ["compii", "compisti", "compì", "compimmo", "compiste", "compirono"] },
  tacere: { pp: "taciuto", prStem: "tacqu",
            pres: ["taccio", "taci", "tace", "tacciamo", "tacete", "tacciono"],
            cong: ["taccia", "taccia", "taccia", "tacciamo", "tacciate", "tacciano"] },
  dispiacere: ["dis", "piacere"],
  possedere: ["pos", "sedere"],
  distruggere: { pp: "distrutto", prStem: "distruss" },
  proporre: ["pro", "porre"],
  comporre: ["com", "porre"],
  imporre: ["im", "porre"],
  supporre: ["sup", "porre"],
  esporre: ["es", "porre"],
  disporre: ["dis", "porre"],
  opporre: ["op", "porre"],
  attrarre: ["at", "trarre"],
  distrarre: ["dis", "trarre"],
  sottrarre: ["sot", "trarre"],
  concedere: { pp: "concesso", prStem: "conces" },
  percorrere: ["per", "correre"],
  trascorrere: ["tras", "correre"],
  soccorrere: ["soc", "correre"],
  occorrere: ["oc", "correre"],
  promuovere: ["pro", "muovere"],
  commuovere: ["com", "muovere"],
  rimuovere: ["ri", "muovere"],
  rimpiangere: ["rim", "piangere"],
  pungere: { pp: "punto", prStem: "puns" },
  confondere: ["con", "fondere"],
  diffondere: ["dif", "fondere"],
  corrispondere: ["cor", "rispondere"],
  espandere: { pp: "espanso", prStem: "espans" },
  sospendere: ["so", "spendere"],
  appendere: ["ap", "pendere"],
  sedersi: ["", "sedere"],
  risolvere: { pp: "risolto", prStem: "risols" },
  distinguere: { pp: "distinto", prStem: "distins" },
  prevedere: ["pre", "vedere"],
  godere: { futStem: "godr" },
  sciare: { futStem: "scier",
            pres: ["scio", "scii", "scia", "sciamo", "sciate", "sciano"],
            cong: ["scii", "scii", "scii", "sciamo", "sciate", "scino"] },
  esistere: ["e", "sistere"],
  insistere: ["in", "sistere"],
  resistere: ["re", "sistere"],
  assistere: ["as", "sistere"],
  consistere: ["con", "sistere"],
  cucire: { pres: ["cucio", "cuci", "cuce", "cuciamo", "cucite", "cuciono"],
            cong: ["cucia", "cucia", "cucia", "cuciamo", "cuciate", "cuciano"] }
};

// The same forms as another verb: volerci is volere with «ci».
var SAME = { volerci: "volere", metterci: "mettere", farcela: "fare", andarsene: "andare" };

// A special tu-imperative the prefix would get wrong.
var IMPV = { contraddire: { tu: "contraddici" }, soddisfare: { tu: "soddisfa'" },
             rifare: { tu: "rifai" }, disfare: { tu: "disfai" } };

var FIELDS = ["pp", "ger", "impStem", "futStem", "congImpStem", "prRegStem", "prStem"];
var LISTS = ["pres", "cong", "imp", "pr"];

function prefixed(pre, spec) {
  var out = {};
  FIELDS.forEach(function (k) { if (spec[k]) out[k] = pre + spec[k]; });
  LISTS.forEach(function (k) { if (spec[k]) out[k] = spec[k].map(function (f) { return pre + f; }); });
  if (spec.impv) {
    out.impv = {};
    Object.keys(spec.impv).forEach(function (k) { out.impv[k] = pre + spec.impv[k]; });
  }
  if (spec.noImpv) out.noImpv = true;
  return out;
}

function resolve(Conj, inf, seen) {
  var s = SPEC[inf];
  if (!s) return null;
  if (!Array.isArray(s)) return s;
  seen = seen || {};
  if (seen[inf]) return null;
  seen[inf] = true;
  var base = s[1];
  var b = BASES[base] || (SPEC[base] && base !== inf ? resolve(Conj, base, seen) : null) ||
    (Conj.VERBS[base] || null);
  if (!b && base === inf) b = BASES[base];
  if (!b) return null;
  return prefixed(s[0], b);
}

function install(Conj, bankVerbs) {
  var done = [];
  (bankVerbs || []).forEach(function (v) {
    var inf = v[0];
    if (Conj.VERBS[inf] || SAME[inf]) return;
    var spec = resolve(Conj, inf);
    if (!spec) return;
    var entry = { es: v[1] || "", aux: v[2] || "avere", isc: !!v[3] };
    Object.keys(spec).forEach(function (k) { entry[k] = spec[k]; });
    if (IMPV[inf]) entry.impv = IMPV[inf];
    if (/rsi$/.test(inf)) entry.refl = true;
    Conj.VERBS[inf] = entry;
    done.push(inf);
  });
  return done;
}

module.exports = { install: install, SPEC: SPEC, SAME: SAME, BASES: BASES };
