/*
 * Tramo C1: de la semana 27 a la 51 (la 39 es el jefe), cada semana suma
 * tres piezas que crecen en largo hasta el nivel del examen:
 *
 *   📰 Lectura larga (de ~350 a ~900 palabras) con preguntas en la lengua
 *      meta: la sirve letture.js como la serie «lunga», con el mismo lector,
 *      las glosas, el karaoke y la caza de formas.
 *   🎧 Escucha larga (de ~250 a ~600 palabras): un guion a dos voces (o
 *      tres: la tercera es una de las dos voces con otro tono y otra
 *      velocidad) leído por las voces del teléfono, dos escuchas con las
 *      preguntas a la vista, después la transcripción.
 *   📻 Escucha corta (1-2 minutos, «breve»): un monólogo de los géneros del
 *      examen (notiziario, previsioni, annuncio in stazione, messaggio in
 *      segreteria, istruzioni, avviso pubblico, pubblicità), una sola voz,
 *      con las preguntas del CILS: individuazione di informazioni (qué dice
 *      y qué no) y una tabla para completar con datos (horas, números,
 *      nombres).
 *   ✍️ Tarea integrada: un texto de un género (carta formal, reseña, síntesis,
 *      carta de lector, artículo…) que parte de lo leído o escuchado, de 120
 *      a 250 palabras mínimo, como la producción escrita del CILS / CELI y la
 *      tarea integrada del Celpe-Bras.
 *
 * Sin clave de IA, la tarea se revisa con criterios que no se engañan con
 * relleno: extensión, variedad léxica, puntos de la consigna cubiertos,
 * estructura del género, conectores y errores marcados por el corrector de
 * la semana.  Si el paquete trae ADEQ (tramo_data.js), además mide la
 * adequação ao contexto del Celpe-Bras, con listas por idioma y por género:
 * tratamiento coherente con el destinatario (GENRES[g].trat), verbos del
 * propósito del género (GENRES[g].proposito), uso de la fuente (palabras de
 * contenido del texto o del audio que no están en la consigna) y registro
 * medido (marcas del habla contra marcas de la escritura formal, según
 * GENRES[g].registro o compito.registro).  Un idioma sin ADEQ no cambia.
 * Con clave, la IA la califica además con la rúbrica C1.
 * Nada oral: todo se lee, se escucha y se escribe.
 *
 * La serie de escucha «Radio» / «Rádio» de las semanas 6-25 (js/radio.js)
 * usa el mismo reproductor: open("rad", semana) toma el episodio de
 * Radio.asWeek, con las preguntas en castellano hasta la 13, las glosas a la
 * vista antes de escuchar, «¿lo dice o no lo dice?» (ascolto.info) en lugar
 * del verdadero / falso, y lo guarda Radio.record (state.radio).
 *
 * Antes de la primera tarea de un género se muestra su ficha
 * (GENRES[g].ficha: 4-6 pantallas con para qué sirve, estructura, fórmulas,
 * verbos y un modelo anotado); después se abre desde la tarea.
 *
 * Los datos son del paquete (lang/<código>/tramo_data.js → window.TRAMO_DATA:
 * GENRES, SETTIMANE, ADEQ).  Lo que guarda, en state.tramo: asc {semana: {pct,
 * ok, n, at}}, brv {semana: {pct, ok, n, at}} (la escucha corta), scr {semana:
 * {ok, n, punti, of, hard, at, ai}}, draft {semana: texto}, fichas {género:
 * fecha en que se leyó la ficha}.
 */
