/*
 * El arranque: una app, varias ediciones.
 *
 * El núcleo (docs/js/: motor, interfaz, generador de ejercicios) es uno
 * solo; cada edición del curso es un paquete en docs/lang/<código>/
 * (lang.js con su configuración e interfaz, rules.js con sus reglas, los
 * datos y su tema).  Viene de La Via C1, donde cada paquete era un idioma;
 * en Ágora cada paquete es el mismo curso de filosofía escrito en otra
 * lengua (por ahora, el castellano).  boot.js decide la edición y carga los
 * scripts en ORDER, alternando paquete y núcleo en el orden en que se
 * necesitan.
 *
 * La edición sale de: ?lang=es en la URL, lo último elegido (localStorage
 * «agora.lang») o un guardado que ya exista.  Con una sola edición no hay
 * selector; con más, se muestra si no hay nada.
 *
 * Bajo Node exporta ORDER y LANGS para los tests (tools/lib/pack.js); en el
 * service worker (importScripts) solo expone Boot, para saber qué archivos
 * guardar de cada edición.
 *
 * Todo lo que se guarda lleva el prefijo «agora»: la app puede vivir en el
 * mismo origen que La Via C1 (auparrino.github.io) sin tocar sus datos.
 */
(function (root) {
  "use strict";

  // Los archivos del paquete que una edición todavía no tiene (el núcleo
  // anda sin ellos: sin frases, lecturas, radio, examen…).
  var LEAN = ["conjugator.js", "frasi_data.js", "trabajo_data.js", "formule_data.js", "lab_data.js",
              "letture_settimana.js", "tramo_data.js", "letture_data.js", "mapas_data.js", "diagnosi.js", "scrivi.js",
              "freq_data.js", "ascolto_data.js", "dictogloss_data.js", "esame_data.js",
              "voci_cv_data.js", "duelli_data.js", "devolucion_data.js", "porque_data.js", "escritura_plus_data.js",
              "variaciones_data.js", "escritos_data.js", "desglose_data.js", "biblioteca_data.js", "radio_data.js",
              "fuera_data.js"];

  var LANGS = {
    // El curso arranca chico: las primeras semanas de la Antigüedad.
    es: { name: "Castellano", flag: "🏛️", brand: "Ágora", storage: "agora-es",
          blurb: "La historia de la filosofía en 52 semanas, de los presocráticos a hoy, con sus ramas.",
          themeColor: { light: "#efe6d6", dark: "#1a1612" }, bg: "#f4ede1",
          fonts: [],
          missing: LEAN,
          data: ["course.json"] }
  };

  // {lang: archivo} vive en docs/lang/<código>/; {core: archivo} en docs/js/;
  // {shared: archivo} en docs/lang/ (datos de todas las ediciones, van con el núcleo).
  var ORDER = [
    { lang: "lang.js" }, { lang: "rules.js" }, { lang: "conjugator.js" },
    { core: "engine.js" }, { core: "ia.js" }, { core: "errores.js" },
    { lang: "frasi_data.js" }, { lang: "trabajo_data.js" }, { core: "frasi.js" },
    { lang: "formule_data.js" }, { core: "formule.js" },
    { lang: "lab_data.js" }, { core: "lab.js" },
    { lang: "letture_settimana.js" }, { lang: "tramo_data.js" }, { lang: "letture_data.js" }, { core: "letture.js" },
    { core: "lezione.js" },
    { lang: "mapas_data.js" }, { core: "mapas.js" },
    { lang: "diagnosi.js" }, { lang: "scrivi.js" },
    { core: "banca.js" }, { lang: "freq_data.js" }, { core: "frequenza.js" },
    { lang: "ascolto_data.js" }, { lang: "dictogloss_data.js" }, { lang: "esame_data.js" }, { lang: "voci_cv_data.js" },
    { core: "suoni.js" },
    { core: "ubicacion.js" },
    { lang: "duelli_data.js" }, { core: "duelli.js" },
    { lang: "devolucion_data.js" }, { core: "devolucion.js" },
    { lang: "porque_data.js" }, { core: "porque.js" },
    { lang: "escritura_plus_data.js" }, { core: "escritura_plus.js" },
    { lang: "variaciones_data.js" },
    { lang: "escritos_data.js" },
    { core: "variaciones.js" },
    { core: "ctest.js" },
    { core: "ordenar.js" },
    { core: "escritos.js" },
    { lang: "desglose_data.js" },
    { core: "voci.js" }, { core: "drills.js" }, { core: "desglose.js" },
    { core: "referencia.js" },
    { core: "reglas.js" }, { core: "unamas.js" },
    { lang: "biblioteca_data.js" }, { core: "biblioteca.js" },
    { lang: "radio_data.js" }, { core: "radio.js" }, { core: "tramo.js" },
    { lang: "fuera_data.js" }, { core: "fuera.js" }, { core: "trabajo.js" },
    { core: "plan.js" }, { core: "progreso.js" }, { core: "inicio.js" },
    { core: "capas.js" }, { core: "nube.js" }, { core: "teclado.js" },
    { core: "app.js" }
  ];

  // What app.js fetches from the package (lang/<código>/data/).
  var DATA = ["course.json", "bank.json", "glossario.json", "frequenza.json"];

  var KEY = "agora.lang";
  var ERA = "agora.era";      // the era of the last week seen: the colors before app.js loads

  function src(entry, code) {
    if (entry.shared) return "lang/" + entry.shared;
    return entry.lang ? "lang/" + code + "/" + entry.lang : "js/" + entry.core;
  }

  /* Every file of the core (docs/js/) and of one package, relative to
     docs/: what the service worker keeps for offline use. */
  // Does the package have this file?  (missing: not yet, see LANGS.de)
  function has(entry, code) { return !(entry.lang && LANGS[code] && (LANGS[code].missing || []).indexOf(entry.lang) >= 0); }

  function coreFiles() {
    return ORDER.filter(function (e) { return e.core || e.shared; }).map(function (e) { return src(e); });
  }
  function langFiles(code) {
    var base = "lang/" + code + "/";
    return ORDER.filter(function (e) { return e.lang && has(e, code); }).map(function (e) { return src(e, code); })
      .concat([base + "theme.css"])
      .concat(LANGS[code].fonts.map(function (f) { return base + f; }))
      .concat((LANGS[code].data || DATA).map(function (f) { return base + "data/" + f; }));
  }

  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } }

  function chosen() {
    var m = /[?&]lang=(\w+)/.exec(location.search);
    if (m && LANGS[m[1]]) { set(KEY, m[1]); return m[1]; }
    var saved = get(KEY);
    if (saved && LANGS[saved]) return saved;
    // Quien ya estudiaba sigue en su edición, sin preguntar.
    for (var c in LANGS) {
      if (get(LANGS[c].storage + ".save.v1")) { set(KEY, c); return c; }
    }
    // One edition: no picker.
    var codes = Object.keys(LANGS);
    return codes.length === 1 ? codes[0] : null;
  }

  // The colors of the browser bar, the title and the fonts of the language,
  // before anything is drawn.
  function dress(code) {
    var L = LANGS[code], doc = document;
    doc.documentElement.setAttribute("data-lang", code);
    doc.documentElement.setAttribute("data-era", get(ERA) || "1");
    doc.title = L.brand + " — filosofía";
    Array.prototype.forEach.call(doc.querySelectorAll('meta[name="theme-color"]'), function (m) {
      m.content = /dark/.test(m.media || "") ? L.themeColor.dark : L.themeColor.light;
    });
    var at = doc.querySelector('meta[name="apple-mobile-web-app-title"]');
    if (at) at.content = L.name;
    if (L.fonts.length) {
      var pre = doc.createElement("link");
      pre.rel = "preload"; pre.as = "font"; pre.type = "font/woff2"; pre.crossOrigin = "anonymous";
      pre.href = "lang/" + code + "/" + L.fonts[0];
      doc.head.appendChild(pre);
    }
    var css = doc.createElement("link");
    css.rel = "stylesheet";
    css.href = "lang/" + code + "/theme.css";
    doc.head.appendChild(css);
  }

  /* All the scripts at once with async = false: the browser downloads them
     in parallel and runs them in order (one after the other took 17 s on a
     slow phone line).  The course and the bank start downloading now too,
     not when app.js asks for them. */
  function load(code) {
    dress(code);
    ["course.json", "bank.json"].filter(function (f) { return (LANGS[code].data || DATA).indexOf(f) >= 0; }).forEach(function (f) {
      var l = document.createElement("link");
      l.rel = "preload"; l.as = "fetch"; l.crossOrigin = "anonymous";
      l.href = "lang/" + code + "/data/" + f;
      document.head.appendChild(l);
    });
    var failed = false;
    ORDER.forEach(function (entry) {
      if (!has(entry, code)) return;
      var s = document.createElement("script");
      s.src = src(entry, code);
      s.async = false;
      s.onerror = function () {
        if (failed) return;
        failed = true;
        var app = document.getElementById("app");
        if (app) app.innerHTML = '<div class="card"><p>No se pudo cargar ' + s.src + ". Revisá la conexión y volvé a abrir.</p></div>";
      };
      document.body.appendChild(s);
    });
  }

  /* El selector: una tarjeta por edición (cuando haya más de una). */
  var PLATE = { es: ["ἀγορά", "Ágora"] };
  function picker() {
    var app = document.getElementById("app");
    document.documentElement.setAttribute("data-lang", "pick");
    app.innerHTML = '<div class="pick"><img class="pick-logo" src="icons/icon.svg" alt="">' +
      "<h1>¿En qué idioma querés estudiar filosofía?</h1>" +
      "<p>Podés cambiarlo cuando quieras desde tu perfil. Cada edición guarda su propio progreso.</p>" +
      Object.keys(LANGS).map(function (c) {
        var L = LANGS[c], pl = PLATE[c] || ["", L.brand];
        return '<button class="pick-lang ' + c + '" data-lang="' + c + '">' +
          '<span class="plate"><small>' + pl[0] + "</small><b>" + pl[1] + "</b></span>" +
          '<span class="name">' + L.brand + " · " + L.name + '</span><span class="flag" aria-hidden="true">' + L.flag + "</span>" +
          '<span class="blurb">' + L.blurb + "</span></button>";
      }).join("") +
      '<p class="pick-foot">Hecha en castellano rioplatense. Anda sin internet.</p></div>';
    Array.prototype.forEach.call(app.querySelectorAll(".pick-lang"), function (b) {
      b.addEventListener("click", function () {
        var code = b.getAttribute("data-lang");
        set(KEY, code);
        app.innerHTML = '<div class="card"><p class="muted">Cargando…</p></div>';
        load(code);
      });
    });
  }

  /* Cambiar de edición desde la app (Yo). */
  function switchTo(code) {
    if (!LANGS[code]) return;
    set(KEY, code);
    location.href = location.pathname;
  }

  var api = { LANGS: LANGS, ORDER: ORDER, DATA: DATA, KEY: KEY, ERA: ERA, src: src, switchTo: switchTo,
              coreFiles: coreFiles, langFiles: langFiles, has: has, installPrompt: null };

  if (typeof module === "object" && module.exports) { module.exports = api; return; }
  root.Boot = api;
  if (typeof document === "undefined") return;          // the service worker
  // The install prompt can come while the scripts are loading: app.js takes it.
  root.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); api.installPrompt = e; });
  var code = chosen();
  if (code) load(code); else picker();
})(typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : globalThis);
