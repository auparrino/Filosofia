/*
 * Desglose: una frase, palabra por palabra.
 *
 * Una frase hecha que se aprende entera («Valeu, falou!», «Mi passi il
 * sale?») se recuerda mejor si se entiende cómo está armada (Boers &
 * Lindstromberg 2012: analizar un bloque léxico en vez de memorizarlo opaco
 * ayuda a retenerlo), pero solo si se explica lo que el estudiante no ve
 * solo: el pronombre átono y su función (mi chiamo, ci penso, me dá), el
 * pronombre pegado al verbo (conoscerti, chama-se), el tiempo compuesto
 * leído junto (ho capito, tenho feito), la elisión (l'amico, dov'è), la
 * locución (c'è, a gente) y la palabra gramatical que engaña (tudo, até).
 *
 * Todo lo que depende de la lengua sale del paquete: el conjugador (formas
 * → verbo, tiempo, persona), el glosario (forma → lema, significado), las
 * contracciones de LANG.rules.banca.contr y las reglas del desglose en
 * LANG.rules.desglose (docs/lang/<código>/desglose_data.js).  Con
 * opts.week, un tiempo que la teoría todavía no presentó se describe en
 * castellano («pasado», «futuro»…) en vez de nombrarse.  Sin DOM: se prueba
 * en node.
 *
 *   Desglose.of("Valeu, falou!", { gloss: glossario, week: 3 })
 *   → [{ w: "valeu", kind: "verb", lemma: "valer", tenses: ["perfeito"],
 *        persons: [2], es: "valer", idiom: "gracias, dale (coloquial)" }, …]
 */
