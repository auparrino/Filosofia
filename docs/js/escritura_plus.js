/*
 * Escritura plus: dos prácticas de escritura al lado del texto de la semana
 * (Scrivi / Escreva, que no cambia).
 *
 * 1. Tres vueltas (4/3/2 escrito).  El mismo texto corto (la consigna de la
 *    semana, 40-80 palabras) escrito tres veces con menos tiempo cada vez:
 *    5, 4 y 3 minutos.  Entre vuelta y vuelta, el corrector propio del
 *    idioma (Scrivi.check) marca lo que ve; al final, la comparación de las
 *    tres vueltas: palabras, errores, estructuras pedidas y palabras por
 *    minuto.  Es la adaptación escrita del 4/3/2 de Nation (Nation 1989;
 *    Arevart & Nation 1991): repetir el mismo contenido con presión de
 *    tiempo gana fluidez sin perder precisión.
 *
 * 2. Reformulación.  El alumno escribe y recibe su mismo texto reescrito
 *    como lo diría un nativo (con la IA si hay clave, por la misma vía que
 *    el corrector: Scrivi.llm y el prompt del paquete; sin clave, con las
 *    correcciones del corrector propio aplicadas y el texto modelo de la
 *    semana).  No se marca ningún error: el alumno compara y toca las
 *    palabras que cambiaron, y cada diferencia que encuentra va al repaso
 *    como tarjeta («ep:…»).  Es la reformulación como retroalimentación
 *    (Swain 1998, output y noticing; Lázaro Ibarrola 2009: los alumnos
 *    notan y retienen más de lo que buscan ellos mismos).
 *
 * El núcleo no nombra un idioma: el prompt de la reformulación vive en el
 * paquete (window.ESCRITURA_PLUS_DATA, docs/lang/<código>/escritura_plus_data.js)
 * y el corrector es el Scrivi del paquete.  La lógica (medir, comparar,
 * alinear dos textos, aplicar el corrector, armar tarjetas) no usa el DOM
 * y se prueba en node (tools/lib/test_escritura_plus.js); render/wire
 * dibujan las pantallas dentro de app.js con lo que les pasa en «host».
 */
