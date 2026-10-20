/*
 * La revisión de las correcciones, a escala (italiano).
 *
 * Toma todo lo que el estudiante escribe o elige en el curso —los
 * ejercicios de las 52 semanas (course.json, que ya incluye los de Dummies y
 * Routledge), las oraciones del banco, las frases de conversación y las
 * opciones de las preguntas de opción múltiple— y les inyecta los errores
 * que comete un hispanohablante: la palabra en español, la doble, la tilde,
 * la vocal final, el artículo, la persona, el tiempo, el auxiliar, la
 * concordancia del participio, el infinitivo sin conjugar, la preposición,
 * el pronombre, la consigna copiada, el orden y el tipeo.  Pasa cada
 * respuesta por Diagnosi.diagnose (o explainChoice) y por Devolucion.tidy
 * con la semana del ejercicio, como la app, y busca familias de devoluciones
 * malas: texto roto, pista que da la respuesta, pista vaga, metalenguaje que
 * todavía no se enseñó, «tipeo» para lo que es gramática, marca en la
 * palabra equivocada, categoría que no corresponde, respuesta correcta
 * rechazada.
 *
 *   node tools/it/diag_review.js            resumen por familia
 *   node tools/it/diag_review.js --show F   ejemplos de la familia F
 *   node tools/it/diag_review.js --matrix   tipo de error → categoría
 *   node tools/it/diag_review.js --sample T muestras del tipo de error T
 *   node tools/it/diag_review.js --json F   vuelca todos los casos a F
 *
 * Además de las familias de devoluciones malas mide la utilidad (C3, C11
 * de la auditoría 2026-09-v3): el porcentaje de explicaciones «vacías» (dicen
 * qué pero no por qué: «Acá va X», «Sobra X», «El orden es: X»…), el de
 * explicaciones con contraste con el español por categoría, las reglas
 * falsas probables («no es una palabra italiana» de una palabra que está en
 * el léxico de frecuencias) y las variantes válidas generadas por
 * test_variantes.js que se rechazan.  Las aceptaciones correctas (otra forma
 * válida, el género de quien habla) van aparte y no cuentan como «no visto».
 */
"use strict";
var pack = require("../lib/pack.js");
var ctx = pack("it");
var D = ctx.Diagnosi, DV = ctx.Devolucion, Conj = ctx.Conj, Banca = ctx.Banca;
var bank = pack.data("it", "bank.json");
Banca.load(bank);
// the frequency lexicon (as in the app, where it loads with the course)
if (ctx.Freq) ctx.Freq.load(pack.data("it", "frequenza.json"));
var course = pack.data("it", "course.json");
var U = D.util;

var argv = process.argv.slice(2);
function arg(k) { var i = argv.indexOf(k); return i >= 0 ? (argv[i + 1] || true) : null; }

/* ------------------------------------------------------------ semana */

var WEEK = {};
course.weeks.forEach(function (w) {
  w.items.forEach(function (id) { if (WEEK[id] == null || WEEK[id] > w.week) WEEK[id] = w.week; });
});

/* ------------------------------------------------------- mutaciones */

