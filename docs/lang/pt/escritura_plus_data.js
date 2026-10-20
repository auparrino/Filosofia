/* Escritura plus (docs/js/escritura_plus.js): lo que depende del portugués.
 *
 * prompt(texto, ctx): el pedido a la IA para la reformulación.  Devuelve el
 * mismo texto del alumno como o escreveria um brasileiro, sin marcar ni
 * explicar errores (el alumno encuentra las diferencias solo).  ctx: week,
 * level, task (la consigna de la semana, de Scrivi.TASKS).
 */
(function (root) {
  "use strict";
  var DATA = {
    prompt: function (text, ctx) {
      ctx = ctx || {};
      var task = ctx.task || {};
      return "Você é um brasileiro culto e escreve num português do Brasil natural e correto. Um aluno hispanofalante " +
        (ctx.level ? "(nível " + ctx.level + ", semana " + ctx.week + " de 52) " : "") +
        "escreveu este texto" + (task.t ? " para a proposta «" + task.t + "»" : "") + ".\n" +
        "Reescreva o texto como um brasileiro nativo o escreveria: mesmo conteúdo, mesmas ideias, mesma ordem e mais ou menos o mesmo tamanho. " +
        "Mude só o que um brasileiro diria de outro jeito: erros, decalques do espanhol, palavras pouco naturais, colocações, ordem das palavras, conectivos, contrações. " +
        "As frases que já soam naturais ficam exatamente como estão, palavra por palavra. Use estruturas adequadas ao nível do aluno. " +
        "Não explique nada, não aponte os erros, não acrescente ideias novas, nenhum comentário.\n" +
        "Texto:\n" + text + "\n" +
        "Responda SÓ com JSON: {\"testo\": \"o texto reescrito\"}";
    }
  };
  if (typeof module === "object" && module.exports) module.exports = DATA;
  root.ESCRITURA_PLUS_DATA = DATA;
})(typeof window !== "undefined" ? window : globalThis);
