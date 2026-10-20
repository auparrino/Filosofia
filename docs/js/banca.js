/*
 * El banco: miles de ejercicios generados a partir de data/bank.json
 * (palabras, oraciones, errores típicos del hispanohablante).  Cada ejercicio
 * lleva la regla que pone a prueba, así el diagnóstico puede explicar el
 * error en lugar de mostrar solo la respuesta correcta.
 *
 * Tipos: palabras (en las dos direcciones, con el artículo), artículos,
 * plurales, preposiciones articuladas o contracciones (di + il = del, em + o
 * = no), concordancia del adjetivo, traducción, verbo en contexto, encontrá
 * el error y la clínica de los errores personales.
 *
 * Lo que depende de la lengua lo trae el paquete (LANG.rules.banca): los
 * artículos, las contracciones, los plurales, los adjetivos de concordancia,
 * los niveles del recorrido y qué ejercicios curan qué error.  Esquema de
 * bank.json: el mismo en los dos idiomas (las oraciones guardan el idioma en
 * «it» y las interferencias en «esIt»).
 */
(function (root) {
  "use strict";

  var LANG = root.LANG || {};
  var R = LANG.rules || {};
  var BR = R.banca || {};
  var TX = R.text || {};

  // The language's diagnosis (docs/lang/<code>/diagnosi.js), loaded before.
  var Diagnosi = root.Diagnosi || null;

  var B = null;          // el banco cargado
  var IDX = {};          // índices derivados

  var LEVELS = ["A1", "A2", "B1", "B2", "C1"];

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  function load(bank) {
    B = bank;
    NOUNS = null;
    if (Diagnosi) Diagnosi.init(bank);
    IDX = { noun: {}, sent: {}, err: {}, adj: {}, word: {}, verb: {} };
    B.nouns.forEach(function (n) { IDX.noun[n[0]] = n; });
    B.adjectives.forEach(function (a) { IDX.adj[a[0]] = a; });
    B.words.forEach(function (w) { IDX.word[w[0]] = w; });
    B.verbs.forEach(function (v) { IDX.verb[v[0]] = v; });
    return api;
  }

  function loaded() { return !!B; }

  /* El nivel del recorrido decide qué está al alcance (banca.levels: la
     última semana de A1, A2, B1 y B2 en el temario del idioma). */
  var LV = BR.levels || [8, 18, 30, 42];
  function levelOf(state) {
    var w = (state && state.unlocked) || 1;
    return w <= LV[0] ? "A1" : w <= LV[1] ? "A2" : w <= LV[2] ? "B1" : w <= LV[3] ? "B2" : "C1";
  }
  /* Y la semana del curso decide la gramática: cada oración y cada error
     traen en «w» (traducir, encontrar el error) y «wg» (completar) la
     primera semana en la que todo lo que usan ya se explicó. */
  // The grammar already taught: the open week once its lesson is read, the
  // one before while it is being read (a week's sentences use all of it:
  // the possessives of week 3 are in its fourth part).  The weeks before
  // are done (or the placement test vouched for them).
  function weekOf(state) {
    var w = (state && state.unlocked) || 1;
    if (w > 1 && state && state.read && typeof state.read === "object" && !state.read[w]) w--;
    return w;
  }
  function taught(x, state, key) { return (x[key || "w"] || 1) <= weekOf(state); }
  function within(lvl, max) { return LEVELS.indexOf(lvl) <= LEVELS.indexOf(max); }
  /* -------------------------------------------------------- artículos */

  // The articles of the language (by the gender, and in some languages by
  // the initial sound: lo studente, l'amico).
  function defArt(word, g, plural) { return BR.defArt ? BR.defArt(word, g, plural) : ""; }
  function indefArt(word, g, plural) { return BR.indefArt ? BR.indefArt(word, g, plural) : ""; }

  // The gender in the plural (it can change: il braccio → le braccia).
  function pluralGender(n) { return BR.pluralGender ? BR.pluralGender(n) : n[1]; }

  // The article before the word (an elided one is glued: l'amico).
  function withArt(art, word) { return BR.withArt ? BR.withArt(art, word) : art + " " + word; }

  function nounWithArt(n) { return withArt(defArt(n[0], n[1], false), n[0]); }

  /* ---------------------------------------------------------- palabras */

  function vocabChoice(n, kind) {
    // Idioma → español, reconocer la palabra (las nuevas empiezan acá).
    var pool, stem, ans, id;
    if (kind === "n") {
      stem = nounWithArt(n); ans = n[3]; id = "b:voc:" + n[0];
      pool = B.nouns.filter(function (x) { return x[4] === n[4] && x[3] !== ans; });
      if (pool.length < 3) pool = B.nouns;
    } else if (kind === "v") {
      stem = n[0]; ans = n[1]; id = "b:voc:" + n[0];
      pool = B.verbs.filter(function (x) { return x[1] !== ans; });
    } else if (kind === "a") {
      stem = n[0]; ans = n[4]; id = "b:voc:" + n[0];
      pool = B.adjectives.filter(function (x) { return x[4] !== ans; }).map(function (x) { return [x[0], x[0], x[0], x[4]]; });
    } else {
      stem = n[0]; ans = n[1]; id = "b:voc:" + n[0];
      pool = B.words.filter(function (x) { return x[1] !== ans; });
    }
    var opts = [ans], used = {};
    used[ans] = true;
    shuffle(pool).forEach(function (x) {
      var o = kind === "n" ? x[3] : kind === "a" ? x[3] : x[1];
      if (opts.length < 4 && !used[o]) { used[o] = true; opts.push(o); }
    });
    return { id: id, src: "banca", bank: "voc", type: "choice",
             prompt: "¿Qué significa?", stem: stem, options: shuffle(opts),
             answer: ans, accept: [ans], note: kindNote(n, kind), say: stem };
  }

  function kindNote(n, kind) {
    if (kind === "n") {
      var extra = n[2] !== n[0] ? "Plural: " + withArt(defArt(n[2], pluralGender(n), true), n[2]) + "." : (BR.invariable || "No cambia en plural.");
      return (n[6] ? n[6] + " " : "") + extra;
    }
    if (kind === "v") return BR.verbNote ? BR.verbNote(n) : (n[6] || "");
    if (kind === "a") return n[6] || (n[0] + " · " + n[1] + " · " + n[2] + " · " + n[3]);
    return n[4] || "";
  }

  function vocabWrite(n, kind) {
    // Español → idioma, producirla (los sustantivos con su artículo: ahí
    // aparecen los errores de género, il latte, o leite).
    var ans, prompt, stem;
    if (kind === "n") {
      ans = nounWithArt(n);
      prompt = TX.nounWithArt || "Escribilo con el artículo";
      stem = n[3];
    } else if (kind === "v") { ans = n[0]; prompt = TX.verbInf || "Escribí el infinitivo"; stem = n[1]; }
    else if (kind === "a") { ans = n[0]; prompt = "Escribí el adjetivo (masculino singular)"; stem = n[4]; }
    else { ans = n[0]; prompt = TX.howSay || "¿Cómo se dice?"; stem = n[1]; }
    return { id: "b:voc:" + n[0], src: "banca", bank: "voc", type: "typed",
             prompt: prompt, stem: stem, answer: ans, accept: [ans],
             note: kindNote(n, kind), diag: true, say: ans };
  }

  // La capa de frecuencia (docs/js/frequenza.js), si la app la cargó.
  function Freq() { return root.Freq && root.Freq.loaded() ? root.Freq : null; }

  function vocabSession(state, size) {
    var lvl = levelOf(state), cards = state.cards || {};
    var pool = [];
    B.nouns.forEach(function (n) { if (within(n[5], lvl)) pool.push([n, "n"]); });
    B.verbs.forEach(function (v) { if (within(v[5], lvl)) pool.push([v, "v"]); });
    B.adjectives.forEach(function (a) { if (within(a[5], lvl)) pool.push([a, "a"]); });
    B.words.forEach(function (w) { if (within(w[3], lvl)) pool.push([w, "w"]); });
    var fresh = shuffle(pool.filter(function (x) { return !cards["b:voc:" + x[0][0]]; }));
    // Primero las palabras desconocidas más frecuentes (Nation 2006); el
    // orden al azar dentro de la misma franja mantiene las sesiones variadas.
    var F = Freq();
    if (F) fresh.sort(function (a, b) { return Math.round(F.zipf(b[0][0]) * 2) - Math.round(F.zipf(a[0][0]) * 2); });
    var seen = shuffle(pool.filter(function (x) { return cards["b:voc:" + x[0][0]]; }));
    var out = [];
    // Palabras nuevas: reconocer; conocidas: producir (dificultad deseable).
    fresh.slice(0, 6).forEach(function (x) { out.push(vocabChoice(x[0], x[1])); });
    seen.slice(0, (size || 12) - out.length).forEach(function (x) { out.push(vocabWrite(x[0], x[1])); });
    if (out.length < (size || 12)) {
      fresh.slice(6, 6 + (size || 12) - out.length).forEach(function (x) { out.push(vocabWrite(x[0], x[1])); });
    }
    return shuffle(out);
  }

  /* Una sesión sobre lemas dados (las palabras frecuentes que le faltan al
     alumno, del medidor de cobertura): las entradas del banco, primero para
     reconocer. */
  function vocabSessionFor(state, lemmas, size) {
    var cards = state.cards || {}, out = [];
    (lemmas || []).forEach(function (l) {
      var n = IDX.noun[l] ? [IDX.noun[l], "n"] : IDX.verb[l] ? [IDX.verb[l], "v"] : IDX.adj[l] ? [IDX.adj[l], "a"] : IDX.word[l] ? [IDX.word[l], "w"] : null;
      if (!n || out.length >= (size || 12)) return;
      out.push(cards["b:voc:" + n[0][0]] ? vocabWrite(n[0], n[1]) : vocabChoice(n[0], n[1]));
    });
    return out;
  }
  // ¿Está el lema en el banco (para que el medidor de cobertura lo ofrezca)?
  function hasWord(l) { return !!(IDX.noun[l] || IDX.verb[l] || IDX.adj[l] || IDX.word[l]); }

  /* ------------------------------------------------------------ formas */

  function articleItem(n, plural) {
    var word = plural ? n[2] : n[0];
    var g = plural ? pluralGender(n) : n[1];
    var ans = defArt(word, g, plural);
    return { id: "b:art:" + n[0] + (plural ? ":p" : ":s"), src: "banca", bank: "forme",
             type: "choice", prompt: "Elegí el artículo" + (plural ? " (plural)" : ""),
             stem: "___ " + word + "  (" + n[3] + ")", options: BR.artOptions ? BR.artOptions(plural, ans) : [ans], answer: ans, accept: [ans],
             choiceDiag: { before: "", after: " " + word },
             note: artNote(word, g, plural, n), say: withArt(ans, word) };
  }

  function artNote(word, g, plural, n) {
    var why = BR.artWhy ? BR.artWhy(word, g, n, plural) : "";
    return why + (n[6] ? " " + n[6] : "");
  }

  // Nouns that live in the singular (la fame, a fome, the months): their
  // plural is grammar trivia, not something to drill (banca.countable).
  function countable(n) { return BR.countable ? BR.countable(n) : true; }

  function pluralItem(n) {
    var g = pluralGender(n);
    var artP = defArt(n[2], g, true);
    return { id: "b:pl:" + n[0], src: "banca", bank: "forme", type: "typed",
             prompt: "Escribí el plural", stem: nounWithArt(n) + " → " + artP + " ___",
             answer: n[2], accept: [n[2]], note: pluralNote(n), diag: true,
             say: withArt(artP, n[2]) };
  }

  // Why this plural (banca.pluralNote: -ão → -ões…), with the bank's note.
  function pluralNote(n) { return BR.pluralNote ? BR.pluralNote(n) : (n[6] || ""); }

  /* Articulated prepositions or contractions (banca.contr: di + il = del,
     em + o = no), and in some languages with the indefinite article too
     (banca.indefPreps: em + um = num). */
  var PREPS = BR.preps || [];
  var CONTR = BR.contr || {};
  var CRASE_WEEK = BR.CRASE_WEEK;

  function prepItem(n, prep, plural, indef) {
    var word = plural ? n[2] : n[0], g = plural ? pluralGender(n) : n[1];
    if (!CONTR[prep]) return null;
    indef = !!(indef && (BR.indefPreps || {})[prep]);
    var art = indef ? indefArt(word, g, plural) : defArt(word, g, plural), ans = CONTR[prep][art];
    if (!ans) return null;
    var note = BR.prepNote ? BR.prepNote(prep, art, ans, indef) : "*" + prep + " + " + art + "* = *" + ans + "*.";
    return { id: "b:prep:" + prep + ":" + n[0] + (plural ? ":p" : indef ? ":u" : ""), src: "banca", bank: "forme",
             type: "typed", prompt: "Uní la preposición con el artículo",
             stem: "(" + prep + " + " + art + ") " + word + " → ___ " + word,
             answer: ans, accept: BR.prepAccept ? BR.prepAccept(prep, art, ans, indef) : [ans], diag: true,
             note: note, say: withArt(ans, word) };
  }

  // Adjectives that go with any concrete noun, and the topics of the bank
  // with concrete things (banca.genericAdj, banca.concrete).
  var GENERIC_ADJ = BR.genericAdj || [];
  var CONCRETE = BR.concrete || {};

  function agreeItem(n, adjKey, plural) {
    var a = IDX.adj[adjKey];
    if (!a) return null;
    var g = plural ? pluralGender(n) : n[1];
    var word = plural ? n[2] : n[0];
    var form = plural ? (g === "m" ? a[2] : a[3]) : (g === "m" ? a[0] : a[1]);
    var art = plural ? defArt(word, g, true) : indefArt(word, g, false);
    return { id: "b:agr:" + n[0] + ":" + adjKey + (plural ? ":p" : ""), src: "banca", bank: "forme",
             type: "typed", prompt: "Concordá el adjetivo «" + a[0] + "» (" + a[4] + ")",
             stem: withArt(art, word) + " ___", answer: form, accept: [form], diag: true,
             note: word + " es " + (g === "m" ? "masculino" : "femenino") + (plural ? " plural" : " singular") +
               ": " + a[0] + " → " + form + "." + (n[6] ? " " + n[6] : ""),
             say: withArt(art, word) + " " + form };
  }

  function formsSession(state, size, focus) {
    if ((state.unlocked || 1) < FORME_WEEK) return [];
    var lvl = levelOf(state), wk = state.unlocked || 1;
    var nouns = B.nouns.filter(function (n) { return within(n[5], lvl); });
    if (!nouns.length) return [];
    // Los que más enseñan (banca.special): el artículo por el sonido, los
    // plurales irregulares, los heterogenéricos (con nota).
    var special = nouns.filter(function (n) { return BR.special ? BR.special(n) : !!n[6]; });
    var out = [];
    var kinds = focus ? [focus] : (BR.kinds || ["art", "art", "pl", "prep", "agr"]);
    for (var i = 0; i < (size || 12) * 3 && out.length < (size || 12); i++) {
      var k = pick(kinds), n = pick(Math.random() < 0.6 && special.length ? special : nouns);
      var x = null;
      if (k === "art") x = articleItem(n, Math.random() < 0.4);
      else if (k === "pl") x = countable(n) && (n[2] !== n[0] || Math.random() < 0.3) ? pluralItem(n) : null;
      else if (k === "prep") {
        var pl = Math.random() < 0.3, prep = pick(PREPS), indef = false;
        var g = pl ? pluralGender(n) : n[1];
        // the language may change it (no crase before its week) or use the
        // indefinite article (em + um = num)
        if (BR.prepFor) { var pf = BR.prepFor(prep, g, pl, wk, pick); prep = pf[0]; indef = pf[1]; }
        x = prepItem(n, prep, pl, indef);
      }
      else x = CONCRETE[n[4]] ? agreeItem(n, pick(GENERIC_ADJ), Math.random() < 0.4) : null;
      if (x && !out.some(function (y) { return y.id === x.id; })) out.push(x);
    }
    return out;
  }

  /* ---------------------------------------------------------- oraciones */

  // With or without the subject pronoun (banca.subject): leaving it out is
  // not an error (except before the words of banca.subjectKeep, where the
  // sentence would change).
  function variants(s) {
    var out = s.it.slice();
    s.it.forEach(function (v) {
      var m = BR.subject ? v.match(BR.subject) : null;
      if (m && !(BR.subjectKeep && BR.subjectKeep.test(m[2]))) out.push(m[2].charAt(0).toUpperCase() + m[2].slice(1));
    });
    return out.filter(function (x, i) { return out.indexOf(x) === i; });
  }

  function translateItem(i) {
    var s = B.sentences[i];
    return { id: "b:tr:" + i, src: "banca", bank: "tr", type: "translate",
             prompt: TX.translateTo || "Traducí", stem: s.es, answer: s.it[0], accept: variants(s),
             note: s.note, tags: s.tags, lvl: s.lvl, diag: true, say: s.it[0] };
  }

  // Otras respuestas para el hueco, leídas de las demás variantes aceptadas.
  // Dónde está la forma como palabra entera (no dentro de otra: «è» dentro
  // de «caffè», «é» dentro de «café»).
  function wordAt(text, form) {
    var re = new RegExp("(^|[^A-Za-zÀ-ÿ])" + form.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?![A-Za-zÀ-ÿ])");
    var m = re.exec(text);
    return m ? m.index + m[1].length : -1;
  }

  function gapAccept(s) {
    var main = s.it[0], form = s.gap[0], at = wordAt(main, form), out = [form];
    var pre = main.slice(0, at), post = main.slice(at + form.length);
    var preL = pre.toLowerCase(), postL = post.toLowerCase();
    s.it.slice(1).forEach(function (v) {
      var vl = v.toLowerCase();
      if (post.length && v.length > pre.length + post.length &&
          vl.indexOf(preL) === 0 && vl.slice(-post.length) === postL) {
        var mid = v.slice(pre.length, v.length - post.length).trim();
        if (mid && out.indexOf(mid) < 0 && mid.split(" ").length <= 4) out.push(mid);
      }
    });
    return out;
  }

  function gapItem(i) {
    var s = B.sentences[i];
    if (!s.gap) return null;
    var main = s.it[0], at = wordAt(main, s.gap[0]);
    if (at < 0) return null;
    var stem = main.slice(0, at) + "___ (" + s.gap[1] + ")" + main.slice(at + s.gap[0].length);
    return { id: "b:gap:" + i, src: "banca", bank: "gap", type: "typed",
             prompt: "Completá: «" + s.es + "»", stem: stem, answer: s.gap[0], accept: gapAccept(s),
             note: s.note, tags: s.tags, lvl: s.lvl, diag: true, context: main, say: main };
  }

  function errorItem(i) {
    var e = B.errors[i];
    return { id: "b:err:" + i, src: "banca", bank: "err", type: "fixerr",
             prompt: TX.findError || "Encontrá el error: tocá la palabra que está mal", stem: e.wrong,
             answer: e.right, accept: [e.right], bad: e.bad, good: e.good, goodAlt: e.alt || [],
             cat: e.cat, note: e.why, lvl: e.lvl, say: e.right };
  }

  function sentencePool(state, pred, key) {
    var lvl = levelOf(state), out = [];
    B.sentences.forEach(function (s, i) {
      if (within(s.lvl, lvl) && taught(s, state, key) && (!pred || pred(s))) out.push(i);
    });
    return out;
  }

  function prefer(state, ids, prefix) {
    // Primero las vencidas, después las nuevas, después el resto.
    var cards = state.cards || {}, now = Date.now();
    var due = ids.filter(function (i) { var c = cards[prefix + i]; return c && c.due <= now; });
    var fresh = ids.filter(function (i) { return !cards[prefix + i]; });
    var rest = ids.filter(function (i) { var c = cards[prefix + i]; return c && c.due > now; });
    return shuffle(due).concat(shuffle(fresh), shuffle(rest));
  }

  /* Traducir necesita artículos y un verbo detrás; las formas, los
     artículos y las preposiciones articuladas o contracciones (semana 3).
     Antes, el banco es una pared de posesivos y plurales que nadie explicó. */
  var TR_WEEK = 5, GAP_WEEK = 5, FORME_WEEK = 3;

  function translateSession(state, size, tagFilter) {
    if ((state.unlocked || 1) < TR_WEEK) return [];
    var ids = sentencePool(state, tagFilter && function (s) {
      return s.tags.some(function (t) { return tagFilter.indexOf(t) >= 0; });
    });
    return prefer(state, ids, "b:tr:").slice(0, size || 8).map(translateItem);
  }

  function gapSession(state, size, tagFilter) {
    if ((state.unlocked || 1) < GAP_WEEK) return [];
    var ids = sentencePool(state, function (s) {
      return s.gap && (!tagFilter || s.tags.some(function (t) { return tagFilter.indexOf(t) >= 0; }));
    }, "wg");
    return prefer(state, ids, "b:gap:").slice(0, size || 10).map(gapItem).filter(Boolean);
  }

  /* ¿Qué preposición va?  Una oración del banco con una preposición (o una
     contracción: no, do, pelo, alla, nel) borrada y cuatro opciones; la
     oración en español al lado para que no haya dos respuestas posibles.
     Es lo que más le cuesta a un hispanohablante y acá se reconoce antes de
     escribirse. */
  function prepList() {
    var D = root.ESCRITOS_DATA || {}, arts = {};
    Object.keys(CONTR).forEach(function (p) { Object.keys(CONTR[p]).forEach(function (a) { arts[a] = 1; }); });
    return (D.prep || []).filter(function (w) { return !arts[w]; });
  }
  // The words of a list in a sentence (not the first one, unless anyCase:
  // a connector often opens the sentence, «Ma…», «Quindi…»).
  function wordTokens(text, list, anyCase) {
    var out = [], re = /[A-Za-zÀ-ÖØ-öø-ÿ]+/g, m, k = 0;
    while ((m = re.exec(text))) {
      var w = anyCase ? m[0].toLowerCase() : m[0];
      if ((k > 0 || anyCase) && list.indexOf(w) >= 0) out.push({ at: m.index, w: m[0] });
      k++;
    }
    return out;
  }
  function prepTokens(text, preps) { return wordTokens(text, preps, false); }
  function prepChoiceItem(i, pos) {
    var s = B && B.sentences[i], preps = prepList();
    if (!s || !preps.length) return null;
    var main = s.it[0], toks = prepTokens(main, preps), t = toks.filter(function (x) { return x.at === +pos; })[0];
    if (!t) return null;
    var D = root.ESCRITOS_DATA || {}, same = [t.w];
    (D.equiv || []).forEach(function (g) { if (g.indexOf(t.w) >= 0) same = same.concat(g); });
    var stem = main.slice(0, t.at) + "___" + main.slice(t.at + t.w.length);
    // a distractor that makes one of the accepted versions is not wrong
    var fits = function (o) { return s.it.some(function (v) { return v === main.slice(0, t.at) + o + main.slice(t.at + t.w.length); }); };
    var opts = [t.w], seed = i * 31 + t.at;
    var pool = preps.filter(function (o) { return same.indexOf(o) < 0 && !fits(o); });
    // the same seed gives the same options (the card comes back the same)
    for (var j = 0; opts.length < 4 && j < pool.length * 3; j++) {
      var o = pool[(seed + j * 7) % pool.length];
      if (opts.indexOf(o) < 0) opts.push(o);
    }
    if (opts.length < 3) return null;
    return { id: "b:pc:" + i + ":" + t.at, src: "banca", bank: "pc", type: "choice",
             prompt: TX.prepChoice || "¿Qué preposición va? («" + s.es + "»)", stem: stem,
             options: shuffle(opts), answer: t.w, accept: same.filter(function (x) { return x.indexOf(" ") < 0; }),
             note: s.note || "", tags: s.tags, lvl: s.lvl, diag: false, cat: "preposicion", say: main };
  }
  function prepChoiceSession(state, size, tagFilter) {
    var preps = prepList();
    if (!B || !preps.length) return [];
    var ids = sentencePool(state, function (s) {
      return (!tagFilter || (s.tags || []).some(function (t) { return tagFilter.indexOf(t) >= 0; })) && prepTokens(s.it[0], preps).length;
    }, "w");
    return prefer(state, ids, "b:pc:").slice(0, (size || 8) * 2).map(function (i) {
      var tk = prepTokens(B.sentences[i].it[0], preps);
      return prepChoiceItem(i, tk[(i * 7) % tk.length].at);
    }).filter(Boolean).slice(0, size || 8);
  }

  /* ¿Qué conector va?  Lo mismo con los conectores (pero, entonces,
     aunque, mientras…): lo que ordena un texto y lo que pide un C1.  Sin
     los cortos que entran en casi cualquier lado (e, o, se). */
  var LOOSE_CONN = { e: 1, ed: 1, o: 1, ou: 1, se: 1, "né": 1, nem: 1, antes: 1, logo: 1, assim: 1 };
  function connList() {
    return ((root.ESCRITOS_DATA || {}).conn || []).filter(function (w) { return w.indexOf(" ") < 0 && !LOOSE_CONN[w]; });
  }
  function connChoiceItem(i, pos) {
    var s = B && B.sentences[i], conns = connList();
    if (!s || conns.length < 4) return null;
    var main = s.it[0], t = wordTokens(main, conns, true).filter(function (x) { return x.at === +pos; })[0];
    if (!t) return null;
    var low = t.w.toLowerCase(), D = root.ESCRITOS_DATA || {}, same = [low];
    (D.equiv || []).forEach(function (g) { if (g.indexOf(low) >= 0) same = same.concat(g); });
    var cap = function (o) { return t.w[0] !== low[0] ? o[0].toUpperCase() + o.slice(1) : o; };
    var fits = function (o) { return s.it.some(function (v) { return v === main.slice(0, t.at) + cap(o) + main.slice(t.at + t.w.length); }); };
    var pool = conns.filter(function (o) { return same.indexOf(o) < 0 && !fits(o); }), opts = [low], seed = i * 17 + t.at;
    for (var j = 0; opts.length < 4 && j < pool.length * 3; j++) {
      var o = pool[(seed + j * 5) % pool.length];
      if (opts.indexOf(o) < 0) opts.push(o);
    }
    var stem = main.slice(0, t.at) + "___" + main.slice(t.at + t.w.length);
    return { id: "b:cc:" + i + ":" + t.at, src: "banca", bank: "cc", type: "choice",
             prompt: "¿Qué palabra va? («" + s.es + "»)", stem: stem, options: shuffle(opts), answer: low,
             accept: same.filter(function (x) { return x.indexOf(" ") < 0; }), note: s.note || "", tags: s.tags, lvl: s.lvl, cat: "conector", say: main };
  }
  function connChoiceSession(state, size) {
    var conns = connList();
    if (!B || conns.length < 4) return [];
    // not a question that opens with it («Quando você vai voltar?»: there it is «cuándo»)
    var ids = sentencePool(state, function (s) { return !/\?\s*$/.test(s.it[0]) && wordTokens(s.it[0], conns, true).length; }, "w");
    return prefer(state, ids, "b:cc:").slice(0, (size || 6) * 2).map(function (i) {
      var tk = wordTokens(B.sentences[i].it[0], conns, true);
      return connChoiceItem(i, tk[(i * 5) % tk.length].at);
    }).filter(Boolean).slice(0, size || 6);
  }

  /* ¿Cuál está bien?  La misma oración dos veces, una con el error típico
     del hispanohablante: reconocerlo antes de tener que encontrarlo. */
  function whichItem(i) {
    var e = B && B.errors[i];
    if (!e || !e.wrong || !e.right || e.wrong === e.right) return null;
    return { id: "b:cual:" + i, src: "banca", bank: "cual", type: "choice",
             prompt: "¿Cuál está bien?", stem: "", options: shuffle([e.right, e.wrong]), answer: e.right, accept: [e.right],
             cat: e.cat, note: e.why, lvl: e.lvl, say: e.right };
  }
  function whichSession(state, size, cats) {
    if ((state.unlocked || 1) < ERR_WEEK) return [];
    var ids = [];
    B.errors.forEach(function (e, i) {
      if (within(e.lvl, levelOf(state)) && taught(e, state) && (!cats || cats.indexOf(e.cat) >= 0)) ids.push(i);
    });
    return prefer(state, ids, "b:cual:").slice(0, size || 6).map(whichItem).filter(Boolean);
  }

  /* Las formas de todos los verbos del conjugador (forma → [[infinitivo,
     tiempo, persona]]), para reconocer un verbo en una oración y armar la
     forma paralela de otro verbo.  Se arma una vez, la primera vez que hace
     falta. */
  var VFORMS = null;
  function verbForms() {
    if (VFORMS) return VFORMS;
    var C = root.Conj, map = {};
    if (!C || !C.list) return map;
    C.list().forEach(function (inf) {
      (C.SIMPLE_TENSES || []).forEach(function (t) {
        var forms;
        try { forms = C.conjugate(inf, t, { partial: true }); } catch (e) { return; }
        (forms || []).forEach(function (f, pp) {
          if (!f) return;
          var w = String(f).split(" ").pop().toLowerCase();
          (map[w] = map[w] || []).push([inf, t, pp]);
        });
      });
      try { var pc = C.participle(inf); if (pc) (map[pc] = map[pc] || []).push([inf, "participio", -1]); } catch (e) { /* */ }
    });
    VFORMS = map;
    return map;
  }
  function tokensOf(text) {
    var out = [], re = /[A-Za-zÀ-ÖØ-öø-ÿ]+/g, m;
    while ((m = re.exec(text))) out.push({ at: m.index, w: m[0], low: m[0].toLowerCase(), hy: text[m.index - 1] === "-" });
    return out;
  }
  function capLike(model, w) { return model[0] !== model[0].toLowerCase() ? w[0].toUpperCase() + w.slice(1) : w; }
  function variantFits(s, at, len, o) { return s.it.some(function (v) { return v === s.it[0].slice(0, at) + o + s.it[0].slice(at + len); }); }

  /* ¿Qué verbo va?  El par que confunde (essere/avere, ser/estar): la forma
     de la oración y la del otro verbo en el mismo tiempo y persona. */
  function verbPairItem(i, pos) {
    var s = B && B.sentences[i], pair = BR.verbPair, C = root.Conj;
    if (!s || !pair || !C) return null;
    var main = s.it[0], t = tokensOf(main).filter(function (x) { return x.at === +pos; })[0];
    if (!t) return null;
    var an = verbForms()[t.low] || [];
    // only a form of the pair, and of nothing else (pt «for»: ser or ir)
    if (!an.length || !an.every(function (a) { return pair.indexOf(a[0]) >= 0; })) return null;
    var alts = [];
    an.forEach(function (a) {
      if (a[1] === "participio") return;
      var other = a[0] === pair[0] ? pair[1] : pair[0], f;
      try { f = (C.conjugate(other, a[1], { partial: true }) || [])[a[2]]; } catch (e) { f = null; }
      if (!f) return;
      f = capLike(t.w, String(f).split(" ").pop().toLowerCase());
      if (f.toLowerCase() !== t.low && alts.indexOf(f) < 0 && !variantFits(s, t.at, t.w.length, f)) alts.push(f);
    });
    if (!alts.length) return null;
    var stem = main.slice(0, t.at) + "___" + main.slice(t.at + t.w.length);
    return { id: "b:vp:" + i + ":" + t.at, src: "banca", bank: "vp", type: "choice",
             prompt: "¿Qué verbo va? («" + s.es + "»)", stem: stem, options: shuffle([t.w].concat(alts.slice(0, 2))),
             answer: t.w, accept: [t.w], note: s.note || "", tags: s.tags, lvl: s.lvl, cat: "ausiliare", say: main };
  }
  function verbPairTokens(s) {
    var pair = BR.verbPair, vf = verbForms();
    return tokensOf(s.it[0]).filter(function (t, k) {
      // not a name (São Paulo): a capital only at the start
      if (k > 0 && t.w !== t.low) return false;
      var an = vf[t.low];
      return an && an.length && an.every(function (a) { return pair.indexOf(a[0]) >= 0 && a[1] !== "participio"; });
    });
  }
  function verbPairSession(state, size) {
    if (!B || !BR.verbPair || !root.Conj) return [];
    var tags = BR.verbPairTags || [];
    var ids = sentencePool(state, function (x) { return (!tags.length || (x.tags || []).some(function (t) { return tags.indexOf(t) >= 0; })) && verbPairTokens(x).length; }, "w");
    return prefer(state, ids, "b:vp:").slice(0, (size || 6) * 2).map(function (i) {
      var tk = verbPairTokens(B.sentences[i]);
      return verbPairItem(i, tk[(i * 3) % tk.length].at);
    }).filter(Boolean).slice(0, size || 6);
  }

  /* ¿Qué pronombre va?  Un átono (lo, gli, ne; o, lhe, me) delante de un
     verbo o pegado con guion; no el artículo igual (la casa, o livro):
     lo que sigue tiene que ser un verbo y no un sustantivo del banco.  Sin
     el «se» del portugués, que también es «si». */
  // Singular and plural nouns of the bank (le chiavi, as marcas: an article).
  var NOUNS = null;
  function nouns() {
    if (NOUNS) return NOUNS;
    NOUNS = {};
    (B.nouns || []).forEach(function (n) { NOUNS[String(n[0]).toLowerCase()] = 1; if (n[2]) NOUNS[String(n[2]).toLowerCase()] = 1; });
    return NOUNS;
  }
  function cliticTokens(s) {
    var list = BR.clitics || [], vf = verbForms(), tk = tokensOf(s.it[0]);
    return tk.filter(function (t, k) {
      if (k === 0 && !t.hy) return false;
      if (list.indexOf(t.low) < 0 || (t.low === "se" && !t.hy && BR.verbPair && BR.verbPair[0] === "ser")) return false;
      if (t.hy) return true;
      var nx = tk[k + 1];
      if (!nx || !vf[nx.low] || nouns()[nx.low] || s.it[0].slice(t.at + t.w.length, nx.at) !== " ") return false;
      // pt «a» before an infinitive is the preposition (continuar a ser)
      return !(t.low === "a" && /r$/.test(nx.low));
    });
  }
  function cliticItem(i, pos) {
    var s = B && B.sentences[i], list = BR.clitics || [];
    if (!s || list.length < 4) return null;
    var main = s.it[0], t = cliticTokens(s).filter(function (x) { return x.at === +pos; })[0];
    if (!t) return null;
    var pool = list.filter(function (o) { return o !== t.low && !variantFits(s, t.at, t.w.length, capLike(t.w, o)); });
    var opts = [t.w], seed = i * 13 + t.at;
    for (var j = 0; opts.length < 4 && j < pool.length * 3; j++) {
      var o = capLike(t.w, pool[(seed + j * 3) % pool.length]);
      if (opts.indexOf(o) < 0) opts.push(o);
    }
    var stem = main.slice(0, t.at) + "___" + main.slice(t.at + t.w.length);
    return { id: "b:cl:" + i + ":" + t.at, src: "banca", bank: "cl", type: "choice",
             prompt: "¿Qué pronombre va? («" + s.es + "»)", stem: stem, options: shuffle(opts), answer: t.w, accept: [t.w],
             note: s.note || "", tags: s.tags, lvl: s.lvl, cat: "pronome", say: main };
  }
  function cliticSession(state, size) {
    if (!B || !(BR.clitics || []).length) return [];
    var ids = sentencePool(state, function (x) { return cliticTokens(x).length; }, "w");
    return prefer(state, ids, "b:cl:").slice(0, (size || 6) * 2).map(function (i) {
      var tk = cliticTokens(B.sentences[i]);
      return cliticItem(i, tk[(i * 3) % tk.length].at);
    }).filter(Boolean).slice(0, size || 6);
  }

  /* ¿Qué significa acá?  Un falso amigo dentro de una oración: su sentido,
     el que parece en castellano (la trampa) y otros dos. */
  // not the grammar words (di, su, alla, come, mas: there the meaning is
  // the grammar, not a trap)
  function falsoTokens(s) {
    var F = (B && B.falsi) || {}, D = root.ESCRITOS_DATA || {};
    var gram = [].concat(D.prep || [], D.conn || [], BR.clitics || []);
    (B.words || []).forEach(function (w) { if (/interrogativo|preposizione|contrazione|congiunzione|pronome/.test(w[2])) gram.push(String(w[0]).toLowerCase()); });
    return tokensOf(s.it[0]).filter(function (t, k) {
      return t.low.length >= 4 && (k === 0 || t.w === t.low) && gram.indexOf(t.low) < 0 && F[t.low] && F[t.low][0];
    });
  }
  function falsoItem(i, pos) {
    var s = B && B.sentences[i], F = (B && B.falsi) || {};
    if (!s) return null;
    var t = falsoTokens(s).filter(function (x) { return x.at === +pos; })[0];
    if (!t) return null;
    var f = F[t.low], ans = String(f[0]), opts = [ans];
    // the trap: the same word read as Spanish, unless it is also its meaning
    if (ans.toLowerCase().indexOf(t.low) < 0) opts.push(t.low);
    var others = Object.keys(F).filter(function (k) { return k !== t.low && F[k][0] && F[k][0] !== ans; }), seed = i * 11 + t.at;
    for (var j = 0; opts.length < 4 && others.length && j < others.length; j++) {
      var o = String(F[others[(seed + j * 7) % others.length]][0]);
      if (opts.indexOf(o) < 0) opts.push(o);
    }
    var main = s.it[0];
    return { id: "b:fa:" + i + ":" + t.at, src: "banca", bank: "fa", type: "choice",
             prompt: "¿Qué significa «" + t.w + "» acá?", stem: main.slice(0, t.at) + "«" + t.w + "»" + main.slice(t.at + t.w.length),
             options: shuffle(opts), answer: ans, accept: [ans], note: String(f[2] || s.note || ""), tags: s.tags, lvl: s.lvl,
             cat: "falso_amigo", say: main };
  }
  function falsoSession(state, size) {
    if (!B || !B.falsi) return [];
    var ids = sentencePool(state, function (x) { return falsoTokens(x).length; }, "w");
    return prefer(state, ids, "b:fa:").slice(0, (size || 6) * 2).map(function (i) {
      var tk = falsoTokens(B.sentences[i]);
      return falsoItem(i, tk[(i * 3) % tk.length].at);
    }).filter(Boolean).slice(0, size || 6);
  }

  /* «Lo que más te cuesta»: una ronda de reconocer, armada con las áreas
     más flojas del alumno (encontrar el error, elegir la preposición, armar
     la forma), y sus propios errores recientes.  Sin un patrón de errores
     todavía, lo que más le cuesta a un hispanohablante: preposiciones,
     contracciones y artículos. */
  var PREP_CATS = /prep|contr|regenc|crase|faltante|sobrante|mancante|in_piu|articol|articul/;
  function weakSession(state, size) {
    size = size || 12;
    var RG = root.Reglas, out = [];
    var own = RG && RG.ownRecent ? RG.ownRecent(state, 3) : [];
    var weak = weakest(state, 3);
    if (weak.length) {
      weak.forEach(function (w, k) {
        // one weak area alone takes most of the round; with more, the worst half
        var c = CURE[w.cat], part = k === 0 ? (weak.length === 1 ? 0.75 : 0.5) : 0.25;
        var share = Math.max(2, Math.round((size - own.length) * part)), parts = [];
        if (c.err) parts = parts.concat(errorSession(state, Math.ceil(share / 3), c.err), whichSession(state, Math.ceil(share / 3), c.err));
        if (PREP_CATS.test(w.cat)) parts = parts.concat(prepChoiceSession(state, 3, c.tags));
        if (/ausiliare|participio|ser_estar|essere/.test(w.cat)) parts = parts.concat(verbPairSession(state, 3));
        if (/pronom|colocac|ci_ne|posizione/.test(w.cat)) parts = parts.concat(cliticSession(state, 3));
        if (/falso|lessico|lexico|spagnol|espanol/.test(w.cat)) parts = parts.concat(falsoSession(state, 3));
        if (/ordin|orden|connett|conector/.test(w.cat) || (c.tags || []).some(function (t) { return /connett|conector/.test(t); })) parts = parts.concat(connChoiceSession(state, 3));
        if (c.forms) parts = parts.concat(formsSession(state, 2, c.forms));
        shuffle(parts).slice(0, share).forEach(function (x) { x.clinic = w.cat; out.push(x); });
      });
    }
    if (out.length < size - own.length) {
      // without a pattern yet (or to fill up): a bit of each kind of
      // recognising, taken in turns so that every kind is there
      var need = size - own.length - out.length, n = Math.ceil(need / 4) + 1;
      var lists = [prepChoiceSession(state, n), whichSession(state, n), connChoiceSession(state, n), verbPairSession(state, n),
                   cliticSession(state, n), falsoSession(state, n), errorSession(state, n), formsSession(state, n, "prep")]
        .map(shuffle).filter(function (l) { return l.length; });
      // the prepositions first: the error every Spanish speaker makes
      for (var r = 0, added = 0; added < need && r < n; r++) {
        lists.forEach(function (l) { if (added < need && l[r]) { out.push(l[r]); added++; } });
      }
    }
    // without repeats (the weak area's copy wins: it is first), then mixed
    var seen = {}, uniq = function (x) { if (!x || seen[x.id]) return false; seen[x.id] = 1; return true; };
    own = own.filter(uniq);
    return own.concat(shuffle(out.filter(uniq))).slice(0, size);
  }

  /* Encontrar un error necesita una oración que ya se pueda leer: antes de
     la semana 5 (presente regular) no hay con qué compararla. */
  var ERR_WEEK = 5;

  function errorSession(state, size, cats) {
    if ((state.unlocked || 1) < ERR_WEEK) return [];
    var lvl = levelOf(state), ids = [];
    B.errors.forEach(function (e, i) {
      if (within(e.lvl, lvl) && taught(e, state) && (!cats || cats.indexOf(e.cat) >= 0)) ids.push(i);
    });
    if (!ids.length) B.errors.forEach(function (e, i) {
      if (taught(e, state) && (!cats || cats.indexOf(e.cat) >= 0)) ids.push(i);
    });
    return prefer(state, ids, "b:err:").slice(0, size || 8).map(errorItem);
  }

  /* ------------------------------------------------------------ clínica */

  // Qué ejercicios curan qué error (banca.cure: las claves son las
  // categorías de Diagnosi.LABEL; tags, las etiquetas de las oraciones;
  // forms, el ejercicio de formas que corresponde).
  var CURE = BR.cure || {};

  // Las áreas más flojas del alumno; los errores recientes pesan más.
  function weakest(state, n) {
    var errs = (state && state.errs) || {}, now = Date.now();
    return Object.keys(errs).map(function (k) {
      var e = errs[k], age = (now - (e.last || 0)) / 86400000;
      return { cat: k, score: (e.n - (e.fixed || 0) * 0.5) * Math.pow(0.9, age) };
    // Un patrón, no un error suelto: al menos un par de errores recientes.
    }).filter(function (x) { return x.score >= 1.8 && CURE[x.cat]; })
      .sort(function (a, b) { return b.score - a.score; })
      .slice(0, n || 3);
  }

  /* The Clínica opens with the learner's own errors of this week and their
     rule, and mixes the items those errors left (a check of the lesson, a
     question of a reading, a block of the dictogloss, a gap of the C-test:
     Engine.enqueue) with the generic ones of the category: the error in
     its own context is the most informative item there is (Metcalfe 2017). */
  function clinicaSession(state, size) {
    size = size || 12;
    var RG = root.Reglas;
    var own = RG && RG.ownRecent ? RG.ownRecent(state, Math.floor(size / 2)) : [];
    var out = clinicaGeneric(state, size - own.length);
    if (!out.length && !own.length) return [];
    out = shuffle(own.concat(out)).slice(0, size);
    var intro = RG && RG.clinicIntro ? RG.clinicIntro(state) : null;
    if (intro) out.unshift(intro);
    return out;
  }

  function clinicaGeneric(state, size) {
    var weak = weakest(state, 3), out = [];
    if (!weak.length || size <= 0) return [];
    weak.forEach(function (w, k) {
      var c = CURE[w.cat], share = Math.max(2, Math.round(size * (k === 0 ? 0.5 : 0.25)));
      var parts = [];
      if (c.err) parts = parts.concat(errorSession(state, Math.ceil(share / 2), c.err));
      if (c.tags) parts = parts.concat(gapSession(state, 2, c.tags), translateSession(state, 2, c.tags));
      if (c.forms) parts = parts.concat(formsSession(state, 3, c.forms));
      if (c.vocab) parts = parts.concat(vocabSession(state, 3).filter(function (x) { return x.type === "typed"; }));
      shuffle(parts).slice(0, share).forEach(function (x) {
        x.clinic = w.cat;
        out.push(x);
      });
    });
    return shuffle(out).slice(0, size);
  }

  /* ------------------------------------------------------------ repaso */

  function item(id) {
    if (!B) return null;
    var p = id.split(":");
    if (p[0] !== "b") return null;
    if (p[1] === "voc") {
      var key = p.slice(2).join(":");
      if (IDX.noun[key]) return vocabWrite(IDX.noun[key], "n");
      if (IDX.verb[key]) return vocabWrite(IDX.verb[key], "v");
      if (IDX.adj[key]) return vocabWrite(IDX.adj[key], "a");
      if (IDX.word[key]) return vocabWrite(IDX.word[key], "w");
      return null;
    }
    if (p[1] === "art" && IDX.noun[p[2]]) return articleItem(IDX.noun[p[2]], p[3] === "p");
    if (p[1] === "pl" && IDX.noun[p[2]]) return pluralItem(IDX.noun[p[2]]);
    if (p[1] === "prep" && IDX.noun[p[3]]) return prepItem(IDX.noun[p[3]], p[2], p[4] === "p", p[4] === "u");
    if (p[1] === "agr" && IDX.noun[p[2]]) return agreeItem(IDX.noun[p[2]], p[3], p[4] === "p");
    if (p[1] === "tr" && B.sentences[+p[2]]) return translateItem(+p[2]);
    if (p[1] === "gap" && B.sentences[+p[2]]) return gapItem(+p[2]);
    if (p[1] === "err" && B.errors[+p[2]]) return errorItem(+p[2]);
    if (p[1] === "pc" && B.sentences[+p[2]]) return prepChoiceItem(+p[2], +p[3]);
    if (p[1] === "cc" && B.sentences[+p[2]]) return connChoiceItem(+p[2], +p[3]);
    if (p[1] === "cual" && B.errors[+p[2]]) return whichItem(+p[2]);
    if (p[1] === "vp" && B.sentences[+p[2]]) return verbPairItem(+p[2], +p[3]);
    if (p[1] === "cl" && B.sentences[+p[2]]) return cliticItem(+p[2], +p[3]);
    if (p[1] === "fa" && B.sentences[+p[2]]) return falsoItem(+p[2], +p[3]);
    return null;
  }

  /* A sentence of the bank the learner may be asked now (its level, and
     all its grammar already taught: key «w» to translate or find, «wg» to
     fill the gap).  «Nada antes de su teoría». */
  function sentenceOk(i, state, key) {
    var s = B && B.sentences[i];
    if (!s) return false;
    if (key === "wg" && !s.gap) return false;
    return within(s.lvl, levelOf(state)) && taught(s, state, key);
  }

  // Un ítem para la pausa del café: una oración al nivel del alumno.
  function pausaItem(state) {
    var r = Math.random();
    if (r < 0.4) return translateSession(state, 1)[0];
    if (r < 0.7 && (state.unlocked || 1) >= ERR_WEEK) return errorSession(state, 1)[0];
    return gapSession(state, 1)[0];
  }

  function stats() {
    if (!B) return null;
    return { nouns: B.nouns.length, verbs: B.verbs.length, adjectives: B.adjectives.length,
             words: B.words.length, sentences: B.sentences.length, errors: B.errors.length };
  }

  var api = {
    load: load,
    loaded: loaded,
    levelOf: levelOf,
    weekOf: weekOf,
    sentenceOk: sentenceOk,
    defArt: defArt,
    indefArt: indefArt,
    CONTR: CONTR,
    vocabChoice: vocabChoice,
    vocabWrite: vocabWrite,
    vocabSession: vocabSession,
    vocabSessionFor: vocabSessionFor,
    hasWord: hasWord,
    articleItem: articleItem,
    pluralItem: pluralItem,
    prepItem: prepItem,
    agreeItem: agreeItem,
    formsSession: formsSession,
    translateItem: translateItem,
    translateSession: translateSession,
    gapItem: gapItem,
    gapSession: gapSession,
    errorItem: errorItem,
    errorSession: errorSession,
    prepChoiceItem: prepChoiceItem,
    prepChoiceSession: prepChoiceSession,
    weakSession: weakSession,
    connChoiceItem: connChoiceItem,
    connChoiceSession: connChoiceSession,
    whichItem: whichItem,
    whichSession: whichSession,
    verbPairItem: verbPairItem, verbPairSession: verbPairSession,
    cliticItem: cliticItem, cliticSession: cliticSession,
    falsoItem: falsoItem, falsoSession: falsoSession,
    ERR_WEEK: ERR_WEEK,
    TR_WEEK: TR_WEEK, GAP_WEEK: GAP_WEEK, FORME_WEEK: FORME_WEEK, CRASE_WEEK: CRASE_WEEK,
    weakest: weakest,
    clinicaSession: clinicaSession,
    CURE: CURE,
    item: item,
    pausaItem: pausaItem,
    stats: stats,
    bank: function () { return B; }
  };

  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Banca = api;
})(typeof window !== "undefined" ? window : globalThis);
