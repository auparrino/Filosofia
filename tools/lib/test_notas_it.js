/*
 * Notas de los ítems del curso (auditoría it 9).  Cada ítem de
 * docs/lang/<código>/data/course.json debería traer una nota que explique la
 * regla (la muestra «🔁 Segunda vez, más fácil» y la devolución), y la nota no
 * debería ser solo una equivalencia («Tener frío = avere freddo.»).
 *
 * Se exige en los dos idiomas: 0 ítems sin nota, 0 notas que son solo una
 * equivalencia, 0 asteriscos sueltos (la cursiva de mk() usa *pares*; una
 * forma incorrecta se marca con «✗», no con un asterisco) y notas de hasta
 * 320 caracteres.
 *
 *   node tools/lib/test_notas_it.js
 */
"use strict";
var pack = require("./pack.js");

// Una nota es «solo equivalencia» si todas sus oraciones son «A = B» cortas,
// sin dos puntos que introduzcan una explicación.
function soloEquivalencia(n) {
  var s = String(n || "").trim();
  if (/^[^=.;:]{1,80}=[^=;:]{1,80}\.?$/.test(s)) return true;
  var parts = s.split(/(?<=[.;?!])\s+|;\s*/).map(function (p) { return p.trim(); }).filter(Boolean);
  if (!parts.length) return false;
  return parts.every(function (p) {
    var eq = p.split("=");
    return eq.length === 2 && p.indexOf(":") < 0 && eq[0].trim().length <= 60 && eq[1].trim().length <= 70;
  });
}

var errores = 0;
function mal(msg) { errores++; console.log("  ✗ " + msg); }

pack.LANGS.forEach(function (code) {
  var ctx = pack(code, { upTo: "drills.js" });      // el paquete carga en node
  if (!ctx.LANG) mal(code + ": el paquete no define LANG");
  var course = pack.data(code, "course.json");
  var items = course.items;
  var sin = items.filter(function (x) { return !String(x.note || "").trim(); });
  var equiv = items.filter(function (x) { return x.note && soloEquivalencia(x.note); });
  var cursiva = items.filter(function (x) {
    // «*palabra*» es cursiva en mk(); un asterisco suelto rompe el formato
    return x.note && (String(x.note).match(/\*/g) || []).length % 2;
  });
  var semanas = {};
  course.weeks.slice(0, 12).forEach(function (w) { w.items.forEach(function (id) { semanas[id] = 1; }); });
  var sinW = sin.filter(function (x) { return semanas[x.id]; }).length;
  var porFuente = {};
  sin.forEach(function (x) { porFuente[x.src] = (porFuente[x.src] || 0) + 1; });
  console.log(code + ": " + items.length + " ítems · sin nota " + sin.length +
              " (semanas 1-12: " + sinW + "/" + Object.keys(semanas).length + ") " + JSON.stringify(porFuente) +
              " · solo equivalencia " + equiv.length + " · asteriscos sueltos " + cursiva.length);
  sin.slice(0, 10).forEach(function (x) { mal(code + ": sin nota " + x.id); });
  if (sin.length > 10) mal(code + ": … y " + (sin.length - 10) + " más sin nota");
  equiv.slice(0, 10).forEach(function (x) { mal(code + ": nota que es solo equivalencia " + x.id + ": " + x.note); });
  if (equiv.length > 10) mal(code + ": … y " + (equiv.length - 10) + " más");
  // Un asterisco suelto rompe la cursiva de mk(): las formas incorrectas se
  // marcan con «✗» (✗ho voglie), nunca con «*».
  cursiva.forEach(function (x) { mal(code + ": asterisco suelto en la nota de " + x.id + ": " + x.note); });
  items.forEach(function (x) {
    if (x.note && x.note.length > 320) mal(code + ": nota demasiado larga (" + x.note.length + ") en " + x.id);
  });
});

console.log(errores ? errores + " errores" : "0 errores");
process.exit(errores ? 1 : 0);
