/*
 * Motore di coniugazione — generates Italian verb forms on demand so the game
 * can mint unlimited drills instead of shipping a frozen list of questions.
 *
 * Covers every mood and tense a C1 learner is expected to produce, the
 * orthographic rules (-care/-gare/-ciare/-giare), and the irregular verbs that
 * carry most of the traffic. Irregular passato remoto follows Italian's 1-3-6
 * pattern: irregular in io/lui/loro, regular in tu/noi/voi, so one stored stem
 * covers the whole tense.
 */
(function (root) {
  "use strict";

  var PERSONS = ["io", "tu", "lui/lei", "noi", "voi", "loro"];

  var END = {
    presente: {
      are: ["o", "i", "a", "iamo", "ate", "ano"],
      ere: ["o", "i", "e", "iamo", "ete", "ono"],
      ire: ["o", "i", "e", "iamo", "ite", "ono"],
      isc: ["isco", "isci", "isce", "iamo", "ite", "iscono"]
    },
    imperfetto: ["vo", "vi", "va", "vamo", "vate", "vano"],
    futuro: ["ò", "ai", "à", "emo", "ete", "anno"],
    condizionale: ["ei", "esti", "ebbe", "emmo", "este", "ebbero"],
    congiuntivo: {
      are: ["i", "i", "i", "iamo", "iate", "ino"],
      ere: ["a", "a", "a", "iamo", "iate", "ano"],
      ire: ["a", "a", "a", "iamo", "iate", "ano"],
      isc: ["isca", "isca", "isca", "iamo", "iate", "iscano"]
    },
    congImperfetto: ["ssi", "ssi", "sse", "ssimo", "ste", "ssero"],
    passatoRemoto: {
      are: ["ai", "asti", "ò", "ammo", "aste", "arono"],
      ere: ["ei", "esti", "é", "emmo", "este", "erono"],
      ire: ["ii", "isti", "ì", "immo", "iste", "irono"]
    },
    // Irregular passato remoto keeps the stored stem in 1st/3rd persons only.
    passatoRemotoIrr: ["i", null, "e", null, null, "ero"]
  };

  /* ---------------------------------------------------------------- lexicon */
  /* aux: 'avere' | 'essere' | 'both'.  Only deviations from the regular
     pattern are stored; anything omitted is derived.                          */
  var VERBS = {
    /* --- ausiliari e verbi fondamentali --- */
    essere: {
      es: "ser/estar", aux: "essere", pp: "stato", ger: "essendo",
      pres: ["sono", "sei", "è", "siamo", "siete", "sono"],
      imp: ["ero", "eri", "era", "eravamo", "eravate", "erano"],
      futStem: "sar",
      cong: ["sia", "sia", "sia", "siamo", "siate", "siano"],
      congImpStem: "fo",
      pr: ["fui", "fosti", "fu", "fummo", "foste", "furono"],
      impv: { tu: "sii", Lei: "sia", noi: "siamo", voi: "siate" },
      ppAgree: true
    },
    avere: {
      es: "haber/tener", aux: "avere", pp: "avuto",
      pres: ["ho", "hai", "ha", "abbiamo", "avete", "hanno"],
      futStem: "avr",
      cong: ["abbia", "abbia", "abbia", "abbiamo", "abbiate", "abbiano"],
      prStem: "ebb",
      impv: { tu: "abbi", Lei: "abbia", noi: "abbiamo", voi: "abbiate" }
    },
    andare: {
      es: "ir", aux: "essere",
      pres: ["vado", "vai", "va", "andiamo", "andate", "vanno"],
      futStem: "andr",
      cong: ["vada", "vada", "vada", "andiamo", "andiate", "vadano"],
      impv: { tu: "va'" }
    },
    stare: {
      es: "estar", aux: "essere", pp: "stato",
      pres: ["sto", "stai", "sta", "stiamo", "state", "stanno"],
      futStem: "star",
      cong: ["stia", "stia", "stia", "stiamo", "stiate", "stiano"],
      congImpStem: "ste", prRegStem: "st", prStem: "stett",
      impv: { tu: "sta'" }
    },
    dare: {
      es: "dar", aux: "avere", pp: "dato",
      pres: ["do", "dai", "dà", "diamo", "date", "danno"],
      futStem: "dar",
      cong: ["dia", "dia", "dia", "diamo", "diate", "diano"],
      congImpStem: "de", prRegStem: "d", prStem: "died",
      impv: { tu: "da'" }
    },
    fare: {
      es: "hacer", aux: "avere", pp: "fatto", ger: "facendo",
      pres: ["faccio", "fai", "fa", "facciamo", "fate", "fanno"],
      impStem: "face", futStem: "far",
      cong: ["faccia", "faccia", "faccia", "facciamo", "facciate", "facciano"],
      congImpStem: "face", prRegStem: "fac", prStem: "fec",
      impv: { tu: "fa'" }
    },
    dire: {
      es: "decir", aux: "avere", pp: "detto", ger: "dicendo",
      pres: ["dico", "dici", "dice", "diciamo", "dite", "dicono"],
      impStem: "dice", futStem: "dir",
      cong: ["dica", "dica", "dica", "diciamo", "diciate", "dicano"],
      congImpStem: "dice", prRegStem: "dic", prStem: "diss",
      impv: { tu: "di'" }
    },
    bere: {
      es: "beber", aux: "avere", pp: "bevuto", ger: "bevendo",
      pres: ["bevo", "bevi", "beve", "beviamo", "bevete", "bevono"],
      impStem: "beve", futStem: "berr",
      cong: ["beva", "beva", "beva", "beviamo", "beviate", "bevano"],
      congImpStem: "beve", prRegStem: "bev", prStem: "bevv"
    },

    /* --- modali --- */
    potere: {
      es: "poder", aux: "both",
      pres: ["posso", "puoi", "può", "possiamo", "potete", "possono"],
      futStem: "potr",
      cong: ["possa", "possa", "possa", "possiamo", "possiate", "possano"],
      noImpv: true
    },
    volere: {
      es: "querer", aux: "both",
      pres: ["voglio", "vuoi", "vuole", "vogliamo", "volete", "vogliono"],
      futStem: "vorr",
      cong: ["voglia", "voglia", "voglia", "vogliamo", "vogliate", "vogliano"],
      prStem: "voll",
      noImpv: true
    },
    dovere: {
      es: "deber/tener que", aux: "both",
      pres: ["devo", "devi", "deve", "dobbiamo", "dovete", "devono"],
      futStem: "dovr",
      cong: ["debba", "debba", "debba", "dobbiamo", "dobbiate", "debbano"],
      noImpv: true
    },
    sapere: {
      es: "saber", aux: "avere",
      pres: ["so", "sai", "sa", "sappiamo", "sapete", "sanno"],
      futStem: "sapr",
      cong: ["sappia", "sappia", "sappia", "sappiamo", "sappiate", "sappiano"],
      prStem: "sepp",
      impv: { tu: "sappi", Lei: "sappia", noi: "sappiamo", voi: "sappiate" }
    },

    /* --- movimento e vita quotidiana --- */
    venire: {
      es: "venir", aux: "essere", pp: "venuto",
      pres: ["vengo", "vieni", "viene", "veniamo", "venite", "vengono"],
      futStem: "verr",
      cong: ["venga", "venga", "venga", "veniamo", "veniate", "vengano"],
      prStem: "venn"
    },
    tenere: {
      es: "tener/sostener", aux: "avere",
      pres: ["tengo", "tieni", "tiene", "teniamo", "tenete", "tengono"],
      futStem: "terr",
      cong: ["tenga", "tenga", "tenga", "teniamo", "teniate", "tengano"],
      prStem: "tenn"
    },
    uscire: {
      es: "salir", aux: "essere",
      pres: ["esco", "esci", "esce", "usciamo", "uscite", "escono"],
      cong: ["esca", "esca", "esca", "usciamo", "usciate", "escano"]
    },
    salire: {
      es: "subir", aux: "essere",
      pres: ["salgo", "sali", "sale", "saliamo", "salite", "salgono"],
      cong: ["salga", "salga", "salga", "saliamo", "saliate", "salgano"]
    },
    rimanere: {
      es: "quedarse/permanecer", aux: "essere", pp: "rimasto",
      pres: ["rimango", "rimani", "rimane", "rimaniamo", "rimanete", "rimangono"],
      futStem: "rimarr",
      cong: ["rimanga", "rimanga", "rimanga", "rimaniamo", "rimaniate", "rimangano"],
      prStem: "rimas"
    },
    morire: {
      es: "morir", aux: "essere", pp: "morto",
      pres: ["muoio", "muori", "muore", "moriamo", "morite", "muoiono"],
      cong: ["muoia", "muoia", "muoia", "moriamo", "moriate", "muoiano"]
    },
    sedere: {
      es: "sentarse", aux: "essere",
      pres: ["siedo", "siedi", "siede", "sediamo", "sedete", "siedono"],
      cong: ["sieda", "sieda", "sieda", "sediamo", "sediate", "siedano"]
    },
    piacere: {
      es: "gustar", aux: "essere", pp: "piaciuto",
      pres: ["piaccio", "piaci", "piace", "piacciamo", "piacete", "piacciono"],
      cong: ["piaccia", "piaccia", "piaccia", "piacciamo", "piacciate", "piacciano"],
      prStem: "piacqu"
    },
    parere: {
      es: "parecer", aux: "essere", pp: "parso",
      pres: ["paio", "pari", "pare", "paiamo", "parete", "paiono"],
      futStem: "parr",
      cong: ["paia", "paia", "paia", "paiamo", "paiate", "paiano"],
      prStem: "parv"
    },

    /* --- verbi con participio o passato remoto irregolare --- */
    vedere: { es: "ver", aux: "avere", pp: "visto", futStem: "vedr", prStem: "vid" },
    vivere: { es: "vivir", aux: "both", pp: "vissuto", futStem: "vivr", prStem: "viss" },
    scrivere: { es: "escribir", aux: "avere", pp: "scritto", prStem: "scriss" },
    leggere: { es: "leer", aux: "avere", pp: "letto", prStem: "less" },
    prendere: { es: "tomar/coger", aux: "avere", pp: "preso", prStem: "pres" },
    mettere: { es: "poner", aux: "avere", pp: "messo", prStem: "mis" },
    chiedere: { es: "preguntar/pedir", aux: "avere", pp: "chiesto", prStem: "chies" },
    rispondere: { es: "responder", aux: "avere", pp: "risposto", prStem: "rispos" },
    chiudere: { es: "cerrar", aux: "avere", pp: "chiuso", prStem: "chius" },
    decidere: { es: "decidir", aux: "avere", pp: "deciso", prStem: "decis" },
    ridere: { es: "reír", aux: "avere", pp: "riso", prStem: "ris" },
    perdere: { es: "perder", aux: "avere", pp: "perso", prStem: "pers" },
    correre: { es: "correr", aux: "both", pp: "corso", prStem: "cors" },
    rompere: { es: "romper", aux: "avere", pp: "rotto", prStem: "rupp" },
    vincere: { es: "ganar/vencer", aux: "avere", pp: "vinto", prStem: "vins" },
    conoscere: { es: "conocer", aux: "avere", pp: "conosciuto", prStem: "conobb" },
    nascere: { es: "nacer", aux: "essere", pp: "nato", prStem: "nacqu" },
    vivereSyn: null,
    aprire: { es: "abrir", aux: "avere", pp: "aperto" },
    offrire: { es: "ofrecer", aux: "avere", pp: "offerto" },
    soffrire: { es: "sufrir", aux: "avere", pp: "sofferto" },
    coprire: { es: "cubrir", aux: "avere", pp: "coperto" },
    scoprire: { es: "descubrir", aux: "avere", pp: "scoperto" },
    spegnere: {
      es: "apagar", aux: "avere", pp: "spento", prStem: "spens",
      pres: ["spengo", "spegni", "spegne", "spegniamo", "spegnete", "spengono"],
      cong: ["spenga", "spenga", "spenga", "spegniamo", "spegniate", "spengano"]
    },
    scegliere: {
      es: "elegir", aux: "avere", pp: "scelto", prStem: "scels",
      pres: ["scelgo", "scegli", "sceglie", "scegliamo", "scegliete", "scelgono"],
      cong: ["scelga", "scelga", "scelga", "scegliamo", "scegliate", "scelgano"]
    },
    cogliere: {
      es: "recoger/captar", aux: "avere", pp: "colto", prStem: "cols",
      pres: ["colgo", "cogli", "coglie", "cogliamo", "cogliete", "colgono"],
      cong: ["colga", "colga", "colga", "cogliamo", "cogliate", "colgano"]
    },
    togliere: {
      es: "quitar", aux: "avere", pp: "tolto", prStem: "tols",
      pres: ["tolgo", "togli", "toglie", "togliamo", "togliete", "tolgono"],
      cong: ["tolga", "tolga", "tolga", "togliamo", "togliate", "tolgano"]
    },
    porre: {
      es: "poner/plantear", aux: "avere", pp: "posto", ger: "ponendo",
      pres: ["pongo", "poni", "pone", "poniamo", "ponete", "pongono"],
      impStem: "pone", futStem: "porr",
      cong: ["ponga", "ponga", "ponga", "poniamo", "poniate", "pongano"],
      congImpStem: "pone", prRegStem: "pon", prStem: "pos"
    },
    tradurre: {
      es: "traducir", aux: "avere", pp: "tradotto", ger: "traducendo",
      pres: ["traduco", "traduci", "traduce", "traduciamo", "traducete", "traducono"],
      impStem: "traduce", futStem: "tradurr",
      cong: ["traduca", "traduca", "traduca", "traduciamo", "traduciate", "traducano"],
      congImpStem: "traduce", prRegStem: "traduc", prStem: "traduss"
    },
    trarre: {
      es: "sacar/extraer", aux: "avere", pp: "tratto", ger: "traendo",
      pres: ["traggo", "trai", "trae", "traiamo", "traete", "traggono"],
      impStem: "trae", futStem: "trarr",
      cong: ["tragga", "tragga", "tragga", "traiamo", "traiate", "traggano"],
      congImpStem: "trae", prRegStem: "tra", prStem: "trass"
    },

    /* --- regolari ad alta frequenza --- */
    parlare: { es: "hablar", aux: "avere" },
    mangiare: { es: "comer", aux: "avere" },
    studiare: { es: "estudiar", aux: "avere" },
    lavorare: { es: "trabajar", aux: "avere" },
    guardare: { es: "mirar", aux: "avere" },
    ascoltare: { es: "escuchar", aux: "avere" },
    aspettare: { es: "esperar", aux: "avere" },
    trovare: { es: "encontrar", aux: "avere" },
    pensare: { es: "pensar", aux: "avere" },
    comprare: { es: "comprar", aux: "avere" },
    cercare: { es: "buscar", aux: "avere" },
    pagare: { es: "pagar", aux: "avere" },
    giocare: { es: "jugar", aux: "avere" },
    cominciare: { es: "empezar", aux: "both" },
    arrivare: { es: "llegar", aux: "essere" },
    entrare: { es: "entrar", aux: "essere" },
    tornare: { es: "volver", aux: "essere" },
    restare: { es: "quedarse", aux: "essere" },
    diventare: { es: "convertirse en", aux: "essere" },
    credere: { es: "creer", aux: "avere" },
    vendere: { es: "vender", aux: "avere" },
    ricevere: { es: "recibir", aux: "avere" },
    temere: { es: "temer", aux: "avere" },
    dormire: { es: "dormir", aux: "avere" },
    partire: { es: "partir/irse", aux: "essere" },
    sentire: { es: "oír/sentir", aux: "avere" },
    seguire: { es: "seguir", aux: "avere" },
    finire: { es: "terminar", aux: "both", isc: true },
    capire: { es: "entender", aux: "avere", isc: true },
    preferire: { es: "preferir", aux: "avere", isc: true },
    pulire: { es: "limpiar", aux: "avere", isc: true },
    spedire: { es: "enviar", aux: "avere", isc: true },
    costruire: { es: "construir", aux: "avere", isc: true },
    riuscire: {
      es: "lograr", aux: "essere",
      pres: ["riesco", "riesci", "riesce", "riusciamo", "riuscite", "riescono"],
      cong: ["riesca", "riesca", "riesca", "riusciamo", "riusciate", "riescano"]
    },
    alzarsi: { es: "levantarse", aux: "essere", refl: true },
    svegliarsi: { es: "despertarse", aux: "essere", refl: true },
    lavarsi: { es: "lavarse", aux: "essere", refl: true },
    vestirsi: { es: "vestirse", aux: "essere", refl: true },
    divertirsi: { es: "divertirse", aux: "essere", refl: true },
    annoiarsi: { es: "aburrirse", aux: "essere", refl: true },
    arrabbiarsi: { es: "enojarse", aux: "essere", refl: true },
    accorgersi: { es: "darse cuenta", aux: "essere", refl: true, pp: "accorto", prStem: "accors" },
    pentirsi: { es: "arrepentirse", aux: "essere", refl: true },
    fermarsi: { es: "detenerse", aux: "essere", refl: true },
    ricordarsi: { es: "acordarse", aux: "essere", refl: true },
    trasferirsi: { es: "mudarse", aux: "essere", refl: true, isc: true }
  };
  delete VERBS.vivereSyn;

  var REFL_PRON = ["mi", "ti", "si", "ci", "vi", "si"];

  /* ------------------------------------------------------------- utilities */

  function base(inf) {
    // Reflexives are conjugated on their non-reflexive stem.
    return inf.replace(/rsi$/, "re");
  }

  function klass(inf) {
    var b = base(inf);
    if (/are$/.test(b)) return "are";
    if (/ire$/.test(b)) return "ire";
    return "ere";
  }

  function stem(inf) {
    return base(inf).replace(/(are|ere|ire)$/, "");
  }

  /* -care/-gare keep the hard sound before i/e (cerchi, paghi); -iare verbs
     absorb a stem-final unstressed i into an i-ending (mangi, studiamo). */
  function hardens(inf) { return /[cg]are$/.test(base(inf)); }
  function absorbsI(inf) { return /iare$/.test(base(inf)); }

  function join(st, ending, inf) {
    if (inf && hardens(inf) && /^[ie]/.test(ending)) return st + "h" + ending;
    if (inf && absorbsI(inf) && /i$/.test(st) && /^i/.test(ending)) {
      return st.slice(0, -1) + ending;
    }
    return st + ending;
  }

  function get(inf) {
    var v = VERBS[inf];
    if (!v) throw new Error("verbo sconosciuto: " + inf);
    return v;
  }

  function participle(inf) {
    var v = get(inf);
    if (v.pp) return v.pp;
    var k = klass(inf), st = stem(inf);
    return st + (k === "are" ? "ato" : k === "ere" ? "uto" : "ito");
  }

  function gerund(inf) {
    var v = get(inf);
    if (v.ger) return v.ger;
    return stem(inf) + (klass(inf) === "are" ? "ando" : "endo");
  }

  function futureStem(inf) {
    var v = get(inf);
    if (v.futStem) return v.futStem;
    var st = stem(inf), k = klass(inf);
    if (hardens(inf)) st += "h";                        // cercare -> cercher-
    else if (/[cg]i$/.test(st)) st = st.slice(0, -1);   // mangiare -> manger-
    return st + (k === "ire" ? "ir" : "er");
  }

  /* ------------------------------------------------------- simple tenses */

  function simple(inf, tense) {
    var v = get(inf), k = v.isc ? "isc" : klass(inf), st = stem(inf), i, out = [];

    switch (tense) {
      case "presente":
        if (v.pres) return v.pres.slice();
        for (i = 0; i < 6; i++) out.push(join(st, END.presente[k][i], inf));
        return out;

      case "imperfetto":
        if (v.imp) return v.imp.slice();
        var ist = v.impStem || st + (klass(inf) === "are" ? "a" : klass(inf) === "ire" ? "i" : "e");
        for (i = 0; i < 6; i++) out.push(ist + END.imperfetto[i]);
        return out;

      case "futuro":
        for (i = 0; i < 6; i++) out.push(futureStem(inf) + END.futuro[i]);
        return out;

      case "condizionale":
        for (i = 0; i < 6; i++) out.push(futureStem(inf) + END.condizionale[i]);
        return out;

      case "congiuntivo":
        if (v.cong) return v.cong.slice();
        for (i = 0; i < 6; i++) out.push(join(st, END.congiuntivo[k][i], inf));
        return out;

      case "congImperfetto":
        var cst = v.congImpStem ||
          st + (klass(inf) === "are" ? "a" : klass(inf) === "ire" ? "i" : "e");
        for (i = 0; i < 6; i++) out.push(cst + END.congImperfetto[i]);
        return out;

      case "passatoRemoto":
        if (v.pr) return v.pr.slice();
        var rStem = v.prRegStem || st;
        var reg = END.passatoRemoto[v.prRegStem ? "ere" : klass(inf)];
        for (i = 0; i < 6; i++) {
          if (v.prStem && END.passatoRemotoIrr[i]) {
            out.push(v.prStem + END.passatoRemotoIrr[i]);
          } else {
            out.push(join(rStem, reg[i], v.prRegStem ? null : inf));
          }
        }
        return out;
    }
    throw new Error("tempo semplice sconosciuto: " + tense);
  }

  /* ----------------------------------------------------- compound tenses */

  var COMPOUND = {
    passatoProssimo: ["avere", "presente"],
    trapassatoProssimo: ["avere", "imperfetto"],
    futuroAnteriore: ["avere", "futuro"],
    trapassatoRemoto: ["avere", "passatoRemoto"],
    condizionalePassato: ["avere", "condizionale"],
    congiuntivoPassato: ["avere", "congiuntivo"],
    congiuntivoTrapassato: ["avere", "congImperfetto"]
  };

  // Participle agreement when the auxiliary is essere.
  var AGREE = ["o", "o", "o", "i", "i", "i"];

  function auxiliary(inf) {
    var v = get(inf);
    return v.refl ? "essere" : v.aux === "both" ? "avere" : v.aux;
  }

  function compound(inf, tense, opts) {
    var spec = COMPOUND[tense];
    if (!spec) throw new Error("tempo composto sconosciuto: " + tense);
    var aux = (opts && opts.aux) || auxiliary(inf);
    var auxForms = simple(aux, spec[1]);
    var pp = participle(inf), v = get(inf), out = [], i;

    for (i = 0; i < 6; i++) {
      var part = pp;
      if (aux === "essere") part = pp.replace(/[oaie]$/, AGREE[i]);
      var form = auxForms[i] + " " + part;
      if (v.refl) form = REFL_PRON[i] + " " + form;
      out.push(form);
    }
    return out;
  }

  var SIMPLE_TENSES = [
    "presente", "imperfetto", "futuro", "passatoRemoto",
    "condizionale", "congiuntivo", "congImperfetto"
  ];

  function conjugate(inf, tense, opts) {
    if (SIMPLE_TENSES.indexOf(tense) >= 0) {
      var forms = simple(inf, tense), v = get(inf);
      if (v.refl) {
        forms = forms.map(function (f, i) { return REFL_PRON[i] + " " + f; });
      }
      return forms;
    }
    return compound(inf, tense, opts);
  }

  /* --------------------------------------------------------- imperative */

  function imperative(inf) {
    var v = get(inf);
    if (v.noImpv) return null;
    var pres = simple(inf, "presente"), cong = simple(inf, "congiuntivo");
    var st = stem(inf), k = klass(inf);
    var tu = k === "are" ? join(st, "a", inf) : pres[1];
    if (v.isc) tu = pres[1];
    var forms = {
      tu: (v.impv && v.impv.tu) || tu,
      Lei: (v.impv && v.impv.Lei) || cong[2],
      noi: (v.impv && v.impv.noi) || pres[3],
      voi: (v.impv && v.impv.voi) || pres[4]
    };
    if (v.refl) {
      forms.tu += "ti";
      forms.Lei = "si " + forms.Lei;
      forms.noi += "ci";
      forms.voi += "vi";
    }
    // The negative tu-imperative uses the infinitive.
    forms.tuNeg = "non " + (v.refl ? base(inf).replace(/e$/, "") + "ti" : inf);
    return forms;
  }

  var TENSE_LABELS = {
    presente: "presente (indicativo)",
    imperfetto: "imperfetto",
    futuro: "futuro semplice",
    passatoRemoto: "passato remoto",
    condizionale: "condizionale presente",
    congiuntivo: "congiuntivo presente",
    congImperfetto: "congiuntivo imperfetto",
    passatoProssimo: "passato prossimo",
    trapassatoProssimo: "trapassato prossimo",
    futuroAnteriore: "futuro anteriore",
    trapassatoRemoto: "trapassato remoto",
    condizionalePassato: "condizionale passato",
    congiuntivoPassato: "congiuntivo passato",
    congiuntivoTrapassato: "congiuntivo trapassato"
  };

  var ALL_TENSES = Object.keys(TENSE_LABELS);

  /* New regular verbs (from the word bank) can be added at run time: only
     the class, auxiliary and -isc- flag are needed.  Irregular verbs must be
     described in VERBS above. */
  function register(inf, spec) {
    if (VERBS[inf] || !/(are|ere|ire|rsi)$/.test(inf)) return false;
    VERBS[inf] = {
      es: spec.es || "", aux: spec.aux || "avere",
      isc: !!spec.isc, refl: /rsi$/.test(inf) || undefined
    };
    return true;
  }

  /* What a learner who treats the verb as regular would produce: vado →
     *ando*, preso → *prenduto*.  Used to diagnose over-regularisation. */
  function regular(inf, tense) {
    var saved = VERBS[inf];
    if (!saved) throw new Error("verbo sconosciuto: " + inf);
    VERBS[inf] = { es: saved.es, aux: saved.aux, refl: saved.refl, isc: saved.isc };
    try {
      return tense === "participio" ? participle(inf) : conjugate(inf, tense);
    } finally {
      VERBS[inf] = saved;
    }
  }

  var api = {
    PERSONS: PERSONS,
    VERBS: VERBS,
    TENSE_LABELS: TENSE_LABELS,
    ALL_TENSES: ALL_TENSES,
    SIMPLE_TENSES: SIMPLE_TENSES,
    list: function () { return Object.keys(VERBS); },
    info: get,
    conjugate: conjugate,
    imperative: imperative,
    participle: participle,
    gerund: gerund,
    auxiliary: auxiliary,
    register: register,
    regular: regular
  };

  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Conj = api;
})(typeof window !== "undefined" ? window : globalThis);
