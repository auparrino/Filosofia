/*
 * Voces reales de Common Voice (Mozilla, CC0): oraciones leídas por
 * hablantes distintos, para el dictado de Sons y «¿Qué forma escuchaste?».
 *
 * Todavía NO hay grabaciones de Common Voice en portugués incluidas: ALL
 * está vacío y el resto del código funciona igual (el dictado usa el TTS
 * pt-BR con oraciones de la banca y de las frases, y «¿Qué forma
 * escuchaste?» no aparece).  Para sumarlas: elegir oraciones de Common
 * Voice Portuguese (conviene filtrar por acento brasileño, que el corpus
 * declara en `accents`), revisarlas a mano, copiar los mp3 a
 * docs/lang/pt/audio/cv/common_voice_pt_<f>.mp3 y agregarlas acá.
 *
 * Esquema de cada entrada: f, el número del archivo; w, desde qué semana se
 * puede dictar; pt, la oración; a / b (opcional): la forma que se oye y la
 * que compite, que se abre en la semana fw; why: qué la decide.
 */
(function (root) {
  "use strict";
  var ALL = [];
  // Relative to docs/ (index.html): the audio lives in the language's package.
  function url(x) { return "lang/pt/audio/cv/common_voice_pt_" + x.f + ".mp3"; }

  /* Lingua Libre (voci.js): grabaciones «LL-Q5146 (por)-<hablante>-<palabra>»
     (Q5146 es el portugués en Wikidata).  Una palabra suelta, con las letras
     del portugués (tildes y ç incluidas): en portugués la tilde es
     ortografía y está en el nombre del archivo (avó / avô, pôde / pode).
     Nada de frases, guiones ni apóstrofos. */
  var LINGUA_LIBRE = {
    q: "Q5146", tag: "por",
    letters: "a-zàáâãçéêíóôõúü",
    // Brasil o Portugal: Lingua Libre graba todo el portugués bajo el mismo
    // código (Q5146) y el nombre del archivo no dice de dónde es el
    // hablante; ese dato vive en el perfil, que la búsqueda de Commons no
    // devuelve.  prefer: los hablantes que sabemos de Brasil, que van
    // primero (Ederporto es del equipo de Wiki Movimento Brasil, a confirmar
    // en su perfil); avoid: los de Portugal o África, que quedan al final
    // (se oyen solo si no hay nadie más).  Las dos listas se completan a mano
    // revisando los perfiles en lingualibre.org.
    prefer: ["Ederporto"], avoid: []
  };

  var api = { ALL: ALL, url: url, LICENSE: "Common Voice · CC0", LINGUA_LIBRE: LINGUA_LIBRE };
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.VociCV = api;
})(typeof window !== "undefined" ? window : globalThis);
