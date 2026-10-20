# -*- coding: utf-8 -*-
"""Italiano: lo que tools/lib/semanas_banco.py necesita para fechar el banco.

- grammar(texto, produce): la semana de la gramática del texto, verbal
  (tools/it/sillabo.py: tiempos, auxiliar + participio, gerundio, ne, cui,
  comparativo…) y no verbal (rasgos(): elisión, preposiciones articuladas,
  posesivos, números, interrogativos, pronombres átonos, piacere, ci,
  negaciones, indefinidos, demostrativos, relativos).
- TAG_WEEK: la semana de cada etiqueta de las oraciones; ERR_CAT_WEEK, la de
  cada categoría de error.  Las semanas son las del programa
  (tools/it/build_course.py, WEEKS).
- el léxico (tools/it/lessico.py) y qué cuenta como nombre propio.
"""
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
if HERE not in sys.path:
    sys.path.insert(0, HERE)

import lessico  # noqa: E402
import sillabo  # noqa: E402

LEVEL_ENDS = (8, 18, 30, 42)       # docs/lang/it/rules.js, banca.levels
LAST_WEEK = 48
UNSEEN_WEEK = 19                   # una palabra que no aparece en ningún lado

# Etiqueta de oración → semana de su teoría.  Las etiquetas generales
# (lessico, connettivi, relativi con «che», ci con «c'è») no mueven nada: de
# eso se ocupan los rasgos.
TAG_WEEK = {
    "essere_avere": 1, "plurali": 2, "articoli": 3, "possessivi": 3,
    "preposizioni_articolate": 3, "accordo": 4, "presente": 5, "gerundio": 6,
    "stare_per": 6, "preposizioni": 9, "da_tempo": 9, "a_personale": 10,
    "pronomi_diretti": 10, "pronomi_indiretti": 10, "passato_prossimo": 11,
    "ausiliare_essere": 11, "participio_accordo": 11, "riflessivi": 12,
    "imperativo": 12, "piacere": 14, "imperfetto": 15, "imperfetto_vs_pp": 15,
    "futuro": 19, "condizionale": 20, "ne": 21, "pronomi_combinati": 22,
    "comparativi": 23, "superlativi": 23, "congiuntivo_presente": 24,
    "congiuntivo_imperfetto": 30, "periodo_ipotetico": 33, "passivo": 35,
    "si_impersonale": 36, "passato_remoto": 37, "discorso_indiretto": 38,
}

# Categoría de error → semana en que se enseña lo que corrige.
ERR_CAT_WEEK = {
    "genere": 2, "plurale": 2, "articolo": 3, "articolo_possessivo": 3,
    "preposizione_articolata": 3, "accordo": 4, "persona_verbale": 5, "irregolare": 6,
    "preposizione": 9, "a_personale": 10, "pronome": 10, "posizione_pronome": 10,
    "ausiliare": 11, "participio_accordo": 11, "tempo_verbale": 11, "piacere": 14,
    "condizionale": 20, "ci_ne": 21, "comparativo": 23, "congiuntivo": 24,
    "periodo_ipotetico": 33,
}

W = {
    "elisione": 3, "preposizione articolata": 3, "possessivo": 3, "quello": 4,
    "numeri": 7, "interrogativo": 8, "pronome atono": 10, "mai": 11,
    "imperativo negativo": 12, "riflessivo": 12, "piacere": 14, "indefinito": 17, "negazione": 18,
    "ci": 21, "relativo": 34,
}

_PREP_ART = re.compile(r"^(?:de|a|da|ne|su)(?:l|llo|lla|i|gli|lle|ll')$|^col$|^coi$")
_POSS = re.compile(r"^(mio|mia|miei|mie|tuo|tua|tuoi|tue|suo|sua|suoi|sue|nostr[oaie]|vostr[oaie])$")
_NUM = re.compile(r"^(due|tre|quattro|cinque|sei|sette|otto|nove|dieci|undici|dodici|tredici|"
                  r"quattordici|quindici|sedici|diciassette|diciotto|diciannove|venti|trenta|quaranta|"
                  r"cinquanta|sessanta|settanta|ottanta|novanta|cento|mille|mila|"
                  r"(?:vent|trent|quarant|cinquant|sessant|settant|ottant|novant|due|tre|quattro|"
                  r"cinque|sei|sette|otto|nove|cento|mille)\w*(?:uno|due|tré|tre|quattro|cinque|sei|"
                  r"sette|otto|nove|dieci|venti|anta|enta|cento|mila))$")
