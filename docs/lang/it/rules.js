/*
 * Le regole dell'italiano (LANG.rules): tutto ciò che il motore, gli
 * esercizi, le lezioni e la banca (docs/js/engine.js, drills.js,
 * lezione.js, banca.js) devono sapere della lingua.  Il nucleo non nomina
 * mai una lingua: legge da qui le parole, le espressioni regolari con le
 * lettere, le trappole dell'ispanofono, gli articoli e le preposizioni
 * articolate, i gradi e le medaglie, le migrazioni dei salvataggi.
 *
 * Si esegue dopo lang.js (boot.js ORDER): aggiunge LANG.rules.
 */
(function (root) {
  "use strict";

  var LANG = root.LANG = root.LANG || {};

  function isObj(v) { return !!v && typeof v === "object" && !Array.isArray(v); }
  // The glossary as a dictionary of Italian words (diagnosi.js loads later:
  // read it when asked).
  function util() { return root.Diagnosi && root.Diagnosi.util ? root.Diagnosi.util : null; }

  /* ------------------------------------------------------ salvataggio */

  /* Il programma è stato riordinato secondo la guida (passato prossimo nel
     primo trimestre; ci/ne, pronomi combinati e congiuntivo nel secondo).
     Chi aveva già giocato ha le settimane numerate col vecchio ordine: le
     rinumeriamo, e la settimana sbloccata diventa la prima del nuovo ordine
     che non aveva ancora fatto (niente salti di teoria). */
  var OLD_TO_NEW = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 7, 6: 5, 7: 6, 8: 10, 9: 12, 10: 14, 11: 8, 12: 9, 13: 13,
    14: 17, 15: 28, 16: 27, 17: 11, 18: 15, 19: 16, 20: 19, 21: 20, 22: 23, 23: 18, 24: 46, 25: 47, 26: 26,
    27: 24, 28: 25, 29: 29, 30: 30, 31: 32, 32: 33, 33: 31, 34: 35, 35: 36, 36: 22, 37: 21, 38: 34, 39: 39,
    40: 40, 41: 41, 42: 42, 43: 43, 44: 44, 45: 37, 46: 45, 47: 38, 48: 48, 49: 49, 50: 50, 51: 51, 52: 52 };

  /* Week 3 (articles) went from four lesson parts to six: determinati →
     «genere, il, la, l'» and «lo, gli, plurale»; indeterminati → 3;
     preposizioni → 5; partitivo e usi → «dove va» and «partitivo». */
  function migrateParts(s) {
    if (!isObj(s) || s.partsV3 === 6) return s;
    var rp = isObj(s.readParts) ? s.readParts[3] : null;
    if (isObj(rp)) {
      var n = {};
      if (rp[0]) n[0] = n[1] = true;
      if (rp[1]) n[2] = true;
      if (rp[2]) n[4] = true;
      if (rp[3]) n[3] = n[5] = true;
      s.readParts[3] = n;
    }
    s.partsV3 = 6;
    return s;
  }

  function migrateSyllabus(s) {
    s = migrateParts(s);
    if (!isObj(s) || s.syllabusV === 2) return s;
    ["read", "lessonScore", "weekStats"].forEach(function (k) {
      if (!isObj(s[k])) return;
      var out = {};
      Object.keys(s[k]).forEach(function (w) { if (OLD_TO_NEW[w]) out[OLD_TO_NEW[w]] = s[k][w]; });
      s[k] = out;
    });
    var done = {};
    for (var w = 1; w < (+s.unlocked || 1); w++) done[OLD_TO_NEW[w]] = true;
    var u = 1;
    while (u < 52 && done[u]) u++;
    s.unlocked = u;
    s.week = OLD_TO_NEW[s.week] || 1;
    s.syllabusV = 2;
    return s;
  }

  // The first goal scale (20-150) was reached with a single session.
  function migrateGoal(s) {
    if (isObj(s) && s.goalV !== 2) {
      s.goal = { 20: 100, 50: 200, 100: 350, 150: 500 }[s.goal] || 200;
      s.goalV = 2;
    }
    return s;
  }

  /* ------------------------------------------------------ distrattori */

  // An imperative or infinitive with a pronoun glued on (Fagli, Lasciala):
  // the same verb with the other pronouns.
  function glued(low, it) {
    var out = [];
    var cm = /^(.{2,}?)(glielo|gliela|gli|lo|la|li|le|ne)$/.exec(low);
    if (!cm || !/_{3,}/.test(it.stem || "")) return out;
    var st = cm[1], mono = /^(fa|da|di|sta|va)$/.test(st.replace(/(.)\1$/, "$1"));
    var st1 = st.replace(/([lnm])\1$/, "$1");
    ["lo", "la", "li", "le", "gli", "ne"].forEach(function (c) {
      if (c === cm[2]) return;
      out.push((mono && c !== "gli" ? st1 + c.charAt(0) : st1) + c);
    });
    return out;
  }

  // The word in the stem («fantasma → ___», «(parco)»): left unchanged, or
  // with the Spanish plural; then the answer with another ending vowel,
  // then without its double consonant.
  function shapes(ans, low, base, push, shuffle) {
    if (base && base.toLowerCase() !== low) { push(base); push(base + "s"); }
    var stem = ans.replace(/[aeio]$/, "");
    if (stem !== ans) shuffle(["a", "e", "i", "o"]).forEach(function (v) { push(stem + v); });
    var undoubled = ans.replace(/([bcdfglmnprstvz])\1/, "$1");
    if (undoubled !== ans) push(undoubled);
  }

  /* ------------------------------------------------------ trappole */

  /* Trap versions of a right sentence: the errors a Spanish speaker makes
     in Italian (auxiliary, agreement, article, contraction, double
     consonants).  week: the traps test only what has been taught by then
     (articles from week 3, the auxiliary from week 11, articulated
     prepositions from 3). */
  var AUX = { "sono": "ho", "sei": "hai", "è": "ha", "siamo": "abbiamo", "siete": "avete", "ero": "avevo", "era": "aveva",
              "ho": "sono", "hai": "sei", "ha": "è", "abbiamo": "siamo", "avete": "siete", "hanno": "sono" };
  var ART = { "il": "lo", "lo": "il", "la": "le", "le": "la", "gli": "i", "i": "gli", "un": "uno", "uno": "un" };
  var SPLIT = { "al": "a il", "del": "di il", "nel": "in il", "dal": "da il", "sul": "su il", "alla": "a la",
                "della": "di la", "nella": "in la", "ai": "a i", "dei": "di i", "nei": "in i", "alle": "a le", "delle": "di le" };
  var ENDS = [["ata", "ato"], ["ato", "ata"], ["ati", "ate"], ["ate", "ati"], ["uto", "uta"], ["ito", "ita"],
              ["ano", "a"], ["iamo", "ano"], ["ete", "ono"], ["ebbe", "ebbero"], ["essi", "esse"],
              ["oso", "osa"], ["osi", "ose"], ["ivo", "iva"], ["ico", "ica"], ["ale", "ali"], ["ente", "enti"]];
  // Another articulated preposition of the same family (del → della, dello).
  var PREP_FAM = [["al", "allo", "alla", "all'", "ai", "agli", "alle"], ["del", "dello", "della", "dell'", "dei", "degli", "delle"],
                  ["nel", "nello", "nella", "nell'", "nei", "negli", "nelle"], ["dal", "dallo", "dalla", "dall'", "dai", "dagli", "dalle"],
                  ["sul", "sullo", "sulla", "sull'", "sui", "sugli", "sulle"]];
  var SWAP_END = { o: "a", a: "o", e: "i", i: "e" };
  // The simple preposition a Spanish speaker puts instead (en → in, a Roma).
  var PREP_SWAP = { a: ["in", "da"], "in": ["a"], da: ["a", "di"], di: ["da", "de"], su: ["in"], per: ["a", "da"], con: ["di"], fra: ["in", "a"], tra: ["in", "a"] };
  var PRON_SWAP = { io: ["tu", "me"], tu: ["te", "io"], me: ["mi", "io"], te: ["ti", "tu"], noi: ["ci", "voi"], voi: ["vi", "noi"] };
  // Spanish inside the Italian (me chiamo, de dove, que lavoro): always wrong.
  var SPAN = { mi: "me", ti: "te", di: "de", che: "que", come: "como", non: "no", e: "y", bene: "bien",
               grazie: "gracie", ciao: "chao", molto: "muy", sono: "son", anche: "tambien", per: "para",
               questo: "esto", questa: "esta", dove: "donde", quando: "cuando", sempre: "siempre", tutto: "todo",
               buona: "buena", buono: "bueno", scusa: "disculpa", scusi: "disculpe", ho: "he", sto: "estoy" };
  var DEACC = { "à": "a", "è": "e", "é": "e", "ì": "i", "ò": "o", "ù": "u" };

  /* One word of the sentence (c: see lezione.js traps).  safe: only the
     changes that are always an error (article, preposition, è/e, accents,
     double consonants).  Another ending, person or auxiliary can be good
     Italian too (mi piaci, sono stanca, chiudono). */
  function trapWord(c) {
    var low = c.low, w = c.w, i = c.i, toks = c.toks, week = c.week, safe = c.safe, rnd = c.rnd, put = c.put;
    var next = (toks[i + 1] || "").toLowerCase();
    if (!safe && week >= 11 && AUX[low] && /(at|ut|it|ss|tt|rt|st|nt|ls|lt)[oaie]\b/.test(next)) put(AUX[low]);
    if (week >= 3 && ART[low] && toks[i + 1]) put(ART[low]);
    if (week >= 3 && SPLIT[low]) put(SPLIT[low]);
    if (PREP_SWAP[low] && toks[i + 1] && !(safe && low === "per")) put(PREP_SWAP[low][Math.floor(rnd() * PREP_SWAP[low].length)]);
    if (!safe && PRON_SWAP[low]) put(PRON_SWAP[low][Math.floor(rnd() * PRON_SWAP[low].length)]);
    if (week >= 3) PREP_FAM.forEach(function (fam) {
      if (fam.indexOf(low) < 0) return;
      var vow = /^[aeiouàèéìòùh]/.test(next);
      var alt = fam.filter(function (x) { return x !== low && !/'$/.test(x) && (!vow || !/^(al|del|nel|dal|sul|allo|dello|nello|dallo|sullo|alla|della|nella|dalla|sulla)$/.test(x)); });
      if (alt.length) put(alt[Math.floor(rnd() * alt.length)]);
    });
    if (safe && SPAN[low]) put(SPAN[low]);
    // che → ce, chi → ci: the h that keeps the c hard, forgotten
    if (safe && /ch[ei]/.test(low) && low.length > 2) put(low.replace(/ch([ei])/, "c$1"));
    // spelled the Spanish way: spagnolo → spañolo, vediamo → bediamo, questo → cuesto
    if (safe && /gn/.test(low)) put(low.replace("gn", "ñ"));
    if (safe && /^v[aeiou]/.test(low) && low.length > 3) put("b" + low.slice(1));
    if (safe && /qu[aeio]/.test(low)) put(low.replace("qu", "cu"));
    if (low === "è") put("e");
    if (/[àèéìòù]$/.test(low) && low.length > 2) put(low.slice(0, -1) + DEACC[low.slice(-1)]);
    if (/([bcdfglmnprstvz])\1/.test(low) && low.length > 4) put(low.replace(/([bcdfglmnprstvz])\1/, "$1"));
    var done = false;
    if (!safe && low.length > 4) for (var k = 0; k < ENDS.length; k++) {
      if (low.slice(-ENDS[k][0].length) === ENDS[k][0]) { put(low.slice(0, -ENDS[k][0].length) + ENDS[k][1]); done = true; break; }
    }
    // The same word with the other ending (pane → pana, simpatiche →
    // simpatichi): wrong in the same way a learner is wrong, never
    // another sentence.
    // «Marco …»: maybe a name, no spelling games (unless the dictionary knows it)
    var capStart = w[0] !== low[0] && !(c.isWord && c.isWord(low));
    if (!safe && !done && !capStart && low.length > 3 && SWAP_END[low.slice(-1)] && !/^(sono|come|dove|anche|molto|questo|questa|quando|perché|nostro|nostra)$/.test(low))
      put(low.slice(0, -1) + SWAP_END[low.slice(-1)], c.loose);
    if (!capStart && /^[^aeiou]*[aeiou][lmnrt][aeiou]/.test(low) && low.length > 3 && low.length < 8)
      put(low.replace(/^([^aeiou]*[aeiou])([lmnrt])/, "$1$2$2"), c.loose);
  }

  /* ------------------------------------------------------ banca */

  function soundOf(w) {
    if (/^(s[bcdfghklmnpqrstvz]|z|gn|ps|pn|x|y)/.test(w)) return "sz";
    if (/^[aeiouàèéìòù]/.test(w) || /^h[aeiou]/.test(w)) return "v";
    return "c";
  }
  function defArt(word, g, plural) {
    var s = soundOf(word);
    if (word === "dei" && plural) return "gli";
    if (!plural) {
      if (g === "m") return s === "sz" ? "lo" : s === "v" ? "l'" : "il";
      return s === "v" ? "l'" : "la";
    }
    if (g === "m") return s === "c" ? "i" : "gli";
    return "le";
  }
  function indefArt(word, g) {
    var s = soundOf(word);
    if (g === "m") return s === "sz" ? "uno" : "un";
    return s === "v" ? "un'" : "una";
  }

  LANG.rules = {
    /* Correction (engine.js grade).  Accents are meaningful in Italian
       (parlerò ≠ parlero): a missing or different accent is «quasi», never
       a silent pass (no strictMarks). */
    grade: {},

    /* The save (engine.js): extra fields of a new save, the renumbering of
       the old syllabus and the old goal scale. */
    save: {
      blank: { goalV: 2, syllabusV: 2, partsV3: 6 },
      syllabus: migrateSyllabus,
      load: migrateGoal,
      OLD_TO_NEW: OLD_TO_NEW
    },

    /* I gradi: un titolo per ogni tappa, da turista a madrelingua.
       Calibrati su una carriera intera: chi gioca tutto il corso arriva al
       livello 40 (tools/lib/sim_carriera.js it).  Madrelingua è la fine del corso. */
    ranks: [
      [1, "Turista"], [3, "Viaggiatore"], [6, "Studente Erasmus"],
      [10, "Pendolare"], [14, "Cittadino"], [18, "Chiacchierone"],
      [23, "Oratore"], [28, "Poeta"], [34, "Dantesco"], [40, "Madrelingua"]
    ],

    // Le medaglie: id → [nome, descrizione] (engine.js BADGES).
    badges: {
      "primo-passo": ["Primo passo", "Contestá tu primera pregunta."],
      centurione: ["Centurione", "100 respuestas correctas."],
      mille: ["Mille", "1000 respuestas correctas."],
      settimana: ["Sette giorni", "Racha de 7 días."],
      mese: ["Trenta giorni", "Racha de 30 días."],
      a2: ["Livello A2", "Vencé al jefe de la semana 13."],
      b1: ["Livello B1", "Vencé al jefe de la semana 26."],
      b2: ["Livello B2", "Vencé al jefe de la semana 39."],
      c1: ["Livello C1", "Superá el examen final."],
      congiuntivo: ["Maestro del congiuntivo", "Vencé al jefe de la semana 39 sin perder vidas."],
      sfidante: ["Sfidante", "50 desafíos del Soluzioni resueltos."],
      studioso: ["Studioso", "Leé la teoría de 10 semanas."],
      erudito: ["Erudito", "Leé la teoría de las 52 semanas."],
      penna: ["Prima penna", "Escribí de memoria tu primera frase."],
      scrittore: ["Scrittore", "100 frases escritas de memoria."],
      fulmine: ["Fulmine", "20 aciertos en un Lampo de 60 segundos."],
      frasario: ["Frasario", "100 frases de conversación aprendidas."],
      lettore: ["Lettore", "Terminá 5 lecturas."],
      bologna: ["Bolognese", "Terminá la historia de Martín."],
      umanista: ["Umanista", "Leé las 10 lecturas de cultura."],
      ponte: ["Pontiere", "50 cognados pasados al italiano."],
      perfetta: ["Settimana perfetta", "Completá todas las misiones de una semana."],
      "dieci-perfette": ["Dieci perfette", "Diez semanas con todas las misiones."],
      equilibrio: ["Quattro corde", "Un día con las cuatro destrezas: input, output, forma y fluidez."],
      cinquecento: ["Cinquecento parole", "500 palabras practicadas."],
      giornaliera: ["Sfidante del giorno", "Diez sfide del giorno ganadas."],
      costante: ["Costante", "Cumplí la meta diaria 5 días."]
    },

    /* Texts of the exercises (drills.js, lezione.js, banca.js). */
    text: {
      howSay: "¿Cómo se dice en italiano?",
      translateQ: "¿Cuál es la traducción en italiano?",
      translateTo: "Traducí al italiano",
      findError: "Trova l'errore: tocá la palabra que está mal",
      nounWithArt: "Escribilo en italiano, con el artículo determinado (il, lo, la, l'…)",
      verbInf: "Escribí el infinitivo en italiano"
    },

    // The dictionary of Italian words (Diagnosi.util), or null.
    isWord: function () { var U = util(); return U ? U.isItalian : null; },

    /* The persons of the conjugator (0-5), all of them asked. */
    persons: {
      labels: ["io", "tu", "lui/lei", "noi", "voi", "loro"]
    },

    conj: {
      /* Verbs marked aux "both" (mancare, guarire, servire, salire...) take
         essere when intransitive: the essere forms are right too. */
      alt: function (Conj, verb, tense) {
        var info = Conj.info(verb);
        if (info.aux !== "both" || info.refl || Conj.SIMPLE_TENSES.indexOf(tense) >= 0) return null;
        return Conj.conjugate(verb, tense, { aux: "essere" });
      },
      altNote: function (alt) { return " (o con essere: " + alt.join(", ") + ")"; },
      // An infinitive in parentheses in a stem («Tu ___ (frequentare)»).
      infRe: /\(([a-zà-ù]+(?:are|ere|ire|rre|rsi))\)/i,
      // An infinitive in the word list of the week.
      verbRe: /(are|ere|ire|rre|rsi)$/
    },

    /* Distractors that test the rule, not the eye (drills.js wordVariants):
       wrong forms of the same word (fantasme, fantasmas, fantasma), the
       other articles of the same number, the other forms of an articulated
       preposition.  «cani / temi / baci» next to «fantasmi» gives itself
       away by mere resemblance. */
    distract: {
      artSg: ["il", "lo", "la", "l'", "un", "uno", "una", "un'"],
      artPl: ["i", "gli", "le"],
      prepArt: { a: ["al", "allo", "alla", "all'", "ai", "agli", "alle"],
                 di: ["del", "dello", "della", "dell'", "dei", "degli", "delle"],
                 da: ["dal", "dallo", "dalla", "dall'", "dai", "dagli", "dalle"],
                 in: ["nel", "nello", "nella", "nell'", "nei", "negli", "nelle"],
                 su: ["sul", "sullo", "sulla", "sull'", "sui", "sugli", "sulle"] },
      classes: [
        ["chi", "che", "cosa", "come", "dove", "quando", "quanto", "quanta", "quanti", "quante", "quale", "quali", "perché"],
        ["a", "di", "da", "in", "su", "con", "per", "tra"],
        ["lo", "la", "li", "le", "gli", "ne", "ci"],
        ["mi", "ti", "si", "ci", "vi"],
        ["io", "tu", "lui", "lei", "noi", "voi", "loro"],
        ["san", "santo", "santa", "sant'"], ["buon", "buono", "buona", "buon'"], ["bel", "bello", "bella", "bell'", "bei", "begli", "belle"],
        ["gran", "grande", "grand'", "grandi"],
        ["me", "te", "lui", "lei", "noi", "voi", "loro", "sé"],
        ["mio", "mia", "miei", "mie", "tuo", "tua", "tuoi", "tue", "suo", "sua", "suoi", "sue", "nostro", "nostra", "nostri", "nostre", "vostro", "vostra", "vostri", "vostre", "loro"],
        ["questo", "questa", "questi", "queste", "quel", "quello", "quella", "quei", "quegli", "quelle"],
        ["ma", "però", "quindi", "perché", "invece", "infatti", "anche", "mentre", "siccome", "perciò", "comunque", "dunque", "tuttavia", "allora", "cioè", "oppure"],
        ["che", "cui", "chi", "il quale", "la quale"],
        ["niente", "nessuno", "mai", "più", "neanche", "affatto", "mica"],
        ["molto", "molta", "molti", "molte", "tanto", "troppo", "poco", "poca", "pochi", "poche"],
        ["sempre", "mai", "spesso", "già", "ancora", "appena", "ormai", "subito"]
      ],
      minLen: 2,
      glued: glued,
      // the word to transform in the stem: «fantasma → ___», «(parco)»
      baseRe: [/([a-zà-ù']+)\s*→/i, /\(([a-zà-ù']+)\)/i],
      // «(mamá)», «(amiga)»: a Spanish gloss is not the word to transform.
      glossRe: /[áéíóúñ]/,
      shapes: shapes
    },

    /* The words of the week (drills.js wordKind, wordTopic). */
    vocab: {
      adj: [/(at|ut|it)[oaie]$/, /(oso|osa|ivo|iva|ico|ica)$/],
      article: /^(il|lo|la|l'|i|gli|le)\s+/
    },

    /* Il percorso è l'asse del corso: ogni scena di frasi ha la sua
       settimana, così le frasi arrivano quando la grammatica che usano è già
       stata vista (le opinioni con congiuntivo dopo la settimana 26, non il
       primo giorno).  Used when the scene does not bring its own week. */
    sceneWeek: { ciao: 1, salva: 2, bar: 3, tavola: 4, giro: 5, casa: 6, lavoro: 7, negozi: 8,
                 reazioni: 9, ponti: 10, trappole: 12, chiacchiere: 14, cuore: 15, tempo: 19,
                 opinioni: 27, idee: 30, citazioni: 40, email: 42, dibattito: 44, aneddoto: 46, sportello: 48 },

    /* The traps of the lessons (lezione.js traps): how a word is cut out of
       the sentence, and what a Spanish speaker does to it. */
    traps: {
      tokenRe: /^([«"(]*)([A-Za-zÀ-ÿ']+)([.,;:!?»")]*)$/,
      word: trapWord
    },

    // Closed classes of the lessons' «Completá la regla» (lezione.js akin).
    classes: [["essere", "avere", "stare", "fare"], ["il", "lo", "la", "l'", "i", "gli", "le", "un", "uno", "una", "un'"],
              ["a", "di", "da", "in", "su", "con", "per", "tra", "fra"], ["io", "tu", "lui", "lei", "noi", "voi", "loro", "Lei"],
              ["mi", "ti", "si", "ci", "vi", "lo", "la", "li", "le", "gli", "ne"], ["che", "cui", "chi", "quale", "il quale"],
              ["presente", "imperfetto", "futuro", "condizionale", "congiuntivo", "passato prossimo", "passato remoto", "trapassato"]],

    /* The bank (banca.js): articles by the initial sound, articulated
       prepositions, plurals, agreement, the clinic of personal errors. */
    banca: {
      // Il livello del percorso decide cosa è alla portata: the last week of A1, A2, B1, B2.
      levels: [8, 18, 30, 42],
      // «¿Qué verbo va?» (banca.js): el par que confunde al hispanohablante
      // (sono andato / *ho andato, ho fame / *sono fame) y las oraciones que lo trabajan.
      verbPair: ["essere", "avere"],
      verbPairTags: ["essere_avere", "ausiliare_essere", "passato_prossimo", "participio_accordo", "riflessivi", "piacere"],
      // «¿Qué pronombre va?»: los átonos sueltos, delante del verbo o pegados al imperativo.
      clitics: ["lo", "la", "li", "le", "gli", "ne", "ci", "mi", "ti", "si", "vi"],
      soundOf: soundOf,
      defArt: defArt,
      indefArt: indefArt,
      // Irregular plurals change gender (il braccio → le braccia).
      pluralGender: function (n) { return n[1] === "m" && /a$/.test(n[2]) && !/a$/.test(n[0]) ? "f" : n[1]; },
      withArt: function (art, word) { return /'$/.test(art) ? art + word : art + " " + word; },
      invariable: "Invariable en plural.",
      verbNote: function (n) { return (n[6] || "") + (n[2] === "essere" ? " Pasado con essere." : ""); },
      artOptions: function (plural, ans) {
        var set = plural ? ["i", "gli", "le"] : ["il", "lo", "l'", "la"];
        if (!plural && ans !== "la") set = ["il", "lo", "l'", "la"];
        return set;
      },
      artWhy: function (word, g) {
        var s = soundOf(word);
        return s === "sz" ? "Empieza con s + consonante, z, gn o ps: lo / gli."
             : s === "v" ? "Empieza con vocal: l' (y gli en plural masculino)."
             : g === "m" ? "Masculino con consonante normal: il / i." : "Femenino: la / le.";
      },
      // Nouns that live in the singular (la fame, il sangue, i mesi): their
      // plural is grammar trivia, not something to drill.
      countable: function (n) {
        return !/singular/i.test(n[6] || "") &&
          !/^(gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)$/.test(n[0]) &&
          !/^(fame|sete|sangue|salute|latte|frutta|pepe|sale|miele|ossigeno|pazienza|coraggio|fortuna|gente|roba|mezzanotte|mezzogiorno)$/.test(n[0]);
      },
      pluralNote: function (n) { return n[6] || ""; },
      preps: ["a", "di", "da", "in", "su"],
      contr: {
        a: { il: "al", lo: "allo", "l'": "all'", la: "alla", i: "ai", gli: "agli", le: "alle" },
        di: { il: "del", lo: "dello", "l'": "dell'", la: "della", i: "dei", gli: "degli", le: "delle" },
        da: { il: "dal", lo: "dallo", "l'": "dall'", la: "dalla", i: "dai", gli: "dagli", le: "dalle" },
        in: { il: "nel", lo: "nello", "l'": "nell'", la: "nella", i: "nei", gli: "negli", le: "nelle" },
        su: { il: "sul", lo: "sullo", "l'": "sull'", la: "sulla", i: "sui", gli: "sugli", le: "sulle" }
      },
      genericAdj: ["nuovo", "vecchio", "bello", "grande", "piccolo", "bianco", "rosso", "nero",
                   "giallo", "verde", "azzurro", "caro", "economico", "moderno", "antico",
                   "pulito", "sporco", "famoso", "italiano", "lungo", "corto", "pesante",
                   "leggero", "comodo", "elegante", "semplice", "strano", "perfetto", "pieno", "vuoto"],
      concrete: { casa: 1, "città": 1, vestiti: 1, cibo: 1, viaggio: 1, negozi: 1, tecnologia: 1, scuola: 1 },
      // The nouns that teach most: an article by sound (lo, l'), or a note.
      special: function (n) { return soundOf(n[0]) !== "c" || !!n[6]; },
      kinds: ["art", "art", "pl", "prep", "agr"],
      // The subject pronoun can be left out: «Io parlo» = «Parlo».
      subject: /^(Io|Tu|Lui|Lei|Noi|Voi|Loro) (.+)$/,
      // Which exercises cure which error.
      cure: {
        ausiliare: { tags: ["passato_prossimo", "ausiliare_essere"], err: ["ausiliare", "participio_accordo"] },
        participio_accordo: { tags: ["participio_accordo", "ausiliare_essere"], err: ["participio_accordo", "ausiliare"] },
        a_personale: { tags: ["a_personale"], err: ["a_personale"] },
        preposizione: { tags: ["preposizioni", "preposizioni_articolate", "da_tempo"], err: ["preposizione", "preposizione_articolata"], forms: "prep" },
        preposizione_articolata: { tags: ["preposizioni_articolate"], err: ["preposizione_articolata", "preposizione"], forms: "prep" },
        articolo: { tags: ["articoli"], err: ["articolo", "articolo_possessivo"], forms: "art" },
        articolo_possessivo: { tags: ["possessivi"], err: ["articolo_possessivo"] },
        genere: { tags: ["articoli", "accordo"], err: ["genere", "accordo"], forms: "art" },
        accordo: { tags: ["accordo", "plurali"], err: ["accordo", "genere", "plurale"], forms: "agr" },
        plurale: { tags: ["plurali"], err: ["plurale"], forms: "pl" },
        persona_verbale: { tags: ["presente"], err: ["persona_verbale"] },
        tempo_verbale: { tags: ["imperfetto_vs_pp", "futuro", "imperfetto"], err: ["tempo_verbale"] },
        irregolare: { tags: ["presente", "passato_prossimo"], err: ["irregolare"] },
        congiuntivo: { tags: ["congiuntivo_presente", "congiuntivo_imperfetto"], err: ["congiuntivo"] },
        condizionale: { tags: ["condizionale"], err: ["condizionale"] },
        periodo_ipotetico: { tags: ["periodo_ipotetico"], err: ["periodo_ipotetico", "condizionale"] },
        pronome: { tags: ["pronomi_diretti", "pronomi_indiretti", "pronomi_combinati"], err: ["pronome", "posizione_pronome"] },
        posizione_pronome: { tags: ["pronomi_diretti", "pronomi_combinati"], err: ["posizione_pronome", "pronome"] },
        ci_ne: { tags: ["ci", "ne"], err: ["ci_ne"] },
        parola_spagnola: { tags: ["lessico"], err: ["parola_spagnola", "falso_amico"], vocab: true },
        falso_amico: { tags: ["falsi_amici"], err: ["falso_amico"], vocab: true },
        lessico: { tags: ["lessico"], err: ["lessico"], vocab: true },
        doppie: { err: ["doppie", "ortografia"], vocab: true },
        accento: { err: ["accento"], vocab: true },
        ortografia: { err: ["ortografia", "doppie"], vocab: true },
        comparativo: { tags: ["comparativi", "superlativi"], err: ["comparativo"] },
        piacere: { tags: ["piacere"], err: ["piacere"] },
        ordine: { tags: ["pronomi_diretti", "connettivi"], err: ["ordine", "posizione_pronome"] },
        parola_mancante: { tags: ["articoli", "preposizioni", "ci", "ne"], err: ["articolo", "preposizione", "ci_ne"] },
        parola_in_piu: { tags: ["a_personale", "articoli", "possessivi"], err: ["a_personale", "articolo_possessivo"] }
      }
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
