/*
 * Motor de conjugação — generates Brazilian Portuguese verb forms on demand so
 * the game can mint unlimited drills instead of shipping a frozen list.
 *
 * Norm: Brazilian urban educated norm, spelling of the 1990 Agreement (voo,
 * leem, veem, deem, creem, sem trema).
 *
 * Covers every mood and tense a C1 learner is expected to produce:
 *   simple:   presente, perfeito, imperfeito, maisQuePerfeito, futuro,
 *             condicional (futuro do pretérito), subjPresente,
 *             subjImperfeito, subjFuturo, infPessoal
 *   compound: ter + particípio (perfeitoComposto = tenho falado, …)
 * plus imperative(), participle()/participles(), gerund().
 *
 * How forms are derived (so that one stored stem covers several tenses):
 *   - subjuntivo presente = stem of «eu» in the presente + a/e endings
 *     (faço → faça, tenho → tenha, durmo → durma, sigo → siga);
 *   - mais-que-perfeito, subjuntivo imperfeito and futuro do subjuntivo come
 *     from the 3rd plural of the perfeito minus -ram (fizeram → fizera,
 *     fizesse, fizer);
 *   - imperative «tu» = 3rd singular of the presente (fala, faz, tem, põe)
 *     except ser (sê); «vós» = 2nd plural minus -s (falai, tende) except ser
 *     (sede); você/nós/vocês = subjuntivo presente.
 *
 * Orthography handled by rule: -car → qu (fiquei, fique), -gar → gu
 * (cheguei), -çar → c (comecei), -cer/-cir → ç (conheço), -ger/-gir → j
 * (protejo, dirijo), -guer/-guir → g (ergo, sigo), -ear → -eio (passeio),
 * -iar of the «MARIO» group (mediar, ansiar, remediar, incendiar, odiar →
 * odeio), -air (saio, saímos), -uir (inclui, incluímos), -uzir (produz),
 * hiatus accents (saí, saía, saído, construíram, saíres).
 * Stem-vowel alternations are declared per verb with `alt`:
 *   "e-i"  1st sg. present + whole subj. (preferir: prefiro, prefira)
 *   "o-u"  idem with o → u (dormir: durmo, durma; cobrir: cubro)
 *   "u-o"  2nd/3rd sg. and 3rd pl. present (subir: sobes, sobe, sobem)
 *   "e-i*" / "o-u*"  every stressed-stem form (agredir: agride; polir: pule)
 *
 * Reflexive verbs are written with a hyphen (levantar-se) and conjugated with
 * the pronoun before the verb, as spoken and written in Brazil: «me levanto»,
 * compound «tenho me levantado» (clitic before the participle).  The forms
 * with ênclise (levanto-me, tenho-me levantado) are returned by accepted().
 * participle() and gerund() of a reflexive return the bare form (levantado,
 * levantando), like the Italian engine.
 *
 * Double participles: participle(inf) returns the irregular one when the verb
 * has it (pago, aceito, entregue, morto…); participles(inf) returns both plus
 * which one goes with ter and which with ser.  Compound tenses use, with ter,
 * the regular participle (tinha aceitado, tinha entregado, tinha salvado),
 * except pagar, ganhar, gastar, where Brazil clearly prefers the short form
 * (tinha pago, tinha ganho, tinha gasto).  accepted() accepts both.
 */
