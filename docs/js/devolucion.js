/*
 * Las devoluciones: cuándo una respuesta está «cerca» y cuándo no se
 * parece en nada, qué se muestra antes de preguntar la segunda vez, qué
 * dice la consigna cuando el ítem se muestra con opciones, y qué nombres
 * de tiempos y modos puede leer el estudiante según la semana en que va.
 *
 *   Devolucion.far(given, accept, d)   la respuesta no se parece a la correcta
 *                                      («boh», «xx», otra frase): no hay
 *                                      regla que marcar ni error que anotar
 *   Devolucion.near(given, accept, d)  «Casi» de verdad: distancia chica o un
 *                                      error de regla identificado
 *   Devolucion.maskNote(note, answers, stem)   la nota con la respuesta tapada
 *   Devolucion.retryNote(item)         la nota de la segunda vez, tapada, o
 *                                      nada si igual delata la respuesta
 *   Devolucion.choicePrompt(prompt)    «Escribí…» → «Elegí…» para botones
 *   Devolucion.plain(text, week)       los nombres de tiempos y modos que
 *                                      todavía no se enseñaron, en criollo
 *   Devolucion.tidy(d, week)           lo mismo sobre un diagnóstico
 *
 * Después de una respuesta correcta:
 *   Devolucion.slips(given, target)    lo que difiere en una respuesta bien
 *                                      o casi bien (mayúscula, tilde, doble,
 *                                      una letra), palabra por palabra
 *   Devolucion.slipText(s)             «*lunedì* lleva tilde (escribiste…)»
 *   Devolucion.variant(given, item)    la forma aceptada que escribió y las
 *                                      otras que vale aprender («También se
 *                                      dice»)
 *   Devolucion.unsure(o)               correcta pero insegura: pista, segundo
 *                                      intento, repaso de un error, un
 *                                      detalle o mucho tiempo
 *                                      (slowAfter(item) da ese tiempo)
 *   Devolucion.transfer(cat)           la categoría es un calco del español
 *                                      (DEVOLUCION_DATA.transfer)
 *
 * Lo que depende de la lengua (los nombres de los tiempos, la semana en que
 * se enseñan, las categorías que valen aunque la respuesta esté lejos) está
 * en el paquete: docs/lang/<código>/devolucion_data.js (DEVOLUCION_DATA).
 * Las pistas metalingüísticas sirven cuando lo escrito está cerca (Lyster &
 * Ranta 1997); si está lejos, ayuda el modelo completo (Aljaafreh & Lantolf
 * 1994).
 */
