/*
 * La interfaz del juego, una para todas las ediciones.  Pantallas: hoy
 * («oggi»), entrenar («frasi»), leer («leggi»), el camino («percorso»),
 * el perfil («io»), la semana (briefing), la teoría, la lección jugada, la
 * ronda y el resultado.
 *
 * El núcleo no nombra ningún idioma: los textos de la interfaz, la voz, el
 * prefijo de guardado, las listas de la lengua y la estética salen del
 * paquete del idioma (window.LANG, docs/lang/<código>/lang.js).  Los nombres
 * internos de pantallas y rondas («oggi», «gioco», «pausa»…) son
 * los de siempre: el esquema de datos y la API entre módulos no cambian.
 */
(function () {
  "use strict";

  var LG = window.LANG || {}, UI = LG.ui || {};
  // Storage keys of the language (LANG.storage + "."): the progress of
  // each language lives under its own prefix.
  var SKEY = function (k) { return (LG.storage || "agora") + "." + k; };
  // A word of the language: letters, the apostrophe, and the hyphen where
  // the language writes it inside words (chama-se).
  var WCH = "a-zà-ÿ'" + (LG.hyphenWords ? "-" : "");
  var DATA = function (f) { return (LG.base || "") + "data/" + f; };
  // «Settimana XVII» or «Semana 17».
  function weekNum(n) { return UI.romanWeeks ? romano(n) : String(n); }
  // The street sign of the logo and the titles (a Roman targa, a sign of Rio).
  var PL = UI.plate || { cls: "targa", sup: "t-sup", main: "t-via" };
  function plate(sup, main, big, tag) {
    tag = tag || "h1";
    return "<" + tag + ' class="' + PL.cls + (big ? " big" : "") + '"><span class="' + PL.sup + '">' + sup +
      '</span><span class="' + PL.main + '">' + main + "</span></" + tag + ">";
  }

  var course = null;
  var state = Engine.load();
  // Devoluciones: the names of tenses follow the week the learner is in.
  var DV = window.Devolucion || null;
  if (DV) DV.weekFrom(function () { return Math.min(state.unlocked || 1, NW()); });

  /* Tema: "" sigue al teléfono; "light" u "dark" lo fuerzan.  Se aplica antes
     de dibujar nada, así no hay parpadeo. */
  function themeNow() {
    return state.theme || (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }
  function applyTheme() {
    document.documentElement.dataset.theme = state.theme || "";
    var dark = themeNow() === "dark";
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) {
      if (!m.dataset.auto) m.dataset.auto = m.content;
      var tc = LG.themeColor || {};
      m.content = state.theme ? (dark ? tc.dark : tc.light) || m.dataset.auto : m.dataset.auto;
    });
  }
  applyTheme();
  var view = { screen: "oggi", week: 1, tab: "oggi" };
  var round = null;
  var itemMap = {};
  var installPrompt = null;

  var $ = function (sel) { return document.querySelector(sel); };
  var app = function () { return $("#app"); };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function toast(msg, ms) {
    var t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, ms || 2200);
  }

  var saveWarned = false;
  /* Saving writes the whole state (hundreds of KB after a few months): a
     burst of changes (every answer, every key in the exam) is saved once,
     a quarter of a second later, and right away when the app is hidden or
     closed. */
  var persistTimer = null;
  function persist() {
    // when the progress last changed: the cloud copy compares against it (nube.js)
    state.savedAt = Date.now();
    if (persistTimer) return;
    persistTimer = setTimeout(flushPersist, 250);
  }
  function flushPersist() {
    if (persistTimer) { clearTimeout(persistTimer); persistTimer = null; }
    if (!Engine.save(state) && !saveWarned) {
      saveWarned = true;
      toast("⚠️ No puedo guardar tu progreso: el teléfono no tiene espacio o bloquea el almacenamiento. " +
            "Liberá espacio o guardá una copia en " + UI.me + ".", 6000);
    }
  }

  /* --------------------------------------------------- sonidos y vibración */

  var audioCtx = null;
  function tone(freqs, dur, type) {
    if (state.silent) return;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      audioCtx = audioCtx || new AC();
      var t0 = audioCtx.currentTime;
      freqs.forEach(function (f, i) {
        var o = audioCtx.createOscillator(), g = audioCtx.createGain();
        o.type = type || "sine";
        o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t0 + i * dur);
        g.gain.exponentialRampToValueAtTime(0.12, t0 + i * dur + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + (i + 1) * dur);
        o.connect(g); g.connect(audioCtx.destination);
        o.start(t0 + i * dur); o.stop(t0 + (i + 1) * dur + 0.02);
      });
    } catch (e) { /* sin audio */ }
  }

  function buzz(pattern) {
    try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (e) { /* */ }
  }

  var fx = {
    right: function () { tone([660, 880], 0.07); buzz(18); },
    close: function () { tone([520], 0.1); buzz(18); },
    wrong: function () { tone([200, 160], 0.1, "triangle"); buzz([50, 40, 50]); },
    goal: function () { tone([523, 659, 784, 1046], 0.11); buzz([30, 30, 30, 30, 80]); },
    tap: function () { buzz(8); }
  };

  /* Confetti: the language's emoji (LANG.confetti.bits) and, when the theme
     gives colors (LANG.confetti.colors, CSS tokens), paper bits in the
     colors of the palette with an emoji now and then. */
  function confetti() {
    // «Reduce motion» on the phone: no confetti falling
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var cf = LG.confetti || { bits: ["🎉", "✨", "⭐"], n: 16, ms: 1900 };
    var bits = cf.bits, col = null;
    if (cf.colors) {
      var cs = getComputedStyle(document.documentElement);
      col = cf.colors.map(function (v) {
        return (cs.getPropertyValue(v) || "").trim() || cf.fallback || "#888888";
      }).concat(["#ffffff"]);
    }
    var box = document.createElement("div");
    box.className = "confetti";
    for (var i = 0; i < (cf.n || 16); i++) {
      var s = document.createElement("span");
      if (!col) {
        s.textContent = bits[i % bits.length];
        s.style.fontSize = 14 + Math.random() * 18 + "px";
      } else if (i % 6 === 5) {
        s.textContent = bits[(i / 6 | 0) % bits.length];
        s.style.fontSize = 16 + Math.random() * 14 + "px";
      } else {
        s.className = "bit" + (i % 3 === 0 ? " round" : "");
        s.style.background = col[i % col.length];
        s.style.width = 6 + Math.random() * 6 + "px";
        s.style.height = 10 + Math.random() * 8 + "px";
      }
      s.style.left = Math.random() * 100 + "%";
      s.style.animationDelay = Math.random() * 0.5 + "s";
      if (col) s.style.animationDuration = 1.8 + Math.random() * 0.9 + "s";
      box.appendChild(s);
    }
    document.body.appendChild(box);
    setTimeout(function () { box.remove(); }, cf.ms || 1900);
  }

  /* -------------------------------------------------------- xp y meta */

  // «+10» rises from the answer towards the daily ring.
  function xpFly(n) {
    var ring = document.querySelector(".ring");
    var fb = $("#fb");
    var y = fb && fb.getBoundingClientRect().top ? Math.min(window.innerHeight * 0.55, fb.getBoundingClientRect().top) : window.innerHeight * 0.4;
    var el = document.createElement("div");
    el.className = "xpfloat";
    el.textContent = "+" + n;
    el.style.left = (window.innerWidth / 2 - 20) + "px";
    el.style.top = y + "px";
    document.body.appendChild(el);
    setTimeout(function () { el.remove(); if (ring) ring.classList.add("bump"); }, 900);
  }

  function dias(n) { return n + (n === 1 ? " día" : " días"); }

  function gain(n) {
    if (!n) return;
    var lvBefore = Engine.levelFor(state.xp).level;
    var hit = Engine.addXp(state, n);
    var lvAfter = Engine.levelFor(state.xp).level;
    if (lvAfter > lvBefore) {
      var rkB = Engine.rankFor(lvBefore), rkA = Engine.rankFor(lvAfter);
      setTimeout(function () {
        fx.goal();
        toast(rkA !== rkB ? "🎖️ ¡Nuevo rango: " + rkA + "! (nivel " + lvAfter + ")"
                          : "⬆️ ¡Nivel " + lvAfter + "!", 2600);
      }, hit ? 3400 : 300);
    }
    Engine.touchStreak(state);
    if (hit) {
      setTimeout(function () {
        fx.goal();
        confetti();
        toast("🎯 ¡Meta del día cumplida! Abrí tu cofre en " + UI.today + ".", 3200);
      }, 350);
    }
  }

  /* ------------------------------------------------------------- pronunciación */

  var voice = null, voices = [];
  // force: the learner tapped 🔊 explicitly, so play even in office mode
  // (they may have earphones on).  opts: { pitch, vi (which voice of the language),
  // onboundary, onend, onstart, keep (do not cancel what is playing) }.
  function speak(text, force, rate, opts) {
    if (!window.speechSynthesis) return null;
    if (state.silent && !force) return null;
    opts = opts || {};
    var u = new SpeechSynthesisUtterance(String(text).replace(/_+/g, " "));
    u.lang = LG.tts;
    var v = opts.vi != null && voices.length ? voices[opts.vi % voices.length] : voice;
    if (v) u.voice = v;
    u.rate = rate || 0.95;
    if (opts.pitch) u.pitch = opts.pitch;
    if (opts.onboundary) u.onboundary = opts.onboundary;
    if (opts.onend) u.onend = opts.onend;
    if (opts.onerror) u.onerror = opts.onerror;
    if (opts.onstart) u.onstart = opts.onstart;
    if (!opts.keep) window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    return u;
  }
  /* What is read aloud after an answer.  Only the language studied: a
     Spanish gloss or option (¡Ojalá!, botas de montaña) is never read with
     the voice of the language.  Spanish: what LANG.spanish.sure finds (ñ,
     ¿, ¡…), or more Spanish-only words than words only of the language;
     words of both (LANG.spanish.both) do not count.
     LANG.spanish.notEs: letters only the language has.  An unknown word
     spelled like LANG.spanish.unknownEs is Spanish. */
  var SP = LG.spanish || {};
  var wordSet = function (str) { var o = {}; String(str || "").split(" ").forEach(function (w) { if (w) o[w] = 1; }); return o; };
  var ES_WORDS = wordSet(SP.es), TARGET_WORDS = wordSet(SP.target);
  var BOTH = wordSet(SP.both);         // say nothing about the language
  function spanishText(text) {
    text = String(text || "");
    if (SP.sure && SP.sure.test(text)) return true;
    if (SP.notEs && SP.notEs.test(text)) return false;
    var es = 0, tg = 0;
    (text.toLowerCase().match(SP.word || /[a-zà-ÿ]+/g) || []).forEach(function (w) {
      if (BOTH[w]) return;
      var isTg = TARGET_WORDS[w], isEs = ES_WORDS[w];
      if (isEs && !isTg) es++;
      else if (isTg && !isEs) tg++;
      else if (!isTg && !isEs && SP.unknownEs && SP.unknownEs.test(w)) es++;      // spelled like Spanish
    });
    return es > tg;
  }
  // «¿Qué significa?», «¿Qué es «…»?»: the options are Spanish (unless it
  // asks for the language: LANG.spanish.askTarget).
  function asksMeaning(it) {
    return /¿\s*qu[ée] (significa|es|son|expresa|quiere decir)\b/i.test(it.prompt || "") &&
      !(SP.askTarget && SP.askTarget.test(it.prompt || ""));
  }
  /* A gap exercise, answered: the whole sentence with the gaps filled
     («Eu gosto de estudar», «Gli piace studiare», not just the gap); in «A → ___» only what is
     after the arrow.  The Spanish hints in brackets are left out. */
  function filledStem(it) {
    var stem = String(it.stem || "");
    if (!/_{3,}/.test(stem)) return null;
    if (stem.indexOf("→") >= 0) stem = stem.slice(stem.lastIndexOf("→") + 1);
    var answers = String(it.answer || "").split(/\s*\|\s*/).map(function (a) {
      return /^\(.*\)$/.test(a.trim()) ? "" : a.trim();          // «(sin artículo)»: nothing goes there
    });
    var k = 0;
    // an answer that glues to a neighbour (LANG.glue): an elided one joins
    // the next word (l’amica), a hyphen one the word before it (chama-se)
    var out = stem.replace(/\([^)]*\)/g, " ").replace(/_{3,}/g, function () {
      var a = answers[k++] || "";
      var gl = LG.glue ? LG.glue(a) : null;
      return gl === "next" ? a + "\u0000" : gl === "prev" ? "\u0001" + a : a;
    });
    return out.replace(/\u0000\s*/g, "").replace(/\s*\u0001/g, "").replace(/\s+([,.;:!?])/g, "$1").replace(/\s+/g, " ").trim();
  }
  /* The voices of the language (LANG.voiceRe); with a preferred variant
     (LANG.voicePrefer: one variant before the others) those first, and the local ones
     before the network ones. */
  function pickVoice() {
    if (!window.speechSynthesis) return;
    var vs = window.speechSynthesis.getVoices();
    var re = LG.voiceRe || new RegExp("^" + String(LG.tts || "").slice(0, 2), "i");
    voices = vs.filter(function (v) { return re.test(v.lang); });
    if (LG.voicePrefer) {
      var pref = function (v) { return LG.voicePrefer.test(v.lang) ? 0 : 1; };
      voices.sort(function (a, b) { return pref(a) - pref(b) || (b.localService ? 1 : 0) - (a.localService ? 1 : 0); });
    }
    voice = voices[0] || null;
  }
  if (window.speechSynthesis) {
    pickVoice();
    window.speechSynthesis.onvoiceschanged = pickVoice;
  }

  function drillOpts() {
    return { silent: state.silent, map: itemMap };
  }

  /* --------------------------------------------------------------- header */

  function renderHeader() {
    var lv = Engine.levelFor(state.xp);
    var todayXp = Engine.todayXp(state);
    var goal = Engine.goalFor(state);
    var pct = Math.min(100, Math.round(todayXp / goal * 100));
    $("#hdr").innerHTML =
      '<div class="bar">' +
        // The logo is a street sign of the language (LANG.ui.plate).
        '<button class="brand ' + PL.cls + '" id="home" title="' + esc(Engine.rankFor(lv.level)) +
          '"><span class="' + PL.sup + '">' + UI.level + " " + lv.level + '</span><span class="' + PL.main + '">' + UI.logo + "</span></button>" +
        '<div class="stats">' +
          '<div class="stat' + (state.streak > 0 ? " hot" : "") + '"><b>' + state.streak + "<i>🔥</i></b><span>racha</span></div>" +
          '<div class="stat"><b>' + (state.shields || 0) + '🛡️</b><span>escudos</span></div>' +
          '<div class="ring" style="--p:' + pct + '" title="meta diaria">' +
            '<b>' + (pct >= 100 ? "✓" : todayXp) + '</b></div>' +
          (state.streak >= 7 ? '<div class="stat boost" title="racha de 7: xp ×1,2"><b>×1,2</b><span>xp</span></div>' : "") +
          (state.boost > 0 ? '<div class="stat boost" title="doble xp en la próxima ronda"><b>🎟️' + state.boost + '</b><span>doble</span></div>' : "") +
          '<button class="mode" id="mode" title="modo oficina" aria-label="Modo oficina: sin sonidos" aria-pressed="' + (state.silent ? "true" : "false") + '">' +
            (state.silent ? "🤫" : "🔊") + '</button>' +
          '<button class="mode" id="theme" title="tema claro u oscuro" aria-label="Tema oscuro" aria-pressed="' + (themeNow() === "dark" ? "true" : "false") + '">' +
            (themeNow() === "dark" ? "🌙" : "☀️") + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="xpbar"><i style="width:' +
        Math.round(lv.into / lv.need * 100) + '%"></i></div>';
    $("#home").onclick = function () { go("oggi"); };
    $("#theme").onclick = function () {
      state.theme = themeNow() === "dark" ? "light" : "dark";
      persist();
      applyTheme();
      renderHeader();
      if (view.screen === "io") render();
    };
    $("#mode").onclick = function () {
      state.silent = !state.silent;
      persist();
      renderHeader();
      toast(state.silent
        ? "🤫 Modo oficina: nada suena solo. Todo con el pulgar."
        : "🔊 Modo normal: las frases se leen en voz alta.", 2800);
      if (view.screen !== "gioco") render();
    };
  }

  /* Un aliento en la lengua cuando falta poco: se muestra junto al contador. */
  function dai(i, n) {
    var ch = UI.cheer || {};
    var t = n < 3 ? "" : i === n - 1 ? ch.last : i >= Math.ceil(n * 0.75) ? ch.almost
          : n >= 6 && i === Math.floor(n / 2) ? ch.half : "";
    return t ? '<span class="dai">' + t + "</span>" : "";
  }

  function go(tab) {
    view.tab = view.screen = tab;
    render();
    window.scrollTo(0, 0);
    // The path opens at the week you are in, not at week 1 (52 nodes).
    if (tab === "percorso") {
      var cur = document.querySelector(".node.current") || document.querySelector(".node:not(.locked):last-of-type");
      if (cur) try { cur.scrollIntoView({ block: "center" }); } catch (e) { /* */ }
    }
  }

  /* ------------------------------------------------------------------ hoje */

  function weekTopHtml(w, plan, doneN, nm) {
    return '<div class="card weekcard hero" id="weektop">' +
      '<span class="muted">🗺️ ' + UI.path + " · semana " + w.week + " · " + esc(w.level) + " · " + doneN + " / " + plan.length + " misiones</span>" +
      "<b>" + esc(w.title) + "</b>" +
      '<span class="prog"><i style="width:' + Math.round(doneN / Math.max(1, plan.length) * 100) + '%"></i></span>' +
      (nm
        ? '<span class="muted">Siguiente: <b>' + nm.ico + " " + nm.title + "</b>" + (nm.sub ? " · " + nm.sub.split(" · ")[0] : "") + "</span>" +
          '<span class="row" style="margin-top:10px"><button class="btn" id="heronext">▶︎ Seguir</button>' +
          '<button class="tab" data-week="' + w.week + '">Ver la semana</button></span>'
        : '<span class="muted">Semana completa. ' + (state.unlocked > w.week ? "Seguí con la siguiente." : "Repasá o entrená para abrir la siguiente.") + "</span>" +
          '<span class="row" style="margin-top:10px"><button class="btn" data-week="' + w.week + '">Ver la semana</button>' +
          '<button class="tab" id="topercorso">' + UI.path + "</button></span>") +
      "</div>";
  }

  /* The phrase of the day: a concept of the weeks already open (the same
     one all day), with its example. */
  function phraseOfTheDay() {
    var pool = [];
    course.weeks.slice(0, Math.min(state.unlocked || 1, course.weeks.length)).forEach(function (w) { (w.vocab || []).forEach(function (v) { pool.push(v); }); });
    var d = new Date(), v = pool.length ? pool[(d.getFullYear() * 400 + d.getMonth() * 31 + d.getDate()) % pool.length] : ["", "", ""];
    var o = { es: v[1], note: v[2] ? "*" + v[2] + "*" : "" };
    o[LG.code] = v[0];
    return o;
  }

  function renderOggi() {
    var goal = Engine.goalFor(state);
    var todayXp = Engine.todayXp(state);
    var reached = todayXp >= goal;
    var chestOpen = state.chest === Engine.dayKey();
    var due = Drills.dueCount(course, state, itemMap);
    var dueToday = Math.min(due, 20);
    var weekend = Engine.goalFor(state) < (Engine.goalValue ? Engine.goalValue(state.goal) : state.goal || 200);
    var strands = Engine.strandsLast(state, 7);
    var dailyDone = state.dailyDone === Engine.dayKey();
    var w = course.weeks[Math.min(state.unlocked, NW()) - 1];
    var f = phraseOfTheDay();
    var fText = f[LG.code];
    var hour = new Date().getHours();
    var hello = UI.hello(hour);
    if (window.Inicio) Inicio.checkPhase();          // aprobado el examen: el modo mantenimiento
    var maint = state.phase === "mantenimiento";
    var anyLesson = Object.keys(state.read || {}).length > 0 || Object.keys(state.readSess || {}).length > 0 || state.unlocked > 1;

    var plan = weekPlan(w), doneN = plan.filter(function (x) { return x.done; }).length;
    var nm = nextMission(w);
    // The top: the greeting and the plan of the day (inicio.js, plan.js).
    var top = window.Inicio ? Inicio.oggiTop() : { first: false, html: "" };
    var html = '<h1 class="hello">' + hello + '</h1>' +
      '<p class="lead">' + (top.first ? "Empezás hoy. Un paso por vez: lo primero es la lección." :
        maint ? "Terminaste el curso. Ahora, que no se pierda: poco y seguido."
        : weekend ? "Fin de semana: meta a la mitad. Algo liviano alcanza." + (state.streak > 1 ? " Llevás <b>" + dias(state.streak) + "</b>." : "")
        : state.streak > 1 ? "Llevás <b>" + dias(state.streak) + "</b> seguidos" + (state.streak >= 7 ? " y tu xp vale ×1,2" : "") + "."
        : "Seguí con tu semana: la próxima misión está acá abajo.") + "</p>";

    var pend = loadPending();
    var pendHtml = pend ? '<div class="card weekcard first"><span class="muted">⏸️ Dejaste algo a medias</span>' +
        "<b>" + esc(pendingTitle(pend)) + "</b>" +
        '<span class="row" style="margin-top:10px"><button class="btn" id="resume">Seguir donde estaba</button>' +
        '<button class="tab" id="discard">Descartar</button></span></div>' : "";

    // Until the first lesson: a single card (and what was left half done).
    if (top.first) return html + pendHtml + top.html + versionLine();
    // «Never two days in a row» (plan 1.3): if yesterday had nothing and today
    // has nothing yet, the top is only the 2-minute button (the return card,
    // after three days away, has its own).
    var gentle = Engine.daysAway(state) >= 2 && Engine.daysAway(state) < 3 && state.totals.attempts > 0 && Engine.todayXp(state) <= 0;
    html += top.html + pendHtml + (pend ? "" : dosCard(gentle));
    // The week of the percorso and its next mission, on top (3.2: the
    // percorso organises the day, not a plan by minutes).
    if (!maint && !gentle) html += weekTopHtml(w, plan, doneN, nm);
    // One habit card a day at most, that can be put off (the return first).
    if (!gentle) html += window.Inicio ? Inicio.habit(oggiHabitCards()) : oggiHabitCards().map(function (c) { return c.html; }).join("");

    // Everything else, folded: «Más».
    var more = "";
    // xp: the game's currency (the goal is in minutes, in the plan above)
    more += '<div class="card goal">' +
      '<div class="goalrow"><div><b>xp de hoy</b>' +
        '<span class="muted"> ' + (reached ? "✓ " + todayXp + " xp" : todayXp + " / " + goal + " xp") +
        "</span></div>" +
        (chestOpen ? '<span class="muted">🎁 cofre abierto · volvé mañana</span>'
          : reached ? '<span class="muted">🎁 el cofre está arriba</span>' : '<span class="muted">🎁 al llegar a ' + goal + " xp</span>") +
      "</div>" +
      '<div class="goalbar"><i style="width:' +
        Math.min(100, Math.round(todayXp / goal * 100)) + '%"></i></div>' +
      "</div>";

    // Shortcuts, each when it makes sense: the pause once a lesson was
    // read, the challenge too, the review when something is due.
    more += '<div class="big">' +
      (anyLesson ? '<button class="bigbtn pausa" id="pausa"><span class="e">☕</span>' + UI.pausaBtn + "</button>" : "") +
      (anyLesson && !maint ? '<button class="bigbtn giorno" id="giorno"' + (dailyDone ? " disabled" : "") + '>' +
        '<span class="e">🎯</span><b>' + UI.daily + "</b><small>" +
        (dailyDone ? "✓ hecha · mañana hay otra" : "6 preguntas · doble xp") + "</small></button>" : "") +
      (due ? '<button class="bigbtn ripasso" id="rev"><span class="e">🔁</span><b>' + UI.review + "</b><small>" +
        "hoy: " + dueToday + (due > 20 ? " (quedan " + due + ")" : " para repasar") + "</small></button>" : "") +
      "</div>";

    // Las cuatro cuerdas de la semana (Nation): dónde falta, un consejo.
    var tot = strands.input + strands.output + strands.forma + strands.fluidez;
    if (tot > 0) {
      var NAMES = { input: "Input", output: "Output", forma: "Forma", fluidez: "Fluidez" };
      var TIP = { input: "leé el texto del seminario", output: "escribí en el seminario",
                  forma: "una ronda de la semana", fluidez: "un repaso o «2 minutos»" };
      var low = Engine.STRANDS.slice().sort(function (a, b) { return strands[a] - strands[b]; })[0];
      more += '<div class="card"><b>🎻 Tus cuatro cuerdas · últimos 7 días</b>' +
        '<div class="strands">' + Engine.STRANDS.map(function (k) {
          return '<i class="s-' + k + '" style="width:' + Math.round(strands[k] / tot * 100) + '%" title="' + NAMES[k] + '"></i>';
        }).join("") + "</div>" +
        '<p class="muted">' + Engine.STRANDS.map(function (k) { return NAMES[k] + " " + Math.round(strands[k] / tot * 100) + " %"; }).join(" · ") +
        ". Te falta <b>" + NAMES[low].toLowerCase() + "</b>: " + TIP[low] + ".</p></div>";
    }
    more += planLine();

    // Frase del giorno / do dia
    more += '<div class="card fdg"><span class="muted">' + UI.fraseDay + "</span>" +
      '<div class="fit">' + esc(fText) + "</div>" +
      '<div class="fes">' + esc(f.es) + "</div>" +
      (f.note ? '<div class="note">' + mk(f.note) + "</div>" : "") +
      '<button class="tab" id="sayfdg">🔊 escuchar</button></div>';

    // Calendario de los últimos 28 días
    var days = Engine.lastDays(state, 28);
    more += '<div class="card"><h3 style="margin-top:0">Tus últimas 4 semanas</h3>' +
      '<div class="heat">' + days.map(function (d) {
        var lvl = d.xp <= 0 ? 0 : d.xp < goal / 2 ? 1 : d.xp < goal ? 2 : 3;
        return '<i class="h' + lvl + '" title="' + d.key + ": " + d.xp + ' xp"></i>';
      }).join("") + "</div>" +
      '<p class="muted" style="margin:8px 0 0">Cada cuadrado es un día. ' + UI.calendarGreen + " = meta cumplida. " +
      "Un día perdido por semana no corta la racha (🃏 comodín, " + (Engine.jokerLeft(state) ? "esta semana todavía lo tenés" : "esta semana ya lo usaste") + "). " +
      "Cada 7 días de racha ganás además un 🛡️ escudo para los días de más.</p></div>";

    html += '<details class="mas" id="masoggi"' + (window.Inicio && Inicio.moreOpen() ? " open" : "") + '><summary><span class="mas-t">Más</span><span class="muted small">' +
      (maint ? "pausa, repaso, frase del día, calendario" : "pausa, sfida, repaso, frase del día, calendario") + "</span></summary>" + more + "</details>";

    // Instalación
    if (!isStandalone()) {
      html += '<div class="card install"><b>📲 Instalala en tu celu</b>' +
        '<p class="muted">Funciona sin internet y tu progreso queda guardado en el teléfono.</p>' +
        (installPrompt
          ? '<button class="btn" id="install">Instalar app</button>'
          : '<p class="muted">iPhone: <b>Compartir → Agregar a inicio</b>. ' +
            "Android: menú ⋮ → <b>Instalar app</b>.</p>") +
        "</div>";
    }
    return html + versionLine();
  }

  /* ------------------------------------------------ hábito y metas */

  var WHY = LG.why || [];
  var CHANGES = [["escritura", "más escritura"], ["repaso", "más repaso"], ["cortas", "sesiones más cortas"]];
  var WHENS = [["manana", "a la mañana"], ["mediodia", "al mediodía"], ["noche", "a la noche"]];

  /* The cards of habit and motivation on Oggi / Hoje: the return after a pause
     (no debt, a five-minute restart: Lally 2010; Mazza 2016), the weekly
     reflective close, the backup, the ideal self (Dörnyei) and the weekly
     sub-goal (Bandura & Schunk 1981).  Candidates in order of priority:
     Inicio.habit shows one a day at most, and each can be put off. */
  function oggiHabitCards() {
    var out = [], away = Engine.daysAway(state), fresh = Engine.freshStart();
    var ideal = state.ideal && state.ideal.text ? state.ideal.text : "";
    var maint = state.phase === "mantenimiento";
    if (away >= 3 && state.totals.attempts > 0) {
      out.push({ id: "ritorno", html: '<div class="card weekcard first ritorno"><span class="muted">👋 Volviste después de ' + away + " días</span>" +
        "<b>Lo que aprendiste no se borró: re-aprender lleva una fracción del tiempo.</b>" +
        (state.streakBroken && state.streakBroken.n > 1 ? '<span class="muted small">La racha de ' + state.streakBroken.n + " días se cortó; tu mejor racha queda en " + (state.bestStreak || state.streakBroken.n) + ". Hoy empieza otra.</span>" : "") +
        '<span class="muted">' + (fresh === "semana" ? "Y es lunes: buen día para retomar. " : fresh === "mes" ? "Y empieza el mes: buen momento para volver. " : "") +
          "Cinco minutos con lo que más se enfrió y seguimos" + (ideal ? " hacia lo tuyo: «" + esc(ideal) + "»" : "") + ".</span>" +
        '<span class="row" style="margin-top:10px"><button class="btn" id="ritorno">▶︎ 5 minutos para retomar</button>' +
          (state.icsAt ? "" : '<button class="tab" id="agendar" data-t="' + esc(state.remind || "13:30") + '">📅 Agendar mi rato diario</button>') + "</span>" +
        (state.pauseAsk !== Engine.dayKey() ? '<span class="muted small">¿Qué pasó? <button class="tab" data-why="tiempo">sin tiempo</button> ' +
          '<button class="tab" data-why="dificil">se puso difícil</button> <button class="tab" data-why="aburrido">me aburrí</button> ' +
          '<button class="tab" data-why="olvide">me olvidé</button></span>' : "") + "</div>" });
    }
    // First week: the daily slot in the calendar (plan 1.2), once, until it is done
    if (!state.icsAt && !maint && state.totals.attempts >= 10 && state.totals.attempts < 400) {
      out.push({ id: "agenda", html: '<div class="card weekcard agenda"><span class="muted">📅 Para no olvidarte</span>' +
        "<b>Agendá tu rato diario: un evento en tu calendario, con alarma, que abre tu semana.</b>" +
        '<span class="row" style="margin-top:10px"><input type="time" id="agendatime" value="' + esc(state.remind || "13:30") + '">' +
        '<button class="btn" id="agendar">Agendar</button></span></div>' });
    }
    // weekly close: on the first visit of a new week, about the week before
    var wk = Engine.weekKey(), prevWk = Engine.weekKey(new Date(Date.now() - 7 * 86400000));
    if (state.totals.attempts >= 50 && !(state.reflect || {})[prevWk] && (state.reflect || {}).skip !== wk && Engine.weekStreak(state) + Engine.daysAway(state) > 0 && new Date().getDay() <= 2) {
      var errs = state.errs || {}, cats = Object.keys(errs).sort(function (a, b) { return errs[b].n - errs[a].n; }).slice(0, 3);
      out.push({ id: "reflect", html: '<div class="card weekcard reflect"><span class="muted">📓 Cierre de la semana pasada · tres toques</span>' +
        '<span class="muted small">¿Qué te costó más?</span><span class="chips">' +
          cats.map(function (c) { return '<button class="tab" data-rf="hard" data-v="' + esc(c) + '">' + esc(Errores.label(c)) + "</button>"; }).join("") +
          '<button class="tab" data-rf="hard" data-v="nada">nada en especial</button></span>' +
        '<span class="muted small">¿Qué cambiás esta semana? Tu plan del día lo tiene en cuenta.</span><span class="chips">' +
          CHANGES.map(function (c) { return '<button class="tab" data-rf="change" data-v="' + c[0] + '">' + c[1] + "</button>"; }).join("") + "</span>" +
        '<span class="muted small">¿Cuándo estudiás?</span><span class="chips">' +
          WHENS.map(function (c) { return '<button class="tab" data-rf="when" data-v="' + c[0] + '">' + c[1] + "</button>"; }).join("") + "</span>" +
        '<span class="row"><button class="btn" id="rfsave">Guardar</button><button class="tab" id="rfskip">Ahora no</button></span></div>' });
    }
    // the backup: every 14 days once there is something to lose
    var sinceCopy = state.exportedAt ? Math.floor((Date.now() - state.exportedAt) / 86400000) : null;
    if (state.totals.attempts >= 150 && (sinceCopy == null || sinceCopy >= 14)) {
      out.push({ id: "copia", html: '<div class="card weekcard copia"><span class="muted">💾 Tu copia</span>' +
        "<b>" + (sinceCopy == null ? "Todavía no guardaste una copia de tu progreso." : "Hace " + sinceCopy + " días que no guardás una copia.") + "</b>" +
        '<span class="muted">Todo vive solo en este teléfono. Un toque y la mandás a tu Drive, tu mail o un chat.</span>' +
        '<span class="row" style="margin-top:10px"><button class="btn" id="hexport">💾 Guardar ahora</button></span></div>' });
    }
    if (!state.ideal && state.totals.attempts >= 10) {
      out.push({ id: "why", html: '<div class="card weekcard"><span class="muted">🎯 ¿Para qué querés ' + UI.langEs + "?</span>" +
        '<span class="chips">' + WHY.map(function (w) { return '<button class="tab" data-why2="' + w[0] + '">' + w[1] + "</button>"; }).join("") + "</span>" +
        '<span class="muted small">Tener la meta a la vista sostiene el esfuerzo (Dörnyei: el yo ideal). Después la escribís con tus palabras en ' + UI.me + ".</span></div>" });
    }
    // The concepts of the week, as the course teaches them (progreso.js:
    // not the gap to the boss divided by the weeks left).
    if (state.unlocked >= 2 && !maint && window.Progreso) {
      var q = Progreso.wordQuota(course, state, new Date());
      var left = Math.max(0, q.target - q.done);
      out.push({ id: "semana", html: '<div class="card goalweek"><b>🪜 Esta semana</b> <span class="muted">· hacia el ' + esc(q.level) + " en la semana " + q.boss + "</span>" +
        '<div class="goalbar" style="margin:8px 0 4px"><i style="width:' + Math.min(100, Math.round(q.done / Math.max(1, q.target) * 100)) + '%"></i></div>' +
        '<p class="muted" style="margin:0">' + q.done + " / " + q.target + " palabras nuevas" + (left ? " · faltan " + left : " ✓") +
          " (las " + q.weekWords + " de la semana). " +
          "Llevás " + q.nWords.toLocaleString("es-AR") + "; el curso enseña unas " + q.byBoss.toLocaleString("es-AR") + " hasta el " + UI.boss + ".</p></div>" });
    }
    return out;
  }
  // What the learner said they would change this week, as a line.
  function planLine() {
    var prevWk = Engine.weekKey(new Date(Date.now() - 7 * 86400000));
    var rf = (state.reflect || {})[prevWk];
    if (!rf || !rf.change) return "";
    var ch = CHANGES.filter(function (c) { return c[0] === rf.change; })[0];
    var sw = Engine.strandsLast(state, 7);
    var done = rf.change === "escritura" ? sw.output : null;
    return '<p class="muted small planline">📓 Dijiste: <b>' + esc(ch ? ch[1] : rf.change) + "</b>" +
      (done != null ? " · llevás " + done + " xp de eso esta semana" : "") + ".</p>";
  }

  /* A five-minute restart after a pause: the ten cards with the lowest
     chance of recall, no backlog shown, the rest redistributes itself. */
  function ritornoItems() {
    var items = Drills.buildColdest ? Drills.buildColdest(course, state, 10, drillOpts()) : Drills.buildReview(course, state, 10, drillOpts());
    if (items.length < 6) items = items.concat(Drills.buildRound(course, course.weeks[Math.min(state.unlocked, NW()) - 1], { map: itemMap, state: state, silent: state.silent, size: 8 - items.length }));
    return items;
  }

  /* «2 minutos» (plan 1.1): six items, no menus: the cards due first, the
     week's practice for what is missing.  Two minutes make a day (state.dos):
     what matters is not breaking the chain. */
  function dosItems() {
    var items = Drills.buildReview(course, state, 6, drillOpts());
    if (items.length < 6) {
      var w = course.weeks[Math.min(state.unlocked, NW()) - 1];
      items = items.concat(Drills.buildRound(course, w, { map: itemMap, state: state, silent: state.silent, size: 6 - items.length, only: partItems(w) }));
    }
    return items.slice(0, 6);
  }
  function dosCard(gentle) {
    var n = window.Progreso ? Progreso.daysThisWeek(state) : 0;
    var done = (state.dos || {})[Engine.dayKey()];
    return '<div class="card weekcard dos"><button class="bigbtn giorno dos" id="dos"><span class="e">⚡</span><b>2 minutos</b><small>' +
      (done ? "✓ hoy ya cuenta · otra vez, si querés" : gentle ? "ayer no hubo, no pasa nada: hoy alcanza con esto" : "un toque, sin menús · alcanza para el día") + "</small></button>" +
      '<span class="muted small">' + (n ? "Esta semana: " + dias(n) + " con estudio." : "Hoy empieza la cuenta de la semana.") + "</span></div>";
  }

  /* The shareable card: a PNG drawn on a canvas (week, xp, streak, words),
     handed to the share sheet (Web Share) or downloaded. */
  function shareCard() {
    var c = document.createElement("canvas"), W = 720, H = 400;
    c.width = W; c.height = H;
    var g = c.getContext("2d");
    // the frame of the language (LANG.card: the sky and a plaza, the sea
    // and the waves of a beach), then the lines where it says
    var K = LG.card;
    K.frame(g, W, H);
    g.fillStyle = K.head.color || K.text; g.textAlign = "center";
    g.font = "bold 22px Georgia, serif";
    g.fillText((LG.brand + " · " + UI.week).toUpperCase() + " " + weekNum(Math.min(state.unlocked, NW())), W / 2, K.head.y);
    g.fillStyle = K.text;
    g.font = K.rank.font; g.fillText(Engine.rankFor(Engine.levelFor(state.xp).level).toUpperCase(), W / 2, K.rank.y);
    var sg = Engine.subGoals(state);
    g.font = "26px system-ui, sans-serif";
    g.fillText("🔥 " + state.streak + " días · " + Engine.weekStreak(state) + " semanas · nivel " + Engine.levelFor(state.xp).level, W / 2, K.lines[0]);
    g.fillText(sg.nWords.toLocaleString("es-AR") + " " + (UI.words || "palabras").toLowerCase(), W / 2, K.lines[1]);
    g.font = "20px system-ui, sans-serif"; g.fillStyle = K.muted;
    var wkMin = window.Progreso ? Math.round(Progreso.thisWeek(state).sec / 60) : 0;
    g.fillText("Esta semana: " + sg.wordsThisWeek + " palabras nuevas" + (wkMin ? " · " + Progreso.fmtH(wkMin * 60) + " de estudio" : ""), W / 2, K.lines[2]);
    c.toBlob(function (blob) { shareBlob(blob, K.file + stamp() + ".png", "Mi semana de " + UI.langEs); }, "image/png");
  }
  // A PNG to the share sheet (Web Share), or downloaded.
  function shareBlob(blob, name, title) {
    try {
      var file = new File([blob], name, { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) { navigator.share({ files: [file], title: title }).catch(function () { download(blob, name); }); return; }
    } catch (e) { /* sin share */ }
    download(blob, name);
  }

  function wireHabit() {
    on("#dos", function () { startRound("dos"); });
    on("#agendar", function () {
      var ti = $("#agendatime"), b = $("#agendar");
      scheduleReminder((ti && ti.value) || (b && b.dataset.t) || "13:30");
      render();
    });
    on("#ritorno", function () { state.pauseAsk = Engine.dayKey(); persist(); startRound("ritorno"); });
    on("#hexport", function () { exportSave(); render(); });
    document.querySelectorAll("[data-why]").forEach(function (b) {
      b.onclick = function () {
        if (!state.pauses) state.pauses = [];
        state.pauses.push({ days: Engine.daysAway(state), why: b.dataset.why, at: Date.now() });
        state.pauses = state.pauses.slice(-30);
        state.pauseAsk = Engine.dayKey();
        if (b.dataset.why === "dificil" && state.retention > 0.85) { state.retention = 0.85; toast("Anotado. Bajé la retención a 85 %: menos repasos por día.", 3500); }
        else if (b.dataset.why === "tiempo") toast("Anotado. Con tres sesiones de dos minutos ya cuenta: el atajo «" + UI.micro + "» está en el ícono de la app.", 4000);
        else toast("Anotado. Gracias.");
        persist();
        render();
      };
    });
    document.querySelectorAll("[data-why2]").forEach(function (b) {
      b.onclick = function () {
        var w = WHY.filter(function (x) { return x[0] === b.dataset.why2; })[0];
        state.ideal = { why: b.dataset.why2, text: "", at: Date.now() };
        persist();
        toast("🎯 " + (w ? w[1] : "") + ". En " + UI.me + " podés escribir tu meta con tus palabras.", 3500);
        render();
      };
    });
    var rf = {};
    document.querySelectorAll("[data-rf]").forEach(function (b) {
      b.onclick = function () {
        rf[b.dataset.rf] = b.dataset.v;
        document.querySelectorAll('[data-rf="' + b.dataset.rf + '"]').forEach(function (x) { x.classList.toggle("on", x === b); });
      };
    });
    on("#rfsave", function () {
      if (!state.reflect) state.reflect = {};
      state.reflect[Engine.weekKey(new Date(Date.now() - 7 * 86400000))] = { hard: rf.hard || "", change: rf.change || "", when: rf.when || "", at: Date.now() };
      persist();
      toast("📓 Guardado. La semana que viene te lo recuerdo.");
      render();
    });
    on("#rfskip", function () { if (!state.reflect) state.reflect = {}; state.reflect.skip = Engine.weekKey(); persist(); render(); });
  }

  /* The version, so a glance says whether the phone already loaded the
     latest one (it must match VERSION = "agora-vN" in sw.js: test_version
     and the CI check it).  One version for the app and every edition. */
  var APP_VERSION = "v0.2.0";
  // Settimana XVII: Roman numerals on the street signs (LANG.ui.romanWeeks).
  function romano(n) {
    var out = "", v = [[50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
    v.forEach(function (p) { while (n >= p[0]) { out += p[1]; n -= p[0]; } });
    return out;
  }

  /* The other languages: one button each in Io / Eu (boot.js switches;
     each language keeps its own progress).  The package's own (UI.switchTo,
     the id #switchlang) goes first. */
  function switchCard() {
    if (!window.Boot || !Boot.LANGS) return "";
    var codes = Object.keys(Boot.LANGS).filter(function (c) { return c !== LG.code; });
    if (UI.switchCode && codes.indexOf(UI.switchCode) > 0) { codes.splice(codes.indexOf(UI.switchCode), 1); codes.unshift(UI.switchCode); }
    if (!codes.length) return "";
    return '<div class="card switchlang"><div class="row">' + codes.map(function (c) {
      var o = Boot.LANGS[c];
      return '<button class="btn ghost"' + (c === UI.switchCode ? ' id="switchlang"' : "") + ' data-switchlang="' + c + '">' +
        esc(c === UI.switchCode && UI.switchTo ? UI.switchTo : "Cambiar a " + o.name + " " + o.flag) + "</button>";
    }).join("") + "</div>" +
      '<p class="muted small">Cada edición guarda su propio progreso: podés ir y volver cuando quieras.</p></div>';
  }

  function versionLine() {
    return '<p class="muted small version">' + esc(LG.brand) + " · versión " + APP_VERSION + "</p>";
  }

  function isStandalone() {
    return (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) ||
      window.navigator.standalone === true;
  }

  /* ----------------------------------------------------------------- treino */

  /* Allena / Treino, la capa de práctica (js/capas.js): lo de esta semana
     arriba (el duelo que se abre), la entrada a «Consultar» y el resto
     plegado por secciones. */
  function renderFrasi() {
    var week = Math.min(state.unlocked || 1, NW()), C = window.Capas;
    var fold = C ? C.fold : function (k, t, m, body) { return "<h2>" + t + "</h2>" + body; };
    var noH2 = function (h) { return String(h || "").replace(/^\s*<h2>[\s\S]*?<\/h2>/, ""); };
    var html = '<button class="btn ghost" id="toio">← ' + UI.me + "</button>" + "<h1>" + UI.train + "</h1>" +
      '<p class="lead">Práctica libre, fuera de las misiones. Arriba, lo de esta semana; lo demás, en las secciones.</p>';

    // lo de esta semana
    var wk = [];
    if (window.Duelli) Duelli.DUELLI.filter(function (d) { return d.week === week; }).forEach(function (d) {
      var best = (state.duelli || {})[d.id];
      wk.push('<button class="ep' + (best && best.pct >= 80 ? " done" : "") + '" data-duel="' + d.id + '"><span class="e">⚔️</span><span><b>Duelo: ' + esc(d.title) + "</b>" +
        '<span class="muted">' + (best ? "Tu mejor: " + best.pct + " %" : esc(d.sub)) + "</span></span></button>");
    });
    html += '<div class="card capa-week"><h2>Esta semana <small class="muted">· semana ' + week + "</small></h2>" +
      (wk.length ? '<div class="eps">' + wk.join("") + "</div>" : '<p class="muted">Esta semana no trae práctica nueva: repasá lo que quieras abajo.</p>') + "</div>";
    if (C) html += C.entryHtml();

    if (window.Escritos) html += fold("al:esc", "✍️ Escritura guiada", "ordená el texto", noH2(Escritos.treinoHtml(state)));

    if (window.Duelli) {
      var list = Duelli.DUELLI.slice().sort(function (a, b) { return a.week - b.week; });
      var openD = list.filter(function (d) { return d.week <= week; }).length;
      html += fold("al:duel", "⚔️ Duelos", openD + " / " + list.length + " abiertos",
        '<p class="muted">Dos formas que se confunden, mezcladas: elegís una y después tocás la pista que te lo dijo.</p>' +
        '<div class="labs">' + list.map(function (d) {
          var best = (state.duelli || {})[d.id];
          return '<button class="lab" data-duel="' + d.id + '"' + (d.week > week ? " disabled" : "") + '><span class="e">⚔️</span><b>' + esc(d.title) + "</b>" +
            '<span class="muted">' + esc(d.week > week ? "Se abre en la semana " + d.week + "." : d.sub) + "</span>" +
            (best ? '<span class="meta">mejor: ' + best.pct + " %</span>" : "") + "</button>";
        }).join("") + "</div>" +
        '<p class="muted science">🔬 Intercalar formas que se parecen (Brunmair y Richter 2019) y explicar por qué (Bisra et al. 2018).</p>');
    }
    return html;
  }

  /* ----------------------------------------------------------------- ler */

  /* Leggi / Ler, la capa de input (js/capas.js): arriba lo de esta semana
     (el capítulo recomendado de la Biblioteca y los minutos de lectura);
     después, plegada, la Biblioteca. */
  function renderLeggi() {
    var week = Math.min(state.unlocked || 1, NW()), C = window.Capas;
    var fold = C ? C.fold : function (k, t, m, body) { return "<h2>" + t + "</h2>" + body; };
    var html = '<button class="btn ghost" id="toio">← ' + UI.me + "</button>" + "<h1>" + UI.read + "</h1>" +
      '<p class="lead">Los textos para leer enteros, a tu ritmo.</p>';

    var wk = [];
    var B = window.Biblioteca, rec = null;
    if (B && B.loaded && B.loaded() && B.firstOpenWeek(B.index()) <= week) {
      var lm = B.mission(B.index(), { week: week }, state);
      rec = lm && lm.arg ? lm.arg.split("|") : null;
      if (rec) wk.push('<button class="ep' + (lm.done ? " done" : "") + '" data-bxread="' + esc(rec[0]) + '" data-bxch="' + esc(rec[1]) + '"><span class="e">📚</span><span><b>' +
        esc(lm.title) + '</b><span class="muted">' + esc(lm.sub.replace(/^Opcional · /, "")) + "</span></span></button>");
    } else if (B && B.loadIndex && B.loaded && !B.loaded() && typeof fetch === "function") {
      B.loadIndex().then(function () { if (view.screen === "leggi") render(); }).catch(function () { /* sin red */ });
    }
    var inp = C ? C.inputWeek(state) : { read: 0 };
    html += '<div class="card capa-week"><h2>Esta semana <small class="muted">· semana ' + week + "</small></h2>" +
      (wk.length ? '<div class="eps">' + wk.join("") + "</div>" : '<p class="muted">Esta semana no trae lectura nueva.</p>') +
      '<p class="small muted capa-input">⏱️ En 7 días: <b>' + inp.read + " min</b> leyendo</p></div>";
    if (C) html += C.entryHtml(true);

    if (B) html += fold("lg:bib", "📚 " + esc(((window.BIBLIO_DATA || {}).ui || {}).name || "Biblioteca"), B.minutes ? B.minutes(state, 7) + " min en 7 días" : "",
      B.leggiCard().replace(/^<div class="card bx-entry"><h2>[\s\S]*?<\/h2>/, '<div class="bx-entry">'));
    return html;
  }

  /* -------------------------------------------------------------- trilha */

  function weekStat(n) {
    return state.weekStats[n] || { attempts: 0, right: 0, bossPassed: false };
  }

  function renderPercorso() {
    var total = 0, got = 0;
    course.weeks.forEach(function (w) { total += 3; got += weekStars(w); });
    var html = "<h1>" + UI.path + "</h1>" +
      '<p class="lead">' + UI.pathLead + "</p>" +
      '<div class="card pathsum"><b>' + got + ' / ' + total + ' ★</b>' +
      '<span class="goalbar"><i style="width:' + Math.round(got / total * 100) + '%"></i></span></div>';

    course.seasons.forEach(function (s) {
      html += '<div class="season"><div class="banner s' + s.n + '"><span class="lvl">' + esc(s.level) + "</span>" +
        "<h2>" + esc(s.name) + "</h2><p>" + esc(s.blurb) + '</p></div><div class="path">';
      course.weeks.filter(function (w) { return w.season === s.n; }).forEach(function (w, k) {
        // Una semana ya jugada sigue abierta aunque, si el programa se
        // reordena, quede después de la desbloqueada.
        var open = w.week <= state.unlocked || !!state.weekStats[w.week] || lessonRead(w.week);
        var stars = weekStars(w);
        var current = w.week === Math.min(state.unlocked, NW()) && stars < 3;
        var x = Math.round(Math.sin(k * 0.9) * 32);
        html += '<div class="node' + (w.boss ? " boss" : "") + (open ? "" : " locked") +
            (current ? " current" : "") + (stars === 3 ? " full" : "") + '" style="--x:' + x + '%">' +
          (current ? '<span class="bubble">' + (weekStat(w.week).attempts || lessonRead(w.week) ? "SEGUÍ" : "EMPEZÁ") + "</span>" : "") +
          '<button class="dot" data-week="' + w.week + '"' + (open ? "" : " disabled") +
            ' aria-label="' + esc((w.boss ? UI.Boss + " · " : "") + UI.week + " " + w.week + ": " + w.title + " · " + stars + " de 3 estrellas" + (open ? "" : " · cerrada") + (current ? " · la actual" : "")) + '">' +
            (w.boss ? "⚔️" : open ? w.week : "🔒") + "</button>" +
          // the boss: a fourth star with 70 % in the sentences never seen
          '<span class="nt">' + esc(w.title) + "</span>" + (w.boss && weekStat(w.week).star4 ? starsHtml(4, 4) : starsHtml(stars)) +
          (open && !w.boss ? (function () { var pl = weekPlan(w); return '<span class="nm">' +
            pl.filter(function (x) { return x.done; }).length + "/" + pl.length + " misiones</span>"; })() : "") +
          "</div>";
      });
      html += "</div></div>";
    });
    return html;
  }

  /* ---------------------------------------------------------------- teoria */

  /* *palabra* marca una forma de la lengua, **texto** una regla clave. */
  function mk(text) {
    return esc(text)
      .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
      .replace(/\*([^*]+)\*/g, '<i class="it">$1</i>');
  }

  function lessonRead(n) { return !!(state.read || {})[n]; }
  /* A lesson in parts (week.parts): each part is read on its own and the
     training only asks what the parts already read cover. */
  function partsOf(w) { return w && w.parts && w.parts.length ? w.parts : null; }
  function partRead(week, k) { return !!((state.readParts || {})[week] || {})[k]; }
  function partsRead(w) {
    var ps = partsOf(w); if (!ps) return null;
    return ps.map(function (p, k) { return partRead(w.week, k) || lessonRead(w.week); });
  }
  // Item ids the learner may be asked, given the parts read (none read: the
  // first part, so that training before reading is not a wall).
  function partItems(w) {
    var ps = partsOf(w); if (!ps) return null;
    var read = partsRead(w), ids = {}, any = false;
    ps.forEach(function (p, k) { if (read[k]) { any = true; p.items.forEach(function (id) { ids[id] = 1; }); } });
    if (!any) ps[0].items.forEach(function (id) { ids[id] = 1; });
    return ids;
  }

  /* Sessions: every lesson (or part of it) cut into short runs of whole
     blocks, about a dozen steps each, so no sitting is long.  A part counts
     as read when all its sessions are; what was read before stays read. */
  var SESS_MAX = 12, sessCache = {};
  function sessionsOf(w) {
    if (!w || !w.lesson) return [];
    if (sessCache[w.week]) return sessCache[w.week];
    var ps = partsOf(w), groups = ps ? ps.map(function (p, k) { return { part: k, blocks: p.blocks }; })
                                     : [{ part: null, blocks: w.lesson.blocks.map(function (_, i) { return i; }) }];
    var cost = function (i) {
      return Lezione.steps(w.lesson, function () { return 0.5; }, w.week, null, [i]).filter(function (x) { return x.kind !== "intro"; }).length;
    };
    var out = [];
    groups.forEach(function (g) {
      var cur = [], n = 0, mine = [];
      g.blocks.forEach(function (i) {
        var c = cost(i);
        if (cur.length && n + c > SESS_MAX) { mine.push(cur); cur = []; n = 0; }
        cur.push(i); n += c;
      });
      if (cur.length) mine.push(cur);
      mine.forEach(function (bl, k) {
        out.push({ part: g.part, blocks: bl, k: k, of: mine.length, h: (w.lesson.blocks[bl[0]] || {}).h || "" });
      });
    });
    return (sessCache[w.week] = out);
  }
  function sessRead(w, s) {
    var ss = sessionsOf(w)[s];
    if (!ss) return false;
    return !!((state.readSess || {})[w.week] || {})[s] || lessonRead(w.week) || (ss.part != null && partRead(w.week, ss.part));
  }
  function nextSession(w) {
    var ss = sessionsOf(w);
    for (var k = 0; k < ss.length; k++) if (!sessRead(w, k)) return k;
    return null;
  }

  /* Tres estrellas por semana: la lección jugada, la semana superada (20
     correctas), el dominio (85 % en al menos 30).  El jefe: vencido = 3. */
  function weekStars(w) {
    var st = weekStat(w.week);
    if (w.boss) return st.bossPassed ? 3 : 0;
    return (lessonRead(w.week) || !w.lesson ? 1 : 0) + (st.right >= 20 ? 1 : 0) +
      (Drills.dominated(st, w, state) ? 1 : 0);
  }
  function starsHtml(n, of) {
    var h = ""; for (var i = 0; i < (of || 3); i++) h += '<i class="' + (i < n ? "on" : "") + '">★</i>';
    return '<span class="stars">' + h + "</span>";
  }

  var sayIndex = {};

  /* part: undefined = el bloque entero (teoría completa); "a" = título,
     regla y tabla; "b" = ejemplos, trampa, atajo y detalle (lección jugada). */
  function renderBlock(b, i, part) {
    var A = part !== "b", B = part !== "a";
    var html = '<section class="blk">';
    if (b.h) html += "<h2>" + mk(b.h) + (part === "b" ? ' <span class="muted">· ejemplos</span>' : "") + "</h2>";
    // La regla corta primero; el detalle, plegado.
    if (b.r && A) html += '<p class="rule">' + mk(b.r) + "</p>";
    if (A) (b.p || []).forEach(function (par) { html += "<p>" + mk(par) + "</p>"; });

    if (b.table && A) {
      html += '<div class="tw"><table class="gram">';
      if (b.table.head && b.table.head.join("")) {
        html += "<thead><tr>" + b.table.head.map(function (c) {
          return "<th>" + mk(c) + "</th>";
        }).join("") + "</tr></thead>";
      }
      var exCol = -1;
      (b.table.head || []).forEach(function (h, k) { if (exCol < 0 && /ejemplo/i.test(h)) exCol = k; });
      html += "<tbody>" + (b.table.rows || []).map(function (r, ri) {
        return "<tr>" + r.map(function (c, k) {
          var say = "";
          if (k === exCol && c) {
            sayIndex["t" + i + "-" + ri] = Lezione.strip(c);
            say = ' <button class="say" data-say="t' + i + "-" + ri + '" aria-label="escuchar">🔊</button>';
          }
          return "<td" + (k === 0 ? ' class="k"' : "") + ">" + mk(c) + say + "</td>";
        }).join("") + "</tr>";
      }).join("") + "</tbody></table></div>";
    }

    if (b.ex && B) {
      html += '<ul class="exs">' + b.ex.map(function (pair, k) {
        sayIndex[i + "-" + k] = Lezione.strip(pair[0]);
        return '<li><span class="it">' + exHtml(pair[0]) + "</span>" +
          '<span class="es">' + esc(pair[1]) + "</span>" +
          '<button class="say" data-say="' + i + "-" + k + '" ' +
          'aria-label="escuchar">🔊</button></li>';
      }).join("") + "</ul>";
    }

    if (!B) return html + "</section>";
    if (b.warn) html += '<div class="call warn"><b>La trampa</b>' +
      "<p>" + mk(b.warn) + "</p></div>";
    if (b.tip) html += '<div class="call tip"><b>El atajo</b>' +
      "<p>" + mk(b.tip) + "</p></div>";
    if (b.more && b.more.length) {
      html += '<details class="more"><summary>¿Por qué? Más detalle</summary>' +
        b.more.map(function (par) { return "<p>" + mk(par) + "</p>"; }).join("") + "</details>";
    }
    if (window.Referencia) html += Referencia.blockLink(b);   // usos reales y estado (referencia.js)
    return html + "</section>";
  }

  /* ------------------------------------------ la lección, una idea por pantalla */

  // The block's forms marked inside an example (signaling).
  var HL_STOP = LG.hlStop || {};
  function markForms(text, fs) {
    var t = String(text), low = t.toLowerCase(), marks = [];
    // «-ato»: an ending the rule teaches, marked on every word that has it
    var ends = (fs || []).filter(function (f) { return /^-[a-zà-ÿ]+$/.test(f); }).map(function (f) { return f.slice(1); });
    // the words of the table's forms (ho, sono / tenho, sou…), grammar words aside
    var words = [];
    (fs || []).forEach(function (f) { if (/\s/.test(f)) f.split(/\s+/).forEach(function (w) { if (w.length >= 2 && !HL_STOP[w] && words.indexOf(w) < 0) words.push(w); }); });
    fs = (fs || []).filter(function (f) { return f[0] !== "-"; }).concat(words);
    low.replace(new RegExp("[" + WCH + "]+", "g"), function (w, at) {
      if (ends.some(function (e) { return w.length > e.length + 1 && w.slice(-e.length) === e; })) marks.push({ s: at, e: at + w.length });
      return w;
    });
    (fs || []).forEach(function (f) {
      var from = 0, at;
      while ((at = low.indexOf(f, from)) >= 0) {
        var before = at === 0 ? "" : low[at - 1], after = low[at + f.length] || "";
        var edge = function (ch) { return !ch || !new RegExp("[" + WCH + "]", "i").test(ch); };
        if (edge(before) && edge(after) && !marks.some(function (m) { return at < m.e && at + f.length > m.s; }))
          marks.push({ s: at, e: at + f.length });
        from = at + f.length;
      }
    });
    marks.sort(function (a, b) { return a.s - b.s; });
    var out = "", pos = 0;
    marks.forEach(function (m) { out += esc(t.slice(pos, m.s)) + '<mark class="hl">' + esc(t.slice(m.s, m.e)) + "</mark>"; pos = m.e; });
    return out + esc(t.slice(pos));
  }
  // An example with its key form marked by hand («Espero que você *venha*»).
  function exHtml(text) {
    return String(text).split(/\*([^*]+)\*/).map(function (x, k) {
      return k % 2 ? '<mark class="hl">' + esc(x) + "</mark>" : esc(x);
    }).join("");
  }
  function stepBadge(ico, txt) { return '<div class="stepbadge">' + ico + " " + txt + "</div>"; }
  // 👀 The examples first, the forms marked: the rule comes on the next screen.
  function renderLook(b, i) {
    var fs = Lezione.forms(b);
    return '<section class="blk">' + stepBadge("👀", "Mirá") + (b.h ? "<h2>" + mk(b.h) + "</h2>" : "") +
      '<ul class="exs look">' + b.ex.map(function (pair, k) {
        sayIndex[i + "-" + k] = Lezione.strip(pair[0]);
        // marked by hand when the lesson says which form matters; else, guessed
        var itHtml = /\*[^*]+\*/.test(pair[0]) ? exHtml(pair[0]) : markForms(pair[0], fs);
        return '<li><span class="it">' + itHtml + '</span><span class="es">' + esc(pair[1]) + "</span>" +
          '<button class="say" data-say="' + i + "-" + k + '" aria-label="escuchar">🔊</button></li>';
      }).join("") + "</ul>" +
      '<p class="muted small">Fijate en lo marcado. La regla, en la pantalla siguiente.</p></section>';
  }
  // 📐 The rule, alone (with its table when it is small).
  function renderRule(b, i) {
    var html = '<section class="blk">' + stepBadge("📐", "La regla") + (b.h ? "<h2>" + mk(b.h) + "</h2>" : "") +
      (b.r ? '<p class="rule solo">' + mk(b.r) + "</p>" : "");
    (b.p || []).forEach(function (par) { html += "<p>" + mk(par) + "</p>"; });
    if (b.table && Lezione.smallTable(b.table)) html += renderBlock({ table: b.table }, i, "a").replace(/^<section class="blk">|<\/section>$/g, "");
    return html + "</section>";
  }
  // 🗂️ A big table as cards, one row each, to swipe.
  // 🗂️ A long table, three or four rows per screen, one under the other.
  function renderTableCards(b, i, st) {
    var t = b.table, head = t.head || [], rows = t.rows || [];
    var from = st && st.from != null ? st.from : 0, to = st && st.to != null ? st.to : rows.length;
    var chunks = (st && st.chunks) || 1, chunk = (st && st.chunk) || 0;
    var cards = rows.slice(from, to).map(function (r, k) {
      var ri = from + k;
      var lines = r.slice(1).map(function (c, j) {
        var label = strip(head[j + 1] || ""), isEx = /ejemplo/i.test(label);
        if (isEx && c) sayIndex["t" + i + "-" + ri] = Lezione.strip(c);
        return '<div class="rc-line">' + (label ? '<span class="rc-k">' + mk(head[j + 1]) + "</span>" : "") +
          '<span class="rc-v' + (isEx ? " it" : "") + '">' + mk(c) + "</span>" +
          (isEx && c ? ' <button class="say" data-say="t' + i + "-" + ri + '" aria-label="escuchar">🔊</button>' : "") + "</div>";
      }).join("");
      return '<div class="rowcard">' + (strip(head[0] || "") ? '<span class="rc-k">' + mk(head[0]) + "</span>" : "") +
        '<div class="rc-h">' + mk(r[0]) + "</div>" + lines + "</div>";
    }).join("");
    return '<section class="blk">' + stepBadge("🗂️", chunks > 1 ? "La tabla · " + (chunk + 1) + " de " + chunks : "La tabla") +
      (b.h ? "<h2>" + mk(b.h) + "</h2>" : "") +
      '<div class="rowcards">' + cards + "</div>" +
      (chunk === chunks - 1 ? '<details class="more"><summary>Ver la tabla entera</summary>' +
        renderBlock({ table: b.table }, i, "a").replace(/^<section class="blk">|<\/section>$/g, "") + "</details>" : "") +
      "</section>";
  }
  function strip(x) { return Lezione.strip(x); }
  // ⚠️ The trap and the shortcut, on their own screen.
  function renderTrap(b, i) {
    return renderBlock({ h: b.h, warn: b.warn, tip: b.tip, more: b.more }, i).replace('<section class="blk">',
      '<section class="blk">' + stepBadge("⚠️", b.warn ? "Ojo" : "El atajo"));
  }

  function renderTeoria(w) {
    var L = w.lesson;
    sayIndex = {};
    if (!L) return '<button class="btn ghost" id="back">← ' + UI.pathAl + "</button>" +
      '<p class="lead">Esta semana todavía no tiene teoría.</p>';

    var html = '<button class="btn ghost" id="tback">' + UI.theoryBack + "</button>" +
      "<h1>" + UI.theory + w.week + "</h1>" +
      '<p class="lead">' + esc(w.title) + '</p>' +
      '<div class="lesson"><p class="intro">' + mk(L.intro) + '</p>';

    L.blocks.forEach(function (b, i) { html += renderBlock(b, i); });

    html += "</div>" +
      '<div class="card"><div class="row">' +
      (lessonRead(w.week)
        ? '<button class="btn" id="tplay">▶︎ A jugar</button>'
        : '<button class="btn" id="tdone">✓ Leído (+' + Engine.XP.lesson +
          " xp)</button>") +
      '<button class="btn ghost" id="tback2">Volver</button>' +
      "</div></div>";
    return html;
  }

  /* ------------------------------------------------------- lección jugada */

  var les = null;

  function startLezione(sess) {
    var w = course.weeks[view.week - 1];
    var ss = sessionsOf(w);
    // the first session not yet read (or the first one again)
    if (sess == null || isNaN(sess) || !ss[sess]) { sess = nextSession(w); if (sess == null) sess = 0; }
    var cur = ss[sess];
    les = { w: w, sess: sess, part: cur ? cur.part : null,
            steps: Lezione.steps(w.lesson, Math.random, w.week, null, cur ? cur.blocks : null),
            i: 0, right: 0, asked: 0, answered: false };
    view.screen = "lezione";
    render();
    savePending();
    window.scrollTo(0, 0);
  }

  function renderLezione() {
    var st = les.steps[les.i], w = les.w;
    var n = les.steps.length;
    var hudH = '<div class="hud"><span class="progressline"><i style="width:' +
      Math.round(Math.max(0, les.i - 1) / n * 100) + '%" data-to="' + Math.round(les.i / n * 100) + '"></i></span>' +
      '<span class="muted">' + (les.i + 1) + UI.of + n + "</span>" + dai(les.i, n) +
      '<button class="btn ghost" id="lesquit">✕</button></div>';
    if (!st) {
      var pct = les.asked ? Math.round(les.right / les.asked * 100) : 100;
      var psd = partsOf(w), ssd = sessionsOf(w), nextS = nextSession(w);
      // training when the part (or the lesson) is complete; else, the next session
      var partDone = les.part != null ? partRead(w.week, les.part) : lessonRead(w.week);
      return '<div class="card lesdone center"><div class="bigstar">★</div>' +
        "<h1>" + (nextS == null ? "¡Lección completa!" : "¡Lección " + (les.sess + 1) + " de " + ssd.length + " lista!") + "</h1>" +
        '<p class="lead">Semana ' + w.week + " · " + esc(ssd[les.sess] ? ssd[les.sess].h : w.title) + "</p>" +
        '<div class="scorebig"><b>' + les.right + "/" + les.asked + '</b><span>+' + les.xp + " xp</span></div>" +
        (les.extras || []).map(function (x) { return '<p class="note selfrepair">' + esc(x) + "</p>"; }).join("") +
        (window.Referencia ? Referencia.lessonNote(w.week, ssd[les.sess] ? ssd[les.sess].blocks : null) : "") +
        '<p class="muted">' + (pct === 100 ? "Perfecta: ni un error en los chequeos." :
          pct >= 70 ? "Bien. Lo que fallaste vuelve mañana en el repaso, con su regla." :
          "Lo que fallaste vuelve mañana en el repaso, con su regla. Antes de seguir, entrená esta parte: el entrenamiento pasa adelante en la semana.") + "</p>" +
        '<div class="row centerrow" style="margin-top:14px">' +
        (nextS != null && !partDone ? '<button class="btn" id="lesnextpart" data-part="' + nextS + '">📘 Lección ' + (nextS + 1) + " →</button>" :
          '<button class="btn" id="lesplay">🎯 A entrenar' + (psd ? " esta parte" : "") + "</button>" +
          (nextS != null ? '<button class="btn ghost" id="lesnextpart" data-part="' + nextS + '">📘 Lección ' + (nextS + 1) + " →</button>" : "")) +
        '<button class="btn ghost" id="lesback">Volver a la semana</button></div></div>';
    }
    var partLabel = les.sess != null && sessionsOf(w).length > 1 ? " · lección " + (les.sess + 1) + " de " + sessionsOf(w).length
                  : les.part != null ? " · parte " + (les.part + 1) + " de " + partsOf(w).length : "";
    if (st.kind === "intro") {
      return hudH + '<div class="card lescard"><div class="badge-new">📘 Lección · semana ' + w.week + partLabel + "</div>" +
        "<h1>" + esc(w.title) + "</h1><p class=\"intro\">" + mk(w.lesson.intro) + "</p>" +
        '<button class="btn wide" id="lesnext">Empezar →</button></div>';
    }
    if (st.kind === "look" || st.kind === "rule" || st.kind === "table" || st.kind === "trap") {
      var bk = w.lesson.blocks[st.i];
      var body = st.kind === "look" ? renderLook(bk, st.i) : st.kind === "rule" ? renderRule(bk, st.i)
               : st.kind === "table" ? renderTableCards(bk, st.i, st) : renderTrap(bk, st.i);
      return hudH + (partLabel && les.i === 0 ? '<div class="badge-new">📘 Lección · semana ' + w.week + partLabel + "</div>" : "") +
        '<div class="card lescard lesson step-' + st.kind + '">' + body +
        '<button class="btn wide" id="lesnext">Seguir →</button></div>';
    }
    if (st.kind === "block") {
      return hudH + (partLabel && les.i === 0 ? '<div class="badge-new">📘 Lección · semana ' + w.week + partLabel + "</div>" : "") +
        '<div class="card lescard lesson">' + renderBlock(w.lesson.blocks[st.i], st.i, st.part) +
        '<button class="btn wide" id="lesnext">Seguir →</button></div>';
    }
    var q = st.q;
    return hudH + '<div class="card lescard quiz"><div class="badge-new">⚡ Chequeo rápido</div>' +
      '<div class="prompt">' + esc(q.prompt) + "</div>" +
      (q.stem ? '<div class="stem">' + esc(q.stem) + "</div>" : "") +
      '<div class="options">' + q.options.map(function (o, k) {
        return '<button class="opt" data-lq="' + k + '">' + esc(o) + "</button>";
      }).join("") + '</div><div id="lesfb"></div></div>';
  }

  function lesAnswer(btn) {
    if (les.answered) return;
    les.answered = true;
    var q = les.steps[les.i].q;
    var ok = btn.textContent === q.answer;
    les.asked++;
    if (ok) { les.right++; fx.right(); } else fx.wrong();
    // a check missed comes back tomorrow in the review, with its rule (reglas.js)
    if (!ok && window.Reglas) { Reglas.fromLesson(state, les.w, q); persist(); }
    document.querySelectorAll("[data-lq]").forEach(function (b) {
      b.disabled = true;
      if (b.textContent === q.answer) b.classList.add("right");
      else if (b === btn) b.classList.add("wrong");
    });
    $("#lesfb").innerHTML = '<div class="feedback ' + (ok ? "giusto" : "sbagliato") + '">' +
      '<div class="verdict">' + (ok ? pick(UI.right) : UI.wasThis) + "</div>" +
      '<div class="sol">' + esc(q.answer) + "</div>" +
      (ok ? "" : lesRule(q)) +
      '<div class="row" style="margin-top:10px"><button class="btn" id="lesnext2">' + UI.next + "</button></div></div>";
    on("#lesnext2", lesNext);
  }

  // A wrong check shows the rule it tested, not just the answer.
  function lesRule(q) {
    var b = les.w.lesson.blocks[q.block];
    if (!b) return "";
    var r = b.r || b.warn || b.tip;
    return r ? '<div class="note">📐 ' + mk(r) + "</div>" : "";
  }

  function lesNext() {
    les.i++;
    les.answered = false;
    savePending();
    if (les.i >= les.steps.length) {
      clearPending();
      var w = les.w;
      var first = !lessonRead(w.week);
      if (!state.read) state.read = {};
      if (!state.lessonScore) state.lessonScore = {};
      var pct = les.asked ? Math.round(les.right / les.asked * 100) : 100;
      var planBefore = doneCount(w);
      var ss = sessionsOf(w), mine = ss[les.sess];
      if (!state.readSess) state.readSess = {};
      var rs = state.readSess[w.week] || (state.readSess[w.week] = {});
      if (les.sess != null) { first = !sessRead(w, les.sess); rs[les.sess] = Date.now(); }
      else ss.forEach(function (x, k) { if (x.part === les.part) rs[k] = rs[k] || Date.now(); });   // an old saved lesson: its whole part
      if (les.part != null) {
        if (!state.readParts) state.readParts = {};
        var rp = state.readParts[w.week] || (state.readParts[w.week] = {});
        // the part is read when every session of it is
        if (ss.every(function (x, k) { return x.part !== les.part || !!rs[k] || !!rp[les.part]; })) rp[les.part] = rp[les.part] || Date.now();
        var all = partsOf(w).every(function (p, k) { return !!rp[k]; });
        if (all && !state.read[w.week]) state.read[w.week] = Date.now();
      } else if (ss.every(function (x, k) { return !!rs[k]; }) && !state.read[w.week]) state.read[w.week] = Date.now();
      // the lesson's xp shared among its sessions
      var share = mine ? mine.blocks.length / Math.max(1, w.lesson.blocks.length) : 1;
      les.xp = (first ? Math.max(5, Math.round(Engine.XP.lesson * share)) : 5) + les.right * 2;
      les.extras = missionCheck(w.week, planBefore);
      state.lessonScore[w.week] = Math.max(pct, state.lessonScore[w.week] || 0);
      gain(les.xp);
      Engine.checkBadges(state);
      persist();
      renderHeader();
      fx.goal();
      confetti();
    }
    render();
    window.scrollTo(0, 0);
  }

  /* -------------------------------------------------------------- briefing */

  /* El camino manda: todo lo que trae una semana (lección, conceptos,
     entrenamiento, seminario, dilemas) es una misión de la semana,
     en orden.  Las pestañas de entrenar y leer quedan como atajos libres,
     pero el camino ordenado es este. */
  function weekPlan(w) {
    var st = weekStat(w.week), out = [];
    var m = function (o) { out.push(o); };
    if (w.boss) {
      // Before the boss: the season again, one theme at a time, and a round
      // with what you got wrong.  Optional: the boss is the gate.
      var psb = partsOf(w);
      if (w.lesson && psb) sessionsOf(w).forEach(function (x, k) {
        var p = psb[x.part];
        m({ kind: "lez", arg: String(k), done: sessRead(w, k), ico: "📘", opt: true,
            title: p.h + (x.of > 1 ? " (" + (x.k + 1) + "/" + x.of + ")" : ""),
            sub: (sessRead(w, k) ? "Hecho · " : "Opcional · ") + "la regla en pasos cortos" +
              (x.k === x.of - 1 && p.items.length ? " y " + p.items.length + " ejercicios del tema" : "") });
      });
      var weak = Drills.weakItems(course, w, state, itemMap).length;
      m({ kind: "debil", done: !!(state.weakDone || {})[w.week], ico: "🩹", opt: true, title: "Tus puntos débiles",
          sub: weak ? "Opcional · " + weak + " ejercicios de la estación que fallaste o casi no viste" : "Opcional · no fallaste nada todavía: repaso al azar" });
      m({ kind: "play", done: st.bossPassed, ico: "⚔️", title: "Vencé al " + UI.boss,
          sub: "Un examen de toda la estación: preguntas para escribir y de opción múltiple. 85 % en total y 55 % en cada parte. " +
            "Pregunta más de lo que más te costó. Superarlo te da las 3 estrellas; con 70 % en las frases nuevas, la cuarta" +
            (st.star4 ? " ⭐" : st.transfer ? " (tu mejor: " + st.transfer + " %)" : "") + ".", cls: "boss" });
      return out;
    }
    // One mission per session: short lessons in order (a part's training
    // comes with its last session).
    var psw = partsOf(w), ssw = sessionsOf(w);
    if (w.lesson) ssw.forEach(function (x, k) {
      var last = x.k === x.of - 1, p = psw ? psw[x.part] : null;
      m({ kind: "lez", arg: String(k), done: sessRead(w, k), ico: "📘",
          title: (ssw.length > 1 ? "Lección " + (k + 1) + "/" + ssw.length + ": " : "Lección: ") + x.h,
          sub: (sessRead(w, k) ? "Hecha · " : "") +
            (p && last ? p.items.length + " ejercicios de esta parte entran al entrenamiento" :
             !p && last && k === ssw.length - 1 ? "después, a entrenar la semana" : "teoría en pasos cortos, con chequeos") });
    });
    /* Each mission with a criterion of quality, said on its card (E5): it
       stays «a medias» (half, a grey star) until it is met.  Words: written
       at least once, not only seen. */
    if (w.vocab && w.vocab.length) {
      var seenV = w.vocab.filter(function (v) { return state.cards["v:" + v[0]]; }).length;
      var prodV = w.vocab.filter(function (v) { return (state.cards["v:" + v[0]] || {}).prod; }).length;
      m({ kind: "vocab", done: prodV >= w.vocab.length, half: seenV >= w.vocab.length && prodV < w.vocab.length, ico: "📚", title: "Palabras de la semana",
          sub: prodV + " / " + w.vocab.length + " escritas al menos una vez" + (seenV > prodV ? " · " + seenV + " vistas" : "") +
            (prodV && prodV < w.vocab.length ? " · Te falta: escribir " + (w.vocab.length - prodV) : " · primero reconocer, después escribir") });
    }
    m({ kind: "play", done: st.right >= 20, ico: "🎯", title: "Superá la semana",
        sub: Math.min(st.right, 20) + " / 20 respuestas correctas con los ejercicios de la semana" });
    if (window.Seminario) Seminario.missions(w, state).forEach(m);   // el seminario y los dilemas de la semana (seminario.js)
    // The duel that opens this week (both forms taught by now): optional.
    if (window.Duelli) Duelli.DUELLI.filter(function (d) { return d.week === w.week; }).forEach(function (d) {
      var best = (state.duelli || {})[d.id];
      m({ kind: "duello", arg: d.id, done: !!best && best.pct >= 80, ico: "⚔️", title: "Duelo: " + d.title, opt: true,
          sub: best ? "Tu mejor: " + best.pct + " %" + (best.pct >= 80 ? "" : " · Te falta: 80 %") : "Opcional · " + d.sub + ": las dos formas mezcladas y «¿qué te lo dijo?»" });
    });
    if (window.Escritos) Escritos.missions(w, state).forEach(m);   // escritura guiada (escritos.js), opcionales
    if (window.Capas) Capas.missions(w, state).forEach(m);   // Biblioteca y Tres vueltas (capas.js), opcionales
    var domDone = Drills.dominated(st, w, state);
    m({ kind: "play2", done: domDone, half: !domDone && !!st.domBest, ico: "🏆", title: "Dominala",
        sub: domDone ? "Dominada" + (st.domPct ? " · " + st.domPct + " %" : "")
          : w.lesson && !lessonRead(w.week) ? "Se abre cuando termines la lección: pregunta toda la semana"
          : "Una sola sesión de " + Drills.DOMINA_SIZE + " preguntas de toda la semana, sin vidas: con 85 % la ganás" +
            (w.week >= DOMINA_GATE ? " · abre la semana siguiente" : "") +
            (st.domBest ? " · tu mejor intento: " + st.domBest + " % · Te falta: 85 %" : "") });
    // A lesson with less than 70 % in its checks: its training comes right
    // after the lesson, before the rest.
    if ((state.lessonScore || {})[w.week] != null && state.lessonScore[w.week] < 70) {
      var pi = -1, lastLez = -1;
      out.forEach(function (x, k) { if (x.kind === "play" && pi < 0) pi = k; if (x.kind === "lez") lastLez = k; });
      if (pi > lastLez + 1 && !out[pi].done) {
        var first = out.splice(pi, 1)[0];
        first.sub = "Primero esto: los chequeos de la lección salieron por debajo del 70 % · " + first.sub;
        out.splice(lastLez + 1, 0, first);
      }
    }
    return out;
  }
  // From this week on, Dominala opens the next one (before, the lesson and
  // the twenty right answers, so as not to scare anyone off).
  var DOMINA_GATE = 5;

  function nextMission(w) {
    return weekPlan(w).filter(function (x) { return !x.done; })[0] || null;
  }

  /* The next week opens when every mission of this one is done: the
     lesson, the words, the twenty right answers, the phrases, the reading,
     the lab and the bank of the week, each one with its criterion; and
     from week 5 on, «Dominala» too (the only mission that asks producing
     the whole week well). */
  function pendingToAdvance(w) {
    if (w.boss) return weekStat(w.week).bossPassed ? [] : ["Vencé al " + UI.boss];
    return weekPlan(w).filter(function (x) { return !x.done && (x.kind !== "play2" || w.week >= DOMINA_GATE) && !x.opt; })
      .map(function (x) { return x.title + (x.half ? " (a medias)" : ""); });
  }
  // The weeks of the course (the ones written so far; Engine.weeks()).
  function NW() { return course && course.weeks && course.weeks.length || Engine.weeks(); }
  function tryAdvance(week) {
    var w = course.weeks[week - 1];
    if (!w || w.boss || week < state.unlocked || week >= NW()) return false;
    if (pendingToAdvance(w).length) return false;
    state.unlocked = Math.min(NW(), week + 1);
    return true;
  }

  function goMission(kind, arg) {
    var w = course.weeks[view.week - 1];
    if (kind === "lez") startLezione(arg != null ? +arg : undefined);
    else if (kind === "vocab") startRound("vocab");
    else if (kind === "play") startRound(w.boss ? "boss" : "round");
    else if (kind === "play2") startRound("domina");
    else if (kind === "debil") startRound("debil");
    else if (kind === "duello") startRound("duello", arg);
    else if (window.Escritos && Escritos.handles(kind)) Escritos.go(kind, arg);
    else if (window.Capas && Capas.handles(kind)) Capas.go(kind, arg);
    else if (window.Seminario && Seminario.handles(kind)) Seminario.go(kind, arg);
  }

  function missions(w, st, nChal) {
    var plan = weekPlan(w), doneN = plan.filter(function (x) { return x.done; }).length;
    var left = pendingToAdvance(w);
    var html = '<div class="card"><h2>Misiones ' + starsHtml(weekStars(w)) +
      ' <small class="muted">' + doneN + " / " + plan.length + "</small></h2>" +
      (w.boss ? (w.week < NW() ? '<p class="muted">⚔️ El ' + UI.boss + " abre la semana " + (w.week + 1) + ". Los repasos por tema y tus puntos débiles son opcionales: sirven para llegar preparado.</p>" : "")
        : w.week < NW() && state.unlocked <= w.week
        ? '<p class="muted">🔒 La semana ' + (w.week + 1) + " se abre al completar " + (left.length === 1 ? "esta misión" : "estas " + left.length + " misiones") +
          (w.week >= DOMINA_GATE ? " (Dominala incluida)." : " (todas menos Dominala).") + " ☆ = a medias: falta el criterio de la tarjeta.</p>"
        : '<p class="muted">🔓 Semana ' + (w.week + 1) + " abierta.</p>") +
      "<div class=\"missions\">";
    plan.forEach(function (x, k) {
      html += '<button class="mission' + (x.done ? " done" : x.half ? " half" : "") + (x.cls ? " " + x.cls : "") +
        '" data-m="' + x.kind + '"' + (x.arg ? ' data-arg="' + esc(x.arg) + '"' : "") + ">" +
        '<span class="mi">' + (x.done ? "★" : x.half ? '<span class="halfstar" title="a medias">☆</span>' : x.ico) + "</span><span><b>" + (k + 1) + ". " + x.title +
          (x.half ? ' <em class="muted">· a medias</em>' : "") + "</b><small>" + x.sub + "</small></span>" +
        '<span class="go">›</span></button>';
    });
    html += "</div>";
    html += '<div class="row" style="margin-top:12px">' +
      (w.lesson ? '<button class="tab" id="teo">📄 Ver la teoría entera</button>' : "") +
      (nChal ? '<button class="tab" id="chal">📖 ' + UI.chal + " (" + nChal + ")</button>" : "") +
      "</div></div>";
    return html;
  }

  /* The week's words, the first thing of the week (3.4), in the same
     display as its missions: one row per word, 🔊 to hear it, the meaning
     and the example; ★ once written right at least once.  Below, the round
     that goes from recognising the meaning to writing the word. */
  function vocabCard(w) {
    if (!w.vocab || !w.vocab.length) return "";
    var prod = w.vocab.filter(function (v) { return (state.cards["v:" + v[0]] || {}).prod; }).length;
    return '<div class="card wwords"><h2>📚 Palabras de la semana <small class="muted">' + prod + " / " + w.vocab.length + " escritas</small></h2>" +
      '<div class="missions">' + w.vocab.map(function (v) {
        var c = state.cards["v:" + v[0]], ok = !!(c && c.prod);
        return '<div class="mission word' + (ok ? " done" : "") + '">' +
          '<button class="mi say" data-say="' + esc(v[0]) + '" aria-label="Escuchar ' + esc(v[0]) + '">' + (ok ? "★" : "🔊") + "</button>" +
          '<span><b lang="' + LG.tts + '">' + esc(v[0]) + "</b><small>" + esc(v[1]) +
            (v[2] ? ' · <i lang="' + LG.tts + '">' + esc(v[2]) + "</i>" : "") + "</small></span>" +
          (window.Referencia ? Referencia.button(v[0]) : "") + "</div>";
      }).join("") + "</div>" +
      '<div class="row" style="margin-top:10px"><button class="btn" id="vocab">Practicar las palabras</button></div></div>';
  }

  function renderBriefing(w) {
    var st = weekStat(w.week);
    // Reference reading, when the course brings any (build_course.py:
    // week.refs, { manual: [chapters] } or a list of strings).
    var refs = [], R = w.refs || {};
    if (Array.isArray(R)) refs = R.map(function (x) { return esc(x); });
    else Object.keys(R).forEach(function (k) {
      var v = R[k];
      if (!v || (Array.isArray(v) && !v.length)) return;
      var name = (LG.refNames || {})[k] || "<b>" + esc(k) + "</b>";     // LANG.refNames: the books by name
      refs.push(name + (Array.isArray(v) ? ", cap. " + v.map(esc).join(", ") : " · " + esc(v)));
    });

    var nChal = (w.challenges || []).length;

    return '<button class="btn ghost" id="back">← ' + UI.pathAl + "</button>" +
      plate(UI.week + " " + weekNum(w.week) + " · " + esc(w.level), esc(w.title), true) +
      '<p class="lead">' + mk(w.focus) + '</p>' +
      (w.fare ? '<p class="fare">🎯 Al final de la semana: <b>' + mk(w.fare) + '</b>' +
        (w.tema ? ' <span class="muted">· ' + esc(w.tema) + '</span>' : '') + '</p>' : '') +
      vocabCard(w) +
      missions(w, st, nChal) +
      (window.Seminario ? Seminario.litCard(w) : "") +      // la literatura de la semana (seminario.js)
      '<div class="card"><h2>Lo que se juega esta semana</h2>' +
        '<ul class="keys">' +
          w.keys.map(function (k) { return "<li>" + mk(k) + "</li>"; }).join("") +
        '</ul>' +
        (refs.length ? '<h3>Lectura de apoyo</h3><p class="refs">' + refs.join(" · ") + "</p>" : "") +
      '</div>';
  }

  /* ------------------------------------------------------------ entrenamiento */

  /* Lives are a gauge, not a wall: each error empties a heart so you see
     where the round went wrong, but you always play to the end (a round cut
     in half teaches nothing).  Phrase sessions have none: they are for flow. */
  var WITH_LIVES = { round: 1, boss: 1 };
  // Only these rounds count towards unlocking the next grammar week.
  var WEEK_KINDS = { round: 1, pausa: 1, vocab: 1, giorno: 1, debil: 1, domina: 1 };
  // Rounds whose answers count as the week's progress (review mixes weeks).
  var COUNT_KINDS = { round: 1, pausa: 1, boss: 1, vocab: 1, giorno: 1, debil: 1, domina: 1 };

  /* Las cuatro cuerdas de Nation (la guía): input, output, forma, fluidez. */
  function strandOf(it, kind) {
    if (it.unamas) return "output";      // «Ahora vos: una más» is writing practice (unamas.js)
    if (it.type === "listen") return "input";
    if (it.type === "write" || it.type === "translate" || it.type === "typed" || it.type === "fixerr" || it.type === "combina") return "output";
    if (it.type === "flash") return "fluidez";
    return "forma";
  }
  function doneCount(w) { return weekPlan(w).filter(function (x) { return x.done; }).length; }
  function planKey(x) { return x.kind + "|" + (x.arg == null ? "" : x.arg); }
  function planSnap(w) {
    var o = {};
    if (w) weekPlan(w).forEach(function (x) { o[planKey(x)] = { done: !!x.done, sub: x.sub, right: x.kind === "play" ? weekStat(w.week).right : null }; });
    return o;
  }
  /* What a round moved in the week's missions: the ones done now and the
     ones that advanced, with their count («Superá la semana: 13 / 20 · +7
     en esta ronda · te faltan 7»).  Before 3.1 the result said nothing and
     a mission that barely moved looked stuck. */
  function planMovedHtml(r0) {
    var w = course.weeks[(round.week || view.week) - 1];
    if (!w || !r0) return "";
    var lines = [];
    weekPlan(w).forEach(function (x) {
      var b = r0[planKey(x)];
      if (!b || b.done) return;
      if (x.done) { lines.push("✅ <b>" + x.title + "</b>: hecha"); return; }
      if (x.kind === "play") {
        var now = weekStat(w.week).right, plus = now - (b.right || 0);
        if (plus > 0) lines.push("🎯 <b>" + x.title + "</b>: " + Math.min(now, 20) + " / 20 · +" + plus + " en esta ronda · te faltan " + Math.max(0, 20 - now));
        return;
      }
      if (x.sub !== b.sub) lines.push(x.ico + " <b>" + x.title + "</b>: " + x.sub.split(" · ")[0]);
    });
    return lines.length ? '<div class="note planmoved"><b>En la semana ' + w.week + "</b><br>" + lines.join("<br>") + "</div>" : "";
  }

  function startRound(kind, arg) {
    var w = course.weeks[view.week - 1];
    var items;
    if (kind === "giorno") {
      w = course.weeks[Math.min(state.unlocked, NW()) - 1];
      view.week = w.week;
      // six written questions of the rules that are due (reglas.js)
      items = window.Reglas ? Reglas.dailyItems(state, 6) : [];
      if (items.length < 6) items = items.concat(Drills.buildRound(course, w, { map: itemMap, state: state, silent: state.silent, size: 6 - items.length, only: partItems(w) }));
    }
    else if (kind === "boss") items = Drills.buildBoss(course, w, state, { map: itemMap, silent: state.silent });
    else if (kind === "debil") items = Drills.buildWeak(course, w, state, { map: itemMap, size: 15, only: partItems(w) });
    else if (kind === "domina") {
      // the whole week, so only once the whole lesson has been read
      if (w.lesson && !lessonRead(w.week)) { toast("«Dominala» pregunta toda la semana: se abre cuando termines la lección.", 3500); return; }
      items = Drills.buildDomina(course, w, state, { map: itemMap, silent: state.silent });
    }
    else if (kind === "review") items = Drills.buildReview(course, state, 20, drillOpts());
    else if (kind === "pausa") {
      w = course.weeks[Math.min(state.unlocked, NW()) - 1];
      view.week = w.week;
      // Only from lessons already read: before lesson 1 the coffee break
      // is the review and the concepts.
      var taught = null;
      for (var tw = Math.min(state.unlocked, NW()); tw >= 1; tw--) {
        if (lessonRead(tw)) { taught = course.weeks[tw - 1]; break; }
      }
      items = Drills.buildPausa(course, state, taught, drillOpts());
      // escritura guiada, con poco peso: a veces un ítem (escritos.js)
      var ei = window.Escritos && Escritos.pausaItem(state, taught ? taught.week : 0);
      if (ei) items.splice(Math.min(6, items.length), 0, ei);
    } else if (kind === "vocab") items = Drills.withWordIntros(Drills.vocabSession(course, w, state, 14), state);
    else if (kind === "ritorno") items = ritornoItems();
    else if (kind === "dos") items = dosItems();
    else if (kind === "micro") items = Drills.buildReview(course, state, 5, drillOpts());
    else if (kind === "duello") items = window.Duelli ? Duelli.session(arg, state.cards) : [];
    else if (kind === "lista") items = (arg || []).slice();       // the items given (__test.play)
    else if (kind === "sfida") {
      var ch = course.challenges.filter(function (c) { return c.id === arg; })[0];
      items = ch && ch.play ? ch.play.map(function (id) { return itemMap[id]; }).filter(Boolean) : [];
      items = Drills.firstRecognize(items, state, w.week);
    }
    else {
      // «A entrenar esta parte»: only the exercises of that part.
      var pk = /^part:\d+$/.test(arg || "") ? +arg.slice(5) : null, pps = partsOf(w);
      var only = pk != null && pps && pps[pk] ? pps[pk].items.reduce(function (o, id) { o[id] = 1; return o; }, {}) : partItems(w);
      items = Drills.buildRound(course, w, { map: itemMap, state: state, silent: state.silent, only: only, focus: pk != null,
                                             push: kind === "round" && weekStat(w.week).right < 20 });
    }

    if (!items.length) { toast("No hay preguntas para este modo todavía."); return; }

    round = {
      kind: kind,
      arg: arg,
      // A round that starts from the week (its briefing, its challenges, its
      // lesson's «A entrenar») goes back to the week.
      from: view.screen === "briefing" || view.screen === "sfide" || view.screen === "lezione" ? "briefing" : null,
      items: items,
      i: 0,
      right: 0,
      close: 0,
      wrong: 0,
      combo: 0,
      bestCombo: 0,
      lives: kind === "boss" ? 3 : WITH_LIVES[kind] ? 5 : Infinity,
      maxLives: kind === "boss" ? 3 : 5,
      xp: 0,
      answered: false,
      picked: [],
      again: {},
      tried: false,
      log: [],
      fixed: 0,
      week: view.week,
      planDone: doneCount(course.weeks[view.week - 1]),
      // the week's missions before the round: the result says what moved (3.1)
      plan0: planSnap(course.weeks[view.week - 1]),
      // «¿Cuánto creés que vas a sacar?» before Dominala and the boss
      askPredict: kind === "domina" || kind === "boss",
      predict: null,
      // A chest ticket or the daily challenge: double xp for this round.
      boost: kind === "giorno" || (state.boost > 0 && kind !== "review" && kind !== "pausa")
    };
    if (round.boost && kind !== "giorno") { state.boost--; persist(); renderHeader(); }
    view.screen = "gioco";
    render();
    savePending();
  }

  function currentItem() { return round.items[round.i]; }

  function hud() {
    var hearts = "";
    if (round.lives !== Infinity) {
      for (var i = 0; i < round.maxLives; i++) hearts += i < round.lives ? "❤️" : "🤍";
      // Past zero you keep playing; the hearts just stay empty.
    }
    return '<div class="hud">' +
        (hearts ? '<span class="hearts">' + hearts + "</span>" : "") +
        // Drawn at the previous step and grown after paint, so it visibly advances.
        '<span class="progressline"><i style="width:' +
          Math.round(Math.max(0, round.i - 1) / round.items.length * 100) + '%" data-to="' +
          Math.round(round.i / round.items.length * 100) + '"></i></span>' +
        '<span class="muted">' + (round.i + 1) + UI.of + round.items.length + "</span>" +
        dai(round.i, round.items.length) +
        (round.combo > 1 ? '<span class="combo pop" title="Racha de respuestas escritas">✍️×' + round.combo + "</span>" : "") +
        '<button class="btn ghost" id="quit">✕</button>' +
      "</div>";
  }

  /* Fatigue: when the accuracy of the last eight answers drops twenty
     points under the session's, the round offers to stop (no new items
     are learnt tired: intra-session dropout models, Riiid 2020). */
  function fatigued() {
    var l = round.log.filter(function (x) { return !x.retry; });
    if (l.length < 12 || round.fatigueShown) return false;
    var acc = function (arr) { return arr.filter(function (x) { return x.verdict === "giusto"; }).length / arr.length; };
    return acc(l.slice(-8)) <= acc(l) - 0.2;
  }

  /* Before Dominala and the boss: a prediction of one tap, compared with
     the result at the end (Dunlosky & Rawson 2012). */
  function predictHtml() {
    return hud() + '<div class="card intro predict">' +
      '<div class="badge-new">🔮 Antes de empezar</div>' +
      "<h2>¿Cuánto creés que vas a sacar?</h2>" +
      '<p class="muted">Un toque. Al final lo comparamos con lo que saques: saber cuánto sabés también se entrena.</p>' +
      '<div class="options">' + [60, 75, 90].map(function (p) {
        return '<button class="opt" data-pred="' + p + '">' + p + " %</button>";
      }).join("") + "</div>" +
      '<button class="tab" id="nopred">Prefiero no decir</button></div>';
  }

  function renderGioco() {
    var it = currentItem();
    if (!it) return "";
    if (round.askPredict && round.predict == null && round.i === 0) return predictHtml();
    var fatigue = "";
    if (fatigued()) {
      round.fatigueShown = true;
      fatigue = '<div class="note fatigue">😮‍💨 Bajó la precisión en las últimas ocho. Ya cumpliste el mínimo: ' +
        '¿seguís o cerramos acá? <button class="tab" id="stophere">Cerrar acá</button></div>';
    }
    // Several blanks: numbered, answered in order («a / b»).
    var gaps = (String(it.stem || "").match(/_{3,}/g) || []).length;
    var multi = gaps > 1 && /\|/.test(it.answer || "");
    var gi = 0;
    var body = "", stem = /^\s*_+\s*$/.test(it.stem || "") ? ""
      : esc(it.stem).replace(/_{3,}/g, function () {
        return multi ? '<span class="gap n">' + (++gi) + "</span>" : '<span class="gap">&nbsp;</span>';
      });
    var prompt = (it.retry ? '<div class="badge-new">🔁 Segunda vez, más fácil</div>' : "") +
      (it.unamas && window.UnaMas ? UnaMas.badge(it) : "") +
      '<div class="prompt">' + esc(DV ? DV.plain(it.prompt || "") : it.prompt || "") + "</div>" +
      // a check of the lesson missed comes back with its rule in sight
      (it.ruleShown ? '<div class="note">📐 ' + mk(it.ruleShown) + "</div>" : "") +
      (it.ruleReview && it.novel ? '<div class="muted small">🧭 Una regla de la semana ' + (Reglas.parse(it.rule) || {}).week + ", en una oración nueva</div>" : "") +
      // the second time, the rule with the answer covered: it shows after answering
      (function () {
        if (!it.retry || !it.note || it.recog || !DV) return "";
        var rn = DV.retryNote(it);
        return rn ? '<div class="note">📐 ' + mk(DV.plain(rn)) + "</div>" : "";
      })();

    if (it.type === "word") {
      var wv = it.word;
      return hud() + '<div class="card intro">' +
        '<div class="badge-new">📚 Palabra nueva</div>' +
        '<div class="fit big">' + esc(wv[0]) + "</div>" +
        '<div class="fes">' + esc(wv[1]) + "</div>" +
        (wv[3] ? '<div class="call tip"><b>Cómo se usa</b><p>' + mk(wv[3]) + "</p></div>" : "") +
        (wv[2] ? '<div class="note">' + esc(wv[2]) + "</div>" : "") +
        '<div class="row" style="margin-top:14px"><button class="btn ghost" id="sayit">🔊 Escuchar</button></div>' +
        '<p class="muted">Decila en voz alta: en un rato te pregunto qué significa.</p>' +
        keywordBox(wv[0]) +
        '<button class="btn wide" id="next">La tengo →</button>' +
        "</div>";
    }

    if (it.type === "card") {
      return hud() + '<div class="card intro">' +
        '<div class="badge-new">📐 ' + esc(it.prompt) + "</div>" +
        "<h2>" + mk(it.h) + "</h2><p>" + mk(it.body) + "</p>" +
        (it.ex && it.ex.length ? '<ul class="exs">' + it.ex.map(function (e) {
          return '<li><span class="es">' + esc(e[0]) + '</span><span class="it">→ ' +
            esc(e[1]) + "</span></li>";
        }).join("") + "</ul>" : "") +
        '<button class="btn wide" id="next">Entendido →</button></div>';
    }

    var lead = "";
    if (it.type === "garden" && it.lead) {
      lead = '<div class="lead-ex"><span class="muted small">Seguí el patrón:</span><ul class="exs">' + it.lead.map(function (e) {
        return '<li><span class="es">' + esc(e[0]) + '</span><span class="it">→ ' + esc(e[1]) + "</span></li>";
      }).join("") + "</ul></div>";
    }
    if (it.type === "scopri" && it.data) {
      lead = '<div class="lead-ex data"><ol class="exs">' + it.data.map(function (d) { return "<li>" + esc(d) + "</li>"; }).join("") + "</ol></div>";
    }
    if (it.type === "scopri" || (it.type === "choice" && it.options)) {
      body = '<div class="options' + (it.type === "scopri" ? " rules" : "") + '">' + it.options.map(function (o, k) {
        return '<button class="opt" data-opt="' + k + '">' + esc(o) + "</button>";
      }).join("") + "</div>";
    } else if (it.type === "tiles") {
      body = '<div class="tiles-answer" id="tans"></div>' +
        '<div class="tiles-bank" id="tbank"></div>' +
        '<div class="row" style="margin-top:12px">' +
          '<button class="btn" id="tcheck">' + UI.check + "</button>" +
          '<button class="btn ghost" id="tclear">Borrar</button></div>';
    } else if (it.type === "listen") {
      body = '<div class="center"><button class="bigplay" id="play1">🔊</button>' +
        '<div><button class="tab" id="slow">🐢 más lento</button>' +
        // listening to tell sounds apart: the text would give it away
        (it.nopeek ? "</div>" : '<button class="tab" id="peek">👀 ver texto</button></div>' +
        '<div class="peek" id="peektxt" hidden>' + esc(it.stem) + "</div>") + "</div>" +
        '<div class="options">' + it.options.map(function (o, k) {
          return '<button class="opt" data-opt="' + k + '">' + esc(o) + "</button>";
        }).join("") + "</div>";
      stem = "";
    } else if (it.type === "flash") {
      body = '<div id="flash"><button class="btn wide" id="reveal">Mostrar respuesta</button></div>';
    } else if (it.type === "choice") {
      /* handled above */
    } else {
      body = '<div class="typed">' +
        '<textarea id="ans" class="grow" rows="1" autocomplete="off" autocapitalize="off" ' +
        'autocorrect="off" spellcheck="false" enterkeyhint="send" placeholder="' +
          (multi ? "las " + gaps + " respuestas en orden: 1 / 2" + (gaps > 2 ? " / 3" : "")
                 : it.type === "translate" ? UI.inLang : "tu respuesta…") + '"></textarea>' +
        // the letters a Spanish keyboard does not have at hand (LANG.ui.keys),
        // for the phones without long press
        '<div class="accents">' +
          UI.keys.map(function (c) {
            return '<button data-ins="' + c + '">' + c + "</button>";
          }).join("") +
          // with the phone's keyboard: back to the app's (teclado.js)
          '<button class="kbback" data-kbapp="1" title="teclado de la app">⌨️</button>' +
        "</div>" +
        '<button class="btn" id="send">' + UI.check + "</button></div>";
    }

    var sayBtn = it.type === "scopri" ? "" :
      ' <button class="tab" id="say" title="escuchar">🔊</button>';

    return hud() + fatigue +
      '<div class="card">' +
        prompt.replace("</div>", sayBtn + "</div>") +
        lead +
        (stem ? '<div class="stem"' + (it.type === "translate" || it.src === "vocab" ? "" : ' lang="' + LG.tts + '"') + ">" + stem + "</div>" : "") +
        body +
        // read aloud when it changes: the verdict and the correction
        '<div id="fb" aria-live="polite"></div>' +
      "</div>";
  }

  /* Fichas: toques para armar la frase. */
  function drawTiles() {
    var it = currentItem();
    var ans = $("#tans"), bank = $("#tbank");
    if (!ans || !bank) return;
    ans.innerHTML = round.picked.length
      ? round.picked.map(function (k, pos) {
          return '<button class="tile on" data-pos="' + pos + '">' + esc(it.tiles[k]) + "</button>";
        }).join("")
      : '<span class="muted">Tocá las palabras en orden…</span>';
    bank.innerHTML = it.tiles.map(function (t, k) {
      var used = round.picked.indexOf(k) >= 0;
      return '<button class="tile' + (used ? " used" : "") + '" data-tile="' + k + '"' +
        (used || round.answered ? " disabled" : "") + ">" + esc(t) + "</button>";
    }).join("");
    bank.querySelectorAll("[data-tile]").forEach(function (b) {
      b.onclick = function () {
        if (round.answered) return;
        fx.tap();
        round.picked.push(+b.dataset.tile);
        drawTiles();
      };
    });
    ans.querySelectorAll("[data-pos]").forEach(function (b) {
      b.onclick = function () {
        if (round.answered) return;
        round.picked.splice(+b.dataset.pos, 1);
        drawTiles();
      };
    });
  }

  function gradeTiles(it) {
    var built = round.picked.map(function (k) { return it.tiles[k]; }).join(" ");
    var words = function (s) { return String(s || "").toLowerCase().replace(/[.,;:!?¿¡«»"()]/g, " ").split(/\s+/).filter(Boolean).join(" "); };
    var ok = words(built) === words(it.answer);
    return { given: built, verdict: ok ? Engine.VERDICT.RIGHT : Engine.VERDICT.WRONG };
  }

  // Category groups come from the edition (LANG.diagGroups).
  var LEXICAL = (LG.diagGroups || {}).lexical || {};

  // Multiple choice: what you chose beside the right one (Shute 2008).
  function answer(given) {
    if (round.answered) return;
    var it = currentItem();
    var verdict = Engine.grade(given, it);
    // With buttons, a wrong option is a wrong choice, never «Casi»: the
    // typo tolerance of the typed answers would make a trap a «¡Casi!».
    if (verdict === Engine.VERDICT.CLOSE && it.options) verdict = Engine.VERDICT.WRONG;
    settle(verdict, given, chosenHtml(it, given, verdict));
  }

  /* What you chose, when the options are hidden under the sheet: the
     learner sees their answer beside the right one (the comparison is the
     feedback: Shute 2008), not only the right one. */
  function chosenHtml(it, given, verdict) {
    if (verdict === Engine.VERDICT.RIGHT || !given || !it.options) return "";
    return '<div class="diff chosen"><span class="k">vos</span> ' + markWords(given, it.answer, "bad") + "</div>";
  }

  /* One line of a vos / bien pair with the words that are not in the other
     line marked (a sentence); a single word is marked whole. */
  function markWords(line, other, cls) {
    var lw = String(line || "").trim().split(/\s+/);
    if (lw.length > 1) {
      var ow = String(other || "").split(/\s+/).map(function (w) { return Engine.normalise(w); });
      var out = lw.map(function (w) {
        return ow.indexOf(Engine.normalise(w)) >= 0 ? esc(w) : '<b class="' + cls + '">' + esc(w) + "</b>";
      }).join(" ");
      if (out.indexOf("<b") >= 0) return out;
    }
    return '<b class="' + cls + '">' + esc(line) + "</b>";
  }

  /* -------------------------------------------- producción y corrección */

  /* Written answers: Engine.grade, with the accepted forms of the item. */
  function produce(given) {
    if (round.answered) return;
    var it = currentItem();
    // Several blanks typed as «a / b» (or a | b): same as a b.
    if (/\|/.test(it.answer || "")) given = String(given).replace(/\s*[\/|]\s*/g, " ");
    if (!String(given || "").trim()) return;
    // Garden path (Tomasello & Herron 1988): the learner was led into the
    // error on purpose; the correction is the lesson.
    if (it.type === "garden" && it.trap && Engine.normalise(given) === Engine.normalise(it.trap)) {
      settle("sbagliato", given, '<div class="diag"><span class="tag">🪤 La trampa</span><p>' + mk(it.note || "") + "</p></div>", { label: "Caíste, y eso era la idea. Era así:" });
      return;
    }
    settle(Engine.grade(given, it), given, "");
  }

  function addAiNote(n) {
    if (!state.aiNotes) state.aiNotes = [];
    n.at = Date.now();
    ["ai", "app"].forEach(function (k) { if (n[k]) n[k] = String(n[k]).slice(0, 600); });
    state.aiNotes.unshift(n);
    state.aiNotes = state.aiNotes.slice(0, 80);
    persist();
  }

  /* ------------------------------------------ las respuestas correctas */

  /* After a right answer the sheet says little by default and more when
     it helps.  Elaborated feedback after a right answer pays off mainly
     when the learner was unsure or guessed: it keeps the low-confidence
     right answers from being forgotten (Butler, Karpicke & Roediger 2008),
     while after an easy, confident one more text is noise (Hattie &
     Timperley 2007).  So: a slip is said exactly (vos / bien), another
     accepted answer brings the main one («También se dice»), a trap
     dodged is named with its why, the other options' why is there folded;
     the rule of the item is open when it is new, a trap or the answer
     was unsure (a hint, a second try, a slip, a long time: DV.unsure),
     and folded in one line when the answer was quick on a known item. */
  function trapHtml(text) {
    return '<div class="diag trap"><span class="tag">🪤 Esquivaste la trampa</span><p>' + text + "</p></div>";
  }
  function slipHtml(given, target, sl, q) {
    var txt = mk(sl.map(DV.slipText).join(" · "));
    if (q === 2) return '<div class="note slip">✏️ Ojo: ' + txt + ".</div>";
    var at = {};
    sl.forEach(function (x) { at[x.i] = 1; });
    var line = function (s, cls) {
      return String(s).trim().replace(/\s*\|\s*/g, " ").split(/\s+/).map(function (w, i) {
        return at[i] ? '<b class="' + cls + '">' + esc(w) + "</b>" : esc(w);
      }).join(" ");
    };
    return '<div class="diag slip"><span class="tag">✏️ Un detalle</span>' +
      '<div class="diff"><span class="k">vos</span> ' + line(given, "bad") + '<br><span class="k">bien</span> ' + line(target, "fix") + "</div>" +
      "<p>" + txt + ".</p></div>";
  }
  // o: { ms, seen, fixed }; extra: what the caller already put in the sheet
  function rightParts(it, given, q, extra, o) {
    var p = { unsure: true, top: "", bottom: "", sol: null, trap: false };
    if (!DV || q < 1) return p;
    p.unsure = DV.unsure({ ms: o.ms, item: it, hinted: !!(round.hinted || round.tried), retry: !!it.retry, close: q === 1, fixed: !!o.fixed });
    var typed = !it.options && ["tiles", "flash", "listen"].indexOf(it.type) < 0;
    var accept = it.accept && it.accept.length ? it.accept : [it.answer];
    var v = q === 2 && typed && given ? DV.variant(given, it) : null;
    // the slip: exactly what differed (a capital, an accent, a double…)
    if (typed && given && !/class="diag/.test(extra || "")) {
      var tgt = v ? v.mine : DV.target(given, accept) || it.answer;
      var sl = DV.slips(given, tgt);
      if (sl.length) p.top += slipHtml(given, tgt, sl, q);
      else if (q === 1) {
        p.top += '<div class="diag slip"><span class="tag">✏️ Un detalle</span><div class="diff"><span class="k">vos</span> ' +
          markWords(given, tgt, "bad") + '<br><span class="k">bien</span> ' + markWords(tgt, given, "fix") + "</div></div>";
      }
    }
    // another accepted answer, or the main one with its alternatives
    if (v) {
      if (!v.wroteMain) p.sol = v.mine;
      p.top += '<div class="note also">🔀 ' + (v.wroteMain ? "También se dice: " : "Lo tuyo vale. También se dice: ") +
        v.others.map(function (x) { return "<b>" + esc(x) + "</b>"; }).join(" · ") + "</div>";
    }
    if (q !== 2) return p;
    // the trap dodged: the pattern of the examples, the false friend, the calque
    if (it.type === "garden" && it.trap) {
      p.trap = true;
      p.top += trapHtml("Los ejemplos llevaban a <b>" + esc(it.trap) + "</b>, pero es <b>" + esc(it.answer) + "</b>.");
    }
    return p;
  }

  function canClaim(it, given, extra) {
    if (!it || !String(given || "").trim()) return false;
    return !(it.type === "garden" && extra && extra.indexOf("La trampa") >= 0);
  }
  /* «🙋 Mi respuesta es válida» (P5), on any error sheet: the answer is
     accepted provisionally (no xp, and the error recorded for it is taken
     back from the profile, with its second pass), and it is noted for
     review with the item, the answer and what the app said. */
  function claimValid(it, given, sol, fbText) {
    var b = $("#claim"), o = $("#claimout");
    if (b) b.disabled = true;
    (round.recorded || []).forEach(function (row) { if (window.Errores) Errores.unrecord(state, row); });
    round.recorded = null;
    // the easier second pass of this item is not needed
    for (var k = round.i + 1; k < round.items.length; k++) {
      if (round.items[k] && round.items[k].retry && round.items[k].id === it.id) { round.items.splice(k, 1); break; }
    }
    Array.prototype.forEach.call(document.querySelectorAll("#fb .note"), function (n) { if (/Te la vuelvo a preguntar/.test(n.textContent)) n.remove(); });
    if (round.lives !== Infinity && round.lives < round.maxLives) round.lives++;
    var last = round.log[round.log.length - 1];
    if (last && last.id === it.id) last.claimed = true;
    var note = { id: it.id, prompt: it.prompt, stem: it.stem, given: given, answer: sol, app: fbText, kind: "alumno" };
    addAiNote(note);
    if (o) o.innerHTML = '<div class="note">🙋 Anotada para revisar: esta vez no cuenta como error. ' +
      "Queda en " + UI.me + " → «Correcciones para revisar», para copiarla y mandarla." + "</div>";
    var hh = document.querySelector(".hud .hearts");
    if (hh && round.lives !== Infinity) { var hs = ""; for (var q = 0; q < round.maxLives; q++) hs += q < round.lives ? "❤️" : "🤍"; hh.textContent = hs; }
  }

  // Record a verdict: SRS, stats, xp, feedback panel.
  function settle(verdict, given, extra, opts) {
    if (round.answered) return;
    opts = opts || {};
    var it = currentItem();
    round.answered = true;
    if (opts.fixed) round.fixed = (round.fixed || 0) + 1;
    // seen before and how long it took: a right answer is sure or unsure (rightParts)
    var seenBefore = !!state.cards[it.id];
    var took = round.shownAt ? Date.now() - round.shownAt : null;

    var q = verdict === Engine.VERDICT.RIGHT ? 2
          : verdict === Engine.VERDICT.CLOSE ? 1 : 0;

    // Written (produced) or recognised among options: the xp and the streak
    // of written answers («racha de escritos») go by that.
    var produced = !it.recog && it.type !== "choice" && !it.options;
    var wrote = Engine.written ? Engine.written(it) : produced;
    if (q === 2) {
      round.right++;
      if (wrote) round.combo++;
      round.bestCombo = Math.max(round.bestCombo, round.combo);
      fx.right();
    } else if (q === 1) { round.close++; round.combo = 0; fx.close(); }
    else {
      round.wrong++; round.combo = 0; fx.wrong();
      if (round.lives !== Infinity && !it.unamas) round.lives--;   // «una más» is optional: no life lost
    }

    // a rule of a month ago or more, written: it pays more (reglas.js)
    var oldRule = !!(window.Reglas && Reglas.isOld(it, state));
    var gained = Engine.xpFor(verdict, round.combo, it, { old: oldRule && wrote });
    if (it.retry) gained = Math.ceil(gained / 2);     // the easier second pass pays half
    if (state.streak >= 7) gained = Math.round(gained * 1.2);   // a week of streak pays more
    if (round.boost) gained *= 2;
    round.xp += gained;
    Engine.addStrand(state, strandOf(it, round.kind), gained);
    round.log.push({ id: it.id, verdict: verdict, given: given, answer: it.answer, retry: !!it.retry,
                     novel: !!it.novel, fixed: !!opts.fixed, skill: it.skill || "", old: !!it.old || oldRule,
                     rule: it.rule || "", stem: it.stem || "", prompt: it.prompt || "" });

    // How long it took: right and quick (under half of what counts as slow
    // for this kind of item) is Easy; right and slow is Hard.
    var slowT = window.Devolucion && Devolucion.slowAfter ? Devolucion.slowAfter(it) : null;
    var fast = q === 2 && produced && !round.tried && took != null && slowT && took < slowT / 2;
    var slow = q === 2 && took != null && slowT && took > slowT * 1.5;
    // The diagnosis says what kind of mistake it was (a slip, a word, a rule).
    var dg = round.lastDiag; round.lastDiag = null;
    var ekind = q === 1 && (!dg || dg.slip) ? "slip"
      : q === 0 && dg && LEXICAL[dg.cat] ? "vocab" : q === 0 ? "rule" : null;
    /* The card of the item and the one of its rule (reglas.js): generated
       conjugation drills are endless by design and make no card; in the
       rounds a right recognition makes none either (it comes back written,
       and its rule has a card that brings new sentences); what failed and
       what was written enters. */
    if (window.Reglas) {
      Reglas.afterAnswer(state, it, q, { kind: round.kind, ekind: ekind, hint: !!round.tried || !!opts.fixed,
        fast: !!fast, slow: !!slow, ms: took, notte: state.notte !== false, produced: produced });
    } else if (!it.nocard) {
      state.cards[it.id] = Engine.schedule(state.cards[it.id], q, {
        kind: ekind, id: it.id, state: state, retry: !!it.retry, hint: !!round.tried || !!opts.fixed,
        fast: !!fast, slow: !!slow, ms: took, notte: state.notte !== false });
      Engine.maybeFit(state);
    }
    // The ladder inside the round: recognised right and quick → the next of
    // the same rule written; written and missed → the next with options.
    var recogFast = q === 2 && it.recog && took != null && slowT && took < slowT / 2;
    if (window.Reglas && round.kind !== "boss" && round.kind !== "domina") Reglas.adaptNext(round, it, q, recogFast);
    // Productive practice of the week's own rule, day by day (a rule is a
    // card of its own: three days of writing it right consolidate it).
    if (q === 2 && !it.recog && !it.options && it.src !== "vocab" &&
        !it.ruleReview && !it.old && !it.unamas && COUNT_KINDS[round.kind]) {
      Engine.noteProduction(state, view.week);
    }

    /* Successive relearning (Rawson & Dunlosky 2011): what you miss comes
       back later in the same session, until you get it (at most twice). */
    var relearn = "";
    if (q < 2 && round.kind !== "boss" && !it.retry && !it.unamas && !(round.again[it.id])) {
      round.again[it.id] = 1;
      var at = Math.min(round.items.length, round.i + 3);
      round.items.splice(at, 0, retryVersion(it));
      relearn = '<div class="note">🔁 Te la vuelvo a preguntar en un rato, más fácil.</div>';
    }
    // «Ahora vos: una más» (unamas.js): after a mistake of a rule, one new
    // item of the same rule with other words, optional, as the next question.
    var oneMore = window.UnaMas && q < 2 ? UnaMas.offer(it, { q: q, ekind: ekind, dg: dg || round.firstDiag, kind: round.kind,
      state: state, round: round, map: itemMap, course: course }) : null;

    state.totals.attempts++;
    if (q === 2) state.totals.right++;
    else if (q === 1) state.totals.close++;
    else state.totals.wrong++;

    // Only the week's own exercises count towards its stars: not the
    // concepts (that is how a week got «mastered» after seeing 7 items),
    // not the rules of other weeks (a new sentence, the old ones of Dominala).
    if (it.src !== "vocab" && !it.ruleReview && !it.old && !it.unamas && COUNT_KINDS[round.kind]) {
      var ws = state.weekStats[view.week] ||
        (state.weekStats[view.week] = { attempts: 0, right: 0, bossPassed: false });
      ws.attempts++;
      if (q === 2) ws.right++;
      // What you fixed yourself counts as learnt here too (Metcalfe 2017).
      ws.last = (ws.last || []).concat([q === 2 || opts.fixed ? 1 : 0]).slice(-30);
    }

    gain(gained);
    persist();
    renderHeader();
    if (gained) xpFly(gained);

    var label = opts.label || { giusto: pick(UI.giusto), quasi: UI.quasi, sbagliato: pick(UI.sbagliato) }[verdict];
    // what the learner can claim as valid: this answer, or the one before «Ver la respuesta»
    var claimGiven = String(given || "").trim() ? given : round.tried ? round.lastGiven || "" : "";
    var rp = rightParts(it, given, q, extra, { ms: took, seen: seenBefore, fixed: !!opts.fixed });
    var sol = rp.sol || it.answer;
    // A quick right answer on a known item: the rule folded in one line.
    var calm = q === 2 && !rp.unsure && !rp.trap && seenBefore;
    var noteHtml = !it.note || (it.type === "garden" && extra && extra.indexOf("La trampa") >= 0) ? ""
      : calm ? '<details class="why-ok"><summary>📐 Por qué está bien</summary><div class="note">' + mk(DV ? DV.plain(it.note) : it.note) + "</div></details>"
      : '<div class="note">' + mk(DV ? DV.plain(it.note) : it.note) + "</div>";
    /* The order of the sheet: the verdict, the right form («Era así:»
       points at it), what you wrote beside it and why it was wrong, the
       rule of the item; then what is there to look up, folded (your
       keyword), so «Siguiente» stays in sight on a phone.  Elaborated
       feedback works when it is short and says the why first (Shute 2008). */
    var fb = '<div class="feedback ' + verdict + '">' +
      '<div class="verdict">' + label +
        (gained ? ' <span class="xpgain">+' + gained + " xp</span>" : "") + "</div>" +
      '<div class="sol">' + esc(sol) + "</div>" +
      rp.top +
      (extra || "") +
      noteHtml +
      rp.bottom +
      (q === 2 && it.recogNote ? '<div class="note">' + esc(it.recogNote) + "</div>" : "") +
      (it.hint && it.src === "dummies"
        ? '<div class="note">Consigna original: ' + esc(it.hint) + "</div>" : "") +
      (function () {
        var vw = vocabWordOf(it), kw = vw && (state.keywords || {})[vw];
        return kw ? '<div class="note">🧷 Tu imagen: ' + esc(kw) + "</div>" : q < 2 && vw ? keywordBox(vw, true) : "";
      })() +
      relearn +
      '<div class="row" style="margin-top:10px">' +
        '<button class="btn" id="next">' + UI.next + "</button>" +
        (oneMore ? UnaMas.button() : "") +
        '<button class="tab" id="say2">🔊 escuchar</button>' +
        (q < 2 && canClaim(it, claimGiven, extra) ? '<button class="tab" id="claim">🙋 Mi respuesta es válida</button>' : "") +
      '</div><div id="claimout"></div></div>';

    $("#fb").innerHTML = fb;
    if (window.Porque) Porque.after(it);   // 📖 ¿Por qué?
    wireKeyword();

    // Mark the chosen option so the learner sees what they picked.
    var optEls = document.querySelectorAll(".opt");
    for (var i = 0; i < optEls.length; i++) {
      optEls[i].disabled = true;
      if (Engine.normalise(optEls[i].textContent) === Engine.normalise(it.answer)) {
        optEls[i].classList.add("right");
      } else if (Engine.normalise(optEls[i].textContent) === Engine.normalise(given)) {
        optEls[i].classList.add("wrong");
      }
    }
    var input = $("#ans");
    if (input) input.disabled = true;
    ["#tcheck", "#tclear", "#wsend", "#wans", "#easier", "#reveal", "#send"].forEach(function (s) {
      var b = $(s); if (b) b.disabled = true;
    });
    if (it.type === "tiles") drawTiles();

    var spoken = it.type === "scopri" ? it.stem : filledStem(it) || it.answer;
    // A Spanish answer (¿Qué significa «saudade»? → nostalgia) is not
    // read: the sentence of the question is, when there is one.
    if (spanishText(spoken) || (spoken === it.answer && asksMeaning(it))) spoken = it.stem && !/_{3,}/.test(it.stem) && !spanishText(it.stem) ? it.stem : "";
    $("#next").onclick = nextAfterFeedback();
    on("#unamas", function () { if (UnaMas.take(round, oneMore)) nextItem(); });
    var fbTextOf = function () {
      var t = ($("#fb") || {}).innerText || "";
      return t.split(UI.next)[0].replace(/\s+/g, " ").slice(0, 600);
    };
    on("#claim", function () { claimValid(it, claimGiven, sol, fbTextOf()); });
    $("#say2").onclick = function () { speak(spoken, true); };
    if (!spoken) $("#say2").hidden = true;
    else if (q === 2) speak(spoken);
    $("#fb").scrollIntoView({ behavior: "smooth", block: "nearest" });
    // The keyboard goes on: Enter (or the screen reader) lands on «Siguiente».
    try { $("#next").focus({ preventScroll: true }); } catch (e) { /* */ }
    // The answer is already counted (xp, card, lives): if the app closes now,
    // «Retomar» has to start from the next question, not ask this one again.
    var i0 = round.i;
    round.i = i0 + 1;
    savePending();
    round.i = i0;
  }

  /* The second time comes in another shape: two options with the rule in
     sight, or a recognition version of what had to be typed, or the phrase
     with tiles.  Never the same screen again (audit 2.1). */
  /* Keyword mnemonic (Atkinson & Raugh 1975): only for the opaque words,
     and written by the learner, which works better than one handed over.
     Shown again on the first encounter and whenever the word fails. */
  // folded: in the feedback, a line to open; the correction comes first.
  function keywordBox(word, folded) {
    if (!word) return "";
    var kw = (state.keywords || {})[word] || "";
    var field = '<div class="typed"><input id="kwin" data-kw="' + esc(word) + '" maxlength="80" placeholder="una imagen, una rima…" value="' + esc(kw) + '">' +
      '<button class="tab" id="kwsave">Guardar</button></div>';
    if (folded) {
      return '<details class="keyword"><summary class="muted small">🧷 Inventale una imagen para recordarla</summary>' +
        '<p class="muted small">Opcional: ' + UI.keywordEx + "</p>" + field + "</details>";
    }
    return '<div class="keyword"><label class="muted small">🧷 Tu imagen para recordarla <small>(opcional: ' + UI.keywordEx + ")</small></label>" +
      field + "</div>";
  }
  function wireKeyword() {
    var inp = $("#kwin");
    if (!inp) return;
    var save = function () {
      if (!state.keywords) state.keywords = {};
      var v = inp.value.trim();
      if (v) state.keywords[inp.dataset.kw] = v.slice(0, 80); else delete state.keywords[inp.dataset.kw];
      persist();
      toast(v ? "🧷 Guardada." : "Borrada.");
    };
    on("#kwsave", save);
    inp.onkeydown = function (e) { if (e.key === "Enter") { e.preventDefault(); save(); } };
  }
  function vocabWordOf(it) {
    if (!it) return null;
    if (it.id.indexOf("v:") === 0) return it.id.slice(2);
    return null;
  }

  function retryVersion(it) {
    var copy;
    if (it.retryAs) copy = Object.assign({}, it.retryAs);       // the item says its easier version
    else if (it.options && it.options.length > 2) {
      var wrong = Drills.shuffle(it.options.filter(function (o) {
        return Engine.normalise(o) !== Engine.normalise(it.answer);
      }));
      copy = Object.assign({}, it, { options: Drills.shuffle([it.answer, wrong[0]]) });
    } else if (!it.options) {
      copy = Drills.recognitionOf(it, round.items, view.week) || Object.assign({}, it);
    } else copy = Object.assign({}, it, { options: Drills.shuffle(it.options) });
    copy.retry = true;
    return copy;
  }

  /* «Siguiente» gets the focus after answering, so Enter moves on; an
     Enter held down or pressed twice right after answering (a keyboard
     click has no pointer: detail 0) must not skip the correction unread. */
  function nextAfterFeedback() {
    var at = Date.now();
    return function (e) {
      if (e && e.detail === 0 && Date.now() - at < 450) return;
      nextItem();
    };
  }

  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  /* A distracted learner closes the app mid-round: the round is kept in
     localStorage and Oggi / Hoje offers to pick it up where it was. */
  var PENDING_KEY = SKEY("pending.v1");
  function savePending() {
    try {
      var p = null;
      if (view.screen === "gioco" && round && round.i < round.items.length) {
        p = { type: "round", week: view.week, tab: view.tab, at: Date.now(),
              round: { kind: round.kind, arg: round.arg, from: round.from, items: round.items, i: round.i,
                       right: round.right, close: round.close, wrong: round.wrong, fixed: round.fixed || 0,
                       combo: round.combo, bestCombo: round.bestCombo,
                       lives: round.lives === Infinity ? null : round.lives, maxLives: round.maxLives,
                       xp: round.xp, again: round.again, log: round.log, askPredict: !!round.askPredict, predict: round.predict,
                       week: round.week, planDone: round.planDone } };
      } else if (view.screen === "lezione" && les && les.i < les.steps.length) {
        p = { type: "lezione", week: les.w.week, part: les.part, at: Date.now(), steps: les.steps, i: les.i, right: les.right, asked: les.asked };
      }
      if (p) localStorage.setItem(PENDING_KEY, JSON.stringify(p));
      else localStorage.removeItem(PENDING_KEY);
    } catch (e) { /* nada */ }
  }
  function clearPending() { try { localStorage.removeItem(PENDING_KEY); } catch (e) { /* */ } }
  function loadPending() {
    try {
      var p = JSON.parse(localStorage.getItem(PENDING_KEY) || "null");
      if (!p || !p.at || Date.now() - p.at > 2 * 86400000) return null;
      if (p.type === "round" && !(p.round && p.round.items && p.round.items.length)) return null;
      if (p.type === "lezione" && !(p.steps && course.weeks[p.week - 1] && course.weeks[p.week - 1].lesson)) return null;
      return p;
    } catch (e) { return null; }
  }
  var KIND_NAME = { debil: "Puntos débiles", domina: "Dominala", round: "Entrenamiento", giorno: UI.daily, boss: UI.Boss, pausa: UI.pausa, review: UI.review,
                    vocab: "Palabras de la semana", sfida: UI.sfida, ritorno: "Cinco minutos para retomar", micro: UI.micro,
                    duello: "Duelo" };
  function pendingTitle(p) {
    if (p.type === "lezione") return "Lección · semana " + p.week + " · " + (p.i + 1) + "/" + p.steps.length;
    return (KIND_NAME[p.round.kind] || "Ronda") + " · " + (p.round.i + 1) + "/" + p.round.items.length;
  }
  function resumePending() {
    var p = loadPending();
    if (!p) return;
    if (p.type === "round") {
      round = Object.assign({ answered: false, picked: [], tried: false, lastGiven: null, firstCat: null }, p.round);
      if (round.lives === null) round.lives = Infinity;
      view.week = p.week; view.tab = p.tab || "oggi"; view.screen = "gioco";
    } else {
      les = { w: course.weeks[p.week - 1], part: p.part == null ? null : p.part, steps: p.steps, i: p.i, right: p.right, asked: p.asked, answered: false };
      view.week = p.week; view.tab = "percorso"; view.screen = "lezione";
    }
    render();
    window.scrollTo(0, 0);
  }

  function nextItem() {
    round.i++;
    round.answered = false;
    round.tried = false;
    round.lastGiven = null;
    round.firstCat = null;
    round.firstDiag = null;
    round.hinted = false;
    round.picked = [];
    round.recorded = null;
    if (round.i >= round.items.length) {
      finishRound();
      return;
    }
    render();
    savePending();
    window.scrollTo(0, 0);
  }

  function finishRound() {
    var total = round.right + round.close + round.wrong;
    // What you fixed yourself counts as learnt (Metcalfe 2017).
    var pct = total ? Math.round((round.right + (round.fixed || 0)) / total * 100) : 0;
    var w = course.weeks[view.week - 1];

    clearPending();
    Engine.touchStreak(state);
    Engine.noteSession(state);
    if (round.kind === "dos" && total >= 1) { if (!state.dos) state.dos = {}; state.dos[Engine.dayKey()] = true; }
    if (!state.best) state.best = {};
    state.best.combo = Math.max(state.best.combo || 0, round.bestCombo);
    var records = [];
    if (total >= 8 && Engine.noteRecord(state, "sessione", pct)) records.push("🏅 Récord personal: tu mejor sesión, " + pct + " %");
    if (Engine.noteRecord(state, "settimane", Engine.weekStreak(state))) records.push("🏅 Récord personal: " + Engine.weekStreak(state) + " semanas seguidas con tres días");
    if (Engine.noteRecord(state, "parole", Engine.newWordsThisWeek(state))) records.push("🏅 Récord personal: " + Engine.newWordsThisWeek(state) + " palabras nuevas en una semana");
    if (Engine.noteRecord(state, "corrette", round.fixed || 0)) records.push("🏅 Récord personal: " + round.fixed + " errores corregidos por vos en una ronda");

    var passed = false, transfer = null, skills = null, oldRules = null;
    var okL = function (l) { return l.filter(function (x) { return x.verdict === Engine.VERDICT.RIGHT || x.fixed; }).length; };
    // The rules of a month ago or more, apart (they say whether what was learnt stayed).
    var oldOf = function (l) { var o = l.filter(function (x) { return x.old && !x.retry; }); return o.length ? { pct: Math.round(okL(o) / o.length * 100), n: o.length } : null; };
    if (round.kind === "boss") {
      // The new sentences (never practised) measure whether the rule
      // generalises: reported apart, they do not count for passing, but
      // they are the fourth star.
      var coreL = round.log.filter(function (x) { return !x.novel; }), novL = round.log.filter(function (x) { return x.novel; });
      pct = coreL.length ? Math.round(okL(coreL) / coreL.length * 100) : pct;
      if (novL.length) {
        transfer = { pct: Math.round(okL(novL) / novL.length * 100), n: novL.length };
        transfer.gap = pct - transfer.pct;
      }
      // One mark per part, and each one has to reach 55 % (writing,
      // multiple choice).
      skills = {};
      coreL.forEach(function (l) {
        var k = l.skill || "strutture", a = skills[k] || (skills[k] = { n: 0, ok: 0 });
        a.n++;
        if (l.verdict === Engine.VERDICT.RIGHT || l.fixed) a.ok++;
      });
      var eachOk = Object.keys(skills).every(function (k) { return skills[k].n < 2 || skills[k].ok / skills[k].n >= 0.55; });
      oldRules = oldOf(coreL);
      passed = pct >= 85 && eachOk;
      var ws = state.weekStats[view.week] ||
        (state.weekStats[view.week] = { attempts: 0, right: 0, bossPassed: false });
      if (transfer) {
        ws.transfer = Math.max(ws.transfer || 0, transfer.pct);
        if (passed && transfer.pct >= 70) ws.star4 = true;
      }
      if (passed) {
        ws.bossPassed = true;
        if (round.wrong === 0) ws.perfect = true;
        gain(Engine.XP.boss);
        if (view.week >= state.unlocked) state.unlocked = Math.min(NW(), view.week + 1);
      }
    }
    // (the next week opens from missionCheck, once every mission is done)

    if (round.kind === "debil") { if (!state.weakDone) state.weakDone = {}; state.weakDone[view.week] = true; }
    // Dominala: the first answer to each question counts (the second, easier
    // pass after a miss is for learning, not for the score).
    var domExtra = null;
    if (round.kind === "domina") {
      // (the rules of a month ago are reported apart)
      oldRules = oldOf(round.log);
      var firsts = round.log.filter(function (x) { return !x.retry && !x.old; });
      var okN = firsts.filter(function (x) { return x.verdict === Engine.VERDICT.RIGHT || x.verdict === Engine.VERDICT.CLOSE; }).length;
      var dp = firsts.length ? Math.round(okN / firsts.length * 100) : 0;
      var dws = state.weekStats[view.week] || (state.weekStats[view.week] = { attempts: 0, right: 0, bossPassed: false });
      dws.domBest = Math.max(dws.domBest || 0, dp);
      if (dp >= 85 && firsts.length >= Math.min(20, round.items.length)) {
        if (!dws.dominated) gain(60);
        dws.dominated = true; dws.domPct = Math.max(dws.domPct || 0, dp);
        domExtra = "🏆 ¡Semana dominada! " + dp + " % en " + firsts.length + " preguntas";
      } else domExtra = "🏆 Dominala: " + dp + " % (hace falta 85 %). Tu mejor intento: " + dws.domBest + " %.";
    }

    if (round.kind === "duello") {
      var dF = round.log.filter(function (x) { return !x.retry && !/:cue$/.test(x.id); });
      var dC = round.log.filter(function (x) { return !x.retry && /:cue$/.test(x.id); });
      var okD = function (l) { return l.filter(function (x) { return x.verdict === Engine.VERDICT.RIGHT; }).length; };
      var dpct = dF.length ? Math.round(okD(dF) / dF.length * 100) : 0;
      if (!state.duelli) state.duelli = {};
      var prevD = state.duelli[round.arg];
      state.duelli[round.arg] = { pct: Math.max(dpct, prevD ? prevD.pct : 0), last: dpct, at: Date.now() };
      var duelExtra = "⚔️ Forma elegida bien: " + dpct + " %" + (dC.length ? " · pista encontrada: " + Math.round(okD(dC) / dC.length * 100) + " %" : "");
    }

    if (round.kind === "sfida") {
      var prevS = state.challengeLog[round.arg];
      state.challengeLog[round.arg] = { q: pct >= 80 ? 2 : pct >= 50 ? 1 : 0,
        pct: Math.max(pct, prevS && prevS.pct || 0), at: Date.now() };
      if (!prevS) gain(Engine.XP.challenge);
    }

    var extras = [];
    if (round.kind === "giorno") {
      state.dailyDone = Engine.dayKey();
      if (pct >= 80) { state.dailyWon = (state.dailyWon || 0) + 1; extras.push(UI.dailyWon + " · " + state.dailyWon + " en total"); }
    }
    if (total >= 5 && state.firstRound !== Engine.dayKey()) {
      state.firstRound = Engine.dayKey();
      gain(25);
      extras.push("☀️ Primera ronda del día: +25 xp");
    }
    if (domExtra) extras.push(domExtra);
    if (duelExtra) extras.push(duelExtra);
    extras = extras.concat(records);
    extras = extras.concat(missionCheck(round.week, round.planDone));

    var won = Engine.checkBadges(state);
    persist();
    renderHeader();

    // The prediction against the result (kept, for Io's calibration).
    var predicted = null;
    if (round.predict) {
      predicted = { said: round.predict, got: pct, gap: pct - round.predict };
      if (!state.predictions) state.predictions = [];
      state.predictions.push({ kind: round.kind, week: view.week, said: round.predict, got: pct, at: Date.now() });
      state.predictions = state.predictions.slice(-40);
      persist();
    }

    view.screen = "risultato";
    view.result = { pct: pct, passed: passed, won: won, extras: extras, transfer: transfer, skills: skills,
                    oldRules: oldRules, predicted: predicted };
    if (pct >= 80 && total >= 5) setTimeout(confetti, 150);
    render();
  }

  /* A mission just closed, or the whole week: say so, loudly. */
  function missionCheck(week, before) {
    var w = course.weeks[week - 1];
    if (!w) return [];
    var plan = weekPlan(w), now = plan.filter(function (x) { return x.done; }).length, out = [];
    if (now > (before || 0)) {
      fx.goal();
      out.push("★ Misión completada · " + now + " / " + plan.length + " de la semana " + w.week);
    }
    var before2 = state.unlocked;
    if (tryAdvance(w.week) && state.unlocked > before2) {
      out.push("🔓 ¡Semana " + state.unlocked + " abierta!");
    } else if (w.week === state.unlocked && !w.boss) {
      var left = pendingToAdvance(w);
      if (left.length && now > (before || 0)) out.push("Para abrir la semana " + (w.week + 1) + ": " + left.join(", ") + ".");
    }
    if (now === plan.length && plan.length && !(state.perfectWeeks || {})[w.week]) {
      state.perfectWeeks = state.perfectWeeks || {};
      state.perfectWeeks[w.week] = Date.now();
      gain(100);
      setTimeout(confetti, 400);
      out.push("🏁 " + UI.perfectWeek + " Todas las misiones de la semana " + w.week + ": +100 xp");
    }
    return out;
  }

  function renderRisultato() {
    var r = view.result;
    var title = round.kind === "boss"
      ? (r.passed ? "⚔️ " + UI.Boss + " vencido" : UI.Boss + " no vencido")
      : r.pct >= 90 ? UI.great : r.pct >= 70 ? UI.good : "💪 Sesión terminada";
    var goal = Engine.goalFor(state), tx = Engine.todayXp(state);

    var html = '<h1>' + title + "</h1>" +
      '<div class="card">' +
      '<div class="scorebig"><b>' + r.pct + '%</b><span>+' + round.xp + ' xp</span>' +
        (round.bestCombo > 2 ? '<span>✍️ racha de escritos ×' + round.bestCombo + "</span>" : "") + "</div>" +
      '<div class="goalbar" style="margin:12px 0 4px"><i style="width:' +
        Math.min(100, Math.round(tx / goal * 100)) + '%"></i></div>' +
      '<p class="muted" style="margin:0 0 10px">Meta de hoy: ' + (tx >= goal ? tx + " xp" : tx + " / " + goal + " xp") +
        (tx >= goal ? " ✓ cumplida" : " — te faltan " + (goal - tx)) + "</p>" +
      '<table class="res">' +
        "<tr><td>Correctas</td><td>" + round.right + "</td></tr>" +
        (round.fixed ? "<tr><td>Corregidas por vos</td><td>" + round.fixed + "</td></tr>" : "") +
        "<tr><td>Casi</td><td>" + (round.close - (round.fixed || 0)) + "</td></tr>" +
        "<tr><td>Incorrectas</td><td>" + round.wrong + "</td></tr>" +
        "<tr><td>Racha</td><td>" + dias(state.streak) + " 🔥</td></tr>" +
      "</table>";

    if (round.kind === "dos") html += '<p class="note">✅ Día cumplido. Dos minutos alcanzan para no cortar la cadena; si te quedan ganas, seguí.</p>';
    html += planMovedHtml(round.plan0);
    (r.extras || []).forEach(function (x) { html += '<p class="note selfrepair">' + esc(x) + "</p>"; });
    if (round.boost) html += '<p class="muted">🎟️ Ronda con doble xp.</p>';

    // The prediction made before starting, against what came out.
    if (r.predicted) {
      var gp = r.predicted.gap;
      html += '<p class="note">🔮 Dijiste ' + r.predicted.said + " %, sacaste " + r.predicted.got + " %: " +
        (Math.abs(gp) <= 7 ? "te conocés bien." : gp > 0 ? "brecha de " + gp + " puntos: sabés más de lo que creés."
          : "brecha de " + (-gp) + " puntos: creías saber más. Lo que falló vuelve en el repaso.") + "</p>";
    }
    if (round.kind === "boss" && r.transfer) {
      html += '<h3>¿La regla generaliza?</h3><table class="res">' +
        "<tr><td>Con lo que practicaste</td><td>" + r.pct + " %</td></tr>" +
        "<tr><td>Con " + r.transfer.n + " frases nuevas</td><td>" + r.transfer.pct + " %</td></tr></table>" +
        '<p class="muted">Las frases nuevas no las viste nunca: no cuentan para aprobar, pero dicen si sabés la regla o te acordás de las frases' +
        (r.transfer.gap > 0 ? " (brecha de " + r.transfer.gap + " puntos)" : "") + ". " +
        (r.transfer.gap > 15 ? "<b>Acá hay distancia</b>: la Clínica y los duelos ayudan a generalizar."
          : "Van parejas: la regla está.") +
        (r.passed && r.transfer.pct >= 70 ? " <b>⭐ Cuarta estrella</b>: con 70 % o más en las frases nuevas." :
          r.passed ? " La cuarta estrella pide 70 % en las frases nuevas." : "") + "</p>";
    }
    if (round.kind === "boss") {
      // One mark per part, each one has to pass.
      var EX = LG.exam || {}, AB = EX.abilities || {};
      var ab = r.skills || {};
      var ORDER_AB = ["produzione", "strutture"];
      html += "<h3>" + EX.byAbility + '</h3><table class="res">' + ORDER_AB.filter(function (k) { return ab[k]; }).map(function (k) {
        var a = ab[k], p = Math.round(a.ok / a.n * 100);
        return "<tr><td>" + (AB[k] || k) + "</td><td>" + a.ok + " / " + a.n + " · " + (p >= 55 ? "✓" : "✗ (mínimo 55 %)") + "</td></tr>";
      }).join("") + "</table>";
    }
    if (r.oldRules) {
      html += '<p class="note">🗓️ Reglas de hace un mes o más: ' + r.oldRules.pct + " % en " + r.oldRules.n +
        (r.oldRules.n === 1 ? " pregunta" : " preguntas") + (round.kind === "domina" ? " (aparte: no cuentan para dominar la semana)" : "") + ".</p>";
    }
    if (round.kind === "boss") {
      html += r.passed
        ? '<p style="margin-top:14px">Semana ' + Math.min(NW(), view.week + 1) +
          " desbloqueada. +" + Engine.XP.boss + " xp</p>"
        : '<p style="margin-top:14px">Hace falta <b>85%</b> de aciertos y 55 % en cada parte. ' +
          "Repasá el briefing y volvé a intentarlo: si es hoy, con otras preguntas.</p>";
    }

    if (r.won && r.won.length) {
      html += "<h3>Medallas nuevas</h3>" + r.won.map(function (b) {
        return "<p>🏅 <b>" + esc(b.name) + "</b> — " + esc(b.desc) + "</p>";
      }).join("");
    }

    // One line per item, the question on the left, the answer on the right.
    var seenW = {};
    var wrong = round.log.filter(function (l) {
      if (l.verdict === Engine.VERDICT.RIGHT || seenW[l.id]) return false;
      seenW[l.id] = 1;
      return true;
    });
    if (wrong.length) {
      html += "<h3>Lo que aprendiste hoy (vuelve en " + UI.reviewEl + ")</h3><table class=\"res\">" +
        wrong.slice(0, 10).map(function (l) {
          var q = (l.stem && !/^\s*_+\s*$/.test(l.stem) ? l.stem : "") || l.prompt || "—";
          return "<tr><td>" + esc(String(q).replace(/_{3,}/g, "…")) + "</td><td>" +
            esc(l.answer) + "</td></tr>";
        }).join("") + "</table>" +
        (wrong.length > 10 ? '<p class="muted">y ' + (wrong.length - 10) + " más en " + UI.reviewEl + ".</p>" : "");
    }

    html += '<div class="row" style="margin-top:16px">' +
      (round.from === "hoy" && window.Inicio ? Inicio.resultButton() : "") +       // el plan de hoy sigue (inicio.js)
      (round.from === "briefing" ? '<button class="btn" id="backweek">← Seguir ' + UI.pathEl + "</button>" : "") +
      '<button class="btn' + (round.from === "briefing" ? " ghost" : "") + '" id="again">Otra ronda</button>' +
      '<button class="btn ghost" id="toggi">Inicio</button>' +
      "</div></div>";
    return html;
  }

  /* ------------------------------------------------------------ desafíos */

  function renderSfide(w) {
    var ids = {};
    (w.challenges || []).forEach(function (id) { ids[id] = true; });
    var list = course.challenges.filter(function (c) { return ids[c.id]; });
    var playable = list.filter(function (c) { return c.play && c.play.length; });
    var doneN = playable.filter(function (c) { return (state.challengeLog[c.id] || {}).q === 2; }).length;

    var html = '<button class="btn ghost" id="back2">← a la semana</button>' +
      "<h1>" + UI.chal + "</h1>" +
      '<p class="lead">' + UI.chalLead +
      "Con 80% o más lo ganás ★.</p>" +
      (playable.length ? '<div class="card pathsum"><b>' + doneN + " / " + playable.length + ' ★</b>' +
        '<span class="goalbar"><i style="width:' + Math.round(doneN / playable.length * 100) + '%"></i></span></div>' : "") +
      '<div class="missions">';

    list.forEach(function (c) {
      var done = state.challengeLog[c.id];
      var title = esc(c.consigna || c.instruction);
      if (c.play && c.play.length) {
        html += '<button class="mission' + (done && done.q === 2 ? " done" : "") + '" data-sfida="' + c.id + '">' +
          '<span class="mi">' + (done && done.q === 2 ? "★" : "📖") + "</span>" +
          "<span><b>" + title + "</b><small>" + c.play.length + " preguntas" + (c.chapter ? " · cap. " + esc(c.chapter) : "") +
          (done && done.pct != null ? " · mejor: " + done.pct + "%" : "") + "</small></span>" +
          '<span class="go">›</span></button>';
      } else {
        html += '<div class="card chal"><div class="inst">' + title + "</div><ol>" +
          c.items.map(function (i) { return "<li>" + esc(i.text) + "</li>"; }).join("") + "</ol>" +
          '<p class="muted">Ejercicio libre: resolvelo por escrito y puntuate.</p>' +
          '<div class="selfscore">' +
            '<button class="btn ghost" data-self="' + c.id + '" data-q="2">Lo tuve bien</button>' +
            '<button class="btn ghost" data-self="' + c.id + '" data-q="1">A medias</button>' +
            '<button class="btn ghost" data-self="' + c.id + '" data-q="0">No me salió</button>' +
            (done ? '<span class="muted" style="align-self:center">✓ ' + ["no salió", "a medias", "bien"][done.q] + "</span>" : "") +
          "</div></div>";
      }
    });
    return html + "</div>";
  }


  /* ------------------------------------------------------------------- eu */

  /* «Todo el material» (3.4): Allena and Leggi left the bar (their things
     live in each week of the percorso), but the whole library stays one
     tap away: the Library, all the practice, and «Consultar». */
  function allMaterialCard() {
    var all = UI.allTabs || [["frasi", "🚣", UI.train], ["leggi", "📖", UI.read]];
    var desc = { frasi: "la práctica de todas las semanas: los duelos y la escritura guiada",
                 leggi: "la Biblioteca: los textos para leer enteros" };
    return '<div class="card allmat"><h2>📦 Todo el material</h2>' +
      '<p class="muted small">Lo de cada semana está en la página de esa semana. Acá, todo junto:</p>' +
      '<div class="labs">' + all.map(function (t) {
        return '<button class="lab" data-goto="' + t[0] + '"><span class="e">' + t[1] + "</span><b>" + esc(t[2]) + '</b><span class="muted">' + desc[t[0]] + "</span></button>";
      }).join("") +
      (window.Capas ? '<button class="lab" data-goto="consultar"><span class="e">🔎</span><b>Consultar</b><span class="muted">el diccionario del curso y todas las ideas de las lecciones</span></button>' : "") +
      "</div></div>";
  }

  function renderIo() {
    var lv = Engine.levelFor(state.xp);
    var nextRank = null;
    Engine.RANKS.forEach(function (r) { if (!nextRank && r[0] > lv.level) nextRank = r; });
    var R = window.Progreso ? Progreso.ritmo(state) : { min: 20, days: 5 };
    var won = Engine.BADGES.filter(function (b) { return state.badges.indexOf(b.id) >= 0; }).length;

    return "<h1>" + UI.me + "</h1>" +
      '<div class="card rank"><div class="rk">' + esc(Engine.rankFor(lv.level)) + "</div>" +
        '<div class="muted">nivel ' + lv.level + " · " + state.xp + " xp totales" +
        (nextRank ? " · próximo rango: <b>" + esc(nextRank[1]) + "</b> en el nivel " +
          nextRank[0] : "") + "</div></div>" +
      (window.Progreso ? Progreso.summaryCard() : "") +
      allMaterialCard() +
      (window.Seminario ? '<button class="lab" id="iopos"><span class="e">🤔</span><b>Tus posiciones</b><span class="muted">Lo que elegiste en cada dilema, para mirar si sos consistente.</span></button>' : "") +
      switchCard() +

      '<div class="card"><h2>Ajustes</h2>' +
        '<label class="set"><span>Minutos por día<small>tu meta principal; la xp sigue siendo la moneda del juego</small></span><select id="ritmo-min">' +
          [10, 15, 20, 30, 45].map(function (m) {
            return '<option value="' + m + '"' + (R.min === m ? " selected" : "") + ">" + m + " min</option>";
          }).join("") + "</select></label>" +
        '<label class="set"><span>Días por semana<small>los otros, descanso sin culpa</small></span><select id="ritmo-days">' +
          [3, 4, 5, 6, 7].map(function (d) {
            return '<option value="' + d + '"' + (R.days === d ? " selected" : "") + ">" + d + " días</option>";
          }).join("") + "</select></label>" +
        '<div class="set metafecha"><span>Meta con fecha<small>«llegar a la semana N para el día D»: te digo el ritmo que pide</small></span>' +
          '<span class="row"><label class="mini">semana <input type="number" id="meta-week" min="2" max="' + NW() + '" inputmode="numeric" value="' + (R.week || "") + '" placeholder="' + Math.min(52, (state.unlocked || 1) + 12) + '"></label>' +
          '<input type="date" id="meta-date" aria-label="Fecha de la meta" value="' + esc(R.date ? isoDate(R.date) : "") + '">' +
          '<button class="tab" id="meta-save">Guardar</button>' + (R.week ? '<button class="tab" id="meta-clear">Borrar</button>' : "") + "</span></div>" +
        (R.week && window.Progreso ? '<p class="muted small">' + Progreso.targetText(Progreso.target(state)) + "</p>" : "") +
        '<label class="set"><span>Tema<small>el ☀️/🌙 de arriba también lo cambia</small></span><select id="theme-set">' +
          [["", "Como el teléfono"], ["light", "Claro ☀️"], ["dark", "Oscuro 🌙"]].map(function (t) {
            return '<option value="' + t[0] + '"' + ((state.theme || "") === t[0] ? " selected" : "") + ">" + t[1] + "</option>";
          }).join("") + "</select></label>" +
        (window.Teclado && Teclado.touch() ? '<label class="set"><span>Teclado para responder<small>el de la app tiene las letras de ' + esc(UI.langEs || "la lengua") +
          ' y no autocorrige en castellano; el del teléfono no se puede poner en otro idioma desde una web</small></span><select id="kbmode">' +
          [["app", "El de la app"], ["phone", "El del teléfono"]].map(function (t) {
            return '<option value="' + t[0] + '"' + (Teclado.mode() === t[0] ? " selected" : "") + ">" + t[1] + "</option>";
          }).join("") + "</select></label>" : "") +
        '<label class="set"><span>Teclado sin sugerencias<small>el teclado no te propone palabras ni te corrige solo</small></span>' +
          '<input type="checkbox" id="kbquiet"' + (state.kbQuiet ? " checked" : "") + "></label>" +
        '<label class="set"><span>Modo oficina 🤫<small>nada suena solo; el 🔊 sigue andando si lo tocás</small></span>' +
          '<input type="checkbox" id="silent"' + (state.silent ? " checked" : "") + "></label>" +
        '<label class="set"><span>Agendar mi rato diario<small>' + (state.icsAt ? 'ya lo agregaste · de nuevo si cambiás la hora' : 'un evento en tu calendario, con alarma, que abre tu semana') + '</small></span>' +
          '<span class="row"><input type="time" id="remtime" value="' +
            esc(state.remind || "13:30") + '"><button class="btn ghost" id="remind">📅 Agregar</button></span></label>' +
      "</div>" +

      planCard() +
      memoriaCard() +
      '<div class="card"><h2>Tu copia</h2>' +
        '<p class="muted">Todo tu progreso vive <b>solo en este teléfono</b>, sin cuentas ni servidores. ' +
        "Si borrás los datos del navegador se pierde: guardá una copia de vez en cuando." +
        (state.exportedAt ? " La última: " + new Date(state.exportedAt).toLocaleDateString("es-AR") + "." : "") + "</p>" +
        '<div class="row"><button class="btn" id="export">💾 Guardar copia</button>' +
        '<button class="btn ghost" id="import">📂 Restaurar copia</button>' +
        '<input type="file" id="importfile" aria-label="Archivo de la copia" accept="application/json,.json" hidden></div>' +
        '<p class="muted" id="persistmsg" style="margin-top:10px"></p>' +
        nubeHtml() +
      "</div>" +

      (window.Capas && Capas.entryHtml ? Capas.entryHtml() : window.Referencia ? Referencia.entry() : "") +
      errorsCard() +
      aiCard() +
      (window.Ubicacion ? Ubicacion.card(state) : "") +

      // Folded: the medals, the numbers and the credits.
      '<details class="card fold"><summary><h2>🏅 Medallas <small class="muted">' + won + " / " + Engine.BADGES.length + "</small></h2></summary>" +
        '<div class="badges">' +
        Engine.BADGES.map(function (b) {
          var got = state.badges.indexOf(b.id) >= 0;
          return '<div class="badge' + (got ? " won" : "") + '">' +
            '<div class="ico">' + (got ? "🏅" : "🔒") + "</div>" +
            "<b>" + esc(b.name) + "</b><span>" + esc(b.desc) + "</span></div>";
        }).join("") +
      "</div></details>" +

      '<details class="card fold"><summary><h2>Estadísticas y créditos</h2></summary><table class="res">' +
        "<tr><td>Mejor combo</td><td>" + ((state.best || {}).combo || 0) + "</td></tr>" +
        "<tr><td>Respuestas totales</td><td>" + state.totals.attempts + "</td></tr>" +
        "<tr><td>Correctas</td><td>" + state.totals.right + "</td></tr>" +
        "<tr><td>Fichas en repaso</td><td>" + Object.keys(state.cards).length + "</td></tr>" +
        "<tr><td>Semana desbloqueada</td><td>" + state.unlocked + "/" + NW() + "</td></tr>" +
      "</table>" +
      '<div class="row" style="margin-top:14px">' +
        '<button class="btn ghost" id="reset">Borrar mi progreso</button>' +
      "</div></details>" + versionLine();
  }
  // "aaaa-m-d" → "aaaa-mm-dd" (the value of a date input), and back.
  function isoDate(k) {
    var p = String(k).split("-");
    return p.length === 3 ? p[0] + "-" + ("0" + p[1]).slice(-2) + "-" + ("0" + p[2]).slice(-2) : "";
  }
  // The cards of the progress screen that live here (progreso.js shows them).
  function progresoCards() {
    return window.Biblioteca ? Biblioteca.ioCard() : "";
  }

  /* Meta y récords: el «yo ideal» con las palabras del alumno, los récords
     personales y la tarjeta para compartir. */
  function planCard() {
    var id = state.ideal || {}, rec = state.records || {};
    var why = WHY.filter(function (w) { return w[0] === id.why; })[0];
    return '<div class="card" id="plancard"><h2>🎯 Tu meta</h2>' +
      '<span class="chips">' + WHY.map(function (w) { return '<button class="tab' + (id.why === w[0] ? " on" : "") + '" data-why3="' + w[0] + '">' + w[1] + "</button>"; }).join("") + "</span>" +
      '<label class="set"><span>Con tus palabras<small>' + UI.metaEx + "</small></span></label>" +
      '<div class="typed"><input id="idealtext" aria-label="Para qué querés aprender, con tus palabras" maxlength="120" value="' + esc(id.text || "") + '" placeholder="En seis meses…"><button class="tab" id="idealsave">Guardar</button></div>' +
      (why || id.text ? '<p class="muted small">Tu meta: ' + (why ? esc(why[1]) : "") + (id.text ? " · «" + esc(id.text) + "»" : "") + "</p>" : "") +
      '<h3>🏅 Récords personales</h3><table class="res">' +
        "<tr><td>Mejor sesión</td><td>" + (rec.sessione || 0) + " %</td></tr>" +
        "<tr><td>Semanas seguidas con tres días</td><td>" + (rec.settimane || Engine.weekStreak(state)) + "</td></tr>" +
        "<tr><td>Conceptos nuevos en una semana</td><td>" + (rec.parole || 0) + "</td></tr>" +
        "<tr><td>Errores corregidos por vos en una ronda</td><td>" + (rec.corrette || 0) + "</td></tr>" +
      "</table>" +
      '<div class="row" style="margin-top:10px"><button class="btn ghost" id="share">📤 Compartir mi semana</button></div>' +
      "</div>";
  }

  /* La memoria: cuántas fichas aprendiendo, en repaso y en mantenimiento,
     la probabilidad media de recordarlas hoy, la velocidad de olvido
     estimada con tus propios repasos, y los ajustes (retención,
     noche/mañana). */
  function memoriaCard() {
    var m = Engine.memoryStats(state), sp = state.speed || {};
    var speedLine = function (k, name) {
      var x = sp[k];
      if (!x || !x.n || x.n < 100) return name + ": todavía pocos repasos (" + ((x && x.n) || 0) + " de 100) para medir tu curva.";
      return name + ": " + (x.k === 1 ? "como el promedio" : x.k > 1 ? "olvidás " + Math.round((x.k - 1) * 100) + " % más lento que el promedio"
        : "olvidás " + Math.round((1 - x.k) * 100) + " % más rápido que el promedio") + " (" + x.n + " repasos).";
    };
    return '<div class="card"><h2>🧠 Tu memoria</h2>' +
      '<table class="res">' +
        "<tr><td>Fichas aprendiendo</td><td>" + m.learn + "</td></tr>" +
        "<tr><td>En repaso</td><td>" + m.rev + "</td></tr>" +
        "<tr><td>En mantenimiento (meses)</td><td>" + m.maint + "</td></tr>" +
        "<tr><td>Probabilidad media de recordarlas hoy</td><td>" + m.recall + " %</td></tr>" +
      "</table>" +
      '<p class="muted small">' + speedLine("v", "Conceptos") + " " + speedLine("g", "Ideas") + "</p>" +
      '<label class="set"><span>Cuántos repasos por día<small>más repasos = recordás más; el porcentaje es lo que vas a recordar de cada ficha</small></span><select id="retention">' +
        [[0.85, "Menos · recordás 85 %"], [0.9, "Normal · recordás 90 %"], [0.95, "Más · recordás 95 %"]].map(function (r) {
          return '<option value="' + r[0] + '"' + ((state.retention || 0.9) === r[0] ? " selected" : "") + ">" + r[1] + "</option>";
        }).join("") + "</select></label>" +
      '<label class="set"><span>Noche y mañana 🌙☀️<small>lo nuevo después de las 20 h vuelve al desayuno, con el sueño en el medio</small></span>' +
        '<input type="checkbox" id="notte"' + (state.notte !== false ? " checked" : "") + "></label>" +
      "</div>";
  }

  /* El cuaderno de los malentendidos: las confusiones que se repiten, con
     el estado de cada una.  La lista es del paquete (LANG.interlang.list);
     las claves son las categorías de los errores (state.errs). */
  var IL = LG.interlang || { title: "📓 Cuaderno", blurb: "", list: [] };
  /* The AI: the key, and the answers the learner claimed as valid (so they
     can be passed on in one go instead of explaining each). */
  function aiCard() {
    var notes = state.aiNotes || [];
    return '<div class="card" id="aicard"><h2>🤖 La IA</h2>' +
      '<p class="muted small">Con una clave de Anthropic (Claude Haiku), el tutor del seminario conversa con vos sobre el texto de la semana: pregunta, no da respuestas.</p>' +
      aiKeyFields() +
      (notes.length ? "<h3>Correcciones para revisar (" + notes.length + ")</h3>" +
        '<p class="muted small">Las respuestas que marcaste como válidas («🙋»). Copialas y pegámelas todas juntas.</p>' +
        '<ul class="ainotes">' + notes.slice(0, 8).map(function (n) {
          var who = n.kind === "alumno" ? "🙋 " : n.kind === "variante" ? "✓ " : "🤖 ";
          return "<li>" + who + "<b>" + esc(n.given || "—") + "</b> ≠ " + esc(n.answer || "") + ' <small class="muted">' + esc((n.stem || "").slice(0, 60)) + "</small></li>";
        }).join("") + "</ul>" +
        '<div class="row"><button class="tab" id="aicopy">📋 Copiar todas</button><button class="tab" id="aiclear">Borrar</button></div>' : "") +
      "</div>";
  }

  function itanolCard() {
    var errs = state.errs || {}, now = Date.now();
    var list = (typeof IL.list === "function" ? IL.list() : IL.list) || [];
    return '<div class="card"><h2>' + IL.title + "</h2>" +
      '<p class="muted">' + IL.blurb + "</p>" +
      '<ul class="itanol">' + list.map(function (x) {
        var e = errs[x[0]], quiet = !e || now - (e.last || 0) > 14 * 86400000;
        return "<li><span>" + (quiet ? "🟢" : "🔴") + "</span><span>" + esc(x[1]) +
          (e ? ' <small class="muted">· ' + e.n + (e.fixed ? " · " + e.fixed + " corregidos" : "") + "</small>" : "") + "</span></li>";
      }).join("") + "</ul></div>";
  }

  /* The last errors: what you wrote, what went there, and why (the
     explanation of the moment, kept with the error; the old ones, saved
     before it was kept, show the name of the error).  Coming back to the
     why of your own errors is what the error log is for (Metcalfe 2017). */
  function errLogHtml(list) {
    var SRC = { ia: "🤖 IA", lt: "LanguageTool" };
    return '<ul class="errlog">' + list.map(function (l) {
      var label = l.l || Errores.label(l.cat);
      var x = DV && l.x ? DV.plain(l.x) : l.x;
      var why = (x ? "<p>" + mk(x) + "</p>" : "") + (l.c && (!x || x.indexOf(l.c) < 0) ? "<p>" + mk(DV ? DV.plain(l.c) : l.c) + "</p>" : "") +
        (l.f && SRC[l.f] ? '<p class="muted small">Lo marcó ' + SRC[l.f] + (l.k ? "" : "; no cuenta para la Clínica") + ".</p>" : "");
      return '<li class="diag">' +
        '<div class="diff"><span class="k">vos</span> ' + (l.e ? markWords(l.g, l.e, "bad") : '<b class="bad">' + esc(l.g || "—") + "</b>") +
          (l.e ? '<br><span class="k">bien</span> ' + markWords(l.e, l.g, "fix") : l.d ? '<br><span class="k">bien</span> <i>(se borra)</i>' : "") + "</div>" +
        (why ? '<details><summary><span class="tag">' + esc(label || "Por qué") + '</span> <span class="muted small">¿por qué?</span></summary>' + why + "</details>"
           : label ? '<span class="tag">' + esc(label) + "</span>" : "") +
        "</li>";
    }).join("") + "</ul>";
  }

  function errorsCard() {
    var errs = state.errs || {};
    var cats = Object.keys(errs).filter(function (c) { return errs[c].n > 0; }).sort(function (a, b) { return errs[b].n - errs[a].n; });
    if (!cats.length) return itanolCard();
    var max = errs[cats[0]].n;
    return '<div class="card"><h2>Tus errores</h2>' +
      '<p class="muted">Se registran solos cuando te equivocás. Los que corregís vos mismo cuentan como avance.</p>' +
      '<div class="errbars">' + cats.slice(0, 8).map(function (c) {
        var e = errs[c];
        return '<div class="eb"><span>' + esc(Errores.label(c)) + "</span>" +
          '<i style="width:' + Math.round(e.n / max * 100) + '%"></i>' +
          "<b>" + e.n + (e.fixed ? ' <small>· ' + e.fixed + (e.fixed === 1 ? " corregido" : " corregidos") + "</small>" : "") + "</b></div>";
      }).join("") + "</div>" +
      ((state.errLog || []).length ? "<h3>Últimos</h3>" + errLogHtml(state.errLog.slice(0, 6)) : "") +
      "</div>" + itanolCard();
  }

  function stamp() {
    var d = new Date();
    function p(n) { return (n < 10 ? "0" : "") + n; }
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
  }

  /* The copy goes in an envelope that says which app, which language and
     which version made it: a copy of Italian is not restored over
     Portuguese by mistake. */
  function exportSave() {
    state.exportedAt = Date.now();
    persist();
    var name = UI.exportFile + stamp() + ".json";
    state.exportedAt = Date.now();
    persist();
    var env = saveEnvelope();
    var blob = new Blob([JSON.stringify(env)], { type: "application/json" });
    // On phones, the share sheet lets you drop the file in Drive, mail or chat.
    try {
      var file = new File([blob], name, { type: "application/json" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: "Copia de " + LG.brand })
          .catch(function () { download(blob, name); });
        return;
      }
    } catch (e) { /* sin share */ }
    download(blob, name);
  }

  function download(blob, name) {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  // The envelope of the copy, the same for the file and the gist (nube.js).
  function saveEnvelope() {
    return Nube.envelope(state, { lang: LG.code, brand: LG.brand, v: APP_VERSION });
  }
  function otherLangCopy(j) {
    var other = (window.Boot && Boot.LANGS && Boot.LANGS[j.lang]) || {};
    return "Esta copia es de " + (j.brand || other.brand || j.lang) + ". Cambiá de edición en " + UI.me + " y restaurala ahí.";
  }
  /* A copy restored, from a file or from the cloud, the same way the
     phone's own save is loaded (Engine.fromRaw: migrations, sanitize, the
     cards to FSRS); a copy of the other language is not restored.  ask:
     the question before replacing.  True when it was restored; throws on
     something that is not a copy. */
  function restoreEnvelope(j, ask) {
    var s = j && j.app === "agora" && j.save ? j.save : j;
    if (!s || typeof s.xp !== "number" || !s.cards) throw new Error("formato");
    if (j.app === "agora" && j.lang && j.lang !== LG.code) { toast(otherLangCopy(j), 4000); return false; }
    if (!confirm(ask || "Esto reemplaza tu progreso actual por la copia (" + s.xp +
                 " xp" + (j.at ? ", del " + new Date(j.at).toLocaleDateString("es-AR") : "") + "). ¿Seguir?")) return false;
    state = Engine.fromRaw(s);
    clearPending();
    persist();
    renderHeader();
    render();
    toast("✓ Copia restaurada.");
    return true;
  }
  function importSave(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        restoreEnvelope(JSON.parse(reader.result));
      } catch (e) {
        toast("Ese archivo no es una copia válida.");
      }
    };
    reader.readAsText(file);
  }

  /* ------------------------------------------ la copia en tu GitHub Gist */
  /* The optional channel to another phone (nube.js): the same envelope in
     a secret gist of the learner's, with their own token.  The token and
     what this phone knows of the gist live in its storage, never in the
     copy. */
  var nubeBusy = false;
  function nubeWhen(t) {
    var d = new Date(t);
    return isNaN(d) ? "" : d.toLocaleDateString("es-AR") + " " + d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false });
  }
  function nubeSync(fn) {
    var S = Nube.store(), sy = S.sync(LG.storage);
    if (fn) { fn(sy); S.setSync(LG.storage, sy); }
    return sy;
  }
  function nubeOpts(extra) {
    return Object.assign({ token: Nube.store().token(), storage: LG.storage, lang: LG.code, id: nubeSync().id }, extra || {});
  }
  function nubeHtml() {
    if (!window.Nube) return "";
    var sy = nubeSync(), tok = Nube.store().token(), st = [];
    if (sy.up) st.push("Última subida: " + nubeWhen(sy.up) + ".");
    if (sy.down) st.push("La trajiste por última vez: " + nubeWhen(sy.down) + ".");
    if (sy.conflict) st.push("⚠️ En la nube hay una copia subida desde otro teléfono el " + nubeWhen(sy.conflict) + ": traela, o subí la de este teléfono si es la buena.");
    return '<details class="nube"' + (tok ? " open" : "") + "><summary>☁️ Sincronizar con tu GitHub Gist</summary>" +
      '<p class="muted small">Para seguir en otro teléfono sin servidor de la app: tu copia va a un gist secreto de tu cuenta de GitHub. ' +
        'Creá el token en <a href="' + Nube.TOKEN_URL + '" target="_blank" rel="noopener">github.com/settings/tokens</a> (viene marcado solo «gist»: elegí el vencimiento y tocá «Generate token») y pegalo acá.</p>' +
      '<input id="gisttoken" type="password" autocomplete="off" aria-label="Token de GitHub" placeholder="Token de GitHub (ghp_…)" value="' + esc(tok) + '">' +
      '<div class="row"><button class="btn" id="gistup">☁️ Subir ahora</button><button class="btn ghost" id="gistdown">⬇️ Traer de la nube</button></div>' +
      '<label class="set"><span>Subir sola al cerrar la app<small>una vez por día como mucho, si cambió algo</small></span>' +
        '<input type="checkbox" id="gistauto"' + (sy.auto ? " checked" : "") + "></label>" +
      (st.length ? '<p class="muted small" id="giststate">' + esc(st.join(" ")) + "</p>" : "") +
      '<p class="muted small">El token queda solo en este teléfono, con las claves de IA (sirve para todas las ediciones), y nunca entra en la copia.</p>' +
      (tok ? '<div class="row"><button class="tab" id="gistforget">Olvidar el token</button></div>' : "") +
      "</details>";
  }
  function nubeRefresh() { if (view.screen === "io") render(); }
  /* Up: first a look at the gist's date (a light call); if another phone
     uploaded since this one last synced, ask (auto: do not upload, and say
     so in Io). */
  function nubeUp(auto) {
    if (!window.Nube) return Promise.resolve(false);
    var sy = nubeSync(), o = nubeOpts();
    if (!o.token) { if (!auto) toast(Nube.message({ code: "notoken" })); return Promise.resolve(false); }
    if (nubeBusy) return Promise.resolve(false);
    nubeBusy = true;
    if (!auto) toast("☁️ Subiendo…", 1500);
    flushPersist();
    var mark = state.savedAt || Date.now();
    return Nube.remote(o).then(function (r) {
      if (r && Nube.conflict(r, sy)) {
        if (auto) { nubeSync(function (x) { x.conflict = r.updated; }); return false; }
        var q = (sy.gistAt ? "Otro teléfono subió una copia de " + LG.brand + " el " + nubeWhen(r.updated) + ", después de la última vez que este sincronizó."
                           : "Ya hay una copia de " + LG.brand + " en tu gist, del " + nubeWhen(r.updated) + ", que este teléfono no trajo.") +
          " ¿Reemplazarla por el progreso de este teléfono (" + state.xp + " xp)?";
        if (!confirm(q)) return false;
      }
      return Nube.push(o, saveEnvelope(), r).then(function (g) {
        nubeSync(function (x) {
          x.id = g.id; x.gistAt = g.updated; x.up = Date.now(); x.mark = mark; x.conflict = null;
          if (auto) x.day = Nube.dayKey();
        });
        if (!auto) toast(g.created ? "☁️ Listo: creé tu gist secreto y subí la copia." : "☁️ Copia subida.", 2500);
        return true;
      });
    }).catch(function (e) {
      if (!auto) toast(Nube.message(e), 4500);
      return false;
    }).then(function (done) {
      nubeBusy = false;
      if (!auto) nubeRefresh();
      return done;
    });
  }
  /* Down: the copy of this language from the gist, through restoreEnvelope,
     always asking, and saying which one is newer. */
  function nubeDown() {
    if (!window.Nube) return Promise.resolve(false);
    var o = nubeOpts();
    if (!o.token) { toast(Nube.message({ code: "notoken" })); return Promise.resolve(false); }
    if (nubeBusy) return Promise.resolve(false);
    nubeBusy = true;
    toast("☁️ Buscando tu copia…", 1500);
    flushPersist();
    return Nube.pull(o).then(function (r) {
      var env = r.env, cmp = Nube.compare(env, state);
      var cloud = nubeWhen(Nube.stamp(env)) + ", " + env.save.xp + " xp", here = (state.savedAt ? nubeWhen(state.savedAt) + ", " : "") + state.xp + " xp";
      var ask = cmp === "newer"
        ? "La copia de la nube (" + cloud + ") es más nueva que la de este teléfono (" + here + "). ¿Reemplazar el progreso de acá por la de la nube?"
        : "⚠️ La copia de la nube (" + cloud + ") " + (cmp === "same" ? "es de la misma fecha que" : "es más vieja que") +
          " la de este teléfono (" + here + "). ¿Reemplazar igual?";
      nubeSync(function (x) { x.id = r.id; });
      if (!restoreEnvelope(env, ask)) return false;
      nubeSync(function (x) { x.gistAt = r.updated; x.down = Date.now(); x.mark = state.savedAt; x.conflict = null; });
      return true;
    }).catch(function (e) {
      toast(e && e.code === "idioma" && e.env ? otherLangCopy(e.env) : e && e.code ? Nube.message(e) : "Lo que hay en la nube no es una copia válida.", 4500);
      return false;
    }).then(function (done) {
      nubeBusy = false;
      nubeRefresh();
      return done;
    });
  }
  // When the app is hidden or closed: the automatic upload, once a day.
  function nubeAuto() {
    if (!window.Nube || nubeBusy) return;
    if (Nube.autoDue(nubeSync(), Nube.store().token(), state.savedAt)) nubeUp(true);
  }
  function wireNube() {
    var box = $("#gisttoken");
    if (!window.Nube || !box) return;
    var S = Nube.store();
    function take() { var t = (box.value || "").trim(); if (t !== S.token()) S.setToken(t); return t; }
    box.onchange = take;
    on("#gistup", function () { take(); nubeUp(false); });
    on("#gistdown", function () { take(); nubeDown(); });
    var auto = $("#gistauto");
    if (auto) auto.onchange = function () {
      nubeSync(function (x) { x.auto = auto.checked; });
      toast(auto.checked ? "☁️ Al cerrar la app se sube sola, una vez por día." : "Subida automática apagada.", 2500);
    };
    on("#gistforget", function () { S.setToken(""); toast("Token borrado de este teléfono."); render(); });
  }

  /* Un evento que se repite (.ics): el teléfono lo agrega al calendario y
     avisa todos los días, sin servidor ni notificaciones push. */
  function reminderIcs(hhmm) {
    var p = hhmm.split(":");
    var d = new Date();
    d.setHours(+p[0], +p[1], 0, 0);
    function two(n) { return (n < 10 ? "0" : "") + n; }
    var local = d.getFullYear() + two(d.getMonth() + 1) + two(d.getDate()) + "T" +
      two(d.getHours()) + two(d.getMinutes()) + "00";
    var end = new Date(d.getTime() + 5 * 60000);
    var localEnd = end.getFullYear() + two(end.getMonth() + 1) + two(end.getDate()) + "T" +
      two(end.getHours()) + two(end.getMinutes()) + "00";
    // The event opens the plan of the day (#hoy).
    var url = location.href.split("#")[0].replace(/[?&]test\b/, "") + "#hoy";
    var r = window.Progreso ? Progreso.ritmo(state) : null;
    return [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//" + LG.brand + "//" + UI.icsId,
      "BEGIN:VEVENT",
      "UID:" + LG.storage + "-daily@" + location.host,
      "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z",
      "DTSTART:" + local,
      "DTEND:" + localEnd,
      "RRULE:FREQ=" + (!r || r.days >= 7 ? "DAILY" : "WEEKLY;BYDAY=" + { 3: "MO,WE,FR", 4: "MO,TU,TH,FR", 5: "MO,TU,WE,TH,FR", 6: "MO,TU,WE,TH,FR,SA" }[r.days]),
      "SUMMARY:" + UI.icsSummary,
      "DESCRIPTION:La próxima misión de tu semana" + (r ? " (" + r.min + " minutos)" : "") + ". Abrí " + LG.brand + ": " + url,
      "URL:" + url,
      "BEGIN:VALARM", "TRIGGER:PT0M", "ACTION:DISPLAY",
      "DESCRIPTION:" + UI.icsAlarm, "END:VALARM",
      "END:VEVENT", "END:VCALENDAR"
    ].join("\r\n");
  }

  /* Agendar mi rato diario (plan 1.2): the .ics, the time kept and the day
     it was added (state.icsAt: the offers stop once the learner did it). */
  function scheduleReminder(t) {
    state.remind = t;
    state.icsAt = Date.now();
    persist();
    download(new Blob([reminderIcs(t)], { type: "text/calendar" }), UI.icsFile);
    toast("Abrí el archivo para agregarlo a tu calendario.", 3000);
  }

  /* ---------------------------------------------------------------- router */

  var TABS = UI.tabs;

  function renderNav() {
    var nav = $("#nav");
    if (!nav) return;
    var inGame = ["gioco", "lezione", "inicio"].indexOf(view.screen) >= 0;
    nav.hidden = inGame;
    nav.innerHTML = TABS.map(function (t) {
      return '<button class="' + (view.tab === t[0] ? "on" : "") + '" data-tab="' + t[0] + '"' + (view.tab === t[0] ? ' aria-current="page"' : "") + ">" +
        '<span>' + t[1] + "</span>" + t[2] + "</button>";
    }).join("");
    nav.querySelectorAll("[data-tab]").forEach(function (b) {
      b.onclick = function () { go(b.dataset.tab); };
    });
  }

  /* La época (course.eras): la estética avanza con la historia.  Sigue a
     la semana en que vas; en las pantallas de una semana (la lección, la
     teoría), a esa semana.  ?era=N la fija, para mirarlas. */
  var ERA_FIXED = (/[?&]era=(\d)/.exec(location.search) || [])[1] || "";
  function eraOf(week) {
    var eras = (course && course.eras) || [];
    for (var i = 0; i < eras.length; i++) if (week >= eras[i].weeks[0] && week <= eras[i].weeks[1]) return eras[i].n;
    return 1;
  }
  function applyEra(s) {
    var weekly = /^(briefing|teoria|sfide|lezione)$/.test(s) && view.week;
    var era = String(ERA_FIXED || eraOf(weekly ? view.week : Math.min(state.unlocked || 1, NW())));
    if (document.documentElement.getAttribute("data-era") === era) return;
    document.documentElement.setAttribute("data-era", era);
    try { localStorage.setItem((window.Boot && Boot.ERA) || "agora.era", era); } catch (e) { /* sin almacenamiento */ }
  }

  function render() {
    var html = "";
    var s = view.screen;
    applyEra(s);
    if (s === "oggi") html = renderOggi();
    else if (s === "frasi") html = renderFrasi();
    else if (s === "percorso") html = renderPercorso();
    else if (s === "io") html = renderIo();
    else if (s === "briefing") html = renderBriefing(course.weeks[view.week - 1]);
    else if (s === "teoria") html = renderTeoria(course.weeks[view.week - 1]);
    else if (s === "sfide") html = renderSfide(course.weeks[view.week - 1]);
    else if (s === "gioco") html = renderGioco();
    else if (s === "risultato") html = renderRisultato();
    else if (s === "leggi") html = renderLeggi();
    else if (s === "lezione") html = renderLezione();
    else if (s === "gramatica") html = Referencia.page();
    else if (s === "ubicacion" && window.Ubicacion) html = Ubicacion.html();
    else if (s === "escritos" && window.Escritos) html = Escritos.render();
    else if (window.Biblioteca && Biblioteca.owns(s)) html = Biblioteca.render(s, view);
    else if (window.Inicio && Inicio.owns(s)) html = Inicio.render(s);          // el primer arranque (inicio.js)
    else if (window.Progreso && Progreso.owns(s)) html = Progreso.render(s);    // tu progreso (progreso.js)
    else if (window.Capas && Capas.owns(s)) html = Capas.render(s);   // «Consultar» (js/capas.js)
    else if (window.Seminario && Seminario.owns(s)) html = Seminario.render(s);   // el seminario y los dilemas (seminario.js)

    guardUntil = Date.now() + 300;
    guardAt = lastTap;
    // Inside a game or a text, the phone's back button returns to the tab
    // instead of closing the app.
    if (TABS.every(function (t) { return t[0] !== s; }) && !subEntry && window.history && history.pushState) {
      try { history.pushState({ sub: 1 }, ""); subEntry = true; } catch (e) { /* */ }
    }
    app().innerHTML = html;
    langBoxes(app());   // before anything takes the focus: the keyboard reads the box's lang when it opens
    document.body.classList.toggle("ingame", s === "gioco" || s === "lezione");
    var pl = document.querySelector(".progressline i[data-to]");
    if (pl) requestAnimationFrame(function () { requestAnimationFrame(function () { pl.style.width = pl.dataset.to + "%"; }); });
    renderNav();
    wire();
    if (s === "ubicacion" && window.Ubicacion) Ubicacion.wire(app());
    growBoxes();
  }

  /* El test de ubicación (ubicacion.js): al empezar un idioma y desde Io / Eu. */
  function startUbicacion(then) {
    if (!window.Ubicacion) return;
    var from = view.tab || "oggi";
    Ubicacion.start({ course: course, state: state, render: render, done: function (applied) {
      persist();
      renderHeader();
      if (typeof then === "function") { view.week = Math.min(state.unlocked, NW()); then(applied); return; }
      if (applied) { view.week = Math.min(state.unlocked, NW()); toast("🔓 Semanas 1 a " + (state.unlocked - 1) + " abiertas. Arrancás en la " + state.unlocked + "."); }
      go(applied ? "percorso" : from);
    } });
    view.screen = "ubicacion";
    render();
    window.scrollTo(0, 0);
  }

  var subEntry = false;
  window.addEventListener("popstate", function () {
    subEntry = false;
    if (!course || TABS.some(function (t) { return t[0] === view.screen; })) return;
    if (view.screen === "gioco") toast("Ronda interrumpida. Lo que respondiste ya quedó guardado.");
    go(view.tab || "oggi");
  });

  /* Another tab (or the installed app next to the browser) saved: take its
     progress instead of overwriting it with ours on the next save. */
  window.addEventListener("storage", function (e) {
    if (e.key !== (Engine.STORAGE_KEY || SKEY("save.v1")) || !e.newValue) return;
    state = Engine.load();
    if (!course) return;
    renderHeader();
    if (view.screen !== "gioco") render();
  });

  /* Answer boxes are textareas: long answers wrap and stay visible.  Enter
     sends (as before); Shift+Enter is a new line; the box grows with the text. */
  function growBoxes() {
    document.querySelectorAll("textarea.grow").forEach(function (t) {
      var fit = function () { t.style.height = "auto"; t.style.height = Math.min(t.scrollHeight + 2, 220) + "px"; };
      t.addEventListener("input", fit);
      fit();
    });
  }

  function on(sel, fn) { var b = $(sel); if (b) b.onclick = fn; }

  /* A double tap on «Avanti» / «Próxima» must not answer the next question: taps
     right after a screen change are swallowed. */
  /* Only a tap in the same spot as the one that changed the screen is a
     double tap; a quick tap somewhere else is the learner answering fast. */
  var guardUntil = 0, lastTap = null, guardAt = null;
  document.addEventListener("pointerdown", function (e) { lastTap = { x: e.clientX, y: e.clientY }; }, true);
  document.addEventListener("click", function (e) {
    var near = !guardAt || e.clientX == null ||
      (Math.abs(e.clientX - guardAt.x) < 48 && Math.abs(e.clientY - guardAt.y) < 48);
    if (Date.now() < guardUntil && near && !(window.__test && window.__test.fast) && app().contains(e.target)) {
      e.stopPropagation();
      e.preventDefault();
    }
  }, true);

  function wire() {
    document.querySelectorAll("[data-week]").forEach(function (b) {
      b.onclick = function () {
        view.week = +b.dataset.week;
        view.screen = "briefing";
        view.tab = "percorso";
        render();
        window.scrollTo(0, 0);
      };
    });
    // «Todo el material» in Io: the screens that left the bar (3.4)
    document.querySelectorAll("[data-goto]").forEach(function (b) {
      b.onclick = function () {
        var to = b.dataset.goto;
        if (to === "consultar" && window.Capas && Capas.open) { Capas.open(); return; }
        go(to);
      };
    });

    on("#back", function () { go("percorso"); });
    on("#toggi", function () { go("oggi"); });
    on("#toio", function () { go("io"); });
    on("#ubicgo", function () { startUbicacion(); });
    on("#ubicno", function () { state.ubicacion = { at: Date.now(), no: true }; persist(); render(); });

    // hoje
    on("#pausa", function () { startRound("pausa"); });
    on("#giorno", function () { startRound("giorno"); });
    on("#rev", function () { startRound("review"); });
    on("#sayfdg", function () { var fd = phraseOfTheDay(); speak(fd[LG.code], true); });
    on("#firstles", function () { view.week = 1; startLezione(); });
    on("#install", function () {
      if (!installPrompt) return;
      installPrompt.prompt();
      installPrompt = null;
    });
    on("#chest", function () {
      var prize = Engine.openChest(state);
      if (!prize) return;
      persist();
      renderHeader();
      fx.goal();
      confetti();
      toast(prize.label, 3000);
      render();
    });

    // teoria e briefing
    on("#teo", function () { view.screen = "teoria"; render(); window.scrollTo(0, 0); });
    ["#tback", "#tback2"].forEach(function (sel) {
      on(sel, function () { view.screen = "briefing"; render(); });
    });
    on("#tdone", function () {
      var w = course.weeks[view.week - 1];
      if (!state.read) state.read = {};
      if (!state.read[w.week]) {
        state.read[w.week] = Date.now();
        gain(Engine.XP.lesson);
        var won = Engine.checkBadges(state);
        persist();
        renderHeader();
        toast(won.length ? "🏅 " + won[0].name : "+" + Engine.XP.lesson + " xp");
      }
      view.screen = "briefing";
      render();
    });
    on("#tplay", function () {
      startRound(course.weeks[view.week - 1].boss ? "boss" : "round");
    });
    document.querySelectorAll("[data-say]").forEach(function (b) {
      b.onclick = function () { speak(sayIndex[b.dataset.say] || (/^\d+-\d+$/.test(b.dataset.say) ? "" : b.dataset.say), true); };
    });
    on("#play", function () {
      startRound(course.weeks[view.week - 1].boss ? "boss" : "round");
    });
    on("#vocab", function () { startRound("vocab"); });
    on("#lez", function () { startLezione(); });
    on("#lesnextpart", function () { var b = $("#lesnextpart"); startLezione(+b.dataset.part); });
    on("#play2", function () { startRound("round"); });
    document.querySelectorAll("[data-m]").forEach(function (b) {
      b.onclick = function () { goMission(b.dataset.m, b.dataset.arg); };
    });
    on("#heronext", function () {
      var w = course.weeks[Math.min(state.unlocked, NW()) - 1];
      var nm = nextMission(w);
      if (!nm) return;
      view.week = w.week; view.tab = "percorso";
      goMission(nm.kind, nm.arg);
    });
    on("#topercorso", function () { go("percorso"); });
    on("#backweek", function () { view.tab = "percorso"; view.screen = "briefing"; render(); window.scrollTo(0, 0); });
    on("#lesnext", lesNext);
    on("#lesquit", function () { clearPending(); view.screen = "briefing"; render(); });
    on("#resume", resumePending);
    on("#discard", function () { clearPending(); render(); });
    wireHabit();
    if (window.Escritos) Escritos.wire(view.screen);
    if (window.Biblioteca) Biblioteca.wire(view.screen, view);
    if (window.Inicio) Inicio.wire(view.screen);
    if (window.Progreso) Progreso.wire(view.screen);
    if (window.Capas) Capas.wire(view.screen);
    if (window.Seminario) Seminario.wire(view.screen);
    on("#lesback", function () { view.screen = "briefing"; render(); });
    on("#lesplay", function () {
      var lw = course.weeks[view.week - 1];
      startRound(lw.boss ? "boss" : "round", !lw.boss && les && les.part != null ? "part:" + les.part : undefined);
    });
    document.querySelectorAll("[data-lq]").forEach(function (b) { b.onclick = function () { lesAnswer(b); }; });
    on("#chal", function () { view.screen = "sfide"; render(); window.scrollTo(0, 0); });
    on("#back2", function () { view.screen = "briefing"; render(); });
    document.querySelectorAll("[data-sfida]").forEach(function (b) {
      b.onclick = function () { startRound("sfida", b.dataset.sfida); };
    });
    on("#again", function () { startRound(round.kind, round.arg); });
    on("#quit", function () {
      clearPending();
      if (round.from === "briefing") { view.tab = "percorso"; view.screen = "briefing"; render(); window.scrollTo(0, 0); }
      else if (round.from === "hoy") go("oggi");
      else if (round.kind === "duello") go("frasi");
      else if (round.kind === "pausa" || round.kind === "review" || round.kind === "giorno" || round.kind === "ritorno" || round.kind === "micro" || round.kind === "dos") go("oggi");
      else if (round.kind === "sfida") { view.screen = "sfide"; render(); }
      else { view.screen = "briefing"; render(); }
    });

    // los duelos
    document.querySelectorAll("[data-duel]").forEach(function (b) {
      b.onclick = function () { startRound("duello", b.dataset.duel); };
    });
    wireGioco();
    wireIo();

    document.querySelectorAll("[data-self]").forEach(function (b) {
      b.onclick = function () {
        var id = b.dataset.self, q = +b.dataset.q;
        state.challengeLog[id] = { q: q, at: Date.now() };
        gain(q === 2 ? Engine.XP.challenge : q === 1 ? 3 : 1);
        Engine.checkBadges(state);
        persist();
        renderHeader();
        render();
        toast("Anotado.");
      };
    });
  }

  /* ------------------------------------------------------------------ la IA */

  function secs(ms) { return (Math.round((+ms || 0) / 100) / 10).toFixed(1).replace(".", ","); }
  /* The AI key: Anthropic, for Claude Haiku.  Only in this phone's
     storage, never in the backup. */
  var AI_KEY = SKEY("claude.key"), AI_WS = SKEY("claude.ws");
  function readKey(k) { try { return localStorage.getItem(k) || ""; } catch (e) { return ""; } }
  function aiKeys() { return { claude: readKey(AI_KEY), ws: readKey(AI_WS) }; }
  function aiKeyFields() {
    var k = aiKeys(), st = window.IA ? IA.stats().claude : null;
    var lat = st && st.lat ? ' <span class="muted">· última vez ' + secs(st.lat.first) + " s</span>" : "";
    return '<p class="muted small"><label for="aikey"><b>Claude Haiku</b></label> (Anthropic): <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener">console.anthropic.com/settings/keys</a> → «Create Key».' + lat + "</p>" +
      '<input id="aikey" type="password" autocomplete="off" placeholder="Clave de Anthropic (sk-ant-…)" value="' + esc(k.claude) + '">' +
      '<p class="muted small"><label for="aiws">ID del workspace</label> (solo si Anthropic lo pide: «not scoped to a workspace»). En la consola, Settings → Workspaces → el workspace → empieza con <code>wrkspc_</code>.</p>' +
      '<input id="aiws" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="wrkspc_… (opcional)" value="' + esc(k.ws) + '">' +
      '<div class="row"><button class="tab" id="aisave">Guardar</button></div>' +
      '<p class="muted small">La clave queda solo en este teléfono; el texto se envía a Anthropic. La API se paga por uso: con Haiku, centavos por cientos de correcciones.</p>';
  }
  function saveKeys() {
    var g = (($("#aikey") || {}).value || "").trim();
    var ws = (($("#aiws") || {}).value || "").trim();
    try { if (g) localStorage.setItem(AI_KEY, g); else localStorage.removeItem(AI_KEY); } catch (e) { /* */ }
    try { if (ws) localStorage.setItem(AI_WS, ws); else localStorage.removeItem(AI_WS); } catch (e) { /* */ }
    return g ? "la clave de Claude" : "";
  }
  function wireGioco() {
    if (view.screen !== "gioco" || !round) return;
    var it = currentItem();
    if (round.askPredict && round.predict == null && round.i === 0) {
      document.querySelectorAll("[data-pred]").forEach(function (b) {
        b.onclick = function () { round.predict = +b.dataset.pred; render(); savePending(); };
      });
      on("#nopred", function () { round.predict = 0; render(); savePending(); });
      return;
    }
    // when this item appeared: a right answer after a long time counts as unsure
    var shownKey = round.i + ":" + it.id;
    if (round.shownKey !== shownKey) { round.shownKey = shownKey; round.shownAt = Date.now(); }
    on("#stophere", function () {
      round.items = round.items.slice(0, round.i);
      finishRound();
    });

    document.querySelectorAll("[data-opt]").forEach(function (b) {
      b.onclick = function () { answer(b.textContent); };
    });

    var send = $("#send"), input = $("#ans");
    // A beginner often copies the whole sentence into the blank: say what
    // the blank is instead of grading «Voi insegnanti?» as a vocabulary error.
    function wholeSentence(v) {
      if (!/_{3,}/.test(it.stem || "")) return false;
      var words = function (x) { return String(x).toLowerCase().match(new RegExp("[" + WCH + "]+", "g")) || []; };
      var stemW = words(String(it.stem).replace(/\([^)]*\)/g, " ").replace(/_{3,}/g, " "));
      var ans = String(it.answer).toLowerCase();
      return words(v).filter(function (w) { return stemW.indexOf(w) >= 0 && ans.indexOf(w) < 0; }).length >= 2;
    }
    function send1() {
      if (!round.answered && wholeSentence(input.value)) {
        $("#fb").innerHTML = '<div class="feedback prompt"><div class="verdict">Solo el hueco</div>' +
          "<p>Escribí únicamente lo que va en la raya ___, no la frase entera.</p></div>";
        input.focus();
        return;
      }
      produce(input.value);
    }
    if (send && input) {
      send.onclick = send1;
      input.onkeydown = function (e) {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send1(); }
      };
      input.focus();
      document.querySelectorAll("[data-ins]").forEach(function (b) {
        b.onclick = function () {
          // Insert at the cursor, not at the end.
          var st = input.selectionStart == null ? input.value.length : input.selectionStart;
          var en = input.selectionEnd == null ? st : input.selectionEnd;
          input.value = input.value.slice(0, st) + b.dataset.ins + input.value.slice(en);
          input.focus();
          try { input.setSelectionRange(st + 1, st + 1); } catch (e) { /* */ }
        };
      });
    }

    on("#say", function () { speak(it.stem.replace(/___/g, "…"), true); });

    if (it.type === "card") on("#next", nextItem);
    if (it.type === "word") {
      on("#next", nextItem);
      on("#sayit", function () { speak(it.stem, true); });
      wireKeyword();
      speak(it.stem);
    }

    if (it.type === "tiles") {
      drawTiles();
      on("#tcheck", function () {
        if (!round.picked.length) return;
        var r = gradeTiles(it);
        settle(r.verdict, r.given, "");
      });
      on("#tclear", function () { round.picked = []; drawTiles(); });
    }

    if (it.type === "listen") {
      // a long text (the listening of the boss): sentence by sentence or
      // turn by turn, two voices for a dialogue; played once by itself
      var sayIt = function (force, rate) {
        if (!it.parts) return speak(it.stem, force, rate);
        if (window.speechSynthesis) speechSynthesis.cancel();
        it.parts.forEach(function (p) {
          speak(p[1], force, rate || 0.95, { keep: true, vi: p[0] === "B" ? 1 : 0, pitch: p[0] === "B" ? 1.1 : p[0] === "A" && it.parts.some(function (x) { return x[0] === "B"; }) ? 0.92 : 1 });
        });
      };
      on("#play1", function () { sayIt(true); });
      on("#slow", function () { sayIt(true, 0.6); });
      on("#peek", function () { $("#peektxt").hidden = false; round.hinted = true; });
      if (!it.noauto) setTimeout(function () { sayIt(false); }, 250);
    }
    if (it.type === "flash") {
      on("#reveal", function () {
        $("#flash").innerHTML =
          '<div class="fit big">' + esc(it.answer) + "</div>" +
          '<p class="muted">¿Te salió?</p>' +
          '<div class="selfgrade">' +
            '<button class="btn ghost" data-fq="0">😬 No</button>' +
            '<button class="btn ghost" data-fq="1">🤏 Casi</button>' +
            '<button class="btn" data-fq="2">😎 ¡Sí!</button></div>';
        if (!spanishText(it.answer) && !asksMeaning(it)) speak(it.answer);
        document.querySelectorAll("[data-fq]").forEach(function (b) {
          b.onclick = function () {
            var q = +b.dataset.fq;
            $("#flash").querySelectorAll("button").forEach(function (x) { x.disabled = true; });
            settle(["sbagliato", "quasi", "giusto"][q], "");
          };
        });
      });
    }
  }

  function wireIo() {
    on("#iopos", function () { if (window.Seminario) Seminario.openPositions("io"); });
    if (view.screen !== "io") return;
    on("#aisave", function () {
      var k = saveKeys();
      toast(k ? "Guardado: " + k + "." : "Claves borradas.");
      render();
    });
    on("#aicopy", function () {
      var txt = (state.aiNotes || []).map(function (n) {
        return "[" + n.id + "] " + (n.kind ? "(" + n.kind + ") " : "") + (n.prompt || "") + " | " + (n.stem || "") + " | yo: " + (n.given || "") +
          " | app: " + (n.answer || "") + (n.app ? " | la app dijo: " + n.app : "") + " | IA: " + (n.ai || "");
      }).join("\n");
      // what the AI already explained (the cache), so it can be reviewed and turned into content
      var cached = window.Errores ? Errores.cacheAll().filter(function (c) { return c.kind === "hints" || c.kind === "explain" || c.kind === "judge"; }) : [];
      if (cached.length) txt += "\n\n# Explicaciones de la IA guardadas (" + cached.length + ")\n" + cached.map(function (c) {
        var v = c.v || {};
        return "[" + c.kind + "] " + (c.q || "") + " | " + (v.explicacion || v.pista1 || "") +
          (v.correcta != null ? " | correcta: " + v.correcta + ", mismo sentido: " + v.mismo_sentido : "") +
          (v.tambien_correcta ? " | también correcta" : "");
      }).join("\n");
      var done = function () { toast("Copiadas " + (state.aiNotes || []).length + " correcciones."); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, function () { prompt("Copiá:", txt); });
      else prompt("Copiá:", txt);
    });
    on("#aiclear", function () { state.aiNotes = []; persist(); render(); });
    // The goal in minutes and days (progreso.js); the xp goal follows.
    var rmin = $("#ritmo-min"), rdays = $("#ritmo-days");
    var setR = function () {
      if (!window.Progreso) return;
      Progreso.setRitmo(state, { min: +rmin.value, days: +rdays.value });
      persist();
      renderHeader();
      toast("Meta: " + rmin.value + " min por día, " + rdays.value + " días por semana. " + Progreso.etaLine(state).replace(/<[^>]+>/g, ""), 3500);
      render();
    };
    if (rmin) rmin.onchange = setR;
    if (rdays) rdays.onchange = setR;
    on("#meta-save", function () {
      var wk = Math.round(+$("#meta-week").value), d = $("#meta-date").value;
      if (!(wk >= 2 && wk <= NW()) || !/^\d{4}-\d{2}-\d{2}$/.test(d)) { toast("Elegí una semana (2 a " + NW() + ") y una fecha."); return; }
      var p = d.split("-");
      Progreso.setRitmo(state, { week: wk, date: +p[0] + "-" + (+p[1]) + "-" + (+p[2]) });
      persist();
      render();
    });
    on("#meta-clear", function () { Progreso.setRitmo(state, { week: null, date: null }); persist(); render(); });
    var themeSel = $("#theme-set");
    if (themeSel) themeSel.onchange = function () {
      state.theme = themeSel.value;
      persist();
      applyTheme();
      renderHeader();
    };
    var kbm = $("#kbmode");
    if (kbm) kbm.onchange = function () { Teclado.setMode(kbm.value); toast(kbm.value === "app" ? "Respondés con el teclado de la app." : "Respondés con el teclado del teléfono."); };
    var kbq = $("#kbquiet");
    if (kbq) kbq.onchange = function () { state.kbQuiet = kbq.checked; persist(); langBoxes(); };
    var silent = $("#silent");
    if (silent) silent.onchange = function () {
      state.silent = silent.checked;
      persist();
      renderHeader();
    };
    document.querySelectorAll("[data-why3]").forEach(function (b) {
      b.onclick = function () { state.ideal = Object.assign({}, state.ideal || {}, { why: b.dataset.why3, at: Date.now() }); persist(); render(); };
    });
    on("#idealsave", function () {
      state.ideal = Object.assign({}, state.ideal || {}, { text: ($("#idealtext").value || "").trim().slice(0, 120), at: Date.now() });
      persist(); toast("🎯 Guardado."); render();
    });
    on("#share", shareCard);
    var ret = $("#retention");
    if (ret) ret.onchange = function () { state.retention = +ret.value; persist(); toast("Retención: " + Math.round(state.retention * 100) + " %"); };
    var notte = $("#notte");
    if (notte) notte.onchange = function () { state.notte = notte.checked; persist(); };
    on("#remind", function () { scheduleReminder($("#remtime").value || "13:30"); });
    on("#export", exportSave);
    document.querySelectorAll("[data-switchlang]").forEach(function (b) {
      b.onclick = function () { flushPersist(); if (window.Boot) Boot.switchTo(b.getAttribute("data-switchlang")); };
    });
    on("#import", function () { $("#importfile").click(); });
    var file = $("#importfile");
    if (file) file.onchange = function () { if (file.files[0]) importSave(file.files[0]); };
    wireNube();

    var pm = $("#persistmsg");
    if (pm && navigator.storage && navigator.storage.persisted) {
      navigator.storage.persisted().then(function (p) {
        pm.textContent = p
          ? "🔒 El navegador marcó tus datos como persistentes: no los borra solo."
          : "Instalá la app en la pantalla de inicio para que el teléfono no borre tus datos.";
      });
    }

    on("#reset", function () {
      if (!confirm("Esto borra tu progreso completo. ¿Seguro?")) return;
      state = Engine.blankSave();
      persist();
      go("oggi");
      renderHeader();
      toast("Progreso borrado.");
    });
  }

  /* The boxes and the keyboard.  Every box where the learner writes says
     its language (lang: the package's voice tag, LANG.tts; the boxes in
     Spanish, lang="es"), for the screen reader.  The keyboard never sees
     it: Chrome on Android does not pass lang to the keyboard.  What it
     passes is autocomplete="off" («no suggestions»), and with it Gboard
     turns off its suggestion bar and the engine that detects the language
     as you type: the keyboard stays in one language and the bar to choose
     another is not there.  So, by default the boxes allow suggestions
     (autocomplete is taken away) and never autocorrect (autocorrect="off":
     the keyboard must not fix the learner's answer); «Teclado sin
     sugerencias» (state.kbQuiet) puts autocomplete="off" back.  The search
     boxes and the keys (type search, password) are left as they are. */
  var SPANISH_BOXES = { idealtext: 1, refq: 1, aikey: 1, aiws: 1 };
  // A box where the learner writes in the language of the course (the app's keyboard, teclado.js).
  function courseBox(el) {
    var type = (el.getAttribute("type") || "text").toLowerCase();
    if (type !== "text" && el.tagName !== "TEXTAREA") return false;
    if (el.tagName !== "TEXTAREA" && el.tagName !== "INPUT") return false;
    return !(SPANISH_BOXES[el.id] || el.dataset.es || (el.getAttribute("lang") && el.getAttribute("lang") === "es"));
  }
  if (window.Teclado) Teclado.qualify = courseBox;
  function langBoxes(root0) {
    (root0 || document).querySelectorAll("textarea, input").forEach(function (el) {
      var type = (el.getAttribute("type") || "text").toLowerCase();
      if (type !== "text" && type !== "search" && el.tagName !== "TEXTAREA") return;
      // an edition in Spanish (UI.appKeyboard false): every box is a Spanish one, with the phone's keyboard
      var es = !!(SPANISH_BOXES[el.id] || el.dataset.es) || UI.appKeyboard === false;
      if (!el.hasAttribute("lang")) el.setAttribute("lang", es ? "es" : LG.tts);
      if (type === "search" || es) return;
      // the app's own keyboard, in the language of the course (teclado.js)
      if (window.Teclado) Teclado.mark(el);
      el.setAttribute("autocorrect", "off");
      if (state.kbQuiet) el.setAttribute("autocomplete", "off");
      else el.removeAttribute("autocomplete");
    });
  }
  if (window.MutationObserver) {
    new MutationObserver(function (list) {
      list.forEach(function (m) { m.addedNodes.forEach(function (n) { if (n.nodeType === 1) langBoxes(n.parentNode || document); }); });
    }).observe(document.body, { childList: true, subtree: true });
  }

  // Words and chips that act like buttons (span role="button"): Enter and
  // the space bar work on them as on a button.
  document.addEventListener("keydown", function (e) {
    var t = e.target;
    if (!t || t.tagName === "BUTTON" || t.getAttribute("role") !== "button") return;
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); t.click(); }
  });

  /* ------------------------------------------------------------------ arranque */

  // The prompt may have come while boot.js was still loading the scripts.
  if (window.Boot && Boot.installPrompt) installPrompt = Boot.installPrompt;
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    installPrompt = e;
    if (view.screen === "oggi" && course) render();
  });

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    // boot.js loads the scripts one after another: the page may be loaded already.
    var whenLoaded = function (fn) { if (document.readyState === "complete") fn(); else window.addEventListener("load", fn); };
    whenLoaded(function () {
      navigator.serviceWorker.register("sw.js").then(function (reg) {
        reg.update().catch(function () { /* offline */ });
      }).catch(function () { /* offline no */ });
      // The service worker keeps the core; this language's package is kept
      // offline once it has been chosen (the other one, when it is used).
      navigator.serviceWorker.ready.then(function (reg) {
        if (reg.active) reg.active.postMessage({ keep: LG.code });
      }).catch(function () { /* */ });
      // A new version took over.  On a screen with nothing only in memory
      // (Oggi, the path, a list), reload at once and come back to the same
      // place; anywhere else (a round, a role-play, a draft, the exam, a
      // book), a notice to update when the learner wants.
      var hadController = !!navigator.serviceWorker.controller;
      navigator.serviceWorker.addEventListener("controllerchange", function () {
        if (!hadController || reloading) return;
        updateReady = true;
        if (safeToReload()) reloadHere();
        else showUpdateBar();
      });
    });
  }
  // Ask the browser not to evict the save under storage pressure.
  if (navigator.storage && navigator.storage.persist) {
    navigator.storage.persist().catch(function () { /* */ });
  }

  var updateReady = false;
  var SAFE_SCREENS = { oggi: 1, percorso: 1, briefing: 1, io: 1, allena: 1, leggi: 1 };
  function safeToReload() {
    var el = document.activeElement;
    return !!SAFE_SCREENS[view.screen] && !(el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
  }
  // Reload and come back to the same screen and scroll (sessionStorage).
  function reloadHere() {
    reloading = true;
    flushPersist();
    try { sessionStorage.setItem(LG.storage + ".view", JSON.stringify({ tab: view.tab, screen: view.screen, week: view.week, y: window.scrollY, at: Date.now() })); } catch (e) { /* */ }
    location.reload();
  }
  var reloading = false;
  function showUpdateBar() {
    if (document.getElementById("updbar")) return;
    var b = document.createElement("div");
    b.id = "updbar";
    b.className = "updbar";
    b.setAttribute("role", "status");
    b.innerHTML = '<span>Hay una versión nueva.</span><button class="btn" id="updgo">Actualizar</button>';
    document.body.appendChild(b);
    document.getElementById("updgo").onclick = reloadHere;
  }
  function restoreView() {
    try {
      var v = JSON.parse(sessionStorage.getItem(LG.storage + ".view") || "null");
      sessionStorage.removeItem(LG.storage + ".view");
      if (!v || Date.now() - v.at > 60000 || !SAFE_SCREENS[v.screen]) return false;
      view.tab = v.tab; view.screen = v.screen; view.week = v.week || view.week;
      render();
      setTimeout(function () { window.scrollTo(0, v.y || 0); }, 0);
      return true;
    } catch (e) { return false; }
  }

  // Coming back to the app after a while: refresh the header (new day, the
  // streak as it really is).
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden && course) {
      if (Engine.checkStreak(state).status === "lost") persist();
      renderHeader();
      if (view.screen === "oggi") render();
      if (updateReady && safeToReload()) reloadHere();
    }
    if (document.hidden && course) { flushPersist(); updateBadge(); nubeAuto(); }
  });
  window.addEventListener("pagehide", function () { flushPersist(); });
  // The app icon shows how many cards are due (Badging API; a passive
  // reminder that needs no server and no permission on Android).
  function updateBadge() {
    if (!navigator.setAppBadge || !course) return;
    try {
      var n = Drills.dueCount(course, state, itemMap);
      if (n) navigator.setAppBadge(Math.min(n, 20)).catch(function () { /* */ });
      else navigator.clearAppBadge().catch(function () { /* */ });
    } catch (e) { /* */ }
  }

  // «📖 ¿Por qué?» and «🧐 ¿Qué tenía de malo?» (porque.js): what it needs from here.
  if (window.Porque) Porque.init({
    course: function () { return course; }, state: function () { return state; }, week: function () { return view.week; },
    renderBlock: renderBlock, mk: mk, esc: esc, speak: speak, gain: gain, persist: persist, renderHeader: renderHeader,
    xpFly: xpFly, weekNum: weekNum, weekLabel: function (n) { return UI.theory + weekNum(n); }
  });

  // Test hook (only with ?test in the URL): lets the automated playthrough
  // read the current question so it can answer right or wrong on purpose.
  if (/[?&]test\b/.test(location.search)) {
    window.__test = {
      item: function () { return round && view.screen === "gioco" ? round.items[round.i] : null; },
      state: function () { return state; },
      round: function () { return round; },
      // start a round of a given week (the exploration and the smoke test)
      start: function (kind, arg, week) { if (week) view.week = week; startRound(kind, arg); },
      // play these items (ids of the course, or items): the correction of
      // one exercise, answered on purpose
      play: function (list, week) {
        if (week) view.week = week;
        var its = (list || []).map(function (x) {
          if (typeof x !== "string") return x;
          return itemMap[x] ? Object.assign({}, itemMap[x]) : null;
        }).filter(Boolean);
        startRound("lista", its);
      },
      screen: function () { return view.screen; },
      // the missions of a week, as the percorso shows them (test_misiones)
      plan: function (week) {
        return weekPlan(course.weeks[week - 1]).map(function (x) {
          return { kind: x.kind, arg: x.arg == null ? null : String(x.arg), done: !!x.done, half: !!x.half, opt: !!x.opt, title: x.title, sub: x.sub };
        });
      },
      // open a mission as its button does
      mission: function (kind, arg, week) { view.week = week; view.tab = "percorso"; goMission(kind, arg); },
      // the screen of a week (the smoke test: the literature, the missions)
      briefing: function (week) { view.week = week; view.tab = "percorso"; view.screen = "briefing"; render(); },
      /* Answer the current question right (or with `verdict`), as a learner
         who knows it: through settle, the same bookkeeping as a real answer;
         a card, a word or an intro goes on, an answered one goes on. */
      solve: function (verdict) {
        // a lesson: the steps in order, the checks answered right
        if (view.screen === "lezione" && les) {
          var ls = les.steps[les.i];
          if (!ls) return "none";
          if (ls.q && !les.answered) {
            var ok = Array.prototype.filter.call(document.querySelectorAll("[data-lq]"), function (b) { return b.textContent === ls.q.answer; })[0];
            if (ok) { lesAnswer(ok); return "answered"; }
          }
          lesNext();
          return "next";
        }
        if (!round || view.screen !== "gioco") return "none";
        var it = round.items[round.i];
        if (!it) return "none";
        if (round.askPredict && round.predict == null && round.i === 0) { round.predict = 0; render(); return "next"; }
        if (round.answered || it.type === "word" || it.type === "card") { nextItem(); return "next"; }
        if (!$("#fb")) return "stuck:" + it.type;
        settle(verdict || "giusto", String(it.answer == null ? "" : it.answer).replace(/\s*\|\s*/g, " "), "");
        return "answered";
      }
    };
  }

  // Concordancias y «Mi gramática» (docs/js/referencia.js).
  if (window.Referencia) Referencia.attach({
    state: function () { return state; }, persist: persist,
    course: function () { return course; },
    fx: function (ok) { if (ok) fx.right(); else fx.wrong(); gain(ok ? 3 : 1); },
    open: function () { if (view.screen !== "gramatica") view.gramFrom = view.screen; view.screen = "gramatica"; render(); window.scrollTo(0, 0); },
    back: function () {
      if (view.gramFrom === "consultar") { view.gramFrom = null; view.screen = "consultar"; render(); window.scrollTo(0, 0); }
      else go(view.tab || "io");
    }
  });
  // Las capas (capas.js): «Consultar» y la misión de la Biblioteca.
  if (window.Capas) Capas.attach({
    state: function () { return state; }, persist: persist, speak: speak,
    show: function (sc) { view.screen = sc; render(); window.scrollTo(0, 0); },
    back: function () { go(view.tab || "frasi"); },
    refresh: function () { if (course && ["briefing", "percorso", "leggi"].indexOf(view.screen) >= 0) render(); },
    openBook: function (id, ch) { if (window.Biblioteca) Biblioteca.openChapter(view, id, ch, view.week); }
  });
  // Escritura guiada (escritos.js): lo que necesita de la app.
  if (window.Escritos) Escritos.attach({
    state: function () { return state; }, persist: persist, gain: gain, render: render, go: go, toast: toast,
    esc: esc, plate: plate, fx: fx, startRound: startRound,
    show: function (s) { view.screen = s; render(); window.scrollTo(0, 0); },
    toWeek: function () { view.tab = "percorso"; view.screen = "briefing"; render(); window.scrollTo(0, 0); }
  });

  // «Hoy», el primer arranque y el después del curso (inicio.js, plan.js):
  // lo que necesitan de la app.
  function showScreen(sc) { view.screen = sc; render(); window.scrollTo(0, 0); }
  function roundFromHoy() { if (view.screen === "gioco" && round) { round.from = "hoy"; savePending(); } }
  if (window.Inicio) Inicio.attach({
    state: function () { return state; }, persist: persist, render: render, go: go, esc: esc, toast: toast,
    ui: function () { return UI; }, lg: function () { return LG; }, course: function () { return course; },
    week: function () { return course.weeks[Math.min(state.unlocked, NW()) - 1]; },
    nextMission: nextMission, missions: weekPlan,
    missionDone: function (kind, arg, wk) {
      var w = course.weeks[wk - 1];
      return !!w && weekPlan(w).some(function (m) { return m.kind === kind && String(m.arg == null ? "" : m.arg) === String(arg == null ? "" : arg) && m.done; });
    },
    due: function () { return Drills.dueCount(course, state, itemMap); },
    canPausa: function () { return Object.keys(state.read || {}).length > 0 || Object.keys(state.readSess || {}).length > 0 || state.unlocked > 1; },
    startRound: function (kind, arg) { view.week = Math.min(state.unlocked, NW()); startRound(kind, arg); roundFromHoy(); },
    startMission: function (kind, arg, wk) {
      view.week = wk;
      goMission(kind, arg);
      if (view.screen === "gioco") roundFromHoy(); else view.tab = "percorso";
      renderNav();
    },
    openBiblio: function () { view.tab = "leggi"; showScreen("biblioteca"); },
    show: showScreen, ubicacion: startUbicacion,
    ics: scheduleReminder,
    share: shareBlob
  });
  // Tu progreso (progreso.js): la pantalla, y el reloj de estudio.
  if (window.Progreso) Progreso.attach({
    state: function () { return state; }, persist: persist, esc: esc, course: function () { return course; },
    show: showScreen, back: function () { go(view.tab || "io"); },
    screen: function () { return view.screen; }, roundKind: function () { return round ? round.kind : ""; },
    listening: function () { return !!(window.speechSynthesis && speechSynthesis.speaking); },
    label: function (c) { return Errores.label(c); },
    cards: progresoCards
  });

  // El seminario, los dilemas y la literatura (seminario.js): lo semanal del formato.
  if (window.Seminario) Seminario.attach({
    state: function () { return state; }, persist: persist, render: render, go: go, toast: toast, mk: mk,
    course: function () { return course; }, aiKeys: aiKeys, show: showScreen,
    gain: function (n, strand) { gain(n); if (strand && n) Engine.addStrand(state, strand, n); renderHeader(); },
    toWeek: function () { view.tab = "percorso"; view.screen = "briefing"; render(); window.scrollTo(0, 0); }
  });

  // La Biblioteca (biblioteca.js): libros enteros, con el lector y el input.
  if (window.Biblioteca) Biblioteca.init({
    state: function () { return state; }, view: function () { return view; }, persist: persist, gain: gain,
    render: render, go: go, toast: toast, speak: speak,
    strand: function (n) { Engine.addStrand(state, "input", n); }
  });

  /* Something in the save breaks the screen: never a dead end.  The
     learner can download the save as it is (to send it or restore it
     later), try again, or open Oggi with the save untouched. */
  function rescue(err) {
    var raw = "";
    try { raw = localStorage.getItem(LG.storage + ".save.v1") || ""; } catch (e) { /* */ }
    app().innerHTML = '<div class="card"><h2>Algo de tu progreso no se pudo mostrar</h2>' +
      "<p>Tu progreso sigue guardado en el teléfono. Bajá una copia antes de hacer cualquier otra cosa: sirve para restaurarla o para mandarla si hay que revisarla.</p>" +
      '<div class="row"><button class="btn" id="rsdl">💾 Descargar mis datos</button><button class="btn ghost" id="rsagain">Reintentar</button></div>' +
      '<p class="muted small">' + esc(String(err && err.message || err)) + "</p></div>";
    on("#rsdl", function () {
      download(new Blob([JSON.stringify({ app: "agora", lang: LG.code, brand: LG.brand, v: APP_VERSION, at: new Date().toISOString(), raw: raw })], { type: "application/json" }),
               UI.exportFile + stamp() + "-rescate.json");
    });
    on("#rsagain", function () { location.reload(); });
  }

  fetch(DATA("course.json"))
    .then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .then(function (data) {
      course = data;
      // the length of the course: the weeks written, the final exam (engine.js)
      Engine.setCourse(course);
      if (state.unlocked > NW()) state.unlocked = NW();
      try {
        itemMap = Drills.itemsById(course);
        view.week = Math.min(state.unlocked, NW());
        if (Engine.checkStreak(state).status === "lost") persist();
        // A new learner: the three screens after the language picker (inicio.js).
        if (window.Inicio && Inicio.boot(view)) { renderHeader(); render(); return; }
        if (location.hash === "#pausa") { renderHeader(); startRound("pausa"); return; }
        if (location.hash === "#micro") { renderHeader(); startRound("micro"); return; }
        updateBadge();
        renderHeader();
        if (!restoreView()) render();
        // «Hoy» from the app icon or the calendar reminder: the plan in sight.
        if (location.hash === "#hoy") { var hp = document.getElementById("hoyplan") || document.getElementById("weektop"); if (hp && hp.scrollIntoView) hp.scrollIntoView({ block: "start" }); }
      } catch (err) { rescue(err); }
    }, function (e) { throw e; })
    .catch(function (e) {
      if (course) return rescue(e);
      app().innerHTML = '<div class="card"><h2>No se pudo cargar el curso</h2>' +
        "<p>La primera vez la app necesita internet para descargarse; después funciona sin conexión. " +
        "Revisá la conexión y probá de nuevo.</p>" +
        '<button class="btn" id="retry">Reintentar</button>' +
        (location.protocol === "file:" ? '<p class="muted">Abierta como archivo: serví la carpeta ' +
          "<code>docs/</code> con un servidor web (python3 -m http.server).</p>" : "") +
        '<p class="muted">' + esc(e.message) + "</p></div>";
      var rb = document.getElementById("retry");
      if (rb) rb.onclick = function () { location.reload(); };
    });
})();
