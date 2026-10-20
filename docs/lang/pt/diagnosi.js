/*
 * El diagnóstico: entender *qué tipo* de error es, no solo que está mal.
 *
 * Lo que dice la investigación sobre el feedback correctivo:
 *  - las pistas metalingüísticas que empujan a corregirse solo («prompts»)
 *    funcionan mejor que dar enseguida la forma correcta (Lyster & Ranta
 *    1997; metaanálisis de Lyster & Saito 2010);
 *  - el feedback específico sobre la respuesta dada («por qué esta está
 *    mal») sirve más que la simple verificación (Shute 2008);
 *  - los errores de regla (contracción, artículo, tiempo, regencia) se curan
 *    con la regla; los léxicos, con el significado y un ejemplo (Ferris
 *    1999, errores «tratables» y «no tratables»);
 *  - una tilde o un tipeo son deslices, no errores de sistema: se señalan
 *    sin insistir (Corder 1967);
 *  - equivocarse y recibir una corrección que analiza el error hace
 *    aprender, sobre todo cuando uno estaba seguro (Metcalfe 2017).
 *
 * Para el hispanohablante que aprende portugués de Brasil el mapa de
 * errores sale de la bibliografía de Português para Falantes de Espanhol
 * (Almeida Filho 1995; Grannier 2002, «pontos críticos»; Akerberg 2004;
 * Ferreira 1995; Durão 1999): contracciones obligatorias, gostar de, muito,
 * la «a» personal, el perfeito composto que no es el pretérito perfecto, el
 * futuro do subjuntivo y el infinitivo pessoal que el español no tiene, la
 * crase, los heterogenéricos, los falsos amigos, las nasales y el español
 * que se cuela entero (tengo, pero, muy, hasta, también…).
 *
 * diagnose(dada, esperadas, ctx) → { verdict, cat, label, slip, hint,
 *                                    explain, given, fixed, others, all }
 *   verdict  "giusto" (bien) · "quasi" (casi: solo deslices) · "sbagliato"
 *            (los nombres de los veredictos son los del motor, engine.js)
 *   hint     pista para el primer intento (no revela la respuesta)
 *   explain  explicación completa después de la solución
 *   given    tokens de la respuesta dada, con el equivocado marcado (bad)
 *   fixed    tokens de la respuesta esperada, con el corregido marcado (fix)
 *
 * Las categorías (cat) son las de la clínica de errores (LABEL, abajo):
 * contraccion, articulo, genero, plural, concordancia, preposicion, regencia,
 * muito, gostar, a_personal, perfeito_composto, subjuntivo, futuro_subj,
 * inf_pessoal, pronome, colocacao, crase, ortografia, tilde, espanol,
 * falso_amigo, tempo, persona, participio, verbo_irregular, regularizacion,
 * nasal, faltante, sobrante, tipeo, orden; y además lexico (palabra
 * portuguesa equivocada) y vuoto (respuesta vacía).
 *
 * Los datos de transferencia del español (palabras, falsos amigos, grafías)
 * y el léxico llegan de data/bank.json con init(); sin ellos el diagnóstico
 * usa sus propias tablas, las reglas y el conjugador (window.Conj).
 */
