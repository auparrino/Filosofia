/*
 * El arranque: una app, dos idiomas.
 *
 * El núcleo (docs/js/: motor, interfaz, generador de ejercicios) es uno
 * solo; cada idioma es un paquete en docs/lang/<código>/ (lang.js con su
 * configuración e interfaz, rules.js con sus reglas, el conjugador, el
 * diagnóstico, la escritura, los datos y su tema).  boot.js decide el
 * idioma y carga los scripts en ORDER, alternando paquete y núcleo en el
 * orden en que se necesitan.
 *
 * El idioma sale de: ?lang=it|pt en la URL, lo último elegido
 * (localStorage «c1.lang»), o —para quien ya estudiaba— el guardado de La
 * Via C1 o de Rumo C1.  Si no hay nada, se muestra el selector.
 *
 * Bajo Node exporta ORDER y LANGS para los tests (tools/lib/pack.js); en el
 * service worker (importScripts) solo expone Boot, para saber qué archivos
 * guardar de cada idioma.
 */
(function (root) {
  "use strict";

  var LANGS = {
    it: { name: "Italiano", flag: "🇮🇹", brand: "La Via C1", storage: "laviac1",
          blurb: "De cero a C1 en un año, con los limones y el mar de la Costa Amalfitana.",
          themeColor: { light: "#9fcdec", dark: "#13294a" }, bg: "#fcf7ee",
          fonts: ["fonts/playfair-normal.woff2", "fonts/playfair-italic.woff2"] },
    pt: { name: "Português", flag: "🇧🇷", brand: "Rumo C1", storage: "rumoc1",
          blurb: "Portugués de Brasil hasta C1, con el calçadão de Copacabana de fondo.",
          themeColor: { light: "#9fdcea", dark: "#071a26" }, bg: "#fbf4e6",
          fonts: ["fonts/fraunces-normal.woff2", "fonts/fraunces-italic.woff2"] },
    // El alemán arranca chico: las seis semanas de A1 (en construcción).
    // missing: los archivos del paquete que todavía no tiene (el núcleo
    // anda sin ellos: sin frases, lecturas, radio, examen…).
    de: { name: "Deutsch", flag: "🇩🇪", brand: "Weg C1", storage: "wegc1",
          blurb: "Alemán desde cero: las primeras seis semanas de A1, con Berlín de fondo. En construcción.",
          themeColor: { light: "#c9d6e4", dark: "#121a26" }, bg: "#f6f4ef",
          fonts: [],
          missing: ["conjugator.js", "frasi_data.js", "trabajo_data.js", "formule_data.js", "lab_data.js",
                    "letture_settimana.js", "tramo_data.js", "letture_data.js", "mapas_data.js", "diagnosi.js", "scrivi.js",
                    "freq_data.js", "ascolto_data.js", "dictogloss_data.js", "esame_data.js",
                    "voci_cv_data.js", "duelli_data.js", "devolucion_data.js", "porque_data.js", "escritura_plus_data.js",
                    "variaciones_data.js", "escritos_data.js", "desglose_data.js", "biblioteca_data.js", "radio_data.js",
                    "fuera_data.js"],
          data: ["course.json"] }
  };

  // {lang: archivo} vive en docs/lang/<código>/; {core: archivo} en docs/js/;
  // {shared: archivo} en docs/lang/ (datos de los dos idiomas, van con el núcleo).
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
    { shared: "tres_lenguas_data.js" }, { core: "tres_lenguas.js" },
    { lang: "radio_data.js" }, { core: "radio.js" }, { core: "tramo.js" },
    { lang: "fuera_data.js" }, { core: "fuera.js" }, { core: "trabajo.js" },
    { core: "plan.js" }, { core: "progreso.js" }, { core: "inicio.js" },
    { core: "capas.js" }, { core: "nube.js" }, { core: "teclado.js" },
    { core: "app.js" }
  ];

  // What app.js fetches from the package (lang/<código>/data/).
  var DATA = ["course.json", "bank.json", "glossario.json", "frequenza.json"];

  var KEY = "c1.lang";

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
    // Quien ya estudiaba sigue en su idioma, sin preguntar (italiano primero:
    // esta es la dirección de La Via C1).
    for (var c in LANGS) {
      if (get(LANGS[c].storage + ".save.v1")) { set(KEY, c); return c; }
    }
    return null;
  }

  // The colors of the browser bar, the title and the fonts of the language,
  // before anything is drawn.
  function dress(code) {
    var L = LANGS[code], doc = document;
    doc.documentElement.setAttribute("data-lang", code);
    doc.title = L.brand + " — " + L.name.toLowerCase();
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

  /* El selector: una tarjeta por idioma, cada una con su mundo (el cielo
     de una plaza italiana y su placa de travertino; el mar de Ipanema, las
     ondas del calçadão y la placa azul de Río). */
  var PLATE = { it: ["la", "Via C1"], pt: ["rua", "Rumo C1"], de: ["der", "Weg C1"] };
  function picker() {
    var app = document.getElementById("app");
    document.documentElement.setAttribute("data-lang", "pick");
    app.innerHTML = '<div class="pick"><img class="pick-logo" src="icons/icon.svg" alt="">' +
      "<h1>¿Qué idioma estudiás?</h1>" +
      "<p>Podés cambiarlo cuando quieras desde tu perfil. Cada idioma guarda su propio progreso.</p>" +
      Object.keys(LANGS).map(function (c) {
        var L = LANGS[c], pl = PLATE[c] || ["", L.brand];
        return '<button class="pick-lang ' + c + '" data-lang="' + c + '">' +
          '<span class="plate"><small>' + pl[0] + "</small><b>" + pl[1] + "</b></span>" +
          '<span class="name">' + L.brand + " · " + L.name + '</span><span class="flag" aria-hidden="true">' + L.flag + "</span>" +
          '<span class="blurb">' + L.blurb + "</span></button>";
      }).join("") +
      '<p class="pick-foot">Hecha para hispanohablantes rioplatenses. Anda sin internet.</p></div>';
    Array.prototype.forEach.call(app.querySelectorAll(".pick-lang"), function (b) {
      b.addEventListener("click", function () {
        var code = b.getAttribute("data-lang");
        set(KEY, code);
        app.innerHTML = '<div class="card"><p class="muted">Cargando…</p></div>';
        load(code);
      });
    });
  }

  /* Cambiar de idioma desde la app (Io / Eu). */
  function switchTo(code) {
    if (!LANGS[code]) return;
    set(KEY, code);
    location.href = location.pathname;
  }

  var api = { LANGS: LANGS, ORDER: ORDER, DATA: DATA, KEY: KEY, src: src, switchTo: switchTo,
              coreFiles: coreFiles, langFiles: langFiles, has: has, installPrompt: null };

  if (typeof module === "object" && module.exports) { module.exports = api; return; }
  root.Boot = api;
  if (typeof document === "undefined") return;          // the service worker
  // The install prompt can come while the scripts are loading: app.js takes it.
  root.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); api.installPrompt = e; });
  var code = chosen();
  if (code) load(code); else picker();
})(typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : globalThis);
