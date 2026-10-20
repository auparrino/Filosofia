/*
 * Weg C1 — el paquete alemán: configuración e interfaz.
 *
 * window.LANG lo lee el núcleo (docs/js/*.js): la marca, la voz, el prefijo
 * de guardado, dónde están los datos y todos los textos de la interfaz que
 * dependen de la lengua.  rules.js (LANG.rules) le agrega lo suyo después.
 * Lo que se ve está en alemán y en castellano rioplatense, con Berlín de
 * fondo.  El paquete arranca chico: las seis semanas de A1 (Boot.LANGS.de
 * dice qué archivos todavía no tiene).
 */
(function (root) {
  "use strict";

  // Las interferencias del español que se fosilizan en alemán.
  var DEUTSPAÑOL = [["genero", "el género no es el del castellano: das Mädchen, die Sonne, der Mond"],
                    ["mayuscula", "los sustantivos van con mayúscula: der Tisch, das Haus"],
                    ["orden", "el verbo en segundo lugar: Heute arbeite ich (no «Heute ich arbeite»)"],
                    ["sujeto", "el sujeto no se omite: ich bin, no «bin»"],
                    ["acusativo", "acusativo masculino: Ich habe einen Bruder"],
                    ["kein", "kein/keine para negar sustantivos: Ich habe kein Auto"],
                    ["umlaut", "las diéresis cambian la palabra: schon / schön, Bruder / Brüder"],
                    ["falso_amigo", "falsos amigos: Gift (veneno), bekommen (recibir), also (entonces)"]];

  var LANG = {
    code: "de",
    name: "Deutsch",
    brand: "Weg C1",
    tts: "de-DE",
    voiceRe: /^de/i,              // any German voice…
    voicePrefer: /^de[-_]de/i,    // …the ones from Germany first
    storage: "wegc1",             // wegc1.save.v1, wegc1.pending.v1…: never change
    base: "lang/de/",
    lt: "de-DE",                  // LanguageTool
    lingualibre: { q: "Q188", code: "deu", tag: "deu" },
    themeColor: { light: "#c9d6e4", dark: "#121a26" },
    hyphenWords: false,

    /* Spanish or German?  What is read aloud after an answer is only German:
       a Spanish gloss or option is never read with the German voice
       (app.js spanishText). */
    spanish: {
      sure: /[ñ¿¡áéíóú]|ción\b|\bll/i,
      notEs: /[äöüß]|sch|tz|\b(der|die|das|und|ist|nicht|ich)\b/i,
      unknownEs: /[dz]$/,
      word: /[a-zà-ÿß]+/g,
      es: "el los las y es muy pero yo hay cuando donde en usted ustedes bien también ella ellos ellas " +
          "nosotros ni con un una del al lo hoy mañana tengo estoy soy hacer hace puede quiero gracias hola sí qué " +
          "cómo dónde mi su sus mucho mucha nuevo bueno buena noche día después ahora aquí entonces siempre " +
          "todavía él eso esto más tiene tienen",
      target: "der die das den dem des ein eine einen einem kein keine ich du er sie es wir ihr bin bist ist sind seid " +
              "habe hast hat haben nicht und oder aber auch mit von zu im aus wie wo was wer woher heiße heißt " +
              "komme kommst kommt wohne wohnst möchte möchtest ja nein bitte danke guten tag morgen abend gute nacht um uhr am " +
              "heute hier sehr gut viel noch schon jetzt immer",
      both: "a de se me te que por para como nada algo casa hora foto la o en an so",
      askTarget: /(en|al) alem[áa]n/i
    },

    // A gap answer never glues to its neighbour in German.
    glue: function () { return null; },

    hlStop: { der: 1, die: 1, das: 1, den: 1, dem: 1, ein: 1, eine: 1, und: 1, ist: 1, ich: 1, du: 1, er: 1, sie: 1, es: 1,
              wir: 1, ihr: 1, nicht: 1, in: 1, im: 1, am: 1, um: 1, zu: 1, mit: 1, von: 1, aus: 1 },

    // The file name of a recording says the umlauts: every pair may use a real speaker.
    realVoiceSkip: {},
    pairBar: null,

    // Fallback groups (there is no diagnosis module for German yet).
    diagGroups: {
      generic: { lexico: 1, faltante: 1, sobrante: 1, tipeo: 1, vuoto: 1 },
      lexical: { lexico: 1, espanol: 1, falso_amigo: 1, vuoto: 1 },
      slips: { umlaut: 1, tipeo: 1 },
      unrecorded: { tipeo: 1, vuoto: 1 }
    },

    interlang: {
      title: "📓 Cuaderno de deutspañol",
      blurb: "Las interferencias del español que se fosilizan. Verde: catorce días sin ese error.",
      list: function () { return (root.Diagnosi && root.Diagnosi.DEUTSPANOL) || DEUTSPAÑOL; }
    },

    refNames: {},

    why: [["viaje", "🧳 Viajar"], ["vivir", "🏠 Vivir en Alemania, Austria o Suiza"], ["trabajo", "💼 Trabajo"],
          ["estudio", "🎓 Estudiar allá"], ["familia", "👨‍👩‍👧 Familia y raíces"], ["cultura", "🎻 Música, cine, libros"],
          ["goethe", "📜 El Goethe-Zertifikat"]],

    /* The exam, after the Goethe-Zertifikat (there is no German C1 exam
       yet: esame_data.js is missing, the core does not offer it). */
    exam: {
      prove: [["ascolto", "Hören", "🎧"], ["lettura", "Lesen", "📖"], ["strutture", "Strukturen", "🧩"],
              ["lessico", "Wortschatz", "📚"], ["scrittura", "Schreiben", "✍️"]],
      abilities: { ascolto: "Hören", lettura: "Lesen", strutture: "Strukturen", produzione: "Schreiben" },
      rubric: [["aufgabe", "Erfüllung der Aufgabe"], ["kohaerenz", "Kohärenz"], ["wortschatz", "Wortschatz"], ["strukturen", "Strukturen"]],
      kinds: { argomentativo: "Meinungstext", formale: "Formelle E-Mail", email: "E-Mail an einen Freund", other: "Brief" },
      genres: {},
      optional: ["strutture", "lessico"],
      ricName: "Rekonstruktion",
      provaToast: function (id, name) { return "Prüfung: " + name; },
      byAbility: "Por habilidad",
      missionSub: "Al estilo del Goethe-Zertifikat.",
      lead: "Pruebas al estilo del Goethe-Zertifikat.",
      sub: { ascolto: "", lettura: "", strutture: "", lessico: "", scrittura: "" },
      final: "Abschlussprüfung", levelC1: "Niveau C1", passed: "Prüfung bestanden.",
      deliver: "Abgeben", transcript: "Die Transkription",
      vfHelp: "verdadera o falsa", vf: "Richtig oder falsch", yes: "richtig", no: "falsch",
      writing: "Schreiben"
    },

    /* The shareable card: the Berlin sky, the Spree below and a blue street
       sign with white letters on top. */
    card: {
      file: "weg-c1-",
      frame: function (g, W, H) {
        var grad = g.createLinearGradient(0, 0, 0, H); grad.addColorStop(0, "#c9d6e4"); grad.addColorStop(0.65, "#f6f4ef"); grad.addColorStop(1, "#d9cdb8");
        g.fillStyle = grad; g.fillRect(0, 0, W, H);
        g.fillStyle = "#1f3b5c"; g.fillRect(0, H - 26, W, 26);
        g.fillStyle = "#fffdf8"; g.fillRect(40, 36, W - 80, H - 110);
        g.strokeStyle = "#1f3b5c"; g.lineWidth = 6; g.strokeRect(40, 36, W - 80, H - 110);
        g.fillStyle = "#1f3b5c"; g.fillRect(40, 36, W - 80, 44);
      },
      head: { y: 66, color: "#ffffff" },
      text: "#1b2430", muted: "#5d6672",
      rank: { font: "bold 56px Georgia, serif", y: 150 },
      lines: [200, 240, 276]
    },

    // Confetti: the colors of the theme and a pretzel, a beer mug, a flag.
    confetti: { bits: ["🥨", "🍺", "🇩🇪", "🐻", "🚋"], n: 30, ms: 2900,
                colors: ["--mar", "--coral", "--sol", "--mata", "--ceu", "--coral-claro", "--mar-claro"], fallback: "#c8102e" },

    ui: {
      langEs: "alemán",
      wordAdj: "alemana",
      tabs: [["oggi", "☀️", "Heute"], ["percorso", "🧭", "Weg"], ["io", "👤", "Ich"]],
      allTabs: [["frasi", "🚋", "Training"], ["leggi", "📖", "Lesen"]],
      today: "Heute", train: "Training", read: "Lesen", me: "Ich",
      path: "Der Weg", pathEl: "el Weg", pathAl: "al Weg", pathTu: "tu Weg",
      // The logo is a street sign (blue enamel, white letters): «Weg» is the way.
      plate: { cls: "placa", sup: "p-sup", main: "p-rua" },
      logo: "Weg C1", level: "Stufe",
      week: "Woche", weekLow: "semana", romanWeeks: false,
      of: " de ",
      cheer: { last: "Die letzte!", almost: "Fast geschafft!", half: "Halbzeit!" },
      hello: function (h) { return h < 11 ? "Guten Morgen! ☀️" : h < 18 ? "Guten Tag! 🥨" : "Guten Abend! 🌙"; },
      pausaUna: "una Kaffeepause",
      pausaBtn: "<b>Kaffeepause</b><small>3 minutos con lo de tu semana</small>",
      daily: "Aufgabe des Tages", dailyWon: "🎯 Aufgabe des Tages geschafft",
      review: "Wiederholung", reviewEl: "la Wiederholung", micro: "Wiederholung 2 min",
      words: "Wörter", wordsFreq: "Häufige Wörter",
      wordOrNot: "Wort oder nicht?", wordYes: "✓ Wort", wordNo: "✗ Kein Wort",
      lampo: "Blitz", lampoEl: "El Blitz",
      boss: "Endgegner", Boss: "Endgegner",
      pathLead: "Alemán desde cero. Por ahora, las seis semanas de A1; el resto del camino hasta C1 está en construcción. Cada semana tiene <b>3 estrellas</b>: " +
        "jugar la lección, superar la semana y dominarla.",
      fraseDay: "Wort des Tages",
      calendarGreen: "Grün",
      ponte: "Del español al alemán con reglas.",
      falsi: "Falsche Freunde", capire: "Verstehen",
      suoni: "Laute", suoniSub: "Vocales largas y cortas, las diéresis, ch, sch, z: ¿cuál escuchaste?",
      tr: "Übersetze", gap: "Konjugiere im Kontext", err: "Finde den Fehler",
      forme: "Formen", formeSub: "Artículos, plurales y casos.",
      formeMission: "Artículos, plurales y casos, generados del banco.",
      scenes: "Sätze",
      stories: "Geschichten der Woche", easyListen: "Ruhig zuhören",
      series: { flood: "Flut", settimana: "Die Woche", main: "Martín in Berlin" },
      karaoke: "Lesen und hören",
      theoryBack: "← a la semana", theory: "Theorie · semana ",
      right: ["Richtig!", "Super!", "Genau!"], wasThis: "Era así:",
      next: "Weiter →", check: "Prüfen",
      inLang: "auf Deutsch…",
      // the letters a Spanish keyboard does not have at hand, for the
      // phones without long press (and the app's keyboard, teclado.js)
      keys: ["ä", "ö", "ü", "ß"],
      // QWERTZ, with the umlauts where a German keyboard has them
      kbRows: ["qwertzuiopü", "asdfghjklöä", "yxcvbnmß"],
      giusto: ["Richtig!", "Super!", "Genau!", "Sehr gut!", "Prima!", "Toll!"],
      quasi: "Fast! Nur ein Detail.",
      sbagliato: ["Macht nichts. Era así:", "Kein Problem. Era así:", "Tranqui, era así:"],
      keywordEx: "«Gift» → un regalo envenenado",
      pausa: "Kaffeepause", sfida: "Aufgabe", examC1: "Prüfung C1",
      perfectWeek: "¡Perfekte Woche!",
      great: "🏆 ¡Ausgezeichnet!", good: "👏 ¡Sehr gut!",
      chal: "Aufgaben", chalLead: "Desafíos extra de la semana: cada uno es una ronda corta, con corrección. ",
      scrivi: "Schreib", parla: "Sprich", storia: "Geschichte", storiaOf: "der Woche", storiaArea: "Geschichte der Woche",
      metaEx: "«En seis meses pido un Brezel en Berlín sin pensar»",
      freqNote: "Palabras por frecuencia: las 2.000 más frecuentes cubren más del 80 % de lo que se dice. ",
      exportFile: "weg-c1-copia-", icsFile: "aleman-diario.ics", icsId: "DE",
      icsSummary: "☕ Kaffeepause: 3 minutos de alemán", icsAlarm: "Los geht's! 3 minutos de alemán",
      dgNotes: "Samstag… Freunde… zum Glück…", dgText: "Rekonstruiere den Text…",
      parlaIn: "Schreib auf Deutsch…", send: "Senden", hi: "Hallo! Wie geht's?", ok: "Verstanden.",
      scriviIn: "Schreib hier, auf Deutsch…",
      switchTo: "Cambiar a Italiano 🇮🇹", switchCode: "it"
    }
  };

  root.LANG = LANG;
})(typeof window !== "undefined" ? window : globalThis);
