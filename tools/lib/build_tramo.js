#!/usr/bin/env node
/*
 * Arma docs/lang/<código>/tramo_data.js (window.TRAMO_DATA) con el tramo C1
 * de cada idioma: tools/<código>/tramo/generi.json (la serie, los géneros de
 * la tarea y sus marcas, los conectores, y ADEQ: los criterios de adequação
 * de la revisión local, si el idioma los tiene), tools/<código>/tramo/fichas.json
 * (opcional: las fichas de cada género, que van a GENRES[g].ficha; cellStop,
 * opcional, las palabras que no cuentan en la tabla de la escucha corta) y
 * tools/<código>/tramo/wNN.json (una semana: lectura larga, escucha larga,
 * tarea integrada).  Lo usan
 * js/letture.js (la serie «lunga») y js/tramo.js; lo controla
 * tools/lib/test_tramo.js.
 *
 *   node tools/lib/build_tramo.js          los dos idiomas
 *   node tools/lib/build_tramo.js it       uno
 */
"use strict";
var fs = require("fs"), path = require("path");
var ROOT = path.join(__dirname, "..", "..");

function build(code) {
  var dir = path.join(ROOT, "tools", code, "tramo");
  var base = JSON.parse(fs.readFileSync(path.join(dir, "generi.json"), "utf8"));
  var weeks = fs.readdirSync(dir).filter(function (f) { return /^w\d\d\.json$/.test(f); }).sort()
    .map(function (f) { return JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")); });
  var fp = path.join(dir, "fichas.json");
  if (fs.existsSync(fp)) {
    var fichas = JSON.parse(fs.readFileSync(fp, "utf8"));
    Object.keys(fichas).forEach(function (g) { if (base.GENRES[g]) base.GENRES[g].ficha = fichas[g]; });
  }
  var data = { series: base.series, names: base.names, GENRES: base.GENRES, CONNETTIVI: base.CONNETTIVI, SETTIMANE: weeks };
  if (base.ADEQ) data.ADEQ = base.ADEQ;
  if (base.cellStop) data.cellStop = base.cellStop;
  var out = "/* Tramo C1: generado por tools/lib/build_tramo.js a partir de tools/" + code + "/tramo/.\n" +
    "   No editar a mano: editá los JSON de cada semana y corré npm run build. */\n" +
    "(function (root) {\n  \"use strict\";\n  root.TRAMO_DATA = " + JSON.stringify(data, null, 1) + ";\n" +
    "  if (typeof module === \"object\" && module.exports) module.exports = root.TRAMO_DATA;\n" +
    "})(typeof window !== \"undefined\" ? window : globalThis);\n";
  fs.writeFileSync(path.join(ROOT, "docs", "lang", code, "tramo_data.js"), out);
  return weeks.length;
}

var codes = process.argv.slice(2);
if (!codes.length) codes = ["it", "pt"];
codes.forEach(function (c) { console.log("tramo " + c + ": " + build(c) + " semanas"); });
