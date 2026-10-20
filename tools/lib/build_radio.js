#!/usr/bin/env node
/*
 * Arma docs/lang/<código>/radio_data.js (window.RADIO_DATA) con la serie de
 * escucha «Radio» / «Rádio» de las semanas 6-25 (sin los jefes, 13 y 26):
 * tools/<código>/radio/serie.json (el nombre, los personajes, las etiquetas
 * de «¿lo dice o no lo dice?») y tools/<código>/radio/wNN.json (un episodio:
 * un programa de radio a dos voces con la gramática y las palabras de su
 * semana, tres preguntas, dos o tres «¿lo dice?» y las glosas).
 *
 * A cada episodio le suma lo que se deduce de la semana: en qué lengua van
 * las preguntas (castellano hasta la 13, la lengua meta desde la 14,
 * serie.metaFrom) y las etiquetas de «¿lo dice?» en esa lengua.  Lo usan
 * js/radio.js (misiones, lista en Leggi) y js/tramo.js (el reproductor);
 * lo controlan tools/lib/test_radio.js y tools/<código>/check_radio.py.
 *
 *   node tools/lib/build_radio.js          los dos idiomas
 *   node tools/lib/build_radio.js it       uno
 */
"use strict";
var fs = require("fs"), path = require("path");
var ROOT = path.join(__dirname, "..", "..");

function read(code) {
  var dir = path.join(ROOT, "tools", code, "radio");
  var serie = JSON.parse(fs.readFileSync(path.join(dir, "serie.json"), "utf8"));
  var eps = fs.readdirSync(dir).filter(function (f) { return /^w\d\d\.json$/.test(f); }).sort()
    .map(function (f) { return JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")); });
  return { serie: serie, eps: eps };
}

function compile(code) {
  var src = read(code), S = src.serie;
  var episodes = src.eps.map(function (e) {
    var meta = e.week >= S.metaFrom, lab = meta ? S.info.meta : S.info.es;
    var out = {};
    Object.keys(e).forEach(function (k) { out[k] = e[k]; });
    out.qlang = meta ? code : "es";
    out.infoPrompt = lab.prompt;
    out.infoYes = lab.yes;
    out.infoNo = lab.no;
    return out;
  });
  return { name: S.name, label: S.label, blurb: S.blurb, metaFrom: S.metaFrom, criterion: S.criterion,
           personaggi: S.personaggi, EPISODI: episodes };
}

function build(code) {
  var data = compile(code);
  var out = "/* Serie «" + data.label + "»: generado por tools/lib/build_radio.js a partir de tools/" + code + "/radio/.\n" +
    "   No editar a mano: editá los JSON de cada semana y corré npm run build. */\n" +
    "(function (root) {\n  \"use strict\";\n  root.RADIO_DATA = " + JSON.stringify(data, null, 1) + ";\n" +
    "  if (typeof module === \"object\" && module.exports) module.exports = root.RADIO_DATA;\n" +
    "})(typeof window !== \"undefined\" ? window : globalThis);\n";
  fs.writeFileSync(path.join(ROOT, "docs", "lang", code, "radio_data.js"), out);
  return data.EPISODI.length;
}

module.exports = { compile: compile, read: read };
if (require.main === module) {
  var codes = process.argv.slice(2);
  if (!codes.length) codes = ["it", "pt"];
  codes.forEach(function (c) { console.log("radio " + c + ": " + build(c) + " episodios"); });
}
