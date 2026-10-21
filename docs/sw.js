/*
 * Service worker de Ágora: la app queda en el teléfono y se lee sin red.
 *
 * Al instalarse guarda todo lo necesario: el caparazón, los estilos, el
 * código, las letras, los íconos, el índice del curso (course.json) y las
 * semanas de todas las estaciones (estacion-N.json, que lista el índice).
 * Después responde desde la caché y actualiza por detrás.
 *
 * Las rutas son relativas a este archivo: la app anda igual en la raíz de
 * un dominio que en una carpeta (https://auparrino.github.io/Filosofia/).
 *
 * Cambiar VERSION en cada versión, junto con APP_VERSION de js/lector.js y
 * la de package.json (lo controla tools/lib/test_version.js), para tirar la
 * caché vieja.  Las cachés llevan el prefijo «agora-»: en el mismo origen
 * viven otras apps y sus cachés no se tocan nunca.
 */
var VERSION = "agora-v0.3.1";
var PREFIX = "agora-";
var DATA = "lang/es/data/";

var SHELL = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "css/app.css",
  "lang/es/theme.css",
  "js/arranque.js",
  "js/nucleo.js",
  "js/lector.js",
  "fonts/atkinson-400-normal.woff2",
  "fonts/atkinson-400-italic.woff2",
  "fonts/atkinson-700-normal.woff2",
  "fonts/atkinson-700-italic.woff2",
  "icons/icon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/maskable-512.png",
  "icons/apple-touch-icon.png",
  DATA + "course.json"
];

// cache: "reload" skips the browser's HTTP cache (GitHub Pages keeps files
// 10 minutes): otherwise a new version could be filled with old files.
function fill(cache, files) {
  return cache.addAll(files.map(function (f) { return new Request(f, { cache: "reload" }); }));
}
// The weeks of every season: the files the index lists.
function seasons(cache) {
  return cache.match(DATA + "course.json").then(function (res) { return res.json(); }).then(function (ix) {
    return fill(cache, ix.seasons.map(function (s) { return DATA + s.file; }));
  });
}

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VERSION).then(function (cache) {
    return fill(cache, SHELL).then(function () { return seasons(cache); });
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    // only our own old caches: never those of another app on this origin
    return Promise.all(keys.filter(function (k) {
      return k.indexOf(PREFIX) === 0 && k !== VERSION;
    }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

// The copy in the background skips the HTTP cache too (it revalidates: a
// 304 when nothing changed).
function fresh(req) {
  if (req.mode === "navigate") return fetch(req.url, { cache: "no-cache", credentials: "same-origin" });
  return fetch(new Request(req, { cache: "no-cache" }));
}

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  var url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  // only what lives under the app's folder
  var scope = new URL("./", location.href).pathname;
  if (url.pathname.indexOf(scope) !== 0) return;
  e.respondWith(caches.open(VERSION).then(function (cache) {
    var key = e.request.mode === "navigate" ? new URL("./", location.href).href : e.request;
    return cache.match(key, { ignoreSearch: true }).then(function (hit) {
      var net = fresh(e.request).then(function (res) {
        if (res && res.ok) cache.put(key, res.clone());
        return res;
      });
      if (hit) {
        e.waitUntil(net.catch(function () { /* sin red: queda lo guardado */ }));
        return hit;
      }
      return net;
    });
  }));
});