var IT_ES = {
  il: "el", lo: "el", i: "los", gli: "los", le: "las", di: "de", che: "que", "è": "es", e: "y",
  per: "para", in: "en", molto: "muy", anche: "también", ma: "pero", "perché": "porque",
  quando: "cuando", dove: "donde", questo: "este", questa: "esta", sempre: "siempre", mai: "nunca",
  non: "no", "più": "más", oggi: "hoy", ieri: "ayer", domani: "mañana", adesso: "ahora", sono: "son",
  tutto: "todo", tutti: "todos", niente: "nada", qui: "aquí", dopo: "después", prima: "antes",
  bene: "bien", grazie: "gracias", con: "con", come: "como", cosa: "cosa", io: "yo", noi: "nosotros"
};
(bank.nouns || []).forEach(function (n) {
  var es = String(n[3]).split(/[\/,;(]/)[0].trim().toLowerCase();
  if (es && es.indexOf(" ") < 0 && es !== n[0] && !IT_ES[n[0]]) IT_ES[n[0]] = es;
});

var ART = ["il", "lo", "l'", "la", "i", "gli", "le", "un", "uno", "una", "un'"];
var ART_SWAP = { il: ["lo", "la"], lo: ["il"], "l'": ["il", "lo", "la"], la: ["il", "le"], i: ["gli", "le"],
                 gli: ["i", "le"], le: ["la", "i"], un: ["uno", "una", "un'"], uno: ["un"], una: ["un", "un'"], "un'": ["un", "una"] };
var PREP_SWAP = { a: ["in", "da"], in: ["a"], da: ["di", "a"], di: ["da", "de"], al: ["nel", "a il"], alla: ["nella", "a la"],
                  nel: ["al", "in il"], nella: ["alla", "in la"], del: ["dal", "de il"], della: ["dalla", "de la"],
                  dal: ["del", "da il"], dalla: ["della"], sul: ["su il"], per: ["para"], ai: ["a i"], dei: ["de i"] };
var CLI_SWAP = { lo: ["gli", "la", "le"], la: ["le", "lo", "gli"], li: ["gli", "le", "lo"], le: ["gli", "la"],
                 gli: ["le", "lo", "li"], ne: [""], ci: [""], glielo: ["gli lo", "le lo", "se lo"], gliela: ["le la", "se la"],
                 me: ["mi"], te: ["ti"], ce: ["ci"], mi: ["me"], ti: ["te"] };
var TENSES = ["presente", "imperfetto", "futuro", "condizionale", "congiuntivo", "congImperfetto", "passatoRemoto"];

function forms(lemma, tense) {
  try { return Conj.conjugate(lemma, tense).map(function (x) { return x.split(" ").pop(); }); } catch (e) { return null; }
}
function core(t) { return t.replace(/^[«"¿¡(]+|[.,;:!?»")…]+$/g, ""); }
function isAux(w) { return U.AVERE.indexOf(w) >= 0 || U.ESSERE.indexOf(w) >= 0; }

