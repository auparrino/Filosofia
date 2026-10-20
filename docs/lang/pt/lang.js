/*
 * Rumo C1 — el paquete portugués (de Brasil): configuración e interfaz.
 *
 * window.LANG lo lee el núcleo (docs/js/*.js): la marca, la voz, el prefijo
 * de guardado, dónde están los datos y todos los textos de la interfaz que
 * dependen de la lengua.  rules.js (LANG.rules) y los *_data.js le agregan
 * lo suyo después.  Lo que se ve está en portugués y en castellano
 * rioplatense, con el calçadão de Copacabana de fondo.
 */
(function (root) {
  "use strict";

  var PORTUNOL = [["contraccion", "contracciones: no, na, do, pelo (nunca «em o»)"],
                  ["genero", "género distinto: o leite, a viagem, o nariz"],
                  ["espanol", "castellano metido: muy, más, pero, yo"],
                  ["regencia", "regencia: gostar de, pensar em, sonhar com"],
                  ["tilde", "tildes: avó / avô, é / e, você"],
                  ["crase", "crase: vou à praia, às duas"],
                  ["articulo", "artículo con posesivo y nombre: a minha casa, o João"],
                  ["pronome", "pronombres: me dá, para mim, conosco"],
                  ["plural", "plurales: limões, animais, homens"],
                  ["perfeito_composto", "«he comido» es comi (tenho comido = vengo comiendo)"],
                  ["futuro_subj", "futuro do subjuntivo: quando eu for, se você quiser"],
                  ["falso_amigo", "falsos amigos: esquisito, polvo, borracha, apelido"]];

  var LANG = {
    code: "pt",
    name: "Português",
    brand: "Rumo C1",
    tts: "pt-BR",
    voiceRe: /^pt/i,              // any Portuguese voice…
    voicePrefer: /^pt[-_]br/i,    // …the Brazilian ones first (a European voice is better than a Spanish one)
    storage: "rumoc1",            // rumoc1.save.v1, rumoc1.pending.v1…: never change
    base: "lang/pt/",
    lt: "pt-BR",                  // LanguageTool
    lingualibre: { q: "Q5146", code: "por", tag: "por" },
    themeColor: { light: "#9fdcea", dark: "#071a26" },
    hyphenWords: true,            // chama-se, fala-se: the hyphen is inside a word

    /* Spanish or Portuguese?  What is read aloud after an answer is only
       Portuguese: a Spanish gloss or option is never read with the
       Brazilian voice (app.js spanishText). */
    spanish: {
      sure: /[ñ¿¡]|ción\b|\bll/i,
      notEs: /[ãõçêôâ]|ção|ções|nh|lh/i,
      unknownEs: /y|[dz]$/,       // ciudad, feliz, muy: not Portuguese spelling
      word: /[a-zà-ÿ]+/g,
      es: "el los las y es muy pero yo hay cuando donde en usted ustedes bien también tambien ella ellos ellas " +
          "nosotros ni con un una del al lo hoy mañana tengo estoy soy hacer hace puede quiero gracias hola sí qué " +
          "cómo dónde mi su sus mucho mucha nuevo bueno buena noche día después ahora aquí entonces siempre " +
          "todavía él eso esto más tiene tienen",
      target: "eu você vocês ele ela nós eles elas não é são está estão sou estou tem têm tenho um uma uns umas o os " +
              "do da dos das no na nas ao à aos às pelo pela pelos pelas num numa com em e mas muito muita muitos muitas " +
              "mais também já aqui isso isto hoje bem obrigado obrigada sim onde então agora depois ainda sempre tudo " +
              "dele dela meu minha seu sua nosso nossa você cadê pra tá né gente coisa",
      both: "a de se me te que por para como nada algo todo casa hora vida gente mesa foto tu la la o sin " +
            "porque quando nunca mas este esta estas estes esse essa isso idea ideia",
      askTarget: /(en|al) portugu[ée]s/i
    },

    /* A gap answer that glues to its neighbour: a hyphen answer (-se, -lo)
       joins the word before it, chama-se. */
    glue: function (a) { return /^-/.test(a) ? "prev" : null; },

    hlStop: { o: 1, a: 1, os: 1, as: 1, um: 1, uma: 1, e: 1, de: 1, em: 1, no: 1, na: 1, "do": 1, da: 1, ao: 1,
              que: 1, "não": 1, por: 1, para: 1, com: 1, se: 1, me: 1, te: 1, eu: 1, "é": 1 },

    // Portuguese spelling writes the accents, so avó / avô can be told
    // apart by the file name: every pair may use a real speaker.
    realVoiceSkip: {},
    pairBar: null,

    // Fallback groups; diagnosi.js brings its own (Diagnosi.GROUPS).
    diagGroups: {
      generic: { lexico: 1, faltante: 1, sobrante: 1, tipeo: 1, vuoto: 1 },
      lexical: { lexico: 1, espanol: 1, falso_amigo: 1, vuoto: 1 },
      slips: { tilde: 1, tipeo: 1 },
      unrecorded: { tipeo: 1, vuoto: 1 }
    },

    /* El cuaderno del portuñol (la guía; los «pontos críticos» de Grannier y
       Almeida Filho).  Si el diagnóstico trae su propia lista
       (Diagnosi.PORTUNOL), manda esa. */
    interlang: {
      title: "📓 Cuaderno de portuñol",
      blurb: "Las interferencias del español que se fosilizan. Verde: catorce días sin ese error.",
      list: function () { return (root.Diagnosi && root.Diagnosi.PORTUNOL) || PORTUNOL; }
    },

    refNames: {},

    why: [["viaje", "🧳 Viajar"], ["vivir", "🏠 Vivir en Brasil"], ["trabajo", "💼 Trabajo"],
          ["musica", "🎶 Samba, bossa nova, MPB"], ["pareja", "❤️ Pareja, amigos, familia"], ["estudio", "🎓 Estudiar allá"],
          ["celpe", "📜 El Celpe-Bras"]],

    /* The C1 exam, after the Celpe-Bras (Avançado Superior) without its oral
       interview.  The ids of the provas are the data keys of esame_data.js;
       the rubric has four criteria (contexto, discursiva, linguística,
       léxico). */
    exam: {
      prove: [["ascolto", "Compreensão oral", "🎧"], ["lettura", "Leitura", "📖"], ["strutture", "Estruturas", "🧩"],
              ["lessico", "Léxico", "📚"], ["scrittura", "Produção escrita", "✍️"]],
      abilities: { ascolto: "Compreensão oral", lettura: "Leitura", strutture: "Estruturas", produzione: "Produção" },
      rubric: [["contexto", "Adequação ao contexto"], ["discursiva", "Adequação discursiva"], ["linguistica", "Adequação linguística"], ["lexico", "Léxico"]],
      kinds: { argomentativo: "Texto de opinião", formale: "E-mail formal", roteiro: "Roteiro de visita", reclamacao: "E-mail de reclamação",
               resumo: "Resumo", email: "E-mail a um amigo", carta_aberta: "Carta aberta", guia: "Texto de apresentação",
               artigo: "Artigo de divulgação", panfleto: "Texto de campanha", other: "Carta formal" },
      // the genre of the C1 task (tramo_data.js) that reviews each tarefa without
      // a key: by the genre's name first, then by the kind
      genres: { "post de blog": "post_blog", argomentativo: "texto_opiniao", roteiro: "texto_instrucional", reclamacao: "carta_formal",
                formale: "carta_formal", resumo: "resumo", email: "email_informal", carta_aberta: "carta_aberta", guia: "texto_instrucional",
                artigo: "artigo", panfleto: "texto_instrucional" },
      // like the European exams, and unlike the Celpe-Bras: they do not count
      optional: ["strutture", "lessico"],
      ricName: "Reconstrução",
      provaToast: function (id, name) { return "Prova de " + name; },
      byAbility: "Por habilidad",
      missionSub: "Al estilo del Celpe-Bras (Avançado Superior), en tres versiones: compreensão oral, leitura y produção escrita con cuatro tarefas integradas; estruturas y léxico, opcionales. Mínimo 55 % en cada una.",
      lead: "Tres pruebas al estilo del Celpe-Bras (Avançado Superior): cada una necesita el <b>55 %</b> y el promedio, el 60 %. <b>Estruturas</b> y <b>Léxico</b> son opcionales, como en los exámenes europeos: no cuentan para aprobar. Podés hacerlas en el orden que quieras y repetir una. Hay tres versiones: si no aprobás, el intento siguiente usa otra.",
      sub: {
        ascolto: "una entrevista larga con dos voces · 8 preguntas y 4 huecos",
        lettura: "un texto largo · títulos por párrafo y verdadeiro/falso",
        strutture: "20 huecos y transformaciones: preposiciones, subjuntivo, infinitivo pessoal, relativos, pasiva…",
        lessico: "12 de formación de palabras y registro",
        scrittura: "cuatro tarefas integradas, como en el Celpe-Bras: dos a partir de un audio y dos a partir de un texto"
      },
      final: "Exame final", levelC1: "Nível C1", passed: "Exame aprovado.",
      deliver: "Entregar", transcript: "A transcrição",
      vfHelp: "verdadera o falsa", vf: "Verdadeiro ou falso", yes: "verdadeiro", no: "falso",
      writing: "Produção escrita"
    },

    /* The shareable card: the sky over Ipanema, then the sea; the waves of
       the calçadão along the bottom; a blue street sign on top. */
    card: {
      file: "rumo-c1-",
      frame: function (g, W, H) {
        var grad = g.createLinearGradient(0, 0, 0, H); grad.addColorStop(0, "#9fdcea"); grad.addColorStop(0.62, "#fdf1dc"); grad.addColorStop(1, "#f7c59f");
        g.fillStyle = grad; g.fillRect(0, 0, W, H);
        g.fillStyle = "#13262f";
        for (var x = -40; x < W + 40; x += 80) {
          g.beginPath(); g.moveTo(x, H);
          g.bezierCurveTo(x + 20, H - 34, x + 40, H - 34, x + 40, H - 18);
          g.bezierCurveTo(x + 40, H - 2, x + 60, H - 2, x + 80, H - 30);
          g.lineTo(x + 80, H); g.closePath(); g.fill();
        }
        g.fillStyle = "#fffdf8"; g.fillRect(40, 36, W - 80, H - 110);
        g.strokeStyle = "#0b4f7a"; g.lineWidth = 6; g.strokeRect(40, 36, W - 80, H - 110);
        g.fillStyle = "#0b4f7a"; g.fillRect(40, 36, W - 80, 44);
      },
      head: { y: 66, color: "#ffffff" },
      text: "#13262f", muted: "#5f6b6d",
      rank: { font: "bold 56px Georgia, serif", y: 150 },
      lines: [200, 240, 276]
    },

    /* Confeti de la playa: papelitos con los colores de la paleta (el mar de
       Ipanema, el atardecer del Arpoador, el sol, la Mata Atlântica, la
       arena) y alguna palmera, coco o bandera. */
    confetti: { bits: ["🌴", "☀️", "🥥", "🇧🇷", "🌊"], n: 30, ms: 2900,
                colors: ["--mar", "--coral", "--sol", "--mata", "--ceu", "--coral-claro", "--mar-claro"], fallback: "#f2643d" },

    ui: {
      langEs: "portugués",
      wordAdj: "portuguesa",
      tabs: [["oggi", "☀️", "Hoje"], ["percorso", "🧭", "Trilha"], ["io", "👤", "Eu"]],
      // Treino and Ler left the bar in 3.4 (their content lives in each week); still screens, reached from Eu
      allTabs: [["frasi", "🏄", "Treino"], ["leggi", "📖", "Ler"]],
      today: "Hoje", train: "Treino", read: "Ler", me: "Eu",
      path: "A trilha", pathEl: "la trilha", pathAl: "a la trilha", pathTu: "tu trilha",
      // The logo is a street sign of Rio (blue enamel, white letters): «Rumo» is the course.
      plate: { cls: "placa", sup: "p-sup", main: "p-rua" },
      logo: "Rumo C1", level: "nível",
      week: "Semana", weekLow: "semana", romanWeeks: false,
      of: " de ",
      cheer: { last: "Última!", almost: "Quase lá!", half: "Metade!" },
      hello: function (h) { return h < 12 ? "Bom dia! ☀️" : h < 18 ? "Boa tarde! 🌴" : "Boa noite! 🌙"; },
      pausaUna: "un cafezinho",
      pausaBtn: "<b>Cafezinho</b><small>pausa de 3 minutos con lo de tu semana</small>",
      daily: "Desafio do dia", dailyWon: "🎯 Desafio do dia vencido",
      review: "Revisão", reviewEl: "la Revisão", micro: "Revisão 2 min",
      words: "Palavras", wordsFreq: "Palavras frequentes",
      wordOrNot: "Palavra ou não?", wordYes: "✓ Palavra", wordNo: "✗ Não é palavra",
      lampo: "Relâmpago", lampoEl: "El Relâmpago",
      boss: "Chefão", Boss: "Chefão",
      pathLead: "De cero a C1 en 52 semanas, de la arena del Arpoador a la cima del Pão de Açúcar. Cada semana tiene <b>3 estrellas</b>: " +
        "jugar la lección, superar la semana y dominarla. Los <b>chefões</b> ⚔️ cierran cada tramo.",
      fraseDay: "Frase do dia",
      calendarGreen: "Verde mata",
      ponte: "Del español al portugués con reglas: -ción → -ção, -dad → -dade, -ble → -vel…",
      falsi: "Falsos amigos", capire: "Entender",
      suoni: "Sons", suoniSub: "Vocales abiertas y cerradas, nasales, lh y nh, la r: ¿cuál escuchaste? Habla conectada, entonación y dictado.",
      tr: "Traduza", gap: "Conjugue no contexto", err: "Ache o erro",
      forme: "Formas", formeSub: "Artículos, plurales, contracciones (no, na, do, pelo) y concordancia.",
      formeMission: "Artículos, plurales y contracciones (no, na, do, pelo), generados del banco.",
      scenes: "Frases",
      stories: "Histórias da semana", easyListen: "Escuta tranquila",
      series: { flood: "Enchente", settimana: "A semana", main: "Martín no Rio" },
      karaoke: "Leia e ouça",
      theoryBack: "← a la semana", theory: "Teoria · semana ",
      right: ["Isso!", "Muito bem!", "Perfeito!"], wasThis: "Era assim:",
      next: "Próxima →", check: "Conferir",
      inLang: "em português…",
      // the letters a Spanish keyboard does not have at hand (ã, õ, ç, ê,
      // ô, â, à) and the acute ones, for the phones without long press
      keys: ["ã", "õ", "ç", "á", "é", "í", "ó", "ú", "â", "ê", "ô", "à", "-"],
      giusto: ["Isso!", "Muito bem!", "Perfeito!", "Mandou bem!", "Ótimo!", "É isso aí!"],
      quasi: "Quase! Falta pouco.",
      sbagliato: ["Não faz mal. Era assim:", "Acontece. Era assim:", "Calma, era assim:"],
      keywordEx: "«polvo» → un pulpo revolcándose en el polvo",
      pausa: "Pausa pro cafezinho", sfida: "Desafio", examC1: "Exame C1",
      perfectWeek: "¡Semana perfeita!",
      great: "🏆 ¡Sensacional!", good: "👏 ¡Muito bem!",
      chal: "Desafios", chalLead: "Desafíos extra de la semana: cada uno es una ronda corta, con corrección. ",
      scrivi: "Escreva", parla: "Fale", storia: "História", storiaOf: "da semana", storiaArea: "História da semana",
      metaEx: "«En seis meses pido un açaí en Ipanema sin pensar»",
      freqNote: "Palabras por frecuencia (listas de frecuencia del portugués de Brasil): las 2.000 más frecuentes cubren más del 80 % de lo que se dice. ",
      exportFile: "rumo-c1-copia-", icsFile: "portugues-diario.ics", icsId: "PT",
      icsSummary: "☕ Cafezinho: 3 minutos de portugués", icsAlarm: "Bora! 3 minutos de portugués",
      dgNotes: "sábado… amigos… ainda bem…", dgText: "Reconstrua o texto…",
      parlaIn: "Escreva em português…", send: "Enviar", hi: "Oi! Tudo bem?", ok: "Entendi.",
      scriviIn: "Escreva aqui, em português…",
      switchTo: "Cambiar a Italiano 🇮🇹", switchCode: "it"
    }
  };

  root.LANG = LANG;
})(typeof window !== "undefined" ? window : globalThis);
