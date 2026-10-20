/*
 * Service worker de Ágora: la app queda en el teléfono y anda sin red.
 * Estrategia: responder enseguida desde la caché y actualizar por detrás.
 *
 * Qué se guarda al instalar: el caparazón, el núcleo (docs/js/) y las
 * ediciones que ya se usan en este teléfono.  El paquete de una edición se
 * guarda entero cuando la app avisa que se eligió (postMessage {keep:
 * código}); las otras, recién si alguna vez se usan.  La lista de archivos
 * de cada edición sale de js/boot.js (Boot.langFiles).
 *
 * Cambiar VERSION en cada versión para tirar la caché vieja (y APP_VERSION
 * en js/app.js, que se ve en el perfil: test_version.js y el CI comprueban
 * que «agora-vN» y «vN» coincidan).
 *
 * Las cachés llevan el prefijo «agora-»: en el mismo origen viven otras
 * apps (La Via C1, con «c1-», en auparrino.github.io/It) y sus cachés no
 * se tocan nunca.
 */
var VERSION = "agora-v0.1.0";
var PREFIX = "agora-";
var VOCI = "agora-voci";
importScripts("js/boot.js");

var SHELL = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "css/app.css",
  "js/boot.js",
  "fonts/atkinson-400-normal.woff2",
  "fonts/atkinson-400-italic.woff2",
  "fonts/atkinson-700-normal.woff2",
  "fonts/atkinson-700-italic.woff2",
  "fonts/atkinson-800-normal.woff2",
  "icons/icon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/maskable-512.png",
  "icons/apple-touch-icon.png"
].concat(Boot.coreFiles());

function fill(cache, files, mode) {
  // cache: "reload" skips the browser's HTTP cache (GitHub Pages keeps files
  // 10 minutes): otherwise a new version could be filled with old files.
  // On the very first install the page has just downloaded these same
  // files: "default" takes them from the HTTP cache instead of downloading
  // six megabytes twice.
  return cache.addAll(files.map(function (f) { return new Request(f, { cache: mode || "reload" }); }));
}
// Whether this phone already had a version of the app (then an install is an update).
function firstInstall() {
  return caches.keys().then(function (keys) { return !keys.some(function (k) { return k.indexOf(PREFIX) === 0; }); });
}
// The copy in the background skips the HTTP cache too (it revalidates, a
// 304 when nothing changed): otherwise an old app.js could be stored next
// to a new engine.js and the next start would mix versions.
function fresh(req) {
  if (req.mode === "navigate") return fetch(req.url, { cache: "no-cache", credentials: "same-origin" });
  return fetch(new Request(req, { cache: "no-cache" }));
}

// The editions this phone already uses: those whose lang.js is in one of our caches.
function langsInUse() {
  return caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k.indexOf(PREFIX) === 0; }).map(function (k) {
      return caches.open(k).then(function (c) {
        return Promise.all(Object.keys(Boot.LANGS).map(function (code) {
          return c.match("lang/" + code + "/lang.js").then(function (hit) {
            return hit ? code : null;
          });
        }));
      });
    }));
  }).then(function (lists) {
    var out = {};
    lists.forEach(function (l) { l.forEach(function (c) { if (c) out[c] = 1; }); });
    return Object.keys(out);
  });
}

self.addEventListener("install", function (e) {
  e.waitUntil(firstInstall().then(function (first) {
    var mode = first ? "default" : "reload";
    return caches.open(VERSION).then(function (cache) {
      return fill(cache, SHELL, mode).then(function () {
        return langsInUse().then(function (codes) {
          return Promise.all(codes.map(function (c) { return fill(cache, Boot.langFiles(c), mode); }));
        });
      });
    });
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    // only our own old caches: never those of another app on this origin
    return Promise.all(keys.filter(function (k) {
      return (k.indexOf(PREFIX) === 0 && k !== VERSION && k !== VOCI);
    }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

// The app says which language is in use: keep its whole package offline.
self.addEventListener("message", function (e) {
  var code = e.data && e.data.keep;
  if (!code || !Boot.LANGS[code]) return;
  var files = Boot.langFiles(code);
  e.waitUntil(caches.open(VERSION).then(function (cache) {
    return Promise.all(files.map(function (f) {
      return cache.match(f).then(function (hit) {
        return hit || cache.add(new Request(f, { cache: "reload" })).catch(function () { /* offline: later */ });
      });
    }));
  }));
});

// A lasting cache for the voices and the books: what was opened once works
// offline.
function lasting(req, key, ok) {
  return caches.match(key || req).then(function (hit) {
    return hit || fetch(key || req).then(function (res) {
      if (res && ok(res)) caches.open(VOCI).then(function (c) { return c.put(key || req, res.clone()); }).catch(function () {});
      return res;
    });
  });
}

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  var url = new URL(e.request.url);
  // Real voices (Lingua Libre, on upload.wikimedia.org).
  if (url.hostname === "upload.wikimedia.org") {
    e.respondWith(lasting(e.request, null, function (res) { return res.ok || res.type === "opaque"; }));
    return;
  }
  if (url.origin !== location.origin) return;
  // The sentences of Common Voice (lang/<código>/audio/cv/): cached the
  // first time they play, in the lasting cache, so a session works offline
  // afterwards without downloading 5 MB at install.  The player asks by
  // ranges (206, which cannot be cached): ask for the whole file, a few KB,
  // and answer with it.
  if (/\/audio\/cv\//.test(url.pathname)) {
    e.respondWith(lasting(null, url.href, function (res) { return res.status === 200; }));
    return;
  }
  // The books of the Biblioteca (lang/<código>/biblioteca/): kept in the
  // lasting cache, so a book opened once reads offline after a new version
  // too; the copy is refreshed in the background when there is network.
  if (/\/biblioteca\//.test(url.pathname)) {
    e.respondWith(caches.open(VOCI).then(function (c) {
      return c.match(e.request, { ignoreSearch: true }).then(function (hit) {
        var net = fetch(e.request).then(function (res) {
          if (res && res.ok) c.put(e.request, res.clone());
          return res;
        }).catch(function () { return hit; });
        return hit || net;
      });
    }));
    return;
  }
  e.respondWith(caches.open(VERSION).then(function (cache) {
    return cache.match(e.request, { ignoreSearch: true }).then(function (hit) {
      var net = fresh(e.request).then(function (res) {
        if (res && res.ok) cache.put(e.request, res.clone());
        return res;
      }).catch(function () { return hit; });
      return hit || net;
    });
  }));
});
