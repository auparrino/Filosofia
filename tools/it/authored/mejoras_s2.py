# -*- coding: utf-8 -*-
"""Mejoras estructurales, estación 2: semanas 20 (condizionale), 22 (pronomi
combinati) y 25 (congiuntivo: quando si usa)."""

CE = "Elegí la forma correcta."
TR = "Traducí al italiano."
FX = "Trova l'errore: tocá la palabra que está mal y corregila."


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


T20 = "condizionale"
T22 = "pronomi combinati"
T25 = "congiuntivo uso"
CC = "Completá con el condizionale del verbo entre paréntesis."

ITEMS = [
    # ===================== Settimana 20 =====================
    ch("mj-20-01", 20, T20, "B1", "Loro ___ un albergo economico.",
       ["cercherebbero", "cercarebbero", "cerchirebbero"], "cercherebbero",
       "Los verbos en -care llevan h ante e para mantener el sonido duro: cercherebbero, como cercherò.",
       prompt="Elegí la forma con la ortografía correcta."),
    cl("mj-20-02", 20, T20, "B1", "Io ___ volentieri il conto. (pagare)", "pagherei",
       "-gare → gh ante e: pagherei, pagheresti, pagherebbe.", CC),
    cl("mj-20-03", 20, T20, "B1", "Tu ___ una pizza con me? (mangiare)", "mangeresti",
       "En -giare se pierde la i: mangeresti, mangerebbe.", CC),
    fx("mj-20-04", 20, T20, "B1", "Noi cercaremmo un albergo più economico.",
       "cercaremmo", "cercheremmo", "Noi cercheremmo un albergo più economico.",
       "cercare lleva h ante e también en el condizionale: cercheremmo."),
    ch("mj-20-05", 20, T20, "B1", "Noi ___ volentieri, ma abbiamo un impegno. (venire)",
       ["verremmo", "veniremmo", "verremo"], "verremmo",
       "Raíz irregular del futuro (verr-) más -emmo, con dos emes. verremo sería futuro."),
    cl("mj-20-06", 20, T20, "B1", "Tu ___ riposare di più. (dovere)", "dovresti",
       "dovere pierde la e de la raíz: dovr-. Consejo con -esti.", CC),
    cl("mj-20-07", 20, T20, "B1", "Loro ___ aiutarti, ma non sanno come. (potere)", "potrebbero",
       "potere: potr- + -ebbero.", CC),
    ch("mj-20-08", 20, T20, "B1", "Scusi, ___ dirmi dov'è la stazione?",
       ["potrebbe", "potresti", "potreste"], "potrebbe",
       "Con Lei el verbo va en tercera persona: potrebbe. Potresti es para un tú y potreste para varios."),
    ch("mj-20-09", 20, T20, "B1", "Ragazzi, ___ aspettare cinque minuti?",
       ["potreste", "potrebbe", "potresti"], "potreste",
       "Le hablás a varias personas (voi): potreste."),
    tr("mj-20-10", 20, T20, "B1", "Quisiera una mesa para dos, por favor.",
       "Vorrei un tavolo per due, per favore.",
       "vorrei es la forma cortés en un restaurante o negocio; voglio suena a orden.",
       alt=["Vorrei un tavolo per due", "Vorrei un tavolo per due, per piacere", "Vorrei un tavolo per due, per cortesia"]),
    tr("mj-20-11", 20, T20, "B1", "Necesitaría un poco de ayuda.",
       "Avrei bisogno di un po' d'aiuto.",
       "Avrei bisogno di + sustantivo: pedido cortés. Avrei viene de avere: raíz avr-.",
       alt=["Avrei bisogno di aiuto", "Avrei bisogno di un aiuto", "Avrei bisogno di un po' di aiuto"]),
    tr("mj-20-12", 20, T20, "B1", "Disculpe, ¿podría ayudarme, por favor? (a un desconocido)",
       "Scusi, potrebbe aiutarmi, per favore?",
       "Con Lei: potrebbe. Los pronombres pueden ir pegados (aiutarmi) o delante (mi potrebbe aiutare).",
       alt=["Scusi, mi potrebbe aiutare, per favore?", "Scusi, potrebbe aiutarmi?", "Scusi, mi potrebbe aiutare?"],
       typed=True),
    ch("mj-20-13", 20, T20, "B1", "Secondo fonti non ufficiali, il sindaco ___ malato.",
       ["sarebbe", "è", "sarà"], "sarebbe",
       "Una noticia no confirmada («según fuentes no oficiales») se da con condizionale: sarebbe = estaría."),
    tr("mj-20-14", 20, T20, "B1", "Según fuentes no oficiales, habría tres heridos.",
       "Secondo fonti non ufficiali ci sarebbero tre feriti.",
       "Condicional de rumor: ci sarebbero (habría), plural porque feriti es plural.",
       alt=["Secondo fonti non ufficiali sarebbero tre i feriti", "Ci sarebbero tre feriti, secondo fonti non ufficiali"]),

    # ===================== Settimana 22 =====================
    ch("mj-22-01", 22, T22, "B1", "Vuoi delle olive? ___ do un po'.",
       ["Te ne", "Ti ne", "Ne te"], "Te ne",
       "mi/ti + ne → me ne, te ne: la i pasa a e. Ne = de eso (unas pocas)."),
    ch("mj-22-02", 22, T22, "B1", "Ad Anna? ___ ho parlato ieri, del progetto.",
       ["Gliene", "Glielo", "Le ne"], "Gliene",
       "gli/le + ne → gliene: ne sustituye «del progetto». Le ne no existe."),
    cl("mj-22-03", 22, T22, "B1", "Ai bambini? ___ ho dati tre, dei biscotti.", "Gliene",
       "Ne (de los biscotti) + a ellos: gliene. El participio concuerda con lo contado: dati.",
       "Completá con el pronombre combinado."),
    fx("mj-22-04", 22, T22, "B1", "Mi lo puoi passare?", "Mi lo", "Me lo",
       "Me lo puoi passare?", "mi + lo → me lo: la i cambia a e. «Mi lo» no existe."),
    fx("mj-22-05", 22, T22, "B1", "Ad Anna gli lo dico io.", "gli lo", "glielo",
       "Ad Anna glielo dico io.", "gli/le + lo → glielo, en una sola palabra."),
    fx("mj-22-06", 22, T22, "B1", "Le chiavi? Glie le ho date ieri.", "Glie le", "Gliele",
       "Le chiavi? Gliele ho date ieri.", "glielo/gliela/glieli/gliele/gliene se escriben pegados."),
    tr("mj-22-07", 22, T22, "B1", "¡Dámelo!", "Dammelo!",
       "Imperativo tú + pronombres: pegados al final. Da' duplica la m: dammelo.",
       alt=["Dammelo"], typed=True),
    tr("mj-22-08", 22, T22, "B1", "¡Decíselo (a ella) ya!", "Diglielo subito!",
       "di' + gli/le + lo = diglielo. Regla: con gli no se duplica la consonante.",
       alt=["Diglielo adesso!", "Diglielo subito", "Diglielo adesso"], typed=True),
    ch("mj-22-10", 22, T22, "B1", "Signora, se ha la ricevuta, ___, per favore.",
       ["me la mostri", "mostrimela", "mostri la me"], "me la mostri",
       "Con Lei los pronombres van delante del verbo, no pegados."),
    cl("mj-22-11", 22, T22, "B1", "Non ___! È una sorpresa. (dire + mi + lo)", "dirmelo",
       "Con non + infinitivo valen las dos posiciones: dirmelo o me lo dire.",
       "Escribí el infinitivo con los pronombres.", alt=["me lo dire"]),
    ch("mj-22-12", 22, T22, "B1", "La lettera? Ce l'ha ___ ieri.",
       ["data", "dato", "dati"], "data",
       "L' es la (la lettera): el participio concuerda con el directo, data."),
    ch("mj-22-13", 22, T22, "B1", "Le chiavi? Gliele ho ___.",
       ["date", "dato", "data"], "date",
       "gliele = a él/ella + las llaves: el participio concuerda con le chiavi, date."),
    tr("mj-22-14", 22, T22, "B1", "Los libros me los prestó Marco.",
       "I libri me li ha prestati Marco.",
       "me li (directo plural masculino) exige prestati. Ha porque prestare va con avere.",
       alt=["Me li ha prestati Marco", "I libri, me li ha prestati Marco"], typed=True),
    tr("mj-22-15", 22, T22, "B1", "De vino, te traigo una botella.",
       "Di vino, te ne porto una bottiglia.",
       "Ne retoma «di vino» y con ti se vuelve te ne.",
       alt=["Di vino te ne porto una bottiglia"]),

    # ===================== Settimana 25 =====================
    ch("mj-25-01", 25, T25, "B1", "Penso che Anna ___ già a casa.",
       ["sia", "è", "siano"], "sia",
       "pensare expresa opinión, no un hecho: congiuntivo."),
    ch("mj-25-02", 25, T25, "B1", "So che Anna ___ già a casa.",
       ["è", "sia", "fosse"], "è",
       "sapere presenta un hecho: indicativo. Contrastá con penso che sia."),
    ch("mj-25-03", 25, T25, "B1", "Benché ___ stanco, continua a lavorare.",
       ["sia", "è", "sarà"], "sia",
       "benché (aunque) pide siempre congiuntivo."),
    ch("mj-25-04", 25, T25, "B1", "Anche se ___ stanco, continua a lavorare.",
       ["è", "sia", "siete"], "è",
       "anche se va con indicativo. Solo benché y sebbene piden congiuntivo."),
    ch("mj-25-05", 25, T25, "B1", "Te lo ripeto affinché tu lo ___.",
       ["capisca", "capisci", "capirai"], "capisca",
       "affinché (para que) pide congiuntivo."),
    cl("mj-25-06", 25, T25, "B1", "Ti presto l'auto purché tu la ___ con cura. (usare)", "usi",
       "purché (con tal de que) pide congiuntivo; con io/tu/lui la forma es la misma (-i).",
       "Completá con el modo que pide la conjunción."),
    ch("mj-25-07", 25, T25, "B1", "Non dico che ___ colpa tua.",
       ["sia", "è", "sarà"], "sia",
       "dico che + indicativo, pero non dico che + congiuntivo: al negar deja de ser un dato."),
    fx("mj-25-08", 25, T25, "B1", "Credo che Luca è in ritardo.", "è", "sia",
       "Credo che Luca sia in ritardo.",
       "credo che pide congiuntivo. En el habla se oye è, pero en un examen se espera sia."),
    fx("mj-25-09", 25, T25, "B1", "Non penso che lui ha ragione.", "ha", "abbia",
       "Non penso che lui abbia ragione.",
       "penso che / non penso che: congiuntivo. Abbia = tenga."),
    fx("mj-25-10", 25, T25, "B1", "Spero che io arrivo in tempo.", "che io arrivo", "di arrivare",
       "Spero di arrivare in tempo.",
       "Mismo sujeto: sperare di + infinitivo, sin che."),
    ch("mj-25-11", 25, T25, "B1", "Cerco un ristorante che ___ cucina vegana.",
       ["serva", "serve", "servirà"], "serva",
       "Lo buscás y no sabés si existe: la relativa lleva congiuntivo."),
    ch("mj-25-12", 25, T25, "B1", "Conosco un ristorante che ___ cucina vegana.",
       ["serve", "serva", "servisse"], "serve",
       "Existe y lo conocés: indicativo."),
    ch("mj-25-13", 25, T25, "B1", "È la persona più simpatica che io ___.",
       ["conosca", "conosco", "conoscerò"], "conosca",
       "Tras un superlativo la relativa lleva congiuntivo."),
    tr("mj-25-14", 25, T25, "B1", "Aunque llueva, salgo.",
       "Benché piova, esco.",
       "benché + congiuntivo; sebbene es igual.",
       alt=["Sebbene piova, esco", "Esco benché piova", "Esco sebbene piova", "Esco anche se piove", "Anche se piove, esco"], typed=True),
]
