/*
 * La diagnosi: capire *che tipo* di errore è, non solo che è sbagliato.
 *
 * La ricerca sul feedback correttivo indica cosa fare:
 *  - i "prompt" (indizi metalinguistici che spingono a correggersi da soli)
 *    funzionano meglio del dare subito la forma giusta (Lyster & Ranta 1997;
 *    meta-analisi di Lyster & Saito 2010);
 *  - il feedback specifico sulla risposta data ("perché questa è sbagliata")
 *    è più utile della semplice verifica (Shute 2008);
 *  - gli errori di regola (ausiliare, accordo, articolo, tempo) si curano
 *    con la regola; quelli lessicali con il significato e un esempio
 *    (Ferris 1999, errori "trattabili" e "non trattabili");
 *  - un refuso o un accento sono sviste, non errori di sistema: si segnalano
 *    senza insistere (Corder 1967);
 *  - sbagliare e poi ricevere una correzione che analizza l'errore fa
 *    imparare, soprattutto quando si era sicuri (Metcalfe 2017).
 *
 * diagnose(dato, attese, ctx) → { verdict, cat, slip, hint, explain,
 *                                  given, fixed, others }
 *   hint     indizio da mostrare al primo tentativo (non rivela la risposta)
 *   explain  spiegazione completa dopo la soluzione
 *   given    token della risposta data, con quello sbagliato marcato
 *   fixed    token della risposta attesa, con quello corretto marcato
 *
 * I dati sul trasferimento dallo spagnolo (parole, falsi amici, grafie) e il
 * lessico arrivano da data/bank.json tramite init(); senza, la diagnosi usa
 * solo regole e il coniugatore.
 */
