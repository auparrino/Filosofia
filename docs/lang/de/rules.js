/*
 * Weg C1 — las reglas del alemán que usa el núcleo (LANG.rules): la
 * corrección, el guardado, los rangos y las medallas, los distractores de
 * los ejercicios, las trampas de las lecciones y el banco.
 *
 * El paquete arranca chico (las seis semanas de A1): no hay todavía
 * conjugador, diagnóstico ni banco alemanes; lo que el núcleo les pide a
 * esas piezas queda acá con lo justo, para que crezca cuando lleguen.
 */
(function (root) {
  "use strict";

  var LANG = root.LANG = root.LANG || {};

  function isObj(v) { return !!v && typeof v === "object" && !Array.isArray(v); }

  /* ------------------------------------------------------ guardado */

  // El temario nace en su versión 1: si algún día se reordenan las semanas,
  // la migración de las partidas viejas va acá.
  function migrateSyllabus(s) {
    if (isObj(s) && !s.syllabusV) s.syllabusV = 1;
    return s;
  }

  /* ------------------------------------------------------ distractores */

  // Plurals a learner makes: the -s of Spanish (Tisch → Tischs), -e and
  // -en mixed up, the umlaut forgotten (Bruder → Bruders, Brüder → Bruder).
  function pluralTraps(w) {
    var out = [];
    if (/[äöü]/.test(w)) out.push(w.replace("ä", "a").replace("ö", "o").replace("ü", "u"));
    if (/e$/.test(w)) out.push(w + "s", w + "n");
    else if (/en$/.test(w)) out.push(w.replace(/en$/, "e"), w.replace(/en$/, "s"));
    else if (/er$/.test(w)) out.push(w + "s", w + "n");
    else out.push(w + "s", w + "e", w + "en");
    return out.filter(function (x) { return x !== w; });
  }

  // German has no glued pronouns (chama-se): nothing to vary.
  function glued() { return []; }

  // The word in the stem: left unchanged, or with the plurals a learner
  // makes; the answer without its umlaut or with ss for ß.
  function shapes(ans, low, base, push) {
    if (base && base.toLowerCase() !== low) { push(base); pluralTraps(base.toLowerCase()).forEach(push); }
    var bare = low.replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u");
    if (bare !== low) push(bare);
    if (/ß/.test(low)) push(low.replace(/ß/g, "ss"));
  }

  /* ------------------------------------------------------ trampas */

  /* Trap versions of a right sentence: the errors a Spanish speaker makes
     in German — the article of the Spanish gender (die Mond, der Sonne),
     the indefinite and kein without the -e or with it, the forms of sein
     and haben mixed up, the verb ending of another person, the umlaut and
     the ß lost, and Spanish words inside.
     week: the traps test only what has been taught by then (articles from
     week 3, the accusative from week 4). */
  var ART = { der: ["die", "das"], die: ["der", "das"], das: ["der", "die"] };
  var INDEF = { ein: "eine", eine: "ein", kein: "keine", keine: "kein", einen: "ein", keinen: "kein" };
  var SEIN = { bin: "bist", bist: "ist", ist: "sind", sind: "ist", seid: "sind" };
  var HABEN = { habe: "hat", hast: "habt", hat: "habe", haben: "hat", habt: "hast" };
  var SPAN = { und: "y", ist: "es", ich: "yo", nicht: "no", sehr: "muy", gut: "bueno", heute: "hoy", hier: "aquí",
               danke: "gracias", bitte: "por favor", ja: "sí", nein: "no", mit: "con", aber: "pero" };
  var UML = /[äöü]/;

  /* One word of the sentence (c: see lezione.js traps).  safe: only the
     changes that are always an error (umlaut, ß, Spanish word, the
     indefinite with the wrong -e before a noun of the lesson). */
  function trapWord(c) {
    var low = c.low, i = c.i, toks = c.toks, week = c.week, safe = c.safe, rnd = c.rnd, put = c.put;
    var next = (toks[i + 1] || "").replace(/[^A-Za-zÄÖÜäöüß]/g, "");
    var nounNext = !!next && /^[A-ZÄÖÜ]/.test(next);
    if (week >= 3 && ART[low] && nounNext && !safe) put(ART[low][Math.floor(rnd() * 2)]);
    if (week >= 3 && INDEF[low] && nounNext && !safe) put(INDEF[low]);
    if (week >= 4 && (low === "einen" || low === "keinen") && nounNext) put(low.replace(/en$/, ""));
    if (!safe && SEIN[low]) put(SEIN[low]);
    if (!safe && week >= 4 && HABEN[low]) put(HABEN[low]);
    if (SPAN[low]) put(SPAN[low]);
    if (UML.test(low)) put(low.replace("ä", "a").replace("ö", "o").replace("ü", "u"));
    if (/ß/.test(low)) put(low.replace("ß", "ss"));
    // the verb ending of another person (wohnst → wohnt, lerne → lernt)
    if (!safe && i > 0 && low.length > 4) {
      if (/st$/.test(low)) put(low.replace(/st$/, "t"));
      else if (/[^e]t$/.test(low) && /^(du|er|sie|es|ihr)$/i.test(toks[i - 1] || "")) put(low.replace(/t$/, "st"));
    }
  }

  /* ------------------------------------------------------ banco */

  function defArt(word, g, plural) { return plural ? "die" : g === "m" ? "der" : g === "f" ? "die" : "das"; }
  function indefArt(word, g, plural) { return plural ? "" : g === "f" ? "eine" : "ein"; }

  LANG.rules = {
    /* Corrección (engine.js grade).  Las diéresis cuentan (schon ≠ schön):
       la que falta es «casi»; una en otro lugar es otra palabra
       (strictMarks).  Las mayúsculas no cuentan (la corrección no las mira:
       las notas lo recuerdan). */
    grade: { strictMarks: true, graveIsGrammar: false, hyphen: false },

    save: {
      blank: { syllabusV: 1 },
      syllabus: migrateSyllabus
    },

    /* Los rangos: del turista que baja en Tegel al berlinés de toda la vida. */
    ranks: [
      [1, "Tourist"], [3, "Gast"], [6, "Besucher"],
      [10, "Nachbar"], [14, "Stammgast"], [18, "Plaudertasche"],
      [23, "Kenner"], [28, "Dichter"], [34, "Berliner"], [40, "Urberliner"]
    ],

    /* Las medallas: nombres en alemán, descripción en castellano.  Los id
       son los de la app de italiano (quedan en las partidas guardadas). */
    badges: {
      "primo-passo": ["Erster Schritt", "Contestá tu primera pregunta."],
      centurione: ["Volltreffer", "100 respuestas correctas."],
      mille: ["Tausendundeins", "1000 respuestas correctas."],
      settimana: ["Sieben Tage", "Racha de 7 días."],
      mese: ["Dreißig Tage", "Racha de 30 días."],
      a2: ["Niveau A2", "Vencé al jefe de la semana 13."],
      b1: ["Niveau B1", "Vencé al jefe de la semana 26."],
      b2: ["Niveau B2", "Vencé al jefe de la semana 39."],
      c1: ["Niveau C1", "Superá el examen final."],
      congiuntivo: ["Konjunktiv-Meister", "Vencé al jefe de la semana 39 sin perder vidas."],
      sfidante: ["Herausforderer", "50 desafíos resueltos."],
      studioso: ["Fleißig", "Leé la teoría de 10 semanas."],
      erudito: ["Gelehrt", "Leé la teoría de las 52 semanas."],
      penna: ["Erster Satz", "Escribí de memoria tu primera frase."],
      scrittore: ["Schriftsteller", "100 frases escritas de memoria."],
      fulmine: ["Blitz", "20 aciertos en un Blitz de 60 segundos."],
      frasario: ["Gesprächig", "100 frases de conversación aprendidas."],
      lettore: ["Leser", "Terminá 5 lecturas."],
      bologna: ["Applaus in Berlin", "Terminá la historia de Martín in Berlin."],
      umanista: ["Humanist", "Leé las 10 lecturas de cultura."],
      ponte: ["Brücke", "50 cognados pasados al alemán."],
      perfetta: ["Perfekte Woche", "Completá todas las misiones de una semana."],
      "dieci-perfette": ["Zehn perfekte", "Diez semanas con todas las misiones."],
      equilibrio: ["Vier Saiten", "Un día con las cuatro destrezas: input, output, forma y fluidez."],
      cinquecento: ["Fünfhundert Wörter", "500 palabras practicadas."],
      giornaliera: ["Tagesheld", "Diez desafíos del día ganados."],
      costante: ["Beständig", "Cumplí la meta diaria 5 días."]
    },

    text: {
      howSay: "¿Cómo se dice en alemán?",
      translateQ: "¿Cuál es la traducción al alemán?",
      translateTo: "Traducí al alemán",
      findError: "Encontrá el error: tocá la palabra que está mal",
      nounWithArt: "Escribilo en alemán, con el artículo (der, die, das)",
      verbInf: "Escribí el infinitivo en alemán"
    },

    // No German dictionary yet (no diagnosis module): null.
    isWord: function () { return null; },

    /* Las personas: ich, du, er/sie/es, wir, ihr, sie/Sie.  La tercera rota
       entre er, sie y es; el plural de cortesía (Sie) va con la tercera del
       plural. */
    persons: {
      labels: ["ich", "du", "er", "wir", "ihr", "sie"],
      third: [["er", "sie", "es"], ["sie", "Sie"]],
      weighted: [0, 0, 1, 1, 2, 2, 2, 3, 3, 4, 5, 5],
      skip: [],
      impersonal: { 2: "es", 5: "sie" },
      imperative: ["ich", "du", "Sie", "wir", "ihr", "Sie"]
    },

    conj: {
      imperativeForms: function (im) {
        return [null, im.du || null, im.Sie || null, im.wir || null, im.ihr || null, im.Sie || null];
      },
      extraLabels: { imperativo: "Imperativ", gerundio: "Partizip I", participio: "Partizip II" },
      // An infinitive in parentheses in a stem («Du ___ (spielen)»).
      infRe: /\(([a-zäöüß]+(?:en|ern|eln))\)/i,
      // An infinitive in the word list of the week.
      verbRe: /(en|ern|eln)$/
    },

    /* Distractors that test the rule, not the eye (drills.js wordVariants). */
    distract: {
      artSg: ["der", "die", "das", "ein", "eine"],
      artPl: ["die", "keine"],
      prepArt: { in: ["im", "in der", "ins"], an: ["am", "an der", "ans"], zu: ["zum", "zur"], von: ["vom", "von der"] },
      classes: [
        ["wer", "was", "wie", "wo", "woher", "wohin", "wann", "warum", "welche", "welcher", "welches", "wie viel"],
        ["in", "an", "auf", "aus", "bei", "mit", "nach", "von", "zu", "für", "um", "über"],
        ["der", "die", "das", "den", "dem", "des"],
        ["ein", "eine", "einen", "einem", "einer"],
        ["kein", "keine", "keinen", "keinem", "keiner"],
        ["ich", "du", "er", "sie", "es", "wir", "ihr", "Sie"],
        ["mich", "dich", "ihn", "uns", "euch"],
        ["mir", "dir", "ihm", "ihr", "uns", "euch", "ihnen", "Ihnen"],
        ["mein", "meine", "dein", "deine", "sein", "seine", "ihr", "ihre", "unser", "unsere", "euer", "eure"],
        ["und", "oder", "aber", "denn", "sondern", "weil", "dass", "wenn", "als", "ob"],
        ["nicht", "kein", "nie", "nichts", "niemand"],
        ["viel", "viele", "wenig", "wenige", "sehr", "zu", "genug", "mehr"],
        ["immer", "nie", "oft", "manchmal", "jetzt", "heute", "morgen", "gestern", "schon", "noch", "bald", "später"],
        ["bin", "bist", "ist", "sind", "seid"], ["habe", "hast", "hat", "haben", "habt"],
        ["gut", "besser", "am besten"], ["schlecht", "schlechter"]
      ],
      minLen: 1,
      glued: glued,
      baseRe: [/([A-Za-zÄÖÜäöüß]+)\s*→/i, /\(([A-Za-zÄÖÜäöüß]+)\)/i],
      // «(mamá)»: a Spanish gloss is not the word to transform.
      glossRe: /[ñ¿¡áéíóú]/,
      shapes: shapes,
      pluralTraps: pluralTraps
    },

    vocab: {
      adj: [/(ig|lich|isch|bar|sam|los|voll)$/],
      article: /^(der|die|das)\s+/
    },

    // No phrase scenes yet (frasi_data.js is missing): every scene in week 52.
    sceneWeek: {},

    traps: {
      tokenRe: /^([«„"(¿¡]*)([A-Za-zÄÖÜäöüßÀ-ÿ]+(?:-[A-Za-zÄÖÜäöüß]+)*)([.,;:!?»“")…]*)$/,
      word: trapWord
    },

    classes: [["sein", "haben", "werden", "machen", "gehen", "kommen"],
              ["der", "die", "das", "ein", "eine", "kein", "keine"],
              ["in", "an", "auf", "aus", "bei", "mit", "nach", "von", "zu", "für"],
              ["im", "am", "zum", "zur", "vom", "ins", "ans"],
              ["ich", "du", "er", "sie", "es", "wir", "ihr", "Sie"],
              ["mich", "dich", "ihn", "mir", "dir", "ihm", "uns", "euch"],
              ["der", "die", "das", "welcher", "welche"],
              ["mein", "meine", "dein", "deine", "sein", "seine", "ihr", "ihre"],
              ["sehr", "viel", "mehr", "weniger", "gut", "gern"],
              ["Präsens", "Perfekt", "Präteritum", "Futur", "Konjunktiv II", "Imperativ", "Passiv"]],

    banca: {
      // El nivel del recorrido: por ahora, las seis semanas de A1.
      levels: [6, 16, 27, 40],
      verbPair: ["sein", "haben"],
      verbPairTags: ["sein", "haben", "presente"],
      clitics: ["mich", "dich", "ihn", "sie", "es", "uns", "euch"],
      defArt: defArt,
      indefArt: indefArt,
      pluralGender: function (n) { return n[1]; },
      withArt: function (art, word) { return art + " " + word; },
      invariable: "No cambia en plural.",
      verbNote: function (n) { return n[6] || ""; },
      artOptions: function () { return ["der", "die", "das"]; },
      artWhy: function (word, g) {
        return g === "m" ? "Masculino: der." : g === "f" ? "Femenino: die." : "Neutro: das.";
      },
      countable: function (n) { return !/(solo|sólo|siempre|se usa) (en |en el )?singular|no tiene plural|sin plural/i.test(n[6] || ""); },
      pluralNote: function (n) { return n[6] || ""; },
      // German has no compulsory article contractions to drill at A1.
      preps: [],
      contr: {},
      indefPreps: {},
      CRASE_WEEK: 99,
      prepFor: function (prep) { return [prep, false]; },
      prepNote: function (prep, art, ans) { return "*" + prep + " " + art + "* = *" + ans + "*."; },
      prepAccept: function (prep, art, ans) { return [ans]; },
      genericAdj: ["neu", "alt", "schön", "groß", "klein", "weiß", "rot", "schwarz", "gelb", "grün", "blau",
                   "teuer", "billig", "modern", "sauber", "schmutzig", "berühmt", "lang", "kurz", "schwer", "leicht",
                   "bequem", "einfach", "komisch", "perfekt", "voll", "leer", "warm", "kalt"],
      concrete: { casa: 1, haus: 1, essen: 1, kleidung: 1, reise: 1, stadt: 1, schule: 1 },
      special: function (n) { return !!n[6]; },
      kinds: ["art", "art", "pl", "agr"],
      // The subject is never left out in German.
      subject: /^(Ich|Du|Er|Sie|Es|Wir|Ihr) (.+)$/,
      subjectKeep: /./,
      cure: {
        genero: { tags: ["genero", "articulos"], err: ["genero"], forms: "art" },
        articulo: { tags: ["articulos"], err: ["articulo", "genero"], forms: "art" },
        plural: { tags: ["plurales"], err: ["plural"], forms: "pl" },
        acusativo: { tags: ["acusativo"], err: ["acusativo", "articulo"] },
        orden: { tags: ["orden"], err: ["orden"] },
        umlaut: { err: ["ortografia"], vocab: true },
        espanol: { tags: ["lexico"], err: ["espanol", "falso_amigo"], vocab: true },
        falso_amigo: { tags: ["falsos_amigos"], err: ["falso_amigo", "espanol"], vocab: true },
        persona: { tags: ["presente"], err: ["persona"] }
      }
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