// ans: the answer string.  Returns [{type, given, word, dropped}]
function mutate(ans, opts) {
  opts = opts || {};
  var toks = String(ans).split(/\s+/), out = [];
  var seen = {};
  function put(type, i, repl, info) {
    var copy = toks.slice(), w = core(toks[i]);
    var cased = /^[A-ZÀ-Ý]/.test(w) && repl ? repl.charAt(0).toUpperCase() + repl.slice(1) : repl;
    copy[i] = repl === "" ? "" : toks[i].replace(w, cased);
    var g = copy.filter(Boolean).join(" ");
    if (g === ans || seen[type + g]) return;
    seen[type + g] = 1;
    out.push({ type: type, given: g, word: repl === "" ? null : cased.toLowerCase(), orig: w.toLowerCase(), dropped: repl === "" ? w.toLowerCase() : null, info: info || "" });
  }
  toks.forEach(function (t, i) {
    var w = core(t), low = w.toLowerCase(), prev = core(toks[i - 1] || "").toLowerCase(), next = core(toks[i + 1] || "").toLowerCase();
    if (!low || /\d/.test(low)) return;
    // Spanish word
    if (IT_ES[low] && IT_ES[low] !== low) put("es_word", i, IT_ES[low]);
    // double consonant
    if (/([bcdfglmnprstvz])\1/.test(low) && low.length > 3) put("doppie_meno", i, low.replace(/([bcdfglmnprstvz])\1/, "$1"));
    else if (low.length >= 5 && /[aeiou][bcdfglmnprtv][aeiou]/.test(low) && D.DATA.lex[low]) put("doppie_piu", i, low.replace(/([aeiou])([bcdfglmnprtv])([aeiou])/, "$1$2$2$3"));
    // accent
    if (/[àèéìòù]/.test(low)) put("accento", i, U.deaccent(low));
    // final vowel (gender / number) on nouns, adjectives, participles
    var nominal = D.DATA.adj[low] || D.DATA.nouns[low] || D.DATA.nounsByPlural[low] || D.participleOf(low);
    if (nominal && low.length > 3 && /[oaie]$/.test(low) && !U.ARTICLES[low]) {
      var sw = { o: "a", a: "o", i: "e", e: "i" }[low.slice(-1)];
      put("vocale_finale", i, low.slice(0, -1) + sw);
      var num = { o: "i", a: "e", i: "o", e: "a" }[low.slice(-1)];
      put("numero", i, low.slice(0, -1) + num);
    }
    // articles
    if (ART_SWAP[low] && (ART.indexOf(low) < 0 || !/^(lo|la|le|gli|li)$/.test(low) || (next && !D.verbForms(next).length && !isAux(next)))) {
      ART_SWAP[low].forEach(function (r) {
        if (r.slice(-1) === "'" ) return;   // the apostrophe needs the next word glued
        put("articolo", i, r);
      });
    }
    // prepositions
    if (PREP_SWAP[low]) PREP_SWAP[low].forEach(function (r) { put(r.indexOf(" ") > 0 ? "prep_sciolta" : "preposizione", i, r); });
    // clitics before a verb
    if (CLI_SWAP[low] && (D.verbForms(next).length || isAux(next) || /^(lo|la|li|le|ne)$/.test(next))) {
      CLI_SWAP[low].forEach(function (r) { put(r === "" ? "clitico_manca" : "clitico", i, r); });
    }
    // verbs
    var vf = D.verbForms(low);
    // a noun after an article, a preposition or a possessive is not a verb to conjugate
    var nounHere = (D.DATA.nouns[low] || D.DATA.nounsByPlural[low]) && (U.ARTICLES[prev] || U.prepInfo(prev) || U.POSSESSIVE.indexOf(prev) >= 0);
    if (!nounHere && vf.length && low.length > 1 && !U.ARTICLES[low] && !D.participleOf(low) && !(U.CLITICS.indexOf(low) >= 0)) {
      var f = vf[0];
      var all = forms(f.lemma, f.tense);
      if (all) {
        var other = all[(f.p + 3) % 6];
        if (other && other !== low) put("persona", i, other, f.lemma + " " + f.tense + " " + f.p + "→" + ((f.p + 3) % 6));
        var other2 = all[f.p === 2 ? 0 : 2];
        if (other2 && other2 !== low) put("persona", i, other2, f.lemma + " " + f.tense);
      }
      TENSES.forEach(function (t) {
        if (t === f.tense) return;
        var fs = forms(f.lemma, t);
        if (fs && fs[f.p] && fs[f.p] !== low && (t !== "passatoRemoto" || opts.week >= 37)) put("tempo", i, fs[f.p], f.tense + "→" + t);
      });
      if (!isAux(low) || !D.participleOf(next)) {
        if (i > 0 || toks.length > 1) put("infinito", i, f.lemma);
      }
      // imperfetto → passato prossimo
      if (f.tense === "imperfetto") {
        try {
          var info = Conj.info(f.lemma), pp = Conj.participle(f.lemma);
          var aux = forms(info.aux === "essere" ? "essere" : "avere", "presente")[f.p];
          put("pp_per_imperfetto", i, aux + " " + pp);
        } catch (e) { /* */ }
      }
    }
    // auxiliary
    if (isAux(low) && D.participleOf(next)) {
      var a = D.verbForms(low).filter(function (x) { return x.lemma === "avere" || x.lemma === "essere"; })[0];
      if (a) {
        var otherAux = forms(a.lemma === "avere" ? "essere" : "avere", a.tense);
        if (otherAux && otherAux[a.p]) put("ausiliare", i, otherAux[a.p]);
        // passato prossimo → imperfetto
        var lem = D.participleOf(next), imp = forms(lem, "imperfetto");
        if (imp && a.tense === "presente") {
          var copy = toks.slice(); copy[i] = toks[i].replace(core(toks[i]), imp[a.p]); copy.splice(i + 1, 1);
          out.push({ type: "imperfetto_per_pp", given: copy.join(" "), word: imp[a.p], orig: low });
        }
      }
    }
    // participle agreement
    if (D.participleOf(low) && isAux(prev) && /[oaie]$/.test(low)) {
      var alt = low.slice(0, -1) + ({ o: "a", a: "o", i: "e", e: "i" }[low.slice(-1)]);
      put("accordo_participio", i, alt);
    }
    // typo
    if (low.length >= 6 && /^[a-z]+$/.test(low)) {
      var k = 2 + (low.length % 3);
      put("tipeo", i, low.slice(0, k) + low[k + 1] + low[k] + low.slice(k + 2));
      put("tipeo", i, low.slice(0, k) + low.slice(k + 1));
    }
  });
  // word order: two adjacent words swapped
  if (toks.length >= 3) {
    var j = Math.floor(toks.length / 2) - 1;
    var sw2 = toks.slice(); var tmp = sw2[j]; sw2[j] = sw2[j + 1]; sw2[j + 1] = tmp;
    if (sw2.join(" ") !== ans) out.push({ type: "orden", given: sw2.join(" "), word: null });
  }
  return out;
}

/* ----------------------------------------------------------- casos */

