/*
 * Tu progreso: lo que un alumno entiende, en el tiempo.
 *
 *   · el nivel estimado y la fecha de cada jefe al ritmo actual (y la de
 *     llegada a C1);
 *   · las palabras que sabés por banda de frecuencia, como serie: un punto
 *     por semana en state.history (pocos números por punto);
 *   · las horas de estudio por semana y por destreza (input, output, forma,
 *     fluidez), medidas mientras la app está abierta y se usa;
 *   · lo que más te cuesta (state.errs), con su tendencia.
 *
 * También la meta en minutos (state.ritmo: minutos por día y días por
 * semana, y una meta con fecha opcional: «llegar a la semana N para el día
 * D»), los minutos de input de la semana contra la meta del nivel, y la cuota
 * de palabras de la semana recalibrada con lo que el curso enseña de verdad.
 *
 * Las funciones de cálculo no tocan el DOM (tools/lib/test_progreso.js).  La
 * pantalla («progreso») y el reloj de estudio se enganchan con app.js por
 * Progreso.attach(host), como tramo.js o referencia.js.
 *
 * Guarda: state.tiempo {"aaaa-m-d": [input, output, forma, fluidez] en
 * segundos, 120 días}, state.history [{w, u, n, b, m, i, e}] (un punto por
 * semana), state.ritmo {min, days, week, date}.
 */
