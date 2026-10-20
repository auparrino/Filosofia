/*
 * El motor del juego: corrección de las respuestas, repetición espaciada
 * (FSRS), xp, meta diaria, racha y escudos, cofre, medallas y guardado.
 * Sin dependencias externas.
 *
 * Lo que depende de la lengua lo trae el paquete del idioma: el prefijo del
 * guardado (LANG.storage: cada idioma guarda aparte, y el progreso de quien
 * ya jugaba no se toca), cómo cuentan las tildes (LANG.rules.grade), los
 * campos y las migraciones del guardado (LANG.rules.save), los rangos
 * (LANG.rules.ranks) y los nombres de las medallas (LANG.rules.badges).
 */
(function (root) {
  "use strict";

  var LANG = root.LANG || {};
  var R = LANG.rules || {};
  var GR = R.grade || {};

  /* ------------------------------------------------------------ corrección */

  // Accents are meaningful (parlerò ≠ parlero, avó ≠ avô), so they are kept.
  // Everything else that only reflects typing habits (case, punctuation,
  // spaces, quotes, the spaces around a hyphen: «chama - se») is normalised
  // away.
  function normalise(s) {
    return String(s == null ? "" : s)
      .normalize("NFC")
      .toLowerCase()
      .replace(/[’‘`´]/g, "'")
      .replace(/[“”«»]/g, '"')
      .replace(/([a-zà-ÿ])\s*[-‐‑]\s*([a-zà-ÿ])/g, "$1-$2")
      .replace(/\s+/g, " ")
      .replace(/^[\s.,;:!?]+|[\s.,;:!?]+$/g, "")
      .trim();
  }

  function deaccent(s) {
    return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  // The diacritics of a string, each as «letter position + mark» (the
  // hyphen counts as a space, so «chama se» lines up with «chama-se»).
  function marks(s) {
    var out = [], d = String(s).replace(/-/g, " ").normalize("NFD"), k = 0;
    for (var i = 0; i < d.length; i++) {
      if (/[\u0300-\u036f]/.test(d[i])) out.push((k - 1) + d[i]); else k++;
    }
    return out;
  }

  // Distance capped at 2 — enough to forgive a slip, not enough to accept a
  // different verb form.
  function editDistance(a, b) {
    if (Math.abs(a.length - b.length) > 2) return 99;
    var prev = [], cur = [], i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      cur[0] = i;
      for (j = 1; j <= b.length; j++) {
        cur[j] = Math.min(
          prev[j] + 1,
          cur[j - 1] + 1,
          prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
        );
      }
      prev = cur.slice();
    }
    return prev[b.length];
  }

  /* The verdicts are internal tokens shared by every module (diagnosi.js,
     frasi.js, letture.js, the CSS classes .feedback.giusto…): RIGHT =
     correct, CLOSE = almost, WRONG = wrong. */
  var VERDICT = { RIGHT: "giusto", CLOSE: "quasi", WRONG: "sbagliato" };

  function grade(given, item) {
    var g = normalise(given);
    if (!g) return VERDICT.WRONG;

    var accepted = (item.accept && item.accept.length ? item.accept : [item.answer])
      .map(normalise)
      .filter(Boolean);

    // Some answers are a list of equally valid words ("grandi, buone").
    var expanded = accepted.slice();
    accepted.forEach(function (a) {
      // Only a list of single words is a list of alternatives; a sentence
      // with commas is one answer and its pieces are not right on their own.
      if (a.indexOf(",") >= 0 && a.split(",").every(function (p) { return p.trim().split(/\s+/).length <= 2; })) {
        a.split(",").forEach(function (p) {
          p = normalise(p);
          if (p) expanded.push(p);
        });
      }
      if (a.indexOf("|") >= 0) {
        // Multi-gap items: the learner may type the gaps separated by | or space.
        expanded.push(a.replace(/\s*\|\s*/g, " "));
      }
    });

    if (expanded.indexOf(g) >= 0) return VERDICT.RIGHT;

    // Multi-gap items: the gaps may come separated by commas, | or spaces
    // («dell', dell', del, del», «dell'|dell'|del|del», «dell' dell' del
    // del»), and a missing comma is not a mistake.
    var multi = accepted.some(function (a) { return a.indexOf("|") >= 0; });
    if (multi) {
      var gs = g.replace(/\s*[|,;]\s*/g, " ").replace(/\s+/g, " ").trim();
      if (gs !== g) {
        if (expanded.indexOf(gs) >= 0) return VERDICT.RIGHT;
        g = gs;
      }
    }

    // Right word, missing accent (parlero for parlerò, voce for você,
    // cabeca for cabeça): worth partial credit and an explicit correction,
    // never a silent pass.  With grade.hyphen, the hyphen of the enclitic
    // too (chama se for chama-se).  With grade.strictMarks only a missing
    // mark earns it: an accent in the wrong place or of the wrong kind is
    // another word (avô for avó, é for ê); with grade.graveIsGrammar the
    // grave accent is grammar, not spelling (the crase: «a» for «à» is a
    // rule error, never partial credit).
    var flat = function (x) { return deaccent(x).replace(/-/g, " "); };
    var other = false;
    for (var k = 0; k < expanded.length; k++) {
      if (deaccent(g) === deaccent(expanded[k]) || (GR.hyphen && flat(g) === flat(expanded[k]))) {
        if (!GR.strictMarks) return VERDICT.CLOSE;
        var mg = marks(g), mw = marks(expanded[k]);
        if (mg.every(function (m) { return mw.indexOf(m) >= 0; }) &&
            (!GR.graveIsGrammar || mw.every(function (m) { return m.slice(-1) !== "\u0300" || mg.indexOf(m) >= 0; }))) return VERDICT.CLOSE;
        other = true;
      }
    }
    if (other) return VERDICT.WRONG;

    // Typo tolerance scales with length.  On a single word a one-letter
    // difference is usually the grammatical ending the drill is testing
    // (parla vs parli, fala vs falo), so short answers must match exactly.
    for (var i = 0; i < expanded.length; i++) {
      var want = expanded[i];
      var budget = want.length > 20 ? 2 : want.length > 8 ? 1 : 0;
      if (budget && editDistance(g, want) <= budget) return VERDICT.CLOSE;
    }
    return VERDICT.WRONG;
  }

  /* ------------------------------------------------- repetición espaciada */

  /* FSRS (Free Spaced Repetition Scheduler, Jarrett Ye / open-spaced-
     repetition, versión 5) con los parámetros por defecto, que en el
     benchmark público (519 M de repasos) predice mejor que SM-2 y que el HLR
     de Duolingo.  Cada ficha guarda: s (estabilidad en días: cuánto tarda la
     probabilidad de recordarla en bajar al 90 %), d (dificultad 1-10), due,
     last, reps (aciertos seguidos), lapses, ok, state.
     Nada se «retira»: después de unos aciertos la ficha pasa a
     «mantenimiento» (Rawson & Dunlosky 2022; Bahrick 1993) y vuelve a
     intervalos de meses, con un tope diario (drills.dueList). */
  var DAY = 86400000;
  var W = [0.40255, 1.18385, 3.173, 15.69105, 7.1949, 0.5345, 1.4604, 0.0046, 1.54575, 0.1192,
           1.01925, 1.9395, 0.11, 0.29605, 2.2698, 0.2315, 2.9898, 0.51655, 0.6621];
  var DECAY = -0.5, FACTOR = 19 / 81;
  var MAINT_S = 60;          // estabilidad (días) desde la que la ficha está en mantenimiento
  var RETENTIONS = [0.85, 0.9, 0.95];

  // Probability of recall after t days for a card of stability s.
  function retrievability(t, s) {
    if (!(s > 0)) return 0;
    return Math.pow(1 + FACTOR * Math.max(0, t) / s, DECAY);
  }
  // Days until recall drops to the desired retention r.
  function intervalFor(s, r) {
    return Math.max(1, Math.round(s / FACTOR * (Math.pow(r, 1 / DECAY) - 1)));
  }
  function clampD(d) { return Math.min(10, Math.max(1, d)); }
  function initS(g) { return W[g - 1]; }
  function initD(g) { return clampD(W[4] - Math.exp(W[5] * (g - 1)) + 1); }
  function nextD(d, g) {
    var d1 = d + (-W[6] * (g - 3)) * (10 - d) / 9;
    return clampD(W[7] * initD(4) + (1 - W[7]) * d1);
  }
  function recallS(d, s, r, g) {
    var hard = g === 2 ? W[15] : 1, easy = g === 4 ? W[16] : 1;
    return s * (Math.exp(W[8]) * (11 - d) * Math.pow(s, -W[9]) * (Math.exp(W[10] * (1 - r)) - 1) * hard * easy + 1);
  }
  function forgetS(d, s, r) {
    return Math.min(s, W[11] * Math.pow(d, -W[12]) * (Math.pow(s + 1, W[13]) - 1) * Math.exp(W[14] * (1 - r)));
  }
  function shortS(s, g) { return s * Math.exp(W[17] * (g - 3 + W[18])); }

  /* The rating (1 Again, 2 Hard, 3 Good, 4 Easy) from what the app knows:
     the verdict, whether a hint was needed, the second easier pass, the
     time taken.  A slip (an accent, a typo) is knowledge with a finger
     error: it keeps moving forward. */
  function ratingFor(q, o) {
    o = o || {};
    if (q === 0) return 1;
    if (q === 1) return o.kind === "slip" ? 3 : 2;
    if (o.retry || o.hint) return 2;
    // right but slow: known, not yet automatic (DeKeyser & Suzuki 2025)
    if (o.slow) return 2;
    if (o.light || o.fast) return 4;
    return 3;
  }

  // Vocabulary forgets at another pace than grammar: two speeds are fitted.
  function cardKind(id) {
    id = String(id || "");
    return id.indexOf("v:") === 0 || id.indexOf("b:voc:") === 0 || id.indexOf("frase:") === 0 || id.indexOf("ponte:") === 0 ? "v" : "g";
  }

  /* A card from the SM-2 days (ease, interval) gets a stability and a
     difficulty so nothing is lost on the way. */
  function upgradeCard(card) {
    if (!card) return null;
    if (card.s != null && card.d != null) return card;
    var ivl = +card.interval || 0, ease = +card.ease || 2.5;
    card.s = Math.max(0.5, ivl || (card.reps ? 1 : 0.5));
    card.d = clampD(5 + (2.5 - ease) * 4);
    card.lapses = card.lapses || 0;
    card.state = ivl >= 45 || ((card.ok || 0) >= 3 && ease >= 2.5) ? "maint" : card.reps ? "rev" : "learn";
    return card;
  }

  // 7 am of the next morning (or of today, before 7).
  function nextMorning(now) {
    var d = new Date(now);
    if (d.getHours() >= 7) d.setDate(d.getDate() + 1);
    d.setHours(7, 0, 0, 0);
    return d.getTime();
  }

  /* schedule(card, quality, opts): quality 0 incorrecto, 1 casi, 2 correcto.
     opts: kind (slip/vocab/rule), light (right at first sight in the
     training), retry, hint, fast,
     rating (1-4, overrides), now, id, state (for the review log, the
     retention target and the fitted speeds), notte (false to switch off
     the night → morning schedule). */
  function schedule(card, quality, opts) {
    opts = opts || {};
    var now = opts.now || Date.now();
    var st = opts.state || null;
    var r = opts.rating || ratingFor(quality, opts);
    var kind = cardKind(opts.id);
    var speed = (st && st.speed && st.speed[kind] && st.speed[kind].k) || 1;
    var retention = opts.retention || (st && st.retention) || 0.9;
    var isNew = !card;
    card = upgradeCard(card);
    var elapsed = card && card.last ? Math.max(0, (now - card.last) / DAY) : 0;
    var sameDay = !!(card && card.last && daysBetween(dayKey(new Date(card.last)), dayKey(new Date(now))) === 0);
    var sBefore = card ? card.s : 0;
    if (!card) {
      card = { s: initS(r), d: initD(r), reps: 0, lapses: 0, seen: 0, ok: 0, state: "learn" };
    } else if (sameDay) {
      card.s = shortS(card.s, r);
      card.d = nextD(card.d, r);
    } else {
      var R = retrievability(elapsed, card.s * speed);
      card.s = r === 1 ? forgetS(card.d, card.s, R) : recallS(card.d, card.s, R, r);
      card.d = nextD(card.d, r);
    }
    if (r === 1) {
      card.reps = 0; card.ok = 0; card.lapses = (card.lapses || 0) + 1;
      card.state = "learn";
    } else {
      card.reps = (card.reps || 0) + 1;
      if (r >= 3) card.ok = (card.ok || 0) + 1;
      if (card.state === "learn" && card.s >= 3) card.state = "rev";
    }
    if (card.s * speed >= MAINT_S) card.state = "maint";
    var ivl = intervalFor(card.s * speed, retention);
    if (r === 1) ivl = 1;                        // an error comes back tomorrow
    card.interval = ivl;
    // Due by day, not by the hour: from 4 am of the due day, so an error at
    // 9 pm is in tomorrow morning's review and not after 9 pm tomorrow.
    var dd = new Date(now + ivl * DAY);
    dd.setHours(4, 0, 0, 0);
    card.due = Math.max(dd.getTime(), now + 3600000);
    delete card.night; delete card.hyper;
    var hour = new Date(now).getHours();
    // Learn at night, review in the morning, with sleep in between (Mazza
    // et al. 2016): what is new after 8 pm is asked again at breakfast.
    if (opts.notte !== false && hour >= 20 && isNew) {
      card.due = nextMorning(now); card.night = dayKey(new Date(card.due));
    }
    delete card.light; delete card.ease;
    card.last = now;
    card.seen = (card.seen || 0) + 1;
    if (st && opts.id) logReview(st, opts.id, now, r, elapsed, sBefore, kind, opts.ms);
    return card;
  }

  function isDue(card, now) {
    return !card || !card.due || card.due <= (now || Date.now());
  }
  // In maintenance: known.  It still comes back, months apart, capped a day.
  function retired(card) {
    return !!card && (card.state === "maint" || (card.s == null && ((card.interval || 0) >= 45 || ((card.ok || 0) >= 3 && (card.ease || 0) >= 2.5))));
  }

  /* ------------------------------------------------ registro de repasos */

  /* Every review is logged (id, minute, rating, days elapsed, stability
     before, kind): with it the app fits, on the phone, how fast this
     learner forgets vocabulary and grammar (a «speed» that scales the
     default stabilities). */
  var LOG_MAX = 2500;
  function logReview(state, id, now, r, elapsed, sBefore, kind, ms) {
    if (!state.log) state.log = [];
    var row = [String(id), Math.round(now / 60000), r, Math.round(elapsed * 10) / 10, Math.round(sBefore * 10) / 10, kind];
    if (ms != null && ms > 0 && ms < 600000) row.push(Math.round(ms / 100) / 10);   // seconds to answer
    state.log.push(row);
    // a counter that never goes back, so the refit keeps happening when the log is full
    state.logTotal = (state.logTotal || state.log.length - 1) + 1;
    if (state.log.length > LOG_MAX) state.log = state.log.slice(-LOG_MAX);
  }

  // Log-loss of the predicted recall against what happened, for one speed.
  function logLoss(rows, k) {
    var loss = 0;
    rows.forEach(function (x) {
      var p = Math.min(0.9999, Math.max(0.0001, retrievability(x[3], x[4] * k)));
      loss += x[2] > 1 ? -Math.log(p) : -Math.log(1 - p);
    });
    return loss / rows.length;
  }
  /* fitSpeed: grid search of the speed factor per kind over the log.
     Under 100 reviews of a kind the default (1) stays: Anki found that
     fitting on too little makes things worse. */
  function fitSpeed(state) {
    var out = {};
    ["v", "g"].forEach(function (kind) {
      var rows = (state.log || []).filter(function (x) { return x[5] === kind && x[3] >= 0.5 && x[4] > 0; });
      if (rows.length < 100) { out[kind] = { k: 1, n: rows.length }; return; }
      var best = 1, bestLoss = Infinity;
      for (var k = 0.5; k <= 2.001; k += 0.1) {
        var l = logLoss(rows, k);
        if (l < bestLoss - 1e-9) { bestLoss = l; best = Math.round(k * 10) / 10; }
      }
      out[kind] = { k: best, n: rows.length, loss: Math.round(bestLoss * 1000) / 1000 };
    });
    out.at = Date.now();
    state.speed = out;
    return out;
  }
  // Refit every 200 reviews.
  function maybeFit(state) {
    var n = state.logTotal || (state.log || []).length;
    if ((state.log || []).length < 100) return null;
    if (n < 100 || (state.speed && state.speed.n && n - state.speed.n < 200)) return null;
    var f = fitSpeed(state);
    f.n = n;
    return f;
  }

  /* What the memory looks like today: how many cards learning, in review,
     in maintenance, and the average chance of recalling them right now. */
  function memoryStats(state, now) {
    now = now || Date.now();
    var out = { learn: 0, rev: 0, maint: 0, n: 0, recall: 0 };
    var sum = 0;
    Object.keys(state.cards || {}).forEach(function (id) {
      var c = upgradeCard(state.cards[id]);
      if (!c) return;
      out.n++;
      out[c.state || "learn"] = (out[c.state || "learn"] || 0) + 1;
      sum += retrievability(Math.max(0, (now - (c.last || now)) / DAY), c.s);
    });
    out.recall = out.n ? Math.round(sum / out.n * 100) : 0;
    return out;
  }

  /* ------------------------------------------- misiones con criterio */

  /* A comprehension mission (a reading, a listening, the radio) is done
     with `pass` % or more; a second attempt completes it with 40 % or more,
     a third one always: the week never stays locked, but an answer sheet
     left blank no longer counts (3.1).  Records saved before 3.1 (without
     v: 31) keep the old rule, «the second attempt completes it». */
  var FLOOR2 = 40;
  function passed(rec, pass, tries) {
    if (!rec) return false;
    var best = rec.pct || 0;
    tries = tries != null ? tries : rec.tries || 1;
    if (best >= pass) return true;
    if (rec.v !== 31) return tries >= 2;
    return (tries >= 2 && best >= FLOOR2) || tries >= 3;
  }
  // What is still missing, said the same way in every mission.
  function passMissing(rec, pass, tries) {
    tries = tries != null ? tries : (rec && rec.tries) || 0;
    if (!rec) return "Te falta: hacerla (con " + pass + " % queda hecha)";
    if (tries <= 1) return "Te falta: " + pass + " %, o un segundo intento con " + FLOOR2 + " % o más";
    return "Te falta: " + pass + " %, o " + FLOOR2 + " % en otro intento (el tercero la completa igual)";
  }

  /* ------------------------------------------------- hábito y metas */

  /* Sessions a day (frequency predicts gains better than minutes: Sudina &
     Plonsky 2024) and the weekly streak: weeks in a row with at least
     three active days, sturdier and less anxious than the daily one. */
  function noteSession(state, now) {
    var k = dayKey(now);
    if (!state.sessions) state.sessions = {};
    state.sessions[k] = (state.sessions[k] || 0) + 1;
    Object.keys(state.sessions).forEach(function (kk) { if (daysBetween(kk, k) > 70) delete state.sessions[kk]; });
    return state.sessions[k];
  }
  function sessionsToday(state, now) { return (state.sessions || {})[dayKey(now)] || 0; }
  // Monday of the week that holds d.
  function weekStart(d) {
    var x = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12);
    var wd = (x.getDay() + 6) % 7;
    x.setDate(x.getDate() - wd);
    return x;
  }
  function weekKey(d) { return dayKey(weekStart(d || new Date())); }
  function activeDaysIn(state, start) {
    var n = 0;
    for (var i = 0; i < 7; i++) {
      var d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i, 12);
      if ((state.days || {})[dayKey(d)] > 0) n++;
    }
    return n;
  }
  function weekStreak(state, now) {
    var d = weekStart(now || new Date()), streak = 0;
    // the current week counts once it has three days; otherwise start from last week
    if (activeDaysIn(state, d) >= 3) streak++;
    for (var w = 1; w < 60; w++) {
      var prev = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7 * w, 12);
      if (activeDaysIn(state, prev) >= 3) streak++; else break;
    }
    return streak;
  }
  // Days since the last session; a pause is three days or more.
  function daysAway(state, now) {
    if (!state.lastPlayed) return 0;
    return Math.max(0, daysBetween(state.lastPlayed, dayKey(now)));
  }
  // New words (first review of a vocabulary card) in the last 7 days, from the log.
  function newWordsThisWeek(state, now) {
    var t = Math.round((now || Date.now()) / 60000) - 7 * 1440, n = 0;
    (state.log || []).forEach(function (x) { if (x[5] === "v" && x[4] === 0 && x[1] >= t) n++; });
    return n;
  }
  /* Sub-goals (Bandura & Schunk 1981): the distal goal is the next boss;
     the weekly share of words and course weeks follows from what is left,
     and shrinks by itself when the learner falls behind. */
  function subGoals(state, now) {
    var wk = state.unlocked || 1;
    var boss = wk <= 13 ? 13 : wk <= 26 ? 26 : wk <= 39 ? 39 : 52;
    var wordGoal = boss === 13 ? 800 : boss === 26 ? 1800 : boss === 39 ? 2800 : 3800;
    var nWords = Object.keys(state.cards || {}).filter(function (id) { return id.indexOf("v:") === 0 || id.indexOf("b:voc:") === 0; }).length;
    var weeksLeft = Math.max(1, boss - wk + 1);
    var perWeek = Math.max(10, Math.ceil(Math.max(0, wordGoal - nWords) / weeksLeft));
    return { boss: boss, level: boss === 13 ? "A2" : boss === 26 ? "B1" : boss === 39 ? "B2" : "C1", wordGoal: wordGoal, nWords: nWords,
             weeksLeft: weeksLeft, wordsPerWeek: perWeek, wordsThisWeek: newWordsThisWeek(state, now) };
  }
  /* Personal records (beat yourself, not a leaderboard: Hanus & Fox 2015). */
  function noteRecord(state, key, value) {
    if (!state.records) state.records = {};
    var prev = state.records[key] || 0;
    if (value > prev) { state.records[key] = value; return prev > 0; }
    return false;
  }
  // The fresh-start moments (Dai, Milkman & Riis 2014): a Monday, the 1st.
  function freshStart(now) {
    var d = now || new Date();
    if (d.getDate() === 1) return "mes";
    if (d.getDay() === 1) return "semana";
    return null;
  }

  /* --------------------------------------------- la regla como ficha */

  /* A grammar rule is consolidated after productive practice on three
     different days (Serfaty & Serrano 2024; Suzuki 2019): each week keeps
     the days on which its own exercises were written right. */
  function noteProduction(state, week, now) {
    if (!week) return;
    var ws = state.weekStats[week] || (state.weekStats[week] = { attempts: 0, right: 0, bossPassed: false });
    var k = dayKey(now);
    if (!ws.prodDays) ws.prodDays = [];
    if (ws.prodDays.indexOf(k) < 0) { ws.prodDays.push(k); ws.prodDays = ws.prodDays.slice(-6); }
  }
  function consolidated(ws) { return !!(ws && ws.prodDays && ws.prodDays.length >= 3); }

  /* Fin de semana liviano (la guía): la meta baja a la mitad el sábado y el
     domingo, para no cortar la racha ni pedir las tres horas. */
  /* The daily goals were set when every right answer paid 10 xp plus the
     combo.  With the xp by cognitive cost the same minutes earn about 70 %
     of that (measured with tools/<code>/sim_carriera.js: 2.434 → 1.725 xp
     per hour in italiano, 2.561 → 1.641 in portugués), so the goal the
     learner chose (100 / 200 / 350 / 500, the level of effort) is worth
     that much xp now: the time a day does not change. */
  var GOAL_SCALE = 0.7;
  function goalValue(g) { return Math.round((+g || 200) * GOAL_SCALE / 10) * 10; }
  function goalFor(state, now) {
    var d = now || new Date(), goal = goalValue(state.goal || 200);
    var wd = d.getDay();
    return wd === 0 || wd === 6 ? Math.max(50, Math.round(goal / 2 / 50) * 50) : goal;
  }

  /* Las cuatro destrezas de Nation: input, output, forma y fluidez, xp por
     día, para mostrar el equilibrio de la semana. */
  var STRANDS = ["input", "output", "forma", "fluidez"];
  function addStrand(state, strand, n, now) {
    if (!n || STRANDS.indexOf(strand) < 0) return;
    var k = dayKey(now);
    if (!state.strands) state.strands = {};
    var d = state.strands[k] || (state.strands[k] = {});
    d[strand] = (d[strand] || 0) + n;
    // Only the last 14 days are kept.
    Object.keys(state.strands).forEach(function (kk) { if (daysBetween(kk, k) > 14) delete state.strands[kk]; });
    if (STRANDS.every(function (x) { return d[x] > 0; })) state.balancedDay = true;
  }
  function strandsLast(state, days, now) {
    var out = { input: 0, output: 0, forma: 0, fluidez: 0 }, k = dayKey(now);
    Object.keys(state.strands || {}).forEach(function (kk) {
      if (daysBetween(kk, k) < (days || 7)) STRANDS.forEach(function (x) { out[x] += (state.strands[kk][x] || 0); });
    });
    return out;
  }

  /* --------------------------------------------------------------- progreso */

  // Level curve: each level costs a bit more than the last.
  function levelFor(xp) {
    var lvl = 1, need = 100, total = 0;
    while (xp >= total + need) {
      total += need;
      lvl += 1;
      need = Math.round(need * 1.15);
    }
    return { level: lvl, into: xp - total, need: need };
  }

  /* xp by cognitive cost, not the same for everything: recognising among
     options pays less than writing, a rule of a month ago written from
     memory pays more (retrieval effort: Bjork 1994; Rawson & Dunlosky
     2022), and so does a phrase written from memory.  The streak bonus
     («racha de escritos») grows only with written answers. */
  var XP = { right: 10, close: 4, bonusCombo: 2, boss: 150, challenge: 6,
             lesson: 15, recog: 6, written: 10, oldRule: 14, phrase: 12,
             textWord: 0.5, textMax: 80, textStruct: 5, textClean: 20 };
  var TYPED_KINDS = { cloze: 1, translate: 1, conjugate: 1, plural: 1, numbers: 1, qa: 1, typed: 1,
                      write: 1, dictation: 1, fixerr: 1, garden: 1 };

  // Written (produced) or recognised among options (or tiles, or a card
  // graded by the learner).
  function written(it) {
    if (!it) return true;
    if (it.recog || it.options || it.type === "choice" || it.type === "flash") return false;
    return !!TYPED_KINDS[it.type];
  }
  function costOf(it, ctx) {
    if (!it) return XP.right;
    if (!written(it)) return XP.recog;
    if (ctx && ctx.old) return XP.oldRule;
    if (it.frase) return XP.phrase;
    return XP.written;
  }
  // xpFor(verdict, combo) as always; with the item, by its cost (ctx.old: a
  // rule of a month or more ago).
  function xpFor(verdict, combo, it, ctx) {
    if (verdict === VERDICT.RIGHT) {
      var base = costOf(it, ctx);
      return base + (it && !written(it) ? 0 : Math.min(combo || 0, 10) * XP.bonusCombo);
    }
    if (verdict === VERDICT.CLOSE) return XP.close;
    return 0;
  }
  // Free text: by the word (with a cap), by each structure asked and met,
  // and a bonus when the review found nothing to fix.
  function xpText(words, structs, clean) {
    return Math.min(XP.textMax, Math.round((+words || 0) * XP.textWord)) + (+structs || 0) * XP.textStruct +
      (clean ? XP.textClean : 0);
  }

  /* ------------------------------------------- fichas desde cualquier módulo */

  /* enqueue(state, id, item, opts): any module can put something in the
     review: a check of the lesson missed, a question of a reading, a block
     of the dictogloss not recovered, a gap of the C-test.  The item is
     kept in state.own (the review can rebuild it from there); the card is
     due tomorrow morning (opts.due: another moment; opts.now).  With
     opts.maint the card starts in maintenance (what the placement test
     skipped: known, it comes back a few a day, never as a debt); an
     existing card is never overwritten by a maintenance one. */
  var OWN_MAX = 200;
  function enqueue(state, id, item, opts) {
    opts = opts || {};
    if (!state || !id) return null;
    if (!state.cards) state.cards = {};
    var now = opts.now || Date.now();
    if (item) {
      if (!state.own) state.own = {};
      var copy = {};
      Object.keys(item).forEach(function (k) { copy[k] = item[k]; });
      copy.id = id;
      delete copy.retry; delete copy.recogNote; delete copy.novel; delete copy.skill;
      state.own[id] = { it: copy, at: now, src: opts.src || item.src || "", week: opts.week || item.week || 0 };
      var keys = Object.keys(state.own);
      if (keys.length > OWN_MAX) {
        keys.sort(function (a, b) { return state.own[a].at - state.own[b].at; })
          .slice(0, keys.length - OWN_MAX).forEach(function (k) { delete state.own[k]; delete state.cards[k]; });
      }
    }
    var card = state.cards[id];
    if (opts.maint) {
      if (card) return card;
      card = { s: MAINT_S, d: 5, reps: 1, lapses: 0, seen: 0, ok: 1, state: "maint",
               interval: MAINT_S, due: opts.due || now, last: now, seeded: 1 };
    } else {
      var dd = new Date(now + DAY);
      dd.setHours(4, 0, 0, 0);
      var due = opts.due || dd.getTime();
      if (card && card.due && card.due <= due && card.reps === 0) return card;     // already coming back
      if (!card) card = { s: W[0], d: initD(1), reps: 0, lapses: 1, seen: 0, ok: 0, state: "learn", last: now };
      else { card.reps = 0; card.state = "learn"; }
      card.due = due;
      card.interval = Math.max(0, Math.round((due - now) / DAY));
    }
    state.cards[id] = card;
    return card;
  }

  /* --------------------------------------------------------------- guardado */

  // Each language saves under its own prefix (LANG.storage).
  var KEY = (LANG.storage || "c1") + ".save.v1";
  var SAVE = R.save || {};

  function baseSave() {
    return {
      xp: 0,
      coins: 0,
      week: 1,
      unlocked: 1,
      streak: 0,
      lastPlayed: null,
      cards: {},          // itemId -> ficha SRS
      read: {},           // semana -> momento en que se leyó la lección
      lessonScore: {},    // semana -> mejor % en los chequeos de la lección jugada
      weekStats: {},      // semana -> { attempts, right, bossPassed }
      challengeLog: {},   // challengeId -> autoevaluación
      badges: [],
      totals: { attempts: 0, right: 0, close: 0, wrong: 0 },
      days: {},           // "aaaa-m-d" -> xp ganada ese día
      goal: 200,          // meta de xp por día (~2-4 pausas de café)
      shields: 1,         // escudos que salvan la racha si faltás un día
      chest: null,        // día en que abriste el cofre
      best: {},           // récords: relâmpago, combo
      silent: false,      // modo oficina: nada suena solo
      kbQuiet: false,     // teclado sin sugerencias (autocomplete="off"): Gboard no detecta ni deja cambiar el idioma
      theme: "",          // "" como el teléfono, "light" u "dark"
      written: 0,         // frases escritas de memoria sin errores
      letture: {},        // lectura -> { pct, at } de las lecturas hechas
      errs: {},           // categoría de error -> { n, fixed, last }
      errLog: [],         // últimos errores: { cat, g, e, at }
      srsV: 2,            // versión del programador (2 = FSRS)
      retention: 0.9,     // retención deseada (0.85 / 0.9 / 0.95)
      notte: true,        // lo nuevo de noche se repasa a la mañana
      log: [],            // registro de repasos: [id, minuto, nota, días, s, tipo]
      speed: {},          // velocidades de olvido estimadas: { v: {k, n}, g: {k, n} }
      sessions: {},       // "aaaa-m-d" -> sesiones jugadas ese día
      plan: null,         // intención de implementación: { when, where, at }
      ideal: null,        // el «yo ideal»: { why, text, at }
      goals: null,        // submetas semanales: { words, rules, weeks, start }
      reflect: {},        // cierre semanal: "aaaa-m-d" (lunes) -> { hard, change, when }
      records: {},        // récords personales por métrica
      pauses: [],         // pausas de 3+ días: { from, to, why }
      keywords: {},       // palabra -> imagen mnemónica escrita por el alumno
      own: {},            // fichas que crearon los módulos (Engine.enqueue): id -> { it, at, src, week }
      recog: {},          // ejercicios reconocidos bien sin ficha: id -> minuto (la próxima vez, escritos)
      predictions: []     // «¿cuánto creés que vas a sacar?»: { kind, week, said, got, at }
    };
  }

  /* A new save: the common fields plus the language's own (the versions of
     its syllabus: LANG.rules.save.blank). */
  function blankSave() {
    var base = baseSave(), extra = SAVE.blank || {}, s = {};
    // (right after the goal, where they always were in the saved JSON)
    Object.keys(base).forEach(function (k) {
      s[k] = base[k];
      if (k === "goal") Object.keys(extra).forEach(function (x) { s[x] = extra[x]; });
    });
    return s;
  }

  /* A save can come back damaged (an old version, a half-written copy, a
     hand-edited backup).  Every field is checked against the blank save:
     wrong types go back to their default, numbers are clamped, broken
     entries dropped.  What is valid is kept. */
  function isObj(v) { return !!v && typeof v === "object" && !Array.isArray(v); }
  function num(v, def, min, max) {
    v = +v;
    if (!isFinite(v)) return def;
    if (min !== undefined && v < min) v = min;
    if (max !== undefined && v > max) v = max;
    return v;
  }

  /* The fields the modules keep in the save (outside the base save): with
     the wrong type (a string where an object goes, after a bad copy or an
     old version) they are dropped, and the module starts them again empty.
     Before 3.0 a single bad field could leave the app without a screen. */
  var SAVE_V = 3;
  var MODULE_OBJ = ["mcGloss", "readSess", "readParts", "variants", "hintLevels", "weakDone", "suoniPct", "suoniDone", "capirePct", "identPct",
    "duelli", "ubicacion", "dictogloss", "ascolto", "parlaLog", "esame", "esameDraft", "scrittiDraft", "scritti", "biblio",
    "bossUsed", "strands", "streakBroken", "escritos", "escrituraPlus", "onboard", "hoy", "cierre", "porque", "ritmo", "tiempo",
    "dos", "radio", "scriviExtra", "tramo", "tres", "fuera", "trabajo", "sync"];
  var MODULE_ARR = ["aiNotes", "storie", "history"];
  function sanitizeModules(s) {
    MODULE_OBJ.forEach(function (k) { if (k in s && s[k] != null && !isObj(s[k])) delete s[k]; });
    MODULE_ARR.forEach(function (k) { if (k in s && s[k] != null && !Array.isArray(s[k])) delete s[k]; });
    if (s.phase != null && typeof s.phase !== "string") delete s.phase;
  }
  function sanitize(s) {
    var base = blankSave();
    if (!isObj(s)) return base;
    sanitizeModules(s);
    // the version of the save: where a future migration starts from
    s.v = SAVE_V;
    Object.keys(base).forEach(function (k) {
      var b = base[k], v = s[k];
      if (v === undefined) { s[k] = b; return; }
      if (typeof b === "number") s[k] = num(v, b);
      else if (typeof b === "boolean") s[k] = !!v;
      else if (Array.isArray(b)) { if (!Array.isArray(v)) s[k] = b; }
      else if (isObj(b) || (b && typeof b === "object")) { if (!isObj(v)) s[k] = b; }
      else if (b === null) { if (v !== null && typeof v !== "string") s[k] = null; }
    });
    s.xp = num(s.xp, 0, 0);
    s.coins = num(s.coins, 0, 0);
    s.unlocked = Math.round(num(s.unlocked, 1, 1, 52));
    s.week = Math.round(num(s.week, 1, 1, 52));
    s.streak = Math.round(num(s.streak, 0, 0));
    s.shields = Math.round(num(s.shields, 1, 0, 3));
    s.spoken = num(s.spoken, 0, 0);
    s.written = num(s.written, 0, 0);
    if ([100, 200, 350, 500].indexOf(s.goal) < 0) s.goal = 200;
    ["attempts", "right", "close", "wrong"].forEach(function (k) {
      s.totals[k] = num(s.totals[k], 0, 0);
    });
    s.badges = s.badges.filter(function (b) { return typeof b === "string"; });
    Object.keys(s.cards).forEach(function (id) {
      var c = s.cards[id];
      if (!isObj(c)) { delete s.cards[id]; return; }
      if (c.ease != null) c.ease = num(c.ease, 2.5, 1.3, 2.8);
      c.interval = num(c.interval, 0, 0);
      c.reps = num(c.reps, 0, 0);
      c.due = num(c.due, 0, 0);
      if (c.s != null) { c.s = num(c.s, 1, 0.1, 36500); c.d = num(c.d, 5, 1, 10); }
      if (c.state && ["learn", "rev", "maint"].indexOf(c.state) < 0) delete c.state;
    });
    if (RETENTIONS.indexOf(s.retention) < 0) s.retention = 0.9;
    s.log = s.log.filter(Array.isArray).slice(-LOG_MAX);
    delete s.conf;   // the confidence asked before 3.0 (no longer asked)
    Object.keys(s.sessions).forEach(function (k) { s.sessions[k] = num(s.sessions[k], 0, 0); });
    Object.keys(s.keywords).forEach(function (k) { if (typeof s.keywords[k] !== "string") delete s.keywords[k]; });
    s.pauses = s.pauses.filter(isObj).slice(-30);
    Object.keys(s.own).forEach(function (k) { if (!isObj(s.own[k]) || !isObj(s.own[k].it)) delete s.own[k]; });
    s.predictions = s.predictions.filter(isObj).slice(-40);
    Object.keys(s.days).forEach(function (k) {
      if (!isFinite(+s.days[k])) delete s.days[k]; else s.days[k] = +s.days[k];
    });
    Object.keys(s.errs).forEach(function (k) {
      var e = s.errs[k];
      if (!isObj(e) || !isFinite(+e.n)) { delete s.errs[k]; return; }
      e.n = num(e.n, 0, 0); e.fixed = num(e.fixed, 0, 0); e.last = num(e.last, 0, 0);
    });
    s.errLog = s.errLog.filter(isObj).slice(0, 60);
    Object.keys(s.weekStats).forEach(function (k) {
      var w = s.weekStats[k];
      if (!isObj(w)) { delete s.weekStats[k]; return; }
      w.attempts = num(w.attempts, 0, 0); w.right = num(w.right, 0, 0);
    });
    Object.keys(s.letture).forEach(function (k) {
      if (!isObj(s.letture[k])) delete s.letture[k];
      else s.letture[k].pct = num(s.letture[k].pct, 0, 0, 100);
    });
    return s;
  }

  /* The syllabus of a language can be reordered: the old saves are
     renumbered by the language (LANG.rules.save.syllabus), once. */
  function migrateSyllabus(s) {
    return SAVE.syllabus ? SAVE.syllabus(s) : s;
  }

  /* A save as it comes (from the phone or from a backup file) through every
     upgrade: the syllabus renumbering, the language's own (a goal scale…),
     the sanitizer and the cards to FSRS.  Loading and restoring a copy go
     the same way. */
  function fromRaw(obj) {
    var s = migrateSyllabus(obj);
    if (SAVE.load) s = SAVE.load(s);
    s = sanitize(s);
    // The SM-2 cards get a stability and a difficulty (nothing is lost).
    if (s.srsV !== 2) {
      Object.keys(s.cards).forEach(function (id) { upgradeCard(s.cards[id]); });
      s.srsV = 2;
    }
    return s;
  }
  // A save that could not be read was kept aside: the learner can download it.
  function damaged() {
    try { return root.localStorage.getItem(KEY + ".damaged"); } catch (e) { return null; }
  }
  function load() {
    var raw = null;
    try {
      raw = root.localStorage && root.localStorage.getItem(KEY);
      if (!raw) return blankSave();
      return fromRaw(JSON.parse(raw));
    } catch (e) {
      // Unreadable: keep a copy aside before a new save overwrites it.
      try { if (raw) root.localStorage.setItem(KEY + ".damaged", raw); } catch (e2) { /* */ }
      return blankSave();
    }
  }

  function save(state) {
    try {
      root.localStorage.setItem(KEY, JSON.stringify(state));
      return true;
    } catch (e) {
      return false;
    }
  }

  function dayKey(d) {
    d = d || new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }

  // Whole calendar days between two day keys (b - a).
  function daysBetween(a, b) {
    function parse(k) {
      var p = k.split("-");
      return Date.UTC(+p[0], +p[1] - 1, +p[2]);
    }
    return Math.round((parse(b) - parse(a)) / DAY);
  }

  /* The streak counts consecutive calendar days, not sessions.  A shield
     covers each missed day, so one bad day at work doesn't wipe a month. */
  /* The streak as it really is when the app opens, not when the first
     answer comes: missed days the shields cover keep it (they are spent on
     the first answer, touchStreak); more than that and it ends now, so the
     header does not say 140 while the card says «you are back after 9
     days».  The shields are not wasted on a streak they cannot save. */
  /* The weekly wild card (plan 1.3): each calendar week one missed day does
     not break the streak and costs no shield.  What the missed days cost:
     the wild card for the first one (if that week's is unspent) and a shield
     for each of the rest.  state.jokerWeek: the week whose wild card went. */
  function coverPlan(state, nowKey) {
    var missed = Math.max(0, daysBetween(state.lastPlayed, nowKey) - 1), joker = 0;
    if (missed > 0) {
      var p = String(state.lastPlayed).split("-");
      var first = new Date(+p[0], +p[1] - 1, +p[2] + 1, 12);
      if (state.jokerWeek !== weekKey(first)) joker = 1;
      return { missed: missed, joker: joker, shields: missed - joker, week: weekKey(first) };
    }
    return { missed: 0, joker: 0, shields: 0, week: null };
  }
  // Is this week's wild card still there?
  function jokerLeft(state, now) { return state.jokerWeek !== weekKey(now || new Date()); }
  function checkStreak(state, now) {
    now = now || new Date();
    if (!state.lastPlayed || !state.streak) return { status: "ok" };
    var gap = daysBetween(state.lastPlayed, dayKey(now)), missed = gap - 1;
    if (gap <= 1) return { status: "ok" };
    var plan = coverPlan(state, dayKey(now));
    if (plan.shields <= (state.shields || 0)) return { status: "saved", missed: missed, joker: !!plan.joker };
    var prev = state.streak;
    state.bestStreak = Math.max(state.bestStreak || 0, prev);
    state.streakBroken = { n: prev, at: dayKey(now), missed: missed };
    state.streak = 0;
    return { status: "lost", missed: missed, prev: prev };
  }
  function touchStreak(state, now) {
    var t = dayKey(now);
    if (state.lastPlayed === t) return state.streak;
    var gap = state.lastPlayed ? daysBetween(state.lastPlayed, t) : 99;
    // The phone's clock went back (manual change, travel): keep the streak.
    if (gap < 0) return state.streak;
    var missed = gap - 1, plan = gap > 1 && state.lastPlayed ? coverPlan(state, t) : null;
    if (gap === 1) state.streak += 1;
    else if (plan && missed > 0 && plan.shields <= (state.shields || 0) && state.streak > 0) {
      if (plan.joker) state.jokerWeek = plan.week;
      if (plan.shields > 0) { state.shields -= plan.shields; state.shieldUsed = t; }
      state.streak += 1;
    } else state.streak = 1;
    // Every 7 days of streak earns a shield (max 3 in the pocket).
    if (state.streak % 7 === 0) state.shields = Math.min(3, (state.shields || 0) + 1);
    if (state.streak > (state.bestStreak || 0)) state.bestStreak = state.streak;
    state.lastPlayed = t;
    return state.streak;
  }

  // XP earned today, and whether today's goal has just been reached.
  function addXp(state, n, now) {
    var k = dayKey(now);
    if (!state.days) state.days = {};
    var before = state.days[k] || 0;
    state.days[k] = before + n;
    state.xp += n;
    var goal = goalFor(state, now);
    return before < goal && state.days[k] >= goal;
  }

  function todayXp(state, now) {
    return (state.days || {})[dayKey(now)] || 0;
  }

  // The last n days as [{key, xp}] from oldest to today.
  function lastDays(state, n, now) {
    var out = [], base = now || new Date();
    for (var i = n - 1; i >= 0; i--) {
      // Calendar arithmetic, not 24 h steps: DST days have 23 or 25 hours.
      var k = dayKey(new Date(base.getFullYear(), base.getMonth(), base.getDate() - i, 12));
      out.push({ key: k, xp: (state.days || {})[k] || 0 });
    }
    return out;
  }

  /* El cofre: una vez por día, cumplida la meta, un premio sorpresa.  La
     variedad es lo que hace volver. */
  function openChest(state, rnd, now) {
    var k = dayKey(now);
    if (state.chest === k) return null;
    if (todayXp(state, now) < goalFor(state, now)) return null;
    state.chest = k;
    var r = (rnd || Math.random)();
    var prize;
    if (r < 0.15 && (state.shields || 0) < 3) {
      state.shields = (state.shields || 0) + 1;
      prize = { kind: "shield", label: "🛡️ ¡Un escudo de racha!" };
    } else if (r < 0.35) {
      prize = { kind: "xp", xp: 50, label: "💎 ¡Premio gordo: +50 xp!" };
    } else if (r < 0.6) {
      state.boost = (state.boost || 0) + 1;
      prize = { kind: "boost", label: "🎟️ ¡Doble xp en tu próxima ronda!" };
    } else {
      var n = 10 + Math.floor((rnd || Math.random)() * 4) * 5;
      prize = { kind: "xp", xp: n, label: "✨ +" + n + " xp" };
    }
    if (prize.xp) state.xp += prize.xp;
    state.coins = (state.coins || 0) + 1;
    return prize;
  }

  /* The ranks: a title for each stage, from tourist to native speaker
     (LANG.rules.ranks: [level, title], calibrated on a whole career by
     tools/lib/sim_carriera.js: the whole course reaches level 40). */
  var RANKS = R.ranks && R.ranks.length ? R.ranks : [[1, "1"]];
  function rankFor(level) {
    var r = RANKS[0][1];
    RANKS.forEach(function (x) { if (level >= x[0]) r = x[1]; });
    return r;
  }

  /* ----------------------------------------------------------------- badge */

  // The last episode of Martín's story (letture.js), ep13 if it is not loaded.
  function lastMartin() {
    var L = root.Letture, eps = L && L.ofSeries ? L.ofSeries("martin") : [];
    return eps.length ? eps[eps.length - 1].id : "ep13";
  }

  var BADGES = [
    { id: "primo-passo",
      test: function (s) { return s.totals.attempts >= 1; } },
    { id: "centurione",
      test: function (s) { return s.totals.right >= 100; } },
    { id: "mille",
      test: function (s) { return s.totals.right >= 1000; } },
    { id: "settimana",
      test: function (s) { return s.streak >= 7; } },
    { id: "mese",
      test: function (s) { return s.streak >= 30; } },
    { id: "a2",
      test: function (s) { return !!(s.weekStats[13] || {}).bossPassed; } },
    { id: "b1",
      test: function (s) { return !!(s.weekStats[26] || {}).bossPassed; } },
    { id: "b2",
      test: function (s) { return !!(s.weekStats[39] || {}).bossPassed; } },
    { id: "c1",
      test: function (s) { return !!(s.weekStats[52] || {}).bossPassed; } },
    { id: "congiuntivo",
      test: function (s) { return (s.weekStats[39] || {}).perfect === true; } },
    { id: "sfidante",
      test: function (s) { return Object.keys(s.challengeLog).length >= 50; } },
    { id: "studioso",
      test: function (s) { return Object.keys(s.read || {}).length >= 10; } },
    { id: "erudito",
      test: function (s) { return Object.keys(s.read || {}).length >= 52; } },
    { id: "penna",
      test: function (s) { return (s.written || 0) >= 1; } },
    { id: "scrittore",
      test: function (s) { return (s.written || 0) >= 100; } },
    { id: "fulmine",
      test: function (s) { return ((s.best || {}).lampo || 0) >= 20; } },
    { id: "frasario",
      test: function (s) {
        return Object.keys(s.cards).filter(function (k) {
          return k.indexOf("frase:") === 0;
        }).length >= 100;
      } },
    { id: "lettore",
      test: function (s) { return Object.keys(s.letture || {}).length >= 5; } },
    { id: "bologna",
      test: function (s) { return !!(s.letture || {})[lastMartin()]; } },
    { id: "umanista",
      test: function (s) {
        return Object.keys(s.letture || {}).filter(function (k) {
          return k.indexOf("c-") === 0;
        }).length >= 10;
      } },
    { id: "ponte",
      test: function (s) {
        return Object.keys(s.cards).filter(function (k) {
          return k.indexOf("ponte:") === 0;
        }).length >= 50;
      } },
    { id: "perfetta",
      test: function (s) { return Object.keys(s.perfectWeeks || {}).length >= 1; } },
    { id: "dieci-perfette",
      test: function (s) { return Object.keys(s.perfectWeeks || {}).length >= 10; } },
    { id: "equilibrio",
      test: function (s) { return !!s.balancedDay; } },
    { id: "cinquecento",
      test: function (s) {
        return Object.keys(s.cards).filter(function (k) { return k.indexOf("v:") === 0 || k.indexOf("b:voc:") === 0; }).length >= 500;
      } },
    { id: "giornaliera",
      test: function (s) { return (s.dailyWon || 0) >= 10; } },
    { id: "costante",
      test: function (s) {
        var g = goalValue(s.goal || 200);
        return Object.keys(s.days || {}).filter(function (k) {
          return s.days[k] >= g;
        }).length >= 5;
      } }
  ];

  // Names and descriptions come from the language: LANG.rules.badges[id] = [name, desc].
  BADGES.forEach(function (b) {
    var t = (R.badges || {})[b.id] || [b.id, ""];
    b.name = t[0];
    b.desc = t[1];
  });

  function checkBadges(state) {
    var won = [];
    BADGES.forEach(function (b) {
      if (state.badges.indexOf(b.id) < 0 && b.test(state)) {
        state.badges.push(b.id);
        won.push(b);
      }
    });
    return won;
  }

  var api = {
    VERDICT: VERDICT,
    XP: XP,
    BADGES: BADGES,
    normalise: normalise,
    deaccent: deaccent,
    editDistance: editDistance,
    grade: grade,
    schedule: schedule,
    isDue: isDue,
    retired: retired,
    ratingFor: ratingFor,
    cardKind: cardKind,
    upgradeCard: upgradeCard,
    retrievability: retrievability,
    intervalFor: intervalFor,
    nextMorning: nextMorning,
    fitSpeed: fitSpeed,
    maybeFit: maybeFit,
    memoryStats: memoryStats,
    noteProduction: noteProduction,
    consolidated: consolidated,
    noteSession: noteSession,
    sessionsToday: sessionsToday,
    weekKey: weekKey,
    weekStreak: weekStreak,
    daysAway: daysAway,
    newWordsThisWeek: newWordsThisWeek,
    subGoals: subGoals,
    noteRecord: noteRecord,
    freshStart: freshStart,
    RETENTIONS: RETENTIONS,
    MAINT_S: MAINT_S,
    goalFor: goalFor,
    goalValue: goalValue,
    GOAL_SCALE: GOAL_SCALE,
    STRANDS: STRANDS,
    addStrand: addStrand,
    strandsLast: strandsLast,
    levelFor: levelFor,
    xpFor: xpFor,
    xpText: xpText,
    written: written,
    enqueue: enqueue,
    blankSave: blankSave,
    load: load,
    sanitize: sanitize,
    migrateSyllabus: migrateSyllabus,
    save: save,
    touchStreak: touchStreak, checkStreak: checkStreak, coverPlan: coverPlan, jokerLeft: jokerLeft, fromRaw: fromRaw, damaged: damaged, SAVE_V: SAVE_V, MODULE_OBJ: MODULE_OBJ, MODULE_ARR: MODULE_ARR,
    dayKey: dayKey,
    passed: passed, passMissing: passMissing, FLOOR2: FLOOR2,
    daysBetween: daysBetween,
    addXp: addXp,
    todayXp: todayXp,
    lastDays: lastDays,
    openChest: openChest,
    rankFor: rankFor,
    RANKS: RANKS,
    checkBadges: checkBadges,
    STORAGE_KEY: KEY
  };

  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Engine = api;
})(typeof window !== "undefined" ? window : globalThis);
