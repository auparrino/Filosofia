/*
 * La interfaz del juego, una para todos los idiomas.  Pantallas: hoy
 * («oggi»), entrenar («frasi»), leer («leggi»), el camino («percorso»),
 * el perfil («io»), la semana (briefing), la teoría, la lección jugada, la
 * ronda, el relámpago («lampo»), el resultado, la escritura, el role-play,
 * el dictogloss y el examen C1.
 *
 * El núcleo no nombra ningún idioma: los textos de la interfaz, la voz, el
 * prefijo de guardado, las listas de la lengua y la estética salen del
 * paquete del idioma (window.LANG, docs/lang/<código>/lang.js).  Los nombres
 * internos de pantallas y rondas («oggi», «gioco», «lampo», «pausa»…) son
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
  // The data files the package has (a language that is just starting may
  // have only its course: Boot.LANGS[code].data).
  var hasData = function (f) {
    var L = window.Boot && Boot.LANGS && Boot.LANGS[LG.code];
    return !L || !L.data || L.data.indexOf(f) >= 0;
  };
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
  var lampo = null;
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
  var realAudio = null;
  // An item of the listening module carries its own voice (variability).
  function speakItem(it, force, rate) {
    var v = it.voice || {};
    var tts = function () { return speak(it.say || it.stem, force, rate || v.rate, { pitch: v.pitch, vi: v.vi }); };
    // A sentence of Common Voice: the recording itself; the phone's voice
    // only when it cannot play (offline the first time, an old browser).
    if (it.audio && typeof Audio === "function") {
      if (state.silent && !force) return null;
      if (window.speechSynthesis) speechSynthesis.cancel();
      try {
        if (realAudio) realAudio.pause();
        var a = realAudio = new Audio(it.audio), fell = false;
        var fall = function () { if (!fell) { fell = true; tts(); } };
        if (rate && rate < 0.9) a.playbackRate = 0.75;
        a.onerror = fall;
        var pr = a.play();
        if (pr && pr.catch) pr.catch(fall);
        var c = $("#vcredit"); if (c) c.textContent = "🎙️ Voz real · " + (window.VociCV ? VociCV.LICENSE : "Common Voice");
      } catch (e) { tts(); }
      return null;
    }
    // A pair of Suoni / Sons: a real speaker of Lingua Libre when there is
    // one (Voci.usable decides; LANG.realVoiceSkip: the categories whose file
    // names cannot tell the pair apart).
    if (window.Voci && it.type === "coppia" && !(LG.realVoiceSkip || {})[it.cat] && Voci.usable(it.say)) {
      if (state.silent && !force) return null;
      if (window.speechSynthesis) speechSynthesis.cancel();
      Voci.play(it.say, { rate: rate && rate < 0.9 ? 0.75 : 1, onplay: function (who) {
        var c = $("#vcredit"); if (c) c.textContent = "🎙️ Voz real: " + who;
      } }, tts);
      return null;
    }
    return tts();
  }
  /* What is read aloud after an answer.  Only the language studied: a
     Spanish gloss or option (¡Ojalá!, botas de montaña) is never read with
     the voice of the language.  Spanish: what LANG.spanish.sure finds (ñ,
     ¿, ¡…), or more Spanish-only words (function words, or glosses of the
     glossary that are not forms of the language) than words only of the
     language; words of both (LANG.spanish.both) do not count.
     LANG.spanish.notEs: letters only the language has.  An unknown word
     spelled like LANG.spanish.unknownEs is Spanish. */
  var SP = LG.spanish || {};
  var wordSet = function (str) { var o = {}; String(str || "").split(" ").forEach(function (w) { if (w) o[w] = 1; }); return o; };
  var ES_WORDS = wordSet(SP.es), TARGET_WORDS = wordSet(SP.target);
  var BOTH = wordSet(SP.both);         // say nothing about the language
  var esGloss = null;
  function spanishText(text) {
    text = String(text || "");
    if (SP.sure && SP.sure.test(text)) return true;
    if (SP.notEs && SP.notEs.test(text)) return false;
    if (!esGloss && glossario) {
      esGloss = {};
      Object.keys(glossario).forEach(function (k) {
        String(glossario[k][1] || "").toLowerCase().split(/[^a-zñáéíóúü]+/).forEach(function (w) { if (w) esGloss[w] = 1; });
      });
    }
    var es = 0, tg = 0;
    (text.toLowerCase().match(SP.word || /[a-zà-ÿ]+/g) || []).forEach(function (w) {
      if (BOTH[w]) return;
      var isTg = TARGET_WORDS[w] || (glossario && glossario[w]), isEs = ES_WORDS[w] || (esGloss && esGloss[w]);
      if (ES_WORDS[w] || (isEs && !isTg)) es++;
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
  /* «Cómo se arma»: the sentence word by word (docs/js/desglose.js): the
     verb each form comes from with its tense and person, the contractions,
     what each piece means.  Open when it is new or was missed. */
  function desgloseHtml(text, open) {
    if (!window.Desglose || !glossario || !text || spanishText(text)) return "";
    var ls;
    // the student's week: tense names only once the theory has taught them
    try { ls = Desglose.lines(text, { gloss: glossario, week: (state && state.unlocked) || 1, max: 7 }); } catch (e) { return ""; }
    if (!ls.length) return "";
    return '<details class="desglose"' + (open ? " open" : "") + "><summary>🔎 Palabra por palabra</summary><ul>" +
      ls.slice(0, 7).map(function (l) {
        var w = window.Referencia && /^\*([^*]+)\*/.exec(l);   // «usos»: la palabra en oraciones del curso (referencia.js)
        return "<li>" + mk(l) + (w ? " " + Referencia.button(w[1]) : "") + "</li>";
      }).join("") + "</ul></details>";
  }
  /* The target-language text of an item: the phrase, the sentence with its
     gaps filled, the word asked about, or the answer. */
  function targetText(it) {
    if (!it) return "";
    if (it.frase) return it.frase.t || it.frase.it;
    if (it.type === "hunt" || it.type === "scopri" || it.type === "listen" || it.type === "coppia") return "";
    if (it.dir === "it-es" || asksMeaning(it)) return String(it.stem || "").replace(/_{3,}/g, " ");
    var f = filledStem(it);
    return f || String(it.answer || "").split(/\s*\|\s*/)[0];
  }

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

  function stopLampo() {
    if (lampo && !lampo.done) { lampo.done = true; clearInterval(lampo.timer); }
  }

  function go(tab) {
    stopLampo();
    if (karaoke) { stopKaraoke(); document.body.classList.remove("kar-partial", "kar-audio"); }
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

  /* The phrase of the day; a package without phrases yet: a word of the
     weeks already open (the same one all day), with its example. */
  function phraseOfTheDay() {
    var f = Frasi.ofTheDay(new Date(), Math.min(state.unlocked || 1, NW()));
    if (f) return f;
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
    var fText = f[LG.code] || f.it;
    var known = Frasi.ALL.filter(function (x) { return state.cards[x.id]; }).length;
    var hour = new Date().getHours();
    var hello = UI.hello(hour);
    if (window.Inicio) Inicio.checkPhase();          // aprobado el examen: el modo mantenimiento
    var maint = state.phase === "mantenimiento";
    var anyLesson = Object.keys(state.read || {}).length > 0 || Object.keys(state.readSess || {}).length > 0 || state.unlocked > 1;

    var plan = weekPlan(w), doneN = plan.filter(function (x) { return x.done; }).length;
    var nm = nextMission(w);
    var nWords = Object.keys(state.cards).filter(function (id) { return id.indexOf("v:") === 0 || id.indexOf("b:voc:") === 0; }).length;
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
    // read, the challenge too, the review when something is due, the lampo
    // with 12 phrases seen.
    more += '<div class="big">' +
      (anyLesson ? '<button class="bigbtn pausa" id="pausa"><span class="e">☕</span>' + UI.pausaBtn + "</button>" : "") +
      (anyLesson && !maint ? '<button class="bigbtn giorno" id="giorno"' + (dailyDone ? " disabled" : "") + '>' +
        '<span class="e">🎯</span><b>' + UI.daily + "</b><small>" +
        (dailyDone ? "✓ hecha · mañana hay otra" : "6 preguntas · doble xp") + "</small></button>" : "") +
      (due ? '<button class="bigbtn ripasso" id="rev"><span class="e">🔁</span><b>' + UI.review + "</b><small>" +
        "hoy: " + dueToday + (due > 20 ? " (quedan " + due + ")" : " para repasar") + "</small></button>" : "") +
      (state.unlocked >= 2 && Banca.loaded() ? '<button class="bigbtn parole" data-bank="b-voc"><span class="e">📚</span><b>' + UI.words + "</b><small>" +
        nWords.toLocaleString("es-AR") + " palabras" +
        (window.Freq && Freq.loaded() ? " · " + Freq.coverage(knownWords()).fundamental[0] + " de las 2.000 frecuentes" : "") + "</small></button>" : "") +
      (matureWords().length >= 30 ? '<button class="bigbtn lampo" id="lampoparole"><span class="e">🧠</span>' +
        "<b>" + UI.wordOrNot + "</b><small>reconocer en un segundo · récord: " + ((state.best || {}).lampoParole || 0) + "</small></button>" : "") +
      (known >= 12 ? '<button class="bigbtn lampo" id="lampo"><span class="e">⚡</span>' +
        "<b>" + UI.lampo + " 60″</b><small>récord: " + ((state.best || {}).lampo || 0) + "</small></button>" : "") +
      "</div>" +
      (known < 12 && anyLesson ? '<p class="muted" style="margin:-6px 0 12px">⚡ ' + UI.lampoEl + " 60″ se abre con 12 frases vistas (llevás " + known + ").</p>" : "");

    // Las cuatro cuerdas de la semana (Nation): dónde falta, un consejo.
    var tot = strands.input + strands.output + strands.forma + strands.fluidez;
    if (tot > 0) {
      var NAMES = { input: "Input", output: "Output", forma: "Forma", fluidez: "Fluidez" };
      var TIP = { input: "leé un episodio o escuchá una escena", output: "escribí frases de memoria o traducí",
                  forma: "una ronda de la semana", fluidez: "un " + UI.lampo + " o repasá una escena" };
      var low = Engine.STRANDS.slice().sort(function (a, b) { return strands[a] - strands[b]; })[0];
      more += '<div class="card"><b>🎻 Tus cuatro cuerdas · últimos 7 días</b>' +
        '<div class="strands">' + Engine.STRANDS.map(function (k) {
          return '<i class="s-' + k + '" style="width:' + Math.round(strands[k] / tot * 100) + '%" title="' + NAMES[k] + '"></i>';
        }).join("") + "</div>" +
        '<p class="muted">' + Engine.STRANDS.map(function (k) { return NAMES[k] + " " + Math.round(strands[k] / tot * 100) + " %"; }).join(" · ") +
        ". Te falta <b>" + NAMES[low].toLowerCase() + "</b>: " + TIP[low] + ".</p></div>";
    }
    more += planLine();

    // La clínica: los errores que se repiten
    var weakO = Banca.loaded() ? Banca.weakest(state, 2) : [];
    if (weakO.length) {
      more += '<button class="card weekcard clin" data-bank="clinica">' +
        '<span class="muted">🩺 Clínica de tus errores</span>' +
        "<b>Practicá " + weakO.map(function (w) { return esc((Diagnosi.LABEL[w.cat] || w.cat).toLowerCase()); }).join(" y ") + "</b>" +
        '<span class="muted">12 ejercicios armados con lo que más te cuesta.</span></button>';
    }

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
  var CHANGES = [["escucha", "más escucha"], ["escritura", "más escritura"], ["repaso", "más repaso"], ["cortas", "sesiones más cortas"], ["frases", "más frases"]];
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
          cats.map(function (c) { return '<button class="tab" data-rf="hard" data-v="' + esc(c) + '">' + esc(Diagnosi.LABEL[c] || c) + "</button>"; }).join("") +
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
    // The words of the week, as the course teaches them (progreso.js: the
    // words of the week plus one session of the bank, not the gap to the
    // boss divided by the weeks left).
    if (state.unlocked >= 2 && !maint && window.Progreso) {
      var q = Progreso.wordQuota(course, state, new Date(), Banca.loaded());
      var left = Math.max(0, q.target - q.done);
      out.push({ id: "semana", html: '<div class="card goalweek"><b>🪜 Esta semana</b> <span class="muted">· hacia el ' + esc(q.level) + " en la semana " + q.boss + "</span>" +
        '<div class="goalbar" style="margin:8px 0 4px"><i style="width:' + Math.min(100, Math.round(q.done / Math.max(1, q.target) * 100)) + '%"></i></div>' +
        '<p class="muted" style="margin:0">' + q.done + " / " + q.target + " palabras nuevas" + (left ? " · faltan " + left : " ✓") +
          " (las " + q.weekWords + " de la semana" + (Banca.loaded() ? " y una sesión de " + UI.words : "") + "). " +
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
    var done = rf.change === "escucha" ? sw.input : rf.change === "escritura" ? sw.output : rf.change === "frases" ? sw.fluidez : null;
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
    var sg = Engine.subGoals(state), cov = window.Freq && Freq.loaded() ? Freq.coverage(knownWords()).fundamental[0] : null;
    g.font = "26px system-ui, sans-serif";
    g.fillText("🔥 " + state.streak + " días · " + Engine.weekStreak(state) + " semanas · nivel " + Engine.levelFor(state.xp).level, W / 2, K.lines[0]);
    g.fillText(sg.nWords.toLocaleString("es-AR") + " palabras" + (cov != null ? " · " + cov + " de las 2.000 frecuentes" : ""), W / 2, K.lines[1]);
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
  var APP_VERSION = "v0.1.0";
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

  function bankBtn(id, emoji, name, desc, week) {
    var locked = (state.unlocked || 1) < week;
    return '<button class="lab" data-bank="' + id + '"' + (locked ? " disabled" : "") + '><span class="e">' + emoji + "</span><b>" + name + "</b>" +
      '<span class="muted">' + (locked ? "Se abre en la semana " + week + ", con la gramática que usa." : desc) + "</span></button>";
  }

  /* Allena / Treino, la capa de práctica (js/capas.js): lo de esta semana
     arriba —las escenas, el oído, el duelo que se abre, la escritura
     guiada—, la entrada a «Consultar» y el resto plegado por secciones. */
  function renderFrasi() {
    var week = Math.min(state.unlocked || 1, NW()), C = window.Capas;
    var fold = C ? C.fold : function (k, t, m, body) { return "<h2>" + t + "</h2>" + body; };
    var noH2 = function (h) { return String(h || "").replace(/^\s*<h2>[\s\S]*?<\/h2>/, ""); };
    var html = '<button class="btn ghost" id="toio">← ' + UI.me + "</button>" + "<h1>" + UI.train + "</h1>" +
      '<p class="lead">Forma y fluidez: bloques listos para hablar, el oído, los errores que más te cuestan. ' +
      "Arriba, lo de esta semana; lo demás, en las secciones.</p>";

    // lo de esta semana
    var wk = [];
    if (window.Drills && window.Frasi) Drills.scenesOfWeek(week).forEach(function (sc) {
      var p = Frasi.progress(sc.id, state.cards);
      wk.push('<button class="ep' + (p.seen >= p.total ? " done" : "") + '" data-scene="' + sc.id + '"><span class="e">' + sc.emoji + "</span>" +
        "<span><b>" + esc(sc.name) + '</b><span class="muted">Frases · ' + p.seen + " / " + p.total + " vistas</span></span></button>");
    });
    if (window.Suoni && Suoni.data() && week <= 40) {
      var sp = Suoni.progress(week, state.cards), sdone = !!(state.suoniDone || {})[week];
      wk.push('<button class="ep' + (sdone ? " done" : "") + '" data-lab="suoni"><span class="e">🎧</span><span><b>' + UI.suoni + "</b>" +
        '<span class="muted">El oído de la semana · ' + sp.seen + " / " + sp.total + " pares</span></span></button>");
    }
    if (window.Duelli) Duelli.DUELLI.filter(function (d) { return d.week === week; }).forEach(function (d) {
      var best = (state.duelli || {})[d.id];
      wk.push('<button class="ep' + (best && best.pct >= 80 ? " done" : "") + '" data-duel="' + d.id + '"><span class="e">⚔️</span><span><b>Duelo: ' + esc(d.title) + "</b>" +
        '<span class="muted">' + (best ? "Tu mejor: " + best.pct + " %" : esc(d.sub)) + "</span></span></button>");
    });
    if (Banca.loaded()) {
      var weak = Banca.weakest(state, 2);
      if (weak.length) wk.push('<button class="ep" data-bank="clinica"><span class="e">🩺</span><span><b>Clínica de tus errores</b>' +
        '<span class="muted">' + weak.map(function (w) { return esc(Diagnosi.LABEL[w.cat] || w.cat); }).join(", ") + "</span></span></button>");
    }
    if (window.Trabajo) wk = wk.concat(Trabajo.weekButtons(state, week));   // la escena de trabajo de la semana (trabajo.js)
    if (window.Variaciones && Variaciones.eligible(state, week).length)
      wk.push('<button class="ep" data-esc="var"><span class="e">🔁</span><span><b>Variaciones de frase</b>' +
        '<span class="muted">' + Variaciones.eligible(state, week).length + " frases que ya sabés, cambiando una pieza</span></span></button>");
    html += '<div class="card capa-week"><h2>Esta semana <small class="muted">· semana ' + week + "</small></h2>" +
      (wk.length ? '<div class="eps">' + wk.join("") + "</div>" : '<p class="muted">Esta semana no trae práctica nueva: repasá lo que quieras abajo.</p>') + "</div>";
    if (C) html += C.entryHtml();

    var pp = Lab.progress("ponte:", state.cards), pf = Lab.progress("falso:", state.cards),
        pc = Lab.progress("capire:", state.cards);
    html += fold("al:lab", "🧪 Laboratorio", pp.seen + pf.seen + pc.seen + " vistas",
      '<div class="labs">' +
        '<button class="lab" data-lab="ponte"><span class="e">🌉</span><b>Ponte</b>' +
          '<span class="muted">' + UI.ponte + "</span>" +
          '<span class="meta">' + pp.seen + "/" + pp.total + " palabras</span></button>" +
        '<button class="lab" data-lab="falsi"><span class="e">🪤</span><b>' + UI.falsi + "</b>" +
          '<span class="muted">Las palabras que parecen y no son.</span>' +
          '<span class="meta">' + pf.seen + "/" + pf.total + "</span></button>" +
        '<button class="lab" data-lab="capire"><span class="e">🎯</span><b>' + UI.capire + "</b>" +
          '<span class="muted">Leer la gramática: quién, cuándo, cuántos, seguro o no.</span>' +
          '<span class="meta">' + pc.seen + "/" + pc.total + "</span></button>" +
        (window.Suoni && Suoni.data() ? '<button class="lab" data-lab="suoni"><span class="e">🎧</span><b>' + UI.suoni + "</b>" +
          '<span class="muted">' + UI.suoniSub + "</span>" +
          '<span class="meta">' + Suoni.progress(state.unlocked, state.cards).seen + "/" + Suoni.progress(state.unlocked, state.cards).total + " pares</span></button>" : "") +
      "</div>" +
      '<p class="muted science">🔬 Ponte usa la transferencia desde tu lengua (Ringbom); ' +
      UI.capire + " es input estructurado: primero interpretar la forma, después producirla (VanPatten).</p>");
    if (window.Escritos) html += fold("al:esc", "✍️ Escritura guiada", "variaciones · C-test · ordená", noH2(Escritos.treinoHtml(state)));

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

    if (Banca.loaded()) {
      var bst = Banca.stats(), weak2 = Banca.weakest(state, 2);
      html += fold("al:bank", "🏦 Banco", bst.nouns + bst.verbs + bst.adjectives + " palabras · " + bst.sentences + " oraciones",
        '<p class="muted">' + bst.nouns + " sustantivos, " + bst.verbs + " verbos, " + bst.adjectives +
        " adjetivos, " + bst.sentences + " oraciones y " + bst.errors + " errores típicos. " +
        "Cuando te equivocás, la app te dice qué tipo de error es y te deja corregirlo.</p>" +
        '<div class="labs">' +
          (weak2.length ? '<button class="lab clin" data-bank="clinica"><span class="e">🩺</span><b>Clínica de tus errores</b>' +
            '<span class="muted">Práctica armada con lo que más te cuesta: ' +
            weak2.map(function (w) { return esc(Diagnosi.LABEL[w.cat] || w.cat); }).join(", ") + ".</span></button>" : "") +
          '<button class="lab" data-bank="b-voc"><span class="e">📚</span><b>' + UI.words + "</b>" +
            '<span class="muted">Vocabulario de tu nivel: primero reconocer, después escribir con el artículo.</span></button>' +
          bankBtn("b-tr", "✍️", UI.tr, "Oraciones del español al " + UI.langEs + ", con corrección que te explica el error.", Banca.TR_WEEK) +
          bankBtn("b-gap", "🔧", UI.gap, "El verbo justo dentro de una oración real.", Banca.GAP_WEEK) +
          '<button class="lab" data-bank="b-err"' + (state.unlocked < Banca.ERR_WEEK ? " disabled" : "") +
            '><span class="e">🔍</span><b>' + esc(UI.err) + "</b>" +
            '<span class="muted">' + (state.unlocked < Banca.ERR_WEEK
              ? "Se abre en la semana " + Banca.ERR_WEEK + ": primero tenés que poder leer la oración."
              : "Encontrá y corregí el error típico de un hispanohablante.") + "</span></button>" +
          bankBtn("b-forme", "🧩", UI.forme, UI.formeSub, Banca.FORME_WEEK) +
        "</div>");
    }

    // Las escenas, por estación (cada una se abre con su semana).
    var items = Frasi.SCENES.map(function (s) {
      var p = Frasi.progress(s.id, state.cards);
      var pct = Math.round(p.seen / p.total * 100);
      var sw = Drills.sceneWeek(s.id), shut = sw > (state.unlocked || 1);
      return { week: sw, done: p.seen >= p.total, html: '<button class="scene' + (p.seen === p.total ? " done" : "") + (shut ? " locked" : "") +
        '" data-scene="' + s.id + '"' + (shut ? " disabled" : "") + ">" +
        '<span class="e">' + (shut ? "🔒" : s.emoji) + "</span>" +
        "<b>" + esc(s.name) + "</b>" +
        '<span class="muted">' + esc(s.blurb) + "</span>" +
        '<span class="meta">' + (shut ? "Se abre en la semana " + sw :
          p.seen + "/" + p.total + " vistas · " + p.strong + " firmes") + "</span>" +
        '<span class="prog"><i style="width:' + pct + '%"></i></span>' +
        "</button>" };
    });
    var seenSc = items.filter(function (x) { return x.week <= week; }).length;
    html += fold("al:scenes", "💬 " + esc(UI.scenes), seenSc + " / " + items.length + " abiertas",
      C ? C.seasons("al:sc", items, week, (course.seasons || []).map(function (s) { return s.name; })).replace(/class="eps"/g, 'class="scenes"')
        : '<div class="scenes">' + items.map(function (x) { return x.html; }).join("") + "</div>");

    if (window.Trabajo) html += Trabajo.allenaFold(state, week, (course.seasons || []).map(function (s) { return s.name; }));   // para el trabajo (trabajo.js)
    if (window.TresLenguas) html += fold("al:tres", "🔀 Tres lenguas", "contrastes · duelo", noH2(TresLenguas.card(state)));
    return html;
  }

  /* ----------------------------------------------------------------- ler */

  function epButton(ep, done) {
    var d = done[ep.id], open = Letture.isOpen(ep, done, state.unlocked);
    var wait = !open && ep.week > state.unlocked;
    return '<button class="ep' + (d ? " done" : "") + '" data-ep="' + ep.id + '"' +
      (open ? "" : " disabled") + ">" +
      '<span class="e">' + (open ? ep.emoji : "🔒") + "</span>" +
      "<span><b>" + esc(ep.title) + "</b>" +
      '<span class="muted">' + (ep.area ? esc(ep.area) + " · " : ep.series === "settimana" || ep.series === "lunga" ? "semana " + ep.week + " · " : "episodio " + ep.n + " · ") +
        esc(ep.level) + " · " + (wait ? "se abre en la semana " + ep.week : esc(ep.grammar)) +
        "</span></span>" +
      (d ? '<span class="score">' + d.pct + "%</span>" : "") +
      "</button>";
  }

  /* Leggi / Ler, la capa de input (js/capas.js): arriba lo de esta semana
     (la lectura y la escucha pendientes, el capítulo recomendado, los
     minutos de input); después, plegadas: Historias, La settimana, Largas,
     Escuchas, Biblioteca y la velocidad de lectura, cada lista por estación
     con la actual abierta. */
  function renderLeggi() {
    var done = state.letture || {}, week = Math.min(state.unlocked || 1, NW()), C = window.Capas;
    var fold = C ? C.fold : function (k, t, m, body) { return "<h2>" + t + "</h2>" + body; };
    var sNames = (course.seasons || []).map(function (s) { return s.name; });
    var bySeason = function (key, list) {
      var items = list.map(function (ep) { return { week: readingWeek(ep), done: !!done[ep.id], html: epButton(ep, done) }; });
      return C ? C.seasons(key, items, week, sNames) : '<div class="eps">' + items.map(function (x) { return x.html; }).join("") + "</div>";
    };
    var count = function (list) { return list.filter(function (ep) { return done[ep.id]; }).length + " / " + list.length; };
    var html = '<button class="btn ghost" id="toio">← ' + UI.me + "</button>" + "<h1>" + UI.read + "</h1>" +
      '<p class="lead">Leer y escuchar mucho, entendiendo casi todo, es de lo que más hace crecer una lengua. ' +
      "Tocá las palabras subrayadas para ver qué significan.</p>";

    // lo de esta semana: lecturas de la semana, la escucha larga, el capítulo recomendado
    var mine = Letture.EPISODI.filter(function (ep) { return readingWeek(ep) === week; })
      .map(function (ep) {
        // the story goes in order: the episode of the week waits for the one before
        if (ep.series !== "martin" || Letture.isOpen(ep, done, state.unlocked)) return ep;
        return Letture.next(done, "martin") || ep;
      })
      .filter(function (ep, k, a) { return a.indexOf(ep) === k; })
      .sort(function (a, b) { return (a.series === "cultura" || a.series === "flood" ? 1 : 0) - (b.series === "cultura" || b.series === "flood" ? 1 : 0); });
    var wk = mine.map(function (ep) { return epButton(ep, done); });
    var trs = window.Tramo && Tramo.week ? Tramo.week(week) : null;
    if (trs && trs.ascolto) {
      var ad = ((state.tramo || {}).asc || {})[week];
      wk.push('<button class="ep' + (ad ? " done" : "") + '" data-trasc="' + week + '"><span class="e">🎧</span><span><b lang="' + LG.tts + '">' + esc(trs.ascolto.title) + "</b>" +
        '<span class="muted">Escucha larga · <span lang="' + LG.tts + '">' + esc(trs.ascolto.genre) + "</span></span></span>" +
        (ad ? '<span class="score">' + ad.pct + "%</span>" : "") + "</button>");
    }
    if (window.Radio) wk = wk.concat(Radio.weekButtons(state, week));   // el episodio de la serie Radio (radio.js)
    if (window.Fuera) wk = wk.concat(Fuera.weekButtons(state, week));   // la ficha de afuera de la semana (fuera.js)
    var B = window.Biblioteca, rec = null;
    if (B && B.loaded && B.loaded() && B.firstOpenWeek(B.index()) <= week) {
      var lm = B.mission(B.index(), { week: week }, state);
      rec = lm && lm.arg ? lm.arg.split("|") : null;
      if (rec) wk.push('<button class="ep' + (lm.done ? " done" : "") + '" data-bxread="' + esc(rec[0]) + '" data-bxch="' + esc(rec[1]) + '"><span class="e">📚</span><span><b>' +
        esc(lm.title) + '</b><span class="muted">' + esc(lm.sub.replace(/^Opcional · /, "")) + "</span></span></button>");
    } else if (B && B.loadIndex && B.loaded && !B.loaded() && typeof fetch === "function") {
      B.loadIndex().then(function () { if (view.screen === "leggi") render(); }).catch(function () { /* sin red */ });
    }
    var inp = C ? C.inputWeek(state) : { read: 0, listen: listeningWeek(), total: listeningWeek() };
    var curve = Letture.speedCurve ? Letture.speedCurve(state) : [];
    var lastSpeed = curve.length ? curve[curve.length - 1].wpm : 0;
    html += '<div class="card capa-week"><h2>Esta semana <small class="muted">· semana ' + week + "</small></h2>" +
      (wk.length ? '<div class="eps">' + wk.join("") + "</div>" : '<p class="muted">Esta semana no trae lectura nueva: elegí una de abajo.</p>') +
      '<p class="small muted capa-input">⏱️ Input en 7 días: <b>' + inp.read + " min</b> leyendo · <b>" + inp.listen + " min</b> escuchando" +
        (inp.out ? " · <b>" + inp.out + " min</b> fuera de la app" : "") +
        (lastSpeed ? " · leés a ~" + lastSpeed + " palabras por minuto" : "") + "</p></div>";
    if (C) html += C.entryHtml(true);

    // Historias: Martín, los cuentos con tus palabras, la cultura y las inundaciones
    var ser = {};
    Letture.SERIES.forEach(function (sr) { ser[sr.id] = sr; });
    var hist = "";
    ["martin", "cultura", "flood"].forEach(function (id) {
      var sr = ser[id], list = Letture.ofSeries(id);
      if (!sr || !list.length) return;
      var mineHere = list.some(function (ep) { return readingWeek(ep) <= week && !done[ep.id] && Letture.isOpen(ep, done, state.unlocked); });
      hist += fold("lg:" + id, sr.emoji + " " + esc(sr.name) + (id !== "martin" ? ' <small class="muted">· opcional</small>' : ""), count(list),
        '<p class="muted">' + esc(sr.blurb) + '</p><div class="eps">' + list.map(function (ep) { return epButton(ep, done); }).join("") + "</div>",
        id === "martin" && mineHere, "capa-sub");
    });
    if ((state.storie || []).length) {
      hist += fold("lg:storie", "✨ " + UI.stories, state.storie.length + "",
        '<p class="muted">Cuentos generados con las palabras de tu repaso.</p><div class="eps">' +
        state.storie.map(function (x) {
          var d = done[x.id];
          return '<button class="ep' + (d ? " done" : "") + '" data-ep="' + esc(x.id) + '"><span class="e">✨</span><span><b>' + esc(x.title) +
            "</b><span class=\"muted\">semana " + x.week + " · " + esc(x.targets.join(", ")) + "</span></span>" + (d ? '<span class="score">' + d.pct + "%</span>" : "") + "</button>";
        }).join("") + "</div>", false, "capa-sub");
    }
    var histN = ["martin", "cultura", "flood"].reduce(function (n, id) { return n + Letture.ofSeries(id).length; }, 0);
    if (hist) html += fold("lg:hist", "📖 Historias", histN + " textos", hist);

    var sett = ser.settimana ? Letture.ofSeries("settimana") : [];
    if (sett.length) html += fold("lg:sett", ser.settimana.emoji + " " + esc(ser.settimana.name), count(sett),
      '<p class="muted">' + esc(ser.settimana.blurb) + "</p>" + bySeason("lg:sett", sett));
    var lunghe = Letture.ofSeries("lunga");
    if (lunghe.length && ser.lunga) html += fold("lg:lunga", ser.lunga.emoji + " " + esc(ser.lunga.name), week < 27 ? "🔒 desde la semana 27" : count(lunghe),
      '<p class="muted">' + esc(ser.lunga.blurb) + "</p>" + bySeason("lg:lunga", lunghe));

    if (window.Radio) html += Radio.leggiFold(state, week, sNames);   // la serie Radio, semanas 6-25 (radio.js)
    if (window.Fuera) html += Fuera.leggiFold(state, week, sNames);   // material de afuera, semanas 6-52 (fuera.js)
    // Escuchas: las largas del tramo y la re-escucha de lo ya leído
    var asc = "", TD = window.TRAMO_DATA;
    if (TD && (TD.SETTIMANE || []).length) {
      var tasc = (state.tramo || {}).asc || {};
      var aItems = TD.SETTIMANE.map(function (s) {
        var open = s.week <= week, d = tasc[s.week];
        return { week: s.week, done: !!d, html: '<button class="ep' + (d ? " done" : "") + '" data-trasc="' + s.week + '"' + (open ? "" : " disabled") + ">" +
          '<span class="e">' + (open ? "🎧" : "🔒") + '</span><span><b lang="' + LG.tts + '">' + esc(s.ascolto.title) + "</b>" +
          '<span class="muted">semana ' + s.week + " · " + esc(s.level) + " · " + (open ? '<span lang="' + LG.tts + '">' + esc(s.ascolto.genre) + "</span>" : "se abre en la semana " + s.week) + "</span></span>" +
          (d ? '<span class="score">' + d.pct + "%</span>" : "") + "</button>" };
      });
      asc += '<p class="muted">De la semana 27 en adelante, una escucha larga a dos voces por semana, con preguntas en ' + UI.langEs + ".</p>" +
        (C ? C.seasons("lg:asc", aItems, week, sNames) : "");
    }
    var doneN = Object.keys(done).filter(function (id) { return Letture.byId(id); }).length;
    if (doneN) {
      asc += '<div class="card"><b>🎧 ' + UI.easyListen + '</b><p class="muted">Re-escuchá las ' + doneN + " lecturas que ya hiciste, solo audio, una tras otra: " +
        "material conocido a velocidad normal es lo que hace crecer la fluidez del oído (Chang & Millett 2014). Esta semana: " + listeningWeek() + " min.</p>" +
        '<button class="btn" id="playlib">▶ Escuchar todas</button></div>';
    }
    if (asc) html += fold("lg:asc", "🎧 " + esc((TD && TD.names && TD.names.ascolto) || "Escuchas"), inp.listen + " min en 7 días", asc);

    if (B) html += fold("lg:bib", "📚 " + esc(((window.BIBLIO_DATA || {}).ui || {}).name || "Biblioteca"), B.minutes ? B.minutes(state, 7) + " min en 7 días" : "",
      B.leggiCard().replace(/^<div class="card bx-entry"><h2>[\s\S]*?<\/h2>/, '<div class="bx-entry">'));

    // La velocidad: la curva del año y los textos para releer contra el reloj
    var sp = Letture.speedStore ? Letture.speedStore(state) : null;
    var bestIds = sp ? Object.keys(sp.best).filter(function (id) { return Letture.byId(id); }) : [];
    var lastAt = {};
    if (sp) sp.runs.forEach(function (r) { lastAt[r.id] = Math.max(lastAt[r.id] || 0, r.at); });
    bestIds.sort(function (a, b) { return (lastAt[b] || 0) - (lastAt[a] || 0); });
    html += fold("lg:speed", "⏱️ Tu velocidad de lectura", lastSpeed ? "~" + lastSpeed + " palabras por minuto" : "todavía sin medir",
      '<p class="muted">Cada lectura se cronometra sola: desde que abrís el texto hasta «Terminé». Cuenta si después contestás bien el 70 % o más ' +
        "(leer rápido sin entender no es leer).</p>" +
      (curve.length ? (C ? C.curveSvg(curve) : "") + '<p class="muted small">Palabras por minuto en la primera lectura de cada semana del curso.</p>'
        : '<p class="muted small">Todavía no hay lecturas medidas.</p>') +
      (bestIds.length ? "<h3>Releé para bajar el tiempo</h3><div class=\"eps\">" + bestIds.slice(0, 5).map(function (id) {
        var ep = Letture.byId(id);
        return '<button class="ep" data-ep="' + id + '"><span class="e">⏱️</span><span><b>' + esc(ep.title) + '</b><span class="muted">tu mejor: ' + sp.best[id] + " palabras por minuto</span></span></button>";
      }).join("") + "</div>" : "") +
      '<p class="muted science">🔬 Relectura cronometrada con comprensión controlada (Chang y Millett 2013; Nation 2009): la fluidez lectora crece releyendo lo conocido más rápido.</p>');

    html += '<p class="muted science">🔬 Input comprensible (Krashen) con glosario para cubrir ' +
      "el ~98% del vocabulario (Hu y Nation); después, la caza de formas te hace notar la " +
      "gramática dentro de un texto que ya entendiste (Schmidt).</p>";
    return html;
  }

  var glossIndex = [];

  // Text of an episode as tappable words.  mode "read": glossed words open
  // their meaning; mode "hunt": every word can be selected.
  function renderText(ep, mode, enh) {
    var k = 0;
    glossIndex = [];
    var forms = enh && ep.flood ? ep.flood.forms : null;
    var isForm = function (t) { return forms && (forms.indexOf(Letture.bare(t)) >= 0 || forms.indexOf(Letture.core(t)) >= 0); };
    // Multiple-choice glosses: these words are asked, not told, until answered.
    var mcDone = (state.mcGloss || {})[ep.id] || {}, mc = {};
    if (mode !== "hunt" && Letture.mcTargets) Letture.mcTargets(ep).forEach(function (i) { mc[i] = 1; });
    var toks0 = Letture.allTokens(ep);
    Object.keys(mc).forEach(function (i) { if (mcDone[Letture.core(toks0[i])]) delete mc[i]; });
    return '<div class="text' + (mode === "hunt" ? " hunt" : "") + (enh ? " enh" : "") + '" lang="' + LG.tts + '">' +
      Letture.paragraphs(ep).map(function (par) {
        return "<p>" + Letture.tokens(par).map(function (t) {
          var i = k++;
          if (mode === "hunt") {
            return '<span class="w" data-tok="' + i + '">' + esc(t) + "</span>";
          }
          var g = Letture.glossFor(ep, t);
          if (g && mc[i]) {
            glossIndex[i] = Letture.bare(t) + " — " + g;
            return '<span class="w mcg' + (isForm(t) ? " form" : "") + '" data-k="' + i + '" data-mc="' + i + '" role="button" tabindex="0">' + esc(t) + "</span>";
          }
          if (g) {
            glossIndex[i] = Letture.bare(t) + " — " + g;
            return '<span class="w gl' + (isForm(t) ? " form" : "") + '" data-k="' + i + '" data-gl="' + i + '" role="button" tabindex="0">' + esc(t) + "</span>";
          }
          return '<span class="w' + (isForm(t) ? " form" : "") + '" data-k="' + i + '">' + esc(t) + "</span>";
        }).join(" ") + "</p>";
      }).join("") + "</div>";
  }

  /* Relectura cronometrada (Letture.speedNote / speedCommit): el reloj corre
     desde que se abre el texto hasta «Terminé», sin el tiempo con la
     pantalla oculta; si se usó el karaoke, esa vuelta fue de escucha y no
     se mide. */
  var readClock = null;   // { id, t0, hid, hidAt, kar }
  document.addEventListener("visibilitychange", function () {
    if (!readClock) return;
    if (document.hidden) readClock.hidAt = Date.now();
    else if (readClock.hidAt) { readClock.hid += Date.now() - readClock.hidAt; readClock.hidAt = 0; }
  });
  function readElapsed() { return readClock ? Date.now() - readClock.t0 - readClock.hid - (readClock.hidAt ? Date.now() - readClock.hidAt : 0) : 0; }
  // The questions are over: the time counts if this attempt got 70 % or more.
  function noteReadingSpeed() {
    if (view.screen !== "risultato" || !round || round.kind !== "lettura" || !view.result || !Letture.speedCommit) return;
    var r = Letture.speedCommit(state, round.arg, view.result.pct);
    if (r.why === "none") return;
    persist();
    var msg = r.counted ? "⏱️ Leíste a <b>" + r.wpm + " palabras por minuto</b>" +
        (r.re && r.prev ? (r.wpm > r.prev ? ": ¡más rápido que tu mejor (" + r.prev + ")!" : " (tu mejor: " + r.prev + ").") : ".") +
        " Releelo cuando quieras para bajar el tiempo."
      : r.why === "comp" ? "⏱️ Esta vez el tiempo no cuenta: la comprensión quedó debajo del " + Letture.SPEED_MIN_PCT + " %."
      : r.why === "fast" ? "⏱️ Muy rápido para ser lectura: el tiempo no cuenta."
      : r.why === "audio" ? "⏱️ Con el audio puesto fue escucha: el tiempo de lectura no se mide." : "";
    var host = app().querySelector(".card");
    if (msg && host) { var pEl = document.createElement("p"); pEl.className = "note speed-note"; pEl.innerHTML = msg; host.appendChild(pEl); }
  }

  function renderLettura(ep) {
    stopKaraoke();
    var rate = view.karRate || 1, enh = !!view.enh && !!ep.flood;
    if (!readClock || readClock.id !== ep.id) readClock = { id: ep.id, t0: Date.now(), hid: 0, hidAt: 0, kar: false };
    var best = Letture.speedStore ? Letture.speedStore(state).best[ep.id] : 0;
    return '<button class="btn ghost" id="lback">' + (view.epFrom === "briefing" ? "← a la semana" : "← a " + UI.read) + "</button>" +
      "<h1>" + ep.emoji + " " + esc(ep.title) + "</h1>" +
      '<p class="lead">' + (ep.area ? esc(ep.area) + " · " : ep.series === "flood" ? UI.series.flood + " · " + esc(ep.grammar) + " · " :
        ep.series === "settimana" ? UI.series.settimana + " · " + esc(ep.grammar) + " · " :
        ep.series === "lunga" ? '<span lang="' + LG.tts + '">' + esc(ep.genre) + "</span> · " + esc(ep.grammar) + " · " : UI.series.main + " · episodio " + ep.n + " · ") +
        esc(ep.level) + "</p>" +
      (enh ? '<div class="note flood">🌊 Segunda lectura: <b>' + esc(ep.flood.es) + "</b> Mirá cada forma resaltada y preguntate por qué está así. " +
        '<button class="tab" id="enhoff">sin marcas</button></div>' : "") +
      '<div class="card">' + renderText(ep, "read", enh) +
        '<p class="muted small">Las palabras <span class="w mcg">así</span> te las pregunto: tocalas y elegí qué significan por el contexto. Las <span class="w gl">subrayadas</span> te las digo.</p>' +
        '<div class="karbar">' +
          '<button class="btn" id="karplay">🎧 ' + UI.karaoke + "</button>" +
          '<span class="seg">' + [[0.8, "0,8×"], [1, "1×"], [1.15, "1,15×"]].map(function (r) {
            return '<button class="tab' + (rate === r[0] ? " on" : "") + '" data-rate="' + r[0] + '">' + r[1] + "</button>";
          }).join("") + "</span>" +
          '<span class="seg"><button class="tab on" data-karmode="full">texto</button>' +
            '<button class="tab" data-karmode="partial">solo claves</button>' +
            '<button class="tab" data-karmode="audio">solo audio</button></span>' +
        "</div>" +
        '<p class="muted small">Primera pasada con el texto a 0,8×, segunda a 1× solo con las palabras clave, tercera solo audio: la escucha ' +
        "cuenta como input y suma xp. Esta semana llevás " + listeningWeek() + " min de escucha.</p></div>" +
      (ep.flood && !enh ? '<button class="btn wide ghost" id="enh">🌊 Segunda lectura con la estructura resaltada</button>' : "") +
      '<p class="muted small speed-line">⏱️ El reloj corre desde que abriste el texto: cuando termines, tocá «Terminé». ' +
        (best ? "Tu mejor en este texto: <b>" + best + " palabras por minuto</b>." : "Cuenta si después entendiste el " + Letture.SPEED_MIN_PCT + " % o más.") + "</p>" +
      '<button class="btn wide" id="lquiz">Terminé → preguntas y caza de formas</button>';
  }

  /* Toque en la palabra: cualquier palabra de la lengua en un ejercicio muestra
     qué significa (data/glossario.json, armado por build_course.py).  Las que
     todavía no viste en el curso van subrayadas.  No en los ejercicios que
     preguntan justamente el significado, ni en los enunciados en castellano. */
  var glossario = null;
  var stemGloss = [];

  function glossable(it) {
    if (!glossario || !it || it.type === "translate" || it.type === "listen" ||
        it.type === "dictation" || it.src === "frasi") return false;
    return !/signific|traduc|qué quiere decir|qué expresa|cómo suena|se pronuncia/i.test(it.prompt || "");
  }

  function glossify(it, raw) {
    raw = String(raw || "");
    if (!glossable(it)) return esc(raw);
    var week = Math.min(state.unlocked || 1, NW());
    return raw.split(/([A-Za-zÀ-ÿ]+)/).map(function (t, k) {
      if (k % 2 === 0) return esc(t);
      var g = glossario[t.toLowerCase()];
      if (!g) return esc(t);
      stemGloss.push(g[0] + " — " + g[1]);
      return '<span class="w gl' + (g[2] > week ? " new" : "") + '" data-sg="' +
        (stemGloss.length - 1) + '">' + esc(t) + "</span>";
    }).join("");
  }

  // Text of the language that is not a stem (the solution in the feedback): every
  // word tappable, the ones not yet seen underlined.
  function glossifyAny(raw) {
    raw = String(raw || "");
    if (!glossario) return esc(raw);
    var week = Math.min(state.unlocked || 1, NW());
    return raw.split(/([A-Za-zÀ-ÿ]+)/).map(function (t, k) {
      if (k % 2 === 0) return esc(t);
      var g = glossario[t.toLowerCase()];
      if (!g) return esc(t);
      stemGloss.push(g[0] + " — " + g[1]);
      return '<span class="w gl' + (g[2] > week ? " new" : "") + '" data-sg="' +
        (stemGloss.length - 1) + '">' + esc(t) + "</span>";
    }).join("");
  }

  /* A multiple-choice gloss: three meanings, the one that fits the context.
     The word then becomes an ordinary gloss, and goes to the review when the
     bank knows it (Yanagisawa, Webb & Uchihara 2020). */
  function askGloss(span) {
    var ep = Letture.byId(view.ep);
    if (!ep) return;
    var i = +span.dataset.mc, tok = Letture.allTokens(ep)[i];
    var o = Letture.mcOptions(ep, tok);
    var box = $("#mcbox");
    if (!box) { box = document.createElement("div"); box.id = "mcbox"; box.className = "mcbox"; document.body.appendChild(box); }
    box.innerHTML = '<p class="muted small">Por el contexto, ¿qué significa?</p><p class="it"><b>' + esc(Letture.bare(tok)) + "</b></p>" +
      '<div class="options">' + o.options.map(function (x, k) { return '<button class="opt" data-mco="' + k + '">' + esc(x) + "</button>"; }).join("") + "</div>" +
      '<button class="tab" id="mcclose">cerrar</button>';
    box.classList.add("on");
    on("#mcclose", function () { box.classList.remove("on"); });
    box.querySelectorAll("[data-mco]").forEach(function (b) {
      b.onclick = function () {
        var ok = o.options[+b.dataset.mco] === o.answer;
        box.querySelectorAll("[data-mco]").forEach(function (x) {
          x.disabled = true;
          if (o.options[+x.dataset.mco] === o.answer) x.classList.add("right"); else if (x === b) x.classList.add("wrong");
        });
        if (ok) fx.right(); else fx.wrong();
        if (!state.mcGloss) state.mcGloss = {};
        (state.mcGloss[ep.id] || (state.mcGloss[ep.id] = {}))[o.word] = ok ? 2 : 1;
        var g = glossario && glossario[o.word], lemma = g ? g[0] : o.word;
        if (window.Banca && Banca.loaded() && Banca.hasWord(lemma)) {
          var id = "b:voc:" + lemma;
          state.cards[id] = Engine.schedule(state.cards[id], ok ? 2 : 0, { id: id, state: state, kind: ok ? null : "vocab" });
        }
        gain(ok ? 3 : 1);
        persist();
        span.classList.remove("mcg"); span.classList.add("gl");
        span.removeAttribute("data-mc"); span.dataset.gl = i;
        span.onclick = function () { showGloss(glossIndex[i]); speak(Letture.bare(span.textContent), false); };
        setTimeout(function () { box.classList.remove("on"); }, ok ? 900 : 1800);
      };
    });
  }

  function showGloss(txt) {
    var box = $("#glossbox");
    if (!box) {
      box = document.createElement("div");
      box.id = "glossbox";
      box.className = "glossbox";
      document.body.appendChild(box);
    }
    box.textContent = txt;
    var withRef = window.Referencia && Referencia.onGloss(box, txt);   // «¿Cómo se usa?» (referencia.js)
    box.classList.add("on");
    clearTimeout(showGloss.t);
    showGloss.t = setTimeout(function () { box.classList.remove("on"); }, withRef ? 6000 : 3200);
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
    if (A && b.fig && window.Mapas) html += Mapas.figure(b.fig);

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
  /* The forms of the tenses a week teaches (conjugator): the subjunctive
     week marks sia, abbia / seja, tenha… in its examples.  Only weeks about
     a tense, and minus the forms the present shares. */
  var tenseForms = {};
  // The persons the language does not use (LANG.rules.persons.skip: vós).
  var SKIP_PERSONS = ((LG.rules || {}).persons || {}).skip || [];
  function weekTenseForms(w) {
    if (!w || tenseForms[w.week]) return (w && tenseForms[w.week]) || [];
    var ts = (w.tenses || []).filter(function (t) { return (t !== "presente" || w.week === 5 || w.week === 6) && (!Conj.TENSE_LABELS || Conj.TENSE_LABELS[t]); });
    var out = {}, pres = {};
    if (ts.length && ts[0] !== "presente") Object.keys(Conj.VERBS).forEach(function (v) {
      try { Conj.conjugate(v, "presente").forEach(function (f) { pres[f.toLowerCase()] = 1; }); } catch (e) { /* */ }
    });
    ts.forEach(function (t) {
      Object.keys(Conj.VERBS).forEach(function (v) {
        try {
          Conj.conjugate(v, t).forEach(function (f, pi) {
            if (SKIP_PERSONS.indexOf(pi) >= 0) return;          // vós: never marked
            String(f).toLowerCase().split(/\s+/).forEach(function (x) { if (x.length >= 2 && !pres[x] && !HL_STOP[x]) out[x] = 1; });
          });
        } catch (e) { /* un verbo sin ese tiempo */ }
      });
    });
    return (tenseForms[w.week] = Object.keys(out));
  }
  function renderLook(b, i) {
    var fs = Lezione.forms(b).concat(les && les.w ? weekTenseForms(les.w) : []);
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
    if (b.fig && window.Mapas) html += Mapas.figure(b.fig);
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

    if (window.Formule) {
      var fb = Formule.bridge(w.week, state.cards);
      if (fb.length) html += '<section class="blk formule">' + formuleBridgeHtml(fb.map(function (x) { return x.f.id; }), w.week) + "</section>";
    }
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
    var isWord = function (word) { return !!(glossario && glossario[String(word).toLowerCase()]); };
    var ss = sessionsOf(w);
    // the first session not yet read (or the first one again)
    if (sess == null || isNaN(sess) || !ss[sess]) { sess = nextSession(w); if (sess == null) sess = 0; }
    var cur = ss[sess];
    les = { w: w, sess: sess, part: cur ? cur.part : null,
            steps: Lezione.steps(w.lesson, Math.random, w.week, isWord, cur ? cur.blocks : null),
            i: 0, right: 0, asked: 0, answered: false };
    // «Ya lo venías usando»: the phrases that used this week's grammar as a formula
    if (window.Formule) Formule.addStep(les.steps, w.week, state.cards);
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
    if (st.kind === "formule") {
      return hudH + '<div class="card lescard formule">' + formuleBridgeHtml(st.ids, w.week) +
        '<button class="btn wide" id="lesnext">Seguir →</button></div>';
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
      (q.fig && window.Mapas ? Mapas.figure(q.fig, { bare: true }) : "") +
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

  /* El camino manda: todo lo que trae una semana (lección, palabras,
     entrenamiento, frases, lectura, laboratorio) es una misión de la semana,
     en orden.  Las pestañas de entrenar y leer quedan como atajos libres,
     pero el camino ordenado es este. */
  // The week of each rule of Ponte: the rule's own «week» (LAB_DATA) or, if
  // it has none, its place in the list from week 2; the false friends come
  // in Lab.FALSI_WEEK.
  function ponteWeek(r, k) { return +r.week || Math.min(10, 2 + k); }
  function falsiWeek() { return (window.Lab && +Lab.FALSI_WEEK) || 0; }

  // Martín's episodes open in order: an episode never lands before the one
  // that precedes it in the story.
  function readingWeek(ep) {
    if (ep.series !== "martin") return ep.week;
    var wk = 1;
    Letture.ofSeries("martin").forEach(function (e) { if (e.n <= ep.n) wk = Math.max(wk, e.week); });
    return wk;
  }

  var FALSI_GOAL = 20;   // the false friends of the mission (two rounds of ten)
  function weekPlan(w) {
    var st = weekStat(w.week), out = [];
    var pct = st.attempts ? Math.round(st.right / st.attempts * 100) : 0;
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
      if (w.week === FINAL() && window.EsameData) m({ kind: "play", done: st.bossPassed, ico: "🎓", title: UI.examC1,
          sub: EX.missionSub, cls: "boss" });
      else m({ kind: "play", done: st.bossPassed, ico: "⚔️", title: "Vencé al " + UI.boss,
          sub: "Un examen por destreza: una lectura, una escucha, producción escrita y estructuras. 85 % en total y 55 % en cada una. " +
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
    if (window.Scrivi && Scrivi.TASKS[w.week]) {
      // besides its own structures, one of the month before (reglas.js)
      if (window.Reglas) Reglas.scriviExtra(state, w.week);
      var sd = (state.scritti || {})[w.week], task = Scrivi.TASKS[w.week];
      // Weeks 27-51: the task of the tramo is the week's writing and asks for
      // these structures too (Tramo.evaluate, «struct»); the short text stays,
      // optional (audit F §2.2).
      var inTramo = !!(window.Tramo && Tramo.week && Tramo.week(w.week) && !w.boss);
      m({ kind: "scrivi", done: !!sd, ico: "✍️", opt: inTramo || undefined, title: UI.scrivi + (inTramo ? ": texto corto (opcional)" : ": tu texto de la semana"),
          sub: sd ? "Entregado · " + sd.n + " palabras" + (sd.errs ? " · " + sd.errs + " cosas para revisar" : " · sin errores marcados")
                  : task.min + " palabras o más · " + task.use.map(function (u) { return u[2]; }).join(" · ") });
    }
    if (window.Drills && window.Frasi) Drills.scenesOfWeek(w.week).forEach(function (sc) {
      // the scene: 60 % of its phrases firm (back three days apart or more), not only seen
      var p = Frasi.progress(sc.id, state.cards), firm = p.total ? p.strong >= Math.ceil(p.total * 0.6) : true;
      m({ kind: "scene", arg: sc.id, done: p.seen >= p.total && firm, half: p.seen >= p.total && !firm, ico: sc.emoji, title: "Frases: " + sc.name,
          sub: p.seen + " / " + p.total + " frases · " + (p.seen >= p.total && !firm ? "Te falta: " + (Math.ceil(p.total * 0.6) - p.strong) +
            " frases firmes (vuelven con días de por medio: repasalas en días distintos) · " : p.seen >= p.total ? p.strong + " firmes · " : "") + sc.blurb });
    });
    if (window.Letture) Letture.SERIES.forEach(function (sr) {
      Letture.ofSeries(sr.id).forEach(function (ep) {
        if (readingWeek(ep) !== w.week) return;
        var d = (state.letture || {})[ep.id];
        // Martín, «La settimana» and the long reading are part of the week;
        // culture and the input floods are optional for real (they said so
        // and still held the next week closed)
        var optional = ep.series !== "martin" && ep.series !== "settimana" && ep.series !== "lunga";
        // read with 70 % of comprehension, or read again
        // read with 70 %, or again with 40 %, or a third time (Engine.passed, 3.1)
        var readOk = !!d && Engine.passed(d, 70, d.n || 1);
        m({ kind: "ep", arg: ep.id, done: readOk, half: !!d && !readOk, ico: ep.emoji, opt: optional,
            title: (ep.series === "settimana" ? "Lectura y comprensión: " : ep.series === "lunga" ? "Lectura larga: " : ep.series === "martin" ? "Lectura: " : "Cultura: ") + ep.title,
            sub: d ? "Leída · " + d.pct + "%" + (readOk ? "" : " · " + Engine.passMissing(d, 70, d.n || 1)) : esc(ep.level) + " · " + (ep.series === "lunga" ? esc(ep.genre) + " · " + Letture.allTokens(ep).length + " palabras, preguntas en " + UI.langEs
                   : esc(ep.area || ep.grammar || "")) +
                 (optional ? " · opcional" : "") });
      });
    });
    if (window.Tramo) Tramo.missions(w, state).forEach(m);   // tramo C1 (tramo.js): escucha larga y tarea
    if (window.Radio) Radio.missions(w, state).forEach(m);   // la serie Radio de las semanas 6-25 (radio.js)
    if (window.Fuera) Fuera.missions(w, state).forEach(m);   // fuera de la app, opcional (fuera.js)
    if (window.Seminario) Seminario.missions(w, state).forEach(m);   // el seminario y los dilemas de la semana (seminario.js)
    if (window.Trabajo) Trabajo.missions(w, state).forEach(m);   // la escena de trabajo de la semana, opcional (trabajo.js)
    if (window.Lab) {
      Lab.RULES.forEach(function (r, k) {
        if (ponteWeek(r, k) !== w.week) return;
        var p = Lab.progress("ponte:" + r.id + ":", state.cards);
        m({ kind: "ponte", arg: r.id, done: p.seen >= p.total, ico: "🌉", title: "Ponte: " + r.h,
            sub: p.seen + " / " + p.total + " palabras que ya sabés del español" });
      });
      if (w.week === falsiWeek()) {
        // two rounds of ten: the rest of the list keeps coming in the pause
        // and in the review (in Portuguese they are more than a hundred)
        var pf = Lab.progress("falso:", state.cards), fGoal = Math.min(pf.total, FALSI_GOAL);
        m({ kind: "falsi", done: pf.seen >= fGoal, ico: "🪤", title: UI.falsi,
            sub: Math.min(pf.seen, fGoal) + " / " + fGoal + " palabras que parecen y no son" + (pf.total > fGoal ? " · " + pf.total + " en la lista" : "") });
      }
      Lab.CAPIRE.forEach(function (c) {
        if (c.week !== w.week) return;
        // 80 % in a session (the ones played before this version: seen is enough)
        var pc = Lab.progress("capire:" + c.id + ":", state.cards, w.week), cp = (state.capirePct || {})[c.id];
        var capOk = pc.seen >= pc.total && (cp == null || cp >= 80);
        m({ kind: "capire", arg: c.id, done: capOk, half: pc.seen >= pc.total && !capOk, ico: "🎯", title: UI.capire + ": " + c.h,
            sub: pc.seen + " / " + pc.total + (cp != null ? " · tu mejor: " + cp + " %" : "") +
              (capOk ? "" : pc.seen < pc.total ? " · Te falta: ver " + (pc.total - pc.seen) + " más" : " · Te falta: 80 % en una sesión") + " · leer la gramática antes de producirla" });
      });
    }
    if (window.Banca && Banca.loaded()) {
      var bankDone = function (rx) { return Object.keys(state.cards).filter(function (k) { return rx.test(k); }).length >= 8; };
      // Identificar: armar las formas (contracciones, artículos, plurales) y
      // encontrar el error, cada semana; hechas con 70 % en una ronda
      // lanzada desde la semana (en la semana de las formas, obligatoria)
      var ident = function (kind) { return ((state.identPct || {})[w.week] || {})[kind]; };
      var identSub = function (kind, txt) { var p = ident(kind); return (p >= 70 ? "Hecha · " + p + " % · " : p != null ? "Tu mejor: " + p + " % · Te falta: 70 % · " : (w.week === Banca.FORME_WEEK && kind === "b-forme" ? "" : "Opcional · ")) + txt; };
      if (w.week === Banca.FORME_WEEK) {
        var fp = ident("b-forme");
        m({ kind: "b-forme", arg: "w:" + w.week, done: fp >= 70 || bankDone(/^b:(art|pl|prep|agg|acc)/), half: fp != null && fp < 70,
            ico: "🧩", title: UI.forme + ": armá artículos y contracciones", sub: identSub("b-forme", UI.formeMission) });
      }
      // lo que más le cuesta a este alumno (sus errores), para reconocer
      if (w.week > Banca.FORME_WEEK) {
        var wk2 = Banca.weakest(state, 2), ip2 = ident("b-ident");
        m({ kind: "b-ident", arg: "w:" + w.week, done: ip2 >= 70, half: ip2 != null && ip2 < 70, opt: true, ico: "🎯", title: "Lo que más te cuesta",
            sub: identSub("b-ident", (wk2.length ? "Tus puntos flojos: " + wk2.map(function (x) { return ((Diagnosi.LABEL || {})[x.cat] || x.cat).toLowerCase(); }).join(", ")
                                                  : "Preposiciones, contracciones y artículos") + ". Preposiciones, pronombres, conectores, el verbo justo, falsos amigos y cuál está bien.") });
      }
      if (w.week >= Banca.ERR_WEEK) {
        var ep2 = ident("b-err");
        m({ kind: "b-err", arg: "w:" + w.week, done: ep2 >= 70, half: ep2 != null && ep2 < 70, opt: true, ico: "🔍", title: UI.err,
            sub: identSub("b-err", "Tocá la palabra que está mal y corregila: el error típico de un hispanohablante.") });
      }
      if (w.week === Banca.TR_WEEK) m({ kind: "b-tr", done: bankDone(/^b:tr:/), ico: "✍️", title: "Banco: " + UI.tr,
        sub: "Oraciones del español al " + UI.langEs + ", con corrección que explica el error." });
      if (w.week === Banca.GAP_WEEK) m({ kind: "b-gap", done: bankDone(/^b:gap:/), ico: "🔧", title: "Banco: " + UI.gap,
        sub: "El verbo justo dentro de una oración real." });
    }
    if (window.Suoni && Suoni.data() && w.week <= 40) {
      var sp = Suoni.progress(w.week, state.cards), sdone = !!(state.suoniDone || {})[w.week], spct = (state.suoniPct || {})[w.week];
      m({ kind: "suoni", done: sdone, half: !sdone && spct != null, ico: "🎧", title: UI.suoni + ": el oído",
          sub: (sdone ? "Hecha · " : spct != null ? "Tu mejor: " + spct + " % · Te falta: 70 % · " : "Con 70 % queda hecha · ") +
            "pares mínimos, habla conectada, entonación y un dictado · " + sp.seen + " / " + sp.total + " pares oídos" });
    }
    if (window.Suoni && Suoni.dgFor(w.week)) {
      var dgt = Suoni.dgFor(w.week), dgd = (state.dictogloss || {})[w.week];
      m({ kind: "dictogloss", done: !!dgd, ico: "📝", title: "Dictogloss: " + dgt.title,
          sub: dgd ? "Hecho · " + dgd.found + " / " + dgd.n + " bloques recuperados" : "Escuchalo dos veces, anotá y reconstruilo: seis bloques a recuperar" });
    }
    if (aiKey() && w.week >= 3) {
      var pl = (state.parlaLog || {})[w.week];
      m({ kind: "parla", done: !!pl, ico: "🗣️", title: UI.parla + ": role-play con la IA", opt: true,
          sub: pl ? "Hecho · " + pl.obj + " / 3 objetivos en " + pl.turns + " turnos" : "Opcional · un personaje, tres objetivos, tu " + UI.langEs + " escrito; la IA te corrige al final" });
      // (The AI story of the week gave way to a text written by hand for
      // every week: «La settimana» / «A semana», in Leggi / Ler and as the week's reading.)
    }
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
  // The weeks of the course (the ones written so far; Engine.weeks()), and
  // the week of the final exam (Engine.finalWeek(): the last of the syllabus).
  function NW() { return course && course.weeks && course.weeks.length || Engine.weeks(); }
  function FINAL() { return Engine.finalWeek(); }
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
    else if (kind === "play") {
      if (w.week === FINAL() && window.EsameData) { view.screen = "esame"; render(); window.scrollTo(0, 0); }
      else startRound(w.boss ? "boss" : "round");
    }
    else if (kind === "play2") startRound("domina");
    else if (kind === "debil") startRound("debil");
    else if (kind === "scrivi") { view.screen = "scrivi"; render(); window.scrollTo(0, 0); }
    else if (kind === "scene" || kind === "ponte" || kind === "falsi" || kind === "capire" ||
             kind === "b-forme" || kind === "b-tr" || kind === "b-gap" || kind === "b-err" || kind === "b-ident") startRound(kind, arg);
    else if (kind === "ep") { view.ep = arg; view.epFrom = "briefing"; view.screen = "lettura"; render(); window.scrollTo(0, 0); }
    else if (kind === "suoni") startRound("suoni", w.week);
    else if (kind === "duello") startRound("duello", arg);
    else if (kind === "dictogloss") { dg = null; view.screen = "dictogloss"; render(); window.scrollTo(0, 0); }
    else if (kind === "parla") { view.screen = "parla"; render(); window.scrollTo(0, 0); }
    else if (kind === "storia") { view.screen = "storia"; render(); window.scrollTo(0, 0); }
    else if (window.Escritos && Escritos.handles(kind)) Escritos.go(kind, arg);
    else if (window.Tramo && Tramo.handles(kind)) Tramo.go(kind, arg);
    else if (window.Capas && Capas.handles(kind)) Capas.go(kind, arg);
    else if (window.Fuera && Fuera.handles(kind)) Fuera.go(kind, arg);
    else if (window.Seminario && Seminario.handles(kind)) Seminario.go(kind, arg);
    else if (window.Trabajo && Trabajo.handles(kind)) Trabajo.go(kind, arg);
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
      (w.boss ? "" : '<button class="tab" id="gym">🏋️ Gimnasio de verbos</button>') +
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

  /* «Para practicar más»: what lived only in Allena and Leggi and no
     mission brings, inside the week of the percorso (3.3: the percorso
     organises the app, and what sat in another tab went unseen).  Optional:
     it does not count to open the week.  The same buttons as in the tabs. */
  function weekExtrasHtml(w) {
    if (!w || w.week > (state.unlocked || 1)) return "";
    var U = state.unlocked || 1, groups = [];
    var btn = function (attr, emoji, name, desc) {
      return '<button class="lab" ' + attr + '><span class="e">' + emoji + "</span><b>" + name + '</b><span class="muted">' + desc + "</span></button>";
    };
    var errs = [];
    var weak = Banca.loaded() ? Banca.weakest(state, 2) : [];
    if (weak.length) errs.push(btn('data-bank="clinica"', "🩺", "Clínica de tus errores",
      "Práctica con lo que más te cuesta: " + weak.map(function (x) { return esc(((Diagnosi.LABEL || {})[x.cat] || x.cat).toLowerCase()); }).join(", ") + "."));
    if (Banca.loaded() && U >= Banca.ERR_WEEK) errs.push(btn('data-bank="b-err"', "🔍", esc(UI.err), "Encontrá y corregí el error típico de un hispanohablante."));
    if (errs.length) groups.push(["Tus errores", errs]);
    var words = [];
    if (Banca.loaded() && U >= 2) words.push(btn('data-bank="b-voc"', "📚", UI.words, "Vocabulario de tu nivel: primero reconocer, después escribir."));
    if (matureWords().length >= 30) words.push(btn('id="lampoparole"', "🧠", UI.wordOrNot, "Reconocer en un segundo · récord: " + ((state.best || {}).lampoParole || 0)));
    if (Frasi.ALL.filter(function (x) { return state.cards[x.id]; }).length >= 12)
      words.push(btn('id="lampo"', "⚡", UI.lampo + " 60″", "Frases a toda velocidad · récord: " + ((state.best || {}).lampo || 0)));
    if (words.length) groups.push(["Palabras y frases", words]);
    var write = [];
    if (Banca.loaded()) {
      if (U >= Banca.TR_WEEK) write.push(btn('data-bank="b-tr"', "✍️", UI.tr, "Del español al " + UI.langEs + ", con corrección que explica el error."));
      if (U >= Banca.GAP_WEEK) write.push(btn('data-bank="b-gap"', "🔧", UI.gap, "El verbo justo dentro de una oración real."));
      if (U >= Banca.FORME_WEEK) write.push(btn('data-bank="b-forme"', "🧩", UI.forme, UI.formeSub));
    }
    if (write.length) groups.push(["Escribir", write]);
    var input = [];
    var doneIds = Object.keys(state.letture || {}).filter(function (id) { return Letture.byId(id); });
    if (doneIds.length) input.push(btn('id="playlib"', "🎧", UI.easyListen, "Re-escuchá las " + doneIds.length + " lecturas que ya hiciste, solo audio, una tras otra."));
    var sp = Letture.speedStore ? Letture.speedStore(state) : null, best = sp ? Object.keys(sp.best).filter(function (id) { return Letture.byId(id); }) : [];
    if (best.length) {
      var id0 = best[best.length - 1], ep0 = Letture.byId(id0);
      input.push(btn('data-ep="' + esc(id0) + '"', "⏱️", "Releé contra el reloj", esc(ep0.title) + " · tu mejor: " + sp.best[id0] + " palabras por minuto"));
    }
    if (input.length) groups.push(["Leer y escuchar", input]);
    if (window.TresLenguas) groups.push(["Las tres lenguas", [btn('data-tres="menu"', "🔀", "Tres lenguas", "Las tres lenguas que manejás: dónde se parecen y dónde te traicionan.")]]);
    if (!groups.length) return "";
    return '<div class="card wextras"><h2>🧰 Para practicar más</h2>' +
      '<p class="muted small">Opcional: no hace falta para abrir la semana siguiente. Todo junto, de todas las semanas, está en ' + esc(UI.me) + " → Todo el material.</p>" +
      groups.map(function (g) { return "<h3>" + g[0] + '</h3><div class="labs">' + g[1].join("") + "</div>"; }).join("") + "</div>";
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
      weekExtrasHtml(w) +
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
  var WITH_LIVES = { round: 1, boss: 1, gym: 1 };
  // Only these rounds count towards unlocking the next grammar week.
  var WEEK_KINDS = { round: 1, gym: 1, pausa: 1, vocab: 1, giorno: 1, debil: 1, domina: 1 };
  // Rounds whose answers count as the week's progress (review mixes weeks).
  var COUNT_KINDS = { round: 1, gym: 1, pausa: 1, boss: 1, vocab: 1, giorno: 1, debil: 1, domina: 1 };

  /* Las cuatro cuerdas de Nation (la guía): input, output, forma, fluidez. */
  function strandOf(it, kind) {
    if (it.unamas) return "output";      // «Ahora vos: una más» is writing practice (unamas.js)
    if (kind === "lettura" || kind === "capire" || kind === "suoni" || it.type === "listen" || it.type === "dictation" || SAY_TYPES[it.type]) return "input";
    if (it.type === "write" || it.type === "translate" || it.type === "typed" || it.type === "fixerr" || it.type === "combina" || kind === "b-tr") return "output";
    if (kind === "scene" || it.type === "flash") return "fluidez";
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
    else if (kind === "scene") {
      if (Drills.sceneWeek(arg) > (state.unlocked || 1)) { toast("Se abre en la semana " + Drills.sceneWeek(arg) + "."); return; }
      items = Frasi.sceneSession(arg, state.cards, drillOpts());
    }
    else if (kind === "pausa") {
      w = course.weeks[Math.min(state.unlocked, NW()) - 1];
      view.week = w.week;
      // Grammar only from lessons already read: before lesson 1 the
      // coffee break is phrases and words, never a conjugation table.
      var taught = null;
      for (var tw = Math.min(state.unlocked, NW()); tw >= 1; tw--) {
        if (lessonRead(tw)) { taught = course.weeks[tw - 1]; break; }
      }
      items = Drills.buildPausa(course, state, taught, drillOpts());
      if (Banca.loaded() && taught && taught.week >= 2) {
        var bi = Banca.pausaItem(state);
        if (bi) items.splice(Math.min(5, items.length), 0, bi);
      }
      // one listening item (a pair, a bit of connected speech), never in the office
      if (!state.silent && window.Suoni && Suoni.data()) {
        var si = Suoni.randomItem(state, taught ? taught.week : 1);
        if (si) items.splice(Math.min(3, items.length), 0, si);
      }
      // escritura guiada, con poco peso: a veces un ítem (escritos.js)
      var ei = window.Escritos && Escritos.pausaItem(state, taught ? taught.week : 0);
      if (ei) items.splice(Math.min(6, items.length), 0, ei);
    } else if (kind === "gym") {
      items = [];
      for (var i = 0; i < 15; i++) {
        var v = w.verbs[Math.floor(Math.random() * w.verbs.length)];
        var t = w.tenses[Math.floor(Math.random() * w.tenses.length)];
        try {
          items.push(i % 3 === 0 ? Drills.conjugationDrill(v, t, w.known, w.persons)
                                 : Drills.conjugationTyped(v, t, w.persons));
        } catch (e) { /* salta */ }
      }
      items = Drills.firstRecognize(items, state, w.week);
    } else if (kind === "vocab") items = Drills.withWordIntros(Drills.vocabSession(course, w, state, 14), state);
    else if (kind === "ponte") items = Lab.ponteSession(state.cards, arg);
    else if (kind === "falsi") items = Lab.falsiSession(state.cards);
    else if (kind === "capire") items = Lab.capireSession(state.cards, arg, state.unlocked);
    else if (kind === "lettura") {
      var epL = Letture.byId(arg);
      items = Letture.session(epL);
      if (epL && epL.series === "ai") items = items.slice(0, -1).concat(storyCloze(epL), items.slice(-1));
    }
    // From the week's mission: that week's pairs (the ones its counter
    // counts); from Allena / Treino: everything up to where the learner got.
    else if (kind === "suoni") items = Suoni.session(state, arg || Math.min(state.unlocked, NW()), { silent: state.silent });
    else if (kind === "ritorno") items = ritornoItems();
    else if (kind === "dos") items = dosItems();
    else if (kind === "esame") {
      items = esameItems(arg);   // the version's (the exam, below)
    }
    else if (kind === "micro") items = Drills.buildReview(course, state, 5, drillOpts());
    else if (kind === "duello") items = window.Duelli ? Duelli.session(arg, state.cards) : [];
    else if (kind === "variaciones") items = window.Escritos ? Escritos.variaciones(state, arg, course) : [];
    // a scene of the work route: its phrases or its production items (trabajo.js)
    else if (kind === "trabajo") items = window.Trabajo ? Trabajo.session(arg, state, { silent: state.silent }) : [];
    else if (kind === "b-voc") items = Banca.vocabSession(state, 12);
    else if (kind === "b-freq") items = Banca.vocabSessionFor(state, freqGaps(24), 12);
    else if (kind === "b-forme") items = Banca.formsSession(state, 12);
    else if (kind === "b-tr") items = Banca.translateSession(state, 8);
    else if (kind === "lista") items = (arg || []).slice();       // the items given (__test.play)
    else if (kind === "b-gap") items = Banca.gapSession(state, 10);
    else if (kind === "b-err") items = Banca.errorSession(state, 8);
    else if (kind === "b-ident") items = Banca.weakSession(state, 12);
    else if (kind === "clinica") items = Banca.clinicaSession(state, 12);
    // after the placement test: where Spanish gets in the way (ubicacion.js)
    else if (kind === "diag") items = window.Ubicacion && Ubicacion.diagnosis ? Ubicacion.diagnosis(state) : [];
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
    // the real voices of the pairs, looked up while the round starts
    if (window.Voci) Voci.prefetch(items.filter(function (x) { return x.type === "coppia" && !(LG.realVoiceSkip || {})[x.cat]; })
      .map(function (x) { return x.say; }));

    round = {
      kind: kind,
      arg: arg,
      // A round that starts from the week (its briefing, its challenges, its
      // lesson's «A entrenar», a reading opened from it) goes back to the week.
      from: view.screen === "briefing" || view.screen === "sfide" || view.screen === "lezione" ||
            (view.screen === "lettura" && view.epFrom === "briefing") ? "briefing" :
            view.screen === "lettura" && view.epFrom === "hoy" ? "hoy" : null,
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

  // Items of the listening module: the audio is the question.
  var SAY_TYPES = { coppia: 1, conta: 1, scegli: 1, intonazione: 1, accento: 1, forma: 1 };
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
    stemGloss = [];
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
      : glossify(it, it.stem).replace(/_{3,}/g, function () {
        return multi ? '<span class="gap n">' + (++gi) + "</span>" : '<span class="gap">&nbsp;</span>';
      });
    var prompt = (it.retry ? '<div class="badge-new">🔁 Segunda vez, más fácil</div>' : "") +
      (it.unamas && window.UnaMas ? UnaMas.badge(it) : "") +
      '<div class="prompt">' + esc(DV ? DV.plain(it.prompt || "") : it.prompt || "") + "</div>" +
      (it.type === "guess" ? formulaHtml(it.frase) : "") +
      // a check of the lesson missed comes back with its rule in sight
      (it.ruleShown ? '<div class="note">📐 ' + mk(it.ruleShown) + "</div>" : "") +
      (it.ruleReview && it.novel ? '<div class="muted small">🧭 Una regla de la semana ' + (Reglas.parse(it.rule) || {}).week + ", en una oración nueva</div>" : "") +
      // the second time, the rule with the answer covered: it shows after answering
      (function () {
        if (!it.retry || !it.note || it.recog || !DV) return "";
        var rn = DV.retryNote(it);
        return rn ? '<div class="note">📐 ' + mk(DV.plain(rn)) + "</div>" : "";
      })();

    if (it.type === "intro") {
      return hud() + '<div class="card intro">' +
        '<div class="badge-new">✨ ' + esc(it.prompt) + (it.afterGuess ? " · la que acabás de adivinar" : "") + "</div>" +
        '<div class="fit big">' + esc(it.frase.it) + "</div>" +
        '<div class="fes">' + esc(it.frase.es) + "</div>" +
        formulaHtml(it.frase) +
        (it.note ? '<div class="call tip"><b>Cómo se arma</b><p>' + mk(it.note) + "</p></div>" : "") +
        desgloseHtml(it.frase.t || it.frase.it, true) +
        '<div class="row" style="margin-top:14px">' +
          '<button class="btn ghost" id="sayit">🔊 Escuchar</button>' +
          '<button class="btn ghost" id="slow">🐢 Lento</button>' +
        "</div>" +
        '<p class="muted">Leela dos veces y fijate cómo se arma: ' +
          "en un rato la vas a reconocer y a armar con fichas.</p>" +
        '<button class="btn wide" id="next">La tengo →</button>' +
        "</div>";
    }

    if (it.type === "word") {
      var wv = it.word;
      return hud() + '<div class="card intro">' +
        '<div class="badge-new">📚 Palabra nueva</div>' +
        '<div class="fit big">' + esc(wv[0]) + "</div>" +
        '<div class="fes">' + esc(wv[1]) + "</div>" +
        (wv[3] ? '<div class="call tip"><b>Cómo se usa</b><p>' + mk(wv[3]) + "</p></div>" : "") +
        (wv[2] ? '<div class="note">' + esc(wv[2]) + "</div>" : "") +
        desgloseHtml(wv[2], false) +
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

    if (it.type === "fixerr") {
      return hud() + '<div class="card">' +
        '<div class="prompt">' + esc(it.prompt) + "</div>" +
        '<div class="text hunt fixerr">' + it.stem.split(/\s+/).map(function (t, k) {
          return '<span class="w" data-ft="' + k + '">' + esc(t) + "</span>";
        }).join(" ") + "</div>" +
        '<div id="fixbox"></div><div id="fb" aria-live="polite"></div></div>';
    }

    if (it.type === "hunt") {
      var ep = Letture.byId(it.ep);
      return hud() + '<div class="card">' +
        '<div class="prompt">' + esc(it.prompt) + "</div>" +
        '<div class="stem">' + esc(it.stem) + "</div>" +
        renderText(ep, "hunt") +
        '<div class="row"><button class="btn" id="hcheck">' + UI.check + "</button>" +
        '<span class="muted" id="hcount" style="align-self:center">0 marcadas</span></div>' +
        '<div id="fb" aria-live="polite"></div></div>';
    }

    var lead = "";
    if (it.type === "garden" && it.lead) {
      lead = '<div class="lead-ex"><span class="muted small">Seguí el patrón:</span><ul class="exs">' + it.lead.map(function (e) {
        return '<li><span class="es">' + esc(e[0]) + '</span><span class="it">→ ' + esc(e[1]) + "</span></li>";
      }).join("") + "</ul></div>";
    }
    if (it.type === "scopri" && it.data) {
      lead = '<div class="lead-ex data"><ol class="exs">' + it.data.map(function (d) { return "<li>" + glossifyAny(d) + "</li>"; }).join("") + "</ol></div>";
    }
    if (it.type === "scopri" || it.type === "guess" || (it.type === "choice" && it.options)) {
      body = '<div class="options' + (it.type === "scopri" ? " rules" : "") + '">' + it.options.map(function (o, k) {
        return '<button class="opt" data-opt="' + k + '">' + esc(o) + "</button>";
      }).join("") + "</div>";
      if (it.withText) {
        body = '<button class="tab" id="showtext">📄 ver el texto</button>' +
          '<div id="qtext" hidden>' + renderText(Letture.byId(it.ep), "read") + "</div>" + body;
      }
    } else if (it.type === "dictation") {
      body = '<div class="center"><button class="bigplay" id="play1">🔊</button>' +
        '<div><button class="tab" id="slow">🐢 más lento</button></div>' +
        (it.audio ? '<p class="muted small" id="vcredit"></p>' : "") + "</div>" +
        '<div class="typed">' +
        '<textarea id="wans" class="grow" rows="1" autocomplete="off" autocapitalize="sentences" ' +
        'autocorrect="off" spellcheck="false" enterkeyhint="send" placeholder="lo que escuchás…"></textarea>' +
        '<button class="btn" id="wsend">' + UI.check + "</button></div>";
      stem = "";
    } else if (it.type === "tiles") {
      body = '<div class="tiles-answer" id="tans"></div>' +
        '<div class="tiles-bank" id="tbank"></div>' +
        '<div class="row" style="margin-top:12px">' +
          '<button class="btn" id="tcheck">' + UI.check + "</button>" +
          '<button class="btn ghost" id="tclear">Borrar</button></div>';
    } else if (SAY_TYPES[it.type]) {
      body = '<div class="center"><button class="bigplay" id="play1">🔊</button>' +
        '<div><button class="tab" id="slow">🐢 más lento</button>' +
        (it.type === "coppia" ? '<button class="tab" id="both">👂 las dos</button>' : "") + "</div>" +
        (it.type === "coppia" || it.audio ? '<p class="muted small" id="vcredit"></p>' : "") + "</div>" +
        // «¿Qué forma escuchaste?»: the sentence with the form blanked out
        (it.type === "forma" ? '<div class="stem">' + esc(it.stem).replace("___", "<b>___</b>") + "</div>" : "") +
        '<div class="options' + (it.type === "coppia" ? " pair" : "") + '">' + it.options.map(function (o, k) {
          return '<button class="opt" data-opt="' + k + '">' + esc(o) + "</button>";
        }).join("") + "</div>";
      stem = "";
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
    } else if (it.type === "write") {
      body = '<div class="typed">' +
        '<textarea id="wans" class="grow" rows="1" autocomplete="off" autocapitalize="sentences" ' +
        'autocorrect="off" spellcheck="false" enterkeyhint="send" placeholder="' + UI.inLang + '"></textarea>' +
        '<button class="btn" id="wsend">' + UI.check + "</button></div>" +
        '<div class="row" style="margin-top:8px">' +
          '<button class="tab" id="hint">💡 pista</button>' +
          '<button class="tab" id="easier">🧩 dame fichas</button></div>' +
        '<div class="peek" id="hinttxt" hidden></div>';
    } else if (it.type === "flash") {
      body = '<div id="flash"><button class="btn wide" id="reveal">Mostrar respuesta</button></div>';
    } else if (it.type === "choice" || it.type === "guess") {
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

    var sayBtn = it.src === "frasi" || it.src === "lettura" || it.src === "lab" || it.src === "ascolto" || it.type === "scopri" ? "" :
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
    var ok = Frasi.words(built).join(" ") === Frasi.words(it.answer).join(" ");
    return { given: built, verdict: ok ? Engine.VERDICT.RIGHT : Engine.VERDICT.WRONG };
  }

  // Category groups come from the diagnosis of the language (its ids):
  // Diagnosi.GROUPS, or the package's LANG.diagGroups.
  var GROUPS = (window.Diagnosi && Diagnosi.GROUPS) || LG.diagGroups || {};
  var GENERIC = GROUPS.generic || {};
  var LEXICAL = GROUPS.lexical || {};
  var SLIPS = GROUPS.slips || {};
  var UNRECORDED = GROUPS.unrecorded || {};
  var TILE_SKIP = GROUPS.tileSkip || (LG.diagGroups || {}).tileSkip || LEXICAL;

  // Multiple choice: say why *that* option is wrong (Shute 2008).
  function answer(given) {
    if (round.answered) return;
    var it = currentItem();
    var verdict = Engine.grade(given, it);
    if (it.type === "coppia") { settle(verdict, given, pairHtml(it)); return; }
    if (SAY_TYPES[it.type]) { settle(verdict, given, it.es ? '<div class="note">' + esc(it.es) + "</div>" : ""); return; }
    // With buttons, a wrong option is a wrong choice, never «Casi»: the
    // typo tolerance of the typed answers made «il matrimonia» or «Nos
    // pomos a mesa» a «¡Casi!» with xp, though the trap was the point.
    if (verdict === Engine.VERDICT.CLOSE && it.options) verdict = Engine.VERDICT.WRONG;
    if (verdict === Engine.VERDICT.RIGHT || !window.Diagnosi) { settle(verdict, given, chosenHtml(it, given, verdict)); return; }
    var cd = it.choiceDiag || { before: "", after: "" };
    var d = Diagnosi.explainChoice(cd.before + given + cd.after, cd.before + it.answer + cd.after,
                                   it.choiceDiag ? {} : { stem: it.stem, nominal: it.type === "plural" || /plural/i.test(it.prompt || "") });
    var useful = choiceInLanguage(it, given) && !asksMeaning(it) && !spanishText(it.answer) && d && d.cat && !GENERIC[d.cat];
    // Another sentence or a word unlike the answer: no rule to invent.
    if (useful && DV && DV.far(given, [it.answer], d)) useful = false;
    if (useful && DV) DV.tidy(d);
    if (useful) recordError(d, given, { registro: itemRegister(it) });
    // a sentence: vos / bien with the words that change; a word: the tag and the why
    var long = String(it.answer).trim().split(/\s+/).length > 1;
    settle(verdict, given, useful ? diagHtml(d, long) : chosenHtml(it, given, verdict));
  }

  /* The options are the language itself with a mistake in them, so the
     diagnosis can say what is wrong in the chosen one.  Spanish glosses
     (the week's words, the bank's meanings) are never diagnosed as the
     language, and picking another whole sentence is not a word-level
     error: the recognition version of a translation («¿Cuál es la
     traducción?») is diagnosed only when the option is the answer with a
     trap in it (drills.recognitionOf keeps apart the other answers). */
  function choiceInLanguage(it, given) {
    if (it.choiceDiag || it.src === "coniugatore") return true;
    if (it.recog) {
      if (it.dir === "it-es") return false;
      var other = (it.otherAnswers || []).map(Engine.normalise);
      return other.indexOf(Engine.normalise(given)) < 0 && (it.orig !== "translate" || !!it.otherAnswers);
    }
    return (it.src !== "banca" && it.src !== "lab" && it.src !== "lettura" && it.src !== "frasi" && it.src !== "vocab" && it.src !== "ascolto" && it.type !== "scopri") ||
      (it.src === "frasi" && it.type === "choice");
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

  // The pair after the answer: both words, their meanings and, for the
  // category of LANG.pairBar (the double consonants), a bar that shows the
  // longer sound.
  function pairHtml(it) {
    var p = it.pair, shown = p.written || [p.a, p.b], pb = LG.pairBar;
    var bar = pb && p.cat === pb.cat;
    var row = function (w, k) {
      var long = bar && pb.re.test(w);
      return '<div class="pairrow"><b>' + esc(shown[k]) + "</b> <span class=\"muted\">" + esc((p.es || [])[k] || "") + "</span>" +
        (bar ? '<i class="dur' + (long ? " long" : "") + '"></i>' : "") + "</div>";
    };
    return '<div class="pairbox">' + row(p.a, 0) + row(p.b, 1) + "</div>";
  }

  /* -------------------------------------------- producción y corrección */

  /* Written answers get a diagnosis.  A rule error on the first attempt
     earns a prompt, not the answer: the learner corrects it (Lyster & Ranta
     1997; Lyster & Saito 2010).  Slips (accents, typos) are just flagged. */
  function produce(given) {
    if (round.answered || round.judging) return;
    var it = currentItem();
    // Several blanks typed as «a / b» (or a | b): same as a b.
    if (/\|/.test(it.answer || "")) given = String(given).replace(/\s*[\/|]\s*/g, " ");
    if (!String(given || "").trim()) return;
    var accept = (it.accept && it.accept.length ? it.accept : [it.answer]).map(function (x) {
      return String(x).replace(/\s*\|\s*/g, " ");   // two blanks: typed one after the other
    });
    if (it.dir === "it-es") {
      // the learner writes Spanish: no diagnosis of the language, just the match
      var ves = Engine.grade(given, it);
      settle(ves, given, ves === "giusto" ? "" : '<div class="note">Otras formas de decirlo: ' + esc((it.accept || [it.answer]).join(" · ")) + "</div>");
      return;
    }
    // An answer the AI already judged valid for this item (a local variant, P4.1)
    var vv = variantOf(it, given);
    if (vv) {
      settle("giusto", given, okNoteHtml({ note: "Esta forma no estaba prevista; la IA la revisó y vale" + (vv.x ? ": " + vv.x : ".") }), { label: "✓ Vale" });
      return;
    }
    // The register the item asks for («Trova l'errore», a formal item): the
    // diagnosis accepts the forms of speech with a note, or not.
    var reg = itemRegister(it);
    var diagCtx = { stem: it.stem, prompt: it.prompt, nominal: it.type === "plural" || /plural/i.test(it.prompt || ""),
                    week: DV ? DV.weekNow() : undefined, tags: it.tags };
    if (reg) diagCtx.registro = reg;
    var d = window.Diagnosi ? Diagnosi.diagnose(given, accept, diagCtx) : { verdict: "sbagliato" };
    if (DV) DV.tidy(d);
    // Garden path (Tomasello & Herron 1988): the learner was led into the
    // transfer error on purpose; the correction is the lesson.
    if (it.type === "garden" && it.trap && Engine.normalise(given) === Engine.normalise(it.trap)) {
      round.lastDiag = d;
      settle("sbagliato", given, '<div class="diag"><span class="tag">🪤 La trampa</span><p>' + mk(it.note || "") + "</p></div>", { label: "Caíste, y eso era la idea. Era así:" });
      return;
    }
    round.lastDiag = d;
    // The whole answer in Spanish: a hint about one word is useless.
    var esText = it.frase ? it.frase.es : it.type === "translate" ? it.stem : "";
    if (d.hint && esText) {
      var esW = Engine.normalise(esText).split(/\s+/), gW = Engine.normalise(given).split(/\s+/);
      var inEs = gW.filter(function (w) { return w.length > 1 && esW.indexOf(w) >= 0; }).length;
      if (gW.length >= 2 && inEs * 2 >= gW.length) {
        d.hint = "Eso está en español. Escribila en " + UI.langEs + "; si todavía no la sabés, pedí las fichas 🧩.";
        d.inSpanish = true;
      }
    }
    // Nothing like the answer («boh», «xx», another sentence): no rule to
    // invent and nothing for the Clínica; the answer, its note and how it
    // is built (Aljaafreh & Lantolf 1994).
    if (DV && d.verdict !== "giusto" && d.cat !== "vuoto" && !d.inSpanish && DV.far(given, accept, d) &&
        !(it.type === "garden" && it.trap)) {
      round.lastDiag = null;
      settle("sbagliato", given, DV.farHtml(given, accept));
      return;
    }
    // The old graders forgive a letter or two; the diagnosis knows whether
    // those letters were a typo or grammar (a il / al, em o / no).
    // A rule error always wins over typo tolerance.
    var v1 = it.frase && (it.type === "write" || it.type === "dictation")
      ? Frasi.gradeWritten(given, it.answer).verdict : Engine.grade(given, it);
    var verdict = v1 === "giusto" || d.verdict === "giusto" ? "giusto"
                : d.verdict === "sbagliato" && d.cat ? "sbagliato"
                : v1 === "quasi" || d.verdict === "quasi" ? "quasi" : "sbagliato";
    // Phrase drills stay lenient on accents only.
    if (it.frase && verdict === "sbagliato" && d.all && d.all.every(function (c) { return SLIPS[c]; })) {
      verdict = "quasi";
    }
    if (verdict === "giusto") {
      // Right, with a note: another valid form, the register of speech, correct
      // but not what a native would say.  «✓ Vale»: full xp, not a slip.
      var noteH = d.verdict === "giusto" && window.Errores && Errores.level(d) === "note" ? okNoteHtml(d) : "";
      if (round.tried) {
        markFixed(round.firstCat);
        settle("quasi", given, selfRepairHtml(round.firstDiag) + noteH, { label: "¡Eso es!", fixed: true });
      } else {
        if (it.frase && it.type === "write") state.written = (state.written || 0) + 1;
        settle("giusto", given, noteH, noteH ? { label: "✓ Vale" } : undefined);
      }
      return;
    }
    // The same text again within a moment is a double tap, not a second
    // attempt; sent again later, it is a deliberate "I think I'm right".
    if (round.tried && String(given).trim() === round.lastGiven && Date.now() - round.promptAt < 1500) {
      var inp0 = $("#ans") || $("#wans");
      if (inp0) { inp0.classList.remove("shake"); void inp0.offsetWidth; inp0.classList.add("shake"); inp0.focus(); }
      return;
    }
    // Not sure (P4.1): the rule that fired is about the words or the order,
    // the answer is near and not foreseen.  With a key, the AI judges it
    // before the verdict, with what the app said as evidence.
    if (!round.judged && needsJudge(it, d, given)) {
      round.judged = true;
      judgeFirst(it, given, accept, d, function (ok, data) {
        if (ok) acceptByAI(it, given, data); else decide();
      });
      return;
    }
    decide();

    function decide() {
      if (round.answered) return;
      if (verdict === "sbagliato" && !round.tried && round.kind !== "boss" && round.kind !== "esame" && d.hint && d.cat !== "vuoto") {
        round.tried = true;
        round.lastGiven = String(given).trim();
        round.promptAt = Date.now();
        round.firstCat = d.cat;
        round.firstDiag = d;
        recordError(d, given, { registro: reg });
        showPrompt(d, DV ? DV.promptVerdict(given, accept, d) : null);
        return;
      }
      if (!round.tried && d.cat) recordError(d, given, { registro: reg });
      // right but for a slip: what differed, without the list of the other categories
      settle(verdict, given, d.cat ? diagHtml(d, true, verdict !== "sbagliato") : "");
    }
  }

  /* «✓ Vale» with its note: why it is fine and, if it is, what is more
     natural or what the formal register says. */
  function okNoteHtml(d) {
    var txt = window.Errores ? Errores.noteOf(d) : String((d && d.note) || "");
    if (!txt) return "";
    var tag = d && d.level === "poco_natural" ? "💬 Más natural" : "💬 Una nota";
    return '<div class="diag oknote"><span class="tag">' + tag + "</span><p>" + mk(DV ? DV.plain(txt) : txt) + "</p></div>";
  }

  /* ------------------------------------------ el juez de lo no previsto */

  // What the AI accepted, item by item (state.variants[id] = [{g, x, at}]).
  function variantOf(it, given) {
    var list = (state.variants || {})[it.id];
    if (!list || !list.length) return null;
    var g = Engine.normalise(given);
    return list.filter(function (v) { return v.g === g; })[0] || null;
  }
  function saveVariant(it, given, why) {
    if (!state.variants) state.variants = {};
    var list = state.variants[it.id] || (state.variants[it.id] = []);
    var g = Engine.normalise(given);
    if (!list.some(function (v) { return v.g === g; })) list.push({ g: g, x: String(why || "").slice(0, 300), at: Date.now() });
    state.variants[it.id] = list.slice(-5);
    var ids = Object.keys(state.variants);
    if (ids.length > 300) {
      ids.sort(function (a, b) { return (state.variants[a][0] || {}).at - (state.variants[b][0] || {}).at; });
      ids.slice(0, ids.length - 300).forEach(function (k) { delete state.variants[k]; });
    }
  }
  var JUDGE_CATS = { ordine: 1, orden: 1 };
  function needsJudge(it, d, given) {
    if (!aiKey() || !window.Scrivi || !Scrivi.judge || round.kind === "esame") return false;
    if (it.options || it.type === "garden" || it.type === "dictation" || it.type === "listen" || it.src === "coniugatore" || it.dettato) return false;
    if (!d || !d.cat || d.inSpanish || d.verdict === "giusto" || d.cat === "vuoto" || UNRECORDED[d.cat]) return false;
    if (!(LEXICAL[d.cat] || GENERIC[d.cat] || JUDGE_CATS[d.cat])) return false;
    // sentences: one word asked is one word (a synonym is not what the item teaches)
    return String(it.answer || "").trim().split(/\s+/).length >= 3 && String(given).trim().split(/\s+/).length >= 2;
  }
  function aiItemX(it, given, sol, extra) {
    var x = { prompt: it.prompt, stem: it.stem, options: it.options, given: given, answer: sol,
              accept: it.accept, note: it.note || "", diff: gapDiff(given, sol) };
    Object.keys(extra || {}).forEach(function (k) { x[k] = extra[k]; });
    return x;
  }
  function aiCtx(extra) {
    return window.Errores ? Errores.courseCtx(course, state, view.week, extra) : null;
  }
  function judgeFirst(it, given, accept, d, then) {
    var r0 = round, done = false;
    var finish = function (ok, data) {
      if (done) return;
      done = true;
      clearTimeout(t);
      r0.judging = false;
      if (round !== r0 || currentItem() !== it || round.answered) return;
      then(ok, data);
    };
    var cached = window.Errores ? Errores.cacheGet("judge", [it.id, given]) : null;
    if (cached) return then(!!(cached.correcta && cached.mismo_sentido), cached);
    round.judging = true;
    $("#fb").innerHTML = '<div class="feedback prompt"><div class="verdict">🤖 Esa respuesta no la tenía prevista.</div>' +
      '<p class="muted">Le pregunto a la IA si también vale…</p></div>';
    // at most nine seconds: after that, the rules' verdict
    var t = setTimeout(function () { finish(false, null); }, 9000);
    var fbText = (d.label ? d.label + ": " : "") + (d.explain || d.hint || "");
    Scrivi.judge(aiItemX(it, given, accept[0], { feedback: fbText.slice(0, 500), ctx: aiCtx({ cat: d.cat }) }), aiKeys(), function (err, data) {
      if (err || !data) return finish(false, null);
      if (window.Errores) Errores.cacheSet("judge", [it.id, given], { correcta: !!data.correcta, mismo_sentido: !!data.mismo_sentido, explicacion: String(data.explicacion || "").slice(0, 600) },
                                          (it.stem || it.prompt || it.id) + " · " + given);
      finish(!!(data.correcta && data.mismo_sentido), data);
    });
  }
  function acceptByAI(it, given, data) {
    var why = String((data && data.explicacion) || "");
    saveVariant(it, given, why);
    addAiNote({ id: it.id, prompt: it.prompt, stem: it.stem, given: given, answer: it.answer, ai: why, kind: "variante" });
    settle("giusto", given, okNoteHtml({ note: "Tu respuesta no estaba prevista; la IA la revisó y vale. " + why +
      " Quedó anotada en «Correcciones para revisar»." }), { label: "✓ Vale" });
  }
  function addAiNote(n) {
    if (!state.aiNotes) state.aiNotes = [];
    n.at = Date.now();
    ["ai", "app"].forEach(function (k) { if (n[k]) n[k] = String(n[k]).slice(0, 600); });
    state.aiNotes.unshift(n);
    state.aiNotes = state.aiNotes.slice(0, 80);
    persist();
  }

  function tokHtml(list, cls) {
    return list.map(function (t) {
      return t[cls] ? '<b class="' + cls + '">' + esc(t.w) + "</b>" : esc(t.w);
    }).join(" ");
  }

  // brief: an answer that counts as right (a slip) does not list the other
  // categories («También: …»): the diff already marks every word.
  /* The explanation at the learner's measure (P6), by how many times this
     category has come up (state.errs[cat].n): the first time, the rule and
     the contrast with Spanish; from the fifth, only the hint, with the
     explanation folded and a link to the rule; in between, as it comes. */
  function diagHtml(d, withDiff, brief) {
    var diff = withDiff && d.given && d.given.length <= 24
      ? '<div class="diff"><span class="k">vos</span> ' + tokHtml(d.given, "bad") +
        '<br><span class="k">bien</span> ' + tokHtml(d.fixed, "fix") + "</div>" : "";
    var E = window.Errores, lay = E && d.cat && !brief ? E.depth(state, d.cat) : "normal";
    var body = "<p>" + mk(d.explain || "") + "</p>";
    if (lay === "first") {
      var add = E.firstLayer(d.cat, d.explain);
      if (add.length) body += '<p class="capa">📐 ' + mk(DV ? DV.plain(add.join(" ")) : add.join(" ")) + "</p>";
    } else if (lay === "brief" && d.hint && d.explain && d.hint !== d.explain) {
      body = "<p>" + mk(d.hint) + "</p>" +
        '<details class="why-ok"><summary>📐 La explicación completa</summary><p>' + mk(d.explain) + "</p></details>" +
        '<button class="linkish" type="button" data-rulecat="' + esc(d.cat) + '">📖 Repasá la regla</button>';
    }
    // what was right in it (the Italian diagnosis says it in «note» on an error)
    if (d.note && d.verdict !== "giusto" && String(d.explain || "").indexOf(String(d.note).slice(0, 30)) < 0) body += '<p class="capa">✓ ' + mk(DV ? DV.plain(String(d.note)) : String(d.note)) + "</p>";
    return '<div class="diag"><span class="tag">' + esc(d.label || "") + "</span>" + diff +
      body +
      (!brief && d.all && d.all.length > 1 ? (function () {
        var seen = {}, rest = d.all.slice(1).filter(function (c) { if (seen[c] || c === d.cat) return false; seen[c] = 1; return true; });
        return rest.length ? '<div class="muted">También: ' + rest.map(function (c) { return esc(Diagnosi.LABEL[c] || c); }).join(", ") + "</div>" : "";
      })() : "") +
      "</div>";
  }

  /* Fixed after the hint (🎯): what was fixed, before and now, and the rule
     it was about.  Saying what made it right is what turns the repair into
     a rule the learner can use again (Lyster & Ranta 1997: repair after a
     prompt; Hattie & Timperley 2007: feedback on the process). */
  function selfRepairHtml(d) {
    var head = '<div class="diag selfrepair"><span class="tag">🎯 Lo corregiste vos</span>';
    if (!d || !d.given || !d.fixed) return head + "<p>Autocorregirse es lo que más fija.</p></div>";
    var diff = d.given.length <= 24
      ? '<div class="diff"><span class="k">antes</span> ' + tokHtml(d.given, "bad") +
        '<br><span class="k">ahora</span> ' + tokHtml(d.fixed, "fix") + "</div>" : "";
    return head + diff +
      (d.explain ? "<p>" + (d.label ? "<b>" + esc(d.label) + ":</b> " : "") + mk(d.explain) + "</p>" : "") +
      '<p class="muted small">Autocorregirse es lo que más fija.</p></div>';
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
  function choiceWhy(it, o) {
    if (!window.Diagnosi || !DV || !choiceInLanguage(it, o) || asksMeaning(it) || spanishText(it.answer)) return null;
    var cd = it.choiceDiag || { before: "", after: "" }, d;
    try {
      d = Diagnosi.explainChoice(cd.before + o + cd.after, cd.before + it.answer + cd.after,
                                 it.choiceDiag ? {} : { stem: it.stem, nominal: it.type === "plural" || /plural/i.test(it.prompt || "") });
    } catch (e) { return null; }
    if (!d || !d.cat || !d.explain || GENERIC[d.cat] || UNRECORDED[d.cat] || DV.far(o, [it.answer], d)) return null;
    return DV.tidy(d);
  }
  function trapHtml(text, opt) {
    return '<div class="diag trap"' + (opt ? ' data-o="' + esc(opt) + '"' : "") + '><span class="tag">🪤 Esquivaste la trampa</span><p>' + text + "</p></div>";
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
    if (!DV || q < 1 || it.type === "hunt") return p;
    p.unsure = DV.unsure({ ms: o.ms, item: it, hinted: !!(round.hinted || round.tried), retry: !!it.retry, close: q === 1, fixed: !!o.fixed });
    var typed = !it.options && it.dir !== "it-es" && !SAY_TYPES[it.type] &&
      ["tiles", "flash", "fixerr", "hunt", "listen", "coppia"].indexOf(it.type) < 0;
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
    } else if (it.lab === "falsi" && it.trap) {
      p.trap = true;
      p.top += trapHtml("<i class=\"it\">" + esc(it.stem) + "</i> parece «" + esc(it.trap) + "», pero es «" + esc(it.answer) + "».");
    } else if (it.options && it.type !== "scopri") {
      var alts = [];
      it.options.forEach(function (op) {
        if (Engine.normalise(op) === Engine.normalise(it.answer)) return;
        var d = choiceWhy(it, op);
        if (d) alts.push({ o: op, d: d });
      });
      var tr = alts.filter(function (a) { return DV.transfer(a.d.cat); })[0];
      if (tr) {
        p.trap = true;
        p.top += trapHtml("No era <b>" + esc(tr.o) + "</b>: " + mk(tr.d.explain), tr.o);
      }
      var rest = alts.filter(function (a) { return a !== tr; });
      if (rest.length) {
        p.bottom += '<details class="others"><summary>🔍 ¿Y ' + (tr && rest.length === 1 ? "la otra opción" : "las otras opciones") + "?</summary><ul>" +
          rest.map(function (a) { return '<li data-o="' + esc(a.o) + '"><b>' + esc(a.o) + "</b>: " + mk(a.d.explain) + "</li>"; }).join("") +
          "</ul></details>";
      }
    }
    return p;
  }

  function showPrompt(d, verdictText) {
    fx.close();
    // The word(s) to fix, with the first letter showing: c_mo.
    var masked = (d.fixed || []).filter(function (t) { return t.fix; }).map(function (t) {
      return t.w.charAt(0) + t.w.slice(1).replace(/[^' ]/g, "_");
    }).join(" ");
    $("#fb").innerHTML = '<div class="feedback prompt">' +
      '<div class="verdict">' + esc(verdictText || "🔎 Casi. Revisalo:") + "</div>" +
      (d.given && d.given.length <= 24 ? '<div class="diff">' + tokHtml(d.given, "bad") + "</div>" : "") +
      "<p>" + mk(d.hint) + "</p>" +
      '<div class="row">' + (masked ? '<button class="tab" id="morehint">💡 más pista</button>' : "") +
      (aiKey() && window.Scrivi && Scrivi.hints ? '<button class="tab" id="aihint">🤖 Explicame</button>' : "") +
      '<button class="tab" id="giveup">Ver la respuesta</button></div><div id="aihintout"></div></div>';
    on("#giveup", function () { settle("sbagliato", "", diagHtml(d, true)); });
    on("#aihint", function () { aiGradedHints(d); });
    on("#morehint", function () {
      var b = $("#morehint");
      if (b) b.outerHTML = '<span class="muted" style="align-self:center">' + esc(masked) + "</span>";
      var inp = $("#ans") || $("#wans");
      if (inp) inp.focus();
    });
    var input = $("#ans") || $("#wans");
    if (input) { input.focus(); input.select && input.select(); }
  }

  /* «🤖 Explicame» before the solution (dynamic assessment: Aljaafreh &
     Lantolf 1994): on the first failed attempt, the AI's graded hints (where
     the problem is, then the rule as a question), with the app's own hint
     and its category as evidence; the explanation waits for the final sheet.
     Cached by (item, answer): the same question is not paid twice.
     state.hintLevels counts how far the learner needed to go. */
  function aiGradedHints(d) {
    var it = currentItem(), out = $("#aihintout"), b = $("#aihint"), r0 = round;
    if (!out || !it) return;
    var given = round.lastGiven || "", sol = (it.accept && it.accept[0]) || it.answer;
    if (b) b.disabled = true;
    var show = function (data, lvl) {
      if (round !== r0 || round.answered || !$("#aihintout")) return;
      var o = $("#aihintout");
      var p = function (t) { return mk(DV ? DV.plain(String(t || "")) : String(t || "")); };
      o.innerHTML = '<div class="aiout"><p>🤖 <b>Pista:</b> ' + p(data.pista1) + "</p>" +
        (lvl >= 2 ? "<p>🤖 <b>Otra pista:</b> " + p(data.pista2) + "</p>" : "") +
        (lvl < 2 ? '<div class="row"><button class="tab" id="aihint2">💡 Otra pista</button></div>' : "") +
        (data.tambien_correcta ? '<p class="muted small">La IA cree que tu respuesta también podría valer. Si estás seguro, mandala igual o tocá «Ver la respuesta» y después «🙋 Mi respuesta es válida».</p>' : "") +
        "</div>";
      if (!state.hintLevels) state.hintLevels = { 1: 0, 2: 0, 3: 0 };
      state.hintLevels[lvl] = (state.hintLevels[lvl] || 0) + 1;
      persist();
      on("#aihint2", function () { show(data, 2); });
      var inp = $("#ans") || $("#wans");
      if (inp) inp.focus();
    };
    var cached = window.Errores ? Errores.cacheGet("hints", [it.id, given]) : null;
    if (cached) { round.aiHints = cached; return show(cached, 1); }
    out.innerHTML = '<p class="muted small">⏳ Preguntándole a la IA…</p>';
    var x = aiItemX(it, given, sol, { feedback: String(d.hint || "").slice(0, 400), ctx: aiCtx({ cat: d.cat, appSaid: d.explain || "" }) });
    Scrivi.hints(x, aiKeys(), function (err, data) {
      if (round !== r0 || round.answered) return;
      var o = $("#aihintout");
      if (!o) return;
      if (err || !data || !data.pista1) {
        o.innerHTML = '<p class="muted small">No pude usar la IA (' + esc(String((err && err.message) || err || "respuesta vacía")) + ").</p>";
        if ($("#aihint")) $("#aihint").disabled = false;
        return;
      }
      var keep = { pista1: String(data.pista1 || "").slice(0, 400), pista2: String(data.pista2 || "").slice(0, 400),
                   explicacion: String(data.explicacion || "").slice(0, 800), tambien_correcta: !!data.tambien_correcta, app_equivocada: !!data.app_equivocada };
      if (window.Errores) Errores.cacheSet("hints", [it.id, given], keep, (it.stem || it.prompt || it.id) + " · " + given);
      round.aiHints = keep;
      show(keep, 1);
    });
  }

  /* «🤖 Explicame más», on the final sheet: the solution and the app's
     explanation are already there, so the AI is asked for the rule behind
     it, a contrast with Spanish and another example, with the app's
     correction, the category and the week as evidence.  If it thinks the
     answer was valid after all, it goes to «Correcciones para revisar». */
  function aiExplainMore(it, given, sol, dg, fbText) {
    var b = $("#aiexp"), outE = $("#aiexpout");
    if (b) b.disabled = true;
    var show = function (data, meta) {
      var o = $("#aiexpout");
      if (!o) return;
      var dispute = data.tambien_correcta || data.app_equivocada;
      o.innerHTML = '<div class="aiout"><p>🤖 ' + mk(DV ? DV.plain(String(data.explicacion || "")) : String(data.explicacion || "")) + "</p>" +
        (dispute ? '<p class="muted small">La IA cree que ' + (data.tambien_correcta ? "tu respuesta también vale" : "la corrección de la app no es buena") +
           ". Quedó anotado en " + UI.me + " → «Correcciones para revisar».</p>" : "") +
        (meta ? modelLine(meta) : '<p class="muted small modelline">IA: ya lo había explicado (guardado en el teléfono).</p>') + "</div>";
    };
    var cached = window.Errores ? Errores.cacheGet("explain", [it.id, given]) : null;
    if (cached) return show(cached, null);
    if (outE) outE.innerHTML = '<p class="muted small">⏳ Preguntándole a la IA…</p>';
    var x = aiItemX(it, given, sol, { feedback: fbText, stage: "mas",
                                      ctx: aiCtx({ cat: dg && dg.cat, appSaid: dg ? (dg.label ? dg.label + ": " : "") + (dg.explain || dg.hint || "") : "" }) });
    Scrivi.explain(x, aiKeys(), function (err, data, meta) {
      var o = $("#aiexpout");
      if (!o) return;
      if (err || !data) { o.innerHTML = '<p class="muted small">No pude usar la IA (' + esc(String((err && err.message) || err || "respuesta vacía")) + ").</p>"; if (b) b.disabled = false; return; }
      var keep = { explicacion: String(data.explicacion || "").slice(0, 1200), tambien_correcta: !!data.tambien_correcta, app_equivocada: !!data.app_equivocada };
      if (window.Errores) Errores.cacheSet("explain", [it.id, given], keep, (it.stem || it.prompt || it.id) + " · " + given);
      if (keep.tambien_correcta || keep.app_equivocada) {
        addAiNote({ id: it.id, prompt: it.prompt, stem: it.stem, given: given, answer: sol, app: fbText, ai: keep.explicacion, kind: "ia" });
      }
      show(keep, meta);
    });
  }

  function canClaim(it, given, extra) {
    if (!it || round.kind === "esame" || !String(given || "").trim()) return false;
    if (SAY_TYPES[it.type] || it.type === "guess" || it.type === "coppia" || it.type === "hunt" || it.type === "intro") return false;
    return !(it.type === "garden" && extra && extra.indexOf("La trampa") >= 0);
  }
  // The rule of a category, in the theory (the block that teaches it) or in «Consultar».
  function openRuleOf(cat) {
    var b = null;
    try {
      if (window.Porque && Porque.blockFor) b = Porque.blockFor({ id: "cat:" + cat, cat: cat, src: "clinica", type: "typed", answer: "", stem: "" },
                                                            { course: course, unlocked: state.unlocked, week: view.week });
    } catch (e) { b = null; }
    if (b && window.Porque && Porque.open) Porque.open(b.week, b.i);
    else if (window.Capas && Capas.open) Capas.open((window.Diagnosi && Diagnosi.LABEL[cat]) || "");
  }

  /* «🙋 Mi respuesta es válida» (P5), on any error sheet, with or without a
     key: the answer is accepted provisionally (no xp, and the error recorded
     for it is taken back from the profile, with its second pass), and it is
     noted for review with the item, the answer and what the app said.  With
     a key, the AI is asked too, with that evidence; if it agrees, the answer
     becomes a local variant of the item. */
  function claimValid(it, given, sol, fbText, dg) {
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
    if (!aiKey() || !window.Scrivi || !Scrivi.judge || !String(given || "").trim()) return;
    if (o) o.insertAdjacentHTML("beforeend", '<p class="muted small" id="claimai">⏳ Le pregunto también a la IA…</p>');
    Scrivi.judge(aiItemX(it, given, sol, { feedback: fbText, ctx: aiCtx({ cat: dg && dg.cat }) }), aiKeys(), function (err, data) {
      var p = $("#claimai");
      if (err || !data) { if (p) p.textContent = "No pude usar la IA; queda anotada igual."; return; }
      var yes = !!(data.correcta && data.mismo_sentido), why = String(data.explicacion || "");
      note.ai = (yes ? "vale: " : "no vale: ") + why.slice(0, 560);
      if (yes) saveVariant(it, given, why);
      persist();
      if (p) p.innerHTML = "🤖 " + (yes ? "La IA coincide: vale. La próxima vez te la acepto. " : "La IA cree que no: ") + mk(DV ? DV.plain(why) : why);
    });
  }

  /* Every correction goes to the error profile through here, as the common
     error object of js/errores.js (what was written, the correction, the
     hint, the rule, the contrast, the register, the source): a diagnosis of
     a closed answer is turned into one; the other correctors pass theirs.
     The rows of this answer are kept in round.recorded, so «🙋 Mi respuesta
     es válida» can take them back. */
  function recordError(d, given, o) {
    if (!d || !d.cat || UNRECORDED[d.cat]) return null;
    var E = window.Errores;
    var err = d.fuente && d.mal !== undefined ? d : E ? E.fromDiag(d, given, o) : null;
    var row = null;
    if (E) row = E.record(state, err);
    else {
      if (!state.errs) state.errs = {};
      if (!state.errLog) state.errLog = [];
      var e = state.errs[d.cat] || (state.errs[d.cat] = { n: 0, fixed: 0, last: 0 });
      e.n++; e.last = Date.now();
      row = { cat: d.cat, g: String(given).slice(0, 80), e: String(d.target || "").slice(0, 80), at: Date.now(),
              l: String(d.label || "").slice(0, 60), x: String(d.explain || d.hint || "").slice(0, 280) };
      state.errLog.unshift(row);
      state.errLog = state.errLog.slice(0, 60);
    }
    if (row && round && !round.answered) (round.recorded = round.recorded || []).push(row);
    persist();
    return row;
  }
  // The register the item asks for (the Portuguese «pra» is fine in
  // speech, not in a formal text): the item's field, its tags, «Trova
  // l'errore» (the written norm); nothing otherwise.
  function itemRegister(it) {
    if (!it) return null;
    if (it.registro) return /^(formal|culto)$/i.test(it.registro) ? "formal" : String(it.registro);
    if ((it.tags || []).indexOf("formal") >= 0) return "formal";
    if (it.type === "fixerr" || it.bank === "err") return "formal";
    return null;
  }

  function markFixed(cat) {
    if (!cat || !state.errs || !state.errs[cat]) return;
    state.errs[cat].fixed = (state.errs[cat].fixed || 0) + 1;
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

    // A guess before learning is never an error: it only primes the memory.
    if (it.type === "guess") return settleGuess(it, q, given);

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
                     rule: it.rule || "",
                     es: it.frase ? it.frase.es : "", stem: it.stem || "", prompt: it.prompt || "" });

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
    } else if (it.src !== "coniugatore" && it.src !== "lettura" && !it.nocard) {
      state.cards[it.id] = Engine.schedule(state.cards[it.id], q, {
        kind: ekind, id: it.id, state: state, retry: !!it.retry, hint: !!round.tried || !!opts.fixed,
        fast: !!fast, slow: !!slow, ms: took, notte: state.notte !== false });
      Engine.maybeFit(state);
    }
    // The ladder inside the round: recognised right and quick → the next of
    // the same rule written; written and missed → the next with options.
    var recogFast = q === 2 && it.recog && took != null && slowT && took < slowT / 2;
    if (window.Reglas && round.kind !== "boss" && round.kind !== "domina" && round.kind !== "esame") Reglas.adaptNext(round, it, q, recogFast);
    // Productive practice of the week's own rule, day by day (a rule is a
    // card of its own: three days of writing it right consolidate it).
    if (q === 2 && !it.recog && !it.options && !it.frase && it.src !== "coniugatore" && it.src !== "vocab" &&
        it.src !== "lab" && it.src !== "lettura" && it.src !== "banca" && !it.ruleReview && !it.old && !it.unamas && COUNT_KINDS[round.kind]) {
      Engine.noteProduction(state, view.week);
    }

    /* Successive relearning (Rawson & Dunlosky 2011): what you miss comes
       back later in the same session, until you get it (at most twice). */
    var relearn = "";
    if (q < 2 && round.kind !== "boss" && round.kind !== "esame" && it.src !== "lettura" && !it.retry && !it.unamas && !(round.again[it.id])) {
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

    // Only the week's own exercises count towards its stars: not the gym,
    // not the words (that is how a week got «mastered» after seeing 7 items),
    // not the rules of other weeks (a new sentence, the old ones of Dominala).
    if (!it.frase && it.src !== "lab" && it.src !== "lettura" && it.src !== "banca" &&
        it.src !== "coniugatore" && it.src !== "vocab" && !it.ruleReview && !it.old && !it.unamas && COUNT_KINDS[round.kind]) {
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
    var sol = it.type === "listen" && it.frase ? it.frase.it + " — " + it.answer
            : it.frase ? it.frase.it : rp.sol || it.answer;
    // A quick right answer on a known item: the rule folded in one line.
    var calm = q === 2 && !rp.unsure && !rp.trap && seenBefore;
    var noteHtml = !it.note || (it.type === "garden" && extra && extra.indexOf("La trampa") >= 0) ? ""
      : calm ? '<details class="why-ok"><summary>📐 Por qué está bien</summary><div class="note">' + mk(DV ? DV.plain(it.note) : it.note) + "</div></details>"
      : '<div class="note">' + mk(DV ? DV.plain(it.note) : it.note) + "</div>";
    // word by word, after a right answer: when it was unsure, or a new sentence
    var tt = targetText(it);
    var withDesglose = q < 2 || rp.unsure || (!seenBefore && String(tt || "").trim().split(/\s+/).length >= 3);
    /* The order of the sheet: the verdict, the right form («Era así:»
       points at it), what you wrote beside it and why it was wrong, the
       rule of the item; then what is there to look up, folded when the
       why is already said (word by word, your keyword), so «Siguiente»
       stays in sight on a phone.  Elaborated feedback works when it is
       short and says the why first (Shute 2008). */
    var explained = /class="diag(?! far)/.test((extra || "") + rp.top);
    var fb = '<div class="feedback ' + verdict + '">' +
      '<div class="verdict">' + label +
        (gained ? ' <span class="xpgain">+' + gained + " xp</span>" : "") + "</div>" +
      (it.type === "hunt" ? "" : '<div class="sol">' + (it.frase || it.src === "lettura" || it.dir === "it-es" || it.type === "scopri" ? esc(sol) : glossifyAny(sol)) + "</div>") +
      (it.frase && it.type !== "listen" ? '<div class="note">' + esc(it.frase.es) + "</div>" : "") +
      rp.top +
      (extra || "") +
      noteHtml +
      rp.bottom +
      (q === 2 && it.recogNote ? '<div class="note">' + esc(it.recogNote) + "</div>" : "") +
      (it.hint && it.src === "dummies"
        ? '<div class="note">Consigna original: ' + esc(it.hint) + "</div>" : "") +
      (withDesglose ? desgloseHtml(tt, (verdict !== "giusto" && !explained) || it.type === "guess") : "") +
      (function () {
        var vw = vocabWordOf(it), kw = vw && (state.keywords || {})[vw];
        return kw ? '<div class="note">🧷 Tu imagen: ' + esc(kw) + "</div>" : q < 2 && vw ? keywordBox(vw, true) : "";
      })() +
      relearn +
      '<div class="row" style="margin-top:10px">' +
        '<button class="btn" id="next">' + UI.next + "</button>" +
        (oneMore ? UnaMas.button() : "") +
        '<button class="tab" id="say2">🔊 escuchar</button>' +
        (q < 2 && aiKey() && window.Scrivi && it.type !== "hunt" ? '<button class="tab" id="aiexp">🤖 Explicame más</button>' : "") +
        (q < 2 && canClaim(it, claimGiven, extra) ? '<button class="tab" id="claim">🙋 Mi respuesta es válida</button>' : "") +
      '</div><div id="aiexpout"></div><div id="claimout"></div></div>';

    $("#fb").innerHTML = fb;
    if (window.Porque) Porque.after(it, { q: q, given: given, round: round });   // 📖 ¿Por qué? · 🧐 ¿Qué tenía de malo?
    // «¿Qué tenía de malo X?» asks about an option: its why, said here, would answer it
    var pq = $("#fb .porque-quiz .pq-h b");
    if (pq) {
      var asked = Engine.normalise(pq.textContent.replace(/[«»]/g, ""));
      $("#fb").querySelectorAll("[data-o]").forEach(function (el) {
        if (Engine.normalise(el.getAttribute("data-o")) === asked) el.parentNode.removeChild(el);
      });
      var oth = $("#fb details.others");
      if (oth && !oth.querySelector("li")) oth.parentNode.removeChild(oth);
    }
    wireKeyword();
    $("#fb").querySelectorAll("[data-rulecat]").forEach(function (b) {
      b.onclick = function (e) { e.stopPropagation(); openRuleOf(b.getAttribute("data-rulecat")); };
    });
    $("#fb").querySelectorAll("[data-sg]").forEach(function (b) {
      b.onclick = function (e) { e.stopPropagation(); showGloss(stemGloss[+b.dataset.sg]); };
    });
    // Reading: after a miss, the text opens so the answer can be found in it.
    var qt = $("#qtext");
    if (qt && q < 2) qt.hidden = false;

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
    ["#tcheck", "#tclear", "#wsend", "#wans", "#easier", "#reveal", "#hcheck", "#send", "#fxsend", "#fxdel", "#fxin"].forEach(function (s) {
      var b = $(s); if (b) b.disabled = true;
    });
    if (it.type === "tiles") drawTiles();

    var spoken = it.frase ? it.frase.it : it.src === "lettura" ? "" : it.dir === "it-es" || it.type === "scopri" ? it.stem
      : filledStem(it) || it.answer;
    if (SAY_TYPES[it.type] || it.dettato) spoken = it.say;
    // False friends and structured input: read the prompt of the language aloud.
    if (it.lab === "falsi" || it.lab === "capire") spoken = it.stem;
    // A Spanish answer (¿Qué significa «saudade»? → nostalgia) is not
    // read: the sentence of the question is, when there is one.
    if (spanishText(spoken) || (spoken === it.answer && asksMeaning(it))) spoken = it.stem && !/_{3,}/.test(it.stem) && !spanishText(it.stem) ? it.stem : "";
    $("#next").onclick = nextAfterFeedback();
    on("#unamas", function () { if (UnaMas.take(round, oneMore)) nextItem(); });
    var fbTextOf = function () {
      var t = ($("#fb") || {}).innerText || "";
      return t.split(UI.next)[0].replace(/\s+/g, " ").slice(0, 600);
    };
    on("#aiexp", function () { aiExplainMore(it, claimGiven || given, sol, dg || round.firstDiag, fbTextOf()); });
    on("#claim", function () { claimValid(it, claimGiven, sol, fbTextOf(), dg || round.firstDiag); });
    $("#say2").onclick = function () { if (it.audio) speakItem(it, true); else speak(spoken, true); };
    if (!spoken && !it.audio) $("#say2").hidden = true;
    else if (q === 2 || it.frase) { if (it.audio) speakItem(it); else speak(spoken); }
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
    if (it.id.indexOf("b:voc:") === 0) return it.id.slice(6);
    return null;
  }

  function retryVersion(it) {
    var copy;
    if (it.retryAs) copy = Object.assign({}, it.retryAs);       // the item says its easier version (variaciones.js)
    else if (it.frase) copy = Frasi.pickItem(it.frase, { silent: state.silent, fresh: true });
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

  /* «Adiviná» with the wrong option: what was wrong with *that* option
     (Kornell, Hays & Bjork 2009: the pretest helps when the feedback
     explains).  The diagnosis of the language when it has something
     specific to say; else what the option changes (Frasi.explainOption). */
  function guessWhy(it, given) {
    if (!given || given === it.answer) return "";
    var d = null;
    if (!(it.why && it.why[given]) && window.Diagnosi && Diagnosi.explainChoice) {
      try { d = Diagnosi.explainChoice(given, it.answer, {}); } catch (e) { d = null; }
    }
    // a «typo» or an empty answer says nothing about a fabricated option
    if (d && d.cat && d.explain && !UNRECORDED[d.cat]) {
      if (DV) DV.tidy(d);
      return diagHtml(d, true);
    }
    var t = Frasi.explainOption ? Frasi.explainOption(given, it) : "";
    return t ? '<div class="diag"><span class="tag">Tu opción</span><p>' + mk(t) + "</p></div>" : "";
  }

  /* «Adiviná» right: it was a guess, so what the other options had wrong
     is worth a look (Butler, Karpicke & Roediger 2008: feedback rescues
     the right answers given without confidence), folded under the answer. */
  function guessOthers(it) {
    var rows = (it.options || []).filter(function (o) { return o !== it.answer; }).map(function (o) {
      var d = null, t = "";
      if (!(it.why && it.why[o]) && window.Diagnosi && Diagnosi.explainChoice) {
        try { d = Diagnosi.explainChoice(o, it.answer, {}); } catch (e) { d = null; }
      }
      if (d && d.cat && d.explain && !UNRECORDED[d.cat] && !GENERIC[d.cat]) t = (DV ? DV.tidy(d) : d).explain;
      else t = Frasi.explainOption ? Frasi.explainOption(o, it) : "";
      return t ? '<li><b>' + esc(o) + "</b>: " + mk(t) + "</li>" : "";
    }).filter(Boolean);
    return rows.length ? '<details class="others"><summary>🔍 ¿Y las otras opciones?</summary><ul>' + rows.join("") + "</ul></details>" : "";
  }

  // «🧱 Fórmula fija»: a phrase that uses the grammar of a later week.
  function formulaHtml(f) {
    var t = window.Formule && f ? Formule.line(f, state.unlocked) : "";
    return t ? '<div class="note formula">' + mk(t) + "</div>" : "";
  }

  /* «Ya lo venías usando»: in the lesson of a week, the phrases that used
     its grammar as a formula, with the form marked (Ellis 2002: the
     formula becomes a case of the rule). */
  function formuleBridgeHtml(ids, wk) {
    var rows = (ids || []).map(function (id) { return Frasi.BY_ID[id]; }).filter(Boolean).map(function (f) {
      var forms = (Formule.of(f).filter(function (x) { return x[0] === wk; })[0] || [0, ""])[1];
      var html = esc(f.it);
      String(forms).split(/,\s*/).filter(Boolean).forEach(function (x) {
        var re = new RegExp("(^|[^A-Za-zÀ-ÿ'])(" + x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")(?![A-Za-zÀ-ÿ])", "i");
        html = html.replace(re, "$1<b>$2</b>");
      });
      var seen = !!state.cards[f.id];
      return '<li><span class="it">' + html + '</span><span class="es">' + esc(f.es) +
        (seen ? "" : ' <span class="muted small">· de la escena «' + esc((Frasi.scene(f.scene) || {}).name || "") + "»</span>") + "</span></li>";
    });
    if (!rows.length) return "";
    return '<div class="badge-new">🧱 Ya lo venías usando</div>' +
      "<p>Estas frases las aprendiste enteras, como fórmulas. Lo marcado es justo lo que esta semana " +
      "tiene su regla: ahora sabés por qué se arman así.</p>" +
      '<ul class="exs formule-list">' + rows.join("") + "</ul>";
  }

  function settleGuess(it, q, given) {
    var gained = q === 2 ? 5 : 2;
    round.xp += gained;
    gain(gained);
    persist();
    renderHeader();
    if (q === 2) fx.right(); else fx.tap();
    $("#fb").innerHTML = '<div class="feedback ' + (q === 2 ? "giusto" : "quasi") + '">' +
      '<div class="verdict">' + (q === 2 ? "¡Buen olfato!" : "Era esta. Mirá qué tenía tu opción:") +
        ' <span class="xpgain">+' + gained + " xp</span></div>" +
      (q === 2 ? "" : guessWhy(it, given)) +
      '<div class="sol" lang="' + LG.tts + '">' + esc(it.answer) + "</div>" +
      (it.note ? '<div class="note">' + mk(it.note) + "</div>" : "") +
      (q === 2 ? guessOthers(it) : "") +
      desgloseHtml(targetText(it), true) +
      '<div class="note">🔬 Intentar adivinar antes de aprender ayuda a recordar, ' +
        "aunque te equivoques (efecto de la prueba previa).</div>" +
      '<div class="row" style="margin-top:10px"><button class="btn" id="next">' + UI.next + "</button></div></div>";
    document.querySelectorAll(".opt").forEach(function (o) {
      o.disabled = true;
      if (o.textContent === it.answer) o.classList.add("right");
      else if (o.textContent === given) o.classList.add("wrong");
    });
    $("#next").onclick = nextAfterFeedback();
    if (window.Porque) Porque.after(it, { q: q, given: given, round: round });   // 📖 ¿Por qué? · 🧐 ¿Qué tenía de malo?
    try { $("#next").focus({ preventScroll: true }); } catch (e) { /* */ }
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
  var KIND_NAME = { debil: "Puntos débiles", domina: "Dominala", round: "Entrenamiento", giorno: UI.daily, boss: UI.Boss, gym: "Gimnasio de verbos", pausa: UI.pausa, review: UI.review,
                    scene: "Frases", vocab: "Palabras de la semana", lettura: "Lectura", sfida: UI.sfida, ponte: "Ponte",
                    falsi: UI.falsi, capire: UI.capire, "b-voc": UI.words, "b-tr": UI.tr, "b-gap": UI.gap,
                    "b-forme": UI.forme, "b-err": UI.err, "b-ident": "Lo que más te cuesta", clinica: "Clínica", suoni: UI.suoni, "b-freq": UI.wordsFreq,
                    ritorno: "Cinco minutos para retomar", micro: UI.micro, esame: UI.examC1, duello: "Duelo",
                    diag: "Mini diagnóstico" };
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
    round.judged = false;
    round.aiHints = null;
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

    if (round.kind === "esame") {
      var firsts0 = round.log.filter(function (x) { return !x.retry; });
      var okE = firsts0.filter(function (x) { return x.verdict === Engine.VERDICT.RIGHT; }).length;
      esameSet(round.arg, okE, firsts0.length);
      persist();
      renderHeader();
      view.screen = "esame";
      render();
      toast(EX.provaToast(round.arg, proveName(round.arg)) + ": " + Math.round(okE / Math.max(1, firsts0.length) * 100) + " %", 3000);
      return;
    }
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
      // Like the certifications: one mark per ability, and each one has to
      // reach 55 % (reading, listening, writing, structures).
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
    // Suoni is done with 70 % (six answers at least), not just with six answers.
    if (round.kind === "suoni" && total >= 6) {
      var sw = round.arg || Math.min(state.unlocked, NW());
      if (!state.suoniPct) state.suoniPct = {};
      state.suoniPct[sw] = Math.max(state.suoniPct[sw] || 0, pct);
      if (pct >= 70) { if (!state.suoniDone) state.suoniDone = {}; state.suoniDone[sw] = Date.now(); }
    }
    // The identification missions of the week (b-forme, b-err) keep their best.
    if ((round.kind === "b-forme" || round.kind === "b-err" || round.kind === "b-ident") && /^w:\d+$/.test(String(round.arg || "")) && total >= 6) {
      var iw = +String(round.arg).slice(2);
      if (!state.identPct) state.identPct = {};
      var ip = state.identPct[iw] || (state.identPct[iw] = {});
      ip[round.kind] = Math.max(ip[round.kind] || 0, pct);
    }
    // Capire keeps its best (the mission asks 80 %).
    if (round.kind === "capire" && round.arg && total >= 4) {
      if (!state.capirePct) state.capirePct = {};
      state.capirePct[round.arg] = Math.max(state.capirePct[round.arg] || 0, pct);
    }

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

    if (round.kind === "trabajo" && window.Trabajo) Trabajo.roundDone(state, round.arg, pct);

    if (round.kind === "sfida") {
      var prevS = state.challengeLog[round.arg];
      state.challengeLog[round.arg] = { q: pct >= 80 ? 2 : pct >= 50 ? 1 : 0,
        pct: Math.max(pct, prevS && prevS.pct || 0), at: Date.now() };
      if (!prevS) gain(Engine.XP.challenge);
    }

    if (round.kind === "lettura") {
      if (!state.letture) state.letture = {};
      var prev = state.letture[round.arg];
      // n: how many times it was read (a reading read again counts for the mission)
      state.letture[round.arg] = { pct: Math.max(pct, prev ? prev.pct : 0), at: Date.now(), n: ((prev && prev.n) || 1) + (prev ? 1 : 0), v: 31 };
      if (!prev) gain(20);
    }

    if (window.Escritos) Escritos.roundDone(round, pct);
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
      // Like the certifications: one mark per ability, each one has to pass.
      var AB = EX.abilities || {};
      var ab = r.skills || {};
      var ORDER_AB = ["lettura", "ascolto", "produzione", "strutture"];
      html += "<h3>" + EX.byAbility + '</h3><table class="res">' + ORDER_AB.filter(function (k) { return ab[k]; }).map(function (k) {
        var a = ab[k], p = Math.round(a.ok / a.n * 100);
        return "<tr><td>" + (AB[k] || k) + "</td><td>" + a.ok + " / " + a.n + " · " + (p >= 55 ? "✓" : "✗ (mínimo 55 %)") + "</td></tr>";
      }).join("") + "</table>" +
      (!ab.ascolto && state.silent ? '<p class="muted small">Sin escucha: estás en modo silencioso.</p>' : "");
    }
    if (r.oldRules) {
      html += '<p class="note">🗓️ Reglas de hace un mes o más: ' + r.oldRules.pct + " % en " + r.oldRules.n +
        (r.oldRules.n === 1 ? " pregunta" : " preguntas") + (round.kind === "domina" ? " (aparte: no cuentan para dominar la semana)" : "") + ".</p>";
    }
    if (round.kind === "boss") {
      html += r.passed
        ? '<p style="margin-top:14px">Semana ' + Math.min(NW(), view.week + 1) +
          " desbloqueada. +" + Engine.XP.boss + " xp</p>"
        : '<p style="margin-top:14px">Hace falta <b>85%</b> de aciertos y 55 % en cada destreza. ' +
          "Repasá el briefing y volvé a intentarlo: si es hoy, con otras preguntas y otros textos.</p>";
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
          var q = l.es || (l.stem && !/^\s*_+\s*$/.test(l.stem) ? l.stem : "") || l.prompt || "—";
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

  /* ----------------------------------------------------------------- relâmpago */

  var LAMPO_MS = 60000;

  /* The words the learner holds (two successes or more): the material of
     the recognition-fluency game (Nation 2007: fluency is built on known
     material, under time pressure). */
  function matureWords() {
    var out = [];
    Object.keys(state.cards).forEach(function (id) {
      var w = id.indexOf("v:") === 0 ? id.slice(2) : id.indexOf("b:voc:") === 0 ? id.slice(6) : null;
      if (w && w.length >= 4 && w.indexOf(" ") < 0 && (state.cards[id].ok || 0) >= 2) out.push(w);
    });
    return out;
  }
  // Real word or pseudo-word, in under a second (Segalowitz 2010; Elgort 2011).
  function parolaItem() {
    var pool = matureWords();
    var w = pool[Math.floor(Math.random() * pool.length)] || "casa";
    var fake = window.Freq && Freq.loaded() && Math.random() < 0.5 ? Freq.pseudo(w) : null;
    return { kind: "parole", stem: fake || w, real: !fake, options: [UI.wordYes, UI.wordNo],
             answer: fake ? UI.wordNo : UI.wordYes };
  }
  function lampoNext() { return lampo.mode === "parole" ? parolaItem() : Drills.lampoItem(state); }

  function startLampo(mode) {
    lampo = { end: Date.now() + LAMPO_MS, right: 0, wrong: 0, mode: mode === "parole" ? "parole" : "frasi",
              lock: false, timer: null, done: false };
    lampo.item = lampoNext();
    view.screen = "lampo";
    render();
    lampo.timer = setInterval(tickLampo, 100);
  }

  function tickLampo() {
    if (!lampo || lampo.done) return;
    var left = lampo.end - Date.now();
    var bar = $("#lbar"), sec = $("#lsec");
    if (bar) bar.style.width = Math.max(0, left / LAMPO_MS * 100) + "%";
    if (sec) sec.textContent = Math.max(0, Math.ceil(left / 1000)) + "″";
    if (left <= 0) finishLampo();
  }

  function renderLampo() {
    var it = lampo.item;
    return '<div class="hud"><span class="lsec" id="lsec">60″</span>' +
      '<span class="progressline lampobar"><i id="lbar" style="width:100%"></i></span>' +
      '<span class="combo">✓ ' + lampo.right + "</span>" +
      '<button class="btn ghost" id="lquit">✕</button></div>' +
      '<div class="card lampocard">' +
        '<div class="prompt">' + (lampo.mode === "parole" ? "🧠 ¿Es una palabra " + UI.wordAdj + "?" : "⚡ ¿Cómo se dice?") + "</div>" +
        '<div class="stem' + (lampo.mode === "parole" ? " big" : "") + '">' + esc(it.stem) + "</div>" +
        '<div class="options">' + it.options.map(function (o, k) {
          return '<button class="opt" data-lopt="' + k + '">' + esc(o) + "</button>";
        }).join("") + "</div>" +
      "</div>" +
      '<p class="muted center">Error = −3 segundos. Récord: ' + ((state.best || {})[lampo.mode === "parole" ? "lampoParole" : "lampo"] || 0) + "</p>";
  }

  function lampoAnswer(btn) {
    if (lampo.lock || lampo.done) return;
    lampo.lock = true;
    var it = lampo.item;
    var ok = btn.textContent === it.answer;
    btn.classList.add(ok ? "right" : "wrong");
    if (ok) { lampo.right++; fx.right(); }
    else {
      lampo.wrong++; fx.wrong();
      lampo.end -= 3000;
      document.querySelectorAll("[data-lopt]").forEach(function (b) {
        if (b.textContent === it.answer) b.classList.add("right");
      });
    }
    setTimeout(function () {
      if (lampo.done) return;
      lampo.item = lampoNext();
      lampo.lock = false;
      render();
      tickLampo();
    }, ok ? 220 : 900);
  }

  function finishLampo() {
    if (!lampo || lampo.done) return;
    lampo.done = true;
    clearInterval(lampo.timer);
    if (!state.best) state.best = {};
    var key = lampo.mode === "parole" ? "lampoParole" : "lampo";
    var record = lampo.right > (state.best[key] || 0);
    if (record) state.best[key] = lampo.right;
    var xp = lampo.right * (lampo.mode === "parole" ? 2 : 3);
    gain(xp);
    Engine.addStrand(state, "fluidez", xp);
    var won = Engine.checkBadges(state);
    persist();
    renderHeader();
    view.screen = "lampofine";
    view.result = { record: record, xp: xp, won: won };
    if (record && lampo.right > 0) { fx.goal(); confetti(); }
    render();
  }

  function renderLampoFine() {
    var r = view.result;
    return "<h1>" + (r.record ? "⚡ ¡Nuevo récord!" : "⚡ Tiempo") + "</h1>" +
      '<div class="card center"><div class="scorebig"><b>' + lampo.right +
      "</b><span>aciertos</span><span>+" + r.xp + " xp</span></div>" +
      '<p class="muted">Errores: ' + lampo.wrong + " · récord: " + state.best[lampo.mode === "parole" ? "lampoParole" : "lampo"] + "</p>" +
      ((r.won || []).map(function (b) {
        return "<p>🏅 <b>" + esc(b.name) + "</b> — " + esc(b.desc) + "</p>";
      }).join("")) +
      '<div class="row centerrow"><button class="btn" id="lagain">Otra vez</button>' +
      '<button class="btn ghost" id="toggi">Inicio</button></div></div>';
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
     tap away: every reading and listening, the Library, your stories, the
     reading speed, all the practice, and «Consultar». */
  function allMaterialCard() {
    var all = UI.allTabs || [["frasi", "🚣", UI.train], ["leggi", "📖", UI.read]];
    var desc = { frasi: "la práctica de todas las semanas: los ejercicios, los conceptos" +
                   (window.Trabajo && Trabajo.scenes().length ? ", las escenas de trabajo" : ""),
                 leggi: "todas las lecturas, la Biblioteca y tu velocidad de lectura" };
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
    var phrasesKnown = Object.keys(state.cards).filter(function (k) {
      return k.indexOf("frase:") === 0;
    }).length;
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
        (Frasi.ALL.length ? "<tr><td>Frases de conversación vistas</td><td>" + phrasesKnown + " / " +
          Frasi.ALL.length + "</td></tr>" +
        "<tr><td>Frases escritas de memoria</td><td>" + (state.written || 0) + "</td></tr>" : "") +
        "<tr><td>Récord " + UI.lampo + "</td><td>" + ((state.best || {}).lampo || 0) + "</td></tr>" +
        "<tr><td>Mejor combo</td><td>" + ((state.best || {}).combo || 0) + "</td></tr>" +
        "<tr><td>Respuestas totales</td><td>" + state.totals.attempts + "</td></tr>" +
        "<tr><td>Correctas</td><td>" + state.totals.right + "</td></tr>" +
        "<tr><td>Fichas en repaso</td><td>" + Object.keys(state.cards).length + "</td></tr>" +
        "<tr><td>Semana desbloqueada</td><td>" + state.unlocked + "/" + NW() + "</td></tr>" +
      "</table>" +
      (window.Voci && Voci.count() ? (function () {
        var cr = Voci.credits();
        return '<h3>🎙️ Voces reales</h3><p class="muted small">' + UI.suoni + " usa grabaciones de hablantes reales para " + Voci.count() +
          " palabras. Voces de Lingua Libre (Wikimedia Commons), licencia CC BY-SA 4.0: " + Object.keys(cr).map(esc).join(", ") + ".</p>";
      })() : "") +
      (window.VociCV && (VociCV.ALL || []).length ? '<h3>🗣️ Oraciones grabadas</h3><p class="muted small">El dictado de ' + UI.suoni + " y «¿Qué forma escuchaste?» usan " +
        VociCV.ALL.length + " oraciones leídas por voluntarios de Common Voice (Mozilla), de dominio público (CC0).</p>" : "") +
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
    return lessicoCard() + (window.Biblioteca ? Biblioteca.ioCard() : "");
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
        "<tr><td>" + UI.lampo + " · " + UI.wordOrNot + "</td><td>" + ((state.best || {}).lampo || 0) + " · " + ((state.best || {}).lampoParole || 0) + "</td></tr>" +
      "</table>" +
      '<div class="row" style="margin-top:10px"><button class="btn ghost" id="share">📤 Compartir mi semana</button></div>' +
      "</div>";
  }

  /* El léxico por frecuencia (Nation 2006; data/frequenza.json del paquete): cuánto del
     vocabulario de cada nivel conocés, y las palabras frecuentes que faltan,
     listas para practicar. */
  function knownWords() {
    return Freq.knownLemmas(state, {
      phrase: function (id) { var f = Frasi.BY_ID[id]; return f ? f.it : ""; },
      texts: Object.keys(state.letture || {}).map(function (id) { var ep = Letture.byId(id); return ep ? ep.text : ""; })
    });
  }
  // The frequent words up to the learner's level that the bank can teach.
  function freqGaps(n) {
    if (!window.Freq || !Freq.loaded() || !Banca.loaded()) return [];
    var lvl = "Nivel " + Engine.seasonOf(state.unlocked || 1);
    return Freq.nextWords(knownWords(), lvl, 400).filter(Banca.hasWord).slice(0, n || 10);
  }
  function lessicoCard() {
    if (!window.Freq || !Freq.loaded()) return "";
    var known = knownWords(), cov = Freq.coverage(known), gaps = freqGaps(8);
    var bars = ["A1", "A2", "B1", "B2", "C1"].map(function (l) {
      var c = cov.levels[l], p = c[1] ? Math.round(c[0] / c[1] * 100) : 0;
      return '<div class="eb"><span>' + l + "</span><i style=\"width:" + p + '%"></i><b>' + c[0] + " / " + c[1] + "</b></div>";
    }).join("");
    return '<div class="card"><h2>📚 Tu vocabulario</h2>' +
      '<p class="muted">' + UI.freqNote +
      "Conocés <b>" + cov.fundamental[0] + " / " + cov.fundamental[1] + "</b> de las fundamentales (A1 y A2).</p>" +
      '<div class="errbars">' + bars + "</div>" +
      (gaps.length ? '<p class="muted small" style="margin-top:10px">Frecuentes que te faltan: <i>' + gaps.map(esc).join(", ") + "</i>.</p>" +
        '<div class="row"><button class="btn" data-bank="b-freq">Practicar estas</button></div>' : "") +
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

  /* El cuaderno de la interlengua (itañol, portuñol): las interferencias
     que se fosilizan, con el estado de cada una.  La lista es del paquete
     (LANG.interlang.list, o una función que la lee del diagnóstico); las
     claves son categorías del diagnóstico (diagnosi.js). */
  var IL = LG.interlang || { title: "📓 Cuaderno", blurb: "", list: [] };
  /* The AI corrector: the key, and the corrections it disputed (so the
     learner can pass them on in one go instead of explaining each). */
  function aiCard() {
    var notes = state.aiNotes || [];
    return '<div class="card" id="aicard"><h2>🤖 Corrector con IA</h2>' +
      '<p class="muted small">Con una clave de Anthropic (Claude Haiku), la IA suma lo que ve a lo que marca el corrector de ' + UI.scrivi +
        ", da pistas antes de la respuesta («🤖 Explicame»), explica más en la hoja final y juzga las respuestas que el ejercicio no tenía previstas.</p>" +
      aiKeyFields() +
      (notes.length ? "<h3>Correcciones para revisar (" + notes.length + ")</h3>" +
        '<p class="muted small">Las respuestas que marcaste como válidas («🙋») y las que la IA cree que valían o que la app corrigió mal. ' +
          "Copialas (van con las explicaciones que la IA ya dio) y pegámelas todas juntas.</p>" +
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
      var label = l.l || (window.Diagnosi && Diagnosi.LABEL[l.cat]) || "";
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
        return '<div class="eb"><span>' + esc(Diagnosi.LABEL[c] || c) + "</span>" +
          '<i style="width:' + Math.round(e.n / max * 100) + '%"></i>' +
          "<b>" + e.n + (e.fixed ? ' <small>· ' + e.fixed + (e.fixed === 1 ? " corregido" : " corregidos") + "</small>" : "") + "</b></div>";
      }).join("") + "</div>" +
      ((state.errLog || []).length ? "<h3>Últimos</h3>" + errLogHtml(state.errLog.slice(0, 6)) : "") +
      (Banca.loaded() && Banca.weakest(state, 1).length
        ? '<div class="row" style="margin-top:12px"><button class="btn" data-bank="clinica">🩺 Ir a la clínica</button></div>' : "") +
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
    var inGame = ["gioco", "lampo", "lezione", "inicio"].indexOf(view.screen) >= 0;
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
    else if (s === "lampo") html = renderLampo();
    else if (s === "lampofine") html = renderLampoFine();
    else if (s === "leggi") html = renderLeggi();
    else if (s === "lettura") html = renderLettura(Letture.byId(view.ep));
    else if (s === "lezione") html = renderLezione();
    else if (s === "scrivi") html = renderScrivi(course.weeks[view.week - 1]);
    else if (s === "eplus" && window.EscrituraPlus) html = EscrituraPlus.render(epHost());
    else if (s === "dictogloss") html = renderDictogloss(course.weeks[view.week - 1]);
    else if (s === "parla") html = renderParla(course.weeks[view.week - 1]);
    else if (s === "esame") html = renderEsame();
    else if (s === "esame-asc") html = renderEsameAscolto();
    else if (s === "esame-let") html = renderEsameLettura();
    else if (s === "esame-scr") html = renderEsameScrittura();
    else if (s === "storia") html = renderStoria(course.weeks[view.week - 1]);
    else if (s === "gramatica") html = Referencia.page();
    else if (s === "ubicacion" && window.Ubicacion) html = Ubicacion.html();
    else if (s === "tres" && window.TresLenguas) html = TresLenguas.render(state);
    else if (s === "escritos" && window.Escritos) html = Escritos.render();
    else if (window.Biblioteca && Biblioteca.owns(s)) html = Biblioteca.render(s, view);
    else if (window.Tramo && Tramo.owns(s)) html = Tramo.render(s);
    else if (window.Inicio && Inicio.owns(s)) html = Inicio.render(s);          // el primer arranque (inicio.js)
    else if (window.Progreso && Progreso.owns(s)) html = Progreso.render(s);    // tu progreso (progreso.js)
    else if (window.Capas && Capas.owns(s)) html = Capas.render(s);   // «Consultar» (js/capas.js)
    else if (window.Fuera && Fuera.owns(s)) html = Fuera.render(s);   // fuera de la app (fuera.js)
    else if (window.Seminario && Seminario.owns(s)) html = Seminario.render(s);   // el seminario y los dilemas (seminario.js)
    else if (window.Trabajo && Trabajo.owns(s)) html = Trabajo.render(s);   // para el trabajo (trabajo.js)

    var gb = $("#glossbox");
    if (gb) gb.classList.remove("on");
    guardUntil = Date.now() + 300;
    guardAt = lastTap;
    // Inside a game or a text, the phone's back button returns to the tab
    // instead of closing the app.
    if (TABS.every(function (t) { return t[0] !== s; }) && !subEntry && window.history && history.pushState) {
      try { history.pushState({ sub: 1 }, ""); subEntry = true; } catch (e) { /* */ }
    }
    app().innerHTML = html;
    langBoxes(app());   // before anything takes the focus: the keyboard reads the box's lang when it opens
    document.body.classList.toggle("ingame", s === "gioco" || s === "lampo" || s === "lezione");
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
    Ubicacion.start({ course: course, state: state, render: render, done: function (applied, next) {
      persist();
      renderHeader();
      if (typeof then === "function") { view.week = Math.min(state.unlocked, NW()); then(applied); return; }
      // the mini diagnosis of interference, right after the test
      if (applied && next === "diag") { view.week = Math.min(state.unlocked, NW()); view.tab = "oggi"; startRound("diag"); if (view.screen === "gioco") return; }
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
    if (["gioco", "lampo", "lettura"].indexOf(view.screen) < 0) render();
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
    document.querySelectorAll("[data-scene]").forEach(function (b) {
      b.onclick = function () { startRound("scene", b.dataset.scene); };
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
    if (window.TresLenguas) TresLenguas.wire(app(), {
      state: function () { return state; }, persist: persist,
      show: function () { view.tab = "frasi"; view.screen = "tres"; render(); window.scrollTo(0, 0); },
      back: function () { go("frasi"); }, gain: function (n) { gain(n); persist(); renderHeader(); }, toast: toast });

    // hoje
    on("#pausa", function () { startRound("pausa"); });
    on("#giorno", function () { startRound("giorno"); });
    on("#lampo", function () { startLampo("frasi"); });
    on("#scena", function () { startRound("scene", Drills.nextScene(state).id); });
    on("#rev", function () { startRound("review"); });
    on("#sayfdg", function () { var fd = phraseOfTheDay(); speak(fd[LG.code] || fd.it, true); });
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
    on("#gym", function () { startRound("gym"); });
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
    if (window.Tramo) Tramo.wire(view.screen);
    if (window.Inicio) Inicio.wire(view.screen);
    if (window.Progreso) Progreso.wire(view.screen);
    if (window.Capas) Capas.wire(view.screen);
    if (window.Fuera) Fuera.wire(view.screen);
    if (window.Seminario) Seminario.wire(view.screen);
    if (window.Trabajo) Trabajo.wire(view.screen);
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
      if (round.kind === "trabajo" && window.Trabajo && Trabajo.reopen(round.arg)) return;   // back to the scene (trabajo.js)
      if (round.from === "briefing") { view.tab = "percorso"; view.screen = "briefing"; render(); window.scrollTo(0, 0); }
      else if (round.from === "hoy") go("oggi");
      else if (round.kind === "lettura") go("leggi");
      else if (["ponte", "falsi", "capire", "scene", "b-voc", "b-forme", "b-tr", "b-gap", "b-err", "b-ident", "b-freq", "clinica", "suoni", "duello", "variaciones"].indexOf(round.kind) >= 0) go("frasi");
      else if (round.kind === "pausa" || round.kind === "review" || round.kind === "giorno" || round.kind === "ritorno" || round.kind === "micro" || round.kind === "dos") go("oggi");
      else if (round.kind === "sfida") { view.screen = "sfide"; render(); }
      else if (round.kind === "esame") { view.screen = "esame"; render(); }
      else { view.screen = "briefing"; render(); }
    });

    // ler y laboratorio
    document.querySelectorAll("[data-bank]").forEach(function (b) {
      b.onclick = function () { startRound(b.dataset.bank); };
    });
    document.querySelectorAll("[data-lab]").forEach(function (b) {
      b.onclick = function () { startRound(b.dataset.lab); };
    });
    document.querySelectorAll("[data-duel]").forEach(function (b) {
      b.onclick = function () { startRound("duello", b.dataset.duel); };
    });
    document.querySelectorAll("[data-ep]").forEach(function (b) {
      b.onclick = function () {
        view.ep = b.dataset.ep;
        view.epFrom = null;
        view.tab = "leggi";
        view.screen = "lettura";
        render();
        window.scrollTo(0, 0);
      };
    });
    on("#lback", function () {
      readClock = null;
      if (view.epFrom === "briefing") { view.epFrom = null; view.tab = "percorso"; view.screen = "briefing"; render(); window.scrollTo(0, 0); }
      else if (view.epFrom === "hoy") { view.epFrom = null; go("oggi"); }
      else go("leggi");
    });
    on("#lquiz", function () {
      var ep = Letture.byId(view.ep);
      if (ep && readClock && readClock.id === ep.id && Letture.speedNote) {
        Letture.speedNote(state, ep, readElapsed(), { kar: readClock.kar, week: Math.min(state.unlocked || 1, NW()) });
        persist();
      }
      readClock = null;
      startRound("lettura", view.ep);
    });
    noteReadingSpeed();
    on("#playlib", function () {
      var ids = Object.keys(state.letture || {}).filter(function (id) { return Letture.byId(id); });
      if (!ids.length) return toast("Todavía no terminaste ninguna lectura.");
      playLibrary(Drills.shuffle(ids));
    });
    document.querySelectorAll("[data-sg]").forEach(function (b) {
      b.onclick = function () { showGloss(stemGloss[+b.dataset.sg]); };
    });
    document.querySelectorAll("[data-mc]").forEach(function (b) {
      b.onclick = function () { askGloss(b); };
    });
    document.querySelectorAll("[data-gl]").forEach(function (b) {
      b.onclick = function () {
        showGloss(glossIndex[+b.dataset.gl]);
        speak(Letture.bare(b.textContent), false);
      };
    });

    // relâmpago
    document.querySelectorAll("[data-lopt]").forEach(function (b) {
      b.onclick = function () { lampoAnswer(b); };
    });
    on("#lquit", function () { go("oggi"); });
    on("#lagain", function () { startLampo(lampo.mode); });
    on("#lampoparole", function () { startLampo("parole"); });

    var mcb = $("#mcbox");
    if (mcb && view.screen !== "lettura") mcb.classList.remove("on");
    wireGioco();
    wireIo();
    wireScrivi();
    if (view.screen === "eplus" && window.EscrituraPlus) EscrituraPlus.wire(epHost());
    wireDictogloss();
    wireLettura();
    wireParla();
    wireStoria();
    wireEsame();

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

  /* ------------------------------------------------------------ dictogloss */

  /* Dictogloss (Wajnryb 1990; Swain & Lapkin): hear the text twice, note
     key words the second time, reconstruct it in writing.  Scored by the
     six chunks recovered (Yu, Boers & Tremblay 2025), then the local
     checker marks the rest. */
  var dg = null;
  // The expressions of a dictogloss that nothing has taught yet (t.gloss:
  // {expresión: significado}): shown before listening and with the text.
  function dgGlossHtml(t) {
    var g = t.gloss || {}, k = Object.keys(g);
    if (!k.length) return "";
    return '<details class="trgloss"' + (dg && dg.step === 0 ? " open" : "") + '><summary>Expresiones del audio que conviene saber</summary><ul>' +
      k.map(function (w) { return '<li><b lang="' + LG.tts + '">' + esc(w) + "</b> — " + esc(g[w]) + "</li>"; }).join("") + "</ul></details>";
  }

  function renderDictogloss(w) {
    var t = Suoni.dgFor(w.week);
    if (!t) return '<button class="btn ghost" id="dgback">← a la semana</button><p>Esta semana no tiene dictogloss.</p>';
    if (!dg || dg.week !== w.week) dg = { week: w.week, step: 0, plays: 0 };
    var done = (state.dictogloss || {})[w.week];
    var head = '<button class="btn ghost" id="dgback">← a la semana</button>' +
      plate("Dictogloss · " + UI.week + " " + weekNum(w.week), esc(t.title));
    if (dg.step === 0) {
      var second = dg.plays >= 1;
      return head + '<div class="card"><p>' + esc(t.es) + "</p>" + dgGlossHtml(t) +
        '<p class="muted">Vas a escuchar el texto <b>dos veces</b>. La primera, solo escuchá. En la segunda, anotá acá abajo ' +
        "las palabras que puedas. Después lo reconstruís en la app, con tus notas a la vista: no hace falta que sea igual, " +
        "sino que diga lo mismo con las expresiones del texto. Se puntúan <b>seis bloques</b>.</p>" +
        (done ? '<p class="note">Ya lo hiciste: ' + done.found + " / " + done.n + " bloques. Podés repetirlo.</p>" : "") +
        '<div class="center"><button class="bigplay" id="dgplay">🔊</button><p class="muted" id="dgstate">' +
          (dg.plays >= 2 ? "Listo: ahora reconstruilo" : second ? "Escucha 2 de 2: anotá mientras escuchás" : "Escucha 1 de 2") + "</p></div>" +
        '<div id="dgkeys">' + (second ? dgKeysHtml(t) : "") + "</div>" +
        '<label class="dgnotes"' + (second ? "" : " hidden") + '><span class="muted small">📝 Tus notas (palabras sueltas, como salgan)</span>' +
          '<textarea id="dgnotes" class="grow" rows="3" spellcheck="false" autocapitalize="off" autocomplete="off" placeholder="' + UI.dgNotes + '">' +
          esc(dg.notes || "") + "</textarea></label>" +
        '<button class="btn wide" id="dgwrite"' + (dg.plays >= 2 ? "" : " disabled") + '>Ya escuché las dos → reconstruir</button></div>';
    }
    if (dg.step === 1) {
      return head + '<div class="card">' +
        (dg.notes && dg.notes.trim() ? '<p class="muted small">📝 Tus notas</p><p class="dgnotesview it">' + esc(dg.notes) + "</p>" : "") +
        dgKeysHtml(t) +
        '<p class="muted small">Escribí acá el texto en ' + UI.langEs + ": lo que recordás y tus notas, con tus palabras donde haga falta. " +
        "Bloques a recuperar: " + t.chunks.length + ".</p>" +
        '<textarea id="dgtext" class="grow scrivi" rows="7" spellcheck="false" autocapitalize="sentences" placeholder="' + UI.dgText + '">' + esc(dg.given || "") + "</textarea>" +
        '<div class="row" style="margin-top:10px"><button class="btn" id="dgcheck">' + UI.check + "</button>" +
        '<button class="tab" id="dgagain">🔊 escuchar otra vez (cuenta como ayuda)</button></div>' +
        '<div id="dgout"></div></div>';
    }
    var r = dg.result;
    var casi = r.partial || [], other = r.variant || [];
    return head + '<div class="card"><div class="scorebig"><b>' + r.found.length + (casi.length ? " + " + casi.length + " casi" : "") + " / " + r.n + '</b><span>bloques recuperados</span><span>+' + dg.xp + " xp</span></div>" +
      '<h3>El texto</h3><p class="muted small"><mark class="dgok">verde</mark>: lo recuperaste' + (casi.length ? ' · <mark class="dgcasi">amarillo</mark>: casi' : "") + ' · <mark class="dgmiss">rojo</mark>: faltó</p>' +
      '<p class="model it" lang="' + LG.tts + '">' + dgMarked(t.text, r) + "</p>" + dgGlossHtml(t) +
      (other.length ? '<h3>Los dijiste de otra forma</h3><p class="muted small">Cuentan enteros. Así estaban en el texto, para que notes la diferencia:</p><p lang="' + LG.tts + '">' + other.map(function (c) { return "<b>" + esc(c) + "</b>"; }).join(" · ") + "</p>" : "") +
      (casi.length ? '<h3>Casi</h3><p class="muted small">Tenías parte de estos bloques (medio punto cada uno):</p><p lang="' + LG.tts + '">' + casi.map(esc).join(" · ") + "</p>" : "") +
      (r.missed.length ? '<h3>Faltaron</h3><p lang="' + LG.tts + '">' + r.missed.map(esc).join(" · ") + "</p>" : "") +
      '<h3>Tu versión</h3><p class="dgnotesview it">' + esc(dg.given || "") + "</p>" +
      (dg.findings && dg.findings.length ? "<h3>Para revisar en tu versión</h3><ol class=\"findings\">" + dg.findings.map(function (f) { return "<li>" + mk(f.msg) + "</li>"; }).join("") + "</ol>" : "") +
      '<div class="row" style="margin-top:14px"><button class="btn" id="dgback2">← Seguir ' + UI.pathEl + "</button>" +
      '<button class="btn ghost" id="dgredo">Otra vez</button></div></div>';
  }
  function dgKeysHtml(t) {
    return '<p class="muted small">Palabras clave: <i>' + t.keywords.map(esc).join(" · ") + "</i></p>";
  }
  // The original text with each chunk marked: recovered in green, missed in red.
  function dgMarked(text, r) {
    var marks = [];
    [[r.found, "dgok"], [r.partial || [], "dgcasi"], [r.missed, "dgmiss"]].forEach(function (g) {
      g[0].forEach(function (c) {
        var at = text.toLowerCase().indexOf(String(c).toLowerCase());
        if (at >= 0 && !marks.some(function (m) { return at < m.end && at + c.length > m.at; })) marks.push({ at: at, end: at + c.length, cls: g[1] });
      });
    });
    marks.sort(function (a, b) { return a.at - b.at; });
    var out = "", pos = 0;
    marks.forEach(function (m) {
      out += esc(text.slice(pos, m.at)) + '<mark class="' + m.cls + '">' + esc(text.slice(m.at, m.end)) + "</mark>";
      pos = m.end;
    });
    return out + esc(text.slice(pos));
  }
  function wireDictogloss() {
    if (view.screen !== "dictogloss") return;
    var w = course.weeks[view.week - 1], t = Suoni.dgFor(w.week);
    var back = function () { dg = null; window.speechSynthesis && speechSynthesis.cancel(); view.tab = "percorso"; view.screen = "briefing"; render(); window.scrollTo(0, 0); };
    on("#dgback", back); on("#dgback2", back);
    if (!t) return;
    on("#dgplay", function () {
      var b = $("#dgplay"), st = $("#dgstate");
      if (!b || b.disabled) return;
      b.disabled = true;
      var second = dg.plays >= 1;
      if (second) {
        var k = $("#dgkeys"); if (k) k.innerHTML = dgKeysHtml(t);
        var nl = document.querySelector(".dgnotes"); if (nl) nl.hidden = false;
        var nt = $("#dgnotes"); if (nt) nt.focus();
      }
      if (st) st.textContent = second ? "Escucha 2 de 2: anotá mientras escuchás…" : "Escucha 1 de 2…";
      speak(t.text, true, 0.95, { onend: function () {
        dg.plays++;
        b.disabled = false;
        if (st) st.textContent = dg.plays >= 2 ? "Listo: ahora reconstruilo" : "Escucha 2 de 2: tocá 🔊 y anotá mientras escuchás";
        var wbtn = $("#dgwrite");
        if (wbtn && dg.plays >= 2) wbtn.disabled = false;
        noteListening(t.text.split(/\s+/).length * 0.45);
      } });
    });
    var notes = $("#dgnotes");
    if (notes) notes.oninput = function () { dg.notes = notes.value; };
    var draft = $("#dgtext");
    if (draft) draft.oninput = function () { dg.given = draft.value; };
    on("#dgwrite", function () { var n = $("#dgnotes"); if (n) dg.notes = n.value; dg.step = 1; render(); window.scrollTo(0, 0); });
    on("#dgagain", function () { dg.help = (dg.help || 0) + 1; speak(t.text, true, 0.95); });
    on("#dgcheck", function () {
      var box = $("#dgtext"), given = box ? box.value : "";
      if (!given.trim()) return;
      dg.given = given;
      var r = Suoni.dgScore(t, given);
      scriviLexicon();
      var chk = Scrivi.check(given, w.week);
      dg.findings = (chk.findings || []).filter(function (f) { return !f.soft; }).slice(0, 8);
      var first = !(state.dictogloss || {})[w.week];
      var xp = r.found.length * 8 + (r.partial || []).length * 4 + (r.found.length >= 5 ? 20 : 0) - Math.min(20, (dg.help || 0) * 5);
      xp = Math.max(5, first ? xp : Math.round(xp / 3));
      if (!state.dictogloss) state.dictogloss = {};
      var prev = state.dictogloss[w.week];
      state.dictogloss[w.week] = { found: Math.max(r.found.length, prev ? prev.found : 0), n: r.n, at: Date.now() };
      var before = doneCount(w);
      gain(xp);
      Engine.addStrand(state, "input", Math.round(xp / 2));
      Engine.addStrand(state, "output", Math.round(xp / 2));
      Engine.touchStreak(state);
      // what the checker saw goes to the profile: what was written, the correction and why
      if (window.Errores) Errores.recordFindings(state, dg.findings, given, {});
      // the blocks not recovered come back tomorrow, each one as a gap (reglas.js)
      if (window.Reglas) Reglas.fromDictogloss(state, t, r, w.week);
      dg.extras = missionCheck(w.week, before);
      Engine.checkBadges(state);
      persist();
      renderHeader();
      dg.result = r; dg.xp = xp; dg.step = 2;
      render();
      if (r.found.length >= 5) setTimeout(confetti, 200);
      window.scrollTo(0, 0);
    });
    on("#dgredo", function () { dg = { week: w.week, step: 0, plays: 0 }; render(); });
  }

  /* --------------------------------------------------- leer y escuchar */

  /* Listening time counts as input (Nation's first strand): one xp per
     ten seconds, thirty a day at most. */
  function noteListening(seconds) {
    if (!seconds) return;
    var k = Engine.dayKey();
    if (!state.ascolto) state.ascolto = {};
    var d = state.ascolto[k] || (state.ascolto[k] = { sec: 0, xp: 0 });
    d.sec += Math.round(seconds);
    var xp = Math.min(30 - d.xp, Math.floor(seconds / 10));
    if (xp > 0) { d.xp += xp; gain(xp); Engine.addStrand(state, "input", xp); }
    Object.keys(state.ascolto).forEach(function (kk) { if (Engine.daysBetween(kk, k) > 30) delete state.ascolto[kk]; });
    persist();
  }
  function listeningWeek() {
    var k = Engine.dayKey(), sec = 0;
    Object.keys(state.ascolto || {}).forEach(function (kk) { if (Engine.daysBetween(kk, k) < 7) sec += state.ascolto[kk].sec || 0; });
    return Math.round(sec / 60);
  }

  var karaoke = null;   // { ep, rate, mode: "full" | "partial" | "audio", par, u }
  function stopKaraoke() {
    if (karaoke && window.speechSynthesis) speechSynthesis.cancel();
    karaoke = null;
    document.querySelectorAll(".text .w.now").forEach(function (e) { e.classList.remove("now"); });
  }
  /* Reading while listening (Webb & Chang 2015): the word being said lights
     up (SpeechSynthesisUtterance.onboundary); a speed ladder 0.8 → 1 →
     1.15 (Zhao 1997: the learner controls the pace, then goes faster);
     partial captions (Mirzaei et al. 2017): only the glossed words stay. */
  function startKaraoke(ep, rate, mode) {
    stopKaraoke();
    karaoke = { ep: ep, rate: rate || 1, mode: mode || "full", par: 0, started: Date.now() };
    var pars = Letture.paragraphs(ep);
    var offsets = [], k = 0;
    pars.forEach(function (p) { var toks = Letture.tokens(p), o = [], pos = 0; toks.forEach(function (t) { var at = p.indexOf(t, pos); o.push([at, k++]); pos = at + t.length; }); offsets.push(o); });
    document.body.classList.toggle("kar-partial", karaoke.mode === "partial");
    document.body.classList.toggle("kar-audio", karaoke.mode === "audio");
    function next() {
      if (!karaoke || karaoke.par >= pars.length) {
        if (karaoke) noteListening((Date.now() - karaoke.started) / 1000);
        stopKaraoke();
        document.body.classList.remove("kar-partial", "kar-audio");
        var b = $("#karplay"); if (b) b.textContent = "🎧 " + UI.karaoke;
        return;
      }
      var i = karaoke.par, off = offsets[i];
      speak(pars[i], true, karaoke.rate, { keep: true,
        onboundary: function (e) {
          if (!karaoke || e.name !== "word") return;
          var idx = -1;
          for (var j = 0; j < off.length; j++) if (off[j][0] <= e.charIndex) idx = off[j][1];
          document.querySelectorAll(".text .w.now").forEach(function (x) { x.classList.remove("now"); });
          var el = document.querySelector('.text .w[data-k="' + idx + '"]');
          if (el) { el.classList.add("now"); }
        },
        onend: function () { if (karaoke) { karaoke.par++; next(); } } });
    }
    next();
    mediaSession(ep.title, function () { stopKaraoke(); });
  }
  // The lock screen shows what plays and can pause it (Media Session API).
  function mediaSession(title, onStop) {
    if (!("mediaSession" in navigator)) return;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({ title: title, artist: LG.brand, album: UI.karaoke });
      navigator.mediaSession.setActionHandler("pause", function () { speechSynthesis.pause(); });
      navigator.mediaSession.setActionHandler("play", function () { speechSynthesis.resume(); });
      navigator.mediaSession.setActionHandler("stop", function () { onStop && onStop(); });
    } catch (e) { /* nada */ }
  }
  // Extensive listening: every reading already done, one after the other,
  // audio only (familiar material: Nation's fluency condition).
  function playLibrary(ids) {
    var list = ids.slice(), started = Date.now();
    (function next() {
      var id = list.shift();
      if (!id) { noteListening((Date.now() - started) / 1000); toast("🎧 Fin de la biblioteca de audio."); return; }
      var ep = Letture.byId(id);
      if (!ep) return next();
      toast("🎧 " + ep.title, 2500);
      mediaSession(ep.title, function () { list = []; speechSynthesis.cancel(); });
      speak(ep.text, true, 1, { onend: next });
    })();
  }
  function wireLettura() {
    if (view.screen !== "lettura") { readClock = null; return; }   // salir del texto para el reloj
    var ep = Letture.byId(view.ep);
    if (!ep) return;
    var rate = view.karRate || 1;
    on("#karplay", function () {
      var b = $("#karplay");
      if (karaoke) { stopKaraoke(); document.body.classList.remove("kar-partial", "kar-audio"); if (b) b.textContent = "🎧 " + UI.karaoke; return; }
      var mode = (document.querySelector("[data-karmode].on") || {}).dataset ? document.querySelector("[data-karmode].on").dataset.karmode : "full";
      if (b) b.textContent = "⏹ Parar";
      if (readClock && readClock.id === ep.id) readClock.kar = true;   // con audio fue escucha: no se cronometra
      startKaraoke(ep, rate, mode);
    });
    document.querySelectorAll("[data-rate]").forEach(function (b) {
      b.onclick = function () {
        view.karRate = +b.dataset.rate;
        document.querySelectorAll("[data-rate]").forEach(function (x) { x.classList.toggle("on", x === b); });
        if (karaoke) startKaraoke(ep, view.karRate, karaoke.mode);
      };
    });
    document.querySelectorAll("[data-karmode]").forEach(function (b) {
      b.onclick = function () {
        document.querySelectorAll("[data-karmode]").forEach(function (x) { x.classList.toggle("on", x === b); });
        document.body.classList.toggle("kar-partial", b.dataset.karmode === "partial" && !!karaoke);
        document.body.classList.toggle("kar-audio", b.dataset.karmode === "audio" && !!karaoke);
        if (karaoke) karaoke.mode = b.dataset.karmode;
      };
    });
    on("#enh", function () { view.enh = true; render(); window.scrollTo(0, 0); });
    on("#enhoff", function () { view.enh = false; render(); });
  }

  /* ------------------------------------------------------------------ fale */

  // The level, tenses and vocabulary the AI must stay inside this week.
  function aiContext(w) {
    var level = w.week <= 8 ? "A1" : w.week <= 18 ? "A2" : w.week <= 30 ? "B1" : w.week <= 42 ? "B2" : "C1";
    var tenses = (w.known || ["presente"]).map(function (t) { return Conj.TENSE_LABELS[t] || t; }).join(", ");
    var known = window.Freq && Freq.loaded() ? knownWords() : {};
    // the words to hand the model: the learner's most frequent known words plus the week's
    var list = Object.keys(known).filter(function (l) { return Freq.STOP.indexOf(l) < 0 && l.length > 2; });
    if (window.Freq && Freq.loaded()) list.sort(function (a, b) { return Freq.zipf(b) - Freq.zipf(a); });
    (w.vocab || []).forEach(function (v) { if (list.indexOf(v[0]) < 0) list.unshift(v[0]); });
    return { level: level, week: w.week, fare: w.fare || w.title, tema: w.tema || "", tenses: tenses,
             maxWords: w.week <= 8 ? 10 : w.week <= 18 ? 14 : w.week <= 30 ? 18 : 25,
             words: list.slice(0, 220), known: known };
  }
  // Token miss rate against what the learner knows: above 15 % the reply
  // is sent back to be rewritten (Dugan et al. 2026).
  function tooHard(text) {
    if (!window.Freq || !Freq.loaded()) return null;
    var mr = Freq.missRate(text, knownWords());
    return mr.n >= 4 && mr.rate > 0.15 ? mr : null;
  }

  // What the local checker marks in a text the AI wrote: the AI's language
  // is checked before the learner reads it («una ragazzo», «em o Rio»).
  function langErrors(text, week) {
    if (!window.Scrivi) return [];
    scriviLexicon();
    var r = Scrivi.check(String(text || ""), week || 52);
    return ((r && r.findings) || []).filter(function (f) { return !f.soft; });
  }
  // Milliseconds as «1,4».
  function secs(ms) { return (Math.round((+ms || 0) / 100) / 10).toFixed(1).replace(".", ","); }
  // A capital at the start of every sentence.
  function sentenceCase(text) {
    return String(text || "").replace(/(^|[.!?]\s+|\n\s*)([a-zà-ÿ])/g, function (m, a, b) { return a + b.toUpperCase(); });
  }

  var parla = null;   // { week, scen, history, done, recasts, notes, obj, turns, busy }
  function renderParla(w) {
    var head = '<button class="btn ghost" id="pback">← a la semana</button>' +
      plate(UI.parla + " · " + UI.week + " " + weekNum(w.week), esc(parla && parla.scen ? parla.scen.titolo : "Role-play"));
    if (!aiKey()) return head + '<div class="card"><p>Para hablar con la IA hace falta una clave de Anthropic. <a href="#" id="aigo2">Cargala en ' + UI.me + " →</a></p></div>";
    if (!parla || parla.week !== w.week) {
      return head + '<div class="card"><p>Un personaje te espera con una situación de la semana (<b>' + esc(w.fare || w.title) + "</b>). " +
        "Tenés que conseguir <b>tres objetivos</b> escribiendo en " + UI.langEs + ". La IA no te corrige mientras hablan: al final ves tus frases " +
        "junto a la versión corregida, con una observación por turno.</p>" +
        '<p class="muted small">🔬 Vacío de información con reglas duras (Wang et al. 2025, g = 0,48). La app controla que el personaje use ' +
        "palabras que ya conocés; si se pasa, le pide que lo reescriba.</p>" +
        '<button class="btn wide" id="pstart">🎭 Empezar</button><div id="pout"></div></div>';
    }
    var sc = parla.scen;
    var objs = parlaObjs();
    var chat = '<div class="chat" aria-live="polite">' + parla.history.map(function (h) {
      return '<div class="bubble ' + (h[0] === "ia" ? "ia" : "me") + '"' + (h[0] === "ia" ? ' lang="' + LG.tts + '"' : "") + ">" + esc(h[1]) +
        (h[2] ? '<small class="easy">🪜 Más fácil: <span lang="' + LG.tts + '">' + esc(h[2]) + "</span></small>" : "") + "</div>";
    }).join("") + (parla.busy ? '<div class="bubble ia" id="plive"' + (parla.live ? "" : ' aria-label="escribiendo"') + ">" + (parla.live ? esc(parla.live) : '<span class="typing"><i></i><i></i><i></i></span>') + "</div>" : "") + "</div>" +
      (parla.meta ? '<p class="muted small modelline">IA: ' + esc(parla.meta.provider + " · " + parla.meta.model) + " · " + secs(parla.meta.first) + " s hasta la primera palabra</p>" : "");
    if (parla.done) {
      var rec = parla.reviewing ? '<p class="muted">⏳ Revisando tus frases…</p>' : parla.recasts.length ? '<h3>Tus frases, corregidas</h3><table class="res">' + parla.recasts.map(function (r) {
        return "<tr><td>" + esc(r[0]) + "</td><td><b>" + esc(r[1]) + "</b>" + (r[2] ? '<br><small class="muted">' + esc(r[2]) + "</small>" : "") + "</td></tr>";
      }).join("") + "</table>" : "<p>✨ Ninguna frase necesitó corrección.</p>";
      return head + '<div class="card"><div class="scorebig"><b>' + parla.obj.length + " / 3</b><span>objetivos</span><span>+" + parla.xp + " xp</span></div>" +
        objs + rec + chat +
        '<div class="row" style="margin-top:12px"><button class="btn" id="pback2">← Seguir ' + UI.pathEl + '</button><button class="btn ghost" id="pagain">Otro role-play</button></div></div>';
    }
    return head + '<div class="card"><p class="muted">' + esc(sc.situazione_es) + "</p>" + objs +
      '<p class="muted small">Palabras útiles: <i>' + (sc.parole_utili || []).map(esc).join(" · ") + "</i></p>" + chat +
      (parla.retry && !parla.busy ? '<p class="muted small">⚠️ La IA no respondió (' + esc(parla.retry.msg) + "). Tu frase quedó abajo: tocá <b>" + UI.send + "</b> para mandarla de nuevo.</p>" : "") +
      '<div class="typed"><textarea id="ptext" class="grow" rows="1" autocomplete="off" autocapitalize="sentences" autocorrect="off" spellcheck="false" enterkeyhint="send" placeholder="' + UI.parlaIn + '"' + (parla.busy ? " disabled" : "") + ">" +
      (parla.retry && !parla.busy ? esc(parla.retry.text) : "") + "</textarea>" +
      '<button class="btn" id="psend"' + (parla.busy ? " disabled" : "") + ">" + UI.send + "</button></div>" +
      '<div class="row" style="margin-top:8px"><button class="tab" id="pend">Terminar acá</button></div></div>';
  }
  // The three goals: reached ones ticked; a pending one can be ticked by
  // hand when the learner knows it got it and the AI did not see it.
  function parlaObjs() {
    var sc = parla.scen, done = !!parla.done;
    return '<ul class="reqs objs">' + sc.obiettivi.map(function (o, i) {
      var ok = parla.obj.indexOf(i + 1) >= 0, byHand = (parla.hand || {})[i + 1];
      var label = (ok ? "✓" : "○") + " " + esc(o) + (byHand ? ' <small class="muted">(marcado por vos)</small>' : "");
      return '<li class="' + (ok ? "ok" : "") + '">' + (done ? label :
        '<button class="objbtn" data-obj="' + (i + 1) + '" aria-pressed="' + (ok ? "true" : "false") + '">' + label + "</button>") + "</li>";
    }).join("") + "</ul>" + (done ? "" : '<p class="muted small">Si cumpliste un objetivo y no se marcó, tocalo.</p>');
  }
  function refreshObjs() {
    var ul = document.querySelector(".objs");
    if (!ul || !parla) return;
    var box = document.createElement("div");
    box.innerHTML = parlaObjs();
    ul.parentNode.replaceChild(box.firstChild, ul);
    wireObjs();
  }
  function wireObjs() {
    document.querySelectorAll(".objbtn").forEach(function (b) {
      b.onclick = function () {
        var n = +b.dataset.obj, at = parla.obj.indexOf(n);
        if (!parla.hand) parla.hand = {};
        if (at < 0) { parla.obj.push(n); parla.hand[n] = 1; }
        else if (parla.hand[n]) { parla.obj.splice(at, 1); delete parla.hand[n]; }
        refreshObjs();
      };
    });
  }
  function wireParla() {
    if (view.screen !== "parla") return;
    var w = course.weeks[view.week - 1];
    var back = function () { view.tab = "percorso"; view.screen = "briefing"; render(); window.scrollTo(0, 0); };
    on("#pback", back); on("#pback2", back);
    on("#aigo2", function (e) { e.preventDefault(); go("io"); });
    on("#pstart", function () {
      var ctx = aiContext(w), out = $("#pout"), b = $("#pstart");
      if (b) b.disabled = true;
      if (out) out.innerHTML = '<p class="muted small">⏳ La IA arma la escena…</p>';
      Scrivi.parlaStart(ctx, aiKeys(), function (err, data) {
        if (view.screen !== "parla") return;
        if (err || !data || !data.obiettivi) { if (out) out.innerHTML = '<p class="muted small">No pude usar la IA (' + esc(String(err && err.message || "respuesta rara")) + ").</p>"; if (b) b.disabled = false; return; }
        data.obiettivi = data.obiettivi.slice(0, 3);
        parla = { week: w.week, scen: data, history: [["ia", String(data.apertura || UI.hi)]], done: false, recasts: [], obj: [], turns: 0, busy: false, ctx: ctx };
        render();
        speak(data.apertura);
      });
    });
    var send = function () {
      var box = $("#ptext"), text = box ? box.value.trim() : "";
      if (!text || parla.busy) return;
      parla.history.push(["me", text]);
      parla.turns++;
      parla.busy = true;
      parla.live = "";
      render();
      var p0 = parla;
      // the character's line appears while it is being written; only that
      // bubble changes, the rest of the screen stays put
      var stream = function (raw) {
        if (parla !== p0) return;
        var f = window.IA && IA.partialField(raw, "risposta");
        if (!f || !f.text || f.text === parla.live) return;
        parla.live = f.text;
        var el = $("#plive");
        if (el) { el.textContent = sentenceCase(f.text); el.removeAttribute("aria-label"); }
      };
      // Which goals are reached, judged apart and at the same time (the
      // character, busy answering, forgot to mark them).
      if (Scrivi.parlaGoals) Scrivi.parlaGoals(parla.scen, parla.history.slice(-16), aiKeys(), function (e3, d3) {
        if (parla !== p0 || e3 || !d3 || !Array.isArray(d3.cumplidos)) return;
        d3.cumplidos.forEach(function (n) { n = +n; if (n >= 1 && n <= 3 && parla.obj.indexOf(n) < 0) parla.obj.push(n); });
        if (view.screen !== "parla" || parla.done) return;
        refreshObjs();
        if (!parla.busy && parla.obj.length >= 3) endParla(w);
      });
      // the conversation before this turn (the turn itself goes apart), and
      // the goals already reached, so the character leads to the others
      Scrivi.parlaTurn(parla.scen, parla.history.slice(-13, -1), text, parla.ctx, aiKeys(), function (err, data, meta) {
        if (parla !== p0) return;
        parla.busy = false;
        parla.live = "";
        if (err || !data) {
          // the turn did not happen: the sentence goes back to the box, to
          // send again with one tap (and the conversation stays clean)
          var last = parla.history[parla.history.length - 1];
          if (last && last[0] === "me" && last[1] === text) { parla.history.pop(); parla.turns--; }
          parla.retry = { text: text, msg: String(err && err.message || "respuesta rara") };
          if (view.screen === "parla") render();
          return;
        }
        parla.retry = null;
        if (meta) parla.meta = meta;
        var reply = sentenceCase(String(data.risposta || "").trim() || UI.ok), row = ["ia", reply];
        parla.history.push(row);
        if (data.recast && Engine.normalise(data.recast) !== Engine.normalise(text)) parla.recasts.push([text, String(data.recast), String(data.nota_es || "")]);
        (Array.isArray(data.obiettivi_raggiunti) ? data.obiettivi_raggiunti : []).forEach(function (n) { n = +n; if (n >= 1 && n <= 3 && parla.obj.indexOf(n) < 0) parla.obj.push(n); });
        if (view.screen !== "parla") return;
        render();
        speak(reply);
        if (data.fine || parla.obj.length >= 3 || parla.turns >= 12) return endParla(w);
        var bx = $("#ptext"); if (bx) bx.focus();
        // too many unknown words: the same line with simpler synonyms, under
        // the original (it no longer holds the conversation back)
        var hard = tooHard(reply);
        if (hard) {
          var miss = hard.miss.filter(function (x, i, a) { return a.indexOf(x) === i; }).slice(0, 8);
          Scrivi.parlaRewrite(reply, miss, aiKeys(), function (e2, d2) {
            var alt = !e2 && d2 && d2.risposta ? sentenceCase(String(d2.risposta)) : "";
            if (parla !== p0 || !alt || Engine.normalise(alt) === Engine.normalise(reply)) return;
            if (langErrors(alt, w.week).length > langErrors(reply, w.week).length) return;
            row[2] = alt;
            if (view.screen === "parla" && !parla.busy) { render(); var b2 = $("#ptext"); if (b2) b2.focus(); }
          });
        }
      }, parla.obj.slice(), { stream: stream });
    };
    on("#psend", send);
    var box = $("#ptext");
    if (box) { box.onkeydown = function (e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }; if (!parla.busy) box.focus(); }
    on("#pend", function () { endParla(w); });
    wireObjs();
    on("#pagain", function () { parla = null; render(); });
  }
  function endParla(w) {
    if (!parla || parla.done) return;
    parla.done = true;
    var first = !(state.parlaLog || {})[w.week];
    var xp = parla.obj.length * 10 + Math.min(30, parla.turns * 5);
    if (!first) xp = Math.round(xp / 3);
    parla.xp = xp;
    if (!state.parlaLog) state.parlaLog = {};
    var before = doneCount(w);
    state.parlaLog[w.week] = { obj: parla.obj.length, turns: parla.turns, at: Date.now() };
    gain(xp);
    Engine.addStrand(state, "output", xp);
    Engine.touchStreak(state);
    missionCheck(w.week, before);
    Engine.checkBadges(state);
    persist();
    renderHeader();
    // A second request reviews all the learner's sentences together (the
    // on-the-fly recasts miss what changes the meaning: cappelli, avó / avô).
    var mine = parla.history.filter(function (h) { return h[0] === "me"; });
    if (mine.length) {
      parla.reviewing = true;
      var p0 = parla;
      Scrivi.parlaReview(parla.scen, parla.history, aiKeys(), function (err, data) {
        if (parla !== p0) return;
        parla.reviewing = false;
        var rows = (!err && data && data.frasi) || null;
        if (rows) {
          var rec = [];
          rows.forEach(function (r) {
            var h = parla.history[+r.i];
            if (!h || h[0] !== "me" || r.ok === true || !r.corretta) return;
            if (Engine.normalise(r.corretta) === Engine.normalise(h[1])) return;
            rec.push([h[1], String(r.corretta), String(r.nota || "")]);
            // what went wrong in the role-play goes to the profile like any other
            // error (the common error object; an unknown type stays out of the score)
            if (window.Errores) Errores.record(state, Errores.fromRow(h[1], String(r.corretta), String(r.nota || ""), r.tipo, { fuente: "ia" }));
          });
          parla.recasts = rec;
          persist();
        }
        if (view.screen === "parla") render();
      });
    }
    render();
    if (parla.obj.length >= 3) setTimeout(confetti, 200);
  }

  /* ------------------------------------------------------------------ história */

  var storia = null;   // { week, busy, err }
  function storyEp(st) {
    var gloss = {};
    (st.gloss || []).forEach(function (g) { if (g && g[0]) gloss[String(g[0]).toLowerCase()] = String(g[1] || ""); });
    return { id: st.id, week: st.week, n: 0, level: st.level, emoji: "✨", title: st.title, series: "ai", grammar: "las palabras de tu repaso",
             text: st.text, gloss: gloss, questions: st.questions || [], area: UI.storiaArea,
             hunt: { label: "Tocá las palabras que te tocaba repasar: " + st.targets.join(", "), targets: st.targets } };
  }
  // The generated stories stay readable offline: registered again on boot.
  function registerStories() {
    (state.storie || []).forEach(function (st) { if (!Letture.byId(st.id)) Letture.EPISODI.push(storyEp(st)); });
  }
  function renderStoria(w) {
    var head = '<button class="btn ghost" id="sback2">← a la semana</button>' +
      plate(UI.storia + " · " + UI.week + " " + weekNum(w.week), UI.storiaOf);
    if (!aiKey()) return head + '<div class="card"><p>Para generar la historia hace falta una clave de Anthropic. <a href="#" id="aigo3">Cargala en ' + UI.me + " →</a></p></div>";
    var mine = (state.storie || []).filter(function (x) { return x.week === w.week; });
    var due = Drills.buildReview(course, state, 40, drillOpts()).map(function (it) { return vocabWordOf(it); }).filter(Boolean);
    var targets = due.slice(0, 8);
    return head + '<div class="card"><p>Un cuento corto con <b>las palabras que te tocaba repasar</b> y solo vocabulario que ya conocés: ' +
      "leerlas dentro de una historia las fija mejor que la ficha sola.</p>" +
      (targets.length ? '<p class="muted small">Palabras de hoy: <i>' + targets.map(esc).join(", ") + "</i></p>" : '<p class="muted small">Hoy no hay palabras vencidas: la historia usa las de la semana.</p>') +
      '<p class="muted small">🔬 SRS-Stories (Kamzela, Lango & Dušek 2025): la app mide cuántas palabras del cuento no conocés y, si son más del 15 %, pide que lo reescriba.</p>' +
      '<button class="btn wide" id="sgen"' + (storia && storia.busy ? " disabled" : "") + ">✨ " + (storia && storia.busy ? "Escribiendo…" : "Generar la historia") + "</button>" +
      (storia && storia.err ? '<p class="muted small">⚠️ ' + esc(storia.err) + "</p>" : "") +
      (mine.length ? "<h3>Tus historias de esta semana</h3><div class=\"eps\">" + mine.map(function (x) {
        return '<button class="ep" data-ep="' + esc(x.id) + '"><span class="e">✨</span><span><b>' + esc(x.title) + "</b><span class=\"muted\">" + esc(x.targets.join(", ")) + "</span></span></button>";
      }).join("") + "</div>" : "") + "</div>";
  }
  function wireStoria() {
    if (view.screen !== "storia") return;
    var w = course.weeks[view.week - 1];
    on("#sback2", function () { view.tab = "percorso"; view.screen = "briefing"; render(); window.scrollTo(0, 0); });
    on("#aigo3", function (e) { e.preventDefault(); go("io"); });
    on("#sgen", function () {
      var ctx = aiContext(w);
      var due = Drills.buildReview(course, state, 40, drillOpts()).map(function (it) { return vocabWordOf(it); }).filter(Boolean);
      var targets = due.slice(0, 8);
      if (targets.length < 4) (w.vocab || []).forEach(function (v) { if (targets.length < 8 && targets.indexOf(v[0]) < 0) targets.push(v[0]); });
      storia = { week: w.week, busy: true, err: null };
      render();
      var req = { level: ctx.level, week: w.week, tema: ctx.tema || ctx.fare, tenses: ctx.tenses, targets: targets,
                  known: ctx.words.slice(0, 200), words: w.week <= 13 ? 120 : w.week <= 26 ? 160 : 220, maxNew: 6 };
      Scrivi.storia(req, aiKeys(), function (err, data) {
        if (err || !data || !data.testo) { storia = { week: w.week, busy: false, err: String(err && err.message || "respuesta rara") }; if (view.screen === "storia") render(); return; }
        var accept = function (text) {
          var st = { id: "ai-" + Date.now().toString(36), week: w.week, level: ctx.level, title: String(data.titolo || UI.storia), text: String(text),
                     gloss: (data.glossario || []).slice(0, 20), questions: (data.domande || []).filter(function (q) { return q && q[1] && q[1].indexOf(q[2]) >= 0; }).slice(0, 3),
                     targets: targets, at: Date.now() };
          if (!state.storie) state.storie = [];
          state.storie.unshift(st);
          state.storie = state.storie.slice(0, 6);
          Letture.EPISODI.push(storyEp(st));
          storia = { week: w.week, busy: false, err: null };
          persist();
          view.ep = st.id; view.epFrom = "briefing"; view.tab = "leggi"; view.screen = "lettura";
          render(); window.scrollTo(0, 0);
        };
        // Last step: the local checker reads the story; what it marks goes
        // back once to be fixed, and the fix is taken only if it is better.
        var polish = function (text) {
          text = sentenceCase(text);
          var errs = langErrors(text, w.week);
          if (!errs.length) return accept(text);
          Scrivi.correggi(text, errs.slice(0, 10).map(function (f) { return String(f.msg || "").replace(/\*/g, ""); }), aiKeys(), function (e3, d3) {
            var fixed = !e3 && d3 && d3.testo ? sentenceCase(String(d3.testo)) : "";
            accept(fixed && langErrors(fixed, w.week).length < errs.length ? fixed : text);
          });
        };
        var orig = String(data.testo);
        var hard = tooHard(orig);
        if (hard && hard.miss.length > 3) {
          var missS = hard.miss.filter(function (x, i, a) { return a.indexOf(x) === i; }).slice(0, 12);
          Scrivi.storiaRewrite(orig, missS, aiKeys(), function (e2, d2) {
            var alt = !e2 && d2 && d2.testo ? String(d2.testo) : "";
            polish(alt && langErrors(alt, w.week).length <= langErrors(orig, w.week).length ? alt : orig);
          });
        } else polish(orig);
      });
    });
  }
  /* Cloze on the story with distractors of the same class and frequency
     band (the client builds the options: model-made distractors are too
     rare and give themselves away). */
  function storyCloze(ep) {
    var out = [];
    if (!window.Freq || !Freq.loaded()) return out;
    var sents = ep.text.split(/(?<=[.!?])\s+/);
    (ep.hunt.targets || []).slice(0, 3).forEach(function (t, k) {
      var sent = sents.filter(function (x) { return new RegExp("(^|[^a-zà-ÿ])" + t + "(?![a-zà-ÿ])", "i").test(x); })[0];
      if (!sent) return;
      var opts = [t].concat(Freq.sameBand(t, 3));
      if (opts.length < 3) return;
      out.push({ id: "storia:" + ep.id + ":" + k, src: "lettura", ep: ep.id, type: "choice", prompt: "Completá con la palabra del cuento",
                 stem: sent.replace(new RegExp("(^|[^a-zà-ÿ])" + t + "(?![a-zà-ÿ])", "i"), "$1___"), options: Drills.shuffle(opts), answer: t, accept: [t] });
    });
    return out;
  }

  /* ------------------------------------------------------------------ exame */

  /* The C1 exam, shaped like the certifications of the language without
     the oral part, in versions (esame_data.js: EsameData.versioni and
     versione(id) in Italian, EsameData.versoes in Portuguese).  A version
     is a whole exam: a listening with two voices (and, when the package
     has it, a monologue with a table of data), a long text with titles and
     true/false (and a text to put back in order), structures and lexicon
     (the items of course.json with its «ver», or the whole group when the
     items have none) and the written production (two texts, or four
     tarefas integradas with their insumo: the listening or the reading of
     the version, a short audio, a short text).  Each prova needs 55 %, and
     the exam passes with an average of 60 %; LANG.exam.optional lists the
     provas that do not count.  The ids of the provas (ascolto, lettura,
     strutture, lessico, scrittura) are the data keys of esame_data.js and
     course.json (item.prova); their names are the package's.

     Saved in state.esame: {ver: the version on screen, v: {id: {p: {prova:
     {ok, n, pct, at}}, best: {avg, passed, at}, n: attempts, done: date}},
     last: {at, ver}} («last» is what the plan of the day looks at).  The
     first time, the first version; each new attempt, the next one not done;
     after passing, a mock exam with the next one (openExam(ver)). */
  var EX = LG.exam || {};
  var PROVE = EX.prove || [];
  function proveName(id) { var p = PROVE.filter(function (x) { return x[0] === id; })[0]; return p ? p[1] : id; }
  function proveOptional(id) { return (EX.optional || []).indexOf(id) >= 0; }
  function proveCounted() { return PROVE.filter(function (p) { return !proveOptional(p[0]); }); }
  // The rubric of the written texts (esame_data.js, the AI's «punteggi»).
  var RUBRIC = EX.rubric || [];
  function kindName(k) { var K = EX.kinds || {}; return K[k] || K.other || k; }
  var es = null;          // transient state of the prova on screen
  var esPlayer = null;    // the recording playing: {h: Tramo.playScript's, key, screen}
  var esDraftTimer = null;

  /* The versions of the data, the same shape for both languages. */
  function esFind(list, id) { return (list || []).filter(function (x) { return x.id === id; })[0] || null; }
  function esameVersions() {
    var E = window.EsameData || {};
    var list = E.versioni || E.versoes;
    return list && list.length ? list.map(function (v) { return v.id; }) : ["A"];
  }
  function esVerLabel(id) { return "versión " + String(id).replace(/^v/, ""); }
  function esVersion(id) {
    var E = window.EsameData || {};
    if (E.versioni && E.versione) {
      var x = E.versione(id);
      if (x) return x;
    }
    var v = esFind(E.versoes, id);
    if (v) return { id: v.id, ascolto: esFind(E.ascolto, v.ascolto), lettura: esFind(E.lettura, v.lettura),
                    monologo: null, ricostruzione: null, scrittura: v.scrittura || [] };
    // the old data: one version
    return { id: id, ascolto: (E.ascolto || [])[0], lettura: (E.lettura || [])[0], monologo: null, ricostruzione: null, scrittura: E.scrittura || [] };
  }

  /* state.esame, with the results of before the versions moved into the
     first one. */
  function esStore() {
    var E = state.esame;
    if (!E || typeof E !== "object" || Array.isArray(E)) E = state.esame = {};
    if (!E.v || typeof E.v !== "object") {
      var first = esameVersions()[0], old = {};
      PROVE.forEach(function (p) { if (E[p[0]] && E[p[0]].pct != null) { old[p[0]] = E[p[0]]; delete E[p[0]]; } });
      E.v = {};
      if (Object.keys(old).length) {
        E.v[first] = { p: old, n: 1 };
        esCloseAttempt(first, E);
      }
    }
    if (esameVersions().indexOf(E.ver) < 0) E.ver = esameVersions()[0];
    return E;
  }
  function esRec(id, E) {
    E = E || esStore();
    var r = E.v[id] || (E.v[id] = { p: {}, n: 1 });
    if (!r.p) r.p = {};
    return r;
  }
  function esCurVer() { return esStore().ver; }

  /* The result of one attempt: null until every prova that counts is done. */
  function esVerResult(rec) {
    var r = (rec && rec.p) || {}, C = proveCounted();
    if (!C.length || !C.every(function (p) { return r[p[0]]; })) return null;
    var sum = 0, minOk = true;
    C.forEach(function (p) { sum += r[p[0]].pct; if (r[p[0]].pct < 55) minOk = false; });
    return { avg: Math.round(sum / C.length), minOk: minOk, passed: minOk && sum / C.length >= 60 };
  }
  // A finished attempt: its date and, when it is better, the version's best.
  function esCloseAttempt(id, E) {
    var rec = esRec(id, E), res = esVerResult(rec);
    if (!res) return null;
    if (!rec.done) rec.done = Date.now();
    var b = rec.best;
    if (!b || (res.passed && !b.passed) || (res.passed === b.passed && res.avg > b.avg)) rec.best = { avg: res.avg, passed: res.passed, minOk: res.minOk, at: Date.now() };
    return res;
  }
  function esameSet(prova, ok, n) {
    var E = esStore(), id = es && es.prova === prova && es.vid ? es.vid : E.ver, rec = esRec(id, E);
    var pct = n ? Math.round(ok / n * 100) : 0, prev = rec.p[prova];
    if (!prev || pct >= prev.pct) rec.p[prova] = { ok: ok, n: n, pct: pct, at: Date.now() };
    E.last = { at: Date.now(), ver: id };
    esCloseAttempt(id, E);
  }
  /* The exam's result for the rest of the app (the year, the phase): the
     best version, a passed one first.  {avg, minOk, passed, ver} or null. */
  function esameResult() {
    var E = esStore(), best = null;
    esameVersions().forEach(function (id) {
      var b = (E.v[id] || {}).best;
      if (b && (!best || (b.passed && !best.passed) || (b.passed === best.passed && b.avg > best.avg))) best = { avg: b.avg, minOk: b.minOk !== false, passed: b.passed, ver: id };
    });
    return best;
  }
  // The version of a new attempt: the next one never finished, else the next one.
  function esameNext() {
    var E = esStore(), ids = esameVersions(), k = ids.indexOf(E.ver);
    for (var i = 1; i < ids.length; i++) {
      var id = ids[(k + i) % ids.length];
      if (!(E.v[id] && E.v[id].best)) return id;
    }
    return ids[(k + 1) % ids.length];
  }
  function esStarted(id) { var r = (esStore().v[id] || {}).p; return !!r && Object.keys(r).length > 0; }
  // A new attempt with version id: its provas from zero (the best stays).
  function esameAttempt(id) {
    var E = esStore();
    if (esameVersions().indexOf(id) < 0) return;
    var rec = esRec(id, E);
    if (esVerResult(rec)) {
      rec.p = {}; rec.n = (rec.n || 1) + 1; rec.done = null;
      if (state.esameDraft) esVersion(id).scrittura.forEach(function (t) { if (t) delete state.esameDraft[t.id]; });
    }
    E.ver = id;
    persist();
  }
  /* The mock exam (plan.js: one every three months after the course; the
     week 52): the exam screen with version ver, or, without it, the next
     one when the version on screen is finished. */
  function esameOpen(ver) {
    var E = esStore();
    if (ver && esameVersions().indexOf(ver) >= 0) esameAttempt(ver);
    else if (esVerResult(E.v[E.ver])) esameAttempt(esameNext());
    view.week = FINAL(); view.tab = "percorso"; view.screen = "esame";
    render(); window.scrollTo(0, 0);
  }

  // The items of structures or lexicon of the version, in the order of their
  // text (a cloze follows its text).
  function esameItems(prova) {
    var pool = course.items.filter(function (it) { return it.topic === "esame" && it.prova === prova; });
    var ver = esCurVer(), mine = pool.filter(function (it) { return it.ver === ver; });
    if (mine.length) pool = mine;
    var pos = {};
    pool.forEach(function (it, i) { pos[it.id] = i; });
    return Drills.shuffle(pool).slice(0, prova === "strutture" ? 20 : 12).sort(function (a, b) { return pos[a.id] - pos[b.id]; });
  }

  function renderEsame() {
    var E = esStore(), vid = E.ver, rec = esRec(vid, E), r = rec.p, res = esVerResult(rec), st = weekStat(FINAL());
    if (res) esCloseAttempt(vid, E);
    var overall = esameResult(), maint = state.phase === "mantenimiento" || !!(overall && overall.passed);
    var html = '<button class="btn ghost" id="eback">← a la semana</button>' +
      plate(EX.final, EX.levelC1, true) +
      '<p class="lead">' + EX.lead + "</p>" +
      '<p class="muted small">📄 Estás haciendo la <b>' + esVerLabel(vid) + "</b>" + (rec.n > 1 ? " (intento " + rec.n + ")" : "") +
        "</p>" +
      '<div class="missions">' + PROVE.map(function (p, k) {
        var x = r[p[0]], opt = proveOptional(p[0]);
        return '<button class="mission' + (x && x.pct >= 55 ? " done" : "") + (opt ? " half" : "") + '" data-prova="' + p[0] + '"><span class="mi">' + (x && x.pct >= 55 ? "★" : p[2]) + "</span>" +
          "<span><b>" + (k + 1) + ". " + p[1] + (opt ? " · opcional" : "") + "</b><small>" +
          (x ? x.pct + " % · " + x.ok + " / " + x.n + (x.pct < 55 && !opt ? " · por debajo del mínimo" : "") : (EX.sub || {})[p[0]] || "") +
          "</small></span><span class=\"go\">›</span></button>";
      }).join("") + "</div>";
    if (res) {
      html += '<div class="card"><div class="scorebig"><b>' + res.avg + " %</b><span>promedio · " + esVerLabel(vid) + "</span></div>" +
        (res.passed ? "<p>🎓 <b>" + EX.passed + "</b> " + (st.bossPassed ? "Ya figura en " + UI.pathTu + "." : "") + "</p>" +
          (!st.bossPassed ? '<button class="btn wide" id="econsegna">Registrar el resultado</button>' : "")
          : "<p>" + (res.minOk ? "Falta llegar al 60 % de promedio." : "Alguna prueba está por debajo del 55 %: repetila, o probá otra versión.") + "</p>");
      var nx = esameNext();
      html += '<button class="btn wide' + (res.passed && !st.bossPassed ? " ghost" : "") + '" id="enext" data-ver="' + esc(nx) + '" style="margin-top:10px">' +
        (maint ? "🎓 Simulacro con la " : "🔁 Nuevo intento con la ") + esVerLabel(nx) + "</button></div>";
    }
    // The versions: which one this is, how the others went.
    var ids = esameVersions();
    if (ids.length > 1) {
      html += '<div class="card"><h3>Las versiones</h3><p class="muted small">Cada versión es un examen entero con otras escuchas, otros textos y otras consignas. ' +
        (maint ? "Después de aprobar, un simulacro cada tres meses mantiene el nivel." : "Si no aprobás, el intento siguiente usa otra.") + "</p>" +
        '<table class="res">' + ids.map(function (id) {
          var v = E.v[id] || {}, b = v.best, cur = id === vid, done = esVerResult(v), started = esStarted(id);
          var what = cur ? (done ? "hecha ahora · " + done.avg + " %" : started ? "en curso" : "la de ahora")
            : b ? "mejor nota: " + b.avg + " %" + (b.passed ? " · aprobada" : "") : started ? "empezada" : "sin hacer";
          return "<tr><td><b>" + esVerLabel(id) + "</b>" + (cur ? " ◀" : "") + "</td><td>" + what +
            (cur && b && !done ? " · antes: " + b.avg + " %" : "") + "</td><td>" +
            (cur ? "" : '<button class="tab" data-ever="' + esc(id) + '">' + (started && !esVerResult(v) ? "Seguir" : b ? (maint ? "Simulacro" : "Repetir") : "Empezar") + "</button>") +
            "</td></tr>";
        }).join("") + "</table></div>";
    }
    html += '<div class="row" style="margin-top:12px"><button class="tab" id="eboss">⚔️ Ronda clásica de ' + UI.boss + " (práctica)</button></div>";
    return html;
  }
  function wireEsame() {
    var sc = view.screen;
    // leaving a listening of the exam: silence
    if (esPlayer && esPlayer.screen !== sc) esStop();
    if (sc === "esame") {
      on("#eback", function () { view.tab = "percorso"; view.screen = "briefing"; render(); window.scrollTo(0, 0); });
      on("#eboss", function () { startRound("boss"); });
      document.querySelectorAll("[data-prova]").forEach(function (b) {
        b.onclick = function () {
          var p = b.dataset.prova;
          es = { prova: p, vid: esCurVer(), plays: {}, answers: {} };
          if (p === "strutture" || p === "lessico") startRound("esame", p);
          else { view.screen = p === "ascolto" ? "esame-asc" : p === "lettura" ? "esame-let" : "esame-scr"; render(); window.scrollTo(0, 0); }
        };
      });
      document.querySelectorAll("[data-ever]").forEach(function (b) {
        b.onclick = function () { esameAttempt(b.dataset.ever); render(); window.scrollTo(0, 0); };
      });
      on("#enext", function () { esameAttempt($("#enext").dataset.ver); toast("📄 Nueva " + esVerLabel(esCurVer()), 2500); render(); window.scrollTo(0, 0); });
      on("#econsegna", function () {
        var ws = state.weekStats[FINAL()] || (state.weekStats[FINAL()] = { attempts: 0, right: 0, bossPassed: false });
        ws.bossPassed = true;
        gain(Engine.XP.boss);
        var won = Engine.checkBadges(state);
        persist(); renderHeader(); confetti();
        toast("🎓 C1 registrado" + (won.length ? " · 🏅 " + won[0].name : ""), 4000);
        render();
      });
      return;
    }
    if (sc === "esame-asc" || sc === "esame-let" || sc === "esame-scr") {
      esV();
      on("#eback2", esBack); on("#eback3", esBack);
      document.querySelectorAll("[data-eplay]").forEach(function (b) { b.onclick = function () { esPlay(b.dataset.eplay); }; });
    }
    if (sc === "esame-asc") wireEsameAscolto();
    if (sc === "esame-let") wireEsameLettura();
    if (sc === "esame-scr") wireEsameScrittura();
  }
  function esBack() { esStop(); view.screen = "esame"; render(); window.scrollTo(0, 0); }
  // The prova on screen and its version (a reload lands here without one).
  function esV() {
    var sc = view.screen;
    if (!es) es = { prova: sc === "esame-asc" ? "ascolto" : sc === "esame-let" ? "lettura" : "scrittura", vid: esCurVer(), plays: {}, answers: {} };
    if (!es.vid) es.vid = esCurVer();
    if (!es.v || es.v.id !== es.vid) es.v = esVersion(es.vid);
    return es.v;
  }

  /* The recordings: two listenings each, read by the phone's voices
     (Tramo.playScript): the dialogue ("d"), the monologue ("m") and the
     insumo of a tarefa ("t0".."t3"). */
  function esScript(key) {
    var v = esV();
    if (key === "d") return v.ascolto ? { parts: v.ascolto.turns } : null;
    if (key === "m") return v.monologo ? { parts: v.monologo.text, mono: v.monologo.voice === 1 ? 1 : 0 } : null;
    var t = v.scrittura[+key.slice(1)], ins = t && t.insumo;
    if (!ins || ins.tipo !== "audio") return null;
    if (ins.ref) { var a = esFind((window.EsameData || {}).ascolto, ins.ref); return a ? { parts: a.turns } : null; }
    return ins.turns ? { parts: ins.turns } : null;
  }
  function esPlayHtml(key, what) {
    var n = (es && es.plays[key]) || 0;
    if (!window.speechSynthesis) return '<p class="note">Este navegador no tiene voces: la transcripción queda abajo, después de entregar.</p>';
    return '<div class="center"><button class="bigplay" data-eplay="' + key + '"' + (n >= 2 ? " disabled" : "") + ' aria-label="Escuchar ' + esc(what || "") + '">🔊</button>' +
      '<p class="muted" data-estate="' + key + '">' + esPlayState(n, false) + "</p></div>";
  }
  function esPlayState(n, on) { return on ? "Escucha " + n + " de 2…" : n >= 2 ? "Dos escuchas hechas" : n ? "Escucha 2 de 2 (cuando quieras)" : "Escucha 1 de 2"; }
  function esPlay(key) {
    var sc = esScript(key), b = document.querySelector('[data-eplay="' + key + '"]');
    if (!sc || !window.Tramo || !Tramo.playScript || (es.plays[key] || 0) >= 2) return;
    esStop();
    var n = es.plays[key] = (es.plays[key] || 0) + 1, lbl = document.querySelector('[data-estate="' + key + '"]');
    document.querySelectorAll("[data-eplay]").forEach(function (x) { x.disabled = true; });
    if (lbl) lbl.textContent = esPlayState(n, true);
    var me = esPlayer = { key: key, screen: view.screen };
    me.h = Tramo.playScript(sc.parts, { mono: sc.mono, onend: function (sec) {
      if (esPlayer !== me) return;
      esPlayer = null;
      noteListening(sec);
      esPlayButtons();
    } });
    if (b) b.blur();
  }
  function esStop() {
    if (!esPlayer) return;
    var p = esPlayer;
    esPlayer = null;
    if (p.h) p.h.stop();
    esPlayButtons();
  }
  function esPlayButtons() {
    document.querySelectorAll("[data-eplay]").forEach(function (x) { x.disabled = ((es && es.plays[x.dataset.eplay]) || 0) >= 2; });
    document.querySelectorAll("[data-estate]").forEach(function (x) { x.textContent = esPlayState((es && es.plays[x.dataset.estate]) || 0, false); });
  }
  function esTranscript(a) {
    return '<p class="model" lang="' + LG.tts + '">' + a.turns.map(function (t) {
      return "<b>" + esc(a.speakers[t[0] === "A" ? 0 : t[0] === "B" ? 1 : 2] || t[0]) + ":</b> " + esc(t[1]);
    }).join("<br>") + "</p>";
  }

  /* Ascolto: the interview read turn by turn, two voices; in Italian, then a
     monologue of 4-5 minutes with a table of data.  Two listenings each. */
  function renderEsameAscolto() {
    var v = esV(), a = v.ascolto, m = v.monologo;
    var head = '<button class="btn ghost" id="eback2">← al examen</button><h1>🎧 ' + esc(proveName("ascolto")) + "</h1>" +
      '<p class="lead">' + esVerLabel(v.id) + (m ? " · dos partes" : "") + "</p>";
    if (es.done) return head + esameProvaResult();
    return head + '<div class="card">' + (m ? '<p class="muted small">Parte 1 de 2</p>' : "") + '<h2 lang="' + LG.tts + '">' + esc(a.title) + "</h2>" +
        '<p class="muted">Vas a escuchar la grabación <b>dos veces</b>. Las preguntas se muestran ahora: leelas antes.</p>' +
        esPlayHtml("d", a.title) + esameQuestionsHtml(a) + "</div>" +
      (m ? '<div class="card"><p class="muted small">Parte 2 de 2</p><h2 lang="' + LG.tts + '">' + esc(m.title) + "</h2>" +
        '<p class="muted">' + esc(m.speaker || "") + (m.genre ? ' · <span lang="' + LG.tts + '">' + esc(m.genre) + "</span>" : "") +
        ". Una sola voz, unos cuatro o cinco minutos. Leé la tabla antes, escuchá <b>dos veces</b> y anotá los datos mientras escuchás (números, horas, nombres).</p>" +
        esPlayHtml("m", m.title) +
        '<table class="res">' + m.tabella.map(function (c, i) {
          return '<tr><td lang="' + LG.tts + '">' + esc(c[0]) + '</td><td><input class="egap" data-cell="' + i + '" autocapitalize="off" autocorrect="off" spellcheck="false"></td></tr>';
        }).join("") + "</table></div>" : "") +
      '<button class="btn wide" id="econsegna2">' + EX.deliver + "</button>";
  }
  function esameQuestionsHtml(a) {
    return '<ol class="equestions" lang="' + LG.tts + '">' + a.questions.map(function (q, i) {
      return "<li><b>" + esc(q[0]) + "</b>" + Drills.shuffle(q[1]).map(function (o) {
        return '<label class="eopt"><input type="radio" name="q' + i + '" value="' + esc(o) + '"> ' + esc(o) + "</label>";
      }).join("") + "</li>";
    }).join("") + "</ol><h3>Completá con una palabra del audio</h3><ol class=\"equestions\">" + a.completa.map(function (c, i) {
      return '<li lang="' + LG.tts + '">' + esc(c[0]) + ' <input class="egap" data-gap="' + i + '" autocapitalize="off" autocorrect="off" spellcheck="false"></li>';
    }).join("") + "</ol>";
  }
  // The result of a prova: the score, each answer, and the transcriptions
  // or the texts in their order.
  function esameProvaResult() {
    var r = es.result, v = esV();
    var tail = "";
    if (es.prova === "ascolto") {
      tail = "<h3>" + EX.transcript + (v.monologo ? " · " + esc(v.ascolto.title) : "") + "</h3>" + esTranscript(v.ascolto) +
        (v.monologo ? "<h3>" + EX.transcript + " · " + esc(v.monologo.title) + '</h3><p class="model" lang="' + LG.tts + '">' + v.monologo.text.map(esc).join("<br><br>") + "</p>" : "");
    } else if (es.prova === "lettura" && v.ricostruzione) {
      tail = "<h3>El orden del texto · " + esc(v.ricostruzione.title) + '</h3><ol class="esc-model" lang="' + LG.tts + '">' +
        v.ricostruzione.paragraphs.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ol>";
    }
    return '<div class="card"><div class="scorebig"><b>' + r.pct + " %</b><span>" + r.ok + " / " + r.n + "</span></div>" +
      (r.detail ? '<table class="res">' + r.detail.map(function (d) {
        return '<tr><td lang="' + LG.tts + '">' + esc(d[0]) + "</td><td>" + (d[1] ? "✓" : "✗ " + esc(d[2] || "")) + "</td></tr>";
      }).join("") + "</table>" : "") + tail +
      '<div class="row" style="margin-top:12px"><button class="btn" id="eback3">← Volver al examen</button></div></div>';
  }
  function wireEsameAscolto() {
    var v = esV(), a = v.ascolto, m = v.monologo;
    on("#econsegna2", function () {
      var ok = 0, detail = [];
      a.questions.forEach(function (q, i) {
        var sel = document.querySelector('input[name="q' + i + '"]:checked');
        var right = !!sel && sel.value === q[2];
        if (right) ok++;
        detail.push([q[0], right, q[2]]);
      });
      a.completa.forEach(function (c, i) {
        var inp = document.querySelector('[data-gap="' + i + '"]');
        var right = !!inp && Engine.grade(inp.value, { answer: c[1], accept: [c[1]] }) !== Engine.VERDICT.WRONG;
        if (right) ok++;
        detail.push([c[0], right, c[1]]);
      });
      var n = a.questions.length + a.completa.length;
      // the table of the monologue: numbers, hours, names (Tramo.cellOk)
      if (m) m.tabella.forEach(function (c, i) {
        var inp = document.querySelector('[data-cell="' + i + '"]');
        var right = !!inp && (window.Tramo && Tramo.cellOk ? Tramo.cellOk(inp.value, c)
          : Engine.grade(inp.value, { answer: c[1], accept: [c[1]].concat(c[2] || []) }) !== Engine.VERDICT.WRONG);
        if (right) ok++;
        n++;
        detail.push([c[0], right, c[1]]);
      });
      esStop();
      es.done = true; es.result = { ok: ok, n: n, pct: Math.round(ok / n * 100), detail: detail };
      esameSet("ascolto", ok, n);
      Engine.addStrand(state, "input", ok * 3); gain(ok * 3);
      persist(); renderHeader(); render(); window.scrollTo(0, 0);
    });
  }

  /* Lettura: a title for every paragraph (two titles too many), then
     true/false; in Italian, then the ricostruzione: the first paragraph
     stays, the other five are put back in order (a point for each one in
     its place). */
  function renderEsameLettura() {
    var v = esV(), l = v.lettura, rc = v.ricostruzione;
    var head = '<button class="btn ghost" id="eback2">← al examen</button><h1>📖 ' + esc(proveName("lettura")) + "</h1>" +
      '<p class="lead">' + esVerLabel(v.id) + (rc ? " · dos partes" : "") + "</p>";
    if (es.done) return head + esameProvaResult();
    if (rc && !es.ric) {
      var b = window.Ordenar ? Ordenar.build(rc.paragraphs.join("\n"), { maxPars: rc.paragraphs.length }) : null;
      var rest = b ? b.shuffled : Drills.shuffle(rc.paragraphs.map(function (_, i) { return i; }).slice(1));
      es.ric = { order: [], pool: rest.slice() };
    }
    return head + '<div class="card">' + (rc ? '<p class="muted small">Parte 1 de 2</p>' : "") + '<h2 lang="' + LG.tts + '">' + esc(l.title) + "</h2>" +
      '<p class="muted">Elegí el título de cada párrafo (sobran dos) y después decidí si cada afirmación es ' + EX.vfHelp + ".</p>" +
      '<div class="text" lang="' + LG.tts + '">' + l.paragraphs.map(function (p, i) {
        return '<p><select class="etitle" data-par="' + i + '"><option value="">— título del párrafo ' + (i + 1) + " —</option>" +
          l.titles.map(function (t, k) { return '<option value="' + k + '">' + esc(t) + "</option>"; }).join("") + "</select><br>" + esc(p) + "</p>";
      }).join("") + "</div>" +
      "<h3>" + EX.vf + '</h3><ol class="equestions">' + l.vf.map(function (x, i) {
        return '<li><span lang="' + LG.tts + '">' + esc(x[0]) + '</span><label class="eopt"><input type="radio" name="vf' + i + '" value="v"> ' + EX.yes + '</label><label class="eopt"><input type="radio" name="vf' + i + '" value="f"> ' + EX.no + "</label></li>";
      }).join("") + "</ol></div>" +
      (rc ? '<div class="card"><p class="muted small">Parte 2 de 2</p><h2 lang="' + LG.tts + '">' + esc(rc.title) + "</h2>" +
        '<p class="muted">Los párrafos de este texto están desordenados. El primero ya está en su lugar: tocá los demás en el orden en que van (tocá uno ya puesto para sacarlo).</p>' +
        '<div id="eric">' + esRicHtml() + "</div></div>" : "") +
      '<button class="btn wide" id="econsegna3">' + EX.deliver + "</button>";
  }
  function esRicHtml() {
    var ps = esV().ricostruzione.paragraphs, R = es.ric;
    return '<div class="options esc-order" lang="' + LG.tts + '"><div class="opt esc-piece anchor">' + esc(ps[0]) + "</div>" +
      R.order.map(function (u, i) { return '<button class="opt esc-piece" data-ericback="' + i + '">' + esc(ps[u]) + "</button>"; }).join("") + "</div>" +
      (R.pool.length ? '<p class="muted small" style="margin-top:14px">Tocá el que sigue:</p><div class="esc-pool" lang="' + LG.tts + '">' + R.pool.map(function (u) {
        return '<button class="tile esc-piece" data-ericput="' + u + '">' + esc(ps[u]) + "</button>";
      }).join("") + "</div>" : '<p class="muted small" style="margin-top:10px">✓ Todos en su lugar: podés entregar (o tocar uno para sacarlo).</p>');
  }
  function esRicWire() {
    var box = $("#eric");
    if (!box) return;
    box.querySelectorAll("[data-ericput]").forEach(function (b) {
      b.onclick = function () { var u = +b.dataset.ericput; es.ric.pool = es.ric.pool.filter(function (x) { return x !== u; }); es.ric.order.push(u); esRicRedraw(); };
    });
    box.querySelectorAll("[data-ericback]").forEach(function (b) {
      b.onclick = function () { var u = es.ric.order.splice(+b.dataset.ericback, 1)[0]; es.ric.pool.push(u); esRicRedraw(); };
    });
  }
  function esRicRedraw() { var box = $("#eric"); if (box) { box.innerHTML = esRicHtml(); esRicWire(); } }
  function wireEsameLettura() {
    var v = esV(), l = v.lettura, rc = v.ricostruzione;
    esRicWire();
    on("#econsegna3", function () {
      var ok = 0, detail = [];
      l.match.forEach(function (want, i) {
        var sel = document.querySelector('[data-par="' + i + '"]');
        var right = !!sel && +sel.value === want && sel.value !== "";
        if (right) ok++;
        detail.push(["Párrafo " + (i + 1), right, l.titles[want]]);
      });
      l.vf.forEach(function (x, i) {
        var sel = document.querySelector('input[name="vf' + i + '"]:checked');
        var right = !!sel && (sel.value === "v") === x[1];
        if (right) ok++;
        detail.push([x[0], right, (x[1] ? EX.yes : EX.no) + (x[2] ? " · " + x[2] : "")]);
      });
      var n = l.match.length + l.vf.length;
      if (rc && es.ric) {
        // one point for each paragraph after the first in its place
        var seq = es.ric.order;
        for (var i = 1; i < rc.paragraphs.length; i++) {
          var right = seq[i - 1] === i;
          if (right) ok++;
          n++;
          detail.push([(EX.ricName || "Orden") + ": " + (i + 1) + ".º párrafo", right, rc.paragraphs[i].split(/\s+/).slice(0, 7).join(" ") + "…"]);
        }
      }
      es.done = true; es.result = { ok: ok, n: n, pct: Math.round(ok / n * 100), detail: detail };
      esameSet("lettura", ok, n);
      Engine.addStrand(state, "input", ok * 3); gain(ok * 3);
      persist(); renderHeader(); render(); window.scrollTo(0, 0);
    });
  }

  /* The written production: two texts (Italian) or four tarefas integradas
     with their insumo (Portuguese).  With a key the AI grades them with the
     rubric; otherwise the review of the C1 task (Tramo.evaluate). */
  function esInsumo(t) {
    var ins = t.insumo, E = window.EsameData || {};
    if (!ins) return null;
    if (ins.ref) {
      var a = ins.tipo === "audio" ? esFind(E.ascolto, ins.ref) : null, l = ins.tipo !== "audio" ? esFind(E.lettura, ins.ref) : null;
      return { tipo: ins.tipo, ref: true, titulo: (a || l || {}).title || "", turns: a ? a.turns : null, speakers: a ? a.speakers : null,
               texto: l ? l.paragraphs.join("\n\n") : "" };
    }
    return { tipo: ins.tipo, titulo: ins.titulo || "", turns: ins.turns || null, speakers: ins.speakers || null, texto: ins.texto || "" };
  }
  function esInsumoHtml(t, i) {
    var x = esInsumo(t);
    if (!x) return "";
    if (x.tipo === "audio") return '<div class="call"><p><b>🎧 ' + (x.ref ? "La grabación de la prueba de escucha: " : "Un audio: ") + '</b><span lang="' + LG.tts + '">' + esc(x.titulo) + "</span>" +
      (x.speakers ? ' <span class="muted small">(' + x.speakers.map(esc).join(", ") + ")</span>" : "") + "</p>" + esPlayHtml("t" + i, x.titulo) + "</div>";
    if (x.ref) return '<details class="call"><summary><b>📖 El texto de la prueba de lectura:</b> <span lang="' + LG.tts + '">' + esc(x.titulo) + "</span></summary>" +
      '<div class="text" lang="' + LG.tts + '">' + x.texto.split(/\n\n/).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") + "</div></details>";
    return '<div class="call"><p><b>📄 <span lang="' + LG.tts + '">' + esc(x.titulo) + '</span></b></p><p class="model" lang="' + LG.tts + '">' + esc(x.texto) + "</p></div>";
  }
  function esWords(s) { return String(s || "").split(/\s+/).filter(Boolean).length; }
  // The extension a task asks for: said in Italian (min-max), not in the
  // tarefas of Portuguese (words is only for the review).
  function esSpan(t) { return { min: t.min || Math.round(t.words * 0.8), max: t.max || Math.round(t.words * 1.5), said: !!t.min }; }
  function renderEsameScrittura() {
    var v = esV(), tasks = v.scrittura, tare = tasks.some(function (t) { return t.insumo; });
    var head = '<button class="btn ghost" id="eback2">← al examen</button><h1>✍️ ' + EX.writing + "</h1>" +
      '<p class="lead">' + esVerLabel(v.id) + "</p>";
    if (es.done) return head + '<div class="card"><div class="scorebig"><b>' + es.result.pct + ' %</b><span>' + es.result.ok + " / " + es.result.n + " puntos</span></div>" +
      es.result.parts.map(function (p) {
        return "<h3>" + esc(p.title) + "</h3><p>" + (p.rubric ? RUBRIC.filter(function (r) { return p.rubric[r[0]] != null; }).map(function (r) { return esc(r[1]) + " " + p.rubric[r[0]] + "/5"; }).join(" · ") : esc(p.local)) + "</p>" +
          (p.comment ? "<p>🤖 " + esc(p.comment) + "</p>" : "") +
          (p.errors && p.errors.length ? '<table class="res">' + p.errors.map(function (e) { return '<tr><td lang="' + LG.tts + '">' + esc(e[0]) + '</td><td lang="' + LG.tts + '">' + esc(e[1]) + "</td></tr>"; }).join("") + "</table>" : "");
      }).join("") +
      (tasks.some(function (t) { return esInsumo(t) && esInsumo(t).tipo === "audio" && !esInsumo(t).ref; }) ? "<h3>" + EX.transcript + "</h3>" + tasks.map(function (t) {
        var x = esInsumo(t);
        return x && x.tipo === "audio" && !x.ref ? '<p class="muted small" lang="' + LG.tts + '">' + esc(x.titulo) + "</p>" + esTranscript({ turns: x.turns, speakers: x.speakers || [] }) : "";
      }).join("") : "") +
      '<div class="row" style="margin-top:12px"><button class="btn" id="eback3">← Volver al examen</button></div></div>';
    return head + '<div class="card"><p class="muted">' + (tare ? tasks.length + " tarefas: cada una parte de lo que escuchás o leés. Como en el Celpe-Bras, el enunciado no dice extensión ni registro: los decide el género, el interlocutor y el propósito. " : tasks.length + " textos. ") +
      (aiKey() ? "La IA los califica con la rúbrica de la certificación." : "Sin clave de IA, los revisa el corrector de la tarea C1 (extensión, variedad, estructura del género, conectores, errores marcados).") + "</p></div>" +
      tasks.map(function (t, i) {
        var d = (state.esameDraft || {})[t.id] || "", sp = esSpan(t);
        return '<div class="card"><h3>' + (t.insumo ? "Tarefa " + (i + 1) : (i + 1) + ". " + esc(kindName(t.kind)) + (sp.said ? " · " + sp.min + "–" + sp.max + " palabras" : "")) + "</h3>" +
          esInsumoHtml(t, i) +
          "<p" + (t.insumo ? ' lang="' + LG.tts + '"' : "") + ">" + esc(t.t) + "</p>" +
          '<textarea class="grow scrivi edraft" data-id="' + esc(t.id) + '" rows="8" spellcheck="false" autocapitalize="sentences" lang="' + LG.tts + '">' + esc(d) + "</textarea>" +
          '<p class="muted small ewords" data-for="' + esc(t.id) + '">' + esWords(d) + " palabras</p></div>";
      }).join("") +
      '<button class="btn wide" id="econsegna4"' + (es.busy ? " disabled" : "") + ">" + (es.busy ? "⏳ Corrigiendo…" : EX.deliver) + "</button>";
  }
  // The review without a key: the C1 task's (tramo.js), which does not fall
  // for padding or repetition, plus the checker's hard errors.  It is a
  // guide, not a grade: the page says so.
  function esLocalScore(task, text) {
    var chk = Scrivi.check(text, 52), hard = chk.findings.filter(function (f) { return !f.soft; }).length;
    var words = esWords(text), score, detail = "";
    if (window.Tramo && Tramo.evaluate) {
      var genres = (window.TRAMO_DATA && TRAMO_DATA.GENRES) || {}, keys = Object.keys(genres), G = EX.genres || {};
      var genre = [G[task.genero], G[task.kind]].filter(function (g) { return g && genres[g]; })[0] ||
        keys.filter(function (k) { return task.kind === "formale" ? /formal/.test(k) : /saggio|opiniao|articolo|artigo/.test(k); })[0] || keys[0];
      var x = esInsumo(task), sp = esSpan(task);
      var src = x ? { lettura: { text: x.texto || "" }, ascolto: { turns: x.turns || [] } } : null;
      var ev = Tramo.evaluate({ genre: genre, min: sp.min, max: sp.max, punti: task.punti || [], t: task.t,
                                fonte: x ? (x.tipo === "audio" ? "ascolto" : "lettura") : null }, text, 52, src);
      // without points of the task, the criterion says nothing
      var crit = ev.crit.filter(function (c) { return !(c.id === "punti" && !(task.punti || []).length); });
      var need = crit.filter(function (c) { return c.need; }), needOk = need.every(function (c) { return c.ok; });
      var frac = crit.filter(function (c) { return c.ok; }).length / Math.max(1, crit.length), errPart = Math.max(0, 1 - hard / Math.max(4, words / 25));
      score = Math.round((frac * 12 + errPart * 8) * 10) / 10;
      if (!needOk) score = Math.min(score, 9);
      detail = crit.filter(function (c) { return !c.ok; }).map(function (c) { return c.label; }).slice(0, 3).join(" · ");
    } else {
      score = Math.round((Math.min(1, words / task.words) * 8 + Math.max(0, 12 - hard * 1.5)) * 10) / 10;
    }
    return { score: score, text: words + " palabras · " + hard + " errores marcados → nota orientativa " + score + " / 20" + (detail ? " · " + detail : "") };
  }
  // What the AI needs besides the prompt: the insumo, so it can judge its use.
  function esAiTask(t) {
    var x = esInsumo(t);
    if (!x) return t;
    var src = x.turns ? x.turns.map(function (u) { return u[1]; }).join(" ") : x.texto;
    return Object.assign({}, t, { t: t.t + "\n\nInsumo (" + (x.tipo === "audio" ? "audio" : "texto") + ", «" + x.titulo + "»): " + String(src).slice(0, 5000) });
  }
  function esSaveDraft(id, value) {
    if (!state.esameDraft) state.esameDraft = {};
    state.esameDraft[id] = String(value).slice(0, 6000);
  }
  function wireEsameScrittura() {
    var v = esV();
    document.querySelectorAll(".edraft").forEach(function (t) {
      t.addEventListener("input", function () {
        esSaveDraft(t.dataset.id, t.value);
        var c = document.querySelector('.ewords[data-for="' + t.dataset.id + '"]');
        if (c) c.textContent = esWords(t.value) + " palabras";
        clearTimeout(esDraftTimer);
        esDraftTimer = setTimeout(persist, 600);
      });
      t.addEventListener("blur", function () { clearTimeout(esDraftTimer); persist(); });
    });
    on("#econsegna4", function () {
      clearTimeout(esDraftTimer);
      var texts = v.scrittura.map(function (t) { return [t, ((state.esameDraft || {})[t.id] || "").trim()]; });
      var short = texts.filter(function (x) { return esWords(x[1]) < x[0].words * 0.5; })[0];
      if (short) return toast(short[0].insumo ? "La tarefa " + (texts.indexOf(short) + 1) + " parece incompleta: " + esWords(short[1]) + " palabras."
        : "Cada texto necesita al menos la mitad de las palabras pedidas.", 3500);
      esStop();
      es.busy = true; render();
      scriviLexicon();
      var parts = [], pending = texts.length, sum = 0, max = 0;
      var finish = function () {
        es.busy = false; es.done = true;
        es.result = { ok: Math.round(sum), n: max, pct: Math.round(sum / max * 100), parts: parts };
        esameSet("scrittura", Math.round(sum), max);
        Engine.addStrand(state, "output", Math.round(sum * 2)); gain(Math.round(sum * 2));
        persist(); renderHeader();
        if (view.screen === "esame-scr") { render(); window.scrollTo(0, 0); }
      };
      texts.forEach(function (x, i) {
        var task = x[0], text = x[1], title = (task.insumo ? "Tarefa " + (i + 1) + " · " : "") + kindName(task.kind);
        var local = function () {
          var l = esLocalScore(task, text);
          parts[i] = { title: title, local: l.text, errors: [] };
          sum += l.score; max += 20;
          if (--pending === 0) finish();
        };
        if (!aiKey()) return local();
        Scrivi.esame(esAiTask(task), text, aiKeys(), function (err, data) {
          if (err || !data || !data.punteggi) return local();
          var pz = data.punteggi, sc = 0;
          RUBRIC.forEach(function (r) { var k = r[0]; pz[k] = Math.max(0, Math.min(5, +pz[k] || 0)); sc += pz[k]; });
          parts[i] = { title: title, rubric: pz, comment: String(data.commento || ""), errors: (data.errori || []).slice(0, 8) };
          sum += sc; max += 20;
          if (--pending === 0) finish();
        });
      });
    });
  }

  /* ---------------------------------------------------------------- escreva */

  // Everything of the language the course shows, as the checker's dictionary.
  function scriviLexicon() {
    if (!window.Scrivi) return;
    Scrivi.learnCourse({ items: course.items, bank: Banca.loaded() ? Banca.bank() : null,
      phrases: window.Frasi ? Frasi.ALL : [], readings: window.Letture ? Letture.EPISODI : [], glossario: glossario || {},
      extra: window.Tramo ? Tramo.lexTexts() : [] });
  }

  function reqsHtml(r) {
    return r.reqs.map(function (q) {
      return '<li class="' + (q.ok ? "ok" : "") + '">' + (q.ok ? "✓" : "○") + " " + esc(q.label) +
        ' <small class="muted">' + Math.min(q.n, 999) + " / " + q.need + "</small></li>";
    }).join("");
  }

  function renderScrivi(w) {
    var task = Scrivi.TASKS[w.week];
    if (!task) return '<button class="btn ghost" id="sback">← a la semana</button><p>Esta semana no tiene texto.</p>';
    // one structure of the month before, the most overdue rule's (reglas.js)
    if (window.Reglas) Reglas.scriviExtra(state, w.week);
    scriviLexicon();
    var draft = ((state.scrittiDraft || {})[w.week]) || ((state.scritti || {})[w.week] || {}).t || "";
    var r = Scrivi.check(draft, w.week);
    return '<button class="btn ghost" id="sback">← a la semana</button>' +
      plate(UI.scrivi + " · " + UI.week + " " + weekNum(w.week), esc(w.fare || w.title)) +
      '<div class="card"><p>' + mk(task.t) + '</p><ul class="reqs" id="sreqs">' + reqsHtml(r) + "</ul>" +
      '<p class="muted small">Escribí sin traductor: lo que te equivoques es lo que más vas a aprender. Podés dejarlo a medias y volver.</p></div>' +
      '<textarea id="stext" class="grow scrivi" rows="7" spellcheck="false" autocapitalize="sentences" placeholder="' + UI.scriviIn + '">' + esc(draft) + "</textarea>" +
      '<div class="row" style="margin-top:10px"><button class="btn" id="scheck">🔎 Revisar</button>' +
      '<button class="tab" id="smodel">👀 Ver un modelo</button></div>' +
      (window.EscrituraPlus ? '<div class="row ep-entry" style="margin-top:8px"><button class="tab" id="eptre">⏱️ Tres vueltas: 5, 4 y 3 min</button>' +
        '<button class="tab" id="eprif">🪞 Reformulación</button></div>' : "") +
      '<label class="muted small ltopt"><input type="checkbox" id="slt"' + (state.ltOff ? "" : " checked") + "> " +
        "Si la IA no está, pedir la corrección de LanguageTool (gratis; el texto se envía a su servidor)</label>" +
      '<p class="muted small ailine">🤖 ' + (aiKey()
        ? "Corrector con IA activado (" + aiNames() + "). "
        : "Para que una IA marque todo y lo explique, cargá una clave de Anthropic. ") +
        '<a href="#" id="aigo">Claves en ' + UI.me + " →</a></p>" +
      '<div id="sout"></div>';
  }

  /* Where the answer differs, gap by gap, for an item with several gaps
     («dell' | dell' | del | del»): «hueco 3: pusiste X, va Y».  What the
     AI gets as fact, so it explains that gap and nothing else. */
  function gapDiff(given, answer) {
    var want = String(answer || "").split(/\s*\|\s*/);
    if (want.length < 2) return "";
    var got = String(given || "").trim().split(/\s*[|,;]\s*|\s+/).filter(Boolean);
    if (got.length !== want.length) return "el alumno escribió " + got.length + " respuestas y hay " + want.length + " huecos";
    var out = [];
    want.forEach(function (w, k) { if (Engine.normalise ? Engine.normalise(got[k]) !== Engine.normalise(w) : got[k] !== w) out.push("hueco " + (k + 1) + ": puso «" + got[k] + "», va «" + w + "»"); });
    return out.length ? out.join("; ") : "los huecos coinciden: solo cambian la puntuación o los espacios";
  }

  var scriviTimer = null;
  /* The AI key: Anthropic, for Claude Haiku.  Only in this phone's
     storage, never in the backup. */
  var AI_KEY = SKEY("claude.key"), AI_WS = SKEY("claude.ws");
  function readKey(k) { try { return localStorage.getItem(k) || ""; } catch (e) { return ""; } }
  function aiKeys() { return { claude: readKey(AI_KEY), ws: readKey(AI_WS) }; }
  function aiKey() { return aiKeys().claude; }
  function aiNames() { return aiKey() ? "Claude Haiku" : ""; }
  // Which AI answered: «Claude · claude-haiku-5-5».
  function modelLine(m, m2) {
    var one = function (x) { return x ? esc(x.provider + " · " + x.model) : ""; };
    if (!m) return "";
    return '<p class="muted small modelline">' + (m2 ? "Corrigió " + one(m) + " · revisó " + one(m2) : "IA: " + one(m)) + "</p>";
  }
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
  function wireScrivi() {
    if (view.screen !== "scrivi") return;
    var w = course.weeks[view.week - 1], box = $("#stext");
    on("#sback", function () { view.screen = "briefing"; render(); window.scrollTo(0, 0); });
    ["tre", "rif"].forEach(function (m) {   // escritura_plus.js
      on("#ep" + m, function () { EscrituraPlus.start(m, w.week); view.screen = "eplus"; render(); window.scrollTo(0, 0); });
    });
    if (!box) return;
    box.addEventListener("input", function () {
      clearTimeout(scriviTimer);
      scriviTimer = setTimeout(function () {
        var r = Scrivi.check(box.value, w.week), ul = $("#sreqs");
        if (ul) ul.innerHTML = reqsHtml(r);
        if (!state.scrittiDraft) state.scrittiDraft = {};
        state.scrittiDraft[w.week] = box.value.slice(0, 4000);
        persist();
      }, 400);
    });
    on("#smodel", function () {
      var out = $("#sout");
      if (out) out.innerHTML = '<div class="card"><h3>Un modelo</h3><p class="model it">' + esc(Scrivi.TASKS[w.week].model) +
        '</p><p class="muted small">No es la única forma: compará las estructuras, no las palabras.</p></div>';
    });
    var lt = $("#slt");
    if (lt) lt.onchange = function () { state.ltOff = !lt.checked; persist(); };
    on("#aigo", function (e) {
      if (e && e.preventDefault) e.preventDefault();
      if (!state.scrittiDraft) state.scrittiDraft = {};
      state.scrittiDraft[w.week] = box.value.slice(0, 4000);
      persist();
      go("io");
      var card = $("#aicard");
      if (card) card.scrollIntoView({ block: "start" });
    });
    on("#scheck", function () {
      var text = box.value, r = Scrivi.check(text, w.week);
      /* The union (C8): the local marks (no false alarms measured) are shown
         as sure; with a key, what the AI finds is added to them, and where it
         disagrees with a local mark both are shown.  Without a key (or if
         the AI fails), LanguageTool adds its own. */
      r.local = r.findings;
      if (aiKey() && text.trim()) runAI();
      else fallback();
      function union(data) {
        r.findings = r.local.concat(Scrivi.fromAI(text, data, r.local));
        r.hard = scriviHard(r.findings);
      }
      function runAI() {
        r.ai = "…"; r.aiStage = null; r.findings = r.local; r.hard = scriviHard(r.local); r.cached = null;
        showScrivi(w, text, r, null);
        // the same text, or every sentence already corrected: no new request
        var hit = scriviCached(text, w.week);
        if (hit) {
          r.ai = "ok"; r.aiData = hit.data; r.aiMeta = null; r.cached = hit.how;
          union(hit.data);
          showScrivi(w, text, r, null);
          return;
        }
        // The evidence for the reviewer: the rule checker now (sure),
        // LanguageTool when it answers (at most six seconds; without it,
        // the review goes ahead with the local findings only).
        var sure = r.local.filter(function (f) { return !f.soft; }).map(function (f) { return window.Errores ? Errores.evidenceLine(f) : f.msg.replace(/\*/g, ""); });
        var ltMsgs = null, waiting = [];
        if (!state.ltOff) Scrivi.ltCheck(text, function (e2, matches) {
          ltMsgs = e2 ? [] : Scrivi.fromLT(text, matches, r.local).map(function (f) { return f.msg.replace(/\*/g, ""); });
          waiting.splice(0).forEach(function (fn) { fn(); });
        }); else ltMsgs = [];
        var evidence = function (go) {
          var pack = function () { return { local: sure, lt: ltMsgs || [] }; };
          if (ltMsgs) return go(pack());
          var t = setTimeout(function () { if (waiting.length) { waiting.length = 0; go(pack()); } }, 6000);
          waiting.push(function () { clearTimeout(t); go(pack()); });
        };
        Scrivi.aiCheck(text, w.week, aiKeys(), function (err, data, meta) {
          if (view.screen !== "scrivi" || $("#stext") !== box || box.value !== text) return;
          if (err) { r.ai = "error"; r.aiErr = String(err.message || err); fallback(); return; }
          r.ai = "ok"; r.aiData = data; r.aiMeta = meta;
          scriviRemember(text, w.week, data);
          union(data);
          showScrivi(w, text, r, null);
          on("#sretry", runAI);
        }, function (stage) {
          if (view.screen !== "scrivi" || $("#stext") !== box || box.value !== text) return;
          r.aiStage = stage;
          showScrivi(w, text, r, null);
        }, { evidence: evidence, ctx: aiCtx({ week: w.week, local: sure }) });
      }
      function fallback() {
        r.findings = r.local;
        r.hard = scriviHard(r.findings);
        showScrivi(w, text, r, state.ltOff || !text.trim() ? null : "…");
        on("#sretry", runAI);
        if (state.ltOff || !text.trim()) return;
        Scrivi.ltCheck(text, function (err, matches) {
          if (view.screen !== "scrivi" || $("#stext") !== box || box.value !== text || r.ai === "…" || r.ai === "ok") return;
          if (err) { r.lt = "error"; showScrivi(w, text, r, "error"); on("#sretry", runAI); return; }
          r.findings = r.findings.concat(Scrivi.fromLT(text, matches, r.findings)).sort(function (a, b) { return a.i - b.i; });
          r.hard = scriviHard(r.findings);
          r.lt = "ok";
          showScrivi(w, text, r, "ok");
          on("#sretry", runAI);
        });
      }
    });
  }

  // What counts as an error to fix: not the style, not the folded ones, not a second opinion.
  function scriviHard(list) { return (list || []).filter(function (f) { return !f.soft && !f.minor && !f.conflict; }).length; }
  /* The AI's correction of Scrivi, kept by text and by sentence (P4.4): the
     same text, or a text whose sentences were all corrected before, is not
     sent again. */
  function scriviCached(text, week) {
    var E = window.Errores;
    if (!E) return null;
    var full = E.cacheGet("scrivi", [week, text]);
    if (full) return { data: full, how: "texto" };
    var ss = E.sentences(text), errs = [];
    if (!ss.length) return null;
    for (var i = 0; i < ss.length; i++) {
      var c = E.cacheGet("scrivi-s", [week, ss[i].s]);
      if (!c) return null;
      errs = errs.concat(c.errores || []);
    }
    return { data: { errores: errs, corregido: "", consigna: "", comentario: "" }, how: "oraciones" };
  }
  function scriviRemember(text, week, data) {
    var E = window.Errores;
    if (!E || !data || !Array.isArray(data.errores)) return;
    E.cacheSet("scrivi", [week, text], data, "Scrivi " + week + " · " + text.slice(0, 80));
    var ss = E.sentences(text), per = ss.map(function () { return []; });
    data.errores.forEach(function (e) {
      var bad = String((e && e.mal) || "").toLowerCase().trim();
      if (!bad) return;
      for (var i = 0; i < ss.length; i++) if (ss[i].s.toLowerCase().indexOf(bad) >= 0) { per[i].push(e); return; }
    });
    ss.forEach(function (x, i) { E.cacheSet("scrivi-s", [week, x.s], { errores: per[i] }, "Scrivi " + week + " · " + x.s.slice(0, 80)); });
  }

  /* Tres vueltas y reformulación (docs/js/escritura_plus.js): lo que el
     módulo necesita de la app. */
  function epHost() {
    return { state: state, week: course.weeks[view.week - 1], esc: esc, mk: mk, UI: UI, persist: persist, gain: gain,
             toast: toast, aiKeys: aiKeys, aiKey: aiKey, lexicon: scriviLexicon,
             // the errors of the last lap and of the text reformulated go to the profile (F §2.2)
             recordFindings: function (findings, text, reg) {
               if (!window.Errores) return 0;
               var n = Errores.recordFindings(state, findings, text, { registro: reg || null }).length;
               if (n) persist();
               return n;
             },
             rerender: function () { if (view.screen === "eplus") render(); },
             back: function () { EscrituraPlus.stop(); view.screen = "scrivi"; render(); window.scrollTo(0, 0); } };
  }

  function showScrivi(w, text, r, ltState) {
      var out = $("#sout");
      if (!out) return;
      var hard = r.findings.filter(function (f) { return !f.soft && !f.minor && !f.conflict; });
      // the week's and the weak categories first; with a beginner, the rest folded (P4.5)
      var major = r.findings.filter(function (f) { return !f.minor; }), minor = r.findings.filter(function (f) { return f.minor; });
      var byPos = function (a, b) { return (a.i < 0 ? 1e9 : a.i) - (b.i < 0 ? 1e9 : b.i); };
      var shown = major.sort(byPos).concat(minor.sort(byPos));
      var item = function (f, k) {
        var src = f.conflict ? "" : f.ai ? '<span class="src">🤖 IA</span>' : f.lt ? "" : r.ai === "ok" ? '<span class="src">✓ corrector</span>' : "";
        return '<li class="' + (f.conflict ? "soft conflict" : f.soft ? "soft" : "bad") + '"><b>' + (k + 1) + ".</b> " +
          mk(DV ? DV.plain(f.msg, w.week) : f.msg) + src + "</li>";
      };
      var list = major.map(item).join("");
      var minorList = minor.map(function (f, k) { return item(f, major.length + k); }).join("");
      var missing = r.reqs.filter(function (q) { return !q.ok; });
      var busy = r.ai === "…";
      out.innerHTML = '<div class="card">' +
        (busy ? (r.aiStage === "review" ? '<p>⏳ Un segundo profesor está revisando la corrección…</p>' : '<p>⏳ La IA está corrigiendo tu texto…</p>') +
                '<p class="muted small">Corrige y después revisa: suele tardar menos de 30 segundos. Mientras, lo que ya marcó el corrector de la app:</p>' : "") +
        (shown.length ? '<p class="scrivi-marked it">' + Scrivi.markup(text, shown, esc) + "</p>" +
              (list ? '<ol class="findings">' + list + "</ol>" : "") +
              (minorList ? '<details class="minorf"><summary>Otras cosas para más adelante (' + minor.length + ")</summary><ol class=\"findings\">" + minorList + "</ol></details>" : "")
          : busy ? "" : r.ai === "ok" ? "<p>✨ Ni la IA ni el corrector encontraron errores.</p>"
          : '<p>✨ No encontré errores' + (ltState === "ok" ? ", y LanguageTool tampoco." : " de los que sé buscar.") + "</p>") +
        (r.ai === "ok" && r.aiData ? '<div class="aiout">' +
              (r.aiData.consigna ? '<p class="muted small">📋 ' + esc(r.aiData.consigna) + "</p>" : "") +
              (r.aiData.comentario ? "<p>🤖 " + mk(DV ? DV.plain(r.aiData.comentario, w.week) : r.aiData.comentario) + "</p>" : "") +
              (r.aiData.corregido ? '<p class="muted small">Versión corregida:</p><p class="model it">' + esc(r.aiData.corregido) + "</p>" : "") +
              (r.cached ? '<p class="muted small modelline">IA: ' + (r.cached === "texto" ? "este texto ya estaba corregido" : "cada oración ya estaba corregida") + " (guardado en el teléfono, sin volver a preguntar).</p>"
                : r.aiMeta ? modelLine(r.aiMeta.first, r.aiMeta.review) : "") +
            "</div>" : "") +
        (r.ai === "error" ? '<p class="muted small">⚠️ No pude usar la IA (' + esc(r.aiErr || "") + "). " +
              (/clave|401|403/.test(r.aiErr || "") ? "Revisá las claves en " + UI.me + ". " : "") +
              "Mientras, te muestro la revisión automática, que es mucho más limitada.</p>" +
              '<button class="tab" id="sretry">🤖 Probar la IA de nuevo</button>' : "") +
        (!r.ai && !aiKey() ? '<p class="muted small">Esta es la revisión automática, que se le escapan muchas cosas. Para una corrección completa, cargá una clave en ' + UI.me + ".</p>" : "") +
        (!busy && r.ai !== "ok" ? (ltState === "…" ? '<p class="muted small">⏳ Consultando LanguageTool…</p>'
          : ltState === "error" ? '<p class="muted small">No pude consultar LanguageTool (sin conexión o límite de uso).</p>'
          : ltState === "ok" ? '<p class="muted small">✓ Revisado también por LanguageTool.</p>' : "") : "") +
        (busy ? "" : missing.length ? '<p class="muted">Todavía falta: ' + missing.map(function (q) { return esc(q.label) + " (" + q.n + " / " + q.need + ")"; }).join(" · ") + ".</p>"
                        : '<p>Cumple la consigna.' + (hard.length ? " Corregí lo marcado si querés, o entregalo así: los errores quedan anotados para la clínica." : "") + "</p>" +
                          '<button class="btn" id="sdone">✓ Entregar el texto</button>') +
        "</div>";
      on("#sdone", function () { deliverScrivi(w, text, r); });
      if (ltState !== "ok" && ltState !== "error") out.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function deliverScrivi(w, text, r) {
    var before = doneCount(w), first = !(state.scritti || {})[w.week];
    var hard = r.findings.filter(function (f) { return !f.soft && !f.minor && !f.conflict; });
    if (!state.scritti) state.scritti = {};
    state.scritti[w.week] = { t: text.slice(0, 4000), at: Date.now(), n: r.words, errs: hard.length };
    if (state.scrittiDraft) delete state.scrittiDraft[w.week];
    // The mistakes go to the error profile, like any other answer: what was
    // written, the correction and why (the common error object).
    var task = Scrivi.TASKS[w.week] || {};
    if (window.Errores) Errores.recordFindings(state, hard, text, { registro: task.reg || null });
    else {
      var toks = Scrivi.toks(text);
      hard.forEach(function (f) { var tk = toks[f.i] || {}; recordError({ cat: f.cat, target: f.good || "", explain: f.why || f.msg }, f.bad || tk.o || ""); });
    }
    // by the word (with a cap), by each structure asked and met, and clean (Engine.xpText)
    var xp = first ? (Engine.xpText ? Engine.xpText(r.words, (r.reqs || []).filter(function (q) { return q.ok && q.id; }).length, !hard.length)
                                    : 40 + Math.min(40, Math.floor(r.words / 5)) + (hard.length ? 0 : 20)) : 10;
    gain(xp);
    Engine.addStrand(state, "output", xp);
    if (first) state.written = (state.written || 0) + 1;
    Engine.touchStreak(state);
    var extras = missionCheck(w.week, before);
    Engine.checkBadges(state);
    persist();
    renderHeader();
    view.screen = "briefing";
    render();
    window.scrollTo(0, 0);
    var news = extras.filter(function (x) { return /abierta/.test(x) || x.indexOf(UI.perfectWeek) >= 0; })[0] || extras[0];
    toast("✍️ Texto entregado · +" + xp + " xp" + (news ? " · " + news : ""), 3500);
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

    if (it.type === "fixerr") wireFixerr(it);

    on("#showtext", function () { $("#qtext").hidden = !$("#qtext").hidden; });

    if (it.type === "hunt") {
      var sel = [];
      document.querySelectorAll("[data-tok]").forEach(function (w) {
        w.onclick = function () {
          if (round.answered) return;
          var k = +w.dataset.tok, at = sel.indexOf(k);
          if (at >= 0) sel.splice(at, 1); else sel.push(k);
          w.classList.toggle("on", at < 0);
          fx.tap();
          $("#hcount").textContent = sel.length + " marcadas";
        };
      });
      on("#hcheck", function () {
        var ep = Letture.byId(it.ep);
        var r = Letture.gradeHunt(ep, sel);
        document.querySelectorAll("[data-tok]").forEach(function (w) {
          var k = +w.dataset.tok, want = r.targets.indexOf(k) >= 0, got = sel.indexOf(k) >= 0;
          w.classList.remove("on");
          if (want && got) w.classList.add("hit");
          else if (want) w.classList.add("missed");
          else if (got) w.classList.add("bad");
        });
        settle(r.verdict, sel.join(","),
          '<div class="note">Encontraste ' + r.hit + " de " + r.total +
          (r.wrong ? " · " + r.wrong + " de más" : "") +
          ". En verde las que marcaste bien; subrayadas en naranja, las que faltaban.</div>");
      });
    }

    if (it.type === "dictation") {
      on("#play1", function () { it.voice ? speakItem(it, true) : speak(it.answer, true); });
      on("#slow", function () { it.voice ? speakItem(it, true, 0.6) : speak(it.answer, true, 0.6); });
      setTimeout(function () { it.voice ? speakItem(it) : speak(it.answer); }, 250);
    }

    if (it.type === "intro") {
      on("#next", nextItem);
      on("#sayit", function () { speak(it.frase.it, true); });
      on("#slow", function () { speak(it.frase.it, true, 0.6); });
      speak(it.frase.it);
    }

    if (it.type === "tiles") {
      drawTiles();
      on("#tcheck", function () {
        if (!round.picked.length) return;
        var r = gradeTiles(it);
        var extra = "";
        if (r.verdict !== Engine.VERDICT.RIGHT && window.Diagnosi) {
          var d = Diagnosi.diagnose(r.given, [it.answer], { stem: it.stem });
          // Tiles are all words of the language handed over: a wrong pick is order,
          // a tile too many or too few, or the wrong form; never a «false
          // friend» or a «Spanish word».
          if (d.cat && !GENERIC[d.cat] && !TILE_SKIP[d.cat]) { if (DV) DV.tidy(d); recordError(d, r.given); extra = diagHtml(d, true); }
        }
        settle(r.verdict, r.given, extra);
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
    if (SAY_TYPES[it.type]) {
      on("#play1", function () { speakItem(it, true); });
      on("#slow", function () { speakItem(it, true, 0.6); });
      on("#both", function () {
        // both words of the pair, one after the other, same voice
        var v = it.voice || {};
        speak(it.pair.a, true, v.rate, { pitch: v.pitch, vi: v.vi, onend: function () {
          speak(it.pair.b, true, v.rate, { pitch: v.pitch, vi: v.vi, keep: true });
        } });
      });
      setTimeout(function () { speakItem(it); }, 250);
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

    if (it.type === "write" || it.type === "dictation") {
      var w = $("#wans");
      var check = function () { produce(w.value); };
      on("#wsend", check);
      w.onkeydown = function (e) {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); check(); }
      };
      w.focus();
      on("#hint", function () {
        var t = $("#hinttxt");
        var ws = Frasi.tiles(it.answer);
        t.textContent = ws.slice(0, Math.max(1, Math.ceil(ws.length / 3))).join(" ") + " …";
        t.hidden = false;
        round.hinted = true;
        w.focus();
      });
      // Too hard right now: fall back to tiles for this phrase.
      on("#easier", function () {
        round.hinted = true;
        round.items[round.i] = Frasi.tilesItem(it.frase);
        render();
      });
    }
  }

  /* Trova l'errore / Ache o erro: primero encontrar (notar), después corregir (producir). */
  function wireFixerr(it) {
    var toks = it.stem.split(/\s+/);
    var core = function (t) { return t.toLowerCase().replace(new RegExp("^[^" + WCH + "]+|[^" + WCH + "]+$", "g"), ""); };
    var badT = it.bad.split(/\s+/).map(core), start = -1;
    for (var i = 0; i <= toks.length - badT.length && start < 0; i++) {
      var ok = true;
      for (var j = 0; j < badT.length; j++) if (core(toks[i + j]) !== badT[j]) ok = false;
      if (ok) start = i;
    }
    var misses = 0, found = false;
    var label = (window.Diagnosi && Diagnosi.LABEL[it.cat]) || it.cat;
    function markBad(cls) {
      for (var k = start; k < start + badT.length; k++) {
        var el = document.querySelector('[data-ft="' + k + '"]');
        if (el) el.classList.add(cls);
      }
    }
    // the error and its correction, with the category: after missing it, and
    // after fixing it (what was fixed, said back)
    function fixHtml() {
      return '<div class="diag"><span class="tag">' + esc(label) + "</span>" +
        '<div class="diff"><span class="k">mal</span> ' + esc(it.bad) + ' <span class="k">→</span> ' +
        (it.good ? "<b class=\"fix\">" + esc(it.good) + "</b>" : "<i>(se borra)</i>") + "</div></div>";
    }
    // the error of «Trova l'errore» as it is: the wrong words, the right ones, the why
    var fixErr = function () {
      return window.Errores ? Errores.make({ cat: it.cat, mal: it.bad, bien: it.good == null ? null : it.good, regla: it.note || "",
                                             registro: "formal", label: label }) : { cat: it.cat, target: it.answer };
    };
    function reveal() {
      markBad("missed");
      recordError(fixErr(), it.stem);
      settle("sbagliato", "", fixHtml());
    }
    function askFix() {
      $("#fixbox").innerHTML = '<p class="muted">¡Bien visto! Ahora corregila: escribí lo que va en su lugar' +
        ' o, si sobra, borrala.</p>' +
        '<div class="typed"><textarea id="fxin" class="grow" rows="1" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="send">' +
        esc(it.bad) + '</textarea><button class="btn" id="fxsend">' + UI.check + "</button></div>" +
        '<div class="row" style="margin-top:8px"><button class="tab" id="fxdel">🗑️ sobra: borrarla</button></div>';
      var inp = $("#fxin");
      growBoxes();
      inp.focus(); inp.select();
      var tries = 0;
      function judge(val) {
        if (round.answered) return;
        val = String(val).trim();
        // Other corrections that are just as right (fra/tra, para/pra…).
        var goods = [it.good].concat(it.goodAlt || []).filter(Boolean);
        var right = it.good === "" ? val === "" : window.Diagnosi &&
          Diagnosi.diagnose(val, goods, { registro: "formal" }).verdict === Engine.VERDICT.RIGHT;
        if (right) {
          if (tries) markFixed(it.cat);
          settle(tries ? "quasi" : "giusto", val, fixHtml(),
                 tries ? { label: "¡Eso es!" } : {});
          return;
        }
        tries++;
        if (tries === 1) {
          recordError(fixErr(), it.stem);
          var d = it.good && window.Diagnosi ? Diagnosi.diagnose(val || "—", [it.good], { registro: "formal" }) : null;
          if (d && DV) DV.tidy(d);
          var closeTo = !DV || !it.good || !val || DV.near(val, goods, d);
          $("#fb").innerHTML = '<div class="feedback prompt"><div class="verdict">' + (closeTo ? "🔎 Casi." : "🔎 Todavía no.") + "</div><p>" +
            (it.good === "" ? "Esa palabra no hay que cambiarla por otra: sobra." :
             d && d.hint && !GENERIC[d.cat] ? mk(d.hint) : "Pista: es un error de <b>" + esc(label) + "</b>.") +
            "</p></div>";
          inp.focus();
          return;
        }
        settle("sbagliato", val, fixHtml());
      }
      on("#fxsend", function () { judge(inp.value); });
      inp.onkeydown = function (e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); judge(inp.value); } };
      on("#fxdel", function () { judge(""); });
    }
    document.querySelectorAll("[data-ft]").forEach(function (el) {
      el.onclick = function () {
        if (round.answered || found) return;
        var k = +el.dataset.ft;
        fx.tap();
        if (k >= start && k < start + badT.length) {
          found = true;
          markBad("on");
          askFix();
          return;
        }
        misses++;
        el.classList.add("bad");
        if (misses === 1) {
          $("#fb").innerHTML = '<div class="feedback prompt"><div class="verdict">🔎 Esa está bien.</div>' +
            "<p>Pista: el error es de <b>" + esc(label) + "</b>.</p></div>";
        } else reveal();
      };
    });
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
      // the C1 exam with a version (the smoke test)
      esame: function (ver) { esameOpen(ver); },
      // play these items (ids of the course or of the lab, or items): the
      // correction of one exercise, answered on purpose
      play: function (list, week) {
        if (week) view.week = week;
        var its = (list || []).map(function (x) {
          if (typeof x !== "string") return x;
          return itemMap[x] ? Object.assign({}, itemMap[x]) : window.Lab && Lab.item ? Lab.item(x) : null;
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
        if (round.answered || it.type === "word" || it.type === "card" || it.type === "intro") { nextItem(); return "next"; }
        if (!$("#fb")) return "stuck:" + it.type;
        settle(verdict || "giusto", String(it.answer == null ? "" : it.answer).replace(/\s*\|\s*/g, " "), "");
        return "answered";
      }
    };
  }

  // Concordancias y «Mi gramática» (docs/js/referencia.js).
  if (window.Referencia) Referencia.attach({
    state: function () { return state; }, persist: persist,
    course: function () { return course; }, glossary: function () { return glossario; },
    fx: function (ok) { if (ok) fx.right(); else fx.wrong(); gain(ok ? 3 : 1); },
    open: function () { if (view.screen !== "gramatica") view.gramFrom = view.screen; view.screen = "gramatica"; render(); window.scrollTo(0, 0); },
    back: function () {
      if (view.gramFrom === "consultar") { view.gramFrom = null; view.screen = "consultar"; render(); window.scrollTo(0, 0); }
      else go(view.tab || "io");
    }
  });
  // Las capas (capas.js): «Consultar» y las misiones de la Biblioteca y de Tres vueltas.
  if (window.Capas) Capas.attach({
    state: function () { return state; }, persist: persist, speak: speak, glossary: function () { return glossario; },
    show: function (sc) { view.screen = sc; render(); window.scrollTo(0, 0); },
    back: function () { go(view.tab || "frasi"); },
    refresh: function () { if (course && ["briefing", "percorso", "leggi"].indexOf(view.screen) >= 0) render(); },
    openBook: function (id, ch) { if (window.Biblioteca) Biblioteca.openChapter(view, id, ch, view.week); },
    tre: function (week) {
      if (!window.EscrituraPlus) return;
      view.week = week; EscrituraPlus.start("tre", week); view.screen = "eplus"; render(); window.scrollTo(0, 0);
    }
  });
  // Escritura guiada (escritos.js): lo que necesita de la app.
  if (window.Escritos) Escritos.attach({
    state: function () { return state; }, persist: persist, gain: gain, render: render, go: go, toast: toast,
    esc: esc, plate: plate, fx: fx, startRound: startRound,
    show: function (s) { view.screen = s; render(); window.scrollTo(0, 0); },
    toWeek: function () { view.tab = "percorso"; view.screen = "briefing"; render(); window.scrollTo(0, 0); }
  });

  // Tramo C1 (tramo.js): la escucha larga y la tarea integrada de las semanas 27-51.
  if (window.Tramo) Tramo.attach({
    state: function () { return state; }, persist: persist, render: render, go: go, toast: toast,
    esc: esc, mk: mk, plate: plate, speak: speak, listened: noteListening, shuffle: Drills.shuffle, lexicon: scriviLexicon,
    gain: function (n, strand) { gain(n); if (strand && n) Engine.addStrand(state, strand, n); renderHeader(); },
    aiKey: aiKey, aiKeys: aiKeys, ui: function () { return UI; }, langName: function () { return UI.langEs; },
    screen: function () { return view.screen; },
    // the task's errors go to the profile (the common error object of errores.js)
    recordFindings: function (findings, text, reg) {
      if (!window.Errores) return;
      if (Errores.recordFindings(state, findings, text, { registro: reg || null }).length) persist();
    },
    recordRows: function (rows, reg) {
      if (!window.Errores) return;
      (rows || []).forEach(function (e) { Errores.record(state, Errores.fromRow(e[0], e[1], "", "ia", { registro: reg || null })); });
      persist();
    },
    show: function (sc) { view.screen = sc; render(); window.scrollTo(0, 0); },
    toWeek: function () { view.tab = "percorso"; view.screen = "briefing"; render(); window.scrollTo(0, 0); },
    openReading: function (id) { view.ep = id; view.epFrom = "briefing"; view.screen = "lettura"; render(); window.scrollTo(0, 0); }
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
    words: function (id) { var ep = Letture.byId(id); return ep ? Letture.allTokens(ep).length : 0; },
    readingsDone: function () { return Object.keys(state.letture || {}).filter(function (id) { return Letture.byId(id); }).length; },
    canTranslate: function () { return Banca.loaded() && (state.unlocked || 1) >= (Banca.TR_WEEK || 99); },
    canPausa: function () { return Object.keys(state.read || {}).length > 0 || Object.keys(state.readSess || {}).length > 0 || state.unlocked > 1; },
    maint: function () {
      var t = state.tramo || {}, scrAt = 0, asc = [], scr = [];
      Object.keys(t.scr || {}).forEach(function (k) { scrAt = Math.max(scrAt, (t.scr[k] || {}).at || 0); });
      if (window.Tramo) course.weeks.forEach(function (w) {
        Tramo.missions(w, state).forEach(function (m) {
          (m.kind === "tr-asc" ? asc : scr).push({ week: w.week, title: m.title.replace(/^[^:]*:\s*/, "") });
        });
      });
      return { reads: Letture.ofSeries("lunga").map(function (ep) { return { id: ep.id, title: ep.title, words: Letture.allTokens(ep).length }; }),
               asc: asc, scr: scr, lastTask: scrAt, lastSim: state.simAt || state.phaseAt || 0 };
    },
    startRound: function (kind, arg) { view.week = Math.min(state.unlocked, NW()); startRound(kind, arg); roundFromHoy(); },
    startMission: function (kind, arg, wk) {
      view.week = wk;
      if (kind === "ep") { view.ep = arg; view.epFrom = "hoy"; view.tab = "oggi"; showScreen("lettura"); return; }
      goMission(kind, arg);
      if (view.screen === "gioco") roundFromHoy(); else view.tab = "percorso";
      renderNav();
    },
    openReading: function (id) { view.ep = id; view.epFrom = "hoy"; showScreen("lettura"); },
    openTramo: function (kind, arg) { view.tab = "leggi"; Tramo.go(kind, arg, "leggi"); },
    openBiblio: function () { view.tab = "leggi"; showScreen("biblioteca"); },
    // the exam screen; with a version ("A", "v2"…), a mock exam with it
    openExam: function (ver) { esameOpen(ver); }, examNext: esameNext, examVersions: esameVersions,
    playFacile: function () {
      var ids = Object.keys(state.letture || {}).filter(function (id) { return Letture.byId(id); });
      if (ids.length) playLibrary(Drills.shuffle(ids));
    },
    show: showScreen, ubicacion: startUbicacion, exam: esameResult,
    ics: scheduleReminder,
    share: shareBlob
  });
  // Tu progreso (progreso.js): la pantalla, y el reloj de estudio.
  if (window.Progreso) Progreso.attach({
    state: function () { return state; }, persist: persist, esc: esc, course: function () { return course; },
    show: showScreen, back: function () { go(view.tab || "io"); },
    screen: function () { return view.screen; }, roundKind: function () { return round ? round.kind : ""; },
    listening: function () { return !!(window.speechSynthesis && speechSynthesis.speaking) || !!karaoke; },
    coverage: function () { return window.Freq && Freq.loaded() ? Freq.coverage(knownWords()) : null; },
    words: function (id) { var ep = Letture.byId(id); return ep ? Letture.allTokens(ep).length : 0; },
    label: function (c) { return (window.Diagnosi && Diagnosi.LABEL[c]) || c; },
    cards: progresoCards
  });

  // Fuera de la app (fuera.js): la ficha de la semana y los minutos de afuera.
  if (window.Fuera) Fuera.attach({
    state: function () { return state; }, persist: persist, render: render, go: go, toast: toast, mk: mk,
    lexicon: scriviLexicon, ui: function () { return UI; },
    gain: function (n, strand) { gain(n); if (strand && n) Engine.addStrand(state, strand, n); renderHeader(); },
    recordFindings: function (findings, text) {
      if (window.Errores && Errores.recordFindings(state, findings, text, {}).length) persist();
    },
    show: showScreen,
    toWeek: function () { view.tab = "percorso"; view.screen = "briefing"; render(); window.scrollTo(0, 0); }
  });

  // El seminario, los dilemas y la literatura (seminario.js): lo semanal del formato.
  if (window.Seminario) Seminario.attach({
    state: function () { return state; }, persist: persist, render: render, go: go, toast: toast, mk: mk,
    course: function () { return course; }, aiKeys: aiKeys, show: showScreen,
    gain: function (n, strand) { gain(n); if (strand && n) Engine.addStrand(state, strand, n); renderHeader(); },
    toWeek: function () { view.tab = "percorso"; view.screen = "briefing"; render(); window.scrollTo(0, 0); }
  });

  // Para el trabajo (trabajo.js): las escenas de oficina, desde el A2.
  if (window.Trabajo) Trabajo.attach({
    state: function () { return state; }, persist: persist, render: render, go: go, toast: toast, mk: mk,
    lexicon: scriviLexicon, ui: function () { return UI; }, speak: speak,
    gain: function (n, strand) { gain(n); if (strand && n) Engine.addStrand(state, strand, n); renderHeader(); },
    recordFindings: function (findings, text) {
      if (window.Errores && Errores.recordFindings(state, findings, text, {}).length) persist();
    },
    startRound: function (kind, arg) { startRound(kind, arg); },
    show: showScreen,
    toWeek: function () { view.tab = "percorso"; view.screen = "briefing"; render(); window.scrollTo(0, 0); }
  });

  // La Biblioteca (biblioteca.js): libros enteros, con el lector y el input.
  if (window.Biblioteca) Biblioteca.init({
    state: function () { return state; }, view: function () { return view; }, persist: persist, gain: gain,
    render: render, go: go, toast: toast, speak: speak, glossary: function () { return glossario; },
    strand: function (n) { Engine.addStrand(state, "input", n); },
    karaoke: { start: startKaraoke, stop: function () { stopKaraoke(); document.body.classList.remove("kar-partial", "kar-audio"); },
               playing: function () { return !!karaoke; } }
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

  /* The glossary and the frequency layer are optional and not needed for
     the first screen (a million bytes between the two): they are asked
     for once the first screen is drawn, so the course and the bank get the
     whole connection first. */
  var extrasAsked = false;
  function loadExtras() {
    if (extrasAsked) return;
    extrasAsked = true;
    // The glossary: without it words are just not tappable.
    if (hasData("glossario.json")) fetch(DATA("glossario.json"))
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (g) {
        glossario = g;
        // every word of the glossary exists for the diagnosis (not «no es una palabra»)
        if (g && window.Diagnosi && typeof Diagnosi.addWords === "function") { try { Diagnosi.addWords(Object.keys(g)); } catch (e) { /* */ } }
      })
      .catch(function () { /* sin glosario */ });
    // The frequency layer: without it, no coverage meter.
    if (hasData("frequenza.json")) fetch(DATA("frequenza.json"))
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (f) { if (f && window.Freq) { Freq.load(f); if (view.screen === "io" || view.screen === "oggi") render(); } })
      .catch(function () { /* sin frecuencias */ });
  }
  function loadExtrasSoon() {
    if (window.requestIdleCallback) window.requestIdleCallback(loadExtras, { timeout: 1500 }); else setTimeout(loadExtras, 300);
  }

  // The bank is optional: without it the app still works, just smaller.
  var bankP = !hasData("bank.json") ? Promise.resolve() : fetch(DATA("bank.json"))
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (b) { if (b) Banca.load(b); })
    .catch(function () { /* sin banco */ });

  fetch(DATA("course.json"))
    .then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .then(function (data) { return bankP.then(function () { return data; }); })
    .then(function (data) {
      course = data;
      // the length of the course: the weeks written, the final exam (engine.js)
      Engine.setCourse(course);
      if (state.unlocked > NW()) state.unlocked = NW();
      try {
        if (window.Mapas) Mapas.install(course);
        itemMap = Drills.itemsById(course);
        registerStories();
        view.week = Math.min(state.unlocked, NW());
        if (Engine.checkStreak(state).status === "lost") persist();
        // A new learner: the three screens after the language picker (inicio.js).
        if (window.Inicio && Inicio.boot(view)) { renderHeader(); render(); loadExtrasSoon(); return; }
        if (location.hash === "#pausa") { renderHeader(); startRound("pausa"); loadExtrasSoon(); return; }
        if (location.hash === "#micro") { renderHeader(); startRound("micro"); loadExtrasSoon(); return; }
        updateBadge();
        renderHeader();
        if (!restoreView()) render();
        loadExtrasSoon();
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