(function (root) {
  "use strict";

  var PERSONS = ["eu", "tu", "ele/ela/você", "nós", "vós", "eles/elas/vocês"];
  var REFL_PRON = ["me", "te", "se", "nos", "vos", "se"];

  var END = {
    presente: {
      ar: ["o", "as", "a", "amos", "ais", "am"],
      er: ["o", "es", "e", "emos", "eis", "em"],
      ir: ["o", "es", "e", "imos", "is", "em"],
      air: ["io", "is", "i", "ímos", "ís", "em"],     // saio, sais, sai, saímos
      uir: ["o", "is", "i", "ímos", "ís", "em"]       // incluo, incluis, inclui
    },
    perfeito: {
      ar: ["ei", "aste", "ou", "amos", "astes", "aram"],
      er: ["i", "este", "eu", "emos", "estes", "eram"],
      ir: ["i", "iste", "iu", "imos", "istes", "iram"]
    },
    imperfeito: {
      ar: ["ava", "avas", "ava", "ávamos", "áveis", "avam"],
      er: ["ia", "ias", "ia", "íamos", "íeis", "iam"]
    },
    futuro: ["ei", "ás", "á", "emos", "eis", "ão"],
    condicional: ["ia", "ias", "ia", "íamos", "íeis", "iam"],
    subjPresente: {
      ar: ["e", "es", "e", "emos", "eis", "em"],
      er: ["a", "as", "a", "amos", "ais", "am"]
    }
  };

  /* ---------------------------------------------------------------- lexicon
   * Only deviations from the regular pattern are stored.
   *   pres / perf / imp / subj: full 6-form arrays     presEu: only «eu»
   *   futStem: stem of futuro and condicional (far-, dir-, trar-, por-)
   *   pp: the only participle (feito)    ppIrr: short form of a double one
   *   ppTerIrr: the short form is the one used with ter (pago, ganho, gasto)
   *   ger, impTu, impVos: overrides      noImpv: no imperative
   *   derive: [base verb, prefix]  (manter = man + ter)
   *   alt: stem-vowel alternation (see header)
   *   persons: persons that make sense (chover: only ele)
   *   defective: some persons do not exist (reaver)                        */
  var VERBS = {
    /* --- os fundamentais --- */
    ser: {
      es: "ser",
      pres: ["sou", "és", "é", "somos", "sois", "são"],
      perf: ["fui", "foste", "foi", "fomos", "fostes", "foram"],
      imp: ["era", "eras", "era", "éramos", "éreis", "eram"],
      subj: ["seja", "sejas", "seja", "sejamos", "sejais", "sejam"],
      impTu: "sê", impVos: "sede"
    },
    estar: {
      es: "estar",
      pres: ["estou", "estás", "está", "estamos", "estais", "estão"],
      perf: ["estive", "estiveste", "esteve", "estivemos", "estivestes", "estiveram"],
      subj: ["esteja", "estejas", "esteja", "estejamos", "estejais", "estejam"]
    },
    ter: {
      es: "tener",
      pres: ["tenho", "tens", "tem", "temos", "tendes", "têm"],
      perf: ["tive", "tiveste", "teve", "tivemos", "tivestes", "tiveram"],
      imp: ["tinha", "tinhas", "tinha", "tínhamos", "tínheis", "tinham"]
    },
    haver: {
      es: "haber",
      pres: ["hei", "hás", "há", "havemos", "haveis", "hão"],
      perf: ["houve", "houveste", "houve", "houvemos", "houvestes", "houveram"],
      subj: ["haja", "hajas", "haja", "hajamos", "hajais", "hajam"]
    },
    ir: {
      es: "ir",
      pres: ["vou", "vais", "vai", "vamos", "ides", "vão"],
      perf: ["fui", "foste", "foi", "fomos", "fostes", "foram"],
      subj: ["vá", "vás", "vá", "vamos", "vades", "vão"]
    },
    vir: {
      es: "venir",
      pres: ["venho", "vens", "vem", "vimos", "vindes", "vêm"],
      perf: ["vim", "vieste", "veio", "viemos", "viestes", "vieram"],
      imp: ["vinha", "vinhas", "vinha", "vínhamos", "vínheis", "vinham"],
      pp: "vindo"
    },
    fazer: {
      es: "hacer",
      pres: ["faço", "fazes", "faz", "fazemos", "fazeis", "fazem"],
      perf: ["fiz", "fizeste", "fez", "fizemos", "fizestes", "fizeram"],
      futStem: "far", pp: "feito"
    },
    dizer: {
      es: "decir",
      pres: ["digo", "dizes", "diz", "dizemos", "dizeis", "dizem"],
      perf: ["disse", "disseste", "disse", "dissemos", "dissestes", "disseram"],
      futStem: "dir", pp: "dito"
    },
    trazer: {
      es: "traer",
      pres: ["trago", "trazes", "traz", "trazemos", "trazeis", "trazem"],
      perf: ["trouxe", "trouxeste", "trouxe", "trouxemos", "trouxestes", "trouxeram"],
      futStem: "trar"
    },
    poder: {
      es: "poder",
      presEu: "posso",
      perf: ["pude", "pudeste", "pôde", "pudemos", "pudestes", "puderam"],
      noImpv: true
    },
    querer: {
      es: "querer",
      pres: ["quero", "queres", "quer", "queremos", "quereis", "querem"],
      perf: ["quis", "quiseste", "quis", "quisemos", "quisestes", "quiseram"],
      subj: ["queira", "queiras", "queira", "queiramos", "queirais", "queiram"]
    },
    saber: {
      es: "saber",
      presEu: "sei",
      perf: ["soube", "soubeste", "soube", "soubemos", "soubestes", "souberam"],
      subj: ["saiba", "saibas", "saiba", "saibamos", "saibais", "saibam"]
    },
    caber: {
      es: "caber",
      presEu: "caibo",
      perf: ["coube", "coubeste", "coube", "coubemos", "coubestes", "couberam"],
      noImpv: true
    },
    ver: {
      es: "ver",
      pres: ["vejo", "vês", "vê", "vemos", "vedes", "veem"],
      perf: ["vi", "viste", "viu", "vimos", "vistes", "viram"],
      pp: "visto"
    },
    dar: {
      es: "dar",
      pres: ["dou", "dás", "dá", "damos", "dais", "dão"],
      perf: ["dei", "deste", "deu", "demos", "destes", "deram"],
      subj: ["dê", "dês", "dê", "demos", "deis", "deem"]
    },
    "pôr": {
      es: "poner",
      pres: ["ponho", "pões", "põe", "pomos", "pondes", "põem"],
      perf: ["pus", "puseste", "pôs", "pusemos", "pusestes", "puseram"],
      imp: ["punha", "punhas", "punha", "púnhamos", "púnheis", "punham"],
      futStem: "por", pp: "posto", ger: "pondo"
    },
    ler: {
      es: "leer",
      pres: ["leio", "lês", "lê", "lemos", "ledes", "leem"]
    },
    crer: {
      es: "creer",
      pres: ["creio", "crês", "crê", "cremos", "credes", "creem"]
    },
    ouvir: { es: "oír/escuchar", presEu: "ouço" },
    pedir: { es: "pedir", presEu: "peço" },
    medir: { es: "medir", presEu: "meço" },
    impedir: { es: "impedir", presEu: "impeço" },
    "despedir-se": { es: "despedirse", presEu: "despeço" },
    perder: { es: "perder", presEu: "perco" },
    valer: { es: "valer", presEu: "valho" },
    sair: { es: "salir" },
    cair: { es: "caer" },
    rir: {
      es: "reír",
      pres: ["rio", "ris", "ri", "rimos", "rides", "riem"]
    },
    requerer: {
      es: "requerir/solicitar",
      pres: ["requeiro", "requeres", "requer", "requeremos", "requereis", "requerem"]
    },
    prover: {
      es: "proveer",
      pres: ["provejo", "provês", "provê", "provemos", "provedes", "proveem"]
    },
    reaver: {
      es: "recuperar",
      // Defective: only the forms where haver keeps the -v-.
      pres: [null, null, null, "reavemos", "reaveis", null],
      perf: ["reouve", "reouveste", "reouve", "reouvemos", "reouvestes", "reouveram"],
      subj: [null, null, null, null, null, null],
      defective: true, noImpv: true
    },
    dormir: { es: "dormir", alt: "o-u" },
    doer: {
      es: "doler",
      pres: ["doo", "dóis", "dói", "doemos", "doeis", "doem"],
      persons: [2, 5]
    },
    construir: {
      es: "construir",
      pres: ["construo", "constróis", "constrói", "construímos", "construís", "constroem"],
      variants: { presente: { 1: ["construis"], 2: ["construi"], 5: ["construem"] } }
    },
    destruir: {
      es: "destruir",
      pres: ["destruo", "destróis", "destrói", "destruímos", "destruís", "destroem"],
      variants: { presente: { 1: ["destruis"], 2: ["destrui"], 5: ["destruem"] } }
    },
    proibir: {
      es: "prohibir",
      pres: ["proíbo", "proíbes", "proíbe", "proibimos", "proibis", "proíbem"],
      subj: ["proíba", "proíbas", "proíba", "proibamos", "proibais", "proíbam"]
    },
    reunir: {
      es: "reunir",
      pres: ["reúno", "reúnes", "reúne", "reunimos", "reunis", "reúnem"],
      subj: ["reúna", "reúnas", "reúna", "reunamos", "reunais", "reúnam"]
    },
    "reunir-se": {
      es: "reunirse",
      pres: ["reúno", "reúnes", "reúne", "reunimos", "reunis", "reúnem"],
      subj: ["reúna", "reúnas", "reúna", "reunamos", "reunais", "reúnam"]
    },

    /* --- derivados --- */
    manter: { es: "mantener", derive: ["ter", "man"] },
    conter: { es: "contener", derive: ["ter", "con"] },
    obter: { es: "obtener", derive: ["ter", "ob"] },
    deter: { es: "detener", derive: ["ter", "de"] },
    reter: { es: "retener", derive: ["ter", "re"] },
    entreter: { es: "entretener", derive: ["ter", "entre"] },
    abster: { es: "abstener", derive: ["ter", "abs"] },
    "abster-se": { es: "abstenerse", derive: ["ter", "abs"] },
    intervir: { es: "intervenir", derive: ["vir", "inter"] },
    convir: { es: "convenir", derive: ["vir", "con"] },
    provir: { es: "provenir", derive: ["vir", "pro"] },
    propor: { es: "proponer", derive: ["pôr", "pro"] },
    compor: { es: "componer", derive: ["pôr", "com"] },
    supor: { es: "suponer", derive: ["pôr", "su"] },
    dispor: { es: "disponer", derive: ["pôr", "dis"] },
    impor: { es: "imponer", derive: ["pôr", "im"] },
    repor: { es: "reponer", derive: ["pôr", "re"] },
    expor: { es: "exponer", derive: ["pôr", "ex"] },
    opor: { es: "oponer", derive: ["pôr", "o"] },
    prever: { es: "prever", derive: ["ver", "pre"] },
    rever: { es: "rever/volver a ver", derive: ["ver", "re"] },
    reler: { es: "releer", derive: ["ler", "re"] },
    desfazer: { es: "deshacer", derive: ["fazer", "des"] },
    refazer: { es: "rehacer", derive: ["fazer", "re"] },
    satisfazer: { es: "satisfacer", derive: ["fazer", "satis"] },
    contradizer: { es: "contradecir", derive: ["dizer", "contra"] },
    predizer: { es: "predecir", derive: ["dizer", "pre"] },
    sorrir: { es: "sonreír", derive: ["rir", "sor"] },

    /* --- particípio irregular ou duplo --- */
    abrir: { es: "abrir", pp: "aberto" },
    cobrir: { es: "cubrir", alt: "o-u", pp: "coberto" },
    descobrir: { es: "descubrir", alt: "o-u", pp: "descoberto" },
    escrever: { es: "escribir", pp: "escrito" },
    descrever: { es: "describir", pp: "descrito" },
    pagar: { es: "pagar", ppIrr: "pago", ppTerIrr: true },
    ganhar: { es: "ganar", ppIrr: "ganho", ppTerIrr: true },
    gastar: { es: "gastar", ppIrr: "gasto", ppTerIrr: true },
    aceitar: { es: "aceptar", ppIrr: "aceito" },
    entregar: { es: "entregar", ppIrr: "entregue" },
    eleger: { es: "elegir (por votación)", ppIrr: "eleito" },
    morrer: { es: "morir", ppIrr: "morto" },
    matar: { es: "matar", ppIrr: "morto" },
    prender: { es: "arrestar/sujetar", ppIrr: "preso" },
    salvar: { es: "salvar/guardar (un archivo)", ppIrr: "salvo" },
    acender: { es: "encender", ppIrr: "aceso" },
    imprimir: { es: "imprimir", ppIrr: "impresso" },
    limpar: { es: "limpiar", ppIrr: "limpo" },
    soltar: { es: "soltar", ppIrr: "solto" },
    suspender: { es: "suspender", ppIrr: "suspenso" },
    pegar: { es: "agarrar/tomar", ppIrr: "pego" },
    expulsar: { es: "expulsar", ppIrr: "expulso" },
    secar: { es: "secar", ppIrr: "seco" },
    extinguir: { es: "extinguir", ppIrr: "extinto" },

    /* --- alternância vocálica --- */
    preferir: { es: "preferir", alt: "e-i" },
    sentir: { es: "sentir", alt: "e-i" },
    "sentir-se": { es: "sentirse", alt: "e-i" },
    vestir: { es: "vestir/ponerse (ropa)", alt: "e-i" },
    "vestir-se": { es: "vestirse", alt: "e-i" },
    servir: { es: "servir", alt: "e-i" },
    repetir: { es: "repetir", alt: "e-i" },
    seguir: { es: "seguir", alt: "e-i" },
    conseguir: { es: "conseguir/lograr", alt: "e-i" },
    perseguir: { es: "perseguir", alt: "e-i" },
    mentir: { es: "mentir", alt: "e-i" },
    competir: { es: "competir", alt: "e-i" },
    divertir: { es: "divertir", alt: "e-i" },
    "divertir-se": { es: "divertirse", alt: "e-i" },
    advertir: { es: "advertir", alt: "e-i" },
    referir: { es: "referir", alt: "e-i" },
    "referir-se": { es: "referirse", alt: "e-i" },
    sugerir: { es: "sugerir", alt: "e-i" },
    digerir: { es: "digerir", alt: "e-i" },
    conferir: { es: "verificar/conferir", alt: "e-i" },
    transferir: { es: "transferir", alt: "e-i" },
    inserir: { es: "insertar", alt: "e-i" },
    refletir: { es: "reflejar/reflexionar", alt: "e-i" },
    investir: { es: "invertir", alt: "e-i" },
    ferir: { es: "herir", alt: "e-i" },
    despir: { es: "desvestir", alt: "e-i" },
    tossir: { es: "toser", alt: "o-u" },
    engolir: { es: "tragar", alt: "o-u" },
    subir: { es: "subir", alt: "u-o" },
    fugir: { es: "huir", alt: "u-o" },
    consumir: { es: "consumir", alt: "u-o" },
    sumir: { es: "desaparecer", alt: "u-o" },
    cuspir: { es: "escupir", alt: "u-o" },
    sacudir: { es: "sacudir", alt: "u-o" },
    acudir: { es: "acudir", alt: "u-o" },
    polir: { es: "pulir", alt: "o-u*" },
    agredir: { es: "agredir", alt: "e-i*" },
    progredir: { es: "progresar", alt: "e-i*" },
    prevenir: { es: "prevenir", alt: "e-i*" },

    /* --- -ar regulares --- */
    falar: { es: "hablar" },
    morar: { es: "vivir (en un lugar)" },
    trabalhar: { es: "trabajar" },
    estudar: { es: "estudiar" },
    gostar: { es: "gustar (gostar de)" },
    precisar: { es: "necesitar" },
    lembrar: { es: "recordar" },
    "lembrar-se": { es: "acordarse" },
    pensar: { es: "pensar" },
    achar: { es: "encontrar/creer, opinar" },
    chegar: { es: "llegar" },
    ficar: { es: "quedarse/quedar" },
    "começar": { es: "empezar" },
    acordar: { es: "despertarse" },
    levantar: { es: "levantar" },
    "levantar-se": { es: "levantarse" },
    chamar: { es: "llamar" },
    "chamar-se": { es: "llamarse" },
    sentar: { es: "sentar" },
    "sentar-se": { es: "sentarse" },
    deitar: { es: "acostar" },
    "deitar-se": { es: "acostarse" },
    lavar: { es: "lavar" },
    "lavar-se": { es: "lavarse" },
    "preocupar-se": { es: "preocuparse" },
    "queixar-se": { es: "quejarse" },
    "casar-se": { es: "casarse" },
    "mudar-se": { es: "mudarse" },
    "acostumar-se": { es: "acostumbrarse" },
    "formar-se": { es: "recibirse" },
    "atrasar-se": { es: "llegar tarde/atrasarse" },
    "apaixonar-se": { es: "enamorarse" },
    "esforçar-se": { es: "esforzarse" },
    "machucar-se": { es: "lastimarse" },
    "interessar-se": { es: "interesarse" },
    "aposentar-se": { es: "jubilarse" },
    namorar: { es: "estar de novio con/salir con" },
    casar: { es: "casarse (con)" },
    alugar: { es: "alquilar" },
    custar: { es: "costar", persons: [2, 5] },
    passear: { es: "pasear" },
    odiar: { es: "odiar" },
    ansiar: { es: "ansiar" },
    mediar: { es: "mediar" },
    remediar: { es: "remediar" },
    incendiar: { es: "incendiar" },
    analisar: { es: "analizar" },
    realizar: { es: "realizar" },
    solicitar: { es: "solicitar" },
    informar: { es: "informar" },
    enviar: { es: "enviar" },
    afirmar: { es: "afirmar" },
    ressaltar: { es: "resaltar" },
    sustentar: { es: "sostener" },
    indicar: { es: "indicar" },
    terminar: { es: "terminar" },
    levar: { es: "llevar" },
    tomar: { es: "tomar" },
    contar: { es: "contar" },
    perguntar: { es: "preguntar" },
    voltar: { es: "volver" },
    encontrar: { es: "encontrar" },
    acabar: { es: "terminar/acabar" },
    ajudar: { es: "ayudar" },
    "almoçar": { es: "almorzar" },
    jantar: { es: "cenar" },
    amar: { es: "amar" },
    andar: { es: "andar/caminar" },
    apagar: { es: "apagar/borrar" },
    apresentar: { es: "presentar" },
    aproveitar: { es: "aprovechar" },
    arrumar: { es: "ordenar/arreglar" },
    assinar: { es: "firmar" },
    avisar: { es: "avisar" },
    buscar: { es: "buscar/ir a buscar" },
    cantar: { es: "cantar" },
    cancelar: { es: "cancelar" },
    chorar: { es: "llorar" },
    cobrar: { es: "cobrar" },
    combinar: { es: "combinar/quedar en" },
    comprar: { es: "comprar" },
    comunicar: { es: "comunicar" },
    conversar: { es: "conversar/charlar" },
    considerar: { es: "considerar" },
    continuar: { es: "continuar/seguir" },
    convidar: { es: "invitar" },
    cozinhar: { es: "cocinar" },
    criar: { es: "crear/criar" },
    cuidar: { es: "cuidar" },
    "dançar": { es: "bailar" },
    deixar: { es: "dejar" },
    demorar: { es: "tardar/demorar" },
    desejar: { es: "desear" },
    desenhar: { es: "dibujar" },
    descansar: { es: "descansar" },
    desligar: { es: "apagar/cortar (el teléfono)" },
    economizar: { es: "ahorrar" },
    emprestar: { es: "prestar" },
    ensinar: { es: "enseñar" },
    entrar: { es: "entrar" },
    escutar: { es: "escuchar" },
    esperar: { es: "esperar" },
    evitar: { es: "evitar" },
    explicar: { es: "explicar" },
    faltar: { es: "faltar" },
    fechar: { es: "cerrar" },
    gritar: { es: "gritar" },
    guardar: { es: "guardar" },
    imaginar: { es: "imaginar" },
    jogar: { es: "jugar" },
    juntar: { es: "juntar" },
    ligar: { es: "llamar (por teléfono)/encender" },
    marcar: { es: "marcar/fijar (una cita)" },
    mandar: { es: "mandar/enviar" },
    melhorar: { es: "mejorar" },
    mostrar: { es: "mostrar" },
    mudar: { es: "cambiar" },
    nadar: { es: "nadar" },
    olhar: { es: "mirar" },
    organizar: { es: "organizar" },
    parar: { es: "parar/dejar de" },
    participar: { es: "participar" },
    passar: { es: "pasar" },
    pesquisar: { es: "investigar/buscar" },
    preparar: { es: "preparar" },
    procurar: { es: "buscar" },
    provar: { es: "probar" },
    quebrar: { es: "romper" },
    reclamar: { es: "quejarse/reclamar" },
    reservar: { es: "reservar" },
    respirar: { es: "respirar" },
    sonhar: { es: "soñar" },
    tirar: { es: "sacar/quitar" },
    tocar: { es: "tocar" },
    trocar: { es: "cambiar" },
    usar: { es: "usar" },
    viajar: { es: "viajar" },
    visitar: { es: "visitar" },
    votar: { es: "votar" },
    acreditar: { es: "creer" },
    beijar: { es: "besar" },
    brincar: { es: "jugar (los chicos)/bromear" },
    comemorar: { es: "festejar/celebrar" },
    concordar: { es: "estar de acuerdo" },
    confirmar: { es: "confirmar" },
    criticar: { es: "criticar" },
    destacar: { es: "destacar" },
    durar: { es: "durar" },
    errar: { es: "equivocarse/errar" },
    estacionar: { es: "estacionar" },
    experimentar: { es: "probar/experimentar" },
    fumar: { es: "fumar" },
    tentar: { es: "intentar" },
    utilizar: { es: "utilizar" },
    notar: { es: "notar" },
    observar: { es: "observar" },
    declarar: { es: "declarar" },
    apontar: { es: "señalar" },
    "alcançar": { es: "alcanzar" },
    "abraçar": { es: "abrazar" },
    "lançar": { es: "lanzar" },
    preocupar: { es: "preocupar" },
    mencionar: { es: "mencionar" },
    representar: { es: "representar" },
    comprovar: { es: "comprobar" },
    demonstrar: { es: "demostrar" },
    argumentar: { es: "argumentar" },
    questionar: { es: "cuestionar" },
    enfatizar: { es: "enfatizar" },
    apoiar: { es: "apoyar" },
    adorar: { es: "adorar" },
    copiar: { es: "copiar" },
    anunciar: { es: "anunciar" },
    negociar: { es: "negociar" },
    iniciar: { es: "iniciar" },
    voar: { es: "volar" },
    perdoar: { es: "perdonar" },
    atuar: { es: "actuar" },
    recear: { es: "temer" },
    nomear: { es: "nombrar" },
    bloquear: { es: "bloquear" },
    frear: { es: "frenar" },
    estrear: { es: "estrenar" },

    /* --- -er regulares --- */
    comer: { es: "comer" },
    beber: { es: "beber/tomar" },
    aprender: { es: "aprender" },
    correr: { es: "correr" },
    conhecer: { es: "conocer" },
    crescer: { es: "crecer" },
    defender: { es: "defender" },
    depender: { es: "depender" },
    descer: { es: "bajar" },
    dever: { es: "deber" },
    entender: { es: "entender" },
    compreender: { es: "comprender" },
    escolher: { es: "elegir" },
    esquecer: { es: "olvidar" },
    "esquecer-se": { es: "olvidarse" },
    mexer: { es: "mover/tocar" },
    merecer: { es: "merecer" },
    nascer: { es: "nacer" },
    oferecer: { es: "ofrecer" },
    obedecer: { es: "obedecer" },
    parecer: { es: "parecer" },
    "parecer-se": { es: "parecerse" },
    pertencer: { es: "pertenecer" },
    receber: { es: "recibir" },
    resolver: { es: "resolver" },
    responder: { es: "responder" },
    sofrer: { es: "sufrir" },
    vender: { es: "vender" },
    viver: { es: "vivir" },
    agradecer: { es: "agradecer" },
    chover: { es: "llover", persons: [2] },
    proteger: { es: "proteger" },
    reconhecer: { es: "reconocer" },
    aparecer: { es: "aparecer" },
    acontecer: { es: "pasar/suceder", persons: [2, 5] },
    estabelecer: { es: "establecer" },
    envolver: { es: "involucrar" },
    desenvolver: { es: "desarrollar" },
    devolver: { es: "devolver" },
    encher: { es: "llenar" },
    torcer: { es: "torcer/hinchar (por un equipo)" },
    convencer: { es: "convencer" },
    vencer: { es: "vencer/ganar" },
    bater: { es: "golpear/chocar" },
    meter: { es: "meter" },
    prometer: { es: "prometer" },
    "arrepender-se": { es: "arrepentirse" },
    esconder: { es: "esconder" },
    atender: { es: "atender" },
    surpreender: { es: "sorprender" },
    ofender: { es: "ofender" },
    erguer: { es: "levantar/alzar" },
    abranger: { es: "abarcar" },
    exercer: { es: "ejercer" },
    "atrever-se": { es: "atreverse" },

    /* --- -ir regulares --- */
    partir: { es: "partir" },
    assistir: { es: "ver (assistir a)/asistir" },
    decidir: { es: "decidir" },
    discutir: { es: "discutir" },
    dividir: { es: "dividir" },
    existir: { es: "existir" },
    garantir: { es: "garantizar" },
    insistir: { es: "insistir" },
    permitir: { es: "permitir" },
    resumir: { es: "resumir" },
    unir: { es: "unir" },
    dirigir: { es: "manejar/dirigir" },
    agir: { es: "actuar" },
    exigir: { es: "exigir" },
    corrigir: { es: "corregir" },
    fingir: { es: "fingir" },
    surgir: { es: "surgir" },
    atingir: { es: "alcanzar" },
    distinguir: { es: "distinguir" },
    incluir: { es: "incluir" },
    concluir: { es: "concluir" },
    excluir: { es: "excluir" },
    possuir: { es: "poseer" },
    influir: { es: "influir" },
    distribuir: { es: "distribuir" },
    contribuir: { es: "contribuir" },
    diminuir: { es: "disminuir" },
    atribuir: { es: "atribuir" },
    substituir: { es: "sustituir" },
    trair: { es: "traicionar" },
    atrair: { es: "atraer" },
    distrair: { es: "distraer" },
    traduzir: { es: "traducir" },
    produzir: { es: "producir" },
    reduzir: { es: "reducir" },
    conduzir: { es: "conducir" },
    introduzir: { es: "introducir" },
    admitir: { es: "admitir" },
    omitir: { es: "omitir" },
    emitir: { es: "emitir" },
    transmitir: { es: "transmitir" },
    definir: { es: "definir" },
    cumprir: { es: "cumplir" },
    curtir: { es: "disfrutar" },
    desistir: { es: "desistir/abandonar" },
    residir: { es: "residir" },
    exibir: { es: "exhibir" }
  };

  // es mediar/ansiar/remediar/incendiar/odiar (and intermediar): odeio, medeia
  var MARIO = /(mediar|ansiar|incendiar|odiar)$/;

  /* ------------------------------------------------------------- utilities */

  function get(inf) {
    var v = VERBS[inf];
    if (!v) throw new Error("verbo desconhecido: " + inf);
    return v;
  }

  function base(inf) { return inf.replace(/-se$/, ""); }
  function isRefl(inf) { return /-se$/.test(inf); }

  function klass(inf) {
    var b = base(inf);
    if (/ar$/.test(b)) return "ar";
    if (/ir$/.test(b)) return "ir";
    return "er";                                   // -er and pôr/-por
  }

  function stem(inf) {
    var b = base(inf);
    if (/[oô]r$/.test(b)) return b.replace(/[oô]r$/, "on");   // only regular(): *ponemos
    return b.slice(0, -2);
  }

  function swapLast(st, from, to) {
    var i = st.lastIndexOf(from);
    return i < 0 ? st : st.slice(0, i) + to + st.slice(i + 1);
  }

  /* Spelling at the stem/ending boundary: fic+ei → fiquei, conhec+o →
     conheço, proteg+o → protejo, segu+o → sigo (after e→i), cheg+e → chegue. */
  function join(b, st, e) {
    var f = e.charAt(0);
    if (/[eéê]/.test(f)) {
      if (/car$/.test(b) && /c$/.test(st)) st = st.slice(0, -1) + "qu";
      else if (/gar$/.test(b) && /g$/.test(st)) st += "u";
      else if (/çar$/.test(b) && /ç$/.test(st)) st = st.slice(0, -1) + "c";
    } else if (/[aoáóâô]/.test(f)) {
      if (/c(er|ir)$/.test(b) && /c$/.test(st)) st = st.slice(0, -1) + "ç";
      else if (/g(er|ir)$/.test(b) && /g$/.test(st)) st = st.slice(0, -1) + "j";
      else if (/gu(er|ir)$/.test(b) && /gu$/.test(st)) st = st.slice(0, -1);
    }
    return st + e;
  }

  /* Hiatus: a stressed i after a vowel carries an accent when it stands
     alone in its syllable (saí, saía, saído, construíram), not before -u or
     -nd (saiu, saindo).  -gu-/-qu- are not vowels (seguia). */
  function hiatus(st, e) {
    if (/[aeiou]$/.test(st) && !/[gq]u$/.test(st) && /^i/.test(e) && !/^i(u|nd)/.test(e)) {
      return st + "í" + e.slice(1);
    }
    return st + e;
  }

  var RHIZO = [true, true, true, false, false, true];

  /* The stem of a present-tense person after the vowel alternations. */
  function presStem(inf, v, i) {
    var b = base(inf), st = stem(inf);
    if (v.plain) return st;                                              // regular()
    if (/ear$/.test(b)) return RHIZO[i] ? st + "i" : st;                 // passeio
    if (MARIO.test(b)) return RHIZO[i] ? st.slice(0, -1) + "ei" : st;    // odeio
    switch (v.alt) {
      case "e-i": return i === 0 ? swapLast(st, "e", "i") : st;
      case "o-u": return i === 0 ? swapLast(st, "o", "u") : st;
      case "u-o": return (i === 1 || i === 2 || i === 5) ? swapLast(st, "u", "o") : st;
      case "e-i*": return RHIZO[i] ? swapLast(st, "e", "i") : st;
      case "o-u*": return RHIZO[i] ? swapLast(st, "o", "u") : st;
    }
    return st;
  }

  function presClass(inf) {
    var k = klass(inf), st = stem(inf);
    if (k === "ir" && /a$/.test(st)) return "air";
    if (k === "ir" && /u$/.test(st) && !/[gq]u$/.test(st)) return "uir";
    return k;
  }

  /* Accent the last vowel of a perfeito stem for nós/vós: falá-, comê-,
     partí-, fô-; strong (irregular) perfeitos have an open é: fizé-, tivé-. */
  function accentLast(b, strong) {
    var last = b.slice(-1), map = { a: "á", i: "í", o: "ô", e: strong ? "é" : "ê" };
    return map[last] ? b.slice(0, -1) + map[last] : b;
  }

  /* ------------------------------------------------------- simple tenses */

  var DERIVE_FIX = {
    ter: { tens: "téns", tem: "tém" },      // manténs, mantém
    vir: { vens: "véns", vem: "vém" },      // intervéns, intervém
    "pôr": { "pôr": "por" }                 // propor (infinitivo pessoal)
  };

  function derived(v, tense) {
    var bv = v.derive[0], pre = v.derive[1], fix = DERIVE_FIX[bv] || {};
    return simple(bv, tense).map(function (f) {
      return f === null ? null : pre + (fix[f] || f);
    });
  }

  function simple(inf, tense) {
    var v = get(inf);
    if (v.derive) return derived(v, tense);
    var b = base(inf), k = klass(inf), st = stem(inf), i, out = [];
    var perf, pb, strong, acc;

    switch (tense) {
      case "presente":
        if (v.pres) return v.pres.slice();
        var pk = presClass(inf), pend = END.presente[pk];
        for (i = 0; i < 6; i++) {
          var e = pend[i];
          if (i === 2 && /uzir$/.test(b) && !v.plain) e = "";               // produz, traduz
          out.push(join(b, presStem(inf, v, i), e));
        }
        if (v.presEu) out[0] = v.presEu;
        return out;

      case "perfeito":
        if (v.perf) return v.perf.slice();
        var fend = END.perfeito[k];
        for (i = 0; i < 6; i++) out.push(k === "ar" ? join(b, st, fend[i]) : hiatus(st, fend[i]));
        return out;

      case "imperfeito":
        if (v.imp) return v.imp.slice();
        var iend = END.imperfeito[k === "ar" ? "ar" : "er"];
        for (i = 0; i < 6; i++) out.push(hiatus(st, iend[i]));
        return out;

      case "futuro":
      case "condicional":
        // pôr without its data (regular()) is built like -er on pon-: *ponerei*
        var fst = v.futStem || (/[oô]r$/.test(b) ? st + "er" : b);
        return END[tense].map(function (x) { return fst + x; });

      case "subjPresente":
        if (v.subj) return v.subj.slice();
        var eu = simple(inf, "presente")[0];
        if (!/o$/.test(eu)) throw new Error("sem subjuntivo derivável: " + inf);
        var sst = eu.slice(0, -1), send = END.subjPresente[k === "ar" ? "ar" : "er"];
        var soft = !v.plain && (/ear$/.test(b) || MARIO.test(b));       // passeemos, odiemos
        for (i = 0; i < 6; i++) {
          out.push(join(b, soft && (i === 3 || i === 4) ? st : sst, send[i]));
        }
        return out;

      case "maisQuePerfeito":
      case "subjImperfeito":
      case "subjFuturo":
        perf = simple(inf, "perfeito");
        pb = perf[5].replace(/ram$/, "");
        strong = !!v.perf;
        acc = accentLast(pb, strong);
        if (tense === "maisQuePerfeito") {
          return [pb + "ra", pb + "ras", pb + "ra", acc + "ramos", acc + "reis", pb + "ram"];
        }
        if (tense === "subjImperfeito") {
          return [pb + "sse", pb + "sses", pb + "sse", acc + "ssemos", acc + "sseis", pb + "ssem"];
        }
        // saí- → sair, saíres, sair, sairmos, sairdes, saírem
        var plain = pb.replace(/([aeiou])í$/, "$1i");
        return [plain + "r", pb + "res", plain + "r", plain + "rmos", plain + "rdes", pb + "rem"];

      case "infPessoal":
        var r = b.slice(0, -1);                              // fala-, sai-, pô-
        var rPlain = r.replace(/ô$/, "o");
        var rStress = rPlain.replace(/([aeiou])i$/, function (m, p, off, s) {
          return /[gq]ui$/.test(s) ? m : p + "í";
        });
        return [b, rStress + "res", b, rPlain + "rmos", rPlain + "rdes", rStress + "rem"];
    }
    throw new Error("tempo simples desconhecido: " + tense);
  }

  /* ------------------------------------------------ participle and gerund */

  function regularParticiple(inf) {
    var st = stem(inf);
    return klass(inf) === "ar" ? st + "ado" : hiatus(st, "ido");
  }

  function participles(inf) {
    var v = get(inf);
    if (v.derive) {
      var bp = participles(v.derive[0]), pre = v.derive[1];
      var p = function (x) { return x ? pre + x : null; };
      return { regular: p(bp.regular), irregular: p(bp.irregular), ter: p(bp.ter), ser: p(bp.ser) };
    }
    var reg = v.pp ? null : regularParticiple(inf);
    var irr = v.pp || v.ppIrr || null;
    return {
      regular: reg,
      irregular: irr,
      ter: v.pp || (v.ppIrr && v.ppTerIrr ? v.ppIrr : reg),   // tenho feito, tinha pago, tinha aceitado
      ser: irr || reg                                          // foi feito, foi aceito, foi entregue
    };
  }

  /* The irregular participle when the verb has one (feito, pago, aceito). */
  function participle(inf) {
    var p = participles(inf);
    return p.irregular || p.regular;
  }

  function gerund(inf) {
    var v = get(inf);
    if (v.derive) return v.derive[1] + gerund(v.derive[0]);
    if (v.ger) return v.ger;
    var k = klass(inf);
    return stem(inf) + (k === "ar" ? "ando" : k === "er" ? "endo" : "indo");
  }

  /* ----------------------------------------------------- compound tenses */

  var COMPOUND = {
    perfeitoComposto: "presente",           // tenho falado
    maisQuePerfeitoComposto: "imperfeito",  // tinha falado
    futuroComposto: "futuro",               // terei falado
    condicionalComposto: "condicional",     // teria falado
    subjPerfeito: "subjPresente",           // tenha falado
    subjMaisQuePerfeito: "subjImperfeito",  // tivesse falado
    subjFuturoComposto: "subjFuturo"        // tiver falado
  };

  function auxiliary(inf) { get(inf); return "ter"; }

  function compound(inf, tense, opts) {
    var spec = COMPOUND[tense];
    if (!spec) throw new Error("tempo desconhecido: " + tense);
    var aux = (opts && opts.aux === "haver") ? "haver" : "ter";
    var auxForms = simple(aux, spec);
    var pp = (opts && opts.pp) || participles(inf).ter;
    var refl = isRefl(inf), out = [];
    for (var i = 0; i < 6; i++) {
      // Brazil: the clitic goes before the participle (tinha se levantado)
      out.push(auxForms[i] + " " + (refl ? REFL_PRON[i] + " " : "") + pp);
    }
    return out;
  }

  var SIMPLE_TENSES = [
    "presente", "perfeito", "imperfeito", "maisQuePerfeito", "futuro",
    "condicional", "subjPresente", "subjImperfeito", "subjFuturo", "infPessoal"
  ];
  var COMPOUND_TENSES = Object.keys(COMPOUND);
  var ALL_TENSES = SIMPLE_TENSES.concat(COMPOUND_TENSES);

  function conjugate(inf, tense, opts) {
    if (SIMPLE_TENSES.indexOf(tense) >= 0) {
      var forms = simple(inf, tense);
      if (forms.indexOf(null) >= 0 && !(opts && opts.partial)) {
        throw new Error("verbo defectivo: " + inf + " / " + tense);
      }
      if (isRefl(inf)) {
        forms = forms.map(function (f, i) { return f === null ? null : REFL_PRON[i] + " " + f; });
      }
      return forms;
    }
    return compound(inf, tense, opts);
  }

  /* --------------------------------------------------------- imperative
     imperative("falar") →
       { tu: "fala", "você": "fale", "nós": "falemos", "vós": "falai", "vocês": "falem",
         neg: { tu: "não fales", "você": "não fale", "nós": "não falemos",
                "vós": "não faleis", "vocês": "não falem" } }
     Reflexives take ênclise in the affirmative (levanta-te, levante-se,
     levantemo-nos, levantai-vos, levantem-se) and próclise in the negative
     (não te levantes, não se levante…).  null for verbs without imperative
     (poder, caber, reaver).                                               */

  function imperative(inf) {
    var v = get(inf);
    var bv = v.derive ? get(v.derive[0]) : v;
    if (v.noImpv || bv.noImpv) return null;
    var pres = simple(inf, "presente"), subj = simple(inf, "subjPresente");
    var tu = pres[2], vos = pres[4].replace(/s$/, "");
    if (v.impTu) tu = v.impTu;
    if (v.impVos) vos = v.impVos;
    if (isRefl(inf)) {
      return {
        tu: tu + "-te", "você": subj[2] + "-se", "nós": subj[3].replace(/s$/, "") + "-nos",
        "vós": vos + "-vos", "vocês": subj[5] + "-se",
        neg: {
          tu: "não te " + subj[1], "você": "não se " + subj[2], "nós": "não nos " + subj[3],
          "vós": "não vos " + subj[4], "vocês": "não se " + subj[5]
        }
      };
    }
    return {
      tu: tu, "você": subj[2], "nós": subj[3], "vós": vos, "vocês": subj[5],
      neg: {
        tu: "não " + subj[1], "você": "não " + subj[2], "nós": "não " + subj[3],
        "vós": "não " + subj[4], "vocês": "não " + subj[5]
      }
    };
  }

  /* ------------------------------------------------------------ accepted
     Every correct answer for each person, the conjugate() form first:
       - double participles in compound tenses (tinha pago / tinha pagado);
       - haver as auxiliary in formal writing (havia feito, houvesse feito),
         not in the perfeito composto (hei feito is archaic);
       - reflexives with ênclise (levanto-me, levantamo-nos) in the tenses
         where it is normal, and the clitic before the auxiliary or hooked to
         it in compound tenses (me tinha levantado, tinha-me levantado);
       - spelling variants of the verb itself (construis/constróis).        */

  function enclitic(form, pron) {
    return (pron === "nos" ? form.replace(/s$/, "") : form) + "-" + pron;
  }

  function accepted(inf, tense) {
    var main = conjugate(inf, tense), v = get(inf), refl = isRefl(inf);
    var out = main.map(function (f) { return f === null ? [] : [f]; });
    function add(i, f) { if (f && out[i].indexOf(f) < 0) out[i].push(f); }
    var i;
    if (SIMPLE_TENSES.indexOf(tense) >= 0) {
      var bare = simple(inf, tense);
      var vars = (v.variants && v.variants[tense]) || {};
      Object.keys(vars).forEach(function (p) {
        vars[p].forEach(function (f) { add(+p, refl ? REFL_PRON[p] + " " + f : f); });
      });
      if (refl && ["presente", "perfeito", "imperfeito", "maisQuePerfeito"].indexOf(tense) >= 0) {
        for (i = 0; i < 6; i++) if (bare[i]) add(i, enclitic(bare[i], REFL_PRON[i]));
      }
      return out;
    }
    var pps = participles(inf), ppList = [pps.ter];
    [pps.regular, pps.irregular].forEach(function (p) { if (p && ppList.indexOf(p) < 0) ppList.push(p); });
    var auxes = tense === "perfeitoComposto" ? ["ter"] : ["ter", "haver"];
    auxes.forEach(function (aux) {
      var af = simple(aux, COMPOUND[tense]);
      ppList.forEach(function (pp) {
        for (var j = 0; j < 6; j++) {
          if (refl) {
            add(j, af[j] + " " + REFL_PRON[j] + " " + pp);
            add(j, REFL_PRON[j] + " " + af[j] + " " + pp);
            add(j, enclitic(af[j], REFL_PRON[j]) + " " + pp);
          } else {
            add(j, af[j] + " " + pp);
          }
        }
      });
    });
    return out;
  }

  /* ------------------------------------------------------------- labels */

  var TENSE_LABELS = {
    presente: "presente do indicativo",
    perfeito: "pretérito perfeito",
    imperfeito: "pretérito imperfeito",
    maisQuePerfeito: "pretérito mais-que-perfeito",
    futuro: "futuro do presente",
    condicional: "futuro do pretérito (condicional)",
    subjPresente: "presente do subjuntivo",
    subjImperfeito: "pretérito imperfeito do subjuntivo",
    subjFuturo: "futuro do subjuntivo",
    infPessoal: "infinitivo pessoal",
    perfeitoComposto: "pretérito perfeito composto",
    maisQuePerfeitoComposto: "pretérito mais-que-perfeito composto",
    futuroComposto: "futuro do presente composto",
    condicionalComposto: "futuro do pretérito composto",
    subjPerfeito: "pretérito perfeito do subjuntivo",
    subjMaisQuePerfeito: "pretérito mais-que-perfeito do subjuntivo",
    subjFuturoComposto: "futuro composto do subjuntivo",
    // Non-finite forms and the imperative: labels only (the curriculum lists
    // them as week "tenses"); conjugate() does not take them, use
    // gerund() / participle() / imperative().
    gerundio: "gerúndio",
    participio: "particípio",
    imperativo: "imperativo"
  };
  var NONFINITE = ["gerundio", "participio", "imperativo"];

  /* New regular verbs (from the word bank) can be added at run time:
     spec = { es, alt? ("e-i", "o-u", "u-o", …), ppIrr?, persons? }.
     Spelling rules (-car, -ger, -ear, -uir…) are automatic.  Irregular verbs
     must be described in VERBS above.                                       */
  function register(inf, spec) {
    spec = spec || {};
    if (VERBS[inf] || !/^[a-zçãõáéíóúâêô]+(ar|er|ir)(-se)?$/.test(inf)) return false;
    var v = { es: spec.es || "", aux: "ter" };
    if (spec.alt) v.alt = spec.alt;
    if (spec.ppIrr) v.ppIrr = spec.ppIrr;
    if (spec.persons) v.persons = spec.persons;
    if (isRefl(inf)) v.refl = true;
    VERBS[inf] = v;
    return true;
  }

  /* What a learner who treats the verb as fully regular would produce:
     fazer → *fazo*, *fazi*; dormir → *dormo*; pedir → *pedo*; passear →
     *passeo*; odiar → *odio*; produzir → *produze*; feito → *fazido*.  Spelling (fiquei, conheço) is kept: it is
     not an irregularity.  pôr and its family, which fit no class, are
     regularised as -er on pon- (*pono*, *poni*, *ponido*), the Spanish
     pattern.  Used to diagnose over-regularisation.
     tense may also be "participio" or "gerundio".                          */
  function regular(inf, tense) {
    var saved = get(inf);
    VERBS[inf] = { es: saved.es, aux: "ter", refl: saved.refl, plain: true };
    try {
      if (tense === "participio") return participle(inf);
      if (tense === "gerundio") return gerund(inf);
      return conjugate(inf, tense);
    } finally {
      VERBS[inf] = saved;
    }
  }

  /* Normalise: every verb uses ter in compound tenses; mark reflexives. */
  Object.keys(VERBS).forEach(function (k) {
    VERBS[k].aux = "ter";
    if (isRefl(k)) VERBS[k].refl = true;
    var v = VERBS[k];
    v.irr = !!(v.pres || v.presEu || v.perf || v.imp || v.subj || v.futStem || v.pp ||
               v.derive || v.ger) || undefined;
  });

  var api = {
    PERSONS: PERSONS,
    REFL_PRON: REFL_PRON,
    VERBS: VERBS,
    TENSE_LABELS: TENSE_LABELS,
    ALL_TENSES: ALL_TENSES,
    SIMPLE_TENSES: SIMPLE_TENSES,
    COMPOUND_TENSES: COMPOUND_TENSES,
    NONFINITE: NONFINITE,
    list: function () { return Object.keys(VERBS); },
    info: get,
    conjugate: conjugate,
    accepted: accepted,
    imperative: imperative,
    participle: participle,
    participles: participles,
    gerund: gerund,
    auxiliary: auxiliary,
    register: register,
    regular: regular
  };

  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Conj = api;
})(typeof window !== "undefined" ? window : globalThis);
