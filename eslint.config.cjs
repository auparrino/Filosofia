/* Lint mínimo: lo que es un error seguro (claves repetidas, variables
   redeclaradas, nombres sin definir) y, como aviso, las variables sin uso.
   Sin dependencias: `npx eslint` con este archivo.  `npm run lint`.

   La app (docs/) es JavaScript plano para el navegador: sus módulos se
   publican con `root.Nombre = …` o `window.Nombre = …`, y los globals se
   sacan de los mismos archivos, así un módulo nuevo no obliga a tocar esta
   lista.  Los tests (tools/lib/) corren en Node. */
"use strict";
const fs = require("fs");
const path = require("path");

function jsFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? jsFiles(p) : d.name.endsWith(".js") ? [p] : [];
  });
}

const app = {};
for (const f of jsFiles(path.join(__dirname, "docs"))) {
  const src = fs.readFileSync(f, "utf8");
  for (const m of src.matchAll(/\b(?:root|window|self|globalThis)\.([A-Za-z_$][\w$]*)\s*=(?!=)/g)) app[m[1]] = "writable";
}

// Lo que la app usa del navegador (y del service worker).
const browser = [
  "window", "self", "globalThis", "document", "navigator", "location", "history", "localStorage",
  "console", "fetch", "Request", "Response", "URL", "Blob", "FileReader", "setTimeout", "clearTimeout",
  "caches", "clients", "importScripts",
];
const globals = Object.assign({}, app);
for (const g of browser) globals[g] = "readonly";
// js/nucleo.js también se carga en node para los tests (typeof module…).
globals.module = "readonly";

const node = {
  require: "readonly", module: "writable", process: "readonly", console: "readonly", __dirname: "readonly",
  setTimeout: "readonly", clearTimeout: "readonly", URL: "readonly", Buffer: "readonly", globalThis: "readonly",
  // lo que corre dentro de la página en el smoke (page.evaluate)
  document: "readonly", window: "readonly", localStorage: "readonly", location: "readonly", navigator: "readonly",
  caches: "readonly", getComputedStyle: "readonly", Response: "readonly",
};

const rules = {
  "no-dupe-keys": "error",
  "no-redeclare": "error",
  "no-undef": "error",
  "no-unused-vars": ["warn", { vars: "all", args: "none", caughtErrors: "none" }],
};

module.exports = [
  {
    files: ["docs/**/*.js"],
    languageOptions: { ecmaVersion: 2022, sourceType: "script", globals },
    linterOptions: { reportUnusedDisableDirectives: "off" },
    rules,
  },
  {
    files: ["tools/**/*.js"],
    languageOptions: { ecmaVersion: 2022, sourceType: "commonjs", globals: node },
    rules,
  },
];
