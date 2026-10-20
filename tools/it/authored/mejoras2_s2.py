# -*- coding: utf-8 -*-
"""Mejoras estructurales, estación 2 (segunda tanda): semanas 21 (ne / ci) y
24 (congiuntivo presente: formas)."""

CE = "Elegí la forma correcta."
TR = "Traducí al italiano."
FX = "Trova l'errore: tocá la palabra que está mal y corregila."
CN = "Completá con ne o ci."
CG = "Completá con el congiuntivo presente del verbo entre paréntesis."
CGE = "Elegí el congiuntivo presente correcto."


def ch(id, w, topic, lv, stem, options, answer, note, prompt=CE):
    return dict(id=id, type="choice", topic=topic, level=lv, w=w, prompt=prompt,
                stem=stem, options=options, answer=answer, note=note)


def cl(id, w, topic, lv, stem, answer, note, prompt, alt=None):
    d = dict(id=id, type="cloze", topic=topic, level=lv, w=w, prompt=prompt,
             stem=stem, answer=answer, note=note)
    if alt:
        d["alt"] = alt
    return d


def tr(id, w, topic, lv, stem, answer, note, alt=None, typed=False):
    d = dict(id=id, type="typed" if typed else "translate", topic=topic, level=lv, w=w,
             prompt=TR, stem=stem, answer=answer, note=note)
    if alt:
        d["alt"] = alt
    return d


def fx(id, w, topic, lv, stem, bad, good, answer, note):
    return dict(id=id, type="fixerr", topic=topic, level=lv, w=w, prompt=FX,
                stem=stem, bad=bad, good=good, answer=answer, note=note)


T21 = "ne e ci"
T24 = "congiuntivo forme"

