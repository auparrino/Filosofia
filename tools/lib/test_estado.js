/* El guardado resiste campos de módulos con el tipo equivocado (una copia
   rota, una versión vieja): el campo se descarta y el módulo lo arma de
   nuevo, la app no se queda sin pantalla.  Y el guardado lleva su versión.
   Run: node tools/lib/test_estado.js */
"use strict";
var pack = require("./pack.js");
var T = require("./testkit.js")("lib");
["it", "pt"].forEach(function (code) {
  var E = pack(code, { upTo: "app.js" }).Engine;
  var s = E.fromRaw({ xp: 10, cards: {} });
  T.ok(s.v === E.SAVE_V && E.SAVE_V >= 3, code + ": el guardado lleva su versión (" + s.v + ")");
  var bad = ["texto", 7, true];
  E.MODULE_OBJ.forEach(function (k) {
    bad.concat([[1, 2]]).forEach(function (v) {
      var o = { xp: 1, cards: {} }; o[k] = v;
      var r = E.fromRaw(JSON.parse(JSON.stringify(o)));
      T.ok(!(k in r) || r[k] == null || (typeof r[k] === "object" && !Array.isArray(r[k])), code + ": " + k + " = " + JSON.stringify(v) + " se descarta");
    });
    var good = { xp: 1, cards: {} }; good[k] = { a: 1 };
    T.ok(E.fromRaw(good)[k] && E.fromRaw({ xp: 1, cards: {}, [k]: { a: 1 } })[k].a === 1, code + ": " + k + " bien formado se conserva");
  });
  E.MODULE_ARR.forEach(function (k) {
    bad.concat([{ a: 1 }]).forEach(function (v) {
      var o = { xp: 1, cards: {} }; o[k] = v;
      var r = E.fromRaw(o);
      T.ok(!(k in r) || Array.isArray(r[k]), code + ": " + k + " = " + JSON.stringify(v) + " se descarta");
    });
  });
  T.ok(E.fromRaw({ xp: 1, cards: {}, ideal: "viajar" }).ideal === "viajar", code + ": los campos base conservan sus reglas (ideal como texto)");
});
T.done();
