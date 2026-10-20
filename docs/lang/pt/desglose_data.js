/*
 * «🔎 Palabra por palabra» (docs/js/desglose.js): lo que es del portugués.
 *
 * El núcleo no sabe portugués: de acá saca los pronombres átonos y su
 * función (me, te, se, lhe, o, a), los que se pegan con guion (chama-se,
 * fazê-lo), el auxiliar de los tiempos compuestos (tenho feito, tinha
 * feito), las perífrasis (estou falando, vou fazer), las locuciones y las
 * palabras gramaticales que más confunden (a gente, tudo/todo, até), las
 * palabras que no son verbos aunque lo parezcan (como, casa, obrigado) y
 * en qué semana la teoría presenta cada tiempo: antes de esa semana el
 * desglose dice «pasado», «futuro»… y no el nombre portugués.
 */
(function (root) {
  "use strict";
  var L = root.LANG = root.LANG || {};
  L.rules = L.rules || {};

  L.rules.desglose = {
    /* Pronombres átonos (ver it/desglose_data.js).  prev: artículo que
       es pronombre solo después de estas palabras (eu a vi). */
    clitics: {
      me: { es: "me / a mí", p: [0], fn: ["od", "oi", "refl"] },
      te: { es: "te / a vos", p: [1], fn: ["od", "oi", "refl"] },
      se: { es: "se", p: [2, 5], fn: ["refl", "imp"], conj: true },
      lhe: { es: "le (a usted, a él, a ella)", fn: ["oi"] },
      lhes: { es: "les (a ustedes, a ellos)", fn: ["oi"] },
      nos: { es: "nos", p: [3], fn: ["od", "oi", "refl"], amb: true },
      o: { es: "lo (también «a usted»)", fn: ["od"], amb: true, prev: true },
      a: { es: "la (también «a usted»)", fn: ["od"], amb: true, prev: true },
      os: { es: "los", fn: ["od"], amb: true, prev: true },
      as: { es: "las", fn: ["od"], amb: true, prev: true }
    },
    // o, a, os, as are pronouns only after these (eu a vi, não o conheço).
    prevClitic: ["eu", "você", "ele", "ela", "nós", "vocês", "eles", "elas", "não", "já", "que", "nunca",
      "também", "sempre", "só", "ainda", "quem"],
    position: "en Brasil va antes del verbo, aun al empezar la frase; la norma escrita lo pega detrás con guion (*dá-me*)",
    oiVerbs: ["dar", "dizer", "pedir", "perguntar", "mandar", "trazer", "emprestar", "contar", "mostrar", "explicar",
      "ensinar", "agradecer", "responder", "escrever", "passar", "ligar", "informar", "enviar", "permitir",
      "falar", "custar", "parecer", "interessar", "faltar", "doer", "servir", "vender", "oferecer", "avisar"],
    reflRe: "-se$",
    reflMake: ["$", "-se"],
    // The meaning of a reflexive verb without its pronoun, when it changes.
    plainEs: { "acordarse": "recordar", "quedarse": "quedar", "irse": "ir" },
    // A modal before an infinitive: the pronoun goes with the infinitive.
    modals: ["poder", "dever", "querer", "precisar", "saber"],
    // Auxiliary that makes a compound with a participle nobody knows (avrebbe immaginato).
    auxGuess: ["ter"],
    // The meaning of a verb when the glossary gives an expression (piacere: «mucho gusto»).
    verbEs: {},
    reflUnmake: ["-se$", ""],
    infRe: "(ar|er|ir)$",
    guess: [["(amos|emos|imos|am|em|as|es|a|e|o)$", "ar", "er", "ir"]],
    ppGuess: [["ad[oa]s?$", "ar"], ["id[oa]s?$", "er", "ir"]],

    /* Pronouns glued with a hyphen (chama-se, fazê-lo).  lo, la…: after
       an infinitive that loses its -r (fazer → fazê-lo). */
    enclitic: {
      hyphen: true,
      suffixes: ["lhes", "lhe", "los", "las", "nos", "nas", "me", "te", "se", "lo", "la", "no", "na", "os", "as", "o", "a"],
      es: { me: "me", te: "te", se: "se", lhe: "le", lhes: "les", nos: "nos", o: "lo", a: "la", os: "los", as: "las",
        lo: "lo", la: "la", los: "los", las: "las", no: "lo", na: "la", nas: "las" },
      rLoss: ["lo", "la", "los", "las"],
      // forms that lose their last consonant before lo/la: fi-lo = fiz + o
      lost: { fi: ["fazer", "fiz", "perfeito", 0], "fê": ["fazer", "fez", "perfeito", 2], "fá": ["fazer", "faz", "presente", 2],
        di: ["dizer", "diz", "presente", 2], "trá": ["trazer", "traz", "presente", 2], qui: ["querer", "quis", "perfeito", 0],
        pu: ["pôr", "pus", "perfeito", 0], "pô": ["pôr", "pôs", "perfeito", 2] },
      // a verb the glossary lacks (constatou-se): explained with these pronouns
      sLoss: true,
      bare: ["se", "me", "te", "lhe", "lhes"],
      bareRe: "(ou|eu|iu|ram|am|em|ei|a|e)$",
      note: "pronombre pegado con guion, como en la norma escrita (en Brasil se habla con el pronombre delante)"
    },

    aux: {
      ter: { presente: "perfeitoComposto", imperfeito: "maisQuePerfeitoComposto", futuro: "futuroComposto",
        condicional: "condicionalComposto", subjPresente: "subjPerfeito", subjImperfeito: "subjMaisQuePerfeito",
        subjFuturo: "subjFuturoComposto" },
      haver: { imperfeito: "maisQuePerfeitoComposto", futuro: "futuroComposto", condicional: "condicionalComposto",
        subjImperfeito: "subjMaisQuePerfeito" }
    },
    between: ["já", "sempre", "nunca", "não", "muito", "bem", "também", "ainda", "me", "te", "se", "nos", "lhe"],
    peri: {
      estar: { form: "gerundio", es: "acción en curso, como «estoy haciendo»" },
      ir: { form: "infinitivo", es: "futuro cercano, como «voy a hacer»", tenses: ["presente", "imperfeito"] }
    },
    // Colloquial forms of the spoken language.
    colloquial: { "tô": "estou", "tá": "está", "tão": "estão", "tava": "estava", "tamo": "estamos", "cê": "você",
      "pra": "para", "pro": "para o", "pros": "para os" },

    elide: { "d'": "de" },
    // Contractions beyond the article ones of LANG.rules.banca.contr.
    contr: { deste: ["de", "este"], desta: ["de", "esta"], desse: ["de", "esse"], dessa: ["de", "essa"],
      disso: ["de", "isso"], disto: ["de", "isto"], daquele: ["de", "aquele"], daquela: ["de", "aquela"],
      daquilo: ["de", "aquilo"], dele: ["de", "ele"], dela: ["de", "ela"], deles: ["de", "eles"], delas: ["de", "elas"],
      daqui: ["de", "aqui"], dali: ["de", "ali"], neste: ["em", "este"], nesta: ["em", "esta"], nesse: ["em", "esse"],
      nessa: ["em", "essa"], nisso: ["em", "isso"], nisto: ["em", "isto"], naquele: ["em", "aquele"],
      naquela: ["em", "aquela"], nele: ["em", "ele"], nela: ["em", "ela"], "àquele": ["a", "aquele"],
      "àquela": ["a", "aquela"], pra: ["para", "a"], pro: ["para", "o"] },
    // After a conjugated form of these no second conjugated verb.
    copula: ["ser", "estar", "ficar", "parecer"],
    noImpvAfter: ["não", "nunca"],

    loc: [
      { m: "me vê", es: "dame, poneme (al pedir en un bar o un negocio: «¿me ves…?» no)" },
      { m: "a gente", es: "nosotros (con el verbo en 3.ª persona del singular: *a gente vai* = vamos)" },
      { m: "o que", es: "qué / lo que" },
      { m: "tudo bem", es: "¿todo bien? / todo bien (*tudo*, no «todo»)" },
      { m: "tá bom", es: "está bien, dale" },
      { m: "de nada", es: "de nada" },
      { m: "com licença", es: "permiso" },
      { m: "pois é", es: "y sí, así es" },
      { m: "tanto faz", es: "da igual" },
      { m: "sei lá", es: "qué sé yo" },
      { m: "foi mal", es: "perdón, fue sin querer (coloquial)" },
      { m: "já que", es: "ya que" },
      { m: "por isso", es: "por eso" },
      { m: "ou seja", es: "o sea" },
      { m: "no fim das contas", es: "al final de cuentas" },
      { m: "à vontade", es: "cómodo, como en tu casa" },
      { m: "ainda não", es: "todavía no" },
      { m: "deus me livre", es: "¡Dios me libre!, ¡ni loco!" },
      { m: "antes de tudo", es: "ante todo" },
      { m: "até que ponto", es: "hasta qué punto" },
      { m: "@dar certo", es: "salir bien, funcionar" },
      { m: "@dar uma olhada", es: "echar un vistazo" },
      { m: "@achar que", es: "creer que, opinar (*achar* = encontrar, pero *acho que* = creo que)" },
      { m: "@estar com fome", es: "tener hambre (*estar com* + fome, sede, frio, calor, sono, pressa)" },
      { m: "@estar com sede", es: "tener sed (*estar com* + fome, sede, frio, calor, sono, pressa)" },
      { m: "@estar com frio", es: "tener frío (*estar com* + fome, sede, frio, calor, sono, pressa)" },
      { m: "@estar com calor", es: "tener calor (*estar com* + fome, sede, frio, calor, sono, pressa)" },
      { m: "@estar com sono", es: "tener sueño (*estar com* + fome, sede, frio, calor, sono, pressa)" },
      { m: "@estar com pressa", es: "estar apurado (*estar com* + fome, sede, frio, calor, sono, pressa)" },
      { m: "@ter que", es: "tener que (obligación)" },
      { m: "@morrer de", es: "morirse de (vergüenza, hambre, risa…)" },
      { m: "@ter cuidado", es: "tener cuidado" },
      { m: "@fazer falta", es: "hacer falta" },
      { m: "faz tempo", es: "hace tiempo" },
      { m: "@valer a pena", es: "valer la pena" },
      { m: "se @tratar de", es: "se trata de" },
      { m: "@dar uma volta", es: "dar una vuelta, pasear" },
      { m: "@ter nada a ver", es: "no tener nada que ver" },
      { m: "fala sério", es: "¡dejate de joder!, ¡no te puedo creer! (incredulidad)" },
      { m: "@dar ruim", es: "salir mal (coloquial)" },
      { m: "@dar mole", es: "descuidarse, regalarse (coloquial)" },
      { m: "de brincadeira", es: "en broma (*tá de brincadeira?* = ¿me estás cargando?)" },
      { m: "de boa", es: "tranquilo, sin drama (coloquial)" },
      { m: "gente boa", es: "buena gente (invariable: *ele é gente boa*)" },
      { m: "é preciso", es: "hace falta, es necesario" },
      { m: "pôr do sol", es: "atardecer, puesta del sol" }
    ],

    /* Fixed explanations: the grammar words that confuse most. */
    fn: {
      tudo: "«todo» como pronombre (todas las cosas): *tudo bem*, *quanto é tudo?*; con sustantivo va *todo/toda*",
      todo: "todo/toda con sustantivo (*o dia todo* = todo el día; *todo dia* = todos los días); solo = *tudo*",
      toda: "toda, con sustantivo (*toda semana* = todas las semanas); solo = *tudo*",
      "até": "hasta (*até logo*, *até amanhã*); también «incluso»",
      "né": "¿no?, ¿viste? (= *não é?*)",
      mas: "pero",
      mais: "más",
      esse: "ese; en Brasil también «este»",
      essa: "esa; en Brasil también «esta»",
      isso: "eso; en Brasil también «esto»",
      este: "este (más formal que *esse*)",
      isto: "esto (más formal que *isso*)",
      "você": "vos / usted, con el verbo en 3.ª persona (*você fala*)",
      "vocês": "ustedes, con el verbo en 3.ª persona del plural",
      "já": "ya",
      ainda: "todavía",
      "só": "solo, solamente",
      "lá": "allá, ahí",
      "aí": "ahí; también «entonces» al contar",
      "cá": "acá",
      se: "si (condicional): *se você quiser* = si querés",
      "então": "entonces",
      "também": "también",
      "cadê": "¿dónde está? (coloquial)",
      tomara: "¡ojalá! (fórmula fija, de *tomar*)",
      melhoras: "¡que te mejores! (plural de *melhora*, mejoría)",
      "moço": "joven, señor (para llamar a alguien)",
      "ué": "¡uy!, ¿cómo? (sorpresa)",
      "pra": "para (coloquial)",
      "tá": "está (coloquial)",
      "tô": "estoy (coloquial, de *estou*)"
    },

    notVerb: ["para", "nada", "caso", "via", "junto", "parte", "como", "casa", "mate", "posto", "visto", "corte", "estado", "obrigado", "obrigada", "livre", "demora",
      "argumento", "atraso", "beijo", "beijos", "morro", "caminho", "conta", "sobre", "entre", "segundo", "fora",
      "gosto", "jogo", "passeio", "almoço", "janta", "calor", "canto", "ponto", "troco", "volta", "cedo",
      "marco", "baixo", "alto", "chato", "tarde", "prova", "pena", "falta", "compra", "fim", "sério"],
    det: ["meu", "minha", "meus", "minhas", "seu", "sua", "seus", "suas", "nosso", "nossa", "esse", "essa", "este",
      "esta", "aquele", "aquela", "muito", "muita", "muitos", "muitas", "pouco", "pouca", "outro", "outra", "todo",
      "toda", "cada", "qualquer", "algum", "alguma", "nenhum", "nenhuma", "que", "qual", "quanto", "quanta",
      "bom", "boa", "grande", "segunda", "mesmo", "mesma", "primeiro", "primeira", "último", "última"],
    preps: ["de", "em", "para", "por", "com", "sem", "até", "sobre", "entre", "desde", "pra"],
    interrog: ["onde", "como", "quando", "quem", "porque", "não"],
    subj: ["eu", "tu", "você", "ele", "ela", "nós", "vocês", "eles", "elas", "gente"],
    relative: ["que", "quem", "onde"],
    names: ["martín", "sofía", "bia", "rafa", "tino", "josé", "ana", "pedro", "paulo", "maria", "joão", "lucas",
      "carla", "marcos", "júlia", "fernanda", "rodrigo", "beatriz", "camila", "gustavo", "juliana", "rafael",
      "mariana", "felipe", "gabriel", "luiza", "bruno", "clarice", "machado", "drummond", "vinicius", "caetano",
      "chico", "jorge", "guimarães", "cecília", "oswald", "mário", "manuel", "fernando", "lula", "getúlio"],

    /* «en esta frase»: the idiomatic use of a verb form, only when it stands
       alone in its clause («Valeu!», «…, sabe?») or before one of next. */
    idioms: {
      valeu: "gracias, dale (coloquial)",
      falou: "dale, chau (coloquial)",
      "falô": "dale, chau (coloquial)",
      beleza: "dale, bárbaro (coloquial)",
      imagina: "¡de nada!, ¡por favor!",
      "deixa": { es: "dejá que… (*deixa eu ver* = a ver, dejame ver)", next: ["eu"] },
      "sabe": "¿viste?, ¿sabés? (muletilla)",
      "olha": "mirá (para empezar a hablar)"
    },

    // tools/pt/curriculo.py TENSE_WEEK; presente from day one.
    weeks: { presente: 1, gerundio: 8, perfeito: 11, imperativo: 12, imperfeito: 15, futuro: 17, condicional: 18,
      perfeitoComposto: 21, maisQuePerfeitoComposto: 21, subjPresente: 23, subjFuturo: 27, subjImperfeito: 28,
      infPessoal: 29, subjPerfeito: 30, subjMaisQuePerfeito: 30, subjFuturoComposto: 30, futuroComposto: 30,
      condicionalComposto: 30, maisQuePerfeito: 41 },
    nameWeek: { presente: 23 },
    desc: {
      presente: "presente",
      imperativo: "para pedir u ordenar",
      perfeito: "pasado, como «comí»",
      imperfeito: "pasado que dura o se repite, como «comía»",
      maisQuePerfeito: "pasado anterior, literario, como «había comido»",
      futuro: "futuro",
      condicional: "condicional, como «comería»",
      subjPresente: "subjuntivo, como «que coma»",
      subjImperfeito: "subjuntivo pasado, como «si comiera»",
      subjFuturo: "subjuntivo futuro, como «cuando coma»",
      infPessoal: "infinitivo con persona",
      perfeitoComposto: "pasado que llega hasta hoy, como «vengo comiendo»",
      maisQuePerfeitoComposto: "pasado anterior, como «había comido»",
      futuroComposto: "futuro compuesto, como «habré comido»",
      condicionalComposto: "condicional pasado, como «habría comido»",
      subjPerfeito: "subjuntivo pasado, como «que haya comido»",
      subjMaisQuePerfeito: "subjuntivo pasado, como «si hubiera comido»",
      subjFuturoComposto: "subjuntivo futuro compuesto, como «cuando haya comido»"
    },
    subjTenses: ["subjPresente", "subjImperfeito", "subjFuturo", "subjPerfeito", "subjMaisQuePerfeito", "subjFuturoComposto"],
    subjTriggers: ["que", "se", "quando", "embora", "caso", "talvez", "quem", "onde", "enquanto", "assim", "logo",
      "mesmo", "até", "para", "sem", "tomara", "oxalá", "quanto", "conforme", "depois", "antes", "como", "qualquer"],
    impvPersons: { tu: "tu", "você": "você", "nós": "nós", "vós": "vós", "vocês": "vocês" }
  };
})(typeof window !== "undefined" ? window : globalThis);