ITEMS = [
    # ---- settimana 21
    ch("mj-21-01", 21, T21, "B1", "Parli spesso di politica? — Sì, ___ parlo spesso.",
       ["ne", "ci"], "ne", "parlare DI algo: di → ne. Ci sería para a / in / su."),
    ch("mj-21-02", 21, T21, "B1", "Pensi ancora al viaggio? — Sì, ___ penso ancora.",
       ["ci", "ne"], "ci", "pensare A algo: a → ci. Ne sería para di."),
    cl("mj-21-03", 21, T21, "B1", "Quante mele vuoi? — ___ voglio due chili.", "ne",
       "Cantidad sin nombrar la cosa: ne obligatorio (ne voglio due chili).", CN),
    cl("mj-21-04", 21, T21, "B1", "Sei mai stata a Lisbona? — No, non ___ sono mai stata.", "ci",
       "ci = ahí (a/in + lugar): non ci sono mai stata.", CN),
    cl("mj-21-05", 21, T21, "B1", "Quando esci dall'ufficio? — ___ esco alle sei.", "ne",
       "Da + lugar (dall'ufficio) se reemplaza con ne: ne esco.", CN),
    cl("mj-21-06", 21, T21, "B1", "Sei ancora in ufficio? — No, ___ sono uscita mezz'ora fa.", "ne",
       "uscire da un luogo: ne. El participio concuerda con el sujeto (sono uscita).", CN),
    ch("mj-21-07", 21, T21, "B1", "Con questa penna ___ scrivo tutte le mie note.",
       ["ci", "ne"], "ci", "ci puede reemplazar con + cosa: con questa penna ci scrivo."),
    ch("mj-21-08", 21, T21, "B1", "Sono stanchissimo, non ___ posso più!",
       ["ne", "ci"], "ne", "non poterne più es fija, con ne: non ne posso più."),
    tr("mj-21-09", 21, T21, "B1", "¿Tenés hermanos? — Sí, tengo dos.", "Hai fratelli? — Sì, ne ho due.",
       "Cantidad sin nombrar la cosa: ne ho due (no «ho due»).",
       alt=["Hai fratelli? Sì, ne ho due.", "Hai dei fratelli? — Sì, ne ho due.",
            "Hai fratelli? — Sì, ne ho due", "Hai dei fratelli? — Sì, ne ho due"], typed=True),
    tr("mj-21-10", 21, T21, "B1", "No creo en eso.", "Non ci credo.",
       "credere A algo: ci. Non ci credo.", alt=["Non ci credo", "Io non ci credo."], typed=True),
    tr("mj-21-11", 21, T21, "B1", "Hablo de eso con Marco.", "Ne parlo con Marco.",
       "parlare DI algo: ne. El clítico va antes del verbo.",
       alt=["Ne parlo con Marco", "Io ne parlo con Marco."], typed=True),
    tr("mj-21-12", 21, T21, "B1", "¡No lo logro!", "Non ce la faccio!",
       "farcela: ci + la, y ci pasa a ce: non ce la faccio.",
       alt=["Non ce la faccio", "Io non ce la faccio!"], typed=True),
    fx("mj-21-13", 21, T21, "B1", "Hai dei biscotti? — Sì, ho tre.", "ho tre", "ne ho tre",
       "Hai dei biscotti? — Sì, ne ho tre.",
       "Cantidad sin nombrar la cosa: falta ne (ne ho tre)."),
    fx("mj-21-14", 21, T21, "B1", "Vai in palestra? — Sì, ne vado ogni giorno.", "ne vado", "ci vado",
       "Vai in palestra? — Sì, ci vado ogni giorno.",
       "in + lugar (in palestra): ci vado. Ne es para di / da."),
    fx("mj-21-15", 21, T21, "B1", "Sei contento del voto? — Sì, ci sono contento.", "ci sono", "ne sono",
       "Sei contento del voto? — Sì, ne sono contento.",
       "contento DI algo: di → ne (ne sono contento)."),

    # ---- settimana 24
    ch("mj-24-01", 24, T24, "B1", "Spero che tu ___ bene l'italiano. (parlare)",
       ["parli", "parla", "parle"], "parli",
       "-are hace -i en el congiuntivo. «Parle» es la -e castellana; «parla» es indicativo.", CGE),
    ch("mj-24-02", 24, T24, "B1", "Voglio che lui ___ il treno delle otto. (prendere)",
       ["prenda", "prende", "prendi"], "prenda",
       "-ere hace -a: che lui prenda. Prende es indicativo; prendi no corresponde a lui.", CGE),
    cl("mj-24-03", 24, T24, "B1", "Voglio che tu ___ con la carta. (pagare)", "paghi",
       "-gare pone h antes de -i para mantener el sonido /g/: paghi.", CG),
    cl("mj-24-04", 24, T24, "B1", "Credo che loro ___ un'altra casa. (cercare)", "cerchino",
       "-care pone h: cerchi, cerchino.", CG),
    cl("mj-24-05", 24, T24, "B1", "Spero che loro ___ presto. (cominciare)", "comincino",
       "-ciare no repite la i: cominci, comincino.", CG),
    cl("mj-24-06", 24, T24, "B1", "È meglio che tu ___ qualcosa. (mangiare)", "mangi",
       "-giare no repite la i: mangi (no «mangii»).", CG),
    cl("mj-24-07", 24, T24, "B1", "Spero che i lavori ___ presto. (finire)", "finiscano",
       "Los verbos en -isc conservan -isc- con loro: finiscano.", CG),
    cl("mj-24-08", 24, T24, "B1", "Voglio che tu ___ bene la regola. (capire)", "capisca",
       "capire lleva -isc: che tu capisca.", CG),
    cl("mj-24-09", 24, T24, "B1", "Spero che voi ___ bene. (stare)", "stiate",
       "stare: stia, stiamo, stiate, stiano. Voi sale de noi (-iamo → -iate).", CG),
    cl("mj-24-10", 24, T24, "B1", "Voglio che loro ___ con noi. (venire)", "vengano",
       "venire sale de vengo: venga, vengano.", CG),
    ch("mj-24-11", 24, T24, "B1", "Voglio che voi ___ puntuali. (essere)",
       ["siate", "siete", "siano"], "siate",
       "essere: sia, siamo, siate, siano. Con voi: siate.", CGE),
    ch("mj-24-12", 24, T24, "B1", "Credo che loro ___ partire. (dovere)",
       ["debbano", "dobbino", "dovano"], "debbano",
       "dovere: debba, dobbiamo, dobbiate, debbano (raíz debb- salvo noi/voi).", CGE),
    cl("mj-24-13", 24, T24, "B1", "Spero che tu ___ venire. (potere)", "possa",
       "potere: possa, possiamo, possiate, possano.", CG),
    fx("mj-24-14", 24, T24, "B1", "Credo che lui parla bene.", "parla", "parli",
       "Credo che lui parli bene.",
       "Tras credo che va congiuntivo: -are hace -i (parli), no la forma del indicativo."),
    fx("mj-24-15", 24, T24, "B1", "Voglio che tu pagi il conto.", "pagi", "paghi",
       "Voglio che tu paghi il conto.", "-gare mantiene el sonido con h: paghi."),
    fx("mj-24-16", 24, T24, "B1", "È meglio che tu mangii meno.", "mangii", "mangi",
       "È meglio che tu mangi meno.", "-giare no repite la i: mangi."),
    tr("mj-24-17", 24, T24, "B1", "Espero que vengas.", "Spero che tu venga.",
       "venire → venga. Con el singular idéntico conviene poner tu.",
       alt=["Spero che venga.", "Spero che tu venga", "Spero che venga"], typed=True),
]
