/* Una sola versión: la de la app.  package.json, APP_VERSION de
   docs/js/lector.js (la que se ve en Ajustes) y VERSION de docs/sw.js
   (el nombre de la caché) tienen que decir lo mismo:
     package.json 1.0.0  ↔  lector.js "v1.0"  ↔  sw.js "agora-v1.0"
     package.json 0.1.0  ↔  lector.js "v0.1.0"  ↔  sw.js "agora-v0.1.0"
   Para subir de versión se cambian los tres a la vez.
   Run: node tools/lib/test_version.js */
"use strict";
var fs = require("fs"), path = require("path");
var ROOT = path.join(__dirname, "..", "..");
var T = require("./testkit.js")("lib"), ok = T.ok;

var pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8")).version;
var app = (fs.readFileSync(path.join(ROOT, "docs/js/lector.js"), "utf8").match(/APP_VERSION = "v(\d+(?:\.\d+)*)"/) || [])[1];
var sw = (fs.readFileSync(path.join(ROOT, "docs/sw.js"), "utf8").match(/VERSION = "agora-v(\d+(?:\.\d+)*)"/) || [])[1];

ok(/^\d+\.\d+\.\d+$/.test(pkg || ""), "package.json: versión semver (X.Y.Z): " + pkg);
ok(!!app, "docs/js/lector.js: APP_VERSION = \"vX.Y\"");
ok(!!sw, "docs/sw.js: VERSION = \"agora-vX.Y\"");
// the app shows X.Y when the patch number is 0
var short = String(pkg).replace(/\.0$/, "");
ok(app === short || app === pkg, "package.json " + pkg + " ≠ lector.js v" + app);
ok(sw === app, "sw.js agora-v" + sw + " ≠ lector.js v" + app);

T.done("versión: " + pkg + " (lector v" + app + ", sw agora-v" + sw + ")   ");
