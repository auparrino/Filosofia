/*
 * Escritura guiada: «Ordená el texto» (ordenar.js) con la app (misiones
 * opcionales de la semana, Treino / Allena, la pausa): las partes de un
 * texto ya visto, desordenadas, con los conectores marcados como pista.
 * Un texto largo se trabaja por pasajes (passage), y el largo del pasaje y
 * la cantidad de piezas crecen con la semana (Ordenar.level).
 *
 * Los textos venían de las lecturas, el dictogloss y las escuchas de La Via
 * (se sacaron en el paso 11 del plan): hasta que el curso le dé textos
 * (allSources), no aparece.
 *
 * Nada oral: todo se lee y se escribe.  app.js le pasa un «host» con lo
 * que necesita (estado, guardar, xp, navegar) en attach(); las pantallas se
 * dibujan con render() / wire() cuando view.screen === "escritos".
 *
 * Lo que guarda, en state.escritos: ordenar {fuente: {pct, at}}, wk
 * {semana: {ordenar}} (las misiones de la semana).
 */
(function (root) {
  "use strict";

  var H = null;            // the host (app.js)
  var cur = null;          // the open exercise
  var MISSION_KINDS = { "esc-ordenar": 1 };

  function UI() { return (root.LANG && root.LANG.ui) || {}; }
  function esc(s) { return H ? H.esc(s) : String(s); }

  function store(state) {
    var s = state || (H && H.state());
    if (!s.escritos) s.escritos = {};
    var e = s.escritos;
    ["ordenar", "wk"].forEach(function (k) { if (!e[k]) e[k] = {}; });
    return e;
  }

  /* ------------------------------------------------------------ fuentes */

  // The texts: { id, title, text, week, emoji, kind, seen(state) }.  The
  // course has none yet.
  function allSources() { return []; }
  function seen(state, src) { return !!(src && src.seen && src.seen(state)); }
  var KIND = { lectura: "Lectura" };

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
  /* Only what was already read: the text is known, so the order tests the
     connectors, not the plot. */
  function sources(state, maxWeek) {
    return allSources().filter(function (s) { return seen(state, s) && (!maxWeek || s.week <= maxWeek); })
      .sort(function (a, b) { return b.week - a.week || (a.kind === "lectura" ? -1 : 1); });
  }
  function byId(id) {
    return allSources().filter(function (s) { return s.id === id; })[0] || null;
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
  /* ----------------------------------------------------------- misiones */

  function missions(w, state) {
    if (!w || w.boss) return [];
    var out = [], e = store(state), wk = e.wk[w.week] || {};
    // a result: done with its mark (60 % «Ordená»), or a
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
    if (kind === "esc-ordenar") open("ordenar", a[0], { week: +a[1], from: "briefing" });
  }

  /* ------------------------------------------------------------- pausa */

  function words(s) { return String(s).split(/\s+/).filter(Boolean).length; }
  function tilesItem(src) {
    var O = root.Ordenar;
    if (!O) return null;
    var all = O.sentences(src.text), best = null;
    var ss = all.filter(function (s) { var n = words(s); return n >= 3 && n <= 14; });
    // three consecutive sentences, at least one with a clue
    for (var i = 0; i + 3 <= all.length; i++) {
      var tri = all.slice(i, i + 3);
      if (!tri.every(function (s) { return ss.indexOf(s) >= 0; })) continue;
      var clue = tri.slice(1).filter(function (s) { return O.clues(s).length; }).length;
      if (clue && (!best || Math.random() < 0.5)) best = tri;
    }
    if (!best) return null;
    var sh = best.slice();
    for (var t = 0; t < 6 && sh.join() === best.join(); t++) sh = O.shuffle(best);
    if (sh.join() === best.join()) sh = [best[1], best[0], best[2]];
    return { id: "esc:ord:" + src.id + ":" + all.indexOf(best[0]), src: "escritos", type: "tiles", nocard: true,
      prompt: "Ordená estas tres oraciones de «" + src.title + "»: mirá los conectores",
      stem: "", tiles: sh, answer: best.join(" "), accept: [best.join(" ")] };
  }
  /* One item for the coffee break, half of the times (little weight). */
  function pausaItem(state, week, rnd) {
    rnd = rnd || Math.random;
    if (!week || week < 2 || rnd() < 0.5) return null;
    var srcs = sources(state, week);
    if (!srcs.length) return null;
    try { return tilesItem(srcs[Math.floor(rnd() * Math.min(srcs.length, 4))]); } catch (e) { return null; }
  }

  /* ------------------------------------------------------------- Treino */

  function treinoHtml(state) {
    var ns = sources(state).length;
    var lab = function (id, e, name, desc, meta, off) {
      return '<button class="lab" data-esc="' + id + '"' + (off ? " disabled" : "") + '><span class="e">' + e + "</span><b>" + name + "</b>" +
        '<span class="muted">' + desc + "</span>" + (meta ? '<span class="meta">' + meta + "</span>" : "") + "</button>";
    };
    return "<h2>✍️ Escritura guiada</h2>" +
      '<p class="muted">Todo por escrito y con lo que ya viste.</p>' +
      '<div class="labs">' +
        lab("ordenar", "🔀", "Ordená el texto", ns ? "Las partes de un texto que ya viste, desordenadas: los conectores te dicen qué va después."
          : "Se abre cuando leas tu primer texto.", "", !ns) +
      "</div>" +
      '<p class="muted science">🔬 Cohesión y conectores (Halliday y Hasan 1976).</p>';
  }

  /* ----------------------------------------------------------- pantallas */

  function open(kind, srcId, opts) {
    opts = opts || {};
    var src = srcId ? byId(srcId) : null;
    cur = { kind: kind, src: src, week: opts.week || null, from: opts.from || "frasi", pickFor: opts.pickFor || null,
            part: opts.part || 0 };
    // the week sets the difficulty: the mission's, else the learner's
    var lv = cur.week || Math.min((H && H.state().unlocked) || 1, root.Engine.weeks());
    if (src) { cur.pas = passage(src, lv, cur.part); cur.text = cur.pas.text; }
    if (kind === "ordenar") {
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
    var list = sources(state), e = store(state);
    var html = head("Ordená el texto", "Textos que ya leíste") +
      '<p class="lead">Elegí un texto: sus partes vienen desordenadas y las volvés a armar. Los conectores y las palabras que remiten a algo ya dicho están marcados: son la pista.</p>';
    if (!list.length) return html + '<div class="card"><p>Todavía no hay textos para ordenar.</p></div>';
    html += '<div class="missions">';
    list.forEach(function (s) {
      if (!orderable(s)) return;
      var od = e.ordenar[s.id];
      html += '<button class="mission" data-escopen="ordenar|' + esc(s.id) + '"><span class="mi">' + s.emoji + "</span><span><b>" + esc(s.title) + "</b>" +
        "<small>" + (KIND[s.kind] || "") + " · semana " + s.week + (od ? " · tu mejor: " + od.pct + " %" : "") + "</small></span>" +
        '<span class="go">›</span></button>';
    });
    return html + "</div>";
  }

  function pasLabel() { return cur.pas && cur.pas.of > 1 ? " · pasaje " + (cur.pas.i + 1) + " de " + cur.pas.of : ""; }

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
    if (cur.kind === "ordenar") return renderOrdenar();
    return "";
  }

  /* --------------------------------------------------------- resultados */

  function saveResult(pct) {
    var e = store(), key = cur.src.id;
    var bag = e.ordenar, prev = bag[key];
    bag[key] = { pct: Math.max(pct, prev ? prev.pct : 0), at: Date.now() };
    if (cur.week) {
      var wk = e.wk[cur.week] || (e.wk[cur.week] = {}), f = "ordenar";
      var firstTime = wk[f] == null;
      wk[f] = Math.max(pct, wk[f] || 0);
      wk[f + "N"] = (wk[f + "N"] || (firstTime ? 0 : 1)) + 1;
      var E = root.Engine, need = 60;
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

  function checkOrdenar() {
    var g = root.Ordenar.grade(cur.built.units, cur.order);
    cur.grade = g;
    if (cur.pass === 0) cur.firstGrade = g;
    if (g.ok || cur.pass === 1) {
      cur.pass = 2;
      award(cur.firstGrade.pairs * 3 + (g.ok && cur.firstGrade !== g ? 2 : 0));
      saveResult(cur.firstGrade.pct);
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
      b.onclick = function () { open("pick", null, { pickFor: b.dataset.esc }); };
    });
    if (screen !== "escritos" || !cur) return;
    on("#escback", back);
    on("#escdone", back);
    on("#escagain", function () { open(cur.kind, cur.src.id, { week: cur.week, from: cur.from, pickFor: cur.pickFor, part: (cur.part || 0) + 1 }); });
    document.querySelectorAll("[data-escopen]").forEach(function (b) {
      b.onclick = function () {
        var a = b.dataset.escopen.split("|");
        open(a[0], a[1], { pickFor: cur.pickFor, from: "frasi" });
      };
    });
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
              pausaItem: pausaItem, treinoHtml: treinoHtml,
              sources: sources, allSources: allSources, passages: passages, passage: passage, passageWords: passageWords,
              tilesItem: tilesItem, byId: byId, orderSource: orderSource, current: function () { return cur; } };
  if (typeof module === "object" && module.exports) module.exports = api;
  root.Escritos = api;
})(typeof window !== "undefined" ? window : globalThis);
