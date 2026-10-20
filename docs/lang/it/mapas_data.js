/*
 * Mapas de preposiciones del italiano (docs/js/mapas.js los dibuja).
 *
 * La idea que cambia todo para el hispanohablante: en italiano *a* e *in*
 * no marcan si estás o si vas (el castellano pasa de «en» a «a»), sino la
 * forma del lugar: un punto (*a Roma, a casa*) o una zona, un recipiente
 * (*in Italia, in ufficio*).  *su* es la superficie; *da*, el punto de
 * partida y la casa de alguien; *di*, de dónde sos; *per*, el camino y el
 * rumbo.  Los bloques se suman al final de la lección de la semana 9.
 *
 * Escena: lm (caja | zona | superficie | punto | casa), mov ("" | hacia |
 * idaVuelta | desde | por | rumbo | lazo), label (el lugar, en italiano),
 * prep, cap (el ejemplo) y es (la idea en castellano) para el epígrafe.
 */
(function (root) {
  "use strict";
  var PROMPT = "Elegí la preposición mirando el dibujo";
  root.MAPAS_DATA = {
    week: 9,
    scenes: {
      "a-punto":   { lm: "punto", label: "Roma", prep: "a", cap: "Sono *a* Roma.", es: "Un punto del mapa: una ciudad, casa, la escuela." },
      "a-hacia":   { lm: "punto", mov: "hacia", label: "Roma", prep: "a", cap: "Vado *a* Roma.", es: "Estés o vayas: con un punto, a." },
      "in-zona":   { lm: "zona", label: "Italia", prep: "in", cap: "Sono *in* Italia.", es: "Una zona: un país, una región." },
      "in-hacia":  { lm: "zona", mov: "hacia", label: "Spagna", prep: "in", cap: "Vado *in* Spagna.", es: "Estés o vayas: con una zona, in." },
      "in-caja":   { lm: "caja", label: "ufficio", prep: "in", cap: "Sono *in* ufficio.", es: "Adentro de un lugar cerrado." },
      "su":        { lm: "superficie", label: "tavolo", prep: "su", cap: "Le chiavi sono *sul* tavolo.", es: "Apoyado encima." },
      "da-desde":  { lm: "punto", mov: "desde", label: "Napoli", prep: "da", cap: "Vengo *da* Napoli.", es: "El punto de partida." },
      "da-casa":   { lm: "casa", mov: "hacia", label: "Marco", prep: "da", cap: "Vado *da* Marco.", es: "A lo de alguien (y en lo de alguien: sono da Marco)." },
      "di-lazo":   { lm: "punto", mov: "lazo", label: "Napoli", prep: "di", cap: "Sono *di* Napoli.", es: "No es un viaje: es de dónde sos." },
      "per-rumbo": { lm: "punto", mov: "rumbo", label: "Parigi", prep: "per", cap: "Parto *per* Parigi.", es: "El rumbo: salís con destino a…" },
      "per-por":   { lm: "zona", mov: "por", label: "città", prep: "per", cap: "Un giro *per* la città.", es: "El recorrido, a través de un lugar." },
      // only for the exercises
      "q-cassetto": { lm: "caja", label: "cassetto" },
      "q-torino":   { lm: "punto", mov: "hacia", label: "Torino" },
      "q-grecia":   { lm: "zona", mov: "hacia", label: "Grecia" },
      "q-bari":     { lm: "punto", mov: "desde", label: "Bari" },
      "q-marco":    { lm: "casa", label: "Marco" }
    },
    blocks: [
      {
        h: "El mapa: punto, zona o superficie",
        r: "En italiano la preposición no cambia si **estás** o si **vas**: cambia la **forma del lugar**. Un punto del mapa (una ciudad, *casa*, *scuola*) pide *a*; una zona o un lugar cerrado (un país, *ufficio*, *banca*) pide *in*; una superficie pide *su*.",
        fig: ["a-punto", "a-hacia", "in-zona", "in-hacia", "in-caja", "su"],
        ex: [
          ["Abito *a* Torino.", "Vivo en Turín."],
          ["Domani vado *a* Torino.", "Mañana voy a Turín."],
          ["Lavoro *in* Germania.", "Trabajo en Alemania."],
          ["Vado *in* Germania in aereo.", "Voy a Alemania en avión."],
          ["Il telefono è *sul* tavolo.", "El teléfono está sobre la mesa."]
        ],
        warn: "El castellano cambia «en» por «a» cuando te movés (*estoy en* Roma, *voy a* Roma). El italiano no: *sono a Roma, vado a Roma*; *sono in Spagna, vado in Spagna*.",
        tip: "Con artículo, la preposición se contrae y el dibujo es el mismo: *nel cassetto*, *sul tavolo*, *al cinema*.",
        qq: [
          { fig: "in-caja", prompt: PROMPT, stem: "Sono ___ ufficio fino alle sei.", answer: "in", options: ["in", "a", "su"] },
          { fig: "q-cassetto", prompt: PROMPT, stem: "Le chiavi sono ___ cassetto.", answer: "nel", options: ["nel", "sul", "al"] },
          { fig: "su", prompt: PROMPT, stem: "Le chiavi sono ___ tavolo.", answer: "sul", options: ["sul", "nel", "al"] },
          { fig: "q-torino", prompt: PROMPT, stem: "Domani vado ___ Torino.", answer: "a", options: ["a", "in", "su"] },
          { fig: "q-grecia", prompt: PROMPT, stem: "Quest'estate vado ___ Grecia.", answer: "in", options: ["in", "a", "da"] }
        ]
      },
      {
        h: "El mapa: de dónde, a lo de quién, por dónde",
        r: "*da* es el **punto de partida** (*vengo da Napoli*) y también **la casa de alguien** (*vado da Marco*, *sono da Marco*). *di* no se mueve: dice de dónde **sos** (*sono di Napoli*). *per* es el **camino** (*un giro per la città*) o el **rumbo** (*parto per Parigi*).",
        fig: ["da-desde", "da-casa", "di-lazo", "per-rumbo", "per-por"],
        ex: [
          ["Vengo *da* Napoli, ma sono *di* Bari.", "Vengo de Nápoles, pero soy de Bari."],
          ["Stasera andiamo *da* Giulia.", "Esta noche vamos a lo de Julia."],
          ["Il treno parte *per* Milano alle otto.", "El tren sale para Milán a las ocho."],
          ["Facciamo una passeggiata *per* il centro.", "Damos un paseo por el centro."]
        ],
        warn: "«Soy de Nápoles» es *sono di Napoli*; «vengo de Nápoles», *vengo da Napoli*. Con *essere*, el origen es *di*; con un verbo de movimiento, *da*.",
        tip: "A lo de alguien no se va con *a*: *vado da Marco*, *vado dal medico*. Y con *da* también se está: *sono dal parrucchiere*.",
        qq: [
          { fig: "q-bari", prompt: PROMPT, stem: "Il treno arriva ___ Bari.", answer: "da", options: ["da", "di", "per"] },
          { fig: "di-lazo", prompt: PROMPT, stem: "Mia nonna è ___ Napoli.", answer: "di", options: ["di", "da", "per"] },
          { fig: "q-marco", prompt: PROMPT, stem: "Stasera ceno ___ Marco.", answer: "da", options: ["da", "a", "di"] },
          { fig: "per-rumbo", prompt: PROMPT, stem: "Domani parto ___ Parigi.", answer: "per", options: ["per", "da", "di"] },
          { fig: "per-por", prompt: PROMPT, stem: "Facciamo un giro ___ la città.", answer: "per", options: ["per", "da", "di"] }
        ]
      }
    ]
  };
})(typeof window !== "undefined" ? window : this);
