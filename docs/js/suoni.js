/*
 * El oído: pares mínimos con alta variabilidad (HVPT: Uchihara, Karas &
 * Thomson 2025, g = 0,92 en percepción) sobre lo que el oído
 * hispanohablante no separa, habla conectada y formas reducidas (Siegel &
 * Siegel 2015), entonación, acento tónico, dictado por fragmentos (Yu,
 * Boers & Tremblay 2025) y dictogloss (Wajnryb 1990).
 *
 * Los datos son del paquete de cada idioma: ascolto_data.js
 * (window.AscoltoData: PAIRS, CONNESSO, INTONAZIONE, ACCENTO y UI, los
 * nombres de las categorías y las consignas y notas del idioma) y
 * dictogloss_data.js.  El audio lo pone el TTS del teléfono (LANG.tts), con
 * voces, velocidades y tonos distintos para simular la variabilidad de
 * hablantes, y las palabras de los pares suenan con grabaciones reales de
 * Lingua Libre cuando las hay (voci.js).  El dictado y «¿Qué forma
 * escuchaste?» usan además oraciones grabadas por personas reales (Common
 * Voice, voci_cv_data.js), si el idioma las tiene.
 *
 * Los textos de la banca, de las frases y de las grabaciones se leen de `t`,
 * `pt` o `it` (el nombre heredado del campo).
 */
