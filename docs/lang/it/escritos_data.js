/*
 * Esercizi scritti sui testi già letti (C-test, cloze razionale, «Ordená el
 * texto»): le liste della lingua.  Solo dati: la logica è nel nucleo
 * (docs/js/ctest.js, docs/js/ordenar.js, docs/js/escritos.js).
 *
 *   conn    connettivi e congiunzioni che il cloze razionale toglie
 *   prep    preposizioni semplici e articolate
 *   equiv   gruppi che valgono lo stesso in un buco (ma / però)
 *   clues   le spie della coesione per rimettere in ordine un testo:
 *           [forma, che cosa dice in castellano]; le forme di più parole
 *           prima
 *   refer   parole che rimandano a qualcosa già detto (pronomi, dimostrativi)
 */
(function (root) {
  "use strict";
  root.ESCRITOS_DATA = {
    conn: ["e", "ed", "ma", "però", "perché", "quando", "poi", "quindi", "anche", "allora", "infatti",
           "invece", "mentre", "oppure", "o", "se", "così", "comunque", "anzi", "cioè", "dunque",
           "inoltre", "tuttavia", "finché", "siccome", "neanche", "nemmeno", "pure", "infine", "prima", "dopo"],
    prep: ["di", "a", "da", "in", "con", "su", "per", "tra", "fra",
           "del", "dello", "della", "dei", "degli", "delle",
           "al", "allo", "alla", "ai", "agli", "alle",
           "dal", "dallo", "dalla", "dai", "dagli", "dalle",
           "nel", "nello", "nella", "nei", "negli", "nelle",
           "sul", "sullo", "sulla", "sui", "sugli", "sulle"],
    equiv: [["ma", "però"], ["quindi", "allora", "dunque"], ["tra", "fra"], ["neanche", "nemmeno"], ["e", "ed"], ["o", "oppure"]],
    clues: [
      ["alla fine", "al final: cierra el texto"], ["il giorno dopo", "al día siguiente"], ["per questo", "por eso: consecuencia de lo anterior"],
      ["prima di tutto", "antes que nada: abre"], ["la mattina", "a la mañana"], ["il pomeriggio", "a la tarde"], ["la sera", "a la noche"],
      ["poi", "después: sigue a otra acción"], ["dopo", "después"], ["prima", "antes / primero"], ["infine", "finalmente: cierra"],
      ["però", "pero: contrasta con lo anterior"], ["ma", "pero: contrasta con lo anterior"], ["invece", "en cambio: contrasta"],
      ["quindi", "así que: consecuencia"], ["allora", "entonces"], ["infatti", "de hecho: confirma lo anterior"],
      ["anche", "también: suma a algo ya dicho"], ["inoltre", "además: suma"], ["comunque", "de todos modos"],
      ["insomma", "en fin: resume"], ["ormai", "ya (a esta altura)"], ["ancora", "todavía / otra vez"], ["adesso", "ahora"],
      ["oggi", "hoy"], ["domani", "mañana"], ["ieri", "ayer"], ["finalmente", "por fin"]
    ],
    refer: ["lui", "lei", "loro", "questo", "questa", "questi", "queste", "quello", "quella", "lì", "là"]
  };
})(typeof window !== "undefined" ? window : globalThis);
