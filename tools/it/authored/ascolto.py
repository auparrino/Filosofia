# -*- coding: utf-8 -*-
"""Ascolto, settimana 1: distinguere i suoni prima di scriverli.

Il testo non si vede (nopeek): si sente una parola e si sceglie come si
scrive.  Coppie minime delle doppie e delle lettere che in spagnolo non
esistono (c/ch, gl, gn, sc).
"""

P = "Escuchá: ¿qué palabra dice?"

# (dice, altre opzioni, nota)
PAIRS = [
    ("nonno", ["nono"], "En italiano la doble consonante se sostiene más tiempo y cambia la palabra: *nonno* (abuelo) contra *nono* (noveno). El castellano no tiene este contraste."),
    ("nono", ["nonno"], "nono = noveno, n simple; nonno (abuelo) alarga la n."),
    ("palla", ["pala"], "palla = pelota: la l doble dura más. pala = pala."),
    ("sette", ["sete"], "Las dobles se pronuncian con una pequeña pausa antes: *set-te* (siete) contra *sete* (sed). Si no la marcás, decís otra palabra."),
    ("casa", ["cassa"], "casa, con s simple (suena casi como z suave); cassa = caja."),
    ("penna", ["pena"], "*penna* (lapicera) sostiene la n; *pena* (pena) no. En italiano la duración de la consonante distingue palabras."),
    ("caro", ["carro"], "La r simple suena como la de «caro» y la doble *rr* vibra como la de «carro»: acá el contraste es el mismo que en castellano."),
    ("sono", ["sonno"], "*sono* (soy/son) con n simple; *sonno* (sueño) la sostiene. La doble consonante es la única diferencia entre las dos palabras."),
    ("cappello", ["capello"], "*cappello* (sombrero) con p doble, *capello* (un pelo) con una sola: en italiano duplicar la consonante cambia el significado."),
    ("anno", ["ano"], "anno = año (con doble n; sin la doble, «ano» es otra palabra). Ojo: la ñ del español se escribe gn en italiano (bagno)."),
    ("chiesa", ["ciesa", "cesa"], "ch + i suena como k (como «quie» en español): chiesa = iglesia."),
    ("cena", ["chena", "scena"], "c + e suena como la ch española: cena = cena. Para el sonido k se escribe ch."),
    ("figlio", ["filio", "fillo"], "gl + i: un sonido como la ll bien pronunciada; figlio = hijo."),
    ("bagno", ["banio", "bañio"], "gn suena como la ñ: bagno = baño."),
    ("pesce", ["pese", "pesche"], "sc + e suena como sh: pesce = pez, pescado."),
    ("gatto", ["gato", "ghatto"], "gatto = gato: doble t, y g dura ante a."),
]

ITEMS = []
for k, (said, other, note) in enumerate(PAIRS, 1):
    ITEMS.append(dict(id="asc-1-%02d" % k, type="listen", topic="ortografia", level="A1",
                      prompt=P, stem=said, options=[said] + other, answer=said,
                      nopeek=True, note=note))
