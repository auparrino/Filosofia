/*
 * «🔎 Palabra por palabra» (docs/js/desglose.js): lo que es del italiano.
 *
 * El núcleo no sabe italiano: de acá saca los pronombres átonos y su
 * función, los que se pegan al verbo (conoscerti, salutami, dimmi), los
 * auxiliares de los tiempos compuestos (ho capito, sono andato), las
 * elisiones (l'amico, dov'è, un'idea), las locuciones frecuentes (c'è,
 * ce la faccio, d'accordo), las palabras que no son verbos aunque lo
 * parezcan, y en qué semana la teoría presenta cada tiempo: antes de esa
 * semana el desglose dice «pasado», «futuro»… y no el nombre italiano.
 */
(function (root) {
  "use strict";
  var L = root.LANG = root.LANG || {};
  L.rules = L.rules || {};

  L.rules.desglose = {
    /* Pronombres átonos.  p: personas del verbo con las que es reflexivo;
       fn: funciones posibles (od objeto directo, oi objeto indirecto, refl
       reflexivo, loc locativo, part partitivo, imp impersonal); amb: también
       es artículo (lo, la, le, gli): pronombre solo delante de un verbo;
       cluster: forma de delante de lo/la/ne (me lo, ce la). */
    clitics: {
      mi: { es: "me / a mí", p: [0], fn: ["od", "oi", "refl"] },
      ti: { es: "te / a vos", p: [1], fn: ["od", "oi", "refl"] },
      ci: { es: "nos", esFn: { loc: "ahí, en eso" }, p: [3], fn: ["od", "oi", "refl", "loc"] },
      vi: { es: "los, les (a ustedes)", p: [4], fn: ["od", "oi", "refl"] },
      si: { es: "se", p: [2, 5], fn: ["refl", "imp"] },
      lo: { es: "lo", fn: ["od"], amb: true },
      la: { es: "la (también «a usted»)", fn: ["od"], amb: true },
      li: { es: "los", fn: ["od"] },
      le: { es: "le (a ella, a usted) / las", fn: ["oi", "od"], amb: true },
      gli: { es: "le (a él) / les", fn: ["oi"], amb: true },
      ne: { es: "de eso, de ellos", fn: ["part"] },
      "l'": { es: "lo / la (sin la vocal, delante de vocal o h)", fn: ["od"], amb: true },
      me: { es: "me (*mi* delante de lo, la, ne)", fn: ["oi"], cluster: true },
      te: { es: "te (*ti* delante de lo, la, ne)", fn: ["oi"], cluster: true },
      ce: { es: "nos / ahí (*ci* delante de lo, la, ne)", fn: ["oi", "loc"], cluster: true },
      ve: { es: "les (*vi* delante de lo, la, ne)", fn: ["oi"], cluster: true },
      glielo: { es: "se lo (*gli* + *lo*)", fn: ["oi"] },
      "gliel'": { es: "se lo / se la (*glielo*, *gliela* sin la vocal)", fn: ["oi"] },
      gliela: { es: "se la (*gli* + *la*)", fn: ["oi"] },
      gliene: { es: "le… de eso (*gli* + *ne*)", fn: ["oi"] }
    },
    // Where the clitic goes: said once per phrase.
    position: "como en español, va antes del verbo conjugado y se pega al infinitivo y al imperativo",
    // Verbs whose clitic is an indirect object (a mí, a vos…).
    oiVerbs: ["piacere", "dispiacere", "servire", "mancare", "sembrare", "interessare", "dire", "dare",
      "chiedere", "domandare", "mandare", "scrivere", "telefonare", "spiegare", "consigliare",
      "passare", "prestare", "regalare", "offrire", "fare", "mostrare", "rispondere", "raccontare", "confermare", "inviare", "permettere", "convenire", "bastare", "importare"],
    // Reflexive infinitives: chiamarsi, alzarsi.
    reflRe: "rsi$",
    reflMake: ["e$", "si"],
    // The meaning of a reflexive verb without its pronoun, when it changes.
    plainEs: { "acordarse": "recordar", "quedarse": "quedar", "irse": "ir" },
    // A modal before an infinitive: the pronoun goes with the infinitive.
    modals: ["potere", "dovere", "volere", "sapere"],
    // Auxiliary that makes a compound with a participle nobody knows (avrebbe immaginato).
    auxGuess: ["avere"],
    // The meaning of a verb when the glossary gives an expression (piacere: «mucho gusto»).
    verbEs: { piacere: "gustar", dispiacere: "lamentar, disgustar", mancare: "faltar, extrañar" },
    reflUnmake: ["si$", "e"],
    infRe: "(are|ere|ire)$",
    // A form whose infinitive only the glossary knows: consiglia → consigliare.
    guess: [["(iamo|ate|ete|ite|ano|ono|a|i|o|e)$", "are", "ere", "ire"]],
    ppGuess: [["at[oaie]$", "are"], ["ut[oaie]$", "ere"], ["it[oaie]$", "ire"]],

    /* Pronouns glued to an infinitive, an imperative or a gerund
       (conoscerti, salutami, farcela, dimmi), longest first.  short: the
       one-syllable imperatives that double the consonant (di' + mi = dimmi). */
    enclitic: {
      suffixes: ["glielo", "gliela", "glieli", "gliele", "gliene", "cela", "celo", "cene", "mela", "melo",
        "mene", "tela", "telo", "tene", "sela", "selo", "sene", "vela", "velo",
        "gli", "mi", "ti", "ci", "vi", "si", "lo", "la", "li", "le", "ne"],
      es: { mi: "me", ti: "te", ci: "nos / ahí", vi: "los, les", si: "se", lo: "lo", la: "la", li: "los",
        le: "le / las", ne: "de eso", gli: "le", cela: "*ce* + *la*", celo: "*ce* + *lo*", cene: "*ce* + *ne*",
        mela: "*me* + *la*", melo: "*me* + *lo*", mene: "*me* + *ne*", tela: "*te* + *la*", telo: "*te* + *lo*",
        tene: "*te* + *ne*", sela: "*se* + *la*", selo: "*se* + *lo*", sene: "*se* + *ne*",
        vela: "*ve* + *la*", velo: "*ve* + *lo*", glielo: "*glie* + *lo*", gliela: "*glie* + *la*",
        glieli: "*glie* + *li*", gliele: "*glie* + *le*", gliene: "*glie* + *ne*" },
      // an infinitive that lost its last vowel: conoscer-ti, ridur-si (ridurre)
      infEnd: ["e", "re"],
      short: { di: "dire", fa: "fare", da: "dare", sta: "stare", va: "andare" },
      note: "pegado al final del infinitivo, del imperativo o del gerundio"
    },

    /* Compound tenses: auxiliary + participle read together.  The simple
       tense of the auxiliary gives the compound tense. */
    aux: {
      avere: { presente: "passatoProssimo", imperfetto: "trapassatoProssimo", futuro: "futuroAnteriore",
        passatoRemoto: "trapassatoRemoto", condizionale: "condizionalePassato",
        congiuntivo: "congiuntivoPassato", congImperfetto: "congiuntivoTrapassato" },
      essere: { presente: "passatoProssimo", imperfetto: "trapassatoProssimo", futuro: "futuroAnteriore",
        passatoRemoto: "trapassatoRemoto", condizionale: "condizionalePassato",
        congiuntivo: "congiuntivoPassato", congImperfetto: "congiuntivoTrapassato" }
    },
    // The auxiliary must be the verb's own (è chiuso is not a past tense).
    checkAux: true,
    // A participle agrees with the subject after essere: andata, andati.
    agree: { from: "[aie]$", to: "o" },
    // Words that can sit between the auxiliary and the participle.
    between: ["già", "mai", "ancora", "sempre", "non", "più", "appena", "anche", "proprio", "bene", "tutto", "mica", "davvero"],
    // stare + gerundio, stare per + infinitivo…
    peri: {
      stare: { form: "gerundio", es: "acción en curso, como «estoy haciendo»" }
    },

    /* Elided forms: the vowel falls before a vowel. */
    elide: {
      "l'": "lo / la", "un'": "una", "d'": "di", "c'": "ci", "m'": "mi", "t'": "ti", "s'": "si", "v'": "vi",
      "n'": "ne", "dov'": "dove", "com'": "come", "quant'": "quanto / quanta", "quest'": "questo / questa",
      "quell'": "quello / quella", "ch'": "che", "anch'": "anche", "tutt'": "tutto / tutta", "cos'": "cosa",
      "senz'": "senza", "nessun'": "nessuna", "buon'": "buona", "sant'": "santo / santa", "mezz'": "mezzo / mezza",
      "po'": "poco", "be'": "bene", "brav'": "bravo / brava", "bell'": "bello / bella", "grand'": "grande",
      "vent'": "venti", "trent'": "trenta", "quarant'": "quaranta", "cinquant'": "cinquanta", "sessant'": "sessanta",
      "settant'": "settanta", "ottant'": "ottanta", "novant'": "novanta"
    },

    /* Frequent locutions, read as one block.  @verbo: any form of that verb.
       Longest first. */
    loc: [
      { m: "non c' è male", es: "nada mal, bastante bien" },
      { m: "c' è", es: "hay (*ci* + *è*: «ahí está»)" },
      { m: "c' era", es: "había (*ci* + *era*)" },
      { m: "ci sono", es: "hay, con plural (*ci* + *sono*) — o «estoy ahí»" },
      { m: "ce l' @avere fatta", es: "lo logré, lo lograste… (*farcela*: *ce* y *l'* no se traducen)" },
      { m: "ce la @fare", es: "lograrlo, poder con algo (*farcela*: *ce* y *la* no se traducen)" },
      { m: "ci @volere", es: "hace falta, se tarda (*volerci*: *ci vuole un'ora* = se tarda una hora)" },
      { m: "ci @avere messo", es: "tardé, tardaste… (*metterci* = tardar: *ci ho messo due ore*)" },
      { m: "ci @mettere", es: "tardar (*metterci*: *ci metto un'ora* = tardo una hora)" },
      { m: "può darsi", es: "puede ser, quizás" },
      { m: "mi scusi", es: "disculpe, perdone (*scusarsi* con usted: *scusi*, 3.ª persona)" },
      { m: "scusami", es: "disculpame (*scusa* + *mi*)" },
      { m: "@volere dire", es: "querer decir, significar" },
      { m: "d' accordo", es: "de acuerdo" },
      { m: "un po'", es: "un poco (*po'* = *poco* sin la última sílaba)" },
      { m: "va bene", es: "está bien, dale" },
      { m: "a posto", es: "en orden, bien" },
      { m: "fa niente", es: "no importa, no pasa nada" },
      { m: "in bocca al lupo", es: "¡suerte! (se contesta *crepi!*)" },
      { m: "ne vale la pena", es: "vale la pena (*ne* = de eso)" },
      { m: "che ne @dire", es: "¿qué te parece? (*ne* = de eso)" },
      { m: "mi @sapere che", es: "me parece que" },
      { m: "ci mancherebbe", es: "¡faltaba más!, ¡de nada!" },
      { m: "tra l' altro", es: "entre otras cosas, además" },
      { m: "ad ogni modo", es: "de todos modos" },
      { m: "visto che", es: "ya que, dado que" },
      { m: "per caso", es: "por casualidad, de casualidad" },
      { m: "di solito", es: "por lo general" },
      { m: "un sacco", es: "un montón (coloquial)" },
      { m: "ti @volere bene", es: "te quiero (cariño, no amor de pareja: ese es *ti amo*)" },
      { m: "@fare schifo", es: "dar asco" },
      { m: "@fare male", es: "doler (*mi fa male la gola* = me duele la garganta)" },
      { m: "@avere ragione", es: "tener razón" },
      { m: "@avere voglia", es: "tener ganas" },
      { m: "@dare una mano", es: "dar una mano, ayudar" },
      { m: "@dare fastidio", es: "molestar" },
      { m: "@fare la spesa", es: "hacer las compras (del súper)" },
      { m: "@fare la doccia", es: "bañarse, darse una ducha" },
      { m: "@avere fame", es: "tener hambre (*avere* + fame, sete, caldo, freddo, sonno, paura)" },
      { m: "@avere caldo", es: "tener calor (*avere* + fame, sete, caldo, freddo, sonno, paura)" },
      { m: "@avere freddo", es: "tener frío (*avere* + fame, sete, caldo, freddo, sonno, paura)" },
      { m: "@avere sonno", es: "tener sueño" },
      { m: "@avere paura", es: "tener miedo" },
      { m: "@avere bisogno", es: "necesitar (*avere bisogno di*)" },
      { m: "@stare per", es: "estar por, estar a punto de" },
      { m: "@andare a piedi", es: "ir a pie, caminando" }
    ],

    /* Fixed explanations of function words that confuse. */
    fn: {
      ecco: "acá está, he aquí (*eccolo* = acá está)",
      mica: "para nada (refuerza el *non*: *non è mica facile*)",
      pure: "también; *pure* después de un imperativo = dale, tranquilo",
      magari: "ojalá; también «quizás»",
      boh: "¡qué sé yo! (encogerse de hombros)",
      allora: "entonces, bueno…",
      anzi: "es más, al contrario",
      proprio: "justo, realmente",
      già: "ya",
      ancora: "todavía; también «otra vez»",
      piuttosto: "más bien, bastante",
      eppure: "y sin embargo",
      eppur: "y sin embargo (*eppure* sin la última vocal)",
      dai: "¡dale!, ¡vamos!; *ma dai!* = ¡no me digas!",
      figurati: "¡imaginate!; también «¡de nada!»",
    },

    // Read as nouns or adjectives, never as verbs (unless after io, tu…).
    notVerb: ["posto", "sale", "porta", "resto", "scorso", "vita", "fine", "volta", "entro", "saluti", "conto",
      "caro", "dritto", "sbagliato", "fretta", "pena"],
    // After these the word is a noun (che lavoro, questo tavolo, mio padre).
    det: ["che", "questo", "questa", "questi", "queste", "quel", "quello", "quella", "quei", "quegli", "quelle",
      "mio", "mia", "miei", "mie", "tuo", "tua", "tuoi", "tue", "suo", "sua", "suoi", "sue", "nostro", "nostra",
      "vostro", "vostra", "loro", "ogni", "qualche", "molto", "molta", "molti", "molte", "poco", "poca", "tanto",
      "tanta", "troppo", "tutto", "tutta", "altro", "altra", "nessun", "nessuno", "buon", "buona", "bel",
      "bella", "questo", "quale", "qual"],
    // After these no conjugated verb can come.
    preps: ["di", "a", "da", "in", "con", "su", "per", "tra", "fra"],
    // After these a word that is both noun and verb is a verb (di dove sei?).
    interrog: ["dove", "come", "quando", "chi", "perché", "non"],
    // Numbers that are also verb forms: a verb unless article, noun or «e» (alle sei, sei giorni, tutti e sei).
    numbers: ["sei"],
    // Subject pronouns (also Lei).
    subj: ["io", "tu", "lui", "lei", "noi", "voi", "loro"],
    copula: ["essere", "stare", "sembrare", "diventare", "restare", "rimanere"],
    relative: ["che", "chi", "dove", "cui"],
    // Names a sentence may start with (Guido ___ (portare)).
    names: ["guido", "marco", "luca", "paolo", "giulia", "anna", "sara", "franco", "carlo", "mario", "maria",
      "laura", "giorgio", "elena", "chiara", "matteo", "giovanni", "francesca", "andrea", "roberto", "lucia",
      "pietro", "sofia", "giacomo", "martina", "alessandro", "federica", "stefano", "valeria", "augusto",
      "rossi", "bianchi", "toto", "dante", "leopardi", "ungaretti", "levi", "gramsci", "pavese", "galileo"],

    // «en esta frase»: only real idiomatic uses of a verb form, alone in
    // their clause («Figurati!», «Senti, …») or before one of next.
    idioms: {
      figurati: "¡imaginate!; también «¡de nada!»",
      dai: "¡dale!, ¡vamos!",
      senti: "escuchá, mirá (para empezar a hablar)",
      tieni: "tomá (al dar algo)",
      prego: "de nada; pase, adelante",
      magari: "¡ojalá!"
    },

    /* When the theory presents each tense (tools/it/sillabo.py TENSE_WEEK).
       presente is there from day one; its full name («presente
       indicativo») only makes sense next to the congiuntivo. */
    weeks: { presente: 1, imperativo: 12, passatoProssimo: 11, imperfetto: 15, futuro: 19, futuroAnteriore: 19,
      condizionale: 20, congiuntivo: 24, trapassatoProssimo: 26, congiuntivoPassato: 29, congImperfetto: 30,
      congiuntivoTrapassato: 30, condizionalePassato: 31, passatoRemoto: 37, trapassatoRemoto: 37 },
    nameWeek: { presente: 24 },
    // What to say before the tense has a name.
    desc: {
      presente: "presente",
      imperativo: "para pedir u ordenar",
      passatoProssimo: "pasado, como «comí / he comido»",
      imperfetto: "pasado que dura o se repite, como «comía»",
      futuro: "futuro",
      futuroAnteriore: "futuro compuesto, como «habré comido»",
      condizionale: "condicional, como «comería»",
      congiuntivo: "subjuntivo, como «que coma»",
      trapassatoProssimo: "pasado anterior, como «había comido»",
      congiuntivoPassato: "subjuntivo pasado, como «que haya comido»",
      congImperfetto: "subjuntivo pasado, como «si comiera»",
      congiuntivoTrapassato: "subjuntivo pasado, como «si hubiera comido»",
      condizionalePassato: "condicional pasado, como «habría comido»",
      passatoRemoto: "pasado de la narración escrita, como «comí»",
      trapassatoRemoto: "pasado anterior literario, como «hube comido»"
    },
    // Subjunctive tenses: read as such only after one of the triggers.
    subjTenses: ["congiuntivo", "congImperfetto", "congiuntivoPassato", "congiuntivoTrapassato"],
    subjTriggers: ["che", "se", "benché", "sebbene", "purché", "prima", "affinché", "magari", "qualunque",
      "chiunque", "dovunque", "senza", "ovunque", "comunque", "qualsiasi"],
    // Imperative persons, as the conjugator names them.
    impvPersons: { tu: "tu", Lei: "Lei", noi: "noi", voi: "voi" }
  };
})(typeof window !== "undefined" ? window : globalThis);
