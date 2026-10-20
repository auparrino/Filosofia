/* Las rutas que citan los documentos existen.  Cada `ruta` entre comillas
   invertidas de un .md del repo que empiece por una carpeta o un archivo de
   la raíz (docs/, tools/, auditorias/, .github/, README…) tiene que existir;
   si no, el documento describe un repo que ya no está (pasó con
   tools/pt/CONTENIDO.md y con la «Estructura del repo» del README-italiano).

   - `<código>` o `<code>` valen por cualquier idioma (it, pt);
   - `*` es un comodín dentro de una carpeta (`tools/<código>/authored/s*.py`);
   - se ignoran el número de línea (`app.js:726`) y lo que sigue a un
     espacio (`node tools/lib/sim_carriera.js it`: se mira el script).
   No mira auditorias/: cada auditoría describe el repo de su fecha.
   Run: node tools/lib/test_rutas.js */
"use strict";
var fs = require("fs"), path = require("path");
var ROOT = path.join(__dirname, "..", "..");
var T = require("./testkit.js")("lib"), ok = T.ok;

var SKIP_DIRS = { ".git": 1, node_modules: 1, ".claude": 1, auditorias: 1, out: 1, ".cache": 1, __pycache__: 1 };
function mdFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).reduce(function (acc, d) {
    var p = path.join(dir, d.name);
    if (d.isDirectory()) return SKIP_DIRS[d.name] ? acc : acc.concat(mdFiles(p));
    return d.name.endsWith(".md") ? acc.concat([p]) : acc;
  }, []);
}

var ROOTS = fs.readdirSync(ROOT).filter(function (n) { return !SKIP_DIRS[n] || n === "auditorias"; });
function looksLikePath(s) {
  var first = s.split("/")[0];
  if (s.indexOf("/") < 0) return /\.(md|json|js|cjs|py|yml)$/.test(s) && ROOTS.indexOf(s) >= 0 || /^(README|ARQUITECTURA|CONTENIDO)[\w-]*\.md$/.test(s);
  return ROOTS.indexOf(first) >= 0 || first === "docs" || first === "tools" || first === ".github";
}

function globToRe(seg) {
  return new RegExp("^" + seg.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\?/g, ".") + "$");
}
// Does the path (maybe with * and <código>) name something in the repo?
// What only exists after running a tool (gitignored): not checked.
var GENERATED = [/^tools\/[^/]+\/audit\/out\//, /^tools\/(?:[^/]+\/)?\.cache\//];
function exists(p) {
  if (GENERATED.some(function (re) { return re.test(p); })) return true;
  // placeholders: wNN.json, pass{N}, find_{K}
  p = p.replace(/\{[^}]*\}/g, "*").replace(/(^|[^A-Z])NN(?![A-Z])/g, "$1*");
  var variants = /<(código|codigo|code|lang|idioma)>/.test(p) ? ["it", "pt"].map(function (c) { return p.replace(/<(código|codigo|code|lang|idioma)>/g, c); }) : [p];
  return variants.some(function (v) {
    var segs = v.replace(/\/+$/, "").split("/"), dirs = [ROOT];
    for (var i = 0; i < segs.length; i++) {
      var seg = segs[i], next = [];
      dirs.forEach(function (d) {
        if (!/[*?]/.test(seg)) { if (fs.existsSync(path.join(d, seg))) next.push(path.join(d, seg)); return; }
        var re = globToRe(seg);
        try { fs.readdirSync(d).forEach(function (n) { if (re.test(n)) next.push(path.join(d, n)); }); } catch (e) { /* no es carpeta */ }
      });
      dirs = next;
      if (!dirs.length) return false;
    }
    return true;
  });
}

var cited = 0;
mdFiles(ROOT).forEach(function (f) {
  var rel = path.relative(ROOT, f);
  var text = fs.readFileSync(f, "utf8").replace(/```[\s\S]*?```/g, function (b) {
    // inside code blocks only the lines that are a command or a path count
    return b.split("\n").map(function (l) { return "`" + l.trim().replace(/`/g, "") + "`"; }).join("\n");
  });
  var re = /`([^`\n]+)`/g, m;
  while ((m = re.exec(text))) {
    // a command (npm run, node x.js, python3 y.py): look at each word
    m[1].split(/\s+/).forEach(function (tok) {
      tok = tok.replace(/^[("'«]+|[)"'»,.;:]+$/g, "").replace(/:\d+(-\d+)?$/, "").replace(/#.*$/, "");
      if (!tok || /^https?:/.test(tok) || /[=]/.test(tok) || !looksLikePath(tok)) return;
      cited++;
      var line = text.slice(0, m.index).split("\n").length;
      ok(exists(tok), rel + ":" + line + " cita `" + tok + "`, que no existe");
    });
  }
});
ok(cited > 50, "se revisaron rutas citadas: " + cited);

T.done("rutas citadas en los .md: " + cited + "   ");
