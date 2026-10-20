/* La capa de frecuencia del idioma: lo que docs/js/frequenza.js necesita
   saber de la lengua (letras, palabras vacías, lemas, pseudopalabras). */
(function (root) {
  "use strict";

  /* La capa de frecuencia (docs/js/frequenza.js): lo que es del italiano.
     Datos: data/frequenza.json (escrita, itWaC; hablada, OpenSubtitles;
     nivel, KELLY). */
  root.FREQ_DATA = {
    letters: "a-zàèéìíòóùú",
    // elided articles split: l'amico → l', amico
    elision: true,
    // Function words a learner meets from day one: they never count as unknown.
    STOP: ("il lo la i gli le l un uno una un' di a da in con su per tra fra e o ma che chi cui non si mi ti ci vi ne " +
      "io tu lui lei noi voi loro me te se sé è sono sei siamo siete ho hai ha abbiamo avete hanno del dello della dei degli " +
      "delle dell al allo alla ai agli alle all dal dallo dalla dai dagli dalle dall nel nello nella nei negli nelle nell sul " +
      "sullo sulla sui sugli sulle sull come dove quando perché quanto quale quali questo questa questi queste quello quella " +
      "quelli quelle qui qua lì là più meno molto poco tanto troppo anche già ancora sempre mai ora adesso poi oggi ieri domani " +
      "sì no c cosa cose bene male").split(/\s+/),
    /* Pseudo-words: one letter of the word swapped for one of its kind,
       keeping Italian phonotactics (no triple letters, no four consonants
       in a row). */
    pseudo: {
      vow: "aeiou", cons: "bcdfglmnprstvz", tries: 20,
      ok: function (p) { return !/(.)\1\1|[^aeiou]{4}/.test(p); }
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