var CASES = [];
function add(src, id, week, ans, accept, dctx, m, kind) {
  CASES.push({ src: src, id: id, week: week, answer: ans, accept: accept, ctx: dctx, m: m, kind: kind || "write" });
}

var WRITE_TYPES = { cloze: 1, translate: 1, conjugate: 1, typed: 1, garden: 1, combina: 1, plural: 1, qa: 1, numbers: 1, listen: 1, fixerr: 1 };
var items = course.items;
Object.keys(items).forEach(function (id) {
  var it = items[id];
  var week = WEEK[id] || it.w || 52;
  var accept = (it.accept && it.accept.length ? it.accept : [it.answer]).map(function (x) { return String(x).replace(/\s*\|\s*/g, " "); });
  var dctx = { stem: it.stem, prompt: it.prompt, nominal: it.type === "plural" || /plural/i.test(it.prompt || ""), week: week };
  if (WRITE_TYPES[it.type] && it.answer && it.dir !== "it-es") {
    var ans = String(it.answer).replace(/\s*\|\s*/g, " ");
    mutate(ans, { week: week }).forEach(function (m) { add("course:" + it.type, id, week, ans, accept, dctx, m); });
    if (it.type === "translate" && it.stem && !/_{3}/.test(it.stem)) add("course:" + it.type, id, week, ans, accept, dctx, { type: "copia_consigna", given: it.stem, word: null });
    if (it.type === "garden" && it.trap) add("course:garden", id, week, ans, accept, dctx, { type: "trampa", given: it.trap, word: null });
    // accepted alternatives must be accepted
    accept.forEach(function (a) { add("course:" + it.type, id, week, ans, accept, dctx, { type: "variante", given: a, word: null }); });
  }
  if (it.type === "choice" && it.options && it.options.length > 1 && it.src !== "banca" && it.src !== "lab" &&
      it.src !== "lettura" && it.src !== "vocab" && it.src !== "ascolto" && it.topic !== "esame") {
    it.options.forEach(function (o) {
      if (o === it.answer || (it.accept || []).indexOf(o) >= 0) return;
      add("course:choice", id, week, it.answer, [it.answer], { stem: it.stem, nominal: dctx.nominal, week: week },
          { type: "opcion", given: o, word: null }, "choice");
    });
  }
});

bank.sentences.forEach(function (s, si) {
  var week = s.w || 52;
  mutate(s.it[0], { week: week }).forEach(function (m) { add("bank:translate", "s" + si, week, s.it[0], s.it, { stem: s.es, week: week }, m); });
  add("bank:translate", "s" + si, week, s.it[0], s.it, { stem: s.es, week: week }, { type: "copia_consigna", given: s.es, word: null });
  if (s.gap) {
    var gi = Banca.gapItem(si);
    if (gi) mutate(gi.answer, { week: week }).forEach(function (m) {
      add("bank:gap", "g" + si, week, gi.answer, gi.accept || [gi.answer], { stem: gi.stem, prompt: gi.prompt, week: week }, m);
    });
  }
});
bank.errors.forEach(function (e, ei) {
  add("bank:error", "e" + ei, e.w || 52, e.right, [e.right], { week: e.w || 52 }, { type: "error_banco:" + e.cat, given: e.wrong, word: e.bad ? String(e.bad).toLowerCase() : null });
});
ctx.FRASI_DATA.SCENES.forEach(function (sc) {
  sc.phrases.forEach(function (p, pi) {
    var week = sc.week || 1;
    mutate(p[0], { week: week }).forEach(function (m) { add("frasi", sc.id + pi, week, p[0], [p[0]], { stem: p[1], prompt: "Escribilo", week: week }, m); });
    add("frasi", sc.id + pi, week, p[0], [p[0]], { stem: p[1], week: week }, { type: "copia_consigna", given: p[1], word: null });
  });
});

/* The valid variants and the wrong controls of test_variantes.js, judged
   like the other cases (families valida_rechazada / control_aceptado). */
var VAR = require("./test_variantes.js");
VAR.SRC.forEach(function (src) {
  var dctx = { stem: src.stem, prompt: src.prompt, week: src.week };
  VAR.valid(src).forEach(function (v) { add("variantes", src.id, src.week, src.answer, src.accept || [src.answer], dctx, { type: "generada:" + v.fam, given: v.given, word: null }); });
  VAR.control(src).forEach(function (v) { add("variantes", src.id, src.week, src.answer, src.accept || [src.answer], dctx, { type: "control:" + v.fam, given: v.given, word: null }); });
});

