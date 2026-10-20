/*
 * Ágora — la edición en castellano: configuración e interfaz.
 *
 * window.LANG lo lee el núcleo (docs/js/*.js): la marca, la voz, el prefijo
 * de guardado, dónde están los datos y todos los textos de la interfaz que
 * dependen de la edición.  rules.js (LANG.rules) le agrega lo suyo después.
 * La edición arranca chica, como el alemán de La Via: el curso y nada más
 * (Boot.LANGS.es dice qué archivos todavía no tiene).
 */
(function (root) {
  "use strict";

  // Los malentendidos que más se repiten al estudiar filosofía.
  var MALENTENDIDOS = [["autor", "atribuirle una idea a otro autor: «el hombre es la medida de todas las cosas» es de Protágoras"],
                       ["escuela", "confundir escuelas vecinas: milesios y eléatas, estoicos y epicúreos, empiristas y racionalistas"],
                       ["apocrifa", "repetir una cita apócrifa: *panta rhei* no está en Heráclito"],
                       ["anacronismo", "leer a un autor con ideas que vinieron después: el átomo de Demócrito no es el de la física"],
                       ["validez", "confundir validez con verdad: un argumento válido puede tener premisas falsas"],
                       ["premisa", "tomar una premisa por la conclusión: buscá qué te quieren hacer creer"],
                       ["paja", "el hombre de paja: criticar una caricatura del autor y no lo que dijo"]];

  var LANG = {
    code: "es",
    name: "Castellano",
    brand: "Ágora",
    tts: "es-AR",
    voiceRe: /^es/i,              // any Spanish voice…
    voicePrefer: /^es[-_](ar|uy|419)/i,   // …the Río de la Plata first
    storage: "agora-es",          // agora-es.save.v1, agora-es.pending.v1…: never change
    base: "lang/es/",
    themeColor: { light: "#efe6d6", dark: "#1a1612" },
    hyphenWords: false,

    /* Everything in this edition is Spanish: nothing is told apart from the
       language of the course (app.js spanishText). */
    spanish: { word: /[a-zà-ÿñ]+/g, es: "", target: "", both: "" },

    glue: function () { return null; },

    hlStop: { el: 1, la: 1, los: 1, las: 1, un: 1, una: 1, y: 1, o: 1, de: 1, del: 1, en: 1, que: 1, es: 1, se: 1, no: 1, por: 1, con: 1, al: 1, lo: 1 },

    // The categories of the corrections (there is no diagnosis module yet).
    diagGroups: {
      generic: { lexico: 1, faltante: 1, sobrante: 1, tipeo: 1, vuoto: 1 },
      lexical: { lexico: 1, vuoto: 1 },
      slips: { tipeo: 1 },
      unrecorded: { tipeo: 1, vuoto: 1 }
    },

    interlang: {
      title: "📓 Cuaderno de malentendidos",
      blurb: "Las confusiones que más se repiten al estudiar filosofía. Verde: catorce días sin caer en ella.",
      list: MALENTENDIDOS
    },

    refNames: {},

    why: [["curiosidad", "🤔 Por curiosidad"], ["carrera", "🎓 Para la carrera o el secundario"], ["pensar", "🧠 Para pensar mejor"],
          ["leer", "📚 Para leer a los clásicos"], ["vida", "🌱 Para vivir mejor"], ["debatir", "🗣️ Para discutir con argumentos"],
          ["idiomas", "🌍 Para después leerla en otro idioma"]],

    /* The parts of the season exams, in the result (app.js). */
    exam: {
      abilities: { strutture: "Opción múltiple", produzione: "Para escribir" },
      byAbility: "Por parte"
    },

    /* The shareable card: a sheet of parchment with a Greek key frame. */
    card: {
      file: "agora-",
      frame: function (g, W, H) {
        var grad = g.createLinearGradient(0, 0, 0, H); grad.addColorStop(0, "#efe6d6"); grad.addColorStop(1, "#d9c6a5");
        g.fillStyle = grad; g.fillRect(0, 0, W, H);
        g.fillStyle = "#fffaf0"; g.fillRect(40, 36, W - 80, H - 110);
        g.strokeStyle = "#1c1a17"; g.lineWidth = 6; g.strokeRect(40, 36, W - 80, H - 110);
        g.fillStyle = "#b5532f"; g.fillRect(40, 36, W - 80, 44);
        g.fillStyle = "#1c1a17"; g.fillRect(0, H - 26, W, 26);
      },
      head: { y: 66, color: "#ffffff" },
      text: "#1c1a17", muted: "#6b6152",
      rank: { font: "bold 56px Georgia, serif", y: 150 },
      lines: [200, 240, 276]
    },

    // Confetti: owls, columns, scrolls.
    confetti: { bits: ["🦉", "🏛️", "📜", "🫒", "🏺"], n: 30, ms: 2900,
                colors: ["--mar", "--coral", "--sol", "--mata", "--ceu", "--coral-claro", "--mar-claro"], fallback: "#b5532f" },

    ui: {
      langEs: "filosofía",
      tabs: [["oggi", "☀️", "Hoy"], ["percorso", "🏛️", "Camino"], ["io", "👤", "Yo"]],
      allTabs: [["frasi", "🦉", "Entrenar"], ["leggi", "📖", "Leer"]],
      today: "Hoy", train: "Entrenar", read: "Leer", me: "Yo",
      path: "El camino", pathEl: "el camino", pathAl: "al camino", pathTu: "tu camino",
      // The logo is a stone plaque, like the inscriptions of the agora.
      plate: { cls: "placa", sup: "p-sup", main: "p-rua" },
      logo: "Ágora", level: "Nivel",
      week: "Semana", weekLow: "semana", romanWeeks: false,
      of: " de ",
      cheer: { last: "¡La última!", almost: "¡Ya casi!", half: "¡Mitad del camino!" },
      hello: function (h) { return h < 12 ? "Buen día ☀️" : h < 20 ? "Buenas tardes 🦉" : "Buenas noches 🌙"; },
      pausaBtn: "<b>Pausa</b><small>3 minutos con lo de tu semana</small>",
      daily: "Desafío del día", dailyWon: "🎯 Desafío del día ganado",
      review: "Repaso", reviewEl: "el repaso", micro: "Repaso de 2 min",
      words: "Conceptos",
      boss: "Examen de estación", Boss: "Examen de estación",
      pathLead: "La historia de la filosofía de los presocráticos a hoy, con sus ramas y otras tradiciones, en estaciones de 13 semanas con un examen al final de cada una. El curso se está escribiendo: aparecen las semanas que ya están listas. Cada semana tiene <b>3 estrellas</b>: " +
        "jugar la lección, superar la semana y dominarla.",
      fraseDay: "Concepto del día",
      calendarGreen: "Verde",
      theoryBack: "← a la semana", theory: "Teoría · semana ",
      right: ["¡Bien!", "¡Exacto!", "¡Eso!"], wasThis: "Era así:",
      next: "Seguir →", check: "Corregir",
      inLang: "en castellano…",
      keys: [],
      // the answers are in Spanish: the phone's own keyboard, with its autocorrect (no teclado.js)
      appKeyboard: false,
      giusto: ["¡Bien!", "¡Exacto!", "¡Eso!", "¡Muy bien!", "¡Impecable!", "¡Sócrates aprueba!"],
      quasi: "¡Casi! Un detalle.",
      sbagliato: ["No pasa nada. Era así:", "Tranqui, era así:", "Para la próxima, era así:"],
      keywordEx: "«arjé» → el principio de todo",
      pausa: "Pausa", sfida: "Desafío",
      perfectWeek: "¡Semana perfecta!",
      great: "🏆 ¡Excelente!", good: "👏 ¡Muy bien!",
      chal: "Desafíos", chalLead: "Desafíos extra de la semana: cada uno es una ronda corta, con corrección. ",
      metaEx: "«En un año, leer la República sin miedo»",
      exportFile: "agora-copia-", icsFile: "agora-diario.ics", icsId: "AGORA",
      icsSummary: "☕ Pausa: 3 minutos de filosofía", icsAlarm: "¡A pensar! 3 minutos de filosofía",
      switchTo: "", switchCode: ""
    }
  };

  root.LANG = LANG;
})(typeof window !== "undefined" ? window : globalThis);