_QUELLO = {"quello", "quella", "quelli", "quelle", "quel", "quei", "quegli", "quell'"}
_INTERR = {"quale", "quali", "qual", "quanto", "quanta", "quanti", "quante", "perché", "chi", "quando"}
_NEG = {"nessuno", "nessuna", "nessun", "niente", "nulla", "neanche", "nemmeno", "neppure", "mica"}
_INDEF = {"qualcuno", "qualcuna", "qualcosa", "ognuno", "ognuna", "chiunque", "qualsiasi", "qualunque",
          "ciascuno", "ciascuna"}
_ATONI = {"lo", "la", "li", "le", "gli", "l'", "mi", "ti", "ci", "vi"}
_PIACERE = ("piacere", "dispiacere", "mancare", "bastare", "servire", "sembrare", "interessare")
_IND = {"mi", "ti", "gli", "le", "ci", "vi"}
# chiamarsi en presente: la fórmula de la semana 1 (mi chiamo, come ti chiami)
_FORMULA = re.compile(r"\b(mi chiamo|ti chiami|si chiama|ci chiamiamo|vi chiamate|si chiamano)\b")


def _lex():
    return sillabo.lexicon()


def _is_verb(tok):
    lex = _lex()
    if tok in sillabo.NOT_VERBS or tok in sillabo.nominal_forms():
        return False
    return bool(lex["simple"].get(tok) or lex["aux"].get(tok) or tok in lex["imperatives"])


def _is_essere(tok):
    return any(a.startswith("essere:") for a in _lex()["aux"].get(tok, []))


# «sei» es «sos» antes que «seis»: número solo delante de lo que se cuenta
_COUNTED = {"anni", "ore", "euro", "mesi", "giorni", "settimane", "volte", "minuti", "persone",
            "figli", "fratelli", "chili", "metri", "chilometri", "e"}


def _lemmas(tok):
    return _lex()["lemmas"].get(tok, [])


def _is_infinitive(tok):
    return tok in _lemmas(tok) and re.search(r"(are|ere|ire|rre)$", tok)