(function (root) {
  "use strict";

  var FORMS = null;             // forma → [[infinitivo, tiempo, persona], …]

  function conj() { return root.Conj || null; }
  function rules() {
    var L = root.LANG;
    return (L && L.rules && L.rules.desglose) || {};
  }
  function has(list, w) { return !!list && list.indexOf(w) >= 0; }

  function add(map, w, h) {
    w = String(w).toLowerCase();
    (map[w] = map[w] || []).push(h);
  }

  /* Every form of one verb: the simple tenses, the participle, the gerund,
     and the imperative forms that are not also a present (tenga, diga). */
  function indexVerb(inf, map) {
    var C = conj(), pres = {};
    (C.SIMPLE_TENSES || []).forEach(function (t) {
      var forms;
      try { forms = C.conjugate(inf, t, { partial: true }); } catch (e) { return; }
      (forms || []).forEach(function (f, p) {
        if (!f) return;
        var w = String(f).split(" ").pop().toLowerCase();
        if (t === "presente") pres[w] = 1;
        add(map, w, [inf, t, p]);
      });
    });
    try { var pp = C.participle(inf); if (pp) add(map, pp, [inf, "participio", -1]); } catch (e) { /* sin participio */ }
    try { var g = C.gerund && C.gerund(inf); if (g) add(map, g, [inf, "gerundio", -1]); } catch (e) { /* sin gerundio */ }
    var im = null;
    try { im = C.imperative && C.imperative(inf); } catch (e) { im = null; }
    var names = rules().impvPersons || {};
    Object.keys(im || {}).forEach(function (k) {
      var f = im[k];
      if (!names[k] || typeof f !== "string" || /[\s-]/.test(f)) return;
      f = f.toLowerCase();
      if (!pres[f]) add(map, f, [inf, "imperativo", names[k]]);
    });
  }

  function index() {
    if (FORMS) return FORMS;
    FORMS = {};
    var C = conj();
    if (!C) return FORMS;
    C.list().forEach(function (inf) { indexVerb(inf, FORMS); });
    return FORMS;
  }

  function isInfinitive(w) {
    var C = conj();
    return !!(C && C.VERBS && Object.prototype.hasOwnProperty.call(C.VERBS, w));
  }

  /* A verb of the glossary the conjugator does not know yet (the bank's
     regular verbs): register it and index its forms. */
  function learn(inf, es) {
    var C = conj();
    if (!C || !C.register || isInfinitive(inf)) return;
    // a noun of the bank is not a verb (mare, «mar»); the meaning of a
    // verb is a Spanish verb
    if (NOMINAL && NOMINAL[inf]) return;
    if (es && !/^[a-záéíóúñ]+(ar|er|ir|ír)(se)?\b/i.test(String(es).trim())) return;
    var done = false;
    try { done = C.register(inf, { es: es }); } catch (e) { done = false; }
    if (done) indexVerb(inf, index());
  }

  // «no» → «em + o», «al» → «a + il», from LANG.rules.banca.contr.
  var CONTR = null;
  function contractions() {
    if (CONTR) return CONTR;
    CONTR = {};
    var L = root.LANG, c = L && L.rules && L.rules.banca && L.rules.banca.contr;
    Object.keys(c || {}).forEach(function (prep) {
      Object.keys(c[prep]).forEach(function (art) {
        var f = String(c[prep][art]).toLowerCase();
        if (f && f !== prep + " " + art) CONTR[f] = [prep, art];
      });
    });
    // more contractions of the language: deste = de + este, daqui = de + aqui
    var x = rules().contr || {};
    Object.keys(x).forEach(function (f) { CONTR[f] = x[f]; });
    return CONTR;
  }

  // Articles and contractions: a word right after one is a noun (il sale).
  var ARTS = null;
  function articles() {
    if (ARTS) return ARTS;
    ARTS = {};
    var L = root.LANG, R = L && L.rules, c = R && R.banca && R.banca.contr, d = R && R.distract;
    Object.keys(c || {}).forEach(function (prep) {
      ARTS[prep.toLowerCase()] = 2;                       // a preposition
      Object.keys(c[prep]).forEach(function (art) { ARTS[art.toLowerCase()] = 1; ARTS[String(c[prep][art]).toLowerCase()] = 1; });
    });
    ((d && d.artSg) || []).concat((d && d.artPl) || []).forEach(function (a) { ARTS[String(a).toLowerCase()] = 1; });
    (rules().preps || []).forEach(function (p) { if (!ARTS[p]) ARTS[p] = 2; });
    return ARTS;
  }

  /* ------------------------------------------------------------- labels */

  function tenseWeek(t) {
    var W = rules().weeks || {};
    return W[t] || 0;
  }
  /* The name of a tense, or —before the week the theory presents it— what
     it is in plain Spanish («pasado, como «comí»»). */
  function label(t, week) {
    if (t === "participio" || t === "gerundio") return t;
    var C = conj(), L = (C && C.TENSE_LABELS) || {}, D = rules();
    var name = L[t] || t;
    // without a week of its own: the app's week, through Devolucion
    if (week == null) return root.Devolucion ? root.Devolucion.tense(name) : name;
    var nw = (D.nameWeek && D.nameWeek[t]) || tenseWeek(t);
    if (week >= nw) return name;
    return (D.desc && D.desc[t]) || (root.Devolucion ? root.Devolucion.tense(name, week) : name);
  }

  function personLabel(p) {
    if (typeof p === "string") return p;
    var C = conj();
    return p >= 0 && C && C.PERSONS ? C.PERSONS[p] : "";
  }

  /* ------------------------------------------------------ transparency */

  function plain(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/ção$/, "cion").replace(/cao$/, "cion").replace(/nh/g, "n").replace(/lh/g, "ll").replace(/gn/g, "n")
      .replace(/(.)\1/g, "$1");
  }
  function dist(a, b) {
    var m = [], i, j;
    for (i = 0; i <= a.length; i++) m[i] = [i];
    for (j = 0; j <= b.length; j++) m[0][j] = j;
    for (i = 1; i <= a.length; i++) for (j = 1; j <= b.length; j++)
      m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return m[a.length][b.length];
  }
  // «água — agua», «caminho — camino»: a Spanish speaker reads it alone.
  function transparent(w, es) {
    var a = plain(w);
    return String(es || "").split(/\s*[\/;,(]\s*/).some(function (x) {
      var b = plain(x.trim());
      return b && (a === b || (a.length >= 4 && dist(a, b) <= 1));
    });
  }

  /* Nouns, adjectives and other words of the bank (Banca, or opts.bank):
     they are read as what they are before being read as a verb form. */
  var NOMINAL = null, SUBJ = {};
  function nominalFrom(bank) {
    NOMINAL = {};
    (bank && bank.nouns || []).forEach(function (n) { NOMINAL[String(n[0]).toLowerCase()] = 1; NOMINAL[String(n[2]).toLowerCase()] = 1; });
    (bank && bank.adjectives || []).forEach(function (a) { for (var k = 0; k < 4; k++) NOMINAL[String(a[k]).toLowerCase()] = 1; });
    (bank && bank.words || []).forEach(function (x) {
      var w = String(x[0]).toLowerCase();
      if (!/verb|espress|express/i.test(String(x[2] || ""))) NOMINAL[w] = 1;
    });
  }
  function subjects() {
    SUBJ = {};
    var C = conj();
    ((C && C.PERSONS) || []).forEach(function (p) { String(p).split("/").forEach(function (x) { SUBJ[x.trim().toLowerCase()] = 1; }); });
    (rules().subj || []).forEach(function (s) { SUBJ[s] = 1; });
  }

  /* ---------------------------------------------------------- tokens */

  var LETTER = "A-Za-zÀ-ÖØ-öø-ÿ";
  var TOKEN = new RegExp("[" + LETTER + "]+(?:['-][" + LETTER + "]+)*'?|[.!?…:;,]", "g");

  /* Words with their original spelling and whether a sentence starts
     there.  An elided form is split (l'amico → l', amico); a Spanish word
     quoted «like this» is left out. */
  function tokenize(text) {
    var s = String(text || "").replace(/[’‘]/g, "'").replace(/«[^»]*»/g, " , ");
    var raw = s.match(TOKEN) || [], out = [], start = true, clause = true;
    raw.forEach(function (r) {
      if (r === ",") { clause = true; return; }
      if (/^[.!?…:;]$/.test(r)) { start = true; clause = true; return; }
      var m = /^([^'-]+')([^'].*)$/.exec(r);
      if (m) {
        out.push({ raw: m[1], w: m[1].toLowerCase(), start: start, clause: clause, elided: true, whole: r });
        out.push({ raw: m[2], w: m[2].toLowerCase(), start: false, after: r });
      } else {
        out.push({ raw: r, w: r.toLowerCase(), start: start, clause: clause });
      }
      start = false; clause = false;
    });
    return out;
  }

  /* ------------------------------------------------------------- core */

  /* One entry per thing worth explaining, in the order of the phrase:
     locutions, clitics and their function, glued pronouns, elisions,
     compound tenses and periphrases, contractions, grammar words, verb
     forms (verb, tense, person) and words with a meaning in the glossary.
     The infinitive itself and words spelled like their Spanish meaning are
     not explained. */
  /* A glossary entry can carry several readings, «sal · también, del verbo:
     subir (sube)» (the tap on the word shows them all).  The breakdown reads
     the sentence and picks the reading itself: it keeps only the first. */
  function firstSense(G) {
    if (G.__first) return G.__first;
    var o = {}, any = false;
    Object.keys(G).forEach(function (k) {
      var e = G[k];
      if (e && typeof e[1] === "string" && e[1].indexOf(" · ") >= 0) { o[k] = [e[0], e[1].split(" · ")[0]].concat(e.slice(2)); any = true; }
      else o[k] = e;
    });
    if (!any) o = G;
    try { Object.defineProperty(G, "__first", { value: o }); } catch (e) { /* frozen */ }
    return o;
  }

  function of(text, opts) {
    opts = opts || {};
    var gloss = firstSense(opts.gloss || {}), week = opts.week == null ? null : +opts.week;
    var D = rules(), C = conj(), idx = index(), contr = contractions(), arts = articles();
    if (opts.bank && !NOMINAL) nominalFrom(opts.bank);
    else if (!NOMINAL && root.Banca && root.Banca.loaded && root.Banca.loaded()) nominalFrom(root.Banca.bank());
    subjects();
    var T = tokenize(text), used = [], wasClitic = [], out = [], seen = {}, firstClitic = true;
    var clit = D.clitics || {}, elide = D.elide || {}, coll = D.colloquial || {};
    var PROPER = (root.Frasi && root.Frasi.PROPER) || {};

    function push(e, i) {
      var k = e.kind + ":" + e.w;
      if (seen[k]) return;
      seen[k] = 1;
      e.at = i;
      out.push(e);
    }
    function g(w) { return gloss[w] || gloss[coll[w]] || null; }

    // «ser / estar» + «estar / quedarse» → «ser / estar / quedarse»
    function meanings(lemmas) {
      var parts = [];
      var re = D.reflRe ? new RegExp(D.reflRe) : null;
      lemmas.forEach(function (l) {
        var x = gloss[l], es = (D.verbEs && D.verbEs[l]) || x && x[1] || "";
        // lavare, whose entry is lavarsi: «lavar», not «lavarse»
        if (x && re && x[0] !== l && re.test(x[0]) && !re.test(l)) es = plainEs(es);
        String(es).split(/\s*\/\s*/).forEach(function (p) { if (p && parts.indexOf(p) < 0) parts.push(p); });
      });
      return parts.join(" / ");
    }
    // The verb readings of a word (with the glossary's verbs learnt).
    function hitsOf(w) {
      w = coll[w] && !/ /.test(coll[w]) ? coll[w] : w;
      var gl = gloss[w];
      if (gl && gl[0] !== w && /(are|ere|ire|rre|ar|er|ir|or|rsi|-se)$/.test(gl[0]) && !(idx[w] || []).length) learn(gl[0], gl[1]);
      if (isInfinitive(w)) return [];
      return (idx[w] || []).filter(function (h) { return h[0] !== w; });
    }
    function infoEs(l) { try { return (C && C.info && (C.info(l) || {}).es) || ""; } catch (e) { return ""; } }
    function finite(h) { return h[1] !== "participio" && h[1] !== "gerundio"; }
    function nominal(w) { return !!(NOMINAL && NOMINAL[w]); }
    /* A verb the glossary knows only by its infinitive (consiglia →
       consigliare): tried when the word leans on a clitic. */
    function guess(w, force) {
      if (hitsOf(w).length || (gloss[w] && gloss[w][0] !== w) || (nominal(w) && !force) || isInfinitive(w)) return;
      var mk = D.reflMake, E = D.guess || [];
      function tryInf(inf) {
        var gl = gloss[inf];
        if (gl && gl[0] === inf) { learn(inf, gl[1]); return true; }
        // only the reflexive is in the glossary: preoccuparsi, scusarsi
        var r = mk ? inf.replace(new RegExp(mk[0]), mk[1]) : "";
        gl = r && gloss[r];
        if (gl && gl[0] === r) { learn(inf, gl[1]); return true; }
        return false;
      }
      // an infinitive the conjugator does not know yet (preoccupare)
      if (D.infRe && new RegExp(D.infRe).test(w) && tryInf(w)) return;
      for (var k = 0; k < E.length; k++) {
        var m = new RegExp(E[k][0]).exec(w);
        if (!m) continue;
        for (var n = 1; n < E[k].length; n++) {
          if (tryInf(w.slice(0, m.index) + E[k][n]) && hitsOf(w).length) return;
        }
      }
    }
    // preoccupare, whose glossary entry is preoccuparsi
    function reflInfinitive(w) {
      var gl = gloss[w], mk = D.reflMake;
      return !!(gl && mk && D.infRe && new RegExp(D.infRe).test(w) && w.replace(new RegExp(mk[0]), mk[1]) === gl[0]);
    }
    // An infinitive, known or not (raccontare, alzare → alzarsi).
    function infLike(w) {
      if (isInfinitive(w) || reflInfinitive(w)) return true;
      if (!D.infRe || !new RegExp(D.infRe).test(w) || nominal(w)) return false;
      return !gloss[w] || gloss[w][0] === w;
    }
    // A verb here: a finite form or an infinitive (after a clitic).
    function verbAt(i) {
      var t = T[i];
      if (!t || isName(i) || has(D.notVerb, t.w)) return false;
      if (isInfinitive(t.w) || reflInfinitive(t.w)) return true;
      guess(t.w);
      return hitsOf(t.w).some(finite);
    }
    function isName(i) {
      var t = T[i];
      if (!t || !/^[A-ZÀ-ÖØ-Þ]/.test(t.raw)) return false;
      if (clit[t.w] || (D.fn && D.fn[t.w]) || SUBJ[t.w] || elide[t.w]) return false;
      if (has(D.names, t.w)) return true;
      if (PROPER[t.raw] && !t.start) return true;
      return !t.start;
    }

    /* A locution at i: tokens, «@verb» for any form of that verb. */
    var LOCS = (D.loc || []).map(function (x) { return { p: x.m.split(" "), es: x.es }; })
      .sort(function (a, b) { return b.p.length - a.p.length; });
    function locAt(i) {
      for (var k = 0; k < LOCS.length; k++) {
        var p = LOCS[k].p, ok = true, verb = null;
        for (var j = 0; j < p.length && ok; j++) {
          var t = T[i + j];
          if (!t || used[i + j]) { ok = false; break; }
          if (p[j].charAt(0) === "@") {
            var lem = p[j].slice(1);
            var hs = t.w === lem ? [[lem, "", -1]] : hitsOf(t.w).filter(function (h) { return h[0] === lem; });
            if (!hs.length) ok = false; else verb = { lemma: lem, hits: hs };
          } else if (t.w !== p[j]) ok = false;
        }
        // «ci sono» + participle is ci + a compound tense (ci sono stato)
        if (ok && T[i + p.length] && compoundAt(i + p.length - 1)) ok = false;
        if (ok) return { n: p.length, es: LOCS[k].es, verb: verb };
      }
      return null;
    }
    function joined(i, n) {
      var s = [];
      for (var j = i; j < i + n; j++) {
        if (T[j].after && j > i) { s[s.length - 1] = T[j].after.toLowerCase(); continue; }
        s.push(T[j].w);
      }
      return s.join(" ").replace(/' /g, "'");
    }

    /* The verb a clitic leans on: the next token after other clitics;
       an auxiliary with its participle counts as the participle's verb. */
    function verbAfter(i, loose) {
      var j = i + 1;
      while (T[j] && (clit[T[j].w] || clit[elide[T[j].w]] || T[j].w === "non") && j < i + 4) j++;
      // after a pronoun that is never an article, a verb form is a verb
      // even when it is also a noun (me conta, ti porta)
      var strong = loose && T[j] && !isName(j) && !arts[T[j - 1].w] && (guess(T[j].w, true), hitsOf(T[j].w).some(finite));
      if (!verbAt(j) && !strong) {
        // a verb the glossary does not have (mi scuso, mi fido): after a
        // pronoun that is never an article, a word that is nothing else
        var u = T[j];
        if (!loose || !u || isName(j) || /[-']/.test(u.w) || nominal(u.w) || arts[u.w] || has(D.det, u.w) ||
            (D.fn && D.fn[u.w]) || SUBJ[u.w] || has(D.notVerb, u.w) || (gloss[u.w] && !isInfinitive(gloss[u.w][0]))) return null;
        return { i: j, w: u.w, lemmas: [], persons: [] };
      }
      var hs = moodFilter(hitsOf(T[j].w).filter(finite), j), comp = compoundAt(j);
      var lemmas = comp ? comp.lemmas : hs.map(function (h) { return h[0]; });
      var persons = comp ? comp.persons : hs.map(function (h) { return h[2]; });
      if (isInfinitive(T[j].w)) { lemmas = [T[j].w]; persons = []; }
      if (reflInfinitive(T[j].w)) { lemmas = [gloss[T[j].w][0]]; persons = []; }
      return { i: j, w: T[j].w, lemmas: lemmas, persons: persons };
    }

    function cliticFn(c, v, i) {
      var fns = (c.fn || []).slice(), re = D.reflRe ? new RegExp(D.reflRe) : null;
      var reflLemma = v.lemmas.filter(function (l) { return re && re.test(l); })[0];
      var samePerson = (c.p || []).some(function (p) { return v.persons.indexOf(p) >= 0; });
      // before a reflexive infinitive (non ti preoccupare)
      if (has(fns, "refl") && reflLemma && !v.persons.length) return { fn: "refl", lemma: reflLemma };
      if (has(fns, "refl") && samePerson) {
        var mk = D.reflMake, l0 = v.lemmas[0] || "", made = "";
        if (!reflLemma && mk && l0 && !isInfinitive(v.w) && !(D.aux && D.aux[l0])) made = l0.replace(new RegExp(mk[0]), mk[1]);
        var known = reflLemma || (made && (isInfinitive(made) || gloss[made]) ? made : "");
        /* se / si with a verb in the 3rd person: reflexive when the verb
           is known as reflexive or has a subject before (a gente se vê,
           un cane che si chiama); impersonal otherwise (come si dice). */
        if (has(fns, "imp") && !known) {
          var k = i - 1;
          while (k >= 0 && (T[k].w === "non" || T[k].w === "não")) k--;
          var subj = k >= 0 && (SUBJ[T[k].w] || has(D.relative, T[k].w) || isName(k) ||
            (nominal(T[k].w) && !has(D.interrog, T[k].w) && !(D.fn && D.fn[T[k].w])));
          if (!subj) return { fn: "imp" };
        }
        return { fn: "refl", lemma: known || made };
      }
      if (has(fns, "imp") && !reflLemma && v.persons.indexOf(2) >= 0) return { fn: "imp" };
      if (has(fns, "oi") && v.lemmas.some(function (l) { return has(D.oiVerbs, l.replace(re || /$^/, "")); })) return { fn: "oi" };
      if (has(fns, "loc") && v.persons.length && !samePerson) return { fn: "loc" };
      fns = fns.filter(function (f) { return f !== "imp" && f !== "loc" && (f !== "refl" || (reflLemma && samePerson)); });
      if (!fns.length) fns = (c.fn || []).slice(0, 1);
      return { fn: fns.join("|") };
    }
    function cliticAt(i) {
      var t = T[i], key = t.elided ? elide[t.w] && clit[t.w] ? t.w : (clit[elide[t.w]] ? elide[t.w] : t.w) : t.w;
      var c = clit[key];
      if (!c) return null;
      if (c.cluster && !(T[i + 1] && clit[T[i + 1].w])) return null;
      if (c.prev && !(i > 0 && has(D.prevClitic, T[i - 1].w))) return null;
      // «se» before a subject or another pronoun is «si» (se você quiser, se me permite)
      if (c.conj && T[i + 1] && (SUBJ[T[i + 1].w] || clit[T[i + 1].w])) return null;
      var v = verbAfter(i, !c.amb && !c.conj && !c.cluster);
      if (!v) return null;
      // «se» before a verb that is not in the 3rd person is «si» (se podes)
      if (c.conj && v.persons.length && !(c.p || []).some(function (p) { return v.persons.indexOf(p) >= 0; })) return null;
      if (c.amb && nominal(T[v.i].w) && v.i === i + 1 && !verbStrong(v.i)) return null;
      /* a modal before an infinitive: the pronoun goes with the infinitive
         (me lo puoi spiegare, ti devo raccontare) */
      var with_ = "";
      if (v.lemmas.some(function (l) { return has(D.modals, l); }) && T[v.i + 1] && !T[v.i + 1].clause &&
          infLike(T[v.i + 1].w)) {
        with_ = T[v.i + 1].w;
        v = { i: v.i, w: with_, lemmas: [with_], persons: v.persons };
      }
      var f = cliticFn(c, v, i);
      return { kind: "clitic", w: t.w, base: key, es: (c.esFn && c.esFn[f.fn]) || c.es, fn: f.fn, refl: f.lemma || "", verb: T[v.i].w, with_: with_ };
    }
    // «la porta» is a door; «lo prendo» a verb: strong when not a noun.
    function verbStrong(i) { return !nominal(T[i].w) && !has(D.notVerb, T[i].w); }

    /* Auxiliary + participle: ho capito, sono andata, tinha feito. */
    function ppHits(w) {
      hitsOf(w);
      if (!(idx[w] || []).length && D.agree) hitsOf(w.replace(new RegExp(D.agree.from), D.agree.to));
      guessPP(w);
      function get() {
        var hs = (idx[w] || []).filter(function (h) { return h[1] === "participio"; });
        if (!hs.length && D.agree) {
          var w2 = w.replace(new RegExp(D.agree.from), D.agree.to);
          if (w2 !== w) hs = (idx[w2] || []).filter(function (h) { return h[1] === "participio"; });
        }
        return hs;
      }
      var hs = get(), re = D.reflRe ? new RegExp(D.reflRe) : null, un = D.reflUnmake;
      /* only the reflexive verb is known (lavarsi): its plain verb too, for
         «ha lavato la macchina» */
      if (re && un && hs.length && hs.every(function (h) { return re.test(h[0]); })) {
        var added = false;
        hs.forEach(function (h) {
          var base = h[0].replace(new RegExp(un[0]), un[1]);
          if (base !== h[0] && !isInfinitive(base)) { learn(base, plainEs(meanings([h[0]]) || (gloss[h[0]] || [])[1])); added = true; }
        });
        if (added) hs = get();
      }
      return hs;
    }
    // «lavarse» → «lavar»: the meaning of the verb without its pronoun
    function plainEs(es) {
      var P = D.plainEs || {};
      return String(es || "").split(/\s*\/\s*/).map(function (x) { return P[x] || x.replace(/([aeií]r)se\b/g, "$1"); }).join(" / ");
    }
    function compoundAt(i) {
      var A = D.aux || {}, t = T[i];
      if (!t) return null;
      var auxHits = (idx[t.w] || []).filter(function (h) { return A[h[0]] && A[h[0]][h[1]]; });
      auxHits = moodFilter(auxHits.map(function (h) { return [h[0], A[h[0]][h[1]], h[2], h[1]]; }), i)
        .map(function (h) { return [h[0], h[3], h[2]]; });
      if (!auxHits.length) return null;
      var j = i + 1;
      while (T[j] && has(D.between, T[j].w) && j < i + 4) j++;
      if (!T[j]) return null;
      var pp = ppHits(T[j].w), auxLemmas = auxHits.map(function (h) { return h[0]; }), unknown = false;
      /* a participle of a verb nobody knows (avrebbe immaginato): after
         avere / ter, a word shaped like one that is nothing else */
      if (!pp.length && D.auxGuess && auxLemmas.some(function (a) { return has(D.auxGuess, a); }) && !nominal(T[j].w) &&
          !gloss[T[j].w] && !has(D.notVerb, T[j].w)) {
        var P = D.ppGuess || [];
        for (var q = 0; q < P.length && !pp.length; q++) {
          var mq = new RegExp(P[q][0]).exec(T[j].w);
          if (mq && mq.index >= 3) pp = [[T[j].w.slice(0, mq.index) + P[q][1], "participio", -1]];
        }
        if (pp.length) {
          unknown = true;
          auxHits = auxHits.filter(function (h) { return has(D.auxGuess, h[0]); });
          auxLemmas = auxHits.map(function (h) { return h[0]; });
        }
      }
      if (!pp.length) return null;
      // a reflexive pronoun before: the auxiliary is essere (mi sono perso)
      var reflBefore = i > 0 && clit[T[i - 1].w] && has(clit[T[i - 1].w].fn, "refl");
      if (D.checkAux && C && C.auxiliary && !unknown && !(reflBefore && auxLemmas.indexOf("essere") >= 0)) {
        pp = pp.filter(function (h) {
          var a, info;
          try { a = C.auxiliary(h[0]); info = C.info(h[0]) || {}; } catch (e) { return false; }
          return auxLemmas.indexOf(a) >= 0 || (info.aux === "both" && auxLemmas.indexOf("essere") >= 0);
        });
        if (!pp.length) return null;
        auxHits = auxHits.filter(function (h) {
          return pp.some(function (p) {
            var a; try { a = C.auxiliary(p[0]); } catch (e) { a = ""; }
            return a === h[0] || (C.info(p[0]) || {}).aux === "both";
          });
        });
      }
      var gl = gloss[T[j].w], lemmas = [];
      if (gl && pp.some(function (h) { return h[0] === gl[0]; })) lemmas.push(gl[0]);
      pp.forEach(function (h) { if (lemmas.indexOf(h[0]) < 0) lemmas.push(h[0]); });
      // a reflexive verb needs its pronoun: without it, the plain verb
      var re = D.reflRe ? new RegExp(D.reflRe) : null, hasClitic = i > 0 && (clit[T[i - 1].w] || clit[elide[T[i - 1].w]]);
      if (re && !hasClitic && lemmas.some(function (l) { return !re.test(l); })) lemmas = lemmas.filter(function (l) { return !re.test(l); });
      if (re && hasClitic && lemmas.some(function (l) { return re.test(l); }) && T[i - 1].w !== "l'") {
        var cf = clit[T[i - 1].w] || clit[elide[T[i - 1].w]];
        // a reflexive pronoun before: the reflexive verb only (mi sono lavato)
        lemmas = cf && has(cf.fn, "refl") ? lemmas.filter(function (l) { return re.test(l); }) :
          lemmas.filter(function (l) { return re.test(l); }).concat(lemmas.filter(function (l) { return !re.test(l); }));
      }
      var tenses = [], persons = [];
      auxHits.forEach(function (h) {
        var ct = A[h[0]][h[1]];
        if (tenses.indexOf(ct) < 0) tenses.push(ct);
        if (persons.indexOf(h[2]) < 0) persons.push(h[2]);
      });
      if (D.agree && auxLemmas.indexOf("essere") >= 0) {
        var pl = /[ie]$/.test(T[j].w);
        var ps = persons.filter(function (p) { return pl ? p >= 3 : p < 3; });
        if (ps.length) persons = ps;
      }
      return { i: i, j: j, aux: auxHits[0][0], lemmas: lemmas.slice(0, 2), tenses: tenses, persons: persons };
    }

    // sbagliato → sbagliare, when the glossary has the verb
    function guessPP(w) {
      var P = D.ppGuess || [];
      if ((idx[w] || []).length) return;
      for (var k = 0; k < P.length; k++) {
        var m = new RegExp(P[k][0]).exec(w);
        if (!m) continue;
        for (var n = 1; n < P[k].length; n++) {
          var inf = w.slice(0, m.index) + P[k][n], gl = gloss[inf];
          if (gl && gl[0] === inf) { learn(inf, gl[1]); return; }
          // only the reflexive is in the glossary (vestirsi): the plain verb
          var mk = D.reflMake, r = mk ? inf.replace(new RegExp(mk[0]), mk[1]) : "";
          gl = r && gloss[r];
          if (gl && gl[0] === r) { learn(inf, plainEs(gl[1])); return; }
        }
      }
    }

    /* stare/estar + gerundio, ir + infinitivo. */
    function periAt(i) {
      var P = D.peri || {}, t = T[i];
      if (!t) return null;
      var w = coll[t.w] && !/ /.test(coll[t.w]) ? coll[t.w] : t.w;
      var hs = (idx[w] || []).filter(function (h) { return P[h[0]] && finite(h) && h[1] !== "imperativo"; });
      if (!hs.length) return null;
      var j = i + 1;
      while (T[j] && (clit[T[j].w] || has(D.between, T[j].w)) && j < i + 3) j++;
      var n = T[j];
      if (!n) return null;
      var lemma = hs[0][0], spec = P[lemma], target = null;
      if (spec.form === "gerundio") {
        hitsOf(n.w);
        var gh = (idx[n.w] || []).filter(function (h) { return h[1] === "gerundio"; });
        if (gh.length) target = gh[0][0];
      } else if (spec.form === "infinitivo") {
        if (isInfinitive(n.w)) target = n.w;
        else { var gl = gloss[n.w]; if (gl && gl[0] === n.w && /(ar|er|ir)$/.test(n.w) && !hitsOf(n.w).length) target = n.w; }
      }
      if (!target) return null;
      var mine = moodFilter(hs.filter(function (h) { return h[0] === lemma && (!spec.tenses || has(spec.tenses, h[1])); }), i);
      if (!mine.length) return null;
      return { kind: "peri", i: i, j: j, w: joined(i, j - i + 1), aux: lemma, auxForm: t.w,
        coll: coll[t.w] || "", form: spec.form, lemma: target, what: spec.es,
        tenses: uniq(mine.map(function (h) { return h[1]; })), persons: uniq(mine.map(function (h) { return h[2]; })) };
    }

    /* A pronoun glued to the verb: conoscerti, salutami, dimmi, chama-se,
       fazê-lo. */
    function encliticAt(i) {
      var E = D.enclitic, t = T[i];
      if (!E || !t || t.elided) return null;
      var w = t.w, suf = null, base = null, parts;
      if (E.hyphen) {
        parts = w.split("-");
        if (parts.length !== 2 || !has(E.suffixes, parts[1])) return null;
        suf = parts[1]; base = parts[0];
      } else {
        if (idx[w] || (NOMINAL && NOMINAL[w]) || ppHits(w).length || isInfinitive(w) && !new RegExp(D.reflRe || "$^").test(w)) return null;
        for (var k = 0; k < E.suffixes.length; k++) {
          var s = E.suffixes[k];
          if (w.length > s.length + 1 && w.slice(-s.length) === s) { suf = s; base = w.slice(0, -s.length); break; }
        }
        if (!suf) return null;
      }
      var r = baseVerb(base, suf);
      if (!r) return null;
      // a word of the glossary is only split when it is an infinitive
      // with its pronoun (andarsene), not a word of its own (animali)
      if (!E.hyphen && gloss[w] && gloss[w][0] === w && r.form !== "infinitivo") return null;
      return { kind: "encl", w: w, base: r.shown, suf: suf, sufEs: (E.es || {})[suf] || suf, lemma: r.lemma, form: r.form, rloss: !!r.rloss, lost: !!r.lost,
        tenses: r.tenses || [], persons: r.persons || [] };
    }
    function baseVerb(base, suf) {
      var E = D.enclitic, cands = [];
      // one-syllable imperatives double the consonant: di' + mi = dimmi
      if (E.short) {
        var dbl = base.length >= 3 && base.charAt(base.length - 1) === suf.charAt(0) ? base.slice(0, -1) : null;
        if (dbl && E.short[dbl]) return { lemma: E.short[dbl], shown: dbl + "'", form: "imperativo" };
        if (E.short[base] && suf.slice(0, 3) === "gli") return { lemma: E.short[base], shown: base + "'", form: "imperativo" };
      }
      // an infinitive that lost its last vowel (conoscer-ti, far-cela)
      if (!E.hyphen && /r$/.test(base)) (E.infEnd || ["e"]).forEach(function (x) { cands.push({ inf: base + x, form: "infinitivo", shown: base + x }); });
      // a whole infinitive before the hyphen (contar-lhe)
      if (E.hyphen && (isInfinitive(base) || (gloss[base] && gloss[base][0] === base && new RegExp(D.infRe || "$^").test(base))))
        cands.push({ inf: base, form: "infinitivo", shown: base });
      // a form that lost its last consonant before lo/la (fi-lo = fiz + o)
      var lost = E.lost && E.lost[base];
      if (lost && has(E.rLoss, suf)) return { lemma: lost[0], shown: lost[1], form: "", lost: true, tenses: [lost[2]], persons: [lost[3]] };
      // the «nós» form loses its -s: estudamo-lo = estudamos + o
      if (E.sLoss && has(E.rLoss, suf) && /[aeio]mo$/.test(base)) {
        var sh = hitsOf(base + "s").filter(function (h) { return h[2] === 3; });
        if (sh.length) return { lemma: sh[0][0], shown: base + "s", form: "", lost: true, tenses: uniq(sh.map(function (h) { return h[1]; })), persons: [3] };
      }
      // an infinitive that lost its -r before lo/la (fazê-lo, transformá-la)
      if (E.hyphen && has(E.rLoss, suf) && /[áéêíôói]$/.test(base)) {
        var inf = base.normalize("NFD").replace(/[́̂]/g, "").normalize("NFC") + "r";
        if (base === "pô") inf = "pôr";
        cands.push({ inf: inf, form: "infinitivo", shown: inf, rloss: true });
      }
      for (var k = 0; k < cands.length; k++) {
        var c = cands[k], gl = gloss[c.inf];
        if (!isInfinitive(c.inf) && gl && gl[0] === c.inf) learn(c.inf, gl[1]);
        if (isInfinitive(c.inf)) return { lemma: c.inf, shown: c.shown, form: c.form, rloss: c.rloss };
        // transformá-la: the accent before -la only fits an infinitive;
        // provar-lo: so does a long stem in -ar, -er, -ir
        if (E.hyphen ? /[áêô]$/.test(base) : base.length >= 5 && /(ar|er|ir)$/.test(base)) return { lemma: c.inf, shown: c.shown, form: c.form, rloss: c.rloss };
      }
      // an imperative, a gerund or a conjugated form (saluta-mi, chama-se)
      var hs = hitsOf(base);
      if (!hs.length) {
        // the bank's regular -are verbs: saluta → salutare
        var guess = base.length < 3 ? "" : /a$/.test(base) ? base.slice(0, -1) + "are" : /i$/.test(base) ? base.slice(0, -1) + "ere" : "";
        if (!E.hyphen && guess && gloss[guess]) { learn(guess, gloss[guess][1]); hs = hitsOf(base); }
      }
      // the tu imperative of -are is the present «lui» form (saluta-mi)
      if (!E.hyphen) hs = hs.filter(function (h) {
        return h[1] === "imperativo" || h[1] === "gerundio" ||
          (h[1] === "presente" && (h[2] === 1 || h[2] === 3 || h[2] === 4 || (h[2] === 2 && /a$/.test(base))));
      });
      // a verb the glossary does not know, with a hyphen and an unmistakable
      // pronoun (constatou-se): the pronoun is still worth explaining
      if (!hs.length && E.hyphen && has(E.bare, suf) && E.bareRe && new RegExp(E.bareRe).test(base)) return { lemma: "", shown: base, form: "" };
      if (!hs.length) return null;
      var re = D.reflRe ? new RegExp(D.reflRe) : null;
      if (re && (suf === "se" || suf === "si" || suf === "me" || suf === "te" || suf === "nos")) {
        var rh = hs.filter(function (h) { return re.test(h[0]); });
        if (rh.length) hs = rh;
      }
      if (!E.hyphen) {
        // a present tu/voi/noi glued to a pronoun is the imperative (senti-mi)
        var im = hs.filter(function (h) { return h[1] === "imperativo" || h[1] === "gerundio"; });
        var form = im.length ? im[0][1] : "imperativo";
        return { lemma: hs[0][0], shown: base, form: form };
      }
      var lemma = hs[0][0], mine = hs.filter(function (h) { return h[0] === lemma; });
      return { lemma: lemma, shown: base, form: "", tenses: uniq(mine.map(function (h) { return h[1]; })), persons: uniq(mine.map(function (h) { return h[2]; })) };
    }

    /* A verb form: which verb, which tense and person (what the student
       has seen by opts.week). */
    function verbEntry(w, hits, gl, i) {
      var lemmas = [];
      if (gl && hits.some(function (h) { return h[0] === gl[0]; })) lemmas.push(gl[0]);
      hits.forEach(function (h) { if (lemmas.indexOf(h[0]) < 0) lemmas.push(h[0]); });
      // the reflexive verb only with its pronoun: me chamo, but não lembro
      var re = D.reflRe ? new RegExp(D.reflRe) : null;
      if (re && i != null) {
        var withPron = i > 0 && wasClitic[i - 1];
        var r1 = lemmas.filter(function (l) { return re.test(l); }), r0 = lemmas.filter(function (l) { return !re.test(l); });
        if (r1.length && r0.length) lemmas = withPron ? r1.concat(r0) : r0;
      }
      lemmas = lemmas.slice(0, 2);
      var mine = hits.filter(function (h) { return lemmas.indexOf(h[0]) >= 0; });
      mine = i == null ? byWeek(mine) : moodFilter(mine, i);
      lemmas = lemmas.filter(function (l) { return mine.some(function (h) { return h[0] === l; }); });
      var tenses = uniq(mine.map(function (h) { return h[1]; }));
      var persons = uniq(mine.filter(function (h) { return h[2] !== -1; }).map(function (h) { return h[2]; }));
      var es = meanings(lemmas);
      if (!es && C && C.info) { try { es = (C.info(lemmas[0]) || {}).es || ""; } catch (e) { /* no */ } }
      if (!es && gl && lemmas.indexOf(gl[0]) >= 0) es = gl[1] || "";
      var idiom = i == null ? "" : idiomAt(i);
      return { kind: "verb", w: w, lemma: lemmas[0], lemmas: lemmas, tenses: tenses, persons: persons, es: es, idiom: idiom };
    }
    /* A name that opens its clause is the subject of what follows (Darcy
       Ribeiro via…, O Vinicius morava…), not an object (convidei o Lucas). */
    function nameSubject(i) {
      if (!T[i] || T[i].clause || has(D.notVerb, T[i].w) || has(D.preps, T[i].w)) return false;
      var k = i - 1;
      while (k >= 0 && isName(k)) k--;
      if (k === i - 1) return false;
      if (k < 0 || T[k + 1].clause) return true;
      // «Darcy Ribeiro via…»: a capitalized word opening the clause, then names
      return T[k].clause && (arts[T[k].w] === 1 || (/^[A-ZÀ-ÖØ-Þ]/.test(T[k].raw) && !SUBJ[T[k].w] && !(D.fn && D.fn[T[k].w]) &&
        !clit[T[k].w] && !gloss[T[k].w] && !nominal(T[k].w)));
    }
    /* «en esta frase»: the idiomatic use of a verb form (valeu, figurati),
       only where it is used that way: alone in its clause («Valeu, falou!»,
       «…, sabe?»), or before the word the package names (deixa eu ver). */
    function idiomAt(i) {
      var t = T[i], x = t && D.idioms && D.idioms[t.w];
      if (!x) return "";
      var es = typeof x === "string" ? x : x.es, n = T[i + 1];
      if (x.next) return n && has(x.next, n.w) ? es : "";
      return t.clause && (!n || n.clause) ? es : "";
    }
    /* A subjunctive reading needs a trigger before it (che, se, que…);
       without one the indicative or the imperative is meant. */
    function moodFilter(hs, i) {
      var S = D.subjTenses || [], trig = false;
      // (an interrogative «che» / «que» at the start is not a trigger)
      for (var k = Math.max(0, i - 6); k < i; k++) {
        if (has(D.subjTriggers, T[k].w) && !(T[k].clause && (has(D.interrog, T[k].w) || has(D.relative, T[k].w)))) trig = true;
      }
      var ok = trig ? hs : hs.filter(function (h) { return !has(S, h[1]); });
      if (!ok.length) ok = hs;
      // an imperative opens its clause (after non / não and pronouns)
      var k2 = i - 1;
      while (k2 >= 0 && !T[k2 + 1].clause && (clit[T[k2].w] || T[k2].w === "non" || T[k2].w === "não")) k2--;
      if (T[k2 + 1] && !T[k2 + 1].clause) {
        var ni = ok.filter(function (h) { return h[1] !== "imperativo"; });
        if (ni.length) ok = ni;
      }
      return byWeek(ok);
    }
    // Tenses the student has not met yet go, unless nothing else is left.
    function byWeek(hs) {
      if (week == null) return hs;
      var ok = hs.filter(function (h) { return tenseWeek(h[1]) <= week; });
      if (ok.length) return ok;
      var min = Math.min.apply(null, hs.map(function (h) { return tenseWeek(h[1]); }));
      return hs.filter(function (h) { return tenseWeek(h[1]) === min; });
    }

    for (var i = 0; i < T.length; i++) {
      if (used[i]) continue;
      var t = T[i], w = t.w, e;
      if (isName(i)) { used[i] = 1; continue; }
      // a locution: c'è, a gente, ce la faccio
      var lc = locAt(i);
      if (lc) {
        e = { kind: "loc", w: joined(i, lc.n), es: lc.es };
        if (lc.verb && lc.verb.hits[0][1]) {
          var vh = moodFilter(lc.verb.hits, i);
          e.lemma = lc.verb.lemma; e.tenses = uniq(vh.map(function (h) { return h[1]; }));
          e.persons = uniq(vh.filter(function (h) { return h[2] !== -1; }).map(function (h) { return h[2]; }));
        }
        push(e, i);
        for (var k = 0; k < lc.n; k++) used[i + k] = 1;
        continue;
      }
      // a clitic before its verb: mi chiamo, l'ho letto, me dá
      var cl = cliticAt(i);
      if (cl) {
        cl.first = firstClitic; firstClitic = false;
        if (t.elided) cl.whole = t.whole.toLowerCase();
        push(cl, i); used[i] = 1; wasClitic[i] = 1;
        continue;
      }
      // an elided form: l'amico, un'idea, dov'è
      if (t.elided) {
        if (contr[w]) push({ kind: "contr", w: t.whole.toLowerCase(), head: w, parts: contr[w], elided: true }, i);
        else if (elide[w]) push({ kind: "elide", w: t.whole.toLowerCase(), head: w, full: elide[w] }, i);
        used[i] = 1;
        continue;
      }
      if (elide[w] && /'$/.test(w)) { push({ kind: "elide", w: w, head: w, full: elide[w] }, i); used[i] = 1; continue; }
      // a pronoun glued to the verb
      var en = encliticAt(i);
      if (en) { push(en, i); used[i] = 1; continue; }
      // auxiliary + participle
      var cp = compoundAt(i);
      if (cp) {
        push({ kind: "comp", w: T[i].w + " " + T[cp.j].w, aux: cp.aux, lemma: cp.lemmas[0], lemmas: cp.lemmas,
          tenses: cp.tenses, persons: cp.persons,
          es: meanings(cp.lemmas) || infoEs(cp.lemmas[0]) }, i);
        used[i] = 1; used[cp.j] = 1;
        continue;
      }
      // estar + gerundio, ir + infinitivo
      var pr = periAt(i);
      if (pr) {
        pr.es = (gloss[pr.lemma] || [])[1] || "";
        push(pr, i); used[i] = 1; used[pr.j] = 1;
        continue;
      }
      // «dai!» alone is not «da + i»
      var ends = !T[i + 1] || T[i + 1].clause;
      if (contr[w] && !ends && !(clit[w] && verbAt(i + 1))) { push({ kind: "contr", w: w, parts: contr[w] }, i); continue; }
      // a grammar word with a fixed explanation: tudo, até, né
      if (D.fn && D.fn[w]) { push({ kind: "fn", w: w, es: D.fn[w] }, i); continue; }
      var gl = g(w), hits = hitsOf(w);
      var prev = i > 0 ? T[i - 1].w : "", next = T[i + 1] ? T[i + 1].w : "";
      var afterSubj = !!SUBJ[prev] || !!wasClitic[i - 1] || nameSubject(i);
      if (has(D.notVerb, w) && !afterSubj) hits = [];
      // after a conjugated ser / estar no second conjugated verb (está limpo)
      if (i > 0 && hits.some(finite) && (idx[prev] || []).some(function (h) { return has(D.copula, h[0]) && finite(h); }) &&
          !isInfinitive(prev)) hits = hits.filter(function (h) { return !finite(h); });
      // no imperative after «não» (the negative imperative is the subjunctive)
      if (has(D.noImpvAfter, prev)) { var nim = hits.filter(function (h) { return h[1] !== "imperativo"; }); if (nim.length) hits = nim; }
      // after the subject a finite form, not the participle (eu pago)
      if (afterSubj && hits.some(finite)) hits = hits.filter(finite);
      var hard = i > 0 && !!arts[prev] && !wasClitic[i - 1];                 // article, contraction, preposition
      var soft = hard || (i > 0 && has(D.det, prev));   // or a determiner (che lavoro, meu visto)
      var glVerb = !!(gl && hits.some(function (h) { return h[0] === gl[0]; }));
      var noun = (nominal(w) && !glVerb) || (gl && gl[1] && hits.length && !glVerb);
      if (hits.length && noun) {
        // a number that is also a verb form (sei): a number after an article
        // or a preposition, before a noun or in «tutti e sei»
        var isNum = has(D.numbers, w);
        var numVerb = isNum && !hard && prev !== "e" &&
          (has(D.interrog, prev) || has(D.subjTriggers, prev) || !(next && nominal(next) && !SUBJ[next]));
        var asVerb = afterSubj || numVerb || !!idiomAt(i) ||
          (!soft && has(D.interrog, prev) && !(next && nominal(next)) && !verbAt(i + 1));
        if (!asVerb) {
          var alt = !soft && !isNum && !t.clause && !has(D.notVerb, w) && hits.some(finite) ? verbEntry(w, hits.filter(finite), null, i) : null;
          if (gl && gl[1] && !transparent(w, gl[1]) && !transparent(gl[0], gl[1])) {
            push({ kind: "word", w: w, lemma: gl[0], es: gl[1], alt: alt }, i);
          } else if (alt && !soft) push(alt, i);
          continue;
        }
      } else if (hits.length && hard) {
        // after an article a verb reading is wrong (um mate, un giro); if
        // the glossary only knows the verb, better say nothing
        // (preciso de ajuda): with the glossary's noun, or nothing
        if (!gl || hits.some(function (h) { return h[0] === gl[0]; })) continue;
        if (gl[1] && !transparent(w, gl[1]) && !transparent(gl[0], gl[1])) push({ kind: "word", w: w, lemma: gl[0], es: gl[1] }, i);
        continue;
      }
      if (hits.length) {
        var ve = verbEntry(w, hits, gl, i);
        if (coll[w]) ve.coll = coll[w];
        push(ve, i);
        continue;
      }
      // a noun whose glossary entry is a verb (o posto → pôr): say nothing
      if (has(D.notVerb, w) && gl && isInfinitive(gl[0]) && gl[0] !== w) continue;
      if (gl && gl[1] && gl[0] && !transparent(w, gl[1]) && !transparent(gl[0], gl[1])) {
        push({ kind: "word", w: w, lemma: gl[0], es: gl[1] }, i);
      }
    }
    out.sort(function (a, b) { return a.at - b.at; });
    return out;
  }

  function uniq(a) { var o = []; a.forEach(function (x) { if (o.indexOf(x) < 0) o.push(x); }); return o; }

  /* ------------------------------------------------------------- lines */

  function tenseText(tenses, persons, week) {
    var ps = (persons || []).slice(0, 3).map(personLabel).filter(Boolean);
    var t = (tenses || []).slice(0, 2).map(function (x) { return label(x, week); }).join(" o ");
    return t + (ps.length ? (t ? ", " : "") + ps.join(" / ") : "");
  }
  function fnText(f) {
    var FN = { od: "objeto directo", oi: "objeto indirecto", refl: "reflexivo", loc: "locativo",
      part: "partitivo", imp: "impersonal, como «se dice»" };
    var fs = String(f || "").split("|");
    if (fs.indexOf("od") >= 0 && fs.indexOf("oi") >= 0) {
      fs = ["odi"].concat(fs.filter(function (x) { return x !== "od" && x !== "oi"; }));
      FN.odi = "objeto directo o indirecto";
    }
    return fs.map(function (x) { return FN[x] || x; }).join(" o ");
  }

  /* The same, as short lines of text with *marks* (the app renders them).
     opts.week: the student's week (tense names only once taught);
     opts.max: at most so many lines, dropping plain words first. */
  function lines(text, opts) {
    opts = opts || {};
    var week = opts.week == null ? null : +opts.week, D = rules();
    var es = of(text, opts);
    if (opts.max && es.length > opts.max) {
      var drop = es.length - opts.max;
      for (var k = es.length - 1; k >= 0 && drop > 0; k--) if (es[k].kind === "word") { es.splice(k, 1); drop--; }
      es = es.slice(0, opts.max);
    }
    return es.map(function (e) {
      if (e.kind === "contr") {
        if (e.elided) return "*" + e.w + "*: *" + e.head + "* = *" + e.parts[0] + "* + *" + e.parts[1] + "*, sin la vocal delante de vocal";
        return "*" + e.w + "* = *" + e.parts[0] + "* + *" + e.parts[1] + "*";
      }
      if (e.kind === "loc") {
        var vt = e.lemma && e.tenses ? " (de *" + e.lemma + "*, " + tenseText(e.tenses, e.persons, week) + ")" : "";
        return "*" + e.w + "*" + vt + " — «" + e.es.replace(/^«|»$/g, "") + "»";
      }
      if (e.kind === "clitic") {
        var who = e.whole ? "*" + e.w + "* (*" + e.whole + "*)" : "*" + e.w + "*";
        return who + ": pronombre átono «" + e.es + "», " + fnText(e.fn) +
          (e.refl ? " (*" + e.refl + "*)" : "") + ", delante de *" + e.verb + "*" + (e.with_ ? " (va con *" + e.with_ + "*)" : "") +
          (e.first && D.position ? " — " + D.position : "");
      }
      if (e.kind === "elide") {
        if (e.w === e.head) return "*" + e.w + "* = *" + e.full + "*, acortado";
        return "*" + e.w + "*: *" + e.head + "* = *" + e.full + "*, sin la vocal delante de vocal";
      }
      if (e.kind === "encl") {
        var how = e.form === "infinitivo" ? (e.rloss ? "infinitivo: delante de *-lo*, *-la* pierde la *-r* y lleva tilde" :
            e.base === e.lemma ? "infinitivo" : "infinitivo de *" + e.lemma + "*") :
          e.form === "imperativo" ? "imperativo de *" + e.lemma + "*" :
          e.form === "gerundio" ? "gerundio de *" + e.lemma + "*" :
          !e.lemma ? "forma verbal" :
          "de *" + e.lemma + "*, " + tenseText(e.tenses, e.persons, week) + (e.lost ? "; pierde la última consonante delante de *-lo*, *-la*" : "");
        return "*" + e.w + "* = *" + e.base + "* + *" + e.suf + "* «" + e.sufEs + "» (" + how + "): " +
          (D.enclitic && D.enclitic.note || "pronombre pegado al verbo");
      }
      if (e.kind === "comp") {
        var nm = e.tenses.slice(0, 2).map(function (x) { return label(x, week); }).join(" o ");
        var ps = e.persons.slice(0, 3).map(personLabel).filter(Boolean).join(" / ");
        return "*" + e.w + "*: de *" + e.lemmas.join("* o *") + "*, " + nm + " (*" + e.aux + "* + participio" +
          (ps ? ", " + ps : "") + ")" + (e.es ? " — «" + e.es + "»" : "");
      }
      if (e.kind === "peri") {
        return "*" + e.w + "*: *" + e.aux + "* (" + tenseText(e.tenses, e.persons, week) + ") + " + e.form + " de *" + e.lemma +
          "* = " + e.what + (e.coll ? "; *" + e.auxForm + "* = *" + e.coll + "*, coloquial" : "") +
          (e.es ? " — «" + e.es + "»" : "");
      }
      if (e.kind === "fn") return "*" + e.w + "*: " + e.es;
      if (e.kind === "verb") {
        return "*" + e.w + "*: de *" + (e.lemmas || [e.lemma]).join("* o *") + "* (" + tenseText(e.tenses, e.persons, week) + ")" +
          (e.coll ? ", coloquial de *" + e.coll + "*" : "") +
          (e.es ? " — «" + e.es + "»" : "") + (e.idiom ? "; en esta frase: «" + e.idiom + "»" : "");
      }
      var s = "*" + e.w + "*" + (e.lemma !== e.w ? " (de *" + e.lemma + "*)" : "") + " — «" + e.es + "»";
      if (e.alt) s += "; también puede ser de *" + e.alt.lemma + "* (" + tenseText(e.alt.tenses, e.alt.persons, week) + ")";
      return s;
    });
  }

  var api = { of: of, lines: lines, label: label, transparent: transparent,
    _reset: function () { FORMS = null; CONTR = null; NOMINAL = null; ARTS = null; } };
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Desglose = api;
})(typeof window !== "undefined" ? window : globalThis);
