#!/usr/bin/env node
/* Tablero de cobertura (paso 0.2 de auditorias/PLAN.md): cuánto falta
 * revisar, por idioma y módulo.
 *
 *   npm run cobertura              tabla por idioma y módulo
 *   npm run cobertura -- --resumen solo los totales por idioma
 *   npm run cobertura -- --readme  reescribe el resumen de
 *                                  auditorias/registro/README.md
 *
 * Una unidad cuenta como revisada solo si el hash del registro coincide con
 * el contenido de hoy; si se editó después de revisarla, cuenta como
 * pendiente (aunque el registro todavía no se haya puesto al día).
 *   - «2×»  revisada por dos revisores (o con la disputa resuelta): terminada
 *   - «1×»  revisada una vez
 *   - «disp» en disputa: un tercero tiene que decidir
 *   - «pend» sin revisar
 *   - «abiertos» unidades con algún hallazgo todavía abierto
 */
"use strict";
var fs = require("fs"), path = require("path");
var Inv = require("./inventario.js");

var README = path.join(Inv.REG_DIR, "README.md");
var MARK_A = "<!-- cobertura:inicio -->", MARK_B = "<!-- cobertura:fin -->";

function abierto(e) {
  return (e.hallazgos || []).some(function (h) { return h && h.abierto; });
}

// { mod: { total, dos, uno, disp, pend, abiertos } } de un idioma
function cobertura(code) {
  var inv = Inv.inventory(code), reg = Inv.readRegistry(code), por = {};
  Object.keys(inv).forEach(function (id) {
    var m = inv[id].mod, e = reg[id];
    var c = por[m] || (por[m] = { total: 0, dos: 0, uno: 0, disp: 0, pend: 0, abiertos: 0 });
    c.total++;
    var vigente = e && e.hash === inv[id].hash ? e : null;
    var estado = vigente ? vigente.estado : "pendiente";
    if (estado === "revisada-2") c.dos++;
    else if (estado === "revisada-1") c.uno++;
    else if (estado === "disputa") c.disp++;
    else c.pend++;
    if (vigente && abierto(vigente)) c.abiertos++;
  });
  return por;
}

function suma(por) {
  var t = { total: 0, dos: 0, uno: 0, disp: 0, pend: 0, abiertos: 0 };
  Object.keys(por).forEach(function (m) { Object.keys(t).forEach(function (k) { t[k] += por[m][k]; }); });
  return t;
}

function pct(c) { return c.total ? (100 * c.dos / c.total).toFixed(1).replace(".", ",") + " %" : "—"; }

function fila(nombre, c) {
  return [nombre, c.total, c.dos, c.uno, c.disp, c.pend, c.abiertos, pct(c)];
}

function tabla(code, soloTotal) {
  var por = cobertura(code), filas = [];
  if (!soloTotal) Object.keys(por).sort().forEach(function (m) { filas.push(fila(m, por[m])); });
  filas.push(fila("**total " + code + "**", suma(por)));
  return filas;
}

function markdown(code, soloTotal) {
  var head = ["módulo", "unidades", "2×", "1×", "disp", "pend", "abiertos", "terminado"];
  var rows = [head, head.map(function () { return "---"; })].concat(tabla(code, soloTotal));
  return rows.map(function (r) { return "| " + r.join(" | ") + " |"; }).join("\n");
}

function texto(code, soloTotal) {
  var head = ["módulo", "unidades", "2×", "1×", "disp", "pend", "abiertos", "terminado"];
  var rows = [head].concat(tabla(code, soloTotal)).map(function (r) {
    return r.map(function (x) { return String(x).replace(/\*\*/g, ""); });
  });
  var w = head.map(function (_, i) { return Math.max.apply(null, rows.map(function (r) { return r[i].length; })); });
  return rows.map(function (r) {
    return r.map(function (x, i) { return i === 0 ? x + " ".repeat(w[i] - x.length) : " ".repeat(w[i] - x.length) + x; }).join("  ");
  }).join("\n");
}

// Resumen para pegar en el README del registro (solo totales por idioma).
function resumen() {
  var head = ["idioma", "unidades", "2×", "1×", "disp", "pend", "abiertos", "terminado"];
  var rows = [head, head.map(function () { return "---"; })];
  Inv.LANGS.forEach(function (code) { rows.push(fila(code, suma(cobertura(code)))); });
  return rows.map(function (r) { return "| " + r.join(" | ") + " |"; }).join("\n");
}

function escribirReadme() {
  var txt = fs.readFileSync(README, "utf8");
  var a = txt.indexOf(MARK_A), b = txt.indexOf(MARK_B);
  if (a < 0 || b < a) throw new Error("faltan las marcas " + MARK_A + " / " + MARK_B + " en " + README);
  var por = Inv.LANGS.map(function (code) {
    return "<details><summary>" + code + " por módulo</summary>\n\n" + markdown(code) + "\n\n</details>";
  }).join("\n\n");
  var nuevo = txt.slice(0, a + MARK_A.length) + "\n\n" + resumen() + "\n\n" + por + "\n\n" + txt.slice(b);
  fs.writeFileSync(README, nuevo);
}

module.exports = { cobertura: cobertura, suma: suma, resumen: resumen, markdown: markdown, texto: texto };

if (require.main === module) {
  var args = process.argv.slice(2);
  if (args.indexOf("--readme") >= 0) { escribirReadme(); console.log("actualizado " + path.relative(process.cwd(), README)); }
  else {
    var solo = args.indexOf("--resumen") >= 0;
    var langs = args.filter(function (a) { return Inv.LANGS.indexOf(a) >= 0; });
    (langs.length ? langs : Inv.LANGS).forEach(function (code) { console.log(texto(code, solo) + "\n"); });
  }
}
