/*
 * Escritura guiada: el pegamento de las tres prácticas escritas nuevas con
 * la app (misiones opcionales de la semana, Treino / Allena, la pausa).
 *
 *   🔁 Variaciones de frase (variaciones.js): una ronda del motor de
 *      siempre, con corrección de Diagnosi.
 *   🧩 C-test y cloze racional (ctest.js) sobre textos YA LEÍDOS (lecturas
 *      y dictogloss hechos; desde la semana 27, también la lectura larga del
 *      tramo y la transcripción de la escucha larga ya hecha): pantalla
 *      propia, corrección por hueco, una segunda vuelta para lo que quedó
 *      mal.  Un texto largo se trabaja por pasajes (passage), y el largo del
 *      pasaje, la cantidad de huecos y de piezas crecen con la semana
 *      (CTest.level, Ordenar.level).
 *   🔀 «Ordená el texto» (ordenar.js): párrafos u oraciones de un texto ya
 *      visto, con los conectores marcados como pista.
 *   ☕ En la pausa, con poco peso: la mitad de las veces, un solo ítem de
 *      una de las tres (una variación, un hueco de conector, tres oraciones
 *      para ordenar).
 *
 * Nada oral: todo se lee y se escribe.  app.js le pasa un «host» con lo
 * que necesita (estado, guardar, xp, navegar) en attach(); las pantallas se
 * dibujan con render() / wire() cuando view.screen === "escritos".
 *
 * Lo que guarda, en state.escritos: var {semana: {pct, at}}, huecos
 * {fuente:modo: {pct, at}}, ordenar {fuente: {pct, at}}, wk {semana:
 * {huecos, ordenar}} (las misiones de la semana).
 */
