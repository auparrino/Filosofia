/*
 * Voces reales: grabaciones de hablantes reales de Lingua Libre (Wikimedia
 * Commons, CC BY-SA 4.0) para las palabras de los pares mínimos del oído.
 *
 * El HVPT funciona por la variedad de hablantes reales (Uchihara, Karas &
 * Thomson 2025): la voz del teléfono simula esa variedad con velocidad y
 * tono, pero es una sola voz.  La app busca en Commons, desde el teléfono y
 * la primera vez, las grabaciones «LL-<Q> (<idioma>)-<hablante>-<palabra>.wav»
 * (Q652 ita, Q5146 por…); guarda qué encontró (localStorage) y el service
 * worker guarda el audio, así la segunda vez anda sin conexión.  Si no hay
 * grabación, sin conexión la primera vez o si falla, suena la voz del
 * teléfono como siempre.
 *
 * Lo que es del idioma viene del paquete: LANG.lingualibre y
 * VociCV.LINGUA_LIBRE (voci_cv_data.js): { q: código de Wikidata, tag:
 * etiqueta del archivo, letters: las letras de una palabra buscable (una
 * clase de regex), prefer / avoid: hablantes que van primero / al final (por
 * variedad) }.  El guardado usa el prefijo del idioma (LANG.storage).
 */
