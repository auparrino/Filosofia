/* Lint mínimo de la app (docs/): lo que es un error seguro (claves
   repetidas, variables redeclaradas, nombres sin definir) y, como aviso,
   las variables sin uso.  Sin dependencias: `npx eslint` (o un eslint
   global) con este archivo.  `npm run lint`.

   Los globals de la app se sacan de los mismos archivos: cada módulo se
   publica con `root.Nombre = …` (o window./self./globalThis.), así un
   módulo nuevo no obliga a tocar esta lista. */
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
  "window", "self", "globalThis", "document", "navigator", "location", "history", "localStorage", "sessionStorage",
  "console", "alert", "confirm", "prompt", "fetch", "Request", "Response", "Headers", "URL", "URLSearchParams",
  "Blob", "File", "FileReader", "FormData", "AbortController", "Audio", "Image", "Event", "CustomEvent",
  "MediaMetadata", "SpeechSynthesisUtterance", "speechSynthesis", "matchMedia", "getComputedStyle",
  "requestAnimationFrame", "cancelAnimationFrame", "setTimeout", "clearTimeout", "setInterval", "clearInterval",
  "performance", "crypto", "indexedDB", "caches", "clients", "importScripts", "structuredClone",
  "TextEncoder", "TextDecoder", "IntersectionObserver", "ResizeObserver", "MutationObserver",
  "HTMLElement", "Node", "Element", "DOMParser", "queueMicrotask",
];
const globals = Object.assign({}, app);
for (const g of browser) globals[g] = "readonly";
// Los módulos también se cargan en node para los tests (typeof module…).
globals.module = "readonly";
globals.require = "readonly";

module.exports = [
  {
    files: ["docs/**/*.js"],
    languageOptions: { ecmaVersion: 2022, sourceType: "script", globals },
    linterOptions: { reportUnusedDisableDirectives: "off" },
    rules: {
      "no-dupe-keys": "error",
      "no-redeclare": "error",
      "no-undef": "error",
      "no-unused-vars": ["warn", { vars: "all", args: "none", caughtErrors: "none" }],
    },
  },
];
