/*
 * Ágora — las reglas de la edición en castellano que usa el núcleo
 * (LANG.rules): la corrección, el guardado, los rangos y las medallas, los
 * distractores de los ejercicios, las trampas de las lecciones y el banco.
 *
 * El núcleo viene de un curso de idiomas y les pide estas piezas a todas
 * las ediciones.  En filosofía no hay gramática que ejercitar: lo que es de
 * la lengua (personas, conjugación, artículos, plurales) queda acá vacío o
 * con lo justo, y lo que sirve (la corrección, los rangos, las medallas)
 * va con nombres del curso.
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

  /* ------------------------------------------------------ trampas */

  /* Trap versions of a right sentence (lezione.js): in philosophy a word
     changed makes another thesis, not a mistake of the language; the
     lessons trap with the checks written by hand instead. */
  function trapWord() {}

  LANG.rules = {
    /* Corrección (engine.js grade).  Las tildes no cuentan (ontologia =
       ontología: ignoreMarks); las mayúsculas tampoco. */
    grade: { strictMarks: false, graveIsGrammar: false, hyphen: false, ignoreMarks: true },

    save: {
      blank: { syllabusV: 1 },
      syllabus: migrateSyllabus
    },

    /* Los rangos: del que pasa por el ágora al que funda una escuela. */
    ranks: [
      [1, "Curioso"], [3, "Oyente"], [6, "Aprendiz"],
      [10, "Discípulo"], [14, "Lector"], [18, "Dialéctico"],
      [23, "Erudito"], [28, "Maestro"], [34, "Sabio"], [40, "Fundador de escuela"]
    ],

    /* Las medallas.  Los id vienen de La Via C1 (los usa el motor); los
       nombres y las descripciones son del curso. */
    badges: {
      "primo-passo": ["Primer paso", "Contestá tu primera pregunta."],
      centurione: ["Centena", "100 respuestas correctas."],
      mille: ["Mil y una", "1000 respuestas correctas."],
      settimana: ["Siete días", "Racha de 7 días."],
      mese: ["Treinta días", "Racha de 30 días."],
      a2: ["Ciudadano del ágora", "Aprobá el examen de la Antigüedad (semana 13)."],
      b1: ["Copista", "Aprobá el examen del Medioevo y la Modernidad (semana 26)."],
      b2: ["Crítico", "Aprobá el examen de Kant al siglo XX (semana 39)."],
      c1: ["Filósofo", "Aprobá el examen final."],
      congiuntivo: ["Sin una falacia", "Aprobá el examen de la semana 39 sin perder vidas."],
      sfidante: ["Retador", "50 desafíos resueltos."],
      studioso: ["Estudioso", "Leé la teoría de 10 semanas."],
      erudito: ["Erudito", "Leé la teoría de las 52 semanas."],
      penna: ["Primera tesis", "Escribí tu primer argumento."],
      scrittore: ["Escritor", "100 respuestas escritas."],
      fulmine: ["Relámpago", "20 aciertos en un «¿Quién lo dijo?» de 60 segundos."],
      frasario: ["Memoria de citas", "100 citas aprendidas."],
      lettore: ["Lector", "Terminá 5 lecturas."],
      bologna: ["Peripatético", "Terminá una serie de lecturas."],
      umanista: ["Humanista", "Leé las 10 lecturas de una estación."],
      ponte: ["Puente", "50 conceptos relacionados."],
      perfetta: ["Semana perfecta", "Completá todas las misiones de una semana."],
      "dieci-perfette": ["Diez perfectas", "Diez semanas con todas las misiones."],
      equilibrio: ["Las cuatro cuerdas", "Un día con leer, argumentar, conceptos y rapidez."],
      cinquecento: ["Quinientos conceptos", "500 conceptos practicados."],
      giornaliera: ["Constancia", "Diez desafíos del día ganados."],
      costante: ["Disciplina estoica", "Cumplí la meta diaria 5 días."]
    },

    text: {
      howSay: "¿Cómo se llama?",
      translateQ: "¿Cuál es el término?",
      translateTo: "Explicá con tus palabras",
      findError: "Encontrá el error: tocá la parte que está mal",
      nounWithArt: "Escribí el término",
      verbInf: "Escribí el término"
    },

    // No dictionary of the language: null.
    isWord: function () { return null; },

    /* The core still asks for persons and conjugation (a language course):
       there are none here, only what it needs not to break. */
    persons: {
      labels: ["yo", "vos", "él", "nosotros", "ustedes", "ellos"],
      third: [["él", "ella"], ["ellos", "ellas"]],
      weighted: [0, 1, 2, 3, 4, 5],
      skip: [],
      impersonal: {},
      imperative: ["yo", "vos", "usted", "nosotros", "ustedes", "ustedes"]
    },

    conj: {
      imperativeForms: function () { return [null, null, null, null, null, null]; },
      extraLabels: {},
      infRe: /$^/,
      verbRe: /$^/
    },

    /* Distractors (drills.js wordVariants): the classes are groups of
       things that can be confused with each other. */
    distract: {
      artSg: [],
      artPl: [],
      prepArt: {},
      classes: [
        ["Tales", "Anaximandro", "Anaxímenes", "Pitágoras", "Jenófanes", "Heráclito", "Parménides", "Zenón", "Empédocles", "Anaxágoras", "Demócrito"],
        ["Sócrates", "Platón", "Aristóteles", "Epicuro", "Zenón de Citio", "Diógenes"],
        ["metafísica", "epistemología", "lógica", "ética", "filosofía política", "estética"],
        ["premisa", "conclusión", "argumento", "opinión"],
        ["mito", "logos"],
        ["agua", "aire", "fuego", "ápeiron", "número", "átomos"]
      ],
      minLen: 2,
      glued: function () { return []; },
      baseRe: [/$^/, /$^/],      // no word to transform in a stem
      glossRe: /$^/,
      shapes: function () {},
      pluralTraps: function () { return []; }
    },

    vocab: {
      adj: [],
      article: /$^/
    },

    // No quote scenes yet (frasi_data.js is missing).
    sceneWeek: {},

    traps: {
      tokenRe: /^([«"(¿¡]*)([A-Za-zÀ-ÿñÑ]+(?:-[A-Za-zÀ-ÿñÑ]+)*)([.,;:!?»")…]*)$/,
      word: trapWord
    },

    classes: [["metafísica", "epistemología", "lógica", "ética", "filosofía política", "estética"],
              ["premisa", "conclusión", "argumento", "opinión"],
              ["mito", "logos"]],

    banca: {
      // Los niveles: uno por estación.
      levels: [13, 26, 39, 52],
      verbPair: [],
      verbPairTags: [],
      clitics: [],
      defArt: function () { return ""; },
      indefArt: function () { return ""; },
      pluralGender: function (n) { return n[1]; },
      withArt: function (art, word) { return word; },
      invariable: "",
      verbNote: function () { return ""; },
      artOptions: function () { return []; },
      artWhy: function () { return ""; },
      countable: function () { return false; },
      pluralNote: function () { return ""; },
      preps: [],
      contr: {},
      indefPreps: {},
      CRASE_WEEK: 99,
      prepFor: function (prep) { return [prep, false]; },
      prepNote: function () { return ""; },
      prepAccept: function (prep, art, ans) { return [ans]; },
      genericAdj: [],
      concrete: {},
      special: function () { return false; },
      kinds: [],
      subject: /$^/,
      subjectKeep: /./,
      cure: {}
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
