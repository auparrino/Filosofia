/* Lo común de los tests: el contador, ok() y el cierre con código de error.
 *
 *   var T = require("../lib/testkit.js")("pt"), ok = T.ok;
 *   ok(cond, "qué se esperaba");      // cuenta; si falla, «FAIL qué se esperaba»
 *   T.eq(got, want, "qué");           // igualdad (JSON), con lo que dio y lo que se esperaba
 *   T.done();                          // «controles: N   errores: M   (1,2 s)» y exit 1 si falló algo
 *
 * El resumen sale en la lengua del idioma que se prueba (controlli / errori
 * en italiano), como antes de que cada test tuviera su propia copia.
 */
"use strict";

module.exports = function testkit(code) {
  var t0 = Date.now();
  var T = { checks: 0, fails: 0 };
  T.ok = function (cond, what) {
    T.checks++;
    if (!cond) { T.fails++; console.log("FAIL " + what); }
    return !!cond;
  };
  T.eq = function (got, want, what) {
    var a = JSON.stringify(got), b = JSON.stringify(want);
    return T.ok(a === b, what + ": dio " + a + ", se esperaba " + b);
  };
  T.summary = function () {
    var secs = ((Date.now() - t0) / 1000).toFixed(1).replace(".", ",");
    return (code === "it" ? "controlli: " : "controles: ") + T.checks +
      (code === "it" ? "   errori: " : "   errores: ") + T.fails + "   (" + secs + " s)";
  };
  // extra: what to print before the summary (a blank line, as the tests did)
  T.done = function (lead) {
    console.log((lead == null ? "\n" : lead) + T.summary());
    process.exit(T.fails ? 1 : 0);
  };
  return T;
};
