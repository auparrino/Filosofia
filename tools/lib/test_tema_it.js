/* El tema de cada idioma (docs/lang/<código>/theme.css), en los dos
   idiomas: las fuentes que declara existen y son las que el service worker
   guarda (boot.js LANGS.fonts), el color de la barra coincide con el de
   lang.js, los tokens que usa el confeti existen, y los pares de colores
   del texto pasan AA (4,5:1) en claro y en oscuro.  Nació con el rediseño
   del italiano (la Costiera Amalfitana). */
"use strict";
var fs = require("fs"), path = require("path");
var pack = require("./pack.js");
var Boot = require(path.join(pack.DOCS, "js", "boot.js"));
var n = 0, bad = 0;
function ok(c, m) { n++; if (!c) { bad++; console.log("FAIL " + m); } }

// The tokens of a block: «--name: #rrggbb».
function tokens(css) {
  var t = {}, re = /--([a-z-]+):\s*(#[0-9a-f]{6})\b/gi, m;
  while ((m = re.exec(css))) t[m[1]] = m[2].toLowerCase();
  return t;
}
function lum(h) {
  var c = [1, 3, 5].map(function (i) { return parseInt(h.substr(i, 2), 16) / 255; })
    .map(function (v) { return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function ratio(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }

// The pairs of text on background that must read (AA), by language:
// [text, background], a token name or a literal color.
var PAIRS = {
  it: {
    light: [["inchiostro", "intonaco"], ["inchiostro", "carta"], ["grigio", "carta"], ["grigio", "intonaco"],
            ["grigio", "travertino"], ["#ffffff", "terracotta"], ["#ffffff", "terracotta-scura"], ["terracotta", "carta"],
            ["azzurro", "carta"], ["azzurro-scuro", "carta"], ["verde", "carta"], ["verde-scuro", "carta"],
            ["oro-scuro", "carta"], ["#3a2a00", "oro"], ["#ffffff", "azzurro"], ["#ffffff", "verde"],
            ["#16427f", "smalto"], ["#a63a17", "smalto"]],
    dark: [["inchiostro", "intonaco"], ["inchiostro", "carta"], ["grigio", "carta"], ["grigio", "intonaco"],
           ["#ffffff", "terracotta-scura"], ["terracotta", "carta"], ["terracotta-chiara", "carta"],
           ["azzurro", "carta"], ["verde", "carta"], ["verde-chiaro", "carta"], ["oro", "carta"],
           ["#16427f", "smalto"], ["#a63a17", "smalto"]]
  },
  pt: {
    light: [["tinta", "areia"], ["tinta", "papel"], ["cinza", "papel"]],
    dark: [["tinta", "areia"], ["tinta", "papel"], ["cinza", "papel"]]
  }
};

pack.LANGS.forEach(function (code) {
  var dir = pack.langDir(code);
  var css = fs.readFileSync(path.join(dir, "theme.css"), "utf8");
  var c = pack(code, { upTo: "rules.js" }), L = c.LANG;

  // The fonts: every @font-face file exists and is in boot.js (the service worker keeps it).
  var urls = [], re = /url\((fonts\/[^)"']+)\)/g, m;
  while ((m = re.exec(css))) urls.push(m[1]);
  ok(urls.length > 0, code + ": theme.css sin @font-face");
  urls.forEach(function (u) {
    ok(fs.existsSync(path.join(dir, u)), code + ": falta " + u);
    ok(Boot.LANGS[code].fonts.indexOf(u) >= 0, code + ": " + u + " no está en boot.js LANGS." + code + ".fonts");
  });
  Boot.LANGS[code].fonts.forEach(function (u) {
    ok(fs.existsSync(path.join(dir, u)), code + ": boot.js lista " + u + " y no existe");
  });
  ok(fs.readdirSync(path.join(dir, "fonts")).some(function (f) { return /^OFL/.test(f); }), code + ": falta la licencia OFL de la fuente");

  // The color of the bar: the same in lang.js and boot.js.
  ok(L.themeColor.light === Boot.LANGS[code].themeColor.light && L.themeColor.dark === Boot.LANGS[code].themeColor.dark,
    code + ": themeColor distinto en lang.js y boot.js");

  // Confetti: the tokens it reads exist in the theme.
  var cf = L.confetti;
  ok(cf && cf.bits && cf.bits.length, code + ": confeti sin emoji");
  (cf.colors || []).forEach(function (v) {
    ok(new RegExp(v.replace(/-/g, "\\-") + ":").test(css), code + ": el confeti usa " + v + " y el tema no lo define");
  });

  // The share card draws without errors on a fake canvas.
  var calls = 0, g = new Proxy({}, { get: function (t, k) {
    if (k === "createLinearGradient") return function () { return { addColorStop: function () {} }; };
    return function () { calls++; };
  }, set: function () { return true; } });
  try { L.card.frame(g, 720, 400); ok(calls > 0, code + ": la tarjeta no dibuja nada"); }
  catch (e) { ok(false, code + ": la tarjeta falla: " + e.message); }

  // Contrast: the light tokens (:root) and the dark ones (html[data-theme="dark"]).
  var light = tokens(css.slice(css.indexOf(":root"), css.indexOf("@media (prefers-color-scheme: dark)")));
  var i = css.indexOf('html[data-theme="dark"] {');
  var dark = Object.assign({}, light, tokens(css.slice(i, css.indexOf("}", i))));
  [["light", light], ["dark", dark]].forEach(function (mode) {
    (PAIRS[code] || {})[mode[0]].forEach(function (p) {
      var a = p[0][0] === "#" ? p[0] : mode[1][p[0]], b = p[1][0] === "#" ? p[1] : mode[1][p[1]];
      if (!a || !b) { ok(false, code + " " + mode[0] + ": falta el token " + (a ? p[1] : p[0])); return; }
      var r = ratio(a, b);
      ok(r >= 4.5, code + " " + mode[0] + ": " + p[0] + " sobre " + p[1] + " = " + r.toFixed(2) + " (< 4,5)");
    });
  });
});

// The Italian theme: majolica, the ceramic plate, Playfair; nothing left of Bodoni.
var it = fs.readFileSync(path.join(pack.langDir("it"), "theme.css"), "utf8");
["--maiolica", "--cenefa", "--positano", "Playfair Display", ".targa::after"].forEach(function (k) {
  ok(it.indexOf(k) >= 0, "it: el tema no tiene " + k);
});
ok(!/bodoni/i.test(it + JSON.stringify(Boot.LANGS.it)), "it: queda una referencia a Bodoni");

console.log("tema: " + n + " comprobaciones, " + bad + " errores");
process.exit(bad ? 1 : 0);
