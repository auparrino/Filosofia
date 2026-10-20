/*
 * Errores: el modelo de error común (auditoría 3.0, C9 y P1).
 *
 * Todo lo que corrige (las respuestas cerradas, Scrivi con sus reglas,
 * LanguageTool y la IA, el dictogloss, la tarea del tramo, Escritura plus,
 * la revisión final de Parla) arma el mismo objeto y lo anota con
 * Errores.record, así «Tus errores», la Clínica y el repaso leen lo mismo:
 *
 *   { cat,        la categoría (la del diagnóstico del idioma)
 *     nivel,      "incorrecto" | "desliz" | "poco_natural" | "aceptable"
 *     registro,   null | "formal" | "informal" (el que pedía la consigna)
 *     mal, bien,  lo escrito y la corrección mínima (bien: null si no se
 *                 sabe, "" si lo escrito sobra)
 *     pista, regla, contraste,   las capas de la explicación
 *     fuente,     "reglas" | "lt" | "ia" | "alumno"
 *     seguro,     true para las reglas propias (0 falsas alarmas medidas)
 *     label }     el nombre de la categoría para mostrar
 *
 * Lo aceptable y lo poco natural no son errores: no se anotan.  Las
 * categorías que la Clínica no conoce (lo que LanguageTool llama
 * «grammatica», lo que la IA no supo clasificar) quedan en el registro con
 * su porqué pero fuera del puntaje (state.errs).
 *
 * Además, lo común a la corrección con IA: el nivel de una respuesta en los
 * dos idiomas (level), la capa de la explicación según cuántas veces el
 * alumno ya vio la categoría (depth, P6), el caché de explicaciones y de
 * correcciones por oración (cache*), y el contexto del curso para los
 * pedidos (courseCtx, promptCtx).
 *
 * En state: errs {cat: {n, fixed, last}} y errLog [{cat, g, e, at, l, x,
 * p, c, v, r, f, s, k}] (g: lo escrito, e: la corrección, l: el nombre,
 * x: el porqué, p: la pista, c: el contraste, v: el nivel, r: el registro,
 * f: la fuente, s: segura, k: cuenta para la Clínica).
 */
