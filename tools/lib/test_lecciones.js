/*
 * Los chequeos de las lecciones (docs/js/lezione.js) en las 104 lecciones
 * (52 por idioma): que cada chequeo pruebe lo que enseña su bloque.
 *
 *   node tools/lib/test_lecciones.js              mide y controla los umbrales
 *   node tools/lib/test_lecciones.js --base F.js  mide con otra lezione.js
 *                                                 (el antes), sin umbrales
 *   node tools/lib/test_lecciones.js -v           con ejemplos de cada falla
 *
 * Métricas (20 semillas × 52 semanas × 2 idiomas, la lección entera y cada
 * una de sus partes, como se juega en la app):
 *   colComentario  «Completá la tabla» que pide la columna Ejemplo / Nota /
 *                  Ojo… (la respuesta es un comentario, no la forma)
 *   colRepetida    tablas de columnas pareadas: «Letra: K → Letra»
 *   listaSinFilas  tablas sin encabezado ni etiqueta de fila («1 um → 12 doze»)
 *   reglaSinHueco  «Completá la regla» cuya consigna no tiene ___
 *   consignaNota   «¿Cuál está bien? «También es correcto sin eu»»: la
 *                  consigna es un comentario, no una traducción
 *   repetidos      el mismo chequeo dos veces seguidas
 *   bloquesSin     bloques sin ningún chequeo (en alguna semilla)
 *   trampaAjena    chequeos de trampa sin ningún distractor que toque una
 *                  forma del bloque
 *   dosTildes      chequeos de trampa con dos distractores que solo cambian
 *                  una tilde, en un bloque que no trata de tildes
 *   distTilde      distractores de trampa que son solo una tilde (proporción)
 */
"use strict";
var fs = require("fs"), path = require("path"), vm = require("vm");
var pack = require("./pack.js");

var argv = process.argv.slice(2);
var BASE = argv.indexOf("--base") >= 0 ? argv[argv.indexOf("--base") + 1] : null;
var VERBOSE = argv.indexOf("-v") >= 0;
var SEEDS = +process.env.SEEDS || 20;

// Los umbrales (después del arreglo).  Antes, con la lezione.js y los datos
// de la rama integrada (it / pt): colComentario 754/416, colRepetida 40/42,
// listaSinFilas 83/40, reglaSinHueco 14/28, consignaNota 14/105, repetidos
// 243/406, bloquesSin 21/17, trampaAjena 831/1524, dosTildes 23/173,
// distTilde 0.088/0.194.
var MAX = {
  colComentario: 0, colRepetida: 0, listaSinFilas: 0, reglaSinHueco: 0, consignaNota: 0,
  repetidos: 0, bloquesSin: 0, trampaAjena: 0, dosTildes: 0, distTilde: 0.08
};

var COMMENT_COL = /^(ejemplos?|notas?|ojo( con)?|qué pasa|pista del español|dónde|no es|no significa|calco a evitar|diferencia)$/i;
var COMMENT_ES = /^(también|tambien|lo mismo|igual|idem|íd\.|más formal|más informal|formal|informal|coloquial)\b|^\(.*\)$|\((más )?(formal|informal|coloquial|habla|escrito)\)/i;
var ACCENT_BLOCK = /tilde|acento|acentua|til\b|circunflej|diacr|cedilla|agudo|grave/i;

function fold(s) { return String(s).normalize("NFD").replace(/[̀-ͯ]/g, ""); }
function clean(w) { return String(w).toLowerCase().replace(/^[«"(¿¡]+|[.,;:!?»")…]+$/g, ""); }

// The forms the block teaches: Lezione.forms plus the parts of its
// examples marked with asterisks.
function blockForms(L, b) {
  var f = L.forms(b).slice(), marked = [];
  (b.ex || []).forEach(function (p) {
    var inside = false;         // *Sto leggendo*: a span of several words
    String(p[0]).trim().split(/\s+/).forEach(function (t) {
      var n = (t.replace(/\*\*/g, "").match(/\*/g) || []).length;
      if (inside || n) marked.push(clean(t.replace(/\*/g, "")));
      if (n % 2) inside = !inside;
    });
  });
  return { forms: f, marked: marked };
}
function touches(bf, word) {
  var w = clean(word);
  if (!w) return false;
  if (bf.marked.indexOf(w) >= 0) return true;
  return bf.forms.some(function (f) {
    if (f === w) return true;
    if (f.charAt(0) === "-" && f.length > 2) return w.slice(-(f.length - 1)) === f.slice(1);
    if (f.slice(-1) === "-" && f.length > 2) return w.indexOf(f.slice(0, -1)) === 0;
    return f.indexOf(" ") > 0 && f.split(/\s+/).indexOf(w) >= 0;
  });
}
function changed(a, b) {
  var ta = a.split(" "), tb = b.split(" "), out = [];
  if (ta.length !== tb.length) return null;
  ta.forEach(function (t, i) { if (t !== tb[i]) out.push([t, tb[i]]); });
  return out;
}

function lezioneOf(code) {
  var ctx = pack(code, { upTo: "drills.js" });
  if (BASE) vm.runInContext(fs.readFileSync(BASE, "utf8"), ctx, { filename: BASE });
  return ctx.Lezione;
}

