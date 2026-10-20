/*
 * La serie de escucha «Radio» / «Rádio»: de la semana 6 a la 25 (sin los
 * jefes), un programa corto de radio por semana, a dos voces, con personajes
 * que vuelven, la gramática y las palabras de la semana, de ~120 palabras en
 * la 6 a ~300 en la 25.  Tres preguntas de comprensión (en castellano hasta
 * la 13, en la lengua meta desde la 14), dos o tres «¿lo dice o no lo
 * dice?» y la transcripción al final.
 *
 * El reproductor es el de la escucha larga del tramo (js/tramo.js, pantalla
 * tramo-asc: las dos voces del teléfono, dos escuchas con las preguntas a la
 * vista, la transcripción después): Tramo.open("rad", semana) le pide el
 * episodio a Radio.asWeek.  Este módulo tiene los datos, la misión del
 * percorso, lo que guarda y la lista de Leggi / Ler.
 *
 *   Radio.missions(w, state)   la misión «📻 Radio: …» de la semana (weekPlan):
 *                              obligatoria, hecha con 60 % de comprensión o
 *                              después de escucharlo una segunda vez (como la
 *                              lectura: 70 % o releerla)
 *   Radio.weekButtons(state, semana) / Radio.leggiFold(state, semana, estaciones)
 *                              el episodio de esta semana y la serie entera, en Leggi
 *   Radio.record(state, semana, {pct, ok, n})
 *
 * Los minutos cuentan como input: el reproductor anota los segundos
 * escuchados (noteListening → state.ascolto, que suma Progreso.inputWeek), la
 * pantalla tramo-asc cuenta en el reloj como input, y las respuestas bien
 * dan xp de la cuerda de input.  En el plan del día (js/plan.js) la misión
 * «radio» es un bloque de input.
 *
 * Datos: lang/<código>/radio_data.js (window.RADIO_DATA), que arma
 * tools/lib/build_radio.js con tools/<código>/radio/.  Guarda en
 * state.radio {semana: {pct (el mejor), last, ok, n, tries, at}}.
 * Test: tools/lib/test_radio.js.
 */