(function (root) {
  "use strict";

  function req(name) { try { return typeof require === "function" ? require(name) : null; } catch (e) { return null; } }
  var Data = root.AscoltoData || req("./ascolto_data.js");
  var Dg = root.DictoglossData || req("./dictogloss_data.js");
  var Engine = root.Engine || (typeof require === "function" ? require("./engine.js") : null);
  var Banca = root.Banca || (typeof require === "function" ? require("./banca.js") : null);
  var Frasi = root.Frasi || (typeof require === "function" ? require("./frasi.js") : null);
  var CV = root.VociCV || req("./voci_cv_data.js");

  function shuffle(a, rnd) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor((rnd || Math.random)() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  // Variabilidad: velocidad × tono (y la voz, que la app elige entre las
  // voces del idioma en el teléfono).  Nunca la misma combinación dos veces seguidas.
  var RATES = [0.85, 1, 1.15], PITCHES = [0.9, 1, 1.1];
  function voiceOf(k) {
    return { rate: RATES[k % 3], pitch: PITCHES[Math.floor(k / 3) % 3], vi: k % 2 };
  }

  var UI = (Data && Data.UI) || {};
  var CAT_ES = UI.cats || {};
  function textOf(x) { return x.t || x.pt || x.it || ""; }

  function pairItem(p, k) {
    var sayB = Math.random() < 0.5, said = sayB ? p.b : p.a;
    var shown = p.written ? [p.written[0], p.written[1]] : [p.a, p.b];
    var answer = p.written ? (sayB ? p.written[1] : p.written[0]) : said;
    return { id: "suoni:" + p.id, src: "ascolto", type: "coppia", cat: p.cat, pair: p, voice: voiceOf(k),
             prompt: "¿Cuál escuchaste? · " + (CAT_ES[p.cat] || p.cat), say: said, stem: "",
             options: shown.slice(), answer: answer, accept: [answer],
             note: p.note || "", es: p.es };
  }
  // «scegli» con say ≠ answer: se oye la forma reducida del habla (cê tá,
  // pra, tô) y se elige la forma completa.  «conta»: cuántas palabras.
  function connItem(c, k) {
    var prompt = c.kind === "conta" ? UI.conta || "¿Cuántas palabras escuchaste?"
      : c.say !== c.answer ? "¿Qué quiere decir? Elegí la forma completa" : "¿Qué escuchaste? Elegí la transcripción";
    return { id: "suoni:" + c.id, src: "ascolto", type: c.kind, voice: voiceOf(k),
             prompt: prompt,
             say: c.say, stem: "", options: c.options.slice(), answer: c.answer, accept: [c.answer], note: c.note, es: c.es };
  }
  function intoItem(x, k) {
    return { id: "suoni:" + x.id, src: "ascolto", type: "intonazione", voice: voiceOf(k),
             prompt: "¿Pregunta o afirmación? Escuchá la melodía", say: x.say, stem: "",
             options: ["pregunta", "afirmación"], answer: x.answer, accept: [x.answer], es: x.es,
             note: UI.intoNote || "" };
  }
  function accItem(x, k) {
    return { id: "suoni:" + x.id, src: "ascolto", type: "accento", voice: voiceOf(k),
             prompt: UI.accPrompt || "¿Dónde cae el acento?", say: x.say, stem: "",
             options: x.options.slice(), answer: x.answer, accept: [x.answer], note: x.note, es: x.es };
  }

  /* Dictado por fragmentos: cuatro a nueve palabras de una oración de la
     banca (con su gramática ya vista) o de una frase que el alumno conoce. */
  function fragments(week, state) {
    var out = [];
    // Primero las voces reales: una oración de Common Voice de la semana,
    // cuando la hay, dos de cada tres veces.
    var real = realFragments(week);
    if (real.length && Math.random() < 2 / 3) return real;
    var B = Banca && Banca.loaded() ? Banca.bank() : null;
    if (B) B.sentences.forEach(function (s, i) {
      if ((s.w || 1) > week) return;
      (s.t || s.pt || s.it || []).slice(0, 1).forEach(function (it) {
        var n = it.split(/\s+/).length;
        if (n >= 4 && n <= 9) out.push({ text: it, id: "suoni:d:b" + i });
      });
    });
    if (Frasi && Frasi.ALL) Frasi.ALL.forEach(function (f) {
      var t = textOf(f), n = t.split(/\s+/).length;
      if (t && state && state.cards[f.id] && n >= 4 && n <= 9) out.push({ text: t, id: "suoni:d:" + f.id });
    });
    return out;
  }
  function realFragments(week) {
    return CV && CV.ALL ? CV.ALL.filter(function (x) { return x.w <= week; }).map(function (x) {
      return { text: textOf(x), id: "suoni:cv:" + x.f, audio: CV.url(x) };
    }) : [];
  }
  function dictItem(fr, k) {
    var it = { id: fr.id, src: "ascolto", type: "dictation", voice: voiceOf(k),
             prompt: UI.dictPrompt || "Dictado: escuchá y escribí exactamente lo que oís",
             say: fr.text, stem: fr.text, answer: fr.text, accept: [fr.text], dettato: true,
             note: UI.dictNote || "" };
    if (fr.audio) it.audio = fr.audio;
    return it;
  }

  /* «¿Qué forma escuchaste?»: una oración grabada, la forma que usa en
     blanco y la que compite con ella (andassi / andavo, fosse / fora).  Como
     los duelos, pero de oído: decide solo el audio.  Sin grabaciones
     (voci_cv_data.js vacío) no hay ítems. */
  function formPool(week) {
    return CV && CV.ALL ? CV.ALL.filter(function (x) { return x.a && x.fw <= week; }) : [];
  }
  function formItem(x, k) {
    var text = textOf(x), shown = text.replace(x.a, "___");
    return { id: "suoni:cvf:" + x.f, src: "ascolto", type: "forma", voice: voiceOf(k), audio: CV.url(x),
             prompt: "¿Qué forma escuchaste?", say: text, stem: shown,
             options: shuffle([x.a, x.b]), answer: x.a, accept: [x.a],
             es: "«" + text + "» · " + x.why };
  }

  function dueFirst(list, cards) {
    var now = Date.now();
    // primero lo vencido (un repaso vale más que un ítem nuevo), después lo no visto
    var rank = function (x) {
      var c = cards["suoni:" + x.id];
      if (!c) return 1 + Math.random();
      if (c.due <= now) return 0 + Math.random();
      return 2 + Math.random() + (c.due - now) / 3.15e10;
    };
    return list.map(function (x) { return { x: x, r: rank(x) }; }).sort(function (a, b) { return a.r - b.r; }).map(function (o) { return o.x; });
  }

  /* Una sesión: seis pares (como mucho tres de la misma categoría), dos de
     habla conectada, dos de entonación, uno de acento tónico, un dictado y,
     si hay grabaciones, una «¿Qué forma?».  Primero lo vencido y lo nuevo. */
  function session(state, week, opts) {
    opts = opts || {};
    var cards = (state && state.cards) || {}, wk = week || 1, k = Math.floor(Math.random() * 9), out = [];
    if (!Data) return out;
    var pairs = dueFirst(Data.PAIRS.filter(function (p) { return p.week <= wk; }), cards);
    // repartir las categorías: como mucho tres de la misma por sesión
    var byCat = {}, chosen = [];
    pairs.forEach(function (p) {
      if (chosen.length >= (opts.pairs || 6)) return;
      byCat[p.cat] = (byCat[p.cat] || 0) + 1;
      if (byCat[p.cat] <= 3) chosen.push(p);
    });
    chosen.forEach(function (p) { out.push(pairItem(p, k++)); });
    dueFirst(Data.CONNESSO.filter(function (c) { return c.week <= wk; }), cards).slice(0, 2).forEach(function (c) { out.push(connItem(c, k++)); });
    dueFirst(Data.INTONAZIONE.filter(function (x) { return x.week <= wk; }), cards).slice(0, 2).forEach(function (x) { out.push(intoItem(x, k++)); });
    dueFirst(Data.ACCENTO.filter(function (x) { return x.week <= wk; }), cards).slice(0, 1).forEach(function (x) { out.push(accItem(x, k++)); });
    if (!opts.silent) {
      var fr = fragments(wk, state);
      if (fr.length) out.push(dictItem(pick(fr), k++));
      dueFirst(formPool(wk).map(function (x) { return { id: "cvf:" + x.f, x: x }; }), cards).slice(0, 1)
        .forEach(function (o) { out.push(formItem(o.x, k++)); });
    }
    return shuffle(out);
  }

  // Un ítem para la pausa: un par o un poco de habla conectada.
  function randomItem(state, week) {
    if (!Data) return null;
    var wk = week || 1, cards = (state && state.cards) || {};
    var pool = Data.PAIRS.filter(function (p) { return p.week <= wk; });
    if (!pool.length) return null;
    var p = dueFirst(pool, cards)[0];
    return Math.random() < 0.7 ? pairItem(p, Math.floor(Math.random() * 9))
      : (function () { var c = Data.CONNESSO.filter(function (x) { return x.week <= wk; }); return c.length ? connItem(pick(c), 1) : pairItem(p, 2); })();
  }

  function progress(week, cards) {
    if (!Data) return { seen: 0, total: 0 };
    var all = Data.PAIRS.filter(function (p) { return p.week <= (week || 1); });
    return { total: all.length, seen: all.filter(function (p) { return cards["suoni:" + p.id]; }).length };
  }

  /* ------------------------------------------------------- dictogloss */

  function norm(s) {
    return String(s || "").toLowerCase().replace(/[’‘`´]/g, "'").normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z' ]+/g, " ").replace(/\s+/g, " ").trim();
  }
  function dgFor(week) {
    if (!Dg) return null;
    for (var i = 0; i < Dg.TESTI.length; i++) if (Dg.TESTI[i].week === week) return Dg.TESTI[i];
    return null;
  }
  /* Un bloque cuenta como recuperado cuando está en lo que escribiste:
     - «exacto»: aparece tal cual (sin mirar tildes, ç, guiones, apóstrofos
       ni comas, con un tipeo perdonado en las palabras largas) o con sus
       palabras en orden dentro de una ventana corta;
     - «con otra forma»: están todas sus palabras de contenido, en otro
       orden o con otra terminación (sedia / sedie, piccolo / piccola,
       domani ci vediamo): cuenta entero, y el resultado muestra el bloque
       como era, para notar la diferencia;
     - «casi»: están la mayoría de sus palabras de contenido: medio punto.
     Lo que se recupera, no lo que se copia, es lo que queda (Yu, Boers &
     Tremblay 2025); castigar el orden de un bloque que se entendió no ayuda. */
  function stem(w) { return w.length > 4 ? w.replace(/[aeiou]+$/, "") : w; }
  function near(a, b) {
    if (a === b) return true;
    if (a.length >= 4 && b.length >= 4 && stem(a) === stem(b) && stem(a).length >= 3) return true;
    var d = Engine && Engine.editDistance ? Engine.editDistance(a, b) : 9;
    return (Math.min(a.length, b.length) >= 5 && d <= 1) || (Math.min(a.length, b.length) >= 8 && d <= 2);
  }
  function isStop(w) {
    var F = root.Freq;
    return !!(F && F.STOP && F.STOP.indexOf(w) >= 0) || w.length <= 2;
  }
  function chunkMatch(chunk, given) {
    var g = norm(given), c = norm(chunk);
    if (!c || !g) return null;
    if (g.indexOf(c) >= 0) return "exact";
    var gw = g.replace(/'/g, "' ").split(" ").filter(Boolean), cw = c.replace(/'/g, "' ").split(" ").filter(Boolean);
    var close = function (a, b) { return a === b || (a.length >= 6 && Engine && Engine.editDistance(a, b) <= 1); };
    for (var i = 0; i < gw.length; i++) {
      var j = i, ok = true;
      for (var x = 0; x < cw.length; x++) {
        var found = -1;
        for (var y = j; y < Math.min(gw.length, j + 3); y++) if (close(gw[y], cw[x])) { found = y; break; }
        if (found < 0) { ok = false; break; }
        j = found + 1;
      }
      if (ok) return "exact";
    }
    // the content words, in any order and form, inside a window of the text
    var content = cw.filter(function (w) { return !isStop(w.replace(/'$/, "")); });
    if (!content.length) content = cw;
    var span = Math.max(8, cw.length * 2 + 3), best = 0;
    for (var k = 0; k < gw.length; k++) {
      var win = gw.slice(k, k + span), used = {}, hit = 0;
      content.forEach(function (w) {
        for (var q = 0; q < win.length; q++) if (!used[q] && near(win[q], w)) { used[q] = 1; hit++; return; }
      });
      if (hit > best) best = hit;
      if (best === content.length) break;
    }
    if (best === content.length) return "variant";
    if (content.length >= 2 && best >= Math.ceil(content.length * 0.5)) return "partial";
    return null;
  }
  function chunkFound(chunk, given) {
    var m = chunkMatch(chunk, given);
    return m === "exact" || m === "variant";
  }
  function dgScore(text, given) {
    var found = [], missed = [], partial = [], variant = [];
    (text.chunks || []).forEach(function (c) {
      var m = chunkMatch(c, given);
      if (m === "exact" || m === "variant") { found.push(c); if (m === "variant") variant.push(c); }
      else if (m === "partial") partial.push(c);
      else missed.push(c);
    });
    var words = norm(given).split(" ").filter(Boolean).length, n = text.chunks.length;
    return { found: found, missed: missed, partial: partial, variant: variant, n: n, words: words,
             pct: n ? Math.round((found.length + partial.length / 2) / n * 100) : 0 };
  }

  var api = { session: session, randomItem: randomItem, progress: progress, pairItem: pairItem, formItem: formItem, formPool: formPool, realFragments: realFragments, voiceOf: voiceOf,
              fragments: fragments, dictItem: dictItem, CAT_ES: CAT_ES,
              dgFor: dgFor, dgScore: dgScore, chunkFound: chunkFound, chunkMatch: chunkMatch, norm: norm,
              data: function () { return Data; }, dictogloss: function () { return Dg; } };
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Suoni = api;
})(typeof window !== "undefined" ? window : globalThis);