/* ---------------------------------------------------------- juzgar */

var EXPECT = {
  es_word: ["parola_spagnola", "falso_amico"],
  doppie_meno: ["doppie"], doppie_piu: ["doppie"], accento: ["accento"],
  vocale_finale: ["accordo", "genere", "plurale", "participio_accordo", "persona_verbale", "articolo"],
  numero: ["accordo", "genere", "plurale", "participio_accordo", "persona_verbale", "articolo"],
  articolo: ["articolo", "genere", "accordo", "articolo_possessivo"],
  preposizione: ["preposizione", "preposizione_articolata", "a_personale", "parola_spagnola"],
  prep_sciolta: ["preposizione_articolata", "parola_spagnola"],
  clitico: ["pronome", "ci_ne", "posizione_pronome"], clitico_manca: ["pronome", "ci_ne"],
  persona: ["persona_verbale", "piacere", "ci_ne"],
  // (a tense not taught yet, or a congiuntivo nothing asks for, is read as the ending: persona_verbale)
  tempo: ["tempo_verbale", "congiuntivo", "condizionale", "periodo_ipotetico", "persona_verbale"],
  pp_per_imperfetto: ["tempo_verbale"], imperfetto_per_pp: ["tempo_verbale"],
  infinito: ["persona_verbale"], ausiliare: ["ausiliare"], accordo_participio: ["participio_accordo", "accordo"],
  tipeo: ["refuso", "ortografia", "doppie", "accento"], orden: ["ordine", "posizione_pronome"],
  copia_consigna: ["parola_spagnola"]
};
var GRAMMAR_TYPES = { vocale_finale: 1, numero: 1, articolo: 1, preposizione: 1, persona: 1, tempo: 1, ausiliare: 1,
  accordo_participio: 1, infinito: 1, clitico: 1, pp_per_imperfetto: 1, imperfetto_per_pp: 1 };