(function (root) {
  "use strict";

  var H = null;           // the host (app.js)
  var cur = null;         // the open listening or task
  var saveTimer = null;
  var playing = 0;        // token of the listening in course (0: none)

  function D() { return root.TRAMO_DATA || { GENRES: {}, SETTIMANE: [] }; }
  function esc(s) { return H ? H.esc(s) : String(s); }
  function LG() { return root.LANG || {}; }
  function langAttr() { return ' lang="' + (LG().tts || LG().code || "") + '"'; }
  function VF() {
    var v = (root.LETTURE_DATA || {}).vf || {};
    return { prompt: v.prompt || "¿Verdadero, falso o no se dice?", options: v.options || ["verdadero", "falso", "no se dice"] };
  }

  function week(n) {
    var list = D().SETTIMANE || [];
    for (var i = 0; i < list.length; i++) if (list[i].week === n) return list[i];
    return null;
  }
  function weeks() { return (D().SETTIMANE || []).map(function (s) { return s.week; }); }

  function store(state) {
    var s = state || (H && H.state());
    if (!s.tramo || typeof s.tramo !== "object" || Array.isArray(s.tramo)) s.tramo = {};
    var t = s.tramo;
    ["asc", "brv", "scr", "draft", "fichas"].forEach(function (k) { if (!t[k] || typeof t[k] !== "object" || Array.isArray(t[k])) t[k] = {}; });
    return t;
  }

  /* ------------------------------------------------------------ texto */

  function words(s) { return String(s || "").split(/\s+/).filter(function (x) { return /[A-Za-zÀ-ÿ]/.test(x); }).length; }
  function plain(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function tokens(s) { return plain(s).replace(/[^a-z'\s-]/g, " ").split(/[\s']+/).filter(Boolean); }
  function paragraphs(s) { return String(s || "").split(/\n\s*\n|\n/).map(function (p) { return p.trim(); }).filter(Boolean); }
  function scriptWords(a) { return words(a.turns.map(function (t) { return t[1]; }).join(" ")); }
  function breveWords(b) { return words((b.text || []).join(" ")); }

  // The voices of a script: A and B are the phone's two voices; C, when a
  // conversation has three people, is the first voice with another pitch
  // and a slightly faster pace (as Suoni does).
  var VOICE = { A: { pitch: 0.92, vi: 0, rate: 1 }, B: { pitch: 1.1, vi: 1, rate: 1 }, C: { pitch: 1.25, vi: 0, rate: 1.08 } };
  function speakerName(a, who) { return a.speakers[who === "A" ? 0 : who === "B" ? 1 : 2] || who; }

  // A cell of the table of a short listening: numbers, hours, names.  «18»,
  // «alle 18», «18:00» and «diciotto» are the same answer when the data say
  // so; accents, case, articles and punctuation do not count.  The package
  // can add its own particles (TRAMO_DATA.cellStop: «às», «reais»…); «18h»
  // and «18h30» are hours too.
  var cellStopRe = null, cellStopOf = null;
  function cellStop() {
    var extra = D().cellStop || [];
    if (cellStopOf !== extra) {
      cellStopOf = extra;
      var base = ["il", "lo", "la", "l", "i", "gli", "le", "un", "una", "alle", "alla", "al", "dalle", "dalla", "dal", "entro", "ogni",
                  "circa", "ore", "euro", "di", "del", "della", "a", "e"];
      cellStopRe = new RegExp("\\b(" + base.concat(extra.map(plain)).join("|") + ")\\b", "g");
    }
    return cellStopRe;
  }
  function cellKey(s) {
    return plain(s).replace(/(\d)\s*h\s*(\d\d)\b/g, "$1:$2").replace(/(\d)\s*h\b/g, "$1")
      .replace(/(\d)[:.,](00)\b/g, "$1").replace(/(\d)[:.](\d)/g, "$1 $2").replace(/[^a-z0-9%\s]/g, " ")
      .replace(cellStop(), " ")
      .replace(/\s+/g, " ").trim();
  }
  function cellOk(given, cell) {
    var g = cellKey(given);
    if (!g) return false;
    return [cell[1]].concat(cell[2] || []).some(function (a) { return cellKey(a) === g; });
  }

  /* ------------------------------------------------- la revisión local */

  // Variety over the first 150 words (a type/token ratio needs a fixed
  // length to mean something): real texts of this level sit around 0,6;
  // a word repeated to fill the length falls far below.
  function variety(text) {
    var tk = tokens(text).slice(0, 150);
    if (tk.length < 40) return { ttr: 0, top: "", share: 0 };
    var seen = {}, count = {}, top = "", max = 0;
    tk.forEach(function (w) {
      seen[w] = 1;
      if (w.length < 4) return;
      count[w] = (count[w] || 0) + 1;
      if (count[w] > max) { max = count[w]; top = w; }
    });
    return { ttr: Object.keys(seen).length / tk.length, top: top, share: max / tk.length };
  }

  function connectors(text) {
    // The connectors of the language (escritos_data.js) and the ones of a
    // higher register (tramo_data.js); time words don't count as cohesion.
    var list = ((root.ESCRITOS_DATA || {}).conn || []).concat(D().CONNETTIVI || []);
    var t = " " + tokens(text).join(" ") + " ", found = {};
    list.forEach(function (c) {
      var k = plain(c);
      if (k.length < 3) return;   // «e», «o», «ma»: too common to show cohesion
      if (t.indexOf(" " + k + " ") >= 0) found[k] = 1;
    });
    return Object.keys(found);
  }

  // Share of the text copied from the week's reading or listening: runs of
  // five words that are also in the source.  A task built on a text asks
  // for its ideas in your own words.
  function copied(text, s) {
    var src = tokens(s.lettura.text + " " + s.ascolto.turns.map(function (t) { return t[1]; }).join(" ")), seen = {}, i;
    for (i = 0; i + 5 <= src.length; i++) seen[src.slice(i, i + 5).join(" ")] = 1;
    var tk = tokens(text), n = 0, hit = 0;
    for (i = 0; i + 5 <= tk.length; i++) { n++; if (seen[tk.slice(i, i + 5).join(" ")]) hit++; }
    return n ? hit / n : 0;
  }

  function rx(list) {
    return (list || []).map(function (s) { try { return new RegExp(s, "i"); } catch (e) { return null; } }).filter(Boolean);
  }

  /* ---------------------------------------------- adequação ao contexto */

  // Count the matches of a list of words or expressions («a gente», «pra»)
  // in the text, on word boundaries and without accents; returns
  // {n, found: [the ones that appear]}.
  function countList(text, list) {
    var t = " " + tokens(text).join(" ") + " ", n = 0, found = [];
    (list || []).forEach(function (w) {
      var k = " " + tokens(w).join(" ") + " ", i = 0, c = 0;
      if (k.length < 3) return;
      while ((i = t.indexOf(k, i)) >= 0) { c++; i += k.length - 1; }
      if (c) { n += c; found.push(w); }
    });
    return { n: n, found: found };
  }

  // The source of the task: the reading, the listening or both.
  function sourceText(task, s) {
    if (!s) return "";
    var a = s.ascolto ? s.ascolto.turns.map(function (t) { return t[1]; }).join(" ") : "";
    var l = s.lettura ? s.lettura.text : "";
    return task.fonte === "ascolto" ? a : task.fonte === "entrambi" ? l + " " + a : l;
  }

  // Content words of the source that the prompt does not give away: the
  // text has to use what it read or heard, not repeat the task.  A word is
  // taken by its first letters (enchente / enchentes, propôs / propor), and
  // only if it is proper to this source: it appears in the sources of at
  // most A.dfMax weeks of the tramo (names, figures, the terms of the
  // topic), so words any text brings (conversa, problema, história) do not
  // count.
  var DF = null;
  function sourceDF(A) {
    if (DF) return DF;
    var L = A.stemLen || 6;
    DF = {};
    (D().SETTIMANE || []).forEach(function (w) {
      var seen = {};
      tokens(sourceText({ fonte: "entrambi" }, w)).forEach(function (t) { seen[t.replace(/s$/, "").slice(0, L)] = 1; });
      Object.keys(seen).forEach(function (k) { DF[k] = (DF[k] || 0) + 1; });
    });
    return DF;
  }
  function sourceUse(task, text, s, A) {
    var stop = {};
    String(A.stop || "").split(/\s+/).forEach(function (w) { if (w) stop[plain(w)] = 1; });
    var L = A.stemLen || 6, min = A.wordMin || 5, df = sourceDF(A), dfMax = A.dfMax || 3;
    var stem = function (w) { return w.replace(/s$/, "").slice(0, L); };
    var inTask = {};
    tokens(task.t + " " + (task.title || "")).forEach(function (w) { inTask[stem(w)] = 1; });
    var src = {};
    tokens(sourceText(task, s)).forEach(function (w) {
      if (w.length >= min && !stop[w] && !inTask[stem(w)] && (df[stem(w)] || 0) <= dfMax) src[stem(w)] = src[stem(w)] || w;
    });
    var used = {};
    tokens(text).forEach(function (w) { var k = stem(w); if (w.length >= min && src[k] && !stop[w]) used[k] = src[k]; });
    // the figures of the source (years, percentages, amounts) count too
    var nums = {};
    (sourceText(task, s).match(/\d[\d.,]*/g) || []).forEach(function (x) {
      x = x.replace(/[.,]+$/, "");
      if (x.replace(/\D/g, "").length >= 2) nums[x] = 1;
    });
    (String(text).match(/\d[\d.,]*/g) || []).forEach(function (x) { x = x.replace(/[.,]+$/, ""); if (nums[x]) used["#" + x] = x; });
    return Object.keys(used).map(function (k) { return used[k]; });
  }

  function adequacao(task, g, text, s) {
    var A = D().ADEQ, crit = [];
    if (!A) return crit;
    var v = countList(text, A.voce), sr = countList(text, A.senhor);
    if (g.trat === "senhor") crit.push({ id: "trat", ok: v.n === 0,
      label: v.n === 0 ? (sr.n ? "Tratamiento coherente: " + sr.found.slice(0, 3).join(", ") + " de principio a fin" : "Tratamiento: sin você en un texto formal")
        : sr.n ? "Mezclás " + v.found.slice(0, 3).join(", ") + " con " + sr.found.slice(0, 3).join(", ") + ": al destinatario de una carta formal, siempre o senhor / a senhora"
        : "Al destinatario de una carta formal no se lo trata de " + v.found.slice(0, 3).join(", ") + ": usá o senhor / a senhora (y lhe, seu, el verbo en 3.ª persona)" });
    if (g.trat === "voce") crit.push({ id: "trat", ok: sr.n === 0,
      label: sr.n === 0 ? "Tratamiento de confianza (você, a gente), como corresponde"
        : "«" + sr.found[0] + "» a un amigo suena distante: en un e-mail informal, você" });
    var props = rx(g.proposito), pm = null;
    props.some(function (r) { var m = r.exec(text); if (m) pm = m[0]; return !!m; });
    if (props.length) crit.push({ id: "prop", ok: !!pm,
      label: pm ? "Propósito del género a la vista: «" + pm.trim() + "»"
        : "No se ve el propósito del género" + (g.propositoHint ? " (" + g.propositoHint + ")" : "") + ": decí con todas las letras qué hacés" });
    if (s && task.fonte) {
      var used = sourceUse(task, text, s, A), need = task.fonteMin || g.fonteMin || A.fonteMin || 5;
      var where = task.fonte === "ascolto" ? "del audio" : task.fonte === "entrambi" ? "del texto y del audio" : "del texto";
      crit.push({ id: "fonte", ok: used.length >= need,
        label: used.length >= need ? "Usa la fuente: " + used.length + " palabras o datos " + where + " que la consigna no da (" + used.slice(0, 5).join(", ") + (used.length > 5 ? "…" : "") + ")"
          : "Usás poco la fuente: " + used.length + " palabras o datos " + where + " (al menos " + need + "): retomá nombres, cifras y términos, con tus palabras" });
    }
    var reg = task.registro || g.registro;
    if (reg === "formal" || reg === "informal") {
      var co = countList(text, A.coloquial), fo = countList(text, A.formal), ff = countList(text, A.formalForte);
      var cmax = A.coloqMax == null ? 1 : A.coloqMax;
      if (reg === "formal") crit.push({ id: "reg", ok: co.n <= cmax,
        label: co.n <= cmax ? "Registro formal: " + (fo.n ? fo.n + " marcas de la escritura (" + fo.found.slice(0, 4).join(", ") + ")" : "sin marcas del habla") + (co.n ? " y " + co.n + " del habla (" + co.found.join(", ") + ")" : "")
          : co.n + " marcas del habla (" + co.found.slice(0, 5).join(", ") + ") en un texto formal: pasalas a la norma escrita" });
      else crit.push({ id: "reg", ok: ff.n === 0,
        label: ff.n === 0 ? "Registro informal, como pide el destinatario" + (co.n ? " (" + co.found.slice(0, 4).join(", ") + ")" : "")
          : "«" + ff.found[0] + "» es de una carta formal: a un amigo, más cercano" });
    }
    return crit;
  }

  /* The register the genre asks for (the checker and the error profile use
     it): the task's, the genre's (GENRES[g].registro), or by the genre's
     name: a formal letter, a report, an essay, an article, a summary, a
     letter to the editor are formal; an informal e-mail is informal. */
  var FORMAL_G = /^(lettera_formale|relazione|saggio|articolo|sintesi|lettera_lettore|carta_formal|carta_leitor|carta_aberta|artigo|resumo|texto_opiniao|proposta)$/;
  var INFORMAL_G = /^(email_informale|email_informal)$/;
  function registroOf(task, g) {
    g = g || (D().GENRES || {})[task && task.genre] || {};
    var r = (task && task.registro) || g.registro;
    if (r) return /^(formal|formale|culto)$/i.test(r) ? "formal" : /^(informal|informale|coloquial)$/i.test(r) ? "informal" : null;
    var id = String((task && task.genre) || "");
    return FORMAL_G.test(id) ? "formal" : INFORMAL_G.test(id) ? "informal" : null;
  }

  // opts.noCheck: skip the week's checker (the slowest part; the tests use it
  // for the texts that must fail anyway).
  function evaluate(task, text, weekN, src, opts) {
    var g = (D().GENRES || {})[task.genre] || {};
    var reg = registroOf(task, g);
    var n = words(text), pars = paragraphs(text), v = variety(text), plainText = plain(text);
    var punti = (task.punti || []).map(function (p) {
      return { label: p[0], ok: p[1].some(function (k) { return plainText.indexOf(plain(k)) >= 0; }) };
    });
    var puntiOk = punti.filter(function (p) { return p.ok; }).length;
    var puntiNeed = Math.ceil(punti.length * 0.6);
    var head = pars.slice(0, 2).join(" "), tail = pars.slice(-2).join(" ");
    var opens = rx(g.open), closes = rx(g.close);
    var conns = connectors(text);
    var chk = root.Scrivi && root.Scrivi.check && !(opts && opts.noCheck) ? root.Scrivi.check(text, weekN, reg ? { registro: reg } : undefined) : { findings: [], hard: 0 };
    var maxHard = Math.max(2, Math.floor(n / 50));
    var crit = [];
    crit.push({ id: "len", need: true, ok: n >= task.min,
      label: "Extensión: " + n + " palabras (" + task.min + "–" + task.max + ")" + (n > task.max ? " · te pasaste: en el examen, recortar también cuenta" : "") });
    crit.push({ id: "var", need: true, ok: n >= 40 && v.ttr >= 0.45 && v.share <= 0.08,
      label: n < 40 ? "Variedad léxica: todavía no hay texto suficiente para medirla"
        : v.ttr < 0.45 ? "Variedad léxica baja: se repiten mucho las mismas palabras"
        : v.share > 0.08 ? "«" + v.top + "» aparece demasiadas veces: buscá sinónimos o reformulá"
        : "Variedad léxica de este nivel" });
    var cp = src ? copied(text, src) : 0;
    if (src) crit.push({ id: "own", need: true, ok: cp <= 0.2,
      label: cp <= 0.2 ? "Con tus palabras: no copia frases del texto ni del audio"
        : Math.round(cp * 100) + " % del texto repite frases de la fuente: reformulá con tus palabras (citar una frase corta está bien)" });
    crit.push({ id: "punti", need: true, ok: puntiOk >= puntiNeed,
      label: "Consigna: " + puntiOk + " de " + punti.length + " puntos cubiertos" });
    if (opens.length) crit.push({ id: "open", ok: opens.some(function (r) { return r.test(head); }),
      label: "Apertura propia del género" + (g.openHint ? " (" + g.openHint + ")" : "") });
    if (closes.length) crit.push({ id: "close", ok: closes.some(function (r) { return r.test(tail); }),
      label: "Cierre propio del género" + (g.closeHint ? " (" + g.closeHint + ")" : "") });
    if (g.title) crit.push({ id: "title", ok: pars.length > 1 && words(pars[0]) <= 14 && !/[.:;]$/.test(pars[0]),
      label: "Un título en la primera línea" });
    crit.push({ id: "pars", ok: pars.length >= (g.paragraphs || 3),
      label: "Párrafos: " + pars.length + " (al menos " + (g.paragraphs || 3) + ", una idea cada uno)" });
    crit.push({ id: "conn", ok: conns.length >= 4,
      label: "Conectores distintos: " + conns.length + (conns.length ? " (" + conns.slice(0, 6).join(", ") + (conns.length > 6 ? "…" : "") + ")" : "") + " · al menos 4" });
    adequacao(task, g, text, src).forEach(function (c) { crit.push(c); });
    /* The structures of the week's short text (Scrivi): from the 27th on it
       is no longer a mission of its own, its structures are a criterion of
       this task (audit F §2.2).  Not required: the task is judged by its
       genre, and the structures count for the score. */
    var su = (chk.reqs || []).filter(function (q) { return q.id; });
    if (su.length) crit.push({ id: "struct", ok: su.every(function (q) { return q.ok; }),
      label: "Estructuras de la semana: " + su.map(function (q) { return q.label + " (" + Math.min(q.n, q.need) + "/" + q.need + ")"; }).join(" · ") });
    crit.push({ id: "err", ok: chk.hard <= maxHard,
      label: chk.hard ? chk.hard + " cosas marcadas por el corrector: revisalas abajo (a veces se equivoca con palabras citadas o poco comunes)" : "El corrector de la semana no marcó errores" });
    var ok = crit.filter(function (c) { return c.need; }).every(function (c) { return c.ok; });
    return { ok: ok, n: n, crit: crit, punti: punti, puntiOk: puntiOk, check: chk, registro: reg,
             score: crit.filter(function (c) { return c.ok; }).length, of: crit.length };
  }

  /* --------------------------------------------------------- misiones */

  /* The listenings of the tramo: the best mark and every attempt (3.1: a
     sheet delivered blank no longer completes the mission; Engine.passed). */
  var LISTEN_PASS = 60;
  function better(prev, r) {
    return { pct: Math.max(r.pct, prev ? prev.pct || 0 : 0), ok: prev && prev.pct > r.pct ? prev.ok : r.ok, n: r.n,
             last: r.pct, tries: ((prev && prev.tries) || (prev ? 1 : 0)) + 1, at: Date.now(), v: 31 };
  }

  function missions(w, state) {
    if (!w || w.boss) return [];
    var s = week(w.week);
    if (!s) return [];
    // before 3.1 any delivery completed it: those records stay done
    var E = root.Engine, pass = function (r) { return !!r && (r.v !== 31 || !E || !E.passed || E.passed(r, LISTEN_PASS)); };
    var miss = function (r) { return E && E.passMissing ? E.passMissing(r, LISTEN_PASS) : ""; };
    var t = store(state), out = [], a = t.asc[w.week], r = t.scr[w.week], g = (D().GENRES || {})[s.compito.genre] || {};
    out.push({ kind: "tr-asc", arg: String(w.week), done: pass(a), half: !!a && !pass(a), ico: "🎧", title: "Escucha larga: " + s.ascolto.title,
      sub: a && pass(a) ? "Hecha · " + a.pct + " %" : a ? "Tu mejor: " + a.pct + " % · " + miss(a) : esc(s.ascolto.genre) + " · unas " + scriptWords(s.ascolto) + " palabras · dos escuchas, preguntas en " + H.langName() });
    if (s.breve) {
      var b = t.brv[w.week];
      out.push({ kind: "tr-brv", arg: String(w.week), done: pass(b), half: !!b && !pass(b), ico: "📻", title: "Escucha corta: " + s.breve.title,
        sub: b && pass(b) ? "Hecha · " + b.pct + " %" : b ? "Tu mejor: " + b.pct + " % · " + miss(b) : esc(s.breve.genre) + " · unas " + breveWords(s.breve) + " palabras · una voz, datos para anotar" });
    }
    out.push({ kind: "tr-scr", arg: String(w.week), done: !!(r && r.ok), ico: "🖋️", title: "Tarea: " + (g.name || s.compito.genre),
      sub: r && r.ok ? "Entregada · " + r.n + " palabras · " + r.score + " / " + r.of + " criterios" + (r.ai ? " · IA " + r.ai.tot + " / 20" : "")
        : (r ? "Te falta: " + (r.miss || "revisar") + " · " : "") + s.compito.min + "–" + s.compito.max + " palabras a partir de " +
          (s.compito.fonte === "ascolto" ? "la escucha" : s.compito.fonte === "entrambi" ? "la lectura y la escucha" : "la lectura") });
    return out;
  }
  // «radio»: the mission of the Radio series (radio.js), played here.
  function handles(kind) { return kind === "tr-asc" || kind === "tr-scr" || kind === "tr-brv" || kind === "radio"; }
  function owns(screen) { return screen === "tramo-asc" || screen === "tramo-scr" || screen === "tramo-brv"; }
  function go(kind, arg, from) {
    open(kind === "tr-asc" ? "asc" : kind === "tr-brv" ? "brv" : kind === "radio" ? "rad" : "scr", +arg, from || "briefing");
  }

  function R() { return root.Radio || null; }
  function open(kind, weekN, from) {
    var s = kind === "rad" ? (R() ? R().asWeek(weekN) : null) : week(weekN);
    if (!s || (kind === "brv" && !s.breve)) return;
    stop();
    cur = { kind: kind, week: weekN, s: s, from: from || "briefing", plays: 0, done: null, check: null, ai: null, ficha: null };
    // the first task of a genre starts with its ficha
    if (kind === "scr" && fichaOf((D().GENRES || {})[s.compito.genre]) && !store().fichas[s.compito.genre]) cur.ficha = 0;
    H.show(kind === "asc" || kind === "rad" ? "tramo-asc" : kind === "brv" ? "tramo-brv" : "tramo-scr");
  }
  function back() {
    stop();
    var from = cur ? cur.from : "briefing";
    cur = null;
    if (from === "leggi") H.go("leggi"); else H.toWeek();
  }

  /* ---------------------------------------------------------- escucha */

  function stop() {
    playing = 0;
    if (root.speechSynthesis) try { root.speechSynthesis.cancel(); } catch (e) { /* */ }
  }

  // Questions in the target language, or in Spanish (a.qlang "es": the
  // Radio series up to week 13); then true / false / not said, or «does it
  // say it?» (a.info, the Radio series).
  function questionsHtml(a, locked) {
    var vf = VF(), ql = a.qlang === "es" ? "" : langAttr(), html = '<ol class="equestions">';
    a.questions.forEach(function (q, i) {
      html += "<li><b" + ql + ">" + esc(q[0]) + "</b>" + cur.order[i].map(function (o) {
        return '<label class="eopt"' + ql + '><input type="radio" name="tq' + i + '" value="' + esc(o) + '"' + (locked ? " disabled" : "") + "> " + esc(o) + "</label>";
      }).join("") + "</li>";
    });
    if (a.info) {
      return html + "</ol><h3" + ql + ">" + esc(a.infoPrompt || "¿Lo dice o no lo dice?") + '</h3><ol class="equestions">' + a.info.map(function (v, i) {
        return "<li><span" + ql + ">" + esc(v[0]) + "</span>" + [a.infoYes || "Lo dice", a.infoNo || "No lo dice"].map(function (o, k) {
          return '<label class="eopt"' + ql + '><input type="radio" name="ti' + i + '" value="' + (k === 0 ? "y" : "n") + '"' + (locked ? " disabled" : "") + "> " + esc(o) + "</label>";
        }).join("") + "</li>";
      }).join("") + "</ol>";
    }
    html += "</ol><h3" + langAttr() + ">" + esc(vf.prompt) + '</h3><ol class="equestions">';
    a.vf.forEach(function (v, i) {
      html += "<li><span" + langAttr() + ">" + esc(v[0]) + "</span>" + vf.options.map(function (o) {
        return '<label class="eopt"' + langAttr() + '><input type="radio" name="tv' + i + '" value="' + esc(o) + '"' + (locked ? " disabled" : "") + "> " + esc(o) + "</label>";
      }).join("") + "</li>";
    });
    return html + "</ol>";
  }

  function renderAsc() {
    var s = cur.s, a = s.ascolto, rad = cur.kind === "rad";
    var head = '<button class="btn ghost" id="trback">← ' + (cur.from === "leggi" ? "a " + esc(H.ui().read) : "a la semana") + "</button>" +
      "<h1>" + (rad ? "📻" : "🎧") + " <span" + langAttr() + ">" + esc(a.title) + "</span></h1>" +
      '<p class="lead">' + (rad ? esc(R().label()) + " · " : "") + "<span" + langAttr() + ">" + esc(a.genre) + "</span> · " + esc(s.level) + " · unas " + scriptWords(a) + " palabras</p>";
    if (!cur.order) cur.order = a.questions.map(function (q) { return H.shuffle(q[1]); });
    var tts = !!root.speechSynthesis;
    if (cur.done) {
      var r = cur.done;
      return head + '<div class="card"><div class="scorebig"><b>' + r.pct + " %</b><span>" + r.ok + " / " + r.n + "</span></div>" +
        '<table class="res">' + r.detail.map(function (d) {
          var dl = a.qlang === "es" ? "" : langAttr();   // the Radio series asks in Spanish up to week 13
          return "<tr><td" + dl + ">" + esc(d[0]) + "</td><td>" + (d[1] ? "✓" : "✗ <span" + dl + ">" + esc(d[2]) + "</span>") + "</td></tr>";
        }).join("") + "</table></div>" +
        (rad ? '<p class="muted small" id="trverdict">' + esc(R().verdict(H.state(), cur.week)) + "</p>" : "") +
        '<div class="card"><h3>Transcripción</h3>' + transcript(a) +
        (tts ? '<div class="row" style="margin-top:10px"><button class="btn" id="trplay">🔊 Escuchar de nuevo con el texto</button><button class="tab" id="trstop">⏹</button></div>' : "") +
        glossHtml(a.gloss) + "</div>" +
        '<div class="row" style="margin-top:12px"><button class="btn" id="trdone">Listo</button>' +
        (rad ? '<button class="tab" id="trredo">🔁 Responder otra vez</button>' : '<button class="tab" id="trwrite">🖋️ Ir a la tarea</button>') + "</div>";
    }
    var who = a.speakers.map(function (n) { return "<b>" + esc(n) + "</b>"; });
    return head + '<div class="card"><p>' + esc(a.es) + "</p>" +
      '<p class="muted small">Hablan ' + (who.length > 2 ? who.slice(0, -1).join(", ") + " y " + who[who.length - 1] + ", con tres voces distintas. "
        : who[0] + " y " + who[1] + ", con dos voces distintas. ") +
      "Leé las preguntas antes, escuchá <b>dos veces</b> y respondé. La transcripción aparece después.</p>" +
      (rad ? glossHtml(a.gloss, "Palabras nuevas, antes de escuchar") : "") +
      (tts ? '<div class="center"><button class="bigplay" id="trplay">🔊</button><p class="muted" id="trstate">' + playState() + "</p>" +
        '<div class="row" style="justify-content:center"><span class="seg">' + [[0.9, "0,9×"], [1, "1×"]].map(function (x) {
          return '<button class="tab' + ((cur.rate || 1) === x[0] ? " on" : "") + '" data-trrate="' + x[0] + '">' + x[1] + "</button>";
        }).join("") + '</span><button class="tab" id="trstop">⏹</button></div></div>'
        : '<p class="note">Este navegador no tiene voces: leé la transcripción en su lugar.</p>' + transcript(a)) +
      questionsHtml(a, false) +
      '<button class="btn wide" id="trdeliver">Entregar</button></div>';
  }
  function playState() {
    return cur.plays >= 2 ? "Dos escuchas hechas: ya podés responder (y volver a escuchar si hace falta)" : "Escucha " + (cur.plays + 1) + " de 2";
  }
  function transcript(a) {
    return '<p class="model"' + langAttr() + ">" + a.turns.map(function (t) {
      return "<b>" + esc(speakerName(a, t[0])) + ":</b> " + esc(t[1]);
    }).join("<br>") + "</p>";
  }
  function glossHtml(g, title) {
    var k = Object.keys(g || {});
    if (!k.length) return "";
    return '<details class="trgloss"><summary>' + esc(title || "Palabras y expresiones") + "</summary><ul>" + k.map(function (w) {
      return "<li><b" + langAttr() + ">" + esc(w) + "</b> — " + esc(g[w]) + "</li>";
    }).join("") + "</ul></details>";
  }

  /* The phone's voices reading a script, part after part: parts are
     [who, text] ("A", "B", "C": VOICE) or, with opts.mono = 0 | 1, the
     paragraphs of a monologue read by one voice.  opts: rate, alive (a
     function: false stops the chain), onend(seconds heard).  Returns
     {stop}.  The tramo and the exam (app.js) use it. */
  function playScript(parts, opts) {
    opts = opts || {};
    var h = { on: true }, i = 0, rate = opts.rate || 1, t0 = Date.now(), guard = null;
    var all = words(parts.map(function (p) { return typeof p === "string" ? p : p[1]; }).join(" "));
    h.stop = function () {
      if (!h.on) return;
      h.on = false; clearTimeout(guard);
      if (root.speechSynthesis) try { root.speechSynthesis.cancel(); } catch (e) { /* */ }
    };
    (function next() {
      if (!h.on || (opts.alive && !opts.alive())) { h.on = false; clearTimeout(guard); return; }
      if (i >= parts.length) {
        h.on = false;
        if (opts.onend) opts.onend(Math.min((Date.now() - t0) / 1000, all / (2.2 * rate)));
        return;
      }
      var p = parts[i++], text = typeof p === "string" ? p : p[1], moved = false;
      // onend, or onerror, or (a voice that never answers) a generous timer
      var step = function () { if (moved) return; moved = true; clearTimeout(guard); next(); };
      guard = setTimeout(step, (words(text) / (1.6 * rate) + 4) * 1000);
      var v = opts.mono != null ? { pitch: opts.mono ? 1.05 : 0.95, vi: opts.mono ? 1 : 0, rate: 1 } : VOICE[p[0]] || VOICE.A;
      H.speak(text, true, 0.95 * rate * v.rate, { keep: true, pitch: v.pitch, vi: v.vi, onend: step, onerror: step });
    })();
    return h;
  }

  // The end of a listening of the tramo: one more play, the button back.
  function played(token, sec) {
    if (playing !== token) return;
    playing = 0;
    cur.plays++;
    H.listened(sec);
    var st = document.getElementById("trstate"), bb = document.getElementById("trplay");
    if (st) st.textContent = playState();
    if (bb) bb.disabled = false;
  }

  function play() {
    var a = cur.s.ascolto, b = document.getElementById("trplay");
    if (playing) return;
    var token = playing = Date.now();
    if (b) b.disabled = true;
    playScript(a.turns, { rate: cur.rate || 1, alive: function () { return playing === token; },
      onend: function (sec) { played(token, sec); } });
  }

  function deliverAsc() {
    var a = cur.s.ascolto, ok = 0, detail = [];
    a.questions.forEach(function (q, i) {
      var sel = document.querySelector('input[name="tq' + i + '"]:checked'), right = !!sel && sel.value === q[2];
      if (right) ok++;
      detail.push([q[0], right, q[2]]);
    });
    (a.info || []).forEach(function (v, i) {
      var sel = document.querySelector('input[name="ti' + i + '"]:checked'), right = !!sel && (sel.value === "y") === v[1];
      if (right) ok++;
      detail.push([v[0], right, v[1] ? a.infoYes : a.infoNo]);
    });
    (a.info ? [] : a.vf).forEach(function (v, i) {
      var sel = document.querySelector('input[name="tv' + i + '"]:checked'), right = !!sel && sel.value === v[1];
      if (right) ok++;
      detail.push([v[0], right, v[1]]);
    });
    var n = a.questions.length + (a.info ? a.info.length : a.vf.length), pct = Math.round(ok / n * 100);
    stop();
    cur.done = { ok: ok, n: n, pct: pct, detail: detail };
    if (cur.kind === "rad") R().record(H.state(), cur.week, cur.done);
    else {
      var t = store(), prev = t.asc[cur.week];
      t.asc[cur.week] = better(prev, { pct: pct, ok: ok, n: n });
    }
    H.gain(ok * 3, "input");
    H.persist();
    H.render();
    root.scrollTo(0, 0);
  }

  /* ---------------------------------------------------- escucha corta */

  // breve: {title, genre, es, speaker, voice (0|1), text: [párrafos],
  //         info: [[afirmación, true|false]], tabella: [[dato, respuesta, [otras formas]]], gloss}
  function renderBrv() {
    var s = cur.s, b = s.breve, tts = !!root.speechSynthesis;
    var head = '<button class="btn ghost" id="trback">← ' + (cur.from === "leggi" ? "a " + esc(H.ui().read) : "a la semana") + "</button>" +
      "<h1>📻 <span" + langAttr() + ">" + esc(b.title) + "</span></h1>" +
      '<p class="lead"><span' + langAttr() + ">" + esc(b.genre) + "</span> · " + esc(s.level) + " · unas " + breveWords(b) + " palabras</p>";
    var text = '<p class="model"' + langAttr() + ">" + b.text.map(esc).join("<br><br>") + "</p>";
    if (cur.done) {
      var r = cur.done;
      return head + '<div class="card"><div class="scorebig"><b>' + r.pct + " %</b><span>" + r.ok + " / " + r.n + "</span></div>" +
        '<table class="res">' + r.detail.map(function (d) {
          return "<tr><td" + langAttr() + ">" + esc(d[0]) + "</td><td>" + (d[1] ? "✓" : "✗ <span" + langAttr() + ">" + esc(d[2]) + "</span>") + "</td></tr>";
        }).join("") + "</table></div>" +
        '<div class="card"><h3>Transcripción</h3>' + text +
        (tts ? '<div class="row" style="margin-top:10px"><button class="btn" id="trplay">🔊 Escuchar de nuevo con el texto</button><button class="tab" id="trstop">⏹</button></div>' : "") +
        glossHtml(b.gloss) + "</div>" +
        '<div class="row" style="margin-top:12px"><button class="btn" id="trdone">Listo</button></div>';
    }
    var yes = LG().code === "pt" ? ["Diz", "Não diz"] : ["Lo dice", "No lo dice"];
    return head + '<div class="card"><p>' + esc(b.es) + "</p>" +
      '<p class="muted small">Habla <b>' + esc(b.speaker) + "</b>, una sola voz, como en la radio o en la estación. " +
      "Leé antes la tabla y las afirmaciones, escuchá <b>dos veces</b> y anotá los datos mientras escuchás. La transcripción aparece después.</p>" +
      (tts ? '<div class="center"><button class="bigplay" id="trplay">🔊</button><p class="muted" id="trstate">' + playState() + "</p>" +
        '<div class="row" style="justify-content:center"><span class="seg">' + [[0.9, "0,9×"], [1, "1×"]].map(function (x) {
          return '<button class="tab' + ((cur.rate || 1) === x[0] ? " on" : "") + '" data-trrate="' + x[0] + '">' + x[1] + "</button>";
        }).join("") + '</span><button class="tab" id="trstop">⏹</button></div></div>'
        : '<p class="note">Este navegador no tiene voces: leé la transcripción en su lugar.</p>' + text) +
      "<h3>Completá la tabla con los datos del audio</h3><table class=\"res\">" + b.tabella.map(function (c, i) {
        return "<tr><td" + langAttr() + ">" + esc(c[0]) + '</td><td><input class="egap" data-cell="' + i + '" autocapitalize="off" autocorrect="off" spellcheck="false"></td></tr>';
      }).join("") + "</table>" +
      "<h3>¿Lo dice el audio?</h3><ol class=\"equestions\">" + b.info.map(function (v, i) {
        return "<li><span" + langAttr() + ">" + esc(v[0]) + "</span>" + yes.map(function (o, k) {
          return '<label class="eopt"><input type="radio" name="tb' + i + '" value="' + (k === 0 ? "y" : "n") + '"> ' + o + "</label>";
        }).join("") + "</li>";
      }).join("") + "</ol>" +
      '<button class="btn wide" id="trdeliver">Entregar</button></div>';
  }

  function playBrv() {
    var b = cur.s.breve, btn = document.getElementById("trplay");
    if (playing) return;
    var token = playing = Date.now();
    if (btn) btn.disabled = true;
    playScript(b.text, { rate: cur.rate || 1, mono: b.voice === 1 ? 1 : 0, alive: function () { return playing === token; },
      onend: function (sec) { played(token, sec); } });
  }

  function deliverBrv() {
    var b = cur.s.breve, ok = 0, detail = [];
    b.tabella.forEach(function (c, i) {
      var inp = document.querySelector('[data-cell="' + i + '"]'), right = !!inp && cellOk(inp.value, c);
      if (right) ok++;
      detail.push([c[0], right, c[1]]);
    });
    var yes = LG().code === "pt" ? ["Diz", "Não diz"] : ["Lo dice", "No lo dice"];
    b.info.forEach(function (v, i) {
      var sel = document.querySelector('input[name="tb' + i + '"]:checked'), right = !!sel && (sel.value === "y") === v[1];
      if (right) ok++;
      detail.push([v[0], right, v[1] ? yes[0] : yes[1]]);
    });
    var n = b.tabella.length + b.info.length, pct = Math.round(ok / n * 100);
    stop();
    cur.done = { ok: ok, n: n, pct: pct, detail: detail };
    var t = store(), prev = t.brv[cur.week];
    t.brv[cur.week] = better(prev, { pct: pct, ok: ok, n: n });
    H.gain(ok * 2, "input");
    H.persist();
    H.render();
    root.scrollTo(0, 0);
  }

  /* ------------------------------------------------------------ tarea */

  /* ------------------------------------------------ la ficha del género */

  function fichaOf(g) { return g && Array.isArray(g.ficha) && g.ficha.length ? g.ficha : null; }

  // One screen of the genre's ficha: what it is for, structure, formulas,
  // verbs, an annotated model.
  function fichaHtml(genre, i) {
    var g = (D().GENRES || {})[genre] || {}, f = fichaOf(g);
    if (!f) return "";
    i = Math.max(0, Math.min(f.length - 1, i || 0));
    var x = f[i], html = '<div class="card ficha"><p class="muted small">📐 Ficha del género · ' + (i + 1) + " de " + f.length + "</p>" +
      "<h2" + langAttr() + ">" + esc(x.h) + "</h2>" + (x.p ? "<p>" + esc(x.p) + "</p>" : "");
    if (x.list && x.list.length) html += '<table class="res">' + x.list.map(function (r) {
      return "<tr><td" + langAttr() + "><b>" + esc(r[0]) + "</b></td><td>" + esc(r[1] || "") + "</td></tr>";
    }).join("") + "</table>";
    if (x.model && x.model.length) html += x.model.map(function (r) {
      return '<p class="model"' + langAttr() + ">" + esc(r[0]) + '</p><p class="muted small">↑ ' + esc(r[1] || "") + "</p>";
    }).join("");
    return html + "</div>";
  }

  function renderFicha() {
    var c = cur.s.compito, g = (D().GENRES || {})[c.genre] || {}, f = fichaOf(g), i = cur.ficha, last = i >= f.length - 1;
    return '<button class="btn ghost" id="trback">← ' + (cur.from === "leggi" ? "a " + esc(H.ui().read) : "a la semana") + "</button>" +
      "<h1>📐 <span" + langAttr() + ">" + esc(g.name || c.genre) + "</span></h1>" +
      '<p class="lead">Antes de escribir: para qué sirve el género, quién escribe a quién y con qué fórmulas.</p>' +
      fichaHtml(c.genre, i) +
      '<div class="row" style="margin-top:12px">' + (i > 0 ? '<button class="tab" id="trfprev">← Anterior</button>' : "") +
      '<button class="btn" id="trfnext">' + (last ? "🖋️ A escribir" : "Siguiente →") + "</button>" +
      (last ? "" : '<button class="tab" id="trfskip">Ir a la tarea</button>') + "</div>";
  }
  function fichaDone() {
    var t = store();
    if (!t.fichas[cur.s.compito.genre]) { t.fichas[cur.s.compito.genre] = Date.now(); H.persist(); }
    cur.ficha = null;
    H.render();
    root.scrollTo(0, 0);
  }

  function renderScr() {
    if (cur.ficha != null) return renderFicha();
    if (H.lexicon) H.lexicon();   // the checker knows every word of the course (readings included)
    var s = cur.s, c = s.compito, g = (D().GENRES || {})[c.genre] || {}, t = store(), rec = t.scr[cur.week];
    var draft = t.draft[cur.week] != null ? t.draft[cur.week] : (rec && rec.t) || "";
    var fonte = c.fonte === "ascolto" ? ["asc", "🎧 Volver a escuchar"] : ["read", "📰 Releer el texto"];
    var html = '<button class="btn ghost" id="trback">← ' + (cur.from === "leggi" ? "a " + esc(H.ui().read) : "a la semana") + "</button>" +
      "<h1>🖋️ <span" + langAttr() + ">" + esc(c.title) + "</span></h1>" +
      '<p class="lead">Tarea · ' + esc(g.name || c.genre) + " · " + esc(s.level) + " · semana " + cur.week + "</p>" +
      '<div class="card"><p' + langAttr() + ">" + esc(c.t) + "</p>" +
      '<p class="muted small">' + esc(c.es) + "</p>" +
      '<div class="row"><button class="tab" id="trsrc" data-src="' + fonte[0] + '">' + fonte[1] + "</button>" +
      (c.fonte === "entrambi" ? '<button class="tab" id="trsrc2">🎧 Volver a escuchar</button>' : "") +
      (fichaOf(g) ? '<button class="tab" id="trficha">📐 Ficha del género</button>' : "") + "</div>" +
      (g.hint ? '<p class="muted small">📐 ' + esc(g.hint) + "</p>" : "") + structsLine(cur.week) + "</div>" +
      '<textarea id="trtext" class="grow scrivi" rows="12" spellcheck="false" autocapitalize="sentences"' + langAttr() + ">" + esc(draft) + "</textarea>" +
      '<p class="muted small" id="trcount">' + countLine(draft) + "</p>" +
      '<div class="row" style="margin-top:10px"><button class="btn" id="trcheck">🔎 Revisar y entregar</button>' +
      '<button class="tab" id="trmodel">👀 Modelo</button></div>' +
      '<div id="trout">' + (cur.check ? checkHtml(cur.check, draft) : "") + "</div>";
    return html;
  }
  // The structures of the week's short text, asked here too (F §2.2).
  function structsLine(weekN) {
    var S = root.Scrivi, t = S && S.TASKS ? S.TASKS[weekN] : null;
    if (!t || !t.use || !t.use.length) return "";
    return '<p class="muted small">✍️ Usá también lo de la semana: ' + t.use.map(function (u) { return esc(u[2]); }).join(" · ") + "</p>";
  }
  function countLine(text) {
    var c = cur.s.compito, n = words(text);
    return n + " palabras · pedido: " + c.min + "–" + c.max + (n < c.min ? " · faltan " + (c.min - n) : n > c.max ? " · sobran " + (n - c.max) : " ✓");
  }

  function checkHtml(r, text) {
    var html = '<div class="card"><h3>' + (r.ok ? "✅ Entregada" : "Todavía no") + " · " + r.score + " / " + r.of + " criterios</h3>" +
      '<ul class="reqs">' + r.crit.map(function (c) {
        return '<li class="' + (c.ok ? "ok" : "") + '">' + (c.ok ? "✓" : c.need ? "✗" : "○") + " " + esc(c.label) + (c.need && !c.ok ? " <small class=\"muted\">(obligatorio)</small>" : "") + "</li>";
      }).join("") + "</ul>" +
      "<h3>Puntos de la consigna</h3><ul class=\"reqs\">" + r.punti.map(function (p) {
        return '<li class="' + (p.ok ? "ok" : "") + '">' + (p.ok ? "✓" : "○") + " " + esc(p.label) + "</li>";
      }).join("") + "</ul>" +
      '<p class="muted small">Es una revisión automática: mide lo que se puede medir (extensión, variedad, consigna, estructura, conectores, errores típicos), no la calidad del texto. ' +
      (H.aiKey() ? "La IA la califica con la rúbrica C1." : "Con una clave de IA (en " + esc(H.ui().me) + "), además se califica con la rúbrica C1.") + "</p>";
    if (r.check && r.check.findings && r.check.findings.length && root.Scrivi && root.Scrivi.markup) {
      html += "<h3>Lo que marcó el corrector</h3><p class=\"model\"" + langAttr() + ">" + root.Scrivi.markup(text, r.check.findings, esc) + "</p>" +
        '<ul class="small">' + r.check.findings.slice(0, 10).map(function (f) { return "<li>" + H.mk(f.msg) + "</li>"; }).join("") + "</ul>";
    }
    if (H.aiKey()) html += cur.ai === "…" ? '<p class="muted">🤖 La IA está leyendo tu texto…</p>'
      : cur.ai && cur.ai.err ? '<p class="muted">🤖 La IA no respondió (' + esc(cur.ai.err) + "). Probá de nuevo más tarde.</p>"
      : cur.ai ? aiHtml(cur.ai) : '<button class="btn" id="trai">🤖 Calificar con la rúbrica C1</button>';
    return html + "</div>";
  }
  function aiHtml(a) {
    var rub = ((LG().exam || {}).rubric) || [];
    return "<h3>🤖 Rúbrica C1: " + a.tot + " / 20</h3><p>" + rub.map(function (x) { return a.p[x[0]] != null ? esc(x[1]) + " " + a.p[x[0]] + "/5" : ""; }).filter(Boolean).join(" · ") + "</p>" +
      (a.comment ? "<p>" + esc(a.comment) + "</p>" : "") +
      (a.errors.length ? '<table class="res">' + a.errors.map(function (e) { return "<tr><td" + langAttr() + ">" + esc(e[0]) + "</td><td" + langAttr() + ">" + esc(e[1]) + "</td></tr>"; }).join("") + "</table>" : "");
  }
  // The AI's answer, only in the shape expected (anything else is dropped).
  function readAI(data) {
    var p = data && typeof data.punteggi === "object" && data.punteggi ? data.punteggi : {}, out = {}, tot = 0;
    Object.keys(p).forEach(function (k) { var v = +p[k]; if (isFinite(v)) { v = Math.max(0, Math.min(5, Math.round(v))); out[k] = v; tot += v; } });
    var errs = Array.isArray(data && data.errori) ? data.errori.filter(function (e) { return Array.isArray(e) && e.length >= 2; })
      .slice(0, 8).map(function (e) { return [String(e[0]), String(e[1])]; }) : [];
    var comment = data && typeof data.commento === "string" ? data.commento : "";
    return Object.keys(out).length ? { p: out, tot: Math.min(20, tot), comment: comment, errors: errs } : null;
  }

  function saveDraft(text) {
    var t = store();
    t.draft[cur.week] = String(text).slice(0, 6000);
    H.persist();
  }

  function deliverScr() {
    var box = document.getElementById("trtext");
    if (!box) return;
    var text = box.value, c = cur.s.compito;
    clearTimeout(saveTimer);
    saveDraft(text);
    var r = evaluate(c, text, cur.week, cur.s);
    cur.check = r;
    cur.ai = null;
    var t = store(), prev = t.scr[cur.week];
    var miss = r.crit.filter(function (x) { return x.need && !x.ok; }).map(function (x) {
      return x.id === "len" ? "extensión" : x.id === "var" ? "variedad léxica" : x.id === "own" ? "reformular con tus palabras" : "puntos de la consigna";
    }).join(", ");
    var rec = { ok: r.ok, n: r.n, score: r.score, of: r.of, punti: r.puntiOk, hard: r.check.hard, miss: miss, t: text.slice(0, 6000), at: Date.now(),
                ai: prev && prev.t === text ? prev.ai : null };
    if (!prev || !prev.ok || r.ok) t.scr[cur.week] = rec;
    // what the checker marked goes to the error profile, once per text (F §2.2)
    if (H.recordFindings && !(prev && prev.t === text)) H.recordFindings(r.check.findings, text, r.registro);
    if (r.ok && !(prev && prev.ok)) { H.gain(20 + Math.round(r.n / 10), "output"); H.toast("🖋️ Tarea entregada · " + r.n + " palabras"); }
    H.persist();
    var out = document.getElementById("trout");
    if (out) out.innerHTML = checkHtml(r, text);
    wireOut();
    if (out) out.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  function runAI() {
    var box = document.getElementById("trtext");
    if (!box || !root.Scrivi || !root.Scrivi.esame) return;
    var text = box.value, c = cur.s.compito, mine = cur, week0 = cur.week;
    cur.ai = "…";
    refreshOut(text);
    root.Scrivi.esame({ t: c.t, words: c.min + "-" + c.max }, text, H.aiKeys(), function (err, data) {
      if (cur !== mine) return;   // the learner left: nothing to show
      var a = err ? null : readAI(data);
      cur.ai = a || { err: err ? String(err.message || err) : "respuesta sin la forma esperada" };
      if (a) {
        var t = store(), rec = t.scr[week0];
        if (rec && rec.t === text) {
          if (!rec.ai && H.recordRows) H.recordRows(a.errors, mine.check && mine.check.registro);
          rec.ai = { tot: a.tot }; H.persist();
        }
      }
      if (H.screen() === "tramo-scr") refreshOut(text);
    });
  }
  function refreshOut(text) {
    var out = document.getElementById("trout");
    if (out && cur.check) { out.innerHTML = checkHtml(cur.check, text); wireOut(); }
  }
  function wireOut() {
    var b = document.getElementById("trai");
    if (b) b.onclick = runAI;
  }

  /* ----------------------------------------------------- en «Leggi» */

  function leggiHtml(state) {
    var list = D().SETTIMANE || [];
    if (!list.length) return "";
    var t = store(state), unlocked = Math.min(state.unlocked || 1, 52);
    var html = "<h2>🎧 " + esc(D().names && D().names.ascolto || "Escuchas largas") + "</h2>" +
      '<p class="muted">De la semana 27 en adelante, una escucha larga a dos voces por semana, con preguntas en ' + H.langName() + '. Se abren con su semana.</p><div class="eps">';
    list.forEach(function (s) {
      var open = s.week <= unlocked, d = t.asc[s.week];
      html += '<button class="ep' + (d ? " done" : "") + '" data-trasc="' + s.week + '"' + (open ? "" : " disabled") + ">" +
        '<span class="e">' + (open ? "🎧" : "🔒") + "</span><span><b" + langAttr() + ">" + esc(s.ascolto.title) + "</b>" +
        '<span class="muted">semana ' + s.week + " · " + esc(s.level) + " · " + (open ? "<span" + langAttr() + ">" + esc(s.ascolto.genre) + "</span>" : "se abre en la semana " + s.week) + "</span></span>" +
        (d ? '<span class="score">' + d.pct + "%</span>" : "") + "</button>";
    });
    html += "</div>";
    var brevi = list.filter(function (s) { return s.breve; });
    if (!brevi.length) return html;
    html += "<h2>📻 " + esc(D().names && D().names.breve || "Escuchas cortas") + "</h2>" +
      '<p class="muted">Un monólogo breve por semana, como en el examen: noticias, pronósticos, avisos, mensajes, instrucciones y publicidad. Se abren con su semana.</p><div class="eps">';
    brevi.forEach(function (s) {
      var open = s.week <= unlocked, d = t.brv[s.week];
      html += '<button class="ep' + (d ? " done" : "") + '" data-trbrv="' + s.week + '"' + (open ? "" : " disabled") + ">" +
        '<span class="e">' + (open ? "📻" : "🔒") + "</span><span><b" + langAttr() + ">" + esc(s.breve.title) + "</b>" +
        '<span class="muted">semana ' + s.week + " · " + esc(s.level) + " · " + (open ? "<span" + langAttr() + ">" + esc(s.breve.genre) + "</span>" : "se abre en la semana " + s.week) + "</span></span>" +
        (d ? '<span class="score">' + d.pct + "%</span>" : "") + "</button>";
    });
    return html + "</div>";
  }

  /* ------------------------------------------------------------- wire */

  function on(id, fn) { var b = document.getElementById(id); if (b) b.onclick = fn; }

  function wire(screen) {
    document.querySelectorAll("[data-trasc]").forEach(function (b) {
      b.onclick = function () { open("asc", +b.dataset.trasc, "leggi"); };
    });
    document.querySelectorAll("[data-trbrv]").forEach(function (b) {
      b.onclick = function () { open("brv", +b.dataset.trbrv, "leggi"); };
    });
    document.querySelectorAll("[data-radio]").forEach(function (b) {
      b.onclick = function () { open("rad", +b.dataset.radio, "leggi"); };
    });
    if (!owns(screen) && playing) stop();   // left the listening: silence it
    if (!owns(screen) || !cur) return;
    on("trback", back);
    on("trdone", back);
    if (screen === "tramo-asc" || screen === "tramo-brv") {
      on("trplay", screen === "tramo-brv" ? playBrv : play);
      on("trstop", function () { stop(); var b = document.getElementById("trplay"); if (b) b.disabled = false; });
      on("trdeliver", screen === "tramo-brv" ? deliverBrv : deliverAsc);
      on("trwrite", function () { open("scr", cur.week, cur.from); });
      on("trredo", function () { open(cur.kind, cur.week, cur.from); root.scrollTo(0, 0); });
      document.querySelectorAll("[data-trrate]").forEach(function (b) {
        b.onclick = function () { cur.rate = +b.dataset.trrate; stop(); H.render(); };
      });
      return;
    }
    if (cur.ficha != null) {
      var f = fichaOf((D().GENRES || {})[cur.s.compito.genre]) || [];
      on("trfprev", function () { cur.ficha = Math.max(0, cur.ficha - 1); H.render(); root.scrollTo(0, 0); });
      on("trfnext", function () { if (cur.ficha >= f.length - 1) fichaDone(); else { cur.ficha++; H.render(); root.scrollTo(0, 0); } });
      on("trfskip", fichaDone);
      return;
    }
    on("trficha", function () {
      var b = document.getElementById("trtext");
      if (b) { clearTimeout(saveTimer); saveDraft(b.value); }
      cur.ficha = 0; H.render(); root.scrollTo(0, 0);
    });
    var box = document.getElementById("trtext"), cnt = document.getElementById("trcount");
    if (box) {
      box.addEventListener("input", function () {
        if (cnt) cnt.textContent = countLine(box.value);
        clearTimeout(saveTimer);
        var text = box.value;
        saveTimer = setTimeout(function () { saveDraft(text); }, 400);
      });
      box.addEventListener("blur", function () { clearTimeout(saveTimer); saveDraft(box.value); });
    }
    on("trcheck", deliverScr);
    wireOut();
    on("trmodel", function () {
      var out = document.getElementById("trout");
      if (!out) return;
      out.insertAdjacentHTML("afterbegin", '<div class="card"><h3>Un modelo</h3><p class="model"' + langAttr() + ">" +
        esc(cur.s.compito.model).replace(/\n\s*\n/g, "<br><br>") + "</p>" + glossHtml(cur.s.compito.gloss) +
        '<p class="muted small">Es un texto posible, no el único: mirá cómo abre, cómo organiza los párrafos y cómo usa lo leído o escuchado.</p></div>');
      var b = document.getElementById("trmodel");
      if (b) b.disabled = true;
    });
    var src = function (kind) {
      if (box) { clearTimeout(saveTimer); saveDraft(box.value); }
      var from = cur.from, wk = cur.week;
      if (kind === "asc") open("asc", wk, from);
      else H.openReading("l-" + wk);
    };
    var s1 = document.getElementById("trsrc");
    if (s1) s1.onclick = function () { src(s1.dataset.src); };
    on("trsrc2", function () { src("asc"); });
  }

  function render(screen) {
    if (!cur) return '<button class="btn ghost" id="trback">← a la semana</button>';
    return screen === "tramo-asc" ? renderAsc() : screen === "tramo-brv" ? renderBrv() : renderScr();
  }

  // The long readings, as episodes of the «lunga» series (letture.js).
  function episodes() {
    return (D().SETTIMANE || []).map(function (s) {
      var l = s.lettura, e = {};
      Object.keys(l).forEach(function (k) { e[k] = l[k]; });
      e.id = "l-" + s.week; e.week = s.week; e.level = s.level; e.area = null;
      return e;
    });
  }

  // Every word the tramo shows beyond its readings (the listenings and the
  // model texts): the checker's lexicon learns them too.
  function lexTexts() {
    var out = [];
    (D().SETTIMANE || []).forEach(function (s) {
      s.ascolto.turns.forEach(function (t) { out.push(t[1]); });
      if (s.breve) s.breve.text.forEach(function (p) { out.push(p); });
      out.push(s.compito.model);
    });
    return out;
  }

  function attach(host) { H = host; }

  var api = { attach: attach, missions: missions, handles: handles, owns: owns, go: go, open: open, render: render, wire: wire,
              leggiHtml: leggiHtml, episodes: episodes, lexTexts: lexTexts, evaluate: evaluate, variety: variety, connectors: connectors,
              fichaHtml: fichaHtml, sourceUse: sourceUse, countList: countList, fichaOf: fichaOf,
              week: week, weeks: weeks, words: words, copied: copied, readAI: readAI, stop: stop, busy: function () { return !!cur; }, registroOf: registroOf,
              cellOk: cellOk, breveWords: breveWords, playScript: playScript, _deliverAsc: deliverAsc };
  if (typeof module === "object" && module.exports) module.exports = api;
  root.Tramo = api;
})(typeof window !== "undefined" ? window : globalThis);
