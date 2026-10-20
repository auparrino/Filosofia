# -*- coding: utf-8 -*-
"""Pronombres, partículas ne/ci y concordancia del participio
(Soluzioni, capp. 7, 12, 13, 20, 25).

Zona donde el español ayuda poco: «ne» y «ci» no existen como tales, y la
concordancia del participio funciona con reglas propias.
"""

ITEMS = [
    # --- pronomi combinati ---
    dict(id="c1-pron-01", type="choice", topic="pronomi combinati",
         prompt="Sustituí los complementos: «Do il libro a Marco».",
         stem="___ do.", options=["Glielo", "Lo gli", "Gli lo"], answer="Glielo",
         note="Indirecto + directo se funden: gli/le + lo = glielo, siempre junto "
              "y siempre con «gli-» aunque el destinatario sea femenino."),
    dict(id="c1-pron-02", type="choice", topic="pronomi combinati",
         prompt="Sustituí: «Mando le foto a Laura».",
         stem="___ mando.", options=["Gliele", "Le le", "Le gliele"], answer="Gliele",
         note="Indirecto + directo se funden: *le* (a ella) pasa a *glie-* y se pega a *le* (las fotos): *gliele*, donde el castellano dice «se las»."),
    dict(id="c1-pron-03", type="choice", topic="pronomi combinati",
         prompt="Sustituí: «Mi dai il tuo numero?»",
         stem="___ dai?", options=["Me lo", "Mi lo", "Lo mi"], answer="Me lo",
         note="Ante otro pronombre, mi/ti/ci/vi pasan a me/te/ce/ve."),
    dict(id="c1-pron-04", type="cloze", topic="pronomi combinati",
         prompt="Reescribí con pronombres combinados.",
         stem="Ci hanno parlato del progetto. → ___ hanno parlato.",
         answer="Ce ne", note="*ci* + *ne* se combinan en *ce ne*: la i de *ci* pasa a e delante de *ne*; *ne* retoma «del progetto»."),
    dict(id="c1-pron-05", type="choice", topic="pronomi combinati",
         prompt="Elegí la posición correcta con el infinitivo.",
         stem="Voglio dirtelo. / Te lo voglio dire.",
         options=["Las dos son correctas", "Solo la primera", "Solo la segunda"],
         answer="Las dos son correctas",
         note="Con modales el pronombre puede ir enclítico al infinitivo o "
              "delante del verbo modal."),

    # --- ne ---
    dict(id="c1-ne-01", type="choice", topic="ne",
         prompt="Elegí la forma correcta.",
         stem="Quanti fratelli hai? — ___ ho due.",
         options=["Ne", "Li", "Ci"], answer="Ne",
         note="«Ne» partitivo: sustituye «di + cantidad». Obligatorio, aunque el "
              "español no diga nada («tengo dos»)."),
    dict(id="c1-ne-02", type="choice", topic="ne",
         prompt="Elegí la forma correcta.",
         stem="Parliamo del film? — Sì, ___ parliamo domani.",
         options=["ne", "lo", "ci"], answer="ne",
         note="«Parlare di» → ne. El «ne» recoge el complemento con «di»."),
    dict(id="c1-ne-03", type="cloze", topic="ne",
         prompt="Completá con la concordancia correcta del participio.",
         stem="Quante mele hai comprato? — Ne ho compra___ tre.",
         answer="te",
         note="Con «ne» partitivo el participio SÍ concuerda con la cantidad: "
              "«ne ho comprate tre»."),
    dict(id="c1-ne-04", type="choice", topic="ne",
         prompt="Elegí la traducción correcta de «me voy de aquí».",
         stem="___ vado.", options=["Me ne", "Mi ne", "Ne mi"], answer="Me ne",
         note="«Andarsene» es pronominal doble: me ne vado, te ne vai, se ne va."),
    dict(id="c1-ne-05", type="translate", topic="ne",
         prompt="Traducí al italiano.",
         stem="No puedo más. (usá «farcela»)",
         answer="Non ce la faccio più",
         note="*farcela* («poder, lograrlo») lleva fijos *ce* y *la*, que no reemplazan nada: *non ce la faccio più*, «no doy más»."),

    # --- ci ---
    dict(id="c1-ci-01", type="choice", topic="ci",
         prompt="Elegí la forma correcta.",
         stem="Credi ai fantasmi? — No, non ___ credo.",
         options=["ci", "ne", "li"], answer="ci",
         note="«Credere a» → ci. Regla práctica: «a + algo» → ci; «di + algo» → ne."),
    dict(id="c1-ci-02", type="choice", topic="ci",
         prompt="Elegí la forma correcta.",
         stem="Sei mai stato a Roma? — Sì, ___ sono stato l'anno scorso.",
         options=["ci", "ne", "lo"], answer="ci",
         note="*ci* retoma un lugar ya nombrado («allí»), y el italiano no lo puede omitir como el castellano: *ci sono stato*. *vi* es la variante escrita."),
    dict(id="c1-ci-03", type="choice", topic="ci",
         prompt="¿Qué significa «Ci vuole un'ora»?",
         stem="Ci vuole un'ora.",
         options=["Hace falta una hora", "Quiere una hora", "Hay una hora"],
         answer="Hace falta una hora",
         note="«Volerci» = hacer falta (tiempo/cantidad). Distinto de «metterci» "
              "= tardar: «ci metto un'ora»."),
    dict(id="c1-ci-04", type="cloze", topic="ci",
         prompt="Completá con volerci o metterci.",
         stem="Io ___ due ore per arrivare, ma in generale ___ un'ora.",
         answer="ci metto | ci vuole",
         alt=["ci ho messo | ci vuole"],
         multi=True,
         note="«Metterci» lleva sujeto personal; «volerci» es impersonal y concuerda "
              "con la cantidad: ci vuole un'ora / ci vogliono due ore."),

    # --- concordanza del participio ---
    dict(id="c1-part-01", type="cloze", topic="participio",
         prompt="Completá la terminación del participio.",
         stem="Le ragazze sono arriva___ tardi.",
         answer="te",
         note="Con «essere», el participio concuerda con el sujeto."),
    dict(id="c1-part-02", type="cloze", topic="participio",
         prompt="Completá la terminación del participio.",
         stem="Ho visto le ragazze. → Le ho vist___.",
         answer="e",
         note="Con «avere» concuerda solo si el objeto directo va ANTES en forma "
              "de pronombre lo/la/li/le (y con «ne» partitivo)."),
    dict(id="c1-part-03", type="choice", topic="participio",
         prompt="Elegí la forma correcta.",
         stem="Ho ___ le ragazze.",
         options=["visto", "viste", "vista"], answer="visto",
         note="Objeto detrás del verbo con «avere» → participio invariable."),
    dict(id="c1-part-04", type="cloze", topic="participio",
         prompt="Completá la terminación.",
         stem="Maria si è lava___ le mani.",
         answer="ta",
         alt=[],
         note="Reflexivo con objeto directo propio: en uso corriente concuerda con "
              "el sujeto (lavata). Con el objeto delante en pronombre: «se le è lavate»."),
    dict(id="c1-part-05", type="choice", topic="participio",
         prompt="Elegí la forma más usual en el italiano actual.",
         stem="Quella è la lettera che ho ___ ieri.",
         options=["scritto", "scritta"], answer="scritto",
         note="Tras «che» relativo el participio normalmente no concuerda: «la "
              "lettera che ho scritto». «Scritta» es literario o anticuado."),

    # --- pronomi relativi (cap. 13) ---
    dict(id="c1-rel-01", type="choice", topic="relativi",
         prompt="Elegí la forma correcta.",
         stem="Il libro ___ ti ho parlato è esaurito.",
         options=["di cui", "che", "cui"], answer="di cui",
         note="Con preposición se usa «cui», nunca «che»: il libro di cui..."),
    dict(id="c1-rel-02", type="choice", topic="relativi",
         prompt="Elegí la forma correcta.",
         stem="La ragazza ___ padre è medico abita qui.",
         options=["il cui", "di cui", "che"], answer="il cui",
         note="Posesivo: «il cui/la cui» + sustantivo. El artículo concuerda con "
              "lo poseído, no con el poseedor."),
    dict(id="c1-rel-03", type="choice", topic="relativi",
         prompt="Elegí la forma correcta.",
         stem="Non ho capito ___ vuoi dire.",
         options=["quello che", "che cosa che", "il che"], answer="quello che",
         note="«Quello che / ciò che» = lo que. «Il che» retoma toda una frase: "
              "«è arrivato tardi, il che mi ha irritato»."),
    dict(id="c1-rel-04", type="translate", topic="relativi",
         prompt="Traducí al italiano.",
         stem="La casa en la que vivo es pequeña.",
         answer="La casa in cui abito è piccola",
         alt=["La casa in cui vivo è piccola", "La casa dove abito è piccola",
              "La casa dove vivo è piccola", "La casa nella quale abito è piccola",
              "La casa nella quale vivo è piccola"],
         note="«in cui» o «dove»; «che» solo sin preposición."),
]