function measure(code) {
  var L = lezioneOf(code), course = pack.data(code, "course.json"), g = pack.data(code, "glossario.json");
  var isWord = function (w) { return !!g[String(w).toLowerCase()]; };
  var m = { quiz: 0, trap: 0, dist: 0, colComentario: 0, colRepetida: 0, listaSinFilas: 0, reglaSinHueco: 0,
            consignaNota: 0, repetidos: 0, bloquesSin: 0, trampaAjena: 0, dosTildes: 0, distTildeN: 0, kinds: {} };
  var ex = {};
  var note = function (k, s) { m[k]++; (ex[k] = ex[k] || []).length < (k === "bloquesSin" ? 99 : 6) && ex[k].push(s); };
  var noQuiz = {};
  course.weeks.forEach(function (w) {
    if (!w.lesson) return;
    var bl = w.lesson.blocks;
    var parts = [null].concat((w.lesson.parts || []).map(function (p) { return p.blocks; }));
    for (var s = 0; s < SEEDS; s++) {
      var seed = 1 + s * 7919 + w.week * 31;
      var rnd = function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
      parts.forEach(function (only) {
        var st = L.steps(w.lesson, rnd, w.week, isWord, only), prev = null, got = {};
        st.forEach(function (x) {
          if (x.kind !== "quiz") return;
          var q = x.q, b = bl[q.block], where = code + " s" + w.week + " «" + b.h + "»: ";
          var key = q.prompt + "|" + q.stem + "|" + q.answer;
          got[q.block] = 1;
          if (only) return;                 // the parts: only repeats and blocks
          m.quiz++; m.kinds[q.kind] = (m.kinds[q.kind] || 0) + 1;
          if (q.kind === "table") {
            var mm = /^(?:(.*?): )?(.*) → (.*)$/.exec(q.stem || "");
            var col = mm ? mm[3] : "";
            if (COMMENT_COL.test(col.trim())) note("colComentario", where + q.stem + " ⇒ " + q.answer);
            if (mm && mm[1] && mm[1].trim() === col.trim()) note("colRepetida", where + q.stem + " ⇒ " + q.answer);
            if (mm && !mm[1] && !col.trim()) note("listaSinFilas", where + q.stem + " ⇒ " + q.answer);
            if (!mm && !/^¿/.test(q.prompt)) note("listaSinFilas", where + q.stem + " ⇒ " + q.answer);
          }
          if (q.kind === "rule" && (q.stem || "").indexOf("___") < 0) note("reglaSinHueco", where + q.stem + " ⇒ " + q.answer);
          if (q.kind === "trap" || q.kind === "ex") {
            var es = q.kind === "trap" ? (/«(.*)»$/.exec(q.prompt) || [])[1] || "" : q.stem;
            if (COMMENT_ES.test(es.trim())) note("consignaNota", where + q.prompt + " " + q.stem);
          }
          if (q.kind === "trap") {
            m.trap++;
            var bf = blockForms(L, b), acc = ACCENT_BLOCK.test([b.h, b.r].join(" ")), on = 0, tilde = 0;
            q.options.forEach(function (o) {
              if (o === q.answer) return;
              m.dist++;
              var ch = changed(q.answer, o) || [];
              if (ch.some(function (c) { return touches(bf, c[0]) || touches(bf, c[1]); })) on++;
              if (fold(o) === fold(q.answer)) { tilde++; if (!acc) m.distTildeN++; }
            });
            if (!on) note("trampaAjena", where + q.answer + " / " + q.options.join(" / "));
            if (tilde >= 2 && !acc) note("dosTildes", where + q.options.join(" / "));
          }
          if (prev === key) note("repetidos", where + q.prompt + " " + q.stem);
          prev = key;
        });
        if (only) {
          // repeats inside a part, as played in the app
          var p2 = null;
          st.forEach(function (x) {
            if (x.kind !== "quiz") return;
            var k2 = x.q.prompt + "|" + x.q.stem + "|" + x.q.answer;
            if (k2 === p2) note("repetidos", code + " s" + w.week + " (parte): " + x.q.prompt + " " + x.q.stem);
            p2 = k2;
          });
        }
        (only || bl.map(function (_, i) { return i; })).forEach(function (i) {
          if (!got[i]) noQuiz[code + " s" + w.week + " b" + i + " «" + bl[i].h + "»"] = 1;
        });
      });
    }
  });
  Object.keys(noQuiz).forEach(function (k) { note("bloquesSin", k); });
  m.distTilde = m.dist ? +(m.distTildeN / m.dist).toFixed(3) : 0;
  m.examples = ex;
  return m;
}

var fail = 0, KEYS = Object.keys(MAX);
var res = {};
pack.LANGS.forEach(function (code) { res[code] = measure(code); });
console.log("chequeos de lección, " + SEEDS + " semillas" + (BASE ? " (con " + BASE + ")" : ""));
console.log(["métrica"].concat(pack.LANGS).join("\t"));
["quiz", "trap"].concat(KEYS).forEach(function (k) {
  console.log([k].concat(pack.LANGS.map(function (c) { return res[c][k]; })).join("\t") + (MAX[k] != null ? "\t(máx " + MAX[k] + ")" : ""));
});
pack.LANGS.forEach(function (c) { console.log(c + " por tipo: " + JSON.stringify(res[c].kinds)); });
pack.LANGS.forEach(function (c) {
  KEYS.forEach(function (k) {
    var bad = !BASE && res[c][k] > MAX[k];
    if (bad) { fail++; console.log("FAIL " + c + " " + k + ": " + res[c][k] + " > " + MAX[k]); }
    if ((bad || VERBOSE) && res[c].examples[k]) res[c].examples[k].forEach(function (e) { console.log("   " + e); });
  });
});
if (!BASE) {
  // the smallest checks still there: every language asks hundreds per run
  pack.LANGS.forEach(function (c) {
    if (res[c].quiz < 52 * SEEDS * 3) { fail++; console.log("FAIL " + c + ": muy pocos chequeos (" + res[c].quiz + ")"); }
  });
  console.log(fail ? fail + " errores" : "0 errores");
  process.exit(fail ? 1 : 0);
}