var VAGUE = /^(Revisá el pronombre marcado\.|La palabra marcada no es la que va\.|Revisá el artículo\.|Revisá el género\.|Sobra una palabra\.|Revisá el verbo marcado: forma y tiempo\.|Revisalo\.?)$/;
var NO_WHY = /^(Acá va \*[^*]+\*(, no \*[^*]+\*)?\.|Sobra \*[^*]+\*\.|Falta \*[^*]+\*( después de \*[^*]+\*)?\.|Error de tipeo: \*[^*]+\*\.|Se escribe \*[^*]+\*\.|El orden es: \*[^*]+\*\.)$/;
// Explanations that say what and not why (only the form): the templates the
// audit counted as empty.  A slip (typo, accent) may be short: it is left out.
var EMPTY = [
  /^Acá va \*[^*]+\*( \(«[^»]*»\))?(, no \*[^*]+\*( \(«[^»]*»\))?)?\.$/, /^Sobra \*[^*]+\*\.$/, /^Falta \*[^*]+\*( después de \*[^*]+\*)?\.$/,
  /^Se escribe \*[^*]+\*\.$/, /^(En italiano el orden es|El orden es): \*[^*]+\*\.$/, /^Estas dos palabras van al revés: \*[^*]+\*, no \*[^*]+\*\.$/,
  /^\*[^*]+\* es el plural; acá va el singular \*[^*]+\*\.$/, /^Plural: \*[^*]+\* → \*[^*]+\*\.$/,
  /^\*[^*]+\* es [a-zà-ú ]+; acá va [a-zà-ú ]+: \*[^*]+\*\.$/, /^\*[^*]+\* es [a-zà-ú ]+ \([^)]*\); acá va \*[^*]+\*, [a-zà-ú ]+ \([^)]*\)\.$/,
  /^El italiano usa acá \*[^*]+\*, no \*[^*]+\*\. Las preposiciones no se traducen una a una/, /^Acá no va artículo: sobra \*[^*]+\*\.$/,
  /^La forma es \*[^*]+\*(, en (plural|singular))?: la vocal final marca el género y el número \(-o \/ -a en singular, -i \/ -e en plural\)\.$/, /^Acá va el (artículo determinado|indeterminado): \*[^*]+\*\.$/,
  /^Acá va \*[^*]+\* \((masculino|femenino)\), no \*[^*]+\*\.$/, /^Acá va la preposición \*[^*]+\*( \(con el artículo incorporado\))?\.$/,
  /^Acá va un tiempo compuesto: \*[^*]+\*\.$/, /^Acá va \*[^*]+\* \(auxiliar \+ participio\), no \*[^*]+\*\.$/,
  /^Los tiempos compuestos llevan auxiliar \+ participio: \*[^*]+\*\.$/, /^Falta \*non\* delante del verbo\.$/,
  /^\*[^*]+\* no es una palabra italiana\. Acá va \*[^*]+\*( \(«[^»]*»\))?\.$/,
  /^\*[^*]+\* es otra palabra( \(«[^»]*»\))?\. Acá va \*[^*]+\*\.$/, /^Acá va \*[^*]+\* sin artículo\.$/
];
function empty(x) { return EMPTY.some(function (re) { return re.test(String(x || "").trim()); }); }
var ES_CONTRAST = /español|castellano|«/;
// «X no es una palabra italiana», «X no existe», «X no es italiano»: the word cited
var NOT_A_WORD = /^\*([^*]+)\* (no es una palabra italiana|no existe|no es italiano)/;
// Metalanguage and the week that teaches it (after Devolucion.tidy).
var META = [
  [/\bparticipio\b/i, 11], [/\bauxiliar\b/i, 11], [/\bgerundio\b/i, 44], [/\bimperativo\b/i, 12],
  [/\breflexiv/i, 12], [/\bcongiuntivo\b/i, 24], [/\bcondizionale\b/i, 20], [/\bimperfetto\b/i, 15],
  [/\bpassato remoto\b/i, 37], [/\bpassato prossimo\b/i, 11], [/\bperíodo hipotético|periodo hipotético/i, 33],
  [/\bpronombres? combinad/i, 22], [/\brelativo\b/i, 34], [/\bátono|tónico/i, 10], [/\bobjeto (in)?directo\b/i, 10],
  // (a Spanish name with its example, «subjuntivo (como «que haga»)», is the plain wording Devolucion gives)
  [/\bfuturo\b(?! (\(como|compuesto))/i, 19], [/\bsubjuntivo\b(?! (\(como|pasado|compuesto|pluscuamperfecto))/i, 24],
  [/\bcondicional\b(?! (\(como|compuesto))/i, 20], [/\bindicativo\b/i, 24]
];

function tokensOf(s) { return D.tokens(s); }

var FAM = {};
function flag(f, c, extra) {
  var x = FAM[f] || (FAM[f] = { n: 0, ex: [] });
  x.n++;
  if (x.ex.length < 400) x.ex.push(Object.assign({ f: f }, c, extra || {}));
}

var results = [];
CASES.forEach(function (c) {
  var d;
  try {
    d = c.kind === "choice" ? D.explainChoice(c.m.given, c.answer, c.ctx) : D.diagnose(c.m.given, c.accept, c.ctx);
  } catch (e) { flag("excepcion", c, { err: String(e.stack).slice(0, 300) }); return; }
  if (!d) d = { verdict: "giusto" };
  var far = d.verdict !== "giusto" && DV.far(c.m.given, c.kind === "choice" ? [c.answer] : c.accept, d);
  if (d.verdict !== "giusto") DV.tidy(d, c.week);
  var r = { src: c.src, id: c.id, week: c.week, type: c.m.type, given: c.m.given, answer: c.answer, stem: c.ctx.stem,
            cat: d.cat, verdict: d.verdict, label: d.label, hint: d.hint, explain: d.explain, far: far,
            bad: (d.given || []).filter(function (t) { return t.bad; }).map(function (t) { return t.w; }),
            fix: (d.fixed || []).filter(function (t) { return t.fix; }).map(function (t) { return t.w; }), all: d.all };
  results.push(r);
  var t = c.m.type;
  r.level = d.level; r.note = d.note;
  if (t === "variante") { if (d.verdict !== "giusto") flag("variante_rechazada", r); return; }
  if (/^generada:/.test(t)) { if (d.verdict !== "giusto") flag("valida_rechazada:" + t.slice(9), r); return; }
  if (/^control:/.test(t)) { if (d.verdict === "giusto") flag("control_aceptado:" + t.slice(8), r); return; }
  if (d.verdict === "giusto") {
    // another valid way of saying it, or the speaker's own gender: right, not unseen
    if (d.level === "aceptable" || d.level === "poco_natural") flag("aceptada:" + d.level + ":" + t, r);
    else if (d.note) flag("aceptada_genero:" + t, r);
    else if (t !== "opcion" && t !== "orden" && !/^error_banco/.test(t)) flag("no_visto:" + t, r);
    return;
  }
  if (far && d.cat !== "parola_spagnola") return;    // the app shows the model, not the diagnosis
  var txt = (d.hint || "") + " || " + (d.explain || "") + " || " + (d.label || "");
  // broken text
  if (/undefined|NaN|\bnull\b|\[object/.test(txt)) flag("roto:undefined", r);
  var bodyTxt = (d.hint || "") + " " + (d.explain || "");
  if (/\(\s*\)|\s[.,;:](?!\.)|[^.]\.\.(?!\.)|«\s*»/.test(bodyTxt) ||
      bodyTxt.split("*").some(function (seg, k) { return k % 2 === 1 && (!seg.trim() || /^\s|\s$/.test(seg)); })) flag("roto:markdown", r);
  if (((d.hint || "").match(/\*/g) || []).length % 2 || ((d.explain || "").match(/\*/g) || []).length % 2) flag("roto:asteriscos", r);
  var dbl = /(^|[\s(«])([a-zà-ùñ']{2,})\s+\2(?=[\s.,;:)»]|$)/i.exec(((d.hint || "") + " " + (d.explain || "")).replace(/\*[^*]*\*/g, "§"));
  if (dbl && !/^(che|no|sì|là)$/i.test(dbl[2])) flag("roto:duplicado", r, { dup: dbl[2] });
  if (/\b(tienes|puedes|debes|escribes|sabes)\b|(^|[.!?¿|] *)(Revisa|Mira|Fíjate|Piensa|Escribe|Intenta)\b|\btú\b/.test(txt)) flag("no_voseo", r);
  if (!d.hint || !d.explain) flag("sin_texto", r);
  // hint that gives the answer away
  var leak = r.fix.filter(function (w) { return w.length > 2 && r.bad.indexOf(w) < 0 && (d.hint || "").toLowerCase().indexOf("*" + w + "*") >= 0; });
  if (leak.length && d.cat !== "comparativo" && d.cat !== "parola_spagnola") flag("pista_revela", r, { leak: leak });
  if (VAGUE.test(d.hint || "") && (GRAMMAR_TYPES[t] || t === "clitico_manca")) flag("pista_vaga", r);
  if (NO_WHY.test(d.explain || "") && GRAMMAR_TYPES[t]) flag("sin_porque", r);
  // every category, not only the grammar mutations: an empty explanation
  if (!d.slip && empty(d.explain)) flag("vacia:" + d.cat, r);
  var nw = NOT_A_WORD.exec(d.explain || "");
  if (nw && ctx.Freq && ctx.Freq.info(nw[1].toLowerCase())) flag("regla_falsa_probable:no_es_palabra", r, { word: nw[1] });
  // metalanguage before its week
  META.forEach(function (mm) {
    var plainTxt = ((d.hint || "") + " " + (d.explain || "") + " " + (d.label || "")).replace(/\*[^*]*\*/g, " ");
    // (a term with its gloss, «auxiliar (el verbo que arma el pasado…)», is presented)
    var glossed = new RegExp(mm[0].source + "s? \\(", "i").test(plainTxt);
    if (c.week < mm[1] && mm[0].test(plainTxt) && !glossed) flag("meta_temprana:" + mm[0].source.replace(/\\b|\\/g, ""), r);
  });
  // category
  var exp = EXPECT[t];
  if (exp && exp.indexOf(d.cat) < 0) flag("categoria:" + t + "→" + d.cat, r);
  if (d.cat === "refuso" && GRAMMAR_TYPES[t]) flag("tipeo_para_gramatica", r);
  if (t === "tipeo" && ["refuso", "ortografia", "doppie", "accento"].indexOf(d.cat) < 0 && d.cat !== "lessico") flag("gramatica_para_tipeo", r);
  // diff marks the mutated word
  if (c.kind !== "choice" && c.m.word && r.bad.length && r.bad.indexOf(c.m.word.split(" ")[0]) < 0 &&
      tokensOf(c.m.word).every(function (w) { return r.bad.indexOf(w) < 0; })) flag("diff_equivocado", r, { mut: c.m.word });
});

/* ---------------------------------------------------------- informe */

var fams = Object.keys(FAM).sort(function (a, b) { return FAM[b].n - FAM[a].n; });
if (arg("--json")) require("fs").writeFileSync(arg("--json"), JSON.stringify({ results: results, fam: FAM }, null, 1));
if (arg("--matrix")) {
  var M = {};
  results.forEach(function (r) { var k = r.type.replace(/:.*/, "") + " → " + (r.verdict === "giusto" ? "(giusto)" : r.far && r.cat !== "parola_spagnola" ? "(lejos)" : r.cat); M[k] = (M[k] || 0) + 1; });
  Object.keys(M).sort().forEach(function (k) { console.log(("      " + M[k]).slice(-6) + "  " + k); });
} else if (arg("--show")) {
  var want = arg("--show"), lim = +(arg("--n") || 25);
  fams.filter(function (f) { return f.indexOf(want) === 0; }).forEach(function (f) {
    console.log("== " + f + " (" + FAM[f].n + ")");
    FAM[f].ex.slice(0, lim).forEach(function (r) {
      console.log("  [" + r.src + " " + r.id + " s" + r.week + "] " + r.type + ": «" + r.given + "» → «" + r.answer + "»" + (r.stem ? "  (stem: " + String(r.stem).slice(0, 60) + ")" : ""));
      console.log("     " + r.cat + " | " + r.label + " | bad=" + r.bad.join(",") + " fix=" + r.fix.join(",") + (r.leak ? " leak=" + r.leak : "") + (r.mut ? " mut=" + r.mut : ""));
      console.log("     H: " + r.hint);
      console.log("     E: " + r.explain);
    });
  });
} else if (arg("--sample")) {
  var T = arg("--sample"), n = +(arg("--n") || 30), seen = {};
  results.filter(function (r) { return r.type === T && r.verdict !== "giusto"; }).forEach(function (r) {
    var k = r.cat + "|" + (r.explain || "").replace(/\*[^*]*\*/g, "*").slice(0, 60);
    seen[k] = seen[k] || [];
    seen[k].push(r);
  });
  Object.keys(seen).sort(function (a, b) { return seen[b].length - seen[a].length; }).slice(0, n).forEach(function (k) {
    var r = seen[k][0];
    console.log("(" + seen[k].length + ") [s" + r.week + "] «" + r.given + "» → «" + r.answer + "»  " + r.cat);
    console.log("     H: " + r.hint);
    console.log("     E: " + r.explain);
  });
} else {
  console.log("casos: " + CASES.length + " (" + results.filter(function (r) { return r.verdict !== "giusto"; }).length + " vistos como error)");
  var groups = {};
  fams.forEach(function (f) { var g = f.replace(/:.*/, ""); groups[g] = (groups[g] || 0) + FAM[f].n; });
  // usefulness: empty explanations and contrast with Spanish (C3, C5, C11)
  var shown = results.filter(function (r) { return r.verdict !== "giusto" && !(r.far && r.cat !== "parola_spagnola") && r.explain &&
    !/^(generada|control|variante)/.test(r.type); });
  var noSlip = shown.filter(function (r) { return ["refuso", "accento", "soggetto", "vuoto"].indexOf(r.cat) < 0; });
  var nEmpty = noSlip.filter(function (r) { return empty(r.explain); }).length;
  console.log("explicaciones vacías (dicen qué, no por qué; sin contar deslices): " + nEmpty + "/" + noSlip.length +
    " (" + (nEmpty / noSlip.length * 100).toFixed(1) + " %)");
  var byCat = {};
  noSlip.forEach(function (r) { var b = byCat[r.cat] = byCat[r.cat] || [0, 0, 0]; b[1]++; if (ES_CONTRAST.test(r.explain)) b[0]++; if (empty(r.explain)) b[2]++; });
  console.log("por categoría (con contraste con el español · vacías · total):");
  Object.keys(byCat).sort(function (a, b) { return byCat[b][1] - byCat[a][1]; }).forEach(function (k) {
    var b = byCat[k];
    console.log("  " + (k + "                        ").slice(0, 24) + ("    " + Math.round(b[0] / b[1] * 100)).slice(-4) + " %  " +
      ("    " + Math.round(b[2] / b[1] * 100)).slice(-4) + " %  " + b[1]);
  });
  console.log("familias: " + fams.length);
  Object.keys(groups).sort(function (a, b) { return groups[b] - groups[a]; }).forEach(function (g) { console.log("  " + ("     " + groups[g]).slice(-6) + "  " + g); });
  if (argv.indexOf("-v") >= 0) fams.forEach(function (f) { console.log("    " + ("     " + FAM[f].n).slice(-6) + "  " + f); });
}