(function (root) {
  "use strict";

  var PASS = 60;          // % of comprehension that makes the mission done

  function D() { return root.RADIO_DATA || { EPISODI: [] }; }
  function LG() { return root.LANG || {}; }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function langAttr() { return ' lang="' + (LG().tts || LG().code || "") + '"'; }
  function label() { return D().label || "Radio"; }

  function episodes() { return D().EPISODI || []; }
  function episode(n) {
    var list = episodes();
    for (var i = 0; i < list.length; i++) if (list[i].week === +n) return list[i];
    return null;
  }
  function weeks() { return episodes().map(function (e) { return e.week; }); }
  function words(e) {
    return String((e.turns || []).map(function (t) { return t[1]; }).join(" ")).split(/\s+/)
      .filter(function (x) { return /[A-Za-zÀ-ÿ]/.test(x); }).length;
  }
  // The transcript as plain text, one turn per line: «Nome: battuta».
  function transcript(e) {
    return (e.turns || []).map(function (t) { return (e.speakers[t[0] === "A" ? 0 : 1] || t[0]) + ": " + t[1]; }).join("\n");
  }

  // The episode as a week of the tramo: what Tramo's player reads.
  function asWeek(n) {
    var e = episode(n);
    return e ? { week: e.week, level: e.level, ascolto: e, radio: true } : null;
  }

  function store(state) {
    var s = state || {};
    if (!s.radio || typeof s.radio !== "object" || Array.isArray(s.radio)) s.radio = {};
    return s.radio;
  }
  // 60 %, or a second attempt with 40 %, or a third one (Engine.passed, 3.1)
  function done(rec) {
    var E = root.Engine;
    return E && E.passed ? E.passed(rec, PASS) : !!rec && (rec.pct >= PASS || (rec.tries || 0) >= 2);
  }
  function record(state, week, r) {
    var s = store(state), prev = s[week] || null;
    var rec = { pct: prev ? Math.max(prev.pct, r.pct) : r.pct, last: r.pct, ok: r.ok, n: r.n,
                tries: (prev && prev.tries || 0) + 1, at: Date.now(), v: 31 };
    s[week] = rec;
    return rec;
  }
  // What the result screen says about the mission.
  function verdict(state, week) {
    var rec = store(state)[week];
    if (!rec) return "";
    if (rec.pct >= PASS) return "Misión hecha: " + rec.pct + " % de comprensión (hacía falta " + PASS + " %).";
    if (done(rec)) return "Misión hecha: lo escuchaste " + (rec.tries || 2) + " veces. Leé la transcripción con calma y volvé cuando quieras.";
    var E = root.Engine;
    return (E && E.passMissing ? E.passMissing(rec, PASS) : "Con " + PASS + " % queda hecha la misión") +
      ". Leé la transcripción, escuchalo otra vez con el texto y volvé a responder.";
  }

  /* ---------------------------------------------------------- misiones */

  function missions(w, state) {
    if (!w || w.boss) return [];
    var e = episode(w.week);
    if (!e) return [];
    var rec = store(state)[w.week], ok = done(rec), lang = (LG().ui || {}).langEs || "la lengua";
    return [{ kind: "radio", arg: String(w.week), done: ok, half: !!rec && !ok, ico: "📻",
      title: esc(label()) + ": " + esc(e.title),
      sub: ok ? "Hecho · " + rec.pct + " %"
        : rec ? "Tu mejor: " + rec.pct + " % · " + (root.Engine && root.Engine.passMissing ? root.Engine.passMissing(rec, PASS) : "con " + PASS + " % queda hecho")
        : "Unas " + words(e) + " palabras a dos voces · dos escuchas con las preguntas a la vista, en " +
          (e.qlang === "es" ? "castellano" : lang) + " · con " + PASS + " % queda hecho" }];
  }

  /* ------------------------------------------------------ en «Leggi» */

  function button(state, e, open) {
    var d = store(state)[e.week];
    return '<button class="ep' + (d ? " done" : "") + '" data-radio="' + e.week + '"' + (open ? "" : " disabled") + ">" +
      '<span class="e">' + (open ? "📻" : "🔒") + "</span><span><b" + langAttr() + ">" + esc(e.title) + "</b>" +
      '<span class="muted">' + esc(label()) + " · semana " + e.week + " · " + esc(e.level) + " · " +
        (open ? "<span" + langAttr() + ">" + esc(e.genre) + "</span>" : "se abre en la semana " + e.week) + "</span></span>" +
      (d ? '<span class="score">' + d.pct + "%</span>" : "") + "</button>";
  }
  // «Esta semana»: the episode of the week, if there is one.
  function weekButtons(state, week) {
    var e = episode(week);
    return e ? [button(state, e, true)] : [];
  }
  // The whole series, folded (Capas.fold), by season.
  function leggiFold(state, week, seasonNames) {
    var list = episodes(), C = root.Capas;
    if (!list.length) return "";
    var mine = store(state), heard = list.filter(function (e) { return mine[e.week]; }).length;
    var items = list.map(function (e) { return { week: e.week, done: !!mine[e.week], html: button(state, e, e.week <= week) }; });
    var body = '<p class="muted">' + esc(D().blurb || "") + "</p>" +
      (C ? C.seasons("lg:radio", items, week, seasonNames) : '<div class="eps">' + items.map(function (x) { return x.html; }).join("") + "</div>");
    var meta = week < list[0].week ? "🔒 desde la semana " + list[0].week : heard + " / " + list.length;
    var title = "📻 " + esc(D().name || label());
    return C ? C.fold("lg:radio", title, meta, body) : "<h2>" + title + "</h2>" + body;
  }

  var api = { PASS: PASS, episodes: episodes, episode: episode, weeks: weeks, words: words, transcript: transcript,
              asWeek: asWeek, store: store, record: record, done: done, verdict: verdict, missions: missions,
              weekButtons: weekButtons, leggiFold: leggiFold, label: label };
  if (typeof module === "object" && module.exports) module.exports = api;
  root.Radio = api;
})(typeof window !== "undefined" ? window : globalThis);