def rasgos(text, produce):
    """{rasgo: semana} de la gramática no verbal del texto."""
    feats = {}

    def need(name):
        feats[name] = W[name]

    low = text.replace("’", "'").lower()
    low_f = _FORMULA.sub(" ", low)
    toks = sillabo.tokens(low_f)
    if "'" in re.sub(r"\bc'(è|era|erano|e)\b", "", low_f):
        need("elisione")
    for i, t in enumerate(toks):
        nxt = toks[i + 1] if i + 1 < len(toks) else ""
        prev = toks[i - 1] if i else ""
        if _PREP_ART.match(t):
            need("preposizione articolata")
        if _POSS.match(t):
            need("possessivo")
        if t in _NEG:
            need("negazione")
        if t in _INDEF:
            need("indefinito")
        if t == "mai":
            need("mai")
        if t in ("cui",) or (t in ("quale", "quali") and prev in ("il", "la", "i", "le", "al", "del", "nel", "sul",
                                                                   "alla", "della", "nella", "dal", "dalla")):
            need("relativo")
        # piacere y su familia con un pronombre indirecto (mi piace, ti manco)
        lem = _lemmas(t)
        if "piacere" in lem and t != "piacere" or "dispiacere" in lem and t != "dispiacere":
            need("piacere")
        elif prev in _IND and any(l in _PIACERE for l in lem):
            need("piacere")
        # ci + verbo que no es essere: ci vado, ci vuole, ci penso
        if t == "ci" and nxt and _is_verb(nxt) and not _is_essere(nxt):
            if any(l.endswith("rsi") for l in _lemmas(nxt)):          # ci alziamo
                pass
            elif nxt.endswith("iamo") and (not prev or prev in ("non", "e", "ma", "allora")) \
                    and not re.search(r"\b(noi )?ci (andiamo|pensiamo|restiamo|torniamo)\b", low_f):
                need("riflessivo")                  # ci vediamo, ci sentiamo: recíproco
            else:
                need("ci")
        if not produce:
            continue
        if _NUM.match(t) and (t != "sei" or nxt in _COUNTED or prev in ("alle", "le", "delle")):
            need("numeri")
        if t in _QUELLO:
            need("quello")
        if t in _INTERR and "?" in low and t != "quando":
            need("interrogativo")
        # pronombre átono delante del verbo: lo vedo, l'ho visto, ti chiamo
        if t in _ATONI and nxt and _is_verb(nxt):
            if t in ("mi", "ti", "ci", "vi") and any(l.endswith("rsi") for l in _lemmas(nxt)):
                need("riflessivo")                         # ci alziamo, vi vedete
            elif t in ("lo", "la", "li", "le", "gli", "l'") or not _is_essere(nxt):
                need("pronome atono")
        # pegado al infinitivo: farlo, vederla, dirgli, chiamarti
        m = re.match(r"^(\w+r)(lo|la|li|le|gli|mi|ti|ci|vi|ne)$", t)
        if m and _is_infinitive(m.group(1) + "e") and t not in sillabo.nominal_forms():
            need("pronome atono")
        # non + infinitivo al principio: el imperativo negativo de tu
        if i == 0 and t == "non" and nxt and (_is_infinitive(nxt) or re.match(r"^\w+r(ti|si|ci|vi)$", nxt)):
            need("imperativo negativo")
    # «mi è sembrato», «ci è mancata»: la familia de piacere en pasado, con el
    # auxiliar entre el pronombre y el participio
    if re.search(r"\b(mi|ti|gli|le|ci|vi) (?:non )?(?:è|sono|era|erano|sarà|sarebbe) (?:già |mai |sempre |molto )?"
                 r"(piaciut|dispiaciut|sembrat|mancat|servit|bastat|interessat)\w", low_f):
        need("piacere")
    # «ci siamo divertiti», «ci siamo dovuti fermare»: con noi el reflexivo en
    # pasado empieza con ci, que sillabo.py no mira (confunde con «ci siamo
    # stati», el ci de lugar).  Si el participio también va con avere, o es de
    # un verbo en -rsi, el essere viene del pronombre: es un reflexivo o
    # recíproco en pasado (semana 16); «ci siamo andati» es el ci de lugar.
    m = re.search(r"\bci (?:siamo|eravamo|saremo|saremmo)\s+(?:già |mai |appena )?(\w+)", low_f)
    pp = m.group(1) if m else ""
    if m and not pp.startswith("stat") and (
            "avere" in _lex()["participles"].get(pp, [])
            or any(l.endswith("rsi") for l in _lemmas(pp))):
        feats["riflessivi passato"] = sillabo.FEATURE_WEEK["riflessivi passato"]
    return feats


def grammar(text, produce=True):
    """Semana de la gramática del texto (verbal y no verbal)."""
    feats = dict(sillabo.analyze(text, answer=produce))
    feats.update({k: v for k, v in rasgos(text, produce).items() if v > feats.get(k, 0)})
    return max(feats.values()) if feats else 1


def features(text, produce=True):
    """Lo mismo, con el detalle: {rasgo: semana}."""
    feats = dict(sillabo.analyze(text, answer=produce))
    feats.update({k: v for k, v in rasgos(text, produce).items() if v > feats.get(k, 0)})
    return feats


NOT_VOCAB = set()


def candidates(tok):
    """Formas castellanas posibles de una palabra italiana (reglas del Ponte)."""
    return lessico._candidates(tok)


def is_name(tok, lm):
    g = lessico.glossary().get(tok)
    return bool(g and g[1] == "N")