(function (root) {
  "use strict";

  var API = "https://commons.wikimedia.org/w/api.php";
  var MISS_TTL = 30 * 86400000;          // a word with no recording is asked again after a month
  var LICENSE = "Lingua Libre · CC BY-SA 4.0";

  var CFG = null;
  function cfg() {
    if (CFG) return CFG;
    var mine = (root.VociCV && root.VociCV.LINGUA_LIBRE) || {};
    var L = (root.LANG && root.LANG.lingualibre) || {};
    var esc = function (s) { return String(s || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); };
    var c = {
      q: L.q || mine.q || "", tag: L.tag || L.code || mine.tag || "",
      letters: mine.letters || L.letters || "a-z",
      prefer: mine.prefer || L.prefer || [], avoid: mine.avoid || L.avoid || []
    };
    c.prefix = "LL-" + c.q + " (" + c.tag + ")";
    c.title = new RegExp("^File:" + esc(c.prefix) + "-(.+)-([^-]+)\\.(wav|ogg|flac|mp3)$", "i");
    c.word = new RegExp("^[" + c.letters + "]+$");
    return (CFG = c);
  }
  function key() { return ((root.LANG && root.LANG.storage) || "c1") + ".voci.v1"; }

  function load() { try { return JSON.parse(root.localStorage.getItem(key()) || "{}") || {}; } catch (e) { return {}; } }
  function save(db) { try { root.localStorage.setItem(key(), JSON.stringify(db)); } catch (e) { /* lleno o bloqueado */ } }
  var db = null;
  function store() { return db || (db = load()); }

  // Preferred speakers first (the variety of the course), avoided ones last.
  function rank(user) {
    var c = cfg();
    return c.prefer.indexOf(user) >= 0 ? 0 : c.avoid.indexOf(user) >= 0 ? 2 : 1;
  }
  function nfc(s) { s = String(s || "").toLowerCase(); return s.normalize ? s.normalize("NFC") : s; }

  // Una palabra suelta, con las letras del idioma (LINGUA_LIBRE.letters):
  // nada de frases, guiones ni apóstrofos, y sin tildes donde el nombre del
  // archivo no las distingue.
  function usable(word) { return cfg().word.test(nfc(word)); }

  // File:LL-Q652 (ita)-Hablante-palabra.wav → { user, word }
  function parseTitle(title) {
    var m = cfg().title.exec(String(title || ""));
    return m ? { user: m[1], word: nfc(m[2]) } : null;
  }
  function searchUrl(word) {
    return API + "?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrlimit=20" +
      "&gsrsearch=" + encodeURIComponent('intitle:"' + cfg().prefix + '" intitle:"' + word + '"') +
      "&prop=imageinfo&iiprop=url";
  }
  // Las grabaciones de exactamente esta palabra (no «nonna» por «nonno», ni
  // «avó» por «avô», que la búsqueda de Commons confunde al ignorar tildes),
  // hasta cuatro hablantes, los preferidos primero.
  function fromApi(word, json) {
    word = nfc(word);
    var pages = (json && json.query && json.query.pages) || {}, out = [], users = {};
    Object.keys(pages).forEach(function (k) {
      var p = pages[k], t = parseTitle(p.title), info = p.imageinfo && p.imageinfo[0];
      if (!t || t.word !== word || !info || !info.url || users[t.user]) return;
      users[t.user] = 1;
      out.push({ url: info.url, user: t.user });
    });
    out.sort(function (a, b) { return rank(a.user) - rank(b.user); });
    return out.slice(0, 4);
  }

  var pending = {};
  // cb(list): [] cuando no hay ninguna (o no hay red, la primera vez).
  function lookup(word, cb) {
    word = nfc(word);
    if (!usable(word) || typeof fetch !== "function") return cb([]);
    var hit = store()[word];
    if (hit && (hit.list.length || Date.now() - hit.at < MISS_TTL)) return cb(hit.list);
    if (pending[word]) { pending[word].push(cb); return; }
    pending[word] = [cb];
    var done = function (list, keep) {
      if (keep) { store()[word] = { at: Date.now(), list: list }; save(store()); }
      var cbs = pending[word]; delete pending[word];
      cbs.forEach(function (f) { f(list); });
    };
    var ctl = typeof AbortController === "function" ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctl) ctl.abort(); }, 6000);
    fetch(searchUrl(word), { signal: ctl ? ctl.signal : undefined })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { clearTimeout(timer); done(j ? fromApi(word, j) : [], !!j); })
      .catch(function () { clearTimeout(timer); done([], false); });     // sin conexión: se vuelve a preguntar la próxima vez
  }
  // Calienta la caché con las palabras de una sesión (así el primer toque suena enseguida).
  function prefetch(words) { (words || []).forEach(function (w) { lookup(w, function () {}); }); }

  var last = 0, current = null;
  /* Reproduce una grabación real de la palabra, con un hablante distinto
     cada vez.  opts.rate: velocidad; opts.onplay(crédito): a quién citar;
     fallback(): la voz del teléfono, cuando no hay nada que reproducir. */
  function play(word, opts, fallback) {
    opts = opts || {};
    lookup(word, function (list) {
      if (!list.length || typeof root.Audio !== "function") return fallback && fallback();
      var rec = list[(last++) % list.length];
      try {
        if (current) current.pause();
        var a = new root.Audio(rec.url);
        current = a;
        if (opts.rate) a.playbackRate = opts.rate;
        a.onerror = function () { if (fallback) fallback(); };
        var p = a.play();
        if (p && p.catch) p.catch(function () { if (fallback) fallback(); });
        if (opts.onplay) opts.onplay(rec.user + " · " + LICENSE);
      } catch (e) { if (fallback) fallback(); }
    });
  }
  // Todos aquellos cuya voz usó la app: para los créditos en el perfil.
  function credits() {
    var users = {};
    var s = store();
    Object.keys(s).forEach(function (w) { (s[w].list || []).forEach(function (r) { (users[r.user] = users[r.user] || []).push(w); }); });
    return users;
  }
  function count() {
    var s = store(), n = 0;
    Object.keys(s).forEach(function (w) { if ((s[w].list || []).length) n++; });
    return n;
  }

  var api = { lookup: lookup, prefetch: prefetch, play: play, usable: usable, parseTitle: parseTitle,
              fromApi: fromApi, searchUrl: searchUrl, credits: credits, count: count, LICENSE: LICENSE,
              PREFER: cfg().prefer, AVOID: cfg().avoid,
              _reset: function () { db = {}; CFG = null; } };
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Voci = api;
})(typeof window !== "undefined" ? window : globalThis);
