/*
 * As regras do português do Brasil (LANG.rules): todo lo que el motor, los
 * ejercicios, las lecciones y el banco (docs/js/engine.js, drills.js,
 * lezione.js, banca.js) necesitan saber de la lengua.  El núcleo no nombra
 * nunca un idioma: lee de acá las palabras, las expresiones regulares con
 * letras, las trampas del hispanohablante, los artículos y las
 * contracciones, los rangos y las medallas, la versión del guardado.
 *
 * Se ejecuta después de lang.js (boot.js ORDER): agrega LANG.rules.
 */
(function (root) {
  "use strict";

  var LANG = root.LANG = root.LANG || {};

  function isObj(v) { return !!v && typeof v === "object" && !Array.isArray(v); }
  // The glossary as a dictionary of Portuguese words (diagnosi.js loads
  // later: read it when asked).
  function util() { return root.Diagnosi && root.Diagnosi.util ? root.Diagnosi.util : null; }

  /* ------------------------------------------------------ guardado */

  /* El temario de Rumo C1 nace en su versión 1 (tools/pt/curriculo.py).  Si
     algún día se reordenan las semanas, la migración de las partidas viejas
     va acá, como en el italiano: renumerar read, lessonScore y weekStats y
     abrir la primera semana del orden nuevo que no se hizo.  Por ahora solo
     marca la versión. */
  function migrateSyllabus(s) {
    if (isObj(s) && !s.syllabusV) s.syllabusV = 1;
    return s;
  }

  /* ------------------------------------------------------ distractores */

  // Plurals a learner makes (limão → limãos, animal → animals, homem → homems).
  function pluralTraps(w) {
    var out = [];
    if (/ão$/.test(w)) out.push(w.replace(/ão$/, "ões"), w.replace(/ão$/, "ães"), w.replace(/ão$/, "ãos"));
    else if (/ões$|ães$|ãos$/.test(w)) ["ões", "ães", "ãos"].forEach(function (e) { out.push(w.replace(/(ões|ães|ãos)$/, e)); });
    else if (/[aeou]l$/.test(w)) out.push(w + "s", w.replace(/l$/, "is"), w + "es");
    else if (/[aeo]is$/.test(w)) out.push(w.replace(/is$/, "ls"), w.replace(/is$/, "les"));
    else if (/il$/.test(w)) out.push(w + "s", w.replace(/il$/, "is"), w.replace(/il$/, "eis"));
    else if (/m$/.test(w)) out.push(w + "s", w.replace(/m$/, "ns"), w.replace(/m$/, "nes"));
    else if (/ns$/.test(w)) out.push(w.replace(/ns$/, "ms"), w.replace(/ns$/, "nes"));
    else if (/[rzs]$/.test(w)) out.push(w + "s", w + "es");
    else if (/[rz]es$/.test(w)) out.push(w.replace(/es$/, "s"));
    else out.push(w + "s");
    return out;
  }

  // A verb with a pronoun glued on by the hyphen (chama-se, diga-me,
  // encontrá-lo): the same verb with the other pronouns.
  function glued(low) {
    var out = [];
    var cm = /^(.+)-(me|te|se|nos|lhe|lhes|o|a|os|as|lo|la|los|las|no|na|nos|nas)$/.exec(low);
    if (!cm) return out;
    var group = /^(lo|la|los|las)$/.test(cm[2]) ? ["lo", "la", "los", "las"]
              : /^(no|na|nas)$/.test(cm[2]) ? ["no", "na", "nos", "nas"]
              : /^(o|a|os|as)$/.test(cm[2]) ? ["o", "a", "os", "as", "lhe"]
              : ["me", "te", "se", "nos", "lhe"];
    group.forEach(function (c) { if (c !== cm[2]) out.push(cm[1] + "-" + c); });
    return out;
  }

  // The word in the stem («limão → ___», «(animal)»): left unchanged, or
  // with the plurals a learner makes; then the answer with the other gender
  // or number, and without its accent.
  function shapes(ans, low, base, push) {
    if (base && base.toLowerCase() !== low) { push(base); pluralTraps(base.toLowerCase()).forEach(push); }
    pluralTraps(low.replace(/(ões|ães|ãos)$/, "ão")).forEach(function (v) { if (/(ões|ães|ãos)$/.test(low)) push(v); });
    if (/[oa]s?$/.test(low)) {
      var sw = low.replace(/o(s?)$/, "\u0001$1").replace(/a(s?)$/, "o$1").replace("\u0001", "a");
      push(sw);
      push(/s$/.test(low) ? low.slice(0, -1) : low + "s");
    }
    // the accent taken away (ótimo → otimo, três → tres)
    var bare = low.normalize("NFD").replace(/[̀-ͯ]/g, "").normalize("NFC");
    if (bare !== low) push(bare);
  }

  /* ------------------------------------------------------ trampas */

  /* Trap versions of a right sentence: the errors a Spanish speaker makes
     in Portuguese (the «pontos críticos» of the literature on Português
     para Falantes de Espanhol: Almeida Filho, Grannier, Akerberg, Durão):
     contractions written apart (em o), the Spanish word or spelling inside
     the Portuguese (muy, más, ñ, ll, -ción, -ble, -n for -m), accents and
     tildes, plurals in -ões / -ais / -ns, gostar without de, ser / estar,
     gender of the article (o leite, a viagem) and endings.
     week: the traps test only what has been taught by then (contractions
     and gender from week 3, ser / estar from 1, crase from 36). */
  // em + o = no, de + a = da…: written apart, always an error.
  var SPLIT = { no: "em o", na: "em a", nas: "em as", "do": "de o", da: "de a", dos: "de os", das: "de as",
                ao: "a o", aos: "a os", pelo: "por o", pela: "por a", pelos: "por os", pelas: "por as",
                num: "em um", numa: "em uma", dele: "de ele", dela: "de ela", deles: "de eles", delas: "de elas",
                neste: "em este", nesta: "em esta", nesse: "em esse", nessa: "em essa", naquele: "em aquele",
                naquela: "em aquela", deste: "de este", desta: "de esta", desse: "de esse", dessa: "de essa",
                daquele: "de aquele", daquela: "de aquela", disso: "de isso", nisso: "em isso", disto: "de isto",
                daqui: "de aqui", dali: "de ali" };
  // The other gender (a leite, o viagem): the heterogeneric nouns.
  var GENDER = { o: "a", a: "o", os: "as", as: "os", um: "uma", uma: "um", uns: "umas", umas: "uns",
                 no: "na", na: "no", "do": "da", da: "do", dos: "das", das: "dos", pelo: "pela", pela: "pelo",
                 num: "numa", numa: "num", este: "esta", esta: "este", esse: "essa", essa: "esse",
                 aquele: "aquela", aquela: "aquele", meu: "minha", minha: "meu", teu: "tua", tua: "teu",
                 seu: "sua", sua: "seu", nosso: "nossa", nossa: "nosso" };
  // Articles and contractions whose gender swap is always wrong before a noun.
  var ART_ALWAYS = { um: 1, uma: 1, uns: 1, umas: 1, no: 1, na: 1, "do": 1, da: 1, dos: 1, das: 1, pelo: 1, pela: 1, num: 1, numa: 1 };
  var PREP = { de: 1, em: 1, para: 1, com: 1, por: 1, sem: 1, "até": 1, entre: 1, sobre: 1 };
  var SER_ESTAR = { sou: "estou", estou: "sou", "é": "está", "está": "é", somos: "estamos", estamos: "somos",
                    "são": "estão", "estão": "são", era: "estava", estava: "era", foi: "esteve", esteve: "foi",
                    fui: "estive", estive: "fui", ser: "estar", estar: "ser" };
  var ENDS = [["ado", "ada"], ["ada", "ado"], ["ados", "adas"], ["adas", "ados"], ["ido", "ida"], ["ida", "ido"],
              ["amos", "am"], ["emos", "em"], ["imos", "em"], ["ava", "avam"], ["avam", "ava"], ["iam", "ia"],
              ["ou", "ei"], ["ei", "ou"], ["aram", "ou"], ["eram", "eu"], ["oso", "osa"], ["osa", "oso"],
              ["ivo", "iva"], ["ico", "ica"], ["ente", "entes"], ["ção", "ções"], ["ções", "ção"]];
  var SWAP_END = { o: "a", a: "o" };
  // The simple preposition a Spanish speaker puts instead (vou em, moro a).
  // («a» is left out: it is also the article and the pronoun.)
  var PREP_SWAP = { em: ["a", "de"], de: ["em", "a"], com: ["de"], para: ["por"], por: ["para"], "até": ["a"] };
  var PRON_SWAP = { eu: ["mim", "me"], mim: ["eu", "me"], me: ["mim", "eu"], "nós": ["nos"] };
  // Spanish inside the Portuguese (muy, más, yo, tengo): always wrong.
  var SPAN = { muito: "muy", muita: "mucha", muitos: "muchos", muitas: "muchas", mais: "más", "também": "también",
               "não": "no", eu: "yo", "é": "es", com: "con", em: "en", e: "y", bem: "bien", obrigado: "gracias",
               obrigada: "gracias", sim: "sí", quando: "cuando", onde: "donde", hoje: "hoy", mas: "pero",
               tenho: "tengo", estou: "estoy", sou: "soy", "você": "usted", "vocês": "ustedes", ele: "él",
               ela: "ella", "nós": "nosotros", eles: "ellos", elas: "ellas", isso: "eso", isto: "esto",
               bom: "bueno", boa: "buena", novo: "nuevo", nova: "nueva", porta: "puerta", depois: "después",
               agora: "ahora", aqui: "aquí", ainda: "todavía", sempre: "siempre", "então": "entonces",
               "olá": "hola", tchau: "chau", desculpa: "disculpa", desculpe: "disculpe", noite: "noche",
               dia: "día", cidade: "ciudad", trabalho: "trabajo", pouco: "poco", coisa: "cosa",
               "até": "hasta", tudo: "todo", "mãe": "madre", pai: "padre", filho: "hijo",
               "irmão": "hermano", "amanhã": "mañana", ontem: "ayer", tem: "tiene" };
  var POSS = { minha: 1, sua: 1, nossa: 1, tua: 1, minhas: 1, suas: 1, nossas: 1, tuas: 1 };
  var ACC = /[áâãàéêíóôõú]/;
  function unaccent(w) { return w.normalize("NFD").replace(/[̀-ͯ]/g, "").normalize("NFC"); }

  /* One word of the sentence (c: see lezione.js traps).  safe: only the
     changes that are always an error (contraction written apart, Spanish
     word or spelling, accent, -m → -n, plural).  Another ending, person,
     gender or ser / estar can be good Portuguese too (a estudante, estou
     cansado / sou cansado…). */
  function trapWord(c) {
    var low = c.low, w = c.w, i = c.i, toks = c.toks, week = c.week, safe = c.safe, rnd = c.rnd, put = c.put;
    var next = (toks[i + 1] || "").toLowerCase().replace(/[^a-zà-ÿ-]/g, "");
    var prev = (toks[i - 1] || "").toLowerCase().replace(/[^a-zà-ÿ]/g, "");
    var nounNext = !!next && /^[a-zà-ÿ]/.test(toks[i + 1] || "");
    if (/-/.test(low)) {                            // chama-se, diga-me: the hyphen dropped
      if (safe || week >= 12) put(low.replace(/-/g, " "));
      return;
    }
    // em o, de a, por o: the contraction written apart
    if (week >= 3 && SPLIT[low] && toks[i + 1]) put(SPLIT[low]);
    // the other gender of the article (a leite, o viagem, uma problema)
    if (week >= 3 && GENDER[low] && nounNext && !PREP[next] &&
        (!safe || ART_ALWAYS[low] || ((low === "o" || low === "a" || low === "os" || low === "as") && (i === 0 || PREP[prev]))))
      put(GENDER[low]);
    if (!safe && SER_ESTAR[low]) put(SER_ESTAR[low]);
    if (!safe && PREP_SWAP[low] && nounNext) put(PREP_SWAP[low][Math.floor(rnd() * PREP_SWAP[low].length)]);
    if (!safe && week >= 16 && PRON_SWAP[low]) put(PRON_SWAP[low][Math.floor(rnd() * PRON_SWAP[low].length)]);
    if (SPAN[low]) put(SPAN[low]);
    // the Spanish written accent: entendi → entendí, aqui → aquí, que → qué
    if (/[^aeiouáéíóúâêôãõ]i$/.test(low) && low.length > 3) put(low.slice(0, -1) + "í");
    if (i === 0 && (low === "que" || low === "como" || low === "quando" || low === "onde"))
      put({ que: "qué", como: "cómo", quando: "cuándo", onde: "dónde" }[low]);
    // gosto de café → gosto café: gostar keeps its de
    if (/^gost(o|a|as|amos|am|ei|ou|ava|avam|aria|ariam)$/.test(low) && /^(de|do|da|dos|das)$/.test(next)) {
      var g = toks.slice(), nx = next === "de" ? null : next.slice(1);
      if (nx) g[i + 1] = nx; else g.splice(i + 1, 1);
      c.rule.push(g.join(" "));
    }
    // tenho feito → he hecho: the Spanish auxiliary
    if (week >= 21 && low === "tenho" && /(ado|ido|to|so|sto)$/.test(next)) put("he");
    // à → a (week of the crase), not before a possessive (both are right)
    if (week >= 36 && (low === "à" || low === "às") && !POSS[next]) put(low === "à" ? "a" : "as");
    // the Spanish spelling: ñ, ll, -ción, -dad, -ble, z for ç, b for v, s for ss
    if (/nh/.test(low)) put(low.replace("nh", "ñ"));
    if (/lh/.test(low)) put(low.replace("lh", "ll"));
    if (/ção$/.test(low)) put(low.replace(/ção$/, "ción"));
    if (/ções$/.test(low)) put(low.replace(/ções$/, "ciones"));
    if (/dade$/.test(low) && low.length > 5) put(low.replace(/dade$/, "dad"));
    if (/vel$/.test(low) && low.length > 4) put(low.replace(/vel$/, "ble"));
    if (/veis$/.test(low) && low.length > 5) put(low.replace(/veis$/, "bles"));
    if (/ç/.test(low) && !/ção|ções/.test(low)) put(low.replace("ç", "z"));
    if (/^v[aeiouáéíóú]/.test(low) && low.length > 3) put("b" + low.slice(1));
    if (/[aeiouáéíóúâêô]ss[aeiou]/.test(low)) put(low.replace(/ss/, "s"));
    // -m → -n at the end (bem → ben, falam → falan, um → un)
    if (/[aeiouáéíóúâêô]m$/.test(low) && low.length >= 2) put(low.replace(/m$/, "n"));
    // the plural: limões → limãos, animais → animals, homens → homems
    if (week >= 2 && /ões$/.test(low)) put(low.replace(/ões$/, rnd() < 0.5 ? "ãos" : "ães"));
    if (week >= 2 && /(ãos|ães)$/.test(low) && low.length > 4) put(low.replace(/(ãos|ães)$/, "ões"));
    if (week >= 2 && /[aeo]is$/.test(low) && low.length > 4) put(low.replace(/is$/, "ls"));
    if (week >= 2 && /éis$/.test(low)) put(low.replace(/éis$/, "els"));
    if (week >= 2 && /ns$/.test(low) && low.length > 3) put(low.replace(/ns$/, "ms"));
    // accents and tildes: one taken away (você → voce, não → nao), or the
    // open / closed swapped (avó → avô, três → trés)
    if (ACC.test(low) && low !== "à" && low !== "às") {
      var k = low.search(ACC), ch = low[k];
      put(low.slice(0, k) + unaccent(ch) + low.slice(k + 1));
      var SW = { "é": "ê", "ê": "é", "ó": "ô", "ô": "ó" };
      if (SW[ch]) put(low.slice(0, k) + SW[ch] + low.slice(k + 1));
    }
    var done = false;
    if (!safe && low.length > 4) for (var e = 0; e < ENDS.length; e++) {
      if (low.slice(-ENDS[e][0].length) === ENDS[e][0]) { put(low.slice(0, -ENDS[e][0].length) + ENDS[e][1]); done = true; break; }
    }
    // «Rio …»: maybe a name, no spelling games (unless the dictionary knows it)
    var capStart = w[0] !== low[0] && !(c.isWord && c.isWord(low));
    // The same word with the other gender ending (bonito → bonita): wrong
    // in the same way a learner is wrong, never another sentence.
    if (!safe && !done && !capStart && low.length > 3 && SWAP_END[low.slice(-1)] &&
        !/^(para|como|onde|agora|ainda|nada|coisa|isso|isto|muito|pouco|obrigado|obrigada|casa|hora|semana|todo|tudo|cedo|tarde|nunca|sempre)$/.test(low))
      put(low.slice(0, -1) + SWAP_END[low.slice(-1)], c.loose);
    // the Spanish diphthong (porta → puerta, tempo → tiempo, novo → nuevo)
    if (!capStart && low.length >= 4 && low.length <= 7 && low[0] !== "h") {
      if (/^[^aeiouáéíóú]+o[^aeiouáéíóú]/.test(low)) put(low.replace(/^([^aeiouáéíóú]+)o/, "$1ue"), c.loose);
      else if (/^[^aeiouáéíóú]+e[^aeiouáéíóú]/.test(low)) put(low.replace(/^([^aeiouáéíóú]+)e/, "$1ie"), c.loose);
    }
  }

  /* ------------------------------------------------------ banco */

  // En portugués el artículo no depende del sonido inicial: o / a / os / as.
  function defArt(word, g, plural) {
    return g === "m" ? (plural ? "os" : "o") : (plural ? "as" : "a");
  }
  function indefArt(word, g, plural) {
    return g === "m" ? (plural ? "uns" : "um") : (plural ? "umas" : "uma");
  }

  // «a + a = à» es la crase: se ejercita desde que se ven las preposiciones
  // de movimiento (CRASE_WEEK); la regla completa de la crase es de la semana 36.
  var CRASE_WEEK = 9;

  LANG.rules = {
    /* Corrección (engine.js grade).  En portugués las tildes cuentan (avó ≠
       avô, é ≠ e, está ≠ esta) y la cedilla también (caça ≠ caca): solo una
       marca que falta es «casi»; una marca en otro lugar o de otra clase es
       otra palabra (strictMarks), y la crase es gramática, no ortografía: «a»
       por «à» es un error de regla (graveIsGrammar).  El guion de la ênclise
       que falta (chama se por chama-se) también es «casi» (hyphen). */
    grade: { strictMarks: true, graveIsGrammar: true, hyphen: true },

    save: {
      blank: { syllabusV: 1 },
      syllabus: migrateSyllabus
    },

    /* Los rangos: un título por etapa, del turista que baja en el Galeão al
       carioca da gema (el nacido y criado en Río).  Calibrados sobre una
       carrera entera: quien juega todo el curso llega al nivel 40
       (tools/lib/sim_carriera.js pt); Carioca da gema es el final del curso. */
    ranks: [
      [1, "Turista"], [3, "Gringo"], [6, "Visitante"],
      [10, "Morador"], [14, "Local"], [18, "Bom de papo"],
      [23, "Sambista"], [28, "Poeta"], [34, "Carioca"], [40, "Carioca da gema"]
    ],

    /* Las medallas: nombres en portugués, descripción en castellano.  Los id
       son los de la app de italiano (quedan en las partidas guardadas). */
    badges: {
      "primo-passo": ["Primeiro passo", "Contestá tu primera pregunta."],
      centurione: ["Cem na mosca", "100 respuestas correctas."],
      mille: ["Mil e uma", "1000 respuestas correctas."],
      settimana: ["Sete dias", "Racha de 7 días."],
      mese: ["Trinta dias", "Racha de 30 días."],
      a2: ["Nível A2", "Vencé al jefe de la semana 13."],
      b1: ["Nível B1", "Vencé al jefe de la semana 26."],
      b2: ["Nível B2", "Vencé al jefe de la semana 39."],
      c1: ["Nível C1", "Superá el examen final."],
      congiuntivo: ["Mestre do subjuntivo", "Vencé al jefe de la semana 39 sin perder vidas."],
      sfidante: ["Desafiante", "50 desafíos resueltos."],
      studioso: ["Estudioso", "Leé la teoría de 10 semanas."],
      erudito: ["Erudito", "Leé la teoría de las 52 semanas."],
      penna: ["Primeira frase", "Escribí de memoria tu primera frase."],
      scrittore: ["Escritor", "100 frases escritas de memoria."],
      fulmine: ["Raio", "20 aciertos en un Relâmpago de 60 segundos."],
      frasario: ["Conversador", "100 frases de conversación aprendidas."],
      lettore: ["Leitor", "Terminá 5 lecturas."],
      bologna: ["Aplauso no Arpoador", "Terminá la historia de Martín no Rio."],
      umanista: ["Humanista", "Leé las 10 lecturas de cultura."],
      ponte: ["Ponte Rio–Niterói", "50 cognados pasados al portugués."],
      perfetta: ["Semana perfeita", "Completá todas las misiones de una semana."],
      "dieci-perfette": ["Dez perfeitas", "Diez semanas con todas las misiones."],
      equilibrio: ["Quatro cordas", "Un día con las cuatro destrezas (como las cuatro cuerdas del cavaquinho): input, output, forma y fluidez."],
      cinquecento: ["Quinhentas palavras", "500 palabras practicadas."],
      giornaliera: ["Desafiante do dia", "Diez desafíos del día ganados."],
      costante: ["Constante", "Cumplí la meta diaria 5 días."]
    },

    text: {
      howSay: "¿Cómo se dice en portugués?",
      translateQ: "¿Cuál es la traducción al portugués?",
      translateTo: "Traducí al portugués",
      findError: "Encontrá el error: tocá la palabra que está mal",
      nounWithArt: "Escribilo en portugués, con el artículo (o, a)",
      verbInf: "Escribí el infinitivo en portugués"
    },

    // The dictionary of Portuguese words (Diagnosi.util), or null.
    isWord: function () { var U = util(); return U ? (U.isPortuguese || U.isWord || U.isItalian || null) : null; },

    /* Las personas del conjugador (0-5): eu, tu, ele/ela/você, nós, vós,
       eles/elas/vocês.  «vós» no se ejercita nunca (existe en las tablas, no
       en el habla); «tu» pesa poco (el Sur y el Norte de Brasil lo usan, y en
       Río se oye «tu» con el verbo de «você»).  La tercera persona rota entre
       ele, ela y você, y el plural entre eles, elas y vocês: así «você» se
       aprende con el verbo en tercera. */
    persons: {
      labels: ["eu", "tu", "ele", "nós", "vós", "eles"],
      third: [["ele", "ela", "você"], ["eles", "elas", "vocês"]],
      weighted: [0, 0, 0, 2, 2, 2, 2, 3, 3, 3, 5, 5, 5, 1],
      skip: [4],
      // a verb without «eu» (custar, doer): «isso custa», «elas doem»
      impersonal: { 2: "isso", 5: "elas" },
      // the imperative: «(você) ___!»
      imperative: ["eu", "tu", "você", "nós", "vós", "vocês"]
    },

    conj: {
      // imperative(inf): { tu, você, nós, vós, vocês } or null (poder, caber)
      imperativeForms: function (im) {
        return [null, im.tu || null, im["você"] || null, im["nós"] || null, im["vós"] || null, im["vocês"] || null];
      },
      extraLabels: { imperativo: "imperativo", gerundio: "gerúndio", participio: "particípio" },
      // An infinitive in parentheses in a stem («Você ___ (morar)», «(levantar-se)»).
      infRe: /\(([a-zà-ÿ]+(?:ar|er|ir|or)(?:-se)?)\)/i,
      // An infinitive in the word list of the week.
      verbRe: /(ar|er|ir|or)(-se)?$/
    },

    /* Distractors that test the rule, not the eye (drills.js wordVariants):
       wrong forms of the same word (limões → limãos, limães), the other
       articles of the same number, the other forms of a contraction (no →
       na, nos, nas).  «pães / mãos / cães» next to «limões» gives itself
       away by mere resemblance. */
    distract: {
      artSg: ["o", "a", "um", "uma"],
      artPl: ["os", "as", "uns", "umas"],
      prepArt: { em: ["no", "na", "nos", "nas", "num", "numa"],
                 de: ["do", "da", "dos", "das"],
                 a: ["ao", "à", "aos", "às"],
                 por: ["pelo", "pela", "pelos", "pelas"],
                 dem1: ["neste", "nesta", "nesse", "nessa", "naquele", "naquela", "nisso", "nisto"],
                 dem2: ["deste", "desta", "desse", "dessa", "daquele", "daquela", "disso", "disto"],
                 dele: ["dele", "dela", "deles", "delas"] },
      classes: [
        ["quem", "que", "como", "onde", "quando", "quanto", "quanta", "quantos", "quantas", "qual", "quais", "aonde", "cadê"],
        ["a", "de", "em", "por", "para", "com", "sem", "até", "entre", "sobre", "desde"],
        ["o", "a", "os", "as", "lhe", "lhes"],
        ["me", "te", "se", "nos", "lhe"],
        ["eu", "tu", "ele", "ela", "nós", "eles", "elas", "você", "vocês"],
        ["mim", "ti", "ele", "ela", "nós", "você", "si"],
        ["comigo", "contigo", "consigo", "conosco", "convosco"],
        ["meu", "minha", "meus", "minhas", "teu", "tua", "teus", "tuas", "seu", "sua", "seus", "suas",
         "nosso", "nossa", "nossos", "nossas"],
        ["este", "esta", "estes", "estas", "esse", "essa", "esses", "essas", "aquele", "aquela", "aqueles", "aquelas", "isto", "isso", "aquilo"],
        ["mas", "porém", "então", "porque", "portanto", "contudo", "entretanto", "enquanto", "embora", "pois", "ou", "nem",
         "todavia", "aliás", "logo", "senão"],
        ["que", "quem", "cujo", "cuja", "cujos", "cujas", "onde", "o qual", "a qual", "os quais", "as quais"],
        ["nada", "ninguém", "nunca", "jamais", "nenhum", "nenhuma", "tampouco", "nem"],
        ["muito", "muita", "muitos", "muitas", "pouco", "pouca", "poucos", "poucas", "tanto", "tanta", "demais", "bastante", "mais", "menos"],
        ["sempre", "nunca", "já", "ainda", "logo", "cedo", "tarde", "agora", "depois", "antes", "ontem", "hoje", "amanhã"],
        ["sou", "estou", "tenho", "fico"], ["é", "está", "tem", "fica", "há"], ["são", "estão", "têm", "ficam"],
        ["era", "estava", "tinha", "ficava", "havia"], ["foi", "esteve", "teve", "ficou", "houve"],
        ["bom", "boa", "bem", "melhor"], ["mau", "má", "mal", "pior"]
      ],
      minLen: 1,
      glued: glued,
      baseRe: [/([a-zà-ÿ]+)\s*→/i, /\(([a-zà-ÿ]+)\)/i],
      // «(mamá)»: a Spanish gloss is not the word to transform (the
      // dictionary of Portuguese words decides the rest).
      glossRe: /[ñ¿¡]/,
      shapes: shapes,
      pluralTraps: pluralTraps
    },

    vocab: {
      adj: [/(ad|id)[oa]s?$/, /(oso|osa|ivo|iva|ico|ica|vel|nte)$/],
      article: /^(o|a|os|as)\s+/
    },

    /* La trilha es el eje del curso: cada escena de frases tiene su semana,
       así las frases llegan cuando la gramática que usan ya se vio (las
       opiniones con subjuntivo después de la semana 23, no el primer día).
       La semana la trae la escena misma (frasi: scene.week); si no la trae,
       esta tabla (la copia de scene.week de frasi_data.js) o la 52. */
    sceneWeek: { oi: 1, socorro: 2, boteco: 3, padaria: 4, trabalho: 5, planos: 6, feira: 7, praia: 8,
                 metro: 9, familia: 10, passado: 11, saude: 12, reacoes: 13, falsos: 14, sentimentos: 15,
                 conectores: 16, papo: 17, restaurante: 18, whatsapp: 19, opinioes: 23, ideias: 30,
                 burocracia: 35, giria: 38, citacoes: 40, email: 43, debate: 47 },

    traps: {
      tokenRe: /^([«"(¿¡]*)([A-Za-zÀ-ÿ]+(?:-[A-Za-zÀ-ÿ]+)*)([.,;:!?»")…]*)$/,
      word: trapWord
    },

    classes: [["ser", "estar", "ter", "haver", "ficar", "ir", "fazer"],
              ["o", "a", "os", "as", "um", "uma", "uns", "umas"],
              ["a", "de", "em", "por", "para", "com", "sem", "até", "entre", "sobre"],
              ["no", "na", "nos", "nas", "do", "da", "dos", "das", "ao", "à", "aos", "às", "pelo", "pela", "pelos", "pelas", "num", "numa"],
              ["eu", "tu", "ele", "ela", "nós", "eles", "elas", "você", "vocês", "a gente"],
              ["me", "te", "se", "nos", "o", "a", "os", "as", "lhe", "lhes", "mim", "ti", "si"],
              ["que", "quem", "cujo", "cuja", "onde", "o qual", "a qual"],
              ["meu", "minha", "teu", "tua", "seu", "sua", "nosso", "nossa", "dele", "dela"],
              ["muito", "mais", "menos", "tanto", "pouco", "bem", "mal"],
              ["presente", "pretérito perfeito", "pretérito imperfeito", "futuro", "futuro do pretérito", "subjuntivo",
               "infinitivo pessoal", "mais-que-perfeito", "perfeito composto", "gerúndio", "particípio"]],

    banca: {
      // El nivel del recorrido (tools/pt/curriculo.py: A1 semanas 1-8, A2
      // 9-16, B1 17-27, B2 28-40, C1 41-52): la última semana de A1…B2.
      levels: [8, 16, 27, 40],
      // «¿Qué verbo va?» (banca.js): el par que confunde al hispanohablante
      // (o banheiro é no segundo andar, estou com fome) y las oraciones que lo trabajan.
      verbPair: ["ser", "estar"],
      verbPairTags: ["ser_estar", "presente", "perfeito", "imperfeito", "formal", "coloquial"],
      // «¿Qué pronombre va?»: los átonos (o, a, lhe, me…), delante o detrás del verbo.
      clitics: ["o", "a", "os", "as", "lhe", "lhes", "me", "te", "se", "nos"],
      defArt: defArt,
      indefArt: indefArt,
      // El género no cambia en plural (o ovo → os ovos).
      pluralGender: function (n) { return n[1]; },
      withArt: function (art, word) { return art + " " + word; },
      invariable: "No cambia en plural.",
      verbNote: function (n) { return (n[6] || "") + (n[4] && !/irregular/i.test(n[6] || "") ? " Irregular." : ""); },
      artOptions: function () { return ["o", "a", "os", "as"]; },
      artWhy: function (word, g, n) {
        var why = g === "m" ? "Masculino: o, os." : "Femenino: a, as.";
        if (/agem$/.test(n[0])) why = "Las palabras en -agem son femeninas: a viagem, a mensagem.";
        else if (/ção$|são$|dade$|tude$/.test(n[0])) why = "Las terminadas en -ção, -são, -dade y -tude son femeninas.";
        else if (/ma$/.test(n[0]) && g === "m") why = "Muchas en -ma son masculinas, como en español: o problema, o sistema.";
        return why;
      },
      // Sustantivos que viven en singular (a fome, o sangue, os meses): su
      // plural es un dato de gramática, no algo para ejercitar.
      countable: function (n) {
        return !/(solo|sólo|siempre|se usa) (en |en el )?singular|no tiene plural|sin plural/i.test(n[6] || "") &&
          !/^(janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)$/.test(n[0]) &&
          !/^(fome|sede|sangue|saúde|leite|pimenta|sal|mel|oxigênio|paciência|coragem|sorte|gente|meio-dia|meia-noite|saudade|lixo|dinheiro|grana|arroz|feijão|açúcar|café da manhã|calor|frio|trânsito|poeira|pó)$/.test(n[0]);
      },
      pluralNote: function (n) {
        var s = n[0], p = n[2], why = "";
        if (/ão$/.test(s)) why = /ões$/.test(p) ? "-ão → -ões (la mayoría): limão, limões." :
          /ães$/.test(p) ? "-ão → -ães en algunas: pão, pães; cão, cães; alemão, alemães." :
          /ãos$/.test(p) ? "-ão → -ãos en algunas: mão, mãos; irmão, irmãos; cidadão, cidadãos." : "";
        else if (/[aeou]l$/.test(s)) why = "-l → -is: animal, animais; papel, papéis; espanhol, espanhóis.";
        else if (/il$/.test(s)) why = /is$/.test(p) && !/eis$/.test(p) ? "-il tónico → -is: barril, barris." : "-il átono → -eis: fóssil, fósseis.";
        else if (/m$/.test(s)) why = "-m → -ns: homem, homens; jardim, jardins.";
        else if (/[rz]$/.test(s)) why = "-r y -z → -es: mar, mares; luz, luzes.";
        else if (s === p) why = "No cambia en plural (como o ônibus, o lápis).";
        return why + (n[6] ? (why ? " " : "") + n[6] : "");
      },
      /* Contracciones de preposición y artículo: obligatorias en portugués. */
      preps: ["em", "de", "a", "por"],
      contr: {
        em: { o: "no", a: "na", os: "nos", as: "nas", um: "num", uma: "numa", uns: "nuns", umas: "numas" },
        de: { o: "do", a: "da", os: "dos", as: "das" },
        a: { o: "ao", a: "à", os: "aos", as: "às" },
        por: { o: "pelo", a: "pela", os: "pelos", as: "pelas" }
      },
      // em + um = num: the contraction with the indefinite article.
      indefPreps: { em: 1 },
      CRASE_WEEK: CRASE_WEEK,
      // The preposition of a forms item: no crase before its week, and now
      // and then «em + um».
      prepFor: function (prep, g, plural, week, pick) {
        if (prep === "a" && g === "f" && week < CRASE_WEEK) prep = pick(["em", "de", "por"]);
        return [prep, prep === "em" && !plural && Math.random() < 0.25];
      },
      prepNote: function (prep, art, ans, indef) {
        return "*" + prep + " + " + art + "* = *" + ans + "*" +
          (ans === "à" || ans === "às" ? " (con acento grave: es la crase)." :
           prep === "em" && indef ? " (también se escribe *em " + art + "*)." : ".") +
          (prep === "em" && indef ? "" : " En portugués la contracción es obligatoria.");
      },
      prepAccept: function (prep, art, ans, indef) { return prep === "em" && indef ? [ans, "em " + art] : [ans]; },
      genericAdj: ["novo", "velho", "bonito", "grande", "pequeno", "branco", "vermelho", "preto",
                   "amarelo", "verde", "azul", "caro", "barato", "moderno", "antigo",
                   "limpo", "sujo", "famoso", "brasileiro", "comprido", "curto", "pesado",
                   "leve", "confortável", "simples", "estranho", "perfeito", "cheio", "vazio",
                   "lindo", "quente", "frio"],
      // Temas del banco de sustantivos con cosas concretas (los nombres de
      // tema pueden venir del banco italiano o traducidos).
      concrete: { casa: 1, "città": 1, cidade: 1, vestiti: 1, roupa: 1, roupas: 1, cibo: 1, comida: 1,
                  viaggio: 1, viagem: 1, negozi: 1, lojas: 1, compras: 1, tecnologia: 1, scuola: 1, escola: 1 },
      // Los que más enseñan: plurales irregulares, heterogenéricos (con nota).
      special: function (n) { return !!n[6] || /(ão|l|m)$/.test(n[0]) || n[2] === n[0]; },
      kinds: ["art", "art", "pl", "prep", "prep", "agr"],
      // Con o sin pronombre sujeto: el portugués de Brasil lo dice más que el
      // español, pero omitirlo no es error (salvo con você y a gente, que
      // cambiarían el sentido).
      subject: /^(Eu|Tu|Nós|Ele|Ela|Eles|Elas) (.+)$/,
      subjectKeep: /^(e|é|me|se|te|nos|o|a)\b/i,
      // Qué ejercicios curan qué error (las claves son las categorías de
      // errori_banca.py y de Diagnosi.LABEL; tags, las etiquetas de las
      // oraciones; forms, el ejercicio de formas que corresponde).
      cure: {
        contraccion: { tags: ["contracciones", "preposiciones"], err: ["contraccion", "preposicion"], forms: "prep" },
        articulo: { tags: ["articulos", "contracciones"], err: ["articulo", "contraccion"], forms: "art" },
        genero: { tags: ["genero", "concordancia"], err: ["genero", "concordancia"], forms: "art" },
        plural: { tags: ["plurales"], err: ["plural"], forms: "pl" },
        concordancia: { tags: ["concordancia", "plurales", "genero"], err: ["concordancia", "genero", "plural"], forms: "agr" },
        preposicion: { tags: ["preposiciones", "contracciones"], err: ["preposicion", "contraccion", "regencia"], forms: "prep" },
        regencia: { tags: ["regencia", "gostar"], err: ["regencia", "preposicion", "gostar"] },
        muito: { tags: ["muito", "comparativos", "indefinidos"], err: ["muito"] },
        gostar: { tags: ["gostar"], err: ["gostar", "regencia"] },
        a_personal: { tags: ["a_personal"], err: ["a_personal"] },
        perfeito_composto: { tags: ["perfeito_composto", "perfeito"], err: ["perfeito_composto", "tempo"] },
        subjuntivo: { tags: ["subjuntivo", "conjunciones", "subj_imperfeito"], err: ["subjuntivo"] },
        futuro_subj: { tags: ["futuro_subj"], err: ["futuro_subj", "subjuntivo"] },
        inf_pessoal: { tags: ["inf_pessoal"], err: ["inf_pessoal"] },
        pronome: { tags: ["pronombres", "colocacao"], err: ["pronome", "colocacao"] },
        colocacao: { tags: ["colocacao", "pronombres"], err: ["colocacao", "pronome"] },
        crase: { tags: ["crase", "horas"], err: ["crase", "contraccion"], forms: "prep" },
        ortografia: { err: ["ortografia"], vocab: true },
        tilde: { err: ["ortografia"], vocab: true },
        nasal: { tags: ["plurales"], err: ["ortografia", "plural"], vocab: true },
        espanol: { tags: ["lexico", "muito"], err: ["espanol", "falso_amigo", "muito"], vocab: true },
        falso_amigo: { tags: ["falsos_amigos"], err: ["falso_amigo", "espanol"], vocab: true },
        lexico: { tags: ["lexico", "falsos_amigos"], err: ["falso_amigo", "espanol"], vocab: true },
        tempo: { tags: ["perf_imperf", "imperfeito", "perfeito", "futuro", "condicional"], err: ["tempo", "perfeito_composto"] },
        persona: { tags: ["presente", "irregulares"], err: ["persona"] },
        ser_estar: { tags: ["ser_estar"] },
        participio: { tags: ["participio", "pasiva"], err: ["participio", "concordancia"] },
        verbo_irregular: { tags: ["irregulares", "perfeito"], err: ["verbo_irregular", "participio"] },
        regularizacion: { tags: ["irregulares", "perfeito"], err: ["verbo_irregular", "participio"] },
        orden: { tags: ["colocacao", "pronombres", "conectores"], err: ["colocacao", "pronome"] },
        faltante: { tags: ["articulos", "contracciones", "regencia"], err: ["articulo", "contraccion", "regencia"] },
        sobrante: { tags: ["a_personal", "ir_inf", "gostar"], err: ["a_personal", "preposicion", "gostar"] }
      }
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