(function (root) {
  "use strict";

  var Conj = root.Conj ||
    (typeof require === "function" ? (function () { try { return require("./conjugator.js"); } catch (e) { return null; } })() : null);
  function C() { return root.Conj || Conj; }

  // Maps keyed by what the learner types must not inherit from Object:
  // "constructor" or "__proto__" are words someone can type.
  function dict(o) {
    var d = Object.create(null);
    if (o) Object.keys(o).forEach(function (k) { d[k] = o[k]; });
    return d;
  }

  var DATA = { esPt: dict(), esIt: null, falsi: dict(), spelling: [], lex: dict(), adj: dict(), nouns: dict(), nounsByPlural: dict(), verbs: dict() };

  /* ------------------------------------------------------- herramientas */

  function deaccent(s) {
    return String(s).normalize("NFD").replace(/[̀-ͯ]/g, "");
  }
  function it(w) { return "*" + w + "*"; }
  // A whole sentence in italics, closed by its own punctuation or a period.
  function sentEnd(x) { x = String(x).trim(); return it(x) + (/[.!?…»]$/.test(x) ? "" : "."); }

  // Tokens for comparison: lower case, punctuation out; hyphens between
  // letters stay (levanto-me, segunda-feira, vendem-se).
  function tokens(s) {
    return String(s == null ? "" : s)
      .normalize("NFC")
      .toLowerCase()
      .replace(/[’‘`´]/g, "'")
      .replace(/[​-‍⁠﻿\u0000]/g, "")
      .replace(/\p{Extended_Pictographic}|[️\u{1f3fb}-\u{1f3ff}]/gu, " ")
      .replace(/[«»"“”.,;:!?¿¡()…—–\[\]{}<>\/\\*_=+|~^%$#@&]+/g, " ")
      .replace(/(^|[^a-zà-ÿ])[-']+/g, "$1 ")
      .replace(/[-']+(?=[^a-zà-ÿ]|$)/g, " ")
      .split(/\s+/)
      .filter(Boolean);
  }

  // For each token of tokens(s): whether a pause (comma, colon, period…)
  // comes before it.  A pronoun after a pause is not attracted by the word
  // before the comma (Já que você está aqui, me ajuda).
  function pauses(s) {
    var out = [];
    String(s == null ? "" : s).split(/[,;:.!?—–]+/).forEach(function (chunk, ci) {
      tokens(chunk).forEach(function (t, k) { out.push(ci > 0 && k === 0); });
    });
    return out;
  }

  function degeminate(s) { return s.replace(/([rs])\1/g, "$1"); }

  // Damerau distance: two swapped letters (porta/protа) are one slip.
  function editDistance(a, b) {
    var d = [], i, j;
    if (a.length > 60 || b.length > 60) return Math.abs(a.length - b.length) + (a === b ? 0 : 10);
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

  /* Alinea dos secuencias de tokens: eq / sub / miss (falta en la respuesta)
     / extra (sobra en la respuesta).  Sustituir cuesta menos cuando las
     palabras se parecen, así «tenho»≠«tengo» se emparejan como sustitución. */
  function align(g, e) {
    var n = g.length, m = e.length, D = [], i, j;
    for (i = 0; i <= n; i++) { D[i] = []; for (j = 0; j <= m; j++) D[i][j] = 0; }
    for (i = 1; i <= n; i++) D[i][0] = i;
    for (j = 1; j <= m; j++) D[0][j] = j;
    var S = function (a, b) { return a === b ? 0 : 1.4 - 0.6 * similarity(a, b); };
    for (i = 1; i <= n; i++) {
      for (j = 1; j <= m; j++) {
        D[i][j] = Math.min(D[i - 1][j] + 1, D[i][j - 1] + 1, D[i - 1][j - 1] + S(g[i - 1], e[j - 1]));
      }
    }
    var ops = [];
    i = n; j = m;
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0) {
        var same2 = g[i - 1] === e[j - 1];
        if (Math.abs(D[i][j] - (D[i - 1][j - 1] + S(g[i - 1], e[j - 1]))) < 1e-9) {
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

  /* --------------------------------------------------------- inventarios */

  // [género, número, tipo]
  var ARTICLES = dict({
    o: ["m", "s", "det"], a: ["f", "s", "det"], os: ["m", "p", "det"], as: ["f", "p", "det"],
    um: ["m", "s", "ind"], uma: ["f", "s", "ind"], uns: ["m", "p", "ind"], umas: ["f", "p", "ind"]
  });
  // Artículos del español que no son portugueses (la y los sí existen como
  // pronombres enclíticos: comprá-la, fazê-los, pero nunca sueltos).
  var ES_ARTICLES = dict({ el: "o", la: "a", los: "os", las: "as", un: "um", unos: "uns", unas: "umas", lo: "o" });

  var PREP_BASE = dict({ a: "a", de: "de", em: "em", por: "por", para: "para", com: "com", sem: "sem",
    "até": "até", entre: "entre", sobre: "sobre", contra: "contra", desde: "desde", "após": "após", sob: "sob", perante: "perante" });

  /* Contracciones: forma → [preposición, palabra].  Las de artículo son
     obligatorias; las de pronombre y demostrativo también (dele, neste),
     salvo cuando el pronombre es sujeto de un infinitivo (antes de ele chegar). */
  var CONTR = dict();
  (function () {
    var arts = ["o", "a", "os", "as"];
    arts.forEach(function (a) {
      CONTR[{ o: "ao", a: "à", os: "aos", as: "às" }[a]] = ["a", a];
      CONTR["d" + a] = ["de", a];
      CONTR["n" + a] = ["em", a];
      CONTR["pel" + a] = ["por", a];
    });
    ["um", "uma", "uns", "umas"].forEach(function (a) { CONTR["n" + a] = ["em", a]; CONTR["d" + a] = ["de", a]; });
    ["ele", "ela", "eles", "elas", "este", "esta", "estes", "estas", "esse", "essa", "esses", "essas",
     "aquele", "aquela", "aqueles", "aquelas", "isto", "isso", "aquilo"].forEach(function (p) {
      CONTR["d" + p] = ["de", p];
      CONTR["n" + p] = ["em", p];
    });
    ["aquele", "aquela", "aqueles", "aquelas", "aquilo"].forEach(function (p) { CONTR["à" + p.slice(1)] = ["a", p]; });
    CONTR.daqui = ["de", "aqui"]; CONTR.dali = ["de", "ali"]; CONTR.daí = ["de", "aí"];
  })();

  function prepInfo(w) {
    if (PREP_BASE[w]) return { base: PREP_BASE[w], art: null };
    if (CONTR[w]) return { base: CONTR[w][0], art: CONTR[w][1] };
    return null;
  }

  function contract(prep, word) {
    for (var k in CONTR) {
      if (CONTR[k][0] === prep && CONTR[k][1] === word) return k;
    }
    return null;
  }

  var CLITICS = ["me", "te", "se", "nos", "vos", "lhe", "lhes", "o", "a", "os", "as", "lo", "la", "los", "las", "no", "na", "nas"];
  var CLITIC_ONLY = dict({ me: 1, te: 1, se: 1, nos: 1, vos: 1, lhe: 1, lhes: 1 });
  var SUBJECTS = ["eu", "tu", "ele", "ela", "você", "nós", "vós", "eles", "elas", "vocês"];
  var SUBJ_P = dict({ eu: [0], tu: [1, 2], ele: [2], ela: [2], "você": [2], "nós": [3], "vós": [4], eles: [5], elas: [5], "vocês": [5] });
  var POSSESSIVE = ["meu", "minha", "meus", "minhas", "teu", "tua", "teus", "tuas", "seu", "sua", "seus", "suas",
                    "nosso", "nossa", "nossos", "nossas", "vosso", "vossa", "vossos", "vossas"];
  var FAMILY = ["mãe", "pai", "irmão", "irmã", "filho", "filha", "avô", "avó", "tio", "tia", "primo", "prima",
                "marido", "esposa", "mulher", "neto", "neta", "sobrinho", "sobrinha", "sogro", "sogra",
                "cunhado", "cunhada", "namorado", "namorada", "pais", "irmãos", "filhos", "avós", "amigo", "amiga", "amigos", "amigas"];
  // Nombres de lugar que llevan artículo (o Brasil, a Argentina, o Rio).
  var PLACE_ART = dict({ brasil: "m", rio: "m", recife: "m", porto: "m", "japão": "m", peru: "m", chile: "m",
    uruguai: "m", paraguai: "m", "méxico": "m", "canadá": "m", equador: "m", nordeste: "m", sul: "m", norte: "m",
    argentina: "f", bahia: "f", "itália": "f", "frança": "f", espanha: "f", alemanha: "f", inglaterra: "f",
    "amazônia": "f", europa: "f", "áfrica": "f", "ásia": "f", "américa": "f", bolívia: "f", colômbia: "f", venezuela: "f",
    china: "f", "índia": "f", "estados": "m", eua: "m", amazonas: "m", "ceará": "m", "espírito": "m", "pará": "m", "paraná": "m",
    "maranhão": "m", "piauí": "m", acre: "m", "amapá": "m", tocantins: "m", mato: "m", distrito: "m", pantanal: "m", "sertão": "m",
    // Barrios y lugares de Río que llevan artículo (no Leblon, na Lapa, no Centro).
    leblon: "m", flamengo: "m", lapa: "f", tijuca: "f", centro: "m", catete: "m", arpoador: "m", corcovado: "m", "maracanã": "m", aterro: "m" });
  var PLACE_NOART = /^(portugal|lisboa|são|sao|salvador|brasília|brasilia|curitiba|florianópolis|manaus|belém|fortaleza|natal|niterói|paraty|petrópolis|búzios|olinda|ouro|buenos|rosario|córdoba|cordoba|mendoza|montevidéu|madri|paris|londres|roma|cuba|israel|angola|moçambique|copacabana|ipanema|botafogo|laranjeiras|santa|urca|niterói|maceió)$/;

  /* Disparadores del subjuntivo presente e imperfecto. */
  var SUBJ_TRIG = ["não acho que", "não acredito que", "não creio que", "não penso que", "pode ser que", "a menos que",
    "recomenda", "recomendam", "sugere", "sugerem", "proponho", "propõe", "exige", "exigem", "fundamental", "essencial",
    "espero", "espera", "esperamos", "esperam", "quero", "quer", "queremos", "querem", "tomara", "talvez",
    "importante", "necessário", "preciso", "possível", "impossível", "provável", "melhor", "pena", "embora", "caso",
    "duvido", "duvida", "peço", "pede", "pedem", "prefiro", "prefere", "recomendo", "sugiro", "aconselho", "proíbo",
    "quisera", "queria", "esperava", "pedi", "pediu", "mandou", "exigiu", "exijo", "desejo", "deseja", "lamento", "receio", "tenho medo",
    "para que", "a fim de que", "antes que", "sem que", "até que", "desde que", "contanto que", "mesmo que", "ainda que",
    "por mais que", "a não ser que", "é bom que", "é bom", "estranho", "ótimo", "tomara que"];
  var FUT_SUBJ_TRIG = /(^|\s)(quando|se|assim que|logo que|enquanto|sempre que|depois que|conforme|como|onde|quem|o que|tudo o que|caso)\s*$/;

  /* ------------------------------------------------------- índice verbal */

  var VIDX = null;   // forma → [{lemma, tense, p}]
  var PIDX = null;   // participio → lema
  var GIDX = null;   // gerundio → lema
  var LIDX = null;   // infinitivo → true
  var SIMPLE = ["presente", "perfeito", "imperfeito", "maisQuePerfeito", "futuro", "condicional",
                "subjPresente", "subjImperfeito", "subjFuturo", "infPessoal"];

  // The verb inside a form the conjugator may write with its pronoun:
  // «me levanto», «levanto-me», «se eu falar».
  function bareForm(f) {
    var w = String(f || "").trim().split(/\s+/).pop() || "";
    var m = /^([a-zà-ÿ]+)-(me|te|se|nos|vos|lhe|lhes)$/.exec(w);
    return m ? m[1] : w;
  }

  function participlesOf(v) {
    var out = [];
    var add = function (x) {
      if (!x) return;
      if (Array.isArray(x)) return x.forEach(add);
      if (typeof x === "object") return Object.keys(x).forEach(function (k) { add(x[k]); });
      String(x).split(/\s*[\/|,]\s*|\s+ou\s+/).forEach(function (p) { p = bareForm(p); if (p) out.push(p); });
    };
    var K = C();
    try { add(K.participle(v)); } catch (e) { /* */ }
    try { if (typeof K.participles === "function") add(K.participles(v)); } catch (e) { /* */ }
    return out.filter(function (x, i) { return out.indexOf(x) === i; });
  }

  function buildVerbIndex() {
    VIDX = dict(); PIDX = dict(); GIDX = dict(); LIDX = dict();
    var K = C();
    if (!K || typeof K.list !== "function") return;
    var tenses = (K.SIMPLE_TENSES || SIMPLE).filter(function (t) { return SIMPLE.indexOf(t) >= 0 || /^[a-z]+$/i.test(t); });
    K.list().forEach(function (v) {
      var lemma = String(v);
      LIDX[lemma.replace(/-se$/, "")] = true;
      LIDX[lemma] = true;
      tenses.forEach(function (t) {
        var forms;
        try { forms = K.conjugate(lemma, t); } catch (e) { return; }
        (forms || []).forEach(function (f, p) {
          if (!f) return;
          String(f).split(/\s*\/\s*/).forEach(function (ff) {
            var w = bareForm(ff).toLowerCase();
            if (!w) return;
            var arr = VIDX[w] || (VIDX[w] = []);
            if (!arr.some(function (x) { return x.lemma === lemma && x.tense === t && x.p === p; })) arr.push({ lemma: lemma, tense: t, p: p });
          });
        });
      });
      participlesOf(lemma).forEach(function (pp) {
        pp = pp.toLowerCase();
        [pp, pp.replace(/o$/, "a"), pp.replace(/o$/, "os"), pp.replace(/o$/, "as"), pp.replace(/e$/, "es")].forEach(function (x) { if (!PIDX[x]) PIDX[x] = lemma; });
      });
      try { var gg = bareForm(K.gerund(lemma)); if (gg) GIDX[gg.toLowerCase()] = lemma; } catch (e) { /* */ }
    });
  }

  function verbForms(w) {
    if (!VIDX) buildVerbIndex();
    return VIDX[w] || [];
  }
  function participleOf(w) {
    if (!PIDX) buildVerbIndex();
    return PIDX[w] || null;
  }
  function gerundOf(w) {
    if (!GIDX) buildVerbIndex();
    return GIDX[w] || (/[aei]ndo$/.test(w) && w.length > 5 && isInfinitive(w.replace(/ndo$/, "r")) ? w.replace(/ndo$/, "r") : null);
  }
  function isInfinitive(w) {
    if (!LIDX) buildVerbIndex();
    if (!/(ar|er|ir|or|ôr)$/.test(w)) return false;
    return !!(LIDX[w] || DATA.verbs[w]);
  }
  function isVerbish(w) { return !!(w && (verbForms(w).length || participleOf(w) || gerundOf(w) || isInfinitive(w))); }
  function finite(w) {
    return verbForms(w).some(function (v) { return v.tense !== "infPessoal" || /(es|mos|des|em)$/.test(w); });
  }

  /* Conjugación regular hecha acá, para reconocer la regularización aunque
     el conjugador no la ofrezca: fazer → *fazi*, saber → *sabo*. */
  var REG = {
    presente: { ar: ["o", "as", "a", "amos", "ais", "am"], er: ["o", "es", "e", "emos", "eis", "em"], ir: ["o", "es", "e", "imos", "is", "em"] },
    perfeito: { ar: ["ei", "aste", "ou", "amos", "astes", "aram"], er: ["i", "este", "eu", "emos", "estes", "eram"], ir: ["i", "iste", "iu", "imos", "istes", "iram"] },
    imperfeito: { ar: ["ava", "avas", "ava", "ávamos", "áveis", "avam"], er: ["ia", "ias", "ia", "íamos", "íeis", "iam"], ir: ["ia", "ias", "ia", "íamos", "íeis", "iam"] },
    subjPresente: { ar: ["e", "es", "e", "emos", "eis", "em"], er: ["a", "as", "a", "amos", "ais", "am"], ir: ["a", "as", "a", "amos", "ais", "am"] }
  };
  function regForms(lemma, tense) {
    var inf = String(lemma).replace(/-se$/, "");
    var m = /^(.*)(ar|er|ir)$/.exec(inf);
    if (!m) return null;
    var st = m[1], k = m[2];
    if (REG[tense]) return REG[tense][k].map(function (x) { return st + x; });
    if (tense === "futuro") return ["ei", "ás", "á", "emos", "eis", "ão"].map(function (x) { return inf + x; });
    if (tense === "condicional") return ["ia", "ias", "ia", "íamos", "íeis", "iam"].map(function (x) { return inf + x; });
    if (tense === "subjFuturo" || tense === "infPessoal") return ["", "es", "", "mos", "des", "em"].map(function (x) { return inf + x; });
    if (tense === "subjImperfeito") {
      var v = { ar: "a", er: "e", ir: "i" }[k], va = { ar: "á", er: "ê", ir: "í" }[k];
      return [v + "sse", v + "sses", v + "sse", va + "ssemos", va + "sseis", v + "ssem"].map(function (x) { return st + x; });
    }
    if (tense === "participio") return [st + (k === "ar" ? "ado" : "ido")];
    return null;
  }
  function regularForm(lemma, tense, p) {
    var K = C();
    if (K && typeof K.regular === "function") {
      try {
        var r = K.regular(lemma, tense);
        if (tense === "participio") return bareForm(Array.isArray(r) ? r[0] : r);
        if (r && r[p]) return bareForm(r[p]);
      } catch (e) { /* fall back */ }
    }
    var f = regForms(lemma, tense);
    return f ? f[tense === "participio" ? 0 : p] : null;
  }

  var TER = ["tenho", "tens", "tem", "temos", "tendes", "têm", "tinha", "tinhas", "tínhamos", "tínheis", "tinham",
             "terei", "terás", "terá", "teremos", "terão", "teria", "terias", "teríamos", "teriam",
             "tenha", "tenhas", "tenhamos", "tenham", "tivesse", "tivesses", "tivéssemos", "tivessem",
             "tiver", "tiveres", "tivermos", "tiverem", "ter", "termos", "terem", "tendo"];
  var HAVER = ["hei", "hás", "há", "havemos", "hão", "havia", "havias", "havíamos", "haviam", "haverá", "haveria",
               "haja", "hajam", "houvesse", "houvessem", "houver", "houverem", "haver", "havendo"];
  var SER = ["sou", "és", "é", "somos", "sois", "são", "era", "eras", "éramos", "eram", "fui", "foste", "foi", "fomos",
             "foram", "serei", "será", "seremos", "serão", "seria", "seríamos", "seriam", "seja", "sejam", "sejamos",
             "fosse", "fossem", "fôssemos", "for", "forem", "formos", "ser", "sido", "sendo", "estou", "está", "estamos",
             "estão", "estava", "estavam", "estive", "esteve", "estivemos", "estiveram", "esteja", "estejam", "estivesse",
             "estivessem", "estiver", "estiverem", "estar", "fica", "ficou", "ficam", "ficaram"];
  var ES_HABER = dict({ he: 0, has: 1, ha: 2, hemos: 3, han: 5, "había": 0, habia: 0, "habían": 5, habian: 5, "habíamos": 3, habiamos: 3 });

  var TENSE_ES = {
    presente: "presente", perfeito: "pretérito perfeito", imperfeito: "pretérito imperfeito",
    maisQuePerfeito: "mais-que-perfeito simples", futuro: "futuro do presente", condicional: "futuro do pretérito (condicional)",
    subjPresente: "presente do subjuntivo", subjImperfeito: "imperfeito do subjuntivo", subjFuturo: "futuro do subjuntivo",
    infPessoal: "infinitivo pessoal"
  };
  var PERS_ES = ["eu", "tu", "ele / ela / você", "nós", "vós", "eles / elas / vocês"];

  /* --------------------------------------------- español dentro del portugués
     Palabras del castellano (rioplatense) que no existen en portugués, o que
     existen con otro sentido y un hispanohablante escribe con el sentido
     español.  Clave sin tildes.  Las que coinciden con una palabra portuguesa
     (casa, mesa, nada, comer, para…) no están. */
  var ES_PT = dict();
  ("el:o la:a los:os las:as un:um unos:uns unas:umas del:do al:ao y:e con:com sin:sem pero:mas hasta:até " +
   "muy:muito mucho:muito mucha:muita muchos:muitos muchas:muitas poco:pouco poca:pouca pocos:poucos pocas:poucas " +
   "tambien:também tampoco:também_não entonces:então ahora:agora siempre:sempre todavia:ainda ya:já aun:ainda " +
   "despues:depois luego:depois manana:amanhã hoy:hoje ayer:ontem anoche:ontem_à_noite aca:aqui alla:lá ahi:aí asi:assim " +
   "quizas:talvez quiza:talvez casi:quase mientras:enquanto aunque:embora pues:pois donde:onde adonde:aonde cuando:quando " +
   "cual:qual cuales:quais cuanto:quanto cuanta:quanta cuantos:quantos cuantas:quantas quien:quem quienes:quem " +
   "yo:eu ella:ela ellas:elas ellos:eles nosotros:nós nosotras:nós vosotros:vocês usted:você ustedes:vocês " +
   "mi:meu/minha mis:meus/minhas tus:teus/tuas sus:seus/suas nuestro:nosso nuestra:nossa nuestros:nossos nuestras:nossas " +
   "conmigo:comigo le:lhe les:lhes lo:o esto:isto eso:isso ese:esse esa:essa esos:esses esas:essas aquello:aquilo " +
   "es:é son:são soy:sou eres:é/és fue:foi fueron:foram estoy:estou estan:estão estaba:estava estaban:estavam " +
   "hay:há/tem habia:havia/tinha tengo:tenho tienes:tem/tens tiene:tem tenemos:temos tienen:têm tenia:tinha tuve:tive tuvo:teve " +
   "quiero:quero quieres:quer quiere:quer quieren:querem queremos:queremos puedo:posso puedes:pode puede:pode pueden:podem " +
   "hago:faço haces:faz hace:faz hacen:fazem hice:fiz hizo:fez hacer:fazer hecho:feito voy:vou vas:vai va:vai van:vão " +
   "dice:diz dicen:dizem dijo:disse dije:disse decir:dizer vengo:venho viene:vem vienen:vêm venir:vir salgo:saio sale:sai salir:sair " +
   "llego:chego llega:chega llegar:chegar llamo:chamo llama:chama llamar:chamar llevo:levo lleva:leva llevar:levar llueve:chove llover:chover " +
   "hablo:falo habla:fala hablar:falar hable:falei hablamos:falamos hablan:falam trabaja:trabalha trabajar:trabalhar trabaje:trabalhei " +
   "vivir:viver/morar gusta:gosta gustan:gostam gustar:gostar gusto:gosto necesito:preciso necesita:precisa necesitar:precisar " +
   "conozco:conheço conoce:conhece conocer:conhecer empiezo:começo empieza:começa empezar:começar vuelvo:volto vuelve:volta volver:voltar " +
   "juego:jogo juega:joga jugar:jogar/brincar escribo:escrevo escribe:escreve escribir:escrever leo:leio duermo:durmo duerme:dorme " +
   "pienso:penso/acho piensa:pensa entiendo:entendo entiende:entende prefiero:prefiro pido:peço oigo:ouço oir:ouvir " +
   "miro:olho mira:olha mirar:olhar escucho:escuto/ouço escuchar:escutar/ouvir traer:trazer traigo:trago pongo:ponho poner:pôr pone:põe " +
   "quedo:fico quede:fiquei quedamos:ficamos quedarse:ficar quedar:ficar sabe:sabe se:sei " +
   "ano:ano anos:anos mujer:mulher mujeres:mulheres hombre:homem hombres:homens nino:menino/criança nina:menina ninos:crianças/meninos " +
   "hijo:filho hija:filha hijos:filhos hermano:irmão hermana:irmã hermanos:irmãos madre:mãe padres:pais abuela:avó abuelo:avô abuelos:avós " +
   "esposo:marido novio:namorado novia:namorada ciudad:cidade calle:rua pueblo:povo/cidadezinha barrio:bairro playa:praia playas:praias " +
   "leche:leite queso:queijo huevo:ovo huevos:ovos pan:pão agua:água vino:vinho cerveza:cerveja pollo:frango " +
   "manzana:maçã naranja:laranja silla:cadeira ventana:janela puerta:porta libro:livro libros:livros cuaderno:caderno dinero:dinheiro " +
   "plata:dinheiro perro:cachorro perros:cachorros mes:mês cosa:coisa cosas:coisas nadie:ninguém alguien:alguém ningun:nenhum " +
   "ninguno:nenhum ninguna:nenhuma bueno:bom buena:boa buenos:bons buenas:boas malo:mau/ruim pequeno:pequeno nuevo:novo nueva:nova " +
   "nuevos:novos viejo:velho vieja:velha feo:feio fea:feia bien:bem mejor:melhor peor:pior hola:oi/olá gracias:obrigado/obrigada " +
   "adios:tchau perdon:desculpa noche:noite noches:noites fiesta:festa tiempo:tempo trabajo:trabalho vez:vez veces:vezes " +
   "juntos:juntos mucho:muito nunca:nunca cumpleanos:aniversário apellido:sobrenome computadora:computador celular:celular " +
   "colectivo:ônibus subte:metrô heladera:geladeira auto:carro departamento:apartamento vereda:calçada remera:camiseta " +
   "pollera:saia campera:jaqueta anteojos:óculos zapatos:sapatos zapatillas:tênis desayuno:café_da_manhã almuerzo:almoço " +
   "cena:jantar merienda:lanche manteca:manteiga jugo:suco durazno:pêssego frutilla:morango azucar:açúcar cuchara:colher " +
   "cuchillo:faca tenedor:garfo taza:xícara bano:banheiro cocina:cozinha jefe:chefe sueldo:salário reunion:reunião " +
   "lluvia:chuva nieve:neve futbol:futebol rico:gostoso lindo:lindo cansado:cansado aburrido:entediado/chato enojado:bravo/irritado " +
   "ropa:roupa pelo:cabelo ojos:olhos ojo:olho cabeza:cabeça mano:mão manos:mãos pie:pé pies:pés boca:boca corazon:coração " +
   "cancion:canção canciones:canções nacion:nação cuidad:cidade verdad:verdade universidad:universidade facultad:faculdade " +
   "semana:semana hora:hora horas:horas dia:dia dias:dias manana:amanhã tarde:tarde medio:meio media:meia cuarto:quarto " +
   "bailar:dançar baile:dança cantar:cantar escuela:escola maestro:professor maestra:professora alumno:aluno alumna:aluna " +
   "companero:colega companera:colega trabajadores:trabalhadores gente:gente pais:país paises:países mundo:mundo historia:história " +
   "iglesia:igreja rey:rei reina:rainha guerra:guerra ejercito:exército pueblos:povos esclavitud:escravidão esclavos:escravos " +
   "libertad:liberdade sociedad:sociedade ciudadano:cidadão ciudadanos:cidadãos derecho:direito derechos:direitos lucha:luta " +
   "siglo:século siglos:séculos llegada:chegada").split(" ").forEach(function (x) {
    var p = x.split(":");
    var pt = p[1].replace(/_/g, " ");
    if (deaccent(p[0]) !== deaccent(pt.split("/")[0])) ES_PT[p[0]] = pt.replace(/\//g, " / ");
  });
  ("contento:contente contenta:contente contentos:contentes mío:meu mía:minha míos:meus tuyo:teu tuya:tua suyo:seu suya:sua " +
   "ducho:tomo_banho ducha:banho ducharme:tomar_banho divertase:divirta-se diviértase:divirta-se personas:pessoas morir:morrer " +
   "muero:morro murió:morreu datos:dados una:uma sea:seja dale:bora trae:traz traes:traz traer:trazer estudio:estudo " +
   "cuarenta:quarenta cuatro:quatro siete:sete ocho:oito nueve:nove diez:dez once:onze trece:treze quince:quinze " +
   "veinte:vinte treinta:trinta sesenta:sessenta ochenta:oitenta cien:cem ciento:cento " +
   "primero:primeiro tercero:terceiro después:depois lejos:longe arriba:em_cima abajo:embaixo " +
   "izquierda:esquerda derecha:direita hijos:filhos llave:chave llaves:chaves lluvioso:chuvoso " +
   "embarazada:grávida embarazadas:grávidas embarazo:gravidez exquisito:delicioso/gostoso exquisita:deliciosa/gostosa " +
   "enamorado:apaixonado enamorada:apaixonada crianza:criação sobrenombre:apelido").split(" ").forEach(function (x) {
    var p = x.split(":"); if (p[0] !== p[1]) ES_PT[p[0]] = p[1].replace(/_/g, " ").replace(/\//g, " / ");
  });
  // Notas para el español que se parece a otra palabra portuguesa.
  var ES_NOTE = dict({ embarazada: "Ojo: *embaraçada* existe, pero es «avergonzada».", embarazadas: "Ojo: *embaraçadas* es «avergonzadas».",
    exquisito: "Ojo: *esquisito* existe, pero es «raro».", exquisita: "Ojo: *esquisita* es «rara».",
    sobrenombre: "*Apelido* es el apodo; el apellido es *sobrenome*.", enamorado: "*Namorado* es el novio; enamorado es *apaixonado*." });
  // Con la eñe, la clave es la palabra tal cual (año ≠ ano).
  ("año:ano años:anos niño:menino/criança niña:menina niños:crianças/meninos mañana:amanhã pequeño:pequeno pequeña:pequena " +
   "cumpleaños:aniversário señor:senhor señora:senhora baño:banheiro compañero:colega compañera:colega español:espanhol " +
   "españoles:espanhóis españa:Espanha sueño:sonho montaña:montanha enseñar:ensinar").split(" ").forEach(function (x) {
    var p = x.split(":"); ES_PT[p[0]] = p[1].replace(/\//g, " / ");
  });
  // Estructuras de dos palabras.
  var ES_BIGRAM = dict({ "lo que": ["o que", "«Lo que» = *o que*: o que eu quero."],
    "me gusta": ["eu gosto (de)", "En portugués gostar va al revés que gustar: *eu gosto de* + lo que gusta."],
    "me gustan": ["eu gosto (de)", "En portugués gostar va al revés que gustar: *eu gosto de* + lo que gusta."],
    "te gusta": ["você gosta (de)", "*Você gosta de…?*: la persona es el sujeto de gostar."],
    "hay que": ["é preciso / tem que", "«Hay que» = *é preciso* (formal) o *tem que* (habla)."],
    "a veces": ["às vezes", "«A veces» = *às vezes*, con crase."],
    "sin embargo": ["no entanto / porém", "«Sin embargo» = *no entanto*, *porém*, *entretanto*."],
    "todo el": ["todo o", "«Todo el» = *todo o* (todo o dia)."],
    "a la": ["à", "*a + a = à* (con crase)."], "de la": ["da", "*de + a = da*."], "en la": ["na", "*em + a = na*."],
    "en el": ["no", "*em + o = no*."], "de el": ["do / dele", "*de + o = do*; *de + ele = dele*."] });

  /* Falsos amigos: palabra portuguesa → [lo que significa en portugués, lo que
     quisiste decir (en portugués), nota]. */
  var FALSOS = dict({
    esquisito: ["raro, extraño", "gostoso / delicioso", "«Exquisito» es *delicioso* o *gostoso*; *esquisito* es raro."],
    esquisita: ["rara, extraña", "gostosa / deliciosa", ""],
    polvo: ["pulpo", "pó / poeira", "El polvo es *pó* o *poeira*; *polvo* es el pulpo."],
    borracha: ["goma de borrar; caucho", "bêbada", "«Borracha» (que tomó de más) es *bêbada*; *borracha* es la goma."],
    borracho: ["(no existe)", "bêbado", "«Borracho» es *bêbado*."],
    apelido: ["apodo", "sobrenome", "«Apellido» es *sobrenome*; *apelido* es el apodo."],
    oficina: ["taller (mecánico)", "escritório", "La oficina es el *escritório*; *oficina* es el taller."],
    oficinas: ["talleres", "escritórios", ""],
    "embaraçada": ["avergonzada, confundida", "grávida", "«Embarazada» es *grávida*; *embaraçada* es avergonzada."],
    "embaraçado": ["avergonzado, confundido", "", ""],
    largo: ["ancho", "comprido / longo", "«Largo» es *comprido* o *longo*; *largo* es ancho."],
    larga: ["ancha", "comprida / longa", ""],
    pelado: ["desnudo", "careca", "«Pelado» (sin pelo) es *careca*; *pelado* es desnudo."],
    cena: ["escena", "jantar", "La cena es el *jantar*; *cena* es una escena."],
    sobremesa: ["postre", "conversa depois da refeição", "*Sobremesa* es el postre."],
    rato: ["ratón", "momento / instante", "«Un rato» es *um tempinho*, *um momento*; *rato* es el ratón."],
    vaso: ["maceta, florero (o inodoro)", "copo", "El vaso para tomar es *copo*; *vaso* es una maceta o un florero."],
    copa: ["copa de árbol, trofeo; comedor diario", "taça", "La copa de vino es *taça*."],
    presunto: ["jamón", "suposto", "«Presunto» (supuesto) es *suposto*; *presunto* es el jamón."],
    cadeira: ["silla", "quadril", "La cadera es el *quadril*; *cadeira* es la silla."],
    aceite: ["aceptación; acepté", "azeite / óleo", "El aceite es *azeite* (de oliva) u *óleo*."],
    brincar: ["jugar (los chicos); bromear", "pular", "*Brincar* es jugar o bromear; brincar (saltar) es *pular*."],
    pegar: ["agarrar, tomar; contagiar", "bater / colar", "«Pegar» (golpear) es *bater*; (con pegamento) *colar*."],
    fechar: ["cerrar", "datar", "*Fechar* es cerrar (fechar a porta)."],
    firma: ["empresa", "assinatura", "La firma de un documento es la *assinatura*; *firma* es una empresa."],
    propina: ["soborno", "gorjeta", "La propina es la *gorjeta*; *propina* es un soborno."],
    cola: ["pegamento", "fila", "La cola de gente es la *fila*; *cola* es el pegamento."],
    novela: ["telenovela", "romance", "La novela (el libro) es *romance*; *novela* es la telenovela."],
    escova: ["cepillo", "vassoura", "La escoba es la *vassoura*; *escova* es el cepillo."],
    garrafa: ["botella", "botijão", "*Garrafa* es la botella."],
    talher: ["cubierto", "oficina", "El taller es la *oficina*; *talher* es un cubierto."],
    pronto: ["listo", "logo / em breve", "«Pronto» (dentro de poco) es *logo* o *em breve*; *pronto* es listo."],
    latido: ["ladrido", "batimento", "El latido del corazón es el *batimento*; *latido* es el ladrido."],
    salsa: ["perejil", "molho", "La salsa es el *molho*; *salsa* es el perejil."],
    roxo: ["violeta", "vermelho", "Rojo es *vermelho*; *roxo* es violeta."],
    roxa: ["violeta", "vermelha", "Roja es *vermelha*; *roxa* es violeta."],
    aborrecido: ["molesto, fastidiado", "entediado / chato", "«Aburrido» es *entediado* (el que se aburre) o *chato* (lo que aburre)."],
    cachorro: ["perro", "filhote", "*Cachorro* en Brasil es el perro; la cría es el *filhote*."],
    contestar: ["cuestionar, impugnar", "responder", "«Contestar» (responder) es *responder*."],
    contestei: ["cuestioné", "respondi", ""],
    reparar: ["notar, fijarse", "consertar", "«Reparar» (arreglar) es *consertar*; *reparar* es notar."],
    botar: ["poner", "jogar fora", "«Botar» (tirar a la basura) es *jogar fora*; *botar* es poner."],
    tirar: ["sacar (tirar uma foto)", "jogar / atirar", "«Tirar» (arrojar) es *jogar* o *atirar*; *tirar* es sacar."],
    noivo: ["prometido, el novio de la boda", "namorado", "El novio (la pareja) es el *namorado*."],
    noiva: ["prometida, la novia de la boda", "namorada", "La novia (la pareja) es la *namorada*."],
    ninho: ["nido", "menino", "El niño es *menino* o *criança*; *ninho* es el nido."],
    quedar: ["caer (poco usado)", "ficar", "«Quedarse» es *ficar*."],
    logo: ["enseguida, pronto", "depois", "«Luego» (después) es *depois*; *logo* es enseguida."],
    mala: ["valija", "má / ruim", "«Mala» (adjetivo) es *má* o *ruim*; *mala* es la valija."],
    padre: ["cura, sacerdote", "pai", "El padre es el *pai*; *padre* es el cura."],
    berro: ["grito", "agrião", "*Berro* es un grito."],
    tapa: ["cachetada", "tampa", "La tapa de algo es la *tampa*; *tapa* es una cachetada."],
    desenvolver: ["desarrollar", "desembrulhar", "*Desenvolver* es desarrollar."],
    exquisito: ["(no existe)", "delicioso / gostoso", "«Exquisito» es *delicioso* o *gostoso*."],
    "assinatura": ["firma; suscripción", "", ""],
    ligar: ["llamar por teléfono; encender; conectar", "", "*Ligar* es llamar por teléfono (te ligo amanhã) o encender."],
    acordar: ["despertar(se); acordar (un trato)", "lembrar", "«Acordarse» es *lembrar(-se)*; *acordar* es despertarse."],
    acordo: ["me despierto; acuerdo", "lembro", ""],
    acordei: ["me desperté", "lembrei", ""]
  });

  /* Heterogenéricos: el género en portugués no es el del español. */
  var HETERO = dict({ leite: "m", sangue: "m", nariz: "m", mel: "m", sal: "m", costume: "m", legume: "m", cume: "m",
    creme: "m", alarme: "m", sinal: "m", samba: "m", computador: "m", time: "m", paradoxo: "m",
    "árvore": "f", ponte: "f", dor: "f", cor: "f", viagem: "f", origem: "f", garagem: "f", mensagem: "f", paisagem: "f",
    coragem: "f", bagagem: "f", passagem: "f", vantagem: "f", linguagem: "f", homenagem: "f", massagem: "f", reportagem: "f",
    "análise": "f", equipe: "f", estreia: "f", fraude: "f", "síndrome": "f", desordem: "f", ordem: "f", aprendizagem: "f",
    "lágrima": "f", tribo: "f", "hélice": "f", "cútis": "f" });
  var HETERO_ES = dict({ leite: "la leche", sangue: "la sangre", nariz: "la nariz", mel: "la miel", sal: "la sal",
    costume: "la costumbre", legume: "la legumbre", cume: "la cumbre", creme: "la crema", alarme: "la alarma", sinal: "la señal",
    samba: "la samba", computador: "la computadora", "árvore": "el árbol", ponte: "el puente", dor: "el dolor", cor: "el color",
    viagem: "el viaje", origem: "el origen", garagem: "el garaje", mensagem: "el mensaje", paisagem: "el paisaje",
    coragem: "el coraje", bagagem: "el equipaje", passagem: "el pasaje", vantagem: "la ventaja", linguagem: "el lenguaje",
    homenagem: "el homenaje", massagem: "el masaje", "análise": "el análisis", equipe: "el equipo", estreia: "el estreno",
    fraude: "el fraude", "síndrome": "el síndrome", desordem: "el desorden", ordem: "el orden", reportagem: "el reportaje",
    aprendizagem: "el aprendizaje" });

  // The gender of a noun, when some table knows it.
  function nounGender(w) {
    if (!w) return null;
    var n = DATA.nouns[w] || DATA.nounsByPlural[w];
    if (n && n.g) return n.g;
    if (HETERO[w]) return HETERO[w];
    var s = w.replace(/s$/, "");
    if (HETERO[s]) return HETERO[s];
    if (/agens?$/.test(w)) return "f";
    if (/(ções|ção|dades?|gens?)$/.test(w)) return "f";
    return null;
  }

  // For echoes only: a noun's likely gender from its ending.
  function guessGender(w) {
    if (!w) return null;
    var g = nounGender(w);
    if (g) return g;
    if (/(a|as|ção|ções|dade|dades|gem|gens)$/.test(w) && !/(ma|mas|ista|istas)$/.test(w)) return "f";
    if (/(o|os)$/.test(w)) return "m";
    return null;
  }

  function spanishWord(w) {
    var raw = String(w).toLowerCase();
    if (ES_PT[raw]) return /ñ/.test(raw) || !isPortuguese(raw) ? ES_PT[raw] : null;
    var k = deaccent(raw);
    if (isPortuguese(raw) || (raw === k && isPortuguese(k))) return null;
    var bank = DATA.esPt[k] || DATA.esPt[raw];
    return ES_PT[k] || (bank ? bank[0] : null);
  }

  /* Una palabra que no está en ningún diccionario pero tiene pinta de
     castellano: ñ, ll, -ción, -dad, -ble, -aje, -miento, diptongos ue/ie,
     -ón o -én finales con tilde aguda, imperfecto en -aba. */
  function looksSpanish(w) {
    var x = String(w).toLowerCase();
    if (!/^[a-zà-ÿ]+$/.test(x) || isPortuguese(x)) return false;
    if (/ñ/.test(x) || /ll/.test(x)) return true;
    if (/(ción|ciones|sión|siones|dad|tad|miento|mientos|aje|ajes)$/.test(x)) return true;   // -dades is Portuguese too (cidades, possibilidades)
    if (/[^aeiouáéíóú]ble[s]?$/.test(x)) return true;
    if (/(ón|én|ués|ía[sn]?)$/.test(x) && !/(ía|ías)$/.test(x)) return true;
    if (/[^qg]ue/.test(x) && x.length > 3 && !/(ue[mi]|uen|uei|ueu)$/.test(x) && !/uen(te|tes|cia|cias|temente)$/.test(x) && !/^(cruel|duelo|duelos|suéter|suéteres)$/.test(x)) return true;
    if (/(aba|abas|aban|ábamos)$/.test(x) && x.length > 4 && !/[áéíóúâêô]/.test(x.replace(/ábamos$/, ""))) return true;   // not sílaba
    // gerundio en -iendo, pasados y futuros con la tilde del español
    // (entendí, volveré, prometió) y el diptongo ie (tiene, hicieron)
    if (/(iendo|ió)$/.test(x)) return true;
    // the accent of the Spanish verb endings on a Portuguese verb (comí, hablé, volveré);
    // not jiló, jacaré, forró, Piauí: those are Portuguese words the lexicon may lack
    if (/[aei]ré$/.test(x) && isInfinitive(x.slice(0, -1)) || /[éí]$/.test(x) && x.length > 3 && verbForms(deaccent(x)).length) return true;
    // the Spanish diphthong ie where Portuguese has e (tiempo → tempo, siempre → sempre),
    // not hierarquia, frieza, piedade, Vieira
    if (/[^c]ie/.test(x) && x.length > 4) {
      var noIe = x.replace(/ie/g, "e");
      if (isPortuguese(noIe) || isPortuguese(deaccent(noIe)) || DATA.esPt[deaccent(x)]) return true;
    }
    if (/(amos|emos|imos)$/.test(x)) return false;
    if (/[^aeiou]os$/.test(x) && x.length > 5 && DATA.lex[x.slice(0, -1)]) return false;
    if (/(ar|er|ir)se$/.test(x)) return true;
    return false;
  }
  function spanishish(w) { return !!spanishWord(w) || looksSpanish(w); }

  /* Palabras funcionales y muy frecuentes del portugués: lo que está acá es
     portugués aunque el banco todavía no lo tenga. */
  var PT_COMMON = dict();
  ("o a os as um uma uns umas de do da dos das em no na nos nas ao aos à às por pelo pela pelos pelas para pra pro com sem " +
   "até entre sobre contra desde após sob e ou mas porém que se como quando onde porque por quê porquê quem qual quais quanto " +
   "quanta quantos quantas não sim já ainda também só muito muita muitos muitas pouco pouca poucos poucas mais menos bem mal " +
   "melhor pior eu tu ele ela nós vós eles elas você vocês me te se lhe lhes nos vos mim ti si comigo contigo conosco consigo " +
   "meu minha meus minhas teu tua teus tuas seu sua seus suas nosso nossa nossos nossas dele dela deles delas nele nela neles nelas " +
   "este esta estes estas esse essa esses essas aquele aquela aqueles aquelas isto isso aquilo neste nesta nesse nessa naquele naquela " +
   "deste desta desse dessa daquele daquela disso disto daquilo nisso nisto àquele àquela aqui aí ali lá cá hoje ontem amanhã agora " +
   "depois antes sempre nunca jamais talvez então logo tarde cedo aliás inclusive todo toda todos todas tudo nada ninguém alguém " +
   "algum alguma alguns algumas nenhum nenhuma outro outra outros outras cada mesmo mesma próprio própria tão tanto tanta tantos " +
   "tantas ano anos dia dias mês meses semana semanas hora horas vez vezes coisa coisas gente casa rua cidade praia mar sol " +
   "negro negra negros negras sílaba sílabas secretaria secretarias " +
   "obrigado obrigada oi olá tchau tá tô tás tava tavam cê cês né cadê bora vamo valeu grana bacana busão galera beleza pois assim embora enquanto caso senão aonde daqui dali aí " +
   "segunda terça quarta quinta sexta sábado domingo feira janeiro fevereiro março abril maio junho julho agosto setembro " +
   "outubro novembro dezembro zero dois duas três quatro cinco seis sete oito nove dez onze doze treze quatorze catorze quinze " +
   "dezesseis dezessete dezoito dezenove vinte trinta quarenta cinquenta sessenta setenta oitenta noventa cem cento mil milhão " +
   "primeiro primeira segundo segunda terceiro terceira último última meio meia bom boa bons boas mau má ótimo ótima grande " +
   "grandes pequeno pequena novo nova velho velha lindo linda bonito bonita feio feia maior menor jovem legal chato chata " +
   "carioca cariocas brasileiro brasileira brasileiros brasileiras português portuguesa argentino argentina argentinos " +
   "homem homens mulher mulheres menino menina criança crianças pai mãe pais filho filha irmão irmã avô avó amigo amiga " +
   "copacabana ipanema arpoador lapa botafogo leblon niterói maceió samba bossa nova calçadão boteco feira metrô ônibus carro").split(" ").forEach(function (w) { PT_COMMON[w] = 1; });

  function isPortuguese(w) {
    return !!(PT_COMMON[w] || DATA.lex[w] || ARTICLES[w] || prepInfo(w) || verbForms(w).length ||
              participleOf(w) || (GIDX || buildVerbIndex() || GIDX)[w] || CLITICS.indexOf(w) >= 0 || SUBJECTS.indexOf(w) >= 0 ||
              TER.indexOf(w) >= 0 || HAVER.indexOf(w) >= 0 || SER.indexOf(w) >= 0 || POSSESSIVE.indexOf(w) >= 0);
  }

  /* Antes de decir «no es una palabra portuguesa» o «no existe»: el léxico
     del curso y del banco (isPortuguese), el glosario y las palabras que la
     app agregue con addWords(), las formas del habla (REGISTRO) y, si está
     cargada, la frecuencia de los subtítulos (window.Freq, sin las palabras
     del español que se cuelan en ellos). */
  var EXTRA_LEX = dict();
  function addWords(list) {
    (list || []).forEach(function (w) {
      String(w || "").toLowerCase().split(/[\s,;/()]+/).forEach(function (x) { if (/^[a-zà-ÿ-]{2,}$/.test(x)) EXTRA_LEX[x] = 1; });
    });
  }
  function knownWord(w) {
    if (!w) return false;
    if (isPortuguese(w) || EXTRA_LEX[w] || REGISTRO.forms[w]) return true;
    var F = root.Freq;
    if (F && F.loaded && F.loaded() && !spanishWord(w) && !looksSpanish(w)) {
      try { var inf = F.info(w); if (inf && Math.max(inf[0], inf[1]) >= 3.3) return true; } catch (e) { /* */ }
    }
    return false;
  }

  /* Un ejercicio de hueco («___ praia», «Eu ___ (ir) ao cinema»): la
     respuesta se juzga dentro de su oración, así las reglas ven el
     sustantivo después del artículo, el sujeto antes del verbo. */
  function expandGap(stem, given, targets) {
    if (!stem || !/_{3,}/.test(stem)) return null;
    var clean = String(stem).replace(/\([^)]*\)/g, " ").replace(/\s+/g, " ").trim();
    // «de + aquele → ___», «a flor → as ___»: what is before the arrow is
    // the prompt, not the sentence the answer goes into.
    var arrow = clean.lastIndexOf("→", clean.search(/_{3,}/)), lead = "";
    if (arrow >= 0) { lead = clean.slice(0, arrow).trim(); clean = clean.slice(arrow + 1).trim(); }
    var pieces = clean.split(/_{3,}/);
    var nGaps = pieces.length - 1;
    for (var i = 0; i < nGaps; i++) {
      var before = pieces[i].slice(-1), after = pieces[i + 1].charAt(0);
      if ((before && /[a-zà-ÿ'-]/i.test(before)) || (after && /[a-zà-ÿ'-]/i.test(after))) return null;
    }
    var fill = function (parts) {
      if (!parts || parts.length !== nGaps) return null;
      var out = pieces[0];
      for (var k = 0; k < nGaps; k++) out += parts[k] + pieces[k + 1];
      return out.replace(/\s+/g, " ").trim();
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
    return { given: g2, targets: t2, lead: lead };
  }

  // The singular an exercise names («limão → ___», «___ (papel)»).
  function singularFromStem(stem) {
    var m = /([a-zà-ÿ]+)\s*→\s*_{3,}/i.exec(stem || "") || /\(([a-zà-ÿ]+)\)/i.exec(stem || "");
    return m ? m[1].toLowerCase() : null;
  }

  // Why this plural: the ending rule, in one line.
  function pluralExplain(s, e) {
    if (!s) return "Plural: " + it(e) + ".";
    var rule;
    if (s === e) rule = "no cambia en plural (las palabras llanas en -s y en -x son invariables: o ônibus / os ônibus, o lápis / os lápis)";
    else if (/ão$/.test(s) && /ões$/.test(e)) rule = "-ão hace casi siempre -ões (limão → limões, avião → aviões, estação → estações)";
    else if (/ão$/.test(s) && /ães$/.test(e)) rule = "unas pocas en -ão hacen -ães: pão → pães, cão → cães, alemão → alemães, capitão → capitães";
    else if (/ão$/.test(s) && /ãos$/.test(e)) rule = "unas pocas en -ão hacen -ãos: mão → mãos, irmão → irmãos, cidadão → cidadãos, cristão → cristãos";
    else if (/al$/.test(s)) rule = "-al hace -ais (animal → animais, jornal → jornais)";
    else if (/el$/.test(s)) rule = "-el con el acento en la última sílaba hace -éis (papel → papéis, hotel → hotéis)";
    else if (/ol$/.test(s)) rule = "-ol hace -óis (lençol → lençóis, farol → faróis)";
    else if (/ul$/.test(s)) rule = "-ul hace -uis (azul → azuis)";
    else if (/il$/.test(s) && /eis$/.test(e)) rule = "-il sin acento (fácil, difícil) hace -eis (fácil → fáceis, difícil → difíceis)";
    else if (/il$/.test(s)) rule = "-il con el acento en la última sílaba hace -is (barril → barris, funil → funis)";
    else if (/m$/.test(s)) rule = "-m hace -ns (homem → homens, jardim → jardins, som → sons)";
    else if (/[rzs]$/.test(s)) rule = "-r, -z y la -s de las palabras con el acento al final y de las de una sílaba agregan -es (flor → flores, luz → luzes, mês → meses)";
    else if (/[aeiouáéíóúâêô]$/.test(s)) rule = "las que terminan en vocal agregan -s";
    else rule = "plural irregular, de memoria";
    return "Plural: " + it(s) + " → " + it(e) + ": " + rule + ".";
  }

  // A regular plural a learner would make (and the Spanish one).
  function naivePlurals(s) {
    var out = [s, s + "s", s + "es"];
    if (/ão$/.test(s)) out.push(s.replace(/ão$/, "ões"), s.replace(/ão$/, "ães"), s.replace(/ão$/, "ãos"), s.replace(/ão$/, "ones"));
    if (/l$/.test(s)) out.push(s + "s", s + "es", s.replace(/l$/, "is"), s.replace(/l$/, "les"));
    if (/m$/.test(s)) out.push(s + "s", s.replace(/m$/, "ns"), s.replace(/m$/, "nes"), s + "es");
    return out;
  }

  /* ------------------------------------------------ diagnóstico de pares */

  // Pares con tilde diacrítica que cambian el sentido.
  var DIACRITIC = dict({
    "e|é": "*é* con tilde es el verbo (es); *e* sin tilde es la conjunción «y».",
    "da|dá": "*dá* con tilde es el verbo dar (da); *da* sin tilde es *de + a*.",
    "de|dê": "*dê* con circunflejo es el subjuntivo de dar; *de* es la preposición.",
    "esta|está": "*está* con tilde es el verbo estar; *esta* sin tilde es el demostrativo (esta casa).",
    "que|quê": "*quê* con circunflejo va solo al final de la frase (por quê?, o quê?); en el medio, *que* (por que você não vem?).",
    "por|pôr": "*pôr* con circunflejo es el verbo (poner); *por* es la preposición.",
    "pode|pôde": "*pôde* con circunflejo es el pasado (pudo); *pode*, el presente (puede).",
    "tem|têm": "*têm* con circunflejo es el plural (eles têm); *tem*, el singular (ele tem).",
    "vem|vêm": "*vêm* con circunflejo es el plural (eles vêm); *vem*, el singular (ele vem).",
    "nos|nós": "*nós* con tilde es el pronombre sujeto (nosotros); *nos* es átono (nos vemos) o *em + os*.",
    "a|há": "*há* es el verbo haver (hay, hace: há dois anos); *a* es artículo o preposición.",
    "ha|há": "*há* lleva tilde: es el verbo haver (hay, hace: há dois anos).",
    "avo|avó": "*avó* (ó abierta) es la abuela; *avô* (ô cerrada), el abuelo.",
    "avo|avô": "*avô* (ô cerrada) es el abuelo; *avó* (ó abierta), la abuela.",
    "avó|avô": "*avó* (ó abierta) es la abuela; *avô* (ô cerrada), el abuelo.",
    "pais|país": "*país* con tilde es el país; *pais* sin tilde son los padres (papá y mamá).",
    "sabia|sábia": "*sábia* con tilde es sabia (adjetivo); *sabia* es el verbo (sabía).",
    "secretaria|secretária": "*secretária* es la persona; *secretaria* es la oficina (la secretaría).",
    "so|só": "*só* lleva tilde: solo, solamente.",
    "tres|três": "*três* lleva circunflejo.",
    "ate|até": "*até* lleva tilde: hasta.",
    "voce|você": "*você* lleva circunflejo.",
    "esta|estás": "", "ja|já": "*já* lleva tilde: ya."
  });
  // Tildes que el Acuerdo de 1990 sacó.
  var PRE1990 = /^(idéia|idéias|assembléia|européia|européias|platéia|jóia|jóias|heróico|heróica|paranóia|estréia|colméia|geléia|boléia|apóio|vôo|vôos|enjôo|enjôos|lêem|crêem|dêem|vêem|pára|pêlo|pêra|pólo|lingüiça|lingüística|freqüente|freqüência|tranqüilo|tranqüila|conseqüência|agüentar|cinqüenta|seqüestro|bilíngüe|argüir)$/;

  // Fixed expressions: the word is not the verb form it looks like.
  var FIXED = dict({
    "ou seja": ["subjuntivo", "*Ou seja* es una fórmula fija, como «o sea» en español: siempre con *seja*."],
    "em suma": ["lexico", "*Em suma* («en suma») es una expresión fija: *suma* es el sustantivo, no un verbo."],
    "me livre": ["subjuntivo", "*Deus me livre!* es una fórmula fija, como «¡Dios me libre!»: el subjuntivo de *livrar*."]
  });

  /* Why a word carries its accent: the rule, in one line (the same rules as
     in Spanish, except the llanas ending in a diphthong: história, água). */
  function accentWhy(e) {
    if (/[áêô]-(lo|la|los|las)$/.test(e)) return " Con *-lo, -la* el verbo pierde la *-r* y queda agudo: lleva tilde si termina en -a, -e, -o (comprá-lo, fazê-lo, pô-lo; pero parti-lo).";
    var m = /^(.*?)([áéíóúâêô])([^áéíóúâêô]*)$/.exec(e);
    if (!m) return "";
    var after = m[3], before = m[1];
    if (/[íú]/.test(m[2]) && (/[aeiou]$/.test(before) || /^[aeiou]/.test(after))) {
      return " La *i* o la *u* que lleva el acento y queda separada de la vocal de al lado (hiato) lleva tilde, como en español: país, saída, saúde.";
    }
    if (/[éó]/.test(m[2]) && /^[iu]s?$/.test(after)) return " Las palabras con el acento en la última sílaba que terminan en *éi, éu, ói* abiertos llevan tilde: papéis, céu, herói, espanhóis.";
    // vowel groups after the accent; two strong vowels together are two syllables (gêmeos)
    var groups = [];
    (after.match(/[aeiouãõ]+/g) || []).forEach(function (v) { groups.push(v); for (var q = 1; q < v.length; q++) if (/[aeo]/.test(v[q]) && /[aeo]/.test(v[q - 1])) groups.push(v[q]); });
    if (!groups.length) return " Las palabras con el acento en la última sílaba (agudas) y las de una sola sílaba con acento, terminadas en -a, -e, -o (con o sin -s) y en -em, -ens llevan tilde: você, café, três, já, também.";
    if (groups.length === 1 && /^[iu][aeo]s?$/.test(after.replace(/^[^aeiou]+/, ""))) {
      return " Las palabras con el acento en la anteúltima sílaba (llanas) que terminan en dos vocales juntas (diptongo: -ia, -io, -ua) llevan tilde: história, água, ciência (en español «historia» y «agua» van sin tilde).";
    }
    if (groups.length === 1 && /(l|r|x|n|ps|ão|ãos|ã|ãs|i|is|us|um|uns|ei|eis)$/.test(e)) {
      return " Las palabras con el acento en la anteúltima sílaba (llanas) terminadas en -l, -r, -x, -i, -us, -ão llevan tilde: fácil, possível, açúcar, táxi, vírus, órfão.";
    }
    if (groups.length >= 2) return " Las palabras con el acento en la antepenúltima sílaba (esdrújulas) llevan siempre tilde, como en español: música, rápido, último.";
    return "";
  }

  // Each rule returns null or {cat, slip, hint, explain}.  Order matters:
  // grammar that a form reveals beats «that looks Spanish» or «a typo».
  function pairRules(g, e, ctx) {
    var r, gs = deaccent(g), es = deaccent(e);
    var next = ctx.e[ctx.ei + 1] || "", prev = ctx.e[ctx.ei - 1] || "";

    // 0. Two verbs with the same pronoun attached (observa-se / observam-se):
    //    the verbs are what differs.
    var spG = g.indexOf("-") > 0 && splitEnclitic(g), spE = e.indexOf("-") > 0 && splitEnclitic(e);
    if (spG && spE && spG.c === spE.c && spG.v !== spE.v && gs !== es && g.split("-").length === e.split("-").length && !ctx.inner) {
      var inner = pairRules(spG.v, spE.v, { e: ctx.e, ei: ctx.ei, g: ctx.g, gi: ctx.gi, names: ctx.names, stem: ctx.stem, nominal: false, inner: true });
      if (inner) {
        if (spE.c === "se" && inner.cat === "persona") inner = prepInfo(next) && !/m$/.test(spE.v) ? { cat: "persona", slip: false,
          hint: "Con *se*, ¿el verbo va en singular o en plural? Mirá lo que viene después.",
          explain: "Cuando el verbo lleva preposición (assistir a, precisar de, gostar de) el *se* es indeterminado y el verbo queda en singular: " + it(e + " " + next) + " (precisa-se de garçons). Solo concuerda sin preposición: vendem-se casas." } : { cat: "persona", slip: false,
          hint: "Con *se*, ¿el verbo va en singular o en plural?",
          explain: "Con el *se* pasivo el verbo concuerda con lo que viene después: " + it(e) + " (vendem-se casas, aluga-se um quarto; como «se venden casas» en español)." };
        return inner;
      }
    }

    // 1. Crase
    var CR = { "a|à": 1, "as|às": 1, "aquele|àquele": 1, "aquela|àquela": 1, "aqueles|àqueles": 1, "aquelas|àquelas": 1, "aquilo|àquilo": 1 };
    if (CR[g + "|" + e]) return { cat: "crase", slip: false,
      hint: "¿Hay acá una preposición *a* que se junta con otra *a*?",
      explain: /^(uma|duas|três|quatro|cinco|seis|sete|oito|nove|dez|onze|doze)$/.test(next) || /^\d/.test(next)
        ? "Con las horas va siempre crase: " + it(e + " " + next) + " (às três, à uma, às oito e meia)."
        : "*a* (preposición) + *a* (artículo o *aquele*) = " + it(e) + ". Truco: cambialo por un masculino; si queda *ao*, va crase (vou à praia → vou ao mercado)." };
    if (CR[e + "|" + g]) return { cat: "crase", slip: false,
      hint: "¿Esa *a* lleva acento grave?",
      explain: isVerbish(next) ? "Delante de un verbo nunca hay crase: " + it(e + " " + next) + "."
        : nounGender(next) === "m" ? "Delante de un masculino no hay crase: " + it(e + " " + next) + " (a pé, a cavalo)."
        : "Acá no hay dos *a* que se junten: va " + it(e) + " sin acento grave. Si no hay artículo (vou a Copacabana, de segunda a sexta) o antes de verbo o de masculino, no hay crase." };

    // 2. Tildes y nasales (la misma palabra con otros signos)
    if (gs === es && g !== e && !/ñ/.test(g)) {
      var key = [g, e].sort().join("|"), key3 = gs + "|" + e;
      if (PRE1990.test(g)) return { cat: "ortografia", slip: true,
        hint: "Revisá la tilde de la palabra marcada: la ortografía cambió.",
        explain: "Desde el Acuerdo Ortográfico de 1990 se escribe " + it(e) + " (ideia, voo, para, leem, linguiça: sin tilde ni diéresis)." };
      if (/[çÇ]/.test(e) && !/ç/.test(g) && g.replace(/c/g, "ç") !== g) return { cat: "ortografia", slip: true,
        hint: "Falta un signo debajo de una letra.",
        explain: "Falta la cedilla: " + it(e) + ". Antes de a, o, u la *c* suena /s/ solo con cedilla (cabeça, começo, açúcar)." };
      if (/ç[ei]/.test(g)) return { cat: "ortografia", slip: true,
        hint: "Mirá la cedilla de la palabra marcada.",
        explain: "Antes de e o i no va cedilla: " + it(e) + " (comecei, dance)." };
      var dia = DIACRITIC[key] || DIACRITIC[key3];
      if (dia && (isPortuguese(g) || /^(avo|so|tres|ate|voce|ja)$/.test(gs))) {
        var real = isPortuguese(g) && !/^(avo|so|tres|ate|voce|ja)$/.test(g);
        if (/^(tem|têm|vem|vêm)$/.test(g) && /^(tem|têm|vem|vêm)$/.test(e)) return { cat: "persona", slip: false,
          hint: "¿El sujeto es singular o plural?",
          explain: dia };
        return { cat: "tilde", slip: !real,
          hint: real ? "Mirá la palabra marcada: con y sin tilde son palabras distintas." : "Revisá la tilde.",
          explain: dia };
      }
      if (/[ãõ]/.test(e) && !/[ãõ]/.test(g)) return { cat: "nasal", slip: !isPortuguese(g),
        hint: "A la palabra marcada le falta la marca de la vocal nasal.",
        explain: "Se escribe " + it(e) + ", con til: marca la vocal nasal (não, mãe, pão, irmã, lições). Sin til es otra palabra o ninguna." };
      if (/ês?$/.test(e) && /és?$/.test(g)) return { cat: "tilde", slip: true,
        hint: "Revisá la tilde: ¿aguda o circunfleja?",
        explain: "Con circunflejo: " + it(e) + ". La *ê* es cerrada (português, você, três, mês); la tilde aguda *é* marca la *e* abierta (café, pé)." };
      if (/és?$/.test(e) && /ês?$/.test(g)) return { cat: "tilde", slip: true,
        hint: "Revisá la tilde: ¿aguda o circunfleja?",
        explain: "Con tilde aguda: " + it(e) + ". La *é* es abierta (é, café, pé); la *ê* circunfleja es cerrada (você, três, mês)." };
      if (/[áéíóúâêô]/.test(e) && !/[áéíóúâêô]/.test(g)) return { cat: "tilde", slip: true,
        hint: "Te falta una tilde.",
        explain: "Falta la tilde: " + it(e) + "." + accentWhy(e) };
      var openClose = function (a, b) {
        for (var q = 0; q < a.length && q < b.length; q++) if (a[q] !== b[q]) return [a[q], b[q]];
        return null;
      };
      var oc = openClose(g, e);
      if (oc && /[éó]/.test(oc[0]) && /[êô]/.test(oc[1])) return { cat: "tilde", slip: true,
        hint: "Revisá la tilde: ¿aguda o circunfleja?",
        explain: "Con circunflejo: " + it(e) + ". La vocal es cerrada (*ê, ô*: você, avô, vendê-la); la tilde aguda marca la abierta (*é, ó*: café, avó)." };
      if (oc && /[êô]/.test(oc[0]) && /[éó]/.test(oc[1])) return { cat: "tilde", slip: true,
        hint: "Revisá la tilde: ¿aguda o circunfleja?",
        explain: "Con tilde aguda: " + it(e) + ". La vocal es abierta (*é, ó*: café, avó, pé); el circunflejo marca la cerrada (*ê, ô*: você, avô)." };
      if (!/[áéíóúâêô]/.test(e) && /[áéíóúâêô]/.test(g) && !/[ãõ]/.test(g)) return { cat: "tilde", slip: true,
        hint: "Sobra una tilde.",
        explain: it(e) + " va sin tilde en portugués." +
          (/[íú][aeo]s?$/.test(g) ? " En español «" + g + "» la lleva para separar las vocales; en portugués " + it(e) + " se lee igual sin ella (dia, rio, tia)." :
           /[éíó]$/.test(g) && !isPortuguese(g) ? " Esa tilde es la del español." :
           /([aeo]s?|em|ens)$/.test(e) && (e.match(/[aeiou]+/g) || []).length >= 2 ? " Las palabras con el acento en la anteúltima sílaba (llanas) terminadas en -a, -e, -o, -s, -em no llevan tilde, como en español: meses, inglesa, homem." : "") };
      return { cat: "tilde", slip: true, hint: "Revisá las tildes.",
        explain: "La tilde va así: " + it(e) + "." + accentWhy(e) };
    }

    // 3. Nasal: -m final (bom, um, sim, homem) y la n española
    if (/m$/.test(e) && g === e.slice(0, -1) + "n") return { cat: "nasal", slip: false,
      hint: "Revisá cómo termina la palabra marcada.",
      explain: (ES_PT[g] || /^(con|en|un|sin|bien|también|algún|ningún)$/.test(g) ? it(g) + " es la forma del español. " : "") +
        "En portugués la nasal final se escribe con *m*: " + it(e) + " (bom, um, sim, bem, homem, também, jovem)." };
    if (/[mn][pb]/.test(g) || /n[pb]/.test(gs)) {
      var mpb = g.replace(/n([pb])/g, "m$1");
      if (mpb === e) return { cat: "nasal", slip: false, hint: "Revisá la nasal antes de p o b.",
        explain: "Antes de *p* y *b* la nasal se escribe *m*: " + it(e) + " (tempo, sempre, também, embora)." };
    }
    if (/ão$/.test(g) && e === g.replace(/ão$/, "am")) return { cat: "nasal", slip: false,
      hint: "¿La última sílaba lleva el acento o no?",
      explain: "La terminación sin acento se escribe *-am*: " + it(e) + " (falam, falaram, eram). *-ão* lleva el acento: falarão (futuro), são, estão." };
    if (/am$/.test(g) && e === g.replace(/am$/, "ão") && verbForms(e).some(function (v) { return v.tense === "futuro"; })) return { cat: "tempo", slip: false,
      hint: "¿Pasado o futuro?",
      explain: it(e) + " (futuro, tónica en -ão); " + it(g) + " es otro tiempo (átona en -am)." };

    if (g === "no" && e === "não") return { cat: "espanol", slip: false,
      hint: "¿Es la negación o *em + o*?",
      explain: "La negación es *não*: " + it("não " + next) + ". *No* existe, pero es *em + o* (no Rio, no verão)." };

    // 4. Un verbo portugués con la h del haber español o un hecho español
    if (/^(ha|he|hay)$/.test(g) && e === "há") return { cat: "espanol", slip: false,
      hint: it(g) + " suena a español. ¿Cómo se dice en portugués?",
      explain: "El «hay» existencial y el «hace» de tiempo son *há* (há muita gente, há dois anos); en el habla, *tem*." };

    // 4b. Una palabra del español que el diccionario conoce (mucho, tan, tengo)
    var early = muitoRule(g, e, ctx) || vosRule(g, e);
    if (early) return early;
    var sw0 = spanishWord(g);
    if (sw0 && (sw0.split(" / ").indexOf(e) >= 0 || sw0.split(" ").indexOf(e) >= 0)) return spanishExplain(g, e, sw0, ctx);

    // 5. Grafías del español (ñ, ll, -ción, -dad, -ble, -aje, -aba…)
    var SPELL = [
      [/ñ/g, "nh", "La ñ se escribe *nh*: senhor, amanhã, sonho.", "La *ñ* no existe en portugués: ¿cómo se escribe ese sonido?"],
      [/ñ/g, "n", "Acá la ñ del español es *n* simple (año → ano, pequeño → pequeno).", "La *ñ* no existe en portugués: ¿cómo se escribe esa palabra?"],
      [/ll/g, "lh", "La ll se escribe *lh*: trabalho, mulher, filho.", "La *ll* no existe en portugués: ¿cómo se escribe ese sonido?"],
      [/ciones$/, "ções", "-ciones se escribe *-ções*."], [/ción$/, "ção", "-ción se escribe *-ção*: canção, nação, informação."],
      [/siones$/, "sões", "-siones es *-sões*."], [/sión$/, "são", "-sión es *-são*: televisão, decisão."],
      [/zón$/, "ção", "-zón es *-ção* o *-zão*: coração, razão."], [/ón$/, "ão", "-ón es *-ão*: melão, avião."],
      [/idad$/, "idade", "-dad es *-dade*: cidade, verdade, universidade."], [/dad$/, "dade", "-dad es *-dade*."],
      [/tad$/, "dade", "-tad es *-dade*: liberdade, vontade."], [/bles$/, "veis", "-bles es *-veis*: possíveis."],
      [/ble$/, "vel", "-ble es *-vel*: possível, incrível, agradável."], [/ajes$/, "agens", "-ajes es *-agens*."],
      [/aje$/, "agem", "-aje es *-agem* (y es femenino: a viagem, a mensagem)."], [/mientos?$/, "mento", "-miento es *-mento*."],
      [/aba$/, "ava", "El imperfecto portugués va con *v*: falava, estava, morava."], [/abas$/, "avas", "El imperfecto va con *v*."],
      [/aban$/, "avam", "El imperfecto va con *v* y la 3.ª plural termina en *-am*: falavam, estavam."],
      [/ábamos$/, "ávamos", "El imperfecto va con *v*: falávamos."],
      [/ue/g, "o", "La *ue* del español (puerta, nuevo) es *o* en portugués: porta, novo, bom, fogo.", "Esa *ue* es del español: ¿cómo queda en portugués?"],
      [/ie/g, "e", "La *ie* del español (tierra, tiempo) es *e* en portugués: terra, tempo, pedra.", "Esa *ie* es del español: ¿cómo queda en portugués?"],
      [/^h/, "", "Esa palabra no lleva h.", "¿Esa palabra lleva *h* en portugués?"], [/^/, "h", "Esa palabra lleva h (que no suena): hoje, hora, homem.", "¿Esa palabra lleva *h* en portugués?"],
      [/j/g, "lh", "La *j* del español suele ser *lh* en portugués: mulher, olho, conselho.", "Esa *j* es del español: ¿cómo se escribe en portugués?"],
      [/ss/g, "s", "Entre vocales, *s* sola suena /z/: casa, mesa.", "¿*s* o *ss*?"], [/([aeiouãõ])s(?=[aeiou])/g, "$1ss", "Entre vocales la *s* sorda se escribe *ss*: passar, pássaro, nosso.", "¿*s* o *ss*? Entre vocales suenan distinto."],
      [/([aeiou])r(?=[aeiou])/g, "$1rr", "La *r* fuerte entre vocales se escribe *rr*: carro, terra, correr.", "¿*r* o *rr*?"],
      [/b/g, "v", "Esa palabra se escribe con *v*: em português v y b suenan distinto (livro, trabalhava).", "¿*b* o *v*? En portugués suenan distinto."],
      [/z/g, "ç", "Esa palabra lleva *ç*: cabeça, praça, preguiça.", "¿Con qué letra se escribe ese sonido /s/?"], [/c(?=[ei])/g, "ç", "Esa palabra lleva *ç*.", "¿Con qué letra se escribe ese sonido /s/?"],
      [/n$/, "m", "La nasal final se escribe *m*.", "¿Cómo se escribe la nasal al final de la palabra?"], [/y/g, "i", "La *y* del español es *i* en portugués.", "¿*y* o *i*?"]
    ];
    var ESPAN = /ción|sión|zón|dad|tad|ble|aje|miento|aba|ue|ie|^h/;
    for (var k = 0; k < SPELL.length; k++) {
      var sp = SPELL[k], conv;
      try { conv = g.replace(sp[0], sp[1]); } catch (ex) { continue; }
      if (conv === g) continue;
      if (conv === e || deaccent(conv) === es) {
        var span = ESPAN.test(String(sp[0])) && (spanishish(g) || /[ñ]|ll/.test(g));
        var isEs = span || (/ñ|ll/.test(g) && !!spanishWord(g));
        if (/^\/b\/g$|^\/z\/g$|^\/y\/g$/.test(String(sp[0])) && spanishWord(g)) isEs = true;
        return { cat: isEs ? "espanol" : "ortografia", slip: false,
          hint: isEs ? it(g) + " está escrita «a la española». ¿Cómo se escribe en portugués?" : sp[3] || (/\$\/g?$/.test(String(sp[0])) ? "Esa terminación es la del español: ¿cómo termina en portugués?" : "La palabra marcada está mal escrita."),
          explain: it(e) + ": " + sp[2] };
      }
    }
    var bankSp = DATA.spelling;
    for (var q = 0; q < bankSp.length; q++) {
      var b = bankSp[q], src = gs, pat = deaccent(b[0]);
      if (b[0] === "ñ") { src = g; pat = "ñ"; }
      if (src.indexOf(pat) >= 0 && deaccent(src.split(pat).join(deaccent(b[1]))) === es) return { cat: "ortografia", slip: false,
        hint: "La palabra marcada está escrita «a la española».", explain: it(e) + ": " + b[2] };
    }
    if (degeminate(gs) === degeminate(es) && gs !== es) return { cat: "ortografia", slip: false,
      hint: e.length > g.length ? "A la palabra marcada le falta una letra doble." : "La palabra marcada tiene una letra doble de más.",
      explain: "Se escribe " + it(e) + ". En portugués solo se duplican *rr* y *ss*: *rr* es la r fuerte entre vocales (carro ≠ caro) y *ss* la s sorda (passo ≠ paso: no existe; casa suena con z)." };

    // 6. Artículos del español
    // «eu lo vi»: lo, la before a verb are the Spanish object pronoun (rule 8)
    var esPron = /^(lo|la|los|las)$/.test(g) && /^(o|a|os|as)$/.test(e) && finite(next) && !isInfinitive(next) &&
      !(DATA.nouns[next] || DATA.nounsByPlural[next]);
    if (ES_ARTICLES[g] && !esPron && (ARTICLES[e] || CLITICS.indexOf(e) >= 0 || prepInfo(e))) {
      var asArt = ARTICLES[ES_ARTICLES[g]] && ARTICLES[e] && !isVerbish(next);
      return { cat: "espanol", slip: false,
        hint: it(g) + (asArt ? " es un artículo del español." : " es español."),
        explain: "*" + g + "* es español; en portugués " + (asArt ? "el artículo es " + it(ES_ARTICLES[g]) : "va " + it(e)) +
          (asArt && ES_ARTICLES[g] !== e ? " (acá: " + it(e) + ")" : "") + (asArt ? ". Los artículos portugueses son *o, a, os, as, um, uma*." : ".") };
    }
    if (/^(del|al)$/.test(g) && prepInfo(e)) return { cat: "contraccion", slip: false,
      hint: it(g) + " es la contracción del español. ¿Cuál es la portuguesa?",
      explain: (g === "del" ? "*de + o = do* (da, dos, das)" : "*a + o = ao* (à, aos, às)") + ": acá " + it(e) + "." };

    // 7. «a» personal escondida en una contracción (vi ao João → vi o João)
    //    and a preposition with its article where only the article goes
    //    (ganhou ao prêmio → ganhou o prêmio; para ao Rio → para o Rio)
    var pgA = prepInfo(g);
    if (pgA && pgA.art && ARTICLES[e] && pgA.art === e && !PREP_BASE[g]) {
      var lemA = verbLemmas(prev);
      var ioVerb = lemA.some(function (l) { return IO_VERB.test(l) || (REGENCIA[l] && REGENCIA[l][0] === pgA.base && !/^(ajudar|ensinar)$/.test(l)); });
      // verbs of things (ganhou o Nobel, escreveu o livro): the object is not a person
      var thingVerb = lemA.some(function (l) { return /^(ganhar|escrever|ler|comprar|vender|tirar|fazer|perder|receber|publicar|assinar|derrubar|lançar|abrir|fechar|pagar|construir|pintar|compor|filmar)$/.test(l); });
      var obj = e + " " + capN(next, ctx) + (POSSESSIVE.indexOf(next) >= 0 && ctx.e[ctx.ei + 2] ? " " + ctx.e[ctx.ei + 2] : "");
      if (pgA.base === "a" && lemA.length && !ioVerb && !thingVerb && (doVerbBefore(ctx) || personAt(ctx, ctx.ei + 1))) return { cat: "a_personal", slip: false,
        hint: "Hay una preposición que en español va y en portugués no.",
        explain: "La persona que recibe la acción (el objeto directo) no lleva «a» en portugués: " + it(obj) + ", conheço o João, visitei os meus pais. (En *vi a Maria* la *a* es el artículo, no preposición.)" };
      return { cat: "preposicion", slip: false,
        hint: "Sobra una preposición en la palabra marcada.",
        explain: it(g) + " es *" + pgA.base + " + " + e + "*: acá sobra la preposición y va solo el artículo, " + it(obj) +
          (PREP_BASE[prev] ? ": después de *" + prev + "* no va otra preposición." :
           lemA.length && !ioVerb ? ": *" + lemA[0] + "* lleva el complemento sin preposición (objeto directo), como «ver algo»." : ".") };
    }

    if (g === "a" && e === "o" && ctx.names && ctx.names.indexOf(next) >= 0 && !PLACE_ART[next] && !DATA.nouns[next] && doVerbBefore(ctx)) return { cat: "a_personal", slip: false,
      hint: "Esa «a» delante del nombre, ¿es un artículo o la «a» personal del español?",
      explain: "La persona que recibe la acción (el objeto directo) no lleva «a» en portugués; delante de un nombre masculino va el artículo *o*: " + it("o " + capN(next, ctx)) + " (vi o Pedro, espero o Lucas). *A Maria* sí, porque ahí *a* es el artículo femenino." };
    if (g === "desde" && e === "há") return { cat: "preposicion", slip: false,
      hint: "¿Desde un momento o hace un tiempo?",
      explain: "Para la duración hasta hoy: *há* + tiempo (moro aqui há três anos = hace tres años que vivo acá); *desde* va con un momento (desde 2020, desde criança)." };
    if (/^(em|de|no)$/.test(g) && e === "a" && next === "pé") return { cat: "preposicion", slip: false,
      hint: "¿Cómo se dice «a pie»?", explain: "Caminando es *a pé* (vou a pé). Los vehículos van con *de*: de ônibus, de carro." };

    // 8. Pronombres
    r = pronounRule(g, e, ctx);
    if (r) return r;

    // 9. Artículos
    if (ARTICLES[g] && ARTICLES[e]) return articleRule(g, e, ctx);
    // «a» is also the preposition: before a verb, a city, a name, a number
    // (Sou a Rosario → de; vou a comer) it is a preposition choice.
    if (/^a$/.test(g) && prepInfo(e) && !ARTICLES[e] &&
        (isVerbish(next) || PLACE_NOART.test(next) || /^\d/.test(next) || (ctx.names || []).indexOf(next) >= 0 && !PLACE_ART[next]) && !prepInfo(e).art) {
      return prepRule(g, e, { base: "a", art: null }, prepInfo(e), ctx);
    }
    if (ARTICLES[g] && prepInfo(e) && !ARTICLES[e]) {
      var pe0 = prepInfo(e);
      var lpv = verbLemmasBefore(ctx);
      for (var r1 = 0; r1 < lpv.length; r1++) if (!pe0.art && REGENCIA[lpv[r1]] && REGENCIA[lpv[r1]][0] === pe0.base) return { cat: "regencia", slip: false,
        hint: "Ese verbo pide una preposición: ¿cuál?",
        explain: "*" + lpv[r1] + " " + pe0.base + "*: " + REGENCIA[lpv[r1]][1] + ". Acá: " + it(prev + " " + e) + "." };
      if (pe0.art === g) {
        var lp0 = verbLemmas(prev);
        if (lp0.indexOf("gostar") >= 0) return { cat: "gostar", slip: false,
          hint: "*gostar* nunca va solo: ¿qué le falta?",
          explain: "*Gostar* lleva siempre *de*, que se funde con el artículo: " + it(prev + " " + e + " " + next) + " (gosto do Rio, gosto da praia, gosto dos livros)." };
        for (var r0 = 0; r0 < lp0.length; r0++) if (REGENCIA[lp0[r0]] && REGENCIA[lp0[r0]][0] === pe0.base) return { cat: "regencia", slip: false,
          hint: "Ese verbo pide una preposición que en español no va.",
          explain: "*" + lp0[r0] + " " + pe0.base + "*: " + REGENCIA[lp0[r0]][1] + ". Acá: " + it(prev + " " + e) + " (*" + pe0.base + " + " + pe0.art + "*)." };
        return { cat: "contraccion", slip: false,
          hint: "Acá falta una preposición que se funde con el artículo.",
          explain: "Acá va " + it(e) + " = *" + pe0.base + " + " + pe0.art + "*." };
      }
      return { cat: "preposicion", slip: false,
        hint: "Acá hace falta una preposición, no un artículo.",
        explain: "Acá va la preposición " + it(e) + (pe0.art ? " (con el artículo incorporado: *" + pe0.base + " + " + pe0.art + "*)" : "") + "." };
    }

    // 10. Preposiciones y contracciones
    var pg = prepInfo(g), pe = prepInfo(e);
    if (pg && pe) return prepRule(g, e, pg, pe, ctx);
    if (!pg && pe && pe.art && ES_PT[g] && prepInfo(ES_PT[g].split(" / ")[0])) return { cat: "espanol", slip: false,
      hint: it(g) + " es español.", explain: it(g) + " es español; en portugués " + it(ES_PT[g]) + ": acá " + it(e) + " (*" + pe.base + " + " + pe.art + "*)." };

    // 11. muito / muy
    r = muitoRule(g, e, ctx);
    if (r) return r;

    // 12. gostar
    if (/^gust/.test(gs) && verbForms(e).some(function (v) { return v.lemma === "gostar"; })) return { cat: "gostar", slip: false,
      hint: "«Gustar» no se dice así en portugués: el que gusta es el sujeto.",
      explain: "Gostar va al revés que gustar: la persona es el sujeto y lo que gusta va con *de*: eu gosto de café, ela gosta de dançar. Acá: " + it(e) + "." };

    // 12. Expresiones fijas (ou seja, em suma, Deus me livre)
    var fx = FIXED[prev + " " + e];
    if (fx && g !== e) return { cat: fx[0], slip: false,
      hint: "Es una expresión fija: ¿cómo se dice entera?",
      explain: fx[1] };

    // 12a. La terminación del español en un verbo portugués (cheguê → cheguei, falaré → falarei, chegó → chegou)
    if (/[éó]$/.test(g) && !isPortuguese(g) && verbForms(e).length && (/ei$/.test(e) && gs === es.slice(0, -1) || /ou$/.test(e) && gs.slice(0, -1) === es.slice(0, -2))) return { cat: "espanol", slip: false,
      hint: it(g) + " tiene la terminación del español. ¿Cómo termina en portugués?",
      explain: /ei$/.test(e)
        ? "La terminación *-é* del español es *-ei* en portugués, sin tilde: " + it(e) + " (falei, cheguei, falarei; «hablé» → falei)."
        : "La terminación *-ó* del español es *-ou* en portugués: " + it(e) + " (falou, chegou; «habló» → falou)." };

    // 12b. El voseo rioplatense (querés, podés; abrí, hablá)
    r = vosRule(g, e);
    if (r) return r;

    // 13. Participios y verbos
    r = participleRule(g, e, ctx);
    if (r) return r;

    // 14. Infinitivo donde va conjugado (tenho → tener no; ser → sou)
    var stemInf = /\(([a-zà-ÿ-]+)\)/i.exec(ctx.stem || "");
    var infG = g !== e && isInfinitive(g) && !isInfinitive(e) && !participleOf(e) &&
      verbForms(e).some(function (x) { return x.lemma === g || x.lemma === g + "-se"; });
    if (!infG && stemInf && stemInf[1].toLowerCase() === g && verbForms(e).length) infG = true;
    if (ARTICLES[prev] && (DATA.nouns[e] || DATA.nounsByPlural[e])) infG = false;   // a venda: the noun
    if (infG) {
      // «chegarem» is futuro do subjuntivo after quando / se, infinitivo pessoal elsewhere
      var fut0 = futCtx(ctx);
      var fes = verbForms(e).filter(function (x) { return x.lemma.replace(/-se$/, "") === g; });
      if (!fes.length) fes = verbForms(e);
      fes = fes.slice().sort(function (a, b) {
        var ra = a.tense === "subjFuturo" ? (fut0 ? 0 : 2) : a.tense === "infPessoal" ? 1 : 1.5;
        var rb = b.tense === "subjFuturo" ? (fut0 ? 0 : 2) : b.tense === "infPessoal" ? 1 : 1.5;
        return ra - rb;
      });
      var fe0 = fes[0];
      if (fe0 && fe0.tense === "subjFuturo") return futSubjExplain(g, e, fe0, ctx, true);
      if (fe0 && fe0.tense === "infPessoal") return infPessExplain(g, e, ctx);
      if (fe0 && fe0.tense === "subjPresente" && imperativeCtx(ctx)) return imperativeExplain(g, e, ctx, true);
      if (fe0 && /^subj(Presente|Imperfeito)$/.test(fe0.tense)) {
        var bef14 = ctx.e.slice(0, ctx.ei).join(" ");
        var trig14 = SUBJ_TRIG.filter(function (w) { return (" " + bef14 + " ").indexOf(" " + w + " ") >= 0; })[0] ||
          (/\b(acho|acha|creio|penso)\s+que\b/.test(bef14) && /\bnão\b/.test(bef14) ? "não acho que" : null);
        return { cat: "subjuntivo", slip: false,
          hint: "Escribiste el infinitivo: ¿qué forma pide lo que viene antes?",
          explain: it(g) + " es el infinitivo; " + (trig14 ? "después de " + it(trig14) + " va el subjuntivo" : "acá va el subjuntivo") + ": " + it(e) +
            ". Deseo, duda, pedido, emoción, *para que, embora, talvez* → subjuntivo, como en español." };
      }
      return { cat: "persona", slip: false,
        hint: "Escribiste el infinitivo: hay que conjugarlo para la persona de la frase.",
        explain: it(g) + " es el infinitivo; conjugado para esta persona queda " + it(e) + (fe0 ? " (" + tensesOf(e, fe0) + ")" : "") + "." };
    }

    // 14a. dos (español) por dois / duas; demostrativos y posesivos que no concuerdan
    if (g === "dos" && /^(dois|duas)$/.test(e) && /^\d|^[a-zà-ÿ]/.test(next) && !ARTICLES[next]) return { cat: "espanol", slip: false,
      hint: "¿Es el número o *de + os*?",
      explain: "El número es *dois* (masculino) o *duas* (femenino): " + it(e + (next ? " " + next : "")) + ". *Dos* existe, pero es *de + os* (dos amigos)." };
    var DEMF = /^(est|ess|aquel|aquil|meu|minh|teu|tua|seu|sua|noss|voss)/;
    var demRoot = function (w) { return w.replace(/^(este|esta|estes|estas)$/, "est").replace(/^(esse|essa|esses|essas)$/, "ess").replace(/^(aquele|aquela|aqueles|aquelas)$/, "aquel")
      .replace(/^(meu|minha|meus|minhas)$/, "m").replace(/^(teu|tua|teus|tuas)$/, "t").replace(/^(seu|sua|seus|suas)$/, "s").replace(/^(nosso|nossa|nossos|nossas)$/, "noss"); };
    if (g !== e && DEMF.test(g) && DEMF.test(e) && demRoot(g) === demRoot(e) && demRoot(g).length <= 6 && demRoot(g) !== g) {
      var nn = next, gnn = nounGender(nn), pln = DATA.nounsByPlural[nn] && DATA.nounsByPlural[nn].s !== nn;
      return { cat: gnn && ((/^(esta|estas|essa|essas|aquela|aquelas|minha|minhas|tua|tuas|sua|suas|nossa|nossas)$/.test(g)) !== (gnn === "f")) ? "genero" : "concordancia", slip: false,
        hint: "Revisá el género y el número de la palabra marcada: ¿con qué concuerda?",
        explain: "Los demostrativos y los posesivos concuerdan con el sustantivo, como en español: " + it(e + " " + nn) +
          (gnn ? " (*" + nn + "* es " + (gnn === "m" ? "masculino" : "femenino") + (pln ? " plural" : "") + " en portugués" + (HETERO_ES[nn] ? "; en español es " + HETERO_ES[nn] : "") + ")" : "") + "." };
    }

    // 14b. El mismo adjetivo en otro género o número (alemão / alemã); dois / duas
    if (DATA.adj[g] && DATA.adj[g] === DATA.adj[e]) return agreementRule(g, e, ctx);
    if (/^(dois|duas|um|uma)$/.test(g) && /^(dois|duas|um|uma)$/.test(e)) {
      var gnN = nounGender(next);
      return { cat: "concordancia", slip: false,
        hint: "El número concuerda en género con lo que cuenta. ¿De qué género es la palabra que sigue?",
        explain: "*Um / uma* y *dois / duas* concuerdan con el sustantivo: " + it(e + " " + next) + (gnN ? " (" + next + " es " + (gnN === "m" ? "masculino" : "femenino") + ")" : "") + ". Lo mismo con las centenas: duzentas pessoas." };
    }

    // 15. Dos palabras portuguesas que se confunden (vez / tempo, mas / mais)
    var lc = lexConfusion(g, e);
    if (lc) return { cat: "lexico", slip: false,
      hint: it(g) + " existe, pero acá va otra palabra parecida en el uso.",
      explain: lc + " Acá: " + it(e) + "." };

    // 16. Falsos amigos
    var fa = DATA.falsi[g] || FALSOS[g] || (/s$/.test(g) && (DATA.falsi[g.slice(0, -1)] || FALSOS[g.slice(0, -1)]));
    // the same word in another form (fechas / fecha, jornals / jornais) is not a false friend
    var sameWord = gs.slice(0, 4) === es.slice(0, 4) && editDistance(gs, es) <= 2;
    if (fa && g !== e && fa[0] && !sameWord) return { cat: "falso_amigo", slip: false,
      hint: it(g) + " existe en portugués, pero no significa lo que creés.",
      explain: it(g) + " en portugués significa «" + fa[0] + "». Acá va " + it(e) + "." + (fa[2] ? " " + fa[2] : "") };

    // 17. Palabra española que el diccionario hace corresponder a la esperada
    var ptG = isPortuguese(g);
    var bigram = ctx.g && ctx.gi > 0 && !ptG ? (ES_BIGRAM[deaccent(ctx.g[ctx.gi - 1] + " " + g)] || DATA.esPt[deaccent(ctx.g[ctx.gi - 1] + " " + g)]) : null;
    var fwd = ctx.g && ctx.g[ctx.gi + 1] && !ptG ? (ES_BIGRAM[deaccent(g + " " + ctx.g[ctx.gi + 1])] || DATA.esPt[deaccent(g + " " + ctx.g[ctx.gi + 1])]) : null;
    var direct = spanishWord(g);
    var tr = [bigram, fwd].filter(function (x) {
      return x && String(x[0]).split(/\s*\/\s*/).some(function (w) { return w === e || w.split(" ").indexOf(e) >= 0; });
    })[0];
    if (tr) return { cat: "espanol", slip: false,
      hint: it(g) + " suena a español. ¿Cómo se dice en portugués?",
      explain: it(g) + " viene del español; en portugués va " + it(e) + "." + (tr[1] ? " " + tr[1] : "") };
    if (direct) return spanishExplain(g, e, direct, ctx);

    // 18. Plural en un ejercicio de plurales
    if (ctx.nominal) {
      var sg = singularFromStem(ctx.stem) || (DATA.nounsByPlural[e] || {}).s;
      // a slip of the finger (floes, floers) is not a plural rule
      var slipOnly = editDistance(gs, es) === 1 && es.length >= 4 && !(sg && naivePlurals(sg).indexOf(g) >= 0) && !/(ões|ães|ãos|ais|éis|óis|ns)$/.test(e);
      if ((sg || /s$/.test(e)) && !slipOnly) return { cat: "plural", slip: false,
        hint: "Revisá el plural de la palabra marcada.",
        explain: pluralExplain(sg, e) };
    }

    // 19. Verbos (persona, tiempo, regularización, irregulares, confusiones)
    r = verbRule(g, e, ctx);
    if (r) return r;

    // 20. Plurales
    var nounP = DATA.nounsByPlural[e];
    if (nounP && nounP.pl === e && nounP.s !== e && naivePlurals(nounP.s).indexOf(g) >= 0) return { cat: "plural", slip: false,
      hint: "Revisá el plural de la palabra marcada.",
      explain: pluralExplain(nounP.s, e) + (nounP.note ? " " + nounP.note : "") };
    if (/(ões|ães|ãos)$/.test(e) && /(ões|ães|ãos|ãoes|ones|aos|ãos)$/.test(g) && g.slice(0, 2) === e.slice(0, 2)) return { cat: "plural", slip: false,
      hint: "Revisá el plural de la palabra marcada: ¿-ões, -ães o -ãos?",
      explain: pluralExplain(e.replace(/(ões|ães|ãos)$/, "ão"), e) };
    if (/(ais|éis|óis|uis|eis)$/.test(e) && /(ales|eles|oles|uls|als|els|ols|les|ils|iles)$/.test(g) && g.slice(0, 2) === e.slice(0, 2)) {
      var sgl = e.replace(/ais$/, "al").replace(/éis$/, "el").replace(/óis$/, "ol").replace(/uis$/, "ul").replace(/eis$/, "il");
      return { cat: "plural", slip: false, hint: "Revisá el plural de la palabra terminada en -l.", explain: pluralExplain(sgl, e) };
    }
    if (/ns$/.test(e) && (g === e.replace(/ns$/, "ms") || g === e.replace(/ns$/, "nes") || g === e.replace(/ns$/, "mes"))) return { cat: "plural", slip: false,
      hint: "Revisá el plural de la palabra terminada en -m.", explain: pluralExplain(e.replace(/ns$/, "m"), e) };
    if (DATA.nounsByPlural[g] && DATA.nounsByPlural[g].s === e) return { cat: "plural", slip: false,
      hint: "Acá va el singular.", explain: it(g) + " es el plural; acá va el singular " + it(e) + "." };

    // 21. Tipeo
    var dist = editDistance(gs, es);
    var endingOnly = g.slice(0, -1) === e.slice(0, -1) && /[oa]$/.test(g) && /[oa]$/.test(e) ||
                     g.slice(0, -2) === e.slice(0, -2) && /[oa]s$/.test(g) && /[oa]s$/.test(e) ||
                     (g === e + "s" || e === g + "s");
    if (dist === 1 && es.length >= 4 && !endingOnly && !DATA.lex[g] && !verbForms(g).length && !participleOf(g) && !PT_COMMON[g]) {
      return { cat: "tipeo", slip: true,
        hint: "Hay un error de tipeo en la palabra marcada.",
        explain: "Error de tipeo: " + it(e) + "." };
    }

    // 22. Nombre propio en español (Juan → João, Londres → Londres)
    if (ctx.names && ctx.names.indexOf(e) >= 0 && !isPortuguese(g) && g !== e && !isVerbish(e) && !DATA.lex[e]) return { cat: "lexico", slip: false,
      hint: "Ese nombre también se dice distinto en portugués.",
      explain: "En portugués: " + it(e.charAt(0).toUpperCase() + e.slice(1)) + ". Muchos nombres propios se adaptan (Juan → João, José → José, Pedro → Pedro, Nueva York → Nova York)." };

    // 23. Palabra que no está en ningún diccionario y suena a castellano
    if (!isPortuguese(g) && looksSpanish(g)) return { cat: "espanol", slip: false,
      hint: it(g) + " parece español. ¿Cómo se dice en portugués?",
      explain: it(g) + " no es portugués. Acá va " + it(e) + (DATA.lex[e] ? " («" + DATA.lex[e] + "»)" : "") + "." };

    // 24. Concordancia de género y número
    if (endingOnly) return agreementRule(g, e, ctx);

    // 25. Léxico: palabra portuguesa de verdad pero equivocada
    var lx = DATA.lex[g];
    var functionWord = ARTICLES[g] || prepInfo(g) || CLITICS.indexOf(g) >= 0 || SUBJECTS.indexOf(g) >= 0;
    if (lx && g !== e && !functionWord) return { cat: "lexico", slip: false,
      hint: it(g) + " es una palabra portuguesa, pero no es la que va acá.",
      explain: it(g) + " significa «" + lx + "». Acá va " + it(e) + (DATA.lex[e] ? " («" + DATA.lex[e] + "»)" : "") + "." };

    // 26. Tipeo más largo
    if (dist <= (es.length > 7 ? 2 : 1) && !verbForms(g).length && !ARTICLES[g] && !prepInfo(g) && !PT_COMMON[g]) return { cat: "tipeo", slip: true,
      hint: "Hay un error de tipeo en la palabra marcada.",
      explain: "Error de tipeo: " + it(e) + "." };

    if (knownWord(g) && !isPortuguese(g)) return { cat: "lexico", slip: false,
      hint: it(g) + " existe, pero acá va otra palabra.",
      explain: it(g) + " es portugués, pero no es la palabra de esta frase: acá va " + it(e) + (DATA.lex[e] ? " («" + DATA.lex[e] + "»)" : "") + "." };
    if (!isPortuguese(g)) return { cat: "lexico", slip: false,
      hint: "La palabra marcada no es del portugués que ve el curso. ¿Cómo se dice?",
      explain: it(g) + " no está en el diccionario del curso. Acá va " + it(e) + (DATA.lex[e] ? " («" + DATA.lex[e] + "»)" : "") + "." };
    return { cat: "lexico", slip: false,
      hint: "La palabra marcada no es la que va.",
      explain: "Acá va " + it(e) + (DATA.lex[e] ? " («" + DATA.lex[e] + "»)" : "") + "." };
  }

  // The Rioplatense voseo (querés, podés; imperative abrí, hablá).
  function vosRule(g, e) {
    var vos = /^(.+?)(á|é|í)(s?)$/.exec(g);
    if (!vos || isPortuguese(g)) return null;
    var infV = deaccent(vos[1]) + { "á": "ar", "é": "er", "í": "ir" }[vos[2]];
    if (!verbForms(e).some(function (x) { return x.lemma.replace(/-se$/, "") === infV; })) return null;
    return { cat: "espanol", slip: false,
      hint: it(g) + " es el voseo del español. ¿Cómo va con *você*?",
      explain: vos[3]
        ? it(g) + " es el voseo rioplatense («vos " + g + "»); en portugués *você* va con la 3.ª persona: " + it(e) + " (você quer, você pode, você tem)."
        : it(g) + " es el imperativo del voseo («" + g + "»); en portugués, para pedirle algo a *você*, el imperativo toma la forma del subjuntivo: " + it(e) + " (fale, coma, abra; en el habla de Brasil también *fala!*)." };
  }

  function spanishExplain(g, e, tr, ctx) {
    var gs = deaccent(g);
    if (/^(muy|mucho|mucha|muchos|muchas)$/.test(gs)) return muitoRule(g, e, ctx) || { cat: "muito", slip: false,
      hint: it(g) + " es español.", explain: it(g) + " es español: en portugués *muito* (muy y mucho)." };
    if (/^gust/.test(gs)) return { cat: "gostar", slip: false,
      hint: "«Gustar» no se dice así en portugués: el que gusta es el sujeto.",
      explain: "Gostar va al revés que gustar: *eu gosto de* + lo que gusta (eu gosto de samba, eles gostam de praia). Acá: " + it(e) + "." };
    var first = String(tr).split(" / ")[0];
    return { cat: "espanol", slip: false,
      hint: it(g) + " es español. ¿Cómo se dice en portugués?",
      explain: it(g) + " es español; en portugués: " + it(tr) + (String(tr).split(" / ").indexOf(e) < 0 && first !== e ? " (acá: " + it(e) + ")" : "") + "." +
        (ES_NOTE[deaccent(g)] || ES_NOTE[g] ? " " + (ES_NOTE[g] || ES_NOTE[deaccent(g)]) : "") };
  }

  function muitoRule(g, e, ctx) {
    var next = ctx.e[ctx.ei + 1] || "";
    var gs = deaccent(g);
    if (/^(muy|mucho|mucha|muchos|muchas)$/.test(gs) && /^(muito|muita|muitos|muitas)$/.test(e)) return { cat: "muito", slip: false,
      hint: it(g) + " es español. ¿Cómo se dice «muy» y «mucho» en portugués?",
      explain: "En portugués una sola palabra hace de «muy» y de «mucho»: *muito*. " +
        (e === "muito" ? "Delante de un adjetivo o un adverbio no cambia: " + it("muito " + next) + "." : "Delante de un sustantivo concuerda: " + it(e + " " + next) + ".") };
    if (/^(muito|muita|muitos|muitas)$/.test(g) && /^(muito|muita|muitos|muitas)$/.test(e) && g !== e) {
      var nounNext = !!(DATA.nouns[next] || DATA.nounsByPlural[next] || HETERO[next]) || !(DATA.adj[next] || /mente$/.test(next) || /^(bem|mal|pouco|mais|menos|cedo|tarde|longe|perto)$/.test(next));
      return { cat: "muito", slip: false,
        hint: nounNext ? "Mirá la palabra que sigue: ¿de qué género y número es?" : "Delante de un adjetivo o un adverbio, ¿esa palabra cambia?",
        explain: nounNext ? "Delante de sustantivo *muito* concuerda (= mucho): " + it(e + " " + next) + (HETERO_ES[next] ? " (" + next + " es " + (HETERO[next] === "m" ? "masculino" : "femenino") + " en portugués; en español, " + HETERO_ES[next] + ")" : "") + ". Muita gente, muitos amigos, muitas vezes."
          : "Delante de adjetivo o adverbio *muito* es invariable (= muy): " + it("muito " + next) + " (ela é muito bonita, eles falam muito bem)." };
    }
    if (/^(más)$/.test(g) && e === "mais") return { cat: "espanol", slip: false,
      hint: "Revisá la palabra marcada: en portugués «más» se escribe distinto.",
      explain: "«Más» es *mais*; *mas* sin i es «pero»." };
    if (/^(tan)$/.test(g) && /^(tão|tanto)$/.test(e)) return { cat: "espanol", slip: false,
      hint: it(g) + " es español.", explain: "«Tan» es *tão* (tão bonito); «tanto», *tanto*." };
    return null;
  }

  var DO_VERB = /^(ver|conhecer|amar|ajudar|convidar|visitar|esperar|chamar|encontrar|abraçar|beijar|cumprimentar|levar|buscar|procurar|escutar|ouvir|olhar|entender|acompanhar|admirar|respeitar|odiar|adorar|assistir|deixar|acordar|apresentar|receber)$/;
  var IO_VERB = /^(dar|dizer|perguntar|pedir|escrever|telefonar|responder|mandar|enviar|mostrar|contar|explicar|emprestar|oferecer|devolver|ensinar|agradecer|obedecer)$/;

  // A person at e[i]: a name, a relative, a pronoun, «o meu irmão».
  function personAt(ctx, i) {
    var w = ctx.e[i] || "", w2 = ctx.e[i + 1] || "";
    if (FAMILY.indexOf(w) >= 0 || /^(ele|ela|eles|elas|você|vocês|todos|ninguém|alguém)$/.test(w)) return true;
    if (POSSESSIVE.indexOf(w) >= 0 && FAMILY.indexOf(w2) >= 0) return true;
    return !!(ctx.names && ctx.names.indexOf(w) >= 0 && !PLACE_ART[w] && !PLACE_NOART.test(w) && !DATA.nouns[w] && !DATA.lex[w]);
  }

  function doVerbBefore(ctx) {
    for (var k = ctx.ei - 1; k >= 0 && k >= ctx.ei - 3; k--) {
      var w = ctx.e[k];
      if (!w) break;
      var lem = verbForms(w).map(function (v) { return v.lemma.replace(/-se$/, ""); }).concat(participleOf(w) ? [participleOf(w)] : []).concat(isInfinitive(w) ? [w] : []);
      if (lem.some(function (l) { return DO_VERB.test(l); })) return true;
      if (lem.length) return false;
    }
    return false;
  }

  function pronounRule(g, e, ctx) {
    var prev = ctx.e[ctx.ei - 1] || "", next = ctx.e[ctx.ei + 1] || "";
    var gs = deaccent(g);
    if ((gs === "mi" || g === "eu" || g === "me") && e === "mim") return { cat: "pronome", slip: false,
      hint: "Después de una preposición el pronombre tiene otra forma.",
      explain: "Después de preposición va *mim*: " + it((prev || "para") + " mim") + " (para mim, sem mim, de mim). Con *com*: *comigo*." +
        (g === "eu" ? " *Para eu* solo va delante de un infinitivo del que *eu* es sujeto (para eu fazer)." : "") };
    if (g === "mim" && e === "eu" && prev === "que") return { cat: "pronome", slip: false,
      hint: "En la comparación, el pronombre es el del sujeto.",
      explain: "Después de *(do) que* en una comparación va *eu*: mais velha do que " + it("eu") + " (como en español «que yo»)." };
    if (g === "mim" && e === "eu" && isInfinitive(next)) return { cat: "pronome", slip: false,
      hint: "Mirá lo que viene después: ¿quién hace esa acción?",
      explain: "Si el pronombre es el sujeto del infinitivo va *eu*: " + it("para eu " + next) + " (es «para que yo…»). *Para mim* va sin verbo detrás: isso é para mim." };
    if ((g === "conmigo" || (g === "com" && e === "comigo")) || (/^con(tigo|sigo)$/.test(g) && /^con/.test(e))) return { cat: "pronome", slip: false,
      hint: "Con *com* el pronombre se funde.", explain: "*com + mim = comigo*, *com + ti = contigo*, *com + nós = conosco*: acá " + it(e) + "." };
    if ((g === "nós" || g === "nosotros") && e === "conosco") return { cat: "pronome", slip: false,
      hint: "Con *com* el pronombre se funde.", explain: "*com + nós = conosco*." };
    if (/^(le|les)$/.test(g) && /^(lhe|lhes|o|a|os|as)$/.test(e)) return { cat: "pronome", slip: false,
      hint: it(g) + " es el pronombre del español.",
      explain: "*" + g + "* es español: en portugués el indirecto («le»: a alguien) es *lhe / lhes* y el directo («lo, la») *o, a, os, as*. Acá: " + it(e) + ". En el habla de Brasil también se oye *te* (para você) o *ele* (vi ele)." };
    if (/^(lo|la|los|las|le|les)$/.test(g) && /^(ele|ela|eles|elas)$/.test(e) && PREP_BASE[prev]) return { cat: "pronome", slip: false,
      hint: "Ese pronombre es del español: ¿cómo se dice «a ella» en portugués?",
      explain: "El «le / se lo» del español no se traduce así: en el habla de Brasil el indirecto va con preposición, " + it(prev + " " + e) + " (dei para ela, contei para ele); en lo formal, *lhe* (dei-lhe)." };
    if (/^(lo|la|los|las)$/.test(g) && /^(o|a|os|as|lhe|ele|ela)$/.test(e)) return { cat: "pronome", slip: false,
      hint: "Ese pronombre es del español.",
      explain: "Suelto, *" + g + "* es español: el objeto directo («lo, la») es " + it(e) + " (eu o vi, eu a conheço; en el habla de Brasil, *vi ele*). *-lo, -la* solo existen pegados a un verbo que terminaba en -r, -s o -z: vou comprá-lo, fi-lo." };
    if (/^(seu|sua|seus|suas)$/.test(g) && /^(dele|dela|deles|delas)$/.test(e)) return { cat: "pronome", slip: false,
      hint: "*seu* en Brasil se entiende como «de você». ¿De quién es?",
      explain: "En Brasil *seu / sua* se entiende «de você»; para «de él, de ella» va " + it((prev ? "" : "o ") + (ctx.e[ctx.ei - 1] || "") + " " + e).replace(/\*\s+/, "*") + " detrás del sustantivo: o carro " + e + "." };
    if (g === "lhe" && /^(o|a|os|as)$/.test(e)) return { cat: "pronome", slip: false,
      hint: "¿Ese verbo lleva complemento con preposición o sin ella?",
      explain: "Acá va el directo (sin preposición) " + it(e) + ": *ver, conhecer, amar, ajudar, convidar, visitar, esperar* llevan el complemento sin preposición, el objeto directo (eu o vi, eu a conheço). En el habla: vi ele, conheço ela." };
    if (/^(o|a|os|as)$/.test(g) && /^(lhe|lhes)$/.test(e)) return { cat: "pronome", slip: false,
      hint: "¿Ese verbo lleva complemento con preposición o sin ella?",
      explain: "Acá va el indirecto (a alguien, con «a» en español) " + it(e) + ": *dar, dizer, perguntar, pedir, escrever, mostrar, telefonar* llevan indirecto (eu lhe disse = le dije)." };
    if (/^(ele|ela|eles|elas)$/.test(g) && /^(o|a|os|as|lo|la|los|las|no|na)$/.test(e) && isVerbish(prev)) return { cat: "pronome", slip: true,
      hint: "Así se dice en el habla. ¿Y en lo escrito formal?",
      explain: "*Vi " + g + "* es del portugués hablado de Brasil; en lo escrito el complemento sin preposición (objeto directo) es " + it(e) + " (eu " + e + " vi; vou vê-" + e.replace(/^o/, "lo").replace(/^a$/, "la") + ")." };
    if (/^(me|te|se|nos|lhe)$/.test(g) && /^(me|te|se|nos|lhe)$/.test(e)) return { cat: "pronome", slip: false,
      hint: "Revisá el pronombre marcado: ¿de qué persona es?",
      explain: "Acá va " + it(e) + ": concuerda con el sujeto (eu *me* levanto, ele *se* levanta, nós *nos* levantamos) o con la persona a la que se refiere." };
    if (/^(cê|cês)$/.test(g) && /^(você|vocês)$/.test(e)) return { cat: "pronome", slip: false,
      hint: "*" + g + "* es del habla, pero no va en cualquier lugar. ¿Qué viene antes?",
      explain: "*" + g + "* (la forma corta de *" + e + "*) solo va como sujeto, delante del verbo: *" + g + " vem?* Después de una preposición va entero: " +
        it((PREP_BASE[prev] || /^(pra|pro)$/.test(prev) ? prev + " " : "") + e) + " (pra você, com você)." };
    if (/^(ti|te)$/.test(g) && e === "você") return { cat: "pronome", slip: false,
      hint: "¿Tratás de tu o de você?", explain: "Con *você*, el pronombre después de preposición es *você*: para você, com você." };
    return null;
  }

  /* Two Portuguese words a Spanish speaker mixes up (not false friends: both
     exist and both are «right» somewhere). */
  var LEX_CONFUSIONS = [
    ["vez vezes|tempo tempos|hora horas", "«Vez» es *vez* (uma vez, duas vezes, às vezes); *tempo* es el tiempo (que pasa o que hace); *hora*, la hora."],
    ["comprido comprida compridos compridas longo longa longos longas|largo larga largos largas", "*largo* en portugués es ancho; «largo» es *comprido* o *longo*."],
    ["ainda|já", "«Todavía» es *ainda*; «ya» es *já*."],
    ["logo|depois|cedo|pronto pronta prontos prontas", "*logo* = enseguida, dentro de poco; *depois* = después, luego; *cedo* = temprano; *pronto* = listo."],
    ["bom boa bons boas|bem", "*bom / boa* = bueno (adjetivo: um bom dia); *bem* = bien (adverbio: estou bem)."],
    ["mau má maus más|mal", "*mau / má* = malo (adjetivo); *mal* = mal (adverbio: dormi mal)."],
    ["tudo|todo toda todos todas", "*tudo* = todo, pronombre invariable (comi tudo, tudo bem); *todo / toda* acompaña a un sustantivo (todo dia, toda a cidade)."],
    ["mas|mais", "*mas* = pero; *mais* = más."],
    ["mas|porém contudo entretanto todavia", "*mas* va siempre al comienzo de lo que se opone (…, mas falhou); *porém, contudo, entretanto* también pueden ir en el medio, entre comas (o plano, porém, falhou)."],
    ["almoço almoços|jantar jantares|lanche lanches", "*almoço* = almuerzo; *jantar* = cena; *lanche* = merienda o algo liviano."],
    ["loja lojas|negócio negócios", "*loja* = tienda; *negócio* = negocio (el trato, la empresa)."],
    ["amanhã|manhã manhãs", "*amanhã* = mañana (el día siguiente); *manhã* = la mañana (parte del día: de manhã)."],
    ["ninguém|nenhum nenhuma", "*ninguém* = nadie; *nenhum / nenhuma* = ningún, ninguna."],
    ["alguém|algum alguma alguns algumas", "*alguém* = alguien; *algum / alguma* = algún, alguna."],
    ["pais|parentes", "*pais* = padres (papá y mamá); *parentes* = parientes."],
    ["neto neta netos netas|sobrinho sobrinha sobrinhos sobrinhas", "*neto* = nieto; *sobrinho* = sobrino."],
    ["namorado namorada namorados namoradas|noivo noiva noivos noivas", "*namorado* = novio, pareja; *noivo* = prometido o el novio de la boda."],
    ["meio meia|metade", "*meio / meia* = medio (meia hora, meio quilo); *metade* = la mitad."],
    ["conta contas|conto contos", "*conta* = la cuenta; *conto* = cuento."],
    ["andar andares|chão", "*andar* = piso de un edificio (moro no terceiro andar); *chão* = el suelo."],
    ["até|desde", "*até* = hasta; *desde* = desde."],
    ["aqui|cá|aí|ali|lá", "*aqui* / *cá* = acá; *aí* = ahí (cerca de vos); *ali* = allí; *lá* = allá."],
    ["cedo|tarde", "*cedo* = temprano; *tarde* = tarde."],
    ["mesmo mesma mesmos mesmas|igual iguais", "*mesmo* = mismo; *igual* = igual."],
    ["há|faz", ""],
    ["gosto gostos|sabor sabores", "*gosto* = gusto (y «me gusta», del verbo gostar); *sabor* = sabor."],
    ["quarto quartos|sala salas|cozinha cozinhas|banheiro banheiros", "*quarto* = dormitorio; *sala* = living; *cozinha* = cocina; *banheiro* = baño."],
    ["salada saladas|salgado salgada salgados salgadas", "*salada* = ensalada; *salgado* = salado."]
  ];
  var LEX_CONF = dict();
  LEX_CONFUSIONS.forEach(function (c, ci) {
    if (!c[1]) return;
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

  // Verbs a Spanish speaker confuses: [wrong lemma, right lemma, explanation]
  var VERB_CONFUSIONS = [
    ["ser", "estar", "Acá va *estar*: estados pasajeros (estou cansado), el lugar donde está algo que se mueve (ela está em casa) y *estar + gerúndio*."],
    ["estar", "ser", "Acá va *ser*: identidad, origen, profesión, características (ele é carioca, a festa é no sábado)."],
    ["estar", "ficar", "Para la ubicación de lo que no se mueve se usa *ficar*: o Cristo fica no Corcovado. Y *ficar* es también «quedarse» y «ponerse» (fiquei feliz)."],
    ["ficar", "estar", "Acá va *estar*: el estado o el lugar en este momento."],
    ["ter", "haver", "En lo escrito, «hay / había» es *haver*: há muita gente, havia um problema. *Tem* (tem gente aqui) es del habla."],
    ["haver", "ter", "Acá va *ter*: posesión o edad (tenho 30 anos) o, en el habla, «hay» (tem gente aqui)."],
    ["conhecer", "saber", "*saber* = saber un dato o saber hacer (sei nadar); *conhecer* = conocer personas o lugares."],
    ["saber", "conhecer", "*conhecer* = conocer personas o lugares (conheço o Rio); *saber* = saber un dato o hacer algo."],
    ["levar", "trazer", "*trazer* = traer hacia donde está el que habla (traga um guarda-chuva!); *levar* = llevar a otro lugar."],
    ["trazer", "levar", "*levar* = llevar a otro lugar (vou levar o vinho para a festa); *trazer* = traer hacia acá."],
    ["pedir", "perguntar", "«Preguntar» es *perguntar* (perguntar as horas); *pedir* es pedir algo (pedir um favor)."],
    ["perguntar", "pedir", "*pedir* = pedir algo (pedir um café); *perguntar* = hacer una pregunta."],
    ["ver", "olhar", "*olhar* = mirar con intención (olha o mar!); *ver* = ver, percibir."],
    ["olhar", "ver", "*ver* = ver (vi o jogo ontem); *olhar* = mirar."],
    ["escutar", "ouvir", "*ouvir* = oír (e también escuchar música); *escutar* = escuchar con atención."],
    ["ir", "vir", "*vir* = venir hacia donde está el que habla (vem cá!); *ir* = ir a otro lugar."],
    ["vir", "ir", "*ir* = ir a otro lugar (vou à praia); *vir* = venir hacia acá."],
    ["jogar", "brincar", "*brincar* = jugar (los chicos, sin reglas) y bromear; *jogar* = jugar un juego o un deporte (jogar futebol)."],
    ["brincar", "jogar", "*jogar* = jugar un juego o un deporte (jogar futebol, jogar cartas); *brincar* = jugar de chicos o bromear."],
    ["jogar", "tocar", "Tocar un instrumento es *tocar* (tocar violão); *jogar* es jugar."],
    ["tocar", "jogar", "Jugar al fútbol es *jogar* futebol."],
    ["sentar", "sentir", "*sentir* = sentir; *sentar* = sentar(se)."],
    ["sentir", "sentar", "*sentar* = sentarse (sente-se, por favor); *sentir* = sentir."],
    ["pegar", "bater", "Golpear es *bater*; *pegar* es agarrar, tomar."],
    ["deixar", "sair", "Salir de un lugar es *sair*; *deixar* es dejar."],
    ["tirar", "jogar", "Tirar a la basura es *jogar fora*; *tirar* es sacar (tirar uma foto)."],
    ["acordar", "lembrar", "«Acordarse» es *lembrar(-se)*: lembro da viagem. *Acordar* es despertarse."],
    ["lembrar", "acordar", "Despertarse es *acordar*: acordo às sete. *Lembrar* es recordar."]
  ];

  var SUBJ = dict({ eu: 0, tu: 1, ele: 2, ela: 2, "você": 2, "nós": 3, "vós": 4, eles: 5, elas: 5, "vocês": 5 });
  function subjectPerson(ctx) {
    var toks = ctx.e || [], i;
    for (i = ctx.ei - 1; i >= 0 && i >= ctx.ei - 4; i--) {
      if (SUBJ[toks[i]] != null) return SUBJ[toks[i]];
      if (toks[i] === "gente" && toks[i - 1] === "a") return 2;
    }
    if (/(^|\s)a gente$/.test(ctx.lead || "")) return 2;
    var stem = String(ctx && ctx.stem || "").replace(/\(.*?\)/g, " ").toLowerCase();
    var m = /(^|[^a-zà-ÿ])(eu|tu|ele|ela|você|nós|eles|elas|vocês)(?=[^a-zà-ÿ]|$)/.exec(stem);
    return m ? SUBJ[m[2]] : null;
  }

  /* The verb is in a clause about the future with quando, se, assim que…
     (quando eu chegar), not after a modal or a preposition (vou chegar). */
  // The tenses a form has for one person (conseguimos: presente o pretérito perfeito).
  function tensesOf(e, f) {
    var ts = [];
    verbForms(e).forEach(function (x) { if (x.lemma === f.lemma && x.p === f.p && ts.indexOf(TENSE_ES[x.tense]) < 0 && TENSE_ES[x.tense]) ts.push(TENSE_ES[x.tense]); });
    return ts.length ? ts.join(" o ") : TENSE_ES[f.tense];
  }

  function futCtx(ctx) {
    for (var k = ctx.ei - 1; k >= 0 && k >= ctx.ei - 4; k--) {
      var w = ctx.e[k], p = ctx.e[k - 1] || "";
      if (w === "se" && (finite(p) || isInfinitive(p))) continue;   // vai se casar: the pronoun
      if (/^(quando|se|enquanto|conforme|caso|onde|quem|como)$/.test(w)) return true;
      if (w === "que" && /^(assim|logo|sempre|depois|o)$/.test(p)) return true;
      // another verb in between: «quando você vai voltar?» is ir + infinitive
      if (finite(w) && !SUBJ_P[w] && !ARTICLES[w] && !CLITIC_ONLY[w]) return false;
    }
    return false;
  }
  /* An order: nothing before the verb but «não», a pronoun, «por favor» or a
     vocative, or the exercise asks for the imperative. */
  function imperativeCtx(ctx) {
    var w0 = ctx.e[ctx.ei] || "";
    if (DATA.nouns[w0] || DATA.nounsByPlural[w0]) return false;
    if (/imperativ|orden|pedile|pedí|decile que/i.test(String(ctx.prompt || ""))) return true;
    var before = ctx.e.slice(0, ctx.ei);
    var epz = ctx.epz || [];
    for (var k = ctx.ei; k > 0; k--) if (epz[k]) { before = ctx.e.slice(k, ctx.ei); break; }
    if (before.some(function (w) { return w === "que" || SUBJ_TRIG.indexOf(w) >= 0; })) return false;
    return before.every(function (w) { return /^(não|nunca|me|te|se|nos|lhe|lhes|o|a|os|as|por|favor|e|então|agora|já|gente|moço|moça|pessoal)$/.test(w); });
  }
  function imperativeExplain(g, e, ctx, fromInf) {
    return { cat: "subjuntivo", slip: false,
      hint: "Es una orden o un pedido: ¿qué forma toma el verbo con *você*?",
      explain: (fromInf ? it(g) + " es el infinitivo. " : "") + "Para dar una orden o pedir algo a *você* se usa la forma del subjuntivo: " + it(e) +
        " (fale, coma, abra, venha; no la de «ele fala»). Como el «hable usted» del español. En el habla de Brasil también se oye *fala!*, *vem!*." };
  }
  // A conjugated verb where the infinitive goes (vou viajo, posso saio, gosto de danço).
  function infinitiveExplain(g, e, ctx) {
    var prev = ctx.e[ctx.ei - 1] || "", lp = verbLemmas(prev);
    var prep = PREP_BASE[prev] || CONTR[prev] || /^(pra|ao)$/.test(prev);
    var goes = lp.indexOf("ir") >= 0;
    var shown = !ctx.g || ctx.g.indexOf(prev) >= 0;   // the hint names only what the learner wrote
    return { cat: "persona", slip: false,
      hint: !shown ? "Cuando van dos verbos juntos, o un verbo después de una preposición, ¿el segundo se conjuga?"
        : prep ? "Después de la preposición *" + prev + "*, ¿el verbo se conjuga?" : lp.length ? "Después de *" + prev + "*, ¿el segundo verbo se conjuga?" : "¿Ese verbo se conjuga acá?",
      explain: prep
        ? "Después de una preposición el verbo va en infinitivo, como en español: " + it(prev + " " + e) + " (gosto de dançar, para conhecer, sem saber)."
        : lp.length
          ? "Cuando dos verbos van juntos, el segundo queda en infinitivo: " + it(prev + " " + e) +
            (goes ? ". Es el «voy a…» del español, pero sin *a*: vou comer, vamos sair." : " (posso sair, quero ir, preciso trabalhar), como en español «puedo salir».")
          : "Acá va el infinitivo: " + it(e) + ", no la forma conjugada " + it(g) + "." };
  }

  function futSubjExplain(g, e, a, ctx, fromInf) {
    var before = ctx.e.slice(Math.max(0, ctx.ei - 4), ctx.ei).join(" ");
    var m = /(quando|se|assim que|logo que|enquanto|sempre que|depois que|como|onde|quem)\b[^]*$/.exec(before);
    var trig = m ? m[1] : null;
    var K = C(), p3 = null;
    try { p3 = K && bareForm(K.conjugate(a.lemma, "perfeito")[5]); } catch (ex) { /* */ }
    return { cat: "futuro_subj", slip: false,
      hint: (trig ? "Después de *" + trig + "* hablando del futuro, " : "Hablando de algo futuro o hipotético, ") + "el portugués tiene un tiempo que el español perdió.",
      explain: "Va el futuro do subjuntivo: " + it(e) + (fromInf || /^(ter|ser|ir|fazer|poder|querer|vir|ver|saber|estar|dizer|trazer|pôr)$/.test(g) ? ", no el infinitivo " + it(g) : ", no " + it(g)) +
        ". Se forma con la 3.ª plural del perfeito sin *-ram*" + (p3 && /ram$/.test(p3) ? " (" + p3 + " → " + p3.replace(/ram$/, "r").replace(/([aeiou])[íú]r$/, function (m) { return deaccent(m); }) + ")" : "") +
        ": quando eu for, se você quiser, assim que eles chegarem." };
  }
  function infPessExplain(g, e, ctx, b, a) {
    var before = ctx.e.slice(0, ctx.ei).join(" ");
    if (/\ba gente\s*$/.test(before)) return { cat: "inf_pessoal", slip: false,
      hint: "*a gente* significa «nosotros», pero ¿con qué persona va el verbo?",
      explain: "*A gente* va con la 3.ª del singular, también en el infinitivo: " + it("a gente " + e) + " (para a gente ir, antes de a gente sair)." };
    if (b && a && b.tense === "infPessoal" && a.tense === "infPessoal" && b.p !== a.p && !isInfinitive(g)) return { cat: "inf_pessoal", slip: false,
      hint: "El infinitivo concuerda con su sujeto: ¿quién es?",
      explain: it(g) + " es la forma de *" + PERS_ES[b.p] + "*; el sujeto del infinitivo es *" + PERS_ES[a.p] + "*: " + it(e) + " (para nós irmos, para eles irem)." };
    return { cat: "inf_pessoal", slip: false,
      hint: "Ese infinitivo tiene su propio sujeto: en portugués lleva persona.",
      explain: "Infinitivo pessoal: " + it(e) + ". Cuando el infinitivo tiene sujeto propio lleva la terminación de la persona: para nós *irmos*, antes de vocês *saírem*, é bom eles *saberem*." };
  }

  function participleRule(g, e, ctx) {
    var lem = participleOf(e);
    var prev = ctx.e[ctx.ei - 1] || "";
    if (!lem) {
      if (/(ado|ido)s?$/.test(g) && /(to|so|go|ue|sto)s?$/.test(e.replace(/[as]+$/, "o")) && deaccent(g).slice(0, 3) === deaccent(e).slice(0, 3)) return { cat: "participio", slip: false,
        hint: "Ese participio es irregular.",
        explain: "Participio irregular: " + it(e) + ", no *" + g + "*." };
      return null;
    }
    var gl = participleOf(g);
    var real = participlesOf(lem);
    if (!gl && (SER.indexOf(prev) >= 0 || TER.indexOf(prev) >= 0 || HAVER.indexOf(prev) >= 0) &&
        verbForms(g).some(function (v) { return v.lemma === lem; })) return { cat: "participio", slip: false,
      hint: "Después de *" + prev + "*, ¿qué forma del verbo va?",
      explain: "Después de *" + prev + "* va el participio: " + it(prev + " " + e) + " (de *" + lem.replace(/-se$/, "") + "*), no una forma conjugada como " + it(g) + "." };
    var regP = regularForm(lem, "participio");
    // doble participio (pago/pagado): ter/haver + regular, ser/estar/ficar + irregular
    if (gl === lem && g !== e && g.replace(/(a|os|as)$/, "o") !== e.replace(/(a|os|as)$/, "o")) {
      var withSer = SER.indexOf(prev) >= 0, withTer = TER.indexOf(prev) >= 0 || HAVER.indexOf(prev) >= 0;
      return { cat: "participio", slip: false,
        hint: "Ese verbo tiene dos participios. ¿Cuál va con este auxiliar?",
        explain: "Con *ser, estar* y *ficar* va el participio irregular; con *ter* y *haver*, el regular: " +
          (withSer ? it(prev + " " + e) : withTer ? it(prev + " " + e) : it(e)) + " (tinha aceitado / foi aceito; tinha pagado / foi pago — con *pagar, ganhar, gastar* hoy se acepta también *tinha pago*)." };
    }
    // regularizado (fazido, dizido, escrevido, abrido)
    var gReg = regP && (g === regP || g.replace(/(a|os|as)$/, "o") === regP);
    if (gReg && real.indexOf(regP) < 0) return { cat: "participio", slip: false,
      hint: "El participio de ese verbo es irregular.",
      explain: "Participio irregular: " + it(lem) + " → " + it(e) + ", no *" + g + "*. Los más frecuentes: feito, dito, escrito, visto, vindo, aberto, posto, coberto." };
    // concordancia del participio en la pasiva / con estar y ficar
    if (gl === lem && g.replace(/(a|os|as)$/, "o") === e.replace(/(a|os|as)$/, "o")) {
      if (SER.indexOf(prev) >= 0 || /^(sido)$/.test(prev)) {
        var subjN = null;
        for (var k = ctx.ei - 2; k >= 0 && !subjN; k--) if (DATA.nouns[ctx.e[k]] || DATA.nounsByPlural[ctx.e[k]]) subjN = ctx.e[k];
        var sgN = subjN && nounGender(subjN);
        return { cat: "participio", slip: false,
          hint: "El participio concuerda con el sujeto. Revisá la terminación.",
          explain: "Con *ser, estar* y *ficar* el participio concuerda en género y número con el sujeto: " + it(e) +
            (subjN ? ", como *" + subjN + "*" + (sgN ? " (" + (sgN === "m" ? "masculino" : "femenino") + " " + (DATA.nounsByPlural[subjN] && DATA.nounsByPlural[subjN].pl === subjN && DATA.nounsByPlural[subjN].s !== subjN ? "plural" : "singular") + ")" : "") : "") +
            ". A casa foi construída, os livros foram vendidos." };
      }
      if (TER.indexOf(prev) >= 0 || HAVER.indexOf(prev) >= 0) return { cat: "participio", slip: false,
        hint: "Con *ter*, ¿el participio cambia?",
        explain: "Con *ter* y *haver* el participio no cambia: " + it(prev + " " + e) + " (ela tinha saído, eles têm trabalhado)." };
      // the participle on its own (pôr → posto): the dictionary form
      if (ctx.e.length === 1) return { cat: "participio", slip: false,
        hint: "El participio suelto, ¿en qué género y número se cita?",
        explain: "El participio de *" + lem.replace(/-se$/, "") + "* es " + it(e) + "; solo cambia (" + it(g) + ") cuando concuerda con un sustantivo: a mesa posta, as cartas escritas." };
    }
    return null;
  }

  function verbRule(g, e, ctx) {
    var fe = verbForms(e), fg = verbForms(g);
    var prevE = ctx.e[ctx.ei - 1] || "";
    var before = ctx.e.slice(0, ctx.ei).join(" ");
    if (!fe.length) return null;
    if (prepInfo(e) || PT_COMMON[e] && !finite(g)) return null;
    if ((ARTICLES[prevE] || POSSESSIVE.indexOf(prevE) >= 0 || /^(este|esta|esse|essa|aquele|aquela)$/.test(prevE)) && (DATA.nouns[e] || DATA.nounsByPlural[e])) return null;
    if (SER.indexOf(prevE) >= 0 && DATA.adj[e] && !fg.some(function (b) { return fe.some(function (a) { return a.lemma === b.lemma && a.tense === b.tense; }); })) return null;
    if (/^(à|às|ao|aos|da|do|das|dos|pela|pelo|pelas|pelos|na|no|nas|num|numa)$/.test(prevE) && (DATA.nouns[e] || DATA.nounsByPlural[e]) &&
        !isInfinitive(e) && !/(rmos|rem|res)$/.test(e)) return null;
    // Existential haver is impersonal: houve, havia (never houveram, haviam)
    if (/^(houveram|haviam|haverão|haveriam|hajam|houvessem)$/.test(g) && /^(houve|havia|haverá|haveria|haja|houvesse)$/.test(e)) return { cat: "persona", slip: false,
      hint: "*haver* con el sentido de «existir», ¿tiene plural?",
      explain: "*Haver* existencial es impersonal y va siempre en singular: " + it(e) + " muitos problemas (como «hubo» en el español cuidado). Con *ter* en el habla: tinha muitos problemas." };
    // Prefer the reading that fits the context: subjuntivo after a trigger.
    var trig = SUBJ_TRIG.filter(function (w) { return (" " + before + " ").indexOf(" " + w + " ") >= 0; })[0];
    if (trig || /\bque\s*$/.test(before)) fe = fe.slice().sort(function (a, b) {
      return (/^subj/.test(b.tense) ? 1 : 0) - (/^subj/.test(a.tense) ? 1 : 0);
    });
    if (FUT_SUBJ_TRIG.test(before)) fe = fe.slice().sort(function (a, b) {
      return (b.tense === "subjFuturo" ? 1 : 0) - (a.tense === "subjFuturo" ? 1 : 0);
    });
    if (fg.length) fe = fe.slice().sort(function (a, b) {
      return ((b.p % 3 === fg[0].p % 3) ? 1 : 0) - ((a.p % 3 === fg[0].p % 3) ? 1 : 0);
    });
    var subjP = subjectPerson(ctx);
    if (subjP != null) fe = fe.slice().sort(function (a, b) { return (b.p === subjP ? 1 : 0) - (a.p === subjP ? 1 : 0); });
    else fe = fe.slice().sort(function (a, b) { return (b.p === 2 ? 1 : 0) - (a.p === 2 ? 1 : 0); });
    // The future subjunctive only after quando, se, assim que… (vou viajar
    // is an infinitive, even if «viajar» is also the form of «quando eu viajar»).
    var futC = futCtx(ctx);
    fe = fe.slice().sort(function (a, b) {
      var ra = a.tense === "subjFuturo" ? (futC ? 0 : 2) : 1, rb = b.tense === "subjFuturo" ? (futC ? 0 : 2) : 1;
      return ra - rb;
    });
    var lemE = fe[0].lemma;
    var lemG = fg.length ? fg[0].lemma : null;

    // gostar: persona del que gusta, o «gosta» por «gosto» (me gusta)
    if (lemE === "gostar" && lemG === "gostar" && prevE && /^(me|te|lhe|nos)$/.test(ctx.g && ctx.g[ctx.gi - 1] || "")) return { cat: "gostar", slip: false,
      hint: "Con *gostar* la persona es el sujeto: sin pronombre delante.",
      explain: "*Me gosta* es un calco de «me gusta»: en portugués la persona es el sujeto de gostar: " + it("eu " + e) + " de…" };

    // A conjugated verb where the infinitive goes (vou viajo → vou viajar)
    if (isInfinitive(e) && !futC && !isInfinitive(g) && fg.some(function (b) {
      return b.tense !== "infPessoal" && fe.some(function (a) { return a.lemma === b.lemma; });
    })) return infinitiveExplain(g, e, ctx);

    // Same lemma
    for (var i = 0; i < fe.length; i++) {
      for (var j = 0; j < fg.length; j++) {
        var a = fe[i], b = fg[j];
        if (a.lemma !== b.lemma) continue;
        if (a.tense === b.tense && a.p !== b.p) {
          if (a.tense === "infPessoal") return infPessExplain(g, e, ctx, b, a);
          if (a.lemma === "gostar" && b.p === 2 && a.p === 0) return { cat: "gostar", slip: false,
            hint: "Con *gostar* el sujeto es la persona que gusta, no la cosa.",
            explain: "Gostar va al revés que gustar: *eu gosto* (a mí me gusta), *ela gosta* (a ella le gusta). Acá: " + it(e) + "." };
          // «tinham muita gente»: ter meaning «there is» is impersonal, like haver
          if (a.lemma === "ter" && a.p === 2 && b.p === 5 && subjP == null &&
              /^(muita|muito|muitas|muitos|pouca|pouco|poucas|poucos|um|uma|uns|umas|gente|alguém|ninguém|algum|alguma|nenhum|nenhuma|\d+|dois|duas|três|mais|menos|tanta|tanto)$/.test(ctx.e[ctx.ei + 1] || "")) return { cat: "persona", slip: false,
            hint: "*ter* con el sentido de «hay / había», ¿tiene plural?",
            explain: "*Ter* con el sentido de «hay / había» (en el habla) es impersonal y va siempre en singular: " + it(e + " " + ctx.e.slice(ctx.ei + 1, ctx.ei + 3).join(" ")) + ", como «había mucha gente» (nunca «habían»). Lo mismo con *haver*: havia, houve." };
          var alt = subjP != null && subjP !== a.p ? fe.filter(function (x) { return x.lemma === a.lemma && x.tense === a.tense && x.p === subjP; })[0] : null;
          if (alt) a = alt;
          var gente = /\ba gente\s*$/.test(before.replace(/\s+(não|já|também|sempre|nunca|me|se|te|lhe|nos)\s*$/, " ")) ||
            (!before && /(^|\s)a gente$/.test(ctx.lead || ""));
          var voce = /\b(você|vocês|o senhor|a senhora)\s*$/.test(before.replace(/\s+(não|já|também|sempre|nunca|me|se|te|lhe|nos)\s*$/, " "));
          return { cat: "persona", slip: false,
            hint: gente ? "*a gente* significa «nosotros», pero ¿con qué persona del verbo va?"
                 : voce ? "*você* es «vos/usted», pero ¿con qué persona del verbo va?"
                 : "El verbo está bien elegido, pero no en la persona correcta. ¿Quién es el sujeto?",
            explain: gente ? "*A gente* (= nós, en el habla) va con el verbo en tercera del singular: " + it("a gente " + e) + " (a gente vai, a gente fala)."
                   : voce ? "*Você* y *vocês* van con el verbo en tercera persona: " + it(e) + " (você fala, vocês falam)."
                   : it(g) + " es la forma de *" + PERS_ES[b.p] + "*; el sujeto acá es *" + PERS_ES[a.p] + "*: " + it(e) + "." +
                     (a.p === 5 && b.p === 4 ? " El «ustedes» es *vocês*, con verbo en tercera plural." : "") };
        }
        if (a.p === b.p && a.tense !== b.tense) return tenseRule(g, e, a, b, ctx);
      }
    }
    // Regularization of an irregular verb (fazi → fiz, sabo → sei, fazerei → farei)
    for (var k = 0; k < fe.length; k++) {
      var f = fe[k];
      var rg = regularForm(f.lemma, f.tense, f.p);
      if (rg && rg === g && rg !== e) {
        // A spelling change of a regular verb (ficei → fiquei) is spelling, not regularization.
        if (e.replace(/qu(?=[ei])/g, "c") === g || e.replace(/gu(?=[ei])/g, "g") === g || e.replace(/c(?=[ei])/g, "ç") === g ||
            e.replace(/j(?=[ao])/g, "g") === g || e.replace(/ç(?=[aou])/g, "c") === g) {
          return { cat: "ortografia", slip: false,
            hint: "Mirá cómo suena la consonante de la palabra marcada.",
            explain: "Para conservar el sonido cambia la letra: " + it(e) + " (ficar → fiquei, chegar → cheguei, começar → comecei, dirigir → dirijo)." };
        }
        var stemNote = (f.tense === "futuro" || f.tense === "condicional") ? " En futuro y condicional *fazer, dizer* y *trazer* acortan la raíz: farei, direi, trarei; faria, diria, traria." :
          f.tense === "perfeito" ? " Los perfeitos irregulares más usados: fui, fiz, tive, estive, pude, quis, disse, vi, vim, dei, soube, trouxe, pus." :
          f.tense === "presente" && f.p === 0 ? " En el presente varios irregulares cambian solo la primera persona: faço, digo, trago, ouço, peço, perco, posso, sei." : "";
        return { cat: "regularizacion", slip: false,
          hint: "Ese verbo no es regular en este tiempo.",
          explain: it(f.lemma) + " es irregular: " + it(e) + ", no *" + g + "*." + stemNote };
      }
    }
    // A mix of the Spanish and Portuguese irregular (tuvo, hizo, fizo, esteje, seje)
    if (!fg.length) {
      var f0 = fe[0];
      if (/ie|[^qg]ue/.test(g) && !/ie|[^qg]ue/.test(e) && !isPortuguese(g) && !spanishWord(g) &&
          editDistance(deaccent(g), deaccent(e)) <= 4 && /(am|em|mos|ou|eu|iu)$/.test(g) &&
          editDistance(deaccent(g.replace(/ie/, "e").replace(/([^qg])ue/, "$1o")), deaccent(e)) < editDistance(deaccent(g), deaccent(e))) return { cat: "espanol", slip: false,
        hint: it(g) + " tiene el diptongo del español. ¿Cómo es ese verbo en portugués?",
        explain: it(g) + " mezcla el español con el portugués: el diptongo *ie* / *ue* del español (dos vocales en una sílaba: tiene, quiero, puede) no va en portugués (tenho, quero, pode, fizeram). Acá: " +
          it(e) + " (" + it(f0.lemma) + ", " + PERS_ES[f0.p] + ", " + TENSE_ES[f0.tense] + ")." };
      if (/^(seje|sejem|sejemos|esteje|estejem|estejemos)$/.test(g)) return { cat: "verbo_irregular", slip: false,
        hint: "Revisá la terminación de ese subjuntivo.",
        explain: "El subjuntivo de *ser* y *estar* es " + it(e) + " (seja, esteja), aunque en el habla se oiga «seje»." };
      if (deaccent(g).slice(0, 2) === deaccent(e).slice(0, 2) || editDistance(deaccent(g), deaccent(e)) <= 2) {
        var sp = spanishWord(g);
        if (sp) return spanishExplain(g, e, sp, ctx);
        var regE = regularForm(f0.lemma, f0.tense, f0.p);
        // a slip of one letter (estve, tinahm) is a typo, not the irregular verb
        if (editDistance(deaccent(g), deaccent(e)) === 1 && e.length >= 4 && !spanishWord(g) &&
            (!regE || editDistance(deaccent(g), deaccent(regE)) > 1)) return null;
        var dipt = /[^qg]ue|ie/.test(g) && !/[^qg]ue|ie/.test(e) &&
          editDistance(deaccent(g.replace(/ie/, "e").replace(/([^qg])ue/, "$1o")), deaccent(e)) < editDistance(deaccent(g), deaccent(e));
        if (regE && regE !== e) return { cat: "verbo_irregular", slip: false,
          hint: dipt ? "Esa *ie* o *ue* es del español: ¿cómo es ese verbo en portugués?" : "Revisá la forma de ese verbo irregular.",
          explain: it(g) + (knownWord(g) ? " no es la forma que va" : " no existe") + "; " + it(f0.lemma) + " es irregular en " + TENSE_ES[f0.tense] + ": " + it(e) + " (" + PERS_ES[f0.p] + ")." +
            (dipt ? " La *ie* / *ue* del español (quiero, tiene, puede) no va en portugués (quero, tenho, pode, mantêm)." : "") };
        if (!isPortuguese(g) && editDistance(deaccent(g), deaccent(e)) === 1 && e.length >= 4) return null;
        return { cat: "persona", slip: false,
          hint: "Revisá la terminación del verbo.",
          explain: it(g) + (knownWord(g) ? " no es la forma que va" : " no existe") + "; la forma es " + it(e) + " (" + it(f0.lemma) + ", " + PERS_ES[f0.p] + ", " + TENSE_ES[f0.tense] + ")." };
      }
    }
    // Different verbs: the classic confusions
    if (lemG && lemE && lemG !== lemE) {
      var lg = lemG.replace(/-se$/, ""), le = lemE.replace(/-se$/, "");
      if (lg === le) return { cat: "pronome", slip: false,
        hint: "Revisá el pronombre del verbo.", explain: "Acá va " + it(e) + "." };
      if (/^(ser|estar|ficar)$/.test(lg) && /^(ser|estar|ficar)$/.test(le)) return serEstar(g, e, lg, le, ctx);
      if (lg === "haver" && le === "ter" && participleOf(ctx.e[ctx.ei + 1] || "")) return { cat: "perfeito_composto", slip: false,
        hint: "¿Con qué auxiliar se forma ese tiempo compuesto en el portugués de hoy?",
        explain: it(g) + " es de *haver*: los tiempos compuestos se forman con *ter*: " + it(e + " " + ctx.e[ctx.ei + 1]) +
          ". *Haver* + participio solo queda en lo escrito formal y en pasado (havia feito = tinha feito); *hei feito* no se usa (no es el «he hecho» del español)." };
      for (var c = 0; c < VERB_CONFUSIONS.length; c++) {
        var vc = VERB_CONFUSIONS[c];
        if (vc[0] === lg && vc[1] === le) return { cat: "lexico", slip: lg === "ter" && le === "haver",
          hint: "Ese verbo no es el que corresponde acá. Pensá en qué significa exactamente.",
          explain: vc[2] + " Acá: " + it(e) + "." };
      }
      return { cat: "lexico", slip: false,
        hint: "Ese verbo no es el que va.",
        explain: it(g) + " es de *" + lg + "*" + (DATA.lex[lg] ? " («" + DATA.lex[lg] + "»)" : "") +
          "; acá va " + it(e) + ", de *" + le + "*" + (DATA.lex[le] ? " («" + DATA.lex[le] + "»)" : "") + "." };
    }
    if (fg.length && fe.length) return { cat: "tempo", slip: false,
      hint: "Revisá el verbo marcado: ¿qué tiempo y qué persona van?",
      explain: it(g) + " es " + TENSE_ES[fg[0].tense] + " (" + PERS_ES[fg[0].p] + "); acá va " + it(e) + " (" + TENSE_ES[fe[0].tense] + ", " + PERS_ES[fe[0].p] + ", de " + it(fe[0].lemma) + ")." };
    return null;
  }

  /* ser, estar, ficar: the rule, the learner's verb and, where the Spanish
     speaker is led astray, the contrast. */
  function serEstar(g, e, lg, le, ctx) {
    var next = ctx.e[ctx.ei + 1] || "";
    var pass = le === "ser" && participleOf(next) && !DATA.adj[next];
    var why = pass ? "La voz pasiva se forma con *ser* + participio: " + it(e + " " + next) + " (como «fue escrita»). *Estar* + participio es el estado que queda después (a carta está escrita = ya está escrita)."
      : le === "ser" ? "Acá va *ser*: identidad, origen, profesión, características, y dónde es un evento (ele é carioca, sou de Rosario, a festa é no sábado). *Estar* es para estados y para dónde está alguien."
      : le === "estar" && lg === "ser" ? "Acá va *estar*: estados pasajeros (estou cansado), dónde está alguien o algo en este momento (ela está em casa) y *estar + gerúndio*. *Ser* es para lo que algo es."
      : le === "ficar" ? "Para dónde queda algo que no se mueve, el portugués prefiere *ficar*: o Cristo fica no Corcovado, o hotel fica no centro (en español «está»). Y *ficar* es también «quedarse» y «ponerse» (fiquei feliz)."
      : "Acá va *estar*: el estado o el lugar en este momento; *ficar* es quedarse, ponerse o quedar (un lugar fijo).";
    return { cat: "ser_estar", slip: false,
      hint: pass ? "¿Es una voz pasiva (lo que alguien hizo) o un estado?"
        : le === "ficar" || lg === "ficar" ? "¿Algo que está siempre en el mismo lugar, un cambio de estado o un estado de ahora?"
        : "¿Es lo que algo es (una característica, el origen) o cómo o dónde está ahora?",
      explain: it(g) + " es de *" + lg + "*. " + why + " Acá: " + it(e) + "." };
  }

  var SUBJ_ES = ["yo haga", "hagas", "haga", "hagamos", "hagáis", "hagan"];
  function tenseRule(g, e, a, b, ctx) {
    var before = ctx.e.slice(0, ctx.ei).join(" ");
    var trigger = SUBJ_TRIG.filter(function (w) { return (" " + before + " ").indexOf(" " + w + " ") >= 0; })[0];
    var se = /(^|\s)se(\s|$)/.test(before) || /(^|\s)se\s+\S+\s*$/.test(before);
    if (a.tense === "subjFuturo") return futSubjExplain(g, e, a, ctx, b.tense === "infPessoal");
    if (a.tense === "infPessoal") return infPessExplain(g, e, ctx);
    if (a.tense === "subjImperfeito" && se) return { cat: "subjuntivo", slip: false,
      hint: "Es una condición con *se* sobre algo que no es real: ¿qué modo va?",
      explain: "Condición irreal: *se* + imperfeito do subjuntivo (" + it(e) + ") y en la otra parte el condicional: se eu tivesse tempo, viajaria. Igual que «si tuviera», pero solo con la forma en *-sse*." };
    if (a.tense === "subjPresente" && !trigger && !/\bque\s*$/.test(before) && imperativeCtx(ctx)) return imperativeExplain(g, e, ctx);
    if (a.tense === "subjPresente" || a.tense === "subjImperfeito") return { cat: "subjuntivo", slip: false,
      hint: (trigger ? "Mirá lo que viene antes: " + it(trigger) + ". " : "") + "¿Qué modo pide?",
      explain: (trigger ? "Después de " + it(trigger) + " va subjuntivo" : /(^|\s)que(\s+\S+)?\s*$/.test(before) ? "Con *que* delante, acá va el subjuntivo" : "Acá va subjuntivo") + ": " + it(e) + ", no " + it(g) +
        ". Deseo, duda, pedido, emoción, *para que, embora, talvez* → subjuntivo, como en español." };
    if ((a.tense === "presente" || a.tense === "perfeito" || a.tense === "imperfeito" || a.tense === "futuro") && /^subj/.test(b.tense)) {
      if (b.tense === "subjFuturo" || /\b(achar|acho|acha|acredito|creio|penso|sei|parece|é certo|tenho certeza)\s+que\s*$/.test(before) || true) return { cat: "subjuntivo", slip: false,
        hint: "¿Hace falta el subjuntivo acá?",
        explain: /\b(acho|acha|achamos|acham|acredito|creio|penso)\s+que\s*$/.test(before)
          ? "*Achar que, acreditar que, pensar que* afirman una opinión: van con indicativo, como en español: " + it(e) + " (acho que ele vem)."
          : it(g) + " es subjuntivo (como «que " + (SUBJ_ES[b.p] || "haga") + "»); acá se afirma un hecho: va " + it(e) + ", como en español." };
    }
    if (a.tense === "condicional" && b.tense === "subjImperfeito") return { cat: "subjuntivo", slip: false,
      hint: "Esta es la consecuencia, no la condición.",
      explain: "En la consecuencia va el condicional (" + it(e) + "); el imperfeito do subjuntivo va después de *se*." };
    if (a.tense === "subjImperfeito" && b.tense === "condicional") return { cat: "subjuntivo", slip: false,
      hint: "Después de *se* hipotético, ¿condicional?",
      explain: "Después de *se* no va condicional: " + it(e) + " (se eu pudesse, viajaria)." };
    if (a.tense === "condicional" && b.tense === "futuro") return { cat: "tempo", slip: false,
      hint: "¿Futuro o condicional?",
      explain: "Condicional (futuro do pretérito, -ia): " + it(e) + ". El futuro sería " + it(g) + "." };
    if (a.tense === "imperfeito" && b.tense === "perfeito") return { cat: "tempo", slip: false,
      hint: "¿Acción puntual o descripción, costumbre del pasado?",
      explain: "Para describir o contar lo habitual en el pasado va el imperfeito: " + it(e) + " (quando eu era criança, morava no interior)." };
    if (a.tense === "perfeito" && b.tense === "imperfeito") return { cat: "tempo", slip: false,
      hint: "¿Acción terminada que hace avanzar el relato, o descripción?",
      explain: "Una acción cerrada, que pasó y terminó, va en perfeito: " + it(e) + " (um dia, mudamos)." };
    return { cat: "tempo", slip: false,
      hint: "El verbo es el correcto, pero no el tiempo. Mirá las pistas temporales de la frase.",
      explain: it(g) + " es " + TENSE_ES[b.tense] + "; acá va " + TENSE_ES[a.tense] + ": " + it(e) + "." };
  }

  // The verb before the word, skipping adverbs (penso muito em você).
  var ADV_SKIP = /^(muito|sempre|também|não|já|mais|bem|nunca|ainda|só|tanto|pouco|logo|hoje|ontem|agora|me|te|se|lhe|nos)$/;
  function verbLemmasBefore(ctx) {
    for (var k = ctx.ei - 1; k >= 0 && k >= ctx.ei - 3; k--) {
      var w = ctx.e[k];
      if (!w) break;
      var l = verbLemmas(w);
      if (l.length) return l;
      if (!ADV_SKIP.test(w)) break;
    }
    return [];
  }
  function verbLemmas(w) {
    if (!w) return [];
    return verbForms(w).map(function (v) { return v.lemma.replace(/-se$/, ""); })
      .concat(participleOf(w) ? [participleOf(w).replace(/-se$/, "")] : [])
      .concat(isInfinitive(w) ? [w] : [])
      .concat(gerundOf(w) ? [gerundOf(w)] : []);
  }

  /* Regencia: el verbo y su preposición (la que el español no pone, o
     pone otra).  [preposición, ejemplo] */
  var REGENCIA = dict({
    gostar: ["de", "gosto de café, gosto do Rio"], precisar: ["de", "preciso de ajuda"], lembrar: ["de", "lembro da viagem"],
    esquecer: ["de", "esqueci do nome (o esqueci o nome)"], depender: ["de", "depende do tempo"], desistir: ["de", "desisti do curso"],
    duvidar: ["de", "duvido disso"], gostaria: ["de", "gostaria de um café"], cuidar: ["de", "cuida dos filhos"],
    pensar: ["em", "penso em você"], acreditar: ["em", "acredito em você"], confiar: ["em", "confio em você"],
    insistir: ["em", "insiste em pagar"], morar: ["em", "moro em Botafogo"], entrar: ["em", "entrei na loja"],
    sonhar: ["com", "sonhei com você"], casar: ["com", "casou com a Bia"], concordar: ["com", "concordo com você"],
    parecer: ["com", "parece com a mãe"], preocupar: ["com", "me preocupo com você"], "sonhar-se": ["com", ""],
    assistir: ["a", "assisti ao jogo (en el habla: assisti o jogo)"], obedecer: ["a", "obedecer às regras"],
    responder: ["a", "responder à pergunta"], referir: ["a", "refiro-me ao texto"], chegar: ["a", "chegar ao Rio (habla: chegar no Rio)"],
    ir: ["a", "ir à praia (habla: ir na praia)"], aspirar: ["a", "aspira a um cargo"], "começar": ["a", "começou a chover"],
    aprender: ["a", "aprender a nadar"], ensinar: ["a", "ensinar a ler"], ajudar: ["a", "ajudar a carregar"],
    continuar: ["a", "continua a chover"], voltar: ["a", "voltou a estudar"], deixar: ["de", "deixou de fumar"],
    acabar: ["de", "acabei de chegar"], parar: ["de", "parei de fumar"], tratar: ["de", "trata-se de…"],
    namorar: ["", "namoro a Bia (sin «com»)"], visitar: ["", "visitei meus avós"], esperar: ["", "espero você"],
    convidar: ["para", "convidou para a festa"], preparar: ["para", "preparar-se para a prova"]
  });

  function prepRule(g, e, pg, pe, ctx) {
    var next = ctx.e[ctx.ei + 1] || "", prev = ctx.e[ctx.ei - 1] || "";
    var lemPrev = verbLemmasBefore(ctx);
    if (pg.base === pe.base && pg.art && pe.art && !ARTICLES[pe.art]) {
      // desta / dessa: este (lo de acá, lo de ahora) and esse (lo de ahí)
      var dem = function (w) { return /^(est|isto)/.test(w) ? 1 : /^(ess|isso)/.test(w) ? 2 : /^(aquel|aquilo)/.test(w) ? 3 : 0; };
      if (dem(pg.art) && dem(pe.art) && dem(pg.art) !== dem(pe.art)) return { cat: "pronome", slip: false,
        hint: "¿Lo de acá, lo de ahí o lo de allá?",
        explain: it(e) + " = *" + pe.base + " + " + pe.art + "*. *Este* es lo de acá y lo de ahora (neste momento, desta vez); *esse*, lo de ahí o lo que ya se dijo; *aquele*, lo de allá. En el habla de Brasil *este* y *esse* se mezclan; en lo escrito se distinguen." };
      if (/^(ele|ela|eles|elas)$/.test(pg.art) && /^(ele|ela|eles|elas)$/.test(pe.art)) return { cat: "pronome", slip: false,
        hint: "¿De quién es? Mirá quién tiene la cosa.",
        explain: it(e) + " = *" + pe.base + " + " + pe.art + "*: *dele, dela, deles, delas* concuerdan con quien tiene la cosa, no con la cosa (a casa dele = la casa de él). El «su» del español no lo marca; el portugués sí." };
    }
    if (pg.base === pe.base) {
      if (pe.art && pg.art) {
        var ag = ARTICLES[pg.art], ae = ARTICLES[pe.art];
        var noun = next;
        var gNoun2 = ctx.g ? ctx.g[ctx.gi + 1] : noun;
        var echo = gNoun2 !== noun && ag && guessGender(gNoun2) === ag[0];
        if (ag && ae && ag[0] !== ae[0]) {
          var gen = nounGender(noun);
          return { cat: "genero", slip: false, echo: echo,
            hint: "Revisá el género de " + (ctx.g && ctx.g[ctx.gi + 1] === noun ? it(noun) : "la palabra que sigue") + ".",
            explain: it(e) + " = *" + pe.base + " + " + pe.art + "*: " + it(noun) + " es " + (ae[0] === "m" ? "masculino" : "femenino") + " en portugués." +
              (HETERO_ES[noun] ? " (En español es " + HETERO_ES[noun] + ": cambia de género.)" : "") + (gen && DATA.nouns[noun] && DATA.nouns[noun].note ? " " + DATA.nouns[noun].note : "") };
        }
        if (ag && ae && ag[1] !== ae[1]) return { cat: "concordancia", slip: false,
          hint: "Revisá el número: ¿singular o plural?",
          explain: it(e) + " = *" + pe.base + " + " + pe.art + "*: concuerda con " + it(noun) + " (" + (ae[1] === "p" ? "plural" : "singular") + ")." };
        return { cat: "contraccion", slip: false, hint: "Revisá la contracción.",
          explain: it(e) + " = *" + pe.base + " + " + pe.art + "*." };
      }
      if (pe.art && !pg.art) {
        var place = PLACE_ART[next];
        return { cat: "contraccion", slip: false,
          hint: "Acá la preposición va unida a un artículo.",
          explain: it(e) + " = *" + pe.base + " + " + pe.art + "*" + (place ? ": " + it(next.charAt(0).toUpperCase() + next.slice(1)) + " lleva artículo (o Brasil, a Argentina, o Rio de Janeiro)" : "") +
            ". En portugués la preposición se funde con el artículo, y es obligatorio (no, na, do, da, ao, pelo)." };
      }
      if (!pe.art && pg.art) return { cat: "articulo", slip: false,
        hint: "Acá la preposición va sola, sin artículo.",
        explain: "Acá va " + it(e) + " sin artículo" + (next && PLACE_NOART.test(next) ? ": las ciudades y muchos barrios van sin artículo (em São Paulo, de Lisboa, em Copacabana), salvo o Rio, o Recife, o Porto" : "") + "." };
      return { cat: "preposicion", slip: false, hint: "Revisá la preposición.", explain: "Acá va " + it(e) + "." };
    }
    // Regencia del verbo anterior
    for (var i = 0; i < lemPrev.length; i++) {
      var R = REGENCIA[lemPrev[i]];
      if (R && R[0] === pe.base) {
        if (lemPrev[i] === "gostar") return { cat: "gostar", slip: false,
          hint: "¿Qué preposición lleva *gostar*?",
          explain: "*Gostar* lleva siempre *de*: " + R[1] + ". Acá: " + it(prev + " " + e) + "." };
        return { cat: "regencia", slip: false,
          hint: "Ese verbo pide una preposición distinta de la del español.",
          explain: "*" + lemPrev[i] + " " + R[0] + "*: " + R[1] + ". Acá: " + it(prev + " " + e) + "." };
      }
    }
    var why;
    if (pe.base === "em" && (pg.base === "a" || pg.base === "para") && /^(morar|estar|ficar|trabalhar|viver)$/.test(lemPrev[0] || "")) {
      why = "Para estar o vivir en un lugar va *em* (moro em Botafogo, estou na praia).";
    } else if ((pe.base === "a" || pe.base === "para") && pg.base === "em") {
      why = "Con verbos de movimiento la norma pide *a* o *para* (vou à praia, vou para casa); *ir no, chegar em* son del habla.";
    } else if (pe.base === "de" && pg.base === "em" && /^(carro|ônibus|avião|trem|metrô|barco|bicicleta|bike|moto|táxi|uber)$/.test(next)) {
      why = "Los medios de transporte van con *de*: de ônibus, de carro, de metrô (pero *a pé*).";
    } else if (pe.base === "para" && pg.base === "por") {
      why = "*para* = finalidad o destino (estudo para a prova, vou para o Rio); *por* = causa, lugar por donde, a cambio de (passei pela Lapa, obrigado pelo presente).";
    } else if (pe.base === "por" && pg.base === "para") {
      why = "*por* = causa, lugar por donde se pasa, intercambio, duración (passei pela praia, obrigado por tudo); *para* = finalidad o destino.";
    } else if (pe.base === "de" && pg.base === "a" && /^(\d|uma|duas|três|quatro|cinco)/.test(next)) {
      why = "Horario «de… a…»: *de* segunda *a* sexta, *das* nove *às* seis.";
    } else if (pe.base === "há" || (pe.base === "desde" && pg.base === "há")) {
      why = "*há* + tiempo = hace (cheguei há dois anos); *desde* = desde (moro aqui desde 2020).";
    } else if (pe.base === "em" && pg.base === "de" && /^(\d{4}|janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)$/.test(next)) {
      why = "Con años y meses va *em*: em 2024, em janeiro.";
    } else if (pe.base === "de" && pg.base === "desde") {
      why = "El punto de partida en el espacio va con *de* (saio de casa, venho do Rio); *desde* es para el tiempo (desde 2020, desde criança) o para subrayar la distancia (desde o Rio até São Paulo).";
    } else if (pe.base === "até" && /^(desde|a|para|hasta)$/.test(pg.base)) {
      why = "«Hasta» es *até*: vou a pé até a praia, até amanhã, de segunda até sexta.";
    } else if ((pe.base === "para" || pe.base === "a") && pg.base === "de") {
      why = "*de* marca el origen (venho de Salvador); el destino va con *para* o *a* (vou para Salvador, vou a Salvador).";
    } else if (pe.base === "de" && (pg.base === "para" || pg.base === "a")) {
      why = "El origen va con *de* (venho de Salvador, saí de casa); *para* y *a* marcan el destino.";
    } else if (pe.base === "com" && pg.base !== "com") {
      why = "Acá va *com*: con quién o con qué (falei com ela, sonhei com você).";
    } else {
      why = "El portugués usa acá " + it(e) + ", no " + it(g) + ". Las preposiciones no se traducen una a una desde el español: conviene aprenderlas con su verbo o su expresión.";
    }
    return { cat: "preposicion", slip: false,
      hint: "Revisá la preposición marcada: el español te está tirando para otro lado.",
      explain: why };
  }

  function articleRule(g, e, ctx) {
    var noun = ctx.e[ctx.ei + 1] || "", ag = ARTICLES[g], ae = ARTICLES[e];
    var gNoun = ctx.g && ctx.gi >= 0 ? ctx.g[ctx.gi + 1] : noun;
    var shown = gNoun === noun ? noun : null;
    var r;
    if (!noun || !/^[a-zà-ÿ]/.test(noun)) {
      var gg = ag[0] !== ae[0];
      r = { cat: gg ? "genero" : ag[1] !== ae[1] ? "concordancia" : "articulo", slip: false,
        hint: gg ? "Revisá el género." : "Revisá el artículo.",
        explain: "Acá va " + it(e) + (gg ? " (" + (ae[0] === "m" ? "masculino" : "femenino") + "), no " + it(g) : "") + "." };
    } else if (ag[0] !== ae[0]) {
      var gen = ae[0] === "m" ? "masculino" : "femenino";
      var info = DATA.nouns[noun] || DATA.nounsByPlural[noun];
      r = { cat: "genero", slip: false,
        hint: "Revisá el género de " + it(noun) + ".",
        explain: it(noun) + " es " + gen + " en portugués: " + it(e + " " + noun) + "." +
          (HETERO_ES[noun] || HETERO_ES[noun.replace(/s$/, "")] ? " En español es " + (HETERO_ES[noun] || HETERO_ES[noun.replace(/s$/, "")]) + ": son de los que cambian de género (o leite, a árvore, a viagem, o nariz)." :
           /agem$|agens$/.test(noun) ? " Las palabras en *-agem* son femeninas: a viagem, a mensagem, a garagem." : "") +
          (info && info.note ? " " + info.note : "") };
    } else if (ag[1] !== ae[1]) {
      r = { cat: "concordancia", slip: false,
        hint: "Revisá el número: ¿singular o plural?",
        explain: it(noun) + " está en " + (ae[1] === "p" ? "plural" : "singular") + ": " + it(e + " " + noun) + "." };
    } else {
      r = { cat: "articulo", slip: false,
        hint: "¿Artículo determinado o indeterminado?",
        explain: "Acá va " + (ae[2] === "det" ? "el artículo determinado" : "el indeterminado") + ": " + it(e + " " + noun) + "." };
    }
    if (!shown) {
      r.hint = r.cat === "genero" ? "Revisá el artículo y la palabra que lo sigue: ¿son del mismo género?" : "Revisá el artículo y la palabra que lo sigue.";
      // The learner chose another noun and the article agrees with it: the
      // article is only the echo of that choice.
      var gg2 = gNoun ? guessGender(gNoun) : null;
      if (gg2 && gg2 === ag[0] && r.cat !== "articulo") r.echo = true;
    }
    return r;
  }

  // The noun an adjective agrees with: the nearest known noun.
  function nounNear(ctx) {
    var cands = [ctx.e[ctx.ei - 1], ctx.e[ctx.ei + 1], ctx.e[ctx.ei - 2], ctx.e[ctx.ei + 2]];
    for (var i = 0; i < cands.length; i++) {
      var w = cands[i];
      if (w && (DATA.nouns[w] || DATA.nounsByPlural[w] || HETERO[w])) return w;
    }
    return null;
  }

  function agreementRule(g, e, ctx) {
    var pe = participleOf(e);
    var prev = ctx.e[ctx.ei - 1] || "";
    if (pe && (SER.indexOf(prev) >= 0)) return { cat: "participio", slip: false,
      hint: "El participio concuerda con el sujeto. Revisá la terminación.",
      explain: "Con *ser, estar* y *ficar* el participio concuerda: " + it(e) + " (a casa foi vendida, elas estão cansadas)." };
    if (ARTICLES[e] && !ARTICLES[g]) return { cat: "articulo", slip: false, hint: "Revisá el artículo.", explain: "Acá va " + it(e) + "." };
    var vfe = verbForms(e);
    if (!isPortuguese(g) && vfe.length && !pe) return { cat: "persona", slip: false,
      hint: "Revisá la terminación del verbo.",
      explain: it(g) + (knownWord(g) ? " no es la forma que va" : " no existe") + "; la forma es " + it(e) + " (" + it(vfe[0].lemma) + ", " + PERS_ES[vfe[0].p] + ", " + TENSE_ES[vfe[0].tense] + ")." };
    var head = nounNear(ctx);
    var gen = head ? nounGender(head) : null;
    var pl = /s$/.test(e) ? "plural" : "singular";
    return { cat: "concordancia", slip: false,
      hint: head ? "Revisá la concordancia de la palabra marcada: ¿con qué palabra concuerda?"
                 : "Revisá la terminación de la palabra marcada: marca género y número.",
      explain: head ? "Concordancia: " + it(e) + ", porque concuerda con " + it(head) + (gen ? " (" + (gen === "m" ? "masculino" : "femenino") + " " + pl + ")" : "") +
                      ". Artículos, posesivos, adjetivos y participios toman el género y el número del sustantivo." +
                      (HETERO_ES[head] ? " Ojo: " + it(head) + " no tiene el género del español (" + HETERO_ES[head] + ")." : "")
                    : "La forma es " + it(e) + ": la terminación marca el género y el número (-o / -a, -os / -as)." };
  }

  /* ----------------------------------------------- palabras que faltan o sobran */

  function missRule(w, ctx) {
    var next = ctx.e[ctx.ei + 1] || "", prev = ctx.e[ctx.ei - 1] || "";
    var lemPrev = verbLemmasBefore(ctx);
    // «Argentina é…» → «A Argentina»: «a» before a feminine noun or place is the article
    var artFirst = ARTICLES[w] && !isVerbish(next) && (PLACE_ART[next] || DATA.nouns[next] || DATA.nounsByPlural[next] || HETERO[next]) &&
      (!/^(a|as)$/.test(w) || nounGender(next) === "f" || PLACE_ART[next] === "f");
    if ((PREP_BASE[w] || CONTR[w]) && !artFirst) {
      if (lemPrev.indexOf("gostar") >= 0 || (ctx.g && /^(gosto|gosta|gostam|gostamos|gostei|gostou|gostava)$/.test(prev))) return { cat: "gostar", slip: false,
        hint: "*gostar* nunca va solo: ¿qué le falta?",
        explain: "*Gostar* lleva siempre *de* (con artículo, *do, da, dos, das*): eu gosto " + it(w + " " + next) + ", ela gosta de dançar." };
      if (/^(que|quem|qual|quais|onde)$/.test(next)) {
        var after = ctx.e.slice(ctx.ei + 2, ctx.ei + 6), baseR = prepInfo(w).base;
        var vr = after.map(verbLemmas).filter(function (l) { return l.length; })[0] || [];
        if (vr.some(function (l) { return (REGENCIA[l] && REGENCIA[l][0] === baseR) || (l === "falar" && /^(com|de)$/.test(baseR)); })) return { cat: "regencia", slip: false,
          hint: "El verbo de la relativa lleva preposición: ¿dónde va?",
          explain: "La preposición que pide el verbo va delante del relativo: " + it(w + " " + next) + " (a pessoa com quem falei, o bairro em que moro, o livro de que gosto)." };
      }
      for (var i = 0; i < lemPrev.length; i++) {
        var R = REGENCIA[lemPrev[i]], base = prepInfo(w).base;
        if (R && R[0] === base) return { cat: "regencia", slip: false,
          hint: "Ese verbo pide una preposición que en español no va.",
          explain: "*" + lemPrev[i] + " " + R[0] + "*: " + R[1] + ". Falta " + it(w) + "." };
      }
      if (CONTR[w] && ARTICLES[CONTR[w][1]]) return { cat: "contraccion", slip: false,
        hint: "Falta una preposición con su artículo.",
        explain: "Falta " + it(w) + " (= *" + CONTR[w][0] + " + " + CONTR[w][1] + "*)" + (prev ? " después de " + it(prev) : "") + "." };
      return { cat: "preposicion", slip: false,
        hint: "Falta una preposición.",
        explain: "Falta " + it(w) + (prev ? " después de " + it(prev) : "") + "." };
    }
    if (ARTICLES[w]) {
      if (PLACE_ART[next]) return { cat: "articulo", slip: false,
        hint: "Falta el artículo: ¿ese país o ese lugar lo lleva?",
        explain: "Falta " + it(w) + ": " + it(w + " " + next.charAt(0).toUpperCase() + next.slice(1)) + " lleva artículo, como o Brasil, a Argentina, o Rio. Las ciudades en general no: São Paulo é enorme, moro em Salvador." };
      return { cat: "articulo", slip: false,
        hint: "Falta el artículo.",
        explain: "Falta " + it(w) + (next ? " antes de " + it(next) : "") + "." };
    }
    if (w === "a" && next === "gente") {
      var infNext = isInfinitive(ctx.e[ctx.ei + 2] || "");
      return { cat: infNext ? "inf_pessoal" : "faltante", slip: false,
        hint: "Falta el sujeto.",
        explain: "Falta el sujeto *a gente*" + (infNext ? ": el infinitivo tiene acá su propio sujeto y en portugués se dice (é importante a gente saber), o va en la terminación (é importante sabermos)." : ".") };
    }
    if (w === "que" && TER.indexOf(prev) >= 0) return { cat: "faltante", slip: false,
      hint: "Obligación: ¿cómo se une *ter* con el infinitivo?",
      explain: "Obligación: *ter que* (o *ter de*) + infinitivo: " + it(prev + " que " + next) + "." };
    if (w === "se" || CLITIC_ONLY[w]) return { cat: "pronome", slip: false,
      hint: "Falta un pronombre.",
      explain: "Falta el pronombre " + it(w) + (isVerbish(next) ? ", junto al verbo " + it(next) : isVerbish(prev) ? ", junto al verbo " + it(prev) : "") + "." };
    if (TER.indexOf(w) >= 0 && participleOf(next)) return { cat: "perfeito_composto", slip: false,
      hint: "Falta el auxiliar.",
      explain: "Los tiempos compuestos llevan *ter* + participio: " + it(w + " " + next) + "." };
    if (w === "não") return { cat: "faltante", slip: false, hint: "Falta la negación.",
      explain: "Falta *não* delante del verbo." };
    if (w === "de" && /^(gosto|gosta|gostam|gostamos|gostei|gostou)$/.test(prev)) return { cat: "gostar", slip: false,
      hint: "*gostar* nunca va solo.", explain: "*Gostar de*: eu gosto de " + next + "." };
    return { cat: "faltante", slip: false,
      hint: "Te falta una palabra" + (prev ? " después de " + it(prev) : "") + ".",
      explain: "Falta " + it(w) + (prev ? " después de " + it(prev) : "") + "." };
  }

  function extraRule(w, gtoks, gi, ctx) {
    var next = gtoks[gi + 1] || "", prev = gtoks[gi - 1] || "", next2 = gtoks[gi + 2] || "";
    var lemPrev = verbLemmas(prev);
    if (w === "a" && lemPrev.indexOf("ir") >= 0 && isInfinitive(next)) return { cat: "espanol", slip: false,
      hint: "Sobra una palabra que en español sí va.",
      explain: "*Ir* + infinitivo va sin *a* en portugués: " + it(prev + " " + next) + " (vou comer, vamos sair)." };
    if (/^(a|ao|aos)$/.test(w) && next && !isVerbish(next)) {
      var isDo = lemPrev.some(function (l) { return DO_VERB.test(l); });
      var person = FAMILY.indexOf(next) >= 0 || POSSESSIVE.indexOf(next) >= 0 || /^(ele|ela|eles|elas|você|vocês|todos|ninguém|alguém|o|os|a|as)$/.test(next) ||
        (ctx.names || []).indexOf(next) >= 0 || FAMILY.indexOf(next2) >= 0;
      if (isDo && person) return { cat: "a_personal", slip: false,
        hint: "Sobra una palabra que en español sí se pone.",
        explain: "En portugués la persona que recibe la acción (el objeto directo) no lleva «a»: vi o João, conheço a Maria (acá *a* es el artículo), visitei meus avós, espero você." };
    }
    if (w === "com" && lemPrev.indexOf("namorar") >= 0) return { cat: "regencia", slip: false,
      hint: "Ese verbo no lleva preposición en portugués.",
      explain: "*Namorar* va sin preposición: ela namora o Pedro (en el habla también se oye *namorar com*)." };
    if (PREP_BASE[w] && lemPrev.some(function (l) { return REGENCIA[l] && REGENCIA[l][0] === ""; })) {
      var lz = lemPrev.filter(function (l) { return REGENCIA[l] && REGENCIA[l][0] === ""; })[0];
      return { cat: "regencia", slip: false, hint: "Ese verbo va sin preposición.",
        explain: "*" + lz + "* va sin preposición: " + REGENCIA[lz][1] + "." };
    }
    if (w === "de" && next === "que" && lemPrev.some(function (l) { return /^(achar|pensar|acreditar|dizer|saber|esperar)$/.test(l); })) return { cat: "regencia", slip: false,
      hint: "Sobra una preposición antes de *que*.",
      explain: "Sin *de*: " + it(prev + " que") + " (acho que, penso que): «pienso de que» también está mal en español." };
    if (/^(me|te|lhe|nos|lhes)$/.test(w) && /^gost/.test(next)) return { cat: "gostar", slip: false,
      hint: "Con *gostar* no va un pronombre delante como con «gustar».",
      explain: "*Me gosta* es un calco del español: en portugués la persona es el sujeto: *eu gosto de…*, *ela gosta de…*." };
    if (/^(lo|la|los|las|le|les)$/.test(w)) return { cat: "pronome", slip: false,
      hint: it(w) + " es un pronombre del español.",
      explain: it(w) + " es español y acá sobra." };
    if (/^(se|me|te)$/.test(w) && /^(acord|morr|ri|sai|volt|ficou|fico|fica)/.test(next)) return { cat: "pronome", slip: false,
      hint: "Ese verbo no es pronominal en portugués.",
      explain: "Sobra " + it(w) + ": *acordar* (despertarse), *morrer* (morirse), *rir* (reírse), *sair* (irse), *ficar* (quedarse) van sin pronombre." };
    if (ARTICLES[w] && next && PLACE_NOART.test(next)) return { cat: "articulo", slip: false,
      hint: "Sobra el artículo: ¿es una ciudad?",
      explain: "Las ciudades van sin artículo: São Paulo é enorme, moro em Salvador (salvo o Rio, o Recife, o Porto). Portugal tampoco lo lleva." };
    if (ARTICLES[w]) return { cat: "articulo", slip: false,
      hint: "Sobra el artículo.",
      explain: "Acá no va artículo: sobra " + it(w) + "." };
    var sp = spanishWord(w);
    if (sp) return /^(muy|mucho)$/.test(deaccent(w)) ? { cat: "muito", slip: false, hint: it(w) + " es español.", explain: it(w) + " es español: «muy» y «mucho» son *muito*." }
      : { cat: "espanol", slip: false, hint: it(w) + " es español.", explain: it(w) + " es español y acá sobra." };
    if (!isPortuguese(w) && looksSpanish(w)) return { cat: "espanol", slip: false,
      hint: it(w) + " parece español.",
      explain: it(w) + " no es portugués y acá sobra." };
    // palabras que ya dicen lo que se les agrega
    if (w === "mais" && /^(melhor|melhores|pior|piores|maior|maiores|menor|menores)$/.test(next)) return { cat: "sobrante", slip: false,
      hint: "Una de las dos palabras ya es comparativo.",
      explain: it(next) + " ya es comparativo: sin *mais*, como en español no se dice «más mejor»." };
    if (/^(muito|muita|mais)$/.test(w) && /^(ótimo|ótima|ótimos|ótimas|péssimo|péssima|máximo|mínimo|enorme|excelente)$/.test(next)) return { cat: "sobrante", slip: false,
      hint: "Esa palabra ya es el grado más alto.",
      explain: it(next) + " ya es el grado más alto: sin *" + w + "*, como en español no se dice «muy excelente»." };
    if (w === "não" && /^(nunca|ninguém|nada|nenhum|nenhuma|jamais|nem)$/.test(next)) return { cat: "sobrante", slip: false,
      hint: "Esa negación ya está dicha.",
      explain: "Con *" + next + "* delante del verbo no va *não*: " + it(next + (next2 ? " " + next2 : "")) + ", como en español «nunca voy» (no «no nunca voy»). Detrás del verbo sí: *não vou nunca*." };
    if (/^(seu|sua|seus|suas)$/.test(w) && /^(dele|dela|deles|delas)$/.test(next)) return { cat: "pronome", slip: false,
      hint: "Hay dos palabras que dicen de quién es.",
      explain: it(next) + " ya dice de quién es: sin *" + w + "* (o carro dele). En Brasil *seu* se entiende «de você»." };
    if (/^(que)$/.test(w) && next === "se" && lemPrev.some(function (l) { return /^(perguntar|saber)$/.test(l); })) return { cat: "sobrante", slip: false,
      hint: "Sobra una palabra en la pregunta indirecta.",
      explain: "Pregunta indirecta: " + it(prev + " se") + ", sin *que*, como en español «me preguntó si…»." };
    if (isInfinitive(w) && verbForms(prev).some(function (v) { return v.lemma.replace(/-se$/, "") === w && v.tense === "futuro"; })) return { cat: "sobrante", slip: false,
      hint: "El verbo está dos veces.",
      explain: it(prev) + " ya es el futuro de *" + w + "* («iré»): sin *" + w + "*. Con *ir* + infinitivo sería *vou ir*, del habla." };
    if (CLITIC_ONLY[w]) return { cat: "pronome", slip: false, hint: "Sobra un pronombre.", explain: "Sobra " + it(w) + "." };
    return { cat: "sobrante", slip: false,
      hint: "Sobra una palabra.",
      explain: "Sobra " + it(w) + "." };
  }

  /* ------------------------------------------------------------ diagnose */

  var SEVERITY = {
    perfeito_composto: 9, subjuntivo: 9, futuro_subj: 9, inf_pessoal: 9,
    gostar: 8, a_personal: 8, contraccion: 8, regencia: 8, preposicion: 8, persona: 8, tempo: 8,
    regularizacion: 8, verbo_irregular: 8, crase: 7, participio: 7, genero: 7, concordancia: 7,
    articulo: 7, plural: 7, pronome: 7, muito: 7, ser_estar: 8, colocacao: 6, espanol: 6, falso_amigo: 6, orden: 6,
    lexico: 5, nasal: 5, faltante: 5, sobrante: 4, ortografia: 4, registro: 3, tilde: 2, tipeo: 1
  };

  var LABEL = {
    grammatica: "Gramática",
    ia: "Corrección de la IA",
    vuoto: "Respuesta vacía",
    contraccion: "Contracciones (no, do, pelo…)", articulo: "Artículos", genero: "Género de los sustantivos",
    plural: "Plurales", concordancia: "Concordancia", preposicion: "Preposiciones", regencia: "Verbo + preposición",
    muito: "muito (muy / mucho)", gostar: "gostar de", a_personal: "«a» personal",
    perfeito_composto: "Perfeito composto", subjuntivo: "Subjuntivo", futuro_subj: "Futuro do subjuntivo",
    inf_pessoal: "Infinitivo pessoal", pronome: "Pronombres", colocacao: "Lugar del pronombre",
    crase: "Crase (à)", ortografia: "Ortografía", tilde: "Tildes", espanol: "Palabras del español",
    falso_amigo: "Falsos amigos", tempo: "Tiempo verbal", persona: "Persona del verbo", participio: "Participios",
    verbo_irregular: "Verbos irregulares", regularizacion: "Irregulares regularizados", nasal: "Nasales (ã, õ, -m)",
    faltante: "Palabras que faltan", sobrante: "Palabras de más", tipeo: "Tipeo", orden: "Orden de las palabras",
    lexico: "Vocabulario", ser_estar: "ser, estar y ficar", registro: "Registro (habla y escrito formal)"
  };

  // Capitalized words: names.  At the start of a sentence only when the word
  // is not a Portuguese word anyway (João chegou; not Ela, Hoje, Minha).
  function names(s) {
    var out = [], re = /(^|[^a-zà-ÿA-ZÀ-Ý'-])([A-ZÀ-Ý][a-zà-ÿ]+)/g, m, str = String(s);
    while ((m = re.exec(str))) {
      var w = m[2].toLowerCase(), before = str.slice(0, m.index + m[1].length).replace(/[\s«»"“”(—–-]+$/, "");
      var initial = !before || /[.!?:]$/.test(before);
      if (initial && isPortuguese(w)) continue;
      out.push(w);
    }
    return out;
  }

  // Verbs interchangeable in everyday Brazilian Portuguese.
  var SYN = [["começar", "iniciar"], ["terminar", "acabar"], ["voltar", "regressar", "retornar"], ["morar", "viver"],
             ["achar", "pensar", "acreditar"], ["ter", "haver"], ["escutar", "ouvir"], ["mandar", "enviar"], ["falar", "conversar"],
             ["ficar", "permanecer"], ["querer", "desejar"], ["ajudar", "auxiliar"]];
  function synFamily(lemma) {
    lemma = String(lemma).replace(/-se$/, "");
    for (var i = 0; i < SYN.length; i++) if (SYN[i].indexOf(lemma) >= 0) return i;
    return -1;
  }
  var NSYN = [["carro", "automóvel"], ["carros", "automóveis"], ["celular", "telefone"], ["mas", "porém"], ["também", "tb"],
              ["cachorro", "cão"], ["cachorros", "cães"], ["geladeira", "refrigerador"], ["menino", "garoto"], ["menina", "garota"],
              ["meninos", "garotos"], ["meninas", "garotas"], ["criança", "menino"], ["professor", "docente"], ["ônibus", "busão"],
              ["agora", "já"], ["aqui", "cá"], ["lá", "ali"], ["muito", "bastante"], ["porque", "pois"], ["então", "aí"],
              ["mãe", "mamãe"], ["pai", "papai"], ["em", "no"], ["num", "em"], ["numa", "em"],
              ["legal", "bacana", "massa"], ["legais", "bacanas"], ["moço", "rapaz"], ["moça", "garota"], ["televisão", "tevê", "tv"]];
  function nounSyn(a, b) {
    return NSYN.some(function (f) { return f.indexOf(a) >= 0 && f.indexOf(b) >= 0; }) && !(/^(em|no|num|numa)$/.test(a));
  }
  function synonymFree(g, e, midMas) {
    if (g.length !== e.length) return false;
    var diff = 0;
    for (var i = 0; i < e.length; i++) {
      if (g[i] === e[i]) continue;
      if (nounSyn(g[i], e[i]) && !(midMas && g[i] === "mas")) {
        var gA = nounGender(g[i]), gB = nounGender(e[i]);
        if (gA && gB && gA !== gB) return false;
        diff++; continue;
      }
      // ter / haver as auxiliary: tinha feito = havia feito
      if (TER.indexOf(g[i]) >= 0 && HAVER.indexOf(e[i]) >= 0 && participleOf(e[i + 1] || "") ||
          HAVER.indexOf(g[i]) >= 0 && TER.indexOf(e[i]) >= 0 && participleOf(e[i + 1] || "")) {
        var gf = verbForms(g[i]), ef = verbForms(e[i]);
        if (gf.some(function (a) { return a.tense !== "presente" && ef.some(function (b) { return a.tense === b.tense && a.p === b.p; }); })) { diff++; continue; }
      }
      var fg = verbForms(g[i]), fe = verbForms(e[i]);
      var ok = fe.some(function (a) {
        var fam = synFamily(a.lemma);
        return fam >= 0 && fg.some(function (b) {
          // ter / haver: interchangeable as auxiliaries only; «tem» for «há» is the register (REGISTRO)
          if (/^(ter|haver)$/.test(a.lemma)) return false;
          return b.lemma !== a.lemma && synFamily(b.lemma) === fam && b.tense === a.tense && b.p === a.p;
        });
      });
      if (!ok) {
        var pg = participleOf(g[i]), pe = participleOf(e[i]);
        if (pg && pe && pg !== pe && synFamily(pg) >= 0 && synFamily(pg) === synFamily(pe) && g[i].slice(-1) === e[i].slice(-1)) ok = true;
        if (isInfinitive(g[i]) && isInfinitive(e[i]) && synFamily(g[i]) >= 0 && synFamily(g[i]) === synFamily(e[i])) ok = true;
      }
      if (!ok) return false;
      diff++;
    }
    return diff > 0;
  }

  /* El adverbio de tiempo al principio o al final (Hoje eu acordei cedo =
     Eu acordei cedo hoje): el portugués, como el español, lo deja mover. */
  var ADV_T1 = /^(hoje|ontem|amanhã|agora|anteontem|depois|cedo|antes|logo|sempre|finalmente|ultimamente|atualmente)$/;
  var ADV_T2 = /^(de manhã|à noite|à tarde|de noite|de tarde|todo dia|todos os dias|no sábado|no domingo|amanhã cedo|ontem à noite|hoje à noite|esta semana|este ano|no verão|no inverno|às vezes|de novo|toda semana|no fim de semana|nesse dia|naquele dia|em seguida|por favor)$/;
  // Where a time adverb can stand: at the start, at the end, or between two
  // parts of the clause (Eu acordei hoje cedo), never inside a noun phrase
  // or after a preposition (à hoje praia).
  function advChunks(t) {
    var out = [];
    for (var k = 0; k < t.length; k++) {
      [2, 1].forEach(function (n) {
        if (k + n > t.length || t.length <= n) return;
        var ch = t.slice(k, k + n).join(" ");
        if (!(n === 2 ? ADV_T2.test(ch) : ADV_T1.test(ch))) return;
        var p = t[k - 1] || "";
        if (p && (ARTICLES[p] || PREP_BASE[p] || CONTR[p] || POSSESSIVE.indexOf(p) >= 0 || p === "pra" || CLITIC_ONLY[p])) return;
        out.push([k, n]);
      });
    }
    return out;
  }
  function advFree(g, e, nm) {
    if (g.length !== e.length || g.join(" ") === e.join(" ")) return false;
    var cg = advChunks(g), ce = advChunks(e);
    for (var i = 0; i < cg.length; i++) for (var j = 0; j < ce.length; j++) {
      var a = g.slice(cg[i][0], cg[i][0] + cg[i][1]).join(" "), b = e.slice(ce[j][0], ce[j][0] + ce[j][1]).join(" ");
      if (a !== b || cg[i][0] === ce[j][0]) continue;
      var rg = g.slice(0, cg[i][0]).concat(g.slice(cg[i][0] + cg[i][1])), re = e.slice(0, ce[j][0]).concat(e.slice(ce[j][0] + ce[j][1]));
      if (rg.join(" ") === re.join(" ") || canon(rg, nm) === canon(re, nm)) return true;
    }
    return false;
  }

  /* «Estou cansada» por «Estou cansado»: sin nadie nombrado, el género es
     el del que habla (o el del que escucha), y los dos valen. */
  var GENDER_FIXERS = ["ele", "ela", "eles", "elas", "o", "a", "os", "as", "um", "uma", "lo", "la", "seu", "sua"];
  function genderFree(g, e, target) {
    if (g.length !== e.length) return false;
    var named = names(String(target));
    var isNoun = function (w) { return !!(w && (DATA.nouns[w] || DATA.nounsByPlural[w] || HETERO[w] || named.indexOf(w) >= 0)); };
    var diff = 0;
    for (var i = 0; i < e.length; i++) {
      if (g[i] === e[i]) continue;
      var a = g[i], b = e[i];
      var ok = (a.length >= 3 && a.slice(0, -1) === b.slice(0, -1) && /^(oa|ao)$/.test(a.slice(-1) + b.slice(-1))) ||
               (a.length >= 4 && a.slice(0, -2) === b.slice(0, -2) && /^(osas|asos)$/.test(a.slice(-2) + b.slice(-2))) ||
               (/^(obrigado|obrigada)$/.test(a) && /^(obrigado|obrigada)$/.test(b));
      if (!ok) return false;
      var listed = /^(obrigad[oa]|sozinh[oa]s?|cansad[oa]s?|pront[oa]s?|content[ea]s?|brasileir[oa]s?|argentin[oa]s?|carioca|preocupad[oa]s?|ocupad[oa]s?|atrasad[oa]s?|nervos[oa]s?|feliz|animad[oa]s?|apaixonad[oa]s?|casad[oa]s?|solteir[oa]s?|sentad[oa]s?|nascid[oa]s?|chegad[oa]s?|acostumad[oa]s?|perdid[oa]s?|convidad[oa]s?|lindo|linda|bonit[oa]s?|velh[oa]s?|nov[oa]s?|alt[oa]s?|baix[oa]s?|magr[oa]s?|gord[oa]s?|curios[oa]s?|tímid[oa]s?|simpátic[oa]s?|antipátic[oa]s?|chatead[oa]s?|irritad[oa]s?|assustad[oa]s?|surpres[oa]s?|decepcionad[oa]s?|orgulhos[oa]s?|emocionad[oa]s?|filh[oa]s?|únic[oa]s?|mesm[oa]s?|própri[oa]s?)$/.test(b);
      if (!DATA.adj[b] && !participleOf(b) && !listed) return false;
      // a participle alone (pôr → posto) names the form; before its noun
      // phrase it agrees with it (Assinada a Lei Áurea)
      if (e.length === 1 && participleOf(b) && !listed) return false;
      if (ARTICLES[e[i + 1]] || POSSESSIVE.indexOf(e[i + 1]) >= 0) return false;
      if (isNoun(e[i + 1]) || ARTICLES[e[i - 1]] || (CONTR[e[i - 1]] && ARTICLES[CONTR[e[i - 1]][1]])) return false;
      if (participleOf(b) && (TER.indexOf(e[i - 1]) >= 0 || HAVER.indexOf(e[i - 1]) >= 0)) return false;
      if (/^(obrigad)/.test(b)) { diff++; continue; }
      for (var k = 0; k < i; k++) if (isNoun(e[k]) || GENDER_FIXERS.indexOf(e[k]) >= 0) return false;
      diff++;
    }
    return diff > 0;
  }

  /* ---------------------------------------------- variantes equivalentes
     Lo que el portugués de Brasil deja elegir y no es error: el sujeto
     dicho o callado (eu falo / falo), el artículo ante posesivo y ante
     nombre de persona (a minha casa / minha casa, o João / João), próclise
     o ênclise fuera de los atractores (me chamo / chamo-me), *em um / num*,
     *a gente vai / nós vamos*.  Se comparan las dos formas canónicas. */
  var ATTRACTORS = /^(não|nunca|jamais|nem|ninguém|nada|nenhum|nenhuma|tampouco|que|quem|qual|quais|onde|quando|como|porque|pois|se|embora|caso|conforme|enquanto|já|ainda|também|sempre|só|somente|apenas|talvez|bem|mal|aqui|lá|ali|tudo|todos|alguém|algo|ambos|quanto|quanta|quantos|quantas|oxalá|tomara)$/;
  var CL_SET = dict({ me: 1, te: 1, se: 1, nos: 1, vos: 1, lhe: 1, lhes: 1, o: 1, a: 1, os: 1, as: 1, lo: 1, la: 1, los: 1, las: 1, no: 1, na: 1, nas: 1 });
  function normClitic(c) { return { lo: "o", la: "a", los: "os", las: "as", no: "o", na: "a", nas: "as" }[c] || c; }

  // «levanto-me» → {v: levanto, c: me}; «comprá-lo» → {v: comprar, c: o};
  // «dir-lhe-ei» → {v: direi, c: lhe}.  null if it is not verb + clitic.
  function splitEnclitic(tok) {
    if (tok.indexOf("-") < 0) return null;
    var parts = tok.split("-");
    if (parts.length === 2 && CL_SET[parts[1]]) {
      var v = parts[0], c = parts[1];
      if (c === "nos" && /mo$/.test(v)) v += "s";
      if (/^(lo|la|los|las)$/.test(c)) {
        var cands = [v.replace(/á$/, "ar").replace(/ê$/, "er").replace(/í$/, "ir").replace(/ô$/, "or"), v + "r", v + "s", v + "z"];
        if (v === "pô") cands.unshift("pôr");
        for (var i = 0; i < cands.length; i++) if (isVerbish(cands[i]) || finite(cands[i])) { v = cands[i]; break; }
      }
      if (!isVerbish(v) && !/(ar|er|ir|am|em|ou|ei|mos|u|i|e|a)$/.test(v)) return null;
      return { v: v, c: normClitic(c) };
    }
    if (parts.length === 3 && CL_SET[parts[1]] && /^(ei|ás|á|emos|eis|ão|ia|ias|íamos|íeis|iam)$/.test(parts[2])) {
      var st = parts[0].replace(/á$/, "ar").replace(/ê$/, "er").replace(/í$/, "ir").replace(/ô$/, "or");
      return { v: st + parts[2], c: normClitic(parts[1]) };
    }
    return null;
  }

  // A first name and its article: Maria, Bia, Ana take «a»; Pedro, Lucas, João take «o».
  var FEM_NAMES = /^(bia|beatriz|carmen|raquel|isabel|inês|beth|luz|ester|ruth|rute|íris|iris|lis|nair|lurdes|mercedes|dolores|clarice|cecília|sofía|sofia)$/;
  function nameAgrees(art, nm) {
    if (!/^(o|a)$/.test(art)) return true;
    var fem = /a$/.test(nm) || FEM_NAMES.test(nm);
    if (/^(luca|nicola|andrea)$/.test(nm)) return true;
    return (art === "a") === fem;
  }
  function possAgrees(art, p) {
    var gn = /^(meu|teu|seu|nosso|vosso)$/.test(p) ? "o" : /^(minha|tua|sua|nossa|vossa)$/.test(p) ? "a" :
             /^(meus|teus|seus|nossos|vossos)$/.test(p) ? "os" : "as";
    return art === gn;
  }

  function canon(toks, nm) {
    var out = [], i, t;
    // 1. contractions that are free variants, enclitics split off
    for (i = 0; i < toks.length; i++) {
      t = toks[i];
      var sp = splitEnclitic(t);
      if (sp) { out.push({ w: sp.v + (/-l(o|a|os|as)$/.test(t) ? "#" + t.split("-")[0] : ""), cl: [sp.c], encl: true }); continue; }
      if (/^(num|numa|nuns|numas)$/.test(t)) { out.push({ w: "em" }); out.push({ w: t.slice(1) }); continue; }
      if (/^(dum|duma|duns|dumas)$/.test(t)) { out.push({ w: "de" }); out.push({ w: t.slice(1) }); continue; }
      out.push({ w: t });
    }
    // 2. «a gente» + 3sg → «nós» + 1pl
    for (i = 0; i < out.length - 1; i++) {
      if (out[i].w === "a" && out[i + 1].w === "gente") {
        for (var k = i + 2; k < out.length && k <= i + 5; k++) {
          var fv = verbForms(out[k].w).filter(function (v) { return v.p === 2; })[0];
          if (fv) {
            try { var f3 = bareForm(C().conjugate(fv.lemma, fv.tense)[3]); if (f3) { out[k].w = f3; out.splice(i, 2, { w: "nós" }); } } catch (e) { /* */ }
            break;
          }
          if (!/^(não|já|também|sempre|nunca|me|te|se|nos|lhe|o|a|os|as|só)$/.test(out[k].w)) break;
        }
      }
    }
    // 3. article before possessive and before a person's name: optional
    var poss = function (w) { return POSSESSIVE.indexOf(w) >= 0; };
    var person = function (w) { return !!nm && nm.indexOf(w) >= 0 && !PLACE_ART[w] && !PLACE_NOART.test(w) && FAMILY.indexOf(w) < 0 && !DATA.nouns[w] && !DATA.nounsByPlural[w]; };
    var res = [];
    for (i = 0; i < out.length; i++) {
      t = out[i].w;
      var nx = out[i + 1] ? out[i + 1].w : "";
      var pvw = res.length ? res[res.length - 1].w : "";
      if (/^(o|a|os|as)$/.test(t) && !/^(de|em|por|a)$/.test(pvw) && ((poss(nx) && possAgrees(t, nx)) || (person(nx) && !PLACE_ART[nx] && !PLACE_NOART.test(nx) && nameAgrees(t, nx))) && !(out[i].cl)) {
        if (!isVerbish(nx)) continue;
      }
      if (CONTR[t] && ARTICLES[CONTR[t][1]] && /^(o|a|os|as)$/.test(CONTR[t][1]) && ((poss(nx) && possAgrees(CONTR[t][1], nx)) || (person(nx) && !PLACE_NOART.test(nx) && nameAgrees(CONTR[t][1], nx)))) { res.push({ w: CONTR[t][0] }); continue; }
      res.push(out[i]);
    }
    out = res;
    // 4. subject pronouns before their verb: optional
    res = [];
    for (i = 0; i < out.length; i++) {
      t = out[i].w;
      if (SUBJ_P[t] && !/^(ele|ela|eles|elas|você|vocês)$/.test(t)) {
        var k2 = i + 1;
        while (out[k2] && /^(não|já|também|sempre|nunca|me|te|se|nos|lhe|lhes|o|a|os|as|só|ainda)$/.test(out[k2].w)) k2++;
        var vv = out[k2] ? verbForms(out[k2].w) : [];
        if (vv.some(function (v) { return SUBJ_P[t].indexOf(v.p) >= 0 && v.tense !== "infPessoal"; })) continue;
      }
      res.push(out[i]);
    }
    out = res;
    // 5. clitics: attached to their verb group, wherever they stand
    res = [];
    var pending = [];
    for (i = 0; i < out.length; i++) {
      t = out[i].w;
      var nextW = out[i + 1] ? out[i + 1].w : "";
      var isCl = CLITIC_ONLY[t] || (/^(o|a|os|as)$/.test(t) && finite(nextW) && !out[i].cl && !(ARTICLES[t] && (DATA.nouns[nextW] || DATA.nounsByPlural[nextW])));
      if (isCl && (isVerbish(nextW) || (out[i + 1] && CLITIC_ONLY[nextW]))) { pending.push(normClitic(t)); continue; }
      if (isCl && res.length && res[res.length - 1].verb) { res[res.length - 1].cl = (res[res.length - 1].cl || []).concat([normClitic(t)]); continue; }
      var o = { w: t, verb: isVerbish(t), cl: (out[i].cl || []).slice() };
      if (pending.length && o.verb) { o.cl = pending.concat(o.cl); pending = []; }
      else if (pending.length) { pending.forEach(function (c) { res.push({ w: c }); }); pending = []; }
      // merge into the previous verb of the same group (vou te ligar = vou ligar-te)
      if (o.verb && res.length && res[res.length - 1].verb) {
        var pr = res[res.length - 1];
        pr.w += " " + o.w;
        pr.cl = (pr.cl || []).concat(o.cl);
        continue;
      }
      res.push(o);
    }
    pending.forEach(function (c) { res.push({ w: c }); });
    return res.map(function (x) { return x.w + (x.cl && x.cl.length ? "{" + x.cl.slice().sort().join(",") + "}" : ""); }).join(" ");
  }

  // The tokens without the subject pronouns that only repeat the verb's person.
  function stripSubj(toks) {
    return toks.filter(function (t, i) {
      if (!/^(eu|tu|nós|vós)$/.test(t)) return true;
      var k = i + 1;
      while (toks[k] && /^(não|já|também|sempre|nunca|me|te|se|nos|lhe|lhes|o|a|os|as|só|ainda)$/.test(toks[k])) k++;
      return !verbForms(toks[k] || "").some(function (v) { return SUBJ_P[t].indexOf(v.p) >= 0 && v.tense !== "infPessoal"; });
    });
  }

  // Enclitic forms that do not exist: comprar-o (comprá-lo), fiz-o (fi-lo),
  // dão-o (dão-no), and enclisis on a participle or a future.
  function badEnclForm(g) {
    for (var i = 0; i < g.length; i++) {
      var m = /^([a-zà-ÿ]+)-(o|a|os|as)$/.exec(g[i]) || (/^([a-zà-ÿ]+[rsz])-l(o|a|os|as)$/.exec(g[i]));
      if (m && /[rsz]$/.test(m[1])) {
        var v = m[1], fix = v.replace(/ar$/, "á").replace(/er$/, "ê").replace(/ir$/, "i").replace(/or$/, "ô").replace(/(s|z)$/, "");
        if (/^(fiz|fez|diz|faz|traz|quis)$/.test(v)) fix = v.slice(0, -1).replace(/e$/, "ê").replace(/a$/, "á");
        return { i: i, cat: "pronome", fix: fix + "-l" + m[2], why: "Después de *-r, -s, -z* el pronombre es *-lo, -la, -los, -las* y la consonante cae: " + it(fix + "-l" + m[2]) + " (comprá-lo, fazê-lo, fi-lo)." };
      }
      if (m && /(am|em|ão|õe)$/.test(m[1])) return { i: i, cat: "pronome", fix: m[1] + "-n" + m[2], why: "Después de una nasal el pronombre es *-no, -na, -nos, -nas*: " + it(m[1] + "-n" + m[2]) + " (dão-no, põe-na)." };
      var sp = splitEnclitic(g[i]);
      if (sp && participleOf(sp.v) && !verbForms(sp.v).length) return { i: i, cat: "colocacao", why: "Nunca va el pronombre pegado al participio: " + it(sp.c + " " + (g[i - 1] || "tinha") + " " + sp.v).replace(/\*(\S+) (\S+) /, "*$2 $1 ") + " (eu já o tinha avisado)." };
      if (sp && verbForms(sp.v).some(function (v) { return v.tense === "futuro" || v.tense === "condicional"; }) && g[i].split("-").length === 2 && !verbForms(sp.v).some(function (v) { return v.tense !== "futuro" && v.tense !== "condicional"; })) {
        var st = sp.v.replace(/(ei|ás|á|emos|eis|ão|ia|ias|íamos|íeis|iam)$/, ""), end = sp.v.slice(st.length);
        return { i: i, cat: "colocacao", why: "Con futuro y condicional no va ênclise: en lo formal, mesóclise (" + it(st + "-" + sp.c + "-" + end) + "); en lo corriente, el pronombre delante (" + it(sp.c + " " + sp.v) + ")." };
      }
    }
    return null;
  }

  // Enclisis after a word that attracts the pronoun (não disse-me → não me disse).
  function badEnclisis(g, pz) {
    for (var i = 1; i < g.length; i++) {
      var sp = splitEnclitic(g[i]);
      if (!sp || /^(o|a|os|as)$/.test(sp.c) && /^(lo|la|los|las)$/.test(g[i].split("-")[1]) && isInfinitive(sp.v)) continue;
      var p = g[i - 1];
      // «ela se chama-se»: the same pronoun twice
      if (p === sp.c && CLITIC_ONLY[p]) return { i: i, prev: p, c: sp.c, v: sp.v, dup: true };
      if (isInfinitive(sp.v) || gerundOf(sp.v)) continue;
      if (pz && pz.length === g.length && pz[i]) continue;
      if (ATTRACTORS.test(p)) return { i: i, prev: p, c: sp.c, v: sp.v };
    }
    return null;
  }
  function attractExplain(be) {
    return { cat: "colocacao", slip: false,
      hint: "Las palabras están bien; mirá dónde va el pronombre después de *" + be.prev + "*.",
      explain: "*" + be.prev + "* atrae el pronombre delante del verbo: " + it(be.prev + " " + be.c + " " + be.v) +
        ". Lo mismo pasa después de *não, nunca, que, quem, já, também* y los adverbios: ahí el pronombre nunca va pegado atrás." };
  }
  function dupClitic(be) {
    return { cat: "pronome", slip: false,
      hint: "Hay un pronombre repetido.",
      explain: "El pronombre va una sola vez: " + it(be.c + " " + be.v) + " o " + it(be.v + "-" + be.c) + ", nunca en los dos lugares. En Brasil lo normal es antes del verbo." };
  }

  /* Contracciones sin hacer: «em o» → no, «de ele» → dele, «a a» → à. */
  function uncontracted(gtoks, etoks) {
    for (var i = 0; i < gtoks.length - 1; i++) {
      var p = gtoks[i] === "en" ? "em" : gtoks[i];
      var w2 = gtoks[i + 1] === "el" ? "o" : gtoks[i + 1] === "la" ? "a" : gtoks[i + 1] === "los" ? "os" : gtoks[i + 1] === "las" ? "as" : gtoks[i + 1];
      if (!PREP_BASE[p]) continue;
      var c = contract(p, w2);
      if (!c || etoks.indexOf(c) < 0) continue;
      if (etoks.some(function (x, k) { return x === gtoks[i] && etoks[k + 1] === gtoks[i + 1]; })) continue;
      // antes de ele chegar: the pronoun is the subject of an infinitive
      if (/^(ele|ela|eles|elas|este|esse|aquele)$/.test(w2) && isInfinitive(gtoks[i + 2] || "")) continue;
      if (/^(o|a|os|as)$/.test(w2) && /^(de|em)$/.test(p) && [gtoks[i + 2], gtoks[i + 3], gtoks[i + 4]].some(function (x) {
        return x && (isInfinitive(x) || verbForms(x).some(function (v) { return v.tense === "infPessoal" && /(rem|rmos|res)$/.test(x); })); })) continue;
      var art = ARTICLES[w2];
      var d = c.charAt(0) === "à" ? { cat: "crase", slip: false,
          hint: "Dos palabras marcadas se tienen que fundir en una.",
          explain: "*a* (preposición) + *" + w2 + "* se funden: " + it(c) + " (con acento grave: es la crase). Vou à praia, àquela hora." +
            (/^(la|las)$/.test(gtoks[i + 1]) ? " Y ojo: *a " + gtoks[i + 1] + "* es español." : "") }
        : { cat: "contraccion", slip: false,
          hint: "Dos palabras marcadas se tienen que fundir en una.",
          explain: "*" + p + " + " + w2 + "* se contrae: " + it(c) + ". En portugués la contracción es obligatoria: " +
            (art ? "no, na, do, da, ao, pelo (estou no Brasil, venho da praia, passo pela Lapa)." : "dele, dela, neste, nisso, daquele (o carro dele, nesta casa).") +
            (gtoks[i] === "en" || /^(el|la|los|las)$/.test(gtoks[i + 1]) ? " Y ojo: *" + gtoks[i] + " " + gtoks[i + 1] + "* es español." : "") };
      return { i: i, form: c, d: d };
    }
    return null;
  }

  function agenteSwap(g, e) {
    for (var i = 0; i < g.length - 2; i++) {
      if (g[i] !== "a" || g[i + 1] !== "gente") continue;
      for (var k = i + 2; k < g.length && k <= i + 4; k++) {
        var v = verbForms(g[k]).filter(function (x) { return x.p === 3 && x.tense !== "infPessoal"; })[0];
        if (v) {
          if (e.indexOf("gente") >= 0) return null;   // «a gente vai»: the verb rule says it
          var n = e.indexOf("nós");
          var ev = e.map(function (w, j) { return j; }).filter(function (j) { return verbForms(e[j]).some(function (x) { return x.lemma === v.lemma; }); })[0];
          if (n < 0 || ev == null) return null;
          return { i: i, k: k, ei: [n, ev], fix: "nós " + e[ev] };
        }
        if (!/^(não|já|também|sempre|nunca|me|te|se|nos|lhe|o|a|os|as|só)$/.test(g[k])) break;
      }
    }
    return null;
  }

  function compoundSwap(g, e) {
    // tenho comido / he comido where the perfeito goes
    for (var i = 0; i < g.length - 1; i++) {
      var aux = g[i], pp = g[i + 1];
      var isTer = /^(tenho|tens|tem|temos|têm)$/.test(aux), isHaber = ES_HABER[aux] != null;
      var lem = participleOf(pp);
      if ((!isTer && !isHaber) || !lem || e.indexOf(pp) >= 0 && e.indexOf(aux) >= 0) continue;
      for (var j = 0; j < e.length; j++) {
        var fe = verbForms(e[j]).filter(function (x) { return x.lemma === lem && (x.tense === "perfeito" || x.tense === "presente"); })[0];
        if (!fe || g.indexOf(e[j]) >= 0) continue;
        return { gi: [i, i + 1], ei: [j], cat: "perfeito_composto",
          hint: isHaber ? "Esa construcción es del español. ¿Cómo se dice ese pasado en portugués?" : "*ter* + participio no es el pretérito perfecto del español. ¿Qué tiempo va?",
          explain: (isHaber ? "*" + aux + " " + pp + "* es un calco del español («he…»). " : "") +
            (fe.tense === "perfeito"
              ? "En portugués «he comido» y «comí» son lo mismo: el perfeito simple, " + it(e[j]) + ". *Tenho " + pp + "* significa «vengo " + gerundEs(lem) + "» (algo que se repite hasta hoy)."
              : "Acá va el presente, " + it(e[j]) + ".") };
      }
    }
    // the perfeito simple where «tenho + participio» (repetition up to now) goes
    for (var a = 0; a < e.length - 1; a++) {
      if (!/^(tenho|tens|tem|temos|têm)$/.test(e[a]) || !participleOf(e[a + 1]) || g.indexOf(e[a + 1]) >= 0) continue;
      var lemE = participleOf(e[a + 1]);
      for (var b = 0; b < g.length; b++) {
        var fg = verbForms(g[b]).filter(function (x) { return x.lemma === lemE; })[0];
        if (fg && e.indexOf(g[b]) < 0) return { gi: [b], ei: [a, a + 1], cat: "perfeito_composto",
          hint: "¿Es algo que pasó una vez, o algo que se viene repitiendo hasta hoy?",
          explain: "Para lo que se repite o sigue hasta ahora («vengo haciendo») va el perfeito composto: " + it(e[a] + " " + e[a + 1]) +
            " (tenho trabalhado muito ultimamente). El perfeito simple, " + it(g[b]) + ", es una acción cerrada." };
      }
    }
    return null;
  }
  function gerundEs(lem) {
    var m = { comer: "comiendo", trabalhar: "trabajando", fazer: "haciendo", estudar: "estudiando", ver: "viendo", dizer: "diciendo", ler: "leyendo",
              ir: "yendo", sair: "saliendo", falar: "hablando", dormir: "durmiendo", escrever: "escribiendo", viajar: "viajando", correr: "corriendo" };
    return m[lem] || "haciéndolo";
  }

  var COMP_IRR = dict({ grande: "maior", grandes: "maiores", bom: "melhor", boa: "melhor", bons: "melhores", boas: "melhores",
    mau: "pior", "má": "pior", maus: "piores", "más": "piores", ruim: "pior", ruins: "piores",
    pequeno: "menor", pequena: "menor", pequenos: "menores", pequenas: "menores" });
  // «mais grande» → maior, «mais bom» → melhor: the comparative made regular.
  function comparativeSwap(g, e) {
    for (var i = 0; i < g.length - 1; i++) {
      if (!/^(mais|más)$/.test(g[i]) || !COMP_IRR[g[i + 1]]) continue;
      var want = COMP_IRR[g[i + 1]], j = e.indexOf(want);
      if (j < 0 || e.indexOf(g[i + 1]) >= 0) continue;
      return { gi: [i, i + 1], ei: [j], cat: "regularizacion",
        hint: "Ese comparativo no se forma con *mais*.",
        explain: /^pequen/.test(g[i + 1]) ? "En Brasil el comparativo de *pequeno* es " + it(want) + " (*mais pequeno* se oye sobre todo en Portugal)."
          : "Comparativos irregulares: *maior* (más grande), *melhor* (mejor), *pior* (peor), *menor* (más chico). Acá: " + it(want) + ". *Mais grande* está mal, igual que «más bueno» en lugar de «mejor»." };
    }
    return null;
  }
  function capN(w, ctx) { return ctx && ctx.names && ctx.names.indexOf(w) >= 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w; }

  /* ------------------------------------------------------------ registro
     Lo que el portugués de Brasil dice en el habla y el curso enseña como
     tal (pra, tô, tá desde la semana 9; vi ele y amo você en la 16; tem por
     há en la 20; tava, cê, né, cadê en la 38).  Una sola tabla para los tres
     correctores: las respuestas cerradas (acá), Scrivi (scrivi.js, lint) y
     el pedido a la IA (scrivi.js, PB_NORM = REGISTRO.prompt).
       · sin registro formal pedido, la forma del habla vale, con una nota:
         verdict "giusto", level "ok_note", note «es del habla; en un texto
         formal: *para*» (no quita xp ni cuenta como error ni desliz);
       · en un ítem o una tarea formal («(formal)», «(culto)», «texto
         formal», ctx.registro === "formal"), «Casi»: verdict "quasi", level
         "close", cat "registro", con la explicación.
     forms: forma del habla → formas escritas que puede abreviar (la primera
     es la de la nota).  lex: palabras del habla con su equivalente neutro. */
  var REGISTRO = {
    forms: dict({
      pra: ["para", "para a"], pro: ["para o"], pros: ["para os"], pras: ["para as"],
      "tô": ["estou"], "tá": ["está"], "tás": ["estás"], tava: ["estava"], tavam: ["estavam"], tamo: ["estamos"], tamos: ["estamos"],
      "cê": ["você"], "cês": ["vocês"], "cadê": ["onde está"], vamo: ["vamos"], bora: ["vamos"],
      grana: ["dinheiro"], valeu: ["obrigado", "obrigada"], "busão": ["ônibus"]
    }),
    // Construcciones del habla: [lo que se dice, lo escrito, cuándo] (para la
    // nota y para el pedido a la IA).
    rows: [
      ["pra, pro, pras", "para, para o, para as", "pra casa, pro Rio, pra praia"],
      ["tô, tá, tava, tamo", "estou, está, estava, estamos", "tô cansado, tá tudo bem"],
      ["cê, cês", "você, vocês", "cê vem?"],
      ["né?, cadê?", "não é?, onde está?", "cadê você?"],
      ["amo você, vi ele", "te amo / o amo, o vi", "el pronombre de objeto después del verbo"],
      ["tem gente", "há gente", "tem por «hay»"],
      ["chegar no, ir na", "chegar ao, ir à", "em con verbos de movimiento"],
      ["me dá, me chamo (al empezar)", "dá-me, chamo-me", "pronombre átono al comienzo"],
      ["a gente vai", "nós vamos", "(a gente es correcto también en lo escrito corriente)"]
    ]
  };
  REGISTRO.prompt = "La referencia es el portugués de Brasil, norma urbana culta: la próclise del habla brasileña (me chamo, te amo), " +
    "«você» con verbo en tercera, «a gente» con verbo en singular, el artículo opcional ante posesivo, *em um* o *num*, son correctos. " +
    "Lo del habla que el curso enseña (" + REGISTRO.rows.slice(0, 8).map(function (r) { return r[0] + " → " + r[1]; }).join("; ") +
    ") no es error ni «estilo» en un texto informal; en uno formal marcalo como \"estilo\" con la forma escrita. " +
    "No corrijas hacia el portugués europeo. Ortografía del Acuerdo de 1990 (ideia, voo, linguiça).";
  REGISTRO.note = function (said, std) {
    return "*" + said + "* es del habla" + (std ? "; en un texto formal: *" + std + "*" : "") + ".";
  };
  // «Casi» o «vale con nota», según el registro pedido.
  REGISTRO.level = function (formal) { return formal ? "close" : "ok_note"; };

  /* El registro que pide el ítem: ctx.registro ("formal", "coloquial"),
     la etiqueta «formal» del banco o lo que dice la consigna.  En «(coloquial)
     X → (culto) ___» manda lo que viene después de la flecha. */
  function registerOf(ctx) {
    ctx = ctx || {};
    if (ctx.registro) return /^(formal|culto)$/i.test(ctx.registro) ? "formal" : /^(coloquial|informal|habla)$/i.test(ctx.registro) ? "coloquial" : null;
    if (ctx.formal) return "formal";
    if (ctx.tags && [].concat(ctx.tags).indexOf("formal") >= 0) return "formal";
    var s = String(ctx.prompt || "") + " ¶ " + String(ctx.stem || "");
    var arrow = s.lastIndexOf("→");
    var tail = arrow >= 0 ? s.slice(arrow) : s;
    if (/\((formal|culto|culta|culto escrito|escrito|e-mail formal|carta formal)\b[^)]*\)|registro (formal|culto)|forma escrita|escrit[oa] formal|norma culta|texto formal|carta formal|lo escrito formal/i.test(tail)) return "formal";
    if (/\((coloquial|informal|habla)\b[^)]*\)|registro (coloquial|informal)|como se habla/i.test(tail)) return "coloquial";
    return null;
  }

  // «32» → trinta e dois (y la forma femenina: duas, duzentas).
  var UNI = ["zero", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez", "onze", "doze", "treze", "catorze",
             "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"];
  var DEC = ["", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
  var CEN = ["", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"];
  function numWords(n) {
    if (n < 20) return UNI[n];
    if (n < 100) return DEC[Math.floor(n / 10)] + (n % 10 ? " e " + UNI[n % 10] : "");
    if (n === 100) return "cem";
    if (n < 1000) return CEN[Math.floor(n / 100)] + (n % 100 ? " e " + numWords(n % 100) : "");
    if (n < 1000000) {
      var th = Math.floor(n / 1000), r = n % 1000;
      return (th === 1 ? "mil" : numWords(th) + " mil") + (r ? (r < 100 || r % 100 === 0 ? " e " : " ") + numWords(r) : "");
    }
    return null;
  }
  function numFem(s) { return s.replace(/\bum\b/g, "uma").replace(/\bdois\b/g, "duas").replace(/entos\b/g, "entas"); }

  /* Las variantes de lo escrito que dicen lo mismo en otro registro o de
     otra forma: [{text, subs: [{said, std, reg}], accept}].  accept: solo
     sirve para aceptar (si con el cambio queda igual a una respuesta);
     sin accept, el cambio es seguro (pra → para) y también sirve para
     diagnosticar el resto. */
  var PHRASE_EQ = [[/\bquem sabe\b/gi, "talvez"], [/\bneste momento\b/gi, "agora"], [/\bem seguida\b/gi, "depois"]];
  var MOTION_V = /^(ir|chegar|voltar|levar|vir|subir|descer|regressar|mudar)$/;
  var NO_OBJ_V = /^(ser|estar|ficar|parecer|continuar|permanecer|virar|tornar)$/;
  function regCandidates(given) {
    var src = String(given), words = [], re = /[A-Za-zÀ-ÿ]+(?:-[A-Za-zÀ-ÿ]+)*|\d+/g, m;
    while ((m = re.exec(src))) words.push({ w: m[0], at: m.index });
    var low = function (x) { return x.toLowerCase(); };
    var capLike = function (like, x) { return /^[A-ZÀ-Ý]/.test(like) ? x.charAt(0).toUpperCase() + x.slice(1) : x; };
    var build = function (repl) {   // repl: {index: string}
      var out = "", last = 0;
      words.forEach(function (x, k) {
        if (repl[k] == null) return;
        out += src.slice(last, x.at) + repl[k];
        last = x.at + x.w.length;
      });
      return (out + src.slice(last)).replace(/\s+/g, " ").replace(/\s+([,.;:!?])/g, "$1").trim();
    };
    var cands = [];
    // 1. the forms of the table: every combination (at most 3 places)
    var spots = [];
    words.forEach(function (x, k) {
      var f = REGISTRO.forms[low(x.w)];
      // cê, cês: solo como sujeto, delante del verbo (cê vem?); después de preposición, você (pra você)
      // «pra o» sin contraer no es el habla: es *pro* (o *para o*)
      if (f && low(x.w) === "pra" && words[k + 1] && /^(o|os)$/.test(low(words[k + 1].w))) f = null;
      if (f && /^(cê|cês)$/.test(low(x.w))) {
        var nx0 = words[k + 1] ? low(words[k + 1].w) : "";
        if (!(finite(nx0) || CLITIC_ONLY[nx0] || /^(não|já|também|sempre|nunca|só)$/.test(nx0))) f = null;
      }
      if (f) spots.push({ k: k, opts: f });
    });
    spots = spots.slice(0, 3);
    var combos = [{ repl: {}, subs: [] }];
    spots.forEach(function (sp) {
      var next = [];
      combos.forEach(function (c) {
        sp.opts.forEach(function (o) {
          var r = {}; Object.keys(c.repl).forEach(function (q) { r[q] = c.repl[q]; });
          r[sp.k] = capLike(words[sp.k].w, o);
          next.push({ repl: r, subs: c.subs.concat([{ said: low(words[sp.k].w), std: o, reg: true }]) });
        });
      });
      combos = next;
    });
    if (spots.length) combos.forEach(function (c) { cands.push({ text: build(c.repl), subs: c.subs, repl: c.repl }); });
    var base = cands.length ? cands.slice() : [{ text: src, subs: [], repl: {} }];
    // ¿…, né? al final: la muletilla del habla («¿no?»)
    base.slice().forEach(function (c) {
      var nt = c.text.replace(/[\s,]+né\s*([?!.]*)\s*$/i, "$1");
      if (nt !== c.text) base.push({ text: nt, subs: c.subs.concat([{ said: "né", std: "", reg: true, tag: true }]), accept: true });
    });
    // 2. constructions: only to accept
    var extra = [];
    base.forEach(function (c) {
      var t = c.text, tw = [], r2 = /[A-Za-zÀ-ÿ]+(?:-[A-Za-zÀ-ÿ]+)*|\d+/g, m2;
      while ((m2 = r2.exec(t))) tw.push({ w: m2[0], at: m2.index });
      var put = function (from, len, to, sub) {
        var a = tw[from].at, b = tw[from + len - 1].at + tw[from + len - 1].w.length;
        extra.push({ text: (t.slice(0, a) + to + t.slice(b)).replace(/\s+/g, " ").trim(), subs: c.subs.concat(sub ? [sub] : []), accept: true });
      };
      extra.push({ text: t, subs: c.subs, accept: true, noop: true });
      for (var i = 0; i < tw.length; i++) {
        var w = low(tw[i].w), nx = tw[i + 1] ? low(tw[i + 1].w) : "", nx2 = tw[i + 2] ? low(tw[i + 2].w) : "";
        var lem = verbLemmas(w);
        var fin = finite(w) && !NO_OBJ_V.test(lem[0] || "") && !SUBJ_P[w];
        // amo você → te amo / o amo; vi ele → o vi; ligo pra você → te ligo / lhe ligo
        if (fin && /^(você|vocês|ele|ela|eles|elas)$/.test(nx) && !(tw[i + 2] && finite(nx2))) {
          var cl = { "você": ["te", "o", "a"], "vocês": ["os", "as", "vos"], ele: ["o"], ela: ["a"], eles: ["os"], elas: ["as"] }[nx];
          cl.forEach(function (c0) { put(i, 2, c0 + " " + tw[i].w, { said: w + " " + nx, std: c0 + " " + w, reg: true }); });
        }
        if (fin && /^(para|pra)$/.test(nx) && /^(você|ele|ela|mim)$/.test(nx2)) {
          var cl2 = { "você": ["te", "lhe"], ele: ["lhe"], ela: ["lhe"], mim: ["me"] }[nx2];
          cl2.forEach(function (c0) { put(i, 3, c0 + " " + tw[i].w, { said: w + " " + nx + " " + nx2, std: c0 + " " + w, reg: nx === "pra" || c0 !== "me" }); });
        }
        // tem gente → há gente; tinha → havia; teve → houve
        var ex = { tem: "há", tinha: "havia", teve: "houve", "terá": "haverá" }[w];
        if (ex && !(i > 0 && (SUBJ_P[low(tw[i - 1].w)] || DATA.nouns[low(tw[i - 1].w)]))) put(i, 1, capLike(tw[i].w, ex), { said: w, std: ex, reg: true });
        // chegou no Rio → chegou ao Rio; vou na praia → vou à praia
        var mv = { no: "ao", na: "à", nos: "aos", nas: "às" }[nx];
        if (mv && lem.some(function (l) { return MOTION_V.test(l); })) put(i + 1, 1, mv, { said: w + " " + nx, std: w + " " + mv, reg: true });
        // fui para a praia = fui à praia: destino con *para* o con *a*
        if (/^(para)$/.test(nx) && lem.some(function (l) { return MOTION_V.test(l); })) {
          var art = tw[i + 2] ? low(tw[i + 2].w) : "", ca = { o: "ao", a: "à", os: "aos", as: "às" }[art];
          if (ca) put(i + 1, 2, ca, { said: "para " + art, std: ca, silent: true });
          else put(i + 1, 1, "a", { said: "para", std: "a", silent: true });
        }
        // 32 → trinta e dois / trinta e duas
        if (/^\d{1,6}$/.test(w)) {
          var nw = numWords(+w);
          if (nw) {
            put(i, 1, nw, { said: w, std: nw, silent: true });
            if (numFem(nw) !== nw) put(i, 1, numFem(nw), { said: w, std: numFem(nw), silent: true });
          }
        }
      }
      PHRASE_EQ.forEach(function (pe) {
        var x = t.replace(pe[0], function (m0) { return capLike(m0, pe[1]); });
        if (x !== t) extra.push({ text: x, subs: c.subs.concat([{ said: pe[0].source, std: pe[1], silent: true }]), accept: true });
      });
    });
    return cands.concat(extra).slice(0, 40);
  }

  // The note shown with an answer accepted in another register.
  function regNotes(subs) {
    var seen = {};
    return subs.filter(function (s) { if (!s.reg || seen[s.said]) return false; seen[s.said] = 1; return true; }).map(function (s) {
      if (s.tag) return "*¿…, né?* es la muletilla del habla («¿no?»); en lo escrito no va.";
      if (/^(grana|valeu|busão)$/.test(s.said)) return "*" + s.said + "* es del habla; en un texto formal: *" + s.std + "*.";
      return REGISTRO.note(s.said, s.std);
    }).join(" ");
  }

  /* An answer that differs only by the register: accepted with a note, or
     «Casi» when the item asks for formal register.  When the answer has
     other mistakes too, they are diagnosed on the written form (pra → para),
     so the register form is not taken for the error. */
  function registerPass(given, list, ctx, res) {
    var cands = regCandidates(given);
    // the answers may use the spoken forms too (Te ligo depois, tá?): compare with their written form as well
    var more = [];
    list.forEach(function (x) {
      regCandidates(x).forEach(function (c) {
        if (c.accept || more.indexOf(c.text) >= 0 || list.indexOf(c.text) >= 0) return;
        if (c.subs.some(function (q) { return /^(grana|valeu|busão|bora|vamo)$/.test(q.said); })) return;   // palabras, no formas
        more.push(c.text);
      });
    });
    if (more.length) {
      list = list.concat(more);
      cands = [{ text: String(given), subs: [], accept: true, same: true }].concat(cands);
    }
    if (!cands.length) return null;
    var c2 = {};
    Object.keys(ctx).forEach(function (k) { c2[k] = ctx[k]; });
    c2._reg = true;
    // a multiple choice between registers asks for one of them: the other is «Casi»
    var formal = registerOf(ctx) === "formal" || !!ctx.choice;
    var best = null;
    for (var i = 0; i < cands.length; i++) {
      var r = diagnose0(cands[i].text, list, c2);
      if (r.verdict === "giusto") {
        var subs = cands[i].subs, notes = regNotes(subs);
        if (cands[i].same && registerOf(ctx) === "coloquial") {
          // se pedía el habla y escribió la forma escrita
          return { verdict: "quasi", cat: "registro", label: LABEL.registro, slip: true, target: res.target,
            hint: "Está bien escrito, pero se pide cómo se dice en el habla.",
            explain: "Lo escrito está bien, pero la consigna pide el registro del habla: " + sentEnd(res.target || list[0]) + " " +
              "En el habla de Brasil: *pra* (para), *tô, tá* (estou, está), *a gente* (nós).",
            given: res.given, fixed: res.fixed, others: 0, all: ["registro"], level: "close" };
        }
        if (!notes) { r.level = "ok"; r.equiv = true; r.given = tokens(given).map(function (w) { return { w: w }; }); return r; }     // cifras, sinónimos: vale sin más
        r.given = tokens(given).map(function (w) { return { w: w }; });
        if (!formal) { r.level = "ok_note"; r.note = notes; r.reg = subs.filter(function (s) { return s.reg; }); return r; }
        var q = { verdict: "quasi", cat: "registro", label: LABEL.registro, slip: true, target: r.target || res.target,
          hint: "En el habla está bien; ¿y en un texto formal?",
          explain: notes + " Acá se pide el registro formal.",
          given: res.given, fixed: res.fixed, others: 0, all: ["registro"], level: "close", note: notes };
        var said = {};
        subs.forEach(function (s) { if (s.reg) String(s.said).split(" ").forEach(function (x) { said[x] = 1; }); });
        q.given = tokens(given).map(function (w) { return { w: w, bad: !!said[w] }; });
        q.fixed = tokens(q.target || "").map(function (w) { return { w: w }; });
        return q;
      }
      if (!cands[i].accept && (!best || r.all.length < best.r.all.length)) best = { c: cands[i], r: r };
    }
    // Other mistakes: judged on the written form, the words shown as written.
    if (best && best.r.verdict !== "giusto" && best.r.all.length <= (res.all || []).length) {
      var r2 = best.r, orig = tokens(given), norm = tokens(best.c.text);
      if (orig.length === norm.length && r2.given && r2.given.length === norm.length) {
        r2.given = r2.given.map(function (t, k) { return { w: orig[k], bad: t.bad }; });
      } else if (r2.given) {
        // the words as written: estou → tô again (1:1 changes only)
        best.c.subs.forEach(function (q) {
          if (!q.reg || /\s/.test(q.std) || /\s/.test(q.said)) return;
          for (var k = 0; k < r2.given.length; k++) if (r2.given[k].w === q.std.toLowerCase()) { r2.given[k].w = q.said; break; }
        });
      }
      var n2 = regNotes(best.c.subs);
      if (n2 && formal) { r2.all = r2.all.concat(["registro"]); r2.explain = r2.explain + " Además: " + n2; }
      else if (n2) r2.note = n2;
      return r2;
    }
    return null;
  }

  /* Same words, another order: which word moved and the rule of its place
     (the article before its noun, the adjective after it, não before the
     verb…), with the Spanish that orders the same way. */
  var ADV_PRE = /^(não|nunca|já|também|sempre|ainda|só|nem|jamais|talvez)$/;
  var INTENS = /^(muito|muita|muitos|muitas|tão|mais|menos|bem|pouco|bastante|super|meio)$/;
  function isDet(w) { return !!(ARTICLES[w] || POSSESSIVE.indexOf(w) >= 0 || /^(este|esta|estes|estas|esse|essa|esses|essas|aquele|aquela|aqueles|aquelas|todo|toda|todos|todas|outro|outra|outros|outras|cada|algum|alguma|nenhum|nenhuma|dois|duas|três|quatro|cinco|seis|sete|oito|nove|dez|\d+)$/.test(w)); }
  function isNounW(w) { return !!(DATA.nouns[w] || DATA.nounsByPlural[w] || HETERO[w]); }
  function isAdjW(w) { return !!(DATA.adj[w]) && !isNounW(w); }
  function orderExplain(g, e, target) {
    var whole = " Así: " + sentEnd(target);
    var i = 0;
    while (i < e.length && g[i] === e[i]) i++;
    var a = e[i], b = e[i + 1];
    var swap = b != null && g[i] === b && g[i + 1] === a;
    if (!swap) {
      return "Acá *" + a + "* va en otro lugar." + whole + " El orden básico es el del español: sujeto, verbo y complementos; lo que cambia son unos pocos casos (el pronombre átono, *não* pegado al verbo).";
    }
    var why;
    if (INTENS.test(b) && e[i + 2] && !INTENS.test(a)) why = "*" + b + "* va delante de la palabra que intensifica, como «muy» en español: *" + b + " " + e[i + 2] + "*.";
    else if (isDet(a) && (isNounW(b) || !isVerbish(b))) why = "*" + a + "* va delante de lo que acompaña, como en español: *" + a + " " + b + "*.";
    else if (isNounW(a) && isAdjW(b)) why = "El adjetivo va casi siempre después del sustantivo, como en español: *" + a + " " + b + "* («casa grande»); delante cambia el sentido o suena literario (um grande homem = un gran hombre).";
    else if (PREP_BASE[a] || CONTR[a] || a === "pra") why = "La preposición va delante de lo que introduce, como en español: *" + a + " " + b + "*.";
    else if (ADV_PRE.test(a) && isVerbish(b)) why = "*" + a + "* va delante del verbo: *" + a + " " + b + "*" + (a === "não" ? ", como el «no» del español." : " (como en español «" + ({ já: "ya lo sé", também: "también voy", sempre: "siempre vengo", nunca: "nunca voy" }[a] || "ya vengo") + "»).");
    else if (INTENS.test(a) && (isAdjW(b) || /mente$/.test(b) || !isVerbish(b))) why = "*" + a + "* va delante de la palabra que intensifica, como «muy» en español: *" + a + " " + b + "*.";
    else if ((SUBJ_P[a] || isNounW(a) || (ARTICLES[e[i - 1]] && !isVerbish(a))) && finite(b)) why = "El sujeto va delante del verbo: *" + a + " " + b + "*. En las preguntas el portugués de Brasil tampoco lo da vuelta (Onde você mora?, «¿dónde vivís?»).";
    else if (finite(a) && !isVerbish(b)) why = "El verbo va antes de su complemento, como en español: *" + a + " " + b + "*.";
    else why = "*" + b + "* va después de *" + a + "*, como en español.";
    return why + whole;
  }

  function pickTarget(given, expected) {
    var g = tokens(given), best = null, bestScore = -1;
    // The variant that differs only in accents is the one the learner meant
    // («Vou a praia» → «Vou à praia», not «Vou para a praia»).
    var gd = deaccent(g.join(" "));
    for (var i = 0; i < expected.length; i++) if (deaccent(tokens(expected[i]).join(" ")) === gd) return expected[i];
    expected.forEach(function (x) {
      var s = lcsLen(g, tokens(x)) - Math.abs(tokens(x).length - g.length) * 0.1;
      if (s > bestScore) { bestScore = s; best = x; }
    });
    return best;
  }

  function diagnose(given, expected, ctx) {
    // Sin el contexto del ítem (la corrección de «encontrá el error», que
    // pide la norma escrita) rige el registro formal; con él, el del ítem.
    if (ctx == null) ctx = { registro: "formal" };
    var res = diagnose0(given, expected, ctx);
    if (!ctx._reg && res.verdict !== "giusto" && res.cat !== "vuoto") {
      var list = (Array.isArray(expected) ? expected : [expected]).filter(function (x) { return x != null && String(x).trim(); }).map(String);
      var r = null;
      try { r = registerPass(String(given == null ? "" : given).slice(0, 2000), list, ctx, res); } catch (e) { r = null; }
      if (r) res = r;
    }
    return withLevel(layer(res));
  }

  /* La explicación en capas (PORQUE_DATA.capas, en porque_data.js): cuando
     la explicación solo dice qué va («Acá va…», «Sobra…»), se suma la regla
     con un ejemplo; cuando no trae el contraste con el español, se suma esa
     línea.  El ejemplo no se muestra si repite la respuesta del ítem. */
  var EMPTY_EXPL = /^(Acá va \*[^*]+\*( \(«[^»]*»\))?\.|Acá va la preposición \*[^*]+\*( \([^)]*\))?\.|Sobra \*[^*]+\*\.|Falta \*[^*]+\*( \(= [^)]*\))?( (antes|después) de \*[^*]+\*)?\.|Acá no va artículo: sobra \*[^*]+\*\.|\*[^*]+\* es el plural; acá va el singular \*[^*]+\*\.|\*[^*]+\* = \*[^*]+\*\.|Acá va \*[^*]+\* sin artículo\.|La tilde va así: \*[^*]+\*\.)$/;
  var ES_MENTION = /español|castellano|«[^»]+»|como en |a diferencia/i;
  function capa(cat) {
    var P = root.PORQUE_DATA;
    return P && P.capas && P.capas[cat] || null;
  }
  function layer(res) {
    if (!res || res.verdict === "giusto" || !res.cat || res.cat === "tipeo" || !res.explain) return res;
    var c = capa(res.cat);
    if (!c) return res;
    var x = String(res.explain).trim(), add = [];
    if (EMPTY_EXPL.test(x)) {
      add.push(c.regla);
      var tg = tokens(res.target || "").join(" "), ej = tokens(c.ej || "").join(" ");
      if (c.ej && tg.indexOf(ej) < 0 && ej.indexOf(tg) < 0) add.push("Por ejemplo: *" + c.ej + "*");
    }
    if (c.es && !ES_MENTION.test(x) && add.join(" ").indexOf(c.es) < 0 && !ES_MENTION.test(add.join(" "))) add.push(c.es);
    if (add.length) res.explain = x + " " + add.map(function (a) { return /[.!?»*]$/.test(a) ? a : a + "."; }).join(" ");
    return res;
  }
  // level: "ok" (bien), "ok_note" (bien, con una nota: otra forma válida,
  // el registro del habla), "close" (casi), "wrong" (mal).
  function withLevel(res) {
    if (!res.level || (res.verdict === "giusto") !== /^ok/.test(res.level)) {
      res.level = res.verdict === "giusto" ? (res.note ? "ok_note" : "ok") : res.verdict === "quasi" ? "close" : "wrong";
    }
    return res;
  }

  function diagnose0(given, expected, ctx) {
    ctx = ctx || {};
    var list = (Array.isArray(expected) ? expected : [expected]).filter(function (x) { return x != null && String(x).trim(); }).map(String);
    if (!list.length) list = [""];
    given = String(given == null ? "" : given).slice(0, 2000);
    var rawG = tokens(given);
    var target0 = pickTarget(given, list) || list[0];
    var exp = expandGap(ctx.stem, given, list);
    var lead = "";
    if (exp) { given = exp.given; list = exp.targets; lead = exp.lead || ""; }
    // An uncontracted «em o», «de a»: compare with the variants that have the contraction.
    var gT = tokens(given), withC = list.filter(function (v) { return uncontracted(gT, tokens(v)); });
    if (withC.length && withC.length < list.length) list = withC.concat(list.filter(function (v) { return withC.indexOf(v) < 0; }));
    if (withC.length) target0 = pickTarget(given, withC) || target0;
    var target = (withC.length ? pickTarget(given, withC) : null) || pickTarget(given, list) || list[0];
    var g = tokens(given), e = tokens(target), pz = pauses(given), epz = pauses(target);
    QUESTION = /\?\s*$/.test(String(given)) || /\?\s*$/.test(String(target));
    var res = { cat: null, slip: false, hint: "", explain: "", target: target,
                given: g.map(function (w) { return { w: w }; }),
                fixed: e.map(function (w) { return { w: w }; }), others: 0, all: [] };

    if (!rawG.length) {
      res.verdict = "sbagliato"; res.cat = "vuoto"; res.label = LABEL.vuoto;
      res.hint = "Escribí algo, aunque no estés seguro: equivocarse y corregirse enseña.";
      res.explain = "La respuesta era " + sentEnd(target0);
      return res;
    }
    if (g.join(" ") === e.join(" ")) { res.verdict = "giusto"; return res; }
    var nm = names(target).concat(ctx.names || []);
    for (var lx = 0; lx < list.length; lx++) if (g.join(" ") === tokens(list[lx]).join(" ")) { res.verdict = "giusto"; return res; }
    // An enclitic form that does not exist (comprar-o, fiz-o, direi-lhe).
    var bf0 = badEnclForm(g);
    if (bf0 && !list.some(function (v) { return tokens(v).indexOf(g[bf0.i]) >= 0; })) {
      res.cat = bf0.cat; res.label = LABEL[bf0.cat]; res.verdict = "sbagliato"; res.all = [bf0.cat];
      res.hint = bf0.cat === "pronome" ? "Revisá la forma del pronombre pegado al verbo." : "Revisá dónde va el pronombre.";
      res.explain = bf0.why;
      if (res.given[bf0.i]) res.given[bf0.i].bad = true;
      res.fixed.forEach(function (w) { if (w.w.indexOf("-") > 0 || w.w === g[bf0.i].split("-")[1]) w.fix = true; });
      return res;
    }
    // Free variants of Brazilian Portuguese.
    var formalHit = null;
    for (var li = 0; li < list.length; li++) {
      var e2 = tokens(list[li]);
      if (deaccent(g.join(" ")) === deaccent(e2.join(" "))) continue;   // only accents differ: the rules see it
      var ce = canon(e2, names(list[li]).concat(ctx.names || [])), cg = canon(g, names(list[li]).concat(ctx.names || []));
      if (ce === cg) {
        var bf = badEnclForm(g);
        if (bf && !badEnclForm(e2)) {
          res.cat = bf.cat; res.label = LABEL[bf.cat]; res.verdict = "sbagliato"; res.all = [bf.cat];
          res.hint = bf.cat === "pronome" ? "Revisá la forma del pronombre pegado al verbo." : "Revisá dónde va el pronombre.";
          res.explain = bf.why;
          if (res.given[bf.i]) res.given[bf.i].bad = true;
          res.fixed.forEach(function (w) { if (w.w.indexOf("-") > 0) w.fix = true; });
          return res;
        }
        // Sentence or clause opened with an unstressed pronoun where the
        // answer (formal writing) has it after the verb: close, not wrong.
        var fm = /(^|[.,;:!?—]\s*)(me|te|se|lhe|lhes|nos)\s+([a-zà-ÿ]+)/i.exec(String(given));
        var fmTok = fm && e2.filter(function (x) { var sp2 = splitEnclitic(x); return sp2 && sp2.c === fm[2].toLowerCase() && sp2.v === fm[3].toLowerCase(); })[0];
        if (fmTok && !list.some(function (x) { return new RegExp("(^|[.,;:!?—]\\s*)" + fm[2] + "\\s+" + fm[3] + "\\b", "i").test(x); })) {
          formalHit = formalHit || { c: fm[2].toLowerCase(), v: fm[3].toLowerCase(), form: fmTok };
          continue;
        }
        var be = badEnclisis(g, pz);
        if (be && !badEnclisis(e2, pauses(list[li]))) {
          var bd = be.dup ? dupClitic(be) : attractExplain(be);
          res.cat = bd.cat; res.label = LABEL[bd.cat]; res.verdict = "sbagliato"; res.all = [bd.cat];
          res.hint = bd.hint;
          res.explain = bd.explain;
          if (res.given[be.i]) res.given[be.i].bad = true;
          res.fixed.forEach(function (w) { if (w.w === be.c || w.w === be.v) w.fix = true; });
          return res;
        }
        // «contou te»: after the verb the pronoun goes with a hyphen
        var loose = -1;
        g.forEach(function (t, k) {
          if (loose < 0 && k > 0 && CLITIC_ONLY[t] && finite(g[k - 1]) && !(g[k + 1] && isVerbish(g[k + 1])) &&
              !e2.some(function (x, q) { return x === t && e2[q - 1] === g[k - 1]; })) loose = k;
        });
        if (loose > 0) {
          res.cat = "colocacao"; res.label = LABEL.colocacao; res.verdict = "sbagliato"; res.all = ["colocacao"];
          res.hint = "Revisá el pronombre que va después del verbo: ¿cómo se une?";
          var vL = g[loose - 1], fut = verbForms(vL).length && verbForms(vL).every(function (v) { return v.tense === "futuro" || v.tense === "condicional"; });
          var stL = vL.replace(/(ei|ás|á|emos|eis|ão|ia|ias|íamos|íeis|iam)$/, "");
          res.explain = fut
            ? "Con futuro y condicional el pronombre no va después del verbo: en lo formal va en el medio (mesóclise: " + it(stL + "-" + g[loose] + "-" + vL.slice(stL.length)) + "); en el habla, antes: " + it(g[loose] + " " + vL) + "."
            : "Si el pronombre va después del verbo, se une con guion: " + it(vL + "-" + g[loose]) +
              ". En el habla de Brasil lo normal es ponerlo antes: " + it(g[loose] + " " + vL) + ".";
          if (res.given[loose]) res.given[loose].bad = true;
          res.fixed.forEach(function (w) { if (w.w === g[loose]) w.fix = true; });
          return res;
        }
        // A choice between registers (me dá / dá-me): both exist, but the
        // question asked for one of them.
        if (ctx.choice) {
          var encTok = function (arr) { return arr.filter(function (x) { return splitEnclitic(x); })[0]; };
          var gE = encTok(g), eE = encTok(e2);
          if (!!gE !== !!eE) {
            var spE = splitEnclitic(gE || eE), mes = (eE || "").split("-").length === 3;
            res.cat = "colocacao"; res.label = LABEL.colocacao; res.verdict = "quasi"; res.slip = true; res.all = ["colocacao"];
            res.hint = "Las dos formas existen: ¿cuál es la del registro que se pide?";
            res.explain = gE
              ? it(gE) + " es de lo escrito formal (y de Portugal); en el habla de Brasil el pronombre va antes del verbo: " + it(spE.c + " " + spE.v) + "."
              : mes ? "En el registro formal, con futuro y condicional va la mesóclise: " + it(eE) + "; " + it(spE.c + " " + spE.v) + " es lo corriente."
              : "En lo escrito formal el pronombre va después del verbo: " + it(eE) + "; " + it(spE.c + " " + spE.v) + " es del habla.";
            res.given.forEach(function (w) { if (w.w === gE || w.w === spE.c) w.bad = true; });
            res.fixed.forEach(function (w) { if (w.w === eE || w.w === spE.c) w.fix = true; });
            return res;
          }
        }
        res.verdict = "giusto"; return res;
      }
      var gS = stripSubj(g), eS = stripSubj(e2);
      if (genderFree(gS, eS, list[li]) || synonymFree(gS, eS, /,\s*mas\s*[,.]/i.test(given))) { res.verdict = "giusto"; return res; }
      if (advFree(g, e2, names(list[li]).concat(ctx.names || [])) || advFree(gS, eS, names(list[li]).concat(ctx.names || []))) { res.verdict = "giusto"; return res; }
    }
    if (formalHit && !ctx.choice && registerOf(ctx) !== "formal") {
      // Sin registro formal pedido, empezar con el pronombre es el habla de Brasil: vale.
      res.verdict = "giusto"; res.level = "ok_note";
      res.note = "Empezar con *" + formalHit.c + " " + formalHit.v + "* es lo normal en el habla de Brasil; en un texto formal: *" +
        formalHit.form.charAt(0).toUpperCase() + formalHit.form.slice(1) + "*.";
      return res;
    }
    if (formalHit) {
      res.cat = "colocacao"; res.label = LABEL.colocacao; res.verdict = "quasi"; res.slip = true; res.all = ["colocacao"];
      res.hint = "En el habla está bien; en lo escrito formal, ¿se empieza con un pronombre átono (me, te, se, lhe)?";
      var mesoc = formalHit.form.split("-").length === 3;
      res.explain = "En la escritura formal no se empieza una oración (ni una parte después de coma) con un pronombre átono (me, te, se, lhe, o, a): " + it(formalHit.form) +
        (mesoc ? " (con futuro y condicional, el pronombre va en el medio: es la mesóclise)" : "") +
        ". En el habla de Brasil, *" + formalHit.c + " " + formalHit.v + "* es lo normal.";
      res.given.forEach(function (w) { if (w.w === formalHit.c) w.bad = true; });
      res.fixed.forEach(function (w) { if (w.w === formalHit.form) w.fix = true; });
      return res;
    }

    // The whole answer in Spanish: one finding, not five.
    var wordsG = rawG.filter(function (t) { return /[a-zà-ÿ]/i.test(t); });
    // What the answers use is not Spanish (Rosario, José, a typo of a
    // Portuguese word is not Spanish either: entrgeue).
    var allT = [];
    list.forEach(function (v) { tokens(v).forEach(function (t) { allT.push(t); }); });
    var typoOfT = function (t) { return allT.some(function (x) { return x.length >= 4 && editDistance(deaccent(t), deaccent(x)) <= 1; }); };
    var stemRaw = ctx.stem && !/_{3,}/.test(ctx.stem) ? String(ctx.stem) : "";
    var stemToks = stemRaw ? tokens(stemRaw.replace(/\([^)]*\)/g, " ")) : [];
    // A prompt in Spanish (¿Qué…?, ñ, words that are not Portuguese).
    var stemEs = stemToks.length && (/[¿¡ñ]/.test(stemRaw) || stemToks.some(spanishish) ||
                 stemToks.filter(function (t) { return !isPortuguese(t); }).length * 2 >= stemToks.length);
    var fromStem = function (t) { return stemEs && stemToks.indexOf(t) >= 0 && allT.indexOf(t) < 0 && !isPortuguese(t); };
    var esToks = wordsG.filter(function (t) {
      if (allT.indexOf(t) >= 0) return false;
      if (spanishWord(t)) return true;
      if (fromStem(t)) return true;
      return looksSpanish(t) && !typoOfT(t);
    });
    var gNoPar = tokens(given.replace(/\([^)]*\)/g, " "));
    var copied = gNoPar.length && gNoPar.join(" ") === stemToks.join(" ") &&
      (stemEs || /traduc/i.test(String(ctx.prompt || "")) || stemToks.some(function (t) { return !isPortuguese(t); }));
    if (copied) {
      res.cat = "espanol"; res.label = LABEL.espanol;
      res.hint = "Eso es la consigna, en español. Escribila en portugués; si todavía no lo sabés, pedí las fichas 🧩.";
      res.explain = "Copiaste la consigna en español. En portugués: " + sentEnd(target0);
      res.given.forEach(function (w) { w.bad = true; });
      res.fixed.forEach(function (w) { w.fix = true; });
      res.verdict = "sbagliato"; res.all = ["espanol"];
      return res;
    }
    if (wordsG.length >= 2 && esToks.length >= 2 && (esToks.length * 2 >= wordsG.length || (esToks.length >= 3 && esToks.length * 3 >= wordsG.length))) {
      var pairsEs = esToks.filter(spanishWord).slice(0, 3).map(function (t) { return it(t) + " = " + it(String(spanishWord(t)).split(" / ")[0]); });
      var allEs = esToks.length === wordsG.length;
      var ptGloss = allEs ? [] : wordsG.filter(function (t) { return !spanishish(t) && DATA.lex[t]; })
        .slice(0, 2).map(function (t) { return it(t) + " = " + DATA.lex[t]; });
      res.cat = "espanol"; res.label = LABEL.espanol;
      res.hint = allEs ? "Eso está en español. Escribilo en portugués; si todavía no lo sabés, pedí las fichas 🧩."
                       : "Hay español mezclado: " + esToks.slice(0, 3).map(it).join(", ") + ". Escribilo todo en portugués.";
      res.explain = (allEs ? "Está en español. " : "Mezcla español y portugués" + (ptGloss.length ? " (" + ptGloss.join(", ") + ")" : "") + ". ") +
        "En portugués: " + sentEnd(target0) + (pairsEs.length ? " (" + pairsEs.join(", ") + ")" : "");
      res.given.forEach(function (w) { if (esToks.indexOf(w.w) >= 0) w.bad = true; });
      res.fixed.forEach(function (w) { if (!rawG.some(function (t) { return t === w.w; })) w.fix = true; });
      res.verdict = "sbagliato"; res.all = ["espanol"];
      return res;
    }

    var found = [];

    // Contractions first: fix them and look at what is left.
    var guard = 0, un;
    while ((un = uncontracted(g, e)) && guard++ < 4) {
      found.push({ d: un.d, gi: -1, ei: e.indexOf(un.form) });
      g = g.slice(0, un.i).concat([un.form], g.slice(un.i + 2));
      if (res.given[un.i]) res.given[un.i].bad = true;
      if (res.given[un.i + 1]) res.given[un.i + 1].bad = true;
      res.given.splice(un.i + 1, 1);
    }
    if (found.length && g.join(" ") === e.join(" ")) return finish(res, found);
    if (found.length && canon(g, nm) === canon(e, nm)) return finish(res, found);

    // «a gente vamos» where the answer says «nós vamos» (or «a gente vai»)
    var agS = agenteSwap(g, e);
    if (agS) {
      res.cat = "persona"; res.label = LABEL.persona; res.verdict = "sbagliato";
      res.all = found.map(function (f) { return f.d.cat; }).concat(["persona"]);
      res.hint = "*a gente* significa «nosotros», pero ¿con qué persona del verbo va?";
      res.explain = "*A gente* va con la 3.ª del singular (a gente vai, a gente fala); *nós*, con la 1.ª del plural (nós vamos). *A gente " + g[agS.k] + "* mezcla los dos: acá, " + it(agS.fix) + ".";
      [agS.i, agS.i + 1, agS.k].forEach(function (i) { if (res.given[i]) res.given[i].bad = true; });
      agS.ei.forEach(function (i) { if (res.fixed[i]) res.fixed[i].fix = true; });
      return res;
    }

    // porque / por que / por quê
    for (var pq = 0; pq < g.length; pq++) {
      if (g[pq] === "porque" && e.indexOf("por") >= 0 && e[e.indexOf("por") + 1] && /^(que|quê)$/.test(e[e.indexOf("por") + 1]) && e.indexOf("porque") < 0) {
        found.push({ d: { cat: "ortografia", slip: false, hint: "¿Pregunta o respuesta? Se escribe distinto.",
          explain: "En la pregunta, separado: *por que* (por que você não vem?); al final, *por quê*; en la respuesta, junto: *porque*." }, gi: pq, ei: e.indexOf("por") });
        g = g.slice(0, pq).concat(["por", e[e.indexOf("por") + 1]], g.slice(pq + 1));
        res.given.splice(pq + 1, 0, { w: e[e.indexOf("por") + 1] });
        break;
      }
      if (g[pq] === "por" && /^(que|quê)$/.test(g[pq + 1] || "") && e.indexOf("porque") >= 0 && e.indexOf("por") < 0) {
        found.push({ d: { cat: "ortografia", slip: false, hint: "¿Pregunta o respuesta? Se escribe distinto.",
          explain: "En la respuesta (la causa) va junto: *porque*; *por que* separado es para preguntar." }, gi: pq, ei: e.indexOf("porque") });
        g = g.slice(0, pq).concat(["porque"], g.slice(pq + 2));
        res.given.splice(pq + 1, 1);
        break;
      }
    }
    if (found.length && g.join(" ") === e.join(" ")) return finish(res, found);

    // Enclisis after an attractor, with everything else right.
    var be2 = badEnclisis(g, pz);
    if (be2 && !badEnclisis(e, pauses(target))) {
      found.push({ d: be2.dup ? dupClitic(be2) : attractExplain(be2), gi: be2.i, ei: -1 });
    }

    // «tenho comido» / «he comido» where the perfeito goes, and vice versa;
    // «mais grande» where «maior» goes.
    var cp = compoundSwap(g, e) || comparativeSwap(g, e);
    if (cp) {
      res.cat = cp.cat; res.label = LABEL[cp.cat];
      res.hint = cp.hint; res.explain = cp.explain;
      res.verdict = "sbagliato"; res.all = found.map(function (f) { return f.d.cat; }).concat([cp.cat]);
      cp.gi.forEach(function (i) { if (res.given[i]) res.given[i].bad = true; });
      cp.ei.forEach(function (i) { if (res.fixed[i]) res.fixed[i].fix = true; });
      return res;
    }

    // Same words, other order
    if (g.length === e.length && g.slice().sort().join(" ") === e.slice().sort().join(" ") && g.join(" ") !== e.join(" ")) {
      var clit = g.filter(function (w, i) { return w !== e[i] && CLITIC_ONLY[w]; })[0];
      found.push({ d: clit
        ? { cat: "colocacao", slip: false,
            hint: "Las palabras están bien; revisá dónde va el pronombre.",
            explain: "En Brasil el pronombre átono (me, te, se, lhe, o, a) va antes del verbo (" + it(clit) + " + verbo: *me chamo, te amo, se vende*), y siempre delante después de *não, que, quem, já* y los adverbios." }
        : { cat: "orden", slip: false,
            hint: "Están todas las palabras, pero no en el orden portugués.",
            explain: orderExplain(g, e, target) },
        gi: -1, ei: -1 });
    } else {
      var ops = align(g, e);
      ops.forEach(function (o) {
        var c = { e: e, ei: o.ei, g: g, gi: o.gi, names: nm, stem: ctx.stem, prompt: ctx.prompt, nominal: ctx.nominal, lead: lead.toLowerCase(), epz: epz };
        if (o.op === "sub") {
          if (be2 && o.gi === be2.i) return;
          var d = pairRules(o.g, o.e, c);
          found.push({ d: d, gi: o.gi, ei: o.ei });
        } else if (o.op === "miss") {
          if (canonMissOk(o.e, g, e, o, nm)) return;
          found.push({ d: missRule(o.e, c), gi: -1, ei: o.ei });
        } else if (o.op === "extra") {
          if (canonExtraOk(o.g, g, e, o, nm)) return;
          found.push({ d: extraRule(o.g, g, o.gi, c), gi: o.gi, ei: -1 });
        }
      });
    }
    return finish(res, found);
  }

  // A word missing only because Brazilian Portuguese lets it go (the subject
  // pronoun, the article before a possessive): no finding.
  // In a question the subject você may go unsaid (Quer um café? = Você quer um café?).
  var QUESTION = false;
  function canonMissOk(w, g, e, o, nm) {
    var next = e[o.ei + 1] || "";
    if (SUBJ_P[w] && (!/^(você|vocês)$/.test(w) || QUESTION)) {
      var k = o.ei + 1;
      while (e[k] && /^(não|já|também|sempre|nunca|me|te|se|nos|lhe|lhes|o|a|os|as|só)$/.test(e[k])) k++;
      if (verbForms(e[k] || "").some(function (v) { return SUBJ_P[w].indexOf(v.p) >= 0; })) return true;
    }
    if (/^(o|a|os|as)$/.test(w) && !/^(de|em|por|a)$/.test(e[o.ei - 1] || "") && ((POSSESSIVE.indexOf(next) >= 0 && possAgrees(w, next)) || (nm.indexOf(next) >= 0 && !PLACE_ART[next] && !PLACE_NOART.test(next) && !DATA.nouns[next] && nameAgrees(w, next)))) return true;
    return false;
  }
  function canonExtraOk(w, g, e, o, nm) {
    var next = g[o.gi + 1] || "";
    if (SUBJ_P[w] && (!/^(você|vocês)$/.test(w) || QUESTION)) {
      var k = o.gi + 1;
      while (g[k] && /^(não|já|também|sempre|nunca|me|te|se|nos|lhe|lhes|o|a|os|as|só)$/.test(g[k])) k++;
      if (verbForms(g[k] || "").some(function (v) { return SUBJ_P[w].indexOf(v.p) >= 0; })) return true;
    }
    if (/^(o|a|os|as)$/.test(w) && !/^(de|em|por|a)$/.test(g[o.gi - 1] || "") && ((POSSESSIVE.indexOf(next) >= 0 && possAgrees(w, next)) || (nm.indexOf(next) >= 0 && !PLACE_ART[next] && !PLACE_NOART.test(next) && !DATA.nouns[next] && nameAgrees(w, next)))) return true;
    return false;
  }

  function finish(res, found) {
    found = found.filter(function (f) { return f && f.d; });
    if (found.some(function (f) { return !f.d.echo; })) found = found.filter(function (f) { return !f.d.echo; });
    if (!found.length) { res.verdict = "giusto"; return res; }
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
    // Slips only (accents, typos): close enough.
    res.verdict = res.slip ? "quasi" : "sbagliato";
    return res;
  }

  /* A wrong option in a multiple-choice question: explain why *that* option
     is wrong (response-specific feedback). */
  function explainChoice(chosen, answer, ctx) {
    ctx = ctx || {};
    // «esquisito» = raro / exquisito / aburrido: the options are Spanish
    // meanings, not Portuguese to diagnose.
    var gloss = /«([^»]+)»\s*=\s*$/.exec(String(ctx.stem || "")) || (/=\s*$/.test(String(ctx.stem || "")) ? [] : null);
    if (gloss) {
      var w = String(gloss[1] || "").toLowerCase(), fa = w && (FALSOS[w] || DATA.falsi[w]);
      if (!fa || !fa[0]) return null;
      var d0 = { verdict: "sbagliato", cat: "falso_amigo", label: LABEL.falso_amigo, slip: false,
        hint: it(w) + " se parece a una palabra del español, pero no significa lo mismo.",
        explain: it(w) + " en portugués significa «" + fa[0] + "»" + (deaccent(String(chosen).toLowerCase()) === deaccent(w) ? ", no «" + chosen + "»" : "") + "." + (fa[2] ? " " + fa[2] : ""),
        given: [{ w: String(chosen), bad: true }], fixed: [{ w: String(answer), fix: true }], others: 0, all: ["falso_amigo"], target: answer };
      return d0;
    }
    var c2 = {};
    Object.keys(ctx).forEach(function (k) { c2[k] = ctx[k]; });
    c2.choice = true;
    var d = diagnose(chosen, [answer], c2);
    return d.verdict === "giusto" ? null : d;
  }

  /* --------------------------------------------------------------- datos */

  function init(bank) {
    bank = bank || {};
    DATA.esPt = dict(bank.esPt || bank.esIt);
    DATA.falsi = dict(bank.falsi);
    DATA.spelling = (bank.spelling || []).slice().sort(function (a, b) {
      return String(b[0]).length - String(a[0]).length;
    });
    DATA.lex = dict();
    DATA.nouns = dict();
    DATA.nounsByPlural = dict();
    (bank.nouns || []).forEach(function (n) {
      if (!n || !n[0]) return;
      var x = { s: n[0], g: n[1], pl: n[2], es: n[3], note: n[6] };
      DATA.nouns[n[0]] = x;
      if (n[2]) DATA.nounsByPlural[n[2]] = x;
      DATA.lex[n[0]] = n[3];
      if (n[2] && !DATA.lex[n[2]]) DATA.lex[n[2]] = n[3];
    });
    DATA.adj = dict();
    (bank.adjectives || []).forEach(function (a) {
      for (var i = 0; i < 4; i++) { if (!a[i]) continue; if (!DATA.lex[a[i]]) DATA.lex[a[i]] = a[4]; DATA.adj[a[i]] = a[0]; }
    });
    (bank.words || []).forEach(function (w) {
      var k = String(w[0] || "").toLowerCase();
      if (k && !DATA.lex[k] && k.indexOf(" ") < 0) DATA.lex[k] = w[1];
    });
    var K = C();
    DATA.verbs = dict();
    (bank.verbs || []).forEach(function (v) {
      if (!v || !v[0]) return;
      DATA.verbs[String(v[0]).replace(/-se$/, "")] = true;
      if (K && typeof K.register === "function" && !v[4]) { try { K.register(v[0], { es: v[1] }); } catch (e) { /* */ } }
      DATA.lex[v[0]] = v[1];
    });
    VIDX = null;   // rebuild with the new verbs on first use
  }

  /* El cuaderno del portuñol: las interferencias del español que más se
     fosilizan (Almeida Filho 1995; Grannier 2002; Durão 1999), con una
     línea que las recuerda. */
  var PORTUNOL = [
    ["espanol", "palabras del español: tengo, pero, muy, hasta, también"],
    ["contraccion", "contracciones: no, na, do, dele, pelo (nunca «em o»)"],
    ["gostar", "gostar de: eu gosto de café (el que gusta es el sujeto)"],
    ["muito", "muito, nunca «muy»: muito bonito, muitas pessoas"],
    ["a_personal", "sin «a» personal: vi o João, visitei meus avós"],
    ["perfeito_composto", "«he comido» = comi; tenho comido = vengo comiendo"],
    ["futuro_subj", "futuro do subjuntivo: quando eu for, se eu tiver"],
    ["inf_pessoal", "infinitivo pessoal: para eles saberem"],
    ["genero", "heterogenéricos: o leite, a árvore, a viagem, o nariz"],
    ["crase", "crase: vou à praia, às três"],
    ["nasal", "nasales: não, mãe, bom, também"],
    ["falso_amigo", "falsos amigos: esquisito, polvo, borracha, oficina"],
    ["regencia", "verbo + preposición: pensar em, sonhar com, namorar alguém"],
    ["pronome", "pronombres: para mim, comigo, eu o vi / vi ele"]
  ];

  /* Groups of categories for the app: what is only vocabulary, what is a
     slip, what says little about grammar. */
  var GROUPS = {
    lexical: dict({ lexico: 1, espanol: 1, falso_amigo: 1, vuoto: 1 }),
    slips: dict({ tilde: 1, tipeo: 1 }),
    generic: dict({ lexico: 1, faltante: 1, sobrante: 1, tipeo: 1, vuoto: 1 }),
    unrecorded: dict({ tipeo: 1, vuoto: 1 })
  };

  var api = {
    PORTUNOL: PORTUNOL,
    GROUPS: GROUPS,
    tokens: tokens,
    align: align,
    diagnose: diagnose,
    explainChoice: explainChoice,
    REGISTRO: REGISTRO,
    registerOf: registerOf,
    addWords: addWords,
    knownWord: knownWord,
    capa: capa,
    init: init,
    LABEL: LABEL,
    SEVERITY: SEVERITY,
    verbForms: verbForms,
    participleOf: participleOf,
    DATA: DATA,
    // For the free-writing checker (scrivi.js): the same tables and tests.
    util: {
      ARTICLES: ARTICLES, CLITICS: CLITICS, SUBJECTS: SUBJECTS, POSSESSIVE: POSSESSIVE, FAMILY: FAMILY,
      TER: TER, HAVER: HAVER, SER: SER, CONTR: CONTR, PREP_BASE: PREP_BASE, REGENCIA: REGENCIA, FALSOS: FALSOS,
      HETERO: HETERO, HETERO_ES: HETERO_ES, ES_PT: ES_PT, PLACE_ART: PLACE_ART,
      prepInfo: prepInfo, contract: contract, isPortuguese: isPortuguese, isItalian: isPortuguese,
      spanishWord: spanishWord, looksSpanish: looksSpanish, isInfinitive: isInfinitive, gerundOf: gerundOf,
      nounGender: nounGender, regularForm: regularForm, splitEnclitic: splitEnclitic,
      deaccent: deaccent, degeminate: degeminate, editDistance: editDistance, lexConfusion: lexConfusion,
      pluralExplain: pluralExplain
    }
  };

  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Diagnosi = api;
})(typeof window !== "undefined" ? window : globalThis);
