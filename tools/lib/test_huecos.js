/* Ejercicios de varios huecos («dell' | dell' | del | del»): la respuesta
   vale separada con comas, con | o con espacios, y una coma de menos no es
   un error (el caso real: «dell', dell', del del» marcado mal).  Y el
   texto de la IA se escapa una sola vez (antes aparecían &quot; y &#39;).
   Run: node tools/lib/test_huecos.js */
"use strict";
var fs = require("fs"), path = require("path"), pack = require("./pack.js");
var bad = 0, checks = 0;
function ok(c, m) { checks++; if (!c) { bad++; console.log("FAIL " + m); } }

var ctx = pack("it"), E = ctx.Engine, V = E.VERDICT;
var item = { answer: "dell' | dell' | del | del", accept: ["dell' | dell' | del | del"] };
["dell', dell', del, del", "dell', dell', del del", "dell' dell' del del", "dell'|dell'|del|del", "Dell', dell', del; del"].forEach(function (g) {
  ok(E.grade(g, item) === V.RIGHT, "«" + g + "» es la respuesta correcta");
});
["del, dell', del, del", "dell', dell', del", "dell', dell', dei, del"].forEach(function (g) {
  ok(E.grade(g, item) !== V.RIGHT, "«" + g + "» no es la respuesta correcta");
});
// a sentence with commas that is one answer still needs its commas' words
ok(E.grade("Sì, grazie", { answer: "Sì, grazie", accept: ["Sì, grazie"] }) === V.RIGHT, "una respuesta con coma sigue valiendo");

// every multi-gap item of the course accepts its own answer written with commas
var course = pack.data("it", "course.json"), n = 0;
course.items.forEach(function (it) {
  if (!/\|/.test(it.answer || "")) return;
  n++;
  var withCommas = it.answer.split(/\s*\|\s*/).join(", ");
  ok(E.grade(withCommas, it) === V.RIGHT, it.id + ": «" + withCommas + "» con comas no se acepta");
});
ok(n > 100, "hay ejercicios de varios huecos: " + n);

// the AI's text is escaped once
var app = fs.readFileSync(path.join(pack.DOCS, "js", "app.js"), "utf8");
ok(!/mk\(esc\(/.test(app), "app.js escapa dos veces con mk(esc(…))");
console.log(bad ? "✗ huecos: " + bad + " problemas" : "✓ huecos: " + checks + " controles");
process.exit(bad ? 1 : 0);
