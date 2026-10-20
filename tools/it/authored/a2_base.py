# -*- coding: utf-8 -*-
"""Ortografía, negación, numerales y passato remoto.

Cubre las cuatro semanas cuyo tema no tiene ejercicios auto-corregibles en
"For Dummies" pero sí capítulo en el Soluzioni.
"""

ITEMS = [
    # --- ortografia e pronuncia (settimana 1) ---
    dict(id="a2-ort-01", type="choice", topic="ortografia", level="A1",
         prompt="¿Cuál se pronuncia con sonido duro [k]?",
         stem="___", options=["chi", "ci", "ce"], answer="chi",
         note="La h endurece: chi = [ki]. Sin h, c ante i/e suena [tʃ]."),
    dict(id="a2-ort-02", type="choice", topic="ortografia", level="A1",
         prompt="¿Cómo se escribe el plural de «amico»?",
         stem="amico → ___", options=["amici", "amichi", "amicos"], answer="amici",
         note="Excepción: amico/amici y greco/greci suavizan, contra la regla "
              "general -co → -chi (banco/banchi)."),
    dict(id="a2-ort-03", type="choice", topic="ortografia", level="A1",
         prompt="Elegí la palabra que significa «abuelo».",
         stem="___", options=["nonno", "nono", "nonna"], answer="nonno",
         note="La consonante doble es fonema pleno: «nono» = noveno. "
              "Pronunciala larga o cambiás de palabra."),
    dict(id="a2-ort-04", type="choice", topic="ortografia", level="A1",
         prompt="¿Dónde lleva acento gráfico?",
         stem="___", options=["città", "cittá", "cìtta"], answer="città",
         note="El italiano usa acento grave en la mayoría de las oxítonas; "
              "agudo en la é cerrada: perché, né, sé, affinché, ventitré."),
    dict(id="a2-ort-05", type="choice", topic="interrogativi", level="A1",
         prompt="¿Cuál es la forma correcta?",
         stem="___ è il tuo indirizzo?", options=["Qual", "Qual'", "Quale'"],
         answer="Qual",
         note="«Qual è» se escribe sin apóstrofo: es apócope, no elisión."),
    dict(id="a2-ort-06", type="choice", topic="ortografia", level="A1",
         prompt="¿Cómo suena «gli» en «figli»?",
         stem="figli", options=["[ʎ], como la «ll» tradicional (no la rioplatense)",
                                "[gli] separado", "[x] como la j española"],
         answer="[ʎ], como la «ll» tradicional (no la rioplatense)",
         note="Sonido palatal lateral. Excepciones donde sí se lee [gl]: "
              "glicerina, negligente, anglicano."),

    # --- negazioni ed esclamazioni (settimana 18) ---
    dict(id="a2-neg-01", type="choice", topic="negazioni", level="B1",
         prompt="Elegí la forma correcta.",
         stem="Non ho visto ___.", options=["nessuno", "nessun", "qualche"],
         answer="nessuno",
         note="Doble negación obligatoria: non + nessuno."),
    dict(id="a2-neg-02", type="choice", topic="negazioni", level="B1",
         prompt="Elegí la forma correcta.",
         stem="___ è venuto alla riunione.", options=["Nessuno", "Non nessuno",
                                                      "Niente"],
         answer="Nessuno",
         note="Si el negativo va DELANTE del verbo, desaparece el «non»."),
    dict(id="a2-neg-03", type="choice", topic="negazioni", level="B1",
         prompt="Elegí la forma correcta.",
         stem="Ho cambiato lavoro: non lavoro ___ qui.", options=["più", "ancora", "mai più"],
         answer="più",
         note="«non ... più» = ya no. «non ... ancora» = todavía no."),
    dict(id="a2-neg-04", type="choice", topic="negazioni", level="B1",
         prompt="¿Qué significa «Non ho neanche un euro»?",
         stem="Non ho neanche un euro.",
         options=["No tengo ni un euro", "No tengo casi un euro",
                  "Tengo apenas un euro"],
         answer="No tengo ni un euro",
         note="neanche / nemmeno / neppure son equivalentes."),
    dict(id="a2-neg-05", type="translate", topic="negazioni", level="B1",
         prompt="Traducí al italiano.",
         stem="Nunca he estado en Roma.",
         answer="Non sono mai stato a Roma",
         alt=["Non sono mai stata a Roma"],
         note="El adverbio negativo se mete entre auxiliar y participio."),
    dict(id="a2-esc-01", type="choice", topic="negazioni", level="B1",
         prompt="Elegí la exclamación correcta.",
         stem="___ bella giornata!", options=["Che", "Quanto", "Come"],
         answer="Che",
         note="«Che» + sustantivo/adjetivo. «Come/quanto» + verbo: "
              "Come sei gentile! Quanto mi manchi!"),
    dict(id="a2-esc-02", type="choice", topic="negazioni", level="B1",
         prompt="Elegí la correcta.",
         stem="___ sei cambiato!", options=["Come", "Che", "Quale"],
         answer="Come",
         note="Ante verbo conjugado se usa «come» o «quanto», nunca «che»."),

    # --- numerali, misure e quantità (settimana 47) ---
    dict(id="a2-num-01", type="choice", topic="numerali", level="B1",
         prompt="Elegí el ordinal correcto.",
         stem="Abito al ___ piano (11º).",
         options=["undicesimo", "undicimo", "primoundici"], answer="undicesimo",
         note="Del 11 en adelante: cardinal sin vocal final + -esimo (undicesimo, "
              "ventesimo); los terminados en -tré y en -sei conservan la vocal: "
              "ventitreesimo, ventiseiesimo."),
    dict(id="a2-num-02", type="choice", topic="numerali", level="B1",
         prompt="Elegí la forma correcta.",
         stem="Siamo andati in ___ (unas diez personas).",
         options=["una decina", "dieci", "un decimo"], answer="una decina",
         note="Colectivos aproximativos: una decina, una ventina, un centinaio, "
              "un migliaio."),
    dict(id="a2-num-03", type="choice", topic="numerali", level="B1",
         prompt="Elegí el partitivo correcto.",
         stem="Vorrei ___ pane.", options=["del", "di", "un po'"], answer="del",
         note="Partitivo = di + artículo: del pane, della carne, dei libri."),
    dict(id="a2-num-04", type="choice", topic="numerali", level="B1",
         prompt="Elegí la forma correcta.",
         stem="___ studenti sono assenti.", options=["Alcuni", "Qualche",
                                                     "Ogni"],
         answer="Alcuni",
         note="«Qualche» y «ogni» exigen singular: qualche studente, ogni studente. "
              "«Alcuni» va con plural."),
    dict(id="a2-num-05", type="cloze", topic="numerali", level="B1",
         prompt="Escribí el número en palabras.",
         stem="21 → ___", answer="ventuno",
         note="Las decenas pierden la vocal ante uno y otto: ventuno, ventotto, "
              "trentuno."),
    dict(id="a2-num-06", type="choice", topic="numerali", level="B1",
         prompt="Elegí la forma correcta.",
         stem="Il ___ per cento degli italiani.", options=["20", "venti per",
                                                           "ventesimo"],
         answer="20",
         note="Los porcentajes llevan artículo: il 20 per cento. El verbo va en "
              "singular o concuerda con el sustantivo que sigue."),

    # --- passato remoto (settimana 37) ---
    dict(id="a2-pr-01", type="choice", topic="passato remoto", level="C1",
         prompt="Elegí el passato remoto correcto.",
         stem="Dante ___ la Divina Commedia.",
         options=["scrisse", "scriveva", "ha scritto"], answer="scrisse",
         note="Hecho histórico cerrado y lejano: passato remoto, el tiempo de la "
              "narración escrita."),
    dict(id="a2-pr-02", type="cloze", topic="passato remoto", level="C1",
         prompt="Completá con el passato remoto.",
         stem="Loro ___ (fare) di tutto per aiutarci.", answer="fecero",
         note="fare: feci, facesti, fece, facemmo, faceste, fecero. "
              "Irregular en io, lui/lei y loro; regular en el resto."),
    dict(id="a2-pr-03", type="cloze", topic="passato remoto", level="C1",
         prompt="Completá con el passato remoto.",
         stem="Tu ___ (dire) la verità.", answer="dicesti",
         note="En los pretéritos fuertes la 2ª persona es regular: dicesti, no «dissesti»."),
    dict(id="a2-pr-04", type="choice", topic="passato remoto", level="C1",
         prompt="Elegí la forma correcta.",
         stem="Appena ___ finito, uscimmo.",
         options=["ebbe", "aveva", "ha"], answer="ebbe",
         note="Trapassato remoto: solo tras appena, quando, dopo che, con la "
              "principal en passato remoto."),
    dict(id="a2-pr-05", type="choice", topic="passato remoto", level="C1",
         prompt="Elegí el uso correcto.",
         stem="Stamattina ___ il caffè al bar.",
         options=["ho preso", "presi", "prendevo"], answer="ho preso",
         note="Pasado reciente y conectado con el presente → passato prossimo. "
              "El remoto aquí sonaría literario o meridional."),
]
