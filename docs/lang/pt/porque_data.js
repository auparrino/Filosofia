/*
 * «¿Por qué?» y «¿Qué tenía de malo?» (docs/js/porque.js): lo que depende
 * del portugués de Brasil.
 *
 *   why    qué tiene de malo una opción, por categoría de diagnosi.js (una
 *          línea, en castellano, para elegir entre tres)
 *   near   las categorías que se confunden con cada una: de ahí sale la
 *          explicación falsa «cercana»; la otra sale de otra familia
 *   weeks  la semana que enseña cada etiqueta del banco o categoría de
 *          error: ahí se busca primero el bloque de teoría
 *   review las semanas de repaso (jefes): valen menos como explicación
 *   capas  la explicación en capas por categoría: regla, contraste con el
 *          español y un ejemplo (la usan diagnosi.js y scrivi.js)
 */
(function (root) {
  "use strict";

  var why = {
    contraccion: "No contrae la preposición con el artículo (*em + o = no*, *de + a = da*).",
    articulo: "El artículo no es el que corresponde.",
    genero: "Le cambia el género al sustantivo.",
    plural: "El plural está mal formado.",
    concordancia: "No concuerda en género o en número.",
    preposicion: "La preposición no es la que pide el portugués.",
    regencia: "El verbo pide otra preposición (*chegar a*, *precisar de*, *pensar em*).",
    muito: "*Muito* no se achica a «muy»: sirve para *muy* y para *mucho*.",
    gostar: "Con *gostar*, a quien le gusta es el sujeto (*eu gosto*) y lo que gusta va con *de*: *gosto de café*.",
    a_personal: "Le pone la «a» personal del castellano: en portugués el objeto de persona va sin *a*.",
    perfeito_composto: "Usa el perfeito composto (*tenho feito*) donde va el perfeito simple, o al revés.",
    subjuntivo: "Ahí la frase pide subjuntivo y la opción usa el indicativo (o al revés).",
    futuro_subj: "Ahí va el futuro do subjuntivo (*quando eu for*, *se você puder*).",
    inf_pessoal: "Falla el infinitivo personal (*para nós irmos*).",
    pronome: "El pronombre no es el que corresponde.",
    colocacao: "El pronombre está en el lugar equivocado.",
    crase: "Falla la crase: falta la *à* (a + a) o hay una que no va.",
    ortografia: "Está mal escrita: una letra cambiada.",
    tilde: "Le falta o le sobra la tilde.",
    espanol: "Es una palabra del castellano, no del portugués.",
    otra_lengua: "Es una palabra del italiano colada en el portugués.",
    falso_amigo: "Es un falso amigo: en portugués esa palabra quiere decir otra cosa.",
    tempo: "El verbo está en otro tiempo del que pide la frase.",
    persona: "El verbo está en otra persona: no concuerda con el sujeto.",
    ser_estar: "Usa *ser* donde va *estar* (o *ficar*), o al revés: lo que algo es, cómo o dónde está.",
    participio: "El participio no es el que corresponde.",
    verbo_irregular: "Es un verbo irregular y esa forma no existe.",
    regularizacion: "Conjuga como regular un verbo que es irregular.",
    nasal: "Falla la nasal: *ã*, *õ* o la *-m* del final.",
    orden: "Las palabras están en otro orden.",
    registro: "Es una forma del habla (pra, tô, vi ele) donde se pide lo escrito formal."
  };

  /* La explicación en capas (auditoría C3 y C5), por categoría del
     diagnóstico: la regla en una línea, el contraste con el español en una
     línea y un ejemplo que no sea el del ítem.  diagnosi.js suma el
     contraste cuando su explicación no lo trae, y la regla con el ejemplo
     cuando la explicación solo dice qué va («Acá va…», «Sobra…»); Scrivi
     las usa para que cada marca diga el porqué. */
  var capas = {
    crase: { regla: "La crase (*à*) es la preposición *a* fundida con el artículo *a*.",
             es: "*à* es «a la»: vou à praia = voy a la playa; donde en español dirías «al», en portugués va *ao*.",
             ej: "Vou à feira, ao mercado e às lojas." },
    contraccion: { regla: "*em, de, a, por* se funden con el artículo y con los pronombres: *no, da, ao, pelo, dele, nisso*.",
                   es: "En español solo se contraen «al» y «del»; en portugués la contracción es obligatoria con *em* y *por* también.",
                   ej: "Moro no Rio e gosto da praia." },
    colocacao: { regla: "El pronombre átono va delante del verbo en el habla de Brasil (me chamo) y después de *não, que, quem, já*; lo escrito formal no empieza con él (Chamo-me).",
                 es: "Como en español, el pronombre va delante del verbo conjugado («me llamo»); la diferencia es lo escrito formal, que al comienzo lo pone detrás.",
                 ej: "Não me disse nada. / Disseram-me que sim." },
    futuro_subj: { regla: "Después de *quando, se, assim que, enquanto* hablando del futuro va el futuro do subjuntivo: *quando eu for, se você puder*.",
                   es: "El español dice «cuando llegue», con el subjuntivo presente; el portugués tiene una forma propia: *quando chegar*.",
                   ej: "Quando eu tiver tempo, te ligo." },
    inf_pessoal: { regla: "El infinitivo lleva la persona cuando tiene sujeto propio: *para nós irmos, antes de eles saírem*.",
                   es: "El español no lo tiene: dice «para que salgamos»; el portugués puede decir *para sairmos*.",
                   ej: "É importante vocês chegarem cedo." },
    orden: { regla: "El orden de la frase es casi siempre el del español: sujeto, verbo y complementos.",
             es: "Lo que cambia respecto del español es poco: el pronombre átono y las preguntas sin dar vuelta el sujeto (Onde você mora?).",
             ej: "O João sempre toma café na padaria." },
    ortografia: { regla: "La grafía portuguesa tiene letras propias: *nh, lh, ç, ss, rr*, y la *-m* final nasal.",
                  es: "Donde el español usa *ñ* y *ll*, el portugués usa *nh* y *lh*; la *-ción* es *-ção* y la *-dad*, *-dade*.",
                  ej: "senhor, trabalho, canção, cidade" },
    articulo: { regla: "El portugués pone el artículo donde lo pone el español, y además ante los países que lo llevan (o Brasil) y, en el habla, ante nombres de persona (o João).",
                es: "Como en español, va sin artículo *casa* como el hogar propio (vou para casa = voy a casa), las ciudades (moro em Salvador) y expresiones hechas (de ônibus).",
                ej: "Estou em casa. / Moro no Brasil." },
    preposicion: { regla: "Las preposiciones van con su verbo o su expresión: se aprenden juntas.",
                   es: "No se traducen una a una desde el español: «en auto» es *de carro*, «a pie» es *a pé*, «hace dos años» es *há dois anos*.",
                   ej: "Vou de ônibus e volto a pé." },
    regencia: { regla: "Cada verbo pide su preposición: *gostar de, precisar de, pensar em, sonhar com, chegar a*.",
                es: "Varias no coinciden con el español: «pensar en» es *pensar em*, «soñar con» es *sonhar com*, «casarse con» es *casar com*, y *namorar* va sin preposición.",
                ej: "Penso em você e sonho com o Rio." },
    genero: { regla: "El género se aprende con la palabra: con su artículo (*o leite, a viagem*).",
              es: "Muchas palabras cambian de género respecto del español: *o leite, o sangue, a árvore, a viagem, a ponte*; las terminadas en *-agem* son femeninas.",
              ej: "a mensagem, o nariz, a dor" },
    concordancia: { regla: "Artículos, adjetivos y participios toman el género y el número del sustantivo.",
                    es: "Igual que en español; el cuidado está en los sustantivos que cambian de género (a viagem longa, o leite frio).",
                    ej: "As praias são lindas." },
    plural: { regla: "El plural sigue la terminación: *-ão → -ões* (casi siempre), *-l → -is*, *-m → -ns*.",
              es: "El español agrega -es a las terminadas en -l y -n («animales», «canciones»); el portugués cambia la terminación: *animais, canções*.",
              ej: "um jornal, dois jornais; um homem, dois homens" },
    persona: { regla: "El verbo concuerda con su sujeto; *você* y *a gente* van con la tercera del singular.",
               es: "*Você* es «vos / usted» pero conjuga como «él»: você fala = vos hablás; no hay voseo en el verbo.",
               ej: "Você mora aqui? A gente vai amanhã." },
    tempo: { regla: "El tiempo lo deciden las pistas de la frase: *ontem* (perfeito), *antigamente, quando era criança* (imperfeito), *amanhã* (futuro).",
             es: "Como en español: el perfeito es «hice», el imperfeito «hacía»; pero «he hecho» se dice con el perfeito simple (fiz).",
             ej: "Ontem fui à praia; quando era criança, ia todo domingo." },
    subjuntivo: { regla: "Después de deseo, duda, pedido, emoción y de *para que, embora, talvez* va el subjuntivo.",
                  es: "Se usa casi igual que en español: «quiero que vengas» = *quero que você venha*.",
                  ej: "Espero que você goste." },
    participio: { regla: "Con *ter* va el participio regular e invariable (tinha pagado); con *ser, estar, ficar*, el irregular y concordado (foi paga).",
                  es: "En español hay un solo participio; el portugués tiene dos en varios verbos (aceitado / aceito, pagado / pago).",
                  ej: "A conta foi paga. Eu tinha aceitado o convite." },
    pronome: { regla: "Después de preposición va *mim* (para mim), con *com* se funden (comigo), y el objeto directo es *o, a*; el indirecto, *lhe*.",
               es: "No existen *le, lo, la* sueltos del español; «para mí» es *para mim* y «conmigo», *comigo*.",
               ej: "Isso é para mim. Eu o conheço." },
    gostar: { regla: "*Gostar* lleva siempre *de*, y el que gusta es el sujeto: *eu gosto de café*.",
              es: "Va al revés que «gustar»: «me gusta el café» es *eu gosto do café*.",
              ej: "Ela gosta de dançar." },
    muito: { regla: "*Muito* hace de «muy» y de «mucho»: delante de adjetivo no cambia; delante de sustantivo concuerda (muitas pessoas).",
             es: "El portugués no tiene «muy»: *muito bonito*, *muito bem*.",
             ej: "Muita gente fala muito bem." },
    a_personal: { regla: "El objeto directo de persona va sin preposición: *vi o João, conheço a Maria*.",
                  es: "El español pone «a» ante la persona («vi a Juan»); el portugués no.",
                  ej: "Visitei meus avós." },
    perfeito_composto: { regla: "*Tenho feito* es algo que se viene repitiendo hasta hoy; lo que pasó y terminó va en el perfeito simple.",
                         es: "No es el «he hecho» del español: «he comido» es *comi*; *tenho comido* es «vengo comiendo».",
                         ej: "Tenho estudado muito ultimamente. Hoje comi feijoada." },
    nasal: { regla: "La nasal se marca con til (*ã, õ*) o con *-m* al final y antes de *p, b*.",
             es: "Donde el español termina en -n («con, bien»), el portugués pone *-m*: *com, bem*.",
             ej: "não, mãe, bom, também, tempo" },
    tilde: { regla: "Las reglas de la tilde son casi las del español; *ê, ô* marcan la vocal cerrada y *é, ó* la abierta.",
             es: "Distinto del español: las llanas terminadas en *-ia, -io, -ua* llevan tilde (história, água).",
             ej: "você, café, avó, avô, história" },
    registro: { regla: "El habla de Brasil acorta y reordena (pra, tô, cê, vi ele); en lo escrito formal va la forma completa.",
                es: "Como el «pa'» o el «tá» del habla rioplatense: vale en un chat, no en una carta formal.",
                ej: "Tô indo pra casa. / Estou indo para casa." }
  };

  var FORMA = ["ortografia", "tilde", "nasal", "espanol"];
  var NOME = ["articulo", "contraccion", "genero", "concordancia", "plural"];
  var VERBO = ["persona", "tempo", "verbo_irregular", "regularizacion", "participio", "subjuntivo", "perfeito_composto", "ser_estar"];
  var SUBJ = ["subjuntivo", "futuro_subj", "inf_pessoal", "tempo"];
  var PRON = ["pronome", "colocacao", "a_personal"];
  var PREP = ["preposicion", "regencia", "contraccion", "crase", "gostar", "a_personal"];
  var LEX = ["espanol", "otra_lengua", "falso_amigo", "muito", "ortografia"];
  var near = {};
  [FORMA, NOME, VERBO, SUBJ, PRON, PREP, LEX].forEach(function (g) {
    g.forEach(function (k) {
      near[k] = (near[k] || []).concat(g.filter(function (x) { return x !== k && (near[k] || []).indexOf(x) < 0; }));
    });
  });
  near.orden = ["colocacao", "preposicion"];

  var weeks = {
    // etiquetas del banco
    ser_estar: 1, contracciones: 3, ter: 1, posesivos: 10, muito: 4, articulos: 3, genero: 2,
    concordancia: 4, plurales: 2, falsos_amigos: 45, preposiciones: 9, presente: 5, preguntas: 8,
    irregulares: 6, horas: 7, numeros: 7, gerundio: 8, ir_inf: 8, demostrativos: 10, gostar: 14,
    perfeito: 11, perfeito_composto: 21, reflexivos: 12, imperativo: 12, a_personal: 35,
    indefinidos: 20, regencia: 35, pronombres: 16, imperfeito: 15, perf_imperf: 15, colocacao: 33,
    futuro: 17, condicional: 18, comparativos: 19, mais_que_perfeito: 21, participio: 22, pasiva: 22,
    subjuntivo: 23, conjunciones: 24, relativos: 25, futuro_subj: 27, subj_imperfeito: 28,
    condicionales: 28, inf_pessoal: 29, compuestos: 30, discurso_indirecto: 31, se_pasiva: 32,
    conectores: 34, crase: 36, nominalizacion: 40, reducidas: 42, coloquial: 38, portugal: 46, variacion: 46,
    // los ejercicios de formas del banco (por el comienzo de su id);
    // [semana, bloque] cuando un solo bloque los explica
    "b:art": 3, "b:pl": 2, "b:agr": 4, "b:prep": 3,
    // categorías de error
    contraccion: 3, articulo: 3, plural: 2, preposicion: 9, pronome: 16, falso_amigo: 45,
    persona: 5, verbo_irregular: 6, nasal: 1, registro: 38
  };

  root.PORQUE_DATA = { why: why, near: near, weeks: weeks, review: [13, 26, 39, 51, 52], capas: capas };
})(typeof window !== "undefined" ? window : globalThis);