(function (root) {
  "use strict";

  var H = null;            // the host (app.js)
  var cur = null;          // the open exercise
  var CTEST_WEEK = 4;      // before this week the text-with-gaps mission is a cloze
  var MISSION_KINDS = { "esc-var": 1, "esc-huecos": 1, "esc-ordenar": 1 };

  function UI() { return (root.LANG && root.LANG.ui) || {}; }
  function esc(s) { return H ? H.esc(s) : String(s); }
  function D() { return root.ESCRITOS_DATA || {}; }

  function store(state) {
    var s = state || (H && H.state());
    if (!s.escritos) s.escritos = {};
    var e = s.escritos;
    ["var", "huecos", "ordenar", "wk"].forEach(function (k) { if (!e[k]) e[k] = {}; });
    return e;
  }

  /* ------------------------------------------------------------ fuentes */

  var ALL = null;
  function allSources() {
    if (ALL) return ALL;
    var out = [];
    if (root.Letture) root.Letture.EPISODI.forEach(function (ep) {
      if (ep.text) out.push({ id: "ep:" + ep.id, ep: ep.id, title: ep.title, text: ep.text, week: ep.week || 1, emoji: ep.emoji || "📖",
                              kind: ep.series === "lunga" ? "larga" : "lectura" });
    });
    var Dg = root.Suoni && root.Suoni.dictogloss && root.Suoni.dictogloss();
    if (Dg) Dg.TESTI.forEach(function (t) {
      out.push({ id: "dg:" + t.week, dg: t.week, title: t.title, text: t.text, week: t.week, emoji: "📝", kind: "dictogloss" });
    });
    // The long listenings of the tramo, transcribed: one turn per paragraph.
    var TR = root.TRAMO_DATA;
    ((TR && TR.SETTIMANE) || []).forEach(function (w) {
      var a = w.ascolto;
      if (!a || !a.turns || !a.turns.length) return;
      out.push({ id: "as:" + w.week, as: w.week, title: a.title, week: w.week, emoji: "🎧", kind: "escucha",
                 text: a.turns.map(function (t) { return "— " + String(t[1]).trim(); }).join("\n") });
    });
    if (out.length) ALL = out;
    return out;
  }
  function seen(state, src) {
    if (src.ep) return !!(state.letture || {})[src.ep];
    if (src.as) return !!(((state.tramo || {}).asc || {})[src.as]);
    return !!(state.dictogloss || {})[src.dg];
  }
  var KIND = { lectura: "Lectura", larga: "Lectura larga", dictogloss: "Dictogloss", escucha: "Escucha transcripta" };

  /* ----------------------------------------------------------- pasajes */

  function wordsIn(t) { return String(t).split(/\s+/).filter(function (x) { return /[A-Za-zÀ-ÿ]/.test(x); }).length; }
  // How long a passage is: it grows with the course.
  function passageWords(week) { week = +week || 1; return week < 14 ? 120 : week < 27 ? 180 : week < 40 ? 240 : 320; }
  /* The passages of a text: runs of whole paragraphs of about n words (a
     long paragraph is one passage).  A short text is one passage. */
  function passages(text, n) {
    var pars = String(text).split(/\n+/).map(function (p) { return p.trim(); }).filter(Boolean);
    if (wordsIn(text) <= n * 1.4) return [pars.join("\n")];
    var out = [], cur = [], w = 0;
    pars.forEach(function (p) {
      var pw = wordsIn(p);
      if (cur.length && w + pw > n * 1.2) { out.push(cur.join("\n")); cur = []; w = 0; }
      cur.push(p); w += pw;
      if (w >= n) { out.push(cur.join("\n")); cur = []; w = 0; }
    });
    if (cur.length) {
      // a short tail joins the previous passage
      if (out.length && w < n / 2) out[out.length - 1] += "\n" + cur.join("\n"); else out.push(cur.join("\n"));
    }
    return out;
  }
  // The passage number k (cycling) of a source for a week, with its place.
  function passage(src, week, k) {
    var ps = passages(src.text, passageWords(week)), i = ((k || 0) % ps.length + ps.length) % ps.length;
    return { text: ps[i], i: i, of: ps.length };
  }
  /* Only what was already read (or rebuilt in a dictogloss): the text is
     known, so the gaps test the language, not the plot. */
  function sources(state, maxWeek) {
    return allSources().filter(function (s) { return seen(state, s) && (!maxWeek || s.week <= maxWeek); })
      .sort(function (a, b) { return b.week - a.week || (a.kind === "lectura" ? -1 : 1); });
  }
  function byId(id) {
    return allSources().filter(function (s) { return s.id === id; })[0] || null;
  }
  // The text of the week for a mission: the week's own reading or
  // dictogloss if done, else the latest one read before.
  function weekSource(state, week, test, prefer) {
    var list = sources(state, week).filter(function (s) { return !test || test(s); });
    var own = list.filter(function (s) { return s.week === week; });
    var rank = function (s) { var i = (prefer || []).indexOf(s.kind); return i < 0 ? 9 : i; };
    own.sort(function (a, b) { return rank(a) - rank(b); });
    return own[0] || list[0] || null;
  }
  /* The text of «Ordená»: never the week's own (that one is ordered from
     memory, not by its connectors).  First a text of the last weeks the
     learner did not read (its level is already known); else one read at
     least three weeks ago (the plot is forgotten by then), the most recent
     of those; at the start of the course, the oldest one there is.  Stable:
     the same text for the week while nothing changes. */
  function orderSource(state, week) {
    var ok = function (s) { return s.week < week && orderable(s, week); };
    var all = allSources().filter(ok);
    var near = all.filter(function (s) { return !seen(state, s) && s.week >= week - 6; })
      .sort(function (a, b) { return b.week - a.week || (a.id < b.id ? -1 : 1); });
    if (near.length) return near[0];
    var read = all.filter(function (s) { return seen(state, s); });
    var old = read.filter(function (s) { return s.week <= week - 3; }).sort(function (a, b) { return b.week - a.week || (a.id < b.id ? -1 : 1); });
    if (old.length) return old[0];
    // weeks 3-4: nothing that old yet; the oldest text before this week
    var early = all.sort(function (a, b) { return a.week - b.week || (a.id < b.id ? -1 : 1); });
    return early[0] || null;
  }
  // with the pieces of the week it is played in (more pieces later on)
  function orderable(s, week) {
    var O = root.Ordenar;
    return !!(O && O.build(passage(s, week || s.week).text, O.level ? O.level(week || s.week) : {}));
  }
  function clozeable(s) { return !!(root.CTest && root.CTest.build(passage(s, s.week).text, "cloze").gaps.length >= 4); }
  function modeFor(week) { return week >= CTEST_WEEK ? "ctest" : "cloze"; }
  var MODE = { ctest: "C-test", cloze: "Cloze" };

  /* ----------------------------------------------------------- misiones */

  function missions(w, state) {
    if (!w || w.boss) return [];
    var out = [], e = store(state), wk = e.wk[w.week] || {};
    if (root.Variaciones && root.Variaciones.FRAMES.some(function (fr) { return root.Variaciones.kindWeek(fr, { k: "per" }) <= w.week; })) {
      var n = root.Variaciones.eligible(state, w.week).length, vd = e.var[w.week];
      // only when there is something to vary (a phrase already practised
      // with a variation open by this week): before, the mission showed and
      // could not be played (pt, weeks 1-3)
      var loose = n || root.Variaciones.eligible(state, w.week, true).length;
      if (loose || vd) out.push({ kind: "esc-var", arg: String(w.week), done: !!vd, ico: "🔁", opt: true, title: "Variaciones de frase",
        sub: vd ? "Hecha · " + vd.pct + " %" : n ? "Opcional · " + n + " frases que ya sabés, reescritas cambiando una pieza por vez"
                                                 : "Opcional · " + loose + " frases que ya viste, reescritas cambiando una pieza por vez" });
    }
    // a result: done with its mark (50 % the C-test, 60 % «Ordená»), or a
    // second try with 40 %, or a third (Engine.passed, 3.1); a result saved
    // before 3.1 (no count of tries) stays done
    var E = root.Engine;
    var res = function (f, pass) {
      var pct = wk[f];
      if (pct == null) return { done: false, half: false, sub: "Opcional" };
      var rec = { pct: pct, tries: wk[f + "N"] || 1, v: wk[f + "N"] ? 31 : null };
      var ok = !wk[f + "N"] || !E || !E.passed || E.passed(rec, pass);
      return { done: ok, half: !ok, sub: ok ? "Hecho · " + pct + " %" : "Tu mejor: " + pct + " % · " + E.passMissing(rec, pass) };
    };
    // (el C-test / cloze ya no es misión: queda en Escritura guiada; en su
    // lugar la semana trae ejercicios de identificar formas y errores)
    if (w.week >= 3 && root.Ordenar) {
      var so = orderSource(state, w.week);
      var ro = res("ordenar", 60);
      if (so) out.push({ kind: "esc-ordenar", arg: so.id + "|" + w.week, done: ro.done, half: ro.half, ico: "🔀", opt: true,
        title: "Ordená el texto: «" + so.title + "»",
        sub: ro.sub + " · " + (seen(state, so) ? "un texto de la semana " + so.week + ", no el de esta" : "un texto nuevo para vos") + ": " +
          (so.kind === "escucha" ? "los turnos desordenados" : "las partes desordenadas") + "; los conectores son la pista" });
    }
    return out;
  }
  function handles(kind) { return !!MISSION_KINDS[kind]; }
  function go(kind, arg) {
    var a = String(arg || "").split("|");
    if (kind === "esc-var") {
      // nothing to vary yet: say what opens it, not «no questions»
      var V = root.Variaciones, st = H.state ? H.state() : null;
      if (V && st && !V.eligible(st, +a[0]).length && !V.eligible(st, +a[0], true).length) {
        H.toast("Primero practicá las frases de la semana (las escenas de Frases): después las reescribís acá.", 3500);
        return;
      }
      H.startRound("variaciones", "w:" + a[0]);
      return;
    }
    if (kind === "esc-huecos") open("ctest", a[0], { week: +a[1], mode: a[2] || modeFor(+a[1]), from: "briefing" });
    if (kind === "esc-ordenar") open("ordenar", a[0], { week: +a[1], from: "briefing" });
  }

  /* ------------------------------------------------- variaciones (ronda) */

  function variaciones(state, arg, course) {
    if (!root.Variaciones) return [];
    root.Variaciones.pastWeek(course);
    var m = /^w:(\d+)$/.exec(arg || ""), week = m ? +m[1] : Math.min(state.unlocked || 1, 52);
    return root.Variaciones.session(state, { week: week, focus: m ? week : null, n: 8 });
  }
  function roundDone(round, pct) {
    if (!round || round.kind !== "variaciones") return;
    var m = /^w:(\d+)$/.exec(round.arg || ""), firsts = (round.log || []).filter(function (x) { return !x.retry; }).length;
    // five answers, or all the round had (the first weeks have one or two
    // sentences to vary: with «five» the mission could never be done)
    var asked = (round.items || []).filter(function (x) { return !x.retry; }).length;
    if (!m || !firsts || firsts < Math.min(5, asked)) return;
    var e = store(), prev = e.var[m[1]];
    e.var[m[1]] = { pct: Math.max(pct, prev ? prev.pct : 0), at: Date.now() };
  }

  /* ------------------------------------------------------------- pausa */

  function words(s) { return String(s).split(/\s+/).filter(Boolean).length; }
  function clozeItem(src) {
    var D0 = D(), set = {}, equiv = {};
    (D0.conn || []).concat(D0.prep || []).forEach(function (w) { set[w] = 1; });
    (D0.equiv || []).forEach(function (g) { g.forEach(function (w) { equiv[w] = g; }); });
    var ss = root.CTest.sentences(src.text).filter(function (s) { var n = words(s); return n >= 5 && n <= 22; });
    var cand = [];
    ss.forEach(function (s, si) {
      var toks = s.split(/\s+/);
      toks.forEach(function (t, k) {
        if (k === 0) return;
        var w = t.replace(/^[^A-Za-zÀ-ÿ]+|[^A-Za-zÀ-ÿ]+$/g, "");
        if (w && set[w.toLowerCase()] && w === w.toLowerCase()) cand.push({ s: s, si: si, k: k, w: w });
      });
    });
    if (!cand.length) return null;
    var c = cand[Math.floor(Math.random() * cand.length)];
    var toks = c.s.split(/\s+/);
    toks[c.k] = toks[c.k].replace(c.w, "___");
    return { id: "esc:cloze:" + src.id + ":" + c.si + ":" + c.k, src: "escritos", type: "cloze", nocard: true,
      prompt: "Completá el conector o la preposición que falta (de «" + src.title + "», que ya leíste)",
      stem: toks.join(" "), answer: c.w, accept: [c.w].concat((equiv[c.w] || []).filter(function (x) { return x !== c.w; })),
      note: "En el texto: «" + c.s + "»." };
  }
  function tilesItem(src) {
    var ss = root.CTest.sentences(src.text).filter(function (s) { var n = words(s); return n >= 3 && n <= 14; });
    // three consecutive sentences, at least one with a clue
    var all = root.CTest.sentences(src.text), best = null;
    for (var i = 0; i + 3 <= all.length; i++) {
      var tri = all.slice(i, i + 3);
      if (!tri.every(function (s) { return ss.indexOf(s) >= 0; })) continue;
      var clue = root.Ordenar ? tri.slice(1).filter(function (s) { return root.Ordenar.clues(s).length; }).length : 1;
      if (clue && (!best || Math.random() < 0.5)) best = tri;
    }
    if (!best) return null;
    var sh = best.slice();
    for (var t = 0; t < 6 && sh.join() === best.join(); t++) sh = root.Ordenar ? root.Ordenar.shuffle(best) : sh.reverse();
    if (sh.join() === best.join()) sh = [best[1], best[0], best[2]];
    return { id: "esc:ord:" + src.id + ":" + all.indexOf(best[0]), src: "escritos", type: "tiles", nocard: true,
      prompt: "Ordená estas tres oraciones de «" + src.title + "»: mirá los conectores",
      stem: "", tiles: sh, answer: best.join(" "), accept: [best.join(" ")] };
  }
  /* One item for the coffee break, half of the times (little weight). */
  function pausaItem(state, week, rnd) {
    rnd = rnd || Math.random;
    if (!week || week < 2 || rnd() < 0.5) return null;
    var kinds = [];
    if (root.Variaciones && root.Variaciones.eligible(state, week).length) kinds.push("var");
    var srcs = sources(state, week);
    if (srcs.length && root.CTest) kinds.push("cloze", "ord");
    if (!kinds.length) return null;
    var k = kinds[Math.floor(rnd() * kinds.length)];
    try {
      if (k === "var") return root.Variaciones.one(state, week);
      var src = srcs[Math.floor(rnd() * Math.min(srcs.length, 4))];
      return k === "cloze" ? clozeItem(src) : tilesItem(src);
    } catch (e) { return null; }
  }

  /* ------------------------------------------------------------- Treino */

  function treinoHtml(state) {
    var nv = root.Variaciones ? root.Variaciones.eligible(state, Math.min(state.unlocked || 1, 52)).length : 0;
    var ns = sources(state).length;
    var lab = function (id, e, name, desc, meta, off) {
      return '<button class="lab" data-esc="' + id + '"' + (off ? " disabled" : "") + '><span class="e">' + e + "</span><b>" + name + "</b>" +
        '<span class="muted">' + desc + "</span>" + (meta ? '<span class="meta">' + meta + "</span>" : "") + "</button>";
    };
    return "<h2>✍️ Escritura guiada</h2>" +
      '<p class="muted">Todo por escrito y con lo que ya viste: frases que ya sabés y textos que ya leíste.</p>' +
      '<div class="labs">' +
        lab("var", "🔁", "Variaciones de frase", nv ? "Una frase que ya sabés, cambiando una pieza por vez: persona, negativa, cosa, pasado, plural."
          : "Se abre cuando aprendas las primeras frases de una escena.", nv ? nv + " frases listas" : "", !nv) +
        lab("huecos", "🧩", "C-test y cloze", ns ? "Un texto que ya leíste, con huecos: la mitad de cada segunda palabra (C-test) o sus conectores y preposiciones (cloze)."
          : "Se abre cuando leas tu primer texto.", ns ? ns + (ns === 1 ? " texto" : " textos") : "", !ns) +
        lab("ordenar", "🔀", "Ordená el texto", ns ? "Las partes de un texto que ya viste, desordenadas: los conectores te dicen qué va después."
          : "Se abre cuando leas tu primer texto.", "", !ns) +
      "</div>" +
      '<p class="muted science">🔬 Cambiar una pieza de un bloque que ya sabés (N. Ellis 2002); C-test (Klein-Braley 1985); ' +
      "cloze racional (Bachman 1985); cohesión y conectores (Halliday y Hasan 1976), como en Celpe-Bras y CELI.</p>";
  }

  /* ----------------------------------------------------------- pantallas */

  function open(kind, srcId, opts) {
    opts = opts || {};
    var src = srcId ? byId(srcId) : null;
    cur = { kind: kind, src: src, week: opts.week || null, from: opts.from || "frasi", mode: opts.mode || null, pickFor: opts.pickFor || null,
            part: opts.part || 0 };
    // the week sets the difficulty: the mission's, else the learner's
    var lv = cur.week || Math.min((H && H.state().unlocked) || 1, 52);
    if (src) { cur.pas = passage(src, lv, cur.part); cur.text = cur.pas.text; }
    if (kind === "ctest") {
      cur.mode = cur.mode || "ctest";
      cur.built = root.CTest.build(cur.text, cur.mode, root.CTest.level ? root.CTest.level(lv)[cur.mode] : null);
      cur.vals = cur.built.gaps.map(function () { return ""; });
      cur.pass = 0;            // 0 writing, 1 second pass on the wrong ones, 2 done
      cur.first = null;
    } else if (kind === "ordenar") {
      cur.built = root.Ordenar.build(cur.text, Object.assign({ unit: src.kind === "escucha" ? "intervenciones" : null },
        root.Ordenar.level ? root.Ordenar.level(lv) : {}));
      if (!cur.built) { H.toast("Este texto es muy corto para ordenarlo."); return; }
      cur.pool = cur.built.shuffled.slice();
      cur.order = [];
      cur.pass = 0;
    }
    H.show("escritos");
  }

  function back() {
    var from = cur && cur.from;
    if (from === "briefing") { cur = null; H.toWeek(); return; }
    if (cur && cur.kind !== "pick" && cur.pickFor) { open("pick", null, { pickFor: cur.pickFor }); return; }
    cur = null;
    H.go("frasi");
  }

  function head(sup, main) {
    return '<button class="btn ghost" id="escback">← ' + (cur.from === "briefing" ? "a la semana" : "volver") + "</button>" + H.plate(sup, esc(main));
  }

  function renderPick(state) {
    var list = sources(state), e = store(state), what = cur.pickFor;
    var html = head(what === "ordenar" ? "Ordená el texto" : "C-test y cloze", "Textos que ya leíste") +
      '<p class="lead">' + (what === "ordenar"
        ? "Elegí un texto: sus partes vienen desordenadas y las volvés a armar. Los conectores y las palabras que remiten a algo ya dicho están marcados: son la pista."
        : "Elegí un texto y un modo. <b>C-test</b>: a cada segunda palabra le falta la segunda mitad. <b>Cloze</b>: faltan los conectores y las preposiciones. " +
          "La primera oración queda entera para que entres en el texto.") + "</p>";
    if (!list.length) return html + '<div class="card"><p>Todavía no leíste ningún texto. Empezá por la lectura de la semana.</p></div>';
    html += '<div class="missions">';
    list.forEach(function (s) {
      if (what === "ordenar") {
        if (!orderable(s)) return;
        var od = e.ordenar[s.id];
        html += '<button class="mission" data-escopen="ordenar|' + esc(s.id) + '"><span class="mi">' + s.emoji + "</span><span><b>" + esc(s.title) + "</b>" +
          "<small>" + KIND[s.kind] + " · semana " + s.week + (od ? " · tu mejor: " + od.pct + " %" : "") + "</small></span>" +
          '<span class="go">›</span></button>';
      } else {
        var c1 = e.huecos[s.id + ":ctest"], c2 = e.huecos[s.id + ":cloze"];
        html += '<div class="mission esc-pick"><span class="mi">' + s.emoji + "</span><span><b>" + esc(s.title) + "</b>" +
          "<small>" + KIND[s.kind] + " · semana " + s.week + "</small>" +
          '<span class="row">' +
            '<button class="tab" data-escopen="ctest|' + esc(s.id) + '|ctest">C-test' + (c1 ? " · " + c1.pct + " %" : "") + "</button>" +
            (clozeable(s) ? '<button class="tab" data-escopen="ctest|' + esc(s.id) + '|cloze">Cloze' + (c2 ? " · " + c2.pct + " %" : "") + "</button>" : "") +
          "</span></span></div>";
      }
    });
    return html + "</div>";
  }

  function pasLabel() { return cur.pas && cur.pas.of > 1 ? " · pasaje " + (cur.pas.i + 1) + " de " + cur.pas.of : ""; }

  function gapHtml(g, k) {
    var st = cur.status ? cur.status[k] : null;
    var locked = cur.pass === 2 || (cur.pass === 1 && st === "giusto") || (cur.pass === 1 && st === "quasi");
    var w = Math.max(2, g.answer.length + (cur.mode === "cloze" ? 1 : 0));
    var cls = st === "giusto" ? "dgok" : st === "quasi" ? "esc-close" : st ? "dgmiss" : "";
    var input = '<input class="esc-in" data-g="' + k + '" value="' + esc(cur.vals[k] || "") + '" style="width:' + (w + 1.2) + 'ch"' +
      ' autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="next" aria-label="hueco ' + (k + 1) + '"' +
      (locked ? " disabled" : "") + ">";
    var sol = cur.pass === 2 && st !== "giusto" ? '<small class="esc-sol">' + esc(g.shown + g.answer) + "</small>" : "";
    var tag = cur.mode === "cloze" && cur.pass < 2 ? '<small class="esc-tag">' + (g.cat === "conector" ? "con." : "prep.") + "</small>" : "";
    return '<mark class="esc-gap ' + cls + '">' + esc(g.shown) + input + tag + sol + "</mark>";
  }

  function renderCtest() {
    var b = cur.built, s = cur.src, isC = cur.mode === "ctest";
    var html = head(MODE[cur.mode] + (cur.week ? " · semana " + cur.week : "") + pasLabel(), s.title);
    if (cur.pass === 0) html += '<p class="lead">' + (isC
      ? "Es el texto que ya leíste. Desde la segunda oración, a <b>cada segunda palabra le falta la segunda mitad</b>: escribí solo lo que falta (<i>ca</i>__ → <i>sa</i>). Fijate en la terminación: género, número, persona."
      : "Es el texto que ya leíste, sin sus <b>conectores</b> (con.) ni sus <b>preposiciones</b> (prep.): escribí la palabra entera. Muchas preposiciones van con el artículo pegado.") + "</p>";
    html += '<div class="card"><p class="esc-text it">' + b.parts.map(function (p) {
      return p.gap != null ? gapHtml(b.gaps[p.gap], p.gap) : esc(p.t).replace(/\n+/g, "<br><br>");
    }).join("") + "</p>";
    if (cur.pass < 2) {
      html += '<div class="accents">' + (UI().keys || []).map(function (c) { return '<button data-escins="' + esc(c) + '">' + esc(c) + "</button>"; }).join("") + "</div>" +
        '<div class="row" style="margin-top:12px"><button class="btn" id="esccheck">' + (cur.pass === 1 ? "Corregir de nuevo" : (UI().check || "Corregir")) + "</button>" +
        (cur.pass === 1 ? '<button class="btn ghost" id="escshow">Ver las respuestas</button>' : "") + "</div>";
      if (cur.pass === 1) html += '<p class="note">🔁 En verde lo que va, en amarillo casi (falta o sobra una tilde), en rojo lo que no: <b>corregí lo rojo</b> y volvé a controlar.</p>';
    } else html += resultHtml();
    return html + "</div>";
  }

  function resultHtml() {
    var r = cur.first, fin = cur.final, b = cur.built;
    var fixed = fin.per.filter(function (v, i) { return v === "giusto" && r.per[i] !== "giusto"; }).length;
    var html = '<div class="scorebig"><b>' + r.right + " / " + r.n + "</b><span>" + (cur.mode === "ctest" ? "palabras" : "huecos") + " a la primera</span>" +
      (fixed ? "<span>+" + fixed + " corregidos por vos</span>" : "") + (cur.xp ? "<span>+" + cur.xp + " xp</span>" : "") + "</div>";
    if (cur.mode === "cloze") {
      var bad = { conector: 0, "preposición": 0 };
      r.per.forEach(function (v, i) { if (v !== "giusto") bad[b.gaps[i].cat]++; });
      if (bad.conector || bad["preposición"]) html += '<p class="note">Te costaron más ' + (bad["preposición"] >= bad.conector
        ? "las <b>preposiciones</b>: mirá qué verbo o qué sustantivo las pide y si llevan el artículo pegado."
        : "los <b>conectores</b>: preguntate qué relación hay entre las dos partes (suma, contraste, causa, consecuencia, tiempo).") + "</p>";
    } else if (r.n - r.right > 0) html += '<p class="note">Lo que quedó sin completar está debajo de cada hueco. En el C-test cuenta la palabra exacta: la terminación dice género, número, persona y tiempo.</p>';
    return html + '<div class="row" style="margin-top:14px"><button class="btn" id="escdone">← ' + (cur.from === "briefing" ? "Seguir con la semana" : "Volver") + "</button>" +
      '<button class="btn ghost" id="escagain">' + (cur.pas && cur.pas.of > 1 ? "Otro pasaje" : "Otra vez") + "</button></div>";
  }

  function clueHtml(unit) {
    var cs = root.Ordenar.clues(unit), out = "", pos = 0;
    cs.forEach(function (c) {
      out += esc(unit.slice(pos, c.at)) + '<mark class="esc-clue' + (c.kind === "referencia" ? " ref" : "") + '" title="' + esc(c.hint) + '">' + esc(unit.slice(c.at, c.end)) + "</mark>";
      pos = c.end;
    });
    return out + esc(unit.slice(pos));
  }

  function renderOrdenar() {
    var b = cur.built, s = cur.src, units = b.units, done = cur.pass === 2;
    var html = head("Ordená el texto" + (cur.week ? " · semana " + cur.week : "") + pasLabel(), s.title);
    if (cur.pass === 0) html += '<p class="lead">Las ' + b.unit + " de este texto están desordenadas. La primera ya está en su lugar. " +
      "Tocá las demás en el orden en que van. Las palabras marcadas son la pista: <mark class=\"esc-clue\">conectores y tiempo</mark> " +
      "(después, pero, a la noche…) y <mark class=\"esc-clue ref\">lo que remite a algo ya dicho</mark> (él, ella, eso).</p>";
    var status = cur.grade ? cur.grade.inPlace : null;
    html += '<div class="card"><div class="options esc-order">' +
      '<div class="opt esc-piece anchor">' + clueHtml(units[0]) + "</div>" +
      cur.order.map(function (u, i) {
        var cls = status ? (status[i] ? " right" : " wrong") : "";
        return '<button class="opt esc-piece' + cls + '" data-escback="' + i + '"' + (done ? " disabled" : "") + ">" + clueHtml(units[u]) + "</button>";
      }).join("") + "</div>";
    if (cur.pool.length) {
      html += '<p class="muted small" style="margin-top:14px">Tocá la que sigue:</p><div class="esc-pool">' + cur.pool.map(function (u) {
        return '<button class="tile esc-piece" data-escput="' + u + '">' + clueHtml(units[u]) + "</button>";
      }).join("") + "</div>";
    }
    var hints = {};
    units.forEach(function (u) { root.Ordenar.clues(u).forEach(function (c) { if (c.kind === "conector") hints[c.word.toLowerCase()] = c.hint; }); });
    var hk = Object.keys(hints);
    if (hk.length && !done) html += '<details class="esc-hints"><summary>💡 ¿Qué dice cada pista?</summary><ul>' +
      hk.map(function (k) { return "<li><b>" + esc(k) + "</b>: " + esc(hints[k]) + "</li>"; }).join("") + "</ul></details>";
    if (!done) {
      html += '<div class="row" style="margin-top:12px"><button class="btn" id="escord"' + (cur.pool.length ? " disabled" : "") + ">" + (UI().check || "Controlar") + "</button>" +
        (cur.order.length ? '<button class="btn ghost" id="escclear">Empezar de nuevo</button>' : "") + "</div>";
      if (cur.pass === 1) html += '<p class="note">🔁 En verde las que están en su lugar. Tocá las rojas para sacarlas y probá otra vez.</p>';
    } else {
      var g = cur.firstGrade;
      html += '<div class="scorebig"><b>' + g.pairs + " / " + g.of + "</b><span>uniones bien a la primera</span>" + (cur.xp ? "<span>+" + cur.xp + " xp</span>" : "") + "</div>" +
        (cur.grade.ok ? "" : '<h3>El orden del texto</h3><ol class="esc-model">' + units.map(function (u) { return "<li>" + clueHtml(u) + "</li>"; }).join("") + "</ol>") +
        '<div class="row" style="margin-top:14px"><button class="btn" id="escdone">← ' + (cur.from === "briefing" ? "Seguir con la semana" : "Volver") + "</button>" +
        '<button class="btn ghost" id="escagain">' + (cur.pas && cur.pas.of > 1 ? "Otro pasaje" : "Otra vez") + "</button></div>";
    }
    return html + "</div>";
  }

  function render() {
    if (!cur || !H) return "";
    var state = H.state();
    if (cur.kind === "pick") return renderPick(state);
    if (cur.kind === "ctest") return renderCtest();
    if (cur.kind === "ordenar") return renderOrdenar();
    return "";
  }

  /* --------------------------------------------------------- resultados */

  function saveResult(kind, pct) {
    var e = store(), key = kind === "ctest" ? cur.src.id + ":" + cur.mode : cur.src.id;
    var bag = kind === "ctest" ? e.huecos : e.ordenar, prev = bag[key];
    bag[key] = { pct: Math.max(pct, prev ? prev.pct : 0), at: Date.now() };
    if (cur.week) {
      var wk = e.wk[cur.week] || (e.wk[cur.week] = {}), f = kind === "ctest" ? "huecos" : "ordenar";
      var firstTime = wk[f] == null;
      wk[f] = Math.max(pct, wk[f] || 0);
      wk[f + "N"] = (wk[f + "N"] || (firstTime ? 0 : 1)) + 1;
      var E = root.Engine, need = kind === "ctest" ? 50 : 60;
      var ok = !E || !E.passed || E.passed({ pct: wk[f], tries: wk[f + "N"], v: 31 }, need);
      if (ok && !wk[f + "Done"]) { wk[f + "Done"] = 1; H.toast("★ Misión completada", 2200); }
      else if (!ok) H.toast(E.passMissing({ pct: wk[f], tries: wk[f + "N"], v: 31 }, need), 3000);
    }
  }
  function award(n) {
    cur.xp = n;
    var st = H.state();
    if (root.Engine && root.Engine.addStrand) root.Engine.addStrand(st, "output", n);
    H.gain(n);
    H.persist();
  }

  function checkCtest() {
    readVals();
    var sc = root.CTest.score(cur.built.gaps, cur.vals);
    cur.status = sc.per;
    if (cur.pass === 0) {
      cur.first = sc;
      if (sc.right + sc.close === sc.n) { cur.final = sc; finishCtest(); return; }
      cur.pass = 1;
      if (H.fx) (sc.pct >= 70 ? H.fx.right : H.fx.close)();
    } else { cur.final = sc; finishCtest(); return; }
    H.render();
  }
  function finishCtest() {
    cur.pass = 2;
    var fixed = cur.final.per.filter(function (v, i) { return v === "giusto" && cur.first.per[i] !== "giusto"; }).length;
    // the gaps missed at the first try come back tomorrow in the review (reglas.js)
    if (root.Reglas && cur.first) root.Reglas.fromCtest(H.state(), cur.built, cur.first);
    award(cur.first.right * 2 + cur.first.close + fixed);
    saveResult("ctest", cur.first.pct);
    if (H.fx) H.fx.goal();
    H.render();
  }
  function readVals() {
    document.querySelectorAll(".esc-in").forEach(function (i) { cur.vals[+i.dataset.g] = i.value; });
  }

  function checkOrdenar() {
    var g = root.Ordenar.grade(cur.built.units, cur.order);
    cur.grade = g;
    if (cur.pass === 0) cur.firstGrade = g;
    if (g.ok || cur.pass === 1) {
      cur.pass = 2;
      award(cur.firstGrade.pairs * 3 + (g.ok && cur.firstGrade !== g ? 2 : 0));
      saveResult("ordenar", cur.firstGrade.pct);
      if (H.fx) (g.ok ? H.fx.goal : H.fx.close)();
    } else {
      cur.pass = 1;
      if (H.fx) H.fx.close();
    }
    H.render();
  }

  /* --------------------------------------------------------------- wire */

  function $(s) { return document.querySelector(s); }
  function on(s, fn) { var b = $(s); if (b) b.onclick = fn; }

  function wire(screen) {
    document.querySelectorAll("[data-esc]").forEach(function (b) {
      b.onclick = function () {
        var k = b.dataset.esc;
        if (k === "var") H.startRound("variaciones");
        else open("pick", null, { pickFor: k });
      };
    });
    if (screen !== "escritos" || !cur) return;
    on("#escback", back);
    on("#escdone", back);
    on("#escagain", function () { open(cur.kind, cur.src.id, { week: cur.week, from: cur.from, mode: cur.mode, pickFor: cur.pickFor, part: (cur.part || 0) + 1 }); });
    document.querySelectorAll("[data-escopen]").forEach(function (b) {
      b.onclick = function () {
        var a = b.dataset.escopen.split("|");
        open(a[0], a[1], { mode: a[2], pickFor: cur.pickFor, from: "frasi" });
      };
    });
    // C-test / cloze
    var ins = document.querySelectorAll(".esc-in"), last = null;
    ins.forEach(function (i, k) {
      i.addEventListener("focus", function () { last = i; });
      i.addEventListener("input", function () { cur.vals[+i.dataset.g] = i.value; });
      i.addEventListener("keydown", function (ev) {
        if (ev.key !== "Enter") return;
        ev.preventDefault();
        for (var j = k + 1; j < ins.length; j++) if (!ins[j].disabled) { ins[j].focus(); return; }
        var c = $("#esccheck"); if (c) c.focus();
      });
    });
    document.querySelectorAll("[data-escins]").forEach(function (b) {
      b.onmousedown = function (ev) { ev.preventDefault(); };   // keep the focus in the gap
      b.onclick = function () {
        var i = last || document.querySelector(".esc-in:not(:disabled)");
        if (!i || i.disabled) return;
        var s = i.selectionStart == null ? i.value.length : i.selectionStart, e = i.selectionEnd == null ? s : i.selectionEnd;
        i.value = i.value.slice(0, s) + b.dataset.escins + i.value.slice(e);
        i.selectionStart = i.selectionEnd = s + b.dataset.escins.length;
        cur.vals[+i.dataset.g] = i.value;
        i.focus();
      };
    });
    on("#esccheck", checkCtest);
    on("#escshow", function () { readVals(); cur.final = root.CTest.score(cur.built.gaps, cur.vals); cur.status = cur.final.per; finishCtest(); });
    if (cur.kind === "ctest" && cur.pass < 2) {
      var firstOpen = document.querySelector(".esc-in:not(:disabled)");
      if (firstOpen && cur.pass === 1) {
        var bad = document.querySelector(".dgmiss .esc-in:not(:disabled)");
        if (bad) bad.focus();
      }
    }
    // ordenar
    document.querySelectorAll("[data-escput]").forEach(function (b) {
      b.onclick = function () {
        var u = +b.dataset.escput;
        cur.pool = cur.pool.filter(function (x) { return x !== u; });
        cur.order.push(u);
        cur.grade = null;
        if (H.fx) H.fx.tap();
        H.render();
      };
    });
    document.querySelectorAll("[data-escback]").forEach(function (b) {
      b.onclick = function () {
        var i = +b.dataset.escback, u = cur.order[i];
        // taking one out keeps the ones before it in place
        cur.order.splice(i, 1);
        cur.pool.push(u);
        cur.grade = null;
        H.render();
      };
    });
    on("#escclear", function () { cur.pool = cur.pool.concat(cur.order); cur.order = []; cur.grade = null; H.render(); });
    on("#escord", checkOrdenar);
  }

  function attach(host) { H = host; }

  var api = { attach: attach, missions: missions, handles: handles, go: go, open: open, render: render, wire: wire,
              variaciones: variaciones, roundDone: roundDone, pausaItem: pausaItem, treinoHtml: treinoHtml,
              sources: sources, allSources: allSources, passages: passages, passage: passage, passageWords: passageWords,
              clozeItem: clozeItem, tilesItem: tilesItem, byId: byId, orderSource: orderSource, current: function () { return cur; } };
  if (typeof module === "object" && module.exports) module.exports = api;
  root.Escritos = api;
})(typeof window !== "undefined" ? window : globalThis);
