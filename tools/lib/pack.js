/*
 * Carga un idioma completo (su paquete docs/lang/<código>/ y el núcleo
 * docs/js/) en un contexto de vm, en el mismo orden que el navegador
 * (docs/js/boot.js ORDER), para los tests y la simulación.
 *
 *   var pack = require("../lib/pack.js");
 *   var ctx = pack("pt");            // ctx.Engine, ctx.Drills, ctx.Conj, ctx.LANG…
 *   var ctx = pack("it", { upTo: "drills.js" });   // sin app.js
 *   pack.data("pt", "course.json")   // docs/lang/pt/data/course.json, parseado
 *
 * Por defecto no carga app.js (necesita el DOM).  opts.extra agrega globals
 * al contexto (localStorage, Date simulado…).
 */
"use strict";
var fs = require("fs"), path = require("path"), vm = require("vm");

var ROOT = path.join(__dirname, "..", "..");
var DOCS = path.join(ROOT, "docs");
var Boot = require(path.join(DOCS, "js", "boot.js"));

function file(entry, code) {
  return path.join(DOCS, Boot.src(entry, code));
}

function pack(code, opts) {
  opts = opts || {};
  if (!Boot.LANGS[code]) throw new Error("idioma desconocido: " + code);
  var ctx = { console: console, Math: Math, Date: Date, JSON: JSON, Object: Object, Array: Array,
              String: String, Number: Number, RegExp: RegExp, Error: Error, TypeError: TypeError,
              parseInt: parseInt, parseFloat: parseFloat, isNaN: isNaN, isFinite: isFinite,
              Infinity: Infinity, NaN: NaN, undefined: undefined, Symbol: Symbol, Map: Map, Set: Set,
              Promise: Promise, setTimeout: setTimeout, clearTimeout: clearTimeout,
              encodeURIComponent: encodeURIComponent, decodeURIComponent: decodeURIComponent,
              localStorage: null, navigator: {}, document: null };
  Object.keys(opts.extra || {}).forEach(function (k) { ctx[k] = opts.extra[k]; });
  ctx.window = ctx; ctx.self = ctx; ctx.globalThis = ctx;
  vm.createContext(ctx);
  var stop = opts.upTo || "app.js";
  for (var i = 0; i < Boot.ORDER.length; i++) {
    var e = Boot.ORDER[i], name = e.lang || e.core || e.shared;
    if (name === stop && !opts.includeStop) break;
    if (!Boot.has(e, code)) continue;          // a file the package does not have yet
    var f = file(e, code);
    if (!fs.existsSync(f)) {
      if (opts.strict) throw new Error("falta " + path.relative(ROOT, f));
      continue;
    }
    vm.runInContext(fs.readFileSync(f, "utf8"), ctx, { filename: path.relative(ROOT, f) });
    if (name === stop) break;
  }
  return ctx;
}

pack.ROOT = ROOT;
pack.DOCS = DOCS;
// The complete languages (every file of the package): what the tests of
// the core go through.  ALL adds the ones that are starting (Boot.LANGS
// with «missing»: German), which have their own tests (tools/de/).
pack.ALL = Object.keys(Boot.LANGS);
pack.LANGS = pack.ALL.filter(function (c) { return !(Boot.LANGS[c].missing || []).length; });
pack.langDir = function (code) { return path.join(DOCS, "lang", code); };
pack.dataPath = function (code, name) { return path.join(DOCS, "lang", code, "data", name); };
pack.data = function (code, name) { return JSON.parse(fs.readFileSync(pack.dataPath(code, name), "utf8")); };
pack.file = file;

module.exports = pack;