(function (root) {
  "use strict";

  var Conj = root.Conj ||
    (typeof require === "function" ? require("./conjugator.js") : null);

  // Maps keyed by what the learner types must not inherit from Object:
  // "constructor" or "__proto__" are words someone can type.
  function dict(o) {
    var d = Object.create(null);
    if (o) Object.keys(o).forEach(function (k) { d[k] = o[k]; });
    return d;
  }

  var DATA = { esIt: dict(), falsi: dict(), spelling: [], lex: dict(), adj: dict(), nouns: dict(), nounsByPlural: dict() };

  /* --------------------------------------------------------- strumenti */

  function deaccent(s) {
    return String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  // Tokens for comparison: lower case, punctuation out, elisions split
  // after the apostrophe (l'amico → l' + amico).
  function tokens(s) {
    return String(s == null ? "" : s)
      .toLowerCase()
      .replace(/[’‘`´]/g, "'")
      .replace(/[\u200b-\u200d\u2060\ufeff]/g, "")
      .replace(/\p{Extended_Pictographic}|[\ufe0f\u{1f3fb}-\u{1f3ff}]/gu, " ")
      .replace(/[«»"“”.,;:!?¿¡()…—–-]+/g, " ")
      .replace(/'/g, "' ")
      .split(/\s+/)
      .filter(Boolean);
  }

  function degeminate(s) { return s.replace(/([bcdfglmnpqrstvz])\1/g, "$1"); }

  // Damerau distance: two swapped letters (vicion/vicino) are one slip.
  function editDistance(a, b) {
    var d = [], i, j;
    for (i = 0; i <= a.length; i++) { d[i] = [i]; }
    for (j = 0; j <= b.length; j++) d[0][j] = j;
    for (i = 1; i <= a.length; i++) {
      for (j = 1; j <= b.length; j++) {
        var c = a[i - 1] === b[j - 1] ? 0 : 1;
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + c);
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
          d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
        }
      }
    }
    return d[a.length][b.length];
  }

  function similarity(a, b) {
    var d = editDistance(deaccent(a), deaccent(b));
    return 1 - d / Math.max(a.length, b.length, 1);
  }

  /* Allinea due sequenze di token: equal / sub / miss (manca nella risposta)
     / extra (in più nella risposta).  La sostituzione costa meno quando le
     parole si somigliano, così "ho"≠"sono" si accoppiano come sostituzione
     e "nono"/"nonno" pure. */
  function align(g, e) {
    var n = g.length, m = e.length, D = [], i, j;
    for (i = 0; i <= n; i++) { D[i] = []; for (j = 0; j <= m; j++) D[i][j] = 0; }
    for (i = 1; i <= n; i++) D[i][0] = i;
    for (j = 1; j <= m; j++) D[0][j] = j;
    for (i = 1; i <= n; i++) {
      for (j = 1; j <= m; j++) {
        var same = g[i - 1] === e[j - 1];
        var sub = same ? 0 : subCost(g[i - 1], e[j - 1]);
        D[i][j] = Math.min(D[i - 1][j] + 1, D[i][j - 1] + 1, D[i - 1][j - 1] + sub);
      }
    }
    var ops = [];
    i = n; j = m;
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0) {
        var same2 = g[i - 1] === e[j - 1];
        var sub2 = same2 ? 0 : subCost(g[i - 1], e[j - 1]);
        if (Math.abs(D[i][j] - (D[i - 1][j - 1] + sub2)) < 1e-9) {
          ops.unshift({ op: same2 ? "eq" : "sub", g: g[i - 1], e: e[j - 1], gi: i - 1, ei: j - 1 });
          i--; j--; continue;
        }
      }
      if (i > 0 && Math.abs(D[i][j] - (D[i - 1][j] + 1)) < 1e-9) {
        ops.unshift({ op: "extra", g: g[i - 1], gi: i - 1, ei: j });
        i--; continue;
      }
      ops.unshift({ op: "miss", e: e[j - 1], ei: j - 1, gi: i });
      j--;
    }
    return ops;
  }

  // Substituting a word for another costs less when they look alike, and
  // two forms of one verb (ha / abbiamo) pair up before a deletion does.
  // The same slot filled with another word of its closed class: an article
  // for an article (la rapporto → il rapporto), an auxiliary for an
  // auxiliary (mi ho → mi sono), a pronoun for a pronoun (mi ne → me ne).
  function sameSlot(a, b) {
    var aux = function (w) { return AVERE.indexOf(w) >= 0 || ESSERE.indexOf(w) >= 0; };
    return !!((ARTICLES[a] && ARTICLES[b]) || (aux(a) && aux(b)) ||
              (CLITICS.indexOf(a) >= 0 && CLITICS.indexOf(b) >= 0) || (prepInfo(a) && prepInfo(b)));
  }
  function subCost(a, b) {
    var c = 1.4 - 0.6 * similarity(a, b);
    if (c > 0.7) {
      if (!VIDX) buildVerbIndex();
      var fa = VIDX[a] || [], fb = VIDX[b] || [];
      if (sameSlot(a, b) || fa.some(function (x) { return fb.some(function (y) { return x.lemma === y.lemma; }); })) c = 0.7;
    }
    return c;
  }

  function lcsLen(a, b) {
    var prev = [], cur, i, j;
    for (j = 0; j <= b.length; j++) prev[j] = 0;
    for (i = 1; i <= a.length; i++) {
      cur = [0];
      for (j = 1; j <= b.length; j++) {
        cur[j] = a[i - 1] === b[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], cur[j - 1]);
      }
      prev = cur;
    }
    return prev[b.length];
  }

  // The language in italics.  A whole sentence loses its final full stop
  // (the explanation puts its own) and the space a gap left before «.».
  function it(w) {
    return "*" + String(w).replace(/\s+([.,;:!?])/g, "$1").replace(/\.\s*$/, "").trim() + "*";
  }

  /* ----------------------------------------------------- inventari */

  var ARTICLES = dict({
    "il": ["m", "s", "det"], "lo": ["m", "s", "det"], "l'": ["?", "s", "det"],
    "la": ["f", "s", "det"], "i": ["m", "p", "det"], "gli": ["m", "p", "det"],
    "le": ["f", "p", "det"], "un": ["m", "s", "ind"], "uno": ["m", "s", "ind"],
    "una": ["f", "s", "ind"], "un'": ["f", "s", "ind"]
  });

  var PREP_BASE = dict({ di: "di", a: "a", da: "da", in: "in", su: "su", con: "con",
                    per: "per", tra: "tra", fra: "fra" });
  var ART_PREP = dict();
  (function () {
    var bases = { a: "a", di: "de", da: "da", in: "ne", su: "su" };
    var arts = { il: "l", lo: "llo", "l'": "ll'", la: "lla", i: "i", gli: "gli", le: "lle" };
    Object.keys(bases).forEach(function (b) {
      Object.keys(arts).forEach(function (a) {
        var form = bases[b] + arts[a];
        if (b === "a" && a === "i") form = "ai";
        if (b === "di" && a === "i") form = "dei";
        if (b === "da" && a === "i") form = "dai";
        if (b === "in" && a === "i") form = "nei";
        if (b === "su" && a === "i") form = "sui";
        if (b === "a" && a === "il") form = "al";
        if (b === "di" && a === "il") form = "del";
        if (b === "da" && a === "il") form = "dal";
        if (b === "in" && a === "il") form = "nel";
        if (b === "su" && a === "il") form = "sul";
        ART_PREP[form] = [b, a];
      });
    });
    ART_PREP.col = ["con", "il"];
    ART_PREP.coi = ["con", "i"];
  })();

  function prepInfo(w) {
    if (PREP_BASE[w]) return { base: PREP_BASE[w], art: null };
    if (ART_PREP[w]) return { base: ART_PREP[w][0], art: ART_PREP[w][1] };
    return null;
  }

  function contract(prep, art) {
    for (var k in ART_PREP) {
      if (ART_PREP[k][0] === prep && ART_PREP[k][1] === art) return k;
    }
    return null;
  }

  var CLITICS = ["mi", "ti", "si", "ci", "vi", "lo", "la", "li", "le", "gli", "ne",
                 "me", "te", "se", "ce", "ve", "glie", "m'", "t'", "s'", "c'", "l'"];
  var SUBJECTS = ["io", "tu", "lui", "lei", "noi", "voi", "loro", "egli", "ella"];
  var FAMILY = ["madre", "padre", "fratello", "sorella", "moglie", "marito", "figlio",
                "figlia", "nonno", "nonna", "zio", "zia", "cugino", "cugina",
                "nipote", "suocero", "suocera", "cognato", "cognata", "mamma", "papà"];
  var POSSESSIVE = ["mio", "mia", "tuo", "tua", "suo", "sua", "nostro", "nostra",
                    "vostro", "vostra", "miei", "mie", "tuoi", "tue", "suoi", "sue",
                    "nostri", "nostre", "vostri", "vostre", "loro"];
  var OPINION = ["penso", "pensi", "pensa", "pensiamo", "credo", "credi", "crede",
                 "spero", "speri", "spera", "voglio", "vuoi", "vuole", "sembra",
                 "immagino", "dubito", "importante", "necessario", "bisogna",
                 "prima", "benché", "sebbene", "affinché", "purché", "senza",
                 "peccato", "meglio", "possibile", "probabile", "temo", "ho paura"];

  /* ---------------------------------------------------- indice verbi */

  var VIDX = null;   // forma → [{lemma, tense, p}]
  var PIDX = null;   // participio → lemma
  var PALL = null;   // participio → every lemma it belongs to
  var LIDX = null;   // infinito → true

  function buildVerbIndex() {
    VIDX = dict(); PIDX = dict(); LIDX = dict(); PALL = dict();
    if (!Conj) return;
    Conj.list().forEach(function (v) {
      LIDX[v] = true;
      Conj.SIMPLE_TENSES.forEach(function (t) {
        var forms;
        try { forms = Conj.conjugate(v, t); } catch (e) { return; }
        forms.forEach(function (f, p) {
          var w = f.split(" ").pop();     // reflexives: "mi alzo" → alzo
          (VIDX[w] = VIDX[w] || []).push({ lemma: v, tense: t, p: p });
        });
      });
      try {
        var pp = Conj.participle(v);
        [pp, pp.replace(/o$/, "a"), pp.replace(/o$/, "i"), pp.replace(/o$/, "e")]
          .forEach(function (x) { PIDX[x] = v; (PALL[x] = PALL[x] || []).push(v); });
      } catch (e) { /* */ }
    });
  }

  function verbForms(w) {
    if (!VIDX) buildVerbIndex();
    return VIDX[w] || [];
  }

  function participleLemmas(w) {
    if (!PALL) buildVerbIndex();
    return PALL[w] || [];
  }

  function participleOf(w) {
    if (!PIDX) buildVerbIndex();
    return PIDX[w] || null;
  }

  // A verb the conjugator knows, or a bank word glossed as a Spanish infinitive.
  function isInfinitive(w) {
    if (!LIDX) buildVerbIndex();
    if (!/(are|ere|ire|rre)$/.test(w)) return false;
    if (LIDX[w]) return true;
    var gl = DATA.lex[w] ? String(DATA.lex[w]).split(/[,;/(]/)[0].trim() : "";
    return /(ar|er|ir)(se)?$/.test(gl);
  }

  var AVERE = ["ho", "hai", "ha", "abbiamo", "avete", "hanno", "avevo", "avevi", "aveva",
               "avevamo", "avevate", "avevano", "avrò", "avrai", "avrà", "avremo", "avrete",
               "avranno", "avrei", "avresti", "avrebbe", "avremmo", "avreste", "avrebbero",
               "abbia", "abbiano", "avessi", "avesse", "avessimo", "aveste", "avessero", "ebbi"];
  var ESSERE = ["sono", "sei", "è", "siamo", "siete", "ero", "eri", "era", "eravamo",
                "eravate", "erano", "sarò", "sarai", "sarà", "saremo", "sarete", "saranno",
                "sarei", "saresti", "sarebbe", "saremmo", "sareste", "sarebbero", "sia",
                "siano", "fossi", "fosse", "fossimo", "foste", "fossero", "fui"];

  var TENSE_ES = {
    presente: "presente", imperfetto: "imperfetto", futuro: "futuro",
    passatoRemoto: "passato remoto", condizionale: "condizionale",
    congiuntivo: "congiuntivo presente", congImperfetto: "congiuntivo imperfetto"
  };
  var PERS_ES = ["io", "tu", "lui/lei", "noi", "voi", "loro"];

  /* Palabras funcionales del castellano que no existen en italiano: el
     artículo, «que», «es», «muy»…  Cuando aparecen, lo que hay es español
     dentro del italiano, no un tipeo ni un problema de vocabulario. */
  var ES_FUNC = dict({
    el: "il / lo / l'", los: "i / gli", las: "le", unos: "dei / degli / alcuni", unas: "delle / alcune",
    de: "di / da", en: "in / a", por: "per", para: "per", y: "e", que: "che",
    es: "è", son: "sono", soy: "sono", eres: "sei", somos: "siamo", esta: "questa / è",
    tengo: "ho", tiene: "ha", tienes: "hai", tenemos: "abbiamo", tienen: "hanno",
    muy: "molto", tambien: "anche", siempre: "sempre", nunca: "mai", pero: "ma / però",
    porque: "perché", cuando: "quando", donde: "dove", hay: "c'è / ci sono",
    este: "questo", ese: "quello", esa: "quella", mas: "più", menos: "meno",
    bien: "bene", mal: "male", hola: "ciao", gracias: "grazie", adios: "arrivederci",
    yo: "io", ella: "lei", nosotros: "noi", ellos: "loro", ellas: "loro", usted: "Lei",
    mucho: "molto", mucha: "molta", muchos: "molti", muchas: "molte", todo: "tutto", todos: "tutti",
    algo: "qualcosa", aqui: "qui", ahi: "lì", alli: "là", hoy: "oggi", ayer: "ieri",
    manana: "domani", "mañana": "domani", ahora: "adesso / ora", despues: "dopo", antes: "prima",
    entonces: "allora", sobre: "su / sopra", sin: "senza", hasta: "fino a", desde: "da",
    tus: "i tuoi", sus: "i suoi", mis: "i miei", nuestro: "nostro", nuestra: "nostra",
    tarde: "tardi / pomeriggio / sera", noche: "notte / sera", hora: "ora", horas: "ore", cuarto: "quarto",
    minutos: "minuti", mediodia: "mezzogiorno", medianoche: "mezzanotte", semana: "settimana",
    dia: "giorno", dias: "giorni", mes: "mese", meses: "mesi", anos: "anni", "años": "anni",
    tener: "avere", ser: "essere", estar: "stare / essere", hacer: "fare", ir: "andare",
    querer: "volere", poder: "potere", decir: "dire", comer: "mangiare", vivir: "vivere / abitare"
  });
  function spanishWord(w) {
    var k = deaccent(String(w).toLowerCase());
    if (isItalian(w) || isItalian(k)) return null;
    return ES_FUNC[k] || ES_FUNC[w] || (DATA.esIt[k] ? DATA.esIt[k][0] : null) || (DATA.esIt[w] ? DATA.esIt[w][0] : null);
  }

  /* Una palabra que no está en ningún diccionario pero tiene pinta de
     castellano: ñ, tilde aguda, -s final (los, tienes, somos), -ción, -dad,
     un infinitivo en -ar / -ir.  El italiano no termina en -s (salvo bus,
     gas y préstamos) ni usa á í ó ú. */
  var IT_LOAN_S = /^(bus|gas|tris|bis|lapis|plus|virus|autobus|stress|jeans|mouse|business|fitness|bonus|campus|corpus|iris|ananas|atlas|iris|caos|ibis)$/;
  function looksSpanish(w) {
    var x = String(w).toLowerCase();
    if (!/^[a-zà-ÿñ']+$/.test(x) || isItalian(x) || isItalian(deaccent(x))) return false;
    if (/[áíóúñ]/.test(x) || /é./.test(x)) return true;
    if (x.length >= 3 && /[aeiouáéíóú]s$/.test(x) && !IT_LOAN_S.test(x)) return true;
    if (/(ción|sión|dad|tad)$/.test(x)) return true;
    if (x.length >= 4 && /[^aeiou][aeiou][ri]r$/.test(x) && !/er$/.test(x)) return true;
    if (x.length >= 4 && x.length <= 6 && /[^aeiou]er$/.test(x)) return true;
    if (x.length >= 5 && /[ae]n$/.test(x)) return true;   // tienen, esperen, hablan
    return false;
  }
  function spanishish(w) { return !!spanishWord(w) || looksSpanish(w); }

  /* Un ejercicio de hueco («___ casa», «Sto bene, ___. E tu?»): la respuesta
     se juzga dentro de su oración, así las reglas ven el sustantivo después
     del artículo, el sujeto antes del verbo, la hora después de «sono». */
  function expandGap(stem, given, targets) {
    if (!stem || !/_{3,}/.test(stem)) return null;
    var clean = String(stem).replace(/\([^)]*\)/g, " ").replace(/\s+/g, " ").trim();
    // «Non lo toccare! → ___!»: what comes before the arrow is the model to
    // transform, not the sentence the answer goes into.
    var arrow = clean.lastIndexOf("→", clean.search(/_{3,}/));
    if (arrow >= 0) clean = clean.slice(arrow + 1).trim();
    var pieces = clean.split(/_{3,}/);
    var nGaps = pieces.length - 1;
    for (var i = 0; i < nGaps; i++) {
      var before = pieces[i].slice(-1), after = pieces[i + 1].charAt(0);
      if ((before && /[a-zà-ù']/i.test(before)) || (after && /[a-zà-ù']/i.test(after))) return null;
    }
    var fill = function (parts) {
      if (!parts || parts.length !== nGaps) return null;
      var out = pieces[0];
      for (var k = 0; k < nGaps; k++) out += parts[k] + pieces[k + 1];
      return out.replace(/\s+/g, " ").replace(/\s+([.,;:!?])/g, "$1").trim();
    };
    var targetParts = targets.map(function (t) { return String(t).split(/\s*\|\s*/); });
    var gParts;
    if (nGaps === 1) gParts = [String(given).trim()];
    else {
      var gw = String(given).trim().split(/\s+/), tp = targetParts[0];
      if (gw.length === nGaps) gParts = gw;
      else if (tp && gw.length === tp.join(" ").trim().split(/\s+/).length) {
        gParts = []; var at = 0;
        tp.forEach(function (pp) { var n = pp.trim().split(/\s+/).length; gParts.push(gw.slice(at, at + n).join(" ")); at += n; });
      } else return null;
    }
    var g2 = fill(gParts);
    var t2 = targetParts.map(fill).filter(Boolean);
    if (!g2 || !t2.length) return null;
    return { given: g2, targets: t2 };
  }

  // The singular an exercise names («fantasma → ___», «___ (parco)»).
  function singularFromStem(stem) {
    var m = /([a-zà-ù']+)\s*→\s*_{3,}/i.exec(stem || "") || /\(([a-zà-ù']+)\)/i.exec(stem || "");
    return m ? m[1].toLowerCase() : null;
  }

  // Why this plural: the ending rule, in one line.
  function pluralExplain(s, e) {
    if (!s) return "Plural: " + it(e) + ".";
    var rule;
    if (s === e) rule = "no cambia en plural (" + (/[àèéìòù]$/.test(s) ? "termina en vocal acentuada" : /[^aeiou]$/.test(s) ? "termina en consonante" : "es invariable") + ")";
    else if (/[cg]a$/.test(s) && /(che|ghe)$/.test(e)) rule = "-ca / -ga hacen -che / -ghe para conservar el sonido duro";
    else if (/[cg]o$/.test(s) && /(chi|ghi)$/.test(e)) rule = "-co / -go hacen -chi / -ghi, con el sonido duro";
    else if (/[cg]o$/.test(s) && /(ci|gi)$/.test(e)) rule = "-co / -go suelen hacer -ci / -gi cuando el acento va en la antepenúltima sílaba (mè-di-co → medici, psi-cò-lo-go → psicologi); amico, nemico, greco y porco también, aunque el acento vaya en la anteúltima";
    else if (/[cg]ia$/.test(s) && /(ce|ge)$/.test(e)) rule = "-cia / -gia, cuando la i no lleva el acento, pierden la i si antes hay una consonante: -ce / -ge (arancia → arance, spiaggia → spiagge); si antes hay una vocal, la conservan (camicia → camicie, valigia → valigie)";
    else if (/io$/.test(s) && e === s.slice(0, -2) + "i") rule = "-io hace una sola -i cuando la i no lleva el acento (stù-dio → studi; en cambio zì-o → zii)";
    else if (/a$/.test(s) && /e$/.test(e)) rule = "los sustantivos en -a hacen -e";
    else if (/a$/.test(s) && /i$/.test(e)) rule = "los masculinos en -a (problema, poeta, turista) hacen -i";
    else if (/o$/.test(s) && /i$/.test(e)) rule = "los sustantivos en -o hacen -i";
    else if (/e$/.test(s) && /i$/.test(e)) rule = "los sustantivos en -e hacen -i, masculinos y femeninos";
    else if (/o$/.test(s) && /a$/.test(e)) rule = "plural irregular en -a, femenino (uovo → uova, paio → paia, dito → dita)";
    else rule = "plural irregular, de memoria";
    // the contrast with Spanish, where the plural adds -s
    var es = /^(los sustantivos en|los masculinos en|-co|-ca|-io|-cia)/.test(rule) ? " En español se agrega -s; en italiano cambia la vocal del final." : "";
    return "Plural: " + it(s) + " → " + it(e) + ": " + rule + "." + es;
  }

  /* The Spanish spelling of an Italian word (ñ, ll, qu, j…): the rule that
     turns what was written into the Italian word, or null.  Only an exact
     conversion counts (or one more slip at most): «pecacto» is a typo in
     *peccato*, not «ct → tt». */
  var SPELL_EXTRA = [
    ["lli", "gli", "El sonido de la ll tradicional (no la rioplatense) se escribe gli: famiglia, figlio."],
    ["aqu", "acqu", "*Acqua*, sus derivados y algunas palabras más se escriben con cq: acqua, acquario, acquisto."],
    ["ge", "ghe", "Para el sonido /ge/ se escribe *ghe* (spaghetti, laghetto); *ge* suena /dʒe/."],
    ["gi", "ghi", "Para el sonido /gi/ se escribe *ghi* (laghi, ghiaccio); *gi* suena /dʒi/."],
    ["cie", "zie", "El sonido /ts/ se escribe con z: grazie, zio, piazza."],
    ["ci", "zi", "El sonido /ts/ se escribe con z: stazione, grazie."]];
  function spellingMatch(g, e) {
    var gs = deaccent(g), es = deaccent(e);
    // A plural written wrong (arancie → arance) is the plural rule, not spelling.
    var npE = DATA.nounsByPlural[e];
    if (npE && npE.s !== e) return null;
    var spellings = DATA.spelling.concat(SPELL_EXTRA);
    var graw = g.replace(/ñ/g, "\u0000");
    for (var k = 0; k < spellings.length; k++) {
      var sp = spellings[k];
      var src = sp[0] === "ñ" ? graw.replace(/\u0000/g, "ñ") : gs;
      var pat = sp[0] === "ñ" ? "ñ" : deaccent(sp[0]);
      if (src.indexOf(pat) < 0) continue;
      var conv = deaccent(src.split(pat).join(deaccent(sp[1])));
      if (conv === es || (degeminate(conv) === degeminate(es) && editDistance(conv, es) <= 1)) return sp;
    }
    return null;
  }

  /* What was written is the Spanish word for the one expected: the
     dictionary maps it there, the expected word's own gloss has it
     (casamiento → matrimonio: «casamiento / matrimonio»), or it is a Spanish
     function word (que, para).  Never an Italian word. */
  function spanishFor(g, e) {
    // (a grave accent is Italian typing: «cafè» is caffè without its double)
    if (!g || g === e || isItalian(g) || isItalian(deaccent(g)) || /[àèìòù]/.test(g)) return null;
    var gs = deaccent(g);
    var hit = function (list) {
      return String(list).split(/\s*\/\s*/).some(function (w) { return w === e || w.split(" ").indexOf(e) >= 0; });
    };
    var tr = DATA.esIt[gs] || DATA.esIt[g];
    if (tr && hit(tr[0])) return { note: tr[1] || "" };
    if (ES_FUNC[gs] && hit(ES_FUNC[gs])) return { note: "" };
    var n = DATA.nouns[e] || DATA.nounsByPlural[e];
    var gl = DATA.lex[e] || (n ? n.es : "");
    if (gl && String(gl).toLowerCase().split(/\s*[\/,;()]\s*/).some(function (x) { return x && deaccent(x.trim()) === gs; })) return { note: "" };
    return null;
  }

  // Short words that only the accent tells apart.
  var MONO = dict({
    "dà": "*dà* con tilde es el verbo (da, de *dare*: mi dà fastidio); *da* sin tilde es la preposición (desde, de: vengo da Roma).",
    "là": "*là* con tilde es «allá»; *la* sin tilde es el artículo o el pronombre (la vedo).",
    "lì": "*lì* con tilde es «ahí»; *li* sin tilde es el pronombre «los» (li vedo).",
    "sì": "*sì* con tilde es «sí», la afirmación; *si* sin tilde es el pronombre (si chiama = se llama). Como en español «sí / si», pero el «si» condicional italiano es *se*.",
    "né": "*né* con tilde es «ni» (né… né); *ne* sin tilde es el pronombre «de eso» (ne voglio due).",
    "sé": "*sé* con tilde es «sí mismo» (pensa a sé); *se* sin tilde es el «si» condicional (se vuoi) o el pronombre ante lo, la, ne (se lo dice).",
    "tè": "*tè* con tilde es el té, la bebida; *te* sin tilde es el pronombre (te lo dico)."
  });

  /* ------------------------------------------------ diagnosi di coppia */

  // Each rule returns null or {cat, slip, hint, explain}.  Order matters:
  // grammar that a form reveals beats "that looks Spanish" or "a typo".
  function pairRules(g, e, ctx) {
    var r, gs = deaccent(g), es = deaccent(e);

    // 0. The Spanish word itself (médico, casamiento, que, profesor): what
    //    happened is Spanish, and the spelling detail comes after.
    var spW = spanishFor(g, e);
    if (spW) {
      var spS = spellingMatch(g, e);
      var gd0 = deaccent(g), ed0 = deaccent(e);
      var detail = spS ? " " + spS[2]
        : degeminate(gd0) === degeminate(ed0) && gd0 !== ed0
          ? (ed0.length > gd0.length ? " Ojo con la doble consonante, que en italiano se pronuncia más larga." : " Ojo: en italiano va con una sola consonante.")
        : gd0 === ed0 && /[áíóú]/.test(g) ? " En italiano la tilde solo se escribe en la vocal final (città, perché), nunca en el medio de la palabra."
        : "";
      return { cat: "parola_spagnola", slip: false,
        hint: it(g) + " es la palabra en español. ¿Cómo es en italiano?",
        explain: it(g) + " es español; en italiano: " + it(e) + "." + detail + (spW.note ? " " + spW.note : "") };
    }

    // 1. Accento (anche e' per è: la tastiera senza tilde)
    if (/[aeiou]'$/.test(g) && /[àèéìòù]$/.test(e) && deaccent(g.slice(0, -1)) === es) return { cat: "accento", slip: true,
      hint: "La tilde no se reemplaza con apóstrofo.",
      explain: "Se escribe " + it(e) + ", con la tilde sobre la vocal (no " + it(g) + "). Tenés los botones à è é ì ò ù abajo del cuadro." };
    if (gs === es) {
      if (e === "è" && g === "e") return { cat: "accento", slip: false,
        hint: "Mirá la palabra marcada: ¿es el verbo («es») o la «y»?",
        explain: "*è* con tilde es el verbo (es/está); *e* sin tilde es «y»." };
      if (e === "e" && g === "è") return { cat: "accento", slip: false,
        hint: "Mirá la palabra marcada: ¿es el verbo («es») o la «y»?",
        explain: "Acá va *e* sin tilde: es la «y» que une dos cosas. *È* es el verbo (es/está)." };
      // Two short words that only the accent tells apart (dà / da, sì / si).
      var mono = MONO[e] || MONO[g];
      if (mono) return { cat: "accento", slip: false,
        hint: "Con tilde y sin tilde son dos palabras distintas: ¿cuál va acá?",
        explain: "Acá va " + it(e) + ". " + mono };
      if (/é$/.test(e) && /è$/.test(g)) return { cat: "accento", slip: true,
        hint: "Revisá hacia dónde va la tilde.",
        explain: "Tilde aguda: " + it(e) + ". *Perché, poiché, affinché, né, sé* llevan é cerrada." };
      if (/[àèéìòù]/.test(e) && !/[àèéìòù]/.test(g)) return { cat: "accento", slip: true,
        hint: "Te falta una tilde.",
        explain: "Falta la tilde: " + it(e) + ". En italiano la tilde marca la vocal final cuando el acento cae ahí (città, perché, parlerò, più)." };
      if (!/[àèéìòù]/.test(e)) return { cat: "accento", slip: true,
        hint: "Revisá las tildes: ¿esa palabra lleva?",
        explain: it(e) + " va sin tilde. En italiano la tilde solo se escribe sobre la vocal final, cuando el acento cae ahí (città, perché, più), nunca en el medio de la palabra como en español (médico → medico)." };
      return { cat: "accento", slip: true, hint: "Revisá las tildes.",
        explain: "La tilde va así: " + it(e) + "." };
    }

    // 1b. «no» where Italian says «non» (no so, no parlo)
    if (g === "no" && e === "non") return { cat: "parola_spagnola", slip: false,
      hint: "La negación delante del verbo, ¿cómo es en italiano?",
      explain: "Delante del verbo la negación es *non*: " + it("non " + (ctx.e[ctx.ei + 1] || "")) + ". *No* va solo, como respuesta (No, grazie). En español «no» sirve para las dos cosas." };

    // 2. H di avere (o → ho, anno → hanno)
    if (AVERE.indexOf(e) >= 0 && /^h/.test(e) && g === e.slice(1)) return { cat: "ortografia", slip: false,
      hint: "Esa forma de *avere* se escribe distinto.",
      explain: "*ho, hai, ha, hanno* llevan h (que no suena). Sin h son otras palabras: *o* = o, *ai* = a los, *a* = a, *anno* = año." };

    // 3. Apostrofo («un'» / «un» ante vocal es el género, no la ortografía)
    if (/^un'?$/.test(g) && /^un'?$/.test(e) && g !== e && ctx.e[ctx.ei + 1]) {
      var nn = ctx.e[ctx.ei + 1];
      return { cat: "genere", slip: false,
        hint: "¿" + it(nn) + " es masculino o femenino? El apóstrofo lo dice.",
        explain: e === "un'" ? "*un'* con apóstrofo es el femenino ante vocal: *un'" + nn + "* (un'amica, un'ora). *Un* sin apóstrofo es masculino: un amico."
                             : "*un* sin apóstrofo es el masculino, también ante vocal: *un " + nn + "* (un amico, un uomo). *Un'* con apóstrofo es femenino: un'amica." };
    }
    if (g.replace(/'/g, "") === e.replace(/'/g, "")) return { cat: "ortografia", slip: true,
      hint: "Revisá el apóstrofo.",
      explain: e.indexOf("'") >= 0 ? "Acá va apóstrofo: " + it(e) + "."
        : "Sin apóstrofo: " + it(e) + ". *Qual è* y *un amico* no llevan: son truncamientos (*qual* y *un* existen también ante consonante: *qual buon vento*, *un libro*)." };

    // 4. Doppie
    if (degeminate(gs) === degeminate(es)) {
      var more = e.length > g.length, moved = e.length === g.length;
      return { cat: "doppie", slip: false,
        hint: moved ? "La consonante doble de la palabra marcada no está donde va."
            : more ? "A la palabra marcada le falta una consonante doble."
                   : "La palabra marcada tiene una doble de más.",
        explain: (moved ? "La doble va en otro lugar: " : more ? "Consonante doble: " : "Una sola consonante: ") + it(e) +
          ". En italiano la doble se pronuncia más larga y cambia el significado (nono = noveno, nonno = abuelo)." };
    }

    // 5. Grafia spagnola (ñ, ll, que, j…)
    var spl = spellingMatch(g, e);
    if (spl) return { cat: "ortografia", slip: false,
      hint: "La palabra marcada está escrita «a la española».",
      explain: it(e) + ": " + spl[2] };

    // 6a. Un pronombre donde va un artículo (li arance → le arance)
    var HOURS = /^(una|due|tre|quattro|cinque|sei|sette|otto|nove|dieci|undici|dodici)$/;
    // 6b. Un artículo por otro delante de la hora (la sei → le sei)
    if (ARTICLES[g] && ARTICLES[e] && HOURS.test(ctx.e[ctx.ei + 1] || "") &&
        (e === "le" || (e === "l'" && ctx.e[ctx.ei + 1] === "una"))) return { cat: "articolo", slip: false,
      hint: "Con las horas el artículo va en plural, salvo la una.",
      explain: "Las horas llevan *le*: *le sei*, *le tre e mezza*, *alle otto*. Solo *l'una* va en singular." };
    if (ARTICLES[e] && !ARTICLES[g] && CLITICS.indexOf(g) >= 0) {
      var na = nounAfter(ctx);
      if (na && !ARTICLES[na] && !prepInfo(na) && CLITICS.indexOf(na) < 0 && !verbForms(na).length) return { cat: "articolo", slip: false,
        hint: it(g) + " es un pronombre; acá va un artículo.",
        explain: it(g) + " es un pronombre (li vedo = los veo). El artículo de " + it(na) + " es " + it(e) + ": " +
          it(e + (e.slice(-1) === "'" ? "" : " ") + na) + "." };
    }

    // 6a'. «lo ho letto» → l'ho letto: the pronoun, not the article
    var nxE = ctx.e[ctx.ei + 1] || "";
    if (/^(lo|la)$/.test(g) && e === "l'" && (AVERE.indexOf(nxE) >= 0 || ESSERE.indexOf(nxE) >= 0 || (verbForms(nxE).length && !DATA.nouns[nxE]))) return { cat: "pronome", slip: false,
      hint: "Mirá con qué letra empieza el verbo que sigue al pronombre.",
      explain: "Delante de *ho, ha, hanno, avevo…* (y de otro verbo que empieza con vocal) el pronombre *" + g + "* se apostrofa: " + it("l'" + nxE) +
        " (l'ho letto = lo leí). En español se escribe separado; en italiano, *lo ho* no se usa." };

    // 6. Pronomi (prima degli articoli: lo/la/le/gli sono anche pronomi)
    r = pronounRule(g, e, ctx);
    if (r) return r;

    // 7. Articoli
    if (ARTICLES[g] && ARTICLES[e]) return articleRule(g, e, ctx);
    if (ARTICLES[g] && prepInfo(e)) return { cat: "preposizione", slip: false,
      hint: "Acá hace falta una preposición, no un artículo.",
      explain: "Acá va la preposición " + it(e) + (prepInfo(e).art ? " (con el artículo incorporado)" : "") + "." };
    if (g === "che" && e === "cui") return { cat: "pronome", slip: false,
      hint: "Es un relativo que va después de una preposición.",
      explain: "Después de preposición el relativo es *cui*, no *che*: la ragazza di cui ti parlavo, il motivo per cui sono qui." };

    // 8. «a» personale nascosta in una preposizione articolata (ai bambini → i bambini)
    var pgA = prepInfo(g);
    if (pgA && pgA.base === "a" && pgA.art && ARTICLES[e] && pgA.art === e) return { cat: "a_personale", slip: false,
      hint: "Hay una preposición que en español va pero en italiano no.",
      explain: "El objeto directo de persona no lleva «a»: accompagno " + it(e) + " bambini, chiamo mia madre, conosco Giulia." };

    // 9. Preposizioni
    var pg = prepInfo(g), pe = prepInfo(e);
    if (pg && pe) return prepRule(g, e, pg, pe, ctx);

    // 10. Comparativi
    var cmpBefore = ctx.e.slice(0, ctx.ei).some(function (w) { return /^(più|meno)$/.test(w); });
    // «ha detto di essere» for «ha detto che era»: two valid ways of saying it
    if (g === "di" && e === "che" && ctx.g && SAYISH.test(ctx.g[ctx.gi - 1] || "") && isInfinitive(/r$/.test(ctx.g[ctx.gi + 1] || "") ? ctx.g[ctx.gi + 1] + "e" : ctx.g[ctx.gi + 1] || "")) {
      return { ok: true, note: "*di* + infinitivo también vale cuando el sujeto es el mismo (ha detto di essere stanca = dijo que estaba cansada)." };
    }
    if (((g === "che" && e === "di") || (g === "di" && e === "che")) && !cmpBefore && !/^(più|meno|meglio|peggio|prima)$/.test(ctx.e[ctx.ei - 1] || "") &&
        !ctx.e.some(function (w) { return /^(più|meno|meglio|peggio|maggiore|minore)$/.test(w); })) {
      return { cat: "parola_mancante", slip: false,
        hint: e === "che" ? "¿Qué palabra une las dos partes de la frase?" : "¿Qué preposición va acá?",
        explain: e === "che" ? "Acá va *che*, el «que» que une las dos partes de la frase (dice che viene, il libro che leggo)." + (ctx.g && SAYISH.test(ctx.g[ctx.gi - 1] || "") ? " Con *di* haría falta el infinitivo." : "")
                             : "Acá va *di*: " + BASE_USE.di + "." };
    }
    if ((g === "che" && e === "di") || (g === "di" && e === "che") || (g === "come" && e === "quanto") ||
        (g === "come" && (e === "di" || e === "che") && cmpBefore)) {
      return { cat: "comparativo", slip: false,
        hint: "Es una comparación: ¿*di* o *che*?",
        explain: (g === "come" && e !== "quanto" ? "«Más … que» no se dice con *come*: en italiano va *di* o *che*. " : "") +
          (e === "di"
          ? "Más/menos … que + sustantivo o pronombre → *di*: più alto di Marco, meno caro di prima."
          : e === "che" ? "Si se comparan dos adjetivos, dos verbos, dos cantidades (più mucche che abitanti) o dos complementos con preposición → *che*: più bello che utile, meglio tardi che mai."
          : "Tan … como → *(così) … come* o *(tanto) … quanto*.") };
    }

    // 11. Ausiliare
    if ((AVERE.indexOf(g) >= 0 && ESSERE.indexOf(e) >= 0) ||
        (ESSERE.indexOf(g) >= 0 && AVERE.indexOf(e) >= 0)) {
      var next = ctx.e[ctx.ei + 1];
      var lemma = next && participleOf(next);
      if (lemma || ctx.e.some(function (w) { return participleOf(w); })) {
        return auxRule(g, e, lemma || findParticipleLemma(ctx.e), ctx);
      }
    }

    // 12. bello / quello: cambiano come l'articolo
    if (BELLO[g] && BELLO[e] && BELLO[g] === BELLO[e] && (BELLO_TRUNC[g] || BELLO_TRUNC[e] ||
        ((/^(quello|bello)$/.test(e) || /^(quello|bello)$/.test(g)) && /^(s[^aeiou]|z|gn|ps)/.test(ctx.e[ctx.ei + 1] || "") &&
         (DATA.nouns[ctx.e[ctx.ei + 1]] || DATA.nounsByPlural[ctx.e[ctx.ei + 1]])))) return { cat: "accordo", slip: false,
      hint: "*" + BELLO[e] + "* delante del sustantivo cambia como el artículo.",
      explain: "*" + BELLO[e] + "* antes del sustantivo toma la forma del artículo: " +
        (BELLO[e] === "quello" ? "quel ragazzo (il), quello studente (lo), quell'amico (l'), quei libri (i), quegli amici (gli)."
                               : "bel ragazzo (il), bello zaino (lo), bell'uomo (l'), bei libri (i), begli occhi (gli).") +
        " Acá: " + it(e) + "." };

    // 12b. Un infinitivo reflexivo con el pronombre de otra persona
    //      (prepararsi → prepararci): el pronombre, no un tipeo.
    var rfG = /^(.+r)(mi|ti|si|ci|vi)$/.exec(g), rfE = /^(.+r)(mi|ti|si|ci|vi)$/.exec(e);
    if (rfG && rfE && rfG[1] === rfE[1] && g !== e) return { cat: "pronome", slip: false,
      hint: "El pronombre pegado al infinitivo tiene que ser el de la persona de la frase.",
      explain: "Con un verbo reflexivo el pronombre concuerda con el sujeto también en infinitivo: " + it(e) +
        " (devo prepararmi, dobbiamo prepararci, dovete prepararvi)." };

    // 12c. L'infinito al posto della forma coniugata (avere → abbiamo,
    // ritornare → ritornate): tipico di chi comincia, non è un refuso né
    // un falso amico.  L'infinito può venire dalla consegna «(ritornare)».
    // The gerund where the infinitive was written (Essere malato → Essendo).
    if (/(are|ere|ire|rre)$/.test(g) && /(ando|endo)$/.test(e) && isInfinitive(g) &&
        verbForms(e).length === 0 && g.slice(0, 2) === e.slice(0, 2)) return { cat: "tempo_verbale", slip: false,
      hint: "Acá no va el infinitivo: ¿qué forma dice «siendo, haciendo»?",
      explain: "Acá va el gerundio, " + it(e) + ": dice la causa o el modo, como en español «" +
        (g === "essere" ? "estando enfermo, no vino" : "haciendo, siendo") + "». El infinitivo (" + it(g) + ") no se usa así." };
    // alzarsi → mi alzo: the reflexive infinitive, unconjugated.
    var rflx = /^(.+[aei]r)(si|mi|ti|ci|vi)$/.exec(g);
    if (rflx && !/(si|mi|ti|ci|vi)$/.test(e) && verbForms(e).some(function (x) {
          return x.lemma === rflx[1] + "si" || x.lemma === rflx[1] + "e"; })) return { cat: "persona_verbale", slip: false,
      hint: "Escribiste el infinitivo: hay que conjugarlo para la persona de la frase.",
      explain: it(g) + " es el infinitivo; conjugado queda " + it(e) + ", con el pronombre delante y separado (mi alzo, ti alzi, si alza), como en español «me levanto»." };
    var stemInf = /\(([a-zà-ù]+)\)/i.exec(ctx.stem || "");
    var prevGw = ctx.g && ctx.gi > 0 ? ctx.g[ctx.gi - 1] : "";
    if (prevGw === "di" && ctx.e[ctx.ei - 1] === "che" && isInfinitive(g) && verbForms(e).some(function (x) { return x.lemma === g; })) {
      return { ok: true, note: "" };
    }
    var infG = g !== e && !isInfinitive(e) && /(are|ere|ire|rre)$/.test(g) && !/^(di|a|da|per|senza)$/.test(prevGw) &&
      (isInfinitive(g) || (stemInf && stemInf[1].toLowerCase() === g));
    if (infG && (verbForms(e).some(function (x) { return x.lemma === g; }) ||
        (g.length - 3 >= 3 && e.slice(0, g.length - 3) === g.slice(0, -3) && !DATA.nouns[e] &&
         !DATA.nounsByPlural[e] && !DATA.adj[e] && !participleOf(e)))) {
      return { cat: "persona_verbale", slip: false,
        hint: "Escribiste el infinitivo: hay que conjugarlo para la persona de la frase.",
        explain: it(g) + " es el infinitivo; conjugado para esta persona queda " + it(e) + "." };
    }

    // 12d. Dos palabras italianas que se confunden (volta / tempo, largo / lungo)
    var lc = lexConfusion(g, e);
    if (lc) return { cat: "lessico", slip: false,
      hint: it(g) + " existe, pero acá va otra palabra parecida en el uso.",
      explain: lc + " Acá: " + it(e) + "." };

    // 13. Falsi amici
    var fa = DATA.falsi[g], extraNote = "";
    var sameV = sameVerb(g, e);
    // fui / sono, siete / sei, era / ero: the same verb in another person or
    // tense is conjugation, not a false friend; the note still helps.  And a
    // word one letter away (prima / primo, pasto / pasta, parare / parlare)
    // is only a false friend when the expected word is what the Spanish means.
    var faHit = fa && String(fa[1] || "").split(/\s*[\/,]\s*/).some(function (w) { return w === e || w.split(" ").indexOf(e) >= 0; });
    if (fa && (sameV || (!faHit && editDistance(gs, es) <= 1))) { extraNote = fa[2] || ""; fa = null; }
    if (fa && g !== e) return { cat: "falso_amico", slip: false,
      hint: it(g) + " existe en italiano, pero no significa lo que creés.",
      explain: it(g) + " en italiano significa «" + fa[0] + "». Acá va " + it(e) + "." +
        (fa[2] ? " " + fa[2] : "") };

    // 14. Parola spagnola che il dizionario fa corrispondere proprio a quella
    // attesa (tengo → ho, gusta → piace, quiero → voglio).
    var bigram = ctx.g && ctx.gi > 0 ? DATA.esIt[deaccent(ctx.g[ctx.gi - 1] + " " + g)] : null;
    var fwd = ctx.g && ctx.g[ctx.gi + 1] ? DATA.esIt[deaccent(g + " " + ctx.g[ctx.gi + 1])] : null;
    var direct = isItalian(g) || realWord(g) ? null : DATA.esIt[gs];
    var tr = [bigram, fwd, direct].filter(function (x) {
      return x && x[0].split(/\s*\/\s*/).some(function (w) {
        return w === e || w.split(" ").indexOf(e) >= 0;
      });
    })[0];
    if (tr && sameV) { extraNote = extraNote || tr[1] || ""; tr = null; }
    if (tr && g !== e) return { cat: "parola_spagnola", slip: false,
      hint: it(g) + " suena a español. ¿Cómo se dice en italiano?",
      explain: it(g) + " viene del español; en italiano va " + it(e) + "." + (tr[1] ? " " + tr[1] : "") };

    // 14b. Un ejercicio de plural: la vocal final es el plural, no una
    //      persona del verbo ni un congiuntivo (paio → paia).
    var pre = 0;
    while (pre < g.length && pre < e.length && g[pre] === e[pre]) pre++;
    var earlySlip = pre < Math.min(g.length, e.length) - 2 && editDistance(gs, es) <= 2;
    if (ctx.nominal && !earlySlip && !looksSpanish(g)) {
      var sg = singularFromStem(ctx.stem) || (DATA.nounsByPlural[e] || {}).s;
      if (sg || /[aeio]$/.test(e)) return { cat: "plurale", slip: false,
        hint: "Revisá el plural de la palabra marcada.",
        explain: pluralExplain(sg, e) };
    }

    // 14c. Una palabra funcional del castellano (el, los, que, es, muy…):
    //      español dentro del italiano, no un tipeo.
    var spf = ES_FUNC[gs];
    if (spf && !isItalian(g) && !isItalian(gs)) return { cat: "parola_spagnola", slip: false,
      hint: it(g) + " es español. ¿Cómo se dice en italiano?",
      explain: it(g) + " es español; en italiano: " + it(spf) +
        (spf.split(" / ").indexOf(e) < 0 ? " (acá: " + it(e) + ")" : "") + "." };

    // 14d. A verb form where the noun goes (il pranzavo, del mio lavoriamo).
    var nSl = DATA.nouns[e] || DATA.nounsByPlural[e];
    var vSl = verbForms(g)[0];
    if (nSl && vSl && !DATA.adj[e] && !participleOf(e) && !DATA.nouns[g] && !DATA.nounsByPlural[g] && nounSlot(ctx)) return { cat: "lessico", slip: false,
      hint: "La palabra marcada es un verbo; acá va un sustantivo.",
      explain: it(g) + " es una forma del verbo *" + vSl.lemma + "*" + (DATA.lex[vSl.lemma] ? " («" + String(DATA.lex[vSl.lemma]).split(/[\/,;]/)[0].trim() + "»)" : "") +
        "; acá va el sustantivo " + it(e) + " («" + nSl.es + "»): " + it(articleFor(e, nSl) + e) + "." };

    // 15. Verbi (persona, tempo, irregolari, piacere, verbo sbagliato)
    r = verbRule(g, e, ctx);
    if (r) {
      if (extraNote && r.explain.indexOf(extraNote) < 0) r.explain += " " + extraNote;
      return r;
    }

    // 16. Plurale (parole straniere invariabili, plurali irregolari)
    if (g === e + "s" && /[^aeiouàèéìòù]$/.test(e)) return { cat: "plurale", slip: false,
      hint: "Las palabras extranjeras no cambian en plural.",
      explain: "Las palabras que terminan en consonante (casi siempre extranjeras) son invariables: i " + it(e) + ", i bar, i computer." };
    var inv = DATA.nouns[e];
    if (inv && inv.pl === inv.s && g !== e && !verbForms(g).length &&
        (g === e + "s" || (g.slice(0, -1) === e.slice(0, -1) && /[ie]$/.test(g)) || g === e + "i" || g === e.slice(0, -1) + "i")) {
      return { cat: "plurale", slip: false,
        hint: "Esa palabra no cambia en plural.",
        explain: it(e) + " es invariable: igual en singular y en plural (le foto, i cinema, le città, i bar)." +
          (inv.note ? " " + inv.note : "") };
    }
    var auxBefore = AVERE.concat(ESSERE).indexOf(ctx.e[ctx.ei - 1]) >= 0;
    var nounP = DATA.nounsByPlural[e];
    // Only a plural mistake if it looks like one: the singular left as it is,
    // or a regular plural where the real one is irregular.  A typo in *venti*
    // is not "the plural of vento".
    var looksPlural = nounP && (g === nounP.s || g === regularPlural(nounP.s, nounP.g) ||
      g === nounP.s.replace(/[oae]$/, "i") || g === nounP.s.replace(/[oae]$/, "e"));
    if (nounP && looksPlural && nounP.pl === e && nounP.s !== e && g !== e &&
        !(participleOf(e) && auxBefore)) {
      return { cat: "plurale", slip: false,
        hint: "Revisá el plural de la palabra marcada.",
        explain: pluralExplain(nounP.s, e) + (nounP.note ? " " + nounP.note : "") };
    }

    // 17. Refuso
    var dist = editDistance(gs, es);
    var endingOnly = g.slice(0, -1) === e.slice(0, -1) && /[oaie]$/.test(g) && /[oaie]$/.test(e);
    if (dist === 1 && es.length >= 4 && !endingOnly && !DATA.lex[g] && !verbForms(g).length &&
        !participleOf(g)) {
      if (ctx.choice) return { cat: "ortografia", slip: false,
        hint: "Mirá bien cómo se escribe la palabra.", explain: "Se escribe " + it(e) + "." };
      return { cat: "refuso", slip: true,
        hint: "Hay un error de tipeo en la palabra marcada.",
        explain: "Error de tipeo: " + it(e) + "." };
    }

    // 18. Parola spagnola qualsiasi
    var sp2 = DATA.esIt[gs];
    if (sp2 && !isItalian(g)) return { cat: "parola_spagnola", slip: false,
      hint: it(g) + " es español. ¿Cómo se dice en italiano?",
      explain: it(g) + " es español; en italiano: " + it(sp2[0].split(" / ")[0]) +
        (e !== sp2[0] && sp2[0].split(" / ").indexOf(e) < 0 ? " (acá: " + it(e) + ")" : "") +
        "." + (sp2[1] ? " " + sp2[1] : "") };

    // 18a. Un nombre propio, un título o un lugar dicho en castellano
    //      (Isabel → Elisabetta, Londres → Londra).
    if (ctx.names && ctx.names.indexOf(e) >= 0 && !isItalian(g) && !isItalian(e) && g !== e) return { cat: "lessico", slip: false,
      hint: "Ese nombre también se dice distinto en italiano.",
      explain: "En italiano: " + it(e.charAt(0).toUpperCase() + e.slice(1)) + ". Muchos nombres propios, títulos y lugares se traducen (Isabel → Elisabetta, Juan → Giovanni, Londres → Londra)." };

    // 18b. Una palabra que no está en ningún diccionario pero suena a
    // castellano (entiendo, tienes, señor).
    if (!isItalian(g) && looksSpanish(g) && !realWord(g)) return { cat: "parola_spagnola", slip: false,
      hint: it(g) + " parece español. ¿Cómo se dice en italiano?",
      explain: it(g) + " no es italiano. Acá va " + it(e) + (DATA.lex[e] ? " («" + DATA.lex[e] + "»)" : "") + "." };

    // 18c. Due parole diverse (nonna / nonno, casa / cassa): è lessico, non
    // concordanza, anche se cambia solo una lettera.
    if (DATA.nouns && DATA.nouns[g] && DATA.nouns[e] && g !== e && DATA.lex[g] && DATA.lex[e] &&
        !(participleOf(g) && participleOf(g) === participleOf(e) && ppContext(ctx)) &&
        !(DATA.adj[g] && DATA.adj[g] === DATA.adj[e] && !ARTICLES[ctx.e[ctx.ei - 1]])) {
      // the man and the woman of one word (nonno / nonna, zio / zia): the
      // article or the adjective next to it says which one
      var kg = String(DATA.lex[g]).toLowerCase().split(/\s*[\/,;]\s*/)[0], ke = String(DATA.lex[e]).toLowerCase().split(/\s*[\/,;]\s*/)[0];
      if (g.slice(0, -1) === e.slice(0, -1) && DATA.nouns[g].g !== DATA.nouns[e].g && kg.slice(0, -1) === ke.slice(0, -1) && kg !== ke) {
        var artB = ARTICLES[ctx.e[ctx.ei - 1]] || (POSSESSIVE.indexOf(ctx.e[ctx.ei - 1]) >= 0 ? [/a$|e$/.test(ctx.e[ctx.ei - 1]) ? "f" : "m"] : null);
        return { cat: "accordo", slip: false,
          hint: "¿Es un hombre o una mujer? Mirá las palabras de al lado.",
          explain: it(g) + " es «" + kg + "» y " + it(e) + ", «" + ke + "»: la vocal final cambia la persona, como en español." +
            (artB && artB[0] !== "?" ? " Acá " + it(ctx.e[ctx.ei - 1]) + " ya dice que es " + (artB[0] === "f" ? "femenino" : "masculino") + ": " + it(ctx.e[ctx.ei - 1] + " " + e) + "." : " Acá va " + it(e) + ".") };
      }
      return { cat: "lessico", slip: false,
        hint: it(g) + " es otra palabra. ¿Qué significa?",
        explain: it(g) + " significa «" + DATA.lex[g] + "»; " + it(e) + ", «" + DATA.lex[e] + "»." };
    }

    // 19. Accordo di genere e numero (cambia solo la vocale finale, o son
    //     dos formas del mismo adjetivo: bianchi / bianca)
    if (endingOnly || (DATA.adj[g] && DATA.adj[g] === DATA.adj[e])) {
      var pl = /[ie]$/.test(e) && /[oa]$/.test(g) ? "plural" :
               /[oa]$/.test(e) && /[ie]$/.test(g) ? "singular" : null;
      var itG = isItalian(g);
      var prev1 = ctx.e[ctx.ei - 1] || "", prev2 = ctx.e[ctx.ei - 2] || "", next1 = ctx.e[ctx.ei + 1] || "";
      // An articulated preposition with the wrong vowel (aglo → agli).
      var peE = prepInfo(e);
      if (peE && peE.art && !prepInfo(g) && !itG) return { cat: "preposizione_articolata", slip: false,
        hint: "Revisá la preposición con artículo.",
        explain: it(e) + " = *" + peE.base + " + " + peE.art + "*: el artículo de adentro concuerda con " +
          (next1 && /^[a-zà-ù]/.test(next1) ? it(next1) : "el sustantivo") + ", como cualquier artículo." };
      // Participles.  Before the passato prossimo (week 11) «è chiuso» is an
      // adjective, and the agreement below says so without the jargon.
      if (participleOf(e) && !(ctx.week != null && ctx.week < 11)) {
        var essAux = ESSERE.indexOf(prev1) >= 0 || /^(essere|esser|essendo|stato|stata|stati|state)$/.test(prev1);
        var venAux = verbForms(prev1).some(function (x) { return x.lemma === "venire"; });
        var avAux = AVERE.indexOf(prev1) >= 0 || /^(avere|aver|avendo)$/.test(prev1);
        var cliBefore = avAux && ["lo", "la", "li", "le", "l'", "ne"].indexOf(prev2) >= 0;
        // «averlo visto», «avendola vista»: the pronoun glued to the auxiliary
        var glued = /^(aver|avendo)(lo|la|li|le|ne)$/.exec(prev1);
        if (glued) return { cat: "participio_accordo", slip: false,
          hint: "Mirá el pronombre pegado al auxiliar: el participio concuerda con él.",
          explain: "El pronombre *" + glued[2] + "* va antes del participio (pegado a *" + glued[1] + "*), así que el participio concuerda con él: " +
            it(prev1 + " " + e) + " (averla vista, averli visti)." };
        if (essAux || venAux) {
          return { cat: "participio_accordo", slip: false,
            hint: "Con *" + (venAux ? "venire" : "essere") + "*, el participio concuerda con el sujeto. Revisá la terminación.",
            explain: "Con *" + (venAux ? "venire" : "essere") + "* el participio concuerda en género y número con el sujeto, como un adjetivo: " +
              it(e) + " (Maria è andat*a*, i ragazzi sono andat*i*). En español «ha ido» no cambia; en italiano sí." };
        }
        if (cliBefore) {
          return { cat: "participio_accordo", slip: false,
            hint: "Mirá el pronombre que está antes del verbo: el participio concuerda con él.",
            explain: "Con *lo, la, li, le* (y *ne*) antes del auxiliar *avere*, el participio concuerda con el pronombre: le ho viste, l'ho scritta, ne ho mangiati due. Acá: " + it(prev2 + (prev2.slice(-1) === "'" ? "" : " ") + prev1 + " " + e) + "." };
        }
        if (avAux && /o$/.test(e)) {
          return { cat: "participio_accordo", slip: false,
            hint: "Con *avere*, ¿el participio cambia la terminación?",
            explain: "Con *avere* el participio queda en -o: no concuerda con el sujeto ni con el objeto que viene después: " +
              it(prev1 + " " + e) + " (ho fatto una passeggiata, abbiamo visto le foto), como en español «he hecho». Solo cambia si antes va *lo, la, li, le* (l'ho vista)." };
        }
      }
      // An article with a wrong vowel (gle → gli, e → i): the article of the
      // noun, not "agreement".  The hint names the noun only if the learner
      // wrote the same one.
      if (ARTICLES[e] && !ARTICLES[g]) {
        var an = nounAfter(ctx);
        var anOk = an && /^[a-zà-ù']/.test(an) && !ARTICLES[an] && !prepInfo(an) && !verbForms(an).length;
        var same = anOk && ctx.g && ctx.g[ctx.gi + 1] === an;
        return { cat: "articolo", slip: false,
          hint: same ? "Revisá el artículo antes de " + it(an) + "." : "Revisá el artículo.",
          explain: (itG ? it(g) + " es otra palabra" + (DATA.lex[g] ? " («" + DATA.lex[g] + "»)" : "") + ". "
                        : realWord(g) ? it(g) + " es otra palabra. " : it(g) + " no es una palabra italiana. ") +
            (anOk ? "El artículo de " + it(an) + " es " + it(e) + ": " + it(e + (e.slice(-1) === "'" ? "" : " ") + an) + "."
                  : "Acá va " + it(e) + ".") };
      }
      // A noun where the noun goes: «il conta», «il temo», «ho voglio» (a
      // verb form) or «il giardina», «la riuniona» (no word at all).
      var nE0 = DATA.nouns[e] || DATA.nounsByPlural[e];
      if (nE0 && !DATA.adj[e] && !participleOf(e) && (nounSlot(ctx) || !itG) && (nounSlot(ctx) || !verbForms(e).length)) {
        var artE = articleFor(e, nE0);
        var vG = verbForms(g)[0];
        if (itG && vG && !DATA.nouns[g] && !DATA.nounsByPlural[g]) return { cat: "lessico", slip: false,
          hint: "La palabra marcada es un verbo; acá va un sustantivo.",
          explain: it(g) + " es una forma del verbo *" + vG.lemma + "*" + (DATA.lex[vG.lemma] ? " («" + String(DATA.lex[vG.lemma]).split(/[\/,;]/)[0].trim() + "»)" : "") +
            "; acá va el sustantivo " + it(e) + " («" + nE0.es + "»): " + it(artE + e) + "." };
        if (!itG) {
          var isPl = DATA.nounsByPlural[e] && nE0.pl === e && nE0.s !== e;
          if (isPl) return { cat: "plurale", slip: false,
            hint: "Revisá el plural de la palabra marcada.",
            explain: (realWord(g) ? "Acá va el plural de " + it(nE0.s) + ". " : it(g) + " no existe. ") + pluralExplain(nE0.s, e) };
          if (/[ie]$/.test(g) && /[oa]$/.test(e)) return { cat: "plurale", slip: false,
            hint: "¿Singular o plural?",
            explain: "Acá va el singular: " + it(artE + e) + " («" + nE0.es + "»). El plural sería " + it(nE0.pl) + "." };
          var gen0 = nE0.g === "m" ? "masculino" : "femenino";
          var gNote = nE0.note && /masculin|femenin|género/i.test(nE0.note) ? " " + nE0.note : "";
          if (/ione$/.test(e)) return { cat: "genere", slip: false,
            hint: "Revisá la terminación: ¿cómo terminan en italiano las palabras como esta?",
            explain: "Los sustantivos en -ione son femeninos y terminan en -e: " + it(artE + e) + ", la stazione, la lezione (en español, «-ión»)." };
          if (/e$/.test(e)) return { cat: "genere", slip: false,
            hint: "Revisá la terminación de la palabra marcada.",
            explain: it(e) + " termina en -e (" + it(artE + e) + ", «" + nE0.es + "»): los sustantivos en -e no cambian la vocal según el género (la gente, il fiume, la notte)." + gNote };
          return { cat: "genere", slip: false,
            hint: "Revisá la terminación de la palabra marcada: ¿es masculino o femenino?",
            explain: it(e) + " es " + gen0 + ": " + it(artE + e) + " («" + nE0.es + "»). La -o o la -a final de un sustantivo es parte de la palabra: no cambia con lo que se diga." + gNote };
        }
      }
      // A verb form with a wrong ending (mangie → mangia): the conjugation.
      var vfe = verbForms(e);
      if (!itG && vfe.length && !participleOf(e) && !(realWord(g) && (DATA.nouns[e] || DATA.nounsByPlural[e]))) {
        var vf = vfe[0];
        return { cat: "persona_verbale", slip: false,
          hint: "Revisá la terminación del verbo.",
          explain: it(g) + " no existe; la forma es " + it(e) + " (" + it(vf.lemma) + ", " + PERS_ES[vf.p] + ", " + TENSE_ES[vf.tense] + ")." };
      }
      // The plural where the singular goes (reazioni → reazione).
      var npG = DATA.nounsByPlural[g];
      if (npG && npG.s === e) {
        var pv = ctx.e[ctx.ei - 1] || "";
        var sgWhy = /^(qualche|ogni)$/.test(pv)
          ? "*" + pv + "* va siempre con singular: " + it(pv + " " + e) + ", aunque en español " + (pv === "ogni" ? "se diga «todos los…» (ogni giorno = todos los días)" : "vaya en plural (qualche giorno = algunos días)") + "."
          : ARTICLES[pv] && ARTICLES[pv][1] === "s" ? "El artículo " + it(pv) + " es singular, así que el sustantivo también: " + it(pv + (pv.slice(-1) === "'" ? "" : " ") + e) + "."
          : /^(un|uno|una|un')$/.test(pv) ? "Con " + it(pv) + " se habla de uno solo: " + it(pv + (pv.slice(-1) === "'" ? "" : " ") + e) + "."
          : "Acá se habla de uno solo.";
        return { cat: "plurale", slip: false,
          hint: /^(qualche|ogni)$/.test(pv) ? "Mirá la palabra que va antes: ¿pide singular o plural?" : "Acá va el singular.",
          explain: it(g) + " es el plural; acá va el singular " + it(e) + ". " + sgWhy };
      }
      // Languages are masculine (parlo italiano, lo spagnolo).
      if (/^(italiano|spagnolo|inglese|francese|tedesco|portoghese|russo|cinese|giapponese|arabo)$/.test(e) &&
          /[ae]$/.test(g) && !ARTICLES[prev1] && !DATA.nouns[prev1] && !DATA.nounsByPlural[prev1]) return { cat: "accordo", slip: false,
        hint: "¿La palabra marcada es un idioma o describe a alguien?",
        explain: "Los idiomas son masculinos: " + it(e) + " (parlo italiano, studio lo spagnolo), como en español «el español»." };
      var ag = agreeHead(ctx);
      var head = ag ? ag.head : null, desc = ag ? ag.desc : "";
      var gn = head && (DATA.nouns[head] || DATA.nounsByPlural[head]);
      // A word that exists in no form (casu, stanchu) is spelling, not agreement.
      if (!itG && !head && !/[oaie]$/.test(g)) return { cat: "ortografia", slip: false,
        hint: "La palabra marcada no existe así.",
        explain: "Se escribe " + it(e) + "." };
      return { cat: "accordo", slip: false,
        hint: head ? "Revisá la concordancia de la palabra marcada: ¿con qué palabra concuerda?"
                   : "Revisá la terminación de la palabra marcada: la vocal final marca género y número.",
        explain: (head ? "Concordancia: " + it(e) + ", porque concuerda con " + it(head) + (desc ? " (" + desc + ")" : "") +
                         ". Artículos, posesivos, adjetivos" + (ctx.week != null && ctx.week < 11 ? "" : " y participios") + " toman el género y el número del sustantivo, como en español (la casa blanca, las casas blancas); pero el plural no suma -s: cambia la vocal (le case bianche)."
                       : "La forma es " + it(e) + (pl ? ", en " + pl : "") + ": la vocal final marca el género y el número (-o / -a en singular, -i / -e en plural). Es como «alto, alta, altos, altas», pero sin la -s del plural: alti, alte.") +
          (gn && gn.note && /masculin|femenin|género/i.test(gn.note) ? " " + gn.note : "") };
    }

    // 19b. The participle of another verb (hanno avuto → hanno preso).
    var plG = participleOf(g), plE = participleOf(e);
    if (plG && plE && plG !== plE) return { cat: "lessico", slip: false,
      hint: "Ese verbo no es el que va.",
      explain: it(g) + " es el participio de *" + plG + "*" + (DATA.lex[plG] ? " («" + DATA.lex[plG] + "»)" : "") +
        "; acá va " + it(e) + ", de *" + plE + "*" + (DATA.lex[plE] ? " («" + DATA.lex[plE] + "»)" : "") + "." };

    // 20. Lessico: parola italiana vera ma sbagliata
    var lx = DATA.lex[g];
    var functionWord = ARTICLES[g] || prepInfo(g) || CLITICS.indexOf(g) >= 0 || SUBJECTS.indexOf(g) >= 0;
    if (lx && g !== e && !functionWord) return { cat: "lessico", slip: false,
      hint: it(g) + " es una palabra italiana, pero no es la que va acá.",
      explain: it(g) + " significa «" + lx + "». Acá va " + it(e) +
        (DATA.lex[e] ? " («" + DATA.lex[e] + "»)" : "") + "." };

    // 21. Refuso più largo
    if (dist <= (es.length > 7 ? 2 : 1)) return ctx.choice ? { cat: "ortografia", slip: false,
      hint: "Mirá bien cómo se escribe la palabra.", explain: "Se escribe " + it(e) + "." } : { cat: "refuso", slip: true,
      hint: "Hay un error de tipeo en la palabra marcada.",
      explain: "Error de tipeo: " + it(e) + "." };

    // An option of a multiple choice is a word someone wrote on purpose:
    // no «that word does not exist», just which one goes.
    if (ctx.choice) return { cat: "lessico", slip: false,
      hint: "La palabra marcada no es la que va.",
      explain: "Acá va " + it(e) + (DATA.lex[e] ? " («" + DATA.lex[e] + "»)" : "") + ", no " + it(g) + (DATA.lex[g] ? " («" + DATA.lex[g] + "»)" : "") + "." };
    if (!isItalian(g)) return { cat: "lessico", slip: false,
      hint: realWord(g) ? "La palabra marcada existe, pero no es la que va acá." : "La palabra marcada no existe en italiano. ¿Cómo se dice?",
      explain: notAWord(g, e) };
    return { cat: "lessico", slip: false,
      hint: "La palabra marcada no es la que va.",
      explain: "Acá va " + it(e) + (DATA.lex[e] ? " («" + DATA.lex[e] + "»)" : "") + "." };
  }

  // Two forms of the same verb (fui / sono, siete / sei, fatto / fatta).
  function sameVerb(g, e) {
    var fe = verbForms(e);
    if (verbForms(g).some(function (a) { return fe.some(function (b) { return a.lemma === b.lemma; }); })) return true;
    return !!(participleOf(g) && participleOf(g) === participleOf(e));
  }
  // The word is where a participle goes: after an auxiliary (ho fatto, è
  // stata, essere venuto), or after a clitic and an auxiliary.
  function ppContext(ctx) {
    var p1 = ctx.e[ctx.ei - 1] || "", p2 = ctx.e[ctx.ei - 2] || "";
    var aux = function (w) { return AVERE.indexOf(w) >= 0 || ESSERE.indexOf(w) >= 0 || /^(avere|aver|essere|esser|avendo|essendo|stato|stata|stati|state)$/.test(w) ||
      /^(aver|avendo|esser|essendo)(lo|la|li|le|ne|mi|ti|ci|vi|si|gli)$/.test(w); };
    return aux(p1) || (aux(p2) && /^(già|mai|ancora|appena|sempre|più|anche|proprio|davvero|finalmente|bene|molto|tanto)$/.test(p1));
  }

  var BELLO = dict();
  // The forms that only exist in front of a noun (bel ragazzo, quegli amici).
  var BELLO_TRUNC = dict({ bel: 1, "bell'": 1, bei: 1, begli: 1, quel: 1, "quell'": 1, quei: 1, quegli: 1 });
  ["bel", "bello", "bell'", "bella", "bei", "begli", "belle"].forEach(function (w) { BELLO[w] = "bello"; });
  ["quel", "quello", "quell'", "quella", "quei", "quegli", "quelle"].forEach(function (w) { BELLO[w] = "quello"; });

  var TONIC = ["me", "te", "lui", "lei", "noi", "voi", "loro", "sé", "io", "tu"];
  var ATONE = ["mi", "ti", "ci", "vi", "si", "lo", "la", "li", "le", "gli", "ne"];
  var COMBINED = ["me", "te", "ce", "ve", "se", "glielo", "gliela", "glieli", "gliele", "gliene"];
  var PREPS_ALL = ["a", "di", "da", "in", "con", "su", "per", "tra", "fra", "senza", "dopo", "prima", "secondo", "come", "tranne", "verso", "sopra", "sotto", "dietro"];

  var IND_VERBS = /^(telefonare|rispondere|chiedere|domandare|dire|scrivere|parlare|dare|regalare|mandare|spiegare|insegnare|raccontare|offrire|prestare|mostrare|portare|consigliare)$/;
  // What each pronoun means, in the learner's Spanish.
  var CLI_MEAN = dict({
    lo: "«lo» (objeto directo masculino)", la: "«la» (objeto directo femenino)", li: "«los» (objeto directo masculino plural)",
    le: "«las» (objeto directo femenino plural) o «le» (a ella)", gli: "«le» (a él) o «les» (a ellos)",
    ne: "«de eso, de ellos» o una cantidad (ne voglio due)", ci: "«nos», o «ahí, en eso» (ci vado)", vi: "«los, les» (a ustedes)",
    mi: "«me»", ti: "«te»", si: "«se»", me: "«mí» (después de preposición) o «me» delante de lo, la, ne",
    te: "«vos, ti» (después de preposición) o «te» delante de lo, la, ne", lui: "«él»", lei: "«ella» (o «usted»)",
    noi: "«nosotros»", voi: "«ustedes»", loro: "«ellos, ellas»", "sé": "«sí mismo»", io: "«yo»", tu: "«vos»"
  });

  // Can this article go in front of this noun (gender, number, first sound)?
  function artCanGo(art, noun) {
    var a = ARTICLES[art], n = DATA.nouns[noun] || DATA.nounsByPlural[noun];
    if (!a || !n) return true;
    var inv = n.s === n.pl, pl = !inv && n.pl === noun;
    if (a[0] !== "?" && n.g && a[0] !== n.g) return false;
    if (!inv && (a[1] === "p") !== pl) return false;
    if (/^[aeiouàèéìòù]/.test(noun) && /^(lo|la|il)$/.test(art)) return false;
    return true;
  }

  function pronounRule(g, e, ctx) {
    var prev = ctx.e[ctx.ei - 1] || "", next = ctx.e[ctx.ei + 1] || "";
    if (ctx.g && ctx.g[ctx.gi - 1] === "a" && TONIC_CL[g] && (TONIC_CL[g] === e || (g === "loro" && e === "gli"))) {
      var vA = verbFrom(ctx.g, ctx.gi + 1);
      if (vA && vA.f.some(function (x) { return IND_LIKE.test(x.lemma); })) return { ok: true,
        note: it("a " + g) + " también vale: *a* + pronombre pone el acento en la persona. Lo más común es " + it(e) + ", como el español «le gusta»." };
    }
    var isP = function (w) { return TONIC.indexOf(w) >= 0 || ATONE.indexOf(w) >= 0 || COMBINED.indexOf(w) >= 0; };
    if (!isP(g) || !isP(e)) return null;
    // Articles vs pronouns: only a pronoun if a verb follows or no noun does
    if (ARTICLES[g] && ARTICLES[e]) {
      // «lo aiuti», «la aspetto», «le invito»: a word that is a noun and a
      // verb, and the expected form cannot be its article → a pronoun.
      if ((DATA.nouns[next] || DATA.nounsByPlural[next]) &&
          !(verbForms(next).length && !artCanGo(e, next))) return null;
      if (/^[a-zà-ù']/.test(next) && !verbForms(next).length &&
          !AVERE.concat(ESSERE).some(function (x) { return x === next; })) return null;
      if (!/^[a-zà-ù']/.test(next) && /art[íi]culo|articolo/i.test(ctx.prompt || "") &&
          !/pronombre|pronome/i.test(ctx.prompt || "")) return null;
    }
    // «Me piace», «te chiamo»: the Spanish form of the pronoun.
    var LONG = { me: "mi", te: "ti", se: "si", ce: "ci", ve: "vi" };
    if (LONG[g] === e && ["lo", "la", "li", "le", "ne", "l'"].indexOf(next) < 0 && PREPS_ALL.indexOf(prev) < 0) return { cat: "pronome", slip: false,
      hint: "Esa forma del pronombre va solo delante de *lo, la, li, le, ne*. ¿Cuál va sola junto al verbo?",
      explain: "Junto al verbo va " + it(e) + " (" + it(e + " " + next) + "), aunque en español se diga «" + g + "». *" + g +
        "* solo aparece delante de *lo, la, li, le, ne* (" + g + " lo dice)" + (g === "me" || g === "te" ? " o después de una preposición (per " + g + ")" : "") + "." };
    if (/^glie/.test(e)) return { cat: "pronome", slip: false,
      hint: "Son dos pronombres juntos: ¿cómo se combinan *gli/le* con *lo, la, ne*?",
      explain: "*gli* o *le* + *lo/la/li/le/ne* se funden en una palabra: " + it(e) +
        " (glielo dico = se lo digo). El «se» español no se traduce *se*." };
    if (["me", "te", "ce", "ve", "se"].indexOf(e) >= 0 && ["mi", "ti", "ci", "vi", "si"].indexOf(g) >= 0 &&
        ["lo", "la", "li", "le", "ne"].indexOf(next) >= 0) return { cat: "pronome", slip: false,
      hint: "Delante de *lo, la, li, le, ne* el primer pronombre cambia de vocal.",
      explain: "*mi, ti, ci, vi, si* se vuelven *me, te, ce, ve, se* delante de *lo, la, li, le, ne*: " +
        it(e + " " + next) + " (te lo spiego, me ne vado)." };
    if (e === "sé" && TONIC.indexOf(g) >= 0) return { cat: "pronome", slip: false,
      hint: "¿El pronombre vuelve al sujeto de la frase o es otra persona?",
      explain: "*sé* es «sí mismo, sí misma»: vuelve al sujeto de la frase (pensa solo a sé = piensa solo en sí misma). " +
        it(g) + " sería otra persona." };
    if (TONIC.indexOf(e) >= 0 && PREPS_ALL.indexOf(prev) >= 0 && TONIC.indexOf(g) < 0) return { cat: "pronome", slip: false,
      hint: "Después de una preposición va otra forma del pronombre.",
      explain: "Después de una preposición va la forma larga del pronombre: " + it(prev + " " + e) +
        " (per me, con te, senza di lui), como en español «para mí, con vos». *Mi, ti* van solo junto al verbo (mi vede = me ve)." };
    if ((g === "le" && e === "gli") || (g === "gli" && e === "le")) return { cat: "pronome", slip: false,
      hint: "¿El pronombre se refiere a un hombre o a una mujer?",
      explain: "Objeto indirecto: *gli* = a él (y, en el uso corriente, también a ellos); *le* = a ella. Acá: " + it(e) + "." };
    if (ATONE.indexOf(e) >= 0 && ATONE.indexOf(g) >= 0) {
      // With piacere & co. the person is an indirect object (gli piace).
      var vNext = verbForms(next).concat(verbForms(ctx.e[ctx.ei + 2] || "")).map(function (x) { return x.lemma; })
        .concat([participleOf(next), participleOf(ctx.e[ctx.ei + 2] || "")]);
      var likes = vNext.some(function (l) { return /^(piacere|mancare|servire|bastare|interessare|dispiacere|sembrare)$/.test(l || ""); });
      var indE = /^(gli|mi|ti|ci|vi)$/.test(e) || (e === "le" && likes);
      return { cat: "pronome", slip: false,
        hint: likes ? "Con este verbo, ¿la persona es objeto directo o indirecto?"
                    : "Revisá el pronombre: ¿directo o indirecto, masculino o femenino, singular o plural?",
        explain: it(g) + " es " + CLI_MEAN[g] + "; acá va " + it(e) + ", " + CLI_MEAN[e] + "." +
          (likes && indE ? " Con *piacere, mancare, servire* la persona va en indirecto, como en español «le gusta»: gli piace, le mancano."
           : /^(lo|la|li|le)$/.test(g) && /^(gli|le)$/.test(e) && !likes && vNext.some(function (l) { return IND_VERBS.test(l || ""); })
             ? " Verbos como *telefonare, rispondere, chiedere, dire* llevan indirecto: gli telefono (le telefoneo)."
           : /^(gli)$/.test(g) && /^(lo|la|li|le)$/.test(e) ? " Acá la persona o cosa es objeto directo, sin «a»: lo aspetto, la conosco (en español a veces se dice «le»)."
           : "") };
    }
    return { cat: "pronome", slip: false,
      hint: "Revisá el pronombre marcado: ¿de qué persona es?",
      explain: (CLI_MEAN[g] ? it(g) + " es " + CLI_MEAN[g] + "; a" : "A") + "cá va " + it(e) + (CLI_MEAN[e] ? ", " + CLI_MEAN[e] : "") + "." };
  }

  /* Two Italian words a Spanish speaker mixes up (not false friends: both
     exist and both are «right» somewhere).  Each entry: the forms of each
     word, separated by «|», and the difference in one line.  It only fires
     when the learner wrote one word and the other was expected. */
  var LEX_CONFUSIONS = [
    ["volta volte|tempo tempi|ora ore", "«Vez» es *volta* (la prima volta, tre volte); *tempo* es el tiempo (que pasa o que hace); *ora*, la hora."],
    ["lungo lunga lunghi lunghe|largo larga larghi larghe", "*largo* en italiano es ancho; «largo» es *lungo*."],
    ["ancora|già|sempre", "«Todavía» es *ancora* (y también «otra vez»); «ya» es *già*; *sempre* es siempre."],
    ["presto|subito|prima|pronto pronta pronti pronte", "*presto* = temprano o pronto (dentro de poco); *subito* = enseguida; *prima* = antes; *pronto* = listo (y «hola» al teléfono)."],
    ["buono buona buoni buone buon|bravo brava bravi brave|bene", "*buono* = bueno (de sabor o de carácter); *bravo* = hábil, bueno en lo que hace; *bene* = bien, el adverbio."],
    ["molto molta molti molte|troppo troppa troppi troppe", "*molto* = mucho, muy; *troppo* = demasiado."],
    ["colazione|pranzo|cena", "*colazione* = desayuno; *pranzo* = almuerzo; *cena* = cena."],
    ["negozio negozi|affare affari", "*negozio* = tienda; un «negocio» (un trato) es *affare*."],
    ["moglie mogli|sposa spose|donna donne", "*moglie* = esposa; *sposa* = la novia el día de la boda; *donna* = mujer."],
    ["marito mariti|sposo sposi|uomo uomini", "*marito* = esposo; *sposo* = el novio el día de la boda; *uomo* = hombre."],
    ["sera sere|notte notti|pomeriggio pomeriggi", "*pomeriggio* = la tarde (después de comer); *sera* = desde que oscurece hasta la hora de dormir; *notte* = la noche de dormir."],
    ["tardi|pomeriggio", "*tardi* = tarde (la hora: è tardi); «la tarde» es *il pomeriggio*."],
    ["mattina mattino|domani", "«Mañana» es *mattina* (la parte del día) o *domani* (el día siguiente)."],
    ["fa|da", "*fa* = hace, para lo terminado (due anni fa); *da* = desde hace, para lo que sigue (studio da due anni)."],
    ["chi|che cosa|quale quali qual", "*chi* = quién; *che* o *cosa* = qué; *quale* = cuál."],
    ["anche pure|neanche nemmeno neppure", "*anche* = también; «tampoco» (y «ni siquiera») es *neanche* o *nemmeno*."],
    ["niente nulla|nessuno nessuna nessun", "*niente* = nada; *nessuno* = nadie, ninguno."],
    ["qualcosa|qualcuno qualcuna|qualche", "*qualcosa* = algo; *qualcuno* = alguien; *qualche* = algún, algunos (siempre con singular: qualche giorno)."],
    ["ogni|tutti tutte tutto tutta", "*ogni* = cada, va con singular (ogni giorno); *tutti* va con plural y artículo (tutti i giorni)."],
    ["vecchio vecchia vecchi vecchie|anziano anziana anziani anziane", "*anziano* = mayor, para personas y con respeto; *vecchio* = viejo."],
    ["fino|fine", "*fino a* = hasta; *la fine* = el final."],
    ["tra fra|entro", "*tra* (o *fra*) = dentro de, en el futuro (tra due giorni); *entro* = antes de un plazo (entro venerdì)."],
    ["esperienza esperienze|esperimento esperimenti", "*esperienza* = experiencia; *esperimento* = experimento."],
    ["gente|persone persona", "*la gente* es singular (la gente è gentile); *le persone* es plural."],
    ["bambino bambina bambini bambine|ragazzo ragazza ragazzi ragazze|figlio figlia figli figlie", "*bambino* = niño; *ragazzo* = chico, joven (y novio); *figlio* = hijo."],
    ["nipote nipoti|cugino cugina cugini cugine", "*nipote* = nieto o sobrino; *cugino* = primo."],
    ["genitori|parenti", "*genitori* = padres (madre y padre); *parenti* = parientes."],
    ["mezzo mezza mezzi mezze mezz'|metà", "*mezzo* = medio (mezz'ora, mezzo litro); *metà* = la mitad (la metà della torta)."],
    ["giorno giorni|giornata giornate", "*giorno* = el día como fecha o unidad; *giornata* = el día vivido, con lo que pasó (una bella giornata)."],
    ["sera|serata", "*sera* = la noche como momento; *serata* = la velada, lo que se hizo esa noche."],
    ["ora adesso|allora", "«Ahora» es *ora* o *adesso*; *allora* = entonces."],
    ["conto conti|racconto racconti", "*conto* = la cuenta (del restaurante, del banco); «cuento» es *racconto*."],
    ["caro cara cari care|faccia facce viso", "*caro* = querido, o caro de precio; «la cara» es *la faccia* (o *il viso*)."],
    ["ufficio uffici|lavoro lavori", "*ufficio* = oficina; *lavoro* = trabajo."],
    ["compleanno compleanni|anniversario anniversari", "*compleanno* = cumpleaños; *anniversario* = aniversario (de un casamiento, de un hecho)."],
    ["piano piani|pavimento pavimenti", "*piano* = piso de un edificio (y despacio); el piso que se pisa es *pavimento*."],
    ["perché|perciò", "*perché* = porque, por qué; *perciò* = por eso."],
    ["ma|però", "«Pero» se dice *ma* o *però*; para «sino» (no esto sino aquello), solo *ma*: non è rosso ma blu."],
    ["cosa cose|causa cause", "*cosa* = cosa, qué; *causa* = causa."],
    ["salute|saluto saluti", "*salute* = salud; *saluto* = saludo."],
  ];
  var LEX_CONF = dict();
  LEX_CONFUSIONS.forEach(function (c, ci) {
    c[0].split("|").forEach(function (lemma, li) {
      lemma.split(" ").forEach(function (f) { (LEX_CONF[f] = LEX_CONF[f] || []).push([ci, li]); });
    });
  });
  function lexConfusion(g, e) {
    var a = LEX_CONF[g] || [], b = LEX_CONF[e] || [];
    for (var i = 0; i < a.length; i++) for (var j = 0; j < b.length; j++) {
      if (a[i][0] === b[j][0] && a[i][1] !== b[j][1]) return LEX_CONFUSIONS[a[i][0]][1];
    }
    return null;
  }

  // Verbs often confused by Spanish speakers: [lemma sbagliato, lemma giusto, spiegazione]
  var VERB_CONFUSIONS = [
    ["stare", "essere", "«Estar» no siempre es *stare*: ubicación y estados van con *essere* (sono a casa, è stanco). *Stare* es para *sto bene*, *sto per*, *sto + gerundio* y quedarse."],
    ["essere", "stare", "Acá va *stare*: salud (sto bene), acción en curso (sto mangiando), *stare per* y quedarse (sta' zitto)."],
    ["conoscere", "sapere", "*Sapere* = saber un dato o hacer algo (so che…, so nuotare); *conoscere* = conocer personas, lugares, cosas."],
    ["sapere", "conoscere", "*Conoscere* = conocer personas, lugares o cosas; *sapere* = saber un dato o saber hacer."],
    ["guardare", "vedere", "*Vedere* = ver (percibir); *guardare* = mirar con intención. Non vedo niente = no veo nada."],
    ["vedere", "guardare", "*Guardare* = mirar con intención (guardo la TV); *vedere* = ver."],
    ["ascoltare", "sentire", "*Sentire* = oír (y sentir); *ascoltare* = escuchar con atención. Non ti sento = no te escucho/oigo."],
    ["sentire", "ascoltare", "*Ascoltare* = escuchar con atención (ascolto musica); *sentire* = oír."],
    ["tenere", "avere", "«Tener» casi siempre es *avere*: ho fame, ho trent'anni, ho una macchina. *Tenere* es sostener o guardar."],
    ["prendere", "portare", "*Portare* = llevar/traer a algún lugar; *prendere* = agarrar, tomar."],
    ["portare", "prendere", "*Prendere* = tomar, agarrar (prendo il treno, prendo un caffè); *portare* = llevar."],
    ["salire", "uscire", "*Uscire* = salir; *salire* = subir."],
    ["uscire", "salire", "*Salire* = subir (salgo sul treno); *uscire* = salir."],
    ["fare", "rendere", "«Hacer + adjetivo» (hacer feliz) es *rendere*: mi rendi felice."],
    ["pensare", "credere", "*Credere* = creer; *pensare* = pensar."],
    ["sperare", "aspettare", "«Esperar» a alguien o algo es *aspettare* (aspetto il treno); *sperare* es tener esperanza (spero di sì)."],
    ["aspettare", "sperare", "*Sperare* = tener esperanza (spero che venga); *aspettare* = esperar a alguien."],
    ["fare", "stare", "Acá va *stare*."],
    ["imparare", "insegnare", "*Insegnare* = enseñar; *imparare* = aprender."],
    ["insegnare", "imparare", "*Imparare* = aprender; *insegnare* = enseñar."],
    ["andare", "venire", "*Venire* = venir hacia donde está quien habla o escucha (vengo da te); *andare* = ir a otro lugar."],
    ["venire", "andare", "*Andare* = ir a otro lugar; *venire* = venir hacia el que habla o acompañar (vieni con noi?)."]
  ];

  // The week each tense is taught (course.json, weeks[].tenses).
  var TENSE_WEEK = { imperfetto: 15, futuro: 19, condizionale: 20, congiuntivo: 24, congImperfetto: 30, passatoRemoto: 37 };

  // A slot where only a noun can go: after an article, a preposition, a
  // possessive or a determiner, or after a form of avere (ho voglia).
  var DETERMINERS = /^(qualche|ogni|questo|questa|questi|queste|quel|quella|quello|quei|quelle|quegli|molto|molta|molti|molte|poco|poca|pochi|poche|tanto|tanta|tanti|tante|nessun|nessuna|alcuni|alcune|certi|certe|altro|altra|altri|altre|tutto|tutta|ultimo|ultima)$/;
  function nounSlot(ctx) {
    var prev = ctx.e[ctx.ei - 1] || "", w = ctx.e[ctx.ei] || "";
    // «lo aspetto»: an article that cannot go with the word is a pronoun.
    if (ARTICLES[prev] && CLITICS.indexOf(prev) >= 0 && !artCanGo(prev, w)) return false;
    return !!(ARTICLES[prev] || prepInfo(prev) || POSSESSIVE.indexOf(prev) >= 0 || DETERMINERS.test(prev) ||
              (AVERE.indexOf(prev) >= 0 && ctx.ei > 0));
  }

  var SUBJ = { io: 0, tu: 1, lui: 2, lei: 2, "lui/lei": 2, noi: 3, voi: 4, loro: 5 };
  function subjectPerson(ctx) {
    var stem = String(ctx && ctx.stem || "").replace(/\(.*?\)/g, " ").toLowerCase();
    var m = /(^|[^a-zà-ù])(io|tu|lui\/lei|lui|lei|noi|voi|loro)(?=[^a-zà-ù]|$)/.exec(stem);
    return m ? SUBJ[m[2]] : null;
  }
  function formalContext(ctx) {
    var stem = String(ctx && ctx.stem || "");
    return /(^|[\s,(])Lei[\s,?]/.test(stem) || /\bsignor[ae]?\b/i.test(stem);
  }

  function verbRule(g, e, ctx) {
    var fe = verbForms(e), fg = verbForms(g);
    var prevE = ctx.e[ctx.ei - 1] || "", nextE = ctx.e[ctx.ei + 1] || "";
    var before = ctx.e.slice(0, ctx.ei).join(" ");
    // A noun where a noun goes (il conto, del suo lavoro, qualche parte, ho
    // voglia): «conta», «parta», «voglio» are not a person or a mood.
    if (nounSlot(ctx) && (DATA.nouns[e] || DATA.nounsByPlural[e]) && !participleOf(e)) return null;
    // stanco/stanca are also «io stanco» (stancare): read them as the
    // adjective where an adjective goes (after essere, an article, a noun,
    // molto…); «Vive in Italia» at the start is the verb.
    if (DATA.adj[e] && DATA.adj[e] === DATA.adj[g] &&
        (ESSERE.indexOf(prevE) >= 0 || ARTICLES[prevE] || DATA.nouns[prevE] || DATA.nounsByPlural[prevE] ||
         /^(molto|così|tanto|troppo|più|meno|sempre|già|proprio|davvero|stare|sto|stai|sta|stiamo|state|stanno|sembra|sembrano|diventa|diventano|resta|rimane|e|ma|o)$/.test(prevE))) return null;
    // arrivati/arrivate after essere: agreement, not «voi arrivate».
    if (participleOf(e) && participleOf(e) === participleOf(g) && ESSERE.indexOf(prevE) >= 0 &&
        e.slice(0, -1) === g.slice(0, -1)) return null;
    // c'è / ci sono, ci vuole / ci vogliono
    if ((prevE === "ci" || prevE === "c'") && /^(è|sono|era|erano|sarà|saranno|vuole|vogliono|voleva|volevano)$/.test(e) &&
        !participleOf(nextE) &&
        // the same verb and tense in another number: c'è / ci sono (a tense
        // or a typo is not this rule)
        fg.some(function (b) { return fe.some(function (a) { return a.lemma === b.lemma && a.tense === b.tense && a.p !== b.p; }); })) {
      return { cat: "ci_ne", slip: false,
        hint: "Mirá lo que viene después: ¿singular o plural?",
        explain: /vuol|vogl|vol/.test(e)
          ? "*Ci vuole* + singular, *ci vogliono* + plural: ci vuole un'ora, ci vogliono due ore."
          : "*C'è* + singular, *ci sono* + plural: c'è un problema, ci sono molti turisti." };
    }
    // Prefer the reading of an ambiguous form that fits the context:
    // congiuntivo after a trigger; same grammatical person otherwise.
    var trig = OPINION.some(function (w) { return (" " + before + " ").indexOf(" " + w + " ") >= 0; }) ||
               /\b(che|prima che|benché|sebbene|affinché|purché)\s*$/.test(before);
    // mangi, paghi, frequenti are presente (tu) and congiuntivo: without
    // anything that asks for the congiuntivo (a trigger, *che/se* from its
    // week on, a prompt that names it) they are read as presente, and a
    // wrong person is a wrong person, not «acá va congiuntivo».
    var CONG = /congiuntivo|congImperfetto/;
    var congOk = trig || /congiuntiv|subjuntiv/i.test(String(ctx.prompt || "")) ||
      (/(^|\s)che$|(^|\s)che\s/.test(before) && (ctx.week == null || ctx.week >= 24));
    // «se» (the conditional, not «se ne», «se lo») asks for the congiuntivo
    // imperfetto only: «Se arrivi prima» is presente.
    var seCond = /(^|\s)se(\s(?!ne\b|lo\b|la\b|li\b|le\b)|$)/.test(before) && (ctx.week == null || ctx.week >= 30);
    if (!congOk) {
      var feInd = fe.filter(function (x) { return !CONG.test(x.tense) || (seCond && x.tense === "congImperfetto"); });
      if (feInd.length) fe = feInd;
      var fgInd = fg.filter(function (x) { return !CONG.test(x.tense) || (seCond && x.tense === "congImperfetto"); });
      if (fgInd.length) fg = fgInd;
    }
    if (trig) fe = fe.slice().sort(function (a, b) {
      return (/congiuntivo|congImperfetto/.test(b.tense) ? 1 : 0) - (/congiuntivo|congImperfetto/.test(a.tense) ? 1 : 0);
    });
    if (fg.length) fe = fe.slice().sort(function (a, b) {
      return ((b.p % 3 === fg[0].p % 3) ? 1 : 0) - ((a.p % 3 === fg[0].p % 3) ? 1 : 0);
    });
    var lemE = fe.length ? fe[0].lemma : participleOf(e);
    var lemG = fg.length ? fg[0].lemma : participleOf(g);

    // Simple form where a compound tense is needed (verrebbe → sarebbe venuto)
    var ppNext = participleOf(nextE);
    if ((ESSERE.indexOf(e) >= 0 || AVERE.indexOf(e) >= 0) && ppNext && fg.length &&
        ESSERE.indexOf(g) < 0 && AVERE.indexOf(g) < 0 &&
        fg.some(function (x) { return x.lemma === ppNext; })) {
      var t = fg.filter(function (x) { return x.lemma === ppNext; })[0].tense;
      return { cat: "tempo_verbale", slip: false,
        hint: "Acá hace falta un tiempo compuesto (auxiliar + participio).",
        explain: t === "condizionale"
          ? "Para lo que *habría* pasado (y no pasó) va el condicional compuesto: " + it(e + " " + nextE) + " (sarebbe venuto, avrei detto)."
          : t === "passatoRemoto"
          ? "Para hechos de hoy o de un pasado que sentís cercano, el italiano usa el passato prossimo: " + it(e + " " + nextE) + ". El passato remoto queda para lo lejano o narrado."
          : "Acá va un tiempo compuesto: " + it(e + " " + nextE) + "." };
    }
    if (lemE && /^(piacere|mancare|servire|bastare|interessare|dispiacere)$/.test(participleOf(nextE) || "") &&
        (ESSERE.indexOf(e) >= 0 || AVERE.indexOf(e) >= 0) && /^(è|sono|era|erano|sarà|saranno|sarebbe|sarebbero|sia|siano|fosse|fossero)$/.test(e) &&
        // «siamo piaciute» for «sono piaciute»: the person; «ero piaciuti»:
        // the tense, which the tense rule explains.
        fg.some(function (b) { return fe.some(function (a) { return a.lemma === b.lemma && a.tense === b.tense && a.p !== b.p; }); })) {
      lemE = participleOf(nextE);
      return { cat: "piacere", slip: false,
        hint: "Con *" + lemE + "* el verbo concuerda con lo que gustó, no con la persona.",
        explain: "*" + lemE + "* concuerda con lo que gusta, también en pasado: mi è piaciuto il film / mi sono piaciute le foto. Acá: " + it(e) + "." };
    }

    // piacere & co.: the thing liked is the subject
    if (lemE && /^(piacere|mancare|servire|bastare|interessare|dispiacere)$/.test(lemE) && prevE !== "si" &&
        fe.some(function (a) { return a.lemma === lemE && (a.p === 2 || a.p === 5); }) &&
        ((lemG === lemE && fg.some(function (b) { return fe.some(function (a) { return a.lemma === b.lemma && a.tense === b.tense && a.p !== b.p; }); })) ||
         (lemG !== lemE && /^(piaccio|piaci|piacciono|piace|manca|mancano|serve|servono|basta|bastano)$/.test(g)))) {
      return { cat: "piacere", slip: false,
        hint: "Con *" + lemE + "* el sujeto es la cosa que gusta (o falta), no la persona.",
        explain: "*" + lemE + "* funciona como «gustar»: concuerda con lo que gusta. Mi piace il libro / mi piacciono i libri; " +
          "la persona va con *mi, ti, gli, le…*. Acá: " + it(e) + "." };
    }

    if (!fe.length) {
      // Participles
      var lem = participleOf(e);
      if (!lem && /(ato|uto|ito)$/.test(g) && /(tto|sto|rto|lto|nto|so|to)$/.test(e) && !/(ato|uto|ito)$/.test(e) &&
          deaccent(g).slice(0, 3) === deaccent(e).slice(0, 3) && !participleOf(g)) {
        return { cat: "irregolare", slip: false,
          hint: "Ese participio es irregular.",
          explain: "Participio irregular: " + it(e) + ", no *" + g + "*. Muchos verbos en -ere lo tienen (preso, messo, scritto, risolto, chiuso)." };
      }
      if (lem && Conj) {
        var reg = Conj.regular(lem, "participio"), real = Conj.participle(lem);
        // the regular participle, with any of -ato/-uto/-ito (chiudito,
        // prenduto, mettuto); a slip inside the stem (veuto) is a typo
        var looksRegular = /(at|ut|it)[oaie]$/.test(g) && deaccent(g).slice(0, 2) === deaccent(lem).slice(0, 2) &&
          editDistance(g, real.slice(0, -1) + g.slice(-1)) >= 2;
        if (reg !== real && g.slice(0, -1) !== real.slice(0, -1) &&
            (looksRegular || degeminate(g.slice(0, -1)) === degeminate(reg.slice(0, -1)))) {
          var realG = real.slice(0, -1) + g.slice(-1);
          return { cat: "irregolare", slip: false,
            hint: "El participio de " + it(lem) + " es irregular.",
            explain: "Participio irregular: " + it(lem) + " → " + it(real) + (realG !== real ? " (acá, " + it(realG) + ")" : "") + ", no *" + g + "*." };
        }
      }
      return null;
    }
    // Same lemma.  An ambiguous form (arrivi: presente tu, congiuntivo io)
    // is read first as the same tense in another person, then as another
    // tense in the same person.
    var pairs = [];
    fe.forEach(function (a0) { fg.forEach(function (b0) { if (a0.lemma === b0.lemma) pairs.push([a0, b0]); }); });
    var samePT = pairs.filter(function (x) { return x[0].tense === x[1].tense && x[0].p !== x[1].p; });
    var sameP = pairs.filter(function (x) { return x[0].p === x[1].p && x[0].tense !== x[1].tense; });
    // A tense the learner has not met yet is not what they meant: «parta»
    // for «parto» in week 6 is the ending, not the congiuntivo.
    var knownT = function (t) { return !(ctx.week != null && ctx.week < (TENSE_WEEK[t] || 0)); };
    var ordered = samePT.filter(function (x) { return knownT(x[1].tense); })
      .concat(sameP.filter(function (x) { return knownT(x[1].tense); }), samePT, sameP);
    // After «è possibile che», «spero che»: the congiuntivo reading first.
    if (trig) ordered = sameP.filter(function (x) { return CONG.test(x[0].tense); }).concat(ordered);
    for (var i = 0; i < ordered.length; i++) {
      {
        var a = ordered[i][0], b = ordered[i][1];
        if (a.tense === b.tense && a.p !== b.p) {
          // The hour: «sono le tre», «è l'una» (plural for every hour but one)
          var nx = ctx.e[ctx.ei + 1] || "", nx2 = ctx.e[ctx.ei + 2] || "";
          if ((e === "sono" || e === "è") && (
                (nx === "le" && /^(due|tre|quattro|cinque|sei|sette|otto|nove|dieci|undici|dodici)$/.test(nx2)) ||
                /^(l'una|mezzogiorno|mezzanotte)$/.test(nx) || (nx === "l'" && nx2 === "una"))) {
            return { cat: "persona_verbale", slip: false,
              hint: "¿Qué hora es? Las horas van en plural, salvo la una, mediodía y medianoche.",
              explain: "Las horas: *sono le tre*, *sono le nove e mezza* (plural); *è l'una*, *è mezzogiorno*, *è mezzanotte* (singular)." };
          }
          // «sono» is io and loro: the subject in the sentence decides which
          // one to name («el sujeto acá es loro», not «io»).
          var subj = subjectPerson(ctx);
          if (subj != null && subj !== a.p) {
            var alt = fe.filter(function (x) { return x.lemma === a.lemma && x.tense === a.tense && x.p === subj; })[0];
            if (alt) a = alt;
          }
          // The courtesy form only when the sentence addresses someone as
          // «Lei» / «signora»; a plain lui/lei drill is not «usted».
          var formal = (b.p === 1 && a.p === 2) && formalContext(ctx);
          return { cat: "persona_verbale", slip: false,
            hint: formal ? "¿Tuteás o hablás de usted? Mirá a quién se dirige la frase."
                         : "El verbo está bien elegido, pero no en la persona correcta. ¿Quién es el sujeto?",
            explain: formal
              ? "Con *Lei* (usted) el verbo va en tercera persona: " + it(e) + ". *Signora, come sta?*"
              : it(g) + " es la forma de *" + PERS_ES[b.p] + "*; el sujeto acá es *" + PERS_ES[a.p] + "*: " + it(e) + "." +
                (a.p === 4 && b.p === 5 ? " Ojo: el «ustedes» rioplatense es *voi* en italiano (voi andate)." : "") };
        }
        if (a.p === b.p && a.tense !== b.tense) return tenseRule(g, e, a, b, ctx);
      }
    }
    if (Conj) {
      // -care/-gare without h
      var eh = e.replace(/([cg])h([ie])/, "$1$2");
      if (eh !== e && eh === g) return { cat: "ortografia", slip: false,
        hint: "Mirá cómo suena la c/g de la palabra marcada.",
        explain: "Para conservar el sonido duro, los verbos en *-care/-gare* agregan *h* antes de i/e: " + it(e) + " (cerchi, paghiamo)." };
      // Over-regularisation of an irregular verb
      for (var k = 0; k < fe.length; k++) {
        var f = fe[k];
        try {
          var regf = Conj.regular(f.lemma, f.tense)[f.p];
          if (regf && regf.split(" ").pop() === g && regf.split(" ").pop() !== e) {
            var v = Conj.info(f.lemma);
            var stemNote = (f.tense === "futuro" || f.tense === "condizionale")
              ? " En futuro y condicional muchos verbos contraen la raíz: andr-, avr-, potr-, dovr-, vorr-, verr-, sar-." : "";
            return { cat: "irregolare", slip: false,
              hint: "Ese verbo no es regular en este tiempo.",
              explain: v.isc
                ? it(f.lemma) + " es de los verbos en *-isc-*: " + it(e) + " (finisco, capisci, preferiscono)."
                : it(f.lemma) + " es irregular: " + it(e) + ", no *" + g + "*." + stemNote };
          }
        } catch (err) { /* */ }
      }
      // Regularised future/conditional stem not in the table (anderei, poterò)
      var endM = /(rei|resti|rebbe|remmo|reste|rebbero|rò|rai|rà|remo|rete|ranno)$/.exec(g);
      if (!fg.length && endM && (fe[0].tense === "futuro" || fe[0].tense === "condizionale")) {
        var lemF = fe[0].lemma.replace(/si$/, "e"), baseF = lemF.slice(0, -3), gStem = g.slice(0, -endM[1].length);
        var tname = fe[0].tense === "futuro" ? "futuro" : "condicional";
        // tornaranno for torneranno: the -are verbs change the a into e.
        if (/are$/.test(lemF) && gStem === baseF + "a" && e.indexOf(baseF + "er") === 0) return { cat: "irregolare", slip: false,
          hint: "Revisá la vocal antes de la r en " + tname + ".",
          explain: "Los verbos en -are cambian la *a* por *e* en futuro y condicional: " + it(lemF) + " → " + it(e) +
            " (parlerò, mangerei), no *" + g + "*. En español la a se queda (tornarán); en italiano, no." };
        // anderò, poterò: the full stem where Italian contracts it.
        if (gStem === baseF + "e" || gStem === baseF + "i" || gStem === baseF + "a") return { cat: "irregolare", slip: false,
          hint: "Revisá la raíz del verbo en " + tname + ".",
          explain: it(fe[0].lemma) + " contrae la raíz en futuro y condicional: " + it(e) +
            ". Igual: andare → andr-, avere → avr-, potere → potr-, volere → vorr-, venire → verr-, essere → sar-." };
      }
      // -isc- verbs written without -isc-
      for (var q = 0; q < fe.length; q++) {
        var inf = Conj.info(fe[q].lemma);
        if (inf.isc && /isc/.test(e) && !/isc/.test(g) &&
            deaccent(g).slice(0, 3) === deaccent(e).slice(0, 3) &&
            (editDistance(g, e) >= 2 || g === e.replace(/isc/, ""))) {
          return { cat: "irregolare", slip: false,
            hint: "Ese verbo pertenece a un grupo especial de -ire.",
            explain: it(fe[q].lemma) + " es de los verbos en *-isc-*: " + it(e) +
              " (finisco, capisci, preferiscono; pero finiamo, finite)." };
        }
      }
    }
    // Different verbs: the classic Spanish-speaker confusions
    if (lemG && lemE && lemG !== lemE) {
      for (var c = 0; c < VERB_CONFUSIONS.length; c++) {
        var vc = VERB_CONFUSIONS[c];
        if (vc[0] === lemG && vc[1] === lemE) return { cat: "lessico", slip: false,
          hint: "Ese verbo no es el que corresponde acá. Pensá en qué significa exactamente.",
          explain: vc[2] + " Acá: " + it(e) + "." };
      }
      return { cat: "lessico", slip: false,
        hint: "Ese verbo no es el que va.",
        explain: it(g) + " es de *" + lemG + "*" + (DATA.lex[lemG] ? " («" + DATA.lex[lemG] + "»)" : "") +
          "; acá va " + it(e) + ", de *" + lemE + "*" + (DATA.lex[lemE] ? " («" + DATA.lex[lemE] + "»)" : "") + "." };
    }
    if (fg.length && fe.length) {
      var fa0 = fe[0], fb0 = fg.filter(function (x) { return x.lemma === fa0.lemma; })[0] || fg[0];
      var fut = fa0.tense === "futuro" && /(^|\s)(quando|appena|finché)$/.test(before);
      var past = fa0.tense === "imperfetto" && /congImperfetto/.test((verbForms(ctx.e.slice(ctx.ei + 1).filter(function (w) {
        return verbForms(w).some(function (x) { return x.tense === "congImperfetto"; }); })[0] || "")[0] || {}).tense || "");
      return { cat: "tempo_verbale", slip: false,
        hint: fut ? "Es algo que va a pasar: ¿qué tiempo pide el italiano después de *" + before.split(" ").pop() + "*?"
                  : "Revisá el verbo marcado: ¿qué tiempo pide la frase y quién es el sujeto?",
        explain: it(g) + " es " + TENSE_ES[fb0.tense] + " (" + PERS_ES[fb0.p] + "); acá va " + it(e) + ", " +
          TENSE_ES[fa0.tense] + " (" + PERS_ES[fa0.p] + ")." +
          (fut ? " Después de *quando, appena*, para lo que va a pasar, el italiano usa el futuro; en español va subjuntivo («cuando llegue»)."
           : past ? " Con el congiuntivo imperfetto después, el verbo principal va en pasado (pensavo che fosse)."
           : (function () {
               // the use of the tense that goes, with the clue of the sentence
               var lay = TENSE_USE[TENSE_ES[fa0.tense]] ? tenseLayers(g, TENSE_ES[fb0.tense], e, TENSE_ES[fa0.tense], ctx) : null;
               return lay ? " El " + TENSE_ES[fa0.tense] + " " + lay.explain.replace(/^[^:]*: /, "") : "";
             })()) };
    }
    return null;
  }

  /* A word of the language even if the course does not teach it: the
     frequency lexicon (data/frequenza.json, loaded by the app as Freq)
     knows 17.000 lemmas.  Before saying «X is no Italian word», ask it. */
  function realWord(w) {
    if (isItalian(w)) return true;
    var F = root.Freq;
    try { return !!(F && F.loaded && F.loaded() && F.info(w) && !ES_FUNC[deaccent(w)]); } catch (e) { return false; }
  }
  // «X no es una palabra italiana», or what to say when it is one.
  function notAWord(g, e) {
    return realWord(g)
      ? it(g) + " existe en italiano, pero acá no es la palabra que va. Acá va " + it(e) + (DATA.lex[e] ? " («" + DATA.lex[e] + "»)" : "") + "."
      : it(g) + " no es una palabra italiana. Acá va " + it(e) + (DATA.lex[e] ? " («" + DATA.lex[e] + "»)" : "") + ".";
  }

  function isItalian(w) {
    if (!LIDX) buildVerbIndex();
    return !!(DATA.lex[w] || ARTICLES[w] || prepInfo(w) || verbForms(w).length ||
              participleOf(w) || CLITICS.indexOf(w) >= 0 || SUBJECTS.indexOf(w) >= 0 ||
              AVERE.indexOf(w) >= 0 || ESSERE.indexOf(w) >= 0 ||
              // the truncated infinitive: aver fatto, esser nato, far vedere
              (/[aei]r$/.test(w) && (LIDX[w + "e"] || LIDX[w.replace(/r$/, "rre")])));
  }

  function regularPlural(s, g) {
    if (/[àèéìòù]$/.test(s) || /[^aeiou]$/.test(s)) return s;
    if (/a$/.test(s)) return g === "m" ? s.slice(0, -1) + "i" : s.slice(0, -1) + "e";
    return s.slice(0, -1) + "i";
  }

  function findParticipleLemma(toks) {
    for (var i = 0; i < toks.length; i++) {
      var l = participleOf(toks[i]);
      if (l) return l;
    }
    return null;
  }

  // The definite article of a noun, with its space (il , l', gli …).
  function articleFor(noun, n) {
    var pl = n && n.pl === noun && n.s !== noun, snd = soundRule(noun);
    var art = pl ? (n.g === "f" ? "le" : snd === "c" ? "i" : "gli")
                 : n && n.g === "f" ? (snd === "v" ? "l'" : "la") : snd === "v" ? "l'" : snd === "sz" ? "lo" : "il";
    return art === "l'" ? art : art + " ";
  }

  /* What an adjective or participle agrees with, and how: the article right
     before it (gli argentini), the noun next to it (casa bella, bella casa),
     one word further only if no verb is in between.  The number of an
     invariable noun (le università) comes from its article. */
  function agreeHead(ctx) {
    var e = ctx.e, i = ctx.ei;
    var nounI = function (w) { return w && (DATA.nouns[w] || DATA.nounsByPlural[w]); };
    var verbish = function (w) { return !!w && (verbForms(w).length > 0 || AVERE.indexOf(w) >= 0 || ESSERE.indexOf(w) >= 0); };
    var descOf = function (w, k) {
      var n = nounI(w);
      if (!n) return "";
      var num = n.s === n.pl ? null : (DATA.nounsByPlural[w] && n.pl === w ? "plural" : "singular");
      if (!num) {
        var art = e[k - 1] && (ARTICLES[e[k - 1]] || (prepInfo(e[k - 1]) && ARTICLES[prepInfo(e[k - 1]).art]));
        num = art ? (art[1] === "p" ? "plural" : "singular") : "";
      }
      return ((n.g === "m" ? "masculino" : "femenino") + (num ? " " + num : "")).trim();
    };
    var prevArt = e[i - 1] && ARTICLES[e[i - 1]];
    if (prevArt && !nounI(e[i + 1])) return agreeGuess(ctx) ||
      { head: e[i - 1], desc: ((prevArt[0] === "m" ? "masculino" : prevArt[0] === "f" ? "femenino" : "") + (prevArt[1] === "p" ? " plural" : " singular")).trim() };
    if (nounI(e[i + 1])) return { head: e[i + 1], desc: descOf(e[i + 1], i + 1) };
    if (nounI(e[i - 1])) return { head: e[i - 1], desc: descOf(e[i - 1], i - 1) };
    // the subject before essere: «il museo è chiuso (il lunedì)»
    if (ESSERE.indexOf(e[i - 1]) >= 0 && nounI(e[i - 2])) return { head: e[i - 2], desc: descOf(e[i - 2], i - 2) };
    // one word further, if no verb and no new article is in between
    if (nounI(e[i + 2]) && !verbish(e[i + 1]) && !ARTICLES[e[i + 1]] && !prepInfo(e[i + 1])) return { head: e[i + 2], desc: descOf(e[i + 2], i + 2) };
    if (nounI(e[i - 2]) && !verbish(e[i - 1])) return { head: e[i - 2], desc: descOf(e[i - 2], i - 2) };
    return agreeGuess(ctx);
  }

  function nounAfter(ctx) {
    return ctx.e[ctx.ei + 1] || "";
  }

  // No known noun nearby: the article in front says what the adjective agrees
  // with («i ___ cugini» → cugini, masculino plural).
  function agreeGuess(ctx) {
    var e = ctx.e, i = ctx.ei;
    var wordish = function (w) {
      return !!w && /^[a-zà-ù]/.test(w) && !ARTICLES[w] && !prepInfo(w) && CLITICS.indexOf(w) < 0 &&
        SUBJECTS.indexOf(w) < 0 && !verbForms(w).length && AVERE.indexOf(w) < 0 && ESSERE.indexOf(w) < 0 && w !== "non";
    };
    for (var k = 1; k <= 2; k++) {
      var a = e[i - k];
      var art = a && (ARTICLES[a] ? a : (prepInfo(a) && prepInfo(a).art));
      var info = art && ARTICLES[art];
      if (!info) continue;
      var noun = wordish(e[i + 1]) ? e[i + 1] : (k === 2 && wordish(e[i - 1]) ? e[i - 1] : null);
      if (!noun) continue;
      var desc = (info[0] === "m" ? "masculino" : info[0] === "f" ? "femenino" : "") + (info[1] === "p" ? " plural" : " singular");
      return { head: noun, desc: desc.trim() };
    }
    return null;
  }

  function soundRule(noun) {
    if (/^(s[bcdfghklmnpqrstvz]|z|gn|ps|pn|x|y)/.test(noun)) return "sz";
    if (/^[aeiouàèéìòùh]/.test(noun)) return "v";
    return "c";
  }

  // What each article is for: gender, number and the sound it goes before.
  var ART_USE = dict({
    il: "masculino singular, delante de consonante", lo: "masculino singular, delante de s + consonante, z, gn o ps",
    "l'": "singular, delante de vocal", la: "femenino singular, delante de consonante",
    i: "masculino plural, delante de consonante", gli: "masculino plural, delante de vocal o de s + consonante, z, gn, ps",
    le: "femenino plural", un: "masculino, o delante de vocal sin apóstrofo", uno: "masculino, delante de s + consonante, z, gn o ps",
    una: "femenino, delante de consonante", "un'": "femenino, delante de vocal"
  });
  function articleRule(g, e, ctx) {
    var noun = nounAfter(ctx), ag = ARTICLES[g], ae = ARTICLES[e];
    // The hint may only name the learner's own word: naming the expected noun
    // would give the answer away when the noun itself was wrong (la mesa →
    // il tavolo, i bracci → le braccia).
    var gNoun = ctx.g && ctx.gi >= 0 ? ctx.g[ctx.gi + 1] : noun;
    var shown = gNoun === noun ? noun : null;
    var r = articleRuleInner(g, e, ctx, noun, ag, ae);
    if (!shown) {
      r.hint = r.cat === "genere" ? "Revisá el artículo y la palabra que lo sigue: ¿son del mismo género?"
             : "Revisá el artículo y la palabra que lo sigue.";
    }
    return r;
  }

  function articleRuleInner(g, e, ctx, noun, ag, ae) {
    // «la cui opera»: the article agrees with what follows «cui».
    if (noun === "cui") {
      var owned = ctx.e[ctx.ei + 2] || "";
      return { cat: "articolo", slip: false,
        hint: "Con *cui*, ¿con qué palabra concuerda el artículo?",
        explain: "En *il cui, la cui* el artículo concuerda con lo que viene después (lo poseído), no con el poseedor: " +
          it(e + " cui" + (owned ? " " + owned : "")) + ". Como en español «cuya obra»." };
    }
    // «il mio capo», «le nostre figlie»: the noun is after the possessive.
    if ((POSSESSIVE.indexOf(noun) >= 0 || DATA.adj[noun]) && (DATA.nouns[ctx.e[ctx.ei + 2]] || DATA.nounsByPlural[ctx.e[ctx.ei + 2]])) {
      var real = ctx.e[ctx.ei + 2];
      var r0 = articleRuleInner(g, e, { e: [e, real], ei: 0, names: ctx.names }, real, ag, ae);
      var three = it(e + (e.slice(-1) === "'" ? "" : " ") + noun + " " + real);
      r0.explain = r0.explain.split(it(e + (e.slice(-1) === "'" ? "" : " ") + real)).join(three);
      if (POSSESSIVE.indexOf(noun) >= 0) r0.explain += " El posesivo va con artículo, como en «la mia casa» (en español, «mi casa»).";
      return r0;
    }
    if (!noun || !/^[a-zà-ù']/.test(noun)) {
      var gg = ag[0] !== "?" && ae[0] !== "?" && ag[0] !== ae[0];
      return { cat: gg ? "genere" : "articolo", slip: false,
        hint: gg ? "Revisá el género." : "Revisá el artículo.",
        explain: "Acá va " + it(e) + " (" + ART_USE[e] + "), no " + it(g) + " (" + ART_USE[g] + ")." };
    }
    var info = DATA.nouns[noun] || DATA.nounsByPlural[noun];
    var sound = soundRule(noun);
    // Gender
    if (ag[0] !== "?" && ae[0] !== "?" && ag[0] !== ae[0]) {
      var gen = ae[0] === "m" ? "masculino" : "femenino";
      return { cat: "genere", slip: false,
        hint: "Revisá el género de " + it(noun) + ".",
        explain: it(noun) + " es " + gen + " en italiano: " + it(e + (e.slice(-1) === "'" ? "" : " ") + noun) + "." +
          (info && info.note ? " " + info.note : "") };
    }
    var withNoun = it(e + (e.slice(-1) === "'" ? "" : " ") + noun);
    if (ag[1] !== ae[1]) return { cat: "accordo", slip: false,
      hint: "Revisá el número: ¿singular o plural?",
      explain: it(noun) + " está en " + (ae[1] === "p" ? "plural" : "singular") + ", y el artículo cambia con él, como en español (el/los, la/las = il/i, la/le): " + withNoun +
        (ae[1] === "p" && DATA.nounsByPlural[noun] && DATA.nounsByPlural[noun].s !== noun ? " (singular: " + it(DATA.nounsByPlural[noun].s) + ")"
         : ae[1] === "p" && DATA.nounsByPlural[noun] ? " (" + it(noun) + " no cambia en plural: solo el artículo lo marca)" : "") + "." };
    if (ag[2] !== ae[2]) return { cat: "articolo", slip: false,
      hint: "¿Artículo determinado o indeterminado?",
      explain: "Acá va " + (ae[2] === "det" ? "el artículo determinado" : "el indeterminado") + ": " + withNoun +
        ". El determinado (il, la…) habla de algo conocido o ya nombrado; el indeterminado (un, una), de uno cualquiera, igual que «el» y «un» en español." };
    // Same gender/number/type: the sound decides
    if (sound === "sz") return { cat: "articolo", slip: false,
      hint: "Mirá con qué sonido empieza " + it(noun) + ".",
      explain: "Delante de s + consonante, z, gn, ps, x e y va *lo / gli / uno*: " +
        it(e + " " + noun) + " (lo zaino, gli studenti, uno psicologo)." };
    if (sound === "v") return { cat: "articolo", slip: false,
      hint: "Mirá con qué letra empieza " + it(noun) + ".",
      explain: "Delante de vocal: *l'* en singular y *gli* en plural masculino; *un* (sin apóstrofo) para masculinos y *un'* para femeninos: " +
        it(e + (e.slice(-1) === "'" ? "" : " ") + noun) + "." };
    return { cat: "articolo", slip: false,
      hint: "Revisá el artículo antes de " + it(noun) + ".",
      explain: g === "l'" ? "*l'* solo va delante de vocal; " + it(noun) + " empieza con consonante: " + withNoun + "."
        : /^(lo|gli|uno)$/.test(g) ? it(g) + " va solo delante de s + consonante, z, gn o ps" + (g === "gli" ? " (y de vocal: gli amici)" : "") +
            "; " + it(noun) + " empieza con una consonante común: " + withNoun + "."
        : "Delante de consonante va *il / i / un* en masculino y *la / le / una* en femenino: " + withNoun + "." };
  }

  var PLACE_IN = ["italia", "argentina", "spagna", "francia", "germania", "sicilia", "toscana",
                  "ufficio", "banca", "centro", "città", "campagna", "montagna", "macchina",
                  "treno", "aereo", "biblioteca", "piscina", "palestra", "cucina", "bagno",
                  "giardino", "piazza", "farmacia", "vacanza", "europa", "america", "chiesa"];

  // The infinitive under a clitic (averci → avere, farlo → fare).
  function infBase(w) {
    w = String(w || "");
    var m = /^(.+[aei]r)(mi|ti|si|ci|vi|lo|la|li|le|ne|gli|glielo|gliela|glieli|gliele|gliene)$/.exec(w);
    return m ? m[1] + "e" : w;
  }
  var A_PLACES = /^(cinema|teatro|mare|bar|ristorante|casa|scuola|letto|lezione|concerto|museo|stadio|mercato|supermercato|parco|lavoro|pranzo|cena)$/;
  // What each preposition marks, in one line.
  var BASE_USE = {
    di: "*di* marca de quién o de qué es algo, el material y el tema (il libro di Marco, una torta di mele, parliamo di te)",
    a: "*a* marca adónde se va, la hora, las ciudades y a quién va algo (vado a Roma, alle otto, lo do a Marco)",
    da: "*da* marca desde dónde, «en lo de» alguien, desde cuándo y para qué sirve algo (vengo da Roma, vado da Marco, da due anni, macchina da scrivere)",
    "in": "*in* va con países, regiones, medios de transporte y muchos lugares cerrados (in Italia, in treno, in ufficio)",
    con: "*con* es la compañía o el instrumento, como el «con» del español",
    su: "*su* es «sobre» o «en» una superficie, y el tema (sul tavolo, un libro su Roma)",
    per: "*per* es «para» o «por» (per te, per due ore, passo per Roma)",
    tra: "*tra* (o *fra*) es «entre» o «dentro de» un tiempo (tra due giorni)",
    fra: "*fra* (o *tra*) es «entre» o «dentro de» un tiempo (fra due giorni)"
  };
  function prepRule(g, e, pg, pe, ctx) {
    var next = nounAfter(ctx), prev = ctx.e[ctx.ei - 1] || "";
    if (pg.base === pe.base) {
      // Same preposition, wrong article inside it
      if (pe.art && pg.art) {
        var fake = { e: [pe.art, next], ei: 0, g: [pg.art, ctx.g ? ctx.g[ctx.gi + 1] : next], gi: 0 };
        var ar = articleRule(pg.art, pe.art, fake);
        ar.cat = "preposizione_articolata";
        ar.explain = it(e) + " = *" + pe.base + " + " + pe.art + "*. " + ar.explain;
        return ar;
      }
      return { cat: "preposizione_articolata", slip: false,
        hint: pe.art ? "Acá la preposición va unida al artículo." : "Acá la preposición va sola, sin artículo.",
        explain: pe.art ? it(e) + " = *" + pe.base + " + " + pe.art + "*: en italiano la preposición se une al artículo."
                        : "Acá va " + it(e) + " sin artículo." };
    }
    var why;
    var nextInf = next && isInfinitive(infBase(next));
    if (nextInf && pe.base === "a") {
      why = "Delante de un infinitivo, verbos como *cominciare, imparare, riuscire, aiutare, invitare, andare* piden *a*: " + it((prev ? prev + " " : "") + "a " + next) + " (comincio a studiare, ti invito a venire).";
    } else if (nextInf && pe.base === "di") {
      why = "Delante de un infinitivo, muchos verbos y expresiones piden *di*: " + it((prev ? prev + " " : "") + "di " + next) + " (cerco di capire, ho deciso di partire, grazie di essere venuto). En español a veces no va nada («decidí partir»).";
    } else if (nextInf && pe.base === "da") {
      why = "*da* + infinitivo dice qué hay que hacer o para qué sirve algo: " + it((prev ? prev + " " : "") + "da " + next) + " (qualcosa da mangiare, niente da fare).";
    } else if (nextInf && pe.base === "per") {
      why = "*per* + infinitivo es «para»: " + it("per " + next) + " (studio per imparare).";
    } else if (pe.base === "a" && A_PLACES.test(next)) {
      why = "Con *cinema, teatro, mare, bar, ristorante, casa, scuola, letto* va *a* (vado al cinema, a casa); con *ufficio, banca, farmacia, montagna* y los países, *in*. No sigue al español: hay que aprenderlos de a uno. Acá: " + it(e + " " + next) + ".";
    } else if (pe.base === "da" && pg.base === "di" && verbForms(prev).concat(verbForms(ctx.e[ctx.ei - 2] || "")).map(function (x) { return x.lemma; })
               .concat([infBase(prev), infBase(ctx.e[ctx.ei - 2] || "")]).some(function (l) { return /^(scendere|uscire|partire|venire|tornare|arrivare|alzarsi|allontanarsi|cadere|fuggire|scappare|togliere)$/.test(l); })) {
      why = "El punto de partida de un movimiento va con *da*: " + it(e + " " + next) + " (scendo dal letto, esco dall'ufficio, vengo da Roma). *di* es de quién o de qué es algo.";
    } else if (pe.base === "da" && (/^(\d+|un|una|due|tre|quattro|cinque|sei|dieci|molto|tanto|poco|anni|mesi|giorni|ore|settimane|tempo|sempre|quando)$/.test(next) || /anni|mesi|tempo/.test(ctx.e.slice(ctx.ei).join(" ")))) {
      why = "Duración de algo que todavía sigue: *da* + tiempo (studio italiano da due anni = hace dos años que estudio).";
    } else if (pe.base === "da" && (FAMILY.indexOf(next) >= 0 || /^(medico|dentista|parrucchiere|avvocato|meccanico|nonna|nonno|amico|amica|me|te|lui|lei|noi|voi|loro|marco|giulia|maria|martín)$/.test(next) || (pe.art && /^(medico|dentista|parrucchiere)$/.test(next)))) {
      why = "Para ir o estar «en lo de» alguien se usa *da*: vado dal medico, sono da Giulia.";
    } else if (pe.base === "da" && /^(parte|lontano|qui|lì)$/.test(prev + next)) {
      why = "Origen o punto de partida: *da* (parto da Roma, lontano da qui).";
    } else if (pe.base === "a" && pg.base === "in" && /^[a-zàèìòù]+$/.test(next) && PLACE_IN.indexOf(next) < 0 && !pe.art &&
               ((ctx.names || []).indexOf(next) >= 0 || !isItalian(next))) {
      why = "Con ciudades va *a*: a Roma, a Buenos Aires. Con países y regiones, *in*: in Italia. En español «en» sirve para las dos; en italiano, no.";
    } else if (pe.base === "in" && (PLACE_IN.indexOf(next) >= 0 || !pe.art)) {
      why = "Con países, regiones y muchos lugares cerrados o medios de transporte va *in*: in Italia, in ufficio, in macchina, in treno.";
    } else if (pe.base === "di" && pg.base === "da" && ESSERE.indexOf(prev) >= 0) {
      why = "Origen de una persona: *di* (sono di Buenos Aires); *da* indica procedencia en un movimiento (vengo da Roma).";
    } else if ((pe.base === "tra" || pe.base === "fra") && /^(un|una|due|tre|poco|qualche|\d+)$/.test(next)) {
      why = "«Dentro de» + tiempo es *tra / fra*: fra due ore, tra un mese.";
    } else if (pe.base === "a" && /^(cominciare|iniziare|imparare|provare|aiutare|continuare|andare|venire|riuscire)/.test(prev)) {
      why = "Hay verbos que piden *a* antes del infinitivo: comincio a studiare, riesco a capire.";
    } else if (pe.base === "di" && /^(finire|smettere|cercare|decidere|sperare|credere|pensare|dimenticare|ricordarsi|temere|provare|evitare)/.test(prev)) {
      why = "Muchos verbos piden *di* antes del infinitivo: smetto di fumare, cerco di capire, ho deciso di partire.";
    } else if (pe.base === "per") {
      why = "Finalidad, destino o duración cerrada: *per* (studio per l'esame, parto per Roma, per due ore).";
    } else if (pe.base === "su") {
      why = "«Sobre / en» una superficie o un tema: *su* (sul tavolo, un libro su Dante).";
    } else {
      why = "El italiano usa acá " + it(e) + ", no " + it(g) + (BASE_USE[pe.base] ? ": " + BASE_USE[pe.base] : "") +
        ". Las preposiciones no se traducen una a una desde el español: conviene aprenderlas con su verbo o su expresión.";
    }
    return { cat: "preposizione", slip: false,
      hint: "Revisá la preposición marcada: el español te está tirando para otro lado.",
      explain: why };
  }

  // Why a verb takes essere: its family, in the learner's words.
  var ESSERE_WHY = [
    [/^(andare|venire|partire|arrivare|uscire|entrare|tornare|ritornare|salire|scendere|cadere|fuggire|scappare|giungere)$/, "es un verbo de movimiento hacia o desde un lugar"],
    [/^(restare|rimanere|stare|essere)$/, "es de los que dicen dónde o cómo se queda uno (stare, restare, rimanere, essere)"],
    [/^(nascere|morire|diventare|crescere|guarire|dimagrire|ingrassare|invecchiare|cambiare|succedere|accadere|capitare)$/, "dice un cambio de estado (nascere, morire, diventare)"],
    [/^(piacere|mancare|sembrare|parere|costare|servire|bastare|dispiacere|interessare)$/, "funciona como *piacere*: lo que gusta, falta o cuesta es el sujeto"]
  ];
  function auxRule(g, e, lemma, ctx) {
    ctx = ctx || { e: [], ei: 0 };
    var needsEssere = ESSERE.indexOf(e) >= 0;
    var prev = ctx.e[ctx.ei - 1] || "", next = ctx.e[ctx.ei + 1] || "", next2 = ctx.e[ctx.ei + 2] || "";
    var early = ctx.week != null && ctx.week < 11;
    var info = null;
    try { info = lemma && Conj ? Conj.info(lemma) : null; } catch (err) { info = null; }
    // mi sono alzato, si è rotto: the pronoun makes it reflexive.
    var fam = lemma && ESSERE_WHY.filter(function (x) { return x[0].test(lemma); })[0];
    var likes = fam && fam === ESSERE_WHY[3];
    // (mi è costato: the «mi» of piacere & co. is «a mí», not reflexive)
    var refl = !likes && (/^(mi|ti|si|ci|vi|me|te|se|ce|ve)$/.test(prev) ||
      (/^(mi|ti|si|ci|vi)$/.test(ctx.e[ctx.ei - 2] || "") && /^(ne|lo|la|li|le)$/.test(prev)));
    // «è innamorata», «sono preoccupato»: a reflexive verb's participle with
    // no pronoun is a state, like an adjective.
    var state = !refl && !likes && lemma && /rsi$/.test(lemma);
    var modal = lemma && /^(dovere|potere|volere)$/.test(lemma);
    var infNext = next2 && /(are|ere|ire|rre|rsi)$/.test(next2) ? next2 : "";
    var why;
    if (needsEssere) {
      if (refl) why = "Con el pronombre reflexivo (" + it(prev) + ") el pasado va siempre con *essere*: " + it(prev + " " + e + " " + next) +
        " (mi sono alzato, ci siamo divertiti). En español no hay auxiliar que elegir («se levantó»); en italiano, siempre *essere*.";
      else if (modal && infNext) why = "*" + lemma + "* toma el auxiliar del verbo que sigue: " + it(infNext) + " va con *essere*, así que " + it(e + " " + next + " " + infNext) + ". Con *avere* también se oye.";
      else if (state) why = it(e + " " + next) + " describe un estado, como un adjetivo (como el español «está enamorada», «estoy preocupado»): va con *essere*.";
      else if (info && info.aux === "both") why = it(lemma) + " va con *essere* cuando dice lo que le pasa al sujeto (il film è finito, sono corso a casa) y con *avere* cuando tiene objeto o dice la actividad (ho finito il lavoro, ho corso un'ora). Acá: " + it(e + " " + next) + ".";
      else if (fam) why = it(lemma) + " va con *essere*: " + fam[1] + ". En español todo va con «haber»; en italiano estos verbos van con *essere*, y el participio concuerda con el sujeto: " + it(e + " " + next) + ".";
      else if (info && info.aux === "avere") why = it(e + " " + next) + " describe un estado, como un adjetivo (" + it(next) + " = «" +
        (DATA.lex[next] || "hecho") + "»): va con *essere*, como el español «está roto». Con *avere* sería lo que alguien hizo (ha rotto il vaso = rompió el florero).";
      else why = (lemma ? it(lemma) + " va con *essere*. " : "") +
        "En español todo va con «haber»; en italiano van con *essere* el movimiento (andare, venire, partire), el quedarse (stare, rimanere), los cambios de estado (nascere, diventare), *piacere* y los reflexivos. Y el participio concuerda: sono andato/a.";
    } else {
      if (modal && infNext) why = "*" + lemma + "* toma el auxiliar del verbo que sigue: " + it(infNext) + " va con *avere*, así que " + it(e + " " + next + " " + infNext) + ".";
      else if (info && info.aux === "both") why = it(lemma) + " va con *avere* cuando tiene objeto o dice la actividad (ho finito il lavoro, ho corso un'ora) y con *essere* cuando dice lo que le pasa al sujeto (il film è finito, sono corso a casa). Acá: " + it(e + " " + next) + ".";
      else why = (lemma ? it(lemma) + " va con *avere*. " : "") +
        "La mayoría de los verbos usan *avere*, como el «haber» español: ho mangiato (comí), ho visto, ho camminato. *Essere* queda para el movimiento y los cambios de estado (sono andato, è nato).";
    }
    if (early) why = why.replace(/forma los tiempos compuestos/g, "arma el pasado");
    return { cat: "ausiliare", slip: false,
      hint: early ? "Para este pasado, ¿va con *essere* o con *avere*?"
                  : "Revisá el auxiliar" + (lemma ? " de " + it(refl && lemma && !/rsi$/.test(lemma) ? lemma.replace(/e$/, "si") : lemma) : "") + ": ¿*essere* o *avere*?",
      explain: why };
  }

  // The tenses not taught yet, in plain Spanish with an example.
  var PLAIN_ES = { futuro: "el futuro (como «haré»)", condizionale: "el condicional (como «haría»)",
    congiuntivo: "el subjuntivo (como «que haga»)", congImperfetto: "el subjuntivo pasado (como «hiciera»)",
    passatoRemoto: "el pasado de los relatos (como «hizo»)", imperfetto: "el pasado de las descripciones (como «hacía»)", presente: "el presente" };
  var COMPOUND_ES = { futuro: "el futuro compuesto (como «habré hecho»)", condizionale: "el condicional compuesto (como «habría hecho»)",
    congiuntivo: "el subjuntivo compuesto (como «haya hecho»)", congImperfetto: "el subjuntivo pluscuamperfecto (como «hubiera hecho»)",
    passatoRemoto: "el pasado anterior (como «hube hecho»)", imperfetto: "el pluscuamperfecto (como «había hecho»)", presente: "el pasado compuesto" };
  /* What each tense is for, in layers: the rule in one line (no Italian
     grammar names, so it reads the same before and after the week that
     teaches them), the Spanish that does the same, and two examples (the
     one that is not the item itself is shown). */
  var TENSE_USE = {
    "presente": ["habla de lo que pasa ahora o de lo que se hace siempre", "como el presente del español",
                 ["Di solito ceno alle nove (suelo cenar a las nueve).", "Adesso lavoro a Milano (ahora trabajo en Milán)."]],
    "imperfetto": ["describe cómo era algo o lo que pasaba seguido o mientras tanto en el pasado", "como el español «-aba / -ía» (jugaba, comía)",
                   ["Da bambino giocavo sempre in cortile (de chico jugaba siempre en el patio).", "Mentre cucinavo, ascoltavo la radio (mientras cocinaba, escuchaba la radio)."]],
    "futuro": ["dice lo que va a pasar (o una suposición: sarà vero)", "como el español «haré»",
               ["L'anno prossimo andrò in Italia (el año que viene voy a ir a Italia).", "Domani pioverà (mañana va a llover)."]],
    "condizionale": ["dice lo que haría, un deseo o un pedido amable", "como el español «-ría» (haría, podría)",
                     ["Vorrei un caffè, per favore (querría un café).", "Al tuo posto partirei (en tu lugar me iría)."]],
    "passato remoto": ["cuenta hechos lejanos o de un relato, ya cerrados", "como el pretérito de una narración («llegó, vio»)",
                       ["Dante nacque a Firenze nel 1265 (Dante nació en Florencia).", "Il re entrò e tutti si alzarono (el rey entró y todos se pararon)."]],
    "passato prossimo": ["cuenta un hecho terminado", "como el español «comí» o «he comido»",
                         ["Ieri ho visto Marco (ayer vi a Marco).", "Stamattina sono uscito presto (hoy a la mañana salí temprano)."]],
    "trapassato prossimo": ["cuenta algo que pasó antes que otro hecho del pasado", "como el español «había hecho»",
                            ["Quando sono arrivato, il film era già cominciato (cuando llegué, la película ya había empezado).", "Avevo già mangiato (ya había comido)."]],
    "futuro anteriore": ["dice algo que ya va a haber terminado antes de otro momento del futuro", "como el español «habré hecho»",
                         ["Quando avrai finito, usciamo (cuando hayas terminado, salimos).", "Alle otto sarò già arrivato (a las ocho ya habré llegado)."]],
    "condizionale passato": ["dice lo que habría pasado y no pasó, o el futuro visto desde el pasado", "como el español «habría hecho» o «dijo que vendría»",
                             ["Ha detto che sarebbe venuto (dijo que vendría).", "Sarei venuto, ma ero malato (habría ido, pero estaba enfermo)."]],
    "trapassato remoto": ["cuenta algo justo anterior a otro hecho de un relato (después de *appena, dopo che*)", "como el poco usado «hube hecho»",
                          ["Appena ebbe finito, uscì (apenas hubo terminado, salió).", "Dopo che fu partito, piovve (después de que se fue, llovió)."]],
    "congiuntivo presente": ["va después de lo que expresa opinión, deseo o duda (penso che, voglio che)", "como el subjuntivo «que haga»",
                             ["Penso che sia vero (creo que es verdad).", "Voglio che tu venga (quiero que vengas)."]],
    "congiuntivo imperfetto": ["es el subjuntivo cuando el verbo principal está en pasado o en condicional, y el de *se* en lo irreal", "como el español «hiciera»",
                               ["Volevo che tu venissi (quería que vinieras).", "Se avessi tempo, verrei (si tuviera tiempo, iría)."]],
    "congiuntivo passato": ["es el subjuntivo de algo ya ocurrido, con el verbo principal en presente", "como el español «haya hecho»",
                            ["Spero che tu abbia dormito bene (espero que hayas dormido bien).", "Penso che sia già partito (creo que ya se fue)."]],
    "congiuntivo trapassato": ["es el subjuntivo de algo anterior a un pasado, o la condición irreal del pasado", "como el español «hubiera hecho»",
                               ["Se avessi saputo, sarei venuto (si hubiera sabido, habría venido).", "Pensavo che fosse già arrivato (pensaba que ya había llegado)."]]
  };
  // The words of the sentence that say which time it is.
  var CLUES = [
    [/^(ieri|scorso|scorsa|scorsi|scorse|fa|stamattina|finalmente|appena)$/, "dice que ya pasó", ["passato prossimo", "passato remoto", "trapassato prossimo"]],
    [/^(mentre|spesso|sempre|solito|ogni|bambino|bambina|piccolo|piccola|allora)$/, "habla de algo habitual o de una descripción", ["imperfetto", "presente"]],
    [/^(domani|dopodomani|prossimo|prossima|prossimi|prossime|stasera|presto|tra|fra)$/, "habla del futuro", ["futuro", "futuro anteriore", "presente"]],
    [/^(adesso|ora|oggi|momento)$/, "habla del momento actual", ["presente", "passato prossimo"]],
    [/^(già)$/, "dice que algo ya estaba hecho", ["trapassato prossimo", "passato prossimo", "futuro anteriore"]]
  ];
  function tenseLayers(gForm, gName, eForm, eName, ctx) {
    var use = TENSE_USE[eName];
    if (!use) return null;
    var toks = ctx.e || [], here = ctx.ei;
    var clue = null;
    for (var c = 0; c < CLUES.length && !clue; c++) {
      if (CLUES[c][2].indexOf(eName) < 0) continue;
      for (var k = 0; k < toks.length; k++) if (k !== here && CLUES[c][0].test(toks[k])) {
        // the whole expression: di solito, da bambino, due anni fa, l'anno scorso
        var from = k, w0 = toks[k];
        if (/^(solito|bambino|bambina|piccolo|piccola|momento)$/.test(w0) && k > 0) from = k - 1;
        if (w0 === "momento" && toks[k - 2] === "in") from = k - 2;
        if (/^(scorso|scorsa|scorsi|scorse|prossimo|prossima|prossimi|prossime|fa)$/.test(w0) && k > 0) {
          from = k - 1;
          if (ARTICLES[toks[k - 2]] || /^(un|una|due|tre|quattro|cinque|dieci|qualche|pochi|poche|molti|molte)$/.test(toks[k - 2] || "")) from = k - 2;
        }
        if (/^(tra|fra)$/.test(w0) && !/^(un|una|due|tre|quattro|cinque|dieci|poco|qualche|pochi|poche|[0-9]+)$/.test(toks[k + 1] || "")) continue;
        var phrase = toks.slice(from, /^(tra|fra)$/.test(w0) ? k + 3 : k + 1).join(" ").replace(/' /g, "'");
        clue = { w: phrase, why: CLUES[c][1] }; break;
      }
    }
    // another verb of the sentence and its tense (the agreement of tenses)
    var other = null;
    if (!clue) {
      for (var j = 0; j < toks.length; j++) {
        if (j === here || j === here + 1 || j === here - 1 || toks[j] === toks[here] || eForm.split(" ").indexOf(toks[j]) >= 0) continue;
        var fj = verbForms(toks[j]).filter(function (x) { return x.lemma !== "essere" && x.lemma !== "avere" || !participleOf(toks[j + 1] || ""); });
        if (fj.length && !DATA.nouns[toks[j]] && !DATA.nounsByPlural[toks[j]] && !ARTICLES[toks[j - 1]] && !prepInfo(toks[j - 1])) {
          other = { w: toks[j], t: TENSE_ES[fj[0].tense] || fj[0].tense }; break;
        }
      }
    }
    var sentence = toks.join(" ");
    var ex = use[2].filter(function (x) { return sentence.indexOf(tokens(x.replace(/\s*\(.*$/, "")).join(" ")) < 0; })[0] || use[2][0];
    var what = it(gForm) + " es " + gName + "; acá va " + eName + ", " + it(eForm) + ": " + use[0];
    var why = clue ? ". La pista es " + it(clue.w) + ", que " + clue.why
            : other ? ". Fijate en " + it(other.w) + ", que está en " + other.t + ": los tiempos de la frase van de acuerdo" : "";
    var exIt = ex.replace(/\s*\(.*$/, ""), exEs = (/\(([^)]*)\)\.?$/.exec(ex) || [])[1];
    return { explain: what + why + ". Es " + use[1] + ". Por ejemplo: " + it(exIt) + (exEs ? " (" + exEs + ")" : "") + ".",
             hint: clue ? "Mirá " + it(clue.w) + ": ¿qué tiempo pide?" : other ? "Mirá el otro verbo, " + it(other.w) + ": ¿qué tiempo pide la frase?" : null };
  }

  function tenseRule(g, e, a, b, ctx) {
    var before = ctx.e.slice(0, ctx.ei).join(" ");
    var trigger = OPINION.filter(function (w) { return (" " + before + " ").indexOf(" " + w + " ") >= 0; })[0];
    // «prima che», «senza che»: the trigger is the whole conjunction.
    if (trigger && new RegExp("(^|\\s)" + trigger + " che(\\s|$)").test(before)) trigger += " che";
    // (the expected form decides: «se lo vedessi» is «if»)
    var seCond = /(^|\s)se(\s|$)/.test(before) && !/(^|\s)come se(\s|$)/.test(before);
    // An auxiliary before a participle names the compound tense (avevo
    // potuto = trapassato prossimo), not the auxiliary's own.
    // (over già, mai…: «era già cominciato»)
    var ppAt = ctx.ei + 1;
    while (ppAt < ctx.ei + 3 && /^(già|mai|ancora|appena|sempre|più|anche|proprio|davvero|finalmente|poi)$/.test(ctx.e[ppAt] || "")) ppAt++;
    var ppAfter = participleOf(ctx.e[ppAt] || "") && (AVERE.indexOf(e) >= 0 || ESSERE.indexOf(e) >= 0);
    var ppWords = ppAfter ? " " + ctx.e.slice(ctx.ei + 1, ppAt + 1).join(" ") : "";
    var COMPOUND = { presente: "passato prossimo", imperfetto: "trapassato prossimo", futuro: "futuro anteriore",
                     condizionale: "condizionale passato", congiuntivo: "congiuntivo passato",
                     congImperfetto: "congiuntivo trapassato", passatoRemoto: "trapassato remoto" };
    var name = function (t) { return ppAfter ? COMPOUND[t] || t : TENSE_ES[t] || t; };
    // A form the learner has not been taught yet: they got the ending of
    // the tense they know wrong (parta for parto, week 6).
    if (ctx.week != null && ctx.week < (TENSE_WEEK[b.tense] || 0) && (TENSE_WEEK[a.tense] || 0) <= ctx.week) {
      var ppW0 = ppWords;
      var lem0 = ppAfter ? participleOf(ctx.e[ppAt]) : a.lemma;
      return { cat: "persona_verbale", slip: false,
        hint: "Revisá la terminación del verbo.",
        explain: "Con *" + PERS_ES[a.p] + "* el " + name(a.tense) + " de " + it(lem0) + " es " + it(e + ppW0) + ". " +
          it(g + ppW0) + " es otra forma del verbo, que se ve más adelante: " + (ppAfter ? COMPOUND_ES : PLAIN_ES)[b.tense] + "." };
    }
    if (a.tense === "congImperfetto" && b.tense === "congiuntivo" && !seCond && !/(^|\s)come se(\s|$)/.test(before)) return { cat: "congiuntivo", slip: false,
      hint: "Mirá el tiempo del verbo principal: ¿presente o pasado?",
      explain: "El verbo principal está en pasado, así que el congiuntivo va en imperfetto: " + it(e) +
        ", no " + it(g) + ". Igual que en español: «quería que me lo dijeras», no «que me lo digas»." };
    if (a.tense === "congiuntivo" && b.tense === "congImperfetto" && !seCond) return { cat: "congiuntivo", slip: false,
      hint: "Mirá el tiempo del verbo principal: ¿presente o pasado?",
      explain: "El verbo principal está en presente, así que el congiuntivo va en presente: " + it(e) +
        ", no " + it(g) + ". Igual que en español: «quiero que venga», no «que viniera»." };
    if (a.tense === "congiuntivo" || a.tense === "congImperfetto") {
      if (/(^|\s)come se(\s|$)/.test(before)) return { cat: "congiuntivo", slip: false,
        hint: "Mirá lo que viene antes: *come se*. ¿Qué modo pide?",
        explain: "*Come se* (como si) va siempre con congiuntivo imperfetto o trapassato: " + it(e) +
          ". Como en español: «como si nada fuera», con subjuntivo." };
      if (seCond && a.tense === "congImperfetto") {
        return { cat: "periodo_ipotetico", slip: false,
          hint: "Es una condición con *se* sobre algo irreal: ¿qué modo va?",
          explain: "Condición irreal: después de *se* va el congiuntivo imperfetto, " + it(e) + ", y en la otra parte el condizionale: se avessi tempo, verrei. Como en español: «si tuviera tiempo, vendría»." };
      }
      return { cat: "congiuntivo", slip: false,
        hint: (trigger ? "Mirá lo que viene antes: " + it(trigger) + ". " : "") + "¿Qué modo pide?",
        explain: (trigger ? "Después de " + it(trigger) + " va congiuntivo" : "Acá va congiuntivo") +
          ": " + it(e) + ", no " + it(g) + ". Opinión, deseo, duda o emoción → congiuntivo; certeza → indicativo." +
          (trigger ? " En español también va subjuntivo ahí." : "") };
    }
    if (a.tense === "condizionale" && b.tense === "futuro") return { cat: "condizionale", slip: false,
      hint: "¿Futuro o condicional?",
      explain: "Condicional (-rei, -resti, -rebbe): " + it(e) + ", como en español «-ría». El futuro sería " + it(g) + "." };
    if (a.tense === "condizionale" && b.tense === "congImperfetto") return seCond ? { cat: "periodo_ipotetico", slip: false,
      hint: "Esta es la consecuencia, no la condición.",
      explain: "En la consecuencia va el condizionale (" + it(e) + "); el congiuntivo imperfetto va después de *se*: se potessi, verrei." }
      : { cat: "condizionale", slip: false,
      hint: "Para pedir o aconsejar con cortesía, ¿qué forma va?",
      explain: "Para pedir, aconsejar o desear con cortesía va el condicional: " + it(e) + " (como «podrías, deberías»). " +
        it(g) + " es congiuntivo imperfetto («pudieras»): solo va después de *se* o de un verbo que lo pida." };
    if (a.tense === "futuro" && (b.tense === "presente" || b.tense === "congiuntivo") &&
        /(^|\s)(quando|appena|finché|dopo che)$/.test(before)) return { cat: "tempo_verbale", slip: false,
      hint: "Es algo que va a pasar: ¿qué tiempo pide el italiano después de *" + before.split(" ").pop() + "*?",
      explain: "Después de *quando, appena*, para lo que va a pasar, el italiano usa el futuro: " + it(e) +
        " (ti chiamo quando arriverò). En español va subjuntivo («cuando llegue»); en italiano, no." };
    if (a.tense === "imperfetto" && b.tense === "passatoRemoto") return { cat: "tempo_verbale", slip: false,
      hint: "¿Acción puntual o descripción/hábito del pasado?",
      explain: "Para describir o contar lo habitual en el pasado va imperfetto: " + it(e) + ", como el español «-aba / -ía»." };
    if (a.tense === "presente" && b.tense === "congiuntivo" && !trigger && !/(^|\s)(che|perché)(\s|$)/.test(before)) return { cat: "persona_verbale", slip: false,
      hint: "Revisá la terminación del verbo.",
      explain: "Con *" + PERS_ES[a.p] + "* el presente de " + it(a.lemma) + " es " + it(e) + ". " + it(g) +
        " es congiuntivo, y acá nada lo pide (ni *che*, ni *penso che*, *spero che*…)." };
    if (a.tense === "presente" && b.tense === "congiuntivo") return { cat: "congiuntivo", slip: false,
      hint: "¿Hace falta el congiuntivo acá?",
      explain: /(^|\s)perché(\s\S+)?$/.test(before)
        ? "*Perché* + indicativo es «porque» (da una causa): " + it(e) + ". Con congiuntivo sería «para que»."
        : "Acá el hablante afirma un hecho: va indicativo, " + it(e) + ". El congiuntivo va con opinión, deseo o duda." };
    var ppW = ppWords;
    var lay = tenseLayers(g + ppW, name(b.tense), e + ppW, name(a.tense), ctx);
    return { cat: "tempo_verbale", slip: false,
      hint: (lay && lay.hint) || "El verbo es el correcto, pero no el tiempo. ¿Qué momento cuenta la frase: ahora, antes o después?",
      explain: lay ? lay.explain : it(g + ppW) + " es " + name(b.tense) + "; acá va " + name(a.tense) + ": " + it(e + ppW) + "." };
  }

  /* ----------------------------------------------- parole mancanti / in più */

  function missRule(w, ctx) {
    var next = ctx.e[ctx.ei + 1] || "", prev = ctx.e[ctx.ei - 1] || "";
    // «(non) lo so»: before a verb, lo / la / le / gli are pronouns.
    var beforeVerb = (verbForms(next).length || AVERE.indexOf(next) >= 0 || ESSERE.indexOf(next) >= 0) &&
      !DATA.nouns[next] && !DATA.nounsByPlural[next];
    if (ARTICLES[w] && !(CLITICS.indexOf(w) >= 0 && beforeVerb)) {
      if (POSSESSIVE.indexOf(next) >= 0) return { cat: "articolo_possessivo", slip: false,
        hint: "Falta una palabra antes del posesivo.",
        explain: "Con posesivos el italiano usa artículo: " + it(w + " " + next + " " + (ctx.e[ctx.ei + 2] || "")) +
          ". Solo se omite con familiares en singular: mia madre, tuo fratello." };
      if (ctx.names.indexOf(next) >= 0) return { cat: "articolo", slip: false,
        hint: "Falta el artículo: ¿es un país, una región o una ciudad?",
        explain: "Falta " + it(w) + ": los países, las regiones y los continentes llevan artículo (" + it(w + (w.slice(-1) === "'" ? "" : " ") + next.charAt(0).toUpperCase() + next.slice(1)) +
          ", la Toscana, l'Europa). Las ciudades no: Roma è bella, vado a Roma." };
      return { cat: "articolo", slip: false,
        hint: "Falta el artículo.",
        explain: "Falta " + it(w) + ": en italiano el sustantivo casi siempre lleva artículo, incluso donde el español lo omite (*la* mia casa = mi casa, *nel* 2020 = en 2020, *l'*Italia = Italia)." };
    }
    if (prepInfo(w)) {
      var pb = prepInfo(w).base, inf = isInfinitive(infBase(next));
      var pWhy = inf && pb === "a" ? "Delante de un infinitivo, verbos como *cominciare, imparare, riuscire, andare* piden *a* (comincio a studiare)."
        : inf && pb === "di" ? "Delante de un infinitivo, muchos verbos piden *di* (cerco di capire, ho deciso di partire), aunque en español no vaya nada («decidí partir»)."
        : inf && pb === "da" ? "*da* + infinitivo dice qué hay que hacer o para qué sirve algo (qualcosa da mangiare)."
        : BASE_USE[pb] ? BASE_USE[pb].charAt(0).toUpperCase() + BASE_USE[pb].slice(1) + "." : "";
      return { cat: "preposizione", slip: false,
        hint: "Falta una preposición.",
        explain: "Falta " + it(w) + (prev ? " después de " + it(prev) : "") + "." + (pWhy ? " " + pWhy : "") };
    }
    if (w === "ne") return { cat: "ci_ne", slip: false,
      hint: "Falta un pronombre chiquito que reemplaza una cantidad o «de eso».",
      explain: "Falta *ne*: reemplaza «de eso / de ellos» y se usa con cantidades: *ne* ho due, *ne* parliamo dopo." };
    if (w === "ci" && /^(sono|è|vuole|vogliono|vado|vai|va|andiamo|penso|pensi|metto)/.test(next)) return { cat: "ci_ne", slip: false,
      hint: "Falta *ci*.",
      explain: "Falta *ci*: *c'è / ci sono* = hay; *ci vuole* = hace falta; *ci vado* = voy (ahí)." };
    if (w === "ci" && next === "si") return { cat: "pronome", slip: false,
      hint: "Con un verbo reflexivo, ¿cómo se dice el «se» impersonal?",
      explain: "Con un verbo reflexivo, el «se» impersonal (uno se…) se dice *ci si*: in campagna ci si alza presto (en el campo uno se levanta temprano). *Si si* no existe." };
    var REFL_ES = { mi: "me levanté", ti: "te levantaste", si: "se levantó", ci: "nos levantamos", vi: "se levantaron" };
    var nextAux = ESSERE.indexOf(next) >= 0 && participleOf(ctx.e[ctx.ei + 2] || "");
    if (REFL_ES[w] && (nextAux || verbForms(next).some(function (x) { return /rsi$/.test(x.lemma); }))) return { cat: "pronome", slip: false,
      hint: "Falta un pronombre: el verbo es reflexivo.",
      explain: "Falta " + it(w) + ": el verbo es reflexivo y lleva el pronombre, como en español «" + REFL_ES[w] + "»: " +
        it(w + " " + next + (nextAux ? " " + ctx.e[ctx.ei + 2] : "")) + "." };
    if (CLITICS.indexOf(w) >= 0) return { cat: "pronome", slip: false,
      hint: "Falta un pronombre.",
      explain: "Falta el pronombre " + it(w) + (CLI_MEAN[w] ? ", " + CLI_MEAN[w] : "") + (verbForms(next).length ? ", que va antes del verbo " + it(next) : "") + "." };
    if ((AVERE.indexOf(w) >= 0 || ESSERE.indexOf(w) >= 0) && participleOf(next)) return { cat: "ausiliare", slip: false,
      hint: "Falta el auxiliar.",
      explain: "Los tiempos compuestos llevan auxiliar + participio: " + it(w + " " + next) + ", como el español «he comido»: el participio solo no alcanza." };
    if (w === "non") return { cat: "lessico", slip: false, hint: "Falta la negación.",
      explain: "Falta *non*: la negación va delante del verbo (non lo so = no lo sé). Y con *mai, niente, nessuno* después, igual va *non*: non ho visto niente." };
    if (w === "che") return { cat: "parola_mancante", slip: false,
      hint: "Falta la palabra que une las dos partes de la frase.",
      explain: "Falta *che*: une las dos partes de la frase (dice che viene, il libro che leggo) y no se puede omitir, igual que el «que» del español." };
    var gl = DATA.lex[w] ? String(DATA.lex[w]).split(/[;(]/)[0].trim() : "";
    return { cat: "parola_mancante", slip: false,
      hint: "Te falta una palabra" + (prev ? " después de " + it(prev) : "") + ".",
      explain: "Falta " + it(w) + (gl ? " («" + gl + "»)" : "") + (prev ? " después de " + it(prev) : "") + (gl ? ": sin ella la frase no dice lo mismo que la consigna." : ".") };
  }

  function extraRule(w, gtoks, gi, ctx) {
    var next = gtoks[gi + 1] || "", next2 = gtoks[gi + 2] || "", prevG = gtoks[gi - 1] || "";
    // «a me piace», «a loro manca»: the person with «a» is Italian too
    if (w === "a" && TONIC_CL[next]) {
      var vT = verbFrom(gtoks, gi + 2);
      if (vT && vT.f.some(function (x) { return IND_LIKE.test(x.lemma); })) return { ok: true, note: "" };
    }
    // «io ho», «noi siamo»: the verb already says who, and that is Italian too
    if (SUBJ_P[w] && !/^(anche|anch')$/.test(prevG)) {
      var vS = verbFrom(gtoks, gi + 1);
      var agrees = vS && vS.f.some(function (x) { return SUBJ_P[w].indexOf(x.p) >= 0; });
      if (agrees && /^(che|cosa|dove|come|quando|perché|chi|quanto|quanta|quanti|quante|quale|quali)$/.test(prevG) && gi > 0) return { cat: "ordine", slip: false,
        hint: "En una pregunta, ¿dónde va el pronombre?",
        explain: "En las preguntas, entre la palabra interrogativa y el verbo no va nada: " + it(prevG + " " + gtoks[vS.i]) +
          " (y el sujeto, si hace falta, al final o al principio: " + it(prevG + " " + gtoks[vS.i] + " " + w) + "?). En español pasa algo parecido: «¿qué dijiste vos?»." };
      if (agrees && (gi === 0 || SUBJ_BEFORE.test(prevG))) return { ok: true,
        note: "No hace falta " + it(w) + ": el verbo ya dice quién. Se pone para contrastar o destacar a la persona (io lavoro, tu no)." };
      if (vS && !agrees) return { cat: "persona_verbale", slip: false,
        hint: "¿El pronombre marcado va con ese verbo?",
        explain: it(w) + " no va con " + it(gtoks[vS.i]) + ": " + it(gtoks[vS.i]) + " es la forma de *" + PERS_ES[vS.f[0].p] + "*. Acá el verbo ya dice quién es, así que el pronombre sobra." };
    }
    // voglio di andare, posso a venire: after a modal the infinitive goes straight
    var modalBefore = verbForms(prevG).some(function (x) { return /^(volere|potere|dovere|sapere|preferire|desiderare|amare|osare)$/.test(x.lemma); }) ||
      /^(bisogna|piace|piacerebbe|conviene)$/.test(prevG);
    if (/^(di|a|de|da)$/.test(w) && modalBefore && isInfinitive(infBase(next))) return { cat: "preposizione", slip: false,
      hint: "Entre ese verbo y el infinitivo sobra algo.",
      explain: "Después de *volere, potere, dovere, sapere* (y de *preferire, bisogna, mi piace*) el infinitivo va directo, sin preposición: " +
        it(prevG + " " + next) + ", como en español «quiero ir», «puedo venir»." };
    if (w === "a" && next && !prepInfo(next) && !verbForms(next).length) {
      var person = /^[a-zàèìòù]+$/.test(next) && (FAMILY.indexOf(next) >= 0 || POSSESSIVE.indexOf(next) >= 0 ||
        /^(mio|mia|tuo|tua|suo|sua|lui|lei|te|me|nostro|nostra|quel|quella|questo|questa|il|la|gli|i|le)$/.test(next) ||
        ctx.names.indexOf(next) >= 0);
      if (person) return { cat: "a_personale", slip: false,
        hint: "Sobra una palabra que en español sí se pone.",
        explain: "En italiano el objeto directo de persona no lleva «a»: conosco Giulia, ho visto mia madre, aspetto Marco." };
    }
    if (ARTICLES[w] && POSSESSIVE.indexOf(next) >= 0 && FAMILY.indexOf(next2) >= 0) return { cat: "articolo_possessivo", slip: false,
      hint: "Con este posesivo sobra algo.",
      explain: "Con familiares en singular el posesivo va sin artículo: *" + next + " " + next2 + "*. Pero sí va en plural o con diminutivo: *i miei genitori, la mia sorellina*." };
    if (SUBJECTS.indexOf(w) >= 0) return { cat: "soggetto", slip: true,
      hint: "No hace falta el pronombre sujeto.",
      explain: "No hace falta " + it(w) + ": el verbo ya dice quién. Se pone para contrastar o destacar a la persona (io lavoro, tu no)." };
    if (ARTICLES[w] && ctx.names.indexOf(next) >= 0) return { cat: "articolo", slip: false,
      hint: "Sobra el artículo: ¿es una ciudad o una persona?",
      explain: "Las ciudades y los nombres de persona van sin artículo: Roma è bella, vado a Roma, Marco è qui. Los países y las regiones sí lo llevan: l'Italia, la Sicilia." };
    if (ARTICLES[w]) {
      var why0 = /^(casa)$/.test(next) && /^(a|in|da)$/.test(prevG)
        ? "*casa*, cuando es el hogar propio, va sin artículo: vado a casa, sono in casa, torno da casa (como «voy a casa»)."
        : prevG === "in" && next
        ? "Con *in* muchos lugares y medios de transporte van sin artículo: in ufficio, in banca, in centro, in macchina, in treno (en español, «en la oficina», «en el auto»)."
        : /^(italiano|spagnolo|inglese|francese|tedesco|portoghese)$/.test(next) && verbForms(prevG).some(function (x) { return x.lemma === "parlare"; })
        ? "Después de *parlare* el idioma va sin artículo: parlo italiano (hablo italiano)."
        : prevG === "di" && /^(sera|mattina|notte|giorno|pomeriggio|domenica|lunedì|sabato)$/.test(next)
        ? "*di* + momento del día va sin artículo: di sera, di mattina, di notte (a la noche, a la mañana)."
        : /^(mio|mia|tuo|tua|suo|sua|nostro|nostra|vostro|vostra)$/.test(next) && FAMILY.indexOf(next2) >= 0
        ? "Con familiares en singular el posesivo va sin artículo: *" + next + " " + next2 + "*."
        : "Hay expresiones que en italiano van sin artículo aunque en español lo lleven (a casa, in ufficio, di sera, a scuola).";
      return { cat: "articolo", slip: false,
        hint: "Sobra el artículo.",
        explain: "Acá no va artículo: sobra " + it(w) + ". " + why0 };
    }
    if (DATA.esIt[deaccent(w)] && !isItalian(w)) return { cat: "parola_spagnola", slip: false,
      hint: it(w) + " es español.",
      explain: it(w) + " es español y acá sobra." };
    if (!isItalian(w) && looksSpanish(w)) return { cat: "parola_spagnola", slip: false,
      hint: it(w) + " parece español.",
      explain: it(w) + " no es italiano y acá sobra." };
    if (w === "che" && /^(perché|quando|dove|come|se)$/.test(prevG)) return { cat: "parola_in_piu", slip: false,
      hint: "Sobra una palabra.",
      explain: "Sobra *che*: después de " + it(prevG) + " no va (" + prevG + " vieni?, " + prevG + " arrivo), como en español no se dice «cuando que»." };
    return { cat: "parola_in_piu", slip: false,
      hint: "Sobra una palabra.",
      explain: "Sobra " + it(w) + (DATA.lex[w] && !ARTICLES[w] ? " («" + String(DATA.lex[w]).split(/[;(]/)[0].trim() + "»)" : "") + ": la frase italiana no la necesita" +
        (prevG ? " después de " + it(prevG) : "") + "." };
  }

  /* ------------------------------------------------------ diagnose */

  var SEVERITY = {
    ausiliare: 9, congiuntivo: 9, periodo_ipotetico: 9, a_personale: 8,
    preposizione: 8, preposizione_articolata: 8, persona_verbale: 8,
    tempo_verbale: 8, condizionale: 8, irregolare: 8, participio_accordo: 7,
    genere: 7, accordo: 7, articolo: 7, articolo_possessivo: 7, plurale: 7,
    pronome: 7, posizione_pronome: 7, ci_ne: 7, parola_spagnola: 6,
    falso_amico: 6, lessico: 5, parola_mancante: 5, parola_in_piu: 4,
    ordine: 6, ortografia: 4, doppie: 4, accento: 2, soggetto: 1, refuso: 1
  };

  var LABEL = {
    grammatica: "Gramática",
    ia: "Corrección de la IA",
    ausiliare: "Auxiliar essere/avere", congiuntivo: "Congiuntivo",
    periodo_ipotetico: "Periodo hipotético", a_personale: "«a» personal",
    preposizione: "Preposiciones", preposizione_articolata: "Preposición + artículo",
    persona_verbale: "Persona del verbo", tempo_verbale: "Tiempo verbal",
    condizionale: "Condicional", irregolare: "Verbos irregulares",
    participio_accordo: "Concordancia del participio", genere: "Género de los sustantivos",
    accordo: "Concordancia", articolo: "Artículos", articolo_possessivo: "Artículo con posesivos",
    plurale: "Plurales", pronome: "Pronombres", posizione_pronome: "Lugar del pronombre",
    ci_ne: "ci y ne", parola_spagnola: "Palabras del español", falso_amico: "Falsos amigos",
    lessico: "Vocabulario", parola_mancante: "Palabras que faltan", parola_in_piu: "Palabras de más",
    ordine: "Orden de las palabras", ortografia: "Ortografía", doppie: "Dobles consonantes",
    accento: "Tildes", soggetto: "Sujeto innecesario", refuso: "Tipeo"
  };

  function names(s) {
    return (String(s).match(/\b[A-ZÀ-Ý][a-zà-ÿ]+/g) || []).map(function (w) { return w.toLowerCase(); });
  }

  // Verbs that are interchangeable in everyday Italian.
  var SYN = [["finire", "terminare"], ["cominciare", "iniziare"], ["rimanere", "restare"],
             ["tornare", "ritornare"], ["mandare", "inviare", "spedire"], ["continuare", "proseguire"],
             ["chiedere", "domandare"]];
  function synFamily(lemma) {
    for (var i = 0; i < SYN.length; i++) if (SYN[i].indexOf(lemma) >= 0) return i;
    return -1;
  }
  // Everyday words that mean the same (singular, plural).
  var NSYN = [["papà", "padre"], ["papà", "babbo"], ["mamma", "madre"], ["giacca", "giubbotto"], ["giacche", "giubbotti"],
              ["macchina", "auto", "automobile"], ["macchine", "auto", "automobili"], ["bici", "bicicletta"],
              ["biciclette", "bici"], ["televisione", "tv", "tivù"], ["cellulare", "telefonino"], ["cellulari", "telefonini"],
              ["adesso", "ora"], ["tra", "fra"], ["niente", "nulla"], ["qui", "qua"], ["lì", "là"], ["subito", "immediatamente"],
              ["molto", "tanto"], ["molti", "tanti"], ["molta", "tanta"], ["molte", "tante"]];
  function nounSyn(a, b) {
    return NSYN.some(function (f) { return f.indexOf(a) >= 0 && f.indexOf(b) >= 0; });
  }
  // The article agrees with the word the learner chose (l'auto, la macchina).
  function artFits(art, noun) {
    var n = DATA.nouns[noun] || DATA.nounsByPlural[noun];
    var plural = !!(DATA.nounsByPlural[noun] && n && n.pl === noun && n.s !== noun);
    if (plural) return n.g === "f" ? art === "le" : /^(s[^aeiou]|z|gn|ps|x|y|[aeiouàèéìòù])/.test(noun) ? art === "gli" : art === "i";
    if (/^[aeiouàèéìòù]/.test(noun)) return art === "l'";
    if (!n) return art !== "l'";
    if (n.g === "f") return art === "la";
    return /^(s[^aeiou]|z|gn|ps|x|y)/.test(noun) ? art === "lo" : art === "il";
  }
  var MODAL_PP = ["potuto", "voluto", "dovuto", "potuta", "voluta", "dovuta", "potuti", "voluti", "dovuti", "potute", "volute", "dovute"];
  function auxOf(w) {
    return verbForms(w).filter(function (x) { return x.lemma === "avere" || x.lemma === "essere"; })[0] || null;
  }
  // With avere the participle stays in -o; with essere it takes the number
  // of the auxiliary (sono potuto/a, siamo potuti/e).
  function modalPpOk(aux, pp) {
    var a = auxOf(aux);
    if (!a) return false;
    if (a.lemma === "avere") return /o$/.test(pp);
    return a.p >= 3 ? /[ie]$/.test(pp) : /[oa]$/.test(pp);
  }
  function modalAuxOk(g, e, i) {
    var ag = auxOf(g[i]), ae = auxOf(e[i]);
    if (!ag || !ae || ag.lemma === ae.lemma || ag.tense !== ae.tense || ag.p !== ae.p) return false;
    if (MODAL_PP.indexOf(e[i + 1]) < 0 || !g[i + 1] || g[i + 1].slice(0, -1) !== e[i + 1].slice(0, -1)) return false;
    if (!modalPpOk(g[i], g[i + 1])) return false;
    // essere only when the infinitive goes with essere (sono dovuto partire,
    // not *sono dovuto lavorare)
    var inf = String(e[i + 2] || "").replace(/(mi|ti|si|ci|vi|lo|la|li|le|ne|gli)$/, "e").replace(/ee$/, "e");
    var info = null;
    try { info = Conj && Conj.info(inf); } catch (err) { info = null; }
    // mi sono potuto sposare, not *mi ho potuto; ha dovuto riposarsi, not
    // *è dovuto riposarsi (the pronoun before the auxiliary asks for essere)
    var reflBefore = /^(mi|ti|si|ci|vi)$/.test(g[i - 1] || "");
    if (ag.lemma === "avere" && reflBefore) return false;
    if (ag.lemma === "essere") {
      if (/r(mi|ti|si|ci|vi)$/.test(e[i + 2] || "") || /r(mi|ti|si|ci|vi)$/.test(g[i + 2] || "")) return false;
      if (!(reflBefore || (info && (info.aux === "essere" || info.aux === "both" || info.refl)))) return false;
    }
    return true;
  }

  function synonymFree(g, e) {
    if (g.length !== e.length) return false;
    var diff = 0;
    for (var i = 0; i < e.length; i++) {
      if (g[i] === e[i]) continue;
      if (nounSyn(g[i], e[i]) && (!ARTICLES[g[i - 1]] || artFits(g[i - 1], g[i]))) { diff++; continue; }
      // la macchina / l'auto: the article follows the synonym
      if (ARTICLES[g[i]] && ARTICLES[e[i]] && g[i + 1] && e[i + 1] && g[i + 1] !== e[i + 1] &&
          nounSyn(g[i + 1], e[i + 1]) && artFits(g[i], g[i + 1])) { diff++; continue; }
      // non ho potuto venire = non sono potuto venire: a modal takes either
      // auxiliary when the infinitive after it goes with essere; the same
      // tense and person, and the participle agreeing with its auxiliary.
      if (modalAuxOk(g, e, i)) { diff++; continue; }
      // (only when the auxiliary changed too: the same auxiliary with another
      // ending is the speaker's gender, and genderFree decides that)
      if (MODAL_PP.indexOf(g[i]) >= 0 && MODAL_PP.indexOf(e[i]) >= 0 && g[i].slice(0, -1) === e[i].slice(0, -1) && g[i - 1] !== e[i - 1] &&
          (AVERE.indexOf(g[i - 1]) >= 0 || ESSERE.indexOf(g[i - 1]) >= 0) && modalPpOk(g[i - 1], g[i])) { diff++; continue; }
      var fg = verbForms(g[i]), fe = verbForms(e[i]);
      var pg = participleOf(g[i]), pe = participleOf(e[i]);
      var ok = fe.some(function (a) {
        var fam = synFamily(a.lemma);
        return fam >= 0 && fg.some(function (b) {
          return b.lemma !== a.lemma && synFamily(b.lemma) === fam && b.tense === a.tense && b.p === a.p;
        });
      });
      // participles: sono rimasto / sono restato (same ending)
      if (!ok && pg && pe && pg !== pe && synFamily(pg) >= 0 && synFamily(pg) === synFamily(pe) &&
          g[i].slice(-1) === e[i].slice(-1)) ok = true;
      if (!ok) return false;
      diff++;
    }
    return diff > 0;
  }

  var CLOSED = ["io", "tu", "noi", "voi", "loro", "sono", "è", "ieri", "oggi", "domani", "anche", "non", "ma", "e",
    "poi", "adesso", "ora", "qui", "così", "sempre", "mai", "già", "ancora", "forse", "quando", "se", "che", "come",
    "perché", "dopo", "prima", "stamattina", "stasera", "stanotte", "finalmente", "purtroppo", "davvero", "molto", "troppo",
    "tanto", "tutto", "ci", "mi", "ti", "si", "vi", "ne", "ecco"];
  var GENDER_FIXERS = ["lui", "lei", "la", "lo", "li", "le", "l'", "gli", "esso", "essa", "essi", "esse"];
  var COPULA = /^(sono|sei|è|siamo|siete|ero|eri|era|eravamo|eravate|erano|sarò|sarai|sarà|saremo|sarete|saranno|sarei|saresti|sarebbe|saremmo|sareste|sarebbero|sia|siano|fossi|fosse|essere|esser|stato|stata|stati|state|sto|stai|sta|stiamo|stanno|stavo|stavi|stava|sembro|sembri|sembra|sembrano|divento|diventi|diventa|diventato|diventata|rimasto|rimasta|resto|resti|resta|rimango|rimani|rimane|sento|senti|sente)$/;
  var PRED_ADV = /^(molto|così|tanto|troppo|più|meno|sempre|già|proprio|davvero|mai|ancora|poi|anche|non|bene|un po'|abbastanza|piuttosto|finalmente|appena)$/;
  // The gender a word shows by its ending (-o/-i masculine, -a/-e feminine),
  // for adjectives and participles only.
  function gendered(w) {
    if (!w || !(DATA.adj[w] || participleOf(w)) || DATA.adj[w] === w.replace(/[oaie]$/, "e")) return null;
    var v = w.slice(-1);
    return v === "o" ? "ms" : v === "i" ? "mp" : v === "a" ? "fs" : v === "e" ? "fp" : null;
  }
  function genderFree(g, e, target, ctx) {
    if (g.length !== e.length) return false;
    // The prompt names who it is: «(Él) se habría quedado».
    var stem = String(ctx && ctx.stem || "");
    if (/(^|[^a-záéíóúñ])(él|ellos|ella|ellas)([^a-záéíóúñ]|$)/i.test(stem)) return false;
    // Italian words of the sentence around a gap that already show a gender
    // («Sono contento di ___»), or the learner's own words that keep the
    // expected one («Ero stanca che mi sono addormentato»).
    var around = /_{3,}/.test(stem) ? tokens(stem.replace(/\([^)]*\)/g, " ")) : [];
    var named = names(String(target).replace(/^\s*\S+/, ""));
    var first = e[0];
    if (/^\s*[A-ZÀ-Ý]/.test(String(target)) && !DATA.lex[first] && !verbForms(first).length &&
        CLOSED.indexOf(first) < 0) named.push(first);
    var isNoun = function (w) { return !!(w && (DATA.nouns[w] || DATA.nounsByPlural[w] || named.indexOf(w) >= 0)); };
    var diff = 0;
    for (var i = 0; i < e.length; i++) {
      if (g[i] === e[i]) continue;
      var a = g[i], b = e[i];
      if (a.length < 3 || a.slice(0, -1) !== b.slice(0, -1)) return false;
      var pair = a.slice(-1) + b.slice(-1);
      if (["oa", "ao", "ie", "ei"].indexOf(pair) < 0) return false;
      // felice / felici, probabile / probabili: -e adjectives change number, not gender
      if (/^(ie|ei)$/.test(pair) && /e$/.test(DATA.adj[b] || "")) return false;
      if (!DATA.adj[b] && !participleOf(b)) return false;
      if (isNoun(e[i + 1]) || ARTICLES[e[i + 1]] || ARTICLES[e[i - 1]]) return false;
      if (isNoun(e[i + 2]) && !/^(di|a|da|in|con|su|per|tra|fra)$/.test(e[i + 1]) && !prepInfo(e[i + 1])) return false;
      for (var k = 0; k < i; k++) if (isNoun(e[k]) || GENDER_FIXERS.indexOf(e[k]) >= 0) return false;
      // Only a predicate (sono stanca, è arrivata, sei pronta?): after avere
      // a participle does not agree, and after another verb the word is not
      // about the speaker (parli italiano).
      var cop = COPULA.test(e[i - 1] || "") ? e[i - 1] : PRED_ADV.test(e[i - 1] || "") && COPULA.test(e[i - 2] || "") ? e[i - 2] : null;
      if (!cop) return false;
      // a named subject anywhere (Sono andati, Marco e Lorenzo?)
      if (named.some(function (n) { return e.indexOf(n) >= 0; })) return false;
      // about someone else («È sposato» for «Estará casado»): the Spanish prompt fixes the gender
      var third = verbForms(cop).concat(verbForms(e[i - 2] || "")).some(function (x) { return x.p === 2 || x.p === 5; }) || /^(è|era|sarà|sarebbe|sia|fosse|stato|stata)$/.test(cop);
      if (third && stem && !/_{3,}/.test(stem) && tokens(stem).some(spanishish)) return false;
      var gb = gendered(b);
      var clash = function (w) { var x = gendered(w); return x && gb && x[1] === gb[1] && x[0] === gb[0]; };
      for (var m = 0; m < e.length; m++) if (m !== i && g[m] === e[m] && clash(e[m])) return false;
      if (around.some(clash)) return false;
      diff++;
    }
    return diff > 0;
  }

  /* ------------------------------------------- otras formas válidas

     Lo que un italiano también diría y el modelo no trae: el sujeto
     explícito (*io ho*), *anche io* por *anch'io*, el adverbio de tiempo al
     final o al principio, sinónimos comunes (*però*, *tanto*, *qua*, *fra*,
     *acquistare*), cifras por números escritos, *a me piace*, el posesivo
     detrás (*al posto mio*), *di* + infinitivo por *che* + verbo, el futuro
     por el presente para un plan con fecha…  Las dos respuestas se llevan a
     una forma canónica y se comparan; lo que difiere queda como nota
     («aceptable»), o como «poco natural» cuando vale pero hay una forma más
     cuidada.  Nunca es error ni desliz (Ferris 1999: separar el error del
     estilo). */

  var NUM_UNI = ["zero", "uno", "due", "tre", "quattro", "cinque", "sei", "sette", "otto", "nove", "dieci", "undici", "dodici",
                 "tredici", "quattordici", "quindici", "sedici", "diciassette", "diciotto", "diciannove"];
  var NUM_DEC = ["", "", "venti", "trenta", "quaranta", "cinquanta", "sessanta", "settanta", "ottanta", "novanta"];
  function numWord(n) {
    if (n < 20) return NUM_UNI[n];
    if (n < 100) {
      var t = NUM_DEC[Math.floor(n / 10)], u = n % 10;
      if (u === 1 || u === 8) t = t.slice(0, -1);
      return t + (u === 3 ? "tré" : u ? NUM_UNI[u] : "");
    }
    if (n < 1000) { var h = Math.floor(n / 100), r = n % 100; return (h > 1 ? NUM_UNI[h] : "") + "cento" + (r ? numWord(r) : ""); }
    var m = Math.floor(n / 1000), r2 = n % 1000;
    return (m > 1 ? numWord(m) + "mila" : "mille") + (r2 ? numWord(r2) : "");
  }
  var TENS_ELIDED = /^(vent|trent|quarant|cinquant|sessant|settant|ottant|novant)'$/;

  // One word for another, both everyday Italian: [variant, canonical, the note].
  var WORD_EQ = dict({
    "però": ["ma", "*però* y *ma* valen los dos («pero»); *però* suena un poco más enfático."],
    qua: ["qui", "*qua* y *qui* son lo mismo («acá»)."],
    "là": ["lì", "*là* y *lì* son lo mismo («allá, ahí»)."],
    fra: ["tra", "*fra* y *tra* son lo mismo: se elige la que suene mejor (fra tre giorni, tra fratelli)."],
    nulla: ["niente", "*nulla* y *niente* son lo mismo («nada»)."],
    dottore: ["medico", "*dottore* también vale: así se le dice al médico."],
    dottori: ["medici", "*dottori* también vale: así se les dice a los médicos."],
    ora: ["adesso", "*ora* y *adesso* son lo mismo («ahora»)."],
    tanto: ["molto", "*tanto* y *molto* valen los dos acá; *molto* es un poco más neutro."],
    tanta: ["molta", "*tanta* y *molta* valen las dos acá; *molta* es un poco más neutro."],
    tanti: ["molti", "*tanti* y *molti* valen los dos acá; *molti* es un poco más neutro."],
    tante: ["molte", "*tante* y *molte* valen las dos acá; *molte* es un poco más neutro."]
  });
  // Verbs that say the same thing: the first one is the canonical form.
  var VERB_EQ = [["comprare", "acquistare", "*acquistare* también vale: es un poco más formal que *comprare*.", "comprar, adquirir"],
                 ["cominciare", "iniziare", "*iniziare* y *cominciare* son lo mismo («empezar»)."],
                 ["finire", "terminare", "*terminare* y *finire* son lo mismo («terminar»)."],
                 ["rimanere", "restare", "*restare* y *rimanere* son lo mismo («quedarse»)."],
                 ["tornare", "ritornare", "*ritornare* y *tornare* son lo mismo («volver»)."],
                 ["mandare", "inviare", "*inviare* y *mandare* son lo mismo («mandar»).", "enviar, mandar"],
                 ["mandare", "spedire", "*spedire* y *mandare* valen los dos («mandar», por correo)."],
                 ["continuare", "proseguire", "*proseguire* y *continuare* son lo mismo («seguir»)."],
                 ["chiedere", "domandare", "*domandare* y *chiedere* son lo mismo («preguntar, pedir»)."]];
  if (Conj) VERB_EQ.forEach(function (x) { try { Conj.register(x[1], { aux: "avere", es: x[3] || "" }); } catch (e) { /* */ } });
  function verbEq(lemma) {
    for (var i = 0; i < VERB_EQ.length; i++) if (VERB_EQ[i][1] === lemma) return VERB_EQ[i];
    return null;
  }
  var SUBJ_P = { io: [0], tu: [1], lui: [2], lei: [2], noi: [3], voi: [4], loro: [5] };
  var SUBJ_BEFORE = /^(e|ma|però|che|perché|quando|se|poi|così|mentre|invece|allora|dove|come|quindi)$/;
  var TIME_ANCHOR = /^(oggi|domani|ieri|stasera|stamattina|stanotte|adesso|dopodomani|sera|mattina|pomeriggio|notte|settimana|mese|anno|anni|estate|inverno|primavera|autunno|weekend|solito|giorni|giorno|lunedì|martedì|mercoledì|giovedì|venerdì|sabato|domenica|spesso|volte|tanto|mattino)$/;
  var TIME_TOK = /^(oggi|domani|ieri|stasera|stamattina|stanotte|adesso|dopodomani|sera|mattina|pomeriggio|notte|settimana|mese|anno|anni|estate|inverno|primavera|autunno|weekend|solito|giorni|giorno|lunedì|martedì|mercoledì|giovedì|venerdì|sabato|domenica|spesso|volte|tanto|mattino|scorso|scorsa|prossimo|prossima|ogni|tutti|tutte|i|il|la|l'|le|di|d'|in|a|questa|questo|quest'|fine|al|alla|nel|nella|fa|due|tre|qualche)$/;
  function timeBlock(t) {
    return t.length > 0 && t.length <= 4 && t.every(function (w) { return TIME_TOK.test(w); }) && t.some(function (w) { return TIME_ANCHOR.test(w); }) &&
      !/^(di|a|la|il|le|i|in|fa)$/.test(t[t.length - 1]) && !(t.length === 1 && t[0] === "tanto");
  }
  var FUT_MARK = /(^| )(domani|dopodomani|stasera|più tardi|prossimo|prossima|prossimi|prossime|(tra|fra) (un|una|due|tre|poco|qualche|\d+)|stanotte)( |$)/;
  var TONIC_CL = { me: "mi", te: "ti", lui: "gli", lei: "le", noi: "ci", voi: "vi", loro: "gli" };
  var IND_LIKE = /^(piacere|mancare|interessare|servire|bastare|sembrare|dispiacere|succedere|capitare|importare|costare|convenire|parere|telefonare|dire|scrivere|dare|mandare|rispondere|chiedere|regalare|spiegare|raccontare|mostrare|portare|prestare|offrire|insegnare)$/;
  var SAYISH = /^(detto|dice|disse|dicono|dissero|diceva|pensa|penso|pensava|pensavo|crede|credo|credeva|credevo|spera|spero|sperava|sperano|ha|sembra|sembrava|promesso|promise|scritto|scrisse|giurato|ammesso|confessato|sostiene|afferma|dichiarato)$/;
  var SAID_PAST = /(^| )(disse|detto|diceva|scritto|scrisse|pensava|pensavo|credeva|credevo|sapeva|sapevo|promesso|promise|risposto|rispose|immaginavo|immaginava|sperava|speravo) che$/;

  function finiteAt(t, i) {
    var w = t[i];
    if (!w) return null;
    if (AVERE.indexOf(w) >= 0 || ESSERE.indexOf(w) >= 0) return verbForms(w).filter(function (x) { return x.lemma === "avere" || x.lemma === "essere"; });
    // after a pronoun «dai», «la» are verbs or pronouns, not a preposition or an article
    var afterClitic = i > 0 && (CLITICS.indexOf(t[i - 1]) >= 0 || COMBINED.indexOf(t[i - 1]) >= 0);
    if (!afterClitic && (DATA.nouns[w] || DATA.nounsByPlural[w] || ARTICLES[w] || prepInfo(w))) return null;
    // after an article or a preposition it is a noun (alle sei, il lavoro)
    if (!afterClitic && i > 0 && (ARTICLES[t[i - 1]] || prepInfo(t[i - 1]) || (POSSESSIVE.indexOf(t[i - 1]) >= 0 && t[i - 1] !== "loro") || DETERMINERS.test(t[i - 1]))) return null;
    var f = verbForms(w);
    return f.length ? f : null;
  }
  // The first finite verb from i on, over «non», pronouns and adverbs.
  function verbFrom(t, i) {
    for (var k = i; k < t.length && k < i + 5; k++) {
      var w = t[k];
      if (w === "non" || CLITICS.indexOf(w) >= 0 || COMBINED.indexOf(w) >= 0 || /^(già|mai|sempre|ancora|anche|proprio|davvero|solo|pure|spesso|ne)$/.test(w)) continue;
      var f = finiteAt(t, k);
      return f ? { i: k, f: f } : null;
    }
    return null;
  }

  // The canonical form of an answer, and what was normalised to get there.
  function canonical(t, raw, ctx) {
    var out = [], marks = [];
    var noDigits = ctx && ctx.numbersDrill;
    for (var i = 0; i < t.length; i++) {
      var w = t[i], prev = out[out.length - 1] || "", next = t[i + 1] || "";
      // numbers: 32 = trentadue, trent'anni = trenta anni
      if (/^\d{1,4}$/.test(w) && !noDigits && +w <= 9999 && +w !== 1) {
        out.push(numWord(+w)); marks.push({ k: "cifra", from: w, to: numWord(+w) }); continue;
      }
      var te = TENS_ELIDED.exec(w);
      if (te) { out.push(te[1] + (te[1] === "vent" ? "i" : "a")); continue; }
      // elisions that are optional: anch'io / anche io, com'è / come è
      if (w === "anch'") { out.push("anche"); marks.push({ k: "elision", from: "anch'" + next, to: "anche " + next }); continue; }
      if (w === "com'" || w === "dov'") { out.push(w === "com'" ? "come" : "dove"); marks.push({ k: "elision", from: w + next, to: (w === "com'" ? "come " : "dove ") + next }); continue; }
      if ((w === "questo" || w === "questa") && /^[aeiouàèéìòù]/.test(next)) { out.push("quest'"); marks.push({ k: "elision", from: w + " " + next, to: "quest'" + next }); continue; }
      if ((w === "quello" || w === "quella") && /^[aeiouàèéìòù]/.test(next)) { out.push("quell'"); marks.push({ k: "elision", from: w + " " + next, to: "quell'" + next }); continue; }
      // in questo momento = adesso
      if (w === "in" && next === "questo" && t[i + 2] === "momento" && !(ctx && ctx.gap)) {
        out.push("adesso"); marks.push({ k: "syn", from: "in questo momento", to: "adesso",
          note: "*in questo momento* también vale («en este momento»); *adesso* es más corto." });
        i += 2; continue;
      }
      var eq = ctx && ctx.gap ? null : WORD_EQ[w];
      if (eq) {
        var skip = false;
        if (w === "però") {
          // «ma» that means «sino» (non è rosso ma blu) is no «però»
          var after = t.slice(i + 1, i + 4);
          skip = t.slice(0, i).indexOf("non") >= 0 && after.length > 0 && !after.some(function (x) { return x === "non" || CLITICS.indexOf(x) >= 0 || finiteAt([x], 0); });
        }
        if (w === "ora") skip = !!(ARTICLES[prev] || prepInfo(prev) || /^(che|quale|ogni|un'|mezz'|quest'|all'|dell'|nell'|sull'|è|di|prima|dopo|alcune|poche|tante|molte|due|tre|quattro)$/.test(prev) || next === "di" || next === "e");
        if (/^tant[oaie]$/.test(w)) skip = /^(di|ogni|per)$/.test(prev) || /^(che|più|meno)$/.test(next) ||
          t.slice(i + 1).some(function (x) { return /^quant[oaie]$/.test(x); });
        if (!skip) { out.push(eq[0]); marks.push({ k: "syn", from: w, to: eq[0], note: eq[1] }); continue; }
      }
      // acquistare = comprare, terminare = finire, in the same person and tense
      var inf0 = /^(.+[aei]r)(e|lo|la|li|le|ne|mi|ti|si|ci|vi|gli)$/.exec(w), ve0 = ctx && ctx.gap ? null : verbEq(w) || (inf0 && verbEq(inf0[1] + "e"));
      if (ve0) {
        var cinf = ve0[0].replace(/e$/, "") + (w === ve0[1] ? "e" : inf0[2]);
        out.push(cinf); marks.push({ k: "syn", from: w, to: cinf, note: ve0[2] }); continue;
      }
      var vf = ctx && ctx.gap ? [] : verbForms(w), done = false;
      for (var q = 0; q < vf.length && !done; q++) {
        var ve = verbEq(vf[q].lemma);
        if (!ve) continue;
        try {
          var cf = Conj.conjugate(ve[0], vf[q].tense)[vf[q].p].split(" ").pop();
          out.push(cf); marks.push({ k: "syn", from: w, to: cf, note: ve[2] }); done = true;
        } catch (err) { /* */ }
      }
      if (done) continue;
      var pl = participleOf(w), pe0 = pl && !(ctx && ctx.gap) && verbEq(pl);
      if (pe0) {
        try {
          var cp = Conj.participle(pe0[0]).replace(/o$/, w.slice(-1));
          out.push(cp); marks.push({ k: "syn", from: w, to: cp, note: pe0[2] }); continue;
        } catch (err2) { /* */ }
      }
      // piccolino = piccolo (the diminutive of an adjective)
      var dm = /^(.{3,})in([oaie])$/.exec(w);
      if (dm && !(ctx && ctx.gap) && !DATA.lex[w] && DATA.adj[dm[1] + dm[2]]) {
        out.push(dm[1] + dm[2]);
        marks.push({ k: "syn", from: w, to: dm[1] + dm[2], note: it(w) + " es el diminutivo de " + it(dm[1] + dm[2]) + ": vale, con un tono más afectivo." });
        continue;
      }
      out.push(w);
    }
    return { t: out, marks: marks };
  }

  // Subject pronouns the verb already says (io ho, noi siamo): the list
  // without them and the ones taken out.
  function dropSubjects(t) {
    var out = [], gone = [];
    for (var i = 0; i < t.length; i++) {
      var w = t[i], p = SUBJ_P[w];
      if (p && (i === 0 || SUBJ_BEFORE.test(t[i - 1] || "")) && !/^(anche|anch')$/.test(t[i - 1] || "")) {
        var v = verbFrom(t, i + 1);
        if (v && v.f.some(function (x) { return p.indexOf(x.p) >= 0; })) { gone.push(w); continue; }
      }
      out.push(w);
    }
    return { t: out, gone: gone };
  }

  function same(a, b) { return a.length === b.length && a.join(" ") === b.join(" "); }

  // Structural alternatives: [name, level, fn(g, e) → note or null]
  function timeMoved(g, e) {
    if (g.length !== e.length || g.slice().sort().join(" ") !== e.slice().sort().join(" ")) return null;
    for (var k = 1; k <= 4 && k < e.length; k++) {
      var a = e.slice(0, k), b = e.slice(-k);
      if (timeBlock(a) && same(g, e.slice(k).concat(a))) return it(a.join(" ").replace(/' /g, "'")) + " también puede ir al final: el italiano mueve bastante las expresiones de tiempo. Al principio es lo más neutro; al final pone el acento en " + it(a.join(" ").replace(/' /g, "'")) + ".";
      if (timeBlock(b) && same(g, b.concat(e.slice(0, -k)))) return it(b.join(" ").replace(/' /g, "'")) + " también puede ir al principio: el italiano mueve bastante las expresiones de tiempo.";
    }
    return null;
  }
  function possAfter(g, e) {
    if (g.length !== e.length) return null;
    for (var i = 1; i < e.length - 1; i++) {
      if (g[i] === e[i]) continue;
      var artIn = ARTICLES[g[i - 1]] ? g[i - 1] : prepInfo(g[i - 1]) && prepInfo(g[i - 1]).art;
      if (POSSESSIVE.indexOf(e[i]) >= 0 && artIn && artFits(artIn, g[i]) && g[i] === e[i + 1] && g[i + 1] === e[i] &&
          (DATA.nouns[e[i + 1]] || DATA.nounsByPlural[e[i + 1]] || /^(posto|parte|colpa)$/.test(e[i + 1])) &&
          same(g.slice(0, i), e.slice(0, i)) && same(g.slice(i + 2), e.slice(i + 2))) {
        return it(g[i - 1] + " " + g[i] + " " + g[i + 1]) + " también vale: el posesivo detrás del sustantivo es más enfático o más de la charla (casa mia, colpa mia). En el modelo: " + it(e[i - 1] + " " + e[i] + " " + e[i + 1]) + ".";
      }
      return null;
    }
    return null;
  }
  function aTonic(g, e) {
    for (var i = 0; i < g.length - 1; i++) {
      if (g[i] !== "a" || !TONIC_CL[g[i + 1]]) continue;
      var rest = g.slice(0, i).concat(g.slice(i + 2));
      var v = verbFrom(rest, i);
      if (!v) return null;
      var lem = v.f.map(function (x) { return x.lemma; });
      var ppl = participleOf(rest[v.i + 1] || "");
      if (!lem.concat([ppl]).some(function (l) { return IND_LIKE.test(l || ""); })) return null;
      var at = v.i;
      while (at > i && (rest[at - 1] === "non" ? false : CLITICS.indexOf(rest[at - 1]) >= 0)) at--;
      var cands = [TONIC_CL[g[i + 1]]].concat(g[i + 1] === "loro" ? ["gli"] : []);
      for (var c = 0; c < cands.length; c++) {
        var cand = rest.slice(0, at).concat([cands[c]], rest.slice(at));
        if (same(cand, e)) return it("a " + g[i + 1]) + " también vale: *a* + pronombre (a me, a te, a loro) pone el acento en la persona. Lo más común es " + it(cands[c] + " " + rest[at]) + ", como el español «le gusta».";
      }
    }
    return null;
  }
  function diInf(g, e) {
    for (var i = 1; i < g.length - 1; i++) {
      if (g[i] === e[i]) continue;
      if (g[i] !== "di" || e[i] !== "che" || !SAYISH.test(g[i - 1]) || !same(g.slice(0, i), e.slice(0, i))) return null;
      var inf = g[i + 1], base = /r$/.test(inf) ? inf + "e" : inf;
      if (!isInfinitive(base) && !/^(essere|avere)$/.test(base)) return null;
      var fe = finiteAt(e, i + 1);
      if (!fe || !fe.some(function (x) { return x.lemma === base; })) return null;
      if (!same(g.slice(i + 2), e.slice(i + 2))) return null;
      return it("di " + inf) + " también vale: cuando el sujeto es el mismo, después de *dire, pensare, credere, sperare* el italiano prefiere *di* + infinitivo (ha detto di essere stanca = dijo que estaba cansada).";
    }
    return null;
  }
  function futPres(g, e, ctx) {
    if (g.length !== e.length) return null;
    var diff = -1;
    for (var i = 0; i < g.length; i++) if (g[i] !== e[i]) { if (diff >= 0) return null; diff = i; }
    if (diff < 0 || !FUT_MARK.test(e.join(" "))) return null;
    if (/^(quando|appena|finché|se|che)$/.test(e[diff - 1] || "") || /(^| )(quando|appena|se)( |$)/.test(e.join(" "))) return null;
    var fg = verbForms(g[diff]), fe = verbForms(e[diff]);
    var pair = null;
    fg.forEach(function (a) { fe.forEach(function (b) {
      if (!pair && a.lemma === b.lemma && a.p === b.p && ((a.tense === "futuro" && b.tense === "presente") || (a.tense === "presente" && b.tense === "futuro"))) pair = [a, b];
    }); });
    if (!pair) return null;
    return pair[0].tense === "futuro"
      ? "El futuro (" + it(g[diff]) + ") también vale. Para un plan con fecha (domani, stasera) el italiano usa mucho el presente, como el español «mañana voy»: " + it(e[diff]) + "."
      : "El presente (" + it(g[diff]) + ") también vale para un plan con fecha, como el español «mañana voy». En el modelo, el futuro: " + it(e[diff]) + ".";
  }
  function imperfFutPast(g, e) {
    if (g.length !== e.length - 1) return null;
    for (var i = 0; i < g.length; i++) {
      if (g[i] === e[i]) continue;
      var aux = e[i], pp = e[i + 1];
      var af = verbForms(aux).filter(function (x) { return (x.lemma === "essere" || x.lemma === "avere") && x.tense === "condizionale"; });
      var lem = participleOf(pp);
      if (!af.length || !lem || !SAID_PAST.test(e.slice(0, i).join(" "))) return null;
      var gf = verbForms(g[i]).filter(function (x) { return x.lemma === lem && x.tense === "imperfetto" && af.some(function (a) { return a.p === x.p; }); });
      if (!gf.length || !same(g.slice(i + 1), e.slice(i + 2))) return null;
      return "En la charla se oye " + it(g[i]) + ", pero lo cuidado es " + it(aux + " " + pp) + ": el futuro visto desde el pasado va en condizionale passato, donde el español dice «dijo que llegaría».";
    }
    return null;
  }
  // Two adjectives or two nouns glossed with the same Spanish word
  // (carina / bella: «lindo»), same gender and number.
  function glossKey(s) {
    return String(s || "").toLowerCase().split(/\s*[\/,;()]\s*/).map(function (x) {
      return deaccent(x.trim()).replace(/(os|as|es|o|a|e)$/, "");
    }).filter(function (x) { return x.length >= 4 && !/\s/.test(x); });
  }
  function glossSyn(a, b) {
    if (a === b || lexConfusion(a, b) || DATA.falsi[a] || sameVerb(a, b)) return false;
    var adjA = DATA.adj[a], adjB = DATA.adj[b];
    var nA = DATA.nouns[a] || DATA.nounsByPlural[a], nB = DATA.nouns[b] || DATA.nounsByPlural[b];
    // the gender and number an adjective form shows (felice: only the number)
    var gn = function (w, lem) {
      var v = w.slice(-1);
      if (/e$/.test(lem)) return v === "e" ? "?s" : v === "i" ? "?p" : null;
      return v === "o" ? "ms" : v === "a" ? "fs" : v === "i" ? "mp" : v === "e" ? "fp" : null;
    };
    if (adjA && adjB) {
      if (adjA === adjB) return false;
      var xa = gn(a, adjA), xb = gn(b, adjB);
      if (!xa || !xb || xa[1] !== xb[1] || (xa[0] !== "?" && xb[0] !== "?" && xa[0] !== xb[0])) return false;
    } else if (nA && nB && !adjA && !adjB) {
      if (nA === nB || nA.g !== nB.g || (nA.pl === a && nA.s !== a) !== (nB.pl === b && nB.s !== b)) return false;
    } else return false;
    var ka = glossKey(DATA.lex[a]), kb = glossKey(DATA.lex[b]);
    return ka.some(function (x) { return kb.indexOf(x) >= 0; });
  }
  function glossed(g, e) {
    if (g.length !== e.length) return null;
    var diffs = [];
    for (var i = 0; i < g.length; i++) {
      if (g[i] === e[i]) continue;
      if (!glossSyn(g[i], e[i])) return null;
      if (ARTICLES[g[i - 1]] && !artFits(g[i - 1], g[i]) && (DATA.nouns[g[i]] || DATA.nounsByPlural[g[i]])) return null;
      diffs.push(i);
    }
    if (!diffs.length || diffs.length > 2) return null;
    var i0 = diffs[0];
    return it(g[i0]) + " también vale («" + String(DATA.lex[g[i0]]).split(/[\/,;]/)[0].trim() + "»); en el modelo: " + it(e[i0]) + ".";
  }
  var STRUCT = [["orden", "aceptable", timeMoved], ["posesivo", "aceptable", possAfter], ["a_me", "aceptable", aTonic],
                ["di_inf", "aceptable", diInf], ["futuro", "aceptable", futPres], ["condizionale", "poco_natural", imperfFutPast],
                ["glosa", "aceptable", glossed]];

  // The note for what was normalised on one side and not on the other.
  function markNotes(G, E) {
    var notes = [];
    var key = function (m) { return m.k + "|" + m.from; };
    var inE = {}, inG = {};
    E.marks.forEach(function (m) { inE[key(m)] = 1; });
    G.marks.forEach(function (m) { inG[key(m)] = 1; });
    G.marks.forEach(function (m) {
      if (inE[key(m)]) return;
      if (m.k === "cifra") notes.push("En cifras también vale (" + it(m.from) + "); en letras es " + it(m.to) + ".");
      else if (m.k === "elision") notes.push("Las dos formas valen: " + it(m.from.replace(/' /g, "'")) + " y " + it(m.to) + ".");
      else if (m.note) notes.push(m.note);
    });
    E.marks.forEach(function (m) {
      if (inG[key(m)] || m.k === "cifra") return;
      if (m.k === "elision") notes.push("Las dos formas valen: " + it(m.to) + " y " + it(m.from.replace(/' /g, "'")) + ".");
      else if (m.note) notes.push(m.note);
    });
    return notes.filter(function (n, i, a) { return a.indexOf(n) === i; });
  }

  /* Another valid way of saying the target: {level, note, natural} or null. */
  function equivalent(g, target, ctx) {
    var e = tokens(target);
    if (!g.length || !e.length) return null;
    var G = canonical(g, null, ctx), E = canonical(e, null, ctx);
    var dg = dropSubjects(G.t), de = dropSubjects(E.t);
    // the pronoun the learner added (io ho) is worth a note; the one they left out, nothing
    var extraS = dg.gone.filter(function (w) { return de.gone.indexOf(w) < 0 && E.t.indexOf(w) < 0; });
    var lessS = de.gone.filter(function (w) { return dg.gone.indexOf(w) < 0 && G.t.indexOf(w) < 0; });
    // one pronoun for another (lei / lui) is not «the verb already says it»
    if (extraS.length && lessS.length) return null;
    var gt = dg.t, et = de.t;
    var notes = markNotes(G, E);
    var subjNote = extraS.length ? "No hace falta " + it(extraS[0]) + ": el verbo ya dice quién. Se pone para contrastar o destacar a la persona (" +
      (extraS[0] === "io" ? "io lavoro, tu no" : extraS[0] + " sì, gli altri no") + ")." : null;
    if (same(gt, et)) {
      if (subjNote) notes.unshift(subjNote);
      // (the pronoun left out, or the same word on both sides: simply right)
      return { level: notes.length ? "aceptable" : "correcto", note: notes.join(" ") || null, natural: target };
    }
    for (var s = 0; s < STRUCT.length; s++) {
      // a gap asks for one form (the tense, the word in parentheses): only
      // the order and the person can differ there
      if (ctx && ctx.gap && /^(futuro|glosa|di_inf|condizionale)$/.test(STRUCT[s][0])) continue;
      if (ctx && ctx.tenseAsked && /^(futuro|condizionale|di_inf)$/.test(STRUCT[s][0])) continue;
      var n = STRUCT[s][2](gt, et, ctx);
      if (n) {
        if (subjNote) notes.unshift(subjNote);
        notes.push(n);
        return { level: STRUCT[s][1], note: notes.join(" "), natural: target, kind: STRUCT[s][0] };
      }
    }
    return null;
  }

  /* Contrazioni non fatte: "a il" → al, "de il" → del … */
  function uncontracted(gtoks, etoks) {
    for (var i = 0; i < gtoks.length - 1; i++) {
      var p = gtoks[i] === "de" ? "di" : gtoks[i] === "en" ? "in" : gtoks[i];
      var c = PREP_BASE[p] && ARTICLES[gtoks[i + 1]] && contract(p, gtoks[i + 1]);
      if (c && etoks.indexOf(c) >= 0) {
        return { i: i, form: c,
          d: { cat: "preposizione_articolata", slip: false,
            hint: "Dos palabras marcadas se tienen que fundir en una.",
            explain: "*" + p + " + " + gtoks[i + 1] + "* se contrae: " + it(c) +
              ". En italiano la contracción es obligatoria con todas estas preposiciones (al, del, dal, nel, sul)." } };
      }
    }
    return null;
  }

  // Where the pronoun is glued, with what the learner has been taught.
  function gluedForms(week, de) {
    var a = de ? "del " : "el ";
    var f = [a + "infinitivo"];
    if (week == null || week >= 12) f.push(a + "imperativo (tu, noi, voi)");
    if (week == null || week >= 44) f.push(a + "gerundio");
    return f.join(", ") + (de ? " y de *ecco*" : " y *ecco*");
  }
  function gluedExamples(week) {
    return ["vederti", "eccolo"].concat(week == null || week >= 12 ? ["alzati", "dimmi"] : [], week == null || week >= 44 ? ["facendolo"] : []).join(", ");
  }

  function clitMoved(g, e) {
    if (g.length !== e.length) return null;
    for (var i = 0; i < g.length; i++) {
      if (CLITICS.indexOf(g[i]) < 0 || g[i] === e[i]) continue;
      for (var j = 0; j < e.length; j++) {
        if (j === i || !(e[j] === g[i] || (e[j] === "l'" && /^(lo|la)$/.test(g[i])))) continue;
        var g2 = g.slice(0, i).concat(g.slice(i + 1)), e2 = e.slice(0, j).concat(e.slice(j + 1));
        var nx = e[j + 1] || "";
        if (g2.join(" ") === e2.join(" ") && (verbForms(nx).length || AVERE.indexOf(nx) >= 0 || ESSERE.indexOf(nx) >= 0 || CLITICS.indexOf(nx) >= 0)) {
          return { gi: i, ej: j, shown: e.slice(j, j + 3).join(" ").replace(/' /g, "'") };
        }
      }
    }
    return null;
  }

  /* Two pronouns written apart that Italian glues (gli lo → glielo, le la →
     gliela, se lo → glielo, lo gli → glielo). */
  function splitCombined(g, e) {
    for (var i = 0; i < g.length - 1; i++) {
      var a = g[i], b = g[i + 1], x = null;
      if (/^(gli|le|se)$/.test(a) && /^(lo|la|li|le|ne|l')$/.test(b)) x = b;
      else if (/^(lo|la|li|le|ne)$/.test(a) && b === "gli") x = a;
      if (!x) continue;
      var forms = x === "l'" ? ["gliel'"] : /^(lo|la)$/.test(x) ? ["glie" + x, "gliel'"] : ["glie" + x];
      for (var f = 0; f < forms.length; f++) {
        if (e.indexOf(forms[f]) >= 0 && g.indexOf(forms[f]) < 0) return { i: i, form: forms[f], se: a === "se" };
      }
    }
    return null;
  }

  /* Why the order is not the Italian one, for the usual swaps. */
  function orderWhy(g, e) {
    for (var k = 0; k < e.length - 1; k++) {
      if (g[k] === e[k]) continue;
      var a = e[k], b = e[k + 1];
      if (ARTICLES[a] && POSSESSIVE.indexOf(b) >= 0) return {
        hint: "Mirá dónde va el artículo con el posesivo.",
        explain: "El artículo va antes del posesivo: " + it(e.slice(k, k + 3).join(" ")) + ", aunque en español el posesivo vaya sin artículo («mi casa» = la mia casa)." };
      if ((AVERE.indexOf(a) >= 0 || ESSERE.indexOf(a) >= 0) && participleOf(b)) return {
        hint: "Mirá el orden del auxiliar y el participio.",
        explain: "El auxiliar va antes del participio, como en español: " + it(a + " " + b) + "." };
      if (/^(già|mai|ancora|appena|sempre|più|anche|proprio|davvero|mica|finalmente)$/.test(a) && participleOf(b) &&
          (AVERE.indexOf(e[k - 1]) >= 0 || ESSERE.indexOf(e[k - 1]) >= 0)) return {
        hint: "Mirá dónde va el adverbio en el tiempo compuesto (auxiliar + participio).",
        explain: it(a) + " va entre el auxiliar y el participio: " + it(e[k - 1] + " " + a + " " + b) + " (ho già mangiato = ya comí; non sono mai stato = nunca fui)." };
      if (participleOf(a) && /^(già|mai|ancora|appena|sempre|più)$/.test(g[k])) return {
        hint: "Mirá dónde va el adverbio en el tiempo compuesto (auxiliar + participio).",
        explain: it(g[k]) + " va entre el auxiliar y el participio: " + it(e[k - 1] + " " + g[k] + " " + a) + "." };
      if ((DATA.nouns[a] || DATA.nounsByPlural[a]) && ESSERE.indexOf(b) >= 0) return {
        hint: "Mirá dónde va el verbo.",
        explain: "El sujeto va entero antes del verbo: " + it(e.slice(Math.max(0, k - 2), k + 3).join(" ")) + ", como en español." };
      if (/^(molto|sempre|già|mai|ancora|spesso|anche|proprio|davvero|troppo|poco|bene|male)$/.test(b) && g[k] === b &&
          (verbForms(a).length || AVERE.indexOf(a) >= 0 || ESSERE.indexOf(a) >= 0)) return {
        hint: "Mirá dónde va el adverbio.",
        explain: it(b) + " va después del verbo: " + it(a + " " + b) + ", como en español «es muy», «voy siempre»." };
      if (g[k] === b && g[k + 1] === a) return {
        hint: "Hay dos palabras que van al revés.",
        explain: "Estas dos palabras van al revés: " + it(a + " " + b) + ", no " + it(b + " " + a) + ". " + orderReason(a, b) };
      break;
    }
    return null;
  }

  /* Why a goes before b, by the kind of word: the rule, and whether Spanish
     does the same. */
  var PRE_ADJ = /^(bello|bella|belli|belle|bel|buono|buona|buoni|buone|buon|grande|grandi|gran|piccolo|piccola|piccoli|piccole|nuovo|nuova|nuovi|nuove|vecchio|vecchia|vecchi|vecchie|altro|altra|altri|altre|primo|prima|primi|prime|ultimo|ultima|ultimi|ultime|stesso|stessa|stessi|stesse|caro|cara|cari|care|brutto|brutta|lungo|lunga|breve|vero|vera)$/;
  function orderReason(a, b) {
    var noun = function (w) { return !!(DATA.nouns[w] || DATA.nounsByPlural[w]); };
    var verb = function (w) { return !!(verbForms(w).length || AVERE.indexOf(w) >= 0 || ESSERE.indexOf(w) >= 0) && !noun(w); };
    if (a === "non") return "*non* va justo antes del verbo y de sus pronombres (non lo so, non ci vado), como el «no» del español.";
    if (/^(dove|come|quando|cosa|chi|quanto|quanta|quanti|quante|perché|quale|quali|che)$/.test(a) && verb(b))
      return "En las preguntas la palabra interrogativa va primero y el verbo enseguida (dove vai? = ¿adónde vas?), como en español.";
    if (/^(anche|pure|neanche|nemmeno|solo|soltanto)$/.test(a)) return it(a) + " va delante de la palabra a la que se refiere (anche io = yo también, solo oggi = solo hoy).";
    if (CLITICS.indexOf(a) >= 0 && verb(b)) return "El pronombre va antes del verbo conjugado, como en español «lo veo»: " + it(a + " " + b) + ".";
    if (ARTICLES[a] || POSSESSIVE.indexOf(a) >= 0 || DETERMINERS.test(a) || /^(due|tre|quattro|cinque|sei|sette|otto|nove|dieci|cento|mille)$/.test(a))
      return "El artículo y las palabras como *questo, mio, ogni, due* van antes del sustantivo, igual que en español.";
    if (prepInfo(a)) return "La preposición va delante de la palabra que introduce, igual que en español.";
    if (noun(a) && DATA.adj[b] && !PRE_ADJ.test(b)) return "Casi todos los adjetivos van después del sustantivo, como en español (una macchina rossa = un auto rojo). Antes van pocos y cortos: bello, buono, grande, piccolo, nuovo, vecchio.";
    if (PRE_ADJ.test(a) && noun(b)) return it(a) + " es de los adjetivos cortos que suelen ir antes del sustantivo (un bel posto, una grande città, la prima volta), como «un buen amigo» en español.";
    if (/^(più|meno|molto|così|tanto|troppo|poco|abbastanza)$/.test(a) && (DATA.adj[b] || participleOf(b))) return it(a) + " va antes del adjetivo, como en español «más alto», «muy bueno».";
    if (verb(a) && (noun(b) || ARTICLES[b] || prepInfo(b))) return "Lo que completa al verbo va después de él, como en español: primero " + it(a) + ", después lo demás.";
    if (noun(a) && verb(b)) return "El sujeto va antes del verbo, como en español.";
    return "El italiano sigue casi siempre el orden del español: sujeto, verbo y lo demás.";
  }

  var ENCLITICS = ["glielo", "gliela", "glieli", "gliele", "gliene", "melo", "mela", "telo", "tela",
                   "cene", "vene", "sene", "gli", "lo", "la", "li", "le", "ne", "mi", "ti", "ci", "vi", "si"];

  function enclitic(g, e) {
    // quele scarpe le compro / quelle scarpe le compro: a double consonant, not
    // a clitic out of place.
    if (degeminate(g.join(" ")) === degeminate(e.join(" "))) return null;
    for (var i = 0; i < e.length; i++) {
      var w = e[i];
      if (g.indexOf(w) >= 0) continue;
      for (var k = 0; k < ENCLITICS.length; k++) {
        var c = ENCLITICS[k];
        if (w.length <= c.length + 2 || w.slice(-c.length) !== c) continue;
        var base = w.slice(0, -c.length);
        var bases = [base, base + "e", base.replace(/(.)\1$/, "$1"), base + "i"];
        var clitics = [c, c === "lo" || c === "la" ? "l'" : c, c.replace(/^glie/, "gli")];
        for (var bi = 0; bi < g.length; bi++) {
          if (bases.indexOf(g[bi]) < 0) continue;
          var near = [g[bi - 1], g[bi + 1]];
          if (near.some(function (x) { return x && (clitics.indexOf(x) >= 0 || x === c.slice(0, 2)); })) return w;
        }
      }
    }
    return null;
  }

  var PAST_MARK = /^(ieri|scorso|scorsa|fa|stamattina|stamani|stanotte|appena|già|mai|finalmente|poco)$/;
  // The compound tense an auxiliary in each simple tense makes.
  var COMPOUND_NAME = { presente: "passato prossimo", imperfetto: "trapassato prossimo", futuro: "futuro anteriore",
                        condizionale: "condizionale passato", congiuntivo: "congiuntivo passato",
                        congImperfetto: "congiuntivo trapassato", passatoRemoto: "trapassato remoto" };
  var SAID = /(^|\s)(disse|ha detto|aveva detto|diceva|ha scritto|scrisse|pensava|credeva|sapeva|ha promesso|promise|ha risposto|rispose) che(\s|$)/;
  function count(arr, w) { return arr.filter(function (x) { return x === w; }).length; }
  function compoundSwap(g, e) {
    for (var i = 0; i < g.length; i++) {
      if (e.indexOf(g[i]) >= 0) continue;
      var fg = verbForms(g[i]);
      if (!fg.length || participleOf(g[i])) continue;   // partite/partiti: agreement
      var js = [];
      for (var j0 = 1; j0 < e.length; j0++) js.push(j0);
      js.sort(function (x, y) { return Math.abs(x - i) - Math.abs(y - i); });
      for (var jj = 0; jj < js.length; jj++) {
        var j = js[jj];
        var lems = participleLemmas(e[j]);
        var aux = e[j - 1];
        if (!lems.length || count(g, e[j]) >= count(e, e[j]) || (AVERE.indexOf(aux) < 0 && ESSERE.indexOf(aux) < 0)) continue;
        var f = fg.filter(function (x) { return lems.indexOf(x.lemma) >= 0; })[0];
        if (!f) continue;
        var both = it(aux + " " + e[j]);
        var mark = e.filter(function (w) { return PAST_MARK.test(w); })[0];
        var said = SAID.test(e.slice(0, j).join(" "));
        // the compound tense the auxiliary makes (sarebbe arrivata is no passato prossimo)
        var auxT = (verbForms(aux).filter(function (x) { return x.lemma === "avere" || x.lemma === "essere"; })[0] || {}).tense;
        var compName = COMPOUND_NAME[auxT] || "passato prossimo";
        var pp = compName === "passato prossimo";
        var lay = tenseLayers(g[i], TENSE_ES[f.tense] || f.tense, aux + " " + e[j], compName, { e: e, ei: j - 1 });
        return { gi: i, ei: [j - 1, j],
          hint: f.tense === "imperfetto" && pp ? "¿Es un hecho que pasó y terminó, o una descripción?"
              : said && (f.tense === "condizionale" || auxT === "condizionale") ? "Es el futuro de alguien, contado en pasado: ¿qué forma va?"
              : (lay && lay.hint) || "Acá va un tiempo compuesto (auxiliar + participio).",
          explain: f.tense === "passatoRemoto" && pp
            ? "Para algo de hoy o de un pasado que sentís cercano, el italiano usa el passato prossimo: " + both + ". El passato remoto (" + it(g[i]) + ") queda para lo lejano o narrado. En el español del Río de la Plata se dice «comí» para los dos; en italiano, *ho mangiato* es lo de todos los días."
            : said && (f.tense === "condizionale" || auxT === "condizionale")
            ? "En el discurso indirecto, lo que era futuro se dice con el condizionale passato: " + both + " (disse che sarebbe venuto), donde el español dice «dijo que vendría»." +
              (f.tense === "imperfetto" ? " En la charla también se oye el imperfetto (" + it(g[i]) + "), pero por escrito va " + both + "." : "")
            : f.tense === "condizionale"
            ? "Para lo que habría pasado va el condicional compuesto: " + both + " (como «habría»)."
            : f.tense === "imperfetto" && pp
            ? "Para un hecho puntual y terminado va el passato prossimo: " + both + ", como el pretérito del español («comí», «fuimos»). En cambio " + it(g[i]) + ", el imperfetto, describe o cuenta lo habitual, como «comía»."
            : f.tense === "presente" && mark && pp
            ? "Es algo que ya pasó (" + it(mark) + "): va el passato prossimo, " + both + ", como el español «comí, fui». " + it(g[i]) + " es presente."
            : lay ? lay.explain : "Acá va " + both + " (auxiliar + participio), no " + it(g[i]) + "." };
      }
    }
    // The other way round: a compound tense where a simple one goes (studio qui da due anni)
    for (var a = 0; a < g.length - 1; a++) {
      if ((AVERE.indexOf(g[a]) >= 0 || ESSERE.indexOf(g[a]) >= 0) && participleOf(g[a + 1]) &&
          count(e, g[a + 1]) < count(g, g[a + 1])) {
        var lemsG = participleLemmas(g[a + 1]);
        for (var b = 0; b < e.length; b++) {
          var fe = verbForms(e[b]).filter(function (x) { return lemsG.indexOf(x.lemma) >= 0; });
          if (fe.length && count(g, e[b]) < count(e, e[b]) && lemsG.indexOf(participleOf(e[b])) < 0) {
            var daTime = /(^|\s)da(\s|$)/.test(e.join(" "));
            var impf = fe.some(function (x) { return x.tense === "imperfetto"; });
            return { gi: a + 1, ei: [b],
              hint: daTime ? "Mirá el *da* + tiempo: ¿la acción terminó o sigue?"
                  : impf ? "¿Es un hecho terminado o una descripción de cómo era algo?" : "Acá no hace falta un tiempo compuesto.",
              explain: daTime
                ? "Con *da* + tiempo, para algo que empezó y sigue, el italiano usa el presente: " + it(e[b]) + " (studio qui da due anni = hace dos años que estudio acá)."
                : impf
                ? "Para describir cómo era o estaba algo en el pasado va el imperfetto: " + it(e[b]) + ", como el español «era, estaba, tenía». El passato prossimo (" + it(g[a] + " " + g[a + 1]) + ") cuenta un hecho terminado."
                : (function () {
                    var gT = (verbForms(g[a]).filter(function (x) { return x.lemma === "avere" || x.lemma === "essere"; })[0] || {}).tense;
                    var lay2 = tenseLayers(g[a] + " " + g[a + 1], COMPOUND_NAME[gT] || "un tiempo compuesto", e[b], TENSE_ES[fe[0].tense], { e: e, ei: b });
                    return lay2 ? lay2.explain : "Acá va " + it(e[b]) + " (" + TENSE_ES[fe[0].tense] + "), no el tiempo compuesto.";
                  })() };
          }
        }
      }
    }
    return null;
  }

  // The cost of turning one token list into the other (align's metric).
  function alignCost(g, e) {
    var n = g.length, m = e.length, prev = [], cur, i, j;
    for (j = 0; j <= m; j++) prev[j] = j;
    for (i = 1; i <= n; i++) {
      cur = [i];
      for (j = 1; j <= m; j++) {
        var sub = g[i - 1] === e[j - 1] ? 0 : subCost(g[i - 1], e[j - 1]);
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + sub);
      }
      prev = cur;
    }
    return prev[m];
  }

  // The accepted answer nearest to what was written: the fewest and
  // smallest edits («Andiamo di Marco» → «da Marco», not «a casa di Marco»),
  // then the most words in common.
  function pickTarget(given, expected) {
    var g = tokens(given), best = null, bestScore = -Infinity;
    expected.forEach(function (x) {
      var t = tokens(x);
      // the same words in another order is one error (the order), not two
      var cost = g.join(" ") === t.join(" ") ? 0 : g.slice().sort().join(" ") === t.slice().sort().join(" ") ? 0.9 : alignCost(g, t);
      var s = -cost + lcsLen(g, t) * 0.01;
      if (s > bestScore) { bestScore = s; best = x; }
    });
    return best;
  }

  var FILLER_CORE = /^(boh|bho|mah|ehm|uhm|mmm|nose|idk|qsy|nidea)$/;
  var FILLER = /^(boh|bho|mah|ehm|uhm|mmm|nose|idk|qsy|nidea|no|non|lo|so|sé|se|sò|ni|idea|nada|niente|\?+)$/;
  /* The level of what was written (P2 of the 2026-09 audit):
       correcto      the answer, or the same with the learner's own gender
       aceptable     another valid way of saying it: right, with a note
       poco_natural  right, but there is a more careful form: right, with a note
       desliz        a slip (accent, typo, apostrophe): «Casi»
       incorrecto    an error
     With aceptable and poco_natural, res.note says why (with *italics*) and
     res.natural is the model's version. */
  function diagnose(given, expected, ctx) {
    var r = diagnose0(given, expected, ctx);
    if (r.verdict !== "giusto") r.level = r.verdict === "quasi" ? "desliz" : "incorrecto";
    else if (!r.level) r.level = "correcto";
    return r;
  }
  function diagnose0(given, expected, ctx) {
    ctx = ctx || {};
    // A translation into Spanish (ctx.dir «it-es», as the item says):
    // the learner writes Spanish, and Italian rules have nothing to say.
    var listEs = (Array.isArray(expected) ? expected : [expected]).filter(Boolean);
    if (listEs.length && ctx.dir === "it-es") return spanishAnswer(given, listEs);
    var list = (Array.isArray(expected) ? expected : [expected]).filter(Boolean);
    var list0 = list.slice(), rawGiven = given;
    var rawG = tokens(given);
    var target0 = pickTarget(given, list) || list[0];   // what the exercise asked for, without the sentence around the gap
    var exp = expandGap(ctx.stem, given, list);
    if (exp) { given = exp.given; list = exp.targets; }
    var isolated = !exp && (String(ctx.stem || "").match(/_{3,}/g) || []).length >= 2;
    var target = pickTarget(given, list);
    var g = tokens(given), e = tokens(target);
    var res = { cat: null, slip: false, hint: "", explain: "", target: target,
                given: g.map(function (w) { return { w: w }; }),
                fixed: e.map(function (w) { return { w: w }; }), others: 0, all: [] };

    // «boh», «mah», «no sé»: the learner says they do not know.
    var fillers = rawG.filter(function (t) { return FILLER.test(t); });
    if (rawG.length && fillers.length === rawG.length && rawG.some(function (t) { return FILLER_CORE.test(t); }) &&
        !tokens(target0).some(function (t) { return FILLER_CORE.test(t); })) g = [];
    if (!g.length) {
      res.verdict = "sbagliato"; res.cat = "vuoto";
      res.hint = rawG.length ? "Si no lo sabés, probá igual o pedí las fichas 🧩: equivocarse y corregirse enseña."
                             : "Escribí algo, aunque no estés seguro: equivocarse y corregirse enseña.";
      res.explain = "La respuesta era " + it(target0) + ".";
      return res;
    }
    res.level = "correcto";
    if (g.join(" ") === e.join(" ")) { res.verdict = "giusto"; return res; }
    // Another valid way of saying it (io ho, però, 32, Non lavoro oggi…):
    // right, with a note and the model's version.  Not when the exercise
    // asks for the number in letters.
    var eqCtx = { numbersDrill: /letras?\b/i.test(String(ctx.prompt || "")) || /\d\s*→/.test(String(ctx.stem || "")),
                  gap: /_{3,}/.test(String(ctx.stem || "")) || /\([a-zà-ù]+(are|ere|ire|rre|rsi)\)/.test(String(ctx.stem || "")),
                  tenseAsked: /futur|presente|pasado|condicional|condizional|subjuntivo|congiuntiv|imperfett|passato|tiempo/i.test(String(ctx.prompt || "") + " " + String(ctx.stem || "")) };
    for (var qi = 0; qi < list.length; qi++) {
      var q = ctx.choice ? null : equivalent(g, list[qi], eqCtx);
      if (q) {
        res.verdict = "giusto"; res.level = q.level; res.target = list[qi];
        if (q.note) res.note = q.note;
        if (q.level !== "correcto") res.natural = q.natural;
        return res;
      }
    }
    // The whole answer in Spanish («las verduras», «son las tres»): one
    // finding, not five, and the translation of what was written.
    var wordsG = rawG.filter(function (t) { return /[a-zà-ÿ]/i.test(t); });   // digits don't count
    // A word the answer itself has (Buenos Aires, a name, a loan) is not
    // Spanish in the learner's mouth.
    var inTarget = dict();
    list0.forEach(function (x) { tokens(x).forEach(function (t) { inTarget[t] = 1; }); });
    var esToks = wordsG.filter(function (t) { return spanishish(t) && !inTarget[t]; });
    // Nothing of the answer in what was written: show the main answer, not
    // the variant that happens to share its length.
    var shown = rawG.some(function (t) { return inTarget[t]; }) ? target0 : list0[0];
    var stemRaw = ctx.stem && !/_{3,}/.test(ctx.stem) ? String(ctx.stem) : "";
    var stemToks = stemRaw ? tokens(stemRaw.replace(/\([^)]*\)/g, " ")) : [];
    var stemAll = stemRaw ? tokens(stemRaw) : [];
    var gNoPar = tokens(String(rawGiven).replace(/\([^)]*\)/g, " ")).join(" ");
    // The prompt is Spanish when some of its words are, or when most of them
    // are no Italian word at all («Haceme un favor»).
    var stemLong = stemToks.filter(function (t) { return t.length >= 3; });
    var stemSpanish = stemToks.some(spanishish) ||
      (stemLong.length && stemLong.filter(function (t) { return !isItalian(t); }).length * 2 > stemLong.length);
    var copied = stemToks.length && stemSpanish && gNoPar !== tokens(shown).join(" ") &&
      (rawG.join(" ") === stemToks.join(" ") || rawG.join(" ") === stemAll.join(" ") || gNoPar === stemToks.join(" "));
    if (copied) {
      res.cat = "parola_spagnola"; res.label = LABEL.parola_spagnola;
      res.hint = "Eso es la consigna, en español. Escribila en italiano; si todavía no lo sabés, pedí las fichas 🧩.";
      res.explain = "Copiaste la consigna en español. En italiano: " + it(shown) + ".";
      res.given.forEach(function (w) { w.bad = true; });
      res.fixed.forEach(function (w) { w.fix = true; });
      res.verdict = "sbagliato"; res.all = ["parola_spagnola"];
      return res;
    }
    var allEs = wordsG.length && esToks.length === wordsG.length;
    // One Spanish word among Italian ones is a word-level error (the pair
    // rules say why: «para» → per); two or more, or everything, is Spanish.
    if (wordsG.length >= 2 && (allEs || esToks.length >= 2) &&
        (esToks.length * 2 >= wordsG.length || (esToks.length >= 3 && esToks.length * 3 >= wordsG.length))) {
      var pairsEs = esToks.filter(spanishWord).slice(0, 3).map(function (t) { return it(t) + " = " + it(String(spanishWord(t)).split(" / ")[0]); });
      // The Italian words the learner did write, glossed, so «dove que» gets
      // «dove = dónde» and not only «que = che».
      var itGloss = allEs ? [] : wordsG.filter(function (t) { return esToks.indexOf(t) < 0 && DATA.lex[t]; })
        .slice(0, 2).map(function (t) { return it(t) + " = " + DATA.lex[t]; });
      res.cat = "parola_spagnola"; res.label = LABEL.parola_spagnola;
      res.hint = allEs ? "Eso está en español. Escribilo en italiano; si todavía no lo sabés, pedí las fichas 🧩."
                       : "Hay español mezclado: " + esToks.slice(0, 3).map(it).join(", ") + ". Escribilo todo en italiano.";
      res.explain = (allEs ? "Está en español. " : "Mezcla español e italiano" + (itGloss.length ? " (" + itGloss.join(", ") + ")" : "") + ". ") +
        "En italiano: " + it(shown) + "." + (pairsEs.length ? " (" + pairsEs.join(", ") + ")" : "");
      res.given.forEach(function (w) { if (esToks.indexOf(w.w) >= 0) w.bad = true; });
      res.fixed.forEach(function (w) { if (g.indexOf(w.w) < 0) w.fix = true; });
      res.verdict = "sbagliato"; res.all = ["parola_spagnola"];
      return res;
    }
    // «Sono stanca» for «Sono stanco»: with nobody named, the gender is the
    // learner's own (or the listener's), and both are right.
    if (genderFree(g, e, target, ctx)) {
      res.verdict = "giusto";
      res.note = "Vale en femenino o en masculino: la terminación sigue a quien habla (sono stanco, sono stanca).";
      return res;
    }
    // Termino for finisco, resto for rimango: same meaning, same person and tense.
    if (synonymFree(g, e)) {
      res.verdict = "giusto"; res.level = "aceptable"; res.natural = target;
      res.note = "También vale; en el modelo: " + it(target) + ".";
      return res;
    }
    // (tanto) buono quanto, (così) alto come: the first term of an equality is optional.
    if (g.length === e.length - 1) {
      for (var oi = 0; oi < e.length; oi++) {
        if (/^(tanto|tanta|tanti|tante|così)$/.test(e[oi]) && /^(quanto|quanta|quanti|quante|come)$/.test(e[oi + 2] || "")) {
          var rest = e.slice(0, oi).concat(e.slice(oi + 1));
          if (rest.join(" ") === g.join(" ") || synonymFree(g, rest)) { res.verdict = "giusto"; return res; }
        }
      }
    }

    var found = [];
    var nm = names(target).concat(ctx.names || []);

    // Contractions first: fix them and look at what is left.
    var un = uncontracted(g, e);
    if (un) {
      found.push({ d: un.d, gi: un.i, ei: e.indexOf(un.form) });
      g = g.slice(0, un.i).concat([un.form], g.slice(un.i + 2));
      res.given[un.i].bad = true;
      if (res.given[un.i + 1]) res.given[un.i + 1].bad = true;
      res.given.splice(un.i + 1, 1);
    }

    // A clitic written apart that should be glued to the verb (ecco lo →
    // eccolo, per lo ringraziare → per ringraziarlo, ti alza → alzati).
    var encl = enclitic(g, e);
    if (encl) {
      res.cat = "posizione_pronome"; res.label = LABEL.posizione_pronome;
      res.hint = "El pronombre está bien, pero no en su lugar: con esta forma del verbo va pegado al final.";
      res.explain = "Con " + gluedForms(ctx.week) + ", el pronombre se pega al final: " +
        it(encl) + " (" + gluedExamples(ctx.week) + "), como en español «verte», «decime».";
      res.verdict = "sbagliato"; res.all = ["posizione_pronome"];
      g.forEach(function (w, i) { if (CLITICS.indexOf(w) >= 0 && res.given[i]) res.given[i].bad = true; });
      e.forEach(function (w, i) { if (w === encl && res.fixed[i]) res.fixed[i].fix = true; });
      return res;
    }

    // A simple past where Italian wants a compound one (mi svegliai → mi sono
    // svegliato; ho studiato ↔ studio with «da» + time).
    var cp = compoundSwap(g, e);
    if (cp) {
      res.cat = "tempo_verbale"; res.label = LABEL.tempo_verbale;
      res.hint = cp.hint; res.explain = cp.explain;
      res.verdict = "sbagliato"; res.all = ["tempo_verbale"];
      if (res.given[cp.gi]) res.given[cp.gi].bad = true;
      cp.ei.forEach(function (i) { if (res.fixed[i]) res.fixed[i].fix = true; });
      return res;
    }

    // A pronoun in another place, everything else the same (ho lo visto →
    // l'ho visto, voglio lo fare → lo voglio fare).
    // two pronouns the other way round (lo me → me lo): the order of the pair
    for (var sk = 0; sk < g.length - 1 && g.length === e.length; sk++) {
      var clw = function (w) { return CLITICS.indexOf(w) >= 0 || COMBINED.indexOf(w) >= 0; };
      if (g[sk] !== e[sk] && g[sk] === e[sk + 1] && g[sk + 1] === e[sk] && clw(g[sk]) && clw(g[sk + 1]) &&
          g.slice(0, sk).join(" ") === e.slice(0, sk).join(" ") && g.slice(sk + 2).join(" ") === e.slice(sk + 2).join(" ")) {
        res.cat = "pronome"; res.label = LABEL.pronome;
        res.hint = "Son dos pronombres juntos: ¿cuál va primero?";
        res.explain = "Con dos pronombres juntos, primero va el de la persona (*me, te, ce, ve, se*) y después *lo, la, li, le, ne*: " +
          it(e.slice(sk, sk + 3).join(" ")) + ", igual que en español «me lo».";
        res.verdict = "sbagliato"; res.all = ["pronome"];
        res.given[sk].bad = res.given[sk + 1].bad = true;
        res.fixed[sk].fix = res.fixed[sk + 1].fix = true;
        return res;
      }
    }
    var cm = clitMoved(g, e);
    if (cm) {
      res.cat = "posizione_pronome"; res.label = LABEL.posizione_pronome;
      res.hint = "Las palabras están bien; revisá dónde va el pronombre.";
      res.explain = "El pronombre va antes del verbo conjugado, también en los tiempos compuestos: " + it(cm.shown) +
        " (como en español «lo he visto»), o pegado al final " + gluedForms(ctx.week, true) + ".";
      res.verdict = "sbagliato"; res.all = ["posizione_pronome"];
      if (res.given[cm.gi]) res.given[cm.gi].bad = true;
      if (res.fixed[cm.ej]) res.fixed[cm.ej].fix = true;
      return res;
    }

    // «gli lo», «le lo», «se lo»: two pronouns that Italian writes as one.
    var cmb = splitCombined(g, e);
    if (cmb) {
      res.cat = "pronome"; res.label = LABEL.pronome;
      res.hint = "Son dos pronombres juntos: ¿cómo se escriben en italiano *gli* o *le* con *lo, la, ne*?";
      res.explain = "*gli* (o *le*) + *lo, la, li, le, ne* se escriben en una sola palabra, con una *e* en el medio: " + it(cmb.form) +
        " (glielo dico = se lo digo)." + (cmb.se ? " El «se» de «se lo di» no se traduce *se*: en italiano es *glie-*." : "");
      res.verdict = "sbagliato"; res.all = ["pronome"];
      [cmb.i, cmb.i + 1].forEach(function (k) { if (res.given[k]) res.given[k].bad = true; });
      e.forEach(function (w, k) { if (w === cmb.form && res.fixed[k]) res.fixed[k].fix = true; });
      return res;
    }

    // Same words, other order
    if (g.length === e.length && g.slice().sort().join(" ") === e.slice().sort().join(" ") && g.join(" ") !== e.join(" ")) {
      // A pronoun out of place only if it is one there (not the article of
      // «la mia casa»): a verb right after it in the answer.
      var clit = g.filter(function (w, i) {
        if (w === e[i] || CLITICS.indexOf(w) < 0) return false;
        var at = e.indexOf(w), nx = e[at + 1] || "";
        return !!(verbForms(nx).length || AVERE.indexOf(nx) >= 0 || ESSERE.indexOf(nx) >= 0 || CLITICS.indexOf(nx) >= 0);
      })[0];
      // two pronouns the other way round (lo me → me lo)
      var isCl = function (w) { return CLITICS.indexOf(w) >= 0 || COMBINED.indexOf(w) >= 0; };
      for (var pk = 0; pk < g.length - 1; pk++) {
        if (g[pk] !== e[pk] && g[pk] === e[pk + 1] && g[pk + 1] === e[pk] && isCl(g[pk]) && isCl(g[pk + 1])) {
          clit = null;
          found.push({ d: { cat: "pronome", slip: false,
            hint: "Son dos pronombres juntos: ¿cuál va primero?",
            explain: "Con dos pronombres juntos, primero va el de la persona (*me, te, ce, ve, se*) y después *lo, la, li, le, ne*: " +
              it(e.slice(pk, pk + 3).join(" ")) + ", igual que en español «me lo»." }, gi: -1, ei: -1 });
          break;
        }
      }
      var ord = clit || found.length ? null : orderWhy(g, e);
      if (!found.length) found.push({ d: clit
        ? { cat: "posizione_pronome", slip: false,
            hint: "Las palabras están bien; revisá dónde va el pronombre.",
            explain: "El pronombre va antes del verbo conjugado (" + it(clit) + " + verbo, como en español «lo veo»), o pegado al final " + gluedForms(ctx.week, true) + ": " + gluedExamples(ctx.week) + "." }
        : { cat: "ordine", slip: false,
            hint: ord ? ord.hint : "Están todas las palabras, pero no en el orden italiano.",
            explain: ord ? ord.explain : (function () {
              // the first word out of place, and why it goes where it goes
              var last = e[e.length - 1];
              if (SUBJ_P[last] && g[0] === last) return "En italiano el orden es: " + it(target) + ". Acá el sujeto va al final, " + it(last) +
                ": así se lo destaca, como en español «¿cocinás vos?».";
              for (var k = 0; k < e.length - 1; k++) if (g[k] !== e[k]) {
                return "En italiano el orden es: " + it(target) + ". " + it(e[k]) + " va antes de " + it(e[k + 1]) + ". " + orderReason(e[k], e[k + 1]);
              }
              return "En italiano el orden es: " + it(target) + ".";
            })() },
        gi: -1, ei: -1 });
      // mark what moved
      g.forEach(function (w, k) { if (w !== e[k] && res.given[k]) res.given[k].bad = true; });
      e.forEach(function (w, k) { if (w !== g[k] && res.fixed[k]) res.fixed[k].fix = true; });
    } else {
      var ops = align(g, e);
      ops.forEach(function (o) {
        var c = { e: e, ei: o.ei, g: g, gi: o.gi, names: nm, stem: ctx.stem, prompt: ctx.prompt, nominal: ctx.nominal, week: ctx.week, choice: ctx.choice };
        // Several gaps that could not be put back in their sentence: each
        // word stands alone, the next gap is not «the word after».
        if (isolated) c = { e: [o.e], ei: 0, g: [o.g], gi: 0, names: nm, stem: "", prompt: ctx.prompt, nominal: ctx.nominal, week: ctx.week, choice: ctx.choice };
        if (o.op === "sub") {
          var d = pairRules(o.g, o.e, c);
          found.push({ d: d, gi: o.gi, ei: o.ei });
        } else if (o.op === "miss") {
          found.push({ d: missRule(o.e, c), gi: -1, ei: o.ei });
        } else if (o.op === "extra") {
          found.push({ d: extraRule(o.g, g, o.gi, c), gi: o.gi, ei: -1 });
        }
      });
      // An auxiliary swap drags the participle ending with it (ho andato →
      // sono andato is one error, not two): drop the agreement echo.
      var hasAux = found.some(function (f) { return f.d.cat === "ausiliare"; });
      if (hasAux) found = found.filter(function (f) {
        return f.d.cat !== "participio_accordo" && f.d.cat !== "accordo";
      });
    }

    // What the pair rules found right after all (a me piace, io ho, di +
    // infinitive): out of the errors, into the note.
    var okNotes = found.filter(function (f) { return f.d.ok && f.d.note; }).map(function (f) { return f.d.note; });
    found = found.filter(function (f) { return !f.d.ok; });
    if (okNotes.length) res.note = okNotes.filter(function (n, i, a) { return a.indexOf(n) === i; }).join(" ");
    if (!found.length) {
      res.verdict = "giusto";
      if (res.note) { res.level = "aceptable"; res.natural = target; }
      return res;
    }

    found.forEach(function (f) {
      if (f.gi >= 0 && res.given[f.gi]) res.given[f.gi].bad = true;
      if (f.ei >= 0 && res.fixed[f.ei]) res.fixed[f.ei].fix = true;
    });
    found.sort(function (a, b) { return (SEVERITY[b.d.cat] || 5) - (SEVERITY[a.d.cat] || 5); });
    var main = found[0].d;
    res.cat = main.cat;
    res.label = LABEL[main.cat] || main.cat;
    res.hint = main.hint;
    res.explain = main.explain;
    res.others = found.length - 1;
    res.all = found.map(function (f) { return f.d.cat; });
    res.slip = found.every(function (f) { return f.d.slip; });
    // Slips only (accents, typos, a redundant subject): close enough.
    res.verdict = res.slip ? "quasi" : "sbagliato";
    return res;
  }

  /* A wrong option in a multiple-choice question: explain why *that* option
     is wrong (response-specific feedback). */
  // «(nada)», «—»: the option that means «no word here».
  var EMPTY_OPT = /^\s*[(\[]?\s*(nada|niente|nessuno|ninguno|ninguna|—|–|-|ø|∅)\s*[)\]]?\s*$/i;
  // Words that are no Italian: a metalinguistic option («futuro de fare»,
  // «Dejo que Marco hable») is a Spanish answer, not Italian to correct.
  function notItalianText(t) {
    var w = tokens(t).filter(function (x) { return x.length >= 3 && /[a-zà-ÿ]/.test(x); });
    if (tokens(t).some(function (x) { return ES_FUNC[deaccent(x)] && !isItalian(x); })) return true;
    if (!w.length) return false;
    return w.filter(function (x) { return spanishish(x); }).length * 2 > w.length;
  }
  // Spanish against Spanish: case, accents and punctuation do not count;
  // otherwise the other ways of saying it, no Italian diagnosis.
  function spanishAnswer(given, list) {
    var flat = function (x) { return deaccent(String(x || "").toLowerCase()).replace(/[¿?¡!.,;:«»"()]/g, " ").replace(/\s+/g, " ").trim(); };
    var g = flat(given);
    var res = { cat: null, slip: false, hint: "", explain: "", target: list[0], lang: "es",
                given: tokens(given).map(function (w) { return { w: w }; }), fixed: tokens(list[0]).map(function (w) { return { w: w }; }), others: 0, all: [] };
    var hit = list.filter(function (x) { return flat(x) === g; })[0];
    if (hit) { res.verdict = "giusto"; res.level = "correcto"; res.target = hit; return res; }
    res.verdict = "sbagliato";
    res.explain = "Otras formas de decirlo: " + list.filter(function (x, i, a) { return a.indexOf(x) === i; }).slice(0, 4).join(" · ") + ".";
    return res;
  }

  function explainChoice(chosen, answer, ctx) {
    ctx = ctx || {};
    var c2 = {};
    Object.keys(ctx).forEach(function (k) { c2[k] = ctx[k]; });
    c2.choice = true;
    if (EMPTY_OPT.test(chosen)) {
      if (!/_{3,}/.test(ctx.stem || "")) return null;
      chosen = "";
    } else if (notItalianText(answer)) return null;
    var d = diagnose(chosen, [answer], c2);
    return d.verdict === "giusto" || d.cat === "vuoto" ? null : d;
  }

  /* ---------------------------------------------------------- dati */

  function init(bank) {
    bank = bank || {};
    DATA.esIt = dict(bank.esIt);
    // A few multi-word Spanish structures the engine relies on.
    [["lo que", "quello che / ciò che", "Lo que = quello che (o ciò che)."],
     ["tengo que", "devo", "Tener que = dovere: devo andare."],
     ["hay que", "bisogna / si deve", "Hay que = bisogna + infinitivo."],
     ["acabo de", "ho appena", "Acabar de = appena + passato prossimo: ho appena mangiato."]]
      .forEach(function (x) { if (!DATA.esIt[x[0]]) DATA.esIt[x[0]] = [x[1], x[2]]; });
    DATA.falsi = dict(bank.falsi);
    DATA.spelling = (bank.spelling || []).slice().sort(function (a, b) {
      return b[0].length - a[0].length;
    });
    DATA.lex = dict();
    DATA.nouns = dict();
    DATA.nounsByPlural = dict();
    (bank.nouns || []).forEach(function (n) {
      var x = { s: n[0], g: n[1], pl: n[2], es: n[3], note: n[6] };
      DATA.nouns[n[0]] = x;
      DATA.nounsByPlural[n[2]] = x;
      DATA.lex[n[0]] = n[3];
      if (!DATA.lex[n[2]]) DATA.lex[n[2]] = n[3];
    });
    DATA.adj = dict();
    (bank.adjectives || []).forEach(function (a) {
      for (var i = 0; i < 4; i++) { if (!DATA.lex[a[i]]) DATA.lex[a[i]] = a[4]; DATA.adj[a[i]] = a[0]; }
    });
    (bank.words || []).forEach(function (w) {
      var k = w[0].toLowerCase();
      if (!DATA.lex[k] && k.indexOf(" ") < 0) DATA.lex[k] = w[1];
    });
    (bank.verbs || []).forEach(function (v) {
      if (Conj && !v[4]) Conj.register(v[0], { es: v[1], aux: v[2], isc: v[3] });
      DATA.lex[v[0]] = v[1];
    });
    // the everyday synonyms the course does not teach (acquistare, inviare)
    VERB_EQ.forEach(function (x) { if (x[3] && !DATA.lex[x[1]]) DATA.lex[x[1]] = x[3]; });
    VIDX = null;   // rebuild with the new verbs on first use
  }

  var api = {
    tokens: tokens,
    align: align,
    diagnose: diagnose,
    explainChoice: explainChoice,
    init: init,
    LABEL: LABEL,
    SEVERITY: SEVERITY,
    verbForms: verbForms,
    participleOf: participleOf,
    DATA: DATA,
    // For the free-writing checker (scrivi.js): the same tables and tests.
    util: {
      ARTICLES: ARTICLES, CLITICS: CLITICS, SUBJECTS: SUBJECTS, POSSESSIVE: POSSESSIVE,
      FAMILY: FAMILY, AVERE: AVERE, ESSERE: ESSERE, prepInfo: prepInfo, contract: contract,
      isItalian: isItalian, spanishWord: spanishWord, looksSpanish: looksSpanish,
      isInfinitive: isInfinitive, soundRule: soundRule, deaccent: deaccent,
      degeminate: degeminate, editDistance: editDistance, lexConfusion: lexConfusion
    }
  };

  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Diagnosi = api;
})(typeof window !== "undefined" ? window : globalThis);