(function (root) {
  "use strict";

  var DAY = 864e5;
  var STRANDS = ["input", "output", "forma", "fluidez"];
  var BANDS = ["A1", "A2", "B1", "B2", "C1"];
  var BOSSES = [[13, "A2"], [26, "B1"], [39, "B2"], [52, "C1"]];
  // Minutes a course week takes, by season (the simulation of the year:
  // medians 137, 146, 145, 154; about 21 minutes a day).
  var WEEK_MIN = [137, 146, 145, 154];
  var MINUTES = [10, 15, 20, 30, 45];
  var GOAL_XP = { 10: 100, 15: 200, 20: 200, 30: 350, 45: 500 };

  /* ------------------------------------------------------------ fechas */

  function dayKey(d) { d = d || new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); }
  function parseKey(k) { var p = String(k).split("-"); return new Date(+p[0], +p[1] - 1, +p[2], 12); }
  function daysBetween(a, b) {
    var p = function (k) { var x = String(k).split("-"); return Date.UTC(+x[0], +x[1] - 1, +x[2]); };
    return Math.round((p(b) - p(a)) / DAY);
  }
  function weekStart(d) {
    var x = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12);
    x.setDate(x.getDate() - (x.getDay() + 6) % 7);
    return x;
  }
  function weekKey(d) { return dayKey(weekStart(d || new Date())); }
  function addDays(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + Math.round(n), 12); }

  /* ------------------------------------------------------------ la meta */

  // Minutes a day and days a week.  Old saves: from the xp goal.
  function ritmo(state) {
    var r = state && state.ritmo && typeof state.ritmo === "object" ? state.ritmo : {};
    var byGoal = { 100: 10, 200: 20, 350: 30, 500: 45 }[(state && state.goal) || 200] || 20;
    return { min: MINUTES.indexOf(+r.min) >= 0 ? +r.min : byGoal, days: Math.max(1, Math.min(7, +r.days || 5)),
             week: +r.week || null, date: r.date || null };
  }
  function setRitmo(state, patch) {
    var r = Object.assign(ritmo(state), patch || {});
    state.ritmo = { min: r.min, days: r.days, week: r.week || null, date: r.date || null };
    // the xp goal follows (xp stays the game's currency)
    state.goal = GOAL_XP[r.min] || 200;
    return state.ritmo;
  }
  function weekMinutes(week) { return WEEK_MIN[Math.max(0, Math.min(3, Math.floor(((week || 1) - 1) / 13)))]; }

  /* ------------------------------------------------------------ el tiempo */

  function addTime(state, strand, sec, now) {
    var i = STRANDS.indexOf(strand);
    if (i < 0 || !(sec > 0)) return;
    var k = dayKey(now);
    if (!state.tiempo || typeof state.tiempo !== "object" || Array.isArray(state.tiempo)) state.tiempo = {};
    var d = state.tiempo[k];
    if (!Array.isArray(d)) d = state.tiempo[k] = [0, 0, 0, 0];
    d[i] = Math.round((d[i] || 0) + sec);
    if (Math.random() < 0.02 || Object.keys(state.tiempo).length > 130) {
      Object.keys(state.tiempo).forEach(function (kk) { if (daysBetween(kk, k) > 120) delete state.tiempo[kk]; });
    }
  }
  // Seconds by strand over the days [from, to) counted back from now.
  function timeIn(state, from, to, now) {
    var k = dayKey(now), out = { input: 0, output: 0, forma: 0, fluidez: 0, sec: 0 };
    Object.keys(state.tiempo || {}).forEach(function (kk) {
      var age = daysBetween(kk, k), d = state.tiempo[kk];
      if (age < from || age >= to || !Array.isArray(d)) return;
      STRANDS.forEach(function (s, i) { out[s] += d[i] || 0; out.sec += d[i] || 0; });
    });
    return out;
  }
  function todaySec(state, now) { return timeIn(state, 0, 1, now).sec; }
  function thisWeek(state, now) {
    now = now || new Date();
    var n = daysBetween(weekKey(now), dayKey(now)) + 1;
    return timeIn(state, 0, n, now);
  }
  // The last n calendar weeks (Monday to Sunday), oldest first.
  function weeksSeries(state, n, now) {
    now = now || new Date();
    var out = [], hist = {};
    (state.history || []).forEach(function (p) { hist[p.w] = p; });
    for (var i = n - 1; i >= 0; i--) {
      var ws = addDays(weekStart(now), -7 * i), k = dayKey(ws), row = { w: k, input: 0, output: 0, forma: 0, fluidez: 0, sec: 0 };
      for (var d = 0; d < 7; d++) {
        var t = (state.tiempo || {})[dayKey(addDays(ws, d))];
        if (Array.isArray(t)) STRANDS.forEach(function (s, j) { row[s] += t[j] || 0; row.sec += t[j] || 0; });
      }
      // older than what tiempo keeps: the minutes of the weekly point
      if (!row.sec && hist[k] && hist[k].m) row.sec = hist[k].m * 60;
      out.push(row);
    }
    return out;
  }
  // Days with study this week (xp or time).
  function daysThisWeek(state, now) {
    now = now || new Date();
    var ws = weekStart(now), n = 0;
    for (var d = 0; d < 7; d++) {
      var k = dayKey(addDays(ws, d));
      if (((state.days || {})[k] || 0) > 0 || ((state.tiempo || {})[k] || []).some(function (x) { return x > 0; })) n++;
    }
    return n;
  }

  /* Input minutes this week: the time measured in reading and listening,
     or what the records say was read and heard (listening seconds, pages of
     the Library, readings and long listenings finished, dictogloss, the
     minutes logged out of the app), the
     larger of the two.  ctx.words(id): words of a reading. */
  function inputWeek(state, ctx, now) {
    now = now || new Date();
    ctx = ctx || {};
    var wk = weekKey(now), measured = thisWeek(state, now).input / 60, rec = 0;
    var inWeek = function (t) { return t && weekKey(new Date(t)) === wk; };
    Object.keys(state.ascolto || {}).forEach(function (k) { if (weekKey(parseKey(k)) === wk) rec += (state.ascolto[k].sec || 0) / 60; });
    var bd = (state.biblio && state.biblio.days) || {};
    Object.keys(bd).forEach(function (k) { if (weekKey(parseKey(k)) === wk) rec += (bd[k].s || 0) / 60; });
    Object.keys(state.letture || {}).forEach(function (id) {
      var l = state.letture[id];
      if (l && inWeek(l.at)) rec += ctx.words ? Math.max(2, (ctx.words(id) || 200) / 100) : 3;
    });
    Object.keys(state.dictogloss || {}).forEach(function (w) { if (inWeek((state.dictogloss[w] || {}).at)) rec += 6; });
    var fd = (state.fuera && state.fuera.d) || {};   // the minutes logged out of the app (fuera.js)
    Object.keys(fd).forEach(function (k) { if (weekKey(parseKey(k)) === wk) rec += (fd[k] || [])[0] || 0; });
    return Math.round(Math.max(measured, rec));
  }
  function inputTarget(level) {
    var l = String(level || "A1").slice(0, 2).toUpperCase();
    return l === "A1" ? 40 : l === "A2" ? 60 : l === "B1" ? 90 : 150;
  }

  /* ------------------------------------------------------------ el ritmo */

  // Course weeks per calendar week: from the weekly points (the week open
  // then and now), or from when each lesson was finished; null without data.
  function observedPace(state, now) {
    now = now || new Date();
    var h = (state.history || []).filter(function (p) { return p && p.u; });
    if (h.length >= 3) {
      var tail = h.slice(-7), a = tail[0], b = tail[tail.length - 1];
      var weeks = daysBetween(a.w, b.w) / 7;
      if (weeks >= 2) return { pace: Math.max(0, (b.u - a.u) / weeks), src: "semanas" };
    }
    var t = now.getTime(), reads = Object.keys(state.read || {}).map(function (w) { return +state.read[w]; })
      .filter(function (x) { return x > t - 42 * DAY && x <= t; }).sort();
    if (reads.length >= 2) {
      var span = Math.max(14, (t - reads[0]) / DAY) / 7;
      return { pace: reads.length / span, src: "lecciones" };
    }
    return null;
  }
  // The pace the goal in minutes gives (minutes × days / what a course week takes).
  function plannedPace(state) {
    var r = ritmo(state);
    return r.min * r.days / weekMinutes(state.unlocked || 1);
  }
  function pace(state, now) {
    var o = observedPace(state, now), p = plannedPace(state);
    if (o && o.pace > 0.05) return { pace: Math.min(3, o.pace), src: o.src, planned: p };
    return { pace: p, src: "meta", planned: p };
  }

  /* Estimated date of each boss and of C1 at the current pace. */
  function eta(state, now) {
    now = now || new Date();
    var P = pace(state, now), u = state.unlocked || 1, ws = state.weekStats || {};
    var bosses = BOSSES.map(function (b) {
      var passed = !!(ws[b[0]] && ws[b[0]].bossPassed);
      var weeks = passed ? 0 : Math.max(0, b[0] - u + 1) / Math.max(0.05, P.pace);
      return { week: b[0], level: b[1], passed: passed, date: passed ? null : addDays(now, weeks * 7) };
    });
    return { pace: P.pace, src: P.src, planned: P.planned, bosses: bosses, c1: bosses[3].date };
  }
  // A goal with a date: the pace it asks for, and the minutes a day.
  function target(state, now) {
    now = now || new Date();
    var r = ritmo(state);
    if (!r.week || !r.date) return null;
    var d = parseKey(r.date), weeksLeft = daysBetween(dayKey(now), dayKey(d)) / 7, u = state.unlocked || 1;
    var toGo = Math.max(0, r.week - u);
    if (toGo === 0) return { week: r.week, date: d, done: true };
    if (weeksLeft <= 0) return { week: r.week, date: d, late: true, toGo: toGo };
    var need = toGo / weeksLeft, mins = Math.ceil(need * weekMinutes(u) / r.days / 5) * 5;
    return { week: r.week, date: d, toGo: toGo, pace: need, minutes: mins, days: r.days, heavy: mins > 40 };
  }

  function levelNow(course, state) {
    var ws = state.weekStats || {};
    if (ws[52] && ws[52].bossPassed) return "C1";
    var w = course && course.weeks ? course.weeks[Math.min(state.unlocked || 1, 52) - 1] : null;
    return w ? String(w.level || "A1") : "A1";
  }

  /* ------------------------------------------------------------ palabras */

  function wordCards(state) {
    return Object.keys(state.cards || {}).filter(function (id) { return id.indexOf("v:") === 0 || id.indexOf("b:voc:") === 0; }).length;
  }
  // New words this calendar week, from the review log (first review of a word).
  function newWordsWeek(state, now) {
    var t0 = weekStart(now || new Date()).getTime() / 60000 - 720, n = 0;
    (state.log || []).forEach(function (x) { if (Array.isArray(x) && x[5] === "v" && x[4] === 0 && x[1] >= t0) n++; });
    return n;
  }
  /* The weekly share of words, as the course teaches them: the words of
     the week plus one session of «Parole / Palavras» (12), not the gap to
     the boss divided by the weeks left (Engine.subGoals asked ten times
     that).  And what the course teaches up to the next boss. */
  var BANK_SESSION = 12;
  function wordQuota(course, state, now, bank) {
    var u = Math.min(state.unlocked || 1, 52), weeks = (course && course.weeks) || [];
    var w = weeks[u - 1] || {}, boss = BOSSES.filter(function (b) { return b[0] >= u; })[0] || BOSSES[3];
    var plus = bank === false ? 0 : BANK_SESSION;
    var taught = 0;
    weeks.forEach(function (x) { if (x.week <= boss[0]) taught += ((x.vocab || []).length || 0) + (x.boss || bank === false ? 0 : BANK_SESSION); });
    return { target: ((w.vocab || []).length || 0) + plus, done: newWordsWeek(state, now), nWords: wordCards(state),
             boss: boss[0], level: boss[1], byBoss: taught, weekWords: (w.vocab || []).length || 0 };
  }

  /* ------------------------------------------------------------ la serie */

  /* The point of the current week: overwritten while the week lasts, a new
     one when the week changes.  extra: { b: [A1..C1 known] } when the
     frequency layer is loaded. */
  function snapshot(state, extra, now) {
    now = now || new Date();
    if (!Array.isArray(state.history)) state.history = [];
    var wk = weekKey(now), h = state.history, last = h[h.length - 1];
    var errs = state.errs || {}, top = Object.keys(errs).sort(function (a, b) { return errs[b].n - errs[a].n; }).slice(0, 10), e = {};
    top.forEach(function (c) { e[c] = errs[c].n; });
    var p = { w: wk, u: state.unlocked || 1, n: wordCards(state), m: Math.round(thisWeek(state, now).sec / 60), e: e };
    if (extra && extra.i != null) p.i = extra.i;
    if (extra && Array.isArray(extra.b)) p.b = extra.b;
    else if (last && last.w === wk && last.b) p.b = last.b;
    if (last && last.w === wk) h[h.length - 1] = p;
    else h.push(p);
    if (h.length > 110) state.history = h.slice(-110);
    return p;
  }

  /* What costs the most, with its trend: the errors of the last four weeks
     against the four before (from the weekly points). */
  function errTrend(state, now, n) {
    now = now || new Date();
    var errs = state.errs || {}, h = state.history || [], k = dayKey(now);
    var at = function (weeksBack) {
      var target = dayKey(addDays(weekStart(now), -7 * weeksBack)), best = null;
      h.forEach(function (p) { if (daysBetween(p.w, target) >= 0) best = p; });
      return best;
    };
    var p4 = at(4), p8 = at(8);
    return Object.keys(errs).sort(function (a, b) { return errs[b].n - errs[a].n; }).slice(0, n || 6).map(function (c) {
      var e = errs[c], cur = e.n || 0, then = p4 && p4.e ? (p4.e[c] || 0) : null, before = p8 && p8.e ? (p8.e[c] || 0) : null;
      var recent = then == null ? null : Math.max(0, cur - then), prev = then == null || before == null ? null : Math.max(0, then - before);
      var quiet = e.last ? daysBetween(dayKey(new Date(e.last)), k) : null;
      var trend = recent == null ? "sin datos" : prev == null ? (recent ? "reciente" : "quieto")
        : recent < prev * 0.7 ? "baja" : recent > prev * 1.3 + 1 ? "sube" : "igual";
      if (quiet != null && quiet > 14) trend = "quieto";
      return { cat: c, n: cur, fixed: e.fixed || 0, recent: recent, prev: prev, trend: trend, quiet: quiet };
    });
  }

  // Hours studied: the weekly points, or (saves from before the clock) an
  // estimate from the xp.  The simulation of the year makes 41 xp a minute
  // (it plays every mission, with every bonus); a learner, less: 25.
  var XP_MIN = 25;
  function hours(state) {
    var m = 0;
    (state.history || []).forEach(function (p) { m += p.m || 0; });
    var est = (state.xp || 0) / XP_MIN;
    return { h: Math.round(Math.max(m, est) / 6) / 10, measured: m >= est };
  }

  /* ------------------------------------------------------------ pantalla */

  var H = null;
  function esc(s) { return H ? H.esc(s) : String(s == null ? "" : s); }
  function S() { return H.state(); }
  function fmtMonth(d) {
    if (!d) return "";
    try { return d.toLocaleDateString("es-AR", { month: "long", year: "numeric" }); }
    catch (e) { return (d.getMonth() + 1) + "/" + d.getFullYear(); }
  }
  function fmtDay(d) {
    try { return d.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" }); }
    catch (e) { return dayKey(d); }
  }
  function fmtH(sec) { var m = Math.round(sec / 60); return m < 60 ? m + " min" : (Math.round(m / 6) / 10).toString().replace(".", ",") + " h"; }
  function num(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
  function paceWord(p) { return (Math.round(p * 10) / 10).toString().replace(".", ","); }
  function semanas(p) { var w = paceWord(p); return w === "1" ? "una semana" : w + " semanas"; }

  var SNAMES = { input: "Input", output: "Output", forma: "Forma", fluidez: "Fluidez" };
  var SWHAT = { input: "leer y escuchar", output: "escribir", forma: "gramática y ejercicios", fluidez: "frases y rapidez" };

  // The line of the pace, for Oggi and Io.
  function etaLine(state, now) {
    var E = eta(state, now);
    if (E.bosses[3].passed) return "🎓 Llegaste a C1.";
    var src = E.src === "meta" ? "con tu meta de " + ritmo(state).min + " min × " + ritmo(state).days + " días" : "a tu ritmo de las últimas semanas";
    return "C1 en <b>" + fmtMonth(E.c1) + "</b> " + src + ".";
  }

  function summaryCard() {
    var st = S(), E = eta(st), lv = levelNow(H.course(), st), wk = thisWeek(st);
    return '<div class="card prog-sum"><h2>📈 Tu progreso</h2>' +
      '<p class="lead-s">Nivel estimado <b>' + esc(lv) + "</b> · semana " + Math.min(st.unlocked || 1, 52) + " de 52</p>" +
      '<p class="muted">' + etaLine(st) + " Esta semana: " + fmtH(wk.sec) + " de estudio.</p>" +
      '<div class="row"><button class="btn" id="toprog">Ver tu progreso</button></div></div>';
  }

  // A small line (one series): the band's known words over the weeks.
  function spark(vals, max, label) {
    var W = 150, Hh = 34, n = vals.length;
    if (n < 2) return "";
    var pts = vals.map(function (v, i) { return [Math.round(i / (n - 1) * (W - 8)) + 4, Math.round(Hh - 4 - (v / Math.max(1, max)) * (Hh - 8))]; });
    return '<svg class="spark" viewBox="0 0 ' + W + " " + Hh + '" role="img" aria-label="' + esc(label) + '">' +
      '<polyline points="' + pts.map(function (p) { return p.join(","); }).join(" ") + '" />' +
      '<circle cx="' + pts[n - 1][0] + '" cy="' + pts[n - 1][1] + '" r="3" /></svg>';
  }

  function render() {
    var st = S(), course = H.course(), now = new Date();
    var cov = H.coverage ? H.coverage() : null;
    snapshot(st, cov ? { b: BANDS.map(function (l) { return cov.levels[l] ? cov.levels[l][0] : 0; }) } : null, now);
    var E = eta(st, now), lv = levelNow(course, st), T = target(st, now), R = ritmo(st);
    var html = '<button class="btn ghost" id="progback">← Volver</button><h1>📈 Tu progreso</h1>';

    // 1. level and the bosses
    html += '<div class="card"><h2>Nivel estimado: ' + esc(lv) + "</h2>" +
      '<p class="muted">Semana ' + Math.min(st.unlocked || 1, 52) + " de 52 · " +
      (E.src === "meta" ? "con tu meta (" + R.min + " min × " + R.days + " días por semana) avanzás unas "
                        : "a tu ritmo de las últimas semanas avanzás ") + semanas(E.pace) + " del curso por semana.</p>" +
      '<table class="res prog-boss">' + E.bosses.map(function (b) {
        return "<tr><td>" + (b.passed ? "✓ " : "") + "Jefe de la semana " + b.week + " · " + b.level + "</td><td>" +
          (b.passed ? "vencido" : fmtMonth(b.date)) + "</td></tr>";
      }).join("") + "</table>" +
      (T ? '<p class="muted small">' + targetText(T) + "</p>" : "") + "</div>";

    // 2. words by band, over the weeks
    var hist = (st.history || []).filter(function (p) { return Array.isArray(p.b); }).slice(-26);
    if (cov) {
      html += '<div class="card"><h2>📚 Palabras que sabés</h2>' +
        '<p class="muted small">Por banda de frecuencia: A1 son las más comunes. Un punto por semana.</p>' +
        '<div class="prog-bands">' + BANDS.map(function (l, i) {
          var c = cov.levels[l] || [0, 0], vals = hist.map(function (p) { return p.b[i] || 0; });
          var first = vals.length ? vals[0] : c[0];
          return '<div class="pb"><span>' + l + "</span>" + (vals.length >= 2 && Math.max.apply(null, vals) > 0 ? spark(vals, c[1], l + ": " + vals.join(", ")) : '<i class="pb-bar"><i style="width:' + Math.round(c[0] / Math.max(1, c[1]) * 100) + '%"></i></i>') +
            "<b>" + num(c[0]) + " / " + num(c[1]) + "</b>" + (vals.length >= 2 && c[0] > first ? '<small class="muted">+' + num(c[0] - first) + "</small>" : "<small></small>") + "</div>";
        }).join("") + "</div>" +
        (hist.length < 2 ? '<p class="muted small">La serie empieza esta semana: la próxima ya se ve la línea.</p>' : "") + "</div>";
    }

    // 3. hours a week and by strand
    var series = weeksSeries(st, 8, now), max = Math.max.apply(null, series.map(function (r) { return r.sec; }).concat([60]));
    var four = timeIn(st, 0, 28, now), hrs = hours(st);
    html += '<div class="card"><h2>⏱️ Horas de estudio</h2>' +
      '<p class="muted small">Contadas mientras la app está abierta y la estás usando. Meta: ' + R.min + " min × " + R.days + " días = " + fmtH(R.min * R.days * 60) + " por semana.</p>" +
      '<div class="prog-weeks" role="img" aria-label="Minutos por semana, últimas 8 semanas: ' + series.map(function (r) { return Math.round(r.sec / 60); }).join(", ") + '">' +
      series.map(function (r) {
        var hpx = Math.round(r.sec / max * 100);
        var seg = r.input + r.output + r.forma + r.fluidez;
        return '<div class="pw" title="semana del ' + esc(r.w) + ": " + fmtH(r.sec) + '"><div class="pw-col" style="height:' + hpx + '%">' +
          (seg ? STRANDS.map(function (s) { return r[s] ? '<i class="s-' + s + '" style="flex:' + r[s] + '"></i>' : ""; }).join("") : '<i class="s-forma" style="flex:1;opacity:.45"></i>') +
          "</div><small>" + Math.round(r.sec / 60) + "</small></div>";
      }).join("") + "</div>" +
      '<p class="muted small prog-legend">' + STRANDS.map(function (s) { return '<span><i class="dot s-' + s + '"></i>' + SNAMES[s] + " " + fmtH(four[s]) + "</span>"; }).join(" ") + " · últimas 4 semanas</p>" +
      '<p class="muted small">En total, unas <b>' + String(hrs.h).replace(".", ",") + " horas</b>" + (hrs.measured ? "." : " (estimadas por tu xp: el reloj empezó hace poco).") + "</p></div>";

    // input this week against the level's goal
    var inW = inputWeek(st, { words: H.words }, now), inT = inputTarget(lv);
    html += '<div class="card"><h2>🎧 Input de la semana</h2>' +
      '<div class="goalbar"><i style="width:' + Math.min(100, Math.round(inW / inT * 100)) + '%"></i></div>' +
      '<p class="muted">' + inW + " / " + inT + " minutos leyendo y escuchando (la meta de " + esc(lv.slice(0, 2)) + "). " +
      "Suman las lecturas, las escuchas, la Biblioteca, Ascolto facile y el dictogloss.</p></div>";

    // 4. what costs the most, and its trend
    var tr = errTrend(st, now, 6);
    if (tr.length) {
      var TW = { baja: "↓ baja", sube: "↑ sube", igual: "= igual", reciente: "nuevo", quieto: "quieto", "sin datos": "" };
      html += '<div class="card"><h2>🩹 Lo que más te cuesta</h2>' +
        '<p class="muted small">Errores de las últimas cuatro semanas contra las cuatro anteriores.</p>' +
        '<table class="res prog-err">' + tr.map(function (t) {
          return "<tr><td>" + esc(H.label(t.cat)) + '<br><small class="muted">' + t.n + " en total" + (t.fixed ? " · " + t.fixed + " corregidos por vos" : "") +
            (t.quiet != null && t.quiet > 14 ? " · hace " + t.quiet + " días que no aparece" : "") + "</small></td><td>" +
            (t.recent != null ? t.recent + " en 4 sem. " : "") + '<b class="tr-' + (t.trend === "sube" ? "up" : t.trend === "baja" || t.trend === "quieto" ? "down" : "eq") + '">' + (TW[t.trend] || "") + "</b></td></tr>";
        }).join("") + "</table>" +
        '<div class="row" style="margin-top:10px"><button class="btn ghost" data-bank="clinica">🩺 Practicarlos en la Clínica</button></div></div>';
    }
    html += H.cards ? H.cards() : "";
    return html;
  }

  function targetText(T) {
    if (!T) return "";
    var what = "Tu meta: la semana " + T.week + " para el " + fmtDay(T.date) + ". ";
    if (T.done) return what + "✓ Ya llegaste.";
    if (T.late) return what + "La fecha ya pasó: elegí otra en Ajustes.";
    return what + "Pide " + semanas(T.pace) + " del curso por semana: unos <b>" + T.minutes + " minutos por día</b>, " + T.days + " días por semana." +
      (T.heavy ? " Es mucho: más de 40 minutos por día cuesta sostenerlo; considerá una fecha más lejana." : "");
  }

  function wire(screen) {
    if (!H) return;
    var on = function (id, fn) { var b = document.getElementById(id); if (b) b.onclick = fn; };
    on("toprog", function () { H.show("progreso"); });
    if (screen === "progreso") on("progback", function () { H.back(); });
  }

  /* ------------------------------------------------------------ el reloj */

  var SCREEN_STRAND = {
    lettura: "input", dictogloss: "input", "tramo-asc": "input", lector: "input", libro: "input", storia: "input",
    "esame-asc": "input", "esame-let": "input",
    scrivi: "output", parla: "output", "tramo-scr": "output", eplus: "output", escritos: "output", "esame-scr": "output",
    lampo: "fluidez", lezione: "forma", teoria: "forma", gramatica: "forma", ubicacion: "forma", sfide: "forma"
  };
  var ROUND_STRAND = { lettura: "input", suoni: "input", capire: "input", "b-tr": "output", variaciones: "output",
                       scene: "fluidez", lista: "forma" };
  var READING = { lettura: 1, lector: 1, libro: 1, "tramo-asc": 1, dictogloss: 1, storia: 1, "esame-let": 1, "esame-asc": 1, scrivi: 1, "tramo-scr": 1 };
  function strandFor(screen, roundKind, listening) {
    if (screen === "gioco") return ROUND_STRAND[roundKind] || "forma";
    if (SCREEN_STRAND[screen]) return SCREEN_STRAND[screen];
    return listening ? "input" : null;
  }

  var TICK = 5, lastAct = Date.now(), pending = 0, timer = null;
  function tick() {
    if (!H || typeof document === "undefined" || document.hidden) return;
    var sc = H.screen(), listening = !!(H.listening && H.listening());
    var strand = strandFor(sc, H.roundKind ? H.roundKind() : "", listening);
    if (!strand) return;
    var idle = (READING[sc] || listening) ? 180 : 60;
    if (Date.now() - lastAct > idle * 1000) return;
    addTime(S(), strand, TICK);
    pending += TICK;
    if (pending >= 60) { pending = 0; H.persist(); }
  }
  function flush() { if (pending && H) { pending = 0; H.persist(); } }

  function attach(host) {
    H = host;
    if (typeof document === "undefined" || !document.addEventListener || timer) return;
    var act = function () { lastAct = Date.now(); };
    ["pointerdown", "keydown", "scroll", "touchstart"].forEach(function (ev) { document.addEventListener(ev, act, { passive: true, capture: true }); });
    document.addEventListener("visibilitychange", function () { if (document.hidden) flush(); else act(); });
    timer = setInterval(tick, TICK * 1000);
  }
  function owns(s) { return s === "progreso"; }

  var api = {
    STRANDS: STRANDS, BANDS: BANDS, BOSSES: BOSSES, WEEK_MIN: WEEK_MIN, MINUTES: MINUTES, GOAL_XP: GOAL_XP,
    dayKey: dayKey, weekKey: weekKey, ritmo: ritmo, setRitmo: setRitmo, weekMinutes: weekMinutes,
    addTime: addTime, timeIn: timeIn, todaySec: todaySec, thisWeek: thisWeek, weeksSeries: weeksSeries, daysThisWeek: daysThisWeek,
    inputWeek: inputWeek, inputTarget: inputTarget, observedPace: observedPace, plannedPace: plannedPace, pace: pace,
    eta: eta, target: target, levelNow: levelNow, wordCards: wordCards, newWordsWeek: newWordsWeek, wordQuota: wordQuota,
    snapshot: snapshot, errTrend: errTrend, hours: hours, strandFor: strandFor,
    fmtMonth: fmtMonth, fmtDay: fmtDay, fmtH: fmtH, etaLine: etaLine, targetText: targetText,
    attach: attach, owns: owns, render: render, wire: wire, summaryCard: summaryCard, flush: flush
  };
  if (typeof module === "object" && module.exports) module.exports = api;
  root.Progreso = api;
})(typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : this);
