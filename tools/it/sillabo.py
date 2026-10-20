#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Il sillabo: da quale settimana in poi si può proporre un esercizio.

Ogni semana hereda capítulos enteros de los libros, y un capítulo de
sustantivos puede traer oraciones en imperfetto o en passato prossimo.  Este
módulo mira qué gramática usa realmente cada ejercicio (tiempos verbales,
pronombres combinados, ne, cui, gerundio, comparativos) y devuelve la primera
semana en la que todo eso ya se enseñó.  build_course.py lo usa para no
proponer nada antes de su teoría.

Reglas:
- En el contexto (el enunciado que se lee) vale todo lo que ya se enseñó; el
  presente se tolera desde el principio porque se entiende por cognados.
- En la respuesta (lo que el alumno escribe o elige) el presente cuenta
  desde la semana 5, salvo essere/avere, que se enseñan en la semana 1.
- Una forma ambigua (parli = presente o congiuntivo) cuenta por su lectura
  más temprana: el detector prefiere dejar pasar a descartar de más.

    python3 tools/sillabo.py            informe por semana de lo que se mueve
"""
import json
import os
import re
import subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Semana en la que la teoría presenta cada tiempo o construcción.  Si se
# reordena el programa (WEEKS en build_course.py), esto se ajusta acá.
TENSE_WEEK = {
    "presente": 5,
    "imperativo": 12,
    "passatoProssimo": 11,
    "imperfetto": 15,
    "futuro": 19,
    "futuroAnteriore": 19,
    "condizionale": 20,
    "congiuntivo": 24,
    "trapassatoProssimo": 26,
    "congiuntivoPassato": 29,
    "congImperfetto": 30,
    "congiuntivoTrapassato": 30,
    "condizionalePassato": 31,
    "passivo": 35,
    "passatoRemoto": 37,
    "trapassatoRemoto": 37,
    "gerundio": 44,
}
FEATURE_WEEK = {
    "comparativo": 23,
    "pronomi combinati": 22,
    "ne": 21,
    "cui": 34,
    "si impersonale": 36,
    "riflessivi": 12,
    "riflessivi passato": 16,
}
ESSERE_AVERE = {"sono", "sei", "è", "siamo", "siete", "ho", "hai", "ha",
                "abbiamo", "avete", "hanno", "c'è"}

COMPOUND = {
    "presente": "passatoProssimo", "imperfetto": "trapassatoProssimo",
    "futuro": "futuroAnteriore", "passatoRemoto": "trapassatoRemoto",
    "condizionale": "condizionalePassato", "congiuntivo": "congiuntivoPassato",
    "congImperfetto": "congiuntivoTrapassato",
}
# Lo que puede meterse entre auxiliar y participio.
BETWEEN = {"non", "già", "mai", "sempre", "ancora", "più", "appena", "anche",
           "ben", "bene", "proprio", "davvero", "poi", "tutto", "tutti", "solo",
           "subito", "spesso", "finalmente", "forse", "mica", "neanche", "pure"}
# Palabras frecuentes que coinciden con una forma verbal pero casi siempre
# son otra cosa en los ejercicios (sustantivo, adjetivo, conjunción).
NOT_VERBS = {"porta", "pesca", "sale", "canto", "ama", "fine", "vite", "volta",
             "parte", "conto", "resto", "posto", "mostra", "spesa", "ponte",
             "rete", "bevi", "corsa", "venti", "letto", "fatto", "stato",
             "detto", "morte", "prima", "dopo", "sole", "mare", "come", "dove",
             "perché", "ora", "era", "ami", "amo", "lavoro", "studio", "gioco",
             "viaggio", "sogno", "invito", "aiuto", "ritorno", "arrivo",
             "pranzo", "ceno", "compito", "regalo", "caso", "passo", "giro",
             "tema", "fiore", "sete", "mente", "vino", "piano", "ballo",
             "dubbio", "odio", "grazie", "cara", "caro", "molto", "tanto",
             "poco", "sia", "fossi", "canti", "conti", "speri", "senti",
             "voglia", "paia", "quanta", "quante", "quanti", "quanto",
             "telefonino", "telefonini", "cammino", "destino", "vicino"}
# Casos dudosos que sí deben contar como verbo cuando no hay otra lectura.
AMBIGUOUS_OK = {"era": "imperfetto", "sia": "congiuntivo", "fossi": "congImperfetto"}

# me lo, te la, glielo; y pegados al verbo: dammelo, diteceli
COMBINED = re.compile(r"\b(me|te|ce|ve)\s+(lo|la|li|le|ne)\b|glie(lo|la|li|le|ne)\b", re.I)
# sin te/se: finitelo es finite + lo
ENCLITIC = re.compile(r"^\w{3,}(me|ce|ve)(lo|la|li|le|ne)$")

STARE = {"sto", "stai", "sta", "stiamo", "state", "stanno", "stavo", "stavi",
         "stava", "stavamo", "stavate", "stavano"}
ARTICLES = {"il", "lo", "la", "i", "gli", "le", "l'"}
THAN = {"di", "del", "dello", "della", "dei", "degli", "delle", "dell'", "che", "quanto"}

NUMBERS = {"uno", "due", "tre", "quattro", "cinque", "sei", "sette", "otto",
           "nove", "dieci", "venti", "venticinque", "quarto"}

_LEX = None
_NOMI = None


def nominal_forms():
    """Nouns and adjectives of the bank, all their forms: «temi» or «stanchi»
    in an answer are not a present tense."""
    global _NOMI
    if _NOMI is None:
        with open(os.path.join(ROOT, "docs", "lang", "it", "data", "bank.json"), encoding="utf-8") as fh:
            bank = json.load(fh)
        _NOMI = set()
        for n in bank["nouns"]:
            _NOMI.update(x.lower() for x in (n[0], n[2]) if x)
        for a in bank["adjectives"]:
            _NOMI.update(x.lower() for x in a[:4] if x)
        for w in bank["words"]:
            if " " not in w[0]:
                _NOMI.add(w[0].lower())
    return _NOMI


def lexicon():
    global _LEX
    if _LEX is None:
        out = subprocess.run(["node", os.path.join(ROOT, "tools", "it", "forms_lexicon.js")],
                             check=True, capture_output=True, text=True).stdout
        _LEX = json.loads(out)
        _LEX["gerunds"] = set(_LEX["gerunds"])
        _LEX["imperatives"] = set(_LEX["imperatives"])
        _LEX["irrPres"] = set(_LEX.get("irrPres", []))
    return _LEX


def tokens(text):
    text = text.replace("’", "'").lower()
    out = []
    for t in re.findall(r"[a-zàèéìòóù]+'?", text):
        # l'ho → l' + ho; c'è se deja entero porque es una unidad
        out.append(t)
    return out


def _simple_week(tok):
    lex = lexicon()
    if tok in NOT_VERBS and tok not in AMBIGUOUS_OK:
        return None, None
    # telefonino, sale, parte: a noun or adjective of the bank reads first
    # as what it is, not as a rare verb form
    if tok not in AMBIGUOUS_OK and tok in nominal_forms():
        tenses = lex["simple"].get(tok) or []
        if "presente" not in tenses:
            return None, None
    tenses = lex["simple"].get(tok)
    if not tenses:
        if tok in lex["imperatives"]:
            return TENSE_WEEK["imperativo"], "imperativo"
        return None, None
    best = min(tenses, key=lambda t: TENSE_WEEK[t])
    if tok in AMBIGUOUS_OK and AMBIGUOUS_OK[tok] in tenses:
        best = AMBIGUOUS_OK[tok]
    return TENSE_WEEK[best], best


def analyze(text, answer=False):
    """Features used by an Italian text → {feature: week}.

    answer=True: the learner produces this text, so the present tense of any
    verb but essere/avere also counts.
    """
    lex = lexicon()
    feats = {}

    def need(name, week):
        if week and week > feats.get(name, 0):
            feats[name] = week

    low = text.replace("’", "'").lower()
    toks = tokens(low)
    as_participle = set()      # «persi» in «ci siamo persi» is not a passato remoto
    for i, tok in enumerate(toks):
        # tiempos compuestos: auxiliar + participio
        auxes = lex["aux"].get(tok)
        if auxes:
            j = i + 1
            while j < len(toks) and toks[j] in BETWEEN:
                j += 1
            if j < len(toks) and toks[j] in lex["participles"]:
                pp, pp_aux = toks[j], lex["participles"][toks[j]]
                comps = []
                for a in auxes:
                    verb, tense = a.split(":")
                    if verb == "venire":
                        if "avere" in pp_aux:
                            comps.append("passivo")
                        continue
                    reflexive = i and toks[i - 1] in ("mi", "ti", "si", "ci", "vi")
                    if (verb == "essere" and "essere" not in pp_aux and not reflexive
                            and not pp.startswith("stat")):
                        continue        # è chiuso, sono stanchi: adjetivo
                    comps.append(COMPOUND[tense])
                if comps:
                    # aveste mangiato: congiuntivo trapassato antes que trapassato remoto
                    comp = min(comps, key=lambda t: TENSE_WEEK[t])
                    need(comp, TENSE_WEEK[comp])
                    as_participle.add(j)
        wk, tense = _simple_week(tok) if i not in as_participle else (None, None)
        if tense and tense != "presente":
            need(tense, wk)
        elif (tense == "presente" and answer and tok not in ESSERE_AVERE
              and tok not in nominal_forms()):
            # vado, faccio, esco: el presente irregular es de la semana 6
            need("presente", 6 if tok in lex["irrPres"] else wk)
            # mi alzo, ti chiami: el reflexivo se enseña en la semana 12
            if i and toks[i - 1] in ("mi", "ti", "si", "vi"):
                need("riflessivi", FEATURE_WEEK["riflessivi"])
        if tok in lex["gerunds"] and len(tok) > 5:
            # stare + gerundio se enseña en la semana 6, y desde ahí un
            # gerundio se entiende leyendo; producirlo suelto es de la 44
            if (i and toks[i - 1] in STARE) or not answer:
                need("stare + gerundio", 6)
            else:
                need("gerundio", TENSE_WEEK["gerundio"])
        if tok == "cui":
            need("cui", FEATURE_WEEK["cui"])
        if tok == "ne":
            need("ne", FEATURE_WEEK["ne"])
        # comparativo (più ... di/che) o superlativo relativo (le vittime più
        # tragiche); «parla più piano» o «non ... più» no cuentan
        if tok in ("più", "meno"):
            after = set(toks[i + 1:i + 5])
            nxt = toks[i + 1] if i + 1 < len(toks) else ""
            prev = toks[i - 1] if i else ""
            prev2 = toks[i - 2] if i > 1 else ""
            superl = prev in ARTICLES or (prev2 in ARTICLES and prev in nominal_forms())
            clock = tok == "meno" and (nxt in NUMBERS or nxt in ("un", "mezzo", "mezza"))
            if (after & THAN or superl) and not clock:
                if not ("non" in toks[max(0, i - 4):i] and tok == "più"):
                    need("comparativo", FEATURE_WEEK["comparativo"])
    # dammelo, diteceli; pero no clientela, tutela
    if COMBINED.search(low) or any(ENCLITIC.match(t) and t not in nominal_forms()
                                   for t in toks):
        need("pronomi combinati", FEATURE_WEEK["pronomi combinati"])
    # «ci si veste», «mi si è rotto»: si impersonale con otro pronombre
    if re.search(r"\b(ci|mi|ti|gli|le|vi) si\b", low):
        need("si impersonale", FEATURE_WEEK["si impersonale"])
    # «mi sono alzato», «si è sentita»: reflexivos en pasado (semana 16)
    if re.search(r"\b(mi|ti|si|vi) (sono|sei|è|siamo|siete|ero|era|eravamo|saremo|sarei)\s+"
                 r"(?:già |mai |appena )?(?!stat)\w+[aeiou]\b", low):
        m = re.search(r"\b(mi|ti|si|vi) (?:sono|sei|è|siamo|siete|ero|era|eravamo|saremo|sarei)\s+"
                      r"(?:già |mai |appena )?(\w+)", low)
        # mi è piaciuto, ti è mancata: piacere y su familia llevan un
        # pronombre indirecto, no reflexivo
        indiretti = ("piaciut", "dispiaciut", "mancat", "sembrat", "pars", "servit",
                     "bastat", "successo", "success", "capitat", "interessat", "costat")
        if m and m.group(2) in lex["participles"] and not m.group(2).startswith(indiretti):
            need("riflessivi passato", FEATURE_WEEK["riflessivi passato"])
    return feats


def _strip_glosses(stem):
    # (El pueblo danés estaba…), (partir, irse de viaje): castellano o pistas
    return re.sub(r"\([^)]*\)", " ", stem or "")


def _answers(item):
    return [a.strip() for a in re.split(r"\s*\|\s*", item.get("answer") or "") if a.strip()]


# Construcciones que la teoría presenta en una semana concreta y que un
# ejercicio puede pedir sin usar ningún tiempo verbal nuevo: la elisión
# (un'amica, dov'è, un po'), los plurales en -chi/-ghi, los números escritos,
# los posesivos y el «Lei» de cortesía.  Sin esto, «un amico / un'amico» caía
# en la semana 1 porque solo usa el presente.
CONSTR_WEEK = {"elisione": 3, "plurale": 2, "numeri": 7, "possessivi": 3, "Lei formale": 5}
_POSS = re.compile(r"\b(mio|mia|miei|mie|tuo|tua|tuoi|tue|suo|sua|suoi|sue|nostr[oaie]|vostr[oaie])\b")
_NUM = re.compile(r"\b(due|tre|quattro|cinque|sette|otto|nove|dieci|undici|dodici|tredici|"
                  r"quattordici|quindici|sedici|diciassette|diciotto|diciannove|venti|trenta|quaranta|"
                  r"cinquanta|sessanta|settanta|ottanta|novanta|cento|mille|\w+(anta|enta|otto|uno|due|tre|"
                  r"sette|nove|cento|mila))\b")


def construction_features(item):
    feats = {}
    typ = item.get("type")
    answers = _answers(item)
    ans = " ".join(answers).replace("’", "'").lower()
    produced = typ not in ("choice", "listen")
    if typ != "listen":
        # c'è / c'era se enseñan en la semana 1; cualquier otro apóstrofo, en la
        # 3.  En una elección cuentan también las opciones (un amico / un'amico).
        shown = ans + " " + " ".join(item.get("options") or []).replace("’", "'").lower()
        if "'" in re.sub(r"\bc'(è|era|erano|e)\b", "", shown):
            feats["elisione"] = CONSTR_WEEK["elisione"]
    if produced:
        if _NUM.search(ans):
            feats["numeri"] = CONSTR_WEEK["numeri"]
        if _POSS.search(ans):
            feats["possessivi"] = CONSTR_WEEK["possessivi"]
        stem = item.get("stem") or ""
        # «Lei, signora, ___»: el Lei de cortesía; «Lei è simpatica» es «ella»
        if re.search(r"(^|[\s(])Lei,", stem) or re.search(r"\bsignor[ae]?\b", stem, re.I):
            feats["Lei formale"] = CONSTR_WEEK["Lei formale"]
    if re.search(r"plural", item.get("prompt") or "", re.I):
        feats["plurale"] = CONSTR_WEEK["plurale"]
    return feats


def item_features(item):
    """{feature: week} for one graded item of the course."""
    feats = construction_features(item)
    typ = item.get("type")
    answers = _answers(item)
    context = ""
    if typ == "scopri":                    # las frases italianas a observar
        context = " ".join(item.get("data") or [])
        answers = []
    elif typ == "fixerr":                  # la frase corregida
        context = item.get("answer") or ""
        answers = []
    elif typ == "garden":
        context = " ".join(w for pair in (item.get("lead") or []) for w in pair)
    # en translate el enunciado es castellano; «stemEs»: una situación en
    # castellano y las opciones en italiano (pragmática, authored/pragmatica.py)
    if typ not in ("translate", "scopri", "fixerr") and not item.get("stemEs"):
        stem = _strip_glosses(item.get("stem"))
        for a in answers:
            stem = stem.replace("___", a, 1)     # diventat___ → diventata
        context = (context + " " + stem).strip()
    if typ == "translate" and item.get("dir") == "it-es":
        context, answers = item.get("stem") or "", []
    for text, is_answer in ((context, False), (" ".join(answers), True),
                            (" ".join(item.get("options") or []), False)):
        for k, v in analyze(text, answer=is_answer).items():
            if v > feats.get(k, 0):
                feats[k] = v
    return feats


# Manual floors: exercises whose grammar the detector does not see (a
# condizionale passato inside «si sarebbe seccato», a combined pronoun in
# «ve l'abbiamo portata»).  {id: (week, «what it needs»)}; the week is the
# one whose lesson teaches it.  The didactic review fills this list.
MIN_WEEK = {}

# Semanas 1-26 (revisión didáctica, segunda pasada).
MIN_WEEK.update({
    # números escritos (semana 7)
    "rf-1-22": (7, "numeri: novant'anni"),
    # presente + da «desde hace» (semana 9)
    "s:r18-03c:a": (9, "presente + da"), "s:r18-03c:b": (9, "presente + da"),
    "s:r18-03c:c": (9, "presente + da"), "s:r18-03c:f": (9, "presente + da"),
    "s:r10-02b:c": (9, "da quando + presente"),
    # pronombres átonos y pegados al infinitivo (semana 10)
    "s:r18-01b:f": (10, "pronome lo"), "s:r18-03c:g": (10, "pronome lo"),
    "s:r10-01b:b": (10, "pronome lo"), "s:r10-07:d": (10, "pronome lo"),
    "s:r15-02c:c": (10, "conoscerti"),
    # reflexivos, recíprocos e imperativo (semana 12)
    "s:r18-04:b": (12, "riflessivi: si perdono"), "s:r18-03c:d": (12, "reciproco: ci conosciamo"),
    "s:r18-03c:e": (12, "reciproco: ci sentiamo"), "s:r10-14:e": (12, "reciproco: vederci"),
    "s:r07-01e:b": (12, "riflessivi: divertirmi"), "s:r07-01e:c": (12, "reciproco: ci vediamo"),
    "s:r07-01e:d": (12, "reciproco: vederci"), "s:r07-04e:b": (12, "riflessivi: lavarmi"),
    "s:r07-04e:e": (12, "imperativo negativo"), "s:r07-04e:f": (12, "imperativo negativo"),
    "s:r07-03f:a": (12, "imperativo + pronome"), "s:r07-03f:d": (12, "imperativo di Lei"),
    # piacere y su familia (semana 14)
    "s:r10-08:c": (14, "piacere"), "l2-c-80": (14, "mancare"), "l2-c-81": (14, "mancare"),
    "s:r20-04:a": (14, "piacere al passato"), "s:r20-04:b": (14, "piacere al passato"),
    "s:r20-08:a": (14, "servire al passato"), "s:r20-08:b": (14, "bastare al passato"),
    "s:r20-08:c": (14, "succedere al passato"), "s:r20-08:d": (14, "piacere al passato"),
    # reflexivos en pasado con ci (semana 16)
    "s:r20-10:a": (16, "riflessivi passato: ci siamo dovuti"),
    "s:r18-03c:h": (16, "riflessivi passato: ci siamo laureati"),
    # futuro en el contexto (semana 19)
    "s:r09-02:c": (19, "futuro: costerà"), "s:r14-01:b": (19, "futuro: pioverà"),
    # ne y ci (semana 21)
    "s:r10-14:b": (21, "ci: arrivarci, metterci"), "s:r07-01e:e": (21, "ci di luogo"),
    "s:r07-01e:f": (21, "ci di luogo: andarci"), "s:r07-03f:c": (21, "ne: parlatene"),
    "s:r22-05:c": (21, "ci di luogo: vacci"), "s:r22-08:d": (21, "ci di luogo: andateci"),
    "s:r22-08:e": (21, "ci di luogo"), "s:r22-08:f": (21, "ci di luogo: andiamoci"),
    "d10-047": (21, "ce n'è"), "s:r12-03:d": (21, "ce n'è"), "s:r12-03:e": (21, "ce n'è"),
    "s:r14-01b:e": (21, "ci di luogo: tornarci"),
    # pronombres combinados (semana 22)
    "s:r07-02j:d": (22, "pronomi combinati: ve l'abbiamo"),
    "s:r07-06c:a": (22, "pronomi combinati: se l'è"), "s:r07-06c:b": (22, "pronomi combinati: se l'è"),
    "s:r07-06c:c": (22, "pronomi combinati: se le è"), "s:r07-06c:d": (22, "pronomi combinati: se l'è"),
    # congiuntivo en la relativa (semana 25)
    "s:r12-02:b": (25, "congiuntivo: nessuno che si chiami"),
    # trapassato prossimo en el contexto o en la consigna (semana 26)
    "s:r20-07b:b": (26, "trapassato: non mi aveva detto"), "s:r20-07b:c": (26, "trapassato: non mi aveva avvertito"),
    "s:r20-07b:d": (26, "trapassato: nessuno mi aveva detto"), "s:r20-01d:f": (26, "trapassato: la consigna"),
    # infinitivo compuesto: dopo aver finito (semana 28)
    "s:r20-03b:b": (28, "infinito passato: dopo aver finito"),
    # condizionale passato (semana 31)
    "s:r21-01b:e": (31, "condizionale passato: si sarebbe seccato"),
    "s:r21-03c:d": (31, "condizionale passato: ci avrebbe inviato"),
    "s:r21-04c:c": (31, "condizionale passato: avrebbe sparato"),
    # si impersonale con otro pronombre: lo si beve (semana 36)
    "s:r07-01h:a": (36, "lo si"), "s:r07-01h:b": (36, "la si"), "s:r07-01h:c": (36, "lo si"),
    # passato remoto y trapassato remoto (semana 37)
    "s:r20-01e:b": (37, "passato remoto: ricevette"),
    "s:r20-01f:b": (37, "trapassato remoto: la consigna"), "s:r20-01f:d": (37, "trapassato remoto: la consigna"),
    # discurso indirecto (semana 38)
    "s:r18-01d:a": (38, "discorso indiretto"), "s:r18-01d:b": (38, "discorso indiretto"),
    "s:r18-01d:c": (38, "discorso indiretto"), "s:r18-01d:d": (38, "discorso indiretto"),
    "s:r20-07:a": (38, "discorso indiretto"), "s:r20-07:c": (38, "discorso indiretto"),
    "s:r20-07:e": (38, "discorso indiretto"), "s:r20-01g:c": (38, "discorso indiretto"),
    # participio absoluto (semana 44)
    "s:r20-03b:a": (44, "participio assoluto: appena uscito"),
    "s:r20-03b:d": (44, "participio assoluto: uscita mia moglie"),
})

# Semanas 27-52 (revisión didáctica, segunda pasada).
MIN_WEEK.update({
    # estilo indirecto y directo con desplazamientos de persona, lugar y
    # tiempo (domani → il giorno dopo, da te → da me): semana 38
    "s:r20-07:b": (38, "discorso indiretto"), "s:r20-07:d": (38, "discorso indiretto"),
    "s:r20-01g:a": (38, "discorso indiretto"), "s:r20-01g:b": (38, "discorso indiretto"),
    "s:r20-01g:d": (38, "discorso indiretto"), "s:r20-01g:e": (38, "discorso indiretto"),
    "s:r20-01g:f": (38, "discorso indiretto"),
    "s:r20-02d:a": (38, "discorso indiretto"), "s:r20-02d:b": (38, "discorso indiretto"),
    "s:r20-02d:c": (38, "discorso indiretto"), "s:r20-02d:d": (38, "discorso indiretto"),
    "s:r20-02d:e": (38, "discorso indiretto"),
})


def min_week(item):
    feats = item_features(item)
    if item.get("id") in MIN_WEEK:
        wk, why = MIN_WEEK[item["id"]]
        feats[why] = max(wk, feats.get(why, 0))
    return (max(feats.values()) if feats else 1), feats


def main():
    """Report: what each week receives from earlier weeks, and why."""
    with open(os.path.join(ROOT, "docs", "lang", "it", "data", "course.json"), encoding="utf-8") as fh:
        course = json.load(fh)
    items = {i["id"]: i for i in course["items"]}
    total = 0
    for w in course["weeks"]:
        for iid in w.get("extra", []):
            it = items[iid]
            mw, feats = min_week(it)
            total += 1
            why = ", ".join("%s→%d" % (k, v) for k, v in sorted(feats.items(), key=lambda x: -x[1]))
            print("sem %2d  %-22s %-60s [%s]" % (w["week"], iid, (it.get("stem") or "")[:60], why))
    print("ejercicios que esperan a su teoría: %d" % total)


if __name__ == "__main__":
    main()