(function (root) {
  "use strict";

  function data() { return root.DEVOLUCION_DATA || {}; }
  function groups() {
    var D = root.Diagnosi, L = root.LANG;
    return (D && D.GROUPS) || (L && L.diagGroups) || {};
  }

  /* ---------------------------------------------------------- palabras */

  function deaccent(s) {
    return String(s).normalize("NFD").replace(/[̀-ͯ]/g, "");
  }
  function words(s) {
    var n = root.Engine && root.Engine.normalise ? root.Engine.normalise(s) : String(s == null ? "" : s).toLowerCase();
    return deaccent(n).toLowerCase().replace(/[’`´]/g, "'").replace(/[^a-z0-9'\s-]/g, " ")
      .split(/\s+/).filter(function (w) { return w && w !== "-" && w !== "'"; });
  }
  function lev(a, b) {
    var prev = [], cur, i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      cur = [i];
      for (j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      prev = cur;
    }
    return prev[b.length];
  }
  // Two words that are the same word with a slip or an ending changed.
  // Short words (un / una, di / da, ho / hai) only when they are the same.
  function similar(a, b) {
    if (a === b) return true;
    if (Math.min(a.length, b.length) <= 2) return false;
    return lev(a, b) <= Math.max(1, Math.floor(Math.max(a.length, b.length) / 3));
  }
  function list(accept) {
    return (Array.isArray(accept) ? accept : [accept]).filter(function (x) { return x != null && String(x).trim(); })
      .map(function (x) { return String(x).replace(/\s*\|\s*/g, " "); });
  }
  // The accepted answer nearest to what was written.
  function target(given, accept) {
    var g = words(given), best = null, bestS = -1;
    list(accept).forEach(function (x) {
      var t = words(x);
      var s = t.filter(function (tw) { return g.some(function (gw) { return similar(gw, tw); }); }).length / (t.length || 1);
      if (s > bestS) { bestS = s; best = x; }
    });
    return best;
  }

  // A known word of the language (the package's dictionary), when there is one.
  function isWord(w) {
    var R = root.LANG && root.LANG.rules, test = R && R.isWord ? R.isWord() : null;
    return test ? !!test(w) : false;
  }
  // The diagnosis found a real rule (not «a word is missing», not vocabulary).
  function ruleFound(d) {
    if (!d || !d.cat) return false;
    var G = groups();
    return !(G.generic || {})[d.cat] && !(G.lexical || {})[d.cat] && d.cat !== "vuoto";
  }
  // Categories that are true however far the answer is (all in Spanish).
  function kept(d) {
    return !!(d && d.cat && (data().keep || []).indexOf(d.cat) >= 0);
  }

  /* An answer that does not look like the right one at all: under 40 % of
     the words shared, one word where three or more were asked, or a single
     word that is neither close in spelling nor a form the diagnosis could
     relate to the right one. */
  function far(given, accept, d) {
    if (kept(d)) return false;
    var tg = target(given, accept);
    if (tg == null) return false;
    var g = words(given), t = words(tg);
    if (!g.length || !t.length) return false;
    var matched = t.filter(function (tw) { return g.some(function (gw) { return similar(gw, tw); }); }).length;
    if (t.length === 1) {
      if (g.length > 1) return matched === 0;
      var a = g[0], b = t[0];
      if (similar(a, b)) return false;
      var r = lev(a, b) / Math.max(a.length, b.length);
      if (r < 0.6) return false;
      // «sono» for «ho», «prendo» for «bevo»: another word of the language
      // is a real choice, and the diagnosis says why it is not this one.
      var raw = String(given).toLowerCase().replace(/[’]/g, "'").replace(/[^\p{L}']/gu, "");
      return !(isWord(raw) || isWord(a));
    }
    if (g.length === 1 && t.length >= 3) return true;
    return matched / t.length < 0.4;
  }

  /* «Casi» only when it is: a slip, a small distance, or a rule error on
     an answer that looks like the right one. */
  function near(given, accept, d) {
    if (d && d.verdict === "quasi") return true;
    if (far(given, accept, d)) return false;
    var tg = target(given, accept);
    if (tg == null) return false;
    var g = words(given).join(" "), t = words(tg).join(" ");
    var dist = lev(g, t);
    if (dist <= 2 || dist / Math.max(g.length, t.length, 1) <= 0.25) return true;
    return ruleFound(d);
  }

  // An answer in Spanish is never «Casi», however few letters it changes
  // («Vení acá un momento» for «Vieni qui un momento»).
  function promptVerdict(given, accept, d) {
    if (d && d.inSpanish) return "🔎 Todavía no:";
    return near(given, accept, d) ? "🔎 Casi. Revisalo:" : "🔎 Todavía no. Revisá esto:";
  }

  function farHtml(given, accept) {
    var tg = target(given, accept) || "", many = words(tg).length >= 3;
    return '<div class="diag far"><p>' +
      (many ? "Te faltó casi toda la frase, así que no hay una regla que marcar: acá la tenés entera, con cómo se arma."
            : "Eso no se parece a la respuesta, así que no hay una regla que marcar. Mirá la respuesta y cómo se arma.") +
      "</p></div>";
  }

  /* ------------------------------------------------ la nota, tapada */

  function escRe(s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  // The letters of the answer, accent or not (è/e, á/a): what a note spells.
  var FOLD = { a: "aàáâãä", e: "eèéêë", i: "iìíîï", o: "oòóôõö", u: "uùúûü", c: "cç", n: "nñ" };
  function foldRe(s) {
    return deaccent(s).split("").map(function (ch) {
      var l = ch.toLowerCase();
      return FOLD[l] ? "[" + FOLD[l] + FOLD[l].toUpperCase() + "]" : escRe(ch);
    }).join("").replace(/'/g, "['’]");
  }
  function maskOne(text, w) {
    // after an elided article too (l’ennesima), when the word is not tiny
    var pre = String(w).length >= 3 ? "(^|[^\\p{L}\\p{N}])" : "(^|[^\\p{L}\\p{N}'’])";
    var re = new RegExp(pre + "(" + foldRe(w) + ")(?=$|[^\\p{L}\\p{N}])", "giu");
    return text.replace(re, "$1___");
  }
  /* The rule of the note with the answer covered: on the second try the
     note helps to find the answer, it does not hand it over (Bjork 1994).
     The whole answer, and —for answers of up to three words— each of its
     words that the stem does not already show. */
  function maskNote(note, answers, stem) {
    var out = String(note || "");
    if (!out) return out;
    var all = [];
    (Array.isArray(answers) ? answers : [answers]).forEach(function (a) {
      String(a || "").split(/\s*\|\s*/).forEach(function (x) { x = x.trim().replace(/^[¿¡"«(]+|[.,;:!?…"»)]+$/g, ""); if (x && all.indexOf(x) < 0) all.push(x); });
    });
    all.sort(function (a, b) { return b.length - a.length; });
    var shown = words(String(stem || "").replace(/\([^)]*\)/g, " "));
    all.forEach(function (a) {
      out = maskOne(out, a);
      var ws = String(a).split(/\s+/);
      if (ws.length > 1 && ws.length <= 3) ws.forEach(function (w) {
        w = w.replace(/^[¿¡"«(]+|[.,;:!?"»)]+$/g, "");
        if (w.length >= 3 && shown.indexOf(words(w)[0]) < 0) out = maskOne(out, w);
      });
    });
    return out;
  }

  // The word (accent or not) is in the text, as a word of its own.
  function hasWord(text, w) {
    var pre = String(w).length >= 3 ? "(^|[^\\p{L}\\p{N}])" : "(^|[^\\p{L}\\p{N}'’])";
    return new RegExp(pre + "(" + foldRe(w) + ")(?=$|[^\\p{L}\\p{N}])", "iu").test(String(text || ""));
  }
  /* The note of the second time («🔁 Segunda vez, más fácil»), or nothing.
     With the answer covered, the note may still give it away:
       - by elimination: the conjugation table lists the other option
         («piacerei, piaceresti, piacerebbe, ___, …» with «piaceremmo |
         piacerebbero» below), or its hole is the answer;
       - by showing what had to be heard: a listening item whose note
         spells the sentence.
     Then the item comes with its two options alone: the spacing already
     makes it easier, and retrieving is what fixes it (Bjork 1994). */
  function retryNote(it) {
    if (!it || !it.note) return "";
    var answers = [it.answer].concat(it.accept || []);
    var heard = it.say || (it.frase && (it.type === "listen" || it.type === "dictation") ? it.frase.it : "");
    if (heard) answers.push(heard);
    var out = maskNote(it.note, answers, heard ? "" : it.stem);
    var right = {};
    answers.forEach(function (a) { right[words(a).join(" ")] = 1; });
    // the table of forms with a hole in it: the hole is the answer
    if (/(^|[:,;]\s*)___\s*([,;.]|$)/.test(out) && (out.match(/,/g) || []).length >= 3) return "";
    // what the note writes in the language (*…*) or quotes («…»)
    var lang = (out.match(/\*[^*]*\*|«[^»]*»/g) || []).join(" ");
    var leak = (it.options || []).some(function (o) {
      o = String(o).trim().replace(/^[¿¡"«(]+|[.,;:!?…"»)]+$/g, "");
      if (!o || right[words(o).join(" ")]) return false;
      // a short option («il», «a») only where the note writes the language
      return hasWord(o.length >= 3 ? out : lang, o);
    });
    if (leak) return "";
    // nothing left but the blanks
    if (!/\p{L}{3,}/u.test(out.replace(/___/g, ""))) return "";
    return out;
  }

  /* ---------------------------------------- la consigna de las opciones */

  /* A typed exercise shown as buttons: the prompt says choose, not write
     («Escribí el plural» → «Elegí el plural»). */
  function choicePrompt(p) {
    var s = String(p || "");
    if (!s) return s;
    s = s.replace(/^Escrib[íi](?:lo|la|los|las)? bien:\s*(?:pon[ée]\s+)?/, "Elegí la forma correcta: ")
      .replace(/^Escrib[íi](lo|la|los|las)\b/, "Elegi$1")
      .replace(/^Reescrib[íi] (las|los) /, "Elegí cómo se reescriben $1 ")
      .replace(/^Reescrib[íi] /, "Elegí cómo se reescribe ")
      .replace(/^Traduc[íi] (el|al) /, function (m, a) { return "Elegí la traducción " + (a === "el" ? "del " : "al "); })
      .replace(/^Traduc[íi] /, "Elegí la traducción ")
      .replace(/^Respond[ée] /, "Elegí la respuesta ")
      .replace(/^Conjug[áa] (en [^.]*? )?el verbo/, function (m, t) { return "Elegí " + (t || "") + "la forma del verbo"; })
      .replace(/^Conjug[áa] /, "Elegí la forma de ")
      .replace(/^(Form[áa]|Pon[ée]) /, "Elegí ")
      .replace(/^Escrib[íi](?=[\s:,.;]|$)/, "Elegí")
      // «…: escribí solo lo que falta», «…y escribí su infinitivo»
      .replace(/([:;,]\s*|\by\s+)escrib[íi](?=[\s:,.;]|$)/g, "$1elegí");
    return s;
  }

  /* ------------------------------------------ el metalenguaje, a tiempo */

  var WEEK_OF = null;
  function weekFrom(fn) { WEEK_OF = typeof fn === "function" ? fn : null; }
  function weekNow(w) {
    if (w != null && !isNaN(w)) return +w;
    try { var n = WEEK_OF ? WEEK_OF() : null; return n == null || isNaN(n) ? 52 : +n; } catch (e) { return 52; }
  }
  var COMPILED = null;
  function terms() {
    if (COMPILED) return COMPILED;
    COMPILED = (data().terms || []).map(function (t) {
      return { re: new RegExp(t[0], "giu"), week: t[1], plain: t[2] };
    });
    return COMPILED;
  }
  /* The names of tenses and moods not taught yet, in plain Spanish («Acá va
     congiuntivo» → «Acá va subjuntivo» before its week).  What is between
     asterisks is the language itself and stays as it is. */
  function plain(text, week) {
    if (text == null) return text;
    var s = String(text), T = terms();
    if (!T.length) return s;
    var wk = weekNow(week);
    var due = T.filter(function (t) { return wk < t.week; });
    if (!due.length) return s;
    return s.split(/(\*[^*]*\*)/).map(function (part, i) {
      if (i % 2) return part;
      var changed = false;
      due.forEach(function (t) {
        part = part.replace(t.re, function (m) {
          var r = t.plain;
          var lead = m.charAt(0);
          if (lead && lead === lead.toUpperCase() && lead !== lead.toLowerCase()) r = r.charAt(0).toUpperCase() + r.slice(1);
          changed = true;
          return r;
        });
      });
      // «presente (indicativo)» → «presente»: no empty parentheses or double spaces left
      return changed ? part.replace(/\(\s*\)/g, "").replace(/ {2,}/g, " ").replace(/ +([,.;:)])/g, "$1") : part;
    }).join("");
  }
  // A tense label (the conjugator's) before its week.
  function tense(label, week) { return plain(label, week); }

  // A diagnosis with its words in time: hint, explanation and label.
  function tidy(d, week) {
    if (!d) return d;
    if (d.hint) d.hint = plain(d.hint, week);
    if (d.explain) d.explain = plain(d.explain, week);
    if (d.label) d.label = plain(d.label, week);
    return d;
  }

  /* ------------------------------------------ las respuestas correctas */

  /* After a right answer the feedback helps mostly when the learner was
     unsure or guessed: it corrects the low-confidence right answers that
     would be forgotten (Butler, Karpicke & Roediger 2008); after an easy,
     confident one more text is noise, so it stays short (Hattie &
     Timperley 2007: feedback on the task, at the level the learner is at). */

  // The same text for comparing forms: case, curly quotes and punctuation out.
  function flat(s) {
    return String(s == null ? "" : s).normalize("NFC").toLowerCase().replace(/[’‘`´]/g, "'")
      .replace(/\s*\|\s*/g, " ").replace(/[^\p{L}\p{N}' -]/gu, " ").replace(/\s+/g, " ").trim();
  }
  function toks(s) {
    return String(s == null ? "" : s).replace(/\s*\|\s*/g, " ").trim().split(/\s+/).filter(Boolean);
  }
  function bare(w) {
    return String(w).replace(/^[¿¡"«“(]+|[.,;:!?…"»”)]+$/g, "").replace(/[’‘`´]/g, "'");
  }
  function undouble(s) { return s.replace(/(\p{L})\1/gu, "$1"); }

  /* What a right answer (or an almost right one) wrote differently from the
     accepted form, word by word: the capital of a word inside the sentence,
     a missing or extra accent, a double consonant, the apostrophe, one
     letter.  Nothing when the words are others (another accepted answer,
     another order): that is not a slip. */
  function slips(given, target) {
    var g = toks(given), t = toks(target), out = [];
    if (!g.length || g.length !== t.length) return out;
    for (var i = 0; i < t.length; i++) {
      var a = bare(g[i]), b = bare(t[i]);
      if (a === b) continue;
      var al = a.toLowerCase(), bl = b.toLowerCase(), what;
      if (al === bl) {
        // the first word of the sentence goes either way
        if (i === 0 || /[.!?…]["»”)]?$/.test(t[i - 1])) continue;
        var c = b.charAt(0);
        what = c !== c.toLowerCase() ? "mayus" : "minus";
      } else if (deaccent(al) === deaccent(bl)) {
        what = deaccent(al) === al ? "falta_tilde" : deaccent(bl) === bl ? "sobra_tilde" : "otra_tilde";
      } else if (undouble(al) === undouble(bl)) {
        what = al.length < bl.length ? "falta_doble" : "sobra_doble";
      } else if (deaccent(al).replace(/['-]/g, "") === deaccent(bl).replace(/['-]/g, "")) {
        what = "signo";
      } else if (lev(deaccent(al), deaccent(bl)) <= (bl.length > 5 ? 2 : 1)) {
        what = "letra";
      } else return [];
      out.push({ i: i, g: a, t: b, what: what });
    }
    return out;
  }
  var SLIP = {
    mayus: "va con mayúscula", minus: "va con minúscula",
    falta_tilde: "lleva tilde", sobra_tilde: "va sin tilde", otra_tilde: "lleva otra tilde",
    falta_doble: "lleva consonante doble", sobra_doble: "va con una sola consonante",
    signo: "lleva apóstrofo o guion así", letra: "se escribe así"
  };
  // «*lunedì* lleva tilde (escribiste *lunedi*)»: the language between asterisks.
  function slipText(s) {
    return "*" + s.t + "* " + (SLIP[s.what] || "se escribe así") + " (escribiste *" + s.g + "*)";
  }

  /* The accepted form the learner wrote, and the others worth learning:
     «También se dice: …».  Left out: the same words with other spacing or
     accents (cinque milioni / cinquemilioni), the lists (a, b / a / b), a
     shorter version of what was written (the same words minus some), and
     what the note already says.  Null when there is nothing to add. */
  function variant(given, it) {
    if (!it || !it.answer || /\|/.test(it.answer) || it.options) return null;
    var main = String(it.answer), acc = (it.accept || []).map(String).filter(function (x) { return x.trim(); });
    var g = flat(given);
    var mine = flat(main) === g ? main : acc.filter(function (a) { return flat(a) === g; })[0];
    if (!mine) return null;
    var wroteMain = flat(mine) === flat(main);
    var squash = function (s) { return deaccent(flat(s)).replace(/[ '-]/g, ""); };
    var mw = flat(mine).split(" ");
    var seen = {}, others = [];
    [main].concat(acc).forEach(function (a) {
      var k = flat(a);
      if (seen[k] || k === flat(mine)) return;
      seen[k] = 1;
      if (squash(a) === squash(mine)) return;
      if (/[,\/]/.test(a) && !/[,\/]/.test(main)) return;
      if (a.length > 70) return;
      var aw = k.split(" ");
      if (wroteMain && aw.length < mw.length && aw.every(function (w) { return mw.indexOf(w) >= 0; })) return;
      // what the note already says (the main form always goes, if it was not written)
      if (it.note && hasWord(it.note, bare(a)) && (wroteMain || k !== flat(main))) return;
      others.push(a);
    });
    if (!wroteMain) {
      // the main form first
      others.sort(function (a, b) { return (flat(b) === flat(main)) - (flat(a) === flat(main)); });
    }
    if (!others.length) return null;
    return { mine: mine, main: main, wroteMain: wroteMain, others: others.slice(0, 2) };
  }

  /* When a right answer counts as unsure: it came after a hint or a first
     try, it is the second pass of a missed one, it had a slip, or it took
     long for what it asked (reading the item and typing the answer). */
  function slowAfter(it) {
    it = it || {};
    var stem = String(it.stem || "").length;
    if (it.options) {
      var opts = (it.options || []).join(" ").length;
      return Math.min(60000, 9000 + 60 * stem + 25 * opts);
    }
    var ans = String(it.answer || "").split(/\s*\|\s*/).join(" ").length;
    return Math.min(90000, 10000 + 50 * stem + 600 * ans);
  }
  function unsure(o) {
    o = o || {};
    if (o.hinted || o.retry || o.close || o.fixed) return true;
    return o.ms != null && o.ms > (o.slow != null ? o.slow : slowAfter(o.item));
  }
  // A category of the diagnosis that is a transfer from Spanish (the
  // package's list): after choosing right, «Esquivaste la trampa».
  function transfer(cat) { return !!cat && (data().transfer || []).indexOf(cat) >= 0; }

  var api = {
    far: far, near: near, target: target, promptVerdict: promptVerdict, farHtml: farHtml,
    maskNote: maskNote, retryNote: retryNote, choicePrompt: choicePrompt,
    plain: plain, tense: tense, tidy: tidy, weekFrom: weekFrom, weekNow: weekNow,
    slips: slips, slipText: slipText, variant: variant, unsure: unsure, slowAfter: slowAfter, transfer: transfer,
    _words: words, _lev: lev,
    _reset: function () { COMPILED = null; }
  };
  if (typeof module === "object" && module.exports) module.exports = api;
  root.Devolucion = api;
})(typeof window !== "undefined" ? window : globalThis);
