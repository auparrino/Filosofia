/*
 * «¿Por qué?» y «¿Qué tenía de malo?» (docs/js/porque.js): lo que depende
 * del italiano.
 *
 *   why    qué tiene de malo una opción, por categoría de diagnosi.js (una
 *          línea, en castellano, para elegir entre tres)
 *   near   las categorías que se confunden con cada una: de ahí sale la
 *          explicación falsa «cercana»; la otra sale de otra familia
 *   weeks  la semana que enseña cada etiqueta del banco o categoría de
 *          error: ahí se busca primero el bloque de teoría
 *   review las semanas de repaso (jefes): valen menos como explicación
 */
(function (root) {
  "use strict";

  var why = {
    ausiliare: "Usa el auxiliar equivocado: *essere* donde va *avere*, o al revés.",
    congiuntivo: "Ahí la frase pide *congiuntivo* y la opción usa el indicativo (o al revés).",
    periodo_ipotetico: "Los tiempos del período hipotético no combinan: *se* + congiuntivo, y el condicional en la otra mitad.",
    a_personale: "Le pone la «a» personal del castellano: en italiano el objeto de persona va sin *a*.",
    preposizione: "La preposición no es la que pide el italiano (*a*, *in*, *da*, *di*…).",
    preposizione_articolata: "La preposición y el artículo no se funden como corresponde (*in + il = nel*, *a + la = alla*).",
    persona_verbale: "El verbo está en otra persona: no concuerda con el sujeto.",
    tempo_verbale: "El verbo está en otro tiempo del que pide la frase.",
    condizionale: "Falla el condicional: la forma o el uso (*vorrei*, *potrei*).",
    irregolare: "Es un verbo irregular conjugado como si fuera regular.",
    participio_accordo: "El participio no concuerda: con *essere* toma el género y el número del sujeto.",
    genere: "Le cambia el género al sustantivo.",
    accordo: "No concuerda en género o en número con el sustantivo.",
    articolo: "El artículo no es el que corresponde (*il / lo / l'*, *un / uno*).",
    articolo_possessivo: "Falla el artículo con el posesivo: *la mia casa*, pero *mia madre*.",
    plurale: "El plural está mal formado.",
    pronome: "El pronombre no es el que corresponde.",
    posizione_pronome: "El pronombre está en el lugar equivocado.",
    ci_ne: "Falta o sobra *ci* / *ne*, o está uno en lugar del otro.",
    parola_spagnola: "Es una palabra del castellano, no del italiano.",
    otra_lengua: "Es una palabra del portugués colada en el italiano.",
    falso_amico: "Es un falso amigo: en italiano esa palabra quiere decir otra cosa.",
    ordine: "Las palabras están en otro orden.",
    ortografia: "Está mal escrita: una letra cambiada.",
    doppie: "Le falta o le sobra una consonante doble.",
    accento: "Le falta o le sobra la tilde (*è / e*, *città*)."
  };

  var FORMA = ["doppie", "accento", "ortografia", "parola_spagnola"];
  var NOME = ["articolo", "preposizione_articolata", "genere", "accordo", "plurale", "articolo_possessivo"];
  var VERBO = ["persona_verbale", "tempo_verbale", "ausiliare", "irregolare", "participio_accordo", "congiuntivo", "condizionale"];
  var PRON = ["pronome", "posizione_pronome", "ci_ne", "a_personale"];
  var PREP = ["preposizione", "preposizione_articolata", "a_personale", "articolo"];
  var LESS = ["parola_spagnola", "otra_lengua", "falso_amico", "ortografia"];
  var near = {};
  [FORMA, NOME, VERBO, PRON, PREP, LESS].forEach(function (g) {
    g.forEach(function (k) {
      near[k] = (near[k] || []).concat(g.filter(function (x) { return x !== k && (near[k] || []).indexOf(x) < 0; }));
    });
  });
  near.periodo_ipotetico = ["congiuntivo", "condizionale", "tempo_verbale"];
  near.ordine = ["posizione_pronome", "preposizione"];

  var weeks = {
    // etiquetas del banco
    piacere: 14, articoli: 3, riflessivi: 12, essere_avere: 1, presente: 5, preposizioni: 9,
    possessivi: 17, plurali: 2, preposizioni_articolate: 3, ci: 21, condizionale: 20, accordo: 4,
    falsi_amici: 50, connettivi: 28, a_personale: 10, comparativi: 23, pronomi_indiretti: 10,
    passato_prossimo: 11, ausiliare_essere: 11, participio_accordo: 11, pronomi_diretti: 10,
    futuro: 19, imperfetto: 15, imperfetto_vs_pp: 15, gerundio: 44, da_tempo: 9, superlativi: 23,
    relativi: 34, imperativo: 12, ne: 21, si_impersonale: 36, congiuntivo_presente: 24,
    pronomi_combinati: 22, periodo_ipotetico: 33, discorso_indiretto: 38, congiuntivo_imperfetto: 30,
    passivo: 35, passato_remoto: 37,
    // los ejercicios de formas del banco (por el comienzo de su id);
    // [semana, bloque] cuando un solo bloque los explica
    "b:art": 3, "b:pl": 2, "b:agr": 4, "b:prep": [3, 11],
    // categorías de error
    preposizione: 9, preposizione_articolata: 3, ausiliare: 11, articolo: 3, articolo_possessivo: 17,
    genere: 2, plurale: 2, doppie: 1, accento: 1, falso_amico: 50, congiuntivo: 25,
    pronome: 10, posizione_pronome: 10, ci_ne: 21, comparativo: 23, persona_verbale: 5, irregolare: 6
  };

  root.PORQUE_DATA = { why: why, near: near, weeks: weeks, review: [13, 26, 39, 51, 52] };
})(typeof window !== "undefined" ? window : globalThis);