(function (root) {
  "use strict";

  function Dg() { return root.Diagnosi || null; }
  function LG() { return root.LANG || {}; }
  function groups() { var D = Dg(); return (D && D.GROUPS) || LG().diagGroups || {}; }
  function str(x, n) { return x == null ? "" : String(x).replace(/\s+/g, " ").trim().slice(0, n || 280); }
  function strip(s) { return String(s == null ? "" : s).replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1"); }

  /* ------------------------------------------------------------ niveles
     El portugués dice "ok" | "ok_note" | "close" | "wrong"; el italiano
     "correcto" | "aceptable" | "poco_natural" | "desliz" | "incorrecto".
     Para la interfaz: "ok", "note" (vale, con una nota), "slip" (casi) o
     "wrong".  Sin level, lo dice el verdict. */
  var NOTE_LV = { ok_note: 1, aceptable: 1, poco_natural: 1 };
  var OK_LV = { ok: 1, correcto: 1 };
  var SLIP_LV = { close: 1, desliz: 1 };
  var WRONG_LV = { wrong: 1, incorrecto: 1 };
  function level(d) {
    if (!d) return "wrong";
    var L = d.level;
    if (L && NOTE_LV[L]) return "note";
    if (L && OK_LV[L]) return d.note && d.verdict === "giusto" ? "note" : "ok";
    if (L && SLIP_LV[L]) return "slip";
    if (L && WRONG_LV[L]) return "wrong";
    return d.verdict === "giusto" ? (d.note ? "note" : "ok") : d.verdict === "quasi" ? "slip" : "wrong";
  }
  // The level of P1 (the one the error log keeps).
  function nivel(d) {
    if (d && d.level === "poco_natural") return "poco_natural";
    var l = level(d);
    return l === "ok" || l === "note" ? "aceptable" : l === "slip" ? "desliz" : "incorrecto";
  }
  /* What «✓ Vale» says: the note of the diagnosis and, when it was correct
     but not natural, the natural version («más natural: …»). */
  function noteOf(d) {
    if (!d) return "";
    var n = str(d.note, 400), nat = str(d.natural, 200);
    if (d.level === "poco_natural" && nat) return "Más natural: *" + nat + "*." + (n ? " " + n : "");
    return n;
  }

  /* ------------------------------------------------- categorías y capas */

  // What LanguageTool and the AI call it, when the Clínica has no remedy for it.
  var OUT = { grammatica: 1, ia: 1, lt: 1, estilo: 1, stile: 1, puntuacion: 1, puntuazione: 1,
              mayusculas: 1, maiuscole: 1, registro_ia: 1 };
  var ALIAS = { lessico: "lessico", lexico: "lexico" };
  function unrecorded(cat) { var G = groups(); return !!(G.unrecorded && G.unrecorded[cat]); }
  // The category of the Clínica for this one, or null (kept out of the score).
  function clinicCat(cat) {
    if (!cat || OUT[cat] || unrecorded(cat)) return null;
    if (ALIAS[cat]) cat = ALIAS[cat];
    var D = Dg(), L = D && D.LABEL;
    if (L && !L[cat]) return null;
    return cat;
  }
  function label(cat) {
    var D = Dg(), S = root.Scrivi;
    return (D && D.LABEL && D.LABEL[cat]) || (S && S.AI_TYPES && S.AI_TYPES[cat]) || cat || "";
  }
  // The explanation in layers of a category: {regla, es, ej} (porque_data.js).
  function capa(cat) {
    var D = Dg();
    if (D && typeof D.capa === "function") { try { var c = D.capa(cat); if (c) return c; } catch (e) { /* */ } }
    var P = root.PORQUE_DATA;
    return (P && P.capas && P.capas[cat]) || null;
  }
  var ES_MENTION = /español|castellano|«[^»]+»|como en |a diferencia/i;

  /* How much to explain (P6), by how many times the learner has met this
     category (state.errs[cat].n, already counting this one): the first time,
     the rule and the contrast with Spanish; from the fifth, only the hint and
     a link to the rule; in between, the explanation of the moment. */
  function depth(state, cat) {
    var e = state && state.errs && state.errs[cat], n = e ? +e.n || 0 : 0;
    return n <= 1 ? "first" : n >= 5 ? "brief" : "normal";
  }
  // The lines to add to an explanation the first time: the rule and the contrast, if missing.
  function firstLayer(cat, explain) {
    var c = capa(cat), x = String(explain || ""), add = [];
    if (!c) return add;
    if (c.regla && x.indexOf(strip(c.regla).slice(0, 40)) < 0 && x.indexOf(c.regla.slice(0, 40)) < 0) add.push(c.regla);
    if (c.es && !ES_MENTION.test(x) && x.indexOf(c.es.slice(0, 40)) < 0) add.push(c.es);
    return add;
  }

  /* ------------------------------------------------------------ el objeto */

  function make(o) {
    o = o || {};
    var fuente = o.fuente || "reglas";
    return {
      cat: o.cat || null,
      nivel: o.nivel || "incorrecto",
      registro: o.registro || null,
      mal: str(o.mal, 120),
      bien: o.bien == null ? null : str(o.bien, 120),
      pista: str(o.pista, 280),
      regla: str(o.regla, 400),
      contraste: str(o.contraste, 280),
      fuente: fuente,
      seguro: o.seguro != null ? !!o.seguro : fuente === "reglas",
      label: str(o.label || label(o.cat), 60)
    };
  }

  // From the diagnosis of a closed answer (Diagnosi.diagnose / explainChoice).
  function fromDiag(d, given, o) {
    o = o || {};
    if (!d || !d.cat) return null;
    var c = capa(d.cat), x = String(d.explain || "");
    return make({ cat: d.cat, nivel: o.nivel || nivel(d), registro: o.registro, mal: given, bien: o.bien != null ? o.bien : d.target,
                  pista: d.hint, regla: x || d.hint, contraste: c && c.es && !ES_MENTION.test(x) ? c.es : "",
                  fuente: o.fuente || "reglas", seguro: o.seguro, label: d.label || label(d.cat) });
  }

  // The first *form* after the colon of a message («La forma es: *andrò*»): the correction, when the finding does not say it.
  function guessGood(msg, bad) {
    var segs = [], re = /\*([^*]+)\*/g, m, b = String(bad || "").toLowerCase();
    while ((m = re.exec(msg))) if (m[1].toLowerCase() !== b && !/^-|…|\+/.test(m[1])) segs.push({ x: m[1], at: m.index });
    if (!segs.length) return null;
    var colon = String(msg).indexOf(":"), after = segs.filter(function (q) { return q.at > colon; })[0];
    return (after || segs[segs.length - 1]).x;
  }
  /* From a finding of Scrivi (local rules, LanguageTool or the AI): the
     fields bad / good / why when the checker gives them; if not, what was
     written is taken from the text and the correction from the message. */
  function fromFinding(f, text, o) {
    o = o || {};
    if (!f || !f.cat) return null;
    var bad = f.bad;
    if (bad == null && text != null && root.Scrivi && root.Scrivi.toks && f.i >= 0) {
      var tk = root.Scrivi.toks(text), a = tk[f.i], z = tk[Math.min(tk.length - 1, f.i + (f.n || 1) - 1)];
      bad = a && z && a.at != null && z.at != null ? String(text).replace(/[’‘`´]/g, "'").slice(a.at, z.at + (z.len || 0)) : (a && a.o) || "";
    }
    var good = f.good !== undefined ? f.good : guessGood(f.msg || "", bad);
    var fuente = f.ai ? "ia" : f.lt ? "lt" : o.fuente || "reglas";
    var lv = f.level === "poco_natural" || f.soft ? "poco_natural" : SLIP_LV[f.level] ? "desliz" : NOTE_LV[f.level] ? "aceptable" : "incorrecto";
    var why = f.why || f.msg || "";
    var c = capa(f.cat);
    return make({ cat: f.cat, nivel: lv, registro: o.registro, mal: bad, bien: good, pista: "", regla: why,
                  contraste: c && c.es && !ES_MENTION.test(why) ? c.es : "", fuente: fuente,
                  seguro: fuente === "reglas", label: label(f.cat) });
  }
  // A row [what was written, the correction, the note, the type] (Parla, the rubric of the tramo).
  function fromRow(mal, bien, nota, tipo, o) {
    o = o || {};
    var cat = String(tipo || "").trim().toLowerCase() || "ia";
    var S = root.Scrivi;
    if (S && S.AI_TYPES && !S.AI_TYPES[cat] && !(Dg() && Dg().LABEL && Dg().LABEL[cat])) cat = "ia";
    return make({ cat: cat, nivel: cat === "estilo" || cat === "stile" ? "poco_natural" : "incorrecto", registro: o.registro,
                  mal: mal, bien: bien, regla: nota, fuente: o.fuente || "ia", seguro: false, label: label(cat) });
  }

  /* Anota el error: cuenta en state.errs si la Clínica lo conoce, y queda en
     el registro (los últimos 60) con lo escrito, la corrección y el porqué.
     Lo aceptable no se anota; lo que no se registra (el tipeo) tampoco.
     Devuelve la fila del registro (para deshacerla: unrecord). */
  function record(state, err) {
    if (!state || !err || !err.cat) return null;
    if (err.nivel === "aceptable" || err.nivel === "poco_natural") return null;
    if (unrecorded(err.cat)) return null;
    var cc = clinicCat(err.cat);
    if (!state.errs) state.errs = {};
    if (!state.errLog) state.errLog = [];
    if (cc) {
      var e = state.errs[cc] || (state.errs[cc] = { n: 0, fixed: 0, last: 0 });
      e.n++;
      e.last = Date.now();
    }
    var row = { cat: cc || err.cat, g: str(err.mal, 80), e: err.bien == null ? "" : str(err.bien, 80), at: Date.now(),
                l: str(err.label, 60), x: str(err.regla || err.pista, 280), k: cc ? 1 : 0 };
    if (err.bien === "") row.d = 1;               // lo escrito sobra
    if (err.pista && err.pista !== err.regla) row.p = str(err.pista, 200);
    if (err.contraste) row.c = str(err.contraste, 200);
    if (err.nivel && err.nivel !== "incorrecto") row.v = err.nivel;
    if (err.registro) row.r = err.registro;
    if (err.fuente && err.fuente !== "reglas") row.f = err.fuente;
    if (!err.seguro) row.s = 0;
    state.errLog.unshift(row);
    state.errLog = state.errLog.slice(0, 60);
    return row;
  }
  // Undo a record (the learner says the answer was valid: P5).
  function unrecord(state, row) {
    if (!state || !row) return;
    var i = (state.errLog || []).indexOf(row);
    if (i >= 0) state.errLog.splice(i, 1);
    if (row.k && state.errs && state.errs[row.cat]) state.errs[row.cat].n = Math.max(0, state.errs[row.cat].n - 1);
  }
  // Several findings of a text at once (Scrivi, dictogloss, tramo, Escritura plus).
  function recordFindings(state, findings, text, o) {
    var out = [];
    (findings || []).forEach(function (f) {
      if (!f || f.soft || f.minor) return;
      var r = record(state, fromFinding(f, text, o));
      if (r) out.push(r);
    });
    return out;
  }

  /* ------------------------------------------------------------- el caché
     Lo que la IA ya explicó o corrigió, por hash de (idioma, tipo, ítem,
     respuesta normalizada) o de (idioma, semana, oración): la misma pregunta
     no se vuelve a pagar.  En localStorage, con tope; se exporta junto con
     «Correcciones para revisar». */
  var CACHE_MAX = 240;
  function hash(s) {
    var h = 5381, h2 = 52711;
    s = String(s);
    for (var i = 0; i < s.length; i++) { var c = s.charCodeAt(i); h = ((h << 5) + h + c) | 0; h2 = ((h2 << 5) + h2 ^ c) | 0; }
    return (h >>> 0).toString(36) + (h2 >>> 0).toString(36);
  }
  function normText(s) {
    return String(s == null ? "" : s).normalize("NFC").replace(/[’‘`´]/g, "'").toLowerCase().replace(/\s+/g, " ")
      .replace(/^[\s.,;:!?¡¿«»"]+|[\s.,;:!?¡¿«»"]+$/g, "");
  }
  function storeKey() { return (LG().storage || "c1") + ".ia.cache"; }
  var MEM = null;
  function cacheLoad() {
    if (MEM) return MEM;
    try { MEM = JSON.parse(root.localStorage.getItem(storeKey()) || "{}") || {}; } catch (e) { MEM = {}; }
    if (typeof MEM !== "object" || Array.isArray(MEM)) MEM = {};
    return MEM;
  }
  function cacheSave() {
    var m = cacheLoad(), ks = Object.keys(m);
    if (ks.length > CACHE_MAX) {
      ks.sort(function (a, b) { return (m[a].at || 0) - (m[b].at || 0); });
      ks.slice(0, ks.length - CACHE_MAX).forEach(function (k) { delete m[k]; });
    }
    try { root.localStorage.setItem(storeKey(), JSON.stringify(m)); } catch (e) { /* lleno o bloqueado: vale en memoria */ }
  }
  function cacheId(kind, parts) {
    return kind + ":" + hash([LG().code || ""].concat((parts || []).map(normText)).join("\u0001"));
  }
  function cacheGet(kind, parts) {
    var m = cacheLoad(), x = m[cacheId(kind, parts)];
    return x ? x.v : null;
  }
  // desc: what it was about, readable in the export («item · given»).
  function cacheSet(kind, parts, value, desc) {
    var m = cacheLoad();
    m[cacheId(kind, parts)] = { v: value, at: Date.now(), t: kind, q: str(desc, 200) };
    cacheSave();
  }
  function cacheAll() {
    var m = cacheLoad();
    return Object.keys(m).map(function (k) { return { id: k, kind: m[k].t, at: m[k].at, q: m[k].q, v: m[k].v }; })
      .sort(function (a, b) { return b.at - a.at; });
  }
  function cacheClear() { MEM = {}; cacheSave(); }
  function cacheReset() { MEM = null; }   // tests: read localStorage again

  // The sentences of a text, each with where it starts.
  function sentences(text) {
    var out = [], re = /[^.!?\n]+[.!?]*/g, m, src = String(text || "");
    while ((m = re.exec(src))) { var s = m[0].trim(); if (/[A-Za-zÀ-ÿ]/.test(s)) out.push({ s: s, at: m.index + m[0].indexOf(s) }); }
    return out;
  }

  /* -------------------------------------------- el curso, para la IA
     Lo que el pedido tiene que saber del alumno: la semana y el nivel, la
     gramática vista hasta ahí, las estructuras y categorías de la semana,
     sus tres categorías flojas y lo que ya marcó la app (seguro). */
  function levelOfWeek(w) { return w <= 8 ? "A1" : w <= 18 ? "A2" : w <= 30 ? "B1" : w <= 42 ? "B2" : "C1"; }
  function courseCtx(course, state, week, extra) {
    week = Math.max(1, Math.min(52, +week || 1));
    var weeks = (course && course.weeks) || [], w = weeks[week - 1] || {};
    var C = root.Conj, TL = (C && C.TENSE_LABELS) || {};
    var titles = weeks.slice(0, week).filter(function (x) { return x && !x.boss && x.title; }).map(function (x) { return x.title; });
    var tenses = (w.known || w.tenses || []).map(function (t) { return strip(TL[t] || t).replace(/\s*\(.*?\)/g, ""); });
    var B = root.Banca, weak = B && B.weakest ? B.weakest(state || {}, 3).map(function (x) { return x.cat; }) : [];
    var S = root.Scrivi, task = S && S.TASKS ? S.TASKS[week] : null;
    var P = root.PORQUE_DATA, D = Dg(), wc = [];
    if (P && P.weeks && D && D.LABEL) Object.keys(P.weeks).forEach(function (k) { if (P.weeks[k] === week && D.LABEL[k]) wc.push(k); });
    var o = { week: week, level: w.level || levelOfWeek(week), grammar: titles.slice(-14), tenses: tenses,
              weak: weak, weekCats: wc, structs: task && task.use ? task.use.map(function (u) { return u[2]; }) : [] };
    Object.keys(extra || {}).forEach(function (k) { o[k] = extra[k]; });
    return o;
  }
  function promptCtx(c) {
    if (!c) return "";
    if (typeof c === "string") return c;
    var lines = [];
    if (c.week) lines.push("El alumno está en la semana " + c.week + " de 52 (nivel " + (c.level || levelOfWeek(c.week)) + ").");
    if (c.grammar && c.grammar.length) lines.push("Gramática vista hasta ahora (las últimas lecciones): " + c.grammar.join("; ") + ".");
    if (c.tenses && c.tenses.length) lines.push("Tiempos verbales que ya conoce: " + c.tenses.join(", ") + ". No uses nombres de tiempos que todavía no vio: describilos con palabras simples.");
    if (c.structs && c.structs.length) lines.push("Lo que practica esta semana: " + c.structs.join("; ") + ".");
    if (c.weekCats && c.weekCats.length) lines.push("Categorías de error de esta semana: " + c.weekCats.map(label).join(", ") + ".");
    if (c.weak && c.weak.length) lines.push("Sus categorías más flojas (se equivoca seguido): " + c.weak.map(label).join(", ") + ".");
    if (c.cat) lines.push("Categoría del error según la app: " + label(c.cat) + ".");
    if (c.appSaid) lines.push("Lo que le mostró la app (es la corrección de reglas revisadas): " + strip(c.appSaid).slice(0, 500));
    if (c.local && c.local.length) {
      lines.push("Marcas SEGURAS del corrector propio de la app (reglas revisadas, sin falsas alarmas medidas): tomalas como ciertas y no las repitas:");
      c.local.slice(0, 12).forEach(function (m) { lines.push("- " + m); });
    }
    lines.push("Cuando sirva, contrastá con el español rioplatense (qué se dice distinto y por qué).");
    return lines.join("\n");
  }
  // A local finding as evidence: «mal» → «bien»: por qué.
  function evidenceLine(f) {
    var bad = f.bad != null ? f.bad : "", good = f.good;
    var why = strip(f.why || f.msg || "").slice(0, 160);
    return (bad ? "«" + bad + "»" + (good != null ? " → «" + (good === "" ? "(se borra)" : good) + "»" : "") + ": " : "") + why;
  }
  // Focused correction (Bitchener y Knoch; Sheen): in A1-A2, first the week's and the weak categories.
  function focusCats(c) {
    if (!c || !c.week || c.week > 18) return null;
    var out = (c.weekCats || []).concat(c.weak || []);
    return out.filter(function (x, i) { return out.indexOf(x) === i; });
  }

  var api = {
    level: level, nivel: nivel, noteOf: noteOf,
    clinicCat: clinicCat, label: label, capa: capa, depth: depth, firstLayer: firstLayer,
    make: make, fromDiag: fromDiag, fromFinding: fromFinding, fromRow: fromRow, guessGood: guessGood,
    record: record, unrecord: unrecord, recordFindings: recordFindings,
    hash: hash, normText: normText, cacheGet: cacheGet, cacheSet: cacheSet, cacheAll: cacheAll, cacheClear: cacheClear,
    cacheReset: cacheReset, CACHE_MAX: CACHE_MAX, sentences: sentences,
    courseCtx: courseCtx, promptCtx: promptCtx, evidenceLine: evidenceLine, focusCats: focusCats, levelOfWeek: levelOfWeek
  };
  if (typeof module === "object" && module.exports) module.exports = api;
  root.Errores = api;
})(typeof window !== "undefined" ? window : globalThis);
