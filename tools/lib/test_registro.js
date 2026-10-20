/* El registro de la auditoría (auditorias/registro/<código>.json) está al día
   con el inventario de lo revisable (tools/audit/inventario.js):
   - toda unidad del inventario está en el registro (lo nuevo entra como
     pendiente) y no hay ids huérfanos (unidades que ya no existen);
   - una unidad revisada tiene el hash del contenido de hoy: si se editó
     después de revisarla, vuelve a pendiente;
   - los estados son los del plan y el inventario es estable (dos corridas
     dan lo mismo, sin ids repetidos ni raros).
   Si falla: node tools/audit/inventario.js --sync y commitear el registro.
   Run: node tools/lib/test_registro.js */
"use strict";
var Inv = require("../audit/inventario.js");
var Cob = require("../audit/cobertura.js");
var T = require("./testkit.js")("es"), ok = T.ok;

function muestra(l) { return l.slice(0, 5).join(", ") + (l.length > 5 ? " … (+" + (l.length - 5) + ")" : ""); }

Inv.LANGS.forEach(function (code) {
  var inv = Inv.inventory(code), ids = Object.keys(inv);
  ok(ids.length > 0, code + ": el inventario no está vacío");
  ok(JSON.stringify(inv) === JSON.stringify(Inv.inventory(code)), code + ": el inventario no es estable entre corridas");
  ok(ids.every(function (id) { return /^[a-z]+:[a-z0-9-]+:.+$/.test(id) && !/undefined|NaN/.test(id); }),
    code + ": hay ids mal formados: " + muestra(ids.filter(function (id) { return !/^[a-z]+:[a-z0-9-]+:.+$/.test(id) || /undefined|NaN/.test(id); })));

  var d = Inv.diff(code);
  ok(!d.faltan.length, code + ": " + d.faltan.length + " unidades sin registrar (" + muestra(d.faltan) + "): corré node tools/audit/inventario.js --sync");
  ok(!d.huerfanas.length, code + ": " + d.huerfanas.length + " ids huérfanos (" + muestra(d.huerfanas) + "): corré node tools/audit/inventario.js --sync");
  ok(!d.viejas.length, code + ": " + d.viejas.length + " unidades revisadas cuyo contenido cambió (" + muestra(d.viejas) + "): corré node tools/audit/inventario.js --sync");
  ok(!d.estadoRaro.length, code + ": estados desconocidos en " + muestra(d.estadoRaro));

  var reg = Inv.readRegistry(code);
  Object.keys(reg).forEach(function (id) {
    var e = reg[id];
    if (e.estado === "pendiente") return;
    ok(e.fecha && /^\d{4}-\d{2}-\d{2}$/.test(e.fecha), id + ": revisada sin fecha");
    ok(Array.isArray(e.revisores) && e.revisores.length >= (e.estado === "revisada-2" ? 2 : 1),
      id + ": " + e.estado + " con pocos revisores");
  });

  // el tablero suma lo mismo que el inventario
  var t = Cob.suma(Cob.cobertura(code));
  ok(t.total === ids.length && t.dos + t.uno + t.disp + t.pend === ids.length,
    code + ": el tablero no suma las unidades del inventario");
});

T.done();
