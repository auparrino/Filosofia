/* Una sola norma para el registro brasileño en los tres correctores
   (auditoría 2026-09, C2 y P7): la misma forma del habla (pra, tá, tô, tava,
   cê, amo você, vi ele, me dá al empezar, tem por há) recibe el mismo nivel
   en las respuestas cerradas (Diagnosi.diagnose) y en la escritura libre
   (Scrivi.lint), según el registro, y el pedido a la IA dice lo mismo.
     · sin registro formal: se acepta; en las cerradas con la nota
       (level "ok_note", note), en Scrivi sin marca;
     · con registro formal: «casi» en los dos (level "close"), con la forma
       escrita en la nota o en good.
   Run: node tools/pt/test_registro.js  */
"use strict";
var pack = require("../lib/pack.js");
var ctx = pack("pt");
var D = ctx.Diagnosi, S = ctx.Scrivi;
var bank = pack.data("pt", "bank.json");
if (ctx.Banca) ctx.Banca.load(bank); else D.init(bank);

var fails = 0, checks = 0;
function ok(c, what) { checks++; if (!c) { fails++; console.log("FAIL " + what); } }

// [lo que se dice, lo escrito, la forma del habla que se mira]
var PAIRS = [
  ["Vou pra praia amanhã.", "Vou para a praia amanhã.", "pra"],
  ["Tô cansado hoje.", "Estou cansado hoje.", "tô"],
  ["Ela tá em casa agora.", "Ela está em casa agora.", "tá"],
  ["Eu tava no trabalho ontem.", "Eu estava no trabalho ontem.", "tava"],
  ["Cê vem amanhã?", "Você vem amanhã?", "cê"],
  ["Eu amo você.", "Eu te amo.", "amo"],
  ["Eu vi ele ontem.", "Eu o vi ontem.", "vi"],
  ["Me dá um café, por favor.", "Dá-me um café, por favor.", "me"],
  ["Tem muita gente aqui.", "Há muita gente aqui.", "tem"],
  ["Cadê o livro?", "Onde está o livro?", "cadê"]
];

function covers(f, text, form) {
  var tk = S.toks(text);
  for (var k = f.i; k < f.i + f.n; k++) if (tk[k] && tk[k].w === form) return true;
  return false;
}

PAIRS.forEach(function (p) {
  var said = p[0], written = p[1], form = p[2];
  // 1. respuestas cerradas
  var inf = D.diagnose(said, [written], {});
  var frm = D.diagnose(said, [written], { registro: "formal" });
  ok(inf.verdict === "giusto" && inf.level === "ok_note" && /habla|Brasil/.test(inf.note || ""),
     "cerradas, sin registro formal: «" + said + "» vale con nota (" + inf.verdict + " · " + inf.level + " · " + (inf.note || inf.explain) + ")");
  ok(frm.verdict === "quasi" && frm.level === "close",
     "cerradas, registro formal: «" + said + "» es casi (" + frm.verdict + " · " + frm.level + " · " + frm.cat + ")");
  // 2. Scrivi
  var sInf = S.lint(said, 52, { registro: "informal" }).filter(function (f) { return covers(f, said, form); });
  var sFrm = S.lint(said, 52, { registro: "formal" }).filter(function (f) { return covers(f, said, form); });
  ok(!sInf.some(function (f) { return !f.soft; }), "Scrivi, sin registro formal: «" + said + "» sin marca (" + sInf.map(function (f) { return f.msg; }).join(" | ") + ")");
  ok(sFrm.length && sFrm.every(function (f) { return f.level === "close"; }),
     "Scrivi, registro formal: «" + said + "» es casi (" + sFrm.map(function (f) { return f.level + " " + f.msg; }).join(" | ") + ")");
  // 3. el mismo nivel en los dos
  var lvC = frm.level, lvS = sFrm[0] && sFrm[0].level;
  ok(lvC === lvS, "mismo nivel en registro formal para «" + form + "»: cerradas " + lvC + ", Scrivi " + lvS);
  ok(/^ok/.test(inf.level) && !sInf.some(function (f) { return !f.soft; }), "mismo nivel sin registro formal para «" + form + "»");
});

// Las tareas formales de Scrivi (33, 40, 43, 48, 49) marcan el habla; la 38 (WhatsApp) la pide.
ok(S.lint("Tô indo pra casa.", 43).some(function (f) { return f.cat === "registro" && f.level === "close" && f.good === "estou"; }), "tarea 43 (mail formal): tô es casi, con la forma escrita en good");
ok(!S.lint("Tô indo pra casa, né?", 38).some(function (f) { return !f.soft; }), "tarea 38 (WhatsApp): el habla no se marca");

// El registro que pide la consigna de un ítem
ok(D.registerOf({ stem: "Vi ele ontem. (coloquial) → ___ ontem. (culto)" }) === "formal", "consigna: lo que va después de la flecha manda (culto)");
ok(D.registerOf({ stem: "(formal) Gostaria de solicitar… → (coloquial) ___" }) === "coloquial", "consigna: coloquial después de la flecha");
ok(D.registerOf({ prompt: "Traducí al portugués." }) === null, "consigna neutra: sin registro");
ok(D.diagnose("Vou pra praia.", ["Vou para a praia."], { prompt: "Texto formal. Reescribí la frase." }).level === "close", "«Texto formal» en la consigna: casi");
// Sin el contexto del ítem (la corrección de «encontrá el error») rige la norma escrita.
ok(D.diagnose("Vi ele", ["Vi-o"]).verdict !== "giusto", "sin contexto: la norma escrita (encontrá el error)");

// La IA recibe la misma tabla
var pr = S.aiPrompt("x", 20, S.TASKS[20]);
D.REGISTRO.rows.slice(0, 8).forEach(function (r) {
  ok(pr.indexOf(r[0]) >= 0, "el pedido a la IA nombra «" + r[0] + "»");
});
ok(pr.indexOf(D.REGISTRO.prompt) >= 0, "el pedido a la IA lleva la norma de Diagnosi.REGISTRO");

// Cada marca de Scrivi trae lo que el perfil de errores necesita
S.lint("Eu tengo dois irmãos e moro em o Rio.", 10).forEach(function (f) {
  ok(typeof f.bad === "string" && f.bad && typeof f.good === "string" && typeof f.why === "string" && f.why && /^(wrong|close|ok_note)$/.test(f.level),
     "marca con bad/good/why/level: " + JSON.stringify(f));
});
var f1 = S.lint("Eu tengo dois irmãos.", 10).filter(function (f) { return f.cat === "espanol"; })[0];
ok(f1 && f1.bad === "tengo" && f1.good === "tenho", "tengo → bad «tengo», good «tenho»: " + JSON.stringify(f1));
var f2 = S.lint("Moro em o Rio.", 10).filter(function (f) { return f.cat === "contraccion"; })[0];
ok(f2 && f2.bad === "em o" && f2.good === "no", "em o → bad «em o», good «no»: " + JSON.stringify(f2));

console.log("\ncontroles: " + checks + "   errores: " + fails);
process.exit(fails ? 1 : 0);