(function (root) {
  "use strict";

  function Scrivi() { return root.Scrivi || null; }
  function DATA() { return root.ESCRITURA_PLUS_DATA || {}; }

  var SECS = [300, 240, 180];        // 5, 4 y 3 minutos
  var MIN_REF = 12;                  // palabras mínimas para pedir la reformulación

  /* ------------------------------------------------------------ la consigna */

  // The task of the week; a boss week (no text of its own) takes the last one.
  function taskWeek(week) {
    var S = Scrivi();
    if (!S || !S.TASKS) return 0;
    for (var w = Math.min(52, +week || 1); w >= 1; w--) if (S.TASKS[w]) return w;
    var ws = Object.keys(S.TASKS).map(Number).sort(function (a, b) { return a - b; });
    return ws[0] || 0;
  }
  function taskFor(week) {
    var S = Scrivi(), w = taskWeek(week);
    return w ? S.TASKS[w] : null;
  }
  // The target length: between 40 and 80 words, the week's minimum if higher.
  function goalWords(week) {
    var t = taskFor(week);
    return Math.max(40, Math.min(80, (t && t.min) || 40));
  }

  /* --------------------------------------------------------------- medir */

  function wordCount(text) {
    return (String(text || "").match(/[A-Za-zÀ-ÖØ-öø-ÿ0-9]+(?:['’][A-Za-zÀ-ÖØ-öø-ÿ]+)*/g) || []).length;
  }

  /* One round measured with the language's own checker: words, errors
     (the hard findings), the structures the task asks for (how many of the
     requirements are met and how many structures were used in total) and
     words per minute. */
  function measure(text, week, secs) {
    var S = Scrivi(), tw = taskWeek(week);
    var r = S ? S.check(String(text || ""), tw || week) : { words: wordCount(text), reqs: [], findings: [] };
    var uses = (r.reqs || []).filter(function (q) { return q.id; });
    var words = r.words != null ? r.words : wordCount(text);
    var hard = (r.findings || []).filter(function (f) { return !f.soft; });
    return {
      words: words,
      errors: hard.length,
      soft: (r.findings || []).length - hard.length,
      structs: uses.reduce(function (a, q) { return a + Math.min(q.n, 99); }, 0),
      reqsOk: uses.filter(function (q) { return q.ok; }).length,
      reqsN: uses.length,
      wpm: secs ? Math.round(words / (secs / 60) * 10) / 10 : 0,
      secs: secs || 0,
      check: r
    };
  }

  /* The comparison of the rounds: each measure, first and last, and a
     sentence for each (in rioplatense Spanish, voseo). */
  function compare(rounds) {
    var rs = (rounds || []).filter(Boolean);
    if (!rs.length) return { rows: [], lines: [] };
    var a = rs[0], z = rs[rs.length - 1];
    var row = function (k, label, better) {
      var vals = rs.map(function (x) { return x[k]; }), d = Math.round((z[k] - a[k]) * 10) / 10;
      return { k: k, label: label, vals: vals, delta: d, good: better > 0 ? d > 0 : d < 0, same: d === 0 };
    };
    var rows = [row("words", "Palabras", 1), row("errors", "Errores marcados", -1),
                row("structs", "Estructuras pedidas usadas", 1), row("wpm", "Palabras por minuto", 1)];
    var lines = [];
    var dw = z.words - a.words, de = z.errors - a.errors, ds = z.structs - a.structs;
    lines.push(dw > 0 ? "Con dos minutos menos escribiste " + dw + (dw === 1 ? " palabra más" : " palabras más") + "."
             : dw === 0 ? "Con dos minutos menos escribiste lo mismo: " + z.words + " palabras."
             : "Con dos minutos menos escribiste " + (-dw) + (dw === -1 ? " palabra menos" : " palabras menos") + ", y está bien: el tiempo apretaba.");
    lines.push(de < 0 ? "Bajaste de " + a.errors + " a " + z.errors + (z.errors === 1 ? " error" : " errores") + ": lo que viste entre vueltas quedó."
             : de === 0 ? (z.errors ? "Los errores quedaron en " + z.errors + ": mirá cuáles se repiten, son los que más valen." : "Ningún error marcado en ninguna vuelta.")
             : "Subieron los errores (" + a.errors + " → " + z.errors + "): con prisa aparecen los automatismos que faltan. Revisá cuáles son.");
    if (a.reqsN) lines.push(ds > 0 ? "Usaste " + ds + " estructuras pedidas más que en la primera vuelta."
      : ds === 0 ? "Las estructuras pedidas: igual que en la primera vuelta (" + z.structs + ")."
      : "Usaste menos estructuras pedidas (" + a.structs + " → " + z.structs + "): la próxima, metelas desde el principio.");
    lines.push("Velocidad: " + a.wpm + " → " + z.wpm + " palabras por minuto.");
    return { rows: rows, lines: lines };
  }

  /* ----------------------------------------------- dos textos, alineados */

  function normTok(t) {
    return String(t || "").toLowerCase().replace(/[’‘`´]/g, "'").replace(/^[^A-Za-zÀ-ÖØ-öø-ÿ0-9']+|[^A-Za-zÀ-ÖØ-öø-ÿ0-9']+$/g, "").replace(/^'+|'+$/g, "");
  }
  // The units the learner taps: what is between spaces, with its punctuation.
  function split(text) {
    return String(text || "").replace(/[’‘`´]/g, "'").split(/\s+/).filter(function (t) { return t && normTok(t); });
  }

  /* diff(mine, native): the native text in tappable units and the chunks
     where it differs from the learner's (a word-level LCS).  A chunk is a
     run of native units that are not in the learner's text, with what the
     learner wrote in its place; what the learner wrote and the native text
     drops is attached to the next native unit (so it can be tapped). */
  function diff(mine, native) {
    var A = split(mine), B = split(native);
    var a = A.map(normTok), b = B.map(normTok), n = a.length, m = b.length;
    var L = [];
    for (var i = 0; i <= n; i++) { L.push(new Array(m + 1)); for (var j = 0; j <= m; j++) L[i][j] = 0; }
    for (var i2 = n - 1; i2 >= 0; i2--) for (var j2 = m - 1; j2 >= 0; j2--)
      L[i2][j2] = a[i2] === b[j2] ? L[i2 + 1][j2 + 1] + 1 : Math.max(L[i2 + 1][j2], L[i2][j2 + 1]);
    // Walk the alignment: runs of changes between matches.
    var runs = [], cur = null, x = 0, y = 0;
    var open = function () { if (!cur) cur = { nat: [], mine: [] }; };
    var close = function (nextMatch, nextMine) { if (cur) { cur.next = nextMatch; cur.nextMine = nextMine; runs.push(cur); cur = null; } };
    while (x < n || y < m) {
      if (x < n && y < m && a[x] === b[y]) { close(y, x); x++; y++; }
      else if (y < m && (x >= n || L[x][y + 1] >= L[x + 1][y])) { open(); cur.nat.push(y); y++; }
      else { open(); cur.mine.push(x); x++; }
    }
    close(-1);
    var owner = {}, chunks = [];
    runs.forEach(function (r) {
      var nat = r.nat.slice(), mineW = r.mine.map(function (k) { return A[k]; });
      if (!nat.length) {
        // Only dropped words: the next native unit carries them (or the last one).
        var at = r.next >= 0 ? r.next : m - 1;
        if (at < 0) return;
        if (owner[at] != null) { var c0 = chunks[owner[at]]; c0.mine = c0.mine.concat(mineW); return; }
        nat = [at];
        mineW = r.next >= 0 ? mineW.concat([A[r.nextMine]]) : [B[at]].concat(mineW);
      }
      var k = chunks.length;
      chunks.push({ from: nat[0], to: nat[nat.length - 1] + 1, mine: mineW });
      nat.forEach(function (t) { owner[t] = k; });
    });
    chunks.forEach(function (c) {
      for (var t = c.from; t < c.to; t++) owner[t] = chunks.indexOf(c);
      c.nat = trimPunct(B.slice(c.from, c.to).join(" "));
      c.mineText = trimPunct(c.mine.join(" "));
    });
    return { mine: A, nat: B, chunks: chunks, owner: owner, same: !chunks.length };
  }
  function trimPunct(s) {
    return String(s || "").replace(/^[^A-Za-zÀ-ÖØ-öø-ÿ0-9']+|[^A-Za-zÀ-ÖØ-öø-ÿ0-9']+$/g, "").trim();
  }

  /* ----------------------------------------- sin clave: el corrector propio */

  /* The learner's text with the corrections of the language's own checker
     applied, where a finding says what goes instead («*a la* se escribe
     junto: *alla casa*», «en portugués: *eu*»).  Only the hard findings;
     a message without a replacement (a word it does not know) is left. */
  var INF = null;
  function isInf(w) {
    if (!INF) {
      INF = {};
      var C = root.Conj;
      try { (C && C.list ? C.list() : []).forEach(function (v) { INF[String(v).toLowerCase()] = 1; }); } catch (e) { /* sin conjugador */ }
    }
    return !!INF[String(w || "").toLowerCase()];
  }
  function fixOf(f, src, tk) {
    if (!f || f.soft || !f.msg) return null;
    var msg = String(f.msg), its = msg.match(/\*[^*]+\*/g) || [];
    if (!its.length || /revisá|no conozco/i.test(msg)) return null;
    // the replacement: the first italic right after «:», «→», «se dice»,
    // «en italiano / en portugués»… («*de* es español: en italiano *di* (o *da*)» → di)
    var fix = null, re = /\*([^*]+)\*/g, mm;
    while ((mm = re.exec(msg))) {
      if (/(:|→|se dice|se escribe|decí|\bes|\ben [a-zà-ú]+)\s*$/i.test(msg.slice(0, mm.index))) { fix = mm[1].trim(); break; }
    }
    // a pattern, not a replacement: «em + o», «Ao (à, aos, às)», «preferir X a Y»
    if (!fix || /[…\/+()=]|\.\.\./.test(fix) || /\s[A-Z]\b/.test(fix) || fix.split(/\s+/).length > 5) return null;
    // the span on the text, grown over the words the fix repeats around it
    var ws = [], k;
    for (k = 0; k < tk.length; k++) if (tk[k].w) ws.push(k);
    var first = ws.indexOf(f.i), last = ws.indexOf(f.i + f.n - 1);
    if (first < 0) return null;
    if (last < 0) last = first;
    var fw = fix.toLowerCase().split(/\s+/);
    var spanW = function () { return ws.slice(first, last + 1).map(function (q) { return tk[q].w; }); };
    // «Il» → «mio padre» when the text goes on «mio padre»: absorb the words after
    for (var g = fw.length; g >= 1; g--) {
      var tail = fw.slice(fw.length - g), ok = true;
      for (var h = 0; h < g; h++) if (!ws[last + 1 + h] || tk[ws[last + 1 + h]].w !== tail[h]) ok = false;
      if (ok && fw.slice(0, fw.length - g).join(" ") !== spanW().join(" ")) { last += g; break; }
    }
    for (var g2 = 1; g2 < fw.length; g2++) {
      var head = fw.slice(0, g2), ok2 = true;
      for (var h2 = 0; h2 < g2; h2++) if (first - g2 + h2 < 0 || tk[ws[first - g2 + h2]].w !== head[h2]) ok2 = false;
      if (ok2) { first -= g2; break; }
    }
    var a = tk[ws[first]], z = tk[ws[last]];
    var orig = src.slice(a.at, z.at + z.len);
    if (orig.toLowerCase() === fix.toLowerCase()) return null;
    // glued to an elision (l'ho): the replacement would not fit
    if (a.at > 0 && src.charAt(a.at - 1) === "'") return null;
    // a spelling hint («llamas» → «lh»), not a word
    if (fix.length <= 2 && orig.length > 4) return null;
    // the dictionary form of a verb for a conjugated one («miro» → «guardare»):
    // a meaning, not the word that goes in the text
    var f0 = fw[0], o0 = orig.toLowerCase().split(/\s+/)[0];
    if (isInf(f0) && f0.slice(-1) !== o0.slice(-1)) return null;
    if (a.start || /^[A-ZÀ-Ý]/.test(orig)) fix = fix.charAt(0).toUpperCase() + fix.slice(1);
    return { at: a.at, end: z.at + z.len, from: orig, to: fix };
  }
  function localRewrite(text, week) {
    var S = Scrivi(), src = String(text || "").replace(/[’‘`´]/g, "'");
    if (!S) return { text: src, changes: [] };
    var r = S.check(src, taskWeek(week) || week), tk = S.toks(src);
    var fixes = (r.findings || []).map(function (f) { return fixOf(f, src, tk); }).filter(Boolean)
      .sort(function (p, q) { return p.at - q.at; });
    var keep = [], end = -1;
    fixes.forEach(function (f) { if (f.at >= end) { keep.push(f); end = f.end; } });
    var out = src;
    for (var k = keep.length - 1; k >= 0; k--) {
      var f = keep[k];
      out = out.slice(0, f.at) + f.to + out.slice(f.end);
      out = contract(out, f.at, f.at + f.to.length, k ? keep[k - 1].end : 0);
    }
    return { text: out, changes: keep };
  }
  /* Two fixes side by side can leave a preposition and an article apart
     («de» → «di» + «mio» → «il mio»: «di il mio»): they are joined with the
     language's contractions (LANG.rules.banca.contr), only at the edges of
     a fix. */
  function contract(s, a, z, lo) {
    var L = root.LANG, c = L && L.rules && L.rules.banca && L.rules.banca.contr;
    if (!c) return s;
    var re = /[A-Za-zÀ-ÖØ-öø-ÿ]+'?/g, m, ws = [];
    while ((m = re.exec(s))) ws.push({ w: m[0], at: m.index, end: m.index + m[0].length });
    for (var i = ws.length - 2; i >= 0; i--) {
      var x = ws[i], y = ws[i + 1];
      if (!/^\s+$/.test(s.slice(x.end, y.at))) continue;             // only a space between
      if (y.end <= a || x.at >= z) continue;                           // one of the two is in the fix
      if (x.at < lo) continue;                                         // an earlier fix: not touched
      var form = c[x.w.toLowerCase()] && c[x.w.toLowerCase()][y.w.toLowerCase()];
      if (!form) continue;
      if (/^[A-ZÀ-Ý]/.test(x.w)) form = form.charAt(0).toUpperCase() + form.slice(1);
      s = s.slice(0, x.at) + form + s.slice(y.end);
    }
    return s;
  }

  /* ------------------------------------------------ al repaso: tarjetas */

  function hash(s) {
    var h = 5381;
    s = String(s);
    for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
    return h.toString(36);
  }
  // The sentence of the native text around a chunk, with the chunk as a gap.
  function sentenceAround(units, from, to) {
    var s = from, e = to - 1;
    while (s > 0 && !/[.!?…]["»”)]*$/.test(units[s - 1])) s--;
    while (e < units.length - 1 && !/[.!?…]["»”)]*$/.test(units[e])) e++;
    // a very long sentence: eight units around the gap
    if (e - s > 24) { s = Math.max(s, from - 8); e = Math.min(e, to - 1 + 8); }
    var pre = units.slice(s, from).join(" "), post = units.slice(to, e + 1).join(" ");
    var chunk = units.slice(from, to).join(" ");
    var lead = (/^[^A-Za-zÀ-ÖØ-öø-ÿ0-9']+/.exec(chunk) || [""])[0];
    var trail = (/[^A-Za-zÀ-ÖØ-öø-ÿ0-9']+$/.exec(chunk) || [""])[0];
    var stem = [pre, lead + "___" + trail, post].filter(function (x) { return x; }).join(" ");
    var full = units.slice(s, e + 1).join(" ");
    return { stem: stem, full: full };
  }
  /* The card of one chunk: what the learner wrote, what the native text
     says, the native sentence with the gap. */
  function cardFor(d, k, meta) {
    var c = d.chunks[k];
    if (!c || !c.nat) return null;
    var sa = sentenceAround(d.nat, c.from, c.to);
    meta = meta || {};
    return { id: "ep:" + hash(sa.stem + "|" + c.nat), m: c.mineText, n: c.nat, s: sa.stem, f: sa.full,
             w: meta.week || 0, src: meta.src || "ia", at: meta.at || Date.now() };
  }
  // A chunk of the week's model the learner picked (units from..to).
  function modelCard(units, from, to, meta) {
    var nat = trimPunct(units.slice(from, to).join(" "));
    if (!nat) return null;
    var sa = sentenceAround(units, from, to);
    meta = meta || {};
    return { id: "ep:" + hash(sa.stem + "|" + nat), m: "", n: nat, s: sa.stem, f: sa.full,
             w: meta.week || 0, src: "modelo", at: meta.at || Date.now() };
  }

  function store(state) {
    if (!state.escrituraPlus || typeof state.escrituraPlus !== "object") state.escrituraPlus = {};
    var s = state.escrituraPlus;
    if (!s.cards || typeof s.cards !== "object") s.cards = {};
    if (!s.tre || typeof s.tre !== "object") s.tre = {};
    if (!s.rif || typeof s.rif !== "object") s.rif = {};
    return s;
  }
  // The next morning at seven: noticed today, retrieved tomorrow.
  function tomorrow(now) {
    var d = new Date(now || Date.now());
    d.setDate(d.getDate() + 1);
    d.setHours(7, 0, 0, 0);
    return d.getTime();
  }
  /* Into the review: the card's content in state.escrituraPlus.cards and
     a new SRS card in state.cards, due tomorrow morning. */
  function addCards(state, cards, now) {
    var s = store(state), added = 0;
    if (!state.cards) state.cards = {};
    (cards || []).forEach(function (c) {
      if (!c || !c.id || !c.n) return;
      s.cards[c.id] = { m: String(c.m || "").slice(0, 160), n: String(c.n).slice(0, 160), s: String(c.s || "").slice(0, 400),
                        f: String(c.f || "").slice(0, 400), w: +c.w || 0, src: c.src || "ia", at: c.at || Date.now() };
      if (!state.cards[c.id]) {
        state.cards[c.id] = { reps: 0, ok: 0, seen: 0, lapses: 0, interval: 0, state: "learn", due: tomorrow(now) };
        added++;
      }
    });
    return added;
  }

  /* The review item of a card: the native sentence with the gap, and what
     the learner wrote in its place as the cue (no «wrong»: another way). */
  function reviewItem(id, state) {
    var c = state && state.escrituraPlus && state.escrituraPlus.cards && state.escrituraPlus.cards[id];
    if (!c || !c.n || !c.s) return null;
    var prompt = c.src === "modelo" ? "Del texto modelo: completá como lo escribió un nativo"
      : c.m ? "Vos escribiste «" + c.m + "». Un nativo lo dijo así: completá"
      : "Un nativo agregó algo que vos no pusiste: completá";
    return { id: id, src: "eplus", type: "typed", prompt: prompt, stem: c.s, answer: c.n, accept: [c.n],
             note: (c.m ? "Tu versión: «" + c.m + "» · " : "") + "Como lo diría un nativo: «" + c.n + "».", say: c.f, context: c.f };
  }

  /* ------------------------------------------------ la reformulación con IA */

  function aiPrompt(text, ctx) {
    var P = DATA().prompt;
    return typeof P === "function" ? P(text, ctx || {}) : null;
  }
  // The native version from the AI: {testo} (or {texto}), cleaned.
  function aiText(data) {
    var t = data && (data.testo || data.texto || data.text || data.riscritto || data.reescrito);
    return t ? String(t).replace(/[’‘`´]/g, "'").replace(/\s+/g, " ").trim() : "";
  }
  function reformulate(text, ctx, keys, done) {
    var S = Scrivi(), p = aiPrompt(text, ctx);
    if (!S || !S.llm || !p) return done(new Error("sin IA"));
    S.llm(p, keys, function (err, data, meta) {
      if (err) return done(err);
      var t = aiText(data);
      if (!t) return done(new Error("respuesta vacía"));
      done(null, t, meta);
    });
  }

  /* ================================================================ la UI
     host: { state, week (la semana del curso), esc, mk, UI, persist, gain,
     toast, aiKeys(), aiKey(), lexicon(), back(), rerender() }. */

  var cur = null;     // la práctica en curso
  var timer = null;

  function start(mode, week) {
    stopTimer();
    cur = mode === "tre" ? { mode: "tre", week: week, step: "intro", round: 0, texts: [], ms: [] }
                         : { mode: "rif", week: week, step: "write", text: "" };
    return cur;
  }
  function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }
  function $(sel) { return root.document ? root.document.querySelector(sel) : null; }
  function mmss(s) { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ":" + (s % 60 < 10 ? "0" : "") + (s % 60); }

  function head(h, title) {
    var UI = h.UI || {};
    return '<button class="btn ghost" id="epback">← ' + ((UI.scrivi || "Texto") + " de la semana") + "</button>" +
      '<div class="card ep-head"><h2>' + title + "</h2>";
  }
  function taskBox(h) {
    var t = taskFor(cur.week) || { t: "", use: [] };
    return '<p class="ep-task">' + h.mk(t.t) + "</p>" +
      (t.use && t.use.length ? '<p class="muted small">Estructuras pedidas: ' + t.use.map(function (u) { return h.esc(u[2]); }).join(" · ") + "</p>" : "");
  }

  function render(h) {
    if (!cur || cur.week !== h.week.week) start(cur ? cur.mode : "tre", h.week.week);
    if (!taskFor(cur.week)) return '<button class="btn ghost" id="epback">← a la semana</button><p>No hay consigna todavía.</p>';
    return cur.mode === "tre" ? renderTre(h) : renderRif(h);
  }

  /* ------------------------------------------------------ tres vueltas */

  function renderTre(h) {
    var goal = goalWords(cur.week), esc = h.esc;
    var html = head(h, "⏱️ Tres vueltas: 5, 4 y 3 minutos") + taskBox(h);
    if (cur.step === "intro") {
      var last = store(h.state).tre[cur.week];
      return html + '<p>Vas a escribir <b>el mismo texto tres veces</b>, de unas <b>' + goal + " palabras</b>, cada vez con menos tiempo: " +
        "5 minutos, después 4 y después 3. Entre vuelta y vuelta, el corrector te muestra lo que ve; la vuelta siguiente la empezás en blanco.</p>" +
        '<p class="muted small">La idea es la del 4/3/2 (Nation): repetir lo mismo con el reloj encima te vuelve más fluido sin perder precisión. ' +
        "Escribí sin traductor y sin parar a buscar palabras.</p>" +
        (last ? '<p class="muted small">La última vez: ' + last.r.map(function (x) { return x.words + " palabras, " + x.errors + " errores"; }).join(" → ") + ".</p>" : "") +
        '<button class="btn" id="epgo">Empezar la vuelta 1 (5:00)</button></div>';
    }
    if (cur.step === "write") {
      var secs = SECS[cur.round];
      return html + '<div class="ep-timerrow"><span class="ep-round">Vuelta ' + (cur.round + 1) + " de 3</span>" +
        '<span class="ep-timer" id="eptimer">' + mmss(secs) + "</span></div></div>" +
        '<textarea id="eptext" class="grow scrivi" rows="8" spellcheck="false" autocapitalize="sentences" placeholder="' + esc((h.UI || {}).scriviIn || "") + '"></textarea>' +
        '<div class="row" style="margin-top:10px"><span class="muted small" id="epcount">0 / ' + goal + ' palabras</span>' +
        '<button class="btn" id="epstop">Listo</button></div>';
    }
    if (cur.step === "check") {
      var k = cur.round, m = cur.ms[k], r = m.check, text = cur.texts[k];
      var list = (r.findings || []).map(function (f, i) {
        return '<li class="' + (f.soft ? "soft" : "bad") + '"><b>' + (i + 1) + ".</b> " + h.mk(f.msg) + "</li>";
      }).join("");
      var S = Scrivi();
      html += "</div>" + '<div class="card"><h3>Vuelta ' + (k + 1) + ": " + m.words + " palabras en " + mmss(m.secs) + "</h3>" +
        (r.findings && r.findings.length ? '<p class="scrivi-marked it">' + S.markup(text, r.findings, esc) + '</p><ol class="findings">' + list + "</ol>"
          : "<p>✨ El corrector no marcó nada.</p>") +
        (r.reqs && r.reqs.length ? '<ul class="reqs">' + r.reqs.map(function (q) {
          return '<li class="' + (q.ok ? "ok" : "") + '">' + (q.ok ? "✓" : "○") + " " + esc(q.label) + ' <small class="muted">' + Math.min(q.n, 999) + " / " + q.need + "</small></li>";
        }).join("") + "</ul>" : "") +
        (k < 2 ? '<p class="muted small">Mirá bien lo marcado y lo que falta. La vuelta ' + (k + 2) + " arranca en blanco y con un minuto menos.</p>" +
                 '<button class="btn" id="epnext">Vuelta ' + (k + 2) + " (" + mmss(SECS[k + 1]) + ")</button>"
               : '<button class="btn" id="epcmp">Ver cuánto mejoraste</button>') + "</div>";
      return html;
    }
    // done: the comparison
    var cmp = compare(cur.ms);
    return html + "</div>" + '<div class="card"><h3>Cuánto mejoraste</h3><table class="res ep-cmp"><tr><th></th><th>1</th><th>2</th><th>3</th><th></th></tr>' +
      cmp.rows.map(function (row) {
        return "<tr><td>" + esc(row.label) + "</td>" + row.vals.map(function (v) { return "<td>" + v + "</td>"; }).join("") +
          '<td class="' + (row.same ? "" : row.good ? "ep-up" : "ep-down") + '">' + (row.same ? "=" : (row.delta > 0 ? "+" : "") + row.delta) + "</td></tr>";
      }).join("") + "</table>" +
      "<ul class=\"ep-lines\">" + cmp.lines.map(function (l) { return "<li>" + esc(l) + "</li>"; }).join("") + "</ul>" +
      '<details class="ep-texts"><summary>Tus tres versiones</summary>' + cur.texts.map(function (t, i) {
        return '<p class="muted small">Vuelta ' + (i + 1) + '</p><p class="it">' + esc(t) + "</p>";
      }).join("") + "</details>" +
      '<div class="row" style="margin-top:12px"><button class="btn" id="epagain">Otra vez</button><button class="tab" id="epback2">Volver</button></div></div>';
  }

  function finishRound(h, elapsed) {
    stopTimer();
    var box = $("#eptext"), text = box ? box.value : "";
    h.lexicon && h.lexicon();
    cur.texts[cur.round] = text.slice(0, 4000);
    cur.ms[cur.round] = measure(text, cur.week, Math.max(1, Math.round(elapsed)));
    cur.step = "check";
    h.rerender();
    if (root.scrollTo) root.scrollTo(0, 0);
  }

  function saveTre(h) {
    var s = store(h.state), first = !s.tre[cur.week];
    s.tre[cur.week] = { at: Date.now(), r: cur.ms.map(function (m) { return { words: m.words, errors: m.errors, structs: m.structs, wpm: m.wpm }; }) };
    // the errors of the last lap go to the error profile, once (F §2.2)
    var last = cur.ms[cur.ms.length - 1];
    if (h.recordFindings && last && last.check) h.recordFindings(last.check.findings || [], cur.texts[cur.texts.length - 1] || "");
    var xp = first ? 30 : 10;
    h.gain(xp);
    if (root.Engine) { root.Engine.addStrand(h.state, "output", xp); root.Engine.touchStreak(h.state); }
    h.persist();
    return xp;
  }

  function wireTre(h) {
    on("#epgo", function () { cur.round = 0; cur.step = "write"; h.rerender(); });
    on("#epnext", function () { cur.round++; cur.step = "write"; h.rerender(); if (root.scrollTo) root.scrollTo(0, 0); });
    on("#epcmp", function () { cur.step = "done"; var xp = saveTre(h); h.rerender(); if (root.scrollTo) root.scrollTo(0, 0); h.toast("⏱️ Tres vueltas hechas · +" + xp + " xp"); });
    on("#epagain", function () { start("tre", cur.week); h.rerender(); });
    on("#epback2", function () { stopTimer(); h.back(); });
    var box = $("#eptext");
    if (cur.step !== "write" || !box) return;
    var total = SECS[cur.round], t0 = Date.now(), goal = goalWords(cur.week);
    var tick = function () {
      var el = $("#eptimer");
      if (!el || !root.document.body.contains(box)) { stopTimer(); return; }
      var left = total - (Date.now() - t0) / 1000;
      el.textContent = mmss(left);
      el.classList.toggle("low", left <= 30);
      if (left <= 0) { box.readOnly = true; finishRound(h, total); }
    };
    stopTimer();
    timer = setInterval(tick, 250);
    box.addEventListener("input", function () {
      var c = $("#epcount");
      if (c) c.textContent = wordCount(box.value) + " / " + goal + " palabras";
    });
    on("#epstop", function () { finishRound(h, Math.min(total, (Date.now() - t0) / 1000)); });
    try { box.focus(); } catch (e) { /* */ }
  }

  /* ------------------------------------------------------ reformulación */

  function unitsHtml(units, owner, cls) {
    return units.map(function (u, i) {
      return '<span class="w' + (cls && cls[i] ? " " + cls[i] : "") + '" data-u="' + i + '">' + escHtml(u) + "</span>";
    }).join(" ");
  }
  function escHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function renderRif(h) {
    var esc = h.esc, html = head(h, "🪞 Reformulación: tu texto, como lo diría un nativo") + taskBox(h);
    if (cur.step === "write") {
      var draft = cur.text || (store(h.state).rif.draft || {})[cur.week] || "";
      return html + '<p class="muted small">Escribí tu texto. Después vas a ver <b>tu mismo texto reescrito como lo diría un nativo</b>, sin nada marcado: ' +
        "las diferencias las encontrás vos, tocándolas, y cada una va a tu repaso.</p></div>" +
        '<textarea id="eprtext" class="grow scrivi" rows="7" spellcheck="false" autocapitalize="sentences" placeholder="' + esc((h.UI || {}).scriviIn || "") + '">' + esc(draft) + "</textarea>" +
        '<div class="row" style="margin-top:10px"><button class="btn" id="eprgo">🪞 Reformular</button></div>' +
        '<p class="muted small">' + (h.aiKey() ? "🤖 Lo reescribe la IA con tu clave." : "Sin clave de IA: te muestro tu texto con los arreglos del corrector y el texto modelo de la semana.") + "</p>" +
        '<div id="eprmsg"></div>';
    }
    if (cur.step === "busy") return html + "</div><div class=\"card\"><p>⏳ Reescribiendo tu texto como lo diría un nativo…</p></div>";
    // compare
    var d = cur.diff, found = cur.found, n = d.chunks.length;
    var cls = {};
    d.nat.forEach(function (u, i) {
      var k = d.owner[i];
      if (k != null && found[k]) cls[i] = "on";
      else if (k != null && cur.revealed) cls[i] = "ep-missed";
    });
    var nf = Object.keys(found).length;
    html += "</div>" +
      '<div class="card"><h3>Tu texto</h3><p class="it ep-mine">' + esc(cur.text) + "</p></div>" +
      '<div class="card"><h3>' + (cur.src === "ia" ? "Como lo diría un nativo" : "Con los arreglos del corrector") + "</h3>" +
      (d.same ? "<p>" + (cur.src === "ia" ? "✨ Un nativo lo escribiría igual que vos." : "✨ El corrector no encontró nada que cambiar.") + "</p>" +
                '<p class="it">' + esc(cur.native) + "</p>"
        : '<p class="muted small">Compará las dos versiones y <b>tocá cada palabra que cambió</b>. Nada está marcado: encontralas vos.</p>' +
          '<div class="text hunt ep-diff it" id="eprnat">' + unitsHtml(d.nat, d.owner, cls) + "</div>" +
          '<p class="muted small" id="eprcount">' + countLine(nf, cur.misses) + "</p>" +
          (cur.revealed ? '<p class="muted small">Las subrayadas son las que no marcaste: no van al repaso.</p>' : "")) +
      (cur.meta ? '<p class="muted small modelline">IA: ' + esc(cur.meta.provider + " · " + cur.meta.model) + "</p>" : "") +
      (cur.aiErr ? '<p class="muted small">⚠️ No pude usar la IA (' + esc(cur.aiErr) + "): te muestro los arreglos del corrector.</p>" : "") +
      "</div>";
    // Without the AI, the week's model too: tap what you would like to have written.
    if (cur.src !== "ia") {
      var mu = split(taskFor(cur.week).model), mcls = {};
      Object.keys(cur.picked).forEach(function (i) { mcls[i] = "on"; });
      html += '<div class="card"><h3>Un texto modelo con la misma consigna</h3>' +
        '<p class="muted small">Así lo escribió un nativo. Tocá las palabras que te gustaría haber usado (varias seguidas forman una expresión): también van a tu repaso.</p>' +
        '<div class="text hunt ep-diff it" id="eprmodel">' + unitsHtml(mu, null, mcls) + "</div></div>";
    }
    var sent = cur.sent;
    html += '<div class="card">' + (sent != null
      ? "<p>✓ " + (sent ? sent + (sent === 1 ? " tarjeta nueva" : " tarjetas nuevas") + " en tu repaso: mañana te las pregunto." : "Nada nuevo para el repaso.") + "</p>" +
        (n && !cur.revealed && nf < n ? '<button class="tab" id="eprshow">Ver las que no encontré (' + (n - nf) + ")</button>" : "") +
        '<div class="row" style="margin-top:10px"><button class="btn" id="epragain">Escribir otro</button><button class="tab" id="epback2">Volver</button></div>'
      : '<button class="btn" id="eprsend">✓ Listo: mandar al repaso</button>') + "</div>";
    return html;
  }
  function countLine(nf, misses) {
    return (nf ? "Encontraste " + nf + (nf === 1 ? " diferencia" : " diferencias") : "Todavía ninguna marcada") +
      (misses ? " · " + misses + (misses === 1 ? " toque" : " toques") + " en palabras que estaban igual" : "") + ".";
  }

  function showCompare(h, native, src, meta, aiErr) {
    cur.native = native; cur.src = src; cur.meta = meta || null; cur.aiErr = aiErr || "";
    cur.diff = diff(cur.text, native);
    cur.found = {}; cur.picked = {}; cur.misses = 0; cur.revealed = false; cur.sent = null;
    cur.step = "compare";
    h.rerender();
  }

  function runRif(h) {
    var box = $("#eprtext"), text = box ? box.value.trim() : "";
    if (wordCount(text) < MIN_REF) {
      var msg = $("#eprmsg");
      if (msg) msg.innerHTML = '<p class="muted">Escribí al menos ' + MIN_REF + " palabras: con muy poco no hay qué reformular.</p>";
      return;
    }
    cur.text = text.slice(0, 4000);
    var s = store(h.state);
    if (!s.rif.draft) s.rif.draft = {};
    delete s.rif.draft[cur.week];
    h.persist();
    h.lexicon && h.lexicon();
    // what the checker sees in the text goes to the error profile (F §2.2)
    var S = Scrivi();
    if (h.recordFindings && S) h.recordFindings((S.check(cur.text, taskWeek(cur.week) || cur.week).findings || []), cur.text);
    var local = function (err) { showCompare(h, localRewrite(cur.text, cur.week).text, "local", null, err ? String(err.message || err) : ""); };
    if (!h.aiKey()) return local();
    cur.step = "busy";
    h.rerender();
    var mine = cur, w = h.week;
    reformulate(cur.text, { week: cur.week, level: w.level || "", task: taskFor(cur.week) }, h.aiKeys(), function (err, native, meta) {
      if (cur !== mine) return;
      if (err) return local(err);
      showCompare(h, native, "ia", meta);
    });
  }

  function sendRif(h) {
    var cards = [], meta = { week: cur.week, src: cur.src, at: Date.now() };
    Object.keys(cur.found).forEach(function (k) { var c = cardFor(cur.diff, +k, meta); if (c) cards.push(c); });
    // the model: runs of consecutive picked units, one card each
    if (cur.src !== "ia") {
      var mu = split(taskFor(cur.week).model), idx = Object.keys(cur.picked).map(Number).sort(function (a, b) { return a - b; });
      var runs = [];
      idx.forEach(function (i) { var r = runs[runs.length - 1]; if (r && r[1] === i) r[1] = i + 1; else runs.push([i, i + 1]); });
      runs.forEach(function (r) { var c = modelCard(mu, r[0], r[1], meta); if (c) cards.push(c); });
    }
    var added = addCards(h.state, cards);
    var s = store(h.state), first = !s.rif[cur.week];
    s.rif[cur.week] = { at: Date.now(), n: cur.diff.chunks.length, found: Object.keys(cur.found).length, src: cur.src };
    var xp = (first ? 20 : 5) + Math.min(20, 2 * added);
    h.gain(xp);
    if (root.Engine) { root.Engine.addStrand(h.state, "output", xp); root.Engine.touchStreak(h.state); }
    h.persist();
    cur.sent = added;
    h.rerender();
    h.toast("🪞 " + (added ? added + (added === 1 ? " tarjeta" : " tarjetas") + " al repaso · " : "") + "+" + xp + " xp");
  }

  function wireRif(h) {
    var box = $("#eprtext");
    if (box) box.addEventListener("input", function () {
      var s = store(h.state);
      if (!s.rif.draft) s.rif.draft = {};
      s.rif.draft[cur.week] = box.value.slice(0, 4000);
      cur.text = box.value;
    });
    on("#eprgo", function () { runRif(h); });
    on("#eprsend", function () { sendRif(h); });
    on("#eprshow", function () { cur.revealed = true; h.rerender(); });
    on("#epragain", function () { start("rif", cur.week); h.rerender(); });
    on("#epback2", function () { h.back(); });
    var nat = $("#eprnat");
    if (nat) Array.prototype.forEach.call(nat.querySelectorAll("[data-u]"), function (el) {
      el.onclick = function () {
        if (cur.sent != null) return;
        var i = +el.getAttribute("data-u"), k = cur.diff.owner[i];
        if (k == null) {
          cur.misses++;
          el.classList.remove("ep-nope"); void el.offsetWidth; el.classList.add("ep-nope");
        } else {
          if (cur.found[k]) delete cur.found[k]; else cur.found[k] = 1;
          var c = cur.diff.chunks[k];
          for (var t = c.from; t < c.to; t++) {
            var u = nat.querySelector('[data-u="' + t + '"]');
            if (u) u.classList.toggle("on", !!cur.found[k]);
          }
        }
        var cnt = $("#eprcount");
        if (cnt) cnt.textContent = countLine(Object.keys(cur.found).length, cur.misses);
      };
    });
    var mod = $("#eprmodel");
    if (mod) Array.prototype.forEach.call(mod.querySelectorAll("[data-u]"), function (el) {
      el.onclick = function () {
        if (cur.sent != null) return;
        var i = +el.getAttribute("data-u");
        if (cur.picked[i]) delete cur.picked[i]; else cur.picked[i] = 1;
        el.classList.toggle("on", !!cur.picked[i]);
      };
    });
  }

  function on(sel, fn) { var b = $(sel); if (b) b.onclick = fn; }

  function wire(h) {
    if (!cur) return;
    on("#epback", function () { stopTimer(); h.back(); });
    if (cur.mode === "tre") wireTre(h); else wireRif(h);
  }

  var api = { SECS: SECS, MIN_REF: MIN_REF, taskWeek: taskWeek, taskFor: taskFor, goalWords: goalWords, wordCount: wordCount,
              measure: measure, compare: compare, split: split, diff: diff, localRewrite: localRewrite, fixOf: fixOf,
              cardFor: cardFor, modelCard: modelCard, addCards: addCards, reviewItem: reviewItem,
              aiPrompt: aiPrompt, aiText: aiText, reformulate: reformulate,
              start: start, current: function () { return cur; }, render: render, wire: wire, stop: stopTimer };
  if (typeof module === "object" && module.exports) module.exports = api;
  root.EscrituraPlus = api;
})(typeof window !== "undefined" ? window : globalThis);
