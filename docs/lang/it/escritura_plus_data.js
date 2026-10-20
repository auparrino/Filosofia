/* Escritura plus (docs/js/escritura_plus.js): lo que depende del italiano.
 *
 * prompt(testo, ctx): el pedido a la IA para la reformulación.  Devuelve el
 * mismo texto del alumno come lo scriverebbe un italiano, sin marcar ni
 * explicar errores (el alumno encuentra las diferencias solo).  ctx: week,
 * level, task (la consigna de la semana, de Scrivi.TASKS).
 */
(function (root) {
  "use strict";
  var DATA = {
    prompt: function (text, ctx) {
      ctx = ctx || {};
      var task = ctx.task || {};
      return "Sei un italiano colto e scrivi in un italiano naturale e corretto. Uno studente ispanofono " +
        (ctx.level ? "(livello " + ctx.level + ", settimana " + ctx.week + " di 52) " : "") +
        "ha scritto questo testo" + (task.t ? " per la consegna «" + task.t + "»" : "") + ".\n" +
        "Riscrivilo come lo scriverebbe un madrelingua italiano: stesso contenuto, stesse idee, stesso ordine e più o meno la stessa lunghezza. " +
        "Cambia solo quello che un italiano direbbe in un altro modo: errori, calchi dallo spagnolo, parole poco naturali, collocazioni, ordine delle parole, connettivi. " +
        "Le frasi che sono già naturali lasciale esattamente come sono, parola per parola. Usa strutture adatte al livello dello studente. " +
        "Non spiegare niente, non segnalare gli errori, non aggiungere idee nuove, niente commenti.\n" +
        "Testo:\n" + text + "\n" +
        "Rispondi SOLO con JSON: {\"testo\": \"il testo riscritto\"}";
    }
  };
  if (typeof module === "object" && module.exports) module.exports = DATA;
  root.ESCRITURA_PLUS_DATA = DATA;
})(typeof window !== "undefined" ? window : globalThis);
